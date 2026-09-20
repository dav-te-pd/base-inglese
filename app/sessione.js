// DIPENDE DA: identita.js [parsing], progressi.js [parsing], quiz-engine.js [parsing], ui-condivisa.js [parsing]
// ⚠️ LO STATO DI SESSIONE, E I QUATTRO PEZZI CHE LO LEGANO. Passo B, 2026-09-19.
//
// Qui dentro c'è **quello che vale per la sessione corrente e non per l'app**:
// quale episodio si sta facendo, quali nomi ha scelto lo studente, e quali
// colori ha guadagnato senza averli ancora consegnati col pulsante.
//
// ⚠️ E CI SONO I QUATTRO PEZZI CHE PER MESI NON POTEVANO USCIRE.
// `itemText`, `recordPendingMastery`, `recordMultipleChoiceResult` e
// `buildMultipleChoiceOptions` erano registrati come **bloccati dallo stato di
// sessione**: non potevano entrare in `ui-condivisa.js` senza rompere l'unica
// cosa che quello strato promette — *non sa quale modulo ha sopra e non tocca
// la sessione*. **Non erano bloccati da lei: erano lei.** Adesso stanno col
// loro stato, e da qui i sei moduli smettono di chiedere a `index.html`.
//
// ⚠️ L'EPISODIO SI RICEVE, NON SI CALCOLA, ed è la riga che permette a questo
// passo di venire PRIMA del catalogo.
//
// `currentEpisode` nasceva da `EPISODES[CONFIG.episodioCorrente]`, cioè dal
// **catalogo**, che è ancora in `index.html` (passo C). Se questo file lo
// calcolasse, chiederebbe `EPISODES` all'insù — il verso che questa serie
// esiste per eliminare, e il conto salirebbe invece di scendere.
//
// Lo riceve con `impostaEpisodioCorrente`, chiamata una volta al boot da chi
// il catalogo ce l'ha. *È la stessa distinzione che il 2026-09-18 aveva già
// deciso quali pezzi potevano entrare in `ui-condivisa`: `fillTemplate` riceve
// episodio e valori come parametri, `itemText` andava a prenderli. Uno li
// riceve, l'altro se li va a cercare — e chi se li va a cercare deve stare
// dove sono.*
//
// Il gemello `impostaValoriCorrenti` esisteva già dal 21-quater: questo non è
// un meccanismo nuovo, è la sua simmetria.
//
// ⚠️ GLI ACCESSORI SONO FUNZIONI, MAI ALIAS, e non è uno stile: `currentEpisode`
// e `currentValues` vengono RIASSEGNATI. Un alias fotograferebbe il valore di
// adesso (la famiglia di `istruzioniInMemoria`, 18 settembre); una funzione
// legge quello di quando la chiami.
//
// ⚠️ E `valoriCorrenti()` TORNA L'OGGETTO, non una copia. `app/personalizza.js`
// ci SCRIVE dentro (`BI.valoriCorrenti()[key] = …`): è l'unico dei sette
// lettori che scrive invece di leggere, ed è il caso più diverso di questo
// passo. Con una copia smetterebbe di funzionare **in silenzio** — nessun
// errore, solo un nome che non si salva.

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var getUserName = BI.getUserName;
  var loadMastery = BI.loadMastery;
  var shuffle = BI.shuffle;
  var fillTemplate = BI.fillTemplate;

  // ---- LO STATO ----
  //
  // L'episodio arriva da fuori (vedi in testa). Finché non arriva è `null`, e
  // dev'essere così: un valore finto qui sarebbe peggio, perché un lettore che
  // gira troppo presto otterrebbe un episodio sbagliato invece di un errore.
  var currentEpisode = null;
  var currentValues = null;
  var pendingMastery = {};

  /* ============================================================
     CUMULATIVE MASTERY (foundation #1)
     Tracks a color state — 'rosso' / 'giallo' / 'verde' — per exercise
     item (a word or a phrase), per user. Unseen items have no entry
     yet. Tuning lives in CONFIG.mastery, not here.

     ⚠️ `LEVEL_CLASS` E' USCITO il 2026-09-19 (passo A), e con lui la classe
     CSS `new`. Traduceva rosso/giallo/verde in wrong/similar/correct per un
     lettore solo — `renderPhrase`, dentro la vista morta — ed era anche
     **l'unico posto in tutta l'app che disegnava la voce MAI INCONTRATA**.
     La regola 39 di CLAUDE.md lo citava come esempio: la sua frase e' stata
     corretta nello stesso commit, perche' la regola resta vera sulla
     decisione e falsa solo su chi la mostrava.

     *Se un report futuro vorra' quel colore, lo riscrivera': una classe CSS
     e' cinque righe. Tenerla per un report che non esiste significava tenere
     un esempio falso dentro una regola per anni.*
     ============================================================ */
  var LEVELS = ['rosso', 'giallo', 'verde'];

  function nextLevel(level) {
    var idx = LEVELS.indexOf(level);
    return idx > -1 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : level;
  }

  function prevLevel(level) {
    var idx = LEVELS.indexOf(level);
    return idx > 0 ? LEVELS[idx - 1] : LEVELS[0];
  }




  // result: 'correct' | 'similar' | 'wrong'
  function applyMasteryResult(entry, result) {
    if (!entry) {
      // Una voce mai incontrata NON esiste: assenza di dato, non un giudizio.
      // Non serve rappresentarlo — e' gia' cosi'.
      //
      // ⚠️ QUI C'ERA SCRITTO «l'unico lettore che abbia mai DISEGNATO questi
      // colori lo sa: renderPhrase usa la classe 'new' quando entry manca»,
      // ed e' FALSO dal 2026-09-19: quel lettore viveva nella vista
      // `pronunciation`, irraggiungibile da qualunque punto dell'app, uscita
      // col passo A insieme a `LEVEL_CLASS` e alla classe `new`. *La regola 39
      // di CLAUDE.md lo dichiara dal giorno stesso; questa riga e' rimasta
      // indietro.* Se un report futuro vorra' quel colore, lo riscrivera': una
      // classe CSS e' cinque righe.
      //
      // Per questo qui non c'e' un quarto livello: un
      // livello sotto rosso entrerebbe in LEVELS, che e' l'array su cui
      // nextLevel/prevLevel fanno l'aritmetica, e cambierebbe la retrocessione
      // di TUTTE le voci per sistemare solo le nuove.
      //
      // La PRIMA risposta le da' il colore che quella risposta merita, invece
      // di parcheggiarla su rosso. Prima una risposta GIUSTA veniva letta come
      // "non lo sa" — falso di sicuro — e con promotionStreak 2 servivano
      // QUATTRO risposte giuste per arrivare a verde invece di due.
      //
      // Perche' giallo e non verde: una risposta giusta non prova che sai una
      // parola, prova che l'hai indovinata questa volta. Il verde arriva
      // quando la sai due volte di fila, e allora vuol dire qualcosa. Lo
      // streak a 1 e' quello che rende vera la frase precedente: la seconda
      // risposta giusta promuove, come per ogni altra voce.
      //
      // Il compromesso, dichiarato: una risposta indovinata a caso porta a
      // giallo. E' falso a volte; l'errore opposto — leggere una risposta
      // giusta come "non lo sa" — e' falso sempre. E giallo non e' definitivo:
      // se era fortuna, la prossima risposta lo scopre.
      if (result === 'wrong') return { level: 'rosso', streak: 0 };
      return { level: 'giallo', streak: result === 'correct' ? 1 : 0 };
    }
    if (result === 'wrong') {
      return { level: prevLevel(entry.level), streak: 0 };
    }
    if (result === 'similar') {
      return { level: entry.level, streak: 0 };
    }
    var streak = entry.streak + 1;
    if (streak >= CONFIG.mastery.promotionStreak && entry.level !== 'verde') {
      return { level: nextLevel(entry.level), streak: 0 };
    }
    return { level: entry.level, streak: streak };
  }

  /* ============================================================
     MASTERY IN SOSPESO — il gesto sceglie cosa si salva

     Un modulo che gira NON scrive piu' i colori nel magazzino: li tiene
     qui. Il travaso nel magazzino vero avviene in un punto solo,
     commitPendingMastery, chiamato da completeModule — cioe' dal pulsante
     "Ho finito". Le tre uscite, e sono una regola, non un caso:

       "Ho finito"            -> esito + voci + completato
       "Esci e riprendi dopo" -> solo le risposte gia' dichiarate
       "← Mappa"              -> niente

     Perche': uscire con "← Mappa" dopo tre risposte lasciava tre colori
     scritti per sempre, senza che l'utente avesse dichiarato niente. Il
     pulsante E' il gesto; quello che non passa dal pulsante non e' successo.

     ⚠️ Oggi nessuno mostra i colori MENTRE un modulo gira: i lettori di
     loadMastery sono i tre punti che scrivevano, il pannello admin,
     hasStartedEpisodeModules e la vista morta `pronunciation`. Per questo qui
     basta un oggetto in memoria. SE domani un modulo disegnasse i colori
     durante l'esercizio, dovra' leggere il pending E il magazzino, non solo
     il magazzino — altrimenti mostrerebbe il colore di ieri su una risposta
     di adesso.
     ============================================================ */


  // Sostituisce applyMasteryResult + saveMastery nei punti che scrivono.
  // `result` e' o un esito da far passare per la scala ('correct' | 'similar'
  // | 'wrong'), o una voce gia' pronta ({ level, streak }) per i due casi che
  // la scala la scavalcano apposta: il "Non lo so" dichiarato e il
  // force-accept della coda di ripasso. Ritorna la voce risultante, cosi' chi
  // chiama puo' usarla senza rileggere.
  // ⚠️ CHI PRODUCE UN COLORE DELLA MASTERY, E CHI APPOSTA NO. Voce ④ del
  // passo 13, chiusa il 2026-09-20 — e chiude scrivendolo qui, accanto al
  // punto unico che mescola, invece che in un documento.
  //
  // Le voci dei gradi A, B e C prendono un colore da Repeat Aloud, Match
  // Practice, Speed Match, Flash Card, Voice Practice e Voice Check.
  // **Le battute del grado D lo prendono SOLO da Voice Practice e Voice
  // Check.**
  //
  // ⚠️ **I TRE MODULI DIALOGO NON NE PRODUCONO NESSUNO, e non e' un buco da
  // riempire.** La loro domanda finale e' un'autovalutazione sull'INTERO
  // dialogo — «l'hai imparato?» — non una misura per voce: non c'e' niente da
  // attribuire a una battuta piuttosto che a un'altra. *E' la ragione per cui
  // l'esito del Dialogo vive in `moduleOutcome`, che colora il passo in mappa,
  // e non qui dentro, che colora le singole voci.*
  //
  // Chi aggiunge un modulo nuovo decide da che parte sta, e lo scrive: un
  // modulo che non produce colori non e' un modulo incompleto.
  function recordPendingMastery(unitId, result) {
    var corrente = pendingMastery[unitId];
    if (corrente === undefined) {
      corrente = loadMastery(currentEpisode.id, getUserName())[unitId];
    }
    pendingMastery[unitId] = (typeof result === 'string')
      ? applyMasteryResult(corrente, result)
      : result;
    return pendingMastery[unitId];
  }

  function itemText(item, lang) {
    return fillTemplate(lang === 'en' ? item.english : item.italian, currentEpisode, currentValues, lang);
  }





  /* ============================================================
     SHARED: multiple-choice quiz logic (Speed Match + Match Practice)
     Direction label, 4-option builder, and mastery/retry-queue
     recording are the same mechanics in both module types (CLAUDE.md
     rule 13) — module-specific state (own retryAttempts/retryQueue,
     own mastery unitId prefix) is passed in rather than hardcoded
     here, so Speed Match and Match Practice keep fully independent retry
     queues and never share mastery entries for the same vocabulary
     item. The max-attempts threshold itself is NOT module-specific —
     every caller passes the same CONFIG.retryQueue.maxAttempts.
     ============================================================ */

  function buildMultipleChoiceOptions(item, direction, vocabPool) {
    var correctText = itemText(item, direction === 'en-it' ? 'it' : 'en');
    var pool = vocabPool.filter(function (v) { return v.id !== item.id; });
    var distractors = shuffle(pool).slice(0, 3).map(function (v) {
      return itemText(v, direction === 'en-it' ? 'it' : 'en');
    });
    var options = distractors.map(function (text) { return { text: text, correct: false }; });
    options.push({ text: correctText, correct: true });
    return shuffle(options);
  }

  // declaredNonAttempt: an explicit "Non lo so" — not a wrong answer but an
  // admitted non-attempt, so it resets straight to rosso regardless of the
  // current level (bypasses applyMasteryResult's normal one-level-at-a-time
  // demotion). params.retryAttempts/retryQueue are the caller's own state,
  // not shared, so each module type keeps its own independent retry queue;
  // params.maxRetryAttempts is the one shared CONFIG.retryQueue.maxAttempts
  // value every caller passes in (not a per-module setting).
  // params.attemptCounts is a SEPARATE per-item counter from retryAttempts
  // (that one only counts wrong tries) — this one counts every attempt,
  // right or wrong, purely so the caller can tell when an item has reached
  // CONFIG.retryQueue.attemptsReminderThreshold (jobs 3+4's safety-valve
  // popup, same mechanic as Voice Coach's vcAttempts). Returns that count.
  function recordMultipleChoiceResult(params) {
    var unitId = params.unitPrefix + ':' + params.item.id + ':' + params.direction;
    recordPendingMastery(unitId, params.declaredNonAttempt
      ? { level: 'rosso', streak: 0 }
      : (params.correct ? 'correct' : 'wrong'));

    var attemptNum = (params.attemptCounts[params.item.id] || 0) + 1;
    params.attemptCounts[params.item.id] = attemptNum;

    if (!params.correct) {
      var attempts = (params.retryAttempts[params.item.id] || 0) + 1;
      params.retryAttempts[params.item.id] = attempts;
      if (attempts >= params.maxRetryAttempts) {
        // Give up retrying this one — force-accept as rosso so the retry
        // loop can't run forever on a single stubborn item.
        recordPendingMastery(unitId, { level: 'rosso', streak: 0 });
      } else if (params.retryQueue.indexOf(params.item.id) === -1) {
        params.retryQueue.push(params.item.id);
      }
    }
    return attemptNum;
  }

  BI.episodioCorrente = function () { return currentEpisode; };
  BI.impostaEpisodioCorrente = function (e) { currentEpisode = e; };
  BI.valoriCorrenti = function () { return currentValues; };
  BI.impostaValoriCorrenti = function (v) { currentValues = v; };
  BI.masteryInSospeso = function () { return pendingMastery; };
  BI.azzeraMasteryInSospeso = function () { pendingMastery = {}; };
  BI.recordPendingMastery = recordPendingMastery;
  BI.itemText = itemText;
  BI.buildMultipleChoiceOptions = buildMultipleChoiceOptions;
  BI.recordMultipleChoiceResult = recordMultipleChoiceResult;
})(window.BI);
