const { launchBrowser, APP_URL } = require('./test-env');
const { allSteps } = require('./module-order');
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
  const EXPECTED = {
    personalizzazione: { name: 'Your Story', subtitle: 'Personalizza la tua storia' },
    repeatAloud: { name: 'Repeat Aloud', subtitle: 'Ripeti ad alta voce' },
    meetTheStory: { name: 'Meet the Story', subtitle: 'Ascolta la storia' },
    whyWeSayIt: { name: 'Why We Say It', subtitle: 'Perché si dice così' },
    voicePractice: { name: 'Voice Practice', subtitle: 'Allena la pronuncia' },
    voiceCoach: { name: 'Voice Check', subtitle: 'Metti alla prova la pronuncia' },
    quickMatchEngIta: { name: 'Match Practice en→it', subtitle: 'Abbina le traduzioni' },
    quickMatchItaEng: { name: 'Match Practice it→en', subtitle: 'Abbina le traduzioni' },
    speedRoundEngIta: { name: 'Speed Match en→it', subtitle: 'Traduci a tempo' },
    speedRoundItaEng: { name: 'Speed Match it→en', subtitle: 'Traduci a tempo' },
    flashcardAEngIta: { name: 'Flash Card en→it', subtitle: 'Ripassa quello che hai imparato' },
    flashcardAItaEng: { name: 'Flash Card it→en', subtitle: 'Ripassa quello che hai imparato' },
    dialogoAscoltaRipeti: { name: 'Dialogue: Listen & Repeat', subtitle: 'Ascolta e ripeti' },
    dialogoRipetiATempo: { name: 'Dialogue: Repeat in Time', subtitle: 'Ripeti a tempo' },
    dialogoContinuo: { name: 'Dialogue: Real Dialogue', subtitle: 'Il dialogo vero' }
  };

  // ============ TASK 1: config panel descriptions ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.goto(BASE + '?config=1');
    await page.waitForTimeout(200);
    const configVisible = await page.isVisible('#config-panel-overlay').catch(() => false);
    log('[T1] Config panel opens via ?config=1', configVisible);

    // configFieldDescriptions itself must not render as its own group
    const groupLabels = await page.$$eval('.config-group > summary', els => els.map(e => e.textContent));
    log('[T1] configFieldDescriptions is NOT rendered as its own config-group', !groupLabels.some(l => /configFieldDescriptions/i.test(l)));

    // Open all details so fields are queryable
    await page.$$eval('.config-group', els => els.forEach(el => el.open = true));
    await page.waitForTimeout(50);

    const descCount = await page.$$eval('.config-field-description', els => els.length);
    log('[T1] At least one .config-field-description rendered', descCount > 0);

    const dialogoPausaDesc = await page.$eval('[data-config-path="dialogo.pausaPerParola"]', el => {
      var wrap = el.closest('.config-field');
      var d = wrap && wrap.querySelector('.config-field-description');
      return d ? d.textContent : null;
    }).catch(() => null);
    log('[T1] dialogo.pausaPerParola has a non-technical description', !!dialogoPausaDesc && dialogoPausaDesc.length > 5);
    console.log('    -> "' + dialogoPausaDesc + '"');

    const srTimeDesc = await page.$eval('[data-config-path="speedRound.timeLimitSeconds"]', el => {
      var wrap = el.closest('.config-field');
      var d = wrap && wrap.querySelector('.config-field-description');
      return d ? d.textContent : null;
    }).catch(() => null);
    log('[T1] speedRound.timeLimitSeconds has a description', !!srTimeDesc);
    console.log('    -> "' + srTimeDesc + '"');

    // A field with no description entry should render with NO gap/placeholder line
    const noDescField = await page.$$eval('[data-config-path]', els => {
      var paths = els.map(e => e.getAttribute('data-config-path'));
      return paths.filter(p => /^dialogo\.profiles\./.test(p));
    });
    if (noDescField.length) {
      const path0 = noDescField[0];
      const hasDesc = await page.$eval('[data-config-path="' + path0 + '"]', (el) => {
        var wrap = el.closest('.config-field');
        return wrap ? !!wrap.querySelector('.config-field-description') : null;
      }).catch(() => null);
      log('[T1] A dialogo.profiles.* field with no description entry renders no description line (' + path0 + ')', hasDesc === false);
    } else {
      log('[T1] (skipped: no dialogo.profiles.* scalar field found to test)', true);
    }
    log('[T1] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ TASK 2: module map labels ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T4User', []);

    for (const id of ALL_MODULES) {
      // Un modulo puo' comparire piu' volte su gradi diversi: il nome
      // mostrato e' quello del MODULO, quindi si toglie il suffisso che
      // moduleStepId() da' alle apparizioni successive.
      const exp = EXPECTED[id.replace(/-\d+$/, '')];
      const rowText = await page.$eval('[data-module="' + id + '"] .module-row-title', el => el.textContent).catch(() => null);
      log('[T2] map row title for ' + id + ' = "' + exp.name + '"', rowText === exp.name);
      const subText = await page.$eval('[data-module="' + id + '"] .module-row-subtitle', el => el.textContent).catch(() => null);
      log('[T2] map row subtitle for ' + id + ' = "' + exp.subtitle + '"', subText === exp.subtitle);
    }

    // direction span styling check for one en->it module
    const dirSpanText = await page.$eval('[data-module="quickMatchEngIta"] .module-row-title .module-name-direction', el => el.textContent).catch(() => null);
    log('[T2] "en→it" suffix is wrapped in .module-name-direction span', dirSpanText === 'en→it');
    const dirFontSize = await page.$eval('[data-module="quickMatchEngIta"] .module-row-title .module-name-direction', el => getComputedStyle(el).fontSize).catch(() => null);
    const parentFontSize = await page.$eval('[data-module="quickMatchEngIta"] .module-row-title', el => getComputedStyle(el).fontSize).catch(() => null);
    log('[T2] direction suffix renders smaller than parent name (computed font-size)', dirFontSize && parentFontSize && parseFloat(dirFontSize) < parseFloat(parentFontSize));

    // typeLabel for personalizzazione is now "Inizio"
    const typeLabel = await page.$eval('[data-module="personalizzazione"] .module-row-type', el => el.textContent);
    log('[T2] Personalizzazione typeLabel is now "Inizio" (was "Preparazione")', typeLabel === 'Inizio');

    log('[T2] No JS errors on map', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ TASK 2b: module headers/badges ============
  {
    const checks = [
      ['repeatAloud', '#repeat-aloud-title', 'Repeat Aloud'],
      ['meetTheStory', '#speak-easy-title', 'Meet the Story'],
      ['whyWeSayIt', '#speak-easy-title', 'Why We Say It'],
      ['quickMatchEngIta', '#quick-match-badge', 'Match Practice en→it'],
      ['dialogoAscoltaRipeti', '#dialogo-badge', 'Dialogue: Listen & Repeat'],
      ['speedRoundEngIta', '#speed-round-badge', 'Speed Match en→it'],
      ['flashcardAEngIta', '#flashcard-badge', 'Flash Card en→it']
    ];
    for (const [moduleId, selector, expected] of checks) {
      const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(mockInit);
      const idx = ALL_MODULES.indexOf(moduleId);
      const priorModules = ALL_MODULES.slice(0, idx);
      await bootAsUser(page, 'T4_' + moduleId, priorModules);
      await openModule(page, moduleId);
      const text = await page.$eval(selector, el => el.textContent).catch(() => null);
      log('[T2b] ' + moduleId + ' header/badge shows "' + expected + '"', text === expected);
      log('[T2b] ' + moduleId + ' no JS errors', errors.length === 0);
      if (errors.length) console.log(errors);
      await page.close();
    }
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH4 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
