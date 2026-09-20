// PROTEGGE: che sia la RIGA del magazzino a dire se il suo valore si traduce,
// e non il nome della tabella che la contiene.
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
// contenuto, e la sua fonte è docs/inglese/it/tabelle-personalizzazione.md.
// Verifica che il meccanismo legga la riga.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, globDati } = require('./test-env');
const { openModule } = require('./map-driver');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const FILE_TABELLE = 'data/inglese/it/tabelle-personalizzazione.json';

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
async function apriMappa(page, utente) {
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (u) {
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
  }, utente);
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
  // Perché conta: `resolveSlotValue` su un id che non esiste **ricade in
  // silenzio sulla PRIMA opzione**. Non alza, non avvisa, non lascia un
  // rosso: la personalizzazione di qualcuno diventa un'altra e basta.
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

    // Una riga di `places` — che la regola vecchia traduceva SEMPRE — che
    // dichiara di non tradursi. È l'unico modo di far divergere le due forme:
    // sul contenuto vero danno la stessa risposta su tutte le righe.
    await page.route(globDati('tabelle-personalizzazione.json'), async function (route) {
      const vero = JSON.parse(fs.readFileSync(repoPath(FILE_TABELLE), 'utf8'));
      vero.places.departures = vero.places.departures.map(function (r) {
        return r.value === 'torino' ? Object.assign({}, r, { traducibile: false }) : r;
      });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(vero) });
    });

    await apriMappa(page, 'TradRiga');

    const esito = await page.evaluate(function () {
      const ep = window.BI.episodioCorrente();
      return {
        // il toponimo che dichiara di NON tradursi
        torino: window.BI.resolveSlotValue(ep, 'partenza', 'torino', 'en'),
        // un toponimo qualunque che non lo dichiara: si traduce come sempre
        mondovi: window.BI.resolveSlotValue(ep, 'partenza', 'mondovi', 'en'),
        // un nome proprio: non si traduce, come sempre
        papa: window.BI.resolveSlotValue(ep, 'papa', 'marco', 'en')
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

  await browser.close();
  console.log('\n=== TRADUCIBILITA PER RIGA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
