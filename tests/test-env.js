// Ambiente condiviso della suite di test.
//
// Ogni file sotto tests/ prende da qui Playwright, l'indirizzo dell'app e i
// percorsi su disco, così nessun test resta inchiodato ai percorsi della
// macchina su cui è stato scritto. Prima di questo modulo i 44 file avevano
// dentro il percorso assoluto di un container (`/opt/node22/...`) e il numero
// di build di Chromium (`chromium-1194`): fuori da quel container non
// partivano, e dentro si sarebbero rotti tutti insieme al primo aggiornamento
// del browser.
//
// Variabili d'ambiente riconosciute (tutte facoltative):
//   APP_URL            indirizzo completo della pagina sotto test
//   APP_PORT           porta del server statico (default 8955)
//   PLAYWRIGHT_MODULE  installazione di Playwright da usare al posto di
//                      quella risolta normalmente da node_modules
//   CHROMIUM_PATH      binario del browser, quando Playwright non ha un
//                      Chromium proprio da avviare
//   TEST_OUTPUT_DIR    cartella dove finiscono screenshot e file prodotti
//                      dagli script (default tests/output/)

const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 8955;

function requirePlaywright() {
  const target = process.env.PLAYWRIGHT_MODULE || 'playwright';
  try {
    return require(target);
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') throw err;
    throw new Error(
      'Playwright non trovato (' + target + ').\n' +
      'Dalla cartella principale del repository:  npm install\n' +
      'Oppure indica un\'installazione esistente:  PLAYWRIGHT_MODULE=/percorso/a/playwright'
    );
  }
}

const playwright = requirePlaywright();
const chromium = playwright.chromium;

const APP_PORT = process.env.APP_PORT || String(DEFAULT_PORT);
const APP_URL = process.env.APP_URL || 'http://localhost:' + APP_PORT + '/index.html';

// I Google Fonts non si scaricano nei test, e NON e' un dettaglio di comodo:
// index.html li chiede a fonts.googleapis.com, e su una macchina che non li
// raggiunge il browser aspetta il timeout prima di rinunciare — **12,6 secondi
// a ogni page.goto()**, non solo al primo. Misurato: un caricamento di pagina
// passa da 12.600 ms a 51 ms, e la suite completa da ~50 minuti a meno di
// dieci.
//
// **Togliere questa rotta costa quaranta minuti a ogni suite.** Se un giorno
// serve un test che guarda i font davvero, lo si scrive disattivandola per
// quella pagina — non togliendola da qui.
//
// Non e' un adattamento a un container: su una macchina che i font li
// raggiunge, abortirli non cambia nessuna asserzione (nessuna dipende dai
// font) e risparmia comunque il tempo di scaricarli.
const FONT_ESTERNI = /fonts\.(googleapis|gstatic)\.com/;

// Il filtro e' una FUNZIONE, non un glob: in Playwright il carattere `*` di un
// glob non attraversa la `/`, quindi 'https://fonts.g*' non aggancia niente e
// la rotta sembra applicata mentre non lo e'. E' successo — la prima misura
// diceva "bloccare i font non serve", e la prova era rotta, non l'ipotesi.
function bloccaFontEsterni(page) {
  return page.route(function (url) { return FONT_ESTERNI.test(String(url)); },
    function (route) { return route.abort(); });
}

// Avvia Chromium. Senza executablePath Playwright usa il proprio browser
// (quello installato da `npx playwright install chromium`, o quello indicato
// da PLAYWRIGHT_BROWSERS_PATH); CHROMIUM_PATH serve solo a chi deve puntare a
// un binario di sistema.
//
// La rotta sui font si installa qui, su ogni pagina che il browser crea: un
// punto solo per tutti i file della suite, invece di una riga da ricordarsi in
// ognuno (che e' la difesa che prima o poi qualcuno dimentica).
function launchBrowser(options) {
  const opts = Object.assign({}, options);
  if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
  return chromium.launch(opts).then(function (browser) {
    const newPageOriginale = browser.newPage.bind(browser);
    browser.newPage = function () {
      return newPageOriginale.apply(null, arguments).then(function (page) {
        return bloccaFontEsterni(page).then(function () { return page; });
      });
    };
    return browser;
  });
}

// Radice del repository, per i test che leggono file di dati da disco.
const REPO_ROOT = path.resolve(__dirname, '..');

function repoPath() {
  return path.join.apply(path, [REPO_ROOT].concat(Array.prototype.slice.call(arguments)));
}

// Cartella dove gli script scrivono quello che producono (screenshot). Sta
// dentro il repository ed è ignorata da git: mai lo scratchpad di una
// sessione, che sparisce insieme al container.
function outputPath(name) {
  const dir = process.env.TEST_OUTPUT_DIR || path.join(__dirname, 'output');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}

// Le righe di un file del repository che sono CODICE — i commenti fuori.
//
// ⚠️ STA QUI, CONDIVISO, PERCHE' LO STESSO DIFETTO SI E' PRESENTATO QUATTRO
// VOLTE IN DUE GIORNI: un conto che cerca un nome nel sorgente e trova anche i
// commenti che lo nominano — commenti spesso scritti nello stesso commit che
// aggiunge il conto. Il numero e' giusto; la domanda no.
//
// I quattro: la verifica del passo ⑧ del 21-quater (`unaVoltaSola('voice'`, 2
// invece di 1), la falsificazione della chiave sul kind, il conto di
// `leaveModule` (14 invece di 12), e il divieto di ritorno del passo 22
// (`applyConfigOverrides`, che sopravvive in un commento).
//
// La correzione era gia' scritta nella forma operativa della famiglia
// ⓪-nonies — «la grep deve colpire il CODICE» — e continuava a non applicarsi
// da sola dove serviva. **Una difesa scritta in un posto non si applica da
// sola nell'altro, e una scritta in ogni posto si disallinea.** Da qui: una
// sola, dove i test prendono gia' i percorsi.
//
// LIMITE DICHIARATO: riconosce i commenti per come cominciano la riga (`//`,
// `*`, `/*`). Un commento in coda a una riga di codice non viene tolto — e va
// bene, perche' li' il codice c'e' davvero.
function righeDiCodiceDi(...pezzi) {
  return require('fs').readFileSync(repoPath.apply(null, pezzi), 'utf8').split('\n')
    .filter(function (r) {
      const t = r.trim();
      return t.indexOf('//') !== 0 && t.indexOf('*') !== 0 && t.indexOf('/*') !== 0;
    });
}

// IL SORGENTE CHE CONTIENE UN PEZZO, cercato in `index.html` e in ogni file di
// `app/`. Torna { nome, testo }; se nessuno lo contiene, **alza**.
//
// ⚠️ STA QUI, CONDIVISO, PER LO STESSO MOTIVO DI `righeDiCodiceDi` QUI SOPRA —
// e il caso che l'ha fatto nascere e' del 2026-09-19, passo C2.
//
// Da quando l'app non e' piu' un file solo, un test che legge
// `repoPath('index.html')` per trovarci una funzione dice la verita' finche'
// quella funzione non si sposta. Il giorno che si sposta NON diventa rosso: la
// ricerca non trova niente, e cosa succede dopo dipende da come e' scritta
// l'asserzione. Misurato su `test_moduli_registrati.js` quel giorno:
//
//     due asserzioni ROSSE     — «risolve dal registro», «il ramo e' conservato»
//     dodici VERDI per costruzione — «non nomina piu' X», su un pezzo sbagliato
//
// *La stessa rottura, i due esiti opposti della regola 44. Se il caso fosse
// stato solo il secondo, non se ne sarebbe accorto nessuno.*
//
// Tre file cercavano cosi' (`test_moduli_registrati`, `test_modulo_pronto`,
// `test_tabelle_personalizzazione`) e ognuno avrebbe dovuto ricordarsene da
// solo a ogni estrazione. **Una difesa scritta in ogni posto si disallinea:
// una sola, dove i test prendono gia' i percorsi.**
//
// LIMITE DICHIARATO: cerca il PRIMO file che contiene il pezzo, nell'ordine
// `index.html` poi `app/*.js` in ordine alfabetico. Se due file lo
// contenessero davvero, questa funzione non lo direbbe — e quel caso e' gia'
// un guasto suo, che nessun test guarda oggi.
function sorgenteChe(pezzo) {
  const fs = require('fs');
  const posti = ['index.html'].concat(
    fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) { return 'app/' + f; })
  );
  for (let k = 0; k < posti.length; k++) {
    const testo = fs.readFileSync(repoPath.apply(null, posti[k].split('/')), 'utf8');
    if (testo.indexOf(pezzo) !== -1) return { nome: posti[k], testo: testo };
  }
  throw new Error('«' + pezzo + '» non trovato in nessuno di: ' + posti.join(', '));
}

// ⚠️ IL GLOB DI UN FILE DI DATI, E NON SI SCRIVE A MANO. Passo 1.9,
// 2026-09-20.
//
// Dal passo 1.9 i percorsi dei dati portano `?v=<versione>`, quindi un
// `page.route('**/istruzioni-moduli.json', ...)` NON corrisponde piu': la
// rotta non scatta, il file arriva subito, e il test che voleva misurare
// «cosa si vede mentre il file non c'e' ancora» misura il caso opposto.
//
// ⚠️ **E NON SI ROMPE IN MODO RUMOROSO.** Playwright non dice «questa rotta
// non ha mai corrisposto»: il test gira, vede l'app funzionante e fallisce
// sull'asserzione, che accusa il codice invece della rotta. Otto punti in sei
// file, tutti insieme, il 2026-09-20.
//
// Quindi il glob lo costruisce questa funzione, una volta per tutte: `*` in
// coda prende la query se c'e' e non da' fastidio se non c'e'.
// ⚠️ ANCHE IL GLOB PORTA IL PREFISSO, e non e' simmetria per bellezza: senza,
// `**/istruzioni-moduli.json*` NON corrisponde a
// `inglese-it-istruzioni-moduli.json` — il glob vuole che il nome COMINCI
// cosi'. Un'intercettazione che non intercetta non fallisce: lascia passare la
// richiesta vera e il test diventa verde misurando un'altra cosa (regola 37).
function globDati(nomeFile) {
  return '**/' + prefissoEdizione(configApp().edizione) + nomeFile + '*';
}

// ⚠️ LA PRIMA SCHERMATA DELL'APP, ASPETTATA UNA VOLTA SOLA. Passo 1.11b,
// 2026-09-20.
//
// Dal passo 1.11b `boot()` non disegna niente finche' non arriva
// `struttura-corso.json`: senza sequenze, gradi ed episodi non c'e' nessuna
// mappa da fare. Quindi «vai all'indirizzo e guarda cosa c'e' a schermo»
// — che cinque punti di quattro file facevano subito dopo `goto` — adesso
// guarda una pagina ancora vuota e conclude la cosa sbagliata: non «non c'e'
// il campo del nome», ma «non c'e' ANCORA NIENTE».
//
// Sta qui e non in ogni file (regola 13): la domanda e' la stessa in tutti e
// cinque, ed e' una sola — *l'app ha finito di accendersi?*
//
// ⚠️ ASPETTA UNA DELLE DUE PORTE, non il campo del nome: al secondo giro il
// nome e' gia' salvato e l'app apre direttamente la schermata di casa. Un
// test che aspettasse solo `#name-input` aspetterebbe per sempre proprio nel
// caso in cui l'app funziona.
async function attendiPrimaSchermata(page, timeout) {
  await page.waitForFunction(function () {
    return ['#name-input', '#go-episode'].some(function (sel) {
      const el = document.querySelector(sel);
      return !!el && el.getClientRects().length > 0;
    });
  }, undefined, { timeout: timeout || 10000 });
}

// ⚠️ I FILE DELL'EDIZIONE, senza che nessun test scriva `data/inglese/it/`.
// Passo 1.11b, 2026-09-20 — e' il gemello di `percorsoEdizione` in
// `app/dati.js`, dal lato dei test.
//
// Perche' sta qui e non in ogni file che ne ha bisogno: la coppia che dice
// quale edizione e' viva sta in UN posto solo dell'app (`CONFIG.edizione`),
// e i test devono chiederla allo stesso posto. Un test che si scrive il
// percorso a mano e' la famiglia ⓪-sexies: legge un dato dal sorgente
// perche' oggi e' li' per costruzione, e il giorno che si sposta dice
// «non trovato» invece di «e' cambiato».
//
// `app/config.js` si esegue davvero, in un contesto finto, invece di
// cercarci dentro con un'espressione regolare: cosi' il test legge il valore
// e non il modo in cui e' scritto.
let _configApp = null;
function configApp() {
  if (!_configApp) {
    const vm = require('vm');
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(require('fs').readFileSync(repoPath('app', 'config.js'), 'utf8'), sandbox);
    _configApp = sandbox.window.APP_CONFIG;
  }
  return _configApp;
}

// ⚠️ IL PREFISSO LO METTE QUESTA FUNZIONE, come `percorsoEdizione` nell'app:
// i test chiedono `fileEdizione('struttura-corso.json')` e ricevono
// `data/inglese/it/inglese-it-struttura-corso.json`. *Scriverlo nei nomi, in
// venti punti, vorrebbe dire venti posti da cambiare alla prossima edizione —
// che e' esattamente il motivo per cui questo file esiste (regola 24).*
// ⚠️ IL GEMELLO LATO TEST DI `prefissoMagazzino` (app/progressi.js), nato col
// passo 1.17 il 2026-09-22. Serve ai semi costruiti in NODE — un oggetto
// `{chiave: valore}` passato a `bootAsUser` — dove `BI` non esiste: nel
// browser un test chiede la chiave all'app (`BI.moduleProgressKey(...)`),
// qui non puo'.
//
// ⚠️ E NON E' UNA COPIA CHE SI PUO' DISALLINEARE, perche' l'edizione la
// legge da `configApp()`, cioe' dallo stesso `app/config.js` che la legge
// l'app. *Quello che resta duplicato e' la FORMA — «prefisso + due punti» —
// e se cambiasse, `test_progressi_estratto` [C] diventerebbe rosso: e' la
// riga che confronta la chiave dell'app con una ricostruita qui a mano.*
function chiaveMagazzino(resto) {
  const ed = configApp().edizione;
  return 'baseinglese:' + ed.lingua + '-' + ed.studente + ':' + resto;
}

function prefissoEdizione(ed) { return ed.lingua + '-' + ed.studente + '-'; }

function fileEdizione(nome) {
  const ed = configApp().edizione;
  return repoPath('data', ed.lingua, ed.studente, prefissoEdizione(ed) + nome);
}

// La struttura del corso dell'edizione viva, gia' letta.
function strutturaCorso() {
  return JSON.parse(require('fs').readFileSync(fileEdizione('struttura-corso.json'), 'utf8'));
}

module.exports = { chromium, launchBrowser, bloccaFontEsterni, APP_URL, APP_PORT, REPO_ROOT, repoPath, outputPath, righeDiCodiceDi, sorgenteChe, configApp, fileEdizione, chiaveMagazzino, strutturaCorso, attendiPrimaSchermata, globDati };
