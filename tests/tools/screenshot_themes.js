const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8794/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 30); },
    cancel() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.fill('#name-input', 'ThemeShot');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((u) => {
    localStorage.setItem('baseinglese:episode1:customizeSeen:' + u, '1');
    localStorage.setItem('baseinglese:modules:episode1:' + u, JSON.stringify({ completed: ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng'] }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
  }, 'ThemeShot');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.click('[data-module="dialogoAscoltaRipeti"]');
  await page.waitForTimeout(300);
  await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
  await page.click('#dg-start-btn');
  await page.waitForTimeout(200);

  for (const theme of ['viaggio', 'notte', 'mediterraneo', 'moderno', 'natura']) {
    await page.evaluate((t) => { document.documentElement.setAttribute('data-theme', t); }, theme);
    await page.waitForTimeout(80);
    await page.screenshot({ path: `/tmp/claude-0/-home-user-base-inglese/6f1aee09-70d5-5e15-b1c2-7237e3d6581e/scratchpad/dg-theme-${theme}.png` });
  }
  await browser.close();
  console.log('done');
}
run().catch(e => { console.error(e); process.exit(1); });
