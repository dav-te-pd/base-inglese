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
// ⚠️ **IL 2026-09-19 QUEI QUATTRO LISTENER SONO USCITI, col passo A: la
// schermata è stata tolta.** Il ragionamento qui sopra resta al PASSATO ed è
// voluto — è il caso che ha insegnato la regola, e la regola vale ancora per
// i settantanove che restano. *Chi cerca `#edit-custom` in
// `tests/BASELINE-LISTENER.txt` non lo trova piu', e deve trovare questa
// riga invece del silenzio.*
//
// La schermata esce dopo il passo 25, quando il motore vocale con cui è
// intrecciata avrà un file suo — vedi docs/decisioni-stato.md.
//
// ⚠️ DUE CAMPI PER TORNARE ALLA MAPPA, E NON E' UNA RIDONDANZA — aggiunto il
// 2026-09-17 (passo 21-quater ⑦).
//
//   `tornaAllaMappa`   = il pulsante «← Mappa» dell'intestazione condivisa.
//   `uscitaVersoMappa` = QUALUNQUE pulsante riporti alla mappa.
//
// Per sei famiglie sono la stessa cosa. Per **Personalizza** la prima e' `null`
// ed e' giusto che lo sia — categoria Inizio, regola 17: chiude con la propria
// azione e un «← Mappa» non ce l'ha — mentre la seconda esiste ed e'
// `start-episode`.
//
// ⚠️ IL DIFETTO CHE QUESTO SEPARA, e vale oltre questo file:
//
//     UN CAMPO CHE RISPONDE A DUE DOMANDE DA' LA RISPOSTA GIUSTA A UNA E
//     SBAGLIATA ALL'ALTRA, E NESSUNO SE NE ACCORGE FINCHE' LE DUE NON
//     DIVERGONO.
//
// `tornaAllaMappa` rispondeva a entrambe, e per sei famiglie su otto le due
// risposte coincidevano. Sulla settima divergono — e il `null`, giusto per la
// prima domanda, ha fatto **escludere Personalizza dal blocco [C]** per tutto
// il tempo in cui nessuno ha guardato. *Il campo non era sbagliato: era uno
// solo.*
//
// ⚠️ E IL COSTO DI `uscitaVersoMappa` SU PERSONALIZZA, scritto qui perche' chi
// legge il campo lo sappia senza scoprirlo: `start-episode` non e' un «torna
// indietro». **Completa il modulo** (`markModuleCompleted`) e chiama
// `ensureEpisodeSlotFields`, che e' **asincrona** e ha un `.catch` che apre la
// schermata d'errore. E' l'unica delle otto in cui tornare alla mappa ha un
// effetto collaterale. Misurato il 2026-09-17: quattro aperture di fila
// funzionano e i tredici conti restano a 1.
const FAMIGLIE = {
  voice:        { vista: 'view-voice-coach', tornaAllaMappa: 'voice-coach-back-map', uscitaVersoMappa: 'voice-coach-back-map', pattern: /^(vc-|voice-coach-|voice-practice-)/ },
  personalizza: { vista: 'view-customize',   tornaAllaMappa: null,                   uscitaVersoMappa: 'start-episode',        pattern: /^(customize-|slot-|request-|start-episode)/ },
  match:        { vista: 'view-match',       tornaAllaMappa: 'match-back-map',       uscitaVersoMappa: 'match-back-map',       pattern: /^(qm-|match-)/ },
  speedMatch:   { vista: 'view-speed-match', tornaAllaMappa: 'speed-match-back-map', uscitaVersoMappa: 'speed-match-back-map', pattern: /^(sr-|speed-match-)/ },
  dialogo:      { vista: 'view-dialogo',     tornaAllaMappa: 'dialogo-back-map',     uscitaVersoMappa: 'dialogo-back-map',     pattern: /^(dg-|dialogo-)/ },
  storyCards:   { vista: 'view-story-cards', tornaAllaMappa: 'story-cards-back-map', uscitaVersoMappa: 'story-cards-back-map', pattern: /^(story-cards-)/ },
  flashcard:    { vista: 'view-flashcard',   tornaAllaMappa: 'flashcard-back-map',   uscitaVersoMappa: 'flashcard-back-map',   pattern: /^(fc-|flashcard-)/ },
  repeatAloud:  { vista: 'view-repeat-aloud', tornaAllaMappa: 'repeat-aloud-back-map', uscitaVersoMappa: 'repeat-aloud-back-map', pattern: /^(repeat-aloud-|ra-)/ }
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
// `MODULE_DESCRIPTORS` descrive il CODICE di ogni modulo (quale componente,
// quale profilo), non la sua configurazione — per questo non sta in
// `app/config.js`.
//
// ⚠️ **E IL 2026-09-19 SI E' SPOSTATO DAVVERO** (passo C1: da `index.html` a
// `app/catalogo.js`), cioe' il caso che il commento qui sopra prevedeva. Quel
// commento diceva *«se un giorno si sposta, questa funzione lo segue»*: **non
// lo seguiva**, cercava in un file solo, e il file e' MORTO con un `throw` a
// meta' corsa invece di fallire — ⓪-septies. *Il calo di asserzioni l'ha
// detto prima del rosso: 1497 → 1491.*
//
// Adesso cerca **dove sta**, in ordine, e se non lo trova da nessuna parte lo
// dice nominando tutti i posti guardati.
function descrittori() {
  const posti = ['index.html'].concat(
    fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) { return 'app/' + f; })
  );
  let blocco = null;
  for (let i = 0; i < posti.length && !blocco; i++) {
    const pezzi = posti[i].split('/');
    blocco = fs.readFileSync(repoPath.apply(null, pezzi), 'utf8')
      .match(/var MODULE_DESCRIPTORS = \{([\s\S]*?)\n  \};/);
  }
  if (!blocco) throw new Error('MODULE_DESCRIPTORS non trovato in nessuno di: ' + posti.join(', '));
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
