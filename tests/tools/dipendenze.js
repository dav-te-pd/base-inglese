// IL GRAFO VERO FRA I FILE DI `app/`: chi nomina cosa di chi, e QUANDO.
//
// ⚠️ PERCHE' ESISTE, e non e' una statistica. Fino al 2026-09-18 l'ordine dei
// tag `<script>` in index.html era un vincolo REALE e non dichiarato da
// nessuna parte: `app/avvio.js` legge `BI.THEME_KEY`, che e' di
// `app/identita.js`, e funziona solo perche' identita e' caricato prima. Chi
// riordinasse i tag non avrebbe modo di saperlo — nessun commento lo diceva, e
// nessun test lo verificava. **Da qui in poi ogni file lo DICHIARA in testa, e
// questo strumento confronta la dichiarazione col codice.**
//
// E' lo stesso passaggio gia' fatto tre volte in questo progetto: da
// «ricordarsene» a «lo dice il file» — la guardia di `hidden` (regola 12), i
// percorsi di `test-env.js` (regola 24), il divieto di alias sui nomi
// riassegnati. Una frase che descrive un comportamento cede; un confronto no.
//
// ⚠️ IL MOMENTO FA PARTE DELLA DICHIARAZIONE, e non e' un dettaglio:
// una dipendenza a tempo di PARSING obbliga l'ordine dei tag (il nome deve
// gia' esistere quando il file viene letto); una a tempo di CHIAMATA no —
// basta che esista quando l'utente tocca qualcosa. Dichiarare solo «dipende da
// X» perderebbe esattamente la differenza che rende l'ordine un vincolo.
//
// ⚠️ E LA MISURA SI E' SBAGLIATA TRE VOLTE PRIMA DI STARE IN PIEDI, quindi le
// tre correzioni stanno qui e non in un resoconto che sparisce:
//   ① fra file ci si parla attraverso `BI.nome`, che una ricerca sul nome
//      NUDO esclude apposta (il punto davanti). Cercando solo il nome nudo il
//      grafo usciva VUOTO — «nessuna dipendenza», che sembra un bel risultato.
//   ② `app/avvio.js` espone con `window.BI.x = x`, non con `BI.x = x`: la
//      riga che raccoglie i nomi esposti non lo vedeva, e la sua unica
//      dipendenza usciva come «file senza esposizioni».
//   ③ un `BI.nome` che nessun file di `app/` espone NON e' zero dipendenze:
//      e' una dipendenza verso `index.html`, cioe' ALL'INSU'. E' il caso di
//      `BI.applyEpisodeDialogue`, e va visto proprio perche' e' il verso che
//      la serie vuole eliminare.

const fs = require('fs');
const path = require('path');

// L'ordine dei tag in index.html e' l'ordine di caricamento: si legge da li',
// non si ricopia qui. Un elenco scritto a mano invecchierebbe al primo strato
// nuovo, in silenzio — che e' il difetto che questo file esiste per chiudere.
function ordineDiCaricamento(radice) {
  const html = fs.readFileSync(path.join(radice, 'index.html'), 'utf8');
  // ⚠️ IL `?v=` FA PARTE DELL'INDIRIZZO, NON DEL NOME. Dal 2026-09-19 i tag
  // portano una versione per impedire al browser di mescolare file vecchi e
  // nuovi: senza il gruppo opzionale qui sotto questa riga non trovava PIU'
  // NIENTE, e il grafo usciva vuoto — cioè 29 asserzioni che non partivano e
  // un TypeError, non un rosso che spiega.
  //
  // ⚠️ E la verifica per sottrazione di quel giro NON l'aveva trovata: cercava
  // `src="app` e qui c'è `src="app\/` con la barra ESCAPED. È la forma ⑥ della
  // regola 41 — il percorso che non esiste mai per intero — e l'unico modo di
  // prenderla è cercare il SEGMENTO, non la stringa.
  return [...html.matchAll(/<script[^>]*src="app\/([\w.-]+)(?:\?[^"]*)?"/g)].map(function (m) { return m[1]; });
}

function nomiEsposti(testo) {
  return [...testo.matchAll(/^\s*(?:window\.)?BI\.(\w+)\s*=\s*\1;\s*$/gm)].map(function (m) { return m[1]; });
}

// ⚠️ POSSEDERE NON E' ESPORRE, ed e' la quarta correzione di questa misura.
// `nomiEsposti` cerca la forma `BI.x = x;` — quella del ponte degli alias, che
// e' la domanda di tests/strati.js. Ma `app/spazio.js` scrive
// `BI.pulizie = []` e `BI.registraPulizia = function (fn) {...}`: possiede quei
// nomi senza esporli in quella forma. Chiedendo solo l'esposizione, spazio.js
// risultava DIPENDERE da index.html per sei nomi che sono suoi — cioe' la
// misura accusava il file che li possiede.
//
// Qui la domanda giusta e' «chi ASSEGNA questo nome», qualunque cosa ci metta.
function nomiPosseduti(testo) {
  return [...testo.matchAll(/^\s*(?:window\.)?BI\.(\w+)\s*=[^=]/gm)].map(function (m) { return m[1]; });
}

// Le righe di CODICE: un commento che cita `BI.applyEpisodeDialogue(data)` fra
// apici inversi non e' una dipendenza. E' la stessa famiglia che ha gia'
// prodotto nove falsi in questo progetto.
function righeDiCodice(testo) {
  return testo.split('\n').filter(function (r) {
    const s = r.trim();
    return s && !s.startsWith('//') && !s.startsWith('*') && !s.startsWith('/*');
  });
}

// Il grafo. Per ogni file: { file, espone, dipende: { <altroFile|index.html>:
// { parsing: [...], chiamata: [...] } } }
function grafo(radice) {
  const ordine = ordineDiCaricamento(radice);
  const testo = {}, espone = {}, proprietario = {};
  ordine.forEach(function (f) {
    testo[f] = fs.readFileSync(path.join(radice, 'app', f), 'utf8');
    espone[f] = nomiEsposti(testo[f]);
    nomiPosseduti(testo[f]).forEach(function (n) { proprietario[n] = f; });
  });

  return ordine.map(function (f) {
    const dipende = {};
    // ⚠️ LA PROFONDITA' SI CONTA DENTRO L'IIFE, NON DAL PRIMO CARATTERE — ed e'
    // la quinta correzione di questa misura, la piu' grave perche' non lasciava
    // un buco ne' un'accusa: rendeva una risposta IMPOSSIBILE.
    //
    // Ogni file di `app/` e' avvolto in `(function (BI) { ... })(window.BI);`.
    // Contando le graffe dall'inizio, la riga successiva alla prima e' gia' a
    // profondita' 1, quindi TUTTO risultava «a tempo di chiamata» e la risposta
    // «parsing» non poteva uscire mai — per nessun file, nemmeno sbagliando.
    // L'asserzione «nessuna dipendenza a tempo di parsing» di
    // test_dipendenze_dichiarate.js era **vera per costruzione**, che e'
    // esattamente il difetto della regola 37: non somigliava a un errore,
    // somigliava a un risultato.
    //
    // Trovata perche' `app/ui-condivisa.js` ha la PRIMA dipendenza vera a tempo
    // di parsing del progetto — quattro alias in cima all'IIFE — e la misura
    // continuava a chiamarla «chiamata».
    let profondita = -1;
    testo[f].split('\n').forEach(function (r) {
      const s = r.trim();
      const codice = s && !s.startsWith('//') && !s.startsWith('*') && !s.startsWith('/*');
      if (codice) {
        [...r.matchAll(/(?:window\.)?BI\.(\w+)\b/g)].forEach(function (m) {
          const n = m[1];
          // la propria esposizione non e' una dipendenza
          if (proprietario[n] === f) return;
          if (/^(?:window\.)?BI\.\w+\s*=\s*\w+;?\s*$/.test(s)) return;
          const dove = proprietario[n] || 'index.html';
          if (dove === f) return;
          const quando = profondita > 0 ? 'chiamata' : 'parsing';  // 0 = corpo dell'IIFE
          dipende[dove] = dipende[dove] || { parsing: [], chiamata: [] };
          if (dipende[dove][quando].indexOf(n) === -1) dipende[dove][quando].push(n);
        });
        profondita += (r.match(/\{/g) || []).length - (r.match(/\}/g) || []).length;
        if (profondita < -1) profondita = -1;
      }
    });
    return { file: f, posizione: ordine.indexOf(f), espone: espone[f], dipende: dipende };
  });
}

// La riga dichiarata in testa al file. Forma:
//   // DIPENDE DA: nessuno
//   // DIPENDE DA: identita.js [chiamata], index.html [chiamata]
function dichiarazione(radice, file) {
  const righe = fs.readFileSync(path.join(radice, 'app', file), 'utf8').split('\n');
  for (let i = 0; i < righe.length; i++) {
    const m = righe[i].match(/^\/\/ DIPENDE DA: (.+)$/);
    if (m) return m[1].trim();
  }
  return null;
}

// La riga che il codice MERITA, costruita dal grafo. Il test confronta questa
// con quella scritta: se differiscono, una delle due e' vecchia.
function dichiarazioneAttesa(nodo) {
  const chiavi = Object.keys(nodo.dipende).sort();
  if (!chiavi.length) return 'nessuno';
  return chiavi.map(function (k) {
    const d = nodo.dipende[k];
    const quando = d.parsing.length ? 'parsing' : 'chiamata';
    return k + ' [' + quando + ']';
  }).join(', ');
}

module.exports = {
  ordineDiCaricamento: ordineDiCaricamento,
  nomiEsposti: nomiEsposti,
  nomiPosseduti: nomiPosseduti,
  righeDiCodice: righeDiCodice,
  grafo: grafo,
  dichiarazione: dichiarazione,
  dichiarazioneAttesa: dichiarazioneAttesa
};

if (require.main === module) {
  const radice = path.resolve(__dirname, '..', '..');
  grafo(radice).forEach(function (n) {
    const attesa = dichiarazioneAttesa(n);
    const scritta = dichiarazione(radice, n.file);
    const ok = scritta === attesa;
    console.log((ok ? '  ✅ ' : '  ❌ ') + n.file.padEnd(16) + ' espone ' + String(n.espone.length).padStart(2));
    console.log('        codice:      ' + attesa);
    console.log('        dichiarato:  ' + (scritta === null ? '(nessuna riga DIPENDE DA)' : scritta));
    Object.keys(n.dipende).forEach(function (k) {
      const d = n.dipende[k];
      console.log('           ' + k + (d.parsing.length ? '  PARSING: ' + d.parsing.join(', ') : '') +
        (d.chiamata.length ? '  chiamata: ' + d.chiamata.join(', ') : ''));
    });
  });
}
