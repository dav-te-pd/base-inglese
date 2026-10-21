// PROTEGGE: che dal 2026-10-13 nessun id di passo e nessuna direzione nominino una lingua — `matchTargetNative`, non l'id di prima con «Eng» e «Ita» dentro; `target-native`, non la direzione con «en» e «it» — nelle strutture di `inglese/it` e `spagnolo/it`, nei testi condivisi italiani e in `app/*.js`; e che un profilo salvato coi nomi di prima apra l'app senza errori, PERDENDO il progresso di quei passi e i colori di quelle voci (mentre lo stesso profilo coi nomi nuovi li tiene).
//
// ⚠️ IL PROGRESSO NON MIGRA, E QUESTO FILE LO DICE APERTAMENTE. Non esiste una
// migrazione per gli id dei PASSI (c'è solo per quelli di personalizzazione),
// e il 2026-10-13 chi guida il progetto ha deciso di non costruirla: i
// progressi e i colori esistenti erano solo di prova, e dopo Supabase la
// stessa rinomina avrebbe chiesto uno strumento che non c'è. **Un test che
// dicesse solo «non si rompe» farebbe credere che il progresso sia stato
// portato avanti: non lo è.** Le due perdite sono asserzioni, non commenti.
//
// COME:
//   [A] statico, sul codice e sui dati che l'app carica (NON sui markdown,
//       che raccontano la rinomina e citano apposta i nomi vecchi): le chiavi
//       di `moduleLabels` e i moduli delle sequenze delle due strutture, le
//       chiavi dei testi condivisi, i descrittori del catalogo e i valori di
//       direzione scritti fra apici in `app/`;
//   [B] l'app vera, con un profilo scritto a mano coi nomi vecchi: si apre
//       senza errori JS, il passo rinominato NON è completato (il progresso si
//       è perso) e nessun colore risponde alla direzione nuova (i colori si
//       sono persi);
//   [C] ⚠️ il contrario, perché [B] sappia vedere: lo stesso profilo scritto
//       coi nomi NUOVI tiene il passo completato e il colore.
//
// Visto fallire rimettendo una direzione vecchia in `app/match.js` e un id
// vecchio nella struttura spagnola.
//
// ⚠️ LIMITE: [A] guarda le forme che il 2026-10-13 c'erano (`EngIta`,
// `ItaEng`, le direzioni fra apici). Un id nuovo che nominasse un'altra lingua
// in un'altra forma — `matchEsIt` — passerebbe.
// ⚠️ E [A] legge le strutture di `inglese/it` e `spagnolo/it` e i testi
// condivisi `it`: l'edizione `italiano/es` e i testi condivisi `es`, nati il
// 2026-10-19, non li guarda (misurato il 2026-10-21 leggendo `staticoA`).

'use strict';

const fs = require('fs');
const path = require('path');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');
const { stepsBefore } = require('./module-order');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Le due forme di prima, scritte a pezzi perché questo file non diventi lui
// stesso un'occorrenza per chi le cerca.
const VECCHIO_ID = new RegExp('Eng' + 'Ita|Ita' + 'Eng');
const VECCHIA_DIREZIONE = new RegExp("'(e" + "n-it|i" + "t-en)'");
const NUOVO = 'matchTargetNative';
const VECCHIO = 'match' + 'Eng' + 'Ita';

function staticoA() {
  const leggi = (p) => JSON.parse(fs.readFileSync(repoPath(p), 'utf8'));
  ['inglese', 'spagnolo'].forEach(function (l) {
    const s = leggi('data/' + l + '/it/' + l + '-it-struttura-corso.json');
    const chiavi = Object.keys(s.moduleLabels || {});
    const passi = [];
    Object.keys(s.sequences || {}).forEach(function (n) { s.sequences[n].forEach(function (p) { passi.push(p.module); }); });
    log('[A] ' + l + '/it: ci sono passi da guardare', chiavi.length > 0 && passi.length > 0);
    const brutti = chiavi.concat(passi).filter(function (x) { return VECCHIO_ID.test(x); });
    log('[A] ' + l + '/it: nessun id di passo nomina una lingua', brutti.length === 0, brutti.join(', '));
    log('[A] ' + l + '/it: ' + NUOVO + ' c\'è', chiavi.indexOf(NUOVO) !== -1);
  });
  const condivisi = Object.keys(leggi('data/condivisi/it/it-istruzioni-moduli.json'));
  log('[A] Le chiavi dei testi condivisi non nominano lingue, e ' + NUOVO + ' c\'è',
    !condivisi.some(function (k) { return VECCHIO_ID.test(k); }) && condivisi.indexOf(NUOVO) !== -1);
  const app = fs.readdirSync(repoPath('app')).filter(function (f) { return f.endsWith('.js'); });
  const conId = [], conDir = [];
  app.forEach(function (f) {
    const t = fs.readFileSync(repoPath('app', f), 'utf8');
    if (VECCHIO_ID.test(t)) conId.push(f);
    if (VECCHIA_DIREZIONE.test(t)) conDir.push(f);
  });
  log('[A] Nessun file di app/ nomina un id di passo con una lingua', conId.length === 0, conId.join(', '));
  log('[A] Nessun file di app/ usa una direzione con le lingue fra apici', conDir.length === 0, conDir.join(', '));
}

async function profilo(browser, utente, completati, mastery) {
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  await page.goto(APP_URL);
  await attendiPrimaSchermata(page);
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(function (a) {
    localStorage.setItem(BI.moduleProgressKey('gate', a.utente), JSON.stringify({ completed: a.completati }));
    localStorage.setItem(BI.masteryStorageKey('gate', a.utente), JSON.stringify(a.mastery));
  }, { utente: utente, completati: completati, mastery: mastery });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible', timeout: 15000 });
  await page.click('#go-episode');
  if (await page.$('#map-intro-start-btn:visible')) await page.click('#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  const stato = await page.evaluate(function (a) {
    const riga = document.querySelector('#module-list [data-module="' + a.nuovo + '"]');
    const m = BI.loadMastery('gate', a.utente);
    return {
      riga: riga ? riga.className : null,
      coloriNuovi: Object.keys(m).filter(function (k) { return /:target-native$/.test(k); }).length
    };
  }, { utente: utente, nuovo: NUOVO });
  await page.close();
  return { stato: stato, errori: errori };
}

async function run() {
  staticoA();

  const prima = stepsBefore(NUOVO);
  const browser = await launchBrowser();

  // [B] il profilo coi nomi di prima
  const b = await profilo(browser, 'Vecchio', prima.concat([VECCHIO]),
    { ['match:c-1:' + 'en' + '-it']: { level: 'verde', streak: 2 } });
  log('[B] Un profilo coi nomi di prima apre la mappa senza errori JS', b.errori.length === 0, b.errori.join(' | '));
  log('[B] ⚠️ IL PROGRESSO SI PERDE: ' + NUOVO + ' non è completato, anche se il profilo aveva completato ' + VECCHIO,
    !!b.stato.riga && b.stato.riga.indexOf('completed') === -1, String(b.stato.riga));
  log('[B] ⚠️ ...e il passo è quello da fare adesso (`current`): i passi prima di lui, che non hanno cambiato nome, restano completati',
    !!b.stato.riga && b.stato.riga.indexOf('current') !== -1, String(b.stato.riga));
  log('[B] ⚠️ I COLORI SI PERDONO: nessuna voce ha colore nella direzione nuova', b.stato.coloriNuovi === 0, String(b.stato.coloriNuovi));

  // [C] lo stesso profilo coi nomi nuovi: il test sa vedere
  const c = await profilo(browser, 'Nuovo', prima.concat([NUOVO]),
    { 'match:c-1:target-native': { level: 'verde', streak: 2 } });
  log('[C] Coi nomi nuovi il passo resta completato: [B] sa vedere', !!c.stato.riga && c.stato.riga.indexOf('completed') !== -1, String(c.stato.riga));
  log('[C] ...e il colore resta', c.stato.coloriNuovi === 1, String(c.stato.coloriNuovi));
  log('[C] Nessun errore JS', c.errori.length === 0, c.errori.join(' | '));

  await browser.close();
  console.log('\n=== ID NEUTRI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
