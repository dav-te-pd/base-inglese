// PROTEGGE: che l'interfaccia condivisa — i due overlay, i testi letti dal
// file delle istruzioni, il sottotitolo d'esito, le stelle — viva fuori da
// index.html, e che NON si porti dietro lo stato di sessione.
//
// COSA SI PERDE SENZA QUESTO FILE. `uiText()` legge i testi dell'interfaccia
// dalla cache SENZA aspettare, ed e' chiamata da cinque regioni-modulo su
// otto; `openHowItWorksOverlay` da tutte e otto. Senza il file l'app parte,
// fa il login, apre la mappa — e il primo modulo che tocchi muore con
// `uiText is not defined`. **Non e' un'app rotta: e' un'app muta appena entri
// in un esercizio.**
//
// ⚠️ E LA RIGA CHE VALE PIU' DELLE ALTRE E' [B], il confine.
//
// Questo strato e' l'interfaccia che un modulo INDOSSA e che non sa quale
// modulo sia. La prova che il confine tiene non e' che le funzioni ci siano:
// e' che il file **non nomini lo stato di sessione**. `itemText` e' rimasta
// fuori proprio per questo — una riga sola, che pero' lega `currentEpisode` e
// `currentValues` — mentre `fillTemplate` e' entrata, perche' li prende come
// parametri. *Se un giorno qualcuno ci portasse dentro `itemText` "perche' e'
// di interfaccia", questa riga cade prima che il danno si veda.*
//
// ⚠️ IL LIMITE CHE AVEVO DICHIARATO QUI ERA UN BUCO, E LA SUITE L'HA PRESO.
// La prima versione di questo file diceva: «non verifica che i due overlay si
// chiudano con Escape — quel listener non e' di questo file». Vero, e
// irrilevante: il listener resta in index.html ma LEGGEVA `helpOverlayEl`, che
// con l'estrazione e' finito qui dentro. Ogni Escape dava
// `helpOverlayEl is not defined`, e nessuna delle diciannove righe lo vedeva.
//
// **Un limite dichiarato dice dove non guardi; non rende innocuo il fatto che
// non guardi** (regola 42). Qui il confine passava esattamente dove il test
// aveva smesso di guardare — che e' il posto dove i confini si rompono.
// Adesso [E] guida Escape sull'app vera.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');
const { verificaStruttura } = require('./strati');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  verificaStruttura(log, 'ui-condivisa', ['app', 'ui-condivisa.js'], { prima: ['app/dati.js'] });
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const righe = righeDiCodiceDi('app', 'ui-condivisa.js');

  // ── [A] LA SECONDA FILA ─────────────────────────────────────────────
  {
    const tag = html.indexOf('src="app/ui-condivisa.js"');
    const ultimaVista = html.indexOf('id="view-error"');
    const scriptPrincipale = html.indexOf('\n<script>\n(function () {');
    log('[A] Il tag arriva DOPO il markup', tag > ultimaVista, 'tag ' + tag);
    log('[A] ...e PRIMA dello script principale', tag < scriptPrincipale && scriptPrincipale > 0, 'tag ' + tag);
    // I due nodi presi a tempo di parsing sono la RAGIONE della seconda fila:
    // se un giorno sparissero, il tag potrebbe tornare in <head> e questa riga
    // dice a chi lo fa che la ragione non c'e' piu'.
    const nodiAlParsing = righe.filter(function (r) {
      return /^  var \w+ = document\.getElementById\(/.test(r);
    });
    log('[A] Due nodi presi a tempo di parsing: e\' la ragione della fila',
      nodiAlParsing.length === 2, String(nodiAlParsing.length));
  }

  // ── [B] IL CONFINE: niente stato di sessione ────────────────────────
  {
    // ⚠️ SULLE RIGHE DI CODICE. La testa del file NOMINA currentEpisode e
    // currentValues in prosa, apposta: spiega perche' itemText e' rimasta
    // fuori. Cercando nel testo, questa riga troverebbe il commento che la
    // giustifica e resterebbe verde con qualunque codice sotto.
    const sessione = ['currentEpisode', 'currentValues', 'pendingMastery', 'currentModule'];
    const trovati = sessione.filter(function (n) {
      return righe.some(function (r) { return new RegExp('(^|[^.\\w$])' + n + '\\b').test(r); });
    });
    log('[B] Non nomina nessuno stato di sessione', trovati.length === 0, trovati.join(', '));

    log('[B] itemText e\' rimasta in index.html', !righe.some(function (r) {
      return /^  function itemText\s*\(/.test(r);
    }) && righeDiCodiceDi('index.html').some(function (r) { return /^  function itemText\s*\(/.test(r); }));

    // fillTemplate entra perche' riceve episodio e valori: la prova e' la firma.
    const firma = righe.find(function (r) { return /^  function fillTemplate\s*\(/.test(r); });
    log('[B] fillTemplate li riceve come PARAMETRI', !!firma && /\(text, episode, values, lang\)/.test(firma), firma || 'non trovata');

    log('[B] Non chiama nessuna funzione di modulo', !righe.some(function (r) {
      return /\b(openRepeatAloud|openStoryCards|openVoiceCoach|openMatch|openDialogo|openSpeedMatch|openFlashcard|openCustomize)\s*\(/.test(r);
    }));
  }

  // ── [C] I QUATTRO LISTENER SONO VENUTI COL FILE ─────────────────────
  {
    // ⚠️ Senza di loro nessun errore: gli overlay semplicemente non si
    // chiuderebbero. E' il guasto MUTO di questa estrazione, quindi e' la
    // riga che serve di piu'.
    const listener = righe.filter(function (r) { return /addEventListener\('click'/.test(r); });
    log('[C] I quattro listener di chiusura sono nel file', listener.length === 4, String(listener.length));
    log('[C] E il listener di Escape NON c\'e\' (chiude anche l\'Admin)',
      !righe.some(function (r) { return /'keydown'/.test(r); }) &&
      righeDiCodiceDi('index.html').some(function (r) { return /'keydown'/.test(r); }));
  }

  // ── [D] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.fill('#name-input', 'UiCondivisa');
      await page.click('#onboarding-form button[type=submit]');
      await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
      await page.click('#go-episode');
      await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[D] L\'app arriva alla mappa', false, String(e).split('\n')[0]);
    }
    if (viva) log('[D] L\'app arriva alla mappa', true);

    // ⚠️ IL TESTO VERO, non la presenza della funzione. E' il guasto che ha
    // fatto sette file rossi il 2026-09-18: uiText tornava stringa vuota e
    // ogni struttura era al suo posto.
    const testo = viva ? await page.evaluate(function () {
      return {
        uno: window.BI.uiText('condivisi.introDontShowAgain'),
        stelle: window.BI.renderStars(2),
        livello: window.BI.moduleRulesLevel(95)
      };
    }) : null;
    log('[D] uiText restituisce un testo VERO, non stringa vuota',
      !!testo && typeof testo.uno === 'string' && testo.uno.length > 3, JSON.stringify(testo && testo.uno));
    log('[D] renderStars torna markup e moduleRulesLevel un livello',
      !!testo && /</.test(testo.stelle) && ['verde', 'giallo', 'rosso'].indexOf(testo.livello) !== -1,
      JSON.stringify(testo));

    // ── [E] ESCAPE: il confine visto da FUORI ─────────────────────────
    // ⚠️ Chi chiude non e' questo file — e' il listener rimasto in index.html,
    // che chiama `BI.chiudiOverlayAperti()`. La riga verifica proprio quello:
    // che lo strato sappia chiudere i PROPRI overlay su richiesta di chi non
    // sa quanti siano.
    const escape = viva ? await page.evaluate(function () {
      return new Promise(function (risolvi) {
        window.BI.openHelpMenu({ kind: 'repeatAloud', label: 'x' });
        var prima = document.getElementById('help-overlay').classList.contains('is-open');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        risolvi({ prima: prima, dopo: document.getElementById('help-overlay').classList.contains('is-open') });
      });
    }) : null;
    log('[E] L\'overlay Help si apre...', !!escape && escape.prima === true, JSON.stringify(escape));
    log('[E] ...e Escape lo chiude passando da BI.chiudiOverlayAperti',
      !!escape && escape.dopo === false, JSON.stringify(escape));

    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== UI CONDIVISA ESTRATTA: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
