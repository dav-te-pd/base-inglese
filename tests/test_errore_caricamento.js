// PROTEGGE: che un fallimento nel caricamento dei dati diventi qualcosa che
// lo studente VEDE e da cui può uscire, invece di un modulo che non si apre
// o che si apre vuoto. Se questo file sparisse, il ramo d'errore tornerebbe
// a essere codice che non gira mai in nessuna prova: si romperebbe alla
// prima modifica e nessuno se ne accorgerebbe, perché su Pages i file ci
// sono sempre — e quando non ci sono è già troppo tardi per scoprirlo.
//
// Protegge anche le due cose che rendono la schermata utile invece che
// decorativa: il testo viene dal JSON (regola 8) e "Riprova" rifà davvero
// l'apertura fallita.
//
// COME. Il fallimento si provoca sul serio, con page.route() che fa fallire
// la richiesta del file episodio: non si simula lo stato d'errore, si
// provoca la causa. Un test che non è mai stato visto fallire non dimostra
// niente, quindi [E] verifica anche il contrario — con la rotta ripristinata
// la schermata NON compare.
//
// NOTA STORICA, perché spiega perché questo test è più forte di quanto
// sembri: quando è nato, index.html teneva una copia inline dei dati
// (window.FALLBACK_*) e una richiesta fallita non produceva un errore ma
// quella copia — quindi il test doveva azzerare tre globali per poter
// vedere la schermata. Quella copia adesso non c'è più: un fetch fallito è
// un fetch fallito, e questo test misura il comportamento vero senza doverne
// spegnere nessun altro.
//
// [G], dal 2026-10-11: un file di migrazioni che c'è ma senza `slot` apre la
// stessa schermata, su Match e su Personalizza — invece di essere letto come
// «nessun id è mai cambiato».
//
// Il file episodio è quello di ogni modulo, quindi la prova si fa su Match
// Practice: è il primo passo dopo Personalizza che legge un grado, e la sua
// apertura è la più corta.
const fs = require('fs');
const path = require('path');
const { launchBrowser, APP_URL, repoPath, fileEdizione, attendiPrimaSchermata, globDati, fileCondiviso } = require('./test-env');
const { stepsBefore } = require('./module-order');

const PASSO = 'matchEngIta';
const PRIMA = stepsBefore(PASSO);
const FILE_EPISODIO = 'gate.json'; // il prefisso dell'edizione lo mette globDati/fileEdizione (test-env.js)

// I testi attesi si leggono dal JSON, non si ricopiano qui: se qualcuno li
// cambia nel file, il test continua a valere; se qualcuno li riporta dentro
// il codice, il test se ne accorge.
const TESTI = JSON.parse(
  fs.readFileSync(fileCondiviso('istruzioni-moduli.json'), 'utf8')
).erroreCaricamento;

const risultati = [];
function log(nome, ok, extra) {
  risultati.push(ok);
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + nome + (extra ? '   ' + extra : ''));
}

const visible = (page, sel) => page.evaluate(function (s) {
  const el = document.querySelector(s);
  return !!el && el.getClientRects().length > 0;
}, sel);

async function clickIfVisible(page, sel) {
  if (await visible(page, sel)) { await page.click(sel); return true; }
  return false;
}

// Porta un profilo pulito fino alla mappa, con i passi precedenti già fatti.
async function finoAllaMappa(page, utente) {
  await page.goto(APP_URL);
  // L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): si aspetta che una delle due porte ci sia, poi si guarda
  // quale. Senza, «non c'e' il campo del nome» e «non c'e' ancora niente» si
  // leggono uguali.
  await attendiPrimaSchermata(page);
  if (!(await visible(page, '#name-input'))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input', { state: 'visible' });
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });

  await page.evaluate(function (arg) {
    localStorage.setItem(BI.moduleProgressKey('gate', arg.utente),
      JSON.stringify({ completed: arg.prima }));
    ['mappaEpisodio', 'personalizzazione', 'matchEngIta'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + arg.utente, '1');
    });
  }, { utente: utente, prima: PRIMA });

  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  await clickIfVisible(page, '#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
}

// Legge in UNA sola chiamata tutto quello che serve sapere della schermata
// (regola 19: niente round-trip separati contro uno stato che cambia).
function statoSchermata(page) {
  return page.evaluate(function () {
    const vista = document.getElementById('view-error');
    const titolo = document.getElementById('load-error-title');
    const corpo = document.getElementById('load-error-body');
    const riprova = document.getElementById('load-error-retry');
    const mappa = document.getElementById('load-error-back');
    const pannello = vista && vista.querySelector('.danger-panel');
    return {
      visibile: !!vista && vista.getClientRects().length > 0,
      titolo: titolo ? titolo.textContent : null,
      corpo: corpo ? corpo.innerHTML : null,
      riprovaTesto: riprova ? riprova.textContent : null,
      riprovaVisibile: !!riprova && riprova.getClientRects().length > 0,
      mappaTesto: mappa ? mappa.textContent : null,
      mappaVisibile: !!mappa && mappa.getClientRects().length > 0,
      // Il tono: deve essere la variante neutra, mai il rosso di .danger-panel
      // né di .is-error (un file che non si carica non è uno sbaglio dello
      // studente).
      classiPannello: pannello ? pannello.className : null,
      coloreTitolo: titolo ? getComputedStyle(titolo).color : null,
      coloreSbagliato: getComputedStyle(document.documentElement)
        .getPropertyValue('--wrong-ink').trim(),
      coloreAccento: getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim()
    };
  });
}

function rgbDaHex(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return 'rgb(' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ') + ')';
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  // ---- [A] la schermata compare quando il file episodio non arriva ----
  await page.route(globDati(FILE_EPISODIO), route => route.abort());
  await finoAllaMappa(page, 'ErroreA');
  await page.click('[data-module="' + PASSO + '"]');
  await page.waitForSelector('#view-error.is-active', { state: 'attached', timeout: 15000 });

  const s = await statoSchermata(page);
  log('[A] La schermata d\'errore compare', s.visibile);
  log('[A] Il titolo è quello di istruzioni-moduli.json',
    s.titolo === TESTI.title, JSON.stringify(s.titolo));
  log('[A] Il corpo è quello del JSON', s.corpo === TESTI.body);
  log('[A] "Riprova" c\'è e porta l\'etichetta del JSON',
    s.riprovaVisibile && s.riprovaTesto === TESTI.retryLabel, JSON.stringify(s.riprovaTesto));
  log('[A] "Torna alla mappa" c\'è e porta l\'etichetta del JSON',
    s.mappaVisibile && s.mappaTesto === TESTI.backLabel, JSON.stringify(s.mappaTesto));

  // ---- [B] il tono: neutro, mai il rosso dello sbagliato ----
  log('[B] Usa la variante neutra .danger-panel-notice',
    !!s.classiPannello && s.classiPannello.indexOf('danger-panel-notice') !== -1,
    s.classiPannello);
  log('[B] Il titolo NON è del colore dello sbagliato',
    s.coloreTitolo !== rgbDaHex(s.coloreSbagliato),
    s.coloreTitolo + ' vs sbagliato ' + rgbDaHex(s.coloreSbagliato));
  log('[B] Il titolo è del colore d\'accento del tema',
    s.coloreTitolo === rgbDaHex(s.coloreAccento),
    s.coloreTitolo + ' vs accento ' + rgbDaHex(s.coloreAccento));

  // ---- [C] "Riprova" rifà l'apertura fallita ----
  await page.unroute(globDati(FILE_EPISODIO));
  await page.click('#load-error-retry');
  await page.waitForSelector('#view-match.is-active', { state: 'attached', timeout: 15000 });
  const dopoRiprova = await page.evaluate(function () {
    return {
      erroreVisibile: document.getElementById('view-error').getClientRects().length > 0,
      moduloAttivo: document.getElementById('view-match').classList.contains('is-active')
    };
  });
  log('[C] "Riprova" apre davvero il modulo che era fallito', dopoRiprova.moduloAttivo);
  log('[C] ...e la schermata d\'errore sparisce', !dopoRiprova.erroreVisibile);

  // ---- [D] "Torna alla mappa" riporta in mappa ----
  await page.route(globDati(FILE_EPISODIO), route => route.abort());
  await page.evaluate(() => { location.reload(); });
  await page.waitForSelector('#go-episode', { state: 'visible', timeout: 15000 });
  await page.click('#go-episode');
  await clickIfVisible(page, '#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  await page.click('[data-module="' + PASSO + '"]');
  await page.waitForSelector('#view-error.is-active', { state: 'attached', timeout: 15000 });
  await page.click('#load-error-back');
  await page.waitForSelector('#view-map.is-active', { state: 'attached', timeout: 15000 });
  log('[D] "Torna alla mappa" riporta in mappa',
    await page.evaluate(() => document.getElementById('view-map').classList.contains('is-active')));

  // ---- [E] il contrario: senza guasto la schermata non compare ----
  await page.unroute(globDati(FILE_EPISODIO));
  await finoAllaMappa(page, 'ErroreE');
  await page.click('[data-module="' + PASSO + '"]');
  await page.waitForSelector('#view-match.is-active', { state: 'attached', timeout: 15000 });
  const sano = await page.evaluate(function () {
    return document.getElementById('view-error').getClientRects().length > 0;
  });
  log('[E] Senza guasto la schermata d\'errore NON compare', !sano);

  // ---- [G] un file di migrazioni SENZA `slot` è un guasto, non «nessuna migrazione» ----
  // Dal 2026-10-11 (passo C), deciso da chi guida il progetto. Fino a quel
  // giorno `loadPersonalizationMigrations` faceva `(data && data.slot) || {}`:
  // un file che c'è ma non dice niente veniva letto come «per questa edizione
  // nessun id è mai cambiato» — un'affermazione che nessuno ha fatto, e le
  // personalizzazioni salvate sarebbero tornate al predefinito in silenzio.
  // `test_nomenclatura_edizione` [D] ferma un file così prima di pubblicarlo;
  // questo prova che l'app lo ferma anche dopo.
  // ⚠️ IL CASO PIÙ DIVERSO (regola 42): Personalizza, l'altro lettore della
  // mappa. Non passa da `openModuleFromMap` ma da `openCustomize`, con la sua
  // `.catch` — e non legge il file episodio.
  const MIGRAZIONI = 'migrazioni-personalizzazione.json';
  const servi = (corpo) => route => route.fulfill({ status: 200, contentType: 'application/json', body: corpo });
  for (const passo of [{ id: PASSO }, { id: 'personalizzazione' }]) {
    await page.route(globDati(MIGRAZIONI), servi('{"_LEGGIMI": "un file che non dice niente"}'));
    await finoAllaMappa(page, 'ErroreG' + passo.id.length);
    let intercettato = false;
    page.on('request', function (r) { if (r.url().indexOf(MIGRAZIONI) !== -1) intercettato = true; });
    await page.click('[data-module="' + passo.id + '"]');
    // Si aspetta SOLO la schermata d'errore, e non una gara col modulo:
    // Personalizza mostra la sua vista PRIMA di caricare la mappa, quindi la
    // vista attiva non direbbe niente su come è finito il caricamento.
    const arrivo = await page.waitForSelector('#view-error.is-active', { state: 'attached', timeout: 15000 })
      .then(() => 'errore', () => 'nessuna schermata d\'errore in 15 s');
    log('[G] ' + passo.id + ': la richiesta del file di migrazioni è stata intercettata', intercettato);
    log('[G] ' + passo.id + ': un file di migrazioni senza `slot` apre la schermata d\'errore', arrivo === 'errore', arrivo);
    await page.unroute(globDati(MIGRAZIONI));
  }
  // ...e il file vuoto ma DICHIARATO (`"slot": {}`) è un file buono: è quello
  // dello spagnolo, e dice una cosa vera.
  await page.route(globDati(MIGRAZIONI), servi('{"slot": {}}'));
  await finoAllaMappa(page, 'ErroreGvuoto');
  await page.click('[data-module="' + PASSO + '"]');
  const vuoto = await Promise.race([
    page.waitForSelector('#view-error.is-active', { state: 'attached', timeout: 15000 }).then(() => 'errore'),
    page.waitForSelector('#view-match.is-active', { state: 'attached', timeout: 15000 }).then(() => 'modulo')
  ]).catch(() => 'niente');
  log('[G] Un file con `"slot": {}` apre il modulo: vuoto ma dichiarato non è un guasto', vuoto === 'modulo', vuoto);
  await page.unroute(globDati(MIGRAZIONI));

  log('[F] Nessun errore JS non gestito', errors.length === 0, errors.join(' | '));

  await browser.close();
  const falliti = risultati.filter(r => !r).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
