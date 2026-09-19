# Collaudo dopo l'uscita dei sei moduli

**2026-09-19.** In una giornata i sei moduli sono usciti da `index.html` in sei
file sotto `app/`. Ogni giro è stato verificato con «il modulo si apre e
risponde». **Nessuno ha guardato l'app intera**, ed è quello che fa questo
collaudo — prima della valutazione del catalogo, non durante.

## Perché un episodio intero e non una lista di gesti

**I sei moduli non si chiamano fra loro.** Si parlano attraverso tre cose sole:

| Cosa | Dove vive |
|---|---|
| la **mappa** — progressi, esiti, sblocchi | `app/mappa.js` + `localStorage` |
| il **magazzino della mastery** — i colori | `localStorage`, scritto da cinque moduli |
| lo **stato di sessione** — episodio e nomi scelti | ancora in `index.html`, letto dagli accessori |

**Nessuna delle tre esiste dentro un modulo solo: si ACCUMULANO.** Una lista di
gesti le tocca una volta per uno; un episodio in ordine le impila, ed è l'unico
modo di vedere se qualcosa si è mosso in sei giri.

I gesti «sbagliati» che servono davvero — uscire a metà, riaprire, toccare a
vuoto — **stanno dentro il percorso**, ai punti ⓷ ⓺ ⓻, invece che in un elenco
a parte.

## Come si fa

1. **`Ctrl+Shift+R`** prima di cominciare (versione attesa: `?v=20260919j`).
2. **Un profilo NUOVO**, un nome mai usato — i progressi vecchi nasconderebbero
   proprio quello che si vuole vedere.
3. **Dal passo 1 al 22, senza saltare.**

**Se qualcosa non torna, basta il NUMERO del punto.** Non serve altro.

---

## Gli otto punti

### ① Passo 1 · Personalizza → passo 2 · Meet the Story

**Fai:** scegli nomi **diversi dai predefiniti** (non Marco, non Chiara).

**Deve succedere:** al passo 2 le battute portano i nomi che hai scelto, e
**sopra le bolle c'è «Papà», non il nome**.

*Perché qui:* i nomi scelti stanno nello stato di sessione, che è rimasto in
`index.html` mentre i moduli sono usciti. Da oggi Voice e Dialogo lo leggono
con `BI.episodioCorrente()` e `BI.valoriCorrenti()` invece che direttamente.
**Se quegli accessori tornassero un valore vecchio, si vedrebbe esattamente
qui.**

### ② Passo 2 → mappa

**Fai:** «Ho finito, torna alla mappa».

**Deve succedere:** il passo 2 ha il suo esito, il 3 è sbloccato, i successivi
no.

*Perché qui:* è il primo giro completo mappa → modulo → mappa dopo che tutti e
sei sono usciti.

### ③ Passo 3 · Repeat Aloud

**Fai:** tocca 🔊, e **mentre parla tocca lo sfondo della pagina**.

**Deve succedere:** l'audio si ferma subito.

*Perché qui:* è la Regola Azione Critica. Il listener che spegne la voce vive
in `index.html`; il modulo che lo fa scattare adesso è in un altro file.

### ④ Passi 4–7 · Match ×2, Flash Card ×2

**Fai:** almeno **una risposta sbagliata di proposito** in Match, e in Flash
Card **salta una carta senza girarla**. Poi, **riapri un modulo già finito** e
rispondi una volta.

**Deve succedere:** riaprendo, il pulsante fa partire l'azione **una volta
sola** — non due.

*Perché qui:* i listener si agganciano alla prima apertura dietro una guardia.
Quattro dei sei moduli coinvolti sono file nuovi.

### ⑤ Dopo il passo 7 · il pannello

**Fai:** digita **`config`** fuori da un campo di testo, e guarda la lista della
mastery. Poi chiudi.

**Deve succedere:** ci sono righe di **più moduli insieme** — chiavi che
cominciano con `match:` e con `flashcard-A:`.

*Perché qui, ed è il punto che nessuno dei sei giri ha guardato:* cinque moduli
in cinque file diversi scrivono nello **stesso** magazzino. Finché li si prova
uno per uno non si vede mai se ci finiscono davvero tutti.

### ⑥ Passo 12 · Voice Practice

**Fai:** avvia una registrazione e **esci a metà** con «← Mappa». Poi rientra.

**Deve succedere:** nessun errore, la mappa è normale, e rientrando il
microfono riparte.

*Perché qui:* uscire da un modulo fa girare le pulizie, e **due delle cinque
sono uscite oggi insieme ai loro moduli** — Voice e Dialogo. Se una non si
registrasse più, un microfono resterebbe acceso senza dirlo.

### ⑦ Passi 17–19 · i tre Dialogo — **il confronto, non il singolo**

**Fai, ed è l'unico punto dove serve confrontare due schermate:**

| Dove | Gesto | Deve succedere |
|---|---|---|
| **Ascolta e Ripeti** (17) | tocca lo **sfondo** mentre parla | l'audio **si ferma** |
| **Ripeti a Tempo** (18) | tocca lo **sfondo** mentre parla | l'audio **NON si ferma** |
| **Ripeti a Tempo** (18) | tocca la **bolla** mentre parla | salta l'audio e parte il countdown |

*Perché qui:* è l'eccezione alla regola 16, e da oggi **attraversa due file** —
la funzione che dice «questo audio è protetto» sta in `app/dialogo.js`, il
listener che la interroga in `index.html`. **Una delle due righe da sola non
misura niente: se la funzione rispondesse sempre «sì», il 17 smetterebbe di
fermarsi; se rispondesse sempre «no», il 18 comincerebbe a fermarsi.** È il
confronto che distingue.

### ⑧ Passo 22 · Voice Check, poi la mappa

**Fai:** finisci, torna in mappa e scorrila tutta.

**Deve succedere:** tutti e 22 i passi hanno un esito, nessuno è rimasto
indietro, e la mappa non mostra errori.

---

## Cosa NON serve guardare

**Niente di tutto questo è comportamento nuovo.** I sei giri sono stati
spostamenti: se l'app fa oggi quello che faceva ieri, il passo 22 è andato
bene. **Questo collaudo non distingue una versione dall'altra** — distingue
«qualcosa si è mosso» da «niente si è mosso», che è la domanda di adesso.
