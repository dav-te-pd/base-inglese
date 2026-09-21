# Decisioni — LO STATO

**Il primo file da aprire.** Dice **cosa è aperto adesso** e **in che ordine**,
e niente altro.

> ⚠️ **Il PERCHÉ di ogni scelta non è qui: è in
> [`decisioni-storico.md`](decisioni-storico.md)**, 4330 righe di ragionamento,
> triage e misure. Questo file si apre per sapere cosa fare; quello per sapere
> perché è così.
>
> **E si SVUOTA:** quando una riga viene eseguita va in
> [`correzioni.md`](correzioni.md) e sparisce da qui. *Un registro che solo
> cresce diventa un cimitero che nessuno rilegge; uno che si svuota mostra da
> solo cosa è rimasto indietro.*

**Due regole, e sono tutte:**

1. **Una riga per decisione: cosa, e QUANDO si esegue.** Il *quando* è una
   **condizione**, non una data — le date scadono da sole e mentono.
2. **Si scrive nel commit in cui la decisione viene presa**, come i test
   (regola 23) e le correzioni (regola 43).

---

# DOVE SIAMO — 2026-09-20

**Lo spacchettamento è FINITO.** `index.html` non ha più codice: 3561 righe, di
cui **2498 CSS**, 1022 markup, e **una riga di JavaScript** (`window.BI.boot()`).
L'app vive in 23 file sotto `app/`, e **nessuno di loro chiede più niente a
`index.html`**.

**La suite:** 69 file, 1534 asserzioni, verde in locale e in CI.

**L'obiettivo, in una riga:** *arrivare a un sistema online e sicuro, e poi
scrivere episodi.*

---

# COME SI PRENDE UN PASSO — «ANALISI A DUE, CODICE A UNO»

*Decisa il 2026-09-20, ed è la **regola 45** di `CLAUDE.md`: là la regola, qui i numeri che l'hanno scritta.*

**Due momenti, e il primo non costa niente.**

### ① L'ANALISI, SEMPRE, E SUI DUE PASSI SUCCESSIVI INSIEME

Prima di scrivere una riga si misura **cosa resta davvero** dei due passi in
cima alla lista. Costa dieci minuti, **zero suite e zero CI**, e non si salta.

⚠️ **Non è prudenza: è che il piano invecchia più in fretta di quanto sembri.**
Misurato il 2026-09-20, quattro righe guardate e quattro sbagliate:

| Passo | Diceva | Era |
|---|---|---|
| **1.4** | un passo da accorpare | **560 pezzi**, quattro volte la stima |
| **1.5** | «la regola 8 nomina un file solo» | già fatto; restavano **quattro percorsi falsi** che non erano nell'elenco |
| **1.6** | cinque voci da eseguire | **tre già eseguite** il 10 settembre, una era una nota, due rimandate dalla riga stessa |
| **1.7** | «Supabase in UN file invece che in **101 punti**» | **27 punti**, e metà già fatta dai passi 1.9 e 1.11 — *col nome che mandava a guardare proprio la metà fatta* |

### ② L'ACCORPAMENTO, E LA REGOLA È MISURATA, NON PRUDENTE

⚠️ **L'analisi NON riduce le suite: rende possibile la decisione di
accorpare, ed è l'accorpamento che le riduce.** La distinzione conta, perché
misurando si scopre che l'accorpamento fa risparmiare **solo in un caso**.

**Il conto del 2026-09-20: otto passi, DODICI suite.** Le quattro in più vengono
**tutte** da passi che toccano codice che gira — **nessuna** dall'accorpamento.
*I sei file rossi del giro 1.9+1.4 erano tutti di 1.9; 1.4 non ne ha prodotto
nemmeno uno.*

> **SI ACCORPA QUANDO AL MASSIMO UNO DEI DUE TOCCA CODICE CHE GIRA.**

| I due passi | Cosa si fa | Verificato su |
|---|---|---|
| documenti / commenti **+** documenti / commenti | **insieme**, una suite sola | 1.5 + 1.6 → 1 suite, verde al primo giro |
| codice **+** documenti | **insieme**; se va rosso, il rosso è del primo | 1.9 + 1.4 → 2 suite, e i rossi erano tutti di 1.9 |
| **codice + codice** | **MAI insieme** | 1.11a e 1.11b divisi apposta: 7 rossi al primo giro, 26 al secondo, **tutti attribuiti in un secondo** |

**L'ultima riga non è prudenza ed è la sola che vale la pena motivare:** due
passi di codice costeranno **due suite comunque** — lo dice il conto — quindi
accorpandoli si paga lo stesso prezzo **più** l'ambiguità di non sapere quale
dei due ha rotto cosa.

# LA STRADA, IN QUATTRO TAPPE

Lo spartiacque è **Supabase**, e il criterio per collocare un passo **non è
l'importanza: è cosa diventa più difficile se lo si fa dopo.**

## ① PRIMA DI SUPABASE — pulire e ordinare

*Tutto quello che rende il codice misurabile. Farlo dopo significherebbe
lavorare su una base che non si può misurare.*

| | Passo | Perché adesso |
|---|---|---|
| **1.3** | ~~le stringhe del markup~~ | ✅ **CHIUSO il 2026-09-21, in quattro pezzi.** **1.3a** — ricontate (95 occorrenze in `index.html`, 47 distinte, **non** le 101/48 del piano), **54 spostate**; il markup porta `data-testo` e `hydrateTesti` lo riempie appena i testi arrivano. **1.3b** — la mappa aspetta i suoi testi, con la sua schermata d'errore: dei dieci punti che la aprono, **nove** sono un «← Mappa» dentro un modulo e non pagano niente. **1.3c** — censimento su `app/*.js` guardando **dove la stringa arriva allo schermo**: 28 punti, **nove spostate**; `Pausa` stava in due posti e `Risposta corretta: ` in due file. **1.3d** — `moduleLabels`, **trenta testi**, esce da `app/config.js` e va nell'edizione. ⚠️ **Restano nel markup 41 occorrenze, nessuna per dimenticanza:** onboarding/home (devono funzionare quando niente funziona), Pannello Admin (strumento, non studente), sovrascritte a runtime (segnaposto). |
| **1.8** | **Le tabelle di personalizzazione prendono la forma nuova** | ✅ **1.8 A FATTO il 2026-09-20:** via le colonne `fr`/`es`/`de` (147 stringhe vuote, zero lettori), **traducibilità dichiarata per riga**, e il test rovesciato ⑤ nella forma che oggi è possibile (9 slot su 9). ⚠️ **RESTA 1.8-bis, E ASPETTA IL CONTENUTO:** ② città+paese sulla stessa riga · ③ età in lettere · ④ **la migrazione**, che le prime due rendono obbligatoria. *Senza ④, cambiando `marco` in `papa-marco` chi ha personalizzato si ritrova le scelte riportate alla prima opzione — in silenzio, senza errore e senza un rosso.* **Il markdown è stato allineato il 2026-09-21** (autorizzato in chat, regola 33): dice cosa è fatto e cosa no. |
| **1.10** | **Il giro dei buchi** | ⚠️ **Non è un riassunto: è una ricerca di cosa non è in nessuna lista.** Si fa quando la lista smette di cambiare, cioè alla fine di questa tappa |
| **1.12** | **La CATENA DI VALIDAZIONE delle edizioni — CINQUE, due episodi ciascuna** | ⚠️ **È il collaudo che dice se il modello delle edizioni regge**, e va fatto prima di Supabase. Si fa **una per volta, in quest'ordine**, e ognuna parte solo quando la precedente funziona: **① `francese/it`** mette alla prova il modello · **② `it/francese`** ⚠️ **è la sola che prova la SECONDA metà della coppia** — uno studente non italiano — e da sola vale più delle altre tre messe insieme · **③ `tedesco/it`** che la prima non fosse un caso · **④ `spagnolo/it`** che il costo scenda invece di restare uguale · **⑤ `it/spagnolo`** che anche il rovescio si ripeta. *Se la quarta costa quanto la prima, il modello non regge e si vede lì.* Il contenuto lo scrive chi guida il progetto, in `docs/{lingua}/{studente}/` (regole 26 e 33), corretto davvero — un contenuto finto non farebbe vedere gli errori. ⚠️ **IL COSTO DELLE DUE ROVESCIATE VA DETTO:** in `it/francese` le spiegazioni si scrivono **in francese**, non in italiano, ed è un lavoro di natura diversa dal tradurre un dialogo. *Se l'energia dovesse finire, la ② è quella da non saltare e la ④ quella da saltare.* |

### ⚠️ LA CODA CHE IL LAVORO HA FATTO EMERGERE — 2026-09-21

*Non erano nel piano. Sono usciti facendo i passi, e stanno qui perché una
cosa che non è in nessuna lista è una cosa che non si fa.*

| | Cosa | Condizione |
|---|---|---|
| **1.13** | **Le sequenze di EPISODI.** Stesso identico sistema dei moduli, un livello sopra: `episodeSequences` nel file di struttura, l'**edizione** dichiara quale usa, e il Pannello Admin le sceglie e le riordina con gli stessi due menu. ⚠️ **Lo studente non sceglie mai** — è chi guida il progetto che organizza. **Oggi l'ordine degli episodi non è un dato:** è l'ordine in cui sono scritte le chiavi dentro `episodes`, e nessuna riga di codice lo dichiara | **dopo la tappa ①**, e **prima di 1.12**: senza, il collaudo delle cinque edizioni prova metà cosa |
| **1.14** | **Creare e cancellare una sequenza dal Pannello Admin.** Oggi si riordina, si cambia grado, si accende e si spegne — il magazzino si riempie solo a mano nel file | quando le sequenze dovranno **memorizzarsi** senza aprire il file |
| **1.15** | **`resolveEpisodeOrder` ha il nome della cosa sbagliata**: dice «l'ordine degli episodi», restituisce l'ordine dei **moduli di un** episodio. 5 occorrenze | **rimandata di proposito** il 2026-09-20 da chi guida il progetto: *«non rinominiamo più, le rinomine le rivedremo più avanti»* |
| **1.16** | **`wipeEpisodeProgress` cancella tre chiavi per episodio su sette**, con l'elenco scritto a mano. Due delle quattro superstiti sono conti e non progresso; `storyCardsDeclarations` invece regge lo Sblocco Sequenziale, quindi dopo un wipe il modulo si ri-blocca in mappa **ma riapre le card già dichiarate** | quando si tocca Why We Say It o la schermata Personalizza |

⚠️ **UNA COSA CHE IL PASSO 1.11 HA APERTO, e va decisa prima di Supabase:
l'app non disegna NIENTE finché `struttura-corso.json` non arriva.** Oggi è
un file statico sulla stessa origine, quindi si parla di millisecondi e non
si vede. **Con i dati sul server no**: su una rete lenta resterebbe una
pagina vuota senza spiegazione, che è la forma del guasto muto. Serve una
schermata di attesa — non la si inventa adesso perché oggi non c'è niente da
attendere abbastanza a lungo da poterla provare.

### ⚠️ I CINQUE CHE RESTANO, MISURATI TUTTI — 2026-09-20

*Applicata la regola 45 a tutta la coda invece che alla coppia successiva.*

| | Tocca | Superficie misurata |
|---|---|---|
| **1.3** stringhe del markup | **CODICE** | 101 occorrenze in `index.html`, **48 distinte**; 64 occorrenze sono **15 stringhe ripetute** (`Spiegazione` ×19, `Help` ×9, `← Mappa` ×7). **Almeno 24 delle 48 NON si spostano**: 8 di onboarding/home (decisione presa — devono funzionare quando niente funziona), 8 del Pannello Admin (strumento, non studente), 8 nomi di moduli **sovrascritti a runtime** da `CONFIG.moduleLabels`, cioè segnaposto |
| ~~**1.4**~~ catalogo dei pezzi | **DOCUMENTI** | 548 scoperti su 562 — e cresce da sé quando nascono file. ⚠️ **NON È PIÙ UN PASSO dal 2026-09-20: è la regola 46 «CHI TOCCA, CATALOGA»** — la riga resta qui perché è la misura che ha scritto la regola |
| **1.8** tabelle di personalizzazione | **CODICE** | **27 punti in sei file**: `ui-condivisa.js` 10 · `personalizza.js` 7 · `apertura.js` 6 · `config.js` 2 · `catalogo.js` 1 · `mappa.js` 1. Più **sei file di test** che ci passano dentro |
| **1.10** giro dei buchi | documenti | **per definizione ULTIMO**: «si fa quando la lista smette di cambiare» |
| **1.12** edizioni | contenuto di chi guida il progetto | `docs/francese/` non esiste ancora |

**Cosa si può accorpare, secondo la regola 45:**

- **1.3 + 1.8 = codice + codice → MAI insieme.**
- **1.10 non si accorpa con niente**, e non per la sua natura: per la sua
  *condizione*. Accorparlo con un passo che cambia la lista lo farebbe girare
  su una lista che sta cambiando — cioè lo farebbe **girare a vuoto**.
- **1.12 dipende da chi scrive il contenuto**, non dall'ordine dei passi.

> **1.4 È L'UNICO ACCORPABILE, E LA MISURA DICE UNA COSA PIÙ UTILE:
> NON È UN PASSO, È UNA CODA.**
>
> ⚠️ **ESEGUITO IL 2026-09-20: è diventato la regola 46 «CHI TOCCA,
> CATALOGA», e la sua riga è uscita dalla tabella della tappa ①.** *Un passo
> che non finisce mai, messo in fila con quelli che finiscono, li blocca
> tutti.*

I suoi 548 pezzi stanno **dentro i file che gli altri passi toccano**. Tenerlo
come riga a sé significa, un giorno, rileggere ventiquattro file per
catalogarli; attaccarlo a ogni passo di codice significa catalogarli **quando
sono già stati letti riga per riga**, che è il solo momento in cui la colonna
«cosa dà per scontato» si scrive senza indovinare.

*Misura che lo dimostra: il passo 1.7 ha letto `progressi.js` (38 pezzi) e
`identita.js` (9) riga per riga — **quarantasette pezzi erano catalogabili quel
giorno a costo quasi zero**, e sono ancora scoperti.*

### ⚠️ LE QUATTRO DELLE SEQUENZE — una condizione sola

**Trovate il 2026-09-20 misurando il Pannello Admin** per rispondere a chi guida
il progetto. Nessuna è rotta **oggi**, e la ragione è una sola: *esiste una
sequenza sola.* Tutte e quattro diventano vere — e verificabili — nello stesso
momento.

| | Cosa |
|---|---|
| ~~①~~ | ✅ **CHIUSA il 2026-09-20.** L'override **si fonde** invece di sostituire: le chiavi del foglietto vincono una per una, quelle nuove del file restano. `persistConfigSection` continua a salvare l'oggetto intero, e adesso va bene così |
| ~~②~~ | ✅ **CHIUSA il 2026-09-20.** È un **menu** con i nomi che esistono, e **ricarica**. Un nome che non esiste resta nell'elenco dichiarandosi, invece di far cambiare la sequenza in silenzio al primo salvataggio |
| ③ | **Il Pannello Admin non sa creare né cancellare una sequenza.** Riordina, cambia grado, accende e spegne: il magazzino si riempie solo a mano nel file |
| ④ | **`resolveEpisodeOrder` ha il nome della cosa sbagliata**: dice «l'ordine degli episodi», restituisce l'ordine dei **moduli di un** episodio. 5 occorrenze. È la prova che l'ambiguità della parola «sequenza» non è solo nella chat |

⚠️ **DUE SU QUATTRO CHIUSE IL 2026-09-20**, col passo dei selettori — cioè
esattamente la condizione che era scritta qui. Le due che restano (③ e ④) non
hanno cambiato condizione: ③ è il «crea e cancella dal pannello», che serve
quando le sequenze dovranno memorizzarsi senza aprire il file; ④ è una
rinomina, **e chi guida il progetto l'ha rimandata di proposito il 2026-09-20**
— *«non rinominiamo più perché parliamo di cose differenti, le rinomine le
rivedremo più avanti»*.

**La condizione era: il passo che rende le sequenze davvero più d'una.** Prima di
allora nessun test potrebbe farle diventare rosse — e una correzione che nessun
caso può esercitare è una riga che nessuno sa se funziona.

### ⚠️ TROVATO CATALOGANDO — `wipeEpisodeProgress` conosce tre chiavi su sette

**Trovato il 2026-09-20** scrivendo le righe di `app/progressi.js` nel catalogo
dei pezzi — *cioè dalla terza colonna, «cosa dà per scontato», e non dalla
lettura del passo 1.7, che pure aveva letto lo stesso file riga per riga.*

`wipeEpisodeProgress` è la conseguenza del «sì» all'avviso di metà episodio:
azzera il progresso che dipende dalla personalizzazione che sta per cambiare.
**Cancella tre chiavi** — passi completati, esiti, mastery — e le nomina a
mano. Le chiavi per episodio sono **sette**: sopravvivono `audioSecondsSent`,
`nextLineSkips`, `storyCardsExplanationStats` e `storyCardsDeclarations`.

**Due delle quattro non sono un difetto, ed è la parte che serve sapere:**
`audioSecondsSent` e `nextLineSkips` sono **conti, non progresso** — quanto
audio è stato speso, quante volte si è saltata l'attesa — e azzerarli
perderebbe una misura per un motivo che non la riguarda.

**Le altre due sono una domanda vera:** `storyCardsDeclarations` regge lo
«Sblocco Sequenziale» di Why We Say It (regola 30), quindi dopo un `wipe` il
modulo si ri-blocca in mappa **ma riapre le card già dichiarate**.

**Non corretto in questo giro, e la condizione è questa:** si decide **quando
si tocca Why We Say It o la schermata Personalizza**, non prima — e chiunque
**aggiunga una chiave per episodio** deve passare di qui, perché l'elenco a
mano non lo dirà da solo.

**Fuori catena, da chiudere in questa tappa o dichiarare rimandati:**

- il **taglio per silenzio** del microfono (rivisto tre volte, mai corretto);
- i **17 finti sintetizzatori** senza `speaking` nei test;
- il **giro di design sulla mastery**, tre voci;
- le varianti di **`bootAsUser` / `mockInit`** nei test;
- **`episodeFinalOutcomeCase`** e **`buildTargetTokens`**: nel codice, **nessun
  chiamante**. Si decide quando nasce il Modulo Finale;
- ~~le quattro chiavi globali~~ — **deciso il 2026-09-20**, e sono **cinque**,
  non quattro: vedi i passi **1.11–1.14** qui sopra e il blocco qui sotto.

### ⚠️ LA STRUTTURA DEL CORSO È TUTTA PER EDIZIONE — deciso il 2026-09-20

**Una regola sola, nessuna eccezione: un'edizione è un abbinamento
`{lingua-che-si-impara}/{lingua-studente}`, e TUTTO ciò che riguarda la
struttura di quel corso vive nell'edizione.**

⚠️ **Questa decisione ne CORREGGE una scritta poche ore prima nello stesso
file**, e vale la pena dire perché, perché l'argomento scartato è ragionevole e
tornerà. Avevo proposto un taglio: fuori solo ciò che è *testo*, dentro ciò che
è *struttura* — con la misura che `gradeNames` per `francese/it` sarebbe
identico a quello di `inglese/it` («Parole, Espressioni, Frasi, Dialogo» sono
italiano, e valgono per il francese). **La misura era giusta e la conclusione
no.** I nomi dei gradi non sono una traduzione: sono una **decisione didattica
di quel corso**. Tenerli condivisi vuol dire che una scelta presa per l'inglese
governa il francese in silenzio — che è esattamente ciò che la regola 4 vieta
quando dice che una correzione fatta in `it/` **non deve** arrivare nelle altre
edizioni. *Ottimizzare «non duplicare quattro parole» costava la regola unica;
duplicare quattro parole non costa niente.*

**Il file: `data/{lingua}/{studente}/struttura-corso.json`**, uscita diretta e
1:1 di `docs/{lingua}/{studente}/struttura-corso.md` (regola 26) — che è già per
edizione. Oggi quel markdown per-edizione scarica il suo risultato in valori
globali: **era quello il disallineamento.**

| Va nell'edizione | Perché |
|---|---|
| `episodes` | quali episodi ha QUESTO corso, in che ordine, e quale sequenza usa ciascuno |
| `sequences` | quante ne vuole chi guida il progetto, con i nomi che vuole |
| `grades` | le lettere dei gradi di questo corso |
| `gradeNames` | i nomi che lo studente legge |
| `moduleTypes` (le `label`) | le categorie che lo studente legge |
| `speech.recognitionLang` / `synthesisLang` | ⚠️ **trovate misurando, non erano nell'elenco**: oggi valgono `en-US`, e un corso di francese vuole `fr-FR` |

| Resta in `APP_CONFIG` | Perché |
|---|---|
| soglie, tempi, suoni, limiti, temi, coda dei ripassi | sono le **manopole dell'app**, non del corso: non cambiano cambiando lingua |

**⚠️ E LA DIREZIONE È L'OPPOSTA DI COME SI RACCONTA FACILMENTE: non è la
sequenza che dichiara i suoi episodi.** È l'**episodio** che dichiara la sua
sequenza, per nome — `CONFIG.episodes.gate = { sequence: 'narrativo-standard' }`,
letto da `resolveEpisodeOrder` (`app/catalogo.js:269`). Una sequenza non sa
niente degli episodi che la usano, e due episodi possono chiedere la stessa.
**Nel file di edizione il posto che dice «quali episodi ci sono» esisterà
davvero** — ed è l'edizione, non la sequenza.

**⚠️ E DUE LUCCHETTI DIVERSI, CON NOMI CHE SI SOMIGLIANO:**

- i **lucchetti della mappa** — `moduleStatus` (`app/mappa.js:818`): un passo è
  `locked` finché tutti quelli prima non sono completati, con l'icona `lock`.
  **Questi vengono dalla sequenza**, e l'occhio del Pannello Admin li sposta
  spegnendo un passo (`off: true`);
- lo **«Sblocco Sequenziale»** (regola 30) — `dgApplySequenceLock` e
  `storyCardsRefreshExplanationStates`: sta **dentro** due moduli (le bolle di
  Ripeti a Tempo, le card di Why We Say It). Stessa idea, **niente a che vedere**
  con la sequenza dei moduli.

**Cosa resta aperto di questa decisione:** il passo 1.11 la esegue, e va
dichiarato prima di essere costruito (regola 31) — è un file di dati nuovo e un
cammino di caricamento nuovo, non uno spostamento.

## ② IL COLLAUDO — il passo 26

**Uno solo, e va fatto quando la tappa ① è chiusa, non prima.**

L'app dall'inizio alla fine, su profilo nuovo, su Pages. ⚠️ **Gli otto punti di
`docs/collaudo-sei-moduli.md` ne sono una METÀ:** coprono i sei moduli, non gli
strati — e gli strati sono quello che si è mosso.

*Perché qui e non prima: in due giorni l'app ha cambiato forma tre volte e ha
avuto **cinque guasti muti** — quattro trovati guidandola, uno per caso. Un
collaudo fatto a metà pulizia si rifà.*

## ③ LA MESSA IN SICUREZZA — Supabase, repo privato, Cloudflare

⚠️ **Oggi il repository è PUBBLICO e il sito è servito in chiaro: chiunque
scarica tutto** — codice, episodi, traduzioni, risposte dei quiz. Non è una
falla da trovare, è lo stato dichiarato.

| | Passo | Nota |
|---|---|---|
| **3.1** | **La prova della CI a 4 CPU** | Se il runner ne ha quattro, la suite costa la metà. È una misura, non una speranza |
| **3.2** | **Supabase + repository privato, INSIEME** | ⚠️ **Sono due minacce diverse e il repo privato NON tocca la seconda:** il sito resta pubblico e i suoi file si scaricano lo stesso |
| **3.3** | **I progressi vanno sul server** | Oggi vivono **solo** nel `localStorage`: cambiare telefono li cancella. Nessun attacco serve |
| **3.4** | **La correzione delle risposte** | Oggi il browser riceve domanda e risposta giusta insieme. Tre strade nello storico; la riga *«le regole stanno sul server»* esclude quella «tutto nel browser» |
| **3.5** | **Il pannello Admin dietro login, e `config` che sparisce** | Finché il pannello è locale non è un buco; quando scriverà sul server lo diventa |
| **3.6** | **Le due analisi + i loro test** | Penetrazione e scaricamento abusivo: stanno in [`cyber-security.md`](cyber-security.md), con la cadenza da decidere quando i test esistono |
| **3.7** | **I backup** | Contro un furto **e** contro un guasto, e il secondo è più probabile |
| **3.8** | **Cloudflare** | L'uscita online |
| **3.9** | **Il passo di pubblicazione che toglie i commenti** | Minificazione. ⚠️ **Il prezzo va detto: il file servito non è più quello in git** |
| **3.10** | **Il caso di studio `guida.omney.io`** | Lì scaricare i dati è risultato quasi impossibile: va capito come |

### ⚠️ IL PANNELLO ADMIN — l'elenco di cosa dovrà avere

**Questo posto non esisteva e nasce il 2026-09-20**, perché le cose del
pannello stavano già in due punti diversi e sarebbero diventate tre. Si
chiudono tutte al passo **3.5**, quando il pannello viene rifatto dietro il
login: prima di allora è un embrione locale, e metterci dentro un lavoro
serio significherebbe farlo due volte.

| | Cosa | Perché |
|---|---|---|
| **A** | **I due campi dell'edizione bloccati** | `edizione.lingua` e `edizione.studente` oggi si modificano come qualunque altro campo, e toccarli per sbaglio punta l'app a una cartella che non esiste: schermata d'errore finché non si riapre il pannello e si ripristina. Non modificabili con un click solo |
| **B** | **La vista di TUTTE le sequenze in un posto solo** | ⚠️ **Oggi non esiste, ed è una mancanza vera:** il pannello mostra **una** sequenza — quella dell'episodio che si sta guardando (`sequenzaInModifica`) — quindi per sapere quale episodio usa quale bisogna cambiare episodio e riaprire il pannello, uno per uno. Serve l'elenco delle sequenze con, accanto a ognuna, **gli episodi che la chiedono**, e la possibilità di modificarle da lì. *Diventa più utile, non meno, quando le sequenze saranno per edizione (passo 1.11): l'elenco è per edizione, e la domanda «questo episodio segue la sequenza standard o una sua?» si risponde con un'occhiata invece che con cinque click* |


## ④ DOPO — costruire, non più riordinare

| | |
|---|---|
| **4.1** | **I moduli nuovi**: Scrittura e il Test di verifica finale (previsti, mai costruiti) |
| **4.2** | **Il Modulo Finale**, che usa `episodeFinalOutcomeCase` |
| **4.3** | **I report** e le tabelle di interscambio fra episodi (la regola 40/30/20/10) |
| **4.4** | **Il contratto del modulo** — deciso: *«lo metterei quando è tutto fatto»* |
| **4.5** | **ElevenLabs**: si registra una volta, si paga una volta, l'app pesca. ⚠️ **Non aspetta Supabase** — la chiave sta fuori dall'app, in `tools/` |
| **4.6** | **La modalità offline**, dopo l'analisi di Babbel e Duolingo |
| **4.7** | **Il modello delle edizioni** e la lingua di sistema nelle prime schermate |
| **4.8** | **Le app per gli store** |
| **4.9** | **LLMOps** |

---

# LE COSE PICCOLE, REGISTRATE E APERTE

**Non stanno nelle quattro tappe perché non decidono un ordine: si chiudono
quando si passa di lì.** ⚠️ **Ma sono APERTE, e `correzioni.md` ci punta**:
dozzine di righe dicono *«registrato in `decisioni-stato.md` con la sua
condizione»*, e quelle condizioni sono queste. Il dettaglio di ognuna è nello
storico, nelle quattro sezioni che portano lo stesso nome.

| Famiglia | Dove sta il dettaglio | Cosa contiene |
|---|---|---|
| **Deroghe dichiarate senza niente che le faccia scadere** | storico, sezione omonima | Otto limiti di test dichiarati e mai riesaminati: nomi generici in `APP_CONFIG`, il testo dell'episodio 2 non confrontato con la sua fonte, i valori di default delle due soglie, il passo corrente di Sblocco Sequenziale, ecc. |
| **Pulizie rimandate di proposito** | storico, sezione omonima | ⚠️ Fra queste **una SECONDA implementazione del riconoscimento vocale**, indipendente da quella viva; i testi dell'avviso microfono scritti nel codice; `actions/checkout@v4` e `setup-node@v4` da alzare a `@v5`; la divergenza off/seen in `tests/module-order.js` |
| **Dati che l'app produce e nessuno può leggere** | storico, sezione omonima | Le risposte di Why We Say It si salvano per singola skill e nessuna schermata le mostra; i tre Dialogue non registrano niente per battuta |
| **CI rosse che non dicono cosa fare** | storico, sezione omonima | Valori ricopiati invece che letti dalla fonte |
| **Il volume di default di `sfxPlayTone`** | storico, `## DA FARE` | Deve uscire dal codice ed entrare in `APP_CONFIG` (regola 3) |
| **`test_batch19.js`** | storico, `## ⚠️ APERTO` | La causa si stava stringendo l'11→15 settembre e non è stata chiusa |
| **Le due voci del passo 13 che restano** | storico, «Le cinque voci della 2-bis» | ⑤ **il report per grado** — *«è prodotto, non strumento»*, quindi va con i prodotti della tappa ④, non qui. **D3** — sospesa, torna **quando esisterà un colore sopra i compartimenti**. *Le altre tre voci sono chiuse: ① e ② e ③ eseguite il 2026-09-10, ④ chiusa il 2026-09-20 scrivendo la nota accanto a `recordPendingMastery`.* |
| **Le cose del Pannello Admin** | tappa ③, sotto la tabella | I due campi dell'edizione da bloccare e la vista di tutte le sequenze. **Stanno lì e non qui** perché si chiudono tutte insieme al passo 3.5, quando il pannello viene rifatto |

⚠️ **E una cosa che NON è piccola e sta qui solo perché è già registrata:
`srPulizia` ha mostrato che il magazzino di `stopAllModuleActivity` non ha più
un contenuto fisso — ha quello dei file caricati.** Oggi non cambia niente
perché i 23 tag si caricano tutti al boot. **Dal giorno in cui un modulo si
caricherà su richiesta, una pulizia non registrata è una pulizia che non gira.**
Condizione: quando nasce il caricamento a richiesta.

---

# ⚠️ I SEI FILE DI CONTENUTO: COSA E' FALSO OGGI — misurato il 2026-09-20

**Misurato su richiesta, e NON corretto di proposito** (regola 33: quei file
sono di chi guida il progetto). Sta qui perche' altrimenti vive solo in chat, e
la chat non sopravvive al container.

⚠️ **Il grosso viene TUTTO dalla stessa data: i cinque file non toccati dopo il
2026-09-09.** Non sono sviste sparse — sono **una fotografia del repository di
quel giorno**, scattata prima dei passi 6 (le cartelle e i nomi), 19 (le tabelle
in un file) e 1.11 (la struttura per edizione).

| File | Ultimo commit | Cosa dice di falso |
|---|---|---|
| `struttura-corso.md` | 2026-09-20 | `docs/it/` in due punti; «il contenuto di un episodio sta in `docs/episodio-N.md`» |
| `sequenza-episodi.md` | 2026-09-09 | numera `gate`=3 e `aircraft-door`=4, l'app li mostra come «Episodio 1» e «Episodio 2» |
| `obiettivi-a1.md` | 2026-09-09 | `docs/it/`; dice `aircraft-door` «deciso non scritto» — e' scritto, trascritto e vivo |
| `inventario-grammaticale.md` | 2026-09-09 | `docs/it/` in quattro punti |
| `tabelle-personalizzazione.md` | 2026-09-15 | si dichiara «non ancora trascrivibile», ed e' trascritto dal 15 (col contenuto vecchio, come deciso) |
| `inglese-it-gate.md` | 2026-09-09 | «id oggi `episode1`», «diventera' `gate`», il percorso e il nome del JSON, «le tabelle non esistono ancora» (due volte) |
| `inglese-it-aircraft-door.md` | 2026-09-09 | «id non ancora assegnato», «`episodeId: "episode2"`» |

**Cosa e' vero oggi, in una riga:** gli id sono `gate` e `aircraft-door` (nel
codice **e** dentro i JSON), i file dati stanno in
`data/inglese/it/inglese-it-{id}.json`, le tabelle esistono in
`data/inglese/it/tabelle-personalizzazione.json`, la sola sequenza e'
`narrativo-standard` con 22 passi, e i numeri attesi dei due episodi **tornano
tutti**.

### Le tre cose trovate che non erano state chieste

- ⚠️ **`level: "A1"` e `episodeTitle` nei due JSON non li legge NESSUNO**
  (misurato: zero lettori in `app/`). E `level` contraddice la regola 4 —
  *«il livello non e' una proprieta' dell'episodio»*. Condizione: si decide col
  passo che tocca i file episodio.
- ⚠️ **Il JSON delle tabelle porta colonne `fr`, `es`, `de` VUOTE**, cioe' la
  forma «una riga, cinque lingue». Contraddice la decisione del 2026-09-20 —
  un'edizione non e' una traduzione — e va sciolta **prima** che nasca
  `francese/it`, altrimenti i nomi francesi finiscono in due posti.
- **I due JSON episodio non hanno le stesse chiavi:** `gate` porta
  `generalRule` e `ageOptions`, `aircraft-door` no. Puo' essere giusto (uno ha
  le eta', l'altro no), ma nessuno l'ha dichiarato.

# ⚠️ I DIVIETI — si leggono PRIMA di prendere un passo

Non si deducono guardando il codice.

1. **Mentre la suite gira, l'albero di lavoro non si tocca** (regola 36). Una
   suite contaminata a metà non è un verde parziale: è un risultato nullo.
2. **Un passo non si dichiara fatto senza la suite completa E la CI**, lette
   entrambe (regola 38).
3. **Un'asserzione che diventa rossa per una DECISIONE si SEGUE, non si toglie.**
   È successo **dodici volte in tre giorni**, e ogni volta l'invariante era
   ancora vero: era cambiato dove viveva.
4. **Un test nuovo nasce nello stesso commit del codice che verifica**
   (regola 23), e si vede **fallire apposta** prima di fidarsene (regola 32).
5. **Ogni commit scrive la propria riga** in `correzioni.md` o qui (regola 43).
6. **Un file sotto `docs/{lingua}/` non si tocca di iniziativa** (regola 33).
7. ⚠️ **I NOMI FRANCESI NON VANNO NELLE COLONNE `fr` DI
   `data/inglese/it/tabelle-personalizzazione.json`.** Quel file porta `fr`,
   `es`, `de` vuote — la forma «una riga, cinque lingue» — e finche' il passo
   1.8 non le toglie, **sono li' e sembrano il posto giusto**. Non lo sono: i
   nomi francesi vanno in `data/francese/it/tabelle-personalizzazione.json`,
   il file di quell'edizione. *Il rischio non e' che quelle colonne restino:
   e' che qualcuno ci scriva dentro prima che il passo arrivi, e allora
   toglierle diventa una migrazione invece di una cancellazione.*
8. ⚠️ **In un file di contenuto si cercano prima le ISTRUZIONI false, poi i
   fatti falsi.** Un fatto sbagliato confonde chi legge; **un'istruzione
   sbagliata viene ESEGUITA.** Il caso: `inglese-it-gate.md` dice *«finche' non
   e' fatta, l'id e' `episode1` e va usato quello»* — una sessione che lo legge
   fa quello che dice. Le altre righe false dello stesso file dicono soltanto
   cose non piu' vere. **Vale per tutti e sei i file**, e decide l'ordine in cui
   si riscrivono.

---

# ⚠️ CINQUE GUASTI MUTI IN TRE GIORNI — e nessuno alzava un errore

Si scrive qui, non nello storico, perché **decide come si lavora adesso**: la
suite non li ha visti, li ha visti **guidare l'app**.

| Cosa | Come si è visto |
|---|---|
| `activeHelpModule is not defined` — il pannello Help moriva al primo pulsante | guidandolo |
| `STORY_CARDS_ANSWER_LABEL` — il Pannello Admin non si apriva più, ma **solo per chi aveva già risposto** a un'autovalutazione | guidandolo con quel profilo |
| **Cinque listener della mappa spariti** — «Vai all'episodio» non faceva niente | guidandola |
| `sfxPlayExitSound` — **tutte e quattordici** le Schermate Finali morivano al parsing | guidandola |
| Il pannello Help **vuoto** nella finestra in cui i suoi testi arrivano | segnalato con uno screenshot |

> **Quello che non alza un errore non lo trova una suite verde. Lo trova chi apre
> l'app.** È la ragione per cui la tappa ② esiste, e per cui ogni passo di
> queste liste finisce con «apri l'app e guarda».
