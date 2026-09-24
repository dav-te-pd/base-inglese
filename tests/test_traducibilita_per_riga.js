// PROTEGGE: che sia la RIGA del magazzino a dire se il suo valore si traduce,
// e non il nome della tabella che la contiene.
//
// PROTEGGE ANCHE, dal 2026-09-24 (passo 1.8-bis ④): che una personalizzazione
// gia' salvata non sparisca quando un id viene rinominato — ne' in silenzio
// ([M1], la mappa delle migrazioni), ne' finendo su un valore che nessuno ha
// scelto ([M3], il ripiego sul predefinito invece che sulla prima riga). E che
// la mappa resti append-only ([M2]): una riga tolta da li' non rompe niente
// qui e rompe il profilo di chi l'aveva scelta, la prossima volta che lo apre.
//
// COSA SI PERDE SENZA QUESTO FILE. Fino al 2026-09-20 la risposta si deduceva
// dal contenitore: `buildSlotFields` guardava `slot.table.indexOf('people.')`
// e ne ricavava `isPersonName`. Era esatto, e teneva solo finché le famiglie
// restavano due. Un cognome che si traduce, o una città che NON si traduce,
// non avevano modo di esistere: per ottenerli bisognava spostare una riga in
// un'altra tabella, cioè cambiare a quale slot appartiene per una ragione che
// con quello slot non c'entra niente.
//
// ⚠️ E L'ASSERZIONE CHE CONTA È LA [B], non le altre.
//
// Le [A] guardano la FORMA del file — che ogni riga dichiari `traducibile`,
// che le colonne vuote siano sparite. Una forma si può rispettare lasciando
// il codice esattamente com'era: il file avrebbe la colonna nuova e
// `resolveSlotValue` continuerebbe a leggere il nome della tabella, verde su
// tutta la linea. La [B] è l'unica che distingue le due versioni.
//
// COME LA [B] DISTINGUE, e perché non basta guardare l'app com'è. Sul
// contenuto vero le due regole danno la STESSA risposta su tutte e 49 le
// righe — è voluto, la migrazione ha riprodotto il comportamento riga per
// riga. Quindi qualunque asserzione sui dati veri è verde con tutte e due le
// forme, cioè non prova niente (regola 44: sarebbe vera per costruzione).
//
// La [B] serve al browser una riga che le due regole leggono in modo OPPOSTO:
// una riga di `places.departures` — quindi «tabella di toponimi», che la
// regola vecchia traduce sempre — che dichiara `traducibile: false`. La
// forma vecchia risponde "Turin", la nuova "Torino". **Una sola riga, e le
// due versioni si separano.**
//
// IL CASO PIÙ DIVERSO (regola 42): la riga NUDA, cioè un'età. Le età non
// vivono nel magazzino condiviso: stanno dentro il file dell'episodio
// (`ageOptions`) come numeri, e `slotOptions` le normalizza. Sono le uniche
// opzioni dell'app che **non dichiarano `traducibile` affatto** — a tutte le
// altre manca un campo, a queste manca la riga intera. La [C] le guida, ed è
// il caso che un'implementazione che desse per scontata la colonna
// lascerebbe rotto mentre tutto il resto resta verde.
//
// LIMITE DICHIARATO: questo file non verifica che il valore di `traducibile`
// su ogni riga sia quello GIUSTO dal punto di vista didattico — quello è
// contenuto, e la sua fonte è docs/inglese/it/inglese-it-tabelle-personalizzazione.md.
// Verifica che il meccanismo legga la riga.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, globDati } = require('./test-env');
const { openModule } = require('./map-driver');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const FILE_TABELLE = 'data/inglese/it/inglese-it-tabelle-personalizzazione.json';

const mockInit = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
};

// Arriva fino alla mappa di `gate` — l'unico episodio che usa sia una tabella
// di persone sia una di luoghi sia una tabella interna: serve tutte e tre.
// `seme` — dal passo 1.8-bis (4): i valori di personalizzazione gia' salvati
// prima che l'app li legga. Va scritto QUI e non dopo: `loadCustomValues` gira
// dentro l'apertura di Personalizza, e un seme che arriva dopo non lo vede.
async function apriMappa(page, utente, seme) {
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (a) {
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + a.u, '1');
    if (a.seme) {
      localStorage.setItem(window.BI.customValuesKey('gate', a.u), JSON.stringify(a.seme));
    }
  }, { u: utente, seme: seme || null });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
  // ⚠️ SERVE APRIRE PERSONALIZZA, e non è un giro in più per comodità:
  // `episode.slotFields` non esiste finché `ensureEpisodeSlotFields` non ha
  // aspettato il magazzino, e chi lo fa è l'apertura di quel modulo. Senza,
  // `resolveSlotValue` non trova il campo e cade — che è il comportamento
  // giusto, ma non quello che questo file vuole misurare.
  await openModule(page, 'personalizzazione');
  await page.waitForFunction(function () {
    return document.querySelectorAll('#view-customize select').length > 0;
  }, { timeout: 15000 });
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] LA FORMA DEL MAGAZZINO ───────────────────────────────────────
  //
  // Si legge dal disco, non dal browser: è il file a doverla avere, e un
  // controllo fatto a pagina aperta guarderebbe anche gli override.
  {
    const tabelle = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
    const righe = [];
    ['people', 'places'].forEach(function (fam) {
      Object.keys(tabelle[fam]).forEach(function (nome) {
        tabelle[fam][nome].forEach(function (r) { righe.push({ fam: fam, nome: nome, r: r }); });
      });
    });

    log('[A] Il magazzino ha delle righe da guardare', righe.length > 0, String(righe.length));

    const senza = righe.filter(function (x) { return typeof x.r.traducibile !== 'boolean'; });
    log('[A] Ogni riga del magazzino condiviso DICHIARA se si traduce',
      senza.length === 0, senza.map(function (x) { return x.fam + '.' + x.nome + '/' + x.r.value; }).join(', '));

    const conVuote = righe.filter(function (x) {
      return ('fr' in x.r) || ('es' in x.r) || ('de' in x.r);
    });
    log('[A] Nessuna riga porta più le colonne fr/es/de',
      conVuote.length === 0, conVuote.map(function (x) { return x.fam + '.' + x.nome + '/' + x.r.value; }).join(', '));
  }

  // ── [A2] IL TEST ROVESCIATO, NELLA FORMA CHE OGGI È POSSIBILE ────────
  //
  // Non «ogni riga del magazzino è usata» — falso per costruzione, il
  // magazzino è più grande della vetrina — ma il suo rovescio: **ogni cosa
  // che un episodio NOMINA deve esistere.** Oggi un episodio nomina una
  // tabella e un valore predefinito; il giorno che nominerà gli id uno per
  // uno (regola 5.7 del markdown) questa è la riga che si allarga.
  //
  // Perché conta, ⚠️ E LA RAGIONE È CAMBIATA IL 2026-09-24 (passo 1.8-bis ④).
  //
  // Qui c'era scritto: «`resolveSlotValue` su un id che non esiste ricade in
  // silenzio sulla PRIMA opzione». **Non è più vero**: da quel passo ricade
  // sul **predefinito dello slot**, e `opts[0]` resta solo come ultima
  // spiaggia. *Una motivazione falsa in testa a un blocco si legge come una
  // verifica già fatta, quindi va corretta e non lasciata invecchiare.*
  //
  // Il blocco protegge **di più** di prima, non di meno: adesso è proprio lui
  // a difendere l'ultima spiaggia. Se un predefinito non esiste dentro la sua
  // tabella, il ripiego nuovo non trova niente e si torna a `opts[0]`, cioè al
  // comportamento silenzioso di ieri — e questa è la riga che lo vede.
  {
    const tabelle = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
    const episodi = fs.readdirSync(repoPath('data/inglese/it'))
      .filter(function (f) { return /^inglese-it-.*\.json$/.test(f); });

    log('[A2] Ci sono episodi da controllare', episodi.length > 0, String(episodi.length));

    const mancanti = [], defMancanti = [];
    episodi.forEach(function (f) {
      const ep = JSON.parse(fs.readFileSync(repoPath('data/inglese/it/' + f), 'utf8'));
      (ep.personalizationTablesUsed || []).forEach(function (slot) {
        const locale = slot.table.indexOf('episode.') === 0;
        const radice = locale ? ep : tabelle;
        const strada = (locale ? slot.table.slice('episode.'.length) : slot.table).split('.');
        let v = radice;
        for (let i = 0; i < strada.length && v; i++) { v = v[strada[i]]; }
        if (!Array.isArray(v) || v.length === 0) { mancanti.push(f + ' → ' + slot.table); return; }
        const valori = v.map(function (x) { return (x && typeof x === 'object') ? x.value : String(x); });
        if (valori.indexOf(String(slot.default)) === -1) {
          defMancanti.push(f + ' → ' + slot.key + ' = "' + slot.default + '"');
        }
      });
    });

    log('[A2] Ogni tabella nominata da un episodio esiste e non è vuota',
      mancanti.length === 0, mancanti.join(', '));
    log('[A2] Ogni valore predefinito esiste dentro la sua tabella',
      defMancanti.length === 0, defMancanti.join(', '));
  }

  // ── [B] CHI DECIDE È LA RIGA — l'asserzione che distingue le versioni ─
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);

    // ⚠️ GLI ID PORTANO IL PREFISSO DELLA TABELLA DAL 2026-09-23
    // (`torino` -> `orig-torino`), e questa riga li scrive a mano. Con l'id
    // vecchio il test NON moriva: `resolveSlotValue` non trova la riga e
    // ripiega su `opts[0]` — quindi «Torino» tornava «Mondovì», e
    // l'asserzione accusava la TRADUCIBILITA' mentre il guasto era l'id.
    // Una riga di `places` — che la regola vecchia traduceva SEMPRE — che
    // dichiara di non tradursi. È l'unico modo di far divergere le due forme:
    // sul contenuto vero danno la stessa risposta su tutte le righe.
    await page.route(globDati('tabelle-personalizzazione.json'), async function (route) {
      const vero = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
      vero.places.departures = vero.places.departures.map(function (r) {
        return r.value === 'orig-torino' ? Object.assign({}, r, { traducibile: false }) : r;
      });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(vero) });
    });

    await apriMappa(page, 'TradRiga');

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      return {
        // il toponimo che dichiara di NON tradursi
        torino: window.BI.resolveSlotValue(ep, 'partenza', 'orig-torino', 'en'),
        // un toponimo qualunque che non lo dichiara: si traduce come sempre
        mondovi: window.BI.resolveSlotValue(ep, 'partenza', 'orig-mondovi', 'en'),
        // un nome proprio: non si traduce, come sempre
        papa: window.BI.resolveSlotValue(ep, 'papa', 'papa-marco', 'en')
      };
    });

    log('[B] Una riga di `places` che dichiara traducibile:false NON si traduce',
      esito.torino === 'Torino', JSON.stringify(esito));
    log('[B] ...e le sue vicine della stessa tabella si traducono ancora',
      esito.mondovi === 'Mondovì', JSON.stringify(esito));
    log('[B] Un nome proprio resta com\'è, come prima',
      esito.papa === 'Marco', JSON.stringify(esito));
    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] IL CASO PIÙ DIVERSO: la riga che non esiste ──────────────────
  //
  // Le età sono numeri nudi nel file dell'episodio. Non hanno la colonna:
  // non hanno la riga. Devono continuare a funzionare, e il valore mostrato
  // dev'essere quello scelto — non la prima opzione della lista.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apriMappa(page, 'TradNuda');

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      const campo = ep.slotFields.find(function (f) { return f.key === 'figliaEta'; });
      return {
        en: window.BI.resolveSlotValue(ep, 'figliaEta', '14', 'en'),
        it: window.BI.resolveSlotValue(ep, 'figliaEta', '14', 'it'),
        dichiara: campo ? campo.options.some(function (o) { return o && typeof o === 'object'; }) : null
      };
    });

    log('[C] Un\'opzione nuda (un\'età) non dichiara niente e resta un valore nudo',
      esito.dichiara === false, JSON.stringify(esito));
    log('[C] ...e si risolve lo stesso, nella lingua chiesta',
      esito.en === '14' && esito.it === '14', JSON.stringify(esito));
    log('[C] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [M] LE MIGRAZIONI E IL RIPIEGO — passo 1.8-bis ④ ─────────────────
  //
  // Due metà di un difetto solo, e ognuna ha la sua asserzione **perché il
  // rosso deve dire quale**: [M1] nomina un id VECCHIO, [M3] un id che non è
  // MAI esistito.
  {
    const mappa = JSON.parse(fs.readFileSync(
      repoPath('data/inglese/it/inglese-it-migrazioni-personalizzazione.json'), 'utf8'));

    // ── [M2] LA GUARDIA APPEND-ONLY ────────────────────────────────────
    //
    // Una riga tolta da qui non rompe niente e non lascia un rosso: rompe il
    // profilo di chi aveva scelto quel valore, la prossima volta che lo apre.
    // È il difetto che non si annuncia (regola 37), quindi la difesa è un
    // elenco esterno e non una raccomandazione.
    const baseline = fs.readFileSync(repoPath('tests/BASELINE-MIGRAZIONI.txt'), 'utf8')
      .split('\n').map(function (r) { return r.trim(); })
      .filter(function (r) { return r && r[0] !== '#'; });

    const spariti = baseline.filter(function (riga) {
      const parti = riga.split(/\s+/);
      const perSlot = mappa.slot[parti[0]];
      return !perSlot || !Object.prototype.hasOwnProperty.call(perSlot, parti[1]);
    });

    log('[M2] Il baseline delle migrazioni non è vuoto', baseline.length > 0, String(baseline.length));
    log('[M2] Nessun id coperto è sparito dalla mappa (append-only)',
      spariti.length === 0, spariti.join(', '));

    // Il rovescio: ogni id NUOVO che la mappa promette deve esistere davvero
    // nel magazzino di oggi. Senza, la migrazione tradurrebbe un id morto in
    // un altro id morto — e il ripiego di [M3] coprirebbe il buco in silenzio.
    const tabelle = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
    const tuttiId = [];
    ['people', 'places'].forEach(function (fam) {
      Object.keys(tabelle[fam] || {}).forEach(function (k) {
        (tabelle[fam][k] || []).forEach(function (r) { tuttiId.push(r.value); });
      });
    });
    const arrivoMorto = [];
    Object.keys(mappa.slot).forEach(function (s) {
      Object.keys(mappa.slot[s]).forEach(function (v) {
        if (tuttiId.indexOf(mappa.slot[s][v]) === -1) arrivoMorto.push(s + ': ' + v + ' → ' + mappa.slot[s][v]);
      });
    });
    log('[M2] Ogni id di arrivo esiste nel magazzino di oggi',
      arrivoMorto.length === 0, arrivoMorto.join(', '));
  }

  // ── [M1] ⓐ UN PROFILO SALVATO COL NOME VECCHIO TORNA QUELLO GIUSTO ───
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);

    // Gli id di PRIMA del 2026-09-23, quelli che un profilo vero porta ancora.
    // `luca` e `torino` non sono i predefiniti: se la migrazione non gira, il
    // valore non corrisponde a niente e si finisce sul predefinito — cioè
    // `papa-marco` e `orig-mondovi`, che è proprio il danno da misurare.
    await apriMappa(page, 'TradMigra', { papa: 'luca', partenza: 'torino', cognome: 'ferrari' });

    const esito = await page.evaluate(function () {
      const v = window.BI.valoriCorrenti();
      return { papa: v.papa, partenza: v.partenza, cognome: v.cognome };
    });

    log('[M1] Un nome salvato con l\'id vecchio torna il suo, non il predefinito',
      esito.papa === 'papa-luca', JSON.stringify(esito));
    log('[M1] ...e vale anche per una città', esito.partenza === 'orig-torino', JSON.stringify(esito));
    log('[M1] ...e per un cognome', esito.cognome === 'cognome-ferrari', JSON.stringify(esito));
    log('[M1] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [M3] ⓑ UN ID CHE NON È MAI ESISTITO CADE SUL PREDEFINITO ─────────
  //
  // ⚠️ SI MISURA SU UN'ETÀ, E NON PER COMODITÀ: È L'UNICO POSTO DOVE SI VEDE.
  //
  // Misurato sui nove slot dei due episodi: il predefinito coincide con la
  // prima riga **su sette**. `papa` → `papa-marco` è sia def sia `opts[0]`;
  // idem `partenza`, `cognome`, `destinazione`. Su quei sette le due forme
  // danno la stessa risposta, cioè sarebbero vere per costruzione (regola 44).
  //
  // Gli unici due che divergono sono `figliaEta` (def `16`, prima riga `12`) e
  // `figlioEta` (def `8`, prima riga `4`) — **e sono anche il caso più diverso
  // della regola 42: la riga NUDA**, l'unica opzione dell'app a cui manca la
  // riga intera invece di un campo. Il caso che distingue e il caso più
  // diverso sono lo stesso, e non è una fortuna: le età sono l'unica famiglia
  // che non passa dal magazzino condiviso.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apriMappa(page, 'TradRipiego');

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      const campo = ep.slotFields.find(function (f) { return f.key === 'figliaEta'; });
      return {
        sconosciuto: window.BI.resolveSlotValue(ep, 'figliaEta', 'non-esiste-piu', 'it'),
        def: campo.def,
        prima: campo.options[0],
        figlio: window.BI.resolveSlotValue(ep, 'figlioEta', 'non-esiste-piu', 'it')
      };
    });

    log('[M3] Il caso distingue davvero: predefinito e prima riga sono diversi',
      esito.def !== esito.prima, JSON.stringify(esito));
    log('[M3] Un id sconosciuto cade sul PREDEFINITO dello slot, non sulla prima riga',
      esito.sconosciuto === esito.def, JSON.stringify(esito));
    log('[M3] ...e vale anche per il secondo slot che diverge',
      esito.figlio === '8', JSON.stringify(esito));
    log('[M3] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [P] IL PAESE SULLA STESSA RIGA — passo 1.8-bis ② ─────────────────
  //
  // Una riga del magazzino porta piu' di un valore: una citta' di partenza
  // porta anche il suo paese, e la battuta li vuole tutti e due. Prima `Italy`
  // era scritto A MANO nella battuta, quindi con Lugano lo studente avrebbe
  // letto «I am from Lugano, Italy» — due frasi false su otto opzioni, e
  // **nessun test le avrebbe viste**, perche' nessuno sceglie Lugano.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    // Il seme E' la prova: `orig-lugano` e' proprio l'opzione che prima non
    // poteva esistere.
    await apriMappa(page, 'TradPaese', { partenza: 'orig-lugano' });

    const esito = await page.evaluate(async function () {
      const ep = window.BI.episodioCorrente();
      const v = window.BI.valoriCorrenti();
      // La battuta si prende dal file dell'episodio, non incollata qui: il
      // testo e' contenuto e cambia con lui (regola 4). Se domani `d-4` dicesse
      // un'altra cosa, questo test la segue invece di misurare una copia.
      const dati = await window.BI.loadEpisodeData({ dataFile: window.BI.episodeDataFile(ep.id) });
      const d4 = dati.levels.D.items.find(function (i) { return i.id === 'd-4'; });
      return {
        en: window.BI.fillTemplate(d4.english, ep, v, 'en'),
        it: window.BI.fillTemplate(d4.italian, ep, v, 'it'),
        // Il caso in cui il campo NON esiste sulla riga: deve tornare la riga,
        // non `undefined` a schermo.
        //
        // ⚠️ IL `try` NON E' PRUDENZA, E NON INGOIA NIENTE: senza il ritorno
        // alla riga questa chiamata **alza** (`picked['paese']` e' undefined,
        // e leggergli `.it` esplode), e un'eccezione qui dentro uccide il FILE
        // INTERO — niente SUMMARY, niente riga rossa, nessun nome. Catturandola
        // e restituendola come stringa, il rosso arriva sull'asserzione giusta
        // e **dice quale caso e' caduto**. L'errore non sparisce: diventa il
        // valore che l'asserzione confronta.
        papaConCampo: (function () {
          try { return window.BI.resolveSlotValue(ep, 'papa', 'papa-marco', 'en', 'paese'); }
          catch (e) { return 'ALZA: ' + e.message; }
        })(),
        etaConCampo: (function () {
          try { return window.BI.resolveSlotValue(ep, 'figliaEta', '14', 'en', 'paese'); }
          catch (e) { return 'ALZA: ' + e.message; }
        })()
      };
    });

    // ⚠️ QUESTA E' LA RIGA CHE DISTINGUE LE DUE VERSIONI, e non perche' il
    // testo cambia: con la regex vecchia (`\w` non contiene il punto)
    // `{{partenza.paese:en}}` non veniva nemmeno RICONOSCIUTO e restava a
    // schermo come testo. Il guasto nomina se stesso.
    log('[P] La battuta inglese porta il paese della riga scelta',
      esito.en === 'I am from Lugano, Switzerland.', esito.en);
    log('[P] ...e quella italiana il suo',
      esito.it === 'Vengo da Lugano, in Svizzera.', esito.it);
    log('[P] Nessun segnaposto resta a schermo',
      esito.en.indexOf('{{') === -1 && esito.it.indexOf('{{') === -1,
      esito.en + ' | ' + esito.it);

    // ⚠️ IL CASO PIU' DIVERSO (regola 42): una riga SENZA quel campo.
    //
    // Le tabelle non sono tutte uguali — `places.departures` porta il paese,
    // `people.papa` no, e `places.destinations` non lo prendera' mai perche'
    // nessuna battuta dice il paese di destinazione. Un'implementazione che
    // desse per scontato `picked[campo]` lascerebbe `undefined` a schermo:
    // **un buco non si vede nei test e si vede allo studente.**
    //
    // I due casi qui sotto sono diversi fra loro, ed e' voluto: `papa` e' una
    // riga vera a cui manca una colonna; l'eta' e' una riga che **non esiste
    // affatto** nel magazzino — e' un numero nudo che `slotOptions` trasforma
    // in oggetto. E' l'unica famiglia dell'app a cui manca la riga intera.
    log('[P] Un campo che la riga non ha torna la riga, non «undefined»',
      esito.papaConCampo === 'Marco', esito.papaConCampo);
    log('[P] ...e vale anche per una riga NUDA, che nel magazzino non c\'e\'',
      esito.etaConCampo === '14', esito.etaConCampo);
    log('[P] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== TRADUCIBILITA PER RIGA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
