// PROTEGGE: che la regola di esito e la regola del tentativo arrivino a OGNI
// apparizione di un modulo nell'ordine, non solo alla prima. Senza, la mappa
// torna a colorare il passo 4 e a lasciare grigio il passo 9 a parità di
// risposte, in silenzio — che è com'era prima della correzione del 2026-09-05.
//
// Storia di questo file: è nato per DIMOSTRARE il difetto del § 4.1 di
// docs/validazione.md (la regola cercata con l'id del PASSO, che dalla seconda
// apparizione in poi è 'quickMatchEngIta-2', invece che con l'id del MODULO),
// e per quel motivo stava fuori dalla suite: un test che asserisce un difetto
// diventa rosso proprio quando il difetto viene corretto. Corretto il difetto
// (index.html: sette letture passate a .moduleId, CONFIG.attemptRule tolta e
// sostituita da module.voiceVariant), il file è stato rovesciato ed è entrato
// nella suite. Vedi docs/correzioni.md.
//
// Il test non legge il codice: gioca l'episodio in un profilo pulito, dal
// primo passo fino alla seconda apparizione di Match Practice en→it, e
// confronta i due passi sulla mappa.
//
// Perché si risponde SBAGLIATO al primo giro e giusto al ripasso: con tutte
// le risposte giuste il punteggio è 100% -> verde, e il badge di un modulo
// verde dice "Completato" esattamente come quello di un modulo senza esito
// (OUTCOME_BADGE_LABEL ha solo giallo e rosso). I due casi si distinguerebbero
// solo dalla classe della riga, ed è esattamente il motivo per cui il difetto
// era invisibile a schermo. Rispondendo sbagliato il punteggio è 0% -> rosso
// -> badge "Da riprovare", e la differenza (o la sua assenza) si vede anche
// nel testo.
const { launchBrowser, APP_URL } = require('./test-env');
const { loadGrade, playThroughQuiz } = require('./quiz-driver');
const { stepIds, gradeOf, stepsBefore } = require('./module-order');

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

// Un profilo con i passi precedenti già segnati come fatti: serve solo ad
// arrivare a un passo lontano nell'ordine senza rigiocare tutto. Il blocco [A]
// NON usa questa scorciatoia — lì il punto è proprio giocare davvero.
async function bootSeeded(page, userName, completed) {
  await page.goto(BASE);
  if (!(await visible(page, '#name-input'))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input', { state: 'visible' });
  }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(function (arg) {
    localStorage.setItem('baseinglese:modules:episode1:' + arg.userName,
      JSON.stringify({ completed: arg.completed }));
  }, { userName: userName, completed: completed });
  await page.click('#go-episode');
  await backOnMap(page);
}

async function run() {
  const browser = await launchBrowser();
  const risultati = [];
  const log = (msg, ok) => { risultati.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const ids = stepIds();
  const passo4 = ids[3];   // quickMatchEngIta   (prima apparizione)
  const passo9 = ids[8];   // quickMatchEngIta-2 (seconda apparizione)
  const passo12 = ids[11]; // voicePractice      (prima apparizione)
  const passo16 = ids[15]; // voicePractice-2    (seconda apparizione)

  // ============ [A] La regola di esito arriva alla seconda apparizione ============
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);

    console.log('[A] Passo 4 dell\'ordine: ' + passo4 + '  (grado ' + gradeOf(passo4) + ')');
    console.log('[A] Passo 9 dell\'ordine: ' + passo9 + '  (grado ' + gradeOf(passo9) + ')');

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
    const esiti = JSON.parse(salvati);

    console.log('    passo 4  ' + passo4.padEnd(20) + ' badge: "' + r4.badge + '"   classi esito: [' + r4.classi.join(', ') + ']');
    console.log('    passo 9  ' + passo9.padEnd(20) + ' badge: "' + r9.badge + '"   classi esito: [' + r9.classi.join(', ') + ']');
    console.log('    esiti salvati: ' + salvati);

    log('[A] La prima apparizione salva un esito', !!esiti[passo4]);
    log('[A] Anche la SECONDA apparizione salva un esito', !!esiti[passo9]);
    log('[A] I due esiti hanno lo stesso livello a parità di risposte',
      !!esiti[passo4] && !!esiti[passo9] && esiti[passo4].level === esiti[passo9].level);
    log('[A] I due badge in mappa sono uguali', r4.badge === r9.badge);
    log('[A] Le due righe portano le stesse classi di esito',
      r4.classi.join(',') === r9.classi.join(','));
    log('[A] La classe di esito c\'è davvero (non sono uguali perché entrambe vuote)',
      r4.classi.length > 0);
    log('[A] Nessun errore JS', errors.length === 0);
    if (errors.length) console.log('    ' + errors.join(' | '));
    await page.close();
  }

  // ============ [B] La regola del tentativo non passa più da una tabella ============
  //
  // LastAttemptRule/FirstAttemptRule vive ora in module.voiceVariant, che sta
  // nel descrittore: le due apparizioni di Voice Practice condividono lo stesso
  // descrittore, quindi la regola non può divergere per costruzione. Qui si
  // guarda la traccia visibile di vcVariant sulla SECONDA apparizione — riga di
  // ritentativo e testo del pulsante, gli unici segni a schermo di quale delle
  // due varianti è aperta (vedi openVoiceCoach).
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);

    console.log('[B] Passo 12 dell\'ordine: ' + passo12);
    console.log('[B] Passo 16 dell\'ordine: ' + passo16);

    const leggiVariante = () => page.evaluate(function () {
      return {
        rigaRitentativo: document.getElementById('vc-retry-row').hidden,
        testoRitentativo: document.getElementById('voice-coach-retry-btn').textContent.trim()
      };
    });

    await bootSeeded(page, 'ProvaTentativo12', stepsBefore(passo12));
    await openStep(page, passo12);
    await waitForAny(page, ['#voice-coach-intro-start-btn', '#vc-target']);
    const v12 = await leggiVariante();

    await bootSeeded(page, 'ProvaTentativo16', stepsBefore(passo16));
    await openStep(page, passo16);
    await waitForAny(page, ['#voice-coach-intro-start-btn', '#vc-target']);
    const v16 = await leggiVariante();

    console.log('    passo 12  riga ritentativo nascosta: ' + v12.rigaRitentativo + '   pulsante: "' + v12.testoRitentativo + '"');
    console.log('    passo 16  riga ritentativo nascosta: ' + v16.rigaRitentativo + '   pulsante: "' + v16.testoRitentativo + '"');

    log('[B] Il passo 12 si apre come Voice Practice (LastAttemptRule)',
      v12.rigaRitentativo === false && v12.testoRitentativo === 'Esercitati ancora');
    log('[B] Anche il passo 16 si apre come Voice Practice, identico al 12',
      v16.rigaRitentativo === v12.rigaRitentativo && v16.testoRitentativo === v12.testoRitentativo);
    log('[B] Nessun errore JS', errors.length === 0);
    if (errors.length) console.log('    ' + errors.join(' | '));
    await page.close();
  }

  // ============ [C] La tabella indicizzata per id del passo non è tornata ============
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    await page.goto(BASE);
    const stato = await page.evaluate(function () {
      const c = window.APP_CONFIG;
      const regole = c.moduleOutcomeRules || {};
      return {
        attemptRule: typeof c.attemptRule,
        chiaviConSuffisso: Object.keys(regole).filter(function (k) { return /-\d+$/.test(k); })
      };
    });
    log('[C] CONFIG.attemptRule non esiste più', stato.attemptRule === 'undefined');
    log('[C] moduleOutcomeRules non ha chiavi con suffisso di passo (-2, -3)',
      stato.chiaviConSuffisso.length === 0);
    if (stato.chiaviConSuffisso.length) console.log('    ' + stato.chiaviConSuffisso.join(', '));
    await page.close();
  }

  await browser.close();
  const falliti = risultati.filter(function (r) { return !r; }).length;
  console.log('');
  console.log(falliti === 0
    ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
