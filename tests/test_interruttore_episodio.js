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
// rotto (docs/decisioni.md, i quattro valori ricopiati).
//
// LIMITE DICHIARATO: si guarda UN modulo (Meet the Story, il primo che mostra
// contenuto dell'episodio). Che tutti gli altri ventuno passi leggano il file
// giusto non e' verificato qui: quello che li lega al file e' il descrittore
// dell'episodio, e un descrittore sbagliato su un solo modulo passerebbe.

const fs = require('fs');
const { launchBrowser, APP_URL, repoPath } = require('./test-env');

const BASE = APP_URL;
let passed = 0, failed = 0;
function log(name, ok, extra) {
  if (ok) { passed++; console.log('  PASS  ' + name); }
  else { failed++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}

// La prima battuta inglese del grado D di un episodio, letta dal suo file.
function primaBattuta(file) {
  const dati = JSON.parse(fs.readFileSync(repoPath.apply(null, file.split('/')), 'utf8'));
  return dati.levels.D.items[0].english;
}

async function apri(page, utente) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
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
  await page.evaluate(a => localStorage.setItem('baseinglese:modules:' + a.ep + ':' + a.u,
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

  // ============ [B] Scegliere il secondo episodio apre il secondo episodio ============
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await apri(page, 'InterruttoreB');
    await apriPannello(page);
    const secondo = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#cfg-episodioCorrente option')).map(o => o.value)[1]);
    const ripartita = await scegliEpisodio(page, secondo);
    log('[B] Scegliere un episodio fa ripartire la pagina', ripartita,
      'la scelta e\' rimasta solo in memoria: senza ricarica la mappa resta quella di prima');
    if (ripartita) {
      const salvato = await page.evaluate(() => {
        const ov = localStorage.getItem('baseinglese:configOverrides');
        return ov ? JSON.parse(ov).episodioCorrente : null;
      });
      log('[B] La scelta e\' salvata negli override, non solo in memoria', salvato === secondo, String(salvato));
      const battute = await battuteDiMeetTheStory(page, secondo, 'InterruttoreB');
      const attesa2 = primaBattuta('data/it/a1-episodio2-inglese.json');
      const attesa1 = primaBattuta('data/it/a1-episodio1-inglese.json');
      log('[B] Meet the Story mostra la prima battuta del file dell\'episodio scelto',
        battute.indexOf(attesa2) !== -1, 'cercata: ' + attesa2);
      log('[B] E NON quella dell\'episodio 1: il contenuto e\' cambiato davvero',
        battute.indexOf(attesa1) === -1, 'trovata anche: ' + attesa1);
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
        battute.indexOf(primaBattuta('data/it/a1-episodio1-inglese.json')) !== -1);
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

  await browser.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed === 0 ? 0 : 1);
})();
