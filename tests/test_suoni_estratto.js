// PROTEGGE: che i toni dell'app arrivino — e che si sappia che la loro
// assenza NON somiglia a un guasto.
//
// ⚠️ COSA SI ROMPE SE IL FILE NON ARRIVA, misurato il 2026-09-18 bloccando la
// richiesta — ed e' il QUARTO tipo della serie, e il piu' silenzioso di tutti:
//
//     login .......... SI
//     casa ........... SI
//     mappa .......... SI
//     errori JS ...... ZERO
//
//   `identita` .... pagina bianca .......................... RUMOROSO
//   `audio` ....... si vede il login e il primo tasto e' morto
//   `progressi` ... l'app parte, la mappa non si apre
//   `suoni` ....... **l'app funziona. Punto.**
//
// **Nessun errore, perche' nessuno chiama un suono finche' non succede
// qualcosa che ne merita uno.** Il guasto compare al primo Corretto, al primo
// Traguardo, al primo countdown — cioe' dentro un esercizio, minuti dopo
// l'avvio, quando nessuno collega piu' le due cose.
//
// ⚠️ LIMITE DICHIARATO DI QUELLA MISURA: ho guidato l'app fino alla mappa e
// oltre non sono arrivato (la riga di un modulo bloccato non e' cliccabile
// senza i progressi giusti). **Che al primo suono esca un `TypeError` e' un
// ragionamento, non una misura** — l'alias vale `undefined` e chiamarlo
// solleva. Lo scrivo come ragionamento perche' e' quello che e'.
//
// QUINDI SU PAGES SI GUARDA UNA COSA SOLA, E NON E' «SI APRE»: **si fa un
// esercizio e si ascolta se il Corretto suona.**
//
// IL CASO PIU' DIVERSO (regola 42): **`warmAudioContextOnce` e i suoi due
// listener globali**, ed e' diverso perche' e' l'unico pezzo dello strato che
// non e' un suono: e' la difesa che assorbe in silenzio il primo scatto
// dell'AudioContext sul primo tocco dello studente, invece che sul primo
// Corretto. **I due `addEventListener` sono venuti nel file con lei**, e la
// ragione e' che separare una difesa dal suo innesco lascia due pezzi che
// nessuno dei due spiega.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  verificaStruttura(log, 'suoni', ['app', 'suoni.js'], { prima: ['app/spazio.js'] });

  // ── [A] L'AudioContext HA UN PADRONE SOLO ───────────────────────────
  {
    // ⚠️ SI CERCA LA FORMA DEL CODICE, NON LA PAROLA — e questa riga e' nata
    // rossa per due motivi insieme, tutti e due gia' noti e tutti e due
    // ricomparsi qui: `AudioContext` nudo pesca anche `warmAudioContextOnce`
    // (che e' un ALIAS legittimo, non un uso dell'oggetto), e `righeDiCodiceDi`
    // lascia passare le righe di continuazione dei banner `/* */`, una delle
    // quali dice «a freshly-created AudioContext» in prosa. **Ottava comparsa
    // della famiglia del conto sui commenti.**
    const fuori = righeDiCodiceDi('index.html')
      .filter(function (r) { return /\bsfxAudioCtx\b|window\.AudioContext|webkitAudioContext/.test(r); });
    log('[A] index.html non nomina piu' + "' l'AudioContext", fuori.length === 0,
      fuori.map(function (r) { return r.trim(); }).join(' | '));

    const suoni = fs.readFileSync(repoPath('app', 'suoni.js'), 'utf8');
    log('[A] ...e app/suoni.js lo dichiara', /var AC = window\.AudioContext/.test(suoni));

    // ⚠️ I DUE LISTENER GLOBALI SONO NEL FILE, non in index.html. Senza questa
    // riga, qualcuno che «pulisce» il file potrebbe lasciarli indietro: la
    // funzione continuerebbe a esistere e nessuno la chiamerebbe piu', e il
    // difetto sarebbe un click in piu' di ritardo sul primo suono — cioe'
    // invisibile in ogni test e udibile una volta sola.
    log('[A] I due listener del risveglio stanno col file, non in index.html',
      (suoni.match(/document\.addEventListener\('(pointerdown|keydown)', warmAudioContextOnce/g) || []).length === 2 &&
      righeDiCodiceDi('index.html').every(function (r) { return !/addEventListener\('(pointerdown|keydown)', warmAudioContextOnce/.test(r); }));
  }

  // ── [B] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'SuoniEstratti');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[B] L' + "'app arriva alla mappa", false, String(e).split('\n')[0]);
    }
    if (viva) log('[B] L' + "'app arriva alla mappa", true);

    // ⚠️ NON BASTA CHE LE FUNZIONI ESISTANO: la catena vera passa da
    // sfxGetAudioCtx, che crea (o riprende) l'AudioContext e puo' fallire in
    // silenzio. Qui si chiama un suono davvero e si guarda che non sollevi.
    const suona = viva ? await page.evaluate(function () {
      try {
        if (typeof window.BI.sfxPlayCorrectSound !== 'function') return 'non e\' una funzione';
        window.BI.sfxPlayCorrectSound();
        return 'ok';
      } catch (e) { return 'eccezione: ' + String(e).split('\n')[0]; }
    }) : 'app non viva';
    log('[B] Chiamare un suono davvero non solleva', suona === 'ok', String(suona));

    // ⚠️ E LA RIGA QUI SOPRA, DA SOLA, NON BASTA — MISURATO, non temuto.
    //
    // Falsificando `sfxGetAudioCtx` (`var AC = null;`, cioe' l'AudioContext
    // introvabile) la riga sopra **resta verde**: la funzione torna `null`, i
    // sei suoni escono senza fare niente e senza sollevare. **«Non solleva»
    // non distingue «il suono e' uscito» da «il suono non e' uscito in
    // silenzio»** — ed e' esattamente la forma della misura che non misura.
    //
    // *La previsione della falsificazione era «11/11, non morde», ed era
    // giusta su [B]: e' caduta una riga STRUTTURALE che non avevo in mente.
    // Lo scarto ha mostrato il buco al posto suo.*
    //
    // Questa riga chiude il buco per quanto si puo' da qui: il contesto deve
    // ESISTERE. Che ne esca un'onda udibile resta fuori dalla portata di un
    // browser di test — e' la verifica a mano su Pages.
    const contesto = viva ? await page.evaluate(function () {
      try {
        const c = window.BI.sfxGetAudioCtx();
        return c ? (c.state || 'senza stato') : 'null';
      } catch (e) { return 'eccezione: ' + String(e).split('\n')[0]; }
    }) : 'app non viva';
    log('[B] ...e l' + "'AudioContext esiste davvero, non e' null in silenzio",
      contesto !== 'null' && contesto.indexOf('eccezione') === -1, String(contesto));

    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== SUONI ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
