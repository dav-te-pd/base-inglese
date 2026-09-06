// PROTEGGE: la scala dei colori per voce (applyMasteryResult) — sale solo con
// la costanza, scende di un gradino solo, non salta, e onora
// CONFIG.mastery.promotionStreak invece di avere il numero cablato dentro.
// È il dato più costoso da ricostruire dell'intera app: si accumula per voce,
// per utente, su ogni modulo, e una regressione qui non si vede in nessuna
// schermata — si vede solo dopo settimane, in colori sbagliati che nessuno
// sa più da dove vengono.
//
// COME. La funzione sta dentro la chiusura di index.html e da fuori non si
// chiama. Invece di esporla apposta per il test (cioè cambiare il codice per
// farlo misurare), si semina lo stato di partenza in
// baseinglese:mastery:<episodio>:<utente> e si dà UNA risposta in Flash Card,
// che è il modulo con la scala più diretta ("Sì, la so" = correct, "Non
// ancora" = wrong). Quattro transizioni, quattro profili puliti, una risposta
// ciascuna: nessuna dipende dall'esito della precedente.
//
// Perché si semina lo STESSO valore su tutte le voci: il mazzo è mescolato
// (srShuffle), quindi non si sa quale carta esce per prima. Seminando tutte
// allo stesso stato, qualunque carta esca la transizione da verificare è
// quella. Alla fine si cerca l'unica voce che è cambiata.
//
// promotionStreak si abbassa a 1 dagli override del Pannello Admin
// (baseinglese:configOverrides), non modificando il file: così il test pinna
// anche che il parametro venga davvero letto. Il caso [C] lo rilegge a 2 —
// se la funzione avesse il numero cablato, [A] e [C] non potrebbero dare
// risultati diversi.
const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore, gradeOf } = require('./module-order');
const { loadGrade } = require('./quiz-driver');

const PASSO = 'flashcardAEngIta'; // prima apparizione di Flash Card, grado A
const PRIMA = stepsBefore(PASSO);

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

async function waitForAny(page, selectors) {
  await page.waitForFunction(function (list) {
    return list.some(function (s) {
      const el = document.querySelector(s);
      return !!el && el.getClientRects().length > 0;
    });
  }, selectors, { timeout: 20000 });
}

// Un profilo nuovo, con i passi precedenti già fatti, la scala seminata e
// promotionStreak impostato dagli override. Poi apre Flash Card.
async function preparaEApri(page, utente, semina, promotionStreak) {
  await page.goto(APP_URL);
  if (!(await visible(page, '#name-input'))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input', { state: 'visible' });
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });

  await page.evaluate(function (arg) {
    localStorage.setItem('baseinglese:modules:episode1:' + arg.utente,
      JSON.stringify({ completed: arg.prima }));
    localStorage.setItem('baseinglese:configOverrides',
      JSON.stringify({ mastery: { promotionStreak: arg.streak } }));
    ['mappaEpisodio', 'personalizzazione', 'flashcardLevelA'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + arg.utente, '1');
    });
  }, { utente: utente, prima: PRIMA, streak: promotionStreak });

  // Ricarica perché gli override si applicano al boot (applyConfigOverrides).
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });

  // La scala si semina DOPO il reload: sopravvive comunque, ma così è
  // evidente che è lo stato di partenza di questa prova e non un residuo.
  const seminate = await page.evaluate(function (arg) {
    const store = {};
    (arg.ids || []).forEach(function (id) { store[id] = arg.semina; });
    if (arg.semina) {
      localStorage.setItem('baseinglese:mastery:episode1:' + arg.utente, JSON.stringify(store));
    } else {
      localStorage.removeItem('baseinglese:mastery:episode1:' + arg.utente);
    }
    return store;
  }, { utente: utente, semina: semina.stato, ids: semina.unitIds });

  await page.click('#go-episode');
  await clickIfVisible(page, '#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  await page.click('[data-module="' + PASSO + '"]');
  await waitForAny(page, ['#fc-intro-start-btn', '#fc-card']);
  await clickIfVisible(page, '#fc-intro-start-btn');
  await page.waitForSelector('#fc-card', { state: 'visible', timeout: 15000 });

  const streakLetto = await page.evaluate(() => window.APP_CONFIG.mastery.promotionStreak);
  return { seminate: seminate, streakLetto: streakLetto };
}

// Gira una carta e risponde. 'correct' = "Sì, la so", 'wrong' = "Non ancora".
async function rispondi(page, utente, esito) {
  await page.click('#fc-card');
  const btn = esito === 'correct' ? '#fc-know-it-btn' : '#fc-not-yet-btn';
  await page.waitForSelector(btn, { state: 'visible' });
  await page.click(btn);
  await page.waitForFunction(function (u) {
    const raw = localStorage.getItem('baseinglese:mastery:episode1:' + u);
    return !!raw && Object.keys(JSON.parse(raw)).length > 0;
  }, utente, { timeout: 15000 });
}

function leggiScala(page, utente) {
  return page.evaluate(function (u) {
    return JSON.parse(localStorage.getItem('baseinglese:mastery:episode1:' + u) || '{}');
  }, utente);
}

// L'unica voce cambiata rispetto a quanto seminato.
function vociCambiate(dopo, seminate) {
  return Object.keys(dopo).filter(function (id) {
    return JSON.stringify(dopo[id]) !== JSON.stringify(seminate[id]);
  });
}

async function run() {
  const browser = await launchBrowser();
  const risultati = [];
  const log = (msg, ok) => { risultati.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // Gli unitId che Flash Card userà: 'flashcard-<grado>:<idVoce>:<direzione>'.
  const grado = gradeOf(PASSO);
  const unitIds = loadGrade(grado).map(function (v) { return 'flashcard-' + grado + ':' + v.id + ':en-it'; });
  console.log('Passo ' + PASSO + ' (grado ' + grado + '), ' + unitIds.length + ' voci\n');

  // Una prova: semina, una risposta, legge la voce cambiata.
  async function prova(etichetta, utente, semina, streak, esito) {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const { seminate, streakLetto } = await preparaEApri(page, utente,
      { stato: semina, unitIds: unitIds }, streak);
    await rispondi(page, utente, esito);
    const dopo = await leggiScala(page, utente);
    const cambiate = vociCambiate(dopo, seminate);
    const valore = cambiate.length === 1 ? dopo[cambiate[0]] : null;
    console.log(etichetta);
    console.log('    promotionStreak letto dall\'app: ' + streakLetto +
      ' | partenza: ' + JSON.stringify(semina) + ' | risposta: ' + esito);
    console.log('    voci cambiate: ' + cambiate.length + ' -> ' + JSON.stringify(valore));
    if (errors.length) console.log('    ERRORI JS: ' + errors.join(' | '));
    await page.close();
    return { valore: valore, cambiate: cambiate, streakLetto: streakLetto, errors: errors };
  }

  // ---- [A] SALE: con promotionStreak=1 una risposta giusta promuove ----
  {
    const r = await prova('[A] rosso + 1 giusta, promotionStreak=1',
      'ScalaA', { level: 'rosso', streak: 0 }, 1, 'correct');
    log('[A] L\'app ha letto promotionStreak=1 dagli override', r.streakLetto === 1);
    log('[A] Una sola voce cambia (le altre restano dov\'erano)', r.cambiate.length === 1);
    log('[A] rosso sale a giallo, e la striscia riparte da 0',
      !!r.valore && r.valore.level === 'giallo' && r.valore.streak === 0);
    log('[A] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [B] SCENDE DI UNO SOLO: verde sbagliato va a giallo, non a rosso ----
  {
    const r = await prova('[B] verde + 1 sbagliata',
      'ScalaB', { level: 'verde', streak: 0 }, 1, 'wrong');
    log('[B] Una sola voce cambia', r.cambiate.length === 1);
    log('[B] verde scende a giallo, NON a rosso: un gradino solo',
      !!r.valore && r.valore.level === 'giallo');
    log('[B] La striscia si azzera su una risposta sbagliata',
      !!r.valore && r.valore.streak === 0);
    log('[B] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [C] NON SALTA: con promotionStreak=2 una sola giusta non promuove ----
  {
    const r = await prova('[C] rosso + 1 giusta, promotionStreak=2',
      'ScalaC', { level: 'rosso', streak: 0 }, 2, 'correct');
    log('[C] L\'app ha letto promotionStreak=2 dagli override', r.streakLetto === 2);
    log('[C] Una sola voce cambia', r.cambiate.length === 1);
    log('[C] Con la striscia richiesta a 2, una giusta NON promuove: resta rosso',
      !!r.valore && r.valore.level === 'rosso');
    log('[C] La striscia però avanza a 1', !!r.valore && r.valore.streak === 1);
    log('[C] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [D] LA PRIMA VOLTA STABILISCE LA BASE, non promuove ----
  {
    const r = await prova('[D] nessuna voce in scala + 1 giusta, promotionStreak=1',
      'ScalaD', null, 1, 'correct');
    log('[D] Nasce una sola voce', r.cambiate.length === 1);
    log('[D] Il primo incontro parte da rosso anche se la risposta è giusta',
      !!r.valore && r.valore.level === 'rosso');
    log('[D] ...con la striscia già a 1, così la prossima giusta promuove',
      !!r.valore && r.valore.streak === 1);
    log('[D] Nessun errore JS', r.errors.length === 0);
  }

  await browser.close();
  const falliti = risultati.filter(r => !r).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
