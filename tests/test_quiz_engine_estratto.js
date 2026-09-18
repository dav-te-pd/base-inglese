// PROTEGGE: che il motore che CALCOLA un esito arrivi — e che si sappia
// quanto tardi si vede la sua assenza.
//
// ⚠️ COSA SI ROMPE SE IL FILE NON ARRIVA, misurato il 2026-09-18:
//
//     login .......... SI        mappa ............. SI
//     casa ........... SI        un modulo si apre . SI (Meet the Story)
//     errori JS ...... ZERO
//
// **Piu' silenzioso ancora dei suoni**, e la misura ha smentito la mia
// previsione: pensavo che `shuffle` dentro `openStoryCards` facesse morire
// l'apertura, e invece quel ramo non si percorre col profilo `meet`. **La
// schermata si apre normalmente.** Il guasto compare quando un esercizio
// CALCOLA: la prima risposta valutata, la prima percentuale, il primo mazzo
// mescolato.
//
// QUINDI SU PAGES: **si apre un quiz e si risponde.** «Si apre» non basta —
// qui non basta nemmeno «il modulo si apre».
//
// ⚠️ IL CRITERIO DI COSA C'E' DENTRO, E NON E' L'ELENCO DEL PIANO: ci sta una
// funzione che **restituisce un valore**, non una che **restituisce markup**.
// Il piano metteva qui anche `renderStars`; misurandola, `starsForPercent`
// torna un NUMERO e `renderStars` torna una stringa di HTML con la classe
// `vc-star`. **La prima e' una regola, la seconda e' un disegno** — e il
// disegno va in `ui-condivisa`.
//
// IL CASO PIU' DIVERSO (regola 42): **`renderStars`, cioe' la funzione che ho
// LASCIATO FUORI.** Sta una riga sotto `starsForPercent`, si chiama quasi
// uguale, ed e' l'unico pezzo che il piano nominava e che la misura ha
// respinto. *Portarla fuori non avrebbe rotto niente — l'app funzionerebbe
// identica — e sarebbe stato il primo file di strato con dentro del markup.
// Un confine sbagliato che non produce nessun rosso e' quello che si eredita.*

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const nomi = verificaStruttura(log, 'quiz-engine', ['app', 'quiz-engine.js'], { prima: ['app/spazio.js'] });

  // ── [A] IL CONFINE: valori dentro, markup fuori ─────────────────────
  {
    const src = fs.readFileSync(repoPath('app', 'quiz-engine.js'), 'utf8');
    // Un file che calcola non scrive tag. Se un giorno ci finisse dentro una
    // funzione che disegna, questa riga lo dice prima che diventi la forma.
    const conMarkup = righeDiCodiceDi('app', 'quiz-engine.js')
      .filter(function (r) { return /<span|<div|<button|innerHTML/.test(r); });
    log('[A] Il motore non disegna: niente markup nel file', conMarkup.length === 0,
      conMarkup.map(function (r) { return r.trim().slice(0, 50); }).join(' | '));

    log('[A] starsForPercent e' + "' dentro (torna un numero)", nomi.indexOf('starsForPercent') !== -1);
    log('[A] ...e renderStars e' + "' rimasta fuori (torna markup)",
      nomi.indexOf('renderStars') === -1 && src.indexOf('function renderStars') === -1);
  }

  // ── [B] GUIDANDO L'APP: i calcoli tornano i valori giusti ───────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'QuizEngine');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[B] L' + "'app arriva alla mappa", false, String(e).split('\n')[0]);
    }
    if (viva) log('[B] L' + "'app arriva alla mappa", true);

    // ⚠️ NON BASTA CHE LE FUNZIONI ESISTANO: un motore di calcolo che c'e' e
    // risponde sbagliato e' peggio di uno che manca. Si chiedono quattro
    // risposte NOTE, una per famiglia (distanza, conteggio, soglia, giudizio).
    const calcoli = viva ? await page.evaluate(function () {
      try {
        return {
          similarity: window.BI.similarity('hello', 'helo'),
          tokenize: window.BI.tokenize('Hello there!').length,
          bucket: window.BI.percentageBucket(95),
          classify: window.BI.classify('hello', 'helo')
        };
      } catch (e) { return { errore: String(e).split('\n')[0] }; }
    }) : null;
    log('[B] similarity misura la distanza', !!calcoli && calcoli.similarity > 0.7 && calcoli.similarity < 1, JSON.stringify(calcoli));
    log('[B] tokenize conta le parole', !!calcoli && calcoli.tokenize === 2, JSON.stringify(calcoli));
    log('[B] percentageBucket legge le soglie da CONFIG', !!calcoli && calcoli.bucket === 'alto', JSON.stringify(calcoli));
    log('[B] classify da' + "' il giudizio", !!calcoli && calcoli.classify === 'similar', JSON.stringify(calcoli));

    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== QUIZ ENGINE ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
