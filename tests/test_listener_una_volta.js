// PROTEGGE: che ogni pulsante di ogni modulo abbia il proprio listener
// ESATTAMENTE UNA VOLTA — né zero né due — per tutta una sessione, comprese le
// riaperture dello stesso modulo.
//
// ⚠️ NASCE PRIMA DEL PASSO 21-QUATER, ED È VOLUTO.
//
// Quel passo sposta ~79 listener dentro l'`open` del proprio modulo, e i suoi
// DUE guasti sono ENTRAMBI SILENZIOSI:
//
//     attaccato due volte → l'azione parte due volte, nessun errore
//     non attaccato più   → il pulsante non fa niente, nessun errore
//
// Nessuno dei due alza un'eccezione, nessuno dei due si vede in console. Se il
// test nascesse insieme alla conversione, la prima volta che il meccanismo
// viene messo alla prova sarebbe anche la prima volta che qualcuno lo guarda.
//
// **Il test è verde su questo codice, ed è giusto così**: oggi il
// comportamento è corretto, i listener si attaccano una volta sola a tempo di
// parsing. Un test di regressione per un refactor deve essere verde prima e
// verde dopo — se fosse rosso prima starebbe chiedendo una funzionalità, non
// proteggendo un comportamento. Quello che conta è che sia stato **falsificato
// su tutte e due le direzioni PRIMA che un solo listener venisse spostato**.
//
// ⚠️ SI CONTANO I COLPI, NON GLI EFFETTI — e questa è la parte che qualcuno
// «semplificherebbe» trovandola pedante.
//
// Un test che verifica «il pulsante funziona» resta VERDE quando il listener è
// attaccato due volte: l'azione parte, l'effetto si vede, tutto sembra a
// posto. È esattamente metà del guasto, ignorata. Per questo qui si strumenta
// `EventTarget.prototype.addEventListener` prima che l'app parta e si conta
// **quante volte** ogni coppia (elemento, tipo) viene registrata: 0, 1 e 2
// diventano tre risultati distinti invece di due.
//
// COME, e perché serve `addInitScript`. L'istrumentazione deve essere in piedi
// prima della PRIMA riga dell'app, altrimenti i listener attaccati a tempo di
// parsing — cioè oggi tutti — non verrebbero contati e il test direbbe zero su
// un'app che funziona.
//
// IL CASO PIÙ DIVERSO (regola 42): **la riapertura**. Non un modulo
// complicato: lo stesso modulo aperto tre volte. Oggi è innocuo — i listener
// non stanno dentro `open` — e dopo il 21-quater è *il* guasto: misurato, il
// gesto più banale (apri → mappa → riapri) chiama `open` **tre volte**.
//
// LIMITE DICHIARATO, e va letto insieme al verde: copre solo i listener il cui
// bersaglio è un `getElementById(...)` sulla stessa riga — 103 su 113. Restano
// fuori quelli attaccati a una variabile (`speakBtn` di Repeat Aloud, `micBtn`
// di Voice, `configPanelBodyEl`) e quelli su `document`/`window`. **Due di
// quelli scoperti sono di un modulo**, quindi il 21-quater li tocca senza che
// questo file li guardi: vanno convertiti con un'attenzione in più.

const { launchBrowser, APP_URL, bloccaFontEsterni } = require('./test-env');
const { openModule } = require('./map-driver');
const { stepsBefore } = require('./module-order');
const fs = require('fs');
const { repoPath } = require('./test-env');
const { FAMIGLIE, listenerDichiarati, descrittori, bloccheDiKind } = require('./listener-census');

// ⚠️ LE ATTESE VENGONO DAL BASELINE, NON DAL SORGENTE — e questa riga è la
// correzione di un buco trovato falsificando, prima che una conversione
// cominciasse.
//
// La prima forma derivava l'elenco atteso da `index.html`, cioè dallo stesso
// file che stava controllando: togliendo la riga di un listener, quel listener
// spariva **anche dalle attese**, e il test restava verde. Si misurava contro
// sé stesso — la forma dell'asserzione vera per costruzione (regola 44),
// spostata dall'asserzione all'ELENCO su cui gira.
//
// Il baseline è un file a parte che il passo 21-quater NON deve toccare: i
// listener si spostano, non nascono e non muoiono.
function baseline() {
  const testo = fs.readFileSync(repoPath('tests', 'BASELINE-LISTENER.txt'), 'utf8');
  return testo.split('\n')
    .filter(function (r) { return r && r.indexOf('#') !== 0; })
    .map(function (r) {
      const p = r.split(' ');
      const k = p[1].split('|');
      // ⚠️ IL TERZO CAMPO È IL CONTO, ed è la correzione di un secondo buco
      // trovato falsificando. Senza, il confronto era «c'è / non c'è» — e i
      // sette `*-complete-btn` hanno DUE listener (il suono d'uscita e il
      // completamento). Spegnendo il completamento il conto scende da 2 a 1,
      // cioè il pulsante SUONA E NON COMPLETA: con «non zero» sarebbe passato.
      return { famiglia: p[0], id: k[0], tipo: k[1], quanti: parseInt(p[2], 10) };
    });
}
function listenerDi(f) {
  return baseline().filter(function (l) { return l.famiglia === f; });
}

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Conta ogni registrazione per (id dell'elemento, tipo di evento). Deve girare
// PRIMA dell'app: è il motivo per cui sta in un addInitScript.
const contatore = () => {
  window.__reg = {};
  const vero = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (tipo, fn, opts) {
    const id = (this && this.id) ? this.id : null;
    if (id) {
      const k = id + '|' + tipo;
      window.__reg[k] = (window.__reg[k] || 0) + 1;
    }
    return vero.call(this, tipo, fn, opts);
  };
};

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

async function nuovaPagina(browser, utente, completati) {
  const page = await browser.newPage();
  await bloccaFontEsterni(page);
  await page.addInitScript(contatore);
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (d) {
    localStorage.setItem('baseinglese:gate:customizeSeen:' + d.u, '1');
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + d.u, '1');
    // ⚠️ E quella di Personalizza, dal 2026-09-17: senza, alla prima apertura
    // si vede la schermata di intro e `#start-episode` **non e' visibile**,
    // quindi [C] non potrebbe uscire. Misurato che non cambia i conti: con
    // l'intro congedata i tredici listener restano a 1, uguali al baseline.
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + d.u, '1');
    localStorage.setItem('baseinglese:modules:gate:' + d.u, JSON.stringify({ completed: d.f || [] }));
  }, { u: utente, f: completati });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
  return page;
}

// I passi della mappa che aprono ciascuna famiglia.
const PASSO_DI = {
  voice: 'voicePractice', personalizza: 'personalizzazione', match: 'matchEngIta',
  speedMatch: 'speedMatchEngIta', dialogo: 'dialogoAscoltaRipeti',
  storyCards: 'meetTheStory', flashcard: 'flashcardAEngIta', repeatAloud: 'repeatAloud'
};

async function run() {
  const osservato = {};
  // ── [A]+[B] IL CONFRONTO COL BASELINE, ESATTO SUL NUMERO ────────────
  const browser = await launchBrowser();
  {
    const atteso = baseline();
    const page = await nuovaPagina(browser, 'L1', []);
    // Tutte le famiglie aperte una volta: il baseline è stato misurato così.
    for (const fam of Object.keys(FAMIGLIE)) {
      const pg = await nuovaPagina(browser, 'L1' + fam, stepsBefore(PASSO_DI[fam]));
      await openModule(pg, PASSO_DI[fam]);
      const r = await pg.evaluate(() => window.__reg);
      Object.keys(r).forEach(function (k) { osservato[k] = Math.max(osservato[k] || 0, r[k]); });
      await pg.close();
    }
    await page.close();

    const sbagliati = atteso.filter(function (l) {
      return (osservato[l.id + '|' + l.tipo] || 0) !== l.quanti;
    }).map(function (l) {
      return l.famiglia + ':' + l.id + '/' + l.tipo + ' atteso ' + l.quanti +
             ', osservato ' + (osservato[l.id + '|' + l.tipo] || 0);
    });
    log('[A] Ogni listener del baseline c\'è, e col NUMERO giusto',
      sbagliati.length === 0, sbagliati.join(' | '));

    const nuoviK = Object.keys(osservato).filter(function (k) {
      return !atteso.some(function (l) { return l.id + '|' + l.tipo === k; });
    });
    log('[B] E non ne sono comparsi di nuovi senza aggiornare il baseline',
      nuoviK.length === 0, nuoviK.join(', '));
    log('[B] Il baseline copre 79 listener di modulo',
      atteso.filter(function (l) { return l.famiglia !== 'condiviso'; }).length >= 79,
      String(atteso.filter(function (l) { return l.famiglia !== 'condiviso'; }).length));
  }

  // ── [C] IL CASO PIÙ DIVERSO: lo stesso modulo aperto tre volte ───────
  //
  // Misurato il 2026-09-16: apri → mappa → riapri chiama `open` TRE volte. Oggi
  // è innocuo perché i listener non stanno lì dentro; dopo il 21-quater è *il*
  // guasto, e senza una guardia ogni riapertura ne aggiunge una copia.
  {
    // ⚠️ TUTTE LE FAMIGLIE CON UN RITORNO ALLA MAPPA, non un campione di tre —
    // corretto il 2026-09-16 falsificando il giro ④.
    //
    // Prima erano speedMatch, flashcard e dialogo. Ma per una famiglia a kind
    // SINGOLO — Repeat Aloud, Personalizza — questo blocco è **l'unico** che
    // vedrebbe una guardia mancante: [A] apre ogni famiglia una volta sola
    // (quindi non duplica) e [E] guarda solo chi ha più kind. Togliendo la
    // guardia, Repeat Aloud restava verde.
    //
    // *Un campione va bene quando i casi si somigliano. Qui il caso che il
    // campione escludeva era proprio quello che nessun altro blocco copriva.*
    //
    // ⚠️ E LA REGOLA GENERALE, che vale per ogni blocco di questo file e per
    // ogni test futuro, non solo per il giro ④:
    //
    //   UN ELENCO SCRITTO A MANO DENTRO UN TEST È UN CAMPIONE, E UN CAMPIONE
    //   SCEGLIE CHI NON GUARDARE.
    //
    // Chi scrive l'elenco sceglie i casi che ha in mano — quelli montati,
    // quelli con la pagina già aperta. È esattamente il criterio della regola
    // 42: il caso comodo, non il caso diverso. E la scelta non si vede mai nel
    // diff, perché un elenco di tre nomi ha la stessa forma di un elenco di
    // sette.
    //
    // Derivarlo da `FAMIGLIE` è la stessa mossa del baseline: LA FONTE DECIDE,
    // NON CHI SCRIVE IL TEST. Una famiglia nuova entra nel giro da sola il
    // giorno in cui viene aggiunta al censimento — e chi la aggiunge non deve
    // sapere che questo blocco esiste.
    //
    // ⚠️ E LA DISTINZIONE CHE RENDE LA LEZIONE USABILE INVECE CHE UN DIVIETO,
    // trovata al ⑥-zero su `PASSO_DI` e valida ovunque:
    //
    //   NON È L'ELENCO A MANO. È LA PRETESA DI COMPLETEZZA.
    //
    // Un **rappresentante** scritto a mano è onesto: `PASSO_DI` nomina UN passo
    // per famiglia, non dice quali siano tutti i passi, e la completezza la
    // porta `FAMIGLIE` — che è la fonte. Toglierlo non renderebbe niente più
    // sicuro: renderebbe solo più lungo il giro per scegliere un passo
    // qualunque.
    //
    // Un elenco che dice **«questi sono tutti»** è un campione travestito, e
    // `COPPIE` lo era: sei voci che pretendevano di essere tutte le famiglie a
    // più kind, e una delle sei non conteneva quello che il nome diceva.
    //
    // *La domanda da farsi davanti a un elenco scritto a mano non è «è
    // scritto a mano?» ma «se il mondo cambia, questo elenco diventa
    // SBAGLIATO o solo VECCHIO?». Un rappresentante diventa vecchio e il test
    // continua a dire il vero; un elenco che pretende completezza diventa
    // falso e il test continua a dire verde.*
    // ⚠️ SI DERIVA DA `uscitaVersoMappa`, NON DA `tornaAllaMappa` — dal
    // 2026-09-17, e cambia chi viene guardato.
    //
    // `tornaAllaMappa` e' `null` per Personalizza perche' quel modulo non ha un
    // «← Mappa» (categoria Inizio, regola 17) — risposta giusta a QUELLA
    // domanda, e risposta sbagliata a quella che serve qui, che e' «come torno
    // alla mappa per riaprire». Il campo rispondeva a tutte e due, e per sei
    // famiglie su otto le due risposte coincidevano: sulla settima divergono, e
    // il `null` escludeva Personalizza da questo ciclo senza che si vedesse.
    // La distinzione per esteso sta accanto a `FAMIGLIE` in listener-census.js.
    //
    // Adesso il filtro non esclude nessuno: OTTO famiglie, e Personalizza e'
    // l'unica il cui blocco di listener, dopo il ⑦, non sarebbe protetto da
    // nient'altro — non da [A], che apre una volta sola, e non da [E], che
    // guarda solo chi ha piu' di un kind.
    const conRitorno = Object.keys(FAMIGLIE).filter(function (f) { return FAMIGLIE[f].uscitaVersoMappa; });
    for (const fam of conRitorno) {
      const passo = PASSO_DI[fam];
      const page = await nuovaPagina(browser, 'L2' + fam, stepsBefore(passo));
      const indietro = FAMIGLIE[fam].uscitaVersoMappa;
      // Il riferimento si prende DOPO la prima apertura, non prima: alcuni
      // listener nascono solo quando il modulo si apre la prima volta.
      await openModule(page, passo);
      const base = await page.evaluate(() => JSON.parse(JSON.stringify(window.__reg)));
      await page.click('#' + indietro);
      await page.waitForSelector('#view-map.is-active', { timeout: 10000 });
      for (let giro = 0; giro < 3; giro++) {
        await openModule(page, passo);
        let tornato = true;
        await page.click('#' + indietro).catch(function () { tornato = false; });
        await page.waitForSelector('#view-map.is-active', { timeout: 10000 })
          .catch(function () { tornato = false; });
        if (!tornato) { log('[C] ' + fam + ': si torna alla mappa (giro ' + (giro + 1) + ')', false); break; }
      }
      const reg = await page.evaluate(() => window.__reg);
      // Il confronto è col RIFERIMENTO della prima apertura, non con «1»:
      // quello che non deve succedere è che il conto CRESCA riaprendo.
      const cresciuti = listenerDi(fam).filter(function (l) {
        const k = l.id + '|' + l.tipo;
        return (reg[k] || 0) > (base[k] || 0);
      }).map(function (l) {
        const k = l.id + '|' + l.tipo;
        return l.id + '/' + l.tipo + ': ' + base[k] + ' → ' + reg[k];
      });
      const zero = listenerDi(fam).filter(function (l) { return (reg[l.id + '|' + l.tipo] || 0) === 0; })
        .map(function (l) { return l.id + '/' + l.tipo; });
      log('[C] ' + fam + ': dopo TRE aperture nessun listener è CRESCIUTO',
        cresciuti.length === 0, cresciuti.join(', '));
      log('[C] ' + fam + ': e nessuno è sparito', zero.length === 0, zero.join(', '));
      await page.close();
    }
  }

  // ── [D] E I COLPI SI CONTANO DAVVERO, non solo le registrazioni ──────
  //
  // Le registrazioni dicono quanti listener ci sono; questo dice quante volte
  // l'azione PARTE per un click. Sono due misure diverse e servono entrambe: un
  // listener registrato potrebbe essere stato tolto con removeEventListener, e
  // due registrazioni sullo stesso handler identico contano una volta sola nel
  // DOM. Qui il conto è sull'effetto osservato al gesto.
  {
    const page = await nuovaPagina(browser, 'L3', stepsBefore('speedMatchEngIta'));
    await openModule(page, 'speedMatchEngIta');
    const colpi = await page.evaluate(() => {
      var el = document.getElementById('speed-match-help-btn');
      if (!el) return null;
      var n = 0;
      el.addEventListener('click', function () { n++; }, true);
      el.click();
      return n;
    });
    log('[D] Un click su un pulsante del modulo produce ESATTAMENTE un colpo',
      colpi === 1, String(colpi));
    await page.close();
  }

  // ── [E] PIU' KIND SERVITI DALLA STESSA `open` ───────────────────────
  //
  // ⚠️ E' IL CASO CHE IL BLOCCO [C] NON VEDE.
  //
  // [C] apre e riapre lo STESSO passo: protegge dalla riapertura. Ma CINQUE
  // `open` su otto servono piu' di un `kind` — `openDialogo` tre,
  // `openStoryCards`, `openVoiceCoach`, `openMatch`, `openSpeedMatch` due — e
  // con la guardia sbagliata aprirne uno diverso attaccherebbe un'altra copia
  // dello stesso blocco, senza che nessuna riapertura sia mai avvenuta.
  //
  // **La chiave della guardia e' il BLOCCO, cioe' la funzione `open`, non il
  // `kind`.** Questo blocco e' cio' che lo protegge: senza, la regola sarebbe
  // scritta in un commento e verificata da nessuno.
  //
  // ⚠️ L'ELENCO SI DERIVA, E PRIMA ERA SCRITTO A MANO — corretto il 2026-09-16.
  //
  // La forma vecchia portava dentro il test un oggetto `COPPIE` con sei voci, e
  // una delle sei non conteneva quello che il nome diceva:
  //
  //     flashcard: ['flashcardAEngIta', 'flashcardAItaEng']   // due PASSI, UN kind
  //
  // Il blocco apriva due descrittori dello stesso kind e stampava «aprire i
  // suoi 2 kind non duplica il blocco». **Verificava cinque famiglie e ne
  // dichiarava sei**, e il verde su flashcard non provava la chiave: con
  // `'flashcard'` e con `module.kind` il valore e' lo stesso identico.
  //
  // *E' la lezione scritta accanto a `[C]` lo stesso giorno, che trova il suo
  // secondo caso nello stesso file. Adesso la coppia passo↔kind viene da
  // `descrittori()` e il raggruppamento per blocco da `BI.moduli` dell'app
  // viva: la fonte decide, non chi scrive il test.*
  {
    const paginaBI = await nuovaPagina(browser, 'L4bi', []);
    const blocchi = await bloccheDiKind(paginaBI);
    await paginaBI.close();
    const passoDelKind = descrittori();   // passo -> kind
    // kind -> il primo passo che lo usa. Serve perche' si apre dalla MAPPA, e
    // la mappa conosce i passi, non i kind.
    const unPassoPer = {};
    Object.keys(passoDelKind).forEach(function (passo) {
      const k = passoDelKind[passo];
      if (!unPassoPer[k]) unPassoPer[k] = passo;
    });

    // famiglia -> i suoi kind. Il ponte e' `PASSO_DI[fam]`, che resta scritto a
    // mano ed e' legittimo: nomina UN rappresentante per famiglia, non pretende
    // di essere completo — la completezza viene da `FAMIGLIE`, che e' la fonte.
    const kindDi = {};
    Object.keys(FAMIGLIE).forEach(function (fam) {
      const kindRappr = passoDelKind[PASSO_DI[fam]];
      const blocco = blocchi.find(function (b) { return b.indexOf(kindRappr) !== -1; });
      kindDi[fam] = blocco || [];
    });

    const conPiuKind = Object.keys(kindDi).filter(function (f) { return kindDi[f].length > 1; }).sort();
    const conUnKind = Object.keys(kindDi).filter(function (f) { return kindDi[f].length === 1; }).sort();

    // ── [F] LA MAPPA SU CUI [E] GIRA, CONTROLLATA A SUA VOLTA ──────────
    //
    // ⚠️ SENZA QUESTO, [E] PUO' RESTARE VERDE SMETTENDO DI GUARDARE.
    //
    // [E] deriva il proprio elenco invece di ricopiarlo, e questo toglie il
    // difetto del campione — ma ne apre uno nuovo: una derivazione che torna
    // MENO di quello che dovrebbe fa saltare famiglie **in silenzio**, ed e' un
    // verde piu' grande di prima. Se `descrittori()` tornasse vuoto perche'
    // `MODULE_DESCRIPTORS` e' stato spostato, ogni famiglia risulterebbe a kind
    // singolo e [E] non aprirebbe niente: zero asserzioni, zero rossi.
    //
    // Le tre righe qui sotto incrociano DUE fonti indipendenti — il testo dei
    // descrittori in index.html e il registro vivo `BI.moduli` — e congelano il
    // conto misurato. Non provano che l'app sia giusta: provano che [E] sta
    // ancora guardando quello che dice di guardare.
    const kindDaiDescrittori = Object.keys(passoDelKind).map(function (p) { return passoDelKind[p]; })
      .filter(function (k, i, a) { return a.indexOf(k) === i; }).sort();
    const kindRegistrati = blocchi.reduce(function (a, b) { return a.concat(b); }, []).sort();
    log('[F] I kind dei descrittori e quelli registrati in BI.moduli sono gli stessi',
      kindDaiDescrittori.join(',') === kindRegistrati.join(','),
      'descrittori: ' + kindDaiDescrittori.join(',') + ' | registrati: ' + kindRegistrati.join(','));

    // ⚠️ I NUMERI SONO MISURATI IL 2026-09-16, E DUE COMMENTI DICEVANO SEI.
    // `app/spazio.js` e il commento di questo blocco dicevano «SEI `open` su
    // otto servono piu' di un kind» e nominavano `openFlashcard` fra loro.
    // Sono CINQUE. Il numero falso e' sopravvissuto quattro giri perche' non
    // c'era nessuna asserzione sopra: adesso c'e'.
    log('[F] Le famiglie servite da piu` di un kind sono 5, e sono queste',
      conPiuKind.join(',') === 'dialogo,match,speedMatch,storyCards,voice',
      conPiuKind.join(','));

    // ⚠️ E QUESTA E' LA CATEGORIA, non un'eccezione di Flash Card.
    //
    //     Su una famiglia a kind singolo — o con un kind solo per piu'
    //     descrittori — LA CHIAVE SBAGLIATA PASSA VERDE. Il verde non prova la
    //     chiave: la prova la regola.
    //
    // Sono TRE: `openFlashcard` (un kind, due descrittori), `openRepeatAloud` e
    // `openCustomize` (un kind ciascuna). Su di loro `BI.unaVoltaSola(nome)` con
    // `nome = 'flashcard'` e con `nome = module.kind` valgono **la stessa
    // stringa**, quindi nessuna corsa puo' distinguerle — ne' questo blocco, ne'
    // [C], ne' una falsificazione.
    //
    // *Per questo la chiave giusta si scrive lo stesso: e' la forma in cui una
    // regola sbagliata sopravvive, e sopravvive proprio dove nessuno la vede
    // cadere. Se un giorno una di queste tre prende un secondo kind, questa
    // riga diventa rossa — ed e' l'unico avviso che arrivera'.*
    log('[F] Le famiglie a kind singolo, dove la chiave sbagliata passerebbe verde, sono 3',
      conUnKind.join(',') === 'flashcard,personalizza,repeatAloud',
      conUnKind.join(','));

    for (const fam of conPiuKind) {
      const passi = kindDi[fam].map(function (k) { return unPassoPer[k]; });
      // ⚠️ Un kind registrato senza un descrittore che lo usi darebbe `undefined`
      // qui, e `stepsBefore(undefined)` alza un'eccezione: il test MORIREBBE
      // invece di FALLIRE (famiglia ⓪-septies in tests/ERRORI-INGOIATI.md).
      // [F] lo prende gia' — gira prima apposta — ma la riga resta perche' una
      // difesa che dipende dall'ordine di due blocchi e' una difesa fragile.
      if (passi.some(function (x) { return !x; })) {
        log('[E] ' + fam + ': ogni suo kind ha un passo nella sequenza', false,
          kindDi[fam].join(',') + ' -> ' + passi.join(','));
        continue;
      }
      // L'ultimo passo della lista e' il piu' avanti nella sequenza: si sbloccano
      // tutti i precedenti una volta sola.
      passi.sort(function (a, b) { return stepsBefore(a).length - stepsBefore(b).length; });
      const page = await nuovaPagina(browser, 'L4' + fam, stepsBefore(passi[passi.length - 1]));
      let base = null; const cresciuti = [];
      for (const passo of passi) {
        await openModule(page, passo);
        const reg = await page.evaluate(() => window.__reg);
        if (base === null) { base = reg; }
        else {
          listenerDi(fam).forEach(function (l) {
            const k = l.id + '|' + l.tipo;
            if ((reg[k] || 0) > (base[k] || 0)) {
              cresciuti.push(passo + ': ' + l.id + '/' + l.tipo + ' ' + base[k] + ' → ' + reg[k]);
            }
          });
        }
        // Stessa domanda di [C] — «come torno alla mappa» — quindi stesso campo.
        const indietro = FAMIGLIE[fam].uscitaVersoMappa;
        if (indietro) {
          await page.click('#' + indietro).catch(function () {});
          await page.waitForSelector('#view-map.is-active', { timeout: 10000 }).catch(function () {});
        }
      }
      log('[E] ' + fam + ': aprire i suoi ' + kindDi[fam].length + ' kind (' + passi.join(', ') + ') non duplica il blocco',
        cresciuti.length === 0, cresciuti.join(' | '));
      await page.close();
    }
  }

  await browser.close();
  console.log('\n=== LISTENER UNA VOLTA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
