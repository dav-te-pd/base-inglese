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
// ⚠️ LA STORIA DEI DIFF STA QUI, NON NEL FILE — e il perche' e' una misura,
// non un'opinione: il 2026-09-17 l'avevo scritta a mano DENTRO
// tests/BASELINE-AVVIO.txt, e la prima rigenerazione l'ha CANCELLATA senza
// dirlo, perche' questo script riscrive l'intestazione per intero.
//
// **Una difesa che sparisce quando lo strumento gira e' una difesa che non
// c'e'** — ed e' la famiglia della regola 37: non somigliava a un guasto,
// somigliava a un file aggiornato. Adesso la storia e' un dato di QUESTO
// file, quindi ogni rigenerazione la riporta.
//
// Una riga per DECISIONE STRUTTURALE, mai per uno spostamento.
const STORIA = [
  "2026-09-17  script 3 (inline) -> app/avvio.js. Estrazione dello strato 0.",
  "            Il conto resta 4.",
  "2026-09-17  script 4 (inline) -> app/progressi.js, piu' la riga nuova",
  "            script 5 (inline). Estrazione dello strato `progressi`:",
  "            il conto passa da 4 a 5.",
  "2026-09-17  app/identita.js entra in TERZA posizione, e le tre righe dopo",
  "            scalano: avvio, progressi, (inline). Il conto passa da 5 a 6.",
  "            Sta prima di avvio.js perche' avvio legge BI.THEME_KEY.",
  "2026-09-18  app/audio.js entra come SESTO script, dopo progressi. Il conto",
  "            passa da 6 a 7. E' l'ultimo strato del passo 22: da qui il",
  "            conto non cambia piu' fino al 23.",
  "2026-09-18  app/suoni.js entra come SETTIMO script, dopo audio. Il conto",
  "            passa da 7 a 8. ⚠️ E la riga qui sopra diceva «da qui il conto",
  "            non cambia piu' fino al 23»: FALSA dopo un giorno. Il 22 era",
  "            chiuso per gli STRATI e non per i moduli — il modulo piu'",
  "            piccolo ha venti dipendenze irraggiungibili, e i suoni sono",
  "            una di quelle. Escono per servire chi verra' dopo.",
  "2026-09-18  app/quiz-engine.js entra come OTTAVO script, dopo suoni. Il",
  "            conto passa da 8 a 9. Seconda delle cinque cose che servono al",
  "            primo modulo."
];

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
    '# ⚠️ I CAMBIAMENTI CHE QUESTO FILE HA AVUTO, con la decisione che li',
    '# giustifica. Sono gli unici ammessi, e un diff senza una riga in piu\'',
    '# qui sotto e\' un errore. L\'elenco vive dentro',
    '# tests/tools/scrivi-baseline-avvio.js, non qui: scritto qui verrebbe',
    '# cancellato dalla prima rigenerazione — e\' successo il 2026-09-17.',
    '#'
  ].concat(STORIA.map(function (r) { return '#   ' + r; })).concat([
    '#',
    '# Lo scrive tests/tools/scrivi-baseline-avvio.js guidando l\'app.',
    '# Ultimo aggiornamento: ' + new Date().toISOString().slice(0, 10),
    ''
  ]).join('\n');
  fs.writeFileSync(repoPath('tests', 'BASELINE-AVVIO.txt'), intestazione + righe.join('\n') + '\n');
  console.log('Baseline avvio scritto: ' + righe.length + ' righe');
})();
