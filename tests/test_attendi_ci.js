// PROTEGGE: che `tests/tools/attendi-ci.sh` dica il VERO sulla CI, e che
// quando non lo sa lo DICA invece di aspettare per sempre.
//
// E' l'unico strumento fra «la CI e' finita» e quello che poi racconto a chi
// guida il progetto. La regola 38 dice che la CI si LEGGE, non si da' per
// andata — e finche' questa attesa non esisteva quella lettura era improvvisata
// ogni volta: TRE volte in due giorni, TRE difetti diversi.
//
// ⚠️ PERCHE' NON CHIAMA GITHUB, ed e' la scelta che decide la forma dello
// script: un test che dipende dalla RETE cade per un motivo che non
// controlliamo affatto. E' il difetto della regola 19 portato all'estremo —
// li' il test cade perche' la macchina e' lenta, qui cadrebbe perche' un
// server dall'altra parte del mondo ha un brutto minuto. Quindi
// `ATTENDI_CI_FETCH` sostituisce `curl` con un comando finto che stampa
// risposte preparate, e lo script non sa la differenza. Stessa scelta di
// `tests/test-env.js` (regola 24).
//
// I SEI CASI, e il sesto vale piu' degli altri cinque:
//   [A] in corso -> success ......... 0, e ha ASPETTATO
//   [B] failure ..................... 1, e la frase nomina la conclusione
//   [C] cancelled ................... 1, ma con una frase DIVERSA da failure:
//       una corsa annullata non e' una corsa rossa, e chi legge deve sapere se
//       cercare un difetto o un pulsante premuto
//   [D] nessuna corsa, e doveva esserci 3, non 2 e non 4 — e nomina i file
//       fuori da `paths-ignore` (dal 2026-10-19, in un repository finto)
//   [E] API illeggibile ............. 4, E NON ASPETTA PER SEMPRE — e' il
//       quarto difetto, quello che nessuna delle tre versioni a mano vedeva
//   [H] ⚠️ OGNI esito nomina il COMMIT, e accanto la riga che dice cosa
//       farsene. Protegge un difetto che NON e' dello script ma di chi lo usa:
//       leggere onestamente il campo giusto di **un'altra corsa**. Il giro e'
//       su tutti e cinque gli esiti, e il caso diverso e' l'uscita 4 — l'unica
//       che il commit non lo nominava (misurato il 2026-09-17).
//   [J] ⚠️ NESSUNA CORSA ATTESA (dal 2026-10-19): un commit che tocca solo
//       file di `paths-ignore` esce con 5, non con 3 — sul commit VERO del
//       giorno in cui il 3 e' stato letto come un guasto (`f3d4415`), e in un
//       repository finto col workflow VERO. Falsificato DENTRO il test: tolta
//       la voce dal filtro, lo stesso commit torna 3. E un pattern che lo
//       script non sa confrontare da' 6, non un 5 o un 3 tirati a indovinare.
//   [K] ⚠️ IL 5 NON DICE CHE LA CI E' VIVA (dal 2026-10-19): accanto al 5
//       si stampa l'ultima corsa del workflow su `main`, con quanto tempo fa.
//       Di tre ore fa, di dieci giorni fa, nessuna, illeggibile: il codice
//       resta 5 e la riga dice quale dei quattro. E un 3 non la stampa.
//   [F] ⚠️ LA PROVA CONTRARIA: una corsa VIVA che non finisce mai deve uscire
//       con 2 — non 3, non 4. Senza questo caso il rilevatore potrebbe
//       dichiarare guasto qualunque lavoro lento e il test resterebbe verde.
//       E' lo stesso controllo che le dodici «gia' vere» del 14b hanno imposto.

const { execFile, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { repoPath } = require('./test-env');

const SCRIPT = repoPath('tests', 'tools', 'attendi-ci.sh');
let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Un finto `curl`: stampa una risposta diversa a ogni chiamata, prendendola da
// una cartella. L'ultima resta valida per sempre, cosi' si puo' descrivere sia
// «cambia stato dopo due giri» sia «resta cosi' all'infinito».
// ⚠️ E DAL 2026-10-19 RISPONDE ANCHE IN BASE ALL'INDIRIZZO: se gli si da'
// `perMain`, la domanda sull'ultima corsa di `main` (quella che accompagna il
// 5) riceve quella risposta, e le altre continuano la sequenza.
function creaFinto(dir, risposte, perMain) {
  const elenco = path.join(dir, 'risposte.json');
  fs.writeFileSync(elenco, JSON.stringify(risposte), 'utf8');
  const main = path.join(dir, 'main.json');
  if (perMain != null) fs.writeFileSync(main, perMain, 'utf8');
  const finto = path.join(dir, 'finto-curl.sh');
  fs.writeFileSync(finto,
    '#!/bin/bash\n' +
    (perMain != null ? 'case "$1" in *branch=main*) cat "' + main + '"; exit 0;; esac\n' : '') +
    'C="' + dir + '/contatore"\n' +
    'n=$(cat "$C" 2>/dev/null || echo 0)\n' +
    'echo $((n+1)) > "$C"\n' +
    'node -e \'const r=require("' + elenco + '");const n=Number(process.argv[1]);' +
    'process.stdout.write(r[Math.min(n, r.length-1)]);\' "$n"\n', 'utf8');
  fs.chmodSync(finto, 0o755);
  return finto;
}

const CORSA = (stato, esito) => JSON.stringify({
  total_count: 1,
  workflow_runs: [{ status: stato, conclusion: esito, head_sha: 'abc1234', name: 'Suite di regressione' }]
});
// Una corsa già finita che dichiara le PROPRIE date: serve al caso [I].
const CORSA_DATATA = (secondi) => JSON.stringify({
  total_count: 1,
  workflow_runs: [{
    status: 'completed', conclusion: 'success', head_sha: 'abc1234', name: 'Suite di regressione',
    run_started_at: '2026-09-19T12:00:00Z',
    updated_at: new Date(Date.UTC(2026, 8, 19, 12, 0, secondi)).toISOString().replace(/\.\d+Z$/, 'Z')
  }]
});
const NESSUNA = JSON.stringify({ total_count: 0, workflow_runs: [] });
const SPAZZATURA = '{"message":"Not Found","documentation_url":"..."}';

// ⚠️ UN COMMIT DI QUARANTA CARATTERI, E IL LANCIO FUORI DAL REPOSITORY.
//
// Fino all'11 settembre 2026 questi casi passavano `abc1234` — sette caratteri
// — e andavano tutti verdi lo stesso, perche' **il curl finto risponde la
// stessa cosa qualunque URL gli si dia**. Il vero `head_sha` dell'API di
// GitHub no: confronta la stringa INTERA, e su un prefisso torna
// `total_count: 0`, cioe' lo stesso corpo di una corsa che non esiste. Lo
// script diceva «il push non ha fatto partire la CI» su una CI in_progress.
// Il test guidava il caso comodo (CLAUDE.md regola 42): il finto rispondeva a
// qualunque domanda, quindi la domanda sbagliata non si vedeva.
//
// E il lancio avviene con `cwd` FUORI dal repository apposta: lo script
// estende il commit con `git rev-parse`, e dentro il repository un prefisso
// finto potrebbe per caso risolversi in un commit vero, rendendo il caso [G]
// dipendente da cosa c'e' nella storia. Fuori, git non conosce niente e il
// comportamento e' lo stesso su qualunque macchina (regola 24).
const SHA_FINTO = 'abc1234' + '0'.repeat(33); // 40 caratteri, come quelli veri

function lancia(finto, max, extraEnv, sha) {
  return new Promise(function (resolve) {
    const t0 = Date.now();
    execFile('bash', [SCRIPT, 'regressione.yml', sha || SHA_FINTO, String(max)], {
      cwd: os.tmpdir(),
      env: Object.assign({}, process.env, {
        ATTENDI_CI_FETCH: finto,
        ATTENDI_CI_REPO: 'finto/repo',
        ATTENDI_CI_INTERVALLO: '1',
        ATTENDI_CI_ASSENTE: '3',
        ATTENDI_CI_CIECO: '3'
      }, extraEnv || {})
    }, function (err, stdout, stderr) {
      // stdout E stderr: gli errori d'uso (64) parlano su stderr, e un test che
      // guarda solo stdout non puo' verificare che l'uscita SPIEGHI — che e'
      // meta' del valore di un codice d'uscita distinto.
      const testo = (String(stdout) + '\n' + String(stderr)).trim();
      resolve({ codice: err ? err.code : 0, testo: testo, durataMs: Date.now() - t0 });
    });
  });
}

// ⚠️ UN REPOSITORY FINTO, COL WORKFLOW VERO — dal 2026-10-19.
//
// Da quel giorno, quando non c'e' nessuna corsa, lo script guarda i file del
// commit e `paths-ignore` del workflow. Per farlo gli serve un repository: se
// ne costruisce uno in una cartella temporanea, con DUE commit — il primo crea
// tutto, il secondo cambia solo `cambiati` — e il workflow copiato da quello
// vero (o alterato da `altera`). *Il workflow e' quello vero apposta: il
// giorno in cui qualcuno aggiunge un pattern che lo script non sa leggere,
// questo test lo vede.*
function repoFinto(cambiati, altera) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'attendi-ci-repo-'));
  const g = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'pipe' }).toString().trim();
  g('init', '-q');
  g('config', 'user.email', 'test@example.com');
  g('config', 'user.name', 'test');
  fs.mkdirSync(path.join(dir, '.github', 'workflows'), { recursive: true });
  let wf = fs.readFileSync(repoPath('.github', 'workflows', 'regressione.yml'), 'utf8');
  if (altera) wf = altera(wf);
  fs.writeFileSync(path.join(dir, '.github', 'workflows', 'regressione.yml'), wf);
  const tutti = ['app/x.js', 'docs/decisioni-stato.md', 'docs/correzioni.md', 'nuovi/consegna.md'];
  tutti.forEach((f) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), 'uno\n'); });
  g('add', '-A'); g('commit', '-q', '-m', 'primo');
  cambiati.forEach((f) => fs.writeFileSync(path.join(dir, f), 'due\n'));
  g('add', '-A'); g('commit', '-q', '-m', 'secondo');
  return { dir, sha: g('rev-parse', 'HEAD') };
}

async function casoInRepo(cambiati, altera, max, perMain) {
  const r = repoFinto(cambiati, altera);
  const esito = await caso('in repo', [NESSUNA], max || 60, { ATTENDI_CI_RADICE: r.dir }, r.sha, perMain);
  fs.rmSync(r.dir, { recursive: true, force: true });
  return Object.assign(esito, { sha: r.sha });
}

async function caso(nome, risposte, max, extraEnv, sha, perMain) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'attendi-ci-'));
  const r = await lancia(creaFinto(dir, risposte, perMain), max, extraEnv, sha);
  fs.rmSync(dir, { recursive: true, force: true });
  return r;
}

async function run() {
  // [A] in corso, poi verde
  {
    const r = await caso('verde', [CORSA('in_progress', null), CORSA('in_progress', null), CORSA('completed', 'success')], 30);
    if (r.codice !== 0) console.log('  ' + r.testo);
    log('[A] Corsa che finisce bene: uscita 0', r.codice === 0);
    log('[A] ...e lo dice', /VERDE/.test(r.testo));
    // Se avesse letto una volta sola sarebbe uscita subito, mentre era ancora
    // in corso: la durata e' la prova che ha aspettato lo stato vero.
    log('[A] ...e ha ASPETTATO invece di leggere una volta sola', r.durataMs >= 1500, r.durataMs + 'ms');
  }

  // [B] rossa
  {
    const r = await caso('rossa', [CORSA('completed', 'failure')], 30);
    log('[B] Corsa fallita: uscita 1', r.codice === 1);
    log('[B] ...e la frase NOMINA la conclusione', /ROSSA/.test(r.testo) && /failure/.test(r.testo), r.testo.slice(0, 90));
  }

  // [C] annullata: stessa uscita, frase diversa — un pulsante premuto non e' un difetto
  {
    const r = await caso('annullata', [CORSA('completed', 'cancelled')], 30);
    log('[C] Corsa annullata: uscita 1 come una rossa', r.codice === 1);
    log('[C] ...ma NON la chiama rossa', /ANNULLATA/.test(r.testo) && !/^ROSSA/.test(r.testo));
    log('[C] ...e dice dove guardare: un pulsante premuto, non un difetto',
        /pulsante premuto/.test(r.testo), r.testo.slice(0, 120));
  }

  // [D] la corsa non esiste, e doveva esserci: il commit tocca un registro
  // E una riga di codice — il caso normale della regola 43
  {
    const r = await casoInRepo(['app/x.js', 'docs/decisioni-stato.md']);
    if (r.codice !== 3) console.log('  ' + r.testo);
    log('[D] Nessuna corsa per un commit che tocca codice: uscita 3', r.codice === 3);
    log('[D] ...e lo distingue da un guasto dell\'attesa', /NESSUNA CORSA/.test(r.testo));
    log('[D] ...e dice le due cause possibili', /push non ha fatto partire/.test(r.testo));
    log('[D] ...e nomina il file fuori da paths-ignore, non il registro',
      /Fuori da paths-ignore:\n  app\/x\.js/.test(r.testo) && !/  docs\/decisioni-stato\.md/.test(r.testo), r.testo.slice(0, 300));
  }

  // [J] ⚠️ NESSUNA CORSA ATTESA — il 5, e il 6
  {
    // Il commit VERO del 2026-10-19, nel repository vero: toccava solo
    // `docs/decisioni-stato.md`, e il 3 che ne e' uscito e' stato letto come
    // un guasto. La CI ha la storia intera (`fetch-depth: 0`).
    const vero = await caso('f3d4415', [NESSUNA], 60, { ATTENDI_CI_RADICE: repoPath() },
      'f3d4415db449dae2f7788fd2a4a3a874f875bbaa');
    if (vero.codice !== 5) console.log('  ' + vero.testo);
    log('[J] Il commit vero f3d4415 (solo docs/decisioni-stato.md): uscita 5, non 3', vero.codice === 5, String(vero.codice));
    log('[J] ...e dice «nessuna corsa attesa», con il file', /NESSUNA CORSA ATTESA/.test(vero.testo) && /  docs\/decisioni-stato\.md/.test(vero.testo),
      vero.testo.slice(0, 200));
    // ⚠️ Il 5 arriva solo DOPO l'attesa piena: GitHub filtra sui file di tutta
    // la spinta, e una spinta con un commit di codice prima di questo farebbe
    // partire la corsa lo stesso. ATTENDI_CI_ASSENTE vale 3 secondi qui.
    // ⚠️ La soglia e' 2000 ms e non 3000, ed e' la regola 19: lo script conta
    // il tempo con `date +%s`, che tronca al secondo, quindi «3 secondi» possono
    // essere 2,1 veri. Con 3000 il test e' andato rosso nella suite del
    // 2026-10-19 (2349 ms) dopo essere stato verde da solo. Un 5 deciso al
    // primo sguardo arriva in qualche decina di millisecondi: 2000 lo distingue.
    log('[J] ...e il 5 arriva solo dopo l\'attesa piena, non al primo sguardo', vero.durataMs >= 2000, vero.durataMs + 'ms');

    const soloRegistri = await casoInRepo(['docs/decisioni-stato.md', 'docs/correzioni.md', 'nuovi/consegna.md']);
    log('[J] Repository finto, workflow vero: due registri e una consegna in nuovi/ danno 5', soloRegistri.codice === 5, soloRegistri.testo.slice(0, 200));

    // LA FALSIFICAZIONE, DENTRO IL TEST: lo stesso commit, col workflow senza
    // la voce di decisioni-stato.md. Deve tornare 3 — se tornasse 5, il 5
    // non dipenderebbe dal filtro.
    const senzaVoce = await casoInRepo(['docs/decisioni-stato.md'],
      (wf) => wf.replace(/\n\s+- 'docs\/decisioni-stato\.md'/, ''));
    log('[J] ⚠️ Tolta la voce dal filtro, lo stesso commit torna 3', senzaVoce.codice === 3, senzaVoce.testo.slice(0, 200));

    // Un pattern che lo script non sa confrontare: 6, e lo nomina.
    const strano = await casoInRepo(['docs/decisioni-stato.md'],
      (wf) => wf.replace("      - 'nuovi/**'", "      - 'nuovi/**'\n      - 'docs/*.md'"));
    log('[J] ⚠️ Un pattern che non sa confrontare (docs/*.md): uscita 6, non 5 e non 3', strano.codice === 6, strano.testo.slice(0, 200));
    log('[J] ...e nomina il pattern', /«docs\/\*\.md»/.test(strano.testo), strano.testo.slice(0, 300));
    const negato = await casoInRepo(['docs/decisioni-stato.md'],
      (wf) => wf.replace("      - 'nuovi/**'", "      - 'nuovi/**'\n      - '!docs/decisioni-stato.md'"));
    log('[J] ...e lo stesso per un !negato', negato.codice === 6, negato.testo.slice(0, 200));

    // Un commit che il repository vero non ha: 6. E senza nessun repository
    // (il lancio da una cartella qualunque) lo stesso, con il suo motivo.
    const fuori = await caso('fuori', [NESSUNA], 60, { ATTENDI_CI_RADICE: repoPath() });
    log('[J] Un commit che git non conosce: uscita 6, non 3', fuori.codice === 6, fuori.testo.slice(0, 200));
    log('[J] ...e dice perche\'', /git non conosce il commit/.test(fuori.testo), fuori.testo.slice(0, 300));
    const senzaRepo = await caso('senza repo', [NESSUNA], 60);
    log('[J] Nessun repository: uscita 6, e lo dice', senzaRepo.codice === 6 && /non sono dentro un repository git/.test(senzaRepo.testo),
      senzaRepo.testo.slice(0, 300));
  }

  // [K] ⚠️ IL 5 E LA CI VIVA — accanto al 5, l'ultima corsa su main
  {
    const fa = (ore) => new Date(Date.now() - ore * 3600 * 1000).toISOString().replace(/\.\d+Z$/, 'Z');
    const suMain = (ore) => JSON.stringify({ total_count: 1, workflow_runs: [{
      head_sha: 'cafe123' + '0'.repeat(33), created_at: fa(ore), status: 'completed', conclusion: 'success' }] });
    const fresca = await casoInRepo(['docs/correzioni.md'], null, 60, suMain(3));
    log('[K] Un 5 con l\'ultima corsa su main di tre ore fa: resta 5', fresca.codice === 5, String(fresca.codice));
    log('[K] ...e stampa sha, data e «3 ore fa»',
      /Ultima corsa di regressione\.yml su main: cafe123 del \d{4}-\d\d-\d\dT[\d:]+Z, 3 ore fa \(completed\/success\)/.test(fresca.testo),
      fresca.testo.split('\n').filter((r) => /main/.test(r)).join(' | '));
    const vecchia = await casoInRepo(['docs/correzioni.md'], null, 60, suMain(240));
    log('[K] ⚠️ L\'ultima corsa di dieci giorni fa si VEDE: «10 giorni fa», e il codice resta 5',
      vecchia.codice === 5 && /, 10 giorni fa \(/.test(vecchia.testo), vecchia.testo.split('\n').filter((r) => /main/.test(r)).join(' | '));
    const nessuna = await casoInRepo(['docs/correzioni.md'], null, 60, NESSUNA);
    log('[K] ⚠️ Nessuna corsa su main: la riga dice che il 5 NON e\' confermato',
      nessuna.codice === 5 && /NESSUNA corsa di regressione\.yml su main: il 5 NON e' confermato/.test(nessuna.testo),
      nessuna.testo.split('\n').filter((r) => /main/.test(r)).join(' | '));
    const cieca = await casoInRepo(['docs/correzioni.md'], null, 60, SPAZZATURA);
    log('[K] ...e un\'API che non risponde lo stesso: «non riesco a leggere»',
      cieca.codice === 5 && /Non riesco a leggere l'ultima corsa di regressione\.yml su main/.test(cieca.testo),
      cieca.testo.split('\n').filter((r) => /main/.test(r)).join(' | '));
    const tre = await casoInRepo(['app/x.js'], null, 60, suMain(3));
    log('[K] Un 3 NON la stampa: la riga accompagna solo il 5', tre.codice === 3 && !/Ultima corsa/.test(tre.testo), String(tre.codice));
  }

  // [E] IL QUARTO DIFETTO: l'API che non si puo' leggere
  {
    const r = await caso('cieca', [SPAZZATURA], 60);
    if (r.codice !== 4) console.log('  ' + r.testo);
    log('[E] API illeggibile: uscita 4', r.codice === 4);
    log('[E] ...e NON la scambia per «non e\' finita»', /NON RIESCO A VEDERE/.test(r.testo));
    // La forma vecchia (l'until scritto a mano) qui aspettava per sempre.
    log('[E] ...e soprattutto NON ASPETTA PER SEMPRE', r.durataMs < 20000, r.durataMs + 'ms');
  }

  // [F] LA PROVA CONTRARIA: viva e lenta non e' guasta
  {
    const r = await caso('viva', [CORSA('in_progress', null)], 5);
    if (r.codice !== 2) console.log('  ' + r.testo);
    log('[F] Corsa viva che non finisce: uscita 2, il tetto', r.codice === 2);
    log('[F] ...NON la dichiara assente (3)', r.codice !== 3);
    log('[F] ...NON la dichiara illeggibile (4)', r.codice !== 4);
    log('[F] ...e dice che la corsa e\' VIVA, non che l\'attesa e\' rotta',
        /ANCORA IN CORSO/.test(r.testo) && /VIVA/.test(r.testo));
  }

  // [G] IL COMMIT ABBREVIATO — il difetto dell'11 settembre 2026, reso
  // eseguibile. E' il caso piu' importante di tutti e sei quelli sopra, perche'
  // e' l'unico in cui lo strumento **diceva una cosa falsa e AZIONABILE**: non
  // «non ho capito», ma «il push non ha fatto partire la CI», su una corsa che
  // stava girando. Una risposta cosi' non invita a controllare: invita a
  // rifare il push.
  //
  // La difesa non e' che lo script indovini: e' che si RIFIUTI di chiedere una
  // domanda a cui l'API risponde in modo indistinguibile dal nulla.
  {
    const r = await caso('corto', [CORSA('completed', 'success')], 5, null, 'abc1234');
    if (r.codice !== 64) console.log('  ' + r.testo);
    log('[G] Un commit ABBREVIATO e\' un errore d\'uso (64), non una corsa assente (3)',
        r.codice === 64);
    log('[G] ...e NON risponde 0 anche se la corsa finta sarebbe verde', r.codice !== 0);
    log('[G] ...e dice PERCHE\': l\'API confronta head_sha per intero',
        /head_sha/.test(r.testo) || /40 caratteri/.test(r.testo));
  }

  // [H] ⚠️ OGNI ESITO NOMINA IL COMMIT — E IL GIRO SI FA SU TUTTI E CINQUE,
  // non su quello comodo (CLAUDE.md regola 42).
  //
  // Il difetto che chiude non e' nello script: e' in chi lo usa. La regola 38
  // dice che la CI si LEGGE, e si puo' leggere onestamente **il campo giusto di
  // un'altra corsa** — un elenco risponde il vero su ognuna, e quella che
  // interessa e' una sola. La difesa non e' ricordarsi di usare lo script: e'
  // che la sua risposta porti il commit, cosi' chi legge il resoconto possa
  // confrontarlo **senza fidarsi di chi gliel'ha passato**.
  //
  // ⚠️ E IL CASO PIU' DIVERSO E' L'USCITA 4, PERCHE' E' DIVERSA PER ASSENZA:
  // era l'unico dei cinque esiti che il commit NON lo nominava — misurato il
  // 2026-09-17, prima di toccare lo script. Gli altri quattro lo stampavano
  // gia' nella prima riga; il giro serve a non far tornare indietro nessuno.
  {
    const casi = [
      ['0 verde',      [CORSA('completed', 'success')],   30],
      ['1 rossa',      [CORSA('completed', 'failure')],   30],
      ['2 viva',       [CORSA('in_progress', null)],       5],
      ['4 illeggibile',[SPAZZATURA],                      60],
      ['6 non so',     [NESSUNA],                         60]
    ];
    const esiti = [];
    for (const [nome, risposte, max] of casi) esiti.push([nome, await caso(nome, risposte, max)]);
    // Il 3 e il 5 vogliono un commit vero in un repository: si guardano col
    // loro SHA, non con quello finto.
    for (const [nome, cambiati] of [['3 assente', ['app/x.js']], ['5 non attesa', ['docs/correzioni.md']]]) {
      const r = await casoInRepo(cambiati);
      esiti.push([nome, Object.assign(r, { testo: r.testo.split(r.sha).join(SHA_FINTO) })]);
    }
    for (const [nome, r] of esiti) {
      log('[H] ' + nome + ': l\'esito NOMINA il commit per intero',
          r.testo.indexOf(SHA_FINTO) !== -1, r.testo.slice(0, 100));
      log('[H] ' + nome + ': ...e dice cosa farsene — «hai letto un\'altra corsa»',
          /hai letto un'altra corsa/.test(r.testo), r.testo.slice(0, 100));
    }
  }

  // ── [I] IL NUMERO È QUELLO DELLA CORSA, NON DELLA MIA ATTESA ────────
  // ⚠️ Nasce da un numero falso stampato il 2026-09-19: «completata con
  // success (1s)» su una corsa durata **585 secondi**. Il verdetto era giusto
  // (letto dall'API), il numero no: era il tempo che lo script aveva aspettato,
  // e l'attesa era partita a corsa già finita. *Un numero falso accanto a un
  // verdetto vero è la forma della regola 37 — non somiglia a un errore,
  // somiglia a una misura.*
  //
  // Il caso è costruito proprio così: la corsa è **già completed** al primo
  // sguardo, quindi l'attesa è di zero o un secondo, mentre la corsa dichiara
  // di essere durata 300. Se lo script tornasse a stampare la propria attesa,
  // qui si vedrebbe subito.
  {
    const r = await caso('durata dalla corsa', [CORSA_DATATA(300)], 30);
    log('[I] La durata stampata è quella della CORSA (300s), non dell\'attesa',
      /corsa: 300s/.test(r.testo), r.testo.split('\n')[0]);
    log('[I] ...e l\'attesa è dichiarata a parte, non spacciata per la durata',
      /attesa: \d+s/.test(r.testo) && !/success \(\d+s\)/.test(r.testo), r.testo.split('\n')[0]);
  }

  console.log('');
  console.log('=== ATTENDI CI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
