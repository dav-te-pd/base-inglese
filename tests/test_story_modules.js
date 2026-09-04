// I due moduli nati dallo stesso componente della storia: Meet the Story
// (primo contatto) e Why We Say It (le regole).
//
// Prima erano un modulo solo, "Speak Easy". Quel nome non descriveva più
// nessuno dei due, e le due esigenze erano opposte: nel primo contatto
// nascondere la traduzione non allena nessuno — non c'è ancora niente di
// studiato da cui dedurre il senso — mentre nel modulo delle regole la
// traduzione dietro il pulsante è proprio l'esercizio.
//
// I due profili stanno in CONFIG.story.profiles e il componente legge di lì
// (translations: 'always' | 'onDemand', skills: false | true), quindi qui si
// verifica il COMPORTAMENTO dei due profili, non che esistano due funzioni.
//
// Le skill sono quelle vere dell'episodio, non iniettate: whatYouLearn è una
// LISTA, e la prima battuta ne porta due ("Hello e Hi", "Nice to meet you").
// È il caso che la struttura a lista esiste per reggere, quindi è quello che
// il test deve attraversare davvero.

const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');
const { loadGrade, loadEpisode } = require('./quiz-driver');
const BASE = APP_URL;

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

async function bootAsUser(page, userName, moduleId) {
  await page.goto(BASE);
  if (!(await page.isVisible('#name-input').catch(() => false))) {
    await page.click('#switch-user');
    await page.waitForSelector('#name-input');
  }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode');
  const completed = stepsBefore(moduleId);
  await page.evaluate(({ userName, completed }) => {
    localStorage.setItem('baseinglese:modules:episode1:' + userName, JSON.stringify({ completed }));
    ['mappaEpisodio', 'meetTheStory', 'whyWeSayIt'].forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1'));
  }, { userName, completed });
  await page.click('#go-episode');
  await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
  return completed;
}

async function openStory(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForFunction(() => document.querySelectorAll('#speak-easy-body .wws-card').length > 0, null, { timeout: 20000 });
}

// Tutto lo stato che serve, letto in un'unica valutazione sincrona dentro la
// pagina (CLAUDE.md regola 19).
function readState(page) {
  return page.evaluate(() => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const visId = id => vis(document.getElementById(id));
    const cards = Array.from(document.querySelectorAll('.wws-card'));
    const regole = Array.from(document.querySelectorAll('.se-explanation'));
    const selfchecks = Array.from(document.querySelectorAll('.se-selfcheck'));
    return {
      battute: cards.length,
      corrente: cards.filter(c => c.classList.contains('is-current')).map(c => c.getAttribute('data-card')),
      avanti: cards.filter(c => c.classList.contains('is-ahead')).map(c => c.getAttribute('data-card')),
      skill: regole.length,
      skillIds: regole.map(r => r.getAttribute('data-skill-block')),
      titoli: Array.from(document.querySelectorAll('.se-explanation-title')).map(el => el.textContent),
      titoliVisibili: Array.from(document.querySelectorAll('.se-explanation-title')).filter(vis).length,
      corpiVisibili: Array.from(document.querySelectorAll('.se-explanation-text')).filter(vis).length,
      selfcheckVisibili: selfchecks.filter(vis).length,
      scelti: Array.from(document.querySelectorAll('.se-selfcheck-actions .btn.is-chosen')).map(b => b.getAttribute('data-skill')),
      spunte: Array.from(document.querySelectorAll('.se-declared')).filter(vis).map(el => el.textContent.trim()),
      lucchetti: Array.from(document.querySelectorAll('.wws-state')).filter(el => vis(el) && !el.classList.contains('is-done')).length,
      senzaRegola: Array.from(document.querySelectorAll('.wws-no-rule')).filter(vis).length,
      pulsantiTraduzione: document.querySelectorAll('[data-toggle-translation]').length,
      traduzioniVisibili: Array.from(document.querySelectorAll('.wws-italian')).filter(vis).length,
      // La traduzione sta dentro la bolla, la regola no.
      traduzioniNellaBolla: document.querySelectorAll('.wws-bubble .wws-italian').length,
      regoleNellaBolla: document.querySelectorAll('.wws-bubble .se-explanation').length,
      bolleColoriDiversi: new Set(Array.from(document.querySelectorAll('.wws-card:not(.is-ahead) .wws-bubble')).map(b => getComputedStyle(b).backgroundColor)).size,
      rispostesuUnaRiga: (() => { const a = document.querySelector('.se-selfcheck-actions'); return a ? getComputedStyle(a).flexDirection : null; })(),
      usciteSuUnaRiga: getComputedStyle(document.querySelector('.se-complete-row')).flexDirection,
      bordoCorrente: (() => { const c = document.querySelector('.wws-card.is-current'); return c ? getComputedStyle(c).borderTopWidth : null; })(),
      completaDisabilitato: document.getElementById('speak-easy-complete').disabled,
      hintVisibile: visId('speak-easy-complete-hint'),
      hintTesto: (document.getElementById('speak-easy-complete-hint') || {}).textContent || '',
      riprendiVisibile: visId('speak-easy-resume-later'),
      skillConSegnaposto: Array.from(document.querySelectorAll('.se-explanation-text, .se-explanation-title'))
        .filter(el => /\{\{|\{[a-zA-Z]/.test(el.textContent)).length,
      corpiSkill: Array.from(document.querySelectorAll('.se-explanation-text')).map(el => el.textContent),
      segnapostoGrezzi: Array.from(document.querySelectorAll('.wws-english, .wws-italian')).filter(el => /\{\{/.test(el.textContent)).length
    };
  });
}

async function dichiara(page, skillId, valore) {
  await page.locator('.se-selfcheck[data-se-skill="' + skillId + '"] [data-se-answer="' + valore + '"]').click();
  await page.waitForFunction(id => {
    const el = document.getElementById('se-declared-' + id);
    return el && el.getClientRects().length > 0;
  }, skillId, { timeout: 10000 });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  const battute = loadGrade('D');
  const skillIds = [];
  battute.forEach(line => (line.whatYouLearn || []).forEach((sk, i) => skillIds.push(line.id + '-s' + (i + 1))));
  const battuteConDueSkill = battute.filter(l => (l.whatYouLearn || []).length > 1);
  const battuteConSkill = battute.filter(l => (l.whatYouLearn || []).length > 0);

  // I numeri dichiarati in docs/episodio-1.md, verificati sul file dati vero
  // (CLAUDE.md regola 29): se l'episodio viene ridiviso, qui si vede subito.
  const attesi = { A: 16, B: 7, C: 10, D: 9, skill: 8 };
  ['A', 'B', 'C', 'D'].forEach(g => log('[dati] Il grado ' + g + ' ha ' + attesi[g] + ' voci', loadGrade(g).length === attesi[g]));
  log('[dati] I nomi dei gradi sono quelli mostrati allo studente',
    JSON.stringify(['A', 'B', 'C', 'D'].map(g => loadEpisode().levels[g].label)) === JSON.stringify(['Parole', 'Espressioni', 'Frasi', 'Dialogo']));
  log('[dati] whatYouLearn è una lista su ogni battuta che ne ha', battute.every(l => !l.whatYouLearn || Array.isArray(l.whatYouLearn)));
  log('[dati] Le skill sono ' + attesi.skill + ' e la prima battuta ne porta due', skillIds.length === attesi.skill && battuteConDueSkill.length === 1);
  log('[dati] Ogni skill ha titolo e corpo separati', battute.every(l => (l.whatYouLearn || []).every(s => !!s.title && !!s.body)));

  // ============ A: Meet the Story — primo contatto ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Meet', 'meetTheStory');
    await openStory(page, 'meetTheStory');
    const st = await readState(page);
    log('[A] Meet the Story mostra tutte le battute', st.battute === battute.length);
    log('[A] Le traduzioni sono tutte già visibili', st.traduzioniVisibili === battute.length);
    log('[A] Non c\'è nessun pulsante "Mostra traduzione"', st.pulsantiTraduzione === 0);
    log('[A] Non compare nessuna skill, anche se le battute ne hanno', st.skill === 0);
    log('[A] "Ho finito" è subito cliccabile (completionRules)', st.completaDisabilitato === false);
    log('[A] Non compare la riga che spiega il blocco', st.hintVisibile === false);
    log('[A] Non compare "Esci e riprendi dopo"', st.riprendiVisibile === false);
    log('[A] Nessun segnaposto {{...}} rimasto grezzo', st.segnapostoGrezzi === 0);
    log('[A] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ B: Why We Say It — primo giro, sequenza obbligata ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Why', 'whyWeSayIt');
    await openStory(page, 'whyWeSayIt');

    let st = await readState(page);
    log('[B] Le traduzioni partono nascoste, dietro il loro pulsante', st.traduzioniVisibili === 0 && st.pulsantiTraduzione === battute.length);
    log('[B] C\'è un riquadro per skill, non per battuta', st.skill === attesi.skill);
    log('[B] Gli id delle skill sono quelli attesi, in ordine di dialogo', JSON.stringify(st.skillIds) === JSON.stringify(skillIds));
    log('[B] Una card per battuta, impilate', st.battute === battute.length);
    log('[B] La traduzione sta dentro la bolla', st.traduzioniNellaBolla === battute.length);
    log('[B] La regola sta FUORI dalla bolla, a tutta larghezza', st.regoleNellaBolla === 0);
    log('[B] Tutte le bolle hanno lo stesso colore: la posizione basta a dire chi parla', st.bolleColoriDiversi === 1);
    log('[B] I tre pulsanti stanno sulla stessa riga', st.rispostesuUnaRiga === 'row');
    log('[B] Le due uscite stanno affiancate', st.usciteSuUnaRiga === 'row');
    log('[B] La card corrente ha il bordo accento da 2px', st.bordoCorrente === '2px');
    log('[B] Le battute senza skill non hanno riquadro né segno di stato', st.senzaRegola === battute.length - battuteConSkill.length);
    log('[B] La prima battuta porta due skill distinte', st.skillIds[0] === 'd-1-s1' && st.skillIds[1] === 'd-1-s2');
    log('[B] Ogni regola porta il proprio titolo', st.titoli[0] !== st.titoli[1] && st.titoli[0].length > 0);
    log('[B] La card della prima skill è quella corrente', st.corrente.length === 1 && st.corrente[0] === 'd-1');
    // Sblocco Sequenziale: le card successive restano VISIBILI, non nascoste.
    log('[B] Di ogni regola si vede il titolo, anche di quelle più avanti', st.titoliVisibili === attesi.skill);
    log('[B] Il corpo si legge solo della regola corrente', st.corpiVisibili === 1);
    log('[B] I pulsanti ci sono solo sulla regola corrente', st.selfcheckVisibili === 1);
    log('[B] Le card più avanti sono attenuate e col lucchetto', st.avanti.length > 0 && st.lucchetti === st.avanti.length);
    log('[B] "Ho finito" è bloccato', st.completaDisabilitato === true);
    log('[B] La riga che spiega il blocco è visibile e viene dai dati', st.hintVisibile === true && st.hintTesto.length > 0);
    log('[B] "Esci e riprendi dopo" è disponibile', st.riprendiVisibile === true);

    log('[B] Nessun segnaposto rimasto grezzo nelle skill', st.skillConSegnaposto === 0);

    // La seconda skill della PRIMA battuta: dichiarare la prima non deve
    // valere anche per lei — è il motivo per cui ha un id proprio.
    await dichiara(page, 'd-1-s1', 'chiara');
    st = await readState(page);
    log('[B] Dichiarata la prima, tocca alla seconda della stessa battuta', st.corrente[0] === 'd-1' && st.corpiVisibili === 2);
    log('[B] Il pulsante scelto resta acceso', st.scelti.length === 1 && st.scelti[0] === 'd-1-s1');
    log('[B] Una spunta sola: la seconda skill della stessa battuta è ancora da dichiarare', st.spunte.length === 1 && st.spunte[0].indexOf('Chiara') !== -1);
    log('[B] "Ho finito" ancora bloccato con una sola dichiarata', st.completaDisabilitato === true);

    for (const id of skillIds.slice(1)) await dichiara(page, id, 'chiara');
    st = await readState(page);
    log('[B] Dichiarate tutte, "Ho finito" si sblocca', st.completaDisabilitato === false);
    log('[B] Dichiarate tutte, la riga del blocco sparisce', st.hintVisibile === false);
    log('[B] Dichiarate tutte, "Esci e riprendi dopo" sparisce', st.riprendiVisibile === false);
    log('[B] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ B2: una lingua per segnaposto, dentro la stessa skill ============
  {
    // Con Mondovì (il predefinito) le due lingue coincidono e non si
    // vedrebbe niente: si sceglie Torino, che in inglese è Turin. La skill
    // cita la frase inglese dentro una spiegazione italiana, quindi lo
    // stesso slot deve rendere "Turin" nella citazione e "Torino" nella
    // prosa — è tutto il motivo per cui esiste {{chiave:en}}.
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Lingue', 'whyWeSayIt');
    await page.evaluate(() => localStorage.setItem('baseinglese:episode1:custom:Story_Lingue', JSON.stringify({ partenza: 'torino' })));
    await page.reload();
    await page.waitForSelector('#go-episode');
    await page.click('#go-episode');
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    await openStory(page, 'whyWeSayIt');
    const st2 = await readState(page);
    const skillPartenza = st2.corpiSkill.find(t => t.indexOf('vuol dire "vengo da') !== -1) || '';
    log('[B2] La citazione inglese usa il valore inglese ("Turin")', skillPartenza.indexOf('I am from Turin') !== -1);
    log('[B2] La prosa italiana usa il valore italiano ("Torino")', skillPartenza.indexOf('vengo da Torino') !== -1);
    log('[B2] Nessun segnaposto rimasto grezzo', st2.skillConSegnaposto === 0);
    log('[B2] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ C: "← Mappa" non salva, "Esci e riprendi dopo" sì ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Uscite', 'whyWeSayIt');

    await openStory(page, 'whyWeSayIt');
    await dichiara(page, 'd-1-s1', 'chiara');
    await page.locator('#speak-easy-back-map').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    await openStory(page, 'whyWeSayIt');
    let st = await readState(page);
    log('[C] Uscire da "← Mappa" non salva la dichiarazione', st.spunte.length === 0);

    await dichiara(page, 'd-1-s1', 'chiara');
    await dichiara(page, 'd-1-s2', 'nonChiara');
    await page.locator('#speak-easy-resume-later').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const completato = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:modules:episode1:Story_Uscite')).completed.indexOf('whyWeSayIt') !== -1);
    log('[C] "Esci e riprendi dopo" NON completa il modulo', completato === false);

    await openStory(page, 'whyWeSayIt');
    st = await readState(page);
    log('[C] Rientrando si riprende da dove si era arrivati', st.spunte.length === 2);
    log('[C] La lezione riparte dalla prima non dichiarata', st.corrente.length === 1 && st.corrente[0] === skillIds[2].replace(/-s\d+$/, ''));
    log('[C] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ D: visita di ripasso, a modulo già completato ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Ripasso', 'whyWeSayIt');

    // Primo giro completo: tutte chiare -> 100% -> verde.
    await openStory(page, 'whyWeSayIt');
    for (const id of skillIds) await dichiara(page, id, 'chiara');
    await page.locator('#speak-easy-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('speak-easy-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#speak-easy-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const primoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:Story_Ripasso')).whyWeSayIt);
    log('[D] Tutte chiare -> 100% -> verde', !!primoEsito && primoEsito.pct === 100 && primoEsito.level === 'verde');

    await openStory(page, 'whyWeSayIt');
    let st = await readState(page);
    log('[D] Al ripasso non c\'è una card corrente: sono tutte raggiungibili', st.corrente.length === 0 && st.avanti.length === 0);
    log('[D] Al ripasso si legge il corpo di ogni regola', st.corpiVisibili === attesi.skill);
    log('[D] Al ripasso restano accese tutte le risposte date', st.scelti.length === attesi.skill);
    log('[D] Al ripasso le spunte mostrano le scelte già fatte', st.spunte.length === attesi.skill);
    log('[D] Al ripasso "Ho finito" è subito disponibile', st.completaDisabilitato === false);
    log('[D] Al ripasso "Esci e riprendi dopo" non compare', st.riprendiVisibile === false);

    // Cambiare idea su una: 10 chiare su 11 -> 91% -> verde, e l'esito viene riscritto.
    // Al ripasso le regole sono già tutte leggibili: non c'è niente da
    // riaprire, si cambia direttamente la risposta.
    await dichiara(page, 'd-1-s1', 'nonChiara');
    await page.locator('#speak-easy-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('speak-easy-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#speak-easy-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const secondoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:episode1:Story_Ripasso')).whyWeSayIt);
    log('[D] Il ripasso riscrive l\'esito con la nuova percentuale', secondoEsito.pct === Math.round(((attesi.skill - 1) / attesi.skill) * 100));
    log('[D] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== STORIA (MEET/WHY) SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
