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
    localStorage.setItem('baseinglese:introDismissed:voiceCoach:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

// Records the current sentence with the given transcript, sends it, and
// returns the evaluated star count.
async function recordAndSend(page, transcript) {
  await page.evaluate((t) => { window.__vcTranscript = t; }, transcript);
  await page.click('#vc-record-btn'); // start recording
  await page.waitForTimeout(60); // fake recognition delivers result -> onend -> 'pending'
  await page.waitForFunction(() => !document.getElementById('vc-confirm-area').hidden, { timeout: 3000 });
  await page.click('#vc-send-btn');
  await page.waitForTimeout(80);
  const stars = await page.$$eval('.vc-star.is-filled', els => els.length);
  return stars;
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(mockInit);
  // voiceCoach (job 5: Voice Check) is now LAST in the order — needs every
  // other module completed first.
  await bootAsUser(page, 'VCTester', ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo', 'speedRoundEngIta', 'speedRoundItaEng']);
  await page.evaluate(toneCapture);
  await page.click('[data-module="voiceCoach"]');
  await page.waitForTimeout(250);

  log('[4a] "Avanti" starts disabled on the first sentence', await page.$eval('#vc-next-btn', el => el.disabled));
  const prevBtnExists = await page.$('#vc-prev-btn');
  log('[4b] "Indietro" button does not exist', prevBtnExists === null);

  // Walk through all 7 lines: d2 gets a deliberately wrong (empty)
  // transcript -> 0 stars -> should get queued for a retry pass. All
  // others get their own exact target text -> full marks.
  let sawRetryQueueEntry = false;
  for (let i = 0; i < 7; i++) {
    const target = await page.$eval('#vc-target', el => el.textContent);
    const isBadOne = target.indexOf('Mondov') !== -1 || target.indexOf(target) !== -1 ? false : false;
    // d2 is the papa line: "Hello, I'm ... . I'm from ... Italy." — force it wrong.
    const forceWrong = target.indexOf("I'm from") !== -1;
    const transcript = forceWrong ? '' : target;
    const stars = await recordAndSend(page, transcript);
    if (forceWrong) {
      log('[4a] Deliberately wrong transcript on "' + target.slice(0, 20) + '..." scores 0 stars', stars === 0);
      sawRetryQueueEntry = true;
    }
    const nextEnabled = await page.$eval('#vc-next-btn', el => !el.disabled);
    log('[4a] "Avanti" becomes enabled right after evaluation (line ' + (i + 1) + ')', nextEnabled);
    await page.click('#vc-next-btn');
    await page.waitForTimeout(100);
  }
  log('[4c] Test actually forced at least one bad-star line', sawRetryQueueEntry);

  // After the 7th line's Avanti, we should be looking at the retryIntro
  // screen (the wrong line queued for a retry pass), not the summary yet.
  const retryIntroVisible = await page.evaluate(() => !document.getElementById('voice-coach-retry-intro-screen').hidden);
  log('[4c] Richiamo: after the main pass, the Schermata Ripasso appears (bad line queued)', retryIntroVisible);
  const retryIntroHasClass = await page.evaluate(() => document.getElementById('voice-coach-retry-intro-screen').innerHTML.indexOf('retry-intro') !== -1);
  log('[4c][3] Voice Coach\'s retry screen uses the shared .retry-intro component', retryIntroHasClass);
  const watchHiddenOnSummaryOnly = await page.evaluate(() => document.getElementById('voice-coach-watch-btn').hidden);
  log('[Regression] Spiegazione still visible during retryIntro (not a final screen)', !watchHiddenOnSummaryOnly);

  await page.click('#voice-coach-retry-continue-btn');
  await page.waitForTimeout(100);
  const nextDisabledOnRetryLine = await page.$eval('#vc-next-btn', el => el.disabled);
  log('[4a] "Avanti" is disabled again on the retried line (must re-record, not just reuse the old attempt)', nextDisabledOnRetryLine);

  // Fix it this time with the correct transcript.
  const retryTarget = await page.$eval('#vc-target', el => el.textContent);
  const starsOnRetry = await recordAndSend(page, retryTarget);
  log('[4c] Re-recording correctly on the retry pass scores well (>=2 stars)', starsOnRetry >= 2);
  await page.click('#vc-next-btn');
  await page.waitForTimeout(150);

  const summaryVisible = await page.evaluate(() => !document.getElementById('voice-coach-summary-screen').hidden);
  log('[4d] Schermata Finale appears once the retry pass is clean', summaryVisible);
  const completeBtnVisible = await page.isVisible('#voice-coach-complete-btn');
  log('[4d] Schermata Finale has the explicit "Ho finito, torna alla mappa" button', completeBtnVisible);
  const watchHiddenOnSummary = await page.evaluate(() => document.getElementById('voice-coach-watch-btn').hidden);
  log('[Rule 10] Spiegazione hidden on the evaluative Schermata Finale', watchHiddenOnSummary);

  await page.waitForTimeout(500); // let async Traguardo notes finish
  const tones = await page.evaluate(() => window.__playedTones || []);
  const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
  log('[4d] Traguardo sound played on Voice Coach\'s Schermata Finale', traguardoTones.length >= 3);

  const completedBeforeClick = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'VCTester');
  log('[4d] Module NOT marked completed until the explicit button is clicked', completedBeforeClick.indexOf('voiceCoach') === -1);
  await page.click('#voice-coach-complete-btn');
  await page.waitForTimeout(150);
  const completedAfterClick = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'VCTester');
  log('[4d] Clicking it marks voiceCoach completed and returns to the map', completedAfterClick.indexOf('voiceCoach') !== -1);

  log('No JS errors across the whole Voice Coach flow', errors.length === 0);
  if (errors.length) console.log('ERRORS:', errors);

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== VOICE COACH SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
