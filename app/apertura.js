// DIPENDE DA: catalogo.js [parsing], dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], sessione.js [chiamata], spazio.js [chiamata]
// ⚠️ L'APERTURA DI UN MODULO. Passo C2, 2026-09-19.
//
// Cosa succede fra il tocco su una riga della mappa e la schermata del modulo:
// risolvere il `kind` dal registro (`openModuleByKind`), e garantire che i dati
// che quel modulo leggera' ci siano GIA' quando la sua schermata compare
// (`openModuleFromMap`). Piu' le tre preparazioni che servono a quella
// garanzia: gli slot di personalizzazione, le etichette dei personaggi, e la
// migrazione della vecchia bandiera di Personalizza.
//
// ⚠️ PERCHE' QUESTI SETTE PEZZI STANNO INSIEME, E NON E' UNA COMODITA'.
//
// Fino a oggi `index.html` ESPONEVA tre nomi verso l'alto — `app/dati.js`
// chiedeva `BI.applyEpisodeDialogue`, `app/mappa.js`
// `BI.migrateCustomizeSeenToModuleProgress`, `app/personalizza.js`
// `BI.ensureEpisodeSlotFields`. Erano le ultime tre chiamate IN AVANTI del
// progetto: un file di `app/` che aspetta qualcosa da `index.html`, cioe' dal
// file che viene letto per ULTIMO.
//
// Misurato prima e dopo con `node tests/tools/dipendenze.js`:
//
//     prima:  3 file dipendono da index.html
//     dopo:   0
//
// **Il ponte diventa a senso unico.** Da qui in poi `index.html` puo' solo
// CHIEDERE a `app/`, mai essere chiesto — che e' la condizione perche' quello
// che resta dentro l'IIFE possa uscire senza rompere niente a monte.
//
// ⚠️ E I TRE NOMI NON SI SONO SPOSTATI PER ANDARE VIA: si sono ritrovati.
// `ensureEpisodeSlotFields` e `applyEpisodeDialogue` fanno la stessa cosa —
// attaccare all'episodio un dato che arriva dal suo file, dopo il fetch,
// perche' `EPISODES` si costruisce al caricamento e il file arriva dopo. Il
// loro unico chiamante comune e' l'apertura di un modulo. Stavano in tre
// regioni diverse di `index.html` per POSIZIONE (Personalizza, Repeat Aloud,
// la mappa), non per mestiere: e' il quattordicesimo confine corretto dal
// criterio «chi riceve si sposta, chi va a prendere resta».
//
// ⚠️ PERCHE' QUESTO FILE E' CARICATO PER ULTIMO, e non e' indifferente.
// `BI.moduliCaricatiAlBoot` dichiara che al boot ogni modulo si e' registrato.
// Quella frase e' vera solo dopo l'ultimo `app/<modulo>.js`, quindi il file che
// la possiede deve venire dopo di loro. Prima stava in fondo all'IIFE di
// `index.html` per la stessa ragione, e il commento di allora diceva gia'
// perche' non poteva stare in `app/spazio.js`: non e' una proprieta' dello
// spazio dei nomi, e' un fatto su COME quest'app carica i suoi moduli. Adesso
// sta nel file che quei moduli li apre.
//
// ⚠️ IL REGISTRO SI LEGGE A TEMPO DI CHIAMATA, NON DI PARSING.
// `BI.moduli[module.kind]` e `BI.registraModulo` non sono aliasati in cima:
// `BI.moduli` viene letto DENTRO `openModuleByKind`, cioe' quando l'utente
// tocca una riga. E' per questo che la dichiarazione in testa dice
// `spazio.js [chiamata]` e non `[parsing]` — e se qualcuno lo aliasasse in
// cima congelerebbe l'oggetto di quel momento.
(function (BI) {
  'use strict';

  var EPISODES = BI.EPISODES;
  var ID_PERSONALIZZA = BI.ID_PERSONALIZZA;
  var loadEpisodeData = BI.loadEpisodeData;
  var loadModuleInstructions = BI.loadModuleInstructions;
  var loadPersonalizationTables = BI.loadPersonalizationTables;
  var getUserName = BI.getUserName;
  var isCustomizeSeen = BI.isCustomizeSeen;
  var loadModuleProgress = BI.loadModuleProgress;
  var markModuleCompleted = BI.markModuleCompleted;
  var loadCustomValues = BI.loadCustomValues;
  var showLoadError = BI.showLoadError;

  // ⚠️ OGGI TUTTI I MODULI SI REGISTRANO AL BOOT, e questa riga lo DICHIARA
  // invece di lasciarlo dedurre.
  //
  // Serve a una cosa sola: distinguere le due cause di «kind non nel registro»
  // in openModuleByKind. Finche' e' `true`, un kind mancante puo' voler dire
  // soltanto che l'episodio ne dichiara uno che non esiste. Dal passo 22, in
  // cui i file dei moduli arriveranno a richiesta, diventera' `false` e la
  // seconda causa — «il file non e' arrivato» — sara' possibile davvero.
  //
  // Sta qui e non in app/spazio.js perche' non e' una proprieta' dello spazio
  // dei nomi: e' un fatto su COME quest'app carica i suoi moduli, e cambiera'
  // insieme a quello.
  BI.moduliCaricatiAlBoot = true;

  /* Le etichette dei personaggi e i segnaposto ammessi ARRIVANO DAL FILE
     EPISODIO, non da `index.html` (regola 4): sono contenuto che lo studente
     legge, e la loro fonte è la tabella «I personaggi e le loro etichette» del
     markdown dell'episodio.

     Non si possono dichiarare dentro EPISODES perché quello si costruisce al
     caricamento, mentre il file dati arriva dopo — quindi si attaccano
     all'episodio appena il file c'è. È lo stesso rapporto che `slotFields` ha
     già con `personalizationTablesUsed` (ensureEpisodeSlotFields), e non un
     meccanismo nuovo.

     ⚠️ Ogni lettore di questi campi (speakerLabel, fillTemplate) gira DENTRO
     un `loadEpisodeData(...).then(...)`, cioè dopo questa riga. Un lettore
     nuovo che girasse prima li troverebbe vuoti: non è una cosa che si vede
     leggendo la funzione, ed è per questo che sta scritta qui. */
  function applyEpisodeDialogue(data) {
    var episodio = EPISODES[data && data.episodeId];
    if (!episodio) return;
    episodio.speakerLabels = (data && data.speakerLabels) || {};
    episodio.placeholderMap = (data && data.placeholderMap) || {};
  }
  BI.applyEpisodeDialogue = applyEpisodeDialogue;

  // ⚠️ Qui c'erano due commenti attaccati, e il primo descriveva un'ALTRA
  // funzione: `slotOptions`, che vive in app/ui-condivisa.js. Diceva anche
  // `{ value, it, en, fr, es, de }`, forma uscita il 2026-09-20 (passo 1.8).
  // Un commento che descrive la funzione sbagliata non si nota rileggendo: si
  // nota solo quando qualcuno ci si fida.
  //
  // Resolves a personalizationTablesUsed entry's "table" reference to its
  // actual option list: a shared CONFIG.* table (people/places — reused
  // across every episode and language, CLAUDE.md rule 4) by default, or,
  // prefixed "episode.", a table declared inside this same episode's own
  // data file instead (values that only make sense for this one story,
  // like a plausible age range — never shared with other episodes).
  // ⚠️ `righe` — passo 1.8-bis (3), 2026-09-24: un pezzo della tabella invece
  // della tabella intera.
  //
  // Serve perche' le eta' sono USCITE dal file dell'episodio e sono entrate nel
  // magazzino condiviso: `ages.anni` ha quattordici righe, e la figlia ne vede
  // sei (12-17), il figlio otto (4-11). Prima le due liste erano due tabelle
  // separate dentro `gate`, quindi il problema non esisteva — e nemmeno la
  // parola in inglese, perche' un valore nudo ha `it` ed `en` uguali.
  //
  // ⚠️ ASSENTE VUOL DIRE «TUTTA LA TABELLA», E LO DICE L'ASSENZA. Sette slot su
  // otto non dichiarano niente: dare loro una lista vuota obbligherebbe questa
  // funzione a distinguere «vuota perche' le voglio tutte» da «vuota perche'
  // non ne voglio nessuna» — la distinzione che non si deve indovinare.
  //
  // ⚠️ E L'ORDINE E' QUELLO DELL'ELENCO, non quello della tabella: chi scrive
  // lo slot decide in che ordine lo studente scorre le opzioni. Oggi i due
  // elenchi seguono la tabella, quindi non si vede — ed e' proprio per questo
  // che va scritto qui invece che dedotto dal comportamento di oggi.
  //
  // Un id elencato che nella tabella non c'e' semplicemente non compare: e' un
  // errore dei dati, e ha la sua guardia in `test_traducibilita_per_riga` [A2].
  function resolveSlotTable(tableRef, episodeData, tables, righe) {
    var isEpisodeLocal = tableRef.indexOf('episode.') === 0;
    // La radice condivisa non e' piu' CONFIG: e' il magazzino che arriva da
    // PERSONALIZATION_TABLES_FILE, quindi questa funzione ha bisogno che
    // qualcuno l'abbia gia' aspettato (ensureEpisodeSlotFields lo fa).
    // Il ramo "episode." non cambia: quei valori stanno nel file dell'episodio
    // e non hanno mai avuto niente a che fare con APP_CONFIG.
    var root = isEpisodeLocal ? episodeData : tables;
    var path = (isEpisodeLocal ? tableRef.slice('episode.'.length) : tableRef).split('.');
    var val = root;
    for (var i = 0; i < path.length && val; i++) { val = val[path[i]]; }
    var tutte = val || [];
    if (!righe || !righe.length) return tutte;
    return righe.map(function (id) {
      return tutte.find(function (r) {
        return (r && typeof r === 'object' ? r.value : String(r)) === id;
      });
    }).filter(Boolean);
  }

  // Builds the slotFields array a loaded episode.data.personalizationTablesUsed
  // describes — same shape (key/label/type/options/def/group/narrow) the
  // rest of the customization code already expects, so nothing downstream
  // (renderSlotGrid, the Request Box, fillTemplate's slot lookups, …) needs
  // to know this now comes from the episode's data file instead of being
  // hardcoded per episode here.
  function buildSlotFields(episodeData, tables) {
    return (episodeData.personalizationTablesUsed || []).map(function (slot) {
      return {
        key: slot.key,
        label: slot.label,
        type: slot.type,
        options: resolveSlotTable(slot.table, episodeData, tables, slot.rows),
        def: slot.default,
        group: slot.group,
        narrow: slot.narrow
        // ⚠️ QUI C'ERA `isPersonName`, USCITO IL 2026-09-20 (passo 1.8).
        //
        // Diceva «questo slot pesca da una tabella `people.*`, quindi il suo
        // valore non si traduce», e lo ricavava dal nome della tabella:
        // `slot.table.indexOf('people.') === 0`. Era esatto e viveva nel posto
        // sbagliato — **una proprieta' della RIGA, decisa dal contenitore**.
        //
        // Adesso ogni riga del magazzino porta `traducibile`, e chi lo legge e'
        // `resolveSlotValue` (app/ui-condivisa.js), dove sta la nota per esteso.
        // Il comportamento e' identico: ogni riga ha ricevuto il valore che la
        // deduzione le dava.
      };
    });
  }

  // Fetches (once, cached) the episode's own data file and populates
  // episode.slotFields from its personalizationTablesUsed — every place
  // that touches .slotFields (Customize's grid, the Request Box, a
  // module's fillTemplate calls) goes through this first, so a new
  // episode with different personalization categories needs only its own
  // JSON file, never a change to this code.
  var episodeSlotFieldsPromises = {};

  // ⚠️ IL 2026-09-18 ERA TORNATA IN `index.html`, ED E' QUI CHE DOVEVA ANDARE.
  //
  // Quel giorno fu il tredicesimo confine corretto dal criterio: stava nella
  // regione di Personalizza per POSIZIONE, e la chiama anche
  // `openModuleFromMap` — cioe' la mappa, PRIMA di aprire QUALUNQUE modulo.
  // Riportarla in `index.html` fermo' il danno e lascio' aperta la domanda:
  // il suo posto non era «dove stava prima», era «dove sta chi la chiama».
  // Da oggi ci sta, insieme al suo chiamante, e `app/personalizza.js` smette
  // di chiederla all'insu'. La sua cache `episodeSlotFieldsPromises` viaggia
  // con lei e non e' mai stata separata.
  function ensureEpisodeSlotFields(episode) {
    if (episode.slotFields) return Promise.resolve(episode.slotFields);
    if (!episodeSlotFieldsPromises[episode.id]) {
      // Due fetch, non uno, e in parallelo: il file dell'episodio dice QUALI
      // slot servono, il magazzino dice COSA c'e' dentro ciascuno. Prima il
      // secondo era in memoria per costruzione (stava in APP_CONFIG), quindi
      // qui bastava aspettare il primo.
      episodeSlotFieldsPromises[episode.id] = Promise.all([
        loadEpisodeData(episode),
        loadPersonalizationTables()
      ]).then(function (r) {
        episode.slotFields = buildSlotFields(r[0], r[1]);
        return episode.slotFields;
      }).catch(function (e) {
        // Qui si memorizza una PROMISE, non un dato: senza questa riga una
        // promise respinta resterebbe in cache per sempre, e ogni tentativo
        // successivo — "Riprova" della schermata d'errore compreso —
        // fallirebbe subito riusando il vecchio rifiuto, senza nemmeno
        // riprovare il fetch. loadEpisodeData invece mette in cache solo il
        // dato riuscito, quindi non ha lo stesso problema.
        delete episodeSlotFieldsPromises[episode.id];
        throw e;
      });
    }
    return episodeSlotFieldsPromises[episode.id];
  }
  BI.ensureEpisodeSlotFields = ensureEpisodeSlotFields;

  // ⚠️ IL 2026-09-18 ERA TORNATA IN `index.html`, E VALE LA STESSA COSA.
  //
  // Dodicesimo confine corretto dal criterio: stava nella regione di
  // Personalizza per POSIZIONE, non per mestiere, e il suo unico chiamante e'
  // `openEpisodeMap`. Estraendola col modulo, la mappa moriva con
  // `migrateCustomizeSeenToModuleProgress is not defined`.
  //
  // Sta qui e non in `app/mappa.js`, che e' chi la chiama, per una ragione
  // sola: come `openModuleFromMap` legge `ID_PERSONALIZZA` e i progressi, e
  // come lei sistema lo stato di un episodio PRIMA che qualcosa si apra.
  //
  // ⚠️ `app/mappa.js` continua quindi a chiamarla con `BI.`, e questo file e'
  // caricato DOPO di lui: e' una chiamata in avanti, la stessa forma che
  // questo passo elimina verso `index.html`. La differenza e' il MOMENTO —
  // `openEpisodeMap` gira quando l'utente apre la mappa, non al parsing,
  // quindi l'ordine dei tag non e' un vincolo. Lo strumento lo dice da solo:
  // `mappa.js -> apertura.js [chiamata]`, e sarebbe rosso se fosse `parsing`.
  function migrateCustomizeSeenToModuleProgress(episode, userName) {
    if (!isCustomizeSeen(episode.id, userName)) return;
    // ...ma solo se questo episodio Personalizza ce l'ha davvero. Gira in
    // cima a openEpisodeMap() per QUALUNQUE episodio, e prima scriveva
    // 'personalizzazione' nei progressi anche di uno che quel passo non lo
    // dichiara: spazzatura nei progressi salvati, innocua finche' nessuno
    // rilegge quell'id. Il primo episodio senza Personalizza — gli episodi
    // corti, o i grammaticali — e' dove smette di essere innocua.
    var haIlModulo = (episode.modules || []).some(function (m) {
      return m.moduleId === ID_PERSONALIZZA;
    });
    if (!haIlModulo) return;
    var progress = loadModuleProgress(episode.id, userName);
    if (progress.completed.indexOf(ID_PERSONALIZZA) === -1) {
      markModuleCompleted(episode, userName, ID_PERSONALIZZA);
    }
  }
  BI.migrateCustomizeSeenToModuleProgress = migrateCustomizeSeenToModuleProgress;

  // Apre un modulo risolvendolo DAL REGISTRO, non da una catena di else-if.
  //
  // ⚠️ CAMBIO DI COMPORTAMENTO VOLUTO, NON UNA CONSEGUENZA: IL `kind` DIVENTA
  // LA CHIAVE UNICA.
  //
  // Prima, quattro rami su otto non guardavano il `kind` ma una PROPRIETA' del
  // descrittore — `storyProfile`, `voiceVariant`, `dialogoProfile`,
  // `flashcardDirection`. Quindi un modulo con `dialogoProfile` e un `kind`
  // sconosciuto **si apriva lo stesso**. Adesso no: va alla schermata
  // d'errore.
  //
  // E' il difetto degli episodi corti chiuso una seconda volta, da un'altra
  // parte (un passo il cui `kind` non corrisponde a niente diventava una riga
  // cliccabile e muta, che bloccava per sempre tutti i passi dopo). **Se un
  // giorno un episodio smettesse di aprirsi, questa e' la prima riga da
  // leggere.**
  //
  // Torna una PROMESSA perche' dal passo 22 risolvere un modulo potra'
  // significare caricarne il file. Oggi il registro e' gia' pieno al boot,
  // quindi la promessa e' sempre gia' risolta: non cambia niente per chi
  // chiama, ed e' il punto in cui il caricamento a richiesta si agganchera'
  // senza toccare nessun altro.
  function openModuleByKind(module) {
    var apri = BI.moduli[module.kind];
    if (apri) {
      apri(module);
      return Promise.resolve();
    }
    // ---- IL RAMO CHE PROTEGGE GLI EPISODI CORTI, conservato e non riscritto.
    //
    // Senza, un modulo il cui kind non corrisponde a niente diventava una riga
    // cliccabile che NON FA NULLA: lo stato di un passo e' derivato ("il primo
    // non completato e' l'attuale"), quindi quel passo restava attuale per
    // sempre e bloccava tutti quelli dopo, senza un errore in console. Un
    // vicolo cieco muto.
    //
    // Si riusa la schermata d'errore invece di inventarne una: dice che
    // qualcosa non va e offre l'uscita verso la mappa (regola 35). Il
    // "Riprova" rifara' la stessa strada e fallira' di nuovo — ed e' giusto
    // cosi': e' rotto, e la via d'uscita e' l'altro pulsante.
    //
    // ⚠️ DUE CAUSE, UN MESSAGGIO SOLO PER LO STUDENTE — e la distinzione sta
    // in console, non a schermo.
    //
    // Lo studente non puo' fare niente di diverso: l'uscita e' la mappa in
    // entrambi i casi. Chi indaga invece ha davanti due strade OPPOSTE —
    // «l'episodio dichiara un kind che non esiste» contro «il file del modulo
    // non e' arrivato» — e senza la distinzione le prova tutte e due.
    //
    // La seconda causa NON ESISTE ANCORA: oggi il registro si riempie tutto al
    // boot, quindi un kind mancante e' sempre la prima. Nasce al passo 22, e
    // la riga si scrive adesso perche' il giorno che nasce nessuno si
    // ricorderebbe di aggiungerla.
    console.error('[modulo] kind "' + module.kind + '" non e\' nel registro. ' +
      (BI.moduliCaricatiAlBoot
        ? 'Tutti i moduli sono caricati al boot, quindi l\'episodio dichiara un kind che non esiste.'
        : 'Il file di questo modulo potrebbe non essere arrivato.'));
    showLoadError(function () { openModuleFromMap(module); });
    return Promise.resolve();
  }


  // Aprire un modulo dalla mappa e' una funzione con un nome, non il corpo
  // di un listener: "Riprova" della schermata d'errore deve poter rifare
  // ESATTAMENTE questa apertura (CLAUDE.md regola 20 — il comportamento sta
  // nella funzione, non nel punto che la richiama).
  // A module's own fillTemplate calls still need currentEpisode.slotFields
  // AND currentValues populated — on a fresh page load neither exists yet,
  // so make sure they're there first. loadCustomValues is a cheap
  // synchronous localStorage read, so refreshing it here even when already
  // set costs nothing and keeps it correct after a user switch.
  function openModuleFromMap(module) {
    // I dati che il modulo leggera' devono esserci PRIMA che la sua schermata
    // compaia, ed e' il punto unico dove garantirlo per tutti e otto:
    // ensureEpisodeSlotFields per la personalizzazione, loadEpisodeData per il
    // contenuto. Oggi sono lo stesso file, quindi il secondo e' gia' in cache
    // quando il primo ha finito — **e scriverlo lo stesso trasforma in una
    // garanzia quella che oggi e' una coincidenza.**
    //
    // ⚠️ IL BENEFICIO DI QUESTA RIGA E' TEORICO, e va scritto perche' chi la
    // trova non la tolga credendola inutile: dopo aver levato il
    // precaricamento da openVoiceCoach (vedi il commento li') la finestra
    // "schermata pronta, dati assenti" e' gia' chiusa in pratica. Questa riga
    // serve a renderla **impossibile** invece che irraggiungibile — cioe' a
    // coprire il giorno in cui un modulo avra' un dataFile suo, o verra'
    // aperto da un punto che non e' la mappa.
    //
    // La strada alternativa era spegnere i pulsanti di lavoro in ognuno degli
    // otto moduli: scartata perche' sarebbe stata la NONA famiglia della
    // conoscenza che ogni file deve ricordarsi da solo (vedi docs/decisioni-stato.md),
    // aggiunta proprio mentre ne stiamo chiudendo quattro.
    // ⚠️ Personalizza NON legge il file dell'episodio: nel suo descrittore non
    // c'e' `dataFile` (MODULE_DESCRIPTORS), ed e' l'unica eccezione fra i
    // sedici. Chiederglielo lo fa fallire e apre la schermata d'errore su un
    // modulo che funziona — misurato il 2026-09-10, cinque file di test rossi
    // alla prima corsa di questa riga. La condizione si legge dal descrittore,
    // non da un elenco a parte da tenere allineato a mano.
    // ⚠️ E DAL PASSO 18 ANCHE I TESTI, per la stessa ragione dei dati.
    // I testi dell'interfaccia stanno in istruzioni-moduli.json (regola 8) e
    // molti li scrivono funzioni SINCRONE — setVcState cambia la didascalia
    // del microfono mentre registri. Quelle leggono la cache con uiText(),
    // che senza questa riga trova `null` e rende una stringa vuota: misurato
    // il 15 settembre, il modulo si apriva con l'aria-label del Blocco
    // Ascolto e la didascalia del microfono VUOTI.
    //
    // ⚠️ E il difetto era una MOTIVAZIONE FALSA, non una dimenticanza: il
    // commento di uiText() diceva «funziona perche' openModuleFromMap fa gia'
    // Promise.all([loadEpisodeData, loadModuleInstructions])». Non lo faceva.
    // L'ho scoperto guidando l'app, non rileggendola.
    //
    // Se il file dei testi non arriva, il .then non gira e il modulo NON si
    // apre: si va alla schermata d'errore. E' la scelta della regola 35 —
    // un'interfaccia che si svuota non e' un caso da gestire, e' un caso da
    // rendere impossibile.
    Promise.all([
      ensureEpisodeSlotFields(BI.episodioCorrente()),
      module.dataFile ? loadEpisodeData(module) : Promise.resolve(null),
      loadModuleInstructions(),
      // La quarta voce, dal passo 1.8-bis (4): la mappa che traduce un id
      // salvato vecchio nel suo id di oggi. Sta qui e non dentro
      // `loadCustomValues` perche' quella e' sincrona — vedi la sua firma.
      BI.loadPersonalizationMigrations()
    ]).then(function (r) {
      BI.impostaValoriCorrenti(loadCustomValues(BI.episodioCorrente(), getUserName(), r[3]));
      return openModuleByKind(module);
    }).catch(function () {
      // Senza questo il tocco sulla riga non produceva NIENTE: nessuna
      // schermata, nessun messaggio, il modulo semplicemente non si apriva.
      showLoadError(function () { openModuleFromMap(module); });
    });
  }

  document.getElementById('module-list').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-module]');
    if (!btn || btn.disabled) return;
    var module = BI.episodioCorrente().modules.find(function (m) { return m.id === btn.getAttribute('data-module'); });
    if (!module) return;
    // Personalizza is module #1 (see CONFIG.sequences), so every other
    // module is naturally locked until it's completed — no separate
    // "seen Customize yet?" gate needed here anymore (see
    // migrateCustomizeSeenToModuleProgress for the old flag's one-time
    // migration).
    openModuleFromMap(module);
  });

  BI.openModuleFromMap = openModuleFromMap;
})(window.BI);
