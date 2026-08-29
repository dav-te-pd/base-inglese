const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:8891/index.html';

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 30); },
    cancel() {}, getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) {
    // boot() skips straight to Home if a user is already set (from a
    // previous bootAsUser call on this same page) — go through "Cambia
    // utente" to reach the name form again.
    await page.click('#switch-user');
    await page.waitForTimeout(100);
  }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:episode1:customizeSeen:' + userName, '1');
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

async function openModuleFromMap(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

async function run() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Map order + Speak Easy regression ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'OrderTester', []);

    const rowIds = await page.$$eval('#module-list [data-module]', els => els.map(e => e.getAttribute('data-module')));
    const qmIIdx = rowIds.indexOf('quickMatchItaEng');
    const dgIdx = rowIds.indexOf('dialogoAscoltaRipeti');
    const srIdx = rowIds.indexOf('speedRoundEngIta');
    log('dialogoAscoltaRipeti sits after quickMatchItaEng and before speedRoundEngIta', qmIIdx > -1 && qmIIdx < dgIdx && dgIdx < srIdx);

    // Speak Easy regression: alignment must be identical to before (guide/esterno left, family right).
    await bootAsUser(page, 'SpeakEasyTester', ['repeatAloud']);
    await openModuleFromMap(page, 'speakEasy');
    await page.waitForTimeout(300);
    const introVisible = await page.isVisible('#speak-easy-intro-screen');
    if (introVisible) { await page.click('#speak-easy-intro-start-btn').catch(() => {}); await page.waitForTimeout(150); }
    const rowAligns = await page.$$eval('.chat-row', els => els.map(e => e.classList.contains('left') ? 'left' : 'right'));
    log('Speak Easy still renders 7 chat rows', rowAligns.length === 7);
    log('Speak Easy alignment unchanged: guide(esterno)=left, family=right', JSON.stringify(rowAligns) === JSON.stringify(['left', 'right', 'left', 'right', 'right', 'right', 'left']));
    log('No JS errors on Speak Easy/order check', errors.length === 0);
    await page.close();
  }

  // ============ Regression: Voice Coach confirm box + Flash Card choice box look/behave unchanged ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'VCRegression', ['repeatAloud', 'speakEasy']);
    await openModuleFromMap(page, 'voiceCoach');
    await page.waitForTimeout(300);
    const vcIntro = await page.isVisible('#voice-coach-intro-screen');
    if (vcIntro) { await page.click('#voice-coach-intro-start-btn').catch(() => {}); await page.waitForTimeout(150); }
    // vc-confirm-box markup: text + Cancella (with x icon) + Invia (with check icon).
    const vcConfirmHtml = await page.evaluate(() => document.getElementById('vc-confirm-box').innerHTML);
    log('Voice Coach vc-confirm-box has confirm text', vcConfirmHtml.includes('Sicuro? Invia per la valutazione'));
    log('Voice Coach vc-confirm-box Cancella button present with id', vcConfirmHtml.includes('id="vc-cancel-btn"') && vcConfirmHtml.includes('Cancella'));
    log('Voice Coach vc-confirm-box Invia button present with id', vcConfirmHtml.includes('id="vc-send-btn"') && vcConfirmHtml.includes('Invia'));
    log('Voice Coach vc-cancel-btn still has its icon (svg)', /id="vc-cancel-btn"[^<]*<svg/.test(vcConfirmHtml));
    const vcBoxClass = await page.getAttribute('#vc-confirm-box', 'class');
    log('Voice Coach vc-confirm-box keeps its own tinted-callout CSS class', vcBoxClass === 'vc-confirm-box');
    await page.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'FCRegression', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng', 'dialogoAscoltaRipeti', 'speedRoundEngIta', 'speedRoundItaEng']);
    await openModuleFromMap(page, 'flashcardAEngIta');
    await page.waitForTimeout(300);
    const fcIntro = await page.isVisible('#fc-intro-screen');
    if (fcIntro) { await page.click('#fc-intro-start-btn'); await page.waitForTimeout(200); }
    const fcChoiceHtml = await page.evaluate(() => document.getElementById('fc-choice-row').innerHTML);
    log('Flash Card fc-choice-row has "L\'hai imparata?" question', fcChoiceHtml.includes('hai imparata?'));
    log('Flash Card fc-not-yet-btn/fc-know-it-btn present with correct labels', fcChoiceHtml.includes('id="fc-not-yet-btn"') && fcChoiceHtml.includes('Non ancora') && fcChoiceHtml.includes('id="fc-know-it-btn"') && fcChoiceHtml.includes('la so!'));
    const fcRowClass = await page.getAttribute('#fc-choice-row', 'class');
    log('Flash Card fc-choice-row keeps its own plain-padded CSS class', fcRowClass === 'panel fc-choice-row');
    // Still functions: flip + choose auto-advances (from prior session's feature).
    const counterBefore = await page.textContent('#fc-counter');
    await page.click('#fc-card');
    await page.waitForTimeout(150);
    await page.click('#fc-know-it-btn');
    await page.waitForTimeout(500);
    const counterAfter = await page.textContent('#fc-counter');
    log('Flash Card auto-advance still works after choice-box extraction', counterBefore !== counterAfter);
    log('No JS errors on Flash Card regression', errors.length === 0);
    await page.close();
  }
  // Speed Round / Quick Match summary screens still work.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SRQMRegression', ['repeatAloud', 'speakEasy', 'voiceCoach']);
    await openModuleFromMap(page, 'quickMatchEngIta');
    await page.waitForTimeout(300);
    await page.waitForFunction(() => document.getElementById('qm-start-btn') && !document.getElementById('qm-start-btn').disabled);
    await page.click('#qm-start-btn');
    await page.waitForTimeout(200);
    let iterations = 0;
    while (iterations++ < 150) {
      if (await page.isVisible('#qm-summary-screen')) break;
      if (await page.isVisible('#qm-retry-intro-screen')) { await page.click('#qm-retry-continue-btn'); await page.waitForTimeout(120); continue; }
      if (await page.isVisible('#qm-reveal')) { await page.click('#qm-advance-btn'); await page.waitForTimeout(120); continue; }
      const opts = await page.$$eval('#qm-options .sr-option', els => els.map(e => e.getAttribute('data-qm-index')));
      if (!opts.length) { await page.waitForTimeout(100); continue; }
      await page.click('#qm-options .sr-option[data-qm-index="' + opts[0] + '"]');
      await page.waitForTimeout(650);
    }
    const qmSummaryText = await page.textContent('#qm-summary-screen .sr-summary-title');
    log('Quick Match summary screen still shows "Round completato!" via renderSummaryScreen', qmSummaryText.trim() === 'Round completato!');
    await page.click('#qm-complete-btn');
    await page.waitForTimeout(200);
    const mapVisible = await page.isVisible('#map-main-screen');
    log('Quick Match complete button still works (returns to map)', mapVisible);
    log('No JS errors on Speed Round/Quick Match summary regression', errors.length === 0);
    await page.close();
  }

  // ============ Dialogo Ascolta e Ripeti: full functional pass ============
  for (const viewport of [{ w: 375, h: 812 }, { w: 768, h: 1024 }]) {
    const page = await browser.newPage({ viewport: { width: viewport.w, height: viewport.h } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'DGTester' + viewport.w, ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng']);

    const rowClass = await page.getAttribute('[data-module="dialogoAscoltaRipeti"]', 'class');
    log('dialogoAscoltaRipeti unlocked (current) after Quick Match @' + viewport.w, rowClass && rowClass.includes('current'));

    await openModuleFromMap(page, 'dialogoAscoltaRipeti');
    const startVisible = await page.isVisible('#dg-start-screen');
    log('Dialogo start screen visible @' + viewport.w, startVisible);
    const header2row = await page.$('#view-dialogo .header-2row');
    log('Dialogo has header-2row @' + viewport.w, !!header2row);
    const backVisible = await page.isVisible('#dialogo-back-map');
    const watchVisible = await page.isVisible('#dialogo-watch-btn');
    const helpVisible = await page.isVisible('#dialogo-help-btn');
    log('Dialogo full header shows Mappa/Spiegazione/Help on start @' + viewport.w, backVisible && watchVisible && helpVisible);

    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(200);
    const mainVisible = await page.isVisible('#dg-main-screen');
    log('Dialogo main screen visible after start @' + viewport.w, mainVisible);
    const helpVisibleMain = await page.isVisible('#dialogo-help-btn');
    log('Dialogo Help stays visible during exercise (no timer to protect) @' + viewport.w, helpVisibleMain);

    const bubbleCount = await page.$$eval('.dg-bubble', els => els.length);
    log('Dialogo renders 7 bubbles (same dialogue as Speak Easy) @' + viewport.w, bubbleCount === 7);

    const rowAligns = await page.$$eval('.dg-row', els => els.map(e => e.classList.contains('left') ? 'left' : 'right'));
    log('Dialogo bubble alignment matches Speak Easy (guide/esterno=left, family=right) @' + viewport.w,
      JSON.stringify(rowAligns) === JSON.stringify(['left', 'right', 'left', 'right', 'right', 'right', 'left']));

    const micIconPresent = await page.evaluate(() => document.getElementById('view-dialogo').innerHTML.includes('mic'));
    log('Dialogo has NO microphone icon anywhere in the view @' + viewport.w, !micIconPresent);

    const hasAvantiOrSalta = await page.evaluate(() => {
      var text = document.getElementById('view-dialogo').innerText;
      return /Avanti|Salta/.test(text);
    });
    log('Dialogo has NO Avanti/Salta button @' + viewport.w, !hasAvantiOrSalta);

    // Translations toggle: hidden by default, single click reveals ALL, second click hides ALL.
    const translationsHiddenBefore = await page.$$eval('.dg-translation', els => els.every(e => e.hidden));
    log('Dialogo translations hidden by default @' + viewport.w, translationsHiddenBefore);
    await page.click('#dg-translations-toggle');
    await page.waitForTimeout(100);
    const translationsShown = await page.$$eval('.dg-translation', els => els.every(e => !e.hidden));
    const toggleLabelOn = await page.textContent('#dg-translations-toggle');
    log('Dialogo "Mostra traduzioni" reveals every translation at once @' + viewport.w, translationsShown && toggleLabelOn.includes('Nascondi'));
    const toggleClassOn = await page.getAttribute('#dg-translations-toggle', 'class');
    log('Dialogo translations toggle is highlighted (btn-primary) when active @' + viewport.w, toggleClassOn.includes('btn-primary'));
    await page.click('#dg-translations-toggle');
    await page.waitForTimeout(100);
    const translationsHiddenAgain = await page.$$eval('.dg-translation', els => els.every(e => e.hidden));
    log('Dialogo "Nascondi traduzioni" hides every translation again @' + viewport.w, translationsHiddenAgain);

    // Bubble click: plays audio, Regola Azione Critica locks everything else + lifts bubble, then unlocks + checkmark.
    const firstBubble = await page.$('.dg-bubble');
    const firstLineId = await firstBubble.getAttribute('data-line-id');
    await firstBubble.click();
    await page.waitForTimeout(15);
    const midPlayback = await page.evaluate((lineId) => {
      var bubbles = Array.from(document.querySelectorAll('.dg-bubble'));
      var active = document.querySelector('.dg-bubble.is-active');
      var othersLocked = bubbles.filter(b => b.getAttribute('data-line-id') !== lineId).every(b => b.classList.contains('is-locked'));
      return {
        activeIsCorrect: active && active.getAttribute('data-line-id') === lineId,
        othersLocked: othersLocked,
        watchDisabled: document.getElementById('dialogo-watch-btn').disabled,
        helpDisabled: document.getElementById('dialogo-help-btn').disabled,
        toggleDisabled: document.getElementById('dg-translations-toggle').disabled
      };
    }, firstLineId);
    log('Dialogo: clicked bubble lifts (is-active) during playback @' + viewport.w, midPlayback.activeIsCorrect);
    log('Dialogo: every OTHER bubble dims/locks during playback @' + viewport.w, midPlayback.othersLocked);
    log('Dialogo: Spiegazione+Help+translations toggle disabled during playback (Regola Azione Critica) @' + viewport.w,
      midPlayback.watchDisabled && midPlayback.helpDisabled && midPlayback.toggleDisabled);

    await page.waitForTimeout(150); // let the fake utterance "end"
    const afterPlayback = await page.evaluate((lineId) => {
      var bubbles = Array.from(document.querySelectorAll('.dg-bubble'));
      var anyLocked = bubbles.some(b => b.classList.contains('is-locked'));
      var anyActive = bubbles.some(b => b.classList.contains('is-active'));
      var check = document.getElementById('dg-heard-' + lineId);
      return {
        anyLocked: anyLocked,
        anyActive: anyActive,
        checkVisible: check && !check.hidden,
        watchDisabled: document.getElementById('dialogo-watch-btn').disabled
      };
    }, firstLineId);
    log('Dialogo: after playback ends, nothing stays locked/lifted @' + viewport.w, !afterPlayback.anyLocked && !afterPlayback.anyActive);
    log('Dialogo: checkmark appears next to the heard line\'s name @' + viewport.w, afterPlayback.checkVisible);
    log('Dialogo: Spiegazione re-enabled after playback @' + viewport.w, !afterPlayback.watchDisabled);

    // Lines are clickable in any order, repeatedly.
    const lastBubble = await page.$$('.dg-bubble');
    await lastBubble[lastBubble.length - 1].click();
    await page.waitForTimeout(200);
    await firstBubble.click(); // re-click the FIRST one again (already heard) — must still work
    await page.waitForTimeout(200);
    const firstCheckStillThere = await page.evaluate((lineId) => {
      var check = document.getElementById('dg-heard-' + lineId);
      return check && !check.hidden;
    }, firstLineId);
    log('Dialogo: a line can be replayed after already being heard @' + viewport.w, firstCheckStillThere);

    // Choice box present + reveal "Non ancora"/"Sì, lo so" path -> giallo.
    const choiceHtml = await page.evaluate(() => document.getElementById('dg-choice-row').innerHTML);
    log('Dialogo choice box shows "L\'hai imparato?" and correct button labels @' + viewport.w,
      choiceHtml.includes('imparato?') && choiceHtml.includes('Non ancora') && choiceHtml.includes('lo so'));

    await page.click('#dg-not-yet-btn');
    await page.waitForTimeout(200);
    const summaryVisible = await page.isVisible('#dg-summary-screen');
    log('Dialogo reaches summary screen after "Non ancora" @' + viewport.w, summaryVisible);
    const summaryTitle = await page.textContent('#dg-summary-screen .sr-summary-title');
    log('Dialogo summary title renders via shared renderSummaryScreen @' + viewport.w, summaryTitle.trim() === 'Dialogo ripassato!');
    const watchOnSummary = await page.isVisible('#dialogo-watch-btn');
    log('Dialogo Spiegazione hidden on summary (rule 10) @' + viewport.w, !watchOnSummary);

    // Explicit completion required (rule 7).
    const progressBefore = await page.evaluate((u) => {
      var raw = localStorage.getItem('baseinglese:modules:episode1:' + u);
      return raw ? JSON.parse(raw).completed.includes('dialogoAscoltaRipeti') : false;
    }, 'DGTester' + viewport.w);
    log('Dialogo NOT marked completed before clicking finish button @' + viewport.w, !progressBefore);
    await page.click('#dg-complete-btn');
    await page.waitForTimeout(200);
    const progressAfter = await page.evaluate((u) => {
      var raw = localStorage.getItem('baseinglese:modules:episode1:' + u);
      return raw ? JSON.parse(raw).completed.includes('dialogoAscoltaRipeti') : false;
    }, 'DGTester' + viewport.w);
    log('Dialogo marked completed only after explicit "Ho finito" click @' + viewport.w, progressAfter);

    // Map badge: giallo/"Da rivedere" outcome + no mastery entries touched.
    const rowClassAfter = await page.getAttribute('[data-module="dialogoAscoltaRipeti"]', 'class');
    const badgeText = await page.textContent('[data-module="dialogoAscoltaRipeti"] .module-state-badge');
    log('Dialogo map row shows outcome-giallo class after "Non ancora" @' + viewport.w, rowClassAfter.includes('outcome-giallo'));
    log('Dialogo map badge shows "Da rivedere" after "Non ancora" @' + viewport.w, badgeText.trim() === 'Da rivedere');
    const masteryRaw = await page.evaluate((u) => localStorage.getItem('baseinglese:mastery:episode1:' + u), 'DGTester' + viewport.w);
    log('Dialogo touches NO per-word mastery entries @' + viewport.w, !masteryRaw || Object.keys(JSON.parse(masteryRaw)).length === 0);

    log('No JS console/page errors during Dialogo Ascolta e Ripeti run @' + viewport.w, errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  // ============ "Sì, lo so" path: verde + Traguardo sound + map badge ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    let toneFreqsPlayed = [];
    await page.addInitScript(mockInit);
    await page.exposeFunction('__recordTone', (freq) => toneFreqsPlayed.push(freq));
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        const OrigAudioContext = window.AudioContext || window.webkitAudioContext;
        if (!OrigAudioContext) return;
      });
    });
    await bootAsUser(page, 'VerdeTester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng']);
    // Patch srPlayTone-driven oscillator frequency capture via monkey-patching AudioContext.
    await page.evaluate(() => {
      const OrigAC = window.AudioContext || window.webkitAudioContext;
      if (!OrigAC) { window.__noAudioCtx = true; return; }
      const OrigCreateOscillator = OrigAC.prototype.createOscillator;
      OrigAC.prototype.createOscillator = function () {
        const osc = OrigCreateOscillator.call(this);
        const origFreqSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(osc.frequency), 'value');
        Object.defineProperty(osc.frequency, 'value', {
          set(v) { window.__tonesPlayed = window.__tonesPlayed || []; window.__tonesPlayed.push(v); origFreqSetter.set.call(this, v); },
          get() { return origFreqSetter.get.call(this); }
        });
        return osc;
      };
    });
    await openModuleFromMap(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(200);
    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(400);
    const summaryVisible = await page.isVisible('#dg-summary-screen');
    log('Dialogo "Sì, lo so" reaches summary screen', summaryVisible);
    const tones = await page.evaluate(() => window.__tonesPlayed || []);
    log('Dialogo "Sì, lo so" plays the 3-note ascending Traguardo sound (1046/1318/1568 Hz)',
      tones.filter(f => f === 1046).length > 0 && tones.filter(f => f === 1318).length > 0 && tones.filter(f => f === 1568).length > 0);
    await page.click('#dg-complete-btn');
    await page.waitForTimeout(200);
    const badgeText = await page.textContent('[data-module="dialogoAscoltaRipeti"] .module-state-badge');
    const rowClass = await page.getAttribute('[data-module="dialogoAscoltaRipeti"]', 'class');
    log('Dialogo "Sì, lo so" map badge shows "Completato" (not outcome-giallo)', badgeText.trim() === 'Completato' && !rowClass.includes('outcome-giallo'));
    log('No JS errors on verde/Traguardo test', errors.length === 0);
    if (errors.length) errors.forEach(e => console.log('    error: ' + e));
    await page.close();
  }

  // ============ Bubble color tokens across all 5 themes ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'ThemeTester', ['repeatAloud', 'speakEasy', 'voiceCoach', 'quickMatchEngIta', 'quickMatchItaEng']);
    await openModuleFromMap(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(200);

    function to255(colorStr) {
      // getComputedStyle can return "rgb(r, g, b)" (0-255) or, for
      // color-mix() results in this Chromium build, "color(srgb r g b)"
      // (0-1 floats) — normalize both to 0-255 before computing luminance.
      const isColorFn = colorStr.indexOf('color(srgb') === 0;
      const nums = colorStr.match(/[\d.]+/g).map(Number);
      return isColorFn ? nums.slice(0, 3).map(v => v * 255) : nums.slice(0, 3);
    }
    function relLuminance(colorStr) {
      const [r, g, b] = to255(colorStr).map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function contrastRatio(rgb1, rgb2) {
      const l1 = relLuminance(rgb1), l2 = relLuminance(rgb2);
      const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    for (const theme of ['viaggio', 'notte', 'mediterraneo', 'moderno', 'natura']) {
      await page.evaluate((t) => { document.documentElement.setAttribute('data-theme', t); }, theme);
      await page.waitForTimeout(50);
      const colors = await page.evaluate(() => {
        const them = document.querySelector('.dg-bubble-them');
        const us = document.querySelector('.dg-bubble-us');
        const bg = getComputedStyle(document.body).backgroundColor;
        return {
          themBg: them ? getComputedStyle(them).backgroundColor : null,
          usBg: us ? getComputedStyle(us).backgroundColor : null,
          pageBg: bg
        };
      });
      const distinguishable = colors.themBg && colors.usBg && colors.themBg !== colors.usBg;
      const ratio = colors.themBg && colors.usBg ? contrastRatio(colors.themBg, colors.usBg) : 0;
      log('Theme ' + theme + ': "them" and "us" bubble backgrounds are distinct colors', distinguishable);
      log('Theme ' + theme + ': them/us bubble contrast ratio >= 1.08 (them=' + colors.themBg + ', us=' + colors.usBg + ', ratio=' + ratio.toFixed(3) + ')', ratio >= 1.08);
    }
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
