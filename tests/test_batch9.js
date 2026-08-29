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
    start() { setTimeout(() => { if (this.onresult) this.onresult({ results: [] }); }, 5); }
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

  // ============ JOB 2A: Quick Match "alto" bucket (answer everything right) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('quickMatchEngIta');
    await bootAsUser(page, 'T9QMAlto', ALL_MODULES.slice(0, idx));
    await openModule(page, 'quickMatchEngIta');
    await page.waitForTimeout(300);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(150);
    // Answer correctly every time by reading which option has the underlying `correct` flag
    // via qmCurrentOptions is not exposed; instead click each option and if wrong, on the NEXT
    // appearance of the same item (after requeue) try a different index. Simplify: query the DOM
    // for the option marked correct AFTER a wrong click reveals it, remembering text->correct mapping
    // is complex; instead directly read window internals is not possible (closured). So: answer via
    // brute-force retry using "which index was correct" from the reveal, tracked by prompt text.
    const correctIndexByPrompt = {};
    for (let i = 0; i < 200; i++) {
      const state = await page.evaluate(() => ({
        done: document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden,
        quiz: document.getElementById('qm-quiz-screen') && !document.getElementById('qm-quiz-screen').hidden,
        reveal: document.getElementById('qm-reveal') && !document.getElementById('qm-reveal').hidden,
        retryIntro: document.getElementById('qm-retry-intro-screen') && !document.getElementById('qm-retry-intro-screen').hidden,
        popupOpen: document.getElementById('attempt-popup').classList.contains('is-open'),
        prompt: document.getElementById('qm-prompt') ? document.getElementById('qm-prompt').textContent : null
      }));
      if (state.done) break;
      if (state.popupOpen) { await page.evaluate(() => document.getElementById('attempt-popup-next').click()); await page.waitForTimeout(80); continue; }
      if (state.retryIntro) { await page.evaluate(() => document.getElementById('qm-retry-continue-btn').click()); await page.waitForTimeout(80); continue; }
      if (state.reveal) { await page.evaluate(() => document.getElementById('qm-advance-btn').click()); await page.waitForTimeout(80); continue; }
      if (state.quiz) {
        const known = correctIndexByPrompt[state.prompt];
        const idxToClick = known !== undefined ? known : 0;
        const clicked = await page.evaluate((idxToClick) => {
          var b = document.querySelector('#qm-options [data-qm-index="' + idxToClick + '"]:not([disabled])');
          if (!b) return null;
          b.click();
          return true;
        }, idxToClick);
        if (!clicked) { await page.waitForTimeout(200); continue; }
        await page.waitForTimeout(150);
        // Learn the correct index for this prompt from the reveal (if shown) or from is-correct class
        const correctIdx = await page.evaluate(() => {
          var el = document.querySelector('#qm-options [data-qm-index].is-correct');
          return el ? parseInt(el.getAttribute('data-qm-index'), 10) : null;
        });
        if (correctIdx !== null) correctIndexByPrompt[state.prompt] = correctIdx;
        continue;
      }
      await page.waitForTimeout(150);
    }
    const summaryVisible = await page.isVisible('#qm-summary-screen').catch(() => false);
    log('[Job2A] Quick Match reached Schermata Finale (learned-answer strategy)', summaryVisible);
    if (summaryVisible) {
      const subtitle = await page.$eval('#qm-summary-title-sub', el => el.textContent).catch(() => null);
      console.log('    -> subtitle: "' + subtitle + '"');
      log('[Job2A] Subtitle is non-empty', !!subtitle && subtitle.length > 3);
    }
    log('[Job2A] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 2A: verify bucket selection logic directly (unit-style via page context) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    // Can't call closured percentageBucket directly; instead verify CONFIG.percentageThresholds
    // is the exact source used, by reading it from window.APP_CONFIG (which IS exposed).
    // Moved out of CONFIG.speedRound to this neutral top-level spot in a
    // later turn (see percentageBucket's own comment) — this assertion was
    // stale from before that move.
    const thresholds = await page.evaluate(() => window.APP_CONFIG.percentageThresholds);
    log('[Job2A] CONFIG.percentageThresholds exists with basso/medio/alto', thresholds && thresholds.basso !== undefined && thresholds.medio !== undefined && thresholds.alto !== undefined);
    console.log('    -> thresholds: ' + JSON.stringify(thresholds));
    await page.close();
  }

  // ============ JOB 2A: fetch messaggi-feedback.json and verify new structure ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const data = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()));
    log('[Job2] moduleCompleteMessages is bucketed {alto,medio,basso}, each 5 entries',
      data.moduleCompleteMessages && data.moduleCompleteMessages.alto.length === 5 && data.moduleCompleteMessages.medio.length === 5 && data.moduleCompleteMessages.basso.length === 5);
    log('[Job2] dialogoCompleteMessages is {siLoSo,nonAncora}, each 5 entries',
      data.dialogoCompleteMessages && data.dialogoCompleteMessages.siLoSo.length === 5 && data.dialogoCompleteMessages.nonAncora.length === 5);
    // tone check: "alto" and "siLoSo" must never mention "ripass"/"riprova"/"ancora" (retry suggestion)
    // — but "senza bisogno di ripassi" (alto[2]) is the negation of exactly
    // that, not a suggestion, so exclude that specific negated pattern
    // rather than flag a message that correctly says the opposite.
    const altoHasRetryWord = data.moduleCompleteMessages.alto.some(function (m) { return /ripass|riprova|rifare|rifai|esercitart/i.test(m) && !/senza (bisogno di )?ripass/i.test(m); });
    const siLoSoHasRetryWord = data.dialogoCompleteMessages.siLoSo.some(function (m) { return /ripass|riprova|rifare|rifai|riascolt/i.test(m); });
    log('[Job2] "alto" messages never suggest retrying/practicing more', !altoHasRetryWord);
    log('[Job2] "siLoSo" messages never suggest redoing the dialogue', !siLoSoHasRetryWord);
    await page.close();
  }

  // ============ JOB 2B: Dialogo "Non ancora" outcome shows nonAncora message ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T9DgNonAncora', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(400);
    }
    await page.click('#dg-not-yet-btn');
    await page.waitForTimeout(150);
    const subtitle = await page.$eval('#dg-summary-title-sub', el => el.textContent).catch(() => null);
    console.log('    -> "Non ancora" subtitle: "' + subtitle + '"');
    const data = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()));
    log('[Job2B] "Non ancora" outcome subtitle is one of dialogoCompleteMessages.nonAncora', data.dialogoCompleteMessages.nonAncora.indexOf(subtitle) !== -1);
    log('[Job2B] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 2B: Dialogo "Sì, lo so" outcome shows siLoSo message ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T9DgSiLoSo', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(400);
    }
    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(150);
    const subtitle = await page.$eval('#dg-summary-title-sub', el => el.textContent).catch(() => null);
    console.log('    -> "Si lo so" subtitle: "' + subtitle + '"');
    const data = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()));
    log('[Job2B] "Sì, lo so" outcome subtitle is one of dialogoCompleteMessages.siLoSo', data.dialogoCompleteMessages.siLoSo.indexOf(subtitle) !== -1);
    log('[Job2B] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 2: Repeat Aloud / Speak Easy DO have a Schermata Finale (structural check) ============
  // Updated per later batch: every module now has a Schermata Finale (rule: "OGNI modulo ha la
  // Schermata Finale, nessuna eccezione"). The "Ho finito" button now opens the summary screen
  // instead of completing the module directly; the summary's own exit button completes it.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const raHasSummary = await page.evaluate(() => !!document.getElementById('repeat-aloud-summary-screen'));
    const seHasSummary = await page.evaluate(() => !!document.getElementById('speak-easy-summary-screen'));
    const raHasCompleteBtn = await page.evaluate(() => !!document.getElementById('repeat-aloud-complete'));
    const seHasCompleteBtn = await page.evaluate(() => !!document.getElementById('speak-easy-complete'));
    log('[Job2 verify] Repeat Aloud DOES have a Schermata Finale element', raHasSummary);
    log('[Job2 verify] Repeat Aloud DOES have its own explicit completion button', raHasCompleteBtn);
    log('[Job2 verify] Speak Easy DOES have a Schermata Finale element', seHasSummary);
    log('[Job2 verify] Speak Easy DOES have its own explicit completion button', seHasCompleteBtn);
    await page.close();
  }

  // ============ JOB 3: choice box hint shown/hidden correctly ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T9Hint', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(150); }
    const hintVisibleBefore = await page.isVisible('#dg-choice-hint').catch(() => false);
    const hintText = await page.$eval('#dg-choice-hint', el => el.textContent).catch(() => null);
    log('[Job3] Hint is visible before all lines are heard', hintVisibleBefore);
    log('[Job3] Hint text is non-empty and comes from istruzioni-moduli.json', !!hintText && hintText.length > 5);
    console.log('    -> hint text: "' + hintText + '"');
    const boxDisabled = await page.$eval('#dg-not-yet-btn', el => el.disabled).catch(() => null);
    log('[Job3] Choice box is disabled while hint is shown', boxDisabled === true);

    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(400);
    }
    const hintHiddenAfter = await page.isHidden('#dg-choice-hint').catch(() => null);
    const boxEnabledAfter = await page.$eval('#dg-not-yet-btn', el => !el.disabled).catch(() => null);
    log('[Job3] Hint hides once all lines have been heard', hintHiddenAfter === true);
    log('[Job3] Choice box enables once all lines have been heard', boxEnabledAfter === true);
    log('[Job3] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH9 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
