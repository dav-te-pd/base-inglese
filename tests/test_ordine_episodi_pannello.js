// PROTEGGE: che la lista degli episodi del Pannello Admin sappia fare le due
// cose per cui esiste — SPOSTARE un episodio e SPEGNERLO — e che l'effetto
// arrivi allo studente dopo una ricarica, non solo alla riga del pannello.
//
// Senza questo file il pannello continuerebbe a disegnare frecce e occhi che
// si ridisegnano correttamente sotto le dita e non salvano niente: il difetto
// peggiore di questa famiglia, perche' la schermata risponde e sembra andata.
//
// PROTEGGE ANCHE che non esista nessun posto dove SCRIVERE un id di episodio.
// E' il requisito che ha deciso la forma della lista (2026-09-26): la lista
// mostra tutti gli episodi che ESISTONO — chi non e' nominato dall'ordine
// compare in coda — quindi un id inesistente non si puo' inserire. Se un
// giorno tornasse la textarea JSON al posto delle righe, il pannello
// ricomincerebbe ad accettare `episodio-che-non-esiste` senza dire niente, e
// il risultato sarebbe una lista di episodi con un buco.
//
// PROTEGGE ANCHE che spegnere NON sia cancellare: i progressi di un episodio
// spento restano nel magazzino e tornano quando lo si riaccende. E' la
// promessa scritta nella descrizione del parametro, ed e' l'unica parte di
// questo passo che, se cade, cade sui dati di qualcuno.
//
// PROTEGGE ANCHE che spegnerli TUTTI non lasci la lista dello studente vuota
// in silenzio: `resolveEpisodeOrder` li tiene tutti e lo dice. Una lista
// vuota e' la schermata che sembra rotta senza spiegare perche', e la ragione
// sarebbe una manopola del pannello — non un dato mancante.
//
// COME: nessun id di episodio e' scritto qui dentro. Gli id si leggono da
// `struttura-corso.json` su disco e dall'app stessa, quindi un terzo episodio
// entra in questo test senza che nessuno lo aggiorni. Le asserzioni sul
// salvataggio leggono gli OVERRIDE nel magazzino, non `window.APP_CONFIG`:
// quello cambia in memoria appena si tocca il pulsante e direbbe "salvato"
// anche con `persistConfigSection` rotta.
//
// LIMITE DICHIARATO: si sposta e si spegne UN episodio per volta, su due
// episodi. Che l'ordine regga un rimescolamento completo di dieci episodi non
// e' verificato qui — diventera' misurabile col terzo e col quarto.

const { launchBrowser, APP_URL, chiaveMagazzino, strutturaCorso, attendiPrimaSchermata } = require('./test-env');

const BASE = APP_URL;
const CHIAVE_OVERRIDE = 'baseinglese:configOverrides';

let passed = 0, failed = 0;
const log = (msg, ok, dettaglio) => {
  if (ok) { passed++; console.log('  PASS  ' + msg); }
  else { failed++; console.log('  FAIL  ' + msg + (dettaglio ? '  -> ' + dettaglio : '')); }
};

// Apre l'app con un utente, e se serve con override e progressi gia' scritti.
// Gli override si scrivono PRIMA della ricarica, cosi' l'app parte con quel
// valore invece di riceverlo a schermata aperta: e' la strada vera del
// pannello, che `applyConfigOverrides` rimette sopra il file di struttura.
async function apri(page, utente, opzioni) {
  const o = opzioni || {};
  await page.goto(BASE);
  await page.evaluate((dati) => {
    localStorage.clear();
    if (dati.override) localStorage.setItem('baseinglese:configOverrides', JSON.stringify(dati.override));
    (dati.progressi || []).forEach(([k, v]) => localStorage.setItem(k, v));
  }, { override: o.override || null, progressi: o.progressi || [] });
  await page.reload();
  await attendiPrimaSchermata(page);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
}

// Il pannello si apre digitando "config" fuori da un campo di testo, come lo
// apre chi lo usa. I gruppi sono <details> chiusi: si aprono tutti, altrimenti
// le righe esistono e non sono visibili, e il click non arriva.
async function apriPannello(page) {
  await page.evaluate(() => document.body.click());
  for (const c of 'config') await page.keyboard.press(c);
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 5000 });
  await page.evaluate(() => document.querySelectorAll('#config-panel-body details').forEach(d => { d.open = true; }));
  // ⚠️ SI ARRENDE E TORNA `false` INVECE DI UCCIDERE IL FILE, e non e' un
  // errore ingoiato: il guasto che questa attesa non vede — la lista tornata
  // una textarea JSON — e' esattamente uno di quelli che il file deve
  // DICHIARARE. Con un `waitForSelector` nudo il file moriva su un
  // TimeoutError e non diceva quale dei quattro blocchi fosse caduto. Qui
  // l'assenza diventa un'asserzione con un nome, in [A].
  try {
    await page.waitForSelector('.config-episode-order-list .config-module-order-row', { state: 'visible', timeout: 5000 });
    return true;
  } catch (e) {
    return false;
  }
}

// Le righe della lista degli episodi nel pannello, nell'ordine in cui stanno.
function righePannello(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.config-episode-order-list .config-module-order-row')).map(r => ({
      etichetta: r.querySelector('.config-module-order-label').textContent,
      id: r.querySelector('[data-episode-onoff]').getAttribute('data-episode-onoff'),
      spenta: r.classList.contains('is-off'),
      premuto: r.querySelector('[data-episode-onoff]').getAttribute('aria-pressed')
    })));
}

// La lista che vede lo STUDENTE, dal suo pulsante di casa. E' il secondo
// effetto del pannello, e l'unico che conti: il primo — la riga che si
// ridisegna — lo si vede anche con il salvataggio rotto.
async function righeStudente(page) {
  await page.click('#go-episodes-list');
  await page.waitForSelector('#episode-list', { state: 'visible', timeout: 15000 });
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('#episode-list .module-row')).map(r => ({
      id: r.getAttribute('data-episode'),
      stato: r.className.replace('module-row', '').trim().split(/\s+/)[0]
    })));
}

function overrideNelMagazzino(page) {
  return page.evaluate((k) => {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; }
  }, CHIAVE_OVERRIDE);
}

async function run() {
  const browser = await launchBrowser();
  const struttura = strutturaCorso();
  const esistenti = Object.keys(struttura.episodes);
  const nomeSeq = struttura.episodeSequence;

  // ======== [A] La lista mostra tutti gli episodi, e non si scrive ========
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await apri(page, 'PannelloA');
    const pronto = await apriPannello(page);
    log('[A] La lista degli episodi esiste, ed e\' una lista di righe',
      pronto === true, 'nessuna .config-module-order-row dentro .config-episode-order-list');
    const righe = await righePannello(page);
    console.log('    pannello: ' + righe.map(r => r.id + (r.spenta ? '(spento)' : '')).join(', '));

    log('[A] Una riga per ogni episodio che esiste',
      righe.length === esistenti.length, righe.length + ' righe contro ' + esistenti.length + ' episodi');
    log('[A] ...e sono gli stessi id, senza inventarne',
      righe.every(r => esistenti.indexOf(r.id) !== -1), righe.map(r => r.id).join(','));
    log('[A] L\'etichetta e\' il NOME dell\'episodio, non il suo id',
      righe.every(r => r.etichetta === (struttura.episodes[r.id].nome || r.id)),
      righe.map(r => r.etichetta).join(' | '));

    // Il requisito, e l'unico modo di verificarlo e' cercare cosa NON c'e':
    // nel gruppo `episodeSequences` non esiste nessun campo in cui digitare.
    const scrivibili = await page.evaluate(() => {
      const gruppi = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
      const g = gruppi.filter(x => x.querySelector('summary').textContent === 'episodeSequences')[0];
      if (!g) return null;
      return g.querySelectorAll('input[type=text], textarea').length;
    });
    log('[A] Nel gruppo dell\'ordine non c\'e\' NESSUN campo dove scrivere un id',
      scrivibili === 0, String(scrivibili));

    log('[A] Nessun errore di pagina', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ======== [B] La freccia sposta, e lo salva dove lo legge l'app ========
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await apri(page, 'PannelloB');
    // Se la lista non c'e', si dice qui e non si clicca a vuoto: un click su un
    // selettore che non esiste ucciderebbe il file e porterebbe via anche il
    // riepilogo di [C] e [D], che col guasto non c'entrano.
    if (!await apriPannello(page)) {
      log('[B] La lista degli episodi esiste nel pannello', false, 'senza lista non c\'e\' niente da spostare');
      await page.close();
    } else {
    const prima = (await righePannello(page)).map(r => r.id);

    // Si scende il PRIMO, cosi' l'atteso e' lo scambio delle prime due righe —
    // e vale qualunque sia l'ordine di partenza, che e' un dato dell'edizione.
    await page.click('.config-episode-order-list [data-episode-move="down"][data-episode-index="0"]');
    const dopo = (await righePannello(page)).map(r => r.id);
    const attesoDopo = prima.slice();
    attesoDopo[0] = prima[1]; attesoDopo[1] = prima[0];
    log('[B] La freccia giu\' scambia la riga con quella sotto',
      dopo.join(',') === attesoDopo.join(','), dopo.join(',') + ' invece di ' + attesoDopo.join(','));

    const ov = await overrideNelMagazzino(page);
    const salvata = ov && ov.episodeSequences && ov.episodeSequences[nomeSeq];
    log('[B] ...e finisce negli override, sotto la sequenza del corso',
      Array.isArray(salvata) && salvata.join(',') === attesoDopo.join(','),
      JSON.stringify(salvata));
    // ⚠️ SI SALVA LA LISTA INTERA, compresi quelli che nessuno nominava: senza
    // questo, spostare in su un episodio "in coda" si perderebbe al
    // ricaricamento — e si perderebbe senza dire niente.
    log('[B] ...e la lista salvata nomina TUTTI gli episodi, non solo i mossi',
      Array.isArray(salvata) && salvata.length === esistenti.length,
      salvata ? String(salvata.length) : 'niente');

    // L'effetto vero: dopo una ricarica l'ordine dello studente e' quello.
    await page.reload();
    await attendiPrimaSchermata(page);
    await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
    const studente = await righeStudente(page);
    log('[B] Dopo una ricarica la lista dello studente segue l\'ordine nuovo',
      studente.map(r => r.id).join(',') === attesoDopo.join(','), studente.map(r => r.id).join(','));

    log('[B] Nessun errore di pagina', errori.length === 0, errori.join(' | '));
    await page.close();
    }
  }

  // ======== [C] L'occhio spegne, e lo spento non cancella i progressi ========
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));

    // Si spegne il SECONDO: il primo e' quello aperto, e togliere l'episodio
    // corrente e' un caso suo — vedi il limite in testa.
    const bersaglio = esistenti[1];
    const chiaveProgresso = chiaveMagazzino('modules:' + bersaglio + ':PannelloC');
    await apri(page, 'PannelloC', {
      progressi: [[chiaveProgresso, JSON.stringify({ completed: ['personalizzazione'] })]]
    });
    if (!await apriPannello(page)) {
      log('[C] La lista degli episodi esiste nel pannello', false, 'senza lista non c\'e\' nessun occhio da toccare');
      await page.close();
    } else {

    await page.click('.config-episode-order-list [data-episode-onoff="' + bersaglio + '"]');
    const righe = await righePannello(page);
    const riga = righe.filter(r => r.id === bersaglio)[0];
    log('[C] La riga spenta resta nella lista, segnata spenta',
      !!riga && riga.spenta === true, JSON.stringify(riga));
    log('[C] ...e l\'occhio lo dice anche a chi non vede i colori',
      !!riga && riga.premuto === 'false', riga ? riga.premuto : 'niente riga');

    const ov = await overrideNelMagazzino(page);
    log('[C] `episodiSpenti` negli override nomina proprio quell\'episodio',
      ov && Array.isArray(ov.episodiSpenti) && ov.episodiSpenti.join(',') === bersaglio,
      JSON.stringify(ov && ov.episodiSpenti));

    await page.reload();
    await attendiPrimaSchermata(page);
    await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
    const conSpento = await righeStudente(page);
    log('[C] Dopo la ricarica lo studente non vede l\'episodio spento',
      conSpento.every(r => r.id !== bersaglio), conSpento.map(r => r.id).join(','));
    log('[C] ...e vede tutti gli altri', conSpento.length === esistenti.length - 1, String(conSpento.length));

    const progressoVivo = await page.evaluate(k => localStorage.getItem(k), chiaveProgresso);
    log('[C] Spegnere NON cancella i progressi di quell\'episodio',
      !!progressoVivo && progressoVivo.indexOf('personalizzazione') !== -1, String(progressoVivo));

    // Riaccenderlo dallo stesso occhio: l'episodio torna, col suo progresso.
    await apriPannello(page);
    await page.click('.config-episode-order-list [data-episode-onoff="' + bersaglio + '"]');
    const ov2 = await overrideNelMagazzino(page);
    log('[C] Il secondo tocco lo riaccende, e `episodiSpenti` resta vuota',
      ov2 && Array.isArray(ov2.episodiSpenti) && ov2.episodiSpenti.length === 0,
      JSON.stringify(ov2 && ov2.episodiSpenti));

    await page.reload();
    await attendiPrimaSchermata(page);
    await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
    const riacceso = await righeStudente(page);
    log('[C] ...e l\'episodio riacceso e\' di nuovo nella lista, col suo stato',
      riacceso.some(r => r.id === bersaglio && r.stato !== 'locked'),
      riacceso.map(r => r.id + '(' + r.stato + ')').join(','));

    log('[C] Nessun errore di pagina', errori.length === 0, errori.join(' | '));
    await page.close();
    }
  }

  // ======== [D] Spegnerli tutti si DICE, non svuota la lista ========
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    const avvisi = [];
    page.on('pageerror', e => errori.push(e.message));
    page.on('console', m => { if (m.type() === 'error') avvisi.push(m.text()); });

    await apri(page, 'PannelloD', { override: { episodiSpenti: esistenti.slice() } });
    const studente = await righeStudente(page);
    log('[D] Con tutti spenti la lista NON e\' vuota',
      studente.length === esistenti.length, String(studente.length));

    const esito = await page.evaluate(() => window.BI.resolveEpisodeOrder());
    log('[D] ...e resolveEpisodeOrder lo dice con un errore che li nomina',
      !!esito.errore && esito.errore.indexOf('spenti TUTTI') !== -1 &&
      esistenti.every(id => esito.errore.indexOf(id) !== -1), String(esito.errore));
    log('[D] ...e l\'errore arriva in console, non solo nel valore di ritorno',
      avvisi.some(t => t.indexOf('spenti TUTTI') !== -1), avvisi.join(' | '));

    log('[D] Nessun errore di pagina', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
