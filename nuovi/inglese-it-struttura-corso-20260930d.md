**Versione: 20260930d**

# Struttura del corso — inglese per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-struttura-corso.json`.** Le ragioni, le decisioni e quello che è aperto
stanno nei file RAGIONI e non qui.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_struttura_corso.js`, 2026-09-23

**Il lettore è la funzione `tabellaSotto(testo, titolo)`, e fa tre cose. Tutte e tre decidono come va
scritto questo file.**

**Cerca il titolo per TESTO ESATTO, e il NUMERO è dentro il testo.** `testo.indexOf(titolo)` —
sottostringa, sensibile a maiuscole e accenti.

**I SEI titoli cercati sono `##` più uno spazio più il testo di questa colonna**, carattere per
carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | `moduleTypes` |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `5 — LE SEQUENZE DEI MODULI` | `sequences` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA, e non è pedanteria.** Se questa tabella scrivesse i titoli
per intero, `indexOf` troverebbe **questa riga** invece della sezione vera — e il parser leggerebbe come
«tabella dei gradi» il resto di questa tabella, senza lamentarsi.

## 🔴 IL 30 SETTEMBRE È SUCCESSO DAVVERO, SCRIVENDO LA CORREZIONE QUI SOTTO

**Una nota di questa stessa sezione conteneva il titolo della sezione 5 PER INTERO, cancelletti
compresi.** *Il
trascrittore ha trovato quella riga invece della sezione vera e ha scritto un corso **senza nessuna
sequenza**: ogni episodio sulla schermata d'errore.*

| | |
|---|---|
| **Non si è fermato** | 🔴 **e i test sarebbero rimasti verdi** |
| **Come se n'è accorto Claude Code** | *il JSON aveva **113 righe in meno*** |

> ⭐ **L'avviso c'era, in questa pagina, tre righe sopra il punto in cui è stato violato.**
> **Un avviso non è un controllo.**

🔴 **E la prova migliore è che è successo DUE VOLTE: la prima stesura di questa correzione conteneva il
titolo altre due volte** — *una nel testo che racconta il difetto, una nell'esempio del comando.*

⭐ **Non si riesce a scrivere di questa trappola senza caderci.** *Ed è esattamente il motivo per cui non
può restare una regola da ricordare: deve essere un test che fallisce.*

⚠️ **E LA PROVA CHE C'ERA NON POTEVA TROVARLO.** *Diceva: «`grep -c '^## 2'` deve dare 1».* 🔴 **Quel
`^` àncora a inizio riga, e `indexOf` non sa cosa sia una riga:** *l'occorrenza colpevole stava **dentro
una cella di tabella**, a metà riga, e il grep la saltava.*

**La prova giusta conta la stringa OVUNQUE:**

```
for T in "${TITOLI[@]}"; do  grep -o "$T" <file> | wc -l  ; done    →  ogni riga deve dare 1
```

*(l'esempio usa una variabile apposta: **scrivere il titolo qui dentro sarebbe il difetto stesso**)*

*E vale per tutti e sei i titoli letti.* ⭐ **Meglio ancora: è un test, non un comando che qualcuno si
deve ricordare** — *`R4`, un controllo che non può controllare deve fallire.*

⚠️ **Il trattino è un trattone `—` (U+2014) con uno spazio prima e uno dopo.** Un trattino normale `-`
non viene trovato, e il test non dice «trattino sbagliato»: dice «Titolo non trovato».

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** È il motivo per cui **qui il 6 non esiste**: la sezione
che lo portava è passata in RAGIONI, e chiudere il buco tirando indietro il 7 farebbe fallire tre
asserzioni. *Il buco non è un difetto: è il segno visibile che quei numeri sono un'interfaccia.*

🔴 **CORRETTO IL 2026-09-30, E PER DUE GIORNI QUESTE DUE RIGHE HANNO DETTO IL FALSO.** *Dicevano «il 5
e il 6 non esistono» e «i cinque titoli cercati».*

| Cosa diceva | Cosa è vero | Chi l'ha misurato |
|---|---|---|
| *«il 5 non esiste»* | 🔴 **il 5 esiste** — `5 — LE SEQUENZE DEI MODULI` | **Claude Code**: *`trascrivi.js:195` e `tests/test_struttura_corso.js:220` lo cercano* |
| *«cinque titoli»* | ⭐ **sono sei** | *idem* |

⚠️ **E l'errore non era innocuo:** *una sezione letta davvero, che l'indice dichiarava inesistente,
sarebbe stata la prima candidata a essere spostata o rinumerata da qualcuno che si fidava di questa
riga.*

**Prende la PRIMA tabella dopo il titolo, e ignora tutto quello che c'è in mezzo.** Righe di prosa,
avvisi, sottotitoli: saltati, purché non comincino con `|`. La tabella finisce alla prima riga **non
vuota** che non comincia con `|` — **una riga vuota dentro la tabella non la chiude.**

**Legge le colonne PER POSIZIONE, mai per nome.** `r[0]`, `r[1]`, `r[2]`, `r[3]`. **L'intestazione della
tabella non viene mai letta**: le sue parole sono libere, **l'ordine delle colonne no**. Serve almeno una
riga oltre all'intestazione, altrimenti il test esplode invece di diventare rosso.

⚠️ **I backtick si tolgono in alcune colonne e in altre NO**, e la differenza si vede solo qui:

| Dove | I backtick |
|---|---|
| id di categoria, modulo, episodio · categoria · sequenza · chiavi del parlato | **tolti** — scriverli o no è uguale |
| **lettera del grado**, **nome del grado**, **nome e sottotitolo del modulo**, **nome dell'episodio** | **NON tolti** — un backtick di troppo è una differenza |

**Nome e sottotitolo di un modulo, e il nome di un episodio, si confrontano carattere per carattere,
accenti compresi.** *Il 2026-09-21 «Perché si dice così» scritto con gli apostrofi è passato
inosservato: è testo che legge lo studente.*

**L'ordine delle righe conta in tre sezioni su SEI:**

| Sezione | L'ordine delle righe |
|---|---|
| `2 — I GRADI` | **è** l'ordine di `grades` |
| `3 — LE CATEGORIE DEI MODULI` | **è** l'ordine delle chiavi di `moduleTypes` |
| `7 — GLI EPISODI` | **è** l'ordine degli episodi del corso — **spostare un episodio è spostare questa riga** |
| `4 — I NOMI DEI MODULI` | non conta: è un elenco a chiave, nessuno lo scorre |
| `8 — LE LINGUE DEL PARLATO` | non conta |

### ② ⚠️ UNA COLONNA NUOVA NELLA SEZIONE 4, IL 2026-09-28 — E VA IN FONDO

**La sezione 4 guadagna una quarta colonna: `categoria`**, cioè a quale delle sei categorie della
sezione 3 appartiene ciascun modulo.

🔴 **Fino a ieri quel legame non era scritto da nessuna parte.** *La sezione 3 elenca le sei categorie,
la sezione 4 i quindici moduli, e quale modulo stia in quale categoria lo sapeva solo il codice.*
**Era il quarto testo senza fonte**, dopo `generalRule`, le etichette degli slot e le istruzioni dei
moduli — *e si chiude con quindici celle.*

⚠️ **VA IN FONDO, E NON È INDIFFERENTE:** *il parser legge per posizione, quindi metterla in mezzo
romperebbe tutto; metterla in fondo non rompe niente*, **e il file poteva aspettare il trascrittore senza
diventare rosso.**

🔴 **CORRETTO IL 30/09: qui c'era scritto «una quarta colonna NON viene letta finché `trascrivi.js` non
impara a leggerla».** *Era vero il 27 settembre e falso dal 28: il passo C gliel'ha insegnato.* ⭐ **Oggi
la `categoria` si legge**, quindici celle su quindici.

⭐ **E questa colonna sblocca un controllo che prima non si poteva nemmeno formulare:**
*`studioCompleteMessages` parla di «ascolto ripetuto ad alta voce», ma la categoria `studio` contiene
otto moduli e in quattro non si apre bocca.* **Senza sapere quale famiglia di messaggi serve quale
modulo, i 141 messaggi di esito non sono controllabili.**

---

## 2 — I GRADI

*Colonne, nell'ordine: **lettera** → `grades` e chiave di `gradeNames` · **nome mostrato** → valore di
`gradeNames`. La terza colonna non viene letta.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Parole | parole singole |
| B | Espressioni | blocchi il cui significato non si ricava dalle singole parole |
| C | Frasi | frasi, ricavate spezzando le battute |
| D | Dialogo | le battute intere |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → chiave di `moduleTypes` (i backtick si tolgono) · **etichetta** →
`moduleTypes.<id>.label`. L'ordine delle righe è l'ordine delle chiavi.*

| Id | Etichetta mostrata | A cosa serve |
|---|---|---|
| `inizio` | Inizio | Your Story |
| `studio` | Studio | si va al proprio ritmo |
| `dialogo` | Studia il dialogo | i tre Dialogue |
| `quiz` | Quiz | c'è il tempo o l'avanzamento automatico |
| `test` | Verifica finale | non ancora costruito |
| `fine` | Fine | non ancora costruito |

⚠️ **`test` e `fine` restano senza moduli**, ed è giusto: *sono i due che `CLAUDE.md` elenca fra i
«previsti ma non ancora costruiti».*

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **sottotitolo** → `.subtitle` ·
**categoria** → `.categoria`, e dev'essere uno degli id della sezione 3. Nome e sottotitolo si
confrontano carattere per carattere.*

⚠️ **`nome` ADESSO HA UN SECONDO LETTORE:** *è anche il titolo del pop-up «Spiegazione» di quel modulo —
`howItWorks.title` in `it-istruzioni-moduli` non si scrive più, si deriva da qui.* **Cambiare un nome
cambia due schermate.**

✅ **Le quindici categorie sono MISURATE, non dedotte:** *confermate da Claude Code il 2026-09-27 sul
campo `type` dei quindici descrittori — **15 su 15 giuste**, nessuna correzione.*

| Id | Nome | Sottotitolo | Categoria |
|---|---|---|---|
| `personalizzazione` | Your Story | Personalizza la tua storia | `inizio` |
| `meetTheStory` | Meet the Story | Ascolta la storia | `studio` |
| `repeatAloud` | Repeat Aloud | Ripeti ad alta voce | `studio` |
| `whyWeSayIt` | Why We Say It | Perché si dice così | `studio` |
| `matchEngIta` | Match Practice en→it | Abbina le traduzioni | `studio` |
| `matchItaEng` | Match Practice it→en | Abbina le traduzioni | `studio` |
| `flashcardAEngIta` | Flash Card en→it | Ripassa quello che hai imparato | `studio` |
| `flashcardAItaEng` | Flash Card it→en | Ripassa quello che hai imparato | `studio` |
| `voicePractice` | Voice Practice | Allena la pronuncia | `studio` |
| `dialogoAscoltaRipeti` | Dialogue: Listen & Repeat | Ascolta e ripeti | `dialogo` |
| `dialogoRipetiATempo` | Dialogue: Repeat in Time | Ripeti a tempo | `dialogo` |
| `dialogoContinuo` | Dialogue: Real Dialogue | Il dialogo vero | `dialogo` |
| `speedMatchEngIta` | Speed Match en→it | Traduci a tempo | `quiz` |
| `speedMatchItaEng` | Speed Match it→en | Traduci a tempo | `quiz` |
| `voiceCoach` | Voice Check | Metti alla prova la pronuncia | `quiz` |

⚠️ **`voicePractice` è `studio` e `voiceCoach` è `quiz`, e la differenza non è il microfono:** *in Voice
Practice si riprova quante volte si vuole, in Voice Check una registrazione sola conta.* **È il criterio
della sezione 3 — «si va al proprio ritmo» contro «c'è il tempo o l'avanzamento automatico» — e vale
anche quando i due moduli si somigliano.**

---

## 5 — LE SEQUENZE DEI MODULI

*Colonne: **sequenza** → chiave di `sequences` · **modulo** → `module` · **grado** → `grade` (vuoto dove
il modulo non lavora su un grado).*

⚠️ **L'ordine delle righe di ogni sequenza è l'ordine dei suoi passi.**

⚠️ **Questa sezione nasce il 2026-09-23, e cambia una decisione del 21.** *Allora i 22 passi restavano
solo nel JSON perché «il pannello Admin li modifica». **La misura ha detto che il pannello scrive solo in
`localStorage`** — quel browser soltanto: l'unico scrittore del JSON è Claude Code, come per tutti gli
altri dati. Erano l'ultimo dato senza fonte.*

| Sequenza | Modulo | Grado |
|---|---|---|
| `narrativo-standard` | `personalizzazione` | |
| `narrativo-standard` | `meetTheStory` | D |
| `narrativo-standard` | `repeatAloud` | A |
| `narrativo-standard` | `matchEngIta` | A |
| `narrativo-standard` | `matchItaEng` | A |
| `narrativo-standard` | `flashcardAEngIta` | A |
| `narrativo-standard` | `flashcardAItaEng` | A |
| `narrativo-standard` | `repeatAloud` | B |
| `narrativo-standard` | `matchEngIta` | B |
| `narrativo-standard` | `matchItaEng` | B |
| `narrativo-standard` | `flashcardAEngIta` | B |
| `narrativo-standard` | `voicePractice` | B |
| `narrativo-standard` | `whyWeSayIt` | D |
| `narrativo-standard` | `matchEngIta` | C |
| `narrativo-standard` | `matchItaEng` | C |
| `narrativo-standard` | `voicePractice` | C |
| `narrativo-standard` | `dialogoAscoltaRipeti` | D |
| `narrativo-standard` | `dialogoRipetiATempo` | D |
| `narrativo-standard` | `dialogoContinuo` | D |
| `narrativo-standard` | `speedMatchEngIta` | C |
| `narrativo-standard` | `speedMatchItaEng` | C |
| `narrativo-standard` | `voiceCoach` | C |
| `prova-corta` | `personalizzazione` | |
| `prova-corta` | `meetTheStory` | D |
| `prova-corta` | `repeatAloud` | A |
| `prova-corta` | `matchEngIta` | A |
| `prova-corta` | `dialogoAscoltaRipeti` | D |

⚠️ **`prova-corta` è una sonda, non contenuto:** *serve a provare i selettori del Pannello Admin, e
**nessun episodio la dichiara**.*

*Le sue cinque righe sono state verificate contro il JSON il 2026-09-23: le prime quattro combaciavano,
la quinta no — diceva `voiceCoach` · C dove il JSON ha `dialogoAscoltaRipeti` · D. **Allineata al
JSON**, che per una sonda inerte è il fatto di oggi.*

---

## 7 — GLI EPISODI

*Colonne: **id** → chiave di `episodes` · **nome** → `.nome` · **categoria** → `.categoria` ·
**sequenza** → `.sequence`.*

⚠️ **L'ORDINE DELLE RIGHE È L'ORDINE DEGLI EPISODI DEL CORSO.** Finisce in `episodeSequences.<nome>`, e
`tests/test_struttura_corso.js` blocco `[Ordine]` verifica che i due combacino. **Non esiste un numero
d'episodio: esiste questa posizione.**

⚠️ **E questa «categoria» non ha niente a che vedere con quella della sezione 4:** *là è la categoria di
un **modulo** (`studio`, `quiz`…), qui è il tipo di **episodio** (`storia`).* **Due colonne con lo stesso
nome in due sezioni diverse — vanno lette con la sezione in mano.**

| Id | Nome | Categoria | Sequenza dei moduli |
|---|---|---|---|
| `gate` | Al gate | `storia` | `narrativo-standard` |
| `aircraft-door` | Sulla porta dell'aereo | `storia` | `narrativo-standard` |

🔴 **L'episodio 3 non è qui, e la ragione è scritta:** *la regola §3.2 dice che senza il mix 40/30/20/10
non si pubblicano altri episodi. Il mix legge la copia del file dello studente, che si definisce dopo
Supabase.* **Quindi l'episodio 3 aspetta Supabase — la regola non cambia, i due pubblicati girano senza
mix.**

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) · **valore**. Le due si
confrontano separate: parlare e ascoltare sono due cose.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `en-US` |
| `speech.recognitionLang` | `en-US` |

⭐ **Misurato il 2026-09-27: l'app parla con la voce del BROWSER** — *`window.speechSynthesis`, e in tutto
il repository zero file audio.* **Quindi questi due valori costano zero a cambiare, e un segnaposto in
una battuta non costa niente: la sintesi riceve una stringa e non sa quanti ce n'erano.**

⚠️ *Il giorno in cui l'audio diventasse registrato, ogni segnaposto avrebbe un prezzo — e la decisione è
rimandata con una data: **all'inizio della nuova edizione, dopo il B2**.*
