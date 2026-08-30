// Verifica che le copie di sicurezza dentro index.html (window.FALLBACK_*)
// coincidano con i file in data/.
//
// index.html tiene una copia inline dei tre file di dati, usata SOLO quando
// il fetch fallisce (es. la pagina pubblicata come singolo file). Il commento
// nel codice dice "this block should mirror it, never diverge" — ma finché
// l'app girava solo dove il fetch fallisce, una divergenza non si sarebbe
// mai vista. Servita da un posto dove i file esistono davvero (GitHub Pages,
// o il server locale), l'app usa i file veri: se le due versioni sono
// diverse, il comportamento cambia in silenzio.
//
// Esce con codice 1 se qualcosa diverge, stampando dove.
//
//   node tests/tools/check-fallbacks.js     (con il server attivo)

const { launchBrowser, APP_URL } = require('./test-env');

// Confronto strutturale indipendente dall'ordine delle chiavi: due file
// uguali nel contenuto ma scritti in ordine diverso non sono una divergenza.
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(value).sort().map(function (k) {
    return JSON.stringify(k) + ':' + stableStringify(value[k]);
  }).join(',') + '}';
}

const CHECKS = [
  { file: 'data/a1-episodio1-inglese.json', global: 'FALLBACK_EPISODE_DATA', keyed: true },
  { file: 'data/istruzioni-moduli.json', global: 'FALLBACK_MODULE_INSTRUCTIONS', keyed: false },
  { file: 'data/messaggi-feedback.json', global: 'FALLBACK_FEEDBACK_MESSAGES', keyed: false }
];

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const failed = [];

  await page.goto(APP_URL);

  for (const check of CHECKS) {
    const result = await page.evaluate(async (c) => {
      const res = await fetch(c.file);
      if (!res.ok) return { error: 'fetch fallito: HTTP ' + res.status };
      const fromFile = await res.json();
      const holder = window[c.global];
      if (!holder) return { error: 'window.' + c.global + ' non definito' };
      const fromFallback = c.keyed ? holder[c.file] : holder;
      if (!fromFallback) return { error: 'nessuna copia di sicurezza per ' + c.file };
      return { fromFile: fromFile, fromFallback: fromFallback };
    }, check);

    if (result.error) {
      console.log('FAIL - ' + check.file + ': ' + result.error);
      failed.push(check.file);
      continue;
    }

    const a = stableStringify(result.fromFile);
    const b = stableStringify(result.fromFallback);
    if (a === b) {
      console.log('OK   - ' + check.file + ' coincide con window.' + check.global);
      continue;
    }

    console.log('FAIL - ' + check.file + ' DIVERGE da window.' + check.global);
    failed.push(check.file);
    // Prima chiave di primo livello che differisce, per sapere dove guardare.
    const keys = Array.from(new Set(Object.keys(result.fromFile).concat(Object.keys(result.fromFallback)))).sort();
    keys.forEach(function (k) {
      if (stableStringify(result.fromFile[k]) !== stableStringify(result.fromFallback[k])) {
        console.log('       diverge la sezione "' + k + '"');
      }
    });
  }

  await browser.close();
  console.log('\n=== FALLBACK CHECK: ' + (CHECKS.length - failed.length) + '/' + CHECKS.length + ' allineati ===');
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
