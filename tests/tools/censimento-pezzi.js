#!/usr/bin/env node
// CENSIMENTO DEI PEZZI — la riconciliazione del passo 24, fatta a macchina.
//
// ⚠️ ESISTE PERCHE' SENZA DI LUI IL PASSO 24 E' UNA RICERCA APERTA, cioe'
// esattamente la cosa che quel passo dichiara di voler evitare. «Guardo ogni
// modulo e vedo se manca qualcosa» non ha un criterio di completezza: «non ho
// trovato altro» e «non ho cercato bene» si leggono uguali.
//
// Qui l'esito e' un NUMERO: per ogni funzione dichiarata in `app/*.js` e per
// ogni classe introdotta in `stile/*.css`, la riga deve comparire in ESATTAMENTE
// UNO dei due documenti (`docs/componenti-condivisi.md`, `componenti-singoli.md`).
// O il conto torna, o non torna — e se non torna, dice quali pezzi sono scoperti.
//
// COME DECIDE IN QUALE DEI DUE dovrebbe stare un nome esposto su `BI`:
//   letto da PIU' file  -> condiviso
//   letto da UN file    -> singolo (la sala d'attesa: un secondo lettore lo promuove)
//   letto da nessun altro file di app/ -> singolo, e vale la pena guardarlo:
//     o lo usano solo i test, o e' esposizione morta.
//
// ⚠️ LIMITE DICHIARATO: questo strumento sa dire SE un pezzo e' catalogato, non
// se la riga che lo cataloga dice il vero. I tre campi del passo 24 — cosa fa,
// cosa gli passi/cosa torna, cosa da' per scontato — li scrive una persona
// leggendo la funzione. Lo strumento conta le righe; non le sa scrivere.

const fs = require('fs');
const path = require('path');

const RADICE = path.resolve(__dirname, '..', '..');
const rp = function () { return path.join.apply(path, [RADICE].concat(Array.prototype.slice.call(arguments))); };

function senzaCommenti(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function funzioniDi(file) {
  const t = senzaCommenti(fs.readFileSync(rp('app', file), 'utf8'));
  const out = [];
  const re = /^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/gm;
  let m;
  while ((m = re.exec(t)) !== null) out.push(m[1]);
  return out;
}

function classiDi(file) {
  const t = senzaCommenti(fs.readFileSync(rp('stile', file), 'utf8'));
  const out = {};
  const re = /\.(-?[_a-zA-Z][\w-]*)/g;
  let m;
  while ((m = re.exec(t)) !== null) out[m[1]] = true;
  return Object.keys(out);
}

function censisci() {
  const appFiles = fs.readdirSync(rp('app')).filter(function (f) { return /\.js$/.test(f); }).sort();
  const cssFiles = fs.readdirSync(rp('stile')).filter(function (f) { return /\.css$/.test(f); }).sort();

  const testi = {};
  appFiles.forEach(function (f) { testi[f] = senzaCommenti(fs.readFileSync(rp('app', f), 'utf8')); });

  // Chi espone cosa su BI, e chi lo legge da un altro file.
  const casa = {};
  appFiles.forEach(function (f) {
    const re = /\bBI\.([A-Za-z_$][\w$]*)\s*=/g;
    let m;
    while ((m = re.exec(testi[f])) !== null) casa[m[1]] = f;
  });
  const lettori = {};
  Object.keys(casa).forEach(function (nome) {
    lettori[nome] = appFiles.filter(function (f) {
      return f !== casa[nome] && new RegExp('\\bBI\\.' + nome + '\\b').test(testi[f]);
    });
  });

  const pezzi = [];
  appFiles.forEach(function (f) {
    funzioniDi(f).forEach(function (nome) {
      const esposto = casa[nome] === f;
      const quanti = esposto ? lettori[nome].length : 0;
      pezzi.push({
        tipo: 'funzione', nome: nome, file: 'app/' + f,
        dove: (esposto && quanti > 1) ? 'condivisi' : 'singoli',
        lettori: esposto ? lettori[nome] : [],
        esposto: esposto
      });
    });
  });
  cssFiles.forEach(function (f) {
    classiDi(f).forEach(function (nome) {
      pezzi.push({ tipo: 'classe', nome: '.' + nome, file: 'stile/' + f, dove: 'singoli', lettori: [], esposto: false });
    });
  });
  return pezzi;
}

function catalogati() {
  const dentro = {};
  ['componenti-condivisi.md', 'componenti-singoli.md'].forEach(function (doc) {
    const p = rp('docs', doc);
    if (!fs.existsSync(p)) return;
    fs.readFileSync(p, 'utf8').split('\n').forEach(function (r) {
      // Una riga di catalogo comincia con `| \`nome\` |`
      const m = r.match(/^\|\s*`([^`]+)`\s*\|/);
      if (m) (dentro[m[1]] = dentro[m[1]] || []).push(doc);
    });
  });
  return dentro;
}

const pezzi = censisci();
const dentro = catalogati();
const scoperti = pezzi.filter(function (p) { return !dentro[p.nome]; });
const doppi = Object.keys(dentro).filter(function (n) { return dentro[n].length > 1; });

const perFile = {};
scoperti.forEach(function (p) { perFile[p.file] = (perFile[p.file] || 0) + 1; });

console.log('PEZZI TOTALI: ' + pezzi.length +
  '  (funzioni ' + pezzi.filter(function (p) { return p.tipo === 'funzione'; }).length +
  ', classi ' + pezzi.filter(function (p) { return p.tipo === 'classe'; }).length + ')');
console.log('CATALOGATI:   ' + (pezzi.length - scoperti.length));
console.log('SCOPERTI:     ' + scoperti.length);
if (doppi.length) console.log('IN DUE DOCUMENTI (va tenuto uno solo): ' + doppi.join(', '));
console.log('');
Object.keys(perFile).sort().forEach(function (f) {
  console.log('  %s %s', (perFile[f] + '').padStart(4), f);
});

if (process.argv.indexOf('--elenco') !== -1) {
  console.log('');
  scoperti.forEach(function (p) {
    console.log([p.dove, p.tipo, p.nome, p.file, p.lettori.join('+')].join('\t'));
  });
}

// Uscita 0 sempre: e' un CENSIMENTO, non una guardia. Diventa una guardia il
// giorno in cui il conto degli scoperti e' zero — prima, un rosso fisso su
// codice giusto si impara a ignorare (stessa ragione per cui `tools/buchi.js`
// e' uno strumento e non un test).
process.exit(0);
