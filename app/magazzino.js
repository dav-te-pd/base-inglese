// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo. Il suo tag va PRIMA di `identita.js` e `progressi.js`, che lo
// chiamano a tempo di parsing.
//
// ============================================================
// ⚠️ IL MAGAZZINO — l'unico file che sa DOVE si salva quello che lo studente
// lascia dietro di sé. Passo 1.7, 2026-09-20.
//
// Oggi è il `localStorage` del browser. Domani saranno i progressi sul server
// (tappa ③), e il senso di questo file è che quel giorno si cambia QUI.
//
// ⚠️ IL PASSO SI CHIAMAVA «L'ASTRAZIONE DELLA FONTE», E IL NOME ERA IL
// PROBLEMA. Diceva «Supabase in UN file invece che in 101 punti». Misurati il
// 2026-09-20: i punti sono DICIASSETTE, e i cinque `fetch` dei file di dati —
// la «fonte» — erano già un punto solo dai passi 1.9 e 1.11. *Il nome mandava
// a guardare la metà già fatta.* Quello che restava scoperto è l'opposto: non
// i dati che ARRIVANO, ma quelli che si SALVANO.
//
// ⚠️ E L'ASTRAZIONE ESISTEVA GIÀ, dentro `app/progressi.js`: tre funzioni
// (`leggiMagazzino`, `scriviMagazzino`, `cancellaMagazzino`) che coprivano
// sette punti su diciassette. Questo passo non l'ha inventata — **l'ha
// promossa a file e le ha portato dentro i dieci rimasti fuori.**
//
// ------------------------------------------------------------
// LE TRE FAMIGLIE, E DUE SU TRE ANDRANNO SUL SERVER
// ------------------------------------------------------------
//
//   famiglia                     | quante | il giorno di Supabase
//   -----------------------------|--------|----------------------------------
//   progressi dello studente     |   7    | VANNO sul server
//   identità e tema              |   5    | il nome VA, il tema resta (è una
//                                |        | preferenza di questo dispositivo)
//   override del Pannello Admin  |   5    | RESTANO qui, sempre
//
// ⚠️ La terza famiglia non è un residuo da migrare: è la configurazione locale
// di chi sviluppa, e sul server non ha senso. *Averla dentro questo file non
// serve a spostarla — serve a non doverla cercare il giorno in cui si sposta
// il resto, e a non spostarla per sbaglio insieme agli altri.*
//
// ------------------------------------------------------------
// PERCHÉ L'INTERFACCIA È SINCRONA, ED È UNA SCELTA DICHIARATA
// ------------------------------------------------------------
//
// Il `localStorage` è sincrono, il server no. La tentazione è renderla
// asincrona subito, «così poi non si tocca più». **Non si fa, e il motivo è
// misurato:** il passo 1.11b ha reso asincrona UNA cosa sola — la struttura
// del corso — e ha prodotto **trentatré asserzioni rosse in sette file**, tutte
// da correggere a mano. Farlo adesso su diciassette punti costerebbe lo stesso
// prezzo per un beneficio che oggi non si può provare, perché il server non
// c'è.
//
// **Il valore di questo passo è CONCENTRARE, non pre-convertire.** Il giorno di
// Supabase l'interfaccia diventa asincrona **una volta sola, in questo file**,
// e i chiamanti da sistemare saranno dodici — non centouno.
//
// ⚠️ IL PREZZO, DETTO: quel giorno i dodici chiamanti si toccano. *È accettato
// perché toccarli oggi costerebbe uguale e in più non si potrebbe verificare
// niente.*
//
// ------------------------------------------------------------
// TUTTO INGOIA, E NON È UN `.catch` VUOTO PER DISTRAZIONE
// ------------------------------------------------------------
//
// In navigazione privata, con i dati del sito bloccati, o con la quota piena,
// `localStorage` **alza**. Un'eccezione lì fermerebbe il disegno di una
// schermata per una preferenza non salvata: l'app diventerebbe inutilizzabile
// per non aver ricordato un tema. Quindi si ingoia e si torna il valore vuoto
// — *ed è la stessa scelta che c'era prima in ognuno dei diciassette punti,
// scritta una volta invece di diciassette.*
// ============================================================

// Come gli altri strati: se nessuno l'ha ancora creato, lo spazio dei nomi
// nasce qui. Questo file puo' essere il primo a girare.
window.BI = window.BI || {};

(function (BI) {
  'use strict';

  // ---- JSON: la forma dei progressi (oggetti, mappe di voci) ----
  function magLeggiJson(chiave, vuoto, valida) {
    try {
      var raw = localStorage.getItem(chiave);
      var letto = raw ? JSON.parse(raw) : null;
      if (letto && (!valida || valida(letto))) return letto;
      return vuoto();
    } catch (e) { return vuoto(); }
  }

  function magScriviJson(chiave, valore) {
    try { localStorage.setItem(chiave, JSON.stringify(valore)); } catch (e) {}
  }

  // ---- TESTO: le bandierine '1'/'0' e i nomi ----
  //
  // ⚠️ RESTA SEPARATO DAL JSON, e non è una comodità: farli passare per le
  // stesse due funzioni vorrebbe dire o cambiare il formato salvato — rompendo
  // i profili che ce l'hanno già — o dare a una funzione una seconda modalità.
  // *Una cosa che risponde a due domande dà la risposta giusta a una e
  // sbagliata all'altra (famiglia ⓪-decies).* La distinzione era già dichiarata
  // in `app/progressi.js`; qui è diventata due funzioni invece di un commento.
  function magLeggiTesto(chiave, vuoto) {
    try { return localStorage.getItem(chiave) || (vuoto === undefined ? '' : vuoto); }
    catch (e) { return vuoto === undefined ? '' : vuoto; }
  }

  function magScriviTesto(chiave, valore) {
    try { localStorage.setItem(chiave, String(valore)); } catch (e) {}
  }

  function magCancella(chiave) {
    try { localStorage.removeItem(chiave); } catch (e) {}
  }

  BI.magLeggiJson = magLeggiJson;
  BI.magScriviJson = magScriviJson;
  BI.magLeggiTesto = magLeggiTesto;
  BI.magScriviTesto = magScriviTesto;
  BI.magCancella = magCancella;
})(window.BI);
