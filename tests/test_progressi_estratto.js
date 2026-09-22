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
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, configApp } = require('./test-env');
const { verificaStruttura, posizioneTag } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // Le quattro domande che ogni strato estratto si fa, in tests/strati.js:
  // tag presente, bloccante, nell'ordine giusto, e niente tornato indietro.
  // ⚠️ Nate condivise al TERZO caso, non al secondo: con due file la forma
  // comune era immaginata, con tre e' misurata.
  const nomi = verificaStruttura(log, 'progressi', ['app', 'progressi.js'], { prima: ['app/spazio.js'] });

  // Le due che restano QUI perche' sono di questo strato e non della forma.
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    log('[A] app/progressi.js espone piu' + "' di trenta nomi", nomi.length > 30, String(nomi.length));
    // ⚠️ LO SCRIPT IN LINEA NON E' PIU' UN IIFE (passo ③, 2026-09-20): in
    // `index.html` resta `window.BI.boot()` e basta. Cercare
    // `<script>\n(function () {` dava -1, e `tag < -1` e' falso — quindi
    // questa riga sarebbe rossa **per sempre, su codice giusto**. Seguita e
    // non tolta: l'invariante non e' cambiato — *questo tag deve venire prima
    // dello script che accende l'app* — e' cambiato come si trova quello
    // script. Si cerca la riga che lo accende, che e' l'unica cosa rimasta.
    const posInline = html.indexOf('window.BI.boot();');
    log('[A] ...e arriva prima dello script principale, che lo legge in cima al suo IIFE',
      posInline !== -1 && posizioneTag(html, 'app/progressi.js') < posInline);
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
    // valore dell'estrazione, e prima del 2026-09-17 non lo erano.
    // ⚠️ *Qui c'era scritto «per questo 197 punti sotto tests/ scrivono la
    // chiave a mano»: il passo 1.17 (2026-09-22) li ha convertiti, e quella
    // frase l'ha resa falsa questo stesso commit.*
    //
    // ⚠️ E L'ATTESO SI RICOSTRUISCE QUI, A MANO, NON CHIEDENDOLO A `BI`:
    // questa riga esiste per verificare che il costruttore dell'app dia la
    // chiave giusta, e confrontarlo con se' stesso la renderebbe vera per
    // costruzione (regola 44). L'edizione pero' NON si incolla — si legge
    // dalla config, come fa `globDati` — altrimenti sarebbe l'unico punto
    // rimasto in tutta la suite a sapere che l'edizione e' `inglese-it`.
    const ed = configApp().edizione;
    const attesa = 'baseinglese:' + ed.lingua + '-' + ed.studente + ':modules:gate:ProgressiEstratti';
    const chiave = await page.evaluate(function () {
      return !!(window.BI && typeof window.BI.moduleProgressKey === 'function') &&
        window.BI.moduleProgressKey('gate', 'ProgressiEstratti');
    }).catch(function (e) { return 'non leggibile: ' + String(e).split('\n')[0]; });
    log('[C] I costruttori delle chiavi si raggiungono da BI, e portano l\'edizione',
      chiave === attesa, String(chiave) + '  vs atteso  ' + attesa);

    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== PROGRESSI ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
