// Prova end-to-end della segnalazione § 4.1 di docs/validazione.md.
//
// NON FA PARTE DELLA SUITE (run_full_regression.sh), di proposito: questo file
// verifica che un DIFETTO ci sia ancora, non che una cosa funzioni. Se finisse
// nella suite, il giorno in cui il § 4.1 viene corretto (decisione D1) la CI
// diventerebbe rossa proprio per la correzione — cioè il rosso vorrebbe dire
// "risolto", l'opposto di quello che un rosso deve significare. Si lancia a
// mano:  node tests/test_outcome_step_ids.js
// Quando D1 è decisa, va rovesciato (asserire la regola applicata) o tolto.
//
// La domanda: la regola di esito dichiarata in CONFIG.moduleOutcomeRules
// arriva anche alla SECONDA apparizione di uno stesso modulo nell'ordine?
// moduleOutcomeRules è indicizzato per id del MODULO ('quickMatchEngIta'),
// mentre i pulsanti di completamento lo interrogano con l'id del PASSO, che
// dalla seconda apparizione in poi è 'quickMatchEngIta-2' (moduleStepId).
//
// Il test non legge il codice: gioca l'episodio in un profilo pulito, dal
// primo passo fino alla seconda apparizione di Match Practice en→it, e
// confronta i due passi sulla mappa.
//
// Perché si risponde SBAGLIATO al primo giro e giusto al ripasso: con tutte
// le risposte giuste il punteggio è 100% -> verde, e il badge di un modulo
// verde dice "Completato" esattamente come quello di un modulo senza esito
// (OUTCOME_BADGE_LABEL ha solo giallo e rosso). I due casi si distinguerebbero
// solo dalla classe della riga. Rispondendo sbagliato il punteggio è 0% ->
// rosso -> badge "Da riprovare", e la differenza si vede anche nel testo.
const { launchBrowser, APP_URL } = require('./test-env');
const { loadGrade, playThroughQuiz } = require('./quiz-driver');
const { stepIds, gradeOf } = require('./module-order');

const BASE = APP_URL;
const USER = 'ProvaEsitoPassi';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 20); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

const visible = (page, sel) => page.evaluate(function (s) {
  const el = document.querySelector(s);
  return !!el && el.getClientRects().length > 0;
}, sel);

async function clickIfVisible(page, sel) {
  if (await visible(page, sel)) { await page.click(sel); return true; }
  return false;
}

// Aprire un modulo dalla mappa passa da una promessa (ensureEpisodeSlotFields),
// quindi la vista compare un tick dopo il click: si aspetta che uno dei
// selettori attesi sia davvero a schermo, mai un tempo fisso (regola 19).
async function waitForAny(page, selectors) {
  await page.waitForFunction(function (list) {
    return list.some(function (s) {
      const el = document.querySelector(s);
      return !!el && el.getClientRects().length > 0;
    });
  }, selectors, { timeout: 20000 });
}

// Profilo pulito: nessun progresso, nessun esito, nessun intro già chiuso.
async function bootFresh(page) {
  await page.goto(BASE);
  if (!(await visible(page, '#name-input'))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input', { state: 'visible' });
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', USER);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  await backOnMap(page);
}

async function openStep(page, stepId) {
  await page.waitForFunction(function (id) {
    const b = document.querySelector('[data-module="' + id + '"]');
    return !!b && !b.disabled;
  }, stepId, { timeout: 15000 });
  await page.click('[data-module="' + stepId + '"]');
}

// La mappa ha una propria schermata di spiegazione, e ricompare a ogni
// ritorno finché non si spunta "non mostrare più": si chiude ogni volta,
// invece di darla per chiusa una volta sola.
async function backOnMap(page) {
  await page.waitForSelector('#view-map.is-active', { state: 'attached', timeout: 15000 });
  await waitForAny(page, ['#map-intro-start-btn', '#module-list .module-row']);
  await clickIfVisible(page, '#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
}

// ---- un passo per tipo di modulo -------------------------------------

async function doPersonalizzazione(page) {
  await openStep(page, 'personalizzazione');
  await waitForAny(page, ['#customize-intro-start-btn', '#start-episode']);
  await clickIfVisible(page, '#customize-intro-start-btn');
  await page.waitForSelector('#start-episode', { state: 'visible' });
  await page.click('#start-episode');
  await backOnMap(page);
}

async function doStory(page, stepId) {
  await openStep(page, stepId);
  await waitForAny(page, ['#speak-easy-intro-start-btn', '#speak-easy-complete']);
  await clickIfVisible(page, '#speak-easy-intro-start-btn');
  await page.waitForFunction(() => {
    const b = document.getElementById('speak-easy-complete');
    return b && b.getClientRects().length > 0 && !b.disabled;
  }, null, { timeout: 15000 });
  await page.click('#speak-easy-complete');
  await page.waitForSelector('#speak-easy-complete-btn', { state: 'visible' });
  await page.click('#speak-easy-complete-btn');
  await backOnMap(page);
}

async function doRepeatAloud(page, stepId) {
  await openStep(page, stepId);
  await waitForAny(page, ['#repeat-aloud-intro-start-btn', '#repeat-aloud-complete']);
  await clickIfVisible(page, '#repeat-aloud-intro-start-btn');
  await page.waitForSelector('#repeat-aloud-complete', { state: 'visible' });
  await page.click('#repeat-aloud-complete');
  await page.waitForSelector('#repeat-aloud-complete-btn', { state: 'visible' });
  await page.click('#repeat-aloud-complete-btn');
  await backOnMap(page);
}

// Sbagliate al primo giro, giuste al ripasso: punteggio 0% (rosso) e coda di
// ripasso che si svuota in un solo giro, senza forzature.
async function doQuickMatch(page, stepId) {
  await openStep(page, stepId);
  await waitForAny(page, ['#qm-start-screen', '#qm-quiz-screen']);
  const vocabulary = loadGrade(gradeOf(stepId));
  await playThroughQuiz(page, 'qm', {
    vocabulary,
    answerFor: (st) => (st.inRetryPass ? 'correct' : 'wrong')
  });
  await page.waitForSelector('#qm-complete-btn', { state: 'visible' });
  await page.click('#qm-complete-btn');
  await backOnMap(page);
}

async function doFlashcard(page, stepId) {
  await openStep(page, stepId);
  await waitForAny(page, ['#fc-intro-start-btn', '#fc-card-screen']);
  await clickIfVisible(page, '#fc-intro-start-btn');
  for (let i = 0; i < 400; i++) {
    if (await visible(page, '#fc-summary-screen')) break;
    if (await visible(page, '#fc-retry-intro-screen')) { await page.click('#fc-retry-continue-btn'); continue; }
    if (await visible(page, '#attempt-popup.is-open')) { await page.click('#attempt-popup-next'); continue; }
    await page.waitForSelector('#fc-card', { state: 'visible', timeout: 15000 });
    const before = await page.textContent('#fc-counter');
    await page.click('#fc-card');
    await page.waitForSelector('#fc-know-it-btn', { state: 'visible' });
    await page.click('#fc-know-it-btn');
    await page.waitForFunction(function (prev) {
      const c = document.getElementById('fc-counter');
      const vis = (id) => { const e = document.getElementById(id); return !!e && e.getClientRects().length > 0; };
      const pop = document.getElementById('attempt-popup');
      return (c && c.textContent !== prev) || vis('fc-summary-screen') || vis('fc-retry-intro-screen')
        || (!!pop && pop.classList.contains('is-open'));
    }, before, { timeout: 15000 });
  }
  await page.waitForSelector('#fc-complete-btn', { state: 'visible' });
  await page.click('#fc-complete-btn');
  await backOnMap(page);
}

// Lo stato di una riga della mappa, come lo vede lo studente.
function readRow(page, stepId) {
  return page.evaluate(function (id) {
    const row = document.querySelector('[data-module="' + id + '"]');
    if (!row) return null;
    const badge = row.querySelector('.module-state-badge');
    return {
      badge: badge ? badge.textContent.trim() : null,
      classi: row.className.split(/\s+/).filter(c => c.indexOf('outcome-') === 0)
    };
  }, stepId);
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(mockInit);

  const ids = stepIds();
  const passo4 = ids[3];  // quickMatchEngIta   (grado A)
  const passo9 = ids[8];  // quickMatchEngIta-2 (grado B)

  console.log('Passo 4 dell\'ordine: ' + passo4 + '  (grado ' + gradeOf(passo4) + ')');
  console.log('Passo 9 dell\'ordine: ' + passo9 + '  (grado ' + gradeOf(passo9) + ')');
  console.log('');

  await bootFresh(page);
  await doPersonalizzazione(page);            // 1
  await doStory(page, ids[1]);                // 2  meetTheStory
  await doRepeatAloud(page, ids[2]);          // 3  repeatAloud
  await doQuickMatch(page, ids[3]);           // 4  quickMatchEngIta
  await doQuickMatch(page, ids[4]);           // 5  quickMatchItaEng
  await doFlashcard(page, ids[5]);            // 6  flashcardAEngIta
  await doFlashcard(page, ids[6]);            // 7  flashcardAItaEng
  await doRepeatAloud(page, ids[7]);          // 8  repeatAloud-2
  await doQuickMatch(page, ids[8]);           // 9  quickMatchEngIta-2

  const r4 = await readRow(page, passo4);
  const r9 = await readRow(page, passo9);
  const salvati = await page.evaluate(function (u) {
    return localStorage.getItem('baseinglese:moduleOutcome:episode1:' + u) || '{}';
  }, USER);

  console.log('BADGE IN MAPPA (profilo pulito, stesse risposte in entrambi i passi)');
  console.log('  passo 4  ' + passo4.padEnd(20) + ' badge: "' + r4.badge + '"   classi esito: [' + r4.classi.join(', ') + ']');
  console.log('  passo 9  ' + passo9.padEnd(20) + ' badge: "' + r9.badge + '"   classi esito: [' + r9.classi.join(', ') + ']');
  console.log('');
  console.log('ESITI SALVATI (baseinglese:moduleOutcome:episode1:' + USER + ')');
  console.log('  ' + salvati);
  console.log('');

  const uguali = r4.badge === r9.badge && r4.classi.join(',') === r9.classi.join(',');
  const esiti = JSON.parse(salvati);
  const ok = !uguali && !!esiti[passo4] && !esiti[passo9];

  if (uguali) {
    console.log('ESITO: i due badge sono UGUALI — l\'analisi del § 4.1 è sbagliata.');
  } else {
    console.log('ESITO: i due badge sono DIVERSI a parità di risposte.');
    console.log('       ' + passo4 + ' ha un esito salvato, ' + passo9 + ' no:');
    console.log('       moduleOutcomeRules["' + passo9 + '"] è undefined, quindi');
    console.log('       il pulsante di completamento non chiama saveModuleOutcome.');
  }
  if (errors.length) console.log('ERRORI JS IN PAGINA: ' + errors.join(' | '));

  console.log('');
  console.log(ok ? 'OK  - § 4.1 confermato' : 'FAIL - § 4.1 non confermato');
  await browser.close();
  process.exit(ok ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
