// PROTEGGE: che lo studente abbia una LISTA DEGLI EPISODI, nell'ordine del
// corso, e che il successivo si sblocchi quando e' completata **l'ULTIMA
// POSIZIONE** della sequenza — non un modulo chiamato per nome, non un
// conteggio.
//
// COSA SI PERDE SENZA QUESTO FILE. Prima del passo 1.13-bis l'unica strada
// per raggiungere un episodio diverso dal primo era l'interruttore del
// Pannello Admin: uno strumento, non una schermata per lo studente. Se questa
// lista smettesse di funzionare l'app continuerebbe ad andare benissimo —
// mostrando sempre un episodio solo — e nessuno se ne accorgerebbe finche'
// non prova a passare al secondo.
//
// ⚠️ COME, E PERCHE' NON NEL MODO OVVIO. «L'ultima posizione sblocca» e
// «tutti i moduli fatti sbloccano» danno la STESSA risposta su un episodio
// finito per intero, che e' il caso comodo: qualunque asserzione su quello
// sarebbe verde con tutti e due i disegni (regola 44, vera per costruzione).
//
// L'unico caso che li separa e' **un buco in mezzo**: tutti i passi fatti
// TRANNE uno nel mezzo, e l'ultimo fatto.
//   - con «ultima posizione»  -> l'episodio successivo si SBLOCCA
//   - con «tutti i moduli»    -> resterebbe BLOCCATO
// E' il blocco [C], ed e' la sola riga di questo file che dice quale dei due
// disegni e' vivo.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): non il piu' complicato, ma quello a
// cui manca qualcosa. Qui e' **l'episodio senza nessun passo completato** —
// il secondo, appena aperta l'app: non ha un «ultimo fatto» da guardare, e un
// controllo che desse per scontato di trovarne uno lo direbbe completato
// leggendo un indice -1.
//
// LIMITE DICHIARATO: gli episodi sono DUE e hanno la stessa sequenza, quindi
// questo file non prova che la lista regga una sequenza piu' corta — lo prova
// `test_episodi_corti.js` sulla mappa, non qui. Diventera' misurabile col
// terzo episodio (vedi F.7 e 1.19 in docs/decisioni-stato.md).

const { launchBrowser, APP_URL, chiaveMagazzino, attendiPrimaSchermata } = require('./test-env');
const { stepIds } = require('./module-order');
const BASE = APP_URL;

let passed = 0, failed = 0;
const log = (msg, ok, dettaglio) => {
  if (ok) passed++; else failed++;
  console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg + (!ok && dettaglio ? '  -> ' + dettaglio : ''));
};

// Apre l'app con un utente e, se serve, un progresso gia' scritto per uno o
// piu' episodi: `{ gate: ['personalizzazione', ...] }`. Le chiavi si
// costruiscono con `chiaveMagazzino` e non a mano — l'edizione sta in un
// punto solo (regola 24, passo 1.17).
async function apri(page, utente, progressi) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  if (progressi) {
    const semi = Object.keys(progressi).map(function (ep) {
      return [chiaveMagazzino('modules:' + ep + ':' + utente), JSON.stringify({ completed: progressi[ep] })];
    });
    await page.evaluate((s) => s.forEach(([k, v]) => localStorage.setItem(k, v)), semi);
  }
  await page.reload();
  await attendiPrimaSchermata(page);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episodes-list', { state: 'visible' });
}

// La lista, aperta dal suo pulsante di casa. Torna le righe con il loro stato.
async function righeEpisodi(page) {
  await page.click('#go-episodes-list');
  await page.waitForSelector('#episode-list .module-row', { state: 'visible', timeout: 15000 });
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('#episode-list .module-row')).map(r => ({
      id: r.getAttribute('data-episode'),
      stato: r.className.replace('module-row', '').trim().split(/\s+/)[0],
      bloccato: r.disabled
    })));
}

async function run() {
  const browser = await launchBrowser();
  const tutti = stepIds();
  const ultimo = tutti[tutti.length - 1];

  // ============ [A] La lista esiste, e segue l'ordine del corso ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await apri(page, 'ListaA');
    const righe = await righeEpisodi(page);
    const ordineApp = await page.evaluate(() => window.BI.resolveEpisodeOrder().order);
    console.log('    lista: ' + righe.map(r => r.id + '(' + r.stato + ')').join(', '));
    log('[A] La lista mostra tutti gli episodi del corso',
      righe.length === ordineApp.length, righe.length + ' contro ' + ordineApp.length);
    log('[A] ...e nell\'ordine che il corso dichiara',
      righe.map(r => r.id).join(',') === ordineApp.join(','), righe.map(r => r.id).join(','));
    log('[A] Il primo e\' quello ATTUALE, non uno a caso', righe[0].stato === 'current', righe[0].stato);
    log('[A] Il secondo e\' BLOCCATO: non si salta avanti',
      righe[1].stato === 'locked' && righe[1].bloccato === true,
      righe[1].stato + ' bloccato=' + righe[1].bloccato);
    log('[A] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ============ [B] Aprire una riga apre LA MAPPA DI QUELL'EPISODIO ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await apri(page, 'ListaB');
    const righe = await righeEpisodi(page);
    await page.click('#episode-list [data-episode="' + righe[0].id + '"]');
    const intro = await page.$('#map-intro-start-btn');
    if (intro) await intro.click().catch(() => {});
    await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
    const badge = (await page.textContent('#map-episode-badge')).trim();
    const nomeAtteso = await page.evaluate((id) => window.BI.EPISODES[id].nome, righe[0].id);
    log('[B] Si arriva alla mappa dei moduli', true);
    log('[B] ...ed e\' la mappa di QUELL\'episodio, non di un altro',
      badge === nomeAtteso, '"' + badge + '" contro "' + nomeAtteso + '"');
    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ============ [C] L'ULTIMA POSIZIONE sblocca. Un buco in mezzo non conta ============
  //
  // ⚠️ E' LA SOLA RIGA CHE DISTINGUE I DUE DISEGNI. Si completa tutto TRANNE
  // un passo nel mezzo, e SI COMPLETA L'ULTIMO: con «ultima posizione» il
  // secondo episodio si sblocca, con «tutti i moduli fatti» resterebbe
  // bloccato. Su un episodio finito per intero le due risposte coincidono, e
  // l'asserzione non proverebbe niente.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    const conBuco = tutti.filter((id, i) => i !== Math.floor(tutti.length / 2));
    await apri(page, 'ListaC', { gate: conBuco });
    const righe = await righeEpisodi(page);
    console.log('    passi completati: ' + conBuco.length + ' su ' + tutti.length +
      ' (manca "' + tutti[Math.floor(tutti.length / 2)] + '", l\'ultimo "' + ultimo + '" c\'e\')');
    log('[C] Con l\'ultima posizione fatta, il primo episodio risulta COMPLETATO',
      righe[0].stato === 'completed', righe[0].stato);
    log('[C] ...e il secondo si SBLOCCA benche\' un passo in mezzo manchi',
      righe[1].stato === 'current' && righe[1].bloccato === false,
      righe[1].stato + ' bloccato=' + righe[1].bloccato);
    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ============ [D] Senza l'ultima posizione NON si sblocca ============
  //
  // Il rovescio di [C], e serve: senza, [C] sarebbe verde anche con uno
  // sblocco che non guarda niente e apre sempre tutto.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    const tranneUltimo = tutti.slice(0, -1);
    await apri(page, 'ListaD', { gate: tranneUltimo });
    const righe = await righeEpisodi(page);
    console.log('    passi completati: ' + tranneUltimo.length + ' su ' + tutti.length +
      ' (manca SOLO l\'ultimo, "' + ultimo + '")');
    log('[D] Manca solo l\'ultima posizione: il primo NON risulta completato',
      righe[0].stato === 'current', righe[0].stato);
    log('[D] ...e il secondo resta BLOCCATO', righe[1].stato === 'locked' && righe[1].bloccato === true,
      righe[1].stato + ' bloccato=' + righe[1].bloccato);
    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('\n=== LISTA EPISODI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run();
