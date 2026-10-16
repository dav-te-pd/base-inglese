// QUALI FILE LANCIA LA SUITE COMPLETA — in un posto solo.
//
// Ogni `tests/test_*.js`, in ordine alfabetico, tranne quelli scritti in
// `tests/esclusi-dalla-suite.txt` col loro perché. Dal 2026-10-16, deciso da
// chi guida il progetto: fino a quel giorno l'elenco era scritto a mano in
// `run_full_regression.sh`, e un file nuovo dimenticato fuori non girava senza
// che niente lo dicesse.
//
// LO LEGGONO IN TRE, ed è per questo che sta qui e non dentro lo script:
//   - `tests/run_full_regression.sh` — `FILES=$(node tools/file-della-suite.js)`;
//   - `tests/tools/conta-attese.js` — il censimento delle attese;
//   - `tests/test_conta_asserzioni.js` [G] — che lo controlla.
// *La stessa regola scritta una volta in bash e una in Node sarebbe due
// regole che un giorno divergono (regola 48).*
//
// ⚠️ SENZA IL FILE DEGLI ESCLUSI SI FERMA (regola 49): vuoto vuol dire
// «nessuno escluso», assente vuol dire «non so» — e «non so» non può
// diventare «lancia tutto» in silenzio.
//
// Uso: node tests/tools/file-della-suite.js   → i nomi, uno spazio fra l'uno e l'altro

'use strict';

const fs = require('fs');
const path = require('path');

const CARTELLA = path.join(__dirname, '..');
const ESCLUSI_FILE = path.join(CARTELLA, 'esclusi-dalla-suite.txt');

// Le righe vere del file: `nome.js | perché`. Commenti e righe vuote no.
// `file` è facoltativo: [G] ci passa un file finto, per vedere la guardia
// cadere senza toccare quello vero mentre la suite gira (regola 36).
function esclusi(file) {
  const ESCLUSI_FILE = file || module.exports.ESCLUSI_FILE;
  if (!fs.existsSync(ESCLUSI_FILE)) {
    throw new Error('manca tests/esclusi-dalla-suite.txt: deve esistere anche vuoto — vuoto vuol dire «nessun test escluso» (regola 49)');
  }
  return fs.readFileSync(ESCLUSI_FILE, 'utf8').split('\n')
    .map((r) => r.trim())
    .filter((r) => r && !r.startsWith('#'))
    .map((r) => {
      const i = r.indexOf('|');
      return { nome: (i === -1 ? r : r.slice(0, i)).trim(), perche: i === -1 ? '' : r.slice(i + 1).trim() };
    });
}

function fileSulDisco() {
  return fs.readdirSync(CARTELLA).filter((f) => /^test_.*\.js$/.test(f)).sort();
}

function fileDellaSuite(file) {
  const fuori = esclusi(file).map((e) => e.nome);
  return fileSulDisco().filter((f) => fuori.indexOf(f) === -1);
}

module.exports = { esclusi, fileSulDisco, fileDellaSuite, ESCLUSI_FILE };

if (require.main === module) {
  try {
    process.stdout.write(fileDellaSuite().join(' ') + '\n');
  } catch (e) {
    console.error('FERMO: ' + e.message);
    process.exit(1);
  }
}
