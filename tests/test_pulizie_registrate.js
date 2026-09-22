// PROTEGGE: che uscire da un modulo fermi davvero tutto, adesso che
// `stopAllModuleActivity` non nomina più nessuna famiglia di moduli.
//
// COSA SI PERDE SENZA QUESTO FILE. Il 2026-09-16 (passo 21-bis) quella
// funzione è passata da «dieci istruzioni scritte a mano» a «tre condivise +
// un ciclo su `BI.pulizie`». È il primo passo della catena che **toglie nomi
// invece di aggiungere un file**, e ha una proprietà scomoda: se un modulo
// smettesse di registrarsi, **nessun test esistente diventerebbe rosso**. Le
// pulizie sono idempotenti, quindi chiamarle due volte non rompe niente — e
// non chiamarle affatto non rompe niente *subito*: lascia un timer vivo, un
// audio che continua, un microfono acceso sopra un'altra schermata.
//
// ⚠️ PER QUESTO IL CONTO È «ESATTAMENTE 5», NON «ALMENO 1».
// Un `>= 1` passerebbe anche se quattro moduli su cinque sparissero dal
// registro. È la stessa forma del conteggio delle asserzioni: il numero non
// deve solo esserci, deve essere QUELLO.
//
// ⚠️ E L'ASSERZIONE SUL `catch` NON È UN ACCESSORIO: È LA METÀ CHE RENDE
// ACCETTABILE IL `try/catch`.
//
// Prima, una pulizia che alzava un'eccezione non fermava le altre cinque:
// fermava la NAVIGAZIONE. L'eccezione risaliva a `showView`, il punto unico di
// ogni spostamento, e lo studente restava chiuso dentro il modulo — misurato,
// non deduzione. Il `try/catch` toglie quel guasto, ma se ci fermassimo lì
// avremmo scambiato un guasto rumoroso con uno silenzioso, che è esattamente
// quello che questo progetto passa il tempo a non fare. Il blocco `[D]` è il
// rumore, spostato dove qualcuno lo sente: la suite, che si lancia sempre
// (regola 38).
//
// IL CASO PIÙ DIVERSO (regola 42): **le tre pulizie che non appartengono a
// nessun modulo** — `fermaLaVoce()` (era `synth.cancel()` fino al
// 2026-09-18), `closeAttemptPopup()`,
// `clearPendingMastery()`. Non sono il caso complicato: sono quelle a cui
// manca un modulo che possa registrarle, e per questo restano nominate. Il
// test le guarda apposta, perché un domani qualcuno potrebbe "finire la
// conversione" e portarle nel registro — dove nessun file le registrerebbe.
//
// LIMITE DICHIARATO: il blocco `[B]` guida **un modulo solo**, Ripeti a Tempo,
// perché è l'unico in cui un timer sopravvissuto si misura senza ambiguità (il
// countdown parte dalla fine dell'audio). Gli altri quattro li prende
// l'asserzione strutturale `[A]`, che vale per tutti.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni } = require('./test-env');
const { openModule } = require('./map-driver');
const { stepsBefore } = require('./module-order');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// La sintesi vocale come quella vera: `onend` arriva in modo ASINCRONO anche
// dopo `cancel()`. Un mock che lo chiama subito nasconderebbe proprio la
// famiglia di difetti che questo file guarda (CLAUDE.md regola 19).
const mockInit = () => {
  class FU { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  const fs2 = {
    speaking: false, _u: null, _t: null,
    speak(u) {
      this.speaking = true; this._u = u; if (u.onstart) u.onstart();
      this._t = setTimeout(() => { this.speaking = false; this._u = null; if (u.onend) u.onend(); }, 400);
    },
    cancel() {
      if (!this._u) return;
      var u = this._u; clearTimeout(this._t); this.speaking = false; this._u = null;
      setTimeout(function () { if (u.onend) u.onend(); }, 0);
    },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'F', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fs2, configurable: true });
  window.SpeechSynthesisUtterance = FU;
};

function contaTimer() {
  window.__vivi = new Set();
  const st = window.setTimeout, ct = window.clearTimeout;
  window.setTimeout = function (fn, ms) {
    const id = st.call(window, function () { window.__vivi.delete(id); fn && fn(); }, ms);
    window.__vivi.add(id); return id;
  };
  window.clearTimeout = function (id) { window.__vivi.delete(id); return ct.call(window, id); };
}

async function apriDialogo(page, utente) {
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (d) {
    localStorage.setItem(BI.customizeSeenKey('gate', d.u), '1');
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + d.u, '1');
    localStorage.setItem(BI.moduleProgressKey('gate', d.u), JSON.stringify({ completed: d.f }));
  }, { u: utente, f: stepsBefore('dialogoRipetiATempo') });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
  await openModule(page, 'dialogoRipetiATempo');
  if (await page.isVisible('#dg-start-btn').catch(() => false)) await page.click('#dg-start-btn');
  await page.waitForSelector('.dg-bubble', { timeout: 10000 });
  // Ripeti a Tempo non parla da solo: la bolla si tocca (CLAUDE.md regola 16).
  await page.click('.dg-bubble');
  await page.waitForFunction(() => window.speechSynthesis.speaking === true, { timeout: 5000 });
}

async function run() {
  // ── [A] I NOMI SONO SPARITI DAL PUNTO UNICO ──────────────────────────
  {
    // ⚠️ DAL 2026-09-18 LEGGE ANCHE `app/`, e non e' un allargamento: e' la
    // stessa domanda su un mondo che ha tredici file invece di uno. Col passo
    // che ha estratto `app/mappa.js` il codice cercato qui e' uscito da
    // index.html, e il test diceva «non trovato» — **rosso per una DECISIONE,
    // non per una regressione.** L'invariante non e' cambiato: vale su tutta
    // l'app, non su un file.
    //
    // *Letto cosi', resta giusto anche quando usciranno gli altri sette
    // moduli, invece di dover essere corretto sette volte.*
    const html = [repoPath('index.html')].concat(
      fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
        .map(function (f) { return repoPath('app', f); })
    ).map(function (f) { return fs.readFileSync(f, 'utf8'); }).join('\n');
    const i = html.indexOf('function stopAllModuleActivity');
    const corpo = html.slice(i, html.indexOf('\n  }', i));
    // ⚠️ I COMMENTI SI TOLGONO PRIMA DI CERCARE. Il corpo spiega la misura
    // dell'ordine e cita `dgClearAllTimers()` in PROSA: una verifica per
    // sottrazione che non distingue il codice dal commento è una misura che
    // non misura, e si è comportata così al primo giro.
    const codice = corpo.split('\n').map(function (r) { return r.split('//')[0]; }).join('\n');

    ['dgClearAllTimers', 'vcResetRecording', 'srClearTimer', 'srPulizia',
     'fcClearNavTimeout', 'storyCardsClearPendingStats', 'lockModuleHeader',
     'srCountdownTimeoutId'].forEach(function (nome) {
      log('[A] stopAllModuleActivity non nomina più ' + nome,
        new RegExp('\\b' + nome + '\\b').test(codice) === false);
    });
    log('[A] ...e al loro posto c\'è il ciclo sulle registrazioni',
      /BI\.pulizie\.forEach/.test(codice));

    // Le tre condivise restano, ed è una decisione: non hanno un modulo che
    // possa registrarle. Se sparissero da qui, nessuno le chiamerebbe più.
    //
    // ⚠️ `fermaLaVoce` si chiamava `synth.cancel` fino al 2026-09-18, e questa
    // riga è diventata rossa per una DECISIONE, non per una regressione
    // (famiglia ⓪-undecies): `synth` era una risorsa condivisa da quattro
    // strati futuri e adesso ha cinque domande davanti, così il nucleo audio
    // può uscire in un file suo. **L'invariante non è cambiato — «la pulizia
    // che ferma la voce resta nominata qui» — è cambiato il NOME con cui la si
    // nomina.** La correzione non è togliere la riga: è seguirla.
    ['fermaLaVoce', 'closeAttemptPopup', 'clearPendingMastery'].forEach(function (nome) {
      log('[A] La pulizia condivisa ' + nome + ' resta nominata', codice.indexOf(nome) !== -1);
    });

    // La protezione contro i callback tardivi NON sta nel ciclo.
    //
    // ⚠️ SI GUARDA IN `leaveModule`, NON IN `showView` — spostata il 2026-09-17
    // (passo 22, prima estrazione). **Questa riga e' diventata rossa per una
    // DECISIONE, non per una regressione**, e la correzione non e' toglierla:
    // e' seguirla dove la cosa che protegge e' andata a stare.
    //
    // `showView` faceva tre lavori; adesso disegna e basta, e `leaveModule` fa
    // «lasciare» — `nuovaEpoca()` inclusa, perche' neutralizzare le chiamate
    // asincrone tardive e' meta' del lasciare (CLAUDE.md regola 21).
    //
    // *L'invariante non e' cambiato di una virgola: l'incremento dell'epoca
    // deve precedere la pulizia, o un callback che arriva mentre le pulizie
    // girano troverebbe l'epoca vecchia e si crederebbe ancora valido.*
    // ⚠️ IL CORPO SI TAGLIA ALLA FINE DELLA FUNZIONE, NON A UN NUMERO FISSO.
    //
    // La forma precedente prendeva 400 caratteri dall'inizio di `showView`, e
    // funzionava finche' `showView` era sola. Dopo la separazione, 400
    // caratteri dall'inizio di `showView` **sconfinano dentro `leaveModule`**
    // — che `nuovaEpoca()` e `stopAllModuleActivity()` li contiene per
    // definizione — e l'asserzione «showView non ne contiene nessuno dei due»
    // nasceva rossa su codice giusto.
    //
    // *Un numero fisso era esatto per il codice di ieri e falso per quello di
    // oggi senza cambiare una cifra: la stessa forma dei tempi citati invece
    // che rimisurati (regola 38). Il confine di una funzione si chiede al
    // codice, non si stima.*
    function corpoDi(nome) {
      const i = html.indexOf('function ' + nome);
      if (i === -1) return '';
      const fine = html.indexOf('\n  }', i);
      return fine === -1 ? html.slice(i) : html.slice(i, fine);
    }
    const lm = corpoDi('leaveModule');
    // ⚠️ `moduleEpoch++` si chiama `nuovaEpoca()` dal 2026-09-18, e anche
    // questa riga e' rossa per una DECISIONE (⓪-undecies, quarta volta):
    // l'epoca e' passata da variabile a due funzioni perche' IL PONTE DEGLI
    // ALIAS NON FUNZIONA PER UN NUMERO — una copia avrebbe congelato il
    // valore e la protezione sarebbe diventata inerte in silenzio.
    // **L'invariante e' identico: si azzera l'epoca PRIMA di fermare i
    // timer.** Cambia solo come lo si scrive.
    log('[A] nuovaEpoca() resta PRIMA di stopAllModuleActivity, in leaveModule',
      lm.indexOf('nuovaEpoca()') !== -1 &&
      lm.indexOf('nuovaEpoca()') < lm.indexOf('stopAllModuleActivity()'));

    // ⚠️ E L'ALTRA META' DELLA DECISIONE, che prima non c'era niente a
    // proteggere: `showView` NON deve piu' contenere ne' l'incremento
    // dell'epoca ne' la pulizia. Senza questa riga, rimettercene uno dentro
    // sarebbe passato verde — e le due chiamate pre-login avrebbero ripreso a
    // trascinarsi dietro tre strati.
    const sv = corpoDi('showView');
    log('[A] ...e showView non ne contiene piu\' nessuno dei due: disegna e basta',
      sv.indexOf('nuovaEpoca()') === -1 && sv.indexOf('stopAllModuleActivity()') === -1);
  }

  const browser = await launchBrowser();

  // ── [B] IL CONTO ESATTO, e l'uscita che ferma davvero tutto ──────────
  {
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', function (e) { errori.push(e.message); });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    await page.addInitScript(contaTimer);
    await apriDialogo(page, 'Pul1');

    const reg = await page.evaluate(() => ({
      n: window.BI.pulizie.length, nomi: window.BI.pulizie.map(function (f) { return f.name; })
    }));
    // ⚠️ ESATTAMENTE cinque: un ">= 1" passerebbe con quattro moduli spariti.
    log('[B] Al boot si registrano ESATTAMENTE 5 pulizie', reg.n === 5, JSON.stringify(reg));
    ['dgClearAllTimers', 'vcResetRecording', 'srPulizia', 'fcClearNavTimeout',
     'storyCardsClearPendingStats'].forEach(function (nome) {
      log('[B] ...fra cui ' + nome, reg.nomi.indexOf(nome) !== -1, reg.nomi.join(','));
    });

    const durante = await page.evaluate(() => window.__vivi.size);
    log('[B] Mentre il modulo gira c\'è lavoro in corso', durante > 0, String(durante));

    await page.click('#dialogo-back-map');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    // L'approdo è la mappa (l'ULTIMO effetto del gesto, regola 44); il tempo
    // in più serve a dare a un `onend` asincrono la possibilità di creare un
    // timer che nessuno spegnerebbe — è il difetto che si sta cercando.
    await page.waitForTimeout(600); // ATTESA-LEGITTIMA: si aspetta che qualcosa NON succeda
    const dopo = await page.evaluate(() => ({
      vivi: window.__vivi.size, parla: window.speechSynthesis.speaking
    }));
    log('[B] Uscendo dal modulo non sopravvive nessun timer', dopo.vivi === 0, JSON.stringify(dopo));
    log('[B] E l\'audio è fermo', dopo.parla === false);
    log('[B] Nessun errore JS', errori.length === 0, errori[0]);
    await page.close();
  }

  // ── [C] UNA PULIZIA CHE ESPLODE NON CHIUDE PIÙ DENTRO IL MODULO ──────
  {
    const page = await browser.newPage();
    // ⚠️ SI ASCOLTA LA CONSOLE, e non è un di più: senza, questo blocco NON
    // distingue un `catch` che riporta da uno MUTO. Misurato — togliendo il
    // `console.error` da index.html il file restava 26/26, perché [D] verifica
    // che in una sessione normale nessuna pulizia fallisca, il che è vero in
    // entrambi i casi. **Era il buco esattamente dove il try/catch va coperto.**
    const riportati = [];
    page.on('console', function (m) {
      if (m.type() === 'error' && m.text().indexOf('[pulizia]') !== -1) riportati.push(m.text());
    });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    // Si rompe una pulizia REGISTRATA, dopo il boot: è il caso vero, non un
    // modulo mai caricato.
    await page.addInitScript(() => {
      window.__dopoLaRotta = 0;
      window.addEventListener('DOMContentLoaded', function () {
        window.BI.pulizie.unshift(function pulizia_che_esplode() {
          throw new Error('pulizia rotta (finta)');
        });
        window.BI.pulizie.push(function pulizia_dopo_la_rotta() { window.__dopoLaRotta++; });
      });
    });
    // ⚠️ ANCHE L'APERTURA SI CATTURA, e il perché è la misura stessa: senza
    // try/catch una pulizia rotta non impedisce di USCIRE dal modulo — impedisce
    // di ENTRARCI, perché `showView` chiama la pulizia a ogni cambio di vista e
    // l'eccezione risale dalla PRIMA navigazione in poi. L'app diventa
    // inutilizzabile, non scomoda. Lasciando l'attesa nuda il test moriva qui
    // con un TimeoutError, cioè col rosso più muto possibile davanti al guasto
    // più grave che questo file conosce.
    let arrivato = true;
    await apriDialogo(page, 'Pul2').catch(function () { arrivato = false; });
    log('[C] Con una pulizia rotta si riesce comunque ad APRIRE un modulo',
      arrivato === true,
      'non si arriva nemmeno al modulo: l\'eccezione risale a showView, che è il punto unico di OGNI navigazione');
    if (arrivato) await page.click('#dialogo-back-map');
    // ⚠️ L'ATTESA SI CATTURA, e non è prudenza generica: il guasto che questo
    // blocco cerca è PROPRIO «non si esce più dal modulo». Lasciandola nuda, il
    // test MORIREBBE con un TimeoutError — un rosso che dice «qualcosa è
    // esploso» invece di «lo studente è rimasto chiuso dentro». Sono due cose
    // diverse: un test che muore non è un test che fallisce.
    let uscito = arrivato;
    if (arrivato) {
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 })
        .catch(function () { uscito = false; });
    }
    log('[C] Con una pulizia rotta la mappa si apre comunque', uscito === true,
      'la mappa non si è aperta: l\'eccezione è risalita a showView e lo studente è chiuso nel modulo');
    const r = await page.evaluate(() => ({
      mappa: document.getElementById('view-map').classList.contains('is-active'),
      dopo: window.__dopoLaRotta
    })).catch(function () { return { mappa: false, dopo: 0 }; });
    log('[C] ...e la vista attiva è davvero quella della mappa', r.mappa === true, JSON.stringify(r));
    log('[C] ...e le pulizie DOPO quella rotta girano comunque', r.dopo > 0, JSON.stringify(r));
    // La metà che rende accettabile il catch: il fallimento NON è silenzioso.
    log('[C] Il fallimento viene riportato, col nome della pulizia',
      riportati.length > 0 && riportati[0].indexOf('pulizia_che_esplode') !== -1,
      riportati.length ? riportati[0] : 'nessun [pulizia] in console: il catch è MUTO');
    await page.close();
  }

  // ── [D] IL RUMORE, spostato dove qualcuno lo sente ───────────────────
  //
  // È l'asserzione che rende accettabile il try/catch di [C]: in una sessione
  // normale NESSUNA pulizia deve fallire, e se una fallisse il messaggio
  // «[pulizia] … ha fallito» comparirebbe in console e questa riga diventerebbe
  // rossa. Senza, il catch trasformerebbe un guasto rumoroso in uno silenzioso.
  {
    const page = await browser.newPage();
    const fallimenti = [];
    page.on('console', function (m) {
      if (m.type() === 'error' && m.text().indexOf('[pulizia]') !== -1) fallimenti.push(m.text());
    });
    await bloccaFontEsterni(page);
    await page.addInitScript(mockInit);
    await apriDialogo(page, 'Pul3');
    await page.click('#dialogo-back-map');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    // Un secondo modulo, di una famiglia diversa, per far girare le pulizie
    // di più di un registrante.
    await openModule(page, 'meetTheStory');
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: si aspetta che qualcosa NON succeda
    await page.click('#story-cards-back-map').catch(function () {});
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: si aspetta che qualcosa NON succeda
    log('[D] In una sessione normale nessuna pulizia fallisce',
      fallimenti.length === 0, fallimenti.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('\n=== PULIZIE REGISTRATE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed > 0) process.exit(1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
