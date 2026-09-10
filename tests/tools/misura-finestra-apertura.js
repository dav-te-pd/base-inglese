// Quanto un modulo fa aspettare prima di essere USABILE.
//
// Non e' un test: e' uno strumento di misura, come screenshot_blocco_ascolto.
// Misura la finestra fra "la schermata e' pronta e i pulsanti rispondono" e
// "il modulo ha davvero il suo contenuto". In mezzo c'e' tutto quello che
// l'apertura aspetta — e ogni fetch aggiunto li' dentro allunga quella
// finestra senza che nessuno se ne accorga.
//
//   node tests/tools/misura-finestra-apertura.js
//   node tests/tools/misura-finestra-apertura.js --giri=10
//   node tests/tools/misura-finestra-apertura.js --ritarda=2000
//
// ⚠️ PERCHE' ESISTE, ed e' un caso vissuto. Il 2026-09-10 `openVoiceCoach`
// aspettava un `Promise.all` che includeva `loadFeedbackMessages()` — un file
// di TESTI il cui risultato non veniva mai letto. Il modulo restava "in
// caricamento" per un file che non gli serviva, con il microfono gia' acceso:
// premerlo in quella finestra faceva esplodere `vcTargetText()` su una battuta
// nulla. In CI e' costato una corsa rossa; in mano a uno studente su rete
// lenta sarebbe stato un microfono che non fa niente e non dice perche'.
//
// La misura ha fatto due cose che il ragionamento da solo non faceva:
//   - ha dato il numero (17 ms di mediana), che ha fatto RITIRARE il segnale
//     di caricamento gia' proposto — un avviso che compare e sparisce in
//     diciassette millisecondi sfarfalla, ed e' peggio del nulla;
//   - e con `--ritarda` ha riprodotto il guasto vero, non solo ucciso il test.
//
// **Senza uno strumento, «la finestra e' sparita» e' una parola.** Con questo
// e' un numero prima e un numero dopo. Serve ogni volta che qualcuno aggiunge
// un fetch all'apertura di un modulo.

'use strict';
const path = require('path');
const { launchBrowser, APP_URL } = require(path.resolve(__dirname, '..', 'test-env'));
const { stepsBefore } = require(path.resolve(__dirname, '..', 'module-order'));

const args = process.argv.slice(2);
function opzione(nome, def) {
  const t = args.find(function (a) { return a.indexOf('--' + nome + '=') === 0; });
  return t ? Number(t.split('=')[1]) : def;
}
const GIRI = opzione('giri', 5);
const RITARDA = opzione('ritarda', 0);

// La sonda vive DENTRO la pagina: registra i due istanti guardando il testo
// che il modulo mette al posto di "Caricamento...". Dal di fuori non si
// potrebbe — fra un round-trip e l'altro la finestra e' gia' passata.
const sonda = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  function FakeRec() { this.onresult = null; this.onend = null; this.onerror = null; this.onstart = null; }
  FakeRec.prototype.start = function () { if (this.onstart) this.onstart(); };
  FakeRec.prototype.stop = function () { if (this.onend) this.onend(); };
  FakeRec.prototype.abort = function () {};
  window.SpeechRecognition = FakeRec; window.webkitSpeechRecognition = FakeRec;

  window.__finestra = {};
  (function osserva() {
    const t = document.getElementById('vc-target');
    if (!t) return setTimeout(osserva, 5);
    new MutationObserver(function () {
      const testo = t.textContent;
      if (testo === 'Caricamento...' && !window.__finestra.t0) window.__finestra.t0 = performance.now();
      else if (testo && testo !== 'Caricamento...' && window.__finestra.t0 && !window.__finestra.t1) {
        window.__finestra.t1 = performance.now();
      }
    }).observe(t, { childList: true, characterData: true, subtree: true });
  })();
};

(async () => {
  const browser = await launchBrowser();
  const misure = [];
  for (let giro = 1; giro <= GIRI; giro++) {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).slice(0, 70)); });
    await page.addInitScript(sonda);
    if (RITARDA) {
      await page.route('**/messaggi-feedback.json', async function (r) {
        await new Promise(function (x) { setTimeout(x, RITARDA); });
        await r.continue();
      });
    }
    await page.goto(APP_URL);
    if (!(await page.isVisible('#name-input').catch(function () { return false; }))) {
      await page.click('#switch-user');
      await page.waitForSelector('#name-input');
    }
    await page.fill('#name-input', 'Finestra');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode');
    await page.evaluate(function (p) {
      localStorage.setItem('baseinglese:modules:gate:Finestra', JSON.stringify({ completed: p }));
      ['mappaEpisodio', 'personalizzazione', 'voicePractice', 'voiceCoach']
        .forEach(function (k) { localStorage.setItem('baseinglese:introDismissed:' + k + ':Finestra', '1'); });
    }, stepsBefore('voiceCoach'));
    await page.click('#go-episode');
    await page.waitForFunction(function () { return document.querySelectorAll('#module-list [data-module]').length > 0; });
    await page.click('[data-module="voiceCoach"]');

    // Il microfono, appena la schermata c'e': e' il gesto che il difetto
    // rendeva pericoloso, quindi si prova sempre.
    await page.waitForSelector('#vc-record-btn', { state: 'visible', timeout: 20000 });
    const stato = await page.evaluate(function () {
      return {
        spento: document.getElementById('vc-record-btn').disabled,
        target: document.getElementById('vc-target').textContent
      };
    });
    if (!stato.spento) await page.click('#vc-record-btn', { timeout: 3000 }).catch(function () {});
    await page.waitForTimeout(200);

    const f = await page.evaluate(function () { return window.__finestra; });
    const durata = (f && f.t0 && f.t1) ? Math.round(f.t1 - f.t0) : null;
    if (durata !== null) misure.push(durata);
    console.log('giro ' + giro + ': finestra ' + (durata === null ? 'non osservata (mai "Caricamento..." visibile, o gia\' chiusa)' : durata + ' ms') +
      '  |  al click il target diceva: "' + stato.target + '"' +
      '  |  errori JS: ' + (errori.length ? errori.join(' ') : 'nessuno'));
    await page.close();
  }
  if (misure.length) {
    misure.sort(function (a, b) { return a - b; });
    console.log('\n  minimo ' + misure[0] + ' ms | mediana ' + misure[Math.floor(misure.length / 2)] +
      ' ms | massimo ' + misure[misure.length - 1] + ' ms   (su ' + misure.length + ' giri osservati di ' + GIRI + ')');
  } else {
    console.log('\n  Nessuna finestra osservata in ' + GIRI + ' giri: il modulo aveva il contenuto prima che la schermata comparisse.');
  }
  await browser.close();
})();
