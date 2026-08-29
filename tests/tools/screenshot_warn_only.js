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
  const context = await browser.newContext({ viewport: { width: 400, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.fill('#name-input', 'ShotWarnOnly');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((u) => {
    localStorage.setItem('baseinglese:modules:episode1:' + u, JSON.stringify({ completed: ['personalizzazione', 'repeatAloud'] }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + u, '1');
  }, 'ShotWarnOnly');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.click('[data-module="personalizzazione"]');
  await page.waitForTimeout(200);
  await page.fill('#customize-warning-confirm-input', 'cancella epis');
  await page.screenshot({ path: '/tmp/claude-0/-home-user-base-inglese/6f1aee09-70d5-5e15-b1c2-7237e3d6581e/scratchpad/warning-screen.png' });
  await browser.close();
  console.log('done');
}
run().catch(e => { console.error(e); process.exit(1); });
