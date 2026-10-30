**Versione: 20261020a**

# Tabelle di personalizzazione — inglese per italiani

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-tabelle-personalizzazione.json`.** I criteri con cui
un nome o una città sono stati scelti stanno nei file RAGIONI.

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

### ② UNA COSA DA SAPERE

⚠️ **Il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella
sezione «GLI SLOT» del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti
diversi.*

🔴 **E QUI C'ERANO ALTRE DUE COSE, FALSE DAL 2026-09-24:**

| Diceva | |
|---|---|
| «la riga città + paese e le età in parole sono **decise ma non trascrivibili**» | ⭐ **fatte tutte e due il 24/09**: *`places.departures` ha sei colonne qui sotto.* 🔴 **E `ages.anni` era una tabella vera fino al 30/10, quando l'età è uscita dagli slot** |
| «il trascrittore le **RIFIUTEREBBE**: chiede esattamente quattro colonne» | 🔴 **ne accetta quattro o sei** — *e lo dice questo file, cinquanta righe più in basso* |

⚠️ **Erano false da diciassette giorni, e nessuno le aveva scritte sbagliate:** *sono diventate false il
giorno in cui il lavoro che dichiaravano impossibile è stato fatto.*

---

## 2 — LE TABELLE CHE ESISTONO

*Il **nome** è quello che una riga di slot scrive nella colonna «tabella» del
file episodio.*

⚠️ **LE ETÀ SONO ENTRATE QUI IL 2026-09-24 (passo 1.8-bis ③), e prima stavano
nella sezione «LE TABELLE INTERNE ALL'EPISODIO» di `gate`** come valori nudi. *Il codice li trasformava in
`{value, it, en}` tutti e tre uguali, ed è il motivo per cui si leggeva
`I'm 16 years old` invece di `I'm sixteen`.* **Una tabella interna a un episodio
resta possibile** — la forma `episode.<qualcosa>` c'è ancora — ma oggi non la
usa nessuno: *una tabella che ha senso solo dentro una storia non deve finire
nel magazzino di tutti, e una che serve a tutti non deve restare dentro una
storia.*

| Nome | Cosa contiene |
|---|---|
| `people.papa` | i nomi del padre |
| `people.mamma` | i nomi della madre |
| `people.figlia` | i nomi della figlia |
| `people.figlio` | i nomi del figlio |
| `people.cognome` | i cognomi della famiglia |
| `places.departures` | le città di partenza |


⚠️ **DAL 2026-10-30 `ages.anni` NON C'È PIÙ** — tolta con l'autorizzazione di chi guida il progetto, insieme alla colonna «righe» degli slot: l'età non è più uno slot, è scritta nella battuta (la figlia ha sedici anni, il figlio otto), e la tabella era rimasta senza lettore (regola 50). *Le righe di questa sezione che ne parlano sono storia.*

---

## 3 — LE RIGHE

**Una tabella ha QUATTRO colonne, oppure SEI**, *e quale lo dice la sua intestazione.* **Le quattro,
sempre nello stesso ordine:**

| Colonna | Va in | Cosa vuol dire |
|---|---|---|
| **id** | `value` | l'identificativo salvato nei progressi dello studente. ⚠️ **Cambiarlo è una migrazione**, non una correzione |
| **it** | `native` | come si legge in italiano |
| **en** | `target` | come si legge in inglese |
| **traducibile** | `traducibile` | `sì` → nel dialogo inglese si usa la colonna **en** · `no` → si usa la **it** anche in inglese |

⚠️ **`traducibile` è una proprietà della RIGA, non della tabella.** *Fino al
2026-09-20 si deduceva dal nome della tabella — «sta in `people.`, quindi non si
traduce» — e un cognome traducibile o una città che non si traduce non avevano
modo di esistere.*

⚠️ **L'assenza vale «sì».** Una riga che non lo dichiara si traduce.

### `people.papa`

| id | it | en | traducibile |
|---|---|---|---|
| `papa-marco` | Marco | Marco | no |
| `papa-giancarlo` | Giancarlo | Giancarlo | no |
| `papa-federico` | Federico | Federico | no |

### `people.mamma`

| id | it | en | traducibile |
|---|---|---|---|
| `mamma-giulia` | Giulia | Giulia | no |
| `mamma-anna` | Anna | Anna | no |
| `mamma-nicoletta` | Nicoletta | Nicoletta | no |

### `people.figlia`

| id | it | en | traducibile |
|---|---|---|---|
| `figlia-emma` | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sofia | no |
| `figlia-alice` | Alice | Alice | no |

### `people.figlio`

| id | it | en | traducibile |
|---|---|---|---|
| `figlio-tommaso` | Tommaso | Tommaso | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-giorgio` | Giorgio | Giorgio | no |

### `people.cognome`

| id | it | en | traducibile |
|---|---|---|---|
| `cognome-rossi` | Rossi | Rossi | no |
| `cognome-ferrario` | Ferrario | Ferrario | no |
| `cognome-barberis` | Barberis | Barberis | no |

### `places.departures`

| id | it | en | paese it | paese en | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` | Mondovì | Mondovì | Italia | Italy | sì |
| `orig-torino` | Torino | Turin | Italia | Italy | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Switzerland | sì |

⚠️ **QUESTA È L'UNICA TABELLA A SEI COLONNE, E LE ALTRE RESTANO A QUATTRO.**
`trascrivi.js` le accetta tutt'e due e **rifiuta ogni altro numero nominando la
tabella**: le quattro colonne diventano `value`/`native`/`target`/`traducibile`, le sei
aggiungono `paese: { native, target }`.

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
Italia»**: due frasi false sulle otto opzioni **di allora**.

⚠️ **E nessun test le avrebbe viste:** nessuno sceglie Lugano, quindi la suite
sarebbe restata verde. *È il difetto che vive dentro un'opzione che nessuno
prova, ed è il motivo per cui le due righe hanno aspettato invece di entrare.*

**Adesso il paese arriva alla frase con un segnaposto suo:**
`I am from {{partenza}}, {{partenza.paese:target}}.` ⚠️ **E la strada più corta è
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

---

## 4 — DECISO, NON ANCORA TRASCRIVIBILE

⚠️ **QUESTA SEZIONE NON FINISCE NEL JSON.** *Quello che ci sta è contenuto scelto, fermo solo perché il
codice che lo legge non esiste ancora.*

**Oggi è vuota.** 🔴 *Conteneva tre voci — il paese delle partenze, le età, la skill di `d-8` — e tutte
e tre sono state fatte il 2026-09-24.*

⭐ **La sezione si SVUOTA quando un passo arriva, invece di accumulare note di cose fatte:** *tre righe
«✅ FATTO» sono tre righe che fra sei mesi si rileggono come lavoro aperto.* ⚠️ **E il suo preambolo
diceva che una riga a sei colonne «fermerebbe la trascrizione di tutto il file»** — *falso dal 24/09, e
smentito dalle sei colonne di `places.departures` nella sezione qui sopra.*
