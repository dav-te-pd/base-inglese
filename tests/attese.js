// Le attese dei test che NON sono a tempo: aspettano lo stato vero.
//
// Non è un file di test — è un pezzo condiviso, e sta in un modulo suo per la
// stessa ragione per cui esiste `renderListenBlock` in index.html: cinque
// copie della stessa attesa sono cinque occasioni di scriverne una diversa, e
// la differenza non la vede nessuno finché una macchina più lenta non la fa
// cadere.
//
// ⚠️ IL CASO CHE L'HA FATTO NASCERE, 2026-09-10. Il sottotitolo di una
// Schermata Finale non compare quando la schermata compare: `applyOutcomeSubtitle`
// svuota l'elemento SUBITO e lo riempie dentro `loadFeedbackMessages().then(...)`,
// cioè dopo un fetch di `messaggi-feedback.json`. Chi legge il sottotitolo
// appena vede la schermata sta correndo contro quel fetch.
//
// E la corsa NON si vince o si perde a caso: dipende da **se qualcun altro ha
// già scaldato la cache**. In Speed Match sì — la valvola dei tentativi e la
// Schermata Ripasso leggono gli stessi messaggi durante il quiz, quindi al
// riepilogo il `.then` risolve in un microtask. Nel Dialogo no: lì il fetch è
// vero, ed è il primo. Nessuno può tenere a mente quali moduli scaldano la
// cache e quali no — per questo l'attesa deve guardare il RISULTATO, non
// contare millisecondi.
//
// Misurato: sei giri in locale sempre verdi, due corse di CI su due rosse.
// **Non un'intermittenza: una differenza stabile fra le due macchine.**

// ============================================================================
// ⚠️ COME SI SCEGLIE L'APPRODO — il criterio, e vale per OGNI conversione,
// non per la famiglia che l'ha fatto scrivere.
//
//   L'EFFETTO SU CUI ASPETTI NON PUO' ESSERE QUELLO CHE L'ASSERZIONE LEGGE.
//   ALTRIMENTI DIVENTA VERA PER COSTRUZIONE.
//
// Sono due scoperte diverse che sono la stessa cosa.
//
// La prima (2026-09-11, famiglia «un suono o la voce»): nove punti leggevano
// `speaking === false` 50 ms dopo un tocco. Il finto sintetizzatore si spegne
// da solo dopo 500 ms, quindi «finche' non parla piu'» sarebbe tornato vero
// ANCHE SENZA NESSUN TOCCO: l'attesa avrebbe misurato la stessa cosa che
// l'asserzione voleva provare. Quello che si perde non e' il valore: e'
// l'ISTANTE in cui viene letto, e l'istante non si vede nel diff.
//
// La seconda (2026-09-11, famiglia «una scrittura nel localStorage»): la
// famiglia prende il nome da cio' che l'asserzione LEGGE, e quello e' l'effetto
// piu' PRECOCE del gesto, non l'ultimo. In `completeModule` l'ordine e'
// scrivi l'esito -> travasa la mastery -> segna completato -> ridisegna la
// mappa. Aspettare la scrittura significa fermarsi al primo effetto e leggere
// tutto il resto scoperto; aspettare la classe della riga sulla mappa
// renderebbe vera per costruzione l'asserzione che quella classe la verifica.
// L'approdo giusto era il terzo: `#view-map.is-active`, l'ULTIMO effetto e
// l'unico che nessuna di quelle asserzioni legge.
//
// **Quindi la regola operativa: si guarda l'ULTIMO effetto del gesto, e se
// l'asserzione legge anche quello, l'asserzione si SPEZZA** — l'attesa diventa
// la prima delle due e si dichiara per quello che e'. Succede: due dei tredici
// punti di quella famiglia leggevano entrambi gli effetti.
//
// ⚠️ E UNA COSA CHE IL VERDE LOCALE NON SA DIRE, misurata lo stesso giorno.
// Messe a 0 ms, due attese sono rimaste verdi tutte e due: una stava davanti a
// un gestore SINCRONO (non guardava niente) e l'altra davanti a un gestore
// ASINCRONO (una corsa vera, vinta perche' il container e' veloce — regola
// 19). **La misura non le ha distinte. A distinguerle e' stato il codice: il
// `.then(` c'e' o non c'e'.** Una misura che non distingue va riportata per
// quello che e', non interpretata.
//
// ⚠️ E PERCHE' SI CONVERTE ANCHE UNA GUARDIA CHE OGGI NON GUARDA NIENTE:
// `test_batch2.js` aspettava 150 ms dopo «Inizia l'episodio» quando il gestore
// era sincrono. Il commit 0601b87 l'ha reso asincrono
// (`ensureEpisodeSlotFields(...).then(...)`), e quei 150 ms sono passati da
// «non guardano niente» a «sono l'unica cosa fra il test e una corsa» —
// **senza che nessuno toccasse il test, e senza che niente lo dicesse.**
// Una guardia inutile oggi e' un'assicurazione che costa una riga contro un
// cambiamento che e' gia' avvenuto una volta.
// ============================================================================

// Aspetta che un sottotitolo di esito sia stato RIEMPITO davvero.
//
// Ritorna true/false invece di sollevare, così chi chiama può farne
// un'asserzione esplicita: **il fallimento di quella riga è lo scadere del
// tempo**, e va scritto così. «Aspetto finché è vero, poi verifico che sia
// vero» è tautologico se il timeout resta implicito — la stessa famiglia
// dell'asserzione che sembra viva e non prova niente.
async function attendiSottotitoloEsito(page, elId, timeoutMs) {
  try {
    await page.waitForFunction(function (id) {
      var el = document.getElementById(id);
      return !!el && el.textContent.trim().length > 0;
    }, elId, { timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

// ── LA SCHERMATA CHE COMPARE O SPARISCE ──────────────────────────────────────
//
// Famiglia ② del 14b: 30 punti censiti l'11 settembre, 29 veri (il trentesimo
// vive dentro il file FINTO di test_conta_attese.js ed è un dato di prova).
// Tutti avevano la stessa forma: si clicca, si aspettano 50-600 ms scelti a
// occhio, e poi si legge `.hidden` dando per scontato che nel frattempo sia
// successo. Su una macchina più lenta quel «nel frattempo» non succede, e
// l'asserzione legge lo stato di PRIMA — cioè dice il falso senza rompersi.
//
// La forma non è nuova: `waitForSelector({ state })` è già usata 73 volte in
// questa suite. Quello che mancava era il VALORE DI RITORNO. Un
// `waitForSelector` nudo SOLLEVA allo scadere del tempo, e il file muore con
// un `TimeoutError` che non dice quale comportamento si è rotto; restituendo
// true/false, **lo scadere del tempo diventa l'asserzione che fallisce**, con
// il suo testo. È la stessa scelta di `attendiSottotitoloEsito` qui sopra, e
// il motivo per cui sono due funzioni riusate invece di due righe ricopiate.
//
// DUE NOMI E NON UNO CON UN PARAMETRO: `attendiVisibile(page, sel)` si legge al
// sito di chiamata, `attendi(page, sel, true)` no — un booleano posizionale non
// dice cosa fa. Stessa ragione per cui `renderListenBlock` ha preso `mini` come
// nome invece di una posizione.
//
// ⚠️ LIMITE DICHIARATO, e riguarda solo `attendiNascosto`: per Playwright
// «hidden» è vero anche quando l'elemento **non esiste più**. Dove il test deve
// dire «c'è, ma è nascosto» — non «è sparito» — il controllo sull'esistenza
// resta al chiamante, che è quello che serve per la regola 12: la guardia
// `[hidden]{display:none!important}` protegge elementi che nel DOM ci sono.

async function attendiVisibile(page, selettore, timeoutMs) {
  try {
    await page.waitForSelector(selettore, { state: 'visible', timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

async function attendiNascosto(page, selettore, timeoutMs) {
  try {
    await page.waitForSelector(selettore, { state: 'hidden', timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

// ── UN PULSANTE O UNA CLASSE CHE CAMBIA STATO ────────────────────────────────
//
// Famiglia ① del 14b: 52 punti censiti, **26 da convertire** — il triage
// dell'11 settembre ha tolto 11 «stato già vero prima dell'attesa», 12 negative
// e 3 misclassificate. Il numero di una famiglia dice DOVE guardare, non quanto
// lavoro c'è.
//
// TRE NOMI E NON UNO CON UN PARAMETRO, e la distinzione è questa:
// `disabled` è una **variante del comportamento**, quindi ha due nomi —
// `attendi(sel, true)` al sito di chiamata non direbbe niente. La **classe**
// invece è il **dato**, quindi resta un argomento: le classi sono tante e
// diverse (`is-active`, `is-ahead-locked`, `outcome-verde`, `dg-bubble-timer`)
// e un nome per ognuna sarebbe un elenco che cresce a ogni classe nuova.
//
// ⚠️ NON ESISTE `attendiClasseAssente`, ED È UNA DECISIONE, NON UNA
// DIMENTICANZA — **e il contatore si muove: erano tre, poi quattro, dal
// 2026-09-11 sono CINQUE.** Il quinto è `test_batch10.js`, la spunta di
// ascolto del Dialogo: lì l'unico approdo possibile sarebbe la bolla che perde
// `is-active`. Il numero si scrive perché la soglia sia verificabile invece che
// ricordata: **a DIECI la funzione si fa, e siamo a metà.**
// Tre dei 26 punti aspettano che una classe **sparisca**. Su
// quei tre la classe c'è davvero prima, quindi la conversione sarebbe sicura —
// ma tre siti non giustificano una funzione da difendere per sempre, e il
// rischio è **asimmetrico**: sbagliarla produce un test vuoto, cioè la cosa
// che non si vede. Restano com'erano, marcati nel sito.
// **La condizione che la farebbe nascere è scritta e ha un numero: quando i
// siti che aspettano una classe che sparisce diventano DIECI.** Non è un no
// per sempre: è un no adesso, con la soglia dichiarata.

async function attendiAbilitato(page, selettore, timeoutMs) {
  return attendiDisabled(page, selettore, false, timeoutMs);
}

async function attendiDisabilitato(page, selettore, timeoutMs) {
  return attendiDisabled(page, selettore, true, timeoutMs);
}

// La classe è un argomento perché è il dato, non una variante: vedi sopra.
async function attendiClasse(page, selettore, classe, timeoutMs) {
  try {
    await page.waitForFunction(function (a) {
      var el = document.querySelector(a.sel);
      return !!el && el.classList.contains(a.cls);
    }, { sel: selettore, cls: classe }, { timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

// Il pezzo condiviso dalle due sopra: esiste perché differiscono per una
// negazione, e due copie di questo blocco sarebbero due occasioni di scriverne
// una diversa. **Non è esportato**: il booleano resta qui dentro, dove si legge
// accanto alla sua spiegazione, e fuori ci sono solo i due nomi.
async function attendiDisabled(page, selettore, atteso, timeoutMs) {
  try {
    await page.waitForFunction(function (a) {
      var el = document.querySelector(a.sel);
      return !!el && !!el.disabled === a.atteso;
    }, { sel: selettore, atteso: atteso }, { timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}


// ── UN SUONO O LA VOCE ───────────────────────────────────────────────────────
//
// Famiglia ③ del 14b: 29 punti censiti, **12 da convertire**. Il triage dell'11
// settembre ha tolto 5 negative, 2 «gia' vero», 1 misclassificata — e NOVE di
// una forma che le altre famiglie non avevano.
//
// ⚠️ LA QUINTA CATEGORIA, E VA LETTA PRIMA DI CONVERTIRE QUALUNQUE COSA QUI:
//
//   ASPETTARE RENDEREBBE L'ASSERZIONE BANALMENTE VERA.
//
// Nove punti verificano che toccare qualcos'altro INTERROMPA l'audio (regola
// 16), leggendo `speechSynthesis.speaking === false` **cinquanta millisecondi
// dopo il tocco**. Il finto sintetizzatore di `mockInit` si spegne **da solo
// dopo 500 ms**. Quindi un'attesa «finche' non parla piu'» tornerebbe entro
// 500 ms COMUNQUE, che il tocco abbia interrotto l'audio oppure no: «il tocco
// l'ha fermato» diventerebbe «prima o poi ha smesso», **vera sempre**.
//
// E' la conversione piu' pericolosa di tutte, peggio del gruppo «gia' vero»:
// quella si riconosce perche' lo stato non cambia mai, questa **somiglia a una
// transizione legittima** — c'e' un true che diventa false, e il codice
// convertito si legge benissimo. *Quello che si perde non e' il valore: e'
// l'ISTANTE in cui viene letto, e l'istante non si vede nel diff.*
// **I 50 ms non sono un margine: sono la distanza fra «l'ha fermato il tocco» e
// «e' finito da solo».** Quei nove restano a tempo, marcati nel sito, e il
// blocco [D] di `test_attese_condivise.js` rende il pericolo ESEGUIBILE.

// `attendiCheParla` NON prende un selettore, ed e' voluto: `speechSynthesis` e'
// UNO SOLO per pagina. **Un argomento che puo' avere un valore solo e' un invito
// a passargli quello sbagliato.**
async function attendiCheParla(page, timeoutMs) {
  try {
    await page.waitForFunction(function () {
      return !!(window.speechSynthesis && window.speechSynthesis.speaking);
    }, null, { timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

// Aspetta che in `window.__playedTones` compaiano almeno `quanti` toni con una
// delle frequenze date.
//
// PRENDE UNA LISTA E UN MINIMO, e i due parametri vengono dai due usi VERI, non
// da una scelta a priori: il **Traguardo** sono tre note (1046, 1318, 1568) e si
// verifica `>= 3`; **Corretto** e **uscita** sono una nota sola. Con una funzione
// «aspetta UN tono» il `>= 3` tornerebbe scritto a mano a ogni chiamata — cioe'
// sarebbe nata la prossima famiglia della conoscenza sparsa.
//
// ⚠️ NON SVUOTA `__playedTones`, E NON VA FATTO SVUOTARE. L'array e' CUMULATIVO
// dall'inizio della pagina, e altre asserzioni della stessa famiglia contano
// sul fatto che lo sia: le cinque negative verificano `length === 0` per dire
// «quel suono non e' MAI stato suonato». Azzerarlo qui per comodita' le
// renderebbe vere a prescindere — e sarebbero verdi senza provare niente.
async function attendiTono(page, frequenze, quanti, timeoutMs) {
  try {
    await page.waitForFunction(function (a) {
      var toni = window.__playedTones || [];
      var quanti = toni.filter(function (t) { return a.freq.indexOf(t.freq) !== -1; }).length;
      return quanti >= a.min;
    }, { freq: frequenze, min: quanti || 1 }, { timeout: timeoutMs || 15000 });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  attendiSottotitoloEsito, attendiVisibile, attendiNascosto,
  attendiAbilitato, attendiDisabilitato, attendiClasse,
  attendiCheParla, attendiTono
};
