// Fotografa il Blocco Ascolto in OGNI modulo che lo mostra, in un giro solo.
//
// Perché esiste: il Blocco Ascolto è un pezzo condiviso, e il difetto che si
// vede su un pezzo condiviso è "in un modulo si vede diverso dagli altri" —
// una cosa che nessun test rileva, perché ogni modulo passa i propri test
// mentre è diverso dal vicino. L'unico controllo che la trova è guardare i
// sette punti AFFIANCATI, ed è un lavoro che si rifà a ogni modifica al
// componente: qui è scritto una volta.
//
//   node tests/tools/screenshot_blocco_ascolto.js --dir=prima
//   ... modifica ...
//   node tests/tools/screenshot_blocco_ascolto.js --dir=dopo
//
// Poi si guardano le due cartelle affiancate. Fotografa il blocco e il suo
// contorno (non la pagina intera): un ritaglio stretto rende visibile una
// spaziatura cambiata di due pixel, che a pagina intera si perde.

const fs = require('fs');
const path = require('path');
const { launchBrowser, APP_URL, outputPath } = require('../test-env');
const { stepsBefore, stepIds } = require('../module-order');

const args = process.argv.slice(2);
function opzione(nome, def) {
  const trovata = args.find(function (a) { return a.indexOf('--' + nome + '=') === 0; });
  return trovata ? trovata.split('=')[1] : def;
}
const SOTTOCARTELLA = opzione('dir', 'blocco-ascolto');

// I sette punti, nell'ordine in cui compaiono nel codice. `selettore` è
// l'elemento da fotografare; `prepara` porta il modulo nello stato in cui il
// blocco si vede (alcuni lo mostrano solo dopo un passo).
const PUNTI = [
  { nome: '1-repeat-aloud', passo: 'repeatAloud', selettore: '.repeat-item:first-child' },
  { nome: '2-why-we-say-it', passo: 'whyWeSayIt', selettore: '#story-cards-body .wws-card:first-child' },
  // La stessa card più avanti nella lista: è quella BLOCCATA, il caso che ha
  // fatto nascere questo lavoro. Il blocco dev'essere spento come il resto.
  { nome: '2b-why-we-say-it-bloccata', passo: 'whyWeSayIt', selettore: '#story-cards-body .wws-card.is-ahead' },
  { nome: '3-voice-practice', passo: 'voicePractice', selettore: '#vc-audio-controls' },
  { nome: '4-voice-check', passo: 'voiceCoach', selettore: '#vc-audio-controls' },
  { nome: '5-match-eng-ita', passo: 'matchEngIta', selettore: '#qm-prompt-audio', prepara: avviaMatch },
  // Il "Mini Blocco Ascolto": solo il pulsante, senza le velocità.
  { nome: '6-match-ita-eng-mini', passo: 'matchItaEng', selettore: '#qm-options .qm-option-row:first-child', prepara: avviaMatch },
  { nome: '7-flash-card', passo: 'flashcardAEngIta', selettore: '#fc-card', prepara: avviaFlashcard }
];

async function avviaMatch(page) {
  await page.click('#qm-start-btn').catch(function () {});
  await page.waitForTimeout(400);
}

async function avviaFlashcard(page) {
  await page.click('#fc-intro-start-btn').catch(function () {});
  await page.waitForTimeout(400);
}

const mockVoce = () => {
  const fakeSynth = {
    speaking: false, _current: null,
    speak(u) { this.speaking = true; this._current = u; if (u.onstart) u.onstart(); u._t = setTimeout(() => { if (this._current === u) { this.speaking = false; this._current = null; } if (u.onend) u.onend(); }, 30); },
    cancel() { const u = this._current; if (u) { this.speaking = false; this._current = null; clearTimeout(u._t); if (u.onend) u.onend(); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.onstart = null; this.onend = null; this.onerror = null; };
};

(async () => {
  const browser = await launchBrowser();
  const utente = 'BloccoAscolto';
  const cartella = path.dirname(outputPath(path.join(SOTTOCARTELLA, 'x.png')));
  fs.mkdirSync(cartella, { recursive: true });

  for (const punto of PUNTI) {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.addInitScript(mockVoce);
    await page.goto(APP_URL);
    await page.fill('#name-input', utente);
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode');
    await page.evaluate(function (a) {
      localStorage.setItem('baseinglese:modules:gate:' + a.utente, JSON.stringify({ completed: a.prima }));
      a.kinds.forEach(function (k) { localStorage.setItem('baseinglese:introDismissed:' + k + ':' + a.utente, '1'); });
    }, {
      utente: utente,
      prima: stepsBefore(punto.passo),
      kinds: ['mappaEpisodio'].concat(stepIds().map(function (id) { return id.replace(/-\d+$/, ''); }))
    });
    await page.click('#go-episode');
    await page.waitForFunction(function () { return document.querySelectorAll('#module-list [data-module]').length > 0; });
    await page.click('[data-module="' + punto.passo + '"]');
    await page.waitForTimeout(700);
    if (punto.prepara) await punto.prepara(page);

    const el = await page.$(punto.selettore);
    const percorso = outputPath(path.join(SOTTOCARTELLA, punto.nome + '.png'));
    if (el && (await el.boundingBox())) {
      await el.screenshot({ path: percorso });
      console.log('OK   ' + punto.nome + '  ->  ' + percorso);
    } else {
      // Non si inventa uno screenshot vuoto: si dice che quel punto non è
      // stato raggiunto, perché un file mancante nel confronto è un
      // risultato, e un file nero non lo è.
      console.log('VUOTO ' + punto.nome + '  (selettore non trovato: ' + punto.selettore + ')');
    }
    await page.close();
  }

  await browser.close();
})();
