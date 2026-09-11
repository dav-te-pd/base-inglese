const { launchBrowser, APP_URL } = require('./test-env');
const { attendiVisibile } = require('./attese');
const { stepsBefore } = require('./module-order');
const { chiudiPopupTentativiSeAperto } = require('./quiz-driver');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 30); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); if (u.onerror) u.onerror({ error: 'canceled' }); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:gate:customizeSeen:' + userName, '1');
    if (completedModules) localStorage.setItem('baseinglese:modules:gate:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach', 'voicePractice', 'matchEngIta', 'matchItaEng', 'speedMatchEngIta', 'speedMatchItaEng', 'flashcard', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

// Speed Match e Match Practice finiscono quando finiscono le domande: il grado
// ne ha nove, e questi cicli cliccano sempre la PRIMA opzione sperando che
// prima o poi capiti giusta (o sbagliata). Se la fortuna va storta per tutte e
// nove, il giro si chiude, le opzioni spariscono, e il click successivo
// restava appeso trenta secondi su una schermata di riepilogo — poi moriva con
// un "TimeoutError" che non diceva niente. Il ciclo, che di giri ne prova
// venti, era scritto per un giro che di domande ne ha nove.
//
// Non e' una lentezza da assecondare con un'attesa piu' lunga: e' il ciclo che
// non sa quando fermarsi. Qui lo sa, e l'asserzione "Managed to observe..."
// subito dopo il ciclo diventa il rosso che SPIEGA, invece del timeout muto.
//
// Perche' proprio cosi': il rosso era intermittente e cadeva ogni volta su una
// riga diversa (139 in una corsa, 244 in un'altra) — tre cicli con lo stesso
// difetto, non una riga sfortunata. Un rattoppo su una riga sola avrebbe
// spostato il problema, non tolto.
// ---------------------------------------------------------------------------
// GUIDARE IL QUIZ INVECE DI SPERARCI.
//
// Match Practice e Speed Match non espongono quale opzione sia quella giusta
// (`qmCurrentOptions`/`srCurrentOptions` vivono dentro l'IIFE), quindi un test
// che vuole osservare una risposta GIUSTA deve toccare e guardare cosa succede.
// Fin qui e' inevitabile. Quello che NON e' inevitabile e' come si contava il
// giro: quattro blocchi di questo file toccavano la prima opzione al massimo
// venti volte e speravano. Misurato il 2026-09-08: rosso 2 giri su 3 su
// `[SR Task1]`, e poi — con quello corretto — rosso su `[SR Task3-adj]`, che ha
// la stessa forma. Non era sfortuna: era la specie, e se ne correggeva un
// esemplare per volta.
//
// Le tre cose che rendono il giro deterministico, e nessuna e' un tempo:
//
//   1. SULL'ULTIMA DOMANDA DEL PASSAGGIO NON SI RISPONDE MAI. Li' una risposta
//      chiude il passaggio, e con esso le domande che restavano da provare. Si
//      dichiara "non lo so": la voce torna nel giro di ripasso, quindi altre
//      domande dopo ci sono di sicuro.
//   2. IL LIMITE DEL CICLO NON E' UN NUMERO A OCCHIO: e' quante domande
//      esistono per quanti passaggi la coda di ripasso ammette. Venti tentativi
//      su un giro di nove domande sono meno di quello che sembrano, perche' il
//      ciclo finisce quando finiscono le domande, non quando finisce il conto.
//   3. LE SCHERMATE DI MEZZO SI ATTRAVERSANO invece di far uscire il ciclo: il
//      riquadro della risposta, l'intro del ripasso.
//
// Con nove domande e tre passaggi le occasioni diventano ~30 invece di ~9, e la
// probabilita' di non vedere mai una prima opzione giusta passa da 7,5% a
// 0,02%. Resta un test probabilistico — dichiararlo e' meglio che fingere che
// non lo sia — ma di un ordine di grandezza che non si incontra.
//
// Tutti gli id dei due moduli seguono lo stesso schema, quindi il prefisso
// ('qm' o 'sr') basta a servirli entrambi: un solo posto da correggere invece
// di quattro.
function statoQuiz(page, p) {
  return page.evaluate((pre) => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const contatore = (document.getElementById(pre + '-counter') || {}).textContent || '';
    const m = contatore.match(/(\d+)\s*\/\s*(\d+)/);
    return {
      contatore: contatore.trim(),
      indice: m ? Number(m[1]) : null,
      totale: m ? Number(m[2]) : null,
      quiz: vis(document.getElementById(pre + '-quiz-screen')),
      ripasso: vis(document.getElementById(pre + '-retry-intro-screen')),
      riepilogo: vis(document.getElementById(pre + '-summary-screen')),
      revealAperto: !document.getElementById(pre + '-reveal').hidden,
      opzioni: document.querySelectorAll('#' + pre + '-options .sr-option').length
    };
  }, p);
}

// Tocca la prima opzione finche' non ne capita una dell'esito voluto
// ('giusta' o 'sbagliata'). Restituisce il contatore della domanda su cui e'
// successo, oppure null se il giro e' finito senza — e in quel caso il test
// che la chiama deve fallire dicendolo, non proseguire su una schermata a caso.
async function toccaFinoA(page, p, voluto) {
  const partenza = await statoQuiz(page, p);
  const maxPassaggi = await page.evaluate(() => window.APP_CONFIG.retryQueue.maxAttempts);
  const limite = (partenza.totale || 1) * (maxPassaggi + 1) + 5;
  for (let mosse = 0; mosse < limite; mosse++) {
    // ⚠️ PRIMA DI TUTTO il popup della valvola di sicurezza: il suo sfondo
    // intercetta i click, quindi finche' e' aperto ogni click qui sotto va in
    // timeout dopo trenta secondi e il file muore senza dire perche'. E' morto
    // cosi' in CI il 2026-09-10 (995 asserzioni invece di 1008), perche'
    // questo file non nominava `attempt-popup` da nessuna parte.
    if (await chiudiPopupTentativiSeAperto(page)) continue;
    const st = await statoQuiz(page, p);
    if (st.riepilogo) return null;
    if (st.ripasso) { await page.click('#' + p + '-retry-continue-btn'); continue; }
    if (st.revealAperto) { await page.click('#' + p + '-advance-btn'); continue; }
    if (!st.quiz || !st.opzioni) return null;
    if (st.indice !== null && st.indice === st.totale) {
      await page.click('#' + p + '-dontknow-btn');
      continue;
    }
    const prima = st.contatore;
    await page.click('#' + p + '-options .sr-option >> nth=0');
    // Giusta o sbagliata si legge dallo stato, non dal tempo: la classe la
    // mette il gestore del click, sincrono con il click stesso.
    const giusta = await page.evaluate((pre) =>
      document.querySelector('#' + pre + '-options .sr-option.is-correct') !== null &&
      document.querySelector('#' + pre + '-options .sr-option.is-wrong') === null, p);
    if ((voluto === 'giusta') === giusta) return prima;
  }
  return null;
}

// L'attesa della domanda successiva, nella forma giusta: non un numero di
// millisecondi ma cio' che il lavoro produce — il contatore cambiato e il
// riquadro della risposta chiuso — con lo stato del pulsante letto DENTRO la
// stessa chiamata che ha aspettato. Fra un'attesa e una lettura separate la
// domanda puo' cambiare ancora.
function attendiDomandaSuccessiva(page, p, contatorePrecedente) {
  return page.waitForFunction((a) => {
    const b = document.getElementById(a.pre + '-dontknow-btn');
    const c = document.getElementById(a.pre + '-counter');
    const rev = document.getElementById(a.pre + '-reveal');
    if (!b || !c || !rev) return null;
    if (!rev.hidden) return null;
    if (c.textContent.trim() === a.prima) return null;
    return { spento: b.disabled, nascosto: b.hidden, contatore: c.textContent.trim() };
  }, { pre: p, prima: contatorePrecedente }, { timeout: 15000 })
    .then(h => h.jsonValue()).catch(() => null);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Match Practice: "Non lo so" disables together with options after a CORRECT answer ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'QMDontKnowTester', stepsBefore('matchEngIta'));
    await openModule(page, 'matchEngIta');
    await page.click('#qm-start-btn').catch(() => {});
    await page.waitForTimeout(200);
    const beforeDisabled = await page.evaluate(() => document.getElementById('qm-dontknow-btn').disabled);
    log('[QM Task1] "Non lo so" starts enabled on a fresh question', beforeDisabled === false);
    // Il giro si GUIDA (vedi toccaFinoA): non si tocca la prima opzione venti
    // volte sperando, e sull'ultima domanda del passaggio non si risponde mai.
    const contatorePrimaQM = await toccaFinoA(page, 'qm', 'giusta');
    log('[QM Task1] Managed to observe a correct-answer tap within retries', contatorePrimaQM !== null);
    if (contatorePrimaQM !== null) {
      const dontKnowDisabledRightAfter = await page.evaluate(() => document.getElementById('qm-dontknow-btn').disabled);
      log('[QM Task1] "Non lo so" is disabled immediately after a CORRECT tap (bug fix)', dontKnowDisabledRightAfter === true);
    }
    // La domanda successiva si aspetta, non si cronometra.
    const dopoQM = contatorePrimaQM === null ? null : await attendiDomandaSuccessiva(page, 'qm', contatorePrimaQM);
    log('[QM Task1] "Non lo so" resets to enabled on the next question (not stuck disabled)',
      dopoQM !== null && dopoQM.spento === false);
    log('[QM Task1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Match Practice: Spiegazione + Help visible AND enabled during the quiz ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'QMHeaderTester', stepsBefore('matchItaEng'));
    await openModule(page, 'matchItaEng');
    await page.click('#qm-start-btn').catch(() => {});
    // Una sola attesa per quattro asserzioni: si aspetta che la barra del quiz sia a
    // schermo, poi si leggono i quattro stati in una chiamata sola (regola 19).
    await attendiVisibile(page, '#match-watch-btn');
    const state = await page.evaluate(() => {
      var w = document.getElementById('match-watch-btn');
      var h = document.getElementById('match-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[QM Task2] Spiegazione is visible during the quiz', state.watchHidden === false);
    log('[QM Task2] Help is visible during the quiz', state.helpHidden === false);
    log('[QM Task3] Spiegazione stays enabled during the quiz (no timer in Match Practice)', state.watchDisabled === false);
    log('[QM Task3] Help stays enabled during the quiz (no timer in Match Practice)', state.helpDisabled === false);
    // Clicking Spiegazione during the quiz should actually open the overlay.
    await page.click('#match-watch-btn');
    const overlayVisible = await attendiVisibile(page, '#howitworks-overlay');
    log('[QM Task2] Spiegazione click opens the overlay mid-quiz', overlayVisible);
    log('[QM Task2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: "Non lo so" disables together with options, and resets per question ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.addInitScript(() => {
      // Speed up the per-question timer + 3-2-1 so the test stays fast.
      window.__preConfigOverride = true;
    });
    await bootAsUser(page, 'SRDontKnowTester', stepsBefore('speedMatchEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 30; // long enough that the timeout never fires mid-test
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300); // 3-2-1 countdown
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const beforeDisabled = await page.evaluate(() => document.getElementById('sr-dontknow-btn').disabled);
    log('[SR Task1] "Non lo so" starts enabled on a fresh question', beforeDisabled === false);

    // RISCRITTO il 2026-09-08. Prima questo blocco toccava sempre la prima
    // opzione fra quattro sperando che capitasse quella giusta, e poi aspettava
    // 800 ms fissi prima di leggere lo stato. Misurato: rosso 2 giri su 3 sullo
    // stesso codice. Quando il ciclo si esauriva senza trovarne una giusta, il
    // file eseguiva 39 asserzioni invece di 40 — l'ultima vive dentro il ramo
    // gotCorrect e semplicemente non girava.
    //
    // Adesso la situazione si COSTRUISCE invece di sperarci, con la stessa
    // tecnica di tests/test_match_practice_nonloso.js:
    //   - sull'ULTIMA domanda del passaggio non si risponde mai giusto di
    //     proposito: li' la risposta giusta chiude il passaggio e la "domanda
    //     successiva" da misurare non esiste. Si dichiara "non lo so", cosi' la
    //     voce torna nel giro di ripasso e altre domande dopo ci sono di sicuro;
    //   - il limite del ciclo non e' un numero a occhio: e' quante domande
    //     esistono per quanti passaggi la coda di ripasso ammette;
    //   - l'attesa finale non e' un tempo: e' la domanda successiva a schermo,
    //     riconosciuta dal contatore cambiato e dal riquadro della risposta
    //     chiuso, con lo stato del pulsante letto DENTRO la stessa chiamata.
    // Stesso giro guidato dei tre blocchi gemelli (vedi toccaFinoA): la prima
    // versione di questo blocco sperava, ed era rossa 2 giri su 3.
    const contatorePrimaSR = await toccaFinoA(page, 'sr', 'giusta');
    log('[SR Task1] Managed to observe a correct-answer tap within retries', contatorePrimaSR !== null);
    if (contatorePrimaSR !== null) {
      const dontKnowDisabledRightAfter = await page.evaluate(() => document.getElementById('sr-dontknow-btn').disabled);
      log('[SR Task1] "Non lo so" is disabled immediately after a CORRECT tap (bug fix, same as Match Practice)', dontKnowDisabledRightAfter === true);
    }
    const dopoSR = contatorePrimaSR === null ? null : await attendiDomandaSuccessiva(page, 'sr', contatorePrimaSR);
    log('[SR Task1] "Non lo so" resets to enabled on the next question (not stuck disabled)',
      dopoSR !== null && dopoSR.spento === false);
    log('[SR Task1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: Spiegazione + Help visible during the quiz, DISABLED while the timer bar runs, ENABLED once it stops ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRHeaderTester', stepsBefore('speedMatchItaEng'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 30;
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchItaEng');
    // Buttons should be visible+enabled on the start screen (before the countdown/timer ever runs).
    const startState = await page.evaluate(() => {
      var w = document.getElementById('speed-match-watch-btn');
      var h = document.getElementById('speed-match-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[SR Task2] Spiegazione visible on start screen', startState.watchHidden === false);
    log('[SR Task2] Help visible on start screen', startState.helpHidden === false);
    log('[SR Task3] Spiegazione/Help enabled on start screen (no timer running yet)', startState.watchDisabled === false && startState.helpDisabled === false);
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const duringTimer = await page.evaluate(() => {
      var w = document.getElementById('speed-match-watch-btn');
      var h = document.getElementById('speed-match-help-btn');
      return { watchHidden: w.hidden, watchDisabled: w.disabled, helpHidden: h.hidden, helpDisabled: h.disabled };
    });
    log('[SR Task2] Spiegazione stays visible while the quiz timer runs (bug fix — was hidden entirely before)', duringTimer.watchHidden === false);
    log('[SR Task2] Help stays visible while the quiz timer runs', duringTimer.helpHidden === false);
    log('[SR Task3] Spiegazione is DISABLED while the timer bar is running', duringTimer.watchDisabled === true);
    log('[SR Task3] Help is DISABLED while the timer bar is running', duringTimer.helpDisabled === true);
    // A WRONG tap shows the reveal (something to read) -> header unlocks.
    // Stesso giro guidato degli altri tre blocchi (toccaFinoA): qui l'esito
    // voluto e' quello SBAGLIATO, che e' tre volte piu' probabile — ma la forma
    // del ciclo era identica, e un ciclo che si esaurisce fallisce allo stesso
    // modo. Si corregge la specie, non l'esemplare che e' caduto.
    const contatorePrimaW = await toccaFinoA(page, 'sr', 'sbagliata');
    const gotWrong = contatorePrimaW !== null;
    {
      if (gotWrong) {
        const afterWrong = await page.evaluate(() => {
          var w = document.getElementById('speed-match-watch-btn');
          var h = document.getElementById('speed-match-help-btn');
          return { watchDisabled: w.disabled, helpDisabled: h.disabled };
        });
        log('[SR Task3-adj] Spiegazione re-enabled once the WRONG-answer reveal is shown (something to read)', afterWrong.watchDisabled === false);
        log('[SR Task3-adj] Help re-enabled once the WRONG-answer reveal is shown', afterWrong.helpDisabled === false);
        await page.click('#sr-advance-btn');
      }
    }
    log('[SR Task3-adj] Managed to observe a wrong-answer tap within retries', gotWrong);
    log('[SR Task2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: on a CORRECT answer, Spiegazione+Help stay DISABLED through the short pause (no flicker) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRCorrectNoFlickerTester', stepsBefore('speedMatchEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 30;
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    // Stesso giro guidato: era questo il blocco caduto nella corsa del
    // 2026-09-08, dopo che [SR Task1] era gia' stato corretto — la prova che si
    // stava curando un esemplare per volta.
    const contatorePrimaAdj = await toccaFinoA(page, 'sr', 'giusta');
    const gotCorrect = contatorePrimaAdj !== null;
    {
      if (gotCorrect) {
        // Le tre letture qui sotto sono a tempo APPOSTA, e restano: verificano
        // che un pulsante NON si accenda dentro una finestra (la pausa di
        // feedback). Per un evento che non deve accadere non esiste una
        // condizione da aspettare — e' l'eccezione dichiarata in
        // tests/ATTESE-FISSE.md.
        const rightAfterTap = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione stays DISABLED right after a CORRECT tap (nothing to read, no flicker)', rightAfterTap === true);
        await page.waitForTimeout(300); // still mid-pause (feedbackPauseMs 600)
        const midPause = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione still DISABLED mid-pause, before auto-advance (the exact flicker this fixes)', midPause === true);
        await page.waitForTimeout(500); // past feedbackPauseMs, into the next question's timer
        const nextQuestion = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
        log('[SR Task3-adj] Spiegazione still DISABLED into the next question (its own timer just re-locked it)', nextQuestion === true);
      }
    }
    log('[SR Task3-adj] Managed to observe a correct-answer tap within retries', gotCorrect);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: "Non lo so" also unlocks Spiegazione/Help (a reveal case, same as a wrong tap) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRDontKnowUnlocksTester', stepsBefore('speedMatchItaEng'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 30;
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchItaEng');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const lockedBefore = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione is locked while the timer runs, right before "Non lo so"', lockedBefore === true);
    await page.click('#sr-dontknow-btn');
    await page.waitForTimeout(30);
    const unlockedAfter = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione unlocks right after "Non lo so" (its own reveal is a case to read)', unlockedAfter === false);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: a TIMEOUT also unlocks Spiegazione/Help (the third reveal case) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRTimeoutUnlocksTester', stepsBefore('speedMatchEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 0.2; // let it expire quickly
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    await page.waitForFunction(() => !document.getElementById('sr-reveal').hidden, { timeout: 3000 });
    const unlockedAfterTimeout = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
    log('[SR Task3-adj] Spiegazione unlocks right after a TIMEOUT reveal (the third reveal case)', unlockedAfterTimeout === false);
    log('[SR Task3-adj] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Speed Match: leaving mid-timer (back to map) doesn't leave Spiegazione/Help stuck disabled ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRLeaveMidTimerTester', stepsBefore('speedMatchEngIta'));
    await page.evaluate(() => {
      window.APP_CONFIG.speedMatch.timeLimitSeconds = 30;
      window.APP_CONFIG.speedMatch.countdownSeconds = 1;
      window.APP_CONFIG.speedMatch.countdownStepMs = 30;
    });
    await openModule(page, 'speedMatchEngIta');
    await page.click('#sr-ready-btn').catch(() => {});
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.getElementById('sr-quiz-screen').hidden, { timeout: 3000 });
    const midTimerDisabled = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
    log('[SR cleanup] Header is disabled mid-timer, as expected, right before leaving', midTimerDisabled === true);
    // Leave the module mid-timer via the Mappa button.
    await page.click('#speed-match-back-map');
    await page.waitForTimeout(150);
    // Re-open Speed Match fresh: on the start screen the header must NOT be stuck disabled.
    await openModule(page, 'speedMatchEngIta');
    const freshState = await page.evaluate(() => document.getElementById('speed-match-watch-btn').disabled);
    log('[SR cleanup] Re-opening after leaving mid-timer: Spiegazione is NOT stuck disabled (stopAllModuleActivity cleanup)', freshState === false);
    log('[SR cleanup] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
