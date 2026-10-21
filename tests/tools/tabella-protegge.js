// PROTEGGE: che la tabella «Cosa protegge ogni file» di `tests/README.md` dica la stessa cosa delle testate `// PROTEGGE:` dei file — perché la scrive questo strumento, leggendole, e nessuno la ricopia a mano.
//
// Nato il 2026-10-21, deciso da chi guida il progetto. La regola 32 diceva
// «lo stesso testo va nella tabella», cioè prescriveva una COPIA A MANO in
// due posti — una regola contro la regola 48. Misurato quel giorno: dei 69
// file che avevano sia la testata sia la riga, **zero** le avevano uguali, e
// 16 dicevano cose diverse. *La copia non si era disallineata per sbaglio:
// era l'unica cosa che una copia a mano sa fare.*
//
// LA FONTE E' LA TESTATA: sta accanto al codice, viaggia col file, e nasce
// insieme al test. Una riga di README e' un passo separato che si dimentica.
//
// LA FORMA che questo strumento legge, ed e' l'unica:
//   - la PRIMA riga del file comincia con `// PROTEGGE: ` (o con
//     `// PROTEGGE (da confermare): ` quando chi l'ha scritta ha dovuto
//     indovinare l'intenzione — e allora la tabella lo dice);
//   - il paragrafo continua sulle righe `// ...` successive, fino alla prima
//     riga di commento vuota (`//`). Quello e' il «cosa protegge»; il resto
//     della testata — il COME, i LIMITI, la storia — resta nel file e non va
//     in tabella. *La tabella risponde a una domanda sola: «cosa si
//     romperebbe se questo file sparisse?».*
//
// QUALI FILE: ogni `tests/test_*.js`, **obbligatorio** — un file di test
// senza testata ferma lo strumento (regola 49: un controllo che non puo'
// controllare fallisce). Gli altri `tests/*.js` (gli aiutanti) entrano solo
// se la testata ce l'hanno. `tests/tools/` no: ha il suo README, con un'altra
// domanda.
//
// USO:
//   node tests/tools/tabella-protegge.js           controlla: esce 1 se la
//                                                  tabella non e' quella generata
//   node tests/tools/tabella-protegge.js --scrivi  riscrive la tabella
//
// Lo legge anche `tests/test_tabella_protegge.js`, che lo mette nella suite.

'use strict';

const fs = require('fs');
const path = require('path');

const RADICE_TEST = path.join(__dirname, '..');
const README = path.join(RADICE_TEST, 'README.md');
const INIZIO = '<!-- TABELLA GENERATA da tests/tools/tabella-protegge.js: NON SI MODIFICA A MANO -->';
const FINE = '<!-- FINE DELLA TABELLA GENERATA -->';
const PRIMA_RIGA = '| ⚠️ **TABELLA GENERATA** | **Non si modifica a mano.** La fonte è la testata `// PROTEGGE:` di ogni file; si rigenera con `node tests/tools/tabella-protegge.js --scrivi`, e `tests/test_tabella_protegge.js` diventa rosso se le due divergono. *Una correzione scritta qui sparirebbe alla prossima rigenerazione: va scritta nella testata.* |';
const TESTA = /^\/\/ PROTEGGE( \(da confermare\))?: (.*)$/;

// Il paragrafo «cosa protegge» di un file, o null se la prima riga non e'
// una testata.
function testata(testo) {
  const righe = testo.split('\n');
  const m = righe[0].match(TESTA);
  if (!m) return null;
  const pezzi = [m[2].trim()];
  for (let i = 1; i < righe.length; i++) {
    const r = righe[i];
    if (!/^\/\//.test(r) || /^\/\/\s*$/.test(r)) break;
    pezzi.push(r.replace(/^\/\/ ?/, '').trim());
  }
  return { daConfermare: !!m[1], testo: pezzi.join(' ').replace(/\s+/g, ' ').trim() };
}

// Tutte le testate, e i file di test che non ce l'hanno.
function leggiTestate(radice) {
  const base = radice || RADICE_TEST;
  const voci = [];
  const senza = [];
  fs.readdirSync(base).filter((f) => /\.js$/.test(f)).sort().forEach((f) => {
    const t = testata(fs.readFileSync(path.join(base, f), 'utf8'));
    if (t) voci.push(Object.assign({ file: f }, t));
    else if (/^test_.*\.js$/.test(f)) senza.push(f);
  });
  return { voci, senza };
}

// Il `|` dentro una cella chiuderebbe la colonna.
function cella(testo) {
  return testo.replace(/\\\|/g, '|').replace(/\|/g, '\\|');
}

function generaTabella(voci) {
  return [INIZIO, '', '| File | Cosa si romperebbe senza |', '|---|---|', PRIMA_RIGA]
    .concat(voci.map((v) => '| `' + v.file + '` | ' +
      (v.daConfermare ? '⚠️ **DA CONFERMARE** — ' : '') + cella(v.testo) + ' |'))
    .concat(['', FINE])
    .join('\n');
}

// La tabella che sta oggi nel README, fra i due segni. null se i segni
// mancano o non sono una coppia sola.
function tabellaNelReadme(testo) {
  const a = testo.indexOf(INIZIO);
  const b = testo.indexOf(FINE);
  if (a === -1 || b === -1 || b < a) return null;
  if (testo.indexOf(INIZIO, a + 1) !== -1 || testo.indexOf(FINE, b + 1) !== -1) return null;
  return { prima: testo.slice(0, a), tabella: testo.slice(a, b + FINE.length), dopo: testo.slice(b + FINE.length) };
}

function main() {
  const scrivi = process.argv.indexOf('--scrivi') !== -1;
  const { voci, senza } = leggiTestate();
  if (senza.length) {
    console.error('FERMO — ' + senza.length + ' file di test senza `// PROTEGGE:` in prima riga: ' + senza.join(', '));
    process.exit(1);
  }
  const readme = fs.readFileSync(README, 'utf8');
  const pezzi = tabellaNelReadme(readme);
  if (!pezzi) {
    console.error('FERMO — in tests/README.md manca la coppia di segni della tabella generata (o ce n\'e\' piu\' d\'una):\n  ' + INIZIO + '\n  ' + FINE);
    process.exit(1);
  }
  const nuova = generaTabella(voci);
  if (pezzi.tabella === nuova) {
    console.log('OK — la tabella e\' quella generata: ' + voci.length + ' file.');
    return;
  }
  if (scrivi) {
    fs.writeFileSync(README, pezzi.prima + nuova + pezzi.dopo);
    console.log('SCRITTA — ' + voci.length + ' file.');
    return;
  }
  const vecchie = new Set(pezzi.tabella.split('\n'));
  const diverse = nuova.split('\n').filter((r) => !vecchie.has(r)).map((r) => (r.match(/^\| `([^`]+)`/) || [null, r.slice(0, 60)])[1]);
  console.error('DIVERSA — la tabella del README non e\' quella generata. Righe che cambierebbero: ' + diverse.join(', ') +
    '\nSi corregge la testata del file, poi: node tests/tools/tabella-protegge.js --scrivi');
  process.exit(1);
}

if (require.main === module) main();

module.exports = { testata, leggiTestate, generaTabella, tabellaNelReadme, INIZIO, FINE, PRIMA_RIGA };
