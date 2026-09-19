// DIPENDE DA: audio.js [parsing], dati.js [parsing], identita.js [parsing], index.html [chiamata], mappa.js [parsing], orchestrazione.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL SESTO E ULTIMO MODULO. 736 righe, 430 di codice: un componente solo
// per i tre passi del Dialogo Completo — Ascolta e Ripeti, Ripeti a Tempo,
// Dialogo Continuo — che si distinguono per PROFILO, non per codice.
//
// ⚠️ ED È L'UNICO DEI SEI CHE NON CHIEDE NESSUNO DEI QUATTRO PEZZI BLOCCATI.
//
// Verso `index.html` chiede DUE nomi, e sono i soli accessori:
// `episodioCorrente` e `valoriCorrenti`. Nessuno dei quattro bloccati dallo
// stato di sessione (`itemText`, `recordPendingMastery`,
// `recordMultipleChoiceResult`, `buildMultipleChoiceOptions`) serve qui — *il
// Dialogo non fa quiz a scelta multipla e non scrive mastery: ascolta,
// cronometra e conta le battute saltate.*
//
// ⚠️ **AVEVO SCRITTO «non chiede niente», E LA MISURA L'HA SMENTITO:**
// `dipendenze.js` conta i due accessori, perché vivono in `index.html` come
// tutto il resto della sessione. *Sono chiamate, non alias — e per questo
// funzionano — ma restano una dipendenza, e scriverla zero sarebbe stato un
// numero più bello di quello vero.* La dichiarazione è corretta verso la
// misura, come le altre due volte oggi.
//
// ⚠️ È ANCHE L'UNICO CHE PORTA VIA L'ECCEZIONE ALLA REGOLA 16.
// `dgAudioProtected()` è la riga per cui il listener globale in cattura si
// tira indietro: nei profili col countdown un tocco qualunque NON interrompe
// l'audio, perché il conto alla rovescia parte dalla sua fine e interromperlo
// a metà lo sfaserebbe. **La funzione esce di qui, il listener resta dov'è**
// — chi la cerca leggendo `app/audio.js` deve venire a trovarla qui.
//
// E porta via la TERZA pulizia (`dgClearAllTimers`), l'ultima delle cinque:
// da questo commit `stopAllModuleActivity` non ne registra più nessuna da
// `index.html`.
//
// ⚠️ NON SI ALIASANO i nomi di `index.html`: lo script inline è l'ULTIMO.
// Qui non ce ne sono da aliasare, ed è la prima volta in sei moduli.
//
// IL TAG STA NELLA SECONDA FILA per gli alias.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var getUserName = BI.getUserName;
  var icon = BI.icon;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var addNextLineSkip = BI.addNextLineSkip;
  var sfxPlayCountdownSound = BI.sfxPlayCountdownSound;
  var sfxPlayReadyCountdownSound = BI.sfxPlayReadyCountdownSound;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var tokenize = BI.tokenize;
  var toggleSpeak = BI.toggleSpeak;
  var fermaLaVoce = BI.fermaLaVoce;
  var pausaLaVoce = BI.pausaLaVoce;
  var riprendiLaVoce = BI.riprendiLaVoce;
  var uiText = BI.uiText;
  var fillTemplate = BI.fillTemplate;
  var speakerLabel = BI.speakerLabel;
  var dialogueLineAlign = BI.dialogueLineAlign;
  var renderChoiceBox = BI.renderChoiceBox;
  var startTimerBar = BI.startTimerBar;
  var freezeTimerBar = BI.freezeTimerBar;
  var renderIntroContent = BI.renderIntroContent;
  var introDismissPref = BI.introDismissPref;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var openHelpFor = BI.openHelpFor;
  var applyOutcomeSubtitle = BI.applyOutcomeSubtitle;
  var moduleNameHtml = BI.moduleNameHtml;
  var moduleTypeLabel = BI.moduleTypeLabel;
  var openEpisodeMap = BI.openEpisodeMap;
  var completeModule = BI.completeModule;
  var leaveModule = BI.leaveModule;
  var stopAllModuleActivity = BI.stopAllModuleActivity;
  var showLoadError = BI.showLoadError;
  var showView = BI.showView;

  /* ============================================================
     MODULES: DIALOGO (Ascolta e Ripeti / Ripeti a Tempo / Dialogo
     Continuo)
     ONE shared component for all three "Dialogo Completo" steps, all
     three registered on the map — module.dialogoProfile picks the
     CONFIG.dialogo.profiles entry that drives everything that differs:
       - The header itself (badge + Mappa/Spiegazione/Help) is the same
         for all three profiles, same as every other module — Spiegazione
         hides on the summary screen alone (CLAUDE.md rule 10), Help
         always stays (dgShowScreen).
       - translations / pauseResume: which single control (if any)
         dgSetupToolbar puts in the toolbar — the translations toggle,
         Pausa/Riprendi, or nothing.
       - countdown: whether dgPlayLine follows a line's audio with a
         per-line countdown bar INSIDE the bubble (dgStartLineTimer) —
         off for Ascolta e Ripeti, on for the other two. Duration is
         computed per line, not fixed (dgLineDurationMs).
       - advance: 'free' (tap any line, nothing else happens) | 'manual'
         (bar ends -> UI unlocks -> the next line is suggested, then
         pulses if untouched — dgSuggestNext) | 'auto' (bar ends -> the
         next line's dgPlayLine is called automatically, chaining to the
         end — dgLineTimerFinished).
       - readyCountdown: Dialogo Continuo only — a 3-2-1 (dgRunReady
         Countdown) before the chain starts on its own.
       - finalBoxQuestion: the Box Doppia Scelta's question text.
     Every profile funnels through the SAME dgPlayLine (audio, via
     toggleSpeak) -> dgStartLineTimer (if countdown) -> dgLineTimerFinished
     cycle; only what happens at each end differs, per dgProfile — no
     logic is duplicated between the three.
     Reads the same "dialogue" section of the episode's data file Speak
     Easy already reads (loadEpisodeData's cache, no extra request) —
     dialogueLineAlign()/speakerLabel() are the exact same functions
     Story Cards uses, tokenize() is Voice Coach's own word counter
     (CLAUDE.md rule 13). "L'hai imparato?"/etc. is always a single
     self-assessment for the WHOLE dialogue (verde/giallo module
     outcome), never per-word — no mastery entries are touched here.
     ============================================================ */
  var dgModule = null;
  var dgProfile = null;
  var dgDialogue = [];
  var dgHeardIds = []; // line ids heard at least once this viewing
  var dgLastOutcome = null; // l'autovalutazione dichiarata, in attesa del pulsante (vedi dgFinishModule)
  var dgFurthestIndex = -1; // Ripeti a Tempo only: highest dialogue index played this viewing — see dgApplySequenceLock
  var dgPaused = false;
  // Per-line countdown bar state (Ripeti a Tempo/Continuo only) — a
  // single active timer at a time, same pattern as Speed Match's own
  // srTimeoutId, but pause-aware (dgPauseLineTimer/dgResumeLineTimer)
  // since Dialogo Continuo can pause mid-bar and Speed Match never needs to.
  var dgLineTimerTimeoutId = null;
  var dgLineTimerFillEl = null;
  var dgLineTimerRemainingMs = 0;
  var dgLineTimerStartedAt = 0;
  var dgLineTimerOnDone = null;
  var dgLineTimerLine = null; // job 4 (3rd collaudo): the line the running timer belongs to, so dgSkipToNextLine can find what comes after it without a second lookup mechanism
  var dgSuggestTimeoutId = null; // Ripeti a Tempo only
  var dgReadyTimeoutId = null; // Dialogo Continuo's 3-2-1 only
  var dgActiveBubble = null; // job 2 (correction, 6th collaudo): which bubble's play cycle is CURRENTLY authoritative — see dgPlayLine's own comment

  function dgShowScreen(name) {
    document.getElementById('dg-start-screen').hidden = name !== 'start';
    document.getElementById('dg-ready-screen').hidden = name !== 'ready';
    document.getElementById('dg-main-screen').hidden = name !== 'main';
    document.getElementById('dg-summary-screen').hidden = name !== 'summary';
    // Spiegazione+Help show in every profile's header now, same as every
    // other module (Ripeti a Tempo/Dialogo Continuo used to hide both
    // entirely, leaving no way to reread the instructions mid-exercise —
    // Regola Azione Critica already dims+disables both during active
    // playback/countdown via dgLockAll, same as every other locked
    // control, so this is purely a visibility fix). Spiegazione still
    // hides on summary alone (CLAUDE.md rule 10) — Help stays, same
    // convention as every other module.
    document.getElementById('dialogo-watch-btn').hidden = name === 'summary';
    document.getElementById('dialogo-help-btn').hidden = false;
  }

  // Same dual-purpose start screen as Speed Match/Match Practice: full
  // howItWorks the first time, short "Pronto?" prompt after.
  function dgRenderStartScreen(module) {
    var dismissed = isIntroDismissed(module.kind, getUserName());
    document.getElementById('dg-start-checkbox-row').hidden = dismissed;
    document.getElementById('dg-start-body').hidden = dismissed;
    if (dismissed) {
      document.getElementById('dg-start-title').textContent = uiText('condivisi.readyTitle');
      document.getElementById('dg-start-btn').textContent = uiText('condivisi.readyStart');
    } else {
      document.getElementById('dg-start-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'dg-start-title', 'dg-start-body', module.label, 'dg-start-btn', 'dg-start-dont-show-text');
    }
  }

  // The single toolbar control, per profile — never more than one.
  function dgSetupToolbar() {
    var toolbar = document.getElementById('dg-toolbar');
    if (dgProfile.translations) {
      toolbar.hidden = false;
      toolbar.innerHTML = '<button type="button" class="btn btn-secondary btn-sm" id="dg-translations-toggle">Mostra traduzioni</button>';
    } else if (dgProfile.pauseResume) {
      toolbar.hidden = false;
      // Job 2 (3rd collaudo): starts disabled for the same reason as
      // "Prossima frase" below — nothing to pause until a line's audio or
      // countdown has actually started (dgUpdateToolbarButtonState keeps
      // it in sync from there).
      toolbar.innerHTML = '<button type="button" class="btn btn-secondary btn-sm" id="dg-pause-btn" disabled>' + uiText('dialogoShared.pauseLabel') + '</button>';
    } else if (dgProfile.nextLineButton) {
      toolbar.hidden = false;
      // Job 8 (2nd collaudo): starts disabled — nothing to skip until a
      // line's countdown bar is actually running (dgUpdateToolbarButtonState
      // keeps it in sync from there, see dgStartLineTimer/dgLineTimerFire/
      // dgPauseLineTimer/dgResumeLineTimer).
      toolbar.innerHTML = '<button type="button" class="btn btn-secondary btn-sm" id="dg-next-line-btn" disabled>' + uiText('dialogoShared.nextLineLabel') + '</button>';
    } else {
      toolbar.hidden = true;
      toolbar.innerHTML = '';
    }
  }

  // Regola Azione Critica: while one bubble plays (audio or its
  // countdown bar), every other control — Spiegazione, Help, the
  // translations toggle, every other bubble, the final choice box —
  // dims and stops responding; the active bubble itself lifts (see
  // .dg-bubble.is-active). Mappa stays clickable throughout — Pausa/
  // Riprendi lives outside this sweep in #dg-toolbar too, but (job 2,
  // 3rd collaudo) is separately disabled while audio is actually
  // speaking via dgUpdateToolbarButtonState, since pausing mid-utterance
  // used to hang the whole dialogue. No pop-up ever covers the list,
  // and nothing here is the microphone:
  // this module never records. Recomputes every bubble's state from
  // scratch each call (rather than only touching the previously-active
  // one) so a chained dgPlayLine -> dgPlayLine (Dialogo Continuo) can't
  // leave a stale is-active on the bubble it just moved on from.
  // Correction (5th collaudo): the Regola Azione Critica lockdown only
  // ever belongs to profiles with a per-line countdown (Ripeti a Tempo,
  // Continuo) — interrupting THOSE desyncs the countdown from the audio.
  // Ascolta e Ripeti has no countdown, nothing to desync, and its own
  // instructions promise free tapping in any order — dgProfile.countdown
  // (the same flag dgPlayLine already reads to decide whether to start
  // one) gates the whole disabling sweep here too. is-active keeps
  // applying regardless of profile — it's the visual lift, not a lock.
  function dgLockAll(locked, activeBubble) {
    var disable = locked && dgProfile.countdown;
    document.getElementById('dialogo-watch-btn').disabled = disable;
    document.getElementById('dialogo-help-btn').disabled = disable;
    var translationsToggle = document.getElementById('dg-translations-toggle');
    if (translationsToggle) translationsToggle.disabled = disable;
    document.querySelectorAll('#dg-list .dg-bubble').forEach(function (b) {
      b.classList.toggle('is-locked', disable && b !== activeBubble);
      b.classList.toggle('is-tap-locked', disable && b !== activeBubble);
      b.classList.toggle('is-active', locked && b === activeBubble);
    });
    // While a line is actively playing WITH a countdown behind it, the
    // choice box is always locked. Once idle (or in Ascolta e Ripeti,
    // always), it only unlocks once every line has been heard — see
    // dgUpdateChoiceBoxLock.
    if (disable) {
      document.querySelectorAll('#dg-choice-row button').forEach(function (b) { b.disabled = true; });
    } else {
      dgUpdateChoiceBoxLock();
    }
  }

  // "L'hai imparato?" only makes sense once the whole dialogue has been
  // heard — otherwise a fast tap could self-assess something never
  // actually listened to. Recomputed (not just set once) so it works
  // whether it's called right after dgMarkHeard or right after
  // renderChoiceBox regenerates fresh, not-yet-disabled buttons.
  function dgUpdateChoiceBoxLock() {
    var allHeard = dgDialogue.length > 0 && dgHeardIds.length >= dgDialogue.length;
    document.querySelectorAll('#dg-choice-row button').forEach(function (b) { b.disabled = !allHeard; });
    document.getElementById('dg-choice-hint').hidden = allHeard;
  }

  function dgMarkHeard(lineId) {
    if (dgHeardIds.indexOf(lineId) === -1) dgHeardIds.push(lineId);
    var check = document.getElementById('dg-heard-' + lineId);
    if (check) { check.classList.add('is-heard'); check.innerHTML = icon('check'); }
    // Job: the choice box unlocks at END OF TIMER, not end of audio — its
    // own recompute (dgUpdateChoiceBoxLock) is dgLockAll's job alone
    // (called once the UI actually unlocks: right after audio for
    // Ascolta e Ripeti, which has no countdown; only after the per-line
    // bar finishes for Ripeti a Tempo/Continuo). Calling it here too used
    // to unlock the box the instant the LAST line's audio ended, while
    // its own countdown bar was still running — a caution left over from
    // when leaving the module didn't stop audio; showView() does that
    // centrally now, so it's no longer needed.
  }

  function dgRenderList() {
    document.getElementById('dg-list').innerHTML = dgDialogue.map(function (line) {
      var align = dialogueLineAlign(line);
      var isFamiglia = align === 'right';
      var english = fillTemplate(line.english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en');
      var heard = dgHeardIds.indexOf(line.id) !== -1;
      var translationHtml = dgProfile.translations
        ? '<p class="dg-translation" hidden>' + fillTemplate(line.italian, BI.episodioCorrente(), BI.valoriCorrenti(), 'it') + '</p>'
        : '';
      return '<div class="dg-row ' + align + '">' +
        '<div class="dg-item">' +
        '<div class="dg-name-row">' +
        '<span class="dg-name">' + speakerLabel(BI.episodioCorrente(), line.speaker) + '</span>' +
        '<span class="dg-heard-check' + (heard ? ' is-heard' : '') + '" id="dg-heard-' + line.id + '">' + (heard ? icon('check') : '') + '</span>' +
        '</div>' +
        '<button type="button" class="dg-bubble ' + (isFamiglia ? 'dg-bubble-us' : 'dg-bubble-them') + '" data-line-id="' + line.id + '">' +
        '<span class="dg-bubble-top"><span class="dg-listen-icon">' + icon('volume-2') + '</span><p class="dg-english">' + english + '</p></span>' +
        translationHtml +
        '<div class="dg-line-timer">' +
        '<div class="sr-timerbar-track"><div class="sr-timerbar-fill"></div></div>' +
        '<p class="dg-line-timer-caption">Ripeti ad alta voce</p>' +
        '</div>' +
        '</button>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  // Ripeti a Tempo only (advance: 'manual') — the other two profiles
  // never call this, so every bubble stays plain for them: Ascolta e
  // Ripeti is deliberately free/any-order, and Dialogo Continuo already
  // disables bubble clicks entirely (auto-advance, see the #dg-list
  // listener). A bubble is reachable up to one past the furthest line
  // actually played this viewing — every earlier one stays replayable,
  // nothing beyond the next one is jumpable.
  function dgApplySequenceLock() {
    var bubbles = document.querySelectorAll('#dg-list .dg-bubble');
    if (dgProfile.advance !== 'manual') {
      bubbles.forEach(function (b) { b.classList.remove('is-ahead-locked'); b.classList.remove('is-tap-locked'); });
      return;
    }
    bubbles.forEach(function (b, i) {
      b.classList.toggle('is-ahead-locked', i > dgFurthestIndex + 1);
      b.classList.toggle('is-tap-locked', i > dgFurthestIndex + 1);
    });
  }

  // Formula from CONFIG.dialogo: pausaBase + numeroParole * pausaPerParola,
  // capped at pausaMassima — numeroParole counted from the line's own
  // English text via tokenize() (Voice Coach's own word counter, CLAUDE.md
  // rule 13).
  function dgLineDurationMs(englishText) {
    var wordCount = tokenize(englishText).length;
    var ms = CONFIG.dialogo.pausaBase + wordCount * CONFIG.dialogo.pausaPerParola;
    return Math.min(ms, CONFIG.dialogo.pausaMassima);
  }

  function dgNextDialogueLine(afterLine) {
    var idx = dgDialogue.findIndex(function (l) { return l.id === afterLine.id; });
    return idx > -1 && idx < dgDialogue.length - 1 ? dgDialogue[idx + 1] : null;
  }

  function dgClearSuggestion() {
    if (dgSuggestTimeoutId) { clearTimeout(dgSuggestTimeoutId); dgSuggestTimeoutId = null; }
    document.querySelectorAll('#dg-list .dg-bubble').forEach(function (b) {
      b.classList.remove('is-suggested', 'is-pulsing');
    });
  }

  // Ripeti a Tempo ('manual' advance) only: highlights the next line in
  // dialogue order as a suggestion, then — only if the user hasn't
  // started anything new within dialogo.pulsareDopoInattivita — lets it
  // pulse (soft dissolve, .dg-bubble.is-pulsing). Never forces an
  // advance; the suggestion just waits indefinitely.
  function dgSuggestNext(afterLine) {
    var next = dgNextDialogueLine(afterLine);
    if (!next) return;
    var bubble = document.querySelector('.dg-bubble[data-line-id="' + next.id + '"]');
    if (!bubble) return;
    bubble.classList.add('is-suggested');
    dgSuggestTimeoutId = setTimeout(function () {
      dgSuggestTimeoutId = null;
      bubble.classList.add('is-pulsing');
    }, CONFIG.dialogo.pulsareDopoInattivita);
  }

  // Starts (or, via dgResumeLineTimer, resumes) the per-line countdown
  // bar inside a bubble, using the shared startTimerBar/freezeTimerBar
  // (see srStartTimer, in app/speedmatch.js dal 2026-09-19) — remaining
  // time is tracked in ms so
  // Dialogo Continuo's Pausa can freeze and later resume it exactly
  // where it left off, unlike Speed Match's simpler one-shot timer.
  // Job 8 (2nd collaudo) + job 2 (3rd collaudo): keeps whichever toolbar
  // button this profile actually has (dg-next-line-btn for Ripeti a
  // Tempo, dg-pause-btn for Continuo — dgSetupToolbar never renders
  // both) in sync with what's actually happening, instead of a button
  // that's clickable but does nothing:
  //   - "Prossima frase" only makes sense while a line's countdown bar
  //     is actually counting down — outside that window there's nothing
  //     to close early.
  //   - "Pausa" pausing mid-AUDIO used to hang the whole dialogue
  //     (synth.pause() is unreliable mid-utterance) — disabled while
  //     audio is speaking (no countdown yet, not already paused), same
  //     as "Prossima frase"'s own rule. "Riprendi" stays enabled while
  //     genuinely paused (dgLineTimerTimeoutId is also null then, via
  //     dgPauseLineTimer) — dgPaused is what tells the two apart.
  // Called at every point dgLineTimerTimeoutId changes (start/fire/
  // pause/resume) instead of just guarding the click (dgSkipToNextLine's
  // own no-op check stays, belt and braces), so a button visibly
  // reflects its state instead of silently doing nothing when tapped.
  function dgUpdateToolbarButtonState() {
    var isCountingDown = dgLineTimerTimeoutId !== null;
    var nextBtn = document.getElementById('dg-next-line-btn');
    if (nextBtn) nextBtn.disabled = !isCountingDown;
    var pauseBtn = document.getElementById('dg-pause-btn');
    if (pauseBtn) pauseBtn.disabled = !isCountingDown && !dgPaused;
  }

  function dgStartLineTimer(bubble, line) {
    var fillEl = bubble.querySelector('.sr-timerbar-fill');
    var ms = dgLineDurationMs(fillTemplate(line.english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en'));
    bubble.classList.add('dg-bubble-timer');
    if (CONFIG.dialogo.suonoCountdownInizio) sfxPlayCountdownSound();
    dgLineTimerFillEl = fillEl;
    dgLineTimerRemainingMs = ms;
    dgLineTimerLine = line;
    dgLineTimerOnDone = function () { dgLineTimerFinished(bubble, line); };
    startTimerBar(fillEl, ms);
    dgLineTimerStartedAt = Date.now();
    dgLineTimerTimeoutId = setTimeout(dgLineTimerFire, ms);
    dgUpdateToolbarButtonState();
  }

  function dgLineTimerFire() {
    dgLineTimerTimeoutId = null;
    dgUpdateToolbarButtonState();
    var onDone = dgLineTimerOnDone;
    dgLineTimerOnDone = null;
    if (onDone) onDone();
  }

  // "Prossima frase" (Ripeti a Tempo only, dg-next-line-btn): ends the
  // current line's countdown bar early for whoever's already done
  // repeating, by firing the exact same completion path a natural
  // timeout would — no separate branch to keep in sync with
  // dgLineTimerFinished. A no-op if no bar is actually counting down
  // (during audio playback, or once idle) since there is nothing to skip.
  // Job 4 (3rd collaudo): unlike a natural timeout (which only unlocks
  // and suggests the next line, leaving it to the user to tap), this
  // button is meant to actually advance — so right after the shared
  // completion path runs, it also plays the next line itself, the exact
  // same call (dgPlayLine) the #dg-list tap handler makes, as if the
  // user had tapped the newly-suggested bubble themselves.
  // Vero mentre un profilo Dialogo con countdown sta parlando: lì l'audio
  // non va interrotto da un tocco qualunque, perché il countdown parte
  // dalla sua fine (CLAUDE.md regola 16). Guarda la vista attiva e non solo
  // dgProfile, che resta impostato anche dopo essere usciti dal modulo.
  function dgAudioProtected() {
    var view = document.getElementById('view-dialogo');
    return !!(dgProfile && dgProfile.countdown && view && view.classList.contains('is-active'));
  }
  // ⚠️ L'UNICO NOME CHE QUESTO FILE ESPONE, ed e' l'eccezione alla regola 16.
  // Il listener globale in cattura che spegne la voce vive in `index.html` e
  // deve poter chiedere «questo audio e' protetto?». La funzione e' uscita col
  // modulo perche' la risposta la sa solo il Dialogo: dipende dal PROFILO
  // (countdown si/no) e dalla vista attiva.
  //
  // *Chi legge il listener in `index.html` e non trova la funzione li' deve
  // trovare questa riga.* E il chiamante e' guardato — `BI.dgAudioProtected &&
  // …` — perche' la risposta giusta, se questo file non fosse caricato, e'
  // «nessuna protezione»: senza Dialogo aperto non c'e' nessun countdown da
  // sfasare. **Non e' prudenza: e' la risposta corretta scritta come tale.**
  BI.dgAudioProtected = dgAudioProtected;

  function dgSkipToNextLine() {
    if (dgLineTimerTimeoutId === null) return;
    clearTimeout(dgLineTimerTimeoutId);
    addNextLineSkip(BI.episodioCorrente().id, getUserName(), dgModule.id);
    var finishedLine = dgLineTimerLine;
    dgLineTimerFire();
    // Nel profilo 'auto' (Dialogo Continuo) è dgLineTimerFinished a
    // incatenare la battuta successiva: farlo anche qui la suonerebbe due
    // volte. 'manual' (Ripeti a Tempo) invece si limita a sbloccare e
    // suggerire, quindi l'avanzamento lo fa questa funzione.
    if (dgProfile.advance === 'auto') return;
    var next = finishedLine && dgNextDialogueLine(finishedLine);
    if (next) dgPlayLine(next);
  }

  // Countdown tone once the bar ends (never a tick during it — that time
  // is for the user to speak out loud), then branches purely on
  // dgProfile.advance: 'auto' chains straight into the next line
  // (Dialogo Continuo, until there's no next line left); 'manual'
  // unlocks and suggests the next one (Ripeti a Tempo).
  function dgLineTimerFinished(bubble, line) {
    bubble.classList.remove('dg-bubble-timer');
    sfxPlayCountdownSound();
    if (dgProfile.advance === 'auto') {
      var next = dgNextDialogueLine(line);
      if (next) {
        dgPlayLine(next);
      } else {
        dgLockAll(false, bubble);
      }
    } else {
      dgLockAll(false, bubble);
      if (dgProfile.advance === 'manual') dgSuggestNext(line);
    }
  }

  function dgPauseLineTimer() {
    if (dgLineTimerTimeoutId === null || !dgLineTimerFillEl) return;
    var elapsed = Date.now() - dgLineTimerStartedAt;
    dgLineTimerRemainingMs = Math.max(0, dgLineTimerRemainingMs - elapsed);
    clearTimeout(dgLineTimerTimeoutId);
    dgLineTimerTimeoutId = null;
    dgUpdateToolbarButtonState();
    freezeTimerBar(dgLineTimerFillEl);
  }

  function dgResumeLineTimer() {
    if (!dgLineTimerFillEl || dgLineTimerRemainingMs <= 0 || !dgLineTimerOnDone) return;
    startTimerBar(dgLineTimerFillEl, dgLineTimerRemainingMs);
    dgLineTimerStartedAt = Date.now();
    dgLineTimerTimeoutId = setTimeout(dgLineTimerFire, dgLineTimerRemainingMs);
    dgUpdateToolbarButtonState();
  }

  // The one play cycle every profile shares (CLAUDE.md rule 13): lift
  // the bubble, play its audio, mark it heard, then either start the
  // per-line countdown bar (dgProfile.countdown) or move on immediately
  // (Ascolta e Ripeti has none). What happens after the bar is
  // dgLineTimerFinished's job, not this function's. dgLockAll's own
  // disabling sweep (correction, 5th collaudo) only actually locks
  // anything for the countdown profiles — Ascolta e Ripeti calls it too
  // (for the is-active lift) but it's a no-op beyond that, per the
  // module's own free-tapping promise. Job 2 (3rd collaudo): Pausa is
  // not exempt like Mappa on a countdown profile — audio playback
  // (synth.pause() mid-utterance) is unreliable and used to hang the
  // whole dialogue, so dgUpdateToolbarButtonState disables Pausa/
  // Prossima frase for the whole time audio is speaking there, same as
  // it already did for the countdown-only window.
  function dgPlayLine(line) {
    var bubble = document.querySelector('.dg-bubble[data-line-id="' + line.id + '"]');
    if (!bubble) return;
    dgClearSuggestion();
    var lineIndex = dgDialogue.findIndex(function (l) { return l.id === line.id; });
    if (lineIndex > dgFurthestIndex) {
      dgFurthestIndex = lineIndex;
      dgApplySequenceLock();
    }
    var english = fillTemplate(line.english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en');
    // Correction (5th collaudo): dgLockAll(true, bubble) used to run
    // BEFORE toggleSpeak, eagerly. That's fine when nothing else was
    // playing, but Ascolta e Ripeti now allows switching straight from
    // one line to another (no lock to stop it) — toggleSpeak's own
    // internal cancel() of the OLD utterance fires that line's onEnd,
    // and if the new bubble's is-active was already set by then, that
    // call would wipe it right back off. Moving it into onStart — which
    // toggleSpeak only calls AFTER its own cancel has resolved — puts
    // the ordering back the right way round for the common case, and
    // still doesn't fire at all on a same-bubble retap (toggleSpeak
    // returns before onStart when the tapped bubble was the one already
    // speaking, which is exactly the "tap to stop" case, not a restart).
    // Job 2 (correction, 6th collaudo): that fix alone wasn't quite
    // enough — a real speechSynthesis engine can fire cancel()'s own
    // onerror/onend ASYNCHRONOUSLY (unlike a same-tick mock), so the OLD
    // bubble's onEnd below can still land AFTER the NEW bubble's onStart
    // already ran, and dgLockAll(false, oldBubble) clears is-active
    // unconditionally — wiping the just-lifted new bubble a beat later
    // (no visible highlight, exactly what it looked like from the
    // outside). dgActiveBubble tracks whichever bubble's cycle is
    // current; a stale onEnd checks it before touching is-active at all,
    // the same "am I still the one that matters" pattern the audio epoch
    // already uses for a different staleness problem.
    toggleSpeak(english, bubble, undefined, {
      onStart: function () {
        dgActiveBubble = bubble;
        dgLockAll(true, bubble);
        dgUpdateToolbarButtonState();
      },
      onEnd: function () {
        dgMarkHeard(line.id);
        if (dgProfile.countdown) {
          dgStartLineTimer(bubble, line);
        } else if (dgActiveBubble === bubble) {
          dgLockAll(false, bubble);
        }
      }
    });
  }

  // level: 'verde' ("Sì, lo so") | 'giallo' ("Non ancora") — a single
  // self-assessment for the whole dialogue, not per-word: this module
  // never touches loadMastery/saveMastery. Traguardo plays only on verde.
  //
  // ⚠️ Qui si MOSTRA, non si scrive: suono, Schermata Finale e sottotitolo
  // restano attaccati all'autovalutazione — e' li' che lo studente dichiara,
  // ed e' li' che deve sentirsi rispondere. L'esito invece aspetta il
  // pulsante, come in ogni altro modulo: rispondere "Sì, lo so" e poi uscire
  // con "← Mappa" scriveva un colore che nessuno aveva confermato.
  function dgFinishModule(level) {
    if (level === 'verde') sfxPlayTraguardoSound();
    dgLastOutcome = {
      level: level,
      linesListened: dgHeardIds.length,
      linesTotal: dgDialogue.length
    };
    dgShowScreen('summary');
    applyOutcomeSubtitle('dg-summary-title-sub', 'dialogoCompleteMessages', level === 'verde' ? 'siLoSo' : 'nonAncora');
  }

  // Dialogo Continuo only. Pausa freezes BOTH the audio (synth.pause())
  // and the countdown bar (dgPauseLineTimer, remaining time tracked in
  // ms); Riprendi resumes both from exactly where they stopped. Lives
  // outside dgLockAll's sweep (it's in #dg-toolbar), but (job 2, 3rd
  // collaudo) is NOT clickable the whole time like Mappa — the button
  // itself is disabled while audio is actively speaking (see
  // dgUpdateToolbarButtonState), because synth.pause() mid-utterance is
  // unreliable and used to hang the whole dialogue. This early return is
  // belt-and-braces for that same window, same shape as
  // dgSkipToNextLine's own guard.
  function dgTogglePause() {
    if (!dgPaused && dgLineTimerTimeoutId === null) return;
    dgPaused = !dgPaused;
    var btn = document.getElementById('dg-pause-btn');
    if (btn) btn.textContent = dgPaused ? 'Riprendi' : 'Pausa';
    if (dgPaused) {
      pausaLaVoce();
      dgPauseLineTimer();
    } else {
      riprendiLaVoce();
      dgResumeLineTimer();
    }
  }

  // Dialogo Continuo only: the 3-2-1 before it starts playing on its
  // own, same shape as Speed Match's srRunCountdown (not the same
  // function — Speed Match always ends the same way, this one starts a
  // chain instead — CLAUDE.md rule 11 notes the resulting small
  // duplication rather than forcing a shared abstraction over it).
  function dgRunReadyCountdown() {
    dgShowScreen('ready');
    // Regola Azione Critica applies to this countdown too, not just the
    // per-line bar dgPlayLine already locks around — dgPlayLine(dgDialogue[0])
    // below keeps it locked the moment the countdown ends, so there's no
    // unlocked gap in between.
    dgLockAll(true);
    var n = CONFIG.dialogo.countdownPre;
    var el = document.getElementById('dg-ready-number');
    function tick() {
      if (n <= 0) {
        dgReadyTimeoutId = null;
        dgShowScreen('main');
        if (dgDialogue.length) dgPlayLine(dgDialogue[0]);
        return;
      }
      el.textContent = n;
      sfxPlayReadyCountdownSound(n === 1);
      n--;
      dgReadyTimeoutId = setTimeout(tick, CONFIG.dialogo.countdownStepMs);
    }
    tick();
  }

  // Cancels every pending Dialogo timer/animation and resets Pausa state
  // — called both when leaving the module (Mappa) and when (re)opening
  // it, so a stray callback from a previous viewing can never fire
  // against the freshly-rendered list.
  function dgClearAllTimers() {
    if (dgLineTimerTimeoutId) { clearTimeout(dgLineTimerTimeoutId); dgLineTimerTimeoutId = null; }
    dgLineTimerOnDone = null;
    dgLineTimerFillEl = null;
    if (dgSuggestTimeoutId) { clearTimeout(dgSuggestTimeoutId); dgSuggestTimeoutId = null; }
    if (dgReadyTimeoutId) { clearTimeout(dgReadyTimeoutId); dgReadyTimeoutId = null; }
    dgPaused = false;
  }
  // I tre Dialogue dichiarano la propria pulizia (passo 21-bis).
  BI.registraPulizia(dgClearAllTimers);

  function dgStartExercise() {
    dgHeardIds = [];
    dgFurthestIndex = -1;
    dgActiveBubble = null;
    dgClearAllTimers();
    dgRenderList();
    dgApplySequenceLock();
    dgSetupToolbar();
    renderChoiceBox('dg-choice-row', 'fc-choice-question', dgProfile.finalBoxQuestion,
      'dg-not-yet-btn', uiText('dialogoShared.choiceNotYet'),
      'dg-know-it-btn', uiText('dialogoShared.choiceKnown'));
    loadModuleInstructions().then(function (data) {
      var hint = data.dialogoShared && data.dialogoShared.choiceBoxHint;
      document.getElementById('dg-choice-hint').textContent = hint || '';
    }).catch(function () {});
    dgUpdateChoiceBoxLock();
    if (dgProfile.readyCountdown) {
      dgRunReadyCountdown();
    } else {
      dgShowScreen('main');
    }
  }

  function openDialogo(module) {
    // ⚠️ LA CHIAVE E' 'dialogo', NON `module.kind`, E QUESTO E' IL MODULO CHE
    // LO RENDE EVIDENTE.
    //
    // `openDialogo` serve TRE kind — dialogoAscoltaRipeti, dialogoRipetiATempo,
    // dialogoContinuo — ma il blocco di listener e' UNO. Con la chiave sul
    // kind, aprire i tre profili attaccherebbe TRE copie degli stessi otto
    // listener: il tocco su una bolla partirebbe tre volte, senza nessun
    // errore. La regola per esteso sta accanto a BI.unaVoltaSola in
    // app/spazio.js, e il blocco [E] di test_listener_una_volta.js la protegge
    // aprendo tutti i kind di ogni famiglia.
    //
    // ⚠️ E vale anche dove sembra non servire: `openSpeedMatch` ne serve due e
    // `openFlashcard` due descrittori con UN kind solo — li' la chiave sul kind
    // funzionerebbe per caso, ed e' la forma in cui una regola sbagliata
    // sopravvive.
    //
    // Sul PERCHE' stiano prima di `showView`: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, non c'e' niente di asincrono
    // in mezzo, ed e' una precauzione per il passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('dialogo', function () {
    document.getElementById('dg-start-btn').addEventListener('click', function () {
      if (!dgDialogue.length) return;
      if (!document.getElementById('dg-start-checkbox-row').hidden) {
        setIntroDismissed(dgModule.kind, getUserName(), document.getElementById('dg-start-dont-show-again').checked);
      }
      dgStartExercise();
    });

    document.getElementById('dialogo-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(dgModule, { dismissPref: introDismissPref(dgModule.kind) });
    });

    // dg-translations-toggle (Ascolta e Ripeti) / dg-pause-btn (Dialogo
    // Continuo) are generated per profile by dgSetupToolbar — at most one
    // exists at a time — so this listener is delegated on the
    // always-present #dg-toolbar wrapper instead of attached directly.
    document.getElementById('dg-toolbar').addEventListener('click', function (e) {
      if (e.target.id === 'dg-translations-toggle') {
        var btn = e.target;
        var next = !btn.classList.contains('btn-primary');
        document.querySelectorAll('#dg-list .dg-translation').forEach(function (el) { el.hidden = !next; });
        btn.textContent = next ? 'Nascondi traduzioni' : 'Mostra traduzioni';
        btn.classList.toggle('btn-primary', next);
        btn.classList.toggle('btn-secondary', !next);
      } else if (e.target.id === 'dg-pause-btn') {
        dgTogglePause();
      } else if (e.target.id === 'dg-next-line-btn') {
        dgSkipToNextLine();
      }
    });

    // Whole-bubble click target (not just the mini listen icon inside it —
    // a bigger touch target reads better here since "play audio" is the
    // interaction). Dialogo Continuo ('auto' advance) never accepts a
    // click here — it plays on its own via dgPlayLine's own chaining.
    document.getElementById('dg-list').addEventListener('click', function (e) {
      // Mentre la barra scorre, toccare la battuta vuol dire "ho finito di
      // ripetere": chiude il conto alla rovescia e passa alla successiva,
      // come il pulsante "Prossima frase" (che resta). L'area sensibile è
      // TUTTA la bolla, non solo la barra: centrare una striscia alta pochi
      // pixel è difficile col mouse e quasi impossibile col dito.
      // dgSkipToNextLine non fa nulla se nessuna barra sta scorrendo, quindi
      // questo non ruba il tocco agli altri usi della bolla.
      var timerBubble = e.target.closest('.dg-bubble.dg-bubble-timer');
      if (timerBubble && dgLineTimerTimeoutId !== null) {
        dgSkipToNextLine();
        return;
      }
      var bubble = e.target.closest('.dg-bubble');
      if (!bubble || bubble.classList.contains('is-locked') || bubble.classList.contains('is-ahead-locked')) return;
      // Job 1 (4th collaudo) + correction (5th collaudo): re-tapping the
      // ACTIVE bubble only needs blocking where a countdown is running
      // behind it (Ripeti a Tempo) — there, re-tapping called dgPlayLine
      // again on the SAME line while the ORIGINAL countdown timer kept
      // ticking in the background, so two lines ended up playing/counting
      // down at once. Ascolta e Ripeti has no countdown to desync, and its
      // own instructions promise free tapping in any order, including the
      // line currently playing — toggleSpeak's own toggle behavior (same
      // button while .speaking -> stop, not restart) already handles that
      // re-tap safely there.
      // Toccare la battuta che sta parlando salta l'audio e fa partire il
      // countdown: è il gesto che prima non faceva niente, mentre un tocco a
      // vuoto sullo schermo lo faceva. Invertito. Non si richiama dgPlayLine
      // (rifarebbe partire la stessa battuta desincronizzando il timer): si
      // ferma l'audio, e il countdown parte dalla sua fine come sempre.
      if (dgProfile.countdown && bubble.classList.contains('is-active')) {
        fermaLaVoce();
        return;
      }
      // La guardia sull'avanzamento sta DOPO il salto dell'audio, non prima.
      // Stava sopra, e Dialogo Continuo (advance: 'auto') usciva di qui prima
      // di poterlo raggiungere: toccare la battuta che parla non faceva
      // niente, mentre la regola 16 nomina ENTRAMBI i profili col countdown.
      // Il suo scopo — impedire l'avanzamento manuale dove si avanza da soli —
      // resta intatto: blocca dgPlayLine qui sotto, non il salto.
      if (dgProfile.advance === 'auto') return;
      var lineId = bubble.getAttribute('data-line-id');
      var line = dgDialogue.find(function (l) { return l.id === lineId; });
      if (!line) return;
      dgPlayLine(line);
    });

    // dg-not-yet-btn/dg-know-it-btn are regenerated on every dgStartExercise()
    // (their label comes from dgProfile.finalBoxQuestion), so this listener
    // is delegated on the always-present #dg-choice-row wrapper instead of
    // attached to the buttons directly.
    document.getElementById('dg-choice-row').addEventListener('click', function (e) {
      if (e.target.id === 'dg-not-yet-btn') dgFinishModule('giallo');
      else if (e.target.id === 'dg-know-it-btn') dgFinishModule('verde');
    });

    document.getElementById('dg-complete-btn').addEventListener('click', function () {
      // dgLastOutcome e' sempre pieno qui: alla Schermata Finale ci si arriva
      // solo da dgFinishModule. Il null e' la rete, non il caso normale.
      completeModule(dgModule, dgLastOutcome);
    });

    // Timers/synth are stopped centrally by showView()'s own
    // stopAllModuleActivity() (see near its definition) — not repeated here.
    document.getElementById('dialogo-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('dialogo-help-btn').addEventListener('click', function () {
      openHelpFor(dgModule);
    });
    });
    dgModule = module;
    dgProfile = CONFIG.dialogo.profiles[module.dialogoProfile];
    dgDialogue = [];
    dgHeardIds = [];
    dgLastOutcome = null;
    dgClearAllTimers();
    document.getElementById('dialogo-badge').innerHTML = moduleNameHtml(module.label);
    document.getElementById('dialogo-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('dg-list').innerHTML = '';
    dgRenderStartScreen(module);
    dgShowScreen('start');
    leaveModule('dialogo');
    loadEpisodeData(module).then(function (data) {
      if (dgModule !== module) return;
      dgDialogue = episodeGradeRequired(data, module.grade, module);
    }).catch(function () {
      if (dgModule !== module) return;
      showLoadError(function () { openDialogo(module); });
    });
  }
  // I tre profili di Dialogo: una funzione, tre kind.
  BI.registraModulo('dialogoAscoltaRipeti', openDialogo);
  BI.registraModulo('dialogoRipetiATempo', openDialogo);
  BI.registraModulo('dialogoContinuo', openDialogo);

  // ---- I LISTENER DEL DIALOGO NON STANNO PIU' QUI ----
  //
  // Sono entrati dentro `openDialogo` il 2026-09-16 (passo 21-quater ②),
  // dietro `BI.unaVoltaSola('dialogo', …)`. Chi non apre un Dialogo non
  // attacca i suoi listener — e dal passo 22, chi non lo carica nemmeno.
  //
  // Il commento resta al PASSATO: dice dove sono andati, non finge che ci
  // siano ancora. Chi cerca 'dg-start-btn' qui deve trovare questa riga.
})(window.BI);

