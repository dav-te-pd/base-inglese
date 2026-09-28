**Versione: 20260928a**

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

**I cinque titoli cercati sono `##` più uno spazio più il testo di questa colonna**, carattere per
carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | `moduleTypes` |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA, e non è pedanteria.** Se questa tabella scrivesse i titoli
per intero, `indexOf` troverebbe **questa riga** invece della sezione vera — e il parser leggerebbe come
«tabella dei gradi» il resto di questa tabella, senza lamentarsi. *La prova è ripetibile:
`grep -c '^## 2'` deve dare **1**.*

⚠️ **Il trattino è un trattone `—` (U+2014) con uno spazio prima e uno dopo.** Un trattino normale `-`
non viene trovato, e il test non dice «trattino sbagliato»: dice «Titolo non trovato».

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** È il motivo per cui **qui il 5 e il 6 non esistono**: le
due sezioni che li portavano sono passate in RAGIONI, e chiudere il buco tirando indietro il 7 farebbe
fallire tre asserzioni. *Il buco non è un difetto: è il segno visibile che quei numeri sono
un'interfaccia.*

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

**L'ordine delle righe conta in tre sezioni su cinque:**

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

⚠️ **VA IN FONDO, E NON È INDIFFERENTE:** *il parser legge per posizione — `r[0]`, `r[1]`, `r[2]` —
quindi una quarta colonna **non viene letta** finché `trascrivi.js` non impara a leggerla.* **Metterla in
mezzo romperebbe tutto; metterla in fondo non rompe niente**, e il file può aspettare il trascrittore
senza diventare rosso.

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
