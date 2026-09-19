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
  // ⚠️ 3 -> 4 col primo modulo. I moduli dipendono per NATURA: usano
  // l'interfaccia condivisa e i progressi. Il numero sale con loro ed e'
  // previsto; quello che deve scendere e' l'ALTRO, quello verso index.html.
  // ⚠️ 4 -> 5 con app/mappa.js. Sale coi file, ed e' previsto.
  // ⚠️ 6 -> 7 con app/repeataloud.js, il PRIMO MODULO. Stessa ragione di
  // sempre: un modulo usa l'interfaccia condivisa, i progressi e i suoni. Non
  // e' questo il numero da guardare — e' quello sotto.
  // ⚠️ 7 -> 8 col SECONDO MODULO (`app/flashcard.js`). Sale coi moduli, ed
  // è previsto.
  log('[B] Otto file di app/ dipendono da qualcosa',
    conDipendenze.length === 8, conDipendenze.map(function (n) { return n.file; }).join(', '));

  const allInsu = nodi.filter(function (n) { return n.dipende['index.html']; });
  // ⚠️ QUESTO CONTO DEVE CALARE, MAI SALIRE. Una dipendenza verso index.html e'
  // un file estratto che chiede qualcosa a chi non lo e' ancora: e' il verso
  // che la serie esiste per eliminare. Oggi e' uno solo — `app/dati.js`, che
  // chiede `BI.applyEpisodeDialogue` al catalogo, per scelta dichiarata.
  // ⚠️ DA 1 A 2 CON IL PRIMO MODULO, e questa e' la riga che conta davvero.
  // Un numero che sale con una ragione scritta e' un progetto; senza, e' un
  // difetto. La ragione: un modulo non puo' non nominare l'episodio su cui
  // lavora, e il catalogo e' ancora in index.html. **Se al terzo modulo questo
  // numero e' salito di tre invece che restare due, il progetto si e' fermato.**
  // ⚠️ DA 2 A 3 CON app/mappa.js, ed e' il numero da tenere d'occhio. La
  // ragione: mappa chiede a index.html il CATALOGO (EPISODES,
  // MODULE_DESCRIPTORS, resolveEpisodeOrder) e i due dello stato di sessione.
  // **Tutti e tre spariscono insieme, quando esce il catalogo** — che e'
  // l'unica cosa grossa rimasta senza un nome nel piano.
  //
  // *Un numero che sale con una ragione scritta e' un progetto; senza, e' un
  // difetto. Se al terzo modulo e' salito ancora, la ragione non c'era.*
  // ⚠️ 3 -> 4 col secondo modulo, e la ragione e' la stessa di sempre: un
  // modulo nomina l'episodio su cui lavora. **Tutte e quattro spariscono
  // insieme, quando esce il catalogo.**
  // ⚠️ 4 -> 5 col PRIMO MODULO, `app/repeataloud.js`, e la ragione e' UNA
  // SOLA, scritta in testa a quel file: `itemText`, che lega lo stato di
  // sessione (`currentEpisode`, `currentValues`) e per questo non e' entrata
  // in `ui-condivisa` insieme a `fillTemplate`, che invece li riceve come
  // parametri.
  //
  // **UNO e' il numero da guardare quando uscira' il secondo modulo.** Se al
  // terzo e' ancora uno e ancora `itemText`, il passo dello stato di sessione
  // e' in ritardo e si vede qui. Se invece ne aggiunge altri, la ragione non
  // c'era. *Un numero che sale con una ragione scritta e' un progetto; senza,
  // e' un difetto.*
  // ⚠️ 5 -> 6 col SECONDO MODULO, e i NOMI sono due: `itemText` e
  // `recordPendingMastery`. **La ragione resta UNA: lo stato di sessione.**
  // Sono due dei quattro registrati in `docs/decisioni.md` come bloccati da
  // quello, e escono tutti insieme col suo passo. *Quello da guardare al
  // terzo modulo non è se il numero sale: è se compare una ragione DIVERSA.*
  log('[B] Sei dipendenze ALL\'INSU\'', allInsu.length === 6,
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
  // ⚠️ 1 -> 2: personalizza.js prende i suoi alias a tempo di parsing, ed e'
  // il motivo per cui il suo tag sta nella seconda fila DOPO ui-condivisa. La
  // riga [C] e' quella che tiene fermo l'ordine.
  // ⚠️ 4 -> 5 con `app/repeataloud.js`. Il primo modulo NON tocca nessun nodo
  // mentre viene letto — i suoi sette listener si agganciano dentro la sua
  // `open`, a tempo di chiamata — eppure sta nella seconda fila lo stesso,
  // per i suoi venti alias e per `BI.registraModulo`, che gira al primo
  // livello dell'IIFE. **Le ragioni della seconda fila sono due, non una**, e
  // questo file e' il primo che ci sta solo per la seconda.
  // ⚠️ 5 -> 6 col secondo modulo, per gli alias come tutti gli altri.
  log('[B] Sei dipendenze a tempo di PARSING',
    aParsing.length === 6,
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

// ── [E] NESSUN ALIAS SU UN NOME CHE VIENE DA index.html ─────────────
// ⚠️ NASCE DA UN GUASTO VERO, IL 2026-09-19, ED È LA RIGA CHE IMPEDISCE AI
// CINQUE MODULI CHE MANCANO DI RIFARLO.
//
// Lo script inline di `index.html` è **l'ULTIMO**: sta in fondo a <body>, dopo
// tutti i tag `<script src>`. Quindi un file di `app/` che scrive
// `var itemText = BI.itemText;` in cima alla propria IIFE congela
// **`undefined` per sempre** — il nome nascerà solo dopo.
//
// Successo con il primo modulo: `app/repeataloud.js` aliasava `itemText`, e il
// modulo si apriva con il corpo fermo su «Caricamento...». `TypeError:
// itemText is not a function`, **ingoiato dal `.catch` del caricamento** —
// quindi nessun errore in pagina, solo un modulo che non finisce mai. E
// `tests/tools/buchi.js` non poteva vederlo: guarda **se** un nome è
// definito o aliasato, non **quando** arriva.
//
// La regola: dagli STRATI si aliasa (i loro tag stanno prima); da `index.html`
// si chiama `BI.nome(...)` al momento dell'uso. È la stessa famiglia
// dell'alias su una variabile riassegnata — *un alias fotografa, e il
// problema è sempre QUANDO.*
{
  const daIndex = new Set();
  const testoIndex = fs.readFileSync(repoPath('index.html'), 'utf8');
  for (const m of testoIndex.matchAll(/^\s*BI\.(\w+)\s*=/gm)) daIndex.add(m[1]);
  const daStrati = new Set();
  for (const f of fs.readdirSync(repoPath('app'))) {
    if (!/\.js$/.test(f)) continue;
    for (const m of fs.readFileSync(repoPath('app', f), 'utf8').matchAll(/^\s*(?:window\.)?BI\.(\w+)\s*=/gm)) daStrati.add(m[1]);
  }
  const colpevoli = [];
  for (const f of fs.readdirSync(repoPath('app'))) {
    if (!/\.js$/.test(f)) continue;
    for (const m of fs.readFileSync(repoPath('app', f), 'utf8').matchAll(/^\s*var (\w+) = BI\.(\w+);/gm)) {
      if (daIndex.has(m[2]) && !daStrati.has(m[2])) colpevoli.push(f + ': ' + m[2]);
    }
  }
  log('[E] Nessun file di app/ aliasa un nome che viene da index.html',
    colpevoli.length === 0,
    colpevoli.join(', ') + ' — index.html e\' l\'ULTIMO script: l\'alias congela undefined. Si chiama BI.nome(...) al momento dell\'uso.');
}

console.log('');
console.log('=== DIPENDENZE DICHIARATE: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
