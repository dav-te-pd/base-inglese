// PROTEGGE: che un episodio con una FORMA DIVERSA dal primo non produca
// silenzio. Tre difetti della stessa famiglia — tutti e tre non crollano, e
// per questo erano rimasti: sembrano funzionare.
//
//   1. un passo il cui `kind` non corrisponde a niente diventava una riga
//      cliccabile che NON FA NULLA. Lo stato di un passo è derivato ("il primo
//      non completato è l'attuale"), quindi quel passo restava attuale per
//      sempre e bloccava tutti quelli dopo, senza un errore in console;
//   2. un passo puntato su un grado che l'episodio non ha si dichiarava
//      COMPLETATO senza far fare un solo esercizio, e registrava pure l'esito:
//      `episodeGrade()` torna [] per un grado assente, e i costruttori di coda
//      leggevano quel [] come «coda già finita»;
//   3. la migrazione di `customizeSeen` scriveva 'personalizzazione' nei
//      progressi di QUALUNQUE episodio, anche di uno che quel passo non lo
//      dichiara.
//
// Perché adesso: sono stati decisi gli EPISODI CORTI — solo gradi C e D, senza
// A e B. Un episodio che insegna due espressioni non ha bisogno di ventidue
// passi. Il primo episodio corto è esattamente dove tutti e tre mordono.
//
// COME: le tre forme sbagliate si costruiscono dal Pannello Admin, cioè con
// gli override in `baseinglese:configOverrides` — lo stesso meccanismo che usa
// chi riordina i moduli a mano. Non serve un secondo episodio finto: serve un
// ordine che chieda all'episodio qualcosa che non ha, che è precisamente il
// caso da proteggere.
//
// LIMITE DICHIARATO: si verifica che il passo NON si completi e che lo
// studente veda qualcosa. Non si verifica il testo dell'errore — quello è
// coperto da test_errore_caricamento.js, che protegge la schermata in sé.

const { launchBrowser, APP_URL } = require('./test-env');

const BASE = APP_URL;

async function apriConOrdine(page, utente, ordine, extra) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(({ ordine, extra, utente }) => {
    localStorage.setItem('baseinglese:configOverrides',
      // Dal 2026-09-08 non esiste piu' un ordine globale: la forma sbagliata
      // si costruisce dando all'episodio un moduleOrder proprio, che e' una
      // delle due strade ammesse (l'altra e' dichiarare una sequenza).
      JSON.stringify({ episodes: { episode1: { moduleOrder: ordine } } }));
    (extra || []).forEach(([k, v]) => localStorage.setItem(k.replace('{u}', utente), v));
  }, { ordine, extra, utente });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
}

function statoDopo(page, utente, stepId) {
  return page.evaluate(({ utente, stepId }) => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const prog = JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + utente) || '{}');
    const esiti = JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:' + utente) || '{}');
    return {
      completati: prog.completed || [],
      completato: (prog.completed || []).indexOf(stepId) !== -1,
      esito: !!esiti[stepId],
      erroreVisibile: vis(document.getElementById('view-error')),
      // Qualunque cosa lo studente veda: la schermata d'errore o la mappa.
      // Quello che NON deve succedere e' restare su una vista muta.
      mappaVisibile: document.querySelectorAll('#module-list [data-module]').length > 0
    };
  }, { utente, stepId });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const errori = [];

  // ── [A] Un passo su un grado che l'episodio non ha ──────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[A] ' + String(e).slice(0, 140)));
    // Il grado 'Z' non esiste in nessun episodio, ed è il punto: è la forma
    // che avrà un episodio corto a cui si chiede il grado A.
    await apriConOrdine(page, 'CortoGrado', [{ module: 'quickMatchEngIta', grade: 'Z' }]);
    await page.click('[data-module="quickMatchEngIta"]');
    await page.waitForTimeout(600);
    const s = await statoDopo(page, 'CortoGrado', 'quickMatchEngIta');
    log('[A] Un passo su un grado assente NON si dichiara completato', s.completato === false);
    log('[A] ...e non registra nessun esito', s.esito === false);
    log('[A] ...e lo studente vede qualcosa invece di una schermata muta',
        s.erroreVisibile === true);
    await page.close();
  }

  // ── [B] Un passo il cui kind non corrisponde a niente ───────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[B] ' + String(e).slice(0, 140)));
    // Un id che non sta in modulesById: il passo nasce senza kind, quindi
    // nessun ramo lo riconosce. È la forma di un modulo previsto e non ancora
    // costruito — Scrittura, il Test di verifica finale, i grammaticali.
    await apriConOrdine(page, 'CortoKind', [{ module: 'moduloNonAncoraCostruito', grade: 'A' }]);
    const ceLaRiga = await page.evaluate(() =>
      !!document.querySelector('[data-module="moduloNonAncoraCostruito"]'));
    log('[B] Il passo sconosciuto compare comunque nella mappa', ceLaRiga === true);
    if (ceLaRiga) {
      await page.click('[data-module="moduloNonAncoraCostruito"]');
      await page.waitForTimeout(600);
      const s = await statoDopo(page, 'CortoKind', 'moduloNonAncoraCostruito');
      log('[B] Cliccarlo non lascia lo studente su una vista muta: si vede l\'errore',
          s.erroreVisibile === true);
      log('[B] E non si dichiara completato', s.completato === false);
    }
    await page.close();
  }

  // ── [C] Un episodio che Personalizza non ce l'ha ────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[C] ' + String(e).slice(0, 140)));
    // La bandierina vecchia c'è, ma questo ordine non contiene Personalizza:
    // la migrazione non deve scriverne il completamento.
    await apriConOrdine(page, 'CortoMigra',
      [{ module: 'repeatAloud', grade: 'A' }, { module: 'quickMatchEngIta', grade: 'A' }],
      [['baseinglese:episode1:customizeSeen:{u}', '1']]);
    const s = await statoDopo(page, 'CortoMigra', 'personalizzazione');
    log('[C] La migrazione non scrive un passo che l\'episodio non dichiara',
        s.completato === false);
    if (s.completato) console.log('  completati: ' + JSON.stringify(s.completati));
    await page.close();
  }

  // ── [D] Controprova: con l'ordine vero non è cambiato niente ────────────
  // Senza, tutte le asserzioni sopra passerebbero anche su un'app che non
  // apre più nessun modulo.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[D] ' + String(e).slice(0, 140)));
    await apriConOrdine(page, 'CortoOk', [{ module: 'quickMatchEngIta', grade: 'A' }]);
    await page.click('[data-module="quickMatchEngIta"]');
    await page.waitForSelector('#qm-start-screen, #qm-question', { state: 'visible', timeout: 15000 });
    const s = await statoDopo(page, 'CortoOk', 'quickMatchEngIta');
    log('[D] Controprova: con un grado che esiste il modulo si apre davvero',
        s.erroreVisibile === false);
    await page.close();
  }

  log('[Z] Nessun errore JS non gestito', errori.length === 0);
  if (errori.length) console.log('  ' + errori.join('\n  '));

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== EPISODI CORTI SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
