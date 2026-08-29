const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__speakLog = [];
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      window.__speakLog.push(utter.text);
      if (utter.onstart) utter.onstart();
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 30);
    },
    cancel() {
      if (this._current) {
        var u = this._current; this.speaking = false; this._current = null;
        clearTimeout(u._timer);
        setTimeout(() => { if (u.onerror) u.onerror(); }, 5);
      }
    },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {
      setTimeout(() => {
        if (this.onresult) {
          var text = window.__vcTranscript || '';
          this.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
        }
      }, 5);
    }
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.click('#switch-user').catch(()=>{});
  await page.waitForTimeout(100);
  await page.fill('#name-input', 'DebugMic');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((userName) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: ['personalizzazione','repeatAloud','speakEasy'] }));
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, 'DebugMic');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.evaluate(() => { window.__vcTranscript = ''; });
  await page.click('[data-module="voiceCoach"]');
  await page.waitForTimeout(300);

  for (let i = 0; i < 3; i++) {
    console.log('--- iteration', i, '---');
    const state1 = await page.evaluate(() => ({
      recordBtnHidden: document.getElementById('vc-record-btn').hidden,
      confirmHidden: document.getElementById('vc-confirm-area').hidden,
      resultHidden: document.getElementById('vc-result').hidden,
      retryDisabled: document.getElementById('voice-coach-retry-btn').disabled
    }));
    console.log('before record:', JSON.stringify(state1));
    await page.click('#vc-record-btn');
    await page.waitForTimeout(300);
    const state2 = await page.evaluate(() => ({
      recordBtnHidden: document.getElementById('vc-record-btn').hidden,
      confirmHidden: document.getElementById('vc-confirm-area').hidden,
      resultHidden: document.getElementById('vc-result').hidden
    }));
    console.log('after record wait:', JSON.stringify(state2));
    await page.click('#vc-send-btn').catch(e => console.log('send-btn click failed:', e.message));
    await page.waitForTimeout(150);
    const state3 = await page.evaluate(() => ({
      recordBtnHidden: document.getElementById('vc-record-btn').hidden,
      confirmHidden: document.getElementById('vc-confirm-area').hidden,
      resultHidden: document.getElementById('vc-result').hidden,
      retryDisabled: document.getElementById('voice-coach-retry-btn').disabled
    }));
    console.log('after send:', JSON.stringify(state3));
    await page.click('#voice-coach-retry-btn').catch(e => console.log('retry-btn click failed:', e.message));
    await page.waitForTimeout(150);
    const state4 = await page.evaluate(() => ({
      recordBtnHidden: document.getElementById('vc-record-btn').hidden,
    }));
    console.log('after retry click:', JSON.stringify(state4));
  }
  await browser.close();
}
run();
