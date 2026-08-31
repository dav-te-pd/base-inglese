const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 30); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); if (u.onerror) u.onerror({ error: 'canceled' }); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
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
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
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

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Quick Match: "Non lo so" disables together with options after a CORRECT answer ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'QMDontKnowTester', stepsBefore('quickMatchEngIta'));
    await openModule(page, 'quickMatchEngIta');
    await page.click('#qm-start-btn').catch(() => {});
    await page.waitForTimeout(200);
    const beforeDisabled = await page.evaluate(() => document.getElementById('qm-dontknow-btn').disabled);
    log('[QM Task1] "Non lo so" starts enabled on a fresh question', beforeDisabled === false);
    // qmCurrentOptions (which option is correct) is module-scope, not
    // exposed globally, so try option 0 repeatedly across questions until
    // a correct tap is observed; a wrong tap just advances to retry.
    let gotCorrect = false;
    for (let attempt = 0; attempt < 20 && !gotCorrect; attempt++) {
      await page.click('#qm-options .sr-option >> nth=0');
      await page.waitForTimeout(20);
      const wasCorrect = await page.evaluate(() => document.querySelector('#qm-options .sr-option.is-correct') !== null && document.querySelector('#qm-options .sr-option.is-wrong') === null);
      if (wasCorrect) {
        gotCorrect = true;
        const dontKnowDisabledRightAfter = await page.evaluate(() => document.getElementById('qm-dontknow-btn').disabled);
        log('[QM Task1] "Non lo so" is disabled immediately after a CORRECT tap (bug fix)', dontKnowDisabledRightAfter === true);
      } else {
        // wrong path: reveal shown, dontknow hidden; advance manually to next question for retry
        const revealShown = await page.evaluate(() => !document.getElementById('qm-reveal').hidden);
        if (revealShown) {
          await page.click('#qm-advance-btn');
          await page.waitForTimeout(50);
        }
      }
    }
    log('[QM Task1] Managed to observe a correct-answer tap within retries', gotCorrect);
    // Now confirm it resets enabled on the NEXT question (not stuck disabled forever).
    await page.waitForTimeout(800); // feedbackPauseMs (600) then auto-advance
    const nextQDisabled = await page.evaluate(() => document.getElementById('qm-dontknow-btn') ? document.getElementById('qm-dontknow-btn').disabled : null);
    log('[QM Task1] "Non lo so" resets to enabled on the next question (not stuck disabled)', nextQDisabled === false);
    log('[QM Task1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Quick Match: Spiegazione + Help visible AND enabled during the quiz ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'QMHeaderTester', stepsBefore('quickMatchItaEng'));
    await openModule(page, 'quickMatchItaEng');
    await page.click('#qm-start-btn').catch(() => {});
    await page.waitForTimeout(200);
    const state = await page.evaluate(() => {
      var w = document.getElementById('quick-match-watch-btn');
      var h = document.getElementById('quick-match-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[QM Task2] Spiegazione is visible during the quiz', state.watchHidden === false);
    log('[QM Task2] Help is visible during the quiz', state.helpHidden === false);
    log('[QM Task3] Spiegazione stays enabled during the quiz (no timer in Quick Match)', state.watchDisabled === false);
    log('[QM Task3] Help stays enabled during the quiz (no timer in Quick Match)', state.helpDisabled === false);
    // Clicking Spiegazione during the quiz should actually open the overlay.
    await page.click('#quick-match-watch-btn');
    await page.waitForTimeout(100);
    const overlayVisible = await page.isVisible('#howitworks-overlay').catch(() => false);
    log('[QM Task2] Spiegazione click opens the overlay mid-quiz', overlayVisible);
    log('[QM Task2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: "Non lo so" disables together with options, and resets per question ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.addInitScript(() => {
      // Speed up the per-question timer + 3-2-1 so the test stays fast.
      window.__preConfigOverride = true;
    });
    await bootAsUser(page, 'SRDontKnowTester', stepsBefore('speedRoundEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 30; // long enough that the timeout never fires mid-test
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300); // 3-2-1 countdown
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const beforeDisabled = await page.evaluate(() => document.getElementById('sr-dontknow-btn').disabled);
    log('[SR Task1] "Non lo so" starts enabled on a fresh question', beforeDisabled === false);
    let gotCorrect = false;
    for (let attempt = 0; attempt < 20 && !gotCorrect; attempt++) {
      await page.click('#sr-options .sr-option >> nth=0');
      await page.waitForTimeout(20);
      const wasCorrect = await page.evaluate(() => document.querySelector('#sr-options .sr-option.is-correct') !== null && document.querySelector('#sr-options .sr-option.is-wrong') === null);
      if (wasCorrect) {
        gotCorrect = true;
        const dontKnowDisabledRightAfter = await page.evaluate(() => document.getElementById('sr-dontknow-btn').disabled);
        log('[SR Task1] "Non lo so" is disabled immediately after a CORRECT tap (bug fix, same as Quick Match)', dontKnowDisabledRightAfter === true);
      } else {
        const revealShown = await page.evaluate(() => !document.getElementById('sr-reveal').hidden);
        if (revealShown) {
          await page.click('#sr-advance-btn');
          await page.waitForTimeout(50);
        }
      }
    }
    log('[SR Task1] Managed to observe a correct-answer tap within retries', gotCorrect);
    await page.waitForTimeout(800); // feedbackPauseMs (600) then auto-advance
    const nextQDisabled = await page.evaluate(() => document.getElementById('sr-dontknow-btn') ? document.getElementById('sr-dontknow-btn').disabled : null);
    log('[SR Task1] "Non lo so" resets to enabled on the next question (not stuck disabled)', nextQDisabled === false);
    log('[SR Task1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: Spiegazione + Help visible during the quiz, DISABLED while the timer bar runs, ENABLED once it stops ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRHeaderTester', stepsBefore('speedRoundItaEng'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 30;
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundItaEng');
    // Buttons should be visible+enabled on the start screen (before the countdown/timer ever runs).
    const startState = await page.evaluate(() => {
      var w = document.getElementById('speed-round-watch-btn');
      var h = document.getElementById('speed-round-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[SR Task2] Spiegazione visible on start screen', startState.watchHidden === false);
    log('[SR Task2] Help visible on start screen', startState.helpHidden === false);
    log('[SR Task3] Spiegazione/Help enabled on start screen (no timer running yet)', startState.watchDisabled === false && startState.helpDisabled === false);
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const duringTimer = await page.evaluate(() => {
      var w = document.getElementById('speed-round-watch-btn');
      var h = document.getElementById('speed-round-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[SR Task2] Spiegazione stays visible while the quiz timer runs (bug fix — was hidden entirely before)', duringTimer.watchHidden === false);
    log('[SR Task2] Help stays visible while the quiz timer runs', duringTimer.helpHidden === false);
    log('[SR Task3] Spiegazione is DISABLED while the timer bar is running', duringTimer.watchDisabled === true);
    log('[SR Task3] Help is DISABLED while the timer bar is running', duringTimer.helpDisabled === true);
    // A WRONG tap shows the reveal (something to read) -> header unlocks.
    // Retry across questions until a wrong tap is observed (option order
    // is randomized per question).
    let gotWrong = false;
    for (let attempt = 0; attempt < 20 && !gotWrong; attempt++) {
      await page.click('#sr-options .sr-option >> nth=0');
      await page.waitForTimeout(30);
      const revealShown = await page.evaluate(() => !document.getElementById('sr-reveal').hidden);
      if (revealShown) {
        gotWrong = true;
        const afterWrong = await page.evaluate(() => {
          var w = document.getElementById('speed-round-watch-btn');
          var h = document.getElementById('speed-round-help-btn');
          return { watchDisabled: w.disabled, helpDisabled: h.disabled };
        });
        log('[SR Task3-adj] Spiegazione re-enabled once the WRONG-answer reveal is shown (something to read)', afterWrong.watchDisabled === false);
        log('[SR Task3-adj] Help re-enabled once the WRONG-answer reveal is shown', afterWrong.helpDisabled === false);
        await page.click('#sr-advance-btn');
        await page.waitForTimeout(50);
      } else {
        // Correct tap: covered by the dedicated block below; just advance
        // past the auto-advance pause and try the next question.
        await page.waitForTimeout(700);
      }
    }
    log('[SR Task3-adj] Managed to observe a wrong-answer tap within retries', gotWrong);
    log('[SR Task2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: on a CORRECT answer, Spiegazione+Help stay DISABLED through the short pause (no flicker) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRCorrectNoFlickerTester', stepsBefore('speedRoundEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 30;
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    let gotCorrect = false;
    for (let attempt = 0; attempt < 20 && !gotCorrect; attempt++) {
      await page.click('#sr-options .sr-option >> nth=0');
      await page.waitForTimeout(15); // right after the tap, before feedbackPauseMs (600) elapses
      const wasCorrect = await page.evaluate(() => document.querySelector('#sr-options .sr-option.is-correct') !== null && document.querySelector('#sr-options .sr-option.is-wrong') === null);
      if (wasCorrect) {
        gotCorrect = true;
        const rightAfterTap = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione stays DISABLED right after a CORRECT tap (nothing to read, no flicker)', rightAfterTap === true);
        await page.waitForTimeout(300); // still mid-pause (feedbackPauseMs 600)
        const midPause = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione still DISABLED mid-pause, before auto-advance (the exact flicker this fixes)', midPause === true);
        await page.waitForTimeout(500); // past feedbackPauseMs, into the next question's timer
        const nextQuestion = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione still DISABLED into the next question (its own timer just re-locked it)', nextQuestion === true);
      } else {
        const revealShown = await page.evaluate(() => !document.getElementById('sr-reveal').hidden);
        if (revealShown) { await page.click('#sr-advance-btn'); await page.waitForTimeout(50); }
      }
    }
    log('[SR Task3-adj] Managed to observe a correct-answer tap within retries', gotCorrect);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: "Non lo so" also unlocks Spiegazione/Help (a reveal case, same as a wrong tap) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRDontKnowUnlocksTester', stepsBefore('speedRoundItaEng'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 30;
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundItaEng');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const lockedBefore = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione is locked while the timer runs, right before "Non lo so"', lockedBefore === true);
    await page.click('#sr-dontknow-btn');
    await page.waitForTimeout(30);
    const unlockedAfter = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione unlocks right after "Non lo so" (its own reveal is a case to read)', unlockedAfter === false);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: a TIMEOUT also unlocks Spiegazione/Help (the third reveal case) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRTimeoutUnlocksTester', stepsBefore('speedRoundEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 0.2; // let it expire quickly
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    await page.waitForFunction(() => !document.getElementById('sr-reveal').hidden, { timeout: 3000 });
    const unlockedAfterTimeout = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione unlocks right after a TIMEOUT reveal (the third reveal case)', unlockedAfterTimeout === false);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Round: leaving mid-timer (back to map) doesn't leave Spiegazione/Help stuck disabled ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRLeaveMidTimerTester', stepsBefore('speedRoundEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedRound.timeLimitSeconds = 30;
      window.APP_CONFIG.speedRound.countdownSeconds = 1;
      window.APP_CONFIG.speedRound.countdownStepMs = 30;
    });
    await openModule(page, 'speedRoundEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const midTimerDisabled = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
    log('[SR cleanup] Header is disabled mid-timer, as expected, right before leaving', midTimerDisabled === true);
    // Leave the module mid-timer via the Mappa button.
    await page.click('#speed-round-back-map');
    await page.waitForTimeout(150);
    // Re-open Speed Round fresh: on the start screen the header must NOT be stuck disabled.
    await openModule(page, 'speedRoundEngIta');
    const freshState = await page.evaluate(() => document.getElementById('speed-round-watch-btn').disabled);
    log('[SR cleanup] Re-opening after leaving mid-timer: Spiegazione is NOT stuck disabled (stopAllModuleActivity cleanup)', freshState === false);
    log('[SR cleanup] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
