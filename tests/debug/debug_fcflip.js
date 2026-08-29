const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 2000); },
    cancel() {
      console.log('MOCK cancel() called, _current=', !!this._current);
      if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer);
        // Real browsers typically fire onerror('canceled') on cancel() mid-utterance.
        if (u.onerror) u.onerror({ error: 'canceled' });
      }
    },
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
  await bootAsUser(page, 'DebugFC', ['personalizzazione', 'repeatAloud', 'speakEasy']);
  await page.click('[data-module="flashcardAEngIta"]');
  await page.waitForTimeout(300);
  const listenBtn = await page.$('#fc-card [data-say]');
  console.log('listenBtn found:', !!listenBtn);
  if (listenBtn) await listenBtn.click();
  await page.waitForTimeout(150);
  const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
  console.log('speaking before flip:', speakingBefore);
  const btnHasSpeakingClass = await page.evaluate(() => { var b = document.querySelector('#fc-card [data-say]'); return b ? b.classList.contains('speaking') : null; });
  console.log('listen btn has .speaking class before flip:', btnHasSpeakingClass);
  await page.click('#fc-card');
  await page.waitForTimeout(100);
  const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
  console.log('speaking after flip:', speakingAfter);
  const flipped = await page.evaluate(() => document.getElementById('fc-card').classList.contains('is-flipped'));
  console.log('card is-flipped after click:', flipped);
  await browser.close();
}
run().catch(e => { console.error(e); process.exit(1); });
