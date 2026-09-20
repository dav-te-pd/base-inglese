// PROTEGGE: che l'edizione — la coppia `{lingua-che-si-impara}/{lingua-studente}`
// della regola 4 — sia dichiarata in UN PUNTO SOLO, e che tutti e quattro i
// percorsi dei dati la seguano insieme.
//
// ⚠️ COSA SI PERDE SENZA QUESTO FILE, ed e' un guasto MUTO.
//
// Fino al passo 1.11 `data/inglese/it/` era scritto a mano quattro volte in
// `app/dati.js`: i tre file condivisi (istruzioni, feedback, tabelle) piu' il
// prefisso dei file episodio. Rinominare la cartella e trovarne tre su quattro
// non alzava niente: l'app partiva leggendo **meta' edizione vecchia e meta'
// nuova** — gli episodi da una parte, i testi dell'interfaccia dall'altra.
// Nessun rosso, nessuna schermata d'errore, solo un'app incoerente.
//
// COME si misura, e perche' non nel modo ovvio: non basta che i quattro
// percorsi siano giusti oggi — lo erano anche prima. Si CAMBIA l'edizione e si
// guarda se la seguono tutti e quattro. La forma vecchia non ne muoveva
// nessuno; questa li muove insieme.
//
// IL CASO PIU' DIVERSO (regola 42): **`episodeDataFile`, l'unico dei quattro
// che non e' un nome di file fisso.** Gli altri tre incollano un nome noto
// dietro la cartella; questo compone il PREFISSO (`inglese-it-`) unendo le due
// meta' della coppia con un trattino invece che con una barra. E' l'unico che
// usa i due campi due volte e in due forme diverse, quindi l'unico che una
// scorciatoia («tengo una stringa sola `'inglese/it'`») avrebbe rotto.
//
// [C] guarda una cosa che nessuna delle altre vede: l'ORDINE DEI TAG. Gli
// override del Pannello Admin si applicano in `app/avvio.js`; i tre percorsi
// condivisi si calcolano a tempo di parsing in `app/dati.js`. Se `dati.js`
// salisse sopra `avvio.js`, cambiare edizione dal pannello muoverebbe gli
// episodi e NON i tre file condivisi — di nuovo meta' e meta', in silenzio.

const fs = require('fs');
const path = require('path');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // ── [A] NESSUNO SCRIVE IL PERCORSO A MANO ──────────────────────────
  {
    const dir = repoPath('app');
    const files = fs.readdirSync(dir).filter(function (f) { return f.slice(-3) === '.js'; });
    const colpevoli = [];
    files.forEach(function (f) {
      // ⚠️ `righeDiCodiceDi` non basta QUI, e il caso e' vero: toglie le righe
      // che COMINCIANO con `//`, `*` o `/*`, non le righe di prosa in mezzo a
      // un commento a blocchi — `app/catalogo.js` ne ha una che nomina il
      // percorso in una frase. Quindi i commenti si mascherano con degli
      // spazi, che tengono ferme le posizioni: cosi' il numero di riga
      // stampato e' quello VERO del file, non quello di un elenco filtrato.
      // *Limite dichiarato: un commento in coda a una riga di codice
      // (`var x = 1; // vedi data/...`) resta dentro e darebbe un falso
      // allarme — rumoroso, non silenzioso.*
      const testo = fs.readFileSync(path.join(dir, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, function (m) { return m.replace(/[^\n]/g, ' '); })
        .replace(/^\s*\/\/.*$/gm, function (m) { return m.replace(/[^\n]/g, ' '); });
      testo.split('\n').forEach(function (riga, i) {
        if (/data\/inglese\/it|inglese-it-/.test(riga)) colpevoli.push(f + ':' + (i + 1));
      });
    });
    log('[A] Nessun file di app/ scrive il percorso dell\'edizione a mano',
      colpevoli.length === 0, colpevoli.join(', '));

    // La coppia sta in config.js e in nessun altro file di app/: se un
    // secondo file la nominasse, tornerebbero a esserci due verita'.
    const altrove = files.filter(function (f) {
      if (f === 'config.js') return false;
      return righeDiCodiceDi('app', f).some(function (r) {
        return /['"]inglese['"]/.test(r);
      });
    });
    log('[A] La lingua dell\'edizione e\' nominata solo da app/config.js',
      altrove.length === 0, altrove.join(', '));

    const cfg = righeDiCodiceDi('app', 'config.js').join('\n');
    log('[A] ...e ci sta come DUE campi, non come una stringa sola (regola 25)',
      /edizione:\s*\{/.test(cfg) && /lingua:\s*'inglese'/.test(cfg) && /studente:\s*'it'/.test(cfg));
  }

  // ── [C] L'ORDINE DEI TAG: gli override prima del calcolo ───────────
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    const posAvvio = html.indexOf('src="app/avvio.js');
    const posDati = html.indexOf('src="app/dati.js');
    log('[C] app/avvio.js e\' caricato PRIMA di app/dati.js',
      posAvvio !== -1 && posDati !== -1 && posAvvio < posDati,
      'avvio@' + posAvvio + ' dati@' + posDati);
  }

  const browser = await launchBrowser();

  // ── [B] I QUATTRO PERCORSI SEGUONO L'EDIZIONE ──────────────────────
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    await page.goto(APP_URL);
    await page.waitForSelector('#name-input', { state: 'visible', timeout: 10000 });

    // ⚠️ I PERCORSI PORTANO `?v=` DAL PASSO 1.9, e qui si confronta il
    // percorso NUDO: che la versione ci sia lo verifica
    // `tests/test_versione_cache.js`, che e' il file il cui mestiere e'
    // quello. Confrontarla anche qui vorrebbe dire aggiornare due file a
    // ogni cambio di versione — cioe' costruire la disallineabilita' che il
    // passo 1.9 ha appena tolto.
    const nudo = function (p) { return String(p).split('?')[0]; };

    const prima = await page.evaluate(function () {
      return {
        istruzioni: window.BI.MODULE_INSTRUCTIONS_FILE,
        feedback: window.BI.FEEDBACK_MESSAGES_FILE,
        tabelle: window.BI.PERSONALIZATION_TABLES_FILE,
        episodio: window.BI.episodeDataFile('gate')
      };
    });
    log('[B] I tre file condivisi stanno nella cartella dell\'edizione',
      nudo(prima.istruzioni) === 'data/inglese/it/istruzioni-moduli.json' &&
      nudo(prima.feedback) === 'data/inglese/it/messaggi-feedback.json' &&
      nudo(prima.tabelle) === 'data/inglese/it/tabelle-personalizzazione.json',
      JSON.stringify(prima));
    log('[B] Il file episodio porta la coppia anche nel NOME',
      nudo(prima.episodio) === 'data/inglese/it/inglese-it-gate.json', prima.episodio);

    // ⚠️ IL GUASTO REALISTICO: si cambia edizione e si guarda chi la segue.
    // Con i quattro percorsi scritti a mano, qui non si muoveva NIENTE — e
    // il test sarebbe rosso su tutte e cinque le righe qui sotto.
    await page.evaluate(function () {
      localStorage.setItem('baseinglese:configOverrides',
        JSON.stringify({ edizione: { lingua: 'francese', studente: 'it' } }));
    });
    await page.reload();
    // ⚠️ QUI NON SI ASPETTA PIU' LA SCHERMATA DEL NOME, E IL MOTIVO E' UN
    // COMPORTAMENTO NUOVO CHE VALE LA PENA VERIFICARE INVECE DI AGGIRARE.
    // Dal passo 1.11b l'app aspetta `struttura-corso.json` prima di disegnare
    // qualunque cosa: puntata a un'edizione che non esiste, quel file non
    // arriva e si vede la schermata d'errore (regola 35) invece dell'app.
    // L'approdo e' quindi la schermata d'errore, e i quattro percorsi si
    // leggono da `BI`, dove esistono da tempo di parsing.
    await page.waitForSelector('#view-error.is-active', { state: 'visible', timeout: 10000 });
    log('[B] Puntata a un\'edizione che non esiste, l\'app lo DICE invece di partire a meta\'', true);

    const dopo = await page.evaluate(function () {
      return {
        istruzioni: window.BI.MODULE_INSTRUCTIONS_FILE,
        feedback: window.BI.FEEDBACK_MESSAGES_FILE,
        tabelle: window.BI.PERSONALIZATION_TABLES_FILE,
        episodio: window.BI.episodeDataFile('gate')
      };
    });
    log('[B] Cambiata l\'edizione, la segue il file delle istruzioni',
      nudo(dopo.istruzioni) === 'data/francese/it/istruzioni-moduli.json', dopo.istruzioni);
    log('[B] ...la segue il file dei messaggi di feedback',
      nudo(dopo.feedback) === 'data/francese/it/messaggi-feedback.json', dopo.feedback);
    log('[B] ...la seguono le tabelle di personalizzazione',
      nudo(dopo.tabelle) === 'data/francese/it/tabelle-personalizzazione.json', dopo.tabelle);
    log('[B] ...e la segue il file episodio, cartella E prefisso insieme',
      nudo(dopo.episodio) === 'data/francese/it/francese-it-gate.json', dopo.episodio);
    log('[B] I quattro si muovono INSIEME: nessuno resta all\'edizione vecchia',
      [dopo.istruzioni, dopo.feedback, dopo.tabelle, dopo.episodio]
        .every(function (p) { return nudo(p).indexOf('data/francese/it/') === 0; }),
      JSON.stringify(dopo));

    await page.evaluate(function () { localStorage.clear(); });
    await page.close();
  }

  await browser.close();

  console.log('');
  console.log('=== EDIZIONE UNA VOLTA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
