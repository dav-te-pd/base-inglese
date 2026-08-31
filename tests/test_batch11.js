const { launchBrowser, APP_URL } = require('./test-env');
const { allSteps } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  window.__consoleWarnings = [];
  const origWarn = console.warn.bind(console);
  console.warn = function () { window.__consoleWarnings.push(Array.from(arguments).join(' ')); origWarn.apply(console, arguments); };

  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__toneLog = [];
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking=true; this._current=utter; if(utter.onstart) utter.onstart(); utter._timer=setTimeout(()=>{ if(this._current===utter){this.speaking=false;this._current=null;} if(utter.onend) utter.onend(); },20); },
    cancel() { if(this._current){var u=this._current;this.speaking=false;this._current=null;clearTimeout(u._timer);} },
    pause(){}, resume(){}, getVoices(){return [{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null
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
    ['mappaEpisodio','personalizzazione','repeatAloud','meetTheStory', 'whyWeSayIt','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
    localStorage.setItem('baseinglese:repeatAloudIntroDismissed:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_MODULES = allSteps();

// ---- Voice Coach driving helpers ----

async function vcAnswerLine(page, transcript) {
  await page.evaluate((t) => { window.__vcTranscript = t; }, transcript);
  // .record-toggle-btn.is-recording carries a continuous pulse animation
  // (@keyframes pulse-strong) — Playwright's normal click() waits for the
  // element to be "stable" (unmoving) first, which a looping animation
  // never satisfies, so it times out. Dispatch the click directly instead.
  await page.evaluate(() => document.getElementById('vc-record-btn').click());
  await page.waitForTimeout(120);
  await page.evaluate(() => document.getElementById('vc-record-btn').click()); // toggle: stop
  await page.waitForTimeout(150);
  await page.click('#vc-send-btn');
  await page.waitForTimeout(180);
  const popupOpen = await page.evaluate(() => {
    var el = document.getElementById('attempt-popup');
    return el && el.classList.contains('is-open');
  });
  if (popupOpen) { await page.click('#attempt-popup-next'); await page.waitForTimeout(120); }
}

// A NON-empty but 0%-correct transcript — recognizedWords.length > 0 so
// this never increments vcEmptyRecognitionStreak (job 6's mic-trouble
// detector, a SEPARATE, unrelated mechanism keyed on recordings with NO
// recognized words at all). An empty transcript would eventually flip
// vcMicConfirmedProblem, which silently blocks vcNextLine — not what a
// "score badly" test wants to exercise.
const WRONG_TRANSCRIPT = 'xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy';

// Job 5: this module (voiceCoach) is now the Voice Check variant — ONE
// recording per phrase, no "Riprova" at all. A single wrong evaluate is
// enough: attemptNum is always 1, so the line is simply queued into
// vcRetryQueue for the later Schermata Ripasso pass (handled by
// vcCompleteModule below), same as production behavior.
async function vcCompleteLineWrong(page) {
  await vcAnswerLine(page, WRONG_TRANSCRIPT);
}

// Exact-matches the shown target text -> 100% first-try, 3 stars, never
// queued for retry.
async function vcCompleteLineRight(page) {
  const targetText = await page.evaluate(() => document.getElementById('vc-target').textContent);
  await vcAnswerLine(page, targetText);
}

// Drives the whole module using wrongAtIndex(i) to decide, per MAIN-PASS
// line index (0-based), whether that line's single (job 5: Voice Check has
// no retry) attempt is wrong or right (exact match). vcLastAvgPct freezes
// on this main pass alone, so once the retry-pass (Schermata Ripasso)
// screen appears, every remaining line is answered "right" — it can no
// longer affect the score, it just needs to drain the queue so the module
// can reach its summary screen. Stops once the summary screen appears.
async function vcCompleteModule(page, wrongAtIndex, maxLines) {
  let i = 0;
  let inRetryPass = false;
  for (let guard = 0; guard < maxLines * 2; guard++) {
    const summaryHidden = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
    if (!summaryHidden) return i;
    const retryIntroHidden = await page.evaluate(() => document.getElementById('voice-coach-retry-intro-screen').hidden);
    if (!retryIntroHidden) {
      await page.click('#voice-coach-retry-continue-btn');
      await page.waitForTimeout(180);
      inRetryPass = true;
      continue;
    }
    if (i >= maxLines) return i;
    if (!inRetryPass && wrongAtIndex(i)) { await vcCompleteLineWrong(page); } else { await vcCompleteLineRight(page); }
    i++;
    const summaryHiddenAfter = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
    if (!summaryHiddenAfter) return i;
    const nextDisabled = await page.evaluate(() => document.getElementById('vc-next-btn').disabled);
    if (!nextDisabled) await page.click('#vc-next-btn');
    await page.waitForTimeout(180);
  }
  return i;
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const LINE_COUNT = await (async () => {
    const p = await browser.newPage();
    await p.goto(BASE);
    const n = await p.evaluate(() => fetch('data/a1-episodio1-inglese.json').then(r => r.json()).then(d => d.levels.D.items.length));
    await p.close();
    return n;
  })();

  // ============ CONFIG: moduleOutcomeRules declares the rule per module ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const rules = await page.evaluate(() => window.APP_CONFIG.moduleOutcomeRules);
    log('[Config] moduleOutcomeRules.voiceCoach === "moduleRules"', rules && rules.voiceCoach === 'moduleRules');
    log('[Config] moduleOutcomeRules declares selfAssessment for the 3 Dialogo modules', rules && rules.dialogoAscoltaRipeti === 'selfAssessment' && rules.dialogoRipetiATempo === 'selfAssessment' && rules.dialogoContinuo === 'selfAssessment');
    // whyWeSayIt (ex speakEasy) declares 'selfScoreRules' —
    // repeatAloud stays undefined (default completionRules, unchanged).
    log('[Config] repeatAloud has no entry (default = completionRules); whyWeSayIt = selfScoreRules', rules && rules.repeatAloud === undefined && rules.whyWeSayIt === 'selfScoreRules');
    await page.close();
  }

  // ============ --accent no longer collides with --wrong-ink (the "Attuale" red bug) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T11Accent', []);
    const colors = await page.evaluate(() => {
      var cs = getComputedStyle(document.documentElement);
      var accent = cs.getPropertyValue('--accent').trim();
      var wrongInk = cs.getPropertyValue('--wrong-ink').trim();
      var currentIcon = document.querySelector('.module-row.current .module-status-icon');
      var currentBg = currentIcon ? getComputedStyle(currentIcon).backgroundColor : null;
      // Build a throwaway rosso row's icon background for comparison, via the
      // real CSS rule (not guessing the color by hand).
      var probe = document.createElement('button');
      probe.className = 'module-row completed outcome-rosso';
      var probeIcon = document.createElement('span');
      probeIcon.className = 'module-status-icon';
      probe.appendChild(probeIcon);
      document.body.appendChild(probe);
      var rossoBg = getComputedStyle(probeIcon).backgroundColor;
      document.body.removeChild(probe);
      return { accent: accent, wrongInk: wrongInk, currentBg: currentBg, rossoBg: rossoBg };
    });
    log('[Attuale] --accent CSS variable no longer equals --wrong-ink', colors.accent.toLowerCase() !== colors.wrongInk.toLowerCase());
    log('[Attuale] "Attuale" module-status-icon background differs from the rosso/error background', colors.currentBg !== colors.rossoBg);
    log('[Attuale] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Voice Coach, all correct -> verde badge on the map ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Verde', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    const summaryVisible = await page.isVisible('#voice-coach-summary-screen').catch(() => false);
    log('[ModuleRules] Voice Coach (all correct) reaches the summary screen', summaryVisible);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Verde');
    log('[ModuleRules] First-pass 100% saves level "verde"', state.level === 'verde' && state.pct === 100);
    log('[ModuleRules] Map row carries outcome-verde and the plain "Completato" badge', state.rowClass && state.rowClass.indexOf('outcome-verde') !== -1 && state.badge === 'Completato');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Voice Coach, all wrong -> rosso badge "Da riprovare", frozen BEFORE retry pass ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Rosso', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => true, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Rosso');
    log('[ModuleRules] First-pass 0% (every line force-accepted wrong, not skipped) saves level "rosso"', state.level === 'rosso' && state.pct === 0);
    log('[ModuleRules] Map row carries outcome-rosso and the "Da riprovare" badge', state.rowClass && state.rowClass.indexOf('outcome-rosso') !== -1 && state.badge === 'Da riprovare');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Voice Coach, mixed -> giallo badge "Da rivedere" ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Giallo', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    // ~1/3 wrong, ~2/3 right -> average first-pass pct comfortably inside
    // the 50-79 medio/giallo band regardless of exact line count.
    await vcCompleteModule(page, (i) => i % 3 === 0, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Giallo');
    log('[ModuleRules] Mixed first-pass score (' + state.pct + '%) saves level "giallo"', state.level === 'giallo' && state.pct >= 50 && state.pct < 80);
    log('[ModuleRules] Map row carries outcome-giallo and the "Da rivedere" badge', state.rowClass && state.rowClass.indexOf('outcome-giallo') !== -1 && state.badge === 'Da rivedere');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Redo REPLACES the color, in both directions ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Redo', ALL_MODULES.slice(0, idx));

    // First pass: all correct -> verde
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const afterFirst = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}').voiceCoach.level, 'T11Redo');
    log('[Redo] First attempt (all correct) is verde', afterFirst === 'verde');

    // Redo, now all wrong -> should DOWNGRADE to rosso (a re-attempt going
    // worse must not be softened just because it was already green).
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => true, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const afterSecond = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}').voiceCoach.level, 'T11Redo');
    const rowAfterSecond = await page.evaluate(() => document.querySelector('[data-module="voiceCoach"]').className);
    log('[Redo] Second attempt (all wrong) REPLACES verde with rosso (downgrade honored)', afterSecond === 'rosso' && rowAfterSecond.indexOf('outcome-rosso') !== -1 && rowAfterSecond.indexOf('outcome-verde') === -1);

    // Redo again, back to all correct -> should UPGRADE back to verde.
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await page.waitForTimeout(200);
    const afterThird = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}').voiceCoach.level, 'T11Redo');
    const rowAfterThird = await page.evaluate(() => document.querySelector('[data-module="voiceCoach"]').className);
    log('[Redo] Third attempt (all correct again) REPLACES rosso with verde (upgrade honored)', afterThird === 'verde' && rowAfterThird.indexOf('outcome-verde') !== -1 && rowAfterThird.indexOf('outcome-rosso') === -1);
    log('[Redo] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Modulo Finale prep: the outcomes data shape episodeFinalOutcomeCase() will read ============
  // episodeFinalOutcomeCase itself is closured (no UI consumes it yet —
  // "predisponi la logica", Modulo Finale isn't built), so this confirms
  // the one thing it depends on: loadModuleOutcomes()'s stored shape
  // ({ [moduleId]: { level: 'verde'|'giallo'|'rosso', ... } }) is exactly
  // what both Voice Coach (ModuleRules) and Dialogo (selfAssessment)
  // write, regardless of which rule produced it.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T11Final', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) { await page.locator('.dg-bubble').nth(i).click(); await page.waitForTimeout(400); }
    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(300);
    const outcomes = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}'), 'T11Final');
    log('[Modulo Finale prep] Dialogo (selfAssessment) writes the same { level } shape ModuleRules writes', outcomes.dialogoAscoltaRipeti && outcomes.dialogoAscoltaRipeti.level === 'verde');
    log('[Modulo Finale prep] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Modulo Finale prep: episodeFinalMessages data (3 cases, compliment always first, tip only when due) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const fallback = await page.evaluate(() => window.FALLBACK_FEEDBACK_MESSAGES.episodeFinalMessages);
    const fetched = await page.evaluate(() => fetch('data/messaggi-feedback.json').then(r => r.json()).then(d => d.episodeFinalMessages));
    log('[Modulo Finale prep] episodeFinalMessages has all 3 cases with non-empty compliments', ['tuttiVerdi', 'gialloNoRosso', 'almenoUnRosso'].every(k => fallback[k] && fallback[k].compliments.length > 0));
    log('[Modulo Finale prep] tuttiVerdi has NO tip (nessun consiglio)', fallback.tuttiVerdi.tip.length === 0);
    log('[Modulo Finale prep] gialloNoRosso and almenoUnRosso DO have a tip', fallback.gialloNoRosso.tip.length > 0 && fallback.almenoUnRosso.tip.length > 0);
    log('[Modulo Finale prep] FALLBACK mirror matches the real data file exactly', JSON.stringify(fallback) === JSON.stringify(fetched));
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH11 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
