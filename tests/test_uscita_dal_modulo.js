// PROTEGGE: che uscire da un modulo lo PULISCA davvero — timer, registrazioni,
// sequenze — adesso che la pulizia non e' piu' dentro `showView` ma dentro
// `leaveModule` (passo 22, 2026-09-17; CLAUDE.md regola 21).
//
// ⚠️ DUE BLOCCHI, E NESSUNO COPRE L'ALTRO. Sono due guasti diversi:
//
//   [A] «qualcuno ha chiamato la funzione sbagliata» — un punto nuovo che usa
//       `showView` dove serviva `leaveModule`. Si vede nel SORGENTE, e si
//       vedrebbe anche su un modulo che nessun test apre.
//   [B] «la pulizia non e' arrivata» — la catena si e' rotta da qualche parte
//       fra il gesto e `BI.pulizie`. Si vede solo GUIDANDO l'app, e si
//       vedrebbe anche se tutti i punti di chiamata fossero giusti.
//
// *Un solo blocco lascerebbe scoperta meta' del problema, e sarebbe la meta'
// che non si vede: [A] da solo non prova che la pulizia funzioni, [B] da solo
// non vede i punti che nessun test attraversa.*
//
// ⚠️ MISURATO, non sostenuto — e su un guasto i due si sovrappongono:
//
//   Rompendo `openEpisodeMap` (un punto di chiamata tornato a `showView`)
//   cadono [A] **e** tutte e otto le righe di [B]. Non e' ridondanza: e' che
//   **tutte e otto le uscite passano da `openEpisodeMap`** — i sette pulsanti
//   «← Mappa» e il `start-episode` di Personalizza finiscono tutti li'. *E'
//   il collo di bottiglia dell'uscire: uno dei dodici punti porta otto
//   famiglie su otto.*
//
//   Rompendo la catena DENTRO `leaveModule` (via la chiamata a
//   `stopAllModuleActivity`) cadono le otto righe di [B] e **[A] resta
//   verde, tutte e tre**. Questo e' il guasto che [A] non puo' vedere, ed e'
//   la prova che [B] non e' ridondante.
//
// *La prima previsione su F1 era «[A] tutte e tre», e cadde anche [B]: la
// previsione era INCOMPLETA, non sbagliata — ma averla scritta e' quello che
// ha fatto notare il collo di bottiglia, che non era nella misura di partenza.*
//
// ⚠️ IL GUASTO E' SILENZIOSO — e' il motivo per cui questo file esiste. Un
// modulo che non si pulisce non alza eccezioni: i suoi timer continuano a
// girare su una schermata che non c'e' piu', e lo studente lo scopre come un
// audio che parte da solo o un countdown che riparte dove non dovrebbe.

const fs = require('fs');
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath } = require('./test-env');
const { openModule } = require('./map-driver');
const { stepsBefore } = require('./module-order');
const { FAMIGLIE } = require('./listener-census');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// I chiamanti diretti di `showView` nel sorgente: [{ id, vista }].
// Il commento in testa a BASELINE-USCITA.txt dichiara il limite di questa
// lettura (solo le chiamate letterali) e perche' oggi basta.
// Le righe di index.html che sono CODICE — i commenti fuori. Il punto unico
// da cui passano tutti i conti di questo file: un filtro sui commenti scritto
// due volte si disallinea, e il modo in cui si disallinea e' che uno dei due
// conta anche la prosa.
function righeDiCodice() {
  return fs.readFileSync(repoPath('index.html'), 'utf8').split('\n')
    .filter(function (r) {
      const t = r.trim();
      return t.indexOf('//') !== 0 && t.indexOf('*') !== 0 && t.indexOf('/*') !== 0;
    });
}

function chiamantiDiretti() {
  const out = [];
  righeDiCodice().forEach(function (r) {
    const m = r.match(/(?<!function )showView\('(\w+)'\)/);
    if (m) out.push(m[1]);
  });
  return out;
}

function baseline() {
  return fs.readFileSync(repoPath('tests', 'BASELINE-USCITA.txt'), 'utf8')
    .split('\n').filter(function (r) { return r && r.indexOf('#') !== 0; })
    .map(function (r) { return r.split(' ')[1]; });
}

async function nuovaPagina(browser, utente, completati) {
  const page = await browser.newPage();
  await bloccaFontEsterni(page);
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#view-home.is-active', { timeout: 15000 });
  await page.evaluate(function (d) {
    localStorage.setItem('baseinglese:gate:customizeSeen:' + d.u, '1');
    ['mappaEpisodio', 'personalizzazione'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + d.u, '1');
    });
    localStorage.setItem('baseinglese:modules:gate:' + d.u, JSON.stringify({ completed: d.f || [] }));
  }, { u: utente, f: completati });
  await page.click('#go-episode');
  await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
  return page;
}

const PASSO_DI = {
  voice: 'voicePractice', personalizza: 'personalizzazione', match: 'matchEngIta',
  speedMatch: 'speedMatchEngIta', dialogo: 'dialogoAscoltaRipeti',
  storyCards: 'meetTheStory', flashcard: 'flashcardAEngIta', repeatAloud: 'repeatAloud'
};

async function run() {
  // ── [A] I CHIAMANTI DIRETTI DI `showView` SONO ANCORA DUE ────────────
  {
    const viste = chiamantiDiretti();
    const atteso = baseline();
    log('[A] Le chiamate dirette a showView sono ' + atteso.length + ', come il baseline',
      viste.length === atteso.length, 'trovate ' + viste.length + ': ' + viste.join(', '));
    log('[A] E mostrano tutte la vista dichiarata nel baseline',
      viste.every(function (v) { return atteso.indexOf(v) !== -1; }), viste.join(', '));
    // ⚠️ La riga che rende il blocco utile invece che tautologico: se `showView`
    // tornasse a essere chiamata da mezza app, [A] cadrebbe — ma se qualcuno
    // togliesse `leaveModule` del tutto, [A] resterebbe verde e non se ne
    // accorgerebbe nessuno. Questa asserzione guarda l'altra meta'.
    // ⚠️ SI CONTANO LE RIGHE DI CODICE, NON LE OCCORRENZE DEL NOME — e la
    // prima forma di questa riga contava 14 invece di 12, perche' prendeva
    // anche i due commenti che nominano `leaveModule('...')`. Commenti scritti
    // da me, nello stesso commit.
    //
    // *E' la stessa correzione gia' scritta nella ⓪-nonies (passo ② della
    // forma operativa: «la grep deve colpire il CODICE, non una stringa che
    // vive anche nei commenti»), applicata la' e non qui. **Una difesa scritta
    // in un posto non si applica da sola nell'altro.** Per questo il filtro sui
    // commenti sta in una funzione sola, usata da entrambi i conti.*
    const quante = righeDiCodice().filter(function (r) {
      return /(?<!function )leaveModule\('/.test(r);
    }).length;
    log('[A] E i punti che lasciano un modulo passano da leaveModule: sono 12',
      quante === 12, String(quante));
  }

  // ── [B] USCENDO DA UN MODULO, LA PULIZIA AVVIENE ─────────────────────
  //
  // Le pulizie si avvolgono DOPO il boot: `BI.pulizie` e' un array raggiungibile
  // da `window`, e `stopAllModuleActivity` lo rilegge a ogni giro, quindi
  // sostituirne le voci con versioni che contano funziona senza toccare l'app.
  //
  // ⚠️ LE FAMIGLIE VENGONO DA `FAMIGLIE`, NON DA UN ELENCO SCRITTO QUI — stessa
  // mossa del baseline dei listener: la fonte decide, non chi scrive il test.
  // Una famiglia nuova entra nel giro il giorno in cui entra nel censimento.
  const browser = await launchBrowser();
  {
    for (const fam of Object.keys(FAMIGLIE)) {
      const passo = PASSO_DI[fam];
      const uscita = FAMIGLIE[fam].uscitaVersoMappa;
      const page = await nuovaPagina(browser, 'U' + fam, stepsBefore(passo));
      await page.evaluate(function () {
        window.__pulizieChiamate = 0;
        window.BI.pulizie = window.BI.pulizie.map(function (f) {
          const w = function () { window.__pulizieChiamate++; return f.apply(this, arguments); };
          Object.defineProperty(w, 'name', { value: f.name });
          return w;
        });
      });
      await openModule(page, passo);
      const primaDiUscire = await page.evaluate(() => window.__pulizieChiamate);
      await page.click('#' + uscita).catch(function () {});
      await page.waitForSelector('#view-map.is-active', { timeout: 10000 }).catch(function () {});
      const dopo = await page.evaluate(() => window.__pulizieChiamate);
      log('[B] ' + fam + ': uscendo dal modulo le pulizie girano',
        dopo > primaDiUscire, 'prima ' + primaDiUscire + ', dopo ' + dopo);
      await page.close();
    }
  }

  await browser.close();
  console.log('\n=== USCITA DAL MODULO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed) process.exit(1);
}
run();
