**Versione: 20261019a**

# Struttura del corso — italiano per spagnoli

**Terza edizione, e la PRIMA del verso rovesciato: lo studente non è italiano.**

⭐ **È l'edizione che il piano dichiara più importante delle altre tre messe insieme**, *perché è la sola
che prova la seconda metà della coppia* — `decisioni-stato.md`, catena 1.12, punto ②.

## ⭐ LE 22 STRINGHE DI LIVELLO 2 NON SI SCRIVONO QUI, E QUESTO FILE NASCE GIÀ SENZA

**Dal 2026-10-13 i sottotitoli dei moduli, le etichette delle categorie e `nomiASchermo.native` vivono nel
file dei testi condivisi della lingua dello studente** — *per noi `docs/condivisi/es/es-istruzioni-moduli.md`.*

| Cosa NON c'è qui | Dove sta |
|---|---|
| i **sottotitoli** dei moduli | `docs/condivisi/es/es-istruzioni-moduli.md`, chiave **`<kind>.subtitle`** |
| le **etichette delle categorie** | *lo stesso file, chiave `categorie`* |
| `nomiASchermo.native` | *lo stesso file, chiave `nomiASchermo`* |

⚠️ **Le altre due edizioni le hanno perse in una riscrittura; questa non le ha mai avute.** *È la prima
volta che si vede il guadagno di quel passo: un'edizione nuova nasce con tre tabelle in meno da compilare.*

| Resta qui | Perché |
|---|---|
| il **nome** di ogni modulo | *è nella lingua insegnata — qui l'ITALIANO — e cambia col verso* |
| i **nomi dei gradi** | 🔴 **regola 26: sono una decisione didattica di QUESTO corso, non una traduzione** |
| `nomiASchermo.target` e `.corso` | *dipendono dalla coppia* |
| `episodes.*.nome` | *è il titolo della storia, nella lingua dello studente* |

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/italiano/es/italiano-es-struttura-corso.json`.** Le ragioni e le decisioni stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER

**Il lettore cerca SETTE titoli per TESTO ESATTO**, `##` più uno spazio più il testo di questa colonna,
carattere per carattere:

| Il testo dopo `## ` | Cosa ne legge |
|---|---|
| `2 — I GRADI` | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | **niente nel JSON, dal 2026-10-13** — *l'elenco serve al trascrittore per controllare che ogni categoria abbia la sua etichetta in `categorie` del file condiviso* |
| `4 — I NOMI DEI MODULI` | `moduleLabels` |
| `5 — LE SEQUENZE DEI MODULI` | `sequences` |
| `7 — GLI EPISODI` | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | `speech` |
| `9 — I NOMI A SCHERMO` | `nomiASchermo` — *le scritte dei moduli e il nome del corso* |

> 🔴 **SETTE, e vale scriverlo: al 2026-10-19 `spagnolo/it` dice ancora «SEI» con questa stessa tabella
> di sette righe sotto.** *Il suo numero è fermo a prima del 2026-10-01, quando la §9 ha avuto il suo
> lettore.* ⭐ **La sezione che spiega quanto è rigido il parser sbaglia il conto della cosa che
> descrive.**
>
> ⚠️ **`inglese/it` invece dice già SETTE** — *verificato su `main` il 2026-10-19, dopo che Code ha
> corretto la versione precedente di questa riga, che diceva «le altre DUE».* 🔴 **Resta da correggere
> una sola edizione.**

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
tolti** da lettera e nome del grado, nome del modulo, nome dell'episodio.*

**L'ordine delle righe conta in DUE sezioni su SETTE**: *i gradi e gli episodi — dove spostare un episodio
è spostare la sua riga.*

### ② ⚠️ COSA SI COPIA DALLE ALTRE DUE EDIZIONI, E PERCHÉ

⭐ **Misurato il 2026-10-17: le SETTE intestazioni di questo file sono IDENTICHE in `inglese/it` e in
`spagnolo/it`.** *Quindi la forma si prende, non si inventa: cambiano solo le celle.*

| Sezione | Cosa succede |
|---|---|
| **2 — i gradi** | ⚠️ **struttura identica, NOMI NUOVI**: *i gradi sono del metodo, ma i nomi mostrati sono nella lingua dello studente — qui in spagnolo* |
| **3 — le categorie** | ✅ **identica**: *gli id sono del metodo* |
| **4 — i nomi dei moduli** | 🔴 **gli id identici, i nomi in ITALIANO**: *è la lingua insegnata, e le direzioni si rovesciano — `it→es` dove lo spagnolo aveva `es→it`* |
| **5 — le sequenze** | ✅ **identica**: *i 22 passi sono il metodo* |
| **7 — gli episodi** | ⚠️ **gli id identici, i nomi in spagnolo**: *le scene sono le stesse, il contenuto didattico è tutto nuovo* |
| **8 — il parlato** | 🔴 **nuova**: `it-IT` |
| **9 — i nomi a schermo** | 🔴 **nuova** |

---

## 2 — I GRADI

*Colonne: **lettera** → `grades` · **nome mostrato** → `gradeNames` · **cosa contiene** → per noi.*

⚠️ **L'ordine delle righe è l'ordine dei gradi.**

🔴 **I nomi sono una decisione didattica di questo corso (regola 26), e sono nella lingua dello
STUDENTE.** *Non sono la traduzione di «Parole, Espressioni, Frasi»: sono le parole con cui questo corso
chiama i suoi gradi a chi parla spagnolo.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| A | Palabras | parole singole |
| B | Expresiones | blocchi il cui significato non si ricava dalle singole parole |
| C | Frases | frasi, ricavate spezzando le battute |
| D | Diálogo | le battute intere |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → la chiave · **a cosa serve** → per noi.*

⚠️ **Dal 2026-10-13 questa tabella non finisce nel JSON:** *serve al trascrittore per controllare che ogni
categoria abbia la sua etichetta in `categorie` del file condiviso.* 🔴 **Una categoria senza etichetta
ferma la trascrizione.**

| Id | A cosa serve |
|---|---|
| `inizio` | il modulo che apre l'episodio |
| `studio` | si va al proprio ritmo |
| `dialogo` | i tre moduli sul dialogo intero |
| `quiz` | c'è il tempo o l'avanzamento automatico |
| `test` | non ancora costruito |
| `fine` | non ancora costruito |

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → la chiave di `moduleLabels` · **nome** → `.name` · **categoria** → `.categoria`.*

🔴 **I nomi sono nella lingua INSEGNATA, quindi in italiano** — *e le direzioni sono `it→es`, il rovescio
dell'edizione spagnola.*

⭐ **I quindici id sono identici a quelli delle altre due edizioni.** *Dal 2026-10-13 non nominano una
lingua: `matchTargetNative`, non `matchEnIt`.*

| Id | Nome | Categoria |
|---|---|---|
| `personalizzazione` | La tua storia | `inizio` |
| `meetTheStory` | Conosci la storia | `studio` |
| `repeatAloud` | Ripeti ad alta voce | `studio` |
| `whyWeSayIt` | Perché si dice così | `studio` |
| `matchTargetNative` | Abbina it→es | `studio` |
| `matchNativeTarget` | Abbina es→it | `studio` |
| `flashcardATargetNative` | Carte it→es | `studio` |
| `flashcardANativeTarget` | Carte es→it | `studio` |
| `voicePractice` | Esercita la voce | `studio` |
| `dialogoAscoltaRipeti` | Dialogo: ascolta e ripeti | `dialogo` |
| `dialogoRipetiATempo` | Dialogo: ripeti a tempo | `dialogo` |
| `dialogoContinuo` | Dialogo: reale | `dialogo` |
| `speedMatchTargetNative` | Contro il tempo it→es | `quiz` |
| `speedMatchNativeTarget` | Contro il tempo es→it | `quiz` |
| `voiceCoach` | Prova di voce | `quiz` |

### ⚠️ DUE COSE SU QUESTA TABELLA

**① I titoli delle spiegazioni non si scrivono: si DERIVANO da `moduleLabels[id].name`**, cioè dalla
colonna «Nome» qui sopra. *Quindi un nome cambiato qui cambia anche il titolo della sua spiegazione nel
file condiviso.*

**② La colonna `categoria` deve nominare una categoria della sezione 3**, e ogni categoria usata deve
avere la sua etichetta nel file condiviso. 🔴 *Due controlli, non uno.*

---

## 5 — LE SEQUENZE DEI MODULI

*Colonne: **sequenza** → chiave di `sequences` · **modulo** → `module` · **grado** → `grade` (vuoto dove
il modulo non lavora su un grado).*

⚠️ **L'ordine delle righe di ogni sequenza è l'ordine dei suoi passi.**

⭐ **E dal 30/10 ce n'è una seconda, `narrativo-seguito`: gli stessi passi meno il primo.**
*Dal secondo episodio in avanti non c'è piu' niente da scegliere — i valori degli slot sono del
CORSO, non dell'episodio — quindi il modulo `personalizzazione` non ha nulla da mostrare.*
🔴 **Ventuno passi, non ventidue, e la differenza è solo quel primo.**

**I ventidue passi sono identici alle altre due edizioni: sono il metodo, non la lingua.**

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
| `narrativo-seguito` | `meetTheStory` | D |
| `narrativo-seguito` | `repeatAloud` | A |
| `narrativo-seguito` | `matchTargetNative` | A |
| `narrativo-seguito` | `matchNativeTarget` | A |
| `narrativo-seguito` | `flashcardATargetNative` | A |
| `narrativo-seguito` | `flashcardANativeTarget` | A |
| `narrativo-seguito` | `repeatAloud` | B |
| `narrativo-seguito` | `matchTargetNative` | B |
| `narrativo-seguito` | `matchNativeTarget` | B |
| `narrativo-seguito` | `flashcardATargetNative` | B |
| `narrativo-seguito` | `voicePractice` | B |
| `narrativo-seguito` | `whyWeSayIt` | D |
| `narrativo-seguito` | `matchTargetNative` | C |
| `narrativo-seguito` | `matchNativeTarget` | C |
| `narrativo-seguito` | `voicePractice` | C |
| `narrativo-seguito` | `dialogoAscoltaRipeti` | D |
| `narrativo-seguito` | `dialogoRipetiATempo` | D |
| `narrativo-seguito` | `dialogoContinuo` | D |
| `narrativo-seguito` | `speedMatchTargetNative` | C |
| `narrativo-seguito` | `speedMatchNativeTarget` | C |
| `narrativo-seguito` | `voiceCoach` | C |
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
| `gate` | En la puerta de embarque | `historia` | `narrativo-standard` |
| `aircraft-door` | En la puerta del avión | `historia` | `narrativo-seguito` |

⚠️ **Gli id sono gli stessi di tutte le edizioni** — *le scene sono le stesse, e l'id è il nome della
scena, non del suo contenuto.* 🔴 **Il contenuto didattico invece è tutto nuovo:** *le parole, le
espressioni e le frasi italiane non hanno niente a che vedere con quelle spagnole o inglesi.*

🔴 **E dal 30/10 anche la CATEGORIA è in spagnolo — `historia`:** *`app/mappa.js` riga 1579 la
stampa grezza, senza passare da `uiText`, quindi è un'etichetta e non un id.* ⚠️ **Nelle altre due resta
`storia`, perché là l'italiano è la lingua dello studente.**

⭐ **I nomi sono in SPAGNOLO**, *come «Al gate» è in italiano nelle altre due: il nome dell'episodio lo
legge lo studente.*

⚠️ **E il debito delle schede va scritto nel tabellone dell'edizione, non qui** — *come righe rosse, dove
le altre due edizioni mettono le loro.*

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) · **valore**. Le due si
confrontano separate: **parlare e ascoltare sono due cose**.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `it-IT` |
| `speech.recognitionLang` | `it-IT` |

⚠️ **Questi due valori sono la lingua INSEGNATA, mai quella dello studente.** *L'app sintetizza l'italiano
perché lo studente lo deve sentire, e lo riconosce perché lo studente lo deve pronunciare.* 🔴 **Metterci
`es-ES` farebbe leggere l'italiano con la fonetica spagnola, e farebbe valutare la pronuncia dello
studente contro la lingua che già parla.**

⭐ **E lo spagnolo dello studente è `es-ES`, lo spagnolo di Spagna**, *come deciso il 30/09 per l'edizione
spagnola:* **«un codice di lingua è una varietà, non un livello di neutralità»**. *Qui non compare in
questa tabella — non è il parlato — ma decide come si scrivono i testi condivisi e le spiegazioni.*

---

## 9 — I NOMI A SCHERMO

*Colonne: **ruolo** → la chiave di `nomiASchermo` · **nome** → il valore.*

⚠️ **Dal 2026-10-13 `native` NON sta qui:** *è nel file dei testi condivisi, perché è la lingua dello
studente e vale per ogni corso che lui studia.*

| Ruolo | Nome |
|---|---|
| `target` | Italiano |
| `corso` | Italiano para españoles |

| | |
|---|---|
| `target` **+ `native`, dal condiviso** | **le scritte dei moduli di abbinamento** — *«ITALIANO → ESPAÑOL» e il contrario.* ⚠️ *La freccia e il maiuscolo sono del codice, i due nomi sono dati — ma da due file diversi* |
| `corso` | **il nome del corso**, dove serve distinguerlo dal nome dell'app |

⚠️ **Senza la riga `corso` il trascrittore si ferma**, e il badge della home resta vuoto finché la
struttura non arriva: *mai un nome sbagliato nel frattempo.*
