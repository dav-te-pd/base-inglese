// PROTEGGE: che quello che il Pannello Admin salva su una sezione che viene dai file di un'edizione — la struttura del corso, le tabelle dei nomi, le due lingue della voce — resti a QUELL'edizione, e non arrivi alle altre: toccare la velocità della voce in inglese/it non deve far parlare inglese a italiano/es, spegnere un episodio in un corso non lo spegne negli altri. E che le sezioni dell'app (la velocità della voce compresa) valgano invece per tutte; che un valore del corso salvato nella forma di prima, nella chiave comune, si ignori; e che «ripristina i valori di partenza» tolga le chiavi di tutti i corsi.
//
// Deciso da chi guida il progetto il 2026-10-23, dopo la misura del giorno
// prima: tredici sezioni dei file di un'edizione passavano all'edizione aperta
// dopo, perche' il Pannello salvava tutto in una chiave sola. *Un override e'
// un banco di prova sopra un file: se il file e' di un'edizione, l'override e'
// di quell'edizione.* Questo file e' quella misura resa ripetibile.
//
// COME — sull'app vera, col magazzino vero, con lo SCRITTORE vero
// (`BI.salvaSezioneDelPannello`, l'unico che il Pannello chiama):
//   [A] le sezioni del corso si RICAVANO DAI FILE dell'edizione — le chiavi
//       della struttura, quelle che la struttura mette in `speech`, le
//       famiglie delle tabelle — non dall'elenco dell'app. Se un file un
//       giorno porta una chiave che l'app non tratta come del corso, la sonda
//       la vede passare;
//   [B] ognuna si cambia e si salva in inglese/it: dopo una ricarica la' c'e',
//       nelle altre edizioni c'e' il loro file e basta;
//   [C] ⚠️ IL CASO PIU' DIVERSO (regola 42): `speech`, l'unica sezione DIVISA
//       fra corso e app. La velocita' salvata in inglese/it vale anche in
//       spagnolo/it e italiano/es; le lingue no;
//   [D] un valore del corso trovato nella chiave dell'app — la forma di prima
//       del 2026-10-23 — si ignora;
//   [E] il ripristino toglie la chiave dell'app e quelle di tutti i corsi.
//
// LIMITE: le sezioni si cambiano dal codice (`APP_CONFIG` + lo scrittore),
// non toccando i campi del Pannello uno per uno. Che i campi chiamino lo
// scrittore lo dice `persistConfigSection`, che ha una riga sola; i gesti
// veri del Pannello li guidano test_batch2b, test_new_features e
// test_ordine_episodi_pannello.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const CHIAVE = 'baseinglese:configOverrides';
const leggi = (...p) => JSON.parse(fs.readFileSync(repoPath(...p), 'utf8'));
const uguali = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function apri(page, edizione, app, corsi) {
  await page.goto(APP_URL);
  await page.evaluate(([k, e, a, c]) => {
    localStorage.clear();
    localStorage.setItem(k, JSON.stringify(Object.assign({}, a || {}, { edizione: e })));
    Object.keys(c || {}).forEach((nome) => localStorage.setItem(k + ':' + nome, JSON.stringify(c[nome])));
  }, [CHIAVE, edizione, app, corsi]);
  await page.reload();
  await attendiPrimaSchermata(page);
  return page.evaluate(async () => {
    const t = await window.BI.loadPersonalizationTables();
    const c = JSON.parse(JSON.stringify(window.APP_CONFIG));
    Object.keys(t).forEach((k) => { c[k] = t[k]; });
    return c;
  });
}

// Il valore che il Pannello salverebbe dopo una modifica: diverso da quello
// del file in TUTTE le edizioni, cosi' una fuga si vede comunque.
function cambiato(valore, sezione) {
  if (sezione === 'episodiSpenti') return ['aircraft-door'];
  if (sezione === 'episodioCorrente') return 'aircraft-door';
  if (Array.isArray(valore)) return valore.slice().reverse();
  if (valore && typeof valore === 'object') return Object.assign({}, valore, { __provaPannello: sezione });
  return String(valore) + '-prova';
}

async function run() {
  const edizioni = leggi('data', 'edizioni.json').edizioni.map((e) => ({ lingua: e.lingua, studente: e.studente }));
  const nome = (e) => e.lingua + '/' + e.studente;
  const casa = edizioni.find((e) => e.lingua === 'inglese' && e.studente === 'it');
  const altre = edizioni.filter((e) => e !== casa);
  log('[A] Ci sono altre edizioni oltre a inglese/it', !!casa && altre.length > 0, edizioni.map(nome).join(', '));

  // ── [A] le sezioni del corso, dai FILE ───────────────────────────────
  const pref = casa.lingua + '-' + casa.studente + '-';
  const struttura = leggi('data', casa.lingua, casa.studente, pref + 'struttura-corso.json');
  const tabelle = leggi('data', casa.lingua, casa.studente, pref + 'tabelle-personalizzazione.json');
  const sezioni = Object.keys(struttura).filter((k) => k !== 'speech')
    .concat(Object.keys(tabelle).filter((k) => k.charAt(0) !== '_'));
  const lingueVoce = Object.keys(struttura.speech || {});
  log('[A] Le sezioni del corso, lette dai file: ' + sezioni.length + ' intere + ' + lingueVoce.length + ' chiavi di `speech`',
    sezioni.length > 0 && lingueVoce.length > 0, sezioni.join(', ') + ' | speech: ' + lingueVoce.join(', '));

  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));

  // I valori di ogni edizione SENZA override: il termine di paragone.
  const pulito = {};
  for (const e of edizioni) pulito[nome(e)] = await apri(page, e);

  // ── [B] ogni sezione del corso resta al suo corso ────────────────────
  // Si salva tutto in un giro solo, con lo scrittore vero, come farebbe chi
  // amministra toccando un campo dopo l'altro.
  const attesi = {};
  sezioni.forEach((s) => { attesi[s] = cambiato(pulito[nome(casa)][s], s); });
  const velocita = (pulito[nome(casa)].speech.synthesisRate || 1) + 0.25;
  await apri(page, casa);
  await page.evaluate(async ([valori, rate]) => {
    const t = await window.BI.loadPersonalizationTables();
    Object.keys(t).forEach((k) => { window.APP_CONFIG[k] = t[k]; });
    Object.keys(valori).forEach((s) => {
      window.APP_CONFIG[s] = valori[s];
      window.BI.salvaSezioneDelPannello(s);
    });
    window.APP_CONFIG.speech.synthesisRate = rate;
    window.BI.salvaSezioneDelPannello('speech');
  }, [attesi, velocita]);
  const magazzino = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.indexOf('baseinglese:configOverrides') === 0));
  log('[B] Le sezioni del corso sono finite nella chiave DEL CORSO, non in quella comune',
    magazzino.indexOf(CHIAVE + ':' + nome(casa)) !== -1, magazzino.join(', '));
  const comune = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), CHIAVE);
  const nellaComune = sezioni.filter((s) => s in comune);
  log('[B] ...e nessuna e\' nella chiave comune', nellaComune.length === 0, nellaComune.join(', '));
  const salvato = await page.evaluate((k) => localStorage.getItem(k), CHIAVE + ':' + nome(casa));
  const ricaricata = await (async () => {
    await page.reload();
    await attendiPrimaSchermata(page);
    return page.evaluate(async () => {
      const t = await window.BI.loadPersonalizationTables();
      const c = JSON.parse(JSON.stringify(window.APP_CONFIG));
      Object.keys(t).forEach((k) => { c[k] = t[k]; });
      return c;
    });
  })();
  const nonTornate = sezioni.filter((s) => !uguali(ricaricata[s], attesi[s]));
  log('[B] Dopo la ricarica, in ' + nome(casa) + ' c\'e\' ogni modifica (sezioni: ' + sezioni.length + ')',
    nonTornate.length === 0, nonTornate.join(', '));
  for (const e of altre) {
    const app = JSON.parse(JSON.stringify(comune));
    const corsi = {}; corsi[nome(casa)] = JSON.parse(salvato);
    const visto = await apri(page, e, app, corsi);
    const fughe = sezioni.filter((s) => !uguali(visto[s], pulito[nome(e)][s]));
    log('[B] ⚠️ In ' + nome(e) + ' nessuna sezione del corso arriva da ' + nome(casa), fughe.length === 0, fughe.join(', '));
    // ── [C] speech: la velocita' passa, le lingue no ─────────────────
    log('[C] ⚠️ In ' + nome(e) + ' la velocita\' della voce salvata in ' + nome(casa) + ' vale anche qui (e\' di chi ascolta)',
      visto.speech.synthesisRate === velocita, String(visto.speech.synthesisRate));
    const lingueFuori = lingueVoce.filter((k) => visto.speech[k] !== pulito[nome(e)].speech[k]);
    log('[C] ⚠️ ...ma le lingue della voce restano quelle di ' + nome(e), lingueFuori.length === 0,
      lingueVoce.map((k) => k + '=' + visto.speech[k]).join(', '));
  }

  // ── [D] un valore del corso nella chiave comune si ignora ────────────
  const vecchio = {};
  sezioni.forEach((s) => { vecchio[s] = attesi[s]; });
  vecchio.speech = Object.assign({}, pulito[nome(altre[0])].speech, { synthesisRate: velocita });
  const conVecchio = await apri(page, casa, vecchio);
  const applicate = sezioni.filter((s) => !uguali(conVecchio[s], pulito[nome(casa)][s]));
  log('[D] Le sezioni del corso trovate nella chiave comune (la forma di prima) si IGNORANO',
    applicate.length === 0, applicate.join(', '));
  log('[D] ...comprese le lingue dentro `speech`', lingueVoce.every((k) => conVecchio.speech[k] === pulito[nome(casa)].speech[k]),
    lingueVoce.map((k) => k + '=' + conVecchio.speech[k]).join(', '));
  log('[D] ...mentre la parte dell\'app di `speech` si applica', conVecchio.speech.synthesisRate === velocita,
    String(conVecchio.speech.synthesisRate));

  // ── [E] il ripristino toglie tutte le chiavi ─────────────────────────
  const corsiTutti = {};
  edizioni.forEach((e) => { corsiTutti[nome(e)] = { episodioCorrente: 'aircraft-door' }; });
  await apri(page, casa, { sceltaMultipla: { distrattori: 3 } }, corsiTutti);
  const prima = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.indexOf('baseinglese:configOverrides') === 0).length);
  log('[E] Prima del ripristino ci sono la chiave dell\'app e una per corso (' + (edizioni.length + 1) + ')',
    prima === edizioni.length + 1, String(prima));
  // `?config` apre il Pannello anche con il cursore nel campo del nome.
  await page.goto(APP_URL + '?config');
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 15000 });
  await Promise.all([page.waitForEvent('load'), page.click('#config-panel-reset-btn')]);
  await attendiPrimaSchermata(page);
  const rimaste = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.indexOf('baseinglese:configOverrides') === 0));
  log('[E] «Ripristina» toglie la chiave dell\'app e quelle di TUTTI i corsi', rimaste.length === 0, rimaste.join(', '));

  log('Nessun errore JS', errori.length === 0, errori.join(' | '));
  await browser.close();
  console.log('\n=== OVERRIDE PER EDIZIONE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
