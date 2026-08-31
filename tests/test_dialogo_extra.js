const { launchBrowser, APP_URL } = require('./test-env');
const { gradeOf, stepsBefore } = require('./module-order');
const { loadGrade } = require('./quiz-driver');
const BASE = APP_URL;

// Gli id delle battute vengono dai dati, non scritti a mano: erano fissati a
// "d1"/"d2" e si sono rotti tutti insieme appena il file episodio è passato
// alla struttura a gradi. Il primo e il secondo elemento del grado D sono
// quello che a questi test serve davvero.
const BATTUTE = loadGrade('D');
const D1 = BATTUTE[0].id;
const D2 = BATTUTE[1].id;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 25); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:episode1:customizeSeen:' + userName, '1');
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Countdown sound: fires once, at bar end, correct freq/volume, no ticking ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'CountdownSoundTester', stepsBefore('dialogoRipetiATempo'));
    await page.evaluate(() => {
      window.APP_CONFIG.dialogo.pausaBase = 200;
      window.APP_CONFIG.dialogo.pausaPerParola = 10;
      window.APP_CONFIG.dialogo.pausaMassima = 500;
    });
    // Capture oscillator frequencies + gain values played.
    await page.evaluate(() => {
      const OrigAC = window.AudioContext || window.webkitAudioContext;
      if (!OrigAC) { window.__noAudioCtx = true; return; }
      window.__playedTones = [];
      const OrigCreateOscillator = OrigAC.prototype.createOscillator;
      const OrigCreateGain = OrigAC.prototype.createGain;
      OrigAC.prototype.createOscillator = function () {
        const osc = OrigCreateOscillator.call(this);
        let freq = null;
        Object.defineProperty(osc.frequency, 'value', {
          set(v) { freq = v; },
          get() { return freq; }
        });
        osc.__getFreq = () => freq;
        window.__pendingOsc = osc;
        return osc;
      };
      OrigAC.prototype.createGain = function () {
        const gain = OrigCreateGain.call(this);
        const origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
        gain.gain.setValueAtTime = function (v, t) {
          if (window.__pendingOsc) {
            window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v, t: performance.now() });
          }
          return origSetValueAtTime(v, t);
        };
        return gain;
      };
    });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForTimeout(40); // audio ends, bar starts (fast config)
    const tonesBeforeBarEnds = await page.evaluate(() => window.__playedTones.length);
    // d1 = 10 words -> pausaBase(200) + 10*pausaPerParola(10) = 300ms bar.
    await page.waitForFunction(() => window.__playedTones && window.__playedTones.length > 0, { timeout: 3000 });
    const tones = await page.evaluate(() => window.__playedTones);
    console.log('    DEBUG tones:', JSON.stringify(tones));
    const countdownTones = tones.filter(t => t.freq === 660);
    log('Countdown tone (660Hz) plays exactly once when the bar ends', countdownTones.length === 1);
    log('Countdown tone volume (0.08) is lower than Corretto/Sbagliato default (0.15)', countdownTones.length === 1 && countdownTones[0].volume === 0.08);
    log('No ticking during the bar itself (nothing played before it finished)', tonesBeforeBarEnds === 0);
    log('No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Regression: mod1 (Ascolta e Ripeti) still works after dgLockAll/dgPlayLine unification ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Mod1Regression', stepsBefore('dialogoAscoltaRipeti'));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const watchVisible = await page.isVisible('#dialogo-watch-btn');
    const helpVisible = await page.isVisible('#dialogo-help-btn');
    log('[Regression] Mod1 still shows full header (Mappa/Spiegazione/Help)', watchVisible && helpVisible);
    const toolbarVisible = await page.evaluate(() => !document.getElementById('dg-toolbar').hidden);
    const toggleExists = await page.evaluate(() => !!document.getElementById('dg-translations-toggle'));
    log('[Regression] Mod1 still shows the translations toggle', toolbarVisible && toggleExists);
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForTimeout(10);
    const midAudio = await page.evaluate(([id1, id2]) => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="' + id1 + '"]');
      var b2 = document.querySelector('.dg-bubble[data-line-id="' + id2 + '"]');
      return { b1Active: b1.classList.contains('is-active'), b2Locked: b2.classList.contains('is-locked') };
    }, [D1, D2]);
    // Correction (5th collaudo): Ascolta e Ripeti has no countdown to
    // desync, and its own instructions promise free tapping in any order
    // — dgLockAll no longer locks OTHER bubbles for this profile (only
    // Ripeti a Tempo/Continuo still do). b1 still lifts (is-active).
    log('[Regression] Mod1 lifts the playing bubble but no longer locks others (free-tap profile)', midAudio.b1Active && !midAudio.b2Locked);
    await page.waitForTimeout(60);
    const afterAudio = await page.evaluate((id1) => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="' + id1 + '"]');
      var check = document.getElementById('dg-heard-' + id1);
      return { b1Active: b1.classList.contains('is-active'), b1Timer: b1.classList.contains('dg-bubble-timer'), checkVisible: check && !check.hidden };
    }, D1);
    log('[Regression] Mod1 unlocks right after audio (no countdown bar, countdown:false)', !afterAudio.b1Active && !afterAudio.b1Timer);
    log('[Regression] Mod1 checkmark still appears', afterAudio.checkVisible);
    await page.click('#dg-translations-toggle');
    await page.waitForTimeout(50);
    // Quante sono le battute lo dice il grado che il modulo legge, non un
    // numero scritto qui: il dialogo e' passato da 7 a 12 battute.
    const quante = loadGrade(gradeOf('dialogoAscoltaRipeti')).length;
    const translationsShown = await page.$$eval('.dg-translation', (els, n) => els.length === n && els.every(e => !e.hidden), quante);
    log('[Regression] Mod1 translations toggle rivela tutte le ' + quante + ' traduzioni', translationsShown);
    log('[Regression] No JS errors on Mod1', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

run().catch(e => { console.error(e); process.exit(1); });
