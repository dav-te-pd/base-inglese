const { launchBrowser, APP_URL } = require('./test-env');
const { attendiClasse, attendiTono } = require('./attese');
const { allSteps } = require('./module-order');
const { chiudiPopupTentativiSeAperto } = require('./quiz-driver');
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

// I passi della mappa, calcolati dalla sequenza vera (CONFIG.sequences)
// invece che riscritti qui: un riordino non deve piu' rompere questo file.
const ALL_MODULES = allSteps();
// Le chiavi introDismissed sono i KIND dei moduli, non gli id dei passi:
// due apparizioni dello stesso modulo condividono lo stesso kind.
const ALL_KINDS = ALL_MODULES.map(id => id.replace(/-\d+$/, ''));

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules, kinds }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:gate:' + userName, JSON.stringify({ completed: completedModules }));
    // flashcardAEngIta/flashcardAItaEng share ONE kind, 'flashcard'
    // (intro-dismiss is keyed by kind, not module id) — not in ALL_MODULES.
    kinds.concat(['mappaEpisodio', 'flashcard']).forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules, kinds: ALL_KINDS });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

// ---- Voice Coach (Practice/Check) driving helpers ----
async function vcAnswerLine(page, transcript) {
  await page.evaluate((t) => { window.__vcTranscript = t; }, transcript);
  await page.evaluate(() => document.getElementById('vc-record-btn').click());
  await page.waitForTimeout(120);
  await page.evaluate(() => document.getElementById('vc-record-btn').click());
  await page.waitForTimeout(150);
  await page.click('#vc-send-btn');
  await page.waitForTimeout(180);
  await chiudiPopupTentativiSeAperto(page);
}

const WRONG_TRANSCRIPT = 'xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy';

async function vcCompleteLineWrong(page, rounds) {
  for (let attempt = 0; attempt < rounds; attempt++) {
    await vcAnswerLine(page, WRONG_TRANSCRIPT);
    const retryVisible = await page.evaluate(() => !document.getElementById('vc-retry-row').hidden);
    const retryDisabled = await page.evaluate(() => document.getElementById('voice-coach-retry-btn').disabled);
    if (attempt < rounds - 1 && retryVisible && !retryDisabled) {
      await page.click('#voice-coach-retry-btn');
      await page.waitForTimeout(100);
    }
  }
}

async function vcCompleteLineRight(page) {
  const targetText = await page.evaluate(() => document.getElementById('vc-target').textContent);
  await vcAnswerLine(page, targetText);
}

// wrongRounds > 1 only makes sense for Voice Practice (has "Esercitati
// ancora"); Voice Check has no retry button at all (job 5) so its own
// call site below always passes 1. Once the main pass empties into the
// Schermata Ripasso (retryIntro), every remaining line is answered
// "right" — first-pass score (what ModuleRules reads) is already frozen,
// this just needs to drain the queue so the module can finish.
async function vcCompleteModule(page, wrongAtIndex, wrongRounds, maxLines) {
  let i = 0;
  let inRetryPass = false;
  for (let guard = 0; guard < maxLines * 2; guard++) {
    const summaryHidden = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
    if (!summaryHidden) return i;
    const retryIntroHidden = await page.evaluate(() => document.getElementById('voice-coach-retry-intro-screen').hidden);
    if (!retryIntroHidden) {
      await page.click('#voice-coach-retry-continue-btn').catch(() => {});
      await page.waitForTimeout(180);
      inRetryPass = true;
      continue;
    }
    if (i >= maxLines) return i;
    if (!inRetryPass && wrongAtIndex(i)) { await vcCompleteLineWrong(page, wrongRounds); } else { await vcCompleteLineRight(page); }
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
    const n = await p.evaluate(() => fetch('data/inglese/it/inglese-it-gate.json').then(r => r.json()).then(d => d.levels.D.items.length));
    await p.close();
    return n;
  })();

  // ============ JOB 1: sound event catalog ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const events = await page.evaluate(() => window.APP_CONFIG.sound.events);
    const oldLoc = await page.evaluate(() => window.APP_CONFIG.speedMatch.sound);
    log('[Job1] CONFIG.sound.events has corretto/sbagliato/countdown/ready/traguardo',
      events && events.corretto && events.sbagliato && events.countdown && events.ready && events.traguardo);
    log('[Job1] CONFIG.speedMatch.sound no longer exists (moved, not duplicated)', oldLoc === undefined);
    await page.close();
  }

  // ============ JOB 2: Traguardo + Ready one octave up ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const events = await page.evaluate(() => window.APP_CONFIG.sound.events);
    log('[Job2] Traguardo notes are [1046,1318,1568] (old [523,659,784] doubled)',
      JSON.stringify(events.traguardo.notes) === JSON.stringify([1046, 1318, 1568]));
    log('[Job2] Ready freq/finalFreq doubled (1568/1976)', events.ready.freq === 1568 && events.ready.finalFreq === 1976);
    await page.close();
  }

  // ============ JOB 3: accent color audit across 5 themes ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const expected = { viaggio: '#2b6ca3', notte: '#5b8def', mediterraneo: '#3372a8', moderno: '#1b6fa8', natura: '#7ec850' };
    const results2 = await page.evaluate((expected) => {
      var out = {};
      Object.keys(expected).forEach(function (theme) {
        if (theme !== 'viaggio') document.documentElement.setAttribute('data-theme', theme);
        else document.documentElement.removeAttribute('data-theme');
        var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toLowerCase();
        out[theme] = accent;
      });
      document.documentElement.removeAttribute('data-theme');
      return out;
    }, expected);
    Object.keys(expected).forEach(function (theme) {
      log('[Job3] ' + theme + ' --accent is ' + expected[theme] + ' (no longer colliding with a semantic color)', results2[theme] === expected[theme]);
    });
    await page.close();
  }

  // ============ JOB 4: map card tinted backgrounds ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T12Map', ['personalizzazione']);
    const bg = await page.evaluate(() => {
      var probeBg = document.createElement('button');
      probeBg.className = 'module-row';
      document.body.appendChild(probeBg);
      var neutral = getComputedStyle(probeBg).backgroundColor;
      document.body.removeChild(probeBg);

      function bgFor(cls) {
        var el = document.createElement('button');
        el.className = 'module-row ' + cls;
        document.body.appendChild(el);
        var v = getComputedStyle(el).backgroundColor;
        document.body.removeChild(el);
        return v;
      }
      return {
        neutral: neutral,
        completed: bgFor('completed'),
        giallo: bgFor('completed outcome-giallo'),
        rosso: bgFor('completed outcome-rosso')
      };
    });
    log('[Job4] .completed has a distinct tinted background from the plain row', bg.completed !== bg.neutral);
    log('[Job4] .outcome-giallo has its own tinted background, distinct from plain completed', bg.giallo !== bg.completed && bg.giallo !== bg.neutral);
    log('[Job4] .outcome-rosso has its own tinted background, distinct from the other two', bg.rosso !== bg.completed && bg.rosso !== bg.giallo && bg.rosso !== bg.neutral);
    log('[Job4] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 7: new order + labels + categories on the map ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T12Order', []);
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('.module-row')).map(function (r) {
      return {
        id: r.getAttribute('data-module'),
        title: r.querySelector('.module-row-title').textContent,
        type: r.querySelector('.module-row-type') ? r.querySelector('.module-row-type').textContent : null
      };
    }));
    const ids = rows.map(r => r.id);
    log('[Job7] L\'ordine in mappa e\' quello della sequenza dell\'episodio',
      JSON.stringify(ids) === JSON.stringify(ALL_MODULES));
    // I nomi e le categorie si cercano per id del passo, non per posizione:
    // la posizione cambia a ogni riordino, l'identita' del passo no.
    const row = id => rows[ids.indexOf(id)] || {};
    log('[Job7] Match Practice si chiama cosi\' in entrambe le direzioni',
      row('matchEngIta').title.indexOf('Match Practice') === 0 && row('matchItaEng').title.indexOf('Match Practice') === 0);
    log('[Job7] Voice Practice e Voice Check hanno i loro nomi',
      row('voicePractice').title === 'Voice Practice' && row('voiceCoach').title === 'Voice Check');
    log('[Job7] Dialogue: Real Dialogue si chiama cosi\' (era "Full Dialogue")', row('dialogoContinuo').title === 'Dialogue: Real Dialogue');
    log('[Job7] Speed Match si chiama Speed Match in entrambe le direzioni',
      row('speedMatchEngIta').title.indexOf('Speed Match') === 0 && row('speedMatchItaEng').title.indexOf('Speed Match') === 0);
    // I due moduli nati dal componente della storia: nomi nuovi, stessa
    // categoria Studio.
    log('[Job7] Meet the Story e Why We Say It hanno i loro nomi',
      row('meetTheStory').title === 'Meet the Story' && row('whyWeSayIt').title === 'Why We Say It');
    log('[Job7] "Story Cards" non compare piu\' in mappa', rows.every(r => r.title !== 'Story Cards'));
    // Six-label job (later turn) replaced these four categories — all
    // three Dialogo modules now share "Studia il dialogo", Voice Practice/
    // Match Practice/Flash Card are "Studio", Speed Match/Voice Check are
    // "Quiz".
    // L'etichetta e' "categoria · grado" (docs/inglese/it/struttura-corso.md): la
    // categoria dice cosa aspettarsi, il grado su cosa si sta lavorando.
    // Il grado atteso viene dall'ordine, non riscritto qui.
    log('[Job7] I tre Dialogue mostrano la categoria "Studia il dialogo"',
      ['dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].every(id => row(id).type.indexOf('Studia il dialogo') === 0));
    log('[Job7] Voice Practice è "Studio"', row('voicePractice').type.indexOf('Studio') === 0);
    log('[Job7] Voice Check è "Quiz"', row('voiceCoach').type.indexOf('Quiz') === 0);
    log('[Job7] Your Story è "Inizio", senza grado (non ne legge uno)', row('personalizzazione').type === 'Inizio');
    // Il grado accanto alla categoria: Repeat Aloud compare due volte, su due
    // gradi diversi, e le due righe devono dirlo.
    log('[Job7] L\'etichetta porta il nome del grado accanto alla categoria',
      row('repeatAloud').type === 'Studio · Parole' && row('repeatAloud-2').type === 'Studio · Espressioni');
    log('[Job7] Un quiz sulle frasi lo dice', row('speedMatchEngIta').type === 'Quiz · Frasi');
    log('[Job7] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 5: Voice Practice — "Esercitati ancora" capped at 3, no ripasso, no map color, feeds mastery ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voicePractice');
    await bootAsUser(page, 'T12Practice', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voicePractice');
    await page.waitForTimeout(300);

    const badge = await page.evaluate(() => document.getElementById('voice-coach-badge').textContent);
    log('[Job5] Voice Practice badge/title show "Voice Practice"', badge === 'Voice Practice');
    const retryVisible = await page.evaluate(() => !document.getElementById('vc-retry-row').hidden);
    const retryLabel = await page.evaluate(() => document.getElementById('voice-coach-retry-btn').textContent);
    log('[Job5] Retry row visible with label "Esercitati ancora"', retryVisible && retryLabel === 'Esercitati ancora');

    // Answer the first line wrong 3 times in a row (cap) — button must disable after the 3rd, no popup.
    await vcCompleteLineWrong(page, 3);
    const afterCapDisabled = await page.evaluate(() => document.getElementById('voice-coach-retry-btn').disabled);
    const popupOpenAfterCap = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
    log('[Job5] "Esercitati ancora" disables once maxAttemptsPerPhrase (3) is reached', afterCapDisabled);
    log('[Job5] No safety-valve popup for Voice Practice (visible counter replaces it)', !popupOpenAfterCap);
    const attemptLabel = await page.evaluate(() => document.getElementById('vc-attempt-label').textContent);
    log('[Job5] Visible counter reads "... DI 3"', attemptLabel.indexOf('DI 3') !== -1);

    // Finish the rest of the lines correctly and confirm NO retry-intro screen ever appears (no ripasso).
    await page.click('#vc-next-btn');
    await page.waitForTimeout(180);
    let sawRetryIntro = false;
    for (let i = 1; i < LINE_COUNT + 2; i++) {
      const summaryHidden = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
      if (!summaryHidden) break;
      const retryIntroHidden = await page.evaluate(() => document.getElementById('voice-coach-retry-intro-screen').hidden);
      if (!retryIntroHidden) { sawRetryIntro = true; break; }
      await vcCompleteLineRight(page);
      const nextDisabled = await page.evaluate(() => document.getElementById('vc-next-btn').disabled);
      if (!nextDisabled) await page.click('#vc-next-btn');
      await page.waitForTimeout(180);
    }
    log('[Job5] Voice Practice never shows the Schermata Ripasso (no final retry pass)', !sawRetryIntro);
    const summaryReached = await page.evaluate(() => !document.getElementById('voice-coach-summary-screen').hidden);
    log('[Job5] Reaches the summary screen', summaryReached);

    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:gate:' + u) || '{}');
      var row = document.querySelector('[data-module="voicePractice"]');
      return { level: outcomes.voicePractice && outcomes.voicePractice.level, rowClass: row ? row.className : null };
    }, 'T12Practice');
    // Job (later turn): Voice Practice now colors the map too
    // (moduleOutcomeRules), scored by LastAttemptRule — only line 1's
    // LAST attempt (still wrong, 3 rounds never corrected) drags the
    // average down; the rest are exact matches, so the overall score
    // stays comfortably in the "alto"/verde band.
    log('[Job5] Voice Practice NOW writes a moduleOutcome (ModuleRules, LastAttemptRule)', state.level === 'verde');
    log('[Job5] Map row carries outcome-verde', state.rowClass && state.rowClass.indexOf('outcome-verde') !== -1);

    const mastery = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:mastery:gate:' + u) || '{}'), 'T12Practice');
    const masteryKeys = Object.keys(mastery).filter(k => k.indexOf('voicepractice:') === 0);
    log('[Job5] Voice Practice fed the per-word mastery store (voicepractice: unit ids present)', masteryKeys.length > 0);

    // Il dato si registra sul TARGET, conservando il dettaglio delle parole.
    // Le stelle SONO gia' la media delle parole: il dato c'era e finiva a
    // schermo e basta. La media dice quanto vale il target, le parole dicono
    // DOVE si rompe — quindi le due cose convivono, non si sostituiscono.
    //
    // La riga del target si riconosce dalla forma: 'voicepractice:<voce>',
    // due segmenti, mentre quelle per parola ne hanno tre
    // ('voicepractice:<voce>:<indice>'). Si contano invece di cercarne una
    // scritta a mano qui: le battute le sceglie il modulo, non il test.
    const perTarget = masteryKeys.filter(k => k.split(':').length === 2);
    const perParola = masteryKeys.filter(k => k.split(':').length === 3);
    log('[Job5] Voice Practice scrive anche una riga per il TARGET, non solo per parola',
      perTarget.length > 0);
    log('[Job5] Le righe per parola restano tutte: il target si aggiunge, non sostituisce',
      perParola.length > perTarget.length);
    // Ogni target ha almeno una parola sotto di se': se comparisse una riga di
    // target senza le sue parole, vorrebbe dire che la media ha preso il posto
    // del dettaglio invece di affiancarlo.
    // C.1 (2026-09-10): le chiavi sono separate per VARIANTE, non per ordine.
    // Le due hanno regole diverse su quale tentativo conta (Last vs First), e
    // sulla stessa chiave nessun lettore saprebbe quale l'ha prodotta.
    log('[C.1] Voice Practice non scrive NIENTE nelle voci di Voice Check',
      Object.keys(mastery).every(k => k.indexOf('voicecheck:') !== 0),
      Object.keys(mastery).filter(k => k.indexOf('voicecheck:') === 0).join(', '));
    // ⚠️ La condizione `.length > 0` NON e' una cintura: senza, questa riga e'
    // verde quando perTarget e' VUOTO ([].every() e' vero), cioe' proprio nel
    // caso in cui il modulo ha smesso di scrivere. Famiglia ⓪-bis di
    // tests/ERRORI-INGOIATI.md. Misurato il 2026-09-10 sulla gemella di Voice
    // Check: col gate rimesso a 'practice' restava verde.
    log('[Job5] Ogni riga di target ha le sue parole accanto',
      perTarget.length > 0 && perTarget.every(t => perParola.some(w => w.indexOf(t + ':') === 0)));
    log('[Job5] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 5: Voice Check — no retry button at all, keeps ripasso + ModuleRules ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T12Check', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);

    const badge = await page.evaluate(() => document.getElementById('voice-coach-badge').textContent);
    log('[Job5] Voice Check badge/title show "Voice Check"', badge === 'Voice Check');
    const retryHidden = await page.evaluate(() => document.getElementById('vc-retry-row').hidden);
    log('[Job5] Voice Check has NO retry row at all (hidden entirely)', retryHidden);

    // Voice Check: ONE recording per phrase (job 5) — wrongRounds=1.
    await vcCompleteModule(page, () => true, 1, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:gate:' + u) || '{}');
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level };
    }, 'T12Check');
    log('[Job5] Voice Check STILL uses ModuleRules (all-wrong -> rosso, unchanged from before the split)', state.level === 'rosso');

    // ── C.1: Voice Check scrive, ed e' la STRADA B ──────────────────────
    // Fino al 2026-09-10 questo modulo calcolava pairResults e le stelle e poi
    // buttava tutto: era il modulo SENZA AIUTI — niente ripasso nello stesso
    // passaggio, niente ritentativo, niente opzioni fra cui scegliere — cioe'
    // il segnale piu' pulito che l'app produca, ed era l'unico che non
    // conservava.
    //
    // ⚠️ Il giro appena fatto e' esattamente quello che distingue le due
    // strade, e non e' un caso: ogni battuta e' stata sbagliata al PRIMO
    // tentativo e poi data GIUSTA nel ripasso.
    //   strada B (quella scelta): conta il primo -> tutto rosso
    //   strada A (a ogni tentativo): il ripasso avrebbe promosso -> giallo
    // Un'asserzione che guardasse solo "ci sono delle chiavi" sarebbe verde in
    // tutti e due i casi, cioe' non proverebbe la decisione ma solo che
    // qualcuno scrive.
    const colori = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:mastery:gate:' + u) || '{}'), 'T12Check');
    const chiaviCheck = Object.keys(colori).filter(k => k.indexOf('voicecheck:') === 0);
    log('[C.1] Voice Check scrive i colori delle voci', chiaviCheck.length > 0, Object.keys(colori).join(', '));
    log('[C.1] ...in voci SUE: nessuna finisce dentro quelle di Voice Practice',
      Object.keys(colori).length > 0 && Object.keys(colori).every(k => k.indexOf('voicecheck:') === 0),
      Object.keys(colori).filter(k => k.indexOf('voicecheck:') !== 0).join(', '));
    // Per battuta E per parola, come Voice Practice: la media dice quanto vale
    // la battuta, le parole dicono DOVE si rompe.
    const perParola = chiaviCheck.filter(k => /:\d+$/.test(k));
    const perBattuta = chiaviCheck.filter(k => !/:\d+$/.test(k));
    log('[C.1] Una riga per la battuta intera', perBattuta.length > 0, perBattuta.join(', '));
    log('[C.1] E una riga per ogni parola dentro quella battuta', perParola.length > perBattuta.length,
      perParola.length + ' parole su ' + perBattuta.length + ' battute');
    // Vedi la gemella di Voice Practice sopra: senza `.length > 0` questa riga
    // e' verde quando non e' stato scritto NIENTE.
    log('[C.1] Ogni battuta scritta ha le sue parole accanto',
      perBattuta.length > 0 && perBattuta.every(b => perParola.some(w => w.indexOf(b + ':') === 0)));
    // ⚠️ SI GUARDA LA STRISCIA, NON SOLO IL LIVELLO, e non e' pignoleria:
    // guardando il solo livello questa riga e' VERDE anche sotto la strada A.
    // Misurato il 2026-09-10 rimettendo `scriveIColori = true`: con
    // promotionStreak a 2 una sola risposta giusta NON promuove, quindi la
    // giusta del ripasso porta { rosso, 0 } a { rosso, 1 } — il livello non si
    // muove, e l'asserzione che si chiamava "STRADA B" non distingueva le due
    // strade. La striscia si', ed e' l'unico segno che il ripasso ha scritto.
    //   strada B: { rosso, 0 }   strada A: { rosso, 1 }
    log('[C.1] STRADA B: conta il PRIMO tentativo — la giusta del ripasso non ha scritto niente',
      chiaviCheck.length > 0 && chiaviCheck.every(k => colori[k].level === 'rosso' && colori[k].streak === 0),
      JSON.stringify(chiaviCheck.slice(0, 4).map(k => k + '=' + colori[k].level + '/' + colori[k].streak)));

    log('[Job5] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ C.1 + il gesto: Voice Check non fa eccezione ============
  // La regola del gesto vive in tests/test_mastery_al_gesto.js, e la sua
  // asserzione strutturale ([A]: saveMastery ha un solo punto di chiamata) la
  // rende gia' vera per QUALUNQUE modulo, questo compreso. Il caso di Voice
  // Check sta qui e non li' per una ragione sola: la macchina del microfono
  // (mockInit + vcAnswerLine) e' in questo file, e ricopiarla sarebbe la
  // duplicazione che la regola 13 esiste per evitare.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T12CheckMappa', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: la guardia serve all'asserzione NEGATIVA qui sotto — «rispondere non scrive». Un non-evento non si aspetta: allungare il tempo rafforza la prova, uno stato da attendere non esiste
    await vcCompleteLineRight(page);
    const primaDiUscire = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:gate:' + u), 'T12CheckMappa');
    log('[C.1] Rispondere non scrive: il colore aspetta il pulsante come in ogni altro modulo',
      primaDiUscire === null || Object.keys(JSON.parse(primaDiUscire)).length === 0, String(primaDiUscire));
    await page.click('#voice-coach-back-map');
    await page.waitForTimeout(250); // ATTESA-LEGITTIMA: l'asserzione qui sotto verifica che una scrittura NON sia rimasta — uscire dalla mappa non deve lasciare una voce di mastery. Un non-evento non si aspetta: il tempo E' la misura
    const dopoMappa = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:gate:' + u), 'T12CheckMappa');
    log('[C.1] Uscendo da "← Mappa" non resta nessuna voce di Voice Check',
      dopoMappa === null || Object.keys(JSON.parse(dopoMappa)).length === 0, String(dopoMappa));
    log('[C.1] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 1 (Flash Card gap): "Sì, la so" plays Corretto, "Non ancora" stays silent ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('flashcardAEngIta');
    await bootAsUser(page, 'T12FC', ALL_MODULES.slice(0, idx));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(300);
    await page.click('#fc-card');
    await page.waitForTimeout(150);
    await page.click('#fc-know-it-btn');
    await attendiTono(page, [880], 1);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const correttoTones = tones.filter(t => t.freq === 880);
    log('[Job1] Flash Card "Sì, la so" plays the Corretto tone (880Hz)', correttoTones.length >= 1);
    log('[Job1] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH12 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
