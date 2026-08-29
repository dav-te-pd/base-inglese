const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = 'http://localhost:8955/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 15); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  const OrigAC = window.AudioContext || window.webkitAudioContext;
  if (OrigAC) {
    window.__tonesLog = [];
    const OrigCreateOscillator = OrigAC.prototype.createOscillator;
    const OrigCreateGain = OrigAC.prototype.createGain;
    OrigAC.prototype.createOscillator = function () {
      const osc = OrigCreateOscillator.call(this);
      let freq = null;
      Object.defineProperty(osc.frequency, 'value', { set(v) { freq = v; }, get() { return freq; } });
      osc.__getFreq = () => freq;
      window.__pendingOsc = osc;
      return osc;
    };
    OrigAC.prototype.createGain = function () {
      const gain = OrigCreateGain.call(this);
      const origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
      gain.gain.setValueAtTime = function (v, t) {
        if (window.__pendingOsc) {
          var summaryEl = document.getElementById('qm-summary-screen');
          window.__tonesLog.push({
            freq: window.__pendingOsc.__getFreq(),
            t: performance.now(),
            qmSummaryHidden: summaryEl ? summaryEl.hidden : null
          });
        }
        return origSetValueAtTime(v, t);
      };
      return gain;
    };
  }
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
    ['mappaEpisodio','personalizzazione','repeatAloud','speakEasy','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  await page.addInitScript(mockInit);
  await bootAsUser(page, 'ProbeQM', ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng']);
  await page.click('[data-module="quickMatchEngIta"]');
  await page.waitForTimeout(250);
  const startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
  console.log('start btn visible:', startVisible);
  if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }

  const vocab = await page.evaluate(() => fetch('data/a1-episodio1-inglese.json').then(r => r.json()).then(d => d.vocabulary));
  const engToIta = {}; const itaToEng = {};
  vocab.forEach(v => { engToIta[v.english] = v.italian; itaToEng[v.italian] = v.english; });

  // Answer every question correctly (find the option whose text matches the
  // known correct translation for the current prompt, click it).
  for (let i = 0; i < 30; i++) {
    const summaryVisible = await page.isVisible('#qm-summary-screen').catch(() => false);
    if (summaryVisible) break;
    const quizVisible = await page.isVisible('#qm-quiz-screen').catch(() => false);
    if (!quizVisible) { await page.waitForTimeout(200); continue; }
    const info = await page.evaluate(({ engToIta, itaToEng }) => {
      var prompt = document.getElementById('qm-prompt').textContent.trim();
      var correct = engToIta[prompt] || itaToEng[prompt] || null;
      var btns = Array.from(document.querySelectorAll('#qm-options .sr-option'));
      var idx = btns.findIndex(b => b.textContent.trim() === correct);
      return { idx, prompt, correct, count: btns.length };
    }, { engToIta, itaToEng });
    if (info.idx === -1) { console.log('NO MATCH', info); break; }
    await page.click('.sr-option[data-qm-index="' + info.idx + '"]');
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(400);
  const tones = await page.evaluate(() => window.__tonesLog);
  console.log(JSON.stringify(tones, null, 2));
  await browser.close();
}

run();
