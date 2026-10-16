// PROTEGGE: che dal 2026-10-16 le stelle di Voice Practice e Voice Check e il messaggio di fine modulo leggano UNA scala sola, `percentageThresholds` — così ritoccarne una soglia dal Pannello sposta insieme stelle, messaggio e colori, e Voice Check non può mostrare «tre stelle» sopra un messaggio «medio».
//
// Fino a quel giorno le stelle leggevano `voiceCoach.starThresholds`: gli
// stessi tre numeri (1, 50, 80) scritti una seconda volta, e niente li
// legava. Deciso da chi guida il progetto, ed e' diventato possibile col passo
// dello 0% (`fasciaMessaggio`, `test_zero_per_cento.js`): prima le stelle
// avevano un gradino — lo zero — che il messaggio non aveva.
//
// COME:
//   [A] le stelle ai bordi della scala vera: 0, 1, 49, 50, 79, 80, 100;
//   [B] ⚠️ LA PROVA CHE CONTA: si sposta `medio` da 50 a 60 sull'app viva, e
//       al 55% stelle, fascia del messaggio e colore devono muoversi
//       INSIEME — una stella, «basso», «rosso». Con due scale le stelle
//       sarebbero rimaste due;
//   [C] la seconda scala non c'e' piu': ne' in `APP_CONFIG`, ne' nel codice,
//       ne' fra le descrizioni del Pannello.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): `medio`, l'unica soglia che fa QUATTRO
// mestieri — il tono del messaggio, il colore, la seconda stella e il
// tentativo superato (`passed = stars > 1` in app/voice.js). [B] sposta
// proprio quella.
//
// LIMITE: non guida Voice Check fino alle stelle a schermo; prova la funzione
// che le calcola, sull'app vera.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // [C] statico: nessun file di app/ legge la seconda scala.
  const app = fs.readdirSync(repoPath('app')).filter((f) => f.endsWith('.js'));
  const lettori = app.filter((f) => fs.readFileSync(repoPath('app', f), 'utf8').split('\n')
    .some((r) => /starThresholds/.test(r) && !/^\s*\/\//.test(r)));
  log('[C] Nessun file di app/ legge `starThresholds` fuori da un commento', lettori.length === 0, lettori.join(', '));

  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  await page.goto(APP_URL);
  await attendiPrimaSchermata(page);

  const config = await page.evaluate(() => ({
    star: window.APP_CONFIG.voiceCoach && window.APP_CONFIG.voiceCoach.starThresholds,
    descrizioni: Object.keys(window.APP_CONFIG.configFieldDescriptions || {}).filter((k) => /starThresholds/.test(k)),
    soglie: window.APP_CONFIG.percentageThresholds
  }));
  log('[C] `voiceCoach.starThresholds` non esiste piu\' in APP_CONFIG', config.star === undefined, JSON.stringify(config.star));
  log('[C] ...e il Pannello non ne descrive nessuna', config.descrizioni.length === 0, config.descrizioni.join(', '));
  log('[A] (le soglie vere sono quelle di app/config.js: 1, 50, 80)',
    !!config.soglie && config.soglie.basso === 1 && config.soglie.medio === 50 && config.soglie.alto === 80, JSON.stringify(config.soglie));

  const stelle = await page.evaluate(() => [0, 1, 49, 50, 79, 80, 100].map((p) => window.BI.starsForPercent(p)));
  log('[A] Le stelle ai bordi: 0, 1, 1, 2, 2, 3, 3', JSON.stringify(stelle) === JSON.stringify([0, 1, 1, 2, 2, 3, 3]), JSON.stringify(stelle));

  const insieme = await page.evaluate(() => {
    const t = window.APP_CONFIG.percentageThresholds;
    const prima = t.medio;
    t.medio = 60;
    const r = { stelle: window.BI.starsForPercent(55), fascia: window.BI.fasciaMessaggio(55), colore: window.BI.moduleRulesLevel(55) };
    t.medio = prima;
    return r;
  });
  log('[B] ⚠️ Con `medio` a 60, al 55% stelle, messaggio e colore si muovono INSIEME: 1 stella, «basso», «rosso»',
    insieme.stelle === 1 && insieme.fascia === 'basso' && insieme.colore === 'rosso', JSON.stringify(insieme));
  log('[Z] Nessun errore JS', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log('\n=== SCALA UNICA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
