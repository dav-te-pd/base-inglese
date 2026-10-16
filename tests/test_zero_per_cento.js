// PROTEGGE: che dal 2026-10-16 a 0% di risposte giuste NON compaia nessun messaggio di fine modulo, e che la manopola `percentageThresholds.basso` decida davvero dove il messaggio comincia — senza toccare gli altri due mestieri della stessa scala: il colore del badge (a 0% rosso) e il colore della parola in Voice Check (a 0% `wrong`).
//
// Deciso da chi guida il progetto (decisione (a1)). Fino a quel giorno
// `basso` non lo leggeva nessuno: a 0% compariva un messaggio «basso», mentre
// il disegno scritto, la manopola e le stelle dicevano «nessun messaggio».
// *Non era una scelta: era quello che il codice faceva per caso.*
//
// COME:
//   [A] le fasce di `fasciaMessaggio` sull'app vera, ai bordi: 0, 1, 49, 50,
//       79, 80, 100;
//   [B] ⚠️ gli altri due mestieri NON cambiano: `percentageBucket(0)` resta
//       `basso` e `moduleRulesLevel(0)` resta `rosso`. *Un `null` dentro
//       `percentageBucket` avrebbe fatto la cosa giusta per il messaggio e
//       dato `undefined` al badge e alla parola, in silenzio;*
//   [C] la manopola funziona: con `basso` a 30, 20% non ha messaggio e 30% si';
//   [D] `applyOutcomeSubtitle` con la fascia `null` lascia il sottotitolo
//       VUOTO anche se prima c'era un testo — sull'app vera, dopo che i
//       messaggi sono arrivati;
//   [E] statico, sul codice: nessuna chiamata ad `applyOutcomeSubtitle` passa
//       `percentageBucket(...)`, e le chiamate che passano una percentuale
//       passano `fasciaMessaggio(...)`.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): `app/voice.js`, l'unico file con DUE
// chiamanti di mestieri diversi — il messaggio (deve usare
// `fasciaMessaggio`) e il colore della parola (deve restare su
// `percentageBucket`). [E] li guarda tutti e due.
//
// LIMITE: non guida un modulo fino a una Schermata Finale a 0% — non c'e' un
// modo stabile di sbagliare tutto senza conoscere le risposte. [D] prova la
// funzione che quella schermata chiama, con lo stesso `null`.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

function staticoE() {
  const app = fs.readdirSync(repoPath('app')).filter((f) => f.endsWith('.js'));
  const chiamate = [];
  app.forEach((f) => {
    fs.readFileSync(repoPath('app', f), 'utf8').split('\n').forEach((riga, i) => {
      if (/applyOutcomeSubtitle\(/.test(riga) && !/function applyOutcomeSubtitle/.test(riga)) {
        chiamate.push({ f, n: i + 1, riga: riga.trim() });
      }
    });
  });
  log('[E] Ci sono chiamate ad applyOutcomeSubtitle da guardare', chiamate.length > 0, String(chiamate.length));
  const conBucket = chiamate.filter((c) => /percentageBucket\(/.test(c.riga));
  log('[E] Nessuna chiamata ad applyOutcomeSubtitle passa percentageBucket(...)', conBucket.length === 0,
    conBucket.map((c) => c.f + ':' + c.n).join(', '));
  const conFascia = chiamate.filter((c) => /fasciaMessaggio\(/.test(c.riga));
  log('[E] Le cinque chiamate che passano una percentuale usano fasciaMessaggio', conFascia.length === 5,
    conFascia.map((c) => c.f).join(', '));
  const voice = fs.readFileSync(repoPath('app', 'voice.js'), 'utf8');
  log('[E] ⚠️ voice.js: il messaggio usa fasciaMessaggio...',
    /applyOutcomeSubtitle\([^)]*fasciaMessaggio\(vcLastAvgPct\)/.test(voice));
  log('[E] ...e il colore della parola resta su percentageBucket',
    /\{ alto: 'correct', medio: 'similar', basso: 'wrong' \}\[percentageBucket\(pct\)\]/.test(voice));
  // ⚠️ E LA REGOLA SCRITTA NEL FILE DEI MESSAGGI E' USCITA, il 2026-10-16:
  // `percentageRule` non la leggeva nessuno, ricopiava le tre soglie e diceva
  // una cosa che il codice non faceva. Le quattro fasce le spiega la prosa del
  // markdown, senza numeri. Se tornasse nel JSON sarebbe di nuovo una copia
  // senza lettore (regola 47).
  const messaggi = JSON.parse(fs.readFileSync(repoPath('data', 'condivisi', 'it', 'it-messaggi-feedback.json'), 'utf8'));
  log('[E] Il file dei messaggi non porta piu\' `percentageRule`, e le sue famiglie ci sono',
    !('percentageRule' in messaggi) && Object.keys(messaggi).length > 0, Object.keys(messaggi).join(', '));
}

async function run() {
  staticoE();
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  await page.goto(APP_URL);
  await attendiPrimaSchermata(page);

  const fasce = await page.evaluate(() => [0, 1, 49, 50, 79, 80, 100].map((p) => [p, window.BI.fasciaMessaggio(p)]));
  const atteso = [[0, null], [1, 'basso'], [49, 'basso'], [50, 'medio'], [79, 'medio'], [80, 'alto'], [100, 'alto']];
  log('[A] fasciaMessaggio: 0% nessuna fascia, poi basso / medio / alto ai bordi',
    JSON.stringify(fasce) === JSON.stringify(atteso), JSON.stringify(fasce));

  const altri = await page.evaluate(() => ({
    bucket: window.BI.percentageBucket(0),
    badge: window.BI.moduleRulesLevel(0),
    soglia: window.APP_CONFIG.percentageThresholds.basso
  }));
  log('[B] ⚠️ percentageBucket(0) resta «basso»: il colore della parola in Voice Check a 0% e\' ancora `wrong`',
    altri.bucket === 'basso', JSON.stringify(altri));
  log('[B] ⚠️ moduleRulesLevel(0) resta «rosso»: il badge non perde il colore', altri.badge === 'rosso', JSON.stringify(altri));
  log('[B] La soglia di partenza e\' quella di app/config.js (1): il test guarda il valore vero', altri.soglia === 1, String(altri.soglia));

  const manopola = await page.evaluate(() => {
    const t = window.APP_CONFIG.percentageThresholds;
    const prima = t.basso;
    t.basso = 30;
    const r = [window.BI.fasciaMessaggio(20), window.BI.fasciaMessaggio(30)];
    t.basso = prima;
    return r;
  });
  log('[C] La manopola funziona: con `basso` a 30, il 20% non ha messaggio e il 30% e\' «basso»',
    manopola[0] === null && manopola[1] === 'basso', JSON.stringify(manopola));

  const sottotitolo = await page.evaluate(async () => {
    const el = document.createElement('div');
    el.id = 'zero-per-cento-prova';
    el.textContent = 'testo di prima';
    document.body.appendChild(el);
    window.BI.applyOutcomeSubtitle('zero-per-cento-prova', 'moduleCompleteMessages', window.BI.fasciaMessaggio(0));
    const dati = await window.BI.loadFeedbackMessages();
    // L'approdo e' l'arrivo dei messaggi, che nessuna asserzione legge
    // (regola 44): applyOutcomeSubtitle scrive DENTRO lo stesso `then`,
    // quindi un giro di microtask dopo la scrittura e' gia' avvenuta.
    await new Promise((r) => setTimeout(r, 0));
    const conTesto = document.createElement('div');
    conTesto.id = 'zero-per-cento-controprova';
    document.body.appendChild(conTesto);
    window.BI.applyOutcomeSubtitle('zero-per-cento-controprova', 'moduleCompleteMessages', window.BI.fasciaMessaggio(1));
    await window.BI.loadFeedbackMessages();
    await new Promise((r) => setTimeout(r, 0));
    return { zero: el.textContent, uno: conTesto.textContent, gruppi: !!(dati.moduleCompleteMessages && dati.moduleCompleteMessages.basso) };
  });
  log('[D] A 0% il sottotitolo resta VUOTO (e prima aveva un testo)', sottotitolo.zero === '', JSON.stringify(sottotitolo.zero));
  log('[D] ...e all\'1% compare un messaggio «basso»: la controprova sa vedere', sottotitolo.gruppi && sottotitolo.uno.length > 0,
    JSON.stringify(sottotitolo.uno));
  log('[Z] Nessun errore JS', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log('\n=== ZERO PER CENTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
