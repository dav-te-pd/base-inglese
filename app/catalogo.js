// DIPENDE DA: dati.js [parsing]
// ⚠️ IL CATALOGO. Passo C1, 2026-09-19.
//
// Chi sono gli episodi, quali passi hanno, in che ordine, e con quale grado
// ciascuno. `MODULE_DESCRIPTORS`, `EPISODES`, `buildEpisodes`,
// `buildModulesById`, `moduleStepId`, `resolveEpisodeOrder`.
//
// ⚠️ ED È PIÙ SEPARABILE DI QUANTO AVESSI DICHIARATO NELLA VALUTAZIONE.
//
// Avevo scritto che C si spezzava in «C1 le funzioni, meccanico» e «C2 i
// valori, che ha una decisione dentro». **Il confine non era lì.** Misurato:
// questo blocco intero — funzioni E valori — chiama **un nome solo** fuori da
// sé (`episodeDataFile`, da `dati.js`) e legge `CONFIG`.
//
// Il motivo è che i valori che il catalogo COSTRUISCE non stanno qui: stanno
// in `CONFIG.sequences` e `CONFIG.episodes`, cioè in `app/config.js`, dove
// sono da sempre. **Questo file è codice che legge la configurazione** — e il
// giorno in cui quella configurazione diventerà file per edizione e per lingua
// d'interfaccia, leggerà quelli senza cambiare forma.
//
// *Quindi C2 non è «i valori di questo file diventano dati»: è «`CONFIG` si
// spezza per edizione», ed è un lavoro su `app/config.js` e su `data/`, non
// qui. La divisione era giusta; il confine stava un pezzo più in là.*
//
// ⚠️ UNA COSA CHE RESTA IN index.html DI PROPOSITO: la SCELTA di quale
// episodio aprire. Questo file dice quali episodi esistono; scegliere quello
// corrente legge `CONFIG.episodioCorrente` e lo CONSEGNA allo stato di
// sessione (passo B). *Dire cosa esiste e scegliere cosa aprire sono due
// mestieri, e il secondo cambierà quando ci sarà il pannello utente.*

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var episodeDataFile = BI.episodeDataFile;

  /* ============================================================
     EPISODES — costruito dalla sequenza, non scritto a mano

     Un episodio dichiara SOLO quello che è suo: il badge e il contenuto del
     suo dialogo. Il resto — l'id, il percorso del file dati, i quindici
     descrittori dei moduli — lo mette buildEpisodes, perché è uguale per
     tutti e ricavabile.

     Perché: fino al 2026-09-09 `modulesById` era scritto per esteso dentro
     ogni episodio. Misurati il 2026-09-09, i due erano identici a meno del
     dataFile: quindici descrittori e quindici, ZERO differenze. Il terzo
     episodio sarebbe nato copiando quindici righe, il ventesimo copiandone
     trecento — e una divergenza fra due copie non si sarebbe vista, perché
     ogni episodio passa i propri test mentre è diverso dal vicino.

     ⚠️ NON c'è un meccanismo per fare eccezione, ed è una scelta. Oggi
     nessun episodio vuole un descrittore diverso dagli altri; inventare
     adesso il modo di dirlo significherebbe inventarlo senza un caso vero,
     cioè inventarlo male. Quando servirà, servirà per una ragione precisa, e
     quella ragione dirà anche che forma deve avere. Chi arriva qui con un
     caso vero: aggiungerlo è il momento giusto, aggiungerlo per simmetria no.

     slotFields NON si dichiara: si costruisce a runtime dal
     "personalizationTablesUsed" del file dati (ensureEpisodeSlotFields /
     buildSlotFields), così un episodio con categorie di personalizzazione
     nuove ha bisogno solo del proprio JSON.
     ============================================================ */


  /* I quindici moduli, scritti UNA VOLTA per tutti gli episodi.

     Qui sta solo ciò che NON dipende da dove il modulo è messo: il `kind`,
     la direzione, il profilo, la categoria. Il GRADO non c'è — lo decide la
     coppia { module, grade } della sequenza (regola 4), così lo stesso
     descrittore serve tutte le apparizioni dello stesso modulo su gradi
     diversi. E non ci sono `label`/`subtitle`: quelli vengono da
     CONFIG.moduleLabels, l'unico posto dove vive il nome mostrato.

     `dataFile: true` vuol dire "questo modulo legge il file dell'episodio";
     buildEpisodes lo sostituisce col percorso vero. Personalizzazione non ce
     l'ha perché non legge contenuto, ed è la stessa assenza che
     moduleUsesGrade guarda per non mostrarle il pulsante del grado.

     I testi howItWorks/helpReminder di ogni kind stanno in
     data/inglese/it/inglese-it-istruzioni-moduli.json (regola 8), non qui. */
  // ── L'UNICO PUNTO IN CUI L'APP, DA FUORI, SA COME SI CHIAMA IL CANCELLO ──
  //
  // Personalizza non e' un modulo come gli altri: e' il passo che, finche' non
  // e' completato, tiene chiusi quelli dopo. Due funzioni che NON gli
  // appartengono — `migrateCustomizeSeenToModuleProgress` e
  // `hasStartedEpisodeModules`, che stanno coi progressi e con la mappa —
  // hanno bisogno di sapere quale passo sia, e fino al 2026-09-18 lo sapevano
  // scrivendo il suo id a mano in quattro righe.
  //
  // ⚠️ LA PREMESSA DEL PASSO 23 NON E' «ZERO RIFERIMENTI»: E' «UNO SOLO, E
  // DICHIARATIVO». Un modulo che nessuno puo' nominare non si puo' nemmeno
  // mettere in sequenza — il catalogo lo nomina per forza, ed e' un dato. Il
  // difetto non era che Personalizza fosse nominata: era che lo fosse in
  // quattro punti sparsi, ognuno dei quali diventa un file diverso al 23.
  //
  // ⚠️ E LA STRADA CHE HO SCARTATO, scritta perche' e' quella che verrebbe in
  // mente per seconda: usare `type: 'inizio'`, che oggi ce l'ha solo lei.
  // Funzionerebbe, e sarebbe sbagliato — quel campo dice **che etichetta
  // mostrare allo studente**, e fargli dire anche **chi fa da cancello** gli
  // darebbe due mestieri. Il giorno che nasce un secondo passo di categoria
  // Inizio, i due significati divergono e uno dei due diventa falso in
  // silenzio. E' la famiglia ⓪-decies, e costa piu' di una costante.
  var ID_PERSONALIZZA = 'personalizzazione';

  var MODULE_DESCRIPTORS = {
    // Categoria "Inizio" (docs/inglese/it/inglese-it-struttura-corso.md): è preparazione,
    // non studio. Prima era uno "studio" con l'etichetta sovrascritta a mano,
    // perché la categoria non esisteva ancora.
    personalizzazione: { kind: 'personalizzazione', type: 'inizio' },
    repeatAloud: { kind: 'repeatAloud', dataFile: true, type: 'studio' },
    // Due moduli, un componente solo (openStoryCards e dintorni): li
    // distingue storyProfile, che decide se le traduzioni si vedono sempre e
    // se ci sono le skill.
    meetTheStory: { kind: 'meetTheStory', dataFile: true, storyProfile: 'meet', type: 'studio' },
    whyWeSayIt: { kind: 'whyWeSayIt', dataFile: true, storyProfile: 'why', type: 'studio' },
    // Due moduli, un componente solo: voiceVariant decide quale tentativo
    // conta (LastAttemptRule per practice, FirstAttemptRule per check) e se
    // c'è il ripasso finale.
    voicePractice: { kind: 'voicePractice', dataFile: true, voiceVariant: 'practice', type: 'studio' },
    voiceCoach: { kind: 'voiceCoach', dataFile: true, voiceVariant: 'check', type: 'quiz' },
    matchEngIta: { kind: 'matchEngIta', dataFile: true, type: 'studio' },
    matchItaEng: { kind: 'matchItaEng', dataFile: true, type: 'studio' },
    // Tre moduli, un componente solo: dialogoProfile decide countdown,
    // ripetizione e chi parla.
    dialogoAscoltaRipeti: { kind: 'dialogoAscoltaRipeti', dataFile: true, dialogoProfile: 'ascoltaRipeti', type: 'dialogo' },
    dialogoRipetiATempo: { kind: 'dialogoRipetiATempo', dataFile: true, dialogoProfile: 'ripetiATempo', type: 'dialogo' },
    dialogoContinuo: { kind: 'dialogoContinuo', dataFile: true, dialogoProfile: 'continuo', type: 'dialogo' },
    speedMatchEngIta: { kind: 'speedMatchEngIta', dataFile: true, type: 'quiz' },
    speedMatchItaEng: { kind: 'speedMatchItaEng', dataFile: true, type: 'quiz' },
    // Un kind solo, due direzioni: flashcardDirection le distingue.
    flashcardAEngIta: { kind: 'flashcard', dataFile: true, flashcardDirection: 'en-it', type: 'studio' },
    flashcardAItaEng: { kind: 'flashcard', dataFile: true, flashcardDirection: 'it-en', type: 'studio' }
  };

  // Ogni episodio riceve la SUA copia dei descrittori, non quella condivisa:
  // il dataFile è diverso per ognuno, e un oggetto condiviso fra episodi si
  // farebbe modificare da uno e cambierebbe anche agli altri.
  function buildModulesById(episodeId) {
    var file = episodeDataFile(episodeId);
    var out = {};
    Object.keys(MODULE_DESCRIPTORS).forEach(function (moduleId) {
      var descrittore = MODULE_DESCRIPTORS[moduleId];
      var copia = {};
      Object.keys(descrittore).forEach(function (k) {
        copia[k] = k === 'dataFile' ? file : descrittore[k];
      });
      out[moduleId] = copia;
    });
    return out;
  }

  function buildEpisodes(propri) {
    var out = {};
    Object.keys(propri).forEach(function (episodeId) {
      var episodio = { id: episodeId, dataFile: episodeDataFile(episodeId) };
      Object.keys(propri[episodeId]).forEach(function (k) { episodio[k] = propri[episodeId][k]; });
      episodio.modulesById = buildModulesById(episodeId);
      out[episodeId] = episodio;
    });
    return out;
  }

  var EPISODES = buildEpisodes({
    gate: {
      badge: 'Episodio 1',
      // ⚠️ `segments` è CODICE MORTO, e resta qui solo perché toglierlo
      // cambierebbe questo oggetto: lo legge solo buildTargetTokens, cioè la
      // vista `pronunciation`, che non è raggiungibile da nessun punto
      // dell'app (nessuno chiama startPronunciationExercise). Sparisce
      // insieme a quella vista, allo spacchettamento — è registrato in
      // docs/decisioni-stato.md fra le pulizie rimandate. Non è né contenuto
      // dell'episodio né struttura: è un residuo.
      //
      // Fixed words are authored individually so punctuation stays attached
      // to the right word; slots expand to one or more words at render time.
      segments: [
        { text: "Hello," }, { text: "I'm" }, { slot: 'papa', suffix: '.' },
        { text: "This" }, { text: "is" }, { slot: 'mamma', suffix: ',' },
        { text: "my" }, { text: "wife." }, { text: "Our" }, { text: "children" }, { text: "are" },
        { slot: 'figliaNome', suffix: ',' }, { text: "who" }, { text: "is" }, { slot: 'figliaEta' },
        { text: "years" }, { text: "old," }, { text: "and" }, { slot: 'figlioNome', suffix: ',' },
        { text: "who" }, { text: "is" }, { slot: 'figlioEta' }, { text: "years" }, { text: "old." },
        { text: "We" }, { text: "are" }, { text: "leaving" }, { slot: 'partenza' },
        { text: "and" }, { text: "flying" }, { text: "to" }, { slot: 'destinazione', suffix: '.' }
      ]
    },
    // Episodio 2 — "Sulla porta dell'aereo"
    // (docs/inglese/it/inglese-it-aircraft-door.md).
    'aircraft-door': {
      badge: 'Episodio 2'
    }
  });

  // Resolves each episode's own CONFIG.episodes.<id>.moduleOrder — or,
  // when it declares none (every episode today), the shared CONFIG.
  // la sequenza dichiarata — against that episode's own modulesById into the
  // ordered "modules" array every other function already reads, portando
  // su ogni modulo il grado dichiarato dalla sua coppia
  // (renderModuleList, moduleStatus, openModuleByKind,
  // ensureEpisodeSlotFields, ...) — none of them change: reordering a
  // step for one episode is moving a line in its own moduleOrder;
  // reordering it for every episode at once is moving a line in
  // la sequenza dichiarata. Nothing here changes either way. Also attaches
  // .label/.subtitle from CONFIG.moduleLabels[id] — the one place the
  // displayed name lives — onto every module object, so every existing
  // reader of module.label (map, Spiegazione title, module headers) picks
  // up the new name without itself changing.
  // L'id del passo, dato l'id del modulo e quante volte lo stesso modulo è
  // già comparso più su nella sequenza. La prima apparizione tiene l'id
  // nudo del modulo — così i progressi già salvati (moduleProgressKey) e
  // ogni riferimento esistente restano validi finché un modulo compare una
  // volta sola, che è il caso di oggi; una seconda apparizione dello stesso
  // modulo su un altro grado prende un id proprio, invece di sovrascrivere
  // in silenzio i progressi della prima.
  function moduleStepId(moduleId, seenBefore) {
    return seenBefore ? moduleId + '-' + (seenBefore + 1) : moduleId;
  }

  // COSA VINCE, e non c'e' una quarta possibilita':
  //
  //   | dichiara            | vale                                        |
  //   |---------------------|---------------------------------------------|
  //   | solo `sequence`     | quella sequenza                             |
  //   | solo `moduleOrder`  | quell'ordine, scritto per intero            |
  //   | tutte e due         | ERRORE — si dice, non si sceglie in silenzio |
  //   | niente              | ERRORE — nessun default implicito           |
  //
  // Il caso "tutte e due" e' l'unico che potrebbe essere risolto zitti
  // scegliendone una, ed e' proprio per questo che non lo si fa: chi ha
  // scritto entrambe crede che valga quella che sta guardando, e ha il 50%
  // di probabilita' di sbagliarsi per sempre.
  //
  // "Niente" e' un errore per la stessa ragione per cui moduleOrderDefault
  // non e' sopravvissuto: un default implicito e' una sequenza che nessuno
  // ha scelto e che tutti ereditano. Il primo episodio corto avrebbe preso
  // i ventidue passi narrativi senza che nessuno l'avesse deciso.
  //
  // Perche' NON alza un'eccezione: gira dentro `costruisciPassi()`, cioe'
  // all'accensione dell'app, prima che si veda qualunque schermata. Un throw
  // li' fermerebbe `boot()` a meta' e lascerebbe una pagina bianca — un
  // guasto peggiore di quello che segnala. Restituisce invece l'errore, che
  // openEpisodeMap trasforma nella schermata d'errore (regola 35): lo
  // studente vede qualcosa, e chi sviluppa lo trova anche in console.
  //
  // *Fino al 2026-09-20 questa riga diceva «gira al caricamento dello
  // script, dentro il ciclo che costruisce EPISODES»: era vero, e l'ha resa
  // falsa il passo 1.11a spostando quel ciclo dentro una funzione.*
  //
  // ⚠️ I MESSAGGI QUI DENTRO RESTANO NEL CODICE, DI PROPOSITO — non sono una
  // dimenticanza del passo 18. Sono DIAGNOSTICA D'AUTORE: parlano a chi
  // COMPONE un episodio, non a chi studia. Stessa scelta per
  // episodeGradeRequired e buildTargetTokens.
  //
  // E oltre alla categoria c'e' un argomento pratico: chi sbaglia a comporre
  // un episodio sta guardando il codice e i dati. Mandarlo a cercare il
  // messaggio in un terzo file rende piu' difficile proprio la cosa che quel
  // messaggio serve a risolvere.
  function resolveEpisodeOrder(episodeId) {
    var ep = (CONFIG.episodes && CONFIG.episodes[episodeId]) || {};
    var haOrdine = Array.isArray(ep.moduleOrder);
    var haSequenza = typeof ep.sequence === 'string' && ep.sequence.length > 0;
    if (haOrdine && haSequenza) {
      return { order: [], errore: 'L\'episodio "' + episodeId + '" dichiara sia una sequenza ("' +
        ep.sequence + '") sia un moduleOrder proprio: sono due risposte alla stessa domanda, e va tenuta una sola.' };
    }
    if (haOrdine) return { order: ep.moduleOrder, errore: null };
    if (!haSequenza) {
      return { order: [], errore: 'L\'episodio "' + episodeId +
        '" non dichiara nessuna sequenza. Ogni episodio deve dichiarare la sua: non esiste piu\' una sequenza di default.' };
    }
    var seq = CONFIG.sequences && CONFIG.sequences[ep.sequence];
    if (!Array.isArray(seq)) {
      return { order: [], errore: 'L\'episodio "' + episodeId + '" chiede la sequenza "' + ep.sequence +
        '", che non esiste in CONFIG.sequences.' };
    }
    return { order: seq, errore: null };
  }

  // ⚠️ I PASSI DI OGNI EPISODIO SI COSTRUISCONO ALL'ACCENSIONE, NON A TEMPO
  // DI PARSING. Passo 1.11a, 2026-09-20.
  //
  // Prima questo ciclo girava nudo, appena lo script veniva letto. Funzionava
  // perche' quello che legge — `CONFIG.sequences` e `CONFIG.episodes` — stava
  // gia' in memoria: `app/config.js` e' un tag bloccante caricato prima.
  //
  // ⚠️ E SMETTE DI FUNZIONARE AL PASSO DOPO, PER UNA RAGIONE CHE NON E' UNA
  // PREFERENZA. Col 1.11b quei due valori arrivano da
  // `data/{lingua}/{studente}/struttura-corso.json`, cioe' da un `fetch`, che
  // e' asincrono. **E non si puo' evitare rendendolo un tag `<script>`
  // bloccante come `app/config.js`:** l'indirizzo di quel file dipende da
  // `CONFIG.edizione`, che e' un valore di RUNTIME, e un tag scritto in
  // `index.html` dovrebbe portare `data/inglese/it/` inciso dentro — cioe'
  // rimettere esattamente il guasto muto che il passo 1.11 ha appena tolto.
  //
  // *Quindi l'asincrono non e' una scelta di stile: e' la conseguenza di
  // avere l'edizione come valore.* Questo passo prepara la cucitura e non la
  // usa ancora: la sorgente e' la stessa di ieri, cambia solo il MOMENTO.
  //
  // Chi chiama: `boot()`, prima di scegliere l'episodio iniziale. Nessuno
  // legge `episode.modules` fra il caricamento degli script e quella riga —
  // i ventitre file di `app/` a tempo di parsing dichiarano soltanto.
  function costruisciPassi() {
    Object.keys(EPISODES).forEach(function (episodeId) {
      var episode = EPISODES[episodeId];
      var risolto = resolveEpisodeOrder(episodeId);
      var order = risolto.order;
      // L'errore viaggia con l'episodio: chi apre la mappa lo trova (vedi
      // openEpisodeMap) invece di trovare una mappa vuota senza spiegazione.
      episode.orderError = risolto.errore;
      if (risolto.errore) console.error('[base-inglese] ' + risolto.errore);
      var seen = {};
      // Una coppia con off: true e' spenta: sparisce dalla mappa invece di
      // restare grigia, cosi' provando un ordine si vede l'episodio come lo
      // vedra' lo studente. Il conteggio delle apparizioni (seen) si fa PRIMA
      // del filtro, cosi' spegnere il primo Flash Card non rinomina il secondo
      // — e riaccenderlo non sposta di nuovo i progressi.
      episode.modules = order.map(function (pair) {
        var moduleId = pair.module;
        var module = Object.assign({ id: moduleStepId(moduleId, seen[moduleId] || 0), moduleId: moduleId }, episode.modulesById[moduleId]);
        seen[moduleId] = (seen[moduleId] || 0) + 1;
        // Il grado arriva dalla coppia, non dal descrittore: è l'unica cosa
        // che distingue due apparizioni dello stesso modulo.
        if (pair.grade) module.grade = pair.grade;
        var labelInfo = CONFIG.moduleLabels[moduleId];
        module.label = (labelInfo && labelInfo.name) || moduleId;
        module.subtitle = labelInfo && labelInfo.subtitle;
        module.off = !!pair.off;
        return module;
      }).filter(function (module) { return !module.off; });
    });
  }

  /* ============================================================
     MODULE PROGRESS
     Which of an episode's modules a user has completed, persisted per
     user. Status of any module is derived from this, never stored
     directly: 'completed' if in the set, 'current' if it's the first
     one not yet completed, 'locked' otherwise. This is what keeps the
     map from ever letting a user skip ahead.
     ============================================================ */




  /* ============================================================
     MODULE OUTCOME (optional colored map badge)
     Separate from both moduleProgress (locked/current/completed
     unlock-sequencing above) and the per-word mastery store below: an
     optional self-assessed outcome for a whole module, today only used
     by Dialogo Ascolta e Ripeti's final "L'hai imparato?" ("Sì, lo so"
     -> verde/Completato, "Non ancora" -> giallo/Da rivedere — see
     renderModuleList). A module that never calls saveModuleOutcome just
     shows the plain "Completato" badge as before (CLAUDE.md rule 1 — no
     other module's map row changes).
     ============================================================ */




  BI.ID_PERSONALIZZA = ID_PERSONALIZZA;
  BI.MODULE_DESCRIPTORS = MODULE_DESCRIPTORS;
  BI.EPISODES = EPISODES;
  BI.moduleStepId = moduleStepId;
  BI.resolveEpisodeOrder = resolveEpisodeOrder;
  BI.costruisciPassi = costruisciPassi;
})(window.BI);
