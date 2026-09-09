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

**Fase 1: i passi 1 e 2 sono fatti e verificati.**
Il prossimo è il **passo 3**, che **va insieme al 4** — o tutti e due, o
nessuno dei due (vedi i divieti). Un passo per volta, con la fermata in mezzo, e non
si comincia senza il via di chi guida il progetto.

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
  `episode1`, 102 `quickMatch`, 126 `speedRound`, 22 `flashcardLevelA`). Un selettore
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

*I nomi e le loro ragioni stanno in `docs/it/struttura-corso.md`, sezione «I nomi in
codice». Qui c'è solo l'ordine e lo stato.*

*Il criterio dell'ordine: dal più piccolo al più grande, così **il primo rosso ha sempre
il sospettato più piccolo possibile**.*

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **1** | `srShuffle → shuffle` — 11 occorrenze, nessuno stato salvato, nessun DOM, nessun file dati. È il giro di taratura del metodo: se la suite va rossa qui, il problema è il metodo, non la rinomina.<br><br>**FATTO il 2026-09-08.** Undici in `index.html` (la definizione più dieci chiamate) e una in `tests/test_scala_colori.js`. Verificato prima che `shuffle` non collidesse con niente: nel codice non esisteva, nemmeno come parola. Allineate anche le **nove** occorrenze in `docs/validazione.md`, che descrive il codice e avrebbe continuato a nominare una funzione inesistente. **`docs/it/struttura-corso.md` NON è stato toccato** (regola 33): la sua tabella dichiara la rinomina da fare, ed è la fonte, non un registro di stato. | ☑ | **sì** |
| **2** | `flashcardLevelA → flashcard` — un `kind`. Prima rinomina che attraversa `data/…/istruzioni-moduli.json` e `introDismissed:`.<br><br>**SCRITTA il 2026-09-09, in attesa della suite.** 33 sostituzioni in 27 file: 4 valori di `kind` in `index.html`, la chiave di `istruzioni-moduli.json`, 26 nei test (di cui 4 in `tests/debug/`, che non è nella suite), 2 in `docs/validazione.md`. Verificato prima che il `kind` non venga mai usato per costruire un id del DOM — serve solo a `data[module.kind]` e alla chiave `introDismissed:` — quindi nessuna collisione con `#view-flashcard` e compagnia.<br><br>**VERIFICATO il 2026-09-09:** suite verde su 42 file, conteggio **933, uguale al baseline**. In `main`. | ☑ | **sì** |
| **3** | `quickMatch* → match*` (con `quick-match-*`, `view-quick-match`; **non** `qm-`) | ☐ | **NO** — vedi i divieti |
| **4** | `speedRound* → speedMatch*` (con `speed-round-*`, `view-speed-round`; **non** `sr-`) | ☐ | **sì** |
| **5** | `se* → storyCards*` — con `se-*`, `speak-easy-*`, `view-speak-easy` e i due namespace `seDeclarations:` / `seExplanationStats:`. **Una sessione sola.** | ☐ | **sì**, ma solo DOPO che è finito per intero |
| **6** | Gli episodi, **un commit solo**: `episode1 → gate`, `episode2 → aircraft-door`; `docs/it/ → docs/inglese/it/` e `data/it/ → data/inglese/it/` (~111 riferimenti a percorsi); i file rinominati in `inglese-it-gate.md` / `inglese-it-gate.json`; **`messaggi-feedback.json` con il percorso portato in una costante** (oggi è scritto dentro la riga di `fetch`, ed è l'unico dei tre che uno spostamento di cartelle può rompere senza comparire in nessun elenco); le regole 4 e 26 di `CLAUDE.md`. | ☐ | **sì** — e qui la fase 1 confluisce in `main` |

### Fase 1-bis — la sequenza degli episodi, ed `EPISODES` che smette di essere scritto a mano

*Perché adesso: è l'unica voce il cui costo **cresce mentre aspetta**. Se l'episodio 3
nasce prima, nasce copiando quindici descrittori.*

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **7** | `docs/inglese/it/sequenza-episodi.md` — la fonte, **la scrive Davide**. Elenco di id nell'ordine in cui si incontrano, con i raggruppamenti (A1.1, A1.2) come intestazioni **dentro lo stesso file**, così ordine e gruppo non possono contraddirsi. **NON si genera un `sequenza-episodi.json`**: l'elenco serve *durante* l'avvio, e farlo arrivare da un file renderebbe asincrono l'avvio dell'app. La fonte è il markdown, l'esecuzione è `CONFIG.episodes` aggiornato a mano — lo stesso rapporto che la regola 26 ha già stabilito fra `struttura-corso.md` e `APP_CONFIG`. | ☐ | **sì** |
| **8** | `EPISODES` nasce dalla sequenza: `dataFile` derivato dall'id invece che scritto trenta volte, `modulesById` costruito una volta sola. | ☐ | **sì** |
| **9** | Il contenuto torna nei file episodio: `dialogueSpeakerLabels`, `dialoguePlaceholderMap`, `dialogueSpeakers` escono da `index.html`. **La fonte è la tabella «I personaggi e le loro etichette» di `docs/…/episodio-N.md`, NON la colonna «Chi» della matrice** — la colonna dice *quale* personaggio è («Hostess al gate»), la tabella dice cosa sta sopra la bolla («Hostess»). ⚠️ **Non è solo uno spostamento di dati: cambia cosa vede lo studente nell'episodio 1.** La tabella dice che *«le etichette dei personaggi personalizzabili non portano il nome scelto: sopra la bolla c'è "Papà", non "Marco"»*, mentre oggi `speakerLabel()` risolve `papa`/`mamma`/`figlia`/`figlio` sul valore dello slot. Quindi **`dialogueSpeakers` sparisce** e le bolle dell'episodio 1 cambiano etichetta. È deciso (la tabella è la fonte), ma va visto al collaudo, non scoperto. | ☐ | **sì** |

*Risultato: aggiungere l'episodio 3 diventa **una riga nella sequenza e il suo JSON**, zero
righe di codice. Ed è anche la preparazione del punto unico che serve a Supabase.*

### Fase 2 — il collaudo

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **10** | Profilo nuovo, episodio 2 dall'inizio alla fine. Su nomi definitivi e progressi già azzerati dalla fase 1: **si collauda una volta sola**. | ☐ | **sì** |
| **11** | Le nove voci accumulate da collaudare. | ☐ | **sì** |
| **12** | Si corregge **quello che è piccolo e locale**; il resto va in questo file e prende una fase sua, decisa a collaudo finito. ⚠️ **I rilievi si scrivono qui MAN MANO, non alla fine**: un collaudo interrotto con i rilievi in testa non lascia traccia di essere avvenuto. | ☐ | **sì**, se i rilievi sono scritti |

### Fase 2-bis — la mastery

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **13** | Le cinque righe della sezione «La mastery: dove va il dato» qui sotto: la D3, il dato sul target, Voice Check che calcola e non scrive, i colori parcheggiati, il report per grado. *Perché qui: il collaudo su profilo nuovo **è** l'esperimento che le informa.* ⚠️ Gira su uno strumento non ancora tarato: se un rosso diventa ambiguo, **si anticipa il passo 14** invece di rilanciare la suite sperando. | ☐ | **sì**, riga per riga |

### Fase 3 — la taratura dello strumento

| | Passo | Stato | Fermata sicura dopo? |
|---|---|---|---|
| **14** | Le 19 attese fisse di `test_batch19` che fanno da guardia a un'asserzione. **1–1,5 giorni**, la più grossa della fase. Il modello è già scritto e verde: `tests/test_match_practice_nonloso.js`. | ☐ | **sì**, un'asserzione per volta |
| **15** | I quattro valori ricopiati nei test. ~1 ora. ⚠️ Non portare via anche i `length === 3`: quelli sono **requisiti**, non copie — il riquadro in fondo a questo file lo spiega. | ☐ | **sì** |
| **16** | Le voci di pulizia: `view-pronunciation`, il ramo `'check'` di `openAttemptPopup`, `tests/legacy/` (6 file), `levels.X.label` (morto: unica occorrenza in un commento), i due `if` adiacenti in `vcEvaluate`, i quattro test con funzioni quasi identiche. *(NON la divergenza `off/seen`: muore da sola nel passo 20. NON `test_speakeasy.result.txt`: verificato, non esiste.)* ⚠️ L'ultima voce è **l'unico punto della fase dove un errore è invisibile** — un helper condiviso che indebolisce un'asserzione lascia quattro file verdi che provano meno di prima. | ☐ | **sì**, voce per voce |
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
| **24** | `docs/it/componenti-ui.md` si riempie **nello stesso commit** di ogni estrazione. Criterio: un pezzo ci sta **se e solo se** è usato da più di un modulo — condizione verificabile, non prosa. Il file **nasce con la prima estrazione**, non prima: un file vuoto in attesa è un invito a riempirlo di intenzioni. ⚠️ Una riga rimandata è una riga scritta dopo guardando il risultato, cioè un censimento invece di una decisione registrata. | ☐ | **sì** |
| **25** | `CLAUDE.md`: la regola 6, la riga «L'app vive in un file solo», **e la regola 8** — che oggi nomina un solo file di testi condivisi mentre ne esistono due (`istruzioni-moduli.json` e `messaggi-feedback.json`). | ☐ | **sì** |
| **26** | Collaudo dopo lo spacchettamento. *«La suite verifica quello che qualcuno ha pensato di verificare, e un trasloco non è finito quando la suite è verde.»* | ☐ | — |

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

## Rinomine

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-06 · nomi decisi il 2026-09-08 | **La rinomina unica: cinque nomi in un lavoro solo.** `se* → storyCards*`, `srShuffle → shuffle`, `quickMatch* → match*`, `speedRound* → speedMatch*`, `flashcardLevelA → flashcard`, più gli id degli episodi `episode1 → gate` e `episode2 → aircraft-door`. **I nomi e le loro ragioni stanno in `docs/it/struttura-corso.md`, sezione «I nomi in codice»** — qui c'è la decisione di eseguirla, non i nomi. Segue il `kind`/id del modulo e lo strato in kebab (`speak-easy-*`, `quick-match-*`); **NON seguono le sigle di due lettere** (`qm-`, `sr-`, `fc*`), e questa è una decisione scritta, non una dimenticanza. | I nomi vecchi sono prefissi ereditati dal primo modulo che li ha introdotti, o nomi che mentono: `flashcardLevelA` si porta dentro il grado A mentre lo stesso descrittore gira sul grado B, e `se*` viene da «Speak Easy», un modulo che non esiste più — scritto per esteso in **54 punti** come `speak-easy-*`. **E la premessa da correggere: non è solo l'id dell'episodio a toccare i progressi salvati.** `se*` nomina due namespace del `localStorage` (`seDeclarations:`, `seExplanationStats:`), e i `kind`/id dei moduli sono le chiavi di `modules:`, `moduleOutcome:`, `audioSecondsSent:`, `nextLineSkips:` e `introDismissed:`. Quattro rinomine su cinque lasciano dati orfani, non una. | **Prima di un collaudo su profilo nuovo**, finché siamo gli unici utenti e non c'è niente da migrare. **Una rinomina per volta, suite completa fra una e l'altra**, dal più piccolo al più grande: `shuffle` → `flashcard` → `match*` → `speedMatch*` → `storyCards*` → gli id degli episodi. Così il primo rosso ha sempre il sospettato più piccolo possibile. Non va più insieme a Supabase. |

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
| 2026-09-07 | `docs/it/episodio-1.md`, nota 3, dice *«i numeri si scrivono in lettere perché è la parola che Voice Practice ascolta»*. **Oggi l'app non lo fa**: `slotOptions` normalizza un numero rendendo `it` ed `en` identici, quindi la battuta d7 in inglese dice «I'm 16 years old» con la cifra. | Stessa famiglia della riga sul fallback: **un'istruzione che descrive uno stato che non esiste.** Chi la legge crede che sia già così e non cerca il difetto. | **Quando si farà il magazzino** (punto ③ di «Cosa manca» in `docs/it/tabelle-personalizzazione.md`), che è ciò che la rende vera. |
| 2026-09-08 | **Le destinazioni sono due tabelle diverse, e quella che l'app usa è la vecchia.** `APP_CONFIG.places.destinations` ne ha **sei** (Cina, Giappone, Spagna, Francia, Germania, Irlanda); `docs/it/tabelle-personalizzazione.md` ne ha **undici**, e Spagna, Francia e Germania sono **uscite** — al loro posto India, Australia, Grecia, Norvegia, Croazia, Turchia, Scozia, Thailandia. Il magazzino è la fonte; `APP_CONFIG` è l'esecuzione, ed è indietro. | Chi legge `APP_CONFIG` per sapere quali destinazioni esistono prende la lista sbagliata, e non ha nessun modo di accorgersene: la tabella vecchia è perfettamente valida, solo superata. È la stessa forma della riga sul fallback e del nome tolto sopravvissuto in cinque file — un dato che descrive uno stato che non è più quello. | **Quando si farà il magazzino**, che è bloccato dal secondo campo per riga dei luoghi di partenza (città e paese sono una riga sola, mai due slot). Non prima: aggiornare solo le destinazioni lascerebbe le due tabelle disallineate in un altro punto. |
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
| 2026-09-08 | **Quando si costruisce un modulo nuovo, si chiede prima di completare quello che non è stato detto.** Se una parte del comportamento non è specificata — cosa scrive nella mastery, quando, cosa succede al giro di ripasso — non si inventa: si chiede. | È il momento in cui uno sbaglio non resta locale ma **si accumula**. Oggi tre scrittori della mastery si comportano diversamente perché nessuno ha mai chiesto *«e le parole?»* quando i moduli sono stati costruiti — e la prova che non è stata una scelta è che Voice Check, la verifica finale, calcola il dato per parola e lo butta, con un commento che dice solo *«unchanged from before the split»*. | **Va in `CLAUDE.md`**, come regola. **Non adesso**: quando ci arriveremo. |
| 2026-09-08 | **I colori scritti a metà modulo restano scritti subito, ma vanno PARCHEGGIATI: contano solo se il modulo viene completato.** Non si spostano alla fine. | Scrivere subito protegge chi chiude il browser: il lavoro fatto non si perde. Ma un modulo abbandonato a metà lascia oggi colori che pesano quanto quelli di un modulo finito, e non è la stessa cosa — chi esce dopo due risposte non ha fatto l'esercizio. Le due esigenze non sono in conflitto: si scrive subito **e** si tiene da parte, invece di scegliere fra perdere il dato e contarlo per buono. | **Da fissare.** Quando ci arriveremo, la domanda da farmi è come: dove vive il parcheggio, e cosa lo promuove. |

## CI rosse che non dicono cosa fare

*Stessa famiglia: la CI diventa rossa e chi la legge non sa se è rotta l'app o il
test. Vanno guardate in un giro solo — **dopo il collaudo**, sono mezza giornata.*

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | **`test_batch19.js` non ha un punto da correggere: ne ha diciannove.** Delle 28 attese fisse del file, **19 fanno da guardia a un'asserzione** — dopo l'attesa, e prima di qualunque altra azione, si legge uno stato e ci si asserisce sopra. **Due usano lo stesso identico schema**: `waitForTimeout(800)` con accanto il commento «feedbackPauseMs (600) then auto-advance», righe 104 (`[QM Task1]`) e 179 (`[SR Task1]`) — cioè 600 più un margine, sommati a mente. Restano vere anche le due cose registrate qui il 2026-09-07: il `.catch(() => {})` sul click di `#sr-ready-btn` che sopprime il fallimento dove nasce, e la `waitForTimeout(300)` ridondante subito dopo. | **La correzione di ieri era GIUSTA MA PARZIALE, e chi legge questa riga fra un mese deve sapere che il file è stato capito a metà.** Sistemava il punto che aveva fallito e lasciava in piedi diciotto punti della stessa identica forma, uno dei quali *identico carattere per carattere*. Il rosso in CI cadeva su una riga diversa a ogni corsa — 139 in una, 244 in un'altra — ed è il segno che si stava guardando un esemplare invece della specie. Una sonda locale su 8 giri non ha riprodotto il rosso: i due sospetti rimasti (la risposta giusta capitata sull'**ultima** domanda del passaggio, dove la «domanda successiva» non esiste; e un runner più lento del margine) **non sono dimostrati**. Quello che è dimostrato è la causa condivisa: **il test non controlla lo stato che misura.**<br><br>**2026-09-08 — RIPRODOTTO IN LOCALE, e non è raro: 2 giri rossi su 3**, sullo stesso codice, tutti su `[SR Task1]` (Speed Round). Il gemello `[QM Task1]` non cade più perché la sua asserzione è stata rifatta in `tests/test_match_practice_nonloso.js`, dove la situazione si **costruisce** invece di sperarci: lì non si risponde mai giusto sull'ultima domanda del passaggio. `[SR Task1]` ha il difetto identico e intatto: il ciclo tocca **sempre la prima opzione** fra quattro (una corretta e tre distrattori, `buildMultipleChoiceOptions`) e, se in tutto il giro non gliene capita una giusta, esce con `gotCorrect` falso — e l'asserzione dopo la `waitForTimeout(800)` legge uno stato che non è mai arrivato.<br><br>**E c'è la prova che serve al contatore delle asserzioni:** quando cade, il file ne esegue **39 invece di 40**. La quarantesima vive dentro il ramo `gotCorrect` e semplicemente non gira. Il verde/rosso lo dice perché due asserzioni falliscono; ma un ciclo che si esaurisce **senza** far fallire niente sparirebbe in silenzio, ed è esattamente il caso che il passo 0a esiste per vedere. | **Alla prossima apertura di quel file, e si riscrive tutto il gruppo, non il punto che ha fallito.** Il modello è già scritto e verde: `tests/test_match_practice_nonloso.js` porta la stessa asserzione di `[QM Task1]` aspettando *quello che il lavoro produce* (la domanda successiva a schermo) invece di 800 ms, e leggendo lo stato dentro la stessa chiamata che aspetta. |
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
| 2026-09-08 | `test_episodio2.js`: **il testo non è confrontato** con `docs/it/episodio-2.md`, solo i numeri e la coerenza degli id. Il limite aveva una scadenza scritta — «quando l'episodio 2 entrerà in `EPISODES`» — **e quel giorno è arrivato** (2026-09-08). | Estendere il confronto testuale vuol dire un secondo lettore di markdown: la fonte dell'episodio 2 ha una forma diversa da quella dell'episodio 1 (il grado A è una lista in prosa, il vocabolario in una sezione a parte). Due parser per due file che cambiano insieme una volta ogni tanto sono più fragili di quanto proteggano — la scadenza era arrivata, la ragione per non pagarla no. | **Al terzo episodio**, quando il secondo lettore servirà per due file e non per uno: allora è un investimento, oggi è manutenzione pura. |
| 2026-09-08 | `test_attendi.js`: il **terzo caso di `attendi.sh` non è coperto** — tempo scaduto, uscita 2. Sono coperte le due uscite di ogni giorno (0 e 1). Esercitato a mano il 2026-09-07. | Provarlo costerebbe al test esattamente l'attesa che deve misurare: il file diventerebbe il più lento della suite per un ramo che non si usa mai. La prova a mano vale finché il modo di contare il tempo resta quello di oggi. | **Alla prima modifica di `attendi.sh` che tocchi il timeout.** Da lì la prova a mano del 2026-09-07 non vale più, e o si copre o si rifà a mano dichiarandolo. |
| 2026-09-08 | `test_sblocco_sequenziale.js`: guarda il passo **bloccato**. Che il passo corrente funzioni è verificato solo quanto basta a non far passare il file su un'app in cui non funziona niente. | Il comportamento pieno dei due moduli sta in `test_story_modules.js` e `test_dialogo_extra.js`: **il limite è sicuro solo finché quei due lo coprono davvero.** È una dipendenza fra file che nessuno dei tre dichiara. | **Se uno dei due file citati smette di coprire il passo corrente** — o quando lo Sblocco Sequenziale prenderà una terza variante (regola 30), che nessuno dei tre file conosce. |
| 2026-09-08 | `test_episodi_corti.js`: si verifica che il passo **non si completi** e che lo studente veda qualcosa, non il **testo** dell'errore. | Stessa forma della riga qui sopra, stessa dipendenza taciuta: il testo è coperto da `test_errore_caricamento.js`. Se quel file cambia scopo, questo limite diventa un buco senza che niente lo dica. | **Se `test_errore_caricamento.js` smette di proteggere la schermata d'errore in sé.** |
| 2026-09-08 | `test_report_mastery.js`: il pannello **non mostra quante volte** una voce è stata scritta, e il test non lo verifica — perché quel dato non esiste (una voce è `{ level, streak }`). | Oggi è una constatazione, non una scelta: non si può verificare un dato che nessuno produce. Ma è scritto come un limite permanente, e non lo è. | **Quando una voce di mastery avrà un contatore** — cioè insieme alla riga «il dato si registra sul target» qui sopra. Da quel momento il limite è un buco, non una constatazione. |
| 2026-09-08 | `tests/ATTESE-FISSE.md`: le **asserzioni negative** (verificare che *non* sia successo niente) sono esentate dalla regola 19 e dalla conversione ad attesa di stato. | Per un evento che non deve accadere non esiste una condizione da aspettare: il modo di fallire è un verde generoso, non un rosso casuale. | **Questa non scade, ed è il caso raro in cui è giusto così.** Scadrebbe solo se l'app arrivasse ad avere un segnale di quiete — «ho finito tutto quello che avevo in coda» — su cui un'attesa negativa possa agganciarsi. Non è previsto e non è desiderato. Si rilegge comunque a ogni blocco di attese fisse convertito, per non allargarla per comodità. |
| 2026-09-08 | `test_interruttore_episodio.js`: si guarda **un modulo solo** (Meet the Story) per verificare che l'episodio scelto serva il proprio contenuto. | Quello che lega ogni modulo al file dati è il descrittore dell'episodio, una riga per modulo: un `dataFile` sbagliato su uno degli altri ventuno passa. Guardarli tutti e ventidue vorrebbe dire attraversare l'episodio intero a ogni giro di suite. | **Quando i descrittori smetteranno di ripetere lo stesso `dataFile` riga per riga** — se il file dell'episodio si dichiara una volta sola, il caso sparisce invece di essere coperto. |
| 2026-09-08 | `test_match_practice_nonloso.js`: si guarda **una direzione sola** (en→it). | Le due direzioni sono lo stesso componente e lo stesso `qmRenderQuestion`, quindi un difetto di quella riga le romperebbe entrambe. Una differenza che vivesse solo in it→en qui non si vedrebbe. | **Se le due direzioni smetteranno di condividere `qmRenderQuestion`** — cioè alla prima riga di codice che si comporta diversamente a seconda della direzione. |

## Pulizie rimandate di proposito

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-05 | La divergenza **off/seen** in `tests/module-order.js`: il file riscrive a mano la regola di `moduleStepId()` e conta le apparizioni in modo diverso dall'app. | Correggerla adesso significa mantenere due copie della stessa regola. | **Non si corregge: sparisce da sola** quando l'identità del passo sarà `modulo + grado`, perché non ci sarà più niente da contare. |
| 2026-09-06 | I testi dell'avviso microfono (`vcUpdateMicNotice`, titolo e corpo dei tre livelli) sono scritti nel codice invece che in `data/{lingua}/istruzioni-moduli.json`, insieme ad altre ~25 frasi già note nella stessa condizione. | Regola 8: se è testo che lo studente legge e non è contenuto dell'episodio, sta nel JSON. Sparsi nel codice non si possono correggere senza toccare `index.html`, e in una seconda edizione non si possono tradurre affatto. | **È un lavoro solo**, non venticinque: si fa quando ci arriveremo, tutto insieme. Spostarne una alla volta lascia il problema e raddoppia i posti dove cercare. |
| 2026-09-05 | I due blocchi `if (vcVariant === 'practice')` adiacenti in `vcEvaluate`, unibili in uno. | Pura leggibilità: il comportamento è corretto. Toccarlo adesso vorrebbe dire aprire `vcEvaluate` per niente. | **Alla prossima modifica di `vcEvaluate`**, insieme a un lavoro che quella funzione la apre comunque. |
