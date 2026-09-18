// DAI CHIAMANTI, non dal prefisso: quali pezzi di index.html sono nominati da
// PIU' regioni-modulo, e da quante.
//
// ⚠️ ESISTE PERCHE' IL PREFISSO HA MENTITO DUE VOLTE SU DUE. Cercare `ui*` o
// `render*` trova cio' che qualcuno ha gia' chiamato cosi'; questa misura trova
// cio' che e' condiviso DI FATTO. I 24 pezzi di `ui-condivisa` non hanno un
// prefisso comune, e sei di loro stanno fisicamente in mezzo a un modulo.
//
// Sola lettura. Uso: node tests/tools/misura-chiamanti.js
const fs=require('fs');
const src=fs.readFileSync('index.html','utf8').split('\n');

// 1. i pezzi di primo livello (2 spazi di indentazione)
const pezzi=[];
src.forEach((r,i)=>{
  let m=r.match(/^  function (\w+)\s*\(/);
  if(m){let j=i+1;while(j<src.length&&!/^  \}/.test(src[j]))j++;pezzi.push({n:m[1],t:'f',da:i,a:j});return;}
  m=r.match(/^  var (\w+)\s*=/);
  if(m)pezzi.push({n:m[1],t:'v',da:i,a:i});
});

// 2. le regioni-modulo: da registraModulo risalgo alla funzione apri, e prendo
//    l'intervallo fra la fine del pezzo precedente e la registrazione.
const reg={};
src.forEach((r,i)=>{const m=r.match(/BI\.registraModulo\('(\w+)',\s*(\w+)\)/);if(m){(reg[m[2]]=reg[m[2]]||[]).push({kind:m[1],riga:i});}});
const apri=Object.keys(reg);

// la regione di un modulo = da dove comincia la sua apri fino alla sua registrazione
const regioni=apri.map(a=>{
  const p=pezzi.find(x=>x.n===a);
  const fine=Math.max(...reg[a].map(x=>x.riga));
  // risalgo: cerco il banner /* ===== */ piu' vicino sopra p.da
  let inizio=p?p.da:fine;
  for(let k=(p?p.da:fine);k>0;k--){ if(/^\s*\/\* =+/.test(src[k])){inizio=k;break;} }
  return {nome:a,kinds:reg[a].map(x=>x.kind),da:inizio,a:fine};
}).sort((x,y)=>x.da-y.da);

console.log('=== LE REGIONI-MODULO ===');
regioni.forEach(r=>console.log('  '+r.nome.padEnd(20)+' righe '+r.da+'-'+r.a+'  ('+(r.a-r.da)+')  kind: '+r.kinds.join(', ')));

// 3. per ogni pezzo NON dentro una regione: da quante regioni distinte e' nominato
function dentroRegione(i){return regioni.find(r=>i>=r.da&&i<=r.a);}
const fuori=pezzi.filter(p=>!dentroRegione(p.da));
console.log('\n=== PEZZI FUORI DA OGNI REGIONE-MODULO: '+fuori.length+' ===');

const conteggio=fuori.map(p=>{
  const usanti=new Set();
  regioni.forEach(r=>{
    for(let i=r.da;i<=r.a;i++){
      const l=src[i].trim();
      if(l.startsWith('//')||l.startsWith('*')||l.startsWith('/*'))continue;
      if(new RegExp('(^|[^.\\w$])'+p.n+'\\b').test(src[i])){usanti.add(r.nome);break;}
    }
  });
  return {n:p.n,t:p.t,q:usanti.size,chi:[...usanti]};
}).filter(x=>x.q>0).sort((a,b)=>b.q-a.q);

console.log('\n=== CHIAMATI DA 3+ REGIONI-MODULO (i candidati veri) ===');
conteggio.filter(x=>x.q>=3).forEach(x=>console.log('  '+String(x.q).padStart(2)+'  '+x.t+' '+x.n));
console.log('\n=== da 2 regioni ===');
console.log('  '+conteggio.filter(x=>x.q===2).map(x=>x.n).join(', '));
console.log('\n=== da 1 sola regione (NON condivisi) === '+conteggio.filter(x=>x.q===1).length);
