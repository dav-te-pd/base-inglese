**Versione: 20261009a**

# Tabelle di personalizzazione — spagnolo per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/spagnolo/it/spagnolo-it-tabelle-personalizzazione.json`.** I criteri con cui un nome o una città
sono stati scelti stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER

⚠️ **NESSUN PARSER LEGGE QUESTO FILE, come per il gemello inglese.** *Lo legge `trascrivi.js`, che
pretende **esattamente quattro colonne** per le tabelle della sezione 3 — o sei per quella delle
partenze — e si ferma con l'errore che le nomina.*

**Titoli e numeri sono liberi.** ⚠️ *I nomi delle colonne no, dal 2026-10-08: il trascrittore controlla l'intestazione di ogni tabella colonna per colonna (`INTESTAZIONI_TABELLE`), e resta libera solo la cella della lingua insegnata. Corretto da Claude Code (regola 33): reso falso dal commit `e52d213`.* **Li scrivo comunque nella stessa grammatica del file
inglese:** *una forma decisa quando non serve costa zero; decisa quando serve costa una migrazione.*

### ② DUE COSE DA SAPERE

⚠️ **Il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella
sezione 7 del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti diversi.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una cella di tabella le toglie
gli spazi ai lati — deve — quindi uno spazio ai bordi sparirebbe senza un errore.* **In questo file non
ce n'è nessuno.**

### ③ ⚠️ COSA SI COPIA DALL'INGLESE, E COSA NO

**Questo file è stato scritto copiando il gemello inglese e riscrivendo UNA colonna.** *Non da zero, ed
è una scoperta del 2026-09-27:*

**LA FAMIGLIA È ITALIANA IN OGNI EDIZIONE.** *È «la tua famiglia che parte», e lo studente è italiano —
**quindi i nomi restano Marco, Giulia, Emma, Tommaso**.*

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
| `ages.anni` | le età, da 4 a 17 |

⚠️ **`places.destinations` NON ESISTE IN QUESTA EDIZIONE, e non è una dimenticanza.** *La destinazione
non è personalizzabile: è dell'edizione — **Ciudad de México** — e si scrive dentro la battuta.* **Se ogni
studente scegliesse una città, le città si brucerebbero e gli episodi dovrebbero restare neutri in
tutte.**

⚠️ **E il nome della tabella delle età resta `ages.anni`, non `ages.anios`.** *Il nome di una tabella è
un id e lo studente non lo legge: tradurlo per edizione vorrebbe dire che `trascrivi.js` deve sapere come
si chiama in ogni lingua.*

---

## 3 — LE RIGHE

**Ogni tabella ha le stesse quattro colonne, sempre nello stesso ordine:**

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
| ⭐ **Perché le intestazioni no** | *`APP_colonne-per-posizione`: ogni parser legge le colonne **per posizione, mai per nome**.* **Le parole dell'intestazione sono libere; l'ordine no** |

⚠️ **Quindi qui sopra si scrive `it` e `es` perché si leggono bene, e nel JSON escono `native` e
`target`.** *Sono due cose diverse e vanno tenute diverse.*

### `people.papa`

| id | it | es | traducibile |
|---|---|---|---|
| `papa-marco` | Marco | Marcos | no |
| `papa-giancarlo` | Giancarlo | Juan Carlos | no |
| `papa-francesco` | Francesco | Francisco | no |
| `papa-andrea` | Andrea | Andrés | no |
| `papa-luca` | Luca | Lucas | no |
| `papa-paolo` | Paolo | Pablo | no |
| `papa-stefano` | Stefano | Esteban | no |
| `papa-davide` | Davide | David | no |
| `papa-claudio` | Claudio | Claudio | no |
| `papa-federico` | Federico | Federico | no |

### `people.mamma`

| id | it | es | traducibile |
|---|---|---|---|
| `mamma-giulia` | Giulia | Julia | no |
| `mamma-anna` | Anna | Ana | no |
| `mamma-chiara` | Chiara | Clara | no |
| `mamma-nicoletta` | Nicoletta | Nicoletta | no |
| `mamma-laura` | Laura | Laura | no |
| `mamma-elena` | Elena | Elena | no |
| `mamma-silvia` | Silvia | Silvia | no |
| `mamma-francesca` | Francesca | Francisca | no |

### `people.figlia`

| id | it | es | traducibile |
|---|---|---|---|
| `figlia-emma` | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sofía | no |
| `figlia-alice` | Alice | Alicia | no |
| `figlia-giorgia` | Giorgia | Giorgia | no |
| `figlia-martina` | Martina | Martina | no |
| `figlia-sara` | Sara | Sara | no |
| `figlia-chiara` | Chiara | Clara | no |
| `figlia-beatrice` | Beatrice | Beatriz | no |

### `people.figlio`

| id | it | es | traducibile |
|---|---|---|---|
| `figlio-tommaso` | Tommaso | Tomás | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-marco` | Marco | Marcos | no |
| `figlio-giorgio` | Giorgio | Jorge | no |
| `figlio-matteo` | Matteo | Mateo | no |
| `figlio-lorenzo` | Lorenzo | Lorenzo | no |
| `figlio-simone` | Simone | Simón | no |
| `figlio-filippo` | Filippo | Felipe | no |
| `figlio-claudio` | Claudio | Claudio | no |
| `figlio-federico` | Federico | Federico | no |
| `figlio-paolo` | Paolo | Pablo | no |

### `people.cognome`

| id | it | es | traducibile |
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

⚠️ **`cognome-costa` e `cognome-marino` sono parole spagnole vere** — *«costa» e «marino» esistono in
spagnolo con lo stesso significato dell'italiano.* **Restano `no`: un cognome non si traduce mai, e il
fatto che assomigli a una parola non lo rende traducibile.**

### `places.departures`

| id | it | es | paese it | paese es | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` | Mondovì | Mondovì | Italia | Italia | sì |
| `orig-torino` | Torino | Turín | Italia | Italia | sì |
| `orig-milano` | Milano | Milán | Italia | Italia | sì |
| `orig-roma` | Roma | Roma | Italia | Italia | sì |
| `orig-napoli` | Napoli | Nápoles | Italia | Italia | sì |
| `orig-palermo` | Palermo | Palermo | Italia | Italia | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Suiza | sì |
| `orig-nizza` | Nizza | Niza | Francia | Francia | sì |

⚠️ **QUESTA È L'UNICA TABELLA A SEI COLONNE, e le altre restano a quattro.** *`trascrivi.js` le accetta
tutte due e rifiuta ogni altro numero nominando la tabella.*

⚠️ **`orig-lugano` e `orig-nizza` esistono perché «ci sono più italofoni fuori dall'Italia di quanti se
ne pensi: uno studente di Lugano non deve dichiarare un paese che non è il suo».** *E il paese arriva
alla frase con un segnaposto suo — `{{partenza.paese:target}}` — non composto dentro la colonna `es`:* **la
città da sola serve, perché `Turín` è una voce del grado A.**

⭐ **Sei città su otto hanno la stessa forma o cambiano un accento.** *`Turín`, `Milán`, `Nápoles`, `Niza`
— e Mondovì, Roma, Palermo, Lugano identiche.* ⚠️ **In inglese erano quattro parole diverse: `Turin`,
`Milan`, `Naples`, `Nice`.**

### `ages.anni`

⚠️ **DUE COLONNE, E LA CIFRA RESTA IN `it`.** *Le due servono due mestieri diversi:*

> - **`it` = `16`** è quello che lo studente **SCEGLIE** in Personalizza: *scorrere 12·13·14 è più veloce
>   che leggere doce·trece·catorce.*
> - **`es` = `dieciséis`** è quello che si **SENTE e si PRONUNCIA** nella battuta, e che Voice Practice
>   deve riconoscere.
>
> **Non è un'incoerenza: è la stessa riga letta da due mestieri.**

⚠️ **`traducibile` vale `sì` su ogni riga, ed è scritto anche se l'assenza lo varrebbe.** *Con `no` si
tornerebbe a «Tengo 16 años» **senza nessun errore e senza nessun rosso**.*

| id | it | es | traducibile |
|---|---|---|---|
| `eta-4` | 4 | cuatro | sì |
| `eta-5` | 5 | cinco | sì |
| `eta-6` | 6 | seis | sì |
| `eta-7` | 7 | siete | sì |
| `eta-8` | 8 | ocho | sì |
| `eta-9` | 9 | nueve | sì |
| `eta-10` | 10 | diez | sì |
| `eta-11` | 11 | once | sì |
| `eta-12` | 12 | doce | sì |
| `eta-13` | 13 | trece | sì |
| `eta-14` | 14 | catorce | sì |
| `eta-15` | 15 | quince | sì |
| `eta-16` | 16 | dieciséis | sì |
| `eta-17` | 17 | diecisiete | sì |

⚠️ **`dieciséis` porta l'accento scritto e `diecisiete` no.** *Non è un errore di battitura: è la regola
dell'accento, e `gate` la porta come regola generale.*

**Quattordici righe, una tabella sola: i due slot ne prendono un pezzo** con la colonna «righe» della
sezione 7 del file episodio — *la figlia `eta-12`…`eta-17`, il figlio `eta-4`…`eta-11`.*

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
