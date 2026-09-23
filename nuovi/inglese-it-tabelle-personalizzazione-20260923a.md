**Versione: 20260923a**

# Tabelle di personalizzazione — inglese per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-tabelle-personalizzazione.json`.** I criteri con cui
un nome o una città sono stati scelti stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato il 2026-09-23

⚠️ **NESSUN PARSER. Zero test e zero codice leggono questo file: lo leggo solo
io.** *Misurato: nessun test lo apre per nome, e i soli markdown letti da un
test sono `inglese-it-struttura-corso.md`, `inglese-it-gate.md` e
`inglese-it-aircraft-door.md`.*

**Quindi titoli, numeri e nomi delle colonne qui sono liberi.** Li scrivo lo
stesso nella stessa grammatica degli altri due — **una tabella per tabella, le
colonne sempre nello stesso ordine** — perché il giorno in cui un test lo
leggerà non ci sia niente da riscrivere. *Una forma decisa quando non serve
costa zero; decisa quando serve costa una migrazione.*

### ② DUE COSE DA SAPERE

⚠️ **Il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella
sezione 7 del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti
diversi.*

⚠️ **E una cosa che oggi sta qui e non può ancora arrivare al JSON: le età in
parole, e la riga con città + paese.** Le prime vogliono che le età escano dal
file episodio ed entrino qui, **più un modo di usare solo un pezzo di una
tabella, che oggi non esiste**; la seconda vuole che una riga possa portare
**due valori** invece di uno, e oggi il codice ne restituisce **uno solo**.
*Sono due passi di codice: finché non ci sono, questo file porta la forma a
quattro colonne.*

---

## 2 — LE TABELLE CHE ESISTONO

*Il **nome** è quello che una riga di slot scrive nella colonna «tabella» del
file episodio. Le tabelle interne a un episodio — oggi le età — **non stanno
qui**: stanno nella sezione 8 di quell'episodio.*

| Nome | Cosa contiene |
|---|---|
| `people.papa` | i nomi del padre |
| `people.mamma` | i nomi della madre |
| `people.figlia` | i nomi della figlia |
| `people.figlio` | i nomi del figlio |
| `people.cognome` | i cognomi della famiglia |
| `places.departures` | le città di partenza |
| `places.destinations` | le città di destinazione |

---

## 3 — LE RIGHE

**Ogni tabella ha le stesse quattro colonne, sempre nello stesso ordine:**

| Colonna | Va in | Cosa vuol dire |
|---|---|---|
| **id** | `value` | l'identificativo salvato nei progressi dello studente. ⚠️ **Cambiarlo è una migrazione**, non una correzione |
| **it** | `it` | come si legge in italiano |
| **en** | `en` | come si legge in inglese |
| **traducibile** | `traducibile` | `sì` → nel dialogo inglese si usa la colonna **en** · `no` → si usa la **it** anche in inglese |

⚠️ **`traducibile` è una proprietà della RIGA, non della tabella.** *Fino al
2026-09-20 si deduceva dal nome della tabella — «sta in `people.`, quindi non si
traduce» — e un cognome traducibile o una città che non si traduce non avevano
modo di esistere.*

⚠️ **L'assenza vale «sì».** Una riga che non lo dichiara si traduce.

### `people.papa`

| id | it | en | traducibile |
|---|---|---|---|
| `papa-marco` | Marco | Mark | no |
| `papa-giancarlo` | Giancarlo | Giancarlo | no |
| `papa-francesco` | Francesco | Francis | no |
| `papa-andrea` | Andrea | Andrew | no |
| `papa-luca` | Luca | Luke | no |
| `papa-paolo` | Paolo | Paul | no |
| `papa-stefano` | Stefano | Stephen | no |
| `papa-davide` | Davide | David | no |
| `papa-claudio` | Claudio | Claude | no |
| `papa-federico` | Federico | Frederick | no |

### `people.mamma`

| id | it | en | traducibile |
|---|---|---|---|
| `mamma-giulia` | Giulia | Julia | no |
| `mamma-anna` | Anna | Ann | no |
| `mamma-chiara` | Chiara | Clare | no |
| `mamma-nicoletta` | Nicoletta | Nicole | no |
| `mamma-laura` | Laura | Laura | no |
| `mamma-elena` | Elena | Helen | no |
| `mamma-silvia` | Silvia | Sylvia | no |
| `mamma-francesca` | Francesca | Frances | no |

### `people.figlia`

| id | it | en | traducibile |
|---|---|---|---|
| `figlia-emma` | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sophie | no |
| `figlia-alice` | Alice | Alice | no |
| `figlia-giorgia` | Giorgia | Georgia | no |
| `figlia-martina` | Martina | Martina | no |
| `figlia-sara` | Sara | Sarah | no |
| `figlia-chiara` | Chiara | Clare | no |
| `figlia-beatrice` | Beatrice | Beatrice | no |

### `people.figlio`

| id | it | en | traducibile |
|---|---|---|---|
| `figlio-tommaso` | Tommaso | Thomas | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-marco` | Marco | Mark | no |
| `figlio-giorgio` | Giorgio | George | no |
| `figlio-matteo` | Matteo | Matthew | no |
| `figlio-lorenzo` | Lorenzo | Lawrence | no |
| `figlio-simone` | Simone | Simon | no |
| `figlio-filippo` | Filippo | Philip | no |
| `figlio-claudio` | Claudio | Claude | no |
| `figlio-federico` | Federico | Frederick | no |
| `figlio-paolo` | Paolo | Paul | no |

### `people.cognome`

| id | it | en | traducibile |
|---|---|---|---|
| `cognome-costa` | Costa | Costa | no |
| `cognome-rossi` | Rossi | Rossi | no |
| `cognome-bianchi` | Bianchi | Bianchi | no |
| `cognome-ferrari` | Ferrari | Ferrari | no |
| `cognome-ferrario` | Ferrario | Ferrario | no |
| `cognome-russo` | Russo | Russo | no |
| `cognome-marino` | Marino | Marino | no |
| `cognome-barberis` | Barberis | Barberis | no |
| `cognome-ambruosi` | Ambruosi | Ambruosi | no |

### `places.departures`

| id | it | en | traducibile |
|---|---|---|---|
| `orig-mondovi` | Mondovì | Mondovì | sì |
| `orig-torino` | Torino | Turin | sì |
| `orig-milano` | Milano | Milan | sì |
| `orig-roma` | Roma | Rome | sì |
| `orig-napoli` | Napoli | Naples | sì |
| `orig-palermo` | Palermo | Palermo | sì |
| `orig-lugano` | Lugano | Lugano | sì |
| `orig-nizza` | Nizza | Nice | sì |

### `places.destinations`

| id | it | en | traducibile |
|---|---|---|---|
| `dest-pechino` | Pechino | Beijing | sì |
| `dest-shanghai` | Shanghai | Shanghai | sì |
| `dest-hong-kong` | Hong Kong | Hong Kong | sì |
