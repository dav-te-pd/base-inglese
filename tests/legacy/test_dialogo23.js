const { launchBrowser, APP_URL } = require('../test-env');

const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance {
    constructor(text) { this.text = text; }
  }
  const fakeSynth = {
    _speaking: false, _paused: false,
    speak(utter) {
      this._speaking = true; this._paused = false;
      if (utter.onstart) utter.onstart();
      window.__lastUtterance = utter;
      utter.__timer = setTimeout(() => {
        if (!fakeSynth._paused) { fakeSynth._speaking = false; if (utter.onend) utter.onend(); }
      }, 25);
    },
    cancel() { this._speaking = false; this._paused = false; },
    pause() { this._paused = true; },
    resume() {
      if (this._paused && window.__lastUtterance) {
        this._paused = false;
        var utter = window.__lastUtterance;
        setTimeout(() => { this._speaking = false; if (utter.onend) utter.onend(); }, 25);
      }
    },
    get speaking() { return this._speaking; },
    get paused() { return this._paused; },
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; },
    onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) {
    await page.click('#switch-user');
    await page.waitForTimeout(100);
  }
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

async function shrinkTimings(page) {
  await page.evaluate(() => {
    window.APP_CONFIG.dialogo.pausaBase = 150;
    window.APP_CONFIG.dialogo.pausaPerParola = 20;
    window.APP_CONFIG.dialogo.pausaMassima = 600;
    window.APP_CONFIG.dialogo.pulsareDopoInattivita = 400;
    window.APP_CONFIG.dialogo.countdownStepMs = 80;
  });
}

async function openModuleFromMap(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Map order ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'OrderTester2', []);
    const rowIds = await page.$$eval('#module-list [data-module]', els => els.map(e => e.getAttribute('data-module')));
    const dg1 = rowIds.indexOf('dialogoAscoltaRipeti');
    const dg2 = rowIds.indexOf('dialogoRipetiATempo');
    const dg3 = rowIds.indexOf('dialogoContinuo');
    const sr = rowIds.indexOf('speedRoundEngIta');
    log('Order: ascoltaRipeti < ripetiATempo < continuo < speedRoundEngIta', dg1 > -1 && dg1 < dg2 && dg2 < dg3 && dg3 < sr);
    await page.close();
  }

  // ============ Regression: Speed Round timer bar after generalization ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRTimerRegression', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo']);
    await openModuleFromMap(page, 'speedRoundEngIta');
    await page.waitForFunction(() => document.getElementById('sr-ready-btn') && !document.getElementById('sr-ready-btn').disabled);
    await page.click('#sr-ready-btn');
    await page.waitForTimeout(4200); // 3-2-1 countdown
    const quizVisible = await page.isVisible('#sr-quiz-screen');
    log('[Regression] Speed Round reaches quiz screen after countdown', quizVisible);
    const transitionDuration = await page.evaluate(() => getComputedStyle(document.getElementById('sr-timerbar-fill')).transitionDuration);
    log('[Regression] Speed Round timer bar transition duration is 10s (CONFIG.speedRound.timeLimitSeconds, unaffected by generalization)', transitionDuration === '10s');
    const opts = await page.$$eval('#sr-options .sr-option', els => els.map(e => e.getAttribute('data-sr-index')));
    await page.click('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]');
    await page.waitForTimeout(150);
    const cls = await page.getAttribute('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]', 'class');
    log('[Regression] Speed Round option click still classifies correct/wrong (srFreezeTimer via shared freezeTimerBar)', cls.includes('is-correct') || cls.includes('is-wrong'));
    log('[Regression] No JS errors on Speed Round timer regression', errors.length === 0);
    await page.close();
  }

  // ============ dgLineDurationMs formula check with REAL (unshrunk) config ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'FormulaTester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'dialogoAscoltaRipeti']);
    await openModuleFromMap(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(200);
    // d1 = "Hello everyone! Nice to meet you. Can you introduce yourselves?" = 10 words.
    // pausaBase(2000) + 10*pausaPerParola(900) = 11000ms, under pausaMassima(12000).
    await page.click('.dg-bubble[data-line-id="d1"]');
    await page.waitForTimeout(60); // let the (fast, mocked) audio finish and the bar start
    const transitionDuration = await page.evaluate(() => {
      var bubble = document.querySelector('.dg-bubble[data-line-id="d1"]');
      var fill = bubble.querySelector('.sr-timerbar-fill');
      return getComputedStyle(fill).transitionDuration;
    });
    log('dgLineDurationMs formula: d1 (10 words) with default CONFIG.dialogo -> 11s bar (2000 + 10*900, capped at 12000)', transitionDuration === '11s');
    await page.close();
  }

  // ============ Module 2: Ripeti a Tempo ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error' && !/ERR_CONNECTION_RESET|fonts\.googleapis/.test(msg.text())) errors.push(msg.text()); });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Mod2Tester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'dialogoAscoltaRipeti']);
    await shrinkTimings(page);

    const rowClass = await page.getAttribute('[data-module="dialogoRipetiATempo"]', 'class');
    log('dialogoRipetiATempo unlocked (current) after Ascolta e Ripeti', rowClass && rowClass.includes('current'));

    await openModuleFromMap(page, 'dialogoRipetiATempo');
    const startVisible = await page.isVisible('#dg-start-screen');
    log('Mod2 start screen visible', startVisible);

    // Header ridotto: only Mappa, no Spiegazione/Help, even on start.
    const backVisible = await page.isVisible('#dialogo-back-map');
    const watchVisible = await page.isVisible('#dialogo-watch-btn');
    const helpVisible = await page.isVisible('#dialogo-help-btn');
    log('Mod2 header shows ONLY Mappa (no Spiegazione/Help) on start screen', backVisible && !watchVisible && !helpVisible);
    const header2row = await page.$('#view-dialogo .header-2row');
    log('Mod2 header-2row structure unchanged (still present)', !!header2row);

    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(200);
    const mainVisible = await page.isVisible('#dg-main-screen');
    log('Mod2 main screen visible after start (no ready countdown)', mainVisible);

    const toolbarHidden = await page.evaluate(() => document.getElementById('dg-toolbar').hidden);
    log('Mod2 has NO translations toggle / toolbar hidden', toolbarHidden);
    const helpVisibleMain = await page.isVisible('#dialogo-help-btn');
    log('Mod2 Help stays hidden during exercise too', !helpVisibleMain);

    const micIconPresent = await page.evaluate(() => document.getElementById('view-dialogo').innerHTML.includes('mic'));
    log('Mod2 has NO microphone icon', !micIconPresent);
    const hasAvantiSalta = await page.evaluate(() => /Avanti|Salta/.test(document.getElementById('view-dialogo').innerText));
    log('Mod2 has NO Avanti/Salta button', !hasAvantiSalta);

    // Click first bubble: lock everything except Mappa.
    const firstBubble = await page.$('.dg-bubble[data-line-id="d1"]');
    await firstBubble.click();
    await page.waitForTimeout(10);
    const midAudio = await page.evaluate(() => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="d1"]');
      var b2 = document.querySelector('.dg-bubble[data-line-id="d2"]');
      return {
        b1Active: b1.classList.contains('is-active'),
        b2Locked: b2.classList.contains('is-locked'),
        choiceDisabled: document.querySelectorAll('#dg-choice-row button')[0].disabled
      };
    });
    log('Mod2: during audio, clicked bubble lifts and others lock', midAudio.b1Active && midAudio.b2Locked && midAudio.choiceDisabled);
    const backEnabledMidAudio = await page.evaluate(() => !document.getElementById('dialogo-back-map').disabled);
    log('Mod2: Mappa stays clickable during audio (never disabled)', backEnabledMidAudio);

    await page.waitForTimeout(60); // audio ends (mocked ~25ms)
    const timerVisible = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d1"]').classList.contains('dg-bubble-timer'));
    log('Mod2: after audio, the per-line countdown bar starts inside the bubble', timerVisible);
    const captionText = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d1"] .dg-line-timer-caption').textContent);
    log('Mod2: countdown bar caption reads "Ripeti ad alta voce"', captionText.trim() === 'Ripeti ad alta voce');
    const stillLockedDuringBar = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d2"]').classList.contains('is-locked'));
    log('Mod2: still locked (except Mappa) during the countdown bar', stillLockedDuringBar);

    // Wait for the (shrunk) bar to finish.
    await page.waitForTimeout(400);
    const afterBar = await page.evaluate(() => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="d1"]');
      var b2 = document.querySelector('.dg-bubble[data-line-id="d2"]');
      var check = document.getElementById('dg-heard-d1');
      return {
        b1Timer: b1.classList.contains('dg-bubble-timer'),
        b1Locked: b1.classList.contains('is-locked'),
        b2Locked: b2.classList.contains('is-locked'),
        checkVisible: check && !check.hidden,
        b2Suggested: b2.classList.contains('is-suggested')
      };
    });
    log('Mod2: after the bar ends, timer bar hides and everything unlocks', !afterBar.b1Timer && !afterBar.b1Locked && !afterBar.b2Locked);
    log('Mod2: checkmark appears on the heard line', afterBar.checkVisible);
    log('Mod2: the NEXT line (d2) is suggested right after unlocking', afterBar.b2Suggested);
    const b2PulsingEarly = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d2"]').classList.contains('is-pulsing'));
    log('Mod2: suggested line is NOT pulsing yet (before inactivity delay)', !b2PulsingEarly);

    // Wait past pulsareDopoInattivita (shrunk to 400ms).
    await page.waitForTimeout(450);
    const b2Pulsing = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d2"]').classList.contains('is-pulsing'));
    log('Mod2: suggested line starts pulsing after the inactivity delay', b2Pulsing);

    // Redo an already-heard line (d1) — must still work.
    await page.click('.dg-bubble[data-line-id="d1"]');
    await page.waitForTimeout(10);
    const suggestionCleared = await page.evaluate(() => !document.querySelector('.dg-bubble[data-line-id="d2"]').classList.contains('is-pulsing') && !document.querySelector('.dg-bubble[data-line-id="d2"]').classList.contains('is-suggested'));
    log('Mod2: starting a new play clears any pending suggestion/pulse', suggestionCleared);
    await page.waitForTimeout(500); // let d1's full audio+bar finish again

    // Choice box present + text.
    const choiceHtml = await page.evaluate(() => document.getElementById('dg-choice-row').innerHTML);
    log('Mod2 choice box shows "Sai ripetere le frasi?"', choiceHtml.includes('Sai ripetere le frasi?'));

    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(200);
    const summaryVisible = await page.isVisible('#dg-summary-screen');
    log('Mod2 reaches summary after "Sì, lo so"', summaryVisible);
    await page.click('#dg-complete-btn');
    await page.waitForTimeout(200);
    const badgeText = await page.textContent('[data-module="dialogoRipetiATempo"] .module-state-badge');
    log('Mod2 map badge shows "Completato" (verde) after "Sì, lo so"', badgeText.trim() === 'Completato');

    log('No JS errors during Mod2 run', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  // ============ Module 3: Dialogo Continuo ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error' && !/ERR_CONNECTION_RESET|fonts\.googleapis/.test(msg.text())) errors.push(msg.text()); });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Mod3Tester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo']);
    await shrinkTimings(page);

    await openModuleFromMap(page, 'dialogoContinuo');
    const backVisible = await page.isVisible('#dialogo-back-map');
    const watchVisible = await page.isVisible('#dialogo-watch-btn');
    const helpVisible = await page.isVisible('#dialogo-help-btn');
    log('Mod3 header shows ONLY Mappa on start screen too', backVisible && !watchVisible && !helpVisible);

    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    const firstNumber = await page.evaluate(() => {
      document.getElementById('dg-start-btn').click();
      return document.getElementById('dg-ready-number').textContent;
    });
    const readyVisible = await page.isVisible('#dg-ready-screen');
    log('Mod3: 3-2-1 ready screen shown before auto-start', readyVisible);
    log('Mod3: ready countdown starts at 3 (CONFIG.dialogo.countdownPre)', firstNumber.trim() === '3');

    // Wait out the (shrunk-step) 3-2-1.
    await page.waitForTimeout(3 * 80 + 250);
    const mainVisible = await page.isVisible('#dg-main-screen');
    log('Mod3: main screen shown after ready countdown', mainVisible);

    // It should be playing d1 automatically without any click.
    await page.waitForTimeout(10);
    const d1Active = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d1"]').classList.contains('is-active'));
    log('Mod3: first line starts playing automatically (no click)', d1Active);

    // Clicking a bubble must do nothing (advance is fully automatic) —
    // click the LAST line (d7, far from being naturally reached yet)
    // while d1 is confirmed still active, then confirm d1 is STILL the
    // one playing right after (i.e. the click did not jump the chain).
    const d1StillActiveBeforeClick = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d1"]').classList.contains('is-active'));
    await page.click('.dg-bubble[data-line-id="d7"]', { force: true }).catch(() => {});
    await page.waitForTimeout(5);
    const d7GotActive = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d7"]').classList.contains('is-active'));
    const d1StillActiveAfterClick = await page.evaluate(() => document.querySelector('.dg-bubble[data-line-id="d1"]').classList.contains('is-active'));
    log('Mod3: clicking a bubble has no effect (fully automatic, chain not interrupted/jumped)',
      d1StillActiveBeforeClick && !d7GotActive && d1StillActiveAfterClick);

    // Toolbar should show Pausa (not translations toggle).
    const pauseBtnVisible = await page.isVisible('#dg-pause-btn');
    log('Mod3: toolbar shows Pausa/Riprendi (not a translations toggle)', pauseBtnVisible);
    const noTranslationsToggle = await page.evaluate(() => !document.getElementById('dg-translations-toggle'));
    log('Mod3: no translations toggle exists at all', noTranslationsToggle);

    // Test Pausa mid-flight: freezes both audio state and bar.
    // Wait until we're clearly in the timer-bar phase of some line.
    await page.waitForFunction(() => {
      var bubbles = document.querySelectorAll('.dg-bubble');
      for (var b of bubbles) if (b.classList.contains('dg-bubble-timer')) return true;
      return false;
    }, { timeout: 5000 });
    await page.click('#dg-pause-btn');
    await page.waitForTimeout(50);
    const widthAtPause = await page.evaluate(() => {
      var bubble = Array.from(document.querySelectorAll('.dg-bubble')).find(b => b.classList.contains('dg-bubble-timer'));
      var fill = bubble.querySelector('.sr-timerbar-fill');
      return getComputedStyle(fill).width;
    });
    await page.waitForTimeout(300); // if not truly paused, the bar would keep animating / finish
    const widthAfterWaitingPaused = await page.evaluate(() => {
      var bubble = Array.from(document.querySelectorAll('.dg-bubble')).find(b => b.classList.contains('dg-bubble-timer'));
      if (!bubble) return null;
      var fill = bubble.querySelector('.sr-timerbar-fill');
      return getComputedStyle(fill).width;
    });
    log('Mod3: Pausa actually freezes the countdown bar (width unchanged while paused)', widthAfterWaitingPaused !== null && widthAtPause === widthAfterWaitingPaused);
    const pauseBtnText = await page.textContent('#dg-pause-btn');
    log('Mod3: Pausa button now reads "Riprendi"', pauseBtnText.trim() === 'Riprendi');

    await page.click('#dg-pause-btn'); // resume
    await page.waitForTimeout(50);
    const resumedBtnText = await page.textContent('#dg-pause-btn');
    log('Mod3: Riprendi button reverts to "Pausa" after resuming', resumedBtnText.trim() === 'Pausa');

    // Let the whole chain run to completion (7 lines, shrunk timings).
    await page.waitForFunction(() => !document.getElementById('dg-summary-screen').hidden || !document.getElementById('dg-main-screen').hidden, { timeout: 2000 }).catch(() => {});
    await page.waitForFunction(() => {
      var choiceButtons = document.querySelectorAll('#dg-choice-row button');
      return choiceButtons.length && !choiceButtons[0].disabled;
    }, { timeout: 15000 });
    const allHeard = await page.evaluate(() => {
      var checks = document.querySelectorAll('.dg-heard-check');
      return Array.from(checks).every(c => !c.hidden);
    });
    log('Mod3: all 7 lines got heard by the end of the automatic chain', allHeard);
    const choiceHtml = await page.evaluate(() => document.getElementById('dg-choice-row').innerHTML);
    log('Mod3 choice box shows "Ce l\'hai fatta?"', choiceHtml.includes("Ce l'hai fatta?"));

    await page.click('#dg-not-yet-btn');
    await page.waitForTimeout(200);
    const summaryVisible = await page.isVisible('#dg-summary-screen');
    log('Mod3 reaches summary after "Non ancora"', summaryVisible);
    await page.click('#dg-complete-btn');
    await page.waitForTimeout(200);
    const badgeText = await page.textContent('[data-module="dialogoContinuo"] .module-state-badge');
    log('Mod3 map badge shows "Da rivedere" (giallo) after "Non ancora"', badgeText.trim() === 'Da rivedere');

    log('No JS errors during Mod3 run', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
