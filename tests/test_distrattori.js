// PROTEGGE: che il numero di risposte sbagliate di Match e Speed Match venga da `CONFIG.sceltaMultipla.distrattori` e non da un numero scritto nel codice, e che un grado troppo piccolo per quel numero FERMI la trascrizione invece di arrivare all'app.
//
// Fino al 2026-10-01 il numero era un `3` dentro `buildMultipleChoiceOptions`
// (`app/sessione.js`), e un grado con meno di quattro voci arrivava all'app e
// mostrava meno alternative senza dirlo a nessuno.
//
// COME:
//   [A] il trascrittore legge il numero e i moduli DALL'APP — il numero è lo
//       stesso che `configApp()` legge, e i moduli sono passi veri delle
//       sequenze, non nomi scritti qui;
//   [B] `bacinoCorto` su episodi veri e su copie accorciate: un grado letto da
//       un modulo a scelta multipla sotto soglia viene nominato, il grado D
//       (che nessuno di quei moduli legge) no, e una sequenza che non esiste è
//       un errore e non «niente da controllare» (regola 49);
//   [C] l'app vera, con la chiave cambiata dal Pannello Admin a 2: Match e
//       SPEED MATCH mostrano tre alternative. ⚠️ Il caso più diverso è Speed
//       Match (regola 42): sta in un altro file, ha il conto alla rovescia e
//       pesca sul grado C — il codice vecchio, col `3` scritto a mano, lì ne
//       mostrava quattro.
//
// ⚠️ LIMITE DICHIARATO: [B] prova la funzione, non che `main()` la chiami. Se
// la chiamata sparisse da `main()`, questo file resterebbe verde. Lo copre la
// lettura del codice, non un test: lanciare il trascrittore su una cartella
// finta vorrebbe dire renderlo capace di scrivere fuori dal repository.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, configApp, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');
const trascrivi = require('./tools/trascrivi.js');

const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const STRUTTURA = 'data/inglese/it/inglese-it-struttura-corso.json';

async function run() {
  // Regola 49: senza la struttura non c'è niente da provare, e lo si dice.
  const esiste = fs.existsSync(repoPath(STRUTTURA));
  log('[A] La struttura inglese c\'è sul disco', esiste);
  if (!esiste) return finisci();
  const struttura = JSON.parse(fs.readFileSync(repoPath(STRUTTURA), 'utf8'));

  // ── [A] Il trascrittore legge numero e moduli dall'app ──
  const sm = trascrivi.sceltaMultipla();
  log('[A] Il numero è quello di `CONFIG.sceltaMultipla.distrattori`',
    sm.distrattori === configApp().sceltaMultipla.distrattori, sm.distrattori + ' | ' + configApp().sceltaMultipla.distrattori);
  const passi = new Set();
  Object.keys(struttura.sequences).forEach(n => struttura.sequences[n].forEach(p => passi.add(p.module)));
  log('[A] I moduli trovati sono passi veri delle sequenze, e ce n\'è almeno uno per Match e per Speed Match',
    sm.moduli.length > 0 && sm.moduli.every(m => passi.has(m)) &&
    sm.moduli.some(m => /^match/.test(m)) && sm.moduli.some(m => /^speedMatch/.test(m)),
    sm.moduli.join(', '));

  // ── [B] Il bacino ──
  const nomeSeq = struttura.episodes.gate.sequence;
  const gate = JSON.parse(fs.readFileSync(repoPath('data/inglese/it/inglese-it-gate.json'), 'utf8'));
  log('[B] L\'episodio vero passa', trascrivi.bacinoCorto('gate', gate, nomeSeq, struttura.sequences, sm).length === 0);

  const corto = JSON.parse(JSON.stringify(gate));
  corto.levels.C.items = corto.levels.C.items.slice(0, sm.distrattori);
  const rC = trascrivi.bacinoCorto('gate', corto, nomeSeq, struttura.sequences, sm);
  // ⚠️ DAL 2026-10-07 IL BACINO E' PER VOCE (`voci − 1 − esclusi`): un grado
  // troppo piccolo nomina OGNI sua voce, una riga ciascuna — e i moduli che lo
  // leggono stanno nella riga, non in righe ripetute per modulo.
  log('[B] Un grado C con ' + sm.distrattori + ' voci (una meno del necessario): ogni sua voce nominata, una riga ciascuna',
    rC.length === sm.distrattori && rC.every(r => /grado C, voce c-\d+: bacino 2 \(3 voci − 1 − 0 esclusi\)/.test(r)), rC.join(' | '));

  const soloD = JSON.parse(JSON.stringify(gate));
  soloD.levels.D.items = soloD.levels.D.items.slice(0, 1);
  log('[B] Il grado D piccolo NON ferma niente: nessun modulo a scelta multipla lo legge',
    trascrivi.bacinoCorto('gate', soloD, nomeSeq, struttura.sequences, sm).length === 0);

  const rS = trascrivi.bacinoCorto('gate', gate, 'sequenza-che-non-esiste', struttura.sequences, sm);
  log('[B] Una sequenza che non esiste è un errore, non «niente da controllare»',
    rS.length === 1 && /non esiste/.test(rS[0]), rS.join(' | '));

  // ── [C] L'app legge la chiave ──
  const browser = await launchBrowser();
  for (const caso of [{ distrattori: null, attese: sm.distrattori + 1 }, { distrattori: 2, attese: 3 }]) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    await page.goto(APP_URL);
    await page.evaluate(function (n) {
      localStorage.clear();
      if (n) localStorage.setItem('baseinglese:configOverrides', JSON.stringify({ sceltaMultipla: { distrattori: n } }));
    }, caso.distrattori);
    await page.reload();
    await attendiPrimaSchermata(page);
    await page.fill('#name-input', 'Distrattori');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible', timeout: 15000 });
    const etichetta = caso.distrattori ? 'chiave a ' + caso.distrattori : 'valore di partenza';
    // ⚠️ SI APRE DAL CODICE, NON DALLA RIGA: qui non si prova lo Sblocco
    // Sequenziale (regola 30), si prova quante alternative compaiono.
    for (const m of [{ id: 'matchEngIta', avvio: '#qm-start-btn', opzioni: '#qm-options .sr-option' },
                     { id: 'speedMatchEngIta', avvio: '#sr-ready-btn', opzioni: '#sr-options .sr-option' }]) {
      try {
        await page.evaluate((id) => {
          window.BI.impostaEpisodioCorrente(window.BI.EPISODES.gate);
          window.BI.openModuleFromMap(window.BI.episodioCorrente().modules.find(x => x.id === id));
        }, m.id);
        await page.click(m.avvio, { timeout: 15000 });
        await page.waitForSelector(m.opzioni, { state: 'visible', timeout: 15000 });
        const quante = await page.$$eval(m.opzioni, b => b.length);
        log('[C] ' + m.id + ', ' + etichetta + ': ' + caso.attese + ' alternative', quante === caso.attese, String(quante));
      } catch (e) {
        log('[C] ' + m.id + ', ' + etichetta + ': il modulo si apre e mostra le alternative', false, e.message.split('\n')[0]);
      }
      await page.evaluate(() => window.BI.goHome()).catch(() => {});
    }
    log('[C] ' + etichetta + ': nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();
  finisci();
}

function finisci() {
  console.log('\n=== DISTRATTORI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
