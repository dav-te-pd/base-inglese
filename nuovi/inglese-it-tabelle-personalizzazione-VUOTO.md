**Versione: VUOTO-20261009b**

# Tabelle di personalizzazione — {lingua} per {studente}

<!-- MODELLO DI UN FILE TABELLE — 2026-10-09.
     È la forma ESATTA di un file vivo: sezioni 1-3 e niente altro.
     Si copia, si riempie, si rinomina in {lingua}-{studente}-tabelle-personalizzazione.md.

     ⭐ SI TRASCRIVE COM'È, intero. Un modello che non si trascrive può mentire
     sulla propria forma senza che nessuno se ne accorga — ed è già successo:
     fino al 2026-10-09 l'indice elencava `people.esempio` e le sezioni erano
     sette, coi nomi veri delle tabelle. Indice e sezioni non combaciavano.

     ⚠️ PORTA TUTTE E DUE LE FORME, a quattro colonne e a sei, perche'
     `trascrivi.js` ramifica su quel numero. Un modello con una forma sola non
     documenta il ramo che nessuno vede. -->

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/{lingua}/{studente}/{lingua}-{studente}-tabelle-personalizzazione.json`.** I criteri con cui un
nome o una città sono stati scelti stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato il 2026-10-09

🔴 **FINO AL 2026-10-08 QUI C'ERA SCRITTO «NESSUN PARSER. Zero test e zero codice leggono questo file:
lo leggo solo io». NON È PIÙ VERO, E LA RIGA SOTTO LO DICEVA GIÀ.**

| Chi legge questo file | Da quando |
|---|---|
| **`tests/tools/trascrivi.js`** — *lo trascrive nel suo JSON* | *da sempre* |
| ⭐ **`tests/test_intestazioni.js`** — *controlla l'intestazione di ogni tabella, colonna per colonna* | **2026-10-08** |

⚠️ **E la contraddizione è nata dentro una correzione.** *Il commit `e52d213` ha corretto la frase sui
nomi delle colonne e ha lasciato in piedi quella sopra, che la smentiva.* ⭐ **Una correzione si legge
nel suo paragrafo, non nella sua riga.**

### ② ⚠️ LE INTESTAZIONI NON SONO LIBERE, DAL 2026-10-08

**`trascrivi.js` confronta l'intestazione di ogni tabella con `INTESTAZIONI_TABELLE`, cella per cella.**

| | |
|---|---|
| **le parole fisse** | `id` · `paese {studente}` · `paese {lingua}` · `traducibile` — **al loro posto** |
| **la colonna dello STUDENTE** | *si chiama come la cartella: `it` in `inglese/it/`* |
| ⭐ **la colonna della lingua INSEGNATA** | *l'unica libera — `en`, `es` — ma **diversa** da quella dello studente, e **uguale in ogni punto in cui compare*** |

⚠️ **E l'ordine qui è l'OPPOSTO dei gradi di un episodio: prima lo studente, poi la lingua insegnata.**
*Nei gradi è `en | it`; qui è `it | en`.* 🔴 **Non è un'incoerenza da sistemare: è come sono scritti i
file, e il controllo lo sa.**

⭐ **In una tabella a sei colonne la lingua insegnata compare DUE VOLTE** — `en` e `paese en` — **e devono
essere la stessa.** *Una tabella `en` con `paese es` si ferma.*

### ③ COSA NON STA QUI, E PERCHÉ

| Cosa | Perché non sta qui |
|---|---|
| «Com'è fatta una riga» spiegata a parole | la dicono le colonne |
| i criteri con cui una città o un nome sono stati scelti | sono i criteri, non i dati |
| «origine e destinazione non coincidono mai», le città con l'articolo | sono regole di scrittura |
| una sezione «APERTI» | è lo stato del lavoro |
| il **predefinito** accanto a un id | ⚠️ **non è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella sezione «GLI SLOT» del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti diversi* |

### ④ 🔴 E DUE COSE CHE QUI ERANO DICHIARATE «IMPOSSIBILI» SONO FATTE

**Fino al 2026-10-09 questa sezione diceva: «le età in parole e la riga città + paese non possono
ancora arrivare al JSON — sono due passi di codice, e finché non ci sono questo file porta la forma a
quattro colonne».**

| Quello che era in sospeso | Quando è stato fatto |
|---|---|
| **le età in parole, e usare solo un PEZZO di una tabella** | ⭐ **2026-09-24**, passo 1.8-bis ③ — *`ages.anni` sta qui, e gli slot hanno la colonna «righe»* |
| **una riga che porta DUE valori — città + paese** | ⭐ *la forma a sei colonne esiste, ed è trascritta* |

⚠️ **Quindi «questo file porta la forma a quattro colonne» era falso in tutti e due i sensi**, e portava
con sé una terza cosa falsa: *«le tabelle interne a un episodio — oggi le età — non stanno qui»*. **Le
età stanno qui dal 24 settembre.**

> 🔴 **Tre frasi false in una sezione, e nessuna l'ha scritta sbagliata: si sono rotte da sole, quando
> il lavoro che dichiaravano impossibile è stato fatto.** ⭐ *Un file che descrive il mondo invecchia
> anche se nessuno lo apre.*

---

## 2 — LE TABELLE CHE ESISTONO

*Il **nome** è quello che una riga di slot scrive nella colonna «tabella» del file episodio.*

⚠️ **QUESTO INDICE DEVE ELENCARE ESATTAMENTE LE SEZIONI DELLA PARTE 3, NÉ UNA IN PIÙ NÉ UNA IN MENO.**
🔴 *Fino al 2026-10-09 ne elencava una e le sezioni erano sette: il modello non si trascriveva intero, e
quindi non provava la propria forma.*

| Nome | Cosa contiene |
|---|---|
| `people.esempio` | *una tabella a **quattro** colonne* |
| `places.esempio` | *una tabella a **sei** colonne — città + paese* |

⭐ **Due e non una, di proposito: `trascrivi.js` ramifica su quel numero, e un modello con una forma sola
non documenta il ramo.**

---

## 3 — LE RIGHE

**Una tabella ha QUATTRO colonne, oppure SEI. Nessun altro numero.** *Qualunque altro ferma il
trascrittore nominando la tabella.*

### La forma a quattro colonne

| Colonna | Va in | Cosa vuol dire |
|---|---|---|
| **id** | `value` | l'identificativo salvato nei progressi dello studente. ⚠️ **Cambiarlo è una migrazione**, non una correzione |
| **{studente}** | ⭐ **`native`** | come si legge nella lingua di chi studia |
| **{lingua}** | ⭐ **`target`** | come si legge nella lingua che si impara |
| **traducibile** | `traducibile` | `sì` → nel dialogo si usa la colonna della lingua insegnata · `no` → si usa quella dello studente anche lì |

### La forma a sei colonne

*Le stesse quattro, più il paese nelle due lingue, prima di `traducibile`.*

| Colonna | Va in |
|---|---|
| **paese {studente}** | `paese.native` |
| **paese {lingua}** | `paese.target` |

⚠️ **Il paese arriva alla battuta con un segnaposto suo — `{{partenza.paese:target}}` — e non composto
dentro la colonna della città.** *Perché la città da sola serve: è una voce del grado A.*

## ⚠️ LE CHIAVI DEL JSON SONO RUOLI, LE INTESTAZIONI NO

| | |
|---|---|
| **Perché le chiavi sono `native` e `target`** | *con chiavi di lingua, `es` sarebbe **la lingua insegnata** in `spagnolo-it-…` e **quella dello studente** in `inglese-es-…`.* 🔴 **Stessa chiave, ruolo opposto secondo il file** |
| **Perché le intestazioni restano le lingue** | *si leggono bene, e il controllo le lega alla cartella* |

⚠️ **`traducibile` è una proprietà della RIGA, non della tabella.** *Fino al 2026-09-20 si deduceva dal
nome della tabella — «sta in `people.`, quindi non si traduce» — e un cognome traducibile o una città
che non si traduce non avevano modo di esistere.* **L'assenza vale «sì», ma si scrive sempre.**

### `people.esempio`

| id | it | en | traducibile |
|---|---|---|---|
| `esempio-id` | Come si scrive nella lingua dello studente | Come si scrive nella lingua insegnata | no |

### `places.esempio`

| id | it | en | paese it | paese en | traducibile |
|---|---|---|---|---|---|
| `esempio-id` | Come si scrive nella lingua dello studente | Come si scrive nella lingua insegnata | Il paese, per lo studente | Il paese, nella lingua insegnata | sì |
