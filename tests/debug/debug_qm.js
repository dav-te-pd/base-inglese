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
  await page.fill('#name-input', 'DebugQM');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate((userName) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: ['personalizzazione','repeatAloud','speakEasy','voiceCoach'] }));
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach','quickMatchEngIta'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, 'DebugQM');
  await page.click('#go-episode');
  await page.waitForTimeout(150);
  await page.click('[data-module="quickMatchEngIta"]');
  await page.waitForTimeout(300);
  console.log('start btn visible:', await page.isVisible('#qm-start-btn').catch(()=>false));
  await page.click('#qm-start-btn').catch(()=>{});
  await page.waitForTimeout(200);

  for (let i = 0; i < 25; i++) {
    const state = await page.evaluate(() => ({
      quizVisible: !document.getElementById('qm-quiz-screen').hidden,
      summaryVisible: !document.getElementById('qm-summary-screen').hidden,
      retryIntroVisible: !document.getElementById('qm-retry-intro-screen').hidden,
      dontknowVisible: !document.getElementById('qm-dontknow-btn').hidden,
      advanceVisible: !document.getElementById('qm-advance-btn').hidden,
      popupOpen: document.getElementById('attempt-popup').classList.contains('is-open'),
      counter: document.getElementById('qm-counter') ? document.getElementById('qm-counter').textContent : null
    }));
    console.log(i, JSON.stringify(state));
    if (state.popupOpen) { console.log('POPUP OPEN, stopping'); break; }
    if (state.summaryVisible) { console.log('SUMMARY reached, stopping'); break; }
    if (state.dontknowVisible) { await page.click('#qm-dontknow-btn'); await page.waitForTimeout(150); continue; }
    if (state.advanceVisible) { await page.click('#qm-advance-btn'); await page.waitForTimeout(150); continue; }
    if (state.retryIntroVisible) { await page.click('#qm-retry-continue-btn'); await page.waitForTimeout(150); continue; }
    await page.waitForTimeout(150);
  }
  await browser.close();
}
run();
