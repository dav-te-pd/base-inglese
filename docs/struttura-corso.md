# Struttura del corso

> **Materiale di partenza per Claude Code.** Da qui vengono aggiornate le voci di `APP_CONFIG` che riguardano la struttura del corso: ordine dei moduli, nomi dei gradi, categorie.
>
> Vale per **tutto il corso**, non per un singolo episodio: il contenuto di un episodio sta in `docs/episodio-N.md`.
>
> **Le istruzioni stanno in questo file, non nel messaggio.** Il messaggio è sempre della forma *"aggiorna leggendo docs/struttura-corso.md"*.

---

## Come si legge questo file

Ogni sezione corrisponde a una voce di `APP_CONFIG`. Quando una sezione cambia, va riportata nella voce corrispondente — **senza decidere nulla**: qui c'è già tutto.

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

**In `APP_CONFIG`:** `grades: ['A','B','C','D']` per il giro del Pannello Admin, più i nomi mostrati in una voce dedicata.

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

## L'ordine dei moduli — globale

**L'ordine è uno solo per tutto il corso**, non per episodio: con venti episodi, un ordine per episodio significherebbe riordinarli venti volte. Un episodio può sovrascriverlo, ma è l'eccezione.

**Il grado sta nella posizione, non nel modulo.** Ogni voce è una coppia `{ module, grade }`. Così lo stesso modulo compare più volte con gradi diversi riusando un solo descrittore.

### Ordine attuale — 22 passaggi

| # | Modulo | Grado |
|---|---|---|
| 1 | `personalizzazione` — Your Story | — |
| 2 | `meetTheStory` — Meet the Story | D |
| 3 | `repeatAloud` — Repeat Aloud | A |
| 4 | `quickMatchEngIta` — Match Practice `en→it` | A |
| 5 | `quickMatchItaEng` — Match Practice `it→en` | A |
| 6 | `flashcardAEngIta` — Flash Card `en→it` | A |
| 7 | `flashcardAItaEng` — Flash Card `it→en` | A |
| 8 | `repeatAloud` — Repeat Aloud | B |
| 9 | `quickMatchEngIta` — Match Practice `en→it` | B |
| 10 | `quickMatchItaEng` — Match Practice `it→en` | B |
| 11 | `flashcardAEngIta` — Flash Card `en→it` | B |
| 12 | `voicePractice` — Voice Practice | B |
| 13 | `whyWeSayIt` — Why We Say It | D |
| 14 | `quickMatchEngIta` — Match Practice `en→it` | C |
| 15 | `quickMatchItaEng` — Match Practice `it→en` | C |
| 16 | `voicePractice` — Voice Practice | C |
| 17 | `dialogoAscoltaRipeti` — Dialogue: Listen & Repeat | D |
| 18 | `dialogoRipetiATempo` — Dialogue: Repeat in Time | D |
| 19 | `dialogoContinuo` — Dialogue: Real Dialogue | D |
| 20 | `speedRoundEngIta` — Speed Match `en→it` | C |
| 21 | `speedRoundItaEng` — Speed Match `it→en` | C |
| 22 | `voiceCoach` — Voice Check | C |

### La logica dell'ordine

**Meet the Story in seconda posizione**, perché è il primo contatto: si sente la storia prima di lavorarci sopra, con le traduzioni sempre visibili.

**Poi i gradi in progressione:** parole (A), espressioni (B), frasi (C), dialogo (D).

**Why We Say It al tredicesimo**, e non alla fine: le regole hanno senso quando si hanno già in mano i pezzi che governano — dopo parole ed espressioni, prima dei dialoghi. Spiegarle alla fine sarebbe tardi; spiegarle all'inizio sarebbe parlare di parole mai viste.

**Match prima di Flash Card:** Match verifica il riconoscimento, Flash Card è autovalutazione. Prima la misura, poi la dichiarazione.

**I quiz in fondo:** un quiz è la versione sotto pressione di qualcosa già fatto con calma. Ogni direzione presente in Speed Match deve essere stata esercitata prima in Match Practice.

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

## Da aggiornare quando

- **Si aggiunge un modulo:** entra nell'ordine con il suo grado, nella categoria giusta, con la sua regola di esito
- **Si aggiunge un grado:** entra nella tabella dei gradi con il nome mostrato
- **Si cambia l'ordine:** si riscrive la tabella dei 22 passaggi

Poi una riga a Claude Code: *"aggiorna `APP_CONFIG` leggendo `docs/struttura-corso.md`"*.
