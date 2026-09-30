**Versione: 20260930a**

# Struttura del corso — spagnolo per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/spagnolo/it/spagnolo-it-struttura-corso.json`.** Le ragioni e le decisioni stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER

**Il lettore cerca cinque titoli per TESTO ESATTO**, `##` più uno spazio più il testo di questa colonna,
carattere per carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | `moduleTypes` |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA.** *Se questa tabella scrivesse i titoli per intero,
`indexOf` troverebbe **questa riga** invece della sezione vera, e il parser leggerebbe come «tabella dei
gradi» il resto di questa tabella, senza lamentarsi.* **La prova è ripetibile: `grep -c '^## 2'` deve dare
1.**

⚠️ **Il trattino è un trattone `—` (U+2014)** con uno spazio prima e uno dopo. *Un trattino normale non
viene trovato, e il test non dice «trattino sbagliato»: dice «titolo non trovato».*

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** *È il motivo per cui **qui il 6 non esiste**: il buco non è
un difetto, è il segno visibile che quei numeri sono un'interfaccia.*

**Le colonne si leggono PER POSIZIONE, mai per nome** — `r[0]`, `r[1]`, `r[2]`. *L'intestazione non viene
letta: le sue parole sono libere, l'ordine delle colonne no.*

⚠️ **E i backtick si tolgono in alcune colonne e in altre no:** *tolti dagli id e dalle sequenze, **non
tolti** da lettera e nome del grado, nome e sottotitolo del modulo, nome dell'episodio.*

**L'ordine delle righe conta in tre sezioni su cinque:** *i gradi, le categorie, e gli episodi — dove
spostare un episodio è spostare la sua riga.*

### ② ⚠️ COSA SI COPIA DALL'INGLESE, E PERCHÉ

| Sezione | Cosa succede |
|---|---|
| **2 — i gradi** | ✅ **identica**: *i gradi sono del metodo, e i nomi mostrati sono in italiano* |
| **3 — le categorie** | ✅ **identica** |
| **4 — i nomi dei moduli** | ⚠️ **gli id identici, i nomi tradotti, e una colonna in più**: *`categoria`, nata il 27/09 — **misurata da Claude Code, 15 su 15 giuste*** |
| **5 — le sequenze** | ✅ **identica**: *i 22 passi sono il metodo* |
| **7 — gli episodi** | 🔴 **tutta nuova** |
| **8 — il parlato** | 🔴 **nuova** |

---

## 2 — I GRADI

*Colonne: **lettera** → `grades` e chiave di `gradeNames` · **nome mostrato** → valore di `gradeNames`.
La terza colonna non viene letta.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Parole | parole singole |
| B | Espressioni | blocchi il cui significato non si ricava dalle singole parole |
| C | Frasi | frasi, ricavate spezzando le battute |
| D | Dialogo | le battute intere |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → chiave di `moduleTypes` · **etichetta** → `moduleTypes.<id>.label`. L'ordine delle
righe è l'ordine delle chiavi.*

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

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **sottotitolo** → `.subtitle` ·
**categoria** → la chiave della sezione 3. Nome e sottotitolo si confrontano carattere per carattere.*

⚠️ **La quarta colonna è nata il 2026-09-27 e va IN FONDO:** *il parser legge `r[0]`, `r[1]`, `r[2]`,
quindi non la vede finché `trascrivi.js` non impara a leggerla.* **Metterla in mezzo romperebbe tutto.**

| Id | Nome | Sottotitolo | Categoria |
|---|---|---|---|
| `personalizzazione` | Tu historia | Personalizza la tua storia | `inizio` |
| `meetTheStory` | Conoce la historia | Ascolta la storia | `studio` |
| `repeatAloud` | Repite en voz alta | Ripeti ad alta voce | `studio` |
| `whyWeSayIt` | Por qué se dice así | Perché si dice così | `studio` |
| `matchEngIta` | Empareja es→it | Abbina le traduzioni | `studio` |
| `matchItaEng` | Empareja it→es | Abbina le traduzioni | `studio` |
| `flashcardAEngIta` | Tarjetas es→it | Ripassa quello che hai imparato | `studio` |
| `flashcardAItaEng` | Tarjetas it→es | Ripassa quello che hai imparato | `studio` |
| `voicePractice` | Practica la voz | Allena la pronuncia | `studio` |
| `dialogoAscoltaRipeti` | Diálogo: escucha y repite | Ascolta e ripeti | `dialogo` |
| `dialogoRipetiATempo` | Diálogo: repite a tiempo | Ripeti a tempo | `dialogo` |
| `dialogoContinuo` | Diálogo: sin pausas | Il dialogo vero | `dialogo` |
| `speedMatchEngIta` | Contrarreloj es→it | Traduci a tempo | `quiz` |
| `speedMatchItaEng` | Contrarreloj it→es | Traduci a tempo | `quiz` |
| `voiceCoach` | Prueba de voz | Metti alla prova la pronuncia | `quiz` |

### ⚠️ TRE COSE SU QUESTA TABELLA

**① Gli id restano quelli inglesi — `matchEngIta` in un corso di spagnolo — E DEVE ESSERE COSÌ.**
*`it-istruzioni-moduli` e `it-messaggi-feedback` sono **condivisi fra le edizioni** e indicizzati per
`kind`: se qui l'id diventasse `matchEsIta`, il file condiviso non avrebbe una chiave per lui.*

⭐ **Quindi gli id dei moduli sono del METODO, non dell'edizione.**

⚠️ **MA `matchEngIta` è un id che NOMINA UNA LINGUA, usato da un'edizione che non la parla** — *ed è
esattamente la forma di `speedRoundMessages`: un nome vecchio che vive in una chiave e che nessuna
verifica trova.* **Va reso neutro al terzo pacchetto**, *insieme alle altre migrazioni di id. Non adesso:
sarebbe una migrazione sull'inglese, che è congelato.*

**② IL NOME È NELLA LINGUA CHE SI IMPARA, IL SOTTOTITOLO IN ITALIANO — deciso il 2026-09-27.**

> **Il nome è l'immersione, il sottotitolo è l'invariante.**

*Lo studente che compra due corsi deve riconoscere lo stesso esercizio: quel riconoscimento gliel'ho
tolto dal nome e gliel'ho lasciato nel **sottotitolo**, che è in italiano e identico in tutte le
edizioni.* ⚠️ **Quindi i sottotitoli NON si traducono mai, e i nomi sì.**

**③ ✅ E IL PROBLEMA CHE NE DISCENDEVA È STATO RISOLTO IL 2026-09-28.**

*`it-istruzioni-moduli` sezione 2 aveva una colonna «titolo» — `howItWorks.title` — e quei titoli **erano
i nomi dei moduli**: «Your Story», «Repeat Aloud».* 🔴 **Con il nome per edizione e il file condiviso, il
popup di un corso di spagnolo si sarebbe intitolato «Your Story». Sedici volte.**

⭐ **Non era una duplicazione da semplificare: era un difetto che sarebbe scattato al primo giorno di
questa edizione.**

| Cosa è stato fatto | |
|---|---|
| **`howItWorks.title`** — i 16 titoli delle spiegazioni | ⭐ **non si scrivono più: si derivano da `moduleLabels.<kind>.name`**, cioè dalla tabella qui sopra |
| **`helpReminder.title`** — i 16 titoli dei promemoria, tutti uguali | ⭐ **si derivano da `aiuto.titleInstructions`**, che diceva già la stessa frase nella sezione 6 dello stesso file |
| **Il conto** | **208 stringhe → 176** |

⚠️ **E ne segue una cosa da sapere scrivendo questa tabella: la colonna «Nome» ha DUE lettori.** *È il
nome sulla mappa dell'episodio **e** il titolo del pop-up «Spiegazione» di quel modulo.* **Cambiare un
nome qui cambia due schermate.**

---

## 5 — LE SEQUENZE DEI MODULI

*Colonne: **sequenza** → chiave di `sequences` · **modulo** → `module` · **grado** → `grade` (vuoto dove
il modulo non lavora su un grado).*

⚠️ **L'ordine delle righe di ogni sequenza è l'ordine dei suoi passi.**

**I ventidue passi sono identici all'inglese: sono il metodo, non la lingua.**

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
**nessun episodio la dichiara**.* **Resta anche qui perché il pannello è uno per tutte le edizioni.**

---

## 7 — GLI EPISODI

*Colonne: **id** → chiave di `episodes` · **nome** → `.nome` · **categoria** → `.categoria` ·
**sequenza** → `.sequence`.*

⚠️ **L'ORDINE DELLE RIGHE È L'ORDINE DEGLI EPISODI DEL CORSO.** *Non esiste un numero d'episodio: esiste
questa posizione.*

| Id | Nome | Categoria | Sequenza dei moduli |
|---|---|---|---|
| `gate` | Al gate | `storia` | `narrativo-standard` |

⚠️ **UNA RIGA SOLA, E DUE EPISODI DEVONO ENTRARE SOPRA DI LEI:** *`numeros-y-tener` e `ser`, che aprono le
quattro schede che `gate` usa.* **Finché non esistono, `gate` usa `soy`, `tengo` e i numeri senza che
nessuna scheda li abbia aperti** — *ed è la stessa situazione dell'inglese, dove `gate` e
`aircraft-door` esistono e `verb-to-be` e `numeri` no.*

**Il debito sta nel tabellone delle schede, come righe rosse. Non si nasconde qui.**

⚠️ **E `gate` ha lo stesso id in tutte le edizioni** — *le scene sono le stesse, e l'id è il nome della
scena, non del suo contenuto.*

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) · **valore**. Le due si
confrontano separate: **parlare e ascoltare sono due cose**.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `es-ES` |
| `speech.recognitionLang` | `es-ES` |

### ⭐ DUE COSE CHE NON SI TOCCANO MAI, E IL 30/09 LE ABBIAMO CONFUSE

| | Cos'è | Dove vive | Chi la legge **oggi** |
|---|---|---|---|
| ⭐ **La lingua che insegniamo** | **`es-ES`, lo spagnolo di Spagna.** *Grammatica, pronuncia, standard atteso dallo studente* | **questa tabella** | **l'app**, e ogni nostro testo |
| **L'accento di chi parla** | *una proprietà del personaggio: la hostess è messicana* | la colonna `accento` dei file `-ragioni` | 🔴 **NESSUNO** — *la voce la fa il browser, e non sa chi parla* |

**La seconda è scritta solo per non doverla ricostruire fra sei mesi. Non chiede niente al codice.**

⚠️ **E per questo i due valori sono UGUALI oggi:** *non perché debbano coincidere per sempre, ma perché
non c'è ancora niente che li distingua.* 🔴 **Scriverne due diversi vorrebbe dire far finta di avere un
meccanismo che non abbiamo.**

### 🔴 Da dove veniva il casino — e va lasciato scritto

**Il 27/09 la decisione era giusta:** *`SPAGNOLO_037` — «la rotta non cambia la lingua insegnata».*
**Poi l'abbiamo SCRITTA così:** *«si insegna lo `español neutro`, e `es-MX` è il codice più vicino».*

> ⚠️ **`es-MX` non è un livello di neutralità: è una varietà.**

*Da lì il contenuto l'ha seguita, e nella skill `d-3` di `gate` è nato un «al plurale c'è una forma
sola» che è vero in America e falso in Spagna.* **L'ha trovato Claude Code il 30/09, leggendo il testo
contro questa tabella.**

⭐ **La decisione originale era già quella giusta:** *`SPAGNOLO_001`, 25 settembre — «lo spagnolo è
`es-ES`».* **Non abbiamo cambiato idea: abbiamo rimesso a posto una decisione che una scelta di codifica
aveva ribaltato senza dirlo.**

### Quando i due valori diventeranno diversi

| | Cosa è | Cosa seguirà |
|---|---|---|
| `synthesisLang` | quello che lo studente **SENTE** | **la tappa** — *`es-MX` a Città del Messico, `es-AR` a Buenos Aires* |
| `recognitionLang` | quello che ci aspettiamo **DA LUI** | 🔴 **resta `es-ES` sempre**: *è lo standard che insegniamo* |

⚠️ **E `synthesisLang` dovrà diventare per TAPPA, non per edizione** — *oggi è un valore solo per tutto
il corso.* **Fino a quel giorno resta `es-ES`, perché è quello che lo studente deve imitare.**

⭐ **MISURATO IL 2026-09-27: costa pochissimo, ed è una buona notizia.** *L'app parla con la voce del
**browser** — `window.speechSynthesis` — e in tutto il repository non c'è **un solo file audio**.*
**Quindi cambiare voce per tappa è un attributo, non una libreria di registrazioni da rifare** — *ed è
uscito dalla lista delle cose care.*

⚠️ **Un rischio da guardare prima di VENDERE, non prima di scrivere:** *le voci del browser non sono
garantite su ogni dispositivo. `es-MX` può ricadere su `es-ES`, o su niente.*

---

## 9 — I NOMI DELLE DUE LINGUE

*Colonne: **ruolo** → la chiave · **nome** → come si scrive a schermo.*

| Ruolo | Nome |
|---|---|
| `target` | Spagnolo |
| `source` | Italiano |

**L'app ne ricava le scritte dei moduli di abbinamento:** *«SPAGNOLO → ITALIANO» e «ITALIANO →
SPAGNOLO».* ⚠️ **La freccia e il maiuscolo sono del codice, i due nomi sono dati.**

⚠️ **I due nomi sono scritti nella lingua dello STUDENTE**, *e per questo la tabella non è condivisibile
fra edizioni: nell'edizione inglese-per-spagnoli diranno «Inglés» e «Español».*

⭐ **E i due ruoli sono le STESSE due parole delle chiavi del JSON**, *non due vocabolari per la stessa
idea.* **Se `trascrivi.js` sceglie altri due nomi, cambiano tutti e due i posti insieme.**

⚠️ **SEZIONE NUOVA IN FONDO, E NON SI RINUMERA NIENTE.** *Il 9 è libero e nessun titolo esistente si
sposta — rinumerare romperebbe le asserzioni che cercano i titoli carattere per carattere.*
