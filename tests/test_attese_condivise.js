// PROTEGGE: che le forme condivise di `tests/attese.js` misurino davvero, e —
// soprattutto — **che si veda quando NON misurano**.
//
// Non protegge un comportamento dell'app: protegge lo strumento con cui
// quarantasei file la verificano. Se una di queste forme tornasse `true` senza
// aver aspettato niente, decine di asserzioni diventerebbero verdi per finta e
// **nessun rosso lo direbbe** — la suite continuerebbe a passare, solo che non
// proverebbe piu' niente.
//
// ⚠️ LA META' CHE CONTA DI PIU' E' LA PROVA CONTRARIA (blocco [C]).
//
// Il triage del 14b ha trovato, in due famiglie su due, un gruppo di punti che
// verificano uno stato **gia' vero prima dell'attesa** — «starts disabled»,
// «still disabled», «e' nascosto fin dall'apertura». Convertirli sembra un
// miglioramento e invece li **svuota**: l'attesa torna al primo istante, il
// test diventa istantaneo, e il conto delle guardie SCENDE — cioe' il numero
// con cui si misura il progresso migliora proprio quando il lavoro fa danno.
//
// Quel gruppo e' stato escluso LEGGENDO i siti, cioe' fidandosi di una lettura.
// Questo blocco lo **dimostra**: su un elemento gia' nello stato atteso la
// forma ritorna vero in pochi millisecondi, senza aver verificato niente.
// **Undici siti sono stati lasciati fuori per questa ragione: la ragione deve
// esistere nel codice, non solo nella testa di chi ha letto.**
//
// COME: una pagina costruita qui dentro con `setContent`, non l'app. Le forme
// sono generiche — non sanno niente di base-inglese — e provarle sull'app vera
// significherebbe legarle a un modulo, cioe' misurare due cose insieme. Cosi'
// il test non ha bisogno del server, dura pochi secondi, e non cade se l'app
// cambia.
//
// LIMITE DICHIARATO: `attendiSottotitoloEsito` non e' provata qui — e' nata
// prima, con le cinque corse del sottotitolo, ed e' esercitata dai quattro file
// che la usano. Se un giorno cambia forma, questo e' il posto dove metterla.

const { launchBrowser } = require('./test-env');
const {
  attendiAbilitato, attendiDisabilitato, attendiClasse,
  attendiVisibile, attendiNascosto
} = require('./attese');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Una pagina con un pulsante e una scatola, e un modo per farli cambiare stato
// DOPO un ritardo: e' la situazione vera — si clicca, e lo stato arriva dopo.
const PAGINA = `
  <button id="b" disabled>bottone</button>
  <div id="scatola" hidden>scatola</div>
  <button id="gia-abilitato">gia' abilitato</button>
  <div id="gia-visibile">gia' visibile</div>
  <div id="con-classe" class="is-active">gia' con la classe</div>
  <script>
    window.cambiaDopo = function (ms) {
      setTimeout(function () {
        document.getElementById('b').disabled = false;
        document.getElementById('scatola').hidden = false;
        document.getElementById('b').classList.add('is-pronto');
      }, ms);
    };
  </script>
`;

async function nuovaPagina(browser) {
  const page = await browser.newPage();
  await page.setContent(PAGINA);
  return page;
}

async function run() {
  const browser = await launchBrowser();

  // ── [A] Aspettano DAVVERO: lo stato arriva dopo, e la forma lo prende ──────
  {
    const page = await nuovaPagina(browser);
    await page.evaluate(() => window.cambiaDopo(600));
    const t0 = Date.now();
    const ok = await attendiAbilitato(page, '#b', 5000);
    const durata = Date.now() - t0;
    log('[A] attendiAbilitato vede il pulsante abilitarsi', ok === true);
    // Se non avesse aspettato sarebbe tornata subito, mentre era ancora
    // disabilitato: la durata e' la prova che ha aspettato lo stato vero.
    log('[A] ...e ha ASPETTATO, invece di leggere una volta sola', durata >= 400, durata + 'ms');
    await page.close();
  }
  {
    const page = await nuovaPagina(browser);
    await page.evaluate(() => window.cambiaDopo(600));
    const ok = await attendiVisibile(page, '#scatola', 5000);
    log('[A] attendiVisibile vede la scatola comparire', ok === true);
    await page.close();
  }
  {
    const page = await nuovaPagina(browser);
    await page.evaluate(() => window.cambiaDopo(600));
    const t0 = Date.now();
    const ok = await attendiClasse(page, '#b', 'is-pronto', 5000);
    log('[A] attendiClasse vede la classe comparire', ok === true);
    log('[A] ...e ha aspettato anche lei', Date.now() - t0 >= 400);
    await page.close();
  }

  // ── [B] Sanno FALLIRE: se lo stato non arriva, tornano false ──────────────
  // Senza questo blocco una forma che ritorna sempre true passerebbe il [A].
  {
    const page = await nuovaPagina(browser);
    log('[B] attendiAbilitato torna false se il pulsante resta disabilitato',
        (await attendiAbilitato(page, '#b', 700)) === false);
    log('[B] attendiVisibile torna false se la scatola non compare',
        (await attendiVisibile(page, '#scatola', 700)) === false);
    log('[B] attendiClasse torna false se la classe non arriva',
        (await attendiClasse(page, '#b', 'is-pronto', 700)) === false);
    log('[B] attendiDisabilitato torna false su un pulsante abilitato',
        (await attendiDisabilitato(page, '#gia-abilitato', 700)) === false);
    // Un selettore che non esiste NON e' "stato raggiunto": e' il caso in cui
    // un id cambia nome e mezza suite diventerebbe verde a vuoto.
    log('[B] Un elemento che non esiste non conta come stato raggiunto',
        (await attendiAbilitato(page, '#non-esiste', 700)) === false);
    log('[B] ...nemmeno per attendiClasse',
        (await attendiClasse(page, '#non-esiste', 'x', 700)) === false);
    await page.close();
  }

  // ── [C] LA PROVA CONTRARIA: su uno stato GIA' VERO non misurano niente ────
  // Questo blocco non verifica che le forme funzionino: verifica che il
  // PERICOLO sia reale, cioe' che escludere gli undici siti «gia' veri» sia
  // stato giusto. Se un giorno qualcuno li convertisse, queste righe dicono
  // esattamente cosa otterrebbe.
  {
    const page = await nuovaPagina(browser);

    const t1 = Date.now();
    const g1 = await attendiAbilitato(page, '#gia-abilitato', 5000);
    const d1 = Date.now() - t1;
    log('[C] Su un pulsante GIA\' abilitato torna true...', g1 === true);
    log('[C] ...e torna SUBITO: non ha verificato niente (< 250ms)', d1 < 250, d1 + 'ms');

    const t2 = Date.now();
    const g2 = await attendiVisibile(page, '#gia-visibile', 5000);
    log('[C] Su un elemento GIA\' visibile torna true subito', g2 === true && (Date.now() - t2) < 250);

    const t3 = Date.now();
    const g3 = await attendiClasse(page, '#con-classe', 'is-active', 5000);
    log('[C] Su un elemento che ha GIA\' la classe torna true subito', g3 === true && (Date.now() - t3) < 250);

    // E il caso simmetrico su attendiNascosto: un elemento che non esiste
    // AFFATTO e' «nascosto» per Playwright. E' il limite dichiarato in testa
    // ad attese.js, e vale la pena vederlo invece di leggerlo.
    const g4 = await attendiNascosto(page, '#non-esiste-proprio', 1500);
    log('[C] attendiNascosto dice true anche su un elemento che NON ESISTE (limite dichiarato)', g4 === true);

    await page.close();
  }

  await browser.close();
  console.log('');
  console.log('=== ATTESE CONDIVISE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
