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
// È la regola che decide tutti e ottanta, e va letta qui perché il caso che la
// rende necessaria sembra sempre il contrario: `#edit-custom` («Modifica i
// nomi della storia») APRE Personalizza, ma VIVE dentro `view-pronunciation`.
// È un pulsante VERSO Personalizza, come una riga della mappa — e resta fra i
// condivisi. Spostarlo dentro `openCustomize` lo renderebbe muto per chi non
// ha ancora aperto Personalizza in quella sessione.
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

module.exports = { FAMIGLIE, listenerDichiarati, listenerDi };
