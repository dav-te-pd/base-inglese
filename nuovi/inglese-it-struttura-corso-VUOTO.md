**Versione: VUOTO-20260923a**

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

⚠️ **RINUMERARE UNA SEZIONE ROMPE IL TEST.** È il motivo per cui **qui il 6 non
esiste**: la sezione che lo portava è passata in RAGIONI, e chiudere il buco
tirando indietro il 7 farebbe fallire tre asserzioni. *Il buco non è un difetto:
è il segno visibile che quei numeri sono un'interfaccia.*

⚠️ **E il 5 non è cercato da nessuno:** la sezione dei passi non la legge il
parser — è un dato che trascrivo io. Il suo numero è libero, e sta lì perché è
il posto dove un lettore lo cerca.

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

### ② COSA NON MI SERVE PIÙ DI QUELLO CHE STAVA QUI

**Tutto questo è passato in RAGIONI, e non lo leggo mai:**

| Stava in | Cosa |
|---|---|
| `1 — IL FILE DI STRUTTURA` | l'elenco delle chiavi, il perché sta in un file per edizione |
| `5 — LE REGOLE DI ESITO` | le soglie vivono in `APP_CONFIG`, non in questo JSON |
| `6 — LE SEQUENZE DEI MODULI` | i principi dell'ordine, il pannello Admin che scrive solo in `localStorage`, l'eccezione che si scrive per intero |
| ovunque | i perché delle categorie, «la categoria non dice dove sta l'episodio», «lo studente legge solo il nome», la tabella dei quattro casi `sequence`/`moduleOrder` |
| `9`, `10` | la checklist e l'edizione nuova |

⚠️ **E una cosa che NON stava qui e nemmeno altrove: i 22 passi di
`narrativo-standard`.** Oggi esistono **solo dentro il JSON**, senza nessuna
fonte markdown — per una decisione dichiarata *(«i passi si modificano lì»)*.
**Se resta così, questo file non li porta.** È una domanda aperta, e la risposta
decide se qui nasce una sezione in più.

---

## 2 — I GRADI

*Colonne, nell'ordine: **lettera** → `grades` e chiave di `gradeNames` · **nome
mostrato** → valore di `gradeNames`. La terza colonna non viene letta.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| X | Nome che vede lo studente | descrizione libera, non letta |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → chiave di `moduleTypes` (i backtick si tolgono) · **etichetta**
→ `moduleTypes.<id>.label`. L'ordine delle righe è l'ordine delle chiavi.*

| Id | Etichetta mostrata | A cosa serve |
|---|---|---|
| `esempio-categoria` | Etichetta | descrizione libera, non letta |

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **sottotitolo**
→ `.subtitle`. Nome e sottotitolo si confrontano carattere per carattere.*

| Id | Nome | Sottotitolo |
|---|---|---|
| `esempioModulo` | Nome Del Modulo | Sottotitolo in italiano |

---

## 5 — LE SEQUENZE DEI MODULI

*Una sequenza è una lista ordinata di coppie `{ module, grade }` → `sequences`
nel JSON, una chiave per nome. **Il modulo** è un id della sezione 4. **Il grado**
è una lettera della sezione 2, oppure `—` quando il passo non ne ha uno (Your
Story). L'ordine delle righe è l'ordine dei passi; la colonna `#` è per chi
legge, non un dato.*

⚠️ **NESSUN TEST LEGGE ANCORA QUESTA SEZIONE.** Finché non ce n'è uno, il
markdown e il JSON possono divergere in silenzio — che è esattamente il buco che
`[Ordine]` ha chiuso per gli episodi.

### ⚠️ PERCHÉ QUESTA SEZIONE ESISTE, VISTO CHE IL 2026-09-21 ERA STATO DECISO IL CONTRARIO

**La decisione di allora (STRUTTURA-CORSO_017) era: «i passi stanno solo nel
JSON e si modificano lì».** Aveva due ragioni, e **una è caduta misurandola**:

| La ragione | Cosa è successo |
|---|---|
| *«due elenchi sugli stessi passi divergono al primo riordino»* | **regge ancora** — ed è il motivo per cui questa sezione ha bisogno di un test, non di una promessa |
| *«il Pannello Admin ci scrive dentro»* | ⚠️ **caduta il 2026-09-22.** Misurato: il pannello scrive in `localStorage`, chiave `baseinglese:configOverrides` — **quel browser soltanto**. Non arriva mai al JSON, non lo vede nessun altro, sparisce svuotando i dati del sito |

**Quindi oggi l'unico scrittore di quel JSON sono io, come per ogni altro dato
dell'edizione — e i 22 passi restavano l'ULTIMO dato senza fonte markdown.**
*Riordinarli voleva dire farmi modificare il JSON a mano: l'unico posto del
progetto dove una decisione si prendeva senza passare da un documento.*

**Deciso il 2026-09-23. La 017 non è stata sbagliata: era vera finché la sua
seconda ragione lo era.**

### `nome-della-sequenza`

| # | modulo | grado |
|---|---|---|
| 1 | `esempioModulo` | — |
| 2 | `unAltroModulo` | X |

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
| `esempio-id` | Nome che vede lo studente | `storia` | `narrativo-standard` |

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) ·
**valore**. Le due si confrontano separate: parlare e ascoltare sono due cose.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `xx-XX` |
| `speech.recognitionLang` | `xx-XX` |
