// L'ordine dei passi dell'episodio, letto da index.html.
//
// Perché esiste: i test devono aprire un modulo, e la mappa non lo lascia
// aprire finché i passi precedenti non risultano completati. Ogni test si
// scriveva quindi a mano la lista dei moduli da segnare come fatti — una
// fotografia dell'ordine del giorno in cui il test era stato scritto. Al
// primo riordino vero (da 14 a 22 passi) sono cadute quasi tutte insieme,
// e nessuna diceva perché: solo "timeout aspettando un modulo".
//
// Qui la lista si calcola dall'ordine vero (CONFIG.moduleOrderDefault), che
// è l'unico posto che decide la sequenza. Un riordino futuro non tocca più
// nessun test.
//
// La lettura è statica — index.html come testo — invece che dalla pagina:
// così la lista è disponibile PRIMA di aprire il browser, dove i test ne
// hanno bisogno, e non serve cambiare la firma di nessuna funzione.

const fs = require('fs');
const { repoPath } = require('./test-env');

function readOrder() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const block = html.match(/moduleOrderDefault:\s*\[([\s\S]*?)\n\s*\],/);
  if (!block) throw new Error('moduleOrderDefault non trovato in index.html');
  const pairs = [];
  const re = /\{\s*module:\s*'([^']+)'(?:\s*,\s*grade:\s*'([^']+)')?(?:\s*,\s*off:\s*(true|false))?\s*\}/g;
  let m;
  while ((m = re.exec(block[1])) !== null) {
    pairs.push({ module: m[1], grade: m[2], off: m[3] === 'true' });
  }
  if (!pairs.length) throw new Error('moduleOrderDefault vuoto o in un formato non riconosciuto');
  return pairs;
}

// Gli id dei passi, nell'ordine della mappa. Stessa regola di moduleStepId()
// in index.html: la prima apparizione di un modulo tiene l'id nudo, le
// successive prendono un suffisso.
function stepIds() {
  const seen = {};
  return readOrder().filter(p => !p.off).map(p => {
    const id = seen[p.module] ? p.module + '-' + (seen[p.module] + 1) : p.module;
    seen[p.module] = (seen[p.module] || 0) + 1;
    return id;
  });
}

// I passi che precedono un modulo: quello che un test deve segnare come
// completato per poterlo aprire. Con un id di passo ('repeatAloud-2') vale
// quella apparizione; con un id di modulo ('voiceCoach') vale la prima.
function stepsBefore(moduleId) {
  const ids = stepIds();
  const i = ids.indexOf(moduleId);
  if (i === -1) throw new Error('Passo non presente nell\'ordine: ' + moduleId);
  return ids.slice(0, i);
}

// Il grado su cui lavora un passo — la lettera della sua coppia. I test che
// iniettano contenuto devono metterlo nel grado che il modulo legge davvero,
// non in quello che leggeva quando il test è stato scritto.
function gradeOf(moduleId) {
  const seen = {};
  const pairs = readOrder().filter(p => !p.off);
  for (const p of pairs) {
    const id = seen[p.module] ? p.module + '-' + (seen[p.module] + 1) : p.module;
    seen[p.module] = (seen[p.module] || 0) + 1;
    if (id === moduleId) return p.grade;
  }
  throw new Error('Passo non presente nell\'ordine: ' + moduleId);
}

// Tutti i passi completati — per i test che vogliono solo una mappa aperta,
// senza un modulo bersaglio.
function allSteps() {
  return stepIds();
}


// ---------------------------------------------------------------------------
// Le tabelle di personalizzazione e il riempimento dei segnaposto.
//
// Perché servono qui: i gradi C e D contengono {{papa}}, {{partenza}}, ... e
// l'app li sostituisce prima di mostrare il testo. Un test che confronta
// quello che vede a schermo con quello che c'è nel file deve fare la stessa
// sostituzione, altrimenti non trova mai niente — o, peggio, trova la voce
// sbagliata quando due modelli si assomigliano ("I'm {{figliaNome}}." accetta
// anche "I'm 16 years old.").
//
// Le regole sono le stesse di resolveSlotValue() in index.html: il nome di
// una persona non si traduce mai (tabella people.*), un toponimo sì.

function readTable(html, section, name) {
  const block = html.match(new RegExp(section + ':\\s*\\{[\\s\\S]*?\\n    \\},'));
  if (!block) return null;
  const list = block[0].match(new RegExp('\\b' + name + ':\\s*\\[([\\s\\S]*?)\\]'));
  if (!list) return null;
  const rows = [];
  const re = /\{\s*value:\s*'([^']*)'\s*,\s*it:\s*'([^']*)'\s*,\s*en:\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(list[1])) !== null) rows.push({ value: m[1], it: m[2], en: m[3] });
  return rows;
}

// I valori predefiniti di ogni slot, nelle due lingue: quelli che vede un
// utente di test, che non personalizza niente.
function slotValues(episodePath) {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const episode = JSON.parse(fs.readFileSync(repoPath.apply(null, (episodePath || ['data', 'it', 'a1-episodio1-inglese.json'])), 'utf8'));
  const values = {};
  (episode.personalizationTablesUsed || []).forEach(slot => {
    const isPerson = slot.table.indexOf('people.') === 0;
    if (slot.table.indexOf('episode.ageOptions.') === 0) {
      values[slot.key] = { it: String(slot.default), en: String(slot.default) };
      return;
    }
    const [section, name] = slot.table.split('.');
    const rows = readTable(html, section, name) || [];
    const picked = rows.find(r => r.value === slot.default) || rows[0];
    if (!picked) return;
    values[slot.key] = { it: picked.it, en: isPerson ? picked.it : picked.en };
  });
  return values;
}

// Il testo di una voce come lo mostra l'app: stessa sostituzione di
// fillTemplate(), sui valori predefiniti.
function itemText(item, lang, values) {
  const v = values || slotValues();
  const raw = lang === 'en' ? item.english : item.italian;
  return String(raw).replace(/\{\{(\w+)\}\}/g, (whole, key) => (v[key] ? v[key][lang] : whole));
}

module.exports = { readOrder, stepIds, stepsBefore, gradeOf, allSteps, slotValues, itemText };
