// ⚠️ IL CONTROLLO CHE RENDE LA VERSIONE UN MECCANISMO E NON UN PROMEMORIA.
//
// I quattordici tag di index.html portano `?v=<versione>` perché il browser non
// possa mescolare file vecchi e nuovi (vedi il cappello in testa a index.html).
// Ma una versione che va alzata a mano è, testualmente, «quello che va fatto a
// mano dopo ogni modifica» — e CLAUDE.md regola 6 dice come va a finire:
// «prima o poi non viene fatto». E non va a finire con un guasto: va a finire
// con un push che sembra pubblicato e non lo è, cioè una misura che non misura
// (regola 37).
//
// Quindi: se fra due commit cambia `index.html` o un file sotto `app/`, la
// versione DEVE essere salita. Lo dice la CI, non la memoria di chi spinge.
//
// Uso:  node tests/tools/versione-salita.js [--repo <cartella>] <partenza> [arrivo]
//       (l'arrivo è HEAD se non si dice; la radice è questo repository)
//
// Uscite, e sono tre perché le loro conseguenze sono diverse:
//   0  a posto — o la versione è salita, o non è cambiato niente che la richieda
//   1  il codice è cambiato e la versione NO: il push va fermato
//  64  NON MISURATO — e vale come rosso, perché una guardia che non misura
//      è una guardia che non c'è. Dice sempre il motivo.

'use strict';
const { execFileSync } = require('child_process');
const path = require('path');

// ⚠️ LA RADICE SI PUÒ DIRE, e non è un vezzo per i test: senza, questo
// strumento guardava SEMPRE il repository in cui vive, qualunque cartella gli
// si desse — quindi provarlo su un repo finto misurava il repo vero, e le
// prove tornavano verdi **per il motivo sbagliato**. Trovato da
// `tests/test_versione_cache.js` al primo giro (famiglia ⓪-nonies: una prova
// che non morde dà lo stesso verde di una che regge).
var RADICE = path.resolve(__dirname, '..', '..');
var argv = process.argv.slice(2);
var iRepo = argv.indexOf('--repo');
if (iRepo !== -1) {
  RADICE = path.resolve(argv[iRepo + 1] || '');
  argv.splice(iRepo, 2);
}
const SORGENTE = /^(index\.html|app\/.+\.js)$/;

function git(args) {
  return execFileSync('git', args, { cwd: RADICE, encoding: 'utf8' }).trim();
}

function versioneDi(ref) {
  const html = git(['show', ref + ':index.html']);
  // Si legge dal PRIMO tag e si confronta con gli altri altrove
  // (tests/test_versione_cache.js): qui serve solo sapere se è cambiata.
  const m = html.match(/<script src="app\/[^"?]+\?v=([^"]+)"><\/script>/);
  return m ? m[1] : null;
}

function esci(codice, riga) {
  console.log(riga);
  process.exit(codice);
}

const partenza = argv[0];
const arrivo = argv[1] || 'HEAD';
if (!partenza) esci(64, 'NON MISURATO: manca il ref di partenza. Uso: node tests/tools/versione-salita.js <partenza> [arrivo]');
if (/^0{7,40}$/.test(partenza)) esci(64, 'NON MISURATO: il ref di partenza e\' tutto zeri (ramo appena creato). Questa guardia vale sui push a un ramo che esiste gia\'.');

let cambiati, prima, dopo;
try {
  cambiati = git(['diff', '--name-only', partenza, arrivo]).split('\n').filter(Boolean);
  prima = versioneDi(partenza);
  dopo = versioneDi(arrivo);
} catch (e) {
  esci(64, 'NON MISURATO: git non risponde su ' + partenza + '..' + arrivo + ' — ' + String(e.message).split('\n')[0] +
    '\n  (in CI serve un checkout con la storia: actions/checkout con fetch-depth: 0)');
}

const sorgenti = cambiati.filter(function (f) { return SORGENTE.test(f); });

if (!sorgenti.length) {
  esci(0, 'A POSTO — fra ' + partenza.slice(0, 7) + ' e ' + arrivo.slice(0, 7) +
    ' non e\' cambiato nessun file servito al browser: la versione non doveva salire (e\' ' + dopo + ').');
}
if (dopo === null) {
  esci(1, 'VERSIONE ASSENTE — index.html non ha nessun `?v=` sui tag di app/. Il browser puo\' mescolare file vecchi e nuovi.');
}
if (prima === dopo) {
  esci(1, 'LA VERSIONE NON E\' SALITA — e\' ancora ' + dopo + ', ma sono cambiati ' + sorgenti.length +
    ' file serviti al browser:\n  ' + sorgenti.join('\n  ') +
    '\n\n  Chi apre l\'app con la cache piena ricevera\' i file VECCHI a questo stesso indirizzo,' +
    '\n  e vedra\' un\'app che nessuno ha scritto. Alza la versione nei quattordici tag di index.html.');
}
esci(0, 'A POSTO — ' + sorgenti.length + ' file serviti al browser sono cambiati, e la versione e\' salita da ' + prima + ' a ' + dopo + '.');
