const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:8793/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 5); },
    cancel() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
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

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // --- Flash Card: no Indietro/Avanti, flip-required, auto-advance, retry safety valve ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'FCTester2', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng']);
    await page.click('[data-module="flashcardAEngIta"]');
    await page.waitForTimeout(300);
    const introVisible = await page.isVisible('#fc-intro-screen');
    if (introVisible) { await page.click('#fc-intro-start-btn'); await page.waitForTimeout(200); }

    // No Indietro/Avanti buttons anywhere in the DOM.
    const prevBtn = await page.$('#fc-prev-btn');
    const nextBtn = await page.$('#fc-next-btn');
    const navRow = await page.$('#fc-nav-row');
    log('Flash Card has NO Indietro button (#fc-prev-btn) in DOM', !prevBtn);
    log('Flash Card has NO Avanti button (#fc-next-btn) in DOM', !nextBtn);
    log('Flash Card has NO #fc-nav-row wrapper in DOM', !navRow);

    // Before flipping, no way to advance/skip: choice row must stay hidden
    // and there is nothing else clickable to move forward.
    const choiceHiddenBeforeFlip = await page.evaluate(() => document.getElementById('fc-choice-row').hidden);
    log('Flash Card choice row hidden before flipping (must flip first)', choiceHiddenBeforeFlip);

    const counterBefore = await page.textContent('#fc-counter');
    await page.click('#fc-card'); // flip
    await page.waitForTimeout(150);
    const choiceVisible = await page.isVisible('#fc-choice-row');
    log('Flash Card choice row visible after flip', choiceVisible);
    await page.click('#fc-know-it-btn');
    await page.waitForTimeout(500);
    const counterAfter = await page.textContent('#fc-counter');
    log('Flash Card "Sì, la so!" still auto-advances (counter changed)', counterBefore !== counterAfter);

    // Flip back and forth before answering still works (existing behavior preserved).
    await page.click('#fc-card'); // flip to back
    await page.waitForTimeout(120);
    await page.click('#fc-card'); // flip back to front
    await page.waitForTimeout(120);
    const choiceHiddenAfterFlipBack = await page.evaluate(() => document.getElementById('fc-choice-row').hidden);
    log('Flash Card flip-back-to-front still hides choice row (unanswered)', choiceHiddenAfterFlipBack);
    await page.click('#fc-card'); // flip to back again to actually answer
    await page.waitForTimeout(120);
    await page.click('#fc-not-yet-btn');
    await page.waitForTimeout(500);

    // Drain the deck + retry passes to confirm the safety valve (shared
    // CONFIG.retryQueue.maxAttempts=3) still terminates the module by
    // always answering "Non ancora" for every remaining card, verifying
    // it eventually reaches the summary screen instead of looping forever.
    let iterations = 0;
    while (iterations++ < 60) {
      const summaryVisible = await page.isVisible('#fc-summary-screen');
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#fc-retry-intro-screen');
      if (retryVisible) { await page.click('#fc-retry-continue-btn'); await page.waitForTimeout(150); continue; }
      const cardVisible = await page.isVisible('#fc-card-screen');
      if (!cardVisible) { await page.waitForTimeout(100); continue; }
      await page.click('#fc-card');
      await page.waitForTimeout(100);
      await page.click('#fc-not-yet-btn'); // always wrong -> exercises the safety valve
      await page.waitForTimeout(450);
    }
    const summaryVisible = await page.isVisible('#fc-summary-screen');
    log('Flash Card reaches summary even when every card is "Non ancora" (safety valve terminates)', summaryVisible);
    const summaryText = await page.textContent('#fc-summary-screen .sr-summary-title');
    log('Flash Card summary title still has no emoji', summaryText.trim() === 'Tutte le carte ripassate!');

    // Mastery: confirm every "wrong" item was eventually force-accepted rosso
    // (i.e. maxAttempts=3 fired), reading straight from localStorage.
    const masteryRaw = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:episode1:' + u), 'FCTester2');
    const mastery = JSON.parse(masteryRaw);
    const fcEntries = Object.keys(mastery).filter(k => k.startsWith('flashcard-a:'));
    const allRosso = fcEntries.length > 0 && fcEntries.every(k => mastery[k].level === 'rosso');
    log('Flash Card mastery entries all landed on rosso after repeated "Non ancora" (safety valve applied CONFIG.retryQueue.maxAttempts)', allRosso);

    log('No JS errors during Flash Card nav-removal test', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  // --- Regression: Quick Match still works with shared CONFIG.retryQueue.maxAttempts ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'QMRegression', ['repeatAloud', 'speakEasy', 'voiceCoach']);
    await page.click('[data-module="quickMatchEngIta"]');
    await page.waitForTimeout(300);
    const introVisible = await page.isVisible('#qm-start-screen');
    log('[Regression] Quick Match start screen visible', introVisible);
    await page.waitForFunction(() => document.getElementById('qm-start-btn') && !document.getElementById('qm-start-btn').disabled);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(200);
    const quizVisible = await page.isVisible('#qm-quiz-screen');
    log('[Regression] Quick Match reaches quiz screen', quizVisible);
    // Always click option 0 to exercise the shared safety valve to completion.
    let iterations = 0;
    while (iterations++ < 150) {
      const summaryVisible = await page.isVisible('#qm-summary-screen');
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#qm-retry-intro-screen');
      if (retryVisible) { await page.click('#qm-retry-continue-btn'); await page.waitForTimeout(120); continue; }
      const revealVisible = await page.isVisible('#qm-reveal');
      if (revealVisible) { await page.click('#qm-advance-btn'); await page.waitForTimeout(120); continue; }
      const opts = await page.$$eval('#qm-options .sr-option', els => els.map(e => e.getAttribute('data-qm-index')));
      if (!opts.length) { await page.waitForTimeout(100); continue; }
      await page.click('#qm-options .sr-option[data-qm-index="' + opts[0] + '"]');
      await page.waitForTimeout(650);
    }
    const qmSummaryVisible = await page.isVisible('#qm-summary-screen');
    log('[Regression] Quick Match still terminates via shared safety valve', qmSummaryVisible);
    log('[Regression] No JS errors on Quick Match', errors.length === 0);
    await page.close();
  }

  // --- Regression: Speed Round still works with shared CONFIG.retryQueue.maxAttempts ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRRegression', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng']);
    await page.click('[data-module="speedRoundEngIta"]');
    await page.waitForTimeout(300);
    await page.waitForFunction(() => document.getElementById('sr-ready-btn') && !document.getElementById('sr-ready-btn').disabled);
    await page.click('#sr-ready-btn');
    await page.waitForTimeout(4200);
    const srQuizVisible = await page.isVisible('#sr-quiz-screen');
    log('[Regression] Speed Round reaches quiz screen after countdown', srQuizVisible);
    const opts = await page.$$eval('#sr-options .sr-option', els => els.map(e => e.getAttribute('data-sr-index')));
    await page.click('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]');
    await page.waitForTimeout(150);
    const cls = await page.getAttribute('#sr-options .sr-option[data-sr-index="' + opts[0] + '"]', 'class');
    log('[Regression] Speed Round option click still classifies correct/wrong', cls.includes('is-correct') || cls.includes('is-wrong'));
    log('[Regression] No JS errors on Speed Round', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
