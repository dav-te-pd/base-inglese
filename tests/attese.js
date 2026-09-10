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

module.exports = { attendiSottotitoloEsito };
