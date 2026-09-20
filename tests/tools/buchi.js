// I BUCHI NEI DUE VERSI, per un file di `app/` appena estratto o toccato.
//
//   ① cosa CHIAMA senza averlo definito né aliasato   → il file nuovo muore
//   ② quali dei suoi nomi index.html NOMINA ancora    → index.html muore
//
// ⚠️ SI PASSA PRIMA DELLA SUITE, NON DOPO, ED E' TUTTO IL VALORE DI QUESTO
// FILE. Estraendo `app/mappa.js` non l'ho fatto: la suite ha dato DODICI file
// rossi, tutti con la stessa causa, e ci sono voluti tre giri da cinque minuti
// e mezzo per arrivare in fondo. Estraendo `app/storycards.js` l'ho passato
// prima: ha trovato nove problemi a costo zero, e la suite ha dato DUE rossi,
// entrambi decisioni previste.
//
// ⚠️ LIMITE DICHIARATO, e va saputo o produce falsi allarmi: il filtro sui
// commenti scarta le righe che COMINCIANO con `//`, `*` o `/*`. Dentro un
// commento di blocco `/* ===== */` le righe di continuazione cominciano con
// una lettera, quindi passano per codice. Un nome citato in quella prosa
// risulta «orfano» senza esserlo — successo su quattro nomi il 2026-09-18.
// **Un risultato non-zero si legge, non si crede: si guarda la riga.**
//
// ⚠️ LA RICERCA USA UN LOOKBEHIND, E NON È UN VEZZO DI SINTASSI.
//
// Prima il delimitatore veniva CONSUMATO: `[^.\w$'"`]([a-zA-Z_$][\w$]*)\s*\(`.
// Su `if (staParlando())` il primo match era `if (` — e si portava via la
// parentesi, cioè il delimitatore di `staParlando`. **Il nome dentro la
// condizione diventava invisibile.** Vale per `if (`, `while (`, `return (`,
// `&& (`: tutti i posti in cui una chiamata sta subito dentro una parentesi
// appena aperta.
//
// Trovato il 2026-09-19 estraendo Flash Card: questo strumento ha detto
// **ZERO** su un file che moriva con `staParlando is not defined` al primo
// tocco su una carta. *È la forma peggiore — non un errore che si annuncia,
// ma un controllo che dice «non c'è niente» (regola 37).* Col lookbehind il
// delimitatore non si consuma e il nome si vede.
//
// Uso: node tests/tools/buchi.js <nomefile.js>

const fs=require('fs');
const f=process.argv[2];
const s=fs.readFileSync('app/'+f,'utf8');
new Function(s);
const def=new Set([...s.matchAll(/^  (?:function|var) (\w+)/gm)].map(m=>m[1]));
const ok=new Set(['BI','CONFIG','window','document','console','Math','Object','Array','JSON','Promise','String','Number','localStorage','setTimeout','clearTimeout','setInterval','clearInterval','Date','parseInt','parseFloat','isNaN','Set','Map','encodeURIComponent','RegExp','Error','KeyboardEvent','URLSearchParams','Boolean','true','false','null','undefined','this','if','for','while','switch','catch','return','typeof','function','new','else','do']);
const ch=new Set();
s.split('\n').forEach(r=>{const t=r.trim();if(!t||t.startsWith('//')||t.startsWith('*')||t.startsWith('/*'))return;
 [...r.matchAll(/(?<![.\w$'"`])([a-zA-Z_$][\w$]*)\s*\(/g)].forEach(m=>ch.add(m[1]));});
// ⚠️ SECONDA RICERCA, E NASCE DA UN GUASTO CHE LA PRIMA NON POTEVA VEDERE.
//
// La prima cerca `nome(`, cioe' una CHIAMATA. Un nome passato come
// RIFERIMENTO non ha la parentesi:
//
//     btn.addEventListener('click', openEpisodeMap);
//
// Il 2026-09-19, estraendo il Dialogo, questo strumento ha detto solo prosa e
// il modulo si apriva sulla schermata d'errore con `openEpisodeMap is not
// defined`. **E' la stessa forma del lookbehind di ieri: non un errore che si
// annuncia, ma un controllo che dice «non c'e' niente» (regola 37)** — con
// l'aggravante che stavolta il nome era passato a un listener, quindi il
// guasto compariva solo aprendo quel modulo.
//
// La ricerca e' STRETTA di proposito: un identificatore nudo in posizione di
// argomento, `(nome)` o `, nome)` o `(nome,`. Cercare ogni riferimento
// darebbe ogni variabile del file. Si scartano i parametri delle funzioni e
// le variabili locali, che altrimenti uscirebbero tutte.
const parm=new Set();
[...s.matchAll(/function\s*\w*\s*\(([^)]*)\)/g)].forEach(m=>
  m[1].split(',').forEach(x=>{const t=x.trim(); if(t) parm.add(t);}));
[...s.matchAll(/(?:var|let|const)\s+([\w$]+)/g)].forEach(m=>parm.add(m[1]));
const rif=new Set();
s.split('\n').forEach(r=>{const t=r.trim();if(!t||t.startsWith('//')||t.startsWith('*')||t.startsWith('/*'))return;
 [...r.matchAll(/[(,]\s*([a-zA-Z_$][\w$]*)\s*[,)]/g)].forEach(m=>rif.add(m[1]));});
const buchiChiamate=[...ch].filter(n=>!def.has(n)&&!ok.has(n));
const buchiRiferimenti=[...rif].filter(n=>!def.has(n)&&!ok.has(n)&&!parm.has(n)&&!ch.has(n));
console.log('BUCHI  in app/'+f+': '+(buchiChiamate.join(' ')||'ZERO'));
console.log('BUCHI-RIF (nomi passati senza parentesi): '+(buchiRiferimenti.join(' ')||'ZERO'));
// ⚠️ IL 2026-09-20 (passo ③) L'IIFE DI `index.html` E' SPARITO, E QUESTA
// RICERCA MORIVA INVECE DI DIRLO.
//
// Cercava `<script>\n(function () {`, ci faceva `[0]` sopra e con `null`
// alzava un `TypeError`: lo strumento **non partiva piu'**, su nessun file.
// *E' la ⓪-septies — un attrezzo che MUORE non e' un attrezzo che dice di no —
// ed e' la forma piu' cara, perche' chi lo lancia legge una pila di chiamate
// invece di un risultato.*
//
// Adesso l'assenza dell'IIFE e' una RISPOSTA, non un guasto: se in
// `index.html` non c'e' piu' codice, non ci possono essere orfani. La riga
// lo dice, cosi' chi la legge sa che la ricerca e' stata fatta e non saltata
// (regola 41: uno zero scritto e' una ricerca fatta).
const h=fs.readFileSync('index.html','utf8');
const m=(h.match(/<script>\n\(function \(\)[\s\S]*?\n<\/script>/)||[null])[0];
if (m === null) {
  console.log('ORFANI in index.html: NESSUNO POSSIBILE — index.html non ha piu\' un IIFE (passo ③, 2026-09-20)');
} else {
  new Function(m.replace(/^<script>\n/,'').replace(/\n<\/script>$/,''));
  const idef=new Set([...m.matchAll(/^  (?:function|var) (\w+)/gm)].map(x=>x[1]));
  const orf=[...def].filter(n=>!idef.has(n)&&m.split('\n').some(r=>{const t=r.trim();
    return t&&!t.startsWith('//')&&!t.startsWith('*')&&!t.startsWith('/*')&&new RegExp('(^|[^.\\w$])'+n+'\\b').test(r)}));
  console.log('ORFANI in index.html: '+(orf.join(' ')||'ZERO'));
}

// ⚠️ TERZA RICERCA, E NASCE DA UN GUASTO CHE LE PRIME DUE NON POTEVANO VEDERE
// (2026-09-20).
//
// La prima cerca `nome(` — una CHIAMATA. La seconda `(nome,` — un nome passato
// come RIFERIMENTO. Ne mancava una terza forma, ed e' quella di una COSTANTE:
//
//     STORY_CARDS_ANSWER_LABEL[s.corrente]
//
// Non e' una chiamata e non e' un argomento: e' una LETTURA. `app/mappa.js`
// leggeva quel nome mentre la riga che lo dichiara era rimasta nell'IIFE di
// `index.html` — due IIFE diversi — e il Pannello Admin moriva con
// `is not defined` appena un profilo aveva risposto una volta a
// un'autovalutazione. **Questo strumento diceva ZERO.**
//
// COME, e perche' non basta aggiungere un'altra espressione regolare: le prime
// due scartano i commenti guardando l'INIZIO della riga, quindi un commento in
// coda passa. Su una ricerca che raccoglie OGNI identificatore quel rumore
// sarebbe ingestibile, percio' qui si toglie prima il testo che non e' codice —
// commenti su piu' righe, commenti in coda, e le tre forme di stringa.
//
// ⚠️ LIMITE DICHIARATO, E VA LETTO PRIMA DI FIDARSI DELLO ZERO: resta del
// rumore che NON e' un buco. Le lettere delle espressioni regolari (`g`, `s`,
// `d`), i `$` dei template, le chiavi di un oggetto scritte su piu' righe, e i
// globali del browser non elencati qui sotto. **Per questo la terza ricerca sta
// in uno STRUMENTO e non in un test:** una riga rossa su codice buono si impara
// a ignorare, e da li' in poi non protegge piu' niente (regola 37). Si legge
// l'elenco e si guarda se c'e' un nome che sembra una costante o una funzione
// del progetto.
(function terzaRicerca() {
  const nudo = s
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n').map(function (r) { return r.replace(/\/\/.*$/, ''); }).join('\n')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
  const KEY = new Set('var function return if else for while do switch case break continue new typeof instanceof delete void in of this true false null undefined try catch finally throw let const class extends super yield await async default'.split(' '));
  const GLOB = new Set('window document console Math Object Array JSON Promise String Number Boolean localStorage sessionStorage setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame Date parseInt parseFloat isNaN Infinity Set Map WeakMap encodeURIComponent decodeURIComponent RegExp Error TypeError URLSearchParams fetch getComputedStyle Audio AudioContext webkitAudioContext SpeechSynthesisUtterance speechSynthesis navigator location history Element Node NodeList HTMLElement Intl arguments BI CONFIG'.split(' '));
  const dich = new Set();
  [...nudo.matchAll(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)/g)].forEach(function (m) { dich.add(m[1]); });
  [...nudo.matchAll(/\bfunction\s*([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)/g)].forEach(function (m) {
    if (m[1]) dich.add(m[1]);
    m[2].split(',').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (x) { dich.add(x); });
  });
  [...nudo.matchAll(/\bcatch\s*\(\s*([A-Za-z_$][\w$]*)/g)].forEach(function (m) { dich.add(m[1]); });
  const letti = new Set();
  [...nudo.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)/g)].forEach(function (m) {
    const n = m[1];
    if (KEY.has(n) || GLOB.has(n) || dich.has(n)) return;
    if (/^\s*:/.test(nudo.slice(m.index + n.length, m.index + n.length + 2))) return;
    letti.add(n);
  });
  console.log('BUCHI-LET (nomi LETTI e mai dichiarati qui): ' + ([...letti].join(' ') || 'ZERO'));
})();
