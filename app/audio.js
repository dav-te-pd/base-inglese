// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// LO STRATO `audio` — la voce, e il numero che dice chi conta ancora.
//
// Estratto da index.html il 2026-09-18 (passo 22, SESTO file e ultimo strato
// della fase). Quindici pezzi, 145 righe, **zero dipendenze verso altri
// strati** — misurato con tests/tools/misura-strato.js prima di muovere
// niente. Resta solo `window.APP_CONFIG`, che e' globale da sempre.
//
// ⚠️ NON ERA UNA FOGLIA, E LO E' DIVENTATA IN DUE PASSI DICHIARATI.
//
// ① `synth` era nominato da SETTE funzioni destinate a QUATTRO file diversi.
//    Non una duplicazione: una RISORSA CONDIVISA — e una risorsa condivisa non
//    si divide per QUANDO una cosa gira, che e' l'unico criterio che lo
//    spacchettamento ha. Cinque domande (`vocePossibile`, `staParlando`,
//    `fermaLaVoce`, `pausaLaVoce`, `riprendiLaVoce`) le hanno dato un
//    padrone: il nucleo audio possiede `synth`, gli altri gli chiedono.
//
// ② L'epoca era una VARIABILE letta da qui e scritta da `leaveModule`.
//    Il ponte degli alias non funziona per un numero — vedi la nota accanto a
//    `nuovaEpoca` — quindi e' diventata due funzioni.
//
// *Nessuno dei due era un problema di dove mettere il codice: erano due
// risposte che il criterio degli strati non sapeva dare.*
//
// ⚠️ COSA SI ROMPE SE QUESTO FILE NON ARRIVA — misurato, e NON e' quello che
// avevo previsto scrivendo questa riga la prima volta:
//
//     login .......... COMPARE
//     casa ........... no
//     mappa .......... no
//     errore JS ...... TypeError: vocePossibile is not a function
//
// Avevo scritto «l'app parte e la mappa si apre, come per progressi». Falso:
// `speakBtn.disabled = !vocePossibile();` gira al PRIMO LIVELLO dello script
// principale, quindi muore subito e `boot()` non arriva mai. La schermata del
// nome si vede perche' e' nel markup, non perche' l'app sia viva: **si scrive
// il nome, si preme, e non succede niente.**
//
// *La previsione era sbagliata e l'ho lasciata scritta un minuto prima di
// misurarla. E' il motivo per cui la misura si fa: una riga come questa,
// creduta, avrebbe mandato a guardare la mappa invece del primo pulsante.*

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var synth = window.speechSynthesis;

  var voices = [];

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
  }

  if (synth) {
    loadVoices();
    if ('onvoiceschanged' in synth) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  // Heuristic-only: the Web Speech API exposes no real gender field, so a
  // voice not in CONFIG.speech.preferredVoiceNames is guessed from its own
  // name against maleVoiceNameHints — "female" is excluded explicitly
  // first since it would otherwise match the "male" substring inside it.
  function looksLikeMaleVoice(voice) {
    var name = voice.name.toLowerCase();
    if (name.indexOf('female') !== -1) return false;
    return CONFIG.speech.maleVoiceNameHints.some(function (hint) { return name.indexOf(hint) !== -1; });
  }

  // ── LA VOCE, VISTA DA FUORI: quattro domande, nessun `synth` ──
  //
  // ⚠️ MISURATO IL 2026-09-18, PRIMA DI SCRIVERLE: `synth` era nominato da
  // SETTE funzioni destinate a QUATTRO file diversi — il nucleo audio
  // (loadVoices, pickVoice, toggleSpeak), la pulizia generale
  // (stopAllModuleActivity), Dialogo (dgTogglePause, openDialogo) e Flash Card
  // (fcFlip), piu' il listener globale del Blocco Ascolto.
  //
  // **Non e' una duplicazione: e' una RISORSA CONDIVISA.** E una risorsa
  // condivisa non si divide per QUANDO una cosa gira, che e' l'unico criterio
  // che lo spacchettamento ha — quindi su di lei il criterio non ha una
  // risposta. Queste quattro funzioni gliene danno una: **`synth` appartiene
  // al nucleo audio, e gli altri gli fanno domande.**
  //
  // Non aggiungono nessun comportamento: ognuna e' la riga che stava scritta
  // sei volte, con lo stesso `synth &&` davanti. Quel controllo c'era in tutte
  // e sei — il sintetizzatore puo' non esistere — e bastava che UNA se lo
  // dimenticasse: adesso e' scritto una volta.
  // ── L'EPOCA: il numero che dice «sei ancora quello che conta?» ──
  //
  // ⚠️ VIVE COL NUCLEO AUDIO E NON CON LE VISTE, ed e' una decisione del
  // 2026-09-18 con un motivo misurato: l'epoca esiste SOLO per il problema
  // dell'audio. Un `onend`/`onerror` del sintetizzatore puo' arrivare DOPO che
  // lo studente ha lasciato il modulo — `cancel()` li risolve in modo
  // asincrono — e senza questo numero la catena di un modulo (Dialogo che
  // incatena la battuta successiva) farebbe un passo in piu' su una schermata
  // che non c'e' piu'. E' cosi' che l'audio sanguinava nel modulo successivo.
  //
  // `leaveModule` la incrementa perche' lasciare un modulo E' il momento in
  // cui le chiamate tardive vanno neutralizzate — ma la usa, non la possiede.
  //
  // ⚠️ E IL FATTO CHE HA DECISO LA FORMA: IL PONTE DEGLI ALIAS NON FUNZIONA
  // PER UN NUMERO. Gli altri strati usciti si raggiungono con
  // `var nome = BI.nome;` in cima all'IIFE, e funziona perche' copia un
  // RIFERIMENTO. `moduleEpoch` era un numero: la copia avrebbe congelato il
  // valore, `leaveModule` avrebbe incrementato una copia e `toggleSpeak` non
  // l'avrebbe mai vista cambiare. **La protezione sarebbe diventata inerte in
  // silenzio** — nessuna eccezione, nessun rosso, e l'audio che ricomincia a
  // sanguinare: esattamente il bug per cui l'epoca e' nata.
  //
  // Due funzioni al posto di una variabile: il riferimento e' alla funzione,
  // e il numero resta dentro.
  var epoca = 0;

  function nuovaEpoca() {
    epoca++;
  }

  function epocaCorrente() {
    return epoca;
  }

  function vocePossibile() {
    return !!synth;
  }

  function staParlando() {
    return !!(synth && synth.speaking);
  }

  function fermaLaVoce() {
    if (staParlando()) synth.cancel();
  }

  function pausaLaVoce() {
    if (staParlando() && !synth.paused) synth.pause();
  }

  function riprendiLaVoce() {
    if (synth && synth.paused) synth.resume();
  }

  function pickVoice() {
    if (!synth) return null;
    if (!voices.length) voices = synth.getVoices();
    var preferredNames = CONFIG.speech.preferredVoiceNames;
    for (var k = 0; k < preferredNames.length; k++) {
      var match = voices.find(function (v) { return v.name === preferredNames[k]; });
      if (match) return match;
    }
    var langVoices = voices.filter(function (v) { return v.lang === CONFIG.speech.synthesisLang; });
    if (!langVoices.length) {
      langVoices = voices.filter(function (v) { return v.lang && v.lang.indexOf('en') === 0; });
    }
    if (!langVoices.length) return null;
    return langVoices.find(looksLikeMaleVoice) || langVoices[0];
  }

  // Shared text-to-speech helper: used by the full-sentence speak button
  // and by every Repeat Aloud item's listen/rate buttons. Clicking the
  // button that is currently playing stops it; clicking a different one
  // while something else is playing interrupts that and starts the new
  // one. rate is optional; omit it to use the app's tuned default.
  // callbacks is optional ({onStart, onEnd}) for callers that need to react
  // to this specific utterance's playback window — e.g. Voice Coach, which
  // disables its own Record button while the model audio plays so the mic
  // can't pick it up (see the vc-audio-controls click handler below).
  // onStart fires synchronously, right before synth.speak() — NOT from
  // SpeechSynthesisUtterance's own asynchronous "onstart" event, which
  // some engines fire late enough (real, measurable delay) to make a
  // same-tick UI lock feel unresponsive. onEnd stays tied to the real
  // onend/onerror, since there's no way to know playback actually
  // finished any earlier than the engine reports it.
  function toggleSpeak(text, btn, rate, callbacks) {
    if (!synth) return;
    var wasSpeaking = btn.classList.contains('speaking');
    fermaLaVoce();
    if (wasSpeaking) return;
    // Captured at start, compared in onend/onerror below — see nuovaEpoca's
    // own comment near showView(). Guards specifically against a module's
    // own onEnd callback (e.g. Dialogo's dgPlayLine chaining into the next
    // line) resurrecting itself after the user has already left the module,
    // which is possible because cancel()'s onend/onerror can fire
    // asynchronously, after showView()'s own synchronous cleanup already ran.
    var epochAtStart = epocaCorrente();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = CONFIG.speech.synthesisLang;
    var voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = (rate === undefined || rate === null) ? CONFIG.speech.synthesisRate : rate;
    utterance.onstart = function () { btn.classList.add('speaking'); };
    utterance.onend = function () {
      btn.classList.remove('speaking');
      if (epochAtStart !== epocaCorrente()) return;
      if (callbacks && callbacks.onEnd) callbacks.onEnd();
    };
    utterance.onerror = function () {
      btn.classList.remove('speaking');
      if (epochAtStart !== epocaCorrente()) return;
      if (callbacks && callbacks.onEnd) callbacks.onEnd();
    };
    if (callbacks && callbacks.onStart) callbacks.onStart();
    synth.speak(utterance);
  }

  BI.loadVoices = loadVoices;
  BI.looksLikeMaleVoice = looksLikeMaleVoice;
  BI.pickVoice = pickVoice;
  BI.vocePossibile = vocePossibile;
  BI.staParlando = staParlando;
  BI.fermaLaVoce = fermaLaVoce;
  BI.pausaLaVoce = pausaLaVoce;
  BI.riprendiLaVoce = riprendiLaVoce;
  BI.nuovaEpoca = nuovaEpoca;
  BI.epocaCorrente = epocaCorrente;
  BI.toggleSpeak = toggleSpeak;
})(window.BI);
