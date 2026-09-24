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
function tabellaSotto(testo, titolo, obbligatoria) {
  const i = testo.indexOf(titolo);
  if (i === -1) {
    if (obbligatoria) throw new Error('Titolo non trovato: ' + titolo);
    return [];
  }
  const righe = testo.slice(i + titolo.length).split('\n');
  const out = [];
  let dentro = false;
  for (const riga of righe) {
    const t = riga.trim();
    if (t.startsWith('|')) {
      dentro = true;
      const celle = t.split('|').slice(1, -1).map((c) => c.trim());
      if (celle.every((c) => /^-+$/.test(c))) continue;
      out.push(celle);
    } else if (dentro && t !== '') break;
  }
  return out.slice(1); // via l'intestazione
}

const nb = (c) => String(c == null ? '' : c).replace(/`/g, '').trim();

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

  const nomi = colonne(tabellaSotto(t, '## 4 — I NOMI DEI MODULI', true), 3, 'nomi dei moduli');
  const moduleLabels = {};
  nomi.forEach((r) => { moduleLabels[nb(r[0])] = { name: r[1].trim(), subtitle: r[2].trim() }; });

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
    // Quattro: id | it | en | traducibile.
    // Sei:     id | it | en | paese it | paese en | traducibile.
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
        'personalizzazione ne vogliono 4 (id|it|en|traducibile) o 6 ' +
        '(id|it|en|paese it|paese en|traducibile).');
    }
    const righe = colonne(grezze, quante, nome);
    const [gruppo, chiave] = nome.split('.');
    out[gruppo] = out[gruppo] || {};
    out[gruppo][chiave] = righe.map((x) => {
      const riga = {
        value: nb(x[0]),
        it: x[1].trim(),
        en: x[2].trim(),
        // L'assenza vale «si traduce»: si scrive solo il `false`, come il file
        // di oggi. Un `traducibile: true` ovunque sarebbe rumore.
        traducibile: !/^(no|false)$/i.test(x[quante - 1].trim())
      };
      // Il sotto-campo ha la STESSA forma della riga — `it` ed `en` — cosi'
      // `resolveSlotValue` non impara niente di nuovo: legge `picked[campo]`
      // dove prima leggeva `picked`.
      if (quante === 6) riga.paese = { it: x[3].trim(), en: x[4].trim() };
      return riga;
    });
  });
  return out;
}

// ── un episodio ──────────────────────────────────────────────────────────
function episodio(ed, id, gradeNames) {
  const t = fs.readFileSync(doc(ed, id), 'utf8');
  const fuori = {};

  fuori.episodeId = id;

  const regola = colonne(tabellaSotto(t, '## 3 — LA REGOLA GENERALE', false), 1, 'regola generale');
  if (regola.length) fuori.generalRule = regola[0][0].trim();

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
        const it = { id: nb(r[0]), speaker: nb(r[1]), ruolo: nb(r[2]), english: r[3].trim(), italian: r[4].trim() };
        // whatYouLearn e' SEMPRE una lista, e c'e' solo se la battuta ha
        // almeno una skill: una lista vuota direbbe un'altra cosa.
        if (perBattuta[it.id]) it.whatYouLearn = perBattuta[it.id];
        return it;
      });
    } else if (g === 'C') {
      items = gradi.C.map((r) => ({ id: nb(r[0]), english: r[1].trim(), italian: r[2].trim(), fromLine: nb(r[3]) }));
    } else {
      items = gradi[g].map((r) => ({
        id: nb(r[0]), english: r[1].trim(), italian: r[2].trim(),
        pronunciationTip: html(r[3].trim()), grammarCategory: r[4].trim()
      }));
    }
    fuori.levels[g] = { label: gradeNames[g], items: items };
  });

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

main();
