// Riscrive tests/BASELINE-AVVIO.txt guidando l'app.
//
// ⚠️ SI LANCIA SOLO QUANDO UNA DECISIONE STRUTTURALE CAMBIA L'AVVIO DI
// PROPOSITO, e in quel caso il commit che lo lancia e' il commit di quella
// decisione — mai il commit di un'estrazione.
//
//   node tests/tools/scrivi-baseline-avvio.js
const fs = require('fs');
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath } = require('../test-env');
const { fotografiaAvvio, aRighe } = require('../avvio-census');

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await bloccaFontEsterni(page);
  await page.goto(APP_URL);
  await page.waitForSelector('.view.is-active', { timeout: 15000 });
  const righe = aRighe(await fotografiaAvvio(page));
  await browser.close();
  const intestazione = [
    '# La fotografia dell\'avvio: cosa l\'app fa fra il primo byte e la',
    '# schermata di login, in ordine.',
    '#',
    '# ⚠️ IL PASSO 22 NON DEVE CAMBIARE QUESTO FILE.',
    '#',
    '# Il 22 SPOSTA codice in file separati. Un\'estrazione fatta bene lascia',
    '# l\'avvio identico: stessi moduli registrati nello stesso ordine, stesse',
    '# pulizie, stessa vista alla fine. **Un diff qui durante un\'estrazione e\'',
    '# un ERRORE, non un aggiornamento** — esattamente come',
    '# tests/BASELINE-LISTENER.txt per il 21-quater, che in otto giri non e\'',
    '# cambiato di una riga.',
    '#',
    '# ⚠️ E IL LIMITE, perche\' qui e\' diverso dal baseline dei listener: quello',
    '# non doveva cambiare MAI. Questo puo\' cambiare, ma **solo per una',
    '# decisione strutturale dichiarata** — spezzare una funzione, aggiungere un',
    '# file di strato — e allora si riscrive nel commit di QUELLA decisione, con',
    '# il motivo. Mai come effetto collaterale di uno spostamento.',
    '#',
    '# *La differenza fra le due cose e\' tutto il valore del file: se si',
    '# riscrive quando fa comodo, torna a essere un rapporto.*',
    '#',
    '# Lo scrive tests/tools/scrivi-baseline-avvio.js guidando l\'app.',
    '# Ultimo aggiornamento: ' + new Date().toISOString().slice(0, 10),
    ''
  ].join('\n');
  fs.writeFileSync(repoPath('tests', 'BASELINE-AVVIO.txt'), intestazione + righe.join('\n') + '\n');
  console.log('Baseline avvio scritto: ' + righe.length + ' righe');
})();
