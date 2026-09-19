// PROTEGGE: che il meccanismo delle viste viva fuori da index.html, e che il
// suo tag stia DOVE DEVE — in fondo a <body>, non in <head> con gli altri.
//
// COSA SI PERDE SENZA QUESTO FILE. `app/orchestrazione.js` e' il primo strato
// della SECONDA FILA: prende i tredici nodi delle viste con `getElementById`
// **a tempo di parsing**. Spostato in <head> — dove stanno tutti gli altri
// nove, e dove uno andrebbe a metterlo per simmetria — i tredici diventano
// `null` e il primo `showView()` muore. **Non e' un guasto sottile: l'app non
// arriva alla schermata del nome.** Ma e' un guasto che nasce da una modifica
// che sembra un riordino innocuo, ed e' esattamente il caso che un test deve
// tenere fermo.
//
// ⚠️ E IL LIMITE, dichiarato perche' e' il rovescio della stessa medaglia:
// questo file verifica che il tag stia DOPO il markup delle viste, non che
// ogni futuro strato della seconda fila ci stia. Quando `ui-condivisa` uscira'
// (gli overlay, per la stessa ragione), la sua riga la scrive il suo test.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura, posizioneTag } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const nomi = verificaStruttura(log, 'orchestrazione', ['app', 'orchestrazione.js'], {});
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');

  // ── [A] LA SECONDA FILA, misurata in posizioni ──────────────────────
  {
    const tag = posizioneTag(html, 'app/orchestrazione.js');
    const primaVista = html.indexOf('id="view-onboarding"');
    const ultimaVista = html.indexOf('id="view-error"');
    const scriptPrincipale = html.indexOf('\n<script>\n(function () {');
    const headStrati = posizioneTag(html, 'app/config.js');

    log('[A] Il tag arriva DOPO il markup di tutte le viste',
      tag > ultimaVista && ultimaVista > primaVista, 'tag ' + tag + ', ultima vista ' + ultimaVista);
    // ⚠️ L'altra meta', e senza di lei la prima e' vera anche mettendo il tag
    // in fondo alla pagina, dove l'IIFE non lo vedrebbe piu'.
    log('[A] ...e PRIMA dello script principale, che ne fa l\'alias',
      tag < scriptPrincipale && scriptPrincipale > 0, 'tag ' + tag + ', script ' + scriptPrincipale);
    log('[A] ...e NON e\' in <head> con gli altri nove', tag > headStrati + 1000,
      'tag ' + tag + ', primo strato di head ' + headStrati);
  }

  // ── [B] IL CONFINE: tiene NOMI, non chiama moduli ───────────────────
  {
    const righe = righeDiCodiceDi('app', 'orchestrazione.js');
    // ⚠️ SULLE RIGHE DI CODICE. La testa del file NOMINA i moduli in prosa,
    // apposta: spiega perche' otto chiavi assomigliano a otto file futuri.
    // Cercando nel testo, questa riga troverebbe il commento e resterebbe
    // verde con qualunque codice sotto — decima comparsa della famiglia, se
    // ci fosse cascato.
    const chiamate = righe.filter(function (r) {
      return /\b(openRepeatAloud|openStoryCards|openVoiceCoach|openMatch|openDialogo|openSpeedMatch|openFlashcard|openCustomize|openEpisodeMap)\s*\(/.test(r);
    });
    log('[B] Non chiama nessuna funzione di modulo', chiamate.length === 0, chiamate.join(' | '));

    const idCostruiti = righe.filter(function (r) {
      return /getElementById\(\s*(?:['"][^'"]*['"]\s*\+|\w+\s*\+|`)/.test(r);
    });
    log('[B] I tredici id sono letterali, nessuno costruito', idCostruiti.length === 0, idCostruiti.join(' | '));

    const vistePrese = righe.filter(function (r) { return /getElementById\('view-/.test(r); });
    log('[B] Le viste prese sono tredici', vistePrese.length === 13, String(vistePrese.length));
  }

  // ── [C] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });
      await page.fill('#name-input', 'Orchestrazione');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[C] Onboarding -> casa -> mappa', false, String(e).split('\n')[0]);
    }
    if (viva) log('[C] Onboarding -> casa -> mappa', true);

    // ⚠️ I TREDICI NODI SONO VERI, non tredici null. E' il guasto che questo
    // file esiste per tenere fermo: in <head> `views` si popolerebbe di null
    // e nessuna asserzione sulla navigazione se ne accorgerebbe prima di
    // morire in un punto che non lo spiega.
    const nodi = viva ? await page.evaluate(function () {
      var v = window.BI.views;
      return { quante: Object.keys(v).length, nulle: Object.keys(v).filter(function (k) { return !v[k]; }) };
    }) : null;
    log('[C] BI.views porta tredici nodi VERI, nessuno null',
      !!nodi && nodi.quante === 13 && nodi.nulle.length === 0, JSON.stringify(nodi));

    // Una sola vista accesa alla volta: l'invariante di showView, letto
    // dall'app vera invece che dal codice.
    const accese = viva ? await page.$$eval('.view.is-active', function (e) { return e.length; }) : -1;
    log('[C] Una sola vista accesa alla volta', accese === 1, String(accese));

    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== ORCHESTRAZIONE ESTRATTA: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
