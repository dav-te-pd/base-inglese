**Versione: VUOTO-20261011c**

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

### ① QUANTO È RIGIDO IL PARSER — e un modello non lo racconta

⚠️ **LA RIGIDITÀ DEL PARSER NON SI DESCRIVE QUI, e un modello è il posto dove descriverla costa di
più:** *quello che un modello tiene, lo regala a ogni file che nasce da lui.*

**Vive in un posto solo:** `docs/metodo/FATTI-APP.md`, *righe* `APP_colonne-per-posizione` *e*
`APP_ramo-sul-numero-colonne` — **dove un test la confronta col codice vero.**

> ⭐ **Un fatto ricopiato in tre file invecchia in tre posti, e ogni copia può smentire le altre senza
> che nessuno le legga insieme.**

🔴 **È già successo tre volte, a questo modello e ai suoi due gemelli.** *Qui c'era scritto «NESSUN
PARSER. Zero test e zero codice leggono questo file» — mentre il trascrittore lo trascrive da sempre, e
`test_intestazioni.js` lo legge dall'8/10.*

🔴 **E la prima stesura di questa correzione, il 2026-10-09, ha tolto il fatto dai due file veri e se
l'è tenuto.** *Era il quarto posto dove quel fatto viveva.*

**Quello che un modello deve dire del parser è una riga sola:**

⚠️ **L'intestazione di ogni tabella è controllata colonna per colonna**, e **l'unica cella libera è
quella della lingua insegnata** — *diversa da quella dello studente, e uguale in ogni punto in cui
compare.* ⚠️ **E l'ordine qui è l'OPPOSTO dei gradi di un episodio:** *nei gradi è la lingua insegnata
prima, qui è lo studente prima.* **Il perché e il resto stanno in `FATTI-APP`.**

🔴 **E NON SONO LIBERI NEMMENO I TITOLI E I NUMERI DI SEZIONE DI QUESTO FILE.** *Rinumerare una
sezione ferma la trascrizione.* ⚠️ **Il come sta in `FATTI-APP`, riga `APP_titolo-una-volta`.**

⚠️ **E QUI I TITOLI NON SI CITANO ALLA LETTERA, MAI.** *Una citazione diventa la seconda occorrenza di
quel titolo, e il parser trova la seconda.* 🔴 *L'11/10 la prima stesura di questo paragrafo citava
l'indice per intero: **il paragrafo che spiega la trappola ci era caduto dentro**, e il controllo l'ha
fermato. Si scrive il nome della sezione senza i cancelletti, come fa questa riga.*

⚠️ *Misurato l'11/10. Fino a quel giorno tutti e tre questi file dicevano «titoli e numeri sono
liberi», e nessuno l'aveva verificato.*

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
