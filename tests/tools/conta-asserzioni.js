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
