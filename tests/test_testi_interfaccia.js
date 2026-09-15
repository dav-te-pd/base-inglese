// PROTEGGE: che i testi dell'interfaccia arrivino DAVVERO da
// data/inglese/it/istruzioni-moduli.json (regola 8), e non tornino di
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
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath } = require('./test-env');
const { stepsBefore } = require('./module-order');
const { openModule } = require('./map-driver');
const J = JSON.parse(fs.readFileSync(repoPath('data', 'inglese', 'it', 'istruzioni-moduli.json'), 'utf8'));

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(() => { if (u.onend) u.onend(); }, 5); },
    cancel() {}, getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

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
    localStorage.setItem('baseinglese:gate:customizeSeen:' + utente, '1');
    localStorage.setItem('baseinglese:modules:gate:' + utente, JSON.stringify({ completed: fatti }));
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
  const aperta = await pagina2.evaluate(() => ({
    personalizza: !!document.querySelector('#view-customize.is-active'),
    errore: !!document.querySelector('#view-load-error.is-active')
  }));
  log('[5] Personalizza (l\'unico senza dataFile) si apre lo stesso',
    aperta.personalizza && !aperta.errore, JSON.stringify(aperta));
  log('[5] ...e non finisce sulla schermata d\'errore', !aperta.errore);
  log('[5] Nessun errore JS su Personalizza', errori2.length === 0, errori2.join(' | '));
  await pagina2.close();

  log('[Z] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await browser.close();
  console.log('\n=== TESTI INTERFACCIA SUMMARY: ' + ok + '/' + (ok + ko) + ' passed ===');
  process.exit(ko ? 1 : 0);
}
run().catch(e => { console.error(e); process.exit(1); });
