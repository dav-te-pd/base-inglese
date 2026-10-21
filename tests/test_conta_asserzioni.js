// PROTEGGE: che il contatore delle asserzioni SI ACCORGA di un calo. E' lo
// strumento che difende ogni verde della suite da un test che ha smesso di
// girare — e come ogni strumento di misura, se si guasta non lo dice: continua
// a stampare un numero, e il numero somiglia a un risultato. Distingue i tre
// casi con conseguenze opposte — uguale, in aumento (un test nuovo: va bene),
// in calo (deve fallire e dire QUALE file) — piu' il caso che li confonde
// tutti: un `.result.txt` mancante, che non e' zero asserzioni ma un file non
// eseguito. E che `--scrivi` si RIFIUTI quando anche un solo file non ha il
// suo `.result.txt` ([F]), invece di riscrivere un baseline monco o vuoto che
// da li' in poi accetta qualunque calo. E ([G]) che nessun test possa restare
// fuori dalla suite in silenzio: ogni `test_*.js` sul disco gira o e' escluso
// in `esclusi-dalla-suite.txt` con il suo perche', ogni escluso esiste, lo
// script non torna a un `FILES="…"` scritto a mano, e senza il file degli
// esclusi lo strumento si FERMA invece di lanciare tutto in silenzio.
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
// PROTEGGE ANCHE, dal 2026-09-24: che `--scrivi` si RIFIUTI quando anche un
// solo file non ha il suo `.result.txt` — blocco [F]. Il ramo di lettura li
// segnalava da sempre ([E]); quello di scrittura li ignorava e riscriveva il
// baseline con quelli rimasti. Lanciato dalla cartella sbagliata non ne
// trovava nessuno e scriveva «0 asserzioni in 0 file» stampando un successo:
// un baseline vuoto che da li' in poi accetta qualunque numero, zero compreso.
// E' la guardia contro «un verde che prova meno di ieri» che si lasciava
// azzerare in silenzio: 79 righe cancellate, il giorno in cui e' successo.
// **Visto fallire davvero:** tolta la guardia cadono esattamente le 4 righe
// `[F]` e nessun'altra, e l'output della terza nomina il danno — «Baseline
// scritto: 5 asserzioni in 1 file».
//
// Il caso che ha fatto nascere il contatore non e' teorico: `test_batch19` e'
// caduto eseguendo 39 asserzioni invece di 40, perche' la quarantesima vive
// in un ramo che, quando il ciclo si esaurisce, non gira.
//
// [G] DAL 2026-09-28, E CON UN ALTRO MESTIERE DAL 2026-10-16: prima
// controllava che ogni `test_*.js` stesse nell'elenco scritto a mano `FILES`
// di `run_full_regression.sh` (trovato eseguendo: `test_testi_dal_markdown.js`
// era committato, verde da solo, e non girava — la corsa diceva «80 file»
// prima e dopo). Da quando la suite lancia ogni `test_*.js` tranne gli
// esclusi (`tools/file-della-suite.js`), «la lista combacia» e' vero per
// costruzione, e [G] guarda gli esclusi. La storia intera, con le ragioni per
// cui il glob era stato scartato il 28/09 e perche' non reggono, sta nel
// commento di [G].
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

    // ---- [F] --scrivi SI RIFIUTA SU UNA CORSA PARZIALE ----
    //
    // ⚠️ IL CASO VERO, 2026-09-24: `--scrivi` ignorava i file senza risultato
    // e riscriveva il baseline con quelli rimasti. Lanciato dalla cartella
    // sbagliata non ne trovava NESSUNO, e scriveva «0 asserzioni in 0 file»
    // **stampando un successo**: 79 righe cancellate, e un baseline vuoto
    // che da li' in poi non avrebbe piu' fallito su nessun calo.
    //
    // *Il ramo di lettura li nominava da sempre — e' il blocco [E] qui sopra.
    // Era il ramo di SCRITTURA a non guardarli, cioe' l'unico dei due che puo'
    // fare danno permanente.*
    //
    // Qui `fileA` e' gia' stato cancellato dal blocco [E]: lo stato e'
    // esattamente quello di una corsa incompleta.
    const primaDelRifiuto = fs.readFileSync(baseline, 'utf8');
    r = await esegui(['--scrivi', A, B], env);
    log('[F] --scrivi su una corsa parziale FALLISCE invece di scrivere',
      r.code === 2, 'codice ' + r.code);
    log('[F] ...e NON tocca il baseline che c\'era',
      fs.readFileSync(baseline, 'utf8') === primaDelRifiuto);
    log('[F] ...e nomina il file che manca', new RegExp(A).test(r.out), r.out);

    // Il caso che ha fatto il danno: NESSUN file ha il risultato. Vale la pena
    // di una riga sua perche' e' l'unico che produce un baseline **vuoto**, e
    // un baseline vuoto non fallisce piu' su niente — accetta anche zero.
    r = await esegui(['--scrivi', A], env);
    log('[F] Zero file con risultato non scrive un baseline vuoto',
      r.code === 2 && fs.readFileSync(baseline, 'utf8') === primaDelRifiuto,
      'codice ' + r.code);
  } finally {
    pulisci();
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }

  // ── [G] NESSUN TEST PUO' RESTARE FUORI DALLA SUITE SENZA DIRE PERCHE' ──
  //
  // ⚠️ [G] HA CAMBIATO MESTIERE IL 2026-10-16, E LA STORIA VA LETTA TUTTA.
  //
  // **Il 2026-09-28** `test_testi_dal_markdown.js` era scritto, committato,
  // verde da solo — **e non girava.** La corsa completa diceva «80 file» prima e
  // «80 file» dopo: il numero giusto per la domanda sbagliata. `FILES` in
  // `run_full_regression.sh` era un elenco scritto a mano, e un elenco scritto a
  // mano invecchia a ogni file nuovo **senza nessun segnale**. Nacque questa
  // guardia: «ogni `test_*.js` sul disco sta nell'elenco».
  //
  // *Quel giorno il glob fu SCARTATO, con due ragioni: «l'ordine dei file nella
  // corsa non e' casuale» e «un file nuovo entrerebbe nella suite senza che
  // nessuno l'abbia deciso».*
  //
  // **Il 2026-10-13 e' successo di nuovo** (`test_testi_condivisi.js`): la
  // guardia l'avrebbe preso, ma **a suite finita** — una corsa buttata.
  //
  // **Il 2026-10-16 il glob e' stato deciso** da chi guida il progetto — *«un
  // difetto impossibile batte un difetto preso»* — e le due ragioni del 28/09
  // sono state MISURATE, e non reggono:
  //   - l'ordine serve solo a ristampare i blocchi del log alla fine; nessun
  //     file dipende da un altro (l'isolamento e' scritto nello script);
  //   - chiamare un file `tests/test_x.js` E' la decisione di metterlo nella
  //     suite.
  //
  // Da quel giorno la suite lancia ogni `test_*.js` tranne quelli scritti in
  // `esclusi-dalla-suite.txt` (`tools/file-della-suite.js`, un posto solo).
  // **E [G] cambia mestiere in meglio:** non «la lista combacia», che col glob
  // e' vero per costruzione, ma **«ogni escluso esiste e porta il suo perche'»**
  // — l'unico modo che resta per zittire un test, e non puo' essere muto.
  // Piu' «lo script non torna a un elenco a mano», che e' il difetto di prima.
  {
    const S = require('./tools/file-della-suite.js');
    const sh = fs.readFileSync(path.join(__dirname, 'run_full_regression.sh'), 'utf8');
    log('[G] Lo script non porta piu\' un elenco a mano (`FILES="…"`)', !/^FILES="/m.test(sh));
    log('[G] ...e chiede i file a tools/file-della-suite.js', /FILES=\$\(node tools\/file-della-suite\.js\)/.test(sh));
    const suite = S.fileDellaSuite();
    log('[G] La suite ha dei file da lanciare (non sto guardando il vuoto)', suite.length > 0, 'trovati: ' + suite.length);
    log('[G] Questo stesso file e\' nella suite', suite.indexOf('test_conta_asserzioni.js') !== -1);
    const disco = S.fileSulDisco();
    const veri = S.esclusi();
    const fantasmi = veri.filter((e) => disco.indexOf(e.nome) === -1).map((e) => e.nome);
    const muti = veri.filter((e) => !e.perche).map((e) => e.nome);
    log('[G] Ogni escluso nomina un file che esiste', fantasmi.length === 0, fantasmi.join(', '));
    log('[G] Ogni escluso porta il suo perche\'', muti.length === 0, muti.join(', '));
    log('[G] Ogni test_*.js sul disco gira, o e\' escluso con un perche\'',
      disco.every((f) => suite.indexOf(f) !== -1 || veri.some((e) => e.nome === f && e.perche)));

    // ⚠️ E LA GUARDIA SI VEDE CADERE, su un file finto e non su quello vero
    // (regola 36: il vero non si tocca mentre la suite gira).
    const finto = path.join(fs.mkdtempSync(path.join(require('os').tmpdir(), 'esclusi-')), 'esclusi.txt');
    fs.writeFileSync(finto, '# prova\ntest_conta_asserzioni.js |   \ntest_che_non_esiste.js | un perche\'\n');
    const prova = S.esclusi(finto);
    log('[G] Su un file finto: un escluso senza perche\' si vede', prova.some((e) => e.nome === 'test_conta_asserzioni.js' && !e.perche));
    log('[G] ...e un escluso che non esiste si vede', prova.some((e) => e.nome === 'test_che_non_esiste.js' && disco.indexOf(e.nome) === -1));
    log('[G] ...e l\'escluso esce davvero dalla suite', S.fileDellaSuite(finto).indexOf('test_conta_asserzioni.js') === -1);
    let fermo = null;
    try { S.esclusi(finto + '-assente'); } catch (e) { fermo = e.message; }
    log('[G] Senza il file degli esclusi lo strumento si FERMA, non lancia tutto in silenzio (regola 49)',
      !!fermo && /esclusi-dalla-suite/.test(fermo), String(fermo));
    try { fs.rmSync(path.dirname(finto), { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n=== CONTA ASSERZIONI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
})();
