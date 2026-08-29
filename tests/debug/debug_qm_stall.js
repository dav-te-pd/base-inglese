const { launchBrowser, APP_URL } = require('../test-env');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking=true; this._current=utter; if(utter.onstart) utter.onstart(); utter._timer=setTimeout(()=>{ if(this._current===utter){this.speaking=false;this._current=null;} if(utter.onend) utter.onend(); },20); },
    cancel() { if(this._current){var u=this._current;this.speaking=false;this._current=null;clearTimeout(u._timer);} },
    pause(){}, resume(){}, getVoices(){return [{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.addInitScript(mockInit);
  await page.goto(BASE);
  await page.click('#switch-user').catch(()=>{});
  await page.waitForTimeout(100);
  await page.fill('#name-input', 'DebugStall');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((userName) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: ['personalizzazione','repeatAloud','speakEasy','voiceCoach'] }));
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach','quickMatchEngIta'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, 'DebugStall');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.click('[data-module="quickMatchEngIta"]');
  await page.waitForTimeout(300);
  await page.click('#qm-start-btn');
  await page.waitForTimeout(150);

  for (let i = 0; i < 80; i++) {
    const state = await page.evaluate(() => ({
      done: document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden,
      quiz: document.getElementById('qm-quiz-screen') && !document.getElementById('qm-quiz-screen').hidden,
      reveal: document.getElementById('qm-reveal') && !document.getElementById('qm-reveal').hidden,
      retryIntro: document.getElementById('qm-retry-intro-screen') && !document.getElementById('qm-retry-intro-screen').hidden,
      popupOpen: document.getElementById('attempt-popup').classList.contains('is-open'),
      counter: document.getElementById('qm-counter') ? document.getElementById('qm-counter').textContent : null
    }));
    if (i % 5 === 0 || state.popupOpen) console.log(i, JSON.stringify(state));
    if (state.done) { console.log('DONE at', i); break; }
    if (state.retryIntro) { await page.evaluate(() => document.getElementById('qm-retry-continue-btn').click()); await page.waitForTimeout(80); continue; }
    if (state.reveal) { await page.evaluate(() => document.getElementById('qm-advance-btn').click()); await page.waitForTimeout(80); continue; }
    if (state.quiz) {
      const clicked = await page.evaluate(() => { var b = document.querySelector('#qm-options [data-qm-index="0"]:not([disabled])'); if (b) { b.click(); return true; } return false; });
      await page.waitForTimeout(clicked ? 120 : 700);
      continue;
    }
    await page.waitForTimeout(80);
  }
  const finalState = await page.evaluate(() => ({
    done: document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden,
    popupOpen: document.getElementById('attempt-popup').classList.contains('is-open'),
    popupTitle: document.getElementById('attempt-popup-title').textContent
  }));
  console.log('FINAL:', JSON.stringify(finalState));
  await browser.close();
}
run();
