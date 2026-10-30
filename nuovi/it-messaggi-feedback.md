**Versione: 20261017d**

# Messaggi di esito — per chi studia in italiano

**Il gemello di `data/condivisi/it/it-messaggi-feedback.json`.** Questo file **spiega e decide**, quel
JSON **esegue** (`CLAUDE.md` regola 26). Sta accanto a `it-istruzioni-moduli.md` e non dentro di lui:
*quello è il testo che dice **come si usa** un modulo, questo quello che **risponde a un esito** — e la
regola 8 li tiene in due file da prima che esistesse una fonte per nessuno dei due.*

⚠️ **IL FILE HA CAMBIATO NOME E POSTO IL 2026-09-28:** *`inglese-it-messaggi-feedback` →
**`it-messaggi-feedback`**, e da `data/inglese/it/` a **`data/condivisi/it/`**.*

**Perché:** *«Va bene così, l'importante è provarci» è identico in un corso di inglese e in uno di
spagnolo. Questi testi dipendono dalla lingua dello **studente**, non da quella che si insegna.*
**Insieme alle istruzioni dei moduli sono TUTTE le stringhe che lo studente legge fuori da un
episodio: copiarle per edizione vorrebbe dire, con quattro edizioni per italiani, quattro volte tante
copie che nessuno riallineerebbe.**

⚠️ **E IL CONTO NON STA PIÙ SCRITTO QUI, DI PROPOSITO.** *Vive in un posto solo, con la sua data:
`CLAUDE.md`, regola 8.* 🔴 **Il 2026-10-07 il numero vecchio — «349 … 1047» — si è trovato ricopiato in
DIECI file**, *e nessuno dei dieci sapeva di essere scaduto: era la somma di due conti, e uno dei due è
cambiato il 28 settembre.*

🔴 **E la frase qui sopra, nella sua prima stesura, portava dentro quei due conti.** *Scriverli qui
voleva dire fare — nella nota che spiega perché un numero non si ricopia — **esattamente la cosa che la
nota vieta**. Uno dei due era anche sbagliato.*

> ⭐ **Un numero ricopiato invecchia in dieci posti. Uno datato invecchia in uno** (regola 48).

⚠️ **NESSUNO AVEVA MAI RILETTO QUESTI TESTI.** Trovato il 2026-09-26 censendo ciò che lo studente
legge: **141 stringhe** senza nessuna fonte markdown. *E sono i testi che pesano di più: una
spiegazione lunga si salta, **un messaggio di esito sbagliato si crede**.*

⚠️ **QUASI TUTTO È UNA LISTA DI CINQUE VARIANTI, e non è un caso: l'app ne pesca UNA.** Quindi lo
studente che rifà lo stesso modulo non rilegge la stessa frase. *Ne segue una cosa da tenere a mente
accorciando: **le cinque devono restare cinque cose diverse**, non cinque modi di dire la stessa.
Ridurne il numero è una scelta legittima, ma va detta: da tre in giù si comincia a riconoscerle.*

---

## 1 — COME SI LEGGE QUESTO FILE

**I titoli si cercano per TESTO ESATTO**: `##` + uno spazio + il testo della colonna, col trattone `—`
(U+2014) e uno spazio prima e uno dopo.

| Il testo dopo `## ` | Cosa ne nasce |
|---|---|
| `2 — LE FASCE` | `percentageRule` — la regola che decide QUALE gruppo di messaggi si pesca |
| `3 — I MESSAGGI` | tutte le liste di varianti: **un messaggio per riga** |
| `4 — I TITOLI` | i testi che non sono in una lista |
| `5 — LE LISTE VUOTE` | le liste che esistono e non hanno righe |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA:** se questa tabella scrivesse i titoli per intero, una
ricerca per sottostringa troverebbe **questa riga** invece della sezione vera. *`grep -c '^## 3'` deve
dare **1**.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una cella di tabella le
toglie gli spazi ai lati — deve — quindi uno spazio ai bordi sparirebbe **senza un errore**. Il segno
si vede, lo spazio no.*

⚠️ **IL `#` DI UNA RIGA È LA POSIZIONE NELLA LISTA, e conta**: **è l'ordine in cui l'app le pesca**.
Togliere una riga in mezzo rinumera quelle sotto, e va bene; cambiarne l'ordine senza motivo no.

### I numeri attesi

**Si contano sul contenuto prima di usarlo (regola 29): se non tornano, fermarsi.**

| Cosa | Righe nel file | Stringhe nel JSON |
|---|---|---|
| Messaggi in lista (sezione 3) | **130** | **130** |
| Titoli fuori lista (sezione 4) | **2** | **2** |
| Voci della regola delle fasce (sezione 2) | **10** | ⚠️ **9** — *una è un booleano* |
| Liste vuote (sezione 5) | **1** | ⚠️ **0** — *una lista vuota è una chiave senza stringhe* |
| **TOTALE** | 143 | ⭐ **141** |

*Famiglie di primo livello: **10**, e non sono stringhe — sono i contenitori.*

🔴 **QUESTA TABELLA IL 2026-09-28 È STATA RIFATTA, PERCHÉ PRIMA NON TORNAVA.** *Diceva
`130 + 2 + 10 + 1` accanto a un totale di `141`, senza spiegare la differenza — e un conto che non torna
è un invito a «ripararlo» cambiando il numero giusto.* **Le due righe che mancavano all'appello sono
`percentageRule.0.showMessage`, che è `false` e non `"false"`, e la lista vuota, che è una chiave con
zero stringhe dentro.**

⭐ **Invariate dal 2026-09-26: nessuna chiave nasce, nessuna muore.** *Una famiglia cambia nome, due
testi cambiano contenuto — e il conto è la prova che questo giro tocca il contenuto e non la forma.*

### ⚠️ COSA È CAMBIATO IL 2026-09-28, E PERCHÉ

| | |
|---|---|
| 🔴 **`speedRoundMessages` → `speedMatchMessages`** | *quindici testi che **nessuno leggeva**, perché la chiave portava il nome di prima della rinomina `speedRound → speedMatch`.* **Non era un collegamento mancato: era un nome vecchio** — e questo li ha resi invisibili per settimane |
| 🔴 **`speedMatchMessages` · `medio` · 5** | *il testo di prima lodava la velocità, e la spiegazione del modulo dice testualmente «l'obiettivo non è la velocità, è la correttezza»* |
| 🔴 **`moduleCompleteMessages` · `alto` · 5** | *parlava di pronuncia in moduli dove **non si parla**: Flash Card, Match Practice, Speed Match* |

⭐ **E la lezione del primo, che vale più del testo:** *quei quindici erano già stati scoperti una volta,
e la scoperta è andata persa insieme al documento che la portava.* **Un fatto che vive solo in un
documento muore col documento: va estratto in una tabella.**

---

## 2 — LE FASCE

⚠️ **IN QUESTA SEZIONE NON C'È NESSUNA TABELLA, E NON È UNA SVISTA.** *Fino al 2026-10-16 ce n'era una,
`percentageRule`, che finiva nel JSON.* 🔴 **Una tabella dentro un file che si trascrive è un dato, anche
quando è messa lì per spiegare** — *e questa sezione, da oggi, spiega soltanto.*

**Le fasce sono QUATTRO, e decidono quale gruppo della sezione 3 si pesca:** *lo **zero**, dove non
compare nessun messaggio, e poi **`basso`**, **`medio`** e **`alto`**, che pescano dal gruppo col loro
nome.*

🔴 **I NUMERI NON SONO QUI, ED È UNA DECISIONE.** *Le tre soglie vivono in `percentageThresholds`, in
`app/config.js`, e si girano dal Pannello Admin.* ⚠️ **Una prosa che le ricopiasse invecchierebbe al primo
giro di manopola, e nessuno se ne accorgerebbe: queste righe non le legge nessun programma.**

### ⭐ CHI LEGGE QUELLE SOGLIE — quattro mestieri, non uno

**`fasciaMessaggio` decide quale gruppo di testi si pesca, e allo zero restituisce «nessuna fascia».**
*`percentageBucket` decide due colori — il badge sulla mappa e una parola in Voice Check — e allo zero dà
rosso e sbagliata. `starsForPercent` decide una, due o tre stelle, e allo zero ne dà zero.*

⚠️ **Le prime due funzioni sono separate di proposito.** *Il salto dello zero appartiene al MESSAGGIO, non
alle fasce:* 🔴 **se lo facesse `percentageBucket`, il badge e la parola di Voice Check riceverebbero
«nessuna fascia» invece di un colore, e in silenzio.**

### 🔴 FINO AL 2026-10-16 LO ZERO NON ESISTEVA PER IL MESSAGGIO, E TRE COSE SU QUATTRO DICEVANO IL CONTRARIO

**A 0 su 20 compariva un testo incoraggiante del gruppo `basso`.** *In Voice Check, sulla stessa
schermata: **zero stelle** e un messaggio che commentava una prestazione.*

**Allo zero, prima di quel giorno:** *la regola scritta in questa sezione diceva «nessun messaggio» · la
manopola della prima soglia **non aveva nessun lettore**, perché la funzione delle fasce non la guardava ·
le stelle davano zero ·* 🔴 **e il messaggio mostrava `basso`.**

⭐ **Deciso da chi guida il progetto: allo zero nessun messaggio.** *E la ragione non è didattica:* **il
comportamento di prima nessuno l'aveva scelto** — *era quello che il codice faceva per caso, mentre tre
cose scritte dicevano un'altra.*

⚠️ **E le due date non sono la stessa, anche se stavano nella stessa riga:** *il **13/10** è quando
abbiamo misurato che la regola scritta qui non aveva lettori; il **16/10** è quando lo zero è diventato
senza messaggio.* 🔴 **Fra i due ci sono tre giorni in cui a 0 su 20 compariva ancora un messaggio
«basso»** — *e il titolo di questa sezione diceva 13, cioè la data della misura al posto di quella del
cambiamento.* **Trovato da Claude Code.**

> ⭐ **La data di quando si è capito non è la data di quando è cambiato.**

### ⏳ E UNA DOMANDA APERTA, CON LA SUA CONDIZIONE

⭐ **«Lo zero merita testi SUOI?»** *Cioè una quarta serie, scritta per chi non ha azzeccato niente,
invece del silenzio.*

**Si decide al decimo episodio.** *Con due episodi scritti non abbiamo mai visto uno studente vero fare
0 su 20, e una serie di testi scritta senza quel dato sarebbe scritta a naso.*

⚠️ **E una cosa che resta aperta anche così: allo zero il badge è ROSSO, come a 45%.** *Se lo zero meriti
un colore suo appartiene al giro di design sulla mastery, non a questa sezione.*

### ⚠️ COSA SE N'È ANDATO, E PERCHÉ LA SEZIONE RESTA

🔴 **La tabella di dieci righe che stava qui non la leggeva nessun programma:** *misurato il 13/10, zero
occorrenze di `percentageRule` in `app/` e in `index.html`.* **Era una copia in prosa di tre numeri che
vivono nel codice, e diceva anche una cosa che il codice non faceva.**

⭐ **Le stringhe del file scendono di nove, e la sezione resta per chi legge: il disegno delle quattro
fasce non era scritto in nessun altro posto.**

⚠️ **E il numero della sezione NON cambia**, anche se il trascrittore non la legge più: *rinumerare
romperebbe i controlli che cercano i titoli carattere per carattere.*

---

## 3 — I MESSAGGI

*Un messaggio per riga. **Famiglia** → la chiave di primo livello · **gruppo** → la fascia o il caso
(`alto`/`medio`/`basso`, `riuscita`/`nonRiuscita`, …) · **#** → la posizione nella lista.*

**Quante ne ha ciascuna famiglia:**

| Famiglia | Messaggi | Gruppi |
|---|---|---|
| `voiceCoachMessages` | **15** | `alto`, `basso`, `medio` |
| `speedMatchMessages` | **15** | `alto`, `basso`, `medio` |
| `valvolaSicurezzaMessages` | **10** | `nonRiuscita.bodies`, `riuscita.bodies` |
| `moduleCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `studioCompleteMessages` | **5** | `default` |
| `storyCardsCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `dialogoCompleteMessages` | **10** | `nonAncora`, `siLoSo` |
| `retryIntroMessages` | **20** | `first.bodies`, `first.titles`, `last.bodies`, `last.titles` |
| `episodeFinalMessages` | **25** | `almenoUnRosso.compliments`, `almenoUnRosso.tip`, `gialloNoRosso.compliments`, `gialloNoRosso.tip`, `tuttiVerdi.compliments` |

### 🔴 NOVE TESTI PROMETTEVANO UN MECCANISMO CHE L'APP NON HA — corretti il 2026-10-16

**Il «mix 40/30/20/10» — quello che dovrebbe pescare il 30% delle voci dai rossi — NON ESISTE ANCORA.**
*Misurato: zero occorrenze in `app/`, `data/` e `index.html`.* **Quando arrivi non si decide qui.**

⭐ **E quello che gli manca è UNA cosa, misurata il 16/10: una voce deve portarsi dietro l'episodio da
cui viene, fino al salvataggio.** *Oggi `recordPendingMastery` legge lo stato dalla mastery
dell'episodio **corrente**, e il salvataggio al gesto scrive tutto là.* 🔴 **E gli id si ripetono fra
episodi — nel grado D i nove `d-1`…`d-9`, che sono le chiavi delle risposte di «Perché si dice così» —
quindi una battuta rossa di `gate` mostrata dentro `aircraft-door` leggerebbe e scriverebbe quella
dell'episodio sbagliato, senza nessun errore.**

⚠️ **E fin qui questa riga diceva «14 in comune, e una `c-1` rossa di `gate`»: era vero fino al 30/10.**
⭐ **Dal 30/10 gli id in comune nei gradi A, B e C sono ZERO** — *gli id del grado C sono descrittivi e
per lingua, `c-1` non esiste più, e `a-lei` di `aircraft-door` è diventato `a-lei-soggetto`.*
🔴 **Il problema non è sparito: si è ristretto al grado D, dove gli id in comune sono VOLUTI** — *l'id di
una battuta è dell'episodio, non del testo.*

⚠️ **La chiave per episodio invece va bene come è**, *e le voci rosse degli episodi prima si leggono già.*
🔴 **Fino al 16/10 questa sezione diceva il contrario: «la ragione è che la mastery è salvata per
episodio».** *Era una nostra deduzione, non una misura — ed è caduta appena qualcuno ha guardato il
codice.*

**Chi lo prometteva:**

| Famiglia | Quanti | Cosa dicevano |
|---|---|---|
| `moduleCompleteMessages` | **5** | *«tornano nei prossimi episodi», «le ritroverai spesso», «lo rivedrai più avanti»* |
| `valvolaSicurezzaMessages` · `nonRiuscita` | **4 su 5** | *«tornerà nei prossimi ripassi», «la ritroverai nei ripassi mirati», «tornerà da sola», «ci tornerai sopra quando serve»* |

⭐ **E il solo futuro che l'app mantiene oggi è un altro:** *un passo già completato **si riapre dalla
mappa*** — `mappa.js` *(«l'ultimo resta apribile»)* e il blocco D di `test_story_modules.js`.
**Un testo su nove lo usa; gli altri otto restano al passato.**

> 🔴 **Nei primi quindici riscritti avevamo sostituito un meccanismo falso — «ripassa quando vuoi» — con
> un altro meccanismo falso, nella stessa modifica in cui spiegavamo perché il primo era falso.**
> ⭐ **La causa: in questi file «come funziona» e «come funzionerà» stanno nella stessa riga, e si legge
> il progetto come se fosse l'app.** *Trovato da Claude Code.*

⏳ **E una condizione, per il giorno in cui il mix esiste:** *questi nove testi sono il posto dove dirlo.*
**Si rileggono quando O-4 è fatto** — *scriverlo prima vorrebbe dire che il mix arriva e per lo studente
non cambia niente, perché la promessa c'era già e non era vera.*

⚠️ **E l'ordine fra il mix e Supabase non si scrive qui: è una decisione di piano, e un file di testi non
è il posto dove un domani la si andrebbe a cercare.** *Qui resta solo quello che riguarda queste nove
frasi.*

### 🔴 DUE DIFETTI DI FAMIGLIA, TROVATI IL 2026-10-17 — e uno era già in `main`

**Misurati leggendo `app/ui-condivisa.js` e `app/speedmatch.js`, non i testi.**

### ① LO STUDENTE NON VEDE NESSUN NUMERO, IN NESSUN MODULO

🔴 **`renderSummaryScreen` costruisce la Schermata Finale di tutti e sette i moduli, e contiene DUE
righe: un titolo fisso e questo sottotitolo.** *Niente punteggio, niente percentuale, nessun elenco di
cosa è andato storto.*

⭐ **E misurato: ZERO righe in `app/` scrivono una percentuale a schermo.** *Il punteggio esiste, decide
quale messaggio appare e colora il bollino sulla mappa — ma non è un numero che si possa leggere.*

**Sei testi parlavano del «punteggio»:** *`speedMatch` `alto` 1 e `medio` 1 · `moduleComplete` `alto` 1,
`alto` 4, `medio` 1, `basso` 3.*

> 🔴 **Il criterio che lo vietava era scritto dal 13/10: «ogni frase si giudica accanto al COLORE che lo
> studente vede, non al numero che non vede».** ⚠️ **Tre giorni dopo ne abbiamo scritti due nuovi così.**
> ⭐ *Non è una forma nuova: è `NUMERI` §9 — «avere lo strumento e non usarlo è peggio che non averlo».*
> **Il criterio era lo strumento.**

⚠️ **E la domanda «la Schermata Finale deve mostrare il punteggio?» NON è stata decisa qui.** *Va nel
giro di design sulla mastery, con il bollino rosso a 0%.*

### 🔴 ② «LE HAI CHIUSE TUTTE» NON È VERO, E LA VALVOLA È IL MOTIVO

**La voce che sbaglia tre volte — `CONFIG.retryQueue.maxAttempts` — NON rientra in coda: è accettata per
quel giro e registrata `rosso`.**

⭐ **Quindi un modulo può finire con voci ancora sbagliate, e il giro di ripasso non garantisce niente.**

**Sei testi lo garantivano:** *`moduleComplete` `alto` 4 («l'hai già chiuso qui»), `medio` 1 («il resto
l'hai sistemato»), `medio` 3 («l'hai chiuso a forza di riprovarci»), `medio` 4 («l'hai rifatto fino a
prenderlo»), `basso` 3 e `basso` 4 («le hai chiuse tutte»).*

| | |
|---|---|
| 🔴 **Tre erano nostri, scritti il 16/10** | `alto` 4 · `medio` 4 · `basso` 3 |
| 🔴 **E questo file lo dichiarava risolto** | *«e i testi non lo dicono più», settanta righe sopra* |
| ⚠️ **La valvola scatta a tre errori sulla stessa voce** | **cioè quasi solo in `basso`:** *la frase era meno vera esattamente dove compare* |

> ⭐ **La correzione è una parola: da «chiuso» a «tornato sopra».** *Tornarci è quello che è successo;
> prenderla è quello che speriamo.* 🔴 **E la differenza fra le due la sa solo la valvola.**

### ⭐ E I QUINDICI DI `speedMatchMessages`, RISCRITTI TUTTI — 2026-10-17

**Prima lettura di questa famiglia: fino al 28/09 si chiamava `speedRoundMessages` e non aveva lettori.**

| Cosa dicevano | Quanti |
|---|---|
| *«ripassa le parole che ti sono sfuggite»* · *«ripasseremo insieme le più difficili»* · *«ora sai quali parole ripassare»* | 🔴 **3** — **il mix, più un elenco che non esiste** |
| *«la prossima volta verrà più automatico»* · *«un altro giro e migliori ancora»* · *«andrà meglio»* | 🔴 **3** — *promesse* |
| *«quasi tutte corrette»* · *«sei quasi al massimo»* | 🔴 **2** — **false a 100%** |
| *«ottimo punteggio»* · *«buon punteggio»* | 🔴 **2** — *vedi ①* |

⭐ **Le due «quasi» sono il caso opposto a `voiceCoach`: là l'elogio si rompeva in fondo alla fascia, qui
si rompe in cima.** 🔴 **Il metro vale ai due estremi: una frase per `alto` deve essere vera a 80% E a
100%.**

⚠️ **E «parole» è uscita da tutti e quindici**, *per la ragione già scritta per `moduleComplete`: Speed
Match non gira su un grado solo, e i gradi si chiamano Parole, Espressioni, Frasi.*

### 🔴 LE ULTIME TRE FAMIGLIE — 2026-10-17, e qui l'app non misura: lo studente DICHIARA

**Misurate su `app/storycards.js`, `app/dialogo.js` e `app/repeataloud.js`.**

#### ⭐ LA PERCENTUALE DI STORY CARDS È UNA AUTODICHIARAZIONE, NON UN PUNTEGGIO

**`chiaraCount / storyCardsSkillIds.length`:** *la quota di spiegazioni che **lo studente** ha segnato
«chiara».* 🔴 **Nessuna domanda, nessuna risposta giusta o sbagliata.**

> ⭐ **Quindi nessun testo può dirgli cosa ha capito: gliel'ha detto lui.** *Il registro giusto è «hai
> segnato chiare», non «hai capito».* ⚠️ **E le dichiarazioni si RISCRIVONO a un giro successivo**, *quindi
> «al primo giro» e «fin da subito» possono essere falsi: quattro testi lo dicevano.*

**Dialogo è lo stesso**: *`level === 'verde' ? 'siLoSo' : 'nonAncora'` — «self-assessment for the whole
dialogue, not per-word: this module never touches loadMastery/saveMastery».*

#### 🔴 E IL TESTO PEGGIORE DI TUTTA LA RILETTURA STAVA QUI

> *«L'hai fatto tuo: **pronuncia e ritmo erano solidi**.»* — `dialogoCompleteMessages.siLoSo` 4

🔴 **Dialogo NON HA IL MICROFONO.** *Misurato: zero occorrenze di `SpeechRecognition` e `getUserMedia` in
`app/dialogo.js` — e zero anche in `app/storycards.js`.*

⭐ **Gli altri difetti erano frasi che dicevano più del loro numero. Questa afferma una misura di una cosa
che l'app non ha mai sentito.** *Dei cinque `siLoSo`, quattro raccontavano allo studente come era andato
il suo ascolto; l'unica cosa che l'app sa è quante battute ha sentito e che lui ha detto «sì».*

#### 🔴 `studioCompleteMessages`: LA PREMESSA ERA SBAGLIATA, ED ERA NOSTRA

**La riga «due testi su cinque falsi dopo un Match», con la condizione «prima una misura: compare a fine
di ogni modulo `studio` o una volta a fine blocco?», stava nella SEZIONE 6 DI QUESTO FILE.**

🔴 **E il 17/10 abbiamo scritto a Claude Code che la riga sbagliata era nel suo registro.** *Non lo era:
`docs/decisioni-stato.md` dice la cosa giusta dal 2026-09-30, perché **la misura l'aveva già fatta lui il
29/09**.* ⚠️ **Noi l'abbiamo rifatta diciotto giorni dopo, con lo stesso risultato, perché la nostra copia
della domanda era rimasta aperta.** *Vedi la sezione 6, rifatta.*

**Misurato (due volte, ormai): questa famiglia non compare MAI dopo un Match.** *Ha due lettori:*

| Dove | Quando |
|---|---|
| `repeataloud.js:182` | **sempre**, alla Schermata Finale di Repeat Aloud |
| `storycards.js:322` | **solo negli episodi SENZA spiegazioni** — *con le spiegazioni, Story Cards usa la sua famiglia* |

⭐ **E la risposta alla domanda è «a fine modulo», una volta per completamento** — *dove «Why We Say It»
è il nome a schermo di `storycards.js`.*

🔴 **La domanda si poteva chiudere leggendo due righe di codice, ed era già chiusa altrove.** *È stata in
sospeso diciotto giorni con una condizione che chiedeva a qualcun altro una misura che lui aveva già
fatto.*

⚠️ **I due testi falsi però esistono, e il motivo è un altro:** *«ogni **ascolto ripetuto ad alta voce**
lascia il segno» e «la **pronuncia** si allena anche così» sono veri in Repeat Aloud e **falsi in Story
Cards**, che non chiede di parlare.*

> 🔴 **È la seconda volta oggi, con lo stesso meccanismo di `voiceCoachMessages`: UNA famiglia, DUE
> moduli, e il testo nomina quello che fa solo uno dei due.** ⭐ **Il controllo che ne esce: prima di
> scrivere un testo, contare i suoi lettori. Se sono due, può dire solo quello che vale per entrambi.**

### 🔴 I QUINDICI DI `voiceCoachMessages` RISCRITTI IL 2026-10-17 — sette erano falsi

**Misurati su `app/voice.js`, non sul loro suono.**

| Il meccanismo | |
|---|---|
| **La chiave non è una percentuale: sono le STELLE** | `STAR_MESSAGE_KEYS = {1:'basso', 2:'medio', 3:'alto'}` — *stesse soglie (80/50/1), ma qui «medio» vuol dire **due stelle, e tentativo superato**: `passed = stars > 1`* |
| ✅ **A 0 stelle nessun messaggio** | *`if (stars > 0)`: qui lo 0% era già giusto prima della decisione del 16/10* |
| 🔴 **I 15 testi sono CONDIVISI fra Voice Practice e Voice Check** | *«everything in this section not explicitly gated on `vcVariant` runs for both»* |

🔴 **E i due moduli differiscono ESATTAMENTE sul meccanismo di cui i testi parlavano:**

| | Voice Practice | Voice Check |
|---|---|---|
| **Riprovare la frase** | *pulsante «Esercitati ancora», fino a `voicePractice.maxAttemptsPerPhrase`* | 🔴 **UNA registrazione per frase: la riga del riprova è nascosta** |
| **Il ripasso finale** | 🔴 **non c'è** | *c'è: a 1 stella la frase entra in coda* |
| **Cosa colora la voce** | *ogni tentativo* | *solo il primo* |

> ⭐ **Quindi qualunque testo nominasse un tentativo o un ripasso era falso in uno dei due moduli, e non
> c'era modo di sapere quale.** **Deciso da chi guida il progetto: quindici testi che non nominano
> nessun meccanismo**, *invece di spaccare la famiglia in due da quindici.* 🔴 *Trenta stringhe per una
> frase che cambia in una proposizione, e la regola 8 da 331 a 346.*

**I sette falsi:**

| Voce | Cosa diceva | Perché era falso |
|---|---|---|
| `alto` **1 · 2 · 4 · 5** | *«impeccabile» · «sembri già un madrelingua» · «hai centrato tutto» · «non c'è nulla da correggere»* | 🔴 **Tre stelle partono da 80%, e sotto il messaggio stanno le righe PAROLA PER PAROLA, dove una può essere rossa.** *La smentita era sulla stessa schermata* |
| `medio` **4** | *«un altro paio di tentativi e sarà perfetto»* | **in Voice Check non c'è un altro tentativo** |
| `basso` **3** | *«ogni tentativo ti avvicina di più»* | **niente si accumula**: *Practice ricalcola a ogni tentativo, Check conta solo il primo* |
| `basso` **4** | *«ripasseremo insieme questa frase»* | **vero in Check, falso in Practice** |

⭐ **E le quattro di `alto` non sono la forma del mix — lì si leggeva un piano come se fosse l'app.
Qui l'elogio era più forte della misura su cui poggiava**, *e la misura era stampata due centimetri
sotto.*

> 🔴 **Il criterio che ne esce, e vale per le altre settantadue:** *un testo che commenta un numero non
> può dire più di quel numero.* **Il minimo della fascia è il metro: se una frase non è vera a 80%, non
> è una frase per `alto`.**

### 🔴 SEI DEI VENTI DI `retryIntroMessages` SONO STATI CORRETTI IL 2026-10-16

*Su venti, sedici erano buoni. Quattro difetti, e due erano falsi in due modi.*

**① «Il quiz è finito»** *(titolo `first` 1)*. 🔴 **Il quiz NON è finito: il ripasso sta per cominciare e
lo studente deve ancora rispondere.** *E «quiz» è sbagliato per due dei quattro moduli che mostrano
questa schermata:* **Match e Flash Card sono `studio`** — *e lo studente vede scritto «Studio» sulla
mappa, accanto a quel modulo.* ⭐ *Ora dice «Primo passaggio finito».*

**② «Il resto è già acquisito»** *(corpo `first` 4)*. *Misurato: `mastery.promotionStreak` = **2**.*
🔴 **Una risposta giusta al primo colpo non è «acquisito»:** *servono due giuste di fila per passare
rosso→giallo, e altre due per giallo→verde.* ⚠️ **E oggi niente le riporta davanti allo studente da sole:** *il mix che le ripescherebbe non esiste
ancora (**O-4**).* ⭐ *Ora dice «il resto per adesso va» — che è vero in entrambi i casi.*

**③ «poi via al prossimo esercizio»** *(corpi `last` 1, 2 e 4 — tre su cinque)*. 🔴 **Dopo l'ultimo
ripasso non viene un esercizio: viene la SCHERMATA FINALE, e poi la mappa.** ⚠️ *E può non esserci nessun
esercizio dopo: quello può essere l'ultimo passo dell'episodio.* ⭐ **E il corpo 2 adesso annuncia la
schermata che arriva davvero: «Finito questo ripasso vedrai com'è andata».**

**④ «Round terminato»** *(titolo `first` 5)*. *Era l'unica parola inglese del file, e il resto dell'app
parla italiano.*

⭐ **E un dato del meccanismo che vale scritto, perché tre di questi testi lo sbagliavano:** *i ripassi
sono al massimo **due** — `first` e `last` — e dopo il secondo la valvola spinge avanti le voci ostinate.*
**Non esiste un terzo giro, quindi «ultimo» nei titoli `last` è vero.**

### 🔴 I QUINDICI DI `moduleCompleteMessages` SONO STATI RISCRITTI IL 2026-10-16

**Non per gusto: tre difetti di meccanismo, misurati sul codice.**

**① Il messaggio parlava al futuro di una cosa già fatta.** *Cinque dicevano «da ripassare quando vuoi»,
«vale la pena tornare», «ripassa le parole più difficili».* 🔴 **Ma la percentuale è quella del PRIMO
giro — «this pct is already frozen before the ripasso pass», dice il commento in `app/match.js` — e la
schermata compare a coda vuota: lo studente ha già rifatto tutto, e non era una scelta sua.**

🔴 **E il futuro che avevamo messo al suo posto era falso a sua volta:** *una voce sbagliata resta
**rossa** nella mastery — questo è vero — ma **oggi nessun esercizio la ripesca.*** ⚠️ **Il mix che lo
farà è O-4, e la mastery è salvata per episodio.** ⭐ *L'unico futuro che l'app mantiene è un altro: il
passo si riapre dalla mappa.*

⚠️ *E quando la valvola `retryQueue.maxAttempts` scatta, la voce è accettata per quel giro ma registrata
`rosso`:* **finire l'esercizio non vuol dire averlo imparato.** 🔴 *E questa frase, il 16/10,
finiva con «e i testi non lo dicono più»:* **era falsa nel momento in cui l'ho scritta — sei dei quindici
lo dicevano ancora.** *Corretti il 17/10, vedi sotto.*

**② Quattro dicevano «parole», e questa famiglia non gira solo sul grado A.** *Match sta su **A B C**,
Flash Card su **A B**, Voice Check su **C** — e i gradi si chiamano Parole, Espressioni, Frasi.*
🔴 **«Le parole di questo blocco» dopo un Match sul grado C parla di parole in un esercizio di frasi.**

⭐ **Deciso: nessun testo nomina il grado.** *Lo studente lo vede già scritto sopra il messaggio, e tre
serie di testi invece di una costerebbero tre volte senza aggiungere niente.*

**③ Tre dicevano «all'inizio» o «un punto di partenza».** *Veri all'episodio 1, falsi al 15 — e il
messaggio riceve solo la percentuale: non sa che episodio è.* ⭐ **Deciso: nessun riferimento al momento
del corso.** *Una frase che diventa falsa da sola, senza che nessuno la tocchi, è quello che stiamo
togliendo da dieci giorni.*

**E due che erano falsi ai bordi della loro fascia:** *«quasi a tutto» e «quasi tutte le risposte giuste»
a **100%**, «senza bisogno di ripassi» a **80%**.* ⚠️ **Ogni testo nuovo è stato scritto per essere vero a
entrambi i bordi.**

🔴 **E una cosa togliata di proposito dal gruppo `basso`: il «nessun problema».** *A chi ha sbagliato più
di metà, dirgli che non è un problema è una bugia gentile.* ⭐ **I testi nuovi dicono cosa è successo e
cosa succederà.**

| Famiglia | Gruppo | # | Testo |
|---|---|---|---|
| `voiceCoachMessages` | `alto` | 1 | Tre stelle: questa frase ti è venuta. |
| `voiceCoachMessages` | `alto` | 2 | Molto buona — si capisce senza esitazione. |
| `voiceCoachMessages` | `alto` | 3 | Pronuncia solida: questa la hai in mano. |
| `voiceCoachMessages` | `alto` | 4 | Ottimo su questa frase. |
| `voiceCoachMessages` | `alto` | 5 | Qui sei andato bene, e si sente. |
| `voiceCoachMessages` | `medio` | 1 | Due stelle: ci siamo, con qualche suono da limare. |
| `voiceCoachMessages` | `medio` | 2 | Ti si capisce, con qualche imprecisione. |
| `voiceCoachMessages` | `medio` | 3 | Buona parte dei suoni è giusta. |
| `voiceCoachMessages` | `medio` | 4 | Non è ancora pulita, ma funziona. |
| `voiceCoachMessages` | `medio` | 5 | Questa regge, e si sente dove è incerta. |
| `voiceCoachMessages` | `basso` | 1 | Una stella: questa frase è ancora da prendere. |
| `voiceCoachMessages` | `basso` | 2 | Qualcosa è arrivato, il resto no. |
| `voiceCoachMessages` | `basso` | 3 | Frase difficile, e si vede: succede. |
| `voiceCoachMessages` | `basso` | 4 | Ancora lontana — i suoni lo dicono uno per uno. |
| `voiceCoachMessages` | `basso` | 5 | Qui la pronuncia non c'è ancora. |
| `speedMatchMessages` | `alto` | 1 | Primo giro rapido e preciso. |
| `speedMatchMessages` | `alto` | 2 | Qui hai risposto senza pensarci troppo — è il segno che le sai. |
| `speedMatchMessages` | `alto` | 3 | Veloce e sicuro: questo blocco lo riconosci. |
| `speedMatchMessages` | `alto` | 4 | Ottimo primo giro. |
| `speedMatchMessages` | `alto` | 5 | Il tempo non ti ha messo in difficoltà. |
| `speedMatchMessages` | `medio` | 1 | Il primo giro è andato discretamente, poi hai ripassato il resto. |
| `speedMatchMessages` | `medio` | 2 | Qualcuna è arrivata subito, altre te le sei riprese nel ripasso. |
| `speedMatchMessages` | `medio` | 3 | Non è filato liscio al primo giro, e il ripasso è servito. |
| `speedMatchMessages` | `medio` | 4 | A tempo qualcosa ti è sfuggito, e ci sei tornato. |
| `speedMatchMessages` | `medio` | 5 | Il grosso c'è; su una parte hai avuto bisogno di un secondo giro. |
| `speedMatchMessages` | `basso` | 1 | Il primo giro è andato male, e hai ripassato tutto quello che mancava. |
| `speedMatchMessages` | `basso` | 2 | Poche al primo colpo: questo blocco è ancora da assestare. |
| `speedMatchMessages` | `basso` | 3 | Qui hai faticato, e sei arrivato in fondo. |
| `speedMatchMessages` | `basso` | 4 | Ne hai mancate più di quante ne hai prese, e il ripasso è stato lungo. |
| `speedMatchMessages` | `basso` | 5 | Questo blocco ti ha messo in difficoltà, e lo hai finito comunque. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 1 | Hai provato già diverse volte questa frase — è normalissimo, capita a tutti quando si impara qualcosa di nuovo. Conviene andare avanti: su una frase così, insistere adesso non aiuta. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 2 | Capita, e non è un problema: questa frase ha bisogno di più tempo del resto. Vai avanti con l'esercizio. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 3 | A volte una frase è più ostica delle altre, capita anche a chi va già bene. Meglio proseguire ora e lasciarla decantare. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 4 | Nessuna fretta: certe frasi richiedono più ripetizioni di altre, ed è previsto dal metodo. Vai avanti col resto. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 5 | Non ci sei ancora, ma va bene così — è proprio il motivo per cui esistono i ripassi. Continua pure con il resto dell'esercizio. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 1 | Ce l'hai fatta, e si vede che i tentativi hanno aiutato: hai insistito ed è servito. Vai avanti con lo stesso spirito. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 2 | Alla fine ci sei arrivato — i primi tentativi non erano andati benissimo, ma hai corretto la mira. Proprio questo è il modo in cui si impara. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 3 | Bel recupero: non era venuta bene subito, ma hai continuato a provarci e ora è a posto. Continua così. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 4 | Hai insistito su questa frase ed è servito: adesso la sai fare meglio di prima. È esattamente il senso del ripasso. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 5 | Ci sei riuscito dopo qualche tentativo in più, e va benissimo così — vuol dire che il ripasso sta funzionando. |
| `moduleCompleteMessages` | `alto` | 1 | Il primo colpo è andato bene: questo blocco lo sai. |
| `moduleCompleteMessages` | `alto` | 2 | Bel lavoro — qui sei andato sicuro. |
| `moduleCompleteMessages` | `alto` | 3 | Quello che hai studiato in questo blocco ti è rimasto. |
| `moduleCompleteMessages` | `alto` | 4 | Il primo passaggio è andato bene, e il poco che è tornato indietro lo hai rivisto. |
| `moduleCompleteMessages` | `alto` | 5 | Qui hai lavorato bene, e si vede già dal primo passaggio. |
| `moduleCompleteMessages` | `medio` | 1 | Buona parte al primo passaggio, e sul resto sei tornato. |
| `moduleCompleteMessages` | `medio` | 2 | Ci sei: una parte è entrata subito, sul resto hai dovuto tornarci. |
| `moduleCompleteMessages` | `medio` | 3 | Non è filato tutto liscio, ma il grosso lo hai preso. |
| `moduleCompleteMessages` | `medio` | 4 | Va bene così: su quello che ti ha fatto esitare sei tornato. |
| `moduleCompleteMessages` | `medio` | 5 | Niente da rifare adesso: il giro è completo. |
| `moduleCompleteMessages` | `basso` | 1 | Questo blocco era in salita, e lo hai portato a termine comunque. |
| `moduleCompleteMessages` | `basso` | 2 | Molte le hai prese solo tornandoci sopra: vuol dire che non sono ancora tue. |
| `moduleCompleteMessages` | `basso` | 3 | Il primo colpo è andato male, e hai rifatto il giro per intero. |
| `moduleCompleteMessages` | `basso` | 4 | Ne hai mancate più di quante ne hai prese, e ci sei tornato sopra una per una. |
| `moduleCompleteMessages` | `basso` | 5 | Qui hai faticato, e sei arrivato in fondo comunque. Questo passo si riapre dalla mappa, quando vuoi. |
| `studioCompleteMessages` | `default` | 1 | Fatto. Questo tipo di esercizio funziona così: un po' alla volta. |
| `studioCompleteMessages` | `default` | 2 | Fatto: continuare a esercitarti così è esattamente il modo giusto. |
| `studioCompleteMessages` | `default` | 3 | Sessione completata: queste cose si fissano col tempo, non in un colpo. |
| `studioCompleteMessages` | `default` | 4 | Ottimo: tornarci più volte è quello che le fa restare. |
| `studioCompleteMessages` | `default` | 5 | Esercizio concluso — puoi sempre tornarci per un altro giro quando vuoi. |
| `storyCardsCompleteMessages` | `alto` | 1 | Hai segnato chiare le spiegazioni, una dopo l'altra. |
| `storyCardsCompleteMessages` | `alto` | 2 | Le hai date per chiare: è un buon posto da cui ripartire. |
| `storyCardsCompleteMessages` | `alto` | 3 | Questo dialogo lo dichiari chiaro — e sei tu a saperlo. |
| `storyCardsCompleteMessages` | `alto` | 4 | Nessun dubbio grosso, a sentire te. |
| `storyCardsCompleteMessages` | `alto` | 5 | Le strutture di questo dialogo per te tornano. |
| `storyCardsCompleteMessages` | `medio` | 1 | Buona parte delle spiegazioni le hai segnate chiare; su alcune no. |
| `storyCardsCompleteMessages` | `medio` | 2 | Qualcuna chiara, qualcuna no — e sei tu che hai detto quali. |
| `storyCardsCompleteMessages` | `medio` | 3 | Il grosso ti torna; su alcune strutture hai messo il dubbio. |
| `storyCardsCompleteMessages` | `medio` | 4 | Una parte l'hai segnata chiara, e sulle altre sei stato onesto. |
| `storyCardsCompleteMessages` | `medio` | 5 | Un po' chiare e un po' no: le incerte restano segnate come tali. |
| `storyCardsCompleteMessages` | `basso` | 1 | Poche spiegazioni segnate chiare: questo dialogo va ancora digerito. |
| `storyCardsCompleteMessages` | `basso` | 2 | Hai segnato più dubbi che certezze, e averlo detto serve. |
| `storyCardsCompleteMessages` | `basso` | 3 | Più no che sì, per come le hai segnate. |
| `storyCardsCompleteMessages` | `basso` | 4 | Sono costruzioni nuove, e tu hai detto che non sono ancora chiare. |
| `storyCardsCompleteMessages` | `basso` | 5 | Questo passo si riapre dalla mappa, se vuoi rileggerle. |
| `dialogoCompleteMessages` | `siLoSo` | 1 | Questo dialogo lo dai per imparato: avanti il prossimo. |
| `dialogoCompleteMessages` | `siLoSo` | 2 | Hai detto che lo sai, e sei tu a sentirtelo. |
| `dialogoCompleteMessages` | `siLoSo` | 3 | Segnato come acquisito. Bel passo. |
| `dialogoCompleteMessages` | `siLoSo` | 4 | Lo hai ascoltato e lo dai per tuo. |
| `dialogoCompleteMessages` | `siLoSo` | 5 | Un dialogo in meno da rivedere. |
| `dialogoCompleteMessages` | `nonAncora` | 1 | Non ancora, e averlo detto è la cosa giusta. |
| `dialogoCompleteMessages` | `nonAncora` | 2 | Puoi riascoltarlo quando vuoi: questo passo si riapre dalla mappa. |
| `dialogoCompleteMessages` | `nonAncora` | 3 | Capita di non sentirsi sicuri: lo hai segnato, e resta lì. |
| `dialogoCompleteMessages` | `nonAncora` | 4 | Rifarlo non è un passo indietro. |
| `dialogoCompleteMessages` | `nonAncora` | 5 | Prenditi il tempo che serve. |
| `retryIntroMessages` | `first.titles` | 1 | Primo passaggio finito |
| `retryIntroMessages` | `first.titles` | 2 | Primo giro completato |
| `retryIntroMessages` | `first.titles` | 3 | Hai finito il giro principale |
| `retryIntroMessages` | `first.titles` | 4 | Bene, si passa al ripasso |
| `retryIntroMessages` | `first.titles` | 5 | Ora si ripassa |
| `retryIntroMessages` | `first.bodies` | 1 | Da qui in poi si ripassano solo le voci che ti sono sfuggite. |
| `retryIntroMessages` | `first.bodies` | 2 | Ora torniamo solo su quello che ti serve rivedere. |
| `retryIntroMessages` | `first.bodies` | 3 | Ripassiamo insieme solo le voci che non sono ancora andate a segno. |
| `retryIntroMessages` | `first.bodies` | 4 | Il resto per adesso va: ci concentriamo su quello che manca. |
| `retryIntroMessages` | `first.bodies` | 5 | Ripasso mirato: solo le voci da rivedere, niente di più. |
| `retryIntroMessages` | `last.titles` | 1 | Ultimo ripasso |
| `retryIntroMessages` | `last.titles` | 2 | Ultimo giro |
| `retryIntroMessages` | `last.titles` | 3 | Ci siamo quasi, ultimo passaggio |
| `retryIntroMessages` | `last.titles` | 4 | Un'ultima ripassata |
| `retryIntroMessages` | `last.titles` | 5 | Ultimo richiamo |
| `retryIntroMessages` | `last.bodies` | 1 | Dopo questo giro l'esercizio è chiuso. |
| `retryIntroMessages` | `last.bodies` | 2 | Finito questo ripasso vedrai com'è andata. |
| `retryIntroMessages` | `last.bodies` | 3 | Ancora questo giro, poi si prosegue con il resto del percorso. |
| `retryIntroMessages` | `last.bodies` | 4 | Un'ultima volta su queste voci, e hai fatto. |
| `retryIntroMessages` | `last.bodies` | 5 | Completa questo giro e si passa oltre. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 1 | Episodio completato alla grande — tutti i moduli sono andati bene! |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 2 | Ottimo lavoro su tutto l'episodio, davvero solido dall'inizio alla fine. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 3 | Ce l'hai fatta su ogni modulo: complimenti per la costanza. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 4 | Episodio superato in pieno, senza punti deboli. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 5 | Un episodio impeccabile — hai il controllo di tutto quello che hai imparato. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 1 | Hai completato l'intero episodio, complimenti! |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 2 | Bel lavoro: hai portato a termine tutti i moduli dell'episodio. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 3 | Episodio finito, con buoni risultati su gran parte dei moduli. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 4 | Ottimo impegno su tutto l'episodio, si vede che hai lavorato bene. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 5 | Complimenti per aver completato l'intero episodio. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 1 | Se vuoi, un ripasso veloce sui moduli gialli non fa mai male. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 2 | Quando ti va, dai un'altra occhiata ai moduli da rivedere. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 3 | Nessuna fretta, ma un ripasso dei moduli gialli può aiutare. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 4 | I moduli da rivedere restano lì per quando avrai voglia di ripassarli. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 5 | Un ripasso dei moduli segnati in giallo, quando capita, li rende ancora più solidi. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 1 | Hai completato l'intero episodio, complimenti per esserci arrivato in fondo! |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 2 | Bel lavoro: hai portato a termine tutti i moduli, dall'inizio alla fine. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 3 | Episodio finito — non è per niente scontato arrivare fino in fondo. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 4 | Complimenti per aver completato tutto l'episodio. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 5 | Ottimo impegno: hai chiuso l'intero episodio. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 1 | Vale la pena rifare i moduli segnati in rosso: ti aiuteranno a fissare meglio queste parti. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 2 | I moduli in rosso meritano un altro giro: sono lì apposta per essere ripresi. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 3 | Conviene tornare sui moduli rossi quando puoi: aiuta più di quanto sembri. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 4 | Dai un'altra possibilità ai moduli rossi: rifarli è il modo più veloce per migliorarli. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 5 | I moduli rossi sono un buon punto da cui ripartire con un ripasso. |

---

## 4 — I TITOLI

*I testi che non stanno in una lista: ce n'è **uno solo per caso**, quindi si legge sempre quello.*

| Famiglia | Percorso | Testo |
|---|---|---|
| `valvolaSicurezzaMessages` | `nonRiuscita.title` | Tranquillo, capita! |
| `valvolaSicurezzaMessages` | `riuscita.title` | Ce l'hai fatta! |

---

## 5 — LE LISTE VUOTE

⚠️ **UNA LISTA VUOTA NON HA RIGHE NELLA SEZIONE 3, quindi senza questa sezione SPARIREBBE — e la
differenza fra «lista vuota» e «chiave che non c'è» la vede solo il codice che la legge.** *È la stessa
forma dello spazio ai bordi: un dato che non si vede.*

| Famiglia | Percorso |
|---|---|
| `episodeFinalMessages` | `tuttiVerdi.tip` |

⚠️ **E QUESTA VUOTA È UNA DOMANDA APERTA, NON UN FATTO DECISO:** i suoi due fratelli
(`gialloNoRosso.tip`, `almenoUnRosso.tip`) hanno **cinque** consigli ciascuno. *Può essere voluto — «a
chi ha tutto verde non c'è niente da consigliare» — o uno spazio mai riempito.* **Chi guida il progetto
decide.**

---

## 6 — DA RILEGGERE, E NON IN QUESTO GIRO

**Una sola voce, e non per scelta nostra: non ha un lettore.**

| | |
|---|---|
| **`episodeFinalMessages` — 25 stringhe** | *tre fasce: `tuttiVerdi`, `gialloNoRosso`, `almenoUnRosso`.* 🔴 **Nessun lettore in `app/` né in `index.html`**: l'unica occorrenza è `tests/test_batch11.js`, che è una guardia. ⚠️ **Per la regola 47 non sono ancora nate: si rileggono quando nasce il modulo «Verifica finale»** |

🔴 **E FINO AL 20261017C QUESTA SEZIONE TENEVA APERTA UNA DOMANDA CHIUSA DICIOTTO GIORNI PRIMA.**

*Diceva: «`studioCompleteMessages` parla di ascolto e pronuncia, ma la categoria `studio` contiene OTTO
moduli… prima di riscrivere serve una misura: compare a fine di ogni modulo `studio` o una volta a fine
blocco?»*

| | |
|---|---|
| **La misura era già fatta** | ⭐ **il 2026-09-29, da Claude Code**, *e la riga aperta era stata chiusa il 30/09: «lo usano solo Repeat Aloud (sempre) e Why We Say It quando un episodio non ha spiegazioni, non Match né Flash Card»* |
| **Dove viveva** | `docs/decisioni-stato.md` |
| 🔴 **Cosa ha fatto la copia** | *il 17/10 abbiamo rimisurato la stessa cosa — stesso risultato — e poi abbiamo scritto a Code che la riga del SUO registro era sbagliata.* **Era sbagliata la nostra copia** |

> ⭐ **Regola 48 vista dal lato del danno: un fatto ricopiato non invecchia solo — fa ripetere il lavoro
> e incolpare l'originale.**

🔴 **E l'errore dentro l'errore era nel ragionamento, non nella pigrizia:** *questa sezione partiva da
«la famiglia appartiene alla categoria `studio`, che ha otto moduli».* **Una famiglia di testi non
appartiene a una categoria: appartiene a CHI LA LEGGE.** *Due chiamate, non otto moduli.*

> ⚠️ **È il perimetro sbagliato della §«una misura ha bisogno del suo perimetro»**, *e per il metro delle
> forme non ne apre una nuova: «categoria» invece di «chiamanti» è un perimetro scelto male.*

⭐ **E i due titoli di `valvolaSicurezzaMessages` sono stati letti il 17/10 e vanno bene:** *«Tranquillo,
capita!» non nomina nessun meccanismo, e «Ce l'hai fatta!» è vero — quel titolo compare solo quando la
voce è stata presa.* **Con questi due il conto dei riletti è 107 su 132.**

