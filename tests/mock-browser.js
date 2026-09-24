// I FINTI DEL BROWSER, IN UN POSTO SOLO — passo F.4, 2026-09-24.
//
// ⚠️ PERCHE' ESISTE, E IL NUMERO E' LA RAGIONE. **Misurato il 2026-09-24:
// quarantacinque file di test si costruivano un finto `speechSynthesis`
// PROPRIO.** Non erano quarantacinque idee diverse — il nucleo
// (`speechSynthesis` + `SpeechSynthesisUtterance`) c'e' in tutti, e a
// divergere sono quattro pezzi opzionali: il riconoscimento vocale, la
// proprieta' `speaking`, `AudioContext`, le leve di Voice Coach.
//
// ⚠️ IL NUMERO QUI SOPRA E' UNA CORREZIONE, E LA CORREZIONE E' IL PUNTO.
// La prima stesura di questo commento diceva «38 file, 27 varianti, 21 senza
// `speaking`». Erano il conto dei file che hanno un `const mockInit`, e
// **sei file il finto ce l'hanno con un altro nome** (`mockVoce`,
// `mockSilenzio`, `finta`): quei sei non erano mai stati contati. *Un numero
// che dipende dal NOME della variabile misura la variabile, non il problema
// — regola 37.* Il conto vero si rifa' con un comando, non si ricopia:
//
//     grep -l "defineProperty(window, 'speechSynthesis'" tests/test_*.js | wc -l
//
// ⚠️ E IL COSTO DI QUELLE COPIE NON E' ESTETICO, E' MISURATO: **diciassette
// di quei finti non dichiarano `speaking`**, e `speaking` non e' un dettaglio
// — `app/audio.js` ci costruisce sopra `staParlando()`, la cui prima riga
// **gate il Blocco Ascolto** (`if (!staParlando()) return;`). *In quei
// diciassette file la Regola Azione Critica (regola 16) non gira mai, e
// nessuno se ne accorge: e' il passo F.2, che viene DOPO questo.*
//
// ⚠️ QUESTO PASSO NON CAMBIA IL COMPORTAMENTO DI NESSUN FILE, ED E' LA
// SCELTA CHE LO RENDE FATTIBILE. Ogni file converte al nucleo che aveva,
// parametri compresi. *Mescolare «unifico» e «rendo onesto il finto»
// renderebbe illeggibile il rosso di F.2 — e il rosso di F.2 e' il guadagno
// (regola 19). Un rosso che puo' venire da due cause non e' una misura.*
//
// COME SI USA. Si passa a `page.addInitScript` come oggi:
//
//     const { mockInit } = require('./mock-browser');
//     await page.addInitScript(mockInit);
//
// oppure, se quel file aveva parametri suoi:
//
//     const { mockBrowser } = require('./mock-browser');
//     const mockInit = mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' });
//
// ⚠️ TORNA `{ content }` E NON UNA FUNZIONE, di proposito: `addInitScript`
// SERIALIZZA la funzione che riceve, quindi una che chiudesse su `opzioni`
// arriverebbe nel browser **senza** quelle opzioni. Componendo il testo qui,
// i valori ci sono per davvero — e il difetto «il parametro non arriva e
// nessuno lo dice» non puo' nascere.
'use strict';

// I valori di oggi, file per file. Non sono stati scelti adesso: sono quelli
// che ogni mock aveva, e cambiarli sarebbe cambiare comportamento.
const PREDEFINITI = {
  fineVoceMs: 20,              // quanto tarda `onend` dopo `speak()`
  nomeVoce: 'Fake Male Voice', // cosa torna `getVoices()`
  riconoscimento: false,       // vedi FORME sotto
  ritardoRiconoscimentoMs: 15, // quanto tarda `onresult` dopo `start()`
  ritardoFineRiconoscimentoMs: 5 // quanto tarda `onend` dopo `stop()`
};

// ⚠️ LE QUATTRO FORME DEL RICONOSCIMENTO, E NON SONO UN'ASTRAZIONE: sono i
// quattro comportamenti che i file di oggi avevano davvero, e differiscono
// **su QUANDO arriva `onend`** — cioe' esattamente sull'ordine degli eventi
// asincroni che la regola 19 dice di non semplificare.
//
//   'auto'    start → (ritardo) onresult E onend · stop() non fa niente
//   'suStop'  start → (ritardo) onresult · onend SOLO dopo stop()
//   'manuale' start → onstart subito · stop → onend subito · nessun onresult
//   'muto'    start non fa niente · onend solo dopo stop()  (premi e non parli)
//
// `true` vale 'auto', per chi scriveva prima che le forme avessero un nome.
const FORME = ['auto', 'suStop', 'manuale', 'muto'];

function corpoRiconoscimento(o) {
  const forma = o.riconoscimento === true ? 'auto' : o.riconoscimento;
  if (!forma) return '';
  if (FORME.indexOf(forma) < 0) {
    throw new Error('mock-browser: riconoscimento sconosciuto "' + forma +
      '" — le forme sono ' + FORME.join(', '));
  }

  // Il risultato che `onresult` consegna: quello che il test ha messo in
  // window.__vcTranscript, oppure results vuoto ("sentito, nessuna parola").
  const consegna = `
        if (self.onresult) {
          var text = window.__vcTranscript || '';
          self.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
        }`;

  const start = {
    auto: `var self = this; setTimeout(function () {${consegna}
        if (self.onend) self.onend();
      }, ${o.ritardoRiconoscimentoMs});`,
    suStop: `var self = this; setTimeout(function () {${consegna}
      }, ${o.ritardoRiconoscimentoMs});`,
    manuale: `if (this.onstart) this.onstart();`,
    muto: ``
  }[forma];

  const stop = {
    auto: ``,
    suStop: `var self = this; setTimeout(function () { if (self.onend) self.onend(); }, ${o.ritardoFineRiconoscimentoMs});`,
    manuale: `if (this.onend) this.onend();`,
    muto: `var self = this; setTimeout(function () { if (self.onend) self.onend(); }, ${o.ritardoFineRiconoscimentoMs});`
  }[forma];

  const abort = forma === 'manuale' ? `` : `if (this.onend) this.onend();`;

  return `
    (function () {
      function FakeRecognition() {
        this.onstart = null; this.onresult = null; this.onend = null; this.onerror = null;
      }
      FakeRecognition.prototype.start = function () { ${start} };
      FakeRecognition.prototype.stop = function () { ${stop} };
      FakeRecognition.prototype.abort = function () { ${abort} };
      window.SpeechRecognition = FakeRecognition;
      window.webkitSpeechRecognition = FakeRecognition;
    })();
  `;
}

function costruisci(opzioni) {
  const o = Object.assign({}, PREDEFINITI, opzioni || {});

  // ⚠️ IL NUCLEO DICHIARA `speaking`, DAL 2026-09-24 (passo F.2a), E QUESTO
  // PASSO **CAMBIA COMPORTAMENTO DI PROPOSITO**: e' l'unico di F.4/F.2 che lo
  // fa, e il rosso che ne nasce e' il guadagno (regola 19).
  //
  // ⚠️ `speaking` NON GATE UNA COSA, NE GATE QUATTRO. Misurato leggendo
  // `app/audio.js` e `app/flashcard.js`:
  //
  //   app/audio.js:253  `if (!staParlando()) return;`  → il BLOCCO ASCOLTO
  //                     (regola 16) non gira mai, in nessuno di quei file
  //   app/audio.js:144  `fermaLaVoce()` → `synth.cancel()` **non viene mai
  //                     chiamato**: «ritoccare il pulsante che sta parlando lo
  //                     ferma» e' un comportamento che i test non provavano
  //   app/audio.js:148  `pausaLaVoce()` → `pause()` mai chiamato
  //   app/flashcard.js:228  il ramo di `fcFlip` che ferma l'audio girando la
  //                     carta non veniva mai preso
  //
  // *Non e' «il mock semplifica»: e' che l'app girava con quattro
  // comportamenti condivisi spenti, e nessun rosso lo diceva.*
  //
  // ⚠️ E QUI `cancel()` NON MANDA `onend`, di proposito. Il browser vero lo
  // manda, **in modo asincrono** — e l'app ci ha costruito sopra l'EPOCA
  // (`nuovaEpoca`/`epocaCorrente` in `app/audio.js`), che esiste per
  // sopravvivere a un `onend` che arriva dopo che lo studente ha lasciato il
  // modulo. Renderlo onesto e' il passo **F.2b**, e va da solo: mescolarlo qui
  // darebbe un rosso che puo' venire da due cause, cioe' non una misura.
  // Stessa ragione per `paused`, che resta finto (**F.2c**).
  const nucleo = `
    (function () {
      function FakeUtterance(text) {
        this.text = text; this.onstart = null; this.onend = null; this.onerror = null;
      }
      var fakeSynth = {
        speaking: false,
        _corrente: null,
        speak: function (utter) {
          var self = this;
          this.speaking = true;
          this._corrente = utter;
          if (utter.onstart) utter.onstart();
          utter._timer = setTimeout(function () {
            if (self._corrente === utter) { self.speaking = false; self._corrente = null; }
            if (utter.onend) utter.onend();
          }, ${o.fineVoceMs});
        },
        cancel: function () {
          var u = this._corrente;
          if (!u) return;
          this.speaking = false;
          this._corrente = null;
          clearTimeout(u._timer);
        },
        pause: function () {}, resume: function () {},
        getVoices: function () { return [{ name: ${JSON.stringify(o.nomeVoce)}, lang: 'en-US' }]; },
        onvoiceschanged: null
      };
      Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
      window.SpeechSynthesisUtterance = FakeUtterance;
    })();
  `;

  return { content: nucleo + corpoRiconoscimento(o) };
}

module.exports = {
  mockBrowser: costruisci,
  // Il nucleo com'e' nel gruppo piu' numeroso: 20 ms, 'Fake Male Voice',
  // nessun riconoscimento.
  mockInit: costruisci(),
  FORME
};
