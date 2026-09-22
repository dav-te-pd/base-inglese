// PROTEGGE: che il Blocco Ascolto parli SUBITO al tocco, e che il microfono di
// Voice Practice parta al primo click, si FERMI al secondo, e non superi il
// tetto di durata configurato.
//
// ⚠️ COSA SI PERDE SENZA, ED È UN CASO VERO DEL 2026-09-19.
//
// Spostando sette pezzi condivisi in `app/ui-condivisa.js` — funzioni
// IDENTICHE carattere per carattere, diff pulito, suite verde tre volte di
// fila, CI verde — su Pages il Blocco Ascolto ha cominciato a rispondere con
// ~3 secondi di ritardo, e il microfono a non fermarsi al click, a non sentire
// e a superare i 3 secondi. **Nessuna delle 1445 asserzioni se n'è accorta.**
//
// Il motivo è che tutti i test di prima **cercavano** questi pezzi: che la
// funzione esistesse, che il markup fosse in un punto solo, che il modulo si
// aprisse. Nessuno li **guidava**. Un'estrazione può lasciare tutto
// raggiungibile e cambiare l'ordine in cui le cose girano — e l'ordine è
// esattamente ciò che uno studente sente.
//
// ⚠️ E IL FINTO MICROFONO DEGLI ALTRI TEST HA `stop() {}` VUOTO. Non ha mai
// dovuto fermarsi davvero, quindi «non si ferma al click» era un guasto che
// quel finto non poteva mostrare. *Un mock che semplifica troppo la realtà dà
// una sicurezza falsa* — regola 19, e qui è costato una regressione su Pages.
// Il finto di questo file REGISTRA start/stop/abort e non li ingoia.
//
// COME SI MISURA IL «SUBITO», e perché non con un cronometro (regola 19).
// Un tetto in millisecondi correrebbe contro la velocità della macchina. Qui
// il click viene mandato e lo stato viene letto **dentro la stessa chiamata
// sincrona**: se `speak` è partito nel gestore, è già registrato quando la
// riga successiva lo legge. Se parte tre secondi dopo, non c'è — e la
// differenza non dipende da quanto è veloce il container.
//
// LIMITE DICHIARATO, due cose.
// ① Verifica il Blocco Ascolto di Meet the Story e il microfono di Voice
//   Practice. Gli altri quattro moduli che usano il Blocco Ascolto passano
//   dalla stessa `speakListenBlock`, ma questo file non li guida: se un
//   giorno uno di loro si scrivesse il proprio gestore, qui non si vedrebbe.
// ② Dei tre sintomi visti su Pages ne guida TUTTI E TRE, dal 2026-09-21.
//   «non si ferma al click» [B], «va oltre i tre secondi» [C], e «spesso il
//   microfono non sente» [D].
//
//   ⚠️ QUI C'ERA SCRITTO CHE IL TERZO ERA SCOPERTO, e la motivazione era
//   sbagliata: *«il riconoscimento è finto, e un finto sente sempre»*. È vero
//   che un finto sente sempre — ma il guasto non era che l'app non sentisse:
//   era che **non sapeva di stare sentendo**, perché guardava solo `onresult`
//   e non `speechstart`. Quello un finto lo riproduce benissimo: basta che
//   mandi l'evento giusto e nient'altro.
//
//   *Un limite dichiarato bene dice dove non guardi. Questo diceva anche
//   perché, e il perché era falso — cioè chiudeva la porta a chi avesse
//   provato.*

const { launchBrowser, APP_URL, bloccaFontEsterni } = require('./test-env');
const { openModule } = require('./map-driver');
const { stepsBefore } = require('./module-order');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// ⚠️ IL FINTO CHE NON INGOIA. Registra ogni chiamata con l'ordine in cui è
// arrivata: è l'ordine, non il tempo, la cosa che si è rotta.
const mockInit = () => {
  window.__audio = { eventi: [] };
  const segna = function (nome, extra) { window.__audio.eventi.push(Object.assign({ nome: nome }, extra || {})); };

  class FakeUtterance { constructor(text) { this.text = text; } }
  // ⚠️ IL FINTO SINTETIZZATORE DEVE AVERE `speaking`, E NON È UN DETTAGLIO.
  // `fermaLaVoce()` cancella SOLO se `synth.speaking` è vero. Nessuno dei finti
  // già nel repository dichiara quella proprietà: su di loro `staParlando()`
  // risponde `false` per sempre, quindi `cancel()` non viene chiamato MAI e
  // tutto ciò che dipende dall'interruzione — il secondo tocco che ferma la
  // voce, la Regola Azione Critica — passa senza essere provato. È la stessa
  // forma dello `stop() {}` vuoto del finto microfono: *un mock che semplifica
  // troppo la realtà dà una sicurezza falsa* (regola 19).
  var parlato = { attivo: false, utter: null, timer: null };
  var finto = {
    get speaking() { return parlato.attivo; },
    get paused() { return false; },
    speak: function (u) {
      segna('speak', { testo: u.text, rate: u.rate });
      parlato.attivo = true;
      parlato.utter = u;
      if (u.onstart) u.onstart();
      parlato.timer = setTimeout(function () {
        parlato.attivo = false;
        parlato.timer = null;
        if (u.onend) u.onend();
      }, 20);
    },
    cancel: function () {
      segna('cancel');
      if (!parlato.attivo) return;
      // Come quello vero: smette di parlare SUBITO, e l'`onend` dell'utterance
      // interrotta arriva dopo. Farlo partire qui e ora renderebbe sincrono un
      // effetto che nell'app è asincrono — cioè nasconderebbe proprio i bug di
      // ordine che questo file esiste per vedere.
      parlato.attivo = false;
      if (parlato.timer) { clearTimeout(parlato.timer); parlato.timer = null; }
      var u = parlato.utter;
      parlato.utter = null;
      setTimeout(function () { if (u && u.onend) u.onend(); }, 0);
    },
    pause: function () {}, resume: function () {},
    getVoices: function () { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; },
    onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: finto, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  class FakeRecognition {
    // ⚠️ `onspeechstart` E `window.__rec` SERVONO AL BLOCCO [D], e vanno qui
    // e non lì: l'app costruisce il riconoscitore a TEMPO DI PARSING, cioè
    // prima che qualunque `evaluate` del test possa arrivarci. L'unico istante
    // in cui il finto si può far trovare è il proprio costruttore.
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; this.onspeechstart = null; this.onspeechend = null; this.__attiva = false; window.__rec = this; }
    start() {
      segna('rec-start');
      this.__attiva = true;
      // NON si autoconclude: se l'app non chiama stop(), questa registrazione
      // resta aperta — che è esattamente il guasto da far vedere.
    }
    stop() {
      segna('rec-stop');
      if (!this.__attiva) return;
      this.__attiva = false;
      const self = this;
      setTimeout(function () {
        if (self.onresult) self.onresult({ results: [{ 0: { transcript: window.__vcTranscript || 'hello' }, isFinal: true, length: 1 }] });
        if (self.onend) self.onend();
      }, 10);
    }
    abort() { segna('rec-abort'); this.__attiva = false; if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;

  // L'aiutante vive nella pagina perché gli eventi vanno mandati DENTRO un
  // solo giro sincrono (regola 19): mandarli da fuori, uno per `evaluate`,
  // rimetterebbe in mezzo l'orologio della macchina.
  window.__mandaSeAscoltato = function (nomi) {
    var mancanti = [];
    for (var i = 0; i < nomi.length; i++) {
      var n = nomi[i];
      if (typeof window.__rec[n] !== 'function') { mancanti.push(n); continue; }
      window.__rec[n](n === 'onresult'
        ? { results: [{ 0: { transcript: window.__testoFinto || 'hello' }, isFinal: true, length: 1 }] }
        : {});
    }
    return mancanti;
  };
};

// ⚠️ L'EVENTO SI MANDA SOLO SE L'APP LO ASCOLTA, E IL RESTO DEL FILE
// CONTINUA A GUARDARE.
//
// Chiamare `window.__rec.onspeechend(...)` quando l'app non ha collegato quel
// gestore alza un `TypeError` dentro l'`evaluate`, e l'eccezione porta via i
// blocchi che vengono dopo: togliendo il terzo timer per falsificarlo, `[E]`
// moriva e `[F]` non arrivava nemmeno a dire come era andato. **Una misura
// che non misura, in forma di rosso** — dice che qualcosa è andato storto,
// non cosa. È la stessa forma già corretta in `test_uscita_dal_muro.js` con
// `pannelloAperto()`.
//
// Così invece il gestore mancante diventa **un'asserzione con un nome**, e i
// blocchi dopo restano vivi. Verificato togliendo `onspeechend`: `[E]` dice
// che l'app non ascolta l'evento, e `[F]` continua a guardare.
// ⚠️ I PASSI PRIMA SI SEGNANO COMPLETATI, altrimenti lo Sblocco Sequenziale
// tiene il pulsante spento e il test muore invece di fallire. `stepsBefore`
// legge la sequenza vera: un riordino dei ventidue passi non rompe questo file.
async function apriMappa(page, utente, moduleId) {
  await page.addInitScript(mockInit);
  await bloccaFontEsterni(page);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  const completed = stepsBefore(moduleId);
  await page.evaluate(function (d) {
    localStorage.setItem(BI.moduleProgressKey('gate', d.u), JSON.stringify({ completed: d.c }));
    ['mappaEpisodio', 'meetTheStory', 'whyWeSayIt', 'voicePractice'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + d.u, '1');
    });
  }, { u: utente, c: completed });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] IL BLOCCO ASCOLTO PARLA SUBITO ──────────────────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioA' + Date.now(), 'meetTheStory');
    await openModule(page, 'meetTheStory');
    await page.waitForSelector('[data-say]', { timeout: 15000 });

    // ⚠️ CLICK E LETTURA NELLA STESSA CHIAMATA SINCRONA. Se `speak` parte nel
    // gestore, è già nell'elenco quando la riga dopo lo legge. Se parte tre
    // secondi dopo, non c'è — e non serve nessun cronometro (regola 19).
    const subito = await page.evaluate(function () {
      window.__audio.eventi.length = 0;
      document.querySelector('[data-say]').click();
      return window.__audio.eventi.map(function (e) { return e.nome; });
    });
    log('[A] Il tocco fa partire la voce nello STESSO gestore, non dopo',
      subito.indexOf('speak') !== -1, JSON.stringify(subito));
    log('[A] ...e non c\'è nessun annullamento prima', subito.indexOf('cancel') === -1, JSON.stringify(subito));
    log('[A] ...e parte UNA volta sola', subito.filter(function (n) { return n === 'speak'; }).length === 1, JSON.stringify(subito));

    // ⚠️ I DUE TOCCHI NELLA STESSA CHIAMATA, e non è pignoleria: fra due
    // `evaluate` passa un giro di rete, la voce finta è già finita, e il
    // secondo tocco non avrebbe niente da fermare. *Il toggle esiste solo
    // MENTRE parla*, quindi va provato lì — leggere lo stato dopo un round
    // trip misurerebbe un'altra cosa (regola 19).
    const secondo = await page.evaluate(function () {
      window.__audio.eventi.length = 0;
      var b = document.querySelector('[data-say]');
      b.click();
      b.click();
      return window.__audio.eventi.map(function (e) { return e.nome; });
    });
    log('[A] Un secondo tocco MENTRE parla ferma la voce',
      secondo.indexOf('cancel') !== -1, JSON.stringify(secondo));

    // La velocità scelta arriva alla sintesi: è la coda di speakListenBlock.
    const conRate = await page.evaluate(function () {
      window.__audio.eventi.length = 0;
      var b = document.querySelector('.rate-btn[data-rate]');
      if (!b) return { assente: true };
      var atteso = parseFloat(b.getAttribute('data-rate'));
      b.click();
      var ev = window.__audio.eventi.filter(function (e) { return e.nome === 'speak'; })[0];
      return { atteso: atteso, letto: ev ? ev.rate : null };
    });
    log('[A] La velocità del pulsante arriva alla sintesi',
      !conRate.assente && conRate.letto === conRate.atteso, JSON.stringify(conRate));

    log('[A] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [B] IL MICROFONO PARTE, SI FERMA, E HA UN TETTO ─────────────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioB' + Date.now(), 'voicePractice');
    let aperto = true;
    try {
      await openModule(page, 'voicePractice');
      await page.waitForSelector('#vc-record-btn', { timeout: 15000 });
    } catch (e) { aperto = false; log('[B] Voice Practice si apre', false, String(e).split('\n')[0]); }
    if (aperto) log('[B] Voice Practice si apre', true);

    const primo = aperto ? await page.evaluate(function () {
      window.__audio.eventi.length = 0;
      document.getElementById('vc-record-btn').click();
      return window.__audio.eventi.map(function (e) { return e.nome; });
    }) : [];
    log('[B] Il primo click fa partire la registrazione, subito',
      primo.indexOf('rec-start') !== -1, JSON.stringify(primo));

    // ⚠️ LA RIGA CHE IL FINTO VUOTO NON POTEVA FARE. `stop() {}` degli altri
    // test non registra niente: un'app che non chiama stop() sarebbe passata.
    const stop = aperto ? await page.evaluate(function () {
      window.__audio.eventi.length = 0;
      document.getElementById('vc-record-btn').click();
      return window.__audio.eventi.map(function (e) { return e.nome; });
    }) : [];
    log('[B] Il secondo click FERMA la registrazione (chiama stop)',
      stop.indexOf('rec-stop') !== -1, JSON.stringify(stop));

    log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [C] UNA REGISTRAZIONE MUTA SI FERMA DA SOLA ─────────────────────
  // È il terzo sintomo riportato da Pages: «a volte va oltre i 3 secondi
  // senza fermarsi». Tre secondi è `silenceTimeoutSeconds`, cioè il taglio
  // che scatta quando il riconoscimento non ha sentito NIENTE.
  //
  // ⚠️ IL TETTO SI ABBASSA, NON SI CRONOMETRA. Aspettare i tre secondi veri
  // sarebbe una corsa contro l'orologio della macchina (regola 19). Portando
  // il taglio a un valore minuscolo l'asserzione diventa «lo stop arriva o
  // non arriva», e chi aspetta è `waitForFunction` su un effetto che deve
  // esistere — non un `waitForTimeout` tarato a occhio. Il tetto lungo
  // (`maxRecording*`) viene alzato apposta: se restasse basso, a fermare la
  // registrazione sarebbe LUI, e questa riga sarebbe verde per il motivo
  // sbagliato.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioC' + Date.now(), 'voicePractice');
    await openModule(page, 'voicePractice');
    await page.waitForSelector('#vc-record-btn', { timeout: 15000 });

    await page.evaluate(function () {
      window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.15;
      window.APP_CONFIG.voiceCoach.maxRecordingMsPerWord = 60000;
      window.APP_CONFIG.voiceCoach.maxRecordingMarginMs = 60000;
      window.__audio.eventi.length = 0;
      document.getElementById('vc-record-btn').click();
    });

    // Il finto microfono non si autoconclude: se l'app non chiama `stop()`,
    // questo `rec-stop` non arriva mai e l'attesa scade — che è il guasto.
    let siFermaDaSola = true;
    try {
      await page.waitForFunction(function () {
        return window.__audio.eventi.some(function (e) { return e.nome === 'rec-stop'; });
      }, { timeout: 5000 });
    } catch (e) { siFermaDaSola = false; }
    log('[C] Una registrazione muta si ferma DA SOLA, senza nessun click', siFermaDaSola,
      JSON.stringify(await page.evaluate(function () { return window.__audio.eventi.map(function (e) { return e.nome; }); })));

    // E lo studente lo vede: il taglio per silenzio non invia niente e alza
    // l'avviso. Senza questa riga «si è fermata» sarebbe indistinguibile da
    // «si è fermata e ha mandato il vuoto in valutazione».
    let avvisoVisibile = false;
    try {
      await page.waitForFunction(function () {
        var el = document.getElementById('vc-silence-warning');
        return el && !el.hidden;
      }, { timeout: 5000 });
      avvisoVisibile = true;
    } catch (e) { avvisoVisibile = false; }
    log('[C] ...e lo studente vede l\'avviso di silenzio', avvisoVisibile);

    log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [D] CHI COMINCIA A PARLARE TARDI NON VIENE TAGLIATO ───────────
  //
  // È il terzo sintomo di Pages, quello che il limite in testa a questo file
  // dichiarava SCOPERTO: «spesso il microfono non sente». Adesso è coperto, e
  // il limite è stato riscritto.
  //
  // COSA SI PERDE SENZA QUESTO BLOCCO, e non è un'ipotesi: è stato riprodotto
  // a mano due volte da chi guida il progetto, con lo stesso confine —
  // partendo prima del secondo 2 sente, fra il 2 e il 3 no.
  //
  // ⚠️ IL PUNTO DI TUTTO IL BLOCCO: `speechstart` arriva SENZA `onresult`.
  // Il riconoscitore dice «sto sentendo una voce» molto prima di consegnare
  // il primo pezzo di trascrizione, e prima della correzione l'app guardava
  // solo il secondo. Qui il finto manda `speechstart` e NIENTE altro: se
  // l'app non lo ascolta, per lei è ancora silenzio e taglia.
  //
  // COME SI DISTINGUONO LE DUE VERSIONI SENZA UN CRONOMETRO (regola 19).
  // Non si misura QUANDO si ferma la registrazione — quello dipenderebbe
  // dalla macchina. Si guarda QUALE DELLE DUE STRADE ha preso:
  //
  //   · versione vecchia → taglio per silenzio a 0,15 s → la registrazione
  //     viene BUTTATA: avviso di silenzio a schermo, stato `idle`, niente da
  //     inviare;
  //   · versione nuova   → il taglio non scatta → ferma il TETTO a 1,5 s →
  //     la registrazione è TENUTA: compare l'area Invia/Cancella.
  //
  // Le due strade portano a due DOM diversi, e la differenza non ha niente a
  // che fare con quanto è veloce il container.
  //
  // ⚠️ E L'ISTANTE IN CUI ARRIVA LA VOCE NON DIPENDE DALLA MACCHINA: click
  // e `speechstart` stanno nella STESSA chiamata sincrona. Mandandolo con un
  // `evaluate` a parte, su un container lento il taglio a 0,15 s potrebbe
  // arrivare prima — e il test diventerebbe una corsa invece di una misura.
  //
  // ⚠️ L'APPRODO NON È QUELLO CHE LE ASSERZIONI LEGGONO (regola 44). Si
  // aspetta che il pulsante smetta di essere `is-recording`, che è l'effetto
  // COMUNE alle due strade — vero in entrambe, quindi non dice quale è stata
  // presa. Le due asserzioni leggono ciò che DIFFERISCE, e l'attesa non lo
  // tocca.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioD' + Date.now(), 'voicePractice');
    await openModule(page, 'voicePractice');
    await page.waitForSelector('#vc-record-btn', { timeout: 15000 });

    const partito = await page.evaluate(function () {
      window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.15;
      // Il tetto NON dipende dal numero di parole: così la seconda strada
      // finisce sempre a 1,5 s, qualunque frase abbia davanti.
      window.APP_CONFIG.voiceCoach.maxRecordingMsPerWord = 0;
      window.APP_CONFIG.voiceCoach.maxRecordingMarginMs = 1500;
      window.__audio.eventi.length = 0;
      document.getElementById('vc-record-btn').click();
      // La voce comincia DOPO il click e PRIMA che il taglio scatti — nello
      // stesso giro sincrono, così l'istante è fissato dal codice e non
      // dall'orologio.
      if (!window.__rec || !window.__rec.onspeechstart) return false;
      window.__rec.onspeechstart({});
      return true;
    });
    log('[D] Il finto sa dire «sto sentendo una voce», e l\'app lo ascolta',
      partito === true,
      partito === false ? 'onspeechstart non è collegato: l\'app non ascolta l\'evento' : '');

    let finita = true;
    try {
      await page.waitForFunction(function () {
        var b = document.getElementById('vc-record-btn');
        return b && !b.classList.contains('is-recording');
      }, { timeout: 10000 });
    } catch (e) { finita = false; }
    log('[D] La registrazione finisce (da una delle due strade)', finita);

    const esito = await page.evaluate(function () {
      return {
        offerta: !document.getElementById('vc-confirm-area').hidden,
        avvisoSilenzio: !document.getElementById('vc-silence-warning').hidden
      };
    });
    log('[D] Chi comincia a parlare tardi NON viene tagliato per silenzio',
      esito.avvisoSilenzio === false, JSON.stringify(esito));
    log('[D] ...e la sua registrazione viene TENUTA, non buttata',
      esito.offerta === true, JSON.stringify(esito));

    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [E] CHI HA FINITO DI PARLARE NON ASPETTA IL TETTO ─────────────
  //
  // Il terzo timer: `afterSpeechTimeoutMs` dopo che la voce si ferma. Gli
  // altri due contano dal click, questo dalla fine della frase — ed è il solo
  // che può accorciare la registrazione di chi ha finito presto.
  //
  // ⚠️ IL TETTO È MESSO IRRAGGIUNGIBILE APPOSTA (60 s). Se restasse basso, a
  // fermare la registrazione sarebbe LUI e questa riga sarebbe verde per il
  // motivo sbagliato — la stessa trappola già evitata in `[C]`, al rovescio.
  // Così l'unico che può fermarla è il terzo: o arriva, o il test aspetta
  // invano. Sulla versione senza `onspeechend` aspetta invano.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioE' + Date.now(), 'voicePractice');
    await openModule(page, 'voicePractice');
    await page.waitForSelector('#vc-record-btn', { timeout: 15000 });

    const mancanti = await page.evaluate(function () {
      window.APP_CONFIG.voiceCoach.afterSpeechTimeoutMs = 150;
      window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 60;
      window.APP_CONFIG.voiceCoach.maxRecordingMsPerWord = 0;
      window.APP_CONFIG.voiceCoach.maxRecordingMarginMs = 60000;
      window.__audio.eventi.length = 0;
      window.__testoFinto = 'hello there';
      document.getElementById('vc-record-btn').click();
      // La frase intera in un giro sincrono: comincia, dice qualcosa, finisce.
      // ⚠️ Il testo va mandato DAVVERO (onresult), perché senza parole il
      // terzo timer butta invece di tenere.
      return window.__mandaSeAscoltato(['onspeechstart', 'onresult', 'onspeechend']);
    });
    log('[E] L\'app ascolta «la voce si è fermata» (onspeechend)',
      mancanti.length === 0, 'gestori non collegati: ' + JSON.stringify(mancanti));

    let fermata = true;
    try {
      await page.waitForFunction(function () {
        return window.__audio.eventi.some(function (e) { return e.nome === 'rec-stop'; });
      }, { timeout: 8000 });
    } catch (e) { fermata = false; }
    log('[E] Finito di parlare, la registrazione si chiude senza aspettare il tetto',
      fermata, 'nessun rec-stop: il terzo timer non è partito');

    await page.waitForFunction(function () {
      var b = document.getElementById('vc-record-btn');
      return b && !b.classList.contains('is-recording');
    }, { timeout: 8000 }).catch(function () {});
    const esito = await page.evaluate(function () {
      return {
        offerta: !document.getElementById('vc-confirm-area').hidden,
        avvisoSilenzio: !document.getElementById('vc-silence-warning').hidden
      };
    });
    log('[E] ...e la registrazione viene TENUTA, non buttata', esito.offerta === true, JSON.stringify(esito));
    log('[E] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  // ── [F] UNA PAUSA PER PRENDERE FIATO NON TAGLIA ────────────────
  //
  // ⚠️ È IL RISCHIO PRINCIPALE DEL TERZO TIMER, e senza questo blocco sarebbe
  // il suo regalo avvelenato: un timer che parte alla prima pausa taglia in
  // mezzo a una frase — cioè rifa' lo stesso danno che il passo prima aveva
  // appena tolto, dall'altro lato.
  //
  // COME SI ASPETTA SENZA UN CRONOMETRO (regola 19). Non si dorme un tempo
  // scelto a occhio per poi dire «non si è fermata»: si aspetta un effetto
  // POSITIVO che esiste solo se è passato del tempo davvero — **il timer a
  // schermo che arriva a `1s`** — e quel secondo è sei volte i 150 ms del
  // terzo timer. Se il riarmo non funziona, la registrazione si chiude a 150
  // ms, il timer a schermo si ferma a `0s` e l'attesa non arriva: allora
  // l'asserzione legge il registro degli eventi e trova il `rec-stop` che non
  // doveva esserci.
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await apriMappa(page, 'AudioF' + Date.now(), 'voicePractice');
    await openModule(page, 'voicePractice');
    await page.waitForSelector('#vc-record-btn', { timeout: 15000 });

    const mancantiF = await page.evaluate(function () {
      window.APP_CONFIG.voiceCoach.afterSpeechTimeoutMs = 150;
      window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 60;
      window.APP_CONFIG.voiceCoach.maxRecordingMsPerWord = 0;
      window.APP_CONFIG.voiceCoach.maxRecordingMarginMs = 60000;
      window.__audio.eventi.length = 0;
      document.getElementById('vc-record-btn').click();
      // pausa (onspeechend: il conto parte) e voce che riprende
      // (onspeechstart: si annulla), tutto in un giro sincrono.
      return window.__mandaSeAscoltato(['onspeechstart', 'onresult', 'onspeechend', 'onspeechstart']);
    });
    log('[F] L\'app ascolta i due eventi della voce',
      mancantiF.length === 0, 'gestori non collegati: ' + JSON.stringify(mancantiF));

    await page.waitForFunction(function () {
      var t = document.getElementById('vc-record-timer');
      return t && /^[1-9]\d*s$/.test(t.textContent.trim());
    }, { timeout: 8000 }).catch(function () {});

    const dopo = await page.evaluate(function () {
      return {
        fermata: window.__audio.eventi.some(function (e) { return e.nome === 'rec-stop'; }),
        orologio: document.getElementById('vc-record-timer').textContent
      };
    });
    log('[F] Se la voce riprende, il conto «dopo che hai finito» si annulla',
      dopo.fermata === false, JSON.stringify(dopo));
    log('[F] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('');
  console.log('=== COMPORTAMENTO AUDIO: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
