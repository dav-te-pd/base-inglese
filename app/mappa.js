// DIPENDE DA: apertura.js [chiamata], audio.js [parsing], avvio.js [parsing], catalogo.js [parsing], dati.js [parsing], identita.js [parsing], magazzino.js [chiamata], orchestrazione.js [parsing], progressi.js [parsing], sessione.js [chiamata], spazio.js [parsing], ui-condivisa.js [parsing]
// ⚠️ LO STRATO DELLA MAPPA E DEL PANNELLO ADMIN — l'ultimo pezzo del 22 che non
// e' un modulo.
//
// 43 pezzi: la mappa dell'episodio, la Schermata Finale (`completeModule`), il
// Pannello Admin per intero, `boot`, `goHome`, `leaveModule`,
// `stopAllModuleActivity` e la schermata d'errore di caricamento.
//
// ⚠️ NON CHIEDE PIU' NIENTE A index.html, dal 2026-09-19 (passo C2).
//
// Qui c'era scritto «CHIEDE A index.html TRE COSE SOLE», ed era il punto del
// passo che ha creato questo file: il CATALOGO (`EPISODES`,
// `MODULE_DESCRIPTORS`, `resolveEpisodeOrder`, `moduleStepId`,
// `applyEpisodeDialogue`) e i due dello STATO DI SESSIONE
// (`episodioCorrente()`, `masteryInSospeso()`). Nove funzioni qui dentro
// nominavano `currentEpisode`, ed era il motivo per cui questo strato non
// chiudeva: adesso lo CHIEDONO invece di possederlo.
//
// **Quel tre e' arrivato a zero, e i nomi sono gli stessi.** Il catalogo e'
// uscito in `app/catalogo.js` (C1), lo stato di sessione in
// `app/sessione.js` (B), `migrateCustomizeSeenToModuleProgress` e
// `applyEpisodeDialogue` in `app/apertura.js` (C2). *Non hanno cambiato
// chiamante: hanno cambiato chi risponde.*
//
// *Un numero che sale con una ragione scritta e' un progetto; senza, e' un
// difetto. Il numero e' sceso, ed e' sceso dove la ragione diceva che sarebbe
// sceso.*
//
// ⚠️ DUE CHIAMATE VANNO ANCORA IN AVANTI, e vanno a `app/apertura.js`, che e'
// caricato per ultimo: `BI.openModuleFromMap` (citata qui sotto, chiamata dal
// listener che vive li') e `BI.migrateCustomizeSeenToModuleProgress`, dentro
// `openEpisodeMap`. **Avanti non vuol dire all'insu':** entrambe girano quando
// l'utente tocca qualcosa, mai al parsing, quindi l'ordine dei tag non e' un
// vincolo — e lo strumento lo verifica invece di crederci
// (`apertura.js [chiamata]` nella riga DIPENDE DA, non `[parsing]`).
//
// Prima erano altre DUE. Una era `BI.closeAttemptPopup` (dentro `stopAllModuleActivity`),
// che stava nella regione di Voice: uno STRATO che chiedeva a un MODULO, il
// verso sbagliato. Il 2026-09-19 il popup dei tentativi e' passato in
// `app/ui-condivisa.js`, dove sta per mestiere e non per posizione, e quella
// riga adesso chiede a uno strato che questo file dichiara gia' fra le proprie
// dipendenze.
//
// ⚠️ IL TAG STA NELLA SECONDA FILA: `configPanelOverlayEl` e `configPanelBodyEl`
// prendono il loro nodo a tempo di parsing.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;
  var CONFIG_OVERRIDES_KEY = BI.CONFIG_OVERRIDES_KEY;
  var loadStoryCardsExplanationStats = BI.loadStoryCardsExplanationStats;
  var LOAD_ERROR_LAST_RESORT = BI.LOAD_ERROR_LAST_RESORT;
  var fermaLaVoce = BI.fermaLaVoce;
  var getUserName = BI.getUserName;
  var icon = BI.icon;
  var isIntroDismissed = BI.isIntroDismissed;
  var istruzioniInMemoria = BI.istruzioniInMemoria;
  var loadAudioUsage = BI.loadAudioUsage;
  var loadErrorInlineHtml = BI.loadErrorInlineHtml;
  var loadMastery = BI.loadMastery;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadModuleOutcomes = BI.loadModuleOutcomes;
  // ⚠️ I SEI NOMI DEL GUSCIO, arrivati col passo ② (2026-09-20). Vengono tutti
  // da `app/identita.js` e da `app/catalogo.js`, che stanno nella prima fila:
  // si possono aliasare qui in cima perche' sono gia' esistiti quando questo
  // file viene letto.
  var renderThemePicker = BI.renderThemePicker;
  var setTheme = BI.setTheme;
  var syncThemePicker = BI.syncThemePicker;
  var setUserName = BI.setUserName;
  var clearUserName = BI.clearUserName;
  var hydrateIcons = BI.hydrateIcons;
  var EPISODES = BI.EPISODES;
  var costruisciPassi = BI.costruisciPassi;
  var caricaStrutturaCorso = BI.caricaStrutturaCorso;
  // ⚠️ I TRE NOMI DEI CINQUE PULSANTI DELLA MAPPA, arrivati col passo ③.
  // Vengono da `ui-condivisa.js` e da `progressi.js`, tutti e due prima di
  // questo file: si aliasano in cima come gli altri. Senza, i pulsanti erano
  // agganciati e morivano al tocco — un altro guasto muto, visto guidandoli.
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var openHelpFor = BI.openHelpFor;
  var introDismissPref = BI.introDismissPref;
  var setIntroDismissed = BI.setIntroDismissed;
  var loadModuleProgress = BI.loadModuleProgress;
  var loadNextLineSkips = BI.loadNextLineSkips;
  var loadPersonalizationTables = BI.loadPersonalizationTables;
  var markModuleCompleted = BI.markModuleCompleted;
  var moduleNameHtml = BI.moduleNameHtml;
  var nuovaEpoca = BI.nuovaEpoca;
  var renderSpiegazioneTitle = BI.renderSpiegazioneTitle;
  var saveMastery = BI.saveMastery;
  var saveModuleOutcome = BI.saveModuleOutcome;
  var showView = BI.showView;
  var uiText = BI.uiText;
  var uiTextWith = BI.uiTextWith;
  var views = BI.views;
  var pulizie = BI.pulizie;
  var registraPulizia = BI.registraPulizia;
  // General rule (not a per-module patch): leaving any view — the map, a
  // module, going home — stops everything currently in flight for the
  // view being left: speech synthesis and every module's own pending
  // timers/sequences (Dialogo's line timer/suggestion/ready-countdown,
  // Voice Coach's recording+its timeout/timer, Speed Match's per-question
  // timer+its own 3-2-1, Flash Card's card-slide timeout). Called from
  // showView() itself — the one function every module-open/back-to-map/
  // go-home path already routes through — instead of each module
  // remembering to clean up its own "Mappa" button, which is how this bug
  // happened in the first place (Dialogo had it, other modules didn't).
  // Safe to call unconditionally: every one of these clear-functions is a
  // no-op when nothing is pending.
  function stopAllModuleActivity() {
    // ---- LE TRE CONDIVISE, NOMINATE — e non è una conversione lasciata a
    // metà. Non appartengono a nessun modulo: il sintetizzatore è uno per
    // tutta l'app, il popup dei tentativi è un pezzo solo, il magazzino della
    // mastery è condiviso fra i quiz. Non potranno MAI «non essere caricati»,
    // quindi registrarle vorrebbe dire inventare un registrante fittizio per
    // pulizie che ci sono sempre — una cerimonia, non un meccanismo.
    //
    // Delle dieci istruzioni di prima, sette erano di un modulo (cinque
    // famiglie) e tre no. Queste sono quelle tre.
    fermaLaVoce();
    BI.closeAttemptPopup();
    // Regola 21: anche i due magazzini in sospeso si azzerano QUI, non dentro
    // il "← Mappa" di un modulo. Lasciare un modulo senza premere "Ho finito"
    // butta via quello che si era accumulato — è precisamente la regola del
    // gesto, applicata nel punto unico che ogni uscita attraversa.
    //
    // L'ordine con completeModule non è un caso: il travaso avviene PRIMA di
    // openEpisodeMap(), che è ciò che porta qui. Chi salva ha già salvato
    // quando questa riga gira.
    clearPendingMastery();

    // ---- LE REGISTRATE (passo 21-bis). Questa funzione non nomina più
    // nessuna famiglia di moduli: chi si carica dichiara la propria pulizia
    // con BI.registraPulizia, e chi non è caricato non ha niente da pulire —
    // vero PER COSTRUZIONE invece che per attenzione di chi scrive.
    //
    // ⚠️ L'ORDINE DENTRO QUESTO CICLO NON CONTA, E LA PROTEZIONE NON STA QUI.
    //
    // Misurato il 2026-09-16 guidando Ripeti a Tempo con l'audio in corso:
    // zero timer sopravvivono all'uscita. Il sospetto era concreto — il
    // countdown del Dialogo parte dentro l'`onend` dell'audio, quindi
    // `synth.cancel()` prima di dgClearAllTimers() sembrava creare lavoro che
    // la riga dopo spegneva — ed era sbagliato: l'`onend` arriva in modo
    // ASINCRONO, cioè dopo tutta la pulizia, in qualunque ordine.
    //
    // A neutralizzarlo è `nuovaEpoca()`, che leaveModule fa PRIMA di chiamare
    // questa funzione: ogni callback tardivo confronta l'epoca con cui era
    // partito e si ritira. **Quella riga è la protezione, e deve restare dove
    // sta** — un array di registrazioni fa pensare che la difesa sia qui
    // dentro, e non ci sta.
    //
    // ⚠️ E IL try/catch NON RENDE IL GUASTO SILENZIOSO, perché è coperto
    // altrove. Prima, una pulizia che alzava un'eccezione non fermava le
    // altre: fermava la NAVIGAZIONE — l'eccezione risaliva a showView, che è
    // il punto unico di ogni spostamento, e lo studente restava chiuso dentro
    // il modulo (misurato). Adesso girano tutte e si esce sempre; il
    // fallimento va in console **e fa diventare rossa un'asserzione di
    // tests/test_pulizie_registrate.js**, che è la metà che rende accettabile
    // questo catch. Toglierla rimetterebbe in piedi proprio lo scambio che
    // questo progetto passa il tempo a evitare: un guasto rumoroso cambiato
    // con uno silenzioso.
    BI.pulizie.forEach(function (pulizia) {
      try {
        pulizia();
      } catch (e) {
        console.error('[pulizia] ' + (pulizia.name || 'anonima') + ' ha fallito:', e);
      }
    });
  }

  // Lascia il modulo attivo (se ce n'e' uno) e mostra un'altra vista.
  //
  // `nuovaEpoca()` sta qui e non in `showView` perche' e' meta' del
  // «lasciare»: neutralizza le chiamate asincrone tardive del modulo che si
  // abbandona — un `onend` del sintetizzatore che arriva dopo l'uscita trova
  // l'epoca cambiata e non scrive piu' su una schermata che non c'e'
  // (`toggleSpeak` lo legge come `epochAtStart`). Lasciarlo in `showView`
  // avrebbe voluto dire separare le due funzioni **tenendo dentro un pezzo di
  // quello che si stava separando**.
  function leaveModule(name) {
    nuovaEpoca();
    stopAllModuleActivity();
    showView(name);
  }

  var loadErrorRetry = null;

  function renderLoadErrorTexts(texts) {
    var t = texts || {};
    var r = LOAD_ERROR_LAST_RESORT;
    document.getElementById('load-error-title').textContent = t.title || r.title;
    document.getElementById('load-error-body').innerHTML = t.body || r.body;
    document.getElementById('load-error-retry').textContent = t.retryLabel || r.retryLabel;
    document.getElementById('load-error-back').textContent = t.backLabel || r.backLabel;
    var reset = document.getElementById('load-error-reset');
    if (reset) reset.textContent = t.resetLabel || r.resetLabel;
  }

  // riprova: la funzione da rilanciare — di solito la riapertura del modulo
  // che ha fallito — cosi' il pulsante rifa' esattamente quello che non e'
  // riuscito, invece di chiedere allo studente di ricaricare la pagina.
  // Senza, il pulsante non compare: meglio nessun pulsante di uno che non
  // si sa dove porta.
  function showLoadError(riprova) {
    loadErrorRetry = typeof riprova === 'function' ? riprova : null;
    document.getElementById('load-error-retry').hidden = !loadErrorRetry;
    // Nel caso normale i testi sono gia' in memoria (il modulo li ha
    // caricati aprendo), e si usano subito senza far lampeggiare la frase
    // di ultima istanza. Se non ci sono, la schermata si mostra COMUNQUE
    // adesso, con quella frase, e si aggiorna se i testi arrivano: farla
    // aspettare un fetch significherebbe rischiare che non arrivi mai —
    // che e' il difetto che questa schermata esiste per chiudere.
    // ⚠️ LA TERZA USCITA, DAL 2026-09-21: «Ripristina i valori di partenza».
    //
    // Compare **solo se ci sono override salvati**, perche' solo allora puo'
    // servire a qualcosa: un pulsante che non puo' aiutare e' peggio di un
    // pulsante che non c'e'.
    //
    // ⚠️ NASCE DA UN CASO VERO, non da una simmetria. Il 2026-09-21 chi guida
    // il progetto ha cambiato `edizione` dal Pannello Admin per una prova:
    // `struttura-corso.json` non e' piu' arrivato, l'app e' finita qui, e
    // «Riprova» rifaceva la stessa strada fallendo allo stesso modo. **Le due
    // uscite che c'erano portavano tutte e due nello stesso muro**, e l'unico
    // modo di uscirne era cancellare i dati del sito dal menu del browser.
    //
    // Fa esattamente quello che fa il pulsante omonimo nel Pannello Admin —
    // cancella la chiave e ricarica — e riusa quella riga invece di
    // riscriverla (regola 13).
    var resetBtn = document.getElementById('load-error-reset');
    if (resetBtn) resetBtn.hidden = !BI.magLeggiJson(CONFIG_OVERRIDES_KEY, function () { return null; });

    var testi = istruzioniInMemoria();
    var inMemoria = testi && testi.erroreCaricamento;
    renderLoadErrorTexts(inMemoria);
    leaveModule('error');
    if (inMemoria) return;
    loadModuleInstructions().then(function (data) {
      if (!views.error.classList.contains('is-active')) return;
      renderLoadErrorTexts(data.erroreCaricamento);
    }).catch(function () {});
  }

  // ⚠️ LE DUE FRASI DELLA SCHERMATA INIZIALE VENGONO DAL FILE DEI TESTI, dal
  // 2026-09-21. Prima erano incollate qui — `'Ciao, ' + name + '!'` e
  // `'Inizia ' + nome` — cioè **testo che legge lo studente dentro il codice**,
  // che la regola 8 vieta. *Non erano un residuo dimenticato: erano le uniche
  // due frasi dell'app che portano un valore DENTRO, e per quelle
  // `data-testo` non basta — serve un modello con il segnaposto.*
  //
  // ⚠️ E NON SI SVUOTA QUELLO CHE IL MARKUP GIÀ DICE. Se i testi non sono
  // ancora arrivati, `uiTextWith` restituisce la stringa vuota: scriverla
  // lascerebbe un saluto senza parole e un pulsante muto **peggio di prima**,
  // quando il markup teneva "Ciao!" e "Inizia". Qui si scrive solo se c'è
  // qualcosa da scrivere, e si riscrive quando i testi arrivano — la stessa
  // forma che `showLoadError` usa già venti righe più su (regola 13).
  function scriviTestiHome() {
    var saluto = uiTextWith('condivisi.salutoHome', { nome: getUserName() });
    var inizia = uiTextWith('condivisi.iniziaEpisodioNominato',
      { episodio: BI.episodioCorrente() ? BI.episodioCorrente().nome : '' });
    if (saluto.trim()) document.getElementById('home-greeting').textContent = saluto;
    if (inizia.trim()) document.getElementById('go-episode').textContent = inizia;
  }

  function goHome() {
    scriviTestiHome();
    // I testi possono non esserci ancora: quando arrivano si riscrive, ma solo
    // se lo studente è ancora qui — altrimenti si scriverebbe su una schermata
    // che ha già lasciato.
    if (!istruzioniInMemoria()) {
      loadModuleInstructions()
        .then(function () { if (views.home.classList.contains('is-active')) scriviTestiHome(); })
        .catch(function () {});
    }
    leaveModule('home');
  }

  // ============================================================
  // IL GUSCIO DELL'APP — passo ②, 2026-09-20.
  //
  // Il selettore del tema, il limite di lunghezza del nome, le due schermate
  // dell'identita' (entra / cambia utente) e il tasto Escape.
  //
  // ⚠️ PERCHE' QUI E NON IN `app/identita.js`, che e' dove vivono `setTheme`,
  // `setUserName` e `clearUserName`: **quel file sta nella PRIMA fila**, cioe'
  // nel `<head>`, e queste righe toccano il markup a tempo di parsing —
  // `document.getElementById('theme-picker')` li' dentro troverebbe `null`.
  // *Il confine non e' l'argomento: e' il momento.*
  //
  // ⚠️ E PERCHE' NON IN `app/orchestrazione.js`, che sta nella seconda fila ed
  // e' «le viste»: il modulo di onboarding chiama `goHome`, che e' di questo
  // file e viene DOPO. Sarebbe stata una dipendenza in avanti nuova, creata
  // per mettere quattro listener in un file invece che in un altro.
  //
  // Sta con `boot()`, ed e' la ragione vera: **queste sono esattamente le
  // schermate che `boot()` decide di mostrare.**
  // ============================================================
  renderThemePicker();

  document.getElementById('theme-picker').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-option]');
    if (!btn) return;
    setTheme(btn.getAttribute('data-theme-option'));
  });

  syncThemePicker();

  /* ============================================================
     USER IDENTITY
     ============================================================ */

  document.getElementById('name-input').maxLength = CONFIG.limits.userNameMaxLength;

  document.getElementById('onboarding-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('name-input');
    var name = input.value.trim();
    if (!name) return;
    setUserName(name);
    goHome();
  });

  document.getElementById('switch-user').addEventListener('click', function () {
    clearUserName();
    var input = document.getElementById('name-input');
    input.value = '';
    showView('onboarding');
    input.focus();
  });

  // Escape chiude quello che e' aperto, e non sa di chi sia: lo chiede ai due
  // proprietari. Sta qui perche' non e' di nessuno dei due — e' una regola che
  // vale per tutta l'app, come le quattro righe qui sopra.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    // ⚠️ I due di `ui-condivisa` si chiedono a lei; il terzo e' del Pannello
    // Admin, che sta ancora qui. E' il motivo per cui questo listener non e'
    // uscito con lo strato: chiude overlay di DUE proprietari diversi.
    BI.chiudiOverlayAperti();
    BI.chiudiPannelloSeAperto();
  });

  // ============================================================
  // ⚠️ `episodeFinalOutcomeCase` — ARRIVATA QUI COL PASSO ②, E OGGI NON HA
  // NESSUN CHIAMANTE.
  //
  // E' pronta per il Modulo Finale, che non e' costruito. Sta qui perche'
  // legge `loadModuleOutcomes`, che questo file aliasa gia': portarla altrove
  // avrebbe creato una dipendenza nuova per del codice che nessuno chiama.
  // *Registrata in `docs/decisioni-stato.md` come trovata e non corretta.*
  // ============================================================
  // Modulo Finale (not yet built) needs to pick one of three contents —
  // this is that decision, ready ahead of the screen itself. Only
  // modules that actually carry a verde/giallo/rosso outcome.level
  // count (ModuleRules or selfAssessment — see CONFIG.moduleOutcomeRules);
  // a plain completionRules module (Repeat Aloud, Meet the Story, Your
  // Story) has no judgment to weigh in, same as it never gets an
  // outcome-* class on its own map row. 'almenoUnRosso' wins over
  // 'gialloNoRosso' if both are present; an episode with no graded
  // modules at all defaults to 'tuttiVerdi' (nothing to flag). Reads
  // data/inglese/it/inglese-it-messaggi-feedback.json's episodeFinalMessages[caseKey] for the
  // actual text (compliment first, then an optional trailing tip) —
  // never write the copy here.
  function episodeFinalOutcomeCase(episode, userName) {
    var outcomes = loadModuleOutcomes(episode.id, userName);
    var levels = episode.modules
      .map(function (m) { return outcomes[m.id] && outcomes[m.id].level; })
      .filter(Boolean);
    if (levels.indexOf('rosso') !== -1) return 'almenoUnRosso';
    if (levels.indexOf('giallo') !== -1) return 'gialloNoRosso';
    return 'tuttiVerdi';
  }

  // ============================================================
  // I CINQUE PULSANTI DELLA MAPPA — arrivati qui col passo ③, 2026-09-20.
  //
  // «Vai all'episodio», la barra «Guarda come si fa», il pulsante che chiude
  // l'introduzione, «Help» e «← Home». Erano gli ultimi listener rimasti in
  // `index.html`, nella regione EPISODE MAP.
  //
  // ⚠️ E LI HO PERSI PER QUINDICI MINUTI, PRIMA DI RIMETTERLI. Svuotando lo
  // script in linea ho tagliato l'INTERVALLO, non i pezzi che avevo censito
  // uno per uno: questi cinque non erano in nessuno degli otto blocchi
  // dichiarati e sono spariti con tutto il resto. L'app partiva, la
  // schermata iniziale c'era, il nome si scriveva — e «Vai all'episodio»
  // **non faceva niente, senza nessun errore.** Ripresi da `git show HEAD`.
  //
  // *Ed e' la ragione per cui questo passo si e' guidato invece di leggerlo:
  // un listener che non c'e' piu' non alza niente. E' il guasto MUTO, la
  // stessa forma che la regola 12 chiude per `hidden` e che qui non aveva
  // nessuna rete — nessun test apriva la mappa da `#go-episode` con un
  // profilo nuovo.*
  // ============================================================
  document.getElementById('go-episode').addEventListener('click', openEpisodeMap);

  document.getElementById('map-watch-btn').addEventListener('click', function () {
    openHowItWorksOverlay(MAP_PSEUDO_MODULE, { dismissPref: introDismissPref('mappaEpisodio') });
  });

  document.getElementById('map-intro-start-btn').addEventListener('click', function () {
    setIntroDismissed('mappaEpisodio', getUserName(), document.getElementById('map-intro-dont-show-again').checked);
    mapShowScreen('main');
  });

  document.getElementById('map-help-btn').addEventListener('click', function () {
    openHelpFor(MAP_PSEUDO_MODULE);
  });

  document.getElementById('map-back-home').addEventListener('click', goHome);

  function boot() {
    // ⚠️ LE ICONE PRIMA DI TUTTO: il markup statico porta dei segnaposto
    // `data-icon`, e finche' nessuno li riempie le schermate hanno dei buchi.
    // Stava in fondo all'IIFE di `index.html`, che girava prima di `boot()`
    // per posizione; adesso e' la prima riga di `boot()`, che e' dove "l'app
    // si accende" ha un nome.
    hydrateIcons(document);

    // ⚠️ LA PORTA `?config` STA QUI, PRIMA DEL FETCH, DAL 2026-09-21 — e il
    // perche' e' un caso vero, non una simmetria.
    //
    // Stava in fondo ad `accendi()`, cioe' DENTRO il `.then` del file di
    // struttura. Quando quel file non arriva — per esempio perche' un
    // override del Pannello Admin punta a un'edizione che non esiste —
    // `accendi()` non gira, e **la porta che serve a disfare quell'override
    // non si apre.** L'attrezzo chiuso dentro la stanza che deve aprire.
    //
    // Qui gira sempre: il markup c'e' gia' (e' statico), e il pannello sa
    // disegnarsi anche senza episodio (vedi `riquadroSenzaEpisodio`).
    //
    // La seconda porta serve ai telefoni, dove digitare «config» vorrebbe
    // dire aprire la tastiera. Non e' scopribile per caso piu' della
    // sequenza da tastiera: bisogna scriverlo nella barra degli indirizzi.
    try {
      if (new URLSearchParams(window.location.search).has('config')) openConfigPanel();
    } catch (e) {}

    // ⚠️ DA QUI IN POI SI ASPETTA UN FILE. Passo 1.11b, 2026-09-20.
    //
    // `struttura-corso.json` porta le sequenze, i gradi, i loro nomi, le
    // categorie e l'elenco degli episodi di QUESTA edizione. Senza, non c'e'
    // niente da disegnare: non una mappa povera, proprio nessuna mappa.
    //
    // Quindi l'accensione si spezza in due: le icone subito — il markup
    // statico e' gia' li' e i suoi segnaposto vanno riempiti comunque — e
    // tutto il resto quando il file c'e'.
    //
    // Il rifiuto NON si ingoia: va alla schermata d'errore (regola 35), con
    // il suo «riprova» che rifa' `boot()`. Una mappa vuota al posto di un
    // messaggio sarebbe il guasto muto invece di quello che si vede.
    caricaStrutturaCorso().then(accendi).catch(function () {
      showLoadError(function () { boot(); });
    });
  }

  // La seconda meta' di `boot()`: tutto cio' che ha bisogno della struttura
  // del corso. Separata e non lasciata dentro il `.then` perche' li' dentro
  // finirebbero sessanta righe, e un rientro in piu' su un blocco lungo
  // nasconde dove comincia e dove finisce.
  function accendi() {
    // ⚠️ I PASSI DI OGNI EPISODIO, PRIMA DI TUTTO IL RESTO. Passo 1.11a.
    //
    // `EPISODES` porta chi sono gli episodi e i loro descrittori; `modules`
    // — l'ordine dei passi col grado di ciascuno — lo mette questa chiamata,
    // leggendo `CONFIG.sequences` e `CONFIG.episodes`. Girava da sola a
    // tempo di parsing in `app/catalogo.js`; adesso e' `boot()` a chiederla,
    // perche' col passo dopo quei due valori arriveranno da un `fetch` e un
    // valore che arriva dopo non puo' essere letto prima.
    //
    // Sta PRIMA della scelta dell'episodio iniziale e non dopo: `goHome()`
    // disegna la mappa, e una mappa disegnata su `episode.modules` non
    // ancora costruito sarebbe vuota senza dire perche'.
    costruisciPassi();

  // ⚠️ QUESTO CALCOLO RESTA QUI, E LO STATO NO. Passo B, 2026-09-19.
  //
  // Scegliere QUALE episodio aprire e' un mestiere del **catalogo** — legge
  // `EPISODES` e `CONFIG.episodioCorrente` — mentre TENERE l'episodio aperto
  // e' lo stato di sessione, che sta in `app/sessione.js`.
  //
  // Quindi qui si calcola e si CONSEGNA. La consegna e' una riga, e permette
  // allo stato di uscire **prima** del catalogo: se `sessione.js` calcolasse
  // da se', chiederebbe `EPISODES` all'insu' e il conto salirebbe invece di
  // scendere. *Chi riceve puo' stare ovunque; chi va a prendere deve stare
  // dove sono le cose.*
  var episodioIniziale = EPISODES[CONFIG.episodioCorrente];
  if (!episodioIniziale) {
    console.error('[base-inglese] CONFIG.episodioCorrente vale "' + CONFIG.episodioCorrente +
      '", che non e\' un episodio dichiarato: si apre il primo (' + Object.keys(EPISODES)[0] + ').');
    episodioIniziale = EPISODES[Object.keys(EPISODES)[0]];
  }
  BI.impostaEpisodioCorrente(episodioIniziale);

    if (getUserName()) {
      goHome();
    } else {
      showView('onboarding');
      document.getElementById('name-input').focus();
    }

    // ⚠️ SE IL PANNELLO E' GIA' APERTO, SI RIDISEGNA ADESSO — e questa riga
    // e' la seconda meta' della porta spostata, non una rifinitura.
    //
    // `?config` gira PRIMA del fetch, apposta: e' l'unico modo perche' la
    // porta esista anche quando l'app non parte. Ma sull'app SANA vuol dire
    // che il pannello si apre prima che l'episodio ci sia — e i quattro
    // report, che sono per episodio, mostravano la riga «nessun episodio
    // aperto» **restando cosi' anche dopo**, su un'app perfettamente viva.
    //
    // ⚠️ Non l'ho vista rileggendo: l'ha trovata la suite. `test_config_estratto`
    // apre il pannello proprio con `?config`, e la sua tabella e' passata da
    // tre righe a zero. *Il difetto era esattamente quello che il passo voleva
    // togliere — un pannello che dice «non c'e' niente» quando c'e' tutto —
    // ricomparso dall'altra parte.*
    //
    // E' la stessa forma di `aggiungiGruppiMagazzino`, che ridisegna i due
    // gruppi delle tabelle quando il magazzino arriva: qui arriva l'episodio.
    if (configPanelOverlayEl.classList.contains('is-open')) openConfigPanel();
  }

  var configPanelOverlayEl = document.getElementById('config-panel-overlay');

  var configPanelBodyEl = document.getElementById('config-panel-body');

  // Read-only usage rows (job 6c) — current user, current episode. Not
  // part of renderConfigPanel's generic APP_CONFIG walk (this isn't a
  // tunable, see addAudioSecondsSent's own comment); re-rendered every
  // open so it always reflects whatever was just recorded.
  // ⚠️ I QUATTRO RIQUADRI DI REPORT NON ESISTONO SENZA UN EPISODIO, E DAL
  // 2026-09-21 LO DICONO INVECE DI FAR CADERE IL PANNELLO INTERO.
  //
  // Sono report per utente E per episodio: `loadAudioUsage(episodio, utente)`.
  // Senza un episodio corrente non c'e' niente da mostrare — ma fino a oggi
  // leggevano `BI.episodioCorrente().id` senza guardia, e quando l'episodio
  // non c'era alzavano un `TypeError` che **portava giu' tutto il pannello**.
  //
  // ⚠️ E IL CASO NON E' TEORICO: e' il muro in cui e' finito chi guida il
  // progetto il 2026-09-21. Una `edizione` sbagliata negli override fa
  // fallire `struttura-corso.json`, `accendi()` non gira, `EPISODES` resta
  // vuoto — e il Pannello Admin, che e' **l'unico strumento capace di
  // annullare quell'override**, non si apriva. *L'attrezzo per riparare
  // rotto dalla stessa cosa che deve riparare.*
  //
  // La forma e' quella della regola 35 letta per gli strumenti: **chi ripara
  // non puo' dipendere da cio' che e' rotto.** Quindi i report spariscono e
  // le manopole restano, invece di cadere insieme.
  function riquadroSenzaEpisodio(el) {
    if (BI.episodioCorrente()) return false;
    el.innerHTML = '<p class="config-field-hint">Nessun episodio aperto: questo report si ' +
      'costruisce per episodio, e adesso non ce n\'e\' uno. Le manopole qui sopra funzionano ' +
      'lo stesso — se sei qui perche\' l\'app non parte, prova «Ripristina valori di partenza».</p>';
    return true;
  }

  function renderAudioUsagePanel() {
    var el = document.getElementById('config-audio-usage');
    if (!el) return;
    if (riquadroSenzaEpisodio(el)) return;
    var usage = loadAudioUsage(BI.episodioCorrente().id, getUserName());
    var moduleIds = Object.keys(usage.byModule);
    var total = moduleIds.reduce(function (sum, id) { return sum + usage.byModule[id]; }, 0);
    var rowsHtml = moduleIds.map(function (id) {
      var label = stepLabel(id);
      return '<div class="config-audio-usage-row"><span>' + label + '</span><span>' + usage.byModule[id].toFixed(1) + ' s</span></div>';
    }).join('');
    el.innerHTML =
      '<p class="config-field-hint">Utente corrente (' + getUserName() + '), episodio ' + BI.episodioCorrente().id + '.</p>' +
      (rowsHtml || '<p class="config-field-hint">Nessuna registrazione inviata finora.</p>') +
      '<div class="config-audio-usage-row config-audio-usage-total"><span>Totale episodio</span><span>' + total.toFixed(1) + ' s</span></div>';
  }

  // I colori delle voci, ordinati per chiave: cosi' le righe della stessa
  // parola finiscono vicine e si vede a occhio che `a-hello` ne ha una per
  // esercizio e una per direzione. L'ordinamento e' il punto del pannello,
  // non un dettaglio: sciolte, quelle righe non dicono niente.
  //
  // Legge e basta. Nessuna scrittura, nessun tocco a applyMasteryResult,
  // alla coda di ripasso o agli azzeramenti.
  function renderMasteryPanel() {
    var el = document.getElementById('config-mastery');
    if (!el) return;
    if (riquadroSenzaEpisodio(el)) return;
    var mastery = loadMastery(BI.episodioCorrente().id, getUserName());
    var chiavi = Object.keys(mastery).sort();
    var perLivello = { rosso: 0, giallo: 0, verde: 0 };
    var righe = chiavi.map(function (k) {
      var v = mastery[k] || {};
      if (perLivello[v.level] !== undefined) perLivello[v.level]++;
      return '<div class="config-audio-usage-row config-mastery-row">' +
        '<span class="config-mastery-key">' + k + '</span>' +
        '<span><span class="config-mastery-level" data-level="' + (v.level || '?') + '">' +
        (v.level || '?') + '</span> · streak ' + (v.streak === undefined ? '?' : v.streak) + '</span>' +
        '</div>';
    }).join('');
    el.innerHTML =
      '<p class="config-field-hint">Utente corrente (' + getUserName() + '), episodio ' +
      BI.episodioCorrente().id + '. La chiave e\' <code>esercizio:voce:direzione</code>: la stessa parola ha una riga per ogni esercizio e per ogni direzione, ed e\' voluto. Il primo campo non e\' sempre il solo nome dell\'esercizio: Flash Card ci mette anche il grado (<code>flashcard-A</code>, <code>flashcard-B</code>), perche\' compare due volte nella sequenza su gradi diversi e le due apparizioni non devono mescolare i colori. Voice Practice e Voice Check aggiungono una dimensione: <code>voicepractice:b-and-you</code> e\' la battuta intera, <code>voicepractice:b-and-you:0</code> e\' la prima parola DENTRO quella battuta — la stessa parola vale un\'altra cosa da sola e in mezzo a un\'espressione. Le due varianti hanno prefissi diversi perche\' hanno regole diverse su quale tentativo conta. Il numero di scritture non c\'e\': non viene salvato.</p>' +
      '<div class="config-audio-usage-row config-audio-usage-total"><span>Voci in tutto</span><span>' + chiavi.length + '</span></div>' +
      '<div class="config-audio-usage-row"><span>rosso · giallo · verde</span><span>' +
      perLivello.rosso + ' · ' + perLivello.giallo + ' · ' + perLivello.verde + '</span></div>' +
      (righe || '<p class="config-field-hint">Nessuna voce ancora: questo profilo non ha risposto a niente che scriva un colore.</p>');
  }

  function renderNextLineSkipsPanel() {
    var el = document.getElementById('config-next-line-skips');
    if (!el) return;
    if (riquadroSenzaEpisodio(el)) return;
    var usage = loadNextLineSkips(BI.episodioCorrente().id, getUserName());
    var moduleIds = Object.keys(usage.byModule);
    var total = moduleIds.reduce(function (sum, id) { return sum + usage.byModule[id]; }, 0);
    var rowsHtml = moduleIds.map(function (id) {
      var label = stepLabel(id);
      return '<div class="config-audio-usage-row"><span>' + label + '</span><span>' + usage.byModule[id] + '</span></div>';
    }).join('');
    el.innerHTML =
      '<p class="config-field-hint">Utente corrente (' + getUserName() + '), episodio ' + BI.episodioCorrente().id + '. Se il numero è alto, i tempi di dialogo.pausaBase/pausaPerParola sono probabilmente troppo lunghi.</p>' +
      (rowsHtml || '<p class="config-field-hint">Mai usato finora.</p>') +
      '<div class="config-audio-usage-row config-audio-usage-total"><span>Totale episodio</span><span>' + total + '</span></div>';
  }

  // ⚠️ IL PANNELLO SI APRE SUBITO E I DUE GRUPPI ARRIVANO DOPO, e non e' una
  // scorciatoia: e' l'unica forma onesta.
  //
  // Tutto il resto di questo pannello e' in memoria, quindi farlo aspettare il
  // magazzino vorrebbe dire non mostrare NIENTE finche' un fetch non torna —
  // e questo pannello si apre anche dalla schermata di onboarding, cioe'
  // davanti a una pagina ancora vuota. Quindi: si disegna subito quello che
  // c'e', e appena il magazzino arriva si ridisegna con i due gruppi in piu'.
  //
  // Se il magazzino non arriva affatto, il pannello resta senza quei due
  // gruppi invece di restare chiuso: e' uno strumento di servizio, non una
  // schermata dello studente, e un guasto qui non deve impedire di leggere
  // tutti gli altri parametri (per questo il .catch e' vuoto ED E' LEGITTIMO
  // — registrato in tests/ERRORI-INGOIATI.md).
  function openConfigPanel() {
    renderConfigPanel();
    renderAudioUsagePanel();
    renderNextLineSkipsPanel();
    renderStoryCardsExplanationStatsPanel();
    renderMasteryPanel();
    configPanelOverlayEl.classList.add('is-open');
    loadPersonalizationTables().then(function (tables) {
      // Solo se il pannello e' ancora aperto: un ridisegno su un pannello
      // chiuso rimetterebbe in piedi lo stato aperto/chiuso dei <details>
      // che l'utente aveva in mano.
      if (configPanelOverlayEl.classList.contains('is-open')) aggiungiGruppiMagazzino(tables);
    }).catch(function () {});
  }

  function closeConfigPanel() { configPanelOverlayEl.classList.remove('is-open'); }

  // Looked up by dotted path (same string as data-config-path) in
  // CONFIG.configFieldDescriptions — a parameter with no entry there
  // just renders without this line, never a placeholder gap.
  function configFieldDescriptionHtml(path) {
    var text = CONFIG.configFieldDescriptions[path.join('.')];
    return text ? '<p class="config-field-description">' + text + '</p>' : '';
  }

  function renderConfigScalarField(path, value) {
    var id = 'cfg-' + path.join('-');
    var label = path[path.length - 1];
    var wrap = document.createElement('div');
    wrap.className = 'config-field';
    if (typeof value === 'boolean') {
      wrap.classList.add('config-field-checkbox');
      wrap.innerHTML =
        '<label for="' + id + '">' +
          '<input type="checkbox" id="' + id + '" data-config-path="' + path.join('.') + '"' + (value ? ' checked' : '') + '>' +
          '<span class="config-field-label">' + label + '</span>' +
        '</label>' +
        configFieldDescriptionHtml(path);
    } else {
      var type = typeof value === 'number' ? 'number' : 'text';
      wrap.innerHTML =
        '<label class="config-field-label" for="' + id + '">' + label + '</label>' +
        configFieldDescriptionHtml(path) +
        '<input type="' + type + '" id="' + id + '" data-config-path="' + path.join('.') + '" value="' + String(value).replace(/"/g, '&quot;') + '"' + (type === 'number' ? ' step="any"' : '') + '>';
    }
    return wrap;
  }

  function renderConfigJsonField(path, value) {
    var id = 'cfg-' + path.join('-');
    var label = path[path.length - 1];
    var wrap = document.createElement('div');
    wrap.className = 'config-field config-field-json';
    wrap.innerHTML =
      '<label class="config-field-label" for="' + id + '">' + label + ' <span class="config-field-hint">(JSON)</span></label>' +
      configFieldDescriptionHtml(path) +
      '<textarea id="' + id + '" rows="4" data-config-path="' + path.join('.') + '" data-config-json="1">' + JSON.stringify(value, null, 2).replace(/</g, '&lt;') + '</textarea>' +
      '<div class="config-field-error" hidden></div>';
    return wrap;
  }

  // La sequenza di un episodio: un MENU con i nomi che esistono, non la
  // casella di testo che il pannello darebbe da solo a un parametro stringa.
  //
  // ⚠️ Perche' un menu, e le due ragioni sono diverse. La prima: un nome
  // scritto a mano che non esiste manda l'episodio sulla schermata d'errore
  // all'apertura della mappa — un guasto che si vede, ma cercato nel posto
  // sbagliato. La seconda, peggiore: il campo si salvava **senza ricaricare**,
  // e i passi si costruiscono all'avvio. Cambiavi il nome, il pannello lo
  // salvava, e la mappa restava quella di prima — «una manopola che sembra
  // aver fatto qualcosa e non l'ha fatto», la stessa frase che il commento
  // dell'interruttore dell'episodio usa per spiegare il suo data-config-reload.
  //
  // ⚠️ E IL NOME CHE NON ESISTE RESTA NELL'ELENCO, invece di sparire: un
  // <select> il cui valore non e' fra le opzioni mostra la PRIMA, e al primo
  // salvataggio cambierebbe in silenzio la sequenza dell'episodio. Meglio
  // un'opzione che dice che non esiste, e che chi legge puo' correggere.
  function renderSequenceChoiceField(path, value) {
    var id = 'cfg-' + path.join('-');
    var wrap = document.createElement('div');
    wrap.className = 'config-field';
    var nomi = nomiDelleSequenze();
    var opzioni = nomi.map(function (n) {
      return '<option value="' + n + '"' + (n === value ? ' selected' : '') + '>' + n + '</option>';
    });
    if (nomi.indexOf(value) === -1) {
      opzioni.unshift('<option value="' + String(value).replace(/"/g, '&quot;') + '" selected>' +
        String(value) + ' — non esiste</option>');
    }
    wrap.innerHTML =
      '<label class="config-field-label" for="' + id + '">' + path[path.length - 1] + '</label>' +
      // La spiegazione e' UNA per tutti gli episodi, quindi si cerca con una
      // chiave fissa e non col percorso vero (`episodes.gate.sequence`): una
      // riga per episodio andrebbe riscritta a ogni episodio nuovo.
      configFieldDescriptionHtml(['episodes', '*', 'sequence']) +
      '<select id="' + id + '" data-config-path="' + path.join('.') + '" data-config-reload>' +
      opzioni.join('') + '</select>';
    return wrap;
  }

  function renderConfigFields(container, obj, path) {
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      var fieldPath = path.concat([key]);
      if (path[0] === 'episodes' && key === 'sequence' && typeof value === 'string') {
        container.appendChild(renderSequenceChoiceField(fieldPath, value));
      } else if (Array.isArray(value)) {
        container.appendChild(renderConfigJsonField(fieldPath, value));
      } else if (value !== null && typeof value === 'object') {
        var sub = document.createElement('div');
        sub.className = 'config-subgroup';
        var subLabel = document.createElement('div');
        subLabel.className = 'config-subgroup-label';
        subLabel.textContent = key;
        sub.appendChild(subLabel);
        renderConfigFields(sub, value, fieldPath);
        container.appendChild(sub);
      } else {
        container.appendChild(renderConfigScalarField(fieldPath, value));
      }
    });
  }

  // CONFIG.sequences gets its own reorder view (up/down per row)
  // instead of the generic raw-JSON textarea every other array field
  // gets — the same override storage (setConfigPath/persistConfigSection)
  // either way, just a friendlier editor for a field that's meant to be
  // touched often as the course grows (CLAUDE.md rule 13).
  // Il nome da mostrare per un ID DI PASSO ('voicePractice-2'), non per un id
  // di modulo. Non fa chirurgia sulla stringa: il nome e' GIA' calcolato e
  // attaccato a ogni passo (episode.modules -> module.label), quindi qui si
  // legge la fonte invece di ri-derivarla.
  //
  // Perche' esiste: gli store dei pannelli-report sono indicizzati per id di
  // PASSO (addAudioSecondsSent riceve vcModule.id, addNextLineSkip riceve
  // dgModule.id), e CONFIG.moduleLabels e' indicizzata per id di MODULO. Dalla
  // seconda apparizione in poi la chiave non esiste e il pannello cadeva sul
  // nome tecnico: "voicePractice-2" invece di "Voice Practice".
  //
  // E' l'ottava e la nona lettura di quella famiglia: la correzione del
  // 2026-09-05 ne sistemo' sette (vedi docs/correzioni.md) e questi due punti
  // non furono guardati. Da allora, di quella famiglia, non ne resta nessuna.
  //
  // ⚠️ Ma "quella famiglia e' chiusa" NON vuol dire "i nomi dei passi sono a
  // posto", ed e' quello che questa riga sembrava dire quando diceva "da qui
  // in poi ce n'e' uno solo da guardare". E' successo di nuovo il 2026-09-09,
  // in una forma diversa: la chiave si risolveva benissimo, ma la label del
  // passo non portava il GRADO, quindi i due Voice Practice avevano lo stesso
  // identico nome e nel contatore audio comparivano due righe indistinguibili.
  // Principio giusto, elenco corto — la stessa cosa della regola sulle forme.
  //
  // Da qui il withGradeName qui sotto. Il grado si aggiunge SEMPRE, non solo
  // quando due passi collidono: una regola "aggiungilo se serve" farebbe
  // dipendere il nome di un passo da cosa c'e' nel RESTO della sequenza, e lo
  // stesso passo si chiamerebbe in due modi a seconda dei vicini. In un
  // pannello-report il grado e' informazione, non rumore: dice su cosa quei
  // secondi sono stati spesi.
  //
  // Un passo spento o sparito da un riordino non si trova piu': si mostra la
  // chiave grezza, come faceva prima. Meglio una chiave che una riga in meno.
  function stepLabel(stepId) {
    var passi = (BI.episodioCorrente() && BI.episodioCorrente().modules) || [];
    for (var i = 0; i < passi.length; i++) {
      if (passi[i].id === stepId) return withGradeName(passi[i].label || stepId, passi[i].grade);
    }
    return stepId;
  }

  function moduleOrderRowLabel(id) {
    // CONFIG.moduleLabels is the one place a module's display name lives
    // (see its own comment) — modulesById stopped carrying .label when
    // that move happened, so reading .label off it here was silently
    // falling back to the raw module id every time (only a stale test
    // assertion still expecting the old string kept this from surfacing).
    var meta = CONFIG.moduleLabels[id];
    return (meta && meta.name) || id;
  }

  // Un modulo "legge un grado" se il suo contenuto viene dal file
  // episodio: è il dataFile del descrittore a dirlo, non un elenco a parte
  // da tenere allineato a mano. Personalizza non ne ha, quindi la sua riga
  // non mostra il pulsante del grado. Guarda tutti gli episodi perché
  // La vista mostra la sequenza dell'episodio corrente, non un ordine globale.
  function moduleUsesGrade(moduleId) {
    return Object.keys(BI.EPISODES).some(function (episodeId) {
      var entry = BI.EPISODES[episodeId].modulesById[moduleId];
      return !!(entry && entry.dataFile);
    });
  }

  // Quale sequenza sta modificando il pannello: quella dell'episodio che si
  // sta guardando. Prima la vista era legata all'unico ordine globale e la
  // domanda non esisteva; adesso le sequenze sono piu' d'una, e modificarne
  // una a caso sarebbe peggio che non modificarne nessuna.
  //
  // Un episodio con un moduleOrder proprio non ha una sequenza da riordinare
  // qui: la vista lo dice invece di mostrare le righe di qualcun altro.
  // ⚠️ DUE FUNZIONI E NON UNA, dal 2026-09-20, e non e' pulizia: da oggi il
  // pannello puo' modificare una sequenza DIVERSA da quella dell'episodio
  // aperto, e le due domande divergono appena tocchi il menu.
  //
  // «Quale sequenza usa l'episodio aperto» e «quale sequenza sto guardando»
  // erano la stessa risposta finche' la seconda non si poteva scegliere. Una
  // cosa che risponde a due domande da' la risposta giusta a una e sbagliata
  // all'altra (famiglia ⓪-decies) — qui divergerebbero in silenzio, mostrando
  // le righe di una e salvandole sull'altra.
  function sequenzaDellEpisodio() {
    var ep = (CONFIG.episodes && CONFIG.episodes[BI.episodioCorrente() && BI.episodioCorrente().id]) || {};
    return (typeof ep.sequence === 'string' && ep.sequence) || null;
  }

  // La scelta fatta col menu. NON e' un parametro di APP_CONFIG (regola 3) e
  // non si salva: e' lo stato del pannello mentre e' aperto, come lo scorrimento
  // di una lista. Metterla in configurazione vorrebbe dire farla comparire nel
  // pannello stesso, cioe' una manopola che governa il pannello dal pannello.
  var sequenzaScelta = null;

  function nomiDelleSequenze() {
    return Object.keys((window.APP_CONFIG && window.APP_CONFIG.sequences) || {});
  }

  // Quale sequenza sta guardando il pannello: quella scelta col menu, o —
  // finche' nessuno ha scelto — quella dell'episodio aperto.
  //
  // ⚠️ La scelta vale solo se quella sequenza ESISTE ancora: il pulsante
  // «Ripristina valori di partenza» puo' portarsene via una mentre il menu
  // la sta indicando, e mostrare le righe di una sequenza sparita sarebbe
  // peggio che tornare a quella dell'episodio.
  function sequenzaInModifica() {
    if (sequenzaScelta && nomiDelleSequenze().indexOf(sequenzaScelta) !== -1) return sequenzaScelta;
    return sequenzaDellEpisodio();
  }

  function ordineInModifica() {
    var nome = sequenzaInModifica();
    return (nome && window.APP_CONFIG.sequences && window.APP_CONFIG.sequences[nome]) || null;
  }

  function renderModuleOrderRows(list) {
    var order = ordineInModifica();
    if (!order) { list.innerHTML = '<p class="config-field-hint">Questo episodio non usa una sequenza: ha un <code>moduleOrder</code> proprio, che si modifica dal campo <code>episodes</code>.</p>'; return; }
    list.innerHTML = order.map(function (pair, i) {
      var gradeBtn = moduleUsesGrade(pair.module)
        ? '<button type="button" class="btn btn-secondary btn-sm config-module-order-grade" data-order-grade="' + i + '" aria-label="Cambia grado">' + (pair.grade || '–') + '</button>'
        : '';
      // Acceso/spento: un tocco, stessa riga, nessuna finestra — serve a
      // provare varianti dell'episodio a raffica.
      var onOffBtn = '<button type="button" class="btn btn-secondary btn-sm config-module-order-onoff" data-order-onoff="' + i + '"' +
        ' aria-pressed="' + (pair.off ? 'false' : 'true') + '" aria-label="' + (pair.off ? 'Attiva' : 'Disattiva') + ' questo passo">' +
        icon(pair.off ? 'eye-off' : 'eye') + '</button>';
      return '<div class="config-module-order-row' + (pair.off ? ' is-off' : '') + '">' +
        '<span class="config-module-order-label">' + moduleOrderRowLabel(pair.module) + '</span>' +
        onOffBtn +
        '<div class="config-module-order-controls">' +
        gradeBtn +
        '<button type="button" class="btn btn-secondary btn-sm" data-order-move="up" data-order-index="' + i + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="Sposta su">' + icon('chevron-up') + '</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-order-move="down" data-order-index="' + i + '"' + (i === order.length - 1 ? ' disabled' : '') + ' aria-label="Sposta giù">' + icon('chevron-down') + '</button>' +
        '</div></div>';
    }).join('');
  }

  // L'interruttore dell'episodio: un menu con gli episodi che ESISTONO,
  // costruito da Object.keys(EPISODES) invece che da un elenco scritto a
  // mano — un episodio nuovo compare qui senza che nessuno tocchi il
  // pannello, e uno tolto sparisce.
  //
  // Perche' un menu e non il campo di testo che il pannello darebbe da solo
  // a un parametro stringa: un id sbagliato a mano manda l'app sul ramo di
  // ripiego qui sopra, cioe' su un episodio che non e' quello che si
  // credeva di aver scelto. Con il menu quel caso non si presenta.
  //
  // Il ricaricamento non e' una comodita': mappa, progressi, slot e
  // contenuti dell'episodio si costruiscono all'avvio, e cambiarlo a caldo
  // lascerebbe a schermo un misto dei due. Lo dichiara data-config-reload,
  // gestito dal listener generico dei campi (piu' sotto) insieme al
  // salvataggio, invece che da un secondo listener suo.
  function renderEpisodeSwitchField() {
    var wrap = document.createElement('div');
    wrap.className = 'config-field';
    var opzioni = Object.keys(BI.EPISODES).map(function (id) {
      var ep = BI.EPISODES[id];
      return '<option value="' + id + '"' + (id === CONFIG.episodioCorrente ? ' selected' : '') + '>' +
        (ep.nome || id) + ' (' + id + ')</option>';
    }).join('');
    wrap.innerHTML =
      '<label class="config-field-label" for="cfg-episodioCorrente">episodioCorrente</label>' +
      configFieldDescriptionHtml(['episodioCorrente']) +
      '<select id="cfg-episodioCorrente" data-config-path="episodioCorrente" data-config-reload>' + opzioni + '</select>';
    return wrap;
  }

  // Il menu «quale sequenza sto modificando». Elenca le sequenze che
  // ESISTONO, come l'interruttore dell'episodio elenca gli episodi che
  // esistono: una sequenza nuova nel file compare qui da sola.
  //
  // ⚠️ NON ricarica la pagina, e la differenza con l'altro menu e' precisa:
  // quello cambia QUALE episodio l'app ha costruito all'avvio, questo cambia
  // solo cosa il pannello sta guardando. Ricaricare qui butterebbe via la
  // scelta invece di applicarla.
  function renderSequencePickerHtml() {
    var nomi = nomiDelleSequenze();
    if (nomi.length < 2) return '';
    var corrente = sequenzaInModifica();
    var opzioni = nomi.map(function (n) {
      return '<option value="' + n + '"' + (n === corrente ? ' selected' : '') + '>' + n + '</option>';
    }).join('');
    return '<label class="config-field-label" for="cfg-sequenza-scelta">quale sequenza stai modificando</label>' +
      '<select id="cfg-sequenza-scelta" data-sequence-pick="1">' + opzioni + '</select>';
  }

  // ⚠️ Modificare una sequenza che l'episodio aperto NON usa e' legittimo, e
  // va detto invece che lasciato scoprire: il riordino si salva, ma in mappa
  // non si vede niente — la mappa e' di un altro episodio. Senza questa riga
  // sembra che il pannello non abbia funzionato.
  function avvisoSequenzaAltrui() {
    var scelta = sequenzaInModifica();
    var dellEpisodio = sequenzaDellEpisodio();
    if (!scelta || scelta === dellEpisodio) return '';
    return '<p class="config-field-hint">Stai modificando <code>' + scelta + '</code>, che questo episodio non usa' +
      (dellEpisodio ? ' (usa <code>' + dellEpisodio + '</code>)' : '') +
      ': le modifiche si salvano, ma in mappa non le vedrai finché un episodio che usa questa sequenza non è quello aperto.</p>';
  }

  function renderModuleOrderField() {
    var wrap = document.createElement('div');
    wrap.className = 'config-field';
    // Il testo della spiegazione sta in CONFIG.configFieldDescriptions come
    // quello di ogni altro parametro (CLAUDE.md regola 25), non scritto qui.
    wrap.innerHTML = configFieldDescriptionHtml(['sequences']) + renderSequencePickerHtml() + avvisoSequenzaAltrui();
    var list = document.createElement('div');
    list.className = 'config-module-order-list';
    wrap.appendChild(list);
    renderModuleOrderRows(list);
    return wrap;
  }

  // Ridisegna il gruppo `sequences` per intero: serve quando cambia la
  // SCELTA, perche' cambiano anche il menu selezionato e l'avviso, non solo
  // le righe. `renderModuleOrderRows` da sola lascerebbe l'avviso vecchio.
  function ridisegnaGruppoSequenze(dentro) {
    var gruppo = dentro && dentro.closest('.config-group-body');
    if (!gruppo) return;
    gruppo.innerHTML = '';
    gruppo.appendChild(renderModuleOrderField());
  }

  // Il magazzino non sta piu' in APP_CONFIG, quindi l'enumerazione qui sotto
  // non lo vede piu': va passato a parte. Senza questo, i due gruppi
  // sparirebbero dal pannello e con loro la possibilita' di modificarli —
  // una funzione tolta di straforo da uno spostamento di dati (regola 1).
  // Un gruppo del pannello. Estratta da renderConfigPanel perche' dal
  // 2026-09-15 i gruppi non nascono piu' tutti nello stesso istante: due
  // arrivano dopo, quando il magazzino e' stato caricato.
  function renderConfigGroup(sectionKey, section) {
    var details = document.createElement('details');
    details.className = 'config-group';
    var summary = document.createElement('summary');
    summary.textContent = sectionKey;
    details.appendChild(summary);
    var body = document.createElement('div');
    body.className = 'config-group-body';
    if (sectionKey === 'episodioCorrente') {
      body.appendChild(renderEpisodeSwitchField());
    } else if (sectionKey === 'sequences') {
      body.appendChild(renderModuleOrderField());
    } else if (Array.isArray(section)) {
      body.appendChild(renderConfigJsonField([sectionKey], section));
    } else if (section !== null && typeof section === 'object') {
      renderConfigFields(body, section, [sectionKey]);
    } else {
      body.appendChild(renderConfigScalarField([sectionKey], section));
    }
    details.appendChild(body);
    return details;
  }

  function renderConfigPanel() {
    configPanelBodyEl.innerHTML = '';
    Object.keys(window.APP_CONFIG).forEach(function (sectionKey) {
      // Meta-documentation about the panel's own fields, not itself a
      // tunable parameter — never shown as its own editable group.
      if (sectionKey === 'configFieldDescriptions') return;
      configPanelBodyEl.appendChild(renderConfigGroup(sectionKey, window.APP_CONFIG[sectionKey]));
    });
  }

  // I due gruppi del magazzino, AGGIUNTI a pannello gia' aperto.
  //
  // ⚠️ SI AGGIUNGONO, NON SI RIDISEGNA TUTTO — e la prima versione faceva
  // l'errore opposto. Un `renderConfigPanel()` completo azzera il <details>
  // che l'utente aveva appena aperto: chi sta guardando un gruppo se lo vede
  // richiudere sotto le dita duecento millisecondi dopo. L'ha trovato
  // test_interruttore_episodio, che apre il gruppo e poi cerca il menu
  // dentro — un file che col magazzino non c'entra niente.
  //
  // Il pannello e' un editor SU window.APP_CONFIG: setConfigPath ci scrive e
  // persistConfigSection rilegge da li'. Il magazzino viene quindi ATTACCATO
  // li' come COPIA DI LAVORO, cosi' modifica e salvataggio restano identici a
  // prima, riga per riga. Non e' la fonte: chi legge i valori davvero
  // (resolveSlotTable) prende quello che torna da loadPersonalizationTables.
  // Il giro si chiude in localStorage — il pannello salva l'override, il
  // loader lo riapplica sopra il file al caricamento dopo.
  function aggiungiGruppiMagazzino(tables) {
    ['people', 'places'].forEach(function (k) {
      window.APP_CONFIG[k] = tables[k];
      var gia = Array.prototype.some.call(
        configPanelBodyEl.querySelectorAll('.config-group > summary'),
        function (el) { return el.textContent === k; });
      if (!gia) configPanelBodyEl.appendChild(renderConfigGroup(k, tables[k]));
    });
  }

  function clearPendingMastery() {
    BI.azzeraMasteryInSospeso();
  }

  // Il travaso. E' l'UNICO punto dell'app che scrive il magazzino della
  // mastery: se un giorno saveMastery( ricompare altrove, quel modulo ha
  // ricominciato a scrivere senza il gesto — ed e' esattamente cio' che
  // tests/test_mastery_al_gesto.js conta.
  function commitPendingMastery(episodeId, userName) {
    var chiavi = Object.keys(BI.masteryInSospeso());
    if (chiavi.length === 0) return;
    var mastery = loadMastery(episodeId, userName);
    chiavi.forEach(function (k) { mastery[k] = BI.masteryInSospeso()[k]; });
    saveMastery(episodeId, userName, mastery);
    clearPendingMastery();
  }

  function moduleStatus(episode, progress, moduleId) {
    if (progress.completed.indexOf(moduleId) !== -1) return 'completed';
    var firstIncomplete = episode.modules.find(function (m) { return progress.completed.indexOf(m.id) === -1; });
    return firstIncomplete && firstIncomplete.id === moduleId ? 'current' : 'locked';
  }

  // La coda condivisa dei SETTE pulsanti "Ho finito, torna alla mappa":
  // esito (solo per i moduli che ne hanno uno), travaso dei colori,
  // completamento, mappa. Prima erano sette copie della stessa sequenza, e
  // tre di quelle copie scrivevano l'esito con la stessa riga scritta tre
  // volte.
  //
  // `esito` assente vuol dire "questo modulo non da' un colore alla mappa"
  // (Repeat Aloud, Meet the Story, Your Story: CONFIG.moduleOutcomeRules non
  // li nomina) — non "salva senza esito". Chi chiama decide guardando
  // moduleOutcomeRules, come faceva prima.
  //
  // L'ordine conta: l'esito e le voci si scrivono PRIMA di openEpisodeMap(),
  // che passa da showView() e quindi da stopAllModuleActivity(), che azzera
  // il pending. Travaso, poi mappa — mai il contrario.
  function completeModule(module, esito) {
    if (esito) saveModuleOutcome(BI.episodioCorrente(), getUserName(), module.id, esito);
    commitPendingMastery(BI.episodioCorrente().id, getUserName());
    markModuleCompleted(BI.episodioCorrente(), getUserName(), module.id);
    openEpisodeMap();
  }

  // Pseudo-module: the Map isn't in currentEpisode.modules (it's not a
  // playable step), but the shared Help/HowItWorks machinery only needs
  // .kind (istruzioni-moduli.json lookup) and .id (help-request storage
  // key), so this small stand-in lets it reuse that as-is. Personalizza
  // used to need one too, but it's a real entry in currentEpisode.
  // modulesById now (see personalizzazioneModule below) — no duplicate
  // object for the same module.
  var MAP_PSEUDO_MODULE = { id: 'mappaEpisodio', kind: 'mappaEpisodio', label: 'Mappa dell\'episodio' };

  var STATUS_LABEL = { completed: 'Completato', current: 'Attuale', locked: 'Bloccato' };

  var STATUS_ICON = { completed: 'check', current: 'play', locked: 'lock' };

  // Outcome badge label (see MODULE OUTCOME above) — a completed module
  // with a colored outcome shows this instead of the plain "Completato",
  // regardless of which rule (ModuleRules or self-assessment) produced
  // that outcome.level. "Da riprovare" deliberately mirrors "Da
  // rivedere"'s phrasing (a next step, not a verdict) rather than
  // naming the failure outright.
  var OUTCOME_BADGE_LABEL = { giallo: 'Da rivedere', rosso: 'Da riprovare' };

  function renderModuleList() {
    var progress = loadModuleProgress(BI.episodioCorrente().id, getUserName());
    var outcomes = loadModuleOutcomes(BI.episodioCorrente().id, getUserName());
    var html = BI.episodioCorrente().modules.map(function (m) {
      var status = moduleStatus(BI.episodioCorrente(), progress, m.id);
      var clickable = status !== 'locked';
      // Optional colored outcome (see MODULE OUTCOME above) — only ever
      // set for a completed module, only ever read here; every other
      // module's row is untouched since outcomes[m.id] stays undefined.
      var outcome = status === 'completed' ? outcomes[m.id] : null;
      var outcomeLevel = outcome && outcome.level;
      var rowClass = status + (outcomeLevel ? ' outcome-' + outcomeLevel : '');
      var badgeLabel = (outcomeLevel && OUTCOME_BADGE_LABEL[outcomeLevel]) || STATUS_LABEL[status];
      // Stessa etichetta che ogni modulo mostra nella propria intestazione
      // (moduleTypeLabel): categoria e grado, "Studio · Parole". Qui era
      // ricalcolata a parte, e il grado non sarebbe comparso in mappa.
      var typeLabelText = moduleTypeLabel(m);
      var typeHtml = typeLabelText ? '<span class="module-row-type">' + typeLabelText + '</span>' : '';
      var subtitleHtml = m.subtitle ? '<span class="module-row-subtitle">' + m.subtitle + '</span>' : '';
      return '<button type="button" class="module-row ' + rowClass + '" data-module="' + m.id + '"' +
        (clickable ? '' : ' disabled') + '>' +
        '<span class="module-row-label"><span class="module-status-icon">' + icon(STATUS_ICON[status]) + '</span>' +
        '<span class="module-row-label-text"><span class="module-row-title">' + moduleNameHtml(m.label) + '</span>' + subtitleHtml + typeHtml + '</span></span>' +
        '<span class="module-state-badge">' + badgeLabel + '</span>' +
        '</button>';
    }).join('');
    document.getElementById('module-list').innerHTML = html;
  }

  function mapShowScreen(name) {
    document.getElementById('map-intro-screen').hidden = name !== 'intro';
    document.getElementById('map-main-screen').hidden = name !== 'main';
  }

  function openEpisodeMap() {
    // ⚠️ LA MAPPA ASPETTA I SUOI TESTI, dal 2026-09-21 (passo 1.3b), e prima
    // non lo faceva — era l'unica schermata con una chiave sua in
    // `istruzioni-moduli.json` (`mappaEpisodio`) che partiva senza guardarla.
    //
    // Finche' le sue stringhe stavano scritte nel markup non si vedeva. Adesso
    // arrivano dal file come quelle di ogni modulo, e una mappa disegnata
    // prima del fetch mostrerebbe pulsanti senza scritta.
    //
    // ⚠️ LA GUARDIA COSTA SOLO DOVE SERVE, e i numeri lo dicono: dei dieci
    // punti che aprono questa funzione, NOVE sono un «← Mappa» dentro un
    // modulo — e li' i testi ci sono gia' per forza, perche' un modulo non si
    // apre senza (openModuleFromMap). **Il solo che puo' arrivare a cache
    // fredda e' il pulsante di casa.** Per gli altri nove
    // `istruzioniInMemoria()` risponde subito e questa riga non fa niente.
    //
    // Se il file non arriva si va alla schermata d'errore, come per i moduli
    // (regola 35): «Riprova» rifa' la stessa strada.
    if (!BI.istruzioniInMemoria()) {
      BI.loadModuleInstructions()
        .then(function () { openEpisodeMap(); })
        .catch(function () { showLoadError(function () { openEpisodeMap(); }); });
      return;
    }
    // Un episodio senza una sequenza valida non ha passi da mostrare: senza
    // questa riga la mappa si aprirebbe VUOTA, che e' il difetto silenzioso
    // di sempre — sembra funzionare e non lo dice. Il "Riprova" rifara' la
    // stessa strada e fallira' di nuovo, ed e' onesto: e' la
    // configurazione a essere rotta, non un caricamento andato storto.
    if (BI.episodioCorrente().orderError) {
      showLoadError(function () { openEpisodeMap(); });
      return;
    }
    BI.migrateCustomizeSeenToModuleProgress(BI.episodioCorrente(), getUserName());
    document.getElementById('map-episode-badge').textContent = BI.episodioCorrente().nome;
    renderModuleList();
    leaveModule('map');
    if (isIntroDismissed('mappaEpisodio', getUserName())) {
      mapShowScreen('main');
    } else {
      document.getElementById('map-intro-dont-show-again').checked = false;
      renderIntroContent('mappaEpisodio', 'map-intro-title', 'map-intro-body', MAP_PSEUDO_MODULE.label, 'map-intro-start-btn', 'map-intro-dont-show-text');
      mapShowScreen('intro');
    }
  }

  // Job 6 (2nd collaudo): the module's own category (Studio/Quiz/ecc.) —
  // same CONFIG.moduleTypes/typeLabel lookup renderModuleList already
  // uses for the map row, reused here (not a second copy) so a module's
  // header can show it too, next to its name, not just the map.
  // "Studio · Parole": la categoria dice cosa aspettarsi, il grado su cosa si
  // sta lavorando. Un modulo senza grado (Your Story) mostra la sola
  // categoria — non c'è un "su cosa" da dire.
  // Il nome del grado attaccato a un'etichetta, col separatore condiviso.
  // Lo usano DUE composizioni diverse — la categoria di un modulo
  // (moduleTypeLabel: "Studio · Parole") e il nome di un passo nei
  // pannelli-report (stepLabel: "Voice Practice · Frasi") — e la regola
  // dell'omissione vive qui una volta sola invece che in tutte e due
  // (CLAUDE.md regola 13). Il grado è l'unica cosa che distingue due
  // apparizioni dello stesso modulo (regola 4), quindi è anche l'unica cosa
  // che può distinguerne le etichette.
  function withGradeName(testo, grade) {
    var gradeName = grade && CONFIG.gradeNames[grade];
    if (!gradeName) return testo;
    // "Studia il dialogo · Dialogo" non aggiunge niente: quando il nome del
    // grado è già contenuto in quello che precede, il grado si omette. È il
    // caso dei tre Dialogue, e non riguarda gli altri moduli.
    //
    // Il confronto è testuale e resta testuale di proposito. I NOMI dei tre
    // Dialogue sono in inglese ("Dialogue: Repeat in Time") e il grado in
    // italiano ("Dialogo"), quindi nei pannelli-report l'omissione non scatta
    // e la riga legge "Dialogue: Repeat in Time · Dialogo": un filo ridondante,
    // e va bene così. Renderlo furbo vorrebbe dire far combaciare due lingue a
    // naso — e sbaglierebbe il giorno in cui un modulo si chiama "Dialogo
    // qualcosa" ma gira su un altro grado.
    if (testo && testo.toLowerCase().indexOf(gradeName.toLowerCase()) !== -1) return testo;
    return testo ? testo + CONFIG.gradeSeparator + gradeName : gradeName;
  }

  function moduleTypeLabel(module) {
    var typeInfo = CONFIG.moduleTypes[module.type];
    var category = module.typeLabel || (typeInfo && typeInfo.label) || '';
    return withGradeName(category, module.grade);
  }

  // Fills a title/body pair from istruzioni-moduli.json's howItWorks entry
  // for the given kind — one shared loader for every module's intro
  // screen instead of a copy per module. moduleLabel is the module's own
  // name (row 2, shown immediately — the JSON's own title, once loaded,
  // is preferred if it differs, but every caller's own label is already
  // correct so this only ever matters as the pre-load placeholder).
  // ⚠️ L'ATTESA COPRE TUTTO QUELLO CHE LA SCHERMATA MOSTRA, non solo il corpo.
  //
  // Fino al passo 18 questa funzione scriveva "Caricamento..." nel corpo e
  // basta: la casella "Non mostrarmi più questa schermata" e il pulsante
  // "Ho capito, inizia" erano markup statico accanto, quindi si vedevano
  // subito. Portandoli nel file (regola 8) sarebbero rimasti **vuoti accanto
  // a un «Caricamento...» che parlava solo del corpo** — due etichette mute
  // sotto un messaggio che non le riguardava. Peggio che non spostarle.
  //
  // Ora il messaggio di attesa vale per l'intera schermata: il pulsante
  // resta **disabilitato** finché non c'è tutto, e prende la sua etichetta
  // insieme al corpo. Un pulsante senza etichetta si può ancora premere; uno
  // disabilitato dice da solo che non è il momento.
  //
  // ⚠️ GLI ID SI PASSANO, NON SI RICAVANO DAL NOME, e la ragione è misurata:
  // otto blocchi su nove seguono `<prefisso>-intro-*`, ma i tre di Match /
  // Dialogo / Speed Match usano `<prefisso>-start-*`, e il pulsante di Speed
  // Match si chiama **`sr-ready-btn`**. Una derivazione dalla stringa
  // funzionerebbe su otto casi su nove — cioè abbastanza da sembrare giusta
  // e da rompersi su quello che non si guarda.
  function renderIntroContent(kind, titleElId, bodyElId, moduleLabel, startBtnId, dontShowTextId) {
    var titleEl = document.getElementById(titleElId);
    var startBtn = startBtnId ? document.getElementById(startBtnId) : null;
    var dontShowEl = dontShowTextId ? document.getElementById(dontShowTextId) : null;
    renderSpiegazioneTitle(titleEl, moduleLabel);
    document.getElementById(bodyElId).innerHTML = '<p class="module-status-text">Caricamento...</p>';
    if (startBtn) { startBtn.disabled = true; startBtn.textContent = ''; }
    if (dontShowEl) dontShowEl.textContent = '';
    loadModuleInstructions().then(function (data) {
      var entry = data[kind] && data[kind].howItWorks;
      renderSpiegazioneTitle(titleEl, (entry && entry.title) || moduleLabel);
      document.getElementById(bodyElId).innerHTML = entry
        ? entry.body
        : '<p>Contenuto non ancora disponibile per questo modulo.</p>';
      if (startBtn) { startBtn.textContent = uiText('condivisi.introStart'); startBtn.disabled = false; }
      if (dontShowEl) dontShowEl.textContent = uiText('condivisi.introDontShowAgain');
    }).catch(function () {
      document.getElementById(bodyElId).innerHTML = loadErrorInlineHtml('');
      // Il pulsante resta SPENTO: se la spiegazione non è arrivata, "Ho
      // capito" non è una cosa che lo studente possa dire.
    });
  }  configPanelBodyEl.addEventListener('click', function (e) {
    var order = ordineInModifica();
    if (!order) return;
    var list = null;

    var onOffBtn = e.target.closest('[data-order-onoff]');
    if (onOffBtn) {
      var offPair = order[Number(onOffBtn.getAttribute('data-order-onoff'))];
      if (!offPair) return;
      if (offPair.off) delete offPair.off; else offPair.off = true;
      persistConfigSection('sequences');
      renderModuleOrderRows(onOffBtn.closest('.config-module-order-list'));
      return;
    }

    var gradeBtn = e.target.closest('[data-order-grade]');
    if (gradeBtn) {
      var pair = order[Number(gradeBtn.getAttribute('data-order-grade'))];
      if (!pair) return;
      pair.grade = nextGrade(pair.grade);
      list = gradeBtn.closest('.config-module-order-list');
    } else {
      var btn = e.target.closest('[data-order-move]');
      if (!btn) return;
      var index = Number(btn.getAttribute('data-order-index'));
      var dir = btn.getAttribute('data-order-move');
      var swapWith = dir === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= order.length) return;
      var tmp = order[index]; order[index] = order[swapWith]; order[swapWith] = tmp;
      list = btn.closest('.config-module-order-list');
    }

    persistConfigSection('sequences');
    renderModuleOrderRows(list);
  });

  configPanelBodyEl.addEventListener('change', function (e) {
    var target = e.target;

    // Il menu «quale sequenza sto modificando» NON e' un campo di
    // configurazione e non porta `data-config-path`: cambia cosa il pannello
    // guarda, non un valore dell'app. Se lo portasse, il listener qui sotto
    // gli scriverebbe una chiave dentro APP_CONFIG.
    if (target.hasAttribute('data-sequence-pick')) {
      sequenzaScelta = target.value;
      ridisegnaGruppoSequenze(target);
      return;
    }

    var pathAttr = target.getAttribute('data-config-path');
    if (!pathAttr) return;
    var path = pathAttr.split('.');
    var errorEl = target.parentElement.querySelector('.config-field-error');

    if (target.hasAttribute('data-config-json')) {
      try {
        var parsed = JSON.parse(target.value);
        if (errorEl) errorEl.hidden = true;
        setConfigPath(path, parsed);
        persistConfigSection(path[0]);
      } catch (err) {
        if (errorEl) { errorEl.hidden = false; errorEl.textContent = 'JSON non valido: ' + err.message; }
      }
      return;
    }

    var value;
    if (target.type === 'checkbox') value = target.checked;
    else if (target.type === 'number') value = target.value === '' ? 0 : Number(target.value);
    else value = target.value;

    setConfigPath(path, value);
    persistConfigSection(path[0]);
    // Un parametro che si legge solo all'avvio non cambia niente finche' la
    // pagina non riparte: senza questo, il menu dell'episodio si muoverebbe
    // e a schermo resterebbe l'episodio di prima — una manopola che sembra
    // aver fatto qualcosa e non l'ha fatto.
    if (target.hasAttribute('data-config-reload')) window.location.reload();
  });

  // ⚠️ CHI POSSIEDE IL PANNELLO SA SE E' APERTO. Stessa forma di
  // `chiudiOverlayAperti` in ui-condivisa, e nata dallo stesso rosso: il
  // listener di Escape resta in index.html perche' chiude overlay di DUE
  // proprietari, e leggeva `configPanelOverlayEl`, che con l'estrazione e'
  // finito qui. Si chiede allo strato di chiudere il proprio, non gli si
  // guarda il nodo.
  function chiudiPannelloSeAperto() {
    if (configPanelOverlayEl.classList.contains('is-open')) closeConfigPanel();
  }

  BI.chiudiPannelloSeAperto = chiudiPannelloSeAperto;

  // ⚠️ RIMASTA INDIETRO IN `index.html` FINO AL 2026-09-20, E IL PANNELLO
  // ADMIN MORIVA — su Pages, non in un test.
  //
  // Le tre etichette le legge SOLO la funzione qui sotto, ma la riga
  // `var STORY_CARDS_ANSWER_LABEL = {...}` e' rimasta nell'IIFE di
  // `index.html` quando la funzione e' uscita: due IIFE diversi, quindi il
  // nome qui dentro non esiste. `openConfigPanel()` alzava
  // `STORY_CARDS_ANSWER_LABEL is not defined` e il pannello **non si apriva
  // piu'** — l'unico modo per cambiare la configurazione a caldo.
  //
  // ⚠️ E NON SI VEDEVA, perche' il guasto ha una CONDIZIONE: la riga che la
  // legge gira solo per una battuta che ha una risposta (`s.corrente`). Su un
  // profilo nuovo `byLine` e' vuoto, il ciclo non parte, e il pannello si apre
  // benissimo. **Le cinque asserzioni che aprivano il pannello lo facevano
  // tutte da profilo nuovo** — il caso comodo della regola 42. Bastava
  // rispondere una volta a «Hai capito la spiegazione?» per romperlo, ed e'
  // quello che fa il collaudo.
  //
  // *Stessa famiglia di `activeHelpModule` (2026-09-19) e di `staParlando` in
  // Flash Card: un nome lasciato indietro, `is not defined`, in una strada che
  // nessun test percorreva.* Il blocco [D] di `tests/test_config_estratto.js`
  // adesso la percorre.
  var STORY_CARDS_ANSWER_LABEL = { chiara: 'chiara', nonAncora: 'non ancora', nonChiara: 'non chiara' };

  function renderStoryCardsExplanationStatsPanel() {
    var el = document.getElementById('config-story-cards-explanation-stats');
    if (!el) return;
    if (riquadroSenzaEpisodio(el)) return;
    var stats = loadStoryCardsExplanationStats(BI.episodioCorrente().id, getUserName());
    var lineIds = Object.keys(stats.byLine);
    var rowsHtml = lineIds.map(function (id) {
      var s = stats.byLine[id];
      var corrente = s.corrente ? STORY_CARDS_ANSWER_LABEL[s.corrente] : '—';
      var cambi = s.cambi ? ' · cambiata ' + s.cambi + (s.cambi === 1 ? ' volta' : ' volte') : '';
      return '<div class="config-audio-usage-row"><span>' + id + '</span><span>' + corrente + cambi + '</span></div>';
    }).join('');
    // I due segnali sono diversi e si leggono diversamente, quindi si dicono
    // diversamente: la riga dice DOVE sta ognuno adesso, il totale quanti ci
    // stanno. E i due numeri non si sommano fra loro — uno conta persone,
    // l'altro ripensamenti.
    var tot = { chiara: 0, nonAncora: 0, nonChiara: 0, cambi: 0 };
    lineIds.forEach(function (id) {
      var s = stats.byLine[id];
      ['chiara', 'nonAncora', 'nonChiara'].forEach(function (k) { tot[k] += (s[k] || 0); });
      tot.cambi += (s.cambi || 0);
    });
    el.innerHTML =
      '<p class="config-field-hint">Utente corrente (' + getUserName() + '), episodio ' + BI.episodioCorrente().id +
      '. Ogni battuta tiene la risposta <strong>corrente</strong>: cambiare idea sposta il voto, non ne aggiunge uno. ' +
      'Una battuta ferma su "non chiara" segnala una spiegazione da riscrivere; una <strong>cambiata pi\u00f9 volte</strong> ' +
      'segnala una spiegazione <strong>ambigua</strong>, che \u00e8 un difetto diverso. ' +
      'Oggi i profili sono uno, quindi i totali per risposta valgono quante battute ci stanno sopra.</p>' +
      (rowsHtml || '<p class="config-field-hint">Nessuna risposta finora.</p>') +
      '<div class="config-audio-usage-row config-audio-usage-total"><span>chiara · non ancora · non chiara</span><span>' +
      tot.chiara + ' · ' + tot.nonAncora + ' · ' + tot.nonChiara + '</span></div>' +
      '<div class="config-audio-usage-row config-audio-usage-total"><span>ripensamenti in tutto</span><span>' + tot.cambi + '</span></div>';
  }

  function setConfigPath(path, value) {
    var obj = window.APP_CONFIG;
    for (var i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[path.length - 1]] = value;
  }

  function persistConfigSection(sectionKey) {
    var overrides = {};
    overrides = BI.magLeggiJson(CONFIG_OVERRIDES_KEY, function () { return {}; });
    overrides[sectionKey] = window.APP_CONFIG[sectionKey];
    BI.magScriviJson(CONFIG_OVERRIDES_KEY, overrides);
  }

  // Il grado successivo nel giro CONFIG.grades (A → B → C → D → A). Un
  // solo tocco cambia grado: niente menu a tendina né finestre, così la
  // vista resta veloce da usare quando si prova un ordine diverso.
  function nextGrade(grade) {
    var grades = CONFIG.grades;
    var i = grades.indexOf(grade);
    return grades[(i + 1) % grades.length];
  }

  // ⚠️ I DUE PULSANTI DELLA SCHERMATA D'ERRORE SONO VENUTI COL FILE, e non per
  // simmetria: «Riprova» legge `loadErrorRetry`, che e' qui dentro. Lasciandoli
  // in index.html il pulsante non faceva niente — **senza un errore in
  // console**, perche' il guasto era dentro un listener e non al caricamento.
  // Il rosso l'ha trovato test_errore_caricamento guidando l'app, non una
  // verifica strutturale.
  document.getElementById('load-error-retry').addEventListener('click', function () {
    var riprova = loadErrorRetry;
    loadErrorRetry = null;
    if (riprova) riprova();
  });

  document.getElementById('load-error-back').addEventListener('click', function () {
    openEpisodeMap();
  });

  BI.openEpisodeMap = openEpisodeMap;
  BI.completeModule = completeModule;
  // ============================================================
  // LE PORTE DEL PANNELLO ADMIN — arrivate qui il 2026-09-20, passo ①.
  //
  // Il pannello e' in questo file da giorni; le sue PORTE erano rimaste in
  // `index.html`: la sequenza `config` da tastiera, l'indirizzo `?config`, i
  // due modi di chiuderlo e il pulsante che azzera gli override.
  //
  // ⚠️ E NON E' STATO FATTO UN `app/pannello-admin.js`, ED ERA IL PIANO
  // DICHIARATO. La misura l'ha cambiato: un file con quel nome avrebbe avuto
  // dentro **le maniglie di una porta che sta in un altro file** — e chi
  // cercasse il pannello lo cercherebbe li'. *Un nome che promette una cosa e
  // ne contiene un'altra costa piu' delle righe che fa risparmiare.*
  //
  // ⚠️ `isEditableTarget` viene con loro perche' ha un lettore solo, ed e'
  // quello qui sotto: serve a non aprire il pannello mentre si scrive il
  // proprio nome in un campo di testo.
  // ============================================================
  /* ============================================================
     HIDDEN: DEV CONFIG PANEL (CLAUDE.md, embrione del pannello Admin)
     Legge/scrive window.APP_CONFIG dal vivo. Si apre digitando "config"
     fuori da un campo di testo (nessuna UI scopribile per caso). Ogni
     modifica muta window.APP_CONFIG IN PLACE (mai una riassegnazione:
     CONFIG, nel secondo <script>, è un riferimento allo stesso oggetto,
     e tutto quel che l'ha già letto dipende da quel riferimento) e viene
     salvata in localStorage per sopravvivere al reload, sostituendo per
     intero la sezione di primo livello toccata. ============================ */
  // La chiave vive in app/avvio.js, che e' chi applica gli override PRIMA di
  // tutto il resto. Qui se ne prende il nome: un posto solo, dichiarativo.
  var CONFIG_OVERRIDES_KEY = BI.CONFIG_OVERRIDES_KEY;

  function isEditableTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  var configRevealBuffer = '';
  document.addEventListener('keydown', function (e) {
    if (isEditableTarget(e.target)) return;
    if (e.key.length !== 1) return;
    configRevealBuffer = (configRevealBuffer + e.key).slice(-6);
    if (configRevealBuffer.toLowerCase() === 'config') openConfigPanel();
  });

  // ⚠️ I TESTI ITALIANI DEI PANNELLI QUI SOTTO RESTANO NEL CODICE, DI
  // PROPOSITO — non sono una dimenticanza del passo 18.
  //
  // La regola 8 parla dei testi che legge LO STUDENTE. Il Pannello Admin non
  // lo vede: si apre digitando "config" fuori da un campo di testo, e serve a
  // chi guida il progetto. Una seconda edizione (inglese per tedeschi) non lo
  // traduce, quindi metterlo in data/{lingua}/ lo legherebbe a una lingua per
  // cui non e' scritto.
  //
  // Sta scritto qui e non solo in decisioni-stato.md perche' senza questa riga sono
  // indistinguibili dalle altre: chi passa col passo 18 in mano le sposta, e
  // avrebbe ragione a farlo.




  // ---- `STORY_CARDS_ANSWER_LABEL` E' IN app/mappa.js DAL 2026-09-20 ----
  // Era rimasta qui quando la sua unica lettrice e' uscita, e il Pannello
  // Admin moriva con `is not defined`. Il motivo per cui non si vedeva sta
  // accanto alla riga, nel file nuovo.



  document.getElementById('config-panel-close-btn').addEventListener('click', closeConfigPanel);
  document.getElementById('config-panel-backdrop').addEventListener('click', closeConfigPanel);

  // ---- LA SECONDA PORTA, `?config`, E' DENTRO `boot()` ----
  //
  // ⚠️ E CI E' FINITA PER UN ROSSO, NON PER ELEGANZA. Qui c'era
  // `setTimeout(openConfigPanel, 0)`, col suo commento che spiegava perche'
  // funzionava: «un timeout a 0 ms scatta quando QUESTO script ha finito, e
  // a quel punto l'app e' in piedi». Era vero finche' «questo script» voleva
  // dire l'IIFE di `index.html`, **l'ultimo di tutti**.
  //
  // Portando le porte qui dentro (passo ①, 2026-09-20) «questo script» e'
  // diventato `app/mappa.js`, che finisce molto PRIMA che `index.html`
  // assegni l'episodio corrente. Il timeout scattava fra un tag e l'altro e
  // `openConfigPanel` trovava `BI.episodioCorrente()` a `null`:
  // **`Cannot read properties of null (reading 'id')`**, pannello chiuso,
  // quattro file di test rossi.
  //
  // *Il commento vecchio non era sbagliato: era vero per una premessa che lo
  // spostamento ha cambiato sotto. E' la ⓪-quinquies — un commento giusto che
  // smette di esserlo perche' cambia il mondo intorno, non il codice che
  // descrive — e stavolta l'ha cambiato il mio commit.*
  //
  // La riga adesso sta in fondo a `boot()`, dove «l'app e' in piedi» non e'
  // una stima sul momento in cui scatta un timer: e' il punto in cui e'
  // appena successo.





















  // Il punto unico del ripristino: due pulsanti, una riga. Quello del pannello
  // e quello della schermata d'errore fanno la stessa identica cosa, e la
  // fanno con lo stesso codice (regola 13).
  function ripristinaValoriDiPartenza() {
    BI.magCancella(CONFIG_OVERRIDES_KEY);
    location.reload();
  }
  document.getElementById('config-panel-reset-btn').addEventListener('click', ripristinaValoriDiPartenza);
  var loadErrorResetEl = document.getElementById('load-error-reset');
  if (loadErrorResetEl) loadErrorResetEl.addEventListener('click', ripristinaValoriDiPartenza);

  BI.openConfigPanel = openConfigPanel;
  BI.closeConfigPanel = closeConfigPanel;
  BI.renderConfigPanel = renderConfigPanel;
  BI.goHome = goHome;
  BI.boot = boot;
  BI.leaveModule = leaveModule;
  BI.showLoadError = showLoadError;
  BI.stopAllModuleActivity = stopAllModuleActivity;
  BI.renderIntroContent = renderIntroContent;
  BI.mapShowScreen = mapShowScreen;
  BI.moduleStatus = moduleStatus;
  BI.moduleTypeLabel = moduleTypeLabel;
  BI.withGradeName = withGradeName;
  BI.stepLabel = stepLabel;
  BI.MAP_PSEUDO_MODULE = MAP_PSEUDO_MODULE;
  BI.clearPendingMastery = clearPendingMastery;
  BI.commitPendingMastery = commitPendingMastery;
  BI.renderLoadErrorTexts = renderLoadErrorTexts;
})(window.BI);
