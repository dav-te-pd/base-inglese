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
  // ⚠️ 8 -> 9 col TERZO MODULO (`app/match.js`).
  // ⚠️ 9 -> 10 col QUARTO MODULO (`app/speedmatch.js`).
  // ⚠️ 10 -> 11 col QUINTO (`app/voice.js`). Ne resta uno.
  // ⚠️ 11 -> 12 col SESTO E ULTIMO (`app/dialogo.js`). I sei moduli sono
  // fuori, e questo numero ha finito di salire per questa ragione.
  // ⚠️ 12 -> 13 col PASSO B: `app/sessione.js` e' un file nuovo, e dipende
  // come tutti.
  // ⚠️ 13 -> 14 col PASSO C1: `app/catalogo.js`, che dipende da uno solo
  // (`episodeDataFile` di dati.js) — ed e' il motivo per cui era separabile.
  log('[B] Quattordici file di app/ dipendono da qualcosa',
    conDipendenze.length === 14, conDipendenze.map(function (n) { return n.file; }).join(', '));

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
  // ⚠️ 6 -> 7 col TERZO MODULO, e i suoi nomi sono TRE: `itemText`,
  // `recordMultipleChoiceResult`, `buildMultipleChoiceOptions`. **Sono gli
  // STESSI quattro di sempre**, quelli bloccati dallo stato di sessione: uno
  // al primo modulo, due al secondo, tre al terzo — *il numero sale perché
  // ogni modulo ne tocca una fetta diversa, non perché nasca una ragione
  // nuova.* **Era questa la domanda del terzo modulo, e la risposta è: nessuna
  // ragione diversa.** Spariscono tutti insieme col loro passo.
  // ⚠️ 7 -> 8 col QUARTO MODULO, e i suoi nomi sono gli STESSI TRE del terzo:
  // `itemText`, `recordMultipleChoiceResult`, `buildMultipleChoiceOptions`.
  // **Il numero dei NOMI ha smesso di salire, e dice la stessa cosa che
  // diceva salendo:** Speed Match e Match Practice sono lo stesso meccanismo
  // a scelta multipla con un timer in mezzo, quindi toccano la stessa fetta
  // dei quattro bloccati dallo stato di sessione. Nessuna ragione diversa,
  // per il secondo passo di fila.
  // ⚠️ 8 -> 9 col QUINTO MODULO, e il suo nome e' UNO SOLO:
  // `recordPendingMastery` — lo stesso che chiedeva Flash Card, cioe' ancora
  // uno dei quattro bloccati dallo stato di sessione. **E i due riferimenti
  // che Voice fa allo stato di sessione non contano qui, perche' non sono
  // nomi**: `currentEpisode` e `currentValues` si chiedono con
  // `BI.episodioCorrente()` e `BI.valoriCorrenti()`, gli accessori che
  // `app/mappa.js` usa gia'. *Sono funzioni, non alias: un alias
  // fotograferebbe il valore di adesso, una funzione legge quello di quando
  // la chiami.* Cinque moduli, nessuna ragione diversa dalla prima.
  // ⚠️ 9 -> 10 col SESTO E ULTIMO, e i suoi nomi sono DUE, tutti e due
  // accessori: `episodioCorrente` e `valoriCorrenti`. **Nessuno dei quattro
  // bloccati dallo stato di sessione serve al Dialogo** — non fa quiz a scelta
  // multipla e non scrive mastery.
  //
  // ⚠️ E QUESTO E' IL NUMERO DA GUARDARE ADESSO, perche' da qui in poi puo'
  // solo SCENDERE: i sei moduli sono fuori, non ne arrivano altri, e l'unica
  // cosa che muove ancora questa riga e' il passo che libera lo stato di
  // sessione. *Un conto che saliva con una ragione scritta ha finito di
  // salire; se risale, la ragione non c'era.*
  // ⚠️⚠️ **10 -> 3 COL PASSO B, ED E' IL NUMERO PER CUI QUESTA SERIE ESISTE.**
  //
  // Lo stato di sessione e i quattro pezzi che lo legavano sono usciti in
  // `app/sessione.js`: **`itemText`, `recordPendingMastery`,
  // `recordMultipleChoiceResult` e `buildMultipleChoiceOptions` non sono piu'
  // nomi di `index.html`**, e i sei moduli hanno smesso di chiedere all'insu'.
  //
  // ⚠️ E LA MISURA HA CORRETTO LA PREVISIONE: avevo dichiarato **10 -> 1**.
  // Sono tre, e i nomi che restano lo dicono da soli: `EPISODES`,
  // `ID_PERSONALIZZA`, `ensureEpisodeSlotFields`,
  // `migrateCustomizeSeenToModuleProgress` — **sono CATALOGO, non stato di
  // sessione**, e escono col passo C. Il quarto e' `applyEpisodeDialogue`, la
  // scelta dichiarata di `dati.js`. *Avevo contato solo quello e dimenticato
  // gli altri: la previsione era ottimista di due file.*
  //
  // ⚠️ COL PASSO C1 IL NUMERO DEI FILE RESTA 3, MA I NOMI SCENDONO DA 5 A 3:
  // `EPISODES` e `ID_PERSONALIZZA` sono usciti in `app/catalogo.js`. Restano
  // `applyEpisodeDialogue` (la scelta dichiarata di `dati.js`),
  // `migrateCustomizeSeenToModuleProgress` e `ensureEpisodeSlotFields` — che
  // non sono catalogo: sono **migrazione e personalizzazione**, due pezzi
  // piccoli rimasti indietro, registrati e non portati per non allargare il
  // passo. *Il conto dei FILE non si muove finche' non esce l'ultimo nome di
  // ognuno: e' un conto per file, non per nome, ed e' un limite suo.*
  log('[B] Tre dipendenze ALL\'INSU\'', allInsu.length === 3,
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
  // ⚠️ 6 -> 7 col terzo modulo, per gli alias come tutti.
  // ⚠️ 7 -> 8 col quarto modulo, per gli alias come tutti.
  // ⚠️ 8 -> 9 col quinto. Voice ha una ragione IN PIU' di tutti gli altri per
  // stare nella seconda fila, e non e' un alias: `vcRecognition` — l'oggetto
  // del riconoscimento vocale — nasce a tempo di parsing, dentro questo file.
  // **E' l'unico modulo che non porta via solo del codice: porta via un
  // apparato.**
  // ⚠️ 9 -> 10 col sesto, per gli alias come tutti.
  // ⚠️ 10 -> 11 col passo B, per gli alias come tutti.
  // ⚠️ 11 -> 12 col passo C1, per l'alias come tutti.
  log('[B] Dodici dipendenze a tempo di PARSING',
    aParsing.length === 12,
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
