// DIPENDE DA: dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL TERZO MODULO. 28 pezzi, 352 righe — e con lui arriva la risposta alla
// domanda che i due precedenti avevano lasciato aperta.
//
// ⚠️ TRE NOMI ALL'INSÙ VERSO index.html, E LA RAGIONE È ANCORA UNA SOLA.
//
//   `itemText`                   legge `currentEpisode` e `currentValues`
//   `recordMultipleChoiceResult` chiama `recordPendingMastery`
//   `buildMultipleChoiceOptions` chiama `itemText`
//
// **Questi tre e i due di Flash Card sono lo STESSO insieme di quattro**,
// registrato in `docs/decisioni-stato.md` come bloccato dallo **stato di sessione**.
// Il primo modulo ne chiedeva uno, il secondo due, il terzo tre: *il numero
// sale perché ogni modulo ne tocca una fetta diversa, non perché nasca una
// ragione nuova.* **Quello che doveva essere guardato al terzo modulo era
// esattamente questo, ed è andato bene: nessuna ragione diversa è comparsa.**
//
// Escono tutti e quattro insieme col passo dello stato di sessione, e quel
// giorno questi tre `BI.` spariscono da qui.
//
// ⚠️ NON SI ALIASANO: lo script inline di `index.html` è l'ULTIMO, quindi un
// alias in cima congelerebbe `undefined`. Vietato da `[E]` di
// `tests/test_dipendenze_dichiarate.js` dal primo modulo in poi.
//
// IL TAG STA NELLA SECONDA FILA per gli alias, non per il markup: i dieci
// listener si agganciano dentro `openMatch`, a tempo di chiamata.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;
  var barraAzioniFinale = BI.barraAzioniFinale;

  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var sfxPlayCorrectSound = BI.sfxPlayCorrectSound;
  var sfxPlayWrongSound = BI.sfxPlayWrongSound;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var shuffle = BI.shuffle;
  var percentageBucket = BI.percentageBucket;
  var uiText = BI.uiText;
  var DIRECTION_LABEL = BI.DIRECTION_LABEL;
  var renderListenBlock = BI.renderListenBlock;
  var speakListenBlock = BI.speakListenBlock;
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
     MODULES: MATCH PRACTICE ENG-ITA / MATCH PRACTICE ITA-ENG
     Same multiple-choice/retry/mastery mechanics as Speed Match below
     (shared via buildMultipleChoiceOptions/recordMultipleChoiceResult
     above — CLAUDE.md rule 13), minus everything timer-related: no
     time limit, no progress bar, no countdown, no Indietro (Speed
     Round doesn't have one either). Own mastery unitId prefix
     ('match:') and own retry-queue/attempts state, so mastery is
     tracked separately per exercise type even for the same vocabulary
     item. No "Mostra traduzione" in either direction — the 4-option
     answer IS the translation here. Eng-Ita shows a full listen block
     (icon + 100/75/50%) under the English prompt, reusing
     renderRateButtons/toggleSpeak exactly like Repeat Aloud. Ita-Eng
     instead gives each of the 4 English options its own compact
     icon-only mini listen button (always default rate) via
     .qm-option-row; the Italian prompt has no audio at all, since
     it's the user's own language.
     ============================================================ */
  var QM_DIRECTION_BY_KIND = { matchEngIta: 'en-it', matchItaEng: 'it-en' };

  var qmModule = null;
  var qmDirection = 'en-it'; // fixed for the whole module session
  var qmVocab = [];
  var qmQueue = [];
  var qmRetryQueue = [];
  var qmRetryAttempts = {}; // itemId -> times wrong/declared-non-attempt this session
  var qmAttemptCounts = {}; // itemId -> total attempts (right or wrong) this session, for the safety-valve popup
  var qmFirstTryCorrectCount = 0; // job 2A: items answered correctly on their very first attempt this session
  var qmLastAvgPct = 0; // qmFinishModule's own pct, held for match-complete-btn's saveModuleOutcome call (ModuleRules)
  var qmPassIndex = 0;
  var qmPassTotal = 0;
  var qmInRetryPass = false; // job: "Ripasso" badge, see qmRenderQuestion
  var qmRetryPassCount = 0; // job 4 (2nd collaudo): which retryIntro pool (first/last) to show
  var qmCurrentItem = null;
  var qmCurrentOptions = [];

  // Job 1 (7th collaudo): "Non lo so" is a declared non-attempt, not a
  // regular wrong answer — it skips the gradual demotion and sends the
  // word straight to rosso (see qmRecordResult's declaredNonAttempt).
  // Left clickable after an answer was already chosen, a fast tap could
  // land on it and overwrite a just-recorded CORRECT answer with a
  // straight-to-rosso non-attempt — it needs to lock together with the
  // options, not as a separate afterthought.
  function qmDisableOptions() {
    document.querySelectorAll('#qm-options .sr-option').forEach(function (b) { b.disabled = true; });
    document.getElementById('qm-dontknow-btn').disabled = true;
  }

  function qmShowScreen(name) {
    document.getElementById('qm-start-screen').hidden = name !== 'start';
    document.getElementById('qm-retry-intro-screen').hidden = name !== 'retryIntro';
    document.getElementById('qm-quiz-screen').hidden = name !== 'quiz';
    document.getElementById('qm-summary-screen').hidden = name !== 'summary';
    // Spiegazione+Help now visible on every screen, quiz included (the
    // buttons existed in markup but were only ever un-hidden on start/
    // summary — bug fix, 8th collaudo). Spiegazione still hides on the
    // Schermata Finale alone (CLAUDE.md rule 10 — nothing left to explain
    // there); Help never hides. No timer in Match Practice, so neither is
    // ever disabled either (unlike Speed Match's srStartTimer/
    // srDisableOptions lock).
    barraAzioniFinale('match', name);
    document.getElementById('match-help-btn').hidden = false;
  }

  // Same dual-purpose start screen as Speed Match: full howItWorks the
  // first time, short "Pronto?" prompt after — it just leads straight
  // into the quiz instead of gating a countdown, since there's none here.
  function qmRenderStartScreen(module) {
    var dismissed = isIntroDismissed(module.kind, getUserName());
    document.getElementById('qm-start-checkbox-row').hidden = dismissed;
    document.getElementById('qm-start-body').hidden = dismissed;
    if (dismissed) {
      document.getElementById('qm-start-title').textContent = uiText('condivisi.readyTitle');
      document.getElementById('qm-start-btn').textContent = uiText('condivisi.readyStart');
    } else {
      document.getElementById('qm-start-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'qm-start-title', 'qm-start-body', module.label, 'qm-start-btn', 'qm-start-dont-show-text');
    }
  }

  // Thin wrapper around the shared recordMultipleChoiceResult (rule 13) —
  // own mastery unitId prefix and own retry queue keep Match Practice's
  // mastery independent from Speed Match's (the max-attempts threshold
  // itself is the one shared CONFIG.retryQueue.maxAttempts).
  function qmRecordResult(correct, declaredNonAttempt) {
    var attemptNum = BI.recordMultipleChoiceResult({
      item: qmCurrentItem,
      direction: qmDirection,
      correct: correct,
      declaredNonAttempt: declaredNonAttempt,
      unitPrefix: 'match',
      retryAttempts: qmRetryAttempts,
      attemptCounts: qmAttemptCounts,
      retryQueue: qmRetryQueue,
      maxRetryAttempts: CONFIG.retryQueue.maxAttempts
    });
    // job 2A: the Schermata Finale score counts first-try correct answers
    // only — a later retry-pass success doesn't inflate it.
    if (correct && attemptNum === 1) qmFirstTryCorrectCount++;
    return attemptNum;
  }

  function qmRenderQuestion() {
    document.getElementById('qm-reveal').hidden = true;
    document.getElementById('qm-advance-btn').hidden = true;
    document.getElementById('qm-dontknow-btn').hidden = false;
    document.getElementById('qm-dontknow-btn').disabled = false;
    document.getElementById('qm-counter').textContent = qmPassIndex + ' / ' + qmPassTotal;
    document.getElementById('qm-ripasso-badge').hidden = !qmInRetryPass;
    document.getElementById('qm-direction').textContent = DIRECTION_LABEL[qmDirection];
    var promptText = BI.itemText(qmCurrentItem, qmDirection === 'en-it' ? 'en' : 'it');
    document.getElementById('qm-prompt').textContent = promptText;

    var audioEl = document.getElementById('qm-prompt-audio');
    if (qmDirection === 'en-it') {
      audioEl.hidden = false;
      audioEl.innerHTML = renderListenBlock({ say: 'prompt' });
    } else {
      audioEl.hidden = true;
      audioEl.innerHTML = '';
    }

    qmCurrentOptions = BI.buildMultipleChoiceOptions(qmCurrentItem, qmDirection, qmVocab);
    document.getElementById('qm-options').innerHTML = qmCurrentOptions.map(function (opt, i) {
      var optionBtn = '<button type="button" class="help-option sr-option" data-qm-index="' + i + '">' + opt.text + '</button>';
      if (qmDirection !== 'it-en') return optionBtn;
      // Ita-Eng only: pair each English option with its own mini listen
      // button (see .qm-option-row) — data-qm-listen-index keeps this
      // click target distinct from the answer button it sits next to.
      return '<div class="qm-option-row">' +
        renderListenBlock({ say: i, mini: true }) + optionBtn + '</div>';
    }).join('');
  }

  function qmNextQuestion() {
    if (qmQueue.length === 0) {
      if (qmRetryQueue.length > 0) {
        qmQueue = shuffle(qmRetryQueue);
        qmRetryQueue = [];
        qmPassTotal = qmQueue.length;
        qmPassIndex = 0;
        qmInRetryPass = true;
        qmRetryPassCount++;
        qmShowScreen('retryIntro');
        applyRetryIntroContent('qm-retry-intro-screen', qmRetryPassCount >= CONFIG.retryQueue.maxAttempts - 1);
        return;
      } else {
        qmFinishModule();
        return;
      }
    }
    var itemId = qmQueue.shift();
    qmPassIndex++;
    qmCurrentItem = qmVocab.find(function (v) { return v.id === itemId; });
    qmShowScreen('quiz');
    qmRenderQuestion();
  }

  // The one place every "move on from this question" click routes
  // through (answer-click's correct-branch timeout, Avanti after a
  // reveal, and the retry-pass continue button) — jobs 3+4's safety-valve
  // popup on an item that just hit CONFIG.retryQueue.attemptsReminderThreshold
  // (see qmPendingNudge, set right after qmRecordResult). No popup pending
  // -> straight through to qmNextQuestion, same as before.
  var qmPendingNudge = null;

  function qmGoNext() {
    if (qmPendingNudge) {
      var wasCorrect = qmPendingNudge.wasCorrect;
      qmPendingNudge = null;
      openAttemptPopup(wasCorrect, null, qmNextQuestion);
    } else {
      qmNextQuestion();
    }
  }

  // Shared by a wrong tap and "Non lo so": reveal the correct answer and
  // wait for an explicit "Avanti" instead of auto-advancing, same pacing
  // as Speed Match. Reads the answer straight off qmCurrentOptions rather
  // than recomputing the direction logic again.
  function qmShowReveal() {
    var correctOpt = qmCurrentOptions.find(function (o) { return o.correct; });
    document.querySelectorAll('#qm-options .sr-option').forEach(function (b, i) {
      if (qmCurrentOptions[i] && qmCurrentOptions[i].correct) b.classList.add('is-correct');
    });
    document.getElementById('qm-reveal-text').textContent = uiText('condivisi.rispostaCorretta') + correctOpt.text;
    document.getElementById('qm-reveal').hidden = false;
    document.getElementById('qm-dontknow-btn').hidden = true;
    document.getElementById('qm-advance-btn').hidden = false;
  }

  function qmFinishModule() {
    sfxPlayTraguardoSound();
    qmShowScreen('summary');
    // firstAttempt is the only attempt that exists here (no same-pass
    // retry — see vcEvaluate's LastAttemptRule/FirstAttemptRule
    // comment): qmFirstTryCorrectCount
    // only ever increments on an item's very first attempt, so this pct is
    // already frozen before the ripasso pass — same number feeds both the
    // message tone here and the ModuleRules map badge (match-complete-btn).
    var pct = qmVocab.length ? Math.round((qmFirstTryCorrectCount / qmVocab.length) * 100) : 0;
    qmLastAvgPct = pct;
    applyOutcomeSubtitle('qm-summary-title-sub', 'moduleCompleteMessages', percentageBucket(pct));
  }

  function qmStartQuiz() {
    qmQueue = shuffle(qmVocab.map(function (v) { return v.id; }));
    qmRetryQueue = [];
    qmRetryAttempts = {};
    qmAttemptCounts = {};
    qmFirstTryCorrectCount = 0;
    qmPassTotal = qmQueue.length;
    qmPassIndex = 0;
    qmInRetryPass = false;
    qmRetryPassCount = 0;
    qmShowScreen('quiz');
    qmNextQuestion();
  }

  function openMatch(module) {
    // I listener di questo modulo, una volta sola.
    //
    // ⚠️ LA CHIAVE E' 'match' — il BLOCCO, non il kind. Qui la differenza si
    // VEDE: questa `open` serve DUE kind (`matchEngIta`, `matchItaEng`), quindi
    // con `module.kind` per chiave il blocco girerebbe due volte, una per
    // direzione, e ogni listener avrebbe due copie. E' lo stesso caso di
    // Speed Match e di Dialogo. La regola per esteso sta accanto a
    // `BI.unaVoltaSola` in app/spazio.js.
    //
    // Sul PERCHE' stiano prima di `showView`: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, ed e' una precauzione per il
    // passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('match', function () {
    document.getElementById('qm-start-btn').addEventListener('click', function () {
      if (!qmVocab.length) return;
      if (!document.getElementById('qm-start-checkbox-row').hidden) {
        setIntroDismissed(qmModule.kind, getUserName(), document.getElementById('qm-start-dont-show-again').checked);
      }
      qmStartQuiz();
    });

    document.getElementById('match-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(qmModule, { dismissPref: introDismissPref(qmModule.kind) });
    });

    document.getElementById('qm-options').addEventListener('click', function (e) {
      // Ita-Eng's mini listen button sits inside the same options container —
      // check it first so tapping it plays audio instead of submitting an answer.
      var listenBtn = e.target.closest('[data-qm-listen-index]');
      if (listenBtn) {
        var listenOpt = qmCurrentOptions[parseInt(listenBtn.getAttribute('data-qm-listen-index'), 10)];
        if (listenOpt) speakListenBlock(listenBtn, listenOpt.text);
        return;
      }
      var btn = e.target.closest('.sr-option');
      if (!btn || btn.disabled) return;
      qmDisableOptions();
      var opt = qmCurrentOptions[parseInt(btn.getAttribute('data-qm-index'), 10)];
      var attemptNum;
      if (opt.correct) {
        btn.classList.add('is-correct');
        sfxPlayCorrectSound();
        attemptNum = qmRecordResult(true);
        if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) qmPendingNudge = { wasCorrect: true };
        setTimeout(qmGoNext, CONFIG.match.feedbackPauseMs);
      } else {
        btn.classList.add('is-wrong');
        sfxPlayWrongSound();
        attemptNum = qmRecordResult(false);
        if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) qmPendingNudge = { wasCorrect: false };
        qmShowReveal();
      }
    });

    document.getElementById('qm-prompt-audio').addEventListener('click', function (e) {
      var say = e.target.closest('[data-say]');
      if (!say) return;
      // Correction (5th collaudo): no countdown here — answering while the
      // prompt reads isn't blocked, it stops the prompt (see the
      // .sr-option/qm-dontknow-btn handlers' own stop-on-touch guard,
      // which stays).
      speakListenBlock(say, BI.itemText(qmCurrentItem, 'en'));
    });

    document.getElementById('qm-dontknow-btn').addEventListener('click', function () {
      qmDisableOptions();
      sfxPlayWrongSound();
      var attemptNum = qmRecordResult(false, true); // declared non-attempt -> straight to rosso
      if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) qmPendingNudge = { wasCorrect: false };
      qmShowReveal();
    });

    document.getElementById('qm-advance-btn').addEventListener('click', function () {
      qmGoNext();
    });

    document.getElementById('qm-retry-continue-btn').addEventListener('click', function () {
      qmNextQuestion();
    });

    document.getElementById('qm-complete-btn').addEventListener('click', function () {
      // ModuleRules (CONFIG.moduleOutcomeRules), same reference wiring as
      // Voice Coach's own complete-btn: verified answers, first-pass pct.
      completeModule(qmModule, CONFIG.moduleOutcomeRules[qmModule.moduleId] === 'moduleRules'
        ? { level: moduleRulesLevel(qmLastAvgPct), pct: qmLastAvgPct }
        : null);
    });

    document.getElementById('match-back-map').addEventListener('click', function () {
      openEpisodeMap();
    });

    document.getElementById('match-help-btn').addEventListener('click', function () {
      openHelpFor(qmModule);
    });
    });

    qmModule = module;
    qmDirection = QM_DIRECTION_BY_KIND[module.kind];
    qmVocab = [];
    document.getElementById('match-badge').innerHTML = moduleNameHtml(module.label);
    document.getElementById('match-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('qm-prompt').textContent = '';
    document.getElementById('qm-options').innerHTML = '';
    qmRenderStartScreen(module);
    qmShowScreen('start');
    leaveModule('match');
    loadEpisodeData(module).then(function (data) {
      if (qmModule !== module) return;
      qmVocab = episodeGradeRequired(data, module.grade, module);
    }).catch(function () {
      if (qmModule !== module) return;
      showLoadError(function () { openMatch(module); });
    });
  }
  // Match Practice, nelle due direzioni.
  BI.registraModulo('matchEngIta', openMatch);
  BI.registraModulo('matchItaEng', openMatch);

  // ---- I LISTENER DI MATCH NON STANNO PIU' QUI ----
  //
  // Sono entrati dentro `openMatch` il 2026-09-16 (passo 21-quater ⑤), dietro
  // `BI.unaVoltaSola('match', …)`. Il commento resta al PASSATO: chi cerca
  // `qm-start-btn` qui non deve concludere che sia sparito.
  //
  // Sono DIECI, e sono tutti quelli della famiglia `match` del censimento
  // (`tests/listener-census.js`): nessuna eccezione, nessun listener di questo
  // modulo vive altrove. Il conto e' verificato da `tests/BASELINE-LISTENER.txt`,
  // che il 21-quater non tocca — se una riga di quel file cambia durante questo
  // passo, e' un errore, non un aggiornamento.
})(window.BI);
