// DIPENDE DA: audio.js [parsing], dati.js [parsing], identita.js [parsing], progressi.js [parsing], quiz-engine.js [parsing]
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
  var setIntroDismissed = BI.setIntroDismissed;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var toggleSpeak = BI.toggleSpeak;
  var icon = BI.icon;

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

  var activeHelpModule = null;

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


  // ⚠️ I SETTE PEZZI CONDIVISI ARRIVATI QUI IL 2026-09-18, ED E' UN DEBITO
  // PAGATO PRIMA CHE DIVENTASSE LA FORMA DI TUTTI.
  //
  // Stavano dentro le regioni di Voice e Repeat Aloud **per posizione**, e
  // quattro file gia' estratti li chiedevano da fuori: `app/mappa.js` chiedeva
  // `closeAttemptPopup` (uno STRATO che chiede a un MODULO, il verso che
  // questa serie esiste per eliminare), `app/storycards.js` ne chiedeva
  // quattro, `app/personalizza.js` uno.
  //
  // **Qualunque dei sei moduli fosse uscito prima, avrebbe peggiorato:** con
  // Repeat Aloud fuori, storycards e personalizza avrebbero dipeso da
  // `repeat-aloud.js` — modulo che chiede a modulo. Con Voice fuori,
  // `mappa.js` avrebbe dipeso da `voice.js`. E quella sarebbe diventata la
  // forma degli ultimi sei.
  //
  // **Che fossero condivisi era gia' scritto, in due posti diversi:** il popup
  // dei tentativi e' «un pezzo solo» dal passo 14b, il Blocco Ascolto e' un
  // componente dal C.3. *Quattordicesima comparsa della famiglia «sta vicino
  // non vuol dire e' suo».*
  //
  // ⚠️ `openAttemptPopup` viene con `closeAttemptPopup` benche' nessuno la
  // chieda da fuori: sono le due meta' dello stesso pezzo, e separarle
  // lascerebbe in un modulo la meta' che apre un popup che un altro file
  // chiude.

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

  // options.dismissPref for openHowItWorksOverlay, built from a module kind.
  function introDismissPref(kind) {
    return {
      get: function () { return isIntroDismissed(kind, getUserName()); },
      set: function (val) { setIntroDismissed(kind, getUserName(), val); }
    };
  }

  // Shared by Story Cards and every Dialogo module (CLAUDE.md rule 13) —
  // which side of the chat a line renders on. Driven by the line's own
  // "ruolo" ('esterno' | 'famiglia') in the episode data, never derived
  // from the speaker's name/id: names are personalizable per user, so a
  // name-based rule (e.g. "guide" hardcoded) would silently break on a
  // future episode with a different cast (a waiter, a police officer...).
  function dialogueLineAlign(line) {
    return line.ruolo === 'famiglia' ? 'right' : 'left';
  }

  function speakerLabel(episode, speaker) {
    return (episode.speakerLabels && episode.speakerLabels[speaker]) || speaker;
  }

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

  // ⚠️ `activeHelpModule` viene RIASSEGNATA, quindi non si aliasa: si chiede.
  // E' la stessa forma di `istruzioniInMemoria` — un alias ne congelerebbe il
  // null iniziale (il caso che il 2026-09-18 ha fatto sette file rossi).
  function moduloDiAiutoAttivo() { return activeHelpModule; }
  function impostaModuloDiAiutoAttivo(m) { activeHelpModule = m; }

  // ⚠️ LO STATO DEL POPUP E I SUOI DUE PULSANTI VENGONO COL PEZZO, e la
  // prima volta li avevo lasciati indietro: `attemptPopupOnRetry is not
  // defined`, DICIOTTO occorrenze su nove file. Un pezzo non e' solo le sue
  // funzioni — sono le funzioni, lo stato che tengono e i listener che le
  // chiamano. *La misura dei buchi non l'aveva visto perche' i due `var`
  // erano nominati solo DENTRO i listener, che erano rimasti anche loro:
  // da index.html il conto tornava.*
  var attemptPopupOnRetry = null;
  var attemptPopupOnNext = null;

  document.getElementById('attempt-popup-retry').addEventListener('click', function () {
    closeAttemptPopup();
    if (attemptPopupOnRetry) attemptPopupOnRetry();
  });

  document.getElementById('attempt-popup-next').addEventListener('click', function () {
    closeAttemptPopup();
    if (attemptPopupOnNext) attemptPopupOnNext();
  });

  BI.moduloDiAiutoAttivo = moduloDiAiutoAttivo;
  BI.impostaModuloDiAiutoAttivo = impostaModuloDiAiutoAttivo;
  BI.chiudiOverlayAperti = chiudiOverlayAperti;
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
  BI.closeAttemptPopup = closeAttemptPopup;
  BI.openAttemptPopup = openAttemptPopup;
  BI.renderListenBlock = renderListenBlock;
  BI.speakListenBlock = speakListenBlock;
  BI.dialogueLineAlign = dialogueLineAlign;
  BI.speakerLabel = speakerLabel;
  BI.introDismissPref = introDismissPref;
})(window.BI);
