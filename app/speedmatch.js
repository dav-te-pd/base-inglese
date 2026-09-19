// DIPENDE DA: dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL QUARTO MODULO. 419 righe — e il primo che porta via un TIMER.
//
// ⚠️ TRE NOMI ALL'INSÙ VERSO index.html, E SONO GLI STESSI TRE DI MATCH.
//
//   `itemText`                   legge `currentEpisode` e `currentValues`
//   `recordMultipleChoiceResult` chiama `recordPendingMastery`
//   `buildMultipleChoiceOptions` chiama `itemText`
//
// Non è una coincidenza e non è un conto che sale: Speed Match e Match
// Practice sono lo **stesso meccanismo a scelta multipla** con un timer in
// mezzo, quindi toccano la stessa fetta dei quattro pezzi bloccati dallo
// **stato di sessione** (`docs/decisioni.md`). *Il numero che smette di
// salire al quarto modulo dice la stessa cosa che diceva salendo ai primi
// tre: la ragione è una sola.*
//
// ⚠️ NON SI ALIASANO: lo script inline di `index.html` è l'ULTIMO, quindi un
// alias in cima congelerebbe `undefined`. Vietato da `[E]` di
// `tests/test_dipendenze_dichiarate.js`.
//
// ⚠️ E QUI ESCE LA PRIMA PULIZIA REGISTRATA DA UN MODULO ESTRATTO.
// `srPulizia` chiama `BI.registraPulizia` a tempo di PARSING: se questo file
// non viene caricato, la pulizia non è registrata — ed è giusto così, perché
// non c'è niente da pulire in un modulo mai aperto. Ma vuol dire che il
// magazzino di `stopAllModuleActivity` **non ha più un contenuto fisso**: ha
// quello dei file caricati. Registrato in `docs/decisioni.md`.
//
// IL TAG STA NELLA SECONDA FILA per gli alias, non per il markup: i nove
// listener si agganciano dentro `openSpeedMatch`, a tempo di chiamata.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var sfxPlayCorrectSound = BI.sfxPlayCorrectSound;
  var sfxPlayWrongSound = BI.sfxPlayWrongSound;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var sfxPlayReadyCountdownSound = BI.sfxPlayReadyCountdownSound;
  var shuffle = BI.shuffle;
  var percentageBucket = BI.percentageBucket;
  var uiText = BI.uiText;
  var DIRECTION_LABEL = BI.DIRECTION_LABEL;
  var lockModuleHeader = BI.lockModuleHeader;
  var startTimerBar = BI.startTimerBar;
  var freezeTimerBar = BI.freezeTimerBar;
  var renderIntroContent = BI.renderIntroContent;
  var introDismissPref = BI.introDismissPref;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var openHelpFor = BI.openHelpFor;
  var openAttemptPopup = BI.openAttemptPopup;
  var applyOutcomeSubtitle = BI.applyOutcomeSubtitle;
  var applyRetryIntroContent = BI.applyRetryIntroContent;
  var moduleRulesLevel = BI.moduleRulesLevel;
  var moduleNameHtml = BI.moduleNameHtml;
  var moduleTypeLabel = BI.moduleTypeLabel;
  var openEpisodeMap = BI.openEpisodeMap;
  var completeModule = BI.completeModule;
  var leaveModule = BI.leaveModule;
  var showLoadError = BI.showLoadError;

  /* ============================================================
     MODULES: SPEED MATCH ENG-ITA / SPEED MATCH ITA-ENG
     Two separate map modules sharing one view and this one JS section —
     module.kind fixes the direction and the istruzioni-moduli.json entry
     for the whole session, everything else is identical. Flow: a start
     screen (first time: full howItWorks text + "don't show again" +
     "Ho capito, inizia"; afterward: a short "Pronto?" prompt + "Pronto?
     Via!" — see srRenderStartScreen) -> a 3-2-1 countdown -> one shuffled
     pass over every vocabulary item, then as many further retry passes as
     needed over whatever is still wrong/skipped/timed out — each
     announced by its own "Ripassiamo insieme..." screen — until one retry
     pass comes back with zero misses -> a summary screen. Wrong/timeout/
     "Non lo so" all reveal the correct answer and wait for an explicit
     "Avanti" (read and memorize before moving on); a correct tap
     auto-advances after a short pause. Guarda+Help (top-row) only appear
     on the start/summary screens, Guarda alone hiding again on summary
     (CLAUDE.md rule 10); no Indietro.
     ============================================================ */
  var SR_DIRECTION_BY_KIND = { speedMatchEngIta: 'en-it', speedMatchItaEng: 'it-en' };

  var srModule = null;
  var srDirection = 'en-it'; // fixed for the whole module session
  var srVocab = [];
  var srQueue = [];
  var srRetryQueue = [];
  var srRetryAttempts = {}; // itemId -> times wrong/skipped/timed out this session
  var srAttemptCounts = {}; // itemId -> total attempts (right or wrong) this session, for the safety-valve popup
  var srFirstTryCorrectCount = 0; // job 2A: items answered correctly on their very first attempt this session
  var srLastAvgPct = 0; // srFinishModule's own pct, held for sr-complete-btn's saveModuleOutcome call (ModuleRules)
  var srPassIndex = 0;
  var srPassTotal = 0;
  var srInRetryPass = false; // job: "Ripasso" badge, see srRenderQuestion
  var srRetryPassCount = 0; // job 4 (2nd collaudo): which retryIntro pool (first/last) to show
  var srCurrentItem = null;
  var srCurrentOptions = [];
  var srTimeoutId = null;
  var srCountdownTimeoutId = null;









  function srClearTimer() {
    if (srTimeoutId) { clearTimeout(srTimeoutId); srTimeoutId = null; }
  }

  // Speed Match: TRE cose, non una, e per questo ha una pulizia sua invece di
  // registrare `srClearTimer` — che ha altri sei chiamanti e non va toccato.
  //
  // ⚠️ `lockModuleHeader('speed-match', false)` e' una funzione CONDIVISA con
  // un argomento che non lo e': sta qui, con Speed Match, perche' e' l'unico
  // modulo che blocca la propria intestazione.
  function srPulizia() {
    srClearTimer();
    lockModuleHeader('speed-match', false);
    if (srCountdownTimeoutId) { clearTimeout(srCountdownTimeoutId); srCountdownTimeoutId = null; }
  }
  BI.registraPulizia(srPulizia);

  // Shared, duration-as-parameter timer-bar mechanics (CLAUDE.md rule 13)
  // — Speed Match below passes its own fixed CONFIG.speedMatch.
  // timeLimitSeconds; Dialogo Ripeti a Tempo/Continuo pass a different,
  // per-line duration instead (see dgLineDurationMs). Pure DOM/CSS —
  // timeout scheduling stays with each caller since Speed Match's is a
  // simple one-shot while Dialogo's also needs to be pausable (see
  // dgPauseLineTimer/dgResumeLineTimer).

  function srStartTimer() {
    srClearTimer();
    var seconds = CONFIG.speedMatch.timeLimitSeconds;
    startTimerBar(document.getElementById('sr-timerbar-fill'), seconds * 1000);
    srTimeoutId = setTimeout(srHandleTimeout, seconds * 1000);
    // Spiegazione/Help don't tolerate an interruption while the time bar
    // is running (CLAUDE.md rule 13 reuse: same lockModuleHeader Voice
    // Coach uses for its recording lock) — released again in
    // srDisableOptions, the choke point every question-ending path shares.
    lockModuleHeader('speed-match', true);
  }

  function srFreezeTimer() {
    freezeTimerBar(document.getElementById('sr-timerbar-fill'));
  }

  // Same non-attempt bug as Match Practice's qmDisableOptions (rule 13: mirrors
  // that fix exactly) — "Non lo so" must lock together with the options,
  // not separately, or a fast tap can overwrite a just-recorded correct
  // answer with a straight-to-rosso non-attempt.
  function srDisableOptions() {
    document.querySelectorAll('#sr-options .sr-option').forEach(function (b) { b.disabled = true; });
    document.getElementById('sr-dontknow-btn').disabled = true;
  }

  function srShowScreen(name) {
    document.getElementById('sr-start-screen').hidden = name !== 'start';
    document.getElementById('sr-countdown-screen').hidden = name !== 'countdown';
    document.getElementById('sr-retry-intro-screen').hidden = name !== 'retryIntro';
    document.getElementById('sr-quiz-screen').hidden = name !== 'quiz';
    document.getElementById('sr-summary-screen').hidden = name !== 'summary';
    // Spiegazione+Help now visible on every screen, quiz included (the
    // buttons existed in markup but were only ever un-hidden on start/
    // summary — bug fix, 8th collaudo). Spiegazione still hides on the
    // Schermata Finale alone (CLAUDE.md rule 10 — nothing left to explain
    // there); Help never hides. Hiding is separate from the DISABLING
    // that happens specifically while the per-question timer bar runs
    // (srStartTimer locks, srDisableOptions releases) — that's the "azioni
    // che non tollerano interruzioni" exception, not a visibility one.
    document.getElementById('speed-match-watch-btn').hidden = name === 'summary';
    document.getElementById('speed-match-help-btn').hidden = false;
  }

  // First time (not dismissed): full howItWorks explanation + checkbox +
  // "Ho capito, inizia". Already dismissed: short ready prompt + "Pronto?
  // Via!" — this screen never disappears entirely (unlike other modules'
  // intro) since it also gates the timed countdown.
  function srRenderStartScreen(module) {
    var dismissed = isIntroDismissed(module.kind, getUserName());
    document.getElementById('sr-start-checkbox-row').hidden = dismissed;
    document.getElementById('sr-start-body').hidden = dismissed;
    if (dismissed) {
      document.getElementById('sr-start-title').textContent = uiText('condivisi.readyTitle');
      document.getElementById('sr-ready-btn').textContent = uiText('condivisi.readyStart');
    } else {
      document.getElementById('sr-start-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'sr-start-title', 'sr-start-body', module.label, 'sr-ready-btn', 'sr-start-dont-show-text');
    }
  }

  // declaredNonAttempt: "Non lo so" — not a wrong answer but an admitted
  // non-attempt, so it resets straight to rosso regardless of the current
  // level, same special-cased path as Flash Card's "skipped without
  // flipping" (applyMasteryResult's normal one-level-at-a-time demotion is
  // untouched — timeout and a wrong tap still go through it as before).
  // Thin wrapper around the shared recordMultipleChoiceResult (rule 13) —
  // supplies Speed Match's own state so its mastery unitId prefix and
  // retry queue stay independent from Match Practice's (the max-attempts
  // threshold itself is the one shared CONFIG.retryQueue.maxAttempts).
  function srRecordResult(correct, declaredNonAttempt) {
    var attemptNum = BI.recordMultipleChoiceResult({
      item: srCurrentItem,
      direction: srDirection,
      correct: correct,
      declaredNonAttempt: declaredNonAttempt,
      unitPrefix: 'speedmatch',
      retryAttempts: srRetryAttempts,
      attemptCounts: srAttemptCounts,
      retryQueue: srRetryQueue,
      maxRetryAttempts: CONFIG.retryQueue.maxAttempts
    });
    // job 2A: the Schermata Finale score counts first-try correct answers
    // only — a later retry-pass success doesn't inflate it.
    if (correct && attemptNum === 1) srFirstTryCorrectCount++;
    return attemptNum;
  }

  function srBuildOptions(item) {
    return BI.buildMultipleChoiceOptions(item, srDirection, srVocab);
  }

  function srRenderQuestion() {
    document.getElementById('sr-reveal').hidden = true;
    document.getElementById('sr-advance-btn').hidden = true;
    document.getElementById('sr-dontknow-btn').hidden = false;
    document.getElementById('sr-dontknow-btn').disabled = false;
    document.getElementById('sr-counter').textContent = srPassIndex + ' / ' + srPassTotal;
    document.getElementById('sr-ripasso-badge').hidden = !srInRetryPass;
    var promptText = BI.itemText(srCurrentItem, srDirection === 'en-it' ? 'en' : 'it');
    document.getElementById('sr-prompt').textContent = promptText;
    srCurrentOptions = srBuildOptions(srCurrentItem);
    document.getElementById('sr-options').innerHTML = srCurrentOptions.map(function (opt, i) {
      return '<button type="button" class="help-option sr-option" data-sr-index="' + i + '">' + opt.text + '</button>';
    }).join('');
    srStartTimer();
  }

  function srNextQuestion() {
    if (srQueue.length === 0) {
      if (srRetryQueue.length > 0) {
        srQueue = shuffle(srRetryQueue);
        srRetryQueue = [];
        srPassTotal = srQueue.length;
        srPassIndex = 0;
        srInRetryPass = true;
        srRetryPassCount++;
        srShowScreen('retryIntro');
        applyRetryIntroContent('sr-retry-intro-screen', srRetryPassCount >= CONFIG.retryQueue.maxAttempts - 1);
        return;
      } else {
        srFinishModule();
        return;
      }
    }
    var itemId = srQueue.shift();
    srPassIndex++;
    srCurrentItem = srVocab.find(function (v) { return v.id === itemId; });
    srShowScreen('quiz');
    srRenderQuestion();
  }

  // Mirrors qmGoNext (jobs 3+4) — the one place every "move on from this
  // question" click routes through, so a pending safety-valve nudge shows
  // before srNextQuestion actually runs.
  var srPendingNudge = null;

  function srGoNext() {
    if (srPendingNudge) {
      var wasCorrect = srPendingNudge.wasCorrect;
      srPendingNudge = null;
      openAttemptPopup(wasCorrect, null, srNextQuestion);
    } else {
      srNextQuestion();
    }
  }

  // Shared by a wrong tap, a timeout, and "Non lo so": reveal the correct
  // answer and wait for an explicit "Avanti" instead of auto-advancing,
  // so the user reads and memorizes it (CLAUDE.md-style deliberate pacing).
  function srShowReveal() {
    var correctText = BI.itemText(srCurrentItem, srDirection === 'en-it' ? 'it' : 'en');
    document.querySelectorAll('#sr-options .sr-option').forEach(function (b, i) {
      if (srCurrentOptions[i] && srCurrentOptions[i].correct) b.classList.add('is-correct');
    });
    document.getElementById('sr-reveal-text').textContent = 'Risposta corretta: ' + correctText;
    document.getElementById('sr-reveal').hidden = false;
    document.getElementById('sr-dontknow-btn').hidden = true;
    document.getElementById('sr-advance-btn').hidden = false;
    // Spiegazione/Help release the timer lock only here — the three
    // callers of srShowReveal (wrong tap, timeout, "Non lo so") are
    // exactly the cases with a correct answer to read. A CORRECT tap
    // skips this function entirely and goes straight to srGoNext, so the
    // header stays locked through that sub-second pause instead of
    // flashing on and off with nothing to actually read (adjustment,
    // 9th collaudo).
    lockModuleHeader('speed-match', false);
  }

  function srHandleTimeout() {
    srTimeoutId = null;
    srDisableOptions();
    sfxPlayWrongSound();
    var attemptNum = srRecordResult(false);
    if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) srPendingNudge = { wasCorrect: false };
    srShowReveal();
  }

  // Score/percentage/message deliberately not shown here for now (temporary
  // simplification, per explicit request) — just the completion screen.
  function srFinishModule() {
    srClearTimer();
    sfxPlayTraguardoSound();
    srShowScreen('summary');
    // firstAttempt is the only attempt that exists here (no same-pass
    // retry — see vcEvaluate's own comment): frozen before the
    // ripasso pass — same pct feeds the message tone here and the
    // ModuleRules map badge.
    var pct = srVocab.length ? Math.round((srFirstTryCorrectCount / srVocab.length) * 100) : 0;
    srLastAvgPct = pct;
    applyOutcomeSubtitle('sr-summary-title-sub', 'moduleCompleteMessages', percentageBucket(pct));
  }

  function srStartQuiz() {
    srQueue = shuffle(srVocab.map(function (v) { return v.id; }));
    srRetryQueue = [];
    srRetryAttempts = {};
    srAttemptCounts = {};
    srFirstTryCorrectCount = 0;
    srPassTotal = srQueue.length;
    srPassIndex = 0;
    srInRetryPass = false;
    srRetryPassCount = 0;
    document.getElementById('sr-direction').textContent = DIRECTION_LABEL[srDirection];
    srShowScreen('quiz');
    srNextQuestion();
  }

  function srRunCountdown() {
    srShowScreen('countdown');
    var n = CONFIG.speedMatch.countdownSeconds;
    var el = document.getElementById('sr-countdown-number');
    function tick() {
      if (n <= 0) { srCountdownTimeoutId = null; srStartQuiz(); return; }
      el.textContent = n;
      sfxPlayReadyCountdownSound(n === 1);
      n--;
      srCountdownTimeoutId = setTimeout(tick, CONFIG.speedMatch.countdownStepMs);
    }
    tick();
  }

  function openSpeedMatch(module) {
    // ⚠️ I LISTENER DI QUESTO MODULO STANNO QUI, E UNA VOLTA SOLA.
    //
    // `openSpeedMatch` viene chiamata a ogni apertura — misurato: tre volte
    // col gesto piu' banale (apri, mappa, riapri) — quindi senza
    // `BI.unaVoltaSola` ogni riapertura aggiungerebbe una copia di ognuno di
    // questi nove listener. Il pulsante farebbe partire l'azione due volte,
    // poi tre, **senza nessun errore e senza niente in console**.
    //
    // Stanno PRIMA di `showView`, che e' la riga che rende la schermata
    // toccabile.
    //
    // ⚠️ MA OGGI QUESTA POSIZIONE NON E' VERIFICABILE, E VA DETTO INVECE DI
    // LASCIARLO CREDERE. Fra la fine di questo blocco e `showView` non c'e'
    // niente di asincrono — solo assegnazioni e scritture nel DOM — quindi
    // tutto gira nello stesso tick e una finestra "pulsanti visibili e muti"
    // non esiste: spostare il blocco dopo `showView` non cambierebbe niente di
    // osservabile, e nessun test puo' cadere per quello.
    //
    // E' una precauzione per il PASSO 22, dove `open` potra' dover aspettare
    // il file del modulo: li' la finestra diventa reale. *Una precauzione
    // dichiarata come tale vale piu' di una regola che sembra protetta da un
    // test e non lo e'.*
    //
    // ⚠️ E qui ci sono i listener del modulo, non quelli che PORTANO al
    // modulo: un listener appartiene al modulo nella cui vista VIVE, non a
    // quello che apre. La riga della mappa che apre Speed Match resta fra i
    // condivisi, come `#edit-custom` per Personalizza.
    BI.unaVoltaSola('speedMatch', function () {
    document.getElementById('sr-ready-btn').addEventListener('click', function () {
      if (!srVocab.length) return;
      if (!document.getElementById('sr-start-checkbox-row').hidden) {
        setIntroDismissed(srModule.kind, getUserName(), document.getElementById('sr-start-dont-show-again').checked);
      }
      srRunCountdown();
    });

    document.getElementById('speed-match-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(srModule, { dismissPref: introDismissPref(srModule.kind) });
    });

    document.getElementById('sr-options').addEventListener('click', function (e) {
      var btn = e.target.closest('.sr-option');
      if (!btn || btn.disabled) return;
      srClearTimer();
      srFreezeTimer();
      srDisableOptions();
      var opt = srCurrentOptions[parseInt(btn.getAttribute('data-sr-index'), 10)];
      var attemptNum;
      if (opt.correct) {
        btn.classList.add('is-correct');
        sfxPlayCorrectSound();
        attemptNum = srRecordResult(true);
        if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) srPendingNudge = { wasCorrect: true };
        setTimeout(srGoNext, CONFIG.speedMatch.feedbackPauseMs);
      } else {
        btn.classList.add('is-wrong');
        sfxPlayWrongSound();
        attemptNum = srRecordResult(false);
        if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) srPendingNudge = { wasCorrect: false };
        srShowReveal();
      }
    });

    document.getElementById('sr-dontknow-btn').addEventListener('click', function () {
      srClearTimer();
      srFreezeTimer();
      srDisableOptions();
      sfxPlayWrongSound();
      var attemptNum = srRecordResult(false, true); // declared non-attempt -> straight to rosso
      if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) srPendingNudge = { wasCorrect: false };
      srShowReveal();
    });

    document.getElementById('sr-advance-btn').addEventListener('click', function () {
      srGoNext();
    });

    document.getElementById('sr-retry-continue-btn').addEventListener('click', function () {
      srNextQuestion();
    });

    document.getElementById('sr-complete-btn').addEventListener('click', function () {
      completeModule(srModule, CONFIG.moduleOutcomeRules[srModule.moduleId] === 'moduleRules'
        ? { level: moduleRulesLevel(srLastAvgPct), pct: srLastAvgPct }
        : null);
    });

    // Timers are stopped centrally by showView()'s own stopAllModuleActivity()
    // (see near its definition) — not repeated here.
    document.getElementById('speed-match-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('speed-match-help-btn').addEventListener('click', function () {
      openHelpFor(srModule);
    });
    });
    srModule = module;
    srDirection = SR_DIRECTION_BY_KIND[module.kind];
    srVocab = [];
    document.getElementById('speed-match-badge').innerHTML = moduleNameHtml(module.label);
    document.getElementById('speed-match-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('sr-prompt').textContent = '';
    document.getElementById('sr-options').innerHTML = '';
    srRenderStartScreen(module);
    srShowScreen('start');
    leaveModule('speedMatch');
    loadEpisodeData(module).then(function (data) {
      if (srModule !== module) return;
      srVocab = episodeGradeRequired(data, module.grade, module);
    }).catch(function () {
      if (srModule !== module) return;
      showLoadError(function () { openSpeedMatch(module); });
    });
  }
  // Speed Match, nelle due direzioni.
  BI.registraModulo('speedMatchEngIta', openSpeedMatch);
  BI.registraModulo('speedMatchItaEng', openSpeedMatch);

  // ---- I LISTENER DI SPEED MATCH NON STANNO PIU' QUI ----
  //
  // Sono entrati dentro `openSpeedMatch` il 2026-09-16 (passo 21-quater),
  // dietro `BI.unaVoltaSola('speedMatch', …)`. Chi non apre Speed Match non
  // attacca i suoi listener — e dal passo 22, chi non lo carica nemmeno.
  //
  // Il commento resta al PASSATO ed e' voluto: dice dove sono andati, non
  // finge che ci siano ancora. Chi cerca 'sr-ready-btn' qui deve trovare
  // questa riga, non il silenzio.
})(window.BI);
