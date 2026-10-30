**Versione: 20261020a**

# Tabelle di personalizzazione — spagnolo per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/spagnolo/it/spagnolo-it-tabelle-personalizzazione.json`.** I criteri con cui un nome o una città
sono stati scelti stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — e da oggi non si racconta qui

⚠️ **LA RIGIDITÀ DEL PARSER NON SI DESCRIVE PIÙ IN QUESTO FILE.** *Vive in un posto solo:
`docs/metodo/FATTI-APP.md`, righe `APP_colonne-per-posizione` e `APP_ramo-sul-numero-colonne`, dove un
test la confronta col codice vero.*

> ⭐ **È la regola 48 applicata a un FATTO invece che a un numero.** *Un fatto ricopiato in tre file
> invecchia in tre posti, e ogni copia può smentire le altre senza che nessuno le legga insieme.*

🔴 **E LA PROVA CHE SERVIVA STAVA QUI. Fino al 2026-10-11 questa sezione diceva che nessun parser legge
questo file.**

| Chi legge questo file | |
|---|---|
| **`tests/tools/trascrivi.js`** | *lo trascrive nel suo JSON* |
| ⭐ **`tests/test_intestazioni.js`** | *dal 2026-10-08: controlla l'intestazione di ogni tabella, colonna per colonna* |

⚠️ **E non serviva una misura per smentirla: la smentiva questo file.** *La sezione «LE RIGHE» dice in
quale chiave del JSON finisce ogni colonna — e solo un parser può farlo.*

⚠️ **I nomi delle colonne non sono liberi dal 2026-10-08**, e la correzione di quella frase è di Claude
Code *(regola 33: resa falsa dal commit `e52d213`, corretta in `d530667`)*.

🔴 **E NON SONO LIBERI NEMMENO I TITOLI E I NUMERI DI SEZIONE** — *misurato l'11/10, e nessuno
l'aveva verificato prima.* **Rinumerare una sezione di questo file ferma la trascrizione.**

⚠️ **Il come sta in `FATTI-APP`, riga `APP_titolo-una-volta`, e qui NON si cita.** *Perché citare un
titolo alla lettera lo fa comparire due volte, e la seconda occorrenza è quella che il parser trova:*
🔴 **la prima stesura di questo paragrafo lo citava, e rompeva la cosa che descrive.**

> ⭐ **E «titoli e numeri sono liberi» è sopravvissuta a una riscrittura fatta per togliere le frasi
> false, perché portava l'attribuzione di chi l'aveva scritta.** *Una frase ricopiata con la sua
> attribuzione sembra verificata.*

🔴 **E qui la frase si smentiva dentro sé stessa:** *«NESSUN PARSER LEGGE QUESTO FILE … lo legge
`trascrivi.js`».* **Due affermazioni opposte in due righe consecutive, copiate dal gemello inglese senza
rileggerle.**

### ② DUE COSE DA SAPERE

⚠️ **Il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella
sezione «GLI SLOT» del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti
diversi.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una cella di tabella le toglie
gli spazi ai lati — deve — quindi uno spazio ai bordi sparirebbe senza un errore.* **In questo file non
ce n'è nessuno.**

### ③ ⚠️ COSA SI COPIA DALL'INGLESE, E COSA NO

**Questo file è stato scritto copiando il gemello inglese e riscrivendo UNA colonna.** *Non da zero, ed
è una scoperta del 2026-09-27:*

⭐ **LA FAMIGLIA È DELLO STUDENTE.** *È «la tua famiglia che parte» — e in questa edizione lo studente è
italiano, **quindi i nomi restano Marco, Giulia, Emma, Tommaso**.*

🔴 **Fino al 2026-10-19 questa riga diceva «LA FAMIGLIA È ITALIANA IN OGNI EDIZIONE», ed era vera finché
lo studente era sempre italiano.** *Il 17/10 è nata `italiano/es`, dove la famiglia è ispanofona e parte
da Città del Messico: la ragione scritta accanto — «è la tua famiglia che parte» — lo diceva già.*
⚠️ **Corretta nel giro di allineamento del 20/10, insieme al gemello inglese.**

| Colonna | Cosa è successo |
|---|---|
| **id** | ✅ **identici all'inglese** — *e devono esserlo: sono gli id salvati nei progressi* |
| **it** | ✅ **identica** |
| **en** → **es** | 🔴 **riscritta**: `Mark` → `Marcos`, `Turin` → `Turín` |
| **traducibile** | ✅ **identica** |

---

## 2 — LE TABELLE CHE ESISTONO

| Nome | Cosa contiene |
|---|---|
| `people.papa` | i nomi del padre |
| `people.mamma` | i nomi della madre |
| `people.figlia` | i nomi della figlia |
| `people.figlio` | i nomi del figlio |
| `people.cognome` | i cognomi della famiglia |
| `places.departures` | le città di partenza |

⚠️ **`places.destinations` NON ESISTE IN QUESTA EDIZIONE, e non è una dimenticanza.** *La destinazione
non è personalizzabile: è dell'edizione — **Ciudad de México** — e si scrive dentro la battuta.* **Se ogni
studente scegliesse una città, le città si brucerebbero e gli episodi dovrebbero restare neutri in
tutte.**

⚠️ **E i nomi delle tabelle NON si traducono.** *L'esempio era la tabella delle età, `ages.anni` e non `ages.anios`;* 🔴 **quella tabella è uscita il 30/10, ma la regola vale per `people.cognome`, che infatti non è `people.apellido`.** *Il nome di una tabella è
un id e lo studente non lo legge: tradurlo per edizione vorrebbe dire che `trascrivi.js` deve sapere come
si chiama in ogni lingua.*


⚠️ **DAL 2026-10-30 `ages.anni` NON C'È PIÙ** — tolta con l'autorizzazione di chi guida il progetto, insieme alla colonna «righe» degli slot: l'età non è più uno slot, è scritta nella battuta (la figlia ha sedici anni, il figlio otto), e la tabella era rimasta senza lettore (regola 50). *Le righe di questa sezione che ne parlano sono storia.*

---

## 3 — LE RIGHE

**Una tabella ha QUATTRO colonne, oppure SEI**, *e quale lo dice la sua intestazione.* **Le quattro,
sempre nello stesso ordine:**

| Colonna | Va in | Cosa vuol dire |
|---|---|---|
| **id** | `value` | l'identificativo salvato nei progressi. ⚠️ **Cambiarlo è una migrazione**, non una correzione |
| **it** | ⭐ **`native`** | come si legge in italiano |
| **es** | ⭐ **`target`** | come si legge in spagnolo |
| **traducibile** | `traducibile` | `sì` → nel dialogo spagnolo si usa la colonna **es** · `no` → si usa la **it** anche in spagnolo |

⚠️ **`traducibile` è una proprietà della RIGA, non della tabella.** *L'assenza vale «sì», ma si scrive
sempre.*

## 🔴 LE INTESTAZIONI RESTANO `it` E `es`, LE CHIAVI DEL JSON NO

**Dal 2026-09-30 le chiavi del JSON sono `native` e `target`, non `it` e `es`.**

| | |
|---|---|
| **Perché le chiavi cambiano** | *con chiavi di lingua, `es` sarebbe **la lingua insegnata** in `spagnolo-it-…` e **quella dello studente** in `inglese-es-…`.* 🔴 **Stessa chiave, ruolo opposto secondo il file** |
| ⭐ **Perché le intestazioni restano le lingue** | *si leggono bene, e dall'8/10 il controllo le lega alla cartella* |

⚠️ **Quindi qui sopra si scrive `it` e `es` perché si leggono bene, e nel JSON escono `native` e
`target`.** *Sono due cose diverse e vanno tenute diverse.*

🔴 **E QUI C'ERA SCRITTO «le parole dell'intestazione sono libere; l'ordine no». DALL'8/10 È IL
CONTRARIO** — *l'ordine è controllato, e le parole quasi tutte.* ⚠️ **Questa riga è sopravvissuta alla
correzione del commit `d530667`, che aveva sistemato la frase gemella ottanta righe più su:** *una
ricerca per testo trova la frase che cerchi, non le sue parafrasi.*

| | |
|---|---|
| **`id` · `paese it` · `paese es` · `traducibile`** | *parole fisse, al loro posto* |
| **`it`** | *si chiama come la cartella* |
| ⭐ **`es`** | *l'unica libera — ma diversa da `it`, e uguale in ogni punto in cui compare* |

### `people.papa`

| id | it | es | traducibile |
|---|---|---|---|
| `papa-marco` | Marco | Marco | no |
| `papa-giancarlo` | Giancarlo | Giancarlo | no |
| `papa-federico` | Federico | Federico | no |

### `people.mamma`

| id | it | es | traducibile |
|---|---|---|---|
| `mamma-giulia` | Giulia | Giulia | no |
| `mamma-anna` | Anna | Anna | no |
| `mamma-nicoletta` | Nicoletta | Nicoletta | no |

### `people.figlia`

| id | it | es | traducibile |
|---|---|---|---|
| `figlia-emma` | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sofia | no |
| `figlia-alice` | Alice | Alice | no |

### `people.figlio`

| id | it | es | traducibile |
|---|---|---|---|
| `figlio-tommaso` | Tommaso | Tommaso | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-giorgio` | Giorgio | Giorgio | no |

### `people.cognome`

| id | it | es | traducibile |
|---|---|---|---|
| `cognome-rossi` | Rossi | Rossi | no |
| `cognome-ferrario` | Ferrario | Ferrario | no |
| `cognome-barberis` | Barberis | Barberis | no |

⚠️ **`cognome-costa` e `cognome-marino` sono parole spagnole vere** — *«costa» e «marino» esistono in
spagnolo con lo stesso significato dell'italiano.* **Restano `no`: un cognome non si traduce mai, e il
fatto che assomigli a una parola non lo rende traducibile.**

### `places.departures`

| id | it | es | paese it | paese es | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` | Mondovì | Mondovì | Italia | Italia | sì |
| `orig-torino` | Torino | Turín | Italia | Italia | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Suiza | sì |

⚠️ **QUESTA È L'UNICA TABELLA A SEI COLONNE, e le altre restano a quattro.** *`trascrivi.js` le accetta
tutte due e rifiuta ogni altro numero nominando la tabella.*

⚠️ **`orig-lugano` e `orig-nizza` esistono perché «ci sono più italofoni fuori dall'Italia di quanti se
ne pensi: uno studente di Lugano non deve dichiarare un paese che non è il suo».** *E il paese arriva
alla frase con un segnaposto suo — `{{partenza.paese:target}}` — non composto dentro la colonna `es`:* **la
città da sola serve, perché `Turín` è una voce del grado A.**

⭐ **Sei città su otto hanno la stessa forma o cambiano un accento.** *`Turín`, `Milán`, `Nápoles`, `Niza`
— e Mondovì, Roma, Palermo, Lugano identiche.* ⚠️ **In inglese erano quattro parole diverse: `Turin`,
`Milan`, `Naples`, `Nice`.**

---

## 4 — DECISO, NON ANCORA TRASCRIVIBILE

⚠️ **QUESTA SEZIONE NON FINISCE NEL JSON.** *Quello che c'è qui è contenuto scelto, fermo solo perché il
codice che lo legge non esiste ancora.*

**Oggi è vuota:** *i due passi che l'inglese aspettava — il paese delle partenze e le età in parole —
**sono già codice funzionante**, e questa edizione nasce dopo.*

⭐ **È il primo vantaggio concreto di essere la seconda edizione: non eredita i rinvii della prima.**

---

## 5 — IL MATERIALE PER `nombres-propios`

*Non è dato: è una misura su questo file, e serve quando si scriverà quell'episodio.*

| Gruppo | Quanti | Esempi |
|---|---|---|
| **Nomi con una forma spagnola** | **23** | Tommaso → Tomás · Chiara → Clara · Filippo → Felipe · Stefano → Esteban |
| **Nomi identici** | **14** | Emma · Laura · Elena · Leo · Lorenzo · Martina |
| **Cognomi, nessuna forma spagnola** | **9** | Costa · Rossi · Barberis |

⚠️ **In inglese i nomi con una forma diversa erano 30, qui sono 23** — *e molti dei 23 cambiano solo una
lettera o un accento: `Marcos`, `Sofía`, `Mateo`, `Ana`.*

⭐ **Quindi la lezione spagnola è più sfumata di quella inglese:** *lì la domanda era «ha una forma
inglese o no?». Qui sono tre gradi — **identico**, **cambia un segno**, **cambia davvero** — e il terzo
gruppo è quello che insegna.*
