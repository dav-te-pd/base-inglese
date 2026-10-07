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
//
// ⚠️ [C] — I NUMERI CHE DIPENDONO DAL CODICE SI LEGGONO DAL CODICE (dal
// 2026-10-07). Il limite qui sopra era dichiarato, e il 07/10 e' scattato:
// `APP_colonne-per-posizione` diceva «C 4 · B 5 · A 5» da quando `non con` li
// aveva portati a 5 · 6 · 6, e questo file dava 70 su 70 — i numeri stavano
// nella frase, non fra apici. *Un limite dichiarato dice dove non guardi; non
// ti impedisce di fidarti* (regola 42). Quindi per le tre righe che portano un
// numero del codice, il numero si prende dal codice — la lunghezza di
// `INTESTAZIONI_GRADI` e di `INTESTAZIONI_TABELLE` (dal 2026-10-08; il 07/10
// erano `COLONNE_GRADI` e `COLONNE_TABELLE`), esportate da
// `tests/tools/trascrivi.js`, e `distrattori` da
// `app/config.js` — e la frase deve contenerlo. Una riga o una forma non
// trovata e' ROSSO, non «niente da confrontare» (regola 49).
// E la versione del file non puo' essere piu' vecchia della sua riga misurata
// piu' di recente (regola 27: il 07/10 era ferma a 20260930c).
//
// LIMITE di [C]: copre i numeri che QUESTO file sa ricondurre a una sorgente.
// Un numero nuovo scritto in una frase senza una riga qui resta scoperto come
// prima — e un numero nel codice che nessuna frase nomina non serve a nessuno.
// E il confronto delle date tiene l'anno della versione per tutte le righe: a
// cavallo di capodanno (versione di gennaio, riga del 30/12) darebbe un rosso
// falso. Si vede subito e si corregge allora; non e' un verde falso.

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

// ── [C] I numeri che dipendono dal codice, letti dal codice ──
const T = require('./tools/trascrivi.js');
const { configApp } = require('./test-env');
const riga = function (id) {
  return righe.find(function (r) { return r.indexOf('`' + id + '`') !== -1; }) || null;
};
const conNumero = function (id, atteso, perche) {
  const r = riga(id);
  log('[C] ' + id + ': la riga c\'e\'', !!r);
  if (r) log('[C] ' + id + ': porta «' + atteso + '» — ' + perche, r.indexOf(atteso) !== -1, atteso);
};
// Il conto e' la LUNGHEZZA delle intestazioni attese: non c'e' un numero da
// leggere, c'e' una lista da contare (regola 48).
const IG = T.INTESTAZIONI_GRADI || {};
const G = {};
['D', 'C', 'B', 'A'].forEach(function (g) { G[g] = Array.isArray(IG[g]) ? IG[g].length : undefined; });
log('[C] trascrivi.js esporta INTESTAZIONI_GRADI coi quattro gradi',
  ['D', 'C', 'B', 'A'].every(function (g) { return typeof G[g] === 'number'; }), JSON.stringify(G));
conNumero('APP_colonne-per-posizione', 'D ' + G.D + ' · C ' + G.C + ' · B ' + G.B + ' · A ' + G.A,
  'la lunghezza di INTESTAZIONI_GRADI');
const IT = Array.isArray(T.INTESTAZIONI_TABELLE) ? T.INTESTAZIONI_TABELLE : [];
log('[C] trascrivi.js esporta INTESTAZIONI_TABELLE', IT.length > 0, JSON.stringify(IT));
conNumero('APP_ramo-sul-numero-colonne', IT.map(function (a) { return a.length; }).join(' o '),
  'la lunghezza di INTESTAZIONI_TABELLE');
const sm = configApp().sceltaMultipla;
log('[C] app/config.js ha sceltaMultipla.distrattori', !!sm && typeof sm.distrattori === 'number');
conNumero('APP_bacino-distrattori', 'oggi ' + (sm ? sm.distrattori + 1 : '?'), 'distrattori + 1 da app/config.js');

// La versione non e' piu' vecchia della riga misurata per ultima.
const versione = (testo.match(/\*\*Versione: (\d{4})(\d{2})(\d{2})[a-z]\*\*/) || []);
log('[C] Il file dichiara una versione AAAAMMGG+lettera', versione.length === 4, versione[0] || '(nessuna)');
const date = righe.map(function (r) {
  const m = r.match(/\|\s*(\d{2})\/(\d{2})\s*\|\s*$/);
  return m ? m[2] + m[1] : null;
});
log('[C] Ogni riga ha la data di misura nell\'ultima colonna (gg/mm)', date.every(Boolean),
  righe.filter(function (r, i) { return !date[i]; }).map(function (r) { return r.slice(0, 40); }).join(' · '));
if (versione.length === 4 && date.every(Boolean)) {
  const ultima = date.slice().sort().pop();
  log('[C] La versione (' + versione[3] + '/' + versione[2] + ') non e\' piu\' vecchia della riga misurata piu\' di recente (' +
    ultima.slice(2) + '/' + ultima.slice(0, 2) + ')', versione[2] + versione[3] >= ultima);
}

console.log('\n=== FATTI-APP SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
