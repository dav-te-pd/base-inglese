// PROTEGGE: che fra l'apertura della pagina e l'arrivo di `struttura-corso.json`
// lo studente veda una FRASE e non il bianco — e che quella schermata se ne vada
// da sola quando i dati arrivano.
//
// Cosa si perde senza questo file: la vista dell'attesa e' l'UNICA dell'app che
// nasce con `is-active` nel markup. Togliere quella classe, o togliere la sua
// riga dall'elenco `views` di `app/orchestrazione.js`, non alza nessun errore:
// nel primo caso torna il bianco, nel secondo la schermata resta sopra tutte le
// altre per sempre. **Due guasti opposti, nessuno dei due rumoroso.**
//
// ⚠️ E DAL 2026-09-26 PROTEGGE ANCHE I DUE TEMPI, che sono la parte che si
// rompe piu' facilmente perche' non si vede:
//
//   `attesa.ritardoPrimaDiMostrarlaMs`  se i dati arrivano prima, la schermata
//                                       NON deve comparire affatto
//   `attesa.minimoVisibileMs`           se e' comparsa, deve restare —
//                                       **un lampo non si legge come «sto
//                                       caricando», si legge come «qualcosa
//                                       non funziona»**
//
// *Portare il primo a zero fa lampeggiare la schermata su ogni apertura, e
// nessun errore lo dice; togliere il secondo la fa sparire nell'istante in cui
// i dati arrivano, e nemmeno quello lo dice nessuno.*
//
// COME, e perche' non nel modo ovvio: la finestra da verificare dura
// millisecondi in locale, quindi non si puo' "guardare in fretta". Si RITARDA
// `struttura-corso.json` con `page.route` e si guarda dentro la finestra
// allargata.
//
// ⚠️ IL GLOB FINISCE CON `*`, E NON E' PIGNOLERIA: dal 2026-09-20 i fetch dei
// dati portano la versione (regola 6), quindi l'indirizzo vero finisce in
// `...json?v=...`. Un glob che finisce in `.json` NON intercetta niente, il
// test resta verde e sembra aver provato qualcosa. *E' costato un giro il
// 2026-09-25: `intercettati: 0`.* Per questo il conto degli intercettati e' una
// riga verificata e non un commento.
'use strict';

const { launchBrowser, APP_URL } = require('./test-env');

const BASE = APP_URL;
let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] DENTRO LA FINESTRA: la struttura tarda, e si vede una frase ──
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    let intercettati = 0;
    await page.route('**/*struttura-corso.json*', async r => {
      intercettati++;
      await new Promise(v => setTimeout(v, 4000));
      await r.continue();
    });
    await page.goto(BASE);
    // ⚠️ SI ASPETTA CHE COMPAIA, e non e' un dettaglio: dal 2026-09-26 la
    // vista NON nasce accesa — la accende un timer dopo
    // `ritardoPrimaDiMostrarlaMs`. *Leggere subito dopo il `goto` trovava
    // `[]` e sarebbe stato un rosso che accusa il codice sbagliato.*
    await page.waitForFunction(
      () => document.querySelector('#view-attesa.is-active') !== null,
      null, { timeout: 15000 });
    // Si legge tutto in una chiamata sola: la vista attiva, il testo e il
    // fatto che nessun'altra vista sia accesa descrivono lo stesso istante.
    const dentro = await page.evaluate(() => {
      var attive = Array.from(document.querySelectorAll('.view.is-active')).map(function (v) { return v.id; });
      var riga = document.getElementById('attesa-riga');
      return { attive: attive, testo: riga ? riga.textContent.trim() : null };
    });
    log('[A] La sonda ha davvero ritardato la struttura (glob col ?v=)', intercettati > 0, 'intercettati: ' + intercettati);
    log('[A] Durante l\'attesa e\' accesa la schermata di attesa', dentro.attive.join(',') === 'view-attesa', JSON.stringify(dentro.attive));
    log('[A] ...e non e\' muta: porta una frase', !!dentro.testo && dentro.testo.length > 3, JSON.stringify(dentro.testo));
    log('[A] Nessun errore JS', errori.length === 0, errori.join(' | '));

    // ── [B] QUANDO I DATI ARRIVANO, SE NE VA DA SOLA ──
    // L'approdo e' l'onboarding acceso: e' l'ULTIMO effetto del boot, e non e'
    // quello che l'asserzione legge (regola 44) — le due asserzioni guardano
    // `view-attesa`, non `view-onboarding`.
    await page.waitForFunction(
      () => document.querySelector('#view-onboarding.is-active') !== null,
      null, { timeout: 20000 });
    const dopo = await page.evaluate(() => ({
      attesaAccesa: document.querySelector('#view-attesa.is-active') !== null,
      attesaVisibile: (function () {
        var el = document.getElementById('view-attesa');
        return !!(el && el.getClientRects().length);
      })()
    }));
    log('[B] Arrivata la struttura, la schermata di attesa e\' spenta', dopo.attesaAccesa === false);
    log('[B] ...e non si vede piu\' affatto', dopo.attesaVisibile === false);
    await page.close();
  }

  // ── [C] SENZA RITARDO: l'attesa non resta di mezzo ──
  // Il caso normale, quello di Pages: il file arriva subito. Qui la schermata
  // non deve restare accesa — e' il guasto opposto a quello di [A].
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto(BASE);
    await page.waitForFunction(
      () => document.querySelector('#view-onboarding.is-active') !== null,
      null, { timeout: 20000 });
    const stato = await page.evaluate(() => Array.from(document.querySelectorAll('.view.is-active')).map(function (v) { return v.id; }));
    log('[C] A file veloce resta accesa SOLO la schermata giusta', stato.join(',') === 'view-onboarding', JSON.stringify(stato));
    await page.close();
  }

  // ── [D] I DATI ARRIVANO PRIMA DELLA SOGLIA: non si deve vedere NIENTE ──
  // Il caso di Pages. L'approdo e' l'onboarding acceso — e nessuna asserzione
  // qui legge l'onboarding (regola 44): guardano se l'attesa si e' MAI vista.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    // La soglia si alza invece di rallentare i dati: cosi' il caso «dati
    // veloci» e' garantito per costruzione e non dipende da quanto e' pronta
    // la macchina (regola 19).
    await page.addInitScript(() => {
      localStorage.setItem('baseinglese:configOverrides',
        JSON.stringify({ attesa: { ritardoPrimaDiMostrarlaMs: 10000, minimoVisibileMs: 2000 } }));
    });
    let vistaMai = false;
    await page.goto(BASE);
    const sorveglia = setInterval(async () => {
      const c = await page.evaluate(() => document.querySelector('#view-attesa.is-active') !== null).catch(() => false);
      if (c) vistaMai = true;
    }, 40);
    await page.waitForFunction(
      () => document.querySelector('#view-onboarding.is-active') !== null,
      null, { timeout: 20000 });
    clearInterval(sorveglia);
    log('[D] Con la soglia alta e i dati veloci l\'attesa non compare MAI', vistaMai === false);
    await page.close();
  }

  // ── [E] SE E' COMPARSA, RESTA: il lampo e' il difetto ──
  // Soglia a zero (compare subito) e minimo alto: anche coi dati veloci deve
  // restare a schermo. *E' il difetto che chi guida il progetto ha visto su
  // Pages: «si vede qualcosa che scompare all'istante».*
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(() => {
      localStorage.setItem('baseinglese:configOverrides',
        JSON.stringify({ attesa: { ritardoPrimaDiMostrarlaMs: 0, minimoVisibileMs: 3000 } }));
    });
    // ⚠️ NON SI ASPETTA CHE COMPAIA, SI SORVEGLIA — e la differenza l'ha
    // trovata la falsificazione. Con un `waitForFunction` su `#view-attesa` il
    // guasto «il minimo non si rispetta» faceva **morire il file con un
    // TimeoutError**: la schermata compare e sparisce dentro un frame, e
    // l'attesa non la vede mai. *Un file morto e' un rosso che non dice quale
    // riga — la forma che `stress.sh` mette nel secchio «MORTO O ROSSO».*
    // Sorvegliando invece si ottengono due righe rosse col loro nome.
    let vista = false;
    const t0 = Date.now();
    await page.goto(BASE);
    const guarda = setInterval(async () => {
      const c = await page.evaluate(() => document.querySelector('#view-attesa.is-active') !== null).catch(() => false);
      if (c) vista = true;
    }, 40);
    await page.waitForFunction(
      () => document.querySelector('#view-onboarding.is-active') !== null,
      null, { timeout: 20000 });
    clearInterval(guarda);
    const durata = Date.now() - t0;
    log('[E] Con la soglia a zero la schermata compare davvero', vista === true);
    // ⚠️ IL CONFRONTO E' COL MINIMO CHIESTO, NON CON UN NUMERO SCELTO: se
    // l'app rispetta `minimoVisibileMs` la durata non puo' stare sotto quel
    // valore, per quanto veloce sia la macchina. *Il margine cresce col
    // parametro invece di restare fermo (la lezione di `[C]` in
    // test_attese_condivise).*
    log('[E] Comparsa una volta, resta almeno il minimo chiesto', durata >= 3000, durata + 'ms contro 3000 chiesti');
    await page.close();
  }

  await browser.close();
  console.log('\n=== SCHERMATA ATTESA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed) { console.log('FAILURES: ' + failed); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
