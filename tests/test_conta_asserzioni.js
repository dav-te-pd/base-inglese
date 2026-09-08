// PROTEGGE: che il contatore delle asserzioni SI ACCORGA di un calo. E' lo
// strumento che difende ogni verde della suite da un test che ha smesso di
// girare — e come ogni strumento di misura, se si guasta non lo dice: continua
// a stampare un numero, e il numero somiglia a un risultato.
//
// Perche' un test per una funzione che conta righe: la stessa ragione di
// test_attendi.js. Una rete che nessuno esercita si sfilaccia in silenzio, e
// questa protegge tutte le altre. Se il conteggio smettesse di vedere i cali,
// nessuno se ne accorgerebbe guardando la suite: sarebbe verde, come sempre.
//
// COME: si costruiscono file di risultato VERI nella forma che i test
// stampano davvero — le tre forme che convivono nella suite (`OK   - `,
// `  PASS  `, `  FAIL  `) — e si guarda cosa il contatore ne ricava. Un
// baseline finto in una cartella temporanea, cosi' il test non tocca quello
// vero.
//
// I tre casi che contano, e sono tre perche' le loro conseguenze sono opposte:
// uguale (va bene), in aumento (va bene, un test nuovo), in calo (deve
// fallire). Un contatore che confonde il terzo con il primo e' peggio di
// nessun contatore.
//
// LIMITE DICHIARATO: non si prova che il conteggio sia GIUSTO su ogni file
// vero della suite — si prova che sappia contare le forme che i test usano e
// che reagisca ai cali. Se un file futuro stampasse le asserzioni in una
// quarta forma, il contatore le ignorerebbe e questo test resterebbe verde:
// e' lo stesso limite dichiarato in testa allo strumento.

'use strict';
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { repoPath } = require('./test-env');

const STRUMENTO = repoPath('tests', 'tools', 'conta-asserzioni.js');
let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Le tre forme che i file della suite stampano davvero, piu' le righe che NON
// sono asserzioni e che il contatore deve lasciar fuori.
function risultatoFinto(quante) {
  const righe = [];
  for (let i = 0; i < quante; i++) {
    if (i % 3 === 0) righe.push('OK   - [Job' + i + '] una cosa');
    else if (i % 3 === 1) righe.push('  PASS  [Job' + i + '] un\'altra');
    else righe.push('  FAIL  [Job' + i + '] una terza');
  }
  // Rumore che somiglia a un'asserzione e non lo e': il riepilogo dei
  // fallimenti di test_batch19 comincia con "FAIL" ma e' una intestazione.
  righe.push('FAILURES:');
  righe.push(' - [Job1] un\'altra');
  righe.push('=== SUMMARY: ' + quante + '/' + quante + ' passed ===');
  righe.push('ALL PASS (' + quante + ' asserzioni)');
  return righe.join('\n') + '\n';
}

function esegui(args, env) {
  return new Promise(function (resolve) {
    execFile('node', [STRUMENTO].concat(args), { env: Object.assign({}, process.env, env) },
      function (err, stdout, stderr) {
        resolve({ code: err ? (err.code === undefined ? 1 : err.code) : 0, out: (stdout || '') + (stderr || '') });
      });
  });
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conta-'));
  const baseline = path.join(tmp, 'baseline.txt');
  const env = { BASELINE_ASSERZIONI: baseline };

  // I .result.txt devono stare accanto ai .js, cioe' in tests/: si usano nomi
  // che non possono collidere con quelli veri, e si cancellano alla fine.
  const A = 'zz_finto_a.js', B = 'zz_finto_b.js';
  const fileA = repoPath('tests', A.replace('.js', '.result.txt'));
  const fileB = repoPath('tests', B.replace('.js', '.result.txt'));
  const pulisci = () => { [fileA, fileB].forEach(f => { try { fs.unlinkSync(f); } catch (e) {} }); };

  try {
    // ---- [A] conta le tre forme, e solo quelle ----
    fs.writeFileSync(fileA, risultatoFinto(7));
    fs.writeFileSync(fileB, risultatoFinto(5));
    let r = await esegui([A, B], env);
    log('[A] Conta le asserzioni delle tre forme e ignora il rumore',
      /Asserzioni eseguite: 12 in 2 file/.test(r.out), r.out.split('\n')[0]);
    log('[A] Senza baseline non fallisce, e dice come registrarlo',
      r.code === 0 && /Nessun baseline registrato/.test(r.out));

    // ---- [B] scrive il baseline, e da li' il confronto e' uguale ----
    r = await esegui(['--scrivi', A, B], env);
    log('[B] Scrive il baseline', r.code === 0 && fs.existsSync(baseline));
    const scritto = fs.readFileSync(baseline, 'utf8');
    log('[B] Il baseline e\' PER FILE, non un totale solo',
      new RegExp('^' + A + ' 7$', 'm').test(scritto) && new RegExp('^' + B + ' 5$', 'm').test(scritto),
      scritto);
    r = await esegui([A, B], env);
    log('[B] Con lo stesso conteggio non protesta', r.code === 0 && /come il baseline/.test(r.out));

    // ---- [C] un aumento va bene: un test nuovo fa salire il conto ----
    fs.writeFileSync(fileA, risultatoFinto(9));
    r = await esegui([A, B], env);
    log('[C] Un aumento NON fallisce', r.code === 0, 'codice ' + r.code);
    log('[C] ...e lo dice, invece di tacere', /ASSERZIONI IN AUMENTO/.test(r.out));

    // ---- [D] IL PUNTO DEL FILE: un calo deve fallire, e dire DOVE ----
    fs.writeFileSync(fileA, risultatoFinto(4));
    r = await esegui([A, B], env);
    log('[D] Un calo FALLISCE', r.code === 1, 'codice ' + r.code);
    log('[D] ...e nomina il file che ne esegue meno', new RegExp(A + ': 4 invece di 7').test(r.out), r.out);
    log('[D] ...e dice che non e\' un test fallito ma un test non partito',
      /non\s+e' un test che fallisce/i.test(r.out), r.out);

    // ---- [E] un file senza risultato non vale zero ----
    fs.unlinkSync(fileA);
    r = await esegui([A, B], env);
    log('[E] Un file senza .result.txt e\' segnalato come NON ESEGUITO, non contato zero',
      /SENZA RISULTATO \(non eseguiti\): zz_finto_a\.js/.test(r.out), r.out);
    log('[E] ...e non viene scambiato per un calo di tutte le sue asserzioni',
      !/zz_finto_a\.js: 0 invece di/.test(r.out));
  } finally {
    pulisci();
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n=== CONTA ASSERZIONI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
})();
