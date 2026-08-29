const { launchBrowser, APP_URL } = require('../test-env');

const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance {
    constructor(text) { this.text = text; }
  }
  const fakeSynth = {
    speak(utter) {
      if (utter.onstart) utter.onstart();
      setTimeout(() => { if (utter.onend) utter.onend(); }, 5);
    },
    cancel() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; },
    onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, { skipCustomize = true, completedModules = [] } = {}) {
  await page.goto(BASE);
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, skipCustomize, completedModules }) => {
    if (skipCustomize) {
      localStorage.setItem('baseinglese:episode1:customizeSeen:' + userName, '1');
    }
    if (completedModules.length) {
      localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    }
    // Avoid the map's own one-time intro re-appearing every single time we
    // navigate back to it during this test run (its "don't show again" is
    // opt-in via checkbox, same as every other module's intro).
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
  }, { userName, skipCustomize, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  // Dismiss map intro if shown.
  const introVisible = await page.isVisible('#map-intro-screen');
  if (introVisible) {
    await page.click('#map-intro-start-btn');
    await page.waitForTimeout(100);
  }
}

async function openModuleFromMap(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  for (const viewport of [{ w: 320, h: 700 }, { w: 375, h: 812 }, { w: 768, h: 1024 }]) {
    const page = await browser.newPage({ viewport: { width: viewport.w, height: viewport.h } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', req => errors.push('REQFAIL ' + req.url() + ' :: ' + (req.failure() && req.failure().errorText)));
    await page.addInitScript(mockInit);

    await bootAsUser(page, 'Tester' + viewport.w, { completedModules: ['repeatAloud', 'speakEasy', 'voiceCoach'] });

    // Order check via the rendered map list (DOM order = array order).
    const rowIds = await page.$$eval('#module-list [data-module]', els => els.map(e => e.getAttribute('data-module')));
    const vcIdx = rowIds.indexOf('voiceCoach');
    const qmEIdx = rowIds.indexOf('quickMatchEngIta');
    const qmIIdx = rowIds.indexOf('quickMatchItaEng');
    const srIdx = rowIds.indexOf('speedRoundEngIta');
    log('order voiceCoach < quickMatchEngIta < quickMatchItaEng < speedRoundEngIta @' + viewport.w,
      vcIdx > -1 && vcIdx < qmEIdx && qmEIdx < qmIIdx && qmIIdx < srIdx);

    // quickMatchEngIta should now be the unlocked "current" module.
    const qmRowClass = await page.getAttribute('[data-module="quickMatchEngIta"]', 'class');
    log('quickMatchEngIta is unlocked (current) after completing prior 3 modules @' + viewport.w,
      qmRowClass && qmRowClass.includes('current'));

    // --- Open Quick Match Eng-Ita via real UI click ---
    await openModuleFromMap(page, 'quickMatchEngIta');
    const startVisible = await page.isVisible('#qm-start-screen');
    log('Eng-Ita start screen visible @' + viewport.w, startVisible);

    const header2row = await page.$('#view-quick-match .header-2row');
    log('Eng-Ita header-2row present @' + viewport.w, !!header2row);

    await page.waitForFunction(() => document.getElementById('qm-start-btn') && !document.getElementById('qm-start-btn').disabled);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(200);
    const quizVisible = await page.isVisible('#qm-quiz-screen');
    log('Eng-Ita quiz screen visible right after start (no countdown) @' + viewport.w, quizVisible);
    const hasCountdownScreen = await page.evaluate(() => !!document.getElementById('qm-countdown-screen'));
    log('Eng-Ita view has no countdown screen element @' + viewport.w, !hasCountdownScreen);

    const promptAudioVisible = await page.isVisible('#qm-prompt-audio');
    log('Eng-Ita full listen block visible under prompt @' + viewport.w, promptAudioVisible);
    const rateButtons = await page.$$('#qm-prompt-audio .rate-btn');
    log('Eng-Ita rate buttons (100/75/50%) present @' + viewport.w, rateButtons.length === 3);

    const translationBtn = await page.$('#view-quick-match [data-toggle-translation]');
    log('Eng-Ita has NO "Mostra traduzione" button @' + viewport.w, !translationBtn);

    // Click the listen icon to make sure toggleSpeak wiring doesn't throw.
    await page.click('#qm-prompt-audio .repeat-listen-btn');
    await page.waitForTimeout(80);

    async function optionButtons() {
      return page.$$eval('#qm-options .sr-option', els => els.map(e => ({ idx: e.getAttribute('data-qm-index'), text: e.textContent })));
    }
    async function clickOptionByPredicate(matchCorrect) {
      const idx = await page.evaluate((matchCorrect) => {
        return window.__qmTestPeek ? -1 : -1; // placeholder, unused
      }, matchCorrect);
      return idx;
    }

    // We don't have access to closured qmCurrentOptions (app wrapped in an
    // IIFE, by design — no globals leaked). Instead read the reveal's
    // marked correct option after a wrong guess, or just try option 0 and
    // branch on the CSS class outcome.
    async function clickFirstOptionAndClassify() {
      const opts = await optionButtons();
      await page.click('#qm-options .sr-option[data-qm-index="' + opts[0].idx + '"]');
      await page.waitForTimeout(120);
      const cls = await page.getAttribute('#qm-options .sr-option[data-qm-index="' + opts[0].idx + '"]', 'class');
      return cls.includes('is-correct');
    }

    async function answerCorrectlyUsingReveal() {
      // Click any option; if wrong, the reveal marks the correct one —
      // click Avanti, then click the marked-correct option on read of
      // qm-reveal-text next round would differ, so instead: click option
      // 0 first; if it was wrong (now revealed), advance and click the
      // one now bearing .is-correct on the NEXT question via direct text
      // match isn't reliable either. Simplify: click through until an
      // option turns out correct — capped attempts.
    }

    // Simpler, robust approach: on each question, click the FIRST option.
    // If correct -> auto-advances. If wrong -> reveal shows; note which
    // option now has .is-correct, click Avanti, and on next occurrence of
    // the SAME word (in the retry pass) click that same text again. Since
    // vocabulary order shuffles, instead just always click option 0 and
    // let wrong answers flow into the retry queue, then rely on Quick
    // Match's own safety valve (maxRetryAttempts) to eventually force-
    // accept stubborn items as rosso and finish the module regardless of
    // whether we ever click the truly correct option. This still fully
    // exercises reveal/Avanti, retry-queue looping and the safety valve.
    let guardIterations = 0;
    while (guardIterations++ < 200) {
      const summaryVisible = await page.isVisible('#qm-summary-screen');
      if (summaryVisible) break;
      const onRetryIntro = await page.isVisible('#qm-retry-intro-screen');
      if (onRetryIntro) { await page.click('#qm-retry-continue-btn'); await page.waitForTimeout(120); continue; }
      const revealShown = await page.isVisible('#qm-reveal');
      if (revealShown) { await page.click('#qm-advance-btn'); await page.waitForTimeout(120); continue; }
      const quizShown = await page.isVisible('#qm-quiz-screen');
      if (!quizShown) { await page.waitForTimeout(100); continue; }
      const opts = await optionButtons();
      if (!opts.length) { await page.waitForTimeout(100); continue; }
      await page.click('#qm-options .sr-option[data-qm-index="' + opts[0].idx + '"]');
      await page.waitForTimeout(650);
    }
    const finalSummaryVisible = await page.isVisible('#qm-summary-screen');
    log('Eng-Ita reaches summary screen (retry-queue + safety valve terminate correctly) @' + viewport.w, finalSummaryVisible);
    const watchBtnOnSummary = await page.isVisible('#quick-match-watch-btn');
    log('Eng-Ita Spiegazione hidden on summary (rule 10) @' + viewport.w, !watchBtnOnSummary);

    // Explicit completion required.
    const progressBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + document.title) || '{}'));
    await page.click('#qm-complete-btn');
    await page.waitForTimeout(200);
    const progressAfterRaw = await page.evaluate((u) => localStorage.getItem('baseinglese:modules:episode1:' + u), 'Tester' + viewport.w);
    const progressAfter = progressAfterRaw ? JSON.parse(progressAfterRaw) : { completed: [] };
    log('Eng-Ita module marked completed after explicit "Ho finito" click @' + viewport.w,
      progressAfter.completed.includes('quickMatchEngIta'));

    // Mastery separation: quickmatch: keys exist, no speedround: keys yet.
    const masteryRaw = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:episode1:' + u), 'Tester' + viewport.w);
    const masteryKeys = masteryRaw ? Object.keys(JSON.parse(masteryRaw)) : [];
    const hasQuickmatchKeys = masteryKeys.some(k => k.startsWith('quickmatch:'));
    const hasSpeedroundKeys = masteryKeys.some(k => k.startsWith('speedround:'));
    log('Mastery has quickmatch: keys and no speedround: keys after only playing Quick Match @' + viewport.w,
      hasQuickmatchKeys && !hasSpeedroundKeys);

    // --- Quick Match Ita-Eng: back at the map, now quickMatchItaEng unlocked ---
    const qmItaRowClass = await page.getAttribute('[data-module="quickMatchItaEng"]', 'class');
    log('quickMatchItaEng unlocked after completing quickMatchEngIta @' + viewport.w,
      qmItaRowClass && qmItaRowClass.includes('current'));
    const activeViewId = await page.evaluate(() => document.querySelector('.view.is-active') && document.querySelector('.view.is-active').id);
    const mapMainHidden = await page.evaluate(() => document.getElementById('map-main-screen') && document.getElementById('map-main-screen').hidden);
    console.log('DEBUG before openModuleFromMap: activeView=' + activeViewId + ' mapMainHidden=' + mapMainHidden);
    await openModuleFromMap(page, 'quickMatchItaEng');
    await page.waitForFunction(() => document.getElementById('qm-start-btn') && !document.getElementById('qm-start-btn').disabled);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(200);

    const promptAudioHiddenItaEng = await page.evaluate(() => document.getElementById('qm-prompt-audio').hidden);
    log('Ita-Eng prompt has NO audio (qm-prompt-audio hidden) @' + viewport.w, promptAudioHiddenItaEng);

    const optionRows = await page.$$('.qm-option-row');
    log('Ita-Eng renders 4 .qm-option-row (option + mini listen) @' + viewport.w, optionRows.length === 4);
    const miniListenBtns = await page.$$('.qm-option-row .repeat-listen-btn');
    log('Ita-Eng has 4 mini listen buttons @' + viewport.w, miniListenBtns.length === 4);

    const firstMiniBtn = await page.$('.qm-option-row .repeat-listen-btn');
    await firstMiniBtn.click();
    await page.waitForTimeout(150);
    const stillEnabled = await page.evaluate(() => {
      const btn = document.querySelector('#qm-options .sr-option');
      return btn && !btn.disabled;
    });
    log('Ita-Eng clicking mini listen button does not submit an answer @' + viewport.w, stillEnabled);
    const revealStillHidden = await page.isVisible('#qm-reveal');
    log('Ita-Eng reveal still hidden after mini-listen click @' + viewport.w, !revealStillHidden);

    const translationBtnIt = await page.$('#view-quick-match [data-toggle-translation]');
    log('Ita-Eng has NO "Mostra traduzione" button @' + viewport.w, !translationBtnIt);

    // "Non lo so" -> declared non-attempt -> mastery straight to rosso, prefix quickmatch:.
    await page.click('#qm-dontknow-btn');
    await page.waitForTimeout(150);
    const masteryRaw2 = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:episode1:' + u), 'Tester' + viewport.w);
    const mastery2 = JSON.parse(masteryRaw2);
    const itEnEntry = Object.keys(mastery2).find(k => k.startsWith('quickmatch:') && k.endsWith(':it-en') && mastery2[k].level === 'rosso');
    log('Ita-Eng "Non lo so" writes a quickmatch:*:it-en rosso mastery entry @' + viewport.w, !!itEnEntry);

    await page.click('#qm-advance-btn');
    await page.waitForTimeout(150);

    // Back to map.
    await page.click('#quick-match-back-map');
    await page.waitForTimeout(150);
    const mapVisible = await page.isVisible('#map-main-screen');
    log('Quick Match back-to-map button works @' + viewport.w, mapVisible);

    log('No JS console/page errors during Quick Match run @' + viewport.w, errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));

    await page.close();
  }

  // --- Regression: Speed Round still works after DIRECTION_LABEL/srBuildOptions/srRecordResult refactor ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'RegressionSR', { completedModules: ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng'] });
    await openModuleFromMap(page, 'speedRoundEngIta');
    const srStartVisible = await page.isVisible('#sr-start-screen');
    log('[Regression] Speed Round start screen visible', srStartVisible);
    await page.waitForFunction(() => document.getElementById('sr-ready-btn') && !document.getElementById('sr-ready-btn').disabled);
    await page.click('#sr-ready-btn');
    await page.waitForTimeout(4200);
    const srQuizVisible = await page.isVisible('#sr-quiz-screen');
    log('[Regression] Speed Round reaches quiz screen after countdown', srQuizVisible);
    const srDirectionText = await page.textContent('#sr-direction');
    log('[Regression] Speed Round direction label renders via shared DIRECTION_LABEL', srDirectionText.includes('INGLESE'));
    const opts = await page.$$eval('#sr-options .sr-option', els => els.map(e => e.getAttribute('data-sr-index')));
    await page.click('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]');
    await page.waitForTimeout(150);
    const cls = await page.getAttribute('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]', 'class');
    log('[Regression] Speed Round option click still classifies correct/wrong (srBuildOptions/srRecordResult delegation intact)',
      cls.includes('is-correct') || cls.includes('is-wrong'));
    log('[Regression] No JS errors on Speed Round', errors.length === 0);
    await page.close();
  }

  // --- Regression: Flash Card still works after FC_DIRECTION_LABEL removal ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'RegressionFC', { completedModules: ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng'] });
    await openModuleFromMap(page, 'flashcardAEngIta');
    await page.waitForTimeout(300);
    const fcDirectionText = await page.evaluate(() => document.getElementById('fc-direction').textContent);
    log('[Regression] Flash Card direction label renders via shared DIRECTION_LABEL', fcDirectionText.includes('INGLESE'));
    log('[Regression] No JS errors on Flash Card', errors.length === 0);
    await page.close();
  }

  await browser.close();

  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) {
    console.log('FAILURES:');
    failed.forEach(f => console.log(' - ' + f.msg));
    process.exit(1);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
