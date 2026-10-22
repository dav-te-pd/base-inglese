// PROTEGGE: che **un solo file tocchi il posto dove si salva** quello che lo
// studente lascia dietro di sé — nessun `localStorage.` in un altro file di
// `app/` né in `index.html`, e ogni chiamata di `magazzino.js` dentro un
// `try` — e che quel file **ingoi** invece di alzare: con ogni chiamata al
// magazzino che alza (navigazione privata, dati del sito bloccati, quota
// piena) l'app arriva comunque alla prima schermata, senza errori JS non
// gestiti, e una lettura impossibile torna il valore vuoto.
//
// ⚠️ COSA SI PERDE SENZA, ed è il passo 1.7 intero.
//
// Prima del 2026-09-20 il `localStorage` era toccato in **diciassette punti,
// sei file**, ognuno col suo `try/catch`. Il giorno di Supabase quello è il
// lavoro da fare: diciassette punti invece di uno. Questo file tiene fermo il
// risultato — se un `localStorage.` ricompare in un altro file di `app/`, la
// concentrazione è già finita, e se ne accorge qui invece che fra sei mesi.
//
// ⚠️ IL GUASTO REALISTICO, e non è teorico: in **navigazione privata**, con i
// dati del sito bloccati, o con la quota piena, `localStorage` **alza**. Un
// `setItem` non protetto lì fermerebbe il disegno di una schermata per una
// preferenza non salvata: l'app diventerebbe inutilizzabile per non aver
// ricordato un tema. `[B]` fa alzare ogni chiamata e verifica che l'app arrivi
// comunque alla prima schermata — *è la prova che il `catch` vuoto di `magazzino.js` non
// è una distrazione ma la scelta che rende l'app usabile in privata.*
//
// IL CASO PIÙ DIVERSO (regola 42): fra le tre famiglie di chiavi, **gli
// override del Pannello Admin** — l'unica che NON andrà mai sul server, e
// l'unica letta **a tempo di parsing**, prima che esista qualunque schermata.
// Se il magazzino alzasse lì, non fallirebbe una preferenza: non partirebbe
// l'app. È il caso che `[B]` mette alla prova per primo.
//
// `[A]` SEGUE LE GRAFFE: la prima forma guardava la parola `try` sulla stessa
// riga ed era rossa su `magLeggiJson`, dove il `try {` sta tre righe sopra.
// **E le due righe coprono insiemi diversi:** `[B]` prende le chiamate che il
// boot attraversa, `[A]` anche quelle che partono solo a esercizio finito
// (`magScriviTesto`, `magCancella`). Visto fallire togliendo il `try` da
// `magScriviTesto`: **1 rossa**, e nomina la riga.
//
// ⚠️ `[C]` («ogni chiave comincia per "baseinglese:"») era vera per
// costruzione fino al 2026-10-22: raccoglieva dal codice solo le stringhe che
// cominciavano gia' per `'baseinglese:` e poi controllava che cominciassero
// cosi'. Adesso guida l'app e registra ogni `setItem` che passa.
//
// LIMITE DICHIARATO: guarda che il magazzino sia uno e che ingoi. **Non**
// verifica che i dati salvati siano giusti — quello lo fanno i test dei
// progressi e della mastery, ognuno sulla sua chiave.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi, attendiPrimaSchermata } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // ── [A] UN SOLO FILE LO TOCCA ──────────────────────────────────────
  {
    const files = fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); });
    const colpevoli = files.filter(function (f) {
      if (f === 'magazzino.js') return false;
      return righeDiCodiceDi('app', f).some(function (r) { return /\blocalStorage\s*\./.test(r); });
    });
    log('[A] Nessun file di app/ tocca localStorage, tranne magazzino.js',
      colpevoli.length === 0, colpevoli.join(', '));

    log('[A] ...e nemmeno index.html',
      !righeDiCodiceDi('index.html').some(function (r) { return /\blocalStorage\s*\./.test(r); }));

    const mag = righeDiCodiceDi('app', 'magazzino.js').join('\n');
    log('[A] magazzino.js lo tocca davvero (non e\' un file vuoto che passa la riga sopra)',
      /\blocalStorage\s*\./.test(mag));

    // ⚠️ OGNI CHIAMATA DENTRO UN TRY, E IL CONTROLLO SEGUE LE GRAFFE.
    //
    // La prima forma di questa riga guardava se la parola `try` stava **sulla
    // stessa riga**, ed era rossa su `magLeggiJson` — dove il `try {` sta tre
    // righe sopra — cioe' una misura che non misura al contrario: accusava il
    // codice giusto, e avrebbe assolto un `localStorage` scritto dopo un `try`
    // gia' chiuso.
    //
    // Serve ANCHE se [B] guida l'app con tutto che alza: [B] copre le chiamate
    // che il boot attraversa, non quelle che partono solo a esercizio finito
    // (`magScriviTesto`, `magCancella`). *Le due righe coprono insiemi diversi,
    // e la piu' debole copre quello che la piu' forte non tocca.*
    const righeMag = righeDiCodiceDi('app', 'magazzino.js');
    let prof = 0;
    const scoperte = [];
    righeMag.forEach(function (r) {
      const primaDi = /\blocalStorage\s*\./.test(r) ? r.slice(0, r.search(/\blocalStorage\s*\./)) : r;
      const apreQui = (primaDi.match(/\btry\s*\{/g) || []).length;
      prof += apreQui;
      if (/\blocalStorage\s*\./.test(r) && prof === 0) scoperte.push(r.trim().slice(0, 60));
      // le graffe della riga, tolte quelle del `try` gia' contate
      const resto = r.replace(/\btry\s*\{/g, '');
      prof -= (resto.match(/\}/g) || []).length;
      prof += (resto.match(/\{/g) || []).length - (resto.match(/\{/g) || []).length;
      if (prof < 0) prof = 0;
    });
    log('[A] ...e ogni sua chiamata e\' dentro un try', scoperte.length === 0, scoperte.join(' | '));
  }

  const browser = await launchBrowser();

  // ── [B] CON IL MAGAZZINO CHE ALZA, L'APP PARTE LO STESSO ───────────
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });

    // ⚠️ PRIMA del caricamento: gli override del Pannello Admin si leggono a
    // tempo di parsing, quindi un'installazione dopo `goto` arriverebbe tardi
    // e il caso più diverso non verrebbe provato affatto.
    await page.addInitScript(function () {
      const alza = function () { throw new Error('QuotaExceededError (finto)'); };
      try {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get: function () { return { getItem: alza, setItem: alza, removeItem: alza, clear: alza }; }
        });
      } catch (e) {}
    });

    await page.goto(APP_URL);
    let viva = true;
    try { await attendiPrimaSchermata(page, 12000); } catch (e) { viva = false; }
    log('[B] Con ogni chiamata al magazzino che ALZA, l\'app arriva comunque alla prima schermata',
      viva, errori.join(' | '));
    log('[B] ...e non lascia un solo errore JS non gestito', errori.length === 0, errori.join(' | '));

    if (viva) {
      // E si va avanti: un nome che non si puo' salvare non deve impedire di
      // usare l'app in questa sessione.
      const arrivato = await page.evaluate(function () {
        try { return typeof window.BI.magLeggiTesto === 'function' && window.BI.magLeggiTesto('qualunque') === ''; }
        catch (e) { return String(e); }
      });
      log('[B] ...e una lettura impossibile torna il valore vuoto invece di propagare',
        arrivato === true, String(arrivato));
    }
    await page.close();
  }

  // ── [C] OGNI CHIAVE CHE L'APP SCRIVE DAVVERO COMINCIA PER "baseinglese:"
  //
  // ⚠️ RISCRITTO IL 2026-10-22. La forma di prima raccoglieva dal CODICE solo
  // le stringhe che cominciavano gia' per `'baseinglese:` e poi controllava
  // che cominciassero cosi': vera per costruzione, e una chiave nuda — o una
  // composta a pezzi — non la faceva cadere. Adesso si guida l'app come uno
  // studente (nome, mappa, Personalizza completata: identita', episodio,
  // progressi, slot) e si registra OGNI `setItem` che passa: la domanda e'
  // «cosa finisce nel magazzino», e la risposta la da' il magazzino.
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await page.addInitScript(function () {
      window.__chiaviScritte = [];
      const vero = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) { window.__chiaviScritte.push(String(k)); return vero.call(this, k, v); };
    });
    await page.goto(APP_URL);
    await page.evaluate(function () { localStorage.clear(); window.__chiaviScritte = []; });
    await page.reload();
    await attendiPrimaSchermata(page);
    await page.fill('#name-input', 'Magazzino');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible', timeout: 15000 });
    await page.click('#go-episode');
    // Uno studente nuovo trova prima l'introduzione della mappa, e la chiude.
    await page.waitForSelector('#map-intro-start-btn', { state: 'visible', timeout: 15000 });
    await page.click('#map-intro-start-btn');
    await page.waitForSelector('[data-module="personalizzazione"]', { state: 'visible', timeout: 15000 });
    await page.click('[data-module="personalizzazione"]');
    // ...e poi quella di Personalizza.
    await page.waitForSelector('#customize-intro-start-btn', { state: 'visible', timeout: 15000 });
    await page.click('#customize-intro-start-btn');
    await page.waitForFunction(function () { const g = document.getElementById('slot-grid'); return g && g.children.length > 0; }, null, { timeout: 15000 });
    await page.click('#start-episode');
    // L'ultimo effetto del gesto: la mappa di nuovo attiva (regola 44).
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    const scritte = await page.evaluate(function () { return window.__chiaviScritte.slice(); });
    const distinte = scritte.filter(function (c, i) { return scritte.indexOf(c) === i; });
    const nude = distinte.filter(function (c) { return c.indexOf('baseinglese:') !== 0; });
    console.log('    chiavi scritte guidando l\'app: ' + distinte.length);
    log('[C] Guidando l\'app si scrive davvero nel magazzino (almeno tre chiavi: senza, la riga sotto non direbbe niente)',
      distinte.length >= 3, distinte.join(', '));
    log('[C] Ogni chiave scritta comincia per "baseinglese:" (nessun nome nudo nel magazzino di qualcun altro)',
      nude.length === 0, nude.join(', '));
    log('[C] ...e il giro non lascia errori JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('');
  console.log('=== MAGAZZINO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
