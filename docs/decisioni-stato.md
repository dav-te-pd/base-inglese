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
| ~~**1.14**~~ | ~~Creare e cancellare una sequenza dal Pannello Admin~~ | ❌ **NON SI FARÀ — deciso il 2026-09-21 da chi guida il progetto**, e la ragione è sua: *«queste cose si modificano talmente tante volte che è uno spreco di risorse creare la possibilità di modifica dal pannello admin; è molto più facile passare dal file»*. ⚠️ **Il pannello resta quello che è: un posto dove PROVARE una sequenza prima di deciderla**, con le modifiche che vivono in `localStorage` e spariscono. La decisione è scritta anche in `inglese-it-struttura-corso.md` (_017-bis), perché è lì che qualcuno andrà a cercarla |
| ~~**1.15**~~ | ~~`resolveEpisodeOrder` ha il nome della cosa sbagliata~~ | ✅ **FATTA il 2026-09-21: `resolveEpisodeOrder` → `resolveModuleOrder`.** Diceva «l'ordine degli episodi» e restituiva l'ordine dei **moduli di un** episodio. ⚠️ **Rimandata il 2026-09-20 e ripresa oggi per una ragione precisa, non per cambio di idea:** il passo 1.13 sta per far nascere l'ordine VERO degli episodi. *Finché quella cosa non esisteva, il nome era solo brutto; dal giorno in cui esiste, punta a quella sbagliata.* Sei forme cercate, **zero occorrenze nel codice** — le tre rimaste sono nei registri storici, dove il nome vecchio è ancora il fatto vero |
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
| ④ | ~~**`resolveEpisodeOrder` ha il nome della cosa sbagliata**~~ — ✅ **rinominata in `resolveModuleOrder` il 2026-09-21** (riga 1.15). *Resta qui perché era la prova che l'ambiguità della parola «sequenza» non stava solo nella chat: stava in un nome del codice* |

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

### ⚠️ I FUORI CATENA — mai chiusi, adesso numerati — 2026-09-21

*Erano un elenco puntato in fondo a una sezione, cioè un posto dove una cosa
non viene presa. **Un elenco senza numeri non si prende**: si legge e si
rimanda.* Da oggi hanno un numero e una condizione, come tutto il resto.

| | Cosa | Condizione |
|---|---|---|
| ~~**F.1**~~ | ✅ **CHIUSA TUTTA il 2026-09-21.** ① `speechstart` collegato: il taglio per silenzio non prende più chi sta parlando. ② nasce il **terzo timer** (`speechend` → 1200 ms, in `config`), con il riarmo che impedisce il taglio a metà frase. **La tabella completa dei cinque che possono fermare una registrazione, con l'evento che fa partire ognuno, sta in `decisioni-storico.md`** | — |
| **F.2** | **I 17 finti sintetizzatori senza `speaking`** nei test. Un mock che finisce all'istante nasconde proprio i difetti che dipendono da un ordine di eventi asincrono (regola 19) | quando si tocca una famiglia di test che li usa |
| **F.3** | **Il giro di design sulla mastery**, tre voci: ① i **due colori** che si chiamano tutti e due «colore», e niente nell'interfaccia dice quale si sta guardando · ② la **media di Voice Practice** che nessuno mostra · ③ **report VERDE e mappa ROSSA**, tutti e due corretti, e allo studente sembrano contraddirsi | ⚠️ **LA CONDIZIONE C'ERA, ED È STATA PERSA NEL TRAVASO DEL 2026-09-21.** Sta in `decisioni-storico.md`, scritta il 2026-09-19: *«quando il report sarà visibile allo studente, e non prima»*. Qui era diventata un trattino — e un trattino si legge come «nessuna condizione», cioè l'opposto |
| **F.4** | Le varianti di **`bootAsUser` / `mockInit`** nei test: la stessa finzione scritta in più modi | ⚠️ **sarebbe un `map-driver` per il boot** — stessa forma della deduplicazione già fatta per l'apertura dei moduli |
| **F.5** | **`episodeFinalOutcomeCase`** e **`buildTargetTokens`**: nel codice, **nessun chiamante** | ✅ **DECISO il 2026-09-21: si cancellano.** Il disegno resta in `decisioni-storico.md` e si riscrive quando nascerà il Modulo Finale. *Codice che nessuno chiama è una bugia su cosa fa l'app* |
| ~~**F.6**~~ | ✅ **CHIUSA il 2026-09-21**, autorizzata: i dieci percorsi scaduti nei cinque file di contenuto, più le due frasi false in sostanza (`a1-episodio1-inglese.json`, cioè la nomenclatura che la regola 4 vieta; e *«aggiorna `APP_CONFIG` leggendo…»*, quando dal 2026-09-20 la fonte è `struttura-corso.json`) | — |
| **F.7** | **I DUE EPISODI SONO PROTETTI IN MODO DIVERSO, E NESSUNO L'AVEVA DECISO.** ⚠️ **Misurato il 2026-09-21, ed e' piu' grosso della duplicazione da cui era partito:** non sono solo due lettori uguali (`numeriAttesiDallaFonte` e `numeriAttesi`, rotti insieme lo stesso giorno) — **sei controlli su dodici mancano a un episodio o all'altro.** Solo `gate`: il confronto md↔json carattere per carattere, i segnaposto, i ruoli di chi parla, `whatYouLearn` e' una lista, i nomi dei gradi. Solo `aircraft-door`: nessun id ripetuto, ogni frase di C viene da una battuta esistente. **Il tabellone e la regola delle due famiglie sono in `tests/README.md`** — file trasversale a ogni episodio, browser su UNO solo. *Il motivo scritto per cui non erano uniformi era SCADUTO: `test_episodio2.js` dichiarava «i due markdown hanno una forma diversa», e `REGISTRO-EPISODI_004` li ha resi uguali.* | ⚠️ **NON e' la condizione di prima.** Le sei caselle scoperte sono aperte **adesso**: si chiudono col test trasversale `test_fonte_episodi.js`. ⚠️ **Il caso piu' diverso NON ESISTE ANCORA** (regola 42): i due episodi sono tutti e due `storia` e tutti e due `narrativo-standard` — un episodio `grammatica` senza grado D non c'e'. *Quindi il test va scritto in modo che, incontrando un episodio senza grado D, DICA di aver saltato quel controllo invece di tacere* |

*Perché F.6 pesa più di un refuso: quei file sono la **fonte** da cui si scrive
il contenuto, e un percorso sbagliato dentro una fonte manda chi la usa a
cercare un file che non c'è — o, peggio, a crearne uno nel posto sbagliato.*

### ⚠️ F.1 — IL CONTROLLO A CODICE FERMO, 2026-09-21

*Chiesto da chi guida il progetto — «**prima di fare modifiche propongo un bel
controllo**» — e fatto **senza toccare una riga** di `app/voice.js` (regola 34).*

⚠️ **PRIMA DI TUTTO: LA MIA PROPOSTA DEL GIORNO PRIMA ERA SBAGLIATA, E VA
SCRITTO.** Avevo proposto di **riarmare il timer a ogni risultato**, cioè di
trasformare la regola da «N secondi dal click» a «N secondi di silenzio».
**È esattamente il contrario di quello che serve**, e chi guida il progetto
l'ha fermata prima che diventasse codice:

> *«la regola dovrebbe essere "3 secondi dal click se non sento nulla" … se lo
> studente non dice nulla ma non clicca, non deve partire il conteggio.»*

**E aveva ragione su tutti e due i punti. Misurato:**

| Quello che si temeva | Misura | Esito |
|---|---|---|
| «forse il conteggio parte prima del click» | `vcSilenceTimeoutId = setTimeout(…)` sta **dentro** il gestore del click di `vc-record-btn` (riga 614) | ✅ **parte al click, mai prima** |
| «forse la regola è scritta male» | alla scadenza taglia **solo** `if (vcListening && !vcHeardAnySpeech)` | ✅ **la regola è giusta**: se hai parlato, non taglia |

**QUINDI IL DIFETTO NON È NÉ LA REGOLA NÉ IL MOMENTO IN CUI PARTE. È *DOVE SI
DECIDE DI AVER SENTITO*.**

`vcHeardAnySpeech` diventa vero in **un punto solo**: dentro `onresult`
(riga 212), cioè **quando il riconoscitore ha già prodotto del testo** — anche
provvisorio. Ma fra «la persona ha cominciato a parlare» e «Chrome consegna il
primo pezzo di trascrizione» passa un tempo **suo**, non nostro.

⚠️ **E LA WEB SPEECH API HA TRE EVENTI MOLTO PIÙ PRECOCI CHE IL CODICE NON USA.**
Cercati in `app/voice.js`: `onaudiostart`, `onsoundstart`, `onspeechstart` —
**zero occorrenze, nessuno dei tre è collegato**. `speechstart` è l'evento che
dice *«sto sentendo una voce»*, e arriva **prima** del primo `onresult`.

**Il sintomo si spiega tutto da qui, senza bisogno di un secondo numero:**

| tempo | cosa succede | `vcHeardAnySpeech` |
|---|---|---|
| 0,0 s | click su Registra, il timer parte | `false` |
| 2,5 s | **cominci a parlare** | `false` — *nessuno lo sa ancora* |
| ~2,6 s | il riconoscitore rileva voce (`speechstart`) | `false` — **l'evento non è collegato** |
| **3,0 s** | **il timeout scatta, e taglia** | `false` |
| ~3,2 s | sarebbe arrivato il primo `onresult` | — *troppo tardi* |

**La correzione che ne discende è piccola e NON tocca la regola:** far diventare
vero `vcHeardAnySpeech` anche su `speechstart`. La regola resta *«3 secondi dal
click se non sento nulla»* — cambia solo che **«sento nulla» viene misurato
quando il microfono sente**, invece che quando il riconoscitore finisce di
trascrivere.

⚠️ **IL PREZZO VA DICHIARATO PRIMA, NON DOPO: un colpo di tosse, una porta che
sbatte, la TV nell'altra stanza — per `speechstart` sono voce.** Quindi il
taglio non scatterebbe più in una stanza rumorosa, e la registrazione
andrebbe fino al tetto massimo. *La difesa contro il microfono rotto (la
striscia `vcEmptyRecognitionStreak`) non cade — quella conta le
registrazioni senza parole, e una stanza rumorosa ne produce lo stesso — ma
il taglio corto sì.* **È la scelta vera di questo passo, e non la prendo da
solo.**

### ⚠️ IL CENSIMENTO DI CHI PUÒ FERMARE UNA REGISTRAZIONE — 2026-09-21

*Chiesto da chi guida il progetto: «**bisogna trovare anche le righe di codice
per le regole, così siamo sicuri che modifichiamo dopo che abbiamo capito**».
Fatto cercando, non ricordando: ogni `setTimeout`, ogni `.stop()`, ogni
`.abort()` di `app/voice.js`, e `speechend`/`soundend`/`audioend` in tutto il
repository.*

| | Chi ferma | Riga | Quando | In `config`? |
|---|---|---|---|---|
| ① | **il dito dello studente** | 584 | click sul pulsante mentre registra | — |
| ② | **il taglio per silenzio** | 614–619 | `silenceTimeoutSeconds` dal **click**, e **solo se non ha sentito niente** | ✅ `silenceTimeoutSeconds` |
| ③ | **il tetto massimo** | 608–610 | `parole × maxRecordingMsPerWord + maxRecordingMarginMs` dal **click** | ✅ due chiavi |
| ④ | **l'abort** quando si lascia il modulo | 330 | `stopAllModuleActivity` | — |
| ⑤ | **❌ NIENTE che conti «N secondi dopo che smetti di parlare»** | — | — | — |

**I comandi, con quello che hanno trovato — zero compreso (regola 41):**

| Cercato | Dove | Trovato |
|---|---|---|
| `setTimeout\|setInterval` | `app/voice.js` | **2 timer** (② e ③) + 1 `setInterval` che aggiorna solo la scritta «0s, 1s, 2s» |
| `speechend\|soundend\|audioend` | **tutto il repository** | **0** |
| `.stop()\|.abort()` | `app/voice.js` | **4**, tutti nella tabella qui sopra |

⚠️ **E LE DUE OSSERVAZIONI DI CHI GUIDA IL PROGETTO SONO ENTRAMBE VERE. UNA
CONFERMA IL CODICE, L'ALTRA DICE CHE IL CODICE NON C'ENTRA.**

> *«se parlo senza fermarmi si ferma ad esempio a 15 sec, mentre se parlo e poi
> mi fermo dopo circa 3 sec si ferma»*

- **I 15 secondi sono ③, e il conto torna esatto:** una frase di **dodici**
  parole dà `12 × 1000 + 3000 = 15000 ms`. *È la formula, misurata dal di
  fuori senza conoscerla.*
- **I «circa 3 secondi dopo che smetti» NON SONO NOSTRI.** Nel nostro codice non
  esiste niente che li produca — la riga ⑤ è vuota, e non per una ricerca
  saltata: i tre comandi qui sopra sono stati eseguiti e hanno dato 2, 0 e 4.
  **È il riconoscitore del browser che chiude la sessione da solo** quando
  sente una pausa prolungata, e `onend` arriva **senza che nessuno abbia
  chiamato `stop()`**.

**Perché `continuous = true` (riga 191) non lo impedisce:** quel flag tiene
aperta la sessione **attraverso più risultati**, non attraverso il silenzio. La
chiusura per pausa è dentro il motore di Chrome, **non è esposta da nessuna API
del web e quindi non è configurabile.**

⚠️ **E QUESTO CAMBIA IL DISEGNO DEI «TRE TIMER», quindi va deciso prima di
scrivere:** il terzo timer chiesto — *«quello dopo che ho finito di parlare»* —
**non nasce in un posto vuoto: nasce accanto a uno che c'è già e non si può
spegnere.** Metterlo a 3 secondi lo farebbe arrivare **insieme** a quello di
Chrome, cioè non cambierebbe niente di misurabile. *Serve più CORTO di quello
di Chrome, o non serve affatto* — ed è esattamente la manopola che fa scendere
l'audio spedito, che è il costo che preoccupa.

**Quello che serve per costruirlo, e che oggi non è collegato:** l'evento
`speechend`. **Gli stessi tre eventi mancanti della riga F.1**: `speechstart`
serve a non tagliare chi ha cominciato tardi, `speechend` a tagliare chi ha
già finito. *Sono due facce dello stesso buco — il codice non sa quando la
voce comincia né quando finisce, sa solo quando arriva il testo.*

### ⚠️ LE DUE MANOPOLE CHIESTE: UNA C'È GIÀ, L'ALTRA NON ESISTE — 2026-09-21

Chi guida il progetto ha chiesto **due valori separati e modificabili da
`config`**, e tenerli separati è giusto. **Ma solo uno dei due corrisponde a
qualcosa che il codice fa.**

| Quello che è stato chiesto | Cosa esiste oggi |
|---|---|
| ① «il valore di distacco **se non sente** [nulla]» | ✅ **`CONFIG.voiceCoach.silenceTimeoutSeconds: 3`** — c'è già, ed è già nel Pannello Admin con la sua descrizione |
| ② «il valore di distacco **quando uno finisce la frase** e adesso, dopo 3 sec, la ferma» | ❌ **NON ESISTE, e non è un parametro mancante: è un comportamento mancante** |

**Cosa ferma davvero la registrazione quando hai finito di parlare, oggi:** il
**tetto massimo**, cioè `numeroParole × maxRecordingMsPerWord +
maxRecordingMarginMs` = `parole × 1000 + 3000` ms, **contato dal click**.

⚠️ **Quel `3000` è `maxRecordingMarginMs`, e ASSOMIGLIA ai «3 secondi dopo che
hai finito» senza esserlo:** è un margine sul tetto **totale**, non un conto che
parte dalla fine della frase. Su una frase di due parole il tetto è 5 s dal
click, qualunque cosa tu faccia dentro.

**Un vero «si ferma N secondi dopo che smetti di parlare» andrebbe costruito**, e
vorrebbe l'evento `speechend` più un terzo timer che si riarma. *È la cosa che
farebbe scendere davvero l'audio spedito — che è il costo che preoccupa —
perché oggi chi finisce presto paga il tetto intero.*

⚠️ **E PER QUESTO LA MANOPOLA ② NON È STATA AGGIUNTA IN QUESTO GIRO.** Una chiave
in `config` per un comportamento che non c'è comparirebbe nel Pannello Admin,
si lascerebbe cambiare, e **non cambierebbe niente**: una manopola che non
governa nulla è la regola 37 in forma di configurazione — *non somiglia a un
errore, somiglia a un'impostazione.*

### ⚠️ SU PAGES `speechstart` E `speechend` NON ARRIVANO — aperto il 2026-09-21

⚠️ **MISURATO IL 2026-09-21: `afterSpeechTimeoutMs` C'È NEL PANNELLO E GLI
EVENTI NON ARRIVANO LO STESSO.** L'ipotesi (a), la cache, è **scartata**: il
codice nuovo è sull'app vera. **Resta la (b): Chrome non emette
`speechstart`/`speechend`** in questa configurazione.

**PARCHEGGIATA, su decisione di chi guida il progetto** — *«lasciamo così per
il momento e poi vedremo»*. **Condizione per riprenderla:** quando si tornerà
sul microfono, o quando servirà davvero accorciare l'audio spedito (cioè se il
riconoscimento smetterà di essere gratuito — vedi
`scelte-strategiche-infrastrutturali.md`, ②.4).

*Costo di lasciarla lì: zero. Il comportamento è identico a prima del
2026-09-21, e i due gestori inerti non fanno danno.*

**Segnalato da chi guida il progetto dopo il collaudo:** *«adesso funzionano
solo il timer "tempo-massimo", "start" e "end" non funzionano»*.

⚠️ **PRIMA DI TUTTO, LA COSA CHE TOGLIE L'URGENZA: NON È UNA REGRESSIONE, È
UN NON-EFFETTO.** Letto il codice: se quei due eventi non arrivano,
`vcHeardAnySpeech` torna a essere alzata **solo** da `onresult` (come prima
del 2026-09-21) e `vcAfterSpeechTimeoutId` **non viene mai creato**.
`vcHeardAnyText` è letta solo dentro quella callback, che non gira. **Il
comportamento è identico a due giorni fa**: i due miglioramenti non fanno
danno, semplicemente non hanno effetto.

**LE DUE IPOTESI, e si distinguono con UN gesto e zero codice:**

| | Ipotesi | Come si scarta |
|---|---|---|
| **a** | **È la cache**: il browser serve ancora la versione di prima | Aprire `config`, gruppo `voiceCoach`: **se c'è `afterSpeechTimeoutMs`, il codice nuovo c'è** — quella chiave non esiste nella versione vecchia |
| **b** | **Chrome non emette quei due eventi** con `continuous = true` | Se la chiave c'è e gli eventi non arrivano lo stesso, resta questa |

⚠️ **E SE FOSSE LA (b), IL CODICE NON SI TOCCA A INDOVINARE.** Il finto
riconoscitore dei test **non può dire cosa fa Chrome davvero** — manda gli
eventi perché glieli mandiamo noi. *Da qui la differenza fra «l'app non
ascolta» e «il browser non parla» non è misurabile*, ed è esattamente la forma
della regola 37: una diagnosi che non può sbagliarsi non è una diagnosi.

**Serve una misura che vive sull'app vera**: un riquadro nel Pannello Admin che
registri **quali eventi del riconoscitore sono arrivati** nell'ultima
registrazione, con il momento in cui sono arrivati. Stessa forma di
`#config-audio-usage`. *Proposto, non costruito.*

### ✅ IL NOME E LA CATEGORIA DELL'EPISODIO — FATTO il 2026-09-21 (passo 2 dei sei)

`episodes.<id>` porta adesso **`nome`** («Al gate») e **`categoria`**
(`storia`, `grammatica`, `pronuncia`), e `badge: 'Episodio 1'` è sparito dal
codice. **Sono getter**, quindi il nome segue l'edizione viva.

⚠️ **E LA PAROLA «narrativo» E' USCITA DALLE CATEGORIE, NON DALLE SEQUENZE.**
Chi guida il progetto: *«non usiamo narrativo, che è una parola che sta facendo
confusione»* — e due giorni prima, sulle sequenze: *«mappa e narrazione lasciamo
così»*. **Le due frasi non si contraddicono perché parlano di due cose diverse:**
la **categoria** dice cosa contiene un episodio, la **sequenza** in che ordine si
fanno i suoi moduli. Quindi `narrativo-standard` resta, e un episodio di
`grammatica` può benissimo chiederla.

### ❌ L'ORDINE DEI 22 PASSI NON SI PROTEGGE — deciso il 2026-09-21

*Qui c'era una condizione aperta — «niente verifica più che i 22 passi vivi
siano quelli voluti, da chiudere al primo riordino vero». **È stata chiusa come
decisione, non come lavoro rimandato**, e va letta così: nessuna sessione
futura deve costruire quel test.*

**Le parole di chi guida il progetto:**

> *«Quei principi sono solo "indicazioni". Servono a me per capire e ricordarmi
> delle scelte e darne una motivazione. **Non devono essere bloccanti. Devo
> poter riordinare liberamente.** Io non mi preoccuperei di test che proteggono
> l'ordine: tanto lo scrivo io a mano, e al massimo farò delle prove. Se me ne
> servono altre le faremo.»*

⚠️ **E l'equivoco da cui è nata la proposta vale più della decisione:** i
principi `_020.._025` del documento erano stati letti **come una specifica da
far rispettare**, mentre sono **memoria delle scelte**. *Un documento scritto
per ricordare perché si è deciso qualcosa non è un contratto da verificare — e
trasformarlo in test avrebbe reso rosso proprio il gesto che deve restare
libero.*

**Misurato prima di decidere, e resta scritto perché è vero oggi:** cinque dei
sei principi erano verificabili, e tutti e cinque passavano sui 22 passi veri.
*Il fatto che si potesse fare non voleva dire che si dovesse.*

### ✅ LA NOMENCLATURA — FATTA il 2026-09-21 (passo 1 dei sei)

**Tutti i file di un'edizione portano il prefisso `{lingua}-{studente}-`**, e
il prefisso **non sta nei nomi**: lo costruisce `percorsoEdizione` da
`CONFIG.edizione`. *Quindi per un'edizione nuova non c'è nessuna lista da
allineare a mano — il codice chiede sempre il nome giusto.*

**La guardia è `tests/test_nomenclatura_edizione.js`**, e serve a un giorno
preciso: quando `docs/inglese/it/` verrà copiata in `francese/it/`, i nomi
resteranno `inglese-...` finché qualcuno non li rinomina. *Un prefisso
sbagliato è peggio di uno assente.*

⚠️ **E RESTA UN BUCO APERTO DA QUESTO STESSO PASSO, scritto qui perché non si
scopra da solo: NIENTE VERIFICA PIÙ CHE I 22 PASSI VIVI SIANO QUELLI VOLUTI.**

Il documento nuovo non elenca i passi delle sequenze, di proposito
(`STRUTTURA-CORSO_017`), quindi `test_struttura_corso.js` non ha più quella
tabella da confrontare e l'ha persa. In cambio ne guarda tre nuove — nomi dei
moduli, episodi, lingue del parlato — **ma nessuna di loro sostituisce quella.**

**Condizione per chiuderlo:** quando le sequenze diventeranno più di una vera
(oggi ce n'è una sola più una sonda), o al primo riordino fatto sul serio.
*Una riga cambiata per sbaglio dentro `sequences` oggi non fa rosso da nessuna
parte.*

### ✅ LE PAROLE: «narrativo» e «Mappa» — CHIUSO il 2026-09-21, restano

**Deciso da chi guida il progetto:** *«mappa e narrazione lasciamo così»*.

⚠️ **E la ragione per cui si poteva decidere di NON fare niente è una misura,
non una stima:** quello che legge lo studente sono **due valori in un file di
dati** — `mappaEpisodio.pageTitle` e `condivisi.tornaAllaMappa` in
`istruzioni-moduli.json`. *Cambiarli resta un gesto da un minuto, quando e se
servirà: non si chiude nessuna porta lasciandoli.* E `narrativo-standard` è un
id interno che nessuno studente legge.

**Cosa aveva davvero ingarbugliato il giro, e vale come regola:**

> **Si stava dando un nome a una cosa che non esiste.** La «lista degli
> episodi» non aveva un nome perché non c'è: non c'è la schermata, non c'è il
> dato, non c'è codice che lo legga. **Un nome scelto per una cosa che non
> esiste si scopre sbagliato solo quando la cosa nasce.**

*Misurato lo stesso giorno: l'app ha **dodici** schermate e **nessuna** elenca
gli episodi. L'episodio non si sceglie — ce n'è uno solo, deciso da
`CONFIG.episodioCorrente`, letto una volta all'avvio in `app/mappa.js`.*

### ⚠️ (storico) LE PAROLE — la valutazione che ha portato alla decisione

**Chiesto da chi guida il progetto**, e l'ordine in cui lo ha chiesto è la
parte che conta: *«decidiamo prima cosa vede lo studente e poi nominiamo di
conseguenza»*.

**Le tre cose da nominare, e sono legate:**

| | Cosa | Oggi si chiama | Problema |
|---|---|---|---|
| ① | l'ordine dei **moduli dentro un episodio** | `sequences`, e quella che esiste è `narrativo-standard` | «narrativo» fa confusione |
| ② | l'ordine degli **episodi dentro un'edizione** | `sequenza-episodi.md` | nessuno dei due nomi dice qual è quale |
| ③ | la **schermata che lo studente vede** con i passi dell'episodio | **«Mappa dell'episodio»**, e il pulsante **«← Mappa»** | *«non vuol dire più nulla»* |

**E le CATEGORIE degli episodi sono tre, dette da chi guida il progetto:
`storia`, `grammatica`, `pronuncia`.** «narrativo» esce.

**QUANTO COSTA, misurato e non stimato — ed è la parte che decide:**

| Cosa si cambia | Quanto costa |
|---|---|
| **③ la parola che legge lo studente** | ✅ **DUE VALORI IN UN FILE DI DATI.** `mappaEpisodio.pageTitle` («Mappa dell'episodio») e `condivisi.tornaAllaMappa` («← Mappa») in `istruzioni-moduli.json`. **Zero righe di codice**, zero rischio |
| **① il nome `narrativo-standard`** | 78 occorrenze di «narrativ» in **19 file**, quasi tutte prosa. ⚠️ **Ma in `test_struttura_corso.js` è UNA riga sola**, perché il 2026-09-21 il nome è diventato la costante `SEQUENZA_CONFRONTATA` |
| **gli id interni (`sequences`, i nomi delle funzioni)** | è una **rinomina**, quindi regola 41 per intero |

⚠️ **QUINDI SI POSSONO FARE SEPARATAMENTE, ED È LA COSA PIÙ UTILE DA SAPERE:**
quello che vede lo studente si cambia **oggi, in due valori**, senza toccare
una riga di codice. *Le rinomine interne sono un'altra decisione, e possono
aspettare.*

⚠️ **E UNA COLLISIONE DA SEGNALARE PRIMA DI SCEGLIERE:** `percorsoEdizione`
**esiste già**, in `app/dati.js`, e **non è una sequenza**: è la funzione che
costruisce il percorso su disco di un file dell'edizione
(`data/inglese/it/...`). Usare quel nome per l'ordine degli episodi
significherebbe avere due cose diverse con lo stesso nome — la forma
⓪-decies. *Se si sceglie quella parola, quella funzione va rinominata nello
stesso passo (`fileDellEdizione` direbbe quello che fa).*

### ⚠️ IL DOPPIO CONTROLLO DI `inglese-it-struttura-corso.md` — 2026-09-21

*Chiesto da chi guida il progetto: «facciamo un double-check se per te è tutto
corretto? se c'è qualcosa che reputi non corretto, segna qui in chat il punto e
cosa cambieresti». I punti sono numerati `STRUTTURA-CORSO_0xx` nel file.*

**Quello che TORNA, misurato e non letto:** uno script ha confrontato ogni
valore del JSON con il file nuovo — 15 nomi di moduli, 2 sequenze, 2 episodi
con la sequenza che chiedono, 2 lingue, 4 nomi dei gradi, 6 categorie:
**33 controlli, 32 verdi.** Le tabelle sono giuste.

**SEI PUNTI DA GUARDARE, in ordine di quanto pesano:**

| | Punto | Cosa non torna | Cosa cambierei |
|---|---|---|---|
| **①** | **_017**, **_035**, **_037** | *«i passi delle sequenze si modificano dal Pannello Admin»* — **vero come gesto, falso come risultato**: il pannello scrive negli **override in `localStorage`**, cioè in quel browser soltanto. La modifica **non arriva mai al JSON**, nessun altro la vede, e sparisce svuotando i dati del sito — *com'è successo il 2026-09-19*. E **_037 è falso oggi**: il pannello **non sa creare** una sequenza, lo dice la sua stessa descrizione | Due strade: **(a)** scrivere qui che oggi la modifica è **temporanea e locale**, e che per renderla vera va riportata nel JSON; **(b)** fare il passo **1.14** — il pannello che esporta la sequenza — e allora la frase diventa vera |
| **②** | **_010** | ⚠️ **«Perche' si dice cosi'» con gli apostrofi, ed è TESTO CHE LEGGE LO STUDENTE.** Nel JSON oggi è *«Perché si dice così»*. È l'**unico** sottotitolo con lettere accentate, quindi l'unico che se ne accorge | Rimettere gli accenti **in quella riga**. *Gli apostrofi nella prosa del file vanno benissimo — quella la leggiamo noi; la tabella dei sottotitoli no* |
| **③** | **_026**, **_027**, **_028** | La **categoria dell'episodio** (narrativo, grammaticale, pronuncia) **non esiste**: oggi `episodes.gate` porta solo `{ sequence }` | È un **campo nuovo** da aggiungere a `episodes.<id>.categoria`. Non è un errore del file: è lavoro che il file chiede |
| **④** | **_032** | Dice giusto **dove sta oggi** (`badge: 'Episodio 1'` in `app/catalogo.js`) — quindi **_031 è violato adesso**: lo studente legge esattamente «Episodio 1». ⚠️ **Ma «va nel file episodio» costa una cosa che non si vede:** la mappa disegna il badge **senza caricare il file episodio**, quindi il nome lì dentro la costringerebbe a un `fetch` che oggi non fa — e un caricamento fallito romperebbe la mappa | Metterlo in **`episodes.<id>.nome`** del file di struttura: **costa zero** (quel file arriva già prima di qualunque schermata) ed è già per edizione, quindi resta testo nella lingua dello studente |
| **⑤** | **_001** | Dice `data/inglese/it/inglese-it-struttura-corso.json` **senza prefisso**, mentre **_014** e **_040** lo mettono. È incoerente **oggi**, e coerente **dopo** la rinomina decisa | Niente da cambiare a mano: lo sistema il passo della nomenclatura |
| **⑥** | — | **Il file vecchio NON si può ancora togliere:** `tests/test_struttura_corso.js` legge `docs/inglese/it/inglese-it-struttura-corso.md` (`const DOC`). Cancellarlo adesso fa **rossa la suite** | La rinomina e l'aggiornamento del test vanno **nello stesso commit**, ed è il passo già deciso |

### ⚠️ IL TRIAGE DEI FUORI CATENA — chiesto il 2026-09-21

> *«inerente ai punti F… possiamo farli ora così ce li togliamo per sempre e non
> stiamo continuamente a ritrovarli? se sì, decidi quali fare e quali non si
> può, ma mettiamoli comunque in cronologia nel file decisioni sennò tornano
> sempre.»*

**La risposta non è «sì» né «no»: tre si possono fare adesso, due no, e le due
che non si possono NON sono rimandate per prudenza — sono rimandate perché
farle adesso significherebbe decidere senza il dato che serve.**

| | Si può adesso? | Perché |
|---|---|---|
| **F.1** taglio per silenzio | **SÌ** | La correzione è **una sola e già individuata** — riarmare il timer — e vive in `app/voice.js`. La sua condizione («al passo 26») diceva *non in mezzo allo spacchettamento*: lo spacchettamento è finito. ⚠️ **Ed è già protetta**: `test_comportamento_audio.js` [C] guida il taglio per silenzio e l'ha già visto fallire |
| **F.2** i 17 finti sintetizzatori | **SÌ, ma DA SOLA** | ⚠️ **Questo passo è fatto per diventare rosso, e il rosso è il guadagno** (regola 19): dare `speaking` vero e una fine asincrona ai 17 finti fa emergere difetti che oggi nessuno vede. Accorparla con qualunque altra cosa vorrebbe dire non sapere chi ha rotto cosa |
| **F.3** design mastery | **NO** | Per la sua **condizione scritta**: *«quando il report sarà visibile allo studente, e non prima»*. Oggi il report non lo vede nessuno, quindi scegliere fra «uniformare» e «spiegare» significa scegliere al buio. **Non è pigrizia: è che il dato manca** |
| **F.4** `bootAsUser`/`mockInit` | **SÌ** | Tocca **solo i test**, e ha una forma già collaudata in questo progetto: la stessa deduplicazione fatta per l'apertura dei moduli. Nessun rischio per l'app |
| **F.5** due funzioni senza chiamante | **DA DECIDERE, non da fare** | Non è un lavoro, è una scelta: **cancellarle** (il disegno resta in `decisioni-storico.md` e si riscrive quando nasce il Modulo Finale) oppure **dichiararle parcheggiate** con la condizione. *Finché restano lì senza etichetta, ogni giro le ritrova e ogni giro le rimanda* |

⚠️ **E LA COSA CHE IL TRIAGE HA TROVATO, che non era una delle F: F.6 NON HA
CHIUSO TUTTO.** Cercando dove vivessero le frasi false, ne restano **cinque**
nello stesso file che F.6 aveva corretto, e **tre righe sopra** quella corretta:

| File | Riga | Cosa dice | Perché è falsa |
|---|---|---|---|
| `struttura-corso.md` | 3 | *«Da qui vengono aggiornate le voci di `APP_CONFIG`»* | dal 2026-09-20 la fonte da aggiornare è `data/inglese/it/inglese-it-struttura-corso.json` |
| `struttura-corso.md` | 13 | *«Ogni sezione corrisponde a una voce di `APP_CONFIG`»* | idem |
| `struttura-corso.md` | 5 | *«il contenuto di un episodio sta in `docs/episodio-N.md`»* | è la nomenclatura che la **regola 4 vieta**, tolta al passo 6: oggi è `docs/inglese/it/inglese-it-gate.md` |
| `struttura-corso.md` | 55–57 | *«L'ordine è uno solo per tutto il corso… un episodio può sovrascriverlo, ma è l'eccezione»* | oggi **ogni** episodio dichiara la propria `sequence`, **sempre**, e non esiste nessun default implicito |
| `sequenza-episodi.md` | 9–12 | *«Non esiste un `sequenza-episodi.json`, ed è una scelta: l'elenco serve **durante** l'avvio, prima che qualunque file sia scaricato»* | dal passo 1.11b `struttura-corso.json` arriva **prima di qualunque schermata**, e **porta già `episodes`**. La ragione per cui il file non esisteva non c'è più |

*È la forma della **regola 41**: F.6 ha corretto la frase dov'è andata a
cercarla — in fondo al file — e ha lasciato la stessa frase in testa. Una
verifica per sottrazione fatta su un punto invece che su tutte le forme.*

✅ **F.6-bis CHIUSA il 2026-09-21**, autorizzata in chat: le cinque frasi sono
corrette, e `struttura-corso.md` ha adesso anche le **quattro sezioni che gli
mancavano** — sequenze, episodi, lingue del parlato, nomi dei moduli. *Sette
chiavi nel JSON, sette sezioni che le scrivono.* Verificato per copertura: **33
controlli fra markdown e JSON, 33 verdi.**

⚠️ **E UNA COSA CHE LA CORREZIONE HA FATTO VEDERE, da tenere per il passo 1.13:**
`sequenza-episodi.md` esiste dal 2026-09-09 e porta già l'ordine — A1.1 con cinque
episodi (`benvenuto`, `numeri`, `verb-to-be`, `gate`, `aircraft-door`) e i loro
raggruppamenti. **Quindi 1.13 non parte da zero: parte da quel file**, e la frase
che diceva «un JSON non serve» è proprio quella che il passo 1.11b aveva reso
falsa. *La domanda aperta non è più «un file sì o no»: è **«l'ordine degli episodi
è un dato, o resta l'ordine in cui le chiavi sono scritte?»***

### ⚠️ QUANDO NASCERÀ IL PANNELLO ADMIN VERO, `config` VA CHIUSO A TUTTI — 2026-09-21

**Detto da chi guida il progetto**, e registrato qui perché è una decisione che
cambia due cose già costruite:

> *«Quando ci sarà il pannello admin, sarà da togliere la possibilità di
> scrivere `config` da parte di nessuno, specialmente dell'utilizzatore.
> Quindi, a quel momento, sarà da verificare se sospendere la funzione del
> nuovo tasto visibile.»*

**Le due cose che ne dipendono, e vanno guardate INSIEME quel giorno:**

1. **le due porte del pannello** — la sequenza `config` da tastiera e `?config`
   nell'indirizzo: oggi le può aprire chiunque abbia l'app;
2. **la terza uscita sulla schermata d'errore** («Ripristina i valori di
   partenza», nata il 2026-09-21): ⚠️ **serve a disfare un danno che solo il
   pannello sa fare.** Chiuso il pannello allo studente, quel pulsante non ha
   più una causa da riparare — e un pulsante che cancella dati senza una causa
   è esattamente il *«pulsante che non può aiutare»* che la sua stessa guardia
   evita oggi (compare **solo** se ci sono override salvati).

*Quindi non sono due decisioni: è una sola. Chiudere le porte senza guardare il
pulsante lascerebbe in piedi l'uscita di emergenza di una stanza murata.*

**Condizione:** al pannello Admin vero, tappa ③ (messa in sicurezza).

### La misura delle CPU della CI — chiusa il 2026-09-21

Il `2` inciso nello script è diventato `nproc`, con tetto a 8. **Il runner di
`ubuntu-latest` ha QUATTRO CPU** — misurate, non dedotte: il log della corsa
stampa `--- 76 file, 4 in parallelo (CPU misurate: 4) ---`.

| | prima (N=2) | adesso (N=4) |
|---|---|---|
| corsa intera | ~600 s | **369 s** |
| solo il passo «Lancia la suite» | — | **319 s** |

**Deciso: si resta a 4, non si prova 8.** Il runner *ha* 4 CPU: chiederne 8 non
aggiunge macchina, aggiunge contesa — e i timeout scatterebbero per contesa
invece che per difetto, cioè un rosso che non sa spiegarsi. *Il tetto a 8 nello
script serve alla macchina di domani, non a forzare quella di oggi.*

**Fuori catena, da chiudere in questa tappa o dichiarare rimandati:**

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
letto da `resolveModuleOrder` (`app/catalogo.js:269`). Una sequenza non sa
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
`data/inglese/it/inglese-it-tabelle-personalizzazione.json`, la sola sequenza e'
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
   `data/inglese/it/inglese-it-tabelle-personalizzazione.json`.** Quel file porta `fr`,
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
