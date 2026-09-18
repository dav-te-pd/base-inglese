// LE DIPENDENZE IN AVANTI: quante funzioni che vivono DENTRO una
// regione-modulo sono chiamate da codice generico.
//
// ⚠️ E' la misura che ha trasformato «l'ordine dei file diventera' un vincolo»
// in «lo e' gia'»: 24 su 134, e di queste 17 sono davvero interne a un modulo.
// Sono i punti che al passo 23 diventeranno rossi tutti insieme.
//
// ⚠️ LIMITE: le regioni-modulo sono riconosciute risalendo al banner `/* === */
// piu' vicino sopra la funzione `apri`. E' un'euristica: sei pezzi condivisi
// (moduleNameHtml, renderSpiegazioneTitle, renderStars, pickRandom,
// withGradeName, moduleTypeLabel) cadono dentro una regione per POSIZIONE e
// non per mestiere. Il conto dei 17 e' al netto di quelli, a mano.
//
// Sola lettura. Uso: node tests/tools/misura-avanti.js
const fs=require('fs');
const src=fs.readFileSync('index.html','utf8').split('\n');
const pezzi=[];
src.forEach((r,i)=>{let m=r.match(/^  function (\w+)\s*\(/);
 if(m){let j=i+1;while(j<src.length&&!/^  \}/.test(src[j]))j++;pezzi.push({n:m[1],da:i,a:j});}});
const reg={};
src.forEach((r,i)=>{const m=r.match(/BI\.registraModulo\('(\w+)',\s*(\w+)\)/);if(m)(reg[m[2]]=reg[m[2]]||[]).push(i);});
const regioni=Object.keys(reg).map(a=>{const p=pezzi.find(x=>x.n===a);const fine=Math.max(...reg[a]);
 let inizio=p?p.da:fine; for(let k=(p?p.da:fine);k>0;k--){if(/^\s*\/\* =+/.test(src[k])){inizio=k;break;}}
 return {nome:a,da:inizio,a:fine};});
const dentro=i=>regioni.find(r=>i>=r.da&&i<=r.a);

const interne=pezzi.filter(p=>dentro(p.da));
console.log('funzioni dentro una regione-modulo: '+interne.length);
const nominateDaFuori=[];
interne.forEach(p=>{
  const chi=[];
  src.forEach((r,i)=>{
    if(dentro(i))return;
    const l=r.trim(); if(l.startsWith('//')||l.startsWith('*')||l.startsWith('/*'))return;
    if(new RegExp('(^|[^.\\w$])'+p.n+'\\s*\\(').test(r)) chi.push(i+1);
  });
  if(chi.length) nominateDaFuori.push({n:p.n,dove:dentro(p.da).nome,righe:chi});
});
console.log('\n=== NOMINATE DA FUORI DELLA PROPRIA REGIONE: '+nominateDaFuori.length+' ===');
nominateDaFuori.forEach(x=>console.log('  '+x.n.padEnd(30)+' (di '+x.dove+')  chiamata da riga '+x.righe.join(', ')));
