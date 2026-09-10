// PROTEGGE: la scala dei colori per voce (applyMasteryResult) — sale solo con
// la costanza, scende di un gradino solo, non salta, onora
// CONFIG.mastery.promotionStreak invece di avere il numero cablato dentro, e
// dà alla PRIMA risposta il colore che quella risposta merita invece di
// parcheggiare tutto su rosso.
// È il dato più costoso da ricostruire dell'intera app: si accumula per voce,
// per utente, su ogni modulo, e una regressione qui non si vede in nessuna
// schermata — si vede solo dopo settimane, in colori sbagliati che nessuno
// sa più da dove vengono.
//
// COME. La funzione sta dentro la chiusura di index.html e da fuori non si
// chiama. Invece di esporla apposta per il test (cioè cambiare il codice per
// farlo misurare), si semina lo stato di partenza in
// baseinglese:mastery:<episodio>:<utente> e si risponde in Flash Card, che è
// il modulo con la scala più diretta ("Sì, la so" = correct, "Non ancora" =
// wrong). Sei transizioni, sei profili puliti: nessuna dipende dall'esito
// della precedente.
//
// ⚠️ DUE COSE SONO CAMBIATE IL 2026-09-10, e vanno lette insieme.
//
// ① Il mazzo viene ridotto a UNA carta intercettando la richiesta del file
//    episodio (non toccando il file su disco, che è la fonte di tutti gli
//    altri test). Prima si seminava lo stesso valore su tutte le voci perché
//    il mazzo è mescolato e non si sapeva quale carta uscisse per prima; con
//    una carta sola la domanda non esiste, e "l'unica voce cambiata" è
//    l'unica voce che c'è.
//
// ② La scala non si legge più DOPO UNA RISPOSTA, perché non è più lì che si
//    scrive: dal travaso al pulsante (pendingMastery) i colori arrivano al
//    magazzino solo con "Ho finito, torna alla mappa". Quindi ogni prova
//    porta il modulo fino in fondo e legge dopo il pulsante.
//
//    LIMITE DICHIARATO, ed è la conseguenza vera di ②: **in Flash Card una
//    risposta sbagliata non può restare tale fino alla fine.** La carta
//    sbagliata torna nel giro di ripasso.
//
//    ⚠️ Non è «il modulo non finisce finché non la dai giusta» — così diceva
//    questa riga il 2026-09-10, ed era falso: al tetto di
//    CONFIG.retryQueue.maxAttempts la voce viene accettata a forza come rosso
//    e il giro si chiude comunque, esattamente come in Match Practice. **Ma
//    per quella strada la voce viene forzata SCAVALCANDO la scala**, quindi
//    non serve lo stesso a misurare la retrocessione — la conclusione non
//    cambia, la ragione sì. *Una frase che spiega un limite e ne dà una
//    ragione sbagliata è peggio di una che non lo spiega: chi la legge smette
//    di guardare.* Le due prove di
//    RETROCESSIONE ([B] ed [E]) leggono quindi lo stato dopo DUE risposte —
//    la sbagliata e la giusta del ripasso — e il valore atteso è calcolato
//    sulla sequenza intera. Accanto a ciascuna è scritto quale valore
//    DIVERSO si leggerebbe se la retrocessione fosse rotta: senza quella
//    riga l'asserzione sarebbe un numero senza significato.
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
const FILE_EPISODIO = '**/data/inglese/it/inglese-it-gate.json';

// Serve una copia del file episodio col grado di Flash Card ridotto alla
// PRIMA voce: un mazzo di una carta sola. Si intercetta la richiesta invece di
// toccare il file su disco — quel file è la fonte condivisa da tutti i test.
async function mazzoDiUnaCarta(page, grado) {
  await page.route(FILE_EPISODIO, async (route) => {
    const res = await route.fetch();
    const json = await res.json();
    json.levels[grado].items = json.levels[grado].items.slice(0, 1);
    await route.fulfill({ response: res, json });
  });
}

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
async function preparaEApri(page, utente, semina, promotionStreak, grado) {
  await mazzoDiUnaCarta(page, grado);
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
    localStorage.setItem('baseinglese:modules:gate:' + arg.utente,
      JSON.stringify({ completed: arg.prima }));
    localStorage.setItem('baseinglese:configOverrides',
      JSON.stringify({ mastery: { promotionStreak: arg.streak } }));
    ['mappaEpisodio', 'personalizzazione', 'flashcard'].forEach(function (k) {
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
      localStorage.setItem('baseinglese:mastery:gate:' + arg.utente, JSON.stringify(store));
    } else {
      localStorage.removeItem('baseinglese:mastery:gate:' + arg.utente);
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
async function rispondi(page, esito) {
  await page.click('#fc-card');
  const btn = esito === 'correct' ? '#fc-know-it-btn' : '#fc-not-yet-btn';
  await page.waitForSelector(btn, { state: 'visible' });
  await page.click(btn);
}

// Dà le risposte previste, una per carta mostrata, attraversando il giro di
// ripasso se una risposta sbagliata lo apre, e poi PREME IL PULSANTE — che è
// l'unico momento in cui i colori arrivano al magazzino.
//
// Il ciclo aspetta un cambiamento di stato reale a ogni passo (regola 19): non
// avanza a tempo, e se le risposte previste non bastano a chiudere il modulo
// si ferma con un errore che lo dice, invece di leggere un magazzino vuoto e
// dare la colpa alla scala.
async function rispondiECompleta(page, utente, risposte) {
  for (const esito of risposte) {
    await page.waitForSelector('#fc-card', { state: 'visible', timeout: 15000 });
    await rispondi(page, esito);
    await page.waitForFunction(function () {
      const vis = id => { const el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
      return vis('fc-summary-screen') || vis('fc-retry-intro-screen') || vis('fc-card');
    }, null, { timeout: 15000 });
    if (await visible(page, '#fc-retry-intro-screen')) {
      await page.click('#fc-retry-continue-btn');
      await page.waitForSelector('#fc-card', { state: 'visible', timeout: 15000 });
    }
    if (await visible(page, '#fc-summary-screen')) break;
  }
  if (!(await visible(page, '#fc-summary-screen'))) {
    throw new Error('Le risposte previste (' + risposte.join(', ') + ') non hanno chiuso il modulo: '
      + 'la Schermata Finale non è comparsa, quindi non c\'è nessun travaso da leggere.');
  }
  await page.click('#fc-complete-btn');
  await page.waitForFunction(function (u) {
    const raw = localStorage.getItem('baseinglese:mastery:gate:' + u);
    return !!raw && Object.keys(JSON.parse(raw)).length > 0;
  }, utente, { timeout: 15000 });
}

function leggiScala(page, utente) {
  return page.evaluate(function (u) {
    return JSON.parse(localStorage.getItem('baseinglese:mastery:gate:' + u) || '{}');
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

  // L'unitId che Flash Card userà: 'flashcard-<grado>:<idVoce>:<direzione>'.
  // Una voce sola, perché il mazzo è ridotto a una carta (vedi mazzoDiUnaCarta).
  const grado = gradeOf(PASSO);
  const unitIds = loadGrade(grado).slice(0, 1).map(function (v) { return 'flashcard-' + grado + ':' + v.id + ':en-it'; });
  console.log('Passo ' + PASSO + ' (grado ' + grado + '), mazzo ridotto a ' + unitIds.length + ' carta: ' + unitIds[0] + '\n');

  // Una prova: semina, dà le risposte previste, completa il modulo, legge la
  // voce cambiata. `risposte` è una lista perché una risposta sbagliata apre
  // il giro di ripasso e il modulo non si chiude finché quella carta non torna
  // giusta (vedi il LIMITE DICHIARATO in testa al file).
  async function prova(etichetta, utente, semina, streak, risposte) {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const { seminate, streakLetto } = await preparaEApri(page, utente,
      { stato: semina, unitIds: unitIds }, streak, grado);
    await rispondiECompleta(page, utente, risposte);
    const dopo = await leggiScala(page, utente);
    const cambiate = vociCambiate(dopo, seminate);
    const valore = cambiate.length === 1 ? dopo[cambiate[0]] : null;
    console.log(etichetta);
    console.log('    promotionStreak letto dall\'app: ' + streakLetto +
      ' | partenza: ' + JSON.stringify(semina) + ' | risposte: ' + risposte.join(' -> '));
    console.log('    voci cambiate: ' + cambiate.length + ' -> ' + JSON.stringify(valore));
    if (errors.length) console.log('    ERRORI JS: ' + errors.join(' | '));
    await page.close();
    return { valore: valore, cambiate: cambiate, streakLetto: streakLetto, errors: errors };
  }

  // ---- [A] SALE: con promotionStreak=1 una risposta giusta promuove ----
  {
    const r = await prova('[A] rosso + 1 giusta, promotionStreak=1',
      'ScalaA', { level: 'rosso', streak: 0 }, 1, ['correct']);
    log('[A] L\'app ha letto promotionStreak=1 dagli override', r.streakLetto === 1);
    log('[A] Una sola voce cambia (le altre restano dov\'erano)', r.cambiate.length === 1);
    log('[A] rosso sale a giallo, e la striscia riparte da 0',
      !!r.valore && r.valore.level === 'giallo' && r.valore.streak === 0);
    log('[A] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [B] SCENDE DI UNO SOLO: verde sbagliato va a giallo, non a rosso ----
  // Due risposte, e il perché è il LIMITE DICHIARATO in testa: la carta
  // sbagliata torna nel ripasso, e il modulo non si chiude finché non la si dà
  // giusta. Con promotionStreak=2 la giusta del ripasso non promuove, quindi
  // NON copre la retrocessione — la rende leggibile.
  //
  // Partenza { verde, striscia 1 }, sequenza sbagliata -> giusta. Le tre
  // letture possibili, e sono tutte diverse:
  //   giallo/1  la scala è giusta: un gradino solo, e la sbagliata ha azzerato
  //             la striscia (poi la giusta l'ha riportata a 1)
  //   rosso/1   la retrocessione ha saltato un gradino
  //   verde/*   la sbagliata NON ha azzerato la striscia: 1+1 = 2 = promozione
  {
    const r = await prova('[B] verde/1 + sbagliata, poi la giusta del ripasso, promotionStreak=2',
      'ScalaB', { level: 'verde', streak: 1 }, 2, ['wrong', 'correct']);
    log('[B] Una sola voce cambia', r.cambiate.length === 1);
    log('[B] verde scende a giallo, NON a rosso: un gradino solo',
      !!r.valore && r.valore.level === 'giallo');
    log('[B] La striscia si azzera su una risposta sbagliata',
      !!r.valore && r.valore.level === 'giallo' && r.valore.streak === 1);
    log('[B] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [C] NON SALTA: con promotionStreak=2 una sola giusta non promuove ----
  {
    const r = await prova('[C] rosso + 1 giusta, promotionStreak=2',
      'ScalaC', { level: 'rosso', streak: 0 }, 2, ['correct']);
    log('[C] L\'app ha letto promotionStreak=2 dagli override', r.streakLetto === 2);
    log('[C] Una sola voce cambia', r.cambiate.length === 1);
    log('[C] Con la striscia richiesta a 2, una giusta NON promuove: resta rosso',
      !!r.valore && r.valore.level === 'rosso');
    log('[C] La striscia però avanza a 1', !!r.valore && r.valore.streak === 1);
    log('[C] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [D] LA PRIMA VOLTA PRENDE IL COLORE CHE LA RISPOSTA MERITA ----
  // Questo blocco prima asseriva il contrario — "il primo incontro parte da
  // rosso anche se la risposta è giusta" — e proteggeva il difetto invece del
  // comportamento: una voce mai incontrata nasceva rossa, e con
  // promotionStreak 2 servivano QUATTRO risposte giuste per arrivare a verde
  // invece di due. Un profilo che aveva fatto tutto bene mostrava verde 0 su
  // 145 voci. Il test era verde perché descriveva il codice, non la regola.
  {
    const r = await prova('[D] nessuna voce in scala + 1 giusta, promotionStreak=2',
      'ScalaD', null, 2, ['correct']);
    log('[D] Nasce una sola voce', r.cambiate.length === 1);
    log('[D] Una risposta giusta NON viene letta come "non lo sa": nasce giallo',
      !!r.valore && r.valore.level === 'giallo');
    log('[D] ...con la striscia già a 1, così la seconda giusta promuove a verde',
      !!r.valore && r.valore.streak === 1);
    log('[D] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [E] E UNA SBAGLIATA LA PRIMA VOLTA RESTA ROSSA ----
  // L'altra metà della regola, e senza di essa [D] da solo direbbe "tutto
  // parte da giallo", che è il difetto opposto.
  // Stessa forma di [B]: due risposte, attesa calcolata sulla sequenza.
  // Le tre letture possibili di 'rosso/1':
  //   rosso/1   nasce rossa e la giusta del ripasso avanza solo la striscia
  //   giallo/1  è nata gialla, cioè una risposta SBAGLIATA è stata letta come
  //             "medio" — il difetto opposto a quello di [D]
  //   giallo/0  è nata rossa ma con la striscia già a 1, e la giusta ha
  //             promosso: la sbagliata non aveva azzerato la striscia
  {
    const r = await prova('[E] nessuna voce in scala + sbagliata, poi la giusta del ripasso, promotionStreak=2',
      'ScalaE', null, 2, ['wrong', 'correct']);
    log('[E] Nasce una sola voce', r.cambiate.length === 1);
    log('[E] Una risposta sbagliata la prima volta nasce rossa',
      !!r.valore && r.valore.level === 'rosso');
    log('[E] ...con la striscia a 0', !!r.valore && r.valore.level === 'rosso' && r.valore.streak === 1);
    log('[E] Nessun errore JS', r.errors.length === 0);
  }

  // ---- [F] DUE GIUSTE DI FILA ARRIVANO A VERDE, non quattro ----
  // Si riparte dallo stato che [D] produce, invece di dare due risposte alla
  // stessa carta: il mazzo è mescolato e la seconda risposta non cadrebbe per
  // forza sulla stessa voce. È lo stesso motivo per cui le altre prove
  // seminano tutte le voci con lo stesso valore.
  {
    const r = await prova('[F] giallo/1 (cioè dopo una giusta) + 1 giusta, promotionStreak=2',
      'ScalaF', { level: 'giallo', streak: 1 }, 2, ['correct']);
    log('[F] Una sola voce cambia', r.cambiate.length === 1);
    log('[F] La SECONDA risposta giusta porta a verde: due, non quattro',
      !!r.valore && r.valore.level === 'verde');
    log('[F] Nessun errore JS', r.errors.length === 0);
  }

  await browser.close();
  const falliti = risultati.filter(r => !r).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
