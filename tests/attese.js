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
// DIMENTICANZA. Tre dei 26 punti aspettano che una classe **sparisca**. Su
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

module.exports = {
  attendiSottotitoloEsito, attendiVisibile, attendiNascosto,
  attendiAbilitato, attendiDisabilitato, attendiClasse
};
