const { launchBrowser, APP_URL } = require('../test-env');

const BASE = APP_URL;

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
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // --- Flash Card auto-advance test ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'FCTester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng']);
    await page.click('[data-module="flashcardAEngIta"]');
    await page.waitForTimeout(300);

    // Intro screen shown first time (module not in completedModules) —
    // read the new "prova a indovinarla" text straight off fc-intro-body.
    const introVisible = await page.isVisible('#fc-intro-screen');
    log('Flash Card intro screen visible on first open', introVisible);
    const introBodyText = await page.textContent('#fc-intro-body');
    const hasGuessText = introBodyText.includes('Prima di girarla, prova a indovinarla');
    log('Flash Card Spiegazione shows new "prova a indovinarla" text', hasGuessText);
    if (introVisible) {
      await page.click('#fc-intro-start-btn');
      await page.waitForTimeout(200);
    }

    const counterBefore = await page.textContent('#fc-counter');
    // Flip card, then answer "Sì, la so!" and confirm it auto-advances
    // without needing to click "Avanti" separately.
    await page.click('#fc-card');
    await page.waitForTimeout(150);
    const choiceVisible = await page.isVisible('#fc-choice-row');
    log('Flash Card choice row visible after flip', choiceVisible);
    await page.click('#fc-know-it-btn');
    await page.waitForTimeout(500); // FC_SLIDE_MS=260 + buffer, no manual Avanti click
    const counterAfter = await page.textContent('#fc-counter');
    log('Flash Card "Sì, la so!" auto-advances to next card (counter changed) without clicking Avanti',
      counterBefore !== counterAfter);
    const navRowVisibleAfter = await page.isVisible('#fc-nav-row');
    log('Flash Card next card shows front-facing nav row (Indietro still reachable)', navRowVisibleAfter);
    const prevBtnEnabled = await page.evaluate(() => !document.getElementById('fc-prev-btn').disabled);
    log('Flash Card Indietro button enabled on 2nd card (can review previous card)', prevBtnEnabled);

    // Test "Non ancora" also auto-advances.
    await page.click('#fc-card');
    await page.waitForTimeout(150);
    const counterBefore2 = await page.textContent('#fc-counter');
    await page.click('#fc-not-yet-btn');
    await page.waitForTimeout(500);
    const counterAfter2 = await page.textContent('#fc-counter');
    log('Flash Card "Non ancora" also auto-advances to next card', counterBefore2 !== counterAfter2);

    // Indietro still works to go back and review.
    await page.click('#fc-prev-btn');
    await page.waitForTimeout(500);
    const counterAfterPrev = await page.textContent('#fc-counter');
    log('Flash Card Indietro still navigates back to review a previous card', counterAfterPrev === counterBefore2);

    log('No JS errors during Flash Card auto-advance test', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  // --- Emoji removal + Quick Match text check ---
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'EmojiTester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng']);

    // Flash Card summary screen text (no emoji).
    await page.click('[data-module="flashcardAEngIta"]');
    await page.waitForTimeout(300);
    const introVisible = await page.isVisible('#fc-intro-screen');
    if (introVisible) {
      await page.click('#fc-intro-start-btn');
      await page.waitForTimeout(200);
    }
    // Drain the whole deck quickly answering "Sì, la so!" without flipping check needed.
    for (let i = 0; i < 40; i++) {
      const summaryVisible = await page.isVisible('#fc-summary-screen');
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#fc-retry-intro-screen');
      if (retryVisible) { await page.click('#fc-retry-continue-btn'); await page.waitForTimeout(150); continue; }
      const cardVisible = await page.isVisible('#fc-card-screen');
      if (!cardVisible) { await page.waitForTimeout(100); continue; }
      await page.click('#fc-card');
      await page.waitForTimeout(100);
      await page.click('#fc-know-it-btn');
      await page.waitForTimeout(450);
    }
    const summaryText = await page.textContent('#fc-summary-screen .sr-summary-title');
    log('Flash Card summary title has no emoji', summaryText.trim() === 'Tutte le carte ripassate!');
    console.log('    summary text: "' + summaryText + '"');

    log('No JS errors during emoji/text verification', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
