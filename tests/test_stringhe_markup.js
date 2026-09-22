// PROTEGGE: che le stringhe che lo studente legge dentro un modulo NON siano
// scritte in `index.html`, e che il markup le riceva davvero invece di restare
// vuoto.
//
// COSA SI PERDE SENZA QUESTO FILE. Fino al 2026-09-20 «Spiegazione», «Help»,
// «← Mappa», «Non lo so», «Avanti →», «Ripasso», «Caricamento...» e altri
// erano scritti nel markup, 54 occorrenze in tutto. Un'edizione francese
// avrebbe avuto la sua cartella `data/francese/it/` con i suoi testi — e
// quelle 54 sarebbero rimaste italiane, perché non stanno in nessun file di
// dati: stanno nel codice, che è uno solo per tutte le edizioni.
//
// ⚠️ E LE DUE ASSERZIONI SI COPRONO A VICENDA, nessuna delle due basta.
//
// La [A] toglie la POSSIBILITÀ: se in `index.html` quelle parole non ci sono
// più, riscriverle è una modifica visibile invece di una scorciatoia. Ma da
// sola è soddisfatta anche da un markup vuoto che **resta vuoto**: pulsanti
// senza scritta, e nessun errore da nessuna parte.
// La [C] guarda il rovescio — a modulo aperto i pulsanti hanno un testo — e da
// sola sarebbe soddisfatta anche rimettendo le parole nel markup.
//
// IL CASO PIÙ DIVERSO (regola 42): **la Spiegazione aperta DALLA MAPPA, prima
// di aver aperto un solo modulo.** È il caso che ha deciso dove sta la
// chiamata: il titolo di quell'overlay è markup statico, e legare il
// riempimento all'apertura di un modulo lo avrebbe lasciato vuoto proprio lì.
// Non è il caso più complicato — è quello a cui MANCA il passaggio che tutti
// gli altri hanno (nessun modulo aperto prima). La [D] lo guida.
//
// ⚠️ E LA MAPPA È COPERTA DAL 2026-09-21 (passo 1.3b). Qui c'era scritto che
// non lo era, «perché `openEpisodeMap` è sincrona e non aspetta i testi»:
// adesso aspetta, con la sua schermata d'errore come ogni modulo. La `[F]`
// guida **la strada fredda** — casa → mappa, senza aver aperto niente — che è
// l'unico dei dieci punti di chiamata che può trovare la cache vuota.
//
// LIMITE DICHIARATO: restano nel markup le stringhe di **onboarding e home**
// (devono funzionare quando niente funziona), quelle del **Pannello Admin**
// (strumento, non studente) e quelle **sovrascritte a runtime** (segnaposto).
// Nessuna delle tre è una dimenticanza, e nessuna è protetta da qui.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, fileEdizione, globDati } = require('./test-env');
const { openModule } = require('./map-driver');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Le parole che dal 2026-09-20 NON devono più comparire come testo nel markup
// dei moduli. Non è l'elenco completo delle 54: è quello delle ripetute, cioè
// quelle che una riscrittura per sbaglio rimetterebbe per prime.
const SPARITE = ['Non lo so', 'Avanti →', 'Ripasso', 'Caricamento...',
                 'Esci e riprendi dopo', 'Mostra pronuncia', 'Riprova ancora', 'Vai avanti →',
                 // dal passo 1.3b: la mappa
                 "Mappa dell'episodio", 'Completa i moduli in ordine per avanzare nella storia.'];

// Le stesse, più quelle che vivevano SOLO nel JavaScript (passo 1.3c). Un
// letterale che finisce in `textContent`/`innerHTML` è testo per lo studente
// tanto quanto uno scritto nel markup — e nessuna misura sul markup lo vede.
const PAROLE = SPARITE.concat(['Pausa', 'Riprendi', 'Mostra traduzioni',
  'Nascondi traduzioni', 'Risposta corretta', 'Nascondi pronuncia', 'TENTATIVO',
  'Richiesta salvata']);

const mockInit = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
};

async function apriMappa(page, utente) {
  await page.addInitScript(mockInit);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (u) {
    localStorage.setItem(BI.customizeSeenKey('gate', u), '1');
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + u, '1');
  }, utente);
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
}

async function run() {
  const browser = await launchBrowser();
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const testi = JSON.parse(fs.readFileSync(fileEdizione('istruzioni-moduli.json'), 'utf8'));

  // ── [A] LA POSSIBILITÀ È TOLTA, non sconsigliata ─────────────────────
  {
    const rimaste = SPARITE.filter(function (t) { return html.indexOf('>' + t + '<') !== -1; });
    log('[A] Le stringhe dei moduli non sono più scritte nel markup',
      rimaste.length === 0, rimaste.join(' · '));

    const quanti = (html.match(/data-testo="/g) || []).length;
    log('[A] Il markup le chiede per attributo', quanti >= 50, String(quanti));
  }

  // ── [B] OGNI ATTRIBUTO PUNTA A UNA CHIAVE CHE ESISTE ─────────────────
  //
  // ⚠️ Una chiave sbagliata non alza e non lascia un rosso: `uiText` torna
  // stringa vuota e il pulsante resta com'era. Su un markup vuoto, quindi,
  // resta VUOTO — e chi l'ha scritta lo scopre guardando l'app.
  {
    const chiavi = (html.match(/data-testo="([^"]+)"/g) || [])
      .map(function (m) { return m.slice('data-testo="'.length, -1); });
    const rotte = chiavi.filter(function (k) {
      let n = testi;
      k.split('.').forEach(function (p) { n = n && n[p]; });
      return typeof n !== 'string' || !n;
    });
    log('[B] Ogni `data-testo` punta a un testo che esiste nel file',
      rotte.length === 0, Array.from(new Set(rotte)).join(' · '));
  }

  // ── [C] A MODULO APERTO I PULSANTI HANNO UN TESTO ────────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apriMappa(page, 'Stringhe');
    // Personalizza: il primo passo della sequenza, l'unico aperto su un
    // profilo nuovo — gli altri sono col lucchetto finché non si completa.
    await openModule(page, 'personalizzazione');
    await page.waitForSelector('#view-customize.is-active', { timeout: 15000 });

    const r = await page.evaluate(() => {
      const vuoti = Array.from(document.querySelectorAll('#view-customize [data-testo]'))
        .filter(el => !el.textContent.trim())
        .map(el => el.getAttribute('data-testo'));
      return {
        vuoti: vuoti,
        mappa: (document.getElementById('customize-back-home') || {}).textContent,
        help: (document.getElementById('customize-help-btn') || {}).textContent
      };
    });
    log('[C] Nessun elemento con `data-testo` resta vuoto', r.vuoti.length === 0, r.vuoti.join(' · '));
    log('[C] «← Home» arriva dal file', r.mappa === testi.condivisi.tornaAllaHome, JSON.stringify(r.mappa));
    log('[C] «Help» arriva dal file', r.help === testi.condivisi.help, JSON.stringify(r.help));
    log('[C] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [D] IL CASO PIÙ DIVERSO: la Spiegazione aperta DALLA MAPPA ───────
  //
  // Nessun modulo è mai stato aperto. Se il riempimento fosse legato
  // all'apertura di un modulo, il titolo di questo overlay sarebbe vuoto.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await apriMappa(page, 'StringheMappa');
    await page.click('#map-watch-btn');
    await page.waitForSelector('#howitworks-overlay.is-open', { timeout: 15000 });
    // ⚠️ `is-open` è il PRIMO effetto del tocco, non l'ultimo: l'overlay si apre
    // subito e i testi arrivano col fetch. Aspettare lì significava correre
    // contro la rete — passava per fortuna (regola 44). L'approdo giusto è il
    // corpo riempito: è l'ULTIMO effetto, arriva dopo `hydrateTesti` (che gira
    // dentro lo stesso `loadModuleInstructions`, prima di chi l'ha chiamato),
    // e **nessuna asserzione di questo blocco lo legge**.
    await page.waitForFunction(function () {
      var b = document.getElementById('howitworks-overlay-body');
      return b && b.innerHTML.indexOf('module-status-text') === -1;
    }, { timeout: 15000 });

    // Solo l'occhiello: accanto c'è il nome del modulo, che è un'altra cosa.
    const titolo = await page.evaluate(() => {
      const k = document.querySelector('#howitworks-overlay-title .spiegazione-title-kicker');
      return k ? k.textContent : null;
    });
    const chiudi = await page.evaluate(() =>
      (document.getElementById('howitworks-overlay-close-btn') || {}).textContent);

    log('[D] Il titolo della Spiegazione c\'è anche senza aver aperto un modulo',
      titolo === testi.condivisi.spiegazione, JSON.stringify(titolo));
    log('[D] ...e così il suo «Chiudi»', chiudi === testi.condivisi.chiudi, JSON.stringify(chiudi));
    log('[D] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [E] E NEL JAVASCRIPT — passo 1.3c ────────────────────────────────
  //
  // ⚠️ IL BUCO CHE 1.3a HA SCOPERTO AVENDO GUARDATO SOLO IL MARKUP: le
  // stesse parole vivevano anche in `app/*.js`, dove nessuna misura sul
  // markup poteva vederle. `'Pausa'` stava **due volte** — nel file dei testi
  // e dentro il codice che fa il toggle — e le due potevano divergere senza
  // che niente lo dicesse.
  //
  // Si guarda dove la stringa ARRIVA ALLO SCHERMO, non la stringa in sé:
  // un letterale dentro un `console.warn` o un nome di classe non è testo
  // per lo studente.
  {
    const dentroIlCodice = [];
    fs.readdirSync(repoPath('app')).filter(f => f.endsWith('.js')).forEach(function (f) {
      const righe = fs.readFileSync(repoPath('app/' + f), 'utf8').split('\n');
      let blocco = false;
      righe.forEach(function (l, i) {
        const t = l.trim();
        if (blocco) { if (t.indexOf('*/') !== -1) blocco = false; return; }
        if (t.indexOf('/*') === 0) { if (t.indexOf('*/') === -1) blocco = true; return; }
        if (t.indexOf('//') === 0) return;
        const riga = l.replace(/\s\/\/.*$/, '');
        if (!/textContent|innerHTML/.test(riga)) return;
        PAROLE.forEach(function (p) {
          if (riga.indexOf("'" + p) !== -1 || riga.indexOf('"' + p) !== -1) {
            dentroIlCodice.push(f + ':' + (i + 1) + ' → ' + p);
          }
        });
      });
    });
    log('[E] Le stesse parole non sono scritte nemmeno dentro app/*.js',
      dentroIlCodice.length === 0, dentroIlCodice.join(' · '));
  }

  // ── [F] LA MAPPA A CACHE FREDDA — passo 1.3b ─────────────────────────
  //
  // ⚠️ La strada che nessun altro blocco fa: casa → mappa, **senza aver
  // aperto un solo modulo**. È l'unico dei dieci punti che chiamano
  // `openEpisodeMap` capace di trovare i testi non ancora arrivati — gli
  // altri nove sono un «← Mappa» dentro un modulo, e lì ci sono per forza.
  //
  // Il ritardo di 800 ms non è prudenza: senza, la finestra fra «testi
  // assenti» e «testi presenti» dura un millisecondo e il test osserverebbe
  // sempre il dopo, cioè sarebbe vero per costruzione (regola 44).
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.route(globDati('istruzioni-moduli.json'), async function (route) {
      await new Promise(function (x) { setTimeout(x, 800); });
      await route.continue();
    });
    await apriMappa(page, 'MappaFredda');

    const r = await page.evaluate(() => {
      const vuoti = Array.from(document.querySelectorAll('#view-map [data-testo]'))
        .filter(el => !el.textContent.trim())
        .map(el => el.getAttribute('data-testo'));
      return {
        vuoti: vuoti,
        titolo: (document.querySelector('#map-main-screen h1') || {}).textContent,
        errore: !!document.querySelector('#view-error.is-active')
      };
    });
    log('[F] La mappa non compare prima dei suoi testi', r.errore === false, 'schermata d\'errore');
    log('[F] Nessun elemento della mappa resta vuoto', r.vuoti.length === 0, r.vuoti.join(' · '));
    log('[F] Il titolo della mappa arriva dal file',
      r.titolo === testi.mappaEpisodio.pageTitle, JSON.stringify(r.titolo));
    log('[F] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  await browser.close();
  console.log('\n=== STRINGHE MARKUP SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
