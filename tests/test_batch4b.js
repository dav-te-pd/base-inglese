const { launchBrowser, APP_URL, attendiPrimaSchermata } = require('./test-env');
const { bootUtente, INTRO_DI_TUTTI } = require('./boot');
const { attendiVisibile } = require('./attese');
const { allSteps } = require('./module-order');
const BASE = APP_URL;

// Il finto del browser sta in un posto solo dal 2026-09-24 (passo F.4):
// stesso nucleo di prima, stessi parametri. Vedi tests/mock-browser.js.
const { mockInit } = require('./mock-browser');


// ⚠️ SOLO DUE INTRO CHIUSE, DI PROPOSITO: questo file verifica proprio la
// schermata di Spiegazione, quindi le altre introduzioni DEVONO comparire.
const bootAsUser = (page, userName, completedModules) =>
  bootUtente(page, { utente: userName, completati: completedModules,
    introChiuse: ['mappaEpisodio', 'personalizzazione'] });

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const ALL_MODULES = allSteps();

  const checks = [
    ['repeatAloud', '#repeat-aloud-intro-title', 'Repeat Aloud'],
    ['matchEngIta', '#qm-start-title', 'Match Practice en→it'],
    ['dialogoAscoltaRipeti', '#dg-start-title', 'Dialogue: Listen & Repeat'],
    ['speedMatchEngIta', '#sr-start-title', 'Speed Match en→it'],
    ['flashcardAEngIta', '#fc-intro-title', 'Flash Card'] // known gap: shared JSON kind -> generic title, no direction
  ];

  for (const [moduleId, selector, expected] of checks) {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const idx = ALL_MODULES.indexOf(moduleId);
    const priorModules = ALL_MODULES.slice(0, idx);
    await bootAsUser(page, 'T4b_' + moduleId, priorModules);
    await page.click('[data-module="' + moduleId + '"]');
    // ⚠️ E' IL CASO PIU' DIVERSO DELLA FAMIGLIA, e per questo la conversione si
    // prova qui per prima: e' l'unico CICLO su una lista di moduli invece di un
    // blocco su un modulo solo, e l'unico in cui il selettore da aspettare e'
    // un PARAMETRO, non una costante scritta a mano. Un approdo sbagliato qui
    // non si vedrebbe: tornerebbe false su ogni giro e il .catch trasformerebbe
    // la lettura in 'ERROR:...', cioe' in un rosso che parla d'altro.
    //
    // L'approdo e' il contenitore dell'intro, non il nome che l'asserzione
    // legge (CLAUDE.md regola 44): aspettare il nome lo renderebbe vero per
    // costruzione.
    await attendiVisibile(page, selector);
    const text = await page.$eval(selector + ' .spiegazione-title-name', el => el.textContent.trim()).catch(e => 'ERROR:' + e.message);
    log('[Spiegazione] ' + moduleId + ' intro name = "' + expected + '" (got "' + text + '")', text === expected);
    log('[Spiegazione] ' + moduleId + ' no JS errors', errors.length === 0);
    if (errors.length) console.log(errors);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== BATCH4b SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
