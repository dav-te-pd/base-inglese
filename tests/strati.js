// Le verifiche STRUTTURALI che ogni strato estratto ha in comune, scritte una
// volta sola.
//
// ⚠️ NASCE AL TERZO CASO, NON AL SECONDO, ED E' UNA SCELTA: con due file la
// forma comune era immaginata, con tre e' misurata. `app/avvio.js` (dentro
// test_config_estratto.js), `app/progressi.js` e `app/identita.js` fanno
// esattamente le stesse quattro domande, e le facevano con quattro copie che
// si sarebbero disallineate alla prima correzione — il modo in cui si
// disallineano e' che una impara qualcosa e le altre no.
//
// ⚠️ E QUELLO CHE NON STA QUI, perche' e' il valore vero di ogni file: **cosa
// si rompe se quel file non arriva**. Su `progressi` l'app parte e la mappa
// resta muta; su `identita` non parte niente. Sono guasti diversi, si
// guardano in modo diverso, e metterli in un aiutante comune vorrebbe dire
// scrivere la domanda piu' generica delle due — cioe' nessuna delle due.
//
// *Qui sta la parte che si ripete; la' la parte che non deve.*

const fs = require('fs');
const { repoPath, righeDiCodiceDi } = require('./test-env');

// I nomi che uno strato espone, letti DALLA FONTE: le righe `BI.x = x;` in
// fondo al file. Un nome aggiunto allo strato entra nel giro il giorno stesso,
// invece di aspettare che qualcuno aggiorni un elenco scritto in un test.
function nomiEsposti(percorsoRelativo) {
  const out = [];
  fs.readFileSync(repoPath.apply(null, percorsoRelativo), 'utf8').split('\n').forEach(function (r) {
    const m = r.match(/^\s*BI\.(\w+)\s*=\s*\1;\s*$/);
    if (m) out.push(m[1]);
  });
  return out;
}

// I nomi che lo strato RIASSEGNA — cioe' quelli a cui, dopo la dichiarazione,
// assegna un valore nuovo. Si misura sulle righe di CODICE, mai sul testo:
// un commento che cita `moduleInstructionsCache = data` non e' una
// riassegnazione (decima comparsa della famiglia, se dovesse capitare).
//
// ⚠️ SERVE PERCHE' UN NOME CHE CAMBIA NON SI PUO' ESPORRE. `BI.x = x` copia
// il valore del momento, e il ponte degli alias lo ricopia una seconda volta:
// chi legge da fuori vede per sempre il valore che quel nome aveva al
// caricamento del file — di solito `null`. Non e' un difetto dell'alias: e'
// quello che l'assegnamento fa. Un nome che cambia esce come FUNZIONE.
function nomiRiassegnati(percorsoRelativo) {
  const out = [];
  righeDiCodiceDi.apply(null, percorsoRelativo).forEach(function (r) {
    const m = r.match(/(?:^|[^.\w$])([A-Za-z_$][\w$]*)\s*=(?!=|>)/);
    if (!m) return;
    if (new RegExp('\\b(var|let|const|function)\\s+' + m[1] + '\\b').test(r)) return;
    if (out.indexOf(m[1]) === -1) out.push(m[1]);
  });
  return out;
}

// Le quattro domande comuni. `log` arriva da chi chiama, cosi' il conto delle
// asserzioni resta del file che le esegue (BASELINE-ASSERZIONI le conta per
// file, non in totale).
//
// opts.prima  — percorsi di tag che devono precedere questo (es. app/spazio.js)
// opts.dopo   — percorsi di tag che devono seguirlo (es. app/avvio.js)
// ⚠️ LA POSIZIONE DI UN TAG SI CERCA SENZA LA VIRGOLETTA FINALE, e dal
// 2026-09-19 è obbligatorio: i quattordici tag portano `?v=<versione>` per
// impedire al browser di mescolare file vecchi e nuovi, quindi `src="app/x.js"`
// non esiste più in `index.html`. Cercare la stringa chiusa dava -1 su tutti e
// quattordici — cioè sei file di strato rossi per una ragione che non c'entra
// niente con gli strati.
//
// Sta qui e non ricopiata in otto test: è la stessa domanda («dove sta il tag di
// questo file?») e la versione cambierà ancora.
function posizioneTag(html, src) {
  return html.indexOf('src="' + src + '"') !== -1
    ? html.indexOf('src="' + src + '"')
    : html.indexOf('src="' + src + '?');
}

function verificaStruttura(log, etichetta, file, opts) {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const nomi = nomiEsposti(file);
  const src = 'app/' + file[file.length - 1];

  const tag = html.match(new RegExp('<script[^>]*src="' + src.replace('/', '\\/') + '(\\?[^"]*)?"[^>]*>'));
  log('[S] ' + etichetta + ': index.html lo carica con un tag suo', !!tag, 'tag non trovato');
  log('[S] ' + etichetta + ': ...BLOCCANTE, niente defer/async/type=module',
    !!tag && !/\b(defer|async|type\s*=)/.test(tag[0]), tag ? tag[0] : 'n/d');

  const pos = posizioneTag(html, src);
  const ordineOk = (opts.prima || []).every(function (p) {
    const q = posizioneTag(html, p); return q !== -1 && q < pos;
  }) && (opts.dopo || []).every(function (p) {
    const q = posizioneTag(html, p); return q !== -1 && q > pos;
  });
  log('[S] ' + etichetta + ': arriva dopo [' + (opts.prima || []).join(' ') + '] e prima di [' +
    (opts.dopo || []).join(' ') + ']', ordineOk, 'posizione ' + pos);

  // ⚠️ IL DIVIETO DI RITORNO. Senza, rimettere una funzione dentro index.html
  // passerebbe verde: il tag ci sarebbe ancora, l'ordine pure, e due
  // definizioni dello stesso nome non danno nessun errore — vince quella
  // dell'IIFE, e il file estratto diventa un doppione che nessuno chiama.
  const righe = righeDiCodiceDi('index.html');
  const tornate = nomi.filter(function (n) {
    return righe.some(function (r) {
      return new RegExp('^\\s*(function|var) ' + n + '\\s*[({=]').test(r) &&
        !new RegExp('^\\s*var ' + n + ' = BI\\.').test(r);
    });
  });
  log('[S] ' + etichetta + ': niente di estratto e\' tornato dentro index.html',
    tornate.length === 0, tornate.join(', '));

  // ⚠️ IL DIVIETO CHE MANCAVA, e che questa riga ha imparato da un rosso.
  //
  // Fino al 2026-09-18 qui c'era solo la domanda che segue — «ogni nome
  // esposto ha il suo alias» — e quella domanda e' FALSA per una classe
  // intera di nomi: quelli che lo strato riassegna. `app/dati.js` ne ha
  // esposti tre (`moduleInstructionsCache` e due sorelle), l'alias ne ha
  // congelato il `null` iniziale, e `uiText()` ha restituito stringa vuota
  // per ogni testo dell'interfaccia: sette file rossi. La riga di prima non
  // poteva vederlo — chiedeva che l'alias ci FOSSE, cioe' esattamente la
  // cosa sbagliata da fare.
  //
  // Nove strati sono passati senza toccarla perche' nessuno aveva ancora
  // esposto una variabile che cambia: un confine sbagliato che non produce
  // nessun rosso e' quello che si eredita.
  const esposti = nomiRiassegnati(file).filter(function (n) { return nomi.indexOf(n) !== -1; });
  log('[S] ' + etichetta + ': nessun nome esposto viene RIASSEGNATO dentro lo strato',
    esposti.length === 0, esposti.join(', ') + ' — un nome che cambia esce come funzione, non come valore');

  // ⚠️ QUESTA RIGA CHIEDEVA IL PONTE DEGLI ALIAS, E IL PONTE NON C'E' PIU'
  // (passo ③, 2026-09-20). E' una rossa per una DECISIONE, seguita invece che
  // tolta — settima comparsa della ⓪-undecies.
  //
  // Chiedeva che `index.html` avesse `var nome = BI.nome;` per OGNI nome
  // esposto dallo strato. Quella domanda aveva senso finche' dentro
  // `index.html` c'era del codice che quei nomi li usava **nudi**: l'alias era
  // la prova che il nome fosse arrivato fin li'. Da oggi in `index.html` c'e'
  // una riga sola, `window.BI.boot()`, e di alias non ce n'e' piu' nessuno —
  // quindi la riga di prima sarebbe **rossa per tutti e nove gli strati, per
  // sempre**, su codice giusto.
  //
  // ⚠️ E LA DOMANDA NON SI E' PERSA, E' CAMBIATA DI POSTO: l'invariante vero
  // non era «esiste l'alias», era **«il nome esposto e' davvero raggiungibile
  // da chi lo usa»**. Adesso chi lo usa e' un altro file di `app/`, e a
  // guardarlo c'e' gia' `tests/test_dipendenze_dichiarate.js`, che misura il
  // grafo e lo confronta con la riga `DIPENDE DA` di ogni file — una verifica
  // piu' forte di questa, perche' distingue anche il MOMENTO.
  //
  // Resta qui la meta' che quel file non guarda: **un nome esposto e che
  // nessuno legge e' esposizione morta.** Non e' un errore — un pezzo puo'
  // nascere prima del suo primo utente (e' successo con `app/spazio.js`, per
  // scelta scritta) — ma va VISTO, perche' altrimenti il conto dei nomi
  // esposti sale e basta.
  const sorgenti = fs.readdirSync(repoPath('app'))
    .filter(function (f) { return /\.js$/.test(f) && f !== file; })
    .map(function (f) { return fs.readFileSync(repoPath('app', f), 'utf8'); })
    .concat([fs.readFileSync(repoPath('index.html'), 'utf8')]);
  const senzaLettori = nomi.filter(function (n) {
    return !sorgenti.some(function (src) {
      return new RegExp('BI\\.' + n + '\\b').test(src) || new RegExp('\\bvar ' + n + ' = BI\\.' + n + ';').test(src);
    });
  });
  log('[S] ' + etichetta + ': ognuno dei ' + nomi.length + ' nomi esposti ha almeno un lettore',
    senzaLettori.length === 0, 'senza lettori: ' + (senzaLettori.join(', ') || 'nessuno'));

  return nomi;
}

module.exports = { nomiEsposti: nomiEsposti, nomiRiassegnati: nomiRiassegnati, verificaStruttura: verificaStruttura, posizioneTag: posizioneTag };
