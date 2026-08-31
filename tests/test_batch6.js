const { launchBrowser, APP_URL } = require('./test-env');
const { allSteps } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__speakLog = [];
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      window.__speakLog.push(utter.text);
      if (utter.onstart) utter.onstart();
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 30);
    },
    cancel() {
      if (this._current) {
        var u = this._current; this.speaking = false; this._current = null;
        clearTimeout(u._timer);
        setTimeout(() => { if (u.onerror) u.onerror(); }, 5);
      }
    },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  // Controllable via window.__vcTranscript: '' means "no words recognized"
  // (job 6), any other string means recognized (right or wrong).
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

async function bootAsUser(page, userName, completedModules, extraStorage) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules, extraStorage }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio','personalizzazione','repeatAloud','meetTheStory', 'whyWeSayIt','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
    if (extraStorage) Object.keys(extraStorage).forEach(k => localStorage.setItem(k, extraStorage[k]));
  }, { userName, completedModules, extraStorage });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_MODULES = allSteps();

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 6: mic-trouble progressive notice in Voice Coach ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T6Mic', ALL_MODULES.slice(0, idx));
    await page.evaluate(() => { window.__vcTranscript = ''; }); // always empty recognition
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);

    // vc-record-btn is a toggle: click once to start, click again to stop
    // (only the second click fires vcRecognition.stop() -> onend -> the
    // app reaches 'pending' with the transcript available to send). The
    // second click happens while .record-toggle-btn.is-recording's
    // looping pulse animation is active, which hangs Playwright's native
    // click (never "stable") — dispatch directly instead, as elsewhere
    // in this suite.
    async function recordOnce() {
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(60); // FakeRecognition onresult fires at 5ms
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(150); // onend -> 'pending'
    }

    // Job 3's safety-valve popup can also open (attemptsReminderThreshold=3)
    // while this test is driving repeated attempts — dismiss it via "Vai
    // avanti" so it doesn't block subsequent clicks in this same test flow.
    async function dismissAttemptPopupIfOpen() {
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) {
        await page.click('#attempt-popup-next');
        await page.waitForTimeout(80);
      }
    }

    // Split so a caller can inspect #vc-mic-notice right after evaluate,
    // BEFORE dismissing any concurrently-triggered Job 3 valve popup —
    // dismissing it calls vcNextLine(), which hides #vc-result (the mic
    // notice's own parent) as it moves to the next line.
    async function recordAndSendNoDismiss() {
      await recordOnce();
      await page.click('#vc-send-btn').catch(() => {});
      await page.waitForTimeout(100);
    }

    async function recordAndSend() {
      await recordAndSendNoDismiss();
      await dismissAttemptPopupIfOpen();
    }

    // Voice Check (this module's variant) has NO retry button (job 5) — a
    // single recording per phrase. To keep re-recording (empty transcript
    // each time) for this streak test, advance to the next line via
    // "Avanti" instead of retrying the same one; vcEmptyRecognitionStreak
    // is a running counter independent of which line is being recorded.
    async function backToRecording() {
      await dismissAttemptPopupIfOpen();
      await page.click('#vc-next-btn').catch(() => {});
      await page.waitForTimeout(80);
      await dismissAttemptPopupIfOpen();
      // The main pass has few lines — this test's steady stream of
      // Avanti clicks can exhaust it and land on the Schermata Ripasso
      // (retryIntro) instead of a fresh line; click through it (its own
      // continue button, unrelated to Voice Check's removed Riprova) so
      // the next recordAndSend() lands on a live, recordable line again.
      const onRetryIntro = await page.evaluate(() => !document.getElementById('voice-coach-retry-intro-screen').hidden);
      if (onRetryIntro) {
        await page.click('#voice-coach-retry-continue-btn').catch(() => {});
        await page.waitForTimeout(80);
      }
    }

    // Attempt 1: no notice yet
    await recordAndSend();
    let noticeHidden = await page.isHidden('#vc-mic-notice').catch(() => null);
    log('[Job6] Attempt 1 evaluated empty: still no notice (streak=1 < warningAt=2)', noticeHidden === true);

    // Attempt 2: record + send again -> streak=2 -> warning level
    await backToRecording();
    await recordAndSend();
    noticeHidden = await page.isHidden('#vc-mic-notice').catch(() => null);
    const noticeTitle2 = await page.$eval('#vc-mic-notice-title', el => el.textContent).catch(() => null);
    log('[Job6] Attempt 2 empty: notice IS shown (streak=2 >= warningAt=2)', noticeHidden === false);
    log('[Job6] Attempt 2: no action button yet (level 1)', (await page.$eval('#vc-mic-notice-actions', el => el.innerHTML.trim())) === '');
    console.log('    -> title: "' + noticeTitle2 + '"');

    // Attempts 3-4: streak reaches restartSuggestionAt=4
    for (let i = 0; i < 2; i++) {
      await backToRecording();
      await recordAndSend();
    }
    const restartBtnVisible = await page.isVisible('#vc-mic-notice-restart').catch(() => false);
    log('[Job6] Streak=4: "Ricomincia esercizio" button appears (restartSuggestionAt)', restartBtnVisible);

    // Now a RECOGNIZED (even if wrong) attempt should reset the streak —
    // checked here, BEFORE confirmedAt (level 3) locks the module: once
    // truly confirmed, Voice Check's record button is hidden (state
    // 'result') and "Avanti" is blocked too (vcNextLine's own guard), so
    // there is no in-place way back — the escalation is deliberately a
    // one-way door past that point, "Torna alla mappa" its only exit.
    await page.evaluate(() => { window.__vcTranscript = 'some wrong words'; });
    await backToRecording();
    await recordAndSend();
    const noticeHiddenAfterReset = await page.isHidden('#vc-mic-notice').catch(() => null);
    log('[Job6] A recognized (even if wrong) attempt resets the streak -> notice hides', noticeHiddenAfterReset === true);

    // Attempts back to empty transcript, driving the streak past
    // confirmedAt=6 this time.
    await page.evaluate(() => { window.__vcTranscript = ''; });
    for (let i = 0; i < 5; i++) {
      await backToRecording();
      await recordAndSend();
    }
    await backToRecording();
    await recordAndSendNoDismiss(); // check before any concurrent valve-popup dismiss navigates away
    const mapBtnVisible = await page.isVisible('#vc-mic-notice-map').catch(() => false);
    log('[Job6] Streak=6: "Torna alla mappa" button appears (confirmedAt)', mapBtnVisible);
    const panelClass = await page.$eval('#vc-mic-notice', el => el.className);
    log('[Job6] Notice panel uses .danger-panel-notice (not plain .danger-panel red)', panelClass.indexOf('danger-panel-notice') !== -1);
    await dismissAttemptPopupIfOpen();

    // Job 5 consequence: once confirmed (level 3), Voice Check offers NO
    // in-place recovery — record button hidden (state stays 'result'),
    // "Avanti" guarded off by vcMicConfirmedProblem itself.
    const recordBtnHiddenAtLock = await page.$eval('#vc-record-btn', el => el.hidden).catch(() => null);
    log('[Job6][Job5] Confirmed lock: record button stays hidden (no same-line recovery for Voice Check)', recordBtnHiddenAtLock === true);
    const nextBtnDisabledAtLock = await page.$eval('#vc-next-btn', el => el.disabled).catch(() => null);
    log('[Job6][Job5] Confirmed lock: "Avanti" stays disabled ("Torna alla mappa" is the only way out)', nextBtnDisabledAtLock === true);

    log('[Job6] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 6: wrong-but-recognized words never count as mic trouble ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T6MicWrong', ALL_MODULES.slice(0, idx));
    await page.evaluate(() => { window.__vcTranscript = 'completely wrong words here'; });
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    for (let i = 0; i < 6; i++) {
      // vc-record-btn is a toggle: start, then stop (dispatched directly —
      // the pulsing .is-recording animation hangs a native click).
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(60);
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(150);
      await page.click('#vc-send-btn').catch(() => {});
      await page.waitForTimeout(100);
      const popupOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (popupOpen) { await page.click('#attempt-popup-next'); await page.waitForTimeout(80); }
      // Voice Check has no retry button (job 5) — advance via "Avanti" instead.
      await page.click('#vc-next-btn').catch(() => {});
      await page.waitForTimeout(80);
    }
    const noticeHidden = await page.isHidden('#vc-mic-notice').catch(() => null);
    log('[Job6] 6 wrong-but-recognized attempts never trigger the mic notice', noticeHidden === true);
    log('[Job6b] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH6 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
