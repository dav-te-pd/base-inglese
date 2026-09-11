// PROTEGGE: che un modulo non mostri una schermata che si può toccare prima di
// avere il contenuto su cui lavorare.
//
// Cosa si perde senza questo file. Il 2026-09-10 `openVoiceCoach` disegnava la
// schermata e ACCENDEVA il microfono, mentre la battuta arrivava solo dentro un
// `Promise.all` che aspettava anche `messaggi-feedback.json` — un file di TESTI
// il cui risultato non veniva nemmeno letto. Premere il microfono in quella
// finestra faceva esplodere `vcTargetText()` su una battuta nulla:
// `TypeError: Cannot read properties of null (reading 'english')`.
//
// **Non era un difetto dei test.** In CI è costato una corsa rossa, ma per uno
// studente su una rete lenta era un microfono acceso sopra la scritta
// «Caricamento...» che, premuto, non fa niente e non dice perché. Nessun
// messaggio, nessuna schermata d'errore: la regola 35 difende il FALLIMENTO del
// caricamento, non la FINESTRA in cui sta ancora arrivando.
//
// COME, e sono due strade per due domande diverse.
//
// ① «La finestra c'è ancora?» non si risponde aprendo il modulo e guardando —
//    in condizioni normali dura un millisecondo e non si vede. Si risponde
//    RITARDANDO il fetch: due secondi, cioè la rete lenta esagerata. È il
//    guasto realistico della regola 32 — rompere il fetch del tutto proverebbe
//    solo che l'asserzione sa morire, non che la correzione serve. Misurato:
//    con la forma vecchia esplode 3 volte su 3, con questa regge.
//
// ② «Il modulo aspetta i suoi dati?» è strutturale, e si guarda in
//    `openModuleFromMap`: è il punto unico da cui passano tutti e otto i
//    moduli, e deve aspettare SIA la personalizzazione SIA il contenuto.
//    L'alternativa scartata era spegnere i pulsanti in ognuno degli otto
//    moduli — sarebbe stata la nona famiglia della conoscenza che ogni file
//    deve ricordarsi da solo (docs/decisioni.md).
//
// LIMITE DICHIARATO: si guida un modulo solo, Voice Coach, perché è l'unico che
// nella finestra ESPLODE — gli altri sette accettano un gesto che non fa
// niente, che è più silenzioso e non per questo migliore. Quel caso qui non si
// vede: lo prende l'asserzione strutturale ②, che vale per tutti.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const { stepsBefore } = require('./module-order');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const mockInit = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(function () { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  function FakeRec() { this.onstart = null; this.onend = null; this.onresult = null; this.onerror = null; }
  FakeRec.prototype.start = function () { if (this.onstart) this.onstart(); };
  FakeRec.prototype.stop = function () { if (this.onend) this.onend(); };
  FakeRec.prototype.abort = function () {};
  window.SpeechRecognition = FakeRec; window.webkitSpeechRecognition = FakeRec;
};

async function run() {
  // ── ② Strutturale: non apre il browser ──────────────────────────────
  {
    const html = fs.readFileSync(repoPath('index.html'), 'utf8');
    // Il corpo fino alla sua chiusura, non un numero di caratteri: i commenti
    // dentro quella funzione sono cresciuti e una finestra fissa li tagliava,
    // facendo fallire le asserzioni per il motivo sbagliato.
    const dopo = html.split('function openModuleFromMap(')[1] || '';
    const corpo = dopo.slice(0, dopo.indexOf('\n  }') + 4);
    log('[A] openModuleFromMap aspetta la personalizzazione dell\'episodio',
      /ensureEpisodeSlotFields\(/.test(corpo));
    log('[A] ...E il contenuto che il modulo leggerà, prima di aprirlo',
      /loadEpisodeData\(module\)/.test(corpo), corpo.split('\n').slice(0, 3).join(' / '));
    // ⚠️ E l'eccezione, che la prima versione di questa riga NON aveva:
    // Personalizza non legge il file dell'episodio, e chiederglielo apre la
    // schermata d'errore su un modulo che funziona. Costò cinque file rossi.
    log('[A] ...ma solo per i moduli che un file lo leggono davvero',
      /module\.dataFile \?/.test(corpo), corpo.slice(0, 200));
    log('[A] Le due attese stanno PRIMA di openModuleByKind, non dopo',
      corpo.indexOf('loadEpisodeData(module)') !== -1 &&
      corpo.indexOf('loadEpisodeData(module)') < corpo.indexOf('openModuleByKind('));
    // Il precaricamento travestito da dipendenza non deve tornare: il modulo
    // non aspetta un file di testi per aprirsi.
    const apreVoiceCoach = (html.split('function openVoiceCoach(')[1] || '').slice(0, 4000);
    log('[A] Aprire Voice Coach NON aspetta il file dei messaggi di feedback',
      !/Promise\.all\(\[[^\]]*loadFeedbackMessages/.test(apreVoiceCoach));
  }

  const browser = await launchBrowser();

  // ── ① Il guasto realistico: la rete lenta, esagerata ────────────────
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(String(e).slice(0, 100)));
    await page.addInitScript(mockInit);
    // Due secondi su un file di TESTI: se il modulo lo aspettasse ancora,
    // qui la battuta non ci sarebbe e il microfono sarebbe già premibile.
    await page.route('**/messaggi-feedback.json', async (route) => {
      await new Promise(r => setTimeout(r, 2000));
      await route.continue();
    });
    await page.goto(APP_URL);
    if (!(await page.isVisible('#name-input').catch(() => false))) {
      await page.click('#switch-user');
      await page.waitForSelector('#name-input', { state: 'visible' });
    }
    await page.fill('#name-input', 'ModuloPronto');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible' });
    await page.evaluate((p) => {
      localStorage.setItem('baseinglese:modules:gate:ModuloPronto', JSON.stringify({ completed: p }));
      ['mappaEpisodio', 'personalizzazione', 'voicePractice', 'voiceCoach']
        .forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':ModuloPronto', '1'));
    }, stepsBefore('voiceCoach'));
    await page.click('#go-episode');
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0, null, { timeout: 20000 });
    await page.click('[data-module="voiceCoach"]');
    await page.waitForSelector('#vc-record-btn', { state: 'visible', timeout: 20000 });

    // Il momento che conta: la schermata c'è, e si legge cosa mostra PRIMA di
    // toccarla. Nessuna attesa in mezzo — se il contenuto non è già qui, la
    // finestra esiste ancora.
    const appena = await page.evaluate(() => ({
      target: document.getElementById('vc-target').textContent,
      microfonoSpento: document.getElementById('vc-record-btn').disabled
    }));
    log('[B] Appena la schermata è visibile, la battuta C\'È GIÀ',
      appena.target && appena.target !== 'Caricamento...', 'il target diceva: "' + appena.target + '"');

    // E il gesto che il difetto rendeva pericoloso, fatto davvero.
    if (!appena.microfonoSpento) await page.click('#vc-record-btn', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: l'asserzione qui sotto e' negativa — premere il microfono non deve sollevare NESSUN errore. Un errore che non arriva non ha una condizione da aspettare: si lascia una finestra e si guarda se e' rimasta vuota
    log('[B] Premere il microfono non solleva nessun errore', errori.length === 0, errori.join(' | '));
    log('[B] ...e in particolare nessun TypeError sulla battuta assente',
      !errori.some(e => /reading 'english'/.test(e)), errori.join(' | '));

    // Il file di testi arriva DOPO, e quando arriva il modulo funziona lo
    // stesso: toglierlo dall'apertura non lo ha tolto dall'app.
    await page.waitForTimeout(2200); // ATTESA-LEGITTIMA: qui il TEMPO E' LA COSA MISURATA, non una guardia: i 2200 ms sono la finestra in cui il file dei messaggi arriva davvero, e l'asserzione e' che nemmeno allora compaia un errore. Aspettare l'arrivo del file renderebbe l'asserzione vera per costruzione (regola 44): quello che si vuole provare e' che NIENTE succeda nell'intervallo
    log('[B] Nessun errore nemmeno dopo che il file dei messaggi è arrivato',
      errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── L'eccezione: un modulo che NON legge il file dell'episodio ──────
  // Personalizza è l'unico dei sedici senza `dataFile`. Il primo giro di
  // questa correzione glielo chiedeva lo stesso, e la schermata d'errore
  // compariva su un modulo perfettamente funzionante. Il test di allora non
  // se ne accorgeva perché guidava solo Voice Coach: **è il buco che ha
  // lasciato passare l'errore**, e questo blocco è quel buco chiuso.
  {
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errori = [];
    page.on('pageerror', e => errori.push(String(e).slice(0, 100)));
    await page.addInitScript(mockInit);
    await page.goto(APP_URL);
    if (!(await page.isVisible('#name-input').catch(() => false))) {
      await page.click('#switch-user');
      await page.waitForSelector('#name-input', { state: 'visible' });
    }
    await page.fill('#name-input', 'SenzaDataFile');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible' });
    await page.evaluate(() => localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:SenzaDataFile', '1'));
    await page.click('#go-episode');
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0, null, { timeout: 20000 });
    await page.click('[data-module="personalizzazione"]');
    // ATTESA-LEGITTIMA: l'asserzione e' che la schermata d'ERRORE non compaia. Aspettare
    // che Personalizza sia visibile non basterebbe: la regressione che questo blocco
    // difende mostrava l'errore DOPO, quando il fetch(undefined) falliva. Serve il tempo.
    await page.waitForTimeout(600); // ATTESA-LEGITTIMA: prova che la schermata d'errore NON compare su un modulo senza dataFile
    const stato = await page.evaluate(() => {
      const vis = id => { const e = document.getElementById(id); return !!e && e.getClientRects().length > 0; };
      return { errore: vis('view-error'), personalizza: vis('view-customize') };
    });
    log('[C] Personalizza si apre: chi non legge un file episodio non lo aspetta',
      stato.personalizza === true, JSON.stringify(stato));
    log('[C] ...e NON compare la schermata d\'errore', stato.errore === false, JSON.stringify(stato));
    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('');
  console.log('=== MODULO PRONTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
