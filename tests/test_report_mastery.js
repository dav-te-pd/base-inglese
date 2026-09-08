// PROTEGGE: che il pannello dei colori delle voci mostri quello che c'è
// davvero nel magazzino, ordinato per chiave, e soprattutto che LEGGA E
// BASTA. È uno strumento per guardare un dato che a schermo non compare da
// nessun'altra parte: se mostrasse un numero sbagliato nessuno potrebbe
// accorgersene confrontandolo con qualcosa, perché non c'è nient'altro con
// cui confrontarlo.
//
// L'asserzione che conta di più è la terza: aprire il pannello non deve
// cambiare un solo byte della mastery. Un report che modifica quello che
// misura è peggio di nessun report — e qui il rischio è concreto, perché la
// funzione carica lo store con la stessa loadMastery() che usano i tre
// scrittori, a un carattere di distanza da un saveMastery().
//
// ORDINE PER CHIAVE: non è estetica, è il punto del pannello. Le righe della
// stessa voce (a-hello in Match Practice en→it, in it→en, in Flash Card)
// devono finire vicine, altrimenti la cosa che il pannello esiste per far
// vedere — che la stessa parola ha colori diversi per esercizio e direzione —
// resta invisibile in mezzo a righe sparse.
//
// LIMITE DICHIARATO: il pannello non mostra QUANTE VOLTE una voce è stata
// scritta, e questo test non lo verifica, perché quel dato non esiste: una
// voce di mastery è { level, streak } e nessuno dei tre scrittori tiene un
// contatore.

const { launchBrowser, APP_URL } = require('./test-env');

const BASE = APP_URL;
const UTENTE = 'ReportMastery';

// Colori scritti a mano nella forma esatta dei tre scrittori veri: due
// esercizi diversi e due direzioni sulla stessa voce (a-hello), più le due
// posizioni di una battuta di Voice Practice.
const COLORI = {
  'quickmatch:a-hello:it-en': { level: 'rosso', streak: 0 },
  'voicepractice:d-1:1': { level: 'verde', streak: 1 },
  'quickmatch:a-hello:en-it': { level: 'verde', streak: 0 },
  'flashcard-A:a-hello:en-it': { level: 'giallo', streak: 1 },
  'voicepractice:d-1:0': { level: 'rosso', streak: 0 },
  'speedround:c-1:en-it': { level: 'giallo', streak: 0 }
};

async function apriPannello(page, colori) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', UTENTE);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  if (colori) {
    await page.evaluate(({ utente, colori }) => {
      localStorage.setItem('baseinglese:mastery:episode1:' + utente, JSON.stringify(colori));
    }, { utente: UTENTE, colori });
    await page.reload();
    await page.waitForSelector('#go-episode', { state: 'visible' });
  }
  // Il pannello si apre digitando "config" fuori da un campo di testo.
  for (const ch of 'config') await page.keyboard.press(ch);
  await page.waitForSelector('#config-mastery', { state: 'visible', timeout: 10000 });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const errori = [];

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push(String(e).slice(0, 160)));
    await apriPannello(page, COLORI);

    const stato = await page.evaluate(() => {
      const el = document.getElementById('config-mastery');
      return {
        chiavi: Array.from(el.querySelectorAll('.config-mastery-key')).map(x => x.textContent),
        livelli: Array.from(el.querySelectorAll('.config-mastery-level')).map(x => x.getAttribute('data-level')),
        testo: el.innerText
      };
    });

    const attese = Object.keys(COLORI);
    log('[Report] Mostra una riga per ogni voce del magazzino',
        stato.chiavi.length === attese.length && attese.every(k => stato.chiavi.indexOf(k) !== -1));

    const ordinate = stato.chiavi.slice().sort();
    log('[Report] Le righe sono ordinate per chiave, cosi\' la stessa voce sta vicino a se\' stessa',
        JSON.stringify(stato.chiavi) === JSON.stringify(ordinate));

    // La cosa che l'ordinamento esiste per far vedere: tre righe di a-hello
    // consecutive, con colori diversi.
    const primaHello = stato.chiavi.findIndex(k => k.indexOf('a-hello') !== -1);
    const quanteHello = stato.chiavi.filter(k => k.indexOf('a-hello') !== -1).length;
    const consecutive = stato.chiavi.slice(primaHello, primaHello + quanteHello)
      .every(k => k.indexOf('a-hello') !== -1);
    log('[Report] Le righe della stessa voce finiscono consecutive', quanteHello === 3 && consecutive);

    log('[Report] Ogni riga porta il livello che ha nel magazzino',
        stato.chiavi.every((k, i) => stato.livelli[i] === COLORI[k].level));

    log('[Report] Il conto per livello e\' quello vero', /2 · 2 · 2/.test(stato.testo));

    // ── La terza, quella che conta: leggere non scrive ──
    const dopo = await page.evaluate(() => localStorage.getItem('baseinglese:mastery:episode1:ReportMastery'));
    log('[Report] Aprire il pannello non cambia un byte della mastery',
        dopo === JSON.stringify(COLORI));
    await page.close();
  }

  // ── Nessun colore ancora: lo dice, invece di mostrare un riquadro vuoto ──
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errori.push(String(e).slice(0, 160)));
    await apriPannello(page, null);
    const stato = await page.evaluate(() => {
      const el = document.getElementById('config-mastery');
      return { righe: el.querySelectorAll('.config-mastery-key').length, testo: el.innerText };
    });
    log('[Report] Senza colori non mostra righe ma lo dice a parole',
        stato.righe === 0 && /Nessuna voce ancora/.test(stato.testo));
    await page.close();
  }

  log('[Z] Nessun errore JS', errori.length === 0);
  if (errori.length) console.log('  ' + errori.join('\n  '));

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== REPORT MASTERY SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
