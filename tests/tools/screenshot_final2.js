const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8931/index.html';
const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = { speak(u){if(u.onstart)u.onstart();setTimeout(()=>{if(u.onend)u.onend();},20);}, cancel(){}, getVoices(){return[{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};
async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 950 } });
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.click('#switch-user').catch(()=>{});
  await page.waitForTimeout(100);
  await page.fill('#name-input', 'ScreenshotUser2');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((u) => {
    localStorage.setItem('baseinglese:modules:episode1:' + u, JSON.stringify({ completed: [] }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
  }, 'ScreenshotUser2');
  await page.click('#go-episode');
  await page.waitForTimeout(200);
  await page.click('body');
  for (const ch of 'config') await page.keyboard.press(ch);
  await page.waitForTimeout(150);
  const found = await page.evaluate(() => {
    var groups = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
    var g = groups.find(el => el.querySelector('summary').textContent === 'moduleOrderDefault');
    if (g) { g.open = true; g.scrollIntoView(); return true; }
    return false;
  });
  console.log('found moduleOrderDefault group:', found);
  await page.waitForTimeout(150);
  await page.screenshot({ path: '/tmp/claude-0/-home-user-base-inglese/6f1aee09-70d5-5e15-b1c2-7237e3d6581e/scratchpad/config-reorder2.png' });
  await browser.close();
}
run().catch(e => { console.error(e); process.exit(1); });
