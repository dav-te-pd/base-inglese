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
// ⚠️ DAL 2026-09-18 LEGGE ANCHE `app/`, e non e' un allargamento: e' la stessa
// domanda su un mondo che ha due file invece di uno. Col primo modulo estratto
// (`app/personalizza.js`) uno dei dodici punti d'uscita e' uscito da
// index.html, e il conto scendeva a 11 — **non perche' un punto fosse sparito,
// ma perche' il test guardava meta' del posto.** L'invariante non e' cambiato:
// «ogni punto che lascia un modulo passa da leaveModule» vale su tutta l'app.
//
// *Letto cosi', il conto resta 12 adesso e resta giusto quando usciranno gli
// altri sette moduli — invece di dover essere corretto a mano otto volte.*
function righeDiCodice() {
  const files = [repoPath('index.html')].concat(
    fs.readdirSync(repoPath('app')).filter(function (f) { return /\.js$/.test(f); })
      .map(function (f) { return repoPath('app', f); })
  );
  return files.reduce(function (acc, f) {
    return acc.concat(fs.readFileSync(f, 'utf8').split('\n').filter(function (r) {
      const t = r.trim();
      return t.indexOf('//') !== 0 && t.indexOf('*') !== 0 && t.indexOf('/*') !== 0;
    }));
  }, []);
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
    localStorage.setItem(BI.customizeSeenKey('gate', d.u), '1');
    ['mappaEpisodio', 'personalizzazione'].forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + d.u, '1');
    });
    localStorage.setItem(BI.moduleProgressKey('gate', d.u), JSON.stringify({ completed: d.f || [] }));
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
    // ⚠️ 12 -> 11 il 2026-09-19 (passo A): il dodicesimo era
    // `leaveModule('pronunciation')`, dentro la vista morta, ed è uscito con
    // lei. **Rosso da seguire:** l'invariante è «ogni punto che lascia un
    // modulo passa di qui», e un punto in meno non lo indebolisce — era il
    // punto di una schermata che nessuno poteva aprire.
    // ⚠️ DODICI dal passo 1.13-bis (2026-09-22): il dodicesimo e'
    // `leaveModule('episodes')`, la lista degli episodi. *Il numero e' scritto
    // qui apposta e non contato dal sorgente: contarlo lo renderebbe vero per
    // costruzione, e questa riga esiste proprio perche' un punto nuovo che
    // NON passa da leaveModule si faccia notare.*
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

  // ── [C] DALLA SCHERMATA FINALE L'UNICA USCITA E' QUELLA CHE SALVA ────
  //
  // ⚠️ IL GUASTO MISURATO IL 2026-09-20, e non e' estetico: sulla Schermata
  // Finale di Flash Card, con l'esito gia' a schermo, c'erano **dodici voci
  // di mastery in sospeso** — e premendo «← Mappa» diventavano **zero**. Il
  // modulo non veniva nemmeno segnato completato. *Lo studente legge «Tutte
  // le carte ripassate!» col suo punteggio, tocca un pulsante che sembra
  // «torna indietro», e perde tutto senza che niente glielo dica.*
  //
  // La correzione toglie la RIGA DELLE AZIONI intera da quella schermata, non
  // solo «Spiegazione» come faceva la regola 10. La strada scartata — far
  // salvare «← Mappa» solo li' — la scarta la **regola 17**: sarebbe lo stesso
  // pulsante con due mestieri in due schermate.
  //
  // ⚠️ DUE ASSERZIONI, E LA SECONDA E' QUELLA CHE CONTA. «La riga e'
  // nascosta» proverebbe solo che qualcosa e' sparito; quello che protegge lo
  // studente e' che **l'uscita rimasta SCRIVE**: la mastery in sospeso finisce
  // nel magazzino e il modulo si segna completato. Senza la seconda, si
  // potrebbe togliere la riga e rompere il salvataggio restando verdi.
  //
  // IL CASO PIU' DIVERSO (regola 42): **Voice Coach**, l'unico dei sei che
  // tocca quella stessa riga con un SECONDO meccanismo — `lockModuleHeader`,
  // che la blocca mentre il microfono registra. Se nascondere la riga
  // interferisse con quel blocco, si vedrebbe li'. Guidarlo fino alla
  // Schermata Finale chiede un microfono finto, quindi qui se ne verifica il
  // SORGENTE: usa la stessa funzione condivisa degli altri cinque, e la sua
  // riga di blocco e' rimasta.
  //
  // LIMITE DICHIARATO: guida **Flash Card**. Gli altri cinque li copre la
  // riga strutturale qui sotto, che verifica che nessuno si sia tenuto la
  // propria copia della vecchia istruzione.
  {
    const page = await nuovaPagina(browser, 'UFinale', stepsBefore('flashcardAEngIta'));
    await openModule(page, 'flashcardAEngIta');
    // ⚠️ `nuovaPagina` spegne l'introduzione solo per la mappa e per
    // Personalizza, quindi Flash Card si apre sulla SUA introduzione e la
    // carta resta nascosta. Si chiude qui invece che allargare `nuovaPagina`:
    // gli altri blocchi di questo file non aprono nessuna introduzione, e
    // cambiarla per loro vorrebbe dire cambiare cio' che gia' misurano.
    if (await page.isVisible('#fc-intro-start-btn').catch(function () { return false; })) {
      await page.click('#fc-intro-start-btn');
    }
    await page.waitForSelector('#fc-card', { timeout: 15000 });
    // Si risponde a tutte le carte fino alla Schermata Finale. Il ciclo ha un
    // tetto e non un'attesa: se non ci arriva, l'asserzione dopo lo dice.
    for (let i = 0; i < 60; i++) {
      if (await page.isVisible('#fc-summary-screen').catch(function () { return false; })) break;
      if (await page.evaluate(function () {
        return document.getElementById('attempt-popup').classList.contains('is-open');
      })) { await page.click('#attempt-popup .btn-primary').catch(function () {}); await page.waitForTimeout(200); continue; }
      if (await page.isVisible('#fc-retry-continue-btn').catch(function () { return false; })) {
        await page.click('#fc-retry-continue-btn'); await page.waitForTimeout(300); continue;
      }
      if (await page.isVisible('#fc-card').catch(function () { return false; })) {
        await page.click('#fc-card').catch(function () {});
        await page.waitForTimeout(120);
        if (await page.isVisible('#fc-know-it-btn').catch(function () { return false; })) {
          await page.click('#fc-know-it-btn'); await page.waitForTimeout(450); continue;
        }
      }
      await page.waitForTimeout(200);
    }
    const suFinale = await page.evaluate(function () {
      var el = document.getElementById('fc-summary-screen');
      var riga = document.querySelector('#view-flashcard .header-actions-row');
      var visibili = riga ? [].slice.call(riga.querySelectorAll('button'))
        .filter(function (b) { return b.offsetParent !== null; }).length : -1;
      return {
        finale: !!el && !el.hidden,
        pulsantiVisibiliInBarra: visibili,
        sospesa: Object.keys(window.BI.masteryInSospeso()).length
      };
    });
    log('[C] Flash Card arriva alla Schermata Finale con un esito da salvare',
      suFinale.finale === true && suFinale.sospesa > 0, JSON.stringify(suFinale));
    log('[C] ...e nella barra non c\'e\' piu\' NESSUN pulsante',
      suFinale.pulsantiVisibiliInBarra === 0, JSON.stringify(suFinale));

    await page.click('#fc-complete-btn');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });
    const dopoUscita = await page.evaluate(function () {
      var m = JSON.parse(localStorage.getItem(BI.masteryStorageKey('gate', 'UFinale')) || '{}');
      var p = JSON.parse(localStorage.getItem(BI.moduleProgressKey('gate', 'UFinale')) || '{}');
      return {
        magazzino: Object.keys(m).length,
        sospesa: Object.keys(window.BI.masteryInSospeso()).length,
        completato: (p.completed || []).indexOf('flashcardAEngIta') !== -1
      };
    });
    log('[C] L\'unica uscita rimasta SCRIVE la mastery nel magazzino',
      dopoUscita.magazzino >= suFinale.sospesa && dopoUscita.sospesa === 0, JSON.stringify(dopoUscita));
    log('[C] ...e segna il modulo completato', dopoUscita.completato === true, JSON.stringify(dopoUscita));
    await page.close();
  }

  // ── [C] STRUTTURALE: nessun modulo si e' tenuto la propria copia ─────
  {
    const moduli = [
      ['flashcard.js', 'flashcard'], ['dialogo.js', 'dialogo'], ['match.js', 'match'],
      ['repeataloud.js', 'repeat-aloud'], ['speedmatch.js', 'speed-match'],
      ['voice.js', 'voice-coach'], ['storycards.js', 'story-cards']
    ];
    const conProprie = moduli.filter(function (m) {
      const src = fs.readFileSync(repoPath('app', m[0]), 'utf8');
      return src.split('\n').some(function (r) {
        return r.trim().indexOf('//') !== 0 &&
          r.indexOf("'" + m[1] + "-watch-btn').hidden = name === 'summary'") !== -1;
      });
    });
    log('[C] Nessuno dei sette moduli ha ancora la sua copia della vecchia riga',
      conProprie.length === 0, conProprie.map(function (m) { return m[0]; }).join(', '));
    const chiamano = moduli.filter(function (m) {
      const src = fs.readFileSync(repoPath('app', m[0]), 'utf8');
      return src.indexOf("barraAzioniFinale('" + m[1] + "'") !== -1;
    });
    log('[C] ...e tutti e sette chiamano la funzione condivisa',
      chiamano.length === moduli.length, chiamano.length + ' su ' + moduli.length);
    // Il caso piu' diverso, nominato invece che solo guardato: Voice Coach
    // blocca la stessa riga durante la registrazione, e quel blocco deve
    // essere rimasto.
    const voice = fs.readFileSync(repoPath('app', 'voice.js'), 'utf8');
    log('[C] Voice Coach blocca ancora la riga mentre registra (lockModuleHeader)',
      /lockModuleHeader\('voice-coach', recording\)/.test(voice));
  }

  await browser.close();
  console.log('\n=== USCITA DAL MODULO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed) process.exit(1);
}
run();
