**Versione: 20260923a**

# Struttura del corso — inglese per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-struttura-corso.json`.** Le ragioni, le decisioni e
quello che è aperto stanno nei file RAGIONI e non qui.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_struttura_corso.js`, 2026-09-23

**Il lettore è la funzione `tabellaSotto(testo, titolo)`, e fa tre cose. Tutte
e tre decidono come va scritto questo file.**

**Cerca il titolo per TESTO ESATTO, e il NUMERO è dentro il testo.**
`testo.indexOf(titolo)` — sottostringa, sensibile a maiuscole e accenti. I
cinque titoli cercati, alla lettera:

**I cinque titoli cercati sono `##` più uno spazio più il testo di questa
colonna**, carattere per carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | `moduleTypes` |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA, e non è pedanteria.** Se questa
tabella scrivesse i titoli per intero, `indexOf` troverebbe **questa riga**
invece della sezione vera — e il parser leggerebbe come «tabella dei gradi» il
resto di questa tabella, senza lamentarsi. *La prova è ripetibile:
`grep -c '^## 2'` deve dare **1**.*

⚠️ **Il trattino è un trattone `—` (U+2014) con uno spazio prima e uno dopo.**
Un trattino normale `-` non viene trovato, e il test non dice «trattino
sbagliato»: dice «Titolo non trovato».

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** È il motivo per cui **qui il 5 e il
6 non esistono**: le due sezioni che li portavano sono passate in RAGIONI, e
chiudere il buco tirando indietro il 7 farebbe fallire tre asserzioni. *Il buco
non è un difetto: è il segno visibile che quei numeri sono un'interfaccia.*

**Prende la PRIMA tabella dopo il titolo, e ignora tutto quello che c'è in
mezzo.** Righe di prosa, avvisi, sottotitoli: saltati, purché non comincino con
`|`. La tabella finisce alla prima riga **non vuota** che non comincia con `|`
— **una riga vuota dentro la tabella non la chiude.**

**Legge le colonne PER POSIZIONE, mai per nome.** `r[0]`, `r[1]`, `r[2]`,
`r[3]`. **L'intestazione della tabella non viene mai letta**: le sue parole sono
libere, **l'ordine delle colonne no**. Serve almeno una riga oltre
all'intestazione, altrimenti il test esplode invece di diventare rosso.

⚠️ **I backtick si tolgono in alcune colonne e in altre NO**, e la differenza si
vede solo qui:

| Dove | I backtick |
|---|---|
| id di categoria, modulo, episodio · categoria · sequenza · chiavi del parlato | **tolti** — scriverli o no è uguale |
| **lettera del grado**, **nome del grado**, **nome e sottotitolo del modulo**, **nome dell'episodio** | **NON tolti** — un backtick di troppo è una differenza |

**Nome e sottotitolo di un modulo, e il nome di un episodio, si confrontano
carattere per carattere, accenti compresi.** *Il 2026-09-21 «Perché si dice
così» scritto con gli apostrofi è passato inosservato: è testo che legge lo
studente.*

**L'ordine delle righe conta in tre sezioni su cinque:**

| Sezione | L'ordine delle righe |
|---|---|
| `2 — I GRADI` | **è** l'ordine di `grades` |
| `3 — LE CATEGORIE DEI MODULI` | **è** l'ordine delle chiavi di `moduleTypes` |
| `7 — GLI EPISODI` | **è** l'ordine degli episodi del corso — **spostare un episodio è spostare questa riga** |
| `4 — I NOMI DEI MODULI` | non conta: è un elenco a chiave, nessuno lo scorre |
| `8 — LE LINGUE DEL PARLATO` | non conta |

---

## 2 — I GRADI

*Colonne, nell'ordine: **lettera** → `grades` e chiave di `gradeNames` · **nome
mostrato** → valore di `gradeNames`. La terza colonna non viene letta.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Parole | parole singole |
| B | Espressioni | blocchi il cui significato non si ricava dalle singole parole |
| C | Frasi | frasi, ricavate spezzando le battute |
| D | Dialogo | le battute intere |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → chiave di `moduleTypes` (i backtick si tolgono) · **etichetta**
→ `moduleTypes.<id>.label`. L'ordine delle righe è l'ordine delle chiavi.*

| Id | Etichetta mostrata | A cosa serve |
|---|---|---|
| `inizio` | Inizio | Your Story |
| `studio` | Studio | si va al proprio ritmo |
| `dialogo` | Studia il dialogo | i tre Dialogue |
| `quiz` | Quiz | c'è il tempo o l'avanzamento automatico |
| `test` | Verifica finale | non ancora costruito |
| `fine` | Fine | non ancora costruito |

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **sottotitolo**
→ `.subtitle`. Nome e sottotitolo si confrontano carattere per carattere.*

| Id | Nome | Sottotitolo |
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

## 5 — LE SEQUENZE DEI MODULI

*Colonne: **sequenza** → chiave di `sequences` · **modulo** → `module` · **grado** → `grade`
(vuoto dove il modulo non lavora su un grado).*

⚠️ **L'ordine delle righe di ogni sequenza è l'ordine dei suoi passi.**

⚠️ **Questa sezione nasce il 2026-09-23, e cambia una decisione del 21.** *Allora i 22 passi
restavano solo nel JSON perché «il pannello Admin li modifica». **La misura ha detto che il
pannello scrive solo in `localStorage`** — quel browser soltanto: l'unico scrittore del JSON è
Claude Code, come per tutti gli altri dati. Erano l'ultimo dato senza fonte.*

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
| `prova-corta` | `voiceCoach` | C |

⚠️ **`prova-corta` è una sonda, non contenuto:** *serve a provare i selettori del Pannello Admin, e
**nessun episodio la dichiara**.* **Le sue cinque righe vanno verificate**: sono scritte a memoria e
il JSON è la fonte di oggi.

---

## 7 — GLI EPISODI

*Colonne: **id** → chiave di `episodes` · **nome** → `.nome` · **categoria** →
`.categoria` · **sequenza** → `.sequence`.*

⚠️ **L'ORDINE DELLE RIGHE È L'ORDINE DEGLI EPISODI DEL CORSO.** Finisce in
`episodeSequences.<nome>`, e `tests/test_struttura_corso.js` blocco `[Ordine]`
verifica che i due combacino. **Non esiste un numero d'episodio: esiste questa
posizione.**

| Id | Nome | Categoria | Sequenza dei moduli |
|---|---|---|---|
| `gate` | Al gate | `storia` | `narrativo-standard` |
| `aircraft-door` | Sulla porta dell'aereo | `storia` | `narrativo-standard` |

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) ·
**valore**. Le due si confrontano separate: parlare e ascoltare sono due cose.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `en-US` |
| `speech.recognitionLang` | `en-US` |
