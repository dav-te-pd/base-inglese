// LO STRUMENTO CHE SCRIVE I JSON DAI MARKDOWN DI `docs/{lingua}/{studente}/`.
//
// COSA PROTEGGE, e non e' un test ma la ragione e' la stessa (regola 32): che
// la trascrizione markdown -> JSON sia RIPETIBILE. Fatta a mano, una battuta
// ricopiata storta non si vede in nessun rosso — il file resta valido, la
// frase e' un'altra. Fatto da qui, lo stesso markdown da' sempre lo stesso
// JSON, e una differenza e' una differenza nel markdown.
//
// ⚠️ E NON DECIDE NIENTE: legge le tabelle e le scrive. Ogni scelta — quali
// colonne, quali chiavi, cosa non si trascrive piu' — sta nel markdown, nella
// sezione «COME SI LEGGE QUESTO FILE» di ognuno.
//
// LIMITE DICHIARATO: legge le tabelle markdown col taglio sui `|`, quindi una
// cella che contiene un `|` romperebbe la riga. Non si ignora in silenzio: il
// numero di colonne viene controllato e un'incoerenza ferma tutto.
//
// Uso:  node tests/tools/trascrivi.js [--controlla]
//       --controlla non scrive niente: confronta e dice cosa cambierebbe.

'use strict';
const fs = require('fs');
const path = require('path');

const RADICE = path.resolve(__dirname, '..', '..');
// ⚠️ LE EDIZIONI SI SCOPRONO, NON SI ELENCANO — dal 2026-09-24.
//
// Qui c'era `const ED = { lingua: 'inglese', studente: 'it' };`: una riga
// sola, e faceva di questo strumento uno strumento per UNA edizione. *Chi
// avesse scritto `docs/spagnolo/it/` lo avrebbe scritto e nessuno lo avrebbe
// letto — senza nessun errore, perche' lo strumento non sapeva nemmeno di
// doverlo cercare.* E' il primo ostacolo del passo 1.12, la catena di
// validazione delle edizioni.
//
// ⚠️ E NON C'E' UN ELENCO DI EDIZIONI DA TENERE AGGIORNATO, per la stessa
// ragione della regola 4: **la cartella e' il criterio, non i nomi**. Un
// elenco dentro uno strumento smette di essere vero al primo contenuto nuovo,
// e nessuno se ne accorge.
//
// **Cosa rende una cartella un'edizione: che ci sia il suo
// `{lingua}-{studente}-struttura-corso.md`.** Non la presenza della cartella —
// una cartella vuota, o mezza scritta, non e' un'edizione — e non un elenco.
// *E' la stessa cosa che l'app chiede per disegnare qualunque schermata: senza
// struttura del corso non c'e' nessun corso.*
function edizioni() {
  const base = path.join(RADICE, 'docs');
  const trovate = [];
  fs.readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .forEach((lingua) => {
      const dirLingua = path.join(base, lingua.name);
      fs.readdirSync(dirLingua, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .forEach((studente) => {
          const pref = lingua.name + '-' + studente.name + '-';
          const struttura = path.join(dirLingua, studente.name, pref + 'struttura-corso.md');
          if (fs.existsSync(struttura)) {
            trovate.push({ lingua: lingua.name, studente: studente.name, pref: pref });
          }
        });
    });
  return trovate;
}

const doc = (ed, n) => path.join(RADICE, 'docs', ed.lingua, ed.studente, ed.pref + n + '.md');
const dati = (ed, n) => path.join(RADICE, 'data', ed.lingua, ed.studente, ed.pref + n + '.json');

// ── la lettura delle tabelle, la stessa forma del parser dei test ────────
// Si parte dal titolo, si prende il primo blocco di righe che iniziano con
// "|", si buttano l'intestazione e la riga dei trattini. Una riga vuota
// DENTRO la tabella non la chiude: la chiude la prima riga non vuota che non
// comincia con "|".
// \u26a0\ufe0f E DAL 2026-09-28 SI PUO' CHIEDERE **QUALE** TABELLA, PER INTESTAZIONE.
//
// Senza, si prende la prima \u2014 che va bene finche' sotto un titolo ce n'e' una
// sola. *Non e' piu' vero: la sezione 3 di `messaggi-feedback` apre con una
// tabella di CONTEGGI e poi ha quella dei messaggi.* Prendere la prima e
// basta darebbe i conteggi al posto dei testi, e il controllo sul numero di
// colonne lo direbbe \u2014 ma dirlo per caso non e' dirlo: `intestazione` lo
// rende una scelta, e una tabella che non c'e' ferma tutto col suo nome.
// ⚠️ E DAL 2026-09-30 UN TITOLO CHE COMPARE DUE VOLTE, O UNA TABELLA
// OBBLIGATORIA SENZA RIGHE, FERMANO TUTTO (regola 49).
//
// Misurato quel giorno: una tabella nuova nella §1 di `struttura-corso.md`
// citava per intero `## 5 — LE SEQUENZE DEI MODULI`. `indexOf` ha trovato la
// CITAZIONE invece della sezione, ha letto sotto di lei una tabella di una
// riga sola, e il trascrittore ha scritto **`sequences: {}` senza dire
// niente** — un corso senza nessuna sequenza, cioe' ogni episodio sulla
// schermata d'errore. *E `test_struttura_corso` sarebbe rimasto verde: legge
// il markdown con lo stesso metodo, e confrontava vuoto con vuoto.*
function tabellaSotto(testo, titolo, obbligatoria, intestazione) {
  const i = testo.indexOf(titolo);
  if (i === -1) {
    if (obbligatoria) throw new Error('Titolo non trovato: ' + titolo);
    return [];
  }
  const ancora = testo.indexOf(titolo, i + titolo.length);
  if (ancora !== -1) {
    const riga = (pos) => testo.slice(0, pos).split('\n').length;
    throw new Error('Il titolo "' + titolo + '" compare piu\' di una volta (righe ' +
      riga(i) + ' e ' + riga(ancora) + '): il trascrittore leggerebbe la prima, ' +
      'che forse e\' una citazione. Un titolo cercato si scrive una volta sola.');
  }
  const risultato = tabellaSottoDa(testo, i, titolo, intestazione);
  if (obbligatoria && !risultato.length) {
    throw new Error('Sotto "' + titolo + '" c\'e\' una tabella senza righe: ' +
      'una tabella obbligatoria vuota non è un corso vuoto, è un guasto.');
  }
  return risultato;
}

function tabellaSottoDa(testo, i, titolo, intestazione) {
  const righe = testo.slice(i + titolo.length).split('\n');
  const blocchi = [];
  let corrente = null;
  for (const riga of righe) {
    const t = riga.trim();
    // Una SEZIONE NUOVA chiude sempre: nessuna tabella scavalca un `## `, e
    // senza questa riga la ricerca per intestazione andrebbe a pescare la
    // tabella di un'altra sezione \u2014 cioe' darebbe la risposta giusta alla
    // domanda sbagliata.
    if (t.startsWith('## ')) break;
    if (t.startsWith('|')) {
      const celle = t.split('|').slice(1, -1).map((c) => c.trim());
      if (celle.every((c) => /^-+$/.test(c))) continue;
      // \u26a0\ufe0f UN NUMERO DI COLONNE DIVERSO APRE UNA TABELLA NUOVA, e non e' una
      // furbizia: una riga vuota non chiude una tabella (ci sono tabelle che
      // ne hanno dentro), quindi due tabelle separate da una riga vuota sola
      // si fonderebbero in una. *La forma le distingue: una tabella ha un
      // numero di colonne, e cambiarlo vuol dire che ne e' cominciata
      // un'altra.* Due tabelle con le STESSE colonne restano una sola, e
      // l'intestazione dice a chi le legge quale voleva.
      if (corrente && corrente[0].length !== celle.length) corrente = null;
      if (!corrente) { corrente = []; blocchi.push(corrente); }
      corrente.push(celle);
    } else if (corrente && t !== '') {
      corrente = null;
      // Una riga di prosa CHIUDE la tabella ma non la sezione: sotto ce ne
      // puo' essere un'altra, e `intestazione` dice quale si voleva.
      if (!intestazione) break;
    }
  }
  if (!blocchi.length) return [];
  if (!intestazione) return blocchi[0].slice(1);
  const voluto = intestazione.map((c) => c.toLowerCase());
  const scelto = blocchi.find((b) =>
    b[0].length === voluto.length &&
    b[0].every((c, n) => c.toLowerCase() === voluto[n]));
  if (!scelto) {
    throw new Error('Sotto "' + titolo + '" non c\'e\' nessuna tabella con intestazione ' +
      JSON.stringify(intestazione) + ' \u2014 trovate: ' +
      JSON.stringify(blocchi.map((b) => b[0])));
  }
  return scelto.slice(1);
}

const nb = (c) => String(c == null ? '' : c).replace(/`/g, '').trim();

// ⚠️ UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423), E NON E' UN VEZZO.
//
// Una cella di tabella va tagliata ai lati — deve, altrimenti l'allineamento
// della tabella finirebbe nel dato — quindi uno spazio ai bordi sparirebbe
// **senza nessun errore**. Misurato il 2026-09-26: una stringa sola ce l'ha,
// `condivisi.rispostaCorretta` = `Risposta corretta:␣`, e senza quello spazio
// l'app scrive «Risposta corretta:Hello» attaccato. *Il segno si vede, lo
// spazio no.*
const spazi = (c) => String(c == null ? '' : c).replace(/\u2423/g, ' ');

// ⚠️ IL GRASSETTO MARKDOWN DIVENTA HTML, E NON E' UNA DECISIONE: e' la
// traduzione fedele di quello che un markdown vuol dire.
//
// I campi che finiscono nel JSON vengono inseriti come HTML (`pronunciationTip`
// in Repeat Aloud, `body` di una skill in Why We Say It). Un `**cosi'**`
// lasciato passare si vede a schermo COME DUE ASTERISCHI — non e' un guasto,
// e' una frase brutta, che e' peggio perche' nessun test la nota.
//
// Misurato il 2026-09-23: tre `pronunciationTip` di `aircraft-door` erano
// scritti col grassetto markdown mentre i corpi delle skill dello stesso file
// usavano gia' `<strong>`. Due convenzioni nello stesso file, e una delle due
// non arrivava a destinazione.
function html(testo) {
  return String(testo).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// Il numero di colonne si CONTROLLA: una cella con un "|" dentro sposterebbe
// tutto di una posizione, e le colonne si leggono per posizione.
function colonne(righe, quante, dove) {
  righe.forEach((r, n) => {
    if (r.length !== quante) {
      throw new Error(dove + ': la riga ' + (n + 1) + ' ha ' + r.length +
        ' colonne invece di ' + quante + ' — ' + JSON.stringify(r));
    }
  });
  return righe;
}

// ── struttura del corso ──────────────────────────────────────────────────
function struttura(ed) {
  const t = fs.readFileSync(doc(ed, 'struttura-corso'), 'utf8');

  const gradi = colonne(tabellaSotto(t, '## 2 — I GRADI', true), 3, 'gradi');
  const grades = gradi.map((r) => r[0].trim());
  const gradeNames = {};
  gradi.forEach((r) => { gradeNames[r[0].trim()] = r[1].trim(); });

  const cat = colonne(tabellaSotto(t, '## 3 — LE CATEGORIE DEI MODULI', true), 3, 'categorie');
  const moduleTypes = {};
  cat.forEach((r) => { moduleTypes[nb(r[0])] = { label: r[1].trim() }; });

  // ⚠️ QUATTRO COLONNE DAL 2026-09-28 (passo C): l'ultima e' `categoria`.
  //
  // Non e' un campo in piu': e' la risposta a una domanda che prima non si
  // poteva nemmeno formulare. *«`studioCompleteMessages` parla di pronuncia,
  // ma quanti dei moduli che lo mostrano fanno aprire bocca?» — senza questa
  // colonna bisogna contarli a mano ogni volta, e chi conta a mano sbaglia.*
  const nomi = colonne(tabellaSotto(t, '## 4 — I NOMI DEI MODULI', true), 4, 'nomi dei moduli');
  const moduleLabels = {};
  nomi.forEach((r) => {
    moduleLabels[nb(r[0])] = { name: r[1].trim(), subtitle: r[2].trim(), categoria: nb(r[3]) };
  });

  const passi = colonne(tabellaSotto(t, '## 5 — LE SEQUENZE DEI MODULI', true), 3, 'sequenze');
  const sequences = {};
  passi.forEach((r) => {
    const nome = nb(r[0]);
    const passo = { module: nb(r[1]) };
    if (nb(r[2])) passo.grade = nb(r[2]);
    (sequences[nome] = sequences[nome] || []).push(passo);
  });

  const ep = colonne(tabellaSotto(t, '## 7 — GLI EPISODI', true), 4, 'episodi');
  const episodes = {};
  ep.forEach((r) => {
    episodes[nb(r[0])] = { nome: r[1].trim(), categoria: nb(r[2]), sequence: nb(r[3]) };
  });
  // L'ORDINE DELLE RIGHE E' L'ORDINE DEGLI EPISODI: non esiste un numero
  // d'episodio, esiste questa posizione (regola: nel markdown, sezione 7).
  const ordine = ep.map((r) => nb(r[0]));

  const parlato = colonne(tabellaSotto(t, '## 8 — LE LINGUE DEL PARLATO', true), 2, 'parlato');
  const speech = {};
  parlato.forEach((r) => { speech[nb(r[0]).replace('speech.', '')] = nb(r[1]); });

  return { grades, gradeNames, moduleTypes, moduleLabels, sequences, episodes, ordine, speech };
}

// ── tabelle di personalizzazione ─────────────────────────────────────────
function tabelle(ed) {
  const t = fs.readFileSync(doc(ed, 'tabelle-personalizzazione'), 'utf8');
  const indice = colonne(tabellaSotto(t, '## 2 — LE TABELLE CHE ESISTONO', true), 2, 'indice tabelle');
  const out = {};
  indice.forEach((r) => {
    const nome = nb(r[0]);
    // ⚠️ QUATTRO COLONNE O SEI, E NIENT'ALTRO — passo 1.8-bis (2), 2026-09-24.
    //
    // Quattro: id | native | target | traducibile.
    // Sei:     id | native | target | paese native | paese target | traducibile.
    //
    // ⚠️ `native` E `target` SONO RUOLI, NON LINGUE — dal 2026-09-30, deciso da
    // chi guida il progetto. Qui c'erano `it` ed `en`: nel file di un corso di
    // spagnolo, «Turín» sarebbe finito sotto `en`. *Una chiave che dice una
    // lingua e' vera in un'edizione sola; una che dice il ruolo e' vera in
    // tutte — in un corso d'inglese per spagnoli `es` sarebbe la lingua dello
    // studente, `native` resta `native`.* Le intestazioni del markdown restano
    // libere (`it`, `en`, `es`): si legge per posizione.
    //
    // Il numero NON e' una costante unica perche' le tabelle non sono tutte
    // uguali: `places.departures` porta il paese — senza, la battuta di `gate`
    // direbbe «I am from Lugano, Italy» — e `places.destinations` non lo porta,
    // perche' nessuna battuta dice il paese di destinazione.
    //
    // ⚠️ E si guarda la PRIMA riga, non l'intestazione: `tabellaSotto` butta
    // l'intestazione, quindi qui arriva gia' solo il contenuto. Un numero
    // diverso da 4 o 6 si ferma **nominando la tabella**, invece di leggere le
    // colonne spostate di una posizione e scrivere un JSON plausibile e falso.
    const grezze = tabellaSotto(t, '### `' + nome + '`', true);
    const quante = grezze.length ? grezze[0].length : 4;
    if (quante !== 4 && quante !== 6) {
      throw new Error(nome + ': ' + quante + ' colonne. Le tabelle di ' +
        'personalizzazione ne vogliono 4 (id|native|target|traducibile) o 6 ' +
        '(id|native|target|paese native|paese target|traducibile).');
    }
    const righe = colonne(grezze, quante, nome);
    const [gruppo, chiave] = nome.split('.');
    out[gruppo] = out[gruppo] || {};
    out[gruppo][chiave] = righe.map((x) => {
      const riga = {
        value: nb(x[0]),
        native: x[1].trim(),
        target: x[2].trim(),
        // L'assenza vale «si traduce»: si scrive solo il `false`, come il file
        // di oggi. Un `traducibile: true` ovunque sarebbe rumore.
        traducibile: !/^(no|false)$/i.test(x[quante - 1].trim())
      };
      // Il sotto-campo ha la STESSA forma della riga — `native` e `target` — cosi'
      // `resolveSlotValue` non impara niente di nuovo: legge `picked[campo]`
      // dove prima leggeva `picked`.
      if (quante === 6) riga.paese = { native: x[3].trim(), target: x[4].trim() };
      return riga;
    });
  });
  return out;
}

// ── i due file CONDIVISI ─────────────────────────────────────────────
//
// ⚠️ NON SONO DI UN'EDIZIONE, E PER QUESTO NON PASSANO DA `edizioni()`.
// `data/condivisi/{studente}/` tiene i testi dell'interfaccia, che dipendono
// dalla lingua dello STUDENTE e non da quella insegnata (regola 8, riscritta
// il 2026-09-28). *Copiarli per edizione vorrebbe dire 349 stringhe duplicate
// ogni volta.*
//
// Quindi qui il criterio e' un altro, ed e' lo stesso in forma: **una cartella
// sotto `docs/condivisi/` e' una lingua-studente se contiene il suo
// `{studente}-istruzioni-moduli.md`.** Non un elenco (regola 4).
function studentiCondivisi() {
  const base = path.join(RADICE, 'docs', 'condivisi');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((st) => fs.existsSync(path.join(base, st, st + '-istruzioni-moduli.md')));
}

const docC = (st, n) => path.join(RADICE, 'docs', 'condivisi', st, st + '-' + n + '.md');
const datiC = (st, n) => path.join(RADICE, 'data', 'condivisi', st, st + '-' + n + '.json');

// Scrive `valore` dentro `oggetto` seguendo un percorso puntato, con `[n]` o
// `.n` per la posizione in una lista: `selfCheck.answers.0.button`.
//
// ⚠️ UN SEGMENTO NUMERICO CREA UNA LISTA, UNO NO CREA UN OGGETTO — e la
// differenza non e' estetica: `{"0": "..."}` e `["..."]` si stampano quasi
// uguali in un JSON e si comportano in modo diverso in `pickRandom`.
function infila(oggetto, percorso, valore) {
  const pezzi = percorso.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = oggetto;
  pezzi.forEach((pezzo, i) => {
    const ultimo = i === pezzi.length - 1;
    if (ultimo) { cur[pezzo] = valore; return; }
    if (cur[pezzo] == null) cur[pezzo] = /^\d+$/.test(pezzi[i + 1]) ? [] : {};
    cur = cur[pezzo];
  });
}

// I testi dell'interfaccia: `{studente}-istruzioni-moduli.json`.
//
// ⚠️ I 32 TITOLI NON SI SCRIVONO PIU', E NON E' UNA DIMENTICANZA (regola 48).
// `howItWorks.title` viene da `moduleLabels.<id del passo>.name`, che sta nella
// struttura dell'EDIZIONE; `helpReminder.title` da `aiuto.titleInstructions`,
// qui sotto. *Scriverli qui vorrebbe dire che un corso di spagnolo mostra
// sedici pop-up intitolati «Your Story»: questo file e' condiviso, i nomi dei
// moduli no.*
function istruzioni(st) {
  const t = fs.readFileSync(docC(st, 'istruzioni-moduli'), 'utf8');
  const out = {};

  // Il corpo del pop-up «Spiegazione». Sei colonne: # | kind | passi | corpo |
  // consiglio | video. Del JSON fanno parte solo `kind` e `corpo`; a `corpo`
  // si attacca in coda il riquadro della sezione 4 quando la colonna
  // `consiglio` ne nomina uno.
  //
  // ⚠️ L'INVOLUCRO NON STA NELLA CELLA: sta qui, una volta sola. *La cella
  // porta il TESTO; il riquadro attorno — e la sua etichetta visibile
  // «Un consiglio», che non e' scritta in nessun altro posto — e' la stessa
  // per tutti e due, e ricopiarla in due celle vorrebbe dire due copie.*
  // Tre colonne: id | quante spiegazioni lo usano | testo. La seconda e'
  // documentazione e non entra nel JSON.
  const consigli = {};
  colonne(tabellaSotto(t, '## 4 — I DUE CONSIGLI CONDIVISI', true), 3, 'consigli')
    .forEach((r) => {
      consigli[nb(r[0])] = '<div class="general-rule panel">' +
        '<span class="general-rule-label">Un consiglio</span>' + spazi(r[2]) + '</div>';
    });

  colonne(tabellaSotto(t, '## 2 — LE SPIEGAZIONI', true), 6, 'spiegazioni').forEach((r) => {
    const kind = nb(r[1]);
    // `—` (U+2014) vuol dire «nessun consiglio», e lo dice il markdown in
    // testa alla sezione 2. Una cella vuota non sarebbe la stessa cosa: si
    // legge come una dimenticanza, e questa e' una scelta.
    const consiglio = nb(r[4]) === '\u2014' ? '' : nb(r[4]);
    if (consiglio && !consigli[consiglio]) {
      throw new Error('spiegazioni: ' + kind + ' chiede il consiglio "' + consiglio +
        '" che la sezione 4 non ha');
    }
    infila(out, kind + '.howItWorks.body', r[3].trim() + (consiglio ? consigli[consiglio] : ''));
  });

  colonne(tabellaSotto(t, '## 3 — I PROMEMORIA', true), 3, 'promemoria').forEach((r) => {
    infila(out, nb(r[1]) + '.helpReminder.body', r[2].trim());
  });

  colonne(tabellaSotto(t, '## 5 — GLI ALTRI TESTI DI UN MODULO', true), 3, 'altri testi')
    .forEach((r) => { infila(out, nb(r[0]) + '.' + nb(r[1]), spazi(r[2])); });

  colonne(tabellaSotto(t, '## 6 — I TESTI CHE NON SONO DI UN MODULO', true), 3, 'testi condivisi')
    .forEach((r) => { infila(out, nb(r[0]) + '.' + nb(r[1]), spazi(r[2])); });

  return out;
}

// I messaggi di esito: `{studente}-messaggi-feedback.json`.
function messaggi(st) {
  const t = fs.readFileSync(docC(st, 'messaggi-feedback'), 'utf8');
  const out = {};

  // ⚠️ `showMessage` E' UN BOOLEANO, e la colonna «tipo» lo dice: una cella
  // letta come stringa darebbe `"false"`, che e' VERA.
  colonne(tabellaSotto(t, '## 2 — LE FASCE', true), 3, 'fasce').forEach((r) => {
    const tipo = nb(r[1]);
    const grezzo = spazi(r[2]);
    if (tipo !== 'testo' && tipo !== 'booleano') {
      throw new Error('fasce: tipo "' + tipo + '" sconosciuto in ' + nb(r[0]));
    }
    infila(out, nb(r[0]), tipo === 'booleano' ? grezzo === 'true' : grezzo);
  });

  colonne(tabellaSotto(t, '## 3 — I MESSAGGI', true,
    ['Famiglia', 'Gruppo', '#', 'Testo']), 4, 'messaggi').forEach((r) => {
    const n = nb(r[2]);
    // La tabella dei CONTEGGI in testa alla sezione ha tre colonne, non
    // quattro, quindi `colonne` non la vede. Questa riga copre il caso
    // opposto: una riga a quattro colonne che non ha un numero al terzo posto.
    if (!/^\d+$/.test(n)) throw new Error('messaggi: "' + n + '" non e\' una posizione');
    infila(out, nb(r[0]) + '.' + nb(r[1]) + '.' + String(Number(n) - 1), spazi(r[3]));
  });

  colonne(tabellaSotto(t, '## 4 — I TITOLI', true), 3, 'titoli').forEach((r) => {
    infila(out, nb(r[0]) + '.' + nb(r[1]), spazi(r[2]));
  });

  // ⚠️ LE LISTE VUOTE HANNO UNA SEZIONE LORO, E SENZA DI LEI SPARIREBBERO:
  // una lista senza righe non ha righe nella sezione 3. *La differenza fra
  // «lista vuota» e «chiave che non c'e'» la vede solo il codice che la legge.*
  colonne(tabellaSotto(t, '## 5 — LE LISTE VUOTE', true), 2, 'liste vuote').forEach((r) => {
    infila(out, nb(r[0]) + '.' + nb(r[1]), []);
  });

  return out;
}

// ── un episodio ──────────────────────────────────────────────────────────
function episodio(ed, id, gradeNames) {
  const t = fs.readFileSync(doc(ed, id), 'utf8');
  const fuori = {};

  fuori.episodeId = id;

  const regola = colonne(tabellaSotto(t, '## 3 — LA REGOLA GENERALE', false), 1, 'regola generale');
  // ⚠️ `html()` ANCHE QUI, dal 2026-09-30: `generalRule` entra nella pagina come
  // HTML (Repeat Aloud), esattamente come `pronunciationTip`. La prima regola
  // generale col grassetto — «**dí**-as», spagnolo, `gate` — sarebbe uscita
  // con gli asterischi a schermo. *I due episodi inglesi non ne avevano, quindi
  // nessuno l'aveva visto.*
  if (regola.length) fuori.generalRule = html(regola[0][0].trim());

  // Le tabelle interne: `episode.<nome>.<gruppo>` le raggiunge da qui.
  const interne = colonne(tabellaSotto(t, "## 8 — LE TABELLE INTERNE ALL'EPISODIO", false), 3, 'tabelle interne');
  interne.forEach((r) => {
    const nome = nb(r[0]);
    const gruppo = nb(r[1]);
    fuori[nome] = fuori[nome] || {};
    fuori[nome][gruppo] = r[2].split('·').map((v) => nb(v)).filter(Boolean);
  });

  const pers = colonne(tabellaSotto(t, '## 6 — PERSONAGGI ED ETICHETTE', true), 2, 'personaggi');
  fuori.speakerLabels = {};
  pers.forEach((r) => { fuori.speakerLabels[nb(r[0])] = r[1].trim(); });

  // ⚠️ SEI COLONNE DAL 2026-09-24 (passo 1.8-bis (3)): fra `tabella` e
  // `predefinito` e' nata `righe`, che prende un PEZZO di una tabella
  // condivisa. Un punto vuol dire «tutta la tabella».
  const slot = colonne(tabellaSotto(t, '## 7 — GLI SLOT', true), 6, 'slot');
  // Il segnaposto e la chiave dello slot hanno lo stesso nome: la mappa esiste
  // perche' POSSANO divergere, non perche' divergano.
  fuori.placeholderMap = {};
  slot.forEach((r) => { fuori.placeholderMap[nb(r[0])] = nb(r[0]); });
  fuori.personalizationTablesUsed = slot.map((r) => {
    const voce = {
      key: nb(r[0]), label: r[1].trim(), type: nb(r[2]), table: nb(r[3]), default: nb(r[5])
    };
    // ⚠️ `rows` ESISTE SOLO QUANDO SERVE, e non e' pigrizia: una chiave che c'e'
    // sempre — vuota per sette slot su otto — chiederebbe a chi legge il JSON di
    // distinguere «tutte le righe» da «nessuna riga», che e' proprio la
    // distinzione che il codice non deve indovinare. Assente vuol dire «tutta
    // la tabella», e lo dice l'assenza.
    const righe = r[4].split('·').map((v) => nb(v)).filter(Boolean);
    if (righe.length) voce.rows = righe;
    return voce;
  });

  // ⚠️ IL LABEL DI UN GRADO NON STA NEL FILE EPISODIO: si prende da
  // `gradeNames` della struttura, che e' la sua unica fonte (regola 4). Cosi'
  // il JSON continua a portarlo — `test_story_modules.js` lo legge — senza
  // che diventi un secondo posto dove scriverlo.
  const gradi = {
    D: colonne(tabellaSotto(t, '### Grado D — le battute', true), 5, 'grado D'),
    C: colonne(tabellaSotto(t, '### Grado C — le frasi', true), 4, 'grado C'),
    B: colonne(tabellaSotto(t, '### Grado B — le espressioni', true), 5, 'grado B'),
    A: colonne(tabellaSotto(t, '### Grado A — le parole', true), 5, 'grado A')
  };
  const skill = colonne(tabellaSotto(t, '## 5 — LE SKILL', true), 4, 'skill');
  const perBattuta = {};
  skill.forEach((r) => { (perBattuta[nb(r[0])] = perBattuta[nb(r[0])] || []).push({ title: r[2].trim(), body: html(r[3].trim()) }); });

  fuori.levels = {};
  ['A', 'B', 'C', 'D'].forEach((g) => {
    let items;
    if (g === 'D') {
      items = gradi.D.map((r) => {
        // ⚠️ LA CHIAVE E' `role`, NON `ruolo` — dal 2026-09-28 (passo D).
        // *Le chiavi del JSON sono in inglese come tutte le altre (`speaker`,
        // `target`, `native`): `ruolo` era l'unica in italiano, ed era
        // l'italiano di chi scrive il contenuto finito in un file che lo
        // esegue.* **La COLONNA del markdown si chiama ancora `ruolo`, ed è
        // voluto: quel file lo scrive chi guida il progetto, in italiano.**
        const it = { id: nb(r[0]), speaker: nb(r[1]), role: nb(r[2]), target: r[3].trim(), native: r[4].trim() };
        // whatYouLearn e' SEMPRE una lista, e c'e' solo se la battuta ha
        // almeno una skill: una lista vuota direbbe un'altra cosa.
        if (perBattuta[it.id]) it.whatYouLearn = perBattuta[it.id];
        return it;
      });
    } else if (g === 'C') {
      items = gradi.C.map((r) => ({ id: nb(r[0]), target: r[1].trim(), native: r[2].trim(), fromLine: nb(r[3]) }));
    } else {
      items = gradi[g].map((r) => ({
        id: nb(r[0]), target: r[1].trim(), native: r[2].trim(),
        pronunciationTip: html(r[3].trim()), grammarCategory: r[4].trim()
      }));
    }
    fuori.levels[g] = { label: gradeNames[g], items: items };
  });

  // ⚠️ UN SUFFISSO CHE NON E' UN RUOLO FERMA TUTTO — chiesto da chi guida il
  // progetto il 2026-09-30 (regola 49).
  //
  // I suffissi validi sono due, `:target` e `:native`. Un `{{partenza:es}}` —
  // la forma che il file spagnolo aveva la mattina di quel giorno — nell'app
  // NON fallisce: `fillTemplate` non trova la colonna e lascia il segnaposto
  // com'e', **e lo legge lo studente**. Qui invece nessuno lo legge ancora:
  // e' l'ultimo posto in cui si puo' fermare senza che si veda.
  const suffissiSbagliati = [];
  (JSON.stringify(fuori).match(/\{\{\w+(?:\.\w+)?:\w+\}\}/g) || []).forEach((s) => {
    const ruolo = s.replace(/^.*:(\w+)\}\}$/, '$1');
    if (ruolo !== 'target' && ruolo !== 'native' && suffissiSbagliati.indexOf(s) === -1) suffissiSbagliati.push(s);
  });
  if (suffissiSbagliati.length) {
    throw new Error(id + ': segnaposto con un suffisso che non e\' un ruolo: ' + suffissiSbagliati.join(', ') +
      ' — i suffissi validi sono :target (la lingua che si impara) e :native (quella dello studente).');
  }

  // I conti dichiarati si contano sul contenuto vero, e non si scrive niente
  // se non tornano (regola 29).
  const i = t.indexOf('Numeri attesi nel JSON');
  if (i === -1) throw new Error(id + ': riquadro «Numeri attesi nel JSON» non trovato');
  const blocco = t.slice(i).split(/\n\s*\n/)[0].split('\n').join(' ').replace(/[>*]/g, ' ');
  const prendi = (et, rx) => {
    const m = blocco.match(rx);
    if (!m) throw new Error(id + ': numero atteso non trovato: ' + et + '\n  riquadro: ' + blocco.trim());
    return parseInt(m[1], 10);
  };
  const atteso = {
    A: prendi('A', /(\d+)\s+voci in A/), B: prendi('B', /(\d+)\s+in B/),
    C: prendi('C', /(\d+)\s+in C/), D: prendi('D', /(\d+)\s+battute in D/),
    skill: prendi('skill', /(\d+)\s+skill/), slot: prendi('slot', /(\d+)\s+slot/)
  };
  const vero = {
    A: fuori.levels.A.items.length, B: fuori.levels.B.items.length,
    C: fuori.levels.C.items.length, D: fuori.levels.D.items.length,
    skill: skill.length, slot: slot.length
  };
  Object.keys(atteso).forEach((k) => {
    if (atteso[k] !== vero[k]) {
      throw new Error(id + ': i conti non tornano su ' + k + ' — dichiarato ' +
        atteso[k] + ', contato ' + vero[k] + '. Non scrivo niente.');
    }
  });
  return { json: fuori, conti: vero };
}

// ── esecuzione ───────────────────────────────────────────────────────────
function scrivi(percorso, oggetto, controlla) {
  const testo = JSON.stringify(oggetto, null, 2) + '\n';
  const prima = fs.existsSync(percorso) ? fs.readFileSync(percorso, 'utf8') : '';
  const nome = path.relative(RADICE, percorso);
  if (prima === testo) { console.log('   uguale   ' + nome); return; }
  if (controlla) { console.log('   CAMBIA   ' + nome); return; }
  fs.writeFileSync(percorso, testo);
  console.log('   scritto  ' + nome + '  (' + testo.length + ' caratteri)');
}

function main() {
  const controlla = process.argv.indexOf('--controlla') !== -1;

  const trovate = edizioni();
  const condivisi = studentiCondivisi();
  // ⚠️ ZERO CARTELLE CONDIVISE NON E' UN SUCCESSO SILENZIOSO, per la stessa
  // ragione di zero edizioni (regola 49): senza i testi dell'interfaccia
  // l'app non disegna niente, e uno strumento che non trova niente da fare
  // deve dirlo invece di uscire con 0.
  if (!condivisi.length) {
    console.error('Nessuna cartella trovata sotto docs/condivisi/.');
    console.error('Ce n\'e\' una per lingua dello STUDENTE, e contiene il suo');
    console.error('{studente}-istruzioni-moduli.md (regola 8).');
    process.exit(1);
  }
  // ⚠️ ZERO EDIZIONI NON E' UN SUCCESSO SILENZIOSO. Senza questa riga lo
  // strumento stamperebbe niente e uscirebbe con 0: «tutto a posto» e «non ho
  // trovato niente da fare» si leggerebbero uguali (regola 37).
  if (!trovate.length) {
    console.error('Nessuna edizione trovata sotto docs/.');
    console.error('Un\'edizione e\' una cartella docs/{lingua}/{studente}/ che');
    console.error('contiene il suo {lingua}-{studente}-struttura-corso.md.');
    process.exit(1);
  }

  // ⚠️ PRIMA SI LEGGE TUTTO, POI SI SCRIVE TUTTO — e dal 2026-09-24 vale
  // ANCHE FRA EDIZIONI, non solo dentro una. *Un errore nel secondo corso non
  // deve lasciare il primo riscritto e il secondo no: sarebbe di nuovo lo
  // stato intermedio che nessuno dichiara, solo un piano piu' in la'.*
  const daScrivere = [];
  trovate.forEach((ed) => {
    daScrivere.push([null, null, null, null, ed.lingua + '/' + ed.studente]);
    const s = struttura(ed);
    // Il nome della sequenza degli episodi non e' nel markdown: e' uno solo
    // per edizione, e il markdown ne porta l'ORDINE (sezione 7). Qui si
    // assembla dall'edizione: la lista viene da li', il nome e l'ingresso
    // sono suoi. *Resta fisso il solo `a1`, perche' oggi ogni edizione ha un
    // corso solo — il giorno in cui ne avra' due, quel pezzo verra' dal
    // markdown come tutto il resto.*
    const nomeSequenza = 'corso-' + ed.lingua + '-a1';
    const strutturaJson = {
      speech: s.speech,
      grades: s.grades,
      gradeNames: s.gradeNames,
      moduleTypes: s.moduleTypes,
      moduleLabels: s.moduleLabels,
      sequences: s.sequences,
      episodeSequences: {},
      episodeSequence: nomeSequenza,
      episodioCorrente: s.ordine[0],
      // \u26a0\ufe0f `episodiSpenti` NON VIENE DAL MARKDOWN, E DEVE ESSERCI LO STESSO
      // \u2014 trovato il 2026-09-28 (passo C), e il difetto era vero da due giorni.
      //
      // E' una manopola del Pannello Admin e non contenuto, quindi nel
      // markdown non ha una riga. Ma `applicaStruttura` assegna **anche quando
      // il file non ha la chiave** (`app/dati.js:183`), quindi un valore di
      // partenza scritto in `app/config.js` non sopravvive all'arrivo della
      // struttura: lo stato di riposo \u00abnessuno spento\u00bb esiste solo se sta qui.
      //
      // \u26a0\ufe0f **E senza questa riga la prima corsa del trascrittore lo avrebbe
      // TOLTO dal file, in silenzio.** *La chiave e' nata il 2026-09-26 col
      // passo 1.13-ter, scritta a mano nel JSON; il trascrittore non l'ha mai
      // saputa. Nessun rosso: il JSON sarebbe restato valido, e l'occhio del
      // pannello avrebbe smesso di partire da \u00abnessuno spento\u00bb.*
      episodiSpenti: [],
      episodes: s.episodes
    };
    strutturaJson.episodeSequences[nomeSequenza] = s.ordine;
    daScrivere.push(['struttura del corso:', dati(ed, 'struttura-corso'), strutturaJson, null]);
    daScrivere.push(['tabelle di personalizzazione:', dati(ed, 'tabelle-personalizzazione'), tabelle(ed), null]);
    Object.keys(s.episodes).forEach((id) => {
      const e = episodio(ed, id, s.gradeNames);
      daScrivere.push([null, dati(ed, id), e.json, '   ' + id + ': ' + JSON.stringify(e.conti)]);
    });
  });

  condivisi.forEach((st) => {
    daScrivere.push([null, null, null, null, 'condivisi/' + st]);
    daScrivere.push(['testi dell\'interfaccia:', datiC(st, 'istruzioni-moduli'), istruzioni(st), null]);
    daScrivere.push(['messaggi di esito:', datiC(st, 'messaggi-feedback'), messaggi(st), null]);
  });

  // Da qui in giu' non si legge piu' niente: se si e' arrivati, tutti i
  // markdown di tutte le edizioni sono validi e tutti i conti tornano.
  let sezioneEpisodi = false;
  daScrivere.forEach((r) => {
    if (r[4]) { console.log('\n=== ' + r[4] + ' ==='); sezioneEpisodi = false; return; }
    if (r[0]) console.log(r[0]);
    else if (!sezioneEpisodi) { console.log('episodi:'); sezioneEpisodi = true; }
    if (r[3]) console.log(r[3]);
    scrivi(r[1], r[2], controlla);
  });
}

// ⚠️ SI ESEGUE SOLO SE LANCIATO, NON SE RICHIESTO — dal 2026-09-28 (passo C).
//
// `tests/test_testi_dal_markdown.js` rigenera i JSON **con queste stesse
// funzioni** e li confronta con quelli sul disco: e' l'unico modo perche' il
// test conti i testi **rigenerando** invece di portarsi dentro un numero
// scritto a mano, che invecchierebbe al primo testo nuovo.
//
// Senza questa riga, `require` di questo file **riscriverebbe i cinque JSON**
// prima di ogni confronto — cioe' il test si preparerebbe da solo la risposta
// che sta per verificare, e sarebbe verde su qualunque cosa (regola 44).
if (require.main === module) main();

module.exports = { edizioni, studentiCondivisi, struttura, tabelle, episodio, istruzioni, messaggi, doc, dati, docC, datiC, tabellaSotto };
