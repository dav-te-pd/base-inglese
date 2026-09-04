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

// Un mock in cui cancel() FA quello che fa un motore vero: chiude
// l'utterance in corso e ne chiama onend, in modo asincrono (CLAUDE.md
// regola 19 — un mock che finisce all'istante nasconde proprio i bug che
// dipendono dall'ordine degli eventi). Serve ai due test qui sotto, dove
// tutto il punto è cosa succede quando l'audio viene interrotto.
const mockConCancelVero = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speaking: false, _current: null, _t: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      if (utter.onstart) utter.onstart();
      this._t = setTimeout(() => this._finish(utter), 400);
    },
    _finish(utter) {
      if (this._current !== utter) return;
      clearTimeout(this._t);
      this.speaking = false; this._current = null;
      if (utter.onend) utter.onend();
    },
    cancel() { const u = this._current; if (u) setTimeout(() => this._finish(u), 0); },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

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

  // ============ Chi risponde al tocco durante l'audio (Ripeti a Tempo) ============
  {
    // Prima era invertito: un tocco a vuoto sullo schermo interrompeva
    // l'audio e faceva partire il countdown in anticipo, mentre toccare la
    // battuta — il gesto con un significato — non faceva niente.
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockConCancelVero);
    await bootAsUser(page, 'TapTester', stepsBefore('dialogoRipetiATempo'));
    await openModule(page, 'dialogoRipetiATempo');
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);

    // Parte l'audio della prima battuta, poi si tocca lo SFONDO.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForFunction(() => window.speechSynthesis.speaking === true, null, { timeout: 5000 });
    await page.click('#dg-list', { position: { x: 2, y: 2 } });
    await page.waitForTimeout(120);
    const dopoSfondo = await page.evaluate(id => ({
      parla: window.speechSynthesis.speaking,
      barra: !!document.querySelector('.dg-bubble[data-line-id="' + id + '"]').classList.contains('dg-bubble-timer')
    }), D1);
    log('[Tocco] Un tocco a vuoto NON interrompe l\'audio', dopoSfondo.parla === true);
    log('[Tocco] Un tocco a vuoto NON fa partire il countdown', dopoSfondo.barra === false);

    // Ora si tocca la battuta che sta parlando: l'audio salta e parte la barra.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('dg-bubble-timer');
    }, D1, { timeout: 5000 });
    const dopoBattuta = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Tocco] Toccare la battuta in corso salta l\'audio', dopoBattuta === false);
    log('[Tocco] Toccare la battuta in corso fa partire il countdown', true);
    log('[Tocco] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ La barra del tempo si tocca per andare avanti (Dialogo Continuo) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockConCancelVero);
    await bootAsUser(page, 'BarraTester', stepsBefore('dialogoContinuo'));
    await openModule(page, 'dialogoContinuo');
    await page.evaluate(() => {
      // Barra lunga: senza, finirebbe da sola prima che il test la tocchi.
      window.APP_CONFIG.dialogo.pausaBase = 30000;
      window.APP_CONFIG.dialogo.pausaPerParola = 0;
      window.APP_CONFIG.dialogo.pausaMassima = 30000;
      window.APP_CONFIG.dialogo.countdownStepMs = 10;
    });
    // Dialogo Continuo apre con "Pronto? Via!" sullo stesso pulsante di
    // avvio degli altri profili, poi il 3-2-1 parte da solo.
    await page.click('#dg-start-btn');
    // Il 3-2-1, poi l'audio della prima battuta, poi la sua barra.
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('dg-bubble-timer');
    }, D1, { timeout: 15000 });

    await page.click('.dg-bubble[data-line-id="' + D1 + '"] .dg-line-timer');
    // Toccata la barra, si deve sentire la battuta SUCCESSIVA.
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('is-active');
    }, D2, { timeout: 5000 });
    const stato = await page.evaluate(a => ({
      barraPrima: document.querySelector('.dg-bubble[data-line-id="' + a.d1 + '"]').classList.contains('dg-bubble-timer'),
      attivaDopo: document.querySelector('.dg-bubble[data-line-id="' + a.d2 + '"]').classList.contains('is-active')
    }), { d1: D1, d2: D2 });
    log('[Barra] Toccare la barra chiude il countdown della battuta corrente', stato.barraPrima === false);
    log('[Barra] Toccare la barra porta alla battuta successiva', stato.attivaDopo === true);
    log('[Barra] Nessun errore JS', errors.length === 0);
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
