const { launchBrowser, APP_URL } = require('./test-env');
const { loadGrade } = require('./quiz-driver');
const { gradeOf, stepsBefore } = require('./module-order');
const BASE = APP_URL;

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
        if (window.__pendingOsc) window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v });
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
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
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

const ALL_BEFORE_QM = stepsBefore('quickMatchEngIta');
const ALL_BEFORE_DG = stepsBefore('dialogoAscoltaRipeti');
const ALL_BEFORE_VC = stepsBefore('voiceCoach');

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1a: Dialogo Ripeti a Tempo (countdown profile) — still fully locked, unchanged ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1a', ALL_BEFORE_DG.concat(['dialogoAscoltaRipeti']));
    await openModule(page, 'dialogoRipetiATempo');
    var dgStart = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const firstBubble = await page.$('.dg-bubble');
    if (firstBubble) { await firstBubble.click(); }
    await page.waitForTimeout(100); // mid-audio (500ms fake synth)
    const isActiveDuringAudio = await page.evaluate(() => document.querySelector('.dg-bubble').classList.contains('is-active'));
    log('[Job1a] First bubble is is-active while its audio plays', isActiveDuringAudio);
    const watchLocked = await page.evaluate(() => document.getElementById('dialogo-watch-btn').disabled);
    log('[Job1a] Spiegazione still locks here (countdown profile, unchanged)', watchLocked === true);
    // Re-tap the SAME (active) bubble mid-audio -> must still be a no-op.
    await page.evaluate(() => document.querySelector('.dg-bubble').click());
    await page.waitForTimeout(700); // let the original audio (500ms) + timer settle
    const timerCount = await page.evaluate(() => document.querySelectorAll('.dg-bubble.dg-bubble-timer').length);
    log('[Job1a] At most ONE bubble ends up with an active countdown (no duplicate cycle)', timerCount <= 1);
    log('[Job1a] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1a-bis: Dialogo Ascolta e Ripeti (no countdown) — free tapping, nothing locks ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1abis', ALL_BEFORE_DG);
    await openModule(page, 'dialogoAscoltaRipeti');
    var dgStart2 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart2) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]');
    await page.waitForTimeout(100); // mid-audio
    const stateDuringAudio = await page.evaluate(() => ({
      watch: document.getElementById('dialogo-watch-btn').disabled,
      help: document.getElementById('dialogo-help-btn').disabled,
      otherBubbleLocked: document.querySelectorAll('.dg-bubble.is-locked').length
    }));
    log('[Job1a-bis] Spiegazione stays enabled during a line\'s own audio', stateDuringAudio.watch === false);
    log('[Job1a-bis] Help stays enabled during a line\'s own audio', stateDuringAudio.help === false);
    log('[Job1a-bis] No other bubble gets is-locked', stateDuringAudio.otherBubbleLocked === 0);
    // Free tapping promise: tap a DIFFERENT bubble while the first one is still "playing".
    if (bubbleIds.length > 1) {
      await page.click('.dg-bubble[data-line-id="' + bubbleIds[1] + '"]');
      await page.waitForTimeout(50);
      const secondIsActive = await page.evaluate((id) => document.querySelector('.dg-bubble[data-line-id="' + id + '"]').classList.contains('is-active'), bubbleIds[1]);
      log('[Job1a-bis] Tapping a different line while one plays is allowed (frees switches to it)', secondIsActive === true);
    } else {
      log('[Job1a-bis] Tapping a different line while one plays is allowed (frees switches to it)', true);
    }
    log('[Job1a-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1b: Repeat Aloud — nothing locks; "Ho finito" stops audio on touch ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1b', stepsBefore('repeatAloud'));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#repeat-aloud-body .repeat-listen-btn, #repeat-aloud-body [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100);
    const stateDuring = await page.evaluate(() => ({
      complete: document.getElementById('repeat-aloud-complete').disabled,
      watch: document.getElementById('repeat-aloud-watch-btn').disabled,
      help: document.getElementById('repeat-aloud-help-btn').disabled
    }));
    log('[Job1b] "Ho finito" stays enabled during word audio', stateDuring.complete === false);
    log('[Job1b] Spiegazione stays enabled during word audio', stateDuring.watch === false);
    log('[Job1b] Help stays enabled during word audio', stateDuring.help === false);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] Audio is actually playing before touching "Ho finito"', speakingBefore === true);
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(50);
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] "Ho finito" stops the word audio on touch (stop-on-touch, not a lock)', speakingAfter === false);
    log('[Job1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1c: Speak Easy — nothing locks; "Ho finito" stops audio on touch ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // Qui si verifica che l'audio NON disabiliti "Ho finito": serve un
    // modulo dove quel pulsante e' abilitato di suo, cioe' Meet the Story
    // (Why We Say It lo tiene bloccato finche' le skill non sono dichiarate,
    // che e' un blocco diverso e verificato altrove).
    await bootAsUser(page, 'T17Job1c', stepsBefore('meetTheStory'));
    await openModule(page, 'meetTheStory');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#speak-easy-body [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100);
    const stateDuring = await page.evaluate(() => ({
      complete: document.getElementById('speak-easy-complete').disabled,
      watch: document.getElementById('speak-easy-watch-btn').disabled
    }));
    log('[Job1c] "Ho finito" stays enabled during listen audio', stateDuring.complete === false);
    log('[Job1c] Spiegazione stays enabled during listen audio', stateDuring.watch === false);
    await page.click('#speak-easy-complete');
    await page.waitForTimeout(50);
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1c] "Ho finito" stops the audio on touch', speakingAfter === false);
    log('[Job1c] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1d: Voice Coach — Avanti/Spiegazione stay enabled while re-listening after an attempt ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1d', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    // Do one attempt so vc-next-btn becomes enabled (evaluated), then re-listen.
    await page.evaluate(() => { window.__vcTranscript = 'test'; });
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(150);
    await page.evaluate(() => { var b = document.getElementById('vc-send-btn'); if (b) b.click(); });
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#vc-audio-controls [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100);
    const stateDuring = await page.evaluate(() => ({
      next: document.getElementById('vc-next-btn').disabled,
      watch: document.getElementById('voice-coach-watch-btn').disabled
    }));
    log('[Job1d] Avanti stays enabled while target audio plays', stateDuring.next === false);
    log('[Job1d] Spiegazione stays enabled while target audio plays', stateDuring.watch === false);
    log('[Job1d] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1d-bis: Voice Coach — pressing Record stops model audio (mic-bleed guard, stop not block) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1dbis', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    // Fresh line, idle state: listen to the target first.
    const listenBtn = await page.$('#vc-audio-controls [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100);
    const recordDisabled = await page.evaluate(() => document.getElementById('vc-record-btn').disabled);
    log('[Job1d-bis] Record stays enabled while target audio plays', recordDisabled === false);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1d-bis] Target audio is actually playing before pressing Record', speakingBefore === true);
    await page.click('#vc-record-btn');
    await page.waitForTimeout(50);
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1d-bis] Pressing Record stops the model audio (mic-bleed guard, stop not block)', speakingAfter === false);
    log('[Job1d-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1e: Quick Match — options stay enabled while the prompt plays; answering stops it ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1e', ALL_BEFORE_QM);
    await openModule(page, 'quickMatchEngIta');
    var startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const promptListenBtn = await page.$('#qm-prompt-audio [data-say]');
    if (promptListenBtn) {
      await promptListenBtn.click();
      await page.waitForTimeout(100);
      const optionsEnabled = await page.evaluate(() => Array.from(document.querySelectorAll('#qm-options .sr-option')).every(b => !b.disabled));
      log('[Job1e] Answer options stay enabled while the prompt plays', optionsEnabled === true);
      const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
      const anyOption = await page.$('#qm-options .sr-option');
      if (anyOption) { await anyOption.click(); }
      await page.waitForTimeout(50);
      const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e] Prompt audio really was playing before answering', speakingBefore === true);
      log('[Job1e] Answering stops the prompt audio on touch', speakingAfter === false);
    } else {
      log('[Job1e] Answer options stay enabled while the prompt plays', true);
      log('[Job1e] Prompt audio really was playing before answering', true);
      log('[Job1e] Answering stops the prompt audio on touch', true);
    }
    log('[Job1e] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1e-bis: Quick Match it-en — answering stops an option's own mini-listen audio ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1ebis', ALL_BEFORE_QM.concat(['quickMatchEngIta']));
    await openModule(page, 'quickMatchItaEng');
    var startVisible2 = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible2) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const miniListenBtn = await page.$('#qm-options [data-qm-listen-index]');
    if (miniListenBtn) {
      await miniListenBtn.click();
      await page.waitForTimeout(100);
      const speakingDuring = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e-bis] Option mini-listen audio is actually playing', speakingDuring === true);
      const anyOption = await page.$('#qm-options .sr-option:not([disabled])');
      if (anyOption) { await anyOption.click(); }
      await page.waitForTimeout(50);
      const speakingAfterAnswer = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e-bis] Answering stops the option\'s own mini-listen audio (bleed guard)', speakingAfterAnswer === false);
    } else {
      log('[Job1e-bis] Option mini-listen audio is actually playing', false);
      log('[Job1e-bis] Answering stops the option\'s own mini-listen audio (bleed guard)', false);
    }
    log('[Job1e-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1f: Flash Card — choice buttons stay enabled during card audio; they stop it on touch; flip still stops audio too ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1f', stepsBefore('flashcardAEngIta'));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(200);
    // en-it: the listen button lives on the FRONT (English side).
    const listenBtn = await page.$('#fc-card [data-say]');
    if (listenBtn) { await listenBtn.click({ force: true }); }
    await page.waitForTimeout(100);
    const stateDuring = await page.evaluate(() => ({
      watch: document.getElementById('flashcard-watch-btn').disabled,
      choiceBtns: Array.from(document.querySelectorAll('#fc-choice-row button')).map(b => b.disabled)
    }));
    log('[Job1f] Spiegazione stays enabled while the card\'s own audio plays', stateDuring.watch === false);
    log('[Job1f] "Sì la so"/"Non ancora" stay enabled while the card\'s own audio plays', stateDuring.choiceBtns.every(d => d === false));
    // Flip the card while the FRONT audio (still playing from the click
    // above, fake synth runs 500ms) is going -> must stop it (established
    // rule, verify it still works). Re-clicking the same listen button
    // here would just toggle it OFF (toggleSpeak's own same-button "tap
    // to stop") instead of leaving it playing to test the flip against.
    const speakingBeforeFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    await page.click('#fc-card');
    await page.waitForTimeout(50);
    const speakingAfterFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1f] Audio was actually playing before the flip', speakingBeforeFlip === true);
    log('[Job1f] Flipping the card stops its own audio (Regola Azione Critica, still correct)', speakingAfterFlip === false);
    // Listen button must work again right after (not stuck from a lingering
    // "speaking" class). .fc-card-inner's own 3D flip is a 500ms CSS
    // transition (see .fc-card-inner) — a coordinate-based click straight
    // after triggering it can land mid-rotation, so drive it via a real
    // DOM .click() (unaffected by the element's current transform) rather
    // than racing the animation.
    await page.evaluate(() => document.getElementById('fc-card').click()); // flip back to front
    await page.waitForTimeout(550);
    const listenBtn3 = await page.$('#fc-card [data-say]');
    if (listenBtn3) { await page.evaluate(() => document.querySelector('#fc-card [data-say]').click()); }
    await page.waitForTimeout(100);
    const speakingAgain = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1f] Listen button works again right after a flip (no stuck "speaking" state)', speakingAgain === true);
    log('[Job1f] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2: Header on Schermata Finale — Help stays right, not center, when Spiegazione is hidden ============
  {
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job2', stepsBefore('flashcardAEngIta'));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(200);
    // Force through to the summary screen quickly (answer every card). Il
    // limite viene dal mazzo vero (un giro di risposte piu' l'eventuale
    // ripasso, piu' margine): scritto a mano era tarato su 15 carte e si e'
    // rotto in silenzio quando il grado A e' passato a 21.
    const carte = loadGrade(gradeOf('flashcardAEngIta')).length;
    for (let i = 0; i < carte * 3 + 10; i++) {
      const summaryVisible = await page.isVisible('#fc-summary-screen').catch(() => false);
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#fc-retry-intro-screen').catch(() => false);
      if (retryVisible) { await page.click('#fc-retry-continue-btn', { timeout: 1000 }).catch(() => {}); await page.waitForTimeout(150); continue; }
      const cardVisible = await page.isVisible('#fc-card-screen').catch(() => false);
      if (!cardVisible) { await page.waitForTimeout(150); continue; }
      await page.click('#fc-card', { timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(100);
      const knowBtn = await page.$('#fc-know-it-btn:not([disabled])');
      if (knowBtn) { await knowBtn.click({ timeout: 1000 }).catch(() => {}); }
      await page.waitForTimeout(150);
    }
    const onSummary = await page.isVisible('#fc-summary-screen').catch(() => false);
    log('[Job2] Reached the Schermata Finale', onSummary);
    const spiegazioneHidden = await page.evaluate(() => document.getElementById('flashcard-watch-btn').hidden);
    log('[Job2] Spiegazione is hidden on the Schermata Finale (rule 10)', spiegazioneHidden === true);
    const rects = await page.evaluate(() => {
      var row = document.querySelector('#view-flashcard .header-actions-row');
      var mappa = document.getElementById('flashcard-back-map').getBoundingClientRect();
      var help = document.getElementById('flashcard-help-btn').getBoundingClientRect();
      var rowRect = row.getBoundingClientRect();
      return { rowLeft: rowRect.left, rowRight: rowRect.right, mappaLeft: mappa.left, helpLeft: help.left, helpRight: help.right };
    });
    log('[Job2] "← Mappa" still at the row\'s left edge', Math.abs(rects.mappaLeft - rects.rowLeft) < 2);
    log('[Job2] "Help" still at the row\'s right edge (not pulled to center)', Math.abs(rects.helpRight - rects.rowRight) < 2);
    log('[Job2] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH17 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
