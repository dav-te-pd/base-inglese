const { launchBrowser, APP_URL, strutturaCorso, attendiPrimaSchermata } = require('./test-env');
const { spiaToni } = require('./mock-browser');
const { attendiClasse, attendiVisibile } = require('./attese');
const { stepsBefore, allSteps } = require('./module-order');
const { openModule } = require('./map-driver');
const BASE = APP_URL;

// Il finto del browser sta in un posto solo dal 2026-09-24 (passo F.4):
// stesso nucleo di prima, stessi parametri. Vedi tests/mock-browser.js.
const { mockBrowser } = require('./mock-browser');
const mockInit = mockBrowser({ fineVoceMs: 25 });


async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  // ⚠️ L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): senza questa attesa, «non c'e' il campo del nome» e «non
  // c'e' ancora niente» si leggono uguali, e il test clicca un pulsante che
  // non e' ancora comparso. Vedi `attendiPrimaSchermata` in test-env.js.
  await attendiPrimaSchermata(page);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem(BI.customizeSeenKey('gate', userName), '1');
    localStorage.setItem(BI.moduleProgressKey('gate', userName), JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const ALL_COMPLETE = allSteps();

  // ============ A: default module order matches CONFIG.episodes.gate.moduleOrder ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'OrderTester', []);
    const order = await page.evaluate(() => Array.from(document.querySelectorAll('[data-module]')).map(el => el.getAttribute('data-module')));
    // Gli id dei PASSI, non i nomi dei moduli: lo stesso modulo puo'
    // comparire piu' volte e le apparizioni successive hanno un id proprio.
    log('[A] L\'ordine in mappa e\' quello della sequenza dell\'episodio', JSON.stringify(order) === JSON.stringify(allSteps()));
    log('[A] No JS errors on map render', errors.length === 0);
    await page.close();
  }

  // ============ A: reordering CONFIG.episodes.gate.moduleOrder changes render order ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // ⚠️ LO SCAMBIO PASSA DAGLI OVERRIDE, E IL TEST CI GUADAGNA. Riscritto il
    // 2026-09-20 seguendo la rossa del passo 1.11b (⓪-undecies).
    //
    // La forma vecchia scambiava i primi due passi mutando
    // `window.APP_CONFIG.sequences` DOPO il caricamento — quando
    // `episode.modules` era gia' costruito — e infatti la sua asserzione lo
    // ammetteva: verificava solo che il NUMERO dei passi non cambiasse, con
    // scritto accanto «order computed at load time is expected/documented
    // behavior». *Era una riga che non poteva accorgersi di niente.* C'era
    // pure un `addInitScript` che leggeva un descrittore e non ne faceva
    // nulla: due righe rimaste di un tentativo.
    //
    // Adesso lo scambio si scrive dove lo scrive il Pannello Admin — la
    // chiave degli override in `localStorage` — che e' la strada VERA con cui
    // un riordino arriva in mappa, e che `applyConfigOverrides` riapplica
    // SOPRA `struttura-corso.json` appena il file arriva. Quindi la riga
    // adesso verifica lo scambio per davvero.
    const ordineScambiato = strutturaCorso().sequences['narrativo-standard'].slice();
    const tmp = ordineScambiato[0]; ordineScambiato[0] = ordineScambiato[1]; ordineScambiato[1] = tmp;
    await page.addInitScript(function (ordine) {
      localStorage.setItem('baseinglese:configOverrides',
        JSON.stringify({ sequences: { 'narrativo-standard': ordine } }));
    }, ordineScambiato);
    await page.goto(BASE);
    await attendiPrimaSchermata(page);
    var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
    if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForSelector('#name-input', { state: 'visible' }); }
    await page.fill('#name-input', 'ReorderTester');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForTimeout(100);
    await page.evaluate((u) => {
      localStorage.setItem(BI.customizeSeenKey('gate', u), '1');
      localStorage.setItem(BI.moduleProgressKey('gate', u), JSON.stringify({ completed: [] }));
      localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
    }, 'ReorderTester');
    await page.click('#go-episode');
    await page.waitForTimeout(150); // ATTESA-LEGITTIMA: NON e' una guardia di questa famiglia — l'asserzione legge un DATO (un conteggio), non un pulsante ne' una classe. Il censimento l'ha messa fra «un pulsante o una classe che cambia stato» perche' nella finestra c'e' un getAttribute che appartiene a un'ALTRA riga. Marcata per toglierla dal debito, non perche' il tempo sia la misura: qui si legge l'ELENCO dei moduli in mappa
    const order = await page.evaluate(() => Array.from(document.querySelectorAll('[data-module]')).map(el => el.getAttribute('data-module')));
    // Gli id attesi si calcolano dall'ordine scambiato con la stessa regola
    // di `moduleStepId` — la prima apparizione tiene l'id nudo — invece di
    // essere scritti a mano: scriverli qui li fotograferebbe al giorno d'oggi.
    const vistiSw = {};
    const attesiSw = ordineScambiato.filter(p => !p.off).map(p => {
      const id = vistiSw[p.module] ? p.module + '-' + (vistiSw[p.module] + 1) : p.module;
      vistiSw[p.module] = (vistiSw[p.module] || 0) + 1;
      return id;
    });
    log('[A] Riordinare la sequenza riordina DAVVERO la mappa',
      JSON.stringify(order) === JSON.stringify(attesiSw));
    log('[A] ...e i primi due passi sono proprio scambiati rispetto al file',
      order[0] === attesiSw[0] && order[1] === attesiSw[1] && order[0] !== allSteps()[0]);
    log('[A] No JS errors on reorder test', errors.length === 0);
    await page.close();
  }

  // ============ A: clicking a module still opens/works after refactor (regression) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'ClickRegression', stepsBefore('dialogoAscoltaRipeti'));
    await openModule(page, 'dialogoAscoltaRipeti');
    const started = await page.isVisible('#dg-start-btn');
    log('[A] Module click still opens Dialogo Ascolta e Ripeti', started);
    log('[A] No JS errors opening module', errors.length === 0);
    await page.close();
  }

  // ============ D: Speed Match 3-2-1 plays a tone per digit, last one higher ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRSoundTester', stepsBefore('speedMatchEngIta'));
    await page.evaluate(() => { window.APP_CONFIG.speedMatch.countdownStepMs = 60; });
    await page.addScriptTag({ content: spiaToni.content });
    await openModule(page, 'speedMatchEngIta');
    await page.waitForTimeout(400);
    await page.click('#sr-ready-btn');
    await page.waitForFunction(() => window.__playedTones && window.__playedTones.length >= 3, { timeout: 3000 });
    const tones = await page.evaluate(() => window.__playedTones);
    const ready = await page.evaluate(() => window.APP_CONFIG.sound.events.ready);
    const readyTones = tones.filter(t => t.freq === ready.freq || t.freq === ready.finalFreq);
    log('[D] Speed Match 3-2-1 plays exactly 3 tones', readyTones.length === 3);
    log('[D] Speed Match: i primi due tocchi usano ready.freq (' + ready.freq + ')', readyTones.length === 3 && readyTones[0].freq === ready.freq && readyTones[1].freq === ready.freq);
    log('[D] Speed Match: l\'ultimo tocco usa ready.finalFreq (' + ready.finalFreq + ')', readyTones.length === 3 && readyTones[2].freq === ready.finalFreq);
    log('[D] No JS errors on Speed Match countdown', errors.length === 0);
    await page.close();
  }

  // ============ D: Dialogo Continuo 3-2-1 plays a tone per digit, last one higher ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'DGSoundTester', stepsBefore('dialogoContinuo'));
    await page.evaluate(() => { window.APP_CONFIG.dialogo.countdownStepMs = 60; });
    await page.addScriptTag({ content: spiaToni.content });
    await openModule(page, 'dialogoContinuo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForFunction(() => window.__playedTones && window.__playedTones.length >= 3, { timeout: 3000 });
    const tones = await page.evaluate(() => window.__playedTones);
    const ready = await page.evaluate(() => window.APP_CONFIG.sound.events.ready);
    const readyTones = tones.filter(t => t.freq === ready.freq || t.freq === ready.finalFreq);
    log('[D] Dialogo Continuo 3-2-1 plays exactly 3 tones', readyTones.length === 3);
    log('[D] Dialogo Continuo: i primi due tocchi usano ready.freq (' + ready.freq + ')', readyTones.length === 3 && readyTones[0].freq === ready.freq && readyTones[1].freq === ready.freq);
    log('[D] Dialogo Continuo: l\'ultimo tocco usa ready.finalFreq (' + ready.finalFreq + ')', readyTones.length === 3 && readyTones[2].freq === ready.finalFreq);
    log('[D] No JS errors on Dialogo Continuo countdown', errors.length === 0);
    await page.close();
  }

  // ============ B: config panel open/close, grouping, live effect, JSON error, persistence, reset ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'ConfigPanelTester', ALL_COMPLETE);

    // Typing "config" while focused in a text input must NOT open it.
    await page.evaluate(() => { document.getElementById('name-input') && document.getElementById('name-input').focus(); });
    // No text input visible on episode map; use a safe check via body focus + a temp input.
    await page.evaluate(() => {
      var tmp = document.createElement('input');
      tmp.id = '__tmp_input_test';
      document.body.appendChild(tmp);
      tmp.focus();
    });
    for (const ch of 'config') await page.keyboard.press(ch);
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — scrivere "config" DENTRO un campo di testo NON deve aprire il pannello
    const openedWhileTyping = await page.evaluate(() => document.getElementById('config-panel-overlay').classList.contains('is-open'));
    log('[B] Typing "config" INSIDE a text input does NOT open the panel', !openedWhileTyping);
    await page.evaluate(() => { document.getElementById('__tmp_input_test').remove(); document.activeElement.blur(); });

    // ⚠️ IL DEFAULT SI CATTURA QUI, PRIMA CHE ESISTA UN OVERRIDE — e non e'
    // una precauzione, e' l'unica forma che funziona. Dopo il reset
    // `APP_CONFIG` **e'** il default, quindi leggerlo la' darebbe
    // `afterReset === afterReset`: una conversione che sembra fatta bene e
    // produce un'asserzione vacua (CLAUDE.md regola 44 applicata ai valori).
    // Non spostare questa riga piu' in basso.
    const defaultTimeLimit = await page.evaluate(() => window.APP_CONFIG.speedMatch.timeLimitSeconds);

    // Typing "config" outside an input opens it.
    await page.click('body');
    for (const ch of 'config') await page.keyboard.press(ch);
    const opened = await attendiClasse(page, '#config-panel-overlay', 'is-open');
    log('[B] Typing "config" outside an input opens the panel', opened);

    const groupCount = await page.$$eval('#config-panel-body .config-group', els => els.length);
    log('[B] Panel shows grouped sections (details per top-level CONFIG key)', groupCount > 3);

    // Open the speedMatch group and edit timeLimitSeconds live.
    const speedMatchSummary = await page.evaluate(() => {
      var groups = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
      var g = groups.find(function (el) { return el.querySelector('summary').textContent === 'speedMatch'; });
      if (!g) return false;
      g.open = true;
      return true;
    });
    log('[B] speedMatch group found and opened', speedMatchSummary);
    const input = await page.$('input[data-config-path="speedMatch.timeLimitSeconds"]');
    log('[B] Scalar field for speedMatch.timeLimitSeconds rendered', !!input);
    if (input) {
      await input.fill('7');
      await input.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })));
      // Niente attesa: il gestore del campo scrive APP_CONFIG in modo sincrono
      // dentro l'evento, quindi il valore e' gia' 7 quando l'evaluate torna. E
      // APP_CONFIG e' cio' che l'asserzione legge, quindi non puo' fare da
      // approdo a se stesso (CLAUDE.md regola 44).
      const liveValue = await page.evaluate(() => window.APP_CONFIG.speedMatch.timeLimitSeconds);
      log('[B] Editing a scalar field updates window.APP_CONFIG live (7)', liveValue === 7);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}'));
      log('[B] Change is persisted to localStorage overrides', stored.speedMatch && stored.speedMatch.timeLimitSeconds === 7);
    }

    // Invalid JSON in an array field shows an inline error and does not apply.
    await page.evaluate(() => {
      var groups = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
      var g = groups.find(function (el) { return el.querySelector('summary').textContent === 'speech'; });
      if (g) g.open = true;
    });
    const arrayTextarea = await page.$('#config-panel-body textarea[data-config-path$="rateOptions"]');
    if (arrayTextarea) {
      const before = await page.evaluate(() => JSON.stringify(window.APP_CONFIG.speech.rateOptions));
      await arrayTextarea.fill('not valid json');
      await arrayTextarea.evaluate(el => el.dispatchEvent(new Event('change', { bubbles: true })));
      await attendiVisibile(page, '.config-field-error');
      const errVisible = await arrayTextarea.evaluate(el => {
        var err = el.parentElement.querySelector('.config-field-error');
        return err && !err.hidden;
      });
      const after = await page.evaluate(() => JSON.stringify(window.APP_CONFIG.speech.rateOptions));
      log('[B] Invalid JSON in array field shows inline error', errVisible);
      log('[B] Invalid JSON does NOT apply (value unchanged)', before === after);
    } else {
      log('[B] Array field (rateOptions) found for JSON-error test', false);
    }

    // Escape closes the panel.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: aspetta che una CLASSE SPARISCA, e attendiClasseAssente non esiste. Qui la classe c'e' davvero prima, quindi la conversione sarebbe sicura — ma i siti come questo sono CINQUE (il quinto e' la spunta di ascolto in test_batch10, 2026-09-11), e cinque non giustificano una funzione da difendere per sempre su cui sbagliare produce un test vuoto. SOGLIA DICHIARATA: quando diventano DIECI, la funzione si fa — Escape TOGLIE is-open dal pannello
    const closedByEscape = await page.evaluate(() => !document.getElementById('config-panel-overlay').classList.contains('is-open'));
    log('[B] Escape closes the config panel', closedByEscape);

    // Persistence across reload (without reset).
    await page.reload();
    // Come `goto`: `reload` risolve sull'evento `load` e lo script e' inline,
    // quindi la fusione degli override e' gia' avvenuta. 150 ms che non
    // guardavano niente.
    const persisted = await page.evaluate(() => window.APP_CONFIG.speedMatch.timeLimitSeconds);
    log('[B] Change persists across reload via boot-time override merge (7)', persisted === 7);

    // Reset restores defaults.
    await page.evaluate(() => {
      document.body.focus();
    });
    await page.click('body');
    for (const ch of 'config') await page.keyboard.press(ch);
    await page.waitForTimeout(100);
    // ⚠️ QUESTO PUNTO NON E' COME GLI ALTRI DODICI DELLA FAMIGLIA: la guardia
    // non sta davanti a una scrittura, sta davanti a un location.reload() (il
    // gestore di #config-panel-reset-btn in index.html). Il censimento l'ha
    // messo qui per la lettura di configOverrides qui sotto, ma la corsa e'
    // un'altra — e vera: se il boot non e' finito, window.APP_CONFIG non
    // esiste ancora e la lettura ESPLODE invece di fallire.
    //
    // L'approdo non poteva essere uno stato dell'app. Misurato: dopo il reload
    // ogni candidato e' gia' vero (#view-onboarding nasce is-active nel
    // markup) oppure e' proprio cio' che l'asserzione legge — e l'effetto su
    // cui si aspetta non puo' essere quello che l'asserzione legge, o diventa
    // vero per costruzione (criterio in testa a tests/attese.js).
    //
    // L'unico fatto che il gesto produce, osservabile senza essere letto, e'
    // che il DOCUMENTO e' stato sostituito: si timbra prima, si aspetta che il
    // timbro sparisca. Resta INLINE e non entra in tests/attese.js: e' un sito
    // solo, e una forma condivisa su un sito solo e' una funzione da difendere
    // per sempre senza nessuno che la usi.
    await page.evaluate(() => { window.__primaDelReload = true; });
    await page.click('#config-panel-reset-btn');
    const ricaricata = await page.waitForFunction(() => !window.__primaDelReload, null, { timeout: 15000 })
      .then(() => true).catch(() => false);
    log('[B] Reset ricarica la pagina: il documento e\' stato sostituito', ricaricata);
    // ⚠️ LA RIGA SOPRA DICE «il documento è stato sostituito», NON «l'app è
    // pronta» — e fra le due c'è il caricamento di DICIOTTO script.
    //
    // Rossa il 2026-09-19, estraendo il terzo modulo: `window.APP_CONFIG` era
    // ancora `undefined` quando la riga dopo lo leggeva. **Non l'ha rotta
    // `app/match.js`: l'ha resa visibile.** La corsa c'era già, e ogni tag
    // nuovo la allarga — è la regola 19 vista dal verso del numero di file
    // invece che da quello della macchina lenta.
    //
    // L'approdo è `.view.is-active`, cioè **l'ultimo** effetto del
    // ricaricamento: `boot()` ha scelto una vista, quindi tutti gli script
    // sono girati. Non è nessuna delle due cose che le righe qui sotto
    // leggono — `APP_CONFIG` e la chiave degli override (regola 44).
    //
    // *Primo tentativo: `#name-input`. Sbagliato — questo profilo è già
    // registrato, quindi il login non compare e l'attesa scadeva. Una vista
    // attiva c'è sempre, qualunque profilo.*
    await page.waitForSelector('.view.is-active', { timeout: 15000 });
    const afterReset = await page.evaluate(() => window.APP_CONFIG.speedMatch.timeLimitSeconds);
    const overridesCleared = await page.evaluate(() => localStorage.getItem('baseinglese:configOverrides'));
    log('[B] Il reset riporta speedMatch.timeLimitSeconds al default catturato prima dell\'override (' + defaultTimeLimit + ')', afterReset === defaultTimeLimit);
    log('[B] Reset clears the localStorage overrides key', overridesCleared === null);

    log('[B] No JS errors during config panel test', errors.length === 0);
    await page.close();
  }

  // ============ Full regression: other modules unaffected ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'FullRegression', stepsBefore('matchEngIta'));
    await openModule(page, 'matchEngIta');
    const qmVisible = await page.evaluate(() => {
      var view = document.getElementById('view-match');
      return !!view && !view.hidden;
    });
    log('[Regression] Match Practice still opens', qmVisible);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
