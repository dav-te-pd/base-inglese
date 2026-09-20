// DIPENDE DA: magazzino.js [parsing]
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// LO STRATO `progressi` — il magazzino dei dati dello studente.
//
// Estratto da index.html il 2026-09-17 (passo 22). Non e' stato scritto:
// esisteva gia', sparso in nove punti del file, ed e' stato riconosciuto e
// spostato. Trentotto funzioni, zero dipendenze verso altri strati — misurato
// prima di muovere niente, ed e' la ragione per cui questo strato e' uscito
// prima di `vista`, che invece ne ha tre.
//
// ⚠️ COSA C'E' DENTRO, E COL CRITERIO INVECE CHE COLL'ELENCO: ogni funzione
// che tocca una chiave di PROGRESSO PER UTENTE, piu' il
// costruttore di quella chiave. Sono dodici chiavi. Restano fuori per
// costruzione le tre che progresso non sono — il nome (NAME_KEY), il tema
// (THEME_KEY) e gli override della configurazione — che stanno negli strati
// `identita` e `avvio`.
//
// ⚠️ E QUESTA ESTRAZIONE TOGLIE UNA GARANZIA, come ogni pezzo che esce:
// finche' queste funzioni stavano in linea, essere caricate prima del codice
// che le chiama era la forma del file. Adesso e' un tag da tenere nell'ordine
// giusto, e lo protegge un'asserzione di tests/test_progressi_estratto.js.
//
// ⚠️ PERCHE' I NOMI SI RAGGIUNGONO DA `BI` E NON DA `window`: il codice
// dell'app non ha mai avuto un solo nome globale a parte APP_CONFIG e BI, e
// dichiararne trentotto qui lo perderebbe in un colpo. Lo script principale
// li ritrova con un blocco di alias in cima al suo IIFE — vedi li' la nota
// che dice cos'e' e quando sparisce.
//
// ⚠️ E LA META' DEL VALORE CHE NON SI VEDE DAL DIFF: i dodici costruttori
// erano irraggiungibili da un `page.evaluate`, e per questo i file sotto
// tests/ scrivono a mano la forma delle chiavi in 197 punti. Adesso sono
// raggiungibili come `BI.moduleProgressKey(...)`. La conversione di quei 197
// punti NON e' di questo commit — un'estrazione che sposta e riscrive i test
// nello stesso giro non si sa piu' quale delle due cose ha rotto cosa.

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  // ── IL MAGAZZINO: UN PUNTO CHE LEGGE, UNO CHE SCRIVE, UNO CHE CANCELLA ──
  //
  // ⚠️ Prima di queste tre righe c'erano NOVE lettori e DIECI scrittori con lo
  // stesso identico corpo. Due coppie erano uguali CARATTERE PER CARATTERE a
  // meno della chiave: loadMastery/loadModuleOutcomes e
  // loadAudioUsage/loadNextLineSkips. Non erano accessi indipendenti allo
  // stesso spazio: erano la stessa funzione scritta due volte.
  //
  // E la ragione per cui si e' chiuso PRIMA di estrarre lo strato, invece di
  // scriverci accanto una nota: fra due mesi chi cambia uno dei lettori non ha
  // nessun modo di sapere che gli altri otto esistono — e dopo l'estrazione
  // staranno in un altro file, dove non li si incontra leggendo.
  // **Chiudere il caso costa meno che scrivere la nota che lo descrive, e
  // protegge di piu': la nota va trovata, il punto unico no.**
  //
  // ⚠️ `vuoto` E' UNA FUNZIONE, NON UN VALORE, e non e' uno scrupolo: passando
  // `{}` ogni chiamante riceverebbe LO STESSO oggetto, e il primo che lo
  // modifica lo modifica per tutti. Un difetto che non alza eccezioni e si
  // vede giorni dopo come un progresso comparso da solo.
  //
  // ⚠️ E UNA DIFFERENZA DI COMPORTAMENTO, dichiarata invece che nascosta: se
  // nel magazzino ci fosse un JSON "falso" (`null`, `0`, `false`, `""`) la
  // forma vecchia di loadMastery/loadModuleOutcomes lo restituiva, questa
  // ritorna il vuoto. Nessuno dei dieci scrittori puo' produrlo — scrivono
  // tutti oggetti o array — quindi nell'app la differenza non e'
  // osservabile, ed e' nella direzione sicura: `loadMastery(...)[id]` su
  // `null` sarebbe un'eccezione.
  //
  // Chi resta FUORI, e perche': isCustomizeSeen, isIntroDismissed e
  // setIntroDismissed non scrivono JSON — tengono la stringa '1'/'0'. Farli
  // passare di qui vorrebbe dire o cambiare il formato salvato (rompendo i
  // profili che ce l'hanno gia') o dare a queste funzioni una seconda
  // modalita': una cosa che risponde a due domande da' la risposta giusta a
  // una e sbagliata all'altra (famiglia ⓪-decies).
  // ⚠️ DAL 2026-09-20 (passo 1.7) QUESTE TRE NON TOCCANO PIU' `localStorage`:
  // lo tocca `app/magazzino.js`, l'unico file che sa DOVE si salva. Restano
  // qui come nomi perche' i loro venti chiamanti sono qui, ma il `try/catch` e
  // il `JSON.parse` se ne sono andati — *erano la stessa riga scritta
  // diciassette volte.*
  var leggiMagazzino = BI.magLeggiJson;
  var scriviMagazzino = BI.magScriviJson;
  var cancellaMagazzino = BI.magCancella;

  function helpRequestsKey(userName) {
    return 'baseinglese:helpRequests:' + userName;
  }

  function loadHelpRequests(userName) {
    return leggiMagazzino(helpRequestsKey(userName),
      function () { return []; },
      function (p) { return Array.isArray(p); });
  }

  function saveHelpRequest(userName, entry) {
    var list = loadHelpRequests(userName);
    list.push(entry);
    scriviMagazzino(helpRequestsKey(userName), list);
  }

  function masteryStorageKey(episodeId, userName) {
    return 'baseinglese:mastery:' + episodeId + ':' + userName;
  }

  function loadMastery(episodeId, userName) {
    return leggiMagazzino(masteryStorageKey(episodeId, userName), function () { return {}; });
  }

  function saveMastery(episodeId, userName, mastery) {
    scriviMagazzino(masteryStorageKey(episodeId, userName), mastery);
  }

  function moduleProgressKey(episodeId, userName) {
    return 'baseinglese:modules:' + episodeId + ':' + userName;
  }

  function loadModuleProgress(episodeId, userName) {
    return leggiMagazzino(moduleProgressKey(episodeId, userName),
      function () { return { completed: [] }; },
      function (p) { return Array.isArray(p.completed); });
  }

  function markModuleCompleted(episode, userName, moduleId) {
    var progress = loadModuleProgress(episode.id, userName);
    if (progress.completed.indexOf(moduleId) === -1) progress.completed.push(moduleId);
    scriviMagazzino(moduleProgressKey(episode.id, userName), progress);
    return progress;
  }

  function moduleOutcomeKey(episodeId, userName) {
    return 'baseinglese:moduleOutcome:' + episodeId + ':' + userName;
  }

  function loadModuleOutcomes(episodeId, userName) {
    return leggiMagazzino(moduleOutcomeKey(episodeId, userName), function () { return {}; });
  }

  // outcome: { level: 'verde' | 'giallo', ...any module-specific stats —
  // e.g. Dialogo Ascolta e Ripeti also stores linesListened/linesTotal.
  // renderModuleList only ever reads outcome.level.
  function saveModuleOutcome(episode, userName, moduleId, outcome) {
    var outcomes = loadModuleOutcomes(episode.id, userName);
    outcomes[moduleId] = outcome;
    scriviMagazzino(moduleOutcomeKey(episode.id, userName), outcomes);
  }

  function audioUsageKey(episodeId, userName) {
    return 'baseinglese:audioSecondsSent:' + episodeId + ':' + userName;
  }

  function loadAudioUsage(episodeId, userName) {
    return leggiMagazzino(audioUsageKey(episodeId, userName),
      function () { return { byModule: {} }; },
      function (p) { return !!p.byModule; });
  }

  function addAudioSecondsSent(episodeId, userName, moduleId, seconds) {
    var usage = loadAudioUsage(episodeId, userName);
    usage.byModule[moduleId] = (usage.byModule[moduleId] || 0) + seconds;
    scriviMagazzino(audioUsageKey(episodeId, userName), usage);
    return usage;
  }

  // Job: "Prossima frase" usage count (Dialogue: Repeat in Time) — same
  // per-episode/per-user/per-module shape as audioUsageKey/loadAudioUsage
  // above (CLAUDE.md rule 13), read-only tuning data (not a graded
  // outcome): a module used often means dialogo.pausaBase/pausaPerParola
  // are running too long for real speech.
  function nextLineSkipsKey(episodeId, userName) {
    return 'baseinglese:nextLineSkips:' + episodeId + ':' + userName;
  }

  function loadNextLineSkips(episodeId, userName) {
    return leggiMagazzino(nextLineSkipsKey(episodeId, userName),
      function () { return { byModule: {} }; },
      function (p) { return !!p.byModule; });
  }

  function addNextLineSkip(episodeId, userName, moduleId) {
    var usage = loadNextLineSkips(episodeId, userName);
    usage.byModule[moduleId] = (usage.byModule[moduleId] || 0) + 1;
    scriviMagazzino(nextLineSkipsKey(episodeId, userName), usage);
    return usage;
  }

  // La forma del magazzino ha un numero, e serve a una cosa sola: i dati
  // scritti con la forma vecchia non si possono leggere con questa (i
  // contatori significavano un'altra cosa) e vanno buttati, non migrati.
  // Migrarli vorrebbe dire indovinare quale fosse la risposta corrente
  // guardando quale contatore e' piu' alto, che e' falso appena qualcuno ha
  // cambiato idea due volte — cioe' proprio nei casi che ci interessano.
  var STORY_CARDS_STATS_VERSIONE = 2;

  function storyCardsExplanationStatsKey(episodeId, userName) {
    return 'baseinglese:storyCardsExplanationStats:' + episodeId + ':' + userName;
  }

  function vuotoStoryCardsExplanationStats() {
    return { versione: STORY_CARDS_STATS_VERSIONE, byLine: {} };
  }

  function loadStoryCardsExplanationStats(episodeId, userName) {
    return leggiMagazzino(storyCardsExplanationStatsKey(episodeId, userName),
      vuotoStoryCardsExplanationStats,
      function (p) { return p.versione === STORY_CARDS_STATS_VERSIONE && !!p.byLine; });
  }

  // Registra la risposta CORRENTE di una battuta. Non e' piu' un "add", e il
  // nome lo dice: legge quella di prima, la toglie da dove stava, mette la
  // nuova, e alza `cambi` solo se la risposta e' davvero diversa. Rispondere
  // due volte la stessa cosa non muove niente — prima era vero per caso
  // (il pulsante gia' scelto non produceva un secondo evento), adesso e' una
  // regola scritta, che e' la differenza fra un comportamento e una fortuna.
  function storyCardsRecordExplanationAnswer(episodeId, userName, lineId, answer) {
    var stats = loadStoryCardsExplanationStats(episodeId, userName);
    var voce = stats.byLine[lineId];
    if (!voce) voce = stats.byLine[lineId] = { corrente: null, cambi: 0, chiara: 0, nonAncora: 0, nonChiara: 0 };
    if (voce.corrente === answer) return stats;
    if (voce.corrente) {
      voce[voce.corrente] = Math.max(0, (voce[voce.corrente] || 0) - 1);
      voce.cambi = (voce.cambi || 0) + 1;
    }
    voce[answer] = (voce[answer] || 0) + 1;
    voce.corrente = answer;
    scriviMagazzino(storyCardsExplanationStatsKey(episodeId, userName), stats);
    return stats;
  }

  function customValuesKey(episodeId, userName) {
    return 'baseinglese:' + episodeId + ':custom:' + userName;
  }

  function loadCustomValues(episode, userName) {
    var stored = leggiMagazzino(customValuesKey(episode.id, userName), function () { return {}; });
    var values = {};
    episode.slotFields.forEach(function (f) {
      values[f.key] = (stored[f.key] !== undefined && stored[f.key] !== '') ? stored[f.key] : f.def;
    });
    return values;
  }

  function saveCustomValues(episode, userName, values) {
    scriviMagazzino(customValuesKey(episode.id, userName), values);
  }

  // Read-only survivor of the old "Customize seen" flag (Personalizza
  // wasn't a real map module before) — kept only for
  // migrateCustomizeSeenToModuleProgress below, so returning users who
  // already personalized under the old flow don't suddenly find
  // Personalizza relocking every module in front of progress they
  // already made. Nothing writes this key anymore.
  function customizeSeenKey(episodeId, userName) {
    return 'baseinglese:' + episodeId + ':customizeSeen:' + userName;
  }

  function isCustomizeSeen(episodeId, userName) {
    return BI.magLeggiTesto(customizeSeenKey(episodeId, userName)) === '1';
  }

  // The consequence of confirming the mid-episode warning: every piece of
  // progress that depends on the (about to change) personalization is
  // cleared, so the map re-locks everything after Personalizza and the
  // user redoes the episode. customValues (the personalization itself)
  // is deliberately left untouched — that's what they're about to edit.
  function wipeEpisodeProgress(episode, userName) {
    cancellaMagazzino(moduleProgressKey(episode.id, userName));
    cancellaMagazzino(moduleOutcomeKey(episode.id, userName));
    cancellaMagazzino(masteryStorageKey(episode.id, userName));
  }

  // ---- Shared full-screen module intro (Story Cards, Voice Coach, Speed
  // Round, Flash Card, and — since the backlog fix below — Repeat Aloud's
  // own dismissal too, though its screen markup/render functions (ra-*)
  // stay standalone; see CLAUDE.md rule 11, flagged for a future
  // consolidation pass rather than touched here). One dismiss flag per
  // module kind (not per episode — it's about knowing the module type).
  // howItWorks always comes from istruzioni-moduli.json (CLAUDE.md rule
  // 8); this only decides WHERE it's shown (full screen first time,
  // popup afterward). ----
  function introDismissedKey(kind, userName) {
    return 'baseinglese:introDismissed:' + kind + ':' + userName;
  }

  // Repeat Aloud's own pre-generalization key, kept ONLY so a preference
  // already saved there before this migration isn't silently reset — see
  // isIntroDismissed's one-time fallback read below. Nothing writes here
  // anymore; setIntroDismissed always uses introDismissedKey.
  function legacyRaIntroDismissedKey(userName) {
    return 'baseinglese:repeatAloudIntroDismissed:' + userName;
  }

  function isIntroDismissed(kind, userName) {
    try {
      var stored = BI.magLeggiTesto(introDismissedKey(kind, userName), null);
      if (stored !== null) return stored === '1';
      if (kind === 'repeatAloud') return BI.magLeggiTesto(legacyRaIntroDismissedKey(userName)) === '1';
      return false;
    } catch (e) { return false; }
  }

  function setIntroDismissed(kind, userName, dismissed) {
    BI.magScriviTesto(introDismissedKey(kind, userName), dismissed ? '1' : '0');
  }

  function storyCardsDeclarationsKey(episodeId, userName) {
    return 'baseinglese:storyCardsDeclarations:' + episodeId + ':' + userName;
  }

  function loadStoryCardsDeclarations(episodeId, userName) {
    return leggiMagazzino(storyCardsDeclarationsKey(episodeId, userName),
      function () { return {}; },
      function (p) { return typeof p === 'object'; });
  }

  function saveStoryCardsDeclarations(episodeId, userName, answers) {
    scriviMagazzino(storyCardsDeclarationsKey(episodeId, userName), answers);
  }

  // ── I nomi che questo strato espone ──
  //
  // Tutti e trentotto, compresi i costruttori delle chiavi: sono loro che
  // servono ai test, ed erano il motivo per cui 197 punti scrivevano la
  // chiave a mano.
  BI.leggiMagazzino = leggiMagazzino;
  BI.scriviMagazzino = scriviMagazzino;
  BI.cancellaMagazzino = cancellaMagazzino;
  BI.helpRequestsKey = helpRequestsKey;
  BI.loadHelpRequests = loadHelpRequests;
  BI.saveHelpRequest = saveHelpRequest;
  BI.masteryStorageKey = masteryStorageKey;
  BI.loadMastery = loadMastery;
  BI.saveMastery = saveMastery;
  BI.moduleProgressKey = moduleProgressKey;
  BI.loadModuleProgress = loadModuleProgress;
  BI.markModuleCompleted = markModuleCompleted;
  BI.moduleOutcomeKey = moduleOutcomeKey;
  BI.loadModuleOutcomes = loadModuleOutcomes;
  BI.saveModuleOutcome = saveModuleOutcome;
  BI.audioUsageKey = audioUsageKey;
  BI.loadAudioUsage = loadAudioUsage;
  BI.addAudioSecondsSent = addAudioSecondsSent;
  BI.nextLineSkipsKey = nextLineSkipsKey;
  BI.loadNextLineSkips = loadNextLineSkips;
  BI.addNextLineSkip = addNextLineSkip;
  BI.storyCardsExplanationStatsKey = storyCardsExplanationStatsKey;
  BI.vuotoStoryCardsExplanationStats = vuotoStoryCardsExplanationStats;
  BI.loadStoryCardsExplanationStats = loadStoryCardsExplanationStats;
  BI.storyCardsRecordExplanationAnswer = storyCardsRecordExplanationAnswer;
  BI.customValuesKey = customValuesKey;
  BI.loadCustomValues = loadCustomValues;
  BI.saveCustomValues = saveCustomValues;
  BI.customizeSeenKey = customizeSeenKey;
  BI.isCustomizeSeen = isCustomizeSeen;
  BI.wipeEpisodeProgress = wipeEpisodeProgress;
  BI.introDismissedKey = introDismissedKey;
  BI.legacyRaIntroDismissedKey = legacyRaIntroDismissedKey;
  BI.isIntroDismissed = isIntroDismissed;
  BI.setIntroDismissed = setIntroDismissed;
  BI.storyCardsDeclarationsKey = storyCardsDeclarationsKey;
  BI.loadStoryCardsDeclarations = loadStoryCardsDeclarations;
  BI.saveStoryCardsDeclarations = saveStoryCardsDeclarations;
  BI.STORY_CARDS_STATS_VERSIONE = STORY_CARDS_STATS_VERSIONE;
})(window.BI);
