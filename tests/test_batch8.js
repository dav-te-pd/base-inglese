const { launchBrowser, APP_URL } = require('./test-env');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking=true; this._current=utter; if(utter.onstart) utter.onstart(); utter._timer=setTimeout(()=>{ if(this._current===utter){this.speaking=false;this._current=null;} if(utter.onend) utter.onend(); },20); },
    cancel() { if(this._current){var u=this._current;this.speaking=false;this._current=null;clearTimeout(u._timer);} },
    pause(){}, resume(){}, getVoices(){return [{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null
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

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
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

const ALL_MODULES = ['personalizzazione','repeatAloud','speakEasy','flashcardAEngIta','flashcardAItaEng','quickMatchEngIta','quickMatchItaEng','voicePractice','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo','speedRoundEngIta','speedRoundItaEng','voiceCoach'];

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1: Voice Coach mic-confirmed lockout ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T8Job1', ALL_MODULES.slice(0, idx));
    await page.evaluate(() => { window.__vcTranscript = ''; }); // always empty recognition
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);

    // vc-record-btn is a toggle: start, then stop (only the second click
    // fires vcRecognition.stop() -> onend -> 'pending'). Dispatched
    // directly — the pulsing .is-recording animation hangs a native click.
    async function recordAndSend() {
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(60);
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(150);
      await page.click('#vc-send-btn').catch(() => {});
      await page.waitForTimeout(100);
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) { await page.click('#attempt-popup-next'); await page.waitForTimeout(80); }
    }
    // Voice Check has no retry button (job 5) — advance via "Avanti" instead;
    // vcEmptyRecognitionStreak is a running counter independent of the line.
    async function backToRecording() {
      await page.click('#vc-next-btn').catch(() => {});
      await page.waitForTimeout(80);
      // The main pass has few lines — this test's steady stream of Avanti
      // clicks can exhaust it and land on the Schermata Ripasso
      // (retryIntro); click through its own continue button so the next
      // recordAndSend() lands on a live, recordable line again.
      const onRetryIntro = await page.evaluate(() => !document.getElementById('voice-coach-retry-intro-screen').hidden);
      if (onRetryIntro) {
        await page.click('#voice-coach-retry-continue-btn').catch(() => {});
        await page.waitForTimeout(80);
      }
    }

    // Drive 5 empty attempts — past restartSuggestionAt=4, short of
    // confirmedAt=6 — then a RECOGNIZED (even wrong) attempt: the streak
    // must reset and "Avanti" must never have been disabled by it.
    for (let i = 0; i < 5; i++) {
      await recordAndSend();
      if (i < 4) await backToRecording();
    }
    await page.evaluate(() => { window.__vcTranscript = 'some words here'; });
    await backToRecording();
    await recordAndSend();
    const nextBtnEnabledAfterReset = await page.$eval('#vc-next-btn', el => !el.disabled).catch(() => null);
    log('[Job1] "Avanti" re-enables once a recording IS recognized (streak resets)', nextBtnEnabledAfterReset === true);
    await page.evaluate(() => { window.__vcTranscript = ''; });

    // Now drive 6 fresh empty attempts to actually reach confirmedAt=6.
    await backToRecording();
    for (let i = 0; i < 6; i++) {
      await recordAndSend();
      if (i < 5) await backToRecording();
    }
    const nextBtnDisabled = await page.$eval('#vc-next-btn', el => el.disabled).catch(() => null);
    log('[Job1] "Avanti" is disabled once confirmedAt is reached', nextBtnDisabled === true);
    const mapBtnVisible = await page.isVisible('#vc-mic-notice-map').catch(() => false);
    log('[Job1] "Torna alla mappa" is the offered action', mapBtnVisible);

    // Try clicking vc-next-btn anyway (should be no-op since disabled + guarded)
    await page.evaluate(() => document.getElementById('vc-next-btn').click()); // raw click bypasses disabled-click prevention in some engines
    await page.waitForTimeout(150);
    const summaryVisibleAfterForcedClick = await page.isVisible('#voice-coach-summary-screen').catch(() => false);
    log('[Job1] Forcing a click on the disabled "Avanti" does NOT advance/complete the module', !summaryVisibleAfterForcedClick);

    // Job 5 consequence: once truly confirmed, Voice Check offers NO
    // in-place recovery — the record button itself is hidden (state stays
    // 'result', unlike Voice Practice's Riprova/Avanti-driven idle reset),
    // so a recognized attempt is no longer even reachable; "Torna alla
    // mappa" is the only way out from here.
    const recordBtnHiddenAtLock = await page.$eval('#vc-record-btn', el => el.hidden).catch(() => null);
    log('[Job1][Job5] Confirmed lock: record button stays hidden (no same-line recovery for Voice Check)', recordBtnHiddenAtLock === true);

    log('[Job1] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 1b: module NOT marked completed if never advances past confirmed problem ============
  // (Structural check: since Avanti is disabled, vcFinishModule/markModuleCompleted can never run —
  // verified by confirming the module row stays non-completed after leaving via the mic notice's map button.)
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T8Job1b', ALL_MODULES.slice(0, idx));
    await page.evaluate(() => { window.__vcTranscript = ''; });
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(60);
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(300);
      await page.click('#vc-send-btn').catch(() => {});
      await page.waitForTimeout(100);
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) { await page.click('#attempt-popup-next'); await page.waitForTimeout(80); }
      if (i < 5) { await page.click('#vc-next-btn').catch(() => {}); await page.waitForTimeout(80); }
    }
    await page.click('#vc-mic-notice-map');
    await page.waitForTimeout(200);
    const rowClass = await page.$eval('[data-module="voiceCoach"]', el => el.className);
    log('[Job1b] Module row is NOT "completed" after leaving via the mic-notice map button', rowClass.indexOf('completed') === -1);
    log('[Job1b] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH8 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
