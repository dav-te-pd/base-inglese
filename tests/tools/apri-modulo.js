// Apre un modulo nell'app, come lo vedrebbe uno studente arrivato fin lì, e
// ne stampa lo stato — con uno screenshot se lo si chiede.
//
// Perché esiste: guardare davvero la schermata trova cose che nessun test
// vede. In questo progetto, in un giro solo: un badge fermo al nome di un
// modulo che non esiste più, un sottotitolo sbagliato, e il terzo pulsante
// di una riga finito fuori dallo schermo a 400px. Ogni volta si riscriveva
// lo stesso script usa-e-getta; qui è scritto una volta.
//
//   node tests/tools/apri-modulo.js whyWeSayIt
//   node tests/tools/apri-modulo.js dialogoContinuo --shot=dialogo.png
//   node tests/tools/apri-modulo.js repeatAloud --larghezza=900
//
// I passi precedenti vengono segnati come completati da soli (module-order),
// così il modulo è raggiungibile senza doverli fare a mano.

const { launchBrowser, APP_URL, outputPath } = require('../test-env');
const { stepsBefore, stepIds } = require('../module-order');

const args = process.argv.slice(2);
const moduleId = args.find(function (a) { return a.indexOf('--') !== 0; });
function opzione(nome, def) {
  const trovata = args.find(function (a) { return a.indexOf('--' + nome + '=') === 0; });
  return trovata ? trovata.split('=')[1] : def;
}

if (!moduleId) {
  console.log('Uso: node tests/tools/apri-modulo.js <idPasso> [--shot=nome.png] [--larghezza=400] [--altezza=900]');
  console.log('\nPassi disponibili, nell\'ordine della mappa:');
  stepIds().forEach(function (id, i) { console.log('  ' + String(i + 1).padStart(2) + '  ' + id); });
  process.exit(1);
}

// La sintesi vocale non c'è in un browser senza audio, e senza questo mock
// i moduli che parlano restano fermi ad aspettare.
const mockVoce = () => {
  const fakeSynth = {
    speaking: false, _current: null,
    speak(u) { this.speaking = true; this._current = u; if (u.onstart) u.onstart(); u._t = setTimeout(() => { if (this._current === u) { this.speaking = false; this._current = null; } if (u.onend) u.onend(); }, 30); },
    cancel() { const u = this._current; if (u) { this.speaking = false; this._current = null; clearTimeout(u._t); if (u.onend) u.onend(); } },
    pause() {}, resume() {}, getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.onstart = null; this.onend = null; this.onerror = null; };
};

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage({
    viewport: { width: Number(opzione('larghezza', 400)), height: Number(opzione('altezza', 900)) }
  });
  const errori = [];
  page.on('pageerror', function (e) { errori.push(e.message); });
  await page.addInitScript(mockVoce);

  const utente = 'Anteprima';
  await page.goto(APP_URL);
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode');
  await page.evaluate(function (a) {
    localStorage.setItem('baseinglese:modules:episode1:' + a.utente, JSON.stringify({ completed: a.prima }));
    // Le schermate di spiegazione a tutto schermo si saltano: qui interessa
    // il modulo, non la sua introduzione.
    a.kinds.forEach(function (k) { localStorage.setItem('baseinglese:introDismissed:' + k + ':' + a.utente, '1'); });
  }, { utente: utente, prima: stepsBefore(moduleId), kinds: ['mappaEpisodio'].concat(stepIds().map(function (id) { return id.replace(/-\d+$/, ''); })) });
  await page.click('#go-episode');
  await page.waitForFunction(function () { return document.querySelectorAll('#module-list [data-module]').length > 0; });
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(700);

  const stato = await page.evaluate(function () {
    const vista = document.querySelector('.view.is-active');
    const visibile = function (el) { return !!el && el.getClientRects().length > 0; };
    return {
      vista: vista ? vista.id : null,
      // Il primo h1 della vista può essere quello della schermata di
      // introduzione, che è nascosta: si prende quello che si vede davvero.
      titolo: (Array.from(document.querySelectorAll('.view.is-active h1')).find(visibile) || {}).textContent,
      categoria: (document.querySelector('.view.is-active .module-row-type') || {}).textContent,
      // Un testo più largo del suo contenitore è il difetto che a schermo si
      // vede subito e in un test non si vede affatto.
      fuoriDaiBordi: Array.from(document.querySelectorAll('.view.is-active button, .view.is-active p'))
        .filter(function (el) { return visibile(el) && el.getBoundingClientRect().right > document.documentElement.clientWidth + 1; })
        .map(function (el) { return (el.textContent || '').trim().slice(0, 40); }),
      segnapostoGrezzi: Array.from(document.querySelectorAll('.view.is-active *'))
        .filter(function (el) { return el.children.length === 0 && /\{\{/.test(el.textContent); })
        .map(function (el) { return el.textContent.trim().slice(0, 40); })
    };
  });

  console.log('Modulo: ' + moduleId);
  Object.keys(stato).forEach(function (k) { console.log('  ' + k + ': ' + JSON.stringify(stato[k])); });
  console.log('  erroriJS: ' + errori.length + (errori.length ? ' -> ' + errori[0] : ''));

  const shot = opzione('shot', null);
  if (shot) {
    const percorso = outputPath(shot);
    await page.screenshot({ path: percorso, fullPage: true });
    console.log('\nScreenshot: ' + percorso);
  }
  await browser.close();
})();
