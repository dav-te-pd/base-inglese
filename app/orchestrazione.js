// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// ⚠️ MA IL SUO TAG STA IN UN POSTO DIVERSO DAGLI ALTRI NOVE, ED E' LA COSA
// PIU' IMPORTANTE DA SAPERE SU QUESTO FILE.
//
// I nove strati precedenti stanno in `<head>`. Questo no: sta in fondo a
// `<body>`, subito prima dello script principale. **Non e' un'eccezione
// tollerata, e' una seconda fila**, e il motivo e' che `views` prende i suoi
// tredici nodi con `getElementById` **a tempo di parsing**. In `<head>` il
// markup non esiste ancora: i tredici verrebbero tutti `null` e il primo
// `showView()` morirebbe.
//
// **Il criterio degli strati divide per QUANDO una cosa gira**, e qui la
// differenza non e' di dimensione ma di natura: i nove di `<head>` girano
// *prima del DOM*, questo *dopo*. Metterlo nella prima fila sarebbe far
// coincidere due momenti diversi perche' portano lo stesso nome — «uno
// strato».
//
// Chi estrarra' `ui-condivisa` (gli overlay, `helpOverlayEl`,
// `howItWorksOverlayEl` e i cinque `addEventListener` sul markup) va in questa
// stessa fila, per la stessa ragione. Da oggi la domanda non e' «posso mettere
// il tag in `<head>`?» ma «questo file tocca il markup mentre viene letto?».

// ⚠️ TRE NOMI DI VISTA CORRISPONDONO A UN MODULO CHE OGGI STA IN index.html
// E CHE AL PASSO 23 USCIRA' IN UN FILE SUO — `repeatAloud`, `storyCards`,
// `voiceCoach`, e con loro `match`, `dialogo`, `speedMatch`, `flashcard`,
// `customize`.
//
// **Oggi NON e' una dipendenza in avanti, e il motivo va scritto qui e non
// scoperto dopo:** questo file non chiama nessuna di quelle funzioni. Tiene
// dei NOMI DI CHIAVE che corrispondono a id del markup, e il markup e' in
// index.html insieme a tutto il resto. `showView('repeatAloud')` non sa che
// esiste un modulo Repeat Aloud: cerca una chiave in un oggetto.
//
// **Ma quando i moduli usciranno, il verso cambia — e non perche' cambia
// questo file: perche' cambiano loro.** Saranno i moduli a nominare
// `BI.showView`, non il contrario. Chi legge questo file fra un mese vedra'
// otto nomi che assomigliano a otto file che stanno altrove, e senza questa
// riga sembrerebbe un'estrazione fatta male. Non lo e': **il vincolo e' al
// contrario.**

(function (BI) {
  'use strict';

  // Le tredici viste, prese UNA VOLTA a tempo di parsing.
  //
  // ⚠️ Gli id sono tredici LETTERALI, e vale la pena dirlo: non c'e' nessuna
  // concatenazione, quindi una ricerca testuale su `view-repeat-aloud` trova
  // sia il markup sia questa riga. E' l'opposto dei dodici id costruiti che
  // vivono dentro i moduli (`'story-cards-body-' + skillId`), dove il legame
  // fra markup e codice esiste solo nella concatenazione e nessuno strumento
  // lo vede.
  var views = {
    onboarding: document.getElementById('view-onboarding'),
    home: document.getElementById('view-home'),
    customize: document.getElementById('view-customize'),
    // La lista degli EPISODI sta prima della mappa dei MODULI, come nel
    // giro dello studente: casa -> episodi -> mappa -> modulo (passo
    // 1.13-bis, 2026-09-22).
    // ⚠️ `attesa` STA IN QUESTO ELENCO PERCHE' ALTRIMENTI NON SI SPEGNE MAI:
    // `showView` non nomina nessuna vista, gira su queste chiavi. *Una vista
    // che nasce accesa nel markup e non e' qui resterebbe sopra tutte le
    // altre per sempre* — ed e' l'unica vista dell'app che nasce accesa.
    attesa: document.getElementById('view-attesa'),
    episodes: document.getElementById('view-episodes'),
    map: document.getElementById('view-map'),
    repeatAloud: document.getElementById('view-repeat-aloud'),
    storyCards: document.getElementById('view-story-cards'),
    voiceCoach: document.getElementById('view-voice-coach'),
    match: document.getElementById('view-match'),
    dialogo: document.getElementById('view-dialogo'),
    speedMatch: document.getElementById('view-speed-match'),
    flashcard: document.getElementById('view-flashcard'),
    error: document.getElementById('view-error')
  };

  // ⚠️ `pronunciation` E' USCITA DA QUESTO ELENCO il 2026-09-19 (passo A), ed
  // e' il punto in cui togliere una vista si e' fatto sentire: l'elemento non
  // esisteva piu', questa riga metteva `null` nella mappa, e al PRIMO
  // `showView` l'app moriva con `Cannot read properties of null`. **Il boot
  // riusciva lo stesso** — `view-onboarding` si accendeva — quindi il guasto
  // non si vedeva aprendo la pagina: si vedeva al primo cambio di schermata.
  //
  // *Chi toglie una vista deve togliere la sua riga QUI. L'elenco e' un dato,
  // e un dato che nomina un elemento sparito non da' un elenco piu' corto: da'
  // un `null` che aspetta.*

  // Accende una vista e spegne le altre undici. Cinque righe, e fa UNA cosa —
  // dal 2026-09-17, quando la regola 21 le ha tolto la pulizia dei moduli che
  // si era sedimentata dentro. `showView` cambia la vista attiva; chi lascia
  // un modulo chiama la pulizia.
  //
  // Non nomina nessuna vista in particolare: prende un nome e lo cerca. E'
  // il motivo per cui esce senza aspettare niente — l'elenco sopra e' un
  // dato, non una dipendenza.
  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].classList.toggle('is-active', key === name);
    });
  }

  BI.views = views;
  BI.showView = showView;
})(window.BI);
