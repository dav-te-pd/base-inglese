// PROTEGGE: che il censimento delle attese a tempo dica il vero, invece di
// invecchiare in silenzio mentre qualcuno lo cita per pianificare.
//
// Perche' esiste, ed e' un caso vissuto, non un'ipotesi. `tests/ATTESE-FISSE.md`
// era scritto a mano, per NUMERO DI RIGA. Misurato il 2026-09-10:
//
//   - 140 dei suoi 141 numeri di riga erano SBAGLIATI (uno solo era ancora
//     giusto), perche' rinomine e correzioni avevano spostato tutto;
//   - 4 voci indicavano righe che non esistevano piu';
//   - e soprattutto: il documento ne dichiarava 141 mentre nel codice ce
//     n'erano ~204. Non per una definizione diversa — erano punti dello stesso
//     tipo, semplicemente non elencati.
//
// **Un censimento dice DOVE GUARDARE — non quanto e' largo il problema — a
// meno che non sia lui stesso a contarle.** E la fase 3 era stata pianificata
// su quel documento: «le 19 attese di test_batch19» erano diventate 7.
//
// COME, e sono due scelte che vanno lette insieme.
//
// ① **I punti non si identificano per numero di riga.** Un numero di riga si
//    sposta a ogni commit; l'ASSERZIONE che l'attesa protegge no — e se
//    cambia, e' perche' qualcuno l'ha cambiata di proposito. Quindi ogni voce
//    del censimento e' `file + etichetta dell'asserzione + millisecondi`. Il
//    numero di riga si stampa lo stesso, ma come comodita' del momento, non
//    come identita': accanto porta la data della generazione.
//
// ② **Guardia o navigazione.** Un `waitForTimeout` conta solo se il verde di
//    un'asserzione dipende da quel numero. Si scorre in avanti dall'attesa: se
//    si incontra un `log(` PRIMA di un'altra attesa vera (waitForSelector,
//    waitForFunction, un helper di tests/attese.js, un altro waitForTimeout) o
//    prima della fine della finestra, e' una GUARDIA. Altrimenti e'
//    NAVIGAZIONE: se e' troppo corta il test si rompe aspettando: fallisce, non
//    passa per sbaglio.
//
//    ⚠️ LIMITE DICHIARATO, e va saputo prima di fidarsi del numero: e'
//    un'euristica sul testo, non un'analisi del flusso. Un `log` che rilegge
//    una variabile calcolata PRIMA dell'attesa viene contato come guardia
//    anche se non lo e'. Verificata a mano su test_batch19 (17 punti su 17
//    corretti) e a campione su test_batch7 e test_batch9. Serve a dire
//    QUANTO e' largo il problema e DOVE sta: l'elenco che ne esce si legge,
//    non si esegue.
//
//   node tests/tools/conta-attese.js                      # stampa il censimento
//   node tests/tools/conta-attese.js --scrivi             # rigenera ATTESE-FISSE.md
//   node tests/tools/conta-attese.js <file.js> [altri...] # solo quei file
//
// L'ultima forma serve a chi verifica lo strumento: senza, l'unico modo di
// dargli in pasto un file finto sarebbe riscrivere la riga FILES di
// run_full_regression.sh — cioe' **modificare lo script che sta eseguendo la
// suite, mentre la esegue**. E' come la regola 36 vista da dentro: un test che
// per misurarsi tocca l'albero di lavoro non e' un test, e' un guasto in
// attesa. Come lo prende `conta-asserzioni.js`, che l'elenco lo riceve.
//
// Con `--scrivi` riscrive SOLO la parte fra i due marcatori del documento: la
// prosa in testa — a cosa serve il file, il caso di test_batch19, i «Gia'
// corretti» — e' memoria scritta a mano e non si tocca.

'use strict';
const fs = require('fs');
const path = require('path');

const CARTELLA_TEST = path.resolve(__dirname, '..');
const DOCUMENTO = path.join(CARTELLA_TEST, 'ATTESE-FISSE.md');
const INIZIO = '<!-- GENERATO DA tests/tools/conta-attese.js — non modificare a mano -->';
const FINE = '<!-- FINE GENERATO -->';

// Le attese VERE: aspettano uno stato, non un numero. Chi ne incontra una
// prima di un log e' navigazione, perche' l'asserzione dipende da quella e
// non dai millisecondi.
const ATTESA_VERA = /waitForSelector|waitForFunction|waitForEvent|waitForLoadState|waitForURL|attendiSottotitoloEsito|attendiVisibile|attendiNascosto|playThroughQuiz|waitForQuizChange|rispondiECompleta|riprendiDopoERientra/;
const LOG = /(?<![\w.])log\(/;

// ⚠️ IL MARCATORE DELLE ATTESE LEGITTIME, e non e' burocrazia: senza, il conto
// mente nella direzione peggiore.
//
// Non tutte le attese a tempo sono un debito. Ce ne sono due specie che NON si
// possono convertire, e che restano a tempo per sempre:
//
//   - quelle che verificano che una cosa NON accada (nessun avviso, nessun
//     avanzamento, nessun errore in console): non si puo' aspettare un
//     non-evento, quindi li' i millisecondi SONO la misura;
//   - quelle su uno stato che era GIA' vero prima dell'attesa (un elemento
//     nascosto fin dall'apertura): un'attesa "finche' e' nascosto" tornerebbe
//     al primo istante senza aver verificato niente.
//
// Se restano nel totale delle guardie, chi legge il numero crede che siano
// debito da chiudere. E chi le "chiude" convertendole non lascia un rosso:
// lascia un VERDE CHE NON PROVA PIU' NIENTE — mentre il conto scende, cioe' il
// numero con cui misuriamo il progresso migliora proprio quando il lavoro fa
// danno. (Misurato l'11 settembre sulla famiglia «una schermata che compare o
// sparisce»: 9 punti su 29 erano di queste due specie, 3 dei quali si sarebbero
// silenziosamente svuotati convertendoli.)
//
// Quindi il marcatore sta NEL SITO, dove lo legge chi passa di li', e lo
// strumento lo raccoglie da solo — invece di un elenco a parte che va riletto a
// mano e che scade in silenzio come il vecchio censimento.
//
//   await page.waitForTimeout(500); // ATTESA-LEGITTIMA: il motivo, per esteso
//
// Il motivo e' obbligatorio: un marcatore nudo sarebbe un permesso, e chi arriva
// dopo non saprebbe se fidarsi. Con il motivo scritto puo' dissentire.
const LEGITTIMA = /ATTESA-LEGITTIMA\s*:?\s*(.*)$/;
const FINESTRA = 16; // righe guardate in avanti

function fileDaCensire() {
  const espliciti = process.argv.slice(2).filter(function (a) { return /\.js$/.test(a); });
  if (espliciti.length) return espliciti;
  const sh = fs.readFileSync(path.join(CARTELLA_TEST, 'run_full_regression.sh'), 'utf8');
  const m = sh.match(/^FILES="([^"]+)"/m);
  if (!m) throw new Error('Non trovo la lista FILES in run_full_regression.sh');
  // ⚠️ test_conta_attese.js e' escluso dal censimento AUTOMATICO, e non e' una
  // scorciatoia: quel file contiene il codice FINTO con cui questo strumento
  // viene misurato — attese scritte dentro una stringa, che non girano mai.
  // Censirle significherebbe contare le proprie impalcature come debito della
  // suite: fino all'11 settembre tre finte stavano dentro le 186. Passandolo
  // ESPLICITAMENTE sulla riga di comando viene censito lo stesso, ed e' cosi'
  // che il suo test lo esercita.
  return m[1].split(/\s+/).filter(Boolean).filter(function (f) {
    return path.basename(f) !== 'test_conta_attese.js';
  });
}

// Un nome nudo si cerca in tests/; un percorso si prende com'e', cosi' un file
// finto puo' stare fuori dal repository e non sporcare niente.
function risolvi(f) {
  return (path.isAbsolute(f) || f.indexOf('/') !== -1) ? f : path.join(CARTELLA_TEST, f);
}

// L'etichetta dell'asserzione protetta — l'IDENTITA' della voce, quindi va
// presa per intero. Non basta la prima stringa: molte etichette sono composte
// (`'[B] ' + modulo.nome + ': l\'avviso sale...'`) e fermarsi al primo pezzo
// darebbe "[B]" per dodici voci diverse, cioe' un identificatore che non
// identifica. Si prende tutto il primo argomento, fino alla virgola di primo
// livello, e lo si compatta.
function etichetta(riga) {
  const i = riga.indexOf('log(');
  if (i === -1) return '(asserzione senza etichetta leggibile)';
  let prof = 0, virgolette = null, fuori = '';
  for (let k = i + 4; k < riga.length; k++) {
    const c = riga[k];
    if (virgolette) {
      if (c === '\\') { fuori += (riga[k + 1] || ''); k++; continue; }
      if (c === virgolette) { virgolette = null; continue; }
      fuori += c;
      continue;
    }
    if (c === '\'' || c === '"' || c === '`') { virgolette = c; continue; }
    if (c === '(' || c === '[' || c === '{') prof++;
    if (c === ')' || c === ']' || c === '}') { if (prof === 0) break; prof--; }
    if (c === ',' && prof === 0) break;
    fuori += c;
  }
  const pulita = fuori.replace(/\s*\+\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return pulita || '(asserzione senza etichetta leggibile)';
}

// COSA si sta aspettando: e' la domanda del passo 14a, e la risposta sta in
// quello che l'asserzione LEGGE fra l'attesa e il log. Raggruppare per file
// dice chi ha il problema; raggruppare per questo dice quante FORME servono a
// chiuderlo — e le forme sono molte meno dei punti.
function cosaAspetta(righe, da, a) {
  const testo = righe.slice(da, a).join('\n');
  if (/__playedTones|speechSynthesis|\.detti|speaking/.test(testo)) return 'un suono o la voce';
  if (/localStorage/.test(testo)) return 'una scrittura nel localStorage';
  if (/getComputedStyle|opacity|pointerEvents/.test(testo)) return 'uno stile calcolato';
  if (/isVisible|\.hidden|getClientRects|toBeVisible/.test(testo)) return 'una schermata che compare o sparisce';
  if (/\.disabled|classList|className|getAttribute/.test(testo)) return 'un pulsante o una classe che cambia stato';
  if (/textContent|innerText|innerHTML/.test(testo)) return 'un testo che si riempie';
  if (/querySelectorAll|\.count\(/.test(testo)) return 'un elenco di elementi che si ridisegna';
  if (/getBoundingClientRect|offsetWidth|offsetLeft|\.width|\.left|\.top/.test(testo)) return 'una misura di geometria';
  if (/APP_CONFIG|CONFIG\.|fetch\(/.test(testo)) return 'un valore di configurazione o di dati';
  if (/errors|pageerror|console/.test(testo)) return 'la console (asserzione negativa)';
  return 'altro';
}

// L'azione che precede l'attesa: serve a raggruppare per COSA si sta
// aspettando, che e' la domanda del passo 14a. Si guarda indietro fino a
// trovare un'azione riconoscibile.
function azionePrecedente(righe, i) {
  for (let j = i; j >= Math.max(0, i - 6); j--) {
    const s = righe[j];
    if (/\.click\(|click\(\)/.test(s)) return 'click';
    if (/\bopenModule\(|openStory\(|apri\(|openEpisodeMap/.test(s)) return 'apertura modulo';
    if (/\.fill\(|keyboard\.press/.test(s)) return 'digitazione';
    if (/page\.goto|\.reload\(/.test(s)) return 'caricamento pagina';
    if (/vcAnswerLine|vcCompleteLine|dichiara\(|rispondi\(/.test(s)) return 'risposta a un modulo';
    if (/addInitScript|evaluate\(/.test(s)) return 'evaluate';
  }
  return 'nessuna azione riconosciuta';
}

function millisecondi(riga) {
  const m = riga.match(/waitForTimeout\((\d+)\)/);
  return m ? Number(m[1]) : null;
}

function censisci() {
  const voci = [];
  const legittime = [];
  const navigazione = {};
  fileDaCensire().forEach(function (f) {
    const p = risolvi(f);
    if (!fs.existsSync(p)) return;
    f = path.basename(f);
    const righe = fs.readFileSync(p, 'utf8').split('\n');
    navigazione[f] = 0;
    righe.forEach(function (r, i) {
      if (r.indexOf('waitForTimeout') === -1) return;
      if (r.trim().indexOf('//') === 0) return;
      let protetta = null, fine = i + FINESTRA;
      for (let j = i + 1; j < Math.min(i + FINESTRA, righe.length); j++) {
        const s = righe[j];
        if (s.trim().indexOf('//') === 0) continue;
        if (ATTESA_VERA.test(s) || s.indexOf('waitForTimeout') !== -1) break;
        if (LOG.test(s)) { protetta = etichetta(s); fine = j + 1; break; }
      }
      if (protetta === null) { navigazione[f]++; return; }
      // Marcata nel sito come non convertibile: e' una guardia, ma NON e'
      // debito. Va contata a parte, mai dentro il numero su cui si misura il 14b.
      const mLeg = r.match(LEGITTIMA);
      if (mLeg) {
        legittime.push({ file: f, asserzione: protetta, ms: millisecondi(r),
                         motivo: (mLeg[1] || '').replace(/\s+/g, ' ').trim(), riga: i + 1 });
        return;
      }
      voci.push({
        file: f,
        asserzione: protetta,
        ms: millisecondi(r),
        azione: azionePrecedente(righe, i),
        aspetta: cosaAspetta(righe, i + 1, fine),
        riga: i + 1
      });
    });
  });
  return { voci: voci, legittime: legittime, navigazione: navigazione };
}

function blocco(censimento) {
  const oggi = new Date().toISOString().slice(0, 10);
  const voci = censimento.voci;
  const legittime = censimento.legittime;
  const nav = censimento.navigazione;
  const perFile = {};
  voci.forEach(function (v) { (perFile[v.file] = perFile[v.file] || []).push(v); });
  const totNav = Object.keys(nav).reduce(function (a, k) { return a + nav[k]; }, 0);

  const out = [];
  out.push(INIZIO);
  out.push('');
  out.push('## Elenco — generato il ' + oggi);
  out.push('');
  out.push('**' + voci.length + ' guardie DA CONVERTIRE** — un\'attesa a tempo da cui dipende');
  out.push('il verde di un\'asserzione, e che si puo\' sostituire con un\'attesa sullo stato');
  out.push('vero. **E\' questo il numero su cui si misura il 14b**, e l\'unico che deve');
  out.push('scendere.');
  out.push('');
  out.push('| | quante |');
  out.push('|---|---|');
  out.push('| **guardie da convertire** — il debito | **' + voci.length + '** |');
  out.push('| guardie **legittime** — marcate nel sito, NON sono debito | ' + legittime.length + ' |');
  out.push('| attese di **navigazione** — se sono corte il test si rompe, non passa | ' + totNav + ' |');
  out.push('| in tutto | ' + (voci.length + legittime.length + totNav) + ' |');
  out.push('');
  out.push('⚠️ **I tre numeri non si sommano in uno solo, ed e\' il punto.** Una guardia');
  out.push('legittima verifica che una cosa NON accada, oppure uno stato che era gia\' vero:');
  out.push('convertirla la farebbe tornare al primo istante senza verificare niente — un');
  out.push('**verde che non prova piu\' niente**, mentre il conto scende. Tenerle nel totale');
  out.push('farebbe migliorare il numero proprio quando il lavoro fa danno.');
  out.push('');
  out.push('Ogni voce e\' identificata dall\'**asserzione che protegge**, non dal numero di');
  out.push('riga: la riga si sposta a ogni commit, l\'etichetta di un\'asserzione no. Il');
  out.push('numero di riga e\' stampato accanto come comodita\' del giorno in cui questo');
  out.push('file e\' stato generato — se non torna, si rigenera invece di correggerlo.');
  out.push('');
  const famiglie = {};
  voci.forEach(function (v) { famiglie[v.aspetta] = (famiglie[v.aspetta] || 0) + 1; });
  out.push('### Le famiglie — raggruppate per COSA aspettano');
  out.push('');
  out.push('*Raggruppare per file dice chi ha il problema; raggruppare per questo dice');
  out.push('quante FORME servono a chiuderlo. Le forme sono molte meno dei punti.*');
  out.push('');
  out.push('| cosa si aspetta | quante |');
  out.push('|---|---|');
  Object.keys(famiglie).sort(function (a, b) { return famiglie[b] - famiglie[a]; })
    .forEach(function (k) { out.push('| ' + k + ' | ' + famiglie[k] + ' |'); });
  out.push('');
  out.push('### Le guardie, una per una');
  out.push('');
  out.push('| file | ms | dopo | aspetta | asserzione protetta | riga (al ' + oggi + ') |');
  out.push('|---|---|---|---|---|---|');
  Object.keys(perFile).sort().forEach(function (f) {
    perFile[f].sort(function (a, b) { return a.riga - b.riga; }).forEach(function (v) {
      out.push('| `' + f + '` | ' + v.ms + ' | ' + v.azione + ' | ' + v.aspetta + ' | ' +
        v.asserzione.replace(/\|/g, '\\|') + ' | ' + v.riga + ' |');
    });
  });
  out.push('');
  out.push('### Le guardie legittime — marcate nel sito, e perche\'');
  out.push('');
  out.push('*Restano a tempo per sempre. Il motivo e\' scritto accanto all\'attesa con');
  out.push('`// ATTESA-LEGITTIMA:`, quindi lo legge chi passa di li\' — e questo elenco lo');
  out.push('raccoglie da solo invece di essere una lista da rileggere a mano.*');
  out.push('');
  out.push('| file | ms | asserzione protetta | perche\' resta |');
  out.push('|---|---|---|---|');
  legittime.slice().sort(function (a, b) {
    return a.file === b.file ? a.riga - b.riga : (a.file < b.file ? -1 : 1);
  }).forEach(function (v) {
    out.push('| `' + v.file + '` | ' + v.ms + ' | ' + v.asserzione.replace(/\|/g, '\\|') +
      ' | ' + (v.motivo || '⚠️ marcata senza motivo').replace(/\|/g, '\\|') + ' |');
  });
  out.push('');
  out.push('### Attese di navigazione, per file');
  out.push('');
  out.push('*Non sono guardie: se sono troppo corte il test si rompe aspettando —');
  out.push('fallisce, non passa per sbaglio. Contate per sapere quante sono.*');
  out.push('');
  out.push('| file | navigazione |');
  out.push('|---|---|');
  Object.keys(nav).sort().forEach(function (f) {
    if (nav[f]) out.push('| `' + f + '` | ' + nav[f] + ' |');
  });
  out.push('');
  out.push(FINE);
  return out.join('\n');
}

function main() {
  const censimento = censisci();
  const testo = blocco(censimento);
  if (process.argv.indexOf('--scrivi') === -1) {
    console.log(testo);
    return;
  }
  const doc = fs.readFileSync(DOCUMENTO, 'utf8');
  const i = doc.indexOf(INIZIO);
  const j = doc.indexOf(FINE);
  if (i === -1 || j === -1) {
    console.error('I marcatori non ci sono in ' + DOCUMENTO + '.');
    console.error('Vanno messi a mano una volta sola, attorno alla parte da generare:');
    console.error('  ' + INIZIO);
    console.error('  ' + FINE);
    process.exit(1);
  }
  fs.writeFileSync(DOCUMENTO, doc.slice(0, i) + testo + doc.slice(j + FINE.length), 'utf8');
  console.log('Riscritto ' + DOCUMENTO + ': ' + censimento.voci.length + ' guardie.');
}

main();
