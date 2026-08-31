const { launchBrowser, APP_URL } = require('./test-env');
const { declareAllSkills } = require('./story-driver');
const { allSteps } = require('./module-order');
const BASE = APP_URL;

const mockInit = () => {
  window.__consoleWarnings = [];
  const origWarn = console.warn.bind(console);
  console.warn = function () { window.__consoleWarnings.push(Array.from(arguments).join(' ')); origWarn.apply(console, arguments); };

  class FakeUtterance { constructor(text) { this.text = text; this.onstart=null; this.onend=null; this.onerror=null; } }
  window.__toneLog = [];
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) { this.speaking=true; this._current=utter; if(utter.onstart) utter.onstart(); utter._timer=setTimeout(()=>{ if(this._current===utter){this.speaking=false;this._current=null;} if(utter.onend) utter.onend(); },20); },
    cancel() { if(this._current){var u=this._current;this.speaking=false;this._current=null;clearTimeout(u._timer);} },
    pause(){}, resume(){}, getVoices(){return [{name:'Fake Male Voice',lang:'en-US'}];}, onvoiceschanged:null
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

  // Capture Web Audio tones (srPlayTone) so we can detect Traguardo (1046/1318/1568 sequence)
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
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    if (completedModules) localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio','personalizzazione','repeatAloud','meetTheStory', 'whyWeSayIt','voiceCoach','voicePractice','quickMatchEngIta','quickMatchItaEng','speedRoundEngIta','speedRoundItaEng','flashcardLevelA','dialogoAscoltaRipeti','dialogoRipetiATempo','dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
    // Repeat Aloud alone uses its own separate localStorage key
    // (baseinglese:repeatAloudIntroDismissed:*), not the generic
    // introDismissed:<kind>:* pattern every other module uses.
    localStorage.setItem('baseinglese:repeatAloudIntroDismissed:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_MODULES = allSteps();

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 1 (maintenance): CONFIG.percentageThresholds moved to neutral location ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const thresholds = await page.evaluate(() => window.APP_CONFIG.percentageThresholds);
    const oldLocation = await page.evaluate(() => window.APP_CONFIG.speedRound.percentageThresholds);
    log('[Job1] CONFIG.percentageThresholds exists at the neutral top-level location', thresholds && thresholds.basso === 1 && thresholds.medio === 50 && thresholds.alto === 80);
    log('[Job1] CONFIG.speedRound.percentageThresholds no longer exists (moved, not duplicated)', oldLocation === undefined);
    await page.close();
  }

  // ============ JOB 2b: dialogue placeholders now match slotFields keys 1:1 ============
  // dialoguePlaceholderMap lives in the closured EPISODES var, not exposed
  // on window — verify observable behavior instead: the data file has no
  // old-style tokens left, and a rendered dialogue line has no literal
  // "{{" left unresolved (which is exactly what an identity-map mismatch
  // would produce).
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const episodeData = await page.evaluate(() => fetch('data/a1-episodio1-inglese.json').then(r => r.json()));
    const text = JSON.stringify(episodeData);
    const hasOldPlaceholders = /\{\{(papaName|mammaName|figliaName|figlioName|cittaPartenza)\}\}/.test(text);
    log('[Job2b] No old-style placeholder tokens remain in the episode data file', !hasOldPlaceholders);
    const hasNewPlaceholders = /\{\{(papa|mamma|figliaNome|figlioNome|partenza)\}\}/.test(text);
    log('[Job2b] New identity-named placeholder tokens are present instead', hasNewPlaceholders);
    await page.close();
  }

  // ============ JOB 2b: unresolved placeholder logs a console warning ============
  // dialoguePlaceholderMap/fillTemplate are both closured (not reachable
  // from outside) — so force a genuinely unresolved placeholder the
  // realistic way: intercept the episode data fetch and inject a bogus
  // {{nonExistentSlot}} token into one line's text before the app ever
  // sees it, then confirm fillTemplate's own warning fires for it.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await page.route('**/data/a1-episodio1-inglese.json', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.levels.D.items && json.levels.D.items.length) {
        json.levels.D.items[0].english = json.levels.D.items[0].english + ' {{nonExistentSlot}}';
      }
      await route.fulfill({ response, json });
    });
    const idx = ALL_MODULES.indexOf('whyWeSayIt');
    await bootAsUser(page, 'T10Warn', ALL_MODULES.slice(0, idx));
    await openModule(page, 'whyWeSayIt');
    await page.waitForTimeout(400);
    const warnings = await page.evaluate(() => window.__consoleWarnings || []);
    const hasWarning = warnings.some(w => w.indexOf('nonExistentSlot') !== -1);
    log('[Job2b] Unresolved placeholder logs a console warning naming it', hasWarning);
    console.log('    -> warnings: ' + JSON.stringify(warnings.slice(0, 3)));
    log('[Job2b] Unresolved placeholder is left untouched on screen (not broken/crashed)', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2b: normal operation (no tampering) never warns — proves the rename is complete ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('whyWeSayIt');
    await bootAsUser(page, 'T10NoWarn', ALL_MODULES.slice(0, idx));
    await openModule(page, 'whyWeSayIt');
    await page.waitForTimeout(400);
    const warnings = await page.evaluate(() => window.__consoleWarnings || []);
    log('[Job2b] Speak Easy (real dialogue, untouched) logs ZERO placeholder warnings — rename is consistent everywhere', warnings.length === 0);
    console.log('    -> warnings: ' + JSON.stringify(warnings));
    log('[Job2b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 3: heard/unheard indicator is filled check vs empty circle, always visible ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T10Check', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(150); }

    const checksVisibleBefore = await page.$$eval('.dg-heard-check', els => els.every(el => {
      const cs = getComputedStyle(el);
      return cs.display !== 'none';
    }));
    log('[Job3] All heard-check indicators are visible from the start (not hidden)', checksVisibleBefore);
    const noneHeardYet = await page.$$eval('.dg-heard-check', els => els.every(el => !el.classList.contains('is-heard')));
    log('[Job3] None are "is-heard" before listening to any line', noneHeardYet);

    // Click just the first bubble
    await page.locator('.dg-bubble').first().click();
    await page.waitForTimeout(500);
    const firstIsHeard = await page.$eval('.dg-heard-check', el => el.classList.contains('is-heard'));
    const firstHasCheckIcon = await page.$eval('.dg-heard-check', el => el.innerHTML.indexOf('svg') !== -1);
    const restAreEmpty = await page.$$eval('.dg-heard-check', els => els.slice(1).every(el => !el.classList.contains('is-heard') && getComputedStyle(el).display !== 'none'));
    log('[Job3] First bubble is-heard after listening, with a check icon', firstIsHeard && firstHasCheckIcon);
    log('[Job3] The rest remain visible (empty circle), not is-heard', restAreEmpty);
    log('[Job3] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 4: Repeat Aloud plays Traguardo on completion ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('repeatAloud');
    await bootAsUser(page, 'T10RA', ALL_MODULES.slice(0, idx));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(300);
    await page.click('#repeat-aloud-complete');
    await page.waitForTimeout(400);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job4] Repeat Aloud plays the Traguardo sound on "Ho finito"', traguardoTones.length >= 3);
    log('[Job4] Repeat Aloud: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 4: Speak Easy plays Traguardo on completion ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('whyWeSayIt');
    await bootAsUser(page, 'T10SE', ALL_MODULES.slice(0, idx));
    await openModule(page, 'whyWeSayIt');
    await page.waitForTimeout(300);
    // "Ho finito" e' bloccato finche' ogni skill non e' dichiarata: si
    // attraversa la lezione, come farebbe l'utente.
    await declareAllSkills(page);
    await page.click('#speak-easy-complete');
    await page.waitForTimeout(400);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job4] Speak Easy plays the Traguardo sound on "Ho finito"', traguardoTones.length >= 3);
    log('[Job4] Speak Easy: No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 4: "← Mappa" (leaving mid-exercise) does NOT play Traguardo ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('repeatAloud');
    await bootAsUser(page, 'T10RAMap', ALL_MODULES.slice(0, idx));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(300);
    await page.click('#repeat-aloud-back-map');
    await page.waitForTimeout(400);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job4] Repeat Aloud "← Mappa" (leaving without completing) does NOT play Traguardo', traguardoTones.length === 0);
    log('[Job4] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 4: Voice Coach mic-confirmed-problem exit does NOT play Traguardo ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T10VCMic', ALL_MODULES.slice(0, idx));
    await page.evaluate(() => { window.__vcTranscript = ''; });
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    for (let i = 0; i < 6; i++) {
      // vc-record-btn is a toggle: start, then stop, dispatched directly
      // (the pulsing .is-recording animation hangs a native click).
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(60);
      await page.evaluate(() => document.getElementById('vc-record-btn').click());
      await page.waitForTimeout(300);
      await page.click('#vc-send-btn').catch(() => {});
      await page.waitForTimeout(100);
      const isOpen = await page.evaluate(() => document.getElementById('attempt-popup').classList.contains('is-open'));
      if (isOpen) { await page.click('#attempt-popup-next'); await page.waitForTimeout(80); }
      // Voice Check has no retry button (job 5) — advance via "Avanti" instead.
      if (i < 5) { await page.click('#vc-next-btn').catch(() => {}); await page.waitForTimeout(80); }
    }
    await page.click('#vc-mic-notice-map');
    await page.waitForTimeout(400);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job4] Voice Coach mic-confirmed exit does NOT play Traguardo', traguardoTones.length === 0);
    log('[Job4] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ JOB 4: Dialogo "Non ancora" still does NOT play Traguardo (regression check) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T10DgNo', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(80); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) {
      await page.locator('.dg-bubble').nth(i).click();
      await page.waitForTimeout(400);
    }
    await page.click('#dg-not-yet-btn');
    await page.waitForTimeout(400);
    const tones = await page.evaluate(() => window.__playedTones || []);
    const traguardoTones = tones.filter(t => t.freq === 1046 || t.freq === 1318 || t.freq === 1568);
    log('[Job4] Dialogo "Non ancora" still does NOT play Traguardo', traguardoTones.length === 0);
    log('[Job4] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH10 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
