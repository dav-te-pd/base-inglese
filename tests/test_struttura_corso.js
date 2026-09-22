// PROTEGGE: che `docs/inglese/it/inglese-it-struttura-corso.md` e la struttura
// viva dicano la stessa cosa. Il markdown e' la fonte (regola 26) e
// `APP_CONFIG` l'esecuzione: se divergono, si legge un documento che descrive
// un'app diversa da quella che gira — ed e' il caso in cui non se ne accorge
// nessuno, perche' il documento resta plausibile.
//
// COSA CONFRONTA — CINQUE tabelle, tutte con una riga per voce e un id in
// colonna, quindi leggibili senza interpretare niente:
//   1. i quattro gradi con il nome mostrato      -> CONFIG.grades/gradeNames
//   2. le sei categorie con la loro etichetta    -> CONFIG.moduleTypes
//   3. i quindici moduli con nome e sottotitolo  -> CONFIG.moduleLabels
//   4. gli episodi con la sequenza che chiedono  -> CONFIG.episodes
//   5. le due lingue del parlato                 -> CONFIG.speech
//
// ⚠️ **NON CONFRONTA PIU' I 22 PASSI, E NON E' UNA RINUNCIA: E' UNA DECISIONE
// PRESA IL 2026-09-21, E VA SAPUTA.**
//
// Il documento nuovo NON elenca i passi delle sequenze, di proposito
// (`STRUTTURA-CORSO_017`): *«due elenchi sugli stessi passi divergono al primo
// riordino»*. Quindi la tabella che questo test confrontava **non esiste piu'**.
//
// ⚠️ **LIMITE DICHIARATO, ed e' il piu' importante di questo file: da oggi
// NIENTE verifica che i 22 passi vivi siano quelli voluti.** Il file di
// struttura resta l'unica fonte, e una riga cambiata per sbaglio dentro
// `sequences` non fa rosso da nessuna parte. *Il documento porta i PRINCIPI
// dell'ordine (_020.._025) invece dei passi, e un principio scritto in prosa
// non si confronta con un programma.*
//
// **In cambio il file guarda tre tabelle in piu' di prima** — nomi dei moduli,
// episodi, lingue del parlato. Il conto delle cose protette sale, **ma quella
// che se n'e' andata non e' sostituita da nessuna di loro**, ed e' per questo
// che sta scritta qui e non solo nel messaggio di un commit.
//
// La tabella «Le regole di esito» resta fuori di proposito: nomina i moduli
// con il nome mostrato allo studente e li raggruppa a prosa, quindi per
// confrontarla servirebbe una mappa nome->id scritta a mano qui dentro — cioe'
// una terza fonte da tenere allineata alle altre due.
//
// Il markdown si legge come TESTO, non si esegue: una tabella cambiata a mano
// deve poter far fallire il test.
const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');

const DOC = 'docs/inglese/it/inglese-it-struttura-corso.md';

// Le righe di una tabella markdown sotto un'intestazione data. Si parte dal
// titolo, si prende il primo blocco di righe che iniziano con "|", si buttano
// l'intestazione della tabella e la riga dei trattini.
function tabellaSotto(testo, titolo) {
  const i = testo.indexOf(titolo);
  if (i === -1) throw new Error('Titolo non trovato in ' + DOC + ': ' + titolo);
  const righe = testo.slice(i).split('\n');
  const out = [];
  let dentro = false;
  for (const riga of righe) {
    const t = riga.trim();
    if (t.startsWith('|')) {
      dentro = true;
      const celle = t.split('|').slice(1, -1).map(c => c.trim());
      if (celle.every(c => /^-+$/.test(c))) continue; // riga dei trattini
      out.push(celle);
    } else if (dentro && t !== '') {
      break; // la tabella è finita
    }
  }
  if (out.length < 2) throw new Error('Tabella vuota o non riconosciuta sotto: ' + titolo);
  return out.slice(1); // via l'intestazione
}

// "`matchEngIta` — Match Practice `en→it`" -> "matchEngIta"
function idModulo(cella) {
  const m = cella.match(/`([A-Za-z][A-Za-z0-9]*)`/);
  return m ? m[1] : null;
}

// "—" nella colonna del grado vuol dire "nessun grado" (Your Story).
function grado(cella) {
  const t = cella.replace(/`/g, '').trim();
  return /^[A-Z]$/.test(t) ? t : null;
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const risultati = [];
  const log = (msg, ok) => { risultati.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const diff = (etichetta, atteso, trovato) => {
    console.log('    ' + etichetta);
    console.log('      documento: ' + JSON.stringify(atteso));
    console.log('      APP_CONFIG: ' + JSON.stringify(trovato));
  };

  await page.goto(APP_URL);
  // ⚠️ SI ASPETTA, E L'ATTESA NON E' UN RITARDO: dal 2026-09-20 (passo 1.11b)
  // i gradi, i loro nomi, le categorie e le sequenze non stanno piu' in
  // `app/config.js` — arrivano da `struttura-corso.json`, cioe' da un
  // `fetch`. Leggere `window.APP_CONFIG` appena caricata la pagina li
  // troverebbe `undefined`: non una regressione, una corsa.
  //
  // L'approdo e' la schermata del nome visibile, cioe' la prova che
  // `accendi()` e' girato — e `accendi()` gira solo DOPO che la struttura e'
  // stata applicata. ⚠️ **E nessuna delle asserzioni di questo file legge
  // quella schermata** (regola 44): leggono `grades`, `gradeNames`,
  // `moduleTypes` e l'ordine dei passi. Aspettare uno di quelli avrebbe reso
  // vera per costruzione proprio la riga che li verifica.
  await page.waitForSelector('#name-input', { state: 'visible', timeout: 10000 });
  const config = await page.evaluate(() => window.APP_CONFIG);
  await page.close();
  await browser.close();

  const doc = fs.readFileSync(repoPath(DOC), 'utf8');

  // ============ 1. I gradi ============
  {
    const righe = tabellaSotto(doc, '## 2 — I GRADI');
    const lettere = righe.map(r => r[0].trim());
    const nomi = {};
    righe.forEach(r => { nomi[r[0].trim()] = r[1].trim(); });

    console.log('[Gradi] documento: ' + lettere.map(l => l + '=' + nomi[l]).join(', '));
    const okOrdine = JSON.stringify(lettere) === JSON.stringify(config.grades);
    if (!okOrdine) diff('gradi', lettere, config.grades);
    log('[Gradi] Le lettere e il loro ordine combaciano con CONFIG.grades', okOrdine);

    const okNomi = JSON.stringify(nomi) === JSON.stringify(config.gradeNames);
    if (!okNomi) diff('nomi dei gradi', nomi, config.gradeNames);
    log('[Gradi] I nomi mostrati combaciano con CONFIG.gradeNames', okNomi);
  }

  // ============ 2. Le categorie ============
  {
    const righe = tabellaSotto(doc, '## 3 — LE CATEGORIE DEI MODULI');
    const etichette = {};
    righe.forEach(r => {
      const chiave = r[0].replace(/`/g, '').trim();
      etichette[chiave] = r[1].trim();
    });
    const daConfig = {};
    Object.keys(config.moduleTypes).forEach(k => { daConfig[k] = config.moduleTypes[k].label; });

    console.log('[Categorie] documento: ' + Object.keys(etichette).map(k => k + '=' + etichette[k]).join(', '));
    const okChiavi = JSON.stringify(Object.keys(etichette)) === JSON.stringify(Object.keys(daConfig));
    if (!okChiavi) diff('chiavi delle categorie', Object.keys(etichette), Object.keys(daConfig));
    log('[Categorie] Le chiavi, e il loro ordine, combaciano con CONFIG.moduleTypes', okChiavi);

    const okEtichette = JSON.stringify(etichette) === JSON.stringify(daConfig);
    if (!okEtichette) diff('etichette delle categorie', etichette, daConfig);
    log('[Categorie] Le etichette mostrate combaciano con CONFIG.moduleTypes', okEtichette);
  }

  // ============ 3. I nomi dei moduli ============
  {
    const righe = tabellaSotto(doc, '## 4 — I NOMI DEI MODULI');
    const dalDoc = {};
    righe.forEach(r => {
      dalDoc[r[0].replace(/`/g, '').trim()] = { name: r[1].trim(), subtitle: r[2].trim() };
    });
    console.log('[Nomi] documento: ' + Object.keys(dalDoc).length + ' moduli | APP_CONFIG: ' +
      Object.keys(config.moduleLabels).length);
    // ⚠️ QUI L'ORDINE NON SI CONFRONTA, E LA RIGA SOPRA LO FACEVA: era una
    // pretesa sbagliata, e il primo giro l'ha fatta vedere. `moduleLabels` e'
    // un elenco a CHIAVE — nessuno lo scorre, tutti ci cercano dentro per id —
    // quindi «personalizzazione, meetTheStory, repeatAloud» e
    // «personalizzazione, repeatAloud, meetTheStory» sono **lo stesso elenco**.
    // *Il documento li mette nell'ordine in cui si incontrano, che per chi
    // legge e' il piu' utile; il JSON in un altro. Nessuno dei due sbaglia.*
    //
    // E' diverso da `moduleTypes` qui sopra, dove l'ordine **si** confronta:
    // quelle sei categorie hanno una progressione (inizio, studio, ..., fine) e
    // un ordine diverso vorrebbe dire una decisione diversa.
    const chiaviDoc = Object.keys(dalDoc).slice().sort();
    const chiaviConfig = Object.keys(config.moduleLabels).slice().sort();
    const okChiavi = JSON.stringify(chiaviDoc) === JSON.stringify(chiaviConfig);
    if (!okChiavi) diff('chiavi dei nomi', chiaviDoc, chiaviConfig);
    log('[Nomi] Ci sono gli stessi moduli, non uno di piu e non uno di meno', okChiavi);

    const perChiave = function (o) {
      const out = {};
      Object.keys(o).slice().sort().forEach(function (k) { out[k] = o[k]; });
      return out;
    };
    const okValori = JSON.stringify(perChiave(dalDoc)) === JSON.stringify(perChiave(config.moduleLabels));
    if (!okValori) diff('nomi e sottotitoli', perChiave(dalDoc), perChiave(config.moduleLabels));
    // ⚠️ QUESTA RIGA GUARDA GLI ACCENTI, e non e' pignoleria: il 2026-09-21 il
    // documento portava «Perche' si dice cosi'» con gli apostrofi, ed e' testo
    // che legge lo STUDENTE. Era l'unico sottotitolo con lettere accentate,
    // quindi l'unico su cui la differenza si vedeva — e nessuno la guardava.
    log('[Nomi] Nome e sottotitolo combaciano carattere per carattere', okValori);
  }

  // ============ 4. Gli episodi: nome, categoria e sequenza ============
  {
    const righe = tabellaSotto(doc, '## 7 — GLI EPISODI');
    const dalDoc = {};
    righe.forEach(r => {
      dalDoc[r[0].replace(/`/g, '').trim()] = {
        nome: r[1].trim(),
        categoria: r[2].replace(/`/g, '').trim(),
        sequence: r[3].replace(/`/g, '').trim()
      };
    });
    const daConfig = {};
    Object.keys(config.episodes).forEach(k => {
      const e = config.episodes[k];
      daConfig[k] = { nome: e.nome, categoria: e.categoria, sequence: e.sequence };
    });

    console.log('[Episodi] documento: ' + JSON.stringify(dalDoc));
    const ok = JSON.stringify(dalDoc) === JSON.stringify(daConfig);
    if (!ok) diff('episodi', dalDoc, daConfig);
    // ⚠️ IL NOME È TESTO CHE LEGGE LO STUDENTE, quindi si confronta carattere
    // per carattere come i sottotitoli dei moduli: un apostrofo diverso fra
    // documento e JSON è un apostrofo diverso a schermo.
    log('[Episodi] Nome, categoria e sequenza combaciano col file di struttura', ok);

    const categorie = Object.keys(daConfig).map(function (k) { return daConfig[k].categoria; });
    const ammesse = ['storia', 'grammatica', 'pronuncia'];
    const ignote = categorie.filter(function (c) { return ammesse.indexOf(c) === -1; });
    if (ignote.length) console.log('    categorie non ammesse: ' + ignote.join(', '));
    log('[Episodi] Ogni categoria è una delle tre dichiarate', ignote.length === 0, ignote.join(', '));

    // ── L'ORDINE, dal passo 1.13 ────────────────────────────────────────
    //
    // ⚠️ PERCHE' SI CONFRONTA CON L'ORDINE DELLE RIGHE DELLA TABELLA, e non
    // con un elenco scritto a parte nel markdown: cosi' il markdown resta la
    // fonte (regola 26) SENZA che qualcuno debba ricopiare la lista in una
    // seconda sezione. Una seconda copia si disallinea; l'ordine delle righe
    // no, perche' e' la stessa cosa guardata una volta sola.
    //
    // COSA SI PERDE SENZA QUESTA ASSERZIONE: riordinare gli episodi nel JSON
    // e non nel documento (o viceversa) non romperebbe niente — l'app
    // funzionerebbe, con un ordine che la sua fonte non dichiara.
    const nomeSeq = config.episodeSequence;
    const seq = (config.episodeSequences || {})[nomeSeq];
    log('[Ordine] Il corso dichiara una sequenza di episodi che esiste',
      typeof nomeSeq === 'string' && Array.isArray(seq), nomeSeq + ' -> ' + JSON.stringify(seq));

    const ordineDoc = righe.map(r => r[0].replace(/`/g, '').trim());
    console.log('[Ordine] documento: ' + JSON.stringify(ordineDoc) +
      ' | episodeSequences.' + nomeSeq + ': ' + JSON.stringify(seq));
    log('[Ordine] L\'ordine del JSON e quello della tabella del documento combaciano',
      JSON.stringify(ordineDoc) === JSON.stringify(seq));

    // L'episodio d'ingresso e' un dato dell'EDIZIONE dal passo 1.13, non piu'
    // un valore globale di app/config.js: `gate` non esiste in un corso
    // francese. Qui si verifica che ci sia e che nomini un episodio vero —
    // che e' meno ovvio di come suona, perche' un id sbagliato non ferma
    // l'app: ripiega sul primo del corso e lo dice in console.
    log('[Ordine] L\'episodio d\'ingresso e\' dichiarato dall\'edizione e nomina un episodio vero',
      typeof config.episodioCorrente === 'string' && !!config.episodes[config.episodioCorrente],
      String(config.episodioCorrente));
  }

  // ============ 5. Le due lingue del parlato ============
  {
    const righe = tabellaSotto(doc, '## 8 — LE LINGUE DEL PARLATO');
    const dalDoc = {};
    righe.forEach(r => {
      dalDoc[r[0].replace(/`/g, '').replace('speech.', '').trim()] = r[1].replace(/`/g, '').trim();
    });
    console.log('[Parlato] documento: ' + JSON.stringify(dalDoc));
    const ok = dalDoc.synthesisLang === config.speech.synthesisLang &&
               dalDoc.recognitionLang === config.speech.recognitionLang;
    if (!ok) diff('lingue del parlato', dalDoc, config.speech);
    // ⚠️ DUE, E SI GUARDANO SEPARATE: parlare e ascoltare sono due cose, e oggi
    // hanno lo STESSO valore — quindi un confronto che le confondesse sarebbe
    // verde lo stesso. Il giorno di un'edizione con voce britannica e
    // riconoscimento americano si vedrebbe; qui intanto si scrive.
    log('[Parlato] Le due lingue combaciano con CONFIG.speech', ok);
  }


  const falliti = risultati.filter(r => !r).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
