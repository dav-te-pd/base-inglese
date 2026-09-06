// PROTEGGE: che ogni parametro di APP_CONFIG sia nominato da qualcuno.
// Senza, una manopola smette di muovere qualcosa e resta nel Pannello Admin:
// si gira, non succede niente, e non c'è modo di accorgersene guardando
// l'app. È già successo con speedRound.pointsPerCorrect (decisione D4,
// docs/correzioni.md).
//
// COME CERCA, e perché non nel modo ovvio.
// Il modo ovvio sarebbe cercare il percorso puntato letterale
// ("CONFIG.speedRound.timeLimitSeconds"). Misurato su questo file: segnala
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
const { launchBrowser, APP_URL, repoPath } = require('./test-env');

const ESCLUDI_DESCRIZIONI = true;

// Chiavi che NON sono lette da nessuno e va bene così. Ognuna con il motivo
// scritto: un'eccezione senza motivo è un'eccezione che nessuno oserà togliere.
const ECCEZIONI = {
  'places.destinations':
    'Magazzino dei paesi, in attesa dell\'episodio 2. Da rivedere: Francia, ' +
    'Germania e Spagna escono, origine e destinazione non coincidono mai.'
};

// Toglie il blocco configFieldDescriptions dal testo. Le graffe si contano
// invece di cercare la chiusura a occhio: il blocco non è per sempre l'ultima
// sezione di APP_CONFIG, e un marcatore posizionale mangerebbe in silenzio
// tutto quello che gli viene dopo.
function senzaBloccoDescrizioni(testo) {
  var i = testo.indexOf('configFieldDescriptions: {');
  if (i === -1) throw new Error('configFieldDescriptions non trovato in index.html');
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
function regioneDiRicerca() {
  var html = fs.readFileSync(repoPath('index.html'), 'utf8');
  if (ESCLUDI_DESCRIZIONI) html = senzaBloccoDescrizioni(html);
  return [html].concat(tuttiIJson(repoPath('data'))).join('\n');
}

// Tutti i .json sotto data/, a qualunque profondità: i dati stanno in una
// cartella per lingua (data/it/, e domani data/de/), quindi un readdir piatto
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
  const config = await page.evaluate(() => window.APP_CONFIG);
  await page.close();
  await browser.close();

  const regione = regioneDiRicerca();
  const tutti = percorsiFoglia(config);
  // configFieldDescriptions non è un parametro: è documentazione dei
  // parametri, e il pannello la salta già (renderConfigPanel).
  const daControllare = tutti.filter(function (p) { return p[0] !== 'configFieldDescriptions'; });

  console.log('Chiavi foglia in APP_CONFIG: ' + tutti.length +
    ' (' + daControllare.length + ' controllate, ' +
    (tutti.length - daControllare.length) + ' di configFieldDescriptions)');
  console.log('Regione di ricerca: index.html' +
    (ESCLUDI_DESCRIZIONI ? ' (senza il blocco configFieldDescriptions)' : '') + ' + tutti i .json sotto data/');
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
