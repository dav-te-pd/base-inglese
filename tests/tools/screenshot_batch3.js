const { launchBrowser, APP_URL, outputPath } = require('../test-env');
const BASE = APP_URL;
const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = { speak(u){if(u.onstart)u.onstart();setTimeout(()=>{if(u.onend)u.onend();},20);}, cancel(){}, getVoices(){return[{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};
async function run() {
  const browser = await launchBrowser();

  // Danger panel + two-row title
  {
    const context = await browser.newContext({ viewport: { width: 400, height: 950 } });
    const page = await context.newPage();
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    await page.fill('#name-input', 'ShotDanger2');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForTimeout(100);
    await page.evaluate((u) => {
      localStorage.setItem('baseinglese:modules:episode1:' + u, JSON.stringify({ completed: ['personalizzazione', 'repeatAloud'] }));
      localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
    }, 'ShotDanger2');
    await page.click('#go-episode');
    await page.waitForTimeout(150);
    await page.click('[data-module="personalizzazione"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: outputPath('danger-panel-new.png') });
    await context.close();
  }

  // Two-row Spiegazione title on a full intro screen (Repeat Aloud, dismissed=false)
  {
    const context = await browser.newContext({ viewport: { width: 400, height: 950 } });
    const page = await context.newPage();
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    await page.fill('#name-input', 'ShotTitle2');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForTimeout(100);
    await page.evaluate((u) => {
      localStorage.setItem('baseinglese:modules:episode1:' + u, JSON.stringify({ completed: ['personalizzazione'] }));
      localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
    }, 'ShotTitle2');
    await page.click('#go-episode');
    await page.waitForTimeout(150);
    await page.click('[data-module="repeatAloud"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: outputPath('spiegazione-title-new.png') });
    await context.close();
  }

  await browser.close();
  console.log('done');
}
run().catch(e => { console.error(e); process.exit(1); });
