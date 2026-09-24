// PROTEGGE: che un verde continui a provare quello che provava ieri.
//
// La suite dice "tutto verde" guardando il codice di uscita di ogni file. Ma un
// file che ne esegue DIECI ANZICHE' QUARANTA esce comunque con zero, e il verde
// e' pieno: un ciclo che si esaurisce prima, un selettore rinominato male in un
// punto dove il risultato viene ignorato, un blocco saltato da una condizione
// che non e' piu' vera. Nessuna di queste cose fallisce — semplicemente
// smettono di provare, e il verde resta identico a prima.
//
// Il caso non e' teorico, ed e' arrivato prima di questo strumento: il
// 2026-09-08 test_batch19 e' caduto eseguendo 39 asserzioni invece di 40,
// perche' la quarantesima vive dentro un ramo `if (gotCorrect)` che, quando il
// ciclo si esaurisce, non gira. Li' due asserzioni fallivano e quindi si
// vedeva. Se il ciclo si fosse esaurito senza far fallire niente, sarebbe stato
// un verde con un'asserzione in meno e nessuno se ne sarebbe accorto.
//
// Serve soprattutto alle RINOMINE: 346 occorrenze dei nomi vecchi stanno dentro
// tests/, e una rinomina non aggiunge ne' toglie comportamenti — se dopo il
// conteggio cala, qualcosa ha smesso di girare.
//
// COME, e perche' non con un totale solo. Il baseline e' PER FILE, non un
// numero unico: un totale dice "cinque asserzioni sparite" e lascia cercare in
// quarantuno file. Per file dice quale. Costa tre righe in piu' e cambia
// completamente cosa si puo' fare con il risultato.
//
// Si contano le asserzioni ESEGUITE, non quelle passate: le righe che
// cominciano con OK, PASS o FAIL. Contare solo i verdi confonderebbe "questa
// asserzione e' fallita" con "questa asserzione non e' partita", che sono
// esattamente le due cose che questo strumento esiste per distinguere.
//
// LIMITE DICHIARATO: conta le RIGHE che i test stampano, quindi vede solo le
// asserzioni che passano dalla funzione di log del file. Un `if` senza log —
// un controllo che alza un'eccezione e basta — non e' contato. Vale per tutti
// i file di oggi, che loggano ogni asserzione; un file futuro scritto in un
// altro modo sfuggirebbe, e allora questo limite va rimisurato.

'use strict';
const fs = require('fs');
const path = require('path');

const CARTELLA_TEST = path.resolve(__dirname, '..');
const BASELINE = process.env.BASELINE_ASSERZIONI ||
  path.join(CARTELLA_TEST, 'BASELINE-ASSERZIONI.txt');

// Una riga e' un'asserzione se comincia (a meno di spazi) con OK, PASS o FAIL
// come parola intera. Il confine di parola tiene fuori "FAILURES:" e le righe
// di dettaglio che seguono, che non sono asserzioni ma il loro riepilogo.
const RIGA_ASSERZIONE = /^\s*(OK|PASS|FAIL)\b/;

function contaFile(nomeJs) {
  const risultato = path.join(CARTELLA_TEST, nomeJs.replace(/\.js$/, '.result.txt'));
  if (!fs.existsSync(risultato)) {
    // Un file di risultato mancante non e' zero asserzioni: e' un file che non
    // e' stato eseguito. Dirlo, invece di contarlo come un calo di tutte le sue.
    return null;
  }
  const testo = fs.readFileSync(risultato, 'utf8');
  return testo.split('\n').filter((r) => RIGA_ASSERZIONE.test(r)).length;
}

function leggiBaseline() {
  if (!fs.existsSync(BASELINE)) return null;
  const atteso = {};
  fs.readFileSync(BASELINE, 'utf8').split('\n').forEach((riga) => {
    const m = riga.match(/^([A-Za-z0-9_.-]+\.js)\s+(\d+)$/);
    if (m) atteso[m[1]] = Number(m[2]);
  });
  return Object.keys(atteso).length ? atteso : null;
}

// ⚠️ QUELLO CHE SCRIVI QUI DENTRO SOPRAVVIVE; QUELLO CHE SCRIVI NEL BASELINE NO.
//
// Questa funzione RIGENERA l'intestazione di BASELINE-ASSERZIONI.txt da zero a
// ogni `--scrivi`. Una riga aggiunta a mano in quel file sparisce al primo
// aggiornamento del baseline, **senza un errore e senza un diff che qualcuno
// guardi** — il diff di un baseline si legge per i numeri, non per i commenti.
//
// E' successo il 2026-09-17, al primo `--scrivi` dopo: il fatto qui sotto era
// stato scritto il giorno prima direttamente nel baseline, «una volta sola, nel
// file di cui parla». Quel file e' prodotto da una macchina: il posto giusto
// per una cosa che deve durare e' il MODELLO, non il prodotto.
//
// *E' la ⓪-quinquies nella forma piu' pulita — una frase resa falsa non da chi
// la tocca ma dal mondo intorno — con l'aggravante che il mondo che l'ha
// cancellata e' esattamente il meccanismo di cui la frase parlava.*
function scriviBaseline(conteggi, totale) {
  const oggi = new Date().toISOString().slice(0, 10);
  const intestazione = [
    '# Quante asserzioni esegue ogni file della suite.',
    '#',
    '# Non e\' una statistica: e\' la difesa contro un verde che prova meno di',
    '# ieri. Il numero puo\' SALIRE (un test nuovo) e non deve CALARE. Quando',
    '# sale di proposito si riscrive questo file con:',
    '#',
    '#   node tests/tools/conta-asserzioni.js --scrivi <elenco dei file>',
    '#',
    '# Lo scrive tests/tools/conta-asserzioni.js leggendo i .result.txt',
    '# dell\'ultima corsa, quindi va rigenerato solo dopo una corsa completa.',
    '#',
    '# ⚠️ QUESTA INTESTAZIONE E\' RIGENERATA DA ZERO A OGNI --scrivi: una riga',
    '# aggiunta qui a mano sparisce al prossimo aggiornamento, senza errore.',
    '# Se deve durare, va scritta in tests/tools/conta-asserzioni.js.',
    '#',
    '# ##########################################################################',
    '# UN FATTO DA SAPERE, E VALE SEMPRE:',
    '#',
    '#   L\'ULTIMO COMMIT DI OGNI GIRO CHE AGGIORNA QUESTO FILE E\' COPERTO',
    '#   DALLA CI, NON DALLA SUITE LOCALE.',
    '#',
    '# E\' strutturale, non una svista, e non si puo\' correggere: questo file',
    '# lo produce la corsa, quindi l\'ordine e\' per forza',
    '#',
    '#     corsa -> aggiornamento di questo file -> push',
    '#',
    '# e l\'albero su cui la suite ha girato non contiene ancora la riga nuova.',
    '# La differenza e\' un file di soli dati, letto dal contatore e da nessun',
    '# test, quindi il rischio e\' minimo — ma «ho lanciato la suite e ho',
    '# spinto» resta una frase vera e incompleta, ed e\' la CI di quel commit',
    '# a chiudere il buco.',
    '#',
    '# *Scritto qui e non nei resoconti: un fatto ripetuto a ogni giro diventa',
    '# rumore e smette di essere letto. Qui lo trova chi aggiorna il file, che',
    '# e\' l\'unica persona a cui serve.*',
    '# ##########################################################################',
    '#',
    '# Ultimo aggiornamento: ' + oggi,
    '# Totale: ' + totale,
    ''
  ].join('\n');
  const righe = Object.keys(conteggi).sort()
    .map((f) => f + ' ' + conteggi[f]).join('\n');
  fs.writeFileSync(BASELINE, intestazione + righe + '\n');
}

function main(argv) {
  const scrivi = argv.includes('--scrivi');
  const files = argv.filter((a) => a !== '--scrivi');
  if (!files.length) {
    console.error('uso: conta-asserzioni.js [--scrivi] <file di test...>');
    return 2;
  }

  const conteggi = {};
  const mancanti = [];
  files.forEach((f) => {
    const n = contaFile(f);
    if (n === null) mancanti.push(f); else conteggi[f] = n;
  });
  const totale = Object.keys(conteggi).reduce((s, f) => s + conteggi[f], 0);

  if (scrivi) {
    // ⚠️ SI RIFIUTA SE ANCHE UN SOLO FILE NON HA IL SUO RISULTATO — 2026-09-24.
    //
    // Qui `mancanti` veniva IGNORATO: i file senza `.result.txt` sparivano dal
    // conteggio e il baseline si riscriveva con quelli rimasti. Il ramo di
    // lettura, dieci righe piu' sotto, li nomina da sempre («SENZA RISULTATO»);
    // il ramo di scrittura no.
    //
    // ⚠️ E il caso peggiore NON e' il baseline a meta': e' il baseline VUOTO.
    // Lanciando il comando dalla radice invece che da `tests/` — i percorsi si
    // compongono da dentro `tests/`, quindi `tests/test_x.js` diventa
    // `tests/tests/test_x.result.txt` — NESSUN file viene trovato, e lo
    // strumento scriveva «0 asserzioni in 0 file» **stampando un successo**.
    // Succeso il 2026-09-24: 79 righe cancellate, ripristinate da git.
    //
    // *E' la forma della regola 37 dentro lo strumento che quella regola
    // difende: la guardia contro «un verde che prova meno di ieri» si lasciava
    // azzerare senza dire niente. Un baseline vuoto non fallisce mai — accetta
    // qualunque numero futuro, compreso zero.*
    //
    // Rifiutare e' l'unica risposta giusta: un baseline si riscrive **dopo una
    // corsa completa**, e se un risultato manca quella corsa completa non c'e'
    // stata. Il numero che verrebbe scritto sarebbe piu' basso del vero, cioe'
    // un tetto abbassato in silenzio.
    if (mancanti.length) {
      console.error('NON SCRIVO IL BASELINE: ' + mancanti.length + ' file su ' +
        files.length + ' non hanno il loro .result.txt.');
      console.error('Senza: ' + mancanti.slice(0, 5).join(', ') +
        (mancanti.length > 5 ? ', … (+' + (mancanti.length - 5) + ')' : ''));
      console.error('');
      console.error('Un baseline scritto da una corsa parziale abbassa il tetto');
      console.error('in silenzio, ed e\' esattamente cio\' contro cui esiste.');
      console.error('');
      console.error('Il caso piu\' comune: il comando va lanciato DA tests/, con i');
      console.error('nomi nudi — `cd tests && node tools/conta-asserzioni.js --scrivi test_*.js`');
      return 2;
    }
    scriviBaseline(conteggi, totale);
    console.log('Baseline scritto: ' + totale + ' asserzioni in ' +
      Object.keys(conteggi).length + ' file -> ' + BASELINE);
    return 0;
  }

  console.log('Asserzioni eseguite: ' + totale + ' in ' + Object.keys(conteggi).length + ' file');

  if (mancanti.length) {
    console.log('SENZA RISULTATO (non eseguiti): ' + mancanti.join(', '));
  }

  const atteso = leggiBaseline();
  if (!atteso) {
    console.log('Nessun baseline registrato (' + BASELINE + ').');
    console.log('Per registrarlo, dopo una corsa completa e verde:');
    console.log('  node tests/tools/conta-asserzioni.js --scrivi $FILES');
    return 0;
  }

  const totaleAtteso = Object.keys(atteso).reduce((s, f) => s + atteso[f], 0);
  const calati = Object.keys(conteggi)
    .filter((f) => atteso[f] !== undefined && conteggi[f] < atteso[f])
    .map((f) => '  ' + f + ': ' + conteggi[f] + ' invece di ' + atteso[f] +
      ' (' + (conteggi[f] - atteso[f]) + ')');
  const persi = Object.keys(atteso).filter((f) => conteggi[f] === undefined && mancanti.indexOf(f) === -1);

  if (calati.length || persi.length) {
    console.log('');
    console.log('=== ASSERZIONI IN CALO: ' + totale + ' contro ' + totaleAtteso + ' del baseline ===');
    if (calati.length) { console.log('File che ne eseguono meno di prima:'); calati.forEach((r) => console.log(r)); }
    if (persi.length) console.log('File spariti dall\'elenco: ' + persi.join(', '));
    console.log('');
    console.log('Un calo NON e\' un test che fallisce: e\' un test che non e\' partito.');
    console.log('Se e\' voluto (un file tolto di proposito), si riscrive il baseline con --scrivi.');
    return 1;
  }

  if (totale > totaleAtteso) {
    console.log('=== ASSERZIONI IN AUMENTO: ' + totale + ' contro ' + totaleAtteso +
      ' del baseline (+' + (totale - totaleAtteso) + ') ===');
    console.log('Va bene: un test nuovo fa salire il conto. Aggiorna il baseline con --scrivi.');
    return 0;
  }

  console.log('=== ASSERZIONI OK: ' + totale + ', come il baseline ===');
  return 0;
}

process.exit(main(process.argv.slice(2)));
