// Quanto dura la finestra fra «la pagina c'e'» e «i TESTI sono arrivati».
//
// Non e' un test: e' uno strumento di misura, come misura-finestra-apertura.js.
//
// ⚠️ PARENTI, NON GEMELLI — e la distinzione conta, perche' i due nomi si
// somigliano abbastanza da far credere che uno basti per l'altro:
//
//   misura-finestra-apertura.js  guarda l'APERTURA DI UN MODULO: fra «la
//     schermata risponde» e «il modulo ha il suo contenuto». Serve quando
//     qualcuno aggiunge un fetch a openModuleFromMap.
//
//   questo (misura-finestra-boot.js)  guarda il BOOT: fra DOMContentLoaded e
//     «istruzioni-moduli.json e' arrivato». Serve quando qualcuno vuole far
//     scrivere dal JSON un testo che oggi sta nel markup statico — cioe' il
//     giro B del passo 18.
//
// Stessa idea (**una finestra in cui l'interfaccia non ha ancora quello che
// le serve**), momento diverso, e nessuno dei due risponde alla domanda
// dell'altro. Lo stesso rapporto che c'e' fra attendi.sh e attendi-ci.sh.
//
//   node tests/tools/misura-finestra-boot.js
//   node tests/tools/misura-finestra-boot.js --giri=20
//   node tests/tools/misura-finestra-boot.js --ritarda=300   # rete mobile
//
// ⚠️ IL NUMERO CHE DA' E' UN PAVIMENTO, NON LA MISURA. Gira contro il server
// statico locale, cioe' un file sulla stessa macchina: 31 ms di mediana il
// 2026-09-15 (17-43 su dieci giri). Su GitHub Pages c'e' un round-trip vero,
// e **dal container non si puo' misurare** — il proxy di rete blocca
// github.io. Per quello c'e' `--ritarda`, che riproduce la rete lenta invece
// di stimarla: a 300 ms la finestra misurata e' 310.
//
// Perche' e' servito: al giro B del passo 18 la domanda era «serve un segnale
// di caricamento o la finestra e' invisibile?». Con 31 ms la risposta non e'
// scontata in nessuna delle due direzioni, e senza il numero sarebbe stata
// un'opinione. Stessa ragione per cui esiste il suo parente: **senza uno
// strumento, «la finestra e' trascurabile» e' una parola.**

const { launchBrowser, APP_URL, bloccaFontEsterni } = require('../test-env');

const args = process.argv.slice(2);
function opz(nome, def) {
  const a = args.find(function (x) { return x.indexOf('--' + nome + '=') === 0; });
  return a ? parseInt(a.split('=')[1], 10) : def;
}
const GIRI = opz('giri', 10);
const RITARDA = opz('ritarda', 0);

async function run() {
  const browser = await launchBrowser();
  const misure = [];
  for (let g = 0; g < GIRI; g++) {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    if (RITARDA) {
      await page.route('**/istruzioni-moduli.json', async function (route) {
        await new Promise(function (r) { setTimeout(r, RITARDA); });
        await route.continue();
      });
    }
    // si misura DENTRO la pagina: nessun round-trip fra i due istanti
    await page.addInitScript(function () {
      window.__boot = {};
      document.addEventListener('DOMContentLoaded', function () {
        window.__boot.tDom = performance.now();
        // e subito il fetch che il giro B farebbe al boot
        fetch('data/inglese/it/inglese-it-istruzioni-moduli.json')
          .then(function (r) { return r.json(); })
          .then(function () { window.__boot.tJson = performance.now(); })
          .catch(function () { window.__boot.tJson = -1; });
      });
    });
    await page.goto(APP_URL);
    await page.waitForFunction(function () { return window.__boot && window.__boot.tJson !== undefined; },
      null, { timeout: 30000 });
    const b = await page.evaluate(function () { return window.__boot; });
    misure.push(Math.round(b.tJson - b.tDom));
    await page.close();
  }
  await browser.close();
  misure.sort(function (a, b) { return a - b; });
  const mediana = misure[Math.floor(misure.length / 2)];
  console.log('finestra DOMContentLoaded -> JSON pronto' + (RITARDA ? '  [con --ritarda=' + RITARDA + ']' : ''));
  console.log('  giri:     ' + misure.join(', ') + ' ms');
  console.log('  mediana:  ' + mediana + ' ms');
  console.log('  minimo:   ' + misure[0] + ' ms   massimo: ' + misure[misure.length - 1] + ' ms');
}
run().catch(function (e) { console.error(e); process.exit(1); });
