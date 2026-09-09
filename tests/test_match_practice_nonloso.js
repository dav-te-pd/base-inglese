// PROTEGGE: che in Match Practice il pulsante "Non lo so" torni ATTIVO sulla
// domanda successiva dopo una risposta giusta. Si spegne insieme alle opzioni
// al momento della risposta (qmDisableOptions) e lo riaccende chi disegna la
// domanda nuova (qmRenderQuestion): se quella riga sparisce, dalla seconda
// domanda in poi lo studente ha davanti un pulsante spento e nessun modo di
// dire "non lo so" — l'esercizio funziona, ma una delle sue due uscite non
// c'e' piu'. Non crolla niente, e per questo nessuno se ne accorgerebbe.
//
// COME, ed e' il motivo per cui questo file esiste come file suo.
// La stessa asserzione vive gia' in test_batch19.js ([QM Task1]) nella forma
// sbagliata: `await page.waitForTimeout(800)` e subito dopo la lettura dello
// stato. Ottocento millisecondi sono la somma a mente di feedbackPauseMs (600)
// piu' un margine — cioe' una scommessa sulla velocita' della macchina, non
// una misura (CLAUDE.md regola 19). Su un runner lento la domanda nuova non
// c'e' ancora e il test dichiara rotto un pulsante che sta benissimo; su uno
// veloce passa sempre, anche il giorno in cui l'app si rompe davvero e ci mette
// il doppio.
//
// Qui si aspetta invece **quello che il lavoro produce**: la domanda
// successiva a schermo, riconosciuta dal contatore che cambia e dal riquadro
// della risposta chiuso. E lo stato si legge DENTRO la stessa chiamata che
// aspetta, non con un secondo giro: fra un'attesa e una lettura separate la
// domanda puo' cambiare ancora.
//
// E' il modello con cui vanno riscritte le diciannove attese fisse di
// test_batch19.js (docs/decisioni.md): non "togliere il numero", ma **dire
// cosa si sta aspettando**.
//
// Il giro di domande non si guida a caso fino a indovinare: sull'ULTIMA
// domanda del passaggio non si risponde mai giusto di proposito — li' la
// risposta giusta chiude il passaggio e non esiste nessuna "domanda
// successiva" da guardare. Era uno dei due sospetti mai dimostrati del rosso
// in CI di test_batch19: qui non e' escluso dalla fortuna, e' escluso dalla
// costruzione.
//
// LIMITE DICHIARATO: si guarda UNA direzione (en→it). L'altra usa lo stesso
// componente e lo stesso qmRenderQuestion, quindi un difetto di questa riga le
// romperebbe entrambe; una differenza che vivesse solo nella direzione it→en
// qui non si vedrebbe.

const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');

const BASE = APP_URL;
const UTENTE = 'MatchNonLoSo';
let passed = 0, failed = 0;
function log(name, ok, extra) {
  if (ok) { passed++; console.log('  PASS  ' + name); }
  else { failed++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}

// Una sintesi vocale finta che finisce in modo ASINCRONO come quella vera
// (regola 19: un mock che finisce all'istante nasconde i bug di ordine).
const mockVoce = () => {
  class FakeUtterance { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  const finta = {
    speaking: false, _u: null,
    speak(u) { this.speaking = true; this._u = u; if (u.onstart) u.onstart(); setTimeout(() => { if (this._u === u) { this.speaking = false; this._u = null; } if (u.onend) u.onend(); }, 20); },
    cancel() { this.speaking = false; this._u = null; },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Finta', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: finta, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

// Tutto lo stato del modulo in un'unica valutazione sincrona: fra due letture
// separate la schermata puo' cambiare, e si finirebbe per ragionare su una
// fotografia che non e' mai esistita.
function statoDelModulo(page) {
  return page.evaluate(() => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const contatore = (document.getElementById('qm-counter') || {}).textContent || '';
    const m = contatore.match(/(\d+)\s*\/\s*(\d+)/);
    return {
      contatore: contatore.trim(),
      indice: m ? Number(m[1]) : null,
      totale: m ? Number(m[2]) : null,
      quiz: vis(document.getElementById('qm-quiz-screen')),
      ripasso: vis(document.getElementById('qm-retry-intro-screen')),
      riepilogo: vis(document.getElementById('qm-summary-screen')),
      revealAperto: !document.getElementById('qm-reveal').hidden,
      opzioni: document.querySelectorAll('#qm-options .sr-option').length,
      nonLoSoSpento: document.getElementById('qm-dontknow-btn').disabled
    };
  });
}

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(mockVoce);

  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', UTENTE);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(a => localStorage.setItem('baseinglese:modules:gate:' + a.u,
    JSON.stringify({ completed: a.c })), { u: UTENTE, c: stepsBefore('matchEngIta') });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  await page.click('[data-module="matchEngIta"]');
  await page.waitForSelector('#qm-start-btn', { state: 'visible', timeout: 10000 });
  await page.click('#qm-start-btn');
  await page.waitForFunction(() => document.querySelectorAll('#qm-options .sr-option').length > 0, { timeout: 10000 });

  const partenza = await statoDelModulo(page);
  log('[1] "Non lo so" e\' attivo sulla prima domanda', partenza.nonLoSoSpento === false);

  // Si va avanti finche' non capita una risposta giusta che NON sia l'ultima
  // del passaggio. Il limite del ciclo non e' un numero scelto a occhio: e'
  // quante domande esistono, contate a schermo, per il numero di passaggi che
  // la coda di ripasso ammette (CONFIG.retryQueue.maxAttempts) — oltre quello
  // non c'e' piu' niente da provare, e insistere e' come cliccava
  // test_batch19 in una schermata senza opzioni.
  const maxPassaggi = await page.evaluate(() => window.APP_CONFIG.retryQueue.maxAttempts);
  const limite = (partenza.totale || 1) * (maxPassaggi + 1) + 5;
  let contatorePrima = null;
  let mosse = 0;

  while (contatorePrima === null && mosse < limite) {
    mosse++;
    const s = await statoDelModulo(page);
    if (s.riepilogo) break;
    if (s.ripasso) { await page.click('#qm-retry-continue-btn'); continue; }
    if (s.revealAperto) { await page.click('#qm-advance-btn'); continue; }
    if (!s.quiz || !s.opzioni) break;
    // Ultima domanda del passaggio: rispondere giusto qui chiuderebbe il
    // passaggio, e la "domanda successiva" da misurare non esisterebbe. Si
    // dichiara "non lo so": la voce torna nel giro di ripasso, quindi altre
    // domande dopo ci sono di sicuro.
    if (s.indice !== null && s.indice === s.totale) {
      await page.click('#qm-dontknow-btn');
      continue;
    }
    const prima = s.contatore;
    await page.click('#qm-options .sr-option >> nth=0');
    // Giusta o sbagliata si legge dallo stato, non dal tempo: la classe la
    // mette il gestore del click, sincrono con il click stesso.
    const giusta = await page.evaluate(() =>
      document.querySelector('#qm-options .sr-option.is-correct') !== null &&
      document.querySelector('#qm-options .sr-option.is-wrong') === null);
    if (giusta) contatorePrima = prima;
  }

  log('[2] Si e\' potuto rispondere giusto su una domanda che non e\' l\'ultima del passaggio',
    contatorePrima !== null, 'mosse: ' + mosse + ' / limite ' + limite);

  if (contatorePrima !== null) {
    // IL PUNTO DEL FILE. Nessun numero di millisecondi: si aspetta la domanda
    // successiva, e la si riconosce da cio' che la distingue — il contatore
    // cambiato e il riquadro della risposta chiuso. Lo stato del pulsante
    // viene fuori dalla stessa chiamata che ha aspettato.
    const dopo = await page.waitForFunction(precedente => {
      const b = document.getElementById('qm-dontknow-btn');
      const c = document.getElementById('qm-counter');
      const rev = document.getElementById('qm-reveal');
      if (!b || !c || !rev) return null;
      if (!rev.hidden) return null;
      if (c.textContent.trim() === precedente) return null;
      return { spento: b.disabled, nascosto: b.hidden, contatore: c.textContent.trim() };
    }, contatorePrima, { timeout: 15000 })
      .then(h => h.jsonValue())
      .catch(() => null);

    log('[3] Dopo una risposta giusta arriva la domanda successiva', dopo !== null,
      'partiti da "' + contatorePrima + '", non e\' mai comparsa una domanda nuova');
    if (dopo) {
      log('[3] "Non lo so" e\' di nuovo ATTIVO sulla domanda successiva', dopo.spento === false,
        'contatore: ' + dopo.contatore + ', disabled=' + dopo.spento);
      log('[3] ...e visibile, non solo attivo', dopo.nascosto === false);
    }
  }

  log('[4] Nessun errore JS', errors.length === 0, errors.join(' | '));

  await page.close();
  await browser.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed === 0 ? 0 : 1);
})();
