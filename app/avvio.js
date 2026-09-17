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
  // (CLAUDE.md regola 1): registrata in docs/decisioni.md con la sua
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
  // LA SUA DECISIONE E' APERTA, con la sua condizione, in docs/decisioni.md:
  // **si decide nello strato che contiene il Pannello Admin.** Li' si sapra' se
  // il ripristino «ai valori di partenza» debba davvero tornare ai valori del
  // codice — e allora `DEFAULTS` serve e va *letta* — oppure se cancellare gli
  // override sia il comportamento voluto, e allora la riga si toglie.
  //
  // *Sta scritto qui perche' altrimenti il file nasce con dentro una cosa che
  // chi lo legge crede necessaria: il primo che la nota o la toglie o la
  // protegge, e tutte e due sarebbero sbagliate.*
  window.APP_CONFIG_DEFAULTS = JSON.parse(JSON.stringify(window.APP_CONFIG));

  // Applies any parameter overrides saved locally by the hidden config
  // panel (embryo of the future Admin panel — reveal: type "config"
  // outside a text field). One whole top-level CONFIG section at a time
  // — a saved section replaces that section entirely, anything never
  // touched in the panel stays at its coded default above.
  (function applyConfigOverrides() {
    try {
      var raw = localStorage.getItem('baseinglese:configOverrides');
      if (!raw) return;
      var overrides = JSON.parse(raw);
      Object.keys(overrides).forEach(function (key) {
        window.APP_CONFIG[key] = overrides[key];
      });
    } catch (e) {}
  })();

  // Applied before first paint so a returning user's saved theme never flashes to the default.
  (function () {
    try {
      var saved = localStorage.getItem('baseinglese:theme');
      if (saved && saved !== window.APP_CONFIG.themes.defaultTheme) {
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch (e) {}
  })();
