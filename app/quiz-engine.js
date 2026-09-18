// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// LO STRATO `quiz-engine` — quello che CALCOLA un esito.
//
// Estratto da index.html il 2026-09-18. Nove pezzi, 110 righe, **zero
// dipendenze verso altri strati** oltre `window.APP_CONFIG`.
//
// ⚠️ IL CRITERIO, E NON E' L'ELENCO DEL PIANO: ci sta dentro una funzione che
// **restituisce un valore**, non una che **restituisce del markup**.
//
// Il piano metteva qui anche `renderStars`, e misurandola non ci sta:
// `starsForPercent(pct)` torna un NUMERO (quante stelle merita una
// percentuale), `renderStars(count)` torna una stringa di HTML con la classe
// `vc-star`. **La prima e' una regola, la seconda e' un disegno** — e il
// disegno appartiene a `ui-condivisa`, dove finira'.
//
// *Le due si chiamano quasi uguale e stanno una sotto l'altra: e' esattamente
// il caso in cui un elenco ereditato porta fuori la cosa sbagliata senza che
// nessuno se ne accorga, perche' l'app continuerebbe a funzionare.*
//
// ⚠️ PERCHE' ESCE ADESSO: e' la seconda delle cinque cose che servono al primo
// modulo. Il 2026-09-18 la misura ha detto che Repeat Aloud nomina **venti**
// cose irraggiungibili da un file separato; `itemText` e compagnia sono nello
// strato `dati`, i suoni sono usciti ieri, e queste nove servono a Voice
// Coach, Match, Speed Match e Flash Card. **Esce per chi verra' dopo.**
//
// ⚠️ COSA SI ROMPE SE NON ARRIVA: il dettaglio misurato sta in testa a
// tests/test_quiz_engine_estratto.js.

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  // The ONE percentage scale reused everywhere a whole-session score needs
  // an alto/medio/basso bucket — Speed Match, Match Practice, Flash Card and
  // Voice Coach all read this SAME top-level CONFIG.percentageThresholds,
  // not a per-module copy.
  function percentageBucket(pct) {
    var t = CONFIG.percentageThresholds;
    if (pct >= t.alto) return 'alto';
    if (pct >= t.medio) return 'medio';
    return 'basso';
  }

  function starsForPercent(pct) {
    var t = CONFIG.voiceCoach.starThresholds;
    if (pct >= t.threeStars) return 3;
    if (pct >= t.twoStars) return 2;
    if (pct >= t.oneStar) return 1;
    return 0;
  }

  // Mescola, e basta: nessun modulo puo' reclamarla. Il nome era `shuffle`
  // fino al 2026-09-08 — un prefisso ereditato dal primo modulo che l'ha
  // introdotta, mentre la usano tutti: Speed Match, Match Practice, Flash
  // Card, Voice Check e buildMultipleChoiceOptions. Regola 18: un nome
  // condiviso non porta il prefisso di chi e' arrivato prima.
  // Sta ancora in mezzo al blocco di Speed Match, come sfxAudioCtx qui sopra:
  // e' lo spacchettamento che dara' a queste cose il loro strato, non questa
  // rinomina.
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function stripForCompare(word) {
    return word
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z']/g, '');
  }

  function tokenize(text) {
    return text.trim().split(/\s+/).filter(Boolean);
  }

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var dp = new Array(n + 1);
    for (var j = 0; j <= n; j++) dp[j] = j;
    for (var i = 1; i <= m; i++) {
      var prev = dp[0];
      dp[0] = i;
      for (j = 1; j <= n; j++) {
        var tmp = dp[j];
        dp[j] = Math.min(
          dp[j] + 1,
          dp[j - 1] + 1,
          prev + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
        prev = tmp;
      }
    }
    return dp[n];
  }

  function similarity(a, b) {
    if (!a.length && !b.length) return 1;
    var dist = levenshtein(a, b);
    var maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - dist / maxLen;
  }

  // Global alignment (Needleman-Wunsch) scored by word similarity, so extra,
  // missing, or reordered words don't derail the rest of the comparison.
  function alignWords(target, recognized) {
    var n = target.length, m = recognized.length;
    var GAP = CONFIG.matching.alignmentGapPenalty;
    var score = [];
    var traceback = [];
    for (var i = 0; i <= n; i++) {
      score.push(new Array(m + 1).fill(0));
      traceback.push(new Array(m + 1).fill(null));
    }
    for (i = 1; i <= n; i++) { score[i][0] = score[i - 1][0] + GAP; traceback[i][0] = 'up'; }
    for (var j = 1; j <= m; j++) { score[0][j] = score[0][j - 1] + GAP; traceback[0][j] = 'left'; }

    var tNorm = target.map(stripForCompare);
    var rNorm = recognized.map(stripForCompare);

    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        var matchScore = score[i - 1][j - 1] + similarity(tNorm[i - 1], rNorm[j - 1]);
        var upScore = score[i - 1][j] + GAP;
        var leftScore = score[i][j - 1] + GAP;
        var best = Math.max(matchScore, upScore, leftScore);
        score[i][j] = best;
        if (best === matchScore) traceback[i][j] = 'diag';
        else if (best === upScore) traceback[i][j] = 'up';
        else traceback[i][j] = 'left';
      }
    }

    var pairs = [];
    i = n; j = m;
    while (i > 0 || j > 0) {
      var dir = traceback[i][j];
      if (dir === 'diag') {
        pairs.unshift({ targetIndex: i - 1, recognizedIndex: j - 1 });
        i--; j--;
      } else if (dir === 'up') {
        pairs.unshift({ targetIndex: i - 1, recognizedIndex: null });
        i--;
      } else {
        j--;
      }
    }
    return pairs;
  }

  function classify(targetWord, recognizedWord) {
    if (recognizedWord === null || recognizedWord === undefined) return 'wrong';
    var t = stripForCompare(targetWord);
    var r = stripForCompare(recognizedWord);
    if (t === r) return 'correct';
    var sim = similarity(t, r);
    if (sim >= CONFIG.matching.similarThreshold) return 'similar';
    return 'wrong';
  }

  BI.percentageBucket = percentageBucket;
  BI.starsForPercent = starsForPercent;
  BI.shuffle = shuffle;
  BI.stripForCompare = stripForCompare;
  BI.tokenize = tokenize;
  BI.levenshtein = levenshtein;
  BI.similarity = similarity;
  BI.alignWords = alignWords;
  BI.classify = classify;
})(window.BI);
