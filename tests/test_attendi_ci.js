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
//   [D] nessuna corsa ............... 3, non 2 e non 4
//   [E] API illeggibile ............. 4, E NON ASPETTA PER SEMPRE — e' il
//       quarto difetto, quello che nessuna delle tre versioni a mano vedeva
//   [F] ⚠️ LA PROVA CONTRARIA: una corsa VIVA che non finisce mai deve uscire
//       con 2 — non 3, non 4. Senza questo caso il rilevatore potrebbe
//       dichiarare guasto qualunque lavoro lento e il test resterebbe verde.
//       E' lo stesso controllo che le dodici «gia' vere» del 14b hanno imposto.

const { execFile } = require('child_process');
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
function creaFinto(dir, risposte) {
  const elenco = path.join(dir, 'risposte.json');
  fs.writeFileSync(elenco, JSON.stringify(risposte), 'utf8');
  const finto = path.join(dir, 'finto-curl.sh');
  fs.writeFileSync(finto,
    '#!/bin/bash\n' +
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
const NESSUNA = JSON.stringify({ total_count: 0, workflow_runs: [] });
const SPAZZATURA = '{"message":"Not Found","documentation_url":"..."}';

function lancia(finto, max, extraEnv) {
  return new Promise(function (resolve) {
    const t0 = Date.now();
    execFile('bash', [SCRIPT, 'regressione.yml', 'abc1234', String(max)], {
      env: Object.assign({}, process.env, {
        ATTENDI_CI_FETCH: finto,
        ATTENDI_CI_REPO: 'finto/repo',
        ATTENDI_CI_INTERVALLO: '1',
        ATTENDI_CI_ASSENTE: '3',
        ATTENDI_CI_CIECO: '3'
      }, extraEnv || {})
    }, function (err, stdout) {
      resolve({ codice: err ? err.code : 0, testo: String(stdout).trim(), durataMs: Date.now() - t0 });
    });
  });
}

async function caso(nome, risposte, max, extraEnv) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'attendi-ci-'));
  const r = await lancia(creaFinto(dir, risposte), max, extraEnv);
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

  // [D] la corsa non esiste
  {
    const r = await caso('assente', [NESSUNA], 60);
    if (r.codice !== 3) console.log('  ' + r.testo);
    log('[D] Nessuna corsa per quel commit: uscita 3', r.codice === 3);
    log('[D] ...e lo distingue da un guasto dell\'attesa', /NESSUNA CORSA/.test(r.testo));
    log('[D] ...e dice le due cause possibili', /push non ha fatto partire/.test(r.testo));
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

  console.log('');
  console.log('=== ATTENDI CI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
