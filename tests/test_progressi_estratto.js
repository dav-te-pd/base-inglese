// PROTEGGE: che il magazzino dei progressi dello studente arrivi, e arrivi
// PRIMA di chi lo usa.
//
// COSA SI PERDE SENZA QUESTO FILE. Il 2026-09-17 trentotto funzioni sono
// uscite in `app/progressi.js`, caricato con un `<script src>` bloccante.
// Finche' stavano in linea, essere caricate prima del codice che le chiama
// era la FORMA DEL FILE. Adesso e' un tag, e un tag si sposta.
//
// ⚠️ E IL GUASTO E' PEGGIORE DI QUELLO DI `config.js`, perche' NON SI VEDE
// COME UN GUASTO. Misurato il 2026-09-17 bloccando la richiesta del file:
//
//     login .............. compare
//     casa ............... compare
//     mappa .............. NON SI APRE
//     passi disegnati .... 0
//     schermata d'errore . NESSUNA
//     errore JS .......... TypeError: isCustomizeSeen is not a function
//
// **L'app PARTE.** Lo studente arriva a casa, tocca «Inizia», e non succede
// niente: nessun messaggio, nessuna schermata rossa, nessun indizio. E'
// esattamente il caso che «ho guardato, l'app si apre» non prende — ed e' il
// motivo per cui la verifica a mano su Pages, per questo strato, non e'
// «l'app parte» ma «la mappa si apre e ha i suoi ventidue passi».
//
// IL CASO PIU' DIVERSO (regola 42), e qui e' diverso per MOMENTO: fra i 54
// punti di chiamata dei trentotto nomi, quello che si rompe per primo e'
// `isCustomizeSeen` dentro `migrateCustomizeSeenToModuleProgress`, che gira
// in cima a `openEpisodeMap`. Non e' il piu' importante ne' il piu' usato: e'
// il PRIMO, e quindi l'unico che decide cosa vede lo studente. Gli altri 53
// non arrivano nemmeno a essere chiamati.
//
// LIMITE DICHIARATO: qui si guarda DOVE stanno le funzioni e QUANDO
// arrivano, non cosa fanno. Il comportamento del magazzino e' protetto dai
// file che guidano i moduli (test_batch*, test_scala_colori,
// test_mastery_al_gesto) e non si duplica qui.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// I nomi NON sono un elenco a mano: si leggono da app/progressi.js, cioe'
// dalla fonte. Una funzione aggiunta la' entra nel giro il giorno stesso —
// un elenco scritto qui direbbe «questi sono tutti» ed e' un campione
// travestito da inventario.
function nomiEsposti(sorgente) {
  const out = [];
  sorgente.split('\n').forEach(function (r) {
    const m = r.match(/^\s*BI\.(\w+)\s*=\s*\1;\s*$/);
    if (m) out.push(m[1]);
  });
  return out;
}

async function run() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const progressi = fs.readFileSync(repoPath('app', 'progressi.js'), 'utf8');
  const nomi = nomiEsposti(progressi);

  // ── [A] DOVE STA E QUANDO ARRIVA ────────────────────────────────────
  {
    log('[A] app/progressi.js espone piu' + "' di trenta nomi", nomi.length > 30, String(nomi.length));

    const tag = html.match(/<script[^>]*src="app\/progressi\.js"[^>]*>/);
    log('[A] index.html lo carica con un tag suo', !!tag, 'tag non trovato');
    log('[A] ...BLOCCANTE: niente defer, async o type=module',
      !!tag && !/\b(defer|async|type\s*=)/.test(tag[0]), tag ? tag[0] : 'n/d');

    const posSpazio = html.indexOf('src="app/spazio.js"');
    const posQui = html.indexOf('src="app/progressi.js"');
    const posInline = html.indexOf('<script>\n(function () {');
    log('[A] Arriva DOPO app/spazio.js, che crea lo spazio dei nomi',
      posSpazio !== -1 && posQui > posSpazio, 'spazio=' + posSpazio + ' progressi=' + posQui);
    log('[A] ...e PRIMA dello script principale, che lo legge in cima al suo IIFE',
      posInline !== -1 && posQui < posInline, 'progressi=' + posQui + ' inline=' + posInline);
  }

  // ── [B] IL DIVIETO DI RITORNO ───────────────────────────────────────
  //
  // Senza questa riga, rimettere una delle trentotto dentro index.html
  // passerebbe verde: il tag ci sarebbe ancora, l'ordine pure, e due
  // definizioni dello stesso nome non danno nessun errore — vince quella
  // dell'IIFE, e il file estratto diventa un doppione che nessuno chiama.
  {
    const righe = righeDiCodiceDi('index.html');
    const tornate = nomi.filter(function (n) {
      return righe.some(function (r) { return new RegExp('^\\s*function ' + n + '\\s*\\(').test(r); });
    });
    log('[B] Nessuna delle funzioni estratte e' + "' tornata dentro index.html",
      tornate.length === 0, tornate.join(', '));

    const alias = nomi.filter(function (n) {
      return righe.some(function (r) { return new RegExp('^\\s*var ' + n + ' = BI\\.' + n + ';\\s*$').test(r); });
    });
    log('[B] ...e ognuna ha il suo alias nello script principale',
      alias.length === nomi.length, alias.length + ' su ' + nomi.length);
  }

  // ── [C] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });
    // ⚠️ LA GUARDIA, e non e' uno scrupolo: MISURATA il 2026-09-17. Con un
    // `defer` sul tag la mappa non si apre, `waitForSelector` scade, e senza
    // questo try/catch il file MORIVA invece di fallire — un TimeoutError
    // buttato fuori da run(), zero righe stampate, e chi legge la CI vede un
    // file esploso invece di un'asserzione rossa che dice cosa. E' la stessa
    // guardia `[0]` di test_avvio_invariato.js, e l'ho scoperta perche' la
    // previsione diceva «7 su 10» e il file non ha stampato nessun numero.
    let apertaLaMappa = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'ProgressiEstratti');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      apertaLaMappa = false;
      log('[C] La mappa si apre e disegna i suoi passi', false,
        'l\'app non e\' arrivata alla mappa: ' + String(e).split('\n')[0] +
        (errori.length ? '  //  primo errore JS: ' + errori[0] : '  //  nessun errore JS'));
    }

    const passi = apertaLaMappa
      ? await page.$$eval('#module-list [data-module]', function (e) { return e.length; })
      : 0;
    if (apertaLaMappa) log('[C] La mappa si apre e disegna i suoi passi', passi > 0, String(passi));

    // I costruttori delle chiavi sono raggiungibili da fuori: e' la meta' del
    // valore dell'estrazione, e prima del 2026-09-17 non lo erano — per
    // questo 197 punti sotto tests/ scrivono la chiave a mano.
    const chiave = await page.evaluate(function () {
      return !!(window.BI && typeof window.BI.moduleProgressKey === 'function') &&
        window.BI.moduleProgressKey('gate', 'ProgressiEstratti');
    }).catch(function (e) { return 'non leggibile: ' + String(e).split('\n')[0]; });
    log('[C] I costruttori delle chiavi si raggiungono da BI',
      chiave === 'baseinglese:modules:gate:ProgressiEstratti', String(chiave));

    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== PROGRESSI ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
