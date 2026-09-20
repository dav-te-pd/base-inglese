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
const { verificaStruttura, posizioneTag } = require('./strati');

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
    const tag = posizioneTag(html, 'app/ui-condivisa.js');
    const ultimaVista = html.indexOf('id="view-error"');
    // ⚠️ LO SCRIPT IN LINEA NON E' PIU' UN IIFE (passo ③, 2026-09-20): in
    // `index.html` resta `window.BI.boot()` e basta. Cercare
    // `<script>\n(function () {` dava -1, e `tag < -1` e' falso — quindi
    // questa riga sarebbe rossa **per sempre, su codice giusto**. Seguita e
    // non tolta: l'invariante non e' cambiato — *questo tag deve venire prima
    // dello script che accende l'app* — e' cambiato come si trova quello
    // script. Si cerca la riga che lo accende, che e' l'unica cosa rimasta.
    const scriptPrincipale = html.indexOf('window.BI.boot();');
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

    // ⚠️ QUESTA RIGA E' CAMBIATA COL PASSO B (2026-09-19), e l'invariante
    // NON e' cambiato con lei: **`ui-condivisa` non tocca lo stato di
    // sessione.** Quello che e' cambiato e' DOVE sta l'altra meta' della
    // prova: `itemText` non e' piu' in `index.html`, e' in
    // `app/sessione.js`, insieme allo stato che va a prendere.
    //
    // *La coppia resta la stessa — `fillTemplate` qui perche' RICEVE,
    // `itemText` di la' perche' VA A PRENDERE — ed e' il criterio che ha
    // deciso entrambi i passi. Un rosso da seguire, non da correggere.*
    log('[B] itemText sta in app/sessione.js, non qui', !righe.some(function (r) {
      return /^  function itemText\s*\(/.test(r);
    }) && righeDiCodiceDi('app', 'sessione.js').some(function (r) { return /^  function itemText\s*\(/.test(r); }));

    // fillTemplate entra perche' riceve episodio e valori: la prova e' la firma.
    const firma = righe.find(function (r) { return /^  function fillTemplate\s*\(/.test(r); });
    log('[B] fillTemplate li riceve come PARAMETRI', !!firma && /\(text, episode, values, lang\)/.test(firma), firma || 'non trovata');

    log('[B] Non chiama nessuna funzione di modulo', !righe.some(function (r) {
      return /\b(openRepeatAloud|openStoryCards|openVoiceCoach|openMatch|openDialogo|openSpeedMatch|openFlashcard|openCustomize)\s*\(/.test(r);
    }));
  }

  // ── [C] I LISTENER SONO VENUTI COL FILE ─────────────────────
  {
    // ⚠️ Senza di loro nessun errore: gli overlay semplicemente non si
    // chiuderebbero. E' il guasto MUTO di questa estrazione, quindi e' la
    // riga che serve di piu'.
    const listener = righe.filter(function (r) { return /addEventListener\('click'/.test(r); });
    // ⚠️ ERANO QUATTRO, SONO SEI dal 2026-09-19, e il numero è stato SEGUITO
    // e non alzato per farlo tornare: il popup dei tentativi è entrato con i
    // suoi DUE listener («Riprova» e «Vai avanti»), perché un pezzo non è solo
    // le sue funzioni — sono le funzioni, lo stato che tengono e i listener
    // che le chiamano. L'invariante non è cambiato: «questo file aggancia
    // listener a tempo di parsing, ed è la ragione della seconda fila». È
    // cambiato quanti ne aggancia, e adesso ci sono DUE ragioni invece di una.
    // ⚠️ 6 -> 7 COL PASSO ① (2026-09-20), e anche questa volta il numero e'
    // stato SEGUITO: i moduli del pannello Aiuto sono tornati col menu che li
    // apre, e portano il listener sui click dentro `#help-overlay-body` —
    // quello che sceglie fra «Promemoria», «non mi e' chiaro» e «Indietro».
    // *Un pezzo non e' solo le sue funzioni: sono le funzioni, lo stato che
    // tengono e i listener che le chiamano.* L'invariante non cambia.
    //
    // ⚠️ E il secondo listener del pannello Aiuto, quello sul `submit`, NON
    // entra in questo conto: la riga qui sopra cerca `addEventListener('click'`
    // apposta. Lo guarda il blocco [F], che lo preme.
    // ⚠️ 7 -> 8 COL PASSO ② (2026-09-20), e l'ottavo non e' un listener nuovo:
    // e' quello che `renderSummaryScreen` attacca al pulsante «Ho finito» di
    // ogni modulo per farci il suono d'uscita. E' venuto col componente, come
    // sempre.
    log('[C] Gli otto listener sono nel file (4 di chiusura + 2 del popup + 1 dell\'Aiuto + 1 della Schermata Finale)',
      listener.length === 8, String(listener.length));
    // ⚠️ LA RIGA SU ESCAPE E' STATA SEGUITA, NON TOLTA (⓪-undecies).
    //
    // Diceva: «il listener di Escape non e' in questo file, ed e' in
    // `index.html`». La prima meta' e' l'invariante e non e' cambiata — Escape
    // chiude overlay di DUE proprietari, quindi non puo' stare in uno dei due.
    // La seconda meta' era un INDIRIZZO, ed e' scaduta: col passo ② Escape e'
    // andato in `app/mappa.js`, col resto del guscio dell'app.
    //
    // *Tenerla puntata a `index.html` l'avrebbe resa rossa su codice giusto;
    // toglierla del tutto avrebbe perso l'invariante. Si sposta il puntatore.*
    log('[C] E il listener di Escape NON c\'e\' (chiude anche l\'Admin)',
      !righe.some(function (r) { return /'keydown'/.test(r); }) &&
      righeDiCodiceDi('app', 'mappa.js').some(function (r) { return /'keydown'/.test(r); }));
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
    //
    // ⚠️ E QUESTA RIGA CORREVA CONTRO UN FETCH, ROSSA IN CI IL 2026-09-19.
    // `uiText()` legge la cache delle istruzioni **senza aspettarla**: in
    // locale il file era sempre già arrivato, sul runner della CI — più lento,
    // regola 19 — no. Verde qui e rossa là, e il rosso **non era una
    // regressione**: era la corsa, che c'era da sempre.
    //
    // L'attesa è su `loadModuleInstructions()`, cioè sulla CAUSA (il fetch
    // finito), NON sul valore che l'asserzione legge. Aspettare
    // «finché uiText non torna qualcosa» renderebbe la riga vera per
    // costruzione (regola 44): se domani `uiText` sbagliasse il percorso
    // dentro il JSON, con quell'attesa non se ne accorgerebbe nessuno; con
    // questa, cade.
    //
    // *Il difetto dell'APP — un pannello aperto troppo presto resta vuoto per
    // sempre, perché nessuno ridisegna — è un'altra cosa, ed è registrato in
    // `docs/decisioni.md`. Qui si toglie la corsa dal TEST, non il difetto
    // dall'app.*
    if (viva) await page.evaluate(function () { return window.BI.loadModuleInstructions(); });
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

    // ── [F] IL MENU HELP DA DENTRO: chi tiene lo stato lo tiene per tutti ──
    // ⚠️ Stessa famiglia della [E], e nasce dal rosso OPPOSTO. `activeHelpModule`
    // vive in questo strato ed è RIASSEGNATA (`openHelpFor`), ma i TRE punti che
    // la leggono sono listener rimasti in index.html. Un alias non può
    // funzionare — copierebbe `null` per sempre — quindi si chiede con
    // `BI.moduloDiAiutoAttivo()`.
    //
    // ⚠️ COSA SI PERDE SENZA, ED È UN CASO VERO DEL 2026-09-19: quei tre punti
    // davano `activeHelpModule is not defined`, cioè il pannello Help si apriva
    // e **moriva al primo pulsante** — «Promemoria», «Indietro» e l'invio di una
    // richiesta d'aiuto, tutti e tre morti. **Nessuna delle 1458 asserzioni lo
    // vedeva**: [C] contava i listener, [D] apriva l'app, [E] guidava Escape.
    // Nessuna premeva un pulsante DENTRO il menu.
    //
    // COME: click e lettura nella STESSA chiamata sincrona. Il gestore in
    // index.html mette titolo e corpo prima di qualunque `fetch`, quindi se
    // arriva in fondo il corpo è già cambiato quando la riga dopo lo legge; se
    // muore alla prima riga, non c'è niente da leggere. Nessun cronometro
    // (regola 19).
    const menuHelp = viva ? await page.evaluate(function () {
      window.BI.openHelpFor({ kind: 'repeatAloud', id: 'repeatAloud', label: 'x' });
      var chiesto = window.BI.moduloDiAiutoAttivo();
      var corpoPrima = document.getElementById('help-overlay-body').innerHTML;
      document.querySelector('[data-help-action="instructions"]').click();
      return {
        id: chiesto && chiesto.id,
        cambiato: document.getElementById('help-overlay-body').innerHTML !== corpoPrima
      };
    }) : null;
    log('[F] Lo strato sa dire QUALE modulo ha chiesto aiuto',
      !!menuHelp && menuHelp.id === 'repeatAloud', JSON.stringify(menuHelp));
    log('[F] ...e il gestore arriva in fondo premendo «Promemoria»',
      !!menuHelp && menuHelp.cambiato === true, JSON.stringify(menuHelp));

    // ⚠️ IL LIMITE DICHIARATO DI [F] SI CHIUDE QUI, IL 2026-09-20, E NON PER
    // ZELO: il limite diceva «dei tre punti che leggevano quel nome ne guido
    // UNO — Promemoria». Il passo ① ha portato quei gestori dentro questo
    // strato, e **nel farlo ne ha rotto uno**: `saveHelpRequest` non era fra
    // gli alias, quindi l'invio di una richiesta d'aiuto moriva con
    // `saveHelpRequest is not defined` — **la conferma non compariva e la
    // richiesta non veniva salvata**. Trovato GUIDANDOLO, non rileggendolo.
    //
    // *Un limite dichiarato dice dove non guardi; non ti impedisce di
    // romperlo proprio lì (regola 42).* Adesso si guida il percorso intero —
    // scegli «non mi è chiaro», scrivi, invia — e si legge l'unica prova che
    // non si può avere per costruzione: **la richiesta nel magazzino**.
    //
    // COME: l'invio passa da `saveHelpRequest`, che scrive in localStorage in
    // modo SINCRONO, quindi click e lettura stanno nella stessa chiamata
    // (regola 19). E la riga che conta non è «la conferma è comparsa» — quella
    // comparirebbe anche se il salvataggio fallisse a valle: è **il magazzino
    // cresciuto di uno**.
    const inviata = viva ? await page.evaluate(function () {
      function richieste() {
        return Object.keys(localStorage).filter(function (k) { return k.indexOf('help') !== -1; }).length;
      }
      window.BI.openHelpFor({ kind: 'repeatAloud', id: 'repeatAloud', label: 'x' });
      var prima = richieste();
      document.querySelector('[data-help-action="clarify"]').click();
      var form = document.getElementById('help-form');
      if (!form) return { errore: 'il modulo di richiesta non è comparso' };
      document.getElementById('help-text').value = 'prova di invio';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      return {
        prima: prima,
        dopo: richieste(),
        corpo: document.getElementById('help-overlay-body').textContent.slice(0, 40)
      };
    }) : null;
    log('[F] Il modulo di richiesta d\'aiuto si apre e si invia',
      !!inviata && !inviata.errore && inviata.dopo > inviata.prima,
      JSON.stringify(inviata));

    // ── [G] I QUATTRO PEZZI DEL PRE-PASSO, GUIDATI ─────────────────
    // ⚠️ QUESTE RIGHE NASCONO DA UNA FALSIFICAZIONE CHE NON HA MORSO.
    // Spostando la barra del tempo in questo strato ho provato a romperla:
    // durata a `9999s` → `test_batch9`, `test_batch16` e `test_dialogo_extra`
    // **tutti verdi**; tolta perfino l'esposizione di `startTimerBar` →
    // `test_batch9` ancora **22/22**. La barra del tempo non aveva **nessuna**
    // rete: né sulla durata né sull'esistenza.
    //
    // È esattamente la forma che il 2026-09-18 è costata un revert — un pezzo
    // raggiungibile e un comportamento non guidato — quindi la riga nasce col
    // pezzo che la richiede (regola 23), non «prima o poi».
    //
    // COME: tutto dentro una chiamata SINCRONA su un elemento vero della
    // pagina. `startTimerBar` è DOM e CSS puri: la durata finisce nella
    // stringa `transition`, e leggerla subito non dipende da quanto è veloce
    // la macchina (regola 19).
    //
    // ⚠️ E IL `try` NON È PRUDENZA GENERICA: senza, togliendo l'esposizione di
    // `startTimerBar` questo file **MUORE** invece di fallire — la `evaluate`
    // solleva, il processo esce e non stampa nessun riepilogo. *Un test che
    // muore non è un test che fallisce* (⑰-septies): in una corsa parallela
    // si legge come «il file non è partito», non come «il pezzo non c'è».
    // Misurato provandolo, non immaginato.
    let timer = null;
    try {
      timer = viva ? await page.evaluate(function () {
      var d = document.createElement('div');
      d.style.width = '120px';
      document.body.appendChild(d);
      window.BI.startTimerBar(d, 7000);
      var dopoStart = { transizione: d.style.transition, larghezza: d.style.width };
      d.style.width = '55px';
      window.BI.freezeTimerBar(d);
      var dopoFreeze = { transizione: d.style.transition, larghezza: d.style.width };
      window.BI.renderChoiceBox('view-map', 'q-class', 'Domanda?', 'id-sec', 'No', 'id-pri', 'S\u00ec');
      var box = {
        secondario: !!document.getElementById('id-sec'),
        primario: !!document.getElementById('id-pri'),
        domanda: (document.querySelector('.q-class') || {}).textContent
      };
      d.remove();
      return { dopoStart: dopoStart, dopoFreeze: dopoFreeze, box: box, direzioni: window.BI.DIRECTION_LABEL };
      }) : null;
    } catch (e) {
      timer = { errore: String(e).split('\n')[0] };
    }
    log('[G] startTimerBar porta la DURATA chiesta nella transizione, e azzera la barra',
      !!timer && !!timer.dopoStart && /\b7s\b/.test(timer.dopoStart.transizione) && timer.dopoStart.larghezza === '0%',
      JSON.stringify(timer && (timer.dopoStart || timer.errore)));
    log('[G] freezeTimerBar toglie la transizione e fissa la larghezza corrente',
      !!timer && !!timer.dopoFreeze && timer.dopoFreeze.transizione === 'none' && /px$/.test(timer.dopoFreeze.larghezza),
      JSON.stringify(timer && (timer.dopoFreeze || timer.errore)));
    log('[G] renderChoiceBox costruisce i due pulsanti con gli id chiesti e la domanda',
      !!timer && !!timer.box && timer.box.secondario && timer.box.primario && timer.box.domanda === 'Domanda?',
      JSON.stringify(timer && (timer.box || timer.errore)));
    log('[G] DIRECTION_LABEL ha le due direzioni',
      !!timer && !!timer.direzioni && !!timer.direzioni['en-it'] && !!timer.direzioni['it-en'],
      JSON.stringify(timer && (timer.direzioni || timer.errore)));

    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== UI CONDIVISA ESTRATTA: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
