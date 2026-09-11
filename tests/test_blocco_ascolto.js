// PROTEGGE: che il Blocco Ascolto sia UN PEZZO SOLO, e che "bloccato" voglia
// dire la stessa cosa dovunque compaia.
//
// Cosa si perde senza questo file. Il Blocco Ascolto (il pulsante "ascolta" +
// le velocita') lo mostrano sei moduli. Fino al 2026-09-09 il suo markup era
// ricopiato a mano in sette punti e la coda del gestore del tocco in altri
// cinque: nessun test poteva accorgersene, perche' sette copie identiche
// passano tutti i verdi — e sei copie identiche piu' una diversa pure. Il
// difetto che questo comporta non e' "l'app non funziona": e' "in un modulo si
// vede diverso dagli altri", e per vederlo bisogna guardare i sei punti
// affiancati, cosa che nessuna suite fa.
//
// COME, e sono due strade diverse per due domande diverse.
//
// ① La domanda "sono tutti uguali?" NON si risponde guardando i moduli uno per
//    uno: si risponde guardando che il markup abbia UNA SOLA sorgente. Se
//    esiste in un posto solo, l'uguaglianza non e' una cosa da verificare, e'
//    una cosa che non puo' non essere vera. Quindi la prima asserzione legge
//    index.html COME TESTO e conta le occorrenze del markup del pulsante:
//    dev'essere una, dentro renderListenBlock.
//
//    ⚠️ LIMITE E COSTO DICHIARATI. Questa asserzione aggiunge una terza
//    dipendenza da index.html letto come testo (le altre due sono registrate
//    in docs/decisioni.md), ed e' una scelta, non una distrazione: e' l'unica
//    forma che impedisce all'OTTAVA copia di nascere. Un test che aprisse i
//    sei moduli e li confrontasse proverebbe meno — direbbe che i sei di oggi
//    si assomigliano, non che domani non se ne aggiunge un settimo a mano.
//    Il prezzo: se il markup del pulsante cambia (una classe in piu', un
//    attributo), questa riga va aggiornata. E' voluto: e' esattamente il
//    momento in cui qualcuno deve accorgersi che sta toccando un pezzo
//    condiviso.
//
// ② La domanda "il blocco si vede spento?" si risponde solo nel browser, e non
//    basta verificare che l'audio non parta — quello era gia' vero PRIMA della
//    correzione, ed e' il motivo per cui il difetto e' vissuto tanto. La
//    guardia funzionava; il pulsante restava a opacita' piena in una card
//    sbiadita, e cambiava sotto il dito. Quindi qui si guarda l'opacita'
//    calcolata e pointer-events, non il silenzio.
//
// E la riga che tiene insieme le due varianti dello Sblocco Sequenziale
// (regola 30): in Why We Say It e nel Dialogo "bloccato" dev'essere inerte
// ALLO STESSO MODO — stessa classe, stesso pointer-events. Quello che resta
// diverso apposta e' l'aspetto, e infatti qui non si asserisce nulla sulle
// opacita' esatte: solo che il blocco sia piu' spento del suo stato normale.
//
// LIMITE DICHIARATO: dei sei moduli qui se ne aprono due (Why We Say It per il
// blocco pieno e lo stato spento, Match Practice it→en per il Mini). Gli altri
// quattro sono coperti dall'asserzione ①, che e' piu' forte del confronto a
// campione — ma se un modulo smettesse di CHIAMARE renderListenBlock, e quindi
// non mostrasse piu' il blocco affatto, qui non si vedrebbe. Quel caso lo
// prendono i test dei singoli moduli (test_batch16, test_batch17,
// test_story_modules, legacy/test_qm), che cercano il pulsante per selettore.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');
const { stepsBefore, stepIds } = require('./module-order');
const { attendiVisibile } = require('./attese');

const BASE = APP_URL;
const UTENTE = 'BloccoAscoltoTest';
let passed = 0, failed = 0;
function log(name, ok, extra) {
  if (ok) { passed++; console.log('  PASS  ' + name); }
  else { failed++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}

const mockVoce = () => {
  class FakeUtterance { constructor(t) { this.text = t; this.onstart = null; this.onend = null; } }
  const finta = {
    speaking: false, _u: null, detti: [],
    speak(u) { this.detti.push(u.text); this.speaking = true; this._u = u; if (u.onstart) u.onstart(); setTimeout(() => { if (this._u === u) { this.speaking = false; this._u = null; } if (u.onend) u.onend(); }, 20); },
    cancel() { this.speaking = false; this._u = null; },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Finta', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: finta, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
};

async function apriPasso(page, passo) {
  await page.goto(BASE);
  // Dal secondo giro in poi il nome e' gia' salvato e la schermata di
  // benvenuto non compare: si guarda cosa c'e' a schermo invece di dare per
  // scontato di essere al primo giro.
  const daNominare = await page.evaluate(() => {
    const el = document.getElementById('name-input');
    return !!el && el.getClientRects().length > 0;
  });
  if (daNominare) {
    await page.fill('#name-input', UTENTE);
    await page.click('#onboarding-form button[type=submit]');
  }
  await page.waitForSelector('#go-episode');
  await page.evaluate(function (a) {
    localStorage.setItem('baseinglese:modules:gate:' + a.utente, JSON.stringify({ completed: a.prima }));
    a.kinds.forEach(function (k) { localStorage.setItem('baseinglese:introDismissed:' + k + ':' + a.utente, '1'); });
  }, {
    utente: UTENTE,
    prima: stepsBefore(passo),
    kinds: ['mappaEpisodio'].concat(stepIds().map(function (id) { return id.replace(/-\d+$/, ''); }))
  });
  await page.click('#go-episode');
  await page.waitForFunction(function () { return document.querySelectorAll('#module-list [data-module]').length > 0; });
  await page.click('[data-module="' + passo + '"]');
  // ⚠️ L'asserzione a cui il censimento aveva attaccato questi 700 ms legge
  // `index.html` DA DISCO e non tocca il browser: non c'entrava niente. Questa
  // attesa serve ai blocchi che vengono DOPO, quelli che guardano la pagina.
  //
  // L'approdo e' generico perche' `passo` e' un parametro: non si puo' nominare
  // la vista del modulo, ma si puo' aspettare che UNA vista diversa dalla mappa
  // sia attiva — showView() ne tiene attiva esattamente una. Non e' quello che
  // nessuna asserzione legge per caso: nessun blocco di questo file guarda
  // `is-active` (CLAUDE.md regola 44).
  await attendiVisibile(page, '[id^="view-"].is-active:not(#view-map)');
}

(async () => {
  // ---------------------------------------------------------------
  // ① UNA SOLA SORGENTE (index.html come testo)
  // ---------------------------------------------------------------
  const sorgente = fs.readFileSync(repoPath('index.html'), 'utf8');

  const markupPulsante = /class="btn btn-secondary btn-sm listen-block-btn"/g;
  const quante = (sorgente.match(markupPulsante) || []).length;
  log('[1] Il markup del pulsante esiste in UN punto solo (renderListenBlock)', quante === 1,
    'trovate ' + quante + ' occorrenze: qualcuno ha ricopiato il Blocco Ascolto invece di chiamarlo');

  // Il nome vecchio non deve tornare: portava il prefisso di Repeat Aloud
  // addosso a un pezzo usato da sei moduli (regola 18). Si cerca la forma
  // che comparirebbe nel markup o in un selettore, non la parola nuda —
  // il commento storico in cima al CSS la nomina apposta e resta.
  const vecchie = (sorgente.match(/["'.]repeat-listen-btn|["'.]repeat-item-audio/g) || []).length;
  log('[1] I nomi vecchi non sono tornati in un markup o in un selettore', vecchie === 0,
    'trovate ' + vecchie + ' occorrenze di .repeat-listen-btn / .repeat-item-audio');

  const bloccoUnico = (sorgente.match(/function renderListenBlock\(/g) || []).length === 1 &&
                      (sorgente.match(/function speakListenBlock\(/g) || []).length === 1;
  log('[1] Il componente e il suo gestore sono definiti una volta sola', bloccoUnico);

  // La coda del gestore era ricopiata in cinque punti: leggere data-rate e
  // chiamare toggleSpeak. Ora quella coppia vive solo dentro speakListenBlock.
  const codeSparse = (sorgente.match(/getAttribute\('data-rate'\)/g) || []).length;
  log('[1] La lettura di data-rate avviene in un punto solo', codeSparse === 1,
    'trovate ' + codeSparse + ' letture: la coda del gestore e\' di nuovo ricopiata');

  // ---------------------------------------------------------------
  // ② LO STATO SPENTO (browser)
  // ---------------------------------------------------------------
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(mockVoce);

  await apriPasso(page, 'whyWeSayIt');

  const wws = await page.evaluate(() => {
    const num = v => parseFloat(v) || 0;
    const libera = document.querySelector('#story-cards-body .wws-card:not(.is-ahead)');
    const bloccata = document.querySelector('#story-cards-body .wws-card.is-ahead');
    const leggi = card => {
      if (!card) return null;
      const blocco = card.querySelector('.listen-block');
      const btn = card.querySelector('.listen-block-btn');
      if (!blocco || !btn) return { blocco: false };
      const sCard = getComputedStyle(card);
      return {
        blocco: true,
        pointerEvents: sCard.pointerEvents,
        tapLocked: card.classList.contains('is-tap-locked'),
        opacitaBlocco: num(getComputedStyle(blocco).opacity),
        velocita: card.querySelectorAll('.rate-group .rate-btn').length
      };
    };
    return { libera: leggi(libera), bloccata: leggi(bloccata) };
  });

  log('[2] Una card libera mostra il Blocco Ascolto', !!(wws.libera && wws.libera.blocco));
  if (wws.libera && wws.libera.blocco) {
    log('[2] ...con le sue velocita\'', wws.libera.velocita > 0, 'velocita trovate: ' + wws.libera.velocita);
    log('[2] ...a piena opacita\'', wws.libera.opacitaBlocco === 1, 'opacita: ' + wws.libera.opacitaBlocco);
    log('[2] ...e la card risponde al dito', wws.libera.pointerEvents !== 'none');
  }

  log('[3] Esiste una card bloccata da guardare', !!(wws.bloccata && wws.bloccata.blocco));
  if (wws.bloccata && wws.bloccata.blocco) {
    // Le tre righe che descrivono il difetto corretto il 2026-09-09.
    log('[3] La card bloccata porta .is-tap-locked', wws.bloccata.tapLocked === true);
    log('[3] ...quindi NON risponde al dito', wws.bloccata.pointerEvents === 'none',
      'pointer-events: ' + wws.bloccata.pointerEvents);
    log('[3] ...e il Blocco Ascolto si vede SPENTO, non a opacita\' piena',
      wws.bloccata.opacitaBlocco < 1,
      'opacita del blocco dentro una card bloccata: ' + wws.bloccata.opacitaBlocco);
  }

  // La guardia JS resta, e non e' ridondante con pointer-events: quella e' una
  // difesa cosmetica che un click sintetico attraversa (regola 20). Qui si
  // bussa proprio come lo farebbe un click sintetico.
  const parlatoDopoTocco = await page.evaluate(() => {
    const btn = document.querySelector('#story-cards-body .wws-card.is-ahead .listen-block-btn');
    if (!btn) return null;
    const prima = window.speechSynthesis.detti.length;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return { prima: prima, dopo: window.speechSynthesis.detti.length };
  });
  if (parlatoDopoTocco) {
    log('[3] La guardia regge anche a un click sintetico (pointer-events non basta)',
      parlatoDopoTocco.dopo === parlatoDopoTocco.prima,
      'ha parlato: ' + JSON.stringify(parlatoDopoTocco));
  }

  // ---------------------------------------------------------------
  // ③ IL MINI, che e' l'unica forma diversa e resta diversa apposta
  // ---------------------------------------------------------------
  await apriPasso(page, 'matchItaEng');
  await page.click('#qm-start-btn').catch(() => {});
  await page.waitForTimeout(500);

  const mini = await page.evaluate(() => {
    const righe = Array.from(document.querySelectorAll('#qm-options .qm-option-row'));
    return {
      righe: righe.length,
      conPulsante: righe.filter(r => r.querySelector('.listen-block-btn')).length,
      conVelocita: righe.filter(r => r.querySelector('.rate-group')).length,
      conAttributoSuo: righe.filter(r => r.querySelector('[data-qm-listen-index]')).length
    };
  });

  log('[4] Ogni opzione it→en ha il suo Mini Blocco Ascolto', mini.righe > 0 && mini.conPulsante === mini.righe,
    JSON.stringify(mini));
  log('[4] Il Mini NON porta le velocita\' (e\' la sua differenza, non un errore)', mini.conVelocita === 0,
    'righe con .rate-group: ' + mini.conVelocita);
  log('[4] Il Mini porta data-qm-listen-index, non data-say', mini.conAttributoSuo === mini.righe,
    JSON.stringify(mini));

  // ---------------------------------------------------------------
  // ④ LE DUE VARIANTI DELLO SBLOCCO SEQUENZIALE SPENGONO UGUALE
  // ---------------------------------------------------------------
  await apriPasso(page, 'dialogoRipetiATempo');
  await page.click('#dg-start-btn').catch(() => {});
  await page.waitForTimeout(600);

  const dialogo = await page.evaluate(() => {
    const avanti = document.querySelector('.dg-bubble.is-ahead-locked');
    if (!avanti) return null;
    return {
      tapLocked: avanti.classList.contains('is-tap-locked'),
      pointerEvents: getComputedStyle(avanti).pointerEvents
    };
  });

  if (dialogo) {
    log('[5] Anche la bolla bloccata del Dialogo porta .is-tap-locked', dialogo.tapLocked === true);
    log('[5] ...con lo stesso pointer-events di Why We Say It', dialogo.pointerEvents === 'none',
      'pointer-events: ' + dialogo.pointerEvents);
  } else {
    // Non si finge un verde: se lo stato non si e' presentato, si dice.
    log('[5] Nel Dialogo si e\' raggiunta una bolla bloccata da guardare', false,
      'nessuna .dg-bubble.is-ahead-locked a schermo');
  }

  log('[6] Nessun errore JS', errors.length === 0, errors.join(' | '));

  await page.close();
  await browser.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed === 0 ? 0 : 1);
})();
