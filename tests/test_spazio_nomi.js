// PROTEGGE: che un file che arriva DOPO possa registrarsi da sé nello spazio
// dei nomi — e che la pulizia e il modulo che registra vengano davvero usati —,
// e che le due collezioni non si azzerino quando qualcuno si ricarica. Il
// guasto che conta: `window.BI = {}` al posto di `window.BI = window.BI || {}`
// non dà nessun errore e cancella in silenzio quello che gli altri hanno
// registrato. E il caso più diverso (`[C]`): un `kind` mai registrato è
// `undefined`, non un guasto, mentre registrare due volte lo stesso `kind` o
// qualcosa che non è una funzione esplode subito.
//
// ⚠️ NON PROTEGGE CHE L'OGGETTO ESISTA. Quello sarebbe ricopiare
// l'implementazione, e la regola 32 lo vieta: un test che dice «verifica che
// `BI` sia definito» passa anche quando il meccanismo è rotto.
//
// COSA SI PERDE SENZA QUESTO FILE. Lo spazio dei nomi è nato al passo 21
// (2026-09-16) senza utenti, e questo file è nato con lui: senza una prova
// allora, la prima volta che il meccanismo veniva usato sarebbe stata anche la
// prima volta che qualcuno lo metteva alla prova, e un rosso avrebbe avuto due
// sospettati. Oggi gli utenti ci sono: ogni modulo registra il proprio `kind`
// con `BI.registraModulo`, alcuni la propria pulizia con `BI.registraPulizia`,
// `openModuleByKind` (`app/apertura.js`) risolve da `BI.moduli` e
// `stopAllModuleActivity` (`app/mappa.js`) chiama `BI.pulizie`.
//
// ⚠️ E IL GUASTO CHE CONTA È UNA RIGA SOLA.
//
//     window.BI = window.BI || {};     ← regge un file che arriva dopo
//     window.BI = {};                  ← lo azzera, IN SILENZIO
//
// La seconda forma non dà nessun errore: l'ultimo file caricato cancella tutto
// quello che i precedenti hanno registrato, e il sintomo sarebbe un modulo che
// non si pulisce più o un `kind` che non si risolve — mesi dopo, dentro un
// altro passo. È esattamente la riga che qualcuno "pulirà" trovandola
// ridondante, quindi è su quella che il test è stato falsificato.
//
// COME, e perché serve un file in più. L'attacco tardivo non si simula da
// dentro la pagina: `page.evaluate` gira quando tutto è già caricato, quindi
// proverebbe «si può scrivere in un oggetto», che è vero per costruzione. Si
// carica invece un file VERO dopo il caricamento della pagina
// (`tests/fixtures/attacco-tardivo.js`), che fa esattamente quello che farà un
// file di modulo: la riga `|| {}` e poi le due registrazioni.
//
// IL CASO PIÙ DIVERSO (regola 42): **la registrazione che non avviene mai.**
// Non un modulo complicato — un modulo che non viene caricato affatto, come
// negli episodi corti, dove un `kind` che non corrisponde a niente rendeva una
// riga della mappa cliccabile e muta (`test_episodi_corti.js`). Nello spazio
// dei nomi diventa `BI.moduli[kind] === undefined` e una pulizia assente:
// **devono essere normali, non un guasto** — ed è il motivo per cui qui si
// verifica anche che un kind mai registrato torni `undefined` senza esplodere.
//
// ⚠️ E UN SECONDO LIMITE, misurato falsificando e non dedotto. Le due
// direzioni del guasto NON sono protette allo stesso modo:
//
//   - `{}` nel file che arriva TARDI → cadono cinque asserzioni di
//     comportamento, e dicono cosa è successo («il file tardivo ha RICREATO
//     lo spazio dei nomi invece di riusarlo»);
//   - `{}` in `app/spazio.js` STESSO → cade **solo** l'asserzione strutturale
//     `[A]`. E non è una debolezza del test: oggi `spazio.js` è il primo file
//     che tocca `BI` (subito dopo `config.js`, che non lo tocca), quindi
//     azzerare un oggetto che non esiste ancora non rompe niente. Diventerebbe
//     un guasto vero il giorno in cui un file che si registra caricasse prima
//     di lui.
//
// *Finché quel giorno non arriva, `[A]` è l'unica guardia su quella riga, ed è
// scritto qui perché chi legge il verde sappia quanto vale.*
//
// LIMITE DICHIARATO: non c'è nessuna asserzione sul COMPORTAMENTO dell'app.
// Lo spazio dei nomi oggi governa l'apertura dei moduli e la pulizia quando li
// si lascia, e quella copertura sta nei test che li aprono e li lasciano (per
// le pulizie, `test_pulizie_registrate.js`), non qui.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  // ── [A] LA FORMA, letta sul file ─────────────────────────────────────
  {
    const spazio = fs.readFileSync(repoPath('app', 'spazio.js'), 'utf8');
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');

    log('[A] Lo spazio dei nomi si crea SENZA azzerarsi (window.BI = window.BI || {})',
      /window\.BI\s*=\s*window\.BI\s*\|\|\s*\{\}/.test(spazio) &&
      !/window\.BI\s*=\s*\{\}\s*;/.test(spazio));
    log('[A] Le due collezioni le crea questo file, non chi arriva',
      /BI\.pulizie\s*=\s*BI\.pulizie\s*\|\|\s*\[\]/.test(spazio) &&
      /BI\.moduli\s*=\s*BI\.moduli\s*\|\|\s*\{\}/.test(spazio));
    log('[A] Ci si entra da due funzioni, non scrivendo nelle collezioni',
      /BI\.registraPulizia\s*=\s*function/.test(spazio) &&
      /BI\.registraModulo\s*=\s*function/.test(spazio));
    log('[A] index.html lo carica, bloccante come config.js',
      /<script src="app\/spazio\.js(\?[^"]*)?"><\/script>/.test(html));
    // APP_CONFIG resta fuori, ed è una decisione: la riga che la dichiara deve
    // restare, altrimenti il prossimo "sistema" l'incoerenza.
    log('[A] Il file dichiara perché APP_CONFIG resta fuori',
      /APP_CONFIG.{0,40}RESTA FUORI/i.test(spazio));
  }

  const browser = await launchBrowser();

  // ── [B] L'ATTACCO TARDIVO, con un file vero caricato dopo ────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.goto(APP_URL);
    await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });

    // ⚠️ Le letture qui sotto sono DIFENSIVE, e non e' prudenza generica: il
    // guasto che questo blocco cerca e' proprio «lo spazio dei nomi si e'
    // azzerato», quindi `window.BI.pulizie` puo' essere undefined. Leggendolo
    // senza guardia il test morirebbe con un TypeError — un rosso, ma muto:
    // direbbe «il test e' esploso» invece di «le registrazioni sono sparite».
    const stato = () => page.evaluate(() => ({
      pulizie: (window.BI && window.BI.pulizie) ? window.BI.pulizie.length : null,
      moduli: (window.BI && window.BI.moduli) ? Object.keys(window.BI.moduli) : null,
      configVivo: typeof window.APP_CONFIG === 'object' && window.APP_CONFIG !== null
    }));
    const prima = await stato();

    // Il file arriva ADESSO, a pagina già viva: è il gesto del caricamento a
    // richiesta, non una simulazione.
    await page.addScriptTag({ path: repoPath('tests', 'fixtures', 'attacco-tardivo.js') });

    const dopo = await stato();

    log('[B] Un file caricato DOPO registra la propria pulizia',
      dopo.pulizie !== null && prima.pulizie !== null && dopo.pulizie === prima.pulizie + 1,
      dopo.pulizie === null ? 'BI.pulizie non esiste piu\': il file tardivo ha RICREATO lo spazio dei nomi invece di riusarlo'
                            : JSON.stringify({ prima: prima.pulizie, dopo: dopo.pulizie }));
    log('[B] ...e il proprio modulo, sotto il suo kind',
      !!dopo.moduli && dopo.moduli.indexOf('modulo-di-prova') !== -1,
      dopo.moduli ? dopo.moduli.join(',') : 'BI.moduli non esiste piu\': lo spazio dei nomi si e\' azzerato');
    log('[B] E non ha azzerato quello che c\'era: APP_CONFIG è ancora vivo',
      dopo.configVivo === true);

    // Le registrazioni servono a essere USATE, non a essere contate.
    const usate = await page.evaluate(() => {
      if (!window.BI || !window.BI.pulizie || !window.BI.moduli['modulo-di-prova']) {
        return { pulizie: null, aperto: null };
      }
      window.BI.pulizie.forEach(function (fn) { fn(); });
      window.BI.moduli['modulo-di-prova']({ kind: 'modulo-di-prova' });
      return { pulizie: window.__pulizieChiamate, aperto: window.__moduloApertoCon };
    });
    log('[B] La pulizia registrata viene davvero chiamata', usate.pulizie === 1, JSON.stringify(usate));
    log('[B] E il modulo registrato si apre con l\'argomento che riceve',
      !!usate.aperto && usate.aperto.kind === 'modulo-di-prova', JSON.stringify(usate.aperto));

    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] IL CASO PIÙ DIVERSO: la registrazione che non avviene mai ────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.goto(APP_URL);
    await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });
    const r = await page.evaluate(() => {
      var mai = window.BI.moduli['modulo-che-non-esiste'];
      var doppio = null;
      try {
        window.BI.registraModulo('doppio', function () {});
        window.BI.registraModulo('doppio', function () {});
      } catch (e) { doppio = e.message; }
      var tipoSbagliato = null;
      try { window.BI.registraPulizia('non sono una funzione'); }
      catch (e) { tipoSbagliato = e.message; }
      return { mai: typeof mai, doppio: doppio, tipoSbagliato: tipoSbagliato };
    });
    log('[C] Un modulo mai registrato è undefined, non un guasto', r.mai === 'undefined', r.mai);
    log('[C] Registrare due volte lo stesso kind ESPLODE, non vince l\'ultimo',
      !!r.doppio && /gia/i.test(r.doppio), String(r.doppio));
    log('[C] Registrare qualcosa che non è una funzione esplode subito',
      !!r.tipoSbagliato, String(r.tipoSbagliato));
    log('[C] Nessun errore JS non catturato', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== SPAZIO NOMI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
