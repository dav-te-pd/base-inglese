// PROTEGGE: la promessa dello Sblocco Sequenziale — un passo più avanti della
// sequenza NON risponde a niente. Senza questo file la sequenza torna a essere
// solo un effetto grafico: la card sembra spenta, ma il pulsante dentro
// funziona ancora e l'audio parte lo stesso, che è esattamente il difetto
// trovato al collaudo nella variante per dichiarazione (Why We Say It) mentre
// quella per ascolto (Ripeti a Tempo) era già a posto.
//
// Le due varianti restano separate apposta (CLAUDE.md regola 30): markup e CSS
// diversi, stessa idea. Questo file le prova ENTRAMBE nello stesso modo, ed è
// il posto in cui il "chi ne tocca una guardi l'altra" diventa una misura
// invece che una raccomandazione.
//
// COME: non si elencano i pulsanti da provare — si clicca TUTTO quello che c'è
// dentro il passo bloccato, qualunque cosa sia. Un elenco scritto qui
// proteggerebbe i pulsanti di oggi e lascerebbe scoperto il primo che qualcuno
// aggiunge domani, che è come il difetto è nato.
//
// LIMITE DICHIARATO: qui si guarda il passo BLOCCATO. Che il passo corrente
// funzioni è verificato solo quanto basta a non far passare questo file su
// un'app in cui non funziona niente (la controprova in fondo a ogni blocco);
// il comportamento pieno dei due moduli sta in test_story_modules.js e
// test_dialogo_extra.js.

const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');

const BASE = APP_URL;

// Una sintesi vocale finta che si limita a CONTARE: qui non interessa cosa
// dice, interessa se ha aperto bocca.
const mockVoce = () => {
  class FakeUtterance { constructor(t) { this.text = t; } }
  window.__detti = [];
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speaking: false, _cur: null,
    speak(u) { window.__detti.push(u.text); this.speaking = true; this._cur = u;
      if (u.onstart) u.onstart();
      u._t = setTimeout(() => { if (this._cur === u) { this.speaking = false; this._cur = null; } if (u.onend) u.onend(); }, 20); },
    cancel() { if (this._cur) { const u = this._cur; this.speaking = false; this._cur = null; clearTimeout(u._t); } },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function apriModulo(page, utente, moduleId) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(({ utente, completed, moduleId }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + utente, JSON.stringify({ completed }));
    ['mappaEpisodio', 'personalizzazione', moduleId]
      .forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + utente, '1'));
  }, { utente, completed: stepsBefore(moduleId), moduleId });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  await page.click('[data-module="' + moduleId + '"]');
}

// Clicca ogni cosa cliccabile dentro il passo bloccato, più il passo stesso, e
// risponde alla sola domanda che conta: è cambiato qualcosa?
//
// Nota sul metodo: i click partono da dentro la pagina, non da page.click().
// Playwright si rifiuta di cliccare un elemento che ritiene coperto o inerte —
// e qui l'inerzia è proprio la cosa da misurare: usare page.click() farebbe
// fallire il test per il motivo sbagliato, o peggio lo farebbe passare senza
// che nessun click sia mai partito (CLAUDE.md regola 37).
function provaAToccare(page, selettorePasso) {
  return page.evaluate((sel) => {
    const passo = document.querySelector(sel);
    if (!passo) return { errore: 'nessun passo bloccato trovato con ' + sel };
    const prima = {
      html: passo.innerHTML,
      detti: window.__detti.length,
      classi: passo.className,
      bloccatiTotali: document.querySelectorAll(sel.split(' ').pop()).length
    };
    const bersagli = Array.from(passo.querySelectorAll('button, [data-say], [role="button"], [data-toggle-translation]'));
    bersagli.push(passo);   // e il passo stesso: nel Dialogo l'area sensibile è tutta la bolla
    bersagli.forEach(el => el.click());
    return {
      quantiCliccati: bersagli.length,
      audioPartito: window.__detti.length > prima.detti,
      htmlCambiato: passo.innerHTML !== prima.html,
      classiCambiate: passo.className !== prima.classi
    };
  }, selettorePasso);
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const errori = [];

  // ── Variante per dichiarazione: Why We Say It ────────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
    page.on('pageerror', e => errori.push('whyWeSayIt: ' + String(e).slice(0, 140)));
    await page.addInitScript(mockVoce);
    await apriModulo(page, 'SbloccoWws', 'whyWeSayIt');
    await page.waitForFunction(() => document.querySelectorAll('#speak-easy-body .wws-card').length > 0,
      null, { timeout: 20000 });

    const quante = await page.evaluate(() => document.querySelectorAll('.wws-card.is-ahead').length);
    log('[Dichiarazione] All\'apertura ci sono card piu\' avanti della corrente', quante > 0);

    const esito = await provaAToccare(page, '.wws-card.is-ahead');
    if (esito.errore) console.log('  ' + esito.errore);
    log('[Dichiarazione] In una card piu\' avanti si e\' provato a toccare qualcosa',
        !esito.errore && esito.quantiCliccati > 1);
    log('[Dichiarazione] Nessun audio parte da una card piu\' avanti', esito.audioPartito === false);
    log('[Dichiarazione] Niente cambia dentro una card piu\' avanti',
        esito.htmlCambiato === false && esito.classiCambiate === false);

    // Controprova: la card corrente risponde. Senza questa, il file passerebbe
    // anche su un'app in cui non funziona piu' niente.
    const controprova = await page.evaluate(() => {
      const b = document.querySelector('.wws-card.is-current [data-say]');
      if (!b) return { assente: true };
      const prima = window.__detti.length;
      b.click();
      return { partito: window.__detti.length > prima };
    });
    log('[Dichiarazione] Controprova: dalla card corrente l\'audio parte', controprova.partito === true);
    await page.close();
  }

  // ── Variante per ascolto: Ripeti a Tempo ────────────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
    page.on('pageerror', e => errori.push('dialogoRipetiATempo: ' + String(e).slice(0, 140)));
    await page.addInitScript(mockVoce);
    await apriModulo(page, 'SbloccoDlg', 'dialogoRipetiATempo');
    // Il Dialogo comincia da fermo: le bolle esistono, la sequenza parte col
    // pulsante. Prima di premerlo non c'e' ancora niente di bloccato.
    await page.waitForFunction(() => {
      const b = document.getElementById('dg-start-btn');
      return b && !b.disabled;
    }, null, { timeout: 20000 });
    await page.click('#dg-start-btn');
    await page.waitForFunction(() => document.querySelectorAll('#dg-list .dg-bubble.is-ahead-locked').length > 0,
      null, { timeout: 20000 });

    const quante = await page.evaluate(() => document.querySelectorAll('.dg-bubble.is-ahead-locked').length);
    log('[Ascolto] All\'apertura ci sono bolle piu\' avanti della sequenza', quante > 0);

    const esito = await provaAToccare(page, '.dg-bubble.is-ahead-locked');
    if (esito.errore) console.log('  ' + esito.errore);
    log('[Ascolto] In una bolla piu\' avanti si e\' provato a toccare qualcosa',
        !esito.errore && esito.quantiCliccati >= 1);
    log('[Ascolto] Nessun audio parte da una bolla piu\' avanti', esito.audioPartito === false);
    log('[Ascolto] Niente cambia dentro una bolla piu\' avanti',
        esito.htmlCambiato === false && esito.classiCambiate === false);

    // La sequenza non si e' mossa: la bolla raggiungibile e' ancora la stessa.
    const fermo = await page.evaluate(() => document.querySelectorAll('.dg-bubble.is-ahead-locked').length);
    log('[Ascolto] La sequenza non avanza toccando una bolla bloccata', fermo === quante);

    // Controprova: la bolla raggiungibile risponde.
    const controprova = await page.evaluate(() => {
      const b = document.querySelector('#dg-list .dg-bubble:not(.is-ahead-locked):not(.is-locked)');
      if (!b) return { assente: true };
      const prima = window.__detti.length;
      b.click();
      return { partito: window.__detti.length > prima };
    });
    log('[Ascolto] Controprova: dalla bolla raggiungibile l\'audio parte', controprova.partito === true);
    await page.close();
  }

  log('[Z] Nessun errore JS', errori.length === 0);
  if (errori.length) console.log('  ' + errori.join('\n  '));

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== SBLOCCO SEQUENZIALE SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
