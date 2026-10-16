**Versione: 20261016a**

# Struttura del corso — spagnolo per italiani

🔴 **VENTIDUE STRINGHE SONO USCITE DA QUESTO FILE IL 2026-10-13, E NON ERANO DELL'EDIZIONE.**

| Cosa | Quante | Dove è andata |
|---|---|---|
| i **sottotitoli** dei moduli | *15 → **14**, unite per `kind`* | `docs/condivisi/it/it-istruzioni-moduli.md` |
| le **etichette delle categorie** | **6** | *lo stesso file, chiave `categorie`* |
| `nomiASchermo.native` | **1** | *lo stesso file, chiave `nomiASchermo`* |

⭐ **La prova che non erano dell'edizione è una misura:** *erano **identiche** fra `inglese/it` e
`spagnolo/it`.* **Cambiano con la lingua dello STUDENTE, non con quella insegnata — e quindi vivono
accanto alle edizioni, non dentro una.**

⚠️ **E quello che NON è uscito, con la sua ragione:**

| Resta qui | Perché |
|---|---|
| il **nome** di ogni modulo | *è nella lingua insegnata, e cambia col verso* |
| i **nomi dei gradi** | 🔴 **regola 26: sono una decisione didattica di QUESTO corso, non una traduzione.** *Condividerli farebbe governare il francese da una scelta presa per l'inglese* |
| `nomiASchermo.target` e `.corso` | *dipendono dalla coppia* |
| `episodes.*.nome` | *è il titolo della storia* |

⚠️ **Conseguenza dichiarata: la lingua dello studente resta scritta anche dentro `corso`** — *«per
italiani»*. **Duplicazione voluta: lingua e demonimo non sono la stessa parola e non si compongono.**


🔴 **GLI ID DI SEI PASSI SONO CAMBIATI IL 2026-10-13, E NON È UNA CORREZIONE DI SCRITTURA.**
*Si chiamavano `matchEngIta`, `matchItaEng`, `flashcardAEngIta`, `flashcardAItaEng`,
`speedMatchEngIta`, `speedMatchItaEng`: **nomi che nominano due lingue, usati anche dal corso di
spagnolo**.* ⭐ **Ora sono `…TargetNative` e `…NativeTarget`** — *`target` è la lingua insegnata,
`native` quella dello studente, in qualunque edizione.*

⚠️ **E i nomi neutri non sono una convenzione nuova:** *il codice già convertiva `'en-it'` in
`target`/`native` due righe dopo averlo letto.* **La rinomina toglie un passaggio di traduzione.**


---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/spagnolo/it/spagnolo-it-struttura-corso.json`.** Le ragioni e le decisioni stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER

**Il lettore cerca SEI titoli per TESTO ESATTO**, `##` più uno spazio più il testo di questa colonna,
carattere per carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | **niente nel JSON, dal 2026-10-13** — *l'elenco serve al trascrittore per controllare che ogni categoria abbia la sua etichetta in `categorie` del file condiviso. Fino a quel giorno era `moduleTypes`* |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `5 — LE SEQUENZE DEI MODULI` | `sequences` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |
| `9 — I NOMI A SCHERMO` | `nomiASchermo` — *le scritte dei moduli e il nome del corso* — **letta dal 2026-10-01 (passo 4)** |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA.** *Se questa tabella scrivesse i titoli per intero,
`indexOf` troverebbe **questa riga** invece della sezione vera, e il parser leggerebbe come «tabella dei
gradi» il resto di questa tabella, senza lamentarsi.* **La prova è ripetibile: `grep -c '^## 2'` deve dare
1.**

⚠️ **Il trattino è un trattone `—` (U+2014)** con uno spazio prima e uno dopo. *Un trattino normale non
viene trovato, e il test non dice «trattino sbagliato»: dice «titolo non trovato».*

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** *È il motivo per cui **qui il 6 non esiste**: il buco non è
un difetto, è il segno visibile che quei numeri sono un'interfaccia.*

**Le colonne si leggono PER POSIZIONE, mai per nome** — `r[0]`, `r[1]`, `r[2]`, `r[3]`. *L'intestazione
non viene letta: le sue parole sono libere, l'ordine delle colonne no.*

⚠️ **E i backtick si tolgono in alcune colonne e in altre no:** *tolti dagli id e dalle sequenze, **non
tolti** da lettera e nome del grado, nome e sottotitolo del modulo, nome dell'episodio.*

**L'ordine delle righe conta in DUE sezioni su SEI** *(tre fino al 2026-10-13, con le categorie)*: *i gradi e gli
episodi — dove spostare un episodio è spostare la sua riga.*

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

*Colonne: **id** → chiave di `categorie`. L'ordine delle righe non conta: l'etichetta si cerca per chiave.*

🔴 **LA COLONNA «ETICHETTA MOSTRATA» È USCITA IL 2026-10-13:** *l'etichetta è nella lingua dello
studente ed era identica nelle due edizioni, quindi vive nel file condiviso, chiave `categorie`.*

⭐ **Questa sezione resta, col suo numero, perché l'edizione continua a dichiarare QUALI categorie usa** —
*e il trascrittore si ferma se una categoria dichiarata qui non ha la sua etichetta nel condiviso.*

| Id | A cosa serve |
|---|---|
| `inizio` | Your Story |
| `studio` | si va al proprio ritmo |
| `dialogo` | i tre Dialogue |
| `quiz` | c'è il tempo o l'avanzamento automatico |
| `test` | non ancora costruito |
| `fine` | non ancora costruito |

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **categoria** → la chiave della
sezione 3. Il nome si confronta carattere per carattere.*

🔴 **LA COLONNA «SOTTOTITOLO» È USCITA IL 2026-10-13**, *nel file condiviso e indicizzata per `kind`:
quindici diventano quattordici, perché i due versi di Flash Card condividono un kind.*

⭐ **Il nome resta qui perché cambia col verso; il sottotitolo no perché descrive il modulo.** ⚠️ *E non è
un giudizio sull'esercizio: Match e Speed Match restano due righe ciascuno perché sono due kind.*

⚠️ **La quarta colonna è nata il 2026-09-27 e va IN FONDO. Metterla in mezzo romperebbe tutto.**

🔴 **CORRETTO IL 30/09: qui c'era scritto «il parser legge `r[0]`, `r[1]`, `r[2]`, quindi non la vede».**
*Era vero il 27 settembre e falso dal 28, quando il passo C di Claude Code le ha insegnato a leggerla.*
⭐ **Oggi la `categoria` si legge**, e sono quindici celle su quindici.

| Id | Nome | Categoria |
|---|---|---|
| `personalizzazione` | Tu historia | `inizio` |
| `meetTheStory` | Conoce la historia | `studio` |
| `repeatAloud` | Repite en voz alta | `studio` |
| `whyWeSayIt` | Por qué se dice así | `studio` |
| `matchTargetNative` | Empareja es→it | `studio` |
| `matchNativeTarget` | Empareja it→es | `studio` |
| `flashcardATargetNative` | Tarjetas es→it | `studio` |
| `flashcardANativeTarget` | Tarjetas it→es | `studio` |
| `voicePractice` | Practica la voz | `studio` |
| `dialogoAscoltaRipeti` | Diálogo: escucha y repite | `dialogo` |
| `dialogoRipetiATempo` | Diálogo: repite a tiempo | `dialogo` |
| `dialogoContinuo` | Diálogo: sin pausas | `dialogo` |
| `speedMatchTargetNative` | Contrarreloj es→it | `quiz` |
| `speedMatchNativeTarget` | Contrarreloj it→es | `quiz` |
| `voiceCoach` | Prueba de voz | `quiz` |

### ⚠️ TRE COSE SU QUESTA TABELLA

**① Gli id dei moduli sono UGUALI IN TUTTE LE EDIZIONI, e non nominano nessuna lingua.**
*`it-istruzioni-moduli` e `it-messaggi-feedback` sono **condivisi fra le edizioni** e indicizzati per
`kind`: se qui l'id diventasse `matchEsIta`, il file condiviso non avrebbe una chiave per lui.*

⭐ **Quindi gli id dei moduli sono del METODO, non dell'edizione.** *E un id del metodo non può nominare
una delle due lingue di una coppia: `target` è la lingua insegnata, `native` quella dello studente, in
qualunque edizione.*

🔴 **E FINO AL 2026-10-13 QUESTI ID SI CHIAMAVANO `matchEngIta`, `flashcardAEngIta`,
`speedMatchEngIta` E I LORO CONTRARI** — *nomi inglesi dentro un corso di spagnolo.* **Rinominati il
13 ottobre, nello stesso passo che ha reso neutri i valori di direzione.**

⚠️ **E com'era scritto il rinvio, prima, vale più della rinomina:** *«va reso neutro **al terzo
pacchetto**… sarebbe una migrazione sull'inglese, che è **congelato**».* 🔴 **Nessuna delle due parole
era definita da nessuna parte: una occorrenza ciascuna in tutto il repository, questa riga.**

> ⭐ **Un rinvio costruito su parole non definite non si può né eseguire né contestare.**

⭐ **E la ragione per cui si è fatto adesso e non dopo:** *gli id dei passi sono le chiavi dei progressi
salvati, e **non esiste nessuna migrazione per gli id dei passi**.* **Oggi i soli progressi al mondo sono
di prova e si buttano: costo zero. Dopo Supabase la stessa rinomina richiederebbe prima di costruire lo
strumento che non c'è.**

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
| **`howItWorks.title`** — i titoli delle spiegazioni | ⭐ **non si scrivono più: si derivano da `moduleLabels[id].name`**, cioè dalla tabella qui sopra. 🔴 *Fino al 2026-10-16 qui c'era `<kind>` e «i 16 titoli»: il titolo è per **id del passo**, e 16 sono i corpi* |
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
| `narrativo-standard` | `matchTargetNative` | A |
| `narrativo-standard` | `matchNativeTarget` | A |
| `narrativo-standard` | `flashcardATargetNative` | A |
| `narrativo-standard` | `flashcardANativeTarget` | A |
| `narrativo-standard` | `repeatAloud` | B |
| `narrativo-standard` | `matchTargetNative` | B |
| `narrativo-standard` | `matchNativeTarget` | B |
| `narrativo-standard` | `flashcardATargetNative` | B |
| `narrativo-standard` | `voicePractice` | B |
| `narrativo-standard` | `whyWeSayIt` | D |
| `narrativo-standard` | `matchTargetNative` | C |
| `narrativo-standard` | `matchNativeTarget` | C |
| `narrativo-standard` | `voicePractice` | C |
| `narrativo-standard` | `dialogoAscoltaRipeti` | D |
| `narrativo-standard` | `dialogoRipetiATempo` | D |
| `narrativo-standard` | `dialogoContinuo` | D |
| `narrativo-standard` | `speedMatchTargetNative` | C |
| `narrativo-standard` | `speedMatchNativeTarget` | C |
| `narrativo-standard` | `voiceCoach` | C |
| `prova-corta` | `personalizzazione` | |
| `prova-corta` | `meetTheStory` | D |
| `prova-corta` | `repeatAloud` | A |
| `prova-corta` | `matchTargetNative` | A |
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
| `aircraft-door` | Sulla porta dell'aereo | `storia` | `narrativo-standard` |

⚠️ **DUE RIGHE DAL 30/09**, *e l'ordine è quello: `gate` prima, `aircraft-door` dopo.* ⭐ **Lo dice anche
il contenuto:** *a `d-7` l'hostess legge il cognome che la famiglia aveva gridato alla fine di `gate`.*

⚠️ **E DUE EPISODI DEVONO ANCORA ENTRARE SOPRA DI LORO:** *`numeros-y-tener` e `ser`, che aprono le
quattro schede che `gate` usa.* **Finché non esistono, `gate` usa `soy`, `tengo` e i numeri senza che
nessuna scheda li abbia aperti** — *ed è la stessa situazione dell'inglese, dove `gate` e
`aircraft-door` esistono e `verb-to-be` e `numeri` no.*

**Il debito sta nel tabellone delle schede, come righe rosse. Non si nasconde qui** — *sono SEI righe
rosse in `spagnolo-it-edizione` 3.4.*

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

## 9 — I NOMI A SCHERMO

*Colonne: **ruolo** → la chiave · **nome** → come si scrive a schermo.*

| Ruolo | Nome |
|---|---|
| `target` | Spagnolo |
| `corso` | Spagnolo per italiani |

**Cosa ne ricava l'app:**

| | |
|---|---|
| `target` **+ `native`, che dal 13/10 arriva dal condiviso** | **le scritte dei moduli di abbinamento** — *«SPAGNOLO → ITALIANO» e il contrario.* ⚠️ *La freccia e il maiuscolo sono del codice, i due nomi sono dati — ma da due file diversi* |
| `corso` | **il nome del corso**, dove serve distinguerlo dal nome dell'app |

🔴 **`corso` ha una cella sua e non si ricava dalle altre due.** *«Spagnolo per italiani» ha una grammatica che
«Spagnolo» + «Italiano» non danno — e in un'altra lingua dello studente cambia del tutto.*

⚠️ **ERANO TRE FINO AL 2026-10-13, E `native` È USCITO.** *Qui c'era scritto: «i tre nomi sono scritti
nella lingua dello STUDENTE, **e per questo** la tabella non è condivisibile fra edizioni».* 🔴 **Quel
«per questo» era rovesciato:** *essere scritto nella lingua dello studente è esattamente quello che rende
`native` condivisibile — per lingua dello studente.* ⭐ **`target` e `corso` restano perché dipendono
dalla COPPIA, non perché siano in italiano.**

⭐ **E i due ruoli sono le STESSE due parole delle chiavi del JSON**, *non due vocabolari per la stessa
idea.*

⚠️ **IL TITOLO È CAMBIATO IL 1/10: era «I NOMI DELLE DUE LINGUE».** *Con la riga `corso` quel titolo
diceva una cosa falsa — tre righe, e una non è una lingua.* ⭐ **Cambiato ADESSO, prima che il lettore
esista:** *un titolo è un'interfaccia, e dopo costa.*

⚠️ **SEZIONE IN FONDO, E NON SI RINUMERA NIENTE.** *Rinumerare romperebbe le asserzioni che cercano i
titoli carattere per carattere.*
