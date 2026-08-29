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

// Avvia Chromium. Senza executablePath Playwright usa il proprio browser
// (quello installato da `npx playwright install chromium`, o quello indicato
// da PLAYWRIGHT_BROWSERS_PATH); CHROMIUM_PATH serve solo a chi deve puntare a
// un binario di sistema.
function launchBrowser(options) {
  const opts = Object.assign({}, options);
  if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
  return chromium.launch(opts);
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

module.exports = { chromium, launchBrowser, APP_URL, APP_PORT, REPO_ROOT, repoPath, outputPath };
