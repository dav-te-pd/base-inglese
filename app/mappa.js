// DIPENDE DA: apertura.js [chiamata], audio.js [parsing], avvio.js [parsing], catalogo.js [chiamata], dati.js [parsing], identita.js [parsing], orchestrazione.js [parsing], progressi.js [parsing], sessione.js [chiamata], spazio.js [parsing], ui-condivisa.js [parsing]
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

  function goHome() {
    var name = getUserName();
    document.getElementById('home-greeting').textContent = 'Ciao, ' + name + '!';
    // Il pulsante nomina l'episodio che si aprira' davvero, letto dalla stessa
    // fonte degli altri tre punti che mostrano il badge (personalizzazione,
    // mappa). Fino al 2026-09-09 la stringa "Inizia Episodio 1" era incollata
    // nell'HTML e nessuno gliela riscriveva: sull'episodio 2 il pulsante diceva
    // "Episodio 1" mentre la mappa, due tocchi dopo, diceva "Episodio 2".
    //
    // Nel markup resta il solo verbo, "Inizia": un testo statico che nomina un
    // episodio e' vero al massimo per uno, mentre "Inizia" e' vero sempre —
    // anche nel caso in cui questa riga non girasse.
    document.getElementById('go-episode').textContent = 'Inizia ' + BI.episodioCorrente().badge;
    leaveModule('home');
  }

  function boot() {
    if (getUserName()) {
      goHome();
    } else {
      showView('onboarding');
      document.getElementById('name-input').focus();
    }
  }

  var configPanelOverlayEl = document.getElementById('config-panel-overlay');

  var configPanelBodyEl = document.getElementById('config-panel-body');

  // Read-only usage rows (job 6c) — current user, current episode. Not
  // part of renderConfigPanel's generic APP_CONFIG walk (this isn't a
  // tunable, see addAudioSecondsSent's own comment); re-rendered every
  // open so it always reflects whatever was just recorded.
  function renderAudioUsagePanel() {
    var el = document.getElementById('config-audio-usage');
    if (!el) return;
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

  function renderConfigFields(container, obj, path) {
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      var fieldPath = path.concat([key]);
      if (Array.isArray(value)) {
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
  function sequenzaInModifica() {
    var ep = (CONFIG.episodes && CONFIG.episodes[BI.episodioCorrente() && BI.episodioCorrente().id]) || {};
    return (typeof ep.sequence === 'string' && ep.sequence) || null;
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
        (ep.badge || id) + ' (' + id + ')</option>';
    }).join('');
    wrap.innerHTML =
      '<label class="config-field-label" for="cfg-episodioCorrente">episodioCorrente</label>' +
      configFieldDescriptionHtml(['episodioCorrente']) +
      '<select id="cfg-episodioCorrente" data-config-path="episodioCorrente" data-config-reload>' + opzioni + '</select>';
    return wrap;
  }

  function renderModuleOrderField() {
    var wrap = document.createElement('div');
    wrap.className = 'config-field';
    // Il testo della spiegazione sta in CONFIG.configFieldDescriptions come
    // quello di ogni altro parametro (CLAUDE.md regola 25), non scritto qui.
    wrap.innerHTML = configFieldDescriptionHtml(['sequences']);
    var list = document.createElement('div');
    list.className = 'config-module-order-list';
    wrap.appendChild(list);
    renderModuleOrderRows(list);
    return wrap;
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
    document.getElementById('map-episode-badge').textContent = BI.episodioCorrente().badge;
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
  function renderStoryCardsExplanationStatsPanel() {
    var el = document.getElementById('config-story-cards-explanation-stats');
    if (!el) return;
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
    try { overrides = JSON.parse(localStorage.getItem(CONFIG_OVERRIDES_KEY) || '{}'); } catch (e) { overrides = {}; }
    overrides[sectionKey] = window.APP_CONFIG[sectionKey];
    try { localStorage.setItem(CONFIG_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (e) {}
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
