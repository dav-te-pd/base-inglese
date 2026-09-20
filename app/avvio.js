// DIPENDE DA: identita.js [chiamata], magazzino.js [chiamata]
// ⚠️ L'ordine del tag in index.html DIPENDE da questa riga. Verificata da
// tests/test_dipendenze_dichiarate.js, che la confronta col codice vero: se
// una delle due invecchia, la suite diventa rossa invece di lasciarlo scoprire
// a chi riordina i tag.
//
// LO STRATO `avvio` — quello che gira PRIMA che si sappia chi e' lo studente.
//
// Estratto da index.html il 2026-09-17 (passo 22, primo strato). Non e' stato
// scritto: esisteva gia' come blocco `<script>` in linea, ed e' stato
// riconosciuto e spostato.
//
// ⚠️ DEVE RESTARE DOPO `app/config.js` E PRIMA DELLO SCRIPT PRINCIPALE.
//
// Tutte e tre le cose qui dentro leggono `window.APP_CONFIG`, e nessuna tocca
// `BI`. Il tag e' BLOCCANTE — niente `defer`, `async` o `type="module"` — come
// quello della configurazione.
//
// ⚠️ E QUESTA ESTRAZIONE HA TOLTO UNA GARANZIA, non spostato soltanto del
// codice — e' la prima volta nella fase 4 che succede, e ricapitera' a ogni
// pezzo che esce.
//
// Finche' questo blocco era IN LINEA, il suo venire dopo `config.js` non era
// una scelta: era la forma del file. Una cosa in linea sta necessariamente
// dopo i tag scritti sopra di lei. **Adesso sono due righe che si possono
// scambiare** — e scambiarle non darebbe un errore di caricamento: darebbe un
// `TypeError` a tempo di parsing su una pagina bianca, col colpevole in una
// riga di HTML che non parla di configurazione.
//
// Lo proteggono due asserzioni di tests/test_config_estratto.js: l'ordine dei
// due tag, e il fatto che questo blocco NON sia piu' in linea in index.html.
// *Senza la seconda, rimettercelo dentro passerebbe verde.*

  // ── LA CHIAVE DEGLI OVERRIDE, IN UN POSTO SOLO ──
  //
  // ⚠️ Seconda meta' di un caso registrato il 2026-09-17, quando questo file
  // e' uscito: la chiave era scritta come LETTERALE qui e come costante
  // `CONFIG_OVERRIDES_KEY` in index.html — due punti che sapevano la stessa
  // cosa, in due file. La prima meta' (la chiave del tema) si e' chiusa con
  // `app/identita.js`; questa aspettava lo strato che la riunisse.
  //
  // **Sta qui e non altrove perche' qui e' dove viene USATA per prima**: gli
  // override si applicano PRIMA di tutto il resto, e chi possiede una cosa e'
  // chi ha il problema che quella cosa risolve. Il Pannello Admin la legge e
  // la scrive, ma arriva molto dopo.
  var CONFIG_OVERRIDES_KEY = 'baseinglese:configOverrides';

  // Copia intatta della configurazione, presa PRIMA che gli override salvati
  // qui sotto la modifichino.
  //
  // ⚠️ SCRITTA E MAI LETTA — misurato il 2026-09-15: una sola occorrenza in
  // tutto il repository, questa. Il commento di prima diceva che serve al
  // pulsante «Ripristina valori di partenza»: quel pulsante esiste, ma
  // (config-panel-reset-btn, piu' avanti in questo file) cancella la chiave
  // degli override e ricarica la pagina — `APP_CONFIG_DEFAULTS` non lo tocca.
  // Il ripristino funziona; non funziona cosi'.
  //
  // Resta in piedi perche' toglierla e' una rimozione e non una correzione
  // (CLAUDE.md regola 1): registrata in docs/decisioni-stato.md con la sua
  // condizione. Costa una copia profonda di ~660 righe a ogni caricamento.
  //
  // *Trovata leggendo la FUNZIONE che il commento indicava, non la riga —
  // tests/ERRORI-INGOIATI.md, famiglia ⓪-sexies.*
  // ⚠️ QUESTA RIGA E' QUI SAPENDO CHE NON SERVE, E NON E' UNA DIMENTICANZA.
  //
  // E' entrata nell'estrazione di proposito: **toglierla qui sarebbe stata una
  // rimozione mascherata da estrazione** (CLAUDE.md regola 1), e un passo che
  // sposta codice non e' il posto dove si decide cosa cancellare.
  //
  // LA SUA DECISIONE E' APERTA, con la sua condizione, in docs/decisioni-stato.md:
  // **si decide nello strato che contiene il Pannello Admin.** Li' si sapra' se
  // il ripristino «ai valori di partenza» debba davvero tornare ai valori del
  // codice — e allora `DEFAULTS` serve e va *letta* — oppure se cancellare gli
  // override sia il comportamento voluto, e allora la riga si toglie.
  //
  // *Sta scritto qui perche' altrimenti il file nasce con dentro una cosa che
  // chi lo legge crede necessaria: il primo che la nota o la toglie o la
  // protegge, e tutte e due sarebbero sbagliate.*
  window.APP_CONFIG_DEFAULTS = JSON.parse(JSON.stringify(window.APP_CONFIG));

  // Applica sopra APP_CONFIG gli override salvati dal Pannello Admin
  // (si apre digitando "config" fuori da un campo di testo, o con ?config).
  // Quello che nel pannello nessuno ha mai toccato resta al valore del codice.
  //
  // ⚠️ Qui c'era scritto «una sezione salvata SOSTITUISCE quella sezione per
  // intero»: vero fino al 2026-09-20, falso da questo commit. Vedi il blocco
  // qui sotto.
  // ⚠️ DA IIFE A FUNZIONE CON UN NOME, il 2026-09-20 (passo 1.11b), e non per
  // stile: adesso va chiamata DUE VOLTE. Qui, come sempre, appena la
  // configurazione del codice e' in memoria; e una seconda volta quando
  // arriva `struttura-corso.json`, che riempie sei chiavi di `APP_CONFIG`
  // dopo — se non si riapplicasse, il file sovrascriverebbe in silenzio la
  // sequenza che il Pannello Admin ha appena salvato.
  //
  // *Non e' una regola nuova: e' la stessa che `loadPersonalizationTables`
  // applica gia' alle tabelle dei nomi — gli override del pannello stanno
  // SOPRA il file. Qui si riusa la funzione invece di riscriverne una seconda
  // (regola 13).*
  // ⚠️ DAL 2026-09-20 L'OVERRIDE SI FONDE, NON SOSTITUISCE — e non e' una
  // rifinitura: la sostituzione produce un guasto MUTO, e il giorno in cui
  // le sequenze diventano piu' d'una lo produce di sicuro.
  //
  // La forma vecchia faceva `APP_CONFIG[chiave] = override[chiave]`, cioe'
  // **la pagina del foglietto sostituiva il capitolo intero del libro**:
  //
  //     file:      sequences = { narrativo-standard, prova-corta }
  //     override:  sequences = { narrativo-standard }   (salvato ieri)
  //     risultato: sequences = { narrativo-standard }   ← prova-corta SPARITA
  //
  // Una sequenza aggiunta al file dopo un qualunque riordino fatto dal
  // Pannello Admin non compariva piu' su quel browser. Nessun errore, nessun
  // rosso: **l'episodio che la chiede mostra la schermata d'errore, e il
  // file e' giusto.** Chi lo incontra conclude «la seconda sequenza non
  // funziona» e va a cercare nel posto sbagliato.
  //
  // Adesso: quando **entrambi** sono oggetti semplici, le chiavi del
  // foglietto vincono una per una e le altre restano. Array e valori
  // singoli si sostituiscono come prima — su un array non esiste una
  // fusione che voglia dire qualcosa.
  //
  // ⚠️ IL CASO PIU' DIVERSO (regola 42) NON E' `sequences`: e' `speech`,
  // l'UNICA chiave scritta da DUE sorgenti — `app/config.js` (velocita',
  // voci) e `struttura-corso.json` (le due lingue, via applicaStruttura).
  // Con la sostituzione, un override salvato prima di cambiare edizione
  // cancellava le lingue della nuova **senza dirlo**. Con la fusione no.
  //
  // ⚠️ E COSA SI PERDE, dichiarato invece che scoperto dopo: **non si puo'
  // piu' TOGLIERE una chiave con un override**, si puo' solo cambiarne il
  // valore. Oggi nessun punto dell'app lo fa — il pannello sa cambiare,
  // accendere e spegnere, non cancellare — e il giorno che servisse va
  // chiesto esplicitamente, non ottenuto per effetto collaterale.
  function eOggettoSemplice(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  function applyConfigOverrides() {
    try {
      var overrides = window.BI.magLeggiJson(CONFIG_OVERRIDES_KEY, function () { return null; });
      if (!overrides) return;
      Object.keys(overrides).forEach(function (key) {
        var dalFile = window.APP_CONFIG[key];
        var dalFoglietto = overrides[key];
        window.APP_CONFIG[key] = (eOggettoSemplice(dalFile) && eOggettoSemplice(dalFoglietto))
          ? Object.assign({}, dalFile, dalFoglietto)
          : dalFoglietto;
      });
    } catch (e) {}
  }
  applyConfigOverrides();

  // Applied before first paint so a returning user's saved theme never flashes to the default.
  (function () {
    try {
      // La chiave viene da app/identita.js, che e' caricato PRIMA di questo
      // file apposta. Fino al 2026-09-17 qui c'era il letterale
      // 'baseinglese:theme' e index.html conosceva la stessa chiave come
      // THEME_KEY: due punti che sapevano la stessa cosa, in due file da
      // quando lo strato 0 e' uscito. Adesso e' uno solo.
      var saved = window.BI.magLeggiTesto(window.BI.THEME_KEY, null);
      if (saved && saved !== window.APP_CONFIG.themes.defaultTheme) {
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch (e) {}
  })();

// Esposta perche' altri due punti la leggono: il Pannello Admin (index.html) e
// `loadPersonalizationTables`, che lascia sovrascrivere le tabelle dei nomi.
window.BI = window.BI || {};
window.BI.CONFIG_OVERRIDES_KEY = CONFIG_OVERRIDES_KEY;
window.BI.applyConfigOverrides = applyConfigOverrides;
