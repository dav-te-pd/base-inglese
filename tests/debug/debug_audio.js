const { chromium } = require('/opt/node22/lib/node_modules/playwright');
async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('about:blank');
  const result = await page.evaluate(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return 'no AudioContext';
    try {
      const ctx = new AC();
      const osc = ctx.createOscillator();
      osc.frequency.value = 440;
      return 'created OK, state=' + ctx.state + ' freq=' + osc.frequency.value;
    } catch (e) {
      return 'error: ' + e.message;
    }
  });
  console.log(result);
  await browser.close();
}
run();
