// Misura uno strato PRIMA di estrarlo: quante righe, e soprattutto COSA
// NOMINA che non gli appartiene.
//
// ⚠️ PERCHE' ESISTE, ed e' un guasto vero e non un'ipotesi: il 2026-09-17 la
// misura dello strato `identita` l'avevo fatta a mano contando quali FUNZIONI
// il gruppo nomina. `ICONS` e' una `var`, non una funzione, quindi non e'
// comparsa — la tabella delle icone e' rimasta in index.html, e il primo
// `icon()` ha spento l'app con un ReferenceError.
//
// **La misura rispondeva a una domanda piu' stretta di quella che le stavo
// facendo**, e la differenza non si vedeva finche' gli strati contenevano
// solo funzioni. Questo file esiste perche' la domanda giusta — «quali NOMI»,
// non «quali funzioni» — sia scritta una volta invece che ricordata ogni
// volta.
//
// E' di sola LETTURA: non tocca niente. Lo spostamento vero resta a mano, ed
// e' voluto — ogni strato l'ho spostato in modo un po' diverso, e uno
// strumento che riscrive index.html sarebbe il pezzo piu' pericoloso del
// progetto per il guadagno piu' piccolo.
//
// Uso:
//   node tests/tools/misura-strato.js nome1 nome2 nome3 ...
//   node tests/tools/misura-strato.js --file elenco.txt

const fs = require('fs');
const { repoPath } = require('../test-env');

function pezzi(sorgente) {
  const src = fs.readFileSync(sorgente, 'utf8').split('\n');
  const blocchi = [];
  src.forEach(function (r, i) {
    let m = r.match(/^  function (\w+)\s*\(/);
    if (m) {
      let j = i + 1;
      while (j < src.length && !/^  \}/.test(src[j])) j++;
      blocchi.push({ nome: m[1], tipo: 'function', da: i, a: j });
      return;
    }
    m = r.match(/^  var (\w+)\s*=/);
    if (m) {
      // una `var` puo' essere su piu' righe (un oggetto): finisce alla prima
      // `  };` o, se la riga si chiude da sola, li' stesso.
      let j = i;
      if (!/;\s*$/.test(r)) { while (j < src.length && !/^  \};?\s*$/.test(src[j])) j++; }
      blocchi.push({ nome: m[1], tipo: 'var', da: i, a: j });
    }
  });
  return { src: src, blocchi: blocchi };
}

function misura(nomi, sorgente) {
  const { src, blocchi } = pezzi(sorgente);
  const tutti = new Set(blocchi.map(function (b) { return b.nome; }));
  const dentro = blocchi.filter(function (b) { return nomi.indexOf(b.nome) !== -1; });
  const mancanti = nomi.filter(function (n) { return !tutti.has(n); });
  const nomiDentro = new Set(dentro.map(function (b) { return b.nome; }));

  // ⚠️ LA RIGA CHE IL CONTO A MANO NON AVEVA: si guardano le funzioni E le var.
  const fuori = {};
  dentro.forEach(function (b) {
    const corpo = src.slice(b.da, b.a + 1).join('\n');
    corpo.split('\n').forEach(function (r) {
      if (/^\s*\/\//.test(r)) return;              // i commenti non contano
      (r.match(/\b[A-Za-z_$][A-Za-z0-9_$]*\b/g) || []).forEach(function (id) {
        if (tutti.has(id) && !nomiDentro.has(id)) {
          (fuori[id] = fuori[id] || new Set()).add(b.nome);
        }
      });
    });
  });
  return {
    dentro: dentro,
    mancanti: mancanti,
    righe: dentro.reduce(function (a, b) { return a + (b.a - b.da + 1); }, 0),
    fuori: Object.keys(fuori).sort().map(function (k) {
      return { nome: k, tipo: blocchi.find(function (b) { return b.nome === k; }).tipo, da: [].concat(Array.from(fuori[k])) };
    })
  };
}

module.exports = { misura: misura };

if (require.main === module) {
  let nomi = process.argv.slice(2);
  if (nomi[0] === '--file') nomi = fs.readFileSync(nomi[1], 'utf8').split(/\s+/).filter(Boolean);
  if (!nomi.length) { console.error('uso: node tests/tools/misura-strato.js nome1 nome2 ...'); process.exit(64); }
  const m = misura(nomi, repoPath('index.html'));
  m.dentro.forEach(function (b) {
    console.log(String(b.da + 1).padStart(6) + '-' + String(b.a + 1).padStart(6) + '  ' + b.tipo.padEnd(9) + b.nome);
  });
  console.log('');
  console.log('pezzi: ' + m.dentro.length + ' · righe: ' + m.righe);
  if (m.mancanti.length) console.log('⚠️  NON TROVATI in index.html: ' + m.mancanti.join(', '));
  if (!m.fuori.length) {
    console.log('dipendenze verso il resto di index.html: NESSUNA');
  } else {
    console.log('⚠️  DIPENDENZE VERSO IL RESTO DI index.html: ' + m.fuori.length);
    m.fuori.forEach(function (f) {
      console.log('    ' + f.tipo.padEnd(9) + f.nome.padEnd(28) + 'nominato da: ' + f.da.join(', '));
    });
  }
}
