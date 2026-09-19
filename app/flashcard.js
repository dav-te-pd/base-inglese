// DIPENDE DA: audio.js [parsing], dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL SECONDO MODULO. 36 pezzi, 395 righe — il più piccolo fra i cinque
// rimasti, stesso criterio del primo.
//
// ⚠️ DUE NOMI ALL'INSÙ VERSO index.html, E LA RAGIONE È UNA SOLA.
//
//   `itemText`             legge `currentEpisode` e `currentValues`
//   `recordPendingMastery` scrive `pendingMastery`
//
// Sono due dei QUATTRO registrati in `docs/decisioni.md` come bloccati dallo
// **stato di sessione** — gli altri due sono `recordMultipleChoiceResult` e
// `buildMultipleChoiceOptions`. *I nomi sono due, la ragione è una: escono
// tutti insieme col passo dello stato di sessione, non uno alla volta.*
//
// Il primo modulo (`app/repeataloud.js`) ne chiedeva uno. Due con ragione
// identica non è il numero che peggiora: è lo stesso blocco visto da un
// modulo che fa una cosa in più (segna la mastery). **Quello da guardare al
// terzo modulo è se compare una ragione DIVERSA.**
//
// ⚠️ E NON SI ALIASANO, mai: lo script inline di `index.html` è l'ULTIMO
// — sta dopo tutti i tag — quindi un alias in cima congelerebbe `undefined`
// per sempre. È il guasto che il primo modulo ha pagato, e
// `tests/test_dipendenze_dichiarate.js` [E] adesso lo vieta. Si chiamano
// `BI.itemText(...)` e `BI.recordPendingMastery(...)` al momento dell'uso.
//
// ⚠️ IL TAG STA NELLA SECONDA FILA per la ragione degli alias (venticinque,
// da `ui-condivisa`, `mappa`, `dati`), non per il markup: i dieci listener si
// agganciano dentro `openFlashcard`, a tempo di chiamata. Le ragioni della
// seconda fila sono due, e questo file ci sta per la seconda — come il primo
// modulo.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  /* ============================================================
     MODULES: FLASH CARD (Level A Eng-Ita / Level A Ita-Eng, more
     levels later)
     One shared component for every level+direction combo. module.
     module.grade dice quale grado dell'episodio leggere (episodeGrade) e
     module.flashcardDirection quale faccia mostrare per prima — niente di
     "Livello A" è scritto qui dentro, quindi un grado nuovo è solo una voce
     in più nel file episodio più due descrittori, senza toccare il
     componente. Standard Guarda+Help (top-row, always present except
     Guarda on the summary screen — CLAUDE.md rule 10), unlike Speed
     Round. One shuffled pass over every card; every card gets a real
     attempt — flip it, then Sì/Non ancora, which now advances straight
     to the next card on its own (fcAdvance) — a card is "wrong" only
     via a real "Non ancora". No Indietro/Avanti: there is no way to
     skip a card without flipping it, and no manual back-navigation to
     an already-answered card (which could otherwise re-record an
     already-counted attempt against mastery/the safety valve). As many
     further retry passes as needed — each with its own "Ripassiamo
     insieme..." screen — until one comes back with zero misses, then
     the summary screen.
     ============================================================ */

  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var fermaLaVoce = BI.fermaLaVoce;
  var staParlando = BI.staParlando;
  var sfxPlayCorrectSound = BI.sfxPlayCorrectSound;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var shuffle = BI.shuffle;
  var percentageBucket = BI.percentageBucket;
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

  // Card-to-card slide duration — must match the CSS transition on .fc-card.
  var FC_SLIDE_MS = 260;

  var fcModule = null;
  var fcIntroPending = false;
  var fcGrade = 'A';
  var fcDirection = 'en-it';
  var fcVocab = [];
  var fcPassItems = [];
  var fcPassIndex = 0;
  var fcPassResults = {}; // itemId -> 'correct' | 'wrong', for the current pass
  var fcInRetryPass = false; // job 3 (3rd collaudo): "Ripasso" badge, see fcRenderCard — same pattern as vcInRetryPass/qmInRetryPass/srInRetryPass, was missing here (fc-level-label showed the module's level text in the badge's own spot instead)
  var fcRetryPassCount = 0; // job 4 (2nd collaudo): which retryIntro pool (first/last) to show
  var fcRetryAttempts = {}; // itemId -> times wrong this session (across every pass)
  var fcAttemptCounts = {}; // itemId -> total attempts (right or wrong) this session, for the safety-valve popup
  var fcFirstTryCorrectCount = 0; // job 2A: items answered correctly on their very first attempt this session
  var fcLastAvgPct = 0; // fcFinishPassCheck's own pct, held for fc-complete-btn's saveModuleOutcome call (SelfScoreRules)
  var fcCurrentItem = null;
  var fcFlipped = false;
  var fcAnswered = false; // true once Sì/Non ancora has been chosen this viewing
  var fcNavLocked = false;
  var fcNavTimeoutId = null;

  function fcFrontText() { return BI.itemText(fcCurrentItem, fcDirection === 'en-it' ? 'en' : 'it'); }
  function fcBackText() { return BI.itemText(fcCurrentItem, fcDirection === 'en-it' ? 'it' : 'en'); }

  function fcShowScreen(name) {
    document.getElementById('fc-intro-screen').hidden = name !== 'intro';
    // Level/direction/card-counter belong to the actual exercise, not the
    // one-time intro explaining it — keep it hidden until intro is dismissed.
    document.getElementById('fc-meta-header').hidden = name === 'intro';
    document.getElementById('fc-card-screen').hidden = name !== 'card';
    document.getElementById('fc-retry-intro-screen').hidden = name !== 'retryIntro';
    document.getElementById('fc-summary-screen').hidden = name !== 'summary';
    // Nothing to explain on the completion screen — hide the button there
    // (CLAUDE.md rule 10); Help alone stays, same as every other screen.
    document.getElementById('flashcard-watch-btn').hidden = name === 'summary';
  }

  function fcShowChoice(show) {
    document.getElementById('fc-choice-row').hidden = !show;
  }

  // Every card gets a real attempt now (flip + Sì/Non ancora — no more
  // skip-without-flipping path), so 'wrong' always goes through the normal
  // one-level-at-a-time applyMasteryResult demotion, same as every other
  // module's real wrong answer. A "Non ancora" that keeps recurring across
  // retry passes is force-accepted as rosso after CONFIG.retryQueue.
  // maxAttempts attempts — the same shared safety valve every module with
  // a retry queue uses, so a single stubborn card can't loop the retry
  // passes forever; fcPassResults is set to 'correct' in that case purely
  // to close it out of fcFinishPassCheck's retry-queue computation, not a
  // real self-assessed answer.
  // Returns the item's total attempt count this session (right or wrong,
  // separate from fcRetryAttempts which only counts wrong ones) — jobs
  // 3+4's safety-valve popup fires when it reaches
  // CONFIG.retryQueue.attemptsReminderThreshold, same mechanic as Speed
  // Round/Match Practice's recordMultipleChoiceResult.
  function fcRecordResult(result) {
    fcPassResults[fcCurrentItem.id] = result;
    var unitId = 'flashcard-' + fcGrade + ':' + fcCurrentItem.id + ':' + fcDirection;
    BI.recordPendingMastery(unitId, result);

    var attemptNum = (fcAttemptCounts[fcCurrentItem.id] || 0) + 1;
    fcAttemptCounts[fcCurrentItem.id] = attemptNum;
    // job 2A: the Schermata Finale score counts first-try correct answers
    // only — a later retry-pass success doesn't inflate it.
    if (result === 'correct' && attemptNum === 1) fcFirstTryCorrectCount++;

    if (result === 'wrong') {
      var attempts = (fcRetryAttempts[fcCurrentItem.id] || 0) + 1;
      fcRetryAttempts[fcCurrentItem.id] = attempts;
      if (attempts >= CONFIG.retryQueue.maxAttempts) {
        BI.recordPendingMastery(unitId, { level: 'rosso', streak: 0 });
        fcPassResults[fcCurrentItem.id] = 'correct';
      }
    }
    return attemptNum;
  }

  // Resets the card to its front-facing state with no animation: just
  // removing "is-flipped" would trigger .fc-card-inner's own flip
  // transition, briefly animating the OUTGOING (already-flipped) face
  // back into view — exactly the "flash of the translated content"
  // this exists to prevent. Disabling the transition, forcing a reflow,
  // then re-enabling it makes the reset instantaneous.
  function fcResetFlipInstant() {
    var inner = document.getElementById('fc-card-inner');
    inner.style.transition = 'none';
    document.getElementById('fc-card').classList.remove('is-flipped');
    void inner.offsetWidth;
    inner.style.transition = '';
  }

  function fcRenderCard() {
    fcCurrentItem = fcVocab.find(function (v) { return v.id === fcPassItems[fcPassIndex]; });
    fcFlipped = false;
    fcAnswered = false;
    // Front state committed before anything else renders, per the fix above.
    fcResetFlipInstant();
    document.getElementById('fc-counter').textContent = (fcPassIndex + 1) + ' / ' + fcPassItems.length;
    document.getElementById('fc-ripasso-badge').hidden = !fcInRetryPass;
    document.getElementById('fc-front-word').textContent = fcFrontText();
    document.getElementById('fc-back-word').textContent = fcBackText();
    // The listen block only makes sense on the English side — it always
    // speaks with an English voice (toggleSpeak/pickVoice), so on the
    // Italian side it would read the user's own native language with an
    // English accent. Which side is English depends on fcDirection, not
    // on front/back, and flips between the two Flash Card directions.
    var frontIsEnglish = fcDirection === 'en-it';
    var frontAudioEl = document.getElementById('fc-front-audio');
    var backAudioEl = document.getElementById('fc-back-audio');
    frontAudioEl.hidden = !frontIsEnglish;
    frontAudioEl.innerHTML = frontIsEnglish ? renderListenBlock({ say: 'front' }) : '';
    backAudioEl.hidden = frontIsEnglish;
    backAudioEl.innerHTML = !frontIsEnglish ? renderListenBlock({ say: 'back' }) : '';
    fcShowChoice(false);
    // The data load runs in the background regardless of the intro screen
    // (see openFlashcard) — don't let it jump past an intro still pending
    // dismissal; the "Ho capito, inizia" handler shows 'card' itself once done.
    if (!fcIntroPending) fcShowScreen('card');
  }

  // Toggles the card between front and back at any point — not just a
  // one-shot flip — so the user can flip back to reread the front before
  // committing to an answer. Once answered (Sì/Non ancora), the card is
  // resolved for this viewing and no longer responds to taps, so a
  // completed choice can't be silently reopened by flipping again.
  // Regola Azione Critica (job 5, 3rd collaudo): flipping is itself a
  // critical action, same one-liner stopAllModuleActivity/toggleSpeak
  // already use to interrupt whatever's mid-utterance. The document-
  // level click listener (near toggleSpeak, correction 6th collaudo)
  // already covers the CLICK path here — this stays as its own guard
  // because fcFlip's other entry point, the keydown handler below
  // (Enter/Space on #fc-card, a div with role="button" rather than a
  // real <button>), never fires a native click event at all.
  function fcFlip() {
    if (fcNavLocked || fcAnswered) return;
    if (staParlando()) {
      fermaLaVoce();
      // Belt and braces (correction, 5th collaudo): cancel() calling the
      // utterance's own onend/onerror to clear its button's "speaking"
      // class isn't guaranteed across engines — if it doesn't, the next
      // tap on that same listen button reads as "already speaking" and
      // silently no-ops instead of starting. Clearing it here directly
      // guarantees the listen button works again right after a flip.
      var speakingBtn = document.querySelector('#fc-card .speaking');
      if (speakingBtn) speakingBtn.classList.remove('speaking');
    }
    fcFlipped = !fcFlipped;
    document.getElementById('fc-card').classList.toggle('is-flipped', fcFlipped);
    // The Doppia Scelta box only makes sense with the back showing.
    fcShowChoice(fcFlipped);
  }

  function fcFinishPassCheck() {
    var wrongIds = fcPassItems.filter(function (id) { return fcPassResults[id] !== 'correct'; });
    if (wrongIds.length === 0) {
      sfxPlayTraguardoSound();
      fcShowScreen('summary');
      // firstAttempt is the only attempt that exists here (no same-pass
      // retry — see vcEvaluate's own comment): frozen before the
      // ripasso pass — same pct feeds the message tone here and the
      // SelfScoreRules map badge.
      var pct = fcVocab.length ? Math.round((fcFirstTryCorrectCount / fcVocab.length) * 100) : 0;
      fcLastAvgPct = pct;
      applyOutcomeSubtitle('fc-summary-title-sub', 'moduleCompleteMessages', percentageBucket(pct));
    } else {
      fcPassItems = shuffle(wrongIds);
      fcPassIndex = 0;
      fcPassResults = {};
      fcInRetryPass = true;
      fcRetryPassCount++;
      fcShowScreen('retryIntro');
      applyRetryIntroContent('fc-retry-intro-screen', fcRetryPassCount >= CONFIG.retryQueue.maxAttempts - 1);
    }
  }

  // Card-to-card navigation only (not the retry-pass's first card, which
  // has nothing to slide away from): the current card slides out right,
  // then the new one — already front-facing, per fcRenderCard above —
  // settles in. Guarded by fcNavLocked so a rapid double-tap can't start
  // a second slide mid-animation.
  function fcClearNavTimeout() {
    if (fcNavTimeoutId) { clearTimeout(fcNavTimeoutId); fcNavTimeoutId = null; }
    fcNavLocked = false;
    document.getElementById('fc-card').classList.remove('is-sliding-out', 'is-sliding-in');
  }
  // Flash Card.
  BI.registraPulizia(fcClearNavTimeout);

  function fcNavigateTo(renderFn) {
    if (fcNavLocked) return;
    fcNavLocked = true;
    var card = document.getElementById('fc-card');
    card.classList.add('is-sliding-out');
    fcNavTimeoutId = setTimeout(function () {
      fcNavTimeoutId = null;
      renderFn();
      card.classList.remove('is-sliding-out');
      card.classList.add('is-sliding-in');
      void card.offsetWidth;
      card.classList.remove('is-sliding-in');
      fcNavLocked = false;
    }, FC_SLIDE_MS);
  }

  // Advances to the next card, or wraps up the pass, once the Sì/Non
  // ancora handlers below have already recorded a result — no other
  // caller: there's no way to advance without answering, and no way to
  // navigate back to a previous (already-answered) card.
  function fcAdvance() {
    if (fcPassIndex < fcPassItems.length - 1) {
      fcPassIndex++;
      fcNavigateTo(fcRenderCard);
    } else {
      fcFinishPassCheck();
    }
  }

  // Mirrors qmGoNext/srGoNext (jobs 3+4) — the "Sì la so"/"Non ancora"
  // handlers below call this instead of fcAdvance directly, so a pending
  // safety-valve nudge shows before the card actually advances.
  var fcPendingNudge = null;

  function fcGoNext() {
    if (fcPendingNudge) {
      var wasCorrect = fcPendingNudge.wasCorrect;
      fcPendingNudge = null;
      openAttemptPopup(wasCorrect, null, fcAdvance);
    } else {
      fcAdvance();
    }
  }

  function fcStartDeck() {
    fcPassItems = shuffle(fcVocab.map(function (v) { return v.id; }));
    fcPassIndex = 0;
    fcPassResults = {};
    fcRetryAttempts = {};
    fcAttemptCounts = {};
    fcFirstTryCorrectCount = 0;
    fcInRetryPass = false;
    fcRetryPassCount = 0;
    fcRenderCard();
  }

  function openFlashcard(module) {
    // I listener di questo modulo, una volta sola.
    //
    // ⚠️ LA CHIAVE E' 'flashcard', E QUI LA CHIAVE SBAGLIATA PASSEREBBE VERDE.
    //
    // `openFlashcard` serve UN kind solo (`flashcard`), condiviso da DUE
    // descrittori (`flashcardAEngIta`, `flashcardAItaEng`): quindi
    // `BI.unaVoltaSola('flashcard', …)` e `BI.unaVoltaSola(module.kind, …)`
    // passano **la stessa identica stringa**, e nessuna corsa puo'
    // distinguerle. Misurato il 2026-09-16 falsificando apposta: il test resta
    // **26/26 verde** con la chiave sul kind.
    //
    // **Quel verde non prova che la chiave sia giusta: prova che qui le due
    // chiavi coincidono.** Sono due affermazioni diverse, e la seconda non
    // implica la prima.
    //
    // La chiave giusta si scrive lo stesso, e questa e' la riga che serve fra
    // sei mesi a chi «semplificherebbe» vedendo che funziona: la regola e' il
    // BLOCCO, e vale per tutti e otto i moduli. Qui non la protegge nessun
    // test — la protegge questo commento. Le famiglie in questa condizione
    // sono TRE (`openFlashcard`, `openRepeatAloud`, `openCustomize`), e il
    // blocco [F] di tests/test_listener_una_volta.js e' l'unico avviso che
    // arrivera' se una delle tre prendesse un secondo kind. La regola per
    // esteso sta accanto a `BI.unaVoltaSola` in app/spazio.js.
    //
    // Sul PERCHE' stiano prima di `showView`: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, ed e' una precauzione per il
    // passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('flashcard', function () {
    document.getElementById('fc-card').addEventListener('click', function (e) {
      var sayBtn = e.target.closest('[data-say]');
      if (sayBtn) {
        e.stopPropagation();
        var isBack = !!e.target.closest('.fc-card-back');
        // Correction (5th collaudo): no countdown here — Sì/Non ancora
        // (their own click handlers below) stop the card's audio on touch
        // instead of being locked out during it.
        speakListenBlock(sayBtn, isBack ? fcBackText() : fcFrontText());
        return;
      }
      fcFlip();
    });

    document.getElementById('fc-card').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fcFlip(); }
    });

    // Sì/Non ancora advance straight to the next card — no Avanti click, and
    // no Indietro to go back: a card can only be answered once. fcAnswered=
    // true still guards fcFlip during the brief slide-out (fcNavigateTo/
    // fcNavLocked already guards against a double advance).
    // "Non ancora" deliberately plays NO sound (job: sound catalog) — a
    // still-learning card is expected here, not an error, so the generic
    // sbagliato tone would misread as a small failure on every other card.
    document.getElementById('fc-not-yet-btn').addEventListener('click', function () {
      var attemptNum = fcRecordResult('wrong');
      if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) fcPendingNudge = { wasCorrect: false };
      fcAnswered = true;
      fcGoNext();
    });

    // "Sì, la so" plays Corretto — one card of fifteen, not a completion
    // (Traguardo stays reserved for fcFinishPassCheck's own Schermata
    // Finale, see sfxPlayTraguardoSound's comment).
    document.getElementById('fc-know-it-btn').addEventListener('click', function () {
      var attemptNum = fcRecordResult('correct');
      sfxPlayCorrectSound();
      if (attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) fcPendingNudge = { wasCorrect: true };
      fcAnswered = true;
      fcGoNext();
    });

    document.getElementById('fc-retry-continue-btn').addEventListener('click', fcRenderCard);

    document.getElementById('fc-complete-btn').addEventListener('click', function () {
      // SelfScoreRules: same moduleRulesLevel() math as ModuleRules, but the
      // number behind it is the student's own declared "Sì, la so" share.
      completeModule(fcModule, CONFIG.moduleOutcomeRules[fcModule.moduleId] === 'selfScoreRules'
        ? { level: moduleRulesLevel(fcLastAvgPct), pct: fcLastAvgPct }
        : null);
    });

    // The slide-nav timeout is stopped centrally by showView()'s own
    // stopAllModuleActivity() (see near its definition) — not repeated here.
    document.getElementById('flashcard-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('flashcard-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(fcModule, { dismissPref: introDismissPref(fcModule.kind) });
    });

    document.getElementById('fc-intro-start-btn').addEventListener('click', function () {
      setIntroDismissed(fcModule.kind, getUserName(), document.getElementById('fc-intro-dont-show-again').checked);
      fcIntroPending = false;
      fcShowScreen('card');
    });

    document.getElementById('flashcard-help-btn').addEventListener('click', function () {
      openHelpFor(fcModule);
    });
    });

    fcModule = module;
    fcClearNavTimeout();
    fcGrade = module.grade;
    fcDirection = module.flashcardDirection;
    document.getElementById('flashcard-badge').innerHTML = moduleNameHtml(module.label);
    document.getElementById('flashcard-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('fc-direction').textContent = DIRECTION_LABEL[fcDirection];
    document.getElementById('fc-counter').textContent = '';
    document.getElementById('fc-front-word').textContent = 'Caricamento...';
    document.getElementById('fc-back-word').textContent = '';
    fcIntroPending = !isIntroDismissed(module.kind, getUserName());
    if (fcIntroPending) {
      document.getElementById('fc-intro-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'fc-intro-title', 'fc-intro-body', module.label, 'fc-intro-start-btn', 'fc-intro-dont-show-text');
      fcShowScreen('intro');
    } else {
      fcShowScreen('card');
    }
    leaveModule('flashcard');
    loadEpisodeData(module).then(function (data) {
      if (fcModule !== module) return;
      fcVocab = episodeGradeRequired(data, module.grade, module);
      fcStartDeck();
    }).catch(function () {
      if (fcModule !== module) return;
      showLoadError(function () { openFlashcard(module); });
    });
  }
  // ⚠️ Flash Card: UN SOLO kind per DUE descrittori (flashcardAEngIta e
  // flashcardAItaEng lo condividono). Si registra una volta sola — e se
  // qualcuno provasse a registrarlo per descrittore, BI.registraModulo
  // alzerebbe un'eccezione al boot invece di lasciar vincere l'ultimo.
  BI.registraModulo('flashcard', openFlashcard);

  // ---- I LISTENER DI FLASH CARD NON STANNO PIU' QUI ----
  //
  // Sono entrati dentro `openFlashcard` il 2026-09-16 (passo 21-quater ⑥),
  // dietro `BI.unaVoltaSola('flashcard', …)`. Il commento resta al PASSATO.
  //
  // Sono DIECI su NOVE elementi: `fc-card` ne porta due, `click` e `keydown`
  // — ed e' l'UNICO elemento di modulo in tutto il censimento con due TIPI di
  // evento (gli altri quattro casi sono condivisi). Non cambia niente per la
  // conversione — la guardia e' sul blocco, non sul listener — ma chi conta
  // «un listener per pulsante» qui trova nove pulsanti e dieci righe di
  // baseline, e deve sapere che e' giusto cosi'.
})(window.BI);
