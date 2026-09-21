// PROTEGGE: che ogni parametro di APP_CONFIG sia nominato da qualcuno.
// Senza, una manopola smette di muovere qualcosa e resta nel Pannello Admin:
// si gira, non succede niente, e non c'è modo di accorgersene guardando
// l'app. È già successo con speedMatch.pointsPerCorrect (decisione D4,
// docs/correzioni.md).
//
// COME CERCA, e perché non nel modo ovvio.
// Il modo ovvio sarebbe cercare il percorso puntato letterale
// ("CONFIG.speedMatch.timeLimitSeconds"). Misurato su questo file: segnala
// 104 chiavi su 141, quasi tutte lette davvero — l'app indicizza a runtime
// (CONFIG.moduleTypes[module.type], CONFIG.sound.events[nome],
// CONFIG.gradeNames[grado]) e quel percorso non compare mai come testo. Un
// test con 104 falsi positivi non lo guarda nessuno.
//
// Qui si cerca invece il NOME DELLA FOGLIA — "timeLimitSeconds" — in tutto
// il codice e in tutti i dati. Una chiave dichiarata e mai nominata altrove
// compare una volta sola: la sua dichiarazione. Due o più occorrenze vogliono
// dire che qualcuno la nomina. Misurato: zero falsi positivi.
//
// IL BLOCCO configFieldDescriptions È FUORI DALLA REGIONE DI RICERCA, non solo
// dal conteggio. La richiesta diceva di lasciarlo dentro; misurandolo si vede
// che lasciarlo dentro apre esattamente il buco che il test esiste per
// chiudere: una descrizione contiene il percorso puntato, quindi contiene il
// nome della foglia, quindi basta scrivere una riga di documentazione perché
// un parametro morto passi il test. Verificato reintroducendo
// pointsPerCorrect: senza descrizione viene segnalato in entrambi i modi, con
// una descrizione sfugge se le descrizioni restano nella regione. Oggi il
// risultato è identico (una sola chiave segnalata, l'eccezione qui sotto):
// cambia solo cosa succede domani. Si torna indietro invertendo
// ESCLUDI_DESCRIZIONI qui sotto.
//
// LIMITE DICHIARATO: una foglia con un nome generico ("name", "label",
// "value") è impossibile da falsificare — quel nome compare ovunque a
// prescindere. Il test è forte sui nomi propri, cioè esattamente quelli dei
// parametri costruiti per uno scopo, che sono quelli che smettono di essere
// letti.
const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');

const ESCLUDI_DESCRIZIONI = true;

// Chiavi che NON sono lette da nessuno e va bene così. Ognuna con il motivo
// scritto: un'eccezione senza motivo è un'eccezione che nessuno oserà togliere.
// Vuoto, e va tenuto vuoto finché non serve davvero.
//
// Conteneva 'places.destinations': un magazzino di paesi che nessuno nominava,
// in attesa dell'episodio 2. L'attesa è finita il 2026-09-08 —
// data/inglese/it/inglese-it-aircraft-door.json dichiara lo slot `destinazione` con
// `table: "places.destinations"` — e la chiave è tornata viva.
//
// La riga non è stata tolta a mano: **è stato questo test a chiederlo**.
// L'asserzione "nessuna eccezione superflua" è diventata rossa da sola nella
// suite, ed è la metà che si dimentica di scrivere: senza, un'eccezione
// dichiarata una volta resta lì per sempre e copre in silenzio la chiave che
// un giorno muore davvero.
const ECCEZIONI = {};

// Toglie il blocco configFieldDescriptions dal testo. Le graffe si contano
// invece di cercare la chiusura a occhio: il blocco non è per sempre l'ultima
// sezione di APP_CONFIG, e un marcatore posizionale mangerebbe in silenzio
// tutto quello che gli viene dopo.
function senzaBloccoDescrizioni(testo) {
  var i = testo.indexOf('configFieldDescriptions: {');
  if (i === -1) throw new Error('configFieldDescriptions non trovato in app/config.js');
  var apertura = testo.indexOf('{', i);
  var livello = 0;
  for (var k = apertura; k < testo.length; k++) {
    if (testo[k] === '{') livello++;
    else if (testo[k] === '}') {
      livello--;
      if (livello === 0) return testo.slice(0, i) + testo.slice(k + 1);
    }
  }
  throw new Error('graffa di chiusura di configFieldDescriptions non trovata');
}

// Il testo dove si cerca: il codice dell'app e i dati che legge. Non i test —
// un nome citato in un test non vuol dire che l'app lo usi.
// ⚠️ DUE FILE, NON PIU' UNO — dal 2026-09-15 (passo 20).
//
// APP_CONFIG e' uscito in app/config.js, e i due pezzi hanno ruoli OPPOSTI in
// questo test: `config.js` e' dove le chiavi si DICHIARANO, `index.html` e'
// (con i dati) dove si NOMINANO. Il blocco delle descrizioni si toglie quindi
// da config.js, che e' l'unico posto in cui sta.
//
// ⚠️ E LA REGIONE DEVE CONTENERE ENTRAMBI. Lasciando solo index.html, ogni
// chiave risulterebbe nominata una volta sola — la sua dichiarazione sarebbe
// sparita dalla regione — e il test segnalerebbe 140 chiavi morte: un rosso
// enorme e falso. Lasciando solo config.js sarebbe il contrario: nessuna
// chiave nominata da nessuno, e il test cadrebbe su tutto. Il numero da
// guardare dopo questo passo e' quello dichiarato piu' in basso: deve restare
// 144 chiavi controllate e una sola asserzione sul totale.
//
// ⚠️ E LA REGIONE SI DERIVA DA `app/`, NON SI ELENCA A MANO — dal 2026-09-17
// (passo 22). E' la correzione che serve ai SEI STRATI CHE VENGONO DOPO, non a
// quello in corso.
//
// Fino a qui la regione nominava due file: `app/config.js` e `index.html`. Il
// passo 22 spezza `index.html` in strati, **e ogni strato porta fuori dei
// lettori di CONFIG**. Misurato il 2026-09-17, appena estratto il primo:
// `app/avvio.js` legge `APP_CONFIG.themes.defaultTheme` ed era gia' FUORI
// dalla regione. Il test era verde per un pelo — quella chiave e' nominata
// altre tre volte in index.html, quindi superava la soglia lo stesso.
//
// **Alla prima chiave nominata SOLO dentro un file estratto, questo test
// direbbe «chiave morta» su una chiave viva.** Non e' un verde che mente — una
// regione piu' piccola segnala PIU' chiavi, quindi cade rumorosamente — ma e'
// un rosso falso per strato, e la diagnosi si pagherebbe sei volte.
//
// Adesso la regione cresce da sola: **chi estrae uno strato non deve sapere
// che questo test esiste.** E' la stessa mossa del blocco [C] derivato da
// `FAMIGLIE` e del blocco [E] derivato da `MODULE_DESCRIPTORS` — la fonte
// decide, non chi scrive il test. Terza applicazione.
//
// LIMITE DICHIARATO: prende i `.js` direttamente sotto `app/`, non le
// sottocartelle. Oggi non ce ne sono; il giorno che ce ne fossero, questa
// lettura andrebbe resa ricorsiva come `tuttiIJson`.
function tuttiIFileApp() {
  return fs.readdirSync(repoPath('app'))
    .filter(function (n) { return /\.js$/.test(n); })
    .sort()
    .map(function (n) {
      var testo = fs.readFileSync(repoPath('app', n), 'utf8');
      // Il blocco delle descrizioni si toglie DOVE STA, cioe' in config.js —
      // non da tutti i file, che non ce l'hanno.
      return (ESCLUDI_DESCRIZIONI && n === 'config.js') ? senzaBloccoDescrizioni(testo) : testo;
    });
}

function regioneDiRicerca() {
  var html = fs.readFileSync(repoPath('index.html'), 'utf8');
  return tuttiIFileApp().concat([html]).concat(tuttiIJson(repoPath('data'))).join('\n');
}

// Tutti i .json sotto data/, a qualunque profondità: i dati stanno in una
// cartella per lingua (data/inglese/it/, e domani data/de/), quindi un readdir piatto
// non troverebbe più niente — e non troverebbe niente in silenzio, perché una
// regione di ricerca vuota fa solo segnalare più chiavi, non fallire.
function tuttiIJson(dir) {
  var out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (voce) {
    var pieno = dir + '/' + voce.name;
    if (voce.isDirectory()) out = out.concat(tuttiIJson(pieno));
    else if (/\.json$/.test(voce.name)) out.push(fs.readFileSync(pieno, 'utf8'));
  });
  return out;
}

// Ogni percorso foglia di APP_CONFIG. Un array è una foglia: si legge intero.
function percorsiFoglia(obj, prefisso) {
  var out = [];
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    var p = (prefisso || []).concat([k]);
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out = out.concat(percorsiFoglia(v, p));
    } else {
      out.push(p);
    }
  });
  return out;
}

function occorrenze(testo, nome) {
  var re = new RegExp('\\b' + nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
  var m = testo.match(re);
  return m ? m.length : 0;
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const risultati = [];
  const log = (msg, ok) => { risultati.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  await page.goto(APP_URL);
  // ⚠️ SI ASPETTA, E NON PER EVITARE UN ROSSO — PER EVITARE UN VERDE.
  //
  // Dal passo 1.11b **sette** chiavi di `APP_CONFIG` (`grades`, `gradeNames`,
  // `moduleTypes`, `moduleLabels`, `sequences`, `episodes`, le due lingue di
  // `speech`) arrivano da `struttura-corso.json` — `moduleLabels` e' l'ultima
  // arrivata, col passo 1.3d del 2026-09-21. Leggere la configurazione appena
  // caricata la pagina non darebbe un errore: darebbe un oggetto **con sette
  // chiavi in meno**, e questo file — che verifica «ogni chiave di
  // APP_CONFIG e' nominata da qualcuno» — smetterebbe di guardarle
  // **restando verde**.
  //
  // *E' esattamente il difetto che il commento qui sotto descrive per il
  // magazzino dei nomi, ripresentato da un'altra parte: un inventario che si
  // accorcia da solo non fallisce, si limita a proteggere meno.*
  await attendiPrimaSchermata(page);
  const config = await page.evaluate(() => window.APP_CONFIG);
  await page.close();
  await browser.close();

  const regione = regioneDiRicerca();
  // ⚠️ IL MAGAZZINO NON STA PIU' IN APP_CONFIG, e senza questa riga il test
  // SMETTEREBBE DI GUARDARLO RESTANDO VERDE.
  //
  // E' il difetto peggiore che questo file possa avere: l'inventario nasce da
  // `window.APP_CONFIG`, quindi il 2026-09-15, quando `people` e `places` sono
  // usciti, le loro foglie (papa, mamma, departures, destinations) sono
  // semplicemente sparite dall'elenco. Nessun rosso, nessun avviso: il test
  // avrebbe continuato a dire «ogni chiave e' nominata da qualcuno» su un
  // insieme piu' piccolo di prima. Un test che perde meta' di quello che
  // controllava e resta verde e' peggio di un test che non c'e'.
  //
  // Il magazzino si aggiunge quindi all'inventario, letto dal file. `_nota`
  // resta fuori: e' la spiegazione del file per chi lo apre, non un parametro
  // — stesso ruolo che configFieldDescriptions ha dentro APP_CONFIG.
  const magazzino = JSON.parse(fs.readFileSync(repoPath('data/inglese/it/inglese-it-tabelle-personalizzazione.json'), 'utf8'));
  const tutti = percorsiFoglia(config).concat(
    percorsiFoglia({ people: magazzino.people, places: magazzino.places })
  );
  // configFieldDescriptions non è un parametro: è documentazione dei
  // parametri, e il pannello la salta già (renderConfigPanel).
  const daControllare = tutti.filter(function (p) { return p[0] !== 'configFieldDescriptions'; });

  console.log('Chiavi foglia in APP_CONFIG + magazzino: ' + tutti.length +
    ' (' + daControllare.length + ' controllate, ' +
    (tutti.length - daControllare.length) + ' di configFieldDescriptions)');
  console.log('Regione di ricerca: ' + fs.readdirSync(repoPath('app')).filter(function (n) { return /\.js$/.test(n); }).sort().map(function (n) { return 'app/' + n; }).join(' + ') +
    (ESCLUDI_DESCRIZIONI ? ' (config.js senza il blocco configFieldDescriptions)' : '') + ' + index.html + tutti i .json sotto data/');
  console.log('');

  const mute = daControllare.filter(function (p) {
    return occorrenze(regione, p[p.length - 1]) < 2;
  }).map(function (p) { return p.join('.'); });

  const nonPreviste = mute.filter(function (k) { return !ECCEZIONI[k]; });
  const previste = mute.filter(function (k) { return !!ECCEZIONI[k]; });

  previste.forEach(function (k) {
    console.log('    eccezione attesa: ' + k);
    console.log('      ' + ECCEZIONI[k]);
  });
  nonPreviste.forEach(function (k) {
    console.log('    MAI NOMINATA: ' + k + ' — dichiarata e mai letta da nessuno.');
  });
  console.log('');

  log('Ogni chiave di APP_CONFIG è nominata da qualcuno (o è un\'eccezione dichiarata)',
    nonPreviste.length === 0);

  // La copertura del magazzino si dichiara, invece di darla per scontata:
  // se un giorno il file cambia forma e le due radici non ci sono piu', qui
  // si vede — mentre l'asserzione qui sopra resterebbe verde su un inventario
  // dimagrito, che e' esattamente il difetto da cui nasce questa riga.
  const foglieMagazzino = percorsiFoglia({ people: magazzino.people, places: magazzino.places }).length;
  log('Il magazzino della personalizzazione è dentro l\'inventario (' + foglieMagazzino + ' tabelle)',
    foglieMagazzino >= 7);

  // Un'eccezione che ha smesso di essere tale va tolta: altrimenti la lista
  // cresce e nessuno la ripulisce più.
  const eccezioniInutili = Object.keys(ECCEZIONI).filter(function (k) { return mute.indexOf(k) === -1; });
  eccezioniInutili.forEach(function (k) {
    console.log('    ECCEZIONE NON PIÙ NECESSARIA: ' + k + ' ora è nominata — va tolta da ECCEZIONI.');
  });
  log('Nessuna eccezione superflua nella lista', eccezioniInutili.length === 0);

  // Il test deve poter fallire: se un nome inventato non viene segnalato,
  // la ricerca non sta funzionando e i due OK qui sopra non valgono niente.
  log('La ricerca sa segnalare: un nome inventato risulta mai nominato',
    occorrenze(regione, 'parametroCheNonEsisteDavvero') < 2);

  const falliti = risultati.filter(function (r) { return !r; }).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
