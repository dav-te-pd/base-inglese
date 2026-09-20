// DIPENDE DA: audio.js [parsing], dati.js [parsing], identita.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], sessione.js [chiamata], suoni.js [parsing]
// ⚠️ A TEMPO DI PARSING, quindi l'ordine dei tag e' un vincolo VERO: i quattro
// alias in cima all'IIFE (`istruzioniInMemoria`, `loadModuleInstructions`,
// `loadFeedbackMessages`, `percentageBucket`) si prendono il valore mentre
// questo file viene letto. E' la prima dipendenza a tempo di parsing del
// progetto: le tre precedenti erano tutte a tempo di chiamata.
//
// ⚠️ E LA PRIMA RIGA CHE HO SCRITTO QUI DICEVA «nessuno», ED ERA FALSA. Il
// guasto non l'ha trovato nessuna verifica strutturale — le ha passate tutte —
// ma la riga che GUIDA L'APP: `uiText()` moriva con `istruzioniInMemoria is not
// defined`. *Una dichiarazione si puo' sbagliare come qualunque altra riga; e'
// il confronto col codice che la tiene vera, non il fatto di averla scritta.*
//
// ⚠️ MA IL SUO TAG STA NELLA SECONDA FILA, in fondo a <body>, come
// app/orchestrazione.js e per la stessa ragione: `helpOverlayEl` e
// `howItWorksOverlayEl` prendono il loro nodo con getElementById **a tempo di
// parsing**, e quattro addEventListener si agganciano al markup mentre il file
// viene letto. In <head> i due nodi sarebbero `null` e i quattro listener non
// esisterebbero — e la seconda meta' non darebbe nessun errore: gli overlay
// semplicemente non si chiuderebbero piu'.
//
// La domanda che decide la fila e' sempre quella: **questo file tocca il
// markup mentre viene letto?** Qui si'.

// LO STRATO `ui-condivisa` — L'INTERFACCIA CHE UN MODULO INDOSSA
// E CHE NON SA QUALE MODULO SIA.
//
// Il titolo, i due overlay, il sottotitolo d'esito, le stelle, i pulsanti di
// velocita', i testi letti dal file delle istruzioni. Nessuno di questi pezzi
// sa se sopra c'e' Repeat Aloud o Speed Match, e nessuno tocca lo stato di
// sessione: e' esattamente la linea dove l'insieme CHIUDE.
//
// Il criterio non l'ho scelto, l'ha scelto la misura: partendo da dieci pezzi
// e chiudendo per iterazione, l'insieme si ferma a 29 con **zero** dipendenze
// che non siano gia' fuori.
//
// ⚠️ TRE CONFINI RESPINTI, E DUE CORREGGONO UNA MIA ASSEGNAZIONE PRECEDENTE.
//
// ① `itemText` NON entra, benche' io l'avessi mandata qui io stesso. E' una
//    riga sola — `fillTemplate(..., currentEpisode, currentValues, lang)` — e
//    quella riga LEGA I DUE GLOBALI DI SESSIONE. Aggiungendola, l'insieme
//    smette di chiudere: 30 pezzi e 2 bloccanti per otto giri. `fillTemplate`
//    invece entra pulita, perche' episodio e valori li prende come PARAMETRI.
//    *La differenza fra le due e' tutta li': una li riceve, l'altra li va a
//    prendere.*
//
// ② `slotOptions`, `slotField`, `slotDefault`, `resolveSlotValue` entrano QUI e
//    non in Personalizza, dove li avevo messi il giorno prima: `fillTemplate`
//    li chiama per risolvere un segnaposto, e `fillTemplate` serve a quattro
//    moduli. Se stessero con Personalizza, gli altri quattro dovrebbero
//    chiedere a lei come si scrive una frase.
//
// ③ `buildMultipleChoiceOptions` e `recordMultipleChoiceResult` restano fuori
//    benche' due regioni-modulo li condividano: il primo chiama `itemText`, il
//    secondo `recordPendingMastery`, che scrive nel magazzino della mastery
//    della sessione corrente. Escono quando esce lo stato di sessione.
//
// ⚠️ E IL LISTENER DI ESCAPE NON E' QUI, ED E' VOLUTO. Chiude TRE overlay: i
// due di questo file e quello del Pannello Admin. Non appartiene a nessuno dei
// due posti da solo, quindi resta in index.html e chiama `BI.closeOverlay()` e
// `BI.closeHowItWorksOverlay()`. Portarlo qui vorrebbe dire che questo file
// nomina il Pannello Admin — cioe' scambiare «sta vicino» con «e' suo», che e'
// l'errore che questa serie corregge da dieci confini.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  // ⚠️ I QUATTRO NOMI CHE VENGONO DA ALTRI STRATI, e la riga DIPENDE DA in
  // testa li dichiara. Sono alias PRESI A TEMPO DI PARSING, quindi l'ordine
  // dei tag qui e' un vincolo vero: `app/dati.js` e `app/quiz-engine.js`
  // devono essere gia' letti. Lo sono — stanno in <head>, questo sta nella
  // seconda fila — ma il vincolo esiste e va scritto, non dedotto.
  //
  // ⚠️ E TUTTI E QUATTRO SONO FUNZIONI, non valori: `istruzioniInMemoria` in
  // particolare ESISTE perche' un alias su una variabile che cambia congela il
  // suo valore iniziale (il caso che il 2026-09-18 ha fatto sette file rossi).
  // Aliasare la funzione e' corretto; aliasare la cache non lo sarebbe.
  var istruzioniInMemoria = BI.istruzioniInMemoria;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadFeedbackMessages = BI.loadFeedbackMessages;
  var percentageBucket = BI.percentageBucket;

  // ⚠️ I DUE DEL BLOCCO ASCOLTO, E LA RIGA CHE AVEVO SCRITTO QUI ERA FALSA.
  //
  // Avevo scritto «sono a tempo di CHIAMATA, perché servono quando un pulsante
  // si disegna o si tocca». È vero di **dove vengono usati** e falso di **come
  // arrivano**: un alias in cima all'IIFE si prende il valore mentre il file
  // viene letto, quindi la dipendenza è a tempo di **parsing**, punto. L'ha
  // detto `tests/test_dipendenze_dichiarate.js`, che misura invece di credere.
  //
  // *Non l'ho «corretta» allargando la dichiarazione: la misura aveva ragione e
  // la frase no.* Il vincolo reale c'è già ed è soddisfatto — `identita.js` e
  // `audio.js` stanno in <head>, questo file nella seconda fila.
  var icon = BI.icon;
  var toggleSpeak = BI.toggleSpeak;
  var getUserName = BI.getUserName;
  // ⚠️ Serve al modulo di richiesta d'aiuto, arrivato col passo ① il 2026-09-20.
  // Mancava, e il modulo si inviava con `saveHelpRequest is not defined`: la
  // conferma NON compariva e la richiesta non veniva salvata. Trovato
  // guidandolo, non rileggendolo — `tests/tools/buchi.js` non poteva vederlo
  // perche' guarda un file per volta e il nome era appena arrivato.
  var saveHelpRequest = BI.saveHelpRequest;
  // ⚠️ Serve a `renderSummaryScreen`, arrivata col passo ② (2026-09-20): e' il
  // punto unico che attacca il suono di uscita al pulsante «Ho finito» di OGNI
  // modulo. Senza questo alias le quattordici chiamate di montaggio, che
  // girano a tempo di PARSING, morivano alla prima — quindi **nessuna
  // Schermata Finale veniva costruita**, e l'app arrivava alla mappa senza che
  // nessun errore lo dicesse a schermo. Misurato guidandola.
  var sfxPlayExitSound = BI.sfxPlayExitSound;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;

  // Job 4 (second collaudo): the FIRST retry pass and the LAST one (the
  // one right before the module actually finishes — CONFIG.retryQueue.
  // maxAttempts forces a stubborn item through after that, so there's
  // never a third) read from two DIFFERENT pools, each with its own 5
  // title variants and 5 text variants — so back-to-back passes never
  // look like the exact same screen stuck in a loop. isLastPass is the
  // caller's own call (see each module's retry-pass counter, e.g.
  // srRetryPassCount) — this function only ever picks and displays.
  function applyRetryIntroContent(screenId, isLastPass) {
    loadFeedbackMessages().then(function (data) {
      var pool = data.retryIntroMessages && data.retryIntroMessages[isLastPass ? 'last' : 'first'];
      if (!pool) return;
      document.getElementById(screenId + '-title').textContent = pickRandom(pool.titles);
      document.getElementById(screenId + '-text').textContent = pickRandom(pool.bodies);
    }).catch(function () {});
  }

  // Same as applyRotatingSubtitle above, but the pool is keyed by outcome
  // (bucketKey — e.g. 'alto'/'medio'/'basso' or 'siLoSo'/'nonAncora')
  // instead of being one flat list — the Schermata Finale message (job 2)
  // says something different depending on how the exercise actually went.
  function applyOutcomeSubtitle(elId, listKey, bucketKey) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.textContent = '';
    loadFeedbackMessages().then(function (data) {
      var group = data[listKey] && data[listKey][bucketKey];
      if (group && group.length) el.textContent = pickRandom(group);
    }).catch(function () {});
  }

  // ModuleRules (see CONFIG.moduleOutcomeRules) — the shared verde/
  // giallo/rosso map-badge color for an evaluated module's FIRST-PASS
  // score. Reuses percentageBucket()'s own alto/medio/basso split
  // instead of a second copy of the same threshold comparison; only the
  // bucket-name-to-color mapping is new. A module wires itself into
  // this by declaring itself in CONFIG.moduleOutcomeRules and calling
  // this + saveModuleOutcome() at its own completion (see Voice Coach's
  // voice-coach-complete-btn handler for the reference wiring) — the
  // color math itself never needs to move.
  var MODULE_RULES_LEVEL = { alto: 'verde', medio: 'giallo', basso: 'rosso' };

  function moduleRulesLevel(pct) {
    return MODULE_RULES_LEVEL[percentageBucket(pct)];
  }

  // LA FRASE DI ULTIMA ISTANZA — l'UNICA eccezione ammessa alla regola 8
  // (i testi dello studente stanno in data/{lingua}/istruzioni-moduli.json),
  // e sta qui col motivo accanto come chiede la regola 35: un messaggio che
  // segnala il fallimento di un meccanismo non puo' dipendere da quel
  // meccanismo. Se il file che non si carica e' proprio istruzioni-moduli
  // .json, un testo preso da li' non arriverebbe mai, e la schermata
  // d'errore resterebbe muta esattamente nel caso che la giustifica.
  // Non e' un valore da regolare (regola 3): e' l'ultima rete, non una
  // manopola.
  var LOAD_ERROR_LAST_RESORT = {
    title: 'Non riusciamo a caricare il contenuto',
    body: '<p>Qualcosa non ha funzionato nel recupero dei dati. Controlla la connessione e riprova.</p>',
    retryLabel: 'Riprova',
    backLabel: 'Torna alla mappa',
    // Per i punti NON bloccanti (Spiegazione, Help, l'intro di un modulo):
    // l'esercizio si puo' fare lo stesso, e il messaggio deve dirlo.
    inlineText: 'Non riusciamo a caricare questo testo. Puoi continuare lo stesso.'
  };

  // Il messaggio dei punti NON bloccanti. Usa sempre la frase di ultima
  // istanza, e non e' una scorciatoia: questi tre punti falliscono SOLO
  // quando a non caricarsi e' istruzioni-moduli.json, cioe' proprio il file
  // da cui verrebbe il testo. E' la regola 35 applicata due volte.
  function loadErrorInlineHtml(extraClass) {
    return '<p class="' + (extraClass ? extraClass + ' ' : '') + 'is-notice">' +
      LOAD_ERROR_LAST_RESORT.inlineText + '</p>';
  }

  // ⚠️ SI CHIEDE CON UNA FUNZIONE, NON CON UN ALIAS, e la ragione è la stessa
  // che il 2026-09-18 ha fatto sette file rossi: `activeHelpModule` viene
  // RIASSEGNATA (in `openHelpFor`), e un alias ne copia il valore del momento
  // — cioè `null`, per sempre. `verificaStruttura` vieta apposta l'alias su un
  // nome riassegnato.
  var activeHelpModule = null;

  function moduloDiAiutoAttivo() {
    return activeHelpModule;
  }

  var helpOverlayEl = document.getElementById('help-overlay');

  function openOverlay() { helpOverlayEl.classList.add('is-open'); }

  function closeOverlay() { helpOverlayEl.classList.remove('is-open'); }

  document.getElementById('help-overlay-close').addEventListener('click', closeOverlay);

  document.getElementById('help-overlay-backdrop').addEventListener('click', closeOverlay);

  // Simple "Spiegazione" popup (see markup comment) — generic by
  // module.kind, only Repeat Aloud's watch button calls it today.
  // Optional options.dismissPref = { get(), set(bool) } wires up the
  // "don't show again" checkbox against whatever persistent preference
  // the caller owns (Repeat Aloud passes its existing one — same flag
  // the full-screen auto-show reads, not a second one); omitted entirely
  // for modules that don't have that concept yet, hiding the checkbox.
  var howItWorksOverlayEl = document.getElementById('howitworks-overlay');

  function openHowItWorksOverlay(module, options) {
    options = options || {};
    // placeholderTitle covers the brief moment before loadModuleInstructions
    // resolves, and the fallback if this module has no entry at all —
    // every caller already knows its own module.label, so this is only
    // ever an explicit override for the rare case that differs.
    var placeholderTitle = options.placeholderTitle || module.label || '';
    var titleEl = document.getElementById('howitworks-overlay-title');
    renderSpiegazioneTitle(titleEl, placeholderTitle);
    document.getElementById('howitworks-overlay-body').innerHTML = '<p class="module-status-text">Caricamento...</p>';
    howItWorksOverlayEl.classList.add('is-open');

    var checkboxRow = document.getElementById('howitworks-overlay-checkbox-row');
    var checkbox = document.getElementById('howitworks-overlay-dont-show-again');
    // La stessa etichetta condivisa delle nove schermate di intro: qui la
    // cache e' gia' calda (l'overlay si apre da dentro un modulo), quindi si
    // legge con uiText invece di aspettare il .then come fa il corpo.
    document.getElementById('howitworks-overlay-dont-show-text').textContent =
      uiText('condivisi.introDontShowAgain');
    if (options.dismissPref) {
      checkboxRow.hidden = false;
      checkbox.checked = options.dismissPref.get();
      checkbox.onchange = function () { options.dismissPref.set(checkbox.checked); };
    } else {
      checkboxRow.hidden = true;
      checkbox.onchange = null;
    }

    loadModuleInstructions().then(function (data) {
      var entry = data[module.kind] && data[module.kind].howItWorks;
      renderSpiegazioneTitle(titleEl, (entry && entry.title) || placeholderTitle);
      document.getElementById('howitworks-overlay-body').innerHTML = entry
        ? entry.body
        : '<p>Contenuto non ancora disponibile per questo modulo.</p>';
    }).catch(function () {
      document.getElementById('howitworks-overlay-body').innerHTML = loadErrorInlineHtml('');
    });
  }

  function closeHowItWorksOverlay() { howItWorksOverlayEl.classList.remove('is-open'); }

  document.getElementById('howitworks-overlay-close-btn').addEventListener('click', closeHowItWorksOverlay);

  document.getElementById('howitworks-overlay-backdrop').addEventListener('click', closeHowItWorksOverlay);

  // UN TESTO DELL'INTERFACCIA, letto dalla cache SENZA aspettare.
  //
  // I testi che lo studente legge stanno in istruzioni-moduli.json (regola 8),
  // ma molti vengono scritti da funzioni SINCRONE — setVcState cambia la
  // didascalia del microfono mentre registri, vcUpdateMicNotice alza l'avviso
  // fra un tentativo e l'altro. Quelle non possono aspettare un fetch: se
  // aspettassero, l'etichetta cambierebbe un frame dopo il gesto.
  //
  // ⚠️ FUNZIONA PERCHE' LA CACHE E' GIA' CALDA, e la garanzia sta in UNA
  // RIGA SOLA: loadModuleInstructions() dentro il Promise.all di
  // openModuleFromMap, il punto unico da cui passano tutti e sedici i moduli
  // (protetto da test_modulo_pronto.js). Se quella riga sparisce, uiText()
  // torna stringhe vuote e l'interfaccia si svuota.
  //
  // ⚠️ E IL MOTIVO PER CUI QUESTA FRASE E' SCRITTA COSI': la prima versione
  // diceva «funziona perche' openModuleFromMap fa gia' Promise.all([
  // loadEpisodeData, loadModuleInstructions])». **Non lo faceva** — aspettava
  // ensureEpisodeSlotFields e loadEpisodeData, non i testi. Era una
  // motivazione falsa scritta accanto a codice giusto, cioe' la cosa peggiore
  // da lasciare in giro: chi la legge smette di controllare. Trovata
  // GUIDANDO L'APP (il Blocco Ascolto e la didascalia del microfono uscivano
  // vuoti), non rileggendo.
  //
  // Chiamare uiText() da un punto che NON sta dentro un modulo aperto e' il
  // solo modo di romperla — e li' si usa loadModuleInstructions().then().
  //
  // Il secondo argomento e' la frase di ULTIMA ISTANZA: serve solo se la
  // chiave manca da un file che si e' caricato (regola 35), e non e' una
  // copia da tenere allineata — e' la prova che qualcosa nel file e' rotto.
  // ⚠️ Un fallback che ripete il testo vero DIVERGE in silenzio: e' successo
  // a requestBoxDuplicateWarning, dove la copia nel codice aveva perso mezza
  // frase e nessuno poteva accorgersene.
  function uiText(percorso, ultimaIstanza) {
    var nodo = istruzioniInMemoria();
    var pezzi = percorso.split('.');
    for (var i = 0; i < pezzi.length && nodo; i++) nodo = nodo[pezzi[i]];
    return (typeof nodo === 'string' && nodo) ? nodo : (ultimaIstanza || '');
  }

  // Lo stesso testo con i segnaposto {nome} sostituiti. Separata da uiText
  // perche' la maggior parte dei testi non ne ha, e una sostituzione che gira
  // sempre nasconde un segnaposto scritto male dentro un testo che non ne
  // voleva.
  function uiTextWith(percorso, valori, ultimaIstanza) {
    return uiText(percorso, ultimaIstanza).replace(/\{(\w+)\}/g, function (tutto, chiave) {
      return Object.prototype.hasOwnProperty.call(valori, chiave) ? valori[chiave] : tutto;
    });
  }

  function renderHelpMenu() {
    return '<div class="help-menu">' +
      '<button type="button" class="help-option" data-help-action="instructions">' + uiText('aiuto.optionInstructions') + '</button>' +
      '<button type="button" class="help-option" data-help-action="clarify">' + uiText('aiuto.optionClarify') + '</button>' +
      '<button type="button" class="help-option help-option-urgent" data-help-action="urgent">' + uiText('aiuto.optionUrgent') + '</button>' +
      '</div>';
  }

  function openHelpMenu(module) {
    document.getElementById('help-overlay-title').textContent = uiText('aiuto.menuTitle');
    document.getElementById('help-overlay-body').innerHTML = renderHelpMenu();
    openOverlay();
  }

  function openHelpFor(module) {
    activeHelpModule = module;
    openHelpMenu(module);
  }

  // ============================================================
  // I MODULI DEL PANNELLO AIUTO — arrivati qui il 2026-09-20, passo ①.
  //
  // Erano rimasti in `index.html` quando il pannello e' uscito, e la riga che
  // spiega perche' vengono adesso e non prima non c'e': **non c'era una
  // ragione, c'era un confine tirato per posizione.** Il menu (`renderHelpMenu`,
  // `openHelpMenu`, `openHelpFor`, `moduloDiAiutoAttivo`) stava qui sopra; i
  // tre pezzi che il menu APRE — il promemoria, il modulo di richiesta, la
  // conferma — stavano nell'altro file, insieme ai due listener che li legano.
  //
  // ⚠️ E QUELLA SEPARAZIONE AVEVA GIA' FATTO DANNO, il 2026-09-19:
  // `activeHelpModule` vive qui ed e' RIASSEGNATA, ma i tre punti che la
  // leggevano erano listener rimasti in `index.html` — quindi «Promemoria»,
  // «Indietro» e l'invio di una richiesta d'aiuto davano tutti e tre
  // `activeHelpModule is not defined`. **Il pannello si apriva e moriva al
  // primo pulsante.** La correzione di allora fu l'accessore
  // `moduloDiAiutoAttivo()`; questa e' la causa, chiusa un giorno dopo.
  //
  // ⚠️ NON SI E' FATTO UN `app/aiuto.js`, ED ERA IL PIANO DICHIARATO. La
  // misura l'ha cambiato: un file nuovo avrebbe avuto dentro la META' di un
  // pannello e avrebbe chiesto all'altra meta' sei nomi che qui sono gia' in
  // casa (`uiText`, `openOverlay`, `moduloDiAiutoAttivo`, `openHelpMenu`,
  // `loadErrorInlineHtml`, `helpOverlayEl`). *Un file si giustifica se separa
  // qualcosa, non se taglia in due una cosa sola.*
  //
  // ⚠️ L'UNICO NOME CHE NON E' IN CASA E' `BI.episodioCorrente()`, e si chiede
  // a tempo di CHIAMATA: `app/sessione.js` e' caricato DOPO questo file, quindi
  // un alias in cima congelerebbe `undefined` per sempre. E' la quarta
  // dipendenza in avanti del progetto, contata e nominata dal blocco [C] di
  // tests/test_dipendenze_dichiarate.js.
  // ============================================================

  // Renders a module-instructions field (today just "helpReminder", the
  // Help menu's "Rivedi come funziona l'esercizio" option) for a module's
  // kind into the shared help overlay. "howItWorks" itself is rendered by
  // renderIntroContent()/openHowItWorksOverlay() instead — the intro
  // screen and its header popup, not this overlay.
  function renderModuleInstructionField(module, field, fallbackTitle) {
    document.getElementById('help-overlay-title').textContent = fallbackTitle;
    document.getElementById('help-overlay-body').innerHTML = '<p class="module-status-text">Caricamento...</p>';
    openOverlay();
    loadModuleInstructions().then(function (data) {
      var entry = data[module.kind] && data[module.kind][field];
      document.getElementById('help-overlay-title').textContent = (entry && entry.title) || fallbackTitle;
      document.getElementById('help-overlay-body').innerHTML = entry
        ? '<div class="overlay-text">' + entry.body + '</div>'
        : '<p class="overlay-text">Contenuto non ancora disponibile per questo modulo.</p>';
    }).catch(function () {
      document.getElementById('help-overlay-body').innerHTML = loadErrorInlineHtml('overlay-text');
    });
  }



  function renderHelpForm(type) {
    var helper = uiText(type === 'urgent' ? 'aiuto.formHintUrgent' : 'aiuto.formHintClarify');
    return '<form id="help-form" data-help-type="' + type + '">' +
      '<p class="overlay-text">' + helper + '</p>' +
      '<textarea id="help-text" rows="4" placeholder="' + uiText('aiuto.formPlaceholder') + '" required></textarea>' +
      '<div class="overlay-actions">' +
      '<button type="button" class="btn btn-secondary" id="help-form-back">' + uiText('aiuto.formBack') + '</button>' +
      '<button type="submit" class="btn btn-primary">' + uiText('aiuto.formSubmit') + '</button>' +
      '</div>' +
      '</form>';
  }

  function renderHelpConfirmation() {
    return '<p class="overlay-text">' + uiText('aiuto.confirmationText') + '</p>' +
      '<div class="overlay-actions"><button type="button" class="btn btn-secondary" id="help-form-back">' + uiText('aiuto.confirmationBack') + '</button></div>';
  }


  document.getElementById('help-overlay-body').addEventListener('click', function (e) {
    var actionBtn = e.target.closest('[data-help-action]');
    if (actionBtn) {
      var action = actionBtn.getAttribute('data-help-action');
      if (action === 'instructions') {
        renderModuleInstructionField(moduloDiAiutoAttivo(), 'helpReminder', uiText('aiuto.titleInstructions'));
      } else {
        document.getElementById('help-overlay-title').textContent =
          uiText(action === 'urgent' ? 'aiuto.titleUrgent' : 'aiuto.titleClarify');
        document.getElementById('help-overlay-body').innerHTML = renderHelpForm(action);
      }
      return;
    }
    if (e.target.id === 'help-form-back') {
      openHelpMenu(moduloDiAiutoAttivo());
    }
  });

  document.getElementById('help-overlay-body').addEventListener('submit', function (e) {
    if (e.target.id !== 'help-form') return;
    e.preventDefault();
    var type = e.target.getAttribute('data-help-type');
    var text = document.getElementById('help-text').value.trim();
    if (!text) return;
    saveHelpRequest(getUserName(), {
      episodeId: BI.episodioCorrente().id,
      moduleId: moduloDiAiutoAttivo().id,
      type: type,
      text: text,
      createdAt: new Date().toISOString()
    });
    document.getElementById('help-overlay-title').textContent =
      uiText(type === 'urgent' ? 'aiuto.titleUrgent' : 'aiuto.titleClarify');
    document.getElementById('help-overlay-body').innerHTML = renderHelpConfirmation();
  });

  function slotOptions(field) {
    return (field.options || []).map(function (item) {
      if (item && typeof item === 'object') return item;
      var s = String(item);
      return { value: s, it: s, en: s, fr: '', es: '', de: '' };
    });
  }

  function slotField(episode, key) {
    return episode.slotFields.find(function (f) { return f.key === key; });
  }

  function slotDefault(episode, key) {
    var field = slotField(episode, key);
    return field ? field.def : '';
  }

  // What a slot's current (stored) value displays as in a given language:
  // the option's "it"/"en"/... column for select slots, or the raw text
  // as typed for any free-text slot. Used both for the exercise phrase
  // (English) and for dialogue lines (either language) and speaker tags
  // (Italian) in Story Cards.
  function resolveSlotValue(episode, key, rawValue, lang) {
    var field = slotField(episode, key);
    if (field && field.type === 'select') {
      var opts = slotOptions(field);
      var match = opts.find(function (o) { return o.value === rawValue; });
      var picked = match || opts[0];
      if (!picked) return rawValue;
      // Job 1 (3rd collaudo): a person's own name is never translated,
      // whichever language the dialogue line is being rendered in — an
      // Italian traveler abroad still introduces themselves as
      // "Francesco", not "Francis" (also: personalization exists so the
      // student recognizes themselves in the story). Only used to show
      // BOTH forms in the Customize screen, never to substitute one for
      // the other in the dialogue. Toponyms (places) keep translating
      // normally — 'it'/'en' picked by lang as before.
      return field.isPersonName ? picked.it : picked[lang];
    }
    return rawValue;
  }

  // Fills {{placeholders}} in a dialogue line using the episode's
  // placeholderMap (placeholder name -> slotFields key, dichiarato nel FILE
  // dell'episodio dal 2026-09-09 — regola 4, è contenuto) and the
  // user's current customization values, in the given language. Unknown
  // placeholders are left untouched rather than breaking the line — but
  // logged, since a silently-unfilled {{token}} left on screen used to be
  // the only sign something was missing.
  // Un segnaposto può chiedere una lingua sua, con {{chiave:en}} o
  // {{chiave:it}}, invece di seguire quella della chiamata. Serve dove un
  // testo mescola le due lingue: una skill è scritta in italiano ma cita la
  // frase inglese del dialogo, quindi "I am from {{partenza:en}}" vuol dire
  // "vengo da {{partenza}}" deve dare "Turin" nella citazione e "Torino"
  // nella spiegazione. Senza suffisso vale la lingua della chiamata,
  // come prima: nessun testo esistente cambia comportamento.
  function fillTemplate(text, episode, values, lang) {
    return text.replace(/\{\{(\w+)(?::(\w+))?\}\}/g, function (match, varName, forcedLang) {
      var slotKey = episode.placeholderMap && episode.placeholderMap[varName];
      if (!slotKey) {
        console.warn('fillTemplate: placeholder "' + varName + '" has no placeholderMap entry in episode "' + episode.id + '"');
        return match;
      }
      var rawValue = (values[slotKey] || '').trim() || slotDefault(episode, slotKey);
      return resolveSlotValue(episode, slotKey, rawValue, forcedLang || lang);
    });
  }

  function renderRateButtons(itemId) {
    return CONFIG.speech.rateOptions.map(function (rate) {
      var pct = Math.round(rate * 100) + '%';
      return '<button type="button" class="rate-btn" data-say="' + itemId + '" data-rate="' + rate +
        '" aria-label="' + uiTextWith('bloccoAscolto.rateButtonLabel', { pct: pct }) + '">' + pct + '</button>';
    }).join('');
  }

  // Styles a trailing "en→it"/"it→en" direction suffix smaller and more
  // discreet than the rest of a module's name (CLAUDE.md: part of the
  // name, not a second label) — used everywhere a module name is shown
  // (map row, Spiegazione title, module headers/badges).
  function moduleNameHtml(name) {
    return String(name).replace(/ (en→it|it→en)$/, ' <span class="module-name-direction">$1</span>');
  }

  // Two-row "Spiegazione" title (CLAUDE.md rule 13): row 1 is the fixed
  // "Spiegazione" kicker (never varies — see .spiegazione-title-kicker),
  // row 2 is the module's own name in evidence. Used by every module's
  // full-screen intro (renderIntroContent below) and by the
  // "Spiegazione" popup overlay (openHowItWorksOverlay) — the only two
  // places this title appears.
  // Previously a single "Spiegazione — X" string from istruzioni-moduli.
  // json; the em dash wrapped awkwardly on narrow screens, so the JSON's
  // own title is now just the module name and this always adds the
  // fixed row on top.
  function renderSpiegazioneTitle(el, moduleName) {
    el.innerHTML = '<span class="spiegazione-title-kicker">Spiegazione</span>' +
      (moduleName ? '<span class="spiegazione-title-name">' + moduleNameHtml(moduleName) + '</span>' : '');
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderStars(count) {
    var html = '';
    for (var i = 1; i <= 3; i++) {
      html += '<span class="vc-star' + (i <= count ? ' is-filled' : '') + '">' + (i <= count ? '★' : '☆') + '</span>';
    }
    return html;
  }

  // Regola Azione Critica, generic form. Correction (5th collaudo): a
  // prior round locked every OTHER control while any module's audio
  // played, everywhere — too broad. That rule only actually applies to
  // profiles with a countdown behind the audio (Dialogo Ripeti a Tempo/
  // Continuo, both still fully locked via dgLockAll — see near
  // dgPlayLine). Everywhere else, nothing is disabled: interrupting is
  // harmless without a countdown to desync, and several modules (Ascolta
  // e Ripeti's own instructions, for one) explicitly promise free
  // tapping. What stays universal instead is stop-on-touch — a critical
  // action (flipping a card, answering, advancing, pressing Record)
  // cancels any audio already playing rather than being blocked by it
  // (see each module's own click handlers — Flash Card's fcFlip, Quick
  // Match's .sr-option/qm-dontknow-btn, Voice Coach's vc-record-btn/
  // vcNextLine/voice-coach-retry-btn, Repeat Aloud/Story Cards's own
  // complete buttons).
  // lockModuleHeader(prefix, locked) is the one piece that's still a
  // real lock, kept for Voice Coach's RECORDING direction only (setVcState
  // below) — a genuinely different concern (the mic picking up the
  // model's own voice), not this audio-playback rule.
  function lockModuleHeader(prefix, locked) {
    var watchBtn = document.getElementById(prefix + '-watch-btn');
    if (watchBtn) watchBtn.disabled = locked;
    var helpBtn = document.getElementById(prefix + '-help-btn');
    if (helpBtn) helpBtn.disabled = locked;
  }
  // ⚠️ CHI POSSIEDE I DUE OVERLAY SA QUALI SONO APERTI. Nasce da un rosso:
  // il listener di Escape e' rimasto in index.html (chiude anche il Pannello
  // Admin, che non e' di questo strato) e leggeva `helpOverlayEl` e
  // `howItWorksOverlayEl` — due nomi che con l'estrazione sono finiti qui
  // dentro. Risultato: `helpOverlayEl is not defined` a ogni Escape.
  //
  // La strada comoda era esporre i due ELEMENTI e lasciare che chi sta fuori
  // guardasse le loro classi. Scelta l'altra: **si chiede allo strato di
  // chiudere i propri, non gli si guardano i nodi.** Chi sta fuori non deve
  // sapere quanti overlay ha questo file ne' come si chiamano — il giorno che
  // ne nasce un terzo, questa funzione lo copre e il chiamante non cambia.
  function chiudiOverlayAperti() {
    if (helpOverlayEl.classList.contains('is-open')) closeOverlay();
    if (howItWorksOverlayEl.classList.contains('is-open')) closeHowItWorksOverlay();
  }


  // ⚠️ IL POPUP DEI TENTATIVI VIENE INTERO: le due funzioni, lo STATO che
  // tengono e i DUE LISTENER che le chiamano. Non è pignoleria — lasciando lo
  // stato e i listener in index.html, il 2026-09-18 sono usciti
  // «attemptPopupOnRetry is not defined» su nove file. *Un pezzo non è solo le
  // sue funzioni.*
  //
  // ⚠️ E LA MISURA DEI BUCHI NON LO VEDE, per una ragione che vale la pena
  // sapere: i due `var` erano nominati SOLO dentro i listener, rimasti anche
  // loro in index.html — quindi da lì il conto tornava. `buchi.js` guarda chi
  // chiama cosa, non chi POSSIEDE lo stato di un pezzo.
  //
  // PERCHÉ STA QUI, e non in Voice dove viveva per posizione: lo chiamano
  // quattro moduli (Voice Practice, Match, Speed Match, Flash Card) e
  // `stopAllModuleActivity` in `app/mappa.js`. Finché stava dentro la regione
  // di Voice, uno STRATO chiedeva a un MODULO — il verso che questa serie
  // esiste per eliminare, e il debito dichiarato in testa a `app/mappa.js`.
  // *Sta vicino non vuol dire è suo: il criterio è chi lo chiama.*
  //
  // ⚠️ I DUE LISTENER SI AGGANCIANO A TEMPO DI PARSING, quindi questo file
  // deve restare nella SECONDA FILA. Era già vero per i due overlay; adesso lo
  // è per un secondo motivo, e vale la pena che siano due.
  // Shared safety-valve nudge popup (jobs 3+4) — Voice Coach today, Speed
  // Round/Match Practice/Flash Card reuse this same function+markup, never a
  // copy each. wasCorrect picks the message group from
  // messaggi-feedback.json's valvolaSicurezzaMessages: nonRiuscita (still
  // hasn't gotten it right at the max attempt) vs riuscita (got it right
  // despite needing several tries) — same reassuring-vs-recognition split
  // for every caller. onRetry/onNext are the two actions; a caller with no
  // meaningful "try again right now" step (Speed Match/Match Practice/Flash
  // Card, where an answer is already locked in once submitted) passes
  // onRetry as null/undefined and only "Vai avanti" shows.
  var attemptPopupOnRetry = null;
  var attemptPopupOnNext = null;

  function openAttemptPopup(wasCorrect, onRetry, onNext) {
    attemptPopupOnRetry = onRetry || null;
    attemptPopupOnNext = onNext || null;
    document.getElementById('attempt-popup-retry').hidden = !attemptPopupOnRetry;
    var fallback = wasCorrect
      ? { title: 'Ce l\'hai fatta!', body: 'Continua pure, o vai avanti quando vuoi.' }
      : { title: 'Tranquillo, capita!', body: 'Continua pure, o passa avanti quando vuoi.' };
    document.getElementById('attempt-popup-title').textContent = fallback.title;
    document.getElementById('attempt-popup-body').textContent = fallback.body;
    document.getElementById('attempt-popup').classList.add('is-open');
    loadFeedbackMessages().then(function (data) {
      var group = data.valvolaSicurezzaMessages && data.valvolaSicurezzaMessages[wasCorrect ? 'riuscita' : 'nonRiuscita'];
      if (!group) return;
      document.getElementById('attempt-popup-title').textContent = group.title;
      document.getElementById('attempt-popup-body').textContent = pickRandom(group.bodies);
    }).catch(function () {});
  }

  function closeAttemptPopup() {
    document.getElementById('attempt-popup').classList.remove('is-open');
  }

  document.getElementById('attempt-popup-retry').addEventListener('click', function () {
    closeAttemptPopup();
    if (attemptPopupOnRetry) attemptPopupOnRetry();
  });

  document.getElementById('attempt-popup-next').addEventListener('click', function () {
    closeAttemptPopup();
    if (attemptPopupOnNext) attemptPopupOnNext();
  });


  // ⚠️ IL BLOCCO ASCOLTO — il componente che SEI moduli indossano, e il
  // sospettato principale delle due regressioni del 2026-09-18 (il tocco che
  // rispondeva con tre secondi di ritardo, il microfono che non si fermava).
  //
  // Quel giro spostò questi due pezzi insieme ad altri cinque, la suite era
  // verde tre volte, e su Pages si ruppe. Adesso escono **da soli**, con sotto
  // `tests/test_comportamento_audio.js`, che li GUIDA invece di trovarli: se
  // il ritardo torna, cade in locale prima di arrivare su Pages.
  //
  // Sta qui per mestiere: il markup del pulsante «ascolta» più le velocità è
  // interfaccia che un modulo indossa, e `renderRateButtons` — la sua metà —
  // vive già in questo file dal giorno in cui lo strato è nato. *Tenerle
  // separate era «sta vicino» scambiato per «è suo», al contrario.*
  //
  // Le due dipendenze nuove — `icon` (`app/identita.js`) e `toggleSpeak`
  // (`app/audio.js`) — sono a tempo di **parsing**, perché arrivano da un
  // alias in cima all'IIFE. Vedi il commento accanto ai due alias: la prima
  // riga che avevo scritto diceva «chiamata», e la misura l'ha smentita.
  // opts: { say, mini, blocco, extraClass }
  //   say        — l'identificatore che finisce nell'attributo del tocco
  //   mini       — solo il pulsante, senza le velocita'
  //   blocco     — avvolge in <div class="listen-block">, per chi non ce l'ha
  //   extraClass — classi in piu' sul contenitore
  function renderListenBlock(opts) {
    var o = opts || {};
    var attr = o.mini ? 'data-qm-listen-index' : 'data-say';
    var bottone = '<button type="button" class="btn btn-secondary btn-sm listen-block-btn" ' +
      attr + '="' + o.say + '" aria-label="' + uiText('bloccoAscolto.listenLabel') + '">' + icon('volume-2') + '</button>';
    if (o.mini) return bottone;
    var dentro = bottone +
      '<div class="rate-group" role="group" aria-label="' + uiText('bloccoAscolto.rateGroupLabel') + '">' + renderRateButtons(o.say) + '</div>';
    if (!o.blocco) return dentro;
    return '<div class="listen-block' + (o.extraClass ? ' ' + o.extraClass : '') + '">' + dentro + '</div>';
  }

  // Il tocco su un Blocco Ascolto. Il testo NON lo decide questa funzione: e'
  // l'unica cosa che varia davvero fra i sei moduli — una ricerca nel file
  // episodio, vcTargetText(), fcBackText(), l'opzione corrente — quindi lo
  // risolve chi chiama e lo passa. Qui sta il resto, che era identico in
  // cinque punti: leggere la velocita' dal pulsante e parlare.
  function speakListenBlock(btn, testo) {
    var rateAttr = btn.getAttribute('data-rate');
    toggleSpeak(testo, btn, rateAttr !== null ? parseFloat(rateAttr) : undefined);
  }

  // ⚠️ IL TERZO GRUPPO, e NESSUN SINTOMO lo chiedeva: `introDismissPref`,
  // `dialogueLineAlign`, `speakerLabel`.
  //
  // È il motivo per cui il passo trasversale esiste, e non è cambiato: questi
  // tre sono **pezzi condivisi che stavano in un modulo per POSIZIONE**, e i
  // sei moduli ancora da estrarre li erediterebbero così — cioè uno strato
  // finirebbe a chiedere a un modulo, il verso che questa serie esiste per
  // eliminare. *Un confine sbagliato che non produce nessun rosso è quello che
  // si eredita.*
  //
  // Chi li chiama, che è il criterio (non «dove stanno»):
  //   introDismissPref   — otto punti, sette moduli + la mappa
  //   dialogueLineAlign  — Dialogo e Meet the Story
  //   speakerLabel       — Dialogo e Meet the Story
  //
  // Nessuno dei tre lega lo stato di sessione: `speakerLabel` riceve
  // l'episodio come PARAMETRO, esattamente come `fillTemplate` — ed è la
  // ragione per cui entra, mentre `itemText` resta fuori.
  function introDismissPref(kind) {
    return {
      get: function () { return isIntroDismissed(kind, getUserName()); },
      set: function (val) { setIntroDismissed(kind, getUserName(), val); }
    };
  }
  function dialogueLineAlign(line) {
    return line.ruolo === 'famiglia' ? 'right' : 'left';
  }
  /* L'etichetta sopra la bolla. UNA sola strada: quella dichiarata nel file
     episodio, perché è contenuto (regola 4).

     ⚠️ Fino al 2026-09-09 ce n'erano DUE, e la prima risolveva i personaggi
     della famiglia sul NOME SCELTO: sopra la bolla del papà compariva
     "Marco". La tabella dell'episodio dice il contrario — *«le etichette dei
     personaggi personalizzabili non portano il nome scelto: sopra la bolla
     c'è "Papà", non "Marco". Il nome sta DENTRO la battuta, dove lo studente
     lo impara»* — e adesso il codice fa quello.

     E l'etichetta porta il CONTORNO: "Hostess al gate", non "Hostess". Fra
     l'hostess del gate, quella della porta e quella del carrello, senza il
     contorno sono tutte la stessa persona.

     Il ritorno su `speaker` quando l'etichetta manca è voluto: mostra l'id
     tecnico, che è brutto e si nota — meglio di una bolla senza nome. */
  function speakerLabel(episode, speaker) {
    return (episode.speakerLabels && episode.speakerLabels[speaker]) || speaker;
  }

  // ⚠️ IL PRE-PASSO AI SEI MODULI: quattro pezzi che i moduli CONDIVIDONO e
  // che stavano in `index.html` per posizione.
  //
  // Misurato prima di muoverli — chi li chiama, non dove stanno:
  //   renderChoiceBox  — Voice, Flash Card, Match, Dialogo Ascolta e Ripeti
  //   startTimerBar    — Speed Match, Dialogo (Ripeti a Tempo e Continuo)
  //   freezeTimerBar   — gli stessi due
  //   DIRECTION_LABEL  — Flash Card, Speed Match, Match
  //
  // **Escono adesso e non col primo modulo**, per la ragione che questa serie
  // ha già pagato due volte: un pezzo condiviso lasciato dentro viene
  // **ereditato** dal primo modulo che esce, e da lì uno strato finisce a
  // chiedere a un modulo. *Un confine sbagliato che non produce nessun rosso
  // è quello che si eredita.*
  //
  // ⚠️ E QUATTRO RESTANO FUORI DI PROPOSITO, dichiarati invece che forzati:
  // `itemText`, `recordPendingMastery`, `recordMultipleChoiceResult` e
  // `buildMultipleChoiceOptions` sono condivisi allo stesso modo, ma legano
  // lo **stato di sessione** (`currentEpisode`, `currentValues`,
  // `pendingMastery`). Entrerebbero qui rompendo l'unica cosa che questo
  // strato promette: *non sa quale modulo ha sopra, e non tocca la sessione.*
  // Escono quando esce lo stato di sessione, che è un passo suo.
  //
  // Nessuno dei quattro qui sotto ha dipendenze: DOM, CSS e una tabella.
  function renderChoiceBox(containerId, questionClass, questionText, secondaryBtnId, secondaryLabel, primaryBtnId, primaryLabel) {
    document.getElementById(containerId).innerHTML =
      '<p class="' + questionClass + '">' + questionText + '</p>' +
      '<div class="pending-actions">' +
      '<button type="button" class="btn btn-secondary" id="' + secondaryBtnId + '">' + secondaryLabel + '</button>' +
      '<button type="button" class="btn btn-primary" id="' + primaryBtnId + '">' + primaryLabel + '</button>' +
      '</div>';
  }

  function startTimerBar(fillEl, ms) {
    fillEl.style.transition = 'none';
    fillEl.style.width = '100%';
    void fillEl.offsetWidth;
    fillEl.style.transition = 'width ' + (ms / 1000) + 's linear';
    fillEl.style.width = '0%';
  }

  function freezeTimerBar(fillEl) {
    var w = getComputedStyle(fillEl).width;
    fillEl.style.transition = 'none';
    fillEl.style.width = w;
  }

  var DIRECTION_LABEL = { 'en-it': 'INGLESE → ITALIANO', 'it-en': 'ITALIANO → INGLESE' };
  BI.chiudiOverlayAperti = chiudiOverlayAperti;
  BI.renderChoiceBox = renderChoiceBox;
  BI.startTimerBar = startTimerBar;
  BI.freezeTimerBar = freezeTimerBar;
  BI.DIRECTION_LABEL = DIRECTION_LABEL;
  BI.introDismissPref = introDismissPref;
  BI.dialogueLineAlign = dialogueLineAlign;
  BI.speakerLabel = speakerLabel;
  BI.renderListenBlock = renderListenBlock;
  BI.speakListenBlock = speakListenBlock;
  // ============================================================
  // I COMPONENTI CONDIVISI E IL LORO MONTAGGIO — passo ②, 2026-09-20.
  //
  // `renderSummaryScreen` (la Schermata Finale di ogni modulo),
  // `renderRetryIntroScreen` (la schermata Ripasso) e `applyRotatingSubtitle`,
  // piu' le QUATTORDICI chiamate che le montano nel markup.
  //
  // ⚠️ IL MONTAGGIO VIENE COL PEZZO, E NON E' UN DETTAGLIO. Un componente non
  // e' solo la sua funzione: e' la funzione e i punti in cui viene montato.
  // Lasciare le quattordici chiamate in `index.html` avrebbe significato che
  // il file che non sa piu' niente dei moduli continuava a nominarne sette per
  // id — ed e' la stessa ragione per cui il popup dei tentativi si e' portato
  // dietro i suoi due listener (2026-09-19).
  //
  // ⚠️ E QUESTE RIGHE GIRANO A TEMPO DI PARSING, sul markup statico: sono una
  // delle due ragioni per cui il tag di questo file sta nella SECONDA fila.
  // L'altra erano gli alias.
  // ============================================================
  // Box Doppia Scelta: a question + a secondary/primary button pair.
  // Each caller keeps its OWN outer wrapper class already in the static
  // HTML (.vc-confirm-box's tinted callout vs .fc-choice-row's plain
  // padded block — genuinely different looks, not accidental
  // duplication) — only the inner markup is shared. Labels may contain
  // markup (e.g. an icon via icon()), not just plain text.

  // Schermata Finale: the .sr-summary/.sr-summary-title shape (already
  // shared verbatim as CSS classes by Speed Match/Match Practice/Flash
  // Card) plus the one explicit completion button every module needs
  // (CLAUDE.md rule 7) — same "Ho finito, torna alla mappa" label
  // everywhere, so it isn't re-typed per module either. Job 6 (3rd
  // collaudo): also the one place that wires the "uscita" sound onto that
  // button — every module's own click handler (markModuleCompleted etc.)
  // stays untouched, this listener is purely the sound, added once here
  // instead of copied into all 7 module-specific handlers.
  function renderSummaryScreen(screenId, titleId, titleText, completeBtnId) {
    document.getElementById(screenId).innerHTML =
      '<div class="sr-summary panel">' +
      '<p class="sr-summary-title" id="' + titleId + '">' + titleText + '</p>' +
      '<p class="sr-summary-subtitle" id="' + titleId + '-sub"></p>' +
      '</div>' +
      '<button type="button" class="btn btn-primary btn-block" id="' + completeBtnId + '">Ho finito, torna alla mappa</button>';
    document.getElementById(completeBtnId).addEventListener('click', sfxPlayExitSound);
  }

  // Schermata Ripasso: the message shown once before a new retry pass
  // starts (whatever went wrong/unanswered comes back) — same panel shape
  // for every module with a retry queue (Speed Match, Match Practice, Flash
  // Card, Voice Coach), only continueBtnId/continueLabel differ per
  // caller. Deliberately its own visually prominent treatment (not a
  // plain page header + loose text like before) since this is an
  // important transition that used to go unnoticed — see CLAUDE.md, and
  // .retry-intro's own comment near its CSS for the color choice.
  // Title AND text are both filled in dynamically at SHOW time (see
  // applyRetryIntroContent below) — this only builds the empty shell.
  function renderRetryIntroScreen(screenId, continueBtnId, continueLabel) {
    document.getElementById(screenId).innerHTML =
      '<div class="retry-intro panel">' +
      '<p class="retry-intro-title" id="' + screenId + '-title"></p>' +
      '<p class="retry-intro-text" id="' + screenId + '-text"></p>' +
      '</div>' +
      '<button type="button" class="btn btn-primary btn-block" id="' + continueBtnId + '">' + (continueLabel || 'Continua →') + '</button>';
  }


  // Job 2: rotating second sentence for a recurring message — the FIRST
  // sentence stays the module's own fixed/informative text (titleText
  // above, or bodyText for Schermata Ripasso); this fills in the second,
  // picked at random each time the screen is actually shown (not once at
  // boot, when these two render functions run). Prose pools live in
  // data/inglese/it/messaggi-feedback.json like every other feedback message —
  // reuses the SAME loadFeedbackMessages()/pickRandom() pair Voice
  // Coach's star messages and the safety-valve popup already use, not a
  // second mechanism for the same kind of thing.
  function applyRotatingSubtitle(elId, listKey) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.textContent = '';
    loadFeedbackMessages().then(function (data) {
      var list = data[listKey];
      if (list && list.length) el.textContent = pickRandom(list);
    }).catch(function () {});
  }




  renderChoiceBox('vc-confirm-box', 'vc-confirm-text', 'Sicuro? Invia per la valutazione, o cancella e riprova.', 'vc-cancel-btn', icon('x') + ' Cancella', 'vc-send-btn', icon('check') + ' Invia');
  renderChoiceBox('fc-choice-row', 'fc-choice-question', 'L\'hai imparata?', 'fc-not-yet-btn', 'Non ancora', 'fc-know-it-btn', 'Sì, la so!');

  renderSummaryScreen('repeat-aloud-summary-screen', 'repeat-aloud-summary-title', 'Esercizio completato!', 'repeat-aloud-complete-btn');
  renderSummaryScreen('story-cards-summary-screen', 'story-cards-summary-title', 'Esercizio completato!', 'story-cards-complete-btn');
  renderSummaryScreen('sr-summary-screen', 'sr-summary-title', 'Round completato!', 'sr-complete-btn');
  renderSummaryScreen('qm-summary-screen', 'qm-summary-title', 'Round completato!', 'qm-complete-btn');
  renderSummaryScreen('fc-summary-screen', 'fc-summary-title', 'Tutte le carte ripassate!', 'fc-complete-btn');
  // Same generic completion title regardless of "Sì, lo so"/"Non ancora"
  // — the verde/giallo distinction already shows on the map badge (see
  // MODULE OUTCOME), no need to repeat it here.
  renderSummaryScreen('dg-summary-screen', 'dg-summary-title', 'Dialogo ripassato!', 'dg-complete-btn');

  renderRetryIntroScreen('sr-retry-intro-screen', 'sr-retry-continue-btn');
  renderRetryIntroScreen('qm-retry-intro-screen', 'qm-retry-continue-btn');
  renderRetryIntroScreen('fc-retry-intro-screen', 'fc-retry-continue-btn', 'Continua');
  renderRetryIntroScreen('voice-coach-retry-intro-screen', 'voice-coach-retry-continue-btn');

  renderSummaryScreen('voice-coach-summary-screen', 'voice-coach-summary-title', 'Modulo completato!', 'voice-coach-complete-btn');

  // ============================================================
  // ⚠️ `buildTargetTokens` — ARRIVATA QUI COL PASSO ②, E OGGI NON HA NESSUN
  // CHIAMANTE.
  //
  // Non e' un errore e non e' da togliere di iniziativa (regola 1): costruisce
  // l'elenco dei token di una frase con i valori dello studente gia' dentro,
  // ed e' scritta per un allineamento parola-per-parola. Sta QUI e non nel
  // catalogo perche' i soli due nomi che usa — `slotDefault` e
  // `resolveSlotValue` — sono in questo file: portarla altrove avrebbe creato
  // una dipendenza nuova **per del codice che nessuno chiama**.
  //
  // *Registrata in `docs/decisioni.md` come trovata e non corretta: tenerla o
  // toglierla e' una decisione di chi guida il progetto, non mia.*
  // ============================================================
  // Builds the flat target token list for alignment/rendering: each token
  // is a rendered word plus the stable mastery unit it belongs to. Fixed
  // words get a position-based id; every word of a slot's value shares the
  // slot's own id, so changing a slot's selection never shifts or resets
  // other items' progress.
  function buildTargetTokens(episode, values) {
    var tokens = [];
    var fixedIdx = 0;
    episode.segments.forEach(function (seg) {
      if (seg.text) {
        tokens.push({ word: seg.text, unitId: 'fixed:' + (fixedIdx++) });
      } else {
        var rawValue = (values[seg.slot] || '').trim() || slotDefault(episode, seg.slot);
        var phrase = resolveSlotValue(episode, seg.slot, rawValue, 'en');
        var words = phrase.split(/\s+/).filter(Boolean);
        if (!words.length) words = [''];
        words.forEach(function (w, i) {
          var isLast = i === words.length - 1;
          tokens.push({ word: w + (isLast && seg.suffix ? seg.suffix : ''), unitId: 'slot:' + seg.slot });
        });
      }
    });
    return tokens;
  }

  BI.moduloDiAiutoAttivo = moduloDiAiutoAttivo;
  BI.openAttemptPopup = openAttemptPopup;
  BI.closeAttemptPopup = closeAttemptPopup;
  BI.uiText = uiText;
  BI.uiTextWith = uiTextWith;
  BI.openOverlay = openOverlay;
  BI.closeOverlay = closeOverlay;
  BI.openHowItWorksOverlay = openHowItWorksOverlay;
  BI.closeHowItWorksOverlay = closeHowItWorksOverlay;
  BI.openHelpMenu = openHelpMenu;
  BI.openHelpFor = openHelpFor;
  BI.renderHelpMenu = renderHelpMenu;
  BI.applyOutcomeSubtitle = applyOutcomeSubtitle;
  BI.applyRetryIntroContent = applyRetryIntroContent;
  BI.moduleRulesLevel = moduleRulesLevel;
  BI.renderStars = renderStars;
  BI.renderRateButtons = renderRateButtons;
  BI.lockModuleHeader = lockModuleHeader;
  BI.moduleNameHtml = moduleNameHtml;
  BI.renderSpiegazioneTitle = renderSpiegazioneTitle;
  BI.loadErrorInlineHtml = loadErrorInlineHtml;
  BI.pickRandom = pickRandom;
  BI.fillTemplate = fillTemplate;
  BI.slotOptions = slotOptions;
  BI.slotField = slotField;
  BI.slotDefault = slotDefault;
  BI.resolveSlotValue = resolveSlotValue;
  BI.LOAD_ERROR_LAST_RESORT = LOAD_ERROR_LAST_RESORT;
  BI.MODULE_RULES_LEVEL = MODULE_RULES_LEVEL;
})(window.BI);
