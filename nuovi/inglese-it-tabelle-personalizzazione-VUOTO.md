**Versione: VUOTO-20260923a**

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

### ② COSA NON MI SERVE PIÙ DI QUELLO CHE STAVA QUI

| Cosa | Perché non mi serve |
|---|---|
| «Com'è fatta una riga» spiegata a parole | la dicono le colonne |
| perché Lugano e Nizza, perché la Cina, i quattro criteri delle destinazioni | sono i criteri, non i dati |
| «origine e destinazione non coincidono mai», le città con l'articolo | sono regole di scrittura |
| la sezione «APERTI» | è lo stato del lavoro |
| il **predefinito** segnato `(pred.)` accanto a un id | ⚠️ **il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella sezione 7 del file episodio. Due episodi possono pescare dalla stessa tabella con predefiniti diversi |

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
| `people.esempio` | descrizione libera, non letta |

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
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | no |

### `people.mamma`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | no |

### `people.figlia`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | no |

### `people.figlio`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | no |

### `people.cognome`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | no |

### `places.departures`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | sì |

### `places.destinations`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive in italiano | Come si scrive in inglese | sì |
