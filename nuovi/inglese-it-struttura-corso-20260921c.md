**Versione: 20260921c**

# Struttura del corso — inglese per italiani

> **Fonte per `data/inglese/it/inglese-it-struttura-corso.json`.** *Claude Code trascrive, non decide.*
>
> **Le istruzioni stanno qui, non nel messaggio.** Il messaggio è sempre:
> *«aggiorna leggendo l'ultima versione di `inglese-it-struttura-corso` in `docs/inglese/it/`»*.
>
> ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola master 1.5).

---

## 1 — IL FILE DI STRUTTURA

**STRUTTURA-CORSO_001** · La struttura del corso vive in **`data/inglese/it/inglese-it-struttura-corso.json`**,
un file per edizione. *Una decisione presa per l'inglese non governa il francese.*

**STRUTTURA-CORSO_002** · Il JSON ha **sette chiavi**, e ogni sezione di questo file ne riempie una:

| Chiave | Sezione |
|---|---|
| `grades`, `gradeNames` | 2 — I gradi |
| `moduleTypes` | 3 — Le categorie |
| `moduleLabels` | 4 — I nomi dei moduli |
| `sequences` | 6 — Le sequenze dei moduli |
| `episodes` | 7 — Gli episodi |
| `speech` | 8 — Le lingue del parlato |

**STRUTTURA-CORSO_003** · ⚠️ **L'app carica questo JSON prima di disegnare qualunque schermata.** Se
non arriva, si vede la schermata d'errore — non una mappa a metà.

---

## 2 — I GRADI

**STRUTTURA-CORSO_004** · Quattro gradi. La **lettera** è l'identificativo tecnico (codice, dati,
Pannello Admin). Il **nome** è quello che vede lo studente.

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Parole | parole singole |
| B | Espressioni | blocchi il cui significato non si ricava dalle singole parole |
| C | Frasi | frasi, ricavate spezzando le battute |
| D | Dialogo | le battute intere |

**STRUTTURA-CORSO_005** · Il nome si mostra accanto alla categoria, separato da un punto medio:
*«Studio · Parole»*, *«Quiz · Frasi»*.

**STRUTTURA-CORSO_006** · *Perché il nome serve:* **la lettera non dice niente a chi usa l'app** —
senza, gli esercizi sembrano ripetersi senza motivo.

---

## 3 — LE CATEGORIE DEI MODULI

**STRUTTURA-CORSO_007** · Sei categorie. Dicono allo studente **cosa lo aspetta**, non se verrà
valutato: **tutti i moduli registrano il risultato, sempre**.

**STRUTTURA-CORSO_008** · **La differenza fra studio e quiz non è la valutazione: è la
pressione.** Nello studio si va al proprio ritmo, nel quiz c'è il tempo o l'avanzamento
automatico.

| Chiave | Etichetta | Moduli |
|---|---|---|
| `inizio` | Inizio | Your Story |
| `studio` | Studio | Meet the Story, Repeat Aloud, Why We Say It, Flash Card, Match Practice, Voice Practice |
| `dialogo` | Studia il dialogo | i tre Dialogue |
| `quiz` | Quiz | Speed Match, Voice Check |
| `test` | Verifica finale | Test — **non ancora costruito** |
| `fine` | Fine | Modulo Finale, Download — **non ancora costruiti** |

---

## 4 — I NOMI DEI MODULI

**STRUTTURA-CORSO_009** · Ogni modulo ha **nome** e **sottotitolo**, modificabili separatamente.

**STRUTTURA-CORSO_010** · **I nomi restano in inglese, i sottotitoli nella lingua dello studente.**
*Il nome è l'etichetta del modulo; il sottotitolo dice cosa ci si fa — e un'edizione tedesca
vuole i suoi.*

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

---

## 5 — LE REGOLE DI ESITO

**STRUTTURA-CORSO_011** · Un modulo produce un tipo di dato diverso a seconda di com'è fatto, **e
la regola discende dal dato**.

| Regola | Dato prodotto | Moduli |
|---|---|---|
| `completionRules` | nessuno | Your Story, Meet the Story, Repeat Aloud |
| `selfAssessment` | una dichiarazione sul modulo intero | i tre Dialogue |
| `selfScoreRules` | % di autovalutazioni | Flash Card, Why We Say It |
| `moduleRules` | % di risposte verificate | Match Practice, Speed Match, Voice Practice, Voice Check, Test |

**STRUTTURA-CORSO_012** · **Quale tentativo conta:** `lastAttempt` dove si può ritentare (Voice
Practice), `firstAttempt` dove non si può.

**STRUTTURA-CORSO_013** · *La ragione:* **il giro di ripasso ripropone le voci sbagliate finchè non
escono giuste** — con `lastAttempt` conterebbe sempre quasi 100%.

---

## 6 — LE SEQUENZE DEI MODULI

**STRUTTURA-CORSO_014** · «Sequenza» nomina **due cose diverse**, e vanno tenute distinte:

| | Cosa ordina | Dove vive |
|---|---|---|
| **sequenza dei moduli** | i moduli dentro un episodio | `sequences` in questo JSON |
| **sequenza degli episodi** | gli episodi dentro un'edizione | `inglese-it-sequenza-episodi.md` |

**STRUTTURA-CORSO_015** · Una sequenza dei moduli è **una lista ordinata di coppie
`{ module, grade }`** — quale modulo, e su quale grado lavora.

**STRUTTURA-CORSO_016** · **Il grado sta nella posizione, non nel modulo.** *Lo stesso modulo
compare più volte con gradi diversi riusando un solo descrittore.*

**STRUTTURA-CORSO_017** · ⚠️ **I passi delle sequenze stanno solo nel JSON, e si modificano
LI'.** Precisamente: `data/inglese/it/inglese-it-struttura-corso.json`, chiave **`sequences`**, una voce per
nome di sequenza, ognuna una lista di coppie `{ "module": "...", "grade": "..." }` nell'ordine in
cui si incontrano. *Qui non vanno elencati: due elenchi sugli stessi passi divergono al primo
riordino, e questo file perderebbe in silenzio.*

**STRUTTURA-CORSO_017-bis** · ⚠️ **IL PANNELLO ADMIN NON È IL POSTO DOVE SI MODIFICANO, E VA
SAPUTO PRIMA DI PROVARCI.** Il pannello sa riordinare i passi, cambiare grado e accendere o
spegnere un modulo — **ma scrive in `localStorage`, cioè in quel browser soltanto.** La modifica
non arriva mai al JSON, non la vede nessun altro, e **sparisce svuotando i dati del sito**. E
crearne una nuova il pannello non lo sa fare affatto.

*Serve a **provare** una sequenza diversa prima di deciderla, non a deciderla.* **Deciso il
2026-09-21 che non si farà il lavoro per renderlo definitivo:** *«queste cose si modificano
talmente tante volte che è uno spreco creare la possibilità di modifica dal pannello; è molto più
facile passare dal file»*.

**STRUTTURA-CORSO_018** · **Una sequenza si può cambiare quando serve** — aggiungere un modulo,
toglierlo, riordinarlo. *L'uniformità aiuta lo studio, ma non è un vincolo.*

**STRUTTURA-CORSO_019** · ⚠️ **Un'eccezione si scrive per intero, mai come sottrazione da un'altra
sequenza.** *«narrativo-standard meno Flash Card» si legge solo tenendo aperti due documenti — e
quando la base cambia, l'eccezione cambia senza che nessuno l'abbia toccata.*

### Le sequenze che esistono

| Nome | Passi | A cosa serve |
|---|---|---|
| `narrativo-standard` | 22 | la sequenza degli episodi narrativi |
| `prova-corta` | 5 | ⚠️ **una sonda, non contenuto** — serve a provare i selettori del Pannello Admin. **Nessun episodio la dichiara.** Si toglie quando arrivano le sequenze vere |

### Come si costruisce una sequenza — i principi dell'ordine

*Ogni principio dice cosa deve essere vero; la riga «oggi» dice dove lo è. **Se un esempio diventa
falso, è il principio che viene violato.***

**STRUTTURA-CORSO_020** · **Il primo contatto con la storia viene prima di lavorarci sopra.**
→ *oggi: Meet the Story, subito dopo Your Story*

**STRUTTURA-CORSO_021** · **I gradi vanno in progressione:** parole, espressioni, frasi, dialogo.

**STRUTTURA-CORSO_022** · **Le regole si spiegano dopo i pezzi che governano, prima di usarle in un
dialogo.**
→ *oggi: Why We Say It dopo il grado B, prima dei tre Dialogue*

**STRUTTURA-CORSO_023** · **Prima la misura, poi la dichiarazione.**
→ *oggi: Match Practice prima di Flash Card*

**STRUTTURA-CORSO_024** · **Un quiz viene dopo la versione calma dello stesso esercizio.**
→ *oggi: Speed Match dopo Match Practice*

**STRUTTURA-CORSO_025** · ⚠️ **Ogni direzione presente in un quiz deve essere stata esercitata
prima con calma.**

---

## 7 — GLI EPISODI

**STRUTTURA-CORSO_026** · Ogni episodio ha una **categoria**: **`storia`**, **`grammatica`**,
**`pronuncia`**. *La categoria dice **cosa contiene** l'episodio; la sequenza dice **in che ordine si
fanno i suoi moduli** — e un episodio di `grammatica` può chiedere `narrativo-standard`.*

**STRUTTURA-CORSO_027** · ⚠️ **La categoria non dice dove sta l'episodio: dice cosa contiene.** *Un
grammaticale può stare all'inizio, in mezzo, o dopo il decimo — sta dove serve.*

**STRUTTURA-CORSO_028** · *A cosa serve la categoria:* **lo studente sa cosa lo aspetta** guardando
la mappa — come studio e quiz per i moduli. *E a noi dice **quali moduli servono** per scriverlo.*

**STRUTTURA-CORSO_029** · ⚠️ **E' l'episodio che dichiara la sequenza, non la sequenza che elenca i
suoi episodi.** *Una sequenza non sa chi la usa, e due episodi possono chiedere la stessa.*

| Episodio | Nome | Categoria | Sequenza |
|---|---|---|---|
| `gate` | Al gate | `storia` | `narrativo-standard` |
| `aircraft-door` | Sulla porta dell'aereo | `storia` | `narrativo-standard` |

**STRUTTURA-CORSO_030** · **Cosa vince, e non c'è una quarta possibilità:**

| L'episodio dichiara | Vale |
|---|---|
| solo `sequence` | quella sequenza |
| solo `moduleOrder` (ordine scritto per intero) | quell'ordine |
| **tutte e due** | **errore** — si dice, non si sceglie |
| **niente** | **errore** — nessun default implicito |

**STRUTTURA-CORSO_031** · ⚠️ **Lo studente legge solo il NOME dell'episodio** — *«Al gate», «Sulla
porta dell'aereo».* **Mai l'id, mai il nome del file, mai «Episodio 1».**

**STRUTTURA-CORSO_032** · Il badge in mappa mostra il **nome dell'episodio**, e il nome vive **qui**, in
`episodes.<id>.nome` — ⚠️ *non nel file episodio: la mappa disegna il badge **senza caricare il file
episodio**, e questo file arriva prima di qualunque schermata.*

---

## 8 — LE LINGUE DEL PARLATO

**STRUTTURA-CORSO_033** · Due lingue, perché rispondono a due domande diverse:

| Chiave | Valore | Cosa decide |
|---|---|---|
| `speech.synthesisLang` | `en-US` | in che lingua l'app **parla** |
| `speech.recognitionLang` | `en-US` | in che lingua l'app **ascolta** |

**STRUTTURA-CORSO_034** · Il valore è **il codice di una voce**: lingua + paese — `en-US`
inglese americano, `en-GB` britannico, `fr-FR` francese di Francia. *Decide **con che voce l'app
legge le frasi** e **in che lingua riconosce lo studente mentre parla**.* **E' sempre la lingua che
si impara** — la lingua dello studente serve alle traduzioni, non alla voce.

---

## 9 — DA AGGIORNARE QUANDO

**STRUTTURA-CORSO_035** · **Si aggiunge un modulo** → categoria, regola di esito, nome e
sottotitolo qui; **la sua posizione nelle sequenze dentro `sequences`**, nel JSON.

**STRUTTURA-CORSO_036** · **Si aggiunge un grado** → nella tabella dei gradi col nome mostrato.

**STRUTTURA-CORSO_037** · **Si aggiunge una sequenza** → una chiave nuova dentro `sequences`,
nel JSON, **scritta per intero**; qui solo la riga nella tabella «Le sequenze che esistono».

**STRUTTURA-CORSO_038** · **Si aggiunge un episodio** → nella tabella degli episodi con la sequenza
che chiede, e nella sequenza degli episodi.

**STRUTTURA-CORSO_039** · **Si cambia la lingua parlata** → le due voci di `speech`, e sono due.

---

## 10 — PER UN'EDIZIONE NUOVA

**STRUTTURA-CORSO_040** · Ogni edizione ha il suo file — `docs/{lingua}/{studente}/{lingua}-{studente}-struttura-corso.md` — e il suo JSON.

**STRUTTURA-CORSO_041** · *Cosa cambia:* **le direzioni** (`en→it` diventa `fr→it`), **i
sottotitoli**, **le lingue del parlato**, **e le sequenze se la coppia di lingue lo richiede**.

**STRUTTURA-CORSO_042** · *Cosa non cambia:* **i gradi, le categorie, le regole di esito, i
principi dell'ordine.** *Sono del metodo, non della lingua.*
