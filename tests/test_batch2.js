const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore, stepIds } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 20); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;

  // Fake SpeechRecognition for Voice Coach: onresult delivers a fixed
  // transcript, controllable per test via window.__vcTranscript.
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {
      window.__recognitionStarted = (window.__recognitionStarted || 0) + 1;
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

async function bootAsUser(page, userName, completedModules, extraStorage) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules, extraStorage }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:personalizzazione:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:voiceCoach:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:quickMatchEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:speedRoundEngIta:' + userName, '1');
    localStorage.setItem('baseinglese:introDismissed:flashcardLevelA:' + userName, '1');
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
  const ALL_BEFORE_SR = stepsBefore('speedRoundEngIta');

  // ============ TASK 6: Personalizzazione visible in map, first, unlocked ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T6NewUser', []);
    const order = await page.evaluate(() => Array.from(document.querySelectorAll('[data-module]')).map(el => el.getAttribute('data-module')));
    log('[6a] Personalizzazione is the first module in the map', order[0] === 'personalizzazione');
    const firstRowDisabled = await page.$eval('[data-module="personalizzazione"]', el => el.disabled);
    log('[6a] Personalizzazione row is NOT locked/disabled for a new user', !firstRowDisabled);
    const secondRowDisabled = await page.$eval('[data-module="repeatAloud"]', el => el.disabled);
    log('[6a] repeatAloud IS locked until Personalizzazione is completed', secondRowDisabled);
    const typeLabel = await page.$eval('[data-module="personalizzazione"] .module-row-type', el => el.textContent);
    log('[6a][2] Personalizzazione shows a type label ("Inizio")', typeLabel === 'Inizio');

    // Opening it as a brand-new user shows NO warning (nothing started yet).
    await openModule(page, 'personalizzazione');
    const mainVisible = await page.evaluate(() => !document.getElementById('customize-main-screen').hidden);
    const warningVisible = await page.evaluate(() => !document.getElementById('customize-warning-screen').hidden);
    log('[6b] New user opening Personalizzazione: no warning, main screen shown', mainVisible && !warningVisible);

    // Complete it (start-episode) -> back to map, personalizzazione completed, repeatAloud unlocked.
    await page.waitForFunction(() => document.getElementById('slot-grid').children.length > 0);
    await page.click('#start-episode');
    await page.waitForTimeout(150);
    const completed = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'T6NewUser');
    log('[6a] Completing Personalizzazione marks it via markModuleCompleted', completed && completed.indexOf('personalizzazione') !== -1);
    // Il passo che si sblocca è quello SUCCESSIVO nell'ordine, qualunque
    // sia: prenderlo dall'ordine vero invece di nominarlo qui significa che
    // un riordino non rende più bugiarda questa asserzione.
    const nextStep = stepIds()[1];
    const nextNowClickable = await page.$eval('[data-module="' + nextStep + '"]', el => el.disabled);
    log('[6a] Il passo dopo Personalizzazione (' + nextStep + ') si sblocca appena è completata', !nextNowClickable);
    log('[6] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ TASK 6b: mid-episode warning gate ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // Serve del progresso OLTRE Personalizza — è quello che fa comparire
    // l'avviso — quindi i primi due passi, non "quelli prima di Personalizza".
    await bootAsUser(page, 'T6Started', stepIds().slice(0, 2));
    await openModule(page, 'personalizzazione');
    const warningVisible = await page.evaluate(() => !document.getElementById('customize-warning-screen').hidden);
    log('[6b] Riaprire Personalizza con un altro passo già fatto mostra l\'avviso', warningVisible);
    const confirmBtnDisabled = await page.$eval('#customize-warning-confirm-btn', el => el.disabled);
    log('[6b] Confirm button starts disabled', confirmBtnDisabled);
    await page.fill('#customize-warning-confirm-input', 'non è la frase giusta');
    await page.waitForTimeout(30);
    const stillDisabled = await page.$eval('#customize-warning-confirm-btn', el => el.disabled);
    log('[6b] Wrong phrase keeps the confirm button disabled', stillDisabled);
    await page.fill('#customize-warning-confirm-input', 'CANCELLA EPISODIO');
    await page.waitForTimeout(30);
    const nowEnabled = await page.$eval('#customize-warning-confirm-btn', el => !el.disabled);
    log('[6b] Exact phrase (case-insensitive) enables the confirm button', nowEnabled);
    await page.click('#customize-warning-confirm-btn');
    await page.waitForTimeout(100);
    const mainNowVisible = await page.evaluate(() => !document.getElementById('customize-main-screen').hidden);
    log('[6b] Confirming switches to the main edit screen', mainNowVisible);
    const progressAfter = await page.evaluate((u) => localStorage.getItem('baseinglese:modules:episode1:' + u), 'T6Started');
    log('[6b] Confirming wipes moduleProgress from localStorage', progressAfter === null);
    log('[6] No JS errors on warning flow', errors.length === 0);
    await page.close();
  }

  // ============ TASK 6b: cancel button, and "not started" (only personalizzazione done) skips warning ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T6OnlyCustomize', stepsBefore('personalizzazione'));
    await openModule(page, 'personalizzazione');
    const mainVisible = await page.evaluate(() => !document.getElementById('customize-main-screen').hidden);
    log('[6b] Only Personalizzazione done (nothing else started): no warning', mainVisible);
    await page.close();

    const page2 = await browser.newPage({ viewport: { width: 400, height: 900 } });
    page2.on('pageerror', e => errors.push(e.message));
    await page2.addInitScript(mockInit);
    await bootAsUser(page2, 'T6Cancel', stepIds().slice(0, 2));
    await openModule(page2, 'personalizzazione');
    await page2.click('#customize-warning-cancel-btn');
    await page2.waitForTimeout(150);
    const onMap = await page2.evaluate(() => !document.getElementById('view-map').classList.contains('is-active') ? false : true);
    log('[6b] Cancel on the warning screen returns to the map', onMap);
    const progressStillThere = await page2.evaluate((u) => localStorage.getItem('baseinglese:modules:episode1:' + u) !== null, 'T6Cancel');
    log('[6b] Cancel does NOT wipe progress', progressStillThere);
    log('[6] No JS errors', errors.length === 0);
    await page2.close();
  }

  // ============ TASK 6: migration for pre-existing users (old customizeSeen flag) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    // Progresso di un utente vecchio: due passi qualsiasi gia' fatti, presi
    // dall'ordine invece che nominati qui.
    await bootAsUser(page, 'T6Migrate', stepIds().slice(1, 3), {
      'baseinglese:episode1:customizeSeen:T6Migrate': '1'
    });
    const completed = await page.evaluate((u) => JSON.parse(localStorage.getItem('baseinglese:modules:episode1:' + u) || '{}').completed, 'T6Migrate');
    log('[6a] Migration: old customizeSeen user gets personalizzazione auto-completed', completed && completed.indexOf('personalizzazione') !== -1);
    const repeatAloudRow = await page.$eval('[data-module="repeatAloud"]', el => el.className);
    log('[6a] Migration: repeatAloud still shows completed (existing progress untouched)', repeatAloudRow.indexOf('completed') !== -1);
    log('[6] No JS errors on migration', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH2a SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
