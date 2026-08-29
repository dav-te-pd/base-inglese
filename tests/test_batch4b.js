const { launchBrowser, APP_URL } = require('./test-env');
const BASE = APP_URL;

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
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    // deliberately NOT dismissing intros, so the Spiegazione/intro screen shows
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const ALL_MODULES = ['personalizzazione','repeatAloud','speakEasy','flashcardAEngIta','flashcardAItaEng','quickMatchEngIta','quickMatchItaEng','voicePractice','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo','speedRoundEngIta','speedRoundItaEng','voiceCoach'];

  const checks = [
    ['repeatAloud', '#repeat-aloud-intro-title', 'Repeat Aloud'],
    ['quickMatchEngIta', '#qm-start-title', 'Match Practice en→it'],
    ['dialogoAscoltaRipeti', '#dg-start-title', 'Dialogue: Listen & Repeat'],
    ['speedRoundEngIta', '#sr-start-title', 'Speed Match en→it'],
    ['flashcardAEngIta', '#fc-intro-title', 'Flash Card'] // known gap: shared JSON kind -> generic title, no direction
  ];

  for (const [moduleId, selector, expected] of checks) {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf(moduleId);
    const priorModules = ALL_MODULES.slice(0, idx);
    await bootAsUser(page, 'T4b_' + moduleId, priorModules);
    await page.click('[data-module="' + moduleId + '"]');
    await page.waitForTimeout(300);
    const text = await page.$eval(selector + ' .spiegazione-title-name', el => el.textContent.trim()).catch(e => 'ERROR:' + e.message);
    log('[Spiegazione] ' + moduleId + ' intro name = "' + expected + '" (got "' + text + '")', text === expected);
    log('[Spiegazione] ' + moduleId + ' no JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH4b SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
