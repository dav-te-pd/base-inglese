// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// LO STRATO `suoni` — i toni dell'app, che NON sono la voce.
//
// Estratto da index.html il 2026-09-18. Undici pezzi, 111 righe, **zero
// dipendenze verso altri strati** — resta solo `window.APP_CONFIG`.
//
// ⚠️ NON STA IN `app/audio.js`, ED E' UNA DECISIONE MISURATA, non una svista.
// Sono due meccanismi diversi del browser su due oggetti globali diversi:
// `app/audio.js` possiede `speechSynthesis` (la VOCE: legge un testo), questo
// file possiede `AudioContext` (i TONI: corretto, sbagliato, traguardo,
// countdown, uscita). Non condividono niente — nessuna funzione dell'uno
// nomina l'altro — e unirli darebbe un file con due meta' tenute insieme dal
// fatto che tutte e due fanno rumore.
//
// ⚠️ PRIMO STRATO DELLA SERIE CHE ESCE PER SERVIRE I MODULI, non per finire il
// 22. Il 2026-09-18 la misura ha detto che il modulo piu' piccolo dell'app
// (Repeat Aloud) nomina **venti** cose irraggiungibili da un file separato, e
// `sfxPlayTraguardoSound` e' una di quelle venti. **Questo file esce perche'
// serve a chi verra' dopo**, non perche' il suo confine fosse in sospeso.
//
// ⚠️ E I DUE LISTENER GLOBALI VENGONO CON LUI, di proposito.
// `warmAudioContextOnce` e' agganciata a `pointerdown` e `keydown` sul
// `document` con `{ once: true }`: assorbe in silenzio il primo scatto
// dell'AudioContext sul primo tocco dello studente, invece che sul primo
// Corretto. **Lasciare la funzione qui e i due `addEventListener` in
// index.html vorrebbe dire separare una difesa dal suo innesco** — e chi
// leggesse l'uno senza l'altro non capirebbe perche' esiste.
//
// ⚠️ COSA SI ROMPE SE QUESTO FILE NON ARRIVA: il dettaglio misurato sta in
// testa a tests/test_suoni_estratto.js.

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  function warmAudioContextOnce() {
    var ctx = sfxGetAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
    } catch (e) {}
  }

  document.addEventListener('pointerdown', warmAudioContextOnce, { once: true });
  document.addEventListener('keydown', warmAudioContextOnce, { once: true });

  // sfxAudioCtx is NOT Speed Match's own state despite sitting in this
  // block — it's the one shared AudioContext behind every sfxPlay*
  // function below, used by every module (censimento audit, job 1: the
  // old "sr" prefix on the whole sound library read as Speed-Match-only
  // and invited exactly this kind of misplacement).
  var sfxAudioCtx = null;

  function sfxGetAudioCtx() {
    if (!sfxAudioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      sfxAudioCtx = new AC();
    }
    // The browser can auto-suspend an idle AudioContext (power saving,
    // backgrounding); a suspended context drops start()'d oscillators
    // silently, no error — which is exactly how Traguardo could "not be
    // heard" even though this function was called correctly. Every sound
    // call goes through here, so resuming here covers all of them, not
    // just the boot-time warm-up (warmAudioContextOnce).
    if (sfxAudioCtx.state === 'suspended') { try { sfxAudioCtx.resume(); } catch (e) {} }
    return sfxAudioCtx;
  }

  // volume defaults to 0.15 (Corretto/Traguardo's own level) when omitted —
  // Sbagliato/Countdown pass their own CONFIG.sound.events.*.volume.
  function sfxPlayTone(freq, durationMs, volume) {
    var ctx = sfxGetAudioCtx();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume === undefined ? 0.15 : volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {}
  }

  // ---- Event-sound catalog readers (see CONFIG.sound.events' own
  // comment) — every caller below names the EVENT it just had, never a
  // button; each function reads ONLY its own CONFIG.sound.events entry,
  // so retuning a pitch/volume/duration in config is the only way to
  // change what plays, anywhere. "sfx" (not "sr"): this whole family is
  // called from every module — Dialogo, Voice Coach, Match Practice, Flash
  // Card, Speed Match alike — never Speed Match's own, so it needed a
  // prefix that says "global" the moment it stopped being one module's
  // (censimento audit, job 1). ----
  function sfxPlayCorrectSound() {
    var cfg = CONFIG.sound.events.corretto;
    sfxPlayTone(cfg.freq, cfg.durationMs);
  }

  function sfxPlayWrongSound() {
    var cfg = CONFIG.sound.events.sbagliato;
    sfxPlayTone(cfg.freq, cfg.durationMs, cfg.volume);
  }

  // Traguardo: three ascending notes via sfxPlayTone in sequence (CLAUDE.md
  // rule 13 — no new synthesis technique), CONFIG.sound.events.traguardo's
  // own frequencies/durations/gap. Plays whenever a module closes with a
  // positive or neutral outcome — Speed Match, Match Practice and Flash
  // Card's own Finale (unconditionally: those have no verde/giallo
  // distinction), Dialogo's Finale only on "Sì, lo so" (never on "Non
  // ancora" — see dgFinishModule), Voice Practice/Voice Check's own Finale
  // below, Repeat Aloud/Story Cards's own completion button (their own
  // click IS the completion event — see CONFIG.sound's own comment).
  function sfxPlayTraguardoSound() {
    var cfg = CONFIG.sound.events.traguardo;
    cfg.notes.forEach(function (freq, i) {
      setTimeout(function () { sfxPlayTone(freq, cfg.noteDurationMs); }, i * (cfg.noteDurationMs + cfg.noteGapMs));
    });
  }

  // Countdown: plays once when a Dialogo per-line timer bar finishes (see
  // dgLineTimerFinished) — never a tick during the bar itself, that time
  // is reserved for the user to speak out loud.
  function sfxPlayCountdownSound() {
    var cfg = CONFIG.sound.events.countdown;
    sfxPlayTone(cfg.freq, cfg.durationMs, cfg.volume);
  }

  // One note per digit of a 3-2-1 "get ready" countdown — shared by Speed
  // Round's srRunCountdown and Dialogo Continuo's dgRunReadyCountdown
  // (CLAUDE.md rule 13). isFinal (the last digit, "1") gets the slightly
  // higher CONFIG.sound.events.ready.finalFreq; every other digit gets the
  // same freq.
  function sfxPlayReadyCountdownSound(isFinal) {
    var cfg = CONFIG.sound.events.ready;
    sfxPlayTone(isFinal ? cfg.finalFreq : cfg.freq, cfg.durationMs);
  }

  // Uscita: the "Ho finito, torna alla mappa" button on every Schermata
  // Finale (job 6, 3rd collaudo) — wired once in renderSummaryScreen, not
  // per module. See CONFIG.sound.events.uscita's own comment for why it's
  // pitched below Traguardo instead of reusing it.
  function sfxPlayExitSound() {
    var cfg = CONFIG.sound.events.uscita;
    sfxPlayTone(cfg.freq, cfg.durationMs, cfg.volume);
  }

  BI.warmAudioContextOnce = warmAudioContextOnce;
  BI.sfxGetAudioCtx = sfxGetAudioCtx;
  BI.sfxPlayTone = sfxPlayTone;
  BI.sfxPlayCorrectSound = sfxPlayCorrectSound;
  BI.sfxPlayWrongSound = sfxPlayWrongSound;
  BI.sfxPlayTraguardoSound = sfxPlayTraguardoSound;
  BI.sfxPlayCountdownSound = sfxPlayCountdownSound;
  BI.sfxPlayReadyCountdownSound = sfxPlayReadyCountdownSound;
  BI.sfxPlayExitSound = sfxPlayExitSound;
})(window.BI);
