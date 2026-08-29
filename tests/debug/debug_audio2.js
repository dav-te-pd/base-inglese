const { chromium } = require('/opt/node22/lib/node_modules/playwright');
async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('about:blank');
  const result = await page.evaluate(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    let freqErr = null, gainErr = null;
    try {
      Object.defineProperty(osc.frequency, 'value', { set(v) {}, get() { return 1; } });
    } catch (e) { freqErr = e.message; }
    const gain = ctx.createGain();
    try {
      const orig = gain.gain.setValueAtTime.bind(gain.gain);
      gain.gain.setValueAtTime = function (v, t) { return orig(v, t); };
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
    } catch (e) { gainErr = e.message; }
    return { freqErr, gainErr };
  });
  console.log(JSON.stringify(result));
  await browser.close();
}
run();
