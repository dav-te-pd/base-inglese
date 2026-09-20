// PROTEGGE: che i quattordici tag di `index.html` portino TUTTI LA STESSA
// versione, e che la guardia che la fa salire sappia dire di no.
//
// ⚠️ COSA SI PERDE SENZA, ED È UN CASO VERO DEL 2026-09-19.
//
// Finché l'app era un file solo, «hai la pagina vecchia» era tutto-o-niente.
// Da quando è quindici file con cache indipendenti, un browser può tenere
// `index.html` nuovo e `app/ui-condivisa.js` vecchio: il risultato è un'app
// che nessuno ha mai scritto, e che nessun test può riprodurre — in locale e
// in CI i file si leggono sempre tutti insieme dal disco.
//
// È successo davvero: il pannello Help risultava morto su Pages mentre qui
// funzionava, e per un giro intero abbiamo cercato la causa nel codice. Ed è
// il primo sospettato per il guasto del giorno prima, quello archiviato come
// «le funzioni sono identiche carattere per carattere e il comportamento è
// cambiato».
//
// PERCHÉ «LA STESSA» È L'INVARIANTE, e non «c'è una versione»: se i quattordici
// la portano uguale, un `index.html` vecchio chiede i quattordici all'indirizzo
// vecchio e ottiene un insieme COERENTE. È il caso MISTO che va reso
// impossibile, non il caso vecchio.
//
// ⚠️ E LA GUARDIA SI ESERCITA, per la stessa ragione di `test_attendi.js`: una
// rete che nessuno tira si sfilaccia in silenzio, e questa protegge ogni
// pubblicazione. Se `versione-salita.js` smettesse di vedere i casi in cui la
// versione NON è salita, nessuno se ne accorgerebbe: la CI resterebbe verde,
// come sempre.
//
// LIMITE DICHIARATO: i quattro `fetch` dei file di dati (`app/dati.js`) NON
// portano versione, quindi un JSON vecchio con codice nuovo resta possibile.
// È registrato in `docs/decisioni-stato.md` con la sua condizione. Qui non si vede.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const STRUMENTO = repoPath('tests', 'tools', 'versione-salita.js');

// Un repo finto in una cartella temporanea: la guardia si prova su commit veri,
// non su una simulazione della sua logica — altrimenti si proverebbe la copia
// invece dell'originale.
function repoFinto(versionePrima, versioneDopo, toccaSorgente) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'versione-'));
  const g = function () { execFileSync('git', Array.prototype.slice.call(arguments), { cwd: dir, stdio: 'ignore' }); };
  g('init', '-q');
  g('config', 'user.email', 'x@y.z');
  g('config', 'user.name', 'x');
  fs.mkdirSync(path.join(dir, 'app'));
  fs.writeFileSync(path.join(dir, 'app', 'uno.js'), '// uno\n');
  fs.writeFileSync(path.join(dir, 'index.html'), '<script src="app/uno.js?v=' + versionePrima + '"></script>\n');
  fs.writeFileSync(path.join(dir, 'altro.md'), 'a\n');
  g('add', '-A'); g('commit', '-qm', 'uno');
  if (toccaSorgente) fs.writeFileSync(path.join(dir, 'app', 'uno.js'), '// uno, cambiato\n');
  else fs.writeFileSync(path.join(dir, 'altro.md'), 'b\n');
  fs.writeFileSync(path.join(dir, 'index.html'), '<script src="app/uno.js?v=' + versioneDopo + '"></script>\n');
  g('add', '-A'); g('commit', '-qm', 'due');
  return dir;
}

function lancia(dir, partenza) {
  try {
    const out = execFileSync('node', [STRUMENTO, '--repo', dir, partenza], { encoding: 'utf8' });
    return { codice: 0, out: out };
  } catch (e) {
    return { codice: e.status, out: String(e.stdout || '') };
  }
}

async function run() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');

  // ── [A] I TAG ───────────────────────────────────────────────────────
  // ⚠️ DAL 2026-09-20 I TAG SONO DI DUE SPECIE, e vanno guardati INSIEME.
  // Col passo 1.1 il CSS e' uscito in `stile/*.css`: un foglio di stile
  // vecchio accanto a un JavaScript nuovo e' lo stesso caso misto di due
  // file di `app/` scompagnati, **e si vede meno** — non alza nessun errore,
  // si vede storto. Controllare le due specie separatamente le lascerebbe
  // andare a due versioni diverse restando verde.
  const tutti = (html.match(/<script src="app\/[^"]+"><\/script>/g) || [])
    .concat(html.match(/<link rel="stylesheet" href="stile\/[^"]+">/g) || []);
  const conVersione = tutti.filter(function (t) { return /\?v=[^"]+"/.test(t); });
  log('[A] index.html carica dei file da app/ e da stile/', tutti.length > 0, String(tutti.length));
  const fogli = html.match(/<link rel="stylesheet" href="stile\/[^"]+">/g) || [];
  log('[A] ...e i fogli di stile ci sono (il CSS non e\' tornato dentro index.html)',
    fogli.length > 0 && !/<style>/.test(html), fogli.length + ' fogli');
  log('[A] ...e OGNUNO porta la sua versione', tutti.length === conVersione.length,
    (tutti.length - conVersione.length) + ' senza: ' + tutti.filter(function (t) { return !/\?v=/.test(t); }).join(' '));

  const versioni = conVersione.map(function (t) { return t.match(/\?v=([^"]+)"/)[1]; });
  const distinte = versioni.filter(function (v, i) { return versioni.indexOf(v) === i; });
  log('[A] ...ed e\' LA STESSA su tutti (e\' il caso misto che va reso impossibile)',
    distinte.length === 1, distinte.join(' | '));
  log('[A] ...nella forma AAAAMMGG + lettera, come CLAUDE.md',
    distinte.length === 1 && /^20\d{6}[a-z]$/.test(distinte[0]), distinte[0] || 'n/d');

  // ── [B] L'APP PARTE LO STESSO ───────────────────────────────────────
  // ⚠️ Si GUIDA, non si trova: un `?v=` scritto male non darebbe nessun errore
  // in questo file — darebbe un 404 su tutti i tag e un'app morta.
  {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    const mancanti = [];
    const viste = [];
    page.on('response', function (r) {
      viste.push(r.url());
      if (r.status() >= 400) mancanti.push(r.url() + ' -> ' + r.status());
    });
    await bloccaFontEsterni(page);
    await page.goto(APP_URL);
    let vivo = true;
    try { await page.waitForSelector('#name-input', { timeout: 15000 }); }
    catch (e) { vivo = false; }
    log('[B] Con la versione sui tag l\'app arriva comunque al login', vivo);
    log('[B] ...e nessun file servito al browser torna 404', mancanti.length === 0, mancanti.join(' | '));
    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));

    // ── I FILE DI DATI PORTANO LA STESSA VERSIONE DEI TAG (passo 1.9) ──
    //
    // ⚠️ ERANO SCOPERTI, ED ERA REGISTRATO: i tag di `index.html` hanno il
    // `?v=` da giorni, i `fetch` dei file di dati no. Un browser poteva
    // tenere `inglese-it-gate.json` vecchio accanto a un `app/*.js` nuovo —
    // **lo stesso caso misto che il `?v=` esiste per rendere impossibile**, e
    // su un file di dati si vede ancora meno: non un errore, una frase
    // sbagliata dentro un esercizio.
    //
    // La versione attesa e' quella LETTA DAI TAG, non una scritta qui: cosi'
    // questa riga non va aggiornata a ogni cambio di versione — che e'
    // esattamente la copia da tenere allineata che il passo ha tolto.
    const percorsiDati = await page.evaluate(function () {
      return {
        istruzioni: window.BI.MODULE_INSTRUCTIONS_FILE,
        feedback: window.BI.FEEDBACK_MESSAGES_FILE,
        tabelle: window.BI.PERSONALIZATION_TABLES_FILE,
        struttura: window.BI.STRUTTURA_CORSO_FILE,
        episodio: window.BI.episodeDataFile('gate')
      };
    });
    const attesa = '?v=' + distinte[0];
    const senza = Object.keys(percorsiDati).filter(function (k) {
      return String(percorsiDati[k]).indexOf(attesa) === -1;
    });
    log('[B] Anche i file di DATI portano la versione, e la stessa dei tag',
      senza.length === 0, senza.map(function (k) { return k + '=' + percorsiDati[k]; }).join(' | '));

    // ⚠️ E si guarda anche la RICHIESTA VERA, non solo la stringa: un percorso
    // costruito bene che poi nessuno usa sarebbe verde qui e falso in rete.
    // `struttura-corso.json` e' l'unico dei cinque che l'app chiede SEMPRE,
    // prima di qualunque schermata — gli altri quattro arrivano quando si
    // apre qualcosa.
    const richiesteDati = viste.filter(function (u) { return /\/data\/.*\.json/.test(u); });
    log('[B] ...e la richiesta vera di struttura-corso.json ce l\'ha attaccata',
      richiesteDati.some(function (u) { return u.indexOf('struttura-corso.json' + attesa) !== -1; }),
      richiesteDati.join(' | ') || 'nessuna richiesta a data/');

    await browser.close();
  }

  // ── [C] LA GUARDIA SA DIRE DI NO ────────────────────────────────────
  {
    const fermo = repoFinto('20260101a', '20260101a', true);
    const r1 = lancia(fermo, 'HEAD~1');
    log('[C] Codice cambiato + versione ferma = RIFIUTATO (uscita 1)', r1.codice === 1,
      'uscita ' + r1.codice + ' | ' + r1.out.split('\n')[0]);
    log('[C] ...e il messaggio NOMINA il file che l\'ha reso necessario',
      /app\/uno\.js/.test(r1.out), r1.out.split('\n').slice(0, 3).join(' / '));

    const salita = repoFinto('20260101a', '20260102a', true);
    const r2 = lancia(salita, 'HEAD~1');
    log('[C] Codice cambiato + versione salita = A POSTO (uscita 0)', r2.codice === 0,
      'uscita ' + r2.codice + ' | ' + r2.out.split('\n')[0]);

    // ⚠️ IL CASO CHE RENDE LA GUARDIA USABILE: un commit di soli documenti non
    // deve chiedere niente. Senza questa riga la guardia sarebbe corretta e
    // insopportabile, e la prima cosa che si fa con una guardia insopportabile
    // e' toglierla.
    const soloDoc = repoFinto('20260101a', '20260101a', false);
    const r3 = lancia(soloDoc, 'HEAD~1');
    log('[C] Solo documenti cambiati = non chiede niente (uscita 0)', r3.codice === 0,
      'uscita ' + r3.codice + ' | ' + r3.out.split('\n')[0]);

    // Non misurato NON e' «a posto»: e' un rosso, perche' una guardia che non
    // misura e' una guardia che non c'e' (regola 37).
    const r4 = lancia(salita, '0000000000000000000000000000000000000000');
    log('[C] Base illeggibile = NON MISURATO (uscita 64), non un verde',
      r4.codice === 64 && /NON MISURATO/.test(r4.out), 'uscita ' + r4.codice + ' | ' + r4.out.split('\n')[0]);
  }

  console.log('');
  console.log('=== VERSIONE CACHE: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
