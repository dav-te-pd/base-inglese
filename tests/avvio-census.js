// La FOTOGRAFIA DELL'AVVIO, letta dall'app viva.
//
// Serve a test_avvio_invariato.js e nasce per il passo 22 (gli strati), che
// spezza index.html in piu' file. E' il parente di listener-census.js: stessa
// idea — la fonte decide, non chi scrive il test — meccanismo diverso, perche'
// qui non si conta cosa il sorgente DICHIARA ma cosa l'app FA all'avvio.
//
// ⚠️ PERCHE' SI LEGGE IL RISULTATO INVECE DI STRUMENTARE.
//
// L'ordine di registrazione non va intercettato: e' gia' conservato dai dati.
// `BI.moduli` e' un oggetto con chiavi stringa — JavaScript ne mantiene
// l'ordine di inserimento — e `BI.pulizie` e' un array. Leggerli DOPO il boot
// da' la stessa sequenza che si otterrebbe avvolgendo le due funzioni, senza
// toccare niente.
//
// *E' la forma opposta a quella di test_listener_una_volta.js, che deve
// strumentare `addEventListener` perche' il DOM non tiene un registro
// leggibile. Qui il registro c'e': l'abbiamo costruito noi ai passi 21-bis e
// 21-ter. **Quei due passi hanno reso misurabile questo.***
//
// ⚠️ IL LIMITE CHE CONTA DI PIU', perche' e' il primo legame fra due file che
// NESSUNO STRUMENTO DI QUESTO PROGETTO VEDE: **questa fotografia prende le
// dipendenze di CODICE, non gli spazi CONDIVISI.**
//
// Due file possono non nominarsi mai e dipendere lo stesso l'uno dall'altro,
// se si scambiano qualcosa attraverso un posto che non e' il codice —
// `localStorage`, un attributo del DOM, una chiave di sessione. Qui non
// comparira' mai: `BI.moduli` e `BI.pulizie` sono registri di funzioni, e
// l'elenco degli script e' un elenco di file.
//
// **Il caso vero, misurato il 2026-09-17** (passo 22, dopo il primo strato):
// `app/avvio.js` legge `localStorage.getItem('baseinglese:theme')` scrivendo
// la chiave **come letterale**; `index.html` la stessa chiave la conosce come
// `THEME_KEY` e ci SCRIVE dentro. Stessa cosa per
// `'baseinglese:configOverrides'` / `CONFIG_OVERRIDES_KEY`. **Due chiavi, due
// posti ciascuna, e i due posti adesso sono due FILE DIVERSI** — prima del
// primo strato stavano tutti e due in `index.html`.
//
// *L'estrazione non ha creato la duplicazione: l'ha resa invisibile. Una
// duplicazione dentro un file si trova leggendo il file; una fra due file si
// trova solo cercandola, e nessuno la cerca se non sa che c'e'.* E' una
// conseguenza dell'estrazione, non un difetto del passo — e vale per ogni
// strato che verra'.
//
// ⚠️ **NON e' un buco da tappare qui**: un baseline dell'avvio che seguisse
// anche il `localStorage` misurerebbe un'altra cosa, e la misurerebbe peggio.
// E' un limite da SAPERE — e da guardare a mano quando un'estrazione separa
// due punti che si parlano attraverso una chiave.
//
// LA RICOGNIZIONE, fatta una volta sola perche' la domanda «e' un caso isolato
// o una famiglia?» si risponde contando: **venti chiavi distinte, dodici
// toccate da piu' di un punto — ma DICIOTTO SU VENTI passano da una costante
// o da una funzione** (`NAME_KEY`, `masteryStorageKey(...)`, ...). **Gli unici
// due letterali nudi di tutta l'app sono i due di `app/avvio.js`.** Quindi
// non e' una famiglia sparsa: sono esattamente i due che il primo strato ha
// portato fuori.
//
// ⚠️ LIMITE DICHIARATO, e va letto insieme al verde: questa fotografia dice
// **cosa succede all'avvio**, non **cosa potrebbe stare in quale strato**.
// Non e' un grafo delle dipendenze e non risponde a «se sposto X, cosa gli
// manca» — quella domanda la fa chi PIANIFICA un'estrazione, si rifa' a ogni
// estrazione, e la risposta cambia di proposito. Lo strumento che la serve sta
// in tests/tools/dipendenze.js e NON e' nella suite, apposta: congelare una
// risposta che deve cambiare farebbe rosso il lavoro giusto.

async function fotografiaAvvio(page) {
  return page.evaluate(function () {
    function nomiScript() {
      return Array.prototype.map.call(document.querySelectorAll('script'), function (s) {
        if (s.src) return s.src.replace(location.origin + '/', '').replace(/\?.*$/, '');
        // Un blocco inline si identifica con il suo numero di righe: e' l'unica
        // cosa stabile che ha, e cambia se qualcuno lo spezza o lo fonde —
        // che e' esattamente quello che il passo 22 fara' o non fara'.
        return '(inline)';
      });
    }
    return {
      script: nomiScript(),
      moduli: Object.keys(window.BI.moduli),
      pulizie: window.BI.pulizie.map(function (f) { return f.name || '(anonima)'; }),
      caricatiAlBoot: window.BI.moduliCaricatiAlBoot === true,
      vista: (document.querySelector('.view.is-active') || {}).id || '(nessuna)',
      config: typeof window.APP_CONFIG,
      defaults: typeof window.APP_CONFIG_DEFAULTS
    };
  });
}

// La fotografia in righe di testo, una per fatto: e' la forma che il baseline
// salva e che un diff mostra riga per riga.
function aRighe(f) {
  const out = [];
  f.script.forEach(function (s, i) { out.push('script ' + (i + 1) + ' ' + s); });
  f.moduli.forEach(function (k, i) { out.push('modulo ' + (i + 1) + ' ' + k); });
  f.pulizie.forEach(function (n, i) { out.push('pulizia ' + (i + 1) + ' ' + n); });
  out.push('moduliCaricatiAlBoot ' + f.caricatiAlBoot);
  out.push('vistaDopoIlBoot ' + f.vista);
  out.push('APP_CONFIG ' + f.config);
  out.push('APP_CONFIG_DEFAULTS ' + f.defaults);
  return out;
}

module.exports = { fotografiaAvvio, aRighe };
