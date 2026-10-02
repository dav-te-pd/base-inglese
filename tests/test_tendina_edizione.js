// PROTEGGE: che l'edizione si scelga dal Pannello Admin con un MENU delle edizioni che esistono — scritte dal trascrittore in `data/edizioni.json` — e non scrivendo a mano due caselle di testo, e che quel menu sia l'uscita anche quando l'app è murata su un'edizione che non esiste.
//
// Prima del 2026-10-02 `edizione.lingua` ed `edizione.studente` erano due
// caselle libere: una lettera sbagliata murava l'app sulla schermata d'errore,
// e si poteva salvare mezza coppia.
//
// COME:
//   [A] `data/edizioni.json` è quello che il trascrittore ricava da `docs/`
//       adesso (edizioni scoperte + riga `corso` della §9), e ogni edizione
//       elencata ha davvero la sua struttura sul disco;
//   [B] il gruppo `edizione` del pannello ha un menu con quelle edizioni, coi
//       loro nomi, e nessuna casella di testo;
//   [C] scegliere lo spagnolo dal menu ricarica l'app sullo spagnolo;
//   [D] ⚠️ IL CASO PIÙ DIVERSO (regola 42): l'app MURATA su un'edizione che
//       non esiste. È l'unico in cui la struttura non arriva, quindi il
//       pannello si apre senza `nomiASchermo`, senza episodi e senza testi —
//       e il menu deve funzionare lo stesso: mostra l'edizione salvata come
//       «non esiste», e sceglierne una vera fa ripartire l'app.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');
const trascrivi = require('./tools/trascrivi.js');

const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const ELENCO = 'data/edizioni.json';

// Apre il pannello con `?config`, apre il gruppo `edizione` e aspetta che il
// menu sia acceso (cioè che l'elenco sia arrivato) o che dica di no.
async function apriMenuEdizione(page) {
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 15000 });
  await page.evaluate(() => {
    const g = Array.from(document.querySelectorAll('#config-panel-body .config-group'))
      .find(d => d.querySelector('summary').textContent === 'edizione');
    if (g) g.open = true;
  });
  await page.waitForFunction(() => {
    const m = document.getElementById('cfg-edizione');
    const err = m && m.parentElement.querySelector('.config-field-error');
    return m && (!m.disabled || (err && !err.hidden));
  }, null, { timeout: 15000 });
  return page.evaluate(() => {
    const m = document.getElementById('cfg-edizione');
    const g = m.closest('.config-group');
    return {
      opzioni: Array.from(m.options).map(o => ({ valore: o.value, testo: o.textContent, scelta: o.selected })),
      acceso: !m.disabled,
      caselle: g.querySelectorAll('input[type=text]').length
    };
  });
}

async function nuovaPagina(browser, override) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.evaluate(function (o) {
    localStorage.clear();
    if (o) localStorage.setItem('baseinglese:configOverrides', JSON.stringify(o));
  }, override || null);
  return { page, errori };
}

async function run() {
  // ── [A] Il file è quello che il trascrittore ricava adesso ──
  const esiste = fs.existsSync(repoPath(ELENCO));
  log('[A] ' + ELENCO + ' c\'è sul disco', esiste);
  if (!esiste) return finisci();
  const suDisco = JSON.parse(fs.readFileSync(repoPath(ELENCO), 'utf8'));
  const atteso = trascrivi.elencoEdizioni(trascrivi.edizioni().map(ed => ({ ed, corso: trascrivi.struttura(ed).nomiASchermo.corso })));
  log('[A] È identico a quello che il trascrittore ricava da docs/ adesso',
    JSON.stringify(suDisco) === JSON.stringify(atteso), JSON.stringify(suDisco.edizioni.map(e => e.lingua + '/' + e.studente)));
  log('[A] Ogni edizione elencata ha la sua struttura sul disco, e un nome',
    suDisco.edizioni.length > 1 && suDisco.edizioni.every(e => e.corso &&
      fs.existsSync(repoPath('data', e.lingua, e.studente, e.lingua + '-' + e.studente + '-struttura-corso.json'))));
  const spagnolo = suDisco.edizioni.find(e => e.lingua === 'spagnolo');
  log('[A] Lo spagnolo è fra le edizioni', !!spagnolo);
  if (!spagnolo) return finisci();

  const browser = await launchBrowser();

  // ── [B] + [C] Il menu, e la scelta ──
  {
    const { page, errori } = await nuovaPagina(browser);
    await page.goto(APP_URL + '?config');
    await attendiPrimaSchermata(page);
    try {
      const m = await apriMenuEdizione(page);
      log('[B] Il menu è acceso ed elenca le edizioni del file, coi loro nomi',
        m.acceso && m.opzioni.length === suDisco.edizioni.length &&
        suDisco.edizioni.every(e => m.opzioni.some(o => o.valore === e.lingua + '/' + e.studente && o.testo.indexOf(e.corso) === 0)),
        JSON.stringify(m.opzioni));
      log('[B] ...ed è scelta quella in uso, l\'inglese', (m.opzioni.find(o => o.scelta) || {}).valore === 'inglese/it');
      log('[B] Nel gruppo non c\'è più nessuna casella di testo', m.caselle === 0, String(m.caselle));

      await Promise.all([
        page.waitForNavigation({ timeout: 15000 }),
        page.selectOption('#cfg-edizione', 'spagnolo/it')
      ]);
      await attendiPrimaSchermata(page);
      const dopo = await page.evaluate(() => ({
        edizione: window.APP_CONFIG.edizione,
        corso: window.APP_CONFIG.nomiASchermo && window.APP_CONFIG.nomiASchermo.corso,
        errore: !!document.querySelector('#view-error.is-active')
      }));
      log('[C] Scegliere lo spagnolo ricarica l\'app sullo spagnolo, con le due metà della coppia',
        dopo.edizione.lingua === 'spagnolo' && dopo.edizione.studente === 'it' && dopo.corso === spagnolo.corso && !dopo.errore,
        JSON.stringify(dopo));
    } catch (e) {
      log('[B] Il menu dell\'edizione si apre e si usa', false, e.message.split('\n')[0]);
    }
    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [D] L'app murata: il menu è l'uscita ──
  {
    const { page, errori } = await nuovaPagina(browser, { edizione: { lingua: 'inglese', studente: 'zz' } });
    await page.goto(APP_URL + '?config');
    try {
      await page.waitForSelector('#view-error.is-active', { timeout: 15000 });
      const m = await apriMenuEdizione(page);
      const scelta = m.opzioni.find(o => o.scelta) || {};
      log('[D] Con l\'app murata il menu si accende lo stesso, e dice che l\'edizione salvata non esiste',
        m.acceso && scelta.valore === 'inglese/zz' && /non esiste/.test(scelta.testo), JSON.stringify(m.opzioni));
      await Promise.all([
        page.waitForNavigation({ timeout: 15000 }),
        page.selectOption('#cfg-edizione', 'inglese/it')
      ]);
      await attendiPrimaSchermata(page);
      const dopo = await page.evaluate(() => ({
        edizione: window.APP_CONFIG.edizione,
        errore: !!document.querySelector('#view-error.is-active')
      }));
      log('[D] Sceglierne una vera fa ripartire l\'app, senza schermata d\'errore',
        dopo.edizione.studente === 'it' && !dopo.errore, JSON.stringify(dopo));
    } catch (e) {
      log('[D] Il menu è l\'uscita dall\'app murata', false, e.message.split('\n')[0]);
    }
    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  finisci();
}

function finisci() {
  console.log('\n=== TENDINA EDIZIONE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
