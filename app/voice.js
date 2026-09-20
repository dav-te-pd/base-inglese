// DIPENDE DA: dati.js [parsing], identita.js [parsing], mappa.js [parsing], orchestrazione.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL QUINTO MODULO, E IL PIÙ GRANDE: 912 righe, 471 di codice. Voice
// Practice e Voice Check sono un componente solo dietro due kind — `vcVariant`
// è l'unica cosa che si dirama.
//
// ⚠️ È L'UNICO MODULO CON UN APPARATO, e l'apparato ESCE CON LUI.
// `vcRecognition` nasce a tempo di PARSING, nel blocco `if (VCSpeechRecognition)`
// poco sotto, e lì prende `onresult`, `onend`, `onerror`. Sono assegnazioni di
// proprietà, non `addEventListener`: il censimento dei listener non le ha mai
// viste, e il 21-quater non le ha toccate. **Adesso girano quando questo file
// viene letto invece che quando veniva letto `index.html`** — che oggi è lo
// stesso momento, perché i diciannove tag si caricano tutti al boot.
//
// *Funziona perché `vcRecognition` è un SINGLETON: un solo oggetto, creato una
// volta. Chi un giorno caricasse questo file su richiesta deve sapere che qui
// non nasce solo del codice — nasce un oggetto che parla col microfono.*
//
// ⚠️ E PORTA VIA UNA PULIZIA, la seconda della serie dopo `srPulizia`:
// `vcResetRecording` si registra a tempo di parsing. Vale la riga di
// `docs/decisioni-stato.md`: il magazzino di `stopAllModuleActivity` ha il contenuto
// dei file caricati, non un contenuto fisso.
//
// ⚠️ UN SOLO NOME ALL'INSÙ VERSO index.html, ed è ANCORA UNO DEI QUATTRO:
// `recordPendingMastery` — lo stesso che chiedeva Flash Card. Gli altri due
// riferimenti allo stato di sessione (`currentEpisode`, `currentValues`) NON
// sono nomi nuovi: si chiedono con `BI.episodioCorrente()` e
// `BI.valoriCorrenti()`, gli accessori che `app/mappa.js` usa già. **Sono
// funzioni, non alias, ed è tutta la differenza**: un alias fotograferebbe il
// valore di adesso, una funzione legge quello di quando la chiami.
//
// ⚠️ NON SI ALIASANO: lo script inline di `index.html` è l'ULTIMO. Vietato da
// `[E]` di `tests/test_dipendenze_dichiarate.js`.
//
// IL TAG STA NELLA SECONDA FILA per gli alias e per l'apparato.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadFeedbackMessages = BI.loadFeedbackMessages;
  var getUserName = BI.getUserName;
  var icon = BI.icon;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var addAudioSecondsSent = BI.addAudioSecondsSent;
  var sfxPlayCorrectSound = BI.sfxPlayCorrectSound;
  var sfxPlayWrongSound = BI.sfxPlayWrongSound;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var shuffle = BI.shuffle;
  var tokenize = BI.tokenize;
  var alignWords = BI.alignWords;
  var classify = BI.classify;
  var percentageBucket = BI.percentageBucket;
  var starsForPercent = BI.starsForPercent;
  var uiText = BI.uiText;
  var uiTextWith = BI.uiTextWith;
  var pickRandom = BI.pickRandom;
  var fillTemplate = BI.fillTemplate;
  var renderStars = BI.renderStars;
  var renderListenBlock = BI.renderListenBlock;
  var speakListenBlock = BI.speakListenBlock;
  var renderIntroContent = BI.renderIntroContent;
  var introDismissPref = BI.introDismissPref;
  var lockModuleHeader = BI.lockModuleHeader;
  var barraAzioniFinale = BI.barraAzioniFinale;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var openHelpFor = BI.openHelpFor;
  var openAttemptPopup = BI.openAttemptPopup;
  var closeAttemptPopup = BI.closeAttemptPopup;
  var applyOutcomeSubtitle = BI.applyOutcomeSubtitle;
  var applyRetryIntroContent = BI.applyRetryIntroContent;
  var moduleRulesLevel = BI.moduleRulesLevel;
  var moduleNameHtml = BI.moduleNameHtml;
  var moduleTypeLabel = BI.moduleTypeLabel;
  var openEpisodeMap = BI.openEpisodeMap;
  var completeModule = BI.completeModule;
  var leaveModule = BI.leaveModule;
  var stopAllModuleActivity = BI.stopAllModuleActivity;
  var showLoadError = BI.showLoadError;
  var showView = BI.showView;


  /* ============================================================
     MODULE: VOICE COACH — ONE parametrized component behind two map
     modules, Voice Practice and Voice Check (job: "sdoppiare Voice
     Coach" — a quiz you can retry until you like the result isn't a
     quiz). vcVariant ('practice' | 'check', set in openVoiceCoach from
     module.voiceVariant) is the ONLY thing that branches:
       - practice: "Esercitati ancora" (own button, capped at
         CONFIG.voicePractice.maxAttemptsPerPhrase, visible counter) —
         no final ripasso pass; DOES color the map via ModuleRules, scored
         by the LATEST attempt on each phrase (LastAttemptRule, see
         vcEvaluate) since retrying means "I want to get better",
         not a frozen first try.
       - check: no retry button at all (one recording per phrase) but
         keeps the existing retry-QUEUE/Schermata Ripasso pass and
         ModuleRules map color scored by the FIRST attempt only
         (FirstAttemptRule, see vcEvaluate).
     ENTRAMBE alimentano i colori delle voci, ognuna nelle proprie
     (vcMasteryPrefix: 'voicepractice:' / 'voicecheck:'), e con la stessa
     regola con cui ognuna calcola le stelle — practice a ogni tentativo,
     check solo al primo. Voice Check ha scritto per la prima volta il
     2026-09-10: prima calcolava il dato per parola e lo buttava, ed era il
     modulo SENZA AIUTI, cioe' il segnale piu' pulito che l'app produca.
     Recording mechanics, mic-trouble detection, star rating and the
     shared safety-valve popup are identical either way — everything in
     this section not explicitly gated on vcVariant runs for both.
     Reads every line of the same "dialogue" section Story Cards already
     uses (loadEpisodeData reuses the cache — no extra request), one
     sentence at a time. Recording happens through this module's own
     SpeechRecognition instance; the recognized text is held (never
     evaluated) until the user explicitly presses "Invia" from the
     stopped state — there is no way to discard mid-recording, only to
     stop (silence/timeout/tap all stop the same way) and then confirm
     or cancel. Completion is manual only (CLAUDE.md rule 7), on the
     last sentence's "Ho finito" button.
     ============================================================ */
  var vcModule = null;
  var vcVariant = 'check'; // 'practice' | 'check' — set from module.voiceVariant in openVoiceCoach

  // Il prefisso delle voci di mastery, UNO PER VARIANTE, e sta in una funzione
  // invece che scritto a mano nei due punti che lo usano. Scriverlo due volte
  // E' il difetto: basterebbe togliere il gate sulla variante senza accorgersi
  // che il prefisso resta quello dell'altra, e Voice Check comincerebbe a
  // scrivere DENTRO le voci di Voice Practice — sulla stessa chiave, dove
  // nessun lettore potrebbe piu' sapere quale delle due l'ha prodotta.
  //
  // Le due varianti hanno regole diverse su QUALE tentativo conta (Last vs
  // First, vedi vcEvaluate): due regole sulla stessa chiave sono due risposte
  // diverse alla stessa domanda. Per questo le chiavi sono separate, e non per
  // ordine.
  function vcMasteryPrefix() {
    return vcVariant === 'practice' ? 'voicepractice:' : 'voicecheck:';
  }
  var vcLines = [];
  // Queue-based pass navigation (same shape as Match Practice's qmQueue/
  // qmRetryQueue/qmPassIndex/qmPassTotal, CLAUDE.md rule 13): the main
  // pass walks every line once; anything left with 0-1 stars at that
  // point comes back in a retry pass (Schermata Ripasso), repeating
  // until a pass has none — or a line hits CONFIG.retryQueue.maxAttempts
  // and is force-accepted (see vcEvaluate).
  var vcQueue = [];
  var vcRetryQueue = [];
  var vcPassIndex = 0;
  var vcPassTotal = 0;
  var vcInRetryPass = false; // job: "Ripasso" badge, see renderVoiceCoachSentence
  var vcRetryPassCount = 0; // job 4 (2nd collaudo): which retryIntro pool (first/last) to show
  var vcCurrentLineObj = null;
  var vcCurrentEvaluated = false; // has THIS viewing of the line been sent+evaluated yet
  var vcAttempts = {};
  var vcState = 'idle'; // idle | recording | pending | result
  var vcListening = false;
  var vcSuppressTransition = false;
  var vcLatestTranscript = '';
  // Set the instant ANY speech (even an interim, not-yet-final result) is
  // heard — distinct from vcLatestTranscript, which only ever holds FINAL
  // text and is what scoring reads. The silence-timeout below needs this
  // separate signal: with interimResults off, vcLatestTranscript would
  // stay empty for an entire long sentence (recognition only finalizes on
  // a pause), so checking it alone cut every recording at the timeout
  // regardless of whether the user was still actively speaking.
  var vcHeardAnySpeech = false;
  var vcTimeoutId = null; // hard cap on recording length (maxRecordingMsPerWord/MarginMs)
  var vcSilenceTimeoutId = null; // job 6b: shorter "no voice at all yet" timeout
  var vcSilenceCutoff = false; // set right before stopping for silence — read once in vcRecognition.onend
  var vcTimerInterval = null;
  var vcRecordStartedAt = 0;
  var vcLastRecordingMs = 0; // job 6c: actual length of the last completed recording, however it ended
  var vcEmptyRecognitionStreak = 0; // job 6: consecutive zero-word recognitions
  // True once the confirmed mic-problem level (job 6's confirmedAt) is
  // reached — blocks "Avanti" (see updateVcActionButtons/vcNextLine) so
  // the module can't be completed while the system itself has flagged
  // that the student never actually spoke. Clears the moment a recording
  // IS recognized again (vcEmptyRecognitionStreak resets), letting the
  // module resume normally — see vcUpdateMicNotice.
  var vcMicConfirmedProblem = false;
  var vcFirstAttemptPercents = []; // FirstAttemptRule modules: this session's per-line % correct, first attempt only — see vcFinishModule
  var vcLastAttemptPercentByLine = {}; // LastAttemptRule modules (Voice Practice): per-line %, overwritten on every attempt so only the LATEST survives — see vcFinishModule
  var vcLastAvgPct = 0; // vcFinishModule's own avgPct, held for the complete-btn handler's saveModuleOutcome call (ModuleRules)

  var VCSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var vcRecognition = null;

  if (VCSpeechRecognition) {
    vcRecognition = new VCSpeechRecognition();
    vcRecognition.lang = CONFIG.speech.recognitionLang;
    vcRecognition.continuous = true;
    // Job 6b fix: interim results are needed to know a word has been
    // heard WHILE the user is still talking — only isFinal results feed
    // vcLatestTranscript itself (unchanged scoring), see onresult below.
    vcRecognition.interimResults = true;
    vcRecognition.maxAlternatives = CONFIG.speech.maxAlternatives;

    // No onstart handler: entering "recording" (state, icon, timer, the
    // Regola Azione Critica lock) happens synchronously in the
    // vc-record-btn click handler instead, right when the user asks to
    // record — SpeechRecognition's own "started" event can fire late
    // enough (real, measurable delay) to make the lock feel unresponsive.

    vcRecognition.onresult = function (event) {
      var finalText = '';
      for (var i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += (finalText ? ' ' : '') + event.results[i][0].transcript;
        }
        // Interim or final, any non-empty transcript means real speech
        // was heard — that's all the silence-timeout needs to know.
        if (!vcHeardAnySpeech && event.results[i][0].transcript.trim()) vcHeardAnySpeech = true;
      }
      vcLatestTranscript = finalText.trim();
    };

    vcRecognition.onend = function () {
      vcListening = false;
      vcLastRecordingMs = Date.now() - vcRecordStartedAt;
      clearVcTimeout();
      stopVcTimer();
      // A reset (navigating away mid-recording) already forced 'idle' and
      // aborted the session; the abort's onend must not override that by
      // jumping to 'pending' once it eventually fires.
      if (vcSuppressTransition) {
        vcSuppressTransition = false;
        return;
      }
      // Job 6b: the silence timeout stopped this recording because no
      // voice was ever detected — discard it entirely (never offered for
      // Invia/Cancella, never sent) and show why, instead of the usual
      // confirm step.
      if (vcSilenceCutoff) {
        vcSilenceCutoff = false;
        vcLatestTranscript = '';
        setVcState('idle');
        // Una registrazione muta CONTA come registrazione senza parole.
        // Prima usciva di qui senza toccare niente: vcEmptyRecognitionStreak
        // si muoveva solo dentro vcEvaluate(), cioe' dopo un "Invia" — e una
        // registrazione muta viene scartata prima, quindi "Invia" non lo
        // vedeva mai. Risultato: il gesto piu' comune di chi ha il microfono
        // rotto — premi, non parli — era l'unico che all'avviso non
        // arrivava. Non erano due meccanismi in competizione: era uno che
        // non veniva mai innescato.
        vcEmptyRecognitionStreak += 1;
        vcUpdateMicNotice();
        var warn = document.getElementById('vc-silence-warning');
        warn.textContent = uiTextWith('voceShared.silenceWarning',
          { secondi: CONFIG.voiceCoach.silenceTimeoutSeconds });
        // Quando c'e' l'avviso a livelli, questa riga sparisce: dice la
        // stessa cosa con meno, e senza l'azione che l'avviso offre. Due
        // messaggi sovrapposti sullo stesso problema si annullano a vicenda.
        warn.hidden = !document.getElementById('vc-mic-notice').hidden;
        return;
      }
      setVcState('pending');
    };

    vcRecognition.onerror = function () {
      // onend always follows onerror per the Web Speech API lifecycle and
      // is where the real state transition happens — acting here too
      // would race it. Only clear timers here.
      vcListening = false;
      clearVcTimeout();
      stopVcTimer();
    };
  }

  function clearVcTimeout() {
    if (vcTimeoutId) { clearTimeout(vcTimeoutId); vcTimeoutId = null; }
    if (vcSilenceTimeoutId) { clearTimeout(vcSilenceTimeoutId); vcSilenceTimeoutId = null; }
  }

  function startVcTimer() {
    vcRecordStartedAt = Date.now();
    document.getElementById('vc-record-timer').textContent = '0s';
    vcTimerInterval = setInterval(function () {
      var secs = Math.floor((Date.now() - vcRecordStartedAt) / 1000);
      document.getElementById('vc-record-timer').textContent = secs + 's';
    }, 1000);
  }

  function stopVcTimer() {
    if (vcTimerInterval) { clearInterval(vcTimerInterval); vcTimerInterval = null; }
  }

  function vcCurrentLine() { return vcCurrentLineObj; }

  function vcTargetText() {
    return fillTemplate(vcCurrentLine().english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en');
  }

  function setVcState(state) {
    vcState = state;
    var btn = document.getElementById('vc-record-btn');
    var recording = state === 'recording';
    btn.hidden = state === 'pending' || state === 'result';
    btn.classList.toggle('is-recording', recording);
    var didascalia = uiText(recording ? 'voceShared.recordStop' : 'voceShared.recordStart');
    btn.setAttribute('aria-label', didascalia);
    document.getElementById('vc-record-icon').innerHTML = icon(recording ? 'square' : 'mic', 'icon-lg');
    document.getElementById('vc-record-caption').hidden = btn.hidden;
    document.getElementById('vc-record-caption').textContent = didascalia;
    document.getElementById('vc-record-timer').hidden = !recording;
    document.getElementById('vc-confirm-area').hidden = state !== 'pending';
    document.getElementById('vc-result').hidden = state !== 'result';
    // "Spiegazione" and "Help" gray out only while actually recording
    // — back as soon as it's stopped/confirmed/cancelled (any other state).
    // Same rule applies to the listen block (100/75/50%): otherwise it can
    // be tapped mid-recording and the model audio starts playing over the
    // user's own voice. This is called the instant recording is requested
    // (see the vc-record-btn click handler), not from the browser's own
    // async "recognition started" event, so the lock is instantaneous.
    // Regola Azione Critica, shared lock/unlock for "Spiegazione" + "Help"
    // (lockModuleHeader, see near toggleSpeak) — this is the RECORDING
    // direction specifically (the mic picking up the model's own voice
    // if it were tapped mid-recording), not the general audio-playback
    // rule, which is stop-on-touch everywhere outside a countdown
    // profile (correction, 5th collaudo) — this lock is the one
    // deliberate exception left, and only while actually recording.
    lockModuleHeader('voice-coach', recording);
    document.querySelectorAll('#vc-audio-controls button').forEach(function (b) { b.disabled = recording; });
  }

  function vcResetRecording() {
    clearVcTimeout();
    stopVcTimer();
    if (vcListening) {
      vcSuppressTransition = true;
      try { vcRecognition.abort(); } catch (e) {}
    }
    vcListening = false;
    vcLatestTranscript = '';
    vcHeardAnySpeech = false;
    vcSilenceCutoff = false;
    document.getElementById('vc-silence-warning').hidden = true;
    setVcState('idle');
  }
  // Voice Practice e Voice Check.
  BI.registraPulizia(vcResetRecording);

  // Job 6: progressive mic-trouble notice, driven purely by
  // vcEmptyRecognitionStreak (see vcEvaluate). Same .danger-panel-notice
  // panel at all three steps — text and the offered action escalate, the
  // look never does (CLAUDE.md: gradualità nel testo, non nel colore —
  // and NOT .danger-panel's own red, which already means "destructive").
  function vcUpdateMicNotice() {
    var t = CONFIG.voiceCoach.micIssue;
    var streak = vcEmptyRecognitionStreak;
    var panel = document.getElementById('vc-mic-notice');
    var level = streak >= t.confirmedAt ? 3 : streak >= t.restartSuggestionAt ? 2 : streak >= t.warningAt ? 1 : 0;
    // Confirmed problem (level 3): the system has concluded this isn't a
    // pronunciation issue, so "Avanti" — and the microphone itself, see
    // updateVcActionButtons — are blocked, and il modulo non si completa.
    // L'unica uscita e' "Torna alla mappa" qui sotto (o "← Mappa" in alto).
    // Prima questo commento diceva che il blocco si scioglieva anche se il
    // microfono ricominciava a funzionare: da qui non puo' accadere, perche'
    // non c'e' piu' niente da premere per riprovare. Era una promessa che il
    // codice non poteva mantenere, ed e' stata tolta invece di lasciarla
    // credere.
    vcMicConfirmedProblem = level === 3;
    updateVcActionButtons();
    if (level === 0) { panel.hidden = true; return; }
    panel.hidden = false;
    // I TRE LIVELLI stanno nel JSON, ma il BOTTONE di ciascuno resta qui: il
    // suo id e la sua classe sono comportamento (chi lo ascolta, che aspetto
    // ha), non testo. Dal file arriva solo l'etichetta — cosi' una traduzione
    // non puo' rompere il listener, che e' esattamente il rischio di mettere
    // markup intero dentro un file di contenuto.
    var chiave = 'voceShared.micNotice.level' + (level === 1 ? 1 : level === 2 ? 2 : 3);
    var title = uiText(chiave + '.title');
    var body = uiText(chiave + '.body');
    var etichettaAzione = uiText(chiave + '.actionLabel');
    var actionsHtml = '';
    if (level === 2) {
      actionsHtml = '<button type="button" class="btn btn-secondary" id="vc-mic-notice-restart">' + etichettaAzione + '</button>';
    } else if (level >= 3) {
      actionsHtml = '<button type="button" class="btn btn-primary" id="vc-mic-notice-map">' + etichettaAzione + '</button>';
    }
    document.getElementById('vc-mic-notice-title').textContent = title;
    document.getElementById('vc-mic-notice-body').innerHTML = '<p>' + body + '</p>';
    document.getElementById('vc-mic-notice-actions').innerHTML = actionsHtml;
  }

  // ---- `vc-mic-notice-actions` NON STA PIU' QUI ----
  //
  // E' entrato dentro `openVoiceCoach` il 2026-09-17 (passo 21-quater ⑧, l'ultimo),
  // dietro `BI.unaVoltaSola('voice', …)`, con gli altri tredici. Il commento resta
  // al PASSATO.
  //
  // Stava separato dagli altri perche' e' attaccato al contenitore che la
  // funzione qui sopra riempie, ed e' A DELEGA per quello: i suoi pulsanti
  // (`vc-mic-notice-restart`, `vc-mic-notice-map`) nascono e muoiono con
  // l'`innerHTML`. Per questo regge lo spostamento — il listener sta sul
  // contenitore, che non cambia mai identita'.

  var STAR_MESSAGE_KEYS = { 1: 'basso', 2: 'medio', 3: 'alto' };






  // Voice Practice's "TENTATIVO N DI M" always names the attempt the
  // student is ABOUT to make, not the one they just finished — set at
  // renderVoiceCoachSentence (N=1, before any recording) and again right
  // when "Riprova" is clicked (N=next), so it never lags a whole
  // recording cycle behind (job 3: the old off-by-one made the LAST
  // available attempt still read as if one more was left).
  function vcSetAttemptLabel(attemptNum) {
    document.getElementById('vc-attempt-label').textContent =
      'TENTATIVO ' + attemptNum + ' DI ' + CONFIG.voicePractice.maxAttemptsPerPhrase;
  }

  // Gates "Esercitati ancora"/"Riprova" (Voice Practice only — Voice
  // Check's whole .vc-retry-row is hidden, see openVoiceCoach) and
  // "Avanti" (attempted THIS viewing — closes the hole where repeated
  // "Avanti" taps could complete the module without ever recording, same
  // fix already applied to Flash Card's Indietro/Avanti).
  function updateVcActionButtons() {
    if (vcVariant === 'practice') {
      var attempts = vcAttempts[vcCurrentLine().id] || 0;
      document.getElementById('voice-coach-retry-btn').disabled =
        attempts === 0 || attempts >= CONFIG.voicePractice.maxAttemptsPerPhrase;
    }
    // vcMicConfirmedProblem (job 1): the confirmed mic-problem notice has
    // its own escape hatch ("Torna alla mappa") — Avanti stays blocked so
    // the module can't be completed while the system itself flagged that
    // nothing was ever actually heard.
    document.getElementById('vc-next-btn').disabled = !vcCurrentEvaluated || vcMicConfirmedProblem;
    // Stessa guardia, stesso posto: al livello confermato si spegne anche il
    // microfono. Il contatore e' gia' alla soglia, quindi ogni registrazione
    // in piu' non produce nemmeno un avviso nuovo — e' un gesto che non ha
    // piu' effetto, e lasciarlo attivo lo fa sembrare utile. Restano vive
    // due uscite e nessun modo di girare a vuoto: "Torna alla mappa" nel
    // pannello e "← Mappa" in alto.
    // Le due ragioni per cui il microfono e' spento stanno insieme, e devono:
    // questa funzione gira a ogni aggiornamento, e scrivere la sola
    // vcMicConfirmedProblem riaccenderebbe il pulsante su un browser senza
    // riconoscimento vocale — dove openVoiceCoach l'aveva spento apposta.
    document.getElementById('vc-record-btn').disabled = vcMicConfirmedProblem || !VCSpeechRecognition;
  }

  function renderVoiceCoachSentence() {
    vcResetRecording();
    closeAttemptPopup();
    vcCurrentEvaluated = false;
    var line = vcCurrentLine();
    document.getElementById('vc-counter').textContent = vcPassIndex + ' / ' + vcPassTotal;
    document.getElementById('vc-ripasso-badge').hidden = !vcInRetryPass;
    // Voice Practice: proactively announce attempt 1 before any recording
    // happens (see vcSetAttemptLabel). Voice Check has no such counter
    // (row hidden, updated fresh at evaluation time instead — vcEvaluate).
    if (vcVariant === 'practice') {
      vcSetAttemptLabel(1);
    } else {
      document.getElementById('vc-attempt-label').textContent = '';
    }
    document.getElementById('vc-cue').textContent = fillTemplate(line.italian, BI.episodioCorrente(), BI.valoriCorrenti(), 'it');
    document.getElementById('vc-target').textContent = vcTargetText();
    var pronToggle = document.getElementById('vc-pronunciation-toggle');
    var pronEl = document.getElementById('vc-pronunciation');
    pronToggle.hidden = !line.pronunciationTip;
    pronToggle.textContent = 'Mostra pronuncia';
    pronEl.textContent = line.pronunciationTip || '';
    pronEl.hidden = true;
    document.getElementById('vc-audio-controls').innerHTML = renderListenBlock({ say: line.id });
    document.getElementById('vc-feedback').innerHTML = '';
    document.getElementById('vc-transcript').innerHTML = '';
    document.getElementById('vc-stars').innerHTML = '';
    document.getElementById('vc-feedback-message').textContent = '';
    updateVcActionButtons();
  }

  // Queue-based "move to the next line" (mirrors qmNextQuestion, CLAUDE.md
  // rule 13): empty main queue with a non-empty retry queue starts a new
  // pass behind the Schermata Ripasso; empty with nothing to retry
  // finishes the module. Screen visibility during the sentence-by-
  // sentence flow is intentionally left alone here (see openVoiceCoach/
  // the retry-continue-btn handler) — only the retryIntro/summary
  // transitions are this function's own to make.
  function vcNextLine() {
    // Second guard beyond vc-next-btn's own disabled state — the
    // safety-valve popup's "Vai avanti" also calls vcNextLine directly
    // (see the vcEvaluate call site below), bypassing the button.
    if (vcMicConfirmedProblem) return;
    if (vcQueue.length === 0) {
      if (vcRetryQueue.length > 0) {
        vcQueue = shuffle(vcRetryQueue);
        vcRetryQueue = [];
        vcPassTotal = vcQueue.length;
        vcPassIndex = 0;
        vcInRetryPass = true;
        vcRetryPassCount++;
        vcShowScreen('retryIntro');
        applyRetryIntroContent('voice-coach-retry-intro-screen', vcRetryPassCount >= CONFIG.retryQueue.maxAttempts - 1);
        return;
      }
      vcFinishModule();
      return;
    }
    var lineId = vcQueue.shift();
    vcPassIndex++;
    vcCurrentLineObj = vcLines.find(function (l) { return l.id === lineId; });
    renderVoiceCoachSentence();
  }

  function vcFinishModule() {
    sfxPlayTraguardoSound();
    vcShowScreen('summary');
    // vcVariant sceglie quali numeri fanno la media (vedi il commento
    // LastAttemptRule/FirstAttemptRule in vcEvaluate): Voice Check legge
    // vcFirstAttemptPercents, congelato prima del ripasso; Voice Practice
    // legge invece l'ultimo punteggio per battuta — ed e' anche il
    // punteggio con cui ModuleRules colora il badge sulla mappa (vedi
    // voice-coach-complete-btn piu' sotto), non solo il tono del
    // messaggio di questa schermata.
    var vcScorePercents = vcVariant === 'practice'
      ? Object.keys(vcLastAttemptPercentByLine).map(function (id) { return vcLastAttemptPercentByLine[id]; })
      : vcFirstAttemptPercents;
    vcLastAvgPct = vcScorePercents.length
      ? Math.round(vcScorePercents.reduce(function (a, b) { return a + b; }, 0) / vcScorePercents.length)
      : 0;
    applyOutcomeSubtitle('voice-coach-summary-title-sub', 'moduleCompleteMessages', percentageBucket(vcLastAvgPct));
  }

  function vcShowScreen(name) {
    document.getElementById('voice-coach-intro-screen').hidden = name !== 'intro';
    document.getElementById('voice-coach-main-screen').hidden = name !== 'main';
    document.getElementById('voice-coach-retry-intro-screen').hidden = name !== 'retryIntro';
    document.getElementById('voice-coach-summary-screen').hidden = name !== 'summary';
    // Nothing to explain on the completion screen — hide Spiegazione
    // there (CLAUDE.md rule 10); Help stays available everywhere, same
    // as this module's header always has.
    barraAzioniFinale('voice-coach', name);
  }

  function openVoiceCoach(module) {
    // I listener di questo modulo, una volta sola. L'ULTIMO degli otto giri.
    //
    // ⚠️ LA CHIAVE E' 'voice', E QUI LA DIFFERENZA SI VEDE: questa `open` serve
    // DUE kind (`voicePractice`, `voiceCoach`), quindi con `module.kind` per
    // chiave il blocco girerebbe due volte, una per variante, e ogni listener
    // avrebbe due copie. E' lo stesso caso di Match, Dialogo, storyCards e
    // Speed Match — falsificabile, a differenza delle tre famiglie a kind
    // singolo. La regola per esteso sta accanto a `BI.unaVoltaSola` in
    // app/spazio.js.
    //
    // ⚠️ E L'APPARATO NON E' QUI DENTRO, di proposito: `vcRecognition` nasce a
    // tempo di parsing e i suoi `onresult`/`onend`/`onerror` restano li'. Il
    // perche', e cosa romperebbe chi volesse spostarli, sta nel segnaposto piu'
    // in alto, dove stavano questi tredici.
    //
    // Sul PERCHE' stiano prima del resto: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, ed e' una precauzione per il
    // passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('voice', function () {
    document.getElementById('vc-mic-notice-actions').addEventListener('click', function (e) {
      if (e.target.id === 'vc-mic-notice-restart') {
        openVoiceCoach(vcModule);
      } else if (e.target.id === 'vc-mic-notice-map') {
        openEpisodeMap();
      }
    });

    document.getElementById('vc-audio-controls').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-say]');
      if (!btn) return;
      // Correction (5th collaudo): no countdown here — Spiegazione, Help,
      // Avanti, Riprova and Record all stay clickable while the model
      // audio plays (job 1, 4th collaudo, over-applied the lock here).
      // Record keeps its own guard below (mic bleed), just as a
      // stop-on-touch instead of a block.
      speakListenBlock(btn, vcTargetText());
    });

    document.getElementById('vc-record-btn').addEventListener('click', function () {
      if (!vcRecognition) return;
      // Seconda guardia oltre al disabled del pulsante, come vcNextLine: i
      // punti da cui si puo' chiedere di registrare si moltiplicano nel tempo,
      // questo controllo resta uno (CLAUDE.md regola 20).
      if (vcMicConfirmedProblem) return;
      if (vcState === 'recording') {
        if (vcListening) vcRecognition.stop();
        return;
      }
      if (vcState !== 'idle') return;
      // Correction (5th collaudo): Record used to be disabled while the
      // model audio played (mic-bleed protection); the click-stops-audio
      // rule (see the document-level click listener near toggleSpeak)
      // already covers this — Record isn't a listen trigger, so pressing
      // it stops the model audio before this handler even runs.
      vcLatestTranscript = '';
      vcHeardAnySpeech = false;
      document.getElementById('vc-silence-warning').hidden = true;
      var wordCount = tokenize(vcTargetText()).length;
      var maxMs = wordCount * CONFIG.voiceCoach.maxRecordingMsPerWord + CONFIG.voiceCoach.maxRecordingMarginMs;
      try {
        vcRecognition.start();
      } catch (e) { return; }
      // Enter "recording" (state, icon, timer, the Regola Azione Critica
      // lock via setVcState) the instant the user asks to record, instead
      // of waiting for SpeechRecognition's own async "started" event.
      vcListening = true;
      setVcState('recording');
      startVcTimer();
      clearVcTimeout();
      vcTimeoutId = setTimeout(function () {
        if (vcListening) vcRecognition.stop();
      }, maxMs);
      // Job 6b: a SHORTER, separate timeout — if nothing at all has been
      // recognized yet by then, this is silence, not just a long sentence;
      // stop and discard rather than waiting for the full maxMs cap above.
      vcSilenceTimeoutId = setTimeout(function () {
        if (vcListening && !vcHeardAnySpeech) {
          vcSilenceCutoff = true;
          vcRecognition.stop();
        }
      }, CONFIG.voiceCoach.silenceTimeoutSeconds * 1000);
    });

    document.getElementById('vc-cancel-btn').addEventListener('click', function () {
      vcLatestTranscript = '';
      setVcState('idle');
    });

    document.getElementById('vc-send-btn').addEventListener('click', function () {
      // Job 6c: this click is the actual "sent for recognition" event — the
      // whole recording length, silence included, counts (see
      // addAudioSecondsSent's own comment); a discarded/cancelled recording
      // never reaches here, so it's never counted.
      addAudioSecondsSent(BI.episodioCorrente().id, getUserName(), vcModule.id, vcLastRecordingMs / 1000);
      vcEvaluate();
    });

    document.getElementById('voice-coach-retry-btn').addEventListener('click', function () {
      var nextAttempt = (vcAttempts[vcCurrentLine().id] || 0) + 1;
      vcSetAttemptLabel(nextAttempt);
      setVcState('idle');
    });

    document.getElementById('vc-pronunciation-toggle').addEventListener('click', function () {
      var pronEl = document.getElementById('vc-pronunciation');
      var reveal = pronEl.hidden;
      pronEl.hidden = !reveal;
      this.textContent = reveal ? 'Nascondi pronuncia' : 'Mostra pronuncia';
    });

    document.getElementById('vc-next-btn').addEventListener('click', vcNextLine);

    document.getElementById('voice-coach-retry-continue-btn').addEventListener('click', function () {
      vcShowScreen('main');
      vcNextLine();
    });

    document.getElementById('voice-coach-complete-btn').addEventListener('click', function () {
      // Both variants now color the map (CONFIG.moduleOutcomeRules —
      // 'moduleRules' for voiceCoach AND voicePractice): the badge shows
      // vcLastAvgPct, verdict included even when it's rosso —
      // saveModuleOutcome always overwrites, so a redo genuinely replaces
      // the previous color in either direction, same as every other module
      // already using this store (see MODULE OUTCOME above). Which pct
      // that is (first-pass vs. latest-attempt) is vcVariant's own call
      // (see vcEvaluate), already baked into vcLastAvgPct by
      // vcFinishModule.
      completeModule(vcModule, CONFIG.moduleOutcomeRules[vcModule.moduleId] === 'moduleRules'
        ? { level: moduleRulesLevel(vcLastAvgPct), pct: vcLastAvgPct }
        : null);
    });

    document.getElementById('voice-coach-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('voice-coach-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(vcModule, { dismissPref: introDismissPref(vcModule.kind) });
    });

    document.getElementById('voice-coach-intro-start-btn').addEventListener('click', function () {
      setIntroDismissed(vcModule.kind, getUserName(), document.getElementById('voice-coach-intro-dont-show-again').checked);
      vcShowScreen('main');
    });

    document.getElementById('voice-coach-help-btn').addEventListener('click', function () {
      openHelpFor(vcModule);
    });
    });

    vcModule = module;
    vcVariant = module.voiceVariant === 'practice' ? 'practice' : 'check';
    vcAttempts = {};
    vcEmptyRecognitionStreak = 0;
    vcMicConfirmedProblem = false;
    vcFirstAttemptPercents = [];
    vcLastAttemptPercentByLine = {};
    vcSilenceCutoff = false;
    vcLastRecordingMs = 0;
    document.getElementById('vc-mic-notice').hidden = true;
    document.getElementById('vc-silence-warning').hidden = true;
    vcQueue = [];
    vcRetryQueue = [];
    vcPassIndex = 0;
    vcPassTotal = 0;
    vcCurrentLineObj = null;
    document.getElementById('vc-result').hidden = true;
    document.getElementById('vc-warning').style.display = VCSpeechRecognition ? 'none' : 'block';
    document.getElementById('vc-record-btn').disabled = !VCSpeechRecognition;
    document.getElementById('vc-cue').textContent = '';
    document.getElementById('vc-target').textContent = uiText('condivisi.caricamento');
    document.getElementById('vc-audio-controls').innerHTML = '';
    // Badge/title/retry-button text are the only visible traces of which
    // of the two variants this is — everything else in this view is one
    // shared component (see the "MODULE: VOICE COACH" comment).
    document.getElementById('voice-coach-badge').innerHTML = moduleNameHtml(module.label);
    document.getElementById('voice-coach-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('voice-coach-title').innerHTML = moduleNameHtml(module.label);
    document.getElementById('vc-retry-row').hidden = vcVariant !== 'practice';
    document.getElementById('voice-coach-retry-btn').textContent =
      uiText(vcVariant === 'practice' ? 'voceShared.retryPractice' : 'voceShared.retryCheck');
    leaveModule('voiceCoach');
    if (isIntroDismissed(module.kind, getUserName())) {
      vcShowScreen('main');
    } else {
      document.getElementById('voice-coach-intro-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'voice-coach-intro-title', 'voice-coach-intro-body', vcModule.label, 'voice-coach-intro-start-btn', 'voice-coach-intro-dont-show-text');
      vcShowScreen('intro');
    }
    // ⚠️ QUI C'ERA UN PRECARICAMENTO TRAVESTITO DA DIPENDENZA, e va saputo
    // perche' e' costato tre difetti in due giorni. Questo Promise.all
    // aspettava anche `loadFeedbackMessages()`, il cui risultato NON veniva
    // mai letto: il modulo restava "in caricamento" finche' non arrivava un
    // file di TESTI che non gli serviva per aprirsi.
    //
    // Misurato il 2026-09-10: la finestra fra "il microfono e' acceso" e "la
    // battuta c'e'" durava 17 ms di mediana **tutti dovuti a quel file** —
    // l'episodio e' sempre in cache, perche' openModuleFromMap aspetta
    // ensureEpisodeSlotFields che l'ha gia' caricato. Su una rete lenta quei
    // millisecondi diventano secondi, e in quella finestra premere il
    // microfono faceva esplodere `vcTargetText()` su una battuta nulla.
    //
    // La prova che era una riga copiata e non una scelta: openStoryCards fa lo
    // stesso Promise.all con loadModuleInstructions() e results[1] LO USA
    // davvero (i testi del self-check). La' serve; qui no.
    //
    // ⚠️ E la conseguenza da tenere a mente, per chi legge fra sei mesi: quel
    // precaricamento SCALDAVA LA CACHE dei messaggi per tutti i moduli, senza
    // che nessuno lo avesse deciso. Adesso ogni lettore fa il proprio fetch
    // quando gli serve — sono cinque, tutti gia' asincroni e con il proprio
    // .catch (verificato uno per uno). **Quindi le attese dei test su quei
    // testi diventano piu' importanti, non meno**: chi le rimettesse a tempo
    // (tests/attese.js, attendiSottotitoloEsito) le vedrebbe cadere prima.
    loadEpisodeData(module).then(function (data) {
      if (vcModule !== module) return;
      vcLines = episodeGradeRequired(data, module.grade, module);
      vcQueue = vcLines.map(function (l) { return l.id; });
      vcPassTotal = vcQueue.length;
      vcInRetryPass = false;
      vcRetryPassCount = 0;
      vcNextLine();
    }).catch(function () {
      if (vcModule !== module) return;
      showLoadError(function () { openVoiceCoach(module); });
    });
  }
  // Voice Practice e Voice Check.
  BI.registraModulo('voicePractice', openVoiceCoach);
  BI.registraModulo('voiceCoach', openVoiceCoach);

  function vcEvaluate() {
    var line = vcCurrentLine();
    var targetWords = tokenize(vcTargetText());
    var recognizedWords = tokenize(vcLatestTranscript);
    // Mic-trouble streak (job 6): counts consecutive recordings with NO
    // recognized words at all — recognizedWords.length > 0 but wrong
    // (a genuine mispronunciation) always resets it, never counts as a
    // mic problem. See vcUpdateMicNotice for the 3 escalation steps.
    vcEmptyRecognitionStreak = recognizedWords.length === 0 ? vcEmptyRecognitionStreak + 1 : 0;
    vcUpdateMicNotice();
    var pairs = alignWords(targetWords, recognizedWords);
    var correctCount = 0;
    var pairResults = []; // classify() result per pair, same order as pairs — reused below for Voice Practice's mastery feed instead of reclassifying
    var spans = pairs.map(function (pair) {
      var word = targetWords[pair.targetIndex];
      var recognizedWord = pair.recognizedIndex !== null ? recognizedWords[pair.recognizedIndex] : null;
      var cls = classify(word, recognizedWord);
      pairResults.push(cls);
      if (cls === 'correct') correctCount++;
      return '<span class="' + cls + '">' + word + '</span>';
    });
    document.getElementById('vc-feedback').innerHTML = spans.join(' ');
    document.getElementById('vc-transcript').innerHTML =
      '<strong>' + uiText('voceShared.transcriptPrefix') + '</strong> ' +
      (vcLatestTranscript || uiText('voceShared.transcriptEmpty'));

    var attemptNum = (vcAttempts[line.id] || 0) + 1;
    vcAttempts[line.id] = attemptNum;
    // Voice Practice's own label already shows this SAME attemptNum,
    // proactively set before this recording even started (see
    // vcSetAttemptLabel — renderVoiceCoachSentence for attempt 1, the
    // "Riprova" handler for every attempt after) — nothing to update here.
    // Voice Check has no such proactive counter (no retry button, see
    // updateVcActionButtons), so it's still set fresh at evaluation time.
    if (vcVariant !== 'practice') {
      var attemptsMax = CONFIG.retryQueue.attemptsReminderThreshold;
      document.getElementById('vc-attempt-label').textContent = 'TENTATIVO ' + attemptNum + ' DI ' + attemptsMax;
    }

    var pct = targetWords.length ? Math.round((correctCount / targetWords.length) * 100) : 0;
    var stars = starsForPercent(pct);
    document.getElementById('vc-stars').innerHTML = renderStars(stars);
    var passed = stars > 1;

    // LastAttemptRule / FirstAttemptRule — quale tentativo conta. La
    // distinzione e' vcVariant (da module.voiceVariant, nel descrittore):
    // non c'e' una tabella da consultare, perche' non c'e' una scelta da
    // fare per apparizione. Voice Practice vale SEMPRE l'ultimo
    // tentativo, Voice Check SEMPRE il primo:
    //   practice — LastAttemptRule: "Esercitati ancora" sovrascrive il
    //     punteggio della battuta a ogni tentativo, migliore o peggiore.
    //     Allenarsi vuol dire dove sei arrivato, non da dove partivi.
    //   check — FirstAttemptRule: congelato al primo passaggio, prima
    //     del ripasso — che ripete finche' non e' giusto e spingerebbe
    //     il punteggio verso il 100% (vedi vcFinishModule).
    // Gli altri moduli (Match Practice, Speed Match, Flash Card) non
    // hanno un ritentativo nello stesso passaggio: una risposta e'
    // definitiva appena data, una sbagliata torna solo nel ripasso.
    // Li' "quale tentativo" non e' una scelta, e' l'unico che esiste, ed
    // e' cablato nel loro contatore di primo tentativo
    // (qmFirstTryCorrectCount e simili).
    if (vcVariant === 'practice') {
      vcLastAttemptPercentByLine[line.id] = pct;
    } else if (attemptNum === 1) {
      vcFirstAttemptPercents.push(pct);
    }

    // I COLORI DELLE VOCI — le scrivono TUTTE E DUE le varianti, ognuna
    // nelle proprie (vcMasteryPrefix). L'unita' e' la parola dentro QUESTA
    // battuta: 'voicepractice:b-and-you:0' e' "and" dentro "and you?", che e'
    // un'abilita' diversa da "and" da sola nel grado A — accento e ritmo
    // cambiano. Piu' la riga del TARGET, la battuta intera, poco sotto.
    //
    // ⚠️ QUALE TENTATIVO SCRIVE, e sono due regole diverse:
    //
    //   practice — OGNI tentativo. La scala e' fatta per accumulare, e
    //     allenarsi e' accumulare: tre tentativi sono tre passaggi nella
    //     scala. ⚠️ Non e' la LastAttemptRule: quella vale per il BADGE
    //     della mappa (vcLastAttemptPercentByLine), che tiene solo l'ultimo.
    //     Il nome dice una cosa che qui non succede — registrato in
    //     docs/decisioni-stato.md fra i nomi che mentono.
    //   check — SOLO il primo (strada B). Le stelle di Voice Check gia' fanno
    //     cosi' (FirstAttemptRule): se i colori scrivessero a ogni tentativo,
    //     lo stesso modulo terrebbe due risposte diverse alla stessa domanda.
    //     Il ripasso resta e non segna niente — serve a farti sentire come si
    //     dice subito dopo aver sbagliato: e' insegnamento, non misura. Per
    //     imparare c'e' Voice Practice, e quello scrive.
    //
    // ⚠️ CONSEGUENZA DICHIARATA, e non si compensa: in Voice Check una
    // registrazione MUTA al primo tentativo lascia quella battuta SENZA
    // COLORE, perche' il secondo tentativo non e' piu' il primo. E' voluto —
    // una voce che manca e' assenza di dato (regola 39), e qui non abbiamo
    // sentito niente, quindi non c'e' niente da giudicare. Aspettare invece
    // "il primo tentativo SENTITO" seguirebbe un "primo" diverso da quello
    // delle stelle, che e' esattamente il difetto che le chiavi separate
    // esistono per evitare.
    //   (Il badge, in quel caso, segna 0% — cioe' "hai sbagliato tutto"
    //   mentre la verita' e' "non ti abbiamo sentito". E' un difetto suo,
    //   registrato in docs/decisioni-stato.md; non si corregge da qui.)
    // La condizione sul riconoscimento vuoto NON e' una soglia sul rumore: e'
    // la regola spostata da COME e' finita la registrazione a COSA ha
    // prodotto. Il ramo che scartava la registrazione muta (il timeout di
    // silenzio) si raggiunge solo in silenzio perfetto — basta un frammento
    // provvisorio qualunque, rumore di fondo o un colpo di tosse, perche'
    // vcHeardAnySpeech diventi vero e quel ramo non scatti piu'. In una
    // stanza vera era il caso raro, non quello normale.
    //
    // Cosi' invece chiude tutta la famiglia in una condizione sola, compresi
    // i casi che non abbiamo previsto: silenzio, rumore, errore di rete,
    // motore che molla. Se non abbiamo sentito niente, non c'e' niente da
    // giudicare — e il timeout di silenzio torna a fare solo il suo mestiere,
    // decidere QUANDO smettere di registrare, che e' comodita' e non dato.
    var scriveIColori = vcVariant === 'practice' || attemptNum === 1;
    if (scriveIColori && recognizedWords.length > 0) {
      pairs.forEach(function (pair, i) {
        BI.recordPendingMastery(vcMasteryPrefix() + line.id + ':' + pair.targetIndex, pairResults[i]);
      });
      // E il TARGET: la voce intera, con la media delle parole. Il criterio e'
      // "dove ci sono le stelle, quello e' il dato da registrare" — le stelle
      // SONO gia' la media delle parole (pct), quindi il dato c'era e finiva a
      // schermo e basta.
      //
      // La media dice quanto vale il target, le parole dicono DOVE si rompe:
      // se "nice to meet you" e' giallo perche' "nice" e' rosso, lo studente
      // deve poterlo vedere. Per questo le righe per parola restano tutte —
      // non e' una sostituzione, e' la riga che mancava sopra.
      //
      // La soglia non si inventa qui: percentageBucket legge
      // CONFIG.percentageThresholds, le stesse soglie con cui la percentuale
      // diventa un colore ovunque nell'app (regola 3 e regola 13).
      var esitoTarget = { alto: 'correct', medio: 'similar', basso: 'wrong' }[percentageBucket(pct)];
      BI.recordPendingMastery(vcMasteryPrefix() + line.id, esitoTarget);
    }

    // Richiamo (Voice Check only — Voice Practice has no final ripasso
    // pass, see the module comment): a 0-1 star result queues this line
    // for a retry pass at the end of the module (same shared
    // CONFIG.retryQueue.maxAttempts safety valve as Speed Match/Quick
    // Match/Flash Card — attemptNum already IS that counter here, no
    // separate one needed, CLAUDE.md rule 13). Membership always reflects
    // the LATEST evaluation of this viewing.
    if (vcVariant === 'check') {
      var queueIdx = vcRetryQueue.indexOf(line.id);
      if (stars <= 1 && attemptNum < CONFIG.retryQueue.maxAttempts) {
        if (queueIdx === -1) vcRetryQueue.push(line.id);
      } else if (queueIdx !== -1) {
        vcRetryQueue.splice(queueIdx, 1);
      }
    }

    var messageEl = document.getElementById('vc-feedback-message');
    messageEl.textContent = '';
    if (stars > 0) {
      loadFeedbackMessages().then(function (data) {
        var pool = data.voiceCoachMessages && data.voiceCoachMessages[STAR_MESSAGE_KEYS[stars]];
        if (pool && pool.length) messageEl.textContent = pickRandom(pool);
      }).catch(function () {});
    }

    // Event sound (job: sound catalog) — this evaluate IS the "risposta
    // corretta"/"risposta sbagliata" event, same pass/fail bar (stars > 1)
    // used above for the retry-queue and below for the popup — reused,
    // not a second threshold.
    if (passed) sfxPlayCorrectSound(); else sfxPlayWrongSound();

    vcCurrentEvaluated = true;
    updateVcActionButtons();
    setVcState('result');

    // Safety-valve popup — Voice Check only. Voice Practice's own visible
    // "TENTATIVO N DI maxAttemptsPerPhrase" counter (above) already tells
    // the same story continuously, so a popup on top would be redundant —
    // its cap just disables "Esercitati ancora" (see updateVcActionButtons)
    // and the student moves on with "Avanti".
    if (vcVariant === 'check' && attemptNum === CONFIG.retryQueue.attemptsReminderThreshold) {
      openAttemptPopup(passed, function () { setVcState('idle'); }, vcNextLine);
    }
  }

  // ---- I TREDICI LISTENER DEL CORPO DI VOICE NON STANNO PIU' QUI ----
  //
  // Sono entrati dentro `openVoiceCoach` il 2026-09-17 (passo 21-quater ⑧),
  // dietro `BI.unaVoltaSola('voice', …)`. Il commento resta al PASSATO.
  //
  // ⚠️ E QUELLO CHE **NON** E' ENTRATO, perche' e' la cosa che questa famiglia
  // ha e le altre sette no: `vcRecognition` — l'oggetto del riconoscimento
  // vocale — nasce a TEMPO DI PARSING, nel blocco `if (VCSpeechRecognition)`
  // qui sopra (righe ~7794-7873), e li' gli vengono assegnati `onresult`,
  // `onend` e `onerror`. **Sono assegnazioni di proprieta', non
  // `addEventListener`**, quindi il censimento non li ha mai visti e il
  // 21-quater non li tocca.
  //
  // Ne segue che dopo l'⑧ questo modulo ha **due tempi**: i quattordici
  // listener del DOM si attaccano alla prima apertura, i tre del riconoscimento
  // restano al parsing. Funziona perche' `vcRecognition` e' un singleton creato
  // una volta sola.
  //
  // ⚠️ CHI UN GIORNO VOLESSE «FINIRE IL LAVORO» spostando anche quel blocco
  // dentro `openVoiceCoach` deve sapere che **senza guardia ricreerebbe
  // l'oggetto a ogni apertura**, e la guardia che serve e' la stessa
  // (`BI.unaVoltaSola`). Non e' stato fatto qui perche' il 21-quater sposta
  // LISTENER, non apparati — e allargarlo di nascosto sarebbe stato il modo di
  // rompere l'unico modulo che usa il microfono.
  //
  // ⚠️ E LA VERIFICA FATTA PRIMA DI SPOSTARE, come al ⑦ e per la stessa
  // ragione — questa famiglia ha un apparato che le altre non hanno:
  //
  //   1. nessuno dei quattordici tocca `vcRecognition` o il sintetizzatore **a
  //      tempo di attacco**: lo toccano dentro il corpo del gestore, cioe' al
  //      click (misurato: zero assegnazioni `.onresult/.onend/.onerror` dentro
  //      le righe spostate);
  //   2. `openVoiceCoach` e' l'UNICO posto che mostra `view-voice-coach`
  //      (dal 2026-09-17 con `leaveModule('voiceCoach')`, vedi la separazione
  //      accanto a `showView`),
  //      quindi non esiste una strada che apra la schermata senza attaccarli;
  //   3. l'avviso microfono non puo' comparire prima: `vcUpdateMicNotice` e'
  //      chiamata solo da `vcRecognition.onend` e da `vcEvaluate`, e il
  //      riconoscimento parte solo da `vc-record-btn`, che e' uno dei
  //      quattordici.










  // Recording/timers/popup are stopped centrally by showView()'s own
  // stopAllModuleActivity() (see near its definition) — not repeated here.
})(window.BI);
