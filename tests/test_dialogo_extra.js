// PROTEGGE: che il suono di fine barra suoni UNA volta sola, a barra finita e
// piu' piano; che Ascolta e Ripeti resti a tocco libero; l'eccezione della
// regola 16 (un tocco a vuoto non interrompe l'audio col countdown, toccare la
// battuta si'); e da 2026-09-19 L'ETICHETTA SOPRA LA BOLLA del Dialogo.
//
// COME, sull'etichetta, perche' la strada ovvia non basta: il confronto NON
// usa un elenco scritto qui. Le etichette attese si derivano da
// `speakerLabels` del file episodio e i nomi scelti da `slotValues()`, cioe'
// dalle due sorgenti che l'app stessa legge. *Un elenco scritto a mano dentro
// un test e' un campione, e un campione sceglie chi non guardare.*
const { launchBrowser, APP_URL, attendiPrimaSchermata } = require('./test-env');
const { attendiVisibile } = require('./attese');
const { gradeOf, stepsBefore, slotValues } = require('./module-order');
const { loadGrade, loadEpisode } = require('./quiz-driver');
const { openModule } = require('./map-driver');
const BASE = APP_URL;

// Gli id delle battute vengono dai dati, non scritti a mano: erano fissati a
// "d1"/"d2" e si sono rotti tutti insieme appena il file episodio è passato
// alla struttura a gradi. Il primo e il secondo elemento del grado D sono
// quello che a questi test serve davvero.
const BATTUTE = loadGrade('D');
const D1 = BATTUTE[0].id;
const D2 = BATTUTE[1].id;

// Le etichette attese vengono dal file episodio, non da qui: `speakerLabels`
// e' la sorgente che `speakerLabel()` legge (regola 4, passo 9).
const ETICHETTE = loadEpisode().speakerLabels;
// I nomi scelti — «Marco», «Chiara» — coi valori predefiniti, cioe' quelli che
// vede un utente di test. Servono a una sola asserzione, ed e' quella che
// distingue «Papa'» da «Marco».
const NOMI_SCELTI = Object.keys(slotValues()).map(k => slotValues()[k].it);

const mockInit = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speak(utter) { if (utter.onstart) utter.onstart(); setTimeout(() => { if (utter.onend) utter.onend(); }, 25); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function bootAsUser(page, userName, completedModules) {
  await page.goto(BASE);
  // ⚠️ L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): senza questa attesa, «non c'e' il campo del nome» e «non
  // c'e' ancora niente» si leggono uguali, e il test clicca un pulsante che
  // non e' ancora comparso. Vedi `attendiPrimaSchermata` in test-env.js.
  await attendiPrimaSchermata(page);
  var onboardingVisible = await page.isVisible('#name-input').catch(() => false);
  if (!onboardingVisible) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', userName);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(({ userName, completedModules }) => {
    localStorage.setItem(BI.customizeSeenKey('gate', userName), '1');
    localStorage.setItem(BI.moduleProgressKey('gate', userName), JSON.stringify({ completed: completedModules }));
    localStorage.setItem('baseinglese:introDismissed:mappaEpisodio:' + userName, '1');
  }, { userName, completedModules });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

// Un mock in cui cancel() FA quello che fa un motore vero: chiude
// l'utterance in corso e ne chiama onend, in modo asincrono (CLAUDE.md
// regola 19 — un mock che finisce all'istante nasconde proprio i bug che
// dipendono dall'ordine degli eventi). Serve ai due test qui sotto, dove
// tutto il punto è cosa succede quando l'audio viene interrotto.
const mockConCancelVero = () => {
  class FakeUtterance { constructor(text) { this.text = text; } }
  const fakeSynth = {
    speaking: false, _current: null, _t: null,
    speak(utter) {
      this.speaking = true; this._current = utter;
      if (utter.onstart) utter.onstart();
      this._t = setTimeout(() => this._finish(utter), 400);
    },
    _finish(utter) {
      if (this._current !== utter) return;
      clearTimeout(this._t);
      this.speaking = false; this._current = null;
      if (utter.onend) utter.onend();
    },
    cancel() { const u = this._current; if (u) setTimeout(() => this._finish(u), 0); },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake Male Voice', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  // ============ Countdown sound: fires once, at bar end, correct freq/volume, no ticking ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'CountdownSoundTester', stepsBefore('dialogoRipetiATempo'));
    await page.evaluate(() => {
      window.APP_CONFIG.dialogo.pausaBase = 200;
      window.APP_CONFIG.dialogo.pausaPerParola = 10;
      window.APP_CONFIG.dialogo.pausaMassima = 500;
    });
    // Capture oscillator frequencies + gain values played.
    await page.evaluate(() => {
      const OrigAC = window.AudioContext || window.webkitAudioContext;
      if (!OrigAC) { window.__noAudioCtx = true; return; }
      window.__playedTones = [];
      const OrigCreateOscillator = OrigAC.prototype.createOscillator;
      const OrigCreateGain = OrigAC.prototype.createGain;
      OrigAC.prototype.createOscillator = function () {
        const osc = OrigCreateOscillator.call(this);
        let freq = null;
        Object.defineProperty(osc.frequency, 'value', {
          set(v) { freq = v; },
          get() { return freq; }
        });
        osc.__getFreq = () => freq;
        window.__pendingOsc = osc;
        return osc;
      };
      OrigAC.prototype.createGain = function () {
        const gain = OrigCreateGain.call(this);
        const origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
        gain.gain.setValueAtTime = function (v, t) {
          if (window.__pendingOsc) {
            window.__playedTones.push({ freq: window.__pendingOsc.__getFreq(), volume: v, t: performance.now() });
          }
          return origSetValueAtTime(v, t);
        };
        return gain;
      };
    });
    await openModule(page, 'dialogoRipetiATempo');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForTimeout(40); // audio ends, bar starts (fast config)
    const tonesBeforeBarEnds = await page.evaluate(() => window.__playedTones.length);
    // d1 = 10 words -> pausaBase(200) + 10*pausaPerParola(10) = 300ms bar.
    await page.waitForFunction(() => window.__playedTones && window.__playedTones.length > 0, { timeout: 3000 });
    const tones = await page.evaluate(() => window.__playedTones);
    console.log('    DEBUG tones:', JSON.stringify(tones));
    const countdown = await page.evaluate(() => window.APP_CONFIG.sound.events.countdown);
    const countdownTones = tones.filter(t => t.freq === countdown.freq);
    log('Countdown tone (660Hz) plays exactly once when the bar ends', countdownTones.length === 1);
    // ⚠️ IL CONFRONTO NON PUO' LEGGERE LA FONTE, E IL MOTIVO E' UN DIFETTO
    // DELL'APP, non del test: `sound.events.corretto` NON HA una chiave
    // `volume`. Il suo volume viene dal default di `sfxPlayTone`
    // (index.html: `volume === undefined ? 0.15 : volume`), cioe' da un numero
    // SCRITTO FISSO NEL CODICE — che la regola 3 vieta. Finche' quel default
    // non entra in APP_CONFIG, qui non c'e' niente da leggere.
    //
    // L'etichetta vecchia diceva «piu' basso di Corretto/Sbagliato default
    // (0.15)» ed era falsa due volte: `sbagliato.volume` e' 0.22, non 0.15, e
    // 0.15 non compare in CONFIG da nessuna parte.
    const DEFAULT_SFX_PLAY_TONE = 0.15; // non e' una copia di CONFIG: e' il default scritto in sfxPlayTone, e non e' leggibile da fuori
    log('Il volume del countdown (' + countdown.volume + ') e\' piu\' basso del default di sfxPlayTone (' + DEFAULT_SFX_PLAY_TONE + ')',
      countdownTones.length === 1 && countdownTones[0].volume === countdown.volume && countdown.volume < DEFAULT_SFX_PLAY_TONE);
    log('No ticking during the bar itself (nothing played before it finished)', tonesBeforeBarEnds === 0);
    log('No JS errors', errors.length === 0);
    await page.close();
  }

  // ============ Regression: mod1 (Ascolta e Ripeti) still works after dgLockAll/dgPlayLine unification ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'Mod1Regression', stepsBefore('dialogoAscoltaRipeti'));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    const watchVisible = await attendiVisibile(page, '#dialogo-watch-btn');
    const helpVisible = await attendiVisibile(page, '#dialogo-help-btn');
    log('[Regression] Mod1 still shows full header (Mappa/Spiegazione/Help)', watchVisible && helpVisible);
    const toolbarVisible = await page.evaluate(() => !document.getElementById('dg-toolbar').hidden);
    const toggleExists = await page.evaluate(() => !!document.getElementById('dg-translations-toggle'));
    log('[Regression] Mod1 still shows the translations toggle', toolbarVisible && toggleExists);
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForTimeout(10); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — nel profilo a tocco libero le ALTRE bolle NON devono bloccarsi
    const midAudio = await page.evaluate(([id1, id2]) => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="' + id1 + '"]');
      var b2 = document.querySelector('.dg-bubble[data-line-id="' + id2 + '"]');
      return { b1Active: b1.classList.contains('is-active'), b2Locked: b2.classList.contains('is-locked') };
    }, [D1, D2]);
    // Correction (5th collaudo): Ascolta e Ripeti has no countdown to
    // desync, and its own instructions promise free tapping in any order
    // — dgLockAll no longer locks OTHER bubbles for this profile (only
    // Ripeti a Tempo/Continuo still do). b1 still lifts (is-active).
    log('[Regression] Mod1 lifts the playing bubble but no longer locks others (free-tap profile)', midAudio.b1Active && !midAudio.b2Locked);
    // ATTESA-LEGITTIMA: meta' di quello che si verifica qui e' una cosa che NON deve
    // esserci — la bolla non piu' attiva e senza barra del countdown (profilo
    // countdown:false). L'assenza di due classi non si aspetta: si da' il tempo perche'
    // comparissero e si guarda che non ci siano.
    await page.waitForTimeout(60); // ATTESA-LEGITTIMA: prova che due classi NON ci sono piu' dopo l'audio
    const afterAudio = await page.evaluate((id1) => {
      var b1 = document.querySelector('.dg-bubble[data-line-id="' + id1 + '"]');
      var check = document.getElementById('dg-heard-' + id1);
      return { b1Active: b1.classList.contains('is-active'), b1Timer: b1.classList.contains('dg-bubble-timer'), checkVisible: check && !check.hidden };
    }, D1);
    log('[Regression] Mod1 unlocks right after audio (no countdown bar, countdown:false)', !afterAudio.b1Active && !afterAudio.b1Timer);
    log('[Regression] Mod1 checkmark still appears', afterAudio.checkVisible);
    await page.click('#dg-translations-toggle');
    await attendiVisibile(page, '.dg-translation:not([hidden])');
    // Quante sono le battute lo dice il grado che il modulo legge, non un
    // numero scritto qui: il dialogo e' passato da 7 a 12 battute.
    const quante = loadGrade(gradeOf('dialogoAscoltaRipeti')).length;
    const translationsShown = await page.$$eval('.dg-translation', (els, n) => els.length === n && els.every(e => !e.hidden), quante);
    log('[Regression] Mod1 translations toggle rivela tutte le ' + quante + ' traduzioni', translationsShown);
    log('[Regression] No JS errors on Mod1', errors.length === 0);
    await page.close();
  }

  // ============ [Etichetta] L'etichetta sopra la bolla, nel DIALOGO ============
  //
  // ⚠️ NASCE DA UN BUCO MISURATO, non da un difetto: il 2026-09-19, facendo
  // tornare a `speakerLabel` l'id tecnico invece dell'etichetta,
  // `test_story_modules` andava 92/93 e QUESTO FILE restava 20/20. La funzione
  // ha due lettori — Meet the Story e i tre Dialogue — e solo il primo ne
  // guardava l'effetto visibile.
  //
  // Le tre righe non sono ridondanti, e il motivo e' la diagnosi (⓪-octies):
  // la prima cade su TUTTI e tre i guasti, la seconda e la terza dicono QUALE
  // delle due decisioni didattiche della regola 4 si e' rotta —
  //   «l'etichetta porta il CONTORNO, non il solo mestiere»
  //   «l'etichetta di un personaggio personalizzabile NON porta il nome scelto»
  // — invece di lasciar leggere un rosso solo e cercarne la causa a mano.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockInit);
    await bootAsUser(page, 'EtichettaBolla', stepsBefore('dialogoAscoltaRipeti'));
    await openModule(page, 'dialogoAscoltaRipeti');
    await page.waitForFunction(() => document.getElementById('dg-start-btn') && !document.getElementById('dg-start-btn').disabled);
    await page.click('#dg-start-btn');
    // L'approdo e' la PRIMA bolla disegnata, non un tempo: le etichette
    // esistono da quando il markup c'e', e nessuna delle asserzioni qui sotto
    // legge questo effetto (regola 44).
    //
    // ⚠️ IL `try` NON E' PRUDENZA GENERICA: senza, se le bolle non arrivassero
    // il file MORIREBBE con un TimeoutError invece di stampare tre righe rosse
    // (⓪-septies), e in una corsa parallela si legge come «non e' partito».
    let letto = [];
    let arrivo = '';
    try {
      // ⚠️ IL CONTENITORE E' `.dg-item`, NON `.dg-bubble`, e non e' un
      // dettaglio di selettore: l'etichetta e' SORELLA della bolla, non figlia
      // — la bolla e' un `<button>` e il nome sta FUORI, cosi' non finisce nel
      // testo del bersaglio del tocco. Misurato: il primo giro cercava
      // `.dg-bubble .dg-name` e trovava ZERO con nove nomi a schermo.
      await page.waitForFunction(n => document.querySelectorAll('.dg-item').length === n,
        BATTUTE.length, { timeout: 15000 });
      letto = await page.$$eval('.dg-item', items => items.map(it => ({
        id: (it.querySelector('.dg-bubble') || {}).getAttribute
          ? it.querySelector('.dg-bubble').getAttribute('data-line-id') : null,
        nome: (it.querySelector('.dg-name') || {}).textContent
      })));
    } catch (e) {
      arrivo = ' — le bolle non sono arrivate: ' + await page.evaluate(() => ({
        item: document.querySelectorAll('.dg-item').length,
        bolle: document.querySelectorAll('.dg-bubble').length,
        nomi: document.querySelectorAll('.dg-name').length,
        errore: !document.getElementById('load-error-screen') || document.getElementById('load-error-screen').hidden ? 'no' : 'schermata d\'errore'
      })).then(JSON.stringify).catch(() => 'pagina illeggibile');
    }

    // ── ① Ogni bolla mostra l'etichetta del file episodio ───────────────
    // Il confronto e' su TUTTE le bolle, non sulla prima: il caso piu' diverso
    // non e' la battuta piu' complicata, e' il personaggio con l'etichetta piu'
    // lunga («Hostess al gate») accanto a quello personalizzabile («Papa'»).
    const atteso = {};
    BATTUTE.forEach(b => { atteso[b.id] = ETICHETTE[b.speaker] || b.speaker; });
    const sbagliate = letto.filter(x => x.nome !== atteso[x.id]);
    log('[Etichetta] Ogni bolla del Dialogo mostra l\'etichetta del file episodio' + arrivo
      + (sbagliate.length ? ' — sbagliate: ' + sbagliate.map(x => x.id + ': "' + x.nome + '" invece di "' + atteso[x.id] + '"').join(' · ') : ''),
      letto.length === BATTUTE.length && sbagliate.length === 0);

    // ── ② Il CONTORNO, non il solo mestiere ────────────────────────────
    // «Hostess al gate», mai «Hostess». Si guarda solo chi un contorno ce l'ha
    // (etichetta di piu' di una parola), derivato dal file: se un giorno
    // nessuna ne avesse, la riga lo dice invece di passare verde a vuoto.
    const conContorno = Object.keys(ETICHETTE).filter(k => ETICHETTE[k].indexOf(' ') !== -1);
    const contornoIntero = conContorno.every(k =>
      letto.some(x => x.nome === ETICHETTE[k]) || !BATTUTE.some(b => b.speaker === k));
    log('[Etichetta] L\'etichetta porta il contorno intero, non il solo mestiere ('
      + conContorno.length + ' con contorno)',
      conContorno.length > 0 && contornoIntero);

    // ── ③ Il nome scelto sta nella BATTUTA, non sopra la bolla ─────────
    // «Papa'», mai «Marco». I nomi scelti vengono da slotValues(), cioe' dalle
    // tabelle di personalizzazione: e' il guasto del 2026-09-09, quando
    // `dialogueSpeakers` risolveva il nome dentro l'etichetta.
    const conNome = letto.filter(x => NOMI_SCELTI.indexOf(x.nome) !== -1);
    log('[Etichetta] Nessuna etichetta porta il nome scelto'
      + (conNome.length ? ' — ' + conNome.map(x => x.id + ': "' + x.nome + '"').join(' · ') : ''),
      conNome.length === 0);

    log('[Etichetta] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ Chi risponde al tocco durante l'audio (Ripeti a Tempo) ============
  {
    // Prima era invertito: un tocco a vuoto sullo schermo interrompeva
    // l'audio e faceva partire il countdown in anticipo, mentre toccare la
    // battuta — il gesto con un significato — non faceva niente.
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockConCancelVero);
    await bootAsUser(page, 'TapTester', stepsBefore('dialogoRipetiATempo'));
    await openModule(page, 'dialogoRipetiATempo');
    await page.click('#dg-start-btn');
    await page.waitForTimeout(150);

    // Parte l'audio della prima battuta, poi si tocca lo SFONDO.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForFunction(() => window.speechSynthesis.speaking === true, null, { timeout: 5000 });
    await page.click('#dg-list', { position: { x: 2, y: 2 } });
    await page.waitForTimeout(120); // ATTESA-LEGITTIMA: verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — un tocco a vuoto NON deve interrompere l'audio (regola 16, l'eccezione dei profili con countdown)
    const dopoSfondo = await page.evaluate(id => ({
      parla: window.speechSynthesis.speaking,
      barra: !!document.querySelector('.dg-bubble[data-line-id="' + id + '"]').classList.contains('dg-bubble-timer')
    }), D1);
    log('[Tocco] Un tocco a vuoto NON interrompe l\'audio', dopoSfondo.parla === true);
    log('[Tocco] Un tocco a vuoto NON fa partire il countdown', dopoSfondo.barra === false);

    // Ora si tocca la battuta che sta parlando: l'audio salta e parte la barra.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"]');
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('dg-bubble-timer');
    }, D1, { timeout: 5000 });
    const dopoBattuta = await page.evaluate(() => window.speechSynthesis.speaking);
    log('[Tocco] Toccare la battuta in corso salta l\'audio', dopoBattuta === false);
    log('[Tocco] Toccare la battuta in corso fa partire il countdown', true);

    // Ora la barra sta scorrendo: toccare di nuovo la bolla — il testo, non
    // la barra — chiude il conto alla rovescia e porta alla battuta dopo.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"] .dg-english');
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('is-active');
    }, D2, { timeout: 5000 });
    log('[Tocco] Con la barra in corso, toccare la bolla porta alla battuta dopo', true);
    log('[Tocco] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  // ============ La barra del tempo si tocca per andare avanti (Dialogo Continuo) ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(mockConCancelVero);
    await bootAsUser(page, 'BarraTester', stepsBefore('dialogoContinuo'));
    await openModule(page, 'dialogoContinuo');
    await page.evaluate(() => {
      // Barra lunga: senza, finirebbe da sola prima che il test la tocchi.
      window.APP_CONFIG.dialogo.pausaBase = 30000;
      window.APP_CONFIG.dialogo.pausaPerParola = 0;
      window.APP_CONFIG.dialogo.pausaMassima = 30000;
      window.APP_CONFIG.dialogo.countdownStepMs = 10;
    });
    // Dialogo Continuo apre con "Pronto? Via!" sullo stesso pulsante di
    // avvio degli altri profili, poi il 3-2-1 parte da solo.
    await page.click('#dg-start-btn');
    // Il 3-2-1, poi l'audio della prima battuta, poi la sua barra.
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('dg-bubble-timer');
    }, D1, { timeout: 15000 });

    // Si tocca il TESTO della battuta, non la barra: l'area sensibile è
    // tutta la bolla, perché centrare una striscia alta pochi pixel col dito
    // è quasi impossibile.
    await page.click('.dg-bubble[data-line-id="' + D1 + '"] .dg-english');
    // Toccata la bolla, si deve sentire la battuta SUCCESSIVA.
    await page.waitForFunction(id => {
      const b = document.querySelector('.dg-bubble[data-line-id="' + id + '"]');
      return b && b.classList.contains('is-active');
    }, D2, { timeout: 5000 });
    const stato = await page.evaluate(a => ({
      barraPrima: document.querySelector('.dg-bubble[data-line-id="' + a.d1 + '"]').classList.contains('dg-bubble-timer'),
      attivaDopo: document.querySelector('.dg-bubble[data-line-id="' + a.d2 + '"]').classList.contains('is-active')
    }), { d1: D1, d2: D2 });
    log('[Barra] Toccare la bolla (non la barra) chiude il countdown', stato.barraPrima === false);
    log('[Barra] Toccare la bolla porta alla battuta successiva', stato.attivaDopo === true);
    log('[Barra] Nessun errore JS', errors.length === 0);
    await page.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log('\n=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length + ' passed ===');
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(' - ' + f.msg)); process.exit(1); }
}

run().catch(e => { console.error(e); process.exit(1); });
