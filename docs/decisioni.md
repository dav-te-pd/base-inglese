# Decisioni prese, non ancora eseguite

Il gemello di [`correzioni.md`](correzioni.md), e ne è il contrario nel tempo:
lì stanno i fatti **fatti**, qui i fatti **decisi**. Una decisione presa è un
fatto datato che non si rinegozia — non è un piano, non dice cosa viene prima,
non va tenuto allineato a niente. È una lista non ordinata di cose che abbiamo
deciso e non abbiamo ancora fatto.

Tre regole, e sono tutte:

1. **Una riga per decisione: data, cosa, perché, quando si esegue.** Il *quando*
   è una **condizione**, non una data: «prima di un collaudo su profilo nuovo»,
   non «giovedì». Le date scadono da sole e mentono; le condizioni no.
2. **Si scrive nel commit in cui la decisione viene presa**, come i test
   (regola 23) e come le correzioni. Una decisione registrata dopo è una
   decisione che, nel frattempo, si è già persa.
3. **Quando viene eseguita, la riga si SPOSTA in `correzioni.md`** con il commit
   che la applica, e sparisce da qui.

**Lo svuotarsi è la proprietà che tiene onesto questo file.** Un registro che
solo cresce diventa un cimitero che nessuno rilegge; uno che si svuota mostra
da solo cosa è rimasto indietro. Se una riga è qui da sei mesi, si vede — ed è
un'informazione, non un fastidio.

Una riga senza condizione (`da fissare`) è una decisione a metà: si è deciso
*cosa*, non *quando*. Vale la pena fissarla alla prima occasione, invece di
scoprirla scaduta.

---

# LA CATENA IN CORSO — a che punto siamo

> ⚠️ **Questa sezione è un'ECCEZIONE DICHIARATA alle tre regole di questo file**, ed è
> l'unica. Il cappello qui sopra dice che questo è *«una lista non ordinata»* che
> *«non dice cosa viene prima»*: questa sezione è ordinata e dice esattamente cosa
> viene prima.
>
> **Perché l'eccezione esiste.** Una catena di ventisei passi interrotta a metà senza
> traccia è la stessa cosa di un collaudo interrotto con i rilievi in testa: non lascia
> traccia di essere avvenuta. Il container si è riavviato **tre volte in un giorno
> solo**, e una sessione nuova legge i file — non la conversazione in cui la catena è
> stata decisa, che non le arriverà mai.
>
> **Perché sta QUI e non in un file suo.** Un file in più è una cosa in più da
> ricordarsi di aprire. Questo file lo si apre già, perché è dove si guarda cosa è
> rimasto indietro.
>
> **Quando sparisce:** si cancella quando la catena finisce. Non diventa un archivio —
> è la stessa proprietà che tiene onesto il resto del file.

## Come si legge una riga

Ogni passo dice **tre cose**, e la terza è quella che serve davvero a chi arriva:

1. **dove siamo** — fatto, in corso, o non cominciato;
2. **cosa non si deve fare** — i divieti, che non si deducono guardando il codice;
3. **se il punto è una FERMATA SICURA** — cioè se ci si può alzare da lì lasciando il
   repository in uno stato che qualcuno capisce fra una settimana.

La terza non si ricava dalle altre due, ed è l'unica ragione per cui questa tabella
vale la pena di essere mantenuta.

## Dove siamo adesso

*Riscritta l'11 settembre 2026. La versione precedente dichiarava finite le fasi
1-bis e 2 e poi diceva «il prossimo passo è la fase 1-bis»: si contraddiceva da
sola, e non nominava niente di quello che è successo il 9 e il 10 settembre.
**È la prima sezione che una sessione nuova apre, quindi era anche la prima cosa
falsa che leggeva.***

### Il prossimo passo è il **18 giro B** — il markup, E LA FASE 3 FINISCE LÌ

⚠️ **Il 17 è CHIUSO senza essere fatto** (15 settembre), e la decisione viene dai
numeri del suo stesso triage: tre casi dichiarati e tutti e tre caduti, due
setacci costruiti e due prove negative sull'unico caso verificabile, 6569 righe
di superficie contro l'ora stimata. La lettura dei commenti è diventata **una
riga dello spacchettamento**. Gli esiti stanno in «I commenti: due setacci
costruiti e due prove negative», e il terzo è quello che conta: *senza, la
prossima sessione ricostruisce lo stesso rilevatore e ci si fida.*

⚠️ **E il 18 va RICONTATO PRIMA, per la quinta volta di fila.** Il numero in
cronologia è **93 stringhe**, ed è già più sospetto degli altri quattro per una
ragione sua: **veniva da un filtro grezzo, non da un elenco.** Gli altri erano
casi notati e contati male; questo è un `grep` che nessuno ha guardato.

### Il 17 — i commenti (chiuso senza farlo)

**Il passo 16 è fatto a metà, e la metà che manca non è un residuo: è uscita
dal passo.** Punti 1-5 eseguiti il 15 settembre (² già morta, ⁵ il commento
falso, ³⁴ le due cartelle — 2004 righe — e ⁶ solo `openModule`).
⚠️ **`view-pronunciation` è diventata un passo suo dopo il 25**, perché non è
codice morto isolato ma intrecciato con funzioni vive di Voice Coach;
**`bootAsUser` e `mockInit` sono diventati una decisione loro**, perché 14 e 20
varianti non sono pulizia. *Le righe stanno in fondo a questo file, con le loro
condizioni.*

### Il 14b — una forma per famiglia

Pianificato sui numeri del 14a, **rimisurati l'11 settembre: 186 guardie, non
180.** Il conto si rigenera con `node tests/tools/conta-attese.js`, non si
ricorda.

**IL 14b È CHIUSO: 186 → 0 guardie da convertire.** Tutte le famiglie, «altro»
compreso, e i cinque gruppi piccoli — che si sono rivelati **tre gesti letti da
cinque angoli**. ⚠️ **I numeri intermedi scritti durante la giornata — 154, 108, 90 — erano
GONFIATI**: lo strumento non riconosceva cinque delle otto funzioni del
magazzino e promuoveva a guardia le attese che stavano prima di una conversione.
Corretto, e il perché sta in «14b ④». *Il 186 del 14a invece è giusto: nessuna
di quelle funzioni esisteva ancora.*

**Non resta niente del 14b.** Le 186 guardie sono diventate **0 da convertire**
e **76 legittime marcate nel sito con il loro motivo** — il resto è navigazione,
che non è mai stata debito. *Il numero che contava non era «quante ne ho
convertite»: era «quante ne restano senza una spiegazione», e adesso è zero.*

**Il 15 e il 16 sono chiusi, il 17 è chiuso senza essere fatto. Resta il 18.**
⚠️ **E il 18 va RICONTATO prima di pianificarlo, non durante**: le «93
stringhe» dichiarate non sono mai state contate. Il 15 diceva «quattro
valori» ed erano 39 righe; il 16 sbagliava cinque numeri su sei.

### Cosa è chiuso

| | |
|---|---|
| **Passo zero** | 0a, 0a-bis, 0b, 0c, 0d — lo strumento misura, i quattro cicli non deterministici sono riscritti, gli errori ingoiati censiti |
| **Fase 1 — le rinomine** | 1, 2, 3, 4, 4-bis, 5, 6. I nomi di oggi sono quelli decisi: `shuffle`, `flashcard`, `match*`, `speedMatch*`, `storyCards*`, `gate` / `aircraft-door` sotto `data/inglese/it/` e `docs/inglese/it/` |
| **Fase 1-bis** | 7, 8, 9 (2026-09-09). La sequenza ha la sua fonte nel repository, `EPISODES` nasce da lì, le etichette dei personaggi sono contenuto dei file episodio |
| **Fase 2 — il collaudo** | 10, 11, 12 (2026-09-09): ventidue passi su profilo nuovo, su Pages. Ne sono usciti i sei difetti C.1→C.6 |
| **I difetti del collaudo** | C.1, C.2, C.3, C.4, C.5 fatti e verificati. **C.6 non è di questa catena**: è la N.1 della cronologia nuova |
| **Fase 2-bis — la mastery** | ① ② ③ fatti e verificati il 2026-09-10. ④ chiude come voce con una nota, ⑤ è prodotto e slitta |
| **Fase 3** | **14a** (2026-09-10), **14b** (2026-09-11, 186 → 0), **15** e **16** (2026-09-15) |

### Cosa resta

**18** della fase 3 — e con quello la fase 3 finisce; la **fase delle stringhe**; la **fase 4** (19 → 26).
Il **13** — le cinque righe della mastery — resta aperto come blocco a sé.
Fuori catena, nati dal passo 16: **`view-pronunciation` dopo il 25** e i due
passi su **`bootAsUser` / `mockInit`**.

### ⚠️ Il 10 settembre è stato quasi tutto FUORI catena, e va saputo

Quindici commit, **uno solo** dei quali è un passo della catena (il 14a). Tutto il
resto sono difetti trovati strada facendo e strumenti:

- **la ③ e la ② della fase 2-bis** — il travaso dei colori al gesto, e Voice Check
  che scrive (quelle sì, in catena);
- **le cinque corse contro il fetch del sottotitolo** e **il popup dei tentativi
  come pezzo solo** — due famiglie chiuse, non pianificate;
- **la finestra di apertura dei moduli**, misurata e chiusa: 17 ms → 1 ms;
- **`attendi.sh` che si arrende da sola**, e le regole 19, 32, 38, 40 e 42 di
  `CLAUDE.md`.

*Non è un rimprovero al metodo: quei difetti erano veri e trovarli è servito. Ma
è il motivo per cui questo file era rimasto indietro — è costruito per una catena
pianificata, e quella giornata non lo è stata.*

**Quel buco è stato chiuso l'11 settembre, ed è la regola 43 di `CLAUDE.md`:** la
riga nasce **col commit**, non il giorno dopo, e la verifica è sul **diff** — *un
commit che tocca codice o test e non tocca un registro è un commit che non ha
registrato niente*. Non un posto nuovo: i due file c'erano già. Un **momento**.

*Lo stato di un passo diventa ☑ solo quando la suite è verde e il conteggio è
invariato: finché la verifica non è passata resta ◐. Al passo 1 era stato messo a ☑
nello stesso commit della modifica — è andata bene, ma per un momento il file diceva
«fatto» su un lavoro non ancora verificato.*

## I divieti — leggerli PRIMA di prendere un passo

Non si deducono dal codice, e ognuno è costato una discussione:

- **Il passo 5 (`se* → storyCards*`) non si interrompe. Mai.** Quattro strati insieme
  (116 identificatori JS, 42 classi e id `se-*`, 54 `speak-easy-*`, due namespace del
  `localStorage`), e **un `se-` mancato in una regola CSS non fa fallire nessun test**:
  `test_hidden_guard.js` costruisce gli elementi *a partire dalle* regole, quindi una
  regola orfana passa verde. Fermarsi lì lascia un repository verde e sbagliato. Se non
  hai davanti una sessione intera, non cominciarlo.
- **I passi 3 e 4 (`match*` e `speedMatch*`) si fanno insieme, o nessuno dei due.**
  Condividono `buildMultipleChoiceOptions`, `recordMultipleChoiceResult` e il parametro
  `unitPrefix`: mezza coppia rinominata lascia una funzione condivisa i cui due
  chiamanti seguono convenzioni diverse.
- **Il passo 18 (le stringhe italiane nel JS) non si fa a metà.** Spostarne una parte
  raddoppia i posti dove cercarle, invece di dimezzarli.
- ~~**Il passo 21 (lo spazio dei nomi) non è una fermata sicura.** O l'oggetto esiste e
  tutto ci passa attraverso, o no.~~ **SCADUTA, corretta il 2026-09-16.** Quella frase
  descrive un passo in cui *creare l'oggetto* e *farci passare tutto* sono la stessa cosa.
  **Quel passo non esiste più dal 15 settembre**, quando la fase 4 è stata rifatta e il
  «tutto ci passa attraverso» è stato staccato in **21-bis** (`stopAllModuleActivity`),
  **21-ter** (`openModuleByKind`) e **21-quater** (i listener). Il 21 di oggi crea il
  meccanismo e nessuno lo usa ancora: **è additivo al 100%, ed è una fermata sicura.**
  *Il costo vero di fermarsi lì è un altro, e va detto: un meccanismo senza utenti per un
  giro. Si accetta perché il primo rosso del 21-bis deve poter incolpare la conversione
  della pulizia, non la nascita dello spazio dei nomi.*

> ⚠️ **QUANDO SI RIFÀ UN PIANO, SI RILEGGONO LE INVARIANTI CHE QUEL PIANO CITA.**
>
> Sono la parte che nessuno guarda, **proprio perché si chiamano invarianti**: la riga qui
> sopra è rimasta scritta al contrario per quattro giorni, e a lasciarcela non è stato chi
> ha scritto il piano vecchio — è stato chi ha scritto quello nuovo, lo stesso giorno, senza
> tornare indietro a guardare cosa quel piano dava per fermo.
>
> *È la famiglia ⓪-quinquies applicata al piano invece che al codice: una frase che resta
> giusta sulla sua riga mentre il mondo intorno cambia. E non l'ha trovata una rilettura —
> l'ha trovata una domanda esplicita («controlla se qualcosa è cambiato»), che è il motivo
> per cui la regola dice **rileggere**, non **ricordarsi**.*
- **Dopo ogni rinomina si verificano DUE cose, non una: la suite verde E il conteggio
  delle asserzioni.** 346 occorrenze dei nomi vecchi stanno dentro `tests/` (90
  `gate`, 102 `quickMatch`, 126 `speedRound`, 22 `flashcardLevelA`). Un selettore
  rinominato male in un punto dove il risultato viene ignorato produce un verde che
  prova meno di ieri, e il verde da solo non lo dice.
- **Il conteggio deve NON CALARE, non "restare uguale".** Un test nuovo lo fa salire, ed
  è giusto: un aumento aggiorna il baseline, un calo si ferma e chiede spiegazioni.
- **La fase 1 confluisce in `main` solo alla fine**, dopo il passo 6. Durante, si lavora
  su `claude/verifica-in-corso`.

## I passi

**Legenda dello stato:** ☐ non cominciato · ◐ in corso · ☑ fatto.

### Passo zero — mettere in sicurezza lo strumento

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **0a** | Il contatore delle asserzioni in `run_full_regression.sh`: somma i conteggi che ogni file già stampa, li confronta con un baseline registrato, protesta se calano. **Va visto fallire apposta** (si sposta il baseline di uno) — altrimenti è esso stesso una misura che non misura. ~1 ora.<br><br>⚠️ **Il caso non è teorico, ed è arrivato prima del contatore.** Il 2026-09-08 `test_batch19` è caduto eseguendo **39 asserzioni invece di 40**: la quarantesima vive dentro il ramo `if (gotCorrect)`, e quando il ciclo si esaurisce senza trovare una risposta giusta quel ramo non gira. Lì si vedeva, perché due asserzioni fallivano — ma un ciclo che si esaurisce **senza far fallire niente** avrebbe dato un verde pieno con un'asserzione in meno. È esattamente quello che questo passo esiste per vedere.<br><br>**FATTO il 2026-09-08.** `tests/tools/conta-asserzioni.js` + `tests/BASELINE-ASSERZIONI.txt`, lanciato da `run_full_regression.sh` alla fine di ogni corsa: un calo rende la suite rossa. Baseline **per file**, non un totale — un totale dice «cinque asserzioni sparite» e lascia cercare in quarantuno file. Protetto da `tests/test_conta_asserzioni.js`, visto fallire su tre guasti (il controllo dei cali spento, il conteggio dei soli verdi, un file mancante contato zero). | ☑ | **sì** |
| **0a-bis** | **Riscrivere il blocco `[SR Task1]` di `test_batch19`** con la tecnica di `tests/test_match_practice_nonloso.js`: costruire la situazione invece di sperarci, e aspettare lo stato invece di 800 ms. **Questo blocco soltanto** — le altre diciotto attese fisse sono il passo 14.<br><br>**Perché sta nel passo zero e non nella fase 3:** misurato il 2026-09-08, quel file è rosso **2 giri su 3** sullo stesso codice. Con una fase 1 di sei rinomine significherebbe due terzi di probabilità, dopo ognuna, che la suite vada rossa per un motivo che con la rinomina non c'entra — cioè la fine della sola proprietà su cui questa catena è costruita: **ogni rosso ha un sospettato solo**. L'alternativa scartata era «quel file va rilanciato da solo prima di crederci», che è una regola non scritta, e le regole non scritte si dimenticano al terzo giro. 1-2 ore.<br><br>**FATTO il 2026-09-08.** Riscritto con la tecnica del gemello: non si risponde mai giusto sull'ultima domanda del passaggio, il limite del ciclo viene da quante domande esistono, e l'attesa finale guarda la domanda successiva invece di 800 ms. **Cinque giri consecutivi verdi, 40/40 ogni volta** (prima: 2 rossi su 3, e 39 asserzioni invece di 40 quando cadeva). Visto fallire apposta togliendo la riga che riaccende il pulsante: fallisce **eseguendo comunque 40 asserzioni**, che è la prova che il ramo non salta più.<br><br>⚠️ **Il passo è cresciuto da un blocco a QUATTRO, e va detto.** Corretto `[SR Task1]` e rilanciata la suite, è caduto **`[SR Task3-adj]`** — stesso file, stessa forma, mai toccato. Era la lezione di questa riga che si ripeteva su di me: *«si stava guardando un esemplare invece della specie»*. Gli esemplari erano quattro (`[QM Task1]`, `[SR Task1]`, `[SR Task3]`, `[SR Task3-adj]`), tutti con lo stesso ciclo «tocca la prima opzione al massimo venti volte e spera». Riscritti insieme con tre funzioni condivise — `statoQuiz`, `toccaFinoA`, `attendiDomandaSuccessiva` — che servono sia Match Practice sia Speed Match perché gli id dei due moduli seguono lo stesso schema: **un posto solo da correggere invece di quattro**. `tapPrimaOpzione` è sparita, non la usava più nessuno. Sei giri consecutivi verdi, 40/40 ogni volta.<br><br>**Resta un test probabilistico, ed è dichiarato:** con nove domande e tre passaggi le occasioni passano da ~9 a ~30, e la probabilità di non vedere mai una prima opzione giusta da 7,5% a 0,02%. | ☑ | **sì** |
| **0b** | Una corsa completa della suite: ristabilisce il verde **e produce il baseline dal contatore stesso**, non da un numero contato a mano. ~11 minuti. *(Il contatore va scritto PRIMA della corsa: se il baseline lo conta una persona, il primo confronto può fallire per un errore di conteggio invece che per un'asserzione persa.)*<br><br>**FATTO il 2026-09-08, al secondo tentativo.** Il primo è finito rosso su `test_batch19` ed è così che è saltato fuori il terzo esemplare del passo 0a-bis. Il secondo: **42 file su 42 verdi, 933 asserzioni**, registrate in `tests/BASELINE-ASSERZIONI.txt`. Verificato subito dopo che il controllo passa sugli stessi risultati. | ☑ | **sì** |
| **0c** | Il censimento dei `.catch` vuoti in `tests/ERRORI-INGOIATI.md`, file suo accanto ad `ATTESE-FISSE.md` e citato da `tests/README.md`. **47 occorrenze in 19 file.** Non si cancellano: si **distinguono** — un `.catch` su un elemento che legittimamente può non esserci è corretto, uno su un click che deve riuscire è un errore soppresso dove nasce che si manifesta dove non si può più diagnosticare. ~1 ora.<br><br>**FATTO il 2026-09-08.** `tests/ERRORI-INGOIATI.md`, **47 punti in 19 file**, in tre famiglie: **6 attese soppresse** (un `waitForFunction(...).catch(() => {})` è una `waitForTimeout` travestita da attesa di stato — la famiglia peggiore, e la più piccola), **29 click che devono riuscire**, **12 opzionali legittimi che vanno lasciati stare**. Rimandi incrociati con `ATTESE-FISSE.md` in entrambe le direzioni. | ☑ | **sì** |
| **0d** | Il merge in `main` di quello che sta su `claude/verifica-in-corso` (i documenti dei nomi e questa catena), appena 0b è verde. Senza, «merge in main solo alla fine» della fase 1 resta ambiguo.<br><br>**FATTO il 2026-09-08.** | ☑ | **sì** |

### Fase 1 — le rinomine

*I nomi e le loro ragioni stanno in `docs/inglese/it/struttura-corso.md`, sezione «I nomi in
codice». Qui c'è solo l'ordine e lo stato.*

*Il criterio dell'ordine: dal più piccolo al più grande, così **il primo rosso ha sempre
il sospettato più piccolo possibile**.*

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **1** | `srShuffle → shuffle` — 11 occorrenze, nessuno stato salvato, nessun DOM, nessun file dati. È il giro di taratura del metodo: se la suite va rossa qui, il problema è il metodo, non la rinomina.<br><br>**FATTO il 2026-09-08.** Undici in `index.html` (la definizione più dieci chiamate) e una in `tests/test_scala_colori.js`. Verificato prima che `shuffle` non collidesse con niente: nel codice non esisteva, nemmeno come parola. Allineate anche le **nove** occorrenze in `docs/validazione.md`, che descrive il codice e avrebbe continuato a nominare una funzione inesistente. **`docs/inglese/it/struttura-corso.md` NON è stato toccato** (regola 33): la sua tabella dichiara la rinomina da fare, ed è la fonte, non un registro di stato. | ☑ | **sì** |
| **2** | `flashcardLevelA → flashcard` — un `kind`. Prima rinomina che attraversa `data/…/istruzioni-moduli.json` e `introDismissed:`.<br><br>**SCRITTA il 2026-09-09, in attesa della suite.** 33 sostituzioni in 27 file: 4 valori di `kind` in `index.html`, la chiave di `istruzioni-moduli.json`, 26 nei test (di cui 4 in `tests/debug/`, che non è nella suite), 2 in `docs/validazione.md`. Verificato prima che il `kind` non venga mai usato per costruire un id del DOM — serve solo a `data[module.kind]` e alla chiave `introDismissed:` — quindi nessuna collisione con `#view-flashcard` e compagnia.<br><br>**VERIFICATO il 2026-09-09:** suite verde su 42 file, conteggio **933, uguale al baseline**. In `main`. | ☑ | **sì** |
| **3** | `quickMatch* → match*` (con `match-*`, `view-match`; **non** `qm-`)<br><br>**FATTO il 2026-09-09, insieme al 4.** Verifica per SOTTRAZIONE (il nome vecchio deve sparire, mai «il nuovo c'è»): `\bmatch\b` pesca `str.match()` e `CONFIG.matching`, che è tutt'altro. Ha trovato **24 residui che la misura non aveva contato**, fra cui `openQuickMatch` — un nome di funzione con la maiuscola interna, che una ricerca sul nome nudo non prende. Suite verde, 933.<br><br>⚠️ **Ma NON era completa: mancava la prosa.** Vedi il passo **4-bis** qui sotto. | ☑ | **NO** — vedi i divieti |
| **4** | `speedRound* → speedMatch*` (con `speed-match-*`, `view-speed-match`; **non** `sr-`)<br><br>**FATTO il 2026-09-09, insieme al 3.** 515 sostituzioni previste + 24 residui, in 47 file. Segue anche il prefisso delle chiavi mastery (`'quickmatch'`→`'match'`, `'speedround'`→`'speedmatch'`): scrive il nome per esteso, quindi segue — e le voci mastery di quei due moduli restano orfane, accettato perché si riparte da zero. **Sopravvive una occorrenza di proposito:** `speedRoundMessages` in `messaggi-feedback.json`, dato morto — dargli un nome corrente lo farebbe sembrare vivo. Suite verde, 933.<br><br>⚠️ **Ma NON era completa: mancava la prosa.** Vedi il passo **4-bis** qui sotto. | ☑ | **sì** |
| **4-bis** | **La prosa dei passi 3 e 4: «Quick Match» → «Match Practice», «Speed Round» → «Speed Match».** I nomi di arrivo sono quelli **mostrati** (`CONFIG.moduleLabels`), non gli id: in prosa si scrive il nome che lo studente legge.<br><br>**Perché è esistito questo passo:** la verifica per sottrazione dei passi 3 e 4 cercava `quick-match` **col trattino**, e le **185 occorrenze con lo spazio** le sono passate davanti. I due passi erano stati dichiarati ☑ con i nomi vecchi ancora vivi in 22 file — **nel posto che si legge davvero**, cioè commenti ed etichette dei test. È il difetto che ha fatto nascere la regola sulle quattro forme in «Come si lavora».<br><br>**FATTO E VERIFICATO il 2026-09-09.** 176 sostituzioni in 22 file. Tre controlli prima di sostituire, perché la prosa si legge: *(a)* righe storiche, nessuna (l'unica segnalata era un falso positivo); *(b)* asserzioni che **confrontano** quel testo invece di usarlo come etichetta, nessuna — delle 46 occorrenze dentro stringhe nei test, tutte sono il primo argomento di `log()`; *(c)* `data/` e `docs/inglese/it/`, niente da chiedere: l'unica occorrenza sotto `docs/inglese/it/` è storica e resta.<br><br>**Verificate anche le rinomine 1 e 2:** `srShuffle` e `flashcardLevelA` non hanno forme con lo spazio, e le uniche tracce rimaste sono la tabella dei nomi (che si riscrive al passo 6) e questo registro. Sono complete. Suite verde, 933. | ☑ | **sì** |
| **5** | `se* → storyCards*`. **Una sessione sola.**<br><br>**I sei strati, con i numeri veri (misurati il 2026-09-09):**<br>1. identificatori JS `se[A-Z]*` — **116** in `index.html`, 5 nei test (24 nomi distinti)<br>2. classi e id CSS `se-*` — **42** + 27 nei test<br>3. id DOM `speak-easy-*` — **54** + 41 nei test<br>4. i due namespace del `localStorage` (`seDeclarations:`, `seExplanationStats:`) — 9, dentro lo strato 1<br>5. `speakEasy` / `SpeakEasy` — **29** + 36 nei test + **1 chiave VIVA in `data/inglese/it/messaggi-feedback.json`** (`speakEasyCompleteMessages`, letta a `index.html:7477`)<br>6. **«Speak Easy» in prosa — 24 + 34 + 6.** ⚠️ **Questo strato NON è un `sed`:** molte di quelle righe raccontano la storia del nome tolto («il modulo non esiste più», «diceva Speak Easy a entrambi»), e cambiarle le renderebbe false. Vanno lette una per una.<br><br>**~420 occorrenze in tutto**, contro le ~283 stimate prima di misurare.<br><br>**Vale la LETTURA A** (2026-09-09): la tabella dei nomi, non il punto 3, che diceva l'opposto ed è stato corretto. `se` non è un'abbreviazione: in JavaScript **è** il nome, perché non esiste nessuna forma lunga accanto.<br><br>**FATTO E VERIFICATO il 2026-09-09.** 382 sostituzioni in un commit solo. Verifica per sottrazione pulita su cinque forme; **restano quattro occorrenze di «Speak Easy», decise una per una**: tre raccontano la storia del nome tolto (`index.html:548` e `:3569`, `tests/test_story_modules.js:4`), la quarta **asserisce che quel nome non compaia** (`tests/test_outcome_step_ids.js:375`) — rinominarla le farebbe provare un'altra cosa.<br><br>**E il controllo che nessun test fa, fatto a mano:** nessuna regola CSS orfana, nessun id collassato quando i due strati in kebab si sono fusi entrambi su `story-cards-`. Suite verde, 933. | ☑ | **sì** |
| **6** | Gli episodi, **un commit solo**: `gate → gate`, `aircraft-door → aircraft-door`; `docs/inglese/it/ → docs/inglese/it/` e `data/inglese/it/ → data/inglese/it/` (~111 riferimenti a percorsi); i file rinominati in `inglese-it-gate.md` / `inglese-it-gate.json`; **`messaggi-feedback.json` con il percorso portato in una costante** (oggi è scritto dentro la riga di `fetch`, ed è l'unico dei tre che uno spostamento di cartelle può rompere senza comparire in nessun elenco); le regole 4 e 26 di `CLAUDE.md`.<br><br>**La coda di `CLAUDE.md`, cresciuta durante la fase 1:** regole 4, 8, 26 e 30, più la **regola 40** sulla lista attività, e la tabella «I nomi in codice» riscritta al passato.<br><br>**SCRITTO il 2026-09-09.** Dieci `git mv` riconosciuti da git come rinomine (la storia resta attaccata); 119 percorsi, 149 id, la costante `FEEDBACK_MESSAGES_FILE`. `CLAUDE.md` alla versione `20260909a`.<br><br>⚠️ **Un difetto trovato dal controllo e non dalla suite:** `aircraft-door` **non è un identificatore JavaScript valido** — il trattino. Come chiave di un oggetto letterale (`EPISODES`, `CONFIG.episodes`) va fra virgolette, altrimenti la pagina non parte affatto. Trovato aprendo l'app dopo la sostituzione, non da un test.<br><br>⚠️ **Un secondo difetto, questa volta trovato dalla suite:** 16 file su 42 rossi con `ENOENT data/it/inglese-it-gate.json` — sei punti costruivano il percorso **a pezzi** (`repoPath('data','it',…)`), quindi la stringa intera non esisteva da nessuna parte e nessuna sostituzione testuale poteva vederla. È la **quinta forma** della regola sulle forme.<br><br>✅ **VERIFICATO il 2026-09-09**: suite completa `ALL FILES GREEN`, 42 file su 42, **933 asserzioni come il baseline**. | ☑ | **sì** — e qui la fase 1 confluisce in `main` |

### Fase 1-bis — la sequenza degli episodi, ed `EPISODES` che smette di essere scritto a mano

*Perché adesso: è l'unica voce il cui costo **cresce mentre aspetta**. Se l'episodio 3
nasce prima, nasce copiando quindici descrittori.*

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **7** | ✅ **FATTO il 2026-09-09: il file è nel repository** (`cc50f13`, caricato da Davide) **ed è stato letto.** `docs/inglese/it/sequenza-episodi.md` — la fonte, **la scrive Davide**. Elenco di id nell'ordine in cui si incontrano, con i raggruppamenti (A1.1, A1.2) come intestazioni **dentro lo stesso file**, così ordine e gruppo non possono contraddirsi. **NON si genera un `sequenza-episodi.json`**: l'elenco serve *durante* l'avvio, e farlo arrivare da un file renderebbe asincrono l'avvio dell'app. La fonte è il markdown, l'esecuzione è `CONFIG.episodes` aggiornato a mano — lo stesso rapporto che la regola 26 ha già stabilito fra `struttura-corso.md` e `APP_CONFIG`.<br><br>**Cosa contiene, letto:** A1.1 con cinque episodi (`benvenuto`, `numeri`, `verb-to-be`, `gate`, `aircraft-door`), A1.2 con tre, più una sezione «Da collocare» con narrativi, grammaticali, pronuncia e trappole. **Dei tredici nominati ne esistono due.**<br><br>⚠️ **`benvenuto` resta fuori dalla fase 1-bis** — la ragione sta nella riga del passo 8. | ☑ | **sì** |
| **8** | `EPISODES` nasce dalla sequenza: `dataFile` derivato dall'id invece che scritto trenta volte, `modulesById` costruito una volta sola.<br><br>**FATTO E VERIFICATO il 2026-09-09.** Nascono `episodeDataFile(id)`, `MODULE_DESCRIPTORS` (i quindici moduli scritti una volta per tutti gli episodi), `buildModulesById(id)` e `buildEpisodes(propri)`. Un episodio dichiara ora **solo ciò che è suo**: il badge e il contenuto del dialogo — `aircraft-door` è passato da 48 righe a 14.<br><br>**La prova, fatta prima del codice e passata:** l'oggetto `EPISODES` è stato estratto e valutato in Node **prima** di toccare qualunque cosa, poi riestratto dopo, e i due JSON con le chiavi ordinate sono risultati **identici carattere per carattere** — tutti i campi dei due episodi, tutti e trenta i descrittori, `segments` compreso. *Un confronto strutturale fra il prima e il dopo è l'unica forma che non può passare per fortuna.*<br><br>**Niente meccanismo di eccezione**, con il motivo nel codice: oggi nessun episodio vuole un descrittore diverso, e inventare adesso il modo di dirlo vorrebbe dire inventarlo senza un caso vero. *Aggiungerlo con un caso vero è il momento giusto, aggiungerlo per simmetria no.*<br><br>⚠️ **`segments` non era né 8 né 9: è un residuo.** Lo legge solo `buildTargetTokens`, cioè la vista `pronunciation` irraggiungibile. Resta dov'era — toglierlo avrebbe cambiato l'oggetto e reso la prova meno netta — con il commento che dice cos'è. Sparisce con quella vista, allo spacchettamento.<br><br>⚠️ **E una misura che non misurava, trovata iniettando il guasto.** La prima asserzione permanente confrontava gli **id** dei passi delle due mappe: ma gli id vengono dalla **sequenza**, non da `modulesById`. Tolto `whyWeSayIt` all'episodio 2, la riga resta in mappa con lo stesso id — `resolveEpisodeOrder` fa `Object.assign` su un descrittore assente — e il test diceva **13/13 passed su un episodio a cui mancava un modulo**. Adesso confronta la riga **come si vede**, id più categoria. *Senza il passaggio del guasto sarebbe entrata in `main` una guardia verde e vuota.* | ☑ | **sì** |
| **9** | Il contenuto torna nei file episodio: `speakerLabels` e `placeholderMap` escono da `index.html`.<br><br>**FATTO E VERIFICATO il 2026-09-09.** I due campi sono nei JSON, trascritti dalla tabella «I personaggi e le loro etichette» di ogni markdown — **non** dalla colonna «Chi» della matrice. `speakerLabel()` è passata da undici righe a una: `episode.speakerLabels[speaker] || speaker`.<br><br>**Le tre conseguenze, viste a schermo prima di scrivere il test** (e non scoperte dopo):<br>• **`dialogueSpeakers` è sparito**, quindi l'episodio 1 mostra `["Hostess al gate", "Papà", "Mamma", "Figlia", "Figlio", "Tutti"]` — le etichette dei personalizzabili non portano più il nome scelto;<br>• **l'episodio 2 mostra `["Hostess alla porta", "Papà", "Tutti"]`**;<br>• zero errori JS e **zero avvisi sui segnaposto**, cioè `placeholderMap` viene letta dal file.<br><br>**Come arrivano i campi:** `applyEpisodeDialogue(data)` li attacca all'episodio dentro `loadEpisodeData`, perché `EPISODES` si costruisce al caricamento mentre il file dati arriva dopo. È lo stesso rapporto che `slotFields` ha già con `personalizationTablesUsed`, non un meccanismo nuovo — e il commento avverte che ogni lettore gira dentro un `.then`, cosa che non si vede leggendo la funzione.<br><br>⚠️ **Prima di oggi le etichette non avevano NESSUN test** — non copertura debole: zero. Adesso il blocco `[B0]` di `test_story_modules` ne ha sei, viste fallire reintroducendo la risoluzione sul nome scelto. | ☑ | **sì**, e qui la 1-bis è chiusa |

*Risultato: aggiungere l'episodio 3 diventa **una riga nella sequenza e il suo JSON**, zero
righe di codice. Ed è anche la preparazione del punto unico che serve a Supabase.*

⚠️ **L'APP RESTA A FILM FINO A SUPABASE** (deciso il 2026-09-09): un episodio per volta,
scelto dal Pannello Admin. **Niente schermata con l'elenco degli episodi, niente sblocco.**
Non è un rimando per pigrizia, e le ragioni sono tre:

- **Per il collaudo.** Con lo sblocco, per arrivare all'episodio 4 bisognerebbe farne tre —
  e se `config` si azzera si rifanno tutti. È già successo.
- **Perché è prematuro.** Lo sblocco ha bisogno di sapere che un episodio è «finito», e
  «finito» dipende dai moduli, che sono **undici da costruire**. Scriverlo adesso significa
  scriverlo contro una mappa che cambierà.
- **Perché dopo Supabase ci saranno più profili**, quindi prove mirate invece di azzerare e
  rifare.

**La sequenza resta qui, in questa fase: è un DATO, ed `EPISODES` nasce da lì.** A slittare
è la *schermata* che la mostra, perché è **prodotto** — e la scelta dell'episodio merita il
suo giro, non deve nascere come effetto collaterale di un collaudo.

**Ne segue una regola di smistamento**, valida per tutto quello che si incontrerà: **se una
cosa serve solo quando gli episodi sono in serie, non è di questa catena — va nella
cronologia nuova.**

### Fase 2 — il collaudo

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **10** | Profilo nuovo, episodio 2 dall'inizio alla fine. Su nomi definitivi e progressi già azzerati dalla fase 1: **si collauda una volta sola**.<br><br>**FATTO il 2026-09-09**: ventidue passi su profilo nuovo, su Pages. | ☑ | **sì** |
| **11** | Le nove voci accumulate da collaudare.<br><br>**FATTO il 2026-09-09**, nello stesso giro del passo 10. | ☑ | **sì** |
| **12** | Si corregge **quello che è piccolo e locale**; il resto va in questo file e prende una fase sua, decisa a collaudo finito.<br><br>**FATTO il 2026-09-09**: i rilievi sono diventati i sei difetti C.1→C.6, scritti qui con le loro decisioni. C.6 è uscito dalla catena ed è la N.1. ⚠️ **I rilievi si scrivono qui MAN MANO, non alla fine**: un collaudo interrotto con i rilievi in testa non lascia traccia di essere avvenuto. | ☑ | **sì**, se i rilievi sono scritti |

### I cinque difetti del collaudo dell'episodio 2 (2026-09-09)

*Ventidue passi, profilo nuovo, su Pages. Venti comportamenti della scala dei colori
validati **guardandoli succedere**, non dedotti. Due cose che sembravano difetti sono
state smontate da una prova rifatta meglio, e vanno ricordate perché il metodo vale più
del caso:*

- **Il tempo scaduto non è un azzeramento secco.** Partendo da giallo, «non lo so» e
  timeout finiscono tutti e due a rosso 0 e sono indistinguibili. Rifatta **da verde**, la
  differenza è apparsa: «non lo so» → rosso, timeout → giallo. **Una prova che parte da
  giallo non può distinguere due retrocessioni**, perché sotto c'è il pavimento.
- **Il ripasso che conta va bene così.** Era stato deciso a tavolino che non dovesse
  contare; il collaudo ha mostrato il contrario — la severità arriva da un'altra parte
  (ogni sbagliata scende di un gradino) e chi si corregge subito paga comunque quel
  gradino. Se il lavoro fosse partito, avrebbe peggiorato una cosa che funzionava.
  ⚠️ **Non si trasferisce a Voice Check**, il cui ripasso ripete la stessa battuta subito
  finché non esce giusta: lì due giuste consecutive porterebbero una frase a verde nella
  stessa seduta, appena dopo averla sbagliata. È il caso che quella prova non ha
  attraversato.

*E tre dei cinque sospetti erano imprecisi: la lettura del codice li ha corretti prima che
diventassero lavoro. Vale la pena notarlo — in tutti e tre i casi la correzione ha
cambiato **cosa c'era da fare**, non solo come dirlo.*

| | Difetto e decisione | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **C.1** | **Voice Check calcola e non scrive.** Il contatore dei secondi sale, nel magazzino della mastery non compare nessuna riga. È il modulo **senza aiuti** — niente ripasso, niente ritentativo, niente opzioni fra cui scegliere — quindi il dato più affidabile che l'app produca, ed è l'unico che non conserva; quando ci sarà il mix, il modulo che sa meglio di tutti cosa non sai non parteciperà a decidere cosa ripassare.<br><br>**DECISO: deve scrivere, in una voce sua** (`voicecheck:<battuta>` e `voicecheck:<battuta>:<indice>`), per battuta **e** per parola come Voice Practice. Non è tidiness: le due varianti hanno regole diverse su quale tentativo conta (Last vs First), e sulla stessa chiave nessun lettore potrebbe sapere quale delle due ha prodotto il colore che vede.<br><br>**E la decisione che non è codice: la STRADA B — scrive solo il PRIMO tentativo.** Le stelle di Voice Check già fanno così (FirstAttemptRule): se i colori scrivessero a ogni tentativo, lo stesso modulo terrebbe due risposte diverse alla stessa domanda. Il ripasso resta e non segna niente — *serve a farti sentire come si dice subito dopo aver sbagliato: è insegnamento, non misura. Per imparare c'è Voice Practice, e quello scrive.*<br><br>⚠️ **Non è «una riga».** Il prefisso `'voicepractice:'` è scritto a mano due volte dentro il blocco: togliere il solo gate `vcVariant === 'practice'` farebbe scrivere Voice Check **dentro** le voci di Voice Practice. Servono un prefisso variabile, il gate che perde la variante **tenendo `recognizedWords.length > 0`**, e quattro punti di prosa che diventerebbero falsi (`index.html` «never touched for Voice Check», i due «tre scrittori», il testo del pannello).<br><br>*Perché la dimensione conta: «è una riga» porta a fare la strada A senza accorgersi di averla scelta, e la regola su quale tentativo conta finirebbe decisa da dove capita la parentesi graffa. Sarebbe la seconda volta dopo la regola 39.*<br><br>**FATTO E VERIFICATO il 2026-09-10**, come voce ② della fase 2-bis — dove stanno i dettagli. ⚠️ **I punti di prosa erano sei, non quattro**: l'elenco scritto qui sopra ne mancava due (`tests/test_report_mastery.js` e `tests/README.md`), trovati cercandoli invece di fidarsi dell'elenco. *È la regola 41 applicata a una lista che non era di comandi ma di nomi — e un elenco di nomi si legge e si crede di averlo applicato.* | ☑ | **sì** |
| **C.2** | **Why We Say It somma le risposte.** Una card è arrivata a «chiara 3 · non chiara 3»: **sei voti da una persona sola.** E il pannello dice di sé che «una battuta con molte risposte non chiara segnala una spiegazione da riscrivere» — cioè userebbe per decidere cosa riscrivere un numero che conta i ripensamenti. `addSeExplanationStat` somma `+1` e non tocca il contatore della risposta precedente: è quello che è scritto per fare. Che rispondere **uguale** non alzi il conto è un effetto collaterale, non una difesa — nessuna riga lo protegge.<br><br>**DECISO: tiene la risposta CORRENTE decrementando la precedente, più un contatore dei CAMBI.** Il contatore dei cambi non è un premio di consolazione: *«l'ho letta, ho creduto di aver capito, poi no»* è il profilo di una spiegazione **ambigua**, distinta da una difficile. Oggi quei sei voti nascondono quel segnale nel rumore; separati, ne fanno due.<br><br>**I dati vecchi si buttano** (strada ①). Siamo gli unici utenti e quei dati sono le prove di una sera. ⚠️ **La finestra è la stessa delle rinomine — vale finché non ci sono dati veri.** E i beta tester arriveranno **dopo** che Supabase sarà rodato: se provano prima non fanno i tester del METODO ma delle funzionalità, e allora sarebbero consulenti, non tester.<br><br>**FATTO E VERIFICATO il 2026-09-09.** Ogni voce è ora `{ corrente, cambi, chiara, nonAncora, nonChiara }`: cambiare idea **sposta** il voto invece di aggiungerne uno, e `cambi` sale solo quando la risposta è davvero diversa. Rispondere due volte la stessa cosa non muove niente — **prima era vero per caso** (il pulsante già scelto non produceva un secondo evento), adesso è una regola scritta, che è la differenza fra un comportamento e una fortuna.<br><br>**Come si buttano i dati vecchi, e perché non si migrano:** il magazzino porta un numero di forma (`STORY_CARDS_STATS_VERSIONE`), e il guard scarta tutto ciò che non ce l'ha. Migrare vorrebbe dire **indovinare** quale fosse la risposta corrente guardando quale contatore è più alto — falso appena qualcuno ha cambiato idea due volte, cioè proprio nei casi che ci interessano.<br><br>**Il pannello dice adesso due cose distinte e non le somma**: una battuta ferma su «non chiara» segnala una spiegazione **da riscrivere**, una **cambiata più volte** ne segnala una **ambigua**. ⚠️ E dichiara il proprio limite di oggi: i profili sono uno, quindi i tre contatori valgono 0 o 1 per battuta — diventano un conteggio di persone quando i profili saranno più d'uno, e il numero che dice qualcosa adesso è `cambi`.<br><br>⚠️ **Trovati e rinominati tre nomi che il passo 5 aveva mancato**: `addSeExplanationStat`, `loadSeExplanationStats`, `renderSeExplanationStatsPanel`. La verifica per sottrazione del passo 5 cercava `\bse[A-Z]`, e lì il `Se` è preceduto da una lettera minuscola — **nessun confine di parola, nessuna corrispondenza**. La forma era già nell'elenco («il nome dentro un identificatore più lungo»): non è una sesta forma, è la quarta che non è stata cercata davvero. `add` è diventato `storyCardsRecordExplanationAnswer`, perché non è più un incremento ma una registrazione di stato (regola 18). | ☑ | **sì** |
| **C.3** | **Il Blocco Ascolto diventa un componente.** Il 🔊 dentro una card bloccata di Why We Say It sembrava vivo: l'audio non partiva (la guardia funziona) ma il pulsante cambiava sotto il dito. La causa non era il pulsante: **«bloccato» non aveva un aspetto in nessun punto, perché non c'era un posto dove disegnarlo una volta sola.** Il markup era ricopiato a mano in **sette punti**, la coda del gestore del tocco in altri **cinque**; condivisa era solo `renderRateButtons`.<br><br>**FATTO E VERIFICATO il 2026-09-09.** `renderListenBlock()` e `speakListenBlock()`, la classe condivisa `.is-tap-locked`, e le due rinomine della regola 18 (`repeat-listen-btn` → `listen-block-btn`, `repeat-item-audio` → `listen-block`: portavano il prefisso di Repeat Aloud addosso a un pezzo usato da sei moduli).<br><br>**Le due varianti dello Sblocco Sequenziale ora spengono allo stesso modo — inerti, non sbiadite.** `pointer-events` e `cursor` sì, l'opacità e il resto del disegno no: Why We Say It deve restare leggibile e mostrare il titolo della regola che aspetta (regola 30), il Dialogo non ha quel bisogno. *Uguali nel comportamento, diversi nell'aspetto, perché dicono due cose diverse: stavamo per unificare due cose che sembrano uguali e non lo sono, che è l'errore opposto di quello che stavamo correggendo.*<br><br>⚠️ **Il rischio dichiarato non si è materializzato, e vale saperlo:** i quattro contenitori statici portavano **già** la classe condivisa, quindi non c'è stato nessuno spostamento di layout. Verificato comunque con gli screenshot affiancati dei sette punti (`tests/tools/screenshot_blocco_ascolto.js`, committato): sette identici o diversi solo nella parola sorteggiata, l'ottavo è la correzione. | ☑ | **sì** |
| **C.4** | **Il pulsante di casa dice «Inizia Episodio 1» anche sul 2.** Il sospetto era «il 2 non ha un badge suo»: **falso** — entrambi gli episodi hanno il loro `badge`, e mappa e personalizzazione lo mostrano giusto. Mente **un pulsante solo**, con la stringa incollata nell'HTML (`#go-episode`) e nessun codice che gliela scriva.<br><br>**DECISO: strada B — si legge `currentEpisode.badge`,** come già fanno gli altri tre punti.<br><br>**La strada A (il badge nel file dell'episodio, regola 4) è rimandata di proposito, con la ragione scritta:** *A è un lavoro sul caricamento, non sui testi, e farlo adesso significherebbe pagare una modifica strutturale per correggere una stringa in un pulsante.* Quel pulsante sta sulla schermata di casa, prima che qualunque file episodio sia stato scaricato; e il menù dell'interruttore episodio elenca **tutti** gli episodi col loro badge.<br><br>**La condizione che la fa scattare, e si riconosce guardando:** quando gli episodi saranno tanti e quel menù vorrà venti fetch all'apertura, A smette di essere un lusso. **La strada A è la N.5 della cronologia nuova**, con quella condizione.<br><br>**FATTO E VERIFICATO il 2026-09-09.** `goHome()` scrive il testo del pulsante leggendo `currentEpisode.badge`, dalla stessa fonte degli altri tre punti. **Nel markup resta il solo verbo, «Inizia»**: un testo statico che nomina un episodio è vero al massimo per uno, mentre «Inizia» è vero sempre — anche nel caso in cui quella riga non girasse.<br><br>L'asserzione nuova sta in `test_interruttore_episodio.js` e **confronta le due schermate fra loro** — il pulsante di casa contro il badge in mappa — invece che con un testo atteso scritto nel test: è il requisito vero (concordano), e un badge ricopiato lì invecchierebbe al primo episodio nuovo. Vista fallire rimettendo il difetto: *pulsante «Inizia Episodio 1» | mappa «Episodio 2»*. | ☑ | **sì** |
| **C.5** | **«Voice Practice» due volte nel contatore audio.** Il sospetto era «è il nono caso della famiglia corretta il 5 e il 7 settembre»: **falso, ed è un difetto diverso.** Quella famiglia — uno store indicizzato per **passo** letto contro una tabella indicizzata per **modulo**, che cadeva sul nome tecnico — **è chiusa**: `stepLabel()` esiste e i due soli store che la riguardano la usano. Qui `stepLabel` risolve benissimo; è la label del passo a non portare il **grado**, quindi due passi dello stesso modulo hanno lo stesso nome.<br><br>**Quanti sono: due, e uno è latente.** Il contatore audio **collide adesso** (i due Voice Practice); i salti di battuta hanno la stessa forma e **non collidono ancora**, perché i tre Dialogue compaiono una volta ciascuno. *Non si manifesterà quando si tocca quel codice: si manifesterà quando qualcuno riordina una sequenza, cioè lontano da lì.* Ovunque altro il grado c'è già accanto al nome, via `moduleTypeLabel` (mappa e intestazione di ogni modulo).<br><br>**FATTO E VERIFICATO il 2026-09-09.** Nasce `withGradeName(testo, grade)`, e la chiamano **due composizioni**: `moduleTypeLabel` (la categoria di un modulo: «Studio · Parole») e `stepLabel` (il nome di un passo nei pannelli-report: «Voice Practice · Frasi»). La regola dell'omissione — «quando il nome del grado è già contenuto in quello che precede, il grado si omette» — vive lì una volta sola invece che in tutte e due.<br><br>**Il grado si aggiunge SEMPRE, non solo quando due passi collidono**, ed è una scelta: una regola «aggiungilo se serve» farebbe dipendere il nome di un passo da cosa c'è nel **resto** della sequenza, e lo stesso passo si chiamerebbe in due modi a seconda dei vicini. In un pannello-report il grado è informazione, non rumore: dice su cosa quei secondi sono stati spesi.<br><br>**Chiusa anche la latente**, e senza lavoro in più: i due pannelli passano dalla stessa `stepLabel`.<br><br>Il commento di `stepLabel` corretto: *«da qui in poi ce n'è uno solo da guardare»* era vero per la sua famiglia e **sembrava dire che i nomi dei passi erano a posto**. Adesso dice che quella famiglia è chiusa **e** che il 2026-09-09 è successo di nuovo in una forma diversa. Principio giusto, elenco corto — la stessa cosa della regola sulle forme.<br><br>⚠️ **Notato e non corretto:** i tre Dialogue leggono «Dialogue: Repeat in Time · Dialogo», perché il loro nome è in inglese e il grado in italiano, quindi l'omissione non scatta. Un filo ridondante, e resta così: renderlo furbo vorrebbe dire far combaciare due lingue a naso, e sbaglierebbe il giorno in cui un modulo si chiama «Dialogo qualcosa» ma gira su un altro grado. | ☑ | **sì** |

| **C.6** | **Match Practice può mostrare DUE OPZIONI IDENTICHE, e conta sbagliata una risposta giusta.** La domanda era «I'm» e fra le quattro opzioni «(io) sono» compariva **due volte**: il grado B ha `I am` e `I'm`, che sono due voci diverse e la stessa parola in italiano. `buildMultipleChoiceOptions` esclude i distrattori **per id della voce** (`v.id !== item.id`) e poi li traduce: fra le due righe nessuno guarda più il risultato. **È il più grave dei difetti del collaudo perché non mostra un'etichetta sbagliata: SCRIVE UN DATO FALSO** — la voce scende di un gradino, e non esiste nessun percorso che distingua quella retrocessione da un errore vero.<br><br>**La larghezza, misurata:**<br>• **Speed Match ha lo stesso difetto** — è letteralmente la stessa funzione (`index.html:9790`), quindi i passi colpiti sono **quattro**. E lì è peggio: sotto il countdown non hai il tempo di accorgerti che due opzioni sono uguali, quindi il dato falso non lascia la traccia che ha permesso di trovarlo.<br>• **Nei dati scritti la collisione è UNA** (`I am`/`I'm`), **più una che l'uguaglianza esatta non prende**: nel grado A, «hello» → *Ciao / Salve* contro «hi» → *Ciao*. Non sono identiche, e la domanda resta impossibile da rispondere bene.<br>• **DUE in più le crea la personalizzazione, e non stanno in nessun file**: con papà = Marco e figlio = Marco, `Sono {{papa}}.` e `Sono {{figlioNome}}.` diventano la stessa frase (idem mamma/figlia con Chiara). Visto a schermo: nel grado C, **quattro voci su nove producono due sole risposte distinte**.<br>• **Solo la direzione en→it è esposta, e per una ragione strutturale**: *l'esercizio insegna una distinzione che la sua stessa risposta cancella.* `I am` e `I'm` sono due voci proprio perché in inglese sono due cose; in italiano sono una. Non è di questo episodio — **tornerà**, finché la coppia è inglese→italiano.<br>• Le cinque frasi di C identiche a battute di D **non possono incontrarsi**: il pool di un quiz è un grado solo, e nella sequenza i quiz girano su A, B, C — mai su D.<br><br>**DECISO: non un controllo automatico. Le collisioni si DICHIARANO NELLA MATRICE, e le scriviamo noi.** Nel markdown le **esclusioni**, che sono poche (`hello → tutti tranne: hi`); nel JSON gli **ammessi**, già risolti; l'app ne pesca tre a caso più quella giusta. Così il controllo si fa **una volta sola, sul target, quando si scrive la matrice**, e da lì in poi l'app legge e non può sbagliare: solo funzioni di lettura, mai di creazione a runtime.<br><br>*Perché non meccanico, ed è la scoperta della misura: nessuna regola può vedere che «Ciao» è una risposta giusta per «hello» quando l'altra opzione è «Ciao / Salve». Noi sì, perché scriviamo il contenuto. E un controllo che pesca a caso può non incontrare mai il caso brutto; una dichiarazione nella matrice non ha casualità — o c'è, o non c'è.*<br><br>⚠️ **NON si esegue in questa catena.** È diventata la **N.1** della cronologia nuova qui sotto. | ➜ N.1 | — |

**L'ordine deciso:** C.3 (tocca sei moduli e non si interrompe) → C.5 (piccolo, e chiude
anche la latente) → C.4 (una riga) → C.2 (ultimo, perché cambia forma ai dati: se qualcosa
va storto dev'essere isolato). Fermata dopo ognuno.

**Tutti e quattro sono fatti.** **C.6 non è in questo elenco**: è la più grave
delle sei, ed è anche l'unica che non si corregge qui — la sua soluzione è un cambio di
struttura del contenuto (gli ammessi dichiarati nella matrice), quindi è la N.1 della
cronologia nuova.

### Fase 2-bis — la mastery

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **13** | Le cinque righe della sezione «La mastery: dove va il dato» qui sotto: la D3, il dato sul target, Voice Check che calcola e non scrive, i colori parcheggiati, il report per grado. *Perché qui: il collaudo su profilo nuovo **è** l'esperimento che le informa.* ⚠️ Gira su uno strumento non ancora tarato: se un rosso diventa ambiguo, **si anticipa il passo 14** invece di rilanciare la suite sperando. | ☐ | **sì**, riga per riga |

#### Le cinque voci della 2-bis, decise il 2026-09-10

| | Voce | Stato |
|---|---|---|
| **①** | **Il dato si registra sul target** (Voice Practice). Già fatto: la riga per la voce intera convive con quelle per parola. | ☑ |
| **②** | **Voice Check scrive, strada B** — solo il primo tentativo, in voci sue (`voicecheck:<battuta>` e `voicecheck:<battuta>:<indice>`). Vedi C.1. **Va DOPO la ③**, e non è un ordine di comodo: nascendo dentro il magazzino in sospeso prende il gesto gratis, invece di essere il nono punto da convertire. **FATTO E VERIFICATO il 2026-09-10** — suite verde, 1008 asserzioni in 44 file. ⬇︎ | ☑ |
| **③** | **I colori si travasano al pulsante.** ⬇︎ **FATTO E VERIFICATO il 2026-09-10** — suite verde, 998 asserzioni in 44 file. | ☑ |
| **④** | **I colori parcheggiati.** *Chiude come voce, con una nota accanto al mix:* le battute del grado D prendono un colore **solo** da Voice Practice e Voice Check; i tre moduli Dialogo non ne producono nessuno, perché la loro è un'autovalutazione sull'intero dialogo, non una misura per voce. Non è un buco da riempire: è la ragione per cui l'esito del Dialogo vive in `moduleOutcome` e non nella mastery. | ☐ |
| **⑤** | **Il report per grado.** È prodotto, non strumento: più avanti. | ☐ |
| **D3** | **Sospesa** — vedi N.4: torna quando esisterà un colore sopra i compartimenti. | ⛔ |

**③ — Il gesto sceglie cosa si salva.** Fino al 2026-09-10 otto moduli scrivevano
la mastery **a ogni risposta**, e il Dialogo scriveva l'esito **all'autovalutazione**.
Chi rispondeva a tre domande e usciva da «← Mappa» si portava dietro tre colori per
sempre, senza aver dichiarato niente e senza che il modulo risultasse fatto.

| Gesto | Cosa si salva |
|---|---|
| **«Ho finito»** | esito + voci + completato |
| **«Esci e riprendi dopo»** | solo le risposte già dichiarate (solo Why We Say It) |
| **«← Mappa»** | niente |

*Perché la seconda uscita esiste solo lì, ed è una differenza voluta: Match Practice
dura venticinque secondi, Why We Say It può durare giorni. Non conta che i moduli si
comportino uguale — conta che nessuno faccia una cosa che non sappiamo.*

**Come è fatto.** `pendingMastery` è il magazzino in sospeso; `recordPendingMastery`
sostituisce `applyMasteryResult` + `saveMastery` nei tre punti che scrivevano
(`recordMultipleChoiceResult`, `fcRecordResult`, il blocco di Voice Practice in
`vcEvaluate`); `commitPendingMastery` è il travaso, chiamato da `completeModule`, la
coda condivisa che ha sostituito **sette** copie della sequenza esito → completamento →
mappa; `clearPendingMastery` vive in `stopAllModuleActivity` (regola 21), non nel
«← Mappa» di un modulo. Il Dialogo separa cosa **mostra** da cosa **scrive**: suono,
Schermata Finale e sottotitolo restano all'autovalutazione, l'esito aspetta il pulsante.

⚠️ **Why We Say It aveva DUE magazzini con due regole diverse, e solo uno rispettava il
gesto.** Le dichiarazioni erano già attaccate al pulsante; i conteggi editoriali
(`storyCardsRecordExplanationAnswer`) si scrivevano a ogni risposta. Adesso passano da
una coda che il gesto travasa — **una lista in ordine, non l'ultima risposta**: quel
magazzino conta anche i **cambi di idea**, e riassumere il giro in un valore solo
perderebbe proprio quel segnale.

⚠️ **Un effetto voluto e non ovvio, scritto nel codice accanto a
`hasStartedEpisodeModules`:** l'avviso «hai già cominciato» di Personalizza vede meno
gente, perché chi è uscito da «← Mappa» non ha più nessuna voce nel magazzino. Non è un
effetto da compensare — è la stessa regola applicata a un posto in più. *Prima quell'avviso
mentiva: diceva «hai già cominciato» a chi aveva fatto tre click e se n'era andato.*

⚠️ **La nota che il prossimo non può dedurre, e che sta accanto a `pendingMastery`:**
oggi nessun modulo mostra i colori **mentre gira**, quindi un oggetto in memoria basta.
Se domani un modulo li disegnasse durante l'esercizio, dovrà leggere **il pending e il
magazzino**, non solo il magazzino.

⚠️ **E la conseguenza sui test, che non era prevista e va saputa:** in Flash Card una
risposta sbagliata **non può restare tale fino alla fine** — la carta torna nel giro di
ripasso. `test_scala_colori.js` leggeva la scala dopo una risposta sola; adesso porta il
modulo in fondo su un mazzo ridotto a **una carta** e, per le due prove di
retrocessione, legge lo stato dopo due risposte con l'attesa calcolata sulla sequenza
intera. Il limite è dichiarato in testa al file.

**Due nomi del passo 5 chiusi qui dentro**: `saveSeDeclarations` →
`saveStoryCardsDeclarations`, `loadSeDeclarations` → `loadStoryCardsDeclarations`.

**② — Voice Check scrive.** Era il modulo **senza aiuti** — niente ritentativo,
niente opzioni fra cui scegliere — cioè il segnale più pulito che l'app produca,
ed era l'unico che non conservava niente: `vcEvaluate` calcolava `pairResults` e
le stelle per entrambe le varianti, e la scrittura stava dentro
`if (vcVariant === 'practice')`.

Adesso scrivono tutte e due, **ognuna nelle proprie voci**: `vcMasteryPrefix()`
dà `'voicepractice:'` o `'voicecheck:'`. Le chiavi sono separate perché le due
varianti hanno **regole diverse su quale tentativo conta** — sulla stessa chiave
nessun lettore saprebbe quale delle due ha prodotto il colore che vede.

**Strada B**: Voice Check scrive solo se `attemptNum === 1`, come già fanno le
sue stelle (FirstAttemptRule). Il ripasso resta e non segna niente.

⚠️ **La conseguenza si dichiara e non si compensa:** una registrazione **muta**
al primo tentativo lascia quella battuta **senza colore**, perché il secondo
tentativo non è più il primo (`recognizedWords.length > 0` resta dov'era). È
voluto: una voce che manca è assenza di dato (regola 39), e lì non abbiamo
sentito niente. Aspettare «il primo tentativo *sentito*» seguirebbe un «primo»
diverso da quello delle stelle — lo stesso difetto che le chiavi separate
esistono per evitare.

⚠️ **E il difetto che questo ha reso visibile è registrato a parte**, non come
nota a margine: in quel caso **il badge segna 0%**, cioè *«hai sbagliato tutto»*
mentre la verità è *«non ti abbiamo sentito»*. Il badge non tace: **mente.** Vedi
la sezione «La mastery: dove va il dato».

⚠️ **Sei punti di prosa, non quattro.** Cercati invece di fidarsi dell'elenco
scritto in C.1: oltre ai quattro previsti c'erano `tests/test_report_mastery.js`
(due righe) e `tests/README.md`. **I due punti datati di questo file NON sono
stati toccati**: dicono «i tre scrittori» dentro righe che registrano com'era il
mondo quel giorno, e la memoria di un numero non è il numero.

⚠️ **E un'asserzione che non distingueva niente, presa in flagrante.** La riga
che si chiamava «STRADA B» guardava il solo `level`, ed è rimasta **verde anche
rimettendo la strada A**: con `promotionStreak` a 2 la risposta giusta del
ripasso porta `{ rosso, 0 }` a `{ rosso, 1 }` — il livello non si muove. Si
guarda la **striscia**, che è l'unico segno che il ripasso ha scritto. *Famiglia
⓪-bis: un'asserzione che passa quando dovrebbe fallire. È stata trovata solo
perché il guasto è stato iniettato davvero, non ragionato.* Nello stesso giro ne
è stata chiusa un'altra della stessa forma, in Voice Practice: `[].every()` è
vero, quindi «ogni battuta ha le sue parole accanto» era verde proprio quando
non era stato scritto niente.

### Fase 3 — la taratura dello strumento

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **14a** | **Misurare le famiglie prima di convertire, e generare il censimento.** **FATTO E VERIFICATO il 2026-09-10** — suite verde, 1018 asserzioni in 45 file. ⬇︎ i numeri veri sono qui sotto. | ☑ | **sì** |
| **14b** | **Una forma per famiglia**, e le chiamate che la usano. ⬇︎ pianificato sui numeri del 14a, non sulla stima.<br><br>⚠️ **OGNI FAMIGLIA VUOLE UN GIRO DI LETTURA PRIMA DELLA CONVERSIONE, e il numero della famiglia è DOVE GUARDARE, non quanto lavoro c'è** (aggiunto l'11 settembre, dopo il primo giro). Il censimento classifica per **cosa si legge**, non per **come viene usato**: vede `.hidden` e scrive «una schermata che compare o sparisce», e ha ragione sul cosa — ma non può vedere se quella lettura serve a dire *«è comparsa»* o *«NON è comparsa»*, che sono l'opposto. Sulla famiglia ② erano **9 punti su 29**: cinque negative (l'attesa È la misura), una vacua, e tre che la conversione avrebbe **svuotato** — uno stato già vero prima dell'attesa, che convertito tornerebbe al primo istante.<br><br>⚠️ **Una conversione sbagliata non lascia un rosso: lascia un verde che non prova più niente — e il conto scende, cioè il numero migliora proprio quando il lavoro fa danno.** Da qui il terzo secchio del contatore e il marcatore `// ATTESA-LEGITTIMA: <motivo>` scritto nel sito, che lo strumento raccoglie da solo.<br><br>**② FATTA il 2026-09-11** — `attendiVisibile` / `attendiNascosto` in `tests/attese.js`, 21 chiamate in 13 file, 8 marcate legittime, e la vacua di `test_batch16` corretta.<br><br>**① ③ ④ FATTE lo stesso giorno.** ① `attendiAbilitato`/`attendiDisabilitato`/`attendiClasse`; ③ `attendiCheParla`/`attendiTono` e la quinta categoria; ④ nessuna funzione nuova — l'approdo era `#view-map.is-active`.<br><br>⚠️ **IL CRITERIO CHE NE ESCE, e vale per le famiglie che restano: l'effetto su cui aspetti non può essere quello che l'asserzione legge, o diventa vera per costruzione.** Sta in testa a `tests/attese.js`.<br><br>**186 → 56 guardie da convertire** (i numeri intermedi della giornata erano gonfiati da un difetto dello strumento: vedi «14b ④»). | ◐ | **sì**, una famiglia per volta |
| **15** | I valori ricopiati nei test. ⚠️ **Il numero era SBAGLIATO: diceva «quattro valori, ~1 ora», sono risultate 39 righe in 10 file.** I quattro siti nominati esistevano tutti, ma erano *quattro casi notati*, mai un censimento — la stessa storia delle «19 attese di test_batch19» che erano 7 e delle 141 attese che erano 186.<br><br>⚠️ **E otto delle 39 erano state scritte quattro giorni prima, chiudendo la famiglia ③ del 14b** (`attendiTono(page, [1046, 1318, 1568], 3)`): **un passo della catena può CRESCERE mentre se ne chiude un altro.** È la seconda volta in una settimana — il 14b aveva prodotto sei guardie nuove da due file nati il giorno prima.<br><br>> **RICONTARE PRIMA DI PARTIRE non è prudenza: è l'unico modo di sapere cosa si sta per fare.**<br><br>**FATTO il 2026-09-15.** Censimento generato: 84 candidati su 52 righe → 9 falsi positivi, **4 requisiti che restano**, **39 righe di copie convertite**. Restano 8 righe: i 4 requisiti, 3 **fixture** e 1 falso positivo. | ☑ | **sì** |
| **16** | Le voci di pulizia. ⚠️ **RICONTATE PRIMA DI PARTIRE, e cinque numeri su sei erano sbagliati** (il triage del 15 settembre). L'elenco dichiarava: `view-pronunciation`, il ramo `'check'` di `openAttemptPopup`, `tests/legacy/` (6 file), `tests/debug/` (6 file), `levels.X.label`, «i quattro test con funzioni quasi identiche». Misurato: `legacy/` = **5 `.js` + README**, `debug/` = **9 `.js` + README**, il ramo `'check'` **era già morto** (la firma è `(wasCorrect, onRetry, onNext)`, e i `'check'` rimasti in `index.html` sono tutti vivi: il nome dell'icona e `voiceVariant`), e i «quattro test» erano **28**.<br><br>⚠️ **E la misura giusta non era quella: la domanda non è QUANTE COPIE, è QUANTE VERSIONI DIVERSE.** Sono due misure diverse, e **solo la seconda dice se c'è un difetto**. Contate per contenuto: `openModule` **23 copie / 1 variante**, `bootAsUser` **26 / 14**, `mockInit` **28 / 20**. Ventitré copie identiche sono un'unificazione meccanica; ventotto copie in venti versioni sono venti decisioni diverse che si sono separate da sole, e unificarle è **scegliere quale vince** — cioè il caso in cui «un helper condiviso indebolisce un'asserzione e lascia i file verdi che provano meno di prima» smette di essere un rischio e diventa il lavoro. *Una conta di copie avrebbe detto «77 duplicazioni» e avrebbe fatto partire tutte e tre insieme.*<br><br>**FATTI il 2026-09-15 (punti 1-5):** ² tolta dall'elenco perché già morta; ⁵ il commento falso su `levels.X.label` corretto; ³⁴ `legacy/` e `debug/` cancellate (2004 righe); ⁶ unificato **solo `openModule`** — `bootAsUser` e `mockInit` **escono dal passo** e diventano una decisione loro, perché 14 e 20 varianti non sono pulizia. ¹ `view-pronunciation` **fermata al triage**, registrata come passo suo dopo il 25 (sotto).<br><br>**VERIFICATO il 2026-09-15:** suite **verde su 48 file**, conteggio **1097 contro 1096 (+1)** — il caso `[F]` nuovo. ⚠️ **E il diff del baseline è la prova che lo spostamento era davvero meccanico: una riga sola, `test_conta_attese.js` 15→16.** Nessuno degli altri 47 file ha perso o guadagnato un'asserzione — se unificare `openModule` avesse cambiato cosa provano i 23 file, si vedrebbe lì.<br><br>*(**I due `if` in `vcEvaluate` sono usciti da questo elenco l'11 settembre**: non sono più una voce di pulizia — la ² li ha resi due regole diverse, e quello che resta lì non è una ridondanza ma un **dato falso**. Sono confluiti nella riga sullo 0% su registrazione muta, in «La mastery: dove va il dato».)* *(**I due `if` in `vcEvaluate` sono usciti da questo elenco l'11 settembre**: non sono più una voce di pulizia — la ② li ha resi due regole diverse, e quello che resta lì non è una ridondanza ma un **dato falso**. Sono confluiti nella riga sullo 0% su registrazione muta, in «La mastery: dove va il dato».)* *(NON la divergenza `off/seen`: muore da sola nel passo 20. NON `test_speakeasy.result.txt`: verificato, non esiste.)* | ◐ | **sì**, voce per voce |
| **17** | ⚠️ **NON SI FA COME PASSO — chiuso il 2026-09-15, e la decisione viene dai numeri del suo stesso triage.** Dichiarava tre casi («i dodici di `attemptRule`», il testo falso in `renderMasteryPanel`, il commento morto su `CONFIG.flashcard` a `index.html:6707`) e ~1 ora. **Tutti e tre caduti al riconteggio**, e la superficie vera è **6569 righe di commento in 66 file, il 25% del codice**.<br><br>**La ragione originale era: «un commento falso spostato in un file nuovo nasce autorevole, quindi va corretto PRIMA». Non regge**, perché lo spacchettamento non copia i commenti alla cieca: estraendo un pezzo si legge quello che si sposta, con il contesto davanti e su un pezzo per volta. Leggere 6569 righe adesso vorrebbe dire **leggerle due volte**.<br><br>**La lettura dei commenti diventa quindi una RIGA DELLO SPACCHETTAMENTO** (fase 4): ogni pezzo estratto si legge, e i commenti che porta con sé si verificano allora. *Non è un rinvio: è spostarlo dove costa la metà e rende il doppio.*<br><br>⚠️ **E il solo caso noto di questa classe — il ⑤ del passo 16 — è stato trovato di PASSAGGIO, correggendo altro. È esattamente il modo in cui questa classe si trova**, ed è la stessa ragione per cui il passo non serve: *(gli esiti del triage stanno sotto, in «I commenti: due setacci costruiti e due prove negative» — valgono più delle correzioni che non faremo).* | ☒ | — |


#### Il risultato del 14a — 2026-09-10

**Il passo 14 come era scritto non esisteva più.** Diceva «le 19 attese fisse di
`test_batch19`»: erano diventate **7** (il passo 0a-bis ne ha riscritte molte, e
il file è sceso da 28 attese a 17). E il problema vero non era in quel file.

| | |
|---|---|
| Attese a tempo in tutta la suite | **480** |
| Di queste, **guardie** (il verde dipende da quel numero) | **180** |
| Navigazione (se è corta il test si rompe aspettando, non passa) | 300 |
| Quante ne dichiarava `ATTESE-FISSE.md` scritto a mano | 141 |

⚠️ **E il censimento era morto senza che nessuno lo sapesse.** Andando a leggere
le sue 141 righe nel codice di oggi: **140 numeri di riga su 141 erano
sbagliati**, 4 indicavano righe che non esistono più, e ne mancavano decine
dello stesso tipo (`test_batch7.js` ne dichiarava 3 e ne ha 4, `test_batch9.js`
ne dichiarava 2 e ne ha 3). *Avevamo pianificato la fase 3 su un documento
morto, e l'unico modo di accorgersene era andare a leggere le righe invece di
fidarsi del conto.*

**Da qui: `ATTESE-FISSE.md` non si scrive più a mano — lo genera
`tests/tools/conta-attese.js`**, che identifica ogni punto con **l'asserzione
che protegge** e non col numero di riga. Una riga si sposta a ogni commit;
l'etichetta di un'asserzione no, e se cambia è perché qualcuno l'ha cambiata di
proposito. Lo strumento ha il suo test (`tests/test_conta_attese.js`), per la
ragione di `conta-asserzioni.js`: una misura che si guasta non lo dice.

#### Le famiglie, e la forma che ognuna può riusare

*Raggruppare per file dice chi ha il problema; raggruppare per **cosa aspettano**
dice quante forme servono a chiuderlo. **Sono undici famiglie per 180 punti**, e
per nove di esse una forma verde nella suite **esiste già.***

| Cosa si aspetta | Quante | Forma verde già in casa |
|---|---|---|
| un pulsante o una classe che cambia stato | **52** | `waitForFunction` su `disabled`/`classList` — 8 usi |
| un suono o la voce | **29** | l'attesa su `speechSynthesis.speaking` / `__playedTones` — 11 usi, nata a `test_batch5.js` Job1 |
| una schermata che compare o sparisce | **28** | `waitForSelector({ state: 'visible' \| 'hidden' })` — 73 usi |
| una scrittura nel `localStorage` | **18** | `waitForFunction` sullo store — 5 usi, e `rispondiECompleta` in `test_scala_colori.js` |
| *altro* | **18** | ⚠️ da guardare a mano: è il residuo della classificazione, non una famiglia |
| un testo che si riempie | **16** | **`attendiSottotitoloEsito`** (`tests/attese.js`) — la forma nata il 2026-09-10 |
| un valore di configurazione o di dati | 5 | `waitForFunction` su `window.APP_CONFIG` |
| uno stile calcolato | 5 | `waitForFunction` su `getComputedStyle` |
| una misura di geometria | 3 | *nessuna: le tre vanno guardate a mano* |
| un elenco di elementi che si ridisegna | 3 | `waitForFunction` sul conteggio — il modello di `test_match_practice_nonloso.js` |
| la console (asserzione negativa) | 3 | **nessuna, e non serve**: le asserzioni negative sono già esentate per deroga dichiarata — verificare che *non* sia successo niente richiede di aspettare un tempo |

⚠️ **Rimisurato l'11 settembre: le guardie sono 186, e le famiglie si sono
mosse** — *una schermata che compare o sparisce* 28 → **30**, *altro* 18 → **21**,
*un testo che si riempie* 16 → **17**. La tabella qui sopra resta com'era perché è
la misura **del 14a**, datata; i numeri con cui si pianifica il 14b sono quelli
rigenerati. Il perché sta poco sotto, in «E il dato che cambia il 14b».

**Cosa vuol dire per il 14b.** Non sono 180 lavori: sono **nove forme**, di cui
sei già scritte e verdi, più due gruppi piccoli da guardare a mano (*altro* e la
geometria, 21 punti in tutto). La forma si scrive una volta in `tests/attese.js`
e le chiamate la usano — come è appena successo con le cinque corse del
sottotitolo: quaranta righe più cinque chiamate.

⚠️ **Le 7 di `test_batch19` non si fanno prima**: sono nelle famiglie qui sopra,
e farle a parte vorrebbe dire scriverle due volte, una adesso a mano e una dopo
con la forma.

⚠️ **Il limite del numero, dichiarato**: 180 viene da un'euristica sul testo
(«fra l'attesa e il `log` non c'è nient'altro»), verificata a mano su
`test_batch19` — 17 punti su 17 — e a campione su `test_batch7` e `test_batch9`.
Dice **quanto è largo il problema e dove sta**: l'elenco si legge, non si esegue.
*Prima di oggi il numero era 141 e nessuno sapeva che fosse falso; adesso è 180
e sappiamo esattamente con che regola è stato ottenuto.*

### Fase delle stringhe — quando si vuole, purché intera

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **18-B** | ⚠️ **LA MISURA CHE CAMBIA LA FORMA DEL GIRO B, fatta il 2026-09-15 prima di dichiararlo.** La domanda era: al primo avvio la pagina ha già titolo, sfondo e struttura (e allora aspettare è invisibile) oppure è bianca (e 31 ms di bianco si notano)? **Nessuna delle due.** A `DOMContentLoaded` l'onboarding è **già completo**: sfondo `rgb(242,244,238)`, titolo di pagina, 9 elementi, e tutto il testo — *«Base Inglese / Come ti chiami? / Niente password… / Il tuo nome / Inizia»*. **Ma tutti e cinque quei testi stanno nel markup (righe 3375-3381), cioè sono esattamente quelli che il giro B sposterebbe.**<br><br>Quindi la finestra non sarebbe bianca: sarebbe una **card impaginata con dentro cinque campi vuoti** — badge vuoto, titolo vuoto, paragrafo vuoto, campo vuoto, pulsante vuoto. ⚠️ **Ed è peggio del bianco, non meglio:** una pagina bianca si legge come «sta ancora caricando», una schermata impaginata senza parole si legge come **rotta**. E l'onboarding è la prima cosa che uno studente vede, quindi è il caso peggiore dei due possibili.<br><br>*Non è un argomento contro il giro B: è il pezzo in più che la decisione aveva, e adesso ha un numero e una fotografia invece di un'ipotesi.* | ☐ | **sì**, prima di partire |
| **18** | Le stringhe italiane dal codice a `istruzioni-moduli.json`. ⚠️ **RICONTATO, e il «93» era il numero di un'altra domanda.** Le fasce vere di `index.html`, che vanno scritte perché le ho sbagliate **tre volte**: `CFG [7,781]`, `CSS [785,3365]`, `MARKUP [3367,4337]`, `JS [4338,11114]`, `MORTA [10698,11114]`. Censimento: **37 messaggi nel JS vivo, 36 nel markup** (senza commenti HTML) — fuori `APP_CONFIG` (14), Pannello Admin (10), vista morta (8).<br><br>**Due giri, e l'asse non è dove sta il testo ma QUANDO viene scritto:** i testi **su richiesta** (cache già calda, rischio zero) e quelli **al boot** (markup + `renderChoiceBox`/`renderSummaryScreen`, che creano un modo nuovo di fallire). Non è «il passo a metà»: il divieto è sulle due sorgenti per la stessa cosa, e ogni giro chiude una categoria intera.<br><br>**GIRO A FATTO il 2026-09-15**: 34 testi, `uiText()`/`uiTextWith()`, `loadModuleInstructions()` aggiunto al `Promise.all` di `openModuleFromMap`, `tests/test_testi_interfaccia.js` (14 asserzioni, visto fallire 10/14 sul guasto vero). Una sola asserzione convertita e una lasciata scritta con la sua ragione.<br><br>**GIRO B FATTO il 2026-09-15**, e il triage per vista l'ha rimpicciolito di tre volte: fuori l'**onboarding** (4) e la **home** (3), che sono la stessa categoria — `boot()` manda a `goHome()` chiunque abbia un nome, quindi la home è la prima cosa che vede chi torna, **a ogni avvio dopo il primo**; fuori la vista morta (9) e il Pannello Admin (3, che la mia attribuzione per vista aveva contato dentro `view-error`). Restava l'**intro condivisa**, e la misura giusta era di nuovo quella del passo 16: non trenta stringhe, **due frasi in dieci copie** — ora due chiavi. Più i tre siti JS che il giro A aveva mancato. ⚠️ **Ha una decisione in più, e adesso ha un numero invece di un'ipotesi:** la finestra `DOMContentLoaded` → JSON pronto è **31 ms di mediana in locale** (17-43 su dieci giri), che **non è un microtask** — e quello è il pavimento, non la misura: su Pages è un round-trip, e dal container **non si può misurare** (il proxy blocca `github.io`). La risposta resta «non mostrare finché non c'è», ma va progettata, non data per trascurabile. | ◐ | **NO** durante; sì prima e dopo |

## ⚠️ NIENTE FRAMEWORK — decisione presa il 2026-09-15

**Valutati e scartati: React, Vite, Tailwind e simili.** Non erano mai stati
valutati — l'app è nata così e ci si è andati dietro — quindi la domanda è
stata posta prima di spendere venti passi a dividere un file.

**Cosa risolverebbero, onestamente: tutti e quattro i mali di oggi.** React
attacca gli handler al montaggio (i 103 listener spariscono come categoria),
non usa id globali (i `ref` sono locali), Vite dà code-splitting e consegna a
pezzi **gratis** — cioè i passi 21-bis/ter/quater diventerebbero configurazione
invece che lavoro. *Se la domanda fosse solo «qual è la forma tecnicamente
migliore», la risposta sarebbe sì.*

**LA DECISIONE È RESTARE, e i tre argomenti sono questi:**

1. **Il sequenziamento: si riscriverebbe la difesa mentre si cambia la cosa che
   difende.** I 49 file di test raggiungono il DOM **per id**, e React
   cambierebbe struttura e id: le 1118 asserzioni sopravvivono come
   *intenzione*, i selettori no. In quelle settimane la suite non
   proteggerebbe niente — ed è l'unica difesa che questo progetto ha.
2. **La tassa del build, che da solo e per sempre non assorbe nessuno.** Oggi
   `git push` **è** il deploy: nessuna dipendenza, nessun `node_modules`,
   nessun lockfile, nessuna versione maggiore che rompe. Con un bundler
   arrivano un build che può fallire, dipendenze che invecchiano, e un React
   che cambia maggiore ogni paio d'anni.
3. **Gli store NON sono un argomento per migrare.** Capacitor incarta una
   cartella web qualunque, **anche un singolo file HTML senza build**: la porta
   degli store resta aperta in entrambi i casi. *Questo toglie l'argomento più
   forte a favore, ed è il motivo per cui la decisione è netta invece che
   sofferta.*

**E la frase che chiude, perché è il rapporto vero fra le due strade:**

> **Fare la fase 4 non è un'alternativa alla migrazione: è il prerequisito che
> la renderebbe possibile.**

*Oggi migrare vorrebbe dire riscrivere 11.000 righe indivise. Dopo la fase 4
vorrebbe dire tradurre sedici pezzi già separati, uno per volta, con fermate
sicure in mezzo — che è l'unico modo in cui una persona sola può farlo. Un
modulo che si registra, con il suo `apri` / `pulisci` / `aggancia`, è già la
forma di un componente.*

**Il metodo sopravviverebbe comunque**, e va detto perché toglie un argomento
che verrebbe usato in futuro: regole, catena, registri, il modo di lavorare —
niente di tutto questo dipende dal framework. Non è una ragione per restare.

**LA CONDIZIONE CHE RIAPRIREBBE LA DECISIONE, e ne basta una:**

> **Se entrasse una seconda persona sul progetto.**

*Le convenzioni di un framework sono soprattutto un modo di non doversi
spiegare. Con una persona sola quel guadagno è zero e il costo del build è
tutto suo; con due, il conto si ribalta.* Nessun'altra condizione riapre questa
decisione — né la dimensione del file, né il numero di moduli, né gli store.

### ⚠️ LA FASE 4 È STATA RIFATTA IL 2026-09-15 — leggi questo prima della tabella

**Il piano della fase 4 era stato scritto il 10 settembre. Il 15 è stato
RIFATTO, non confermato**, e la ragione è il motivo per cui questa sezione
esiste: fra le due date sono cambiate tre cose che quel piano non poteva
conoscere — il **vincolo del login** (deciso l'11), il **caricamento a
richiesta** che ne discende, e il **passo 18**, che ha spostato i testi fuori
dal codice e cambiato *quando* un modulo diventa pronto.

*Il rischio era preciso e va nominato perché si ripresenterà: aprire questo
file, trovare un piano scritto, e confermarlo. **Un piano scritto si legge come
una decisione presa, anche quando è solo una decisione VECCHIA.***

#### Le misure che l'hanno rifatto (2026-09-15, a codice fermo)

⚠️ **Il primo numero che ho prodotto era il numero di un'altra domanda, e
va scritto perché è la trappola più frequente di questa catena.** La chiusura
transitiva delle chiamate dal percorso pre-login dà **45 funzioni su 291, il
10%**. Vero, e inutile: misura cosa viene **chiamato**. La domanda del login è
cosa viene **caricato**, e la risposta è il 100%.

| misura | valore |
|---|---|
| funzioni dichiarate nel JS | **291** (3247 righe dentro funzioni) |
| righe a livello di modulo, che girano a tempo di parsing | **1291** |
| `addEventListener` a livello di modulo | **103**, sugli elementi di **tutte e tredici le viste** |
| funzioni che nominano **3+ famiglie** di moduli | **1 su 291** |
| funzioni che ne nominano **2+** | **3 su 291** |
| chiamanti di ogni `open<Modulo>` | **esattamente 2**: il dispatcher, e un punto dentro sé stesso |

**Il codice è già separato per modulo.** Le uniche due strozzature sono:

- **`stopAllModuleActivity`** (19 righe) nomina **sei famiglie** — e `showView`
  la chiama, quindi `boot()` ci passa. *Per disegnare la schermata di login
  bisogna aver caricato una funzione che nomina le interiora di cinque moduli.*
  ⚠️ **Non è un difetto: è la regola 21 fatta bene.** Il punto unico di
  pulizia funziona per riferimento diretto, e il riferimento diretto è
  incompatibile con «questo pezzo non è ancora caricato».
- **`openModuleByKind`** (20 righe), otto `else if` che risolvono ogni modulo
  per **identificatore libero**.

#### La risposta alla domanda tecnica — sì, ma non gratis

*«Gli script separati funzionano perché l'ordine di caricamento È la struttura.
Col caricamento a richiesta quella forma regge ancora?»*

**Regge.** Un file che arriva tardi si attacca da sé allo spazio dei nomi, ed è
la forma giusta — la scelta contro i moduli ES resta valida per la stessa
ragione di prima.

⚠️ **Ma il precedente che sembrava confermarlo carica DATI, non CODICE.**
`loadModuleInstructions()` dentro `openModuleFromMap` prova la metà della
**sequenza**: l'app sa aspettare qualcosa prima di aprire un modulo, e il giro
B del passo 18 l'ha confermato fino a includere lo stato «spento finché non
c'è». **Non prova la metà della RAGGIUNGIBILITÀ**: un `fetch` restituisce un
valore dentro una Promise; uno script non caricato **non ha un identificatore**.

#### Le tre decisioni prese da chi guida il progetto, il 2026-09-15

| | Decisione |
|---|---|
| **i 103 listener** | **entrano dentro l'`open` del proprio modulo.** È il più grande dei tre lavori, e non era nominato da nessuna parte prima di questa misura. |
| **il markup** | **resta dov'è** — non viaggia coi moduli. Ma `views`, che oggi raccoglie i tredici `getElementById` all'avvio, **deve tollerare l'arrivo tardivo**. |
| **`getUserName()`** | **NON diventa asincrono.** È chiamato da 45 funzioni sincrone, e renderlo asincrono sarebbe la modifica più invasiva delle tre. Il login vero dovrà risolvere l'identità **prima** di consegnare il resto, non durante. |

#### ⚠️ Il limite della misura, dichiarato

**L'assegnazione delle funzioni alle famiglie è stata fatta per PREFISSO DEL
NOME, e ne ha sbagliate parecchie**: `renderStoryCards`, `setVcState`,
`renderVoiceCoachSentence` sono finite fra le «non assegnate». Quindi il
numero che ne esce — *«1337 righe da strato»* — **è gonfiato**: dentro c'è
sia codice condiviso vero sia codice di modulo non riconosciuto.

*Quel numero NON va usato per pianificare.* I numeri su cui questo piano si
regge sono gli altri, contati direttamente: **le due strozzature e i 103
listener.** Se serve il peso vero degli strati, va rifatto con
un'assegnazione che parte dai **chiamanti** invece che dal nome.

### Fase 4 — lo spacchettamento

*Il meccanismo è deciso: **script separati in ordine, con uno spazio dei nomi condiviso.**
I moduli ES sono migliori in astratto e incompatibili con l'unica cosa da garantire — con
loro la prima estrazione sarebbe anche l'ultima fermata possibile.*

*Cosa si sta facendo davvero: non «dividere un file grande». `APP_CONFIG` è già un blocco
`<script>` a sé; il resto sono ~6.400 righe dentro **un IIFE solo**, dove niente è
raggiungibile da fuori.*

*Cosa ci si guadagna: **non** «gira meno codice» (un test Playwright caricherà comunque la
pagina intera), ma **si sa cosa si è toccato** — la domanda della regola 15 diventa
`git diff --name-only` invece di richiedere la conoscenza di seimila righe. E nasce una
classe di test che oggi non può esistere: 39 test su 41 aprono un browser perché
`applyMasteryResult`, `percentageBucket`, `episodeGrade`, `moduleStepId` sono funzioni pure
irraggiungibili da Node.*

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **19** | `people` e `places` fuori da `APP_CONFIG` → `data/inglese/it/`, **prima** di estrarre `APP_CONFIG`, così quello che si estrae è già solo manopole. ⚠️ **Non è uno spostamento di file: è una conversione ad asincrono**, e se il file non arriva lo studente deve vedere la schermata d'errore (regola 35).<br><br>**FATTO il 2026-09-15, come ①+④ dei cinque punti di `docs/inglese/it/tabelle-personalizzazione.md`.** `PERSONALIZATION_TABLES_FILE`, `loadPersonalizationTables()`, `resolveSlotTable(ref, episodeData, tables)`, `ensureEpisodeSlotFields` con un `Promise.all` a due. **Contenuto invariato di proposito**: sei destinazioni, id vecchi, traducibilità dedotta — il contenuto vero è il passo dopo, perché cambiarlo qui darebbe due sospettati a ogni rosso.<br><br>⚠️ **DUE PREMESSE DI QUESTA RIGA ERANO SBAGLIATE, e si vedono solo misurando.**<br>• *«`slotOptions` e `resolveSlotValue` leggono in modo sincrono mentre disegnano»* — **no**: leggono `episode.slotFields`, già risolto. Il lettore dei valori è **uno solo**, `resolveSlotTable`, e girava **già dentro un `.then()`**. La conversione vera è stata molto più piccola del previsto.<br>• E il lettore che nessuno aveva previsto è **il Pannello Admin**, che li raggiunge con `Object.keys(window.APP_CONFIG)` — **sincrono e raggiungibile PRIMA del login** con `?config`. Misurato guidando l'app: `people`×1, `places`×1 sulla schermata di onboarding.<br><br>**④ non è stata una migrazione, ed è meglio così.** Il markdown la descrive come `marco → papa-marco`, ma senza il contenuto nuovo gli id non cambiano: quello che ① rompeva davvero erano gli **override salvati dal Pannello Admin**, che sarebbero diventati inerti in silenzio. Il loader li riapplica sopra il file — **zero perdita, zero codice di migrazione**.<br><br>✅ **VERIFICATO**: suite completa e conteggio (vedi la riga sotto). | ☑ | **sì** |
| **20** | **Primo commit dello spacchettamento:** `APP_CONFIG` esce in un file suo **e nello stesso commit** i suoi lettori lo seguono. Continuano a leggere **staticamente**, solo un file diverso e molto più piccolo: firma invariata, **zero punti di chiamata toccati**.<br><br>**FATTO il 2026-09-15.** `app/config.js`, 689 righe, caricato con un `<script src>` **bloccante** — niente `defer`, niente `async`, niente modulo: viene eseguito prima dello script in linea, quindi `APP_CONFIG` è in memoria come prima. **Non è una conversione ad asincrono come il 19.**<br><br>**La cartella `app/` nasce qui, ed è la convenzione per la fase 4**: i ~20 file estratti stanno lì, la radice resta `index.html` + `data/` + `docs/` + `tests/` + `tools/`.<br><br>⚠️ **I LETTORI ERANO TRE, NON DUE**, e il terzo l'ha creato il passo precedente: `test_tabelle_personalizzazione.js` (blocco `[A]`) ritagliava `index.html` fra `window.APP_CONFIG` e `applyConfigOverrides` — due marcatori che questo passo porta via, e `indexOf` avrebbe risposto `-1` **senza fallire**, consegnando uno slice a caso su cui le asserzioni sarebbero passate per il motivo sbagliato. *Un piano di un giorno, già incompleto, perché il file che deve seguire `APP_CONFIG` l'ha prodotto il passo prima.*<br><br>**E il «zero dei 79 punti di chiamata»:** oggi i punti sono **162 `CONFIG.` + 27 `APP_CONFIG`**. Il 79 non è un numero che si possa ricostruire ed è invecchiato come l'«undici minuti» — *ma la conclusione regge, e per un motivo che non dipende dal conteggio:* l'alias `var CONFIG = window.APP_CONFIG` non cambia, quindi i punti toccati sono **zero qualunque sia il loro numero**.<br><br>✅ **VERIFICATO**: suite completa e conteggio. | ☑ | **sì** |
| **21** | Lo spazio dei nomi: si crea **l'oggetto e la regola**. Non sposta codice, cambia **come il codice si raggiunge**.<br><br>**FATTO il 2026-09-16.** `app/spazio.js`: `window.BI = window.BI \|\| {}`, le due collezioni (`BI.pulizie`, `BI.moduli`) e le due funzioni di registrazione.<br><br>**⚠️ L'ATTACCO TARDIVO NON È UNA FUNZIONE IN PIÙ: È IL `\|\| {}`.** Un file che arriva prima lo crea, uno che arriva dopo lo trova — nessuno dei due deve sapere in che ordine sta nel documento. `window.BI = {}` lo romperebbe **in silenzio**, e il sintomo arriverebbe al 21-ter.<br><br>**E la cosa che rende questo un meccanismo invece di una convenzione:** le collezioni le crea questo file, e ci si entra **solo dalle due funzioni**. Se ogni file scrivesse `BI.pulizie = BI.pulizie \|\| []`, un refuso (`BI.pulizia`) creerebbe una seconda collezione in silenzio — modulo che non si pulisce, zero errori. *Una funzione scritta male esplode; una proprietà scritta male no.* È la regola 12 applicata qui.<br><br>**`BI` e non `APP`** perché `APP_CONFIG` accanto a `APP.config` sono due cose diverse che si leggono uguali — la famiglia `sr`/`srShuffle`, già pagata. **E `APP_CONFIG` resta fuori**, dichiarato nel file perché non sembri un'incoerenza da sistemare.<br><br>✅ **VERIFICATO**: suite completa, conteggio, e Pages a mano. | ☑ | **sì** — ed è una fermata sicura, vedi l'invariante corretta |

#### ⚠️ LA SUITE PARALLELA È VENUTA PRIMA DEL 19, ED È QUELLO CHE HA RESO PRATICABILE LA FASE 4

**Fra un mese questa sembrerà una deviazione. Non lo era: era il conto.**

La fase 4 sono ~20 estrazioni, e ognuna vuole una corsa completa.

| | una corsa | venti corse |
|---|---|---|
| **in locale**, sequenziale (fino al 2026-09-15) | 17,2 min | **5,7 ore** |
| **in locale**, parallela a 4 | 5,4 min | **1,8 ore** |
| **in CI**, sequenziale | 17,5 min | **5,8 ore** |
| **in CI**, parallela a 2 | 9,2 min | **3,0 ore** |

*I due conti si sommano: ogni estrazione vuole una corsa locale **e** una di CI.*

*Quasi quattro ore di sola attesa, tolte prima di cominciare.* E non è comodità:
un passo che costa mezz'ora di attesa si fa; uno che ne costa diciassette
minuti si fa **e si rifa'** quando il primo tentativo non convince — che è
esattamente quello che serve in venti estrazioni con fermate sicure in mezzo.

⚠️ **E il guadagno secondario vale quanto il primo:** quattro browser insieme
rallentano ogni test, cioè **avvicinano il container al runner della CI** — la
famiglia di difetti della regola 19 che il container, da solo, nasconde.

*Misurato prima di scegliere: 1033 s sequenziale, 532 a due, 326 a quattro, 279
a sei. Tre corse, 147 esecuzioni di file, zero rossi.*

#### ⚠️ E IL NUMERO CHE HO SBAGLIATO NEL RIPORTARE QUESTA MISURA

**Non l'ho sbagliato misurando. L'ho sbagliato LEGGENDOLO da un documento.**

Ho scritto che la CI «prima stava sugli ~11 minuti, ora 9,3», e ne ho tratto
che *il runner ha meno core del container*. Le cinque corse vere:

| corsa | commit | durata |
|---|---|---|
| #128 | `fee11e6` | 17m 24s |
| #129 | `e60d7d5` | 17m 32s |
| #130 | `738553b` | 17m 26s |
| #131 | `c30dace` | 17m 27s |
| **#132** | **`35876ed`** | **9m 11s** |

**Il guadagno è 1,90×. In locale a N=2 avevo misurato 1,94×. Il runner scala
come il container**, e la conclusione che avevo scritto era falsa.

**Da dove veniva l'undici**, perché è la parte che serve: da `CLAUDE.md`,
regola 38, dove stava scritto **«undici minuti»**. Non l'avevo inventato e non
avevo letto il job invece della corsa: **l'avevo letto da un documento invece
che da GitHub.** Ed era esatto — il 2026-09-07, quando la suite aveva **42 file
e 933 asserzioni**. Oggi ne ha 49 e 1118.

> **UN NUMERO SCRITTO IN UN DOCUMENTO NON CRESCE CON LA COSA CHE MISURA.**
> Resta esatto per la domanda di allora e diventa falso per quella di adesso
> **senza cambiare una lettera** — cioè senza dare a nessuno un'occasione di
> accorgersene.

È la stessa famiglia del 127 e del TTFB a zero: *il numero era giusto; era il
numero di un'altra domanda.* Ma con un aggravante che le altre due non avevano
— **quelle le ho misurate male, questa non l'ho misurata affatto.** Avevo
davanti l'elenco delle corse, che si aggiorna da solo, e ho citato una riga di
prosa, che no.

*Corretto in tre punti il 2026-09-15: la regola 38 di `CLAUDE.md`, che adesso
porta i due tempi **con la data** e dice di rimisurarli invece di citarli;
l'invariante «venti suite invece di un macello» qui sotto; e il conto della
fase 4 qui sopra.* **Il conto migliora: 5,8 ore di CI diventano 3,0.**

#### ⚠️ E UNA COSA CHE QUESTI NUMERI NON DICONO, benché sembri di sì

Le due corse sequenziali sono **quasi identiche**: 1033 s in locale, ~1047 s in
CI. Verrebbe da concluderne che il container **non** è più veloce del runner, e
quindi che la regola 19 è smentita.

**Non lo è, e il perché è la parte utile.** Il tempo totale di una suite è fatto
quasi tutto di **attese fisse** — caricamenti di pagina, timeout dichiarati,
`attendiTono` — che durano uguale ovunque. La regola 19 non vive lì: vive nella
**finestra di gara** fra un'asserzione e un effetto asincrono, che è di
millisecondi e non sposta il totale di un secondo. Due macchine possono
impiegare lo stesso tempo e perdere gare diverse.

*Quindi il totale uguale non è una prova né a favore né contro: è una misura di
un'altra cosa. La prova della regola 19 resta quella del 2026-09-10 — sei verdi
in locale e due rosse su due in CI, stesso commit.* **Non toccare la 19 sulla
base di questi due numeri.**

#### ⚠️ E L'ORDINE SBAGLIATO, registrato perché il risultato è stato innocuo

Il 2026-09-15 ho scritto in `decisioni.md` **mentre la suite girava** (regola 36),
e ho verificato **dopo** che nessun test lo legge. Il precedente del `.gitignore`
aveva già stabilito la forma: **misurare prima**.

Il risultato è stato innocuo — solo citazioni dentro commenti, nessun test legge
quel file. **E l'innocuità è esattamente il motivo per cui va scritto qui.**

> **SE QUELLA CORSA FOSSE STATA CONTAMINATA, DA QUEL CONTROLLO NON LO SAPREI.**
> Un controllo fatto dopo non dice «non è successo»: dice «non l'ho visto».

*Un risultato innocuo non rende giusto il metodo — lo rende invisibile, che è
peggio: la volta dopo la tentazione arriva già assolta.*

#### N=4 in CI — da valutare, e NON adesso

Se il runner scala come il container, **N=4 in CI diventa una domanda vera**, e
si risponde con una misura come si è fatto in locale — non copiando il 4.

⚠️ **Ma non nel giro del passo 19.** Il 19 è il primo passo dello
spacchettamento, ed è il giro in cui un rosso deve avere **un sospettato solo**.
Alzare la CI nello stesso momento ne darebbe due. *Si prova dopo il 19, in un
giro suo, quando sappiamo che il meccanismo regge.*

**La corsa di collaudo, 2026-09-15:** 49 file, 4 in parallelo, **ALL FILES
GREEN**, **1118 asserzioni** come il baseline. E la terza verifica, quella che
l'ordine del log non si rompa: i 49 blocchi ristampati escono nella **stessa
sequenza dichiarata in `FILES`**, confrontata riga per riga con `diff` — zero
differenze. *Serviva perche' una suite piu' corta con un log illeggibile
avrebbe rotto ogni strumento che ci sta sopra.*

#### ⚠️ I TRE PASSI NUOVI, e perché stanno PRIMA degli strati

Nascono dalla misura del 15 settembre e non esistevano nel piano vecchio.
**Vanno prima del passo 22**, perché finché le due strozzature esistono
**nessuno strato basso è consegnabile separatamente** — si estrarrebbe uno
strato che, per essere caricato, tira dentro tutto.

| | Passo | Quanto | Fermata sicura dopo? |
|---|---|---|---|
| **21-bis** | **`stopAllModuleActivity` si inverte in REGISTRAZIONE.** *Chi non è caricato non ha niente da pulire, e questo diventa vero per costruzione invece che per attenzione.* La regola 21 non cambia — resta il punto unico — cambia **come** ci arriva.<br><br>**FATTO il 2026-09-16.** `BI` prende i suoi primi cinque utenti.<br><br>⚠️ **NON ERANO «6 CHIAMATE»: ERANO DIECI ISTRUZIONI, SETTE DI UN MODULO E TRE NO.** Le sette coprono cinque famiglie (Dialogo, Voice, Speed Match ×3 in `srPulizia`, Flash Card, Why We Say It) e si registrano. **Le tre condivise restano nominate** — `synth.cancel()`, `closeAttemptPopup()`, `clearPendingMastery()` — perché non appartengono a nessun modulo e non potranno mai «non essere caricate»: registrarle vorrebbe dire inventare un registrante fittizio, cioè una cerimonia invece di un meccanismo. *Il motivo è scritto accanto, altrimenti sembra una conversione lasciata a metà e il prossimo la «finisce».*<br><br>**⚠️ L'ORDINE NON CONTA, E LA PROTEZIONE NON STA NEL CICLO.** Il sospetto era concreto e documentato — il countdown del Dialogo parte dentro l'`onend` dell'audio — ed è stato **smontato misurando**: l'`onend` arriva in modo asincrono, cioè dopo tutta la pulizia, in qualunque ordine. A neutralizzarlo è **`moduleEpoch++`**, che `showView` fa *prima*. *La cosa da non rompere non è l'ordine dentro la funzione: è che quella riga resti dov'è* — e sta scritto accanto al ciclo, perché un array di registrazioni fa credere che la difesa sia lì dentro.<br><br>**⚠️ E IL `try/catch` È STATO DECISO SU UNA MISURA, non su un'intuizione.** Prima, una pulizia che esplodeva non fermava le altre cinque: fermava la **navigazione**. L'eccezione risale a `showView`, punto unico di ogni spostamento — misurato: l'app diventa inutilizzabile **dalla prima navigazione**, lo studente non entra nemmeno nel modulo. Adesso girano tutte e si naviga sempre; il fallimento va in console **e fa diventare rossa un'asserzione**, che è la metà che rende accettabile il catch: senza, avremmo scambiato un guasto rumoroso con uno silenzioso.<br><br>✅ **VERIFICATO**: suite, conteggio, CI, Pages a mano, e la verifica per sottrazione con otto zeri scritti. | ☑ | **sì** |
| **21-ter** | **`openModuleByKind` risolve dallo spazio dei nomi e diventa asincrono.** È il punto in cui il caricamento a richiesta si aggancia, e l'unico posto dove un modulo viene nominato da fuori.<br><br>**FATTO il 2026-09-16.** **14 `kind` distinti per 8 funzioni di apertura** — non «otto rami, otto registrazioni»: `openStoryCards` ne serve due, `openDialogo` tre, `openFlashcard` uno.<br><br>⚠️ **«DIVENTA ASINCRONO» COSTA QUASI NIENTE: L'ATTESA ESISTE GIÀ.** `openModuleByKind` ha **un solo chiamante**, dentro il `Promise.all` di `openModuleFromMap`, che ha già il suo `.catch` verso `showLoadError`. Torna una promessa e il `.then` la restituisce: nessuno di nuovo deve aspettare.<br><br>⚠️ **CAMBIO DI COMPORTAMENTO VOLUTO: il `kind` diventa la chiave unica.** Quattro rami su otto guardavano una PROPRIETÀ del descrittore (`storyProfile`, `voiceVariant`, `dialogoProfile`, `flashcardDirection`), quindi un modulo con `dialogoProfile` e un `kind` sconosciuto **si apriva lo stesso**. Adesso va alla schermata d'errore — il difetto degli episodi corti chiuso una seconda volta. *Se un giorno un episodio smette di aprirsi, è la prima riga da leggere.*<br><br>**Il caso più diverso: `flashcard`, un solo `kind` per DUE descrittori** — e **la guardia sui duplicati scritta al passo 21 ha fermato l'errore prima che una riga fosse scritta**, che è esattamente il suo mestiere.<br><br>**`showLoadError`: un messaggio per lo studente, due cause in console.** Lui non può fare niente di diverso; chi indaga ha due strade opposte. La seconda causa («il file non è arrivato») **non esiste ancora** — `BI.moduliCaricatiAlBoot` è `true` — e la riga è scritta adesso perché il giorno che nasce nessuno si ricorderebbe di aggiungerla.<br><br>**`openCustomize` resta senza parametro, e la misura dice perché:** è già registrata come listener di `#edit-custom`, quindi su quella strada riceverebbe un `Event`. Una firma uniforme sarebbe una firma **bugiarda**.<br><br>✅ **VERIFICATO**: suite, conteggio, CI, e la verifica per sottrazione con **dodici zeri scritti**. | ☑ | **sì** |
| **21-quater** | **I listener entrano nell'`open` del proprio modulo.** ⚠️ **Il lavoro più grande dei tre e il più rischioso**: entrambi i guasti sono **silenziosi**.<br><br>**IL TEST È FATTO, il 2026-09-16, e la prima conversione non è cominciata.** `test_listener_una_volta.js` + `tests/BASELINE-LISTENER.txt` + `tests/listener-census.js` + `tests/tools/scrivi-baseline-listener.js`.<br><br>**I numeri, misurati:** **113** `addEventListener` nell'IIFE, di cui **103 con un `getElementById`** — *il 103 del piano si ricostruisce, ero io a sbagliare quando l'ho dato per irricostruibile*. Di questi **79 sono di un modulo**, 24 condivisi. Per famiglia: Voice 14, Personalizza 13, Match 10, Flash Card 10, Speed Match 9, Dialogo 8, storyCards 8, Repeat Aloud 7.<br><br>⚠️ **`open` VIENE CHIAMATA PIÙ VOLTE: 3 col gesto più banale** (apri → mappa → riapri). La guardia «già attaccati» è **obbligatoria**. *Misurato avvolgendo `BI.moduli` — possibile solo grazie al 21-ter.* E le sette `renderSummaryScreen` girano **una volta sola**, quindi gli elementi non cambiano identità: **basta un flag per modulo**, non un sistema di aggancio/sgancio.<br><br>**LA REGOLA CHE DECIDE TUTTI E 79: un listener appartiene al modulo NELLA CUI VISTA VIVE, non a quello che apre.** Il caso che la rende necessaria è `#edit-custom` («Modifica i nomi della storia»): apre Personalizza ma **vive in `view-pronunciation`**. È un pulsante *verso* Personalizza, come una riga della mappa — **resta fra i condivisi**, altrimenti diventa muto per chi non ha ancora aperto Personalizza in quella sessione. **È l'unico pulsante di modulo fuori dalla propria vista**, quindi l'unico buco possibile.<br><br>**Si comincia da Speed Match**, il più piccolo — non perché sia semplice, ma perché è il passo dove un errore non dà errore. **Un modulo per volta, suite in mezzo: otto fermate sicure.**<br><br>**① SPEED MATCH — FATTO il 2026-09-16.** I 9 listener dentro `openSpeedMatch`, dietro **`BI.unaVoltaSola('speedMatch', …)`**, guardia condivisa in `app/spazio.js` — una sola per tutti e otto i giri, perché otto flag sono otto occasioni di scriverne uno diverso e il settimo non fallisce, semplicemente non protegge. **Baseline dei listener invariato**, come deve essere. **Falsificata togliendo la guardia: `1 → 4` su tutti e nove, `2 → 5` sul completamento.**<br><br>⚠️ **E un limite dichiarato invece di lasciato credere:** i listener stanno *prima* di `showView`, ma **oggi quella posizione non è verificabile** — fra le due non c'è niente di asincrono, quindi spostarli dopo non cambierebbe nulla di osservabile e nessun test può cadere per quello. È una precauzione **per il passo 22**, dove `open` potrà dover aspettare il file del modulo. *Una precauzione dichiarata vale più di una regola che sembra protetta da un test e non lo è.* <br><br>**② DIALOGO — FATTO il 2026-09-16.** Gli 8 listener dentro `openDialogo`, dietro `BI.unaVoltaSola('dialogo', …)`.<br><br>⚠️ **LA REGOLA CHE VALE PER TUTTI E OTTO, scritta qui al secondo giro perché è qui che diventa evidente: LA CHIAVE DELLA GUARDIA È IL BLOCCO, CIOÈ LA FUNZIONE `open`, NON IL `kind`.** `openDialogo` serve tre profili ma il blocco è uno. Misurato mettendo la chiave sul kind: ogni listener va **da 1 a 2 a 3** — il tocco su una bolla partirebbe tre volte, senza nessun errore.<br><br>**E riguarda SEI famiglie su otto**, non solo il Dialogo: `openStoryCards`, `openVoiceCoach`, `openMatch`, `openSpeedMatch` e `openFlashcard` servono due `kind` ciascuna. *Su Flash Card la chiave sul kind funzionerebbe **per caso** — due descrittori, un kind solo — ed è la forma in cui una regola sbagliata sopravvive.* La regola per esteso sta accanto a `BI.unaVoltaSola` in `app/spazio.js`.<br><br>⚠️ **E il ① aveva già questa proprietà senza che me ne accorgessi:** `openSpeedMatch` serve due direzioni, la chiave `'speedMatch'` era giusta, **ma il test apriva una direzione sola.** Il buco è stato chiuso prima di convertire il Dialogo, col blocco `[E]` che apre **tutti** i kind di ogni famiglia — sei asserzioni nuove. *Senza, la regola sarebbe stata un commento verificato da nessuno.* <br><br>**③ WHY WE SAY IT / MEET THE STORY — FATTO il 2026-09-16.** Gli 8 listener dentro `openStoryCards`, chiave `'storyCards'` (due `kind`, un blocco). **Non aveva niente di diverso dal ②, e va detto così invece di cercare una differenza per averne una:** i listener sembravano sparsi su 122 righe, ma misurando — quali righe stanno *al livello del blocco* e non sono un `addEventListener` — sono risultate **zero**: le distanze erano i corpi degli handler, non altro codice in mezzo. *Il controllo è costato un comando ed è l'unica cosa che distingue «ho guardato» da «somigliava».* <br><br>**④ REPEAT ALOUD — FATTO il 2026-09-16.** I **7** listener dentro `openRepeatAloud`, chiave `'repeatAloud'`.<br><br>⚠️ **E `speak-btn` NON È FRA LORO, per una ragione che ne ha chiuse tre.** Lo avevo annunciato come «il listener fuori dal baseline, da guardare a mano»: non è quello. `#speak-btn` vive in **`view-pronunciation`**, non in `view-repeat-aloud` — e quella vista **non è raggiungibile da nessun punto dell'app**, perché `startPronunciationExercise` non ha un solo chiamante (misurato: una sola occorrenza in tutto il file, la sua definizione).<br><br>**I tre «casi speciali» annunciati erano uno solo, visto tre volte:** `speakBtn`, `micBtn` e `#edit-custom` vivono tutti in quella schermata. *Quindi `micBtn` non sarà una trappola all'⑧, e la motivazione di `#edit-custom` — «un pulsante verso Personalizza» — era falsa e va corretta: quei quattro listener non sono di nessun modulo **perché vivono in una schermata che nessun modulo apre**.*<br><br>⚠️ **E LA COSA CHE SERVE A CHI TOGLIERÀ QUELLA SCHERMATA, dopo il passo 25:** con lei escono **4 listener** (`speak-btn`, `mic-btn`, `edit-custom`, `back-home`) e **3 voci di `tests/BASELINE-LISTENER.txt`** — più `back-home`, che va verificato a parte perché il nome compare anche altrove. **Chi la toglie deve saperlo prima**, o il baseline non tornerà e sembrerà un errore del suo lavoro invece che la conseguenza attesa. *Il baseline si riscrive con `node tests/tools/scrivi-baseline-listener.js`, ed è l'unica occasione legittima in tutta questa serie.*<br><br>**⑤ MATCH — FATTO il 2026-09-16.** I **10** listener dentro `openMatch`, chiave `'match'` (due `kind`, un blocco). **Non aveva niente di diverso, e lo dico invece di cercare una differenza:** blocco contiguo — le righe al livello del blocco sono **20**, cioè i 10 `addEventListener` e i loro 10 `});`, **zero altro**; 10 righe sorgente contro le 10 voci del baseline; **zero** listener della famiglia in un'altra forma (`querySelector`, delega) — le tre uscite del grep erano `speed-match-*`, cioè il ①.<br><br>**Falsificato nelle due direzioni:** guardia tolta → `[C]` `1 → 4` su tutti e dieci (`2 → 5` sul completamento) **e** `[E]` `1 → 2` aprendo il secondo kind; un listener tolto → `[A]`, `[B]` e `[C]` lo prendono tutti e tre. Baseline **intatto**.<br><br>⚠️ **E LA LEZIONE DEL CAMPIONE, scritta accanto a `[C]` e non solo qui** (era l'unica richiesta esplicita del giro): *un elenco scritto a mano dentro un test è un campione, e un campione sceglie chi non guardare* — chi lo scrive prende i casi che ha già montati, cioè il criterio della regola 42 al contrario. **Derivarlo da `FAMIGLIE` è la stessa mossa del baseline: la fonte decide, non chi scrive il test** — e una famiglia nuova entra nel giro da sola, senza che chi la aggiunge sappia che quel blocco esiste.<br><br>*Trovato di passaggio e vale la pena saperlo: la prima falsificazione della guardia era sbagliata — avevo lasciato `(function () { … });`, una funzione mai chiamata invece di una guardia tolta. Il test è diventato rosso lo stesso, ma su `[A]` con «osservato 0», che è **il guasto opposto**. Il verde/rosso non basta: va letto QUALE asserzione cade.* <br><br>**⑥ FLASH CARD — FERMATO PRIMA DI CONVERTIRE, il 2026-09-16, e la conversione NON è stata fatta.** Misurando chi ha quanti `kind` per scrivere la riga di categoria richiesta, sono usciti **due numeri falsi scritti da me**, e non su Flash Card: su tutta la serie.<br><br>**Il conto vero, dalle 14 `BI.registraModulo` del file:** `openDialogo` 3 · `openVoiceCoach`, `openStoryCards`, `openSpeedMatch`, `openMatch` 2 ciascuna · **`openFlashcard`, `openRepeatAloud`, `openCustomize` UNA**. Somma 14, torna.<br><br>| Dove | Cosa dice | Cosa è vero |<br>|---|---|---|<br>| `app/spazio.js` | «**SEI** `open` su otto servono più di un `kind`», e nomina `openFlashcard` fra loro | sono **CINQUE**; `openFlashcard` ne serve **uno** |<br>| `tests/test_listener_una_volta.js`, commento di `[E]` | la stessa frase, copiata | idem |<br>| `[E]`, riga di log | «flashcard: aprire i suoi **2 kind** non duplica il blocco» | sono **2 PASSI** (`flashcardAEngIta`, `flashcardAItaEng`) che condividono **1 kind** |<br><br>⚠️ **Quindi `[E]` verifica CINQUE famiglie e ne dichiara SEI**, ed è esattamente la lezione del campione scritta un'ora prima accanto a `[C]`: `COPPIE` è un **elenco scritto a mano dentro un test**, e per una voce su sei non contiene quello che il nome dice. *Il verde di `[E]` su flashcard non è falso — apre due descrittori e nessuno si duplica — ma non prova la CHIAVE, perché con `'flashcard'` e con `module.kind` il valore è lo stesso identico.*<br><br>**E la categoria richiesta cambia di conseguenza: i casi in cui la chiave sbagliata passa verde sono TRE, non due** — Flash Card, Repeat Aloud **e Personalizza**. Personalizza era già fermato a parte perché fuori da `[C]` e da `[E]`: adesso si sa che è fuori **anche** da questa prova.<br><br>**Condizione per ripartire:** la riga di categoria va scritta su tre famiglie, i due numeri falsi vanno corretti in `app/spazio.js` e nel commento di `[E]`, e va deciso se `COPPIE` resta un elenco a mano o si deriva dalle registrazioni — *la lezione del campione dice la seconda, ma è un cambio al test e non al codice, e va deciso, non dedotto.* **La conversione di Flash Card riparte dopo.**<br><br>**⑥-zero — LA DERIVAZIONE, FATTA il 2026-09-16, commit suo, `index.html` NON toccato.** Scelta (b): `COPPIE` sparisce. `[E]` prende la coppia passo↔kind da `MODULE_DESCRIPTORS` (`descrittori()`) e il raggruppamento per blocco da **`BI.moduli` dell'app viva** (`bloccheDiKind()`) — cioè dal registro vero su cui gira `openModuleByKind`, non da una lettura del sorgente.<br><br>⚠️ **E LA COINCIDENZA CHE AVEVA RESO IL DIFETTO INVISIBILE, misurata: per TREDICI descrittori su quindici il nome del passo e il nome del kind sono la STESSA STRINGA.** Solo i due Flash Card li separano. *Un elenco scritto a mano sembra giusto tredici volte su quindici — e la quattordicesima non somiglia a un errore.*<br><br>**Nasce `[F]`, e non è un extra: è la difesa del difetto NUOVO che la derivazione introduce.** Una derivazione che torna **meno** del dovuto fa saltare famiglie **in silenzio** — se `MODULE_DESCRIPTORS` si spostasse, ogni famiglia risulterebbe a kind singolo e `[E]` non aprirebbe niente: zero asserzioni, zero rossi, **un verde più grande di quello di prima**. `[F]` incrocia le due fonti indipendenti e congela il conto. E **gira PRIMA di `[E]`**: si controlla lo strumento, poi lo si usa.<br><br>**Asserzioni 24 → 26**, non scese: `[E]` passa da 6 a 5 (la sesta era falsa) e `[F]` ne porta 3.<br><br>**Falsificato tre volte, e per ognuna l'asserzione attesa è stata scritta PRIMA** (⓪-nonies): ① un `kind` rinominato in un descrittore → `[F]` riga 1 rossa, **e la guardia ⓪-septies ha fatto FALLIRE `[E]` invece di farlo morire** su `stepsBefore(undefined)`; ② un secondo kind registrato su `openFlashcard` → `[F]` righe 2 e 3, `5→6` e `3→2`; ③ guardia tolta su storyCards (col `()` finale, stavolta verificato) → `[E]` `1→2` sul secondo kind e `[C]` `1→4`.<br><br>**Corretti i due numeri falsi** in `app/spazio.js` e nel commento di `[E]`: le `open` con più di un kind sono **CINQUE**. Accanto ci va **la categoria, su tre famiglie e non su Flash Card**: *su una famiglia a kind singolo, o con un kind solo per più descrittori, la chiave sbagliata passa verde — il verde non prova la chiave, la prova la regola.* Sono `openFlashcard`, `openRepeatAloud`, `openCustomize`. **Su cinque la chiave la protegge un test; su tre solo quella riga** — e `[F]` è l'unico avviso che arriverà se una delle tre prendesse un secondo kind.<br><br>**⑥ FLASH CARD — FATTO il 2026-09-16.** I **10** listener dentro `openFlashcard`, chiave `'flashcard'`. **Sono 10 su NOVE elementi**: `fc-card` porta `click` **e** `keydown`, ed è **l'unico elemento di modulo del censimento con due TIPI di evento** (gli altri quattro casi sono condivisi). Non cambia niente per la conversione — la guardia è sul blocco — ma chi conta «un listener per pulsante» qui trova nove pulsanti e dieci righe di baseline, e sta scritto accanto al segnaposto.<br><br>**Blocco contiguo:** fra le righe a livello di blocco, **zero istruzioni** che non siano un `addEventListener` (solo i 10 `addEventListener`, 8 chiusure — due sono a una riga sola — e 12 righe di commento, che viaggiano col blocco).<br><br>**TRE falsificazioni, con l'asserzione attesa scritta prima:** ① guardia tolta e blocco **eseguito** (il `()` verificato col grep prima di lanciare) → `[C]` `1 → 4` su tutti e dieci, `2 → 5` sul completamento; ② `fc-card` `keydown` tolto → `[A]` «osservato 0», `[B]`, `[C]`; ③ **la chiave sul `module.kind`** → **NIENTE cade, 26/26 verde**, ed era l'esito atteso.<br><br>⚠️ **E la terza è stata fatta apposta sapendo che non morde, perché un verde non spiegato è la cosa che fra sei mesi fa «semplificare» la chiave.** Il verde è stato **spiegato con una misura, non con un ragionamento**: i due descrittori `flashcardAEngIta` e `flashcardAItaEng` portano entrambi `kind: 'flashcard'`, cioè **la stessa identica stringa della chiave giusta** — quindi non esiste corsa che possa distinguerle. *«Il test resta verde» e «la chiave è protetta» sono due affermazioni diverse, e la seconda non segue dalla prima.* La riga sta accanto alla guardia, dove la legge chi la toccherà.<br><br>**⑦-zero — LA COPERTURA, FATTA il 2026-09-17, commit suo, `index.html` NON toccato.** Personalizza era l'unica delle otto il cui blocco, dopo la conversione, **non sarebbe stato protetto da niente**: `[A]` apre una volta sola, `[C]` la escludeva, `[E]` guarda solo chi ha più kind, e la falsificazione della chiave non morde su un kind solo.<br><br>**E la ragione dell'esclusione non era «[C] non può coprirla»: era un CAMPO CON DUE SIGNIFICATI.** `tornaAllaMappa` rispondeva a due domande — «qual è il pulsante ← Mappa» (per Personalizza: **nessuno**, ed è giusto, categoria Inizio, regola 17) e «come torno alla mappa per riaprire» (**`start-episode`**). Il `null` era la risposta giusta alla prima e sbagliata alla seconda, e il lettore che serviva era la seconda. **Scritto come famiglia ⓪-decies** in `tests/ERRORI-INGOIATI.md`, coi due casi misurati: questo e la coppia passo/kind del ⑥-zero.<br><br>**Fatto:** campo nuovo `uscitaVersoMappa` in `FAMIGLIE` — uguale a `tornaAllaMappa` per sei famiglie, `start-episode` per Personalizza; `tornaAllaMappa` **resta e resta `null`**, perché non si inventa un pulsante che non c'è. `[C]` deriva da lì e passa da **7 a 8 famiglie**; anche `[E]` legge il campo nuovo, così il campo sovraccarico non ha più lettori. `nuovaPagina` congeda anche l'intro di Personalizza — **misurato che serve**: senza, alla prima apertura `#start-episode` non è visibile; e **misurato che non cambia i conti**, i tredici restano a 1.<br><br>**Asserzioni 26 → 28.**<br><br>⚠️ **FALSIFICATO NELLE DUE DIREZIONI, e la seconda è quella che prova che la copertura SERVIVA** (regola 32): un listener spostato dentro `openCustomize` **senza guardia** → con la forma nuova `[C] personalizza` va **`1 → 4`**; con la forma vecchia lo **stesso identico guasto** resta **verde, 26/26**. *Non «il test sa morire»: il guasto realistico che la vecchia non reggeva e la nuova sì.*<br><br>**Il costo è scritto accanto al campo, non solo detto:** `start-episode` non è un «torna indietro» — **completa il modulo** e chiama `ensureEpisodeSlotFields`, asincrona, con un `.catch` che apre la schermata d'errore. È l'unica delle otto in cui tornare alla mappa ha un effetto collaterale.<br><br>**Corretto anche `app/spazio.js`**, dove avevo scritto che le tre famiglie a kind singolo sono tutte «la stessa stringa»: **falso per Personalizza** (`personalizza` ≠ `personalizzazione`). Là la chiave sbagliata funziona per **sufficienza** (un kind solo), non per **coincidenza**. Il verde non prova la chiave in nessuno dei tre casi, ma chi legge deve sapere quale sta guardando — e sulla terza una «semplificazione» al kind cambierebbe **valore**, non solo forma.<br><br>**Guardato prima di spezzare (⓪-quinquies): i due raggruppamenti che il ⑦ dividerà — il terzetto `switch-user`/`back-home`/`customize-back-home` a riga 4215 e la coppia `start-episode`/`map-back-home` a 6540 — NON hanno nessuna ragione scritta.** Nessun commento attaccato, quindi nessuna frase che il ⑦ renderebbe falsa. *Zero scritto, perché uno zero non scritto è indistinguibile da un controllo saltato.*<br><br>⚠️ **E UNA COSA TROVATA DAL LAVORO STESSO, il 2026-09-17: `conta-asserzioni.js --scrivi` HA CANCELLATO il fatto che avevo scritto il giorno prima** in testa a `BASELINE-ASSERZIONI.txt` — quello sull'ultimo commit coperto dalla CI e non dalla suite locale. La funzione `scriviBaseline` **rigenera l'intestazione da zero**, quindi una riga aggiunta a mano lì sparisce al primo aggiornamento, **senza un errore e senza un diff che qualcuno guardi**: il diff di un baseline si legge per i numeri, non per i commenti.<br><br>*È la ⓪-quinquies nella forma più pulita — una frase resa falsa non da chi la tocca ma dal mondo intorno — con l'aggravante che **il mondo che l'ha cancellata è esattamente il meccanismo di cui la frase parlava**. E sarebbe sparita in silenzio al primo `--scrivi` di chiunque: l'ho vista solo perché il `--scrivi` l'ho fatto io, un giorno dopo.*<br><br>**Corretto spostando il fatto nel MODELLO invece che nel prodotto:** sta in `tests/tools/conta-asserzioni.js`, quindi torna a ogni scrittura invece di sparire a ogni scrittura. E nell'intestazione generata c'è adesso una riga che dice che l'intestazione è generata — *il posto giusto per una cosa che deve durare è il modello, non il prodotto.*<br><br>**⑦ PERSONALIZZA — FATTO il 2026-09-17.** I **13** listener dentro `openCustomize`, chiave `'personalizza'`. **7 moduli su 8.**<br><br>⚠️ **L'UNICA DELLE OTTO CHE NON ERA UN BLOCCO: tredici righe da TRE posti** — dieci nel corpo (righe ~6002–6290, con **undici definizioni di funzione in mezzo**), `customize-back-home` a ~4215 e `start-episode` a ~6540. Ognuno dei tre posti ha il suo segnaposto.<br><br>**Era il primo caso della serie in cui «spostare» poteva NON essere neutro, e i tre controlli sono stati fatti PRIMA, non dopo. Tutti e tre passati:**<br>1. nessuno dei tredici fa altro che attaccarsi — nessuna lettura, nessun effetto a tempo di parsing;<br>2. `openCustomize` è l'**unico** posto che fa `showView('customize')` (misurato: una sola occorrenza), quindi non esiste una strada che apra la schermata senza attaccarli;<br>3. **nessun elemento viene ricostruito**: `renderIntroContent` cambia solo `textContent` e `disabled`, e `renderSlotGrid`/`renderRequestBox` riscrivono l'`innerHTML` dei **contenitori** mentre i listener stanno sui contenitori. *Erano a delega per un'altra ragione, e quella ragione è anche il motivo per cui reggono lo spostamento.*<br><br>**Falsificato nelle due direzioni:** guardia tolta e blocco eseguito → `[C] personalizza` **`1 → 4` su tutti e tredici**; `slot-grid/change` tolto → `[A]` «osservato 0», `[B]`, `[C]`. Baseline dei listener **intatto**.<br><br>⚠️ **E DUE VOLTE DI SEGUITO L'ASSERT DELLO SCRIPT DI FALSIFICAZIONE HA FERMATO LA SCRITTURA (ancora sbagliata), E IL TEST HA STAMPATO 28/28 SUL FILE NON MODIFICATO.** Letto come esito sarebbe stato «la falsificazione non morde» — cioè una conclusione falsa da un verde vero. L'ho visto leggendo il *traceback*, non il `SUMMARY`. *È la ⓪-nonies allo stadio precedente: là una falsificazione sbagliata dava un rosso che sembrava buono, qui una falsificazione **non applicata** dà un verde che sembra un risultato. Ne segue una riga operativa in più: dopo una falsificazione si verifica che la modifica SIA STATA APPLICATA — un grep sul testo nuovo — prima di leggere l'esito.*<br><br>**⑧ VOICE — FATTO il 2026-09-17. IL 21-QUATER È CHIUSO: 8 MODULI SU 8.** I **14** listener dentro `openVoiceCoach`, chiave `'voice'` (due kind, un blocco). Grappolo principale **contiguo** (zero istruzioni fra i tredici), più `vc-mic-notice-actions` a parte perché è a delega sul contenitore che `vcUpdateMicNotice` riempie — due segnaposti.<br><br>⚠️ **LA COSA CHE SOLO QUESTA FAMIGLIA AVEVA, e il controllo che ne è seguito: Voice è l'unico modulo con un APPARATO.** `vcRecognition` nasce a **tempo di parsing**, nel blocco `if (VCSpeechRecognition)` (righe ~7794–7873), e lì gli vengono assegnati `onresult`, `onend`, `onerror`. **Sono assegnazioni di proprietà, non `addEventListener`**: il censimento non li ha mai visti, e il 21-quater non li tocca.<br><br>**Tre controlli prima di spostare, tutti e tre passati:**<br>1. **nessuno dei quattordici tocca `vcRecognition` o il sintetizzatore a tempo di ATTACCO** — lo toccano dentro il corpo del gestore, al click (misurato: **zero** assegnazioni `.onresult/.onend/.onerror` nelle righe spostate);<br>2. `openVoiceCoach` è l'**unico** posto che fa `showView('voiceCoach')` (misurato: una sola occorrenza);<br>3. l'avviso microfono **non può comparire prima**: `vcUpdateMicNotice` è chiamata solo da `vcRecognition.onend` e da `vcEvaluate`, e il riconoscimento parte solo da `vc-record-btn`, che è uno dei quattordici.<br><br>**Ne segue un fatto scritto accanto al segnaposto, per chi verrà: dopo l'⑧ questo modulo ha DUE TEMPI** — i quattordici listener del DOM alla prima apertura, i tre del riconoscimento al parsing. Funziona perché `vcRecognition` è un singleton. **Chi volesse «finire il lavoro» spostando anche quel blocco, senza guardia ricreerebbe l'oggetto a ogni apertura.** *Non è stato fatto qui perché il 21-quater sposta listener, non apparati — e allargarlo di nascosto sarebbe stato il modo di rompere l'unico modulo che usa il microfono.*<br><br>**TRE falsificazioni, ognuna con l'asserzione attesa scritta prima e con il passo ② (verificare che la rottura sia applicata) eseguito:** ① guardia tolta e blocco eseguito → `[C]` **`1 → 4`** su tutti e quattordici **e** `[E]` `1 → 2` sul secondo kind; ② `vc-next-btn` tolto → `[A]` «osservato 0», `[B]`, `[C]`; ③ **la chiave sul `module.kind`** → **`[E]` ROSSA** `1 → 2`, e **`[C]` resta VERDE** perché riapre lo stesso passo, cioè un kind solo. *Qui la chiave si vede e morde, al contrario delle tre famiglie a kind singolo — ed è esattamente il blocco `[E]`, nato al ②, a prenderla.*<br><br>⚠️ **E il passo ② va fatto su una grep che colpisce il CODICE, non una stringa che vive anche nei commenti.** Due volte il controllo ha stampato «2 invece di 1» perché contava i commenti che nominano la guardia: il conto era giusto, la domanda no. *La forma corretta àncora la riga intera con il rientro (`^    BI.unaVoltaSola('voice'`), non il solo nome.* Baseline dei listener **intatto**.<br><br>**RIEPILOGO DEL 21-QUATER, ora che è chiuso:** 8 famiglie, **79 listener di modulo** entrati nella propria `open` dietro `BI.unaVoltaSola`, una guardia condivisa sola per tutte. Il test `test_listener_una_volta.js` è nato **prima** della prima conversione ed è cresciuto con la serie: da 24 a **28 asserzioni**, sei blocchi `[A]`–`[F]`, e due elenchi che erano scritti a mano ora **derivati** (`[C]` da `FAMIGLIE`, `[E]` da `MODULE_DESCRIPTORS` + `BI.moduli`). `BASELINE-LISTENER.txt` **non è mai cambiato in otto giri** — che era la condizione dichiarata all'inizio.<br><br>⚠️ **E LA SUITE DEL ⑥ È FINITA `SOME FILES FAILED`, con UN rosso — `[SR Task1]` di `test_batch19`, cioè Speed Match e non Flash Card.** Verde nelle due suite precedenti dello stesso giorno; conteggio asserzioni **1252**, non sceso; le altre 39 asserzioni del file verdi, compresa «Managed to observe a correct-answer tap within retries» — quindi **non** è il difetto del budget di `toccaFinoA`.<br><br>**NON RISOLTO, e non chiamato flake** (regola 37: «flake» non è una causa). Quello che c'è, per chi lo ritroverà:<br><br>• **La diagnosi mancava, ed è stata scritta PRIMA di riprodurre.** `attendiDomandaSuccessiva` tornava `null` sia per timeout sia per errore, e l'asserzione scriveva la stessa riga rossa nei due casi — «il quiz non è andato avanti» e «il pulsante è rimasto spento» sono due ricerche diverse. Ora dice il motivo e lo stato alla resa; `log` di quel file ha un terzo parametro stampato **solo sulle righe rosse** (il log verde resta identico, e il contatore conta il prefisso `FAIL`, che non cambia). *⓪-octies applicata prima del rosso successivo invece che dopo.*<br><br>• **Non riprodotto in DODICI corse** — 3 a file solo, **9 a quattro in parallelo**, cioè la condizione in cui era caduto — e per la **regola 19 questo non esclude niente**. *Dodici verdi non sono una prova di innocenza: sono dodici verdi. Il numero sta qui perché chi ritrova questo rosso sappia che riprodurlo è già stato provato, e non rifaccia il giro.*<br><br>• **Letto il codice:** in `srRenderQuestion` l'ordine è sincrono e favorevole — `reveal.hidden = true` → `dontknow.disabled = false` → `counter.textContent`. Il pulsante è **già riabilitato** quando il contatore cambia, quindi non esiste una finestra in cui l'attesa è soddisfatta e il pulsante è spento: **il ramo quasi certo è il TIMEOUT**, non lo «spento».<br><br>• **Un'ipotesi con un meccanismo, MISURATA E CADUTA:** `waitForFunction` interroga di default su **rAF** mentre l'app avanza su `setTimeout`; sotto carico i due potrebbero divergere e perdere la finestra di 10 s (`speedMatch.timeLimitSeconds: 10`). Misurato il 2026-09-16 — divario massimo di rAF **29,2 ms sotto carico** contro 28,7 ms a vuoto, e setTimeout 20,7 ms. *Ventinove millisecondi non perdono dieci secondi.* Ipotesi scartata invece che tenuta come spiegazione comoda.<br><br>**CONDIZIONE:** alla prossima rossa di `[SR Task1]` **si legge il motivo stampato dalla diagnosi, e quello dice il ramo** — timeout o spento. Non si riproduce prima di averlo letto. *È la stessa condizione del 2026-09-11 su `arrenditi()`, che cinque giorni dopo non è stata applicata e costò sei giri di riproduzione: questa volta la riga esiste **e** sta scritta qui.* | 1-2 giorni | **sì**, un modulo per volta |

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **22** | ⚠️ **PIANO DA RISCRIVERE — la ricontata del 2026-09-17 ha trovato TRE affermazioni false, e due lo erano già sei ore dopo la scrittura.** Il piano porta la data della misura (rifatto il 2026-09-15 alle 15:47) e va ricontato prima di eseguirlo, non ereditato. **① Nomina `applyTheme`: non esiste** — 0 definizioni, 0 usi; le funzioni vere sono `getTheme`/`setTheme`/`renderThemePicker`, e il tema è già applicato dal blocco `<script>` piccolo (46 righe), cioè **uno strato pre-confine che esiste già nel file e che il piano non nomina**. *Il caso più diverso del piano non era la parte complicata: era la parte che non esisteva, e si è trovata contandola, non leggendola.* **② `showView` non sta al confine del login:** chiama `stopAllModuleActivity`, che tira dentro il sintetizzatore, `closeAttemptPopup`, `clearPendingMastery` e `BI.pulizie` — cioè `audio`, `quiz-engine` e `progressi`, tre strati che il piano mette *dopo*. E il 21-bis ha **migliorato** questa cosa: il 15 settembre era peggio. **③ «I tre `fetch`» sono QUATTRO:** il quarto è `PERSONALIZATION_TABLES_FILE`, creato dal passo 19 (`f0fe2b8`) alle **21:58 dello stesso giorno** in cui il piano è stato scritto alle 15:47. *Vera quando scritta, falsa sei ore dopo, senza che nessuno l'avesse toccata — la ⓪-quinquies applicata a un piano. È la terza volta che un piano si rivela vecchio (14b, 15, 16) e la prima in cui lo era dopo sei ore.*<br><br>**COSA I CINQUE PASSI CHIUSI HANNO RESO MISURABILE, ed è la domanda che il 21-ter aveva già insegnato a fare:** il **21-quater è al 22 quello che il 21-ter è stato al 21-quater**. Prima, il file di un modulo **doveva** essere interpretato al boot, o i suoi listener non si attaccavano; adesso si attaccano alla prima apertura, quindi **un file di modulo può arrivare dopo**. Il 21-ter aveva già scritto l'infrastruttura senza usarla: `BI.moduliCaricatiAlBoot = true` e il messaggio d'errore con le **due cause distinte**. **Quella riga oggi è sempre vera, e il 22 è il primo passo che può renderla falsa.** Restano al parsing per modulo: **14 `registraModulo` + 5 `registraPulizia`**.<br><br>**LA MISURA SU `showView`, fatta prima di riscrivere la regola 21:** 14 chiamate vere (commenti esclusi). **Le sole due in cui la pulizia è un no-op garantito sono i due `showView('onboarding')`** (`boot` e il pulsante «cambia utente»): lì nessun modulo è mai stato aperto. Le altre dodici seguono o possono seguire un modulo. *Il confine si vede nei punti di chiamata: `'onboarding'` è l'unica vista che non può mai seguire un modulo.*<br><br>**FATTO il 2026-09-17 — LO STRUMENTO, in un giro suo e prima di ogni estrazione:** `tests/avvio-census.js`, `tests/BASELINE-AVVIO.txt` (27 righe), `tests/tools/scrivi-baseline-avvio.js`, `tests/test_avvio_invariato.js` (**9 asserzioni**). Legge il **risultato** invece di strumentare — `BI.moduli` conserva l'ordine di inserimento, `BI.pulizie` è un array — ed è **possibile solo grazie ai passi 21-bis e 21-ter**, che quei due registri li hanno creati.<br><br>**Falsificato su quattro guasti, ognuno con l'attesa scritta prima:** ① un modulo perso → `[A]`, `[C]`, `[D]` (14→13); ② **solo l'ordine** cambiato → cadono **tutte e tre**, e qui **la mia previsione era sbagliata** (avevo scritto «solo `[C]`»): le righe portano il numero d'ordine, quindi uno scambio cambia il testo di due righe. *Motivazione falsa accanto a codice giusto, ⓪-quater, su un commento scritto dieci minuti prima — e l'ha smentita una falsificazione fatta per confermarla. È il motivo per cui l'attesa si scrive PRIMA: senza, avrei letto tre rossi e detto «funziona».* ③ una registrazione **doppia** → il test **MORIVA** con un `TimeoutError` (⓪-septies), e da lì la guardia `[0]`, che ora fallisce dicendo l'eccezione vera: *«il modulo flashcard e' gia' registrato»*; ④ uno `<script>` in più — quello che il 22 farà apposta → `[B]`, `[C]`, `[D]`.<br><br>⚠️ **E il baseline dell'avvio NON è come quello dei listener, ed è scritto in testa al file:** quello non doveva cambiare **mai**; questo **può**, ma solo per una decisione strutturale dichiarata, e allora si riscrive nel commit di **quella** decisione. *Se si riscrive quando fa comodo, torna a essere un rapporto.*<br><br>**IL PIANO RISCRITTO — 2026-09-17.** *Il precedente (15/09 15:47) è sostituito, non corretto: tre delle sue affermazioni erano false, e correggerle una per una avrebbe lasciato in piedi la forma che le aveva prodotte. È archiviato sopra, con le tre misure che lo hanno chiuso.*

⚠️ **UN PIANO PORTA LA DATA DELLA MISURA, E SI RICONTA PRIMA DI ESEGUIRLO — NON SI EREDITA.** Terza volta che un piano si rivela vecchio (14b, 15, 16) e **prima in cui lo era dopo sei ore**. La domanda da fare prima di eseguirne uno è quella che il 21-ter ha insegnato: *cosa i passi chiusi da allora hanno reso misurabile, e cosa hanno cambiato di quello che il piano dava per fermo.*

**IL CONFINE NON SI DESCRIVE: SI CONTA.** Il piano vecchio diceva «cosa serve per disegnare la schermata di login» — una frase che non si può verificare, ed è per quello che ci aveva messo dentro `showView`. La forma nuova usa un criterio misurabile: **cosa gira prima che si sappia chi è lo studente.**

**GLI STRATI, in ordine di quando girano:**

| | Strato | Contiene | Come si verifica il confine |
|---|---|---|---|
| **0** | `avvio` | il blocco `<script>` piccolo che **esiste già** (46 righe): tema salvato, override della config | gira prima di `app/config.js` — visibile in `BASELINE-AVVIO.txt` |
| **1** | `identita` | `getUserName` · `setUserName` · `clearUserName` · `getTheme` · `setTheme` · `renderThemePicker` · `hydrateIcons` · `icon` — **otto funzioni, ~41 righe** | **non nomina `showView`** ✅ misurato |
| **1-bis** | **`ingresso`** *(nome proposto, non ancora deciso)* | **`boot` e `goHome`** — vedi sotto | nomina `showView`/`leaveModule`, quindi sta DOPO lo strato `vista` |
| **2** | `vista` | `showView`, **`leaveModule`**, `views`, `moduleEpoch`, `showLoadError` (+ `LOAD_ERROR_LAST_RESORT`, `loadErrorRetry`, `loadErrorInlineHtml`, `renderLoadErrorTexts`, i due listener della schermata d'errore) | ⚠️ **RICONTATO il 2026-09-17: NON si estrae in questa posizione.** Nomina tre cose di strati che vengono dopo — `stopAllModuleActivity`, `loadModuleInstructions`/`moduleInstructionsCache`, `openEpisodeMap`. *La riga precedente diceva «non tira più dentro `audio`/`quiz-engine`/`progressi`»: falsa, misurata.* Vedi la riconta qui sotto |
| **3+** | `dati`, `progressi`, `audio`, `ui-condivisa`, `quiz-engine` | invariati rispetto al piano vecchio | — |

⚠️ **IL CRITERIO «non nomina `showView`» HA BOCCIATO QUALCOSA ALLA SUA PRIMA APPLICAZIONE, il 2026-09-17 — ed è la prova che guarda.** *Un criterio che dice sì a tutto non si sa se stia guardando.*

**Misurato, funzione per funzione, prima di estrarre:**

| funzione | righe | cosa nomina di non suo |
|---|---|---|
| `getUserName`, `setUserName`, `clearUserName` | 3 ciascuna | **niente** |
| `hydrateIcons`, `icon` | 7, 5 | **niente** |
| `getTheme`, `setTheme`, `renderThemePicker` | 3, 10, 7 | `CONFIG` (strato 0, già estratto) |
| **`boot`** | 8 | **`showView`** ← bocciata |
| **`goHome`** | 15 | **`leaveModule`** ← bocciata |

**Il criterio non era sbagliato: era incompleto.** Il piano metteva `boot` in `identita`, e `boot` non è identità.

⚠️ **E `boot` E `goHome` NON SONO ORFANI — hanno uno strato loro, che prima non avevamo nominato.** *Se restasse scritto solo «non sono di `identita`», al prossimo strato qualcuno li rimetterebbe dentro per esclusione.*

> **Sono il PRIMO GESTO DOPO L'IDENTITÀ: decidono DOVE SI VA sapendo CHI SEI.**

`boot` sceglie fra login e casa guardando `getUserName()`; `goHome` è il ritorno a casa lasciando un modulo. Tutti e due hanno bisogno dello strato `vista`, quindi stanno **dopo** di esso — mai in `identita`, che viene prima. **Il nome `ingresso` è una proposta, non una decisione presa**: va confermato prima di usarlo.

**PRIMA DI OGNI ESTRAZIONE, LA SEPARAZIONE DI `showView`** (regola 21 riscritta il 2026-09-17, `CLAUDE.md` 20260917a). Non è «spezziamo `showView`»: è che **dodici chiamate su quattordici hanno bisogno della pulizia e due no**, e oggi la chiedono tutte perché sta dentro la funzione sbagliata. *Il numero è quello che rende la decisione verificabile invece che ragionevole.* Senza questa separazione, lo strato `vista` trascinerebbe il sintetizzatore, il popup dei tentativi, il magazzino della mastery e `BI.pulizie` — cioè tre strati che stanno dopo.

**OGNI ESTRAZIONE FA DUE COSE NELLO STESSO COMMIT:** attacca allo spazio dei nomi ciò che quel file espone, e sposta il file. **E ne ha una terza che il piano vecchio non poteva avere: `tests/BASELINE-AVVIO.txt` non deve cambiare.** Un diff lì durante un'estrazione è un errore, non un aggiornamento — e quando cambia di proposito (uno `<script>` in più è previsto), si riscrive nel commit della decisione che lo cambia, con il motivo.

**I QUATTRO `fetch` — non tre.** `MODULE_INSTRUCTIONS_FILE`, `module.dataFile`, `FEEDBACK_MESSAGES_FILE` e **`PERSONALIZATION_TABLES_FILE`**, nato col passo 19. La loro unificazione in un punto solo sta **dentro l'estrazione dello strato `dati`**, ed è voce esplicita, non implicita.

**LE TRE COSE IN SOSPESO, e dove cadono:**
- **`APP_CONFIG_DEFAULTS`** — scritta e mai letta, copia profonda di ~660 righe a ogni caricamento. Si decide **nello strato che contiene il Pannello Admin**: se il ripristino «ai valori di partenza» deve tornare ai valori del codice, `DEFAULTS` serve e va *letta*; se cancellare gli override è il comportamento voluto, la riga esce.
- **L'indicatore di caricamento** — misurato: a 1,5 s di rete la mappa resta invariata e **la riga non è disabilitata**, quindi lo studente **può toccare di nuovo**. Cade **nello strato `dati`**, insieme all'unificazione dei fetch: è lì che si saprà da dove parte l'attesa.
- **La finestra di 31 ms** — ⚠️ **non è una voce del 22: è un suo VINCOLO.** È del passo 18-B, e dice che a `DOMContentLoaded` l'onboarding è già completo perché i suoi cinque testi stanno nel markup. **Se il 22 mettesse il login dietro un `fetch`, quella finestra tornerebbe** — e non come schermo bianco, ma come card impaginata e vuota. *Quindi gli strati 0 e 1 non possono dipendere da un file che arriva dalla rete.*

⚠️ **E LA RIGA CHE IL 22 PUÒ RENDERE FALSA, dichiarata adesso:** `BI.moduliCaricatiAlBoot` è `true` da quando esiste, e il 21-ter ha scritto il messaggio d'errore con le **due cause distinte** per il giorno in cui non lo sarà. **Il 22 (o il 23) è il primo passo che può renderla `false`**, e quel giorno `BASELINE-AVVIO.txt` cambia di proposito — è già previsto e va dichiarato, non scoperto.

**FATTO il 2026-09-17 — PRIMA ESTRAZIONE: LA SEPARAZIONE DI `showView`.** *È il primo passo della fase 4 che cambia il comportamento dell'app: gli otto del 21-quater spostavano soltanto.*<br><br>**Erano TRE lavori, non due**, e la terza l'ho trovata guardando invece di rileggere la misura del giorno prima: `moduleEpoch++` neutralizza le chiamate asincrone tardive del modulo che si lascia (letto da `toggleSpeak` come `epochAtStart`), quindi appartiene a **lasciare**, non a **disegnare**. Si sposta anche lui — *lasciarlo avrebbe voluto dire separare le due funzioni tenendo dentro un pezzo di quello che si stava separando.*<br><br>**`showView(name)`** disegna e basta · **`leaveModule(name)`** = `moduleEpoch++` + `stopAllModuleActivity()` + `showView(name)`. **Dodici punti su quattordici passano a `leaveModule`, due restano.** ⚠️ **Non sono dodici occasioni di dimenticarsene: è una scelta fra DUE NOMI.** Mettere `stopAllModuleActivity(); showView(...)` in ciascuno dei dodici avrebbe creato dodici punti da ricordare e il tredicesimo sarebbe nato senza — il difetto che la regola 12 chiude.<br><br>**Il nome è inglese** per coerenza con i due vicini che tocca (`showView`, `stopAllModuleActivity`). ⚠️ **DOMANDA APERTA, registrata invece che risolta di nascosto: oggi convivono `stopAllModuleActivity` e `BI.registraPulizia`.** La migrazione verso l'italiano non è mai stata decisa — è successa, e *una cosa che succede non è una regola*. **Se un giorno si decide, si decide per tutti in un passo suo**: un nome per volta è il modo in cui si finisce con metà e metà.<br><br>**DUE ASSERZIONI, in `tests/test_uscita_dal_modulo.js` (11), e nessuna copre l'altra — misurato, non sostenuto:** `[A]` legge il sorgente (chiamanti diretti di `showView` = 2, da `tests/BASELINE-USCITA.txt`; punti con `leaveModule` = 12); `[B]` guida l'app avvolgendo `BI.pulizie` e verifica che girino uscendo da **ognuna delle otto famiglie**, derivate da `FAMIGLIE`. **Rompendo la catena dentro `leaveModule`: `[B]` cade tutto, `[A]` resta verde tutto e tre** — il guasto che `[A]` non può vedere.<br><br>⚠️ **E UNA COSA CHE LA FALSIFICAZIONE HA TROVATO E LA MISURA NON AVEVA: TUTTE E OTTO LE USCITE PASSANO DA `openEpisodeMap`** — i sette «← Mappa» e il `start-episode` di Personalizza. *Uno dei dodici punti porta otto famiglie su otto: è il collo di bottiglia dell'uscire.* L'ho visto perché la previsione su F1 («cade `[A]`, tutte e tre») era **incompleta** e cadde anche `[B]`. *Una previsione incompleta scritta prima vale più di una completa scritta dopo: è quella che fa notare lo scarto.*<br><br>**`tests/BASELINE-AVVIO.txt`: ZERO righe cambiate** — previsione scritta prima, verificata col diff e non col verde. *Questa era una decisione strutturale, cioè il caso in cui l'invariante ammette un cambiamento: non è servito, e uno zero scritto è una verifica fatta.*<br><br>**Due commenti resi falsi dal commit stesso, corretti nello stesso commit** (regola 33, eccezione del 2026-09-17): dicevano che `openCustomize` e `openVoiceCoach` sono «l'unico posto che fa `showView('...')`» — vero nella sostanza, falso nel nome.<br><br>**Il dodicesimo punto è MORTO e lo dice accanto a sé:** `startPronunciationExercise` non ha chiamanti. Ha ricevuto `leaveModule` perché è codice che esiste, e la nota dice esplicitamente che **non sta proteggendo niente** — così al passo 25 chi toglie la schermata non se lo chiede.<br><br>**FATTO il 2026-09-17 — PRIMO STRATO: `app/avvio.js`.** Il blocco `<script>` in linea di 46 righe — `APP_CONFIG_DEFAULTS`, `applyConfigOverrides`, l'IIFE del tema — esce come file, **nella stessa posizione**: dopo `config.js` (che gli serve) e dopo `spazio.js` (che non gli serve, ma spostarlo sarebbe un cambiamento in più). Non è stato scritto: esisteva già come blocco, ed è stato **riconosciuto e spostato**.<br><br>⚠️ **E QUESTA ESTRAZIONE HA TOLTO UNA GARANZIA STRUTTURALE, non spostato soltanto del codice — è la PRIMA VOLTA nella fase 4 che succede, e RICAPITERÀ A OGNI PEZZO CHE ESCE da `index.html`.**<br><br>Finché il blocco era **in linea**, il suo venire dopo `config.js` non era una scelta: **era la forma del file** — una cosa in linea sta necessariamente dopo i tag scritti sopra di lei. Adesso sono **due righe che si possono scambiare**. *Ogni pezzo che esce perde la protezione dell'essere in linea, e quella protezione va sostituita da un'asserzione o sparisce.*<br><br>**Misurato scambiando i due tag:** `tema: null`, `APP_CONFIG_DEFAULTS` non creata, errore JS. **L'app si rompe nel modo INVISIBILE** — il tema semplicemente non si applica — che è esattamente il caso che avevo nominato come più diverso (l'IIFE del tema, l'unica delle tre parti che non tollera un ritardo). *La previsione sulla falsificazione era «solo l'asserzione dell'ordine»: era di nuovo INCOMPLETA, ed è la seconda volta di fila che una previsione incompleta scritta prima mostra qualcosa che la misura non aveva.*<br><br>**DUE ASSERZIONI in `test_config_estratto.js`, falsificate separatamente:** l'ordine dei due tag (l'invariante del passo 20 **SEGUITO** dove è andato a stare, famiglia ⓪-undecies — era rosso dicendo `lettore=-1`, rumorosamente, perché il `posLettore !== -1` c'era) e **il divieto di ritorno** (il blocco rimesso in linea). *Scambiare i tag lascia verde il divieto; rimettere il blocco in linea lascia verde l'ordine: nessuna copre l'altra.*<br><br>**`APP_CONFIG_DEFAULTS` è venuta con le altre due, di proposito:** toglierla qui sarebbe stata **una rimozione mascherata da estrazione** (regola 1), e un passo che sposta codice non è il posto dove si decide cosa cancellare. **La sua condizione resta aperta** — si decide nello strato che contiene il Pannello Admin — ed è scritta ACCANTO ALLA RIGA, dentro `app/avvio.js`: *altrimenti il file nasce con dentro una cosa che chi lo legge crede necessaria, e il primo che la nota o la toglie o la protegge, e tutte e due sarebbero sbagliate.*<br><br>**`tests/BASELINE-AVVIO.txt` CAMBIA — UNA riga, prevista prima:** `script 3 (inline)` → `script 3 app/avvio.js`. Il conto resta 4 (3 esterni + 1 inline invece di 2 + 2). ⚠️ **È la PRIMA VOLTA che quel baseline cambia, ed è il caso che il suo invariante prevede: una decisione strutturale dichiarata.** Corretta anche la descrizione di `[D]`, che diceva «2 esterni + 2 inline»: *il numero non è cambiato e la descrizione sì — se fosse rimasta, sarebbe stata verde e falsa, e nessuna corsa avrebbe potuto accorgersene.*<br><br>⚠️ **E IL DIFETTO DEL CONTO SUI COMMENTI, ALLA QUARTA COMPARSA IN DUE GIORNI: il filtro è diventato CONDIVISO.** `righeDiCodiceDi()` sta ora in `tests/test-env.js`, dove i test prendono già i percorsi. I quattro casi: la verifica del passo ⑧ (2 invece di 1), la falsificazione della chiave sul kind, il conto di `leaveModule` (14 invece di 12), e il divieto di ritorno di questo passo (`applyConfigOverrides`, vivo in un commento). *La correzione era già scritta nella forma operativa della ⓪-nonies e continuava a non applicarsi da sola dove serviva: **una difesa scritta in un posto non si applica da sola nell'altro, e una scritta in ogni posto si disallinea**.*<br><br>**Un commento reso falso dal commit stesso, corretto nello stesso commit** (regola 33): diceva che `applyConfigOverrides` è «l'IIFE in cima» — non è più in cima a `index.html`, è in `app/avvio.js`.<br><br>⚠️ **TROVATO E NON CORRETTO, il 2026-09-17 — LA CHIAVE DEL TEMA È CONOSCIUTA DA DUE POSTI, E L'ESTRAZIONE LI HA MESSI IN DUE FILE.**

`app/avvio.js` legge `localStorage.getItem('baseinglese:theme')` **scrivendo la chiave come letterale**; `index.html` la stessa chiave la conosce come `THEME_KEY = 'baseinglese:theme'` e ci **scrive** dentro (`setTheme`). Identico per `'baseinglese:configOverrides'` / `CONFIG_OVERRIDES_KEY`.

**Il primo strato non ha creato la duplicazione: l'ha resa invisibile.** Prima i due punti stavano tutti e due in `index.html` — *una duplicazione dentro un file si trova leggendo il file; una fra due file si trova solo cercandola, e nessuno la cerca se non sa che c'è.* **È una conseguenza dell'estrazione, e vale per ogni strato che verrà.**

**LA RICOGNIZIONE, fatta una volta sola perché «caso isolato o famiglia?» si risponde contando:** **20 chiavi distinte, 12 toccate da più di un punto — ma 18 su 20 passano da una costante o da una funzione** (`NAME_KEY`, `masteryStorageKey(...)`, `moduleProgressKey(...)`, …). **Gli unici due letterali nudi di tutta l'app sono i due di `app/avvio.js`.** *Non è una famiglia sparsa: sono esattamente i due che il primo strato ha portato fuori.*

**Condizione:** si correggono **nello strato che li riunisce** — cioè quando `identita` (che contiene `setTheme`) esce, e i due punti tornano a essere due file dichiarati invece di uno dichiarato e uno letterale. Non prima: correggerli dentro un altro passo è il modo di allargarlo.

⚠️ **E IL LIMITE DELLO STRUMENTO, scritto in `tests/avvio-census.js` perché non riguarda questo passo ma TUTTI:** la fotografia dell'avvio prende le **dipendenze di codice**, non gli **spazi condivisi**. Due file possono non nominarsi mai e dipendere lo stesso l'uno dall'altro attraverso `localStorage`, un attributo del DOM, una chiave di sessione. **È il primo legame fra due file che nessuno strumento di questo progetto vede.** *Non è un buco da tappare: un baseline dell'avvio che seguisse anche il `localStorage` misurerebbe un'altra cosa, e peggio. È un limite da sapere, e da guardare a mano quando un'estrazione separa due punti che si parlano attraverso una chiave.*

⚠️ **LA RICONTA DELLO STRATO 2 (`vista`), fatta il 2026-09-17 PRIMA di estrarre — E DICE DI FERMARSI.**

**La misura, funzione per funzione:**

| funzione / valore | righe | cosa nomina di non suo | dove sta quel nome |
|---|---|---|---|
| `views` | 15 | solo `document.getElementById` × 13 | il DOM |
| `moduleEpoch` | 1 | niente | — |
| `showView` | 5 | `views` | dentro `vista` |
| `leaveModule` | 5 | `moduleEpoch`, `showView`, **`stopAllModuleActivity`** | **strato `audio`/`pulizie`, DOPO** |
| `LOAD_ERROR_LAST_RESORT`, `loadErrorRetry` | 10 | niente | — |
| `loadErrorInlineHtml`, `renderLoadErrorTexts` | 3, 8 | `LOAD_ERROR_LAST_RESORT` | dentro `vista` |
| `showLoadError` | 18 | `renderLoadErrorTexts`, `leaveModule`, `views`, **`moduleInstructionsCache`**, **`loadModuleInstructions`** | **strato `dati`, DOPO** |
| listener `load-error-back` | 3 | **`openEpisodeMap`** | **strato `mappa`, DOPO** |

**TRE dipendenze verso strati che vengono dopo, non zero.** La riga del piano diceva *«dopo la regola 21 riscritta, non tira più dentro `audio`/`quiz-engine`/`progressi`»*: **misurata, è falsa.** La separazione del 2026-09-17 ha tolto `stopAllModuleActivity` da `showView`, **non da `vista`** — l'ha spostata in `leaveModule`, che è dentro lo stesso strato. *La riga del piano è rimasta vera sulla funzione che nominava e falsa sullo strato, senza cambiare una lettera: stessa forma dei due commenti corretti in questo commit.*

⚠️ **E la riga del piano non nomina nemmeno `leaveModule`** — elenca `showView`, `views`, `moduleEpoch`, `showLoadError`. Ma `moduleEpoch++` vive in `leaveModule`: mettere il contatore in uno strato e chi lo alza in un altro è la separazione sbagliata di nuovo.

> ⚠️ **LA COSA CHE LA RICONTA HA TROVATO E CHE VALE PIÙ DELLO STRATO: L'ORDINE DI CARICAMENTO NON È L'ORDINE DI ESTRAZIONE.**
>
> Il piano elenca gli strati **«in ordine di quando girano»**. Ma un file fuori da `index.html` **non vede i locali dell'IIFE — mai, in nessun ordine di caricamento**: non è una questione di prima o dopo, è lo scope lessicale. Quindi **uno strato si può estrarre solo quando tutto ciò che nomina è GIÀ fuori dall'IIFE**, cioè si estrae **dalle foglie verso l'interno** — l'ordine opposto.
>
> `avvio` e `identita` non lo mostravano perché nominano solo `window.APP_CONFIG` / `CONFIG`, che era già globale. **`vista` è il primo strato in cui i due ordini divergono**, ed è il secondo da estrarre.

**Le due strade, e nessuna è «vai»:** o si estrae dalle foglie (`dati`, `audio`, `mappa` prima di `vista`), riscrivendo l'ordine del piano; o ogni callee si attacca a `BI` **prima** che il suo chiamante esca, il che è un passo suo per ognuno. *Si decide, non si sceglie strada facendo.*

⚠️ **E LA DOMANDA STRUTTURALE RESTA APERTA, riformulata dalla misura: NON È JAVASCRIPT A COSTRINGERE ALLA RISCRITTURA, È LA REGOLA DEL PASSO 21.** Un `function getUserName()` dichiarato in `app/identita.js` a livello globale sarebbe raggiunto dai 56 punti di chiamata dentro l'IIFE **senza toccarne nessuno** — la catena di scope funziona. Gli ottantatré punti da riscrivere nascono dal fatto che quello che esce **si attacca a `BI`**. *Quindi la scelta A/B/C non è fra tre modi di far funzionare il codice: è se `BI` valga ottantatré riscritture, e la risposta è di chi guida il progetto.*

⚠️ **IL LIMITE DI `righeDiCodiceDi()`, MISURATO IL 2026-09-17 — LO STRUMENTO NATO CONTRO IL DIFETTO DEI COMMENTI NE LASCIA PASSARE UNO STILE INTERO.**

Il filtro scarta le righe che **cominciano** con `//`, `*` o `/*`. Ma i banner `/* ===== ... */` di `index.html` hanno le righe di continuazione **senza `*`**: sono prosa che comincia con una lettera. **Misurato: 932 righe stanno dentro un blocco `/* */`, e 758 passano il filtro come se fossero codice.**

**Nessuna asserzione di oggi ne è ingannata — verificato pattern per pattern**, e il conto è **zero** per `showView('…')`, `leaveModule('…')`, `window.APP_CONFIG_DEFAULTS`, `applyConfigOverrides`. *Passava **una** riga con `stopAllModuleActivity`, ed era proprio il commento diventato falso che questo commit corregge; nessun test grep quel nome.* **È un buco latente, non un numero sbagliato — e la differenza va scritta, perché «zero oggi» è il motivo per cui non si corregge adesso.**

**Condizione:** si corregge **quando un conto nuovo cerca un identificatore che vive anche nella prosa dei banner** — cioè alla prima grep che non sia già ancorata a una parentesi con apice (`nome('`). *Anticiparla significherebbe riscrivere il filtro senza un caso che lo provi, e un filtro senza caso non si sa se guarda.*

⚠️ **LA MASTERY: L'AFFERMAZIONE MISURATA, E NON È QUELLA CHE SEMBRAVA.** *«`loadMastery()` esiste e c'è una lettura che la scavalca» — **nel codice dell'app è falsa**: l'unico `localStorage.getItem` della chiave sta dentro `loadMastery`. Quattro funzioni toccano la chiave — `masteryStorageKey` (la costruisce), `loadMastery`, `saveMastery`, `wipeEpisodeProgress` (la cancella) — e **tutte e quattro passano dal costruttore**.*

⚠️ **LA CATEGORIA ERA SBAGLIATA, E IL FATTO NO — corretta il 2026-09-17, nel commit che l'ha misurata meglio.**

Qui c'era scritto *«il punto unico aggirato»*. **Non lo è.** Scavalcare un punto unico vuol dire avere la funzione a portata di mano e non chiamarla; qui la funzione **non è raggiungibile** — `masteryStorageKey` vive dentro l'IIFE, e un `page.evaluate` non la vede. Chi scrive il test non sta aggirando niente: **sta accedendo allo stesso spazio condiviso per l'unica strada che ha.**

> **La categoria giusta è: DUE LETTORI INDIPENDENTI DELLO STESSO SPAZIO — la stessa della chiave del tema, non quella del punto unico scavalcato.**

*E la distinzione non è di parole: un punto unico aggirato si corregge dicendo a qualcuno di chiamare la funzione; due lettori indipendenti si correggono solo dando loro una fonte comune — cioè esponendola. Sono due lavori diversi, e la categoria sbagliata indicava quello che non funziona.*

**Il fatto misurato resta, ed è: 13 occorrenze in 5 file scrivono `'baseinglese:mastery:gate:' + u` a mano.** `test_scala_colori` (5), `test_batch12` (4), `test_report_mastery` (2), `test_avviso_microfono` (1), `test_mastery_al_gesto` (1). **E non possono fare altrimenti: `masteryStorageKey` vive dentro l'IIFE, irraggiungibile da un `page.evaluate`.** *Il punto unico esiste e non è raggiungibile da chi ne ha più bisogno.*

⚠️ **E la conseguenza è della famiglia della regola 44, con i nomi dei punti:** se la forma della chiave cambiasse, `getItem` tornerebbe `null`, e **quattro asserzioni NEGATIVE — quelle che dicono «non è stato scritto niente» — diventerebbero verdi per costruzione**: `test_avviso_microfono.js:300`, `test_batch12.js:542` e `:547`, `test_mastery_al_gesto.js:122`. Sono esattamente le righe che proteggono la regola 7. Le positive invece cadrebbero rumorosamente (`test_scala_colori.js:197`, `test_report_mastery.js:54`). **Una suite mezza rossa e mezza falsamente verde, con la parte falsamente verde a guardia della regola 7.**

**Condizione:** si chiude **nello strato che contiene la mastery**, esponendo `masteryStorageKey` su `BI` e facendo leggere ai cinque file quella — non prima, perché oggi quel nome non esiste fuori dall'IIFE.

⚠️ **LA LISTA «L'ESTRAZIONE NON LA CREA, LA RENDE MENO VISIBILE» — si apre qui e si RILEGGE dopo tutti e sei gli strati, non prima.**

1. **2026-09-17 · la chiave del tema e quella degli override** — due letterali nudi in `app/avvio.js` contro due costanti in `index.html`. *Duplicazione dentro un file: si trova leggendo. Fra due file: solo cercandola.*
2. **2026-09-17 · la chiave della mastery nei test** — il punto unico esiste e l'IIFE lo nasconde ai cinque file che ne hanno bisogno. *L'estrazione della mastery lo renderà raggiungibile: è l'unico caso della lista che l'estrazione MIGLIORA, e va scritto perché non si legga la lista come «l'estrazione peggiora tutto».*
3. **2026-09-17 · i 758 righe di prosa che `righeDiCodiceDi()` lascia passare** — non è creata dall'estrazione, ma ogni strato che esce aggiunge un file su cui quel filtro girerà.

*Si rilegge alla fine perché una lista di tre voci non dice se sono una famiglia; una di dieci sì.*

⚠️ **`boot` E `goHome` SONO UN GRUPPO E SI ESTRAGGONO INSIEME — scritto adesso, non al loro turno.**

*Il motivo è la forma dell'orfano: al loro turno qualcuno ne prende uno e lascia l'altro, e quello che resta diventa il pezzo di cui nessuno sa più dire dove va.* Il gruppo è **«il primo gesto dopo l'identità: dove si va, sapendo chi sei»**, e comprende anche i suoi punti di cablaggio, che senza le due funzioni non hanno senso:

| | |
|---|---|
| `boot` | 8 righe · nomina `getUserName`, `goHome`, `showView` · chiamata **una volta**, in fondo allo script |
| `goHome` | 15 righe · nomina `getUserName`, `currentEpisode`, `leaveModule` |
| i tre pulsanti «casa» | `back-home`, `customize-back-home`, `map-back-home` → tutti e tre `goHome` |
| il `submit` dell'onboarding | `setUserName` + `goHome` |
| il pulsante «cambia utente» | `clearUserName` + `showView('onboarding')` — **una delle due sole chiamate dirette a `showView`** |

⚠️ **PERCHÉ SONO DUE E NON UNO SOLO, che è la parte che rende il gruppo un gruppo:**

> **`boot` DECIDE se chiamare `goHome`. È quella decisione a essere lo strato, non le due funzioni.**

*Prese una per una sembrano due cose slegate — una guarda un nome salvato, l'altra scrive un saluto e un'etichetta. Il legame non è in nessuna delle due: è nel `if` che sta in mezzo. Per questo estrarne una sola lascerebbe fuori proprio la cosa che si stava estraendo — lo stesso scarto di `moduleEpoch++` lasciato in `showView`.*

⚠️ **E UNA COSA CHE NON C'È, detta perché il silenzio si legge come conferma: `tornaAllaHome` NON ESISTE nel repository.** Cercato in tutto l'albero: **0 occorrenze**. Il «tornare a casa» non è una terza funzione — è `goHome` stessa, cablata sui tre pulsanti qui sopra. *Il gruppo è di due funzioni più cinque punti di cablaggio, non di tre funzioni.*

⚠️ **E il motivo per cui questa riga vale la pena di essere scritta invece che semplicemente non-scritta: se restasse scritto che sono tre, al loro turno qualcuno ne cercherebbe tre e ne troverebbe due — e passerebbe il pomeriggio a cercare la terza.** *Il tempo peggio speso è quello su un errore che ci siamo scritti da soli: non c'è niente da trovare, e niente che dica quando smettere di cercare.* Vale anche per la forma più precisa dell'errore («non è del gruppo perché chiama `goHome` invece di esserlo»): anche quella presuppone una funzione che non c'è.

⚠️ **RICONTA DELLO STRATO `progressi`, 2026-09-17 — E LA PRIMA COSA DA DIRE È CHE IL PIANO NON L'HA MAI DEFINITO.**

La riga `3+` dice *«`dati`, `progressi`, `audio`, `ui-condivisa`, `quiz-engine` — invariati rispetto al piano vecchio»*, e il piano vecchio quei cinque nomi **non li ha mai riempiti**. *Non c'è niente contro cui ricontare: il nome c'è, l'appartenenza no.* Quindi la riconta comincia da un **criterio**, e il criterio è proposto qui, non ereditato:

> **Ci sta dentro ogni funzione che tocca una chiave di `localStorage` di PROGRESSO PER UTENTE, più il costruttore di quella chiave.**

È misurabile (si contano le funzioni che nominano uno dei dodici costruttori) e lascia fuori per costruzione le tre chiavi che progresso non sono: `NAME_KEY` e `THEME_KEY` (strato `identita`) e `CONFIG_OVERRIDES_KEY` (strato `avvio` + Pannello Admin).

**LA MISURA: 35 funzioni, 176 righe, e DIPENDENZE VERSO ALTRI STRATI: NESSUNA.**

| famiglia | funzioni |
|---|---|
| progressi del modulo | `moduleProgressKey`, `loadModuleProgress`, `markModuleCompleted` |
| esiti | `moduleOutcomeKey`, `loadModuleOutcomes`, `saveModuleOutcome` |
| mastery (**solo il magazzino**) | `masteryStorageKey`, `loadMastery`, `saveMastery` |
| consumi | `audioUsageKey`, `loadAudioUsage`, `addAudioSecondsSent`, `nextLineSkipsKey`, `loadNextLineSkips`, `addNextLineSkip` |
| Why We Say It | `storyCardsExplanationStatsKey`, `loadStoryCardsExplanationStats`, `storyCardsRecordExplanationAnswer`, `vuotoStoryCardsExplanationStats`, `storyCardsDeclarationsKey`, `loadStoryCardsDeclarations`, `saveStoryCardsDeclarations` |
| personalizzazione | `customValuesKey`, `loadCustomValues`, `saveCustomValues` |
| intro viste | `introDismissedKey`, `legacyRaIntroDismissedKey`, `isIntroDismissed`, `setIntroDismissed` |
| Help | `helpRequestsKey`, `loadHelpRequests`, `saveHelpRequest` |
| migrazione e azzeramento | `customizeSeenKey`, `isCustomizeSeen`, `migrateCustomizeSeenToModuleProgress`, `wipeEpisodeProgress` |

⚠️ **ZERO dipendenze verso altri strati è il numero che conta, e va letto insieme al punto ② qui sopra: `progressi` è una FOGLIA.** È lo strato che l'ordine «dalle foglie verso l'interno» chiede per primo, e **l'unico misurato finora che non abbia il problema di `vista`**. *La prima versione della misura ne dava UNA — `vuotoStoryCardsExplanationStats`, tre righe, usata solo da `loadStoryCardsExplanationStats`: è entrata nel gruppo, e il conto è sceso a zero. Una dipendenza che sparisce tirando dentro un aiutante di tre righe non era una dipendenza fra strati: era un confine tracciato male.*

**54 punti di chiamata da fuori il gruppo**, e i due più numerosi sono `isIntroDismissed` e `setIntroDismissed` con dieci ciascuno. ⚠️ **È qui che la decisione A/B/C sull'IIFE si paga o non si paga**, e il numero adesso c'è: con `BI` sono 54 riscritture, senza (un alias in cima all'IIFE) sono zero.

**La `mastery` che entra è SOLO il magazzino.** `LEVELS`, `nextLevel`, `prevLevel`, `applyMasteryResult`, `recordPendingMastery` restano fuori: non toccano la chiave, sono la **regola** (regola 39), non il deposito. *Il confine passa fra «dove si scrive» e «cosa si decide di scrivere», ed è la stessa separazione di `showView`/`leaveModule`.*

⚠️ **UNA COSA MISURATA E NON CORRETTA: `customizeSeenKey` NON VIENE MAI SCRITTA DALL'APP.** Un solo `getItem`, nessun `setItem`, nessun `removeItem` — e `wipeEpisodeProgress` non la tocca. **Non è un difetto**: il commento accanto lo dice già (*«Nothing writes this key anymore»*), è il superstite in sola lettura del vecchio flag «Customize seen», tenuto per i profili che avevano personalizzato prima che Personalizza diventasse un modulo di mappa. **Su un profilo nuovo `isCustomizeSeen` è falsa per sempre e `migrateCustomizeSeenToModuleProgress` esce subito.** *Va scritto qui perché chi lo troverà dentro `app/progressi.js` non avrà il flusso vecchio in testa, e «una funzione che legge una chiave che nessuno scrive» somiglia troppo a un difetto.* **Condizione:** la migrazione si toglie quando si decide che nessun profilo pre-mappa vada più servito — decisione che non è di questo passo, e che oggi non ha una data.

⚠️ **IL SETACCIO SULLE DODICI CHIAVI, fatto PRIMA dell'estrazione — stessa forma di quello del tema, rifatto qui perché questo strato tocca i dati dello studente.**

*La domanda è quella giusta e va fatta adesso: chi legge o scrive quelle chiavi FUORI dalle funzioni che le costruiscono? Dopo l'estrazione quel qualcuno starà in un altro file, e una duplicazione fra due file si trova solo cercandola.*

**METÀ DELLA RISPOSTA È PULITA, e va detta per prima: NELL'APP, ZERO.** Ognuno dei dodici letterali compare **una volta sola**, dentro il proprio costruttore. Nessun `getItem`, nessun `setItem`, nessun `removeItem` raggiunge una di quelle chiavi da fuori. *Il confine dello strato regge: l'app parla col magazzino solo attraverso le 35 funzioni.*

**L'ALTRA METÀ NO, ED È GRANDE: 197 OCCORRENZE DEI LETTERALI NEI FILE SOTTO `tests/`.**

| chiave | app | test |
|---|---|---|
| `introDismissedKey` | 1 | **75** |
| `moduleProgressKey` | 1 | **65** |
| `customizeSeenKey` | 1 | 15 |
| `moduleOutcomeKey` | 1 | 15 |
| `masteryStorageKey` | 1 | 13 |
| `audioUsageKey`, `nextLineSkipsKey`, `legacyRaIntroDismissedKey` | 1 | 3 ciascuna |
| `storyCardsExplanationStatsKey`, `customValuesKey` | 1 | 2 ciascuna |
| `storyCardsDeclarationsKey` | 1 | 1 |
| `helpRequestsKey` | 1 | **0** |

⚠️ **E il caso della mastery, registrato qui sopra come se fosse suo, NON ERA SUO: era il campione più piccolo di una famiglia da 197.** *Tredici su 197. L'avevo misurato perché me l'avevano nominato, e misurare quello che viene nominato dà sempre un caso isolato: è la ricerca aperta della regola 24, con la stessa firma — «non ho trovato altro» indistinguibile da «non ho cercato».*

**DIVISE PER COSA FANNO, perché il rischio non è lo stesso:**

| | quante | cosa succede se la forma della chiave cambia |
|---|---|---|
| `setItem` — preparano lo stato | **148** | l'app non trova niente e il test cade **rumorosamente** |
| `getItem` — leggono lo stato | **37** | dipende dall'asserzione |
| altro (`removeItem`, chiavi in commenti) | 12 | — |

⚠️ **E DELLE 37 LETTURE, 24 HANNO LA FORMA DELLA REGOLA 44: trattano l'assenza come «vuoto»** (`|| '{}'`, `=== null`, `.length === 0`). `test_batch11` (8), `test_batch12` (4), `test_batch2` (3), `test_batch14` (2), `test_episodi_corti` (2), `test_voicecoach` (2), `test_batch13`, `test_outcome_step_ids`, `test_scala_colori` (1 ciascuno).

**Il limite di questa misura, dichiarato invece che lasciato scoprire: 24 è il conto della FORMA, non della polarità.** Una lettura tollerante all'assenza diventa verde per costruzione solo se alimenta un'asserzione **negativa**; se ne alimenta una positiva, cade rumorosamente. **Le 4 della mastery sono state guardate una per una e sono negative** (`test_avviso_microfono:300`, `test_batch12:542` e `:547`, `test_mastery_al_gesto:122`); **le altre 20 no.** *Scrivere «24 asserzioni diventerebbero verdi per costruzione» sarebbe più forte e non misurato.*

**Condizione:** si chiude **esponendo i dodici costruttori** quando lo strato esce, e facendo leggere ai test quelli. **Non è una pulizia di contorno: è metà del valore dell'estrazione**, perché oggi il punto unico esiste e non è raggiungibile da chi ne ha più bisogno. *Che i 148 `setItem` cadano rumorosamente non li rende innocui: 148 file da correggere a mano il giorno in cui una chiave cambia forma è esattamente il costo che «LAVORO DA SOLO» non regge.*

⚠️ **E LA MISURA «CHI TOCCA QUESTA CHIAVE» DIVENTA UN PASSO FISSO DI OGNI ESTRAZIONE, deciso il 2026-09-17.**

Due strati su due, e tutte e due le volte ha trovato qualcosa che il criterio degli strati non vedeva: **il tema** (due letterali nudi finiti in file diversi) e **il magazzino** (nove lettori che erano la stessa funzione). *Sembra una domanda di contorno, e finora ha reso più del criterio principale.* **Si fa prima di ogni estrazione, anche dove nessuno la chiede**, e la sua risposta sta nel commit dell'estrazione.

**E IL MODO DI CHIUDERE, che vale oltre questo passo:**

> **CHIUDERE IL CASO COSTA MENO CHE SCRIVERE LA NOTA CHE LO DESCRIVE — E PROTEGGE DI PIÙ, PERCHÉ LA NOTA VA TROVATA E IL PUNTO UNICO NO.**

*Applicato qui: la nota avrebbe dovuto dire quali nove funzioni, in quali punti, con quale fallimento previsto. La correzione è stata tre funzioni nuove e diciotto corpi accorciati. **E dopo l'estrazione la nota sarebbe stata in un altro file da quello che descrive**, che è la condizione in cui una nota smette di essere trovata.*

⚠️ **IL CRITERIO CHE SEPARA DUE CASI CHE SI SOMIGLIANO, e l'ha fatto alla seconda applicazione:** *quante FUNZIONI toccano la chiave, non quante righe la nominano.*

| | cosa sembrava | cosa era | come si chiude |
|---|---|---|---|
| il **tema** | due accessi allo stesso spazio | **un chiamante in più** di una chiave che una costante ce l'ha già | si dà al secondo la costante del primo |
| il **magazzino** | nove accessi indipendenti | **la stessa funzione scritta nove volte** | si scrive una volta sola e gli altri otto la chiamano |

*Sono due lavori diversi, e il conto delle righe li avrebbe messi nello stesso mucchio.*

**FATTO il 2026-09-17 — SECONDO STRATO: `app/progressi.js`.** Trentotto funzioni e una costante, 167 righe di codice, **zero dipendenze verso altri strati** — misurato prima di muovere niente, ed è la ragione per cui questo strato è uscito **prima di `vista`**, che invece ne ha tre. Il criterio è nel file, non l'elenco: *ogni funzione che tocca una chiave di `localStorage` di progresso per utente, più il costruttore di quella chiave.*

**`tests/BASELINE-AVVIO.txt` cambia, ed è il secondo cambiamento della sua vita — previsione scritta PRIMA di rigenerarlo e verificata col diff:** `script 4 (inline)` → `script 4 app/progressi.js`, più la riga nuova `script 5 (inline)`; il conto passa da 4 a 5; **tutto il resto invariato** (14 moduli, 5 pulizie, `moduliCaricatiAlBoot true`, `vistaDopoIlBoot view-onboarding`). Osservato: **una riga cambiata, una aggiunta, zero altrove.** ⚠️ **E la storia dei suoi diff è ora scritta DENTRO il baseline**, uno per riga con la decisione che lo giustifica: *un baseline senza la storia dei suoi diff torna a essere un rapporto, ed è proprio nel secondo diff consecutivo che un «aggiornato» scivola dentro senza motivo.* (La premessa che il commit precedente lo avesse cambiato era falsa: `fac7a9a` ha toccato `BASELINE-ASSERZIONI`, non questo — verificato col diff.)

⚠️ **COME SI RAGGIUNGE QUELLO CHE È USCITO: HO SCELTO IO, E LO DICHIARO INVECE DI LASCIARLO DEDURRE.** La domanda A/B/C sull'IIFE è rimasta senza risposta per tre giri e bloccava ogni estrazione. Ho preso **B** — un blocco di alias in cima all'IIFE principale, `var nome = BI.nome;` per ognuno — e non l'ho presa perché sia la migliore: perché è **la più piccola e la più reversibile**, e perché prendere la decisione grande dentro un commit che SPOSTA codice significherebbe prenderla senza che nessuno l'abbia guardata.

| | costo | cosa lascia aperto |
|---|---|---|
| **A** `BI.nome(...)` ovunque | **54 riscritture** in questo strato, e vale per tutti gli altri | niente: è la decisione presa |
| **B** alias in cima *(scelta)* | **38 righe di ponte**, greppabili in colonna | la decisione, per il suo passo |
| **C** sciogliere l'IIFE | un passo suo, grande | — |

**Il ponte porta la sua condizione scritta accanto**, dentro `index.html`: sparisce nel passo che decide come si raggiunge quello che è stato estratto. *Finché è lì, è un debito dichiarato — non uno stile da imitare.*

⚠️ **E IL GUASTO DI QUESTO STRATO NON SOMIGLIA A UN GUASTO — misurato, non dedotto, bloccando la richiesta del file:**

| | |
|---|---|
| login | **compare** |
| casa | **compare** |
| mappa | **NON si apre** |
| passi disegnati | **0** |
| schermata d'errore | **nessuna** |
| errore JS | `TypeError: isCustomizeSeen is not a function` |

**L'app parte.** Lo studente arriva a casa, tocca «Inizia», e non succede niente. *È il primo strato per cui «ho guardato, l'app si apre» è una verifica che non verifica* — e per questo il controllo a mano su Pages, qui, è **«la mappa si apre e ha i suoi ventidue passi»**.

⚠️ **TROVATO E NON CORRETTO: un file di strato che non arriva è una famiglia di guasti che `showLoadError` NON copre.** Quella schermata esiste per un `fetch` di dati che fallisce; uno `<script src>` che non arriva non passa di lì, e il risultato è un pulsante che non fa niente. **Condizione:** si decide **quando i file dei moduli arriveranno a richiesta** (passo 23), perché è lì che la cosa smette di essere un caso di rete raro e diventa il funzionamento normale. Registrarlo adesso serve a non riscoprirlo allora.

**`tests/test_progressi_estratto.js` (10 asserzioni), falsificato su TRE guasti separati, con le previsioni scritte prima:** `defer` sul tag → **7/10** (l'ordine, la mappa, gli errori JS); il tag spostato prima di `spazio.js` → **9/10** e **l'app regge**, perché `spazio.js` usa `|| {}`; una copia di `isCustomizeSeen` rimessa in `index.html` → **9/10**, solo il divieto di ritorno, **e l'app continua a funzionare** — che è esattamente perché quel divieto serve: due definizioni dello stesso nome non danno nessun errore, vince quella dell'IIFE, e il file estratto diventa un doppione che nessuno chiama.

⚠️ **E UNA FALSIFICAZIONE SBAGLIATA, DETTA INVECE CHE NASCOSTA (famiglia ⓪-nonies, primo gradino).** La prima versione del guasto dell'ordine spostava il tag **prima** dello script principale credendo di spostarlo dopo: la condizione che volevo rompere restava vera e il file dava **10/10**. *Non l'ha trovata un controllo: l'ha trovata la **previsione scritta prima**, che diceva 7 su 10.* Senza quel numero scritto, un verde sarebbe passato per «l'asserzione regge».

⚠️ **E LA GUARDIA CONTRO IL MORIRE INVECE CHE FALLIRE, nata dalla stessa misura:** col `defer`, `waitForSelector` scadeva e il file **esplodeva senza stampare niente** — chi legge la CI vede un file morto invece di un'asserzione rossa. Adesso `[C]` cattura, dichiara la riga rossa e **nomina il primo errore JS vero**. È la stessa guardia `[0]` di `test_avvio_invariato.js`, e l'ho dovuta riscoprire qui: *una difesa scritta in un posto non si applica da sola nell'altro.*

⚠️ **E LA PREVISIONE ERA INCOMPLETA: il numero degli script vive in DUE posti, non uno.** La previsione nominava `BASELINE-AVVIO.txt` e si fermava lì; la suite è tornata **rossa su `test_avvio_invariato.js` `[D]`**, che porta il conto **scritto a mano** — ed è scritto a mano di proposito, dice il suo commento: *«il conto atteso DEVE essere una decisione, ed è la riga che cambia quando uno strato esce»*. **Quindi il rosso è il meccanismo che funziona, non un guasto** — ma è arrivato dalla suite invece che dalla previsione, e questo è lo scarto. `4` → `5`, con la storia del numero scritta accanto. *Al prossimo strato la previsione nomina due posti.*

**FATTO il 2026-09-17 — TERZO STRATO: `app/identita.js`.** **Nove funzioni, quattro valori, 70 righe** (commenti compresi), **zero dipendenze verso altri strati**.

⚠️ **IL PIANO NE DICHIARAVA OTTO, E SONO NOVE — quarta volta che un numero nostro è vecchio.** `setTheme` chiama `syncThemePicker`, che il piano non nominava. *Non era una dipendenza fra strati: era un confine tracciato male, come `vuotoStoryCardsExplanationStats` in `progressi`.* Tirata dentro, il conto scende a zero.

⚠️ **E UN DIFETTO DELLA MIA MISURA, trovato dall'app che è esplosa: contavo quali FUNZIONI il gruppo nomina, e `ICONS` è una `var`.** La tabella delle icone è rimasta indietro, e il primo `icon()` ha dato `ReferenceError: ICONS is not defined`. **La misura rispondeva a una domanda più stretta di quella che le facevo** — «quali funzioni» invece di «quali nomi». Rifatta includendo le `var` di primo livello, `ICONS` è entrata nello strato. *Al prossimo strato la misura parte già dai due insiemi.*

⚠️ **QUESTO FILE STA PRIMA DI `app/avvio.js`, ed è il primo ordine fra due estratti che serve per una ragione di CONTENUTO.** `avvio.js` applica il tema prima del primo disegno e per farlo legge la chiave; **fino a oggi la scriveva come letterale** mentre `index.html` la conosceva come `THEME_KEY`. Era il caso registrato con lo strato 0 — *«si corregge nello strato che li riunisce»* — **e questo è quello strato: chiuso.** La chiave vive qui, `avvio.js` legge `BI.THEME_KEY`, e l'ordine dei tag è quello che lo rende possibile.

⚠️ **COSA SI ROMPE SE IL FILE NON ARRIVA — misurato, ed è L'OPPOSTO DI `progressi`:**

| | `progressi` | `identita` |
|---|---|---|
| l'app parte | **sì** | **no** |
| vista attiva | casa | **nessuna** |
| cosa si vede | la mappa non si apre, nessun messaggio | **pagina bianca** |
| errore JS | `isCustomizeSeen is not a function` | `icon is not a function` |
| tipo di guasto | **silenzioso** | **rumoroso** |

**Quindi su questo strato «l'app si apre» È una verifica che verifica** — e da qui in avanti la richiesta di collaudo su Pages dice sempre **anche cosa si romperebbe**, perché è quello che decide dove guardare. *La previsione diceva «muore su `renderThemePicker()`»: giusta in genere, sbagliata su quale funzione — `icon` viene prima.*

⚠️ **E UNA DIFESA CHE SI ERA CANCELLATA DA SOLA, trovata rigenerando.** La storia dei diff di `BASELINE-AVVIO.txt`, scritta a mano dentro il file un giro fa, **è sparita alla prima rigenerazione**: lo script riscrive l'intestazione per intero. *Non somigliava a un guasto, somigliava a un file aggiornato — famiglia della regola 37.* Adesso la storia è un dato di `tests/tools/scrivi-baseline-avvio.js`, quindi ogni rigenerazione la riporta.

**Le previsioni, scritte prima e verificate dopo — e stavolta nominavano i DUE posti:** `BASELINE-AVVIO.txt` (3 righe cambiate + 1 aggiunta, conto 5→6) e `test_avvio_invariato.js [D]` (il conto a mano 5→6). **Tutte e due esatte.** *Al giro scorso il secondo posto l'aveva trovato la suite invece della previsione.*

**`tests/test_identita_estratta.js` (15 asserzioni), falsificato su due guasti con le previsioni scritte prima:** il file spostato **dopo** `avvio.js` → **13/15** (l'ordine, e il tema che non sopravvive alla ricarica); il letterale rimesso in `avvio.js` → **12/15**.

⚠️ **E LA SECONDA FALSIFICAZIONE HA CORRETTO UN'ASSERZIONE, perché la previsione era sbagliata:** dicevo «cadono tutte e tre di `[C]`» e ne sono cadute **due**. La terza guardava solo `identita.js` e `index.html` — diceva «il letterale esiste in un posto solo» **senza guardare dove il doppione era appena ricomparso**. Allargata a tutto il codice dell'app; rifatta, cadono tutte e tre. *Una previsione non scritta avrebbe lasciato due rossi e la conclusione «funziona».*

**Duplicazione notata e non corretta:** `test_progressi_estratto.js` e `test_identita_estratta.js` condividono la forma dei blocchi `[A]` e `[B]` (tag, ordine, divieto di ritorno, alias) e `nomiEsposti()`. **Condizione:** si uniscono in un aiutante condiviso **al prossimo strato**, cioè quando i casi sono tre e la forma comune è misurata invece che immaginata — e in un commit suo, non dentro un'estrazione: *un'estrazione che sposta e riscrive i test nello stesso giro non lascia sapere quale delle due cose ha rotto cosa.*

⚠️ **IL CENSIMENTO DELLE RISORSE CONDIVISE, fatto il 2026-09-18 PRIMA di toccare lo strato `audio` — ed è la risposta alla domanda «una risorsa condivisa non si divide per QUANDO gira».**

Misurate le `var` di primo livello dell'IIFE **scritte da più di una funzione**: sono **73**. La grande maggioranza è interna a un modulo (`dg*`, `vc*`, `qm*`, `sr*`, `fc*`) e viaggerà tutta insieme al passo 23 — non sono legami fra strati. **Quelle che attraversano due strati futuri sono poche, e sono queste:**

| risorsa | chi la tocca | strati diversi |
|---|---|---|
| **`synth`** | `loadVoices`, `pickVoice`, `toggleSpeak` · `stopAllModuleActivity` · `dgTogglePause`, `openDialogo` · `fcFlip` | **quattro**: audio · pulizie · dialogo · flashcard |
| **`moduleEpoch`** | `leaveModule` · `stopAllModuleActivity` · `toggleSpeak` · `dgPlayLine` | **tre**: vista · pulizie · audio |
| `currentValues` | `onSlotChange`, `openCustomize` · `openModuleFromMap` | due: personalizza · mappa |
| `currentMastery`, `transcriptEl` | `startPronunciationExercise` · `submitAttempt` | uno solo e mezzo: il primo è la **vista morta** (passo 25) |

> **`synth` è la prova del punto: il piano lo mette nello strato `audio`, e quattro strati diversi ci mettono le mani.** Il criterio degli strati divide per quando una cosa gira; una risorsa condivisa non si divide così, e nessuno dei confini misurati finora l'avrebbe visto.

⚠️ **E LA CONSEGUENZA IMMEDIATA: `audio` NON È UNA FOGLIA, e quindi NON si estrae adesso.** Misurato con `tests/tools/misura-strato.js` sul gruppo (`synth`, `voices`, `loadVoices`, `looksLikeMaleVoice`, `pickVoice`, `lockModuleHeader`, `toggleSpeak` — **7 pezzi, 62 righe**): due dipendenze verso il resto di `index.html`, **`CONFIG`** (innocua, è già globale) e **`moduleEpoch`**, che sta in `vista` — lo strato che a sua volta aspetta `dati` e `audio`. *È la prima dipendenza circolare della serie, e va sciolta prima, non durante.*

**Le tre strade, e nessuna è «vai»:** ① `moduleEpoch` esce per primo in un file suo (è **una riga**, e tre strati la leggono — il candidato naturale a stare sotto tutti); ② `audio` esce portandosi dietro `moduleEpoch`, e `vista` poi lo trova in `BI`; ③ si scioglie prima l'IIFE (la vecchia opzione C). **La ① è quella che consiglio** — una risorsa condivisa da tre strati non appartiene a nessuno dei tre — ma è una decisione, non una deduzione.

**FATTO il 2026-09-18 — SESTO FILE: `app/audio.js`, l'ultimo strato del 22.** 15 pezzi, 145 righe, zero dipendenze verso altri strati.

⚠️ **IL PONTE DEGLI ALIAS NON FUNZIONA PER UN NUMERO, e questo fatto è nuovo per la serie.** `var nome = BI.nome` copia un **riferimento**: su un numero copia il **valore**. `leaveModule` avrebbe incrementato una copia, `toggleSpeak` non l'avrebbe vista cambiare, e la protezione contro i callback tardivi sarebbe diventata **inerte in silenzio** — nessuna eccezione, nessun rosso, e l'audio che ricomincia a sanguinare nel modulo successivo, cioè il bug per cui l'epoca è nata. Da qui `nuovaEpoca()` / `epocaCorrente()`, e l'epoca vive col nucleo audio perché **esiste solo per il problema dell'audio**: `leaveModule` la usa, non la possiede.

⚠️ **UNA PREVISIONE SBAGLIATA SCRITTA E CORRETTA UN MINUTO DOPO.** Avevo scritto in testa al file «se non arriva, l'app parte e la mappa non si apre, come per `progressi`». **Falso:** login **compare**, casa **no**, `TypeError: vocePossibile is not a function`. `speakBtn.disabled = !vocePossibile();` gira al primo livello dello script principale. *La schermata del nome si vede perché è nel markup, non perché l'app sia viva.* **Terzo tipo di guasto della serie**, e i tre insieme sono la cosa da ricordare:

| strato | l'app parte | cosa si vede |
|---|---|---|
| `identita` | **no** | pagina bianca — **rumoroso** |
| `progressi` | sì | la mappa non si apre, nessun messaggio — **silenzioso** |
| `audio` | **sembra** | il login c'è ma è markup: si preme e non succede niente |

⚠️ **E LO SCARTO DI UNA FALSIFICAZIONE, che è la cosa più utile del giro.** Rimettendo l'epoca come variabile col ponte: previsti **10/13**, osservati **11/13**. Non è caduta «`nuovaEpoca` fa salire il numero», perché quella chiama `BI.nuovaEpoca()` **dalla console**, e il ponte congelato da lì non si vede. **Cade solo quella che passa DALL'APP.** *È la prova che le due asserzioni non sono ridondanti — e che senza quella dall'app il guasto sarebbe passato verde.*

---

⚠️ **CHE COSA RESTA IN `index.html` DOPO I SEI STRATI — censito il 2026-09-18, perché alla fine del 22 dobbiamo saperlo invece di scoprirlo al 23.**

**251 funzioni di primo livello.** Non sono «i moduli»: contando per famiglia, i moduli veri (dialogo, speedMatch, storyCards, flashcard, match, voice, personalizza, repeatAloud, mappa) coprono circa **115**. Le altre ~136 si raggruppano così, e **due gruppi il piano non li ha mai collocati:**

| gruppo | esempi | il piano lo nomina? |
|---|---|---|
| `dati` | `loadEpisodeData`, `loadModuleInstructions`, `loadFeedbackMessages`, `loadPersonalizationTables`, `episodeGrade`, `buildEpisodes` | sì |
| `vista` + `ingresso` | `showView`, `leaveModule`, `showLoadError`, `boot`, `goHome` | sì |
| `ui-condivisa` | `renderChoiceBox`, `renderSummaryScreen`, `openOverlay`, `renderListenBlock`, `renderStars`, `openAttemptPopup` | sì |
| `quiz-engine` | `levenshtein`, `similarity`, `alignWords`, `classify`, `tokenize`, `shuffle`, `starsForPercent` | sì |
| **la REGOLA della mastery** | `nextLevel`, `prevLevel`, `applyMasteryResult`, `recordPendingMastery`, `commitPendingMastery` | **no** — lasciata fuori da `progressi` apposta (il magazzino ≠ la regola), e non ha una casa |
| **i SUONI** | `sfxGetAudioCtx`, `sfxPlayTone` e i sei suoni, `warmAudioContextOnce` | **no** |
| **il Pannello Admin** | ~20 funzioni (`openConfigPanel`, `renderModuleOrderRows`, `persistConfigSection`, …) | appena sfiorato |
| i segnaposto | `fillTemplate`, `resolveSlotValue`, `buildSlotFields`, `groupSlotFields` | dentro `personalizza`, ma sono usati da tutti |

⚠️ **E LA TERZA RISORSA CONDIVISA, che chiude la categoria aperta con `speechSynthesis`: `sfxAudioCtx`, l'`AudioContext` dei suoni.** Oggi è toccato da **una funzione sola** (`sfxGetAudioCtx`), quindi **non è ancora un problema** — ma `warmAudioContextOnce` è agganciato a `pointerdown` e `keydown` sul `document`, cioè è **un listener globale come quello del Blocco Ascolto**. *Lo strato `audio` appena uscito contiene la VOCE e non i SUONI, e il piano non dice dove vadano: sono due meccanismi audio diversi (Web Speech e Web Audio), due oggetti globali diversi, e nessuno dei due è «un modulo».*

**Condizione:** i tre gruppi senza casa — la regola della mastery, i suoni, il Pannello Admin — **si collocano prima di cominciare il 23**, non durante. *Scoprire al 23 che una funzione non appartiene a nessun modulo significa fermarsi a decidere mentre si trasloca, che è il modo in cui i traslochi diventano impossibili da diagnosticare.*

⚠️ **LA RILETTURA DELLE COSE ALLONTANATE, fatta il 2026-09-18 prima di cominciare il 23 — e la risposta alla domanda «si somigliano?» è SÌ, ma sono DUE forme, non una.**

*Rileggerle serviva a sapere quante sono prima di aggiungere otto file. Sono quindici, e cinque sono già chiuse.*

**CHIUSE (cinque):** la chiave del tema in due file · `synth` toccato da quattro strati · i nove lettori identici del magazzino · `moduleEpoch` variabile condivisa · la duplicazione fra i due test degli strati. *Tutte chiuse nella serie stessa, ognuna nel passo che le riuniva.*

**FORMA I — «una cosa sola che più file devono conoscere» (sette voci).**

| | stato |
|---|---|
| i **197 letterali** delle chiavi di progresso nei test | aperta — i costruttori sono ora esponibili |
| il **ponte di alias** (~62 righe) | aperta |
| **`sfxAudioCtx`**, l'AudioContext dei suoni | aperta, ma **oggi la tocca una funzione sola** |
| i **cinque listener globali** sul `document` | aperta — vedi sotto |
| *(chiuse: tema · `synth` · `moduleEpoch`)* | — |

> **LA CATEGORIA: due punti che toccano la stessa cosa e adesso stanno in due file — e prima si trovavano leggendo un file solo.**
>
> ⚠️ **Il costo non è che siano due. Il costo è che il secondo non si trova più leggendo.** Una duplicazione dentro un file la incontra chiunque scorra quel file; una fra due file la trova solo chi la cerca, e nessuno cerca quello che non sa che esiste.
>
> **La causa è sempre la stessa:** un pezzo di conoscenza — una chiave, un oggetto, un numero, un nome — che più di un file deve avere, e che il criterio degli strati non sa assegnare. *Il criterio divide per QUANDO una cosa gira; una cosa condivisa non si divide così.*
>
> **Cosa fare quando se ne trova una, in tre mosse:** ① si nomina il punto che la **possiede** (non «dove sta meglio»: chi ha il problema che quella cosa risolve); ② gli altri gli **fanno domande** invece di toccarla; ③ la nota va **accanto al punto che possiede**, non accanto a chi chiede — *una nota su ognuno dei due è la stessa cosa duplicata un'altra volta.*

**Scritta una volta, qui, invece che sette note sparse.** *Sette occorrenze in due giorni non è una coincidenza: è la cosa che il criterio non sa fare, e il 23 ne aggiungerà altre otto occasioni.*

⚠️ **E i cinque listener globali, misurati adesso perché nessuno li aveva contati:** due `keydown` anonimi (l'Escape che chiude i tre overlay; il buffer che apre il Pannello Admin digitando `config`), `warmAudioContextOnce` su `pointerdown` **e** `keydown` con `{once:true}`, e il `click` in cattura del Blocco Ascolto. **Tutti e cinque ancora in `index.html`, nessuno estratto.** Non sono ancora «allontanati» — lo diventeranno al 23, ed è meglio saperlo prima: *un secondo listener globale non fallirebbe, raddoppierebbe.* È la forma del 21-quater su un oggetto che non ha un modulo.

**FORMA II — «una decisione rimandata con la sua condizione» (sette voci):** `APP_CONFIG_DEFAULTS` scritta e mai letta · `customizeSeenKey` mai scritta (la migrazione) · l'indicatore di caricamento (e che **lo studente può toccare di nuovo**) · la vista `pronunciation` morta · `stopAllModuleActivity` contro `BI.registraPulizia` (inglese e italiano che convivono) · uno `<script src>` che non arriva non passa da `showLoadError` · i **tre gruppi senza casa** (la regola della mastery, i suoni, il Pannello Admin).

**Queste NON sono duplicazioni**, ed è il motivo per cui tenerle separate dalla Forma I: *sono cose che sappiamo e su cui non abbiamo deciso. Metterle nello stesso elenco farebbe sembrare quindici problemi quello che è sette problemi e sette scelte.*

**E una terza forma, da sola:** il **limite di `righeDiCodiceDi()`** — 758 righe di prosa passano il filtro. È l'unica voce che riguarda **come guardiamo**, non cosa c'è. *Ed è la sola che si è ripresentata sette volte durante la serie, l'ultima dentro un'asserzione scritta dieci minuti prima.*

⚠️ **E due voci del tuo elenco che NON ho trovato, dette perché il silenzio si legge come conferma:** **`progressi.length` non esiste** (zero occorrenze in tutto l'albero, cercato di nuovo oggi), e **«i commenti rimasti veri nei fatti» non è una cosa allontanata: è una FORMA che abbiamo incontrato cinque volte e corretto cinque volte** (il commento su `moduleEpoch`, quello sulla schermata d'errore, `applyConfigOverrides`, i due su `showView`). *Un commento che resta esatto nei fatti e falso nella ragione è reale — ma qui non c'è nessun caso aperto: sono tutti chiusi.*

⚠️ **`storyCards` MISURATA, 2026-09-18 — è il caso da guardare da solo, ma per una ragione diversa da quella che sembrava.**

| | |
|---|---|
| funzioni | 16 |
| righe | 453 |
| **`openStoryCards`** | **178 righe** — la funzione più lunga misurata finora |
| `storyCardsRefreshExplanationStates` | 104 righe |
| `kind` serviti | **DUE**: `meetTheStory` e `whyWeSayIt` |
| la var più letta (`storyCardsSkillIds`) | **8** funzioni |

**Non sono quattro passi né quattro modi: sono DUE `kind` dentro un `open` solo.** *E il numero da solo non è il problema — `openDialogo` ne serve **tre**, ed è di più.*

> **La differenza sta in COSA sono i due, non in quanti sono.** I tre di Dialogo sono **profili dello stesso esercizio** (ascolta e ripeti · ripeti a tempo · dialogo continuo): stesso disegno, stesse bolle, stessa uscita. I due di storyCards sono **due esercizi diversi** — Meet the Story legge il dialogo; Why We Say It sono le card delle spiegazioni, con lo Sblocco Sequenziale per dichiarazione e 104 righe che nessun altro usa.

**Quindi la domanda resta quella giusta, e la riformulo sul misurato: `storyCards` è UN file con due modi, o DUE moduli che oggi condividono una funzione?** *Se è la seconda, il 23 non la copre e diventa un passo suo — e va guardata **dopo** gli altri sette, non prima: estrarla per prima vorrebbe dire rispondere a quella domanda mentre si trasloca.*

⚠️ **E `unaVoltaSola` RESTA, ma il suo mestiere è cambiato senza che la riga cambiasse — scritto qui perché è precisamente la forma che qualcuno correggerà per sbaglio.**

**Quando è nata (21-quater) proteggeva da:** *più aperture dello stesso modulo nella stessa sessione* — apri Flash Card, torni in mappa, riapri, e i listener si sommano.

**Dopo il 23 proteggerà da:** *il file del modulo interpretato più di una volta* — perché a quel punto ogni file si registra da sé, e un file caricato due volte (a richiesta, con una richiesta doppia) rieseguirebbe il suo corpo.

> **Sono due garanzie diverse dietro la stessa riga.** Chi la leggerà dopo il 23 vedrà una guardia contro «più aperture» — un caso che a quel punto l'`open` gestisce da sé — e la toglierà, **perdendo quella che serve davvero**. *È la ⓪-quinquies al contrario: non un commento che diventa falso, ma una difesa che resta vera per un motivo che nessuno ha scritto.*

**FATTO il 2026-09-18 — `app/suoni.js`, e NON è il settimo strato del 22: è il PRIMO che esce per servire i moduli.** 11 pezzi, 111 righe, zero dipendenze oltre `CONFIG`. *Il 22 si era dichiarato chiuso; la misura di Repeat Aloud ha detto che `sfxPlayTraguardoSound` è una delle venti irraggiungibili, e questo file esce per quello.*

**Non sta in `app/audio.js`, ed è una decisione misurata:** due meccanismi diversi del browser su due oggetti globali diversi — `speechSynthesis` (la voce, legge un testo) e `AudioContext` (i toni). **Nessuna funzione dell'uno nomina l'altro**; unirli darebbe un file con due metà tenute insieme dal fatto che tutte e due fanno rumore. *Chiude anche la terza risorsa condivisa registrata il 2026-09-18: `sfxAudioCtx` ha ora un padrone.*

⚠️ **IL QUARTO TIPO DI GUASTO, ed è il più silenzioso dei quattro** — misurato bloccando il file: **login SI, casa SI, mappa SI, errori JS ZERO.** L'app funziona e basta. *Il guasto compare al primo Corretto, dentro un esercizio, minuti dopo l'avvio, quando nessuno collega più le due cose.*

⚠️ **E UNA FALSIFICAZIONE CHE NON HA MORSO DOVE DOVEVA, che vale più di quelle che mordono.** Previsione: rendendo introvabile l'`AudioContext`, `[B]` «chiamare un suono non solleva» **resta verde** — e infatti è rimasta. *«Non solleva» non distingue «il suono è uscito» da «non è uscito in silenzio»: è la misura che non misura, in un'asserzione che avevo appena scritto io.* Aggiunta la riga che chiede che il contesto **esista**; rifatta la falsificazione, adesso cadono due righe su dodici. **Ed è caduta anche una riga strutturale che non avevo previsto: lo scarto ha mostrato il buco al posto mio.**

**Previsioni sui due posti del conto degli script:** `BASELINE-AVVIO` (1 cambiata + 1 aggiunta, 7→8) e `test_avvio_invariato [D]` (7→8). **Esatte.** ⚠️ **E nella storia del baseline ho dovuto correggere una riga scritta ieri da me: «da qui il conto non cambia più fino al 23» — falsa dopo un giorno.**

**FATTO il 2026-09-18 — `app/quiz-engine.js`, seconda delle cinque cose che servono al primo modulo.** 9 pezzi, 110 righe, zero dipendenze oltre `CONFIG`.

⚠️ **IL CRITERIO NON È L'ELENCO DEL PIANO, ed è il primo confine della serie che la misura ha RESPINTO invece di confermare.** Il piano metteva qui anche `renderStars`. Misurata: **`starsForPercent(pct)` torna un NUMERO, `renderStars(count)` torna una stringa di HTML** con la classe `vc-star`. *La prima è una regola, la seconda è un disegno.* Il criterio diventa: **ci sta dentro chi restituisce un valore, non chi restituisce markup** — e `renderStars` va in `ui-condivisa`.

> **Le due si chiamano quasi uguale e stanno una sotto l'altra.** Portarla fuori **non avrebbe rotto niente**: l'app sarebbe identica, la suite verde, e `quiz-engine.js` sarebbe stato il primo file di strato con del markup dentro. *Un confine sbagliato che non produce nessun rosso è quello che si eredita.* C'è un'asserzione che vieta il markup nel file, e falsificandola (portando `renderStars` dentro) cadono due righe su quattordici.

⚠️ **E IL GUASTO SI VEDE ANCORA PIÙ TARDI DEI SUONI — misurato, e la misura ha smentito la mia previsione.** Senza il file: **login SI, casa SI, mappa SI, un modulo si apre SI, errori JS ZERO.** *Credevo che `shuffle` dentro `openStoryCards` uccidesse l'apertura; quel ramo non si percorre col profilo `meet`.* **Il guasto compare quando un esercizio CALCOLA**: la prima risposta valutata, la prima percentuale, il primo mazzo mescolato. *Su Pages non basta «si apre», e non basta nemmeno «il modulo si apre»: si risponde a un quiz.*

**`[B]` non si accontenta che le funzioni esistano: chiede quattro risposte NOTE**, una per famiglia (distanza, conteggio, soglia, giudizio). *Un motore che c'è e risponde sbagliato è peggio di uno che manca* — falsificato facendo tornare `similarity` sempre 1: cade solo quella riga, e l'app non alza nessun errore.

**Previsioni sui due posti:** `BASELINE-AVVIO` (8→9) e `test_avvio_invariato [D]` (8→9). **Esatte, quarta volta di fila.**

**FATTO il 2026-09-18 — `app/personalizza.js`, IL PRIMO MODULO.**

Il caso **più diverso** degli otto, scelto apposta: l'unico senza `dataFile`, l'unico di categoria Inizio. *Il caso più diverso non va tenuto per ultimo: va messo per primo, quando la forma è ancora modificabile* — è il ribaltamento della regola 42, e ha funzionato: ha trovato **tre confini sbagliati** prima che diventassero la forma di tutti e otto.

**Undici nomi all'insù verso `index.html`, e la ragione è scritta nel file:** un modulo non può non nominare l'episodio su cui lavora. Sei spariranno coi resti di `ui-condivisa` e con `mappa`, tre col catalogo, **due** solo quando lo stato di sessione avrà una casa. *Se al terzo modulo è ancora undici, il progetto si è fermato e quel file è il posto dove si vede.*

**Il tag sta nella SECONDA fila, dopo `ui-condivisa`** — e non per stile: gli alias si prendono il valore a tempo di parsing. È la prima volta che l'ordine dei tag rompe qualcosa davvero.

---

**FATTO il 2026-09-18 — `app/ui-condivisa.js`, e i moduli adesso possono cominciare.**

29 pezzi, 430 righe, seconda fila. È l'interfaccia che un modulo **indossa** e che non sa quale modulo sia: i due overlay, i testi letti dal file delle istruzioni, il sottotitolo d'esito, le stelle, i pulsanti di velocità, i risolutori di segnaposto.

**Il criterio non l'ho scelto, l'ha scelto la misura:** partendo da dieci pezzi e chiudendo per iterazione, l'insieme si ferma a 29 con **zero** dipendenze che non siano già fuori. È esattamente la linea dove chiude.

⚠️ **TRE CONFINI RESPINTI, E DUE CORREGGONO UNA MIA ASSEGNAZIONE DI DUE GIORNI PRIMA.**

**①** `itemText` **non entra**, benché ce l'avessi mandata io stesso. È una riga sola, ma quella riga **lega i due globali di sessione**: aggiungendola l'insieme smette di chiudere (30 pezzi, 2 bloccanti, otto giri). `fillTemplate` invece entra pulita, perché episodio e valori **li prende come parametri**. *La differenza è tutta lì: una li riceve, l'altra li va a prendere.*

**②** `slotOptions`, `slotField`, `slotDefault`, `resolveSlotValue` entrano **qui** e non in Personalizza, dove li avevo messi il giorno prima: `fillTemplate` li chiama, e serve a quattro moduli.

**③** `buildMultipleChoiceOptions` e `recordMultipleChoiceResult` restano fuori benché condivisi: chiamano `itemText` e `recordPendingMastery`. Escono con lo stato di sessione.

> **Decimo e undicesimo confine bocciati dal criterio, e sono il secondo e il terzo contro una decisione MIA invece che del piano.** Finora il criterio correggeva il piano; adesso corregge anche chi lo applica.

⚠️ **E LA DICHIARAZIONE CHE HO SCRITTO ERA FALSA.** `// DIPENDE DA: nessuno`, e il file chiama `istruzioniInMemoria()`, `loadModuleInstructions()`, `loadFeedbackMessages()`, `percentageBucket()` — quattro nomi di altri due strati. **Nessuna verifica strutturale l'ha vista: le ha passate tutte.** L'ha trovata la riga che **guida l'app**, con `uiText is not defined`. *Una dichiarazione si può sbagliare come qualunque altra riga: è il confronto col codice che la tiene vera, non il fatto di averla scritta.*

**E quei quattro alias sono la PRIMA dipendenza a tempo di parsing del progetto** — le tre precedenti erano tutte a tempo di chiamata. Da oggi **l'ordine dei tag è un vincolo vero**, non solo dichiarato.

⚠️ **Il listener di Escape NON è in questo file, ed è voluto:** chiude **tre** overlay, e il terzo è del Pannello Admin. Non appartiene a nessuno dei due posti da solo, quindi resta in `index.html` e chiama `BI.closeOverlay()` / `BI.closeHowItWorksOverlay()`. *Portarlo qui sarebbe scambiare «sta vicino» con «è suo», che è l'errore che questa serie corregge da undici confini.*

**Cosa sblocca, che è il motivo per cui è stato fatto adesso:** Personalizza scende da **16 a 9** dipendenze all'insù, storyCards altrettanto. I moduli possono cominciare.

---

**FATTO il 2026-09-18 — `app/orchestrazione.js`, e nasce una SECONDA FILA di caricamento.**

Due pezzi soli — `views` e `showView` — ma il passo non è piccolo: è il primo file che **tocca il markup mentre viene letto**. I nove strati precedenti stanno in `<head>` e non toccano un solo elemento (l'unico DOM a tempo di parsing in tutto `app/` sono i due `document.addEventListener` di `suoni.js`, cioè sul documento, che esiste sempre). `views` prende **tredici nodi** con `getElementById`: in `<head>` sarebbero tredici `null`.

> **Il criterio degli strati divide per QUANDO una cosa gira, e qui la differenza non è di dimensione ma di natura:** i nove di `<head>` girano *prima del DOM*, questo *dopo*. Metterlo nella prima fila sarebbe far coincidere due momenti diversi perché portano lo stesso nome — «uno strato».

**Da oggi la domanda non è «posso mettere il tag in `<head>`?» ma «questo file tocca il markup mentre viene letto?».** `ui-condivisa` andrà nella stessa fila, per la stessa ragione: `helpOverlayEl`, `howItWorksOverlayEl` e cinque `addEventListener` sul markup.

⚠️ **E la conseguenza che è scritta NEL FILE e non qui, perché è lì che va letta:** otto delle tredici chiavi di `views` assomigliano a otto moduli che al 23 usciranno in file loro. **Oggi non è una dipendenza in avanti** — questo file non chiama nessuna di quelle funzioni, tiene dei nomi di chiave che corrispondono a id del markup. **Ma quando i moduli usciranno il verso cambia, e non perché cambia lui: perché cambiano loro.** Saranno i moduli a nominare `BI.showView`. Senza quella riga, fra un mese sembrerebbe un'estrazione fatta male.

**`goHome` NON è uscita, ed è la parte da decidere.** Legge `currentEpisode.badge`, e `currentEpisode` è `EPISODES[CONFIG.episodioCorrente]` — appartiene al **catalogo**, che è ancora dentro `index.html`. Farla uscire significa una **seconda dipendenza all'insù**, della stessa specie già dichiarata per `BI.applyEpisodeDialogue`. È fattibile e coerente, ma farebbe salire il conto che `test_dipendenze_dichiarate.js` dice di far **calare, mai salire** — una riga scritta ieri. Non la alzo da solo: è una decisione, non un dettaglio di questo passo.

**`boot` esce dopo `mappa`**, e la formulazione conta: non «boot va altrove», ma «boot deve uscire dopo mappa». Il piano lo dava come gruppo di tre; la misura lo spezza per una **dipendenza**, non per un criterio.

---
**FATTO il 2026-09-18 — la dichiarazione delle dipendenze, e NON era nel piano.**

Nasce da una domanda: *«quante funzioni di modulo sono nominate da uno strato? Se sono poche è un caso, se sono molte l'ordine dei file diventa un vincolo vero.»* La risposta misurata è **24 su 134**, e si divide in due gruppi diversi: **sette** condivise per mestiere che stanno in mezzo a un modulo solo per posizione, e **diciassette** davvero interne a un modulo e chiamate da codice generico — `closeAttemptPopup` da riga 4010, `dgAudioProtected` da 10540, `vcUpdateMicNotice` da 3022.

> **Quindi la risposta giusta non era «diventerà un vincolo»: lo È GIÀ, e lo era prima di questo passo.** Da oggi si dichiara invece di scoprirlo.

Ogni file di `app/` porta in testa `// DIPENDE DA:`, e `tests/test_dipendenze_dichiarate.js` la confronta col grafo **misurato dal codice**. L'elenco non sta dentro il test di proposito: un elenco scritto a mano invecchia al primo strato nuovo, in silenzio, e continua a leggersi bene — la stessa forma che in `CLAUDE.md` aveva lasciato quattro file di contenuto senza protezione.

**Il grafo vero è piccolo, ed è una buona notizia:** tre dipendenze, tutte a tempo di **chiamata**, quindi **oggi l'ordine dei tag non è ancora un vincolo stretto**. Una sola va **all'insù** (`dati.js` → `index.html`), ed è per scelta dichiarata.

⚠️ **Tre cose NON fatte in questo giro, e il motivo è lo stesso: nel repository non c'erano.** `stopAllAudio` non esiste in nessuna delle forme della regola 41 — l'unico `stopAll*` è `stopAllModuleActivity`, 31 occorrenze. Non ci sono nomi definiti in due file (solo `CONFIG`, cinque alias allo stesso globale). E delle sette condivise **tre** cominciano per `render`, non sei, e stanno in tre regioni diverse — lo `switch` che le avrebbe chiamate insieme non esiste dal passo 21, sostituito da `BI.moduli[kind]`.

---

**FATTO il 2026-09-18 — `app/dati.js`, terza delle cinque cose che servono al primo modulo.** 14 pezzi, 157 righe — **poi 12 esposti e uno in più, dopo il rosso qui sotto.**

⚠️ **E IL GIRO NON È FINITO COM'ERA COMINCIATO: LA SUITE È ANDATA ROSSA SU SETTE FILE, E LA CAUSA ERA UNA SOLA.**

Tre delle quattordici cose esposte erano **variabili riassegnate** — `moduleInstructionsCache` e due sorelle. Il ponte degli alias copia il **valore del momento**, cioè `null`, e non lo aggiorna mai più; `uiText()` legge la cache **senza aspettare**. Da fuori la cache è rimasta `null` per sempre, e **ogni testo dell'interfaccia è uscito stringa vuota**: l'app cammina, apre la mappa, apre i moduli, e non ha parole.

È la **stessa forma già incontrata e già chiusa** con `moduleEpoch` (diventato `nuovaEpoca()`/`epocaCorrente()`): *un alias congela un valore, una chiamata va a leggerlo adesso.* Chiusa allo stesso modo — **`istruzioniInMemoria()`** — e le altre due **non escono affatto**, perché nessuno le legge da fuori.

> **MA LA COSA DA PORTARSI DIETRO È L'ALTRA METÀ, e vale più del guasto.** `verificaStruttura` — l'aiutante condiviso dai sei test di strato — chiedeva *«ogni nome esposto ha il suo alias»*. Quella domanda è **falsa per una classe intera di nomi**: per una variabile che cambia, l'alias è esattamente la cosa da non fare. **La riga che doveva difendere il confine chiedeva di romperlo.** Nove strati ci sono passati perché nessuno aveva ancora esposto una variabile che cambia.

Da oggi c'è `nomiRiassegnati()` e l'asserzione che **vieta** l'alias su un nome che lo strato riassegna (+1 × 6 file, baseline **1368 → 1374**): il guasto cade sulla riga che lo nomina, invece che su sette file lontani che parlano d'altro. *Dei sette rossi, **sei** venivano dall'alias e **uno** era un'altra cosa — `test_tabelle_personalizzazione.js` cercava `PERSONALIZATION_TABLES_FILE` in `index.html` dopo che la costante era andata in `app/dati.js` (⓪-undecies, quinta volta). Due difetti diversi nello stesso commit, e il secondo si vedeva solo dopo aver tolto il primo.*

*Terza volta in tre giorni che un confine sbagliato non produce nessun rosso — `renderStars`, `applyEpisodeDialogue`, e adesso questo. Le prime due le ha respinte la misura prima di entrare; **questa è entrata**, ed è costata una suite intera. La differenza fra le due è che le prime due le stavo guardando.*

⚠️ **DUE CONFINI RESPINTI DALLA MISURA, e sono la parte che conta più delle righe spostate.**

**① `itemText` non è di `dati`.** Nomina `currentEpisode`, `currentValues`, `fillTemplate`: non **carica** un testo, lo **rende** coi segnaposto dello studente. Va con `personalizza`. *Ci stava per nome — «testo di una voce» — e non per mestiere.*

**② `applyEpisodeDialogue` è rimasta col catalogo**, ed era l'unica delle quindici che **scrive** invece di leggere. Scrive `EPISODES`, che non è suo. **La strada comoda era esporre `EPISODES` su `BI`: due righe, suite verde, e il catalogo scrivibile da qualunque file per sempre.** *Scelta la strada opposta — la funzione resta con chi possiede il dato, e il caricatore le chiede (`BI.applyEpisodeDialogue(data)`).* Falsificando la strada comoda cadono tre asserzioni su quattordici; **l'app funziona identica**, che è precisamente perché serviva un'asserzione.

> **Seconda volta in due giorni che la misura respinge un confine che non avrebbe prodotto nessun rosso.** La prima era `renderStars` in `quiz-engine`. *Un confine sbagliato che non produce nessun rosso è quello che si eredita — e i sei file che restano imiteranno questo.*

⚠️ **E UNA DELLE TRE ASSERZIONI È NATA DEBOLE: cercava la chiamata nel TESTO del file, e il commento in testa la CITA fra apici inversi.** Con la chiamata tolta restava verde. **Nona comparsa della famiglia del conto sui commenti, in un'asserzione scritta venti minuti prima** — e trovata perché la previsione della falsificazione diceva 11/14 e l'osservato era 12/14. *Lo scarto di uno ha trovato il buco.*

**I QUATTRO `fetch` DELL'APP SONO ORA IN UN FILE SOLO** — `module.dataFile`, `MODULE_INSTRUCTIONS_FILE`, `FEEDBACK_MESSAGES_FILE`, `PERSONALIZATION_TABLES_FILE` — e in `index.html` non ne resta nessuno, con un'asserzione che lo dice. *Il piano prevede di unificarli, e non è questo il passo: ma chi vorrà farlo ha un file da leggere invece di quattro punti distanti duemila righe.*

⚠️ **IL GUASTO È IL PIÙ RUMOROSO DEI SEI: senza il file non parte niente**, né login né casa. `episodeDataFile(id)` gira mentre `MODULE_DESCRIPTORS` viene costruito, a tempo di parsing. *Su Pages basta aprire.*

**FERMATE: una per strato, come prima.** | ☐ | **sì**, uno strato per volta |
| **23** | I moduli, uno per famiglia: match+speedMatch, storyCards, dialogo, flashcard, voice, repeatAloud, personalizzazione, mappa+admin. **~15 file in tutto, quindi ~15 fermate.** ~~Un modulo sta fra 365 e 670 righe.~~<br><br>⚠️ **RICONTATO il 2026-09-18, e la forbice è FALSA su quattro gruppi su nove:**<br><br>| gruppo | funzioni | righe |<br>|---|---|---|<br>| voice | 17 | **621** |<br>| dialogo | 29 | 510 |<br>| storyCards | 16 | 453 |<br>| personalizza | 22 | 392 |<br>| flashcard | 15 | 317 |<br>| speedMatch | 20 | **313** |<br>| mappa+admin | 24 | **286** |<br>| match | 11 | **263** |<br>| repeatAloud | 3 | **106** |<br><br>**La forbice vera è 106–621**, e il minimo dichiarato (365) è sbagliato su quattro. *`repeatAloud` è il caso che spiega gli altri: 106 righe in tre funzioni, perché il Blocco Ascolto è diventato un componente condiviso (C.3) e i suoi listener sono entrati dentro `openRepeatAloud` (21-quater ④). **Non è un modulo piccolo: è un modulo a cui abbiamo tolto le parti condivise, una alla volta, e nessuno ha ricontato dopo.***<br><br>⚠️ **CHE COSA HA CAMBIATO IL 21-QUATER DI QUELLO CHE QUESTO PIANO DÀ PER FERMO — tre cose, e la terza è una decisione, non un numero.**<br><br>⚠️ ⚠️ **IL 23 NON PUÒ COMINCIARE, E IL MOTIVO È MISURATO — 2026-09-18, provando a estrarre Repeat Aloud.**

Ho preso il primo modulo scelto col criterio nuovo e ho misurato le sue dipendenze prima di muovere una riga. **Repeat Aloud, 3 pezzi e 106 righe, nomina 23 cose che non sono sue. Di queste, TRE sono raggiungibili da un file separato (`getUserName`, `isIntroDismissed`, `setIntroDismissed`, già su `BI`); VENTI no.**

**E non è una sua particolarità — misurati tutti e sei:**

| modulo | pezzi | righe | dipendenze | già su `BI` | **irraggiungibili** |
|---|---|---|---|---|---|
| repeatAloud | 3 | 106 | 23 | 3 | **20** |
| match | 11 | 263 | 49 | 3 | **46** |
| speedMatch | 20 | 313 | 51 | 3 | **48** |
| flashcard | 15 | 317 | 52 | 5 | **47** |
| dialogo | 29 | 510 | 51 | 9 | **42** |
| voice | 17 | 621 | 74 | 5 | **69** |

> **Il modulo più piccolo dell'app ha bisogno di venti nomi che fuori da `index.html` non esistono. Se il più piccolo ne ha venti, gli altri ne hanno di più — e infatti ne hanno fino a sessantanove.**

⚠️ **E LA COSA CHE HO SBAGLIATO A DIRE, corretta qui: «il 22 è chiuso» era vero per gli STRATI e falso per il 23.** Il censimento del 2026-09-18 lo diceva già — `dati`, `vista`, `ui-condivisa`, `quiz-engine`, i suoni, la regola della mastery e il Pannello Admin sono **ancora dentro** — ma l'ho registrato come «tre gruppi senza casa», cioè come una questione di catalogazione. **Non lo era: è la condizione di possibilità del 23.** *Un modulo non è una foglia. Un modulo è la cosa che usa tutto il resto — ed è il primo pezzo del progetto per cui «estrarre» significa «avere già estratto tutto quello che tocca».*

**I venti di Repeat Aloud, per strato — ed è la lista di cosa deve uscire prima:**

| strato | cosa gli serve |
|---|---|
| **`dati`** | `loadEpisodeData`, `episodeDataCache`, `episodeGrade`, `episodeGradeRequired`, `itemText` |
| **`ui-condivisa`** | `renderListenBlock`, `speakListenBlock`, `openHowItWorksOverlay`, `openHelpFor`, `renderIntroContent`, `moduleNameHtml`, `moduleTypeLabel`, `applyOutcomeSubtitle`, `introDismissPref` |
| **`vista`** | `leaveModule`, `showLoadError` |
| **`mappa`** | `openEpisodeMap`, `completeModule` |
| **i suoni** | `sfxPlayTraguardoSound` |

**L'ordine che ne discende, dalle foglie verso l'interno:** ① **i suoni** e **`quiz-engine`** (foglie, nessuno dei due dipende dagli altri) · ② **`dati`** · ③ **`ui-condivisa`** · ④ **`vista`** (ha bisogno di `dati` per `showLoadError`) · ⑤ **`mappa`+admin** · **e solo allora il primo modulo.**

⚠️ **E una cosa trovata misurando, piccola e da non perdere: `currentRepeatAloudModule` è una `var` che appartiene a Repeat Aloud** e che il mio elenco di pezzi non aveva (contavo tre funzioni). *Quando quel modulo uscirà, deve uscire anche lei — ed è la stessa forma di `ICONS` allo strato `identita`: un dato che non è una funzione e che una misura per funzioni non vede.*

⚠️ **E PRIMA DELLE TRE, UNA COSA MISURATA SUL PIANO STESSO: la riga del 23 NON DICE NIENTE sui listener.** Cercato: nessuna frase del tipo «i listener del modulo restano fuori». **Quindi il rischio non è una riga vecchia da correggere — è il SILENZIO**, che si legge come «su questo non è cambiato niente». *Una riga sbagliata la si trova rileggendo; un silenzio no, perché non c'è niente da rileggere.* Il piano è del 15 settembre, il 21-quater ha spostato ~80 listener dentro le `open` fra il 16 e il 17, e **la riga del 23 è identica a prima e a dopo.**

⚠️ **IL SUBSTRATO C'È GIÀ, E NON C'È NESSUNO `switch` DA SOSTITUIRE — misurato il 2026-09-18, prima di proporre di costruirlo.**

`openModuleByKind` è **già** guidato dal registro: `var apri = BI.moduli[module.kind];` — niente `switch`, niente catena di `if`, niente coincidenza. Il meccanismo è nato al **21** (`BI.registraModulo`), ha avuto i suoi utenti al **21-bis** e **21-ter**, ed è protetto da `test_moduli_registrati.js` e `test_spazio_nomi.js`. **La mappatura vera è 14 `kind` → 8 funzioni di apertura**, e le registrazioni sono quattordici righe esplicite in fondo a ogni modulo.

⚠️ **E LA RISPOSTA ALLA DOMANDA «QUALI PUNTI IL SUBSTRATO CHIUDE E QUALI NO» — misurata riga per riga, perché è la premessa del 23 e una premessa creduta non si verifica.**

| chi nomina un modulo | quanti | il substrato lo chiude? |
|---|---|---|
| **`MODULE_DESCRIPTORS`** — il catalogo: quale `kind` ha ogni passo | **15** | **No, e non deve.** È il **dato**, non una dipendenza: l'episodio dichiara i suoi passi. Un catalogo che non nomina niente non è un catalogo |
| **`BI.registraModulo('kind', openX)`** in fondo a ogni modulo | **14** | **Già chiuso dal 21.** È il modulo che si dichiara da sé, e al 23 quella riga parte insieme al suo file |
| **`openModuleByKind`** | **1** | **Già chiuso dal 21-ter.** Legge `BI.moduli[kind]`: non nomina nessun modulo |
| ⚠️ **`'personalizzazione'` scritto dentro funzioni che NON sono di Personalizza** | **4** | **NO. Questi restano aperti** |

**I quattro, con il nome della funzione:** `migrateCustomizeSeenToModuleProgress` (**3** righe) e `hasStartedEpisodeModules` (**1**). *Sono tutte e due funzioni della mappa e dei progressi, non di un modulo — e nominano Personalizza perché Personalizza è speciale: l'unico senza `dataFile`, l'unico il cui completamento fa da cancello agli altri, l'unico con una migrazione alle spalle.*

> **Quindi: tre categorie su quattro sono già chiuse, e la quarta è una sola, ha un nome, e riguarda un modulo solo.** *Il 23 può cominciare — ma sapendo che per Personalizza la premessa «il modulo che esce non è nominato da fuori» è **falsa per quattro righe**, e che vanno chiuse prima di estrarre QUEL modulo, non prima di estrarre il primo.*

⚠️ **E UNA COSA DA DECIDERE PRIMA DI SCEGLIERE LA CHIAVE DEL CARICAMENTO A RICHIESTA: `BI.moduli` È INDICIZZATO PER `kind`, E I `kind` SONO 14 PER 8 FILE.** `openDialogo` ne serve **tre**, `openStoryCards`, `openVoiceCoach`, `openMatch` e `openSpeedMatch` **due** ciascuno. **Un caricatore indicizzato per `kind` chiederebbe tre volte lo stesso file per Dialogo** — o, peggio, tre volte in parallelo se tre passi si aprissero vicini. *La chiave del caricamento è il FILE, non il `kind`: serve una seconda mappa (`kind → file`) accanto a quella che c'è (`kind → funzione`), oppure il registro dichiara il file insieme alla funzione.* **È la stessa mossa del 21-ter — guardare quanti `kind` stanno dietro una funzione prima di scegliere la chiave — e stavolta il precedente c'era già.**

> **Quindi non manca un meccanismo: manca una DECISIONE.** Il substrato regge già il caricamento a richiesta — `openModuleByKind` è asincrono dal 21-ter apposta, e il messaggio d'errore ha già le **due cause distinte** scritte per il giorno in cui la seconda diventa possibile. *Quel giorno è il 23, e la riga che lo dichiara è `BI.moduliCaricatiAlBoot`.*

**① Un modulo è diventato AUTOSUFFICIENTE per costruzione, e il 23 ne guadagna.** Quando il piano è stato scritto, gli ~80 listener stavano al primo livello dell'IIFE: estrarre un modulo avrebbe voluto dire trovarli e portarli dietro uno per uno, e il tredicesimo dimenticato sarebbe stato un pulsante muto. Adesso stanno **dentro l'`open` della propria famiglia**, dietro `BI.unaVoltaSola('<famiglia>', …)`: il file del modulo se li porta perché sono nel suo corpo. *Il 21-quater non era un passo preparatorio dichiarato — lo è diventato.*<br><br>**② LE FAMIGLIE SONO OTTO, I GRUPPI DEL PIANO NOVE, E NON COINCIDONO.** `BI.unaVoltaSola` conosce `voice, personalizza, match, speedMatch, dialogo, storyCards, flashcard, repeatAloud`. Il piano mette **`match+speedMatch` in un file solo** (due famiglie) e **`mappa+admin` in un file** che **non ha nessuna famiglia**. *Non è un errore del piano: è che le due partizioni rispondono a due domande diverse — «chi condivide i listener» e «cosa sta bene in un file». Ma vanno riconciliate PRIMA, perché un file che contiene due famiglie ne registra due, e uno che non ne contiene nessuna non registra niente.*<br><br>**③ ⚠️ E LA DECISIONE CHE IL 23 NON PUÒ RIMANDARE: i file dei moduli arrivano al boot o a richiesta?** Ogni modulo oggi fa `BI.registraModulo(...)` **mentre il suo codice viene letto**, e `BI.moduliCaricatiAlBoot` è `true` da quando esiste. Se i file arrivassero **a richiesta**, quella riga diventa `false` — e il 21-ter ha già scritto il messaggio d'errore con **le due cause distinte** per quel giorno. **È il primo cambiamento di `BASELINE-AVVIO.txt` per una ragione di COMPORTAMENTO e non di conto degli script**, e va dichiarato prima di cominciare, non scoperto al quinto modulo. *Si lega alla voce già aperta: uno `<script src>` che non arriva non passa da `showLoadError`, e a richiesta smette di essere un caso raro.* | ☐ | **sì**, un modulo per volta |
| **24** | **DUE file, non uno** (deciso il 2026-09-09): `componenti-condivisi.md` e `componenti-singoli.md`. Ogni pezzo estratto finisce in una delle due liste, e **non c'è un terzo posto dove metterlo**: niente resta fuori, niente si cancella, niente blocca chi estrae. Si riempiono **nello stesso commit** di ogni estrazione, e i file **nascono con la prima estrazione**, non prima — un file vuoto in attesa è un invito a riempirlo di intenzioni.<br><br>*Perché due e non uno, e il buco che ha chiuso: il criterio «un pezzo ci sta se e solo se è usato da più di un modulo» è verificabile, ma **sette copie identiche non sono "usate da più di un modulo": ognuna è usata da uno**. Con un file solo, lo spacchettamento avrebbe messo sette righe separate e il documento sarebbe nato dicendo «il Blocco Ascolto non è un componente condiviso» — vero secondo il criterio, falso secondo la realtà. Con due file, alla fine si LEGGE la seconda lista: sette voci con lo stesso nome saltano all'occhio. **Il controllo diventa leggere, non cercare.***<br><br>*I nomi sono stati scelti contro la prima proposta, ed è la ragione dello scarto che conta. La prima era `pezzi-di-un-modulo.md`, con l'argomento «un componente è condiviso per definizione, quindi il nome dice la regola d'ingresso»: **codifica il criterio di catalogazione, che si usa una volta per riga, e ignora l'uso, che è quotidiano.** Quel file è un magazzino da cui si preleva, e da un elenco di «pezzi» non si preleva — la parola dice scarti, ritagli, roba avanzata.*<br><br>*Tre ragioni per `componenti-singoli.md`: **«singolo» non nega «componente»**, dice che oggi lo usa uno solo, cioè cosa può diventare; i due nomi **differiscono per una parola sola**, quindi stanno vicini in qualunque elenco e cercando «componenti» escono tutti e due (per un file la cui ragione d'essere è «guarda qui prima di scrivere», essere difficile da trovare è il difetto centrale); e lo spostamento fra i due file diventa **un cambio di aggettivo invece che di categoria** — più piccolo, quindi più probabile che succeda davvero.*<br><br>*Cautela: «singolo» si può leggere come «componente semplice». Si chiude con la prima riga del file, non col nome.*<br><br>**Le tre fragilità, tutte e tre accolte:**<br>① **Tre campi corti e fissi per ogni riga, non un paragrafo.** **«Cosa fa»** — il comportamento nelle parole di chi ne ha bisogno, non del modulo che ce l'ha (*«pulsante ascolta + velocità» sette volte di fila si vede; «audio di Repeat Aloud» no*). **«Cosa gli passi, cosa restituisce»** — la firma in chiaro. E **«cosa dà per scontato»**: *«vuole un contenitore già flex», «il testo lo risolve chi chiama», «scrive nel localStorage dell'episodio corrente», «va chiamato dopo che i dati sono arrivati».*<br><br>*Il terzo campo esiste perché **la gente non riscrive un pezzo perché non l'ha trovato — riscrive perché l'ha trovato e non ha capito se le andava bene.** Una firma non lo dice; i presupposti sì. Per il Blocco Ascolto quel campo avrebbe detto «vuole `.listen-block` intorno», che era esattamente l'informazione che serviva.*<br>② **La regola del passaggio:** quando un secondo modulo comincia a usare un pezzo, la riga si sposta nei condivisi **nello stesso commit che lo deduplica**. Mai in due posti, mai «poi». *Il secondo file non è un cimitero, è una sala d'attesa.*<br>③ **Il costo dichiarato:** i pezzi duplicati si estraggono come duplicati e quel lavoro si fa due volte. Accettato, per la stessa ragione per cui C.3 si è fatto **prima** dello spacchettamento: fermarsi a deduplicare mentre si trasloca rende il trasloco impossibile da diagnosticare.<br><br>⚠️ **LA GREP CHIUSA, e sta scritta qui dentro apposta.** Prima di scrivere la riga di un pezzo, si prende **UNA stringa distintiva da dentro quel pezzo** — una classe CSS, un `aria-label`, un attributo `data-` — e la si cerca nel repository.<br><br>*È la differenza che conta: un censimento è una ricerca **aperta** («trova tutte le duplicazioni»), e fallisce in silenzio perché non ha un criterio di completezza — «non ho trovato altro» è indistinguibile da «non ho cercato bene». Questa è **chiusa**: una stringa che hai davanti, un comando, un numero. **O il numero è 1, o non lo è.** È esattamente come sono state trovate le sette copie del Blocco Ascolto: non un censimento dei componenti audio, ma la classe che si aveva sotto gli occhi, cercata.*<br><br>*Il limite, e per questo le due difese si completano: la grep chiusa trova le copie che condividono almeno una stringa, non sette copie riscritte ognuna con le sue classi. Quelle le prende la lettura finale della seconda lista. La grep prende il caso al momento dell'estrazione, quando costa poco; la lista prende il resto, tardi ma da qualche parte.*<br><br>*E sta dentro questa riga e non in un documento a parte per una ragione precisa: costa dieci secondi per pezzo, sette minuti su quaranta estrazioni. **Non è il tipo di controllo che si salta perché costa, è il tipo che si salta perché ci si dimentica che esiste.**<br><br>⚠️ **IL SECONDO FILE NON È SOLO UNA LISTA DA LEGGERE ALLA FINE: è il magazzino che si consulta PRIMA di scrivere un modulo nuovo**, in tre passi. ① Guardo nei condivisi. ② Guardo nei singoli — **e se trovo qualcosa che fa quello che mi serve LO PROMUOVO invece di riscriverlo**. ③ Solo come ultima spiaggia ne creo uno nuovo.<br><br>*Il passo ② è quello che oggi manca, ed è **il motivo per cui esistono sette Blocchi Ascolto**: nessuno aveva un posto dove guardare prima di scrivere. E risponde a una domanda diversa dalla grep chiusa, in un momento diverso — la grep è retrospettiva («questo pezzo che ho in mano è duplicato?»), la consultazione è preventiva («esiste già qualcosa che fa questo?»). La grep li avrebbe trovati allo spacchettamento, cioè anni dopo che erano nati; il passo ② avrebbe impedito al **secondo** di nascere. Servono tutte e due e non si sostituiscono.*<br><br>**Il controllo finale sono DUE cose, non una.** **Leggere la lista** dice *cosa c'è* e trova le duplicazioni fra righe. **La riconciliazione modulo per modulo** dice *se manca qualcosa*, e prende il caso che la lettura non può prendere per costruzione: **un pezzo mai scritto da nessuna parte è invisibile in un elenco di pezzi scritti** (stessa forma della famiglia ⓪).<br><br>⚠️ **E la riconciliazione ha una chiusura, altrimenti è una ricerca aperta** — cioè la cosa che la grep chiusa esiste per non essere. Non è «guardo ogni modulo e vedo se manca qualcosa», è: **per ogni file di modulo, ogni funzione che definisce e ogni classe CSS che introduce deve comparire in esattamente uno dei due elenchi.** Si contano le definizioni nel file, si contano le righe nei due elenchi, e i due numeri devono tornare. *L'esito è un numero, non un'impressione: o torna, o non torna — e se non torna, dice quali definizioni sono scoperte. Ed è verificabile a macchina, quindi prima o poi diventa un test.*<br><br>⚠️ Una riga rimandata è una riga scritta dopo guardando il risultato, cioè un censimento invece di una decisione registrata. | ☐ | **sì** |
| **25** | `CLAUDE.md`: la regola 6, la riga «L'app vive in un file solo», **e la regola 8** — che oggi nomina un solo file di testi condivisi mentre ne esistono due (`istruzioni-moduli.json` e `messaggi-feedback.json`).<br><br>⚠️ **E LA SCHERMATA MORTA NON È PIÙ INERTE — misurato il 2026-09-18, dopo l'estrazione di `app/audio.js`.** Finché tutto stava in un file, `view-pronunciation` era codice che non si apriva e basta: toglierlo era una potatura. **Adesso ha DUE tentacoli vivi verso un file estratto**, e vanno in direzioni diverse:<br><br>| dove | cosa | quando gira |<br>|---|---|---|<br>| dentro un listener | `toggleSpeak(currentPhraseText(), speakBtn)` | mai — nessuno apre quella vista |<br>| **al primo livello** | `speakBtn.disabled = !vocePossibile();` | **a ogni caricamento** |<br><br>**Il secondo è quello che conta, e la conseguenza è controintuitiva: è la riga che rende VISIBILE l'assenza di `app/audio.js`.** Misurato: senza quel file l'app muore lì, sul primo livello, con `TypeError: vocePossibile is not a function` — prima ancora di `boot()`. **Togliendo la schermata morta si toglie anche quella riga, e il guasto «il file audio non è arrivato» smette di comparire subito e ricompare più tardi, al primo 🔊, cioè in silenzio.**<br><br>*Chi farà il 25 deve saperlo: non sta togliendo codice inerte, sta togliendo anche un rilevatore che non sapeva di avere.* **Da decidere lì, non adesso:** o la vista se ne va con la sua riga e si accetta il guasto tardivo, o quella riga si sostituisce con una guardia esplicita sull'arrivo degli strati. | ☐ | **sì** |
| **26** | Collaudo dopo lo spacchettamento. *«La suite verifica quello che qualcuno ha pensato di verificare, e un trasloco non è finito quando la suite è verde.»* | ☐ | — |

## ⛔ La cronologia nuova — NON FA PARTE DELLA CATENA

**Queste sei voci non si eseguono finché la catena qui sopra non è chiusa**, cioè non
prima della fine dello spacchettamento. Non sono rimandate perché piccole: sono
rimandate perché **la catena è stata verificata in tre giri, e le cose nuove che entrano
mentre gira la fanno saltare al primo lavoro fuori piano.**

Le priorità di questa cronologia si daranno **allora**, con lo stesso protocollo che ha
retto finora: proponi → riscrivila come l'hai capita → verifica che i file bastino → si
parte.

**La regola di smistamento, per quello che si incontrerà da qui in avanti:** se una cosa
serve **solo quando gli episodi sono in serie**, va scritta qui e non nella catena. L'app
resta a film fino a Supabase (le ragioni sono nella fase 1-bis).

⚠️ **A cosa serve leggerle adesso, e all'unica cosa:** se un giorno tocchi il generatore
dei distrattori, le tabelle di personalizzazione o la mastery, devi sapere che **esiste
già un piano** e non «sistemarle» per conto tuo. Una correzione locale fatta qui dentro
non è un anticipo: è un lavoro da rifare.

| | Cosa | Da dove viene |
|---|---|---|
| **N.1** | **Il flusso del mix e dei distrattori.** Il campo nella matrice, gli **ammessi** nel JSON già risolti, il file condiviso a fine episodio, e il «viola» per le voci che escono dal giro. Chiude C.6 alla radice: l'app legge e non può sbagliare, perché non crea più niente a runtime.<br><br>⚠️ **Il 2026-09-10 il difetto è stato VISSUTO, non più solo misurato:** in Match Practice grado B sono comparsi *«I am»* e *«I'm»* nella stessa domanda, con la stessa traduzione. Risposta giusta, contata come errore, `b-im` finita a rosso 0. **Il costo vero non è il colore sbagliato: è che non c'è modo di rispondere bene, e non si capisce cosa si è sbagliato.** Un esercizio in cui la risposta giusta non esiste non insegna niente e toglie fiducia a tutti gli altri. La misura del 2026-09-09 diceva quante collisioni ci sono; questa dice quanto costano. | C.6 |
| **N.2** | **Il magazzino senza sovrapposizioni.** `people.papa ∩ people.figlio` producono lo stesso nome (Marco/Mark), `people.mamma ∩ people.figlia` pure (Chiara/Clare): con papà = Marco e figlio = Marco due frasi diverse del grado C diventano identiche. **Non sta in nessun file** — la crea lo studente scegliendo i nomi, quindi nessun controllo sui dati la vedrebbe. | misurata il 2026-09-09 |
| **N.3** | **Le cinque frasi di C identiche a battute di D** (due in `gate`, tre in `aircraft-door`). Innocue oggi — il pool di un quiz è un grado solo e i quiz girano su A, B, C — **latenti** se un passo di match finisce sul grado D, che è una lettera nella coppia `{ module, grade }`. | misurata il 2026-09-09 |
| **N.4** | **La D3 ripresa in forma nuova**, quando esisterà un colore sopra i compartimenti. *(La D3 di oggi — il colore sale solo su risposte verificate — resta dov'è, nella fase 2-bis.)* | § La mastery |
| **N.5** | **Il badge nel file dell'episodio**: la strada A di C.4. La condizione che la fa scattare è scritta in C.4 e si riconosce guardando — quando il menù dell'interruttore vorrà venti fetch all'apertura. | C.4 |
| **N.6** | **Lo streak che non si azzera cadendo**, da valutare **coi dati veri**, non a tavolino. | collaudo del 2026-09-09 |
| **N.7** | **La schermata con l'elenco degli episodi e lo sblocco in serie.** Oggi l'app è **a film**: un episodio per volta, scelto dal Pannello Admin. Le tre ragioni stanno nella fase 1-bis, e la più forte è che «finito» dipende dagli undici moduli ancora da costruire — scriverlo adesso è scriverlo contro una mappa che cambierà. **La sequenza degli episodi NON slitta**: quella è un dato e resta nella fase 1-bis. Slitta la schermata, che è prodotto. | deciso il 2026-09-09 |
| **N.8** | **Un avviso prima di perdere l'avanzamento.** Uscendo con «← Mappa» si perde quello che si è fatto — è la regola del gesto, decisa e giusta — **ma nessuno lo dice.** La forma: un pop con due tasti, che esce **solo se** c'è già qualcosa nel magazzino temporaneo. Chi entra e guarda non lo vede; chi ha risposto sì, e quindi ha qualcosa da perdere. *Non è un avviso generico: è un avviso che sa se serve.* ⚠️ Nasce dalla ③, che ha creato la cosa da perdere. **Dopo l'episodio 5.** | collaudo del 2026-09-10 |
| **N.9** | **I tasti si rinominano guardandoli TUTTI INSIEME, non uno per volta.** Prima di toccare un nome serve verificare se il funzionamento è coerente ovunque o se qualche modulo fa una cosa sua: la domanda «questo tasto fa dappertutto la stessa cosa?» ha una risposta sola, e un modulo per volta la fa rispondere N volte in N modi. *Stessa forma della lettura finale di `componenti-singoli.md` (passo 24): il controllo è **leggere l'elenco intero**, non cercare.* **Dopo l'episodio 5.** | collaudo del 2026-09-10 |
| **N.10** | **La guardia sulla soglia di silenzio di `attendi.sh`** — un controllo che, a fine suite, verifichi che il file più lento sia ancora ben sotto i 600 s. È l'idea giusta della famiglia *«uno strumento invece di un'avvertenza»*, **e si è deciso di non costruirla adesso perché non sappiamo ancora se serve**: il commento accanto alla costante dice già da dove viene il 600, e se un giorno un file lo supera l'attesa lo dirà da sola *una volta*, in modo riconoscibile (la frase «nessuno sta più scrivendo» su un lavoro che invece è vivo). Una guardia che sorveglia una cosa mai successa è un pezzo in più da mantenere per un rischio ipotetico. | **Il giorno che un file della suite supera i 400 s**, cioè quando il margine misurato si dimezza. |
| **N.11** | **Il battito durante un'attesa lunga.** `attendi.sh` adesso si arrende da sola, ma finché aspetta non dice niente — ed è la domanda che chi guida il progetto si è fatto tre volte in un giorno: *«devo aspettare o si è incantato?»*. Stampare una riga ogni due minuti **non basta**: su un processo in primo piano quell'output arriva solo alla fine. Per servire davvero dovrebbe **scrivere lo stato in un file** che io leggo per aggiornare la lista attività. *È la stessa famiglia della regola 40 — la lista attività che fa vedere a lui quello che vedo io — e va fatta lì, non dentro l'attesa.* | **Insieme al prossimo lavoro sulla lista attività**, non dentro `attendi.sh`. |
| **N.12** | ⚠️ **`attendi.sh` non sapeva aspettare una risposta di rete.** **FATTA l'11 settembre: `tests/tools/attendi-ci.sh`.** Ha ceduto **tre volte in due giorni con tre difetti diversi** — il ramo sbagliato (`main^`), la corsa sbagliata (`per_page=1` fra due workflow), e misurando ne sono emersi altri due: il **nome come identità** (lo stesso workflow si chiama `pages-build-deployment` nell'elenco dei workflow e `pages build and deployment` in quello delle corse — due stringhe per la stessa cosa, nella stessa API) e **l'API illeggibile scambiata per «non è finita»**, che aspettava all'infinito.<br><br>⚠️ **Il quarto non era una forma nuova: era una forma RISOLTA E NON RIUSATA.** Il tetto e il rilevatore di silenzio esistevano in `attendi.sh` dal 10 settembre. *È la regola 41 applicata a una soluzione invece che a una ricerca — l'elenco c'era e non è stato cercato, la soluzione c'era e non è stata portata. Stessa famiglia, costo diverso: questa costa di più, perché il lavoro era già fatto.* La frase è scritta in testa al file nuovo, perché chi lo legge sappia che è un **parente**, non un gemello.<br><br>La corsa non si indovina più: si identifica per **file del workflow + commit**. Cinque uscite distinte, e il 3 («la corsa non esiste») separato dal 4 («non vedo GitHub»). Provato da `tests/test_attendi_ci.js`, 18 asserzioni, **senza chiamare la rete** (`ATTENDI_CI_FETCH`): un test che dipende dalla rete cade per un motivo che non controlliamo affatto. **Guasto realistico misurato:** davanti a un'API illeggibile la forma vecchia è stata **uccisa dal timeout a 15 s senza fermarsi mai**, la nuova esce con 4 in **2 s**. | ☑ fatta il 2026-09-11 |


## La famiglia: la conoscenza che ogni file deve ricordarsi da solo

*Non è una lista di lavori: è una **forma di difetto**, e ne abbiamo già visti
tre. Serve saperla riconoscere, perché il quarto caso non somiglierà ai primi
tre — somiglierà a «quel file è scritto male».*

**La forma.** Una cosa che vale per tutti — come si disegna un pulsante, che un
testo arriva da un fetch, che un popup intercetta i click — non sta in nessun
posto: **sta nella testa di chi scrive**, e ogni file la ricorda o non la
ricorda. Chi la ricorda la scrive a modo suo. Chi non la ricorda produce un
difetto che nessun test vede, perché ogni file passa i propri verdi.

| | Caso | Copie trovate | Chiuso con |
|---|---|---|---|
| ① | **Il Blocco Ascolto** (2026-09-09) | 7 copie del markup + 5 della coda del gestore | `renderListenBlock` |
| ② | **Il sottotitolo che arriva da un fetch** (2026-09-10) | 5 punti, 3 con un'attesa a tempo e 2 con nessuna | `attendiSottotitoloEsito` (`tests/attese.js`) |
| ③ | **Il popup dei tentativi** (2026-09-10) | **12 copie in 10 file, in 8 formulazioni** — e un undicesimo file che non lo nominava affatto | `chiudiPopupTentativiSeAperto` (`tests/quiz-driver.js`) |

⚠️ **Il terzo è quello che insegna di più, perché il file «colpevole» era
`test_batch19` — quello che avevamo già riscritto al passo 0a-bis.** Non era
scritto male: gli mancava una conoscenza che nessuno gli aveva dato, e che gli
altri dieci si tenevano ognuno per sé. *Il difetto non è nel file che non sa: è
che sapere fosse un compito di memoria.*

**E il dato che cambia il 14b — con la correzione dell'11 settembre, perché
quello che era scritto qui era falso.**

*Il 10 settembre questa riga diceva: «chiudendo il popup sono sparite dieci attese
a tempo senza averle cercate, quindi **le 180 guardie scendono mentre si chiudono
le famiglie**». Sembrava ovvio e non è stato verificato. Rigenerando il conto
l'11 settembre il numero **non è sceso: è salito a 186**.*

**Cosa dice la misura, per file:**

| | 10 settembre | 11 settembre | Δ |
|---|---|---|---|
| **guardie** | 180 | **186** | **+6** |
| navigazione | 300 | 293 | −7 |

**Nessuna guardia è sparita.** Le dieci attese tolte dal popup e le cinque del
sottotitolo stavano nella **navigazione**, che infatti è scesa di nove
(`test_batch6, 7, 8, 10, 11, 12, 15, 16`). Le **+6** guardie vengono tutte da due
file **nati quel giorno**: `test_conta_attese.js` (+3) e `test_modulo_pronto.js`
(+3).

> ⚠️ **Le due colonne non si travasano l'una nell'altra.** Una *guardia* è
> un'attesa da cui dipende un'asserzione; una di *navigazione* è un'attesa che, se
> è corta, fa rompere il test invece di farlo passare per sbaglio. Chiudere una
> famiglia fa scendere le guardie **solo dove una guardia diventa un'attesa vera** —
> non perché il lavoro «consuma» il numero.

> ⚠️ **E c'è la parte controintuitiva, che è il motivo per cui va scritta:
> CHIUDERE DIFETTI PRODUCE GUARDIE NUOVE.** Ogni difetto chiuso nasce con il suo
> test, e un test nuovo porta le sue attese. Il conto del 14b non è un serbatoio
> che si svuota: è un saldo fra quello che le forme condivise chiudono e quello
> che i test nuovi aggiungono. **Il 14b va pianificato su 186**, e il numero si
> rigenera con `node tests/tools/conta-attese.js` prima di usarlo — mai ripreso
> da una riga scritta il giorno prima.

*Resta vera la lezione del censimento morto, vista dall'altra parte: lì il numero
era vecchio perché nessuno lo ricalcolava; qui sarebbe stato vecchio perché il
lavoro lo cambia in **tutte e due** le direzioni. In entrambi i casi la difesa è
la stessa — **il numero si genera, non si ricorda.** E la ragione per cui questa
riga era falsa è che l'avevo ricordato invece di generarlo.*

## ⚠️ I COMMENTI: DUE SETACCI COSTRUITI E DUE PROVE NEGATIVE (15 settembre)

*Il passo 17 è caduto qui. Questi esiti valgono più delle correzioni che non
sono state fatte, e il terzo più dei primi due.*

### I tre riconteggi — il passo dichiarava tre casi, sono caduti tutti e tre

| dichiarato | misurato |
|---|---|
| «i dodici di `attemptRule`» | **0 in `index.html`.** 17 nel repository, di cui **11 in `docs/validazione.md`**, 3 in `test_outcome_step_ids.js` (legittimi: asseriscono che non esiste più), 1 in `correzioni.md`, 1 in `censimento-moduli.md`, 1 nella riga del passo. **Il lavoro, se c'è, è in un DOCUMENTO, non nei commenti del codice** — e chi leggeva il passo andava a cercare in `index.html`. |
| «il commento morto su `CONFIG.flashcard` (`index.html:6707`)» | riga **6949**, e **il commento è corretto** (sotto) |
| «il testo falso in `renderMasteryPanel`» | **il passo non dice QUALE frase**, quindi la voce non è verificabile come scritta: si può solo riderivare. Controllate tutte le sue affermazioni: i due prefissi `voicepractice:`/`voicecheck:` **esistono e per la ragione dichiarata**, «il numero di scritture non c'è» è **vero**, `a-hello` e `b-and-you` sono **id reali**. L'unica incompletezza sta altrove ed è stata corretta (vedi `correzioni.md`). |

*È la quarta volta di fila che i numeri di un passo sono sbagliati — «19 attese»
che erano 7, «141» che erano 186, «quattro valori» che erano 39, e qui cinque
su sei al passo 16 e tre su tre al 17.*

### ⚠️ LA DISTINZIONE PASSATO/PRESENTE — sono opposti e si somigliano

> **Un commento che nomina una cosa morta AL PASSATO è corretto: la sta
> dichiarando morta, ed è la spiegazione. Uno che la nomina AL PRESENTE è
> falso.**

Il caso: `index.html:6949` cita `data[CONFIG.flashcard.levels[…].vocabKey]`, una
chiave che **non esiste**. Sembra il difetto perfetto. Ma il commento comincia
con *«**Prima** ogni modulo aveva la sua strada»*: sta raccontando da dove si
viene, e **cancellarlo distruggerebbe proprio il perché**.

*Perché va scritto: un setaccio automatico li trova identici — nome morto,
commento vivo — e un lettore di fretta anche. La differenza non sta nel nome,
sta nel tempo del verbo. Ed è la ragione per cui questa classe non si delega a
uno strumento: lo strumento segnala, non giudica.*

### ⚠️ LE DUE PROVE NEGATIVE, E PERCHÉ HANNO FALLITO

**Questa è la parte che serve di più, perché senza di essa la prossima sessione
ricostruisce lo stesso rilevatore e ci si fida.** Tutti e due i metodi sono
stati provati **contro il ⑤ del passo 16**, l'unico caso di questa classe che
sappiamo essere vero.

**① Il controllo sui NOMI.** L'idea nasce dal ⑤ stesso: era falso perché
*nominava* cose (`levels.A.label`, `data/{livello}-episodioN-{lingua}.json`), e
un nome si verifica. Costruito su cinque classi — id del DOM, chiavi `CONFIG`,
percorsi di file, riferimenti a numero di riga, numeri di regola — e passato su
tutti e 66 i file: **zero difetti veri, tre falsi positivi.**

> **LA PROVA: output IDENTICO prima e dopo la correzione del ⑤.** Non lo vede.

Spingendolo oltre ne recupera **metà**: aggiungendo i **segmenti letterali dei
percorsi con segnaposto** (la forma ⑥ della regola 41 — il percorso assemblato
a pezzi, che la prima versione saltava *proprio perché* aveva le graffe) il
`data/{livello}-episodioN-{lingua}.json` viene preso. L'altra metà no, ed è
strutturale: `levels.A.label` passa perché **`.label` esiste** nel codice — su
temi, moduli, slot. Il controllo non sa su *quale oggetto*.

> ⚠️ **E il cuore del ⑤ è irraggiungibile da QUALUNQUE controllo sui nomi:**
> *«il nome esteso di ciascun grado sta nel file episodio»*. **Ogni nome in
> quella frase esiste.** La falsità è su **quale dei due è la fonte**. Non c'è
> un nome sbagliato da trovare: c'è un'attribuzione sbagliata.

**② L'ordinamento per marcio.** Un commento diventa falso quando cambia la cosa
che descrive, quindi il sospetto non è «il commento è vecchio» ma **«il
commento è vecchio mentre il codice sotto è nuovo»**. Misurato con `git blame`
su 406 blocchi da almeno tre righe: **156 hanno sotto codice più nuovo di loro**,
con divari da 1 a 16 giorni su un repository di 22 — abbastanza per
discriminare, e 14 blocchi sopra i 14 giorni. Sembrava buono.

> **LA PROVA: il blocco del ⑤ era 68° su 157.** In mezzo al gruppo.

*Il metodo ordina per **occasione** di essere diventato falso, non per **esserlo**.
Sono due cose diverse, e solo la seconda serve.*

### Cosa resta, ed è poco ma è vero

Il controllo sui nomi **non serve a cercare, serve a non ricadere**: è una
guardia, non un setaccio. Provato iniettando `legacy/test_qm.js` in un commento
di `test_blocco_ascolto.js`: **lo prende** — cioè il difetto che il 15 settembre
è stato trovato leggendo, domani lo prenderebbe un controllo. **Ma non diventa
una guardia adesso** (vedi la riga in «Pulizie rimandate»): la sua classe è
vuota, e non per caso — è quello che le rinomine dei passi 1-6 hanno già
spazzato.

## ⚠️ PRIMA DI CONTARE, VERIFICA CHE LA COSA CHE CONTI SIA QUELLA CHE TI COSTA (metodo, 15 settembre)

> **È più generale di «riconta», ed è il difetto che in tre giorni si è
> presentato TRE VOLTE con tre facce diverse.**

| | ho contato | mi costava | scarto |
|---|---|---|---|
| passo 16 | quante **copie** di una funzione | quante **versioni diverse** | 77 → «una è meccanica, due sono 34 scelte» |
| passo 17-18 | le righe dentro fasce sbagliate (CSS come markup, poi markup come JS) | le righe della fascia giusta | 157 → 37, con tre errori di fascia |
| passo 18 | i **file che contengono** la stringa | le **asserzioni che si rompono** | 24 file → **2 asserzioni** |

**Ventiquattro file erano veri. Due asserzioni erano il lavoro.**

*Il numero non era sbagliato: era il numero di un'altra domanda.* Ed è la
forma peggiore, perché un numero sbagliato si scopre ricontando, mentre un
numero giusto della domanda sbagliata **regge a qualunque ricontrollo** — lo
si ricava di nuovo, torna uguale, e conferma sé stesso.

**La difesa operativa, e non è «stai attento»:** prima di contare, si scrive
**la frase che il numero dovrà sostenere**. «Ventiquattro file» non sostiene
nessuna frase; «ventiquattro file da riscrivere» sì, ed è falsa. Se la frase
non si riesce a scrivere prima, il conto non serve a niente.

## ⚠️ COPIE E VARIANTI SONO DUE MISURE DIVERSE (metodo, 15 settembre)

> **LA DOMANDA NON È QUANTE COPIE, È QUANTE VERSIONI DIVERSE.**
> **Sono due misure diverse, e solo la seconda dice se c'è un difetto.**

Una funzione ripetuta in venti file si conta con `grep -c` e viene fuori un
numero: venti. Quel numero non dice **niente** su cosa fare, perché due
situazioni opposte lo producono uguale:

| | copie | varianti | cos'è |
|---|---|---|---|
| `openModule` | 23 | **1** | una duplicazione: si unifica, è meccanico |
| `bootAsUser` | 26 | **14** | quattordici decisioni separate |
| `mockInit` | 28 | **20** | venti decisioni separate |

Il conto delle copie le mette tutte e tre nello stesso secchio — «77
duplicazioni» — e da lì parte un lavoro solo. Il conto delle **varianti** le
separa: la prima è un'ora di lavoro senza scelte, le altre due sono
**trentaquattro scelte** su cosa vince, ognuna delle quali può lasciare dei
file **verdi che provano meno di prima**.

**Come si misura:** si estrae ogni definizione, la si normalizza, se ne fa
l'hash, si contano gli hash distinti. Non si guarda a occhio: a occhio 23 copie
identiche e 23 copie quasi identiche si somigliano, ed è esattamente la
differenza che conta.

*Perché sta qui come metodo e non solo nella riga del passo 16: la stessa
domanda torna a ogni «ci sono N copie di X», e un numero che si legge male fa
partire il lavoro sbagliato prima che qualcuno abbia deciso niente. È la stessa
famiglia di «19 attese che erano 7», «141 attese che erano 186» e «quattro
valori che erano 39»: il difetto non è che il numero fosse sbagliato, è che
**era il numero di un'altra domanda**.*

## ⚠️ 14b — LA FAMIGLIA NON È UNA LISTA DI LAVORO (misurato l'11 settembre)

**Il 14b si è fermato al primo giro, ed è la cosa più utile che poteva
produrre.** La famiglia ② — *«una schermata che compare o sparisce»*, 30 punti —
è stata scelta apposta perché la forma esisteva già. Guardando i siti uno per
uno prima di toccarli, **nove su ventinove non sono conversioni sicure**, e tre
di quei nove renderebbero il test **peggiore** invece che migliore.

*(Il trentesimo punto non è un'attesa vera: vive dentro l'array `FINTO` di
`test_conta_attese.js`, cioè è il dato di prova con cui lo strumento misura sé
stesso. Convertirlo romperebbe il test del contatore.)*

### La causa, ed è la cosa da portarsi dietro

**Il censimento classifica per COSA SI LEGGE, non per COME VIENE USATO.** Vede
`.hidden` e scrive «una schermata che compare o sparisce» — e ha ragione sul
cosa. Ma non può vedere se quella lettura serve a dire *«è comparsa»* oppure
*«NON è comparsa»*, che sono l'opposto l'una dell'altra e hanno bisogno di due
cose diverse.

> **Una famiglia dice dove guardare. Non è una lista di lavoro.**
>
> ⚠️ **E IL TRIAGE VA FATTO SUL CODICE, NON SUI NOMI DELLE ASSERZIONI.** È la
> seconda correzione allo stesso metodo in due giorni, e la sequenza dei tre
> numeri è la prova: **20 su 29** leggendo i siti della famiglia ②, **26 su 52**
> leggendo le *etichette* della ①, **20 su 52** leggendo i *siti* della ①.
> *L'etichetta di un'asserzione dice cosa si legge; solo il codice dice come
> viene usato — e sei punti su cinquantadue stanno esattamente in quella
> differenza.*
> Ogni famiglia vuole un giro di triage prima della conversione, e il triage va
> fatto **leggendo i siti**, non fidandosi dell'etichetta.

### I nove, in tre gruppi — e il terzo è quello che pesa

**① Asserzioni NEGATIVE (3+2 parziali): non si può aspettare un non-evento.**
`test_batch14.js` *«NO silence warning fires mid-speech»*, `test_batch13.js`
*«no silence warning»*, `test_batch8.js` *«forcing a click does NOT
advance»* — più due miste, `test_dialogo_extra.js` (una classe che deve essere
sparita) e `test_modulo_pronto.js` (la schermata d'errore che NON deve
comparire). **Lì i millisecondi SONO la misura**, ed è la stessa deroga già
dichiarata per le tre asserzioni negative sulla console.

**② Un'asserzione VACUA, che è un difetto di oggi:** `test_batch16.js` riga 186
scrive `log('[Job2] After Riprendi, still on the dialogue screen', stillOnMain
=== true || true)`. **`x || true` è sempre vero: quella riga non può fallire.**
È la famiglia ⓪-bis di `tests/ERRORI-INGOIATI.md` — un'asserzione che nomina una
cosa per non verificarla. Trovata convertendo, non cercandola.

**③ TRE CHE LA CONVERSIONE PEGGIOREREBBE, e nessuno se ne accorgerebbe.**
`test_batch3b.js` *(«Mostra pronuncia» è nascosto quando la battuta non ha
`pronunciationTip`; il testo è nascosto per default)* e `test_batch14.js` *(il
badge «Ripasso» è nascosto durante il giro principale)** aspettano e poi
verificano che qualcosa sia **nascosto — ma era nascosto già prima**.
`attendiNascosto` lì tornerebbe `true` **al primo istante**, senza aver
verificato niente: il test passerebbe da *lento ma onesto* a **istantaneo e
vuoto**.

> ⚠️ **È il caso che rende il 14b pericoloso se fatto meccanicamente.** Una
> conversione sbagliata non lascia un rosso da diagnosticare: lascia un **verde
> che non prova più niente**, e il conto delle guardie *scende* — cioè il numero
> con cui misuriamo il progresso **migliora proprio quando il lavoro fa danno**.
> È la regola 37 applicata al 14b stesso.

**Restano 20 conversioni sicure su 29**, tutte della forma «si clicca, una
schermata deve comparire». Le due forme — `attendiVisibile` e `attendiNascosto`
in `tests/attese.js` — **sono scritte**, con il loro limite dichiarato (per
Playwright «hidden» è vero anche per un elemento che non esiste più).

**Cosa serve decidere prima di riprendere:** se le 20 si fanno e le 9 si
lasciano con una riga accanto che dice perché; e se il conteggio delle guardie
va scorporato — perché una guardia legittima (negativa, o su uno stato già
vero) non è un debito da chiudere, e tenerla nel totale fa sembrare il 14b più
grande di quello che è.

## 14b ① — il triage della famiglia più grande (11 settembre)

**52 punti dichiarati, 26 da convertire. Esattamente la metà.** Sulla ② erano 20
su 29; qui il triage toglie di più, e la previsione di chi guida il progetto era
giusta: *«una classe che cambia stato» è più ambiguo di «una schermata che
compare» — una classe può essere aggiunta o tolta, e può essere già presente
prima.*

| | n | |
|---|---|---|
| **da convertire** | **26 → 20** ⚠️ | una transizione vera. **Il 26 veniva dalle ETICHETTE del censimento; leggendo i 52 siti sul codice sono diventati 20.** Sei sono scesi: quattro aspettano una classe che **sparisce** (forma che non esiste), uno legge il **testo** di un pulsante (altra famiglia), uno è una misclassificazione in più. *Anche il triage si misura leggendo: la tabella dice dove guardare, il codice dice cosa c'è.* |
| **già vero prima dell'attesa** | **11** | *«starts disabled»*, *«still disabled»*, *«keeps disabled»* |
| **negative** | **12** | *«stays enabled»*, *«does NOT open»*, *«NON carries»* |
| **misclassificate** | **3** | l'etichetta della famiglia è sbagliata, vedi sotto |

### ⚠️ Il gruppo che qui è enorme: «STAYS ENABLED»

**Sette delle dodici negative stanno in `test_batch17.js`**, e sono tutte la
stessa cosa: *«Spiegazione **stays** enabled during a line's own audio»*, *«"Ho
finito" **stays** enabled»*, *«Answer options **stay** enabled»*. Verificano che
la Regola Azione Critica (regola 16) **non** spenga i pulsanti mentre l'audio
parla — cioè che una cosa **non** accada. Il tempo è la misura.

*È il gruppo che rende questa famiglia diversa dalla ②: lì le negative erano
cinque su ventinove, qui dodici su cinquantadue, e sette vengono da un file
solo che difende un'unica regola del progetto.*

### La quarta categoria, nuova: MISCLASSIFICATE

Tre punti non appartengono a questa famiglia, e la ragione è dello strumento,
non del codice:

- **due leggono un DATO, non una classe** — `bubbleIds.length >= 3` in
  `test_batch14.js`, l'elenco dei `data-module` in `test_new_features.js`.
  Finiscono qui perché nella finestra c'è un `getAttribute`, che la regola della
  famiglia cattura;
- **uno ha un AIUTANTE LOCALE fra l'attesa e l'asserzione** —
  `test_batch19.js` chiama `openModule()` lì in mezzo, e `openModule` aspetta
  per conto suo. Lo strumento non lo sa, quindi conta come guardia un'attesa che
  non lo è.

⚠️ **Il secondo caso è stato MISURATO prima di dichiararlo una distorsione: in
tutta la suite sono QUATTRO** (`test_batch6`, `test_batch8`, `test_batch15`,
`test_batch19`), non un difetto sistematico. *Quattro su 154 non giustificano di
allargare la regola degli aiutanti: si marcano dove capitano.*

### FATTA l'11 settembre — 154 → 108

**20 conversioni, 32 marcate legittime, e nessuna forzatura.** Le tre forme
nuove — `attendiAbilitato`, `attendiDisabilitato`, `attendiClasse` — stanno in
`tests/attese.js`. **`attendiClasseAssente` NON è stata scritta**, ed è una
decisione con una soglia: quattro siti aspettano una classe che sparisce, e
quattro non giustificano una funzione da difendere per sempre su cui sbagliare
produce un test *vuoto*. **Si fa quando diventano dieci.**

⚠️ **E i 32 marcatori NON hanno tutti lo stesso motivo, di proposito.** Quattro
gruppi, quattro frasi diverse: *l'attesa è la misura* (negative), *lo stato era
già vero* (12), *la classe sparisce e la forma non c'è* (4), e per le quattro
**misclassificate** una frase che dice l'opposto — *«questa non è nemmeno una
guardia di questa famiglia»*. **Marcarle col motivo delle altre sarebbe stata
una bugia comoda:** chi legge un marcatore che dice «il tempo è la misura» su
una riga che conta le bolle di un dialogo impara una cosa falsa su come
funziona quel test.

**E la ragione per cui il gruppo «già vero» è stato escluso ora vive nel
codice**: `tests/test_attese_condivise.js`, blocco `[C]`, dimostra che su uno
stato già vero una forma torna `true` in meno di 250 ms **senza aver verificato
niente**. *Su undici siti, fidarsi della lettura è esattamente quello che ci è
costato le tre asserzioni morte.*

### Cosa vuol dire per il 14b

**Due giri di triage, due numeri: 20/29 e 26/52.** In media meno della metà di
una famiglia è lavoro vero. **Il totale di 154 non è un piano**: è un punto di
partenza da cui ogni famiglia toglie la sua parte, e la toglie **solo
leggendola**.

## 14b ③ — il triage della famiglia «un suono o la voce» (11 settembre)

**29 punti dichiarati, 12 da convertire.** E una **quinta categoria** che le
altre due famiglie non avevano, con dentro **nove punti** — il gruppo più
numeroso della famiglia.

| | n | |
|---|---|---|
| **da convertire** | **12** | il suono parte, il tono viene registrato |
| ⑤ **il tempo È la cosa misurata** | **9** | ⚠️ nuova, vedi sotto |
| negative | 5 | il Traguardo che NON suona, l'audio che NON parte |
| già vero | 2 | *«still speaking, not stopped»* |
| misclassificata | 1 | legge un pulsante, non un suono |

### ⚠️ LA QUINTA CATEGORIA, e non è quella che ci aspettavamo

L'ipotesi era *«l'audio ha un tempo suo: aspettare che finisca di parlare
potrebbe essere legittimamente un tempo»*. **La forma vera è più precisa, e più
pericolosa:**

> **ASPETTARE RENDEREBBE L'ASSERZIONE BANALMENTE VERA.**

I nove punti verificano tutti la stessa cosa — *«toccare qualcos'altro
INTERROMPE l'audio»*, cioè la Regola Azione Critica (regola 16). Leggono
`speechSynthesis.speaking === false` **cinquanta millisecondi dopo il tocco**.

**Il fatto misurato:** il finto sintetizzatore (`mockInit`) si spegne **da solo
dopo 500 ms** — `setTimeout(() => { this.speaking = false; ... }, 500)`.

Quindi un'attesa «finché non parla più» **tornerebbe entro 500 ms comunque**, che
il tocco abbia interrotto l'audio oppure no. L'asserzione *«il tocco l'ha
fermato»* diventerebbe *«prima o poi ha smesso»* — **vera sempre**, e nessun
rosso lo direbbe.

⚠️ **È la conversione più pericolosa incontrata finora, più del gruppo «già
vero».** Quella si riconosce perché lo stato non cambia mai; questa **somiglia a
una transizione legittima** — c'è un `true` che diventa `false`, e il codice
convertito si legge benissimo. *Quello che si perde non è il valore: è
l'ISTANTE in cui viene letto, e l'istante non si vede nel diff.*

**I cinquanta millisecondi non sono un margine tarato a occhio: sono la
distanza fra «l'ha fermato il tocco» e «è finito da solo».**

### Cosa dicono i tre triage

**20/29 · 20/52 · 12/29.** Meno della metà, tre volte su tre. E ogni famiglia ha
aggiunto una categoria che le precedenti non avevano: la ② le negative e le «già
vere», la ① le misclassificate, la ③ questa. *Il triage non è un filtro noto da
applicare: è una lettura che ogni volta trova una forma nuova.*

## 14b ④ — la famiglia «una scrittura nel localStorage» (11 settembre)

**18 punti dichiarati, 13 convertiti.** E due cose che valgono più delle tredici
conversioni: **il criterio che sceglie l'approdo**, e **un difetto nello
strumento di misura** che rendeva falsi i numeri delle tre famiglie precedenti.

| | n | |
|---|---|---|
| **convertiti** | **13** | approdo `attendiClasse(page, '#view-map', 'is-active')` — **zero funzioni nuove** |
| legittime | 3 | negative: «NON scrive», «non resta nessuna voce» |
| **rimandata** | 1 | `test_batch13` — il suo approdo appartiene alla famiglia «un testo che si riempie» |
| fuori famiglia | 1 | `test_new_features` — la guardia sta davanti a un `location.reload()`, non a una scrittura (convertita lo stesso, con forma sua) |

### ⚠️ IL CRITERIO CHE SCEGLIE L'APPRODO — e vale per ogni conversione futura

> **L'EFFETTO SU CUI ASPETTI NON PUÒ ESSERE QUELLO CHE L'ASSERZIONE LEGGE.
> ALTRIMENTI DIVENTA VERA PER COSTRUZIONE.**

**È la ⑤ di ieri e la ⑥ di oggi viste come una cosa sola**, ed è il motivo per
cui non si sceglie l'approdo guardando il nome della famiglia. La ⑤ era l'audio
che si spegne da solo; la ⑥ è questa:

> **LA FAMIGLIA PRENDE IL NOME DA CIÒ CHE L'ASSERZIONE LEGGE, E QUELLO È
> L'EFFETTO PIÙ PRECOCE DEL GESTO — NON L'ULTIMO.**

In `completeModule` (`index.html`) l'ordine è *scrivi l'esito → travasa la
mastery → segna completato → **ridisegna la mappa***. Aspettare la scrittura
significa fermarsi al primo effetto e leggere scoperto tutto il resto;
aspettare la classe della riga sulla mappa renderebbe vera per costruzione
l'asserzione che quella classe la verifica. **L'approdo giusto era il terzo:
`#view-map.is-active`, l'ultimo effetto e l'unico che nessuna di quelle
asserzioni legge.**

**Quindi la regola operativa: si guarda l'ULTIMO effetto del gesto; e se
l'asserzione legge anche quello, l'asserzione si SPEZZA** — l'attesa diventa la
prima delle due e si dichiara per quello che è. È successo su **due punti su
tredici**. Il criterio sta scritto in testa a `tests/attese.js`, dove lo trova
chi converte la prossima famiglia.

### ⚠️ LA MISURA CHE NON HA DISTINTO

Messe a **0 ms**, due attese sono rimaste **verdi tutte e due**: una stava
davanti a un gestore **sincrono** (non guardava niente), l'altra davanti a un
gestore **asincrono** — una corsa vera, vinta solo perché il container è veloce
(regola 19). `test_batch14` 38/38, `test_batch2` 22/22.

**La misura non le ha distinte. A distinguerle è stato il codice: il `.then(`
c'è o non c'è.** *Una misura che dà un risultato inutile va riportata per quello
che è, non interpretata: qui il verde locale non separa la guardia inutile dalla
corsa vinta per velocità.*

### ⚠️ PERCHÉ SI CONVERTE ANCHE UNA GUARDIA CHE OGGI NON GUARDA NIENTE

`test_batch2.js` aspettava 150 ms dopo «Inizia l'episodio» quando il gestore era
**sincrono**. Il commit **`0601b87`** l'ha reso asincrono
(`ensureEpisodeSlotFields(...).then(...)`), e quei 150 ms sono passati da *«non
guardano niente»* a *«sono l'unica cosa fra il test e una corsa»* — **senza che
nessuno toccasse il test, e senza che niente lo dicesse.**

> **UNA GUARDIA INUTILE OGGI È UN'ASSICURAZIONE CHE COSTA UNA RIGA CONTRO UN
> CAMBIAMENTO CHE È GIÀ AVVENUTO UNA VOLTA.**

Vale per tutte le famiglie che restano. *E la prova che serviva non è il fetch
rotto: iniettati 800 ms dentro quella promise, la forma vecchia cade (20/22) e
la nuova regge (22/22).*

### ⚠️ E IL NUMERO SU CUI SI PIANIFICAVA ERA SBAGLIATO — 90 era 56

Rigenerando il censimento dopo le conversioni, il conto scendeva da 90 a **79**
invece che a 73: **sei guardie nuove comparse dal nulla**. Non erano nuove.

`tests/tools/conta-attese.js` teneva l'elenco delle «attese vere» **scritto a
mano**, fermo ai tre helper che esistevano quando era nato. Nel frattempo ne
erano arrivati cinque — `attendiAbilitato`, `attendiDisabilitato`,
`attendiClasse`, `attendiCheParla`, `attendiTono` — e lo strumento non li
riconosceva: **ogni `waitForTimeout` che stava PRIMA di una conversione veniva
promosso da navigazione a guardia.**

> **IL CENSIMENTO CONTAVA COME DEBITO NUOVO L'EFFETTO DEL LAVORO CHE IL DEBITO
> LO STAVA TOGLIENDO.**

È la regola 37 applicata allo strumento che serve a misurare. Corretto leggendo
`module.exports` di `attese.js` invece di elencarli, così una funzione nuova è
riconosciuta il giorno stesso.

**Cosa cambia nei numeri già scritti, e va detto perché sono stati usati per
pianificare:** il **186 del 14a è giusto** (nessuna di quelle funzioni esisteva
ancora). **Tutti i numeri dopo la famiglia ① sono gonfiati** — 154, 108, 90 non
sono mai stati il vero. Il conto vero, misurato con lo strumento corretto:

> **186 → 56 guardie da convertire. Le famiglie ①, ② e ③ erano CHIUSE del
> tutto: «un suono o la voce» (11), «un pulsante o una classe» (3) e «una
> schermata» (1) erano residui dello strumento, non lavoro rimasto.**

*Nessun numero di questa catena è stato corretto a memoria: è stato rigenerato.*

### Cosa dicono i quattro triage

**20/29 · 20/52 · 12/29 · 13/18.** E ogni famiglia ha aggiunto una categoria che
le precedenti non avevano. *Il triage non è un filtro noto da applicare: è una
lettura che ogni volta trova una forma nuova.*

## 14b ⑤ — la famiglia «un testo che si riempie» (11 settembre)

**16 punti, 16 chiusi: 14 convertiti e 2 marcati legittimi** — più la rimandata
della ④ (`test_batch13`), chiusa qui come previsto. **La famiglia scende a
ZERO.** Nessuna funzione nuova: `attendiClasse` e `attendiVisibile` bastavano.

### ⚠️ LA SETTIMA CATEGORIA — e impone una MISURA PER OGNI SITO

> **ASPETTARE «CHE IL TESTO CI SIA» NON BASTA QUANDO IL TESTO SBAGLIATO C'È
> GIÀ.**

La conversione naturale per una famiglia che si chiama *«un testo che si
riempie»* è *«aspetta che l'elemento non sia vuoto»*. **Misurato campionando
ogni 5 ms all'apertura di Voice Practice:**

```
40ms  vista attiva=false  badge="Voice Coach"
69ms  vista attiva=false  badge="Voice Coach"
78ms  vista attiva=true   badge="Voice Practice"
```

**Il badge non è vuoto prima: porta il testo SBAGLIATO** — il valore della
schermata precedente, perché Voice Practice e Voice Check condividono la stessa
vista e lo stesso elemento. Un'attesa «finché non è vuoto» tornerebbe **al primo
istante, sul valore vecchio**. Non è pericolosa come la ⑤ — fa fallire, non
passare — ma è **inutile**: lascia la corsa dov'era.

**Il nome della famiglia descrive quello che il test vuole vedere, non quello
che l'elemento fa. L'elemento non si riempie: CAMBIA.** E «aspetta che sia
cambiato» non si scrive senza nominare il valore atteso, che è la regola 44.

⚠️ **LA CONSEGUENZA OPERATIVA, ed è la prima volta che una categoria impone una
misura per ogni sito: va MISURATO se l'elemento nasce vuoto o porta un valore
vecchio, e non è deducibile dal codice del test.** Misurati, quattro
comportamenti diversi:

| elemento | prima del gesto | |
|---|---|---|
| `#voice-coach-badge` | `"Voice Coach"` | **vecchio, e cambia** |
| `#repeat-aloud-complete`, `#qm-retry-intro-screen`, `#qm-direction`, `.spiegazione-title-name`, `#dg-list` | già il valore giusto | **vecchio e non cambia mai** — la guardia non guarda niente |
| `#repeat-aloud-type-badge`, `#match-type-badge` | vuoto | **nasce vuoto** |
| `.sr-option.is-correct` | non esiste | **assente** — lì aspettare che ESISTA è l'approdo giusto, perché l'asserzione legge il TESTO: esistenza e identità sono due cose diverse |

### Perché questa famiglia è più rischiosa della ④

**`openModuleFromMap` è ASINCRONO** (`Promise.all([...]).then(...)`): nella ④
dodici guardie su tredici stavano davanti a gestori sincroni e non guardavano
niente, qui le sette «dopo l'apertura di un modulo» sono **corse vere**.

*Distinzione che serve a chi converte: `page.click(sel)` aspetta da solo che
l'elemento sia raggiungibile, quindi un click dopo l'apertura non è una corsa;
un `page.evaluate` o un `$eval` non aspettano niente, e lì la corsa c'è.*

**La prova (regola 32), fatta sul caso più diverso** — `test_batch4b`, l'unico
ciclo su una lista di moduli e l'unico in cui il selettore da aspettare è un
**parametro**: iniettati 500 ms dentro `openModuleFromMap`, **la forma vecchia
cade 5/10 e la nuova regge 10/10**. E il rosso della forma vecchia diceva
`ERROR: page.$eval: Failed to find element…` — **un rosso che parla d'altro**,
esattamente il modo in cui un approdo sbagliato lì non si sarebbe visto.

### Difetto trovato leggendo, non prodotto dalla conversione

**`test_batch15` leggeva `#repeat-aloud-type-badge` senza NESSUNA guardia** dopo
un `openModuleFromMap` asincrono. Il badge **nasce vuoto** (misurato): su una
macchina più lenta `indexOf('Studio') === 0` falliva. Non era una guardia da
convertire — era una corsa scoperta.

### Cosa dicono i cinque triage

**20/29 · 20/52 · 12/29 · 13/18 · 16/16.** Cinque famiglie, cinque categorie
nuove, nessuna prevedibile dalla precedente.

⚠️ **E la ⑤ è arrivata con la resa più alta di tutte — 16 su 16 — perché
stavolta la MISURA è venuta PRIMA dell'ipotesi.** È la lezione di `[SR Task1]`
letta al contrario: là due ipotesi costruite leggendo il codice sono cadute
tutte e due, e il tempo speso a costruirle non ha prodotto niente; qui il
campionamento ogni 5 ms ha detto **prima** cosa faceva ogni elemento, e nessuna
ipotesi è servita.

> **Un'ipotesi letta nel codice costa poco a scriverla e molto a smentirla. Una
> misura costa poco tutte e due le volte.**

## 14b — «altro» NON È UNA FAMIGLIA (triage dell'11 settembre)

**Venti punti letti sul codice, uno per uno. Il sospetto era giusto: non
somigliano a niente perché sono il RESIDUO del classificatore — quello che
avanza quando le altre dieci etichette non attaccano.** Non c'è una forma da
costruire: **il lavoro qui è classificare, non convertire.**

Sono **cinque micro-gruppi**, e ognuno vuole una risposta diversa:

| | n | cosa sono | cosa vogliono |
|---|---|---|---|
| **α** negative | **7** | «nessuna nuova battuta accodata», «l'avviso non compare», «nessun errore» | il marcatore `ATTESA-LEGITTIMA` — il tempo **è** la misura |
| **β** già vere | **3** | una mutazione DOM sincrona (`el.open = true`) o una promise che `page.evaluate` ha già atteso | si tolgono o si marcano: non guardano niente |
| **γ** riassunto di un ciclo | **4** | l'attesa è dentro un ciclo di navigazione, l'asserzione riassume il ciclo | restano navigazione — ⚠️ **una è VACUA**, vedi sotto |
| **δ** convertibili | **4** | l'esito dopo un invio, l'apertura di un modulo | approdi **già esistenti**: `#vc-result`, `is-active` |
| **ε** bloccate dalla regola 44 | **2** | `test_episodi_corti` legge `erroreVisibile`, che **è** l'approdo ovvio | non convertibili su quell'approdo: diventerebbero vere per costruzione |

**La risposta alla soglia dei dieci letta al contrario: qui non si applica.** I
quattro convertibili non chiedono nessuna forma nuova — usano `attendiVisibile`
e `attendiClasse`, già nel magazzino. Non c'è nessuna funzione da creare, quindi
non c'è nessuna soglia da superare.

### ⚠️ TRE COSE TROVATE LEGGENDO, e valgono più delle quattro conversioni

**① Una seconda asserzione VACUA.** `test_batch7.js`:

```js
log('[Job3/4] Flash Card reachable/answerable (sanity — popup o carte finite)', true);
```

**Passa sempre.** È la stessa forma del `|| true` trovato in `test_batch16`
durante la famiglia ②: un'asserzione che sembra viva e non prova niente
(regola 37). Due su due sono comparse dentro un *sanity check* di un ciclo —
*è lì che questa forma nasce, ed è dove guardare la prossima volta.*

**② Una motivazione scritta in prosa e non nel marcatore.** `test_batch5.js`
porta già, nel codice, cinque righe che spiegano perché quell'attesa resta a
tempo — *«l'asserzione che segue è negativa… per un evento che non deve accadere
non esiste una condizione da aspettare»*. **Ma non porta `ATTESA-LEGITTIMA`,
quindi il censimento la riconta come debito a ogni giro.** È esattamente il caso
per cui il marcatore esiste: *una spiegazione che lo strumento non sa leggere è
una spiegazione che va riscritta ogni volta.*

**③ Un'asserzione vera su qualunque pagina.** `test_batch16` verifica che
`#fc-level-label` «non esista più», dopo aver aperto Flash Card e aspettato
200 ms. **Quell'id compare in `index.html` una volta sola, dentro un
COMMENTO**: l'asserzione è vera sulla schermata iniziale, sulla mappa, ovunque —
e l'apertura del modulo non c'entra niente. Non è inutile (se qualcuno
rimettesse quell'id, cadrebbe), ma **non ha bisogno né dell'attesa né del
modulo**, e scritta così fa credere di verificare qualcosa dentro Flash Card.

### ESEGUITO l'11 settembre, nell'ordine proposto

**Venti punti su venti.** `39 → 22` guardie, legittime `62 → 71`.

| | |
|---|---|
| le tre trovate | la vacua riscritta in **due** asserzioni vere; `test_batch5` marcato; l'asserzione di `fc-level-label` **spostata** prima dell'apertura del modulo e rinominata |
| marcature | 7 negative + `test_batch5` |
| tolte | 3, perché non guardavano niente (due mutazioni DOM sincrone, una promise che `page.evaluate` attende già) |
| convertite | 4, con approdi già esistenti |
| **restano a tempo** | **2**, con il motivo per esteso nel sito |

**La vacua, e perché era nata così:** il ciclo di `test_batch7` risponde
*«Sì, la so»* a ogni carta, quindi la valvola di sicurezza — che si apre dopo
ripetuti sbagli — **non poteva aprirsi mai**, e l'asserzione che l'autore
voleva scrivere sarebbe stata rossa. **Non distrazione: una resa.** Le due che
l'hanno sostituita muoiono su un guasto vero dell'app (mazzo di Flash Card
vuoto), e col `true` al suo posto quel guasto sarebbe passato **11 su 11**.

**L'indirizzo del difetto è in `tests/ERRORI-INGOIATI.md`, famiglia ⓪-ter:**
*le asserzioni vacue nascono nei sanity check dei cicli.* Due casi su due, e si
riconoscono dalla parola «sanity» nella riga.

⚠️ **Le due che restano a tempo NON sono un rinvio.** In `test_episodi_corti`
l'ultimo effetto del click è la schermata d'errore, ma `erroreVisibile` è
**esattamente** ciò che l'asserzione legge: aspettarlo la renderebbe vera per
costruzione (regola 44). Gli altri due effetti sono negativi. **Non resta niente
su cui aspettare che non sia già letto, e l'attesa a tempo è l'unica forma
onesta.** *Se un giorno quel blocco crescerà fino ad avere un effetto in più che
nessuna asserzione legge, allora si converte.*

### ⚠️ E una forma nuova, che vale oltre questo passo

> **UNA SPIEGAZIONE CHE LO STRUMENTO NON SA LEGGERE È UNA SPIEGAZIONE CHE VA
> RISCRITTA OGNI VOLTA.**

`test_batch5.js` portava **cinque righe di prosa** che spiegavano perché
quell'attesa doveva restare a tempo. Chi le ha scritte pensava di aver chiuso la
questione. Ma il censimento legge il marcatore `ATTESA-LEGITTIMA`, non i
commenti: quel punto tornava nel conto del debito a ogni giro, e qualcuno
rileggeva le stesse cinque righe per arrivare alla stessa conclusione.

**Condizione:** quando si incontra prosa che spiega una scelta in un punto dove
uno strumento passa e non la vede, si marca. *Non si va a cercarle adesso: si
marcano quando si incontrano.*

## 14b — I CINQUE GRUPPI PICCOLI, E IL 14b CHIUSO A ZERO (11 settembre)

**22 punti guardati INSIEME invece che in cinque triage separati. 186 → 0.**

> **TRE GESTI LETTI DA CINQUE ANGOLI.**

| gesto | n | le etichette del censimento che ci cadono dentro |
|---|---|---|
| **A** apertura di un modulo *(asincrona)* | 6 | console ×2, geometria ×2, stile ×1, elenchi ×1 |
| **B** caricamento della pagina | 4 | configurazione ×3, console ×1 |
| **C** un click dentro il modulo *(sincrono)* | 8 | stile ×3, configurazione ×2, elenchi ×2, geometria ×1 |
| **D** riassunto di un ciclo | 3 | — |
| **E** il tempo È la misura | 1 | elenchi |

### ⚠️ LA RIGA CHE CAMBIA COME SI GUARDANO LE FAMIGLIE

> **Il censimento classifica per COSA SI LEGGE, e cosa si legge non dice niente
> su cosa si aspetta. Font-size, larghezza in pixel, numero di elementi e
> warning in console sono LETTURE DIVERSE DELLO STESSO ISTANTE.**

**Le etichette del censimento sono un INDICE, non una tassonomia.** È la sesta
categoria vista su scala: sei punti, quattro etichette diverse, un gesto solo.

⚠️ **E ne segue una cosa che vale per il metodo, non per questo passo: se
avessimo fatto cinque triage separati avremmo trovato lo stesso gesto cinque
volte senza accorgercene — e forse costruito cinque forme per una cosa sola.
Guardarli insieme non è stata una comodità: è stato il modo di vedere che erano
tre.**

### Il caso più diverso, e la misura più allarmante della giornata

`test_batch16` [Job8] è l'unico blocco che apre **due moduli** e ne confronta le
letture. Misurato: leggendo `#fc-counter` **mentre si è ancora su Voice Coach**,
i valori sono **identici** a `#vc-counter` — `sr-counter`, `IBM Plex Mono`,
`700`, `18.4px`. Gli elementi delle viste non attive restano nel DOM, quindi
`getComputedStyle` risponde lo stesso.

> **Un approdo sbagliato lì non produce un rosso: produce un VERDE che prova che
> un contatore è uguale a sé stesso.**

Per questo le due viste si nominano una per una, invece di un approdo generico
*«una vista diversa dalla mappa»* che sarebbe già vero per la prima.

### Il gesto B: misurato E spiegato

Campionando il boot ogni 5 ms, fra «contesto non ancora esistente» e «tutto
pronto» **non c'è nessuno stato intermedio osservabile**. E la ragione
strutturale lo rende definitivo: **`page.goto` risolve sull'evento `load`, e lo
script dell'app è INLINE in `index.html`** — quindi ha già girato. Tre attese
tolte, non convertite.

### L'unico punto che resta a tempo, e il contatore che si muove

`test_batch10`: la spunta `is-heard` arriva alla **fine dell'audio** (~380 ms,
campionato) ed è **esattamente ciò che l'asserzione legge** (regola 44). L'unico
altro effetto di quell'istante è la bolla che **perde** `is-active` — misurato,
cambiano nello stesso render — e quella sarebbe un'attesa su una classe che
**sparisce**.

⚠️ **È il QUINTO sito che vorrebbe `attendiClasseAssente`. La soglia dichiarata
è dieci, e adesso il numero è scritto in `tests/attese.js`: siamo a metà.** *Una
soglia con un contatore che si muove è verificabile; una soglia ricordata no.*

### ⚠️ E la forma che è ricapitata a chi l'aveva appena scritta

Su quel punto erano state scritte **dieci righe** di motivazione misurata — e
**nessun marcatore**. Il censimento continuava a contarlo come debito. È
esattamente *«una spiegazione che lo strumento non sa leggere è una spiegazione
che va riscritta ogni volta»*, registrata poche ore prima leggendo
`test_batch5`. **L'ha presa il contatore, non chi l'aveva scritta: `3` invece di
`0`.**

*Non l'ho applicata avendola scritta. Lo strumento sì — ed è tutto il motivo per
cui il marcatore esiste.*

## DA FARE — il volume di default esce da `sfxPlayTone` ed entra in `APP_CONFIG`

**Condizione: alla prossima modifica dei suoni, o prima se qualcuno vuole
regolare il volume di Corretto dal Pannello Admin.**

`sfxPlayTone` porta `volume === undefined ? 0.15 : volume`: un valore
modificabile **scritto fisso nel codice**, che la regola 3 vieta. Oggi
`sound.events.corretto` non ha `volume` e prende quel default; `sbagliato` e
`countdown` ce l'hanno espliciti. Conseguenza pratica: **il volume di Corretto
non si può regolare dal pannello**, e un test che voglia confrontarlo non ha
niente da leggere.

*Trovato il 2026-09-15 convertendo il passo 15. Non corretto lì perché è un
lavoro sull'app dentro un passo che tocca i test.*

## PASSO 15 — I VALORI RICOPIATI: 39 righe, non quattro (15 settembre)

### ⚠️ La distinzione che il passo prevedeva, misurata

**Se il valore esiste altrove nel progetto, ricopiarlo è una copia; se il numero
è il requisito, è un'asserzione.** Confermata, e i requisiti sono **quattro
righe**: `test_batch10:105`, `test_batch12:188`, `test_batch12:189`,
`test_batch3:167`. Tutte leggono `APP_CONFIG` e asseriscono **cosa contiene**:
leggerle dalla fonte le renderebbe `label === label`.

**E una TERZA categoria che il passo non prevedeva: le FIXTURE.** In
`test_attese_condivise.js` i numeri `880 / 1046 / 1318 / 1568` servono a provare
`attendiTono`, non l'app: `window.suona` è un finto. Se domani il Traguardo
suonasse note diverse, quel test **deve restare verde**.

> **La differenza fra una copia e una fixture è se il valore INVECCHIA: una
> copia rompe la CI quando la fonte cambia, una fixture no.**

### ⚠️ Il quinto caso: una conversione fatta bene che produce un'asserzione vacua

`[B] Reset restores timeLimitSeconds to default (10)`. Dopo il reset
`APP_CONFIG` **è** il default, quindi leggerlo lì dà `afterReset === afterReset`.
**Il default si cattura prima che l'override esista**, e nel sito c'è scritto
perché, con il divieto di spostare quella riga più in basso.

### I colori erano in TRE posti, e la conversione cambia cosa prova il test

Il test confrontava le variabili CSS `--accent` con cinque letterali propri.
Le altre due copie sono **entrambe nell'app**: il CSS e
`APP_CONFIG.themes.options[].dot`. **Nessuno dei due legge l'altro.**

Convertito, il blocco smette di essere la terza copia e diventa **la guardia
contro le altre due**: non più *«il CSS vale quello che ho scritto qui»* ma
*«il CSS e `CONFIG` concordano»*. **Provato**: cambiando una cifra sola in
`themes.options[1].dot` il test va rosso; con la forma vecchia sarebbe stato
verde, perché non nominava `themes.options` da nessuna parte.

⚠️ **Il confronto ignora maiuscole e minuscole, ed è deliberato.** In `CONFIG`
quattro colori sono maiuscoli e uno minuscolo (`#7ec850`): **quell'incoerenza è
la firma della copia fatta a mano** — se i due posti derivassero l'uno
dall'altro non *potrebbero* differire. Uniformarli cancellerebbe la prova senza
togliere la duplicazione.

### Due difetti trovati convertendo

**① `sound.events.corretto` non ha `volume`.** L'etichetta del test diceva
*«più basso di Corretto/Sbagliato default (0.15)»* ed era falsa due volte:
`sbagliato.volume` è **0.22**, e **0.15 non compare in `CONFIG` da nessuna
parte** — è il default scritto dentro `sfxPlayTone`
(`volume === undefined ? 0.15 : volume`). **È una violazione della regola 3**, e
finché quel default non entra in `APP_CONFIG` il test non ha niente da leggere:
il numero resta nel test, con scritto accanto che è il default del codice e non
una copia di `CONFIG`.

**② Il censimento aveva mancato le etichette di UNA PAROLA SOLA.** Il filtro
cercava stringhe con uno spazio dentro, quindi `'Inizio'` e `'Quiz'` non
comparivano. **Trovate leggendo il codice, non contandolo** — ed è il limite di
qualunque censimento fatto con un'euristica sul testo.

## ⚠️ APERTO — `test_batch19.js`, la causa si sta stringendo (11 → 15 settembre)

**La condizione era: alla prossima CI rossa si legge il motivo che la funzione
stampa, invece di ricominciare a ipotizzare. ESEGUITA il 15 settembre, e ha
funzionato.**

**Quello che la CI ha detto:**

```
toccaFinoA(qm, giusta) si arrende: esaurite le mosse senza incontrare una
risposta giusta | mosse 53/53 | totale letto alla partenza: 12
```

**Tre cose nuove, tutte da quella riga.**

**① Non è il countdown, definitivamente.** Stavolta è caduto **`[QM Task1]` —
Match Practice, quello SENZA timer.** L'ipotesi misurata e caduta l'11 settembre
è morta anche dal lato opposto.

**② Non è sfortuna.** 53 mosse fra quattro opzioni senza mai incontrare una
risposta giusta ha probabilità **3 su 10 milioni**. È sistematico.

**③ E quello che ancora mancava: DOVE sono finite le 53 mosse.** Il ciclo ha
cinque diramazioni che consumano una mossa **senza mai toccare un'opzione**
(popup, ripasso, riquadro aperto, ultima domanda). Se il giro gira a vuoto in
una di quelle, `giusta` non viene mai valutato.

**Fatto il 15 settembre:** la funzione ora stampa la **ripartizione** delle
mosse, e **si ferma dopo dodici mosse di fila senza toccare un'opzione**
nominando la diramazione. Misurato col riquadro che non si chiude: **13 mosse
invece di 53**, e `{riquadro: 12, tocchi: 1}`.

⚠️ **E il posto del controllo è stato la correzione, non un dettaglio:** la
prima versione stava in mezzo al ciclo e **non è mai scattata**, perché ogni
diramazione fa `continue` e la salta. *Misurato, non dedotto: 52 mosse su 53
spese sul riquadro e il controllo mai raggiunto.* Ora è in cima al ciclo.

**Condizione che resta: alla prossima rossa si legge la RIPARTIZIONE, e quella
dice la diramazione. Da lì la causa è una sola ricerca, non cinque.**

Il fatto: rosso in CI su `16dd7bd`, verde in locale, due asserzioni cadute più
una **non partita** (39 su 40 — e a vederlo è stato il contatore delle
asserzioni, non il conto dei rossi). Il blocco gemello senza orologio
(`[QM Task1]`) è passato. Il file registra in testa che lo stesso `[SR Task1]`
era già rosso **2 giri su 3 l'8 settembre**.

**Due ipotesi misurate e cadute**, e vanno scritte perché nessuno le rifaccia:

| ipotesi | misura | esito |
|---|---|---|
| il countdown di Speed Match scade fra il click e la lettura dell'esito | `timeLimitSeconds` a 1 | **verde, 40/40** — e il blocco alza già il limite a 30 apposta |
| la schermata compare prima delle opzioni | sonda a 10 ms | **compaiono insieme** (35 ms): il `waitForFunction` le copre già |

⚠️ **Quello che è stato fatto NON è una correzione della causa**: `toccaFinoA`
adesso dice **quale delle cinque uscite** ha preso, con mosse su budget e il
totale letto alla partenza. *Un guasto che non sa nominarsi costringe chi lo
trova a indovinare — ed è la stessa forma di `attendi.sh`.*

**Difetto latente segnalato dalla stessa riga:** se il contatore non si legge,
`totale` è `null` e il budget di mosse crolla da ~30 a **8**, in silenzio.

## ⚠️ PRIMA DELLA FASE 4 — l'app finirà dietro un login, e questo cambia COME si divide

**Deciso da chi guida il progetto l'11 settembre. Non è lavoro per adesso: è un
vincolo da sapere PRIMA di cominciare a pensare allo spacchettamento**, perché
arriva dopo averlo disegnato costa il disegno.

> **IL BROWSER HA SEMPRE IL MINIMO INDISPENSABILE.**
> Prima del login: **solo il login**.
> Dopo il login: **solo il pezzo che si sta usando**.

**Quindi lo spacchettamento non deve solo dividere bene — deve produrre pezzi
CONSEGNABILI SEPARATAMENTE.** Il rischio concreto, nelle parole di chi lo ha
posto: *uno strato che contiene sia cose che servono al login sia cose che
servono solo dopo non lo spezzi più, e il login si porta dietro roba che non gli
serve.*

⚠️ **E la domanda a cui va risposto prima di dividere, non dopo:** gli script
separati (passi 20-23) funzionano perché **l'ordine di caricamento È la
struttura**, e tutto si carica all'avvio. **Col caricamento a richiesta quella
forma regge ancora, o serve altro?** *Se la risposta è «serve altro», va saputo
PRIMA di dividere* — perché è la differenza fra un ordine di `<script>` e un
sistema di moduli, e non è una cosa che si aggiunge dopo a una divisione già
fatta.

**Da valutare (regola 34), non da eseguire.** La valutazione si consegna a
codice fermo, e prima del passo 20.

## Le tre cose della sera del 2026-09-10, e in che ordine

*Decise insieme dopo il ①+B. Stanno qui e non nella fase 2-bis perché non sono
mastery: sono la manutenzione degli strumenti con cui la catena si verifica.*

| | Cosa | Stato |
|---|---|---|
| **①** | **`attendi.sh` si arrende da sola**, e dice **quale** dei due guasti ha davanti. La forma è stata scelta da una misura e non da un'intuizione: la forma di `run_full_regression.sh` rende il silenzio massimo legittimo pari alla durata del file più lento — 192 s, su 1019 s di suite. ⬇︎ | ☑ **FATTO il 2026-09-10** |
| **②** | **La riga in `CLAUDE.md` sul test che guida un caso solo**, con le parole di chi guida il progetto: *«UN TEST CHE DICHIARA DI GUIDARE UN CASO SOLO NON BASTA A PROTEGGERE UNA RIGA CHE VALE PER TUTTI. Se la riga è condivisa, il test deve toccare almeno il caso più DIVERSO — non il più comodo.»* Con accanto l'esempio del giorno: Personalizza è **l'unico di sedici moduli senza `dataFile`**, e il test appena scritto guidava Voice Coach, cioè il caso più simile. | ☑ **FATTO il 2026-09-10** — è la **regola 42**, con la parte operativa che la rende eseguibile invece che raccomandata: quando una modifica tocca una riga condivisa, nel riepilogo si **nomina** il caso più diverso e si dice cosa lo rende tale. E la regola 32 porta ora il rimando: *dichiarare un limite non è difendersi da quel limite* — la dichiarazione serve a chi legge dopo, non a chi la scrive. |
| **③** | **Le tre regole violate: «è fortuna, non una difesa».** Nota per un giorno futuro, **non da eseguire adesso**: le regole 19, 36 e 37 descrivono un comportamento senza dare uno strumento; la 41 porta **comandi** e il contatore di asserzioni **è** uno strumento. *Quelle non si violano leggendole, perché o le esegui o non le esegui. Le prime sono quelle che cedono* — ed è la stessa forma di `attendi.sh`: la difesa spostata dove non dipende da chi se la ricorda. | ☐ **segnalato, non in coda** |

**Restano poi due lavori già decisi**, che non fanno parte di questa terna: le
**tre orfane di Voice Coach** — da guardare insieme alla divisione della pulizia
in due posti, che è la causa — e il **14b**, il cui conto va **rigenerato** con
`node tests/tools/conta-attese.js` e non ripreso dal numero di una mattina.

#### ⚠️ LA FAMIGLIA CHE LA FASE 4 PRODUCE DI MESTIERE — trovata al passo 19

> **UN COMMENTO GIUSTO SMETTE DI ESSERE VERO QUANDO CAMBIA IL MONDO INTORNO,
> NON IL CODICE CHE DESCRIVE.**

Scritta per esteso in `tests/ERRORI-INGOIATI.md` come **famiglia ⓪-quinquies**.
Qui sta perché **riguarda ogni passo che resta**, non solo quello che l'ha
trovata.

Il caso: accanto alla seconda strada per aprire il Pannello Admin c'era

> *«by the time a 0ms timeout fires, the whole script has finished running»*

Vero, e ancora vero per `EPISODES`. **Falso per il magazzino dal momento in cui
è uscito da `APP_CONFIG`** — per una modifica in un altro punto del file, che
quel commento non nomina e che non nomina quel commento.

```
setTimeout(…, 0) aspetta «più tardi nello STESSO SCRIPT».
Non aspetta «più tardi SULLA RETE».
```

⚠️ **Nessuna delle quattro famiglie precedenti lo trova**, ⓪-quater compresa:
lì rileggere il commento lo conferma, qui rileggere il commento **insieme al
suo codice** lo conferma — sono ancora coerenti fra loro. È un terzo file ad
averli smentiti.

#### ⚠️ E LA SUITE HA TROVATO IL TERZO LETTORE — quello che avevo GUARDATO

Il triage del passo 19 dichiarava **due** lettori oltre a `resolveSlotTable`: il
Pannello Admin e `applyConfigOverrides`. **Ce n'era un terzo, e stava in un file
che avevo già aperto.**

`tests/module-order.js` → `slotValues()` → `readTable(html, …)` leggeva le
tabelle **dal testo di `index.html`**, con un'espressione regolare sul sorgente.
Non `CONFIG.people`, non un `fetch`: il file come **stringa**.

⚠️ **E l'avevo in mano.** La ricerca aveva trovato `module-order.js:115`
(`slot.table.indexOf('people.')`) e l'avevo classificata *«legge lo slot dal
file dell'episodio, non gli serve il magazzino»*. **Vero per quella riga, falso
per la funzione intorno**, che tre righe più sotto chiamava `readTable`.

> **GUARDARE LA RIGA TROVATA INVECE DELLA FUNZIONE CHE LA CONTIENE È IL MODO IN
> CUI SI PERDE UN LETTORE AVENDOLO DAVANTI.**

*Il costo: due file rossi, `test_batch15` (il vocabolario atteso restava
`"I am {{papa}}."` contro `"I am Marco."` a schermo) e il calo di cinque
asserzioni in `test_interruttore_episodio`. Li ha trovati la suite, non io — ed
è esattamente il lavoro per cui esiste.*

**Cosa cercare a ogni estrazione:** non chi *nomina* il dato che si sposta, ma
**chi lo aveva per costruzione**. Al passo 19 la ricerca testuale su
`CONFIG.people` dava **zero occorrenze**, e c'erano due lettori. *Ogni difesa
che si appoggia a «tanto è già tutto in memoria» è scritta contro un'ipotesi
che lo spacchettamento esiste per rimuovere.*

#### TROVATO E NON CORRETTO — `window.APP_CONFIG_DEFAULTS` è scritta e mai letta

**Misurato il 2026-09-15, passo 20:** una sola occorrenza in tutto il
repository, la sua assegnazione. È una **copia profonda di ~660 righe fatta a
ogni caricamento di pagina**, e nessuno la legge.

Il commento che aveva accanto diceva che serve al pulsante «Ripristina valori
di partenza». Quel pulsante esiste (`config-panel-reset-btn`) e **fa un'altra
cosa**: cancella la chiave degli override e ricarica. *Il ripristino funziona;
non funziona così.* È ⓪-quater — motivazione falsa accanto a codice giusto — e
si è trovata **leggendo la funzione che il commento indicava**, non la riga.

**Il commento è già corretto**, la riga no: toglierla è una **rimozione** e non
una correzione (regola 1), quindi non si fa di iniziativa.

**Condizione:** si decide **quando si estrae lo strato che contiene il Pannello
Admin** (passo 22). Lì si saprà se il ripristino «ai valori di partenza» debba
davvero tornare ai valori del codice — e allora `DEFAULTS` serve e va *letta* —
oppure se cancellare gli override sia il comportamento voluto, e allora la riga
si toglie. *Deciderlo adesso significherebbe scegliere una delle due senza
guardare il pannello.*

#### TROVATO E NON CORRETTO — lo studente non vede niente mentre il modulo carica, **e può toccare di nuovo**

**Misurato il 2026-09-16**, rete rallentata a **1,5 s** sul file dell'episodio,
400 ms dopo il tocco su una riga della mappa:

| | |
|---|---|
| vista attiva | `view-map` — **resta sulla mappa** |
| la riga si spegne? | **no** |
| classi e testo della riga | **invariati**, nessun indicatore |

Il principio del giro B del passo 18 è rispettato — *«non mostrare finché non
c'è»*, e infatti non compare niente di rotto. **Manca l'altra metà: il segno
che sta succedendo qualcosa.**

⚠️ **E la parte peggiore non è che non veda: è che PUÒ TOCCARE DI NUOVO.** La
riga non è disabilitata, quindi un secondo tocco mentre il primo è in corso
avvia una seconda `openModuleFromMap`. Oggi le promesse sono in cache e il
danno non si vede; è un gesto possibile che nessuno ha deciso di ammettere.

**Perché non è stato fatto al 21-ter:** sarebbe stato un secondo sospettato su
un rosso, in un passo che cambia già come si risolve un modulo.

**Condizione: al passo 22**, quando al fetch dei dati si aggiungerà quello
dello script del modulo e la finestra smetterà di essere teorica. *I numeri qui
sopra sono scritti apposta: al 22 serviranno, e rimisurarli costerebbe più che
averli scritti.*

#### DA APPLICARE A `CLAUDE.md`, REGOLA 33 — al prossimo giro che la tocca

**Deciso il 2026-09-15.** La regola 33 dice che un file di contenuto sotto
`docs/{lingua}/` non si modifica di iniziativa. Le va aggiunta l'eccezione che
il passo 19 ha prodotto:

> **Se un tuo commit rende FALSA una frase in un file di contenuto, quella
> frase la correggi senza chiedere.** Il permesso serve per il **contenuto**,
> non per i **fatti che hai appena cambiato tu**.

*Il caso: il paragrafo d'apertura di `tabelle-personalizzazione.md` diceva
«oggi le tabelle vivono in `APP_CONFIG`», ed è il commit del passo 19 ad averlo
reso falso. Lasciare in piedi una frase falsa creata da sé è peggio che toccare
una riga in più — e non è iniziativa sul contenuto, è manutenzione di un fatto.*

**Condizione:** si scrive dentro `CLAUDE.md` **al primo giro che tocca quel
file**, non prima e non con un commit apposta. Sta qui perché un passo dello
spacchettamento potrebbe non toccarlo per giorni, e quello che resta solo nella
conversazione è già perso (regola 43).

## Le invarianti, valide per tutta la catena

- **Venti suite invece di un macello.** Nel dubbio fra una corsa e due, se ne fanno due:
  **5,4 minuti l'una in locale** (al 2026-09-15, a quattro in parallelo), e ogni rosso ha
  un sospettato solo. **Non si accorpa per fare un favore a nessuno.**
  ⚠️ *Qui c'era scritto «undici minuti», misurati il 2026-09-07 su una suite di 42 file.
  Il tempo porta la data apposta: **l'argomento si è rafforzato**, non indebolito, e chi
  legge un numero senza data lo crede attuale.*
- **Lo stato di questa tabella si aggiorna nello stesso commit del passo**, non a fine
  giornata. È la stessa regola dei test (23) e dei rilievi di collaudo: quello che si
  rimanda a dopo lo si scrive guardando il risultato, non registrando la scelta.
- **Una suite contaminata a metà è un risultato nullo** (regola 36): se un file cambia
  mentre gira, si butta e si rilancia.
- **Ogni passo che crea un test lo committa insieme al codice** (regola 23), e ogni test
  nuovo si vede **fallire apposta** prima di consegnarlo.

---

## Come si lavora

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|

| 2026-09-09 | **Una rinomina si verifica su TUTTE le forme del nome, e ogni forma ha il suo COMANDO.** ➜ **SPOSTATA IN `CLAUDE.md` COME REGOLA 41** il 2026-09-09, con i sei comandi in tabella. *Da quando porta i comandi non è più una nota su come abbiamo lavorato: è una procedura che una sessione nuova deve eseguire, e `CLAUDE.md` è il posto dove si guarda prima di cominciare.* | Tre cadute della stessa famiglia, e la terza è quella che ha cambiato la forma della regola: una forma **elencata e non cercata**. La storia per esteso è nella regola 41. | **Fatto.** Qui resta il rimando, perché la catena la cita in più punti. |

## Rinomine

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-06 · nomi decisi il 2026-09-08 | **La rinomina unica: cinque nomi in un lavoro solo.** `se* → storyCards*`, `srShuffle → shuffle`, `quickMatch* → match*`, `speedRound* → speedMatch*`, `flashcardLevelA → flashcard`, più gli id degli episodi `gate → gate` e `aircraft-door → aircraft-door`. **I nomi e le loro ragioni stanno in `docs/inglese/it/struttura-corso.md`, sezione «I nomi in codice»** — qui c'è la decisione di eseguirla, non i nomi. Segue il `kind`/id del modulo e lo strato in kebab (`speak-easy-*`, `quick-match-*`); **NON seguono le sigle di due lettere** (`qm-`, `sr-`, `fc*`), e questa è una decisione scritta, non una dimenticanza. | I nomi vecchi sono prefissi ereditati dal primo modulo che li ha introdotti, o nomi che mentono: `flashcardLevelA` si porta dentro il grado A mentre lo stesso descrittore gira sul grado B, e `se*` viene da «Speak Easy», un modulo che non esiste più — scritto per esteso in **54 punti** come `speak-easy-*`. **E la premessa da correggere: non è solo l'id dell'episodio a toccare i progressi salvati.** `se*` nomina due namespace del `localStorage` (`seDeclarations:`, `seExplanationStats:`), e i `kind`/id dei moduli sono le chiavi di `modules:`, `moduleOutcome:`, `audioSecondsSent:`, `nextLineSkips:` e `introDismissed:`. Quattro rinomine su cinque lasciano dati orfani, non una. | **Prima di un collaudo su profilo nuovo**, finché siamo gli unici utenti e non c'è niente da migrare. **Una rinomina per volta, suite completa fra una e l'altra**, dal più piccolo al più grande: `shuffle` → `flashcard` → `match*` → `speedMatch*` → `storyCards*` → gli id degli episodi. Così il primo rosso ha sempre il sospettato più piccolo possibile. Non va più insieme a Supabase. |

## Misure fatte, e il difetto che hanno chiuso

*Sta fuori da «Difetti silenziosi trovati e **non ancora** corretti» perché
questo è corretto, e un titolo che promette una cosa e ne contiene un'altra è
la stessa famiglia del commento falso. Resta qui e non solo in `correzioni.md`
perché la parte che vale non è la correzione — sono i **numeri**, e le due
ipotesi misurate e scartate.*

### ⚠️ IL MODULO SI APRIVA PRIMA DI AVERE QUELLO CHE GLI SERVE — misurato e CORRETTO il 2026-09-10

**Riprodotto, non ipotizzato.** Ritardando di due secondi il fetch di
`messaggi-feedback.json` e premendo il microfono, esce lo stesso errore del log
della CI #99: `TypeError: Cannot read properties of null (reading 'english')`.

**La catena, e nessun anello è un caso:**

1. `openVoiceCoach` disegna la schermata e **abilita `vc-record-btn`** — la
   condizione è solo `!VCSpeechRecognition`, cioè «il browser sa ascoltare»,
   non «il modulo ha una battuta».
2. `#vc-target` mostra ancora `"Caricamento..."` e `vcCurrentLineObj` è `null`.
3. La battuta viene impostata solo dentro
   `Promise.all([loadEpisodeData(module), loadFeedbackMessages()]).then(...)` —
   e **quel `Promise.all` aspetta anche `messaggi-feedback.json`**, che è un
   fetch vero: i dati dell'episodio sono già in cache (`openModuleFromMap`
   aspetta `ensureEpisodeSlotFields` prima di aprire qualunque modulo), quel
   file no.
4. Il gestore del pulsante microfono fa `tokenize(vcTargetText())`, cioè
   `vcCurrentLine().english`, **senza guardia**. Su `null` esplode.

⚠️ **NON è un difetto dei test: è dell'app.** Uno studente su una rete lenta
vede il microfono acceso sopra la scritta «Caricamento...», preme, e **non
succede niente** — nessun messaggio, nessuna spiegazione, nessuna schermata
d'errore. La regola 35 non lo copre: quella difende il **fallimento** del
caricamento, non la **finestra** in cui sta ancora arrivando.

**E la finestra vale per TUTTI e otto i moduli, non per Voice Coach.** Misurato
uno per uno: in quella finestra il pulsante di lavoro è presente e **attivo** in
otto casi su otto. Solo Voice Coach ci **muore** dentro perché dereferenzia; gli
altri sette accettano un gesto che non fa niente — che è più silenzioso e non
per questo migliore. **L'unico che si difende è Why We Say It**, il cui pulsante
è spento.

⚠️ **È il terzo difetto in due giorni causato da `messaggi-feedback.json`**, dopo
il sottotitolo della Schermata Finale e le cinque corse dei test. Non è una
coincidenza: **è l'unico fetch che nessuno aspetta**, perché sembra un dettaglio
di testo e invece sta dentro il `Promise.all` che decide quando un modulo è
pronto.

**Cosa NON è.** Due ipotesi sono state misurate e scartate, e vanno scritte
perché non tornino: *(a)* non è l'episodio che arriva tardi — `openModuleFromMap`
lo aspetta, e ritardando quel file il modulo semplicemente non si apre; *(b)* non
è stato ereditato da un modulo precedente — `[A]`, `[B]` e `[C]` del test usano
pagine e utenti diversi, e `vcCurrentLineObj` **è** azzerata all'apertura.

**CORRETTO il 2026-09-10, e la misura ha cambiato la correzione invece di
confermarla.**

⚠️ **La causa non era «il modulo si apre presto»: era un PRECARICAMENTO
TRAVESTITO DA DIPENDENZA.** Il `Promise.all` aspettava
`loadFeedbackMessages()` — e `results[1]` **non veniva mai letto**. Il modulo
restava «in caricamento» per un file di testi che non gli serviva per aprirsi.

*La prova che era una riga copiata e non una scelta di qualcuno: `openStoryCards`
fa lo stesso `Promise.all` con `loadModuleInstructions()` e `results[1]` **lo usa
davvero** — i testi del self-check, l'hint del completamento. Là serve; qui no.*

**I due numeri, prima e dopo** (`tests/tools/misura-finestra-apertura.js`):

| | Finestra fra «il microfono è acceso» e «la battuta c'è» |
|---|---|
| prima | **17 ms** di mediana (8–30) — **tutti** dovuti a quel file |
| dopo | **1 ms**, e al click la battuta è già a schermo |
| prima, con la rete lenta simulata (2 s) | `TypeError` **3 volte su 3** |
| dopo, stessa rete lenta | nessun errore, la battuta c'è comunque |

**① Tolto il precaricamento** da `openVoiceCoach`: una riga, e toglie la causa
invece di gestirla. **② E `openModuleFromMap` aspetta anche `loadEpisodeData`**,
non solo `ensureEpisodeSlotFields` — il punto unico da cui passano tutti e otto
i moduli.

⚠️ **Il beneficio di ② è dichiarato TEORICO nel codice**, perché chi lo trova non
lo tolga credendolo inutile: dopo ① la finestra è già chiusa in pratica, e ②
serve a renderla **impossibile** invece che irraggiungibile — cioè a coprire il
giorno in cui un modulo avrà un `dataFile` suo o verrà aperto da un punto che
non è la mappa.

⚠️ **La strada scartata, e la ragione dello scarto vale più della scelta:**
spegnere i pulsanti di lavoro in ognuno degli otto moduli sarebbe stata la
**nona famiglia** della conoscenza che ogni file deve ricordarsi da solo —
aggiunta proprio mentre ne stiamo chiudendo quattro.

⚠️ **E IL SEGNALE DI CARICAMENTO È STATO RITIRATO DALLA MISURA.** Era già stato
proposto e accettato: «la riga della mappa mostra di star caricando». Poi il
numero — **17 ms** — l'ha reso rumore: un avviso che compare e sparisce in
diciassette millisecondi sfarfalla, ed è peggio del nulla. *Diciassette
millisecondi non sono un secondo, e la differenza si vede solo misurando.*

**La conseguenza da tenere a mente, scritta anche nel codice:** quel
precaricamento **scaldava la cache dei messaggi per tutti i moduli**, senza che
nessuno lo avesse deciso. Verificati uno per uno i cinque lettori di
`messaggi-feedback.json`: **nessuno si appoggiava a quella cache calda** — ognuno
fa il proprio fetch con il proprio `.catch`, e `openAttemptPopup` mostra
addirittura un testo di ripiego prima che il dato arrivi. Ma **le attese dei test
su quei testi diventano più importanti, non meno**: chi le rimettesse a tempo le
vedrebbe cadere prima.

Protetto da `tests/test_modulo_pronto.js`, visto fallire su due guasti.

## Difetti silenziosi trovati e non ancora corretti

### ⚠️ LA TERZA VOCE DEL GIRO DI DESIGN: REPORT VERDE E MAPPA ROSSA, TUTTI E DUE CORRETTI

**Detta il 2026-09-19 da chi guida il progetto, e scritta qui perché era stata
detta e mai registrata.** Le sue parole, non un mio riassunto:

> Dopo un ripasso riuscito, il report mostrerà la parola **VERDE** mentre la
> mappa continua a mostrare il badge del primo giro. Sono tutti e due
> corretti, e allo studente sembreranno contraddittori — *«perché il report
> dice che la so e la mappa dice che è andata male?»*.
>
> Si uniforma o si spiega **QUANDO IL REPORT SARÀ VISIBILE, non prima**: oggi
> non sappiamo ancora cosa vedrà lo studente.

⚠️ **È la conseguenza della prima voce, non una voce indipendente — e merita
la sua riga lo stesso:** la prima descrive **due dati**, questa descrive
**cosa vede una persona**. *Una riga che parla di dati non fa venire in mente
la domanda che si farà lo studente; e la domanda è il problema, non i dati.*

**Quando si esegue:** *quando il report sarà visibile allo studente*, e non
prima. Decidere adesso fra «uniformare» e «spiegare» significherebbe scegliere
senza sapere che cosa lui avrà davanti.

**Il giro di design sulla mastery ha ora TRE voci**, e sono tutte della stessa
famiglia — *un dato corretto senza un posto dove farsi leggere*:
① i due colori che si chiamano tutti e due «colore»;
② la media di Voice Practice che nessuno mostra;
③ questa.

### ⚠️ OGNI TAG `<script>` NUOVO ALLARGA LE CORSE CHE GIÀ C'ERANO

**Misurato il 2026-09-19**, estraendo il terzo modulo: `test_new_features.js`
è andato rosso su `window.APP_CONFIG` letto **subito dopo** il ricaricamento
innescato dal «Reset» del Pannello Admin. L'attesa era su *«il documento è
stato sostituito»* — vero all'**inizio** del nuovo documento, mentre fra quel
momento e `APP_CONFIG` ci sono **diciotto script** da caricare.

**Non l'ha rotta `app/match.js`: l'ha resa visibile.** La corsa c'era da
sempre; il tag nuovo l'ha allargata quanto basta.

⚠️ **È la regola 19 vista dal verso del NUMERO DI FILE invece che da quello
della macchina lenta**, ed è un verso che la regola oggi non nomina. Lo
spacchettamento è passato da 1 file a 18, e ne mancano **tre**.

**Quindi, operativamente:** se un altro test diventa rosso su uno stato letto
poco dopo un caricamento o un ricaricamento, **è questa famiglia, non un caso
nuovo** — e la correzione è sempre la stessa, spostare l'approdo sull'ULTIMO
effetto (`.view.is-active`, cioè `boot()` ha scelto una vista) invece che sul
primo.

**Quando si esegue:** *non c'è niente da eseguire finché non ricapita.* Questa
riga esiste per far riconoscere il caso al primo colpo invece che al terzo.


### ⚠️ `conta-asserzioni.js --scrivi` HA SCRITTO UN BASELINE DA ZERO SENZA FERMARSI

**Trovato il 2026-09-19**, aggiornando il baseline dopo la suite del quarto
modulo. Lanciato dalla radice del repository con `tests/test_*.js` invece che da
`tests/` con i nomi nudi, lo strumento **non ha trovato nessun file di esito** e
ha scritto un baseline di **`0 asserzioni in 0 file`**, riportando zero e
uscendo con successo.

**Il difetto non è il mio comando sbagliato: è che lo strumento ha SCRITTO.**
Un baseline a zero è la cosa peggiore che quel file possa contenere — è il
guardiano del «qualcosa ha smesso di girare», e a zero **non può più scendere**:
qualunque corsa futura sarebbe «in aumento». *Il numero era stampato, quindi non
era muto; ma era stampato **accanto a una scrittura già avvenuta**, e chi non lo
legge ha appena disarmato la difesa senza nessun rosso.*

È la regola 37 nella variante che riguarda chi SCRIVE e non chi misura: **una
misura che non misura è pericolosa quando qualcuno se ne fida; una che non misura
e si salva da sola è pericolosa anche quando nessuno la guarda.**

**Ripreso a mano** (`git checkout`) e riscritto dalla cartella giusta: 1487 in 68.

**Quando si esegue:** *alla prossima volta che si tocca `conta-asserzioni.js`*, e
la correzione è di una riga — `--scrivi` si rifiuta quando i file di esito
trovati sono **meno** di quelli chiesti, dicendo quanti e quali mancano. **Non un
avviso: un rifiuto**, perché un avviso accanto a un file già scritto è
esattamente quello che è appena successo.

### ⚠️ HO FERMATO UN PROCESSO PER NOME, AVENDO LETTO LA REGOLA CHE LO VIETA

**2026-09-19, lanciando la suite dopo il sesto modulo.** Comando:
`pkill -f "node tests/serve.js"` seguito, **nella stessa riga**, da `rm -f
tests/suite.log` e dal lancio della suite.

**Esito, identico al caso del 2026-09-15 che la regola 37 descrive parola per
parola:** uscita **144** (SIGTERM) — il `pkill` ha trovato **la propria shell**
e l'ha uccisa. Il `rm` non è mai girato, la suite non è mai partita, e
`tests/suite.log` è rimasto quello di **trentatré minuti prima**, di un altro
albero.

⚠️ **Se avessi aspettato su quel file, `attendi.sh` avrebbe trovato
`ALL FILES GREEN` e detto che era andato tutto bene.** Un verde vero di una
corsa sbagliata: la regola 37 nella sua forma peggiore, un risultato vecchio
che somiglia a un risultato nuovo.

**Non mancava la regola: è scritta in `CLAUDE.md` con questo esatto esempio, e
l'avevo letta lo stesso giorno.** È la stessa forma della 19 e della 42: *una
frase che descrive un comportamento cede dove un comando non cederebbe.* Qui
il comando giusto c'era pure — `SERVER_PID=$!` + `trap cleanup EXIT` dentro
`tests/run_full_regression.sh` — e non l'ho guardato.

**E il `pkill` non serviva a niente:** `run_full_regression.sh` stampa
*«Server già attivo sulla porta 8955 — lo riuso»*. Il processo da fermare non
c'era. *Il gesto più pericoloso della giornata è stato anche l'unico
completamente inutile.*

**Cosa ha salvato il giro:** aver guardato l'uscita del lancio invece di
fidarsene, e la **data del file** — non lo strumento.

**Quando si esegue:** *alla prima occasione in cui serve davvero fermare un
processo.* Va deciso se la difesa debba diventare meccanica (uno script
`tests/tools/ferma-server.sh` che lavora per porta e PID, come `attendi.sh` ha
fatto per l'attesa) invece di restare una regola da ricordare. **La regola 41
dice che un elenco di comandi o lo si esegue o non lo si esegue, mentre un
elenco di nomi si crede di averlo applicato: qui vale uguale.**

### ⚠️ IL MAGAZZINO DELLE PULIZIE NON HA PIÙ UN CONTENUTO FISSO: HA QUELLO DEI FILE CARICATI

**Trovato il 2026-09-19, estraendo `app/speedmatch.js` — il quarto modulo, e il
primo che porta via una PULIZIA.**

`srPulizia` chiama `BI.registraPulizia` **a tempo di parsing**, cioè quando il
file viene letto. Finché stava dentro `index.html` si registrava sempre; adesso
si registra **se quel file arriva**. Nel baseline dell'avvio si vede: la pulizia
risale da `pulizia 5` a `pulizia 3`, perché ora è letta prima.

**Oggi non cambia niente, e va detto per intero:** i diciotto tag si caricano
tutti al boot, quindi tutte e cinque le pulizie ci sono, e `test_avvio_invariato`
lo verifica (`[D] Le pulizie registrate sono 5`).

⚠️ **Ma `stopAllModuleActivity` ha smesso di essere una funzione con un
contenuto noto, ed è diventata una funzione con un contenuto DIPENDENTE dal
caricamento.** Dal giorno in cui un modulo si carica su richiesta — che è
esattamente quello che il passo 22 rende possibile e che `BI.moduliCaricatiAlBoot`
esiste per dichiarare — **una pulizia non registrata è una pulizia che non
gira**: un timer resta acceso uscendo da un modulo che non era mai stato aperto
in quella sessione. *Non dà errore. È la forma del difetto silenzioso che questa
serie ha già pagato due volte.*

**E le altre quattro sono nella stessa condizione appena escono:** `vcResetRecording`
(Voice) e `dgClearAllTimers` (Dialogo) sono i due moduli ancora da estrarre.

**Quando si esegue:** *prima di rendere falsa `BI.moduliCaricatiAlBoot`*, cioè nel
passo che fa caricare un modulo su richiesta — mai dopo. Chi lo scrive deve
decidere lì se la pulizia di un modulo mai caricato debba esistere lo stesso
(registrata dal catalogo invece che dal file) o se è giusto che non esista
(non c'è niente da pulire in un modulo mai aperto). **Le due strade danno la
stessa app oggi e due app diverse quel giorno**, ed è il motivo per cui la scelta
va fatta guardandola, non ereditata.

### ⚠️ IL RIPASSO DI FLASH CARD: NON È CAMBIATO NIENTE — SONO DUE COLORI DIVERSI

**Misurato il 2026-09-19** su una domanda precisa: *«il ripasso non sovrascrive
più il colore; il 10 settembre scriveva. È cambiato, o il collaudo aveva letto
altro?»*

**Risposta: non è cambiato. Sono due colori, con due regole diverse, e valgono
tutte e due da fine agosto.**

| Colore | Chi lo scrive | Il ripasso lo tocca? |
|---|---|---|
| **le voci** (magazzino mastery) | `BI.recordPendingMastery(unitId, result)` in `fcRecordResult`, **senza nessuna guardia** | **SÌ**, a ogni risposta, ripasso compreso |
| **il badge in mappa** (SelfScoreRules) | `fcFirstTryCorrectCount / fcVocab.length` in `fcFinishPassCheck` | **NO**, mai |

E la seconda riga il codice la dice da sé, in un commento che sta lì da prima
del collaudo: *«the Schermata Finale score counts first-try correct answers
only — a later retry-pass success doesn't inflate it»*.

**Le prove, e sono due indipendenti:**

① **Confronto col codice del 10 settembre.** `fcFinishPassCheck` è **identica
carattere per carattere** all'ultimo commit di quel giorno (`90dd9c2`,
21:26 UTC). `fcRecordResult` differisce **solo** per il prefisso `BI.` aggiunto
oggi con l'estrazione.

② **Età dei due contatori.** `fcFirstTryCorrectCount` nasce il **2026-08-27**,
`fcLastAvgPct` il **2026-08-28** — entrambi **prima** del collaudo. L'unico
commit che li ha toccati dopo è lo spostamento di oggi.

**Perché il collaudo del 10 diceva il vero.** Quel giro verificava *il travaso
al gesto*, cioè il magazzino della mastery — la **prima** riga della tabella.
Quella scriveva allora e scrive adesso. *Non è stato letto altro: è stato letto
l'altro colore.*

⚠️ **NON CONFERMATO GUIDANDO L'APP, e lo scrivo invece di lasciarlo credere.**
Ho provato a pilotare un giro sbagliato + ripasso leggendo i due magazzini, e
il pilota si è impigliato nel popup della valvola di sicurezza senza arrivare
al riepilogo. La risposta qui sopra viene dal **codice e da `git`**, non dal
browser. *Una prova non fatta si dichiara, non si arrotonda.*

**Quello che resta aperto, ed è il motivo per cui questa riga sta fra i
difetti e non fra le correzioni:** i due colori si chiamano tutti e due
«colore» quando se ne parla, e **niente nell'interfaccia dice quale si sta
guardando**. La domanda è nata da lì, non da un guasto.

**Quando si esegue:** *al giro di design sulla mastery* — insieme alla media di
Voice Practice che nessuno mostra, già registrata. Le due cose hanno la stessa
forma: un dato che esiste, è corretto, e non ha un posto dove farsi leggere.


### ⚠️ IL TAGLIO PER SILENZIO CONTA DAL CLICK, UNA VOLTA SOLA — e il nome dice un'altra cosa

**Misurato il 2026-09-19** su una domanda precisa di chi guida il progetto:
*«esiste, in quel percorso, un valore di attesa che NON è tre secondi?»*

**Risposta: no.** Nella regione di Voice ci sono **due soli** timer, più uno che
non decide niente:

| timer | valore | cosa fa |
|---|---|---|
| `vcSilenceTimeoutId` | `silenceTimeoutSeconds * 1000` = **3000 ms** | taglia se non è stato riconosciuto NIENTE |
| `vcTimeoutId` | `parole × 1000 + 3000` ms | il tetto massimo della registrazione |
| `vcTimerInterval` | 1000 ms | aggiorna solo la scritta «0s, 1s, 2s» |

Cercati anche i numeri nudi in tutta la regione: restano `1000` (la scritta) e
`100`. **Nessun terzo valore.**

⚠️ **MA LA MISURA NE HA TROVATA UN'ALTRA, e spiega il sintomo senza bisogno
di un secondo numero: quel timer parte al CLICK e non viene MAI riavviato.**
Misurato: `vcSilenceTimeoutId = setTimeout(...)` compare **una volta sola** in
tutto il file, e `vcHeardAnySpeech` viene letto solo dentro quella callback.

Quindi la regola vera non è «tre secondi di silenzio»: è **«entro tre secondi
dal click devi essere già stato riconosciuto»**. Chi aspetta due secondi e poi
parla lascia al riconoscimento **meno di un secondo** per produrre il suo primo
risultato — e il primo interim di Chrome arriva con un ritardo suo. Se arriva
dopo il terzo secondo, il taglio scatta **mentre la persona sta parlando**.

*È la stessa forma della ⑰-quater: il codice fa quello che il suo commento
dice («secondi dall'avvio»), ma il NOME `silenceTimeoutSeconds` fa pensare a una
finestra che si riarma a ogni silenzio. Il nome è la cosa che si legge.*

**NON È STATO RIPRODOTTO**, e va detto: il finto riconoscimento risponde
subito, quindi il ritardo del primo interim **qui non esiste**. È il terzo
sintomo dichiarato scoperto in testa a `tests/test_comportamento_audio.js`.

**Quello che chi guida il progetto può escludere in un gesto, e io no:** un
**override** del Pannello Admin nel suo `localStorage` (chiave
`baseinglese:configOverrides`) che cambi `silenceTimeoutSeconds` sul suo
browser soltanto. Da qui non è visibile.

**RICONFERMATO A MANO il 2026-09-19 da chi guida il progetto, con lo stesso
confine:** partendo prima del secondo 2 sente, fra il 2 e il 3 non sente. *Non
riprodotto qui e riprodotto lì due volte: la misura del codice e il gesto
dicono la stessa cosa.*

⚠️ **E UNA RIGA CHE CHIUDE LA STRADA ②, detta dallo stesso giro e non deducibile
dal codice: RINOMINARLO NON BASTA.**

> *«Lo studente vede "tre secondi" e pensa di avere tre secondi per
> **cominciare** — non per finire. Qualunque nome gli diamo, quel confine resta
> un bug agli occhi di chi lo usa.»*

Il nome è quello che legge **chi scrive il codice**; il confine è quello che
incontra **chi usa l'app**. La ② sistemava il primo e lasciava intatto il
secondo — *e un difetto che resta difetto dopo la correzione non è stato
corretto, è stato spiegato.* **Resta la ①: riarmare il timer.**

**Quando si esegue:** *al passo 26.* Non prima, ed è una decisione presa: il
lavoro sul microfono non si apre in mezzo allo spacchettamento.


### ⚠️ QUATTRO PEZZI CONDIVISI RESTANO IN `index.html` PERCHÉ LEGANO LA SESSIONE

**Misurato il 2026-09-19**, prima del primo modulo. I sei moduli condividono
**otto** pezzi ancora dentro `index.html`. Quattro sono usciti nel pre-passo;
questi quattro no, e non è una dimenticanza:

| pezzo | chi lo usa | cosa lo trattiene |
|---|---|---|
| `itemText` | flashcard, speedMatch, repeatAloud, match | legge `currentEpisode` e `currentValues` |
| `recordPendingMastery` | flashcard, voice | scrive `pendingMastery` |
| `recordMultipleChoiceResult` | speedMatch, match | chiama `recordPendingMastery` |
| `buildMultipleChoiceOptions` | speedMatch, match | chiama `itemText` |

Portarli in `app/ui-condivisa.js` romperebbe l'unica cosa che quello strato
promette — *non sa quale modulo ha sopra e non tocca la sessione* — ed è la
stessa riga per cui `itemText` era già stata lasciata fuori il 2026-09-18,
mentre `fillTemplate` entrava: **una riceve episodio e valori come parametri,
l'altra va a prenderli.**

**Conseguenza da sapere prima di leggere il primo modulo:** ogni modulo che
esce li chiederà **all'insù** a `index.html`, e nel suo file la riga
`DIPENDE DA` lo dirà. *È un numero che sale con una ragione scritta, non un
difetto — ma se al terzo modulo la ragione è ancora la stessa, il passo dello
stato di sessione è in ritardo e si vede lì.*

**Quando si esegue:** *col passo dello stato di sessione*, che li libera tutti
e quattro insieme. Prima non si può, e spezzarli uno per uno costerebbe quattro
giri per lo stesso blocco.


### ⚠️ IL PANNELLO HELP APERTO TROPPO PRESTO RESTA VUOTO **PER SEMPRE** — e non è una regressione

**Segnalato da chi guida il progetto il 2026-09-19** (prima apertura di Help:
pannello aperto e tre card senza scritte; riaprendolo, a posto), e **misurato
guidando l'app**, non dedotto.

**Che cosa succede.** `uiText()` legge la cache delle istruzioni **senza
aspettarla** (`istruzioniInMemoria()`); se il `fetch` di
`istruzioni-moduli.json` non è ancora tornato, restituisce stringa vuota.
`openHelpMenu` scrive il markup **una volta sola**.

⚠️ **E il punto peggiore, che il sintomo non lascia indovinare: non si
ripara da solo.** Misurato ritardando il `fetch` di 2 s:

| | titolo | tre opzioni |
|---|---|---|
| subito dopo il click | `""` | `""`, `""`, `""` |
| **1,5 s dopo, a dati arrivati** | `""` | `""`, `""`, `""` |

Il pannello resta vuoto finché non lo si **chiude e riapre**. Non è una
finestra che si chiude: è un disegno che non si ripete.

⚠️ **NON È UNA REGRESSIONE DELLO SPACCHETTAMENTO, ed è la parte che andava
misurata prima di toccare qualcosa.** La stessa prova girata sull'app **di un
file solo** (commit `85c5024`, servita su una porta sua) dà **lo stesso identico
esito**: vuoto subito, vuoto dopo. Il difetto c'era già.

**Quello che NON ho misurato, e va detto:** se lo spacchettamento l'abbia reso
più **probabile**. È plausibile — quindici richieste in più competono con quel
`fetch` — ma è una probabilità, e misurarla vuol dire molte corse su una rete
realistica. *Scrivo che non l'ho misurato invece di dedurlo: una spiegazione
plausibile scritta come un fatto è la famiglia ⑰-quater.*

**La forma della correzione, quando si farà** (non decisa, solo delimitata): il
punto giusto NON è mettere un'attesa dentro `uiText` — la legge tutto, e
renderla asincrona cambierebbe ogni chiamante. È **chi apre una schermata**:
`openHelpFor` già potrebbe aspettare `loadModuleInstructions()` prima di
disegnare, come fa `openModuleFromMap` con `loadEpisodeData` dal 2026-09-10 —
*la correzione esiste già nel progetto, applicata a un altro caso.*

⚠️ **E LA CI L'HA PRESO DA SOLA, un'ora dopo questa riga.** La corsa su
`a79ae01` è andata **rossa** su `[D] uiText restituisce un testo VERO` di
`test_ui_condivisa_estratta.js` — verde in locale, rossa sul runner. È la
regola 19 alla lettera: *il container è più veloce del runner, e un rosso
della CI che non si riproduce qui non è un mistero: ha un nome.* Il rosso
**non era una regressione** dello spostamento del Blocco Ascolto: era questa
corsa, che c'era da sempre.

La **riga del test** è stata corretta nello stesso giro — aspetta
`loadModuleInstructions()`, cioè la CAUSA, non il valore che legge (regola
44), e falsificata rendendo `uiText` sempre vuota cade lo stesso. **Il
difetto dell'APP resta aperto**, ed è questo: qui si è tolta la corsa dal
test, non il difetto dall'app.

**Quando si esegue:** *quando si toccherà il pannello Help, oppure al primo
giro dedicato alle schermate che leggono `uiText` prima dei dati.* Non adesso:
è un difetto vecchio, non blocca niente, e infilarlo dentro il passo del Blocco
Ascolto darebbe due sospettati invece di uno.


### ⚠️ I QUATTRO `fetch` DEI FILE DI DATI NON PORTANO VERSIONE

**Aperto il 2026-09-19**, mettendo la versione sui quattordici tag.

Quella correzione rende impossibile il caso misto **fra i file di codice**. Non
lo rende impossibile fra **codice e dati**: `app/dati.js` ha quattro `fetch`
— `PERSONALIZATION_TABLES_FILE`, `MODULE_INSTRUCTIONS_FILE`, `module.dataFile`,
`FEEDBACK_MESSAGES_FILE` — e nessuno porta `?v=`. Un JSON vecchio servito a
codice nuovo resta possibile.

**Perché non è stato chiuso nello stesso passo, ed è una scelta e non una
dimenticanza:** i punti sono **quattro, non uno**. Farli passare da un punto
solo è un lavoro su `dati.js` — uno strato condiviso — e questo passo
esisteva per mettere in sicurezza la verifica su Pages **prima** di rifare i
sette pezzi, non per toccare un altro strato.

**E il rischio è di natura diversa, il che lo rende meno urgente:** un file di
dati vecchio si vede come **contenuto vecchio** — una frase, una traduzione,
un'etichetta — cioè come qualcosa di visibile e attribuibile. Il caso misto
fra i file di codice si vedeva come *comportamento inspiegabile*, ed è quello
che è costato due giri.

**Quando si esegue:** *al prossimo lavoro su `app/dati.js`*, oppure prima di
pubblicare una modifica ai file sotto `data/` che cambi qualcosa di strutturale
(una chiave nuova che il codice nuovo si aspetta). La forma è già decisa: un
punto solo che costruisce l'indirizzo, con la stessa versione dei tag — non
quattro `?v=` scritti a mano, che sarebbero quattro punti da tenere allineati.


### ⚠️ DUE DEI TRE TEST CHE GUIDANO IL POPUP DEI TENTATIVI **MUOIONO** INVECE DI FALLIRE

**Misurato il 2026-09-19**, togliendo di proposito i due listener del popup
(falsificazione del passo che l'ha spostato in `ui-condivisa`):

| File | Cosa fa senza i listener |
|---|---|
| `test_ui_condivisa_estratta.js` | **rosso pulito**: `[C]` dice «4» invece di «6» |
| `test_batch9.js` | **rosso pulito**: 20/21, cade «Match Practice reached Schermata Finale» |
| `test_batch7.js` | ⚠️ **si appende** — terminato a 400 s senza stampare niente |
| `test_outcome_step_ids.js` | ⚠️ **si appende** — idem |

È la famiglia ⓪-septies: **un test che MUORE non è un test che FALLISCE.** Il
ciclo aspetta che il popup si chiuda per andare avanti; se non si chiude, non
c'è nessuna asserzione rossa — c'è una suite che non finisce. In una corsa
normale questo si vede come «la suite è lenta» o come un timeout della CI, non
come un difetto del popup.

⚠️ **E correggeva una cosa che avevo detto io**: nella valutazione di questo
passo avevo scritto che «il popup la suite lo guida già, quei cicli si
fermerebbero». Vero a metà: **uno** dei tre si ferma dicendolo, **due** si
fermano e basta.

**Un secondo dettaglio trovato guardando lì:** `tests/quiz-driver.js:97` fa
`page.click('#attempt-popup-next').catch(function () {})` — un errore ingoiato
che non è censito in `tests/ERRORI-INGOIATI.md`.

**Quando si esegue:** *al prossimo giro sulle attese dei quiz*, oppure prima di
estrarre Match o Speed Match — sono i moduli i cui cicli si appendono. La forma
della correzione è già nota: un'attesa con un tetto che, scaduto, fallisce
dicendo cosa aspettava, invece di un `while` che gira per sempre.

**Quello che NON va fatto:** alzare i timeout. *Un test che si appende non
chiede più tempo: chiede un'asserzione.*


### ⚠️ DICIASSETTE FINTI SINTETIZZATORI SU QUARANTUNO NON SANNO DIRE SE STANNO PARLANDO

**Trovato il 2026-09-19** scrivendo `tests/test_comportamento_audio.js`, e
**misurato file per file**, non dedotto.

`fermaLaVoce()` cancella **solo** `if (staParlando())`, cioè solo se
`synth.speaking` è vero. Un finto sintetizzatore che quella proprietà non ce
l'ha risponde `undefined` per sempre: su di lui `cancel()` **non viene chiamato
mai**, e tutto ciò che dipende dall'interruzione dell'audio passa senza essere
provato — il secondo tocco che ferma il Blocco Ascolto, la **Regola Azione
Critica** (regola 16: toccare qualcos'altro ferma la voce), `stopAllModuleActivity`
che zittisce uscendo da un modulo. *Non è copertura mancante: è copertura che
**sembra** esserci*, cioè la forma della regola 37.

| Misura (`tests/*.js`, 2026-09-19) | Quanti |
|---|---|
| file che definiscono un finto sintetizzatore | **41** |
| …di cui con una proprietà `speaking` modellata (diventa vera in `speak`, falsa in `cancel`) | **24** |
| …di cui **senza** `speaking` | **17** |
| file con un finto microfono dallo `stop() {}` **vuoto** | **4** (`test_voicecoach.js`, `test_avviso_microfono.js`, `test_batch3.js`, `test_batch3b.js`) |

⚠️ **I diciassette non sono i file marginali: fra loro c'è `test_voicecoach.js`**,
cioè il test del modulo che il microfono ce l'ha. È il motivo per cui «il
microfono non si ferma al click» ha attraversato 1445 asserzioni: *il finto non
aveva modo di mostrarlo.*

I comandi, perché il numero si rimisuri invece di ricopiarsi:

```bash
grep -l "defineProperty(window, 'speechSynthesis'" tests/*.js | wc -l   # 41
grep -ln "speaking:\s*\|get speaking" tests/*.js | wc -l               # 24
grep -ln "stop() {}" tests/*.js                                        # 4 + il file nuovo
```

**Non corretti in questo giro, di proposito.** Rendere severi i finti condivisi
significa rimettere in discussione, tutte insieme, le asserzioni che oggi
girano sopra — ed è il tipo di lavoro che non sta nello stesso commit in cui si
scrive la rete che serve adesso.

**Quando si esegue:** *prima del prossimo spostamento che tocchi voce o
microfono oltre ciò che `test_comportamento_audio.js` già guida.* Per il
rifacimento dei sette pezzi condivisi la rete c'è e basta; per un passo più
largo no.

**Quello che NON va fatto:** sostituire i finti vecchi con quello nuovo «per
uniformare». Il finto nuovo è più severo, quindi qualche asserzione diventerà
rossa — e ognuna va guardata per decidere se è un difetto dell'app o
un'asserzione che descriveva il finto invece del comportamento. *Un cambio in
blocco produce un elenco di rossi che nessuno legge uno per uno.*

### ⚠️ Tre variabili di Voice Coach sopravvivono da un modulo all'altro

Trovate misurando il difetto qui sopra, e **non lo spiegano**: sono un difetto a
sé, ancora senza sintomo. Delle 31 variabili di stato del modulo,
`openVoiceCoach` ne reimposta 17 e `vcResetRecording` (con `clearVcTimeout`,
`stopVcTimer`, `setVcState`) ne copre altre. Restano fuori:

| | Cosa fa | Cosa può succedere |
|---|---|---|
| `vcCurrentEvaluated` | abilita «Avanti» | «Avanti» attivo all'apertura senza aver risposto |
| **`vcLastAvgPct`** | **il punteggio che finisce nel `moduleOutcome`, cioè IL VOTO CHE SI VEDE SULLA MAPPA** | **un modulo prende il voto del precedente** |
| `vcRecordStartedAt` | la durata della registrazione | secondi di audio attribuiti al modulo sbagliato |

*(`vcFeedbackDataCache` è una cache voluta, `vcRecognition` l'oggetto creato una
volta, `vcScorePercents` è scritta e letta nello stesso giro: non sono orfane.)*

⚠️ **`vcLastAvgPct` merita di essere nominata da sola: è un VOTO che
sopravvive.** Un giorno darà a un modulo un punteggio che non ha guadagnato — e
quel voto finisce sulla mappa, dove lo studente lo legge come un giudizio su di
sé. **Che oggi sia «senza sintomo» è precisamente il motivo per cui è
pericolosa**: è la stessa forma dei difetti silenziosi — funziona finché non
funziona, e quando si rompe si rompe altrove.

⚠️ **La ragione per cui pesa più dei tre casi**: la pulizia di questo modulo è
divisa in **due posti** — `openVoiceCoach` e `vcResetRecording` — e quello che
non sta in nessuno dei due sopravvive **senza che nessuno lo decida**. È la
stessa forma della famiglia qui sopra: la conoscenza «questa variabile va
azzerata» è un compito di memoria. **Le tre orfane si guardano insieme a questa
divisione, che è la causa** — correggerle una per una lascerebbe in piedi il
motivo per cui esistono.



| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | Al terzo livello dell'avviso microfono, **arrivandoci dalla strada di "Invia"**, non c'è nessun modo di tornare a registrare: il microfono è nascosto (stato `result`), "Esercitati ancora" è spento e "Avanti" è bloccato da `vcMicConfirmedProblem`. Il commento di `vcUpdateMicNotice` dice che il blocco si scioglie «finché il microfono non ricomincia a funzionare (il contatore si azzera)» — da lì quel ramo non può accadere. *(Dalla strada del silenzio invece si può: si resta nello stato di riposo, col microfono a schermo — vedi `correzioni.md`, 2026-09-07.)* | Non è un blocco senza uscita — "Torna alla mappa" c'è ed è verificata da `test_avviso_microfono.js` — ma è **una promessa che il codice fa e mantiene solo per metà**: chi legge quel commento crede che il recupero sul posto esista sempre. Delle due, o si lascia acceso "Esercitati ancora" al livello 3, o si precisa il commento. | **Da fissare** — è una decisione di comportamento: sceglierla richiede di dire cosa deve poter fare uno studente col microfono rotto. |
| 2026-09-08 | **Voice Check non scrive niente nella mastery**, ed è la verifica finale: `vcEvaluate` calcola `pairResults` (un esito per ogni parola) e le stelle **per entrambe le varianti**, ma la scrittura è dentro `if (vcVariant === 'practice')`. Il dato viene prodotto e buttato. | Non è una scelta: `git log -S` mostra che quella scrittura **è nata già dentro il ramo `practice`** nel commit dello sdoppiamento (`f297caf`, 27 agosto) — prima non scriveva nessuno. Il commento *«unchanged from before the split»* documenta che non è stato cambiato niente, non una ragione per non farlo. **E Voice Check darebbe il segnale più pulito che l'app produce**: una registrazione per frase, nessun ritentativo, quindi ogni voce scritta una volta sola e dopo lo studio invece che durante. | **Insieme alla riga «il dato si registra sul target»** qui sotto: è la stessa domanda — dove va il dato — vista dal modulo che oggi non lo manda da nessuna parte. |
| 2026-09-08 | **Una voce mai incontrata nasce `rosso` alla prima risposta, anche se la risposta è giusta** (`applyMasteryResult`: `if (!entry) return { level: 'rosso', streak: ... }`). Con `promotionStreak: 2` servono quindi **quattro** risposte giuste per arrivare a verde invece di due, e un profilo che ha fatto tutto bene mostra verde 0 su 145 voci. | **Non è una scelta scritta**: cercata in `CLAUDE.md` e in tutti i `docs/`, non esiste nessuna regola sul livello iniziale. Il commento nel codice descrive cosa fa (*«even a correct first hit still needs the streak rule to climb»*), non perché. E la regola che avevamo in mente diceva il contrario: una voce mai incontrata non ha colore — assenza di dato, non un giudizio. **È il difetto che spiega quasi tutti gli altri esiti del collaudo.** | **Da decidere**, ed è la prima delle decisioni sulla mastery: è la scelta da cui dipendono tutte le altre. |
| 2026-09-08 | **Il guardiano del silenzio di Voice Practice si disarma da solo.** `vcHeardAnySpeech` diventa vero al primo frammento provvisorio non vuoto — rumore di fondo, un colpo di tosse, una voce in un'altra stanza — e da lì il timeout di silenzio non scatta più per quella registrazione: qualunque cosa arrivi finisce su "Invia" e scrive sbagliato su ogni parola. | Il ramo che **scarta** la registrazione muta esiste e funziona, ma si raggiunge solo in silenzio perfetto. **In una stanza vera è il caso raro, non quello normale** — il contrario di come era stato descritto il 2026-09-07. | **Da decidere insieme al punto sopra**: è un caso di «rosso che non significa non sa», e la difesa giusta dipende da cosa si decide sui colori. |
| 2026-09-08 | **Le card senza skill non ricevono mai `is-ahead`** in Why We Say It: `lockedCards` si popola solo scorrendo le skill, quindi una card più avanti nella sequenza ma priva di regole resta non marcata — sbiadita in modo sbagliato **e** con il Blocco Ascolto attivo. | La guardia sul gestore è al posto giusto e funziona (un solo listener, controllo in cima): a sbagliare è **chi assegna la classe**, non chi la legge. Aggiungere una seconda guardia curerebbe il sintomo lasciando quelle card marcate come libere. | **Da fissare**, ed è piccolo: sta tutto in `seRefreshExplanationStates`. |
| 2026-09-08 | **`addSeExplanationStat` somma le risposte invece di sostituirle.** Il modulo permette apposta di cambiare idea, ma il contatore incrementa e non decrementa mai: una sola dichiarazione cambiata compare come `chiara 1 · non chiara 1`. | Quel dato è il KPI *«quale spiegazione è poco chiara»*: contando i ripensamenti **dice il falso**. Il punto di correzione è uno solo, e il dato che serve c'è già (`seSessionAnswers[skillId]` tiene la risposta precedente). **Ma è una decisione, non una svista**: oggi il file dice *quante volte è stato risposto*, il KPI vuole *cosa pensa adesso* — e il primo dato contiene una cosa che il secondo perde, cioè quante volte uno ha cambiato idea, che è a sua volta un segnale di chiarezza. | **Da decidere**: sostituire, oppure tenere entrambi (stato attuale + numero di ripensamenti). |
| 2026-09-08 | **Due nomi sbagliati nel Pannello Admin.** *(1)* Il titolo del terzo gruppo dice «Speak Easy», modulo che non esiste più da settimane: è **Why We Say It**. *(2)* Nell'utilizzo microfono la seconda riga mostra `voicePractice-2` invece del nome del modulo. | Il secondo **è lo stesso difetto corretto il 2026-09-05**, sopravvissuto in un punto che quella correzione non ha toccato: `renderAudioUsagePanel` cerca `CONFIG.moduleLabels[id]` con l'**id del passo** invece che con `.moduleId`, e dalla seconda apparizione in poi la chiave non esiste. Quella correzione ne sistemò sette letture; questa era l'ottava. | **Da fissare**, entrambi piccoli. Il secondo merita una ricerca su TUTTE le letture indicizzate per id del passo, invece di correggere l'ottava e aspettare la nona. |

## Contenuto

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | Il markdown scrive i segnaposto in **notazione leggibile** (`{papà}`, `{figlia}`, `{etàFiglia}`) e il JSON usa le **chiavi vere** (`papa`, `figliaNome`, `figliaEta`). | È una traduzione mentale a ogni lettura, e prima o poi qualcuno la sbaglia. Non si allinea adesso perché cambiare le chiavi del JSON è una **migrazione**: sono la struttura dei valori salvati in `baseinglese:<episodio>:custom:<utente>`. | **Insieme alla rinomina degli slot a id**, che tocca comunque quelle chiavi. Un lavoro solo. |
| 2026-09-07 | La chiave tecnica del personaggio è `speaker: "guide"` in ogni battuta, ma il personaggio è l'**Hostess al gate** (l'etichetta mostrata è stata allineata, la chiave no). | Regola 18: un nome che non dice più cosa nomina. Innocuo finché il cast è uno, fuorviante quando un episodio avrà davvero una guida *e* una hostess. | **Quando un episodio avrà un secondo personaggio esterno**, o insieme alla prossima riscrittura delle battute: allinearla adesso significherebbe toccare nove battute per una parola che nessuno vede. |
| 2026-09-07 | `docs/inglese/it/inglese-it-gate.md`, nota 3, dice *«i numeri si scrivono in lettere perché è la parola che Voice Practice ascolta»*. **Oggi l'app non lo fa**: `slotOptions` normalizza un numero rendendo `it` ed `en` identici, quindi la battuta d7 in inglese dice «I'm 16 years old» con la cifra. | Stessa famiglia della riga sul fallback: **un'istruzione che descrive uno stato che non esiste.** Chi la legge crede che sia già così e non cerca il difetto. | **Quando si farà il magazzino** (punto ③ di «Cosa manca» in `docs/inglese/it/tabelle-personalizzazione.md`), che è ciò che la rende vera. |
| 2026-09-08 | **Le destinazioni sono due tabelle diverse, e quella che l'app usa è la vecchia.** `APP_CONFIG.places.destinations` ne ha **sei** (Cina, Giappone, Spagna, Francia, Germania, Irlanda); `docs/inglese/it/tabelle-personalizzazione.md` ne ha **undici**, e Spagna, Francia e Germania sono **uscite** — al loro posto India, Australia, Grecia, Norvegia, Croazia, Turchia, Scozia, Thailandia. Il magazzino è la fonte; `APP_CONFIG` è l'esecuzione, ed è indietro. | Chi legge `APP_CONFIG` per sapere quali destinazioni esistono prende la lista sbagliata, e non ha nessun modo di accorgersene: la tabella vecchia è perfettamente valida, solo superata. È la stessa forma della riga sul fallback e del nome tolto sopravvissuto in cinque file — un dato che descrive uno stato che non è più quello. | **Quando si farà il magazzino**, che è bloccato dal secondo campo per riga dei luoghi di partenza (città e paese sono una riga sola, mai due slot). Non prima: aggiornare solo le destinazioni lascerebbe le due tabelle disallineate in un altro punto. |
| 2026-09-08 | **Perché Spagna e Germania sono uscite dalle destinazioni non è scritto da nessuna parte.** Il motivo dato per le tre uscite è che sono paesi di origine — ma le origini dichiarate nel magazzino sono **Italia, Svizzera e Francia**: la ragione spiega la Francia, non le altre due. E i due criteri scritti nel magazzino (in italiano vogliono «in», in inglese non vogliono l'articolo) le ammetterebbero entrambe: *in Spagna / to Spain*, *in Germania / to Germany*. Cercate in tutto il file: non compaiono in nessuna sezione, nemmeno fra quelle tenute in magazzino per un episodio futuro. | Non è un errore — è una decisione presa e non registrata, esattamente la classe che ci è costata il rosso iniziale della mastery e le regole 4 e 26 rimaste a nominare un valore che non esisteva più. Chi rifarà quella tabella fra sei mesi vedrà due criteri che ammettono Spagna e Germania, non le troverà nella lista, e non saprà se è una scelta o una dimenticanza. | **Prima di fare il magazzino**: basta una riga nel file che dica il vero motivo. Se il motivo è «troppi paesi di lingua nota, si preferiscono mete meno ovvie», va scritto — è una ragione buona che oggi non c'è. |

## La mastery: dove va il dato, e cosa lo legge

*Nate il 2026-09-08, quando il pannello dei colori ha reso visibile una cosa che
prima non si vedeva da nessuna parte: i tre scrittori della mastery si comportano
diversamente, e nessuno l'ha mai deciso.*

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-08 | **La D3 di `validazione.md` va eseguita**: il colore **sale** solo su risposte verificate, **scende** su qualsiasi segnale, autovalutazione compresa. Non è una decisione nuova — è una decisione presa e sospesa che arriva al suo momento. | D3 era rimandata con una condizione esplicita: *«oggi la mastery non è riletta da nessuno, quindi non fa danno, e correggerla prima del meccanismo che leggerà quei colori significherebbe farlo nascere già inquinato»*. **Il report rimuove quella premessa.** Da oggi la mastery è riletta: la condizione che sospendeva l'esecuzione non c'è più. | **Insieme al report vero** (la riga qui sotto sui gradi), non prima: il pannello di oggi è uno strumento per guardare, e serve appunto a guardare cosa producono oggi le regole vecchie. |
| 2026-09-08 | **Il dato si registra sul target, conservando il dettaglio delle parole.** Oggi Voice Practice su una battuta di otto parole scrive otto voci sciolte; deve scrivere sulla battuta, con dentro le parole che la compongono. **Il criterio: dove ci sono le stelle, quello è il dato da registrare** — le stelle sono già la media delle parole, il dato c'è ed è salvato al livello sbagliato. | La media da sola non basta: se *«nice to meet you»* è giallo perché *«nice»* è rosso, lo studente deve poterlo vedere. **La media dice quanto vale il target, le parole dicono DOVE si rompe.** La regola dei colori non cambia — ogni parola sale e scende come sempre — cambia dove il dato viene indirizzato.<br><br>**Ne discende una cosa che NON è un errore:** la stessa parola avrà due colori diversi. *«nice»* nel grado A è quanto sai la parola da sola; *«nice»* dentro *«nice to meet you»* è quanto la dici bene in quella sequenza. Sono due abilità: una parola facile da sola può essere difficile in mezzo a un'espressione, dove cambiano accento e ritmo. È la stessa logica per cui la mastery è già separata per esercizio e direzione, con **una dimensione in più: da sola o dentro qualcosa**. | **La condizione registrata qui era sbagliata, corretta il 2026-09-08 dopo il collaudo.** Diceva che Voice Practice «indicizza per posizione nella battuta (`voicepractice:d-1:0`) e non conosce l'id della voce». Non è così: la chiave è `voicepractice:<id della voce>:<indice parola>` — `b-and-you:0` — e **l'id della voce c'è già**. Voice Practice non gira nemmeno sul grado D, ma su B e C.<br><br>**Il lavoro si divide quindi in due metà indipendenti.** *(a)* **Registrare sul target: nessun prerequisito.** `line.id`, `pct` e `stars` sono tutti in scope nel punto esatto in cui oggi si scrive per parola — manca solo la riga per la voce intera. *(b)* **Collegare la parola al vocabolario** (sapere che `b-nice-to-meet-you:0` *è* `a-nice`): questa sì richiede la dichiarazione parola→voce. Ma **(b) non serve al comportamento voluto**: che «nice» abbia due colori diversi, da solo e dentro l'espressione, funziona già oggi perché sono due chiavi diverse. (b) serve solo a metterli in *relazione* nel report. **(a) si può fare subito, (b) no, e (b) non blocca (a).** |
| 2026-09-08 | **Il report vero è diviso per grado**: le parole in A, le espressioni in B, le frasi in C, le battute in D — la struttura della matrice riportata nel report. Più le divisioni per grammatica, vocaboli e il resto. | Il pannello di oggi è un elenco piatto ordinato per chiave: serve a **guardare**, e per quello va bene. Non serve a capire dove uno studente è indietro, che è la domanda del report vero. | **Dopo il pannello**, e insieme all'esecuzione della D3 qui sopra: sono lo stesso lavoro visto da due lati. |
| 2026-09-10 · **fusa con una riga del 2026-09-05 l'11 settembre** | **Il badge di Voice Check segna 0% su una registrazione MUTA**, e non è un arrotondamento: 0% vuol dire *«hai sbagliato tutto»*, mentre la verità è *«non ti abbiamo sentito»*. `vcFirstAttemptPercents.push(pct)` è gated solo su `attemptNum === 1`, senza nessuna guardia sul riconoscimento vuoto: `correctCount` resta 0, quindi `pct` è 0 e finisce nella media da cui esce il colore della mappa.<br><br>**E il punto del codice è uno solo, quindi qui c'è tutto quello che lo riguarda:** dentro `vcEvaluate` ci sono **due regole diverse sulla stessa variante**, a una cinquantina di righe di distanza. Il **badge** (~8498) scrive con `practice` **oppure**, se è Voice Check, **solo il primo tentativo**; i **colori** (~8549) scrivono con `practice` **oppure il primo**, cioè in entrambi i casi — e **solo i colori** hanno `recognizedWords.length > 0`. | **Il badge non tace: mente.** È diverso da un dato mancante — un dato mancante si vede e si può cercare, un dato falso viene creduto. E il modulo che sbaglia così è quello *senza aiuti*, cioè quello di cui ci fideremo di più. Venuto a galla facendo la ② (2026-09-10): i colori hanno la guardia *«se non abbiamo sentito niente, non c'è niente da giudicare»*, le stelle no — **le due metà dello stesso modulo dicono cose diverse sullo stesso silenzio**.<br><br>⚠️ **Perché una riga del 2026-09-05 è finita qui dentro.** Diceva: *«i due blocchi `if (vcVariant === 'practice')` adiacenti in `vcEvaluate`, unibili in uno — pura leggibilità»*, con la condizione «alla prossima modifica di `vcEvaluate`». **La condizione è scattata il 2026-09-10 con la ②, e quella modifica ha cambiato il debito stesso**: i due blocchi non sono più né uguali né adiacenti, e **unirli oggi nasconderebbe proprio la distinzione che la ② è servita a stabilire**. *Una riga che descrive un codice che non esiste più è peggio di una riga assente: si legge bene, e manda a cercare una cosa che non c'è.* Tenerne due sullo stesso punto sarebbe stato un doppione, e un doppione si disallinea: **in `vcEvaluate` si guarda qui, e basta.** | **Fuori dalla ②**, e la correzione probabile è **simmetrica**: se `recognizedWords` è vuoto, `vcFirstAttemptPercents` non riceve niente — la stessa guardia che c'è nei colori. ⚠️ Va deciso cosa succede a una battuta il cui unico tentativo è muto: oggi vale 0%, con la correzione non varrebbe niente, e la media si farebbe sulle battute sentite. **E chi apre `vcEvaluate` per questo si porti dietro l'altra metà**: le due regole restano due — non si unificano — ma vanno lette insieme, perché è dalla loro differenza che nasce il difetto. |
| 2026-09-10 | **`LastAttemptRule` vale per il badge, NON per i colori delle voci.** In Voice Practice il badge legge `vcLastAttemptPercentByLine`, che tiene solo l'ultimo tentativo; la mastery invece passa dalla scala **a ogni tentativo**, quindi tre tentativi sono tre passaggi. Non è sbagliato — la scala è fatta per accumulare, e allenarsi è accumulare — ma **il nome dice una cosa che lì non succede**. | È la famiglia dei **nomi che mentono**, con `sr` che non sta più per niente e `matching` che non dice cosa fa. Un nome che descrive metà del comportamento è peggio di un nome opaco: chi lo legge smette di guardare. | **Quando si toccheranno i nomi**, e quel gruppo si guarda **insieme** — non uno per volta: la domanda «questo nome dice cosa fa?» ha una risposta sola per tutti e tre, e affrontarli separati la fa rispondere tre volte in tre modi. |
| 2026-09-08 | **Quando si costruisce un modulo nuovo, si chiede prima di completare quello che non è stato detto.** Se una parte del comportamento non è specificata — cosa scrive nella mastery, quando, cosa succede al giro di ripasso — non si inventa: si chiede. | È il momento in cui uno sbaglio non resta locale ma **si accumula**. Oggi tre scrittori della mastery si comportano diversamente perché nessuno ha mai chiesto *«e le parole?»* quando i moduli sono stati costruiti — e la prova che non è stata una scelta è che Voice Check, la verifica finale, calcola il dato per parola e lo butta, con un commento che dice solo *«unchanged from before the split»*. | **Va in `CLAUDE.md`**, come regola. **Non adesso**: quando ci arriveremo. |
| 2026-09-08 | **I colori scritti a metà modulo restano scritti subito, ma vanno PARCHEGGIATI: contano solo se il modulo viene completato.** Non si spostano alla fine. | Scrivere subito protegge chi chiude il browser: il lavoro fatto non si perde. Ma un modulo abbandonato a metà lascia oggi colori che pesano quanto quelli di un modulo finito, e non è la stessa cosa — chi esce dopo due risposte non ha fatto l'esercizio. Le due esigenze non sono in conflitto: si scrive subito **e** si tiene da parte, invece di scegliere fra perdere il dato e contarlo per buono. | **Da fissare.** Quando ci arriveremo, la domanda da farmi è come: dove vive il parcheggio, e cosa lo promuove. |

## CI rosse che non dicono cosa fare

*Stessa famiglia: la CI diventa rossa e chi la legge non sa se è rotta l'app o il
test. Vanno guardate in un giro solo — **dopo il collaudo**, sono mezza giornata.*

### ⚠️ IL RUNNER DELLA CI È PIÙ LENTO DEL CONTAINER, E LA DIFFERENZA È STABILE

**Misurato il 2026-09-10, e va saputo prima della fase 4.** La corsa #95
(`test_mastery_al_gesto.js`, un'asserzione su 25) è stata **rossa due volte su
due in CI e verde sei volte su sei in locale, sullo stesso commit.**

**Non è un'intermittenza: è una differenza stabile fra le due macchine.** Una
corsa che si perde là e si vince qui **non si riproduce in locale, per quante
volte la si rilanci** — rilanciarla dieci volte darebbe dieci verdi e la
conclusione sbagliata («allora era un flake»).

Quindi, operativamente, e serve durante lo spacchettamento dove ogni rosso deve
avere un sospettato solo:

- **Un rosso della CI che non si riproduce in locale NON è un mistero e non è un
  flake: ha un nome.** Si cerca un'asserzione che legge uno stato prodotto in
  modo asincrono — un fetch, un `setTimeout`, un'animazione — senza aspettarlo.
- **La suite locale non può escludere questa famiglia**, ed è il suo limite
  strutturale: il verde locale dice «non ci sono regressioni», non «non ci sono
  corse». Le corse le trova solo una macchina più lenta.
- Il gemello di questa riga sta in `tests/attese.js`, che è la forma con cui si
  correggono.

*E il resto dello strumento ha funzionato: il contatore ha detto 998 esatte
(quindi non era un file che non partiva), la CI ha detto quale file, e il passo
«Output completo dei file falliti» ha detto quale riga. **Ha fallito una riga,
non la suite.***

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | Quattro valori **ricopiati invece che letti dalla fonte**: `test_batch12.js:199` (i cinque colori d'accento come esadecimali), `test_new_features.js:148-149` e `test_batch3b.js:248` (le frequenze `1568`/`1976`, che stanno in `CONFIG` righe 160-161), `test_new_features.js:276` (il default `10` di `timeLimitSeconds`, `CONFIG` riga 248). In tutti la pagina è già caricata: leggerli dalla fonte costa **meno** righe che ricopiarli. | Un valore scritto in un secondo posto invecchia, e in un test rompe la CI senza che niente sia rotto. **I colori sono il caso peggiore**: non è solo un valore ricopiato, è la **regola 2 disattesa** — «nessun colore fisso, sempre le variabili del tema» — in un posto dove nessuno guardava. E in un componente un colore sbagliato si vede a schermo; in un test si vede solo come una CI rossa senza motivo. | **Dopo il collaudo, insieme a `test_batch19`**: sono la stessa famiglia. |

> ⚠️ **Prima di prendere questo lavoro, la distinzione che lo rende sicuro:**
> **se il valore esiste altrove nel progetto, ricopiarlo è una copia; se il numero
> è il requisito, è un'asserzione.** `freq === 1568` è una copia — la fonte è
> `CONFIG`. `readyTones.length === 3` («il 3-2-1 suona tre volte») è un requisito,
> e **deve restare**: se domani il countdown suonasse cinque volte, il test deve
> dirlo. Stessa cosa per `moduleCompleteMessages.alto.length === 5`.
>
> Senza questa riga chi prende il lavoro toglie anche i `length === 3`, e quelli
> sono la parte che protegge.

## Dati che l'app produce e nessuno può leggere

> **Nessun dato di uso è aggregabile finché non esiste un raccoglitore.**
> Il `localStorage` sa cosa ha fatto **un** utente su **un** dispositivo; tutti i
> KPI che abbiamo scritto chiedono *«quanti studenti»* — e quella domanda oggi
> non ha risposta.
>
> Vale per ognuno: dove si ferma la gente, i ripassi nel quiz, le aperture
> dell'Help, i secondi di audio, le spiegazioni dichiarate poco chiare. Il
> meccanismo che li produce c'è già, spesso per intero: **manca solo dove
> mandarli.** Ogni giorno che passa è un giorno di dati che si accumulano su
> dispositivi diversi e non li somma nessuno.
>
> **Quando:** con Supabase, o qualunque altra cosa faccia da raccoglitore.
>
> **La conseguenza sposta una priorità:** Supabase non serve solo agli account e
> ai pagamenti. **Serve a sapere se il metodo funziona.** Finché non c'è, ogni
> giudizio sul contenuto resta un'impressione — e i moduli di autovalutazione
> producono, senza saperlo, l'unica prova che potrebbe smentirla.

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | **Le risposte di Why We Say It si salvano davvero**, per singola skill: `addSeExplanationStat` scrive `baseinglese:seExplanationStats:<episodio>:<utente>` a ogni risposta, con `{ chiara, nonAncora, nonChiara }` per ogni `skillId`. **Ma la chiave contiene l'utente e vive nel `localStorage` del suo browser**: il dato non esce mai dal dispositivo. «Una spiegazione poco chiara a *molti* studenti» **non è calcolabile**, perché non esiste nessun modo di raccogliere quei conteggi. Oggi si vede solo nel Pannello Admin, e solo del profilo aperto. | È un giudizio sul **nostro** contenuto, non sullo studente — il dato più prezioso che quei moduli producono — e oggi si perde a ogni dispositivo. Il meccanismo di raccolta c'è già, per metà: manca solo dove mandarlo. | **Con Supabase**, o con qualunque altra cosa dia un posto dove i conteggi di più studenti si sommano. Non prima: senza un raccoglitore non c'è niente da costruire. |
| 2026-09-07 | **I tre Dialogue non registrano niente per battuta.** L'autovalutazione è una domanda sola a fine modulo (`dg-not-yet-btn` → `dgFinishModule('giallo')`): resta un livello di modulo, e quale battuta sia stata difficile non lo sa nessuno. **Flash Card** invece salva per voce, ma in `mastery` — un giudizio sullo studente, non sul contenuto: dice «questo studente non sa `a-hello`», non «`a-hello` è spiegata male». | Il dato per battuta dei Dialogue non esiste: non è che si perde, non viene proprio prodotto. Se serve, va aggiunta la domanda per battuta, che è una modifica al modulo — non una raccolta. | **Da valutare (regola 34)**, non da eseguire. Prima serve sapere se una domanda per battuta appesantisce il modulo più di quanto il dato valga. |

## Deroghe dichiarate senza niente che le faccia scadere

*Nate il 2026-09-08 da una domanda: «ce ne sono altre di deroghe dichiarate
senza qualcosa che le faccia scadere?». Sì, nove — sette trovate, due scritte
lo stesso giorno.*

> **Il principio, ed è il motivo per cui questa sezione esiste:**
> **Ogni deroga dichiarata dovrebbe avere qualcosa che la fa scadere. Senza,
> resta vera per sempre anche quando ha smesso di esserlo — e copre in silenzio
> il caso che un giorno diventa un difetto vero.**

Un `LIMITE DICHIARATO` in testa a un test (regola 32) è una cosa buona: dice a
chi si fida del verde fin dove il verde arriva. Ma è **una frase**, e una frase
non scade. Il giorno in cui il limite smette di essere una scelta ragionevole e
diventa un buco, il commento è ancora lì, scritto con la stessa sicurezza — e
chi lo legge lo prende per una decisione ancora valida invece che per una
decisione vecchia.

**Quindi non si tolgono i limiti: si dà loro una condizione**, e la condizione
vive qui, dove le righe si svuotano. Il limite resta scritto nel test, che è il
posto dove lo si legge al momento giusto; la sua scadenza sta qui, che è il
posto dove si guarda cosa è rimasto indietro.

**Uno dei nove non scade, ed è dichiarato tale.** Non è un'eccezione al
principio: è il principio applicato fino in fondo — o si sa cosa la farebbe
scadere, o si sa che niente la farà, e si scrive quale dei due.

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-08 | `test_config_letta.js`: una foglia di `APP_CONFIG` con un **nome generico** (`name`, `label`, `value`) è impossibile da falsificare — quel nome compare ovunque a prescindere, quindi il test la dichiara «letta» anche quando è morta. | Il test è forte sui nomi propri, che sono quelli dei parametri costruiti per uno scopo, cioè quelli che smettono di essere letti. Ma il limite è scritto come se il caso non si presentasse mai, e non c'è niente che lo controlli. | **Al primo parametro nuovo con un nome generico.** Chi lo aggiunge deve sapere in quel momento che questo test non lo protegge: o gli dà un nome proprio, o accetta il buco sapendolo. |
| 2026-09-08 | `test_episodio2.js`: **il testo non è confrontato** con `docs/inglese/it/inglese-it-aircraft-door.md`, solo i numeri e la coerenza degli id. Il limite aveva una scadenza scritta — «quando l'episodio 2 entrerà in `EPISODES`» — **e quel giorno è arrivato** (2026-09-08). | Estendere il confronto testuale vuol dire un secondo lettore di markdown: la fonte dell'episodio 2 ha una forma diversa da quella dell'episodio 1 (il grado A è una lista in prosa, il vocabolario in una sezione a parte). Due parser per due file che cambiano insieme una volta ogni tanto sono più fragili di quanto proteggano — la scadenza era arrivata, la ragione per non pagarla no. | **Al terzo episodio**, quando il secondo lettore servirà per due file e non per uno: allora è un investimento, oggi è manutenzione pura. |
| 2026-09-10 | `test_attendi.js`: i **valori di DEFAULT** delle due soglie (tetto 5400 s, silenzio 600 s) non sono provati. Il test pilota le soglie con `ATTENDI_SILENZIO` e il 4° argomento, quindi copre i *rami* — 0, 1, 2, 3, 64 — ma non i numeri. *(Sostituisce la riga del 2026-09-08 sul terzo caso scoperto: **quella condizione è scattata** — «alla prima modifica che tocchi il timeout» — e il caso ora è coperto, con la prova contraria accanto. Vedi `correzioni.md`, 2026-09-10.)* | Provare i default costerebbe al test l'attesa che deve misurare: novanta minuti per un ramo che non si usa mai. E oggi il rischio è piccolo perché `attendi.sh` **la lancia una persona che ne legge l'output**: un default sbagliato si vede subito, nella frase. | **Quando `attendi.sh` finirà dentro uno script** — la CI, `run_full_regression.sh`, un lancio automatico qualunque. Da lì nessuno legge più l'output al momento, e il default diventa l'unica cosa che decide. |
| 2026-09-08 | `test_sblocco_sequenziale.js`: guarda il passo **bloccato**. Che il passo corrente funzioni è verificato solo quanto basta a non far passare il file su un'app in cui non funziona niente. | Il comportamento pieno dei due moduli sta in `test_story_modules.js` e `test_dialogo_extra.js`: **il limite è sicuro solo finché quei due lo coprono davvero.** È una dipendenza fra file che nessuno dei tre dichiara. | **Se uno dei due file citati smette di coprire il passo corrente** — o quando lo Sblocco Sequenziale prenderà una terza variante (regola 30), che nessuno dei tre file conosce. |
| 2026-09-08 | `test_episodi_corti.js`: si verifica che il passo **non si completi** e che lo studente veda qualcosa, non il **testo** dell'errore. | Stessa forma della riga qui sopra, stessa dipendenza taciuta: il testo è coperto da `test_errore_caricamento.js`. Se quel file cambia scopo, questo limite diventa un buco senza che niente lo dica. | **Se `test_errore_caricamento.js` smette di proteggere la schermata d'errore in sé.** |
| 2026-09-08 | `test_report_mastery.js`: il pannello **non mostra quante volte** una voce è stata scritta, e il test non lo verifica — perché quel dato non esiste (una voce è `{ level, streak }`). | Oggi è una constatazione, non una scelta: non si può verificare un dato che nessuno produce. Ma è scritto come un limite permanente, e non lo è. | **Quando una voce di mastery avrà un contatore** — cioè insieme alla riga «il dato si registra sul target» qui sopra. Da quel momento il limite è un buco, non una constatazione. |
| 2026-09-08 | `tests/ATTESE-FISSE.md`: le **asserzioni negative** (verificare che *non* sia successo niente) sono esentate dalla regola 19 e dalla conversione ad attesa di stato. | Per un evento che non deve accadere non esiste una condizione da aspettare: il modo di fallire è un verde generoso, non un rosso casuale. | **Questa non scade, ed è il caso raro in cui è giusto così.** Scadrebbe solo se l'app arrivasse ad avere un segnale di quiete — «ho finito tutto quello che avevo in coda» — su cui un'attesa negativa possa agganciarsi. Non è previsto e non è desiderato. Si rilegge comunque a ogni blocco di attese fisse convertito, per non allargarla per comodità. |
| 2026-09-08 | `test_interruttore_episodio.js`: si guarda **un modulo solo** (Meet the Story) per verificare che l'episodio scelto serva il proprio contenuto. | Quello che lega ogni modulo al file dati è il descrittore dell'episodio, una riga per modulo: un `dataFile` sbagliato su uno degli altri ventuno passa. Guardarli tutti e ventidue vorrebbe dire attraversare l'episodio intero a ogni giro di suite. | **Quando i descrittori smetteranno di ripetere lo stesso `dataFile` riga per riga** — se il file dell'episodio si dichiara una volta sola, il caso sparisce invece di essere coperto. |
| 2026-09-08 | `test_match_practice_nonloso.js`: si guarda **una direzione sola** (en→it). | Le due direzioni sono lo stesso componente e lo stesso `qmRenderQuestion`, quindi un difetto di quella riga le romperebbe entrambe. Una differenza che vivesse solo in it→en qui non si vedrebbe. | **Se le due direzioni smetteranno di condividere `qmRenderQuestion`** — cioè alla prima riga di codice che si comporta diversamente a seconda della direzione. |

| 2026-09-09 | **Nel Pannello Admin ci sono ora due gruppi adiacenti, `match` e `matching`, che sono cose diverse.** `match` sono le manopole di Match Practice (la pausa dopo una risposta corretta); `matching` è la soglia di somiglianza fra una parola detta a voce e il suo bersaglio. Nati vicini con la rinomina 3, che ha portato `CONFIG.quickMatch` a `CONFIG.match`. | Non è un difetto oggi — le descrizioni li distinguono — ma è il tipo di cosa che confonde fra sei mesi, e allora nessuno ricorderà che erano due cose diverse dall'inizio. **E `matching` è il nome peggiore dei due**: non dice cosa fa. È la soglia di somiglianza vocale, e «matching» lo tace. | **Si guarda quando si tocca il Pannello Admin per un'altra ragione, non con un giro apposta.** Se allora la confusione sarà reale, è `matching` a prendere un nome che dice cosa fa — non `match`, che è quello giusto. |

| 2026-09-09 | **Tre nomi ridondanti nati dalla rinomina 5:** `storyCardsCardIndex`, `storyCardsCurrentCardId`, `storyCardsCurrentCardIndex` — «Cards Card» due volte. Erano `seCardIndex`, `seCurrentCardId`, `seCurrentCardIndex`. | La sostituzione è stata **meccanica di proposito**: aggiustarli dentro la rinomina avrebbe fatto entrare scelte editoriali in un lavoro da 420 punti, e avrebbe sporcato la verifica per sottrazione — che funziona solo se ogni occorrenza del nome vecchio diventa la stessa cosa. | **Quando la rinomina 5 è chiusa e verde.** Sono tre nomi e un minuto: `storyCardsIndex`, `storyCardsCurrentId`, `storyCardsCurrentIndex`. |

| 2026-09-09 | **`id="help-form-back"` è duplicato in `index.html`** (righe 5395 e 5403): due rami dello stesso template lo portano entrambi. **Preesistente**, verificato su `origin/main` prima delle rinomine — trovato dal controllo sugli id collassati del passo 5, che cercava tutt'altro. | Un id duplicato è HTML non valido, e `getElementById` restituisce sempre il primo: se un giorno il ramo che vince non fosse quello disegnato, il pulsante «← Indietro» smetterebbe di funzionare in un solo punto e non si capirebbe perché. Oggi non succede perché i due rami non sono mai a schermo insieme. | **Quando si tocca la vista dell'Help per un'altra ragione.** Non è del passo 6 e non merita un giro apposta. |

## Pulizie rimandate di proposito

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-10 | **Due commit ravvicinati fanno fallire «pages build and deployment».** Successo il 2026-09-10 due volte di fila (corse #168 e #169): fra un push e l'altro passavano diciotto minuti, e la seconda pubblicazione ha trovato la prima ancora in corso. ⚠️ **Non è un difetto nostro e non sta nel codice** — nessuno dei due commit toccava `index.html`. **Si sistema da sola al push successivo**, e infatti la #170 è verde. | Serve scritta qui per una ragione sola: **perché la prossima volta nessuno la cerchi nel codice.** Una corsa rossa accanto a una verde, sullo stesso commit, è esattamente la cosa che fa perdere mezz'ora a chi non sa che le due non c'entrano niente fra loro. | **Niente da fare**, se non riconoscerla. Se un giorno diventasse frequente, la strada è fare meno push ravvicinati su `main` — cioè la stessa disciplina del ramo di verifica. |
| 2026-09-10 | **`actions/checkout@v4` e `actions/setup-node@v4` vanno alzate a `@v5`.** GitHub le sta forzando su Node 24 perché Node 20 è deprecato sui runner, e ogni corsa stampa il warning. ⚠️ **NON è la causa di nessun rosso**: quelle azioni girano *prima* dei test, e `npm test` gira sul Node 22 che `setup-node` installa — la stessa versione del container (v22.22.2). Verificato il 2026-09-10 mentre si cercava altro. | **Una riga di manutenzione, non un'emergenza.** Il warning oggi è un preavviso: quando GitHub toglierà del tutto il supporto, quelle azioni smetteranno di partire e la CI diventerà rossa per un motivo che non c'entra niente con l'app — e succederà senza preavviso ulteriore, perché il preavviso è questo. | **Quando si tocca il workflow per un'altra ragione**, o al primo segnale che la scadenza si avvicina. Non con un giro apposta. |
| 2026-09-05 | La divergenza **off/seen** in `tests/module-order.js`: il file riscrive a mano la regola di `moduleStepId()` e conta le apparizioni in modo diverso dall'app. | Correggerla adesso significa mantenere due copie della stessa regola. | **Non si corregge: sparisce da sola** quando l'identità del passo sarà `modulo + grado`, perché non ci sarà più niente da contare. |
| 2026-09-06 | I testi dell'avviso microfono (`vcUpdateMicNotice`, titolo e corpo dei tre livelli) sono scritti nel codice invece che in `data/{lingua}/istruzioni-moduli.json`, insieme ad altre ~25 frasi già note nella stessa condizione. | Regola 8: se è testo che lo studente legge e non è contenuto dell'episodio, sta nel JSON. Sparsi nel codice non si possono correggere senza toccare `index.html`, e in una seconda edizione non si possono tradurre affatto. | **È un lavoro solo**, non venticinque: si fa quando ci arriveremo, tutto insieme. Spostarne una alla volta lascia il problema e raddoppia i posti dove cercare. |
| 2026-09-09 | **La terza dipendenza da `index.html` letto come testo**, aggiunta di proposito da `test_blocco_ascolto.js`: conta le occorrenze del markup del pulsante per impedire all'ottava copia di nascere. | È una scelta, non una distrazione, ed è dichiarata anche in cima al test. Un test che aprisse i sei moduli e li confrontasse proverebbe **meno**: direbbe che i sei di oggi si assomigliano, non che domani non se ne aggiunge un settimo a mano. Il prezzo è che se il markup del pulsante cambia, quella riga va aggiornata — **ed è voluto: è esattamente il momento in cui qualcuno deve accorgersi che sta toccando un pezzo condiviso.** | **Si guarda tutta insieme** quando le tre dipendenze diventeranno un problema, non una per volta. |
| 2026-09-09 | La vista **`view-pronunciation`** (`FEATURE: PRONUNCIATION EXERCISE`) è codice morto: `startPronunciationExercise()` non è chiamata da nessuna parte e il CSS la dichiara irraggiungibile. Contiene un **ottavo Blocco Ascolto** e uno **scrittore di mastery** (`submitAttempt`).<br><br>⚠️ **MISURATA il 2026-09-15, al triage del passo 16, ed è uscita dal passo 16:** non è un blocco morto da asportare: è **INTRECCIATA** con codice vivo. `tokenize`, `classify`, `alignWords`, `pickVoice`, `toggleSpeak`, `lockModuleHeader` e `synth` sono **definiti dentro di lei e usati da Voice Coach**. Toglierla a colpo d'occhio non è una pulizia: è un taglio a mano libera attraverso funzioni che servono a un modulo vivo. | Trovata cercando gli scrittori della mastery: per un giro è stata scambiata per Voice Check. Non fa danno — nessuno può raggiungerla — ma falsa ogni conteggio di «quanti punti scrivono la mastery» e di «quanti Blocchi Ascolto esistono», che sono due domande che ci siamo già fatti. | **È un PASSO SUO, dopo il 25** — non una voce di pulizia e non «nello spacchettamento» genericamente. ⚠️ **E il dopo-25 non è un rinvio, è la condizione che rende il lavoro diverso:** quando `tokenize` e `classify` staranno **in un file loro**, il taglio diventa **visibile** — si vede cosa importa chi, invece di doverlo ricostruire leggendo. Lo stesso lavoro, fatto oggi, è pericoloso; fatto con quel file, è meccanico.

⚠️ **CORRETTA IL 2026-09-18, E LA CORREZIONE È IL PUNTO: QUESTA CONDIZIONE DESCRIVEVA UN MONDO CHE IL 22 NON HA PRODOTTO.** Diceva *«finito lo spacchettamento, `tokenize` e `classify` staranno in un file loro»*. **Il 22 è finito, e stanno tutte e due in `index.html`** (misurato: righe 10631 e 10746). Lo spacchettamento ha estratto **gli strati** — `config`, `spazio`, `identita`, `avvio`, `progressi`, `audio` — e `quiz-engine` non è fra loro: è uno dei gruppi che il censimento del 2026-09-18 ha trovato **ancora in `index.html`**.

> **Non era una condizione vaga: era precisa su un fatto che non è accaduto.** *È la forma peggiore, perché chi la legge cerca quel file, non lo trova, e non sa se è un errore o un rinvio — e una condizione che non si sa leggere non trattiene niente.*

**Cosa la renderà vera, scritto invece che sottinteso:** l'estrazione dello strato **`quiz-engine`** (`levenshtein`, `similarity`, `alignWords`, `classify`, `tokenize`, `stripForCompare`, `shuffle`, `starsForPercent`), che il piano nomina e che **non è ancora stata fatta**. *Finché quel file non esiste, questa voce non è pronta — e adesso lo dice.* |
| 2026-09-15 | ⚠️ **Una SECONDA implementazione del riconoscimento vocale, indipendente da quella viva.** Dentro `view-pronunciation` c'è un motore suo — l'oggetto `recognition` e il pulsante `#mic-btn` — che non ha niente a che vedere con `vcRecognition` di Voice Coach. Sono due macchine diverse che fanno la stessa cosa nello stesso file. | **Va scritta da sola e non come dettaglio della riga qui sopra**, perché è una domanda diversa: quella chiede *quando* si toglie una vista morta, questa dice che **il conto dei motori di riconoscimento vocale dell'app è due e non uno**. Chi cercherà «dove si parla al microfono» trovandone uno solo avrà la risposta sbagliata — ed è esattamente l'errore già commesso una volta, quando `submitAttempt` fu scambiato per Voice Check. | **Insieme a `view-pronunciation`, nel passo dopo il 25.** Non prima: finché la vista c'è, il motore è suo. |
| 2026-09-15 | **`bootAsUser` e `mockInit` NON sono duplicazioni da unificare: sono 14 e 20 decisioni diverse.** Contati per contenuto al triage del passo 16: `bootAsUser` **26 copie / 14 varianti**, `mockInit` **28 / 20**. (`openModule`, 23 copie / **1** variante, è stato unificato lo stesso giorno: quello era meccanico.) | ⚠️ **È il caso in cui il rischio dichiarato del passo 16 smette di essere un rischio e diventa il lavoro:** unificare venti versioni vuol dire **scegliere quale vince**, e ogni scelta sbagliata lascia dei file **verdi che provano meno di prima** — il tipo di errore che non produce nessun rosso. Un `mockInit` che spegne il sintetizzatore in modo leggermente diverso non è una copia mal riuscita: può essere l'unica ragione per cui quel file misura quello che dice. | **Ognuno il suo passo, e si parte LEGGENDO le varianti, non unificandole.** Il primo giro è un censimento che dice *quante versioni sono davvero diverse e in cosa* — se venti varianti si riducono a tre più diciassette differenze accidentali, è un lavoro; se sono venti scelte, non si fa. |
| 2026-09-15 | **Match Practice en→it: nessun test vivo verifica che mostri il Blocco Ascolto della consegna** (`#qm-prompt-audio`). Era cercato solo da `legacy/test_qm`, cancellato il 15 settembre perché fuori dalla suite da settimane. Gli altri tre moduli nominati dal limite dichiarato di `test_blocco_ascolto.js` sono coperti davvero (Flash Card, Repeat Aloud, Why We Say It). | Il buco **non nasce con la cancellazione, diventa visibile**: quel file non lo lanciava nessuno. Oggi il caso è parzialmente coperto dall'asserzione ① di `test_blocco_ascolto.js` (il markup ha **una sola sorgente**), che è più forte di un confronto a campione — ma non vede un modulo che smettesse di **chiamare** `renderListenBlock`. | **Alla prima apertura di `test_blocco_ascolto.js` o di un test di Match Practice**, dove una riga in più costa un minuto. Non con un giro apposta: è un'asserzione, non una correzione, e il limite adesso è scritto dove si legge. |
| 2026-09-15 | **Lo script che conta le VARIANTI (non le copie) di una funzione ripetuta merita di diventare uno strumento in `tests/tools/`.** Oggi è stato scritto al volo per il triage del passo 16: estrae ogni definizione, la normalizza, e ne fa l'hash — così `23 copie` si legge `1 variante` e `28 copie` si legge `20 varianti`. | **È la differenza fra un lavoro meccanico e venti decisioni**, e non si vede contando le occorrenze con `grep -c`. Un conto di copie avrebbe detto «77 duplicazioni» e avrebbe fatto partire `bootAsUser` e `mockInit` insieme a `openModule`. ⚠️ **Limite noto, e va scritto se lo strumento nasce:** la normalizzazione decide cosa è «la stessa versione» — troppo aggressiva e venti varianti diventano una, troppo timida e due spazi fanno due varianti. Uno strumento di misura che sbaglia non lo dice (regola 37), quindi nasce con il suo test o non nasce. | **Quando servirà la seconda volta**, cioè al primo dei due passi su `bootAsUser`/`mockInit`. Scritto adesso per un uso solo sarebbe uno strumento senza un secondo lettore. |
| 2026-09-15 | **Il controllo sui NOMI nei commenti — id del DOM, chiavi `CONFIG`, file e percorsi citati, numeri di regola — NON diventa una guardia in CI.** Costruito e misurato al triage del passo 17 su 66 file e 6569 righe di commento: **zero difetti veri, tre falsi positivi.** Funziona (provato iniettando `legacy/test_qm.js` in un commento: lo prende), ma non ha niente da sorvegliare. | ⚠️ **Una guardia che sorveglia una classe vuota è uno strumento che parla senza avere niente da dire — e quelli si imparano a ignorare.** E la classe è vuota per una ragione precisa, non per fortuna: è esattamente quello che le rinomine dei passi 1-6 hanno già spazzato. Metterlo in CI adesso significa aggiungere un verde in più che non prova niente, sulla suite dove ogni verde deve valere qualcosa. | **Alla prossima rinomina grossa** — cioè il giorno in cui quella classe torna a riempirsi. È li' che un controllo sui nomi paga: una rinomina sposta gli identificatori nel codice e **lascia indietro quelli citati nei commenti**, che nessun `grep` di verifica per sottrazione (regola 41) guarda. Nasce con il suo test, o non nasce. |
| 2026-09-15 | **La LETTURA DEI COMMENTI entra nello spacchettamento come riga di ogni pezzo estratto**, invece di essere un passo suo (il 17, chiuso lo stesso giorno). Ogni pezzo che esce da `index.html` si legge, e i commenti che porta con sé si verificano allora. | La ragione del passo 17 era *«un commento falso spostato in un file nuovo nasce autorevole, quindi va corretto PRIMA»*. Ma lo spacchettamento **non copia i commenti alla cieca**: estraendo un pezzo si legge quello che si sposta, con il contesto davanti e su un pezzo per volta. Farlo prima vorrebbe dire leggere 6569 righe **due volte**. *E il solo caso noto di questa classe è stato trovato di passaggio, correggendo altro: è così che si trova.* | **Dentro la fase 4, a ogni estrazione** — non come giro a parte, mai come lavoro suo. ⚠️ E la cosa da tenere davanti mentre si legge è la distinzione **passato/presente**: un commento che nomina una cosa morta può essere corretto, se la sta dichiarando morta. Sono opposti e si somigliano. |
