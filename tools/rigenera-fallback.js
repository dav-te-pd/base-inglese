// Riscrive le copie di sicurezza dentro index.html a partire dai file in
// data/ — window.FALLBACK_EPISODE_DATA, FALLBACK_MODULE_INSTRUCTIONS,
// FALLBACK_FEEDBACK_MESSAGES.
//
// Perché esiste: CLAUDE.md regola 6 impone di aggiornare la copia nello
// stesso commit in cui si tocca un file in data/, e tests/test_fallbacks.js
// fa fallire la CI se le due versioni divergono. Rifarlo a mano è lungo e
// sbaglia facilmente (la divergenza che ha rotto l'artifact era proprio
// così), e il pezzo di codice che lo fa è stato riscritto al volo una
// decina di volte prima di finire qui.
//
//   node tools/rigenera-fallback.js
//
// Non tocca nient'altro del file: sostituisce solo il letterale che segue
// ogni "window.FALLBACK_* =". Dopo, lanciare tests/test_fallbacks.js per
// avere la conferma.

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(REPO_ROOT, 'index.html');

// Il terzo campo dice come va indicizzato il contenuto: il file episodio sta
// sotto la propria chiave di percorso (l'app lo cerca per dataFile), gli
// altri due entrano così come sono.
const BLOCCHI = [
  { global: 'FALLBACK_EPISODE_DATA', file: 'data/it/a1-episodio1-inglese.json', perPercorso: true },
  { global: 'FALLBACK_MODULE_INSTRUCTIONS', file: 'data/it/istruzioni-moduli.json', perPercorso: false },
  { global: 'FALLBACK_FEEDBACK_MESSAGES', file: 'data/it/messaggi-feedback.json', perPercorso: false }
];

function indentaComeIlFile(testo) {
  return testo.split('\n').map(function (riga, i) { return i ? '  ' + riga : riga; }).join('\n');
}

function rigenera() {
  let html = fs.readFileSync(INDEX, 'utf8');
  const fatti = [];

  BLOCCHI.forEach(function (blocco) {
    const dati = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, blocco.file), 'utf8'));
    const contenuto = blocco.perPercorso ? { [blocco.file]: dati } : dati;
    // Il letterale va da "= {" fino alla graffa chiusa a due spazi di
    // indentazione, che è come sono scritti tutti e tre nel file.
    const re = new RegExp('(window\\.' + blocco.global + '\\s*=\\s*)(\\{[\\s\\S]*?\\n  \\});');
    const m = html.match(re);
    if (!m) throw new Error('Blocco non trovato in index.html: ' + blocco.global);
    const corpo = indentaComeIlFile(JSON.stringify(contenuto, null, 2));
    html = html.slice(0, m.index + m[1].length) + corpo + html.slice(m.index + m[1].length + m[2].length);
    fatti.push(blocco.global);
  });

  fs.writeFileSync(INDEX, html);
  return fatti;
}

const fatti = rigenera();
console.log('Copie di sicurezza rigenerate da data/:');
fatti.forEach(function (n) { console.log('  - window.' + n); });
console.log('\nOra: node tests/test_fallbacks.js  (serve il server: npm run serve)');
