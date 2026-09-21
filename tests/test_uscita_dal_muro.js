// PROTEGGE: che una configurazione sbagliata non possa MURARE l'app — che
// resti sempre almeno una strada per disfarla.
//
// COSA SI PERDE SENZA QUESTO FILE, e non è un'ipotesi: è successo il
// 2026-09-21 a chi guida il progetto, provando l'app su Pages. Un override del
// Pannello Admin su `edizione` fa fallire `struttura-corso.json`; `accendi()`
// non gira; si finisce sulla schermata d'errore. E lì:
//
//   · «Riprova» rifà la stessa strada e fallisce allo stesso modo;
//   · «Torna alla mappa» porta nello stesso muro;
//   · `?config` stava IN FONDO ad `accendi()`, quindi non veniva raggiunta;
//   · la sequenza `config` da tastiera apriva il pannello, che però cadeva
//     con un `TypeError` — i quattro riquadri di report leggevano
//     `BI.episodioCorrente().id` senza guardia, e l'episodio non c'era.
//
// **L'unico modo di uscirne era cancellare i dati del sito dal menu del
// browser.** Cioè: lo strumento che ripara era chiuso dentro la stanza che
// deve aprire.
//
// ⚠️ L'ASSERZIONE CHE CONTA È LA [B], e le altre non potrebbero contare.
//
// Le [A] guardano che il pannello si apra: vere anche prima, **purché l'app
// sia sana**. È solo dentro il muro che le due versioni si separano — e il
// muro va COSTRUITO, non aspettato: si installa l'override rotto con
// `addInitScript`, cioè prima che l'app parta, che è l'unico istante in cui
// si può.
//
// IL CASO PIÙ DIVERSO (regola 42): **`?config` nell'indirizzo**, non la
// sequenza da tastiera. Non è il più complicato — è quello a cui MANCA il
// passaggio che l'altro ha: la sequenza da tastiera è un listener attaccato a
// tempo di parsing e sopravvive a qualunque fallimento, `?config` è una riga
// dentro `boot()` e sopravvive solo se sta nel punto giusto. **È l'unica
// porta che i telefoni hanno**, dove digitare «config» vorrebbe dire aprire
// la tastiera.
//
// LIMITE DICHIARATO: questo file non verifica che il ripristino RIPARI ogni
// configurazione sbagliata possibile — verifica che la strada per disfarla
// esista e sia raggiungibile. Quale override rompa cosa è un'altra domanda.

const { launchBrowser, APP_URL, bloccaFontEsterni, attendiPrimaSchermata } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// ⚠️ L'ATTESA CHE NON UCCIDE IL FILE.
//
// Un `waitForSelector` che scade ALZA, e l'eccezione porta via i blocchi che
// vengono dopo: rompendo la guardia dei report, `[B]` moriva di timeout e
// `[C]` e `[D]` non arrivavano nemmeno a dire come erano andati. **Una
// misura che non misura, in forma di rosso** — dice che qualcosa è andato
// storto, non cosa.
//
// Così invece il fallimento ha un nome, e il resto del file continua a
// guardare. Verificato togliendo le quattro guardie: `[B]` diventa rossa e
// nomina il pannello, `[C]` e `[D]` restano verdi e dicono che le altre due
// strade reggono ancora.
async function pannelloAperto(page, ms) {
  try {
    await page.waitForSelector('#config-panel-overlay.is-open', { timeout: ms || 8000 });
    return true;
  } catch (e) { return false; }
}

const CHIAVE = 'baseinglese:configOverrides';
// Un'edizione che non esiste: il file di struttura viene cercato sotto
// `data/inglese/zz/` e non c'è. È esattamente l'override che ha murato l'app.
const OVERRIDE_ROTTO = { edizione: { lingua: 'inglese', studente: 'zz' } };

async function apriMurata(page, conConfigNellIndirizzo) {
  await page.addInitScript(function (d) {
    try {
      localStorage.setItem(d.chiave, JSON.stringify(d.ov));
      localStorage.setItem('baseinglese:userName', 'Murato');
    } catch (e) {}
  }, { chiave: CHIAVE, ov: OVERRIDE_ROTTO });
  await page.goto(APP_URL + (conConfigNellIndirizzo ? '?config' : ''));
  await page.waitForSelector('#view-error.is-active', { timeout: 15000 });
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] IL MURO ESISTE DAVVERO ───────────────────────────────────────
  //
  // Se questo blocco non vedesse la schermata d'errore, tutto il file
  // starebbe misurando un'app sana — cioè niente.
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    await apriMurata(page, false);
    log('[A] Un\'edizione che non esiste porta alla schermata d\'errore', true);
    const uscite = await page.evaluate(() => ({
      riprova: !document.getElementById('load-error-retry').hidden,
      indietro: !document.getElementById('load-error-back').hidden,
      reset: !document.getElementById('load-error-reset').hidden,
      testoReset: document.getElementById('load-error-reset').textContent
    }));
    log('[A] La terza uscita c\'è, ed è accesa perché ci sono override salvati',
      uscite.reset === true, JSON.stringify(uscite));
    log('[A] ...e porta un testo, non è muta',
      !!uscite.testoReset.trim(), JSON.stringify(uscite.testoReset));
    await page.close();
  }

  // ── [A2] E NON COMPARE QUANDO NON PUÒ SERVIRE ────────────────────────
  //
  // Un pulsante che non può aiutare è peggio di un pulsante che non c'è: chi
  // lo preme perde i suoi dati e resta dov'era.
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    await page.route('**/istruzioni-moduli.json*', route => route.abort());
    await page.addInitScript(() => {
      try { localStorage.setItem('baseinglese:userName', 'SenzaOverride'); } catch (e) {}
    });
    await page.goto(APP_URL);
    await attendiPrimaSchermata(page);
    await page.evaluate(() => window.BI.showLoadError(null));
    const acceso = await page.evaluate(() =>
      !document.getElementById('load-error-reset').hidden);
    log('[A2] Senza override salvati la terza uscita NON compare', acceso === false);
    await page.close();
  }

  // ── [B] DENTRO IL MURO, IL PANNELLO SI APRE LO STESSO ────────────────
  //
  // È l'asserzione che distingue le due versioni: prima il pannello cadeva
  // con un TypeError e l'app restava inaccessibile.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).slice(0, 160)); });
    await bloccaFontEsterni(page);
    await apriMurata(page, false);

    for (const ch of 'config') await page.keyboard.press(ch);
    const aperto = await pannelloAperto(page);
    log('[B] Con l\'app murata, la sequenza da tastiera apre il pannello',
      aperto === true, 'il pannello non si è aperto: ' + (errori[0] || 'nessun errore JS registrato'));

    const stato = await page.evaluate(() => ({
      gruppi: document.querySelectorAll('#config-panel-body .config-group').length,
      reportVuoti: Array.from(document.querySelectorAll(
        '#config-audio-usage, #config-mastery-report, #config-next-line-skips, #config-storycards-stats'
      )).filter(el => !el.textContent.trim()).length
    }));
    log('[B] Le manopole ci sono lo stesso', stato.gruppi > 0, JSON.stringify(stato));
    // ⚠️ I report non si possono costruire senza un episodio — ma devono
    // DIRLO, non sparire e non far cadere il pannello.
    log('[B] I quattro report dicono perché non ci sono, invece di restare muti',
      stato.reportVuoti === 0, JSON.stringify(stato));
    log('[B] Nessun errore JS: il pannello non cade', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] IL CASO PIÙ DIVERSO: `?config` nell'indirizzo ────────────────
  //
  // L'unica porta che i telefoni hanno, e l'unica che può stare nel punto
  // sbagliato: la sequenza da tastiera è un listener di parsing e sopravvive
  // comunque.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).slice(0, 160)); });
    await bloccaFontEsterni(page);
    await apriMurata(page, true);
    const aperto = await page.evaluate(() =>
      !!document.querySelector('#config-panel-overlay.is-open'));
    log('[C] Con l\'app murata, `?config` nell\'indirizzo apre il pannello', aperto === true);
    log('[C] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [D] E IL RIPRISTINO RIPARA DAVVERO ───────────────────────────────
  //
  // L'ultimo effetto del gesto: la pagina riparte e non è più murata. Non si
  // guarda il `localStorage` — quello è il primo effetto, e sarebbe vero per
  // costruzione (regola 44).
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    // ⚠️ QUI L'OVERRIDE NON SI INSTALLA CON `addInitScript`, e non e' un
    // dettaglio: quello gira a OGNI navigazione, quindi si rimetterebbe da
    // solo al ricaricamento e il ripristino non potrebbe vincere mai. Si
    // scrive una volta a pagina gia' aperta, poi si ricarica: cosi' il muro
    // c'e' davvero e il gesto puo' disfarlo.
    await page.goto(APP_URL);
    await page.evaluate(function (d) {
      localStorage.setItem(d.chiave, JSON.stringify(d.ov));
      localStorage.setItem('baseinglese:userName', 'Murato');
    }, { chiave: CHIAVE, ov: OVERRIDE_ROTTO });
    await page.reload();
    await page.waitForSelector('#view-error.is-active', { timeout: 15000 });
    await page.click('#load-error-reset');
    await page.waitForSelector('#view-home.is-active, #view-onboarding.is-active', { timeout: 15000 });
    const dopo = await page.evaluate(() => ({
      errore: !!document.querySelector('#view-error.is-active'),
      override: localStorage.getItem('baseinglese:configOverrides')
    }));
    log('[D] Dopo il ripristino l\'app non è più murata', dopo.errore === false, JSON.stringify(dopo));
    log('[D] ...e l\'override sbagliato non c\'è più', dopo.override === null, JSON.stringify(dopo.override));
    await page.close();
  }

  await browser.close();
  console.log('\n=== USCITA DAL MURO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
