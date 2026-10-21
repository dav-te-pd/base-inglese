// PROTEGGE: che OGNI edizione elencata in `data/edizioni.json` parta davvero nel browser — prima schermata, schermata iniziale, mappa del primo episodio — leggendo i testi condivisi della lingua del SUO studente e non di un altro. Senza questo file, un'edizione nuova entra nell'elenco e nel Pannello Admin senza che nessun test l'abbia mai aperta.
//
// Chiesto da chi guida il progetto il 2026-10-19, con l'edizione
// `italiano/es`. Fino a quel giorno l'unico test che puntasse l'app su
// un'edizione diversa dall'inglese era `test_edizione_spagnola.js`, scritto
// per `spagnolo/it` — e uno studente italiano anche lui.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42), ed e' la ragione per cui il test
// esiste: `italiano/es` e' l'UNICA edizione il cui studente non e' `it`,
// quindi l'UNICA che legge `data/condivisi/es/`. Quel percorso, prima di
// questo file, lo aveva provato solo un giro a mano.
//
// COME — per ogni edizione dell'elenco, profilo pulito e override
// `edizione` nel magazzino del Pannello, come fa `test_edizione_spagnola`:
//   [A] parte senza schermata d'errore e senza errori JS;
//   [B] ⚠️ il browser ha CHIESTO `data/condivisi/{studente}/{studente}-istruzioni-moduli.json`
//       — e nessun file condiviso di un'altra lingua-studente. «Ho
//       intercettato» e' un'asserzione, non un commento (regola 49);
//   [C] il nome del corso sul badge e' quello di `edizioni.json`;
//   [D] il pulsante «I tuoi episodi» porta il testo del file condiviso di
//       QUELLO studente — «Tus episodios» non e' «I tuoi episodi»: se l'app
//       leggesse il file sbagliato, qui si vedrebbe;
//   [E] la mappa del primo episodio ha tante righe quanti passi ha la sua
//       sequenza nella struttura dell'edizione.
//
// Falsificato forzando `percorsoCondiviso` su `it`: rossi `[B]` e `[D]` di
// `italiano/es`, e solo quelli.
//
// LIMITE: non apre nessun modulo — quindi non vede arrivare i MESSAGGI DI
// ESITO, che l'app chiede solo alla prima Schermata Finale
// (`loadFeedbackMessages`), non all'avvio. Che i moduli girino su un'edizione lo prova
// `test_edizione_spagnola.js` per `spagnolo/it`; qui si prova che ogni
// edizione ARRIVA alla mappa con i testi giusti. E non guarda le prime due
// schermate in lingua: lì restano testi in italiano scritti nel markup, ed e'
// una domanda aperta (`docs/decisioni-stato.md`, «Il giro di allineamento
// fra le tre edizioni»).

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const leggiJson = (...pezzi) => JSON.parse(fs.readFileSync(repoPath(...pezzi), 'utf8'));

async function run() {
  const edizioni = leggiJson('data', 'edizioni.json').edizioni;
  log('L\'elenco delle edizioni non e\' vuoto', edizioni.length > 0, String(edizioni.length));
  const studenti = Array.from(new Set(edizioni.map((e) => e.studente)));
  log('Fra le edizioni c\'e\' almeno uno studente che non e\' `it` (il caso piu\' diverso)',
    studenti.some((s) => s !== 'it'), studenti.join(', '));

  const browser = await launchBrowser();
  for (const ed of edizioni) {
    const nome = ed.lingua + '/' + ed.studente;
    const pref = ed.lingua + '-' + ed.studente + '-';
    const struttura = leggiJson('data', ed.lingua, ed.studente, pref + 'struttura-corso.json');
    const testi = leggiJson('data', 'condivisi', ed.studente, ed.studente + '-istruzioni-moduli.json');
    const primo = struttura.episodioCorrente;
    const passi = struttura.sequences[struttura.episodes[primo].sequence].length;

    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', (e) => errori.push(e.message));
    const condivisiChiesti = [];
    page.on('request', (r) => {
      const m = r.url().match(/data\/condivisi\/([^/]+)\/([^?]+)/);
      if (m) condivisiChiesti.push(m[1] + '/' + m[2]);
    });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
    await page.goto(APP_URL);
    await page.evaluate((e) => {
      localStorage.clear();
      localStorage.setItem('baseinglese:configOverrides', JSON.stringify({ edizione: { lingua: e.lingua, studente: e.studente } }));
    }, ed);
    // Solo le richieste dopo l'override contano: il primo caricamento era
    // ancora sull'edizione di partenza.
    condivisiChiesti.length = 0;
    await page.reload();
    await attendiPrimaSchermata(page);

    const erroreAvvio = await page.evaluate(() => {
      const v = document.getElementById('view-error');
      return !!(v && v.classList.contains('is-active'));
    });
    log('[A] ' + nome + ': parte senza schermata d\'errore', !erroreAvvio);
    if (erroreAvvio) { await page.close(); continue; }

    const atteso = ed.studente + '/' + ed.studente + '-istruzioni-moduli.json';
    log('[B] ⚠️ ' + nome + ': il browser ha chiesto data/condivisi/' + atteso,
      condivisiChiesti.indexOf(atteso) !== -1, condivisiChiesti.join(', ') || 'nessuna richiesta intercettata');
    const estranei = condivisiChiesti.filter((c) => c.split('/')[0] !== ed.studente);
    log('[B] ...e nessun file condiviso di un\'altra lingua-studente', estranei.length === 0, estranei.join(', '));

    await page.fill('#name-input', 'Prova');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
    const home = await page.evaluate(() => ({
      corso: (document.querySelector('#view-home [data-nome="corso"]') || {}).textContent || '',
      episodi: document.getElementById('go-episodes-list').textContent.trim()
    }));
    log('[C] ' + nome + ': il badge dice «' + ed.corso + '»', home.corso.trim() === ed.corso, JSON.stringify(home.corso));
    log('[D] ⚠️ ' + nome + ': «I tuoi episodi» viene dal file di ' + ed.studente + ' («' + testi.condivisi.tuoiEpisodi + '»)',
      home.episodi === testi.condivisi.tuoiEpisodi, JSON.stringify(home.episodi));

    await page.click('#go-episode');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    const righe = await page.$$eval('#view-map .module-row', (r) => r.length);
    log('[E] ' + nome + ': la mappa di `' + primo + '` ha ' + passi + ' righe, quanti i passi della sua sequenza', righe === passi, String(righe));
    log('[A] ' + nome + ': nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();
  console.log('\n=== TUTTE LE EDIZIONI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
