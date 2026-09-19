// DIPENDE DA: dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// IL SECONDO MODULO — Meet the Story e Why We Say It, e sono DUE passi della
// mappa in un file solo.
//
// ⚠️ PERCHE' UN FILE E NON DUE, ed e' una misura: delle diciassette funzioni,
// **zero** guardano il profilo. Le due voci del registro passano tutte per le
// stesse funzioni, che non sanno quale delle due le ha chiamate. Non e' un
// modulo con due modi: e' un modulo con due porte.
//
// ⚠️ ED E' STATO SCELTO SECONDO PER UN NUMERO: **undici variabili di stato
// chiuse dentro**, piu' di qualunque altro modulo. Se la forma «un file, uno
// stato suo» non scalasse, e' lui a dirlo — al secondo giro invece che
// all'ottavo.
//
// ⚠️ IL TAG STA NELLA SECONDA FILA, dopo ui-condivisa e mappa: gli alias in
// cima all'IIFE si prendono il valore a tempo di parsing.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;
  var storyCardsRecordExplanationAnswer = BI.storyCardsRecordExplanationAnswer;
  var icon = BI.icon;
  var applyOutcomeSubtitle = BI.applyOutcomeSubtitle;
  var completeModule = BI.completeModule;
  var episodeDataCache = BI.episodeDataCache;
  var episodeGrade = BI.episodeGrade;
  var episodeGradeRequired = BI.episodeGradeRequired;
  var fillTemplate = BI.fillTemplate;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var leaveModule = BI.leaveModule;
  var loadEpisodeData = BI.loadEpisodeData;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadModuleProgress = BI.loadModuleProgress;
  var loadStoryCardsDeclarations = BI.loadStoryCardsDeclarations;
  var moduleNameHtml = BI.moduleNameHtml;
  var moduleRulesLevel = BI.moduleRulesLevel;
  var moduleTypeLabel = BI.moduleTypeLabel;
  var openEpisodeMap = BI.openEpisodeMap;
  var openHelpFor = BI.openHelpFor;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var percentageBucket = BI.percentageBucket;
  var renderIntroContent = BI.renderIntroContent;
  var saveModuleOutcome = BI.saveModuleOutcome;
  var saveStoryCardsDeclarations = BI.saveStoryCardsDeclarations;
  var setIntroDismissed = BI.setIntroDismissed;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var showLoadError = BI.showLoadError;
  var currentStoryCardsModule = null;
  // Le skill dell'episodio, in ordine di dialogo — l'ordine della lezione.
  // Una battuta puo' averne piu' di una (whatYouLearn e' una lista), quindi
  // l'unita' qui NON e' la battuta ma la singola skill: il suo id e'
  // storyCardsSkillId(idBattuta, posizione), es. "d-1-s2".
  var storyCardsSkillIds = [];
  var storyCardsHasExplanations = false; // storyCardsSkillIds.length > 0 — distingue il modulo-lezione dal modulo-lettura
  var storyCardsSessionAnswers = {}; // skillId -> 'chiara'|'nonAncora'|'nonChiara' — set di lavoro, NON ancora salvato
  var storyCardsLastAvgPct = 0; // calcolato a "Ho finito", letto da story-cards-complete-btn per saveModuleOutcome
  var storyCardsReviewMode = false; // il modulo è già stato completato almeno una volta -> visita di ripasso
  var storyCardsTexts = null; // i testi del modulo da istruzioni-moduli.json (kicker della regola, riga "niente di nuovo", motivo del lucchetto)
  var storyCardsSelfCheck = null; // istruzioni-moduli.json's storyCards.selfCheck (domanda + le tre risposte)
  var storyCardsSelfCheckMessages = null; // istruzioni-moduli.json's whyWeSayIt.selfCheckMessages (le frasi di supporto dopo la risposta)
  var storyCardsFollowupUsed = {}; // risposta -> frasi già mostrate in questa apertura del modulo, per non ripeterle
  // Le risposte date in questo giro, NELL'ORDINE in cui sono state date, in
  // attesa del gesto che le salva. È una lista e non "l'ultima risposta"
  // apposta: storyCardsRecordExplanationAnswer conta anche i CAMBI di idea, e
  // riassumere il giro in un valore solo perderebbe proprio quel conteggio.
  // Il travaso non è un riassunto: è la stessa sequenza, scritta più tardi.
  var storyCardsPendingStats = [];

  BI.registraPulizia(storyCardsClearPendingStats);

  // Le dichiarazioni sopravvivono all'uscita SOLO se l'utente lo chiede:
  // "Esci e riprendi dopo" durante il primo giro, o il completamento. Uscire
  // da "← Mappa" non salva niente, come in ogni altro modulo — per questo
  // storyCardsSessionAnswers resta un set di lavoro in memoria e questo store viene
  // scritto in due punti soli, mai a ogni risposta.
  // Distinto da storyCardsExplanationStats (storyCardsRecordExplanationAnswer): quello è un
  // conteggio cumulativo per capire quali spiegazioni sono scritte male,
  // questo è "cosa ha dichiarato adesso questo utente su questa battuta".
  // L'id di una skill dentro la sua battuta. Serve un id proprio perche' la
  // stessa battuta puo' portarne due (d-1: "Hello e Hi" e "Nice to meet
  // you"): dichiararne una non deve valere per l'altra.
  function storyCardsSkillId(lineId, index) {
    return lineId + '-s' + (index + 1);
  }

  // La frase di supporto dopo una risposta. Ce ne sono venti per tipo
  // (istruzioni-moduli.json) e dentro lo stesso modulo non si ripetono: chi
  // dichiara "non mi è chiara" su tre card legge tre frasi diverse, invece
  // della stessa tre volte, che suonerebbe come un messaggio automatico.
  // Finite le venti, il giro riparte — con venti card servirebbe comunque un
  // ventunesimo testo, e ricominciare è meglio che restare senza.
  function storyCardsFollowupText(answer) {
    var entry = storyCardsSelfCheckMessages && storyCardsSelfCheckMessages[answer];
    var bodies = entry && entry.bodies;
    if (!bodies || !bodies.length) return '';
    var usate = storyCardsFollowupUsed[answer] || [];
    if (usate.length >= bodies.length) usate = [];
    var libere = bodies.filter(function (t) { return usate.indexOf(t) === -1; });
    var scelta = libere[Math.floor(Math.random() * libere.length)];
    storyCardsFollowupUsed[answer] = usate.concat([scelta]);
    return scelta;
  }

  // Quante delle spiegazioni presenti nell'episodio sono state dichiarate
  // in questo giro — la base sia del blocco del completamento sia del
  // punteggio SelfScoreRules.
  function storyCardsDeclaredCount() {
    return storyCardsSkillIds.filter(function (id) { return !!storyCardsSessionAnswers[id]; }).length;
  }

  function storyCardsAllDeclared() {
    return storyCardsSkillIds.length > 0 && storyCardsDeclaredCount() === storyCardsSkillIds.length;
  }

  // Job 10 (2nd collaudo): "Cosa imparo qui" — an OPTIONAL per-line field
  // (line.whatYouLearn, episode data, CLAUDE.md rule 4) explaining why a
  // phrase is built the way it is. Only rendered when a line actually has
  // one — the button doesn't appear otherwise (episode 1 has none yet,
  // see storyCardsHasExplanations). Reveal + self-check both live inside the
  // same hidden block, toggled together by "Cosa imparo qui" — the
  // self-check answer itself (data-story-cards-answer) never hides again once
  // given, so re-toggling the block open/closed doesn't lose it.
  function renderStoryCards(data) {
    // Il profilo (CONFIG.story.profiles) decide le due differenze fra Meet
    // the Story e Why We Say It: se la traduzione sta sempre in chiaro, e se
    // le skill si mostrano. Il resto del disegno è identico — è lo stesso
    // componente.
    var profile = (CONFIG.story.profiles[currentStoryCardsModule.storyProfile]) || {};
    var withSkills = profile.skills !== false;
    var skillIds = [];
    var itemsHtml = episodeGradeRequired(data, currentStoryCardsModule.grade, currentStoryCardsModule).map(function (line) {
      var align = BI.dialogueLineAlign(line);
      var english = fillTemplate(line.english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en');
      var italian = fillTemplate(line.italian, BI.episodioCorrente(), BI.valoriCorrenti(), 'it');
      // whatYouLearn è una LISTA di skill, ciascuna { title, body } (CLAUDE.md
      // regola 25). Una battuta lunga può introdurre due strutture diverse —
      // d-1 saluta E si presenta — e forzarle in una spiegazione sola
      // significherebbe spostare il contenuto per far quadrare la struttura.
      // Una skill senza corpo non è una skill: un titolo da solo non spiega.
      var skills = (line.whatYouLearn || []).filter(function (sk) { return sk && sk.body; });
      if (!withSkills) skills = [];
      var rulesHtml = skills.map(function (skill, i) {
        var skillId = storyCardsSkillId(line.id, i);
        skillIds.push(skillId);
        // I segnaposto nelle skill si sostituiscono come in ogni altro testo
        // dell'episodio; le citazioni inglesi chiedono la propria lingua
        // con :en (vedi fillTemplate).
        var skillTitle = fillTemplate(skill.title, BI.episodioCorrente(), BI.valoriCorrenti(), 'it');
        var skillBody = fillTemplate(skill.body, BI.episodioCorrente(), BI.valoriCorrenti(), 'it');
        var answersHtml = ((storyCardsSelfCheck && storyCardsSelfCheck.answers) || []).map(function (a) {
          // Tutti e tre uguali all'apertura: nessuno è preselezionato, e
          // nessuno è "la risposta giusta" — sono tre risposte oneste alla
          // stessa domanda.
          return '<button type="button" class="btn btn-secondary btn-sm" data-story-cards-answer="' + a.value +
            '" data-skill="' + skillId + '">' + a.button + '</button>';
        }).join('');
        return '<div class="story-cards-explanation" id="story-cards-explanation-' + skillId + '" data-skill-block="' + skillId + '">' +
          '<div class="wws-rule-top">' +
          '<span class="wws-rule-kicker">' + ((storyCardsTexts && storyCardsTexts.ruleKicker) || '') + '</span>' +
          '<span class="story-cards-declared" id="story-cards-declared-' + skillId + '" hidden></span>' +
          '</div>' +
          '<p class="story-cards-explanation-title">' + skillTitle + '</p>' +
          '<p class="story-cards-explanation-text" id="story-cards-body-' + skillId + '">' + skillBody + '</p>' +
          '<div class="story-cards-selfcheck" data-story-cards-skill="' + skillId + '">' +
          '<p class="story-cards-selfcheck-question">' + ((storyCardsSelfCheck && storyCardsSelfCheck.question) || '') + '</p>' +
          '<div class="story-cards-selfcheck-actions">' + answersHtml + '</div>' +
          '<p class="story-cards-selfcheck-followup" id="story-cards-followup-' + skillId + '" hidden></p>' +
          '</div>' +
          '</div>';
      }).join('');
      var noRuleHtml = (withSkills && !skills.length)
        ? '<p class="wws-no-rule">' + ((storyCardsTexts && storyCardsTexts.noRuleHint) || '') + '</p>'
        : '';
      return '<div class="wws-card" data-card="' + line.id + '">' +
        '<div class="wws-card-top">' +
        '<span class="chat-speaker">' + BI.speakerLabel(BI.episodioCorrente(), line.speaker) + '</span>' +
        '<span class="wws-state" id="wws-state-' + line.id + '" hidden></span>' +
        '</div>' +
        '<div class="wws-row ' + align + '">' +
        '<div class="wws-bubble">' +
        '<p class="wws-english">' + english + '</p>' +
        '<p class="wws-italian" id="chat-italian-' + line.id + '">' + italian + '</p>' +
        // Il Blocco Ascolto sta DENTRO la bolla, sotto la frase che fa
        // ascoltare: staccato sotto sembrava un elemento a sé.
        BI.renderListenBlock({ say: line.id, blocco: true }) +
        '</div>' +
        '</div>' +
        noRuleHtml +
        rulesHtml +
        '</div>';
    }).join('');
    document.getElementById('story-cards-body').innerHTML = '<div class="wws-list">' + itemsHtml + '</div>';
    storyCardsSkillIds = skillIds;
    storyCardsHasExplanations = skillIds.length > 0;
    storyCardsRefreshExplanationStates();
  }

  function storyCardsShowScreen(name) {
    document.getElementById('story-cards-intro-screen').hidden = name !== 'intro';
    document.getElementById('story-cards-main-screen').hidden = name !== 'main';
    document.getElementById('story-cards-summary-screen').hidden = name !== 'summary';
    // Nothing to explain on the completion screen — hide Spiegazione
    // there (CLAUDE.md rule 10, same as every other module's Schermata
    // Finale); Help stays available everywhere.
    document.getElementById('story-cards-watch-btn').hidden = name === 'summary';
  }

  function openStoryCards(module) {
    // I listener di questo modulo, una volta sola.
    //
    // ⚠️ LA CHIAVE E' 'storyCards', NON `module.kind`: `openStoryCards` serve
    // DUE kind (meetTheStory e whyWeSayIt) e il blocco e' uno. La regola per
    // esteso sta accanto a `BI.unaVoltaSola` in app/spazio.js; il blocco [E]
    // di test_listener_una_volta.js la protegge aprendo tutti i kind.
    //
    // Sul PERCHE' stiano prima di `showView`: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, non c'e' niente di asincrono
    // in mezzo, ed e' una precauzione per il passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('storyCards', function () {
    document.getElementById('story-cards-body').addEventListener('click', function (e) {
      // Sblocco Sequenziale, variante per dichiarazione: una card piu' avanti
      // della corrente non risponde a NIENTE — ne' al Blocco Ascolto (il
      // pulsante e le velocita'), ne' a un tocco qualunque. Prima .is-ahead
      // era solo opacita' e bordo tratteggiato: la card sembrava spenta e
      // l'audio partiva lo stesso, aggirando la sequenza che il meccanismo
      // esiste per imporre.
      // Stessa forma della variante per ascolto nel Dialogo (dgHandleBubbleTap,
      // cerca 'is-ahead-locked'): una guardia sola in cima al gestore, non un
      // controllo per pulsante — i pulsanti dentro una card si moltiplicano,
      // il gestore resta uno (CLAUDE.md regole 20 e 30).
      var cardAvanti = e.target.closest('.wws-card.is-ahead');
      if (cardAvanti) return;

      var listenBtn = e.target.closest('[data-say]');
      if (listenBtn) {
        var data = episodeDataCache[currentStoryCardsModule.dataFile];
        var line = data && episodeGrade(data, currentStoryCardsModule.grade).find(function (l) { return l.id === listenBtn.getAttribute('data-say'); });
        if (!line) return;
        // Correction (5th collaudo): see Repeat Aloud's own comment — no
        // countdown here either, free tapping is the intended behavior.
        BI.speakListenBlock(listenBtn, fillTemplate(line.english, BI.episodioCorrente(), BI.valoriCorrenti(), 'en'));
        return;
      }
      // Risposta al self-check. Alimenta due magazzini diversi, che rispondono
      // a due domande diverse:
      //   - storyCardsSessionAnswers, il set di lavoro, che alimenta la
      //     percentuale SelfScoreRules di QUESTO passaggio;
      //   - storyCardsPendingStats, la coda dei conteggi editoriali: "una
      //     spiegazione poco chiara a molti studenti è scritta male" è un
      //     segnale per chi scrive, non un punteggio per lo studente.
      // NESSUNO dei due viene salvato qui: si scrivono su "Esci e riprendi
      // dopo" o sul completamento, così uscire da "← Mappa" non lascia traccia.
      // Prima il secondo si scriveva a ogni risposta, e quella traccia la
      // lasciava.
      var answerBtn = e.target.closest('[data-story-cards-answer]');
      if (answerBtn) {
        if (answerBtn.disabled) return;
        var answer = answerBtn.getAttribute('data-story-cards-answer');
        var answerSkillId = answerBtn.getAttribute('data-skill');
        storyCardsSessionAnswers[answerSkillId] = answer;
        storyCardsPendingStats.push({ skillId: answerSkillId, answer: answer });
        var followupEl = document.getElementById('story-cards-followup-' + answerSkillId);
        var followupText = storyCardsFollowupText(answer);
        if (followupText) {
          followupEl.textContent = followupText;
          followupEl.removeAttribute('hidden');
        } else {
          followupEl.hidden = true;
        }
        // Ricalcolare basta: la card corrente è quella della prima skill non
        // ancora dichiarata, quindi si sposta da sé. Prima serviva anche
        // aprire e chiudere a mano le spiegazioni, che ora non si aprono più
        // — sono sempre lì, e a cambiare è cosa se ne legge.
        storyCardsRefreshExplanationStates();
      }
    });

    document.getElementById('story-cards-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('story-cards-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(currentStoryCardsModule, { dismissPref: BI.introDismissPref(currentStoryCardsModule.kind) });
    });

    document.getElementById('story-cards-intro-start-btn').addEventListener('click', function () {
      setIntroDismissed(currentStoryCardsModule.kind, getUserName(), document.getElementById('story-cards-intro-dont-show-again').checked);
      storyCardsShowScreen('main');
    });

    document.getElementById('story-cards-help-btn').addEventListener('click', function () {
      openHelpFor(currentStoryCardsModule);
    });

    document.getElementById('story-cards-complete').addEventListener('click', function () {
      // Il blocco vive qui e non solo sull'attributo disabled del pulsante
      // (CLAUDE.md regola 20): i punti da cui si può arrivare a completare un
      // modulo si moltiplicano, la funzione resta una.
      if (storyCardsHasExplanations && !storyCardsAllDeclared()) return;
      // Same reasoning as Repeat Aloud's own complete button above —
      // Traguardo fires here (declaring the study done), never on "← Mappa"
      // nor on the summary's own exit button below.
      sfxPlayTraguardoSound();
      storyCardsShowScreen('summary');
      // Completare È una conferma esplicita: le dichiarazioni diventano
      // definitive, e a un giro di ripasso successivo sovrascrivono quelle di
      // prima (stesso principio di saveModuleOutcome, che riscrive sempre).
      if (storyCardsHasExplanations) {
        saveStoryCardsDeclarations(BI.episodioCorrente().id, getUserName(), storyCardsSessionAnswers);
        storyCardsCommitPendingStats();
      }
      // SelfScoreRules: la percentuale è congelata QUI, su un giro in cui ogni
      // spiegazione è stata aperta e dichiarata — non ci sono più risposte
      // mancanti a spingerla verso lo zero. Un episodio senza spiegazioni non
      // ha niente da autovalutare e resta sul messaggio neutro di sempre.
      if (storyCardsHasExplanations) {
        var chiaraCount = storyCardsSkillIds.filter(function (id) { return storyCardsSessionAnswers[id] === 'chiara'; }).length;
        storyCardsLastAvgPct = Math.round((chiaraCount / storyCardsSkillIds.length) * 100);
        applyOutcomeSubtitle('story-cards-summary-title-sub', 'storyCardsCompleteMessages', percentageBucket(storyCardsLastAvgPct));
      } else {
        applyOutcomeSubtitle('story-cards-summary-title-sub', 'studioCompleteMessages', 'default');
      }
    });

    // "Esci e riprendi dopo": l'unico modo di conservare un primo giro a
    // metà. Salva le dichiarazioni fatte e torna alla mappa SENZA completare
    // il modulo — niente Traguardo, niente Schermata Finale, niente colore
    // sulla mappa: non è un esito, è un segnalibro.
    document.getElementById('story-cards-resume-later').addEventListener('click', function () {
      saveStoryCardsDeclarations(BI.episodioCorrente().id, getUserName(), storyCardsSessionAnswers);
      storyCardsCommitPendingStats();
      openEpisodeMap();
    });

    document.getElementById('story-cards-complete-btn').addEventListener('click', function () {
      // SelfScoreRules: same moduleRulesLevel() math as ModuleRules, but the
      // number behind it is the student's own declared "Sì, mi è chiara"
      // share — only saved when there was something to self-assess at all.
      var esito = (storyCardsHasExplanations && CONFIG.moduleOutcomeRules[currentStoryCardsModule.moduleId] === 'selfScoreRules')
        ? { level: moduleRulesLevel(storyCardsLastAvgPct), pct: storyCardsLastAvgPct }
        : null;
      completeModule(currentStoryCardsModule, esito);
    });
    });
    currentStoryCardsModule = module;
    document.getElementById('story-cards-title').innerHTML = moduleNameHtml(module.label);
    document.getElementById('story-cards-badge').textContent = module.label;
    document.getElementById('story-cards-subtitle').textContent = module.subtitle || '';
    document.getElementById('story-cards-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('story-cards-body').innerHTML = '<p class="module-status-text">Caricamento...</p>';
    storyCardsSkillIds = [];
    storyCardsHasExplanations = false;
    storyCardsLastAvgPct = 0;
    // Modulo già completato almeno una volta = visita di ripasso: niente
    // sequenza obbligata, niente "Esci e riprendi dopo", si riapre solo
    // quello che si vuole rivedere.
    storyCardsReviewMode = loadModuleProgress(BI.episodioCorrente().id, getUserName()).completed.indexOf(module.id) !== -1;
    // Riparte da dove si era arrivati: le dichiarazioni salvate (da un
    // "Esci e riprendi dopo", o dal completamento di un giro precedente)
    // sono il punto di partenza, non una lavagna pulita.
    storyCardsSessionAnswers = loadStoryCardsDeclarations(BI.episodioCorrente().id, getUserName());
    storyCardsFollowupUsed = {};
    leaveModule('storyCards');
    if (isIntroDismissed(module.kind, getUserName())) {
      storyCardsShowScreen('main');
    } else {
      document.getElementById('story-cards-intro-dont-show-again').checked = false;
      renderIntroContent(module.kind, 'story-cards-intro-title', 'story-cards-intro-body', currentStoryCardsModule.label, 'story-cards-intro-start-btn', 'story-cards-intro-dont-show-text');
      storyCardsShowScreen('intro');
    }
    // Le due fonti servono entrambe PRIMA di disegnare: i testi del
    // self-check (domanda, le tre risposte) vengono da istruzioni-moduli.json
    // come ogni altro testo, quindi renderStoryCards non può partire prima —
    // stessa forma già usata da openVoiceCoach.
    Promise.all([loadEpisodeData(module), loadModuleInstructions()]).then(function (results) {
      if (currentStoryCardsModule !== module) return;
      var instructions = results[1][module.kind] || {};
      storyCardsTexts = instructions;
      storyCardsSelfCheck = instructions.selfCheck || null;
      storyCardsSelfCheckMessages = instructions.selfCheckMessages || null;
      document.getElementById('story-cards-complete-hint').textContent = instructions.completeHint || '';
      renderStoryCards(results[0]);
    }).catch(function () {
      if (currentStoryCardsModule !== module) return;
      showLoadError(function () { openStoryCards(module); });
    });
  }

  BI.registraModulo('meetTheStory', openStoryCards);
  BI.registraModulo('whyWeSayIt', openStoryCards);  // Il travaso del secondo magazzino, gemello di commitPendingMastery.
  // Questo modulo ne ha DUE — le dichiarazioni (il set di lavoro) e i
  // conteggi editoriali — e fino al 2026-09-10 solo il primo rispettava il
  // gesto: i conteggi si scrivevano a ogni risposta, quindi uscire da
  // "← Mappa" lasciava comunque una traccia. Due magazzini dello stesso
  // modulo con due regole diverse; adesso la regola è una.
  function storyCardsCommitPendingStats() {
    storyCardsPendingStats.forEach(function (voce) {
      storyCardsRecordExplanationAnswer(BI.episodioCorrente().id, getUserName(), voce.skillId, voce.answer);
    });
    storyCardsPendingStats = [];
  }

  function storyCardsClearPendingStats() {
    storyCardsPendingStats = [];
  }

  // Primo giro: la lezione va avanti in ordine, quindi è apribile solo fino
  // alla prima spiegazione non ancora dichiarata. Al ripasso invece sono
  // tutte libere.
  function storyCardsFirstUndeclaredIndex() {
    for (var i = 0; i < storyCardsSkillIds.length; i++) {
      if (!storyCardsSessionAnswers[storyCardsSkillIds[i]]) return i;
    }
    return storyCardsSkillIds.length;
  }

  function storyCardsIsUnlocked(skillId) {
    if (storyCardsReviewMode) return true;
    var idx = storyCardsSkillIds.indexOf(skillId);
    return idx !== -1 && idx <= storyCardsFirstUndeclaredIndex();
  }

  // Ricalcola da zero lo stato di ogni card e di ogni regola: cosa è
  // raggiungibile, cosa mostra solo il titolo, quale risposta resta accesa,
  // e le due uscite del modulo. Ricalcolare invece di aggiornare solo il
  // pezzo che è cambiato è la stessa scelta di dgUpdateChoiceBoxLock: costa
  // nulla e non lascia stati vecchi in giro.
  //
  // Sblocco Sequenziale, variante per dichiarazione. L'altra variante — per
  // ascolto — è in Ripeti a Tempo (dgApplySequenceLock): condividono l'idea
  // ("più avanti non si va finché non hai fatto qui") e il nome, non il
  // resto. Lì un passo avanti è una bolla sbiadita e inerte; qui una card
  // resta leggibile, mostra il titolo della regola che aspetta e dice col
  // lucchetto perché non si tocca. Unirle in un componente solo avrebbe
  // prodotto due varianti senza markup né CSS in comune: si sarebbe
  // condiviso il nome della funzione e nient'altro.
  function storyCardsRefreshExplanationStates() {
    var lockedCards = {};
    storyCardsSkillIds.forEach(function (skillId) {
      var answer = storyCardsSessionAnswers[skillId];
      var unlocked = storyCardsIsUnlocked(skillId);
      var cardId = skillId.replace(/-s\d+$/, '');
      if (!unlocked) lockedCards[cardId] = true;

      // Una regola non ancora raggiunta mostra SOLO il titolo: il corpo
      // sparisce, i pulsanti anche. Il titolo resta perché far vedere cosa
      // aspetta invoglia ad andare avanti.
      var bodyEl = document.getElementById('story-cards-body-' + skillId);
      if (bodyEl) bodyEl.hidden = !unlocked;
      var ruleEl = document.getElementById('story-cards-explanation-' + skillId);
      if (ruleEl) ruleEl.classList.toggle('is-ahead', !unlocked);

      // La spunta dice "hai risposto", non "va bene": senza etichetta
      // accanto, che altrimenti leggeva "✓ NON CHIARA". Cosa si è risposto
      // lo dice già il pulsante acceso.
      var declaredEl = document.getElementById('story-cards-declared-' + skillId);
      if (declaredEl) {
        declaredEl.hidden = !answer;
        declaredEl.innerHTML = answer ? icon('check') : '';
      }

      var selfcheckEl = document.querySelector('.story-cards-selfcheck[data-story-cards-skill="' + skillId + '"]');
      if (selfcheckEl) {
        selfcheckEl.hidden = !unlocked;
        selfcheckEl.querySelectorAll('[data-story-cards-answer]').forEach(function (b) {
          // Si può cambiare idea sempre, anche durante il primo passaggio:
          // accorgersi a metà spiegazione di aver capito è normale, e la
          // dichiarazione serve a sapere cosa ripassare, non a incastrare.
          b.disabled = false;
          b.classList.toggle('is-chosen', b.getAttribute('data-story-cards-answer') === answer);
        });
      }
    });

    // Le card: bordo accento su quella corrente, attenuazione e lucchetto su
    // quelle più avanti. Una card senza regole non è mai bloccata e non
    // porta segno di stato — non c'è niente da dichiarare.
    var currentCard = storyCardsCurrentCardId();
    document.querySelectorAll('#story-cards-body .wws-card').forEach(function (card) {
      var cardId = card.getAttribute('data-card');
      var cardSkills = storyCardsSkillIds.filter(function (id) { return id.indexOf(cardId + '-s') === 0; });
      // Piu' avanti della corrente si decide dalla POSIZIONE, non dalle skill.
      // Prima si leggeva lockedCards, che si popola solo scorrendo le skill:
      // una card senza regole non ci entrava mai, quindi restava non marcata
      // pur essendo piu' avanti — sbiadita in modo sbagliato E con il Blocco
      // Ascolto attivo. La guardia sul gestore era giusta, sbagliava chi
      // assegnava la classe.
      // Il ripasso si esclude da solo: li' storyCardsCurrentCardIndex() vale Infinity,
      // e nessun indice e' maggiore di Infinity.
      var isAhead = storyCardsCardIndex(cardId) > storyCardsCurrentCardIndex();
      card.classList.toggle('is-current', cardId === currentCard);
      card.classList.toggle('is-ahead', isAhead);
      // .is-ahead dice come si VEDE una card bloccata, .is-tap-locked dice che
      // non risponde al dito — ed e' la stessa classe che usa il Dialogo, cosi'
      // "bloccato" si comporta uguale nelle due varianti dello Sblocco
      // Sequenziale (regola 30). L'aspetto invece resta diverso apposta: qui il
      // titolo della regola che aspetta deve restare leggibile.
      // Sta sulla CARD e non sulla singola regola: una regola non ancora
      // raggiunta dentro la card CORRENTE non deve spegnere il Blocco Ascolto
      // di quella card, che si ascolta eccome.
      card.classList.toggle('is-tap-locked', isAhead);
      var stateEl = document.getElementById('wws-state-' + cardId);
      if (!stateEl) return;
      // Una card senza regole non ha niente da dichiarare, ma scorrendo,
      // alcune card con la spunta e altre senza fanno chiedere se quelle
      // senza sono da fare. Prende la spunta da sola appena la sequenza la
      // supera — o subito, se non c'è più una sequenza (ripasso).
      var superata = cardSkills.length === 0 && storyCardsCardIndex(cardId) < storyCardsCurrentCardIndex();
      var tutteDichiarate = superata ||
        (cardSkills.length > 0 && cardSkills.every(function (id) { return !!storyCardsSessionAnswers[id]; }));
      stateEl.classList.toggle('is-done', tutteDichiarate);
      // Lo stesso stato, letto due volte: la spunta quando ci si ferma, il
      // fondo quando si scorre. Una card più avanti non è "fatta" nemmeno se
      // per caso non ha regole da dichiarare.
      card.classList.toggle('is-done', tutteDichiarate && !isAhead);
      if (tutteDichiarate) {
        stateEl.hidden = false;
        stateEl.innerHTML = icon('check');
      } else if (isAhead) {
        stateEl.hidden = false;
        stateEl.innerHTML = icon('lock') + '<span>' + ((storyCardsTexts && storyCardsTexts.lockedHint) || '') + '</span>';
      } else {
        stateEl.hidden = true;
        stateEl.innerHTML = '';
      }
    });

    var completeBtn = document.getElementById('story-cards-complete');
    var hintEl = document.getElementById('story-cards-complete-hint');
    var resumeBtn = document.getElementById('story-cards-resume-later');
    // Un episodio senza spiegazioni resta il modulo di sola lettura di
    // prima: nessun blocco, nessuna seconda uscita.
    var gated = storyCardsHasExplanations && !storyCardsAllDeclared();
    completeBtn.disabled = gated;
    hintEl.hidden = !gated;
    // "Esci e riprendi dopo" ha senso solo dove c'è qualcosa da riprendere:
    // un primo giro non ancora finito. Al ripasso il modulo è già completo,
    // e uscire senza confermare è esattamente ciò che fa "← Mappa".
    resumeBtn.hidden = !(storyCardsHasExplanations && !storyCardsReviewMode && !storyCardsAllDeclared());
  }

  // La card su cui si sta lavorando: quella che contiene la prima skill non
  // ancora dichiarata. Al ripasso non ce n'è una — sono tutte aperte.
  function storyCardsCurrentCardId() {
    if (storyCardsReviewMode) return null;
    var next = storyCardsSkillIds[storyCardsFirstUndeclaredIndex()];
    return next ? next.replace(/-s\d+$/, '') : null;
  }

  // La posizione di una card nella lista, e quella della card corrente:
  // servono a sapere se la sequenza ha già superato una card senza regole.
  // Senza card corrente (ripasso, o tutto dichiarato) sono tutte superate.
  function storyCardsCardIndex(cardId) {
    var cards = Array.prototype.map.call(
      document.querySelectorAll('#story-cards-body .wws-card'),
      function (c) { return c.getAttribute('data-card'); });
    return cards.indexOf(cardId);
  }
  function storyCardsCurrentCardIndex() {
    var current = storyCardsCurrentCardId();
    if (!current) return Infinity;
    return storyCardsCardIndex(current);
  }
})(window.BI);
