// PROTEGGE: che `docs/metodo/FATTI-APP.md` dica il vero sul codice. Ogni cosa
// scritta fra apici inversi nella colonna «Dove sta nel codice» dev'esserci
// davvero: un percorso dev'essere un file che esiste, ogni altro pezzo dev'essere
// scritto ALLA LETTERA in uno dei file citati nella stessa cella.
//
// COSA SI PERDE SENZA QUESTO FILE. Quel file lo leggono i testi di chi guida il
// progetto: dice su quali fatti del codice i loro testi si appoggiano. Il giorno
// in cui e' entrato nel repository (2026-09-30), **sei righe su undici non
// corrispondevano piu' al codice**, tre giorni dopo essere state scritte — quasi
// tutte per un numero di riga. Senza un test, la regola «nella colonna Dove si
// scrivono nomi, non numeri» dipende da chi se la ricorda, e un nome rinominato
// rende falsa una riga in silenzio (regola 49: un controllo che non puo'
// controllare deve fallire).
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): una cella che cita un file di DATI o un
// markdown invece di codice (`docs/...`, `nuovi/...`). Il test non distingue:
// un percorso e' un percorso, e il pezzo deve esserci dentro.
//
// COSA NON PROTEGGE, dichiarato (regola 32): che il FATTO sia vero. Il test
// sa che `role === 'family'` e' scritto in `app/ui-condivisa.js`; non sa che
// quella riga mette la bolla a destra. Protegge l'ancoraggio, non la frase.

const fs = require('fs');
const path = require('path');

const RADICE = path.join(__dirname, '..');
const FILE = path.join(RADICE, 'docs', 'metodo', 'FATTI-APP.md');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Regola 49: un file che non c'e' non e' «niente da controllare».
const esiste = fs.existsSync(FILE);
log('[A] docs/metodo/FATTI-APP.md esiste', esiste);
const testo = esiste ? fs.readFileSync(FILE, 'utf8') : '';

// Le righe della tabella dei fatti: cominciano con «| `APP_».
const righe = testo.split('\n').filter(function (r) { return /^\|\s*`APP_/.test(r); });
log('[A] La tabella ha delle righe (il test non sta guardando il vuoto)', righe.length > 0, 'trovate: ' + righe.length);

// Un pezzo fra apici inversi e' un percorso se ha una barra e finisce con
// un'estensione. Il resto e' testo da trovare alla lettera.
const ePercorso = function (p) { return /\//.test(p) && /\.[a-z]+$/.test(p) && !/\s/.test(p); };

righe.forEach(function (riga) {
  const celle = riga.split('|').slice(1, -1).map(function (c) { return c.trim(); });
  const id = celle[0].replace(/`/g, '');
  const dove = celle[2] || '';
  const pezzi = (dove.match(/`[^`]+`/g) || []).map(function (p) { return p.slice(1, -1); });
  const percorsi = pezzi.filter(ePercorso);
  const altri = pezzi.filter(function (p) { return !ePercorso(p); });

  log('[B] ' + id + ': la colonna «Dove» cita almeno un file', percorsi.length > 0, dove);
  const mancanti = percorsi.filter(function (p) { return !fs.existsSync(path.join(RADICE, p)); });
  log('[B] ' + id + ': ogni file citato esiste', mancanti.length === 0, mancanti.join(', '));

  const contenuti = percorsi.filter(function (p) { return fs.existsSync(path.join(RADICE, p)); })
    .map(function (p) { return fs.readFileSync(path.join(RADICE, p), 'utf8'); });
  const assenti = altri.filter(function (a) {
    return !contenuti.some(function (c) { return c.indexOf(a) !== -1; });
  });
  log('[B] ' + id + ': ogni nome citato e\' scritto alla lettera in uno di quei file',
    assenti.length === 0, assenti.join(' · '));

  // Condizione a: niente numeri di riga nella colonna «Dove».
  log('[B] ' + id + ': la colonna «Dove» non porta numeri di riga', !/\.[a-z]+:\d/.test(dove), dove);
});

console.log('\n=== FATTI-APP SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
