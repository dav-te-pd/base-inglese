// PROTEGGE: che docs/struttura-corso.md e APP_CONFIG dicano la stessa cosa su
// ordine dei passi, nomi dei gradi e categorie. Il markdown è la fonte
// (CLAUDE.md regola 26) e APP_CONFIG l'esecuzione: se divergono, si legge un
// documento che descrive un'app diversa da quella che gira — ed è il caso in
// cui non se ne accorge nessuno, perché il documento resta plausibile.
//
// COSA CONFRONTA, e cosa no. Solo le TRE TABELLE TECNICHE: i 22 passaggi con
// il loro grado, i quattro gradi con il nome mostrato, le sei categorie con
// la loro etichetta. Sono tabelle con una riga per voce e un id in colonna:
// si leggono senza interpretare niente.
//
// La quarta tabella del documento — "Le regole di esito" — resta fuori di
// proposito. Nomina i moduli con il nome mostrato allo studente ("Match
// Practice", "Speed Match"), non con il loro id, e li raggruppa a prosa
// ("Match Practice, Speed Match, Voice Practice, Voice Check, Test"): per
// confrontarla servirebbe una mappa nome→id scritta a mano qui dentro, cioè
// una terza fonte da tenere allineata alle altre due. In più contiene "Test",
// un modulo che non esiste ancora, quindi il confronto fallirebbe subito e la
// riparazione sarebbe inventare un'eccezione. Tre quarti del valore a un
// quarto della fragilità.
//
// Il markdown si legge come TESTO, non si esegue: una tabella cambiata a mano
// deve poter far fallire il test.
const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');

const DOC = 'docs/struttura-corso.md';

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

// "`quickMatchEngIta` — Match Practice `en→it`" -> "quickMatchEngIta"
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
  const config = await page.evaluate(() => window.APP_CONFIG);
  await page.close();
  await browser.close();

  const doc = fs.readFileSync(repoPath(DOC), 'utf8');

  // ============ 1. I gradi ============
  {
    const righe = tabellaSotto(doc, '## I gradi di difficoltà');
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
    const righe = tabellaSotto(doc, '## Le categorie dei moduli');
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

  // ============ 3. L'ordine dei 22 passaggi ============
  {
    const righe = tabellaSotto(doc, '### Ordine attuale');
    const dalDoc = righe.map(r => ({ module: idModulo(r[1]), grade: grado(r[2]) }));
    const sconosciute = righe.filter((r, i) => dalDoc[i].module === null);
    sconosciute.forEach(r => console.log('    riga non riconosciuta: ' + r.join(' | ')));
    log('[Ordine] Ogni riga del documento dichiara un id di modulo fra backtick',
      sconosciute.length === 0);

    // La numerazione della prima colonna deve essere 1..N: una riga tolta a
    // mano senza rinumerare è un errore da vedere subito.
    const numeri = righe.map(r => Number(r[0].trim()));
    const numerazioneOk = numeri.every((n, i) => n === i + 1);
    if (!numerazioneOk) console.log('    numerazione: ' + numeri.join(', '));
    log('[Ordine] La numerazione del documento è progressiva da 1', numerazioneOk);

    const dalConfig = config.moduleOrderDefault.map(p => ({ module: p.module, grade: p.grade || null }));

    console.log('[Ordine] documento: ' + dalDoc.length + ' passi | APP_CONFIG: ' + dalConfig.length + ' passi');
    log('[Ordine] Stesso numero di passi', dalDoc.length === dalConfig.length);

    const primoDiverso = dalDoc.findIndex((p, i) =>
      !dalConfig[i] || p.module !== dalConfig[i].module || p.grade !== dalConfig[i].grade);
    if (primoDiverso !== -1) {
      console.log('    primo passo diverso: numero ' + (primoDiverso + 1));
      diff('passo ' + (primoDiverso + 1), dalDoc[primoDiverso], dalConfig[primoDiverso]);
    }
    log('[Ordine] Ogni passo combacia: stesso modulo, stesso grado, stessa posizione',
      primoDiverso === -1);

    // Un grado dichiarato nel documento deve essere uno dei gradi esistenti.
    const gradiIgnoti = dalDoc.filter(p => p.grade !== null && config.grades.indexOf(p.grade) === -1);
    gradiIgnoti.forEach(p => console.log('    grado sconosciuto: ' + p.module + ' -> ' + p.grade));
    log('[Ordine] Ogni grado citato nell\'ordine esiste in CONFIG.grades', gradiIgnoti.length === 0);
  }

  const falliti = risultati.filter(r => !r).length;
  console.log('');
  console.log(falliti === 0 ? 'ALL PASS (' + risultati.length + ' asserzioni)'
    : falliti + ' su ' + risultati.length + ' asserzioni FALLITE');
  process.exit(falliti === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
