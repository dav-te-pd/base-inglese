// storyCards: una forma o due? Misuro quali funzioni servono MEET, quali WHY,
// quali tutte e due — guardando chi guarda il profilo.
const fs=require('fs');
const src=fs.readFileSync('index.html','utf8').split('\n');
const DA=6835, A=7401;
const regione=src.slice(DA,A+1);

// le funzioni della regione
const fn=[];
regione.forEach((r,i)=>{const m=r.match(/^  function (\w+)\s*\(/); if(m){
  let j=i+1; while(j<regione.length && !/^  \}/.test(regione[j])) j++;
  fn.push({n:m[1], da:i, a:j, corpo:regione.slice(i,j+1).join('\n')});
}});
console.log('funzioni nella regione: '+fn.length);

// come si distingue MEET da WHY?
const discriminanti=['storyProfile','meetTheStory','whyWeSayIt','profilo','kind'];
console.log('\n=== CHI GUARDA IL PROFILO (cioe\' si comporta in due modi) ===');
let biforcano=0;
fn.forEach(f=>{
  const righe=f.corpo.split('\n').filter(l=>{const s=l.trim();return s&&!s.startsWith('//')&&!s.startsWith('*')&&!s.startsWith('/*');});
  const hit=discriminanti.filter(d=>righe.some(l=>new RegExp('(^|[^.\\w])'+d+'\\b').test(l)));
  if(hit.length){biforcano++;console.log('  ⚠️ '+f.n.padEnd(38)+' guarda: '+hit.join(', '));}
});
console.log('  -> '+biforcano+' su '+fn.length+' biforcano; '+(fn.length-biforcano)+' fanno la stessa cosa per tutti e due');

// lo stato
console.log('\n=== LE VARIABILI DI STATO storyCards* ===');
const vars=new Set();
src.forEach(r=>{const m=r.match(/^  var (storyCards\w*|currentStoryCards\w*)\s*=/); if(m)vars.add(m[1]);});
[...vars].forEach(v=>{
  const dentro=regione.filter(r=>new RegExp('(^|[^.\\w])'+v+'\\b').test(r)).length;
  const fuori=src.filter((r,i)=>(i<DA||i>A)&&new RegExp('(^|[^.\\w])'+v+'\\b').test(r)).length;
  console.log('  '+v.padEnd(38)+' dentro '+String(dentro).padStart(3)+'   FUORI '+String(fuori).padStart(3));
});
