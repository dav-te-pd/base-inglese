// LA CHIUSURA DI UNO STRATO: parte da un nucleo e aggiunge finche' le
// dipendenze non sono tutte gia' fuori — oppure si ferma dichiarando i
// BLOCCANTI, cioe' i pezzi che nominano stato di sessione.
//
// ⚠️ IL VALORE E' IL CASO CHE NON CHIUDE. Un insieme che non chiude non e' un
// fallimento della misura: e' la misura che dice «questo confine non esiste
// ancora». `ui-condivisa` chiude a 24 pezzi; aggiungendo i due della scelta
// multipla resta a 26 con 2 bloccanti per otto giri — e quella e' la risposta,
// non un errore.
//
// Sola lettura. Uso: node tests/tools/misura-chiusura.js nome1 nome2 ...
// tutte gia' fuori (alias BI.*) o BLOCCANTI (nominano stato di sessione).
const {execSync}=require('child_process');
const fs=require('fs');
const idx=fs.readFileSync('index.html','utf8');
const giaFuori=new Set([...idx.matchAll(/^\s*var (\w+) = BI\.\w+;/gm)].map(m=>m[1]));

// stato di sessione: cio' che un modulo aperto tiene, non cio' che l'interfaccia disegna
const STATO=new Set(['currentEpisode','currentValues','pendingMastery','currentModule','currentUser']);

let nucleo=process.argv.slice(2);
const bloccanti={};
for(let giro=1;giro<=8;giro++){
  const out=execSync('node tests/tools/misura-strato.js '+nucleo.join(' '),{encoding:'utf8'});
  const dip=[...out.matchAll(/^\s+(var|function)\s+(\w+)\s+nominato da: (.+)$/gm)].map(m=>({t:m[1],n:m[2],chi:m[3]}));
  const nuovi=dip.filter(d=>!giaFuori.has(d.n)&&nucleo.indexOf(d.n)===-1);
  if(!nuovi.length){
    console.log(out.split('\n').filter(r=>/pezzi:|DIPENDENZE/.test(r)).join('\n'));
    console.log('\n=== CHIUSO al giro '+giro+' ===');
    console.log('NUCLEO ('+nucleo.length+'): '+nucleo.join(' '));
    console.log('\nDipendenze rimaste, tutte gia\' fuori:');
    dip.forEach(d=>console.log('   ✅ '+d.n));
    break;
  }
  // un nuovo e' BLOCCANTE se il suo corpo nomina stato di sessione
  const righe=idx.split('\n');
  nuovi.forEach(d=>{
    const i=righe.findIndex(r=>new RegExp('^  (function|var) '+d.n+'\\s*[({=]').test(r));
    let corpo='';
    for(let k=i;k<righe.length&&k<i+40;k++){corpo+=righe[k]+'\n';if(/^  \}/.test(righe[k])&&k>i)break;}
    const tocca=[...STATO].filter(s=>new RegExp('(^|[^.\\w])'+s+'\\b').test(corpo));
    if(tocca.length){bloccanti[d.n]={tocca,chi:d.chi};}
    else nucleo.push(d.n);
  });
  console.log('giro '+giro+': nucleo '+nucleo.length+', bloccanti '+Object.keys(bloccanti).length);
}
console.log('\n=== BLOCCANTI: nominano stato di sessione, NON escono ===');
Object.keys(bloccanti).forEach(n=>console.log('   ❌ '+n+'  → tocca '+bloccanti[n].tocca.join(', ')+'   (chiamato da '+bloccanti[n].chi+')'));
