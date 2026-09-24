// PROTEGGE: che i testi dell'interfaccia arrivino DAVVERO da
// data/inglese/it/inglese-it-istruzioni-moduli.json (regola 8), e non tornino di
// nascosto nel codice — e che la riga che lo rende possibile non sparisca.
//
// COSA SI PERDE SENZA: il passo 18 ha spostato i testi scritti su richiesta
// (Blocco Ascolto, microfono, pannello Help, Dialogo) dal codice al file. Il
// meccanismo e' uiText(), che legge la CACHE senza aspettare — e la cache e'
// calda solo perche' openModuleFromMap chiama loadModuleInstructions() nel
// suo Promise.all. **Quella riga e' un punto solo per tutti e sedici i
// moduli: se qualcuno la toglie, l'app non crolla — mostra stringhe VUOTE.**
// Un'interfaccia senza etichette non alza nessuna eccezione e non fa fallire
// nessun altro test: e' esattamente il guasto che nessuno vedrebbe.
//
// COME, e perche' non il modo ovvio: non si confronta il testo a schermo con
// una frase scritta qui — sarebbe una copia, e il passo 15 ha gia' pagato
// quel prezzo. Si legge il JSON come lo legge l'app e si confronta con lo
// schermo. ⚠️ Questo NON rende l'asserzione vera per costruzione (regola 44):
// l'app prende il testo dalla cache del fetch, il test dal file su disco, e
// fra i due c'e' tutto il meccanismo che stiamo proteggendo — la chiave
// giusta, il segnaposto sostituito, la cache calda al momento giusto.
//
// ⚠️ IL CASO PIU' DIVERSO, e non e' teorico (regola 42): **Personalizza, il
// solo dei sedici moduli senza `dataFile`**. E' il caso che ando' rosso su
// cinque file il 2026-09-10, l'ultima volta che qualcuno aggiunse qualcosa a
// quel Promise.all. Qui si apre davvero, perche' «quella volta ando' male»
// e' l'unica ragione buona per guidare un caso.
//
// LIMITE DICHIARATO: guida due moduli su sedici. Gli altri quattordici sono
// coperti dal fatto che uiText() e' una sorgente unica — ma un modulo che
// smettesse di CHIAMARLA, tornando a scrivere il testo nel codice, qui non si
// vedrebbe.
const fs = require('fs');
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath, fileEdizione, globDati } = require('./test-env');
const { stepsBefore } = require('./module-order');
const { openModule } = require('./map-driver');
const J = JSON.parse(fs.readFileSync(fileEdizione('istruzioni-moduli.json'), 'utf8'));

// Il finto del browser sta in un posto solo dal 2026-09-24 (passo F.4):
// stesso nucleo di prima, stessi parametri. Vedi tests/mock-browser.js.
const { mockBrowser } = require('./mock-browser');
const mockInit = mockBrowser({ fineVoceMs: 5, nomeVoce: 'Fake' });

const UTENTE = 'TestiInterfaccia';
let ok = 0, ko = 0;
function log(n, c, extra) { console.log((c ? 'OK   - ' : 'FAIL - ') + n + (extra ? '   ' + extra : '')); c ? ok++ : ko++; }

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await bloccaFontEsterni(page);
  const errori = [];
  page.on('pageerror', e => errori.push(String(e).slice(0, 200)));
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', UTENTE);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 10000 });
  await page.evaluate(({ utente, fatti }) => {
    localStorage.setItem(BI.customizeSeenKey('gate', utente), '1');
    localStorage.setItem(BI.moduleProgressKey('gate', utente), JSON.stringify({ completed: fatti }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + utente, '1');
  }, { utente: UTENTE, fatti: stepsBefore('voiceCoach') });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 10000 });
  await openModule(page, 'voiceCoach');
  await page.waitForSelector('#view-voice-coach.is-active', { timeout: 10000 });
  await page.click('#vc-intro-start-btn').catch(() => {});

  // ① il Blocco Ascolto: aria-label dal JSON
  const aria = await page.evaluate(() => {
    const b = document.querySelector('.listen-block-btn');
    const g = document.querySelector('.rate-group');
    const r = document.querySelector('.rate-btn');
    return { b: b && b.getAttribute('aria-label'), g: g && g.getAttribute('aria-label'), r: r && r.getAttribute('aria-label') };
  });
  log('[1] aria-label del pulsante ascolta viene dal JSON', aria.b === J.bloccoAscolto.listenLabel, JSON.stringify(aria.b));
  log('[1] aria-label del gruppo velocita\' viene dal JSON', aria.g === J.bloccoAscolto.rateGroupLabel, JSON.stringify(aria.g));
  log('[1] aria-label di una velocita\' ha il segnaposto sostituito',
    !!aria.r && aria.r.indexOf('{pct}') === -1 && aria.r.indexOf('%') !== -1, JSON.stringify(aria.r));

  // ② la didascalia del microfono
  const cap = await page.evaluate(() => document.getElementById('vc-record-caption').textContent);
  log('[2] didascalia del microfono dal JSON', cap === J.voceShared.recordStart, JSON.stringify(cap));

  // ③ il pannello Help
  await page.click('#voice-coach-help-btn').catch(() => {});
  await page.waitForTimeout(300);
  const help = await page.evaluate(() => ({
    titolo: document.getElementById('help-overlay-title').textContent,
    opzioni: Array.from(document.querySelectorAll('.help-option')).map(x => x.textContent)
  }));
  log('[3] titolo del menu Help dal JSON', help.titolo === J.aiuto.menuTitle, JSON.stringify(help.titolo));
  log('[3] le tre opzioni vengono dal JSON',
    help.opzioni.length === 3 &&
    help.opzioni[0] === J.aiuto.optionInstructions &&
    help.opzioni[1] === J.aiuto.optionClarify &&
    help.opzioni[2] === J.aiuto.optionUrgent, JSON.stringify(help.opzioni));

  // ④ il modulo del Help
  await page.click('[data-help-action="clarify"]');
  await page.waitForTimeout(200);
  const form = await page.evaluate(() => ({
    titolo: document.getElementById('help-overlay-title').textContent,
    hint: document.querySelector('#help-overlay-body .overlay-text').textContent,
    ph: document.getElementById('help-text').getAttribute('placeholder'),
    invia: document.querySelector('#help-form button[type=submit]').textContent
  }));
  log('[4] titolo del modulo dal JSON', form.titolo === J.aiuto.titleClarify, JSON.stringify(form.titolo));
  log('[4] la riga di aiuto dal JSON', form.hint === J.aiuto.formHintClarify, JSON.stringify(form.hint));
  log('[4] il segnaposto del campo dal JSON', form.ph === J.aiuto.formPlaceholder, JSON.stringify(form.ph));
  log('[4] il pulsante Invia dal JSON', form.invia === J.aiuto.formSubmit, JSON.stringify(form.invia));

  // ---------------------------------------------------------------
  // ⑥ IL CASO PIU' DIVERSO: Personalizza, l'unico dei sedici senza
  //   `dataFile`. La riga aggiunta al Promise.all di openModuleFromMap vale
  //   per tutti e sedici, e l'ultima volta che qualcuno ne aggiunse una
  //   Personalizza ando' rossa su cinque file: li' la riga chiedeva il file
  //   dell'episodio, e lui non ce l'ha. loadModuleInstructions() non prende
  //   nessun modulo, quindi quel guasto non puo' ripetersi uguale — ma
  //   «non puo'» si scrive dopo averlo guidato, non prima.
  // ---------------------------------------------------------------
  const pagina2 = await browser.newPage();
  await bloccaFontEsterni(pagina2);
  const errori2 = [];
  pagina2.on('pageerror', e => errori2.push(String(e).slice(0, 200)));
  await pagina2.addInitScript(mockInit);
  await pagina2.goto(APP_URL);
  await pagina2.fill('#name-input', UTENTE + '2');
  await pagina2.click('#onboarding-form button[type=submit]');
  await pagina2.waitForSelector('#view-home.is-active', { timeout: 10000 });
  await pagina2.evaluate((utente) => {
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + utente, '1');
  }, UTENTE + '2');
  await pagina2.click('#go-episode');
  await pagina2.waitForSelector('#view-map.is-active', { timeout: 10000 });
  await openModule(pagina2, 'personalizzazione');
  // ⚠️ SI ASPETTA CHE UNA DELLE DUE VISTE ARRIVI, POI SI GUARDA QUALE — e le
  // due cose sono diverse, per la regola 44: l'attesa e' sulla DISGIUNZIONE
  // («e' successo qualcosa»), l'asserzione sulla DISCRIMINAZIONE («e'
  // successa quella giusta»). Aspettare `#view-customize.is-active` la
  // renderebbe vera per costruzione; aspettare «una delle due» no.
  //
  // ⚠️ E la ragione e' misurata, non prudenziale: questa riga e' caduta in
  // DUE giri di stress su tre (`tests/tools/stress.sh`) con
  // `{"personalizza":false,"errore":false}` — cioe' **nessuna delle due**:
  // il modulo non aveva ancora finito di aprirsi quando qualcuno l'ha letto.
  // *Un esito che non e' ne' il successo ne' il fallimento previsto e' il
  // segno che si sta leggendo troppo presto, non che il codice e' rotto.*
  // ⚠️ L'ATTESA NON INGOIA NIENTE: il rifiuto diventa un VALORE
  // (`.then(si, no)`), invece di un `.catch` vuoto — cosi' non entra nel
  // censimento di `ERRORI-INGOIATI.md`, e soprattutto il motivo della caduta
  // finisce nel messaggio dell'asserzione invece di sparire.
  const arrivata = await pagina2.waitForSelector(
    '#view-customize.is-active, #view-load-error.is-active',
    { timeout: 10000 }).then(() => true, () => false);
  const aperta = await pagina2.evaluate(() => ({
    personalizza: !!document.querySelector('#view-customize.is-active'),
    errore: !!document.querySelector('#view-load-error.is-active')
  }));
  log('[5] Personalizza (l\'unico senza dataFile) si apre lo stesso',
    aperta.personalizza && !aperta.errore, JSON.stringify(aperta) + ' | una delle due viste e\' arrivata entro il tetto: ' + arrivata);
  log('[5] ...e non finisce sulla schermata d\'errore', !aperta.errore);
  log('[5] Nessun errore JS su Personalizza', errori2.length === 0, errori2.join(' | '));
  await pagina2.close();

  // ---------------------------------------------------------------
  // ⑦ GIRO B: l'intro condivisa. Le due frasi erano ricopiate DIECI volte
  //   nel markup, e adesso sono due chiavi sole. Qui si verifica la cosa che
  //   il giro B ha aggiunto e che il giro A non aveva: **l'attesa copre
  //   TUTTO quello che la schermata mostra**, non solo il corpo — il
  //   pulsante resta spento finche' non c'e', invece di restare muto.
  //
  //   ⚠️ E si guida la MAPPA di proposito, che e' il caso in cui il JSON
  //   NON e' gia' caricato: ci si arriva dalla home, non da
  //   openModuleFromMap. Sui moduli il giro A ha gia' reso la cache calda,
  //   quindi li' questa riga proverebbe molto meno.
  //
  //   ⚠️ DAL 2026-09-21 QUELLA GARANZIA E' STATA SOSTITUITA DA UNA PIU'
  //   FORTE — vedi il blocco commentato piu' sotto: la mappa non si apre
  //   affatto finche' i testi non ci sono. La riga qui sopra resta perche'
  //   dice ancora perche' si guida la MAPPA e non un modulo.
  // ---------------------------------------------------------------
  const pagina3 = await browser.newPage();
  await bloccaFontEsterni(pagina3);
  const errori3 = [];
  pagina3.on('pageerror', e => errori3.push(String(e).slice(0, 200)));
  await pagina3.addInitScript(mockInit);

  // ⚠️ IL CANCELLO SI INSTALLA PRIMA DI `goto`, E NON E' UN DETTAGLIO: E'
  // QUELLO CHE TIENE VIVA LA FINESTRA CHE QUESTO BLOCCO DEVE OSSERVARE.
  //
  // Fino al 2026-09-21 il rallentamento si installava DOPO il caricamento,
  // subito prima del click, e bastava: il fetch dei testi partiva all'apertura
  // della mappa, quindi lo prendeva. **Poi `goHome` ha cominciato a chiedere i
  // testi già sulla schermata iniziale** — perché il saluto e il nome
  // dell'episodio adesso vengono dal file — e da allora, al momento del click,
  // erano già in memoria: la mappa si apriva subito, **giustamente**, e le due
  // asserzioni cadevano senza che niente fosse rotto.
  //
  // ⚠️ E IL CANCELLO NON E' UN TIMER: la richiesta resta ferma finche' il test
  // non la libera. Prima c'erano 800 ms scelti come «la rete di uno studente
  // vero»; un tempo, per quanto generoso, e' sempre una corsa contro la
  // macchina (regola 19). Cosi' invece la finestra dura esattamente quanto
  // serve, su qualunque macchina, e non si chiude mai da sola.
  var apriIlCancello;
  var cancelloTesti = new Promise(function (r) { apriIlCancello = r; });
  await pagina3.route(globDati('istruzioni-moduli.json'), async function (route) {
    await cancelloTesti;
    await route.continue();
  });

  await pagina3.goto(APP_URL);
  await pagina3.fill('#name-input', UTENTE + '3');
  await pagina3.click('#onboarding-form button[type=submit]');
  await pagina3.waitForSelector('#view-home.is-active', { timeout: 10000 });

  // La home NON e' del giro B: deve avere ancora le sue etichette nel markup.
  const testoHome = await pagina3.evaluate(() => document.getElementById('view-home').innerText);
  log('[7] La home tiene le sue etichette (e\' la prima cosa che vede chi torna)',
    testoHome.indexOf('Inizia') !== -1 && testoHome.indexOf('Scegli il tema') !== -1,
    JSON.stringify(testoHome.slice(0, 50)));

  // ⚠️ LA FINESTRA NON SI OSSERVA CORRENDOLE CONTRO: SI RIPRODUCE.
  //
  // La prima versione di questo blocco apriva la mappa e guardava subito.
  // MISURATO: il fetch del JSON aveva gia' risolto al primo istante in cui
  // Playwright riusciva a leggere qualcosa — quindi le asserzioni erano VERE
  // PER COSTRUZIONE (regola 44), e il test restava 19/19 anche togliendo il
  // `disabled` dal codice. Se ne e' accorto solo il guasto iniettato
  // (regola 32), non la rilettura.
  //
  // Adesso la finestra la tiene aperta il cancello installato prima di `goto`:
  // i testi NON possono essere arrivati, su nessuna macchina.
  await pagina3.click('#go-episode');

  // ⚠️ LA GARANZIA E' CAMBIATA IL 2026-09-21, ED E' PIU' FORTE DI PRIMA —
  // questo blocco l'ha seguita, non e' stato cancellato.
  //
  // Fino a ieri la mappa **compariva subito** e l'intro si riempiva dopo:
  // quello che si poteva garantire era che il pulsante restasse SPENTO
  // invece che muto, e questo blocco lo misurava. Col passo 1.3b la mappa
  // ha le sue stringhe nel file come ogni modulo, quindi **non compare
  // affatto** finche' i testi non ci sono: la finestra che il pulsante
  // spento copriva non esiste piu'.
  //
  // Le due asserzioni di prima non avevano piu' niente da guardare. Al loro
  // posto ci sono le due che dicono la garanzia nuova — *«non si vede una
  // schermata a meta'»* e' piu' di *«il pulsante e' spento»*, e si misura
  // dallo stesso punto, con la stessa rete rallentata.
  const durante = await pagina3.evaluate(() => ({
    vistaAttiva: (document.querySelector('.view.is-active') || {}).id || null,
    mappaAttiva: !!document.querySelector('#view-map.is-active')
  }));
  log('[7] DURANTE l\'attesa la mappa NON compare a meta\'',
    durante.mappaAttiva === false, JSON.stringify(durante));
  log('[7] ...e si resta dove si era, senza schermata d\'errore',
    durante.vistaAttiva === 'view-home', JSON.stringify(durante));

  // Liberati i testi, la mappa arriva. **Questa riga e' anche la prova che le
  // due asserzioni qui sopra non erano vere per il motivo sbagliato:** se la
  // mappa non si aprisse nemmeno adesso, il blocco starebbe misurando un'app
  // rotta invece di un'attesa.
  apriIlCancello();
  await pagina3.waitForSelector('#view-map.is-active', { timeout: 15000 });
  // e quando arriva, tutto si riempie insieme
  await pagina3.waitForFunction(() => {
    const b = document.getElementById('map-intro-start-btn');
    return b && !b.disabled;
  }, null, { timeout: 15000 });
  const intro = await pagina3.evaluate(() => ({
    bottone: document.getElementById('map-intro-start-btn').textContent,
    casella: document.getElementById('map-intro-dont-show-text').textContent,
    corpo: document.getElementById('map-intro-body').innerText
  }));
  log('[7] Il pulsante dell\'intro prende l\'etichetta dal JSON',
    intro.bottone === J.condivisi.introStart, JSON.stringify(intro.bottone));
  log('[7] La casella «non mostrarmi piu\'» viene dal JSON',
    intro.casella === J.condivisi.introDontShowAgain, JSON.stringify(intro.casella));
  log('[7] E quando il pulsante si accende il corpo non e\' piu\' «Caricamento...»',
    intro.corpo.indexOf('Caricamento') === -1, JSON.stringify(intro.corpo.slice(0, 40)));
  log('[7] Nessun errore JS sulla mappa', errori3.length === 0, errori3.join(' | '));
  await pagina3.close();

  log('[Z] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await browser.close();
  console.log('\n=== TESTI INTERFACCIA SUMMARY: ' + ok + '/' + (ok + ko) + ' passed ===');
  process.exit(ko ? 1 : 0);
}
run().catch(e => { console.error(e); process.exit(1); });
