// PROTEGGE: l'avviso "non riusciamo a sentirti" dei due moduli di voce —
// che compaia per ENTRAMBE le strade con cui un microfono rotto si manifesta,
// che salga di livello nell'ordine giusto, che al terzo livello impedisca di
// andare avanti, e che sparisca da solo appena il microfono torna a
// funzionare. Senza questo file, uno studente col microfono rotto puo' restare
// a fissare zero stelle credendo di pronunciare male.
//
// LE DUE STRADE, e sono la ragione per cui questo file esiste:
//   [A] premi e non parli — il timeout di silenzio chiude la registrazione e
//       la scarta. E' il gesto piu' comune di chi ha il microfono rotto.
//   [B] parli ma non viene riconosciuta nessuna parola — la registrazione
//       arriva a "Invia" e viene valutata.
// Fino al 2026-09-07 solo la [B] muoveva vcEmptyRecognitionStreak: il ramo del
// silenzio usciva prima, quindi la strada piu' battuta era l'unica che
// all'avviso non arrivava mai. Non erano due meccanismi in competizione, era
// uno che non veniva mai innescato. Se qualcuno rimette quel `return` prima
// dell'incremento, il blocco [A] diventa rosso.
//
// PROTEGGE ANCHE, e non e' un dettaglio: che il pannello stia FUORI da
// #vc-result. La strada [A] torna allo stato di riposo, dove #vc-result e'
// nascosto — da li' dentro l'avviso salirebbe di livello restando invisibile.
// E' il caso peggiore di tutti: un meccanismo che funziona e non si vede.
//
// COME: il riconoscimento finto del blocco [A] non consegna MAI un risultato e
// si chiude solo su stop() — che e' cio' che fa quello vero quando nessuno
// parla. Un mock che risponde subito (come quello di test_voicecoach.js) non
// passerebbe mai dal ramo del silenzio, cioe' eviterebbe l'unica cosa che li'
// si vuole misurare (CLAUDE.md regola 19).

const { launchBrowser, APP_URL } = require('./test-env');
const { stepsBefore } = require('./module-order');

const BASE = APP_URL;
// Il telefono è il posto in cui il problema si presenta: schermo corto, e il
// pannello che finisce sotto la piega se qualcuno lo mette nel posto sbagliato.
const TELEFONO = { width: 390, height: 664 };

// I due moduli nati dalla stessa componente di voce. L'id del secondo è
// ancora 'voiceCoach': è quello che il modulo unico aveva prima della
// separazione, e cambiarlo butterebbe i progressi già salvati.
const MODULI = [
  { id: 'voicePractice', nome: 'Voice Practice' },
  { id: 'voiceCoach', nome: 'Voice Check' }
];

// [A] Riconoscimento che non produce mai niente: premi e non parli.
const mockSilenzio = () => {
  class FakeUtterance { constructor(t) { this.text = t; } }
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(() => { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {}
    stop() { setTimeout(() => { if (this.onend) this.onend(); }, 5); }
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

// [B] Riconoscimento che risponde subito con quello che gli si mette in
// window.__vcTranscript — vuoto significa "sentito, ma nessuna parola".
const mockRisposta = () => {
  class FakeUtterance { constructor(t) { this.text = t; } }
  Object.defineProperty(window, 'speechSynthesis', { value: {
    speak(u) { if (u.onstart) u.onstart(); setTimeout(() => { if (u.onend) u.onend(); }, 10); },
    cancel() {}, pause() {}, resume() {},
    getVoices() { return [{ name: 'Fake', lang: 'en-US' }]; }, onvoiceschanged: null
  }, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  class FakeRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; }
    start() {
      setTimeout(() => {
        const t = window.__vcTranscript || '';
        if (this.onresult) this.onresult({ results: t ? [{ 0: { transcript: t }, isFinal: true, length: 1 }] : [] });
        if (this.onend) this.onend();
      }, 15);
    }
    stop() {}
    abort() { if (this.onend) this.onend(); }
  }
  window.SpeechRecognition = FakeRecognition;
  window.webkitSpeechRecognition = FakeRecognition;
};

async function apriModulo(page, utente, moduleId) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#name-input', { state: 'visible' });
  await page.fill('#name-input', utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForSelector('#go-episode', { state: 'visible' });
  await page.evaluate(({ utente, completed, moduleId }) => {
    localStorage.setItem('baseinglese:modules:gate:' + utente, JSON.stringify({ completed }));
    ['mappaEpisodio', 'personalizzazione', 'voicePractice', 'voiceCoach', moduleId]
      .forEach(k => localStorage.setItem('baseinglese:introDismissed:' + k + ':' + utente, '1'));
  }, { utente, completed: stepsBefore(moduleId), moduleId });
  await page.reload();
  await page.waitForSelector('#go-episode', { state: 'visible' });
  // Il timeout di silenzio vero è di secondi: qui si abbassa perché il test
  // non deve aspettare l'orologio (CLAUDE.md regola 19 — nessuna corsa contro
  // un timer: si accorcia l'attesa, non si indovina quando è passata).
  await page.evaluate(() => { window.APP_CONFIG.voiceCoach.silenceTimeoutSeconds = 0.4; });
  await page.click('#go-episode');
  const intro = await page.$('#map-intro-start-btn');
  if (intro) await intro.click().catch(() => {});
  await page.waitForSelector('#module-list .module-row', { state: 'visible', timeout: 15000 });
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForSelector('#vc-record-btn', { state: 'visible', timeout: 15000 });
}

// Tutto lo stato in un'unica valutazione sincrona (CLAUDE.md regola 19).
function leggiStato(page) {
  return page.evaluate(() => {
    const vis = el => !!el && el.getClientRects().length > 0;
    const pannello = document.getElementById('vc-mic-notice');
    const invia = document.getElementById('vc-send-btn');
    const avanti = document.getElementById('vc-next-btn');
    const avviso = document.getElementById('vc-silence-warning');
    return {
      avvisoSilenzio: vis(avviso),
      pannello: vis(pannello),
      titolo: (document.getElementById('vc-mic-notice-title') || {}).textContent || '',
      // Il livello si legge da COSA offre il pannello, non da una variabile
      // interna: 1 nessuna azione, 2 "ricomincia", 3 "torna alla mappa".
      livello: !vis(pannello) ? 0
        : document.getElementById('vc-mic-notice-map') ? 3
        : document.getElementById('vc-mic-notice-restart') ? 2 : 1,
      inviaOfferto: vis(invia),
      avantiBloccato: avanti ? avanti.disabled : null
    };
  });
}

async function run() {
  const browser = await launchBrowser();
  const results = [];
  const log = (msg, ok) => { results.push({ msg, ok }); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };
  const errori = [];

  for (const modulo of MODULI) {
    // ── [A] Il gesto vero: premi, non parlare, lascia scadere. Sei volte. ──
    {
      const page = await browser.newPage({ viewport: TELEFONO });
      page.on('pageerror', e => errori.push(modulo.nome + ' [A]: ' + String(e).slice(0, 140)));
      await page.addInitScript(mockSilenzio);
      await apriModulo(page, 'AvvisoMic' + modulo.id, modulo.id);

      const soglie = await page.evaluate(() => {
        const c = window.APP_CONFIG.voiceCoach.micIssue;
        return { uno: c.warningAt, due: c.restartSuggestionAt, tre: c.confirmedAt };
      });

      const giri = [];
      for (let i = 0; i < soglie.tre; i++) {
        await page.evaluate(() => document.getElementById('vc-record-btn').click());
        // Si aspetta l'EFFETTO del timeout — la registrazione che si e'
        // fermata da sola — non un numero di millisecondi sperato. Non si
        // aspetta piu' la riga di avviso: dal secondo tentativo quella riga
        // lascia il posto al pannello, e aspettarla appenderebbe il test
        // esattamente sul comportamento nuovo.
        await page.waitForFunction(() => {
          const b = document.getElementById('vc-record-btn');
          return b && !b.classList.contains('is-recording');
        }, null, { timeout: 10000 });
        giri.push(await leggiStato(page));
      }

      const attesoAl = n => n >= soglie.tre ? 3 : n >= soglie.due ? 2 : n >= soglie.uno ? 1 : 0;
      log('[A] ' + modulo.nome + ': una registrazione muta viene scartata, "Invia" non compare mai',
          giri.every(g => !g.inviaOfferto));
      log('[A] ' + modulo.nome + ': il primo tentativo muto dice solo che non ti abbiamo sentito',
          giri[0].avvisoSilenzio === true && giri[0].pannello === false);
      // Il cuore della correzione: premere e non parlare CONTA.
      if (!giri.every((g, i) => g.livello === attesoAl(i + 1))) {
        console.log('  livelli osservati: ' + giri.map(g => g.livello).join(',') +
                    ' — attesi: ' + giri.map((g, i) => attesoAl(i + 1)).join(','));
      }
      log('[A] ' + modulo.nome + ': premere e non parlare fa salire l\'avviso come le soglie di CONFIG',
          giri.every((g, i) => g.livello === attesoAl(i + 1)));
      log('[A] ' + modulo.nome + ': quando c\'e\' l\'avviso la riga sotto il microfono si toglie',
          giri.every(g => g.pannello ? g.avvisoSilenzio === false : g.avvisoSilenzio === true));
      // Il pannello sta fuori da #vc-result: se qualcuno lo rimettesse dentro,
      // qui sarebbe hidden=false e invisibile lo stesso — e nessuna delle
      // asserzioni sopra se ne accorgerebbe, perche' leggono la visibilita'
      // vera (getClientRects), non l'attributo.
      const visibileDavvero = await page.evaluate(() => {
        const p = document.getElementById('vc-mic-notice');
        const r = p.getBoundingClientRect();
        return { dentroResult: !!p.closest('#vc-result'), altezza: r.height };
      });
      log('[A] ' + modulo.nome + ': l\'avviso e\' fuori dal blocco del risultato e ha corpo a schermo',
          visibileDavvero.dentroResult === false && visibileDavvero.altezza > 0);
      // Al livello confermato il microfono si spegne come "Avanti". Prima
      // restava premibile e si poteva registrare a vuoto all'infinito: il
      // contatore era gia' alla soglia, quindi nessun tentativo in piu'
      // produceva nemmeno un avviso nuovo — un gesto senza piu' effetto che
      // sembrava utile. Restano due uscite, e sono l'unica cosa attiva.
      const fermo = await page.evaluate(() => {
        const vivo = el => !!el && el.getClientRects().length > 0 && !el.disabled;
        return {
          microfono: vivo(document.getElementById('vc-record-btn')),
          tornaMappa: vivo(document.getElementById('vc-mic-notice-map')),
          mappaInAlto: vivo(document.getElementById('voice-coach-back-map'))
        };
      });
      log('[A] ' + modulo.nome + ': al livello confermato il microfono e\' spento',
          fermo.microfono === false);
      log('[A] ' + modulo.nome + ': restano le due uscite, mappa in alto compresa',
          fermo.tornaMappa === true && fermo.mappaInAlto === true);

      await page.close();
    }

    // ── [B] La strada che l'avviso ha davvero: registrazioni sentite ma vuote ──
    {
      const page = await browser.newPage({ viewport: TELEFONO });
      page.on('pageerror', e => errori.push(modulo.nome + ' [B]: ' + String(e).slice(0, 140)));
      await page.addInitScript(mockRisposta);
      await apriModulo(page, 'AvvisoVuoto' + modulo.id, modulo.id);

      // Le soglie si leggono dalla configurazione, non si ricopiano qui: sono
      // regolabili dal Pannello Admin, e un numero scritto in un test
      // diventerebbe rosso il giorno in cui qualcuno le tara (regola 3).
      const soglie = await page.evaluate(() => {
        const c = window.APP_CONFIG.voiceCoach.micIssue;
        return { uno: c.warningAt, due: c.restartSuggestionAt, tre: c.confirmedAt };
      });

      // Dopo una valutazione il microfono sparisce: per registrare di nuovo si
      // passa da "Esercitati ancora" (solo Voice Practice, ed è a numero
      // chiuso) oppure dalla frase successiva. Qui si prende quello che c'è,
      // invece di dare per scontata la strada di uno dei due moduli.
      const tornaAlMicrofono = async () => {
        const gia = await page.evaluate(() => {
          const b = document.getElementById('vc-record-btn');
          return !!b && b.getClientRects().length > 0;
        });
        if (gia) return;
        await page.evaluate(() => {
          const vis = el => !!el && el.getClientRects().length > 0 && !el.disabled;
          const ancora = document.getElementById('voice-coach-retry-btn');
          if (vis(ancora)) { ancora.click(); return; }
          const avanti = document.getElementById('vc-next-btn');
          if (vis(avanti)) avanti.click();
        });
        await page.waitForFunction(() => {
          const b = document.getElementById('vc-record-btn');
          return !!b && b.getClientRects().length > 0;
        }, null, { timeout: 10000 });
      };

      const invia = async (trascrizione) => {
        await tornaAlMicrofono();
        await page.evaluate(t => { window.__vcTranscript = t; }, trascrizione);
        await page.evaluate(() => document.getElementById('vc-record-btn').click());
        await page.waitForFunction(() => {
          const b = document.getElementById('vc-send-btn');
          return b && b.getClientRects().length > 0;
        }, null, { timeout: 10000 });
        await page.evaluate(() => document.getElementById('vc-send-btn').click());
        await page.waitForTimeout(120);
        return leggiStato(page);
      };

      // Primo giro: si sale fino al livello che propone di ricominciare, e da
      // lì si verifica la RIPRESA — che è la metà che ci si dimentica di
      // provare. Ci si ferma prima del livello confermato apposta: da lì in
      // poi non si registra più (vedi sotto).
      const scala = [];
      for (let n = 1; n <= soglie.due; n++) scala.push(await invia(''));
      const attesoAl = n => n >= soglie.tre ? 3 : n >= soglie.due ? 2 : n >= soglie.uno ? 1 : 0;
      log('[B] ' + modulo.nome + ': l\'avviso sale di livello nell\'ordine delle soglie di CONFIG',
          scala.every((s, i) => s.livello === attesoAl(i + 1)));
      log('[B] ' + modulo.nome + ': fino a li\' "Avanti" non e\' bloccato dall\'avviso',
          scala.every(s => s.avantiBloccato !== true));

      // Se non abbiamo sentito niente, non c'e' niente da giudicare. Qui la
      // trascrizione vuota arriva DAVVERO a "Invia" e viene valutata: e' la
      // strada che scrive, e quella che il ramo del silenzio non copre.
      //
      // Perche' non nel blocco [A]: li' il riconoscimento non consegna mai un
      // risultato, quindi ogni registrazione finisce sul ramo del silenzio e
      // "Invia" non compare. Un'asserzione messa li' e' verde comunque, cioe'
      // vera per il motivo sbagliato — misurato: con la condizione tolta dal
      // codice, quella versione restava verde. Questa diventa rossa.
      const colori = await page.evaluate((utente) =>
        localStorage.getItem('baseinglese:mastery:gate:' + utente), 'AvvisoVuoto' + modulo.id);
      log('[B] ' + modulo.nome + ': registrazioni senza nessuna parola non scrivono nessun colore',
          colori === null || Object.keys(JSON.parse(colori)).length === 0);

      const ripresa = await invia('hello');
      log('[B] ' + modulo.nome + ': una parola riconosciuta fa sparire l\'avviso',
          ripresa.pannello === false && ripresa.livello === 0);
      log('[B] ' + modulo.nome + ': dopo la ripresa "Avanti" resta disponibile',
          ripresa.avantiBloccato === false);

      await page.close();
    }

    // ── [C] Il livello confermato, su una pagina sua ──────────────────────
    // Non è pignoleria: ogni registrazione vuota consuma una frase, e i due
    // moduli ne hanno un numero finito (7 e 9). Salire due volte fino in
    // fondo sulla stessa pagina finisce le frasi prima dell'avviso — il test
    // sarebbe rosso per esaurimento del contenuto, non per un difetto.
    {
      const page = await browser.newPage({ viewport: TELEFONO });
      page.on('pageerror', e => errori.push(modulo.nome + ' [C]: ' + String(e).slice(0, 140)));
      await page.addInitScript(mockRisposta);
      await apriModulo(page, 'AvvisoFermo' + modulo.id, modulo.id);
      const soglie = await page.evaluate(() => {
        const c = window.APP_CONFIG.voiceCoach.micIssue;
        return { uno: c.warningAt, due: c.restartSuggestionAt, tre: c.confirmedAt };
      });
      const tornaAlMicrofono = async () => {
        const gia = await page.evaluate(() => {
          const b = document.getElementById('vc-record-btn');
          return !!b && b.getClientRects().length > 0;
        });
        if (gia) return;
        await page.evaluate(() => {
          const vis = el => !!el && el.getClientRects().length > 0 && !el.disabled;
          const ancora = document.getElementById('voice-coach-retry-btn');
          if (vis(ancora)) { ancora.click(); return; }
          const avanti = document.getElementById('vc-next-btn');
          if (vis(avanti)) avanti.click();
        });
        await page.waitForFunction(() => {
          const b = document.getElementById('vc-record-btn');
          return !!b && b.getClientRects().length > 0;
        }, null, { timeout: 10000 });
      };
      let confermato = null;
      for (let n = 1; n <= soglie.tre; n++) {
        await tornaAlMicrofono();
        await page.evaluate(() => { window.__vcTranscript = ''; });
        await page.evaluate(() => document.getElementById('vc-record-btn').click());
        await page.waitForFunction(() => {
          const b = document.getElementById('vc-send-btn');
          return b && b.getClientRects().length > 0;
        }, null, { timeout: 10000 });
        await page.evaluate(() => document.getElementById('vc-send-btn').click());
        await page.waitForTimeout(120);
        confermato = await leggiStato(page);
      }
      log('[C] ' + modulo.nome + ': al livello confermato l\'avviso lo dice e blocca "Avanti"',
          confermato.livello === 3 && confermato.avantiBloccato === true);

      // Da qui NON si registra più: microfono nascosto, "Esercitati ancora"
      // spento, "Avanti" bloccato. L'unica azione rimasta è "Torna alla
      // mappa", ed è per questo che deve esserci sempre: è l'unica uscita.
      // (Il commento nel codice dice che il blocco si scioglie anche se il
      // microfono ricomincia a funzionare: da questo stato non può accadere,
      // perché non c'è niente da premere per registrare. Segnalato, non
      // corretto — il test fissa quello che l'app FA.)
      const uscita = await page.evaluate(() => {
        const v = el => !!el && el.getClientRects().length > 0 && !el.disabled;
        return {
          tornaMappa: v(document.getElementById('vc-mic-notice-map')),
          registra: v(document.getElementById('vc-record-btn')),
          ancora: v(document.getElementById('voice-coach-retry-btn')),
          avanti: v(document.getElementById('vc-next-btn'))
        };
      });
      if (!(uscita.tornaMappa && !uscita.registra && !uscita.ancora && !uscita.avanti)) console.log('  ' + JSON.stringify(uscita));
      log('[C] ' + modulo.nome + ': "Torna alla mappa" e\' l\'unica azione rimasta',
          uscita.tornaMappa === true && !uscita.registra && !uscita.ancora && !uscita.avanti);

      await page.evaluate(() => document.getElementById('vc-mic-notice-map').click());
      const tornato = await page.waitForFunction(
        () => document.querySelectorAll('#module-list [data-module]').length > 0,
        null, { timeout: 10000 }).then(() => true).catch(() => false);
      log('[C] ' + modulo.nome + ': e\' un\'uscita vera, riporta alla mappa', tornato);
      await page.close();
    }
  }

  log('[C] Nessun errore JS', errori.length === 0);
  if (errori.length) console.log('  ' + errori.join('\n  '));

  await browser.close();
  const passed = results.filter(r => r.ok).length;
  console.log('\n=== AVVISO MICROFONO SUMMARY: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
