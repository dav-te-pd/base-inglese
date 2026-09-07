// PROTEGGE: che tests/tools/attendi.sh riporti il codice GIUSTO — 0 quando il
// lavoro e' finito bene, 1 quando e' finito male. E' l'unico strumento che sta
// fra "la suite e' finita" e quello che poi racconto: se sbaglia codice, un
// rosso passa per verde e nessuno se ne accorge, perche' il suo output somiglia
// a un risultato in entrambi i casi.
//
// Perche' un test per venti righe di bash: una rete che nessuno esercita si
// sfilaccia in silenzio. Il precedente e' in casa — i 25 file della suite
// vissuti per giorni solo dentro il container, e la copia di sicurezza
// divergente da settimane. Nessuno dei due si e' annunciato.
//
// COME: due comandi VERI, non due file di log preparati. Il comando ci mette
// un momento prima di scrivere il proprio esito, cosi' l'attesa deve girare
// almeno un giro: se attendi.sh smettesse di aspettare e leggesse una volta
// sola, questo test lo vedrebbe. Un log gia' scritto proverebbe solo che sa
// fare grep.
//
// LIMITE DICHIARATO: qui si provano le due uscite che si usano ogni giorno.
// Il terzo caso — tempo scaduto, uscita 2 — non e' coperto: costerebbe al test
// l'attesa che deve misurare. E' stato esercitato a mano il 2026-09-07.

const { execFile, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { repoPath } = require('./test-env');

const ATTENDI = repoPath('tests', 'tools', 'attendi.sh');
const OK = 'ALL FILES GREEN';
const KO = 'SOME FILES FAILED';

// Un lavoro vero: scrive qualche riga, ci mette un attimo, poi dichiara il
// proprio esito. E' la forma di run_full_regression.sh, in piccolo.
function lavoro(logPath, esito) {
  const script =
    'echo "=== primo file ==="; echo OK; sleep 2; echo "=== secondo file ==="; echo "' + esito + '"';
  return new Promise(function (resolve) {
    const out = fs.openSync(logPath, 'w');
    const p = spawn('bash', ['-c', script], { stdio: ['ignore', out, out] });
    p.on('close', function () { fs.closeSync(out); resolve(); });
  });
}

function attendi(logPath) {
  return new Promise(function (resolve) {
    const t0 = Date.now();
    execFile('bash', [ATTENDI, logPath, OK, KO, '60'],
      { env: Object.assign({}, process.env, { ATTENDI_INTERVALLO: '1' }) },
      function (err, stdout) {
        resolve({ codice: err ? err.code : 0, testo: String(stdout).trim(), durataMs: Date.now() - t0 });
      });
  });
}

async function run() {
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'attendi-'));

  for (const caso of [
    { nome: 'un lavoro che finisce bene', esito: OK, codiceAtteso: 0, parola: 'FINITO BENE' },
    { nome: 'un lavoro che finisce male', esito: KO, codiceAtteso: 1, parola: 'FINITO MALE' }
  ]) {
    const logPath = path.join(dir, caso.esito.split(' ')[1] + '.log');
    const lavoroFinito = lavoro(logPath, caso.esito);
    const esito = await attendi(logPath);
    await lavoroFinito;

    if (esito.codice !== caso.codiceAtteso) console.log('  uscita: ' + esito.codice + ' — detto: ' + esito.testo);
    log('[attendi.sh] ' + caso.nome + ': uscita ' + caso.codiceAtteso,
        esito.codice === caso.codiceAtteso);
    log('[attendi.sh] ' + caso.nome + ': lo dice, non solo lo restituisce',
        esito.testo.indexOf(caso.parola) === 0);
    // Se avesse letto una volta sola sarebbe tornata subito, prima che il
    // comando scrivesse il proprio esito: ha aspettato davvero.
    log('[attendi.sh] ' + caso.nome + ': ha aspettato il lavoro invece di leggere una volta sola',
        esito.durataMs >= 1500);
  }

  fs.rmSync(dir, { recursive: true, force: true });
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== ATTENDI SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
