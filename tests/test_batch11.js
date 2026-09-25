const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, fileEdizione, attendiPrimaSchermata } = require('./test-env');
const { bootUtente, INTRO_DI_TUTTI } = require('./boot');
const { mockBrowser, componi, spiaToni, catturaAvvisi } = require('./mock-browser');
const { attendiClasse, attendiVisibile } = require('./attese');
const { allSteps } = require('./module-order');
const { chiudiPopupTentativiSeAperto } = require('./quiz-driver');
const { openModule } = require('./map-driver');
const BASE = APP_URL;

// I messaggi si leggono dal file, non dalla pagina. Prima si leggeva
// window.FALLBACK_FEEDBACK_MESSAGES — comodo, ma era la copia inline dentro
// index.html, sparita insieme al fallback. Il file è la fonte, quindi è da lì
// che si guarda, e per questa verifica il browser non serve.
const MESSAGGI = JSON.parse(
  fs.readFileSync(fileEdizione('messaggi-feedback.json'), 'utf8'));

const mockInit = componi(mockBrowser({ riconoscimento: 'suStop', ritardoRiconoscimentoMs: 5 }), spiaToni, catturaAvvisi);

const bootAsUser = (page, userName, completedModules) =>
  bootUtente(page, { utente: userName, completati: completedModules, introChiuse: INTRO_DI_TUTTI,
    // La chiave vecchia di Repeat Aloud, diversa dalle altre: non e'
    // `introDismissed:<kind>` ma un nome suo.
    storage: { ['baseinglese:repeatAloudIntroDismissed:' + userName]: '1' } });

const ALL_MODULES = allSteps();

// ---- Voice Coach driving helpers ----

async function vcAnswerLine(page, transcript) {
  await page.evaluate((t) => { window.__vcTranscript = t; }, transcript);
  // .record-toggle-btn.is-recording carries a continuous pulse animation
  // (@keyframes pulse-strong) — Playwright's normal click() waits for the
  // element to be "stable" (unmoving) first, which a looping animation
  // never satisfies, so it times out. Dispatch the click directly instead.
  await page.evaluate(() => document.getElementById('vc-record-btn').click());
  await page.waitForTimeout(120);
  await page.evaluate(() => document.getElementById('vc-record-btn').click()); // toggle: stop
  await page.waitForTimeout(150);
  await page.click('#vc-send-btn');
  await page.waitForTimeout(180);
  await chiudiPopupTentativiSeAperto(page);
}

// A NON-empty but 0%-correct transcript — recognizedWords.length > 0 so
// this never increments vcEmptyRecognitionStreak (job 6's mic-trouble
// detector, a SEPARATE, unrelated mechanism keyed on recordings with NO
// recognized words at all). An empty transcript would eventually flip
// vcMicConfirmedProblem, which silently blocks vcNextLine — not what a
// "score badly" test wants to exercise.
const WRONG_TRANSCRIPT = 'xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy xyzzy';

// Job 5: this module (voiceCoach) is now the Voice Check variant — ONE
// recording per phrase, no "Riprova" at all. A single wrong evaluate is
// enough: attemptNum is always 1, so the line is simply queued into
// vcRetryQueue for the later Schermata Ripasso pass (handled by
// vcCompleteModule below), same as production behavior.
async function vcCompleteLineWrong(page) {
  await vcAnswerLine(page, WRONG_TRANSCRIPT);
}

// Exact-matches the shown target text -> 100% first-try, 3 stars, never
// queued for retry.
async function vcCompleteLineRight(page) {
  const targetText = await page.evaluate(() => document.getElementById('vc-target').textContent);
  await vcAnswerLine(page, targetText);
}

// Drives the whole module using wrongAtIndex(i) to decide, per MAIN-PASS
// line index (0-based), whether that line's single (job 5: Voice Check has
// no retry) attempt is wrong or right (exact match). vcLastAvgPct freezes
// on this main pass alone, so once the retry-pass (Schermata Ripasso)
// screen appears, every remaining line is answered "right" — it can no
// longer affect the score, it just needs to drain the queue so the module
// can reach its summary screen. Stops once the summary screen appears.
async function vcCompleteModule(page, wrongAtIndex, maxLines) {
  let i = 0;
  let inRetryPass = false;
  for (let guard = 0; guard < maxLines * 2; guard++) {
    const summaryHidden = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
    if (!summaryHidden) return i;
    const retryIntroHidden = await page.evaluate(() => document.getElementById('voice-coach-retry-intro-screen').hidden);
    if (!retryIntroHidden) {
      await page.click('#voice-coach-retry-continue-btn');
      await page.waitForTimeout(180);
      inRetryPass = true;
      continue;
    }
    if (i >= maxLines) return i;
    if (!inRetryPass && wrongAtIndex(i)) { await vcCompleteLineWrong(page); } else { await vcCompleteLineRight(page); }
    i++;
    const summaryHiddenAfter = await page.evaluate(() => document.getElementById('voice-coach-summary-screen').hidden);
    if (!summaryHiddenAfter) return i;
    const nextDisabled = await page.evaluate(() => document.getElementById('vc-next-btn').disabled);
    if (!nextDisabled) await page.click('#vc-next-btn');
    await page.waitForTimeout(180);
  }
  return i;
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const LINE_COUNT = await (async () => {
    const p = await browser.newPage();
    await p.goto(BASE);
    const n = await p.evaluate(() => fetch('data/inglese/it/inglese-it-gate.json').then(r => r.json()).then(d => d.levels.D.items.length));
    await p.close();
    return n;
  })();

  // ============ CONFIG: moduleOutcomeRules declares the rule per module ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    await page.goto(BASE);
    const rules = await page.evaluate(() => window.APP_CONFIG.moduleOutcomeRules);
    log('[Config] moduleOutcomeRules.voiceCoach === "moduleRules"', rules && rules.voiceCoach === 'moduleRules');
    log('[Config] moduleOutcomeRules declares selfAssessment for the 3 Dialogo modules', rules && rules.dialogoAscoltaRipeti === 'selfAssessment' && rules.dialogoRipetiATempo === 'selfAssessment' && rules.dialogoContinuo === 'selfAssessment');
    // whyWeSayIt (ex storyCards) declares 'selfScoreRules' —
    // repeatAloud stays undefined (default completionRules, unchanged).
    log('[Config] repeatAloud has no entry (default = completionRules); whyWeSayIt = selfScoreRules', rules && rules.repeatAloud === undefined && rules.whyWeSayIt === 'selfScoreRules');
    await page.close();
  }

  // ============ --accent no longer collides with --wrong-ink (the "Attuale" red bug) ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'T11Accent', []);
    const colors = await page.evaluate(() => {
      var cs = getComputedStyle(document.documentElement);
      var accent = cs.getPropertyValue('--accent').trim();
      var wrongInk = cs.getPropertyValue('--wrong-ink').trim();
      var currentIcon = document.querySelector('.module-row.current .module-status-icon');
      var currentBg = currentIcon ? getComputedStyle(currentIcon).backgroundColor : null;
      // Build a throwaway rosso row's icon background for comparison, via the
      // real CSS rule (not guessing the color by hand).
      var probe = document.createElement('button');
      probe.className = 'module-row completed outcome-rosso';
      var probeIcon = document.createElement('span');
      probeIcon.className = 'module-status-icon';
      probe.appendChild(probeIcon);
      document.body.appendChild(probe);
      var rossoBg = getComputedStyle(probeIcon).backgroundColor;
      document.body.removeChild(probe);
      return { accent: accent, wrongInk: wrongInk, currentBg: currentBg, rossoBg: rossoBg };
    });
    log('[Attuale] --accent CSS variable no longer equals --wrong-ink', colors.accent.toLowerCase() !== colors.wrongInk.toLowerCase());
    log('[Attuale] "Attuale" module-status-icon background differs from the rosso/error background', colors.currentBg !== colors.rossoBg);
    log('[Attuale] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Voice Coach, all correct -> verde badge on the map ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Verde', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    const summaryVisible = await attendiVisibile(page, '#voice-coach-summary-screen');
    log('[ModuleRules] Voice Coach (all correct) reaches the summary screen', summaryVisible);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Verde');
    log('[ModuleRules] First-pass 100% saves level "verde"', state.level === 'verde' && state.pct === 100);
    log('[ModuleRules] Map row carries outcome-verde and the plain "Completato" badge', state.rowClass && state.rowClass.indexOf('outcome-verde') !== -1 && state.badge === 'Completato');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Voice Coach, all wrong -> rosso badge "Da riprovare", frozen BEFORE retry pass ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Rosso', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => true, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Rosso');
    log('[ModuleRules] First-pass 0% (every line force-accepted wrong, not skipped) saves level "rosso"', state.level === 'rosso' && state.pct === 0);
    log('[ModuleRules] Map row carries outcome-rosso and the "Da riprovare" badge', state.rowClass && state.rowClass.indexOf('outcome-rosso') !== -1 && state.badge === 'Da riprovare');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Voice Coach, mixed -> giallo badge "Da rivedere" ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Giallo', ALL_MODULES.slice(0, idx));
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    // ~1/3 wrong, ~2/3 right -> average first-pass pct comfortably inside
    // the 50-79 medio/giallo band regardless of exact line count.
    await vcCompleteModule(page, (i) => i % 3 === 0, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const state = await page.evaluate((u) => {
      var outcomes = JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}');
      var row = document.querySelector('[data-module="voiceCoach"]');
      var badge = row ? row.querySelector('.module-state-badge').textContent : null;
      return { level: outcomes.voiceCoach && outcomes.voiceCoach.level, pct: outcomes.voiceCoach && outcomes.voiceCoach.pct, rowClass: row ? row.className : null, badge: badge };
    }, 'T11Giallo');
    const soglie = await page.evaluate(() => window.APP_CONFIG.percentageThresholds);
    log('[ModuleRules] Mixed first-pass score (' + state.pct + '%) saves level "giallo", dentro la banda dichiarata (' + soglie.medio + '-' + soglie.alto + ')', state.level === 'giallo' && state.pct >= soglie.medio && state.pct < soglie.alto);
    log('[ModuleRules] Map row carries outcome-giallo and the "Da rivedere" badge', state.rowClass && state.rowClass.indexOf('outcome-giallo') !== -1 && state.badge === 'Da rivedere');
    log('[ModuleRules] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Redo REPLACES the color, in both directions ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('voiceCoach');
    await bootAsUser(page, 'T11Redo', ALL_MODULES.slice(0, idx));

    // First pass: all correct -> verde
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const afterFirst = await page.evaluate((u) => JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}').voiceCoach.level, 'T11Redo');
    log('[Redo] First attempt (all correct) is verde', afterFirst === 'verde');

    // Redo, now all wrong -> should DOWNGRADE to rosso (a re-attempt going
    // worse must not be softened just because it was already green).
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => true, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const afterSecond = await page.evaluate((u) => JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}').voiceCoach.level, 'T11Redo');
    const rowAfterSecond = await page.evaluate(() => document.querySelector('[data-module="voiceCoach"]').className);
    log('[Redo] Second attempt (all wrong) REPLACES verde with rosso (downgrade honored)', afterSecond === 'rosso' && rowAfterSecond.indexOf('outcome-rosso') !== -1 && rowAfterSecond.indexOf('outcome-verde') === -1);

    // Redo again, back to all correct -> should UPGRADE back to verde.
    await openModule(page, 'voiceCoach');
    await page.waitForTimeout(300);
    await vcCompleteModule(page, () => false, LINE_COUNT * 2 + 4);
    await page.waitForTimeout(200);
    await page.click('#voice-coach-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const afterThird = await page.evaluate((u) => JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}').voiceCoach.level, 'T11Redo');
    const rowAfterThird = await page.evaluate(() => document.querySelector('[data-module="voiceCoach"]').className);
    log('[Redo] Third attempt (all correct again) REPLACES rosso with verde (upgrade honored)', afterThird === 'verde' && rowAfterThird.indexOf('outcome-verde') !== -1 && rowAfterThird.indexOf('outcome-rosso') === -1);
    log('[Redo] No JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  // ============ Modulo Finale prep: la FORMA dei dati che il Modulo Finale leggera' ============
  // ⚠️ QUI C'ERA IL NOME `episodeFinalOutcomeCase`, CANCELLATA COL PASSO F.5
  // IL 2026-09-24 perche' non aveva chiamanti — il suo disegno resta in
  // `docs/decisioni-storico.md` e si riscrivera' quando il Modulo Finale
  // nascera' davvero.
  //
  // **Questo blocco resta, e protegge la cosa che serve comunque:**
  // loadModuleOutcomes()'s stored shape
  // ({ [moduleId]: { level: 'verde'|'giallo'|'rosso', ... } }) is exactly
  // what both Voice Coach (ModuleRules) and Dialogo (selfAssessment)
  // write, regardless of which rule produced it.
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf('dialogoAscoltaRipeti');
    await bootAsUser(page, 'T11Final', ALL_MODULES.slice(0, idx));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForTimeout(300);
    const startBtnVisible = await page.isVisible('#dg-start-btn').catch(() => false);
    if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }
    const bubbleCount = await page.locator('.dg-bubble').count();
    for (let i = 0; i < bubbleCount; i++) { await page.locator('.dg-bubble').nth(i).click(); await page.waitForTimeout(400); }
    await page.click('#dg-know-it-btn');
    await page.waitForTimeout(300); // ATTESA-LEGITTIMA: l'asserzione qui sotto verifica che una scrittura NON avvenga — rispondere all'autovalutazione non deve lasciare un esito. Un non-evento non si aspetta: il tempo E' la misura, e un'attesa sullo stato tornerebbe solo piu' tardi con lo stesso nulla
    // Dal 2026-09-10 l'autovalutazione MOSTRA e non scrive: l'esito arriva al
    // magazzino col pulsante di uscita, come in ogni altro modulo. Rispondere
    // e poi uscire da "← Mappa" non deve lasciare un colore che nessuno ha
    // confermato — e' il difetto che la ③ ha chiuso, e questa riga in piu' e'
    // il segno che qui si misura il gesto, non piu' la risposta.
    const primaDelPulsante = await page.evaluate((u) => JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}'), 'T11Final');
    log('[Modulo Finale prep] L\'autovalutazione da sola NON scrive l\'esito: aspetta il pulsante', !primaDelPulsante.dialogoAscoltaRipeti);
    await page.click('#dg-complete-btn');
    await attendiClasse(page, '#view-map', 'is-active'); // approdo: l'ULTIMO effetto del gesto (la mappa), non la scrittura che l'asserzione legge — criterio in testa a tests/attese.js
    const outcomes = await page.evaluate((u) => JSON.parse(localStorage.getItem(BI.moduleOutcomeKey('gate', u)) || '{}'), 'T11Final');
    log('[Modulo Finale prep] Dialogo (selfAssessment) writes the same { level } shape ModuleRules writes', outcomes.dialogoAscoltaRipeti && outcomes.dialogoAscoltaRipeti.level === 'verde');
    log('[Modulo Finale prep] No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Modulo Finale prep: episodeFinalMessages data (3 cases, compliment always first, tip only when due) ============
  {
    // L'asserzione "la copia inline coincide col file vero" e' sparita insieme
    // alla copia: non c'e' piu' un secondo posto da tenere allineato, che era
    // tutto il suo motivo di esistere.
    const finali = MESSAGGI.episodeFinalMessages;
    log('[Modulo Finale prep] episodeFinalMessages has all 3 cases with non-empty compliments', ['tuttiVerdi', 'gialloNoRosso', 'almenoUnRosso'].every(k => finali[k] && finali[k].compliments.length > 0));
    log('[Modulo Finale prep] tuttiVerdi has NO tip (nessun consiglio)', finali.tuttiVerdi.tip.length === 0);
    log('[Modulo Finale prep] gialloNoRosso and almenoUnRosso DO have a tip', finali.gialloNoRosso.tip.length > 0 && finali.almenoUnRosso.tip.length > 0);
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH11 SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
