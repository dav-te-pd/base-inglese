// PROTEGGE: che una carta di Flash Card si risponda UNA VOLTA SOLA, anche se
// il dito preme tre volte di seguito sullo stesso pulsante.
//
// COSA SI PERDE SENZA QUESTO FILE, e non e' la carta saltata. Misurato il
// 2026-09-20 sulla prima carta di un profilo nuovo, tre click rapidi contro
// uno:
//
//     un click   → contatore 1→2, la voce diventa **giallo** con striscia 1
//     tre click  → contatore 1→**3**, la voce diventa **verde** con striscia 1
//
// Cioe' una voce mai vista salta a **verde alla sua prima risposta**, contro
// la regola 39 («la prima risposta giusta da' giallo con la striscia a 1, cosi'
// la seconda giusta promuove»). **La carta saltata la vede lo studente e lo
// infastidisce; la mastery sbagliata non la vede nessuno** — va nel magazzino,
// decide i ripassi, e nessuno la rivede piu'.
//
// PERCHE' ERA SCOPERTO, ed e' la regola 20. La guardia esisteva — `fcNavLocked`
// — ma viveva dentro `fcNavigateTo`, cioe' nell'ANIMAZIONE: l'ultima delle tre
// funzioni che un click attraversa.
//
//     click → fcRecordResult → fcGoNext → fcAdvance → fcNavigateTo
//                  ①                          ②            ③ guardia
//
// Un secondo click durante i 300 ms della slide passava per ① e ②. *Il
// commento accanto diceva «fcNavigateTo/fcNavLocked already guards against a
// double advance»: una frase che descriveva un comportamento inesistente.*
//
// IL CASO PIU' DIVERSO (regola 42), e qui non e' una scelta fra tre moduli
// uguali: **Flash Card e' l'unico dei tre quiz i cui pulsanti di risposta NON
// si disabilitano.** Match e Speed Match chiamano `qmDisableOptions` /
// `srDisableOptions` appena si risponde, e un pulsante `disabled` non emette
// click — sono protetti dal MARKUP, non dal codice. I pulsanti di Flash Card
// invece scivolano via con la carta, restando premibili per tutta l'animazione.
// Quindi il blocco `[B]` verifica che quella difesa ci sia ancora negli altri
// due: se qualcuno togliesse il `disabled` credendolo cosmetico, ricadrebbero
// esattamente qui.
//
// COME. Tre click SENZA attese in mezzo, dentro una sola `page.evaluate` — tre
// `page.click` separati sarebbero tre round-trip e darebbero alla slide il
// tempo di finire, cioe' misurerebbero la macchina invece del codice
// (regola 19). L'approdo e' la fine dell'animazione (`is-sliding-out` sparito),
// che **nessuna delle due asserzioni legge** (regola 44): leggono il contatore
// e il magazzino in sospeso.
//
// LIMITE DICHIARATO: guida i due pulsanti di Flash Card, non ogni pulsante
// dell'app. Un doppio click su «Ho finito» o su una battuta del Dialogo non e'
// coperto da qui.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi, attendiPrimaSchermata } = require('./test-env');
const { allSteps } = require('./module-order');
const { openModule } = require('./map-driver');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const mockInit = () => {
  class FakeUtterance { constructor(t) { this.text = t; this.onstart = null; this.onend = null; this.onerror = null; } }
  const f = {
    speaking: false, _current: null,
    speak(u) {
      this.speaking = true; this._current = u;
      if (u.onstart) u.onstart();
      u._t = setTimeout(() => {
        if (this._current === u) { this.speaking = false; this._current = null; }
        if (u.onend) u.onend();
      }, 20);
    },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._t); } },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: f, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(APP_URL);
  // ⚠️ L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): senza questa attesa, «non c'e' il campo del nome» e «non
  // c'e' ancora niente» si leggono uguali (vedi `attendiPrimaSchermata`).
  await attendiPrimaSchermata(page);
  if (!(await page.isVisible('#name-input').catch(() => false))) {
    await page.click('#switch-user'); await page.waitForTimeout(100);
  }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(function (d) {
    if (d.completedModules) {
      localStorage.setItem(BI.moduleProgressKey('gate', d.userName), JSON.stringify({ completed: d.completedModules }));
    }
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt',
     'voiceCoach', 'voicePractice', 'matchEngIta', 'matchItaEng', 'speedMatchEngIta',
     'speedMatchItaEng', 'flashcard', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo',
     'dialogoContinuo'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + d.userName, '1');
    });
  }, { userName: userName, completedModules: completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

// Apre Flash Card su un profilo nuovo e lascia la prima carta girata.
async function primaCarta(browser, nome) {
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await bloccaFontEsterni(page);
  await page.addInitScript(mockInit);
  const passi = allSteps();
  await bootAsUser(page, nome, passi.slice(0, passi.indexOf('flashcardAEngIta')));
  await openModule(page, 'flashcardAEngIta');
  await page.waitForSelector('#fc-card', { timeout: 15000 });
  for (const sel of ['#fc-intro-start-btn', '#fc-start-btn']) {
    if (await page.isVisible(sel).catch(() => false)) { await page.click(sel); await page.waitForTimeout(150); break; }
  }
  await page.click('#fc-card');          // gira la carta
  await page.waitForTimeout(150);
  return { page: page, errori: errori };
}

// Legge i due effetti insieme, in una chiamata sincrona sola (regola 19).
function statoDellaCarta(page) {
  return page.evaluate(function () {
    var sospesa = window.BI.masteryInSospeso();
    var chiavi = Object.keys(sospesa);
    return {
      contatore: document.getElementById('fc-counter').textContent.trim(),
      voci: chiavi.length,
      livello: chiavi.length ? sospesa[chiavi[0]].level : null,
      striscia: chiavi.length ? sospesa[chiavi[0]].streak : null
    };
  });
}

// L'approdo: l'animazione finita. Non e' il contatore e non e' il magazzino —
// cioe' non e' nessuno dei due valori che le asserzioni leggono (regola 44).
async function attendiSlideFinita(page) {
  await page.waitForFunction(function () {
    var c = document.getElementById('fc-card');
    return c && !c.classList.contains('is-sliding-out');
  }, { timeout: 10000 });
  await page.waitForTimeout(150);
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] TRE CLICK SU «Sì, la so» VALGONO UNO ────────────────────────
  {
    const { page, errori } = await primaCarta(browser, 'FcTreSi');
    const prima = await statoDellaCarta(page);
    log('[A] Si parte dalla prima carta, senza risposte in magazzino',
      prima.contatore.indexOf('1 /') === 0 && prima.voci === 0,
      prima.contatore + ' · voci ' + prima.voci);

    await page.evaluate(function () {
      var b = document.getElementById('fc-know-it-btn');
      b.click(); b.click(); b.click();
    });
    await attendiSlideFinita(page);
    const dopo = await statoDellaCarta(page);

    log('[A] Il contatore avanza di UNA carta, non di tre', dopo.contatore.indexOf('2 /') === 0,
      'contatore: ' + prima.contatore + ' -> ' + dopo.contatore);
    log('[A] La voce e\' registrata UNA volta sola', dopo.voci === 1, 'voci: ' + dopo.voci);
    // Regola 39: la prima risposta giusta da' GIALLO con la striscia a 1.
    // Col difetto la stessa voce usciva VERDE, cioe' promossa due volte da un
    // gesto solo — ed e' questa la riga che protegge i ripassi.
    log('[A] ...e col livello che la regola 39 le da\': giallo, striscia 1',
      dopo.livello === 'giallo' && dopo.striscia === 1,
      'livello: ' + dopo.livello + ' · striscia: ' + dopo.striscia);
    log('[A] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [A2] E VALE ANCHE PER «Non ancora» ──────────────────────────────
  //
  // Non e' lo stesso pulsante con un'etichetta diversa: prende un'altra strada
  // (`fcRetryAttempts`, la coda del ripasso) e non suona. Se la guardia fosse
  // finita dentro il solo ramo «corretto», questa riga la prenderebbe.
  {
    const { page, errori } = await primaCarta(browser, 'FcTreNo');
    await page.evaluate(function () {
      var b = document.getElementById('fc-not-yet-btn');
      b.click(); b.click(); b.click();
    });
    await attendiSlideFinita(page);
    const dopo = await statoDellaCarta(page);
    log('[A2] «Non ancora» tre volte avanza di una carta sola', dopo.contatore.indexOf('2 /') === 0,
      'contatore: ' + dopo.contatore);
    log('[A2] ...e registra una voce sola, rossa', dopo.voci === 1 && dopo.livello === 'rosso',
      'voci: ' + dopo.voci + ' · livello: ' + dopo.livello);
    log('[A2] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [B] GLI ALTRI DUE QUIZ SONO PROTETTI DAL MARKUP, E DEVE RESTARE ──
  //
  // Match e Speed Match spengono i pulsanti appena si risponde, e un pulsante
  // `disabled` non emette click. **Non e' la stessa difesa di Flash Card**: sta
  // nel markup invece che nella funzione, quindi chi togliesse quel `disabled`
  // credendolo cosmetico li riporterebbe esposti come era Flash Card.
  // Si guarda il CODICE, non il commento (`righeDiCodiceDi`).
  {
    [['match.js', 'qm'], ['speedmatch.js', 'sr']].forEach(function (coppia) {
      const righe = righeDiCodiceDi('app', coppia[0]).join('\n');
      log('[B] app/' + coppia[0] + ' spegne le opzioni dopo una risposta',
        new RegExp('#' + coppia[1] + '-options .sr-option').test(righe) && /b\.disabled = true/.test(righe));
      log('[B] ...e spegne anche il suo «Non lo so»',
        new RegExp("getElementById\\('" + coppia[1] + "-dontknow-btn'\\)\\.disabled = true").test(righe));
    });
  }

  // ── [C] LA GUARDIA STA NELLA FUNZIONE, NON NEL LISTENER (regola 20) ──
  //
  // Strutturale, e serve perche' [A] resterebbe verde anche se qualcuno
  // rimettesse la guardia dentro i due listener: funzionerebbe, e sarebbe la
  // forma che la regola 20 vieta — i punti da cui si richiama una funzione si
  // moltiplicano nel tempo, la funzione resta una sola.
  {
    const src = fs.readFileSync(repoPath('app', 'flashcard.js'), 'utf8');
    const i = src.indexOf('    function fcRispondi(');
    const corpo = i === -1 ? '' : src.slice(i, src.indexOf('\n    }', i));
    log('[C] Esiste una funzione sola che esegue la risposta', i !== -1);
    log('[C] ...e si rifiuta subito se la carta ha gia\' risposto', /if \(fcAnswered\) return;/.test(corpo));
    // L'ordine conta: fra l'alzare la bandiera e il registrare non deve
    // esistere un istante in cui un secondo click passa.
    log('[C] ...alzando la bandiera PRIMA di registrare',
      corpo.indexOf('fcAnswered = true') !== -1 &&
      corpo.indexOf('fcAnswered = true') < corpo.indexOf('fcRecordResult('));
  }

  await browser.close();
  console.log('\n=== RISPOSTA UNA VOLTA: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
