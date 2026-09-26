// PROTEGGE: che si possa avere PIÙ DI UNA sequenza di moduli, sceglierne una
// per episodio e modificarne una qualsiasi dal Pannello Admin — e che una
// sequenza aggiunta al file non sparisca per colpa di un override salvato prima.
//
// COSA SI PERDE SENZA QUESTO FILE. Il meccanismo «un episodio dichiara la sua
// sequenza per nome» esiste dal passo 1.11b, ma fino al 2026-09-20 era
// **irraggiungibile da chi non apre il file**: il pannello sapeva modificare
// solo la sequenza dell'episodio aperto, e il campo che la sceglie era una
// casella di testo che si salvava senza ricaricare. Tre difese nascono qui
// insieme, e nessuna delle tre lascia un rosso quando si rompe.
//
// ⚠️ L'ASSERZIONE CHE CONTA È LA [A], non le altre.
//
// Le [B] e le [C] guardano l'interfaccia: che il campo sia un menu, che il
// menu elenchi i nomi veri, che scegliere cambi le righe. Sono vere il giorno
// in cui si scrivono e restano vere. **La [A] guarda il guasto che si presenta
// da solo, mesi dopo, sul browser di chi ha usato il pannello una volta.**
//
// COME LA [A] DISTINGUE. Un override salvato quando esisteva UNA sequenza
// contiene, sotto `sequences`, solo quella. La forma vecchia sostituiva la
// chiave intera:
//
//     file      → { narrativo-standard, prova-corta }
//     override  → { narrativo-standard }
//     risultato → { narrativo-standard }        ← prova-corta SPARITA
//
// e l'episodio che chiedesse `prova-corta` finirebbe sulla schermata d'errore
// **con il file giusto sul disco**. La forma nuova fonde, e tutte e due
// restano. *Il test installa esattamente quell'override con `addInitScript`,
// cioè prima che l'app parta: è l'unico istante in cui si può.*
//
// IL CASO PIÙ DIVERSO (regola 42): `speech`. Non è la chiave più complicata —
// è **l'unica scritta da DUE sorgenti**: `app/config.js` le dà velocità e voci,
// `struttura-corso.json` le due lingue (via `applicaStruttura`). Tutte le altre
// chiavi hanno un solo scrittore, quindi su di loro fondere e sostituire si
// distinguono solo quando il file cresce; su `speech` si distinguono **subito**,
// perché un override che porta una sola sotto-chiave ne cancellava tre. La [A3]
// la guida.
//
// LIMITE DICHIARATO: questo file non verifica che il Pannello Admin sappia
// CREARE o CANCELLARE una sequenza — non lo sa fare, per scelta, e il magazzino
// si riempie a mano nel file dell'edizione. Verifica che sappia sceglierle e
// modificarle.

// ⚠️ I SELETTORI DELLE RIGHE DI RIORDINO SONO AMBITI DAL LORO CONTENITORE, dal
// 2026-09-26, e non e' uno stile di scrittura: dal passo della lista degli
// EPISODI la classe `.config-module-order-row` la portano DUE liste — quella
// dei moduli e quella degli episodi — perche' il CSS e' condiviso e non
// duplicato (regola 11). Una `querySelectorAll('.config-module-order-row')`
// nuda conta quindi le righe di tutte e due: **questo file e'
// andato rosso con «24 righe» dove i moduli sono 22.**
//
// *Il test non era sbagliato: era giusto finche' quella classe voleva dire una
// cosa sola. E' la forma del commento che invecchia perche' cambia il mondo
// intorno, non il codice che descrive — qui applicata a un SELETTORE.*
//
// Si scrive `.config-module-order-list .config-module-order-row`: il
// contenitore dice di quale delle due liste si parla, e lo dira' anche alla
// terza.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, strutturaCorso } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const CHIAVE_OVERRIDE = 'baseinglese:configOverrides';

// Il finto del browser sta in un posto solo dal 2026-09-24 (passo F.4):
// stesso nucleo di prima, stessi parametri. Vedi tests/mock-browser.js.
const { mockBrowser } = require('./mock-browser');
const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });

async function apri(page, utente, override) {
  await page.addInitScript(function (d) {
    if (d.ov) { try { localStorage.setItem(d.chiave, JSON.stringify(d.ov)); } catch (e) {} }
  }, { ov: override || null, chiave: CHIAVE_OVERRIDE });
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
}

// Apre il Pannello Admin digitando `config` fuori da un campo di testo, che è
// la strada vera — non un'API interna che il pannello espone ai test.
async function apriPannello(page) {
  for (const ch of 'config') await page.keyboard.press(ch);
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 15000 });
}

// Apre il gruppo `<details>` che porta quel nome.
async function apriGruppo(page, nome) {
  await page.evaluate(function (n) {
    const g = Array.from(document.querySelectorAll('#config-panel-body .config-group'))
      .find(d => d.querySelector('summary') && d.querySelector('summary').textContent === n);
    if (g) g.open = true;
  }, nome);
}

async function run() {
  const browser = await launchBrowser();
  const struttura = strutturaCorso();
  const nomiNelFile = Object.keys(struttura.sequences);

  log('[0] Il file dell\'edizione porta più di una sequenza',
    nomiNelFile.length >= 2, nomiNelFile.join(', '));

  // ── [A] UN OVERRIDE VECCHIO NON NASCONDE UNA SEQUENZA NUOVA ──────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);

    // L'override che qualcuno avrebbe salvato quando la sequenza era una:
    // porta SOLO `narrativo-standard`, riordinata.
    const soloUna = JSON.parse(JSON.stringify(struttura.sequences['narrativo-standard']));
    const primo = soloUna.shift();
    soloUna.push(primo);

    await apri(page, 'SeqMerge', { sequences: { 'narrativo-standard': soloUna } });

    const dopo = await page.evaluate(() => Object.keys(window.APP_CONFIG.sequences));
    log('[A] Una sequenza che sta nel file NON sparisce per un override salvato prima',
      nomiNelFile.every(n => dopo.indexOf(n) !== -1), 'nel file: ' + nomiNelFile.join(',') + ' — in APP_CONFIG: ' + dopo.join(','));

    const riordinata = await page.evaluate(() => window.APP_CONFIG.sequences['narrativo-standard'][0].module);
    log('[A] ...e l\'override continua a vincere sulla sequenza che tocca',
      riordinata === soloUna[0].module, riordinata + ' invece di ' + soloUna[0].module);

    // [A3] il caso più diverso: l'unica chiave con due scrittori.
    log('[A3] `speech`: un override parziale non cancella le lingue che arrivano dal file',
      await page.evaluate(() => {
        const s = window.APP_CONFIG.speech;
        return !!(s && s.recognitionLang && s.synthesisLang && Array.isArray(s.rateOptions));
      }), 'una delle tre sorgenti di speech è sparita');

    log('[A] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [B] LA SEQUENZA DI UN EPISODIO SI SCEGLIE DA UN MENU ─────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apri(page, 'SeqMenu', null);
    await apriPannello(page);
    await apriGruppo(page, 'episodes');

    const campo = await page.evaluate(() => {
      const el = document.querySelector('[data-config-path="episodes.gate.sequence"]');
      if (!el) return null;
      return {
        tag: el.tagName,
        ricarica: el.hasAttribute('data-config-reload'),
        opzioni: Array.from(el.options).map(o => o.value),
        scelta: el.value
      };
    });

    log('[B] Il campo esiste', campo !== null, 'nessun campo episodes.gate.sequence nel pannello');
    log('[B] È un MENU, non una casella di testo', campo && campo.tag === 'SELECT', campo && campo.tag);
    log('[B] Elenca le sequenze che esistono davvero',
      campo && nomiNelFile.every(n => campo.opzioni.indexOf(n) !== -1),
      campo && campo.opzioni.join(','));
    // ⚠️ Senza il ricaricamento il menu è una manopola muta: si salva e la
    // mappa resta quella di prima, perché i passi si costruiscono all'avvio.
    log('[B] Ricarica la pagina quando cambia', campo && campo.ricarica === true, 'manca data-config-reload');
    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [B2] UN NOME CHE NON ESISTE RESTA VISIBILE, non sparisce ─────────
  //
  // Un <select> il cui valore non è fra le opzioni mostra la PRIMA, e al
  // primo salvataggio cambierebbe in silenzio la sequenza dell'episodio.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apri(page, 'SeqFantasma', { episodes: { gate: { sequence: 'non-esiste-questa' } } });
    await apriPannello(page);
    await apriGruppo(page, 'episodes');

    const scelta = await page.evaluate(() => {
      const el = document.querySelector('[data-config-path="episodes.gate.sequence"]');
      return el ? { valore: el.value, testo: el.options[el.selectedIndex].textContent } : null;
    });
    log('[B2] Una sequenza che non esiste resta selezionata invece di cambiare da sola',
      scelta && scelta.valore === 'non-esiste-questa', scelta && scelta.valore);
    log('[B2] ...e il menu dice che non esiste',
      scelta && /non esiste/.test(scelta.testo), scelta && scelta.testo);
    await page.close();
  }

  // ── [C] SI SCEGLIE QUALE SEQUENZA MODIFICARE ─────────────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apri(page, 'SeqPick', null);
    await apriPannello(page);
    await apriGruppo(page, 'sequences');

    const partenza = await page.evaluate(() => {
      const sel = document.querySelector('[data-sequence-pick]');
      return sel ? { scelta: sel.value, opzioni: Array.from(sel.options).map(o => o.value),
                     righe: document.querySelectorAll('.config-module-order-list .config-module-order-row').length } : null;
    });
    log('[C] Il menu «quale sequenza sto modificando» c\'è', partenza !== null, 'nessun [data-sequence-pick]');
    log('[C] Parte dalla sequenza dell\'episodio aperto',
      partenza && partenza.scelta === 'narrativo-standard', partenza && partenza.scelta);
    log('[C] Mostra le righe di quella sequenza',
      partenza && partenza.righe === struttura.sequences['narrativo-standard'].length,
      partenza && String(partenza.righe));

    const altra = nomiNelFile.find(n => n !== 'narrativo-standard');
    await page.selectOption('[data-sequence-pick]', altra);
    const dopo = await page.evaluate(() => ({
      scelta: document.querySelector('[data-sequence-pick]').value,
      righe: document.querySelectorAll('.config-module-order-list .config-module-order-row').length,
      avviso: !!document.querySelector('.config-field-hint')
    }));
    log('[C] Scegliendone un\'altra cambiano le righe',
      dopo.righe === struttura.sequences[altra].length,
      dopo.righe + ' righe invece di ' + struttura.sequences[altra].length);
    log('[C] ...e il menu resta su quella scelta', dopo.scelta === altra, dopo.scelta);
    // ⚠️ Senza l'avviso, modificare la sequenza di un altro episodio sembra
    // non aver funzionato: si salva, ma in mappa non si vede.
    log('[C] ...e dice che questo episodio non la usa', dopo.avviso === true, 'nessun avviso');
    log('[C] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C2] IL RIORDINO FINISCE SULLA SEQUENZA SCELTA, non sull'altra ───
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apri(page, 'SeqScrive', null);
    await apriPannello(page);
    await apriGruppo(page, 'sequences');

    const altra = nomiNelFile.find(n => n !== 'narrativo-standard');
    await page.selectOption('[data-sequence-pick]', altra);
    await page.click('.config-module-order-list .config-module-order-row:nth-child(2) [data-order-move="up"]');

    const esito = await page.evaluate(function (d) {
      const ov = JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}');
      return {
        altraPrimo: window.APP_CONFIG.sequences[d.altra][0].module,
        narrativoPrimo: window.APP_CONFIG.sequences['narrativo-standard'][0].module,
        salvate: Object.keys((ov.sequences) || {})
      };
    }, { altra: altra });

    log('[C2] Il riordino ha toccato la sequenza SCELTA',
      esito.altraPrimo === struttura.sequences[altra][1].module, esito.altraPrimo);
    log('[C2] ...e NON quella dell\'episodio aperto',
      esito.narrativoPrimo === struttura.sequences['narrativo-standard'][0].module, esito.narrativoPrimo);
    log('[C2] Il salvataggio porta con sé tutte le sequenze, non solo quella toccata',
      nomiNelFile.every(n => esito.salvate.indexOf(n) !== -1), esito.salvate.join(','));
    log('[C2] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== SELETTORI SEQUENZA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
