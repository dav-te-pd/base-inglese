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

// Le quattro domande comuni. `log` arriva da chi chiama, cosi' il conto delle
// asserzioni resta del file che le esegue (BASELINE-ASSERZIONI le conta per
// file, non in totale).
//
// opts.prima  — percorsi di tag che devono precedere questo (es. app/spazio.js)
// opts.dopo   — percorsi di tag che devono seguirlo (es. app/avvio.js)
function verificaStruttura(log, etichetta, file, opts) {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const nomi = nomiEsposti(file);
  const src = 'app/' + file[file.length - 1];

  const tag = html.match(new RegExp('<script[^>]*src="' + src.replace('/', '\\/') + '"[^>]*>'));
  log('[S] ' + etichetta + ': index.html lo carica con un tag suo', !!tag, 'tag non trovato');
  log('[S] ' + etichetta + ': ...BLOCCANTE, niente defer/async/type=module',
    !!tag && !/\b(defer|async|type\s*=)/.test(tag[0]), tag ? tag[0] : 'n/d');

  const pos = html.indexOf('src="' + src + '"');
  const ordineOk = (opts.prima || []).every(function (p) {
    const q = html.indexOf('src="' + p + '"'); return q !== -1 && q < pos;
  }) && (opts.dopo || []).every(function (p) {
    const q = html.indexOf('src="' + p + '"'); return q !== -1 && q > pos;
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

  const alias = nomi.filter(function (n) {
    return righe.some(function (r) { return new RegExp('^\\s*var ' + n + ' = BI\\.' + n + ';\\s*$').test(r); });
  });
  log('[S] ' + etichetta + ': e ognuno dei ' + nomi.length + ' nomi ha il suo alias',
    alias.length === nomi.length, alias.length + ' su ' + nomi.length);

  return nomi;
}

module.exports = { nomiEsposti: nomiEsposti, verificaStruttura: verificaStruttura };
