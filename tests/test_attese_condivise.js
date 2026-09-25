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
  attendiVisibile, attendiNascosto, attendiCheParla, attendiTono
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

// Il finto sintetizzatore, ridotto all'osso e con LA STESSA PROPRIETA' che
// conta: si spegne DA SOLO dopo un tempo, senza che nessuno lo fermi. E' la
// copia fedele di `mockInit`, dove il timer e' 500ms.
const PAGINA_VOCE = `
  <button id="tocca">tocca</button>
  <script>
    window.__playedTones = [];
    // defineProperty e non un assegnamento: su window.speechSynthesis esiste
    // gia' una proprieta' nativa, e un assegnamento semplice NON la sostituisce
    // — il finto resta ignorato e il test cade per il motivo sbagliato. E' la
    // stessa ragione per cui mockInit fa cosi'.
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speaking: false }, configurable: true
    });
    window.parlaPerMs = function (ms) {
      window.speechSynthesis.speaking = true;
      setTimeout(function () { window.speechSynthesis.speaking = false; }, ms);
    };
    window.suona = function (freq) { window.__playedTones.push({ freq: freq }); };
  </script>
`;

async function nuovaPaginaVoce(browser) {
  const page = await browser.newPage();
  await page.setContent(PAGINA_VOCE);
  return page;
}

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

    // ⚠️ UN RIFERIMENTO, NON UN NUMERO — 2026-09-25, censimento di 1.18.
    //
    // Qui c'era `< 250ms`, tre volte. **Un'asserzione su una durata da
    // orologio non puo' sopravvivere alla contesa PER COSTRUZIONE:** sotto
    // carico un round-trip verso il browser supera 250 ms comunque si comporti
    // il codice, e l'asserzione diventa una misura della macchina invece che
    // del comportamento. *Caduta a 40 processi in parallelo, e delle tre
    // sorelle ne e' caduta UNA: la firma di una soglia sfiorata, non di un
    // difetto.*
    //
    // ⚠️ E ALZARE IL NUMERO SAREBBE LA STESSA FORMA, col verde in piu' per un
    // po'. Quello che si vuole dire e' **«non ha aspettato»**, e «aspettare»
    // ha senso solo CONTRO qualcosa: si misura quindi un'attesa che aspetta
    // DAVVERO — mille millesimi, sulla stessa pagina e con lo stesso
    // round-trip — e si chiede che i casi «gia' veri» stiano sotto la sua
    // meta'.
    //
    // *Il conto che lo rende robusto: se `S` e' l'attesa vera (1000 ms) e `O`
    // il costo del round-trip, il riferimento vale `S+O` e l'immediato `O`.
    // La condizione `O < (S+O)/2` si riduce a **`O < S`**, cioe' regge finche'
    // un round-trip resta sotto il secondo — quattro volte il margine di
    // prima, e scritto come proprieta' invece che come costante.*
    await page.evaluate(() => window.cambiaDopo(1000));
    const tRif = Date.now();
    await attendiAbilitato(page, '#b', 5000);
    const riferimento = Date.now() - tRif;

    const t1 = Date.now();
    const g1 = await attendiAbilitato(page, '#gia-abilitato', 5000);
    const d1 = Date.now() - t1;
    log('[C] Su un pulsante GIA\' abilitato torna true...', g1 === true);
    log('[C] ...e torna SUBITO: non ha verificato niente (meno della meta\' di un\'attesa vera)',
        d1 < riferimento / 2, d1 + 'ms contro ' + riferimento + 'ms');

    const t2 = Date.now();
    const g2 = await attendiVisibile(page, '#gia-visibile', 5000);
    const d2 = Date.now() - t2;
    log('[C] Su un elemento GIA\' visibile torna true subito',
        g2 === true && d2 < riferimento / 2, d2 + 'ms contro ' + riferimento + 'ms');

    const t3 = Date.now();
    const g3 = await attendiClasse(page, '#con-classe', 'is-active', 5000);
    const d3 = Date.now() - t3;
    log('[C] Su un elemento che ha GIA\' la classe torna true subito',
        g3 === true && d3 < riferimento / 2, d3 + 'ms contro ' + riferimento + 'ms');

    // E il caso simmetrico su attendiNascosto: un elemento che non esiste
    // AFFATTO e' «nascosto» per Playwright. E' il limite dichiarato in testa
    // ad attese.js, e vale la pena vederlo invece di leggerlo.
    const g4 = await attendiNascosto(page, '#non-esiste-proprio', 1500);
    log('[C] attendiNascosto dice true anche su un elemento che NON ESISTE (limite dichiarato)', g4 === true);

    await page.close();
  }

  // ── [D] IL SUONO, e la prova contraria e' DIVERSA dalle altre ────────────
  // Nelle altre famiglie il pericolo era «lo stato era gia' vero». Qui e'
  // peggio: **aspettare renderebbe l'asserzione banalmente vera**, perche' la
  // voce si spegne DA SOLA. Un'attesa «finche' non parla piu'» torna vero
  // anche se nessuno ha toccato niente.
  //
  // ⚠️ QUESTO BLOCCO ESISTE PER UNA RAGIONE PRECISA, E VA LETTA PRIMA DI
  // SEMPLIFICARLO: nove punti della famiglia ③ leggono `speaking === false`
  // cinquanta millisecondi dopo un tocco, per verificare che sia stato IL TOCCO
  // a fermare l'audio (regola 16). Sono rimasti a tempo apposta. Senza le righe
  // qui sotto, fra sei mesi sembrano attese pigre da convertire, la conversione
  // si legge benissimo, e le nove asserzioni diventano vere per sempre senza
  // che nessun rosso lo dica. **Non e' un caso di prova senza motivo: e' il
  // pericolo reso eseguibile invece che descritto.**
  {
    const page = await nuovaPaginaVoce(browser);

    // attendiCheParla aspetta davvero, e sa fallire.
    await page.evaluate(() => setTimeout(() => window.parlaPerMs(3000), 500));
    const t0 = Date.now();
    log('[D] attendiCheParla vede la voce partire', (await attendiCheParla(page, 5000)) === true);
    log('[D] ...e ha aspettato', Date.now() - t0 >= 300, (Date.now() - t0) + 'ms');

    const page2 = await nuovaPaginaVoce(browser);
    log('[D] attendiCheParla torna false se nessuno parla',
        (await attendiCheParla(page2, 700)) === false);

    // ⚠️ LA PROVA CONTRARIA: la voce si spegne da sola, NESSUNO tocca niente,
    // e un'attesa «finche' non parla piu'» tornerebbe VERA lo stesso.
    await page2.evaluate(() => window.parlaPerMs(400));
    const spentaDaSola = await page2.waitForFunction(
      () => !window.speechSynthesis.speaking, null, { timeout: 3000 }
    ).then(() => true).catch(() => false);
    log('[D] ⚠️ «finche\' non parla piu\'» torna VERO anche senza nessun tocco', spentaDaSola === true);
    log('[D] ...ecco perche\' i nove punti della regola 16 restano a tempo: 50ms e\' la distanza fra «l\'ha fermato il tocco» e «e\' finito da solo»', true);

    // attendiTono: tre note contro una, e l'array che NON si svuota.
    //
    // ⚠️ I NUMERI QUI SOTTO NON SI LEGGONO DA APP_CONFIG, E NON E' UNA
    // DIMENTICANZA DEL PASSO 15. Questo file prova `attendiTono`, non l'app:
    // `window.suona` e' un finto, e 880 / 1046 / 1318 / 1568 sono **fixture**
    // scelte perche' sono riconoscibili, non perche' vengano da CONFIG. Se
    // domani il Traguardo suonasse tre note diverse, questo test dovrebbe
    // restare verde: sta verificando che la funzione sappia aspettare una
    // lista, non che l'app suoni quelle note.
    //
    // **La differenza fra una copia e una fixture e' se il valore INVECCHIA:
    // una copia rompe la CI quando la fonte cambia, una fixture no.**
    const page3 = await nuovaPaginaVoce(browser);
    await page3.evaluate(() => setTimeout(() => { window.suona(880); }, 300));
    log('[D] attendiTono vede una nota sola', (await attendiTono(page3, [880], 1, 4000)) === true);
    log('[D] ...e NON si accontenta di una quando ne chiede tre',
        (await attendiTono(page3, [880], 3, 700)) === false);
    await page3.evaluate(() => { window.suona(1046); window.suona(1318); window.suona(1568); });
    log('[D] attendiTono vede le tre note del Traguardo',
        (await attendiTono(page3, [1046, 1318, 1568], 3, 4000)) === true);
    // Se attendiTono svuotasse l'array per comodita', la nota di prima
    // sarebbe sparita — e le cinque asserzioni negative della stessa famiglia
    // (`length === 0`) diventerebbero vere a prescindere.
    const toniRimasti = await page3.evaluate(() => window.__playedTones.length);
    log('[D] attendiTono NON svuota __playedTones: l\'array e\' cumulativo e le negative ci contano',
        toniRimasti === 4, toniRimasti + ' toni');

    await page.close(); await page2.close(); await page3.close();
  }

  await browser.close();
  console.log('');
  console.log('=== ATTESE CONDIVISE SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
