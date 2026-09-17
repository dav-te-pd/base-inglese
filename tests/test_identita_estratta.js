// PROTEGGE: che chi-sei e come-vedi-l'app arrivino, e arrivino PRIMA di
// `app/avvio.js` — che ha bisogno della chiave del tema per applicarlo prima
// del primo disegno.
//
// ⚠️ COSA SI ROMPE SE IL FILE NON ARRIVA, misurato il 2026-09-17 bloccando la
// richiesta — ed e' l'OPPOSTO dello strato `progressi`:
//
//     vista attiva ....... NESSUNA
//     testo visibile ..... "" (pagina bianca)
//     errore JS .......... TypeError: icon is not a function
//
// `progressi` lasciava partire l'app e moriva in silenzio alla mappa; qui lo
// script principale chiama `icon(...)` mentre viene ancora eseguito, quindi
// **non parte niente**. E' il guasto RUMOROSO, e va saputo prima di guardare:
// su questo strato «l'app si apre» E' una verifica che verifica.
//
// *La previsione era «muore su renderThemePicker()»: giusta in genere,
// sbagliata su quale funzione — `icon` viene prima. Scritta perche' lo scarto
// fra previsione e misura e' l'unica cosa che dice se stavo guardando.*
//
// ⚠️ E CHIUDE UN CASO APERTO IL 2026-09-17 CON LO STRATO 0: `app/avvio.js`
// leggeva `'baseinglese:theme'` come LETTERALE mentre index.html conosceva la
// stessa chiave come `THEME_KEY`. Due punti che sapevano la stessa cosa, in
// due file da quando `avvio.js` e' uscito. La condizione registrata diceva
// «si corregge nello strato che li riunisce»: e' questo. La chiave vive in
// `app/identita.js`, `avvio.js` la legge da `BI.THEME_KEY`, e per poterlo
// fare questo file sta PRIMA di quello.
//
// IL CASO PIU' DIVERSO (regola 42): `ICONS`, e lo e' per NATURA — e' l'unico
// pezzo dello strato che non e' una funzione ma una TABELLA di dati, e per
// questo la prima misura delle dipendenze non l'ha visto: contava quali
// FUNZIONI il gruppo nomina, e una `var` non e' una funzione. L'app e'
// esplosa col primo `icon()`. Qui e' guardato apposta: si contano gli SVG
// disegnati, che esistono solo se la tabella e' arrivata.
//
// LIMITE DICHIARATO: qui si guarda dove stanno le cose e quando arrivano, non
// cosa fanno. Il comportamento dei temi e' di test_batch* e degli screenshot.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni, righeDiCodiceDi } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// I nomi si leggono dalla fonte, non da un elenco a mano: una cosa aggiunta
// allo strato entra nel giro il giorno stesso.
function nomiEsposti(sorgente) {
  const out = [];
  sorgente.split('\n').forEach(function (r) {
    const m = r.match(/^\s*BI\.(\w+)\s*=\s*\1;\s*$/);
    if (m) out.push(m[1]);
  });
  return out;
}

async function run() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const identita = fs.readFileSync(repoPath('app', 'identita.js'), 'utf8');
  const avvio = fs.readFileSync(repoPath('app', 'avvio.js'), 'utf8');
  const nomi = nomiEsposti(identita);

  // ── [A] DOVE STA E QUANDO ARRIVA ────────────────────────────────────
  {
    log('[A] app/identita.js espone i suoi nomi su BI', nomi.length >= 10, String(nomi.length));

    const tag = html.match(/<script[^>]*src="app\/identita\.js"[^>]*>/);
    log('[A] index.html lo carica con un tag suo', !!tag, 'tag non trovato');
    log('[A] ...BLOCCANTE: niente defer, async o type=module',
      !!tag && !/\b(defer|async|type\s*=)/.test(tag[0]), tag ? tag[0] : 'n/d');

    const pSpazio = html.indexOf('src="app/spazio.js"');
    const pQui = html.indexOf('src="app/identita.js"');
    const pAvvio = html.indexOf('src="app/avvio.js"');
    log('[A] Arriva DOPO app/spazio.js', pSpazio !== -1 && pQui > pSpazio, 'spazio=' + pSpazio + ' identita=' + pQui);
    // ⚠️ Questa non e' simmetrica alle altre: e' l'unico ordine fra due file
    // estratti che serve per una ragione di CONTENUTO — avvio.js legge
    // BI.THEME_KEY, che nasce qui.
    log('[A] ...e PRIMA di app/avvio.js, che legge BI.THEME_KEY',
      pAvvio !== -1 && pQui < pAvvio, 'identita=' + pQui + ' avvio=' + pAvvio);
  }

  // ── [B] IL DIVIETO DI RITORNO ───────────────────────────────────────
  {
    const righe = righeDiCodiceDi('index.html');
    const tornate = nomi.filter(function (n) {
      return righe.some(function (r) {
        return new RegExp('^\\s*(function|var) ' + n + '\\s*[({=]').test(r) &&
          !new RegExp('^\\s*var ' + n + ' = BI\\.').test(r);
      });
    });
    log('[B] Niente di estratto e' + "' tornato dentro index.html", tornate.length === 0, tornate.join(', '));

    const alias = nomi.filter(function (n) {
      return righe.some(function (r) { return new RegExp('^\\s*var ' + n + ' = BI\\.' + n + ';\\s*$').test(r); });
    });
    log('[B] ...e ognuno ha il suo alias nello script principale',
      alias.length === nomi.length, alias.length + ' su ' + nomi.length);
  }

  // ── [C] LA CHIAVE DEL TEMA: UN PUNTO SOLO ───────────────────────────
  {
    const letterale = "'baseinglese:theme'";
    log('[C] app/avvio.js non scrive piu' + "' la chiave del tema come letterale",
      righeDiCodiceDi('app', 'avvio.js').every(function (r) { return r.indexOf(letterale) === -1; }));
    log('[C] ...e la prende da BI.THEME_KEY', avvio.indexOf('BI.THEME_KEY') !== -1);
    // ⚠️ SI CONTANO LE RIGHE DI CODICE, NON LE OCCORRENZE — e questa riga e'
    // nata rossa proprio per quello: il letterale compare DUE volte in
    // app/identita.js, e la seconda e' il commento che spiega perche' la
    // chiave sta li'. E' la famiglia del conto sui commenti, alla quinta
    // comparsa: stavolta l'ha presa il test invece del codice.
    //
    // ⚠️ E SI CONTA SU TUTTA L'APP, non solo qui — correzione trovata da una
    // PREVISIONE SBAGLIATA: falsificando `avvio.js` col letterale rimesso, la
    // previsione diceva «cadono tutte e tre di [C]» e ne sono cadute DUE.
    // Questa guardava solo identita.js e index.html, cioe' diceva «uno solo»
    // senza aver guardato dove il doppione era appena ricomparso. *Lo scarto
    // fra previsione e misura e' quello che l'ha trovato; una previsione non
    // scritta avrebbe lasciato due rossi e la conclusione «funziona».*
    const fs2 = require('fs');
    const doveCompare = fs2.readdirSync(repoPath('app'))
      .filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) {
        return { file: 'app/' + f, n: righeDiCodiceDi('app', f).filter(function (r) { return r.indexOf(letterale) !== -1; }).length };
      })
      .concat([{ file: 'index.html', n: righeDiCodiceDi('index.html').filter(function (r) { return r.indexOf(letterale) !== -1; }).length }])
      .filter(function (x) { return x.n > 0; });
    log('[C] ...e nel CODICE di TUTTA l' + "'app il letterale esiste in un posto solo",
      doveCompare.length === 1 && doveCompare[0].file === 'app/identita.js' && doveCompare[0].n === 1,
      doveCompare.map(function (x) { return x.file + ' x' + x.n; }).join(', ') || 'in nessun posto');
  }

  // ── [D] GUIDANDO L'APP ──────────────────────────────────────────────
  const browser = await launchBrowser();
  {
    const page = await browser.newPage();
    await bloccaFontEsterni(page);
    const errori = [];
    page.on('pageerror', function (e) { errori.push(String(e).split('\n')[0]); });

    // La guardia contro il morire invece che fallire (misurata sullo strato
    // `progressi`: senza, un file rotto esplode senza stampare niente).
    let viva = true;
    try {
      await page.goto(APP_URL);
      await page.waitForSelector('#view-onboarding.is-active', { timeout: 15000 });
    } catch (e) {
      viva = false;
      log('[D] L' + "'app arriva alla schermata di login", false,
        String(e).split('\n')[0] + (errori.length ? '  //  primo errore JS: ' + errori[0] : ''));
    }
    if (viva) log('[D] L' + "'app arriva alla schermata di login", true);

    const pastiglie = viva ? await page.$$eval('[data-theme-option]', function (e) { return e.length; }) : 0;
    log('[D] Il selettore dei temi e' + "' disegnato", pastiglie > 0, String(pastiglie));

    // ICONS: il caso diverso per natura. Un SVG esiste solo se la tabella e'
    // arrivata — e' la prova che un dato, non solo una funzione, ha traslocato.
    const svg = viva ? await page.$$eval('svg', function (e) { return e.length; }) : 0;
    log('[D] Le icone sono disegnate: la TABELLA ICONS ha traslocato con le funzioni',
      svg > 0, String(svg));

    // Il tema salvato sopravvive alla ricarica: e' la prova che i due file
    // usano la STESSA chiave, non due stringhe uguali per caso.
    let temaDopo = null;
    if (viva) {
      await page.evaluate(function () { window.BI.setTheme('notte'); });
      await page.reload();
      temaDopo = await page.evaluate(function () { return document.documentElement.getAttribute('data-theme'); });
    }
    log('[D] Il tema salvato sopravvive alla ricarica: avvio.js e identita.js leggono la stessa chiave',
      temaDopo === 'notte', String(temaDopo));

    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();

  console.log('');
  console.log('=== IDENTITA ESTRATTA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
