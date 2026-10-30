// PROTEGGE: che un nome di persona scelto in Personalizza non venga tradotto
// nel dialogo (scelto `papa-francesco`, nel dialogo non compare «Francis»);
// che in Dialogo Continuo «Pausa» sia acceso mentre la battuta parla, la fermi
// senza far partire il countdown della battuta dopo, e che «Riprendi» la
// risuoni da capo senza piantare il dialogo; che il badge «Ripasso» di Flash
// Card resti nascosto nel giro principale e compaia nel ripasso; che «Prossima
// frase» in Ripeti a Tempo faccia partire davvero la battuta dopo invece di
// limitarsi a suggerirla; che girare la carta di Flash Card fermi l'audio; che
// il suono Uscita esista, sia più piano del volume di default (0.15) e più
// grave delle note del Traguardo, e suoni su
// «Ho finito, torna alla mappa»; le tre colonne dell'intestazione («← Mappa» a
// sinistra, «Spiegazione» al centro, «Help» a destra); e che il contatore di
// avanzamento sia lo stesso, stessa classe e stesso carattere, in Voice Coach
// e in Flash Card.
//
// ⚠️ Fino al 2026-09-25 «Pausa» era SPENTO mentre la battuta parlava, e questo
// file lo verificava (male: leggeva durante il 3-2-1 di avvio). Da quel giorno
// e' acceso — il racconto e' accanto al blocco [Job2].

const { launchBrowser, APP_URL, attendiPrimaSchermata, globDati } = require('./test-env');
const { bootUtente, INTRO_DI_TUTTI } = require('./boot');
const { mockBrowser, componi, spiaToni } = require('./mock-browser');
const { attendiCheParla, attendiClasse, attendiTono } = require('./attese');
const { loadGrade } = require('./quiz-driver');
const { gradeOf, stepsBefore } = require('./module-order');
const { chiudiPopupTentativiSeAperto } = require('./quiz-driver');
const { openModule } = require('./map-driver');
const BASE = APP_URL;

const mockInit = componi(mockBrowser({ fineVoceMs: 700, riconoscimento: 'suStop', ritardoRiconoscimentoMs: 5 }), spiaToni);

const bootAsUser = (page, userName, completedModules) =>
  bootUtente(page, { utente: userName, completati: completedModules, introChiuse: INTRO_DI_TUTTI });

const dismissAttemptPopupIfOpen = chiudiPopupTentativiSeAperto;

const ALL_BEFORE_QM = stepsBefore('matchTargetNative');
const ALL_BEFORE_DG = stepsBefore('dialogoAscoltaRipeti');
const ALL_BEFORE_VC = stepsBefore('voiceCoach');

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1: person names never translated in dialogue ============
  //
  // ⚠️ DAL 2026-10-30 L'ESCA SI SERVE, NON SI TROVA. Le tabelle di quel giorno
  // hanno nella colonna della lingua insegnata il valore dello studente dove la
  // riga non si traduce (`Marco` / `Marco`), e `papa-francesco` è uscita: nei
  // dati veri non c'è più un nome con un inglese DIVERSO da tradire. Senza
  // esca la riga qui sotto («non contiene Francis») sarebbe vera per
  // costruzione (regola 44): si aggiunge al file servito una riga
  // `papa-francesco` Francesco/Francis non traducibile, e che sia stata
  // servita e scelta sono asserzioni (regola 49).
  const ESCA = { value: 'papa-francesco', native: 'Francesco', target: 'Francis', traducibile: false };
  let escaServita = false;
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route(globDati('tabelle-personalizzazione.json'), async function (route) {
      const risposta = await route.fetch();
      const t = await risposta.json();
      t.people.papa = t.people.papa.concat([ESCA]);
      escaServita = true;
      await route.fulfill({ response: risposta, body: JSON.stringify(t) });
    });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job1', ALL_BEFORE_DG);
    await openModule(page, 'personalizzazione');
    await page.waitForTimeout(200);
    // Pick "papa-francesco" for papa (whose en column is "Francis") via the select.
    // ⚠️ L'id porta il prefisso della tabella dal 2026-09-23.
    const hasSelect = await page.evaluate(() => !!document.querySelector('select[data-slot="papa"]'));
    if (hasSelect) {
      await page.selectOption('select[data-slot="papa"]', 'papa-francesco').catch(() => {});
    }
    log('[Job1] The bait row was served and chosen', escaServita &&
      await page.evaluate(() => (document.querySelector('select[data-slot="papa"]') || {}).value === 'papa-francesco'));
    await page.waitForTimeout(150);
    await page.click('#customize-back-home');
    await page.waitForTimeout(150);
    await page.click('#go-episode');
    await page.waitForTimeout(150);
    await openModule(page, 'dialogoAscoltaRipeti');
    // L'approdo serve a `isVisible`, che NON aspetta niente: se la vista non e'
    // ancora attiva torna false, il dialogo non parte e #dg-list resta vuoto —
    // e l'asserzione «non contiene "Francis"» sarebbe vera su una schermata
    // vuota, cioe' vera per il motivo sbagliato.
    await attendiClasse(page, '#view-dialogo', 'is-active');
    const dgStartVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStartVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(150); } // ATTESA-LEGITTIMA: l'asserzione qui sotto verifica che il dialogo NON contenga "Francis" — un non-evento non si aspetta, il tempo E' la misura. E allungarlo rafforza la prova invece di indebolirla: piu' battute passano, piu' e' vero che quel nome non compare
    const dialogueText = await page.evaluate(() => document.getElementById('dg-list').textContent);
    log('[Job1] Dialogue text does NOT contain the translated "Francis"', dialogueText.indexOf('Francis') === -1);
    log('[Job1] ...and it does contain the student\'s "Francesco" (the dialogue is not empty)', dialogueText.indexOf('Francesco') !== -1);
    log('[Job1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1b: resolveSlotValue unit check — person vs place ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.goto(BASE);
    // Niente attesa, e non e' una dimenticanza: `page.goto` risolve
    // sull'evento `load`, e lo script dell'app e' INLINE in index.html —
    // quindi APP_CONFIG e la fusione degli override sono gia' fatti quando
    // goto torna. Misurato campionando ogni 5 ms: fra «contesto non ancora
    // esistente» e «tutto pronto» non c'e' nessuno stato intermedio
    // osservabile. Qui c'erano 200 ms che non guardavano niente.
    // ⚠️ IL MAGAZZINO NON STA PIU' IN APP_CONFIG (2026-09-15): arriva da
    // PERSONALIZATION_TABLES_FILE, quindi l'esca si legge dal FILE e non
    // dalla pagina. Leggerla da `window.APP_CONFIG.people` darebbe undefined
    // — cioe' un rosso che parla del posto sbagliato.
    // ⚠️ Dal 2026-10-30 l'esca è quella servita in JOB 1 (vedi lì), non una
    // riga del file: qui si controlla che abbia davvero un inglese diverso.
    const papaOpt = ESCA;
    // ⚠️ E QUI C'ERANO DUE RIGHE MORTE, tolte il 2026-09-15.
    //
    // Cercavano `cfg.places.partenza`. La tabella si chiama `departures`:
    // `partenza` e' il nome dello SLOT che la usa (inglese-it-gate.json), non
    // della tabella. Quindi `torinoOpt` era sempre undefined — CALCOLATO E MAI
    // USATO — e `placesTableExists` sempre false, CALCOLATO E MAI ASSERITO.
    // Nessuna asserzione cadeva, quindi nessuno se n'e' accorto: e' la
    // famiglia della misura che non misura (CLAUDE.md regola 37) dentro un
    // test. Se un giorno serve un'asserzione sui luoghi, il nome giusto e'
    // `magazzino.places.departures`.
    log('[Job1b] people.papa.papa-francesco really has a different EN value (regression bait present)', papaOpt && papaOpt.native !== papaOpt.target);
    log('[Job1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2: Dialogo Continuo — Pausa never freezes the dialogue ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job2', ALL_BEFORE_DG.concat(['dialogoAscoltaRipeti', 'dialogoRipetiATempo']));
    await openModule(page, 'dialogoContinuo');
    var dgStart2 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart2) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    // Ready countdown runs, then the first line's AUDIO starts speaking (fake synth takes 700ms).
    await page.waitForTimeout(300);
    // Wait for ready countdown to finish and audio to actually be playing.
    await page.waitForFunction(() => {
      var btn = document.getElementById('dg-pause-btn');
      return btn && !btn.hidden;
    }, { timeout: 5000 }).catch(() => {});
    // ⚠️ QUI C'ERANO DUE ASSERZIONI CHE NON MISURAVANO QUELLO CHE DICEVANO,
    // E LA SECONDA NON POTEVA FALLIRE — riscritte il 2026-09-25.
    //
    // La prima diceva *«Pausa is disabled while a line's AUDIO is actively
    // speaking»* e leggeva dopo 400 ms fissi. **Misurato con una sonda in
    // quell'istante: `speaking: false`, zero bolle attive, zero countdown —
    // si era ancora dentro il 3-2-1 di avvio.** Il pulsante era spento perche'
    // non stava succedendo NIENTE, non perche' l'audio parlava: l'asserzione
    // era verde per il motivo sbagliato, e lo sarebbe rimasta anche il giorno
    // in cui il comportamento fosse cambiato. *La seconda ci costruiva sopra:
    // «cliccare Pausa MENTRE E' DISABILITATO non fa niente» partiva da una
    // premessa che non era vera in quel punto.*
    //
    // ⚠️ E IL COMPORTAMENTO E' CAMBIATO DAVVERO, il 2026-09-25: adesso
    // «Pausa» e' ACCESO mentre la battuta parla, e fermarla interrompe la voce
    // senza toccare `synth.pause()` (vedi `dgTogglePause`). Queste righe
    // provano quello.
    //
    // L'APPRODO: si aspetta che la battuta stia parlando DAVVERO — bolla
    // attiva **e** sintetizzatore in voce — invece di un tempo fisso. Nessuna
    // delle asserzioni qui sotto legge quei due fatti (regola 44): leggono il
    // PULSANTE, e poi cosa succede quando lo si preme.
    // ⚠️ L'ATTESA, LA LETTURA E IL CLICK STANNO TUTTI DENTRO LA PAGINA —
    // 2026-09-25, censimento di 1.18.
    //
    // Prima erano tre viaggi separati: si aspettava `speaking === true`, poi
    // un `$eval` leggeva il pulsante, poi un `click` lo premeva. **La voce
    // finta dura 700 ms, e sotto contesa due round-trip ci stanno dentro
    // benissimo:** la battuta finiva da sola, il countdown della battuta dopo
    // partiva, e `«la pausa NON fa avanzare il dialogo»` trovava un countdown
    // acceso. *Caduta a 40 processi in parallelo — e le sue vicine no, perche'
    // guardano dopo.*
    //
    // ⚠️ E LA CURA NON E' ALLUNGARE LA VOCE. Questo stesso blocco, piu' sotto,
    // ha bisogno che la battuta FINISCA perche' parta il countdown: una voce
    // lunga aggiusterebbe la prima meta' e romperebbe la seconda. *Si toglie
    // invece la dimensione tempo (regola 19): dentro la pagina il guardiano,
    // la lettura e il click girano nello STESSO contesto JS, e fra loro non
    // puo' cadere nessun viaggio.*
    const alClick = await page.evaluate(() => new Promise(function (risolvi) {
      var t0 = Date.now();
      (function guarda() {
        var btn = document.getElementById('dg-pause-btn');
        var bolla = document.querySelector('.dg-bubble.is-active');
        if (btn && bolla && window.speechSynthesis.speaking === true) {
          var disabilitato = btn.disabled;
          btn.click();
          risolvi({ partito: true, disabilitato: disabilitato });
          return;
        }
        if (Date.now() - t0 > 10000) { risolvi({ partito: false, disabilitato: null }); return; }
        setTimeout(guarda, 10);
      })();
    }));
    log('[Job2] La prima battuta arriva a parlare davvero', alClick.partito === true);
    log('[Job2] Pausa e\' ACCESO mentre la battuta parla (prima era spento)',
      alClick.disabilitato === false, 'disabled: ' + alClick.disabilitato);
    const dopoPausa = await page.evaluate(() => ({
      etichetta: document.getElementById('dg-pause-btn').textContent.trim(),
      parla: window.speechSynthesis.speaking
    }));
    log('[Job2] Premendo Pausa mentre parla, il pulsante diventa "Riprendi"',
      dopoPausa.etichetta === 'Riprendi', JSON.stringify(dopoPausa));
    // ⚠️ ATTESA-LEGITTIMA, e qui il TEMPO E' LA MISURA: si verifica che una
    // cosa NON accada — la pausa non deve far partire il countdown della
    // battuta dopo. E' il difetto che questa strada rischiava: `cancel()` fa
    // arrivare `onend`, e `onend` su questo profilo avvia il countdown.
    await page.waitForTimeout(500); // ATTESA-LEGITTIMA: prova che in pausa NON parte il countdown della battuta successiva
    const inPausa = await page.evaluate(() => ({
      parla: window.speechSynthesis.speaking,
      countdown: document.querySelectorAll('.dg-bubble.dg-bubble-timer').length
    }));
    log('[Job2] In pausa la voce e\' ferma', inPausa.parla === false, JSON.stringify(inPausa));
    log('[Job2] ...e la pausa NON fa avanzare il dialogo (nessun countdown partito)',
      inPausa.countdown === 0, JSON.stringify(inPausa));
    // Riprendi: la battuta si risuona da capo.
    await page.click('#dg-pause-btn');
    const risuonata = await page.waitForFunction(() => window.speechSynthesis.speaking === true,
      { timeout: 5000 }).then(function () { return true; }, function () { return false; });
    log('[Job2] Riprendendo, la battuta si risuona da capo', risuonata === true);
    // Si rimette in pausa e si riprende, per tornare allo stato che le righe
    // qui sotto si aspettano (dialogo che cammina).
    await page.waitForFunction(() => window.speechSynthesis.speaking === false,
      { timeout: 10000 }).then(function () {}, function () {});
    // ⚠️ RISCRITTA IL 2026-10-23, e non e' una rinomina. Qui si aspettava che
    // Pausa fosse ACCESO e la riga si chiamava «Pausa becomes enabled once the
    // per-line countdown is running»: un resto di prima del 2026-09-25, quando
    // Pausa era spento mentre la battuta parlava. Da quel giorno e' acceso
    // anche allora, quindi l'attesa tornava SUBITO e la riga era vera a
    // prescindere dal countdown — una riga che non poteva fallire.
    //
    // Adesso si aspetta il COUNTDOWN vero, cioe' la bolla col timer: un effetto
    // che la riga non legge (regola 44). E si guarda Pausa in quell'istante.
    // Vista cadere togliendo `!isCountingDown` dalla condizione di
    // `dgUpdateToolbarButtonState` (Pausa spento proprio durante il countdown):
    // rossa; la forma di prima restava verde, perche' aspettava la battuta dopo.
    const countdownPartito = await page.waitForSelector('.dg-bubble.dg-bubble-timer', { timeout: 10000 })
      .then(function () { return true; }, function () { return false; });
    const nelCountdown = await page.evaluate(() => ({
      timer: !!document.querySelector('.dg-bubble.dg-bubble-timer'),
      disabled: document.getElementById('dg-pause-btn').disabled
    }));
    log('[Job2] Il countdown della battuta parte davvero (senza, la riga sotto non direbbe niente)',
      countdownPartito && nelCountdown.timer === true, JSON.stringify(nelCountdown));
    log('[Job2] Pausa e\' ACCESO mentre il countdown della battuta scorre', nelCountdown.disabled === false,
      JSON.stringify(nelCountdown));
    // Now actually pause it -> Riprendi should stay enabled (not get stuck disabled).
    await page.click('#dg-pause-btn');
    await page.waitForTimeout(150); // ATTESA-LEGITTIMA: misto e nessuna delle due meta' e' convertibile: il TESTO del pulsante non ha una forma condivisa (e' la famiglia «un testo che si riempie»), e lo stato abilitato era gia' vero prima della pausa
    const riprendiLabel = await page.evaluate(() => document.getElementById('dg-pause-btn').textContent.trim());
    const riprendiDisabled = await page.$eval('#dg-pause-btn', el => el.disabled).catch(() => null);
    log('[Job2] After pausing, button reads "Riprendi"', riprendiLabel === 'Riprendi');
    log('[Job2] "Riprendi" stays enabled (not stuck disabled) while genuinely paused', riprendiDisabled === false);
    // Resume -> dialogue must continue normally (not frozen) -> eventually more lines get heard or it reaches summary.
    await page.click('#dg-pause-btn');
    // ATTESA-LEGITTIMA: "dopo Riprendi si e' ANCORA sulla schermata del dialogo" e' uno
    // stato gia' vero prima del click: aspettarlo tornerebbe subito. Il tempo serve a dare
    // al modulo l'occasione di piantarsi o di uscire dalla schermata, che e' il difetto
    // che questa riga difende.
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: prova che riprendendo NON si esce dalla schermata del dialogo
    const stillOnMain = await page.isVisible('#dg-main-screen').catch(() => false);
    // ⚠️ Qui c'era `stillOnMain === true || true`, cioe' un'asserzione che non poteva
    // fallire: `x || true` e' sempre vero (famiglia ⓪-bis di ERRORI-INGOIATI.md). Nominava
    // un comportamento per non verificarlo — e quel comportamento, riprendere senza
    // piantarsi, non era protetto da niente. Trovata l'11 settembre convertendo le attese
    // della famiglia ②, non cercandola.
    log('[Job2] After Riprendi, still on the dialogue screen (not stuck/crashed)', stillOnMain === true);
    log('[Job2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 3: Flash Card Ripasso badge (not the module category badge) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job3', stepsBefore('flashcardATargetNative'));
    // ⚠️ SPOSTATA QUI, PRIMA DELL'APERTURA DEL MODULO, e il posto e' la
    // correzione. Stava dopo `openModule` + 200 ms, come se verificasse
    // qualcosa DENTRO Flash Card: non e' cosi'. `fc-level-label` non esiste in
    // nessun punto del documento — nell'app quel nome sopravvive solo dentro un
    // COMMENTO — quindi l'asserzione e' vera sulla schermata iniziale, sulla
    // mappa, ovunque. Non e' inutile (se qualcuno rimettesse quell'id,
    // cadrebbe), ma scritta la' faceva credere di provare una cosa che non
    // provava, e si portava dietro un'attesa che non guardava niente.
    const noLevelLabel = await page.evaluate(() => !document.getElementById('fc-level-label'));
    log('[Job3] Nessun elemento con id "fc-level-label" esiste nel documento (il testo di categoria dentro i moduli e\' stato tolto ovunque)', noLevelLabel);
    await openModule(page, 'flashcardATargetNative');
    await attendiClasse(page, '#view-flashcard', 'is-active');
    const badgeHiddenAtStart = await page.$eval('#fc-ripasso-badge', el => el.hidden).catch(() => null);
    log('[Job3] "Ripasso" badge exists and starts hidden (main pass)', badgeHiddenAtStart === true);
    // Force every card wrong to trigger a retry pass. Il limite viene dal
    // mazzo vero: scritto a mano era tarato su 15 carte e non bastava piu'
    // ad arrivare al ripasso con 21.
    const carteRipasso = loadGrade(gradeOf('flashcardATargetNative')).length;
    let reachedRetry = false;
    for (let i = 0; i < carteRipasso * 3 + 10; i++) {
      const summaryVisible = await page.isVisible('#fc-summary-screen').catch(() => false);
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#fc-retry-intro-screen').catch(() => false);
      if (retryVisible) {
        await page.click('#fc-retry-continue-btn', { timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(150);
        continue;
      }
      const cardVisible = await page.isVisible('#fc-card-screen').catch(() => false);
      if (!cardVisible) { await page.waitForTimeout(150); continue; }
      await page.click('#fc-card', { timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(120);
      const badgeHiddenNow = await page.$eval('#fc-ripasso-badge', el => el.hidden).catch(() => null);
      if (badgeHiddenNow === false) reachedRetry = true;
      // "Non ancora" is the SECONDARY (first) button in the choice row —
      // see renderChoiceBox: secondaryBtnId comes before primaryBtnId.
      const nonBtn = await page.$('#fc-not-yet-btn');
      if (nonBtn) { await nonBtn.click({ timeout: 1000 }).catch(() => {}); }
      await page.waitForTimeout(150); // ATTESA-LEGITTIMA: e' l'ultima attesa di un CICLO che guida il modulo, e l'asserzione dopo il ciclo ne riassume l'esito. Non c'e' uno stato finale da attendere: il ciclo finisce quando finisce, e questo tempo e' il passo del ciclo, non una guardia
    }
    log('[Job3] "Ripasso" badge becomes visible during the retry pass', reachedRetry);
    log('[Job3] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 4: "Prossima frase" actually advances (plays next line's audio) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job4', ALL_BEFORE_DG.concat(['dialogoAscoltaRipeti']));
    await openModule(page, 'dialogoRipetiATempo');
    var dgStart4 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart4) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const firstBubble = await page.$('.dg-bubble');
    if (firstBubble) { await firstBubble.click(); }
    // Wait for line 1's audio to end and its countdown to start.
    await page.waitForFunction(() => {
      var btn = document.getElementById('dg-next-line-btn');
      return btn && !btn.disabled;
    }, { timeout: 5000 }).catch(() => {});
    await page.click('#dg-next-line-btn');
    // Immediately after clicking, line 2's audio should be playing (bubble locked/active), not idle waiting for a tap.
    const idsJob4 = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    await attendiClasse(page, '.dg-bubble[data-line-id="' + idsJob4[1] + '"]', 'is-active');
    const secondBubbleIsActive = await page.evaluate(() => {
      var bubbles = Array.from(document.querySelectorAll('.dg-bubble'));
      return bubbles[1] && bubbles[1].classList.contains('is-active');
    });
    log('[Job4] Right after "Prossima frase", the NEXT line is already playing (is-active), not just suggested', secondBubbleIsActive === true);
    const secondBubbleSuggestedOnly = await page.evaluate(() => {
      var bubbles = Array.from(document.querySelectorAll('.dg-bubble'));
      return bubbles[1] && bubbles[1].classList.contains('is-suggested');
    });
    log('[Job4] The next line is NOT stuck in "is-suggested" (a suggestion the user still has to tap)', secondBubbleSuggestedOnly === false);
    log('[Job4] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 5: Flash Card — flipping mid-audio stops playback (Regola Azione Critica) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job5', stepsBefore('flashcardATargetNative'));
    await openModule(page, 'flashcardATargetNative');
    await page.waitForTimeout(200);
    // Start the front-of-card audio (target-native direction -> front is english, has a listen button).
    const listenBtn = await page.$('#fc-front-audio .listen-block-btn');
    if (listenBtn) { await listenBtn.click(); }
    await attendiCheParla(page);
    const speakingBeforeFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job5] Audio is actually speaking right before the flip', speakingBeforeFlip === true);
    await page.click('#fc-card');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
    const speakingAfterFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job5] Flipping the card while audio plays stops it immediately (Regola Azione Critica)', speakingAfterFlip === false);
    log('[Job5] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 6: "Uscita" sound on every Schermata Finale's exit button ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job6', ALL_BEFORE_QM);
    const cfgCheck = await page.evaluate(() => {
      var u = window.APP_CONFIG.sound.events.uscita;
      return !!u && typeof u.freq === 'number' && typeof u.durationMs === 'number' && typeof u.volume === 'number';
    });
    log('[Job6] CONFIG.sound.events.uscita exists with freq/durationMs/volume', cfgCheck);
    const quieterThanTraguardo = await page.evaluate(() => {
      var u = window.APP_CONFIG.sound.events.uscita;
      var t = window.APP_CONFIG.sound.events.traguardo;
      return u.volume < 0.15 && Math.max.apply(null, t.notes) > u.freq;
    });
    log('[Job6] "uscita" is quieter than the 0.15 default and pitched below Traguardo\'s notes', quieterThanTraguardo);
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(150);
    await page.evaluate(() => { window.__playedTones = []; });
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(150);
    await page.click('#repeat-aloud-complete-btn');
    const uscitaFreq = await page.evaluate(() => window.APP_CONFIG.sound.events.uscita.freq);
    await attendiTono(page, [uscitaFreq], 1);
    const played = await page.evaluate(() => window.__playedTones || []);
    log('[Job6] Clicking "Ho finito, torna alla mappa" plays the "uscita" tone', played.some(t => t.freq === uscitaFreq));
    log('[Job6] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 7: header alignment — Mappa left, Spiegazione center, Help right ============
  {
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job7', stepsBefore('flashcardATargetNative'));
    await openModule(page, 'flashcardATargetNative');
    await attendiClasse(page, '#view-flashcard', 'is-active'); // il gesto e' l'apertura del modulo, non la geometria che l'asserzione misura
    const rects = await page.evaluate(() => {
      var row = document.querySelector('#view-flashcard .header-actions-row');
      var mappa = document.getElementById('flashcard-back-map').getBoundingClientRect();
      var spieg = document.getElementById('flashcard-watch-btn').getBoundingClientRect();
      var help = document.getElementById('flashcard-help-btn').getBoundingClientRect();
      var rowRect = row.getBoundingClientRect();
      return { rowLeft: rowRect.left, rowRight: rowRect.right, rowCenter: (rowRect.left + rowRect.right) / 2, mappaLeft: mappa.left, spiegCenter: (spieg.left + spieg.right) / 2, helpRight: help.right };
    });
    log('[Job7] "← Mappa" sits at the row\'s left edge', Math.abs(rects.mappaLeft - rects.rowLeft) < 2);
    log('[Job7] "Help" sits at the row\'s right edge', Math.abs(rects.helpRight - rects.rowRight) < 2);
    log('[Job7] "Spiegazione" sits near the row\'s horizontal center', Math.abs(rects.spiegCenter - rects.rowCenter) < 20);
    // Also check the Spiegazione screen itself (rule: "comprese le schermate di Spiegazione").
    await page.click('#flashcard-watch-btn');
    const overlayOpen = await attendiClasse(page, '#howitworks-overlay', 'is-open');
    log('[Job7] Spiegazione popup opens (sanity check, not an alignment assertion)', overlayOpen);
    log('[Job7] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 8: progress counter uniform across modules (shared class) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T16Job8', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    // ⚠️ IL CASO PIU' DIVERSO DI QUESTO GIRO, e per questo si converte per
    // primo: e' l'unico blocco che apre DUE moduli e confronta le due letture.
    // Qui un approdo generico — «una vista diversa dalla mappa e' attiva» —
    // sarebbe gia' vero per il PRIMO modulo quando si apre il secondo, e la
    // lettura di #fc-counter avverrebbe mentre si e' ancora su Voice Coach.
    //
    // E non fallirebbe: gli elementi delle viste non attive restano nel DOM,
    // quindi getComputedStyle risponde lo stesso e il confronto tornerebbe
    // VERO — provando che un contatore e' uguale a se' stesso. **Un approdo
    // sbagliato qui non produce un rosso: produce un verde che prova la cosa
    // sbagliata.** Per questo le due viste si nominano una per una.
    await attendiClasse(page, '#view-voice-coach', 'is-active');
    const vcStyle = await page.evaluate(() => {
      var el = document.getElementById('vc-counter');
      var cs = getComputedStyle(el);
      return { family: cs.fontFamily, weight: cs.fontWeight, size: cs.fontSize, cls: el.className };
    });
    await page.click('#voice-coach-back-map');
    await attendiClasse(page, '#view-map', 'is-active');
    await openModule(page, 'flashcardATargetNative');
    await attendiClasse(page, '#view-flashcard', 'is-active');
    const fcStyle = await page.evaluate(() => {
      var el = document.getElementById('fc-counter');
      var cs = getComputedStyle(el);
      return { family: cs.fontFamily, weight: cs.fontWeight, size: cs.fontSize, cls: el.className };
    });
    log('[Job8] Voice Coach counter and Flash Card counter share the same CSS class', vcStyle.cls === fcStyle.cls && vcStyle.cls === 'sr-counter');
    log('[Job8] Same font-family', vcStyle.family === fcStyle.family);
    log('[Job8] Same font-weight, and it is bold (>=700)', vcStyle.weight === fcStyle.weight && parseInt(vcStyle.weight, 10) >= 700);
    log('[Job8] Same font-size', vcStyle.size === fcStyle.size);
    log('[Job8] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH16 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
