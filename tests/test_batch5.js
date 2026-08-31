const { launchBrowser, APP_URL } = require('./test-env');
const { allSteps } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__speakLog = [];
  const fakeSynth = {
    speaking: false,
    _current: null,
    speak(utter) {
      this.speaking = true;
      this._current = utter;
      window.__speakLog.push(utter.text);
      if (utter.onstart) utter.onstart();
      // simulate a natural finish after a delay
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 400);
    },
    cancel() {
      if (this._current) {
        var u = this._current;
        this.speaking = false;
        this._current = null;
        clearTimeout(u._timer);
        // simulate async interruption firing onerror on a later task (macrotask)
        setTimeout(() => { if (u.onerror) u.onerror(); }, 30);
      }
    },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() { setTimeout(() => { if (this.onresult) this.onresult({ results: [] }); }, 5); }
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

async function bootAsUser(page, userName, completedModules, extraStorage) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules, extraStorage }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio','personalizzazione','repeatAloud','meetTheStory', 'whyWeSayIt','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
    if (extraStorage) Object.keys(extraStorage).forEach(k => localStorage.setItem(k, extraStorage[k]));
  }, { userName, completedModules, extraStorage });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const ALL_MODULES = allSteps();

  // ============ JOB 1: audio stops when leaving Dialogo Continuo mid-sequence ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoContinuo');
    await bootAsUser(page, 'T5Audio', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoContinuo');
    // dismiss start screen if shown, start exercise
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(50); }
    // Dopo il 3-2-1 parte subito l'audio della prima battuta. Prima qui si
    // aspettavano 2650 ms calcolati a mano (countdownPre * countdownStepMs +
    // un margine) sperando di cadere dentro la finestra di riproduzione
    // simulata, lunga 400 ms: su una macchina più lenta la finestra si
    // perdeva e il test falliva. Ora si aspetta la condizione vera
    // (CLAUDE.md regola 19).
    await page.waitForFunction(() => window.speechSynthesis.speaking === true, null, { timeout: 20000 }).catch(() => {});

    // Uscita dal modulo a metà battuta. Click e letture stanno in un'unica
    // chiamata sincrona: JS è a thread singolo, quindi l'onend simulato non
    // può scattare mentre questa funzione gira, e i tre valori descrivono
    // davvero lo stesso istante invece di tre round-trip separati (stessa
    // correzione già applicata a test_batch15.js Job8).
    const leaving = await page.evaluate(() => {
      var speakingBefore = window.speechSynthesis.speaking;
      var logLenBefore = window.__speakLog.length;
      document.getElementById('dialogo-back-map').click();
      return { speakingBefore: speakingBefore, logLenBefore: logLenBefore, stillSpeaking: window.speechSynthesis.speaking };
    });
    const speakingBefore = leaving.speakingBefore;
    const logLenBefore = leaving.logLenBefore;
    const stillSpeaking = leaving.stillSpeaking;
    log('[Job1] Dialogo Continuo is actively speaking a line', speakingBefore);
    log('[Job1] speechSynthesis is NOT speaking right after leaving the module', !stillSpeaking);

    // Questa resta un'attesa a tempo di proposito: l'asserzione che segue è
    // negativa (nessuna NUOVA battuta accodata), e per un evento che non deve
    // accadere non esiste una condizione da aspettare — si lascia una
    // finestra e si verifica che sia rimasta vuota. Se la macchina è lenta il
    // rischio è un verde generoso, non un rosso casuale.
    await page.waitForTimeout(600);
    const logLenAfter = await page.evaluate(() => window.__speakLog.length);
    log('[Job1] No NEW utterance was queued after leaving (sequence did not continue)', logLenAfter === logLenBefore);
    log('[Job1] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1: opening a new module does not have residual audio from previous ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoRipetiATempo');
    await bootAsUser(page, 'T5Audio2', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    await page.click('.dg-bubble'); // Ripeti a Tempo is advance:'manual' — no auto-play, must tap
    await page.waitForTimeout(200); // mid line-1 audio
    const speaking = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] Ripeti a Tempo is speaking line 1', speaking);
    await page.click('#dialogo-back-map');
    await page.waitForTimeout(150);
    // open a totally different module (repeatAloud) and confirm no residual speak calls arrive
    const logLenAtSwitch = await page.evaluate(() => window.__speakLog.length);
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(600);
    const logLenAfterSwitch = await page.evaluate(() => window.__speakLog.length);
    log('[Job1b] No further utterance queued after switching to a different module', logLenAfterSwitch === logLenAtSwitch);
    log('[Job1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 5: Spiegazione + Help present and gated in Ripeti a Tempo / Dialogo Continuo ============
  for (const modId of ['dialogoRipetiATempo', 'dialogoContinuo']) {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf(modId);
    await bootAsUser(page, 'T5Header_' + modId, ALL_MODULES.slice(0, idx));
    await openModule(page, modId);
    const watchVisible = await page.isVisible('#dialogo-watch-btn').catch(() => false);
    const helpVisible = await page.isVisible('#dialogo-help-btn').catch(() => false);
    log('[Job5] ' + modId + ': Spiegazione button visible in header (start screen)', watchVisible);
    log('[Job5] ' + modId + ': Help button visible in header (start screen)', helpVisible);

    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    // For continuo: mid ready-countdown, both should be disabled (locked)
    if (modId === 'dialogoContinuo') {
      const watchDisabledDuringCountdown = await page.$eval('#dialogo-watch-btn', el => el.disabled);
      const helpDisabledDuringCountdown = await page.$eval('#dialogo-help-btn', el => el.disabled);
      log('[Job5] dialogoContinuo: Spiegazione disabled during the 3-2-1 ready countdown', watchDisabledDuringCountdown);
      log('[Job5] dialogoContinuo: Help disabled during the 3-2-1 ready countdown', helpDisabledDuringCountdown);
      await page.waitForTimeout(2650); // past the 3-2-1, line 1 now auto-playing
    } else {
      await page.click('.dg-bubble'); // Ripeti a Tempo: advance:'manual', must tap to start
      await page.waitForTimeout(100);
    }
    const watchDisabledDuringAudio = await page.$eval('#dialogo-watch-btn', el => el.disabled).catch(() => null);
    const helpDisabledDuringAudio = await page.$eval('#dialogo-help-btn', el => el.disabled).catch(() => null);
    log('[Job5] ' + modId + ': Spiegazione disabled while a line plays (Regola Azione Critica)', watchDisabledDuringAudio === true);
    log('[Job5] ' + modId + ': Help disabled while a line plays (Regola Azione Critica)', helpDisabledDuringAudio === true);

    log('[Job5] ' + modId + ': No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 5: Spiegazione hides on summary, Help stays (rule 10) ============
  // Uses Ascolta e Ripeti (countdown:false, advance:'free') since it's the
  // fastest path to a real Schermata Finale — also a regression check that
  // simplifying dgShowScreen's hidden logic (job 5) kept this profile's
  // own pre-existing summary behavior intact.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T5Summary', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(500); // audio (400ms mock) + onEnd unlock
    }
    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(150);
    const watchHiddenOnSummary = await page.isHidden('#dialogo-watch-btn').catch(() => null);
    const helpVisibleOnSummary = await page.isVisible('#dialogo-help-btn').catch(() => null);
    log('[Job5] dialogoAscoltaRipeti: Spiegazione hidden on Schermata Finale (rule 10)', watchHiddenOnSummary === true);
    log('[Job5] dialogoAscoltaRipeti: Help still visible on Schermata Finale', helpVisibleOnSummary === true);
    log('[Job5] dialogoAscoltaRipeti summary: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH5 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
