// Il censimento dei listener, DERIVATO dal sorgente invece che scritto a mano.
//
// Serve a test_listener_una_volta.js e deve sopravvivere al passo 21-quater:
// oggi i listener si attaccano a livello superiore dell'IIFE, dopo staranno
// dentro l'`open` del proprio modulo — ma la forma della riga
// (`getElementById('x').addEventListener('tipo'`) non cambia, quindi questa
// lettura vale prima e dopo. È il motivo per cui l'elenco si deriva invece di
// congelarlo: un elenco scritto a mano andrebbe aggiornato otto volte, e la
// volta che ci si dimentica è quella in cui il test smette di guardare.
//
// ⚠️ LIMITE DICHIARATO: prende solo i listener il cui bersaglio è un
// `getElementById('...')` sulla stessa riga. Restano fuori quelli attaccati a
// una variabile (`speakBtn`, `micBtn`, `configPanelBodyEl`) e quelli su
// `document`/`window`. Sono pochi e non sono di un modulo — tranne due di
// Repeat Aloud e Voice, che quindi questo censimento NON copre.

const fs = require('fs');
const { repoPath } = require('./test-env');

// ⚠️ UN LISTENER APPARTIENE AL MODULO NELLA CUI VISTA VIVE, NON A QUELLO CHE
// APRE.
//
// È la regola che decide tutti e settantanove.
//
// ⚠️ E LA MOTIVAZIONE SCRITTA QUI PRIMA ERA FALSA, corretta il 2026-09-16.
// Diceva che `#edit-custom` («Modifica i nomi della storia») resta fra i
// condivisi perché è «un pulsante VERSO Personalizza, come una riga della
// mappa», e che vive «dentro la vista di un altro modulo».
//
// **Quell'altro modulo non esiste.** `#edit-custom` vive in
// `view-pronunciation`, che **nessun modulo apre**: l'unica funzione che la
// mostra, `startPronunciationExercise`, non ha un solo chiamante in tutto
// `index.html` (misurato — una sola occorrenza, la sua definizione).
//
// La motivazione vera è più semplice, e vale per TUTTI E QUATTRO i listener di
// quella schermata — `speak-btn`, `mic-btn`, `edit-custom`, `back-home`:
//
//     non sono di nessun modulo perché vivono in una schermata che nessun
//     modulo apre.
//
// *La conclusione reggeva, la motivazione no — ed è la ⓪-quater su una
// decisione già approvata: una motivazione falsa accanto a codice giusto fa
// smettere di controllare chi la legge. Il «pulsante verso Personalizza»
// suggeriva una relazione che non esiste.*
//
// La schermata esce dopo il passo 25, quando il motore vocale con cui è
// intrecciata avrà un file suo — vedi docs/decisioni.md.
const FAMIGLIE = {
  voice:        { vista: 'view-voice-coach', tornaAllaMappa: 'voice-coach-back-map', pattern: /^(vc-|voice-coach-|voice-practice-)/ },
  personalizza: { vista: 'view-customize',   tornaAllaMappa: null,                   pattern: /^(customize-|slot-|request-|start-episode)/ },
  match:        { vista: 'view-match',       tornaAllaMappa: 'match-back-map',       pattern: /^(qm-|match-)/ },
  speedMatch:   { vista: 'view-speed-match', tornaAllaMappa: 'speed-match-back-map', pattern: /^(sr-|speed-match-)/ },
  dialogo:      { vista: 'view-dialogo',     tornaAllaMappa: 'dialogo-back-map',     pattern: /^(dg-|dialogo-)/ },
  storyCards:   { vista: 'view-story-cards', tornaAllaMappa: 'story-cards-back-map', pattern: /^(story-cards-)/ },
  flashcard:    { vista: 'view-flashcard',   tornaAllaMappa: 'flashcard-back-map',   pattern: /^(fc-|flashcard-)/ },
  repeatAloud:  { vista: 'view-repeat-aloud', tornaAllaMappa: 'repeat-aloud-back-map', pattern: /^(repeat-aloud-|ra-)/ }
};

// I listener dichiarati nel sorgente: [{ id, tipo }]
function listenerDichiarati() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const righe = html.split('\n');
  const out = [];
  righe.forEach(function (r) {
    if (r.trim().indexOf('//') === 0) return;
    const m = r.match(/getElementById\('([^']+)'\)\.addEventListener\('([^']+)'/);
    if (m) out.push({ id: m[1], tipo: m[2] });
  });
  return out;
}

// Quelli di una famiglia, per prefisso dell'id.
function listenerDi(famiglia) {
  const p = FAMIGLIE[famiglia].pattern;
  const visti = {};
  return listenerDichiarati().filter(function (l) {
    if (!p.test(l.id)) return false;
    const k = l.id + '|' + l.tipo;
    if (visti[k]) return false;   // due righe sullo stesso (id,tipo) sono un caso a sé
    visti[k] = true;
    return true;
  });
}

// ---------------------------------------------------------------------------
// I DESCRITTORI DEI MODULI: passo -> kind.
//
// ⚠️ PERCHE' ESISTE, e nasce da un difetto trovato il 2026-09-16.
//
// `[E]` di test_listener_una_volta.js verifica che aprire tutti i `kind` di una
// famiglia non attacchi due volte il suo blocco di listener. L'elenco su cui
// girava era **scritto a mano** dentro il test:
//
//     flashcard: ['flashcardAEngIta', 'flashcardAItaEng']
//
// e quei due NON sono due `kind`: sono due **PASSI** che condividono l'unico
// kind `flashcard`. Il test apriva due descrittori dello stesso kind e scriveva
// nel log «aprire i suoi 2 kind non duplica il blocco». **Verificava cinque
// famiglie e ne dichiarava sei.**
//
// E' la lezione del campione — scritta accanto a `[C]` lo stesso giorno — che
// trova il suo secondo caso nello stesso file: *un elenco scritto a mano dentro
// un test e' un campione, e un campione sceglie chi non guardare.* Qui aveva
// scelto di non guardare la differenza fra un passo e un kind.
//
// ⚠️ LA COINCIDENZA CHE L'HA RESO INVISIBILE, e che tornera' a tendere la
// trappola: per TREDICI descrittori su quindici il nome del passo e il nome del
// kind sono **la stessa stringa** (`matchEngIta` e' sia l'uno sia l'altro). Solo
// i due Flash Card li separano. Un elenco scritto a mano sembra giusto tredici
// volte su quindici — e la quattordicesima non somiglia a un errore.
//
// Da qui in avanti la mappa si LEGGE, non si ricopia.
//
// Sta in index.html e non in app/config.js: `MODULE_DESCRIPTORS` descrive il
// CODICE di ogni modulo (quale componente, quale profilo), non la sua
// configurazione. Se un giorno si sposta, questa funzione lo segue — e il
// controllo incrociato qui sotto se ne accorge subito, perche' la mappa
// tornerebbe vuota.
function descrittori() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const blocco = html.match(/var MODULE_DESCRIPTORS = \{([\s\S]*?)\n  \};/);
  if (!blocco) throw new Error('MODULE_DESCRIPTORS non trovato in index.html');
  const out = {};
  const re = /^\s*([A-Za-z][A-Za-z0-9]*):\s*\{[^}]*\bkind:\s*'([^']+)'/gm;
  let m;
  while ((m = re.exec(blocco[1])) !== null) out[m[1]] = m[2];
  if (!Object.keys(out).length) throw new Error('MODULE_DESCRIPTORS trovato ma vuoto o in un formato non riconosciuto');
  return out;
}

// I kind raggruppati per BLOCCO, letti dall'app VIVA.
//
// `BI.moduli` e' `{ kind: funzioneOpen }`: raggruppare per identita' della
// funzione da' esattamente «quali kind condividono un blocco», che e' la
// domanda a cui la chiave della guardia deve rispondere (vedi la regola
// accanto a BI.unaVoltaSola in app/spazio.js). Non e' una lettura del
// sorgente: e' il registro vero, quello su cui gira `openModuleByKind`.
//
// Torna [[kind, ...], ...] — un array per blocco.
async function bloccheDiKind(page) {
  return page.evaluate(function () {
    const m = window.BI.moduli;
    const gruppi = [];
    Object.keys(m).forEach(function (k) {
      let g = null;
      for (let i = 0; i < gruppi.length; i++) if (gruppi[i].fn === m[k]) { g = gruppi[i]; break; }
      if (!g) { g = { fn: m[k], kinds: [] }; gruppi.push(g); }
      g.kinds.push(k);
    });
    return gruppi.map(function (g) { return g.kinds; });
  });
}

module.exports = { FAMIGLIE, listenerDichiarati, listenerDi, descrittori, bloccheDiKind };
