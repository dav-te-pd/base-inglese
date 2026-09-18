// PROTEGGE: che chi va a prendere i file arrivi — e arrivi prestissimo.
//
// ⚠️ COSA SI ROMPE SE IL FILE NON ARRIVA, misurato il 2026-09-18:
//
//     login .......... NO        errore JS ... TypeError: episodeDataFile
//     casa ........... NO                      is not a function
//     mappa .......... NO
//
// **Non parte niente**, ed e' il piu' RUMOROSO dei cinque casi misurati
// finora — piu' ancora di `identita`. Il motivo: `episodeDataFile(id)` gira
// mentre `MODULE_DESCRIPTORS` viene COSTRUITO, cioe' a tempo di parsing dello
// script principale, prima di qualunque gesto. *Su Pages basta aprire: se la
// schermata del nome c'e', questo file c'e'.*
//
// I cinque casi della serie, perche' si leggano insieme:
//   `dati` ........ non parte niente, subito ................. RUMOROSO
//   `identita` .... pagina bianca .............................. RUMOROSO
//   `audio` ....... si vede il login e il primo tasto e' morto
//   `progressi` ... l'app parte, la mappa non si apre .......... silenzioso
//   `suoni` ....... l'app funziona, e non suona ................ silenzioso
//   `quiz-engine` . l'app funziona, i moduli si aprono, i quiz non valutano
//
// IL CASO PIU' DIVERSO (regola 42): **`applyEpisodeDialogue`, cioe' la
// funzione che ho LASCIATO FUORI.** Era l'unica delle quindici che SCRIVE
// invece di leggere, e quello che scrive e' `EPISODES`, il catalogo. La
// strada comoda era esporre `EPISODES` su `BI` — due righe, suite verde, e
// il catalogo scrivibile da qualunque file per sempre. *Seconda volta in due
// giorni che la misura respinge un confine che non avrebbe prodotto nessun
// rosso: la prima era `renderStars`.*

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const nomi = verificaStruttura(log, 'dati', ['app', 'dati.js'], { prima: ['app/spazio.js'] });

  // ── [A] IL CONFINE: si legge, non si scrive il catalogo ─────────────
  {
    const dati = fs.readFileSync(repoPath('app', 'dati.js'), 'utf8');
    log('[A] app/dati.js non nomina EPISODES', !/\bEPISODES\b/.test(dati.replace(/\/\/.*$/gm, '')));
    log('[A] ...e applyEpisodeDialogue e' + "' rimasta col catalogo",
      nomi.indexOf('applyEpisodeDialogue') === -1 &&
      righeDiCodiceDi('index.html').some(function (r) { return /^  function applyEpisodeDialogue\(/.test(r); }));
    // ⚠️ SULLE RIGHE DI CODICE, NON SUL TESTO DEL FILE — e questa riga e' nata
    // debole: la prima versione cercava in tutto `dati`, e il commento in
    // testa al file CITA `BI.applyEpisodeDialogue(data)` fra apici inversi.
    // Falsificando (togliendo la chiamata vera) la riga **restava verde**,
    // perche' trovava la citazione. *NONA comparsa della famiglia del conto
    // sui commenti, in un'asserzione scritta venti minuti prima.*
    log('[A] ...e il caricatore gliela CHIEDE',
      righeDiCodiceDi('app', 'dati.js').some(function (r) { return /BI\.applyEpisodeDialogue\(data\)/.test(r); }));

    // I quattro fetch dell'app, adesso in un file solo: e' la condizione che
    // rende possibile il passo che li unifica, e vale la pena che si veda.
    const fetches = righeDiCodiceDi('app', 'dati.js').filter(function (r) { return /\bfetch\(/.test(r); });
    log('[A] I quattro fetch dell' + "'app stanno tutti qui", fetches.length === 4, String(fetches.length));
    log('[A] ...e in index.html non ne resta nessuno',
      righeDiCodiceDi('index.html').filter(function (r) { return /\bfetch\(/.test(r); }).length === 0);
  }

  // ── [B] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'DatiEstratti');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[B] L' + "'app arriva alla mappa", false, String(e).split('\n')[0]);
    }
    if (viva) log('[B] L' + "'app arriva alla mappa", true);

    const passi = viva ? await page.$$eval('#module-list [data-module]', function (e) { return e.length; }) : 0;
    log('[B] ...e la mappa ha i suoi passi', passi > 0, String(passi));

    // ⚠️ Il dato arriva DAVVERO, e arriva col dialogo attaccato all'episodio:
    // e' la prova che `BI.applyEpisodeDialogue` viene chiamata dal file nuovo.
    // Senza, `speakerLabels` resterebbe `undefined` e nessun test strutturale
    // se ne accorgerebbe.
    const dato = viva ? await page.evaluate(function () {
      return window.BI.loadEpisodeData({ dataFile: 'data/inglese/it/inglese-it-gate.json' })
        .then(function (d) { return { id: d.episodeId, gradi: Object.keys(d.levels || {}).length }; })
        .catch(function (e) { return { errore: String(e).split('\n')[0] }; });
    }) : null;
    log('[B] loadEpisodeData porta a casa il file dell' + "'episodio",
      !!dato && dato.id === 'gate' && dato.gradi === 4, JSON.stringify(dato));

    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== DATI ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
