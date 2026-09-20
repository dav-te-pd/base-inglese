// DIPENDE DA: dati.js [parsing], identita.js [parsing], mappa.js [parsing], progressi.js [parsing], sessione.js [chiamata], spazio.js [parsing], suoni.js [parsing], ui-condivisa.js [parsing]
// ⚠️ IL PRIMO MODULO. Non uno strato: un MODULO — cioè la cosa che usa tutto
// il resto, e il primo pezzo del progetto per cui «estrarre» ha voluto dire
// «avere già estratto tutto quello che tocca».
//
// È uscito per primo dei sei perché è il più piccolo — quattro pezzi, 117
// righe — non perché fosse il più urgente: **se la meccanica dell'estrazione
// ha un difetto, si vede qui al costo minore.** Gli altri cinque stanno fra
// 262 e 462 righe.
//
// ⚠️ UNA SOLA DIPENDENZA ALL'INSÙ, E PORTA LA SUA RAGIONE: `itemText`.
//
// Vive ancora in `index.html` perché lega lo **stato di sessione** —
// `currentEpisode` e `currentValues` — ed è per questo che non è entrata in
// `ui-condivisa` insieme a `fillTemplate`, che invece li riceve come
// parametri. *Una li riceve, l'altra li va a prendere.* Esce col passo dello
// stato di sessione, insieme a `recordPendingMastery`,
// `recordMultipleChoiceResult` e `buildMultipleChoiceOptions`: sono i quattro
// registrati in `docs/decisioni-stato.md` come bloccati dalla stessa cosa.
//
// **Uno è il numero da guardare quando uscirà il secondo modulo.** Se al terzo
// è ancora uno e ancora `itemText`, il passo dello stato di sessione è in
// ritardo e si vede qui. *Un numero che sale con una ragione scritta è un
// progetto; senza, è un difetto.*
//
// ⚠️ IL TAG STA NELLA SECONDA FILA, e stavolta la ragione NON è il markup:
// questo file non tocca nessun nodo mentre viene letto — i suoi sette listener
// si agganciano dentro `openRepeatAloud`, cioè a tempo di chiamata. È la fila
// **degli alias**: `renderListenBlock`, `introDismissPref`, `openEpisodeMap` e
// gli altri arrivano da `ui-condivisa` e da `mappa`, che stanno già in fondo a
// <body>. *La domanda «questo file tocca il markup mentre viene letto?» qui
// risponde NO, e la fila è la seconda lo stesso: le ragioni sono due, e questa
// è la seconda.*

(function (BI) {
  'use strict';

  var episodeDataCache = BI.episodeDataCache;
  var barraAzioniFinale = BI.barraAzioniFinale;
  var episodeGrade = BI.episodeGrade;
  var episodeGradeRequired = BI.episodeGradeRequired;
  var loadEpisodeData = BI.loadEpisodeData;
  var getUserName = BI.getUserName;
  var isIntroDismissed = BI.isIntroDismissed;
  var setIntroDismissed = BI.setIntroDismissed;
  var sfxPlayTraguardoSound = BI.sfxPlayTraguardoSound;
  var renderListenBlock = BI.renderListenBlock;
  var speakListenBlock = BI.speakListenBlock;
  var openHowItWorksOverlay = BI.openHowItWorksOverlay;
  var openHelpFor = BI.openHelpFor;
  var introDismissPref = BI.introDismissPref;
  var renderIntroContent = BI.renderIntroContent;
  var applyOutcomeSubtitle = BI.applyOutcomeSubtitle;
  var moduleNameHtml = BI.moduleNameHtml;
  var moduleTypeLabel = BI.moduleTypeLabel;
  var openEpisodeMap = BI.openEpisodeMap;
  var completeModule = BI.completeModule;
  var leaveModule = BI.leaveModule;
  var showLoadError = BI.showLoadError;

  // ⚠️ `itemText` NON SI ALIASA, E LA RAGIONE VALE PER TUTTI E CINQUE I
  // MODULI CHE VERRANNO DOPO.
  //
  // Viene da `index.html`, e lo script inline di `index.html` è **l'ULTIMO**:
  // sta in fondo a <body>, dopo tutti i tag `<script src>`. Quando questo file
  // viene letto, `BI.itemText` non esiste ancora — un alias ne congelerebbe
  // `undefined` **per sempre**.
  //
  // Misurato, non temuto: la prima versione di questo file lo aliasava, e il
  // modulo si apriva con il corpo fermo su «Caricamento...». `TypeError:
  // itemText is not a function`, ingoiato dal `.catch` del caricamento —
  // quindi **nessun errore in pagina**, solo un modulo che non finisce di
  // caricare.
  //
  // **La regola che ne discende, e non ha eccezioni: un nome che viene da
  // `index.html` si chiama `BI.nome(...)` al momento dell'uso, mai aliasato in
  // cima.** Per i nomi che vengono dagli STRATI l'alias va bene: i loro tag
  // stanno prima. È la stessa famiglia dell'alias su una variabile riassegnata
  // (`istruzioniInMemoria`, 2026-09-18) — là il valore cambiava dopo, qui non
  // esiste ancora prima. *Un alias fotografa; il problema è sempre quando.*
  //
  // `tests/test_dipendenze_dichiarate.js` lo vieta adesso, così il secondo
  // modulo non ci ricasca.

  // ⚠️ E `spazio.js` RISULTA A TEMPO DI PARSING, non di chiamata: la riga
  // `DIPENDE DA` in testa diceva «chiamata» e la misura l'ha smentita. Non è
  // per gli alias — qui `BI.unaVoltaSola` e `BI.registraModulo` si chiamano
  // col loro nome intero — ma perché **`BI.registraModulo` gira al primo
  // livello dell'IIFE**, cioè mentre il file viene letto. *Dove si usa una
  // cosa e quando arriva sono due domande diverse: la seconda è l'unica che
  // vincola l'ordine dei tag.*

  var currentRepeatAloudModule = null;
  function renderRepeatAloud(data) {
    var ruleHtml = data.generalRule
      ? '<div class="general-rule panel"><span class="general-rule-label">Regola generale</span>' + data.generalRule + '</div>'
      : '';
    var itemsHtml = episodeGradeRequired(data, currentRepeatAloudModule.grade, currentRepeatAloudModule).map(function (item) {
      return '<div class="repeat-item panel">' +
        '<div class="repeat-item-top">' +
        '<span class="repeat-item-english">' + BI.itemText(item, 'en') + '</span>' +
        renderListenBlock({ say: item.id, blocco: true }) +
        '</div>' +
        '<span class="repeat-item-italian">' + BI.itemText(item, 'it') + '</span>' +
        '<span class="repeat-item-tip">' + item.pronunciationTip + '</span>' +
        '</div>';
    }).join('');
    document.getElementById('repeat-aloud-body').innerHTML =
      ruleHtml + '<div class="repeat-list">' + itemsHtml + '</div>';
  }
  // ---- Repeat Aloud intro screen — was its own trial implementation
  // (renderRaIntroContent/openRaIntro, a near-verbatim duplicate of
  // renderIntroContent/the inline branch every other module uses);
  // aligned to the generic shape (censimento audit, follow-up) now that
  // the pattern has long since extended past this one module. howItWorks
  // still comes only from istruzioni-moduli.json (CLAUDE.md rule 8);
  // dismissal goes through the same generic isIntroDismissed/
  // setIntroDismissed('repeatAloud', ...) every other module uses. ----
  function raShowScreen(name) {
    document.getElementById('repeat-aloud-intro-screen').hidden = name !== 'intro';
    document.getElementById('repeat-aloud-main-screen').hidden = name !== 'main';
    document.getElementById('repeat-aloud-summary-screen').hidden = name !== 'summary';
    // Nothing to explain on the completion screen — hide Spiegazione
    // there (CLAUDE.md rule 10, same as every other module's Schermata
    // Finale); Help stays available everywhere.
    barraAzioniFinale('repeat-aloud', name);
  }
  function openRepeatAloud(module) {
    // I listener di questo modulo, una volta sola.
    //
    // ⚠️ LA CHIAVE E' 'repeatAloud' E QUI FUNZIONEREBBE ANCHE `module.kind`,
    // PERCHE' QUESTA `open` SERVE UN KIND SOLO. E' esattamente il caso in cui
    // la regola sbagliata passa verde — come su Flash Card — quindi la chiave
    // giusta si scrive lo stesso: la regola e' «il BLOCCO», non «il kind
    // quando capita di coincidere». La regola per esteso sta accanto a
    // `BI.unaVoltaSola` in app/spazio.js.
    //
    // Sul PERCHE' stiano prima di `showView`: vale la stessa cosa scritta in
    // openSpeedMatch — oggi non e' verificabile, ed e' una precauzione per il
    // passo 22. Dichiarata, non provata.
    BI.unaVoltaSola('repeatAloud', function () {
    document.getElementById('repeat-aloud-body').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-say]');
      if (!btn) return;
      var data = episodeDataCache[currentRepeatAloudModule.dataFile];
      var item = data && episodeGrade(data, currentRepeatAloudModule.grade).find(function (it) { return it.id === btn.getAttribute('data-say'); });
      if (!item) return;
      // Correction (5th collaudo): job 1 (4th collaudo) locked every other
      // control here, but this module has no countdown to desync — free
      // browsing (tap any word, any order, any time) is the intended
      // behavior, same as Ascolta e Ripeti. toggleSpeak's own toggle
      // handles switching between words safely on its own.
      speakListenBlock(btn, BI.itemText(item, 'en'));
    });

    document.getElementById('repeat-aloud-back-map').addEventListener('click', openEpisodeMap);

    document.getElementById('repeat-aloud-watch-btn').addEventListener('click', function () {
      openHowItWorksOverlay(currentRepeatAloudModule, { dismissPref: introDismissPref('repeatAloud') });
    });

    document.getElementById('repeat-aloud-intro-start-btn').addEventListener('click', function () {
      setIntroDismissed('repeatAloud', getUserName(), document.getElementById('repeat-aloud-intro-dont-show-again').checked);
      raShowScreen('main');
    });

    document.getElementById('repeat-aloud-help-btn').addEventListener('click', function () {
      openHelpFor(currentRepeatAloudModule);
    });

    document.getElementById('repeat-aloud-complete').addEventListener('click', function () {
      // Job 4 (earlier turn): Traguardo plays on every positive/neutral
      // completion — tied to THIS event (declaring the study done), same
      // moment every other module's Traguardo fires (reaching its own
      // Schermata Finale), never to "← Mappa" above (leaves without
      // completing) nor to the summary's own exit button below.
      sfxPlayTraguardoSound();
      raShowScreen('summary');
      applyOutcomeSubtitle('repeat-aloud-summary-title-sub', 'studioCompleteMessages', 'default');
    });

    document.getElementById('repeat-aloud-complete-btn').addEventListener('click', function () {
      // Nessun esito: CONFIG.moduleOutcomeRules non nomina repeatAloud, quindi
      // questo modulo non colora la mappa. Non e' una dimenticanza.
      completeModule(currentRepeatAloudModule, null);
    });
    });
    currentRepeatAloudModule = module;
    document.getElementById('repeat-aloud-title').innerHTML = moduleNameHtml(module.label);
    document.getElementById('repeat-aloud-type-badge').textContent = moduleTypeLabel(module);
    document.getElementById('repeat-aloud-body').innerHTML = '<p class="module-status-text">Caricamento...</p>';
    leaveModule('repeatAloud');
    if (isIntroDismissed('repeatAloud', getUserName())) {
      raShowScreen('main');
    } else {
      document.getElementById('repeat-aloud-intro-dont-show-again').checked = false;
      renderIntroContent('repeatAloud', 'repeat-aloud-intro-title', 'repeat-aloud-intro-body', currentRepeatAloudModule.label, 'repeat-aloud-intro-start-btn', 'repeat-aloud-intro-dont-show-text');
      raShowScreen('intro');
    }
    loadEpisodeData(module).then(function (data) {
      if (currentRepeatAloudModule !== module) return;
      renderRepeatAloud(data);
    }).catch(function () {
      if (currentRepeatAloudModule !== module) return;
      showLoadError(function () { openRepeatAloud(module); });
    });
  }
  // Repeat Aloud.
  BI.registraModulo('repeatAloud', openRepeatAloud);
})(window.BI);
