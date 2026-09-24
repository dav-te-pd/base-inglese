**Versione: 20260924c**

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

⚠️ **E due cose sono DECISE ma non ancora trascrivibili: la riga città + paese,
e le età in parole.** Il contenuto — quale paese per ogni città, quali età, con
quali colonne — **è scelto e sta nella sezione 4**, in una forma che il
trascrittore non legge. *Finché i due passi di codice non ci sono, le tabelle
della sezione 3 restano a quattro colonne.*

⚠️ **E non è un rinvio per pigrizia: il trascrittore le RIFIUTEREBBE.**
`tests/tools/trascrivi.js` chiede a ogni tabella della sezione 3 **esattamente
quattro colonne** e si ferma con l'errore che le nomina. *Scriverle nella
sezione 3 oggi non produrrebbe un JSON sbagliato: produrrebbe un JSON non
scritto affatto.*

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

| id | it | en | paese it | paese en | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` | Mondovì | Mondovì | Italia | Italy | sì |
| `orig-torino` | Torino | Turin | Italia | Italy | sì |
| `orig-milano` | Milano | Milan | Italia | Italy | sì |
| `orig-roma` | Roma | Rome | Italia | Italy | sì |
| `orig-napoli` | Napoli | Naples | Italia | Italy | sì |
| `orig-palermo` | Palermo | Palermo | Italia | Italy | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Switzerland | sì |
| `orig-nizza` | Nizza | Nice | Francia | France | sì |

⚠️ **QUESTA È L'UNICA TABELLA A SEI COLONNE, E LE ALTRE RESTANO A QUATTRO.**
`trascrivi.js` le accetta tutt'e due e **rifiuta ogni altro numero nominando la
tabella**: le quattro colonne diventano `value`/`it`/`en`/`traducibile`, le sei
aggiungono `paese: { it, en }`.

⚠️ **`places.destinations` NON prende la colonna paese**, ed è una scelta:
nessuna battuta dice il paese di destinazione. Darebbero due colonne che non
legge nessuno — esattamente quello che il passo 1.8 ha appena tolto (`fr`, `es`,
`de`: 147 stringhe vuote, zero lettori).

⚠️ **`orig-lugano` E `orig-nizza` SONO ENTRATE IL 2026-09-24, COL PASSO ②.**

*Il motivo per cui devono esistere:* **«ci sono più italofoni fuori dall'Italia di
quanti se ne pensi: uno studente di Lugano non deve dichiarare un paese che non è
il suo»** *(TABELLE_018).*

⚠️ **E il motivo per cui NON potevano entrare prima era misurato, non
prudenziale:** la battuta `d-4` di `gate` scriveva **`Italy` a mano** — `I am from
{{partenza}}, Italy.` — perché una riga a quattro colonne porta **un valore
solo**, e il paese non aveva modo di arrivare alla frase. Con Lugano lo studente
avrebbe letto **«I am from Lugano, Italy»**, e in italiano **«Vengo da Lugano, in
Italia»**: due frasi false su otto opzioni.

⚠️ **E nessun test le avrebbe viste:** nessuno sceglie Lugano, quindi la suite
sarebbe restata verde. *È il difetto che vive dentro un'opzione che nessuno
prova, ed è il motivo per cui le due righe hanno aspettato invece di entrare.*

**Adesso il paese arriva alla frase con un segnaposto suo:**
`I am from {{partenza}}, {{partenza.paese:en}}.` ⚠️ **E la strada più corta è
stata scartata:** far portare alla colonna `it` il valore già composto — «Lugano,
Svizzera» — **chiude una porta.** *La città DA SOLA serve: «Turin» era una voce
del grado A, una parola che si impara. Dentro una cella composta quella voce non
esiste più.*

⚠️ **E `Italy` È USCITO DAL GRADO A DI `gate` LO STESSO GIORNO** — il grado è
sceso da 12 a 11. *Non è una perdita ma uno spostamento:* una parola che solo una
parte degli studenti incontra nella storia non è una parola dell'episodio, e
**`Italy` torna come voce quando ci sarà l'episodio dei nomi propri** (R.1, parte
3.6 di `inglese-it-edizione.md`) — lì i toponimi sono il contenuto, non un
contorno.

### `places.destinations`

| id | it | en | traducibile |
|---|---|---|---|
| `dest-pechino` | Pechino | Beijing | sì |
| `dest-shanghai` | Shanghai | Shanghai | sì |
| `dest-hong-kong` | Hong Kong | Hong Kong | sì |

---

## 4 — DECISO, NON ANCORA TRASCRIVIBILE

⚠️ **QUESTA SEZIONE NON FINISCE NEL JSON, E NON È UNA BOZZA.** Quello che c'è
qui è **contenuto scelto**, fermo solo perché il codice che lo legge non esiste
ancora. Quando il passo di codice arriva, queste righe si spostano nella
sezione 3 **senza ridecidere niente**.

*Sta in una sezione sua e non fra le tabelle vere per una ragione misurata:
`trascrivi.js` legge le tabelle della sezione 3 per **posizione delle colonne**
e ne pretende **quattro**. Una riga a sei colonne lassù non darebbe un dato
sbagliato — fermerebbe la trascrizione di tutto il file. Qui sotto non la
guarda nessuno.*

---

### ④.1 — IL PAESE DELLE PARTENZE — ✅ **FATTO IL 2026-09-24 (passo ②)**

Le otto righe col paese **sono salite nella sezione 3**, dove sono diventate un
dato vero. *Questa riga resta al posto della tabella per una ragione sola: dice
che la sezione 4 si SVUOTA quando un passo arriva, invece di accumulare copie di
quello che ormai vive altrove.*

---

### ④.2 — LE ETÀ *(aspetta il passo ③ — le età nel magazzino, e il sottoinsieme)*

Oggi le età **non sono qui**: sono valori nudi nella sezione 8 di
`inglese-it-gate.md`, e il codice li trasforma in `{value, it, en}` tutti e tre
uguali. È il motivo per cui si legge `I'm 16 years old`.

**Nome della tabella: `ages.anni`** — ✅ **confermato il 2026-09-24.** Segue la
forma delle altre: radice inglese, foglia italiana, come `people.papa`.

⚠️ **DUE COLONNE, NON TRE — E LA CIFRA RESTA IN `it`. Deciso il 2026-09-24, e la
ragione va letta prima di «uniformare»:**

> **Le due colonne servono due mestieri diversi, e la stessa riga è usata da due
> parti dell'app.**
>
> - **`it` = `16`** è quello che lo studente **SCEGLIE** in Personalizza:
>   scorrere 12·13·14 è più veloce che leggere dodici·tredici·quattordici.
> - **`en` = `sixteen`** è quello che si **SENTE e si PRONUNCIA** nella battuta,
>   e che Voice Practice deve riconoscere.
>
> **Non è un'incoerenza: è la stessa riga letta da due mestieri.**

✅ **E la terza colonna NON serve — verificato nel codice il 2026-09-24, non
supposto:**

| Chi legge | Cosa chiama | Cosa esce |
|---|---|---|
| la tendina di Personalizza | `app/personalizza.js` — costruisce l'`<option>` con **`o.it`** | `16` ✅ |
| la battuta italiana «Ho {{figliaEta}} anni» | `resolveSlotValue(..., 'it')` → `picked.it` | `Ho 16 anni` ✅ |
| la battuta inglese «I'm {{figliaEta}} years old» | `resolveSlotValue(..., 'en')` → `picked.en` | `I'm sixteen years old` ✅ |

⚠️ **CONDIZIONE, E SE SALTA NON SI VEDE: `traducibile` DEVE VALERE `sì` SU OGNI
RIGA.** Con `no`, `resolveSlotValue` restituisce **`it` anche in inglese** — e
si tornerebbe a `I'm 16 years old` senza nessun errore e senza nessun rosso.
*L'assenza vale `sì` (sezione 3), ma qui la colonna è scritta lo stesso: un
valore che se sbagliato non fa rumore non si lascia all'impostazione
predefinita.*

| id | it | en | traducibile |
|---|---|---|---|
| `eta-4` | 4 | four | sì |
| `eta-5` | 5 | five | sì |
| `eta-6` | 6 | six | sì |
| `eta-7` | 7 | seven | sì |
| `eta-8` | 8 | eight | sì |
| `eta-9` | 9 | nine | sì |
| `eta-10` | 10 | ten | sì |
| `eta-11` | 11 | eleven | sì |
| `eta-12` | 12 | twelve | sì |
| `eta-13` | 13 | thirteen | sì |
| `eta-14` | 14 | fourteen | sì |
| `eta-15` | 15 | fifteen | sì |
| `eta-16` | 16 | sixteen | sì |
| `eta-17` | 17 | seventeen | sì |

**Quattordici righe, una tabella sola.** I due slot ne prendono un pezzo —
**confermato il 2026-09-24**:

| slot | righe | predefinito |
|---|---|---|
| `figliaEta` | da `eta-12` a `eta-17` (6) | `eta-16` |
| `figlioEta` | da `eta-4` a `eta-11` (8) | `eta-8` |

⚠️ **Il sottoinsieme è la parte che oggi NON ESISTE nel codice:**
`resolveSlotTable` restituisce **la tabella intera**, e non c'è modo di dire
«solo queste righe». È metà del passo ③.

✅ **COME SI DICHIARA — deciso il 2026-09-24: lo slot ELENCA gli id.** Non un
intervallo `da`/`a`.

⚠️ **E la ragione non è lo stile:** un intervallo dà per scontato che la tabella
sia **ordinata e numerica**, cosa vera oggi per le età e **per nient'altro**.
*Quando smetterà di essere vera non darà un errore: darà l'insieme sbagliato.*
**È la stessa forma di «otto casi su nove» — abbastanza da sembrare giusta, e
rotta su quello che non si guarda.** Gli elenchi lunghi sono un costo di
scrittura; un'ipotesi implicita è un costo di diagnosi.

---

### ④.3 — LA COSA CHE IL PASSO ③ ROMPEREBBE IN SILENZIO

⚠️ **NON È NELLE TABELLE: È IN UNA SKILL DI `gate`, E VA CORRETTA NELLO STESSO
PASSO.** *Trovata il 2026-09-24 contando i segnaposto dentro i corpi delle
skill: sette in tutto, cinque senza suffisso di lingua.*

La skill di `d-8` cita la battuta inglese così:

> La figlia dice "I'm `{{figliaEta}}` **years old**". Il figlio dice solo "I'm
> `{{figlioEta}}`".

**Senza `:en`.** Una skill è prosa italiana, quindi la lingua della chiamata è
`it`: oggi non si vede niente perché per un valore nudo `it` ed `en` **coincidono**.
**Il giorno in cui divergono, la spiegazione dirà `I'm 16 years old` mentre la
battuta sopra dice `I'm sixteen`** — due frasi inglesi diverse sulla stessa
schermata, e nessun test le confronta.

**La correzione esiste già e si legge due skill più sopra:** `d-4` scrive
`{{partenza:en}}` proprio per questo. I due segnaposto di `d-8` diventano
`{{figliaEta:en}}` e `{{figlioEta:en}}`.

*Gli altri tre senza suffisso — `{{partenza}}` in `d-4`, `{{papa}}` e
`{{figliaNome}}` in `d-7` — **restano come sono**: il primo è la metà italiana
della frase (giusto così), gli altri due sono nomi propri, `traducibile: no`,
quindi `it` ed `en` non divergeranno mai.*
