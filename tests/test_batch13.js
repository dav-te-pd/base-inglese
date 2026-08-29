const { launchBrowser, APP_URL } = require('./test-env');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 20); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  // window.__vcNeverResult: true -> onresult is never called at all (true
  // silence, distinct from onresult firing with an empty transcript).
  // window.__vcTranscript: used only when __vcNeverResult is falsy.
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; this._stopped = false; }
    start() {
      this._stopped = false;
      if (window.__vcNeverResult) return; // never fires onresult
      setTimeout(() => {
        if (this._stopped) return;
        if (this.onresult) {
          var text = window.__vcTranscript || '';
          this.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
        }
      }, 5);
    }
    stop() { this._stopped = true; setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { this._stopped = true; if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'speakEasy', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_BEFORE_VP = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng'];

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 6a: silence-cutoff + max-duration params live in APP_CONFIG and the config panel ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.goto(BASE + '?config=1');
    await page.waitForTimeout(200);
    const cfg = await page.evaluate(() => ({
      silence: window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds,
      perWord: window.APP_CONFIG.voiceCoach.maxRecordingMsPerWord,
      margin: window.APP_CONFIG.voiceCoach.maxRecordingMarginMs
    }));
    log('[6a] CONFIG.voiceCoach.silenceTimeoutSeconds exists (default 3)', cfg.silence === 3);
    log('[6a] CONFIG.voiceCoach.maxRecordingMsPerWord exists', typeof cfg.perWord === 'number');
    log('[6a] CONFIG.voiceCoach.maxRecordingMarginMs exists', typeof cfg.margin === 'number');
    await page.$$eval('.config-group', els => els.forEach(el => el.open = true));
    await page.waitForTimeout(50);
    const silenceField = await page.$('[data-config-path="voiceCoach.silenceTimeoutSeconds"]');
    log('[6a] silenceTimeoutSeconds is editable in the config panel', !!silenceField);
    const perWordField = await page.$('[data-config-path="voiceCoach.maxRecordingMsPerWord"]');
    log('[6a] maxRecordingMsPerWord is editable in the config panel', !!perWordField);
    const marginField = await page.$('[data-config-path="voiceCoach.maxRecordingMarginMs"]');
    log('[6a] maxRecordingMarginMs is editable in the config panel', !!marginField);
    log('[6a] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 6b: true silence auto-stops the recording and is NOT sent ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T13Silence', ALL_BEFORE_VP);
    // Shrink the silence timeout for a fast test.
    await page.evaluate(() => { window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.3; });
    await page.evaluate(() => { window.__vcNeverResult = true; });
    await openModule(page, 'voicePractice');
    await page.waitForTimeout(300);

    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(200);
    const stillRecordingBeforeCutoff = await page.evaluate(() => document.getElementById('vc-record-btn').classList.contains('is-recording'));
    log('[6b] Still recording just before the (shrunk) silence timeout fires', stillRecordingBeforeCutoff);

    await page.waitForFunction(() => !document.getElementById('vc-silence-warning').hidden, { timeout: 3000 });
    const warningText = await page.$eval('#vc-silence-warning', el => el.textContent);
    log('[6b] Silence warning appears', warningText.length > 0);
    log('[6b] Warning text mentions the configured seconds (0.3)', warningText.indexOf('0.3') !== -1);
    const recordBtnVisibleAgain = await page.evaluate(() => !document.getElementById('vc-record-btn').hidden && !document.getElementById('vc-record-btn').classList.contains('is-recording'));
    log('[6b] Back to idle: record button visible again, not recording', recordBtnVisibleAgain);
    const confirmAreaHidden = await page.evaluate(() => document.getElementById('vc-confirm-area').hidden);
    log('[6b] Confirm/Send area never opened (recording was discarded, not offered for sending)', confirmAreaHidden);
    const usageAfterDiscard = await page.evaluate((u) => {
      var raw = localStorage.getItem('baseinglese:audioSecondsSent:episode1:' + u);
      return raw ? JSON.parse(raw) : null;
    }, 'T13Silence');
    log('[6b][6c] A silence-discarded recording is never counted in audio-seconds-sent', usageAfterDiscard === null);
    log('[6b] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 6b: voice detected before the silence timeout proceeds normally (no false discard) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T13NoFalseDiscard', ALL_BEFORE_VP);
    await page.evaluate(() => { window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.3; });
    await page.evaluate(() => { window.__vcTranscript = 'hello there'; window.__vcNeverResult = false; });
    await openModule(page, 'voicePractice');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(60); // onresult fires at 5ms, well before the 300ms silence timeout
    await page.evaluate(() => document.getElementById('vc-record-btn').click()); // stop
    await page.waitForTimeout(500); // past where the (now-moot) silence timeout would have fired
    const warningVisible = await page.evaluate(() => !document.getElementById('vc-silence-warning').hidden);
    log('[6b] Recognized speech before the timeout: no silence warning (false-discard guard)', !warningVisible);
    const confirmAreaVisible = await page.evaluate(() => !document.getElementById('vc-confirm-area').hidden);
    log('[6b] Normal pending/confirm flow reached instead', confirmAreaVisible);
    log('[6b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 6c: seconds of audio actually SENT are tracked per module + episode, shown in config panel ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T13Usage', ALL_BEFORE_VP);
    await page.evaluate(() => { window.__vcTranscript = 'hello there'; window.__vcNeverResult = false; });
    await openModule(page, 'voicePractice');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(220); // hold the recording open a measurable amount of time
    await page.evaluate(() => document.getElementById('vc-record-btn').click()); // stop
    await page.waitForTimeout(150);
    await page.click('#vc-send-btn');
    await page.waitForTimeout(150);
    const usage = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:audioSecondsSent:episode1:' + u) || '{}'), 'T13Usage');
    log('[6c] Sending a recording writes a per-module audio-seconds entry', usage.byModule && usage.byModule.voicePractice > 0);
    console.log('    -> voicePractice seconds recorded: ' + (usage.byModule && usage.byModule.voicePractice));

    // Config panel surfaces it read-only.
    await page.evaluate(() => { document.body.focus(); });
    await page.click('body');
    for (const ch of 'config') await page.keyboard.press(ch);
    await page.waitForTimeout(150);
    const panelText = await page.$eval('#config-audio-usage', el => el.textContent);
    log('[6c] Config panel audio-usage section mentions Voice Practice', panelText.indexOf('Voice Practice') !== -1);
    log('[6c] Config panel audio-usage section shows a seconds total', /\d+(\.\d+)?\s*s/.test(panelText));
    log('[6c] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH13 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
