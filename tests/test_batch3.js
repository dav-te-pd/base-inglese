const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

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
    localStorage.setItem('baseinglese:introDismissed:quickMatchEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:speedRoundEngIta:' + userName, '1');
    if (extraStorage) Object.keys(extraStorage).forEach(k => localStorage.setItem(k, extraStorage[k]));
  }, { userName, completedModules, extraStorage });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const ALL_BEFORE_SR = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'];

  // ============ 1: config panel via ?config query param ============
  {
    const context = await browser.newContext({ viewport: { width: 400, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.goto(BASE + '?config');
    await page.waitForTimeout(200);
    const opened = await page.evaluate(() => document.getElementById('config-panel-overlay').classList.contains('is-open'));
    log('[1] ?config query param opens the config panel at boot', opened);
    log('[1] No JS errors', errors.length === 0);
    await context.close();
  }
  {
    const context = await browser.newContext({ viewport: { width: 400, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    await page.waitForTimeout(150);
    const notOpened = await page.evaluate(() => !document.getElementById('config-panel-overlay').classList.contains('is-open'));
    log('[1] Without ?config, the panel stays closed at boot', notOpened);
    await context.close();
  }

  // ============ 2: two-row Spiegazione title, no em dash ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T2Title', []);
    await openModule(page, 'personalizzazione');
    await page.waitForTimeout(200);
    // Intro screen may or may not show depending on isIntroDismissed; force it visible via howItWorks popup instead, guaranteed reachable.
    await page.click('#customize-watch-btn');
    await page.waitForTimeout(250);
    const kicker = await page.$eval('#howitworks-overlay-title .spiegazione-title-kicker', el => el.textContent).catch(() => null);
    const name = await page.$eval('#howitworks-overlay-title .spiegazione-title-name', el => el.textContent).catch(() => null);
    log('[2] Popup title row 1 is the fixed "Spiegazione" kicker', kicker === 'Spiegazione');
    log('[2] Popup title row 2 is the module name ("Your Story")', name === 'Your Story');
    const fullText = await page.$eval('#howitworks-overlay-title', el => el.textContent);
    log('[2] No em dash left in the title', fullText.indexOf('—') === -1);
    log('[2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ 3: moduleTypes categories + Personalizzazione's own label ============
  // Job (later turn): six category labels replaced the old four — "Studio
  // libero"/"Quiz con ripasso"/"Studio a tempo"/"Quiz a tempo" are gone;
  // this section now checks the CURRENT six (Inizio/Studio/Studia il
  // dialogo/Quiz/Verifica finale/Fine).
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T3Types', []);
    const personalizzaLabel = await page.$eval('[data-module="personalizzazione"] .module-row-type', el => el.textContent);
    log('[3] Personalizzazione shows its own type label, not "Studio"', personalizzaLabel === 'Inizio');
    const moduleTypesCfg = await page.evaluate(() => window.APP_CONFIG.moduleTypes.studiaDialogo && window.APP_CONFIG.moduleTypes.studiaDialogo.label);
    log('[3] CONFIG.moduleTypes.studiaDialogo exists with label "Studia il dialogo"', moduleTypesCfg === 'Studia il dialogo');
    log('[3] No JS errors', errors.length === 0);
    await page.close();
  }
  {
    // Check speedRound/dialogo module rows show their current category once reachable.
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T3Types2', ALL_BEFORE_SR);
    const srTypeLabel = await page.$eval('[data-module="speedRoundEngIta"] .module-row-type', el => el.textContent);
    log('[3] Speed Round shows "Quiz"', srTypeLabel === 'Quiz');
    // All three Dialogo modules now share "Studia il dialogo" (six-label
    // job) — none of the 3 Dialogo modules is actually evaluated by the
    // system.
    const dgContinuoLabel = await page.$eval('[data-module="dialogoContinuo"] .module-row-type', el => el.textContent);
    log('[3] Dialogo Continuo shows "Studia il dialogo"', dgContinuoLabel === 'Studia il dialogo');
    const dgAscoltaLabel = await page.$eval('[data-module="dialogoAscoltaRipeti"] .module-row-type', el => el.textContent);
    log('[3] Dialogo Ascolta e Ripeti also shows "Studia il dialogo"', dgAscoltaLabel === 'Studia il dialogo');
    await page.close();
  }

  // ============ 4a: no "video" phrase anywhere in howItWorks bodies ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    const hasVideoPhrase = await page.evaluate(() => {
      var text = JSON.stringify(window.FALLBACK_MODULE_INSTRUCTIONS);
      return text.indexOf('Qui vedrai un video') !== -1;
    });
    log('[4a] No howItWorks body mentions the (non-existent) video anymore', !hasVideoPhrase);
    await page.close();
  }

  // ============ 4b/4c: written-practice tip present, in the right direction ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    const flags = await page.evaluate(() => {
      var d = window.FALLBACK_MODULE_INSTRUCTIONS;
      return {
        repeatAloudWrite: d.repeatAloud.howItWorks.body.indexOf('carta e penna') !== -1,
        speedRoundNoWrite: d.speedRoundEngIta.howItWorks.body.indexOf('non serve scrivere') !== -1,
        voiceCoachNoWrite: d.voiceCoach.howItWorks.body.indexOf('non serve scrivere') !== -1,
        dialogoContinuoNoWrite: d.dialogoContinuo.howItWorks.body.indexOf('non serve scrivere') !== -1,
        dialogoAscoltaWrite: d.dialogoAscoltaRipeti.howItWorks.body.indexOf('carta e penna') !== -1,
        speedRoundNoCartaPenna: d.speedRoundEngIta.howItWorks.body.indexOf('carta e penna') === -1
      };
    });
    log('[4b] repeatAloud gets the "carta e penna" tip', flags.repeatAloudWrite);
    log('[4b] dialogoAscoltaRipeti gets the "carta e penna" tip', flags.dialogoAscoltaWrite);
    log('[4c] speedRound gets the "non serve scrivere" tip', flags.speedRoundNoWrite);
    log('[4c] speedRound does NOT also get the "carta e penna" tip', flags.speedRoundNoCartaPenna);
    log('[4c] voiceCoach gets the "non serve scrivere" tip', flags.voiceCoachNoWrite);
    log('[4c] dialogoContinuo gets the "non serve scrivere" tip', flags.dialogoContinuoNoWrite);
    await page.close();
  }

  // ============ 4d: dialogoContinuo opening rewritten ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    const body = await page.evaluate(() => window.FALLBACK_MODULE_INSTRUCTIONS.dialogoContinuo.howItWorks.body);
    log('[4d] dialogoContinuo no longer says the confusing "ultimo passaggio" line', body.indexOf("è l'ultimo passaggio sul dialogo") === -1);
    log('[4d] dialogoContinuo now explains it\'s the "prova generale"', body.indexOf('prova generale') !== -1);
    await page.close();
  }

  // ============ 4e: softened retry-intro copy (no "finché non...") ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T4eRetry', ALL_BEFORE_SR);
    await openModule(page, 'quickMatchEngIta');
    await page.waitForTimeout(200);
    const retryHtml = await page.evaluate(() => document.getElementById('qm-retry-intro-screen').innerHTML);
    log('[4e] Quick Match retry-intro text drops "finché non..."', retryHtml.indexOf('finché non') === -1);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH3a SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
