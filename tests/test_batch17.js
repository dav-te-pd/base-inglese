const { launchBrowser, APP_URL, attendiPrimaSchermata } = require('./test-env');
const { attendiCheParla, attendiClasse, attendiVisibile, misura } = require('./attese');
const { loadGrade } = require('./quiz-driver');
const { gradeOf, stepsBefore } = require('./module-order');
const { openModule } = require('./map-driver');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking = true; this._current = utter; if (utter.onstart) utter.onstart(); utter._timer = setTimeout(() => { if (this._current === utter) { this.speaking = false; this._current = null; } if (utter.onend) utter.onend(); }, 500); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._timer); if (u.onerror) u.onerror({ error: 'canceled' }); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {
      setTimeout(() => {
        if (this.onresult) {
          var text = window.__vcTranscript || '';
          this.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
        }
      }, 5);
    }
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;

  const OrigAC = window.AudioContext || window.webkitAudioContext;
  if (OrigAC) {
    window.__playedTones = [];
    const OrigCreateOscillator = OrigAC.prototype.createOscillator;
    const OrigCreateGain = OrigAC.prototype.createGain;
    OrigAC.prototype.createOscillator = function () {
      const osc = OrigCreateOscillator.call(this);
      let freq = null;
      Object.defineProperty(osc.frequency, 'value', { set(v) { freq = v; }, get() { return freq; } });
      osc.__getFreq = () => freq;
      window.__pendingOsc = osc;
      return osc;
    };
    OrigAC.prototype.createGain = function () {
      const gain = OrigCreateGain.call(this);
      const origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
      gain.gain.setValueAtTime = function (v, t) {
        if (window.__pendingOsc) window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v });
        return origSetValueAtTime(v, t);
      };
      return gain;
    };
  }
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  // ⚠️ L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): senza questa attesa, «non c'e' il campo del nome» e «non
  // c'e' ancora niente» si leggono uguali, e il test clicca un pulsante che
  // non e' ancora comparso. Vedi `attendiPrimaSchermata` in test-env.js.
  await attendiPrimaSchermata(page);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    if (completedModules) localStorage.setItem(BI.moduleProgressKey('gate', userName), JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach', 'voicePractice', 'matchEngIta', 'matchItaEng', 'speedMatchEngIta', 'speedMatchItaEng', 'flashcard', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

const ALL_BEFORE_QM = stepsBefore('matchEngIta');
const ALL_BEFORE_DG = stepsBefore('dialogoAscoltaRipeti');
const ALL_BEFORE_VC = stepsBefore('voiceCoach');

async function run() {
  const browser = await launchBrowser();
  const results = [];
  // ⚠️ IL TERZO ARGOMENTO SI STAMPA — aggiunto il 2026-09-24 (passo 1.18).
  //
  // Qui `log` ne prendeva due e buttava via il resto: una riga rossa usciva
  // **senza il suo perche'**, anche quando chi l'aveva scritta il perche'
  // l'aveva passato. *E' successo scrivendo questo stesso passo: la diagnosi
  // del ramo «pulsante non trovato» e' stata scritta, passata, e non stampata.*
  const log = (msg, ok, extra) => {
    results.push({ msg, ok });
    console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg + (!ok && extra ? '  -> ' + extra : ''));
  };

  // ============ JOB 1a: Dialogo Ripeti a Tempo (countdown profile) — still fully locked, unchanged ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1a', ALL_BEFORE_DG.concat(['dialogoAscoltaRipeti']));
    await openModule(page, 'dialogoRipetiATempo');
    var dgStart = await page.isVisible('#dg-start-btn').catch(() => false);
    // ⚠️ SI ASPETTA CHE LE BOLLE ESISTANO, NON 100 MILLISECONDI — e questa e'
    // la corsa VERA, trovata rimisurando: la prima correzione di queste due
    // asserzioni aveva tolto la corsa contro la FINE DELL'AUDIO, e loro sono
    // cadute lo stesso, in due giri di stress su tre. *Avevo corretto la
    // corsa sbagliata.*
    //
    // Il messaggio lo diceva: `attiva: false` con `durante` costruito su
    // `document.querySelector('.dg-bubble')` **null** — cioe' non era l'audio
    // finito troppo presto, era la LISTA DELLE BOLLE non ancora disegnata.
    // Tre righe piu' sotto, la stessa null faceva morire il file intero con un
    // TypeError.
    //
    // L'attesa e' legittima per la regola 44: le due asserzioni leggono
    // `is-active` e `disabled`, non «esiste una bolla».
    if (dgStart) {
      await page.click('#dg-start-btn');
      await page.waitForSelector('.dg-bubble', { timeout: 15000 });
    }
    // ⚠️ IL TOCCO E LE DUE LETTURE IN UNA CHIAMATA SOLA — regola 19, e qui la
    // ragione e' MISURATA: queste due asserzioni sono cadute in DUE giri di
    // stress su tre (`tests/tools/stress.sh`, 20 processi su 4 CPU).
    //
    // Prima il tocco stava in una chiamata, `is-active` in una seconda e
    // `disabled` in una terza. **Tutte e due le cose che si leggono esistono
    // solo MENTRE l'audio suona**: sotto contesa l'audio finisce prima che la
    // seconda chiamata arrivi, e l'asserzione cade senza che niente sia rotto.
    // Lette dentro il tocco, la finestra non esiste.
    const durante = await page.evaluate(() => {
      var b = document.querySelector('.dg-bubble');
      if (b) b.click();
      return {
        attiva: !!b && b.classList.contains('is-active'),
        spiegazioneBloccata: document.getElementById('dialogo-watch-btn').disabled
      };
    });
    log('[Job1a] First bubble is is-active while its audio plays', durante.attiva);
    log('[Job1a] Spiegazione still locks here (countdown profile, unchanged)', durante.spiegazioneBloccata === true);
    // Re-tap the SAME (active) bubble mid-audio -> must still be a no-op.
    await page.evaluate(() => document.querySelector('.dg-bubble').click());
    await page.waitForTimeout(700); // ATTESA-LEGITTIMA: qui il TEMPO E' LA COSA MISURATA. Si ritocca la stessa bolla mentre parla e si verifica che NON nasca un secondo countdown: e' un non-evento, e la finestra deve coprire l'audio (500 ms) piu' il timer. Aspettare uno stato significherebbe aspettare il duplicato che non deve arrivare
    const timerCount = await page.evaluate(() => document.querySelectorAll('.dg-bubble.dg-bubble-timer').length);
    log('[Job1a] At most ONE bubble ends up with an active countdown (no duplicate cycle)', timerCount <= 1);
    log('[Job1a] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1a-bis: Dialogo Ascolta e Ripeti (no countdown) — free tapping, nothing locks ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1abis', ALL_BEFORE_DG);
    await openModule(page, 'dialogoAscoltaRipeti');
    var dgStart2 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart2) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]');
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — Spiegazione NON deve spegnersi mentre l'audio parla (regola 16)
    const stateDuringAudio = await page.evaluate(() => ({
      watch: document.getElementById('dialogo-watch-btn').disabled,
      help: document.getElementById('dialogo-help-btn').disabled,
      otherBubbleLocked: document.querySelectorAll('.dg-bubble.is-locked').length
    }));
    log('[Job1a-bis] Spiegazione stays enabled during a line\'s own audio', stateDuringAudio.watch === false);
    log('[Job1a-bis] Help stays enabled during a line\'s own audio', stateDuringAudio.help === false);
    log('[Job1a-bis] No other bubble gets is-locked', stateDuringAudio.otherBubbleLocked === 0);
    // Free tapping promise: tap a DIFFERENT bubble while the first one is still "playing".
    if (bubbleIds.length > 1) {
      await page.click('.dg-bubble[data-line-id="' + bubbleIds[1] + '"]');
      const secondIsActive = await attendiClasse(page, '.dg-bubble[data-line-id="' + bubbleIds[1] + '"]', 'is-active');
      log('[Job1a-bis] Tapping a different line while one plays is allowed (frees switches to it)', secondIsActive === true);
    } else {
      log('[Job1a-bis] Tapping a different line while one plays is allowed (frees switches to it)', true);
    }
    log('[Job1a-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1b: Repeat Aloud — nothing locks; "Ho finito" stops audio on touch ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1b', stepsBefore('repeatAloud'));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#repeat-aloud-body .listen-block-btn, #repeat-aloud-body [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — "Ho finito" NON deve spegnersi durante l'audio di una parola (regola 16)
    const stateDuring = await page.evaluate(() => ({
      complete: document.getElementById('repeat-aloud-complete').disabled,
      watch: document.getElementById('repeat-aloud-watch-btn').disabled,
      help: document.getElementById('repeat-aloud-help-btn').disabled
    }));
    log('[Job1b] "Ho finito" stays enabled during word audio', stateDuring.complete === false);
    log('[Job1b] Spiegazione stays enabled during word audio', stateDuring.watch === false);
    log('[Job1b] Help stays enabled during word audio', stateDuring.help === false);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] Audio is actually playing before touching "Ho finito"', speakingBefore === true);
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] "Ho finito" stops the word audio on touch (stop-on-touch, not a lock)', speakingAfter === false);
    log('[Job1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1c: Story Cards — nothing locks; "Ho finito" stops audio on touch ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // Qui si verifica che l'audio NON disabiliti "Ho finito": serve un
    // modulo dove quel pulsante e' abilitato di suo, cioe' Meet the Story
    // (Why We Say It lo tiene bloccato finche' le skill non sono dichiarate,
    // che e' un blocco diverso e verificato altrove).
    await bootAsUser(page, 'T17Job1c', stepsBefore('meetTheStory'));
    await openModule(page, 'meetTheStory');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#story-cards-body [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — i pulsanti di Why We Say It NON devono spegnersi durante l'ascolto (regola 16)
    const stateDuring = await page.evaluate(() => ({
      complete: document.getElementById('story-cards-complete').disabled,
      watch: document.getElementById('story-cards-watch-btn').disabled
    }));
    log('[Job1c] "Ho finito" stays enabled during listen audio', stateDuring.complete === false);
    log('[Job1c] Spiegazione stays enabled during listen audio', stateDuring.watch === false);
    await page.click('#story-cards-complete');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1c] "Ho finito" stops the audio on touch', speakingAfter === false);
    log('[Job1c] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1d: Voice Coach — Avanti/Spiegazione stay enabled while re-listening after an attempt ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1d', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    // Do one attempt so vc-next-btn becomes enabled (evaluated), then re-listen.
    await page.evaluate(() => { window.__vcTranscript = 'test'; });
    await page.evaluate(() => document.getElementById('vc-record-btn').click());
    await page.waitForTimeout(150);
    await page.evaluate(() => { var b = document.getElementById('vc-send-btn'); if (b) b.click(); });
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#vc-audio-controls [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — Avanti e Spiegazione NON devono spegnersi mentre parla il bersaglio (regola 16)
    const stateDuring = await page.evaluate(() => ({
      next: document.getElementById('vc-next-btn').disabled,
      watch: document.getElementById('voice-coach-watch-btn').disabled
    }));
    log('[Job1d] Avanti stays enabled while target audio plays', stateDuring.next === false);
    log('[Job1d] Spiegazione stays enabled while target audio plays', stateDuring.watch === false);
    log('[Job1d] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1d-bis: Voice Coach — pressing Record stops model audio (mic-bleed guard, stop not block) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1dbis', ALL_BEFORE_VC);
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(200);
    // Fresh line, idle state: listen to the target first.
    const listenBtn = await page.$('#vc-audio-controls [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — il microfono NON deve spegnersi mentre parla il bersaglio (regola 16)
    const recordDisabled = await page.evaluate(() => document.getElementById('vc-record-btn').disabled);
    log('[Job1d-bis] Record stays enabled while target audio plays', recordDisabled === false);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1d-bis] Target audio is actually playing before pressing Record', speakingBefore === true);
    await page.click('#vc-record-btn');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1d-bis] Pressing Record stops the model audio (mic-bleed guard, stop not block)', speakingAfter === false);
    log('[Job1d-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1e: Match Practice — options stay enabled while the prompt plays; answering stops it ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1e', ALL_BEFORE_QM);
    await openModule(page, 'matchEngIta');
    var startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const promptListenBtn = await page.$('#qm-prompt-audio [data-say]');
    if (promptListenBtn) {
      await promptListenBtn.click();
      await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — le opzioni di risposta NON devono spegnersi mentre la domanda parla (regola 16)
      const optionsEnabled = await page.evaluate(() => Array.from(document.querySelectorAll('#qm-options .sr-option')).every(b => !b.disabled));
      log('[Job1e] Answer options stay enabled while the prompt plays', optionsEnabled === true);
      const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
      const anyOption = await page.$('#qm-options .sr-option');
      if (anyOption) { await anyOption.click(); }
      await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
      const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e] Prompt audio really was playing before answering', speakingBefore === true);
      log('[Job1e] Answering stops the prompt audio on touch', speakingAfter === false);
    } else {
      log('[Job1e] Answer options stay enabled while the prompt plays', true);
      log('[Job1e] Prompt audio really was playing before answering', true);
      log('[Job1e] Answering stops the prompt audio on touch', true);
    }
    log('[Job1e] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1e-bis: Match Practice it-en — answering stops an option's own mini-listen audio ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1ebis', ALL_BEFORE_QM.concat(['matchEngIta']));
    await openModule(page, 'matchItaEng');
    var startVisible2 = await page.isVisible('#qm-start-btn').catch(() => false);
    // ⚠️ SI ASPETTA IL PULSANTE, NON 150 ms — passo 1.18, 2026-09-24.
    //
    // Qui c'era `waitForTimeout(150)` e subito dopo `page.$(...)`: se le
    // opzioni non erano ancora disegnate, `miniListenBtn` usciva **null** e il
    // ramo `else` faceva cadere **tutte e due** le asserzioni con un `false`
    // nudo — senza dire che il pulsante non c'era.
    //
    // ⚠️ ED E' ESATTAMENTE LA FIRMA DEL ROSSO DI CI DEL 2026-09-24 (corsa
    // n.291, commit di SOLI DOCUMENTI): le due righe di [Job1e-bis] cadute
    // **insieme**. *Due asserzioni che cadono sempre insieme non sono due
    // misure: sono un ramo che non distingue «la cosa e' rotta» da «non ho
    // trovato il pulsante».* E' la stessa famiglia del vecchio `null` di
    // `attendiDomandaSuccessiva`.
    //
    // L'attesa e' su un effetto che NESSUNA delle due asserzioni legge — il
    // pulsante esiste — quindi non le rende vere per costruzione (regola 44).
    if (startVisible2) {
      await page.click('#qm-start-btn');
      await misura('batch17/1e-bis opzioni-disegnate', function () {
        return page.waitForSelector('#qm-options [data-qm-listen-index]', { timeout: 5000 })
          .catch(function () { return null; });
      });
    }
    const miniListenBtn = await page.$('#qm-options [data-qm-listen-index]');
    if (miniListenBtn) {
      await miniListenBtn.click();
      await misura('batch17/1e-bis mini-ascolto-parte', function () { return attendiCheParla(page); });
      const speakingDuring = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e-bis] Option mini-listen audio is actually playing', speakingDuring === true,
        'speaking=' + speakingDuring);
      const anyOption = await page.$('#qm-options .sr-option:not([disabled])');
      if (anyOption) { await anyOption.click(); }
      await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
      const speakingAfterAnswer = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1e-bis] Answering stops the option\'s own mini-listen audio (bleed guard)',
        speakingAfterAnswer === false, 'speaking=' + speakingAfterAnswer);
    } else {
      // ⚠️ IL RAMO DICE PERCHE'. Prima erano due `false` nudi, indistinguibili
      // dal caso in cui l'audio e' davvero rotto — e sul runner sono caduti
      // proprio cosi', senza lasciare niente da cui ripartire.
      const diag = await page.evaluate(() => ({
        vista: !!document.querySelector('#view-match.is-active'),
        opzioni: document.querySelectorAll('#qm-options .sr-option').length,
        miniAscolti: document.querySelectorAll('#qm-options [data-qm-listen-index]').length,
        startVisibile: !document.getElementById('qm-start-btn').hidden
      })).catch(function () { return null; });
      const perche = 'nessun pulsante di mini-ascolto — ' + JSON.stringify(diag);
      log('[Job1e-bis] Option mini-listen audio is actually playing', false, perche);
      log('[Job1e-bis] Answering stops the option\'s own mini-listen audio (bleed guard)', false, perche);
    }
    log('[Job1e-bis] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1f: Flash Card — choice buttons stay enabled during card audio; they stop it on touch; flip still stops audio too ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job1f', stepsBefore('flashcardAEngIta'));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(200);
    // en-it: the listen button lives on the FRONT (English side).
    const listenBtn = await page.$('#fc-card [data-say]');
    if (listenBtn) { await listenBtn.click({ force: true }); }
    await page.waitForTimeout(100); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — i pulsanti di Flash Card NON devono spegnersi durante l'audio della carta (regola 16)
    const stateDuring = await page.evaluate(() => ({
      watch: document.getElementById('flashcard-watch-btn').disabled,
      choiceBtns: Array.from(document.querySelectorAll('#fc-choice-row button')).map(b => b.disabled)
    }));
    log('[Job1f] Spiegazione stays enabled while the card\'s own audio plays', stateDuring.watch === false);
    log('[Job1f] "Sì la so"/"Non ancora" stay enabled while the card\'s own audio plays', stateDuring.choiceBtns.every(d => d === false));
    // Flip the card while the FRONT audio (still playing from the click
    // above, fake synth runs 500ms) is going -> must stop it (established
    // rule, verify it still works). Re-clicking the same listen button
    // here would just toggle it OFF (toggleSpeak's own same-button "tap
    // to stop") instead of leaving it playing to test the flip against.
    const speakingBeforeFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    await page.click('#fc-card');
    await page.waitForTimeout(50); // ATTESA-LEGITTIMA: l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile)
    const speakingAfterFlip = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1f] Audio was actually playing before the flip', speakingBeforeFlip === true);
    log('[Job1f] Flipping the card stops its own audio (Regola Azione Critica, still correct)', speakingAfterFlip === false);
    // Listen button must work again right after (not stuck from a lingering
    // "speaking" class). .fc-card-inner's own 3D flip is a 500ms CSS
    // transition (see .fc-card-inner) — a coordinate-based click straight
    // after triggering it can land mid-rotation, so drive it via a real
    // DOM .click() (unaffected by the element's current transform) rather
    // than racing the animation.
    await page.evaluate(() => document.getElementById('fc-card').click()); // flip back to front
    await page.waitForTimeout(550);
    const listenBtn3 = await page.$('#fc-card [data-say]');
    if (listenBtn3) { await page.evaluate(() => document.querySelector('#fc-card [data-say]').click()); }
    await attendiCheParla(page);
    const speakingAgain = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1f] Listen button works again right after a flip (no stuck "speaking" state)', speakingAgain === true);
    log('[Job1f] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2: Header on Schermata Finale — Help stays right, not center, when Spiegazione is hidden ============
  {
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T17Job2', stepsBefore('flashcardAEngIta'));
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(200);
    // Force through to the summary screen quickly (answer every card). Il
    // limite viene dal mazzo vero (un giro di risposte piu' l'eventuale
    // ripasso, piu' margine): scritto a mano era tarato su 15 carte e si e'
    // rotto in silenzio quando il grado A e' passato a 21.
    const carte = loadGrade(gradeOf('flashcardAEngIta')).length;
    for (let i = 0; i < carte * 3 + 10; i++) {
      const summaryVisible = await page.isVisible('#fc-summary-screen').catch(() => false);
      if (summaryVisible) break;
      const retryVisible = await page.isVisible('#fc-retry-intro-screen').catch(() => false);
      if (retryVisible) { await page.click('#fc-retry-continue-btn', { timeout: 1000 }).catch(() => {}); await page.waitForTimeout(150); continue; }
      const cardVisible = await page.isVisible('#fc-card-screen').catch(() => false);
      if (!cardVisible) { await page.waitForTimeout(150); continue; }
      await page.click('#fc-card', { timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(100);
      const knowBtn = await page.$('#fc-know-it-btn:not([disabled])');
      if (knowBtn) { await knowBtn.click({ timeout: 1000 }).catch(() => {}); }
      await page.waitForTimeout(150);
    }
    const onSummary = await attendiVisibile(page, '#fc-summary-screen');
    log('[Job2] Reached the Schermata Finale', onSummary);
    const spiegazioneHidden = await page.evaluate(() => document.getElementById('flashcard-watch-btn').hidden);
    log('[Job2] Spiegazione is hidden on the Schermata Finale (rule 10)', spiegazioneHidden === true);
    const rects = await page.evaluate(() => {
      var row = document.querySelector('#view-flashcard .header-actions-row');
      var mappa = document.getElementById('flashcard-back-map').getBoundingClientRect();
      var help = document.getElementById('flashcard-help-btn').getBoundingClientRect();
      var rowRect = row.getBoundingClientRect();
      return { rowLeft: rowRect.left, rowRight: rowRect.right, mappaLeft: mappa.left, helpLeft: help.left, helpRight: help.right };
    });
    log('[Job2] "← Mappa" still at the row\'s left edge', Math.abs(rects.mappaLeft - rects.rowLeft) < 2);
    log('[Job2] "Help" still at the row\'s right edge (not pulled to center)', Math.abs(rects.helpRight - rects.rowRight) < 2);
    log('[Job2] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH17 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
