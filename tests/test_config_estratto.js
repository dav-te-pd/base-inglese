// PROTEGGE: che APP_CONFIG viva fuori da index.html e sia già in memoria
// quando il primo lettore lo cerca.
//
// COSA SI PERDE SENZA QUESTO FILE. Il 2026-09-15 la configurazione è uscita in
// `app/config.js`, caricato con un `<script src>` bloccante. Funziona per una
// ragione sola e fragile: **l'ordine**. Un `defer`, un `async`, un
// `type="module"`, o il tag spostato sotto lo script in linea, e
// `window.APP_CONFIG` non esiste più quando qualcuno lo legge — senza che
// nessuno abbia toccato una riga di configurazione.
//
// ⚠️ E IL GUASTO NON SOMIGLIA A UN GUASTO DI CARICAMENTO. Non c'è un fetch che
// fallisce e nessuna schermata d'errore da mostrare: c'è un `TypeError` a tempo
// di parsing, la pagina resta bianca, e il colpevole è un attributo HTML in una
// riga che non parla di configurazione.
//
// IL CASO PIÙ DIVERSO (regola 42), e qui non è un modulo: è il LETTORE PIÙ
// PRECOCE. I 162 `CONFIG.` dell'app girano tutti dentro funzioni, cioè molto
// dopo; l'unico che legge APP_CONFIG mentre lo script viene ancora letto è
// l'IIFE del tema, che applica il tema salvato PRIMA DEL PRIMO DISEGNO
// leggendo `APP_CONFIG.themes.defaultTheme`. È il primo a rompersi e l'unico
// che si rompe in modo invisibile — gli altri 162 almeno esplodono dentro un
// gesto dell'utente. Quindi è lui che si guida, non un modulo comodo.
//
// COME SI OSSERVA, visto che «prima del primo disegno» non si fotografa: si
// salva un tema DIVERSO dal predefinito e si guarda l'attributo `data-theme`
// sull'<html>. L'IIFE lo mette solo se ha potuto confrontarlo con
// `APP_CONFIG.themes.defaultTheme`, quindi quell'attributo È la prova che la
// configurazione era già lì. Se config.js arrivasse tardi, l'IIFE esploderebbe
// e l'attributo non ci sarebbe.
//
// LIMITE DICHIARATO: non verifica il CONTENUTO della configurazione — quello è
// `test_config_letta.js`, che controlla che ogni chiave sia letta da qualcuno.
// Qui si guarda solo dove sta e quando arriva.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // ── [Z] LA CHIAVE DEGLI OVERRIDE, IN UN POSTO SOLO ──────────────────
  //
  // ⚠️ Seconda metà di un caso registrato il 2026-09-17, quando `app/avvio.js`
  // è uscito: la chiave era un LETTERALE qui e una costante in index.html —
  // due punti in due file. La prima metà (il tema) si è chiusa con
  // `app/identita.js`; questa si chiude oggi, nello strato che la riunisce.
  //
  // Si conta sulle RIGHE DI CODICE e su TUTTA l'app, non sul singolo file:
  // l'errore che questa riga prende è «ne è ricomparso uno da un'altra
  // parte», non «questo file l'ha perso».
  {
    const letterale = "'baseinglese:configOverrides'";
    const fs2 = require('fs');
    const dove = fs2.readdirSync(repoPath('app'))
      .filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) {
        return { file: 'app/' + f, n: righeDiCodiceDi('app', f).filter(function (r) { return r.indexOf(letterale) !== -1; }).length };
      })
      .concat([{ file: 'index.html', n: righeDiCodiceDi('index.html').filter(function (r) { return r.indexOf(letterale) !== -1; }).length }])
      .filter(function (x) { return x.n > 0; });
    log('[Z] La chiave degli override esiste in UN posto solo, ed è app/avvio.js',
      dove.length === 1 && dove[0].file === 'app/avvio.js' && dove[0].n === 1,
      dove.map(function (x) { return x.file + ' x' + x.n; }).join(', ') || 'in nessun posto');
    log('[Z] ...ed è esposta su BI, perché altri due punti la leggono',
      /window\.BI\.CONFIG_OVERRIDES_KEY = CONFIG_OVERRIDES_KEY;/.test(
        fs2.readFileSync(repoPath('app', 'avvio.js'), 'utf8')));
  }

  // ── [A] DOVE STA, e come viene caricato ──────────────────────────────
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    const config = fs.readFileSync(repoPath('app', 'config.js'), 'utf8');

    log('[A] index.html non dichiara più APP_CONFIG',
      html.indexOf('window.APP_CONFIG = {') === -1);
    log('[A] app/config.js lo dichiara', config.indexOf('window.APP_CONFIG = {') !== -1);

    const tag = html.match(/<script[^>]*src="app\/config\.js"[^>]*>/);
    log('[A] index.html lo carica con un tag suo', !!tag, 'tag non trovato');
    // ⚠️ L'asserzione che vale per tutte le estrazioni future, non solo questa.
    log('[A] ...BLOCCANTE: niente defer, async o type=module',
      !!tag && !/\b(defer|async|type\s*=)/.test(tag[0]), tag ? tag[0] : 'n/d');

    // L'ordine nel file: il tag deve precedere il primo lettore di APP_CONFIG a
    // tempo di parsing. Confrontare le posizioni è più solido che guardare la
    // riga, che cambia a ogni modifica sopra.
    //
    // ⚠️ IL PRIMO LETTORE ORA È UN FILE, NON UN BLOCCO IN LINEA — dal
    // 2026-09-17 (passo 22, primo strato). Prima questa riga confrontava il tag
    // con `window.APP_CONFIG_DEFAULTS`, che stava nello script in linea; quel
    // blocco è uscito in `app/avvio.js` e la riga è diventata rossa dicendo
    // `lettore=-1`.
    //
    // **Rossa per una DECISIONE, non per una regressione** (famiglia
    // ⓪-undecies in tests/ERRORI-INGOIATI.md): l'invariante non è cambiato di
    // una virgola — «la configurazione c'è prima che qualcuno la legga» — è
    // cambiato DOVE VIVE. Seguirla è il lavoro; toglierla sarebbe stato
    // perderla.
    //
    // ⚠️ E QUESTA ESTRAZIONE HA TOLTO UNA GARANZIA STRUTTURALE, non spostato
    // soltanto del codice. Finché il lettore era **in linea**, il suo venire
    // dopo `config.js` non era una scelta: era la forma del file — una cosa in
    // linea sta necessariamente dopo i tag scritti sopra di lei. **Adesso sono
    // due righe che si possono scambiare.** *È la prima volta nella fase 4 che
    // un'estrazione toglie una garanzia invece di spostare codice, e
    // ricapiterà a ogni pezzo che esce da index.html.*
    const posTag = html.indexOf('src="app/config.js"');
    const posLettore = html.indexOf('src="app/avvio.js"');
    log('[A] Il tag viene PRIMA del primo lettore a tempo di parsing',
      posTag !== -1 && posLettore !== -1 && posTag < posLettore,
      'tag=' + posTag + ' lettore=' + posLettore);

    // ⚠️ E LA META' CHE SI PERDE SEMPRE: l'asserzione che vieta il RITORNO.
    //
    // Seguire la riga sopra lascia scoperto il caso opposto — rimettere il
    // blocco d'avvio in linea in index.html. Passerebbe **verde**: il tag di
    // `config.js` ci sarebbe ancora, quello di `avvio.js` pure, e l'ordine
    // sarebbe giusto. *Senza questa riga lo spostamento non è una decisione: è
    // una posizione che capita di avere oggi.*
    //
    // ⚠️ SI GUARDA IL CODICE, NON IL TESTO — `righeDiCodiceDi` da test-env.js.
    // Alla prima scrittura questa riga era rossa su codice giusto, perche'
    // `applyConfigOverrides` sopravvive in un COMMENTO piu' in basso in
    // index.html. E' la quarta volta in due giorni: il filtro sta ora in un
    // posto solo, e il perche' e' scritto li'.
    const codice = righeDiCodiceDi('index.html').join('\n');
    const rimasti = ['window.APP_CONFIG_DEFAULTS', 'applyConfigOverrides']
      .filter(function (m) { return codice.indexOf(m) !== -1; });
    log('[A] E il blocco d\'avvio non è più in linea in index.html',
      rimasti.length === 0, 'ancora in linea: ' + rimasti.join(', '));
  }

  const browser = await launchBrowser();

  // ── [B] IL LETTORE PIÙ PRECOCE: l'IIFE del tema ──────────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    // Un tema diverso dal predefinito: è l'unico caso in cui l'IIFE scrive
    // l'attributo, quindi l'unico in cui la sua riuscita si vede.
    await page.addInitScript(() => {
      try { localStorage.setItem('baseinglese:theme', 'notte'); } catch (e) {}
    });
    await page.goto(APP_URL);
    await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });
    const r = await page.evaluate(() => ({
      tema: document.documentElement.getAttribute('data-theme'),
      esiste: typeof window.APP_CONFIG === 'object' && window.APP_CONFIG !== null,
      defaults: typeof window.APP_CONFIG_DEFAULTS === 'object'
    }));
    log('[B] Il tema salvato è applicato: la configurazione c\'era già a tempo di parsing',
      r.tema === 'notte', JSON.stringify(r));
    log('[B] APP_CONFIG è in memoria dopo il boot', r.esiste === true);
    log('[B] E la copia dei valori di partenza si è potuta fare', r.defaults === true);
    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] I 162 LETTORI DENTRO LE FUNZIONI, visti da uno che conta ─────
  //
  // Non si contano: si guida un gesto che ne usa uno e si guarda che risponda.
  // Il pannello Admin è il più adatto perché enumera APP_CONFIG invece di
  // leggerne una chiave, quindi fallisce anche se l'oggetto arriva vuoto.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.goto(APP_URL + '?config');
    await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 15000 });
    const gruppi = await page.evaluate(() =>
      document.querySelectorAll('#config-panel-body .config-group').length);
    log('[C] Il Pannello Admin enumera la configurazione arrivata dal file', gruppi > 10, String(gruppi));
    log('[C] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== CONFIG ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
