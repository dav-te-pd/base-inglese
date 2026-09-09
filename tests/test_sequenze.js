// PROTEGGE: che ogni episodio dichiari la propria sequenza di passi, che le
// due strade per dichiararla non si sovrappongano in silenzio, e — la cosa
// che pesa di più — che passare alle sequenze NON abbia mosso nessun id di
// passo.
//
// Perché quell'ultima è la più importante: i progressi salvati sono
// indicizzati per id di passo (`baseinglese:modules:...`, `moduleOutcome:`,
// `audioSecondsSent:`, `nextLineSkips:`) e gli id dipendono dall'ordine
// (`moduleStepId`). Se un id si muove, ogni studente perde i propri progressi
// senza che niente si rompa a schermo: la mappa riparte da zero e nessuno sa
// perché. È esattamente la forma del difetto dei sei passi.
//
// LE QUATTRO POSSIBILITÀ, e non ce n'è una quinta:
//   solo `sequence`    → quella sequenza
//   solo `moduleOrder` → quell'ordine, scritto per intero
//   tutte e due        → errore, detto e non risolto in silenzio
//   niente             → errore: nessun default implicito
//
// Il caso «tutte e due» è l'unico che si potrebbe risolvere zitti
// scegliendone una, ed è per questo che va provato: chi ha scritto entrambe
// crede che valga quella che sta guardando, e ha il 50% di probabilità di
// sbagliarsi per sempre.
//
// COME: gli id attesi si leggono da `tests/module-order.js`, cioè dalla
// sequenza vera in `index.html`, non da una lista ricopiata qui — una lista
// scritta a mano sarebbe una fotografia dell'ordine di oggi, che è il difetto
// che quel file esiste per togliere.

const { launchBrowser, APP_URL } = require('./test-env');
const { stepIds } = require('./module-order');

const BASE = APP_URL;

async function boot(page, utente, overrides) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  if (overrides) {
    await page.evaluate(o => localStorage.setItem('baseinglese:configOverrides', JSON.stringify(o)), overrides);
    await page.reload();
    await page.waitForSelector('#go-episode', { state: 'visible' });
  }
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForTimeout(400);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const errori = [];

  // ── [A] Nessun id di passo si è mosso ───────────────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[A] ' + String(e).slice(0, 140)));
    await boot(page, 'SeqIds', null);
    const inMappa = await page.evaluate(() =>
      Array.prototype.map.call(document.querySelectorAll('#module-list [data-module]'),
        el => el.getAttribute('data-module')));
    const attesi = stepIds();
    if (JSON.stringify(inMappa) !== JSON.stringify(attesi)) {
      console.log('  mappa:  ' + inMappa.join(', '));
      console.log('  attesi: ' + attesi.join(', '));
    }
    log('[A] Gli id dei passi in mappa sono ESATTAMENTE quelli della sequenza, nello stesso ordine',
        JSON.stringify(inMappa) === JSON.stringify(attesi));
    log('[A] E sono ancora ventidue', inMappa.length === 22);
    // La prova che la seconda apparizione tiene il proprio suffisso: se
    // moduleStepId cambiasse, i progressi della prima e della seconda si
    // sovrascriverebbero a vicenda.
    log('[A] La seconda apparizione di un modulo tiene il suo suffisso',
        inMappa.indexOf('matchEngIta') !== -1 && inMappa.indexOf('matchEngIta-2') !== -1);
    await page.close();
  }

  // ── [B] L'episodio dichiara la sua sequenza per nome ────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[B] ' + String(e).slice(0, 140)));
    await boot(page, 'SeqNome', null);
    const c = await page.evaluate(() => ({
      dichiarata: window.APP_CONFIG.episodes.episode1.sequence,
      esiste: !!(window.APP_CONFIG.sequences || {})[window.APP_CONFIG.episodes.episode1.sequence],
      quante: Object.keys(window.APP_CONFIG.sequences || {}).length,
      vecchia: typeof window.APP_CONFIG.moduleOrderDefault
    }));
    log('[B] L\'episodio dichiara una sequenza per nome', typeof c.dichiarata === 'string' && c.dichiarata.length > 0);
    log('[B] E quella sequenza esiste davvero', c.esiste === true);
    log('[B] Non esiste piu\' un moduleOrderDefault da ereditare in silenzio', c.vecchia === 'undefined');
    await page.close();
  }

  // ── [C] Le quattro possibilità ──────────────────────────────────────────
  const casi = [
    { nome: 'tutte e due', utente: 'SeqDue',
      ov: { episodes: { episode1: { sequence: 'narrativo-standard', moduleOrder: [{ module: 'repeatAloud', grade: 'A' }] } } },
      errore: true },
    { nome: 'niente', utente: 'SeqNiente',
      ov: { episodes: { episode1: {} } }, errore: true },
    { nome: 'una sequenza che non esiste', utente: 'SeqFinta',
      ov: { episodes: { episode1: { sequence: 'non-esiste' } } }, errore: true },
    { nome: 'solo moduleOrder', utente: 'SeqOrdine',
      ov: { episodes: { episode1: { moduleOrder: [{ module: 'repeatAloud', grade: 'A' }] } } },
      errore: false, passi: ['repeatAloud'] }
  ];
  for (const caso of casi) {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push('[C ' + caso.nome + '] ' + String(e).slice(0, 140)));
    await boot(page, caso.utente, caso.ov);
    const s = await page.evaluate(() => {
      const vis = el => !!el && el.getClientRects().length > 0;
      return {
        errore: vis(document.getElementById('view-error')),
        passi: Array.prototype.map.call(document.querySelectorAll('#module-list [data-module]'),
          el => el.getAttribute('data-module'))
      };
    });
    if (caso.errore) {
      log('[C] "' + caso.nome + '": lo dice invece di scegliere in silenzio', s.errore === true);
    } else {
      log('[C] "' + caso.nome + '": vale quell\'ordine, scritto per intero',
          s.errore === false && JSON.stringify(s.passi) === JSON.stringify(caso.passi));
    }
    await page.close();
  }

  log('[Z] Nessun errore JS non gestito', errori.length === 0);
  if (errori.length) console.log('  ' + errori.join('\n  '));

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== SEQUENZE SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
