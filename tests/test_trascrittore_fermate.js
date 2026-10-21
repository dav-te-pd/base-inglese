// PROTEGGE: che il trascrittore, davanti a un markdown obbligatorio che
// manca, si FERMI PRIMA DI SCRIVERE e dica TUTTI i mancanti con percorso e chi
// li chiede — compresi i due file condivisi di una lingua-studente che non ha
// la sua cartella — invece di morire con un `ENOENT` e lo stack trace, magari
// a meta' della scrittura; e che crei da solo le cartelle di `data/` che
// un'edizione nuova chiede, ma solo quando scrive davvero, mai sotto
// `--controlla`.
//
// Chiesto da chi guida il progetto il 2026-10-19, insieme all'edizione
// `italiano/es`: la prima con uno studente non italiano, cioe' la prima che
// chiedeva due cartelle nuove sotto `data/` — e lo strumento e' morto
// scrivendo, con `inglese/it` gia' riscritta e il resto no.
//
// COME — si lancia il trascrittore VERO su una COPIA di `docs/`, `data/` e
// `app/` in una cartella temporanea, e si tolgono file VERI. Il repository non
// si tocca:
//   [A] la copia intatta: `--controlla` esce con 0 e non trova niente da
//       cambiare — senza questo, tutti i rossi sotto potrebbero venire dalla
//       copia e non dal file tolto;
//   [B] due file tolti in due edizioni diverse — le tabelle della prima, un
//       episodio dell'ultima: esce con 1, una riga «FERMO — mancano 2 file»,
//       i due percorsi, chi li chiede, niente stack trace, e `data/` identica
//       byte per byte (si e' fermato PRIMA di scrivere, non durante);
//   [C] ⚠️ IL CASO PIU' DIVERSO (regola 42): una lingua-studente SENZA la sua
//       cartella condivisa. Si costruisce copiando un'edizione vera sotto uno
//       studente `zz` che in `docs/condivisi/` non c'e'. E' l'unico mancante
//       che nessuno cercava: `studentiCondivisi()` elenca solo le cartelle che
//       esistono, e prima del 2026-10-19 lo chiedeva soltanto la struttura,
//       leggendolo per le categorie — con un `ENOENT`;
//   [D] le cartelle di `data/` tolte: `--controlla` NON le crea (un controllo
//       che crea una cartella e' un controllo che scrive), la scrittura si' — e
//       i file che rimette sono identici a quelli che c'erano.
//
// FALSIFICATO: col trascrittore di prima, 13 asserzioni su 23 rosse.
//
// LIMITE: non prova un markdown presente ma illeggibile (permessi): resta un
// errore di sistema, con lo stack trace.

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { repoPath } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Una copia nuova per ogni caso: un caso non eredita i file tolti dal
// precedente.
const copie = [];
function copia() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trascrittore-fermate-'));
  copie.push(dir);
  ['docs', 'data', 'app'].forEach((d) => fs.cpSync(repoPath(d), path.join(dir, d), { recursive: true }));
  fs.mkdirSync(path.join(dir, 'tests', 'tools'), { recursive: true });
  fs.copyFileSync(repoPath('tests', 'tools', 'trascrivi.js'), path.join(dir, 'tests', 'tools', 'trascrivi.js'));
  return dir;
}

function lancia(dir, controlla) {
  const r = spawnSync('node', [path.join(dir, 'tests', 'tools', 'trascrivi.js')].concat(controlla ? ['--controlla'] : []),
    { encoding: 'utf8' });
  return { uscita: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// Tutti i file sotto una cartella, col loro contenuto: due fotografie uguali
// vogliono dire che non e' stato scritto niente.
function fotografia(base) {
  const fuori = {};
  (function giro(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) giro(p); else fuori[path.relative(base, p)] = fs.readFileSync(p, 'utf8');
    });
  })(base);
  return fuori;
}

const STACK = /^\s+at |ENOENT/m;

function run() {
  // Le edizioni vere, dal file che il trascrittore stesso scrive: la prima e
  // l'ultima, perche' [B] vuole due edizioni diverse.
  const edizioni = JSON.parse(fs.readFileSync(repoPath('data', 'edizioni.json'), 'utf8')).edizioni;
  log('Ci sono almeno due edizioni da cui togliere file', edizioni.length >= 2, String(edizioni.length));
  if (edizioni.length < 2) return finisci();
  const prima = edizioni[0], ultima = edizioni[edizioni.length - 1];
  const pref = (e) => e.lingua + '-' + e.studente + '-';
  const docEd = (dir, e, n) => path.join(dir, 'docs', e.lingua, e.studente, pref(e) + n + '.md');
  const strutturaUltima = JSON.parse(fs.readFileSync(repoPath('data', ultima.lingua, ultima.studente,
    pref(ultima) + 'struttura-corso.json'), 'utf8'));
  const episodio = Object.keys(strutturaUltima.episodes)[0];

  // ── [A] la copia intatta ─────────────────────────────────────────────
  let dir = copia();
  let r = lancia(dir, true);
  log('[A] Sulla copia intatta `--controlla` esce con 0', r.uscita === 0, r.uscita + ' ' + r.err.slice(0, 300));
  log('[A] ...e non trova niente da cambiare', !/CAMBIA/.test(r.out), (r.out.match(/CAMBIA.*/g) || []).join(' | '));

  // ── [B] due file tolti in due edizioni ───────────────────────────────
  dir = copia();
  const tabelle = docEd(dir, prima, 'tabelle-personalizzazione');
  const ep = docEd(dir, ultima, episodio);
  fs.rmSync(tabelle);
  fs.rmSync(ep);
  const datiPrima = fotografia(path.join(dir, 'data'));
  r = lancia(dir, false);
  log('[B] Due file tolti: esce con 1', r.uscita === 1, String(r.uscita));
  log('[B] La prima riga dice FERMO e il conto: «mancano 2 file obbligatori»',
    /^FERMO — mancano 2 file obbligatori\. Non e' stato scritto niente:/.test(r.err), r.err.split('\n')[0]);
  log('[B] Nomina le tabelle tolte, col percorso del repository', r.err.indexOf(path.relative(dir, tabelle)) !== -1);
  log('[B] ...e dice chi le chiede: l\'edizione ' + prima.lingua + '/' + prima.studente,
    r.err.indexOf('lo chiede: l\'edizione ' + prima.lingua + '/' + prima.studente) !== -1);
  log('[B] Nomina l\'episodio tolto, ' + episodio + ' di ' + ultima.lingua + '/' + ultima.studente,
    r.err.indexOf(path.relative(dir, ep)) !== -1);
  log('[B] ...e dice chi lo chiede: la sezione 7 della sua struttura',
    r.err.indexOf('lo chiede: la sezione 7 di ' + pref(ultima) + 'struttura-corso.md — l\'episodio `' + episodio + '`') !== -1);
  log('[B] ⚠️ Niente stack trace e niente ENOENT', !STACK.test(r.err), (r.err.match(STACK) || [''])[0]);
  const datiDopo = fotografia(path.join(dir, 'data'));
  log('[B] ⚠️ `data/` e\' identica byte per byte: si e\' fermato PRIMA di scrivere, non durante',
    JSON.stringify(datiPrima) === JSON.stringify(datiDopo));

  // ── [C] una lingua-studente senza la sua cartella condivisa ──────────
  // Un'edizione vera ricopiata sotto lo studente `zz`: stessi contenuti,
  // prefisso nuovo. `docs/condivisi/zz/` non esiste.
  dir = copia();
  const sorg = path.join(dir, 'docs', prima.lingua, prima.studente);
  const dest = path.join(dir, 'docs', prima.lingua, 'zz');
  fs.mkdirSync(dest);
  fs.readdirSync(sorg).forEach((n) => {
    fs.copyFileSync(path.join(sorg, n), path.join(dest, n.replace(pref(prima), prima.lingua + '-zz-')));
  });
  r = lancia(dir, true);
  log('[C] ⚠️ Studente `zz` senza docs/condivisi/zz/: esce con 1', r.uscita === 1, String(r.uscita));
  log('[C] «mancano 2 file obbligatori»: i due condivisi della lingua dello studente',
    /^FERMO — mancano 2 file obbligatori/.test(r.err), r.err.split('\n')[0]);
  ['istruzioni-moduli', 'messaggi-feedback'].forEach((n) => {
    log('[C] Nomina docs/condivisi/zz/zz-' + n + '.md',
      r.err.indexOf(path.join('docs', 'condivisi', 'zz', 'zz-' + n + '.md')) !== -1);
  });
  log('[C] ...e dice perche\': il suo studente e\' `zz`',
    r.err.indexOf('lo chiede: l\'edizione ' + prima.lingua + '/zz — il suo studente e\' `zz`') !== -1);
  log('[C] ⚠️ Niente stack trace e niente ENOENT', !STACK.test(r.err), (r.err.match(STACK) || [''])[0]);

  // ── [D] le cartelle di data/ che mancano ─────────────────────────────
  dir = copia();
  const cartellaEd = path.join(dir, 'data', ultima.lingua, ultima.studente);
  const cartellaCond = path.join(dir, 'data', 'condivisi', ultima.studente);
  const vecchiEd = fotografia(cartellaEd);
  const vecchiCond = fotografia(cartellaCond);
  fs.rmSync(cartellaEd, { recursive: true });
  fs.rmSync(cartellaCond, { recursive: true });
  r = lancia(dir, true);
  log('[D] `--controlla` con le cartelle tolte esce con 0 e dice CAMBIA', r.uscita === 0 && /CAMBIA/.test(r.out),
    r.uscita + ' ' + r.err.slice(0, 300));
  log('[D] ⚠️ ...e NON le crea: un controllo non scrive',
    !fs.existsSync(cartellaEd) && !fs.existsSync(cartellaCond));
  r = lancia(dir, false);
  log('[D] La scrittura esce con 0', r.uscita === 0, r.uscita + ' ' + r.err.slice(0, 300));
  log('[D] ⚠️ Niente stack trace e niente ENOENT', !STACK.test(r.err), (r.err.match(STACK) || [''])[0]);
  const nuoviEd = fs.existsSync(cartellaEd) ? fotografia(cartellaEd) : {};
  const nuoviCond = fs.existsSync(cartellaCond) ? fotografia(cartellaCond) : {};
  // Il file delle migrazioni lo scrive Claude Code a mano, non il
  // trascrittore: e' l'unico che non torna, ed e' giusto cosi'.
  const scritti = Object.keys(vecchiEd).filter((n) => !/migrazioni/.test(n));
  log('[D] Rimette i file di ' + ultima.lingua + '/' + ultima.studente + ' (' + scritti.length + '), identici',
    scritti.length > 0 && scritti.every((n) => nuoviEd[n] === vecchiEd[n]),
    scritti.filter((n) => nuoviEd[n] !== vecchiEd[n]).join(', '));
  log('[D] Rimette i due file di data/condivisi/' + ultima.studente + '/, identici',
    Object.keys(vecchiCond).length === 2 && Object.keys(vecchiCond).every((n) => nuoviCond[n] === vecchiCond[n]),
    Object.keys(vecchiCond).join(', '));

  finisci();
}

function finisci() {
  copie.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
  console.log('\n=== TRASCRITTORE FERMATE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run();
