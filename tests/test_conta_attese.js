// PROTEGGE: che il censimento delle attese sappia distinguere una GUARDIA da
// un'attesa di NAVIGAZIONE, e che identifichi ogni punto con l'asserzione
// intera invece che con un pezzo.
//
// Perché un test per uno strumento che conta righe: la stessa ragione di
// `test_conta_asserzioni.js` e di `test_attendi.js`. Uno strumento di misura,
// se si guasta, non lo dice — continua a stampare un numero, e il numero
// somiglia a un risultato (CLAUDE.md regola 37). Qui pesa di più del solito:
// il documento che questo strumento genera è quello su cui si PIANIFICA, e
// abbiamo già pagato una volta l'aver pianificato su un censimento morto.
//
// COME: si costruisce un file di test FINTO in una cartella temporanea, con
// dentro i casi che contano, e lo si passa allo strumento come argomento.
// Finto e non vero, perché un test che si appoggia ai file veri della suite
// cambia risposta ogni volta che qualcuno tocca un test — e allora non
// protegge lo strumento, insegue il repository.
//
// ⚠️ E il file finto sta FUORI dal repository, passato per argomento. La prima
// versione di questo test lo scriveva dentro `tests/` e ci infilava il nome
// riscrivendo la riga FILES di `run_full_regression.sh` — cioè **modificando
// lo script che stava eseguendo la suite, mentre la eseguiva**. È la regola 36
// vista da dentro: l'albero di lavoro non si tocca mentre la suite gira, e un
// test che per misurarsi lo tocca è un guasto in attesa, non un test. Per
// questo lo strumento accetta un elenco di file: la possibilità di misurarlo
// senza sporcare niente è parte dello strumento, non un adattamento del test.
//
// I quattro casi, e sono quattro perché le loro conseguenze sono opposte:
// guardia (il verde dipende dai millisecondi), navigazione fermata da
// un'attesa vera, una CATENA di due attese a tempo, ed etichetta composta —
// quella che, letta a metà, darebbe lo stesso identificatore a dodici voci
// diverse.
//
// ⚠️ Il terzo caso è il più fine, e questo test l'ha già corretto una volta:
// in `waitForTimeout(300)` seguito da `waitForTimeout(80)` e poi da un log,
// la prima NON è una guardia — se scade presto il test aspetta ancora — ma
// **la seconda sì**, perché è l'ultima cosa fra l'azione e l'asserzione. Chi
// scrive il test si aspettava due guardie e ne sono uscite tre: aveva torto
// lui, non lo strumento. *È esattamente il motivo per cui uno strumento di
// misura va esercitato invece che riletto.*
//
// LIMITE DICHIARATO: non si prova che la classificazione per FAMIGLIA
// ("cosa aspetta") sia giusta su ogni caso vero — è un'euristica sul testo,
// dichiarata tale anche in testa allo strumento. Qui si prova che sappia
// leggere le famiglie che le si mettono davanti, non che le indovini tutte.

'use strict';
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { repoPath } = require('./test-env');

const STRUMENTO = repoPath('tests', 'tools', 'conta-attese.js');
let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const FINTO = [
  "async function run() {",
  "  // (1) GUARDIA: fra l'attesa e il log non c'e' nient'altro",
  "  await page.click('#a');",
  "  await page.waitForTimeout(150);",
  "  const visibile = await page.isVisible('#b');",
  "  log('[X] la schermata compare', visibile);",
  "",
  "  // (2) NAVIGAZIONE: c'e' un'attesa VERA prima del log",
  "  await page.click('#c');",
  "  await page.waitForTimeout(200);",
  "  await page.waitForSelector('#d');",
  "  log('[Y] non dipende dai millisecondi', true);",
  "",
  "  // (3) NAVIGAZIONE: un'altra attesa a tempo prima del log",
  "  await page.waitForTimeout(300);",
  "  await page.waitForTimeout(80);",
  "  log('[Z] nemmeno questa', true);",
  "",
  "  // (4) GUARDIA con etichetta COMPOSTA",
  "  await page.click('#e');",
  "  await page.waitForTimeout(120);",
  "  const testo = await page.$eval('#f', el => el.textContent);",
  "  log('[W] ' + nome + ': il testo si riempie', !!testo);",
  "}"
].join('\n');

function esegui(percorsoFinto, callback) {
  execFile(process.execPath, [STRUMENTO, percorsoFinto], { cwd: repoPath() },
    function (err, stdout) { callback(err, stdout || ''); });
}

function run() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conta-attese-'));
  const nomeFinto = 'test_finto_attese.js';
  const percorsoFinto = path.join(tmp, nomeFinto);
  fs.writeFileSync(percorsoFinto, FINTO, 'utf8');

  esegui(percorsoFinto, function (err, stdout) {
    try {
      const righe = stdout.split('\n').filter(function (r) { return r.indexOf('`' + nomeFinto + '`') !== -1; });
      const guardie = righe.filter(function (r) { return r.split('|').length > 4; });

      log('[A] Lo strumento gira senza errori', !err, err && String(err).slice(0, 120));
      log('[A] Trova esattamente le TRE guardie, non tutte e cinque le attese',
        guardie.length === 3, guardie.length + ' -> ' + guardie.join(' ~~ ').slice(0, 200));

      const testo = guardie.join('\n');
      log('[B] La guardia (1) e\' quella da 150 ms', /\|\s*150\s*\|/.test(testo));
      log('[B] La guardia (4) e\' quella da 120 ms', /\|\s*120\s*\|/.test(testo));
      log('[B] L\'attesa fermata da waitForSelector NON e\' contata', !/\|\s*200\s*\|/.test(testo));
      log('[B] In una catena, la PRIMA attesa a tempo non e\' contata', !/\|\s*300\s*\|/.test(testo));
      // La distinzione fine: l'ultima della catena e' quella da cui il log
      // dipende davvero, e conta. Senza questa riga lo strumento potrebbe
      // scartare tutta la catena e nessuno se ne accorgerebbe.
      log('[B] ...ma l\'ULTIMA della catena si\': e\' lei che decide il verde', /\|\s*80\s*\|/.test(testo));

      // Il pezzo che rende utile il censimento: l'identita' di una voce.
      log('[C] L\'etichetta composta viene letta INTERA, non fino al primo pezzo',
        /\[W\].*il testo si riempie/.test(testo), testo.slice(0, 200));
      log('[C] ...e non si riduce alla sola sigla', !/\|\s*\[W\]\s*\|/.test(testo));

      // Il conto della navigazione: due, e vanno dette, non nascoste.
      const navRiga = stdout.split('\n').filter(function (r) {
        return r.indexOf('`' + nomeFinto + '`') !== -1 && r.split('|').length === 4;
      })[0] || '';
      log('[D] Le due attese di navigazione sono contate a parte', /\|\s*2\s*\|/.test(navRiga), navRiga);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
    console.log('');
    console.log('=== CONTA ATTESE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
    process.exit(failed === 0 ? 0 : 1);
  });
}

run();
