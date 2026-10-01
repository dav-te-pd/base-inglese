// PROTEGGE: che la voce che legge le frasi segua la LINGUA DELL'EDIZIONE, con
// i gradini decisi da chi guida il progetto il 2026-10-01 — prima le preferite
// di quella lingua, poi la varietà ESATTA (`es-ES`), solo dopo un'altra
// varietà della stessa lingua (`es-MX`), e MAI un'altra lingua — e che il
// Pannello Admin DICA quale voce sta usando, ripiego compreso.
//
// COSA SI PERDE SENZA QUESTO FILE. Fino al passo 3 l'app provava un elenco di
// voci inglesi PRIMA di guardare la lingua, e ripiegava su `'en'` scritto a
// mano: lo spagnolo veniva letto da «Google US English» su ogni Chrome. Il
// finto sintetizzatore degli altri test ha UNA voce inglese, quindi nessun
// altro file poteva accorgersene.
//
// ⚠️ IL CASO PIU' DIVERSO (regola 42): il dispositivo che NON HA nessuna voce
// della lingua dell'edizione. È l'unico in cui la risposta giusta è «niente»,
// e il codice di prima ci rispondeva con la voce inglese.
//
// COSA NON PROTEGGE, dichiarato (regola 32): che la voce SUONI bene. Le voci
// sono finte — nome e lingua — e la scelta fra due voci della stessa varietà
// la fa ancora l'euristica «voce maschile», pensata per l'inglese.

const { launchBrowser, APP_URL, bloccaFontEsterni, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

const INGLESE = { name: 'Google US English', lang: 'en-US' };
const MESSICO = { name: 'Paulina', lang: 'es-MX' };
const SPAGNA = { name: 'Monica', lang: 'es-ES' };
const SPAGNA_UNDERSCORE = { name: 'Android es', lang: 'es_ES' };

// Apre l'app con un elenco di voci e una lingua dell'edizione, e torna la
// scelta e la riga del Pannello Admin.
async function prova(browser, voci, lingua, override) {
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', e => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, voci: voci }));
  await page.goto(APP_URL);
  await page.evaluate((o) => {
    localStorage.clear();
    if (o) localStorage.setItem('baseinglese:configOverrides', JSON.stringify(o));
  }, override || null);
  await page.reload();
  await attendiPrimaSchermata(page);
  const scelta = await page.evaluate((l) => {
    if (l) window.APP_CONFIG.speech.synthesisLang = l;
    const s = window.BI.sceltaVoce();
    return { come: s.come, usata: s.usata, nome: s.nome, chiesta: s.chiesta };
  }, lingua);
  // Il pannello si apre digitando «config» fuori da un campo di testo.
  await page.click('body', { position: { x: 1, y: 1 } }).catch(() => {});
  for (const c of 'config') await page.keyboard.press(c);
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 5000 }).catch(() => {});
  const riga = await page.evaluate(() => {
    const p = document.getElementById('cfg-voce-usata');
    return p ? { testo: p.textContent, voce: p.getAttribute('data-voce') } : null;
  });
  await page.close();
  return { scelta, riga, errori };
}

async function run() {
  const browser = await launchBrowser();

  // [A] Edizione spagnola, il dispositivo ha inglese, messicano e spagnolo.
  // ⚠️ E' LA RIGA CHE DISTINGUE: col codice di prima vinceva «Google US
  // English», preferita e provata prima della lingua.
  const a = await prova(browser, [INGLESE, MESSICO, SPAGNA], 'es-ES');
  log('[A] Spagnolo: vince la varietà ESATTA (es-ES), non la preferita inglese né il messicano',
    a.scelta.come === 'esatta' && a.scelta.usata === 'es-ES', JSON.stringify(a.scelta));

  // [B] Niente es-ES: si ripiega sulla stessa lingua, e il pannello lo DICE.
  const b = await prova(browser, [INGLESE, MESSICO], 'es-ES');
  log('[B] Senza es-ES si ripiega su es-MX, mai sull\'inglese',
    b.scelta.come === 'ripiego' && b.scelta.usata === 'es-MX', JSON.stringify(b.scelta));
  log('[B] ...e il Pannello Admin dice «chiesta es-ES, usata es-MX», marcato come ripiego',
    !!b.riga && b.riga.voce === 'ripiego' && b.riga.testo.indexOf('es-ES') !== -1 && b.riga.testo.indexOf('es-MX') !== -1,
    JSON.stringify(b.riga));

  // [C] IL CASO PIU' DIVERSO: nessuna voce spagnola. Niente, non l'inglese.
  const c = await prova(browser, [INGLESE], 'es-ES');
  log('[C] Nessuna voce della lingua: nessuna voce scelta (non l\'inglese)',
    c.scelta.come === 'nessuna' && c.scelta.nome === null, JSON.stringify(c.scelta));
  log('[C] ...e il pannello lo dice', !!c.riga && c.riga.voce === 'nessuna', JSON.stringify(c.riga));

  // [D] Un sistema che scrive `es_ES` col trattino basso conta come esatto.
  const d = await prova(browser, [INGLESE, MESSICO, SPAGNA_UNDERSCORE], 'es-ES');
  log('[D] `es_ES` col trattino basso è la varietà esatta, non un ripiego',
    d.scelta.come === 'esatta' && d.scelta.nome === 'Android es', JSON.stringify(d.scelta));

  // [E] L'inglese non è cambiato: la preferita inglese vince ancora.
  const e = await prova(browser, [SPAGNA, INGLESE], 'en-US');
  log('[E] Inglese: vince ancora la preferita «Google US English»',
    e.scelta.come === 'preferita' && e.scelta.nome === 'Google US English', JSON.stringify(e.scelta));

  // [F] Un override VECCHIO del pannello (un elenco, le voci inglesi) non
  // rimette la voce inglese allo spagnolo.
  const f = await prova(browser, [INGLESE, SPAGNA], 'es-ES',
    { speech: { preferredVoiceNames: ['Google US English'] } });
  log('[F] Un elenco salvato prima del 2026-10-01 vale solo per l\'inglese: lo spagnolo resta spagnolo',
    f.scelta.usata === 'es-ES', JSON.stringify(f.scelta));

  const errori = [a, b, c, d, e, f].reduce((t, x) => t.concat(x.errori), []);
  log('[G] Nessun errore JS', errori.length === 0, errori.join(' | '));

  await browser.close();
  console.log('\n=== VOCE DELL\'EDIZIONE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
