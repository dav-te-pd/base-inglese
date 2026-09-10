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

**Passo C fatto** (i file bastano a riprendere la catena) **e le quattro correzioni a
`CLAUDE.md` fatte** — la riga nel cappello che manda qui, la mappa «Dove sta cosa», le
regole 4 e 33 che nominano la cartella invece di elencare i file, versione `20260908c`.

**IL PASSO ZERO È FINITO.** 0a, 0a-bis, 0b, 0c e 0d sono tutti chiusi: lo strumento
misura, i quattro cicli non deterministici di `test_batch19` sono riscritti, gli errori
ingoiati sono censiti, la suite è verde su 42 file con **933 asserzioni registrate**, e
tutto è in `main`.

**LA FASE 1 È FINITA.** I passi 1, 2, 3, 4, 4-bis, 5 e 6 sono tutti fatti e
verificati — suite verde su 42 file, 933 asserzioni, il conteggio mai calato in
nessuno dei sette giri — e tutti in `main`. I nomi che il codice usa oggi sono
quelli decisi: `shuffle`, `flashcard`, `match*`, `speedMatch*`, `storyCards*`,
`gate` / `aircraft-door` sotto `data/inglese/it/` e `docs/inglese/it/`.

**LA FASE 1-BIS È FINITA** (2026-09-09): i passi 7, 8 e 9 sono fatti e verificati. La
sequenza degli episodi ha la sua fonte nel repository, `EPISODES` nasce da lì invece di
essere scritto a mano, e le etichette dei personaggi sono contenuto dei file episodio.

**La fase 2 era stata fatta prima:** ventidue passi su profilo nuovo, su Pages, il 2026-09-09.
Ne sono usciti cinque difetti, che stanno nella sezione «I cinque difetti del collaudo
dell'episodio 2» qui sotto con le loro decisioni già prese.

**LA FASE 2 È FINITA.** C.3, C.5, C.4 e C.2 sono tutti fatti e verificati. C.6 non era di
questa catena — è la N.1 della cronologia nuova.

**Il prossimo passo è la fase 1-bis**, la sequenza degli episodi. Non si comincia senza il
via di chi guida il progetto.

Dal collaudo è uscito anche **C.6** — due opzioni identiche in Match Practice, che scrive
un dato falso — ed è il più grave dei sei. **Non si corregge in questa catena**: la sua
soluzione è un cambio di struttura del contenuto, quindi è diventato la **N.1** della
«cronologia nuova» più sotto, che comincia solo a catena chiusa.

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
- **Il passo 21 (lo spazio dei nomi) non è una fermata sicura.** O l'oggetto esiste e
  tutto ci passa attraverso, o no.
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
| **10** | Profilo nuovo, episodio 2 dall'inizio alla fine. Su nomi definitivi e progressi già azzerati dalla fase 1: **si collauda una volta sola**. | ☐ | **sì** |
| **11** | Le nove voci accumulate da collaudare. | ☐ | **sì** |
| **12** | Si corregge **quello che è piccolo e locale**; il resto va in questo file e prende una fase sua, decisa a collaudo finito. ⚠️ **I rilievi si scrivono qui MAN MANO, non alla fine**: un collaudo interrotto con i rilievi in testa non lascia traccia di essere avvenuto. | ☐ | **sì**, se i rilievi sono scritti |

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
| **14** | Le 19 attese fisse di `test_batch19` che fanno da guardia a un'asserzione. **1–1,5 giorni**, la più grossa della fase. Il modello è già scritto e verde: `tests/test_match_practice_nonloso.js`. | ☐ | **sì**, un'asserzione per volta |
| **15** | I quattro valori ricopiati nei test. ~1 ora. ⚠️ Non portare via anche i `length === 3`: quelli sono **requisiti**, non copie — il riquadro in fondo a questo file lo spiega. | ☐ | **sì** |
| **16** | Le voci di pulizia: `view-pronunciation`, il ramo `'check'` di `openAttemptPopup`, `tests/legacy/` (6 file) e `tests/debug/` (6 file, aggiunto il 2026-09-09: quattro file che nessuno lancia sono quattro file che possono mentire senza che nessuno se ne accorga), `levels.X.label` (morto: unica occorrenza in un commento), i due `if` adiacenti in `vcEvaluate`, i quattro test con funzioni quasi identiche. *(NON la divergenza `off/seen`: muore da sola nel passo 20. NON `test_speakeasy.result.txt`: verificato, non esiste.)* ⚠️ L'ultima voce è **l'unico punto della fase dove un errore è invisibile** — un helper condiviso che indebolisce un'asserzione lascia quattro file verdi che provano meno di prima. | ☐ | **sì**, voce per voce |
| **17** | I commenti: i dodici di `attemptRule` (**lettura, non sostituzione** — `CONFIG.attemptRule` è stato tolto il 2026-09-05, non c'è nessun identificatore da rinominare), il testo falso in `renderMasteryPanel`, il commento morto su `CONFIG.flashcard` (`index.html:6707`). ~1 ora. **Vanno prima del trasloco**: un commento falso spostato in un file nuovo diventa la documentazione di quel file, e nasce autorevole. | ☐ | **sì** |

### Fase delle stringhe — quando si vuole, purché intera

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **18** | Le stringhe italiane dal JS a `istruzioni-moduli.json`. **Prima CONTARLE**: il «~25» non è mai stato un censimento, un filtro grezzo ne trova 93 candidate. **Poi misurare quanti test verificano il testo a schermo**, perché questa fase li rompe e nessuna lista lo dichiara. 2–3 giorni. ⚠️ **Mai a metà.** | ☐ | **NO** durante; sì prima e dopo |

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
| **19** | `people` e `places` fuori da `APP_CONFIG` → `data/inglese/it/`, **prima** di estrarre `APP_CONFIG`, così quello che si estrae è già solo manopole. ⚠️ **Non è uno spostamento di file: è una conversione ad asincrono** — `slotOptions` e `resolveSlotValue` oggi leggono in modo sincrono mentre disegnano, e se il file non arriva lo studente deve vedere la schermata d'errore (regola 35). Mezza giornata, con il suo test. | ☐ | **sì** |
| **20** | **Primo commit dello spacchettamento:** `APP_CONFIG` esce in un file suo **e nello stesso commit** `module-order.js` e `test_config_letta.js` lo seguono. Continuano a leggere **staticamente**, solo un file diverso e molto più piccolo: firma invariata, **zero dei 79 punti di chiamata toccati**. Il primo pezzo estratto dev'essere `APP_CONFIG` proprio perché è il bersaglio che quei due devono leggere. *(Qui muore da sola la divergenza `off/seen` del passo 16.)* | ☐ | **sì** |
| **21** | Lo spazio dei nomi: si crea **l'oggetto vuoto e la regola**. Non sposta codice, cambia **come il codice si raggiunge**. ⚠️ **Non è una fermata sicura a metà.** | ☐ | **sì** solo a passo finito |
| **22** | Gli strati, dal basso: `core`, `dati`, `progressi`, `audio`, `ui-condivisa`, `quiz-engine`. **Ogni estrazione fa due cose nello stesso commit:** attacca allo spazio dei nomi ciò che quel file espone, e sposta il file. **Dentro l'estrazione dello strato `dati` sta l'unificazione dei tre `fetch` in un punto solo** — `MODULE_INSTRUCTIONS_FILE`, `module.dataFile`, e `messaggi-feedback.json` che oggi scavalca il meccanismo. È voce esplicita, non implicita. | ☐ | **sì**, uno strato per volta |
| **23** | I moduli, uno per famiglia: match+speedMatch, storyCards, dialogo, flashcard, voice, repeatAloud, personalizzazione, mappa+admin. **~15 file in tutto, quindi ~15 fermate.** Un modulo sta fra 365 e 670 righe. | ☐ | **sì**, un modulo per volta |
| **24** | **DUE file, non uno** (deciso il 2026-09-09): `componenti-condivisi.md` e `componenti-singoli.md`. Ogni pezzo estratto finisce in una delle due liste, e **non c'è un terzo posto dove metterlo**: niente resta fuori, niente si cancella, niente blocca chi estrae. Si riempiono **nello stesso commit** di ogni estrazione, e i file **nascono con la prima estrazione**, non prima — un file vuoto in attesa è un invito a riempirlo di intenzioni.<br><br>*Perché due e non uno, e il buco che ha chiuso: il criterio «un pezzo ci sta se e solo se è usato da più di un modulo» è verificabile, ma **sette copie identiche non sono "usate da più di un modulo": ognuna è usata da uno**. Con un file solo, lo spacchettamento avrebbe messo sette righe separate e il documento sarebbe nato dicendo «il Blocco Ascolto non è un componente condiviso» — vero secondo il criterio, falso secondo la realtà. Con due file, alla fine si LEGGE la seconda lista: sette voci con lo stesso nome saltano all'occhio. **Il controllo diventa leggere, non cercare.***<br><br>*I nomi sono stati scelti contro la prima proposta, ed è la ragione dello scarto che conta. La prima era `pezzi-di-un-modulo.md`, con l'argomento «un componente è condiviso per definizione, quindi il nome dice la regola d'ingresso»: **codifica il criterio di catalogazione, che si usa una volta per riga, e ignora l'uso, che è quotidiano.** Quel file è un magazzino da cui si preleva, e da un elenco di «pezzi» non si preleva — la parola dice scarti, ritagli, roba avanzata.*<br><br>*Tre ragioni per `componenti-singoli.md`: **«singolo» non nega «componente»**, dice che oggi lo usa uno solo, cioè cosa può diventare; i due nomi **differiscono per una parola sola**, quindi stanno vicini in qualunque elenco e cercando «componenti» escono tutti e due (per un file la cui ragione d'essere è «guarda qui prima di scrivere», essere difficile da trovare è il difetto centrale); e lo spostamento fra i due file diventa **un cambio di aggettivo invece che di categoria** — più piccolo, quindi più probabile che succeda davvero.*<br><br>*Cautela: «singolo» si può leggere come «componente semplice». Si chiude con la prima riga del file, non col nome.*<br><br>**Le tre fragilità, tutte e tre accolte:**<br>① **Tre campi corti e fissi per ogni riga, non un paragrafo.** **«Cosa fa»** — il comportamento nelle parole di chi ne ha bisogno, non del modulo che ce l'ha (*«pulsante ascolta + velocità» sette volte di fila si vede; «audio di Repeat Aloud» no*). **«Cosa gli passi, cosa restituisce»** — la firma in chiaro. E **«cosa dà per scontato»**: *«vuole un contenitore già flex», «il testo lo risolve chi chiama», «scrive nel localStorage dell'episodio corrente», «va chiamato dopo che i dati sono arrivati».*<br><br>*Il terzo campo esiste perché **la gente non riscrive un pezzo perché non l'ha trovato — riscrive perché l'ha trovato e non ha capito se le andava bene.** Una firma non lo dice; i presupposti sì. Per il Blocco Ascolto quel campo avrebbe detto «vuole `.listen-block` intorno», che era esattamente l'informazione che serviva.*<br>② **La regola del passaggio:** quando un secondo modulo comincia a usare un pezzo, la riga si sposta nei condivisi **nello stesso commit che lo deduplica**. Mai in due posti, mai «poi». *Il secondo file non è un cimitero, è una sala d'attesa.*<br>③ **Il costo dichiarato:** i pezzi duplicati si estraggono come duplicati e quel lavoro si fa due volte. Accettato, per la stessa ragione per cui C.3 si è fatto **prima** dello spacchettamento: fermarsi a deduplicare mentre si trasloca rende il trasloco impossibile da diagnosticare.<br><br>⚠️ **LA GREP CHIUSA, e sta scritta qui dentro apposta.** Prima di scrivere la riga di un pezzo, si prende **UNA stringa distintiva da dentro quel pezzo** — una classe CSS, un `aria-label`, un attributo `data-` — e la si cerca nel repository.<br><br>*È la differenza che conta: un censimento è una ricerca **aperta** («trova tutte le duplicazioni»), e fallisce in silenzio perché non ha un criterio di completezza — «non ho trovato altro» è indistinguibile da «non ho cercato bene». Questa è **chiusa**: una stringa che hai davanti, un comando, un numero. **O il numero è 1, o non lo è.** È esattamente come sono state trovate le sette copie del Blocco Ascolto: non un censimento dei componenti audio, ma la classe che si aveva sotto gli occhi, cercata.*<br><br>*Il limite, e per questo le due difese si completano: la grep chiusa trova le copie che condividono almeno una stringa, non sette copie riscritte ognuna con le sue classi. Quelle le prende la lettura finale della seconda lista. La grep prende il caso al momento dell'estrazione, quando costa poco; la lista prende il resto, tardi ma da qualche parte.*<br><br>*E sta dentro questa riga e non in un documento a parte per una ragione precisa: costa dieci secondi per pezzo, sette minuti su quaranta estrazioni. **Non è il tipo di controllo che si salta perché costa, è il tipo che si salta perché ci si dimentica che esiste.**<br><br>⚠️ **IL SECONDO FILE NON È SOLO UNA LISTA DA LEGGERE ALLA FINE: è il magazzino che si consulta PRIMA di scrivere un modulo nuovo**, in tre passi. ① Guardo nei condivisi. ② Guardo nei singoli — **e se trovo qualcosa che fa quello che mi serve LO PROMUOVO invece di riscriverlo**. ③ Solo come ultima spiaggia ne creo uno nuovo.<br><br>*Il passo ② è quello che oggi manca, ed è **il motivo per cui esistono sette Blocchi Ascolto**: nessuno aveva un posto dove guardare prima di scrivere. E risponde a una domanda diversa dalla grep chiusa, in un momento diverso — la grep è retrospettiva («questo pezzo che ho in mano è duplicato?»), la consultazione è preventiva («esiste già qualcosa che fa questo?»). La grep li avrebbe trovati allo spacchettamento, cioè anni dopo che erano nati; il passo ② avrebbe impedito al **secondo** di nascere. Servono tutte e due e non si sostituiscono.*<br><br>**Il controllo finale sono DUE cose, non una.** **Leggere la lista** dice *cosa c'è* e trova le duplicazioni fra righe. **La riconciliazione modulo per modulo** dice *se manca qualcosa*, e prende il caso che la lettura non può prendere per costruzione: **un pezzo mai scritto da nessuna parte è invisibile in un elenco di pezzi scritti** (stessa forma della famiglia ⓪).<br><br>⚠️ **E la riconciliazione ha una chiusura, altrimenti è una ricerca aperta** — cioè la cosa che la grep chiusa esiste per non essere. Non è «guardo ogni modulo e vedo se manca qualcosa», è: **per ogni file di modulo, ogni funzione che definisce e ogni classe CSS che introduce deve comparire in esattamente uno dei due elenchi.** Si contano le definizioni nel file, si contano le righe nei due elenchi, e i due numeri devono tornare. *L'esito è un numero, non un'impressione: o torna, o non torna — e se non torna, dice quali definizioni sono scoperte. Ed è verificabile a macchina, quindi prima o poi diventa un test.*<br><br>⚠️ Una riga rimandata è una riga scritta dopo guardando il risultato, cioè un censimento invece di una decisione registrata. | ☐ | **sì** |
| **25** | `CLAUDE.md`: la regola 6, la riga «L'app vive in un file solo», **e la regola 8** — che oggi nomina un solo file di testi condivisi mentre ne esistono due (`istruzioni-moduli.json` e `messaggi-feedback.json`). | ☐ | **sì** |
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
| **N.10** | **I tasti si rinominano guardandoli TUTTI INSIEME, non uno per volta.** Prima di toccare un nome serve verificare se il funzionamento è coerente ovunque o se qualche modulo fa una cosa sua: la domanda «questo tasto fa dappertutto la stessa cosa?» ha una risposta sola, e un modulo per volta la fa rispondere N volte in N modi. *Stessa forma della lettura finale di `componenti-singoli.md` (passo 24): il controllo è **leggere l'elenco intero**, non cercare.* **Dopo l'episodio 5.** | collaudo del 2026-09-10 |

*N.9 non è assegnata, e la buca è voluta: **N.10** è il numero dato in chat il
2026-09-10 e si tiene com'è. I numeri non si inventano e non si rinumerano —
una buca visibile dice «qui manca qualcosa», una rinumerazione silenziosa no.*

## Le invarianti, valide per tutta la catena

- **Venti suite invece di un macello.** Nel dubbio fra una corsa e due, se ne fanno due:
  undici minuti l'una, e ogni rosso ha un sospettato solo. **Non si accorpa per fare un
  favore a nessuno.**
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
| 2026-09-08 | **Un lavoro a più passi sta sempre nella lista attività**, un elemento per passo, con il progresso vero quando c'è — durante una corsa lunga il testo si aggiorna con il conteggio letto dal log, circa ogni due minuti. Il pallino che gira è un'animazione, non una misura: da solo non dice niente. | **È la prima cosa del progetto che chi guida può verificare senza chiedermela.** Fino a oggi l'unica era la CI, che prova `main` e non quello che sto facendo adesso. E serve proprio perché il mio strumento può mentire: il 2026-09-07 dicevo «la suite sta girando» su un'attesa rotta, mentre un task appeso da due ore era visibile a lui e non a me (regola 37). | **Va in `CLAUDE.md` come regola permanente, insieme alla prossima modifica che tocca quel file** — cioè il passo 6 della catena. Non serve un giro apposta; questa riga esiste perché nel frattempo non si perda. |

| 2026-09-09 | **Una rinomina si verifica su TUTTE le forme del nome, e ogni forma ha il suo COMANDO.** ➜ **SPOSTATA IN `CLAUDE.md` COME REGOLA 41** il 2026-09-09, con i sei comandi in tabella. *Da quando porta i comandi non è più una nota su come abbiamo lavorato: è una procedura che una sessione nuova deve eseguire, e `CLAUDE.md` è il posto dove si guarda prima di cominciare.* | Tre cadute della stessa famiglia, e la terza è quella che ha cambiato la forma della regola: una forma **elencata e non cercata**. La storia per esteso è nella regola 41. | **Fatto.** Qui resta il rimando, perché la catena la cita in più punti. |

## Rinomine

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-06 · nomi decisi il 2026-09-08 | **La rinomina unica: cinque nomi in un lavoro solo.** `se* → storyCards*`, `srShuffle → shuffle`, `quickMatch* → match*`, `speedRound* → speedMatch*`, `flashcardLevelA → flashcard`, più gli id degli episodi `gate → gate` e `aircraft-door → aircraft-door`. **I nomi e le loro ragioni stanno in `docs/inglese/it/struttura-corso.md`, sezione «I nomi in codice»** — qui c'è la decisione di eseguirla, non i nomi. Segue il `kind`/id del modulo e lo strato in kebab (`speak-easy-*`, `quick-match-*`); **NON seguono le sigle di due lettere** (`qm-`, `sr-`, `fc*`), e questa è una decisione scritta, non una dimenticanza. | I nomi vecchi sono prefissi ereditati dal primo modulo che li ha introdotti, o nomi che mentono: `flashcardLevelA` si porta dentro il grado A mentre lo stesso descrittore gira sul grado B, e `se*` viene da «Speak Easy», un modulo che non esiste più — scritto per esteso in **54 punti** come `speak-easy-*`. **E la premessa da correggere: non è solo l'id dell'episodio a toccare i progressi salvati.** `se*` nomina due namespace del `localStorage` (`seDeclarations:`, `seExplanationStats:`), e i `kind`/id dei moduli sono le chiavi di `modules:`, `moduleOutcome:`, `audioSecondsSent:`, `nextLineSkips:` e `introDismissed:`. Quattro rinomine su cinque lasciano dati orfani, non una. | **Prima di un collaudo su profilo nuovo**, finché siamo gli unici utenti e non c'è niente da migrare. **Una rinomina per volta, suite completa fra una e l'altra**, dal più piccolo al più grande: `shuffle` → `flashcard` → `match*` → `speedMatch*` → `storyCards*` → gli id degli episodi. Così il primo rosso ha sempre il sospettato più piccolo possibile. Non va più insieme a Supabase. |

## Difetti silenziosi trovati e non ancora corretti

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
| 2026-09-10 | **Il badge di Voice Check segna 0% su una registrazione MUTA**, e non è un arrotondamento: 0% vuol dire *«hai sbagliato tutto»*, mentre la verità è *«non ti abbiamo sentito»*. `vcFirstAttemptPercents.push(pct)` è gated solo su `attemptNum === 1`, senza nessuna guardia sul riconoscimento vuoto: `correctCount` resta 0, quindi `pct` è 0 e finisce nella media da cui esce il colore della mappa. | **Il badge non tace: mente.** È diverso da un dato mancante — un dato mancante si vede e si può cercare, un dato falso viene creduto. E il modulo che sbaglia così è quello *senza aiuti*, cioè quello di cui ci fideremo di più. Venuto a galla facendo la ② (2026-09-10): i colori delle voci hanno la guardia `recognizedWords.length > 0` — *«se non abbiamo sentito niente, non c'è niente da giudicare»* — e le stelle no, quindi le due metà dello stesso modulo adesso dicono cose diverse sullo stesso silenzio. | **Fuori dalla ②**, e la correzione probabile è **simmetrica**: se `recognizedWords` è vuoto, `vcFirstAttemptPercents` non riceve niente — la stessa guardia che c'è nei colori. ⚠️ Va deciso cosa succede a una battuta il cui unico tentativo è muto: oggi vale 0%, con la correzione non varrebbe niente, e la media si farebbe sulle battute sentite. |
| 2026-09-10 | **`LastAttemptRule` vale per il badge, NON per i colori delle voci.** In Voice Practice il badge legge `vcLastAttemptPercentByLine`, che tiene solo l'ultimo tentativo; la mastery invece passa dalla scala **a ogni tentativo**, quindi tre tentativi sono tre passaggi. Non è sbagliato — la scala è fatta per accumulare, e allenarsi è accumulare — ma **il nome dice una cosa che lì non succede**. | È la famiglia dei **nomi che mentono**, con `sr` che non sta più per niente e `matching` che non dice cosa fa. Un nome che descrive metà del comportamento è peggio di un nome opaco: chi lo legge smette di guardare. | **Quando si toccheranno i nomi**, e quel gruppo si guarda **insieme** — non uno per volta: la domanda «questo nome dice cosa fa?» ha una risposta sola per tutti e tre, e affrontarli separati la fa rispondere tre volte in tre modi. |
| 2026-09-08 | **Quando si costruisce un modulo nuovo, si chiede prima di completare quello che non è stato detto.** Se una parte del comportamento non è specificata — cosa scrive nella mastery, quando, cosa succede al giro di ripasso — non si inventa: si chiede. | È il momento in cui uno sbaglio non resta locale ma **si accumula**. Oggi tre scrittori della mastery si comportano diversamente perché nessuno ha mai chiesto *«e le parole?»* quando i moduli sono stati costruiti — e la prova che non è stata una scelta è che Voice Check, la verifica finale, calcola il dato per parola e lo butta, con un commento che dice solo *«unchanged from before the split»*. | **Va in `CLAUDE.md`**, come regola. **Non adesso**: quando ci arriveremo. |
| 2026-09-08 | **I colori scritti a metà modulo restano scritti subito, ma vanno PARCHEGGIATI: contano solo se il modulo viene completato.** Non si spostano alla fine. | Scrivere subito protegge chi chiude il browser: il lavoro fatto non si perde. Ma un modulo abbandonato a metà lascia oggi colori che pesano quanto quelli di un modulo finito, e non è la stessa cosa — chi esce dopo due risposte non ha fatto l'esercizio. Le due esigenze non sono in conflitto: si scrive subito **e** si tiene da parte, invece di scegliere fra perdere il dato e contarlo per buono. | **Da fissare.** Quando ci arriveremo, la domanda da farmi è come: dove vive il parcheggio, e cosa lo promuove. |

## CI rosse che non dicono cosa fare

*Stessa famiglia: la CI diventa rossa e chi la legge non sa se è rotta l'app o il
test. Vanno guardate in un giro solo — **dopo il collaudo**, sono mezza giornata.*

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | **`test_batch19.js` non ha un punto da correggere: ne ha diciannove.** Delle 28 attese fisse del file, **19 fanno da guardia a un'asserzione** — dopo l'attesa, e prima di qualunque altra azione, si legge uno stato e ci si asserisce sopra. **Due usano lo stesso identico schema**: `waitForTimeout(800)` con accanto il commento «feedbackPauseMs (600) then auto-advance», righe 104 (`[QM Task1]`) e 179 (`[SR Task1]`) — cioè 600 più un margine, sommati a mente. Restano vere anche le due cose registrate qui il 2026-09-07: il `.catch(() => {})` sul click di `#sr-ready-btn` che sopprime il fallimento dove nasce, e la `waitForTimeout(300)` ridondante subito dopo. | **La correzione di ieri era GIUSTA MA PARZIALE, e chi legge questa riga fra un mese deve sapere che il file è stato capito a metà.** Sistemava il punto che aveva fallito e lasciava in piedi diciotto punti della stessa identica forma, uno dei quali *identico carattere per carattere*. Il rosso in CI cadeva su una riga diversa a ogni corsa — 139 in una, 244 in un'altra — ed è il segno che si stava guardando un esemplare invece della specie. Una sonda locale su 8 giri non ha riprodotto il rosso: i due sospetti rimasti (la risposta giusta capitata sull'**ultima** domanda del passaggio, dove la «domanda successiva» non esiste; e un runner più lento del margine) **non sono dimostrati**. Quello che è dimostrato è la causa condivisa: **il test non controlla lo stato che misura.**<br><br>**2026-09-08 — RIPRODOTTO IN LOCALE, e non è raro: 2 giri rossi su 3**, sullo stesso codice, tutti su `[SR Task1]` (Speed Match). Il gemello `[QM Task1]` non cade più perché la sua asserzione è stata rifatta in `tests/test_match_practice_nonloso.js`, dove la situazione si **costruisce** invece di sperarci: lì non si risponde mai giusto sull'ultima domanda del passaggio. `[SR Task1]` ha il difetto identico e intatto: il ciclo tocca **sempre la prima opzione** fra quattro (una corretta e tre distrattori, `buildMultipleChoiceOptions`) e, se in tutto il giro non gliene capita una giusta, esce con `gotCorrect` falso — e l'asserzione dopo la `waitForTimeout(800)` legge uno stato che non è mai arrivato.<br><br>**E c'è la prova che serve al contatore delle asserzioni:** quando cade, il file ne esegue **39 invece di 40**. La quarantesima vive dentro il ramo `gotCorrect` e semplicemente non gira. Il verde/rosso lo dice perché due asserzioni falliscono; ma un ciclo che si esaurisce **senza** far fallire niente sparirebbe in silenzio, ed è esattamente il caso che il passo 0a esiste per vedere. | **Alla prossima apertura di quel file, e si riscrive tutto il gruppo, non il punto che ha fallito.** Il modello è già scritto e verde: `tests/test_match_practice_nonloso.js` porta la stessa asserzione di `[QM Task1]` aspettando *quello che il lavoro produce* (la domanda successiva a schermo) invece di 800 ms, e leggendo lo stato dentro la stessa chiamata che aspetta. |
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
| 2026-09-08 | `test_attendi.js`: il **terzo caso di `attendi.sh` non è coperto** — tempo scaduto, uscita 2. Sono coperte le due uscite di ogni giorno (0 e 1). Esercitato a mano il 2026-09-07. | Provarlo costerebbe al test esattamente l'attesa che deve misurare: il file diventerebbe il più lento della suite per un ramo che non si usa mai. La prova a mano vale finché il modo di contare il tempo resta quello di oggi. | **Alla prima modifica di `attendi.sh` che tocchi il timeout.** Da lì la prova a mano del 2026-09-07 non vale più, e o si copre o si rifà a mano dichiarandolo. |
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
| 2026-09-05 | La divergenza **off/seen** in `tests/module-order.js`: il file riscrive a mano la regola di `moduleStepId()` e conta le apparizioni in modo diverso dall'app. | Correggerla adesso significa mantenere due copie della stessa regola. | **Non si corregge: sparisce da sola** quando l'identità del passo sarà `modulo + grado`, perché non ci sarà più niente da contare. |
| 2026-09-06 | I testi dell'avviso microfono (`vcUpdateMicNotice`, titolo e corpo dei tre livelli) sono scritti nel codice invece che in `data/{lingua}/istruzioni-moduli.json`, insieme ad altre ~25 frasi già note nella stessa condizione. | Regola 8: se è testo che lo studente legge e non è contenuto dell'episodio, sta nel JSON. Sparsi nel codice non si possono correggere senza toccare `index.html`, e in una seconda edizione non si possono tradurre affatto. | **È un lavoro solo**, non venticinque: si fa quando ci arriveremo, tutto insieme. Spostarne una alla volta lascia il problema e raddoppia i posti dove cercare. |
| 2026-09-09 | **La terza dipendenza da `index.html` letto come testo**, aggiunta di proposito da `test_blocco_ascolto.js`: conta le occorrenze del markup del pulsante per impedire all'ottava copia di nascere. | È una scelta, non una distrazione, ed è dichiarata anche in cima al test. Un test che aprisse i sei moduli e li confrontasse proverebbe **meno**: direbbe che i sei di oggi si assomigliano, non che domani non se ne aggiunge un settimo a mano. Il prezzo è che se il markup del pulsante cambia, quella riga va aggiornata — **ed è voluto: è esattamente il momento in cui qualcuno deve accorgersi che sta toccando un pezzo condiviso.** | **Si guarda tutta insieme** quando le tre dipendenze diventeranno un problema, non una per volta. |
| 2026-09-09 | La vista **`view-pronunciation`** (`FEATURE: PRONUNCIATION EXERCISE`) è codice morto: `startPronunciationExercise()` non è chiamata da nessuna parte e il CSS la dichiara irraggiungibile. Contiene un **ottavo Blocco Ascolto** e uno **scrittore di mastery** (`submitAttempt`). | Trovata cercando gli scrittori della mastery: per un giro è stata scambiata per Voice Check. Non fa danno — nessuno può raggiungerla — ma falsa ogni conteggio di «quanti punti scrivono la mastery» e di «quanti Blocchi Ascolto esistono», che sono due domande che ci siamo già fatti. | **Nello spacchettamento**, dove un file che nessuno importa si vede da solo. Toglierla adesso è un lavoro a sé su codice che nessuno esegue. |
| 2026-09-05 | I due blocchi `if (vcVariant === 'practice')` adiacenti in `vcEvaluate`, unibili in uno. | Pura leggibilità: il comportamento è corretto. Toccarlo adesso vorrebbe dire aprire `vcEvaluate` per niente. | **Alla prossima modifica di `vcEvaluate`**, insieme a un lavoro che quella funzione la apre comunque. |
