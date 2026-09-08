// PROTEGGE: che `data/it/a1-episodio2-inglese.json` continui a dire quello che
// dichiara la sua fonte, `docs/it/episodio-2.md`. I due file cambiano insieme
// una volta ogni tanto, e quando divergono non crolla niente: i moduli si
// aprono pieni e hanno l'aria giusta: semplicemente insegnano una cosa che il
// documento non dice più.
//
// COME, e perché non come per l'episodio 1: `test_story_modules.js` confronta
// il JSON dell'episodio 1 **carattere per carattere** con le tabelle del suo
// markdown. Qui non si può: i due markdown hanno una forma diversa — il grado A
// dell'episodio 2 è una lista in prosa, il vocabolario sta in una sezione a
// parte e il dialogo in un'altra ancora. Scrivere un secondo lettore di tabelle
// significherebbe mantenere due parser di markdown per due file che cambiano
// insieme una volta ogni tanto: più codice fragile di quanto ne protegga.
//
// Si confrontano invece **i numeri dichiarati** — che nei due file sono scritti
// nella stessa forma — più le due cose che un conteggio non vede: che ogni
// skill stia su una battuta che esiste, e che ogni `fromLine` del grado C punti
// a una battuta vera. Sono i due modi in cui una trascrizione si rompe restando
// numericamente perfetta.
//
// LIMITE DICHIARATO: il TESTO non è confrontato. Se qualcuno cambia una parola
// nel markdown e non nel JSON, questo test resta verde. Il limite era stato
// scritto con una scadenza — «quando l'episodio 2 entrerà in `EPISODES`» — e
// quel giorno è arrivato (2026-09-08, CONFIG.episodioCorrente e l'interruttore
// del Pannello Admin). **Il limite però resta, e la scadenza si è spostata**:
// estendere il confronto testuale vuol dire un secondo lettore di markdown per
// una forma diversa da quella dell'episodio 1, che è esattamente il costo che
// questo file aveva deciso di non pagare. La riga è registrata in
// `docs/decisioni.md` con la sua condizione, invece di restare qui come una
// promessa scaduta.

const fs = require('fs');
const { repoPath } = require('./test-env');

const FONTE = 'docs/it/episodio-2.md';
const DATI = 'data/it/a1-episodio2-inglese.json';

// Stessa forma del riquadro dell'episodio 1: ogni numero si prende COL SUO
// NOME accanto, mai per posizione.
function numeriAttesi() {
  const testo = fs.readFileSync(repoPath.apply(null, FONTE.split('/')), 'utf8');
  const i = testo.indexOf('Numeri attesi');
  if (i === -1) throw new Error('Riquadro "Numeri attesi" non trovato in ' + FONTE);
  const blocco = testo.slice(i).split('\n').slice(0, 4)
    .filter((r, n) => n === 0 || r.trim().startsWith('>'))
    .join(' ').replace(/[>*]/g, ' ');
  const prendi = (etichetta, regex) => {
    const m = blocco.match(regex);
    if (!m) throw new Error('Numero atteso non trovato in ' + FONTE + ': ' + etichetta);
    return parseInt(m[1], 10);
  };
  return {
    A: prendi('grado A', /(\d+)\s+voci nel grado A/),
    B: prendi('grado B', /(\d+)\s+in B/),
    C: prendi('grado C', /(\d+)\s+in C/),
    D: prendi('grado D', /(\d+)\s+battute in D/),
    skill: prendi('skill', /(\d+)\s+skill/),
    slot: prendi('slot', /(\d+)\s+slot/)
  };
}

function run() {
  const results = [];
  const log = (msg, ok) => { results.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const attesi = numeriAttesi();
  const dati = JSON.parse(fs.readFileSync(repoPath.apply(null, DATI.split('/')), 'utf8'));
  const voci = g => ((dati.levels || {})[g] || {}).items || [];
  const battute = voci('D');
  const skill = battute.reduce((n, l) => n + ((l.whatYouLearn || []).length), 0);

  console.log('fonte: A=' + attesi.A + ' B=' + attesi.B + ' C=' + attesi.C +
    ' D=' + attesi.D + ' skill=' + attesi.skill + ' slot=' + attesi.slot);
  console.log('json:  A=' + voci('A').length + ' B=' + voci('B').length + ' C=' + voci('C').length +
    ' D=' + battute.length + ' skill=' + skill + ' slot=' + (dati.personalizationTablesUsed || []).length);

  ['A', 'B', 'C', 'D'].forEach(function (g) {
    log('[Numeri] Il grado ' + g + ' ha le voci che la fonte dichiara (' + attesi[g] + ')',
      voci(g).length === attesi[g]);
  });
  // Le skill si contano sulle LISTE, non sulle battute che ne hanno una: una
  // battuta sola può portarne due, e il conto per battute darebbe un numero
  // più basso di quello vero (CLAUDE.md regola 4).
  log('[Numeri] Le skill sono ' + attesi.skill + ', contate su tutte le liste', skill === attesi.skill);
  log('[Numeri] Gli slot di personalizzazione sono ' + attesi.slot,
    (dati.personalizationTablesUsed || []).length === attesi.slot);

  // Quello che un conteggio non vede.
  const idBattute = battute.map(function (l) { return l.id; });
  const orfane = voci('C').filter(function (f) { return idBattute.indexOf(f.fromLine) === -1; });
  if (orfane.length) console.log('  fromLine che non esistono: ' + orfane.map(function (f) { return f.id + '->' + f.fromLine; }).join(', '));
  log('[Coerenza] Ogni frase del grado C viene da una battuta che esiste', orfane.length === 0);

  const senzaTitolo = battute.reduce(function (acc, l) {
    return acc.concat((l.whatYouLearn || []).filter(function (s) { return !s.title || !s.body; })
      .map(function () { return l.id; }));
  }, []);
  log('[Coerenza] Ogni skill ha titolo e corpo, due campi separati (regola 25)', senzaTitolo.length === 0);

  const ids = [].concat(voci('A'), voci('B'), voci('C'), battute).map(function (i) { return i.id; });
  log('[Coerenza] Nessun id ripetuto nel file', new Set(ids).size === ids.length);

  const passed = results.filter(Boolean).length;
  console.log('\n=== EPISODIO 2 SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  process.exit(passed === results.length ? 0 : 1);
}

run();
