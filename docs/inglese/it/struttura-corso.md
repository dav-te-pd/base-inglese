# Struttura del corso

> **Materiale di partenza per Claude Code.** Da qui viene aggiornato **`data/inglese/it/struttura-corso.json`**, il file di struttura di questa edizione: sequenze dei moduli, nomi dei gradi, categorie, nomi dei moduli, elenco degli episodi, lingue del parlato.
>
> ⚠️ *Qui c'era scritto «le voci di `APP_CONFIG`», ed è stato vero fino al 2026-09-20 (passo 1.11b). Da allora la struttura del corso **non vive più in un valore globale unico**: vive in un file dell'edizione. I suoi valori tornano su `APP_CONFIG` a runtime — quindi il codice che li legge non è cambiato — ma **la fonte da aggiornare è il JSON**, e una decisione presa per l'inglese non governa più il francese in silenzio.*
>
> Vale per **tutto il corso di questa edizione**, non per un singolo episodio: il contenuto di un episodio sta in `docs/inglese/it/inglese-it-{id}.md` — oggi `inglese-it-gate.md` e `inglese-it-aircraft-door.md`.
>
> ⚠️ *Qui c'era scritto `docs/episodio-N.md`, cioè **la nomenclatura che la regola 4 vieta**: il numero è una posizione, e le posizioni si spostano. L'id no.*
>
> **Le istruzioni stanno in questo file, non nel messaggio.** Il messaggio è sempre della forma *"aggiorna leggendo `docs/inglese/it/struttura-corso.md`"*.

---

## Come si legge questo file

Ogni sezione corrisponde a una **chiave di `data/inglese/it/struttura-corso.json`**. Quando una sezione cambia, va riportata nella chiave corrispondente — **senza decidere nulla**: qui c'è già tutto.

**Le sette chiavi, e la sezione che le riempie:**

| Chiave del JSON | La sezione che la scrive |
|---|---|
| `grades` | I gradi di difficoltà |
| `gradeNames` | I gradi di difficoltà |
| `moduleTypes` | Le categorie dei moduli |
| `moduleLabels` | I nomi dei moduli |
| `sequences` | Le sequenze dei moduli |
| `episodes` | Gli episodi e la loro sequenza |
| `speech` | Le lingue del parlato |

⚠️ **L'app carica questo file PRIMA di disegnare qualunque schermata.** Se non arriva, non si vede una mappa a metà: si vede la schermata d'errore.

---

## I gradi di difficoltà

Quattro gradi, più A0 che sta prima dell'episodio 1 e non è ancora costruito.

La **lettera** è l'identificativo tecnico: si usa nel codice, nei dati e nel Pannello Admin. Il **nome** è quello che vede lo studente.

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Parole | Parole singole |
| B | Espressioni | Blocchi il cui significato non si ricava dalle singole parole |
| C | Frasi | Frasi, ricavate spezzando le battute |
| D | Dialogo | Le battute intere |

**Perché il nome serve.** La lettera non dice niente a chi usa l'app: senza, gli esercizi sembrano ripetersi senza motivo. Con il nome, lo studente sa che sta lavorando su cose diverse.

**Come si mostra:** accanto alla categoria, separato da un punto medio — *"Studio · Parole"*, *"Quiz · Frasi"*, *"Studio · Dialogo"*.

**Nel file di struttura:** `grades: ['A','B','C','D']` per il giro del Pannello Admin, e `gradeNames` per i nomi mostrati.

---

## Le categorie dei moduli

Sei categorie. Dicono allo studente **cosa lo aspetta**, non se verrà valutato: tutti i moduli registrano il risultato, sempre.

**La differenza tra studio e quiz non è la valutazione, è la pressione:** nello studio si va al proprio ritmo, nel quiz c'è il tempo o l'avanzamento automatico.

| Chiave | Etichetta | Moduli |
|---|---|---|
| `inizio` | Inizio | Your Story |
| `studio` | Studio | Meet the Story, Repeat Aloud, Why We Say It, Flash Card, Match Practice, Voice Practice |
| `dialogo` | Studia il dialogo | i tre Dialogue |
| `quiz` | Quiz | Speed Match, Voice Check |
| `test` | Verifica finale | Test (non ancora costruito) |
| `fine` | Fine | Modulo Finale, Download (non ancora costruiti) |

---

## Le sequenze dei moduli

**Una sequenza è una lista ordinata di coppie `{ module, grade }`**: la coppia dice quale modulo, e su quale grado lavora. Ogni sequenza ha un nome, e le sequenze stanno tutte insieme sotto `sequences` nel file di struttura.

**Il grado sta nella posizione, non nel modulo.** Così lo stesso modulo compare più volte con gradi diversi riusando un solo descrittore — Flash Card sul grado A e sul grado B è **una** riga di codice, non due.

⚠️ **QUI C'ERA SCRITTO «L'ordine è uno solo per tutto il corso… un episodio può sovrascriverlo, ma è l'eccezione». NON È PIÙ VERO, E NON È UN DETTAGLIO.**

*Non esiste più un ordine di default che qualcuno eredita in silenzio: `moduleOrderDefault` è stato tolto il 2026-09-08, perché un episodio corto avrebbe preso i ventidue passi narrativi senza che nessuno l'avesse deciso.* **Oggi ogni episodio dichiara la propria sequenza, sempre — anche il primo.**

### Le sequenze che esistono

| Nome | Passi | A cosa serve |
|---|---|---|
| `narrativo-standard` | 22 | La sequenza del corso: la tabella qui sotto |
| `prova-corta` | 5 | ⚠️ **Una SONDA, non contenuto.** Esiste solo per provare i due selettori del Pannello Admin: cinque passi contro ventidue, così la mappa si accorcia sotto gli occhi e «ha funzionato» si distingue da «sto guardando la versione vecchia». **Nessun episodio la dichiara**, quindi è inerte finché qualcuno non la sceglie dal pannello. Si toglie quando arrivano le sequenze vere |

**Un'eccezione non si dichiara come «narrativo-standard meno Flash Card»: chi fa eccezione scrive la sua sequenza per intero.** Una sottrazione si legge solo tenendo aperti due documenti, e quando la base cambia le eccezioni cambiano senza che nessuno le abbia toccate.

### `narrativo-standard` — 22 passaggi

| # | Modulo | Grado |
|---|---|---|
| 1 | `personalizzazione` — Your Story | — |
| 2 | `meetTheStory` — Meet the Story | D |
| 3 | `repeatAloud` — Repeat Aloud | A |
| 4 | `matchEngIta` — Match Practice `en→it` | A |
| 5 | `matchItaEng` — Match Practice `it→en` | A |
| 6 | `flashcardAEngIta` — Flash Card `en→it` | A |
| 7 | `flashcardAItaEng` — Flash Card `it→en` | A |
| 8 | `repeatAloud` — Repeat Aloud | B |
| 9 | `matchEngIta` — Match Practice `en→it` | B |
| 10 | `matchItaEng` — Match Practice `it→en` | B |
| 11 | `flashcardAEngIta` — Flash Card `en→it` | B |
| 12 | `voicePractice` — Voice Practice | B |
| 13 | `whyWeSayIt` — Why We Say It | D |
| 14 | `matchEngIta` — Match Practice `en→it` | C |
| 15 | `matchItaEng` — Match Practice `it→en` | C |
| 16 | `voicePractice` — Voice Practice | C |
| 17 | `dialogoAscoltaRipeti` — Dialogue: Listen & Repeat | D |
| 18 | `dialogoRipetiATempo` — Dialogue: Repeat in Time | D |
| 19 | `dialogoContinuo` — Dialogue: Real Dialogue | D |
| 20 | `speedMatchEngIta` — Speed Match `en→it` | C |
| 21 | `speedMatchItaEng` — Speed Match `it→en` | C |
| 22 | `voiceCoach` — Voice Check | C |

### La logica dell'ordine

**Meet the Story in seconda posizione**, perché è il primo contatto: si sente la storia prima di lavorarci sopra, con le traduzioni sempre visibili.

**Poi i gradi in progressione:** parole (A), espressioni (B), frasi (C), dialogo (D).

**Why We Say It al tredicesimo**, e non alla fine: le regole hanno senso quando si hanno già in mano i pezzi che governano — dopo parole ed espressioni, prima dei dialoghi. Spiegarle alla fine sarebbe tardi; spiegarle all'inizio sarebbe parlare di parole mai viste.

**Match prima di Flash Card:** Match verifica il riconoscimento, Flash Card è autovalutazione. Prima la misura, poi la dichiarazione.

**I quiz in fondo:** un quiz è la versione sotto pressione di qualcosa già fatto con calma. Ogni direzione presente in Speed Match deve essere stata esercitata prima in Match Practice.

---

## Gli episodi e la loro sequenza

Sotto `episodes`, una chiave per episodio, con dentro il nome della sequenza che quell'episodio chiede.

| Episodio | Sequenza |
|---|---|
| `gate` | `narrativo-standard` |
| `aircraft-door` | `narrativo-standard` |

⚠️ **LA DIREZIONE È QUESTA, E NON L'INVERSA: è l'EPISODIO che dichiara la sequenza, non la sequenza che elenca i suoi episodi.**

*Una sequenza non sa niente di chi la usa, e due episodi possono chiedere la stessa. Fosse il contrario, un episodio potrebbe comparire in due liste e nessuno se ne accorgerebbe.*

**Cosa vince, e non c'è una quarta possibilità:**

| L'episodio dichiara | Vale |
|---|---|
| solo `sequence` | quella sequenza |
| solo `moduleOrder` (l'ordine scritto per intero) | quell'ordine |
| **tutte e due** | **errore** — si dice, non si sceglie |
| **niente** | **errore** — nessun default implicito |

*Il caso «tutte e due» è l'unico che si potrebbe risolvere zitti scegliendone una, ed è per questo che non lo si fa: chi ha scritto entrambe crede che valga quella che sta guardando, e ha il 50% di probabilità di sbagliarsi per sempre.*

⚠️ **Questa tabella riguarda l'ordine dei MODULI DENTRO un episodio. L'ordine in cui gli EPISODI si incontrano è un'altra cosa, e oggi non è un dato**: è l'ordine in cui le chiavi sono scritte qui dentro, e nessuna riga di codice lo dichiara. La sua fonte è `docs/inglese/it/sequenza-episodi.md`.

---

## Le lingue del parlato

Due lingue, e sono due perché rispondono a due domande diverse.

| Chiave | Valore | Cosa decide |
|---|---|---|
| `speech.synthesisLang` | `en-US` | In che lingua l'app **parla** — la voce sintetica che legge le battute |
| `speech.recognitionLang` | `en-US` | In che lingua l'app **ascolta** — il riconoscimento del microfono in Voice Practice e Voice Check |

**Sono della lingua che si impara, non di chi studia**, e per questo stanno nel file dell'edizione: un corso di francese per italiani le vuole tutte e due `fr-FR`.

---

## I nomi dei moduli

Quello che lo studente legge sulla mappa e in testa al modulo. Due campi per ognuno — **nome** e **sottotitolo** — perché sono due cose separate e vanno modificabili separatamente.

| Chiave | Nome | Sottotitolo |
|---|---|---|
| `personalizzazione` | Your Story | Personalizza la tua storia |
| `meetTheStory` | Meet the Story | Ascolta la storia |
| `repeatAloud` | Repeat Aloud | Ripeti ad alta voce |
| `whyWeSayIt` | Why We Say It | Perché si dice così |
| `matchEngIta` | Match Practice en→it | Abbina le traduzioni |
| `matchItaEng` | Match Practice it→en | Abbina le traduzioni |
| `flashcardAEngIta` | Flash Card en→it | Ripassa quello che hai imparato |
| `flashcardAItaEng` | Flash Card it→en | Ripassa quello che hai imparato |
| `voicePractice` | Voice Practice | Allena la pronuncia |
| `dialogoAscoltaRipeti` | Dialogue: Listen & Repeat | Ascolta e ripeti |
| `dialogoRipetiATempo` | Dialogue: Repeat in Time | Ripeti a tempo |
| `dialogoContinuo` | Dialogue: Real Dialogue | Il dialogo vero |
| `speedMatchEngIta` | Speed Match en→it | Traduci a tempo |
| `speedMatchItaEng` | Speed Match it→en | Traduci a tempo |
| `voiceCoach` | Voice Check | Metti alla prova la pronuncia |

**I nomi dei moduli restano in inglese, i sottotitoli in italiano**, ed è una scelta: il nome è l'etichetta del modulo, il sottotitolo dice cosa ci si fa. *Sono qui, nel file dell'edizione, perché un'edizione tedesca vuole i suoi sottotitoli.*

---

## Le regole di esito

Un modulo produce un tipo di dato diverso a seconda di com'è fatto, e la regola discende dal dato.

| Regola | Dato prodotto | Moduli |
|---|---|---|
| `completionRules` | nessuno | Your Story, Meet the Story, Repeat Aloud |
| `selfAssessment` | una dichiarazione sul modulo intero | i tre Dialogue |
| `selfScoreRules` | % di autovalutazioni | Flash Card, Why We Say It |
| `moduleRules` | % di risposte verificate | Match Practice, Speed Match, Voice Practice, Voice Check, Test |

**Quale tentativo conta:** `lastAttempt` dove si può ritentare (Voice Practice), `firstAttempt` dove non si può — perché il giro di ripasso ripropone le voci sbagliate finché non escono giuste, e conterebbe sempre quasi 100%.

---

## I nomi in codice

*Decisi il 2026-09-08, **eseguiti il 2026-09-09**. Erano la «rinomina unica»
registrata in `docs/decisioni-storico.md`; adesso sono lo stato del codice.*

I nomi mostrati allo studente stanno in `CONFIG.moduleLabels` e non sono
cambiati. Questa sezione riguarda i nomi che si leggono solo nel codice — `kind`,
id dei moduli, funzioni — e che nel tempo avevano smesso di dire cosa nominavano.

| Si chiamava | Si chiama | Perché |
|---|---|---|
| `se*` | `storyCards*` | Il componente mostra le battute di un dialogo una sotto l'altra, come carte. **`cards` da solo si sarebbe confuso con Flash Card, che è un'altra cosa: le une si scorrono, l'altra si gira.** E *story* era già la parola che usiamo — Meet the Story, Your Story. Il nome vecchio veniva da "Speak Easy", un modulo che non esiste più. |
| `srShuffle` | `shuffle` | Mescola, e basta: nessun modulo poteva reclamarlo. Stesso caso di `srPlayTraguardoSound`, corretto prima — regola 18, un nome condiviso non porta il prefisso del primo modulo che l'ha introdotto. |
| `quickMatch*` | `match*` | È il nome che lo studente legge già (*Match Practice*), senza il suffisso della direzione. |
| `speedRound*` | `speedMatch*` | Idem (*Speed Match*). "Round" non diceva niente che "Match" non dicesse meglio. |
| `flashcardLevelA` | `flashcard` | Il grado vive nella coppia `{ module, grade }`, non nel `kind`: quel descrittore girava già sul grado A **e** sul grado B, quindi il nome mentiva. `flashcard` era anche il nome che tutto il resto del codice usava già. |
| `episode1`, `episode2` | `gate`, `aircraft-door` | Un numero è una posizione, e le posizioni si spostano. Un id descrittivo no. |

**E la prosa è seguita, in un passo suo (il 4-bis).** «Quick Match» e «Speed
Round» erano rimasti vivi in 22 file — commenti ed etichette dei test, cioè il
posto che si legge davvero — perché la verifica cercava la forma col trattino e
non quella con lo spazio. Da lì la regola sulle quattro forme in
`docs/decisioni-stato.md`.

### Cosa segue il nome, e cosa no

Un modulo porta il proprio nome su **tre strati**, e non si muovono tutti
insieme:

1. **il `kind` e l'id del modulo** — `matchEngIta`, `speedMatchItaEng`.
   Questi seguono sempre: sono la chiave con cui il modulo si nomina, e sono
   la stessa chiave che indicizza `data/inglese/it/istruzioni-moduli.json` e i
   progressi salvati.
2. **gli id e le classi in kebab** — `#view-match`, `#speed-match-badge`,
   `#story-cards-body`. Questi seguono, perché **scrivono il nome per esteso**:
   `speak-easy` in 54 punti era il nome di un modulo che non esisteva più,
   scritto a lettere.
3. **le abbreviazioni di due lettere — `qm-`, `sr-`, `fc*`. Queste NON
   seguono, ed è una decisione, non una dimenticanza.**

   **Ma la ragione non è che sono corte: è che accanto a loro esiste una forma
   lunga che segue al posto loro.** `qm-` stava accanto a `quickMatchEngIta`,
   diventato `matchEngIta`; `sr-` accanto a `speedRoundItaEng`, diventato
   `speedMatchItaEng`. Il nome del modulo si aggiorna comunque, in un posto che
   si legge; la sigla resta come scorciatoia interna e non promette niente a
   nessuno. Nessuno legge `#sr-options` e ne conclude "Speed Round". Farle
   seguire avrebbe triplicato il lavoro senza chiarire niente.

   **`se*` NON era in questa famiglia, e per questo ha seguito.** In JavaScript
   non esisteva nessun `speakEasyCardIndex` accanto a `seCardIndex`: **la sigla
   ERA il nome**, non la sua abbreviazione. Se non avesse seguito, la riga
   «`se*` → `storyCards*`» non avrebbe avuto nessun contenuto in JS, e il
   componente si chiamerebbe ancora con l'iniziale di un modulo che non esiste.

   **La prova, per chi fra sei mesi troverà `sr-` e si chiederà perché quella no
   e quella sì:** togli mentalmente la sigla e guarda cosa resta. Tolto `sr-`,
   il modulo si chiama ancora `speedMatchEngIta` e nessuno è confuso. Tolto
   `se*`, non restava niente: quel componente non aveva nessun altro nome in
   tutto il codice.

   *Stessa prova, stesso esito, per `srShuffle`:* ha seguito perché non era un
   elemento di Speed Match — è una funzione che usano sei moduli, e lì la sigla
   una promessa la faceva.

**Il prezzo di questa decisione, scritto perché non si scopra da solo:** oggi
`sr` non sta più per niente. È accettato. Chi trova `sr-` deve poter leggere qui
che è stato deciso, non dimenticato.

### Cosa cambia per chi studia

**Niente a schermo, ma i progressi salvati sono ripartiti da zero.** I `kind` e gli
id dei moduli sono le chiavi con cui i progressi vivono nel `localStorage`:
cambiarli non li sposta, li lascia orfani. Vale per quattro delle cinque
rinomine, non solo per gli id degli episodi.

Per questo la rinomina è stata fatta **finché eravamo gli unici utenti**, e prima
del collaudo su profilo nuovo — non dopo.

---

## Da aggiornare quando

- **Si aggiunge un modulo:** entra in `narrativo-standard` con il suo grado, nella categoria giusta, con la sua regola di esito — **e con il suo nome e sottotitolo** nella tabella dei nomi dei moduli
- **Si aggiunge un grado:** entra nella tabella dei gradi con il nome mostrato
- **Si cambia l'ordine:** si riscrive la tabella dei 22 passaggi di `narrativo-standard`
- **Si aggiunge una sequenza:** entra nella tabella delle sequenze **scritta per intero**, mai come sottrazione da un'altra
- **Si aggiunge un episodio:** entra nella tabella degli episodi con la sequenza che chiede — e nella sequenza degli episodi, che è un altro file
- **Si cambia la lingua parlata:** si cambiano le due voci di `speech`, e sono due

Poi una riga a Claude Code: *"aggiorna `data/inglese/it/struttura-corso.json` leggendo `docs/inglese/it/struttura-corso.md`"*.

*Qui c'era scritto «aggiorna `APP_CONFIG`»: dal 2026-09-20 (passo 1.11b) la struttura del corso
non sta più in `APP_CONFIG` ma nel file dell'edizione — i suoi valori tornano su `APP_CONFIG` a
runtime, ma la FONTE da aggiornare è il JSON.*
