const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');
const { loadGrade, playThroughQuiz } = require('./quiz-driver');
const BASE = APP_URL;

// Le risposte giuste vengono dai dati dell'episodio, non dalla posizione dei
// pulsanti: vedi tests/quiz-driver.js.
const VOCABULARY = loadGrade('A');

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 20); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
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
};

const toneCapture = () => {
  const OrigAC = window.AudioContext || window.webkitAudioContext;
  if (!OrigAC) { window.__noAudioCtx = true; return; }
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
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:voiceCoach:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:quickMatchEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:speedRoundEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:flashcardLevelA:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const BEFORE_VC = stepsBefore('flashcardAEngIta');
const BEFORE_QM = stepsBefore('quickMatchEngIta');
const BEFORE_SR = stepsBefore('speedRoundEngIta');
const BEFORE_FC = stepsBefore('flashcardAEngIta');

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ TASK 1: global moduleOrderDefault + config panel reorder ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T1Reorder', []);
    const episodesOverride = await page.evaluate(() => window.APP_CONFIG.episodes.episode1.moduleOrder);
    log('[1] episode1 declares no own moduleOrder (reads the global default)', episodesOverride === undefined);
    const globalOrder = await page.evaluate(() => window.APP_CONFIG.moduleOrderDefault.slice());
    // Ogni voce è una coppia { module, grade } (CONFIG.moduleOrderDefault):
    // il grado sta lì, non più nel descrittore del modulo.
    log('[1] moduleOrderDefault exists with personalizzazione first', globalOrder[0].module === 'personalizzazione');
    log('[1] Le voci sono coppie modulo+grado', globalOrder.every(p => typeof p.module === 'string') && globalOrder.some(p => typeof p.grade === 'string'));

    // Open the config panel, find the moduleOrderDefault group, move row 1 down.
    await page.click('body');
    for (const ch of 'config') await page.keyboard.press(ch);
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      var groups = Array.from(document.querySelectorAll('#config-panel-body .config-group'));
      var g = groups.find(function (el) { return el.querySelector('summary').textContent === 'moduleOrderDefault'; });
      if (g) g.open = true;
    });
    const rowCount = await page.$$eval('.config-module-order-row', els => els.length);
    log('[1] Config panel shows one reorder row per module', rowCount === globalOrder.length);
    const firstLabel = await page.$eval('.config-module-order-row:nth-child(1) .config-module-order-label', el => el.textContent);
    log('[1] First row label is Personalizza\'s own label', firstLabel === 'Your Story');
    await page.click('.config-module-order-row:nth-child(1) [data-order-move="down"]');
    await page.waitForTimeout(50);
    const newOrder = await page.evaluate(() => window.APP_CONFIG.moduleOrderDefault.slice());
    log('[1] Clicking "down" swaps the first two entries live in APP_CONFIG', newOrder[0].module === globalOrder[1].module && newOrder[1].module === globalOrder[0].module);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}'));
    log('[1] Reorder persists to the config overrides in localStorage', JSON.stringify(stored.moduleOrderDefault) === JSON.stringify(newOrder));

    // Il grado si modifica dalla stessa riga, con un tocco solo: il
    // pulsante con la lettera cicla CONFIG.grades. Compare solo per i
    // moduli che leggono contenuto dall'episodio — Personalizza non ne ha.
    const gradeState = await page.evaluate(() => {
      var rows = Array.from(document.querySelectorAll('.config-module-order-row'));
      var order = window.APP_CONFIG.moduleOrderDefault;
      return rows.map(function (row, i) {
        var btn = row.querySelector('[data-order-grade]');
        return { module: order[i].module, grade: order[i].grade, chip: btn ? btn.textContent.trim() : null };
      });
    });
    const personal = gradeState.find(r => r.module === 'personalizzazione');
    const withGrade = gradeState.filter(r => r.chip !== null);
    log('[1] Personalizza non mostra il pulsante del grado', !!personal && personal.chip === null);
    log('[1] Ogni altra riga mostra il grado della sua coppia', withGrade.length === gradeState.length - 1 && withGrade.every(r => r.chip === r.grade));

    const cycled = await page.evaluate(() => {
      var rows = Array.from(document.querySelectorAll('.config-module-order-row'));
      var i = rows.findIndex(function (row) { return !!row.querySelector('[data-order-grade]'); });
      var before = window.APP_CONFIG.moduleOrderDefault[i].grade;
      rows[i].querySelector('[data-order-grade]').click();
      var after = window.APP_CONFIG.moduleOrderDefault[i].grade;
      var overrides = JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}');
      return {
        index: i,
        before: before,
        after: after,
        expected: window.APP_CONFIG.grades[(window.APP_CONFIG.grades.indexOf(before) + 1) % window.APP_CONFIG.grades.length],
        chip: document.querySelectorAll('.config-module-order-row')[i].querySelector('[data-order-grade]').textContent.trim(),
        stored: overrides.moduleOrderDefault[i].grade
      };
    });
    log('[1] Un tocco sul grado passa al successivo di CONFIG.grades', cycled.after === cycled.expected && cycled.after !== cycled.before);
    log('[1] La riga si aggiorna subito con il nuovo grado', cycled.chip === cycled.after);
    log('[1] Il grado cambiato finisce negli override in localStorage', cycled.stored === cycled.after);

    // L'interruttore acceso/spento: serve a provare varianti dell'episodio
    // senza chiedere modifiche, quindi un passo spento deve SPARIRE dalla
    // mappa, non restare grigio — l'obiettivo è vedere l'episodio come lo
    // vedrà lo studente.
    const spegni = await page.evaluate(() => {
      var righe = Array.from(document.querySelectorAll('.config-module-order-row'));
      var order = window.APP_CONFIG.moduleOrderDefault;
      var prima = order.length;
      righe[1].querySelector('[data-order-onoff]').click();
      var overrides = JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}');
      return {
        prima: prima,
        off: !!window.APP_CONFIG.moduleOrderDefault[1].off,
        restaInLista: document.querySelectorAll('.config-module-order-row').length === prima,
        rigaSegnata: document.querySelectorAll('.config-module-order-row.is-off').length === 1,
        salvato: !!overrides.moduleOrderDefault[1].off
      };
    });
    log('[1] Un tocco spegne il passo', spegni.off === true);
    log('[1] Il passo spento resta nella vista di riordino, segnato', spegni.restaInLista && spegni.rigaSegnata);
    log('[1] Lo stato spento finisce negli override in localStorage', spegni.salvato === true);

    const riacceso = await page.evaluate(() => {
      var righe = Array.from(document.querySelectorAll('.config-module-order-row'));
      righe[1].querySelector('[data-order-onoff]').click();
      var overrides = JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}');
      return { off: !!window.APP_CONFIG.moduleOrderDefault[1].off, salvato: !!overrides.moduleOrderDefault[1].off };
    });
    log('[1] Un secondo tocco lo riaccende', riacceso.off === false && riacceso.salvato === false);

    log('[1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ TASK 1b: un passo spento sparisce davvero dalla mappa ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // Niente addInitScript per gli override qui: rigirerebbe anche al
    // reload, azzerandoli prima che il boot li legga. L'override si scrive
    // a pagina caricata e poi si ricarica — episode.modules si calcola una
    // volta sola, al caricamento dello script.
    await bootAsUser(page, 'T1Off', []);
    const conteggi = await page.evaluate(() => {
      var order = window.APP_CONFIG.moduleOrderDefault.map(function (p) {
        return p.module === 'repeatAloud' ? Object.assign({}, p, { off: true }) : p;
      });
      var overrides = JSON.parse(localStorage.getItem('baseinglese:configOverrides') || '{}');
      overrides.moduleOrderDefault = order;
      localStorage.setItem('baseinglese:configOverrides', JSON.stringify(overrides));
      return {
        totale: window.APP_CONFIG.moduleOrderDefault.length,
        spenti: order.filter(function (p) { return p.off; }).length
      };
    });
    // Ricaricare riporta alla home: la mappa si riapre come farebbe l'utente.
    await page.reload();
    await page.waitForSelector('#go-episode', { timeout: 20000 });
    await page.click('#go-episode');
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0, null, { timeout: 20000 });
    const inMappa = await page.evaluate(() => Array.from(document.querySelectorAll('[data-module]')).map(el => el.getAttribute('data-module')));
    log('[1b] I passi spenti spariscono dalla mappa', inMappa.length === conteggi.totale - conteggi.spenti);
    log('[1b] Nessuna riga grigia rimasta: il modulo spento non c\'è proprio', inMappa.every(id => id.indexOf('repeatAloud') !== 0));
    log('[1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ TASK 3: Quick Match / Speed Round / Flash Card now play Traguardo on completion ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T3QMSound', BEFORE_QM);
    await page.evaluate(toneCapture);
    await openModule(page, 'quickMatchEngIta');
    await page.waitForTimeout(300);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(150);
    // Ogni risposta corretta, fino alla Schermata Finale. È quello che il
    // commento diceva da sempre ("reading the right option"), ma il codice
    // cliccava data-qm-index="0" senza leggere niente: essendo le opzioni
    // mescolate era quella giusta solo una volta su quattro.
    await playThroughQuiz(page, 'qm', {
      vocabulary: VOCABULARY,
      answerFor: function () { return 'correct'; }
    });
    await page.waitForFunction(() => document.getElementById('qm-summary-screen') && !document.getElementById('qm-summary-screen').hidden, { timeout: 5000 });
    // Le tre note del Traguardo sono sfasate da setTimeout: si aspetta che
    // siano state suonate davvero, invece di dare loro 600 ms a occhio
    // (CLAUDE.md regola 19). Il catch lascia comunque fallire l'asserzione
    // qui sotto, invece di far esplodere l'intero file, se non arrivano.
    await page.waitForFunction(() => {
      var t = window.__playedTones || [];
      return t.filter(x => x.freq === 1046 || x.freq === 1318 || x.freq === 1568).length >= 3;
    }, null, { timeout: 20000 }).catch(() => {});
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[3] Quick Match completion now plays the Traguardo sound (3 ascending notes)', traguardoTones.length >= 3);
    const retryIntroHtmlHasClass = await page.evaluate(() => {
      // Even if never shown, verify the shared component actually generated .retry-intro markup.
      return document.getElementById('qm-retry-intro-screen').innerHTML.indexOf('retry-intro') !== -1;
    });
    log('[3] Quick Match retry-intro screen markup comes from the shared renderRetryIntroScreen (.retry-intro class present)', retryIntroHtmlHasClass);
    log('[3] No JS errors on Quick Match completion', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH2b SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
