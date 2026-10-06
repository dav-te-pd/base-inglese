// PROTEGGE: che i JSON che l'app carica siano ESATTAMENTE quello che i loro
// markdown generano, e che i 32 titoli che non sono piu' scritti da nessuna
// parte SI SAPPIANO DERIVARE — tutti e trentadue, per ogni chiave.
//
// COSA SI PERDE SENZA QUESTO FILE, e sono due cose diverse:
//
// ① **La fonte smette di essere la fonte, in silenzio.** Il markdown e' la
//    fonte e il JSON l'esecuzione (regola 26). Una modifica fatta a mano nel
//    JSON non rompe niente: il file resta valido, l'app mostra il testo nuovo,
//    e il markdown continua a descrivere quello vecchio. **Il prossimo giro
//    del trascrittore la cancella senza dirlo.** *E' successo davvero, con la
//    chiave `episodiSpenti`: nata a mano nel JSON il 2026-09-26, mai insegnata
//    al trascrittore, sarebbe sparita alla prima corsa.*
//
// ② **Una derivazione che non risolve NON si vede.** Dal 2026-09-28 i sedici
//    `howItWorks.title` e i sedici `helpReminder.title` non stanno piu' nel
//    file dei testi: il primo viene dal nome del PASSO
//    (`CONFIG.moduleLabels[...].name`), il secondo da `aiuto.titleInstructions`.
//    Se una chiave non ha ne' l'uno ne' l'altro, il pop-up si apre **col
//    titolo vuoto** — nessuna eccezione, nessun rosso, solo una schermata
//    senza nome.
//
// COME MISURA, e perche' non con un numero scritto qui: i conti si ottengono
// **rigenerando** dai markdown con le funzioni di `tests/tools/trascrivi.js`.
// Un «176» scritto in questo file sarebbe da aggiornare a ogni testo nuovo, e
// chi lo aggiorna guarda il numero, non il contenuto — cioe' la forma della
// regola 29 al contrario. *Qui non c'e' nessun numero atteso: c'e' un
// confronto.*
//
// ③ **Dal 2026-09-30 ([E]): un titolo scritto due volte in un markdown di
//    contenuto.** Il trascrittore trova la PRIMA occorrenza, e se e' una
//    citazione nella prosa legge la tabella sbagliata senza fermarsi — e' cosi'
//    che un corso e' uscito senza sequenze. Si guarda OGNI titolo `##`/`###`,
//    non solo quelli che il trascrittore cerca oggi. **Visto fallire sul file
//    rotto (la versione `b` della struttura inglese): due rossi col nome del
//    titolo e la riga, uscita 1.**
//
// ④ **Dal 2026-10-06 ([F]): due tabelle in una sezione di un file EPISODIO.**
//    Il trascrittore leggeva la prima e la seconda spariva; con le stesse
//    colonne e una riga vuota in mezzo si fondevano. Trovato da
//    `controllo-bacino.py` di chi guida il progetto. **Visto fallire con la
//    guardia spenta: tre rossi su tre**; e su `spagnolo-it-gate.md` con una
//    tabella in piu' nel grado C il trascrittore esce con 1.
//
// COSA NON PROTEGGE, dichiarato (regola 32): non dice se un TESTO e' buono.
// Un markdown con una frase sbagliata dentro produce un JSON con la stessa
// frase sbagliata, e questo file e' verde. Qui si guarda che le due copie
// siano la stessa cosa, non che la cosa sia giusta.

const fs = require('fs');
const T = require('./tools/trascrivi.js');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const letto = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const testo = (o) => JSON.stringify(o, null, 2) + '\n';

// Quante stringhe c'e' dentro, a qualunque profondita'. Serve solo a STAMPARE
// un numero nel nome dell'asserzione: il confronto non lo usa.
function quanteStringhe(o) {
  if (typeof o === 'string') return 1;
  if (Array.isArray(o)) return o.reduce((n, v) => n + quanteStringhe(v), 0);
  if (o && typeof o === 'object') return Object.keys(o).reduce((n, k) => n + quanteStringhe(o[k]), 0);
  return 0;
}

// ── [E] OGNI TITOLO DI OGNI FILE DI CONTENUTO COMPARE UNA VOLTA SOLA ─────
//
// ⚠️ STA IN TESTA, PRIMA DI [A], ED E' VOLUTO: sul file rotto il trascrittore
// alza un'eccezione, e se [B] girasse prima il rosso arriverebbe senza
// nominare il titolo doppio.
//
// Proposto da chi guida il progetto il 2026-09-30, con uno script suo
// (`controllo-titoli.py`) visto cadere sul file rotto e passare su quello
// riparato. **La guardia di [D] non basta, per due ragioni:** guarda solo i
// titoli che il trascrittore CERCA oggi — una sezione che imparera' a leggere
// domani (la §9 della struttura) oggi non e' protetta — e si accorge del
// difetto solo quando il trascrittore gira. Questo guarda TUTTI i titoli, `##`
// e `###` (anche i gradi e le tabelle si cercano cosi'), in tutti i markdown
// sotto `docs/` che il trascrittore legge.
//
// ⚠️ SI CONTA OVUNQUE, NON A INIZIO RIGA: `indexOf` non sa cosa sia una riga,
// e l'occorrenza colpevole del 30 settembre stava dentro una cella di tabella.
// *La prova che la §1 proponeva — `grep -c '^## 2'` — non l'avrebbe vista.*
{
  const path = require('path');
  const radice = path.join(__dirname, '..', 'docs');
  const files = [];
  T.edizioni().forEach(function (ed) {
    const dir = path.join(radice, ed.lingua, ed.studente);
    fs.readdirSync(dir).filter(function (f) { return f.endsWith('.md'); })
      .forEach(function (f) { files.push(path.join(dir, f)); });
  });
  T.studentiCondivisi().forEach(function (st) {
    const dir = path.join(radice, 'condivisi', st);
    fs.readdirSync(dir).filter(function (f) { return f.endsWith('.md'); })
      .forEach(function (f) { files.push(path.join(dir, f)); });
  });
  // Regola 49: zero file non e' un verde.
  log('[E] Ci sono markdown di contenuto da controllare', files.length > 0, 'trovati: ' + files.length);
  files.forEach(function (f) {
    const t = fs.readFileSync(f, 'utf8');
    const titoli = Array.from(new Set(t.match(/^#{2,3} [^\n]+$/gm) || []));
    const doppi = titoli.filter(function (tit) { return t.split(tit).length - 1 !== 1; })
      .map(function (tit) {
        const righe = t.split('\n').map(function (r, i) { return r.indexOf(tit) !== -1 && r.trim() !== tit ? i + 1 : 0; })
          .filter(Boolean);
        return '«' + tit + '» di troppo alle righe ' + righe.join(', ');
      });
    log('[E] ' + path.relative(radice, f) + ': ogni titolo compare una volta sola (' + titoli.length + ' titoli)',
      doppi.length === 0, doppi.join(' | '));
  });
}

// ── [A] IL GIRO DI ANDATA E RITORNO ─────────────────────────────────────
//
// Si rigenera dal markdown e si confronta col file sul disco, carattere per
// carattere — la stessa `JSON.stringify(o, null, 2)` che il trascrittore
// scrive, quindi una differenza qui e' una differenza vera e non di
// formattazione.
{
  const studenti = T.studentiCondivisi();
  // ⚠️ ZERO CARTELLE NON E' UN VERDE (regola 49): senza questa riga il ciclo
  // qui sotto non girerebbe e il file direbbe «tutto bene» avendo confrontato
  // niente. *E' esattamente la forma che ha tenuto cieco il guardiano del
  // conteggio per due giorni.*
  log('[A] C\'e\' almeno una cartella sotto docs/condivisi/ (il test non sta guardando il vuoto)',
    studenti.length > 0, 'trovate: ' + studenti.length);

  studenti.forEach(function (st) {
    [['istruzioni-moduli', T.istruzioni], ['messaggi-feedback', T.messaggi]].forEach(function (c) {
      const dalMarkdown = c[1](st);
      const sulDisco = letto(T.datiC(st, c[0]));
      const n = quanteStringhe(dalMarkdown);
      const ok = testo(dalMarkdown) === testo(sulDisco);
      if (!ok) {
        const a = JSON.stringify(dalMarkdown), b = JSON.stringify(sulDisco);
        let i = 0; while (i < a.length && a[i] === b[i]) i++;
        console.log('    prima differenza al carattere ' + i);
        console.log('      markdown: ...' + a.slice(Math.max(0, i - 60), i + 60));
        console.log('      disco:    ...' + b.slice(Math.max(0, i - 60), i + 60));
      }
      log('[A] ' + st + '-' + c[0] + '.json e\' esattamente quello che il suo markdown genera (' +
        n + ' stringhe, contate rigenerando)', ok);
    });
  });
}

// ── [B] LE EDIZIONI, GLI EPISODI COMPRESI ───────────────────────────────
{
  const edizioni = T.edizioni();
  log('[B] C\'e\' almeno un\'edizione sotto docs/ (il test non sta guardando il vuoto)',
    edizioni.length > 0, 'trovate: ' + edizioni.length);

  edizioni.forEach(function (ed) {
    const nome = ed.lingua + '/' + ed.studente;
    // Un markdown che il trascrittore rifiuta (un titolo doppio, una tabella
    // vuota) diventa un rosso CON IL NOME, non un'eccezione che uccide il file.
    let s;
    try { s = T.struttura(ed); } catch (e) {
      log('[B] ' + nome + ': il trascrittore legge la struttura', false, e.message);
      return;
    }

    // La struttura si confronta sui pezzi che il markdown porta: il resto
    // (`episodeSequences`, `episodiSpenti`, ...) lo assembla `main()`, che
    // qui non gira.
    const sulDisco = letto(T.dati(ed, 'struttura-corso'));
    ['grades', 'gradeNames', 'moduleTypes', 'moduleLabels', 'sequences', 'episodes', 'speech', 'nomiASchermo']
      .forEach(function (chiave) {
        log('[B] ' + nome + ': `' + chiave + '` combacia col markdown',
          testo(s[chiave]) === testo(sulDisco[chiave]));
      });

    log('[B] ' + nome + ': le tabelle di personalizzazione combaciano col markdown',
      testo(T.tabelle(ed)) === testo(letto(T.dati(ed, 'tabelle-personalizzazione'))));

    const ids = Object.keys(s.episodes);
    log('[B] ' + nome + ': la struttura dichiara degli episodi', ids.length > 0, 'trovati: ' + ids.length);
    ids.forEach(function (id) {
      log('[B] ' + nome + ': l\'episodio `' + id + '` combacia col suo markdown',
        testo(T.episodio(ed, id, s.gradeNames).json) === testo(letto(T.dati(ed, id))));
    });
  });
}

// ── [C] I 32 TITOLI: NON CI SONO PIU', E SI SANNO DERIVARE ──────────────
//
// ⚠️ SONO DUE ASSERZIONI E NON UNA, ED E' IL PUNTO DI QUESTO BLOCCO.
// «Non ci sono» e «si sanno ritrovare» falliscono in modi opposti: la prima
// becca un titolo tornato a mano nel file condiviso (il difetto di partenza —
// un corso di spagnolo con sedici pop-up «Your Story»), la seconda becca una
// chiave che dopo la derivazione **non ha piu' nessun nome**.
{
  const studenti = T.studentiCondivisi();
  studenti.forEach(function (st) {
    const testi = letto(T.datiC(st, 'istruzioni-moduli'));
    const conTitolo = [];
    Object.keys(testi).forEach(function (kind) {
      ['howItWorks', 'helpReminder'].forEach(function (campo) {
        if (testi[kind] && testi[kind][campo] && testi[kind][campo].title !== undefined) {
          conTitolo.push(kind + '.' + campo + '.title');
        }
      });
    });
    log('[C] ' + st + ': nessun titolo e\' scritto nel file condiviso — si derivano tutti',
      conTitolo.length === 0, conTitolo.join(', '));

    log('[C] ' + st + ': `aiuto.titleInstructions` c\'e\', ed e\' il titolo di TUTTI i promemoria',
      !!(testi.aiuto && testi.aiuto.titleInstructions), JSON.stringify(testi.aiuto && testi.aiuto.titleInstructions));

    // ⚠️ IL CASO PIU' DIVERSO E' NOMINATO, NON CERCATO A CASO (regola 42):
    // **`flashcard` e' l'unico kind che ha DUE passi** — `flashcardAEngIta` e
    // `flashcardAItaEng` — quindi l'unico su cui `moduleLabels[kind]` non
    // esiste mentre i suoi passi esistono. *Un test che avesse guidato
    // `repeatAloud` sarebbe stato verde e avrebbe lasciato passare un pop-up
    // senza titolo.* E le due schermate sono il caso opposto: nessun passo,
    // quindi il nome viene dal loro `pageTitle`.
    const edizioni = T.edizioni();
    edizioni.forEach(function (ed) {
      const labels = T.struttura(ed).moduleLabels;
      // Da kind a id dei passi: un kind puo' averne piu' d'uno, e l'id del
      // passo e' quello che `moduleLabels` conosce.
      const passiDiKind = {};
      Object.keys(labels).forEach(function (id) {
        const kind = id.replace(/^flashcardA(EngIta|ItaEng)$/, 'flashcard');
        (passiDiKind[kind] = passiDiKind[kind] || []).push(id);
      });
      const senzaNome = Object.keys(testi).filter(function (kind) {
        if (!testi[kind] || !testi[kind].howItWorks) return false;   // non e' una schermata ne' un modulo
        const passi = passiDiKind[kind];
        if (passi && passi.every(function (id) { return labels[id] && labels[id].name; })) return false;
        return !testi[kind].pageTitle;
      });
      log('[C] ' + st + ' su ' + ed.lingua + '/' + ed.studente +
        ': ogni chiave con una spiegazione sa da dove prendere il proprio titolo',
        senzaNome.length === 0, senzaNome.join(', '));

      const fc = passiDiKind.flashcard || [];
      log('[C] ' + ed.lingua + '/' + ed.studente +
        ': il caso piu\' diverso — `flashcard`, l\'unico kind con DUE passi — li ha entrambi con un nome',
        fc.length === 2 && fc.every(function (id) { return labels[id] && labels[id].name; }),
        JSON.stringify(fc.map(function (id) { return labels[id] && labels[id].name; })));
    });
  });
}

// ── [D] IL TRASCRITTORE SI FERMA INVECE DI SCRIVERE UN VUOTO — 2026-09-30 ──
//
// Il caso vero: una tabella nella §1 di `struttura-corso.md` citava per
// intero `## 5 — LE SEQUENZE DEI MODULI`, e il trascrittore ha scritto
// `sequences: {}` senza fermarsi. **[B] qui sopra sarebbe rimasto verde:**
// rigenera con lo stesso metodo, quindi confronterebbe vuoto con vuoto. Per
// questo le due guardie si provano su un testo costruito apposta.
{
  const sollevato = function (f) { try { f(); return null; } catch (e) { return e.message; } };
  const titolo = '## 5 — LE SEQUENZE DEI MODULI';
  const citato = '## 1 — X\n\n| a | b |\n|---|---|\n| cita | `' + titolo + '` |\n\n' +
    titolo + '\n\n| s | m | g |\n|---|---|---|\n| narr | repeatAloud | A |\n';
  const msg1 = sollevato(function () { T.tabellaSotto(citato, titolo, true); });
  log('[D] Un titolo cercato che compare DUE volte ferma il trascrittore, e dice le righe',
    !!msg1 && /piu' di una volta/.test(msg1) && /righe 5 e 7/.test(msg1), String(msg1));

  const vuota = titolo + '\n\n| s | m | g |\n|---|---|---|\n\nprosa\n';
  const msg2 = sollevato(function () { T.tabellaSotto(vuota, titolo, true); });
  log('[D] Una tabella obbligatoria SENZA righe ferma il trascrittore', !!msg2 && /senza righe/.test(msg2), String(msg2));
  log('[D] ...e una facoltativa senza righe no: dà una lista vuota',
    sollevato(function () { T.tabellaSotto(vuota, titolo, false); }) === null);

  // ⚠️ IL GRASSETTO DELLA REGOLA GENERALE DIVENTA HTML. Si prende il markdown
  // VERO di un episodio e gli si mette un grassetto nella regola: cosi' il
  // resto del file resta quello che il trascrittore sa leggere, e cambia solo
  // la cella che si vuole misurare.
  const ed = T.edizioni()[0];
  const s = T.struttura(ed);
  const id = Object.keys(s.episodes)[0];
  const percorso = T.doc(ed, id);
  const vero = fs.readFileSync(percorso, 'utf8');
  const i3 = vero.indexOf('## 3 — LA REGOLA GENERALE');
  const riga = vero.slice(i3).split('\n').find(function (r) { return /^\|/.test(r) && !/^\|\s*-/.test(r) && !/Testo/.test(r); });
  const orig = fs.readFileSync;
  let json = null;
  if (riga) {
    const finto = vero.replace(riga, '| La voce cade su **dí**-as. |');
    fs.readFileSync = function (p) { return String(p) === percorso ? finto : orig.apply(fs, arguments); };
    try { json = T.episodio(ed, id, s.gradeNames).json; } finally { fs.readFileSync = orig; }
  }
  log('[D] Il grassetto della regola generale diventa <strong>, non asterischi a schermo',
    !!json && json.generalRule === 'La voce cade su <strong>dí</strong>-as.', json && json.generalRule);

  // ⚠️ UN SUFFISSO CHE NON E' UN RUOLO FERMA IL TRASCRITTORE (2026-09-30,
  // chiesto da chi guida il progetto). Nell'app non fallirebbe: resterebbe a
  // schermo. Si prende lo stesso markdown vero e si guasta UN suffisso in un
  // segnaposto che c'e' gia'. Il caso piu' diverso (regola 42) e' `:es`, la
  // forma che il file spagnolo aveva davvero la mattina di quel giorno.
  const conSuffisso = vero.match(/\{\{\w+(?:\.\w+)?:(target|native)\}\}/);
  let msgSuffisso = null;
  if (conSuffisso) {
    const guasto = vero.replace(conSuffisso[0], conSuffisso[0].replace(/:(target|native)\}\}$/, ':es}}'));
    fs.readFileSync = function (p) { return String(p) === percorso ? guasto : orig.apply(fs, arguments); };
    try { T.episodio(ed, id, s.gradeNames); } catch (e) { msgSuffisso = e.message; } finally { fs.readFileSync = orig; }
  }
  log('[D] C\'e\' un segnaposto con suffisso da guastare (il test non sta guardando il vuoto)', !!conSuffisso);
  log('[D] Un suffisso che non e\' un ruolo (`:es`) ferma il trascrittore, e dice quale',
    !!msgSuffisso && /suffisso che non e' un ruolo/.test(msgSuffisso) && /:es\}\}/.test(msgSuffisso), String(msgSuffisso));
}

// ── [F] UNA SEZIONE DI UN FILE EPISODIO, UNA TABELLA — 2026-10-06 ─────────
//
// Il caso vero l'ha trovato `controllo-bacino.py` di chi guida il progetto: due
// tabelle in una sezione di grado. Il trascrittore leggeva la prima e la
// seconda spariva in silenzio; e se le due avevano le stesse colonne e solo
// una riga vuota in mezzo **si fondevano**, con l'intestazione della seconda
// diventata una voce con id `id`. I tre modi in cui una seconda tabella arriva,
// e il quarto caso, quello che NON deve fermare: la §9 della struttura ha
// davvero una tabella di spiegazione sotto quella dei dati.
{
  const sollevato = function (f) { try { f(); return null; } catch (e) { return e.message; } };
  const titolo = '### Grado C — le frasi';
  const prima = titolo + '\n\n| id | es | it | da |\n|---|---|---|---|\n| `c-1` | a | b | `d-1` |\n';
  const casi = {
    'con una riga di prosa in mezzo': prima + '\nUna nota.\n\n| id | es | it | da |\n|---|---|---|---|\n| `c-9` | x | y | `d-9` |\n\n### Grado B\n',
    'con colonne diverse e una riga vuota': prima + '\n| id | non con |\n|---|---|\n| `c-1` | `c-4` |\n\n### Grado B\n',
    'con le STESSE colonne e una riga vuota (prima si fondevano)': prima + '\n| id | es | it | da |\n|---|---|---|---|\n| `c-9` | x | y | `d-9` |\n\n### Grado B\n'
  };
  Object.keys(casi).forEach(function (n) {
    const msg = sollevato(function () { T.tabellaSotto(casi[n], titolo, true, null, true); });
    log('[F] Una seconda tabella in una sezione di grado, ' + n + ', ferma il trascrittore',
      !!msg && /ci sono 2 tabelle/.test(msg), String(msg));
  });
  log('[F] Il grado della sezione dopo NON è una seconda tabella di questa',
    sollevato(function () { T.tabellaSotto(prima + '\n### Grado B\n\n| id | es | it | pr | cat |\n|---|---|---|---|---|\n| `b-1` | a | b | c | d |\n', titolo, true, null, true); }) === null);
  const struttura = '## 9 — X\n\n| Ruolo | Nome |\n|---|---|\n| `corso` | Y |\n\nUna spiegazione.\n\n| | |\n|---|---|\n| `corso` | il nome del corso |\n';
  let letta = null;
  const msgS = sollevato(function () { letta = T.tabellaSotto(struttura, '## 9 — X', true); });
  log('[F] ...ma la struttura, che spiega, con una tabella di spiegazione sotto i dati NON si ferma, e legge i dati',
    msgS === null && JSON.stringify(letta) === JSON.stringify([['`corso`', 'Y']]), String(msgS) + ' ' + JSON.stringify(letta));
}

console.log('\n=== TESTI DAL MARKDOWN: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
