// I FINTI DEL BROWSER, IN UN POSTO SOLO — passo F.4, 2026-09-24.
//
// ⚠️ PERCHE' ESISTE, E IL NUMERO E' LA RAGIONE: **38 file di test avevano un
// `mockInit` PROPRIO, in 27 varianti distinte.** Non erano 27 idee diverse —
// misurato lo stesso giorno, il nucleo (`speechSynthesis` +
// `SpeechSynthesisUtterance`) c'e' in **tutti e 38**, e a divergere sono
// quattro pezzi opzionali: il riconoscimento vocale (22), le leve di Voice
// Coach (16), `AudioContext` (6), e la proprieta' `speaking` (17).
//
// ⚠️ E IL COSTO DI QUELLE COPIE NON E' ESTETICO, E' MISURATO: **ventuno di
// quei finti non dichiarano `speaking`**, e `speaking` non e' un dettaglio —
// `app/audio.js` ci costruisce sopra `staParlando()`, la cui prima riga
// **gate il Blocco Ascolto** (`if (!staParlando()) return;`). *In quei ventuno
// file la Regola Azione Critica (regola 16) non gira mai, e nessuno se ne
// accorge: e' il passo F.2, che viene DOPO questo.*
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
  riconoscimento: false,       // il finto SpeechRecognition
  ritardoRiconoscimentoMs: 15
};

function costruisci(opzioni) {
  const o = Object.assign({}, PREDEFINITI, opzioni || {});

  // ⚠️ Il nucleo e' scritto SENZA `speaking`, perche' ventuno file di oggi non
  // ce l'hanno e questo passo non cambia comportamento. Chi ce l'ha lo chiede.
  const nucleo = `
    (function () {
      function FakeUtterance(text) { this.text = text; }
      var fakeSynth = {
        speak: function (utter) {
          if (utter.onstart) utter.onstart();
          setTimeout(function () { if (utter.onend) utter.onend(); }, ${o.fineVoceMs});
        },
        cancel: function () {}, pause: function () {}, resume: function () {},
        getVoices: function () { return [{ name: ${JSON.stringify(o.nomeVoce)}, lang: 'en-US' }]; },
        onvoiceschanged: null
      };
      Object.defineProperty(window, 'speechSynthesis', { value: fakeSynth, configurable: true });
      window.SpeechSynthesisUtterance = FakeUtterance;
    })();
  `;

  const riconoscimento = !o.riconoscimento ? '' : `
    (function () {
      function FakeRecognition() { this.onresult = null; this.onend = null; this.onerror = null; }
      FakeRecognition.prototype.start = function () {
        var self = this;
        setTimeout(function () {
          if (self.onresult) {
            var text = window.__vcTranscript || '';
            self.onresult({ results: text ? [{ 0: { transcript: text }, isFinal: true, length: 1 }] : [] });
          }
          if (self.onend) self.onend();
        }, ${o.ritardoRiconoscimentoMs});
      };
      FakeRecognition.prototype.stop = function () {};
      FakeRecognition.prototype.abort = function () { if (this.onend) this.onend(); };
      window.SpeechRecognition = FakeRecognition;
      window.webkitSpeechRecognition = FakeRecognition;
    })();
  `;

  return { content: nucleo + riconoscimento };
}

module.exports = {
  mockBrowser: costruisci,
  // Il nucleo com'e' nei quattro file del gruppo piu' numeroso.
  mockInit: costruisci()
};
