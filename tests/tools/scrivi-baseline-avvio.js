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
  "            primo modulo.",
  "2026-09-18  app/dati.js entra come NONO script. Il conto passa da 9 a 10.",
  "            Terza delle cinque cose che servono al primo modulo.",
  "2026-09-18  app/orchestrazione.js entra come DECIMO script, e NON in <head>:",
  "            e' il primo della SECONDA FILA, in fondo a <body>, subito prima",
  "            dello script principale. Il conto passa da 10 a 11.",
  "            ⚠️ E' la prima riga di questa storia che cambia il POSTO e non",
  "            solo il numero. Gli altri nove stanno in <head> perche' non",
  "            toccano il markup; `views` prende tredici nodi con",
  "            getElementById a tempo di parsing, quindi il markup deve gia'",
  "            esistere. Chi legge questo elenco cercando «dove va il tag",
  "            nuovo» da qui in poi ha due risposte, e la domanda che le",
  "            distingue e': questo file tocca il markup mentre viene letto?",
  "2026-09-18  app/ui-condivisa.js entra come UNDICESIMO script, nella seconda",
  "            fila accanto a orchestrazione. Il conto passa da 11 a 12.",
  "            ⚠️ Ed e' il primo file con una dipendenza a tempo di PARSING:",
  "            quattro alias in cima all'IIFE verso dati.js e quiz-engine.js.",
  "            Da qui l'ordine dei tag non e' piu' solo dichiarato, e' un",
  "            vincolo — e test_dipendenze_dichiarate [C] e' la riga che lo",
  "            tiene fermo.",
  "2026-09-18  app/personalizza.js entra come DODICESIMO script, seconda fila,",
  "            DOPO ui-condivisa. Il conto passa da 12 a 13.",
  "            ⚠️ E' IL PRIMO MODULO, non uno strato — e il suo posto non e'",
  "            una scelta: prende i suoi alias a tempo di parsing, quindi in",
  "            <head> moriva con «slotOptions is not a function». E' la prima",
  "            volta che l'ordine dei tag rompe qualcosa davvero.",
  "2026-09-18  app/mappa.js entra come TREDICESIMO script, seconda fila. Il",
  "            conto passa da 13 a 14. E' l'ultimo pezzo del 22 che non e' un",
  "            modulo: mappa, Pannello Admin, boot, goHome, la Schermata",
  "            Finale e la schermata d'errore.",
  "2026-09-18  app/storycards.js entra come QUATTORDICESIMO script, seconda",
  "            fila. Il conto passa da 14 a 15. E' il secondo modulo, e porta",
  "            DUE passi della mappa in un file solo: Meet the Story e Why We",
  "            Say It. Zero delle sue diciassette funzioni guarda il profilo.",
  "2026-09-19  app/repeataloud.js entra come QUINDICESIMO script, seconda fila.",
  "            Il conto passa da 15 a 16. E' IL PRIMO MODULO del passo 23, ed",
  "            e' uscito per primo perche' e' il piu' piccolo dei sei: quattro",
  "            pezzi, 117 righe. Se la meccanica dell'estrazione ha un",
  "            difetto, si vede li' al costo minore — e infatti ne ha avuto",
  "            uno (l'alias su itemText, che viene da index.html e quindi non",
  "            esiste ancora quando il file viene letto).",
  "            ⚠️ E la fila: questo file NON tocca nessun nodo mentre viene",
  "            letto — i suoi sette listener si agganciano dentro la sua open",
  "            — eppure sta nella seconda fila lo stesso, per i venti alias e",
  "            per registraModulo al primo livello dell'IIFE. Le ragioni",
  "            della seconda fila sono DUE, non una.",
  "2026-09-19  app/flashcard.js entra come SEDICESIMO script, seconda fila.",
  "            Il conto passa da 16 a 17. E' il SECONDO modulo, e con lui",
  "            cambiano anche l'ordine dei moduli registrati e quello delle",
  "            pulizie: flashcard e fcClearNavTimeout risalgono, perche' ora",
  "            si registrano quando il loro file viene letto invece che al",
  "            punto in cui stavano dentro index.html. ⚠️ E' un diff",
  "            ATTESO dello spostamento, non un cambio di comportamento:",
  "            l'ordine di registrazione non decide niente — openModuleByKind",
  "            cerca per chiave, e le pulizie girano tutte.",
  "2026-09-19  app/match.js entra come DICIASSETTESIMO script, seconda fila.",
  "            Il conto passa da 17 a 18. E' il TERZO modulo, e registra DUE",
  "            kind con la stessa open (matchEngIta, matchItaEng): l'ordine",
  "            dei moduli registrati cambia di conseguenza, ed e' un diff",
  "            atteso dello spostamento come per flashcard.",
  "2026-09-19  app/speedmatch.js entra come DICIOTTESIMO script, seconda fila.",
  "            Il conto passa da 18 a 19. E' il QUARTO modulo, e il PRIMO che",
  "            porta via una PULIZIA: srPulizia si registra quando questo file",
  "            viene letto, quindi risale nell'elenco. Registra anche due kind",
  "            con la stessa open (speedMatchEngIta, speedMatchItaEng), come",
  "            match. Tutti e due i diff sono ATTESI dallo spostamento.",
  "2026-09-19  app/voice.js entra come DICIANNOVESIMO script, seconda fila. Il",
  "            conto passa da 19 a 20, ed e' L'UNICA riga che cambia.",
  "            ⚠️ AVEVO DICHIARATO DUE DIFF IN PIU', E LA MISURA LI HA",
  "            SMENTITI. Avevo scritto che l'ordine dei moduli e quello delle",
  "            pulizie sarebbero cambiati, come per flashcard e speedmatch:",
  "            NON cambiano. voicePractice/voiceCoach restano 10 e 11,",
  "            vcResetRecording resta pulizia 4 — perche' voice.js prende in",
  "            fila il posto che la sua regione aveva rispetto agli altri file",
  "            gia' usciti. *La dichiarazione e' stata corretta verso la",
  "            misura, mai il contrario: uno spostamento che NON muove niente",
  "            e' esattamente quello che l'intestazione di questo file",
  "            chiede a un'estrazione fatta bene.*",
  "            E porta via l'APPARATO: vcRecognition nasce a tempo di parsing",
  "            dentro quel file. Non cambia l'avvio finche' i diciannove tag",
  "            si caricano tutti al boot, ma da quel giorno in poi quel file",
  "            non fa nascere solo del codice.",
  "2026-09-19  app/dialogo.js entra come VENTESIMO script, seconda fila. Il",
  "            conto passa da 20 a 21, e con lui I SEI MODULI SONO TUTTI",
  "            FUORI. Porta via la TERZA e ultima pulizia (dgClearAllTimers):",
  "            da qui in poi stopAllModuleActivity non ne registra nessuna da",
  "            index.html. E espone un nome, dgAudioProtected, che il listener",
  "            globale in cattura di index.html chiama guardato - l'eccezione",
  "            alla regola 16.",
  "2026-09-19  app/sessione.js entra col PASSO B, e il conto passa da 21 a 22.",
  "            ⚠️ MA E' IL PRIMO TAG CHE ENTRA IN MEZZO E NON IN FONDO: sta",
  "            subito dopo ui-condivisa.js, perche' i moduli lo aliasano.",
  "            Quindi NOVE file slittano di uno, da mappa.js a dialogo.js, e",
  "            il diff di questo file e' lungo mentre il cambiamento e' uno",
  "            solo. *Chi lo legge non deve cercare nove cose: deve cercare",
  "            la dodicesima riga.*",
  "            I moduli registrati e le pulizie NON cambiano: sessione.js non",
  "            registra niente, tiene lo stato."
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
