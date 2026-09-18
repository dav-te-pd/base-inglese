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
// Uso: node tests/tools/buchi.js <nomefile.js>

const fs=require('fs');
const f=process.argv[2];
const s=fs.readFileSync('app/'+f,'utf8');
new Function(s);
const def=new Set([...s.matchAll(/^  (?:function|var) (\w+)/gm)].map(m=>m[1]));
const ok=new Set(['BI','CONFIG','window','document','console','Math','Object','Array','JSON','Promise','String','Number','localStorage','setTimeout','clearTimeout','setInterval','clearInterval','Date','parseInt','parseFloat','isNaN','Set','Map','encodeURIComponent','RegExp','Error','KeyboardEvent','if','for','while','switch','catch','return','typeof','function','new','else','do']);
const ch=new Set();
s.split('\n').forEach(r=>{const t=r.trim();if(!t||t.startsWith('//')||t.startsWith('*')||t.startsWith('/*'))return;
 [...r.matchAll(/(?:^|[^.\w$'"`])([a-zA-Z_$][\w$]*)\s*\(/g)].forEach(m=>ch.add(m[1]));});
console.log('BUCHI  in app/'+f+': '+([...ch].filter(n=>!def.has(n)&&!ok.has(n)).join(' ')||'ZERO'));
const h=fs.readFileSync('index.html','utf8');
const m=h.match(/<script>\n\(function \(\)[\s\S]*?\n<\/script>/)[0];
new Function(m.replace(/^<script>\n/,'').replace(/\n<\/script>$/,''));
const idef=new Set([...m.matchAll(/^  (?:function|var) (\w+)/gm)].map(x=>x[1]));
const orf=[...def].filter(n=>!idef.has(n)&&m.split('\n').some(r=>{const t=r.trim();
  return t&&!t.startsWith('//')&&!t.startsWith('*')&&!t.startsWith('/*')&&new RegExp('(^|[^.\\w$])'+n+'\\b').test(r)}));
console.log('ORFANI in index.html: '+(orf.join(' ')||'ZERO'));
