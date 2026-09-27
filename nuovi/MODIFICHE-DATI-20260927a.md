**Versione: 20260927a**

# Modifiche ai file DATI — due pacchetti

> **Ogni modifica è una cella, con il prima e il dopo.** *Non ricopio i file interi: cambiare tre celle
> ricopiando duecento righe è il modo in cui se ne cambia una quarta per sbaglio.*
>
> ⚠️ **I numeri attesi di ogni file NON cambiano.** *È la rete: se dopo queste modifiche un conto non
> torna, qualcosa è entrato che non doveva.*

---

## ⚠️ PERCHÉ DUE PACCHETTI

**Il secondo pacchetto cambia la FORMA di due tabelle** — due colonne nuove. *Mandarlo adesso, mentre
l'allineamento del primo è in corso, darebbe un bersaglio mobile.*

**E c'è una ragione più forte: le due colonne nuove le ha chieste lo SPAGNOLO, e lo spagnolo non le ha
ancora validate.** *Mandarle prima del collaudo vorrebbe dire far cambiare forma ai file inglesi per
una cosa che potrebbe rivelarsi diversa.*

| | Quando | Cosa contiene |
|---|---|---|
| **Pacchetto 1** | **adesso** | *i testi che lo studente legge, e una colonna che non rompe niente* |
| **Pacchetto 2** | **dopo il collaudo dello spagnolo e di `inglese-per-spagnoli`** | *le due colonne nuove, il nono tabellone, e le correzioni agli episodi inglesi* |

---
---

# PACCHETTO 1 — ADESSO

## 1.A — `inglese-it-istruzioni-moduli` → **`it-istruzioni-moduli`**

**Sostituire le sezioni 2 e 3 con quelle del file `it-istruzioni-moduli-sezioni-2-3-20260927a.md`.**
*Sezioni 1, 4, 5 e 6 invariate. Stringhe: **208**, invariate.*

### ⚠️ E il file cambia nome, con la sua ragione

**Questi testi non dipendono dalla lingua che si insegna: dipendono dalla lingua dello STUDENTE.**
*«Tocca il microfono per registrare» è identico in `inglese/it` e in `spagnolo/it`.*

⚠️ **Copiarli per edizione vuol dire 349 stringhe duplicate ogni volta.** *Con quattro edizioni per
italiani — inglese, spagnolo, francese, tedesco — sono **1396 stringhe di cui 1047 sono copie**, e una
copia che nessuno riallinea diverge.*

**Quindi: `it-istruzioni-moduli` e `it-messaggi-feedback`.** *E per l'italiano-per-spagnoli, `es-…`.*

⚠️ **Dove vivono i file è una domanda per te:** *`data/inglese/it/` e `data/spagnolo/it/` oggi sono
cartelle separate, e un file condiviso da tutte le edizioni italiane non ha una cartella dove stare.*

### E le dieci frasi che nominavano la lingua sono diventate neutre

| Prima | Dopo |
|---|---|
| «Vedi una parola in **inglese** e 4 possibili traduzioni in **italiano**» | **«Vedi una parola e quattro traduzioni»** |
| «ascolta il modello **inglese** con 🔊» | **«ascolta come si dice, con 🔊»** |

**La direzione è già nel titolo del modulo** — «Match Practice en→it» — *quindi ripeterla nel corpo era
ridondanza, non informazione.* ⭐ **Zero segnaposti, zero codice, e un altro pezzo di testo in meno.**

### ⚠️ E il test di andata e ritorno cambia riferimento

*Fino a ieri la prova era «`corpo` + riquadro + `coda` ricostruisce il `body` di oggi, carattere per
carattere» — la garanzia che non stessimo cambiando niente.* **Da questo file è il JSON che si allinea
al markdown:** la prova diventa *rigenerare il JSON dal markdown e riottenere 208 stringhe, con questi
testi.*

---

## 1.B — `inglese-it-messaggi-feedback` → **`it-messaggi-feedback`**

**Numeri attesi dopo le modifiche: 141 stringhe.** *Invariati: due testi cambiano, una famiglia cambia
nome, nessuna riga nasce o muore.*

### 1.B.1 · La famiglia `speedRoundMessages` → **`speedMatchMessages`**

*Quindici righe, colonna «famiglia». E la stessa rinomina nel riepilogo «quante ne ha ciascuna
famiglia».*

⚠️ **La rinomina conta più del collegamento:** *`speedRound` è il nome di prima della rinomina
`speedRound → speedMatch`.* **È il nome vecchio, non il mancato collegamento, ad aver reso quindici
testi invisibili per settimane.**

### 1.B.2 · 🔴 `speedMatchMessages` · `medio` · **5** — PRIMA del collegamento

| Prima | Dopo |
|---|---|
| `Buon ritmo, tieni duro.` | **`Ci stai prendendo la mano: la prossima volta verrà più automatico.`** |

⚠️ **Il testo di oggi loda la velocità, e la spiegazione di Speed Match dice testualmente
«l'obiettivo non è la velocità, è la correttezza».** *Collegare la famiglia senza questa correzione
mette l'app a premiare due schermate dopo esattamente la cosa che ha appena detto di non inseguire.*

### 1.B.3 · 🔴 `moduleCompleteMessages` · `alto` · **5**

| Prima | Dopo |
|---|---|
| `Punteggio alto, pronuncia e memoria sono già a buon punto.` | **`Punteggio alto: le parole di questo blocco le hai già in mano.`** |

⚠️ **`moduleCompleteMessages` serve Flash Card, Match Practice e Speed Match — dove non si parla.**
*Uno studente che finisce un Match Practice toccando delle traduzioni può leggere che la sua pronuncia
è a buon punto.* **È il caso di scuola di «un messaggio di esito sbagliato si crede».**

---

## 1.C — `inglese-it-struttura-corso`, sezione 4: **una colonna nuova in fondo**

⚠️ **Oggi nessun file dichiara a quale categoria appartiene un modulo.** *La sezione 3 elenca le sei
categorie, la sezione 4 i quindici moduli, e il legame fra le due non è scritto da nessuna parte.*
**È il quarto testo senza fonte**, dopo `generalRule`, le etichette degli slot e le istruzioni dei
moduli — *e si chiude con quindici celle.*

⚠️ **La colonna va IN FONDO, e non è indifferente:** *il parser legge per posizione — `r[0]`, `r[1]`,
`r[2]` — quindi una quarta colonna non viene letta finché `trascrivi.js` non impara a leggerla.*
**Metterla in mezzo romperebbe tutto; metterla in fondo non rompe niente.**

⚠️ **QUESTA MAPPATURA È DEDOTTA, NON MISURATA.** *L'ho ricavata dal criterio scritto nella sezione 3 —
`studio` = «si va al proprio ritmo», `quiz` = «c'è il tempo o l'avanzamento automatico» — **e va
confermata da chi può leggere il codice**.* **Due righe sono confermate: `voicePractice` è `studio`,
`voiceCoach` è `quiz`.**

| Id | Categoria |
|---|---|
| `personalizzazione` | `inizio` |
| `meetTheStory` | `studio` |
| `repeatAloud` | `studio` |
| `whyWeSayIt` | `studio` |
| `matchEngIta` | `studio` |
| `matchItaEng` | `studio` |
| `flashcardAEngIta` | `studio` |
| `flashcardAItaEng` | `studio` |
| `voicePractice` | **`studio`** ✅ |
| `dialogoAscoltaRipeti` | `dialogo` |
| `dialogoRipetiATempo` | `dialogo` |
| `dialogoContinuo` | `dialogo` |
| `speedMatchEngIta` | `quiz` |
| `speedMatchItaEng` | `quiz` |
| `voiceCoach` | **`quiz`** ✅ |

**`test` e `fine` restano senza moduli:** *sono i due che `CLAUDE.md` elenca fra i «previsti ma non
ancora costruiti».*

⭐ **E questa colonna sblocca una verifica che oggi non si può fare:** *`studioCompleteMessages` parla
di «ascolto ripetuto ad alta voce» — giusto per Repeat Aloud, falso per un Match.* **Senza sapere quale
famiglia serve quale modulo, i 141 messaggi di esito non sono controllabili.**

---

## 1.D — LE RISPOSTE ALLE DUE DOMANDE

### ① `speedRoundMessages`: **collegare** — e i testi sono già fatti

**L'ordine conta, e il primo passo è tuo:**

| # | Chi | Cosa |
|---|---|---|
| ① | **Code** | ⚠️ **la verifica su Pages PRIMA di tutto** — *finisci uno Speed Match e leggi il sottotitolo.* **Dopo il collegamento quella prova non distingue più niente** |
| ② | **noi → fatto** | la rinomina e i due testi corretti, in 1.B |
| ③ | **Code** | la riga di codice: `'moduleCompleteMessages'` → `'speedMatchMessages'` |

**E una settima forma per la verifica delle rinomine:** *il nome vecchio cercato nelle **chiavi** dei
JSON di `data/`.* ⚠️ **Le sei forme cercano identificatori nel codice, e `speedRoundMessages` viveva in
una chiave: è per questo che nessuna l'ha trovato.**

### ② Il giro sull'archivio: **sì, in coda** — e come estrazione, non come rilettura

**Per ogni fatto ancora vero, una riga in una tabella:** *`decisioni-stato.md` se riguarda codice o
dati, un tabellone se riguarda il contenuto.* ⚠️ **Estrarli in un altro documento sposterebbe soltanto
la data in cui si perderanno.**

**In coda DOPO l'allineamento in corso, non invece.**

### ③ E una domanda nuova, che vale più delle due

**Il valore di personalizzazione: com'è fatto il salvataggio oggi, e qual è la modifica più piccola
perché un livello futuro possa leggere un set diverso?**

*Chi parte dall'A2 deve poter scegliere nomi nuovi — «è come se l'edizione finisse e partisse la
successiva».* ⚠️ **Non chiediamo «mettiamo un id»:** *un id dice qual è il set, non a quale set
guardare. Il salvataggio l'hai misurato tu, noi no.*

---
---

# PACCHETTO 2 — DOPO IL COLLAUDO DELLO SPAGNOLO

> ⚠️ **NON MANDARE NIENTE DI QUESTO ADESSO, e non anticiparlo.** *Serve solo perché Code sappia cosa
> aspettarsi e non restrutturi in previsione.*

## 2.A — Due colonne nuove, e cambiano la forma delle tabelle

| Dove | Colonna | Valori |
|---|---|---|
| **sezione 6, i personaggi** | **`accento`** | un codice lingua — *`es-MX`, `en-GB`, `it` per la famiglia* |
| **sezione 4, grado D** | **`tipo`** | `standard` · `locale` · `slang` — ⚠️ **nessuna cella vuota** |

**L'accento è del PERSONAGGIO, non della battuta:** *`hostess-porta` non cambia accento a metà scena, e
ripeterlo su ogni riga sarebbe la stessa parola nove volte.*

⚠️ **E un'asserzione nuova per la suite:** **una battuta `locale` o `slang` DEVE avere una skill
attaccata.** *Se qualcuno mette un `vos hablás` in un dialogo senza spiegarlo, la suite diventa rossa.*

## 2.B — `synthesisLang` deve diventare per tappa

*Oggi è **un valore per edizione**, nella sezione 8.* **Se l'accento segue la rotta, segue le tappe.**

⭐ **E `recognitionLang` NON la segue: resta lo standard.** *Il primo è quello che lo studente **sente**,
il secondo quello che ci aspettiamo **da lui** — e a lui insegniamo lo standard.* ⚠️ **La sezione 8 lo
prevedeva già: «le due si confrontano separate: parlare e ascoltare sono due cose».**

## 2.C — Due categorie di episodio nuove

`grammatica-locale` e `slang`, nella sezione 7. *La prima è grammatica corretta ma di un posto — il
`voseo`; la seconda sono parole informali — il lunfardo.*

## 2.D — Le correzioni agli episodi inglesi

| File | Cosa |
|---|---|
| `inglese-it-gate` | due corpi di skill allungati (`d-4`, `d-5`) · l'etichetta `papa` torna «Nome del papà» e l'avviso che la difende va tolto |
| `inglese-it-aircraft-door` | la regola generale diventa l'accento · due paragrafi scaduti |
| `nuovi/inglese-it-EPISODIO-VUOTO.md` | ⚠️ **gli stessi due paragrafi, e QUI PER PRIMO** — *altrimenti il prossimo episodio li riporta indietro* |
| `inglese-it-struttura-corso` §7 | `wh-words` fra `seat` e `seat-neighbour`, **quando l'episodio sarà scritto** |

---

## ⚠️ E LA COSA DA DIRE SUBITO, PERCHÉ CAMBIA COSA ASPETTARSI DA NOI

**Il pacchetto 1 è l'ultima modifica all'inglese per un po'.** *Adesso facciamo **spagnolo per
italiani**, poi **inglese per spagnoli**, e solo dopo torniamo sull'inglese per italiani col pacchetto
2 — perché strada facendo troveremo altre cose, ed è meglio raccoglierle che mandare dieci correzioni
separate.*
