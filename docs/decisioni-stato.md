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

# LA STRADA, IN QUATTRO TAPPE

Lo spartiacque è **Supabase**, e il criterio per collocare un passo **non è
l'importanza: è cosa diventa più difficile se lo si fa dopo.**

## ① PRIMA DI SUPABASE — pulire e ordinare

*Tutto quello che rende il codice misurabile. Farlo dopo significherebbe
lavorare su una base che non si può misurare.*

| | Passo | Perché adesso |
|---|---|---|
| **1.1** | **Il CSS esce da `index.html` in file separati** | È il **70%** del file. Prima si separa, poi si può chiedere «cosa serve a questa schermata» — l'ordine opposto decide i confini senza poterli misurare |
| **1.2** | **Righe vuote e commenti scaduti di `index.html`** | Misurato: **424 righe vuote**, **72 commenti HTML**, **109 righe di commento nel CSS**, molti su codice che non c'è più |
| **1.3** | **Passo 18 — le stringhe del markup** | ⚠️ **Da RICONTARE prima: non sono mai state contate.** Il numero su cui si pianificava non esiste |
| **1.4** | **Passo 24 — `componenti-condivisi.md` e `componenti-singoli.md`** | La mappa di cosa è condiviso. Serve prima di aggiungere moduli nuovi, non dopo |
| **1.5** | **Passo 25 — la regola 8 di `CLAUDE.md`** | Le prime due parti sono fatte; resta la terza |
| **1.6** | **Passo 13 — le cinque righe della mastery** | Blocco a sé, già delimitato |
| **1.7** | **L'astrazione della fonte + C2** | `app/fonte.js`: l'unico file che sa DOVE stanno i dati. ⚠️ **Fatta prima, Supabase è un lavoro in UN file invece che in 101 punti** |
| **1.8** | **Le tabelle di personalizzazione escono da `APP_CONFIG`** | Vanno sotto `data/{lingua}/` come il resto dell'edizione (regola 4) |
| **1.9** | **I quattro `fetch` di `app/dati.js` prendono il `?v=`** | Oggi solo i 23 tag `<script>` ce l'hanno: i file di dati possono restare in cache vecchi |
| **1.10** | **Il giro dei buchi** | ⚠️ **Non è un riassunto: è una ricerca di cosa non è in nessuna lista.** Si fa quando la lista smette di cambiare, cioè alla fine di questa tappa |
| **1.12** | **La CATENA DI VALIDAZIONE delle edizioni — CINQUE, due episodi ciascuna** | ⚠️ **È il collaudo che dice se il modello delle edizioni regge**, e va fatto prima di Supabase. Si fa **una per volta, in quest'ordine**, e ognuna parte solo quando la precedente funziona: **① `francese/it`** mette alla prova il modello · **② `it/francese`** ⚠️ **è la sola che prova la SECONDA metà della coppia** — uno studente non italiano — e da sola vale più delle altre tre messe insieme · **③ `tedesco/it`** che la prima non fosse un caso · **④ `spagnolo/it`** che il costo scenda invece di restare uguale · **⑤ `it/spagnolo`** che anche il rovescio si ripeta. *Se la quarta costa quanto la prima, il modello non regge e si vede lì.* Il contenuto lo scrive chi guida il progetto, in `docs/{lingua}/{studente}/` (regole 26 e 33), corretto davvero — un contenuto finto non farebbe vedere gli errori. ⚠️ **IL COSTO DELLE DUE ROVESCIATE VA DETTO:** in `it/francese` le spiegazioni si scrivono **in francese**, non in italiano, ed è un lavoro di natura diversa dal tradurre un dialogo. *Se l'energia dovesse finire, la ② è quella da non saltare e la ④ quella da saltare.* |

⚠️ **UNA COSA CHE IL PASSO 1.11 HA APERTO, e va decisa prima di Supabase:
l'app non disegna NIENTE finché `struttura-corso.json` non arriva.** Oggi è
un file statico sulla stessa origine, quindi si parla di millisecondi e non
si vede. **Con i dati sul server no**: su una rete lenta resterebbe una
pagina vuota senza spiegazione, che è la forma del guasto muto. Serve una
schermata di attesa — non la si inventa adesso perché oggi non c'è niente da
attendere abbastanza a lungo da poterla provare.

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
| **Le cose del Pannello Admin** | tappa ③, sotto la tabella | I due campi dell'edizione da bloccare e la vista di tutte le sequenze. **Stanno lì e non qui** perché si chiudono tutte insieme al passo 3.5, quando il pannello viene rifatto |

⚠️ **E una cosa che NON è piccola e sta qui solo perché è già registrata:
`srPulizia` ha mostrato che il magazzino di `stopAllModuleActivity` non ha più
un contenuto fisso — ha quello dei file caricati.** Oggi non cambia niente
perché i 23 tag si caricano tutti al boot. **Dal giorno in cui un modulo si
caricherà su richiesta, una pulizia non registrata è una pulizia che non gira.**
Condizione: quando nasce il caricamento a richiesta.

---

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
