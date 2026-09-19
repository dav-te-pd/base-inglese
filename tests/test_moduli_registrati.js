// PROTEGGE: che ogni modulo si apra passando dal registro, e che un `kind`
// che nessuno ha registrato finisca sulla schermata d'errore invece che nel
// silenzio.
//
// COSA SI PERDE SENZA QUESTO FILE. Il 2026-09-16 (passo 21-ter)
// `openModuleByKind` è passata da otto `else if` a `BI.moduli[module.kind]`.
// Come il 21-bis, **è un passo che toglie nomi**: se un modulo smettesse di
// registrarsi, nessun test esistente diventerebbe rosso — la sua riga sulla
// mappa aprirebbe la schermata d'errore, che è un comportamento *previsto*
// per un altro caso.
//
// ⚠️ PER QUESTO IL CONTO È «ESATTAMENTE 14», NON «ALMENO 1».
// Quattordici `kind` distinti per otto funzioni di apertura: `openStoryCards`
// ne serve due, `openDialogo` tre, `openFlashcard` uno solo — ed è il caso che
// conta, sotto.
//
// ⚠️ IL CAMBIO DI COMPORTAMENTO, che questo file protegge *come tale*.
// Prima, quattro rami su otto non guardavano il `kind` ma una proprietà del
// descrittore (`storyProfile`, `voiceVariant`, `dialogoProfile`,
// `flashcardDirection`), quindi un modulo con `dialogoProfile` e un `kind`
// sconosciuto **si apriva lo stesso**. Adesso va alla schermata d'errore. È
// voluto: è il difetto degli episodi corti chiuso da un'altra parte. Il blocco
// `[C]` lo guida apposta, così se un giorno un episodio smette di aprirsi si
// trova qui la riga che lo spiega.
//
// IL CASO PIÙ DIVERSO (regola 42): **`flashcard`, l'unico `kind` condiviso da
// DUE descrittori** (`flashcardAEngIta` e `flashcardAItaEng`). Non è il modulo
// complicato: è quello che rompe l'assunzione «un descrittore, una chiave». E
// collide con una guardia scritta due passi prima — `BI.registraModulo` alza
// un'eccezione sui duplicati — quindi registrarlo per descrittore farebbe
// esplodere il boot. Il blocco `[A]` verifica che sia registrato **una volta
// sola** e che **entrambe** le apparizioni della sequenza lo risolvano.
//
// LIMITE DICHIARATO: non verifica che ogni modulo FUNZIONI una volta aperto —
// quello è il mestiere dei file per modulo. Qui si guarda solo che la
// risoluzione arrivi alla funzione giusta.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi, sorgenteChe } = require('./test-env');
const { openModule } = require('./map-driver');
const { stepIds, stepsBefore } = require('./module-order');

// I `kind` che i descrittori dichiarano, presi dal sorgente: è l'altro lato
// della relazione che il registro deve rispettare, ed è raggiungibile da qui
// mentre `EPISODES` (dentro l'IIFE) non lo è.
// ⚠️ CERCA IN TUTTE LE SORGENTI, E SI ARRENDE RUMOROSAMENTE SE NON TROVA.
//
// Il 2026-09-19 (passo C1) `MODULE_DESCRIPTORS` e' passato da `index.html` a
// `app/catalogo.js`, e questa funzione cercava in un file solo. Con
// `indexOf` a **-1** lo `slice` tornava un blocco **vuoto**, cioe' ZERO kind
// dichiarati — e da li' le due righe gemelle si sono comportate in modo
// OPPOSTO:
//
//   • «E nessun kind registrato e' di troppo» → **rossa**, tutti e quindici
//   • «Ogni kind dichiarato e' nel registro» → **VERDE**, perche' con un
//     elenco vuoto «tutti» e' vero per costruzione (regola 44)
//
// *La stessa rottura ha dato un rosso su una riga e un verde che non prova
// niente sull'altra. Se il caso fosse stato solo il secondo, non se ne
// sarebbe accorto nessuno.* Da qui il `throw`: un elenco vuoto non e' un
// risultato, e' un guasto della ricerca.
// Il corpo di una funzione, cercata dove sta. La ricerca e' condivisa
// (`sorgenteChe`, tests/test-env.js): qui resta solo il taglio fino alla
// chiusura.
function corpoDiFunzione(firma) {
  const src = sorgenteChe(firma).testo;
  const i = src.indexOf(firma);
  return src.slice(i, src.indexOf('\n  }', i));
}

function kindDaiDescrittori() {
  const posti = ['index.html'].concat(
    fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) { return 'app/' + f; })
  );
  let blocco = null;
  for (let k = 0; k < posti.length && blocco === null; k++) {
    const src = fs.readFileSync(repoPath.apply(null, posti[k].split('/')), 'utf8');
    const i = src.indexOf('var MODULE_DESCRIPTORS = {');
    if (i !== -1) blocco = src.slice(i, src.indexOf('\n  };', i));
  }
  if (blocco === null) throw new Error('MODULE_DESCRIPTORS non trovato in nessuno di: ' + posti.join(', '));
  const kinds = [];
  (blocco.match(/kind: '([^']+)'/g) || []).forEach(function (m) {
    const k = m.slice("kind: '".length, -1);
    if (kinds.indexOf(k) === -1) kinds.push(k);
  });
  return kinds.sort();
}

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const mockInit = () => {
  class FU { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = FU;
  function FakeRec() { this.onstart = null; this.onend = null; this.onresult = null; this.onerror = null; }
  FakeRec.prototype.start = function () { if (this.onstart) this.onstart(); };
  FakeRec.prototype.stop = function () { if (this.onend) this.onend(); };
  FakeRec.prototype.abort = function () {};
  window.SpeechRecognition = FakeRec; window.webkitSpeechRecognition = FakeRec;
};

async function vaiAllaMappa(page, utente, completati) {
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (d) {
    localStorage.setItem('baseinglese:gate:customizeSeen:' + d.u, '1');
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + d.u, '1');
    localStorage.setItem('baseinglese:modules:gate:' + d.u, JSON.stringify({ completed: d.f || [] }));
  }, { u: utente, f: completati });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
}

// ⚠️ IL BLOCCO [E] E' PROVVISORIO, E LA SUA CONDIZIONE STA QUI PERCHE'
// LASCIARLO COM'E' NON SAREBBE NEUTRO.
//
// Verifica la premessa del passo 23 — «un modulo non e' nominato da fuori» —
// nell'unica forma in cui e' vera: NON «zero riferimenti», ma **uno solo, e
// dichiarativo**. Il catalogo deve nominarlo (un passo che nessuno puo'
// nominare non si puo' mettere in sequenza) e il modulo deve dichiararsi.
// Quello che non deve succedere e' che ALTRE funzioni scrivano il suo id a
// mano — e fino al 2026-09-18 due funzioni dei progressi lo facevano, in
// quattro righe.
//
// **QUANDO IL PRIMO MODULO SARA' FUORI, QUESTO BLOCCO CAMBIA FORMA:** oggi
// legge `index.html`, e da allora dovra' leggere il file del modulo e quello
// di chi resta — «dentro» e «fuori» saranno due file invece che due regioni
// dello stesso.
//
// ⚠️ E COSA SUCCEDE SE NESSUNO LO CAMBIA, che e' la parte che va detta:
// resterebbe **verde verificando una cosa sempre vera**. Cercare
// `'personalizzazione'` dentro un `index.html` da cui Personalizza e' uscita
// non trova niente **per costruzione**, non perche' la premessa regga — e il
// verde direbbe «la premessa vale» mentre nessuno la sta piu' guardando.
// *E' l'asserzione vacua, la forma che questa serie ha gia' incontrato due
// volte.* **Lasciarlo com'e' non e' neutro: e' peggio che toglierlo.**

async function run() {
  // ── [A] I NOMI SONO SPARITI DAL DISPATCH ─────────────────────────────
  {
    // ⚠️ IL 2026-09-19 (passo C2) `openModuleByKind` E' USCITA IN
    // `app/apertura.js`, E QUESTO BLOCCO HA FATTO ESATTAMENTE QUELLO CHE IL
    // SUO COMMENTO PREVEDEVA — vedi la nota sopra `run()`.
    //
    // Leggendo il solo `index.html` trovava `i === -1`, quindi `corpo` era la
    // CODA del file invece della funzione. Esito misurato: **due asserzioni
    // rosse e dodici verdi per costruzione** — le dodici «openModuleByKind non
    // nomina piu' X» passavano perche' cercavano dentro il pezzo sbagliato.
    // *La stessa rottura, di nuovo, con i due esiti opposti della regola 44.*
    //
    // Adesso la funzione si cerca DOVE STA, ovunque sia, e un elenco vuoto e'
    // un `throw` invece di un verde: e' la forma gia' adottata da
    // `kindDaiDescrittori()` qui sopra, applicata al secondo dei due posti in
    // cui questo file legge il sorgente.
    const corpo = corpoDiFunzione('  function openModuleByKind(module) {');
    // I commenti si tolgono prima di cercare: il corpo SPIEGA il cambio di
    // comportamento e nomina in prosa le proprietà di dispatch. Una verifica
    // per sottrazione che non distingue il codice dal commento è una misura
    // che non misura — è già successo al passo 21-bis.
    const codice = corpo.split('\n').map(function (r) { return r.split('//')[0]; }).join('\n');

    ['openCustomize', 'openRepeatAloud', 'openStoryCards', 'openVoiceCoach',
     'openMatch', 'openDialogo', 'openSpeedMatch', 'openFlashcard'].forEach(function (n) {
      log('[A] openModuleByKind non nomina più ' + n,
        new RegExp('\\b' + n + '\\b').test(codice) === false);
    });
    ['storyProfile', 'voiceVariant', 'dialogoProfile', 'flashcardDirection'].forEach(function (n) {
      log('[A] ...né dispaccia più sulla proprietà ' + n,
        new RegExp('\\b' + n + '\\b').test(codice) === false);
    });
    log('[A] Risolve dal registro', /BI\.moduli\[/.test(codice));
    log('[A] E il ramo showLoadError è conservato', /showLoadError\(/.test(codice));
  }

  const browser = await launchBrowser();

  // ── [B] IL CONTO ESATTO, e ogni passo della sequenza si risolve ──────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    await page.goto(APP_URL);
    // ⚠️ ANCHE QUESTA ATTESA SI CATTURA, e il caso è reale: una doppia
    // registrazione fa alzare un'eccezione a `BI.registraModulo` **a tempo di
    // parsing**, quindi l'IIFE muore e l'app non parte affatto. Lasciandola
    // nuda il test moriva con un `TimeoutError` su `#view-onboarding` — il
    // rosso più muto possibile davanti al guasto più rumoroso (⓪-septies).
    let partita = true;
    await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 })
      .catch(function () { partita = false; });
    log('[B] L\'app parte: nessuna registrazione ha fatto esplodere il boot',
      partita === true,
      'l\'app non è partita — un\'eccezione a tempo di parsing, p.es. lo stesso kind registrato due volte: ' +
      (errori[0] || 'nessun messaggio catturato'));
    if (!partita) {
      log('[B] (saltate le asserzioni sul registro: non c\'è una pagina viva da interrogare)', false);
      await page.close();
      await browser.close();
      console.log('\n=== MODULI REGISTRATI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
      process.exit(1);
    }

    const reg = await page.evaluate(() => Object.keys(window.BI.moduli).sort());
    // ⚠️ ESATTAMENTE 14: un ">= 1" passerebbe con tredici moduli spariti.
    log('[B] Al boot si registrano ESATTAMENTE 14 kind', reg.length === 14, reg.join(','));
    log('[B] E la bandiera dice che sono tutti caricati al boot',
      await page.evaluate(() => window.BI.moduliCaricatiAlBoot === true));

    // ⚠️ IL CASO PIÙ DIVERSO: flashcard è UNO, non due.
    log('[B] flashcard è registrato UNA volta sola, per due descrittori',
      reg.filter(function (k) { return k === 'flashcard'; }).length === 1 &&
      reg.indexOf('flashcard') !== -1, reg.join(','));

    // ⚠️ IL CONTO CHE COLLEGA IL REGISTRO AI DESCRITTORI, e si fa da fuori.
    //
    // `EPISODES` vive dentro l'IIFE e non è raggiungibile dalla pagina — il
    // primo tentativo lo leggeva da `window` e moriva con un TypeError, cioè
    // un rosso che parla del test invece che dell'app (⓪-septies). I `kind`
    // attesi si prendono quindi dai DESCRITTORI nel sorgente, che è l'altro
    // lato della stessa relazione: ogni kind dichiarato da un descrittore deve
    // esistere nel registro, e viceversa.
    const kindDichiarati = kindDaiDescrittori();
    const nonRegistrati = kindDichiarati.filter(function (k) { return reg.indexOf(k) === -1; });
    const nonDichiarati = reg.filter(function (k) { return kindDichiarati.indexOf(k) === -1; });
    log('[B] Ogni kind dichiarato da un descrittore è nel registro',
      nonRegistrati.length === 0, 'mancanti dal registro: ' + nonRegistrati.join(','));
    log('[B] E nessun kind registrato è di troppo',
      nonDichiarati.length === 0, 'registrati ma non dichiarati: ' + nonDichiarati.join(','));
    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] UN KIND CHE NESSUNO HA REGISTRATO → schermata d'errore ───────
  //
  // È il cambio di comportamento del passo, guidato come tale: prima un
  // modulo con `dialogoProfile` e un kind sconosciuto si apriva lo stesso.
  {
    const page = await browser.newPage();
    const messaggi = [];
    page.on('console', function (m) {
      if (m.type() === 'error' && m.text().indexOf('[modulo]') !== -1) messaggi.push(m.text());
    });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    await vaiAllaMappa(page, 'Reg3', []);
    // Si sfila il kind dal registro: è il modo di simulare «nessuno l'ha
    // registrato» senza inventare un episodio finto.
    await page.evaluate(() => { delete window.BI.moduli['personalizzazione']; });
    await page.click('[data-module="personalizzazione"]');
    let vistaErrore = true;
    await page.waitForSelector('#view-error.is-active', { timeout: 10000 })
      .catch(function () { vistaErrore = false; });
    // ⚠️ L'attesa si cattura: il guasto cercato è «non si apre niente», quindi
    // lasciandola nuda il test MORIREBBE invece di fallire (⓪-septies).
    log('[C] Un kind non registrato porta alla schermata d\'errore, non al silenzio',
      vistaErrore === true, 'nessuna schermata: il tocco non ha prodotto niente');
    log('[C] E la causa è distinguibile in console',
      messaggi.length > 0 && messaggi[0].indexOf('non esiste') !== -1,
      messaggi.length ? messaggi[0] : 'nessun [modulo] in console');
    await page.close();
  }

  // ── [D] E I MODULI SI APRONO DAVVERO, passando dal registro ──────────
  {
    // Due moduli di due famiglie diverse, di cui uno è il caso più diverso:
    // Flash Card, il kind condiviso da due descrittori.
    //
    // ⚠️ UNA PAGINA NUOVA PER CASO, e non è pulizia di stile: riusando la
    // stessa, al secondo giro l'utente è già registrato in localStorage e la
    // schermata di onboarding non compare più — `page.fill('#name-input')`
    // aspetta un campo invisibile e il test muore in `vaiAllaMappa`, con un
    // rosso che parla del test invece che dell'app.
    const casi = [
      { id: 'personalizzazione', vista: 'view-customize' },
      { id: 'flashcardAEngIta', vista: 'view-flashcard' }
    ];
    for (const caso of casi) {
      const page = await browser.newPage();
      const errori = [];
      page.on('pageerror', function (e) { errori.push(e.message); });
      await bloccaFontEsterni(page);
      await page.addInitScript(mockInit);
      await vaiAllaMappa(page, 'Reg4' + caso.id, stepsBefore(caso.id));
      await openModule(page, caso.id);
      let aperto = true;
      await page.waitForSelector('#' + caso.vista + '.is-active', { timeout: 10000 })
        .catch(function () { aperto = false; });
      log('[D] ' + caso.id + ' si apre passando dal registro', aperto === true,
        'la vista ' + caso.vista + ' non è comparsa');
      log('[D] ' + caso.id + ': nessun errore JS', errori.length === 0, errori[0]);
      await page.close();
    }
  }

  await browser.close();

  // ── [E] LA PREMESSA DEL 23: UNO SOLO, E DICHIARATIVO ────────────────
  // (provvisorio — vedi la nota in testa al file, e cosa succede se resta)
  {
    const codice = righeDiCodiceDi('index.html');
    // ⚠️ IL CAMBIO DI FORMA ANNUNCIATO, avvenuto il 2026-09-18 col primo modulo.
    // La condizione di questo blocco diceva: «quando il primo modulo sara'
    // fuori, "dentro" e "fuori" diventano due file». E' successo:
    // `hasStartedEpisodeModules` e' in app/personalizza.js, e cercandola solo in
    // index.html il test diceva «funzione non trovata» — cioe' rosso per una
    // DECISIONE, non per una regressione.
    //
    // ⚠️ E il blocco NON e' piu' provvisorio, ma non perche' sia stato
    // «sistemato»: perche' la sua condizione e' scaduta bene. Cercando su tutti
    // i file, l'asserzione resta vera quando usciranno gli altri sette — invece
    // di dover essere riscritta a ogni modulo.
    const sorgenti = [codice].concat(
      fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
        .map(function (f) { return righeDiCodiceDi('app', f); })
    );
    const corpoDi = function (nome) {
      for (let k = 0; k < sorgenti.length; k++) {
        const src = sorgenti[k];
        const i = src.findIndex(function (r) { return new RegExp('^  function ' + nome + '\\s*\\(').test(r); });
        if (i === -1) continue;
        let j = i + 1;
        while (j < src.length && !/^  \}/.test(src[j])) j++;
        return src.slice(i, j + 1).join('\n');
      }
      return null;
    };

    // Le due funzioni che NON appartengono a Personalizza e che hanno bisogno
    // di sapere qual e' il passo-cancello. Nominate una per una: un elenco
    // derivato direbbe «queste sono tutte» senza poterlo sapere.
    ['migrateCustomizeSeenToModuleProgress', 'hasStartedEpisodeModules'].forEach(function (nome) {
      const corpo = corpoDi(nome);
      log('[E] ' + nome + ' non scrive a mano l\'id di Personalizza',
        corpo !== null && corpo.indexOf("'personalizzazione'") === -1,
        corpo === null ? 'funzione non trovata' : 'contiene ancora il letterale');
    });

    // ⚠️ LA COSTANTE SI CERCA IN TUTTE LE SORGENTI, non nel solo `index.html`:
    // il 2026-09-19 (passo C1) `ID_PERSONALIZZA` e' passata in
    // `app/catalogo.js`, e questa riga cercava ancora dove stava prima.
    // *Lo stesso difetto del `corpoDi` qui sopra, che le sorgenti le guarda
    // tutte gia' da prima — e per quello le due righe sopra sono restate
    // verdi mentre questa cadeva.*
    log('[E] ...e lo chiedono alla costante dichiarativa',
      sorgenti.some(function (src) {
        return src.some(function (r) { return /^  var ID_PERSONALIZZA = 'personalizzazione';$/.test(r); });
      }));
  }

  console.log('\n=== MODULI REGISTRATI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
