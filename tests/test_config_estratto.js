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
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
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

    // L'ordine nel file: il tag deve precedere lo script in linea che legge
    // APP_CONFIG a tempo di parsing. Confrontare le posizioni è più solido
    // che guardare la riga, che cambia a ogni modifica sopra.
    const posTag = html.indexOf('src="app/config.js"');
    const posLettore = html.indexOf('window.APP_CONFIG_DEFAULTS');
    log('[A] Il tag viene PRIMA del primo lettore a tempo di parsing',
      posTag !== -1 && posLettore !== -1 && posTag < posLettore,
      'tag=' + posTag + ' lettore=' + posLettore);
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
