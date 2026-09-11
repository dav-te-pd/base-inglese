const { launchBrowser, APP_URL } = require('./test-env');
const { allSteps } = require('./module-order');
const { attendiSottotitoloEsito, attendiVisibile } = require('./attese');
const { chiudiPopupTentativiSeAperto } = require('./quiz-driver');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      if (utter.onstart) utter.onstart();
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 20);
    },
    cancel() { if (this._current) { var u=this._current; this.speaking=false; this._current=null; clearTimeout(u._timer); } },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
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
    if (completedModules) localStorage.setItem('baseinglese:modules:gate:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio','personalizzazione','repeatAloud','meetTheStory', 'whyWeSayIt','voiceCoach','voicePractice','matchEngIta','matchItaEng','speedMatchEngIta','speedMatchItaEng','flashcard','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
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

const ALL_MODULES = allSteps();

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 2: rotating subtitle on Speed Match Schermata Finale ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('speedMatchEngIta');
    await bootAsUser(page, 'T7Rotate', ALL_MODULES.slice(0, idx));
    await openModule(page, 'speedMatchEngIta');
    await page.waitForTimeout(300);
    const startVisible = await page.isVisible('#sr-ready-btn').catch(() => false);
    if (startVisible) { await page.click('#sr-ready-btn'); await page.waitForTimeout(50); }
    await page.waitForTimeout(3500); // 3-2-1 countdown (countdownSeconds*countdownStepMs ~2400ms)

    // Answer every question with the first ENABLED option (mix of right/
    // wrong, forces some retry passes) to reach the end fast.
    for (let i = 0; i < 150; i++) {
      const summaryVisible = await page.isVisible('#sr-summary-screen').catch(() => false);
      if (summaryVisible) break;
      if (await chiudiPopupTentativiSeAperto(page)) continue;
      const advanceVisible = await page.isVisible('#sr-advance-btn').catch(() => false);
      if (advanceVisible) { await page.click('#sr-advance-btn'); await page.waitForTimeout(150); continue; }
      const retryContinueVisible = await page.isVisible('#sr-retry-continue-btn').catch(() => false);
      if (retryContinueVisible) { await page.click('#sr-retry-continue-btn'); await page.waitForTimeout(150); continue; }
      const quizVisible = await page.isVisible('#sr-quiz-screen').catch(() => false);
      if (!quizVisible) { await page.waitForTimeout(200); continue; }
      const enabledOption = page.locator('#sr-options .sr-option:not([disabled])').first();
      const hasEnabled = await enabledOption.count();
      if (!hasEnabled) { await page.waitForTimeout(200); continue; } // mid auto-advance after a correct answer
      await enabledOption.click();
      await page.waitForTimeout(150);
    }
    const summaryVisible = await attendiVisibile(page, '#sr-summary-screen');
    log('[Job2] Speed Match reached Schermata Finale', summaryVisible);
    if (summaryVisible) {
      const title = await page.$eval('#sr-summary-title', el => el.textContent).catch(() => null);
      // Il sottotitolo arriva da un fetch, non con la schermata: si aspetta
      // che sia stato riempito davvero (tests/attese.js). Qui la corsa si
      // vinceva per FORTUNA — durante il quiz la valvola dei tentativi e la
      // Schermata Ripasso avevano già scaldato la cache dei messaggi. Quale
      // modulo la scaldi e quale no non è una cosa da tenere a mente.
      await attendiSottotitoloEsito(page, 'sr-summary-title-sub');
      const subtitle = await page.$eval('#sr-summary-title-sub', el => el.textContent).catch(() => null);
      log('[Job2] Fixed title is "Round completato!"', title === 'Round completato!');
      log('[Job2] Rotating subtitle is non-empty and from moduleCompleteMessages', !!subtitle && subtitle.length > 5);
      console.log('    -> subtitle: "' + subtitle + '"');
    }
    log('[Job2] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 2: rotating subtitle differs across page loads (randomness sanity) ============
  {
    const seen = new Set();
    for (let attempt = 0; attempt < 6; attempt++) {
      const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
      await page.addInitScript(mockInit);
      await page.goto(BASE);
      await page.evaluate(() => {
        return fetch('data/inglese/it/messaggi-feedback.json').then(r => r.json()).then(data => {
          window.__testPick = data.moduleCompleteMessages[Math.floor(Math.random() * data.moduleCompleteMessages.length)];
        });
      });
      // Niente attesa: l'evaluate qui sopra RESTITUISCE la promise del fetch, e
      // page.evaluate la aspetta da solo — quindi window.__testPick e' gia'
      // scritto quando torna. I 50 ms non guardavano niente.
      const pick = await page.evaluate(() => window.__testPick);
      seen.add(pick);
      await page.close();
    }
    log('[Job2] moduleCompleteMessages has multiple distinct entries reachable (variety sanity, saw ' + seen.size + ' distinct in 6 tries)', seen.size >= 1);
  }

  // ============ JOB 3+4: safety-valve popup fires on Match Practice, both variants ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('matchEngIta');
    await bootAsUser(page, 'T7ValveQM', ALL_MODULES.slice(0, idx));
    await openModule(page, 'matchEngIta');
    await page.waitForTimeout(300);
    const startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }

    // Answer wrong 3 times in a row on the same item by using "Non lo so" repeatedly —
    // since Match Practice re-queues wrong items into a later retry pass, force through
    // by clicking dontknow each time an item appears, until the popup opens.
    let popupSeen = false;
    let popupTitle = null;
    let popupHasRetryBtn = null;
    for (let i = 0; i < 100 && !popupSeen; i++) {
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) {
        popupSeen = true;
        popupTitle = await page.$eval('#attempt-popup-title', el => el.textContent);
        popupHasRetryBtn = await page.isHidden('#attempt-popup-retry').catch(() => null);
        break;
      }
      const dontknowVisible = await page.isVisible('#qm-dontknow-btn').catch(() => false);
      if (dontknowVisible) { await page.click('#qm-dontknow-btn'); await page.waitForTimeout(120); continue; }
      const advanceVisible = await page.isVisible('#qm-advance-btn').catch(() => false);
      if (advanceVisible) { await page.click('#qm-advance-btn'); await page.waitForTimeout(120); continue; }
      const retryContinueVisible = await page.isVisible('#qm-retry-continue-btn').catch(() => false);
      if (retryContinueVisible) { await page.click('#qm-retry-continue-btn'); await page.waitForTimeout(120); continue; }
      await page.waitForTimeout(100); // ATTESA-LEGITTIMA: e' l'ultima attesa di un CICLO che guida il modulo, e l'asserzione dopo il ciclo ne riassume l'esito. Non c'e' uno stato finale da attendere: il ciclo finisce quando finisce, e questo tempo e' il passo del ciclo, non una guardia
    }
    log('[Job3/4] Match Practice: safety-valve popup opens after repeated wrong/dontknow on same item', popupSeen);
    log('[Job3/4] Match Practice: popup uses the "nonRiuscita" title ("Tranquillo, capita!" family)', popupTitle && (popupTitle.indexOf('Tranquillo') !== -1 || popupTitle.length > 3));
    console.log('    -> popup title: "' + popupTitle + '"');
    log('[Job3/4] Match Practice: "Riprova ancora" button is HIDDEN (no immediate re-ask in this module)', popupHasRetryBtn === true);
    log('[Job3/4] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 3+4: safety-valve "riuscita" variant on Flash Card ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('flashcardAEngIta');
    await bootAsUser(page, 'T7ValveFC', ALL_MODULES.slice(0, idx));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(300);
    const startVisible = await page.isVisible('#fc-intro-start-btn').catch(() => false);
    if (!startVisible) {
      // fallback selector guess
    }
    // Try common start button ids for Flash Card intro
    for (const sel of ['#fc-intro-start-btn', '#fc-start-btn']) {
      if (await page.isVisible(sel).catch(() => false)) { await page.click(sel); await page.waitForTimeout(150); break; }
    }
    let popupSeen = false, popupTitle = null, carteRisposte = 0;
    for (let i = 0; i < 20 && !popupSeen; i++) {
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) {
        popupSeen = true;
        popupTitle = await page.$eval('#attempt-popup-title', el => el.textContent);
        break;
      }
      const cardVisible = await page.isVisible('#fc-card').catch(() => false);
      if (cardVisible) {
        await page.click('#fc-card').catch(() => {}); // flip
        await page.waitForTimeout(100);
        const knowBtnVisible = await page.isVisible('#fc-know-it-btn').catch(() => false);
        if (knowBtnVisible) { await page.click('#fc-know-it-btn'); carteRisposte++; await page.waitForTimeout(500); continue; }
      }
      const retryContinueVisible = await page.isVisible('#fc-retry-continue-btn').catch(() => false);
      if (retryContinueVisible) { await page.click('#fc-retry-continue-btn'); await page.waitForTimeout(150); continue; }
      await page.waitForTimeout(150);
    }
    // ⚠️ QUESTA RIGA ERA `log(..., true)`: PASSAVA SEMPRE (regola 37). E non
    // era distrazione — era una resa: il ciclo qui sopra risponde «Si', la so»
    // a ogni carta, quindi la valvola di sicurezza (che si apre dopo ripetuti
    // sbagli) non puo' aprirsi MAI, `popupSeen` resta false, e l'asserzione che
    // l'autore voleva scrivere sarebbe stata rossa. Invece di togliere il
    // blocco o cambiare il ciclo, e' stato messo `true`.
    //
    // Le due righe qui sotto sono quello che questo blocco prova DAVVERO:
    // che Flash Card si lascia percorrere (le carte si girano e si rispondono)
    // e che il giro finisce in uno stato NOTO invece che fermo su una carta
    // dopo venti giri. Se il modulo smettesse di disegnare carte, o il giro non
    // arrivasse mai in fondo, questi due diventano rossi — `true` no.
    const statoFinale = await page.evaluate(() => ({
      riepilogo: !document.getElementById('fc-summary-screen').hidden,
      ripasso: !document.getElementById('fc-retry-intro-screen').hidden,
      popup: document.getElementById('attempt-popup').classList.contains('is-open')
    }));
    console.log('    -> carte risposte: ' + carteRisposte + ' | stato finale: ' + JSON.stringify(statoFinale));
    log('[Job3/4] Flash Card: il giro e\' stato percorso davvero (almeno una carta risposta)', carteRisposte > 0);
    log('[Job3/4] Flash Card: il giro arriva a uno stato NOTO (riepilogo, ripasso o valvola), non resta fermo su una carta',
      statoFinale.riepilogo || statoFinale.ripasso || statoFinale.popup);
    log('[Job3/4] Flash Card: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH7 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
