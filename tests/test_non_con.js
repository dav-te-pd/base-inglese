// PROTEGGE: che una voce dichiarata «non con» un'altra non le compaia MAI accanto come alternativa in Match e Speed Match, che la colonna `non con` arrivi dai markdown degli episodi al JSON senza che una coppia scritta in un verso solo o un id fuori dal grado passino, che il bacino si misuri PER VOCE togliendo gli esclusi, e che il MODELLO degli episodi si trascriva davvero.
//
// Il caso che l'ha fatto nascere, misurato da chi guida il progetto: nel grado
// C di `spagnolo-it-gate` c-1, c-4, c-5 differiscono solo per il segnaposto
// («Sono Marco» / «Sono Giulia»), e per c-1 la probabilità che fra tre
// distrattori ci fosse uno dei gemelli era il 64% — chi cerca il nome azzecca
// senza leggere la lingua.
//
// COME:
//   [A] i fermi di FORMA (`controllaNonCon`): gli episodi veri passano; una
//       coppia rotta in un verso solo ferma e nomina la coppia (2c); un id che
//       nel grado non c'è ferma — compreso un id di un ALTRO grado (2d); una
//       voce che esclude sé stessa ferma;
//   [B] il bacino PER VOCE (`bacinoCorto`): gli episodi veri passano; una
//       voce con troppe esclusioni ferma anche se il grado «basta»; il grado B
//       di `spagnolo-it-gate`, a margine zero, si ferma alla prima coppia (2a);
//   [C] il MODELLO si trascrive (fino al 2026-10-07 «nessun test lo
//       trascrive»), passa i fermi di forma, e il bacino sul modello direbbe
//       rosso — che è il motivo per cui sul modello il bacino NON si guarda:
//       un'eccezione controllata, non solo scritta;
//   [D] l'app: su 300 estrazioni, una voce con `nonCon` non vede mai le sue
//       escluse; la stessa voce senza `nonCon` le vede (il test sa vedere).
//
// ⚠️ LIMITE: [D] guida `buildMultipleChoiceOptions` con voci costruite qui,
// senza segnaposto. Che Match e Speed Match le passino il vocabolario del
// grado così com'è nel JSON — `nonCon` compreso — lo dice la lettura del
// codice (`episodeGradeRequired`), non questo file.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');
const T = require('./tools/trascrivi.js');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}
const sollevato = function (f) { try { f(); return null; } catch (e) { return e.message; } };
const copia = (o) => JSON.parse(JSON.stringify(o));

const MODELLO = 'nuovi/inglese-it-EPISODIO-VUOTO.md';

async function run() {
  const struttura = JSON.parse(fs.readFileSync(repoPath('data/inglese/it/inglese-it-struttura-corso.json'), 'utf8'));
  const gate = JSON.parse(fs.readFileSync(repoPath('data/inglese/it/inglese-it-gate.json'), 'utf8'));
  const gateEs = JSON.parse(fs.readFileSync(repoPath('data/spagnolo/it/spagnolo-it-gate.json'), 'utf8'));
  const C = gate.levels.C.items;

  // Regola 49: se il JSON non porta nessuna esclusione, questo file non
  // starebbe guardando niente.
  const conEsclusioni = C.filter(v => v.nonCon);
  log('[A] Il grado C di inglese-it-gate porta delle esclusioni da guardare', conEsclusioni.length > 0, String(conEsclusioni.length));

  // ── [A] I fermi di forma ──
  log('[A] I quattro episodi veri passano i fermi di forma',
    [gate, gateEs].every(j => ['A', 'B', 'C'].every(g => sollevato(() => T.controllaNonCon('x', g, j.levels[g].items)) === null)));

  const asimmetrico = copia(C);
  const a = asimmetrico.find(v => v.nonCon);
  const b = asimmetrico.find(v => v.id === a.nonCon[0]);
  b.nonCon = b.nonCon.filter(x => x !== a.id);
  if (!b.nonCon.length) delete b.nonCon;
  const mAsim = sollevato(() => T.controllaNonCon('gate', 'C', asimmetrico));
  log('[A] Una coppia rotta in un verso solo FERMA, e nomina la coppia (' + a.id + ' → ' + b.id + ')',
    !!mAsim && mAsim.indexOf(a.id + ' esclude ' + b.id) !== -1 && /due versi/.test(mAsim), String(mAsim));

  const altroGrado = copia(C);
  altroGrado[0].nonCon = (altroGrado[0].nonCon || []).concat([gate.levels.A.items[0].id]);
  const mGrado = sollevato(() => T.controllaNonCon('gate', 'C', altroGrado));
  log('[A] Un id di un ALTRO grado ferma: `non con` vale solo dentro il grado (2d)',
    !!mGrado && /non esiste/.test(mGrado) && mGrado.indexOf(gate.levels.A.items[0].id) !== -1, String(mGrado));

  const seStessa = copia(C);
  seStessa[0].nonCon = [seStessa[0].id];
  log('[A] Una voce che esclude sé stessa ferma',
    /se' stessa/.test(String(sollevato(() => T.controllaNonCon('gate', 'C', seStessa)))));

  // ── [B] Il bacino per voce ──
  const sm = T.sceltaMultipla();
  const seq = struttura.episodes.gate.sequence;
  log('[B] Gli episodi veri passano il bacino per voce',
    T.bacinoCorto('gate', gate, seq, struttura.sequences, sm).length === 0 &&
    T.bacinoCorto('gate', gateEs, seq, struttura.sequences, sm).length === 0);

  // Un grado C di 5 voci «basta» per grado (5 ≥ 4), ma una voce con due
  // esclusioni ha bacino 2.
  const stretto = copia(gate);
  stretto.levels.C.items = stretto.levels.C.items.slice(0, 5).map(v => { const w = copia(v); delete w.nonCon; return w; });
  const [p, q, r] = stretto.levels.C.items;
  p.nonCon = [q.id, r.id]; q.nonCon = [p.id]; r.nonCon = [p.id];
  const rS = T.bacinoCorto('gate', stretto, seq, struttura.sequences, sm);
  log('[B] Un grado di 5 voci «basta», ma la voce con due esclusioni ha bacino 2 e ferma — una riga, solo lei',
    rS.length === 1 && rS[0].indexOf('voce ' + p.id + ': bacino 2 (5 voci − 1 − 2 esclusi)') !== -1, rS.join(' | '));

  // 2a: il grado B di spagnolo-it-gate ha 4 voci, cioè margine zero.
  const margine = copia(gateEs);
  const B = margine.levels.B.items;
  log('[B] Il grado B di spagnolo-it-gate ha davvero ' + (sm.distrattori + 1) + ' voci (margine zero)', B.length === sm.distrattori + 1, String(B.length));
  B[0].nonCon = [B[1].id]; B[1].nonCon = [B[0].id];
  const rM = T.bacinoCorto('gate', margine, seq, struttura.sequences, sm);
  log('[B] ...e una sola coppia lì ferma le due voci della coppia (2a)',
    rM.length === 2 && rM.every(x => /grado B/.test(x)), rM.join(' | '));

  // ── [C] Il modello ──
  const esiste = fs.existsSync(repoPath(MODELLO));
  log('[C] Il modello c\'è (' + MODELLO + ')', esiste);
  if (esiste) {
    let modello = null;
    const mMod = sollevato(() => { modello = T.episodio({ lingua: 'inglese', studente: 'it', pref: 'inglese-it-' }, 'modello',
      struttura.gradeNames, fs.readFileSync(repoPath(MODELLO), 'utf8')); });
    log('[C] Il modello SI TRASCRIVE, coi fermi di forma compresi', mMod === null, String(mMod));
    if (modello) {
      log('[C] ...con una voce per grado, come dichiarano i suoi numeri attesi',
        ['A', 'B', 'C', 'D'].every(g => modello.json.levels[g].items.length === 1), JSON.stringify(modello.conti));
      log('[C] ⚠️ E il bacino sul modello direbbe ROSSO: è per questo che sul modello non si guarda',
        T.bacinoCorto('modello', modello.json, seq, struttura.sequences, sm).length > 0);
    }
  }

  // ── [D] L'app ──
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  await page.goto(APP_URL);
  await attendiPrimaSchermata(page);
  const esito = await page.evaluate(function () {
    const vocab = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function (x) {
      return { id: x, target: 'T-' + x, native: 'N-' + x };
    });
    vocab[0].nonCon = ['b', 'c']; vocab[1].nonCon = ['a']; vocab[2].nonCon = ['a'];
    const viste = function (voce) {
      const s = {};
      for (let i = 0; i < 300; i++) {
        window.BI.buildMultipleChoiceOptions(voce, 'en-it', vocab).forEach(function (o) { s[o.text] = true; });
      }
      return s;
    };
    const con = viste(vocab[0]);
    const senza = viste({ id: 'a', target: 'T-a', native: 'N-a' });
    return { con: Object.keys(con).sort(), senza: Object.keys(senza).sort(), opzioni: window.BI.buildMultipleChoiceOptions(vocab[0], 'en-it', vocab).length };
  });
  log('[D] Su 300 estrazioni la voce con `nonCon` non vede MAI le sue escluse',
    esito.con.indexOf('N-b') === -1 && esito.con.indexOf('N-c') === -1, esito.con.join(','));
  log('[D] ...e la stessa voce senza `nonCon` le vede: il test sa vedere',
    esito.senza.indexOf('N-b') !== -1 && esito.senza.indexOf('N-c') !== -1, esito.senza.join(','));
  log('[D] Le alternative restano distrattori + 1', esito.opzioni === sm.distrattori + 1, String(esito.opzioni));
  log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await browser.close();
  finisci();
}

function finisci() {
  console.log('\n=== NON CON SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
