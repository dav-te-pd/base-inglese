// PROTEGGE: che la voce dell'app arrivi, e arrivi prima di chi la chiama.
//
// ⚠️ COSA SI ROMPE SE IL FILE NON ARRIVA, misurato il 2026-09-18 bloccando la
// richiesta — ed e' un terzo caso, diverso dagli altri due:
//
//     login .......... COMPARE
//     casa ........... no
//     mappa .......... no
//     errore JS ...... TypeError: vocePossibile is not a function
//
//   `identita` .... pagina bianca, non parte niente ......... RUMOROSO
//   `progressi` ... l'app parte, la mappa non si apre ....... SILENZIOSO
//   `audio` ....... si vede il login, e il primo pulsante non fa niente
//
// **La schermata del nome si vede perche' e' nel markup, non perche' l'app sia
// viva.** `speakBtn.disabled = !vocePossibile();` gira al primo livello dello
// script principale: muore li', e `boot()` non arriva mai. Quindi su Pages la
// cosa da guardare non e' «si apre» — si apre — ma **«scrivo il nome, premo, e
// arrivo a casa»**.
//
// *La previsione che avevo scritto era «l'app parte e la mappa si apre, come
// per progressi». Falsa. L'ha corretta la misura, un minuto dopo.*
//
// IL CASO PIU' DIVERSO (regola 42): **`epoca`**, e lo e' per FORMA — e' l'unico
// pezzo dello strato che era una `var` NUMERICA letta da un altro strato.
// Il ponte degli alias (`var nome = BI.nome`) copia un riferimento, e su un
// numero avrebbe copiato il VALORE: `leaveModule` avrebbe incrementato una
// copia, `toggleSpeak` non l'avrebbe mai vista cambiare, e la protezione
// contro i callback tardivi sarebbe diventata inerte **senza alzare niente**.
// Per questo e' diventata due funzioni, ed e' guardata apposta qui sotto
// guidando l'app: non basta che `nuovaEpoca` esista, deve far salire il numero
// che `epocaCorrente` legge.
//
// LIMITE DICHIARATO, e vale piu' degli altri: **la suite prova che le funzioni
// sono raggiungibili e che l'epoca avanza, NON che esca un suono.** La sintesi
// vocale nel browser dei test e' un finto. Che la voce si senta davvero resta
// una verifica a mano, su Pages, sul dispositivo vero.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  verificaStruttura(log, 'audio', ['app', 'audio.js'], { prima: ['app/spazio.js'] });

  // ── [A] `synth` HA UN PADRONE SOLO ──────────────────────────────────
  {
    const fuori = righeDiCodiceDi('index.html').filter(function (r) { return /\bsynth\b/.test(r); });
    log('[A] index.html non nomina piu' + "' synth da nessuna parte", fuori.length === 0,
      fuori.map(function (r) { return r.trim(); }).join(' | '));

    const audio = fs.readFileSync(repoPath('app', 'audio.js'), 'utf8');
    log('[A] ...e app/audio.js lo dichiara', /var synth = window\.speechSynthesis;/.test(audio));

    // L'epoca non e' piu' una variabile condivisa: se tornasse tale, il ponte
    // degli alias la congelerebbe in silenzio.
    // ⚠️ SI CERCA LA FORMA DEL CODICE, NON LA PAROLA — e questa riga e' nata
    // rossa proprio per questo: `righeDiCodiceDi` scarta le righe che
    // COMINCIANO con `//`, `*` o `/*`, ma le righe di continuazione dei
    // banner `/* ===== */` di index.html cominciano con una lettera. Una di
    // esse dice «l'epoca, che vive col nucleo audio», ed e' prosa.
    // **Settima comparsa della famiglia del conto sui commenti**, e stavolta
    // su un'asserzione scritta dieci minuti prima. Il limite del filtro e'
    // gia' registrato in docs/decisioni.md: qui si lavora dentro quel limite
    // cercando un uso da CODICE (assegnazione, incremento, lettura in
    // un'espressione) invece del nome nudo.
    const usiCodice = righeDiCodiceDi('index.html').filter(function (r) {
      return /(^|[^\w.'`])epoca\s*(=[^=]|\+\+|--|\)|;|,)/.test(r);
    });
    log('[A] L' + "'epoca non e' piu' una variabile usata da index.html",
      usiCodice.length === 0, usiCodice.map(function (r) { return r.trim(); }).join(' | '));
  }

  // ── [B] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'AudioEstratto');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[B] Si scrive il nome, si preme, e si arriva alla mappa', false,
        String(e).split('\n')[0] + (errori.length ? '  //  primo errore JS: ' + errori[0] : ''));
    }
    if (viva) log('[B] Si scrive il nome, si preme, e si arriva alla mappa', true);

    const passi = viva ? await page.$$eval('#module-list [data-module]', function (e) { return e.length; }) : 0;
    log('[B] ...e la mappa ha i suoi passi', passi > 0, String(passi));

    // ⚠️ L'EPOCA AVANZA DAVVERO. Non basta che le due funzioni esistano: il
    // guasto che il ponte degli alias avrebbe prodotto e' proprio questo —
    // due funzioni vive su un numero che non sale mai.
    const epoca = viva ? await page.evaluate(function () {
      const prima = window.BI.epocaCorrente();
      window.BI.nuovaEpoca();
      return { prima: prima, dopo: window.BI.epocaCorrente() };
    }) : null;
    log('[B] nuovaEpoca() fa salire il numero che epocaCorrente() legge',
      !!epoca && epoca.dopo === epoca.prima + 1, JSON.stringify(epoca));

    // La stessa cosa, ma passando dall'app invece che dalla console: uscire da
    // un modulo e' il gesto che azzera le chiamate tardive.
    const dopoUscita = viva ? await page.evaluate(function () {
      const prima = window.BI.epocaCorrente();
      document.getElementById('map-back-home').click();
      return { prima: prima, dopo: window.BI.epocaCorrente() };
    }) : null;
    log('[B] ...e lasciare una vista la fa salire passando dall\'app',
      !!dopoUscita && dopoUscita.dopo > dopoUscita.prima, JSON.stringify(dopoUscita));

    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== AUDIO ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
