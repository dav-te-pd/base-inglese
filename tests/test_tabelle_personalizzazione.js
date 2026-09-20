// PROTEGGE: che il magazzino della personalizzazione — nomi, città, paesi —
// resti FUORI dal codice e arrivi da un file, e che nessuno torni a leggerlo
// come se fosse già in memoria.
//
// COSA SI PERDE SENZA QUESTO FILE. Fino al 2026-09-15 `people` e `places`
// stavano dentro `APP_CONFIG`, cioè erano lì per costruzione: chiunque poteva
// leggerli in qualunque istante senza aspettare niente, e il codice che lo
// faceva era corretto. Portarli in `data/inglese/it/` non è uno spostamento di
// file: è una CONVERSIONE AD ASINCRONO, e l'unica cosa che impedisce di
// tornare indietro per sbaglio è un'asserzione che lo vieti.
//
// ⚠️ E L'ASSERZIONE CHE CONTA È LA [A], non le altre.
//
// «Nessuna lettura sincrona prima del login» non si verifica guardando chi
// legge — i lettori si moltiplicano e l'elenco invecchia. Si verifica
// TOGLIENDO LA POSSIBILITÀ: se `window.APP_CONFIG` non contiene `people` né
// `places`, allora una lettura sincrona non è sbagliata, è IMPOSSIBILE. Chi
// domani volesse rimetterci una scorciatoia dovrebbe prima rimettere lì le
// tabelle, e questa riga diventa rossa nello stesso commit.
//
// COME SI GUARDA LA FINESTRA, e perché non correndole contro (regola 44).
// Fra «il magazzino non c'è» e «il magazzino c'è» passa un millisecondo: un
// test che legge e basta osserva sempre il dopo, ed è vero per costruzione. La
// finestra si RIPRODUCE, ritardando il file di 800 ms con `page.route` —
// stessa strada di `test_modulo_pronto.js` e `test_testi_interfaccia.js`.
//
// IL CASO PIÙ DIVERSO (regola 42): `aircraft-door`. Non il più complicato —
// quello a cui MANCA qualcosa che l'altro ha: è l'unico episodio che non usa
// NESSUNA tabella `people.*`, solo `places.destinations`. Un caricamento che
// scaldasse solo i nomi, o un `isPersonName` che desse per scontata una
// tabella di persone, lo lascerebbe rotto mentre `gate` resta verde — e `gate`
// è il caso comodo, quello che si ha già montato.
//
// LIMITE DICHIARATO: questo file NON verifica che il contenuto del magazzino
// sia quello di `docs/inglese/it/tabelle-personalizzazione.md`. Oggi NON lo è,
// ed è una scelta scritta (sei destinazioni invece di undici, id vecchi,
// traducibilità dedotta dalla tabella invece che dichiarata per riga): il
// passo che ha creato il file è una conversione pura. Il confronto col
// magazzino vero è il test rovesciato ⑤ del markdown, e nasce col passo che
// porta il contenuto.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, sorgenteChe } = require('./test-env');
const { openModule } = require('./map-driver');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const mockInit = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
};

const FILE_TABELLE = 'data/inglese/it/tabelle-personalizzazione.json';

async function apriMappa(page, utente, episodio) {
  await page.addInitScript(function (d) {
    if (d.ep) {
      try { localStorage.setItem('baseinglese:configOverrides', JSON.stringify({ episodioCorrente: d.ep })); } catch (e) {}
    }
  }, { ep: episodio });
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (u) {
    localStorage.setItem('baseinglese:gate:customizeSeen:' + u, '1');
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
  }, utente);
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
}

async function run() {
  // ── [A] LA POSSIBILITÀ È TOLTA, non sconsigliata ─────────────────────
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    // ⚠️ APP_CONFIG NON STA PIU' IN index.html — dal 2026-09-15 (passo 20) sta
    // in app/config.js. Prima qui c'era uno slice fra 'window.APP_CONFIG' e
    // 'applyConfigOverrides': due marcatori che quel passo ha portato via, e
    // `indexOf` avrebbe risposto -1 senza fallire, consegnando uno slice a
    // caso su cui le due righe qui sotto sarebbero passate per il motivo
    // sbagliato. Adesso il file della configurazione si legge intero: e' tutto
    // e solo APP_CONFIG, quindi non serve ritagliarlo.
    const conf = fs.readFileSync(repoPath('app', 'config.js'), 'utf8');
    log('[A] APP_CONFIG non dichiara più people', !/^\s*people\s*:\s*\{/m.test(conf));
    log('[A] APP_CONFIG non dichiara più places', !/^\s*places\s*:\s*\{/m.test(conf));
    // ⚠️ LA COSTANTE NON E' SPARITA: SI E' SPOSTATA. Dal 2026-09-18 vive in
    // `app/dati.js` insieme agli altri tre percorsi e ai quattro fetch
    // dell'app. L'asserzione e' diventata rossa per una DECISIONE, non per
    // una regressione — quinta comparsa della famiglia ⓪-undecies — quindi
    // si SEGUE, non si toglie: l'invariante e' sempre quello, *il percorso
    // sta in una costante e non dentro una riga di fetch*, e cambia solo
    // dove lo si va a leggere.
    //
    // Il divieto del fetch nudo resta su ENTRAMBI i file: toglierlo da
    // index.html perche' «tanto li' non ci sono piu' fetch» renderebbe la
    // riga vera per costruzione il giorno in cui uno tornasse.
    const datiJs = fs.readFileSync(repoPath('app', 'dati.js'), 'utf8');
    // ⚠️ ROSSA UNA SECONDA VOLTA IL 2026-09-20, ANCORA PER UNA DECISIONE
    // (⓪-undecies), e la forma vecchia dice da sola perche': cercava
    // `PERSONALIZATION_TABLES_FILE = '` — cioe' l'APICE, cioe' un percorso
    // LETTERALE. Col passo 1.11 la costante vale
    // `percorsoEdizione('tabelle-personalizzazione.json')`: e' ancora una
    // costante, ed e' ancora fuori dalla riga di fetch. **L'invariante non e'
    // cambiato di una virgola; era cambiato come il valore ci arriva.**
    //
    // Quindi si segue, e si guadagna: l'apice richiedeva proprio la cosa che
    // adesso e' vietata. La riga chiede la costante, vieta il fetch nudo su
    // entrambi i file (toglierlo da `index.html` perche' «tanto li' non ci
    // sono piu' fetch» la renderebbe vera per costruzione il giorno in cui
    // uno tornasse) e in piu' vieta che il percorso dell'edizione torni
    // scritto a mano qui dentro.
    log('[A] Il percorso del magazzino sta in una costante, non dentro un fetch',
      /var PERSONALIZATION_TABLES_FILE = \S/.test(datiJs) &&
      !/fetch\(['"]data\//.test(datiJs) &&
      !/fetch\(['"]data\//.test(html) &&
      !/PERSONALIZATION_TABLES_FILE = ['"]data\//.test(datiJs));
    // ⚠️ NON PIU' `html`: le due funzioni sono uscite in `app/apertura.js` il
    // 2026-09-19 (passo C2), e cercarle in `index.html` sarebbe una misura che
    // non misura — `/regex/.test(testo sbagliato)` e' `false`, cioe' un rosso
    // che accusa il codice invece della ricerca. `sorgenteChe` le cerca dove
    // sono e alza se non ci sono da nessuna parte.
    const slotJs = sorgenteChe('function resolveSlotTable(').testo;
    log('[A] resolveSlotTable riceve il magazzino invece di prenderselo da CONFIG',
      /function resolveSlotTable\(tableRef, episodeData, tables\)/.test(slotJs));
    log('[A] ensureEpisodeSlotFields aspetta ANCHE il magazzino, non solo l\'episodio',
      /loadPersonalizationTables\(\)[\s\S]{0,80}\]\)\.then/.test(
        sorgenteChe('function ensureEpisodeSlotFields(').testo));

    const dati = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
    log('[A] Il file esiste e porta le due radici', !!dati.people && !!dati.places);
    // Il file dice a chi lo apre che il contenuto NON è quello del magazzino:
    // senza, fra un mese qualcuno lo confronta col markdown e crede a una perdita.
    log('[A] ...e dichiara che il contenuto è quello di prima, non quello del magazzino',
      !!dati._nota && /magazzino/i.test(JSON.stringify(dati._nota)));
  }

  const browser = await launchBrowser();

  // ── [B] PRIMA DEL LOGIN il magazzino non serve, e non si chiede ──────
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const chiesti = [];
    page.on('request', function (r) { if (r.url().indexOf('tabelle-personalizzazione') !== -1) chiesti.push(r.url()); });
    await page.addInitScript(mockInit);
    await page.goto(APP_URL);
    await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });
    const inMemoria = await page.evaluate(() => ({
      people: 'people' in window.APP_CONFIG, places: 'places' in window.APP_CONFIG
    }));
    log('[B] Sulla schermata di onboarding le tabelle non sono in memoria',
      inMemoria.people === false && inMemoria.places === false, JSON.stringify(inMemoria));
    log('[B] ...e nemmeno sono state chieste alla rete', chiesti.length === 0, chiesti.join(','));
    await page.close();
  }

  // ── [C] IL CASO PIÙ DIVERSO: aircraft-door, zero tabelle people ──────
  {
    for (const caso of [
      { ep: 'gate', utente: 'TabGate', slot: 8, primaOpz: 8 },
      { ep: 'aircraft-door', utente: 'TabDoor', slot: 1, primaOpz: 6 }
    ]) {
      const page = await browser.newPage();
      const errori = [];
      page.on('pageerror', function (e) { errori.push(e.message); });
      await bloccaFontEsterni(page);
      await apriMappa(page, caso.utente, caso.ep);
      await openModule(page, 'personalizzazione');
      await page.waitForFunction(() => document.querySelectorAll('#view-customize select').length > 0, { timeout: 15000 });
      const r = await page.evaluate(() => {
        const s = Array.from(document.querySelectorAll('#view-customize select'));
        return { n: s.length, prima: s[0] ? s[0].options.length : 0, vuoti: s.filter(x => x.options.length === 0).length };
      });
      log('[C] ' + caso.ep + ': gli slot si risolvono dal file (' + caso.slot + ' select)',
        r.n === caso.slot, JSON.stringify(r));
      log('[C] ' + caso.ep + ': nessuno slot resta senza opzioni', r.vuoti === 0, JSON.stringify(r));
      log('[C] ' + caso.ep + ': nessun errore JS', errori.length === 0, errori[0]);
      await page.close();
    }
  }

  // ── [D] LA FINESTRA, riprodotta e non rincorsa ───────────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.route('**/tabelle-personalizzazione.json', async function (route) {
      await new Promise(function (x) { setTimeout(x, 800); });
      await route.continue();
    });
    await page.addInitScript(mockInit);
    await page.goto(APP_URL + '?config');
    await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 15000 });
    // Dentro la finestra: il pannello è GIÀ utilizzabile. È il punto della
    // conversione — `setTimeout(…, 0)` aspetta «più tardi nello stesso
    // script», non «più tardi sulla rete», quindi il pannello non può
    // aspettare il magazzino per disegnarsi.
    const dentro = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.config-group > summary')).map(e => e.textContent));
    log('[D] Col magazzino lento il pannello si apre lo stesso', dentro.length > 0, String(dentro.length));
    log('[D] ...senza i due gruppi, perché non sono ancora arrivati',
      dentro.indexOf('people') === -1 && dentro.indexOf('places') === -1, dentro.join(','));
    // ⚠️ IL GESTO CHE HA TROVATO IL DIFETTO, e non l'ho inventato io: la prima
    // versione ridisegnava il pannello intero quando il magazzino arrivava, e
    // il <details> che l'utente aveva appena aperto si richiudeva sotto le
    // dita. L'ha visto `test_interruttore_episodio`, che apre un gruppo e poi
    // cerca il menu dentro — un file che col magazzino non c'entra niente.
    // Qui il gesto diventa esplicito, invece di restare protetto per caso da
    // un test che parla d'altro.
    // ⚠️ IL SELETTORE E' `#config-panel-body .config-group`, NON `.config-group`.
    // Prima era quello nudo, e l'asserzione era VERA PER COSTRUZIONE (regola
    // 44): il primo `.config-group` del documento sta FUORI dal corpo del
    // pannello — misurato, 27 nel documento e 23 dentro — quindi il ridisegno
    // non lo tocca mai e `open` restava true qualunque cosa facesse il codice.
    // Vista fallire la falsificazione, non l'asserzione.
    await page.evaluate(() => {
      var d = document.querySelector('#config-panel-body .config-group');
      if (d) d.open = true;
    });
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll('.config-group > summary')).some(e => e.textContent === 'people'),
      { timeout: 15000 });
    const dopo = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.config-group > summary')).map(e => e.textContent));
    const restaAperto = await page.evaluate(() => {
      var d = document.querySelector('#config-panel-body .config-group');
      return !!(d && d.open);
    });
    log('[D] Quando arriva, i due gruppi compaiono senza riaprire il pannello',
      dopo.indexOf('people') !== -1 && dopo.indexOf('places') !== -1, dopo.join(','));
    log('[D] ...e i gruppi vengono AGGIUNTI, non ridisegnati da capo',
      restaAperto === true, 'il <details> aperto si e\' richiuso quando il magazzino e\' arrivato');
    log('[D] Nessun errore JS nella finestra', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [E] L'OVERRIDE SALVATO SOPRAVVIVE ALLO SPOSTAMENTO ───────────────
  //
  // È la metà del passo che non si vede: finché le tabelle stavano in
  // APP_CONFIG, applyConfigOverrides le sovrascriveva da solo. Portandole via
  // senza questo, l'override resterebbe scritto in localStorage e non lo
  // leggerebbe più nessuno — chi ha personalizzato il magazzino perderebbe
  // tutto SENZA UN MESSAGGIO E SENZA UN ROSSO.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.addInitScript(() => {
      localStorage.setItem('baseinglese:configOverrides', JSON.stringify({
        people: {
          papa: [{ value: 'zzz', it: 'Zenone', en: 'Zeno', fr: '', es: '', de: '' }],
          mamma: [], figlia: [], figlio: [], cognome: []
        },
        places: { departures: [], destinations: [] }
      }));
    });
    await apriMappa(page, 'TabOver', null);
    await openModule(page, 'personalizzazione');
    await page.waitForFunction(() => document.querySelectorAll('#view-customize select').length > 0, { timeout: 15000 });
    const prima = await page.evaluate(() => {
      const s = document.querySelector('#view-customize select');
      return s && s.options.length ? s.options[0].textContent : null;
    });
    log('[E] Un override salvato dal Pannello Admin vale ancora dopo lo spostamento',
      prima === 'Zenone', String(prima));
    log('[E] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [F] IL CASO CHE LA MACCHINA VELOCE NASCONDE ──────────────────────
  //
  // ⚠️ SENZA QUESTO BLOCCO IL FILE MENTE, e l'ho misurato scrivendolo.
  // Rimettendo la forma ingenua — il magazzino caricato «per conto suo» e
  // letto da una variabile senza aspettarlo — su rete normale cadeva SOLO
  // l'asserzione strutturale [A]: tutte le [C] restavano verdi, perché il
  // fetch torna prima che Playwright possa guardare. Cioè il file sembrava
  // proteggere un comportamento e proteggeva una stringa.
  //
  // È la famiglia della regola 19 vista da dentro: il container vince sempre
  // una gara che il runner perde. Qui la gara non si corre — si allarga, con
  // gli stessi 800 ms di [D], e allora la forma ingenua consegna slot vuoti.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.route('**/tabelle-personalizzazione.json', async function (route) {
      await new Promise(function (x) { setTimeout(x, 800); });
      await route.continue();
    });
    await apriMappa(page, 'TabLento', null);
    await openModule(page, 'personalizzazione');
    await page.waitForFunction(() => document.querySelectorAll('#view-customize select').length > 0, { timeout: 15000 });
    const r = await page.evaluate(() => {
      const s = Array.from(document.querySelectorAll('#view-customize select'));
      return { n: s.length, vuoti: s.filter(x => x.options.length === 0).length };
    });
    log('[F] Con la rete lenta gli slot NON arrivano vuoti', r.vuoti === 0, JSON.stringify(r));
    log('[F] ...e sono comunque tutti e otto', r.n === 8, JSON.stringify(r));
    log('[F] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== TABELLE PERSONALIZZAZIONE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
