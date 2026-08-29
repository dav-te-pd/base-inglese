const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 500); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); if (u.onerror) u.onerror({ error: 'canceled' }); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
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
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'speakEasy', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.addInitScript(mockInit);
  await bootAsUser(page, 'DebugFC2', ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAItaEng']);
  await page.click('[data-module="flashcardAEngIta"]');
  await page.waitForTimeout(300);

  const listenBtn = await page.$('#fc-card [data-say]');
  console.log('1) listenBtn found:', !!listenBtn);
  await listenBtn.click({ force: true });
  await page.waitForTimeout(100);
  console.log('2) speaking after first click:', await page.evaluate(() => window.speechSynthesis.speaking));
  console.log('2b) btn has .speaking:', await page.evaluate(() => document.querySelector('#fc-card [data-say]').classList.contains('speaking')));

  await page.click('#fc-card');
  await page.waitForTimeout(50);
  console.log('3) speaking after flip 1 (to back):', await page.evaluate(() => window.speechSynthesis.speaking));
  console.log('3b) btn has .speaking after flip1:', await page.evaluate(() => { var b = document.querySelector('#fc-card [data-say]'); return b ? b.classList.contains('speaking') : 'NO BTN FOUND'; }));
  console.log('3c) is-flipped:', await page.evaluate(() => document.getElementById('fc-card').classList.contains('is-flipped')));

  await page.click('#fc-card');
  await page.waitForTimeout(50);
  console.log('4) is-flipped after flip 2 (back to front):', await page.evaluate(() => document.getElementById('fc-card').classList.contains('is-flipped')));
  const listenBtn3 = await page.$('#fc-card [data-say]');
  console.log('4b) listenBtn3 found:', !!listenBtn3);
  console.log('4c) listenBtn3 has .speaking before 2nd listen click:', await page.evaluate(() => { var b = document.querySelector('#fc-card [data-say]'); return b ? b.classList.contains('speaking') : 'NO BTN'; }));
  if (listenBtn3) {
    const clickResult = await listenBtn3.click({ force: true }).then(() => 'clicked ok').catch(e => 'click error: ' + e.message);
    console.log('4d) click result:', clickResult);
  }
  await page.waitForTimeout(100);
  console.log('5) speaking again:', await page.evaluate(() => window.speechSynthesis.speaking));
  console.log('5b) fcAnswered:', await page.evaluate(() => window.__fcAnswered));
  console.log('5c) fcNavLocked:', await page.evaluate(() => window.__fcNavLocked));

  await browser.close();
}
run().catch(e => { console.error(e); process.exit(1); });
