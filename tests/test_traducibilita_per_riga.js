// PROTEGGE: che sia la RIGA del magazzino a dire se il suo valore si traduce,
// e non il nome della tabella che la contiene — altrimenti un cognome che si
// traduce, o una citta' che non si traduce, non avrebbero modo di esistere se
// non spostando la riga in un'altra tabella. E con lei: che ogni riga lo
// DICHIARI e nessuna porti piu' le colonne `fr`/`es`/`de` ([A]); che ogni
// tabella nominata da un episodio esista e ogni valore predefinito esista
// dentro la sua tabella ([A2]); che una personalizzazione salvata non sparisca
// quando un id viene rinominato, che la mappa delle migrazioni resti
// append-only e che un id mai esistito cada sul PREDEFINITO dello slot e non
// sulla prima riga ([M1], [M2], [M3]); che un campo che la riga non ha non
// diventi «undefined» ([P]); e che il suffisso di un segnaposto sia un RUOLO
// (`:target`, `:native`), con un suffisso vecchio che resta segnaposto
// visibile e mai «undefined» ([S]).
//
// PROTEGGE ANCHE, dal 2026-09-24 (passo 1.8-bis ④): che una personalizzazione
// gia' salvata non sparisca quando un id viene rinominato — ne' in silenzio
// ([M1], la mappa delle migrazioni), ne' finendo su un valore che nessuno ha
// scelto ([M3], il ripiego sul predefinito invece che sulla prima riga). E che
// la mappa resti append-only ([M2]): una riga tolta da li' non rompe niente
// qui e rompe il profilo di chi l'aveva scelta, la prossima volta che lo apre.
//
// ⚠️ DAL 2026-10-30 I BLOCCHI [C] ED [E] NON CI SONO PIU': il loro soggetto era
// l'eta' come SLOT — le due colonne di `ages.anni` (la cifra si sceglie, la
// parola si sente), il pezzo di tabella preso con la colonna «righe», la skill
// che citava l'eta' col suffisso giusto. L'eta' adesso e' scritta nella
// battuta, e `ages.anni` e la colonna «righe» sono uscite (regola 50). La
// citazione col suffisso di ruolo resta provata da [S].
//
// PROTEGGE ANCHE, dal 2026-09-30 ([S]): che il suffisso di un segnaposto sia
// un RUOLO — `:target` (la lingua che si impara), `:native` (quella dello
// studente) — e non una lingua. La mattina di quel giorno era il codice
// dell'edizione (`:es`), il pomeriggio chi guida il progetto ha deciso i ruoli:
// in un corso d'inglese per spagnoli `es` sarebbe stata la lingua dello
// STUDENTE. E che un suffisso vecchio o sbagliato (`:en`, `:es`) non diventi
// mai la parola «undefined» a schermo: resta il segnaposto, che si legge come
// un guasto. *Col codice di prima di quel giorno il file spagnolo di `gate`
// dava «Soy de Turin, undefined.»*
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
// due versioni si separano.** Vista fallire rimettendo la forma vecchia: cade
// SOLO la [B], con `torino → "Turin"` invece di `"Torino"`.
//
// IL CASO PIÙ DIVERSO (regola 42) ERA la riga NUDA, cioè un'età: le età
// stavano dentro il file dell'episodio (`ageOptions`) come numeri, senza
// riga. ⚠️ Dal 2026-09-24 (passo 1.8-bis ③) quella riga non esiste più: le
// età sono nel magazzino, e il caso più diverso è cambiato sotto — adesso è
// UNA TABELLA SENZA QUEL CAMPO, non la riga che manca, e lo guida la [P]. Il
// blocco [C] si chiamava «il caso più diverso: la riga che non esiste» ed è
// stato riscritto: lasciarlo avrebbe dichiarato guardato un caso che non c'è.
//
// [S], 2026-09-30: il seme è Torino, una riga in cui le due colonne
// DIFFERISCONO. Vista fallire col codice della mattina di quel giorno: 4
// rossi, fra cui [S] sul nome proprio.
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

// Il finto del browser sta in un posto solo dal 2026-09-24 (passo F.4):
// stesso nucleo di prima, stessi parametri. Vedi tests/mock-browser.js.
const { mockBrowser } = require('./mock-browser');
const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });

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
      localStorage.setItem(window.BI.customValuesKey(a.u), JSON.stringify(a.seme));
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
        torino: window.BI.resolveSlotValue(ep, 'partenza', 'orig-torino', 'target'),
        // un toponimo qualunque che non lo dichiara: si traduce come sempre
        mondovi: window.BI.resolveSlotValue(ep, 'partenza', 'orig-mondovi', 'target'),
        // un nome proprio: non si traduce, come sempre
        papa: window.BI.resolveSlotValue(ep, 'papa', 'papa-marco', 'target')
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

    // ⚠️ DAL 2026-10-30 LA MAPPA E IL BASELINE SONO VUOTI, di proposito: i
    // valori degli slot sono passati alla chiave del CORSO e gli id vecchi
    // stavano sotto quella per episodio (regola 50). Qui c'era «il baseline non
    // è vuoto». Con due elenchi vuoti la guardia non confronta niente, quindi
    // (regola 49) si prova che SA cadere su una copia sintetica, e si pretende
    // che mappa e baseline siano vuoti o pieni INSIEME: un baseline svuotato
    // con la mappa piena sarebbe la guardia spenta in silenzio.
    const spariteSintetiche = (function () {
      const finta = { slot: { papa: { vecchio: 'papa-marco' } } };
      return ['papa vecchio', 'papa tolto'].filter(function (riga) {
        const parti = riga.split(/\s+/);
        const perSlot = finta.slot[parti[0]];
        return !perSlot || !Object.prototype.hasOwnProperty.call(perSlot, parti[1]);
      });
    })();
    log('[M2] La guardia append-only SA cadere: su una mappa sintetica nomina la riga tolta',
      spariteSintetiche.join(',') === 'papa tolto', spariteSintetiche.join(','));
    const righeMappa = Object.keys(mappa.slot).reduce(function (n, s) { return n + Object.keys(mappa.slot[s]).length; }, 0);
    log('[M2] Mappa e baseline sono vuoti o pieni INSIEME',
      (righeMappa === 0) === (baseline.length === 0), 'mappa ' + righeMappa + ', baseline ' + baseline.length);
    log('[M2] Nessun id coperto è sparito dalla mappa (append-only)',
      spariti.length === 0, spariti.join(', '));

    // Il rovescio: ogni id NUOVO che la mappa promette deve esistere davvero
    // nel magazzino di oggi. Senza, la migrazione tradurrebbe un id morto in
    // un altro id morto — e il ripiego di [M3] coprirebbe il buco in silenzio.
    const tabelle = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
    // ⚠️ LE FAMIGLIE SI LEGGONO DAL FILE — corretto il 2026-09-24.
    //
    // Qui c'era `['people','places']` scritto a mano, **la stessa forma del
    // difetto che questo passo ha appena corretto in `loadPersonalizationTables`**:
    // il giorno in cui il magazzino ha preso `ages`, questa riga ha smesso di
    // guardarci dentro — e l'asserzione e' diventata rossa dichiarando morti
    // quattordici id che invece esistevano. *Qui almeno un rosso e' arrivato;
    // nell'app no, perche' li' l'elenco governava un valore e non un controllo.*
    const tuttiId = [];
    Object.keys(tabelle).forEach(function (fam) {
      if (fam.charAt(0) === '_') return;
      Object.keys(tabelle[fam] || {}).forEach(function (k) {
        (tabelle[fam][k] || []).forEach(function (r) { tuttiId.push(r.value); });
      });
    });
    const arriviMorti = function (m) {
      const fuori = [];
      Object.keys(m.slot).forEach(function (s) {
        Object.keys(m.slot[s]).forEach(function (v) {
          if (tuttiId.indexOf(m.slot[s][v]) === -1) fuori.push(s + ': ' + v + ' → ' + m.slot[s][v]);
        });
      });
      return fuori;
    };
    const arrivoMorto = arriviMorti(mappa);
    log('[M2] Ogni id di arrivo esiste nel magazzino di oggi',
      arrivoMorto.length === 0, arrivoMorto.join(', '));
    // Il rovescio sintetico, per la stessa ragione: con la mappa vuota la riga
    // qui sopra non guarda niente, quindi si prova che un arrivo morto lo vede.
    const sintetici = arriviMorti({ slot: { papa: { a: 'papa-marco', b: 'papa-inesistente' } } });
    log('[M2] La guardia degli arrivi SA cadere: su una mappa sintetica nomina solo l\'arrivo inesistente',
      sintetici.join(',') === 'papa: b → papa-inesistente', sintetici.join(','));
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
    // ⚠️ DAL 2026-10-30 LA MAPPA DEL REPOSITORY È VUOTA (vedi [M2]): il
    // meccanismo si prova con una mappa SINTETICA servita al posto del file, e
    // che la sostituzione sia avvenuta è un'asserzione (regola 49). Gli id di
    // arrivo esistono nelle tabelle di prima e in quelle di oggi, e nessuno è
    // il predefinito del suo slot.
    let servita = false;
    await page.route(globDati('migrazioni-personalizzazione.json'), function (route) {
      servita = true;
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ slot: {
        papa: { 'papa-vecchio': 'papa-giancarlo' },
        partenza: { 'partenza-vecchia': 'orig-torino' },
        cognome: { 'cognome-vecchio': 'cognome-ferrario' } } }) });
    });
    await apriMappa(page, 'TradMigra', { papa: 'papa-vecchio', partenza: 'partenza-vecchia', cognome: 'cognome-vecchio' });

    const esito = await page.evaluate(function () {
      const v = window.BI.valoriCorrenti();
      return { papa: v.papa, partenza: v.partenza, cognome: v.cognome };
    });

    log('[M1] La mappa sintetica è stata servita al posto del file', servita);
    log('[M1] Un nome salvato con l\'id vecchio torna il suo, non il predefinito',
      esito.papa === 'papa-giancarlo', JSON.stringify(esito));
    log('[M1] ...e vale anche per una città', esito.partenza === 'orig-torino', JSON.stringify(esito));
    log('[M1] ...e per un cognome', esito.cognome === 'cognome-ferrario', JSON.stringify(esito));
    log('[M1] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [M3] ⓑ UN ID CHE NON È MAI ESISTITO CADE SUL PREDEFINITO ─────────
  //
  // ⚠️ IL CASO SI DEVE COSTRUIRE: nei dati veri non c'e' piu'. Il predefinito
  // di uno slot coincide quasi sempre con la prima riga della sua tabella, e
  // su quegli slot «cade sul predefinito» e «cade sulla prima riga» danno la
  // stessa risposta — vera per costruzione (regola 44). Fino al 2026-10-30 i
  // due che divergevano erano le eta' (`figliaEta` def `16`, prima riga `12`),
  // uscite dagli slot quel giorno. *Dal 2026-10-30 nessuno slot diverge.*
  //
  // Quindi si serve al posto del file delle tabelle una copia col COGNOME
  // rovesciato: il predefinito finisce in fondo, e la prima riga e' un'altra.
  // Che la copia sia stata servita e' un'asserzione (regola 49).
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    let rovesciata = false;
    await page.route(globDati('tabelle-personalizzazione.json'), async function (route) {
      const risposta = await route.fetch();
      const t = await risposta.json();
      t.people.cognome = t.people.cognome.slice().reverse();
      rovesciata = true;
      await route.fulfill({ response: risposta, body: JSON.stringify(t) });
    });
    await apriMappa(page, 'TradRipiego');

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      const campo = ep.slotFields.find(function (f) { return f.key === 'cognome'; });
      return {
        sconosciuto: window.BI.resolveSlotValue(ep, 'cognome', 'non-esiste-piu', 'native'),
        resoDelDef: window.BI.resolveSlotValue(ep, 'cognome', campo.def, 'native'),
        resoDellaPrima: window.BI.resolveSlotValue(ep, 'cognome', campo.options[0].value, 'native')
      };
    });

    log('[M3] La tabella col cognome rovesciato è stata servita al posto del file', rovesciata);
    log('[M3] Il caso distingue davvero: predefinito e prima riga sono diversi',
      esito.resoDelDef !== esito.resoDellaPrima, JSON.stringify(esito));
    log('[M3] Un id sconosciuto cade sul PREDEFINITO dello slot, non sulla prima riga',
      esito.sconosciuto === esito.resoDelDef, JSON.stringify(esito));
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
        en: window.BI.fillTemplate(d4.target, ep, v, 'target'),
        it: window.BI.fillTemplate(d4.native, ep, v, 'native'),
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
          try { return window.BI.resolveSlotValue(ep, 'papa', 'papa-marco', 'target', 'paese'); }
          catch (e) { return 'ALZA: ' + e.message; }
        })(),
        // Qui c'era l'eta' (`figliaEta`), uscita dagli slot il 2026-10-30: il
        // cognome e' l'altra tabella senza `paese`.
        etaConCampo: (function () {
          try { return window.BI.resolveSlotValue(ep, 'cognome', ep.slotFields.find(function (f) { return f.key === 'cognome'; }).def, 'target', 'paese'); }
          catch (e) { return 'ALZA: ' + e.message; }
        })(),
        cognomeSenzaCampo: window.BI.resolveSlotValue(ep, 'cognome', ep.slotFields.find(function (f) { return f.key === 'cognome'; }).def, 'target')
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
    // `people.papa` no. *Qui c'era anche `places.destinations`, uscita dal
    // magazzino il 2026-10-20.* Un'implementazione che
    // desse per scontato `picked[campo]` lascerebbe `undefined` a schermo:
    // **un buco non si vede nei test e si vede allo studente.**
    //
    // `papa` e' una riga vera a cui manca una colonna. *Qui c'era anche «l'eta'
    // e' una riga che non esiste affatto nel magazzino … l'unica famiglia a
    // cui manca la riga intera»: falso dal 2026-09-24, vedi la nota qui sotto.*
    log('[P] Un campo che la riga non ha torna la riga, non «undefined»',
      esito.papaConCampo === 'Marco', esito.papaConCampo);
    // ⚠️ QUI C'ERA «una riga NUDA, che nel magazzino non c'e'», ED E' STATA
    // RISCRITTA IL 2026-09-24: il passo ③ ha portato le eta' NEL magazzino,
    // quindi le righe nude **non esistono piu' in nessun episodio**. Il caso
    // resta utile — una tabella senza il campo `paese` — ma non e' piu' «la
    // riga che manca»: e' «una tabella diversa». *Il caso piu' diverso della
    // regola 42 e' cambiato sotto, e lasciare la vecchia frase avrebbe
    // dichiarato guardato un caso che non c'e' piu'.*
    // ⚠️ Dal 2026-10-30 la tabella senza campo e' il COGNOME: le eta' sono
    // uscite dagli slot. Il cognome non si traduce, quindi la riga torna col
    // valore dello studente — quello che la tendina mostra.
    log('[P] ...e vale anche per una tabella che non ha quel campo (il cognome)',
      esito.etaConCampo === esito.cognomeSenzaCampo && !!esito.cognomeSenzaCampo, esito.etaConCampo + ' | ' + esito.cognomeSenzaCampo);
    log('[P] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [S] IL SUFFISSO E' UN RUOLO — 2026-09-30 ─────────────────────────
  //
  // Le citazioni di una skill chiedono la colonna col RUOLO: «I am from
  // {{partenza:target}}» vuol dire «vengo da {{partenza:native}}» deve dare
  // Turin e Torino sulla stessa riga. Il seme e' Torino perche' e' una riga
  // in cui le due colonne DIFFERISCONO: su Mondovi' sarebbero uguali, e un
  // suffisso ignorato passerebbe inosservato.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apriMappa(page, 'TradSuffisso', { partenza: 'orig-torino' });

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      const v = window.BI.valoriCorrenti();
      const ft = function (t, ruolo) { return window.BI.fillTemplate(t, ep, v, ruolo); };
      return {
        skill: ft('"I am from {{partenza:target}}" vuol dire "vengo da {{partenza:native}}"', 'native'),
        paese: ft('{{partenza.paese:target}}', 'native'),
        // Un nome proprio non si traduce: anche chiesto come `target` resta
        // quello dello studente.
        nome: ft('{{papa:target}}', 'native'),
        nomeNative: ft('{{papa}}', 'native'),
        // ⚠️ IL CASO PIU' DIVERSO (regola 42): un suffisso che NON e' un ruolo.
        // `:en` e' quello che un file scritto prima di oggi porta ancora; `:es`
        // quello che il file spagnolo portava ieri. Nessuna colonna si chiama
        // cosi', quindi devono restare segnaposto visibili — non «undefined»,
        // e non (peggio) la colonna di un ruolo pescata in silenzio.
        vecchioEn: ft('I am from {{partenza:en}}.', 'native'),
        vecchioEs: ft('Soy de {{partenza.paese:es}}.', 'target')
      };
    });

    // ⚠️ LA RIGA CHE DISTINGUE: col codice della mattina (suffisso = codice di
    // lingua) `:target` non trovava nessuna colonna.
    log('[S] `:target` e `:native` danno le due colonne della stessa riga',
      esito.skill === '"I am from Turin" vuol dire "vengo da Torino"', esito.skill);
    log('[S] ...anche sul sotto-campo', esito.paese === 'Italy', esito.paese);
    log('[S] Un nome proprio resta dello studente anche chiesto come `target`',
      esito.nome === esito.nomeNative && esito.nome.length > 0, esito.nome + ' | ' + esito.nomeNative);
    log('[S] Un suffisso vecchio (`:en`) resta un segnaposto visibile, mai «undefined»',
      esito.vecchioEn === 'I am from {{partenza:en}}.', esito.vecchioEn);
    log('[S] ...e anche `:es`', esito.vecchioEs === 'Soy de {{partenza.paese:es}}.', esito.vecchioEs);
    log('[S] Nessuna frase porta «undefined»',
      JSON.stringify(esito).indexOf('undefined') === -1, JSON.stringify(esito));
    log('[S] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== TRADUCIBILITA PER RIGA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
