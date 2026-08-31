// Pilotaggio condiviso dei moduli a scelta multipla (Speed Round, Quick
// Match) per i test.
//
// Nasce dalla correzione di Job11 in test_batch15.js e vale per tutti i
// moduli con la stessa meccanica, quindi i nomi qui dentro non portano il
// prefisso del modulo che li ha fatti nascere (CLAUDE.md regola 18): si passa
// il prefisso degli id ('sr' o 'qm') come argomento.
//
// Risolve due difetti che rendevano i test bugiardi oltre che instabili:
//
//   1. Cliccavano una posizione fissa (la prima opzione, o data-*-index="0")
//      dando per scontato che fosse quella sbagliata. Le opzioni sono quattro
//      e mescolate: una volta su quattro era invece quella giusta. Un test
//      che dichiara "rispondi sempre sbagliato" e sbaglia solo tre volte su
//      quattro non verifica quello che dice. Qui la scelta viene dai dati
//      dell'episodio, confrontando il testo delle opzioni con la traduzione
//      vera della domanda mostrata.
//
//   2. Avanzavano con attese fisse in millisecondi dentro cicli limitati, con
//      gli errori dei click ingoiati. Su una macchina con tempi diversi la
//      sequenza si sfasava e il modulo non arrivava mai in fondo, facendo
//      fallire l'asserzione senza dire perché (CLAUDE.md regola 19). Qui ogni
//      passo aspetta un cambiamento di stato reale, e lo stato viene letto in
//      un'unica valutazione sincrona dentro la pagina, senza finestre in cui
//      possa cambiare a metà lettura.

const fs = require('fs');
const { repoPath } = require('./test-env');

const DEFAULT_EPISODE = ['data', 'a1-episodio1-inglese.json'];

function loadEpisode(parts) {
  return JSON.parse(fs.readFileSync(repoPath.apply(null, parts || DEFAULT_EPISODE), 'utf8'));
}

// Le voci di un grado dell'episodio — la stessa domanda che l'app fa a
// episodeGrade(). I test non raggiungono levels.X.items a mano, così se la
// forma del file cambia ancora c'è un punto solo da aggiornare anche qui.
function loadGrade(grade, parts) {
  const entry = loadEpisode(parts).levels[grade];
  return (entry && entry.items) || [];
}

// I gradi C e D contengono segnaposto ({{papa}}, {{partenza}}, ...) che
// l'app sostituisce con le scelte dell'utente prima di mostrare il testo.
// Confrontare il testo a schermo con il modello scritto nel file darebbe
// sempre "non trovato": qui il modello diventa un'espressione regolare in
// cui ogni segnaposto vale "una o più parole qualsiasi". Un grado senza
// segnaposto (A, B) si comporta come prima, cioè un confronto esatto.
function templateMatcher(template) {
  const escaped = String(template || '').trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\{\\\{[^}]*?\\\}\\\}/g, '.+');
  return new RegExp('^' + escaped + '$');
}

function matchesTemplate(template, text) {
  return templateMatcher(template).test(String(text || '').trim());
}

// La risposta corretta per la domanda mostrata, senza sapere la direzione:
// se la domanda è l'inglese di una voce la risposta è il suo italiano, e
// viceversa. Torna il MODELLO della risposta (non il testo finito, che
// dipende dalle scelte dell'utente), da confrontare con matchesTemplate.
// Torna null se la domanda non è nel vocabolario.
//
// Due voci possono avere la STESSA forma una volta tolti i segnaposto — nel
// grado C "I'm {{figliaNome}}." e "I'm {{figlioEta}}." diventano entrambe
// "I'm .+\." — e allora il modello da solo non basta a dire da quale voce
// venga la domanda mostrata. Le opzioni a schermo sciolgono il dubbio: la
// voce giusta è quella la cui risposta è davvero fra le quattro. Senza
// opzioni (chiamata diretta dai test) vale la prima che combacia, come
// prima.
function correctAnswerFor(vocabulary, prompt, optionTexts) {
  const p = String(prompt || '').trim();
  const options = optionTexts || [];
  const candidates = [];
  for (let i = 0; i < vocabulary.length; i++) {
    if (matchesTemplate(vocabulary[i].english, p)) candidates.push(vocabulary[i].italian.trim());
  }
  if (!candidates.length) {
    for (let i = 0; i < vocabulary.length; i++) {
      if (matchesTemplate(vocabulary[i].italian, p)) candidates.push(vocabulary[i].english.trim());
    }
  }
  if (!candidates.length) return null;
  if (candidates.length > 1 && options.length) {
    const shown = candidates.filter(function (answer) {
      return options.some(function (t) { return matchesTemplate(answer, t); });
    });
    if (shown.length === 1) return shown[0];
  }
  return candidates[0];
}

// Tutto lo stato che serve, in una sola valutazione sincrona dentro la
// pagina.
function readQuizState(page, prefix) {
  return page.evaluate(function (p) {
    // Visibilità reale a schermo, non solo l'attributo hidden: una classe con
    // un proprio display può batterlo (CLAUDE.md regola 12).
    var vis = function (id) { var el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
    var has = function (id) { return !!document.getElementById(id); };
    var popup = document.getElementById('attempt-popup');
    var prompt = document.getElementById(p + '-prompt');
    return {
      prefix: p,
      popupOpen: !!popup && popup.classList.contains('is-open'),
      screen: vis(p + '-summary-screen') ? 'summary'
        : vis(p + '-retry-intro-screen') ? 'retryIntro'
        : vis(p + '-quiz-screen') ? 'quiz'
        : vis(p + '-countdown-screen') ? 'countdown'
        : vis(p + '-start-screen') ? 'start' : 'altro',
      inRetryPass: vis(p + '-ripasso-badge'),
      prompt: prompt ? prompt.textContent.trim() : '',
      options: Array.prototype.map.call(document.querySelectorAll('#' + p + '-options .sr-option'), function (b) {
        return { text: b.textContent.trim(), disabled: b.disabled };
      }),
      advanceVisible: vis(p + '-advance-btn'),
      // Speed Round apre con "Pronto? Via!", Quick Match con "Inizia".
      startButtonId: has(p + '-ready-btn') ? p + '-ready-btn' : p + '-start-btn'
    };
  }, prefix);
}

// Attende un cambiamento di stato descritto da un predicato valutato dentro
// la pagina. Mai un tempo fisso: su una macchina lenta aspetta di più, su una
// veloce prosegue subito.
function waitForQuizChange(page, predicate, arg) {
  return page.waitForFunction(predicate, arg, { timeout: 20000 });
}

// Attraversa un modulo a scelta multipla fino alla Schermata Finale.
//
//   prefix    'sr' | 'qm'
//   options.vocabulary   il vocabolario dell'episodio (per sapere le risposte)
//   options.answerFor    (state) => 'correct' | 'wrong'
//   options.onState      (state) => void | 'stop'  — osservatore facoltativo,
//                        chiamato a ogni lettura di stato; può fermare il giro
//   options.maxSteps     limite di sicurezza (default 400)
//
// Torna 'summary' se ha raggiunto la Schermata Finale, 'stopped' se onState
// ha chiesto di fermarsi. Se finisce i passi disponibili solleva un errore
// esplicito, invece di lasciare fallire un'asserzione più avanti senza
// spiegare perché.
async function playThroughQuiz(page, prefix, options) {
  const vocabulary = options.vocabulary;
  const answerFor = options.answerFor;
  const onState = options.onState;
  const maxSteps = options.maxSteps || 400;

  for (let step = 0; step < maxSteps; step++) {
    const st = await readQuizState(page, prefix);
    if (onState && (await onState(st)) === 'stop') return 'stopped';

    if (st.popupOpen) {
      await page.locator('#attempt-popup-next').click();
      await waitForQuizChange(page, function () {
        var p = document.getElementById('attempt-popup');
        return !p || !p.classList.contains('is-open');
      });
      continue;
    }

    if (st.screen === 'summary') return 'summary';

    if (st.screen === 'start') {
      await page.locator('#' + st.startButtonId).click();
      await waitForQuizChange(page, function (id) {
        var e = document.getElementById(id);
        return !e || e.getClientRects().length === 0;
      }, prefix + '-start-screen');
      continue;
    }

    if (st.screen === 'countdown') {
      // Il 3-2-1 iniziale di Speed Round: si aspetta che finisca da solo,
      // senza indovinarne la durata.
      await waitForQuizChange(page, function (id) {
        var e = document.getElementById(id);
        return !!e && e.getClientRects().length > 0;
      }, prefix + '-quiz-screen');
      continue;
    }

    if (st.screen === 'retryIntro') {
      await page.locator('#' + prefix + '-retry-continue-btn').click();
      await waitForQuizChange(page, function (id) {
        var e = document.getElementById(id);
        return !e || e.getClientRects().length === 0;
      }, prefix + '-retry-intro-screen');
      continue;
    }

    if (st.screen !== 'quiz') {
      await waitForQuizChange(page, function (id) {
        var e = document.getElementById(id);
        return !!e && e.getClientRects().length > 0;
      }, prefix + '-quiz-screen');
      continue;
    }

    // "Avanti" dopo una risposta sbagliata o un tempo scaduto. Non basta
    // aspettare che il pulsante sparisca: se scatta la valvola di sicurezza,
    // goNext apre prima il popup dei tentativi e rimanda la domanda
    // successiva, quindi "Avanti" resta lì finché il popup non viene chiuso.
    if (st.advanceVisible) {
      await page.locator('#' + prefix + '-advance-btn').click();
      await waitForQuizChange(page, function (p) {
        var vis = function (id) { var el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
        var popup = document.getElementById('attempt-popup');
        return !vis(p + '-advance-btn') || (!!popup && popup.classList.contains('is-open'));
      }, prefix);
      continue;
    }

    if (!st.options.length) {
      await waitForQuizChange(page, function (sel) {
        return document.querySelectorAll(sel).length > 0;
      }, '#' + prefix + '-options .sr-option');
      continue;
    }

    const correctText = correctAnswerFor(vocabulary, st.prompt, st.options.map(function (o) { return o.text; }));
    if (correctText === null) throw new Error('Domanda non presente nel vocabolario dell\'episodio: "' + st.prompt + '"');
    const wantCorrect = answerFor(st) === 'correct';
    let index = -1;
    for (let i = 0; i < st.options.length; i++) {
      const isCorrect = matchesTemplate(correctText, st.options[i].text);
      if (wantCorrect ? isCorrect : !isCorrect) { index = i; break; }
    }
    if (index === -1) throw new Error('Nessuna opzione ' + (wantCorrect ? 'corretta' : 'sbagliata') + ' per "' + st.prompt + '"');

    await page.locator('#' + prefix + '-options .sr-option').nth(index).click();
    // Dopo il click la schermata cambia in uno di questi modi: compare
    // "Avanti" (sbagliata o tempo scaduto), cambia la domanda, si apre il
    // popup dei tentativi, o si arriva al ripasso/riepilogo. Si aspetta che
    // sia successo qualcosa, non un tempo fisso.
    await waitForQuizChange(page, function (a) {
      var vis = function (id) { var el = document.getElementById(id); return !!el && el.getClientRects().length > 0; };
      var popup = document.getElementById('attempt-popup');
      var prompt = document.getElementById(a.prefix + '-prompt');
      return vis(a.prefix + '-advance-btn')
        || vis(a.prefix + '-summary-screen')
        || vis(a.prefix + '-retry-intro-screen')
        || (!!popup && popup.classList.contains('is-open'))
        || (!!prompt && prompt.textContent.trim() !== a.prev);
    }, { prefix: prefix, prev: st.prompt });
  }
  throw new Error('Il modulo "' + prefix + '" non ha raggiunto la Schermata Finale entro ' + maxSteps + ' passi');
}

module.exports = { loadEpisode, loadGrade, correctAnswerFor, matchesTemplate, readQuizState, waitForQuizChange, playThroughQuiz };
