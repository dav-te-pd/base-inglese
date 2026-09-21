// DIPENDE DA: apertura.js [chiamata], catalogo.js [chiamata], dati.js [parsing], identita.js [parsing], mappa.js [chiamata], progressi.js [parsing], sessione.js [chiamata], spazio.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL TAG STA NELLA SECONDA FILA, DOPO ui-condivisa.js, E NON E' UNA SCELTA
// DI STILE: gli alias in cima all'IIFE (`slotOptions`, `uiText`, `fillTemplate`,
// ...) si prendono il valore A TEMPO DI PARSING. In <head>, dove l'avevo messo
// per primo, `BI.slotOptions` non esisteva ancora — ui-condivisa carica dopo — e
// Personalizza moriva con «slotOptions is not a function», ingoiato da un
// .catch che mandava alla schermata d'errore SENZA dire perche'.
//
// *E' la prima volta che l'ordine dei tag rompe qualcosa davvero, ed e' successo
// il giorno dopo che la regola 45 lo aveva reso dichiarabile.*
//
// ⚠️ ZERO NOMI ALL'INSU' VERSO index.html, dal 2026-09-19 (passo C2).
//
// Qui c'era scritto UNDICI, ed era «la forma del primo modulo». La riga qui
// sotto prometteva che il conto dovesse scendere e diceva dove guardare. **E'
// sceso a zero, e i nomi sono andati esattamente dove la riga li mandava.**
// L'ultimo e' stato `ensureEpisodeSlotFields`, uscito in `app/apertura.js`.
// Quello che segue e' il ragionamento di allora, tenuto perche' e' la prova
// che il conto era un progetto e non un difetto — non una descrizione di oggi.
//
// Un numero che sale con una ragione scritta e' un progetto; senza, e' un
// difetto. La ragione: un modulo non puo' non nominare l'episodio su cui
// lavora. Uno strato che nomina lo stato di sessione lo POSSIEDE male; un
// modulo che lo nomina lo USA — Personalizza *e'* il passo che scrive i valori
// dell'episodio corrente.
//
// Delle undici, sei spariscono da sole quando escono i resti di ui-condivisa e
// mappa (showLoadError, renderIntroContent, introDismissPref, goHome,
// leaveModule, openEpisodeMap), tre quando esce il catalogo (itemText,
// MAP_PSEUDO_MODULE, ID_PERSONALIZZA), e DUE — episodioCorrente e
// valoriCorrenti — solo quando lo stato di sessione avra' una casa.
//
// **Il conto deve tornare a scendere. Se al terzo modulo e' ancora undici, il
// progetto si e' fermato e questo file e' il posto dove si vede.**

// IL PRIMO MODULO ESTRATTO, ed e' il caso PIU' DIVERSO degli otto, scelto
// apposta: l'unico senza `dataFile`, l'unico di categoria Inizio (niente
// Schermata Finale, niente esito, niente stelle). Al 21-quater cinque file
// erano caduti perche' un test aveva guidato il caso comodo, e a cadere fu lei.
//
// *Il caso piu' diverso non va tenuto per ultimo: va messo per primo, quando la
// forma e' ancora modificabile.* E' il ribaltamento della regola 42 — la' il
// caso diverso prova che una forma regge, qui la decide.
//
// ⚠️ IL TAG STA IN PRIMA FILA, in <head>: nessuno dei pezzi tocca il markup a
// tempo di parsing (i getElementById sono tutti dentro funzioni). La domanda
// che decide la fila e' sempre quella, e qui la risposta e' no.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;
  var getUserName = BI.getUserName;
  var icon = BI.icon;
  var isCustomizeSeen = BI.isCustomizeSeen;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var loadCustomValues = BI.loadCustomValues;
  var saveCustomValues = BI.saveCustomValues;
  var loadMastery = BI.loadMastery;
  var loadModuleOutcomes = BI.loadModuleOutcomes;
  var loadModuleProgress = BI.loadModuleProgress;
  var markModuleCompleted = BI.markModuleCompleted;
  var wipeEpisodeProgress = BI.wipeEpisodeProgress;
  var saveHelpRequest = BI.saveHelpRequest;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadPersonalizationTables = BI.loadPersonalizationTables;
  var uiText = BI.uiText;
  var uiTextWith = BI.uiTextWith;
  var openHelpFor = BI.openHelpFor;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var fillTemplate = BI.fillTemplate;
  var slotOptions = BI.slotOptions;
  var slotField = BI.slotField;
  var slotDefault = BI.slotDefault;
  var resolveSlotValue = BI.resolveSlotValue;
  var loadErrorInlineHtml = BI.loadErrorInlineHtml;
  var LOAD_ERROR_LAST_RESORT = BI.LOAD_ERROR_LAST_RESORT;


  // Groups slotFields for card layout: fields sharing a "group" render in
  // one card (e.g. child's name + age), others get their own card.
  function groupSlotFields(fields) {
    var groups = [];
    var byGroup = {};
    fields.forEach(function (f) {
      if (f.group) {
        if (!byGroup[f.group]) {
          byGroup[f.group] = { key: f.group, fields: [] };
          groups.push(byGroup[f.group]);
        }
        byGroup[f.group].fields.push(f);
      } else {
        groups.push({ key: f.key, fields: [f] });
      }
    });
    return groups;
  }

  function renderSlotGrid() {
    var grid = document.getElementById('slot-grid');
    var groups = groupSlotFields(BI.episodioCorrente().slotFields);
    grid.innerHTML = groups.map(function (g) {
      var fieldsHtml = g.fields.map(function (f) {
        var control;
        if (f.type === 'select') {
          var opts = slotOptions(f);
          control = '<select data-slot="' + f.key + '">' + opts.map(function (o) {
            var selected = o.value === BI.valoriCorrenti()[f.key] ? ' selected' : '';
            return '<option value="' + o.value + '"' + selected + '>' + o.it + '</option>';
          }).join('') + '</select>';
        } else {
          control = '<input type="text" data-slot="' + f.key + '" value="' + (BI.valoriCorrenti()[f.key] || '') + '">';
        }
        return '<label class="slot-field' + (f.narrow ? ' slot-field-narrow' : '') + '">' +
          '<span class="slot-label">' + f.label + '</span>' + control + '</label>';
      }).join('');
      return '<div class="slot-card panel">' +
        '<div class="slot-card-fields">' + fieldsHtml + '</div>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-reset-group="' + g.key + '">' + icon('rotate-ccw') + ' Reset</button>' +
        '</div>';
    }).join('');
  }

  function onSlotChange(e) {
    var key = e.target.getAttribute('data-slot');
    if (!key) return;
    BI.valoriCorrenti()[key] = e.target.value;
    saveCustomValues(BI.episodioCorrente(), getUserName(), BI.valoriCorrenti());
  }

  // ---- Request Box: one small free-text field per personalization group
  // already shown above (papà, mamma, figlia, figlio, partenza,
  // destinazione — the same groupSlotFields() grouping renderSlotGrid()
  // uses), for a name/place not in the predefined lists. The field to
  // compare against for a given group is its non-"narrow" field (the
  // name/place select, not an age) — same data already driving that
  // group's own dropdown, so no group->table mapping is hardcoded here. ----
  function requestGroupField(group) {
    return group.fields.find(function (f) { return !f.narrow; }) || group.fields[0];
  }

  function renderRequestBox() {
    var groups = groupSlotFields(BI.episodioCorrente().slotFields);
    document.getElementById('request-fields').innerHTML = groups.map(function (g) {
      var field = requestGroupField(g);
      return '<div class="request-field-row">' +
        '<span class="slot-label">' + field.label + '</span>' +
        '<div class="request-field-input-row">' +
        '<input type="text" data-request-group="' + g.key + '" id="request-' + g.key + '">' +
        '<button type="button" class="btn btn-secondary btn-sm" data-request-submit="' + g.key + '">Invia</button>' +
        '</div>' +
        '<p class="request-field-feedback" id="request-feedback-' + g.key + '" hidden></p>' +
        '</div>';
    }).join('');
  }

  function submitCustomizationRequest(groupKey) {
    var input = document.getElementById('request-' + groupKey);
    var value = input.value.trim();
    if (!value) return;
    var group = groupSlotFields(BI.episodioCorrente().slotFields).find(function (g) { return g.key === groupKey; });
    if (!group) return;
    var opts = slotOptions(requestGroupField(group));
    var isDuplicate = opts.some(function (o) { return o.it.toLowerCase() === value.toLowerCase(); });
    var feedbackEl = document.getElementById('request-feedback-' + groupKey);
    loadModuleInstructions().then(function (data) {
      var entry = data.personalizzazione || {};
      if (isDuplicate) {
        // ⚠️ Niente copia del testo come fallback, ed e' una correzione: qui
        // c'era 'Questa parola è già tra le opzioni disponibili.', cioe' la
        // stessa frase del JSON MENO la sua seconda meta' («— prova a
        // selezionarla direttamente dal campo sopra»). Le due erano gia'
        // divergute, e nessuno poteva accorgersene: il fallback si vede solo
        // se la chiave manca, cioe' quasi mai. Una copia che si vede quasi
        // mai e' una copia che non viene mai corretta.
        feedbackEl.textContent = entry.requestBoxDuplicateWarning || '';
        feedbackEl.className = 'request-field-feedback is-warning';
      } else {
        saveHelpRequest(getUserName(), {
          episodeId: BI.episodioCorrente().id,
          moduleId: 'personalizzazione',
          type: 'customization',
          category: groupKey,
          text: value,
          createdAt: new Date().toISOString()
        });
        feedbackEl.textContent = uiText('personalizzazione.requestBoxSaved');
        feedbackEl.className = 'request-field-feedback is-success';
        input.value = '';
      }
      feedbackEl.hidden = false;
    }).catch(function () {
      // Non bloccante: la richiesta non e' stata salvata, ma il resto di
      // Personalizza funziona. Prima il rifiuto non lo raccoglieva nessuno
      // e il pulsante sembrava semplicemente non rispondere.
      feedbackEl.innerHTML = LOAD_ERROR_LAST_RESORT.inlineText;
      feedbackEl.className = 'request-field-feedback is-notice';
      feedbackEl.hidden = false;
    });
  }

  function renderCustomizePageText() {
    document.getElementById('customize-page-description').textContent = '';
    document.getElementById('request-box-label').textContent = '';
    document.getElementById('request-box-example').textContent = '';
    loadModuleInstructions().then(function (data) {
      var entry = data.personalizzazione || {};
      document.getElementById('customize-page-description').textContent = entry.pageDescription || '';
      document.getElementById('request-box-label').textContent = entry.requestBoxLabel || '';
      document.getElementById('request-box-example').textContent = entry.requestBoxExample || '';
    }).catch(function () {});
  }

  function personalizzazioneModule() {
    return BI.episodioCorrente().modules.find(function (m) { return m.id === 'personalizzazione'; });
  }


  // Whether the user has made real progress elsewhere in this episode —
  // i.e. beyond Personalizza itself, which may already be in
  // progress.completed from a previous, uneventful visit. Any signal
  // (a completed module, a mastery entry, a Dialogo outcome) means
  // reopening Personalizza now needs the mid-episode wipe warning below;
  // none of them means the episode hasn't really started yet, so editing
  // stays free.
  //
  // ⚠️ Dal travaso al pulsante (pendingMastery) questo avviso vede MENO
  // gente, ed è voluto: chi ha risposto a tre domande e poi è uscito con
  // "← Mappa" non ha più nessuna voce nel magazzino, quindi qui risulta non
  // aver cominciato. È la stessa regola applicata a un posto in più, non un
  // effetto collaterale da compensare: se quelle risposte non esistono, non
  // esiste nemmeno il progresso che l'avviso proteggeva. Prima l'avviso
  // mentiva — diceva "hai già cominciato" a chi aveva fatto tre click e se
  // n'era andato.
  function hasStartedEpisodeModules(episode, userName) {
    var progress = loadModuleProgress(episode.id, userName);
    var completedBeyondCustomize = progress.completed.filter(function (id) { return id !== BI.ID_PERSONALIZZA; });
    if (completedBeyondCustomize.length > 0) return true;
    if (Object.keys(loadMastery(episode.id, userName)).length > 0) return true;
    if (Object.keys(loadModuleOutcomes(episode.id, userName)).length > 0) return true;
    return false;
  }

  var customizeWarningConfirmPhrase = '';

  function renderCustomizeWarningScreen() {
    document.getElementById('customize-warning-confirm-input').value = '';
    document.getElementById('customize-warning-confirm-btn').disabled = true;
    customizeWarningConfirmPhrase = '';
    // ⚠️ NIENTE COPIE DI RIPIEGO DEL TESTO, dal 2026-09-21 (passo 1.3b).
    //
    // Qui c'erano `|| 'Attenzione'`, `|| 'Conferma'`, `|| 'Annulla'`. Le tre
    // chiavi esistono tutte nel file, quindi quelle parole **non si vedevano
    // mai** — e il giorno che si fossero viste avrebbero detto una cosa
    // DIVERSA da quella scritta: il titolo vero e' «Stai per cancellare i tuoi
    // progressi», non «Attenzione». *Una copia che si vede quasi mai e' una
    // copia che diverge senza che nessuno se ne accorga* — e' la stessa
    // correzione gia' fatta in questo file per il messaggio del duplicato.
    loadModuleInstructions().then(function (data) {
      var entry = (data.personalizzazione && data.personalizzazione.midEpisodeWarning) || {};
      document.getElementById('customize-warning-title').textContent = entry.title || '';
      document.getElementById('customize-warning-body').innerHTML = entry.body || '';
      document.getElementById('customize-warning-confirm-label').textContent = entry.confirmLabel || '';
      document.getElementById('customize-warning-confirm-btn').textContent = entry.confirmButton || '';
      document.getElementById('customize-warning-cancel-btn').textContent = entry.cancelButton || '';
      customizeWarningConfirmPhrase = (entry.confirmPhrase || '').trim().toLowerCase();
    }).catch(function () {});
  }

  function customizeShowScreen(name) {
    document.getElementById('customize-intro-screen').hidden = name !== 'intro';
    document.getElementById('customize-warning-screen').hidden = name !== 'warning';
    document.getElementById('customize-main-screen').hidden = name !== 'main';
  }

  // Decides between 'warning' and 'main' once the intro is out of the
  // way — shared by openCustomize (intro already dismissed) and the
  // intro's own "Ho capito, inizia" handler below.
  function customizeShowMainOrWarning() {
    if (hasStartedEpisodeModules(BI.episodioCorrente(), getUserName())) {
      renderCustomizeWarningScreen();
      customizeShowScreen('warning');
    } else {
      customizeShowScreen('main');
    }
  }

  function openCustomize() {
    // I listener di questo modulo, una volta sola.
    //
    // ⚠️ SONO TREDICI E VENIVANO DA TRE POSTI DIVERSI — l'unica famiglia delle
    // otto che non era un blocco. I tre segnaposti, piu' in basso e a ~4215,
    // dicono da dove e portano la verifica fatta prima di spostarli.
    //
    // ⚠️ LA CHIAVE E' 'personalizza', E QUI LA CHIAVE SBAGLIATA PASSEREBBE
    // VERDE — ma per una ragione DIVERSA da Flash Card e Repeat Aloud.
    //
    // La' famiglia e `kind` sono la stessa stringa, quindi le due chiavi sono
    // identiche e nessuna corsa puo' distinguerle. Qui NO: la famiglia si
    // chiama 'personalizza' e il kind 'personalizzazione' — **stringhe
    // diverse**. La chiave sul kind funzionerebbe lo stesso, ma per
    // **sufficienza** (un kind solo → una chiave sola → una sola esecuzione),
    // non per **coincidenza**. *Chi la «semplificasse» al kind cambierebbe
    // VALORE, non solo forma.* La regola per esteso, con la distinzione fra i
    // due casi, sta accanto a `BI.unaVoltaSola` in app/spazio.js.
    //
    // ⚠️ E A DIFFERENZA DELLE ALTRE DUE, QUI LA GUARDIA E' PROTETTA: il blocco
    // [C] di tests/test_listener_una_volta.js copre Personalizza dal
    // 2026-09-17 (⑦-zero), da quando `uscitaVersoMappa` ha separato «qual e' il
    // pulsante ← Mappa» — per Personalizza nessuno, ed e' giusto — da «come
    // torno alla mappa per riaprire», che e' `start-episode`. Falsificato:
    // togliendo la guardia i tredici vanno da 1 a 4.
    //
    // Sul PERCHE' stiano prima del resto: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, ed e' una precauzione per il
    // passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('personalizza', function () {
    document.getElementById('customize-back-home').addEventListener('click', BI.goHome);

    document.getElementById('slot-grid').addEventListener('input', onSlotChange);

    document.getElementById('slot-grid').addEventListener('change', onSlotChange);

    document.getElementById('slot-grid').addEventListener('click', function (e) {
      var groupKey = e.target.getAttribute('data-reset-group');
      if (!groupKey) return;
      BI.episodioCorrente().slotFields.forEach(function (f) {
        var owner = f.group || f.key;
        if (owner === groupKey) {
          BI.valoriCorrenti()[f.key] = f.def;
          var control = document.querySelector('[data-slot="' + f.key + '"]');
          if (control) control.value = f.def;
        }
      });
      saveCustomValues(BI.episodioCorrente(), getUserName(), BI.valoriCorrenti());
    });

    document.getElementById('request-fields').addEventListener('click', function (e) {
      var groupKey = e.target.getAttribute('data-request-submit');
      if (!groupKey) return;
      submitCustomizationRequest(groupKey);
    });

    document.getElementById('request-fields').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var groupKey = e.target.getAttribute('data-request-group');
      if (!groupKey) return;
      e.preventDefault();
      submitCustomizationRequest(groupKey);
    });

    document.getElementById('customize-warning-confirm-input').addEventListener('input', function (e) {
      var typed = e.target.value.trim().toLowerCase();
      document.getElementById('customize-warning-confirm-btn').disabled =
        !customizeWarningConfirmPhrase || typed !== customizeWarningConfirmPhrase;
    });

    document.getElementById('customize-warning-confirm-btn').addEventListener('click', function (e) {
      if (e.target.disabled) return;
      wipeEpisodeProgress(BI.episodioCorrente(), getUserName());
      customizeShowScreen('main');
    });

    document.getElementById('customize-warning-cancel-btn').addEventListener('click', function () {
      BI.openEpisodeMap();
    });

    document.getElementById('customize-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(personalizzazioneModule(), { dismissPref: BI.introDismissPref('personalizzazione') });
    });

    document.getElementById('customize-intro-start-btn').addEventListener('click', function () {
      setIntroDismissed('personalizzazione', getUserName(), document.getElementById('customize-intro-dont-show-again').checked);
      customizeShowMainOrWarning();
    });

    document.getElementById('customize-help-btn').addEventListener('click', function () {
      openHelpFor(personalizzazioneModule());
    });

    document.getElementById('start-episode').addEventListener('click', startEpisodeFromCustomize);
    });

    document.getElementById('customize-episode-badge').textContent = BI.episodioCorrente().badge;
    document.getElementById('slot-grid').innerHTML = '<p class="module-status-text">Caricamento...</p>';
    document.getElementById('request-fields').innerHTML = '';
    renderCustomizePageText();
    BI.leaveModule('customize');
    if (isIntroDismissed('personalizzazione', getUserName())) {
      customizeShowMainOrWarning();
    } else {
      document.getElementById('customize-intro-dont-show-again').checked = false;
      BI.renderIntroContent('personalizzazione', 'customize-intro-title', 'customize-intro-body', personalizzazioneModule().label, 'customize-intro-start-btn', 'customize-intro-dont-show-text');
      customizeShowScreen('intro');
    }
    BI.ensureEpisodeSlotFields(BI.episodioCorrente()).then(function () {
      BI.impostaValoriCorrenti(loadCustomValues(BI.episodioCorrente(), getUserName()));
      renderSlotGrid();
      renderRequestBox();
    }).catch(function () {
      BI.showLoadError(openCustomize);
    });
  }


  // Come openModuleFromMap: una funzione con un nome, perche' "Riprova"
  // deve poter rifare questo stesso passaggio (regola 20).
  // slot-grid/request-box already wait on this in openCustomize(), so in
  // practice it's already resolved by the time the button is clickable —
  // this just guards a very fast click from racing the fetch.
  function startEpisodeFromCustomize() {
    BI.ensureEpisodeSlotFields(BI.episodioCorrente()).then(function () {
      markModuleCompleted(BI.episodioCorrente(), getUserName(), 'personalizzazione');
      BI.openEpisodeMap();
    }).catch(function () {
      // Senza questo il pulsante non faceva niente: nessun avanzamento e
      // nessun messaggio.
      BI.showLoadError(startEpisodeFromCustomize);
    });
  }

  // ⚠️ IL MODULO SI DICHIARA, e nessuno lo nomina da fuori. E' la premessa del
  // passo 23 nella sua forma vera — non «zero riferimenti», ma «uno solo, e
  // dichiarativo»: il catalogo deve nominarlo (un passo che nessuno puo'
  // nominare non si puo' mettere in sequenza) e il modulo deve dichiararsi.
  //
  // Se questo file non arriva, la chiave non esiste, `BI.moduli['personalizzazione']`
  // e' undefined e la mappa manda alla schermata d'errore: **un passo che non si
  // apre, non un'app rotta.** E' il primo caso in cui quel substrato viene
  // provato per davvero invece che simulandolo.
  BI.registraModulo('personalizzazione', openCustomize);
})(window.BI);
