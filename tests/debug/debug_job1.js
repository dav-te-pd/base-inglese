const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__speakLog = [];
  const fakeSynth = {
    speaking: false,
    _current: null,
    speak(utter) {
      this.speaking = true;
      this._current = utter;
      window.__speakLog.push(utter.text);
      if (utter.onstart) utter.onstart();
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 400);
    },
    cancel() {
      if (this._current) {
        var u = this._current;
        this.speaking = false;
        this._current = null;
        clearTimeout(u._timer);
        setTimeout(() => { if (u.onerror) u.onerror(); }, 30);
      }
    },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() { setTimeout(() => { if (this.onresult) this.onresult({ results: [] }); }, 5); }
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.click('#switch-user').catch(()=>{});
  await page.waitForTimeout(100);
  await page.fill('#name-input', 'Debug1');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((userName) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: ['personalizzazione','repeatAloud','speakEasy','voiceCoach','quickMatchEngIta','quickMatchItaEng','dialogoAscoltaRipeti'] }));
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, 'Debug1');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.click('[data-module="dialogoRipetiATempo"]');
  await page.waitForTimeout(250);
  await page.waitForTimeout(400);
  const startVisible = await page.isVisible('#dg-start-btn').catch(()=>false);
  console.log('start btn visible:', startVisible);
  if (startVisible) { await page.click('#dg-start-btn'); }
  await page.waitForTimeout(200);
  await page.click('.dg-bubble');
  await page.waitForTimeout(200);
  const state = await page.evaluate(() => ({
    speaking: window.speechSynthesis.speaking,
    log: window.__speakLog,
    dgListLen: document.querySelectorAll('#dg-list .dg-bubble').length,
    watchDisabled: document.getElementById('dialogo-watch-btn') && document.getElementById('dialogo-watch-btn').disabled
  }));
  console.log(JSON.stringify(state, null, 2));
  await browser.close();
}
run();
