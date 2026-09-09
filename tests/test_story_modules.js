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

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const { stepsBefore } = require('./module-order');
const { loadGrade, loadEpisode } = require('./quiz-driver');

// I numeri attesi si LEGGONO dalla fonte, non si ricopiano qui. Il riquadro
// "Numeri attesi nel JSON" in testa a docs/inglese/it/inglese-it-gate.md è la dichiarazione
// (CLAUDE.md regola 26), il file dati è l'esecuzione: questo test confronta le
// due, non "ieri contro oggi".
//
// Perché non basta scriverli a mano: un numero copiato in un secondo posto
// invecchia — e in un test invecchia peggio che altrove, perché non mente in
// silenzio, rompe la CI. Sembra un controllo che funziona, mentre è un
// controllo da manutenere. È già successo: l'episodio è passato da 16 a 15
// voci nel grado A e questo file è diventato rosso senza che niente fosse
// rotto. Stessa forma di test_struttura_corso.js, che legge
// docs/inglese/it/struttura-corso.md invece di ricopiarne le tabelle.
const FONTE = 'docs/inglese/it/inglese-it-gate.md';

// Ogni numero si prende COL SUO NOME accanto, mai per posizione: se un giorno
// il riquadro viene riscritto in un altro ordine, un lettore posizionale
// accoppierebbe in silenzio il numero sbagliato al grado sbagliato — che è
// esattamente il difetto che questa funzione esiste per togliere.
function numeriAttesiDallaFonte() {
  const testo = fs.readFileSync(repoPath.apply(null, FONTE.split('/')), 'utf8');
  const i = testo.indexOf('Numeri attesi nel JSON');
  if (i === -1) throw new Error('Riquadro "Numeri attesi nel JSON" non trovato in ' + FONTE);
  // Il riquadro è una citazione markdown su più righe: si ricuce il blocco
  // finché le righe cominciano con ">", poi si tolgono i marcatori.
  const blocco = testo.slice(i).split('\n')
    .slice(0, 6)
    .filter((r, n) => n === 0 || r.trim().startsWith('>'))
    .join(' ')
    .replace(/[>*]/g, ' ');
  const prendi = (etichetta, regex) => {
    const m = blocco.match(regex);
    if (!m) throw new Error('Numero atteso non trovato in ' + FONTE + ': ' + etichetta);
    return parseInt(m[1], 10);
  };
  return {
    A: prendi('grado A', /(\d+)\s+voci nel grado A/),
    B: prendi('grado B', /(\d+)\s+in B/),
    C: prendi('grado C', /(\d+)\s+in C/),
    D: prendi('grado D', /(\d+)\s+battute in D/),
    skill: prendi('skill', /(\d+)\s+skill/),
    slot: prendi('slot', /(\d+)\s+slot/)
  };
}
// ── Il confronto testuale fra la fonte e il file dati ────────────────────────
//
// I numeri qui sopra dicono QUANTE voci ci sono. Non dicono che siano LE voci
// giuste: un episodio trascritto con "Hello" al posto di "hello" ha i conti
// perfetti e il contenuto sbagliato — è successo, ed è il difetto che questo
// blocco esiste per prendere.
//
// Le tabelle di docs/inglese/it/inglese-it-gate.md sono la fonte (regola 26), il JSON
// l'esecuzione: qui si confrontano CARATTERE PER CARATTERE.
function tabellaSotto(testo, titolo) {
  const i = testo.indexOf(titolo);
  if (i === -1) throw new Error('Titolo non trovato in ' + FONTE + ': ' + titolo);
  const righe = testo.slice(i).split('\n');
  const out = [];
  let dentro = false;
  for (let n = 1; n < righe.length; n++) {
    const r = righe[n].trim();
    const eRiga = r.startsWith('|') && r.endsWith('|');
    if (!dentro) {
      if (eRiga) dentro = true;
      else if (r.startsWith('#')) break;   // titolo successivo: nessuna tabella
      else continue;
    }
    if (!eRiga) break;
    const celle = r.slice(1, -1).split('|').map(c => c.trim().replace(/`/g, ''));
    if (celle.every(c => /^:?-+:?$/.test(c))) continue;   // riga separatrice
    out.push(celle);
  }
  if (!out.length) throw new Error('Nessuna tabella sotto "' + titolo + '" in ' + FONTE);
  return { intestazione: out[0], righe: out.slice(1) };
}

// I segnaposto si scrivono in due notazioni diverse, e apposta: il markdown usa
// il nome corto e leggibile ({figlia}), il JSON la chiave vera dello slot
// ({{figliaNome}}). Tradurli con un dizionario scritto qui vorrebbe dire
// ricopiare in un test una corrispondenza che vive altrove — il difetto che il
// riquadro dei numeri attesi esiste per non ripetere.
//
// Quindi il dizionario non si scrive: si RICAVA. Il segnaposto n-esimo di una
// riga del markdown corrisponde al segnaposto n-esimo della riga del JSON, e la
// corrispondenza deve reggere su TUTTE le righe. Uno scambio ({mamma} scritto
// dove va {papà}) rompe la coerenza e viene visto, senza che nessuno abbia
// dovuto elencare le coppie.
function scomponi(s) {
  const chiavi = [];
  const scheletro = String(s == null ? '' : s)
    .replace(/\{+([^{}]+)\}+/g, (_, k) => { chiavi.push(k.trim()); return '§'; });
  return { scheletro, chiavi };
}

function creaMappa(nome) {
  const avanti = new Map();
  const indietro = new Map();
  const rotture = [];
  return {
    rotture,
    aggiungi(da, a, dove) {
      if (avanti.has(da) && avanti.get(da) !== a) {
        rotture.push(dove + ': "' + da + '" vale "' + avanti.get(da) + '" altrove, qui "' + a + '"');
      } else if (indietro.has(a) && indietro.get(a) !== da) {
        rotture.push(dove + ': "' + a + '" corrisponde a "' + indietro.get(a) + '" altrove, qui a "' + da + '"');
      } else {
        avanti.set(da, a);
        indietro.set(a, da);
      }
    },
    get coppie() { return avanti.size; },
    nome
  };
}

function confrontaTestoConLaFonte(log) {
  const md = fs.readFileSync(repoPath.apply(null, FONTE.split('/')), 'utf8');
  const voci = g => loadGrade(g);
  const segna = creaMappa('segnaposto');
  const differenze = [];
  const confronta = (dove, atteso, trovato) => {
    if (atteso !== trovato) differenze.push(dove + '\n      fonte: ' + JSON.stringify(atteso) + '\n      json:  ' + JSON.stringify(trovato));
  };
  // Un confronto che tiene conto dei segnaposto: il testo attorno deve
  // coincidere alla lettera, le chiavi devono corrispondersi in modo coerente.
  const confrontaConSegnaposto = (dove, testoMd, testoJson) => {
    const a = scomponi(testoMd);
    const b = scomponi(testoJson);
    confronta(dove, a.scheletro, b.scheletro);
    if (a.chiavi.length !== b.chiavi.length) {
      differenze.push(dove + ': la fonte ha ' + a.chiavi.length + ' segnaposto, il json ' + b.chiavi.length);
      return;
    }
    a.chiavi.forEach((k, i) => segna.aggiungi(k, b.chiavi[i], dove));
  };

  // ── Gradi A e B: quattro colonne, nessun segnaposto, confronto secco ──
  [['A', '### Grado A'], ['B', '### Grado B']].forEach(([grado, titolo]) => {
    const t = tabellaSotto(md, titolo);
    const items = voci(grado);
    if (t.righe.length !== items.length) {
      differenze.push('grado ' + grado + ': la tabella ha ' + t.righe.length + ' righe, il json ' + items.length + ' voci');
      return;
    }
    t.righe.forEach((riga, i) => {
      const it = items[i];
      const dove = 'grado ' + grado + ' riga ' + (i + 1) + ' (' + it.id + ')';
      confronta(dove + ' inglese', riga[0], it.english);
      confronta(dove + ' italiano', riga[1], it.italian);
      confronta(dove + ' pronuncia', riga[2], it.pronunciationTip);
      confronta(dove + ' categoria', riga[3], it.grammarCategory);
    });
  });

  // ── Grado D: chi parla, il testo, e quante skill porta ogni battuta ──
  const tD = tabellaSotto(md, '### Grado D');
  const battuteMd = tD.righe;
  const battuteJson = voci('D');
  const chi = creaMappa('chi parla');
  if (battuteMd.length !== battuteJson.length) {
    differenze.push('grado D: la tabella ha ' + battuteMd.length + ' righe, il json ' + battuteJson.length);
  } else {
    battuteMd.forEach((riga, i) => {
      const it = battuteJson[i];
      const dove = 'grado D ' + riga[0] + ' (' + it.id + ')';
      chi.aggiungi(riga[1], it.speaker, dove);
      confrontaConSegnaposto(dove + ' inglese', riga[2], it.english);
      confrontaConSegnaposto(dove + ' italiano', riga[3], it.italian);
      // "1, 2" sono due skill, "—" nessuna. Il totale è già controllato dai
      // numeri attesi: qui conta che stiano sulla battuta GIUSTA.
      const attese = riga[4] === '—' ? 0 : riga[4].split(',').filter(x => x.trim()).length;
      const trovate = (it.whatYouLearn || []).length;
      if (attese !== trovate) differenze.push(dove + ': la fonte le dà ' + attese + ' skill, il json ' + trovate);
    });
  }

  // ── Grado C: le righe "= dN" non si ricopiano, si risolvono ──
  const tC = tabellaSotto(md, '### Grado C');
  const frasiJson = voci('C');
  if (tC.righe.length !== frasiJson.length) {
    differenze.push('grado C: la tabella ha ' + tC.righe.length + ' righe, il json ' + frasiJson.length);
  } else {
    tC.righe.forEach((riga, i) => {
      const it = frasiJson[i];
      const dove = 'grado C ' + riga[0] + ' (' + it.id + ')';
      const da = riga[3];                               // "d4"
      let ing = riga[1], ita = riga[2];
      const uguale = /^=\s*(d\d+)$/.exec(ing.trim());
      if (uguale) {
        const origine = battuteMd.find(r => r[0] === uguale[1]);
        if (!origine) { differenze.push(dove + ': "' + ing + '" rimanda a una battuta che non esiste'); return; }
        ing = origine[2]; ita = origine[3];
      }
      confrontaConSegnaposto(dove + ' inglese', ing, it.english);
      confrontaConSegnaposto(dove + ' italiano', ita, it.italian);
      // "d4" nella colonna "Da" è la battuta d-4 del json.
      confronta(dove + ' fromLine', da.replace(/^d/, 'd-'), it.fromLine);
    });
  }

  if (differenze.length) console.log('  ' + differenze.join('\n  '));
  log('[Fonte] Il testo del json coincide con le tabelle di ' + FONTE, differenze.length === 0);
  if (segna.rotture.length) console.log('  ' + segna.rotture.join('\n  '));
  log('[Fonte] I segnaposto della fonte e quelli del json si corrispondono sempre allo stesso modo',
      segna.rotture.length === 0 && segna.coppie > 0);
  if (chi.rotture.length) console.log('  ' + chi.rotture.join('\n  '));
  log('[Fonte] Chi parla in ogni battuta corrisponde sempre allo stesso ruolo',
      chi.rotture.length === 0 && chi.coppie > 0);
}

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
    localStorage.setItem('baseinglese:modules:gate:' + userName, JSON.stringify({ completed }));
    ['mappaEpisodio', 'meetTheStory', 'whyWeSayIt'].forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + userName, '1'));
  }, { userName, completed });
  await page.click('#go-episode');
  await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
  return completed;
}

async function openStory(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForFunction(() => document.querySelectorAll('#story-cards-body .wws-card').length > 0, null, { timeout: 20000 });
}

// Tutto lo stato che serve, letto in un'unica valutazione sincrona dentro la
// pagina (CLAUDE.md regola 19).
function readState(page) {
  return page.evaluate(() => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const visId = id => vis(document.getElementById(id));
    const cards = Array.from(document.querySelectorAll('.wws-card'));
    const regole = Array.from(document.querySelectorAll('.story-cards-explanation'));
    const selfchecks = Array.from(document.querySelectorAll('.story-cards-selfcheck'));
    return {
      battute: cards.length,
      corrente: cards.filter(c => c.classList.contains('is-current')).map(c => c.getAttribute('data-card')),
      avanti: cards.filter(c => c.classList.contains('is-ahead')).map(c => c.getAttribute('data-card')),
      skill: regole.length,
      skillIds: regole.map(r => r.getAttribute('data-skill-block')),
      titoli: Array.from(document.querySelectorAll('.story-cards-explanation-title')).map(el => el.textContent),
      titoliVisibili: Array.from(document.querySelectorAll('.story-cards-explanation-title')).filter(vis).length,
      corpiVisibili: Array.from(document.querySelectorAll('.story-cards-explanation-text')).filter(vis).length,
      selfcheckVisibili: selfchecks.filter(vis).length,
      scelti: Array.from(document.querySelectorAll('.story-cards-selfcheck-actions .btn.is-chosen')).map(b => b.getAttribute('data-skill')),
      spunte: Array.from(document.querySelectorAll('.story-cards-declared')).filter(vis).map(el => el.textContent.trim()),
      lucchetti: Array.from(document.querySelectorAll('.wws-state')).filter(el => vis(el) && !el.classList.contains('is-done')).length,
      senzaRegola: Array.from(document.querySelectorAll('.wws-no-rule')).filter(vis).length,
      pulsantiTraduzione: document.querySelectorAll('[data-toggle-translation]').length,
      preselezionati: document.querySelectorAll('.story-cards-selfcheck-actions .btn-primary').length,
      rispostaDisabilitata: Array.from(document.querySelectorAll('[data-story-cards-answer]')).filter(b => b.disabled).length,
      spunteConTesto: Array.from(document.querySelectorAll('.story-cards-declared')).filter(el => el.textContent.trim().length > 0).length,
      // Il Blocco Ascolto e la traduzione stanno DENTRO la bolla.
      audioNellaBolla: document.querySelectorAll('.wws-bubble .listen-block').length,
      sceltoColore: (() => { const b = document.querySelector('.story-cards-selfcheck-actions .btn.is-chosen'); return b ? getComputedStyle(b).backgroundColor : null; })(),
      accento: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      spunteCard: Array.from(document.querySelectorAll('.wws-state.is-done')).filter(el => el.getClientRects().length > 0).map(el => el.id),
      traduzioniVisibili: Array.from(document.querySelectorAll('.wws-italian')).filter(vis).length,
      // La traduzione sta dentro la bolla, la regola no.
      traduzioniNellaBolla: document.querySelectorAll('.wws-bubble .wws-italian').length,
      regoleNellaBolla: document.querySelectorAll('.wws-bubble .story-cards-explanation').length,
      bolleColoriDiversi: new Set(Array.from(document.querySelectorAll('.wws-card:not(.is-ahead) .wws-bubble')).map(b => getComputedStyle(b).backgroundColor)).size,
      rispostesuUnaRiga: (() => { const a = document.querySelector('.story-cards-selfcheck-actions'); return a ? getComputedStyle(a).flexDirection : null; })(),
      usciteSuUnaRiga: getComputedStyle(document.querySelector('.story-cards-complete-row')).flexDirection,
      bordoCorrente: (() => { const c = document.querySelector('.wws-card.is-current'); return c ? getComputedStyle(c).borderTopWidth : null; })(),
      completaDisabilitato: document.getElementById('story-cards-complete').disabled,
      hintVisibile: visId('story-cards-complete-hint'),
      hintTesto: (document.getElementById('story-cards-complete-hint') || {}).textContent || '',
      riprendiVisibile: visId('story-cards-resume-later'),
      skillConSegnaposto: Array.from(document.querySelectorAll('.story-cards-explanation-text, .story-cards-explanation-title'))
        .filter(el => /\{\{|\{[a-zA-Z]/.test(el.textContent)).length,
      corpiSkill: Array.from(document.querySelectorAll('.story-cards-explanation-text')).map(el => el.textContent),
      segnapostoGrezzi: Array.from(document.querySelectorAll('.wws-english, .wws-italian')).filter(el => /\{\{/.test(el.textContent)).length
    };
  });
}

// Il colore atteso per il pulsante scelto: si legge il token --accent del
// tema invece di scrivere un esadecimale qui, che cambierebbe a ogni tema.
function coloreAtteso(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return 'rgb(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ')';
}

async function dichiara(page, skillId, valore) {
  await page.locator('.story-cards-selfcheck[data-story-cards-skill="' + skillId + '"] [data-story-cards-answer="' + valore + '"]').click();
  await page.waitForFunction(id => {
    const el = document.getElementById('story-cards-declared-' + id);
    return el && el.getClientRects().length > 0;
  }, skillId, { timeout: 10000 });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  confrontaTestoConLaFonte(log);

  const battute = loadGrade('D');
  const skillIds = [];
  battute.forEach(line => (line.whatYouLearn || []).forEach((sk, i) => skillIds.push(line.id + '-s' + (i + 1))));
  const battuteConDueSkill = battute.filter(l => (l.whatYouLearn || []).length > 1);
  const battuteConSkill = battute.filter(l => (l.whatYouLearn || []).length > 0);

  // I numeri LETTI dal riquadro in testa a docs/inglese/it/inglese-it-gate.md e confrontati
  // col file dati vero (CLAUDE.md regola 29). Non sono scritti qui: se la fonte
  // e i dati divergono lo dice questo test, e non c'è niente da aggiornare a
  // mano quando l'episodio cambia.
  const attesi = numeriAttesiDallaFonte();
  console.log('[dati] fonte ' + FONTE + ': A=' + attesi.A + ' B=' + attesi.B +
    ' C=' + attesi.C + ' D=' + attesi.D + ' skill=' + attesi.skill + ' slot=' + attesi.slot);
  // Il messaggio nomina il grado E i due numeri: quando cade si legge dal log
  // che cosa non torna, senza aprire né la fonte né il file dati.
  ['A', 'B', 'C', 'D'].forEach(g => log(
    '[dati] Il grado ' + g + ' ha le voci che la fonte dichiara (' + attesi[g] + '), e ne ha ' + loadGrade(g).length,
    loadGrade(g).length === attesi[g]));
  log('[dati] Gli slot di personalizzazione sono quelli che la fonte dichiara (' + attesi.slot +
    '), e sono ' + (loadEpisode().personalizationTablesUsed || []).length,
    (loadEpisode().personalizationTablesUsed || []).length === attesi.slot);
  log('[dati] I nomi dei gradi sono quelli mostrati allo studente',
    JSON.stringify(['A', 'B', 'C', 'D'].map(g => loadEpisode().levels[g].label)) === JSON.stringify(['Parole', 'Espressioni', 'Frasi', 'Dialogo']));
  log('[dati] whatYouLearn è una lista su ogni battuta che ne ha', battute.every(l => !l.whatYouLearn || Array.isArray(l.whatYouLearn)));
  log('[dati] Le skill sono quelle che la fonte dichiara (' + attesi.skill + '), e sono ' + skillIds.length +
    ', con una sola battuta che ne porta due',
    skillIds.length === attesi.skill && battuteConDueSkill.length === 1);
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
    log('[A] Il Blocco Ascolto sta dentro la bolla', st.audioNellaBolla === battute.length);
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
    // La traduzione non si nasconde più: un click per card a chi sta
    // studiando le regole era di troppo, e il link sottolineato si leggeva
    // come un collegamento web.
    log('[B] Le traduzioni sono sempre visibili, dentro la bolla', st.traduzioniVisibili === battute.length && st.pulsantiTraduzione === 0);
    log('[B] Il Blocco Ascolto sta dentro la bolla', st.audioNellaBolla === battute.length);
    log('[B] Nessun pulsante è preselezionato all\'apertura', st.preselezionati === 0);
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
    // Accento e non verde: verde su "Sì, mi è chiara" farebbe sembrare
    // sbagliata "Non mi è chiara", che è una risposta onesta come le altre.
    log('[B] Il pulsante scelto è blu accento, non verde', st.sceltoColore === coloreAtteso(st.accento));
    log('[B] La spunta è sola, senza etichetta accanto', st.spunte.length === 1 && st.spunteConTesto === 0);
    log('[B] Si può cambiare risposta anche durante il primo giro', st.rispostaDisabilitata === 0);

    // 2026-09-09 (C.2): il magazzino tiene la risposta CORRENTE, non la somma
    // dei tocchi. Prima ogni risposta faceva +1 e nessuno toccava quella di
    // prima: una card del collaudo è arrivata a "chiara 3 · non chiara 3",
    // cioè SEI VOTI DA UNA PERSONA SOLA — e il pannello dice di sé che quel
    // numero segnala le spiegazioni da riscrivere, quindi decideva un lavoro
    // editoriale contando i ripensamenti.
    //
    // Si legge il magazzino, non il pannello: il difetto sta in cosa viene
    // SCRITTO, e un pannello che mostra bene un dato sbagliato passerebbe.
    const vociStat = () => page.evaluate((u) => {
      const raw = localStorage.getItem('baseinglese:storyCardsExplanationStats:gate:' + u);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && parsed.byLine ? { versione: parsed.versione, voce: parsed.byLine['d-1-s1'] } : null;
    }, 'Story_Why');

    const dopoPrima = await vociStat();
    log('[B/C.2] La prima risposta lascia una voce sola, senza ripensamenti',
      !!dopoPrima && !!dopoPrima.voce && dopoPrima.voce.corrente === 'chiara' &&
      dopoPrima.voce.chiara === 1 && dopoPrima.voce.cambi === 0, JSON.stringify(dopoPrima));

    await dichiara(page, 'd-1-s1', 'nonChiara');
    const dopoCambio = await vociStat();
    log('[B/C.2] Cambiare idea SPOSTA il voto: quello di prima torna a zero',
      !!dopoCambio && dopoCambio.voce.corrente === 'nonChiara' &&
      dopoCambio.voce.chiara === 0 && dopoCambio.voce.nonChiara === 1, JSON.stringify(dopoCambio));
    log('[B/C.2] ...e conta il ripensamento, che è il segnale in più',
      !!dopoCambio && dopoCambio.voce.cambi === 1, JSON.stringify(dopoCambio));

    await dichiara(page, 'd-1-s1', 'nonChiara');
    const dopoUguale = await vociStat();
    log('[B/C.2] Rispondere UGUALE non muove niente, nemmeno i ripensamenti',
      !!dopoUguale && dopoUguale.voce.cambi === 1 && dopoUguale.voce.nonChiara === 1,
      JSON.stringify(dopoUguale));

    // La somma dei tre contatori non può superare il numero di battute
    // dichiarate: se lo supera, qualcuno sta di nuovo sommando i tocchi.
    const somma = dopoUguale ? dopoUguale.voce.chiara + dopoUguale.voce.nonAncora + dopoUguale.voce.nonChiara : -1;
    log('[B/C.2] Una battuta vale UN voto in tutto, comunque la si tocchi', somma === 1,
      'somma dei tre contatori: ' + somma);

    // Si rimette "chiara" per non lasciare il resto del blocco su uno stato
    // che non ha scelto lui.
    await dichiara(page, 'd-1-s1', 'chiara');
    log('[B] Una spunta sola: la seconda skill della stessa battuta è ancora da dichiarare', st.spunte.length === 1);
    log('[B] "Ho finito" ancora bloccato con una sola dichiarata', st.completaDisabilitato === true);

    for (const id of skillIds.slice(1)) await dichiara(page, id, 'chiara');
    st = await readState(page);
    log('[B] Dichiarate tutte, "Ho finito" si sblocca', st.completaDisabilitato === false);
    log('[B] Dichiarate tutte, la riga del blocco sparisce', st.hintVisibile === false);
    log('[B] Dichiarate tutte, "Esci e riprendi dopo" sparisce', st.riprendiVisibile === false);
    log('[B] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ B1: la spunta automatica e le frasi di supporto ============
  {
    const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Story_Spunte', 'whyWeSayIt');
    await openStory(page, 'whyWeSayIt');

    // Una card senza regole non ha niente da dichiarare, ma restare senza
    // spunta mentre le altre ce l'hanno fa chiedere se è da fare. La prende
    // da sola appena la sequenza la supera, non prima.
    const senzaRegola = battute.filter(l => !(l.whatYouLearn || []).length).map(l => l.id);
    let spunte = await page.evaluate(() => Array.from(document.querySelectorAll('.wws-state.is-done')).map(el => el.id));
    log('[B1] All\'apertura nessuna card senza regola ha già la spunta',
      senzaRegola.every(id => spunte.indexOf('wws-state-' + id) === -1));

    // Dichiarate le due skill della prima battuta, la sequenza supera d-2.
    const frasi = [];
    for (const id of skillIds) {
      await dichiara(page, id, 'nonChiara');
      frasi.push(await page.$eval('#story-cards-followup-' + id, el => el.textContent));
      if (id === 'd-1-s2') {
        spunte = await page.evaluate(() => Array.from(document.querySelectorAll('.wws-state.is-done')).map(el => el.id));
        log('[B1] Superata la prima card, quella senza regole prende la spunta',
          spunte.indexOf('wws-state-' + senzaRegola[0]) !== -1);
      }
    }
    spunte = await page.evaluate(() => Array.from(document.querySelectorAll('.wws-state.is-done')).map(el => el.id));
    log('[B1] Alla fine ogni card ha la spunta, anche quelle senza regole', spunte.length === battute.length);

    // Venti varianti per risposta, e dentro lo stesso modulo non si
    // ripetono: la stessa frase tre volte suonerebbe come un automatismo.
    log('[B1] Ogni dichiarazione mostra una frase di supporto', frasi.every(f => f.trim().length > 0));
    log('[B1] Le frasi di supporto sono tutte diverse fra loro', new Set(frasi).size === frasi.length);
    log('[B1] Nessun errore JS', errors.length === 0);
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
    await page.evaluate(() => localStorage.setItem('baseinglese:gate:custom:Story_Lingue', JSON.stringify({ partenza: 'torino' })));
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
    await page.locator('#story-cards-back-map').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    await openStory(page, 'whyWeSayIt');
    let st = await readState(page);
    log('[C] Uscire da "← Mappa" non salva la dichiarazione', st.spunte.length === 0);

    await dichiara(page, 'd-1-s1', 'chiara');
    await dichiara(page, 'd-1-s2', 'nonChiara');
    await page.locator('#story-cards-resume-later').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const completato = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:modules:gate:Story_Uscite')).completed.indexOf('whyWeSayIt') !== -1);
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
    await page.locator('#story-cards-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('story-cards-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#story-cards-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const primoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:gate:Story_Ripasso')).whyWeSayIt);
    log('[D] Tutte chiare -> 100% -> verde', !!primoEsito && primoEsito.pct === 100 && primoEsito.level === 'verde');

    await openStory(page, 'whyWeSayIt');
    let st = await readState(page);
    log('[D] Al ripasso non c\'è una card corrente: sono tutte raggiungibili', st.corrente.length === 0 && st.avanti.length === 0);
    log('[D] Al ripasso si legge il corpo di ogni regola', st.corpiVisibili === attesi.skill);
    log('[D] Al ripasso restano accese tutte le risposte date', st.scelti.length === attesi.skill);
    log('[D] Al ripasso ogni regola dichiarata porta la sua spunta', st.spunte.length === attesi.skill);
    log('[D] Al ripasso "Ho finito" è subito disponibile', st.completaDisabilitato === false);
    log('[D] Al ripasso "Esci e riprendi dopo" non compare', st.riprendiVisibile === false);

    // Cambiare idea su una: 10 chiare su 11 -> 91% -> verde, e l'esito viene riscritto.
    // Al ripasso le regole sono già tutte leggibili: non c'è niente da
    // riaprire, si cambia direttamente la risposta.
    await dichiara(page, 'd-1-s1', 'nonChiara');
    await page.locator('#story-cards-complete').click();
    await page.waitForFunction(() => {
      const el = document.getElementById('story-cards-summary-screen');
      return el && el.getClientRects().length > 0;
    }, null, { timeout: 10000 });
    await page.locator('#story-cards-complete-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#module-list [data-module]').length > 0);
    const secondoEsito = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('baseinglese:moduleOutcome:gate:Story_Ripasso')).whyWeSayIt);
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
