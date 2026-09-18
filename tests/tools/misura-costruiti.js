// I LEGAMI COSTRUITI A RUNTIME: una stringa che punta a qualcosa (chiave di
// magazzino, id del DOM, percorso, selettore) e che NON esiste mai per intero
// nel sorgente, perche' viene concatenata.
const fs=require('fs');
const files=['index.html',...fs.readdirSync('app').map(f=>'app/'+f)];
const famiglie={
  'chiave localStorage':/(?:getItem|setItem|removeItem)\(\s*[^)'"]*?['"][^'"]*['"]\s*\+/,
  'chiave via funzione':/(?:getItem|setItem|removeItem)\(\s*\w+\(/,
  'id del DOM':/getElementById\(\s*(?:['"][^'"]*['"]\s*\+|\w+\s*\+|`)/,
  'selettore':/querySelector(?:All)?\(\s*(?:['"][^'"]*['"]\s*\+|`)/,
  'percorso di fetch':/fetch\(\s*(?:['"][^'"]*['"]\s*\+|`)/,
  'percorso da funzione':/fetch\(\s*\w+\(/,
};
const out={};
files.forEach(f=>{
  fs.readFileSync(f,'utf8').split('\n').forEach((r,i)=>{
    const s=r.trim();
    if(!s||s.startsWith('//')||s.startsWith('*')||s.startsWith('/*'))return;
    Object.keys(famiglie).forEach(k=>{
      if(famiglie[k].test(r)){(out[k]=out[k]||[]).push(f+':'+(i+1)+'  '+s.slice(0,95));}
    });
  });
});
let tot=0;
Object.keys(famiglie).forEach(k=>{
  const v=out[k]||[];tot+=v.length;
  console.log('\n── '+k+': '+v.length+' ──');
  v.slice(0,8).forEach(r=>console.log('   '+r));
  if(v.length>8)console.log('   ... e altri '+(v.length-8));
});
console.log('\n=== TOTALE LEGAMI COSTRUITI: '+tot+' ===');
