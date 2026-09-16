// ============================================================
// LO SPAZIO DEI NOMI — passo 21 dello spacchettamento.
//
// ⚠️ QUESTO OGGETTO NON HA ANCORA UTENTI, ED E' VOLUTO.
//
// Il primo arriva al passo 21-bis, quando `stopAllModuleActivity` smettera' di
// nominare sei famiglie di moduli e chiamera' invece le pulizie registrate
// qui. Il secondo al 21-ter, con `openModuleByKind`. Fino ad allora questo
// file e' un meccanismo senza chiamanti — **non e' codice morto, e non va
// tolto.**
//
// Sta da solo, invece che insieme al suo primo utente, per una ragione sola:
// se nascesse insieme alla conversione della pulizia, il primo rosso avrebbe
// due sospettati. Cosi' ne ha uno.
//
// ------------------------------------------------------------
// COS'E', E PERCHE' SERVE
//
// Tutto il codice dell'app vive dentro UN IIFE (index.html, ~7000 righe) dove
// niente e' raggiungibile da fuori. La fase 4 lo spezza in ~20 file caricati
// in ordine come <script> separati — non moduli ES, per una ragione decisa e
// scritta: con i moduli ES la prima estrazione sarebbe anche l'ultima fermata
// possibile.
//
// Script separati significa che serve un posto dove i pezzi si trovano. E'
// questo.
//
// ------------------------------------------------------------
// ⚠️ L'ATTACCO TARDIVO NON E' UNA FUNZIONE IN PIU': E' LA RIGA QUI SOTTO
//
//     window.BI = window.BI || {};
//
// Quel `|| {}` e' il meccanismo. Un file che arriva PRIMA di questo lo spazio
// dei nomi se lo crea; uno che arriva DOPO lo trova gia' fatto. Nessuno dei
// due deve sapere in che ordine e' stato messo nel documento — ed e' il
// requisito del caricamento a richiesta, dove un modulo puo' arrivare molti
// secondi dopo l'avvio o non arrivare affatto.
//
// **Scriverlo `window.BI = {}` lo romperebbe in silenzio**: l'ultimo file
// caricato azzererebbe tutto quello che i precedenti hanno registrato, senza
// un errore. E' l'errore che qualcuno fara' "pulendo" questa riga, quindi
// `tests/test_spazio_nomi.js` lo prova proprio cosi'.
//
// ------------------------------------------------------------
// PERCHE' SI CHIAMA `BI` E NON `APP`
//
// Perche' `window.APP_CONFIG` esiste gia', e `APP_CONFIG` accanto a
// `APP.config` sono due cose diverse che si leggono uguali. E' la stessa
// famiglia di `sr` / `srShuffle`, gia' pagata una volta con una rinomina.
//
// ⚠️ E `APP_CONFIG` RESTA FUORI DA QUI, di proposito: e' nominato in 27 punti,
// e' documentato nella regola 3 di CLAUDE.md, e portarlo dentro sarebbe una
// rinomina con zero guadagno. Chi trova `window.APP_CONFIG` accanto a
// `window.BI` non sta guardando un'incoerenza da sistemare: sta guardando una
// decisione.
// ============================================================

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  // ⚠️ LE DUE COLLEZIONI LE CREA QUESTO FILE, E CI SI ENTRA SOLO DALLE DUE
  // FUNZIONI QUI SOTTO. NON E' CERIMONIA: E' LA REGOLA 12 APPLICATA QUI.
  //
  // Se ogni file scrivesse da se' `BI.pulizie = BI.pulizie || []`, un refuso —
  // `BI.pulizia`, singolare — creerebbe **una seconda collezione in silenzio**.
  // Il modulo smetterebbe di pulirsi, e non ci sarebbe nessun errore da
  // nessuna parte: la registrazione riuscirebbe, solo su un oggetto che nessuno
  // legge.
  //
  // Una FUNZIONE scritta male esplode subito (`BI.registraPulizio is not a
  // function`). Una PROPRIETA' scritta male no. E' tutta qui la differenza fra
  // un meccanismo e una convenzione — la stessa della guardia `[hidden]`
  // (regola 12): non si raccomanda di non sbagliare, si toglie l'occasione.
  //
  // **Chi volesse "semplificare" togliera' proprio queste due funzioni**,
  // perche' sembrano un giro in piu' attorno a un `push` e a un'assegnazione.
  // Sono la ragione per cui il file esiste.
  BI.pulizie = BI.pulizie || [];
  BI.moduli = BI.moduli || {};

  // Registra la pulizia di un modulo: quello che va fermato quando si lascia
  // il modulo, qualunque strada si sia presa per uscirne (CLAUDE.md regola 21,
  // il punto unico e' `stopAllModuleActivity`).
  //
  // Chi non e' caricato non registra niente, e quindi non ha niente da pulire:
  // dal 21-bis quella frase diventa vera **per costruzione** invece che per
  // attenzione di chi scrive.
  BI.registraPulizia = function (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('BI.registraPulizia vuole una funzione, ha ricevuto ' + typeof fn);
    }
    BI.pulizie.push(fn);
    return fn;
  };

  // Registra come si apre un modulo, sotto il suo `kind`.
  //
  // ⚠️ Registrare due volte lo stesso kind e' un ERRORE, non l'ultimo che
  // vince. Due file che dichiarano lo stesso modulo e' un conflitto vero — e
  // sceglierne uno zitti darebbe a chi ha scritto il secondo il 50% di
  // probabilita' di sbagliarsi per sempre. E' lo stesso ragionamento per cui
  // un episodio che dichiara `sequence` E `moduleOrder` e' un errore invece di
  // una precedenza (regola 4).
  // Fa girare `fn` UNA VOLTA SOLA per quel nome, e ignora le volte dopo.
  //
  // ⚠️ SERVE PERCHE' `open` VIENE CHIAMATA PIU' VOLTE: misurato il 2026-09-16,
  // il gesto piu' banale — apri un modulo, torna alla mappa, riaprilo — la
  // chiama TRE volte. Dal passo 21-quater i listener di un modulo vivono
  // dentro il suo `open`, quindi senza questa guardia ogni riapertura ne
  // aggiungerebbe una copia: il pulsante farebbe partire l'azione due volte,
  // poi tre, **senza nessun errore**.
  //
  // Sta qui e non come flag dentro ogni modulo perche' la conversione si
  // ripete OTTO volte: otto flag sono otto occasioni di scriverne uno diverso,
  // e la settima non fallisce, semplicemente non protegge. Stessa ragione per
  // cui le collezioni le crea questo file (regola 12: si toglie l'occasione di
  // sbagliare invece di raccomandare di non farlo).
  //
  // Non serve un aggancio/sgancio: le sette `renderSummaryScreen` girano una
  // volta sola al caricamento, quindi gli elementi non cambiano MAI identita'
  // durante la sessione — misurato prima di scegliere questa forma.
  // ⚠️ LA CHIAVE E' IL BLOCCO, CIOE' LA FUNZIONE `open`, NON IL `kind`.
  //
  // Scritta qui una volta sola perche' vale per tutti e otto i moduli, e
  // perche' il `kind` sembrera' sempre la scelta piu' precisa a chi legge.
  //
  // CINQUE `open` SU OTTO SERVONO PIU' DI UN `kind`: `openDialogo` ne serve
  // tre (i tre profili), e `openStoryCards`, `openVoiceCoach`, `openMatch`,
  // `openSpeedMatch` due ciascuna. I listener stanno nel BLOCCO, e il blocco
  // e' uno.
  //
  // ⚠️ QUI C'ERA SCRITTO **SEI**, e nominava `openFlashcard` fra loro. E' stato
  // falso dal 2026-09-16 (il ②) al 2026-09-16 (il ⑥), ed e' sopravvissuto
  // quattro giri perche' nessuna asserzione lo guardava. Adesso lo guarda il
  // blocco [F] di tests/test_listener_una_volta.js, che conta i gruppi di
  // `BI.moduli` e li confronta con questo numero: se qualcuno registra un
  // secondo kind su una delle tre qui sotto, [F] diventa rossa e questo
  // commento torna vero o viene corretto. *Un numero in un commento non
  // invecchia: resta esatto per il giorno in cui e' stato scritto e falso per
  // tutti gli altri, senza cambiare una lettera.*
  //
  // Misurato il 2026-09-16 mettendo la chiave sul kind: aprire i tre profili
  // del Dialogo porta ogni listener da **1 a 2 a 3** — il tocco su una bolla
  // partirebbe tre volte, senza nessun errore e senza niente in console.
  //
  // ⚠️ E LA CATEGORIA CHE COMPLETA LA REGOLA, perche' senza si legge come se
  // la chiave fosse sempre verificabile:
  //
  //     SU UNA FAMIGLIA A KIND SINGOLO — o con un kind solo per piu'
  //     descrittori — LA CHIAVE SBAGLIATA PASSA VERDE. Il verde non prova la
  //     chiave: LA PROVA LA REGOLA.
  //
  // Sono TRE, non una: `openFlashcard` (un kind, due descrittori),
  // `openRepeatAloud` e `openCustomize` (un kind ciascuna). Su di loro
  // `BI.unaVoltaSola('flashcard', …)` e `BI.unaVoltaSola(module.kind, …)`
  // passano **la stessa identica stringa**, quindi nessuna corsa puo'
  // distinguerle: ne' [E], ne' [C], ne' una falsificazione fatta apposta.
  //
  // *E' la forma in cui una regola sbagliata sopravvive — e sopravvive proprio
  // dove nessuno la vede cadere. Per questo la chiave giusta si scrive lo
  // stesso su tutte e otto: su cinque la protegge un test, su tre solo questa
  // riga.*
  //
  // Il nome da usare e' quello della FAMIGLIA, perche' e' cio' che resta
  // stabile quando al passo 22 ogni famiglia avra' il suo file: 'speedMatch',
  // 'dialogo', 'storyCards', 'voice', 'match', 'flashcard', 'repeatAloud',
  // 'personalizza'.
  //
  // Lo protegge il blocco [E] di tests/test_listener_una_volta.js, che apre
  // TUTTI i kind di ogni famiglia: senza quello, questa regola sarebbe un
  // commento verificato da nessuno.
  BI.fatto = BI.fatto || {};
  BI.unaVoltaSola = function (nome, fn) {
    if (BI.fatto[nome]) return false;
    BI.fatto[nome] = true;
    fn();
    return true;
  };

  BI.registraModulo = function (kind, apri) {
    if (!kind) throw new TypeError('BI.registraModulo vuole un kind');
    if (typeof apri !== 'function') {
      throw new TypeError('BI.registraModulo vuole una funzione per ' + kind);
    }
    if (BI.moduli[kind]) {
      throw new Error('BI.registraModulo: il modulo ' + kind + ' e\' gia\' registrato');
    }
    BI.moduli[kind] = apri;
    return apri;
  };
})(window.BI);
