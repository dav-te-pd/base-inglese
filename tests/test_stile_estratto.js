// PROTEGGE: che il CSS resti in `stile/` — dodici fogli, caricati NELL'ORDINE
// dichiarato — e che quell'ordine continui a produrre la stessa cascata.
//
// ⚠️ COSA SI PERDE SENZA, ed è un guasto che non alza niente.
//
// Il passo 1.1 ha TAGLIATO un foglio unico di 2496 righe in dodici pezzi senza
// riscriverne uno: la concatenazione dei dodici, in quell'ordine, era identica
// carattere per carattere al foglio di prima. **Quell'identità vale solo finché
// l'ordine resta quello.** Spostare un `<link>` non rompe niente di visibile
// subito: cambia quali regole vincono, e l'app si vede storta in un punto che
// nessuno guarda quel giorno.
//
// COME, e non nel modo ovvio: non si congela l'elenco dei dodici nomi in
// quest'ordine — sarebbe una fotografia, e un foglio nuovo domani la farebbe
// rossa per il motivo sbagliato. Si verificano le tre cose che contano: che il
// foglio delle variabili e della guardia sia il **primo**; che un valore
// definito lì arrivi **davvero** a un componente definito in un altro file; e
// che **nessun selettore viva in due fogli**.
//
// ⚠️ La terza è quella che ho scoperto misurando, ed è la più importante.
// Contati subito dopo il taglio: **zero selettori in due fogli** (l'unica
// ripetizione è un `50%` di due keyframes distinti). Quindi oggi l'ordine fra
// gli undici fogli non-base è **ininfluente** — l'ho provato spostando
// `base.css` in fondo, e il pulsante restava identico. *Non è un motivo per
// non guardarlo: è il motivo per guardarlo da qui. Il giorno in cui una regola
// comparirà in due fogli l'ordine comincerà a contare, e nessuno se ne
// accorgerà — questa riga lo dice quel giorno.*
//
// IL CASO PIÙ DIVERSO (regola 42): **`base.css`**, l'unico dei dodici che
// *definisce* invece di *usare* — le variabili dei temi e la guardia `[hidden]`
// — e quindi l'unico per cui la posizione non è una preferenza. Gli altri
// undici si possono scambiare fra loro e quasi sempre non succede niente;
// questo no, e infatti è l'unico su cui `[C]` asserisce una posizione.
//
// LIMITE DICHIARATO: guarda la cascata fra file, non ogni singola regola. Due
// fogli di mezzo scambiati fra loro, se non hanno selettori in comune, qui non
// si vedono — e non si vedono nemmeno nell'app.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, bloccaFontEsterni } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const tag = html.match(/<link rel="stylesheet" href="stile\/[^"]+">/g) || [];
  const nomi = tag.map(function (t) { return t.match(/stile\/([^?"]+)/)[1]; });

  // ── [A] index.html NON tiene più regole ────────────────────────────
  {
    log('[A] index.html non ha più un tag di stile', !/<style[\s>]/.test(html));
    log('[A] ...e nemmeno uno `style="..."` con un colore scritto a mano (regola 2)',
      !/style="[^"]*#[0-9a-fA-F]{3,6}/.test(html));
    log('[A] Carica dei fogli da stile/', tag.length > 0, String(tag.length));
    log('[A] ...e ognuno porta la sua versione (regola 6)',
      tag.every(function (t) { return /\?v=/.test(t); }),
      tag.filter(function (t) { return !/\?v=/.test(t); }).join(' '));
  }

  // ── [B] I FILE CI SONO DAVVERO ─────────────────────────────────────
  {
    const mancanti = nomi.filter(function (n) { return !fs.existsSync(repoPath('stile', n)); });
    log('[B] Ogni foglio nominato da index.html esiste su disco', mancanti.length === 0, mancanti.join(', '));

    // Un foglio che c'è ma è vuoto è la forma peggiore: il tag risponde 200 e
    // le regole non ci sono più. Non si chiede una lunghezza minima scritta a
    // mano — si chiede che ci sia almeno una parentesi graffa, cioè una regola.
    const vuoti = nomi.filter(function (n) {
      return !/\{/.test(fs.readFileSync(repoPath('stile', n), 'utf8'));
    });
    log('[B] ...e nessuno è senza regole', vuoti.length === 0, vuoti.join(', '));

    const senzaTesta = nomi.filter(function (n) {
      return fs.readFileSync(repoPath('stile', n), 'utf8').indexOf('/*') !== 0;
    });
    log('[B] ...e ognuno dice in testa cosa contiene', senzaTesta.length === 0, senzaTesta.join(', '));

    const sulDisco = fs.readdirSync(repoPath('stile')).filter(function (f) { return /\.css$/.test(f); });
    const orfani = sulDisco.filter(function (f) { return nomi.indexOf(f) === -1; });
    log('[B] ...e non c\'è nessun foglio sul disco che nessuno carica',
      orfani.length === 0, orfani.join(', '));
  }

  const browser = await launchBrowser();
  const page = await browser.newPage();
  await bloccaFontEsterni(page);
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await page.goto(APP_URL);
  await page.waitForSelector('#name-input', { state: 'visible', timeout: 10000 });

  // ── [C] L'ORDINE: base per primo ───────────────────────────────────
  {
    const dati = await page.evaluate(function () {
      const locali = Array.prototype.filter.call(document.styleSheets, function (s) {
        return s.href && s.href.indexOf('/stile/') !== -1;
      }).map(function (s) { return s.href.split('/stile/')[1].split('?')[0]; });
      // Dove sta la guardia [hidden]: si cerca fra i fogli, non si dà per
      // scontato che sia nel primo — è proprio quello che va verificato.
      let foglioGuardia = null;
      Array.prototype.forEach.call(document.styleSheets, function (s) {
        try {
          Array.prototype.forEach.call(s.cssRules, function (r) {
            if (r.selectorText && r.selectorText.indexOf('[hidden]') !== -1 && foglioGuardia === null) {
              foglioGuardia = s.href ? s.href.split('/stile/')[1].split('?')[0] : '(in pagina)';
            }
          });
        } catch (e) {}
      });
      return { locali: locali, foglioGuardia: foglioGuardia };
    });

    // ⚠️ NON si chiama «l'ordine è quello di index.html»: quello sarebbe vero
    // per costruzione — i due elenchi vengono dalla stessa fonte e il browser
    // non riordina i fogli. Quello che questa riga può davvero scoprire è un
    // foglio che NON È ARRIVATO: un 404 non toglie il `<link>` dal documento,
    // toglie il foglio da `document.styleSheets`, e l'app si vede storta senza
    // un errore.
    log('[C] Tutti i fogli dichiarati sono ARRIVATI (un 404 non alza niente)',
      JSON.stringify(dati.locali) === JSON.stringify(nomi),
      JSON.stringify(dati.locali) + ' vs ' + JSON.stringify(nomi));
    log('[C] Il primo è quello delle variabili e della guardia',
      dati.locali[0] === 'base.css', dati.locali[0]);
    log('[C] ...e la guardia [hidden] sta proprio lì (regola 12)',
      dati.foglioGuardia === 'base.css', String(dati.foglioGuardia));

    // ⚠️ L'INVARIANTE CHE RENDE INNOCUO L'ORDINE, ed è una misura, non una
    // speranza: **nessun selettore è dichiarato in due fogli diversi.**
    // Misurato il 2026-09-20 subito dopo il taglio: zero, su 2496 righe (l'unica
    // ripetizione è un `50%` di due keyframes distinti, che non è un selettore
    // di cascata). Vuol dire che il taglio è caduto su cuciture vere e che
    // scambiare due dei fogli, oggi, non cambia niente — l'ho provato
    // spostando `base.css` in fondo, e il pulsante restava identico.
    //
    // *Per questo la riga vive qui e non nella prosa: **il giorno in cui una
    // regola comparirà in due fogli, l'ordine comincerà a contare e nessuno se
    // ne accorgerà.** Questa riga lo dice quel giorno, non sei mesi dopo.*
    const perSelettore = {};
    nomi.forEach(function (n) {
      const testo = fs.readFileSync(repoPath('stile', n), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      const re = /(^|\})\s*([^{}@]+?)\s*\{/g;
      let m;
      while ((m = re.exec(testo)) !== null) {
        m[2].split(',').forEach(function (uno) {
          const sel = uno.trim();
          if (!sel || /^\d+%$/.test(sel) || sel.indexOf('\n') !== -1) return;
          (perSelettore[sel] = perSelettore[sel] || []).push(n);
        });
      }
    });
    const inDue = Object.keys(perSelettore).filter(function (sel) {
      const f = perSelettore[sel].filter(function (v, i, a) { return a.indexOf(v) === i; });
      return f.length > 1;
    });
    log('[C] Nessun selettore vive in due fogli: è questo che rende l\'ordine innocuo',
      inDue.length === 0,
      inDue.slice(0, 5).map(function (sel) { return sel + ' (' + perSelettore[sel].join('+') + ')'; }).join(' | '));
  }

  // ── [D] LA CASCATA ATTRAVERSA I FILE ───────────────────────────────
  {
    // ⚠️ E' LA RIGA CHE VALE. Un token dichiarato in `base.css` deve arrivare a
    // una classe dichiarata in `componenti.css`: se i due fogli non si
    // parlassero — ordine sbagliato, foglio non caricato — il colore
    // risolverebbe a niente e il pulsante resterebbe trasparente. **Nessun
    // errore JS, nessun 404: un pulsante senza fondo.**
    const stile = await page.evaluate(function () {
      const btn = document.querySelector('#onboarding-form button[type=submit]');
      const c = getComputedStyle(btn);
      const tok = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return { sfondo: c.backgroundColor, raggio: c.borderRadius, token: tok };
    });
    log('[D] Il token dei temi (base.css) esiste', !!stile.token, stile.token);
    log('[D] ...e arriva a un pulsante definito in componenti.css: ha un fondo vero',
      !!stile.sfondo && stile.sfondo !== 'rgba(0, 0, 0, 0)' && stile.sfondo !== 'transparent',
      stile.sfondo);
    log('[D] ...e la forma del componente c\'è (non è un pulsante nudo del browser)',
      !!stile.raggio && stile.raggio !== '0px', stile.raggio);
    log('[D] Nessun errore JS', errori.length === 0, errori.join(' | '));
  }

  await page.close();
  await browser.close();

  console.log('');
  console.log('=== STILE ESTRATTO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(function (e) { console.error(e); process.exit(1); });
