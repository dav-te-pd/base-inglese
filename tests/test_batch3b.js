const { launchBrowser, APP_URL } = require('./test-env');
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
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 20); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {
      setTimeout(() => {
        if (this.onresult) {
          var text = window.__vcTranscript || '';
          this.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
        }
        if (this.onend) this.onend();
      }, 15);
    }
    stop() {}
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

const toneCapture = () => {
  const OrigAC = window.AudioContext || window.webkitAudioContext;
  if (!OrigAC) { window.__noAudioCtx = true; return; }
  window.__playedTones = [];
  const OrigCreateOscillator = OrigAC.prototype.createOscillator;
  const OrigCreateGain = OrigAC.prototype.createGain;
  OrigAC.prototype.createOscillator = function () {
    const osc = OrigCreateOscillator.call(this);
    let freq = null;
    Object.defineProperty(osc.frequency, 'value', { set(v) { freq = v; }, get() { return freq; } });
    osc.__getFreq = () => freq;
    window.__pendingOsc = osc;
    return osc;
  };
  OrigAC.prototype.createGain = function () {
    const gain = OrigCreateGain.call(this);
    const origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
    gain.gain.setValueAtTime = function (v, t) {
      if (window.__pendingOsc) window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v });
      return origSetValueAtTime(v, t);
    };
    return gain;
  };
};

async function bootAsUser(page, userName, completedModules, extraStorage) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules, extraStorage }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:voiceCoach:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:speedRoundEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:dialogoAscoltaRipeti:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:dialogoRipetiATempo:' + userName, '1');
    if (extraStorage) Object.keys(extraStorage).forEach(k => localStorage.setItem(k, extraStorage[k]));
  }, { userName, completedModules, extraStorage });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_BEFORE_SR = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'];
// voiceCoach (job 5: Voice Check) is now LAST in the order — needs every
// other module completed first.
const ALL_BEFORE_VC = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo', 'speedRoundEngIta', 'speedRoundItaEng'];

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ 5: danger panel design + text content ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T5Danger', ['personalizzazione', 'repeatAloud']);
    await openModule(page, 'personalizzazione');
    await page.waitForTimeout(200);
    const hasDangerPanel = await page.isVisible('.danger-panel');
    log('[5] Warning uses the dedicated .danger-panel (not the plain .overlay-text)', hasDangerPanel);
    const hasIcon = await page.$eval('.danger-panel-icon svg', el => !!el).catch(() => false);
    log('[5] Danger panel shows a warning icon', hasIcon);
    const borderWidth = await page.$eval('.danger-panel', el => getComputedStyle(el).borderWidth);
    log('[5] Danger panel has a thick border (>=3px)', parseInt(borderWidth) >= 3);
    const bodyText = await page.$eval('#customize-warning-body', el => el.textContent);
    log('[5] Warning text avoids "colori"', bodyText.indexOf('colori') === -1);
    log('[5] Warning text avoids "mastery"', bodyText.toLowerCase().indexOf('mastery') === -1);
    log('[5] Warning text talks about progressi/esercizi', bodyText.indexOf('progressi') !== -1 && bodyText.indexOf('esercizi') !== -1);
    log('[5] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ 6: Voice Coach "Mostra pronuncia" ============
  {
    // No pronunciationTip in the data today -> button must be absent for every line.
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T6NoData', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    const toggleHidden = await page.$eval('#vc-pronunciation-toggle', el => el.hidden);
    log('[6] "Mostra pronuncia" is hidden when the line has no pronunciationTip', toggleHidden);
    log('[6] No JS errors', errors.length === 0);
    await page.close();
  }
  {
    // Serve a modified copy of the real episode JSON (with a pronunciationTip
    // added to the first dialogue line) so the app's own fetch() picks it up
    // instead of the on-disk file — real fetch succeeds over http, so
    // patching window.FALLBACK_EPISODE_DATA alone (the fetch-failure
    // fallback) has no effect.
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.route('**/data/a1-episodio1-inglese.json', async (route) => {
      const res = await route.fetch();
      const json = await res.json();
      json.levels.D.items[0].pronunciationTip = 'hel-LOU EV-ri-uan';
      await route.fulfill({ response: res, json });
    });
    await bootAsUser(page, 'T6WithData', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    const toggleVisible = await page.$eval('#vc-pronunciation-toggle', el => !el.hidden);
    log('[6] "Mostra pronuncia" appears when the line HAS a pronunciationTip', toggleVisible);
    const textHiddenByDefault = await page.$eval('#vc-pronunciation', el => el.hidden);
    log('[6] Pronunciation text is hidden by default', textHiddenByDefault);
    await page.click('#vc-pronunciation-toggle');
    await page.waitForTimeout(80);
    const revealed = await page.$eval('#vc-pronunciation', el => !el.hidden && el.textContent);
    log('[6] Clicking reveals the transcription text', revealed === 'hel-LOU EV-ri-uan');
    const btnLabel = await page.$eval('#vc-pronunciation-toggle', el => el.textContent);
    log('[6] Button label flips to "Nascondi pronuncia"', btnLabel === 'Nascondi pronuncia');
    log('[6] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ 7: Dialogo choice box gated until all lines heard ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T7Gate', ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice']);
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const disabledAtStart = await page.$eval('#dg-know-it-btn', el => el.disabled);
    log('[7] "Sì, lo so" starts disabled before any line is heard (Ascolta e Ripeti)', disabledAtStart);
    // Play just the first line.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForTimeout(80);
    const stillDisabledAfterOne = await page.$eval('#dg-know-it-btn', el => el.disabled);
    log('[7] Still disabled after hearing only ONE of several lines', stillDisabledAfterOne);
    // Play every remaining line.
    const lineIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    for (const id of lineIds) {
      await page.click('.dg-bubble[data-line-id="' + id + '"]');
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(100);
    const enabledAtEnd = await page.$eval('#dg-know-it-btn', el => !el.disabled);
    log('[7] Enabled once every line has been heard at least once', enabledAtEnd);
    log('[7] No JS errors', errors.length === 0);
    await page.close();
  }
  {
    // Same check for Ripeti a Tempo (timed profile).
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.evaluate; // noop just to keep structure consistent
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T7GateTimed', ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti']);
    await page.evaluate(() => {
      window.APP_CONFIG.dialogo.pausaBase = 150;
      window.APP_CONFIG.dialogo.pausaPerParola = 5;
      window.APP_CONFIG.dialogo.pausaMassima = 400;
    });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const disabledAtStart = await page.$eval('#dg-know-it-btn', el => el.disabled);
    log('[7] Ripeti a Tempo: "Sai ripetere le frasi?" starts disabled too', disabledAtStart);
    log('[7] No JS errors on Ripeti a Tempo', errors.length === 0);
    await page.close();
  }

  // ============ 9: 3-2-1 sound raised + third note higher ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T9Sound', ALL_BEFORE_SR);
    await page.evaluate(() => { window.APP_CONFIG.speedRound.countdownStepMs = 60; });
    await page.evaluate(toneCapture);
    await openModule(page, 'speedRoundEngIta');
    await page.waitForTimeout(400);
    await page.click('#sr-ready-btn');
    await page.waitForFunction(() => window.__playedTones && window.__playedTones.length >= 3, { timeout: 3000 });
    const tones = await page.evaluate(() => window.__playedTones);
    const readyTones = tones.filter(t => t.freq === 1568 || t.freq === 1976);
    log('[9] 3-2-1 uses the new higher frequencies (1568/1976)', readyTones.length === 3);
    log('[9] Last tick is the higher one (1976), first two are 1568', readyTones.length === 3 && readyTones[0].freq === 1568 && readyTones[1].freq === 1568 && readyTones[2].freq === 1976);
    const stillLow = tones.filter(t => t.freq === 440 || t.freq === 523);
    log('[9] Old low frequencies (440/523) no longer used', stillLow.length === 0);
    log('[9] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH3b SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
