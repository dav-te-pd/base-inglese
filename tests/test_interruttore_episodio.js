// PROTEGGE: che scegliere un episodio nel Pannello Admin apra DAVVERO quello,
// con il suo contenuto. E' l'unica strada che esiste oggi per raggiungere un
// episodio diverso dal primo: se smette di funzionare, l'app continua a
// funzionare benissimo — mostrando sempre lo stesso episodio — e nessuno se ne
// accorge finche' non prova a collaudare il secondo.
//
// PROTEGGE ANCHE che l'episodio 2 sia collegato: le battute che si vedono sono
// quelle del SUO file dati, non quelle dell'episodio 1. Un episodio "collegato"
// che serve il contenuto dell'altro e' il difetto peggiore di questa famiglia,
// perche' la schermata e' piena e ha l'aria giusta.
//
// COME: il menu non si confronta con un elenco scritto qui — si confronta con
// gli episodi che dichiarano la propria sequenza in CONFIG.episodes, che per la
// regola 4 sono tutti e soli gli episodi che esistono. Cosi' un episodio nuovo
// entra in questo test senza che nessuno lo aggiorni, ed e' il caso in cui
// serve.
//
// Il contenuto atteso si legge dal file dati su disco, mai ricopiato qui: una
// battuta ricopiata in un test invecchia e rompe la CI senza che niente sia
// rotto (docs/decisioni-stato.md, i quattro valori ricopiati).
//
// PROTEGGE ANCHE, dal 2026-09-09 (C.4): che il pulsante di casa e il badge in
// mappa nominino lo STESSO episodio. La stringa era incollata nell'HTML e
// nessuno gliela riscriveva, quindi sull'episodio 2 il pulsante diceva
// "Episodio 1" mentre la mappa, un tocco dopo, diceva "Episodio 2".
// L'asserzione confronta le due schermate FRA LORO, non con un testo atteso
// scritto qui: e' il requisito vero, e un badge ricopiato invecchierebbe.
//
// LIMITE DICHIARATO: si guarda UN modulo (Meet the Story, il primo che mostra
// contenuto dell'episodio). Che tutti gli altri ventuno passi leggano il file
// giusto non e' verificato qui: quello che li lega al file e' il descrittore
// dell'episodio, e un descrittore sbagliato su un solo modulo passerebbe.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath, strutturaCorso, attendiPrimaSchermata , fileEdizione } = require('./test-env');

const BASE = APP_URL;
let passed = 0, failed = 0;
function log(name, ok, extra) {
  if (ok) { passed++; console.log('  PASS  ' + name); }
  else { failed++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}

// La prima battuta inglese del grado D di un episodio, letta dal suo file.
//
// ⚠️ SI PARTE DALL'ID, NON DAL PERCORSO — passo 1.19, 2026-09-22. Prima i due
// percorsi erano incollati (`...inglese-it-aircraft-door.json` e
// `...-gate.json`), cioe' il test sapeva QUALE episodio fosse il secondo. Con
// l'ordine diventato un dato (passo 1.13), scambiare le due righe della
// sequenza faceva andare rossi [B] e [C] su un'app che funzionava benissimo:
// *non e' un difetto dell'app, e' il test che dava per scontato che `gate`
// fosse il primo.* Il nome del file si costruisce come lo costruisce l'app —
// `fileEdizione` di test-env.js, il gemello di `percorsoEdizione` (regola 24).
function primaBattuta(episodeId) {
  const dati = JSON.parse(fs.readFileSync(fileEdizione(episodeId + '.json'), 'utf8'));
  return dati.levels.D.items[0].english;
}

// `override` e' facoltativo: quando c'e', si scrive nel magazzino DOPO il
// clear e PRIMA del reload, cosi' l'app parte gia' con quel valore invece di
// riceverlo a schermata aperta. E' la stessa strada del Pannello Admin —
// `applyConfigOverrides` rimette gli override sopra il file di struttura —
// quindi il test prova il meccanismo vero, non una scorciatoia sua.
async function apri(page, utente, override) {
  await page.goto(BASE);
  await page.evaluate((ov) => {
    localStorage.clear();
    if (ov) localStorage.setItem('baseinglese:configOverrides', JSON.stringify(ov));
  }, override || null);
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
}

// Il pannello si apre digitando "config" fuori da un campo di testo, come lo
// apre chi lo usa. I gruppi sono <details> chiusi: si aprono tutti, altrimenti
// il campo esiste ma non e' visibile e il click non arriva.
async function apriPannello(page) {
  await page.evaluate(() => document.body.click());
  for (const c of 'config') await page.keyboard.press(c);
  await page.waitForSelector('#config-panel-overlay.is-open', { timeout: 5000 });
  await page.evaluate(() => document.querySelectorAll('#config-panel-body details').forEach(d => { d.open = true; }));
  await page.waitForSelector('#cfg-episodioCorrente', { state: 'visible', timeout: 5000 });
}

// Apre Meet the Story dell'episodio aperto e restituisce il testo delle
// battute. Il passo si raggiunge segnando completati quelli che lo precedono
// NELLA SEQUENZA di quell'episodio, letta dall'app: un elenco scritto qui
// varrebbe solo per l'ordine di oggi.
// Sceglie un episodio dal menu e aspetta la pagina NUOVA. L'attesa non guarda
// APP_CONFIG.episodioCorrente da solo: quel valore cambia in memoria appena si
// tocca il menu, ricarica o no, quindi un'attesa su di lui direbbe "fatto"
// anche con la ricarica rotta — e il test morirebbe piu' avanti, dove non si
// capisce piu' perche'. Si aspetta invece qualcosa che SOLO una pagina
// ripartita puo' dare: il pannello chiuso, che nessuna riga di codice richiude
// da sola.
async function scegliEpisodio(page, id) {
  await page.selectOption('#cfg-episodioCorrente', id);
  try {
    await page.waitForFunction(atteso => {
      const overlay = document.getElementById('config-panel-overlay');
      return !!overlay && !overlay.classList.contains('is-open') &&
        window.APP_CONFIG && window.APP_CONFIG.episodioCorrente === atteso;
    }, id, { timeout: 10000 });
  } catch (e) {
    return false;
  }
  await page.waitForSelector('#go-episode', { state: 'visible', timeout: 10000 });
  return true;
}

async function apriMappa(page) {
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
}

async function battuteDiMeetTheStory(page, episodeId, utente) {
  await apriMappa(page);
  const passi = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#module-list .module-row')).map(r => r.getAttribute('data-module')));
  const indice = passi.indexOf('meetTheStory');
  if (indice === -1) throw new Error('meetTheStory non e\' nella mappa di ' + episodeId + ': ' + passi.join(','));
  await page.evaluate(a => localStorage.setItem(BI.moduleProgressKey(a.ep, a.u),
    JSON.stringify({ completed: a.c })), { ep: episodeId, u: utente, c: passi.slice(0, indice) });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await apriMappa(page);
  await page.click('[data-module="meetTheStory"]');
  await page.waitForFunction(() => {
    const b = document.getElementById('story-cards-body');
    return !!b && b.textContent.trim().length > 0;
  }, { timeout: 15000 });
  return page.evaluate(() => document.getElementById('story-cards-body').textContent);
}

(async () => {
  const browser = await launchBrowser();

  // ============ [A] Il menu elenca tutti e soli gli episodi dichiarati ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await apri(page, 'InterruttoreA');
    await apriPannello(page);
    const stato = await page.evaluate(() => ({
      opzioni: Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value),
      dichiarati: Object.keys(window.APP_CONFIG.episodes),
      selezionato: document.getElementById('cfg-episodioCorrente').value,
      corrente: window.APP_CONFIG.episodioCorrente
    }));
    log('[A] Il menu elenca tutti e soli gli episodi che dichiarano una sequenza',
      stato.opzioni.slice().sort().join(',') === stato.dichiarati.slice().sort().join(','),
      'menu: ' + stato.opzioni.join(',') + ' | dichiarati: ' + stato.dichiarati.join(','));
    log('[A] Piu\' di un episodio da scegliere: altrimenti l\'interruttore non e\' un interruttore',
      stato.opzioni.length > 1, 'opzioni: ' + stato.opzioni.length);
    log('[A] Il menu parte sull\'episodio corrente, non su una voce a caso',
      stato.selezionato === stato.corrente, stato.selezionato + ' vs ' + stato.corrente);
    log('[A] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // ============ [O] L'ordine degli episodi e' un dato del corso (passo 1.13) ============
  //
  // COSA SI PERDE SENZA QUESTO BLOCCO. Prima di 1.13 l'ordine degli episodi
  // era l'ordine in cui le chiavi stavano scritte dentro `episodes`: nessuna
  // riga lo dichiarava, e riordinarlo voleva dire riordinare un oggetto JSON
  // sperando che qualcuno lo notasse. Adesso lo dichiara `episodeSequences`,
  // e questo blocco verifica che sia DAVVERO quello a decidere — non che sia
  // giusto oggi, che lo era anche prima.
  //
  // ⚠️ COME, e non nel modo ovvio: l'ordine del file e quello delle chiavi
  // OGGI COINCIDONO, quindi confrontare il menu con l'ordine del file sarebbe
  // vero con tutt'e due le forme (regola 44 — vera per costruzione). Si
  // ROVESCIA la sequenza negli override e si guarda se il menu la segue: la
  // forma vecchia non si muoveva, questa si muove.
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await apri(page, 'InterruttoreO', { episodeSequences: { 'corso-inglese-a1': ['aircraft-door', 'gate'] } });
    await apriPannello(page);
    const rovesciato = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value));
    console.log('    menu con la sequenza rovesciata: ' + rovesciato.join(', '));
    log('[O] Il menu segue l\'ordine dichiarato dal corso, non quello delle chiavi',
      rovesciato.join(',') === 'aircraft-door,gate', rovesciato.join(','));
    log('[O] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // ============ [P] I due casi asimmetrici: chi manca e chi avanza ============
  //
  // Sono le due strade che `resolveEpisodeOrder` tratta in modo DIVERSO, ed e'
  // il caso piu' diverso nel senso della regola 42: non il piu' complicato, ma
  // quello a cui manca qualcosa.
  //
  //   - un id ELENCATO che non esiste  -> si toglie, e si dice
  //   - un episodio che ESISTE e non e' elencato -> finisce IN CODA, e si dice
  //
  // La seconda e' la meno ovvia e la piu' importante: l'alternativa sarebbe
  // farlo sparire, cioe' un episodio scritto e invisibile senza niente che lo
  // dica — un guasto muto (regola 37).
  //
  // ⚠️ LIMITE DICHIARATO, misurato falsificando (regola 32): rimettendo la
  // forma vecchia (`Object.keys(EPISODES)`) **due di queste tre asserzioni
  // restano verdi**, e non per caso — con due soli episodi il menu di allora
  // e l'ordine di adesso danno la stessa lista. L'unica che DISTINGUE e' la
  // terza, «le due cose si dicono»: la forma vecchia non aveva niente da
  // dire, perche' non filtrava. *Le prime due valgono come dichiarazione del
  // comportamento scelto — la coda invece della sparizione — non come
  // misura: lo diventeranno al terzo episodio, quando le due liste potranno
  // finalmente essere diverse.*
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const avvisi = [];
    page.on('console', m => { if (m.type() === 'error') avvisi.push(m.text()); });
    // 'non-esiste' e' elencato e non c'e'; 'aircraft-door' c'e' e non e' elencato.
    await apri(page, 'InterruttoreP', { episodeSequences: { 'corso-inglese-a1': ['non-esiste', 'gate'] } });
    await apriPannello(page);
    const menu = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value));
    console.log('    menu: ' + menu.join(', ') + ' | avvisi: ' + avvisi.length);
    log('[P] L\'id elencato che non esiste non compare nel menu',
      menu.indexOf('non-esiste') === -1, menu.join(','));
    log('[P] L\'episodio non elencato NON sparisce: resta, in coda',
      menu.join(',') === 'gate,aircraft-door', menu.join(','));
    log('[P] E le due cose si DICONO, invece di succedere in silenzio',
      avvisi.some(t => t.indexOf('non esistono') !== -1) &&
      avvisi.some(t => t.indexOf('finiscono in coda') !== -1),
      avvisi.join(' | '));
    log('[P] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // ============ [B] Scegliere il secondo episodio apre il secondo episodio ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await apri(page, 'InterruttoreB');
    await apriPannello(page);
    const idsB = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value));
    const primo = idsB[0];
    const secondo = idsB[1];
    const ripartita = await scegliEpisodio(page, secondo);
    log('[B] Scegliere un episodio fa ripartire la pagina', ripartita,
      'la scelta e\' rimasta solo in memoria: senza ricarica la mappa resta quella di prima');
    if (ripartita) {
      const salvato = await page.evaluate(() => {
        const ov = localStorage.getItem('baseinglese:configOverrides');
        return ov ? JSON.parse(ov).episodioCorrente : null;
      });
      log('[B] La scelta e\' salvata negli override, non solo in memoria', salvato === secondo, String(salvato));
      // 2026-09-09 (C.4): le due schermate devono NOMINARE LO STESSO EPISODIO.
      // Il pulsante di casa aveva la stringa incollata nell'HTML e nessuno
      // gliela riscriveva: sull'episodio 2 diceva "Inizia Episodio 1" mentre la
      // mappa, un tocco dopo, diceva "Episodio 2" — due schermate della stessa
      // app che si contraddicevano.
      //
      // Non si confronta con un testo atteso scritto qui: si confronta il
      // pulsante CON IL BADGE IN MAPPA, che e' il requisito vero (le due
      // schermate concordano) e non una copia dell'implementazione. Un badge
      // ricopiato nel test invecchierebbe al primo episodio nuovo.
      // ⚠️ PRIMA SI ASPETTA CHE I TESTI DELL'INTERFACCIA SIANO ARRIVATI, e
      // l'attesa e' su una cosa che nessuna di queste due asserzioni legge
      // (regola 44). *Trovato dal censimento di 1.18 il 2026-09-25: sotto
      // contesa questa riga cadeva con `pulsante: "Inizia"` contro
      // `mappa: "Sulla porta dell'aereo"` — 1 giro su 5 a venti in parallelo.*
      //
      // ⚠️ E L'APP HA RAGIONE LEI, il difetto era qui. `scriviTestiHome`
      // (app/mappa.js) scrive il pulsante **solo se c'e' qualcosa da
      // scrivere**, e finche' `istruzioni-moduli.json` non arriva lascia
      // apposta la parola del markup — "Inizia" — invece di un pulsante muto;
      // poi riscrive quando i testi arrivano. *Questa riga leggeva nel mezzo.*
      //
      // L'approdo e' il SALUTO: `scriviTestiHome` scrive `#home-greeting` e
      // `#go-episode` **nella stessa chiamata sincrona**, quindi il saluto
      // cambiato garantisce che anche il pulsante sia stato riscritto. E non
      // puo' essere vero per costruzione: il markup dice `Ciao!`, il modello
      // dice `Ciao, {nome}!` — con un nome dentro, sempre diverso.
      await page.waitForFunction(
        () => (document.getElementById('home-greeting') || {}).textContent !== 'Ciao!',
        null, { timeout: 15000 });
      const pulsanteCasa = (await page.textContent('#go-episode')).trim();

      const battute = await battuteDiMeetTheStory(page, secondo, 'InterruttoreB');
      const badgeMappa = (await page.evaluate(() =>
        (document.getElementById('map-episode-badge') || {}).textContent || '')).trim();
      log('[B] Il pulsante di casa e il badge in mappa nominano lo stesso episodio',
        !!badgeMappa && pulsanteCasa.indexOf(badgeMappa) !== -1,
        'pulsante: "' + pulsanteCasa + '"  |  mappa: "' + badgeMappa + '"');
      // I due attesi si ricavano dagli ID del menu — `secondo` e `primo` —
      // invece di nominare due file: cosi' riordinare la sequenza degli
      // episodi non tocca questo test, che di quell'ordine non parla.
      const attesaScelto = primaBattuta(secondo);
      const attesaPrimo = primaBattuta(primo);
      log('[B] Meet the Story mostra la prima battuta del file dell\'episodio scelto',
        battute.indexOf(attesaScelto) !== -1, 'cercata: ' + attesaScelto + ' (' + secondo + ')');
      log('[B] E NON quella del primo: il contenuto e\' cambiato davvero',
        battute.indexOf(attesaPrimo) === -1, 'trovata anche: ' + attesaPrimo + ' (' + primo + ')');
    }
    log('[B] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // ============ [C] Si torna indietro: la scelta non e' a senso unico ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await apri(page, 'InterruttoreC');
    await apriPannello(page);
    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value));
    const andata = await scegliEpisodio(page, ids[1]);
    let ritorno = false;
    if (andata) {
      await apriPannello(page);
      ritorno = await scegliEpisodio(page, ids[0]);
    }
    log('[C] Si puo\' tornare indietro: la scelta non e\' a senso unico', andata && ritorno);
    if (andata && ritorno) {
      const battute = await battuteDiMeetTheStory(page, ids[0], 'InterruttoreC');
      log('[C] Tornando al primo episodio torna il contenuto del primo',
        battute.indexOf(primaBattuta(ids[0])) !== -1, 'primo del corso: ' + ids[0]);
    }
    log('[C] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // ============ [D] Un id che non esiste non lascia una pagina bianca ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    const consoleErrors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => localStorage.setItem('baseinglese:configOverrides',
      JSON.stringify({ episodioCorrente: 'episodio-che-non-esiste' })));
    await page.reload();
    await page.waitForSelector('#name-input', { state: 'visible', timeout: 10000 });
    await page.fill('#name-input', 'InterruttoreD');
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible', timeout: 10000 });
    log('[D] L\'app parte lo stesso: nessun errore JS che fermi lo script', errors.length === 0, errors.join(' | '));
    log('[D] E LO DICE in console invece di far credere che sia l\'episodio scelto',
      consoleErrors.some(t => t.indexOf('episodio-che-non-esiste') !== -1),
      consoleErrors.join(' | '));
    await page.close();
  }

  // ── [E] QUELLO CHE LEGGE LO STUDENTE È IL NOME, MAI «Episodio N» ─────
  //
  // È la regola `STRUTTURA-CORSO_031` messa in una riga: *«lo studente legge
  // solo il NOME dell'episodio — mai l'id, mai il nome del file, mai «Episodio
  // 1»»*. Fino al 2026-09-21 era violata **in ogni schermata**: il nome viveva
  // come `badge: 'Episodio 1'` dentro `app/catalogo.js`.
  //
  // ⚠️ LE DUE ASSERZIONI SONO DIVERSE E SERVONO TUTTE E DUE. La prima dice
  // che il nome giusto arriva; la seconda che quello sbagliato non c'è. *Un
  // domani il nome potrebbe arrivare e restarci accanto l'id, o il badge
  // potrebbe tornare a un valore scritto nel codice che «sembra» un nome: la
  // prima non lo vedrebbe.*
  //
  // Il nome atteso si legge dal file di struttura, mai ricopiato qui: un nome
  // ricopiato in un test invecchia al primo cambio di titolo.
  {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(BASE);
    await attendiPrimaSchermata(page);
    await page.fill('#name-input', 'NomeEp' + Date.now());
    await page.click('#onboarding-form button[type=submit]');
    await page.waitForSelector('#go-episode', { state: 'visible', timeout: 15000 });
    await page.click('#go-episode');
    await page.waitForSelector('#view-map.is-active', { timeout: 15000 });

    const atteso = strutturaCorso().episodes;
    const visto = await page.evaluate(function () {
      return {
        badge: document.getElementById('map-episode-badge').textContent.trim(),
        id: window.BI.episodioCorrente().id
      };
    });
    log('[E] Il badge in mappa mostra il NOME dell\'episodio aperto',
      visto.badge === atteso[visto.id].nome,
      JSON.stringify(visto) + ' atteso: ' + atteso[visto.id].nome);
    log('[E] ...e non \'Episodio N\', ne\' l\'id',
      !/^Episodio\s*\d/i.test(visto.badge) && visto.badge !== visto.id, JSON.stringify(visto));
    log('[E] Nessun errore JS', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  await browser.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed === 0 ? 0 : 1);
})();
