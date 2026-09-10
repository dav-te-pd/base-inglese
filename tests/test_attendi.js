// PROTEGGE: che tests/tools/attendi.sh riporti il codice GIUSTO — 0 quando il
// lavoro e' finito bene, 1 quando e' finito male — e che, quando si arrende,
// dica QUALE dei due guasti ha davanti: 2 se il lavoro e' vivo e non finisce,
// 3 se e' morto o non e' mai partito. E' l'unico strumento che sta fra "la
// suite e' finita" e quello che poi racconto: se sbaglia codice, un rosso passa
// per verde e nessuno se ne accorge, perche' il suo output somiglia a un
// risultato in entrambi i casi.
//
// Perche' un test per venti righe di bash: una rete che nessuno esercita si
// sfilaccia in silenzio. Il precedente e' in casa — i 25 file della suite
// vissuti per giorni solo dentro il container, e la copia di sicurezza
// divergente da settimane. Nessuno dei due si e' annunciato.
//
// COME: comandi VERI, non file di log preparati. Il comando ci mette un momento
// prima di scrivere il proprio esito, cosi' l'attesa deve girare almeno un
// giro: se attendi.sh smettesse di aspettare e leggesse una volta sola, questo
// test lo vedrebbe. Un log gia' scritto proverebbe solo che sa fare grep.
//
// LE DUE META' CHE CONTANO, e sono due prove diverse (regola 32):
//   il GUASTO REALISTICO — un lavoro che scrive e poi viene UCCISO. E' quello
//     capitato davvero. La forma vecchia lo vedeva solo allo scadere del tetto
//     e lo chiamava "tempo scaduto", cioe' dava l'informazione sbagliata:
//     misurato il 2026-09-10, 25s e la frase sbagliata contro 2s e quella
//     giusta. Con i valori veri sono 90 minuti contro 10.
//   la PROVA CONTRARIA — un lavoro VIVO e lento che non finisce mai, che deve
//     uscire 2 e non 3. Senza questo caso il rilevatore di silenzio potrebbe
//     dichiarare morto qualunque lavoro lento, e il test resterebbe verde.
//     Non basta vedere che un'asserzione sa morire: serve vedere che non
//     uccide quello che deve sopravvivere.
//
// Le soglie sono pilotabili (ATTENDI_SILENZIO, e il tetto e' il 4o argomento),
// quindi i due casi costano secondi invece dei minuti che costavano prima: e'
// il motivo per cui il terzo caso, dichiarato scoperto il 2026-09-08, ora e'
// coperto. Resta fuori un solo ramo: che i DEFAULT siano 5400 e 600 — quelli si
// leggono nel file, provarli costerebbe al test l'attesa che deve misurare.

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

// Lancia un comando qualunque scrivendo sul log, e restituisce il processo:
// serve per ucciderlo (il guasto realistico) o per fermarlo alla fine (il
// lavoro vivo che non finirebbe mai da solo).
function lancia(logPath, script) {
  const out = fs.openSync(logPath, 'w');
  const p = spawn('bash', ['-c', script], { stdio: ['ignore', out, out] });
  p.on('close', function () { try { fs.closeSync(out); } catch (e) { /* gia' chiuso */ } });
  return p;
}

function attendi(logPath, opzioni) {
  const o = opzioni || {};
  return new Promise(function (resolve) {
    const t0 = Date.now();
    execFile('bash', [ATTENDI, logPath, OK, KO, String(o.max || 60)],
      { env: Object.assign({}, process.env, {
          ATTENDI_INTERVALLO: '1',
          ATTENDI_SILENZIO: String(o.silenzio || 600)
        }) },
      function (err, stdout) {
        resolve({ codice: err ? err.code : 0, testo: String(stdout).trim(), durataMs: Date.now() - t0 });
      });
  });
}

function attesa(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function run() {
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'attendi-'));

  // ── I due esiti di ogni giorno ────────────────────────────────────────────
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

  // ── IL GUASTO REALISTICO: il lavoro scrive e poi viene ucciso ─────────────
  // Il tetto e' largo (60s) apposta: se attendi.sh non avesse il rilevatore di
  // silenzio, arriverebbe qui allo scadere del tetto e con la frase sbagliata.
  {
    const logPath = path.join(dir, 'morto.log');
    const p = lancia(logPath, 'echo "=== test_batch11.js ==="; echo "OK - qualcosa"; sleep 300');
    await attesa(600);
    p.kill('SIGKILL');
    const esito = await attendi(logPath, { silenzio: 3, max: 60 });

    if (esito.codice !== 3) console.log('  uscita: ' + esito.codice + ' — detto: ' + esito.testo);
    log('[attendi.sh] lavoro ucciso: uscita 3, non il 2 del tempo scaduto',
        esito.codice === 3);
    log('[attendi.sh] lavoro ucciso: dice che nessuno sta piu\' scrivendo',
        /NESSUNO STA PI/.test(esito.testo));
    // La frase del tetto e' proprio quella che NON deve comparire: e' la
    // risposta sbagliata a questo guasto — non ha aspettato troppo, ha
    // aspettato un cadavere.
    log('[attendi.sh] lavoro ucciso: NON lo chiama "ancora in corso"',
        !/ANCORA IN CORSO/.test(esito.testo));
    log('[attendi.sh] lavoro ucciso: riporta l\'ultima riga scritta, per sapere dove si e\' fermato',
        esito.testo.indexOf('OK - qualcosa') !== -1);
    // La differenza fra le due forme e' il tempo: la vecchia sarebbe arrivata
    // ai 60s del tetto, questa si accorge entro pochi secondi di silenzio.
    log('[attendi.sh] lavoro ucciso: si accorge del silenzio invece di aspettare il tetto',
        esito.durataMs < 20000);
  }

  // ── LA PROVA CONTRARIA: il lavoro e' VIVO e lento, e non deve morire ──────
  // Scrive di continuo, non arriva mai a un marcatore, e il tetto scade prima.
  // Se il rilevatore di silenzio fosse troppo zelante, questo caso uscirebbe 3.
  {
    const logPath = path.join(dir, 'vivo.log');
    const p = lancia(logPath, 'for i in $(seq 1 120); do echo "=== file $i ==="; sleep 1; done');
    const esito = await attendi(logPath, { silenzio: 3, max: 6 });
    p.kill('SIGKILL');

    if (esito.codice !== 2) console.log('  uscita: ' + esito.codice + ' — detto: ' + esito.testo);
    log('[attendi.sh] lavoro vivo e lento: uscita 2, il tetto — non lo dichiara morto',
        esito.codice === 2);
    log('[attendi.sh] lavoro vivo e lento: dice che e\' ancora in corso',
        /ANCORA IN CORSO/.test(esito.testo));
    log('[attendi.sh] lavoro vivo e lento: NON dice che nessuno sta piu\' scrivendo',
        !/NESSUNO STA PI/.test(esito.testo));
  }

  // ── IL PERCORSO SBAGLIATO: nessuno scrivera' mai su quel file ─────────────
  // Il guasto piu' stupido e piu' frequente. Va distinto dal lavoro morto:
  // "cerco un processo morto" e "cerco un percorso sbagliato" sono due ricerche
  // diverse, e senza la frase si fanno tutte e due.
  {
    const logPath = path.join(dir, 'mai-scritto.log');
    const esito = await attendi(logPath, { silenzio: 3, max: 60 });

    if (esito.codice !== 3) console.log('  uscita: ' + esito.codice + ' — detto: ' + esito.testo);
    log('[attendi.sh] log mai scritto: uscita 3', esito.codice === 3);
    log('[attendi.sh] log mai scritto: lo distingue dal lavoro morto',
        /NON HA MAI SCRITTO NIENTE/.test(esito.testo) && !/NESSUNO STA PI/.test(esito.testo));
  }

  // ── ARGOMENTI SBAGLIATI: 64, non il 2 del tempo scaduto ──────────────────
  // Fino al 2026-09-10 uscivano entrambi con 2, e chi leggeva il codice non
  // poteva distinguere "ho aspettato novanta minuti" da "mi hai chiamato male
  // e non ho aspettato per niente".
  {
    const esito = await new Promise(function (resolve) {
      execFile('bash', [ATTENDI, 'solo-un-argomento'], function (err) {
        resolve(err ? err.code : 0);
      });
    });
    if (esito !== 64) console.log('  uscita: ' + esito);
    log('[attendi.sh] argomenti sbagliati: uscita 64, non confondibile col tempo scaduto',
        esito === 64);
  }

  fs.rmSync(dir, { recursive: true, force: true });
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== ATTENDI SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
