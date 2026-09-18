// PROTEGGE: che l'ordine dei tag `<script>` in index.html resti un vincolo
// DICHIARATO invece che scoperto. Ogni file di `app/` dice in testa da chi
// dipende e a che titolo, e questo file confronta la dichiarazione col codice.
//
// COSA SI PERDE SENZA. `app/avvio.js` legge `BI.THEME_KEY`, che appartiene a
// `app/identita.js`, e funziona SOLO perche' identita e' caricato prima.
// Fino al 2026-09-18 quella dipendenza non era scritta da nessuna parte e non
// era verificata da niente: chi riordinasse i tag — o chi estraesse un decimo
// strato mettendolo in mezzo — romperebbe l'app senza che una sola riga di
// codice o di commento glielo avesse detto. **Il guasto non e' che la
// dipendenza esista: e' che si scopra soltanto rompendola.**
//
// COME, e perche' non nell'unico modo ovvio. La strada comoda era elencare qui
// le dipendenze note e verificare quelle. Sarebbe un elenco dentro un test:
// invecchia al primo strato nuovo, in silenzio, e continua a leggersi bene
// (e' la stessa forma delle regole 4 e 33 di CLAUDE.md, che elencavano due
// file su sei). Qui l'elenco non c'e': `tests/tools/dipendenze.js` MISURA il
// grafo dal codice e costruisce la riga che ogni file merita; il test
// confronta quella con quella scritta. Uno strato nuovo entra nel giro il
// giorno stesso.
//
// ⚠️ IL MOMENTO FA PARTE DELLA DICHIARAZIONE. Una dipendenza a tempo di
// PARSING obbliga l'ordine dei tag; una a tempo di CHIAMATA no. Verificare
// solo «da quale file» perderebbe esattamente la differenza per cui la
// dichiarazione esiste.
//
// LIMITE DICHIARATO: verifica la dipendenza fra FILE, non che l'ordine dei tag
// la rispetti. Oggi le due dipendenze vere sono all'indietro e non c'e' niente
// da far cadere; il giorno che ne nasce una in avanti a tempo di parsing,
// questo file lo DICE (riga [C]) ma non e' lui a impedirla.

const { repoPath } = require('./test-env');
const {
  ordineDiCaricamento, grafo, dichiarazione, dichiarazioneAttesa, nomiPosseduti
} = require('./tools/dipendenze');
const fs = require('fs');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const RADICE = repoPath('.');
const nodi = grafo(RADICE);

// ── [A] OGNI FILE DICHIARA, E LA DICHIARAZIONE E' VERA ──────────────
nodi.forEach(function (n) {
  const scritta = dichiarazione(RADICE, n.file);
  const attesa = dichiarazioneAttesa(n);
  log('[A] ' + n.file + ': ha la riga DIPENDE DA', scritta !== null, 'manca del tutto');
  log('[A] ' + n.file + ': ...e dice quello che il codice fa', scritta === attesa,
    'dichiarato "' + scritta + '", misurato "' + attesa + '"');
});

// ── [B] IL GRAFO E' QUELLO CHE CREDIAMO ─────────────────────────────
// Non un elenco: tre CONTI, che cambiano da soli quando cambia il codice e
// che dicono se la forma del progetto e' ancora quella.
{
  const conDipendenze = nodi.filter(function (n) { return Object.keys(n.dipende).length; });
  // ⚠️ DA 2 A 3 IL 2026-09-18, seguita e non tolta (⓪-undecies): l'invariante
  // non e' «due», e' «il grafo e' quello che credo». `app/ui-condivisa.js`
  // dipende da `dati.js` e `quiz-engine.js`, ed e' voluto — uno strato di
  // interfaccia che legge i testi DEVE chiedere a chi li carica.
  log('[B] Tre file di app/ dipendono da qualcosa',
    conDipendenze.length === 3, conDipendenze.map(function (n) { return n.file; }).join(', '));

  const allInsu = nodi.filter(function (n) { return n.dipende['index.html']; });
  // ⚠️ QUESTO CONTO DEVE CALARE, MAI SALIRE. Una dipendenza verso index.html e'
  // un file estratto che chiede qualcosa a chi non lo e' ancora: e' il verso
  // che la serie esiste per eliminare. Oggi e' uno solo — `app/dati.js`, che
  // chiede `BI.applyEpisodeDialogue` al catalogo, per scelta dichiarata.
  log('[B] Una sola dipendenza ALL\'INSU\' verso index.html',
    allInsu.length === 1 && allInsu[0].file === 'dati.js',
    allInsu.map(function (n) { return n.file; }).join(', '));

  const aParsing = nodi.filter(function (n) {
    return Object.keys(n.dipende).some(function (k) { return n.dipende[k].parsing.length; });
  });
  // Nessuna dipendenza a tempo di parsing = l'ordine dei tag oggi NON e' un
  // vincolo stretto. Il giorno che ne nasce una, questa riga cade e chi la
  // legge sa di doverci pensare.
  // ⚠️ E QUESTA E' LA RIGA CHE E' CAMBIATA DI PIU', perche' prima non poteva
  // cadere: la misura contava le graffe dal primo carattere del file, e ogni
  // file di `app/` e' avvolto in un'IIFE — quindi TUTTO risultava «a tempo di
  // chiamata» e «parsing» era una risposta che non usciva mai. **L'asserzione
  // era vera per costruzione** (regola 37: non somigliava a un errore,
  // somigliava a un risultato). Corretta il 2026-09-18, e il primo caso vero e'
  // uscito subito.
  //
  // Da oggi dice il NUMERO e il NOME, non l'assenza: una dipendenza a tempo di
  // parsing e' legittima — `ui-condivisa` prende quattro alias in cima
  // all'IIFE — ma **obbliga l'ordine dei tag**, e chi ne aggiunge una deve
  // sapere che [C] diventa la riga che lo tiene fermo.
  log('[B] Una sola dipendenza a tempo di PARSING, ed e\' ui-condivisa',
    aParsing.length === 1 && aParsing[0].file === 'ui-condivisa.js',
    aParsing.map(function (n) { return n.file; }).join(', '));
}

// ── [C] L'ORDINE DEI TAG RISPETTA IL GRAFO ──────────────────────────
{
  const ordine = ordineDiCaricamento(RADICE);
  const inAvanti = [];
  nodi.forEach(function (n) {
    Object.keys(n.dipende).forEach(function (k) {
      if (k === 'index.html') return;
      if (ordine.indexOf(k) > ordine.indexOf(n.file)) inAvanti.push(n.file + ' -> ' + k);
    });
  });
  log('[C] Nessun file dipende da uno caricato DOPO di lui',
    inAvanti.length === 0, inAvanti.join(' | '));
}

// ── [D] LA MISURA SA DISTINGUERE POSSEDERE DA ESPORRE ────────────────
// ⚠️ Non e' zelo: senza questa distinzione la misura accusava `app/spazio.js`
// di dipendere da index.html per SEI nomi che sono suoi — li assegna come
// valori (`BI.pulizie = []`) invece che col nome (`BI.x = x;`). Era la quarta
// volta che questa misura si sbagliava, e l'unica che produceva un'accusa
// invece di un buco.
{
  const spazio = fs.readFileSync(repoPath('app', 'spazio.js'), 'utf8');
  const posseduti = nomiPosseduti(spazio);
  log('[D] app/spazio.js risulta possedere i nomi del namespace',
    ['pulizie', 'moduli', 'registraPulizia', 'registraModulo'].every(function (n) {
      return posseduti.indexOf(n) !== -1;
    }), posseduti.join(', '));
  const nodoSpazio = nodi.find(function (n) { return n.file === 'spazio.js'; });
  log('[D] ...e quindi NON risulta dipendere da index.html per i propri nomi',
    !nodoSpazio.dipende['index.html'],
    JSON.stringify(nodoSpazio.dipende['index.html'] || {}));
}

console.log('');
console.log('=== DIPENDENZE DICHIARATE: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
