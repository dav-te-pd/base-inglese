const { launchBrowser, APP_URL } = require('./test-env');
const BASE = APP_URL;

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
      }, 5);
    }
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
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

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:voiceCoach:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:quickMatchEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:speedRoundEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:flashcardLevelA:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const BEFORE_VC = ['personalizzazione', 'repeatAloud', 'speakEasy'];
const BEFORE_QM = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng'];
const BEFORE_SR = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'];
const BEFORE_FC = ['personalizzazione', 'repeatAloud', 'speakEasy'];

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ TASK 1: global moduleOrderDefault + config panel reorder ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T1Reorder', []);
    const episodesOverride = await page.evaluate(() => window.APP_CONFIG.episodes.episode1.moduleOrder);
    log('[1] episode1 declares no own moduleOrder (reads the global default)', episodesOverride === undefined);
    const globalOrder = await page.evaluate(() => window.APP_CONFIG.moduleOrderDefault.slice());
    log('[1] moduleOrderDefault exists with personalizzazione first', globalOrder[0] === 'personalizzazione');

    // Open the config panel, find the moduleOrderDefault group, move row 1 down.
    await page.click('body');
    for (const ch of 'config') await page.keyboard.press(ch);
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      var groups = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
      var g = groups.find(function (el) { return el.querySelector('summary').textContent === 'moduleOrderDefault'; });
      if (g) g.open = true;
    });
    const rowCount = await page.$$eval('.config-module-order-row', els => els.length);
    log('[1] Config panel shows one reorder row per module', rowCount === globalOrder.length);
    const firstLabel = await page.$eval('.config-module-order-row:nth-child(1) .config-module-order-label', el => el.textContent);
    log('[1] First row label is Personalizza\'s own label', firstLabel === 'Your Story');
    await page.click('.config-module-order-row:nth-child(1) [data-order-move="down"]');
    await page.waitForTimeout(50);
    const newOrder = await page.evaluate(() => window.APP_CONFIG.moduleOrderDefault.slice());
    log('[1] Clicking "down" swaps the first two entries live in APP_CONFIG', newOrder[0] === globalOrder[1] && newOrder[1] === globalOrder[0]);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}'));
    log('[1] Reorder persists to the config overrides in localStorage', JSON.stringify(stored.moduleOrderDefault) === JSON.stringify(newOrder));
    log('[1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ TASK 3: Quick Match / Speed Round / Flash Card now play Traguardo on completion ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T3QMSound', BEFORE_QM);
    await page.evaluate(toneCapture);
    await openModule(page, 'quickMatchEngIta');
    await page.waitForTimeout(300);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(150);
    // Answer every question correctly by reading the right option from qmCurrentOptions.
    for (let i = 0; i < 200; i++) {
      const state = await page.evaluate(() => ({
        done: document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden,
        quiz: document.getElementById('qm-quiz-screen') && !document.getElementById('qm-quiz-screen').hidden,
        reveal: document.getElementById('qm-reveal') && !document.getElementById('qm-reveal').hidden,
        retryIntro: document.getElementById('qm-retry-intro-screen') && !document.getElementById('qm-retry-intro-screen').hidden,
        popupOpen: document.getElementById('attempt-popup').classList.contains('is-open')
      }));
      if (state.done) break;
      // The safety-valve popup (job 3/4) is a real modal overlay — dismiss
      // it via its own button first, same as a real user would, instead of
      // clicking straight through it (which used to leave it visually
      // "stuck open" since nothing ever called closeAttemptPopup()).
      if (state.popupOpen) { await page.evaluate(() => document.getElementById('attempt-popup-next').click()); await page.waitForTimeout(80); continue; }
      if (state.retryIntro) { await page.evaluate(() => document.getElementById('qm-retry-continue-btn').click()); await page.waitForTimeout(80); continue; }
      if (state.reveal) { await page.evaluate(() => document.getElementById('qm-advance-btn').click()); await page.waitForTimeout(80); continue; }
      if (state.quiz) {
        const clicked = await page.evaluate(() => { var b = document.querySelector('#qm-options [data-qm-index="0"]:not([disabled])'); if (b) { b.click(); return true; } return false; });
        await page.waitForTimeout(clicked ? 120 : 700);
        continue;
      }
      await page.waitForTimeout(80);
    }
    await page.waitForFunction(() => document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden, { timeout: 5000 });
    await page.waitForTimeout(600); // let the 3 async Traguardo notes (setTimeout-staggered) finish
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[3] Quick Match completion now plays the Traguardo sound (3 ascending notes)', traguardoTones.length >= 3);
    const retryIntroHtmlHasClass = await page.evaluate(() => {
      // Even if never shown, verify the shared component actually generated .retry-intro markup.
      return document.getElementById('qm-retry-intro-screen').innerHTML.indexOf('retry-intro') !== -1;
    });
    log('[3] Quick Match retry-intro screen markup comes from the shared renderRetryIntroScreen (.retry-intro class present)', retryIntroHtmlHasClass);
    log('[3] No JS errors on Quick Match completion', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH2b SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
