// Speak Easy: le spiegazioni come lezione in sequenza.
//
// L'episodio 1 oggi non ha ancora nessun whatYouLearn, quindi il modulo va
// provato in due configurazioni: com'è davvero (nessuna spiegazione, deve
// restare il modulo di sola lettura di prima) e con delle spiegazioni
// iniettate al volo — così le regole del primo giro, dell'uscita con
// segnalibro e del ripasso sono verificate prima che il contenuto vero
// esista, invece che dopo.

const { launchBrowser, APP_URL } = require('./test-env');
const { loadEpisode } = require('./quiz-driver');
const BASE = APP_URL;

const EPISODE_FILE = 'data/a1-episodio1-inglese.json';
const BEFORE_SE = ['personalizzazione', 'repeatAloud'];

// Tre battute con spiegazione, sulle prime tre del dialogo vero: bastano a
// esercitare la sequenza (prima / in mezzo / ultima) senza dipendere da
// quante ne avrà l'episodio finito.
function episodeConSpiegazioni(episode, quante) {
  const copia = JSON.parse(JSON.stringify(episode));
  copia.levels.D.items.slice(0, quante).forEach(function (line, i) {
    line.whatYouLearn = {
      title: 'Titolo spiegazione ' + (i + 1),
      body: 'Corpo con <b>una parola in grassetto</b> numero ' + (i + 1) + '.'
    };
  });
  return copia;
}

const mockInit = () => {
  const fakeSynth = {
    speaking: false, _current: null,
    speak(u) { this.speaking = true; this._current = u; if (u.onstart) u.onstart(); u._t = setTimeout(() => { if (this._current === u) { this.speaking = false; this._current = null; } if (u.onend) u.onend(); }, 15); },
    cancel() { if (this._current) { var u = this._current; this.speaking = false; this._current = null; clearTimeout(u._t); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.onstart = null; this.onend = null; this.onerror = null; };
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  if (!(await page.isVisible('#name-input').catch(() => false))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input');
  }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode');
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed: completedModules }));
    ['mappaEpisodio', 'speakEasy'].forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1'));
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
}

async function openSpeakEasy(page) {
  await page.click('[data-module="speakEasy"]');
  await page.waitForFunction(() => document.querySelectorAll('#speak-easy-body .chat-row').length > 0, null, { timeout: 20000 });
}

// Tutto lo stato che serve, letto in un'unica valutazione sincrona dentro la
// pagina (CLAUDE.md regola 19).
function readState(page) {
  return page.evaluate(() => {
    const vis = id => { const el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
    const toggles = Array.from(document.querySelectorAll('[data-toggle-explanation]'));
    return {
      spiegazioni: toggles.length,
      toggleDisabilitati: toggles.filter(b => b.disabled).length,
      aperte: toggles.filter(b => {
        const el = document.getElementById('se-explanation-' + b.getAttribute('data-toggle-explanation'));
        return el && el.getClientRects().length > 0;
      }).map(b => b.getAttribute('data-toggle-explanation')),
      spunte: Array.from(document.querySelectorAll('.se-declared'))
        .filter(el => el.getClientRects().length > 0)
        .map(el => el.textContent.trim()),
      completaDisabilitato: document.getElementById('speak-easy-complete').disabled,
      hintVisibile: vis('speak-easy-complete-hint'),
      hintTesto: (document.getElementById('speak-easy-complete-hint') || {}).textContent || '',
      riprendiVisibile: vis('speak-easy-resume-later'),
      titoli: Array.from(document.querySelectorAll('.se-explanation-title')).map(el => el.textContent),
      grassettiNelCorpo: document.querySelectorAll('.se-explanation-text b').length
    };
  });
}

async function dichiara(page, lineId, valore) {
  await page.locator('.se-selfcheck[data-se-line="' + lineId + '"] [data-se-answer="' + valore + '"]').click();
  await page.waitForFunction(id => {
    const el = document.getElementById('se-declared-' + id);
    return el && el.getClientRects().length > 0;
  }, lineId, { timeout: 10000 });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const episode = loadEpisode();

  // ============ A: episodio SENZA spiegazioni — comportamento invariato ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'SE_Senza', BEFORE_SE);
    await openSpeakEasy(page);
    const st = await readState(page);
    log('[A] Senza spiegazioni non compare nessun "Cosa imparo qui"', st.spiegazioni === 0);
    log('[A] Senza spiegazioni "Ho finito" resta cliccabile', st.completaDisabilitato === false);
    log('[A] Senza spiegazioni non compare la riga che spiega il blocco', st.hintVisibile === false);
    log('[A] Senza spiegazioni non compare "Esci e riprendi dopo"', st.riprendiVisibile === false);
    log('[A] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ B: primo giro — sequenza obbligata ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const conTre = episodeConSpiegazioni(episode, 3);
    await page.route('**/' + EPISODE_FILE, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(conTre) }));
    await bootAsUser(page, 'SE_Primo', BEFORE_SE);
    await openSpeakEasy(page);

    let st = await readState(page);
    log('[B] Le tre battute con spiegazione hanno il pulsante', st.spiegazioni === 3);
    // Titoli e corpi stanno nel DOM per tutte e tre (i blocchi non aperti
    // sono solo nascosti), quindi se ne contano tre.
    log('[B] Il titolo ha un elemento suo, distinto dal corpo', st.titoli.length === 3 && st.titoli[0] === 'Titolo spiegazione 1');
    log('[B] Il corpo accetta HTML (il grassetto arriva come <b>)', st.grassettiNelCorpo === 3);
    log('[B] La prima spiegazione si apre da sola', st.aperte.length === 1 && st.aperte[0] === conTre.levels.D.items[0].id);
    log('[B] Le due successive sono bloccate', st.toggleDisabilitati === 2);
    log('[B] "Ho finito" è bloccato', st.completaDisabilitato === true);
    log('[B] La riga che spiega il blocco è visibile e viene dai dati', st.hintVisibile === true && st.hintTesto.length > 0);
    log('[B] "Esci e riprendi dopo" è disponibile', st.riprendiVisibile === true);

    await dichiara(page, conTre.levels.D.items[0].id, 'chiara');
    st = await readState(page);
    log('[B] Dichiarata la prima, si apre la seconda', st.aperte.length === 1 && st.aperte[0] === conTre.levels.D.items[1].id);
    log('[B] Una sola spiegazione aperta per volta', st.aperte.length === 1);
    log('[B] Resta bloccata solo la terza', st.toggleDisabilitati === 1);
    log('[B] La spunta mostra la dichiarazione fatta', st.spunte.length === 1 && st.spunte[0].indexOf('Chiara') !== -1);
    log('[B] "Ho finito" ancora bloccato con una su tre', st.completaDisabilitato === true);

    await dichiara(page, conTre.levels.D.items[1].id, 'nonAncora');
    await dichiara(page, conTre.levels.D.items[2].id, 'chiara');
    st = await readState(page);
    log('[B] Dichiarate tutte, "Ho finito" si sblocca', st.completaDisabilitato === false);
    log('[B] Dichiarate tutte, la riga del blocco sparisce', st.hintVisibile === false);
    log('[B] Dichiarate tutte, "Esci e riprendi dopo" sparisce', st.riprendiVisibile === false);
    log('[B] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ C: "← Mappa" non salva, "Esci e riprendi dopo" sì ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const conTre = episodeConSpiegazioni(episode, 3);
    await page.route('**/' + EPISODE_FILE, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(conTre) }));
    await bootAsUser(page, 'SE_Uscite', BEFORE_SE);

    await openSpeakEasy(page);
    await dichiara(page, conTre.levels.D.items[0].id, 'chiara');
    await page.locator('#speak-easy-back-map').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    await openSpeakEasy(page);
    let st = await readState(page);
    log('[C] Uscire da "← Mappa" non salva la dichiarazione', st.spunte.length === 0);

    await dichiara(page, conTre.levels.D.items[0].id, 'chiara');
    await dichiara(page, conTre.levels.D.items[1].id, 'nonChiara');
    await page.locator('#speak-easy-resume-later').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const completato = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:modules:episode1:SE_Uscite')).completed.indexOf('speakEasy') !== -1);
    log('[C] "Esci e riprendi dopo" NON completa il modulo', completato === false);

    await openSpeakEasy(page);
    st = await readState(page);
    log('[C] Rientrando si riprende da dove si era arrivati', st.spunte.length === 2);
    log('[C] La lezione riparte dalla prima non dichiarata', st.aperte.length === 1 && st.aperte[0] === conTre.levels.D.items[2].id);
    log('[C] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ D: visita di ripasso, a modulo già completato ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    const conTre = episodeConSpiegazioni(episode, 3);
    await page.route('**/' + EPISODE_FILE, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(conTre) }));
    await bootAsUser(page, 'SE_Ripasso', BEFORE_SE);

    // Primo giro completo: tutte chiare -> 100% -> verde.
    await openSpeakEasy(page);
    for (const line of conTre.levels.D.items.slice(0, 3)) await dichiara(page, line.id, 'chiara');
    await page.locator('#speak-easy-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('speak-easy-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#speak-easy-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const primoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:SE_Ripasso')).speakEasy);
    log('[D] Tutte chiare -> 100% -> verde', primoEsito.pct === 100 && primoEsito.level === 'verde');

    await openSpeakEasy(page);
    let st = await readState(page);
    log('[D] Al ripasso si apre tutto chiuso', st.aperte.length === 0);
    log('[D] Al ripasso nessuna spiegazione è bloccata', st.toggleDisabilitati === 0);
    log('[D] Al ripasso le spunte mostrano le scelte già fatte', st.spunte.length === 3);
    log('[D] Al ripasso "Ho finito" è subito disponibile', st.completaDisabilitato === false);
    log('[D] Al ripasso "Esci e riprendi dopo" non compare', st.riprendiVisibile === false);

    // Cambiare idea su una: 2 chiare su 3 -> 67% -> giallo, sovrascrive.
    await page.locator('[data-toggle-explanation="' + conTre.levels.D.items[0].id + '"]').click();
    await dichiara(page, conTre.levels.D.items[0].id, 'nonChiara');
    st = await readState(page);
    log('[D] Al ripasso si può cambiare la dichiarazione', st.spunte.filter(t => t.indexOf('Non chiara') !== -1).length === 1);
    await page.locator('#speak-easy-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('speak-easy-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#speak-easy-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const secondoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:SE_Ripasso')).speakEasy);
    log('[D] Il completamento sovrascrive l\'esito precedente', secondoEsito.pct === 67 && secondoEsito.level === 'giallo');
    log('[D] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SPEAK EASY SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); }
  return failed.length;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
