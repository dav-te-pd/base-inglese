// PROTEGGE: che dal 2026-10-13 i sottotitoli dei moduli, le etichette delle categorie e `nomiASchermo.native` vivano UNA volta sola, nel file condiviso della lingua dello studente, e che l'app li legga da lì. Senza questo file, una seconda copia nella struttura di un'edizione tornerebbe senza rumore — e la mappa mostrerebbe il testo di un file mentre chi scrive corregge l'altro. Il trascrittore si ferma se ne manca uno o ne ricompare una copia; e senza il file condiviso l'app si ferma all'avvio sulla schermata d'errore, con la frase di ultima istanza, e «Riprova» col file tornato arriva alla prima schermata.
//
// Fino a quel giorno erano 22 stringhe in ogni `struttura-corso.md`, IDENTICHE
// nelle due edizioni: 44 nel repository per 21 testi. Deciso da chi guida il
// progetto: i sottotitoli si indicizzano per `kind` (15 passi → 14 righe,
// perché i due versi di Flash Card hanno un kind solo), le categorie si
// chiamano `categorie` e non più `moduleTypes` (regola 18), `native` tiene
// chiave e percorso e cambia solo file.
//
// COME:
//   [A] il trascrittore, su testi veri alterati in memoria (i file non si
//       toccano): una riga di sottotitolo che manca, un kind che la sezione 2
//       non conosce, una categoria dell'edizione senza etichetta nel
//       condiviso, una riga `native` rimasta nella struttura, un modulo con
//       una categoria che la sezione 3 non elenca — tutti FERMANO, e dicono
//       dove. E i JSON sul disco non portano più le copie.
//   [B] l'app vera, con il file condiviso ALTERATO in volo: la mappa mostra il
//       sottotitolo e la categoria alterati, e la scritta della direzione il
//       `native` alterato. *Un confronto col file non alterato direbbe solo
//       che i due testi sono uguali, non da DOVE l'app li prende.*
//   [C] ⚠️ IL CAMBIAMENTO VISIBILE, deciso da chi guida il progetto: senza il
//       file condiviso l'app si ferma all'avvio sulla schermata d'errore —
//       con la frase di ultima istanza (regola 35), perché il file che manca
//       è proprio quello dei testi dell'errore — e con «Riprova», tornato il
//       file, arriva alla prima schermata.
//
// ⚠️ IL CASO PIÙ DIVERSO (regola 42): Flash Card, l'unico modulo con UN kind
// per DUE passi — le due righe della mappa devono mostrare lo STESSO
// sottotitolo alterato. E Your Story, l'unico in `inizio` e senza grado: la
// sua riga mostra la sola categoria, senza «· Parole».
//
// VISTO CADERE col codice e i dati di prima: [B] rosso su quattro righe, [C]
// su quattro — la sonda non intercettava niente, perché l'avvio di prima non
// chiedeva il file.
//
// LIMITE: [B] guarda l'edizione inglese. Per lo spagnolo il `native` del
// condiviso lo verifica `test_edizione_spagnola.js` [E]; sottotitoli e
// categorie sono lo stesso file, letto dallo stesso codice.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata, globCondivisi } = require('./test-env');
const { mockBrowser } = require('./mock-browser');
const T = require('./tools/trascrivi.js');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}
const sollevato = function (f) { try { f(); return null; } catch (e) { return e.message; } };
const leggi = (p) => fs.readFileSync(repoPath(p), 'utf8');
const ferma = (nome, f, attesi) => {
  const m = sollevato(f);
  log(nome, !!m && attesi.every((a) => m.indexOf(a) !== -1), String(m));
};

const ING = T.edizioni().find((e) => e.lingua === 'inglese');

function trascrittoreA() {
  const md = leggi('docs/condivisi/it/it-istruzioni-moduli.md');
  const vero = T.istruzioni('it');
  const sottotitoli = Object.keys(vero).filter((k) => vero[k] && typeof vero[k].subtitle === 'string');
  log('[A] Il file condiviso porta 14 sottotitoli, uno per kind di modulo', sottotitoli.length === 14, String(sottotitoli.length));
  log('[A] ...e Flash Card ne ha UNO, sotto il suo kind', typeof (vero.flashcard || {}).subtitle === 'string' && !!vero.flashcard.subtitle);
  log('[A] ...e le schermate (`listaEpisodi`, `mappaEpisodio`) nessuno',
    !(vero.listaEpisodi || {}).subtitle && !(vero.mappaEpisodio || {}).subtitle);
  log('[A] Le sei etichette delle categorie stanno in `categorie`',
    Object.keys(vero.categorie || {}).length === 6, JSON.stringify(vero.categorie));
  log('[A] `nomiASchermo.native` sta nel file condiviso', !!(vero.nomiASchermo || {}).native);

  // Sezione 7: una riga tolta, una riga in più.
  const senzaFlashcard = md.replace(/\n\| `flashcard` \| [^\n]*\|/, '');
  log('[A] (la riga di `flashcard` è stata tolta davvero dal testo alterato)', senzaFlashcard !== md);
  ferma('[A] Sezione 7 senza `flashcard`: ferma e nomina il kind', () => T.istruzioni('it', senzaFlashcard),
    ['sezione 7', 'senza sottotitolo', '`flashcard`']);
  const conIgnoto = md.replace('| `voiceCoach` | Metti alla prova la pronuncia |',
    '| `voiceCoach` | Metti alla prova la pronuncia |\n| `moduloFantasma` | Non esiste |');
  log('[A] (la riga in più è stata aggiunta davvero)', conIgnoto !== md);
  ferma('[A] Sezione 7 con un kind che la sezione 2 non conosce: ferma e lo nomina', () => T.istruzioni('it', conIgnoto),
    ['sezione 7', 'non conosce', '`moduloFantasma`']);

  // La struttura: il controllo incrociato con le categorie.
  const st = leggi('docs/inglese/it/inglese-it-struttura-corso.md');
  log('[A] La struttura vera passa', sollevato(() => T.struttura(ING)) === null, String(sollevato(() => T.struttura(ING))));
  const senzaQuiz = JSON.parse(JSON.stringify(vero));
  delete senzaQuiz.categorie.quiz;
  ferma('[A] Una categoria dell\'edizione senza etichetta nel condiviso: ferma e la nomina',
    () => T.struttura(ING, st, senzaQuiz), ['sezione 3', '`quiz`', 'etichetta']);
  const conNative = st.replace('| `target` | Inglese |', '| `target` | Inglese |\n| `native` | Italiano |');
  log('[A] (la riga `native` è stata aggiunta davvero)', conNative !== st);
  ferma('[A] Una riga `native` rimasta nella sezione 9: ferma e dice dove sta adesso',
    () => T.struttura(ING, conNative), ['sezione 9', '`native`', 'file condiviso']);
  const catInventata = st.replace('| `voiceCoach` | Voice Check | `quiz` |', '| `voiceCoach` | Voice Check | `esame` |');
  log('[A] (la categoria inventata è stata scritta davvero)', catInventata !== st);
  ferma('[A] Un modulo con una categoria che la sezione 3 non elenca: ferma',
    () => T.struttura(ING, catInventata), ['`voiceCoach`', '`esame`', 'sezione 3']);

  // I JSON sul disco: nessuna copia rimasta nelle edizioni.
  T.edizioni().forEach((ed) => {
    const j = JSON.parse(fs.readFileSync(T.dati(ed, 'struttura-corso'), 'utf8'));
    const nome = ed.lingua + '/' + ed.studente;
    log('[A] ' + nome + ': la struttura non porta `moduleTypes`', !('moduleTypes' in j));
    const conSottotitolo = Object.keys(j.moduleLabels || {}).filter((k) => 'subtitle' in j.moduleLabels[k]);
    log('[A] ' + nome + ': nessun `moduleLabels.*.subtitle`', Object.keys(j.moduleLabels || {}).length > 0 && conSottotitolo.length === 0,
      conSottotitolo.join(', '));
    log('[A] ' + nome + ': `nomiASchermo` porta `target` e `corso`, e non `native`',
      !!(j.nomiASchermo || {}).target && !!j.nomiASchermo.corso && !('native' in j.nomiASchermo), JSON.stringify(j.nomiASchermo));
  });
}

async function nuovaPagina(browser, alterazione) {
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await bloccaFontEsterni(page);
  await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
  const sonda = { intercettato: 0 };
  if (alterazione) {
    await page.route(globCondivisi('istruzioni-moduli.json'), async (route) => {
      sonda.intercettato++;
      if (alterazione === 'abort') return route.abort();
      const risposta = await route.fetch();
      const dati = await risposta.json();
      alterazione(dati);
      await route.fulfill({ response: risposta, body: JSON.stringify(dati) });
    });
  }
  return { page, errori, sonda };
}

async function appB(browser) {
  const ALTERATO = { flashcard: 'SOTTOTITOLO ALTERATO', inizio: 'INIZIO ALTERATO', studio: 'STUDIO ALTERATO', native: 'Italianissimo' };
  // Gli oggetti si creano se mancano: contro un file senza quelle chiavi
  // (il mondo di prima) l'alterazione deve arrivare lo stesso, e il rosso
  // deve venire dalle asserzioni — non da un'eccezione nella sonda.
  const { page, errori, sonda } = await nuovaPagina(browser, (d) => {
    d.categorie = d.categorie || {};
    d.nomiASchermo = d.nomiASchermo || {};
    d.flashcard.subtitle = ALTERATO.flashcard;
    d.categorie.inizio = ALTERATO.inizio;
    d.categorie.studio = ALTERATO.studio;
    d.nomiASchermo.native = ALTERATO.native;
  });
  await page.goto(APP_URL);
  await attendiPrimaSchermata(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', 'Condivisi');
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.click('#go-episode');
  if (await page.$('#map-intro-start-btn:visible')) await page.click('#map-intro-start-btn');
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  // Regola 49: «ho intercettato» è un'asserzione, non un commento.
  log('[B] La sonda ha intercettato il file condiviso', sonda.intercettato > 0, String(sonda.intercettato));

  const righe = await page.evaluate(() => Array.from(document.querySelectorAll('#module-list .module-row')).map((r) => ({
    id: r.getAttribute('data-module'),
    sub: (r.querySelector('.module-row-subtitle') || {}).textContent || '',
    tipo: (r.querySelector('.module-row-type') || {}).textContent || ''
  })));
  const riga = (id) => righe.find((r) => r.id === id) || {};
  log('[B] ⚠️ Flash Card, UN kind per DUE passi: tutte e due le righe mostrano il sottotitolo alterato',
    riga('flashcardATargetNative').sub === ALTERATO.flashcard && riga('flashcardANativeTarget').sub === ALTERATO.flashcard,
    JSON.stringify([riga('flashcardATargetNative').sub, riga('flashcardANativeTarget').sub]));
  log('[B] ...e un altro modulo tiene il suo (l\'alterazione non tocca altro)',
    !!riga('matchTargetNative').sub && riga('matchTargetNative').sub !== ALTERATO.flashcard, riga('matchTargetNative').sub);
  log('[B] Your Story, l\'unico in `inizio` e senza grado: mostra la sola categoria alterata',
    riga('personalizzazione').tipo === ALTERATO.inizio, riga('personalizzazione').tipo);
  log('[B] Un modulo di Studio mostra la categoria alterata, col grado dopo',
    riga('repeatAloud').tipo.indexOf(ALTERATO.studio) === 0 && riga('repeatAloud').tipo.length > ALTERATO.studio.length, riga('repeatAloud').tipo);
  const direzione = await page.evaluate(() => window.BI.etichettaDirezione('target-native'));
  log('[B] La scritta della direzione prende `native` dal file condiviso', direzione === ('Inglese → ' + ALTERATO.native).toUpperCase(), direzione);
  log('[B] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await page.close();
}

async function avvioC(browser) {
  const { page, errori, sonda } = await nuovaPagina(browser, 'abort');
  await page.goto(APP_URL);
  // Si aspetta la PRIMA delle due cose che possono succedere — l'errore o la
  // prima schermata — e poi si dice quale: con la forma di prima l'app apriva
  // la prima schermata, e questo deve essere un rosso con un nome, non un
  // timeout.
  await page.waitForFunction(() => {
    const err = document.querySelector('#view-error.is-active');
    const primo = ['#name-input', '#go-episode'].some((sel) => {
      const el = document.querySelector(sel);
      return !!el && el.getClientRects().length > 0;
    });
    return !!err || primo;
  }, undefined, { timeout: 15000 });
  log('[C] La sonda ha bloccato il file condiviso', sonda.intercettato > 0, String(sonda.intercettato));
  const stato = await page.evaluate(() => ({
    titolo: document.getElementById('load-error-title').textContent,
    ultima: window.BI.LOAD_ERROR_LAST_RESORT.title,
    errore: !!document.querySelector('#view-error.is-active'),
    nomeVisibile: ['#name-input', '#go-episode'].some((sel) => {
      const el = document.querySelector(sel);
      return !!el && el.getClientRects().length > 0;
    }),
    mappa: document.querySelectorAll('#module-list .module-row').length
  }));
  log('[C] ⚠️ Senza il file condiviso l\'app si FERMA all\'avvio: nessuna prima schermata, nessuna mappa',
    stato.errore && !stato.nomeVisibile && stato.mappa === 0, JSON.stringify(stato));
  log('[C] La schermata d\'errore parla con la frase di ultima istanza (regola 35)',
    !!stato.ultima && stato.titolo === stato.ultima, stato.titolo);
  if (stato.errore) {
    await page.unroute(globCondivisi('istruzioni-moduli.json'));
    await page.click('#load-error-retry');
    await attendiPrimaSchermata(page, 15000);
    log('[C] Tornato il file, «Riprova» arriva alla prima schermata', true);
  } else {
    log('[C] Tornato il file, «Riprova» arriva alla prima schermata', false, 'nessuna schermata d\'errore da cui riprovare');
  }
  log('[C] Nessun errore JS', errori.length === 0, errori.join(' | '));
  await page.close();
}

async function run() {
  trascrittoreA();
  const browser = await launchBrowser();
  await appB(browser);
  await avvioC(browser);
  await browser.close();
  console.log('\n=== TESTI CONDIVISI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
