// PROTEGGE: che quello che lo studente ha fatto dentro un modulo si salvi SOLO
// se lui lo chiede, premendo il pulsante di uscita.
//
// Cosa si perde senza questo file. Fino al 2026-09-10 otto moduli scrivevano i
// colori della mastery a ogni risposta, direttamente in localStorage. Chi
// apriva Match Practice, rispondeva a tre domande e usciva da "← Mappa" si
// portava dietro tre colori per sempre, senza aver dichiarato niente e senza
// che il modulo risultasse fatto. Il Dialogo faceva la stessa cosa con
// l'esito: rispondere "Sì, lo so" all'autovalutazione scriveva il verde sulla
// mappa anche uscendo subito dopo senza confermare.
//
// La regola adesso è una sola, ed è un GESTO:
//
//   "Ho finito"            -> esito + voci + completato
//   "Esci e riprendi dopo" -> solo le risposte già dichiarate (Why We Say It)
//   "← Mappa"              -> niente
//
// Non è un dettaglio di comodo: il magazzino della mastery è il dato più
// costoso dell'app — si accumula per voce, per utente, su ogni modulo — e una
// scrittura che nessuno ha chiesto lo sporca in modo invisibile. Un colore
// sbagliato non si vede in nessuna schermata: si vede settimane dopo, e non si
// sa più da dove viene.
//
// COME, e sono due strade per due domande diverse.
//
// ① "Nessuno scrive più fuori dal pulsante?" NON si risponde aprendo gli otto
//    moduli uno per uno: si risponde guardando che esista UN SOLO punto in
//    tutta l'app che scrive il magazzino. Se il punto è uno, l'uguaglianza fra
//    i moduli non è una cosa da verificare, è una cosa che non può non essere
//    vera. Quindi [A] legge index.html COME TESTO e conta le chiamate a
//    saveMastery(: dev'essere una, dentro commitPendingMastery. La NONA
//    scrittura diretta, il giorno che qualcuno la aggiunge, fa cadere la CI.
//
//    ⚠️ LIMITE E COSTO DICHIARATI. È una dipendenza da index.html letto come
//    testo (ce ne sono altre, registrate in docs/decisioni.md), e il conto si
//    fa sulle righe con i commenti tolti: una riga che contenesse "//" dentro
//    una stringa verrebbe troncata e potrebbe nascondere una chiamata. Oggi
//    non ce ne sono; se un giorno servisse, questo conto va rifatto con un
//    parser vero, non allargando l'espressione.
//
// ② "Il gesto decide davvero?" si risponde solo nel browser, e NON basta
//    guardare che il magazzino sia pieno dopo "Ho finito": era pieno anche
//    prima della correzione. Quello che distingue le due versioni è il
//    CONFRONTO fra le due uscite — stesse risposte, due pulsanti diversi, due
//    magazzini diversi. Per questo [B] misura due numeri, non uno.
//
// LIMITE DICHIARATO: dei moduli che scrivono voci qui se ne guida uno
// (Match Practice en→it). Gli altri sono coperti da [A], che è più forte di un
// confronto a campione — ma se un modulo smettesse di CHIAMARE
// recordPendingMastery, e quindi non registrasse più niente, qui non si
// vedrebbe. Quel caso lo prendono i test dei singoli moduli (test_batch12 per
// Voice Practice e Voice Check, test_scala_colori per Flash Card, test_batch15
// per i quiz), che il magazzino lo leggono pieno dopo il completamento.
//
// E il caso di VOICE CHECK con "← Mappa" sta in test_batch12 e non qui, per
// una ragione sola: la macchina del microfono (il mock del riconoscimento
// vocale) è in quel file, e ricopiarla qui sarebbe la duplicazione che la
// regola 13 esiste per evitare. La regola resta questa; lì c'è il suo caso.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const { stepsBefore, gradeOf } = require('./module-order');
const { loadGrade, playThroughQuiz } = require('./quiz-driver');

const BASE = APP_URL;
let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const mockVoce = () => {
  class FakeUtterance { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  const finta = {
    speaking: false, _u: null,
    speak(u) { this.speaking = true; this._u = u; if (u.onstart) u.onstart(); setTimeout(() => { if (this._u === u) { this.speaking = false; this._u = null; } if (u.onend) u.onend(); }, 20); },
    cancel() { const u = this._u; if (u) { this.speaking = false; this._u = null; if (u.onend) u.onend(); } },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: finta, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function boot(page, utente, passo) {
  await page.goto(BASE);
  if (!(await page.isVisible('#name-input').catch(() => false))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input', { state: 'visible' });
  }
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(({ utente, prima }) => {
    localStorage.setItem('baseinglese:modules:gate:' + utente, JSON.stringify({ completed: prima }));
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach',
     'voicePractice', 'matchEngIta', 'matchItaEng', 'speedMatchEngIta', 'speedMatchItaEng', 'flashcard',
     'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'
    ].forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + utente, '1'));
  }, { utente, prima: stepsBefore(passo) });
  await page.click('#go-episode');
  await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0, null, { timeout: 20000 });
}

async function apri(page, passo, attendi) {
  await page.click('[data-module="' + passo + '"]');
  if (attendi) await page.waitForSelector(attendi, { state: 'visible', timeout: 20000 });
}

async function tornaAllaMappa(page, bottone) {
  await page.click(bottone);
  await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0, null, { timeout: 20000 });
}

// Il magazzino e i completamenti, letti insieme in una valutazione sola.
function leggiTutto(page, utente) {
  return page.evaluate((u) => {
    const j = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
    const progress = j('baseinglese:modules:gate:' + u) || { completed: [] };
    return {
      mastery: Object.keys(j('baseinglese:mastery:gate:' + u) || {}),
      esiti: j('baseinglese:moduleOutcome:gate:' + u) || {},
      completati: progress.completed || [],
      dichiarazioni: Object.keys(j('baseinglese:storyCardsDeclarations:gate:' + u) || {}),
      conteggi: Object.keys((j('baseinglese:storyCardsExplanationStats:gate:' + u) || {}).byLine || {})
    };
  }, utente);
}

async function run() {
  console.log('=== IL GESTO SCEGLIE COSA SI SALVA ===\n');

  // ---------------------------------------------------------------
  // [A] Il punto unico di scrittura. Strutturale: non apre il browser.
  // ---------------------------------------------------------------
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    const righe = html.split('\n').map((r, i) => ({ n: i + 1, testo: r.replace(/\/\/.*$/, '') }));

    const chiamate = (nome) => righe.filter(r =>
      new RegExp('(^|[^\\w.])' + nome + '\\(').test(r.testo) &&
      !new RegExp('function\\s+' + nome + '\\(').test(r.testo));

    // La funzione che contiene una riga: l'ultima dichiarazione di funzione
    // che la precede. Basta qui perché queste due chiamate stanno in corpi di
    // funzione brevi e non annidati.
    const dentroA = (numeroRiga) => {
      let nome = null;
      for (const r of righe) {
        if (r.n >= numeroRiga) break;
        const m = r.testo.match(/^\s*function\s+(\w+)\s*\(/);
        if (m) nome = m[1];
      }
      return nome;
    };

    const scritture = chiamate('saveMastery');
    log('[A] saveMastery si chiama in UN PUNTO SOLO di tutta l\'app',
      scritture.length === 1, scritture.map(r => r.n + ': ' + r.testo.trim()).join(' | '));
    log('[A] ...e quel punto è commitPendingMastery, cioè il travaso del pulsante',
      scritture.length === 1 && dentroA(scritture[0].n) === 'commitPendingMastery',
      scritture.length === 1 ? 'sta dentro ' + dentroA(scritture[0].n) : 'n/d');

    const scale = chiamate('applyMasteryResult');
    log('[A] Anche la scala dei colori si applica in un punto solo',
      scale.length === 1, scale.map(r => r.n + ': ' + r.testo.trim()).join(' | '));
    log('[A] ...e quel punto è recordPendingMastery, cioè il magazzino in sospeso',
      scale.length === 1 && dentroA(scale[0].n) === 'recordPendingMastery',
      scale.length === 1 ? 'sta dentro ' + dentroA(scale[0].n) : 'n/d');

    // La pulizia della regola 21 non vive dentro il "← Mappa" di un modulo.
    log('[A] Il pending si azzera in stopAllModuleActivity, non nei singoli "← Mappa"',
      /function stopAllModuleActivity\(\)[\s\S]*?clearPendingMastery\(\);[\s\S]*?\n  \}/.test(html));
  }

  const browser = await launchBrowser();
  const vocabolario = loadGrade(gradeOf('matchEngIta'));

  // ---------------------------------------------------------------
  // [B] Match Practice: stesse risposte, due uscite, due magazzini.
  // ---------------------------------------------------------------
  let vociDopoMappa = null;
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await page.addInitScript(mockVoce);
    await boot(page, 'GestoMappa', 'matchEngIta');
    await apri(page, 'matchEngIta', '#qm-start-btn, #qm-quiz-screen');

    let risposte = 0;
    await playThroughQuiz(page, 'qm', {
      vocabulary: vocabolario,
      answerFor: () => 'correct',
      onState: (st) => {
        if (st.screen === 'quiz' && st.options.length && !st.advanceVisible) {
          if (risposte >= 3) return 'stop';
          risposte++;
        }
      }
    });
    log('[B] Tre domande sono state davvero risposte prima di uscire', risposte === 3, 'risposte: ' + risposte);

    await tornaAllaMappa(page, '#match-back-map');
    const dopo = await leggiTutto(page, 'GestoMappa');
    vociDopoMappa = dopo.mastery.length;
    log('[B] Uscendo da "← Mappa" NON resta nessun colore nel magazzino',
      dopo.mastery.length === 0, 'voci: ' + dopo.mastery.length + ' -> ' + dopo.mastery.join(', '));
    log('[B] ...e nemmeno un esito sulla mappa', Object.keys(dopo.esiti).length === 0, JSON.stringify(dopo.esiti));
    log('[B] ...e il modulo non risulta fatto', dopo.completati.indexOf('matchEngIta') === -1);
    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await page.addInitScript(mockVoce);
    await boot(page, 'GestoFinito', 'matchEngIta');
    await apri(page, 'matchEngIta', '#qm-start-btn, #qm-quiz-screen');

    await playThroughQuiz(page, 'qm', { vocabulary: vocabolario, answerFor: () => 'correct' });
    const primaDelPulsante = await leggiTutto(page, 'GestoFinito');
    log('[B] Arrivati alla Schermata Finale il magazzino è ANCORA vuoto: non è la fine del giro che salva',
      primaDelPulsante.mastery.length === 0, 'voci: ' + primaDelPulsante.mastery.length);

    await tornaAllaMappa(page, '#qm-complete-btn');
    const dopo = await leggiTutto(page, 'GestoFinito');
    log('[B] Premendo "Ho finito" i colori arrivano tutti insieme',
      dopo.mastery.length === vocabolario.length,
      'voci: ' + dopo.mastery.length + ', attese: ' + vocabolario.length);
    log('[B] ...e sono esattamente quelle di questo modulo e di questa direzione',
      dopo.mastery.length > 0 && dopo.mastery.every(k => k.indexOf('match:') === 0 && /:en-it$/.test(k)),
      dopo.mastery.slice(0, 3).join(', '));
    log('[B] ...con l\'esito e il completamento nello stesso gesto',
      !!dopo.esiti.matchEngIta && dopo.completati.indexOf('matchEngIta') !== -1);
    // Il confronto che distingue le due versioni: prima della correzione
    // questi due numeri erano uguali, ed erano entrambi diversi da zero.
    log('[B] Le stesse risposte, due uscite diverse: zero contro tutte',
      vociDopoMappa === 0 && dopo.mastery.length > 0,
      '← Mappa: ' + vociDopoMappa + ' | Ho finito: ' + dopo.mastery.length);
    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------
  // [C] Il Dialogo: l'autovalutazione MOSTRA, il pulsante SCRIVE.
  // ---------------------------------------------------------------
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await page.addInitScript(mockVoce);
    await boot(page, 'GestoDialogo', 'dialogoAscoltaRipeti');
    await apri(page, 'dialogoAscoltaRipeti');
    await page.waitForSelector('#dg-start-btn', { state: 'visible', timeout: 20000 }).catch(() => {});
    if (await page.isVisible('#dg-start-btn').catch(() => false)) await page.click('#dg-start-btn');
    await page.waitForSelector('.dg-bubble', { state: 'visible', timeout: 20000 });
    const bolle = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bolle; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(120);
    }
    await page.waitForSelector('#dg-know-it-btn:not([disabled])', { timeout: 20000 });
    await page.click('#dg-know-it-btn');
    await page.waitForSelector('#dg-summary-screen', { state: 'visible', timeout: 20000 });

    const dopoRisposta = await leggiTutto(page, 'GestoDialogo');
    log('[C] Dichiarare "Sì, lo so" non scrive ancora nessun esito',
      !dopoRisposta.esiti.dialogoAscoltaRipeti, JSON.stringify(dopoRisposta.esiti));
    // Il sottotitolo e il suono restano attaccati all'autovalutazione: si
    // separa cosa si MOSTRA da cosa si SCRIVE, non si sposta la risposta.
    const sottotitolo = await page.$eval('#dg-summary-title-sub', el => el.textContent.trim());
    log('[C] La Schermata Finale risponde comunque alla dichiarazione', sottotitolo.length > 0, sottotitolo);

    await tornaAllaMappa(page, '#dialogo-back-map');
    const dopoMappa = await leggiTutto(page, 'GestoDialogo');
    log('[C] Uscendo da "← Mappa" l\'esito non c\'è: nessun colore che nessuno ha confermato',
      !dopoMappa.esiti.dialogoAscoltaRipeti, JSON.stringify(dopoMappa.esiti));
    log('[C] ...e il modulo non risulta fatto', dopoMappa.completati.indexOf('dialogoAscoltaRipeti') === -1);
    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ---------------------------------------------------------------
  // [D] Why We Say It: DUE magazzini, una regola sola.
  // ---------------------------------------------------------------
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(e.message));
    await page.addInitScript(mockVoce);
    await boot(page, 'GestoWhy', 'whyWeSayIt');
    await apri(page, 'whyWeSayIt');
    await page.waitForFunction(() => document.querySelectorAll('#story-cards-body .wws-card').length > 0, null, { timeout: 20000 });
    const primoId = await page.$eval('.story-cards-selfcheck', el => el.getAttribute('data-story-cards-skill'));
    await page.click('.story-cards-selfcheck[data-story-cards-skill="' + primoId + '"] [data-story-cards-answer="chiara"]');
    await page.waitForFunction(id => {
      const el = document.getElementById('story-cards-declared-' + id);
      return el && el.getClientRects().length > 0;
    }, primoId, { timeout: 20000 });

    await tornaAllaMappa(page, '#story-cards-back-map');
    const dopo = await leggiTutto(page, 'GestoWhy');
    log('[D] Uscendo da "← Mappa" le dichiarazioni non restano',
      dopo.dichiarazioni.length === 0, dopo.dichiarazioni.join(', '));
    // La metà che mancava: i conteggi editoriali si scrivevano a ogni
    // risposta, quindi questo modulo aveva due magazzini con due regole
    // diverse e solo uno rispettava il gesto.
    log('[D] ...e nemmeno i conteggi editoriali, che prima si scrivevano a ogni risposta',
      dopo.conteggi.length === 0, dopo.conteggi.join(', '));
    log('[D] ...e il modulo non risulta fatto', dopo.completati.indexOf('whyWeSayIt') === -1);
    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('');
  console.log(failed === 0 ? 'ALL PASS (' + (passed + failed) + ' asserzioni)'
    : failed + ' su ' + (passed + failed) + ' asserzioni FALLITE');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
