// DIPENDE DA: avvio.js [chiamata], index.html [chiamata]
// ⚠️ L'ordine del tag in index.html DIPENDE da questa riga. Verificata da
// tests/test_dipendenze_dichiarate.js, che la confronta col codice vero: se
// una delle due invecchia, la suite diventa rossa invece di lasciarlo scoprire
// a chi riordina i tag.
//
// LO STRATO `dati` — chi va a prendere i file e li tiene in cache.
//
// Estratto da index.html il 2026-09-18. Quattordici pezzi, 157 righe.
// **Terza delle cinque cose che servono al primo modulo.**
//
// ⚠️ DUE CONFINI RESPINTI DALLA MISURA, e sono la parte che conta.
//
// ① **`itemText` NON e' di qui.** Nomina `currentEpisode`, `currentValues` e
//    `fillTemplate`: non CARICA un testo, lo RENDE coi segnaposto dello
//    studente. Va con `personalizza`. *Ci stava per nome — «testo di una
//    voce» — e non per mestiere.*
//
// ② **`applyEpisodeDialogue` e' rimasta in index.html, col catalogo.** Era
//    l'unica delle quindici che SCRIVE invece di leggere, e quello che scrive
//    e' `EPISODES`, che non e' suo. **La strada comoda era esporre `EPISODES`
//    su `BI`**: due righe, suite verde, e il catalogo scrivibile da qualunque
//    file per sempre. *Un confine sbagliato che non produce nessun rosso e'
//    quello che si eredita — ed e' la seconda volta in due giorni che la
//    misura lo respinge (la prima era `renderStars`).* Adesso il caricatore
//    **chiede**: `BI.applyEpisodeDialogue(data)`.
//
// ⚠️ I QUATTRO `fetch` DELL'APP SONO TUTTI QUI, e per la prima volta si
// vedono insieme: `module.dataFile`, `MODULE_INSTRUCTIONS_FILE`,
// `FEEDBACK_MESSAGES_FILE`, `PERSONALIZATION_TABLES_FILE`. Il piano prevede
// di unificarli, e **non e' questo il passo**: un'estrazione che sposta e
// riscrive non lascia sapere quale delle due cose ha rotto cosa. *Ma da oggi
// chi vuole unificarli ha un file solo da leggere invece di quattro punti
// distanti duemila righe.*
//
// ⚠️ COSA SI ROMPE SE NON ARRIVA: il dettaglio misurato sta in testa a
// tests/test_dati_estratto.js.

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  // howItWorks/helpReminder text (CLAUDE.md rule 8) lives in this file,
  // shared across episodes and keyed by module kind — never hardcoded
  // here. Fetched once and cached, same pattern as episode data.
  var MODULE_INSTRUCTIONS_FILE = 'data/inglese/it/istruzioni-moduli.json';

  // Il quarto file di dati, e l'unico che fino al 2026-09-09 aveva il percorso
  // scritto dentro la riga di fetch invece che qui. Era l'unico dei tre che
  // uno spostamento di cartelle poteva rompere in silenzio: non compariva in
  // nessun elenco di percorsi, stava in mezzo a una funzione.
  var FEEDBACK_MESSAGES_FILE = 'data/inglese/it/messaggi-feedback.json';

  // Le tabelle di personalizzazione condivise (nomi, citta', paesi). Uscite da
  // APP_CONFIG il 2026-09-15: sono contenuto dell'edizione (CLAUDE.md regola 4),
  // e un'edizione tedesca ne vuole di suoi.
  //
  // ⚠️ IL CONTENUTO E' QUELLO DI PRIMA, NON QUELLO DEL MAGAZZINO. Il file
  // porta le stesse sei destinazioni e gli stessi id di quando stava qui: e'
  // una conversione pura. Il contenuto vero di
  // docs/inglese/it/tabelle-personalizzazione.md (undici destinazioni, id
  // "dest-cina", traducibilita' dichiarata per riga) arriva col passo che
  // porta anche il secondo campo per riga e le eta' in lettere. La differenza
  // e' scritta dentro il JSON, sotto "_nota".
  var PERSONALIZATION_TABLES_FILE = 'data/inglese/it/tabelle-personalizzazione.json';

  var moduleInstructionsCache = null;

  var personalizationTablesPromise = null;

  // Stesso schema dei tre loader vicini, con UNA cosa in piu': gli override
  // salvati dal Pannello Admin si applicano SOPRA il file.
  //
  // Perche' non e' un dettaglio: finche' le tabelle stavano in APP_CONFIG,
  // applyConfigOverrides (l'IIFE in app/avvio.js, generico su tutte le
  // chiavi) le sovrascriveva da solo. Portandole via, quell'override resterebbe
  // in localStorage e non lo leggerebbe piu' nessuno — chi ha personalizzato
  // il magazzino perderebbe tutto SENZA UN MESSAGGIO E SENZA UN ROSSO. Non
  // serviva migrare niente: bastava continuare a leggerlo, qui.
  function loadPersonalizationTables() {
    if (personalizationTablesPromise) return personalizationTablesPromise;
    personalizationTablesPromise = fetch(PERSONALIZATION_TABLES_FILE)
      .then(function (res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
      .catch(function () {
        // Come gli altri loader: il rifiuto arriva a chi ha chiamato, che
        // manda alla schermata d'errore. Un magazzino che non arriva non si
        // rimpiazza con uno vuoto — gli slot uscirebbero senza opzioni e la
        // personalizzazione sembrerebbe funzionare a vuoto.
        personalizationTablesPromise = null;
        throw new Error('no personalization tables available');
      })
      .then(function (data) {
        var tabelle = { people: data.people || {}, places: data.places || {} };
        var overrides = {};
        try { overrides = JSON.parse(localStorage.getItem(BI.CONFIG_OVERRIDES_KEY) || '{}'); } catch (e) {}
        ['people', 'places'].forEach(function (k) {
          if (overrides[k]) tabelle[k] = overrides[k];
        });
        return tabelle;
      });
    return personalizationTablesPromise;
  }

  function loadModuleInstructions() {
    if (moduleInstructionsCache) return Promise.resolve(moduleInstructionsCache);
    return fetch(MODULE_INSTRUCTIONS_FILE)
      .then(function (res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
      .catch(function () {
        // Il rifiuto arriva fino a chi ha chiamato: ogni chiamante lo
        // gestisce, mandando alla schermata d'errore se il fallimento e'
        // bloccante e restando dov'e' se non lo e' (vedi showLoadError).
        // Prima qui c'era una copia inline dei testi che assorbiva ogni
        // fallimento in silenzio — anche un percorso sbagliato.
        throw new Error('no module instructions available');
      })
      .then(function (data) {
        moduleInstructionsCache = data;
        return data;
      });
  }

  // Il percorso del file dati si RICAVA dall'id. La nomenclatura è quella
  // della regola 4 — `data/{lingua-che-si-impara}/{lingua-studente}/
  // {lingua}-{studente}-{id}.json` — e qui non ha eccezioni: se un giorno un
  // episodio volesse un percorso suo, la regola 4 sarebbe da riaprire prima
  // di questa riga.
  function episodeDataFile(episodeId) {
    return 'data/inglese/it/inglese-it-' + episodeId + '.json';
  }

  var episodeDataCache = {};

  function loadEpisodeData(module) {
    if (episodeDataCache[module.dataFile]) {
      return Promise.resolve(episodeDataCache[module.dataFile]);
    }
    return fetch(module.dataFile)
      .then(function (res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
      .catch(function () {
        throw new Error('no data available for ' + module.dataFile);
      })
      .then(function (data) {
        episodeDataCache[module.dataFile] = data;
        // ⚠️ SI CHIEDE A CHI POSSIEDE IL CATALOGO, non si scrive dentro.
        // `applyEpisodeDialogue` e' l'unica delle quindici funzioni di questo
        // strato che SCRIVE invece di leggere, e quello che scrive e'
        // `EPISODES` — che non e' suo. Quando questo blocco e' uscito in
        // app/dati.js, esporre `EPISODES` su `BI` sarebbe stata la strada
        // comoda: due righe, suite verde, e il catalogo scrivibile da
        // qualunque file per sempre. **La funzione e' rimasta col catalogo, e
        // il caricatore gliela chiede.**
        BI.applyEpisodeDialogue(data);
        return data;
      });
  }

  // L'UNICO modo di prendere il contenuto di un grado da un episodio.
  // Prima ogni modulo aveva la sua strada — data.vocabulary per Repeat
  // Aloud/Match Practice/Speed Match, data[CONFIG.flashcard.levels[…].vocabKey]
  // per Flash Card, data.dialogue per Story Cards/Voice Coach/Dialogo — tre nomi per
  // la stessa domanda: "dammi le voci su cui lavora questo modulo". Ora la
  // domanda è una, e la risposta la decide il grado dichiarato dal modulo
  // (module.grade, in attesa che a deciderlo sia moduleOrder a coppie).
  // Un grado assente o vuoto torna una lista vuota, non un errore: i gradi
  // B e C esistono nella struttura prima di avere contenuto.
  function episodeGrade(data, grade) {
    var entry = data.levels && data.levels[grade];
    return (entry && entry.items) || [];
  }

  // Il grado che un modulo DEVE avere per esistere.
  //
  // episodeGrade() resta il lettore neutro: torna [] e va benissimo per un
  // gestore di click, dove "nessuna voce" vuol dire solo "niente da fare".
  // Ma nei costruttori di coda quel [] veniva letto come CODA GIA' FINITA
  // (qmQueue/vcQueue/srQueue .length === 0), e il modulo si dichiarava
  // completato senza aver fatto fare un solo esercizio — registrando pure
  // l'esito. Non crollava: sembrava funzionare, che e' peggio.
  //
  // Qui invece si alza. Tutti i chiamanti stanno dentro una .then() che ha
  // gia' la sua .catch() con la schermata d'errore (regola 35), quindi il
  // fallimento ha gia' una strada e non ne serve una nuova: lo studente vede
  // che qualcosa non va, invece di un passo che si spunta da solo.
  //
  // Diventa urgente con gli EPISODI CORTI (solo gradi C e D): un ordine che
  // contiene un passo sul grado A e un episodio che il grado A non ce l'ha
  // sono esattamente questo caso. Il messaggio nomina il passo e il grado,
  // cosi' chi lo vede sa cosa correggere.
  function episodeGradeRequired(data, grade, module) {
    var items = episodeGrade(data, grade);
    if (!items.length) {
      throw new Error('Il passo "' + ((module && module.id) || '?') + '" chiede il grado ' +
        grade + ', che questo episodio non ha (o e\' vuoto)');
    }
    return items;
  }

  // ---- star rating + feedback/attempt messages (FEEDBACK_MESSAGES_FILE) ----
  var vcFeedbackDataCache = null;

  function loadFeedbackMessages() {
    if (vcFeedbackDataCache) return Promise.resolve(vcFeedbackDataCache);
    return fetch(FEEDBACK_MESSAGES_FILE)
      .then(function (res) { if (!res.ok) throw new Error('fetch failed'); return res.json(); })
      .catch(function () {
        throw new Error('no feedback messages available');
      })
      .then(function (data) {
        vcFeedbackDataCache = data;
        return data;
      });
  }

  // ⚠️ LA CACHE SI CHIEDE, NON SI ALIASA — e questa funzione esiste per un
  // rosso, non per eleganza.
  //
  // `moduleInstructionsCache` e' una variabile che CAMBIA: nasce null e
  // diventa l'oggetto dei testi al primo caricamento. Il ponte degli alias
  // (`var moduleInstructionsCache = BI.moduleInstructionsCache;` in cima
  // all'IIFE) copia il VALORE del momento — cioe' null — e non lo aggiorna
  // mai piu'. `uiText()` legge la cache SENZA aspettare, quindi da fuori
  // vedeva null per sempre e ogni testo dell'interfaccia usciva stringa
  // vuota: sette file rossi, e l'app che cammina senza parole.
  //
  // E' la stessa forma gia' incontrata con `moduleEpoch`, chiusa allo stesso
  // modo: **una funzione invece di un nome.** Un alias congela un valore;
  // una chiamata va a leggerlo adesso.
  //
  // Le altre due variabili riassegnate di questo file — `vcFeedbackDataCache`
  // e `personalizationTablesPromise` — NON escono affatto: nessuno le legge
  // da fuori, e esporle sarebbe lasciare due null che sembrano un dato.
  function istruzioniInMemoria() {
    return moduleInstructionsCache;
  }

  BI.loadEpisodeData = loadEpisodeData;
  BI.episodeGrade = episodeGrade;
  BI.episodeGradeRequired = episodeGradeRequired;
  BI.loadModuleInstructions = loadModuleInstructions;
  BI.loadFeedbackMessages = loadFeedbackMessages;
  BI.loadPersonalizationTables = loadPersonalizationTables;
  BI.episodeDataFile = episodeDataFile;
  BI.episodeDataCache = episodeDataCache;
  BI.MODULE_INSTRUCTIONS_FILE = MODULE_INSTRUCTIONS_FILE;
  BI.FEEDBACK_MESSAGES_FILE = FEEDBACK_MESSAGES_FILE;
  BI.PERSONALIZATION_TABLES_FILE = PERSONALIZATION_TABLES_FILE;
  BI.istruzioniInMemoria = istruzioniInMemoria;
})(window.BI);
