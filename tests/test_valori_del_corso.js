// PROTEGGE: che i valori degli slot di personalizzazione (i nomi della famiglia, il cognome, la città di partenza) siano DEL CORSO e non dell'episodio — il cognome scelto in `gate` è quello che si trova aprendo `aircraft-door`, invece del predefinito — e che salvare da un episodio che ha meno slot NON cancelli gli altri: il cognome cambiato in `aircraft-door` (l'unico slot che ha) lascia intatti papà, mamma, figli e partenza scelti in `gate`.
//
// Deciso da chi guida il progetto il 2026-10-30: *«la famiglia è della STORIA,
// non dell'episodio»*. Fino a quel giorno la chiave era
// `prefissoMagazzino() + episodeId + ':custom:' + utente`, e la famiglia
// cambiava cognome fra il primo episodio e il secondo.
//
// COME — sull'app vera, coi due episodi veri e le loro tabelle, chiamando le
// stesse funzioni che chiama Personalizza (`BI.loadCustomValues`,
// `BI.saveCustomValues`): leggere, cambiare un campo, salvare.
//   [A] scelto in `gate`, si ritrova in `aircraft-door`;
//   [B] ⚠️ IL CASO PIU' DIVERSO (regola 42): `aircraft-door` ha UN solo slot,
//       e il suo salvataggio non deve portarsi via gli altri cinque — salvare
//       sostituendo invece di fondere li cancellerebbe in silenzio;
//   [C] la chiave non porta l'episodio, e nel magazzino ce n'è una sola.
//
// VISTO CADERE, una volta per guasto: con la chiave per episodio di prima cade
// [A] (`aircraft-door` trova il predefinito); col salvataggio che sostituisce
// cade [B] (papà torna al predefinito dopo il salvataggio da `aircraft-door`).
//
// LIMITE: non passa dalla schermata di Personalizza — la guidano già
// test_tabelle_personalizzazione e test_traducibilita_per_riga. Qui conta dove
// finiscono i valori, non come si scelgono.

'use strict';

const { launchBrowser, APP_URL, bloccaFontEsterni, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  await page.goto(APP_URL);
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload();
  await attendiPrimaSchermata(page);
  const utente = 'ValoriCorso';
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });

  const r = await page.evaluate(async function (u) {
    const BI = window.BI;
    const gate = BI.EPISODES['gate'];
    const porta = BI.EPISODES['aircraft-door'];
    await BI.ensureEpisodeSlotFields(gate);
    await BI.ensureEpisodeSlotFields(porta);
    const migr = await BI.loadPersonalizationMigrations();
    // Per ogni slot, un'opzione che NON è il predefinito: altrimenti un
    // valore perso e un valore tornato al predefinito sarebbero uguali.
    const altra = function (ep, key, salta) {
      const f = ep.slotFields.find(function (x) { return x.key === key; });
      const o = (f.options || []).map(function (x) { return x.value; })
        .filter(function (v) { return v !== f.def && v !== salta; });
      return { def: f.def, scelta: o[0] };
    };
    const slotPorta = porta.slotFields.map(function (f) { return f.key; });
    const papa = altra(gate, 'papa');
    const cognome = altra(gate, 'cognome');

    // In `gate`: come fa Personalizza — legge, cambia, salva.
    const vGate = BI.loadCustomValues(gate, u, migr);
    vGate.papa = papa.scelta;
    vGate.cognome = cognome.scelta;
    BI.saveCustomValues(u, vGate);
    const inPorta = BI.loadCustomValues(porta, u, migr);
    const cognomeTrovato = inPorta.cognome;

    // In `aircraft-door`: cambia il cognome, l'unico slot che ha.
    const cognome2 = altra(porta, 'cognome', cognome.scelta);
    inPorta.cognome = cognome2.scelta;
    BI.saveCustomValues(u, inPorta);
    const gateDopo = BI.loadCustomValues(gate, u, migr);

    const chiavi = Object.keys(localStorage).filter(function (k) { return k.indexOf('custom') !== -1 && k.indexOf(u) !== -1; });
    return { slotPorta: slotPorta, papa: papa, cognome: cognome, cognome2: cognome2,
      inPorta: cognomeTrovato, gateDopo: gateDopo, chiave: BI.customValuesKey(u), chiavi: chiavi };
  }, utente);

  // ── [A] ──
  log('[A] Le opzioni scelte non sono i predefiniti (il caso distingue)',
    !!r.papa.scelta && r.papa.scelta !== r.papa.def && !!r.cognome.scelta && r.cognome.scelta !== r.cognome.def, JSON.stringify([r.papa, r.cognome]));
  log('[A] ⚠️ Il cognome scelto in gate si ritrova in aircraft-door', r.inPorta === r.cognome.scelta,
    'atteso ' + r.cognome.scelta + ', trovato ' + r.inPorta);

  // ── [B] ──
  log('[B] aircraft-door ha UN solo slot, il cognome (il caso più diverso)',
    r.slotPorta.length === 1 && r.slotPorta[0] === 'cognome', r.slotPorta.join(','));
  log('[B] ...e il suo salvataggio cambia il cognome anche per gate', r.gateDopo.cognome === r.cognome2.scelta,
    'atteso ' + r.cognome2.scelta + ', trovato ' + r.gateDopo.cognome);
  log('[B] ⚠️ ...senza cancellare il papà scelto in gate (si fonde, non si sostituisce)',
    r.gateDopo.papa === r.papa.scelta, 'atteso ' + r.papa.scelta + ', trovato ' + r.gateDopo.papa);

  // ── [C] ──
  log('[C] La chiave non porta l\'episodio', !/gate|aircraft-door/.test(r.chiave), r.chiave);
  log('[C] ...e nel magazzino ce n\'è una sola per questo studente', r.chiavi.length === 1 && r.chiavi[0] === r.chiave,
    r.chiavi.join(', '));
  log('[C] Nessun errore JS', errori.length === 0, errori[0]);

  await browser.close();
  console.log('\n=== VALORI DEL CORSO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
