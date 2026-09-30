// PROTEGGE: che la SECONDA edizione — `spagnolo/it`, trascritta il 2026-09-30 —
// si apra davvero: l'app puntata a lei parte senza schermata d'errore, mostra
// gli episodi che la SUA struttura dichiara col loro nome, legge i SUOI file,
// e riempie ogni battuta e ogni skill senza lasciare segnaposto o «undefined».
//
// COSA SI PERDE SENZA QUESTO FILE. Tutto quello che il progetto ha scritto sui
// livelli e sulle cartelle — le chiavi-ruolo, i suffissi-ruolo, gli episodi
// dalla struttura, i testi condivisi per lingua dello studente — resta
// ragionamento finche' una seconda edizione non gira. Il resto della suite
// guida SOLO l'inglese: un difetto che scatta solo quando la lingua insegnata
// non e' l'inglese passerebbe verde su tutti gli altri file.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): `aircraft-door` spagnolo. E' il secondo
// episodio della lista (quello che il passo 2 poteva far sparire o
// raddoppiare), ha UN solo slot contro gli otto di `gate`, e legge il
// cognome scelto in un altro episodio.
//
// COSA NON PROTEGGE, dichiarato (regola 32): la voce. Il finto sintetizzatore
// non sa parlare spagnolo; che la voce del browser sia spagnola lo dice il
// passo 3 della coda, non questo file. Qui si guarda solo che la lingua
// chiesta sia quella dell'edizione.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, attendiPrimaSchermata } = require('./test-env');
const { openModule } = require('./map-driver');
const { mockBrowser } = require('./mock-browser');
const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Gli attesi si leggono dalla fonte, non si scrivono qui (regola 4): se domani
// l'episodio cambia nome, il test lo segue.
const STRUTTURA = 'data/spagnolo/it/spagnolo-it-struttura-corso.json';
const esisteStruttura = fs.existsSync(repoPath(STRUTTURA));

async function run() {
  // Regola 49: senza la struttura non c'e' niente da provare, e lo si dice.
  log('[A] L\'edizione spagnola c\'e\' sul disco (' + STRUTTURA + ')', esisteStruttura);
  if (!esisteStruttura) { finisci(); return; }
  const struttura = JSON.parse(fs.readFileSync(repoPath(STRUTTURA), 'utf8'));
  const dichiarati = struttura.episodeSequences[struttura.episodeSequence];

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.evaluate(function () {
    localStorage.clear();
    localStorage.setItem('baseinglese:configOverrides',
      JSON.stringify({ edizione: { lingua: 'spagnolo', studente: 'it' } }));
  });
  await page.reload();
  await attendiPrimaSchermata(page);
  const erroreAvvio = await page.evaluate(() => {
    const v = document.getElementById('view-error');
    return !!(v && v.classList.contains('is-active'));
  });
  log('[A] Puntata allo spagnolo, l\'app parte senza schermata d\'errore', !erroreAvvio);
  if (erroreAvvio) { await browser.close(); finisci(); return; }

  await page.fill('#name-input', 'Spagnolo');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });

  // ── [B] La lista degli episodi è quella della struttura spagnola ──
  await page.click('#go-episodes-list');
  await page.waitForSelector('#episode-list .module-row', { state: 'visible', timeout: 15000 });
  const lista = await page.evaluate(() => Array.from(document.querySelectorAll('#episode-list .module-row'))
    .map(r => ({ id: r.getAttribute('data-episode'), testo: r.textContent })));
  log('[B] La lista ha gli episodi che la struttura spagnola dichiara, in quell\'ordine',
    lista.map(r => r.id).join(',') === dichiarati.join(','), lista.map(r => r.id).join(','));
  log('[B] ...ognuno col nome che la struttura gli da\'',
    lista.every(r => r.testo.indexOf(struttura.episodes[r.id].nome) !== -1),
    lista.map(r => r.testo.trim().slice(0, 40)).join(' | '));

  const stato = await page.evaluate(() => ({
    lingua: window.APP_CONFIG.speech.synthesisLang,
    files: Object.keys(window.BI.EPISODES).map(id => window.BI.EPISODES[id].dataFile)
  }));
  log('[B] La lingua chiesta alla voce e\' quella dell\'edizione, non l\'inglese',
    stato.lingua === struttura.speech.synthesisLang, stato.lingua);
  log('[B] Ogni episodio legge il file SPAGNOLO',
    stato.files.length === dichiarati.length && stato.files.every(f => /data\/spagnolo\/it\/spagnolo-it-/.test(f)),
    stato.files.join(', '));

  // ── [C] Ogni battuta e ogni skill si riempiono, in tutti e due gli episodi ──
  for (const id of dichiarati) {
    // Un guasto qui (un file dell'edizione che non arriva) diventa un rosso CON
    // IL NOME, non un'eccezione che uccide il file senza dire quale episodio.
    try {
    // ⚠️ SI APRE DAL CODICE, NON DALLA RIGA: il secondo episodio e' bloccato
    // finche' il primo non e' finito (e' lo Sblocco Sequenziale, regola 30), e
    // qui non si prova lo sblocco — lo prova `test_lista_episodi.js`. Si
    // prova che il suo CONTENUTO si riempia.
    await page.evaluate((epId) => {
      window.BI.impostaEpisodioCorrente(window.BI.EPISODES[epId]);
      window.BI.openEpisodeMap();
    }, id);
    const intro = await page.$('#map-intro-start-btn');
    if (intro) await intro.click().catch(() => {});
    await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
    // Personalizza costruisce gli slot: senza, `fillTemplate` non ha le opzioni.
    await openModule(page, 'personalizzazione');
    await page.waitForFunction(() => document.querySelectorAll('#view-customize select, #view-customize input').length > 0,
      { timeout: 15000 });
    const testi = await page.evaluate(async function () {
      const ep = window.BI.episodioCorrente();
      const v = window.BI.valoriCorrenti();
      const dati = await window.BI.loadEpisodeData({ dataFile: ep.dataFile });
      const fuori = [];
      ['A', 'B', 'C', 'D'].forEach(function (g) {
        dati.levels[g].items.forEach(function (it) {
          fuori.push(window.BI.fillTemplate(it.target, ep, v, 'target'));
          fuori.push(window.BI.fillTemplate(it.native, ep, v, 'native'));
          (it.whatYouLearn || []).forEach(function (s) {
            fuori.push(window.BI.fillTemplate(s.body, ep, v, 'native'));
          });
        });
      });
      return { episodio: ep.id, testi: fuori };
    });
    const guasti = testi.testi.filter(t => t.indexOf('{{') !== -1 || /undefined/.test(t));
    log('[C] ' + testi.episodio + ': ' + testi.testi.length + ' testi riempiti, nessun segnaposto rimasto e nessun «undefined»',
      testi.episodio === id && testi.testi.length > 0 && guasti.length === 0, guasti.slice(0, 3).join(' | '));
    } catch (e) {
      const schermataErrore = await page.evaluate(() => {
        const v = document.getElementById('view-error');
        return v && v.classList.contains('is-active') ? v.textContent.trim().slice(0, 120) : null;
      }).catch(() => null);
      log('[C] ' + id + ': il contenuto si apre e si riempie', false,
        (schermataErrore ? 'schermata d\'errore: ' + schermataErrore + ' · ' : '') + e.message.split('\n')[0]);
    }
  }

  log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await browser.close();
  finisci();
}

function finisci() {
  console.log('\n=== EDIZIONE SPAGNOLA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
