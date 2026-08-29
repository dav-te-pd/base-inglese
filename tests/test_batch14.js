const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  window.__speakLog = [];
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; window.__speakLog.push(utter.text); if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 20); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  // Simulates a long, CONTINUOUSLY spoken phrase: an interim result
  // (isFinal:false) fires quickly after start, then more speech keeps
  // "arriving" (more interim results) well past the silence timeout,
  // finally a single isFinal result when stop() is called. Job 1's own
  // bug: with interimResults off, none of this would ever update
  // vcLatestTranscript before stop(), so the silence timeout used to
  // fire even mid-speech.
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; this._interimTimer = null; this._stopped = false; }
    start() {
      this._stopped = false;
      var self = this;
      // First interim result almost immediately — proves speech was heard.
      setTimeout(function () {
        if (self._stopped || !self.onresult) return;
        self.onresult({ results: [{ 0: { transcript: 'hello' }, isFinal: false, length: 1 }] });
      }, 20);
      // Keep "talking" well past a short silence-timeout window.
      this._interimTimer = setInterval(function () {
        if (self._stopped || !self.onresult) return;
        self.onresult({ results: [{ 0: { transcript: 'hello there how are' }, isFinal: false, length: 1 }] });
      }, 100);
    }
    stop() {
      this._stopped = true;
      if (this._interimTimer) clearInterval(this._interimTimer);
      var self = this;
      setTimeout(function () {
        if (self.onresult) self.onresult({ results: [{ 0: { transcript: window.__vcFinalTranscript || 'hello there how are you' }, isFinal: true, length: 1 }] });
        if (self.onend) self.onend();
      }, 5);
    }
    abort() { this._stopped = true; if (this._interimTimer) clearInterval(this._interimTimer); if (this.onend) this.onend(); }
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
const ALL_BEFORE_QM = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng'];
const ALL_BEFORE_DG_TEMPO = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti'];

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1: continuous speech never falsely triggers the silence cutoff ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14Silence', ALL_BEFORE_VP);
    // Shrink the silence timeout so "past it" is fast, but the fake
    // recognition keeps sending interim results well beyond it.
    await page.evaluate(() => { window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.15; });
    await openModule(page, 'voicePractice');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(500); // well past the 150ms silence timeout, still "speaking"
    const warningVisible = await page.evaluate(() => !document.getElementById('vc-silence-warning').hidden);
    const stillRecording = await page.evaluate(() => document.getElementById('vc-record-btn').classList.contains('is-recording'));
    log('[Job1] Continuous speech: NO silence warning fires mid-speech', !warningVisible);
    log('[Job1] Continuous speech: still recording (not auto-stopped)', stillRecording);
    await page.evaluate(() => document.getElementById('vc-record-btn').click()); // stop
    await page.waitForTimeout(150);
    const confirmAreaVisible = await page.evaluate(() => !document.getElementById('vc-confirm-area').hidden);
    log('[Job1] Recording reaches the normal pending/confirm state when stopped', confirmAreaVisible);
    log('[Job1] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 2: AudioContext warm-up listener registered, no crash on first tap ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    await page.click('body');
    await page.waitForTimeout(100);
    log('[Job2] No JS errors after the warm-up tap', errors.length === 0);
    await page.close();
  }

  // ============ JOB 3: Repeat Aloud / Speak Easy now have a Schermata Finale ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14RA', ['personalizzazione']);
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(300);
    const btnLabel = await page.evaluate(() => document.getElementById('repeat-aloud-complete').textContent);
    log('[Job3] "Ho finito" button no longer claims "torna alla mappa" (it opens the summary now)', btnLabel === 'Ho finito');
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(150);
    const summaryVisible = await page.evaluate(() => !document.getElementById('repeat-aloud-summary-screen').hidden);
    const mainHidden = await page.evaluate(() => document.getElementById('repeat-aloud-main-screen').hidden);
    log('[Job3] Repeat Aloud: clicking "Ho finito" opens the Schermata Finale (not the map)', summaryVisible && mainHidden);
    const watchHidden = await page.evaluate(() => document.getElementById('repeat-aloud-watch-btn').hidden);
    log('[Job3] Repeat Aloud summary hides Spiegazione (rule 10)', watchHidden);
    const stillOnRepeatAloud = await page.evaluate(() => document.getElementById('view-repeat-aloud').classList.contains('is-active'));
    log('[Job3] Not navigated away yet — still on Repeat Aloud', stillOnRepeatAloud);
    const completedBefore = await page.evaluate((u) => { var raw = localStorage.getItem('baseinglese:modules:episode1:' + u); return raw ? JSON.parse(raw).completed : []; }, 'T14RA');
    log('[Job3] Module not marked completed until the summary\'s own button is clicked', completedBefore.indexOf('repeatAloud') === -1);
    await page.click('#repeat-aloud-complete-btn');
    await page.waitForTimeout(150);
    const onMap = await page.evaluate(() => document.getElementById('view-map').classList.contains('is-active'));
    const completedAfter = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'T14RA');
    log('[Job3] Repeat Aloud: summary\'s own button completes + returns to the map', onMap && completedAfter.indexOf('repeatAloud') !== -1);
    log('[Job3] Repeat Aloud: No JS errors', errors.length === 0);
    await page.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14SE', ['personalizzazione', 'repeatAloud']);
    await openModule(page, 'speakEasy');
    await page.waitForTimeout(300);
    await page.click('#speak-easy-complete');
    await page.waitForTimeout(150);
    const summaryVisible = await page.evaluate(() => !document.getElementById('speak-easy-summary-screen').hidden);
    log('[Job3] Speak Easy: clicking "Ho finito" opens the Schermata Finale', summaryVisible);
    await page.click('#speak-easy-complete-btn');
    await page.waitForTimeout(150);
    const completedAfter = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'T14SE');
    log('[Job3] Speak Easy: summary\'s own button completes the module', completedAfter.indexOf('speakEasy') !== -1);
    log('[Job3] Speak Easy: No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 4: "Ripasso" badge appears during the retry pass (Match Practice) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14Ripasso', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    await page.waitForTimeout(300);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(150);
    const badgeHiddenMainPass = await page.evaluate(() => document.getElementById('qm-ripasso-badge').hidden);
    log('[Job4] "Ripasso" badge hidden during the main pass', badgeHiddenMainPass);
    // Answer every question wrong to force everything into the retry queue.
    let guard = 0;
    let sawRipassoBadge = false;
    while (guard++ < 60) {
      const state = await page.evaluate(() => ({
        quiz: document.getElementById('qm-quiz-screen') && !document.getElementById('qm-quiz-screen').hidden,
        reveal: document.getElementById('qm-reveal') && !document.getElementById('qm-reveal').hidden,
        retryIntro: document.getElementById('qm-retry-intro-screen') && !document.getElementById('qm-retry-intro-screen').hidden,
        summary: document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden,
        popupOpen: document.getElementById('attempt-popup').classList.contains('is-open')
      }));
      if (state.summary) break;
      if (state.popupOpen) { await page.evaluate(() => document.getElementById('attempt-popup-next').click()); await page.waitForTimeout(80); continue; }
      if (state.retryIntro) { await page.evaluate(() => document.getElementById('qm-retry-continue-btn').click()); await page.waitForTimeout(80); continue; }
      if (state.reveal) {
        const badgeHidden = await page.evaluate(() => document.getElementById('qm-ripasso-badge').hidden);
        if (!badgeHidden) sawRipassoBadge = true;
        await page.evaluate(() => document.getElementById('qm-advance-btn').click());
        await page.waitForTimeout(80);
        continue;
      }
      if (state.quiz) {
        const badgeHidden = await page.evaluate(() => document.getElementById('qm-ripasso-badge').hidden);
        if (!badgeHidden) sawRipassoBadge = true;
        const clicked = await page.evaluate(() => { var b = document.querySelector('#qm-options .sr-option[data-qm-index="0"]:not([disabled])'); if (b) { b.click(); return true; } return false; });
        await page.waitForTimeout(clicked ? 120 : 400);
        continue;
      }
      await page.waitForTimeout(80);
    }
    log('[Job4] "Ripasso" badge appears at some point during the retry pass', sawRipassoBadge);
    log('[Job4] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 7a: Ripeti a Tempo sequential unlock — line 3 unreachable before line 2 ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14Sequence', ALL_BEFORE_DG_TEMPO);
    await page.evaluate(() => { window.APP_CONFIG.dialogo.pausaBase = 100; window.APP_CONFIG.dialogo.pausaPerParola = 5; window.APP_CONFIG.dialogo.pausaMassima = 300; });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    log('[Job7a] Dialogue has at least 3 lines to test sequencing', bubbleIds.length >= 3);
    const line3LockedAtStart = await page.$eval('.dg-bubble[data-line-id="' + bubbleIds[2] + '"]', el => el.classList.contains('is-ahead-locked'));
    log('[Job7a] Line 3 is locked (is-ahead-locked) before line 1 is even played', line3LockedAtStart);
    // Try clicking line 3 directly — should be a no-op (still locked, no audio queued).
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[2] + '"]').catch(() => {});
    await page.waitForTimeout(100);
    const stillSpeaking = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job7a] Clicking the locked line 3 does nothing (no audio starts)', !stillSpeaking);
    // Play line 1 fully (audio + its countdown bar).
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]');
    await page.waitForTimeout(500);
    const line2UnlockedNow = await page.$eval('.dg-bubble[data-line-id="' + bubbleIds[1] + '"]', el => !el.classList.contains('is-ahead-locked'));
    log('[Job7a] After line 1 finishes, line 2 unlocks', line2UnlockedNow);
    const line1StillPlayable = await page.$eval('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]', el => !el.classList.contains('is-ahead-locked'));
    log('[Job7a] Line 1 stays replayable (not locked again)', line1StillPlayable);
    const line3StillLocked = await page.$eval('.dg-bubble[data-line-id="' + bubbleIds[2] + '"]', el => el.classList.contains('is-ahead-locked'));
    log('[Job7a] Line 3 (2 ahead) is still locked — no skipping', line3StillLocked);
    log('[Job7a] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 7b: "Prossima frase" cuts the countdown short and counts usage ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14NextLine', ALL_BEFORE_DG_TEMPO);
    await page.evaluate(() => { window.APP_CONFIG.dialogo.pausaBase = 5000; window.APP_CONFIG.dialogo.pausaPerParola = 900; window.APP_CONFIG.dialogo.pausaMassima = 12000; });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const toolbarVisible = await page.evaluate(() => !document.getElementById('dg-toolbar').hidden);
    const nextLineBtnText = await page.evaluate(() => { var b = document.getElementById('dg-next-line-btn'); return b ? b.textContent : null; });
    log('[Job7b] Ripeti a Tempo toolbar shows "Prossima frase"', toolbarVisible && nextLineBtnText === 'Prossima frase');
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]');
    await page.waitForTimeout(60); // audio ends fast (fake synth, 20ms), bar starts (long, 5s+)
    const timerRunning = await page.$eval('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]', el => el.classList.contains('dg-bubble-timer'));
    log('[Job7b] Countdown bar is running before skipping', timerRunning);
    const skipsBefore = await page.evaluate((u) => { var raw = localStorage.getItem('baseinglese:nextLineSkips:episode1:' + u); return raw ? JSON.parse(raw).byModule.dialogoRipetiATempo : undefined; }, 'T14NextLine');
    // The skip click, the "is it disabled right after" read, and the
    // attempted double-click-while-disabled all happen inside ONE
    // evaluate() instead of three separate round-trips (deterministic
    // fix, 10th collaudo — was racing the fake synth's onend, a real
    // setTimeout at 20ms in this mock's speak(); each extra Node<->browser
    // round-trip costs real wall-clock time, and under a full regression
    // run that time can exceed 20ms, so the mock "finishes speaking" and
    // re-enables the button before the next command lands — the button
    // isn't actually still disabled by the time the test gets to it, so
    // clicking it is a legitimate tap, not a double-count). JS is
    // single-threaded: the pending setTimeout literally cannot fire while
    // this synchronous browser-side function is still running, so folding
    // every read/click into one call makes the whole sequence atomic and
    // independent of host machine speed.
    const skipResult = await page.evaluate((args) => {
      var bubble = document.querySelector('.dg-bubble[data-line-id="' + args.bubbleId + '"]');
      var nextBtn = document.getElementById('dg-next-line-btn');
      var key = 'baseinglese:nextLineSkips:episode1:' + args.userName;
      nextBtn.click(); // the real "skip" tap
      var timerStoppedAfterSkip = !bubble.classList.contains('dg-bubble-timer');
      var wasDisabled = nextBtn.disabled;
      var skipsAfter = JSON.parse(localStorage.getItem(key) || '{}').byModule.dialogoRipetiATempo;
      nextBtn.click(); // attempted double-click WHILE (still, atomically) disabled
      var skipsAfterNoop = JSON.parse(localStorage.getItem(key) || '{}').byModule.dialogoRipetiATempo;
      return { timerStoppedAfterSkip: timerStoppedAfterSkip, wasDisabled: wasDisabled, skipsAfter: skipsAfter, skipsAfterNoop: skipsAfterNoop };
    }, { userName: 'T14NextLine', bubbleId: bubbleIds[0] });
    log('[Job7b] Clicking "Prossima frase" ends the countdown early', skipResult.timerStoppedAfterSkip);
    log('[Job7b] Usage count persisted (0/undefined -> 1)', (skipsBefore || 0) + 1 === skipResult.skipsAfter);
    // Job 4 (3rd collaudo): "Prossima frase" now also plays the NEXT line's
    // audio immediately (same as if the user had tapped it) — so right
    // after the skip the button is transiently DISABLED again (line 2's
    // audio is now playing, nothing counting down yet), not left idle.
    log('[Job7b] "Prossima frase" is disabled again right after skipping (job 4: next line\'s audio is now playing)', skipResult.wasDisabled);
    log('[Job7b] Clicking again while disabled does not double-count', skipResult.skipsAfterNoop === skipResult.skipsAfter);
    // Once line 2's own audio finishes and its countdown bar starts, the
    // button becomes enabled again — the exercise keeps flowing, it isn't
    // stuck disabled forever.
    await page.waitForFunction(() => {
      var btn = document.getElementById('dg-next-line-btn');
      return btn && !btn.disabled;
    }, { timeout: 3000 }).catch(() => {});
    const enabledForNextLineCountdown = await page.$eval('#dg-next-line-btn', el => !el.disabled);
    log('[Job7b] "Prossima frase" re-enables once line 2\'s own countdown starts', enabledForNextLineCountdown);
    log('[Job7b] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 8: choice box activates at END OF TIMER, not end of audio, on the last line ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14ChoiceTiming', ALL_BEFORE_DG_TEMPO);
    // Long-ish bar so we can observe the "audio ended but bar still running" window.
    await page.evaluate(() => { window.APP_CONFIG.dialogo.pausaBase = 600; window.APP_CONFIG.dialogo.pausaPerParola = 50; window.APP_CONFIG.dialogo.pausaMassima = 2000; });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    // Play every line via "Prossima frase" fast-forward except the LAST one, which we let run its own timer out.
    for (let i = 0; i < bubbleIds.length; i++) {
      await page.click('.dg-bubble[data-line-id="' + bubbleIds[i] + '"]').catch(() => {});
      await page.waitForTimeout(60); // audio ends
      if (i === bubbleIds.length - 1) break; // let the LAST line's bar run out naturally below
      const stillReachable = await page.$eval('#dg-next-line-btn', el => el).catch(() => null);
      if (stillReachable) { await page.click('#dg-next-line-btn').catch(() => {}); await page.waitForTimeout(120); }
    }
    // Audio for the last line just ended — bar should still be running, choice box must NOT be enabled yet.
    const disabledRightAfterAudio = await page.$eval('#dg-know-it-btn', el => el.disabled);
    log('[Job8] Choice box still disabled right after the LAST line\'s audio ends (bar still running)', disabledRightAfterAudio);
    // Now let the bar finish on its own.
    await page.waitForTimeout(2200);
    const enabledAfterTimer = await page.$eval('#dg-know-it-btn', el => !el.disabled);
    log('[Job8] Choice box enables once the LAST line\'s timer actually finishes', enabledAfterTimer);
    log('[Job8] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 9a: "← Mappa" keeps the same width whether Spiegazione/Help are visible or hidden ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T14MappaWidth', ['personalizzazione']);
    await openModule(page, 'repeatAloud'); // Mappa + Spiegazione + Help all visible
    await page.waitForTimeout(200);
    const widthAllVisible = await page.$eval('#repeat-aloud-back-map', el => el.getBoundingClientRect().width);
    await page.click('#repeat-aloud-complete'); // -> summary screen, Spiegazione hides, only Mappa+Help left... but back-map row is per-screen; header stays same row regardless
    await page.waitForTimeout(150);
    const widthOnSummary = await page.$eval('#repeat-aloud-back-map', el => el.getBoundingClientRect().width);
    log('[Job9a] "← Mappa" width unchanged whether Spiegazione is visible or hidden', Math.abs(widthAllVisible - widthOnSummary) < 1);
    log('[Job9a] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH14 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
