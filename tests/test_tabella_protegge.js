// PROTEGGE: che la tabella «Cosa protegge ogni file» di `tests/README.md` resti GENERATA dalle testate `// PROTEGGE:` e non torni una copia a mano — una riga corretta nel README e non nella testata, o un file di test nuovo senza testata, fanno diventare rossa la suite invece di divergere in silenzio. E che la tabella dica di sé, nella prima riga, che è generata e non si modifica a mano.
//
// Deciso da chi guida il progetto il 2026-10-21: la fonte e' la TESTATA, la
// tabella si deriva, e un test fallisce se divergono — la stessa forma di
// `howItWorks.title` derivato da `moduleLabels`. Misurato quel giorno: dei 69
// file con testata e riga, zero le avevano uguali.
//
// COME — con lo strumento vero (`tests/tools/tabella-protegge.js`), in due
// modi:
//   [A] ogni `tests/test_*.js` porta la testata in prima riga, e chi non ce
//       l'ha e' NOMINATO (regola 49: senza la testata non c'e' niente da
//       generare, e il silenzio sembrerebbe un verde);
//   [B] il README ha UNA coppia di segni, e la prima riga della tabella e'
//       quella che dice «GENERATA»;
//   [C] la tabella del README e' identica a quella che le testate di oggi
//       generano — se no, dice quali righe;
//   [D] ⚠️ IL CASO PIU' DIVERSO (regola 42), in una cartella temporanea:
//       l'AIUTANTE senza testata, che non deve contare come un buco, accanto
//       al file di test senza testata, che deve. E la testata «da confermare»,
//       che deve arrivare in tabella marcata; e un `|` nel testo, che
//       chiuderebbe la colonna;
//   [E] lo strumento come processo, su una COPIA del README con una cella
//       ritoccata a mano: esce 1 e nomina il file. Sulla copia intatta esce 0.
//
// LIMITE: non giudica il CONTENUTO di una testata — che dica davvero cosa il
// file protegge e' un giudizio, e resta di chi la scrive (regola 32).

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { repoPath } = require('./test-env');
const T = require('./tools/tabella-protegge.js');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const temporanee = [];
function cartella() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'tabella-protegge-'));
  temporanee.push(d);
  return d;
}

function run() {
  // ── [A] ogni file di test ha la testata ──────────────────────────────
  const { voci, senza } = T.leggiTestate();
  const fileDiTest = fs.readdirSync(repoPath('tests')).filter((f) => /^test_.*\.js$/.test(f));
  log('[A] Ci sono file di test da leggere', fileDiTest.length > 0, String(fileDiTest.length));
  log('[A] ⚠️ Ogni tests/test_*.js comincia con `// PROTEGGE:`', senza.length === 0, senza.join(', '));
  log('[A] ...e ognuno e\' una voce della tabella', fileDiTest.every((f) => voci.some((v) => v.file === f)),
    fileDiTest.filter((f) => !voci.some((v) => v.file === f)).join(', '));

  // ── [B] i segni e la prima riga ──────────────────────────────────────
  const readme = fs.readFileSync(repoPath('tests', 'README.md'), 'utf8');
  const pezzi = T.tabellaNelReadme(readme);
  log('[B] Il README ha una coppia sola di segni della tabella generata', !!pezzi);
  const righe = pezzi ? pezzi.tabella.split('\n').filter((r) => /^\|/.test(r)) : [];
  log('[B] ⚠️ La prima riga della tabella dice che e\' GENERATA e non si modifica a mano',
    righe[2] === T.PRIMA_RIGA && /GENERATA/.test(righe[2]) && /Non si modifica a mano/.test(righe[2]), righe[2]);

  // ── [C] il README e' quello che le testate generano ──────────────────
  const attesa = T.generaTabella(voci);
  const diverse = pezzi ? attesa.split('\n').filter((r) => pezzi.tabella.split('\n').indexOf(r) === -1) : ['(niente segni)'];
  log('[C] ⚠️ La tabella del README e\' identica a quella generata dalle testate', !!pezzi && pezzi.tabella === attesa,
    diverse.map((r) => (r.match(/^\| `([^`]+)`/) || [null, r.slice(0, 50)])[1]).join(', '));
  log('[C] ...e ha una riga per ogni testata (' + voci.length + ')', righe.length === voci.length + 3, String(righe.length - 3));

  // ── [D] il caso piu' diverso, in una cartella temporanea ─────────────
  const d = cartella();
  fs.writeFileSync(path.join(d, 'test_senza.js'), "'use strict';\n");
  fs.writeFileSync(path.join(d, 'aiutante_senza.js'), '// Un aiutante qualunque.\n');
  fs.writeFileSync(path.join(d, 'aiutante_con.js'), '// PROTEGGE: che l\'aiutante\n// serva.\n//\n// Il resto.\n');
  fs.writeFileSync(path.join(d, 'test_dubbio.js'), '// PROTEGGE (da confermare): a | b\n//\n// Il resto.\n');
  const prova = T.leggiTestate(d);
  log('[D] Il file di TEST senza testata e\' un buco nominato', prova.senza.join(',') === 'test_senza.js', prova.senza.join(','));
  log('[D] ⚠️ L\'AIUTANTE senza testata non e\' un buco, e non entra in tabella',
    prova.senza.indexOf('aiutante_senza.js') === -1 && !prova.voci.some((v) => v.file === 'aiutante_senza.js'));
  const con = prova.voci.filter((v) => v.file === 'aiutante_con.js')[0];
  log('[D] L\'aiutante CON testata entra, col paragrafo intero e senza il resto',
    !!con && con.testo === 'che l\'aiutante serva.', JSON.stringify(con));
  const tab = T.generaTabella(prova.voci);
  log('[D] ⚠️ La testata «da confermare» arriva in tabella marcata', /\| `test_dubbio\.js` \| ⚠️ \*\*DA CONFERMARE\*\* — /.test(tab));
  log('[D] ...e il `|` del testo non chiude la colonna', tab.indexOf('a \\| b') !== -1);

  // ── [E] lo strumento come processo ───────────────────────────────────
  const e = cartella();
  fs.mkdirSync(path.join(e, 'tools'));
  fs.copyFileSync(repoPath('tests', 'tools', 'tabella-protegge.js'), path.join(e, 'tools', 'tabella-protegge.js'));
  fs.readdirSync(repoPath('tests')).filter((f) => /\.js$/.test(f))
    .forEach((f) => fs.copyFileSync(repoPath('tests', f), path.join(e, f)));
  fs.writeFileSync(path.join(e, 'README.md'), readme);
  const lancia = () => spawnSync('node', [path.join(e, 'tools', 'tabella-protegge.js')], { encoding: 'utf8' });
  let r = lancia();
  log('[E] Sulla copia intatta lo strumento esce 0', r.status === 0, r.status + ' ' + (r.stderr || '').slice(0, 200));
  const primo = voci[0];
  const ritoccato = readme.replace('| `' + primo.file + '` | ', '| `' + primo.file + '` | Ritoccata a mano. ');
  fs.writeFileSync(path.join(e, 'README.md'), ritoccato);
  r = lancia();
  log('[E] ⚠️ Con una cella ritoccata a mano esce 1', r.status === 1, String(r.status));
  log('[E] ...e nomina il file di quella cella', (r.stderr || '').indexOf(primo.file) !== -1, (r.stderr || '').slice(0, 200));

  temporanee.forEach((t) => fs.rmSync(t, { recursive: true, force: true }));
  console.log('\n=== TABELLA PROTEGGE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run();
