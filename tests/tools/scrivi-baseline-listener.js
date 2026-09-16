// Riscrive tests/BASELINE-LISTENER.txt GUIDANDO L'APP.
//
// ⚠️ IL CONTO SI MISURA, NON SI LEGGE DAL SORGENTE, e il motivo è un buco
// trovato falsificando il 2026-09-16: i sette `*-complete-btn` hanno DUE
// listener — `sfxPlayExitSound`, attaccato da `renderSummaryScreen` con un id
// calcolato, e il completamento del modulo. Il primo non compare in nessuna
// riga `getElementById('...')`, quindi un baseline letto dal sorgente direbbe
// «1» dove la realtà è «2» — e un pulsante che perde il completamento ma tiene
// il suono passerebbe inosservato: suona e non completa.
//
// Si lancia SOLO quando un pulsante viene aggiunto o tolto DI PROPOSITO.
// Durante il passo 21-quater i listener si SPOSTANO: il baseline non cambia, e
// se cambia è un errore del passo.
//
//   node tests/tools/scrivi-baseline-listener.js
const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni } = require('../test-env');
const { FAMIGLIE, listenerDichiarati } = require('../listener-census');
const { openModule } = require('../map-driver');
const { stepsBefore } = require('../module-order');

const PASSO_DI = {
  voice: 'voicePractice', personalizza: 'personalizzazione', match: 'matchEngIta',
  speedMatch: 'speedMatchEngIta', dialogo: 'dialogoAscoltaRipeti',
  storyCards: 'meetTheStory', flashcard: 'flashcardAEngIta', repeatAloud: 'repeatAloud'
};

const contatore = () => {
  window.__reg = {};
  const vero = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (tipo, fn, opts) {
    if (this && this.id) {
      const k = this.id + '|' + tipo;
      window.__reg[k] = (window.__reg[k] || 0) + 1;
    }
    return vero.call(this, tipo, fn, opts);
  };
};
const mockInit = () => {
  class FU { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = FU;
  function FakeRec() { this.onstart = null; this.onend = null; this.onresult = null; this.onerror = null; }
  FakeRec.prototype.start = function () { if (this.onstart) this.onstart(); };
  FakeRec.prototype.stop = function () { if (this.onend) this.onend(); };
  FakeRec.prototype.abort = function () {};
  window.SpeechRecognition = FakeRec; window.webkitSpeechRecognition = FakeRec;
};

async function misura() {
  const browser = await launchBrowser();
  const conti = {};
  for (const fam of Object.keys(FAMIGLIE)) {
    const passo = PASSO_DI[fam];
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    await page.addInitScript(contatore);
    await page.addInitScript(mockInit);
    const u = 'Base' + fam;
    await page.goto(APP_URL);
    await page.fill('#name-input', u);
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
    await page.evaluate(function (d) {
      localStorage.setItem('baseinglese:gate:customizeSeen:' + d.u, '1');
      localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + d.u, '1');
      localStorage.setItem('baseinglese:modules:gate:' + d.u, JSON.stringify({ completed: d.f }));
    }, { u: u, f: stepsBefore(passo) });
    await page.click('#go-episode');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    await openModule(page, passo);
    const reg = await page.evaluate(() => window.__reg);
    Object.keys(reg).forEach(function (k) {
      conti[k] = Math.max(conti[k] || 0, reg[k]);
    });
    await page.close();
  }
  await browser.close();
  return conti;
}

misura().then(function (conti) {
  const fam = {};
  Object.keys(FAMIGLIE).forEach(function (f) {
    const p = FAMIGLIE[f].pattern;
    Object.keys(conti).forEach(function (k) { if (p.test(k.split('|')[0])) fam[k] = f; });
  });
  const righe = Object.keys(conti).sort()
    .map(function (k) { return (fam[k] || 'condiviso') + ' ' + k + ' ' + conti[k]; });
  const vecchio = fs.readFileSync(repoPath('tests', 'BASELINE-LISTENER.txt'), 'utf8');
  const testa = vecchio.slice(0, vecchio.indexOf('# Totale:'));
  fs.writeFileSync(repoPath('tests', 'BASELINE-LISTENER.txt'),
    testa + '# Totale: ' + righe.length + '\n' + righe.join('\n') + '\n');
  console.log('BASELINE-LISTENER.txt riscritto: ' + righe.length + ' righe, misurate guidando l\'app');
}).catch(function (e) { console.error(e); process.exit(1); });
