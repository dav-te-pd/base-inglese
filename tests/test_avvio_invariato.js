// PROTEGGE: che il passo 22 SPOSTI il codice in file separati senza cambiare
// COSA l'app fa all'avvio — quali moduli si registrano e in che ordine, quali
// pulizie, con quanti file, e su quale schermata si arriva.
//
// ⚠️ NASCE PRIMA DELLA PRIMA ESTRAZIONE, ED E' VOLUTO — la stessa ragione per
// cui test_listener_una_volta.js e' nato prima della prima conversione del
// 21-quater: *un test che nasce INSIEME al refactor che dovrebbe proteggere non
// protegge niente, perche' la prima volta che il meccanismo e' messo alla prova
// e' anche la prima volta che qualcuno lo guarda.*
//
// ⚠️ E IL GUASTO CHE PRENDE E' SILENZIOSO, come quelli del 21-quater. Spezzare
// un file in quattro puo':
//   - registrare un modulo DOPO il boot  → la mappa apre e non trova il kind;
//   - registrarne uno DUE volte          → BI.registraModulo alza un'eccezione,
//                                          questo si vede;
//   - perderne uno del tutto             → un passo della mappa muto;
//   - cambiare l'ORDINE                  → oggi innocuo, domani no, e nessun
//                                          test guarderebbe.
// Nessuno dei quattro fa rumore al boot: l'app parte, la schermata di login
// compare, e il guasto aspetta il primo studente che tocca quel passo.
//
// LA FONTE E' IL BASELINE, NON IL SORGENTE (regola 44 sull'elenco): le attese
// stanno in tests/BASELINE-AVVIO.txt, un file a parte. Derivarle da index.html
// significherebbe misurarsi contro se stessi — togliendo una registrazione
// sparirebbe anche dall'attesa, e il test resterebbe verde.
//
// LIMITE DICHIARATO: dice cosa succede all'avvio, NON cosa puo' stare in quale
// strato. La domanda «se sposto X, cosa gli manca» la serve
// tests/tools/dipendenze.js, che non e' nella suite apposta — vedi il commento
// in testa a tests/avvio-census.js.

const fs = require('fs');
const { launchBrowser, APP_URL, bloccaFontEsterni, repoPath } = require('./test-env');
const { fotografiaAvvio, aRighe } = require('./avvio-census');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

function baseline() {
  return fs.readFileSync(repoPath('tests', 'BASELINE-AVVIO.txt'), 'utf8')
    .split('\n').filter(function (r) { return r && r.indexOf('#') !== 0; });
}

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await bloccaFontEsterni(page);
  await page.goto(APP_URL);

  // ⚠️ SE L'APP NON PARTE, QUESTO TEST DEVE FALLIRE — NON MORIRE.
  //
  // Trovato falsificando, il 2026-09-17: registrando due volte lo stesso kind,
  // `BI.registraModulo` alza un'eccezione al boot, nessuna vista viene montata,
  // e la forma precedente moriva qui con un `TimeoutError` dopo 15 secondi —
  // senza dire che l'app era esplosa, e con l'eccezione vera gia' in console e
  // mai riportata.
  //
  // *E' la famiglia ⓪-septies: un test che MUORE non e' un test che FALLISCE,
  // e si presenta proprio dove il guasto e' peggiore — qui, il caso in cui
  // l'app non parte affatto.* La riga sotto trasforma il caso peggiore nella
  // riga rossa piu' chiara del file, e ci mette dentro l'errore di pagina, che
  // e' la diagnosi vera.
  const partita = await page.waitForSelector('.view.is-active', { timeout: 15000 })
    .then(function () { return true; }).catch(function () { return false; });
  if (!partita) {
    log('[0] L\'app parte: una vista e\' attiva dopo il boot', false,
      errori.length ? ('eccezione al boot: ' + errori.join(' | ')) : 'nessuna vista attiva e nessun errore in console');
    await browser.close();
    console.log('\n=== AVVIO INVARIATO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
    process.exit(1);
  }
  log('[0] L\'app parte: una vista e\' attiva dopo il boot', true);
  const foto = await fotografiaAvvio(page);
  const righe = aRighe(foto);
  const atteso = baseline();

  const mancanti = atteso.filter(function (r) { return righe.indexOf(r) === -1; });
  log('[A] Ogni riga del baseline dell\'avvio c\'e\' ancora', mancanti.length === 0, mancanti.join(' | '));

  const nuove = righe.filter(function (r) { return atteso.indexOf(r) === -1; });
  log('[B] E non ne sono comparse di nuove senza aggiornare il baseline', nuove.length === 0, nuove.join(' | '));

  // ⚠️ L'ORDINE E' UN'ASSERZIONE A SE', E LA RAGIONE SCRITTA QUI PRIMA ERA
  // FALSA — corretta il 2026-09-17, misurando, dieci minuti dopo averla
  // scritta.
  //
  // Diceva: «[A] e [B] confrontano insiemi, quindi uno scambio fra due moduli
  // le lascia verdi». **Misurato scambiando `matchEngIta` e `matchItaEng`:
  // cadono tutte e tre.** Le righe portano il numero d'ordine (`modulo 7
  // matchEngIta`), quindi uno scambio cambia il TESTO di due righe e [A]/[B]
  // lo vedono come una sparita e una comparsa.
  //
  // *La conclusione reggeva, la motivazione no: e' la ⓪-quater, e stavolta su
  // un commento appena scritto. Una falsificazione fatta per confermare una
  // previsione l'ha smentita — che e' il motivo per cui si scrive l'attesa
  // PRIMA: se non l'avessi scritta, avrei letto tre rossi e detto «funziona».*
  //
  // Quello che [C] fa davvero, ed e' il motivo per cui resta: **nomina il
  // guasto**. Dice «prima differenza: modulo 7 matchItaEng» invece di lasciar
  // dedurre un riordino da una coppia sparita/comparsa, che somiglia a una
  // perdita piu' che a uno scambio. E se un giorno le righe perdessero il
  // numero d'ordine, sarebbe l'unica a vederlo.
  log('[C] E sono nello stesso ORDINE', righe.join('\n') === atteso.join('\n'),
    righe.length !== atteso.length ? ('righe ' + righe.length + ' contro ' + atteso.length)
      : ('prima differenza: ' + (righe.find(function (r, i) { return r !== atteso[i]; }) || '(nessuna)')));

  // ⚠️ I CONTI, scritti come numeri e non dedotti dalle righe: un numero in
  // un'asserzione si legge in un secondo quando il baseline cambia, e dice
  // SUBITO se il cambiamento e' quello atteso. Sono i tre che il passo 22
  // tocchera' di proposito.
  log('[D] I moduli registrati al boot sono 14', foto.moduli.length === 14, String(foto.moduli.length));
  log('[D] Le pulizie registrate sono 5', foto.pulizie.length === 5, String(foto.pulizie.length));
  // ⚠️ LA DESCRIZIONE LA SCRIVE LA FOTOGRAFIA, NON CHI SCRIVE IL TEST — dal
  // 2026-09-17, e serve ai SEI STRATI CHE VENGONO DOPO.
  //
  // Prima diceva «4 (2 esterni + 2 inline)», poi «4 (3 esterni + 1 inline)».
  // **Ogni estrazione sposta un pezzo da inline a esterno, quindi ogni
  // descrizione che conta i due gruppi diventa falsa SENZA CHE IL NUMERO
  // CAMBI** — cioe' resta verde e falsa, e nessuna corsa puo' accorgersene.
  // *E' la stessa forma dei tempi citati invece che rimisurati (regola 38) e
  // della finestra fissa di 400 caratteri: un valore esatto per il codice di
  // ieri e falso per quello di oggi, senza cambiare una cifra.*
  //
  // Il conto atteso resta scritto a mano — quello DEVE essere una decisione,
  // ed e' la riga che cambia quando uno strato esce. La composizione no: si
  // legge da cio' che si e' appena misurato.
  const esterni = foto.script.filter(function (s) { return s !== '(inline)'; }).length;
  const inline = foto.script.length - esterni;
  //
  // ⚠️ LA STORIA DEL NUMERO, perche' e' la riga che ogni estrazione tocca:
  //   4  fino al 2026-09-17 (2 esterni + 2 inline, poi 3 + 1: stesso numero)
  //   5  dal 2026-09-17, estrazione dello strato `progressi`
  //   6  dal 2026-09-17, estrazione dello strato `identita`
  //   7  dal 2026-09-18, estrazione dello strato `audio`
  //   8  dal 2026-09-18, estrazione dei `suoni` — ⚠️ e la riga sopra diceva
  //      «l'ultimo del 22»: falsa dopo un giorno, il 22 era chiuso per gli
  //      strati e non per i moduli
  //   9  dal 2026-09-18, estrazione di `quiz-engine`
  //  10  dal 2026-09-18, estrazione di `dati`
  //
  // ⚠️ E QUESTO ROSSO E' IL MECCANISMO CHE FUNZIONA, NON UN GUASTO: e' l'unica
  // riga del file che un'estrazione DEVE far cadere. *Non era nella previsione
  // scritta prima dell'estrazione di `progressi` — la previsione nominava
  // `BASELINE-AVVIO.txt` e si fermava li', mentre il numero vive in DUE posti.
  // Il rosso e' arrivato dalla suite invece che dalla previsione, ed e' uno
  // scarto fra i due da ricordare al prossimo strato.*
  // ⚠️ E IL 2026-09-18 LO SCARTO SI E' RIPETUTO, con l'avviso scritto QUI
  // SOPRA: estraendo `app/orchestrazione.js` non ho previsto ne' il baseline
  // ne' questa riga, e il rosso e' arrivato di nuovo dalla suite. *Un avviso
  // scritto accanto alla riga non impedisce di non leggerlo* — e' la stessa
  // forma della regola 42: un limite dichiarato dice dove non guardi, non ti
  // impedisce di fidarti. **La difesa che ha funzionato tutte le volte e'
  // un'altra: scrivere il NUMERO atteso prima, e guardare lo scarto.**
  // ⚠️ 15 -> 16 col PRIMO MODULO (`app/repeataloud.js`, 2026-09-19). Lo
  // scarto stavolta era previsto: il numero atteso e' stato scritto prima di
  // lanciare, ed e' la difesa che ha funzionato tutte le volte.
  // ⚠️ 18 -> 19 col QUARTO MODULO (`app/speedmatch.js`). Numero atteso
  // scritto prima di lanciare, come sempre.
  // ⚠️ 19 -> 20 col QUINTO (`app/voice.js`), e stavolta e' L'UNICA riga del
  // baseline che cambia: l'ordine dei moduli e quello delle pulizie restano
  // identici. Avevo dichiarato che sarebbero cambiati, e la misura mi ha
  // smentito — la dichiarazione e' stata corretta verso la misura.
  // ⚠️ 20 -> 21 col SESTO E ULTIMO (`app/dialogo.js`). I sei moduli sono
  // fuori: questo numero smette di salire per l'estrazione dei moduli.
  // ⚠️ 21 -> 22 col PASSO B (`app/sessione.js`).
  log('[D] I file di script sono 22 (' + esterni + ' esterni + ' + inline + ' inline)',
    foto.script.length === 22, foto.script.join(', '));

  // ⚠️ E QUESTA E' LA RIGA CHE IL 22 PUO' RENDERE FALSA, ed e' l'unica del
  // file messa qui per quello: `moduliCaricatiAlBoot` dice che ogni modulo e'
  // gia' nel registro quando la mappa apre. Il 21-ter ha scritto il messaggio
  // d'errore con le due cause distinte per il giorno in cui non lo sara' piu'.
  // Finche' e' `true`, quel ramo dell'errore non e' mai stato esercitato.
  log('[E] Tutti i moduli sono caricati al boot (e il 22 puo\' cambiarlo, dichiarandolo)',
    foto.caricatiAlBoot === true, String(foto.caricatiAlBoot));

  log('[E] Il boot finisce sulla schermata di login', foto.vista === 'view-onboarding', foto.vista);

  await page.close();
  await browser.close();
  console.log('\n=== AVVIO INVARIATO SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  if (failed) process.exit(1);
}
run();
