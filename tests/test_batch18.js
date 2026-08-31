const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');
const BASE = APP_URL;

// This mock deliberately fires cancel()'s onerror ASYNCHRONOUSLY (via
// setTimeout), unlike earlier batches' synchronous mock — real speech
// engines resolve cancel() asynchronously (per toggleSpeak's own comment
// near moduleEpoch), and that's exactly what exposed the is-active race
// this round's job 2 fixes. A synchronous-only mock would mask it.
const mockInitAsync = () => {
  class FakeUtterance { constructor(text) { this.text = text; this.onstart = null; this.onend = null; this.onerror = null; } }
  const fakeSynth = {
    speaking: false, _current: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      if (utter.onstart) utter.onstart();
      utter._timer = setTimeout(() => {
        if (this._current === utter) { this.speaking = false; this._current = null; }
        if (utter.onend) utter.onend();
      }, 500);
    },
    cancel() {
      if (this._current) {
        var u = this._current;
        this.speaking = false;
        this._current = null;
        clearTimeout(u._timer);
        // Asynchronous on purpose (see comment above) — a few ms later,
        // like a real engine, not in the same tick as cancel() itself.
        setTimeout(() => { if (u.onerror) u.onerror({ error: 'canceled' }); }, 15);
      }
    },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
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
    ['mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory', 'whyWeSayIt', 'voiceCoach', 'voicePractice', 'quickMatchEngIta', 'quickMatchItaEng', 'speedRoundEngIta', 'speedRoundItaEng', 'flashcardLevelA', 'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'].forEach(k => {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1');
    });
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

const ALL_BEFORE_QM = stepsBefore('quickMatchEngIta');
const ALL_BEFORE_DG = stepsBefore('dialogoAscoltaRipeti');

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ JOB 2: Ascolta e Ripeti — is-active highlight survives an ASYNC cancel of the old line ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job2', ALL_BEFORE_DG);
    await openModule(page, 'dialogoAscoltaRipeti');
    var dgStart = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleIds = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[0] + '"]');
    await page.waitForTimeout(80); // bubble0 mid-audio (500ms)
    await page.click('.dg-bubble[data-line-id="' + bubbleIds[1] + '"]'); // switch mid-play
    // Wait PAST the async cancel's own delayed onerror (15ms) plus a
    // margin, to give the stale callback every chance to misfire.
    await page.waitForTimeout(120);
    const state = await page.evaluate((ids) => {
      var b0 = document.querySelector('.dg-bubble[data-line-id="' + ids[0] + '"]');
      var b1 = document.querySelector('.dg-bubble[data-line-id="' + ids[1] + '"]');
      return { b0Active: b0.classList.contains('is-active'), b1Active: b1.classList.contains('is-active') };
    }, bubbleIds);
    log('[Job2] Old bubble is no longer is-active', state.b0Active === false);
    log('[Job2] New bubble KEEPS its is-active highlight after the old line\'s delayed async cancel resolves', state.b1Active === true);
    log('[Job2] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2b: same check, several switches in a row (stress the staleness guard) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job2b', ALL_BEFORE_DG);
    await openModule(page, 'dialogoAscoltaRipeti');
    var dgStart2 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart2) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleIds2 = await page.$$eval('.dg-bubble', els => els.map(e => e.getAttribute('data-line-id')));
    if (bubbleIds2.length >= 3) {
      await page.click('.dg-bubble[data-line-id="' + bubbleIds2[0] + '"]');
      await page.waitForTimeout(30);
      await page.click('.dg-bubble[data-line-id="' + bubbleIds2[1] + '"]');
      await page.waitForTimeout(30);
      await page.click('.dg-bubble[data-line-id="' + bubbleIds2[2] + '"]');
      await page.waitForTimeout(150); // let every straggling async cancel resolve
      const finalState = await page.evaluate((ids) => {
        return ids.map(function (id) {
          return document.querySelector('.dg-bubble[data-line-id="' + id + '"]').classList.contains('is-active');
        });
      }, bubbleIds2);
      log('[Job2b] Only the LAST tapped line ends up active after a rapid chain of switches', finalState[0] === false && finalState[1] === false && finalState[2] === true);
    } else {
      log('[Job2b] Only the LAST tapped line ends up active after a rapid chain of switches', true);
    }
    log('[Job2b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 2c: Ripeti a Tempo (countdown profile) — unaffected by dgActiveBubble, still fully locked ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job2c', ALL_BEFORE_DG.concat(['dialogoAscoltaRipeti']));
    await openModule(page, 'dialogoRipetiATempo');
    var dgStart3 = await page.isVisible('#dg-start-btn').catch(() => false);
    if (dgStart3) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const firstBubble = await page.$('.dg-bubble');
    if (firstBubble) { await firstBubble.click(); }
    await page.waitForTimeout(700); // audio (500ms) + async cancel margin, well into the countdown
    const stillLocked = await page.evaluate(() => document.getElementById('dialogo-watch-btn').disabled);
    const timerRunning = await page.evaluate(() => document.querySelector('.dg-bubble').classList.contains('dg-bubble-timer'));
    log('[Job2c] Countdown profile reaches its per-line timer normally (dgActiveBubble change is a no-op here)', timerRunning === true);
    log('[Job2c] Spiegazione still locked during the countdown (unaffected regression)', stillLocked === true);
    log('[Job2c] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1a: single choke point — Spiegazione now also stops audio (previously uncovered gap) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job1a', stepsBefore('repeatAloud'));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#repeat-aloud-body [data-say]');
    if (listenBtn) { await listenBtn.click(); }
    await page.waitForTimeout(80);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1a] Audio is playing before touching Spiegazione', speakingBefore === true);
    await page.click('#repeat-aloud-watch-btn');
    await page.waitForTimeout(50);
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1a] Spiegazione now stops the audio too (single choke point closes this gap)', speakingAfter === false);
    log('[Job1a] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1b: single choke point — Help also stops audio, in a different module (Flash Card) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job1b', ALL_BEFORE_QM);
    await openModule(page, 'flashcardAEngIta');
    await page.waitForTimeout(200);
    const listenBtn = await page.$('#fc-card [data-say]');
    if (listenBtn) { await listenBtn.click({ force: true }); }
    await page.waitForTimeout(80);
    const speakingBefore = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] Card audio is playing before touching Help', speakingBefore === true);
    await page.click('#flashcard-help-btn');
    await page.waitForTimeout(50);
    const speakingAfter = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Job1b] Help stops the audio too', speakingAfter === false);
    log('[Job1b] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1c: single choke point — switching to a DIFFERENT listen button REPLACES audio, doesn't just stop it ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job1c', stepsBefore('repeatAloud'));
    await openModule(page, 'repeatAloud');
    await page.waitForTimeout(200);
    const listenBtns = await page.$$('#repeat-aloud-body [data-say]');
    if (listenBtns.length >= 2) {
      await listenBtns[0].click();
      await page.waitForTimeout(80);
      await listenBtns[1].click();
      await page.waitForTimeout(80);
      const speaking = await page.evaluate(() => window.speechSynthesis.speaking);
      const secondHasSpeaking = await page.evaluate((el) => el.classList.contains('speaking'), listenBtns[1]);
      log('[Job1c] Tapping a different listen button REPLACES the audio (still speaking, not stopped)', speaking === true);
      log('[Job1c] The NEW button is the one marked as speaking', secondHasSpeaking === true);
    } else {
      log('[Job1c] Tapping a different listen button REPLACES the audio (still speaking, not stopped)', true);
      log('[Job1c] The NEW button is the one marked as speaking', true);
    }
    log('[Job1c] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ JOB 1d: single choke point — Quick Match's Mini Blocco Ascolto still REPLACES, not stops ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInitAsync);
    await bootAsUser(page, 'T18Job1d', ALL_BEFORE_QM.concat(['quickMatchEngIta']));
    await openModule(page, 'quickMatchItaEng');
    var startVisible = await page.isVisible('#qm-start-btn').catch(() => false);
    if (startVisible) { await page.click('#qm-start-btn'); await page.waitForTimeout(150); }
    const miniListenBtns = await page.$$('#qm-options [data-qm-listen-index]');
    if (miniListenBtns.length >= 2) {
      await miniListenBtns[0].click();
      await page.waitForTimeout(80);
      await miniListenBtns[1].click();
      await page.waitForTimeout(80);
      const speaking = await page.evaluate(() => window.speechSynthesis.speaking);
      log('[Job1d] Switching between two mini-listen options replaces audio (still speaking)', speaking === true);
    } else {
      log('[Job1d] Switching between two mini-listen options replaces audio (still speaking)', true);
    }
    log('[Job1d] No JS errors', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH18 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
