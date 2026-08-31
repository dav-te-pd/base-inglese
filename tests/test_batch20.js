// Content checks (not just behavior): verifies the TEXT shown for a
// direction is actually in the expected language, not just that the
// buttons behave correctly. Closes the gap the censimento audit found —
// every existing test on these modules checks behavior (locks, disabled
// states, scoring) but none reads the prompt/answer/front/back text
// itself, so a swapped en-it/it-en ternary would go completely unnoticed.
const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const { stepsBefore } = require('./module-order');
const fs = require('fs');
const BASE = APP_URL;

const EPISODE_DATA = JSON.parse(fs.readFileSync(repoPath('data', 'a1-episodio1-inglese.json'), 'utf8'));

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 20); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
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

  // ============ Flash Card it→en: front is Italian, back is English, direction label matches ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // NOT the intro-dismiss shortcut used elsewhere here — we want a
    // deterministic first card, and the intro-dismiss list already
    // covers flashcardLevelA regardless of direction.
    await bootAsUser(page, 'ContentFCItaEng', stepsBefore('flashcardAItaEng'));
    await openModule(page, 'flashcardAItaEng');
    await page.waitForTimeout(200);
    const startVisible = await page.isVisible('#fc-intro-start-btn').catch(() => false);
    if (startVisible) { await page.click('#fc-intro-start-btn'); await page.waitForTimeout(150); }
    await page.waitForFunction(() => {
      var el = document.getElementById('fc-front-word');
      return el && el.textContent && el.textContent !== 'Caricamento...';
    }, { timeout: 3000 });
    const directionLabel = await page.$eval('#fc-direction', el => el.textContent.trim());
    log('[Content] Flash Card it→en: direction label reads "ITALIANO → INGLESE"', directionLabel === 'ITALIANO → INGLESE');
    const frontText = await page.$eval('#fc-front-word', el => el.textContent.trim());
    const backText = await page.$eval('#fc-back-word', el => el.textContent.trim());
    const item = EPISODE_DATA.levels.A.items.find(function (it) { return it.italian === frontText; });
    log('[Content] Flash Card it→en: front text is a real ITALIAN entry (not the English one)', !!item);
    log('[Content] Flash Card it→en: back text is that same entry\'s ENGLISH translation', !!item && backText === item.english);
    // Confirm the flip interaction itself still works (is-flipped toggles) —
    // a light behavior check alongside the content one, not the main point.
    await page.click('#fc-card');
    await page.waitForTimeout(50);
    const isFlipped = await page.$eval('#fc-card', el => el.classList.contains('is-flipped'));
    log('[Content] Flash Card it→en: card still flips on tap', isFlipped);
    log('[Content] Flash Card it→en: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Match Practice it→en: prompt is Italian, correct answer is the matching English text ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'ContentQMItaEng', stepsBefore('quickMatchItaEng'));
    await openModule(page, 'quickMatchItaEng');
    await page.click('#qm-start-btn').catch(() => {});
    await page.waitForTimeout(200);
    const directionLabel = await page.$eval('#qm-direction', el => el.textContent.trim());
    log('[Content] Match Practice it→en: direction label reads "ITALIANO → INGLESE"', directionLabel === 'ITALIANO → INGLESE');
    const promptText = await page.$eval('#qm-prompt', el => el.textContent.trim());
    const item = EPISODE_DATA.levels.A.items.find(function (it) { return it.italian === promptText; });
    log('[Content] Match Practice it→en: prompt is a real ITALIAN entry (not the English one)', !!item);
    // Tap any option — is-correct always lands on the objectively correct
    // one regardless of whether the tap itself was right or wrong.
    await page.click('#qm-options .sr-option >> nth=0');
    await page.waitForTimeout(30);
    const correctOptionText = await page.$eval('#qm-options .sr-option.is-correct', el => el.textContent.trim());
    log('[Content] Match Practice it→en: the correct option is that same entry\'s ENGLISH translation', !!item && correctOptionText === item.english);
    log('[Content] Match Practice it→en: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH20 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
