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
  ritardoFineRiconoscimentoMs: 5, // quanto tarda `onend` dopo `stop()`
  ritardoCancelMs: 0,          // quanto tarda `onend` dopo `cancel()`
  ritardoInterimMs: 20,        // 'continuo': il primo risultato intermedio
  intervalloInterimMs: 100     // 'continuo': ogni quanto ne arriva un altro
};

// ⚠️ `ritardoCancelMs` NON E' UN PARAMETRO DI COMODO, E' L'UNICA COSA CHE
// DISTINGUEVA TRE FINTI DAL NUCLEO — 2026-09-25, passo F.4 coda.
// `test_batch18` (15 ms), `test_batch5` (30 ms) e `test_batch6` (5 ms)
// ritardavano apposta la chiusura di `cancel()`, e il loro commento dice
// perche': **dare al callback vecchio ogni occasione di sbagliare**. Zero
// millisecondi resta asincrono — e' comunque un altro macrotask — ma non
// lascia passare in mezzo nessun altro timer del test. *Portarli tutti a
// zero avrebbe indebolito le loro asserzioni senza che nessun rosso lo
// dicesse: la regola 44 al rovescio.*

// ⚠️ LE QUATTRO FORME DEL RICONOSCIMENTO, E NON SONO UN'ASTRAZIONE: sono i
// quattro comportamenti che i file di oggi avevano davvero, e differiscono
// **su QUANDO arriva `onend`** — cioe' esattamente sull'ordine degli eventi
// asincroni che la regola 19 dice di non semplificare.
//
//   'auto'    start → (ritardo) onresult E onend · stop() non fa niente
//   'suStop'  start → (ritardo) onresult · onend SOLO dopo stop()
//   'manuale' start → onstart subito · stop → onend subito · nessun onresult
//   'muto'    start non fa niente · onend solo dopo stop()  (premi e non parli)
//   'continuo' start → risultati INTERMEDI a ripetizione · il definitivo solo
//              dopo stop()  (parli a lungo, senza mai smettere)
//
// ⚠️ LA QUINTA, 'continuo', NON E' UNA VARIANTE DELLE ALTRE: e' l'unica in
// cui **arriva qualcosa MENTRE si parla**. Viene da `test_batch14`, e il suo
// commento dice a cosa serve: con i risultati intermedi spenti, niente
// aggiorna `vcLatestTranscript` prima di `stop()`, e **il timeout di
// silenzio scattava a meta' frase**. *Una forma che non si puo' ottenere
// allungando i ritardi di un'altra: e' un ordine di eventi diverso.*
//
// `true` vale 'auto', per chi scriveva prima che le forme avessero un nome.
const FORME = ['auto', 'suStop', 'manuale', 'muto', 'continuo'];

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
    muto: ``,
    continuo: `var self = this;
      this._fermata = false;
      setTimeout(function () {
        if (self._fermata || !self.onresult) return;
        self.onresult({ results: [{ 0: { transcript: 'hello' }, isFinal: false, length: 1 }] });
      }, ${o.ritardoInterimMs});
      this._interim = setInterval(function () {
        if (self._fermata || !self.onresult) return;
        self.onresult({ results: [{ 0: { transcript: 'hello there how are' }, isFinal: false, length: 1 }] });
      }, ${o.intervalloInterimMs});`
  }[forma];

  const stop = {
    auto: ``,
    suStop: `var self = this; setTimeout(function () { if (self.onend) self.onend(); }, ${o.ritardoFineRiconoscimentoMs});`,
    manuale: `if (this.onend) this.onend();`,
    muto: `var self = this; setTimeout(function () { if (self.onend) self.onend(); }, ${o.ritardoFineRiconoscimentoMs});`,
    continuo: `var self = this;
      this._fermata = true;
      if (this._interim) clearInterval(this._interim);
      setTimeout(function () {
        if (self.onresult) self.onresult({ results: [{ 0: { transcript: window.__vcFinalTranscript || 'hello there how are you' }, isFinal: true, length: 1 }] });
        if (self.onend) self.onend();
      }, ${o.ritardoFineRiconoscimentoMs});`
  }[forma];

  const abort = forma === 'manuale' ? `` :
    forma === 'continuo'
      ? `this._fermata = true; if (this._interim) clearInterval(this._interim); if (this.onend) this.onend();`
      : `if (this.onend) this.onend();`;

  return `
    (function () {
      function FakeRecognition() {
        this.onstart = null; this.onresult = null; this.onend = null; this.onerror = null;
        this._fermata = false; this._interim = null;
      }
      FakeRecognition.prototype.start = function () { ${start} };
      FakeRecognition.prototype.stop = function () { ${stop} };
      FakeRecognition.prototype.abort = function () { ${abort} };
      window.SpeechRecognition = FakeRecognition;
      window.webkitSpeechRecognition = FakeRecognition;
    })();
  `;
}

// ⚠️ LA SPIA DEI TONI — TREDICI COPIE, 2026-09-25.
//
// I suoni dell'app (Traguardo, Uscita, il countdown del Dialogo, il
// mini-ascolto delle opzioni) passano tutti da Web Audio, e per vederli i
// test avvolgono `createOscillator` e `createGain`. **Misurato: tredici file
// se lo riscrivevano.** Sei fuori dal mock, byte per byte identici
// (`batch2`, `batch2b`, `batch3`, `batch3b`, `new_features`, `voicecoach`);
// quattro dentro il proprio `mockInit`, identici a loro volta (`batch10`,
// `batch11`, `batch12`, `batch17`); e tre che divergono di poche righe —
// `batch16` per le sole graffe, `dialogo_extra` che aggiunge `t`,
// `batch15` che aggiunge `qmSummaryHidden`.
//
// ⚠️ NON E' UN'OPZIONE DI `mockBrowser`, ED E' UNA SCELTA: sei file la
// usano **senza** il finto del sintetizzatore, come secondo
// `addInitScript`. Farla dipendere dal mock costringerebbe quei sei a
// chiedere un finto che non gli serve.
//
//     const { spiaToni } = require('./mock-browser');
//     await page.addInitScript(spiaToni);
//
// ⚠️ `t: performance.now()` C'E' SEMPRE, e viene da `dialogo_extra`: un
// istante costa niente e non puo' rompere nessuna asserzione — tutte
// filtrano per `freq`. *Un campo in piu' che nessuno legge e' gratis; un
// campo che manca costringe a riscrivere la spia.*
//
// ⚠️ E `window.__noAudioCtx` NON C'E' PIU': le sette copie che lo
// scrivevano **non avevano un lettore**, in tutto il repository. *E' la
// famiglia di `__recognitionStarted` e di `__toneLog` — non un numero
// sbagliato, un numero che nessuno guarda mai (regola 37).*
//
// L'UNICO GANCIO: `window.__annotaTono`. Se la pagina la definisce, quello
// che torna finisce dentro ogni tono. Serve a `batch15`, che verifica che
// **ogni nota del Traguardo suoni a schermata finale GIA' visibile**: quel
// dato esiste solo nell'istante del tono, quindi va preso li' e non dopo.
const SPIA_TONI = `
  (function () {
    var OrigAC = window.AudioContext || window.webkitAudioContext;
    if (!OrigAC) return;
    window.__playedTones = [];
    var OrigCreateOscillator = OrigAC.prototype.createOscillator;
    var OrigCreateGain = OrigAC.prototype.createGain;
    OrigAC.prototype.createOscillator = function () {
      var osc = OrigCreateOscillator.call(this);
      var freq = null;
      Object.defineProperty(osc.frequency, 'value', {
        set: function (v) { freq = v; },
        get: function () { return freq; }
      });
      osc.__getFreq = function () { return freq; };
      window.__pendingOsc = osc;
      return osc;
    };
    OrigAC.prototype.createGain = function () {
      var gain = OrigCreateGain.call(this);
      var origSetValueAtTime = gain.gain.setValueAtTime.bind(gain.gain);
      gain.gain.setValueAtTime = function (v, t) {
        if (window.__pendingOsc) {
          var tono = { freq: window.__pendingOsc.__getFreq(), volume: v, t: performance.now() };
          if (typeof window.__annotaTono === 'function') {
            var extra = window.__annotaTono() || {};
            for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) tono[k] = extra[k]; }
          }
          window.__playedTones.push(tono);
        }
        return origSetValueAtTime(v, t);
      };
      return gain;
    };
  })();
`;

// ⚠️ GLI AVVISI — tre copie identiche (`batch10`, `batch11`, `batch12`).
// Raccoglie `console.warn` in `window.__consoleWarnings` **senza zittirlo**:
// l'originale viene chiamato lo stesso, cosi' un avviso resta visibile nel
// log della corsa oltre che leggibile dall'asserzione.
const CATTURA_AVVISI = `
  (function () {
    window.__consoleWarnings = [];
    var origWarn = console.warn.bind(console);
    console.warn = function () {
      window.__consoleWarnings.push(Array.prototype.slice.call(arguments).join(' '));
      origWarn.apply(console, arguments);
    };
  })();
`;

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
  // ⚠️ E `cancel()` MANDA `onend`, IN MODO ASINCRONO, DAL PASSO F.2b
  // (2026-09-24) — com'e' in un motore vero, e **non e' un dettaglio**:
  // `app/audio.js` ci ha costruito sopra l'EPOCA (`nuovaEpoca` /
  // `epocaCorrente`), che esiste **solo** per sopravvivere a un `onend` che
  // arriva DOPO che lo studente ha lasciato il modulo. *Con un `cancel()` che
  // non manda niente, quella protezione non veniva esercitata da nessuno di
  // questi file: c'era, e nessun test poteva dire se funzionava.*
  //
  // ⚠️ E `speaking` DIVENTA FALSO NELLO STESSO GIRO SINCRONO DI `cancel()`,
  // DAL 2026-09-25 — l'`onend` arriva dopo, ma **lo stato no**.
  //
  // *Non e' una rifinitura: e' un rosso, e il rosso l'ha trovato la coda di
  // F.4.* `test_batch5 [Job1]` clicca «esci dal modulo» e legge
  // `speechSynthesis.speaking` **nella stessa chiamata sincrona** — apposta,
  // per la regola 19: cosi' i due valori descrivono lo stesso istante invece
  // di due round-trip. Con un `cancel()` che rimandava anche lo *stato*, quel
  // test leggeva `true` e cadeva.
  //
  // **E il file aveva ragione lui:** in un motore vero `cancel()` interrompe
  // subito, e `speaking` risponde `false` da quel momento; e' l'*evento* a
  // tardare. Dieci dei quattordici finti scritti a mano lo facevano cosi'.
  // *Il nucleo aveva preso la parte asincrona e se l'era portata via anche la
  // parte sincrona — un finto che promette meno della realta', la regola 19
  // nella sua forma classica.*
  //
  // ⚠️ LA FORMA NON E' STATA INVENTATA QUI: e' quella che
  // `test_dialogo_extra.js` si era scritta a mano (`mockConCancelVero`) per i
  // suoi due test sull'audio interrotto, ed e' stata portata dentro
  // **identica**. *Quel duplicato scritto a mano era F.2b in un file solo.*
  //
  // La guardia sul `_corrente` dentro `_finisci` e' la parte che conta: una
  // chiusura in ritardo non deve spegnere l'audio partito dopo di lei.
  //
  // ⚠️⚠️ AVVERTENZA, E NON E' UNA SFUMATURA: QUI `pause()` FUNZIONA MEGLIO
  // CHE NEL BROWSER VERO — 2026-09-25.
  //
  // Il finto qui sotto sospende e riprende in modo perfetto. **Un motore vero
  // no:** `synth.pause()` a meta' frase e' inaffidabile, e sul Dialogo
  // Continuo **bloccava l'intero dialogo** (Job 2, 3° collaudo — il fatto e'
  // scritto in tre punti di `app/dialogo.js`).
  //
  // ⚠️ QUINDI UN TEST CHE SI APPOGGIA A `pause()`/`resume()` PROVA QUESTO
  // FINTO, NON L'APP. Sarebbe verde qui e impiantato su Pages: la regola 19 al
  // rovescio — non un finto che semplifica, **un finto che promette piu' della
  // realta'**.
  //
  // *L'app infatti non lo usa piu': dal 2026-09-25 la pausa del Dialogo
  // interrompe la battuta (`cancel()`) e la risuona da capo alla ripresa,
  // senza toccare `synth.pause()`. `paused` resta qui perche' il nucleo sia
  // completo, non perche' serva a qualcuno.*
  //
  // ⚠️ E `paused` E' VERO DAL PASSO F.2c (2026-09-24). Non e' un'etichetta:
  // `pause()` ferma il timer e si ricorda quanto mancava, `resume()` riparte
  // da li'. *Un `paused` che cambia solo un booleano direbbe "sono in pausa"
  // mentre l'audio finisce da solo alla sua ora — la stessa forma del finto
  // che semplifica troppo (regola 19).*
  //
  // ⚠️ E IL GUADAGNO E' MISURATO: `riprendiLaVoce()` fa
  // `if (synth && synth.paused) synth.resume();`. Con `paused` sempre
  // `undefined`, quella riga **non e' mai stata eseguita da nessun test** —
  // il pulsante di pausa del Dialogo (`dgTogglePause`, app/dialogo.js:589)
  // riprendeva solo il timer della battuta, mai la voce.
  const nucleo = `
    (function () {
      // Cosa e' stato detto, in ordine. Sempre presente: tre file se la
      // scrivevano da soli con tre nomi diversi (detti, __detti, __speakLog),
      // e un pezzo condiviso con tre nomi e' il difetto della regola 18.
      window.__detti = [];
      function FakeUtterance(text) {
        this.text = text; this.onstart = null; this.onend = null; this.onerror = null;
      }
      var fakeSynth = {
        speaking: false,
        paused: false,
        _corrente: null,
        speak: function (utter) {
          var self = this;
          window.__detti.push(utter.text);
          this.speaking = true;
          this.paused = false;
          this._corrente = utter;
          if (utter.onstart) utter.onstart();
          utter._finePrevista = Date.now() + ${o.fineVoceMs};
          utter._timer = setTimeout(function () { self._finisci(utter); }, ${o.fineVoceMs});
        },
        // Chiude UNA utterance, una volta sola: la guardia su _corrente e'
        // quello che impedisce a una chiusura in ritardo di spegnere l'audio
        // che e' partito dopo. (Niente apici inversi qui dentro: questo testo
        // vive in un template literal, e un apice inverso lo chiuderebbe.)
        _finisci: function (utter) {
          if (this._corrente !== utter) return;
          clearTimeout(utter._timer);
          this.speaking = false;
          this.paused = false;
          this._corrente = null;
          if (utter.onend) utter.onend();
        },
        // Smette di parlare SUBITO, e l'onend dell'utterance interrotta arriva
        // DOPO: sono due istanti diversi, e confonderli e' quello che questo
        // nucleo faceva fino al 2026-09-25. (Niente apici inversi qui dentro:
        // questo testo vive in un template literal.)
        cancel: function () {
          var u = this._corrente;
          if (!u) return;
          clearTimeout(u._timer);
          this.speaking = false;
          this.paused = false;
          this._corrente = null;
          setTimeout(function () { if (u.onend) u.onend(); }, ${o.ritardoCancelMs});
        },
        // ⚠️ pause() SOSPENDE DAVVERO, dal passo F.2c: ferma il timer e si
        // ricorda quanto mancava. Un paused che cambia solo un'etichetta
        // sarebbe peggio di niente — direbbe "sono in pausa" mentre l'audio
        // finisce da solo alla sua ora. (Niente apici inversi qui dentro:
        // questo testo vive in un template literal.)
        pause: function () {
          if (!this.speaking || this.paused) return;
          var u = this._corrente;
          this.paused = true;
          clearTimeout(u._timer);
          u._restano = Math.max(0, u._finePrevista - Date.now());
        },
        resume: function () {
          if (!this.paused) return;
          var self = this, u = this._corrente;
          this.paused = false;
          if (!u) return;
          u._finePrevista = Date.now() + u._restano;
          u._timer = setTimeout(function () { self._finisci(u); }, u._restano);
        },
        getVoices: function () { return [{ name: ${JSON.stringify(o.nomeVoce)}, lang: 'en-US' }]; },
        onvoiceschanged: null
      };
      Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
      window.SpeechSynthesisUtterance = FakeUtterance;
    })();
  `;

  return { content: nucleo + corpoRiconoscimento(o) };
}

// Mette insieme piu' pezzi in un solo `addInitScript`. Serve dove il finto e
// la spia erano UN blocco: cosi' i punti di chiamata — sessanta, misurati —
// non vanno toccati uno per uno, e i pezzi restano installati nello stesso
// istante di prima.
function componi() {
  var pezzi = Array.prototype.map.call(arguments, function (p) { return p.content; });
  return { content: pezzi.join('\n') };
}

module.exports = {
  mockBrowser: costruisci,
  componi,
  // Due pezzi che si passano ad `addInitScript` per conto loro, perche' chi
  // li vuole non sempre vuole anche il finto del sintetizzatore.
  spiaToni: { content: SPIA_TONI },
  catturaAvvisi: { content: CATTURA_AVVISI },
  // Il nucleo com'e' nel gruppo piu' numeroso: 20 ms, 'Fake Male Voice',
  // nessun riconoscimento.
  mockInit: costruisci(),
  FORME
};
