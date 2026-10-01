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

  // ── [E] I testi dell'app che erano nel codice vengono dai file — passo 4 ──
  //
  // Prima del 2026-10-01 lo studente di spagnolo leggeva «INGLESE → ITALIANO»
  // sopra ogni Match e «Base Inglese» nei badge. Gli attesi si leggono dalla
  // fonte (struttura spagnola e file dei testi), non si scrivono qui.
  const testiCondivisi = JSON.parse(fs.readFileSync(repoPath('data/condivisi/it/it-istruzioni-moduli.json'), 'utf8'));
  try {
    await page.evaluate(() => window.BI.goHome());
    await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
    const schermo = await page.evaluate(() => ({
      badge: (document.querySelector('#view-home [data-nome="corso"]') || {}).textContent,
      titolo: document.title,
      nomeApp: window.APP_CONFIG.nomeApp,
      enIt: window.BI.etichettaDirezione('en-it'),
      itEn: window.BI.etichettaDirezione('it-en')
    }));
    const n = struttura.nomiASchermo;
    log('[E] Il badge della home dice il nome del CORSO spagnolo',
      schermo.badge === n.corso, JSON.stringify(schermo.badge));
    log('[E] Il titolo della pagina è il nome dell\'APP', !!schermo.nomeApp && schermo.titolo === schermo.nomeApp,
      schermo.titolo + ' | ' + schermo.nomeApp);
    log('[E] La scritta della direzione usa i nomi spagnoli, in maiuscolo',
      schermo.enIt === (n.target + ' → ' + n.native).toUpperCase() && schermo.itEn === (n.native + ' → ' + n.target).toUpperCase(),
      schermo.enIt + ' | ' + schermo.itEn);

    // La mappa: il verso «es→it» nei nomi dei moduli è rimpicciolito come «en→it».
    await page.evaluate(() => {
      window.BI.impostaEpisodioCorrente(window.BI.EPISODES.gate);
      window.BI.openEpisodeMap();
    });
    const intro = await page.$('#map-intro-start-btn');
    if (intro) await intro.click().catch(() => {});
    await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
    const versi = await page.evaluate(() => Array.from(document.querySelectorAll('#module-list .module-name-direction'))
      .map(e => e.textContent));
    log('[E] Nella mappa il verso «es→it» è staccato dal nome, come «en→it»',
      versi.length > 0 && versi.every(v => /^(es→it|it→es)$/.test(v)), versi.join(','));

    // ⚠️ IL CASO PIÙ DIVERSO DEL PASSO (regola 42): l'etichetta della regola
    // generale. È l'unica scritta che non sta nella struttura dell'edizione ma
    // nel file condiviso fra le edizioni — e la regola generale spagnola usa il
    // grassetto, quindi è anche l'unica che passa da `html()`.
    // ⚠️ SI APRE DAL CODICE, NON DALLA RIGA: Repeat Aloud viene dopo
    // Personalizza, che qui è aperta e non finita, quindi la riga è spenta
    // (Sblocco Sequenziale, regola 30). Qui si prova l'etichetta, non lo sblocco.
    await page.evaluate(() => {
      const m = window.BI.episodioCorrente().modules.find(x => x.id === 'repeatAloud');
      window.BI.openModuleFromMap(m);
    });
    // L'intro del modulo usa lo STESSO riquadro per «Un consiglio»: si guarda il
    // corpo del modulo, dove sta la regola generale.
    await page.waitForSelector('#repeat-aloud-body .note-box-label', { state: 'attached', timeout: 15000 });
    const regola = await page.evaluate(() => {
      const box = document.querySelector('#repeat-aloud-body .note-box');
      return { etichetta: box.querySelector('.note-box-label').textContent, strong: !!box.querySelector('strong') };
    });
    log('[E] La regola generale porta l\'etichetta del file dei testi',
      regola.etichetta === testiCondivisi.condivisi.etichettaRegolaGenerale, JSON.stringify(regola.etichetta));
    log('[E] ...e il suo grassetto è un <strong>, non asterischi', regola.strong);
  } catch (e) {
    log('[E] I testi dell\'app vengono dai file', false, e.message.split('\n')[0]);
  }

  log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await page.close();

  // ── [F] Il nome dell'APP c'è PRIMA dei dati ──
  //
  // È il motivo per cui `nomeApp` sta in `app/config.js` e non in un file di
  // dati. Si trattiene la struttura per un secondo e mezzo, e si guarda la
  // pagina mentre aspetta: il titolo c'è già, il nome del corso no.
  const p2 = await browser.newPage();
  await bloccaFontEsterni(p2);
  await p2.addInitScript(mockInit);
  let trattenuta = 0;
  await p2.route(u => String(u).indexOf('struttura-corso.json') !== -1, async (route) => {
    trattenuta++;
    await new Promise(r => setTimeout(r, 1500)); // ATTESA-LEGITTIMA: il ritardo E' la cosa misurata — la struttura che arriva tardi, come su una rete lenta
    await route.continue();
  });
  await p2.goto(APP_URL);
  const prima = await p2.evaluate(() => ({
    titolo: document.title,
    h1: (document.querySelector('#view-attesa [data-nome="app"]') || {}).textContent,
    corso: (document.querySelector('[data-nome="corso"]') || {}).textContent,
    nomeApp: window.APP_CONFIG.nomeApp,
    struttura: !!(window.APP_CONFIG.nomiASchermo)
  }));
  log('[F] La struttura è stata davvero trattenuta (la sonda ha intercettato)', trattenuta > 0, String(trattenuta));
  log('[F] Mentre la struttura non è arrivata, titolo e schermata di attesa hanno GIÀ il nome dell\'app',
    !prima.struttura && prima.titolo === prima.nomeApp && prima.h1 === prima.nomeApp, JSON.stringify(prima));
  log('[F] ...e il nome del corso no: arriva con la struttura, mai sbagliato nel frattempo',
    prima.corso === '', JSON.stringify(prima.corso));
  await p2.close();

  // ── [G] L'etichetta della regola generale viene DAVVERO dal file ──
  //
  // In [E] il testo atteso e quello che il codice vecchio scriveva a mano sono
  // la stessa parola, «Regola generale»: quel controllo passerebbe anche col
  // codice vecchio (regola 14, una verifica che non può fallire non distingue).
  // Qui la cella del file si sostituisce con un valore che nessun codice
  // contiene, e lo si cerca a schermo.
  const SONDA = 'SONDA-ETICHETTA-' + Date.now();
  const p3 = await browser.newPage();
  await bloccaFontEsterni(p3);
  await p3.addInitScript(mockInit);
  let sostituita = 0;
  await p3.route(u => String(u).indexOf('it-istruzioni-moduli.json') !== -1, async (route) => {
    const r = await route.fetch();
    const j = await r.json();
    j.condivisi.etichettaRegolaGenerale = SONDA;
    sostituita++;
    await route.fulfill({ response: r, body: JSON.stringify(j) });
  });
  try {
    await p3.goto(APP_URL);
    await p3.evaluate(() => localStorage.clear());
    await p3.reload();
    await attendiPrimaSchermata(p3);
    await p3.fill('#name-input', 'Sonda');
    await p3.click('#onboarding-form button[type=submit]');
    await p3.waitForSelector('#go-episodes-list', { state: 'visible', timeout: 15000 });
    await p3.evaluate(() => {
      window.BI.impostaEpisodioCorrente(window.BI.EPISODES.gate);
      const m = window.BI.episodioCorrente().modules.find(x => x.id === 'repeatAloud');
      window.BI.openModuleFromMap(m);
    });
    await p3.waitForSelector('#repeat-aloud-body .note-box-label', { state: 'attached', timeout: 15000 });
    const letta = await p3.evaluate(() => document.querySelector('#repeat-aloud-body .note-box-label').textContent);
    log('[G] La sonda ha sostituito il file dei testi', sostituita > 0, String(sostituita));
    log('[G] Cambiata la cella nel file, cambia l\'etichetta a schermo', letta === SONDA, JSON.stringify(letta));
  } catch (e) {
    log('[G] L\'etichetta della regola generale viene dal file', false, e.message.split('\n')[0]);
  }
  await p3.close();

  await browser.close();
  finisci();
}

function finisci() {
  console.log('\n=== EDIZIONE SPAGNOLA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
