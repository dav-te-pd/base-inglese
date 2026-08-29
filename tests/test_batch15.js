const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const fs = require('fs');
const BASE = APP_URL;

// Il vocabolario dell'episodio, letto dalla stessa fonte che usa l'app: così
// il test sa qual è la risposta giusta a ogni domanda invece di indovinarla
// dalla posizione del pulsante (CLAUDE.md regola 19 — vedi srAnswerQuestion).
const EPISODE = JSON.parse(fs.readFileSync(repoPath('data', 'a1-episodio1-inglese.json'), 'utf8'));
// Direzione en-it: la domanda è l'inglese, la risposta corretta l'italiano.
const SR_CORRECT_BY_PROMPT = {};
EPISODE.vocabulary.forEach(function (v) { SR_CORRECT_BY_PROMPT[v.english.trim()] = v.italian.trim(); });

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

  const OrigAC = window.AudioContext || window.webkitAudioContext;
  if (OrigAC) {
    window.__playedTones = [];
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
          window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v, qmSummaryHidden: summaryEl ? summaryEl.hidden : null });
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
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'speakEasy', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

// The safety-valve popup (attemptsReminderThreshold) can appear mid-quiz
// and blocks further option clicks until dismissed — always check for it
// before trying to interact with the quiz itself.
async function dismissAttemptPopupIfOpen(page) {
  const isOpen = await page.evaluate(() => {
    var el = document.getElementById('attempt-popup');
    return !!el && el.classList.contains('is-open');
  }).catch(() => false);
  if (isOpen) {
    await page.click('#attempt-popup-next', { timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(150);
    return true;
  }
  return false;
}

// ---- Speed Round: pilotaggio basato sullo stato, non sui millisecondi ----
// (CLAUDE.md regola 19)
//
// Legge tutto lo stato che serve in un'unica valutazione sincrona dentro la
// pagina, invece di interrogare il DOM un pezzo alla volta con round-trip
// separati: fra la lettura della domanda e il click non c'è una finestra in
// cui il conto alla rovescia possa cambiare la schermata sotto i piedi al
// test.
function srReadState(page) {
  return page.evaluate(function () {
    // Visibilità reale a schermo, non solo l'attributo hidden: una classe
    // con un proprio display può batterlo (CLAUDE.md regola 12).
    var vis = function (id) { var el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
    var popup = document.getElementById('attempt-popup');
    var prompt = document.getElementById('sr-prompt');
    return {
      popupOpen: !!popup && popup.classList.contains('is-open'),
      screen: vis('sr-summary-screen') ? 'summary'
        : vis('sr-retry-intro-screen') ? 'retryIntro'
        : vis('sr-quiz-screen') ? 'quiz'
        : vis('sr-countdown-screen') ? 'countdown'
        : vis('sr-start-screen') ? 'start' : 'altro',
      inRetryPass: vis('sr-ripasso-badge'),
      prompt: prompt ? prompt.textContent.trim() : '',
      options: Array.prototype.map.call(document.querySelectorAll('#sr-options .sr-option'), function (b) {
        return { text: b.textContent.trim(), disabled: b.disabled };
      }),
      advanceVisible: vis('sr-advance-btn')
    };
  });
}

// Attende che lo stato di Speed Round cambi davvero, descritto da un
// predicato valutato dentro la pagina. Nessun waitForTimeout: se la macchina
// è lenta aspetta di più, se è veloce prosegue subito.
function srWaitFor(page, predicate, arg) {
  return page.waitForFunction(predicate, arg, { timeout: 20000 });
}

// Attraversa il modulo rispondendo secondo `answer`: 'wrong' al primo giro e
// 'correct' al ripasso, o quello che gli si passa. Torna quando compare la
// Schermata Finale. Sceglie il pulsante confrontando il testo delle opzioni
// con la traduzione vera presa dal file dell'episodio — prima cliccava sempre
// la prima opzione, che essendo mescolata è quella giusta una volta su
// quattro: il "primo giro tutto sbagliato" non era garantito, ed è questo che
// rendeva il test intermittente.
async function srPlayThroughModule(page, answerFor) {
  for (var guard = 0; guard < 300; guard++) {
    var st = await srReadState(page);

    if (st.popupOpen) {
      await page.locator('#attempt-popup-next').click();
      await srWaitFor(page, function () {
        var p = document.getElementById('attempt-popup');
        return !p || !p.classList.contains('is-open');
      });
      continue;
    }

    if (st.screen === 'summary') return true;

    if (st.screen === 'start') {
      await page.locator('#sr-ready-btn').click();
      await srWaitFor(page, function () {
        var e = document.getElementById('sr-start-screen');
        return !e || e.getClientRects().length === 0;
      });
      continue;
    }

    if (st.screen === 'countdown') {
      // Il 3-2-1 iniziale: si aspetta che finisca da solo, senza indovinarne
      // la durata.
      await srWaitFor(page, function () {
        var e = document.getElementById('sr-quiz-screen');
        return !!e && e.getClientRects().length > 0;
      });
      continue;
    }

    if (st.screen === 'retryIntro') {
      await page.locator('#sr-retry-continue-btn').click();
      await srWaitFor(page, function () {
        var e = document.getElementById('sr-retry-intro-screen');
        return !e || e.getClientRects().length === 0;
      });
      continue;
    }

    if (st.screen !== 'quiz') {
      await srWaitFor(page, function () {
        var e = document.getElementById('sr-quiz-screen');
        return !!e && e.getClientRects().length > 0;
      });
      continue;
    }

    // "Avanti" dopo una risposta sbagliata o un tempo scaduto.
    if (st.advanceVisible) {
      await page.locator('#sr-advance-btn').click();
      await srWaitFor(page, function () {
        var e = document.getElementById('sr-advance-btn');
        return !e || e.getClientRects().length === 0;
      });
      continue;
    }

    if (!st.options.length) {
      await srWaitFor(page, function () { return document.querySelectorAll('#sr-options .sr-option').length > 0; });
      continue;
    }

    var correctText = SR_CORRECT_BY_PROMPT[st.prompt];
    if (correctText === undefined) throw new Error('Domanda non presente nel vocabolario dell\'episodio: "' + st.prompt + '"');
    var wantCorrect = answerFor(st) === 'correct';
    var index = -1;
    for (var i = 0; i < st.options.length; i++) {
      var isCorrect = st.options[i].text === correctText;
      if (wantCorrect ? isCorrect : !isCorrect) { index = i; break; }
    }
    if (index === -1) throw new Error('Nessuna opzione ' + (wantCorrect ? 'corretta' : 'sbagliata') + ' per "' + st.prompt + '"');

    await page.locator('#sr-options .sr-option').nth(index).click();
    // Dopo il click la schermata cambia in uno di questi modi: compare
    // "Avanti" (sbagliata o tempo scaduto), cambia la domanda, si apre il
    // popup dei tentativi, o si arriva al ripasso/riepilogo. Si aspetta che
    // sia successo qualcosa, non un tempo fisso.
    await srWaitFor(page, function (prev) {
      var vis = function (id) { var el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
      var popup = document.getElementById('attempt-popup');
      var prompt = document.getElementById('sr-prompt');
      return vis('sr-advance-btn')
        || vis('sr-summary-screen')
        || vis('sr-retry-intro-screen')
        || (!!popup && popup.classList.contains('is-open'))
        || (!!prompt && prompt.textContent.trim() !== prev);
    }, st.prompt);
  }
  throw new Error('Speed Round non ha raggiunto la Schermata Finale entro il limite di passi');
}

const ALL_BEFORE_QM = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng'];
const ALL_BEFORE_VP = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng'];
const ALL_BEFORE_DG_TEMPO = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti'];
const ALL_BEFORE_SR = ['personalizzazione', 'repeatAloud', 'speakEasy', 'flashcardAEngIta', 'flashcardAItaEng', 'quickMatchEngIta', 'quickMatchItaEng', 'voicePractice', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'];

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1: Traguardo timing (Quick Match) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job1', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    var startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const vocab = await page.evaluate(() => fetch('data/a1-episodio1-inglese.json').then(r => r.json()).then(d => d.vocabulary));
    const engToIta = {}; vocab.forEach(v => { engToIta[v.english] = v.italian; });
    for (let i = 0; i < 30; i++) {
      const summaryVisible = await page.isVisible('#qm-summary-screen').catch(() => false);
      if (summaryVisible) break;
      const quizVisible = await page.isVisible('#qm-quiz-screen').catch(() => false);
      if (!quizVisible) { await page.waitForTimeout(150); continue; }
      const idx = await page.evaluate((engToIta) => {
        var prompt = document.getElementById('qm-prompt').textContent.trim();
        var correct = engToIta[prompt];
        var btns = Array.from(document.querySelectorAll('#qm-options .sr-option'));
        return btns.findIndex(b => b.textContent.trim() === correct);
      }, engToIta);
      if (idx === -1) break;
      await page.click('.sr-option[data-qm-index="' + idx + '"]');
      await page.waitForTimeout(650);
    }
    await page.waitForTimeout(300);
    const tones = await page.evaluate(() => window.__playedTones);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job1] Traguardo (3 ascending notes) played at least once', traguardoTones.length >= 3);
    log('[Job1] Every Traguardo note fired with qm-summary-screen ALREADY visible', traguardoTones.every(t => t.qmSummaryHidden === false));
    log('[Job1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2: ModuleRules on Quick Match/Speed Round, SelfScoreRules on Flash Card ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job2', []);
    log('[Job2 config] moduleOutcomeRules has quickMatchEngIta/speedRoundEngIta = moduleRules', await page.evaluate(() =>
      window.APP_CONFIG.moduleOutcomeRules.quickMatchEngIta === 'moduleRules' &&
      window.APP_CONFIG.moduleOutcomeRules.speedRoundEngIta === 'moduleRules'));
    log('[Job2 config] moduleOutcomeRules.flashcardAEngIta = selfScoreRules', await page.evaluate(() =>
      window.APP_CONFIG.moduleOutcomeRules.flashcardAEngIta === 'selfScoreRules'));
    log('[Job2 config] moduleOutcomeRules.speakEasy = selfScoreRules', await page.evaluate(() =>
      window.APP_CONFIG.moduleOutcomeRules.speakEasy === 'selfScoreRules'));
    log('[Job2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2b: Quick Match colors the map (all correct -> verde) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job2b', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    var startVisible2 = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible2) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const vocab2 = await page.evaluate(() => fetch('data/a1-episodio1-inglese.json').then(r => r.json()).then(d => d.vocabulary));
    const engToIta2 = {}; vocab2.forEach(v => { engToIta2[v.english] = v.italian; });
    for (let i = 0; i < 30; i++) {
      const summaryVisible = await page.isVisible('#qm-summary-screen').catch(() => false);
      if (summaryVisible) break;
      const quizVisible = await page.isVisible('#qm-quiz-screen').catch(() => false);
      if (!quizVisible) { await page.waitForTimeout(150); continue; }
      const idx = await page.evaluate((engToIta) => {
        var prompt = document.getElementById('qm-prompt').textContent.trim();
        var correct = engToIta[prompt];
        var btns = Array.from(document.querySelectorAll('#qm-options .sr-option'));
        return btns.findIndex(b => b.textContent.trim() === correct);
      }, engToIta2);
      if (idx === -1) break;
      await page.click('.sr-option[data-qm-index="' + idx + '"]');
      await page.waitForTimeout(650);
    }
    await page.waitForTimeout(300);
    await page.click('#qm-complete-btn');
    await page.waitForTimeout(200);
    const rowClass = await page.evaluate(() => document.querySelector('[data-module="quickMatchEngIta"]').className);
    log('[Job2b] Quick Match map row carries outcome-verde after all-correct run', rowClass.indexOf('outcome-verde') !== -1);
    log('[Job2b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 3: Voice Practice attempt counter (proactive, not lagging) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job3', ALL_BEFORE_VP);
    await openModule(page, 'voicePractice');
    var vpStart = await page.isVisible('#voice-coach-intro-start-btn').catch(() => false);
    if (vpStart) { await page.click('#voice-coach-intro-start-btn'); await page.waitForTimeout(150); }
    await page.evaluate(() => { window.__vcTranscript = 'zzz totally wrong nonsense'; });
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(100);
    await page.evaluate(() => document.getElementById('vc-send-btn').click());
    await page.waitForTimeout(150);
    const labelAfterAttempt1 = await page.$eval('#vc-attempt-label', el => el.textContent);
    log('[Job3] After attempt 1, label reads "TENTATIVO 1 DI 3"', labelAfterAttempt1.indexOf('1') !== -1 && labelAfterAttempt1.indexOf('3') !== -1);
    // Click "Riprova" - label must show attempt 2 BEFORE recording again.
    await page.click('#voice-coach-retry-btn');
    await page.waitForTimeout(80);
    const labelAfterRetryClick = await page.$eval('#vc-attempt-label', el => el.textContent);
    log('[Job3] Immediately after "Riprova" (before recording), label already reads "TENTATIVO 2 DI 3"', labelAfterRetryClick.indexOf('2') !== -1 && labelAfterRetryClick.indexOf('3') !== -1);
    // Complete attempt 2, then click Riprova again -> must show 3 (the LAST one) before recording.
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(100);
    await page.evaluate(() => document.getElementById('vc-send-btn').click());
    await page.waitForTimeout(150);
    await page.click('#voice-coach-retry-btn');
    await page.waitForTimeout(80);
    const labelAfterSecondRetryClick = await page.$eval('#vc-attempt-label', el => el.textContent);
    log('[Job3] Before the LAST (3rd) attempt, label already reads "TENTATIVO 3 DI 3" (not stuck at 2)', labelAfterSecondRetryClick.indexOf('3 DI 3') !== -1 || (labelAfterSecondRetryClick.indexOf('3') !== -1 && labelAfterSecondRetryClick.split('3').length > 2));
    log('[Job3] No JS errors', errors.length === 0);
    // Layout: label sits in the same row as "Riprova", to its left.
    const layout = await page.evaluate(() => {
      var row = document.getElementById('voice-coach-retry-btn').closest('.vc-retry-row');
      var label = document.getElementById('vc-attempt-label');
      var btn = document.getElementById('voice-coach-retry-btn');
      return row && row.contains(label) && row.contains(btn) && label.compareDocumentPosition(btn) === Node.DOCUMENT_POSITION_FOLLOWING;
    });
    log('[Job3] Attempt label sits in the same row as "Riprova", before it', layout);
    await page.close();
  }

  // ============ JOB 4: Schermata Ripasso, two distinct passes ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job4', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    var startVisible3 = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible3) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    // Answer every question WRONG on the first pass -> guarantees a retry pass.
    let sawFirstRetryTitle = null, sawFirstRetryText = null;
    for (let i = 0; i < 40; i++) {
      if (await dismissAttemptPopupIfOpen(page)) continue;
      const retryVisible = await page.isVisible('#qm-retry-intro-screen').catch(() => false);
      if (retryVisible) {
        // applyRetryIntroContent fills title/text ASYNCHRONOUSLY (fetch) —
        // wait for it instead of racing the promise.
        await page.waitForFunction(() => {
          var t = document.getElementById('qm-retry-intro-screen-title');
          return t && t.textContent.trim().length > 0;
        }, { timeout: 3000 }).catch(() => {});
        sawFirstRetryTitle = await page.$eval('#qm-retry-intro-screen-title', el => el.textContent).catch(() => null);
        sawFirstRetryText = await page.$eval('#qm-retry-intro-screen-text', el => el.textContent).catch(() => null);
        await page.click('#qm-retry-continue-btn');
        await page.waitForTimeout(150);
        break;
      }
      const quizVisible = await page.isVisible('#qm-quiz-screen').catch(() => false);
      if (!quizVisible) { await page.waitForTimeout(150); continue; }
      const optionCount = await page.locator('#qm-options .sr-option').count();
      if (!optionCount) { await page.waitForTimeout(150); continue; }
      await page.locator('#qm-options .sr-option').first().click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(120);
      const advanceVisible = await page.isVisible('#qm-advance-btn').catch(() => false);
      if (advanceVisible) { await page.click('#qm-advance-btn', { timeout: 1000 }).catch(() => {}); }
      await page.waitForTimeout(150);
    }
    log('[Job4] First retry screen has a non-empty title', !!sawFirstRetryTitle && sawFirstRetryTitle.trim().length > 0);
    log('[Job4] First retry screen has a non-empty text', !!sawFirstRetryText && sawFirstRetryText.trim().length > 0);
    // Push through the retry pass wrong again to reach the SECOND (last) retry screen.
    let sawLastRetryTitle = null, sawLastRetryText = null;
    for (let i = 0; i < 40; i++) {
      if (await dismissAttemptPopupIfOpen(page)) continue;
      const retryVisible = await page.isVisible('#qm-retry-intro-screen').catch(() => false);
      if (retryVisible) {
        await page.waitForFunction(() => {
          var t = document.getElementById('qm-retry-intro-screen-title');
          return t && t.textContent.trim().length > 0;
        }, { timeout: 3000 }).catch(() => {});
        sawLastRetryTitle = await page.$eval('#qm-retry-intro-screen-title', el => el.textContent).catch(() => null);
        sawLastRetryText = await page.$eval('#qm-retry-intro-screen-text', el => el.textContent).catch(() => null);
        break;
      }
      const quizVisible = await page.isVisible('#qm-quiz-screen').catch(() => false);
      if (!quizVisible) { await page.waitForTimeout(150); continue; }
      const optionCount = await page.locator('#qm-options .sr-option').count();
      if (!optionCount) { await page.waitForTimeout(150); continue; }
      await page.locator('#qm-options .sr-option').first().click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(120);
      const advanceVisible = await page.isVisible('#qm-advance-btn').catch(() => false);
      if (advanceVisible) { await page.click('#qm-advance-btn', { timeout: 1000 }).catch(() => {}); }
      await page.waitForTimeout(150);
    }
    const data = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()));
    log('[Job4] First retry title comes from retryIntroMessages.first.titles', data.retryIntroMessages.first.titles.indexOf(sawFirstRetryTitle) !== -1);
    log('[Job4] Second/last retry title comes from retryIntroMessages.last.titles (different pool)', !!sawLastRetryTitle && data.retryIntroMessages.last.titles.indexOf(sawLastRetryTitle) !== -1);
    log('[Job4] First and last retry texts are drawn from different pools', data.retryIntroMessages.first.bodies.indexOf(sawFirstRetryText) !== -1 && data.retryIntroMessages.last.bodies.indexOf(sawLastRetryText) !== -1);
    log('[Job4] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 5: Ripasso badge font-size matches direction label ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job5', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    var startVisible4 = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible4) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const sizes = await page.evaluate(() => {
      var direction = document.getElementById('qm-direction');
      var badge = document.getElementById('qm-ripasso-badge');
      return {
        directionSize: getComputedStyle(direction).fontSize,
        badgeSize: getComputedStyle(badge).fontSize
      };
    });
    log('[Job5] .ripasso-badge font-size equals .sr-direction font-size', sizes.directionSize === sizes.badgeSize);
    log('[Job5] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 6: module category visible inside the module header ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job6', ALL_BEFORE_QM);
    await openModule(page, 'repeatAloud');
    const raType = await page.$eval('#repeat-aloud-type-badge', el => el.textContent).catch(() => null);
    log('[Job6] Repeat Aloud header shows type badge "Studio"', raType === 'Studio');
    await page.click('#repeat-aloud-back-map');
    await page.waitForTimeout(150);
    await openModule(page, 'quickMatchEngIta');
    const qmType = await page.$eval('#quick-match-type-badge', el => el.textContent).catch(() => null);
    log('[Job6] Quick Match header shows type badge "Studio"', qmType === 'Studio');
    log('[Job6] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 7: Help/Spiegazione fixed width across screens ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job7', ALL_BEFORE_QM);
    await openModule(page, 'repeatAloud');
    const widthAllVisible = await page.$eval('#repeat-aloud-watch-btn', el => el.getBoundingClientRect().width);
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(150);
    // On the summary screen Spiegazione is hidden (rule 10) but Help stays -> Help's width should be unchanged.
    const helpWidthAllVisible = await page.$eval('#repeat-aloud-help-btn', el => el.getBoundingClientRect().width);
    const helpWidthOnSummary = helpWidthAllVisible; // re-read below
    const widthOnSummaryHelp = await page.$eval('#repeat-aloud-help-btn', el => el.getBoundingClientRect().width);
    log('[Job7] "Help" width unchanged whether Spiegazione is visible or hidden', Math.abs(helpWidthAllVisible - widthOnSummaryHelp) < 1);
    log('[Job7] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 8: "Prossima frase" only clickable during the countdown ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job8', ALL_BEFORE_DG_TEMPO);
    await openModule(page, 'dialogoRipetiATempo');
    var dgStart = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const disabledBeforeAnyPlay = await page.$eval('#dg-next-line-btn', el => el.disabled).catch(() => null);
    log('[Job8] "Prossima frase" starts disabled (nothing playing yet)', disabledBeforeAnyPlay === true);
    // Play the first bubble -> its countdown starts -> button should enable.
    const firstBubble = await page.$('.dg-bubble');
    if (firstBubble) { await firstBubble.click(); await page.waitForTimeout(400); }
    const disabledDuringCountdown = await page.$eval('#dg-next-line-btn', el => el.disabled).catch(() => null);
    log('[Job8] "Prossima frase" enabled while a line\'s countdown bar is running', disabledDuringCountdown === false);
    // Skip it -> job 4 (3rd collaudo): the NEXT line's audio starts playing
    // immediately (same as if the user had tapped it) -> button disables
    // again right away (audio playing, nothing counting down yet) instead
    // of staying idle. Click + read done inside ONE evaluate() instead of
    // two separate round-trips (deterministic fix, same as test_batch14.js
    // Job7b — was racing the fake synth's onend, a real setTimeout at 15ms
    // in this mock's speak(); under a full regression run the Node<->
    // browser round-trip between a separate click() and $eval() can exceed
    // that window, so the "still disabled" read landed after the button
    // had already re-enabled for line 2's own countdown). JS is single-
    // threaded: the pending setTimeout cannot fire while this synchronous
    // browser-side function is still running, so folding click+read into
    // one call makes it atomic and independent of host machine speed.
    const disabledAfterSkip = await page.evaluate(() => {
      var btn = document.getElementById('dg-next-line-btn');
      btn.click();
      return btn.disabled;
    });
    log('[Job8] "Prossima frase" disabled again right after skipping (next line\'s audio now playing)', disabledAfterSkip === true);
    log('[Job8] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 9: dg-toolbar is sticky ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job9', ALL_BEFORE_DG_TEMPO);
    await openModule(page, 'dialogoRipetiATempo');
    const position = await page.$eval('#dg-toolbar', el => getComputedStyle(el).position);
    log('[Job9] .dg-toolbar has position:sticky', position === 'sticky');
    log('[Job9] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 10: Speak Easy — mechanism present, but episode 1 has no explanations yet ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job10', ALL_BEFORE_QM);
    await openModule(page, 'speakEasy');
    await page.waitForTimeout(200);
    const explanationButtonCount = await page.evaluate(() => document.querySelectorAll('[data-toggle-explanation]').length);
    log('[Job10] "Cosa imparo qui" does not appear anywhere (episode 1 has no whatYouLearn lines)', explanationButtonCount === 0);
    await page.click('#speak-easy-complete');
    await page.waitForTimeout(150);
    const subtitle = await page.$eval('#speak-easy-summary-title-sub', el => el.textContent).catch(() => null);
    const data10 = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()));
    log('[Job10] With zero explanations, summary falls back to studioCompleteMessages (neutral, not scored)', data10.studioCompleteMessages.default.indexOf(subtitle) !== -1);
    await page.click('#speak-easy-complete-btn');
    await page.waitForTimeout(150);
    const rowClass10 = await page.evaluate(() => document.querySelector('[data-module="speakEasy"]').className);
    log('[Job10] With zero explanations, map row does NOT carry any outcome-* class (falls back to plain Completato)', !/outcome-(verde|giallo|rosso)/.test(rowClass10));
    log('[Job10] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 11: first-pass-only score, spot-check on Speed Round ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T15Job11', ALL_BEFORE_SR);
    await openModule(page, 'speedRoundEngIta');
    // Tutto sbagliato al primo giro, tutto giusto al ripasso: il punteggio
    // salvato deve restare quello del primo giro (rosso), non essere gonfiato
    // dal ripasso. Prima il test cliccava alla cieca la prima opzione in
    // entrambi i giri, quindi non verificava davvero quello che il suo nome
    // dice — ora la scelta viene dai dati dell'episodio.
    await srPlayThroughModule(page, function (st) { return st.inRetryPass ? 'correct' : 'wrong'; });
    await page.locator('#sr-complete-btn').click();
    await page.waitForFunction(() => {
      var row = document.querySelector('[data-module="speedRoundEngIta"]');
      return !!row && /outcome-/.test(row.className);
    }, null, { timeout: 20000 });
    const rowClass11 = await page.evaluate(() => document.querySelector('[data-module="speedRoundEngIta"]').className);
    log('[Job11] Speed Round: first-pass-all-wrong-then-fixed-in-retry still saves rosso (not inflated by the retry pass)', rowClass11.indexOf('outcome-rosso') !== -1);
    log('[Job11] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH15 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
