# Decisioni — LO STATO

**Il primo file da aprire.** Dice **cosa è aperto adesso** e **in che ordine**,
e niente altro.

> ⚠️ **Il PERCHÉ di ogni scelta non è qui: è in
> [`decisioni-storico.md`](decisioni-storico.md)**, 4330 righe di ragionamento,
> triage e misure. Questo file si apre per sapere cosa fare; quello per sapere
> perché è così.
>
> **E si SVUOTA:** quando una riga viene eseguita va in
> [`correzioni.md`](correzioni.md) e sparisce da qui. *Un registro che solo
> cresce diventa un cimitero che nessuno rilegge; uno che si svuota mostra da
> solo cosa è rimasto indietro.*

**Due regole, e sono tutte:**

1. **Una riga per decisione: cosa, e QUANDO si esegue.** Il *quando* è una
   **condizione**, non una data — le date scadono da sole e mentono.
2. **Si scrive nel commit in cui la decisione viene presa**, come i test
   (regola 23) e le correzioni (regola 43).

---

# DOVE SIAMO — 2026-09-26

| | |
|---|---|
| **Lo spacchettamento** | **FINITO** (2026-09-20). `index.html` tiene il markup e **una riga di JavaScript**; l'app vive in **26 file** sotto `app/` e **10** sotto `stile/`, e nessuno chiede più niente a `index.html`. *Il conto non si legge qui, si conta:* `grep -c 'src="app/' index.html` |
| **Il riordino dei documenti** | **FINITO** (2026-09-24): i dati dell'edizione **si generano** dai markdown con `node tests/tools/trascrivi.js`, le fonti sono 5, i documenti scaduti stanno in `docs/archivio/`, i 26 strumenti sono descritti tutti |
| **La suite** | **80 file, 1774 asserzioni**, verde in locale e in CI (2026-09-26). *Il numero vive in `tests/BASELINE-ASSERZIONI.txt`, che lo scrive un comando: qui è una fotografia, e come tutte invecchia* |
| **L'obiettivo, in una riga** | *arrivare a un sistema online e sicuro, e poi scrivere episodi* |

---

# ⚠️ COSA C'È DA FARE — 2026-09-26

**Non c'è una catena numerata davanti, e non è una dimenticanza: è la regola 45
applicata a sé stessa.** *Il 2026-09-20 sono state guardate quattro righe di
piano e **tutte e quattro erano sbagliate** — un passo quattro volte più grande
della stima, uno già fatto, uno per tre quinti, uno per metà e col nome che
mandava a guardare la metà fatta.* **Quindi si decide il prossimo passo quando
si prende, non adesso.**

⚠️ **QUESTA SEZIONE PORTA SOLO CIÒ CHE È APERTO, dal 2026-09-26.** Le schede
chiuse — con tutto il loro ragionamento, e coi numeri sbagliati che avevano —
sono in `decisioni-storico.md`, sezione «Le schede chiuse di *cosa c'è da
fare*». *Erano novantotto righe in cui il chiuso e l'aperto stavano mescolati:
chi cercava il prossimo passo doveva leggere quattro schede finite per
trovarne una viva.* **Il perché non si perde, cambia file** — ed è la divisione
che questi due file hanno per mestiere.

## ⚠️ TUTTO L'APERTO, IN UNA TABELLA SOLA

*Una riga per cosa, e la colonna che conta è la terza: **quando si sblocca**.
Le schede lunghe di ciascuna stanno dove sono sempre state — più sotto in
questo file, o nello storico — e la colonna «dove» dice dove.*

| # | Cosa è aperto | Quando si sblocca | Dove sta la scheda |
|---|---|---|---|
| **1.12** | **La catena di validazione delle edizioni — CINQUE, due episodi ciascuna.** È il collaudo che dice se il modello regge, e va fatto **prima di Supabase**. Dentro ci sta la **tendina dell'edizione** nel Pannello Admin: oggi `edizione.lingua`/`edizione.studente` sono due caselle di testo libere, e una tendina ha bisogno dell'elenco delle edizioni **che il browser non può scoprire** (`trascrivi.js` sì) | **appena ci sono le edizioni da validare** — chi guida il progetto sta scrivendo i due episodi di spagnolo. *Deciso il 2026-09-26: «sfiniamo gli episodi, così quando lo farai poi vediamo se è tutto ok»* | qui sotto, «① prima di Supabase» |
| **1.10** | **Il giro dei buchi** | **per definizione ULTIMO** — si fa quando la lista smette di cambiare | qui sotto |
| **1.18** | **Le asserzioni che cadono sotto contesa.** ⚠️ **Non è più una scheda da aprire: è un GIRO che si ripete.** Otto asserzioni chiuse fra il 24 e il 26 settembre, **con otto cause diverse** — e il nome della scheda («la famiglia che corre contro timer corti») era sbagliato per almeno quattro di loro. Lo strumento c'è: `tests/tools/stress.sh <giri> [parallelismo]`, e **a 40 in parallelo il difetto si compra a comando** (a 20 dà zero, che non vuol dire niente) | **quando si vuole comprarne una**, o quando la CI va rossa senza spiegazione | la scheda intera è nello storico |
| **F.3** | **Il giro di design sulla mastery**, tre voci: ① i **due colori** che si chiamano tutti e due «colore» · ② la **media di Voice Practice** che nessuno mostra · ③ **report VERDE e mappa ROSSA**, tutti e due corretti | **è una DECISIONE di chi guida il progetto**, non un passo da prendere | qui sotto, «i fuori catena» |
| **F.7** | **I due episodi sono protetti in modo diverso, e nessuno l'aveva deciso** — sei controlli su uno e non sull'altro | **alla revisione di design di fine episodio 5** — aspetta un catalogo vero invece di due episodi | qui sotto, «i fuori catena» |
| **1.20** (un terzo) | **La scelta dell'EDIZIONE dal Pannello Admin.** Le altre due parti — spostare gli episodi, spegnerli — **sono fatte il 2026-09-26** | **è la stessa cosa di 1.12**, e ci sta dentro | qui sotto |
| **④ delle sequenze** | Una **rinomina** rimandata di proposito da chi guida il progetto: *«non rinominiamo più perché parliamo di cose differenti, le rinomine le rivedremo più avanti»* | **al giro delle rinomine**, quando ci sarà | qui sotto, «le quattro delle sequenze» |
| **I due paragrafi scaduti** | Due frasi false nel **modello degli episodi** e in `inglese-it-aircraft-door.md` — il ripiego «sulla prima riga» (è sul predefinito) e le età di `gate` descritte come tabelle interne (sono in `ages.anni`) | **quando si mette mano a quei file** (regola 33), e **prima sul modello** o il prossimo episodio le riporta indietro. *La fonte da cui copiare è già giusta:* `inglese-it-gate.md` righe 265-267 e 284 | qui sotto |
| **«Base Inglese»** | ⚠️ **NON È UN NOME, SONO DUE**, e la misura li separa: `<title>` e la schermata di attesa sono il nome **dell'APP** (compaiono prima del file dell'edizione), i due badge di onboarding e home sono il nome del **CORSO** (compaiono dentro `accendi()`, cioè dopo). *Ne segue che vanno in due posti: `app/config.js` e `struttura-corso.json`.* **E il corso oggi non ha un campo suo:** `episodeSequence` vale `corso-inglese-a1`, che è l'id di un ordine, non un titolo | **insieme alla prossima modifica a `config`**, e il nome non è ancora deciso. *Deciso così da chi guida il progetto il 2026-09-26* | qui sotto |
| **Il Pannello Admin vero** | `config` va chiuso a tutti quando nascerà quello vero | **con Supabase** | qui sotto |
| **I file fermi** | Un **giro** che si ripete, non un passo: i file che nessun commit tocca da più di una settimana | **quando lo si vuole rifare** | qui sotto |

| **1.16 residuo** | **`wipeEpisodeProgress` conosce meno chiavi di quante ne esistano**, e l'elenco è scritto a mano dentro la funzione. *Misurato il 2026-09-26: due prefissi nominati alla lettera (`introDismissed`, `repeatAloudIntroDismissed`).* ⚠️ **Il difetto non è il numero: è che l'elenco non cresce col mondo che descrive** — quando nasce una chiave nuova per episodio, la cancellazione resta indietro **senza un errore** | **al prossimo passo che tocca i progressi** | qui sotto, «trovato catalogando» |
| **L'opzione che nessuno prova** | **Ogni volta che si aggiunge un valore a una tabella di personalizzazione, quel valore non è provato da nessuno:** le prove guidano il **predefinito**, quindi la nona riga di una tabella è coperta come una riga scritta a caso. *Il caso che l'ha scritto: `orig-lugano` avrebbe prodotto «I am from Lugano, Italy».* **E nessun test sceglie Lugano, quindi la suite sarebbe rimasta verde** | **al prossimo giro delle tabelle**, con una guardia che monta la frase per OGNI riga di ogni tabella | qui sotto, sezione omonima |
| **Gli id posizionali** | Gli id delle voci degli episodi sono diventati **posizionali** (`a-1`, `d-4`), e il modello lo ha insegnato. Un riordino del contenuto cambia gli id, e **gli id sono le chiavi della mastery di chi studia** | **prima che ci sia più di un profilo che conti**, cioè con Supabase | qui sotto, sezione omonima |
| **Le cose piccole** | Otto famiglie, il dettaglio nello storico: deroghe dichiarate senza scadenza, pulizie rimandate, dati che nessuno può leggere, il volume di `sfxPlayTone` fuori da `APP_CONFIG`, la causa di `test_batch19` mai chiusa, il report per grado | **nessuna ha una condizione propria**: si prendono quando si passa vicino | `# LE COSE PICCOLE`, più sotto |

| **I testi che lo studente legge** | ⚠️ **Censiti il 2026-09-26, e due file su sette non hanno una fonte markdown: `istruzioni-moduli.json` (208 stringhe) e `messaggi-feedback.json` (141).** Il primo ha la bozza in `nuovi/`; il secondo **non l'ha mai letto nessuno**, e sono i testi dell'ESITO — *una spiegazione lunga si salta, un messaggio di esito sbagliato si crede*. Piu' **quattro stringhe nel codice**: le tre domande dei Dialogue in `app/config.js` e il messaggio del browser in `index.html` | **il primo e' in corso**; il secondo appena chi guida il progetto lo vuole guardare | qui sotto, «il censimento di tutto cio' che lo studente legge» |
⚠️ **E QUELLO CHE NON È IN QUESTA TABELLA È CHIUSO.** *Un elenco che porta anche
il chiuso non si legge per decidere: si legge per ricordare, ed è un altro
mestiere e un altro file.*

## ⚠️ «BASE INGLESE» — E NON È UNA COSA SOLA: SONO DUE — misurato il 2026-09-26, non fatto

⚠️ **LA DOMANDA L'HA POSTA CHI GUIDA IL PROGETTO, E HA CAMBIATO LA RISPOSTA:**
*«forse dove adesso vedo base inglese, non è il nome dell'app ma forse il nome
del corso. io "base inglese" lo vedo solo nella schermata che adesso è impostata
come iniziale»*.

**Aveva ragione, e la misura lo separa in due.** Il primo giro di questa scheda
diceva «quattro punti, uno solo in `app/config.js`»: **è sbagliato**, perché
tratta come un valore solo due cose che vivono in due mondi diversi.

| Riga | Dove | Quando compare | Di chi è il nome |
|---|---|---|---|
| `6` | `<title>` | **prima di qualunque JavaScript** | **dell'APP** |
| `162` | `.app-title` della schermata di **attesa** | mentre `struttura-corso.json` **non è arrivato** | **dell'APP** |
| `173` | `.badge` dell'**onboarding** | **dopo** che la struttura è arrivata | **del CORSO** |
| `208` | `.badge` della **home** | **dopo** che la struttura è arrivata | **del CORSO** |

⚠️ **LA RIGA CHE SEPARA I DUE GRUPPI È UNA MISURA, NON UN'OPINIONE:**
`showView('onboarding')` sta **dentro `accendi()`** (`app/mappa.js:587`), cioè
nel `.then` di `caricaStrutturaCorso()`; e `goHome()` è la sua alternativa nello
stesso `if`. **Quindi quelle due schermate non esistono mai prima del file
dell'edizione** — e un nome che venga da lì arriva sempre in tempo.

*Le altre due no, e per ragioni opposte: `<title>` lo legge il browser prima di
eseguire una riga, e la schermata di attesa **esiste proprio per coprire quel
fetch** — prendere il suo titolo dal file che sta aspettando è la regola 35 alla
lettera.*

**Ne segue la forma, e i due posti sono già quelli giusti per altre cose:**

| | Dove va | Perché lì |
|---|---|---|
| **il nome dell'APP** | `app/config.js` | primo `<script>` bloccante, già in memoria quando parte tutto (regola 3); compare da solo nel Pannello Admin; `<title>` si scrive da lì con una riga |
| **il nome del CORSO** | `data/{lingua}/{studente}/struttura-corso.json` | **è dell'edizione, esattamente come `gradeNames`** (regola 26): un corso di spagnolo vuole il suo nome, e condividerlo farebbe governare lo spagnolo da una scelta presa per l'inglese |

⚠️ **E OGGI IL CORSO HA GIÀ UN NOME, che però non è quello che lo studente
legge:** `episodeSequence` vale `"corso-inglese-a1"` — *l'id dell'ordine degli
episodi, non un titolo.* Notato da chi guida il progetto nello stesso giro:
*«uno è il nome dell'app e uno è il nome del corso?»*. **Sono due cose, e la
seconda non ha ancora un campo suo.**

**DECISO il 2026-09-26 da chi guida il progetto: si aspetta, e si fa INSIEME
alla prossima modifica a `config`** — *«mettilo insieme quando faremo un'altra
modifica a config così le facciamo insieme»*. ⚠️ **E la ragione per aspettare
non è il risparmio di un giro: il nome non è deciso**, e cambiarlo in quattro
punti oggi vuol dire cambiarlo due volte.

## ⚠️ IL CENSIMENTO DI TUTTO CIO' CHE LO STUDENTE LEGGE — 2026-09-26

⚠️ **LA DOMANDA L'HA POSTA CHI GUIDA IL PROGETTO DOPO AVER SCOPERTO UN FILE CHE
NON SAPEVA DI AVERE:** *«questo file non mi ricordavo nemmeno l'esistenza. ci
sono altri file che dovremmo secondo te rivedere insieme?»*. **Misurato, non
ricordato.**

### ① I file di dati: tre su sette non hanno una fonte markdown

| File dati | Stringhe | Fonte markdown | Lo studente lo legge? |
|---|---|---|---|
| `inglese-it-gate.json` | 261 | ✅ `inglese-it-gate.md` | sì |
| `inglese-it-tabelle-personalizzazione.json` | 229 | ✅ `...-tabelle-personalizzazione.md` | sì |
| **`inglese-it-istruzioni-moduli.json`** | **208** | ❌ **NESSUNA** → la bozza e' `nuovi/inglese-it-istruzioni-moduli.md` | **sì, tutto** |
| `inglese-it-aircraft-door.json` | 185 | ✅ `inglese-it-aircraft-door.md` | sì |
| **`inglese-it-messaggi-feedback.json`** | **141** | ❌ **NESSUNA** | **sì, tutto** |
| `inglese-it-struttura-corso.json` | 108 | ✅ `inglese-it-struttura-corso.md` | in parte (`gradeNames`, `moduleLabels`) |
| `inglese-it-migrazioni-personalizzazione.json` | 62 | ❌ nessuna, **e va bene** | **no** |

⚠️ **`messaggi-feedback.json` E' IL SECONDO CASO IDENTICO AL PRIMO, E NESSUNO
L'HA MAI RIVISTO: 141 stringhe in dieci famiglie** — `percentageRule`,
`voiceCoachMessages`, `speedRoundMessages`, `valvolaSicurezzaMessages`,
`moduleCompleteMessages`, `studioCompleteMessages`,
`storyCardsCompleteMessages`, `dialogoCompleteMessages`, `retryIntroMessages`,
`episodeFinalMessages`. *Sono i testi che lo studente legge **nel momento
dell'esito**, cioe' quelli che pesano di piu': una frase troppo lunga in una
spiegazione la si salta, una frase sbagliata dopo un errore la si crede.*

✅ **`migrazioni-personalizzazione.json` NON serve una fonte, e la ragione e' che
non e' testo:** sono mappe da id salvato a id di oggi, e le sue chiavi `_LEGGIMI`
/ `_COSA_E` portano dentro il file la spiegazione di se stesso. *E' il pattern
giusto per un file che nessuno legge a schermo.*

### ② Fuori dai file di dati: due punti dove il testo dello studente sta nel CODICE

| Dove | Cosa | Perche' e' un caso |
|---|---|---|
| **`app/config.js:434, 446, 454`** | le **tre domande** del Box Doppia Scelta dei Dialogue: *«L'hai imparato?»*, *«Sai ripetere le frasi?»*, *«Ce l'hai fatta?»* (`dialogo.profili.*.finalBoxQuestion`) | ⚠️ **Testo che lo studente legge, dentro `APP_CONFIG` invece che in `istruzioni-moduli.json` (regola 8).** *Ci e' finito perche' e' una proprieta' del PROFILO, e il profilo e' configurazione — ma la domanda e' contenuto. E non e' coperto dall'eccezione della regola 35: non parla del meccanismo che lo porta.* |
| **`index.html:619`** | *«Il tuo browser non supporta il riconoscimento vocale (Web Speech API).»* | ⚠️ **L'ultimo messaggio d'errore dello studente scritto nel markup.** *Non e' la regola 35: quel messaggio non parla di `istruzioni-moduli.json`, quindi il testo da la' arriverebbe benissimo.* |

### ③ Le stringhe del markup: 29, e 22 sono decise di proposito

Misurate con una lettura statica di `index.html` (tag con testo e senza
`data-testo`). **Nessuna e' una dimenticanza nuova:** sono le tre famiglie gia'
decise il 2026-09-26 col passo 1.3 — onboarding/home (**devono funzionare quando
niente funziona**), Pannello Admin (**strumento, non studente**: 7 delle 29), e i
**nomi dei moduli nelle intestazioni**, che `CONFIG.moduleLabels` **riscrive a
runtime**.

⚠️ **E il markup porta DUE nomi che a runtime vengono sostituiti da altri: dice
«Voice Coach» dove `moduleLabels` dice «Voice Check», e «Ascolta e Ripeti» dove
dice «Dialogue: Listen & Repeat».** *Lo studente vede quello giusto, quindi non
e' un difetto: e' un nome vecchio che sopravvive in un posto che nessuno rilegge
— la stessa forma del commento invecchiato, applicata al markup.*

### Cosa vale la pena rivedere insieme, in ordine

| | Cosa | Quante stringhe | Perche' adesso |
|---|---|---|---|
| **1** | le **16 spiegazioni** (`howItWorks`) | 16 titoli + 16 corpi | **gia' in corso**: una persona vera le ha provate e le ha dette troppo lunghe |
| **2** | i **messaggi di esito** (`messaggi-feedback.json`) | **141** | e' il file gemello del primo per natura, e nessuno l'ha mai letto. *Si legge con lo stesso giro: estrarre, guardare, accorciare, mettere sotto fonte* |
| **3** | i **16 promemoria** (`helpReminder`) | 16 + 16 | stanno nello stesso file delle spiegazioni, quindi costano zero in piu' se si guardano insieme |
| **4** | le **tre domande** dei Dialogue e il messaggio del browser | 4 | due righe di codice, e chiudono l'ultimo testo dello studente fuori dai file di dati |

⚠️ **E L'ORDINE NON E' PER DIMENSIONE: e' per QUANTO PESA UNA FRASE SBAGLIATA.**
*Una spiegazione lunga si salta; un messaggio di esito sbagliato si crede.*

## ⚠️ DUE PARAGRAFI SCADUTI NEL MODELLO DEGLI EPISODI — segnalati il 2026-09-26, DA FARE

*Chiesto da chi guida il progetto: **«segnalo e verificalo poi dopo che ci
metteremo mano»**. Misurato oggi, non corretto — sono file di contenuto
(regola 33) e la correzione va fatta quando si toccano.*

⚠️ **VA FATTA PRIMA SUL MODELLO, altrimenti il prossimo episodio la riporta
indietro:** `nuovi/inglese-it-EPISODIO-VUOTO.md` è la fotocopia da cui nascono
gli episodi nuovi.

| Dove | Cosa dice di falso | Cosa è vero |
|---|---|---|
| `nuovi/inglese-it-EPISODIO-VUOTO.md:223` · `docs/inglese/it/inglese-it-aircraft-door.md:225` | «un valore salvato fuori elenco **non ripiega sul predefinito — ripiega sulla PRIMA RIGA**» | ripiega **sul predefinito**; la prima riga è solo l'ultima spiaggia — corretto il 2026-09-24 (passo 1.8-bis ④) |
| `nuovi/inglese-it-EPISODIO-VUOTO.md:228` · `docs/inglese/it/inglese-it-aircraft-door.md:230` — sezione **8, «LE TABELLE INTERNE ALL'EPISODIO»** | «oggi è il caso delle età di `gate`» (`ageOptions.figlia`, tabelle dentro il file episodio) | le età sono **salite in `ages.anni`**, il magazzino condiviso, lo stesso 2026-09-24 |

✅ **E LA FONTE DA CUI COPIARE C'È GIÀ, misurata:** `docs/inglese/it/inglese-it-gate.md`
ha **entrambi** i paragrafi corretti — riga **265-267** («*ripiega proprio sul
predefinito, e la prima riga è solo l'ultima spiaggia*») e riga **284** («*Il
passo 1.8-bis ③ le ha portate nel magazzino condiviso (`ages.anni`)*»).
*Quindi non è una riscrittura: è un travaso da un file che è già giusto.*

## Un GIRO che si ripete — non un passo

### ⚠️ I FILE FERMI DA PIÙ DI UNA SETTIMANA — chiesto il 2026-09-24

*Proposto da chi guida il progetto: **«verificare se ci sono file non aggiornati
da più di una settimana. Se sì, guardare dentro cosa c'è e se è attuale e utile.
In caso, riportarli in chat in una tabella e decidere cosa fare per ciascun
file.»** Accettato, con una correzione che lo salva dall'essere una misura che
non misura.*

⚠️ **LA DATA DEL FILESYSTEM QUI NON FUNZIONA, E IL CONTROLLO SAREBBE MUTO.** Il
container clona il repository da zero a ogni sessione: `ls -l` dice che **tutti**
i file sono di oggi. *Un controllo sulle date dei file direbbe sempre «nessun
file vecchio»: zero allarmi, zero informazione — e nessuno se ne accorgerebbe,
perché un elenco vuoto somiglia a un buon risultato.*

**La misura è l'ultimo commit che ha toccato quel file:**

```
git ls-files | while read f; do
  d=$(git log -1 --format=%at -- "$f")
  [ -n "$d" ] && [ $(( ($(date +%s) - d) / 86400 )) -gt 7 ] && echo "$f"
done
```

**Prima misura, 2026-09-24: 33 file su 209.** E non sono sparsi — **due terzi
sono una famiglia sola**:

| Quanti | Cosa | Fermi dal | Cosa è cambiato dopo |
|---|---|---|---|
| **12** | `docs/screenshots/` — 11 immagini + README | **2026-08-29** | — |
| **1** | `tests/tools/screenshot_*.js` — gli strumenti che quelle immagini le producevano | 2026-09-09 | ⚠️ **Questa riga diceva OTTO, ed erano SEI il giorno in cui è stata scritta** (misurato il 2026-09-26: `git ls-tree` sul commit del 24 settembre ne conta 6). **Cinque cancellati il 2026-09-26** perché l'unica cosa che li nominava era la riga di `tests/tools/README.md` che li elencava; **resta `screenshot_blocco_ascolto`**, che ha tre riferimenti veri. *Un numero dentro un censimento non si cita: si rimisura (regola 38).* |
| 4 | `package.json`, `package-lock.json`, `tests/serve.js`, `.nojekyll` | 08-29 / 08-30 | — |
| ~9 | helper dei test (`quiz-driver`, `story-driver`, `apri-modulo`, …) | 09-09 / 09-10 | — |

*Cioè il primo giro ha già il suo candidato: gli screenshot e i loro strumenti.
**Non si cancellano e non si aggiornano senza guardarli** — la domanda della
regola è «cosa c'è dentro, è attuale, serve a qualcuno», e la risposta va in una
tabella in chat, un file per riga.*

**Quando si fa:** è un giro che si ripete, non un passo che si chiude — quindi
non sta nella catena e non blocca niente. *Si fa quando la lista dei passi è
ferma, come il 1.10, oppure quando serve una pausa dal codice.* Deciso il
2026-09-24: **non adesso** — *«io andrei avanti con i punti attuali sennò
continuiamo ad interromperli e sembrano infiniti»*.

## Per definizione ULTIMO

| | Cosa |
|---|---|
| **1.10** | **il giro dei buchi** — *si fa quando la lista smette di cambiare* |

---

# ⚠️ IL WORKFLOW, DAL 2026-09-24

**Cambiato da solo mentre lavoravamo, e vale la pena scriverlo perché nessuno
l'ha deciso in un giro apposta.**

| | Prima | Adesso |
|---|---|---|
| **Chi scrive i dati** | io, a mano, leggendo il markdown | `node tests/tools/trascrivi.js` |
| **Dove si scrive il contenuto** | otto file in `docs/inglese/it/` | **DATI** (4, li leggo io) e **RAGIONI** (`edizione.md`, non lo leggo mai) |
| **Come arriva un file nuovo** | incollato in chat | in **`nuovi/`**, che non fa partire la CI; io confronto e riporto, **poi** si promuove |
| **Prima di cancellare un file** | si guardava | **si cerca chi lo nomina**, e i rimandi si correggono nello stesso commit |

**Il giro di un episodio nuovo, in cinque mosse:**

1. **tu** scrivi `docs/inglese/it/inglese-it-{id}.md` partendo da `nuovi/inglese-it-EPISODIO-VUOTO.md`
2. **tu** aggiungi la riga alla sezione 7 di `struttura-corso.md` — *è quella che decide l'ordine, ed è l'unica che un test confronta col JSON*
3. **io** lancio il trascrittore: se i conti dichiarati non tornano **si ferma invece di scrivere**
4. **io** lancio la suite completa, poi la CI
5. **tu** guardi su Pages **la cosa che il codice vecchio non sa fare**

---


---

# COME SI PRENDE UN PASSO — «ANALISI A DUE, CODICE A UNO»

*Decisa il 2026-09-20, ed è la **regola 45** di `CLAUDE.md`: là la regola, qui i numeri che l'hanno scritta.*

**Due momenti, e il primo non costa niente.**

### ① L'ANALISI, SEMPRE, E SUI DUE PASSI SUCCESSIVI INSIEME

Prima di scrivere una riga si misura **cosa resta davvero** dei due passi in
cima alla lista. Costa dieci minuti, **zero suite e zero CI**, e non si salta.

⚠️ **Non è prudenza: è che il piano invecchia più in fretta di quanto sembri.**
Misurato il 2026-09-20, quattro righe guardate e quattro sbagliate:

| Passo | Diceva | Era |
|---|---|---|
| **1.4** | un passo da accorpare | **560 pezzi**, quattro volte la stima |
| **1.5** | «la regola 8 nomina un file solo» | già fatto; restavano **quattro percorsi falsi** che non erano nell'elenco |
| **1.6** | cinque voci da eseguire | **tre già eseguite** il 10 settembre, una era una nota, due rimandate dalla riga stessa |
| **1.7** | «Supabase in UN file invece che in **101 punti**» | **27 punti**, e metà già fatta dai passi 1.9 e 1.11 — *col nome che mandava a guardare proprio la metà fatta* |

### ② L'ACCORPAMENTO, E LA REGOLA È MISURATA, NON PRUDENTE

⚠️ **L'analisi NON riduce le suite: rende possibile la decisione di
accorpare, ed è l'accorpamento che le riduce.** La distinzione conta, perché
misurando si scopre che l'accorpamento fa risparmiare **solo in un caso**.

**Il conto del 2026-09-20: otto passi, DODICI suite.** Le quattro in più vengono
**tutte** da passi che toccano codice che gira — **nessuna** dall'accorpamento.
*I sei file rossi del giro 1.9+1.4 erano tutti di 1.9; 1.4 non ne ha prodotto
nemmeno uno.*

> **SI ACCORPA QUANDO AL MASSIMO UNO DEI DUE TOCCA CODICE CHE GIRA.**

| I due passi | Cosa si fa | Verificato su |
|---|---|---|
| documenti / commenti **+** documenti / commenti | **insieme**, una suite sola | 1.5 + 1.6 → 1 suite, verde al primo giro |
| codice **+** documenti | **insieme**; se va rosso, il rosso è del primo | 1.9 + 1.4 → 2 suite, e i rossi erano tutti di 1.9 |
| **codice + codice** | **MAI insieme** | 1.11a e 1.11b divisi apposta: 7 rossi al primo giro, 26 al secondo, **tutti attribuiti in un secondo** |

**L'ultima riga non è prudenza ed è la sola che vale la pena motivare:** due
passi di codice costeranno **due suite comunque** — lo dice il conto — quindi
accorpandoli si paga lo stesso prezzo **più** l'ambiguità di non sapere quale
dei due ha rotto cosa.

# LA STRADA, IN QUATTRO TAPPE

Lo spartiacque è **Supabase**, e il criterio per collocare un passo **non è
l'importanza: è cosa diventa più difficile se lo si fa dopo.**

## ① PRIMA DI SUPABASE — pulire e ordinare

*Tutto quello che rende il codice misurabile. Farlo dopo significherebbe
lavorare su una base che non si può misurare.*

| | Passo | Perché adesso |
|---|---|---|
| **1.3** | ~~le stringhe del markup~~ | ✅ **CHIUSO il 2026-09-21, in quattro pezzi.** **1.3a** — ricontate (95 occorrenze in `index.html`, 47 distinte, **non** le 101/48 del piano), **54 spostate**; il markup porta `data-testo` e `hydrateTesti` lo riempie appena i testi arrivano. **1.3b** — la mappa aspetta i suoi testi, con la sua schermata d'errore: dei dieci punti che la aprono, **nove** sono un «← Mappa» dentro un modulo e non pagano niente. **1.3c** — censimento su `app/*.js` guardando **dove la stringa arriva allo schermo**: 28 punti, **nove spostate**; `Pausa` stava in due posti e `Risposta corretta: ` in due file. **1.3d** — `moduleLabels`, **trenta testi**, esce da `app/config.js` e va nell'edizione. ⚠️ **Restano nel markup 41 occorrenze, nessuna per dimenticanza:** onboarding/home (devono funzionare quando niente funziona), Pannello Admin (strumento, non studente), sovrascritte a runtime (segnaposto). |
| **1.8** | **Le tabelle di personalizzazione prendono la forma nuova** | ✅ **1.8 A FATTO il 2026-09-20:** via le colonne `fr`/`es`/`de` (147 stringhe vuote, zero lettori), **traducibilità dichiarata per riga**, e il test rovesciato ⑤ nella forma che oggi è possibile (9 slot su 9). ⚠️ **RESTA 1.8-bis, E ASPETTA IL CONTENUTO:** ② città+paese sulla stessa riga · ③ età in lettere · ④ **la migrazione**, che le prime due rendono obbligatoria. *Senza ④, cambiando `marco` in `papa-marco` chi ha personalizzato si ritrova le scelte riportate alla prima opzione — in silenzio, senza errore e senza un rosso.* **Il markdown è stato allineato il 2026-09-21** (autorizzato in chat, regola 33): dice cosa è fatto e cosa no. |
| **1.10** | **Il giro dei buchi** | ⚠️ **Non è un riassunto: è una ricerca di cosa non è in nessuna lista.** Si fa quando la lista smette di cambiare, cioè alla fine di questa tappa |
| **1.12** | **La CATENA DI VALIDAZIONE delle edizioni — CINQUE, due episodi ciascuna** | ⚠️ **È il collaudo che dice se il modello delle edizioni regge**, e va fatto prima di Supabase. Si fa **una per volta, in quest'ordine**, e ognuna parte solo quando la precedente funziona: **① `francese/it`** mette alla prova il modello · **② `it/francese`** ⚠️ **è la sola che prova la SECONDA metà della coppia** — uno studente non italiano — e da sola vale più delle altre tre messe insieme · **③ `tedesco/it`** che la prima non fosse un caso · **④ `spagnolo/it`** che il costo scenda invece di restare uguale · **⑤ `it/spagnolo`** che anche il rovescio si ripeta. *Se la quarta costa quanto la prima, il modello non regge e si vede lì.* Il contenuto lo scrive chi guida il progetto, in `docs/{lingua}/{studente}/` (regole 26 e 33), corretto davvero — un contenuto finto non farebbe vedere gli errori. ⚠️ **IL COSTO DELLE DUE ROVESCIATE VA DETTO:** in `it/francese` le spiegazioni si scrivono **in francese**, non in italiano, ed è un lavoro di natura diversa dal tradurre un dialogo. *Se l'energia dovesse finire, la ② è quella da non saltare e la ④ quella da saltare.* ⚠️ **L'ORDINE È CAMBIATO IL 2026-09-24, DECISO DA CHI GUIDA IL PROGETTO: SI PARTE DALLO SPAGNOLO, E SI VALIDA PRIMA DI CONTINUARE CON GLI EPISODI.** Non più ① `francese/it` ② `it/francese`, ma **① `spagnolo/it` → ② `it/spagnolo`**, e *«quando sarà ok faremo un episodio di italiano per spagnoli, così da validare tutto prima di continuare con gli episodi»*. ⚠️ **UNA COSA A FAVORE, che il piano diceva già:** la seconda è *«la sola che prova la SECONDA metà della coppia, e da sola vale più delle altre tre messe insieme»* — **questa scelta la prende per seconda invece che per quarta.** ⚠️ **E UNA COSA CHE SI PERDE, e va riassegnata invece che dimenticata: la ④ NON era «un'altra edizione», era LA MISURA DEL COSTO** — *«che il costo scenda invece di restare uguale. Se la quarta costa quanto la prima, il modello non regge e si vede lì.»* Con lo spagnolo in prima posizione **quella misura resta senza soggetto**: la prenderà la quarta edizione qualunque essa sia, e va scritto quando si deciderà quale. ⚠️ **PRIMO OSTACOLO, TROVATO IL 2026-09-24 E NON CORRETTO: `tests/tools/trascrivi.js` CONOSCE UNA SOLA EDIZIONE** — riga 25, `const ED = { lingua: 'inglese', studente: 'it' };`, più un `'corso-inglese-a1'` scritto fisso alle righe 312-313. *Chi scrive `docs/spagnolo/it/` lo scriverebbe e nessuno lo leggerebbe.* **È lavoro mio, e si fa quando il primo episodio spagnolo è pronto**, così lo strumento si prova su un contenuto vero — ed è lo stesso giro in cui si scopre cos'altro è scritto fisso. |

### ⚠️ LA CODA CHE IL LAVORO HA FATTO EMERGERE — 2026-09-21

*Non erano nel piano. Sono usciti facendo i passi, e stanno qui perché una
cosa che non è in nessuna lista è una cosa che non si fa.*

| | Cosa | Condizione |
|---|---|---|
| ~~**1.13**~~ | ✅ **FATTO il 2026-09-22: l'ordine degli episodi e' un DATO dell'edizione.** `episodeSequences` + `episodeSequence` nel file di struttura, accanto a `sequences` — **stesso meccanismo dei moduli, un livello sopra**, ed e' la forma scelta da chi guida il progetto contro il mio consiglio di una lista semplice: *«se funziona per i moduli, la stessa logica e' simile per gli episodi; questo facilita anche per me utilizzare il codice»*. **Aveva ragione lui**, e il nome `resolveEpisodeOrder` era stato LIBERATO apposta il 2026-09-21 per questa funzione. **Riordinare e' spostare una riga della lista**: il numero dell'episodio non esiste da nessuna parte, e' la sua posizione li'. ⚠️ **NIENTE equivalente di `moduleOrder`** (l'ordine scritto per intero che scavalca la sequenza): quello esiste perche' il Pannello Admin lo scrive riordinando i moduli, e per gli episodi il pannello non riordina (decisione 1.14) — *un meccanismo senza utenti e' `moduleOrderDefault`*. ⚠️ **E `CONFIG.episodioCorrente` E' USCITO da `app/config.js`**: era l'ultimo superstite della famiglia che il passo 1.11 aveva portato nell'edizione. I due lettori dell'ordine — il menu admin e il ripiego all'avvio — adesso chiedono al corso ⚠️ **MA L'ORDINE NON E' ANCORA LIBERO DAVVERO, e l'ha scoperto la prova.** Scambiando le due righe (JSON + tabella del markdown) per far vedere l'effetto su Pages, **due test sono andati rossi, e tutti e due per una ragione vera:** ① `test_struttura_corso` **[Episodi]** confronta `JSON.stringify` della tabella del documento con `JSON.stringify(CONFIG.episodes)`, quindi **dipende dall'ORDINE DELLE CHIAVI dell'oggetto `episodes`** — che 1.13 ha appena smesso di usare come ordine. *Un confronto che passa per `stringify` di un oggetto e' un confronto sull'ordine delle chiavi senza dirlo.* ② `test_interruttore_episodio` **[B] e [C]** prendono «il secondo del menu» e si aspettano `aircraft-door`: **l'identita' del secondo e' scritta nel test.** *Nessuno dei due e' un difetto dell'app: sono due punti in cui la SUITE da' per scontato che gate sia il primo, ed e' esattamente il contrario di quello che 1.13 ha stabilito.* | ✅ |
| ~~**1.14**~~ | ~~Creare e cancellare una sequenza dal Pannello Admin~~ | ❌ **NON SI FARÀ — deciso il 2026-09-21 da chi guida il progetto**, e la ragione è sua: *«queste cose si modificano talmente tante volte che è uno spreco di risorse creare la possibilità di modifica dal pannello admin; è molto più facile passare dal file»*. ⚠️ **Il pannello resta quello che è: un posto dove PROVARE una sequenza prima di deciderla**, con le modifiche che vivono in `localStorage` e spariscono. La decisione è scritta anche in `inglese-it-struttura-corso.md` (_017-bis), perché è lì che qualcuno andrà a cercarla |
| ~~**1.15**~~ | ~~`resolveEpisodeOrder` ha il nome della cosa sbagliata~~ | ✅ **FATTA il 2026-09-21: `resolveEpisodeOrder` → `resolveModuleOrder`.** Diceva «l'ordine degli episodi» e restituiva l'ordine dei **moduli di un** episodio. ⚠️ **Rimandata il 2026-09-20 e ripresa oggi per una ragione precisa, non per cambio di idea:** il passo 1.13 sta per far nascere l'ordine VERO degli episodi. *Finché quella cosa non esisteva, il nome era solo brutto; dal giorno in cui esiste, punta a quella sbagliata.* Sei forme cercate, **zero occorrenze nel codice** — le tre rimaste sono nei registri storici, dove il nome vecchio è ancora il fatto vero |
| ~~**1.16**~~ | ✅ **FATTO il 2026-09-24: nasce `CHIAVI_EPISODIO`, e una guardia diventa rossa quando nasce una chiave non dichiarata.** Comportamento invariato — le stesse tre si azzerano — ma le altre sei portano scritto **perché** sopravvivono. ⚠️ **Restano le due DOMANDE APERTE**, con la condizione di prima: `storyCardsDeclarations` e `storyCardsExplanationStats` si decidono quando si tocca Why We Say It. *Era:* ⚠️ **TRE CHIAVI SU NOVE, non su sette: la riga stessa è invecchiata.** **`wipeEpisodeProgress` cancella tre chiavi per episodio**, con l'elenco scritto a mano. ✅ **DECISO il 2026-09-24: la correzione NON è aggiungere le mancanti.** *Una lista di nove che era di sette e a cui nessuno ha badato tornerà incompleta alla decima.* **La lista non si deve più scrivere a mano**; se derivarla non si può, serve **una guardia che confronti le chiavi dell'episodio con quelle cancellate e diventi rossa quando ne nasce una nuova.** ⚠️ **E va fatta come PASSO SUO**, non dentro S.1: sono due difetti che si sono incontrati, non uno. Due delle quattro superstiti sono conti e non progresso; `storyCardsDeclarations` invece regge lo Sblocco Sequenziale, quindi dopo un wipe il modulo si ri-blocca in mappa **ma riapre le card già dichiarate** | quando si tocca Why We Say It o la schermata Personalizza |
| **1.20** | ⚠️ **DUE DELLE TRE COSE SONO STATE FATTE IL 2026-09-26** (riga ③ dei fuori catena), e questa riga resta aperta solo per la TERZA. *Spostare e spegnere non hanno aspettato l'episodio 5 perché chi guida il progetto le ha chieste per andare avanti adesso: le servono per creare gli episodi, non per collaudarli quando saranno venti.* **Resta da fare: scegliere QUALE EDIZIONE si sta modificando** — e non è un pezzo del pannello episodi, è la scelta del corso, che appartiene a **1.12**. *Il testo originale della riga, che resta vero su quella terza parte:* **IL PANNELLO DEGLI EPISODI, come quello dei moduli: alzare e abbassare, spegnere, e scegliere QUALE EDIZIONE si sta modificando.** Chiesto da chi guida il progetto il 2026-09-22, con la sua ragione: *«quando inizieremo ad averne tanti sara' utile andare a verificare sempre che modulo c'e' o no»*. ⚠️ **E RIBALTA IN PARTE LA 1.14, che va letta insieme:** li' il pannello non riordina perche' *«e' molto piu' facile passare dal file»* — vero per le sequenze dei MODULI, che si scrivono una volta e poi stanno ferme. **Per gli EPISODI la ragione e' un'altra: non riordinare, VEDERE.** Con venti episodi il file e' un elenco che non dice quale e' spento e quale manca; una schermata lo dice a colpo d'occhio. *Non e' un cambio di idea: e' un'esigenza diversa che si scopre quando il catalogo cresce.* ⚠️ **E la terza cosa — «quale edizione sto modificando» — NON e' un pezzo del pannello episodi: e' la scelta del corso**, che il giro dello studente mette al secondo posto (riga 1.13-bis) e che appartiene a **1.12** | **alla revisione del design di fine episodio 5**, insieme al test trasversale di F.7 — *stessa data, e non per caso: tutt'e due aspettano di vedere un catalogo vero invece di due episodi* |
| ~~**1.13-bis**~~ | ✅ **FATTO il 2026-09-22: la lista degli episodi esiste, e con lei la TERZA variante dello Sblocco Sequenziale.** `view-episodes` riusa `.card`, `.header-2row` e `.module-row` della mappa (regola 11): *due liste che si somigliano devono somigliarsi anche nel codice, o divergono al primo ritocco.* Lo sblocco guarda **l'ULTIMA POSIZIONE** della sequenza — non un modulo per nome (gli episodi di `grammatica` ne avranno meno) e non un conteggio (un passo aggiunto in mezzo ri-bloccherebbe tutti gli episodi finiti). ⚠️ **E LA MODIFICA E' ADDITIVA, contro il mio disegno iniziale:** avevo mandato il pulsante di casa alla lista, **e la misura ha dato ragione alla regola 1** — 102 punti in 57 file di test ci passavano, ma soprattutto *quel pulsante NOMINA un episodio («Inizia ‹Al gate›»), quindi mandarlo a una lista contraddirebbe la sua stessa scritta.* Adesso casa ha **due** strade: continua da dove eri, e guarda tutti gli episodi. La catena sta in due righe, una per pulsante — come chiesto: *«ogni schermata lavora a se' e non sa chi viene dopo»*. ⚠️ **La scelta del CORSO resta fuori: e' di 1.12** | ✅ |
| ~~**1.17**~~ | ✅ **FATTO il 2026-09-22: le chiavi del magazzino portano l'edizione.** `prefissoMagazzino()` in `app/progressi.js` costruisce `baseinglese:{lingua}-{studente}:` e **dieci chiavi su dodici** ci passano. ⚠️ **Le due che NON lo portano sono una scelta scritta:** `introDismissedKey` e `legacyRaIntroDismissedKey` dicono «ho gia' visto come funziona questo modulo» — *sapere come si usa Flash Card non e' una cosa del corso d'inglese*, e rimettere la spiegazione davanti a chi cambia corso sarebbe un passo indietro. ⚠️ **`helpRequests` invece SI', ed e' controintuitivo:** la chiave non porta l'episodio ma le sue VOCI lo portano dentro, quindi due edizioni mescolerebbero le richieste. **E i test hanno smesso di scrivere la forma a mano: 108 punti convertiti in 49 file** — nel browser chiedono `BI.*Key(...)`, in Node il nuovo `chiaveMagazzino()` di `test-env.js`, gemello lato test (regola 24). *La conversione era stata rimandata di proposito il 2026-09-17 («la conversione di quei 197 punti NON e' di questo commit»): 1.17 la rendeva obbligatoria.* | ✅ |
| **1.18** | ⚠️ **AGGIORNATO IL 2026-09-24 — I NUMERI DEL RUNNER CI SONO, E SMONTANO L'IPOTESI CENTRALE.** Nasce `misura(nome, fn)` (`tests/attese.js`), e `run_full_regression.sh` raccoglie le righe in fondo **sempre**, così arrivano anche nel log della CI. **Container contro runner, corsa `b59fe0d` verde:** `6b avviso-di-silenzio` 107–115 → **118 ms (1,05×)** · `6b stop-verso-conferma` 9–26 → **8 ms (0,9× — il runner è più VELOCE)** · `batch19/qm` 603–607 → **613 ms (1,01×)** · `/sr` 598–604 → **611 ms (1,01×)**. ⚠️ **Quindi su queste tre catene il divario sistematico NON C'È.** *La riga di questa scheda, e la regola 19, dicono «il container è sistematicamente più veloce e la differenza è stabile»: vero nel 2026-09-10, **non vero qui**. Un numero misurato una volta non resta vero perché è scritto.* ⚠️ **E IL MARGINE STRETTO ERA SULLA CATENA SBAGLIATA:** i «485 ms / trentatré volte» riguardano `stop-verso-conferma`, che ne ha 491 (55×). La riga tesa è **`[6b] Still recording just before the (shrunk) silence timeout fires`**: legge a **200 ms** contro un timer che scatta a **~312** — **margine 112 ms, cioè 1,56×** — e non era **mai stata misurata**. ⚠️ **TERZA CATENA DELLA FAMIGLIA, trovata leggendo una corsa rossa che non era stata letta:** la n.291 (`3594fc4`, *un commit di SOLI DOCUMENTI*, quindi la causa non può essere il diff) è caduta su **`test_batch17 [Job1e-bis]` — «Option mini-listen audio is actually playing» e «Answering stops the option's own mini-listen audio»**. *«Un'asserzione a caso per corsa, ogni volta una diversa»: le diverse osservate sono adesso **tre**, e la terza è di una famiglia che il documento non nominava — l'audio delle opzioni.* ⚠️ **FREQUENZA MISURATA SU 30 CORSE: 29 verdi, 1 rossa.** *Il «2 su 3» del 2026-09-22 oggi non si manifesta più — ma non è passato: la rossa è di stamattina.* ✅ **DECISO il 2026-09-24 — la strada è A: NIENTE CORREZIONI AL BUIO.** Si estende `misura()` alla terza catena e alle altre attese sospette, e **si aspetta la prossima rossa col log già strumentato**. *Il difetto è raro, 1 su 30: senza i numeri **della corsa rossa**, qualunque correzione è una scommessa — e «sostituire un numero scelto con un altro numero scelto è la stessa forma, col verde in più per un po'».* *Era:* ⚠️ **LA CI E' DIVENTATA INAFFIDABILE SUL RUNNER: UNA ASSERZIONE A CASO PER CORSA, E OGNI VOLTA UNA DIVERSA.** Misurato il 2026-09-22 su **tre corse consecutive**, due delle quali rosse — e la seconda rossa su un commit che cambia **UNA RIGA DI MARKDOWN**, quindi la causa non puo' essere il contenuto del commit. ⚠️ **Corsa 1 (dba8583): `test_batch19`**, *«[SR Task1] Non lo so resets to enabled on the next question»*, stato alla resa `{contatore: "2 / 9", revealAperto: false, spento: true}` — Speed Match non e' avanzato entro il tetto di 15s di `attendiDomandaSuccessiva`. **Rilancio: VERDE.** ⚠️ **Corsa 2 (7643d85): `test_batch13`**, *«[6b] Normal pending/confirm flow reached instead»* — Voice Coach col timeout di silenzio ridotto a 0,3s: invece dell'avviso di silenzio e' arrivato il giro normale. **E in quella corsa `test_batch19` e' passato 40/40.** *Non e' UN test ballerino: e' una FAMIGLIA — asserzioni che corrono contro timer corti (0,3s di silenzio, la catena pausa+timer di Speed Match), verdi in locale perche' il container e' sistematicamente piu' veloce del runner (regola 19).* ⚠️ **In tutte e due il conteggio era 1672 = baseline: nessun file caduto, UNA riga rossa.** Quindi non e' una regressione: e' il margine che si e' assottigliato. ⚠️ **E il costo e' quello che la regola 37 teme: un verde che non ci si puo' permettere di credere.** Con ~2 corse su 3 rosse a caso, «la CI e' rossa» smette di voler dire qualcosa, e la prossima rossa VERA passa per l'ennesimo ballerino ⚠️ **PRIMA MISURA, 2026-09-22, E SMONTA L'IPOTESI DEL TETTO.** Il chiodo sospettato era la catena di `test_batch13` [6b] — «stop della registrazione → area di conferma visibile» — letta dall'asserzione dopo **500 ms fissi**. **Misurata su cinque giri: 11, 12, 12, 14, 15 ms.** Margine peggiore **485 ms**: il runner dovrebbe essere **trentatre volte** piu' lento. *Non e' il tetto, e non lo e' per un ordine di grandezza — non per poco.* ⚠️ **Quindi NON e' stata toccata nessuna attesa: e' stata aggiunta la DIAGNOSI.** Le due righe di [6b] adesso stampano lo stato intero (`avviso`, `conferma`, `registrando`, `pulsanteNascosto`) quando una delle due e' rossa, perche' sul runner erano cadute in uno stato che **non e' nessuno dei due previsti** e dal log non si capiva quale. *Sistemare un rosso che non si capisce e' fare una misura che non misura.* ⚠️ **`test_batch19` [SR Task1] NON e' stata misurata**: la sua catena e' un'altra e il numero di questa non vale per quella. | ⚠️ **ADESSO — non e' piu' «quando si tocca Speed Match».** Il primo passo e' **misurare**, non alzare i tetti: quanto ci mette davvero ognuna di quelle catene sul runner, prendendo i tempi invece di sceglierli. *Sostituire un numero scelto con un altro numero scelto e' la stessa forma, col verde in piu' per un po'.* Da guardare insieme a **F.2** (i 17 finti sintetizzatori senza `speaking`), che e' la stessa famiglia vista dall'altro lato |
| ~~**1.19**~~ | ✅ **FATTO il 2026-09-22: l'ordine degli episodi e' libero anche per la SUITE.** I due punti che davano per scontato `gate` primo: ① `test_struttura_corso` **[Episodi]** confrontava `JSON.stringify` dei due oggetti, quindi misurava **anche l'ordine delle chiavi** di `episodes` senza dichiararlo — adesso confronta **chiave per chiave**. ⚠️ **E non e' un controllo in meno: l'ordine ha la sua riga, [Ordine], che lo confronta con `episodeSequences`, cioe' col posto in cui 1.13 ha deciso che vive.** *Prima era misurato due volte, una delle quali per sbaglio e nel posto sbagliato.* ② `test_interruttore_episodio` **[B]/[C]** incollavano i due PERCORSI (`...-aircraft-door.json`, `...-gate.json`), cioe' sapevano quale fosse il secondo: adesso `primaBattuta` parte **dall'id** e costruisce il nome con `fileEdizione`, il gemello di `percorsoEdizione` (regola 24). **Provato scambiando l'ordine: tutti e due restano verdi** — prima cadevano | ✅ |

⚠️ **UNA COSA CHE IL PASSO 1.11 HA APERTO, e va decisa prima di Supabase:
l'app non disegna NIENTE finché `struttura-corso.json` non arriva.** Oggi è
un file statico sulla stessa origine, quindi si parla di millisecondi e non
si vede. **Con i dati sul server no**: su una rete lenta resterebbe una
pagina vuota senza spiegazione, che è la forma del guasto muto. Serve una
schermata di attesa — non la si inventa adesso perché oggi non c'è niente da
attendere abbastanza a lungo da poterla provare.

### ⚠️ I CINQUE CHE RESTANO, MISURATI TUTTI — 2026-09-20

*Applicata la regola 45 a tutta la coda invece che alla coppia successiva.*

| | Tocca | Superficie misurata |
|---|---|---|
| **1.3** stringhe del markup | **CODICE** | ✅ **FATTO IL 2026-09-26 per la parte che si poteva fare.** ⚠️ **Il numero qui accanto era invecchiato di molto:** misurato il 2026-09-26, **33 occorrenze e 28 distinte**, non 101 e 48 — i 65 `data-testo` dei giorni scorsi avevano già fatto la maggior parte. **Cinque candidati veri, tutti spostati**, e tre erano **duplicati di chiavi già esistenti**. ⚠️ **E `1.3b` NON resta: è fatto dal 2026-09-21.** *Qui, stamattina, avevo scritto «resta `1.3b`: la mappa non aspetta i testi» — **copiando un commento di `app/ui-condivisa.js` che era falso da cinque giorni**. `openEpisodeMap` la sua guardia ce l'ha (`if (!BI.istruzioniInMemoria())`), e se il file non arriva va alla schermata d'errore come i moduli. Il commento è stato corretto il 2026-09-26.* **Un commento invecchiato non resta un commento invecchiato: diventa un'istruzione sbagliata, e poi lo stato di un passo.** *Era:* 101 occorrenze in `index.html`, **48 distinte**; 64 occorrenze sono **15 stringhe ripetute** (`Spiegazione` ×19, `Help` ×9, `← Mappa` ×7). **Almeno 24 delle 48 NON si spostano**: 8 di onboarding/home (decisione presa — devono funzionare quando niente funziona), 8 del Pannello Admin (strumento, non studente), 8 nomi di moduli **sovrascritti a runtime** da `CONFIG.moduleLabels`, cioè segnaposto |
| ~~**1.4**~~ catalogo dei pezzi | **DOCUMENTI** | 548 scoperti su 562 — e cresce da sé quando nascono file. ⚠️ **NON È PIÙ UN PASSO dal 2026-09-20: è la regola 46 «CHI TOCCA, CATALOGA»** — la riga resta qui perché è la misura che ha scritto la regola |
| ~~**1.8**~~ tabelle di personalizzazione | ✅ **CHIUSO** — `1.8 A` il 2026-09-20, `1.8-bis` (②③④) il 2026-09-24. ⚠️ *La superficie qui accanto è la stima del 2026-09-20, **prima** che il lavoro fosse fatto: resta scritta perché è il numero che ha deciso di non accorparlo con 1.3, non perché ci sia ancora da fare.* | **27 punti in sei file**: `ui-condivisa.js` 10 · `personalizza.js` 7 · `apertura.js` 6 · `config.js` 2 · `catalogo.js` 1 · `mappa.js` 1. Più **sei file di test** che ci passano dentro |
| **1.10** giro dei buchi | documenti | **per definizione ULTIMO**: «si fa quando la lista smette di cambiare» |
| **1.12** edizioni | contenuto di chi guida il progetto | `docs/francese/` non esiste ancora |

**Cosa si può accorpare, secondo la regola 45:**

- **1.3 + 1.8 = codice + codice → MAI insieme.**
- **1.10 non si accorpa con niente**, e non per la sua natura: per la sua
  *condizione*. Accorparlo con un passo che cambia la lista lo farebbe girare
  su una lista che sta cambiando — cioè lo farebbe **girare a vuoto**.
- **1.12 dipende da chi scrive il contenuto**, non dall'ordine dei passi.

> **1.4 È L'UNICO ACCORPABILE, E LA MISURA DICE UNA COSA PIÙ UTILE:
> NON È UN PASSO, È UNA CODA.**
>
> ⚠️ **ESEGUITO IL 2026-09-20: è diventato la regola 46 «CHI TOCCA,
> CATALOGA», e la sua riga è uscita dalla tabella della tappa ①.** *Un passo
> che non finisce mai, messo in fila con quelli che finiscono, li blocca
> tutti.*

I suoi 548 pezzi stanno **dentro i file che gli altri passi toccano**. Tenerlo
come riga a sé significa, un giorno, rileggere ventiquattro file per
catalogarli; attaccarlo a ogni passo di codice significa catalogarli **quando
sono già stati letti riga per riga**, che è il solo momento in cui la colonna
«cosa dà per scontato» si scrive senza indovinare.

*Misura che lo dimostra: il passo 1.7 ha letto `progressi.js` (38 pezzi) e
`identita.js` (9) riga per riga — **quarantasette pezzi erano catalogabili quel
giorno a costo quasi zero**, e sono ancora scoperti.*

### ⚠️ LE QUATTRO DELLE SEQUENZE — una condizione sola

**Trovate il 2026-09-20 misurando il Pannello Admin** per rispondere a chi guida
il progetto. Nessuna è rotta **oggi**, e la ragione è una sola: *esiste una
sequenza sola.* Tutte e quattro diventano vere — e verificabili — nello stesso
momento.

| | Cosa |
|---|---|
| ~~①~~ | ✅ **CHIUSA il 2026-09-20.** L'override **si fonde** invece di sostituire: le chiavi del foglietto vincono una per una, quelle nuove del file restano. `persistConfigSection` continua a salvare l'oggetto intero, e adesso va bene così |
| ~~②~~ | ✅ **CHIUSA il 2026-09-20.** È un **menu** con i nomi che esistono, e **ricarica**. Un nome che non esiste resta nell'elenco dichiarandosi, invece di far cambiare la sequenza in silenzio al primo salvataggio |
| ③ | ❌ **«CREARE/CANCELLARE UNA SEQUENZA DAL PANNELLO»: CHIUSA SENZA FARLA, il 2026-09-26, e la decisione è di chi guida il progetto:** *«penso che creare una sequenza dal pannello non servirà mai»*. ✅ **FATTO il 2026-09-26 quello che è nato al suo posto: GESTIRE GLI EPISODI DAL PANNELLO — spostare prima/dopo, spegnere e riaccendere**, *«come adesso è utile fare la stessa cosa con i moduli»*. ⚠️ **E LA MISURA HA CORRETTO IL PIANO DI QUESTA STESSA RIGA, che diceva: «si fa una lista, `episodeOrder`, come `moduleOrder` — così spostare è riordinare e spegnere è togliere una voce, un meccanismo solo per due cose invece di due campi nuovi». LA SECONDA METÀ ERA FALSA: togliere un episodio dalla lista NON lo spegne, lo manda IN CODA** — è `resolveEpisodeOrder` a farlo, apposta, perché *«un episodio che esiste ma che la sequenza non nomina resta raggiungibile»*. *Se l'assenza valesse come spegnimento, un episodio nuovo — che nessuno ha ancora nominato — **nascerebbe spento**.* Quindi le due cose sono due: l'ordine resta `episodeSequences[episodeSequence]`, **la lista che 1.13 aveva già fatto nascere** (nessun `episodeOrder` nuovo: il meccanismo c'era), e lo spegnimento è una **dichiarazione a parte**, `episodiSpenti`, decisa da chi guida il progetto. ⚠️ **E LA FORMA DELLA LISTA VIENE DA UN REQUISITO SUO:** *«la lista deve essere sempre a tendina, non dovrebbe mai esserci la possibilità di mettere un ID inesistente»*. **La tendina non serve, e il risultato è migliore: la lista mostra TUTTI gli episodi che esistono** — chi non è nominato dall'ordine compare in coda, e spostarlo in su lo nomina — quindi **non c'è nessun posto dove scrivere un id.** *Un campo validato rifiuta un id sbagliato; un campo che non esiste non lo fa scrivere.* ⚠️ **Spegnere non cancella:** i progressi restano nel magazzino e tornano riaccendendo, ed è l'unica parte del passo che, se cade, cade sui dati di qualcuno — ha la sua asserzione. ⚠️ **Spegnerli TUTTI non svuota la lista in silenzio:** torna l'ordine intero con un errore in console che li nomina. **Protetto da `tests/test_ordine_episodi_pannello.js`** (24 asserzioni), **visto cadere su tre guasti realistici** — e su quello del salvataggio **lo scambio della riga resta verde**, che è la prova che il ridisegno da solo non prova niente |
| ④ | ~~**`resolveEpisodeOrder` ha il nome della cosa sbagliata**~~ — ✅ **rinominata in `resolveModuleOrder` il 2026-09-21** (riga 1.15). *Resta qui perché era la prova che l'ambiguità della parola «sequenza» non stava solo nella chat: stava in un nome del codice* |

⚠️ **TRE SU QUATTRO CHIUSE, e nessuna delle tre nel modo previsto qui.** ① e ② il
2026-09-20 col passo dei selettori — *esattamente la condizione che era scritta
qui*. ③ **il 2026-09-26, e NON facendola**: chi guida il progetto ha deciso che
creare una sequenza dal pannello *«non servirà mai»*, e al suo posto è nata — ed
è stata fatta lo stesso giorno — la **gestione degli episodi**.

**Resta ④, ed è una rinomina rimandata di proposito il 2026-09-20:** *«non
rinominiamo più perché parliamo di cose differenti, le rinomine le rivedremo più
avanti»*.

**La condizione era: il passo che rende le sequenze davvero più d'una.** Prima di
allora nessun test potrebbe farle diventare rosse — e una correzione che nessun
caso può esercitare è una riga che nessuno sa se funziona.

### ⚠️ TROVATO CATALOGANDO — `wipeEpisodeProgress` conosce tre chiavi su sette

**Trovato il 2026-09-20** scrivendo le righe di `app/progressi.js` nel catalogo
dei pezzi — *cioè dalla terza colonna, «cosa dà per scontato», e non dalla
lettura del passo 1.7, che pure aveva letto lo stesso file riga per riga.*

`wipeEpisodeProgress` è la conseguenza del «sì» all'avviso di metà episodio:
azzera il progresso che dipende dalla personalizzazione che sta per cambiare.
**Cancella tre chiavi** — passi completati, esiti, mastery — e le nomina a
mano. Le chiavi per episodio sono **sette**: sopravvivono `audioSecondsSent`,
`nextLineSkips`, `storyCardsExplanationStats` e `storyCardsDeclarations`.

**Due delle quattro non sono un difetto, ed è la parte che serve sapere:**
`audioSecondsSent` e `nextLineSkips` sono **conti, non progresso** — quanto
audio è stato speso, quante volte si è saltata l'attesa — e azzerarli
perderebbe una misura per un motivo che non la riguarda.

**Le altre due sono una domanda vera:** `storyCardsDeclarations` regge lo
«Sblocco Sequenziale» di Why We Say It (regola 30), quindi dopo un `wipe` il
modulo si ri-blocca in mappa **ma riapre le card già dichiarate**.

**Non corretto in questo giro, e la condizione è questa:** si decide **quando
si tocca Why We Say It o la schermata Personalizza**, non prima — e chiunque
**aggiunga una chiave per episodio** deve passare di qui, perché l'elenco a
mano non lo dirà da solo.

### ⚠️ I FUORI CATENA — mai chiusi, adesso numerati — 2026-09-21

*Erano un elenco puntato in fondo a una sezione, cioè un posto dove una cosa
non viene presa. **Un elenco senza numeri non si prende**: si legge e si
rimanda.* Da oggi hanno un numero e una condizione, come tutto il resto.

| | Cosa | Condizione |
|---|---|---|
| ~~**F.1**~~ | ✅ **CHIUSA TUTTA il 2026-09-21.** ① `speechstart` collegato: il taglio per silenzio non prende più chi sta parlando. ② nasce il **terzo timer** (`speechend` → 1200 ms, in `config`), con il riarmo che impedisce il taglio a metà frase. **La tabella completa dei cinque che possono fermare una registrazione, con l'evento che fa partire ognuno, sta in `decisioni-storico.md`** | — |
| ~~**F.2**~~ | ✅ **CHIUSA DA F.4 IL 2026-09-25, senza un passo suo — ed è il motivo per cui era stato deciso di fare F.4 prima.** I finti senza `speaking` erano il sintomo di **nessun finto condiviso**: col nucleo `tests/mock-browser.js` `speaking` si dichiara **in un posto solo**, e i 43 file che ci passano ce l'hanno tutti. ⚠️ **Misurato il 2026-09-26: due file hanno ancora un finto proprio**, `test_attese_condivise` (pagina sintetica per provare `attese.js`: non finge il browser per l'app) e `test_comportamento_audio` (è uno strumento di misura suo) — **e nessuno dei due è un debito**, sta scritto nei due file. *Il comando che lo rifà: `grep -l "defineProperty(window, 'speechSynthesis'" tests/test_*.js`* | ✅ **era: «quando si tocca una famiglia di test che li usa»** — chiusa prima, da F.4 |
| **F.3** | **Il giro di design sulla mastery**, tre voci: ① i **due colori** che si chiamano tutti e due «colore», e niente nell'interfaccia dice quale si sta guardando · ② la **media di Voice Practice** che nessuno mostra · ③ **report VERDE e mappa ROSSA**, tutti e due corretti, e allo studente sembrano contraddirsi | ⚠️ **LA CONDIZIONE C'ERA, ED È STATA PERSA NEL TRAVASO DEL 2026-09-21.** Sta in `decisioni-storico.md`, scritta il 2026-09-19: *«quando il report sarà visibile allo studente, e non prima»*. Qui era diventata un trattino — e un trattino si legge come «nessuna condizione», cioè l'opposto |
| ~~**F.4**~~ | ✅ **CHIUSA IL 2026-09-25, su due fronti e con due misure.** ① Il **finto del browser**: `tests/mock-browser.js`, **43 file su 45** — i due fuori sono dichiarati non-debito (vedi F.2). ② Il **boot**: `tests/boot.js` (`bootUtente`, `INTRO_DI_TUTTI`), **25 file su 32** — i sette fuori hanno ciascuno il suo motivo scritto nel file, e cinque **aspettano un selettore invece di un tempo**: portarli allo scheletro sarebbe un passo **indietro**. ⚠️ **Il guadagno non era togliere le copie:** era che portavano dentro `'gate'` inciso in ventisette file e la lista dei moduli in ventotto | ✅ **chiusa** |
| ~~**F.5**~~ | ✅ **FATTA: `episodeFinalOutcomeCase` e `buildTargetTokens` sono cancellate**, come deciso il 2026-09-21. *Misurato il 2026-09-26: nel codice non resta nessuna chiamata — solo tre commenti che dicono dov'erano e perché sono uscite (`app/catalogo.js` ×2, `tests/test_batch11.js`).* Il disegno del Modulo Finale resta in `decisioni-storico.md` e si riscrive quando nascerà | ✅ **chiusa** — era una decisione, presa il 2026-09-21 ed eseguita |
| ~~**F.6**~~ | ✅ **CHIUSA il 2026-09-21**, autorizzata: i dieci percorsi scaduti nei cinque file di contenuto, più le due frasi false in sostanza (`a1-episodio1-inglese.json`, cioè la nomenclatura che la regola 4 vieta; e *«aggiorna `APP_CONFIG` leggendo…»*, quando dal 2026-09-20 la fonte è `struttura-corso.json`) | — |
| **F.7** | **I DUE EPISODI SONO PROTETTI IN MODO DIVERSO, E NESSUNO L'AVEVA DECISO.** ⚠️ **Misurato il 2026-09-21, ed e' piu' grosso della duplicazione da cui era partito:** non sono solo due lettori uguali (`numeriAttesiDallaFonte` e `numeriAttesi`, rotti insieme lo stesso giorno) — **sei controlli su dodici mancano a un episodio o all'altro.** Solo `gate`: il confronto md↔json carattere per carattere, i segnaposto, i ruoli di chi parla, `whatYouLearn` e' una lista, i nomi dei gradi. Solo `aircraft-door`: nessun id ripetuto, ogni frase di C viene da una battuta esistente. **Il tabellone e la regola delle due famiglie sono in `tests/README.md`** — file trasversale a ogni episodio, browser su UNO solo. *Il motivo scritto per cui non erano uniformi era SCADUTO: `test_episodio2.js` dichiarava «i due markdown hanno una forma diversa», e `REGISTRO-EPISODI_004` li ha resi uguali.* | ⚠️ **DECISO il 2026-09-21 da chi guida il progetto: SI ASPETTA IL QUINTO EPISODIO.** *«Gli episodi li creiamo manualmente. Non sovraccarichiamo ora.»* **E il fatto che rende la decisione solida, non prudente: gli episodi GRAMMATICALI non avranno il grado D**, quindi il test trasversale servirebbe davvero solo ai narrativi — e oggi i narrativi sono due, tutti e due uguali. *Scriverlo adesso significherebbe scrivere la generalizzazione di UN caso.* ⚠️ **Cosa costa aspettare, e va detto perche' non e' zero:** le sei caselle scoperte del tabellone restano scoperte fino ad allora, e ogni episodio nuovo nasce con la sua copia dei controlli. **Al quinto si guarda il tabellone: se le colonne si somigliano, il test trasversale si scrive; se no, la differenza e' vera e il tabellone l'ha gia' spiegata** |

*Perché F.6 pesa più di un refuso: quei file sono la **fonte** da cui si scrive
il contenuto, e un percorso sbagliato dentro una fonte manda chi la usa a
cercare un file che non c'è — o, peggio, a crearne uno nel posto sbagliato.*

### ⚠️ F.1 — IL CONTROLLO A CODICE FERMO, 2026-09-21

*Chiesto da chi guida il progetto — «**prima di fare modifiche propongo un bel
controllo**» — e fatto **senza toccare una riga** di `app/voice.js` (regola 34).*

⚠️ **PRIMA DI TUTTO: LA MIA PROPOSTA DEL GIORNO PRIMA ERA SBAGLIATA, E VA
SCRITTO.** Avevo proposto di **riarmare il timer a ogni risultato**, cioè di
trasformare la regola da «N secondi dal click» a «N secondi di silenzio».
**È esattamente il contrario di quello che serve**, e chi guida il progetto
l'ha fermata prima che diventasse codice:

> *«la regola dovrebbe essere "3 secondi dal click se non sento nulla" … se lo
> studente non dice nulla ma non clicca, non deve partire il conteggio.»*

**E aveva ragione su tutti e due i punti. Misurato:**

| Quello che si temeva | Misura | Esito |
|---|---|---|
| «forse il conteggio parte prima del click» | `vcSilenceTimeoutId = setTimeout(…)` sta **dentro** il gestore del click di `vc-record-btn` (riga 614) | ✅ **parte al click, mai prima** |
| «forse la regola è scritta male» | alla scadenza taglia **solo** `if (vcListening && !vcHeardAnySpeech)` | ✅ **la regola è giusta**: se hai parlato, non taglia |

**QUINDI IL DIFETTO NON È NÉ LA REGOLA NÉ IL MOMENTO IN CUI PARTE. È *DOVE SI
DECIDE DI AVER SENTITO*.**

`vcHeardAnySpeech` diventa vero in **un punto solo**: dentro `onresult`
(riga 212), cioè **quando il riconoscitore ha già prodotto del testo** — anche
provvisorio. Ma fra «la persona ha cominciato a parlare» e «Chrome consegna il
primo pezzo di trascrizione» passa un tempo **suo**, non nostro.

⚠️ **E LA WEB SPEECH API HA TRE EVENTI MOLTO PIÙ PRECOCI CHE IL CODICE NON USA.**
Cercati in `app/voice.js`: `onaudiostart`, `onsoundstart`, `onspeechstart` —
**zero occorrenze, nessuno dei tre è collegato**. `speechstart` è l'evento che
dice *«sto sentendo una voce»*, e arriva **prima** del primo `onresult`.

**Il sintomo si spiega tutto da qui, senza bisogno di un secondo numero:**

| tempo | cosa succede | `vcHeardAnySpeech` |
|---|---|---|
| 0,0 s | click su Registra, il timer parte | `false` |
| 2,5 s | **cominci a parlare** | `false` — *nessuno lo sa ancora* |
| ~2,6 s | il riconoscitore rileva voce (`speechstart`) | `false` — **l'evento non è collegato** |
| **3,0 s** | **il timeout scatta, e taglia** | `false` |
| ~3,2 s | sarebbe arrivato il primo `onresult` | — *troppo tardi* |

**La correzione che ne discende è piccola e NON tocca la regola:** far diventare
vero `vcHeardAnySpeech` anche su `speechstart`. La regola resta *«3 secondi dal
click se non sento nulla»* — cambia solo che **«sento nulla» viene misurato
quando il microfono sente**, invece che quando il riconoscitore finisce di
trascrivere.

⚠️ **IL PREZZO VA DICHIARATO PRIMA, NON DOPO: un colpo di tosse, una porta che
sbatte, la TV nell'altra stanza — per `speechstart` sono voce.** Quindi il
taglio non scatterebbe più in una stanza rumorosa, e la registrazione
andrebbe fino al tetto massimo. *La difesa contro il microfono rotto (la
striscia `vcEmptyRecognitionStreak`) non cade — quella conta le
registrazioni senza parole, e una stanza rumorosa ne produce lo stesso — ma
il taglio corto sì.* **È la scelta vera di questo passo, e non la prendo da
solo.**

### ⚠️ IL CENSIMENTO DI CHI PUÒ FERMARE UNA REGISTRAZIONE — 2026-09-21

*Chiesto da chi guida il progetto: «**bisogna trovare anche le righe di codice
per le regole, così siamo sicuri che modifichiamo dopo che abbiamo capito**».
Fatto cercando, non ricordando: ogni `setTimeout`, ogni `.stop()`, ogni
`.abort()` di `app/voice.js`, e `speechend`/`soundend`/`audioend` in tutto il
repository.*

| | Chi ferma | Riga | Quando | In `config`? |
|---|---|---|---|---|
| ① | **il dito dello studente** | 584 | click sul pulsante mentre registra | — |
| ② | **il taglio per silenzio** | 614–619 | `silenceTimeoutSeconds` dal **click**, e **solo se non ha sentito niente** | ✅ `silenceTimeoutSeconds` |
| ③ | **il tetto massimo** | 608–610 | `parole × maxRecordingMsPerWord + maxRecordingMarginMs` dal **click** | ✅ due chiavi |
| ④ | **l'abort** quando si lascia il modulo | 330 | `stopAllModuleActivity` | — |
| ⑤ | **❌ NIENTE che conti «N secondi dopo che smetti di parlare»** | — | — | — |

**I comandi, con quello che hanno trovato — zero compreso (regola 41):**

| Cercato | Dove | Trovato |
|---|---|---|
| `setTimeout\|setInterval` | `app/voice.js` | **2 timer** (② e ③) + 1 `setInterval` che aggiorna solo la scritta «0s, 1s, 2s» |
| `speechend\|soundend\|audioend` | **tutto il repository** | **0** |
| `.stop()\|.abort()` | `app/voice.js` | **4**, tutti nella tabella qui sopra |

⚠️ **E LE DUE OSSERVAZIONI DI CHI GUIDA IL PROGETTO SONO ENTRAMBE VERE. UNA
CONFERMA IL CODICE, L'ALTRA DICE CHE IL CODICE NON C'ENTRA.**

> *«se parlo senza fermarmi si ferma ad esempio a 15 sec, mentre se parlo e poi
> mi fermo dopo circa 3 sec si ferma»*

- **I 15 secondi sono ③, e il conto torna esatto:** una frase di **dodici**
  parole dà `12 × 1000 + 3000 = 15000 ms`. *È la formula, misurata dal di
  fuori senza conoscerla.*
- **I «circa 3 secondi dopo che smetti» NON SONO NOSTRI.** Nel nostro codice non
  esiste niente che li produca — la riga ⑤ è vuota, e non per una ricerca
  saltata: i tre comandi qui sopra sono stati eseguiti e hanno dato 2, 0 e 4.
  **È il riconoscitore del browser che chiude la sessione da solo** quando
  sente una pausa prolungata, e `onend` arriva **senza che nessuno abbia
  chiamato `stop()`**.

**Perché `continuous = true` (riga 191) non lo impedisce:** quel flag tiene
aperta la sessione **attraverso più risultati**, non attraverso il silenzio. La
chiusura per pausa è dentro il motore di Chrome, **non è esposta da nessuna API
del web e quindi non è configurabile.**

⚠️ **E QUESTO CAMBIA IL DISEGNO DEI «TRE TIMER», quindi va deciso prima di
scrivere:** il terzo timer chiesto — *«quello dopo che ho finito di parlare»* —
**non nasce in un posto vuoto: nasce accanto a uno che c'è già e non si può
spegnere.** Metterlo a 3 secondi lo farebbe arrivare **insieme** a quello di
Chrome, cioè non cambierebbe niente di misurabile. *Serve più CORTO di quello
di Chrome, o non serve affatto* — ed è esattamente la manopola che fa scendere
l'audio spedito, che è il costo che preoccupa.

**Quello che serve per costruirlo, e che oggi non è collegato:** l'evento
`speechend`. **Gli stessi tre eventi mancanti della riga F.1**: `speechstart`
serve a non tagliare chi ha cominciato tardi, `speechend` a tagliare chi ha
già finito. *Sono due facce dello stesso buco — il codice non sa quando la
voce comincia né quando finisce, sa solo quando arriva il testo.*

### ⚠️ LE DUE MANOPOLE CHIESTE: UNA C'È GIÀ, L'ALTRA NON ESISTE — 2026-09-21

Chi guida il progetto ha chiesto **due valori separati e modificabili da
`config`**, e tenerli separati è giusto. **Ma solo uno dei due corrisponde a
qualcosa che il codice fa.**

| Quello che è stato chiesto | Cosa esiste oggi |
|---|---|
| ① «il valore di distacco **se non sente** [nulla]» | ✅ **`CONFIG.voiceCoach.silenceTimeoutSeconds: 3`** — c'è già, ed è già nel Pannello Admin con la sua descrizione |
| ② «il valore di distacco **quando uno finisce la frase** e adesso, dopo 3 sec, la ferma» | ❌ **NON ESISTE, e non è un parametro mancante: è un comportamento mancante** |

**Cosa ferma davvero la registrazione quando hai finito di parlare, oggi:** il
**tetto massimo**, cioè `numeroParole × maxRecordingMsPerWord +
maxRecordingMarginMs` = `parole × 1000 + 3000` ms, **contato dal click**.

⚠️ **Quel `3000` è `maxRecordingMarginMs`, e ASSOMIGLIA ai «3 secondi dopo che
hai finito» senza esserlo:** è un margine sul tetto **totale**, non un conto che
parte dalla fine della frase. Su una frase di due parole il tetto è 5 s dal
click, qualunque cosa tu faccia dentro.

**Un vero «si ferma N secondi dopo che smetti di parlare» andrebbe costruito**, e
vorrebbe l'evento `speechend` più un terzo timer che si riarma. *È la cosa che
farebbe scendere davvero l'audio spedito — che è il costo che preoccupa —
perché oggi chi finisce presto paga il tetto intero.*

⚠️ **E PER QUESTO LA MANOPOLA ② NON È STATA AGGIUNTA IN QUESTO GIRO.** Una chiave
in `config` per un comportamento che non c'è comparirebbe nel Pannello Admin,
si lascerebbe cambiare, e **non cambierebbe niente**: una manopola che non
governa nulla è la regola 37 in forma di configurazione — *non somiglia a un
errore, somiglia a un'impostazione.*

### ⚠️ SU PAGES `speechstart` E `speechend` NON ARRIVANO — aperto il 2026-09-21

⚠️ **MISURATO IL 2026-09-21: `afterSpeechTimeoutMs` C'È NEL PANNELLO E GLI
EVENTI NON ARRIVANO LO STESSO.** L'ipotesi (a), la cache, è **scartata**: il
codice nuovo è sull'app vera. **Resta la (b): Chrome non emette
`speechstart`/`speechend`** in questa configurazione.

**PARCHEGGIATA, su decisione di chi guida il progetto** — *«lasciamo così per
il momento e poi vedremo»*. **Condizione per riprenderla:** quando si tornerà
sul microfono, o quando servirà davvero accorciare l'audio spedito (cioè se il
riconoscimento smetterà di essere gratuito — vedi
`scelte-strategiche-infrastrutturali.md`, ②.4).

*Costo di lasciarla lì: zero. Il comportamento è identico a prima del
2026-09-21, e i due gestori inerti non fanno danno.*

**Segnalato da chi guida il progetto dopo il collaudo:** *«adesso funzionano
solo il timer "tempo-massimo", "start" e "end" non funzionano»*.

⚠️ **PRIMA DI TUTTO, LA COSA CHE TOGLIE L'URGENZA: NON È UNA REGRESSIONE, È
UN NON-EFFETTO.** Letto il codice: se quei due eventi non arrivano,
`vcHeardAnySpeech` torna a essere alzata **solo** da `onresult` (come prima
del 2026-09-21) e `vcAfterSpeechTimeoutId` **non viene mai creato**.
`vcHeardAnyText` è letta solo dentro quella callback, che non gira. **Il
comportamento è identico a due giorni fa**: i due miglioramenti non fanno
danno, semplicemente non hanno effetto.

**LE DUE IPOTESI, e si distinguono con UN gesto e zero codice:**

| | Ipotesi | Come si scarta |
|---|---|---|
| **a** | **È la cache**: il browser serve ancora la versione di prima | Aprire `config`, gruppo `voiceCoach`: **se c'è `afterSpeechTimeoutMs`, il codice nuovo c'è** — quella chiave non esiste nella versione vecchia |
| **b** | **Chrome non emette quei due eventi** con `continuous = true` | Se la chiave c'è e gli eventi non arrivano lo stesso, resta questa |

⚠️ **E SE FOSSE LA (b), IL CODICE NON SI TOCCA A INDOVINARE.** Il finto
riconoscitore dei test **non può dire cosa fa Chrome davvero** — manda gli
eventi perché glieli mandiamo noi. *Da qui la differenza fra «l'app non
ascolta» e «il browser non parla» non è misurabile*, ed è esattamente la forma
della regola 37: una diagnosi che non può sbagliarsi non è una diagnosi.

**Serve una misura che vive sull'app vera**: un riquadro nel Pannello Admin che
registri **quali eventi del riconoscitore sono arrivati** nell'ultima
registrazione, con il momento in cui sono arrivati. Stessa forma di
`#config-audio-usage`. *Proposto, non costruito.*

### ✅ IL NOME E LA CATEGORIA DELL'EPISODIO — FATTO il 2026-09-21 (passo 2 dei sei)

`episodes.<id>` porta adesso **`nome`** («Al gate») e **`categoria`**
(`storia`, `grammatica`, `pronuncia`), e `badge: 'Episodio 1'` è sparito dal
codice. **Sono getter**, quindi il nome segue l'edizione viva.

⚠️ **E LA PAROLA «narrativo» E' USCITA DALLE CATEGORIE, NON DALLE SEQUENZE.**
Chi guida il progetto: *«non usiamo narrativo, che è una parola che sta facendo
confusione»* — e due giorni prima, sulle sequenze: *«mappa e narrazione lasciamo
così»*. **Le due frasi non si contraddicono perché parlano di due cose diverse:**
la **categoria** dice cosa contiene un episodio, la **sequenza** in che ordine si
fanno i suoi moduli. Quindi `narrativo-standard` resta, e un episodio di
`grammatica` può benissimo chiederla.

### ❌ L'ORDINE DEI 22 PASSI NON SI PROTEGGE — deciso il 2026-09-21

*Qui c'era una condizione aperta — «niente verifica più che i 22 passi vivi
siano quelli voluti, da chiudere al primo riordino vero». **È stata chiusa come
decisione, non come lavoro rimandato**, e va letta così: nessuna sessione
futura deve costruire quel test.*

**Le parole di chi guida il progetto:**

> *«Quei principi sono solo "indicazioni". Servono a me per capire e ricordarmi
> delle scelte e darne una motivazione. **Non devono essere bloccanti. Devo
> poter riordinare liberamente.** Io non mi preoccuperei di test che proteggono
> l'ordine: tanto lo scrivo io a mano, e al massimo farò delle prove. Se me ne
> servono altre le faremo.»*

⚠️ **E l'equivoco da cui è nata la proposta vale più della decisione:** i
principi `_020.._025` del documento erano stati letti **come una specifica da
far rispettare**, mentre sono **memoria delle scelte**. *Un documento scritto
per ricordare perché si è deciso qualcosa non è un contratto da verificare — e
trasformarlo in test avrebbe reso rosso proprio il gesto che deve restare
libero.*

**Misurato prima di decidere, e resta scritto perché è vero oggi:** cinque dei
sei principi erano verificabili, e tutti e cinque passavano sui 22 passi veri.
*Il fatto che si potesse fare non voleva dire che si dovesse.*

### ✅ LA NOMENCLATURA — FATTA il 2026-09-21 (passo 1 dei sei)

**Tutti i file di un'edizione portano il prefisso `{lingua}-{studente}-`**, e
il prefisso **non sta nei nomi**: lo costruisce `percorsoEdizione` da
`CONFIG.edizione`. *Quindi per un'edizione nuova non c'è nessuna lista da
allineare a mano — il codice chiede sempre il nome giusto.*

**La guardia è `tests/test_nomenclatura_edizione.js`**, e serve a un giorno
preciso: quando `docs/inglese/it/` verrà copiata in `francese/it/`, i nomi
resteranno `inglese-...` finché qualcuno non li rinomina. *Un prefisso
sbagliato è peggio di uno assente.*

⚠️ **E RESTA UN BUCO APERTO DA QUESTO STESSO PASSO, scritto qui perché non si
scopra da solo: NIENTE VERIFICA PIÙ CHE I 22 PASSI VIVI SIANO QUELLI VOLUTI.**

Il documento nuovo non elenca i passi delle sequenze, di proposito
(`STRUTTURA-CORSO_017`), quindi `test_struttura_corso.js` non ha più quella
tabella da confrontare e l'ha persa. In cambio ne guarda tre nuove — nomi dei
moduli, episodi, lingue del parlato — **ma nessuna di loro sostituisce quella.**

**Condizione per chiuderlo:** quando le sequenze diventeranno più di una vera
(oggi ce n'è una sola più una sonda), o al primo riordino fatto sul serio.
*Una riga cambiata per sbaglio dentro `sequences` oggi non fa rosso da nessuna
parte.*

### ✅ LE PAROLE: «narrativo» e «Mappa» — CHIUSO il 2026-09-21, restano

**Deciso da chi guida il progetto:** *«mappa e narrazione lasciamo così»*.

⚠️ **E la ragione per cui si poteva decidere di NON fare niente è una misura,
non una stima:** quello che legge lo studente sono **due valori in un file di
dati** — `mappaEpisodio.pageTitle` e `condivisi.tornaAllaMappa` in
`istruzioni-moduli.json`. *Cambiarli resta un gesto da un minuto, quando e se
servirà: non si chiude nessuna porta lasciandoli.* E `narrativo-standard` è un
id interno che nessuno studente legge.

**Cosa aveva davvero ingarbugliato il giro, e vale come regola:**

> **Si stava dando un nome a una cosa che non esiste.** La «lista degli
> episodi» non aveva un nome perché non c'è: non c'è la schermata, non c'è il
> dato, non c'è codice che lo legga. **Un nome scelto per una cosa che non
> esiste si scopre sbagliato solo quando la cosa nasce.**

*Misurato lo stesso giorno: l'app ha **dodici** schermate e **nessuna** elenca
gli episodi. L'episodio non si sceglie — ce n'è uno solo, deciso da
`CONFIG.episodioCorrente`, letto una volta all'avvio in `app/mappa.js`.*

### ⚠️ (storico) LE PAROLE — la valutazione che ha portato alla decisione

**Chiesto da chi guida il progetto**, e l'ordine in cui lo ha chiesto è la
parte che conta: *«decidiamo prima cosa vede lo studente e poi nominiamo di
conseguenza»*.

**Le tre cose da nominare, e sono legate:**

| | Cosa | Oggi si chiama | Problema |
|---|---|---|---|
| ① | l'ordine dei **moduli dentro un episodio** | `sequences`, e quella che esiste è `narrativo-standard` | «narrativo» fa confusione |
| ② | l'ordine degli **episodi dentro un'edizione** | `sequenza-episodi.md` | nessuno dei due nomi dice qual è quale |
| ③ | la **schermata che lo studente vede** con i passi dell'episodio | **«Mappa dell'episodio»**, e il pulsante **«← Mappa»** | *«non vuol dire più nulla»* |

**E le CATEGORIE degli episodi sono tre, dette da chi guida il progetto:
`storia`, `grammatica`, `pronuncia`.** «narrativo» esce.

**QUANTO COSTA, misurato e non stimato — ed è la parte che decide:**

| Cosa si cambia | Quanto costa |
|---|---|
| **③ la parola che legge lo studente** | ✅ **DUE VALORI IN UN FILE DI DATI.** `mappaEpisodio.pageTitle` («Mappa dell'episodio») e `condivisi.tornaAllaMappa` («← Mappa») in `istruzioni-moduli.json`. **Zero righe di codice**, zero rischio |
| **① il nome `narrativo-standard`** | 78 occorrenze di «narrativ» in **19 file**, quasi tutte prosa. ⚠️ **Ma in `test_struttura_corso.js` è UNA riga sola**, perché il 2026-09-21 il nome è diventato la costante `SEQUENZA_CONFRONTATA` |
| **gli id interni (`sequences`, i nomi delle funzioni)** | è una **rinomina**, quindi regola 41 per intero |

⚠️ **QUINDI SI POSSONO FARE SEPARATAMENTE, ED È LA COSA PIÙ UTILE DA SAPERE:**
quello che vede lo studente si cambia **oggi, in due valori**, senza toccare
una riga di codice. *Le rinomine interne sono un'altra decisione, e possono
aspettare.*

⚠️ **E UNA COLLISIONE DA SEGNALARE PRIMA DI SCEGLIERE:** `percorsoEdizione`
**esiste già**, in `app/dati.js`, e **non è una sequenza**: è la funzione che
costruisce il percorso su disco di un file dell'edizione
(`data/inglese/it/...`). Usare quel nome per l'ordine degli episodi
significherebbe avere due cose diverse con lo stesso nome — la forma
⓪-decies. *Se si sceglie quella parola, quella funzione va rinominata nello
stesso passo (`fileDellEdizione` direbbe quello che fa).*

### ⚠️ IL DOPPIO CONTROLLO DI `inglese-it-struttura-corso.md` — 2026-09-21

*Chiesto da chi guida il progetto: «facciamo un double-check se per te è tutto
corretto? se c'è qualcosa che reputi non corretto, segna qui in chat il punto e
cosa cambieresti». I punti sono numerati `STRUTTURA-CORSO_0xx` nel file.*

**Quello che TORNA, misurato e non letto:** uno script ha confrontato ogni
valore del JSON con il file nuovo — 15 nomi di moduli, 2 sequenze, 2 episodi
con la sequenza che chiedono, 2 lingue, 4 nomi dei gradi, 6 categorie:
**33 controlli, 32 verdi.** Le tabelle sono giuste.

**SEI PUNTI DA GUARDARE, in ordine di quanto pesano:**

| | Punto | Cosa non torna | Cosa cambierei |
|---|---|---|---|
| **①** | **_017**, **_035**, **_037** | *«i passi delle sequenze si modificano dal Pannello Admin»* — **vero come gesto, falso come risultato**: il pannello scrive negli **override in `localStorage`**, cioè in quel browser soltanto. La modifica **non arriva mai al JSON**, nessun altro la vede, e sparisce svuotando i dati del sito — *com'è successo il 2026-09-19*. E **_037 è falso oggi**: il pannello **non sa creare** una sequenza, lo dice la sua stessa descrizione | Due strade: **(a)** scrivere qui che oggi la modifica è **temporanea e locale**, e che per renderla vera va riportata nel JSON; **(b)** fare il passo **1.14** — il pannello che esporta la sequenza — e allora la frase diventa vera |
| **②** | **_010** | ⚠️ **«Perche' si dice cosi'» con gli apostrofi, ed è TESTO CHE LEGGE LO STUDENTE.** Nel JSON oggi è *«Perché si dice così»*. È l'**unico** sottotitolo con lettere accentate, quindi l'unico che se ne accorge | Rimettere gli accenti **in quella riga**. *Gli apostrofi nella prosa del file vanno benissimo — quella la leggiamo noi; la tabella dei sottotitoli no* |
| **③** | **_026**, **_027**, **_028** | La **categoria dell'episodio** (narrativo, grammaticale, pronuncia) **non esiste**: oggi `episodes.gate` porta solo `{ sequence }` | È un **campo nuovo** da aggiungere a `episodes.<id>.categoria`. Non è un errore del file: è lavoro che il file chiede |
| **④** | **_032** | Dice giusto **dove sta oggi** (`badge: 'Episodio 1'` in `app/catalogo.js`) — quindi **_031 è violato adesso**: lo studente legge esattamente «Episodio 1». ⚠️ **Ma «va nel file episodio» costa una cosa che non si vede:** la mappa disegna il badge **senza caricare il file episodio**, quindi il nome lì dentro la costringerebbe a un `fetch` che oggi non fa — e un caricamento fallito romperebbe la mappa | Metterlo in **`episodes.<id>.nome`** del file di struttura: **costa zero** (quel file arriva già prima di qualunque schermata) ed è già per edizione, quindi resta testo nella lingua dello studente |
| **⑤** | **_001** | Dice `data/inglese/it/inglese-it-struttura-corso.json` **senza prefisso**, mentre **_014** e **_040** lo mettono. È incoerente **oggi**, e coerente **dopo** la rinomina decisa | Niente da cambiare a mano: lo sistema il passo della nomenclatura |
| **⑥** | — | **Il file vecchio NON si può ancora togliere:** `tests/test_struttura_corso.js` legge `docs/inglese/it/inglese-it-struttura-corso.md` (`const DOC`). Cancellarlo adesso fa **rossa la suite** | La rinomina e l'aggiornamento del test vanno **nello stesso commit**, ed è il passo già deciso |

### ⚠️ IL TRIAGE DEI FUORI CATENA — chiesto il 2026-09-21

> *«inerente ai punti F… possiamo farli ora così ce li togliamo per sempre e non
> stiamo continuamente a ritrovarli? se sì, decidi quali fare e quali non si
> può, ma mettiamoli comunque in cronologia nel file decisioni sennò tornano
> sempre.»*

**La risposta non è «sì» né «no»: tre si possono fare adesso, due no, e le due
che non si possono NON sono rimandate per prudenza — sono rimandate perché
farle adesso significherebbe decidere senza il dato che serve.**

| | Si può adesso? | Perché |
|---|---|---|
| **F.1** taglio per silenzio | **SÌ** | La correzione è **una sola e già individuata** — riarmare il timer — e vive in `app/voice.js`. La sua condizione («al passo 26») diceva *non in mezzo allo spacchettamento*: lo spacchettamento è finito. ⚠️ **Ed è già protetta**: `test_comportamento_audio.js` [C] guida il taglio per silenzio e l'ha già visto fallire |
| **F.2** i 17 finti sintetizzatori | **SÌ, ma DA SOLA** | ⚠️ **Questo passo è fatto per diventare rosso, e il rosso è il guadagno** (regola 19): dare `speaking` vero e una fine asincrona ai 17 finti fa emergere difetti che oggi nessuno vede. Accorparla con qualunque altra cosa vorrebbe dire non sapere chi ha rotto cosa |
| **F.3** design mastery | **NO** | Per la sua **condizione scritta**: *«quando il report sarà visibile allo studente, e non prima»*. Oggi il report non lo vede nessuno, quindi scegliere fra «uniformare» e «spiegare» significa scegliere al buio. **Non è pigrizia: è che il dato manca** |
| **F.4** `bootAsUser`/`mockInit` | **SÌ** | Tocca **solo i test**, e ha una forma già collaudata in questo progetto: la stessa deduplicazione fatta per l'apertura dei moduli. Nessun rischio per l'app |
| **F.5** due funzioni senza chiamante | **DA DECIDERE, non da fare** | Non è un lavoro, è una scelta: **cancellarle** (il disegno resta in `decisioni-storico.md` e si riscrive quando nasce il Modulo Finale) oppure **dichiararle parcheggiate** con la condizione. *Finché restano lì senza etichetta, ogni giro le ritrova e ogni giro le rimanda* |

⚠️ **QUESTO TRIAGE È DEL 2026-09-21 E NON È UNA LISTA DI COSE DA FARE: è la
risposta di quel giorno alla domanda «si può adesso?».** *Aggiornamento del
2026-09-26, perché un triage letto come un elenco di lavori è un elenco di
lavori:* **F.1, F.2, F.4 e F.5 sono FATTE** (F.2 chiusa da F.4 senza un passo suo,
F.5 cancellando le due funzioni). **Resta F.3, e resta un «NO» per la stessa
ragione scritta qui: è una decisione di chi guida il progetto, non un lavoro.**

⚠️ **E LA COSA CHE IL TRIAGE HA TROVATO, che non era una delle F: F.6 NON HA
CHIUSO TUTTO.** Cercando dove vivessero le frasi false, ne restano **cinque**
nello stesso file che F.6 aveva corretto, e **tre righe sopra** quella corretta:

✅ **CHIUSE TUTTE E CINQUE, misurato il 2026-09-26 — e non correggendole una per
una: il file è stato RISCRITTO col riordino dei documenti del 23-24 settembre.**
*Nessuna delle quattro stringhe esiste più (`grep -c` su ciascuna: 0, 0, 0, 0), e
il file non nomina più `APP_CONFIG` da nessuna parte.* ⚠️ **E i numeri di riga di
questa tabella non puntano più a niente**: alla riga 3 c'è il titolo, alla 5 un
separatore, alla 13 il paragrafo sul parser. *Un riferimento per numero di riga
invecchia al primo riordino, e invecchia in silenzio: la tabella continua a
leggersi bene.* **La tabella resta come fotografia di cosa c'era**, con questa
riga sopra che dice che non c'è più.

| File | Riga | Cosa dice | Perché è falsa |
|---|---|---|---|
| `struttura-corso.md` | 3 | *«Da qui vengono aggiornate le voci di `APP_CONFIG`»* | dal 2026-09-20 la fonte da aggiornare è `data/inglese/it/inglese-it-struttura-corso.json` |
| `struttura-corso.md` | 13 | *«Ogni sezione corrisponde a una voce di `APP_CONFIG`»* | idem |
| `struttura-corso.md` | 5 | *«il contenuto di un episodio sta in `docs/episodio-N.md`»* | è la nomenclatura che la **regola 4 vieta**, tolta al passo 6: oggi è `docs/inglese/it/inglese-it-gate.md` |
| `struttura-corso.md` | 55–57 | *«L'ordine è uno solo per tutto il corso… un episodio può sovrascriverlo, ma è l'eccezione»* | oggi **ogni** episodio dichiara la propria `sequence`, **sempre**, e non esiste nessun default implicito |
| `sequenza-episodi.md` | 9–12 | *«Non esiste un `sequenza-episodi.json`, ed è una scelta: l'elenco serve **durante** l'avvio, prima che qualunque file sia scaricato»* | dal passo 1.11b `struttura-corso.json` arriva **prima di qualunque schermata**, e **porta già `episodes`**. La ragione per cui il file non esisteva non c'è più |

*È la forma della **regola 41**: F.6 ha corretto la frase dov'è andata a
cercarla — in fondo al file — e ha lasciato la stessa frase in testa. Una
verifica per sottrazione fatta su un punto invece che su tutte le forme.*

✅ **F.6-bis CHIUSA il 2026-09-21**, autorizzata in chat: le cinque frasi sono
corrette, e `struttura-corso.md` ha adesso anche le **quattro sezioni che gli
mancavano** — sequenze, episodi, lingue del parlato, nomi dei moduli. *Sette
chiavi nel JSON, sette sezioni che le scrivono.* Verificato per copertura: **33
controlli fra markdown e JSON, 33 verdi.**

⚠️ **E UNA COSA CHE LA CORREZIONE HA FATTO VEDERE, da tenere per il passo 1.13:**
`sequenza-episodi.md` esiste dal 2026-09-09 e porta già l'ordine — A1.1 con cinque
episodi (`benvenuto`, `numeri`, `verb-to-be`, `gate`, `aircraft-door`) e i loro
raggruppamenti. **Quindi 1.13 non parte da zero: parte da quel file**, e la frase
che diceva «un JSON non serve» è proprio quella che il passo 1.11b aveva reso
falsa. *La domanda aperta non è più «un file sì o no»: è **«l'ordine degli episodi
è un dato, o resta l'ordine in cui le chiavi sono scritte?»***

### ⚠️ QUANDO NASCERÀ IL PANNELLO ADMIN VERO, `config` VA CHIUSO A TUTTI — 2026-09-21

**Detto da chi guida il progetto**, e registrato qui perché è una decisione che
cambia due cose già costruite:

> *«Quando ci sarà il pannello admin, sarà da togliere la possibilità di
> scrivere `config` da parte di nessuno, specialmente dell'utilizzatore.
> Quindi, a quel momento, sarà da verificare se sospendere la funzione del
> nuovo tasto visibile.»*

**Le due cose che ne dipendono, e vanno guardate INSIEME quel giorno:**

1. **le due porte del pannello** — la sequenza `config` da tastiera e `?config`
   nell'indirizzo: oggi le può aprire chiunque abbia l'app;
2. **la terza uscita sulla schermata d'errore** («Ripristina i valori di
   partenza», nata il 2026-09-21): ⚠️ **serve a disfare un danno che solo il
   pannello sa fare.** Chiuso il pannello allo studente, quel pulsante non ha
   più una causa da riparare — e un pulsante che cancella dati senza una causa
   è esattamente il *«pulsante che non può aiutare»* che la sua stessa guardia
   evita oggi (compare **solo** se ci sono override salvati).

*Quindi non sono due decisioni: è una sola. Chiudere le porte senza guardare il
pulsante lascerebbe in piedi l'uscita di emergenza di una stanza murata.*

**Condizione:** al pannello Admin vero, tappa ③ (messa in sicurezza).

### La misura delle CPU della CI — chiusa il 2026-09-21

Il `2` inciso nello script è diventato `nproc`, con tetto a 8. **Il runner di
`ubuntu-latest` ha QUATTRO CPU** — misurate, non dedotte: il log della corsa
stampa `--- 76 file, 4 in parallelo (CPU misurate: 4) ---`.

| | prima (N=2) | adesso (N=4) |
|---|---|---|
| corsa intera | ~600 s | **369 s** |
| solo il passo «Lancia la suite» | — | **319 s** |

**Deciso: si resta a 4, non si prova 8.** Il runner *ha* 4 CPU: chiederne 8 non
aggiunge macchina, aggiunge contesa — e i timeout scatterebbero per contesa
invece che per difetto, cioè un rosso che non sa spiegarsi. *Il tetto a 8 nello
script serve alla macchina di domani, non a forzare quella di oggi.*

**Fuori catena, da chiudere in questa tappa o dichiarare rimandati:**

- ~~le quattro chiavi globali~~ — **deciso il 2026-09-20**, e sono **cinque**,
  non quattro: vedi i passi **1.11–1.14** qui sopra e il blocco qui sotto.

### ⚠️ LA STRUTTURA DEL CORSO È TUTTA PER EDIZIONE — deciso il 2026-09-20

**Una regola sola, nessuna eccezione: un'edizione è un abbinamento
`{lingua-che-si-impara}/{lingua-studente}`, e TUTTO ciò che riguarda la
struttura di quel corso vive nell'edizione.**

⚠️ **Questa decisione ne CORREGGE una scritta poche ore prima nello stesso
file**, e vale la pena dire perché, perché l'argomento scartato è ragionevole e
tornerà. Avevo proposto un taglio: fuori solo ciò che è *testo*, dentro ciò che
è *struttura* — con la misura che `gradeNames` per `francese/it` sarebbe
identico a quello di `inglese/it` («Parole, Espressioni, Frasi, Dialogo» sono
italiano, e valgono per il francese). **La misura era giusta e la conclusione
no.** I nomi dei gradi non sono una traduzione: sono una **decisione didattica
di quel corso**. Tenerli condivisi vuol dire che una scelta presa per l'inglese
governa il francese in silenzio — che è esattamente ciò che la regola 4 vieta
quando dice che una correzione fatta in `it/` **non deve** arrivare nelle altre
edizioni. *Ottimizzare «non duplicare quattro parole» costava la regola unica;
duplicare quattro parole non costa niente.*

**Il file: `data/{lingua}/{studente}/struttura-corso.json`**, uscita diretta e
1:1 di `docs/{lingua}/{studente}/struttura-corso.md` (regola 26) — che è già per
edizione. Oggi quel markdown per-edizione scarica il suo risultato in valori
globali: **era quello il disallineamento.**

| Va nell'edizione | Perché |
|---|---|
| `episodes` | quali episodi ha QUESTO corso, in che ordine, e quale sequenza usa ciascuno |
| `sequences` | quante ne vuole chi guida il progetto, con i nomi che vuole |
| `grades` | le lettere dei gradi di questo corso |
| `gradeNames` | i nomi che lo studente legge |
| `moduleTypes` (le `label`) | le categorie che lo studente legge |
| `speech.recognitionLang` / `synthesisLang` | ⚠️ **trovate misurando, non erano nell'elenco**: oggi valgono `en-US`, e un corso di francese vuole `fr-FR` |

| Resta in `APP_CONFIG` | Perché |
|---|---|
| soglie, tempi, suoni, limiti, temi, coda dei ripassi | sono le **manopole dell'app**, non del corso: non cambiano cambiando lingua |

**⚠️ E LA DIREZIONE È L'OPPOSTA DI COME SI RACCONTA FACILMENTE: non è la
sequenza che dichiara i suoi episodi.** È l'**episodio** che dichiara la sua
sequenza, per nome — `CONFIG.episodes.gate = { sequence: 'narrativo-standard' }`,
letto da `resolveModuleOrder` (`app/catalogo.js:269`). Una sequenza non sa
niente degli episodi che la usano, e due episodi possono chiedere la stessa.
**Nel file di edizione il posto che dice «quali episodi ci sono» esisterà
davvero** — ed è l'edizione, non la sequenza.

**⚠️ E DUE LUCCHETTI DIVERSI, CON NOMI CHE SI SOMIGLIANO:**

- i **lucchetti della mappa** — `moduleStatus` (`app/mappa.js:818`): un passo è
  `locked` finché tutti quelli prima non sono completati, con l'icona `lock`.
  **Questi vengono dalla sequenza**, e l'occhio del Pannello Admin li sposta
  spegnendo un passo (`off: true`);
- lo **«Sblocco Sequenziale»** (regola 30) — `dgApplySequenceLock` e
  `storyCardsRefreshExplanationStates`: sta **dentro** due moduli (le bolle di
  Ripeti a Tempo, le card di Why We Say It). Stessa idea, **niente a che vedere**
  con la sequenza dei moduli.

**Cosa resta aperto di questa decisione:** il passo 1.11 la esegue, e va
dichiarato prima di essere costruito (regola 31) — è un file di dati nuovo e un
cammino di caricamento nuovo, non uno spostamento.

## ② IL COLLAUDO — il passo 26

**Uno solo, e va fatto quando la tappa ① è chiusa, non prima.**

L'app dall'inizio alla fine, su profilo nuovo, su Pages. ⚠️ **Gli otto punti di
`docs/archivio/collaudo-sei-moduli.md` ne sono una METÀ:** coprono i sei moduli, non gli
strati — e gli strati sono quello che si è mosso.

*Perché qui e non prima: in due giorni l'app ha cambiato forma tre volte e ha
avuto **cinque guasti muti** — quattro trovati guidandola, uno per caso. Un
collaudo fatto a metà pulizia si rifà.*

## ③ LA MESSA IN SICUREZZA — Supabase, repo privato, Cloudflare

⚠️ **Oggi il repository è PUBBLICO e il sito è servito in chiaro: chiunque
scarica tutto** — codice, episodi, traduzioni, risposte dei quiz. Non è una
falla da trovare, è lo stato dichiarato.

| | Passo | Nota |
|---|---|---|
| **3.1** | **La prova della CI a 4 CPU** | Se il runner ne ha quattro, la suite costa la metà. È una misura, non una speranza |
| **3.2** | **Supabase + repository privato, INSIEME** | ⚠️ **Sono due minacce diverse e il repo privato NON tocca la seconda:** il sito resta pubblico e i suoi file si scaricano lo stesso |
| **3.3** | **I progressi vanno sul server** | Oggi vivono **solo** nel `localStorage`: cambiare telefono li cancella. Nessun attacco serve |
| **3.4** | **La correzione delle risposte** | Oggi il browser riceve domanda e risposta giusta insieme. Tre strade nello storico; la riga *«le regole stanno sul server»* esclude quella «tutto nel browser» |
| **3.5** | **Il pannello Admin dietro login, e `config` che sparisce** | Finché il pannello è locale non è un buco; quando scriverà sul server lo diventa |
| **3.6** | **Le due analisi + i loro test** | Penetrazione e scaricamento abusivo: stanno in [`cyber-security.md`](cyber-security.md), con la cadenza da decidere quando i test esistono |
| **3.7** | **I backup** | Contro un furto **e** contro un guasto, e il secondo è più probabile |
| **3.8** | **Cloudflare** | L'uscita online |
| **3.9** | **Il passo di pubblicazione che toglie i commenti** | Minificazione. ⚠️ **Il prezzo va detto: il file servito non è più quello in git** |
| **3.10** | **Il caso di studio `guida.omney.io`** | Lì scaricare i dati è risultato quasi impossibile: va capito come |

### ⚠️ IL PANNELLO ADMIN — l'elenco di cosa dovrà avere

**Questo posto non esisteva e nasce il 2026-09-20**, perché le cose del
pannello stavano già in due punti diversi e sarebbero diventate tre. Si
chiudono tutte al passo **3.5**, quando il pannello viene rifatto dietro il
login: prima di allora è un embrione locale, e metterci dentro un lavoro
serio significherebbe farlo due volte.

| | Cosa | Perché |
|---|---|---|
| **A** | **I due campi dell'edizione bloccati** | `edizione.lingua` e `edizione.studente` oggi si modificano come qualunque altro campo, e toccarli per sbaglio punta l'app a una cartella che non esiste: schermata d'errore finché non si riapre il pannello e si ripristina. Non modificabili con un click solo |
| **B** | **La vista di TUTTE le sequenze in un posto solo** | ⚠️ **Oggi non esiste, ed è una mancanza vera:** il pannello mostra **una** sequenza — quella dell'episodio che si sta guardando (`sequenzaInModifica`) — quindi per sapere quale episodio usa quale bisogna cambiare episodio e riaprire il pannello, uno per uno. Serve l'elenco delle sequenze con, accanto a ognuna, **gli episodi che la chiedono**, e la possibilità di modificarle da lì. *Diventa più utile, non meno, quando le sequenze saranno per edizione (passo 1.11): l'elenco è per edizione, e la domanda «questo episodio segue la sequenza standard o una sua?» si risponde con un'occhiata invece che con cinque click* |


## ④ DOPO — costruire, non più riordinare

| | |
|---|---|
| **4.1** | **I moduli nuovi**: Scrittura e il Test di verifica finale (previsti, mai costruiti) |
| **4.2** | **Il Modulo Finale**, che usa `episodeFinalOutcomeCase` |
| **4.3** | **I report** e le tabelle di interscambio fra episodi (la regola 40/30/20/10) |
| **4.4** | **Il contratto del modulo** — deciso: *«lo metterei quando è tutto fatto»* |
| **4.5** | **ElevenLabs**: si registra una volta, si paga una volta, l'app pesca. ⚠️ **Non aspetta Supabase** — la chiave sta fuori dall'app, in `tools/` |
| **4.6** | **La modalità offline**, dopo l'analisi di Babbel e Duolingo |
| **4.7** | **Il modello delle edizioni** e la lingua di sistema nelle prime schermate |
| **4.8** | **Le app per gli store** |
| **4.9** | **LLMOps** |

---

# LE COSE PICCOLE, REGISTRATE E APERTE

**Non stanno nelle quattro tappe perché non decidono un ordine: si chiudono
quando si passa di lì.** ⚠️ **Ma sono APERTE, e `correzioni.md` ci punta**:
dozzine di righe dicono *«registrato in `decisioni-stato.md` con la sua
condizione»*, e quelle condizioni sono queste. Il dettaglio di ognuna è nello
storico, nelle quattro sezioni che portano lo stesso nome.

| Famiglia | Dove sta il dettaglio | Cosa contiene |
|---|---|---|
| **Deroghe dichiarate senza niente che le faccia scadere** | storico, sezione omonima | Otto limiti di test dichiarati e mai riesaminati: nomi generici in `APP_CONFIG`, il testo dell'episodio 2 non confrontato con la sua fonte, i valori di default delle due soglie, il passo corrente di Sblocco Sequenziale, ecc. |
| **Pulizie rimandate di proposito** | storico, sezione omonima | ⚠️ Fra queste **una SECONDA implementazione del riconoscimento vocale**, indipendente da quella viva; i testi dell'avviso microfono scritti nel codice; `actions/checkout@v4` e `setup-node@v4` da alzare a `@v5`; la divergenza off/seen in `tests/module-order.js` |
| **Dati che l'app produce e nessuno può leggere** | storico, sezione omonima | Le risposte di Why We Say It si salvano per singola skill e nessuna schermata le mostra; i tre Dialogue non registrano niente per battuta |
| **CI rosse che non dicono cosa fare** | storico, sezione omonima | Valori ricopiati invece che letti dalla fonte |
| **Il volume di default di `sfxPlayTone`** | storico, `## DA FARE` | Deve uscire dal codice ed entrare in `APP_CONFIG` (regola 3) |
| **`test_batch19.js`** | storico, `## ⚠️ APERTO` | La causa si stava stringendo l'11→15 settembre e non è stata chiusa |
| **Le due voci del passo 13 che restano** | storico, «Le cinque voci della 2-bis» | ⑤ **il report per grado** — *«è prodotto, non strumento»*, quindi va con i prodotti della tappa ④, non qui. **D3** — sospesa, torna **quando esisterà un colore sopra i compartimenti**. *Le altre tre voci sono chiuse: ① e ② e ③ eseguite il 2026-09-10, ④ chiusa il 2026-09-20 scrivendo la nota accanto a `recordPendingMastery`.* |
| **Le cose del Pannello Admin** | tappa ③, sotto la tabella | I due campi dell'edizione da bloccare e la vista di tutte le sequenze. **Stanno lì e non qui** perché si chiudono tutte insieme al passo 3.5, quando il pannello viene rifatto |

⚠️ **E una cosa che NON è piccola e sta qui solo perché è già registrata:
`srPulizia` ha mostrato che il magazzino di `stopAllModuleActivity` non ha più
un contenuto fisso — ha quello dei file caricati.** Oggi non cambia niente
perché i 23 tag si caricano tutti al boot. **Dal giorno in cui un modulo si
caricherà su richiesta, una pulizia non registrata è una pulizia che non gira.**
Condizione: quando nasce il caricamento a richiesta.

---

# ✅ `nuovi/` — LA CARTELLA DI APPOGGIO — decisa e fatta il 2026-09-22

**Chiesto:** *«Voglio mettere i file nuovi in un posto solo per farteli leggere.
Non cancelliamo gli altri finché non siamo sicuri che vadano bene.»*

**Fatto:** cartella `nuovi/` alla radice, con il suo `LEGGIMI.md` che spiega da
solo cosa è e cosa non si fa (una sessione futura trova la cartella, non questa
riga). `.github/workflows/regressione.yml` ha `paths-ignore: ['nuovi/**']`.

**Le tre misure che hanno deciso, e nessuna è un'opinione:**

| Domanda | Misura, 2026-09-22 |
|---|---|
| Perché non sotto `docs/` | `test_nomenclatura_edizione.js` scandisce `data/` e `docs/` e pretende **esattamente quattro pezzi** di percorso. `docs/nuovi/x.md` **non lo vede** (scende di due livelli e lì trova un file); `docs/inglese/it-nuovo/x.md` è **rosso**. *La prima non è una buona notizia: è una cartella che un test guarda **quasi**.* |
| Perché alla radice si può | **Nessun test scandisce altre radici**: i `readdirSync` della suite guardano solo `app/` e `tests/`. La cartella è invisibile alla suite **per costruzione**, non per una configurazione da ricordarsi. |
| Perché il `paths-ignore` non marcisce | Un filtro che esclude una cartella **letta da qualcuno** è una misura che non misura (regola 37). Questa non la legge né l'app né un test — **il giorno in cui qualcuno la leggesse, i file non sarebbero più lì**. È l'unico caso in cui quel filtro è sicuro per definizione, e per questo non se ne aggiungono altri. |

⚠️ **E il guardiano della versione non ci inciampa:** `tests/tools/versione-salita.js`
guarda solo `index.html`, `app/*.js` e `stile/*.css`. Un push di soli file
d'appoggio non chiede di alzare la versione, e **non la salta nemmeno al push
successivo** — il `github.event.before` di quello punterebbe a un commit che
codice non ne ha cambiato.

**I nomi dentro `nuovi/` possono essere versionati**, su richiesta di chi carica
(*«sennò non ci capisco più nulla»*): nessun test li guarda, quindi la regola 4
lì non si applica — e **non vanno «sistemati» da una sessione futura che li
trova.** La convenzione torna a valere nell'istante della promozione.

---

# ⚠️ I SEI FILE DI CONTENUTO: COSA E' FALSO OGGI — misurato il 2026-09-20

**Misurato su richiesta, e NON corretto di proposito** (regola 33: quei file
sono di chi guida il progetto). Sta qui perche' altrimenti vive solo in chat, e
la chat non sopravvive al container.

⚠️ **Il grosso viene TUTTO dalla stessa data: i cinque file non toccati dopo il
2026-09-09.** Non sono sviste sparse — sono **una fotografia del repository di
quel giorno**, scattata prima dei passi 6 (le cartelle e i nomi), 19 (le tabelle
in un file) e 1.11 (la struttura per edizione).

| File | Ultimo commit | Cosa dice di falso |
|---|---|---|
| `struttura-corso.md` | 2026-09-20 | `docs/it/` in due punti; «il contenuto di un episodio sta in `docs/episodio-N.md`» |
| `sequenza-episodi.md` | 2026-09-09 | numera `gate`=3 e `aircraft-door`=4, l'app li mostra come «Episodio 1» e «Episodio 2» |
| `obiettivi-a1.md` | 2026-09-09 | `docs/it/`; dice `aircraft-door` «deciso non scritto» — e' scritto, trascritto e vivo |
| `inventario-grammaticale.md` | 2026-09-09 | `docs/it/` in quattro punti |
| `tabelle-personalizzazione.md` | 2026-09-15 | si dichiara «non ancora trascrivibile», ed e' trascritto dal 15 (col contenuto vecchio, come deciso) |
| `inglese-it-gate.md` | 2026-09-09 | «id oggi `episode1`», «diventera' `gate`», il percorso e il nome del JSON, «le tabelle non esistono ancora» (due volte) |
| `inglese-it-aircraft-door.md` | 2026-09-09 | «id non ancora assegnato», «`episodeId: "episode2"`» |

**Cosa e' vero oggi, in una riga:** gli id sono `gate` e `aircraft-door` (nel
codice **e** dentro i JSON), i file dati stanno in
`data/inglese/it/inglese-it-{id}.json`, le tabelle esistono in
`data/inglese/it/inglese-it-tabelle-personalizzazione.json`, la sola sequenza e'
`narrativo-standard` con 22 passi, e i numeri attesi dei due episodi **tornano
tutti**.

### Le tre cose trovate che non erano state chieste

- ⚠️ **`level: "A1"` e `episodeTitle` nei due JSON non li legge NESSUNO**
  (misurato: zero lettori in `app/`). E `level` contraddice la regola 4 —
  *«il livello non e' una proprieta' dell'episodio»*. Condizione: si decide col
  passo che tocca i file episodio.
- ⚠️ **Il JSON delle tabelle porta colonne `fr`, `es`, `de` VUOTE**, cioe' la
  forma «una riga, cinque lingue». Contraddice la decisione del 2026-09-20 —
  un'edizione non e' una traduzione — e va sciolta **prima** che nasca
  `francese/it`, altrimenti i nomi francesi finiscono in due posti.
- **I due JSON episodio non hanno le stesse chiavi:** `gate` porta
  `generalRule` e `ageOptions`, `aircraft-door` no. Puo' essere giusto (uno ha
  le eta', l'altro no), ma nessuno l'ha dichiarato.

# ⚠️ QUATTORDICI COSE MISURATE SUI FILE DI CONTENUTO — 2026-09-23

**Misurate su richiesta, a codice fermo, confrontando gli otto file caricati in
`nuovi/` con il codice e con i JSON.** Sta qui e non in chat perche' **la chat
non sopravvive al container** (regola 43). Le correzioni ai file di contenuto
**non sono state fatte**: sono di chi guida il progetto (regola 33), e le cinque
frasi sono state consegnate come proposta.

## Le tre frasi FALSE che vivono nei file di contenuto

| | Dove | Cosa dice | Cosa e' vero, e chi lo prova | Condizione |
|---|---|---|---|---|
| ① | **GATE_038**, **AIRCRAFT-DOOR_036**, **REGISTRO-EPISODI_004 riga 9** | *«Claude Code trascrive `dialogueSpeakerLabels`»* | **Quel nome non esiste da nessuna parte.** La chiave e' `speakerLabels` — `app/apertura.js:100`, `app/ui-condivisa.js:918`. L'unica occorrenza in tutto il repository e' un commento in `tests/test_story_modules.js:532` che dice che e' **uscito il 2026-09-09** | quando arrivano i file corretti |
| ② | **STRUTTURA-CORSO_002** | *«Il JSON ha sette chiavi»* | **Ne ha UNDICI**, contate il 2026-09-26 con `python3 -c "import json;print(len(json.load(open(...))))"`. ⚠️ **E questa casella diceva «dodici», cioè era falsa anche lei** — *una riga scritta per segnalare un numero sbagliato ne portava uno sbagliato: il numero non si cita, si rimisura (regola 38).* Le **tre** non descritte da nessuna sezione del markdown sono `episodeSequence`, `episodioCorrente` — entrate col passo 1.13 — e **`episodiSpenti`**, entrata il 2026-09-26. *`episodeSequences` invece È descritta: la sezione 7 dice «`episodes` e l'ordine di `episodeSequences`», e questa casella la elencava fra le non descritte.* Le sezioni sono sette (1–5, 7, 8), di cui cinque parsate dal test | idem |
| ③ | **STRUTTURA-CORSO_014** | *«sequenza degli episodi → dove vive → `inglese-it-sequenza-episodi.md`»* | **Vive in `inglese-it-struttura-corso.json`**, chiavi `episodeSequences`/`episodeSequence`, letta da `resolveEpisodeOrder()` (`app/catalogo.js`). E il markdown-fonte con cui il test la confronta e' la **tabella della sezione 7 di `inglese-it-struttura-corso.md`** | idem |

## Le due frasi FALSE su cosa fa il codice

| | Dove | Cosa dice | Cosa fa davvero |
|---|---|---|---|
| ④ | **TABELLE_025** | *«colonne `fr` `es` `de` vuote»* | **Non esistono piu'** (49 righe su 49). **Ne segue che la voce ⑦ della sezione 9 e' gia' fatta** |
| ⑤ | **TABELLE_025 ④** | *«senza la migrazione, chi ha personalizzato torna ai valori predefiniti in silenzio»* | ⚠️ **No: ripiega sulla PRIMA RIGA della tabella.** `loadCustomValues` (`app/progressi.js:267`) **tiene** un valore salvato che non esiste piu' fra le opzioni; `resolveSlotValue` (`app/ui-condivisa.js:560`) fa `var picked = match \|\| opts[0]`. Per sette slot su nove la prima riga coincide col predefinito e non si vedrebbe. **Per i due delle eta' no:** `figliaEta` predefinito `16` → si vedrebbe **`12`**; `figlioEta` predefinito `8` → si vedrebbe **`4`**. *Da guardare il giorno della migrazione degli id, non prima* |

## I cinque DATI che vivono solo nel JSON, senza nessuna fonte markdown

**Sono il rovescio della regola 26: non un markdown che descrive male il JSON,
ma contenuto che nel markdown non c'e' proprio.**

✅ **TUTTI E CINQUE CHIUSI IL 2026-09-23:** i quattro col segno di spunta hanno
la loro sezione nei file DATI trascritti; il quinto (i 22 passi) era gia' stato
chiuso il giorno prima. *Il file DATI vuoto creato il
2026-09-23 ha una sezione per ognuno.*

| | Cosa | Dove vive oggi | Chi lo legge |
|---|---|---|---|
| ⑥ ✅ | **`generalRule`** — *«La "e" finale in inglese non si legge quasi mai.»* | `inglese-it-gate.json` | Repeat Aloud (`app/repeataloud.js:95`). Facoltativa: `aircraft-door` non ce l'ha |
| ⑦ ✅ | **le `label` degli slot** — *«Nome del papa' / utente»* | `personalizationTablesUsed[].label` nei due file episodio | la schermata Personalizza |
| ⑧ ✅ | **`ageOptions`** — le eta' `12–17` e `4–11` | `inglese-it-gate.json` | raggiunta solo perche' uno slot dice `episode.ageOptions.figlia` |
| ⑨ ✅ | **i `default` degli slot** | `personalizationTablesUsed[].default` | il markdown li segna `(pred.)` **accanto a un id della tabella** — ma il predefinito e' una proprieta' dello SLOT, non della tabella: due episodi possono pescare dalla stessa tabella con predefiniti diversi |
| ⑩ | **i 22 passi di `narrativo-standard`** | `sequences` in `struttura-corso.json` | ✅ **CHIUSA IL 2026-09-23: nasce la sezione 5 del file DATI.** Era l'unica di questa famiglia scelta apposta (STRUTTURA-CORSO_017: *«si modificano li'»*) — vedi la riga qui sotto per cosa ha fatto cambiare idea |

## Le quattro cose trovate e non chieste

| | Cosa | Misura | Condizione |
|---|---|---|---|
| ⑪ | **Il `_nota` dentro `inglese-it-tabelle-personalizzazione.json` dichiara «le due differenze» col markdown, e ce ne sono almeno sei** | `places.departures` **3** contro **8** · `people.papa` **8** contro **10** · `people.figlio` **8** contro **11** · `people.cognome` **8** contro **9** · **il default di `cognome`**: `rossi` nel JSON, `cognome-costa` nel markdown · e dice *«il magazzino ne ha UNDICI [destinazioni]»* mentre il markdown nuovo ne ha **tre** | col passo delle tabelle |
| ⑫ | **Tre chiavi di un file episodio che nessuno legge** | `episodeTitle` (**doppione** di `episodes.<id>.nome`), `language`, `level`. Piu' `difficulty` dentro ogni skill | quando si riscrive un file episodio |
| ⑬ | **Due campi che la regola 4 chiede e che nessuno legge**: `grammarCategory` (gradi A e B) e `fromLine` (grado C) | zero letture in `app/`. *Non e' un difetto: e' una decisione sulla regola 4, e la prende chi guida il progetto* | alla prossima revisione della regola 4 |
| ⑭ | **`GATE_040` e `TABELLE_024` mandano a `rinomine` 004 per un DATO, e quel file non e' nel repository** | ⚠️ **La regola 28 distingue:** *«APPLINGUE-metodo-didattico»* e *«regola master»* sono **rimandi al metodo** e sono ammessi — si perde il perche', non il come. **`rinomine` no**: ci si va per sapere QUALI chiavi rinominare, cioe' per un dato, e senza quel file il lavoro non si puo' fare | quando si scrive il passo delle rinomine |

## E una duplicazione, che non e' una di queste quattordici

⚠️ **Due markdown dichiarano l'ordine degli episodi:** la sezione 7 di
`inglese-it-struttura-corso.md` (che `tests/test_struttura_corso.js` confronta
col JSON) e le sezioni 3–4 di `inglese-it-sequenza-episodi.md` (che non legge
nessuno). *Due elenchi sulla stessa cosa divergono al primo riordino — che e'
testualmente l'argomento di STRUTTURA-CORSO_017 contro il duplicare i passi.*
**Condizione: la decide la strada DATI/RAGIONI** (la domanda 4 e' sospesa in
attesa di quella).

---

## ⚠️ LA 017 E' CAMBIATA, E LA MISURA CHE L'HA CAMBIATA — 2026-09-23

**STRUTTURA-CORSO_017 diceva: «i passi delle sequenze stanno solo nel JSON e si
modificano LI'».** Dal 2026-09-23 non piu': nasce `## 5 — LE SEQUENZE DEI
MODULI` nel file DATI, e i 22 passi hanno una fonte markdown come ogni altro
dato dell'edizione.

**Sta scritto qui, e non solo nel file, perche' senza fra un mese sembra che ci
siamo dimenticati della 017.**

**La 017 aveva DUE ragioni. Una regge, l'altra e' caduta misurandola:**

| La ragione | Oggi |
|---|---|
| *«due elenchi sugli stessi passi divergono al primo riordino»* | **regge** — ed e' il motivo per cui questa sezione ha bisogno di un'asserzione, non di una promessa (vedi la condizione qui sotto) |
| *«il Pannello Admin ci scrive dentro»* | ⚠️ **CADUTA.** Misurato il 2026-09-22: il pannello scrive in `localStorage`, chiave `baseinglese:configOverrides` (`app/avvio.js:46`) — **quel browser soltanto**. Non arriva mai al JSON, non lo vede nessun altro, sparisce svuotando i dati del sito |

**Ne segue il fatto che ha deciso: l'unico scrittore di quel JSON e' Claude
Code, come per ogni altro dato — e i 22 passi restavano l'ULTIMO dato senza
fonte markdown.** *Riordinarli voleva dire far modificare il JSON a mano:
l'unico posto del progetto dove una decisione si prendeva senza passare da un
documento.*

⚠️ **LA 017 NON ERA SBAGLIATA: era vera finche' la sua seconda ragione lo era.**
*E' la forma della famiglia ⓪-quinquies — una frase giusta smette di essere vera
quando cambia il mondo intorno, non il ragionamento che l'ha scritta.*

⚠️ **CONDIZIONE APERTA: oggi NESSUN TEST legge quella sezione.** Finche' non ce
n'e' uno, markdown e JSON possono divergere in silenzio — che e' esattamente il
buco che il blocco `[Ordine]` ha chiuso per gli episodi. **Una fonte senza
asserzione e' una fonte decorativa.** Condizione: il primo passo di codice utile.

⚠️ **E il pezzo c'e' gia' a meta': `tests/test_struttura_corso.js` DEFINISCE
`idModulo()` e `grado()` — e non li chiama nessuno.** Trovato il 2026-09-23
cercando cosa servirebbe: sono due funzioni morte, e sono esattamente le due che
servono per leggere una tabella di passi. *Il residuo di un lettore della
sezione 6 che non e' mai stato scritto, o che e' stato tolto.*

---

## ⚠️ UN MODELLO CHE NON E' STATO PASSATO DAL PARSER E' UN MODELLO CHE SEMBRA GIUSTO — 2026-09-23

**Da tenere oltre questo passo.** Scrivendo i tre file DATI vuoti il parser e'
stato letto riga per riga **prima** di scriverli, e due trappole sono passate
lo stesso. Le ha trovate **passare i modelli attraverso il parser vero**,
riscritto e fatto girare sul file appena scritto:

| La trappola | Cosa sarebbe successo |
|---|---|
| Nel modello dell'episodio, la stringa marcatore citata **anche nella spiegazione** | `indexOf` prende la **prima** occorrenza → il parser leggeva la tabella della spiegazione, e i sei numeri uscivano come `N` **senza che niente si lamentasse** |
| Nel modello della struttura, i cinque titoli scritti per intero in una tabella di spiegazione | il parser leggeva **quella tabella** come tabella dei gradi |

**E' la stessa cosa della falsificazione** (regola 32): vedere un test fallire
apposta prova che sa morire; passare un modello dal parser prova che sa essere
letto. **Nessuna delle due si ottiene rileggendo.**

*Nei due modelli la difesa adesso e' un comando, non una raccomandazione:
`grep -c` sulla stringa marcatore e sui cinque titoli deve dare **1**.*

---

# ⚠️ GLI ID DELLE VOCI SONO DIVENTATI POSIZIONALI, E LA COLPA E' DEL MIO MODELLO — aperto il 2026-09-23

> **`a-hello` → `a-1` · `b-i-am` → `b-1`**

**Nessuno l'ha chiesto.** La riga di esempio del modello `-VUOTO` che ho scritto
il 2026-09-23 diceva `| `a-1` | parola | … |`, e il file pieno ha seguito il
modello. **L'ho introdotto io, in un file di contenuto, senza dirlo.**

**Perche' e' un problema, e non e' un'opinione — e' la stessa cosa che la regola
4 dice degli episodi:**

> *«Il livello NON sta nel nome… L'id invece non cambia mai: `gate`,
> `aircraft-door` — descrittivo, in inglese, congelato. Metterlo nel nome, o in
> una cartella, congelerebbe una posizione — lo stesso errore di `episode1`.»*

**E la misura che lo rende concreto: `app/sessione.js:253`**

```js
var unitId = params.unitPrefix + ':' + params.item.id + ':' + params.direction;
```

**L'id della voce E' la chiave della mastery.** Ne discendono due cose, e la
seconda e' peggio della prima:

| | Cosa succede |
|---|---|
| **oggi** | ogni voce salvata dei gradi A e B resta orfana. *Accettabile: siamo in costruzione, e lo ha detto chi guida il progetto* |
| **domani** | ⚠️ **inserire una parola in mezzo al grado A rinumera tutte quelle dopo** — e `match:a-5:en-it`, che era «where», diventa la parola nuova. **Nessun errore, nessun rosso: il colore di una voce passa a un'altra voce.** E' la famiglia della misura che non misura |

**I gradi C e D non c'entrano:** li' `c-1`, `d-1` sono gia' posizionali oggi, e
per una battuta la posizione **e'** la sua identita'.

✅ **CHIUSA IL 2026-09-24: gli id sono tornati descrittivi.** *«`a-1` non e' un
id, e' una posizione — e la regola 4 lo dice gia' per gli episodi. La B e' una
frase, e oggi per la terza volta abbiamo visto che le frasi cedono.»* Gli id
sono stati **ripresi dal JSON di `main`**, non riscritti a memoria, e verificati
uno per uno: **8 liste su 8 combaciano, zero id cambiati**. Corretto anche il
modello `-VUOTO`, che era la fonte dell'errore: la riga di esempio adesso dice
`a-parola`, con accanto il perche'.

*Condizione originale (per memoria): la decisione era di chi guida il progetto, ed erano due righe di
markdown* — la colonna `id` dei gradi A e B dei due episodi. *Il JSON e' gia'
scritto con gli id posizionali: se si torna ai descrittivi, e' una rigenerazione
e una suite, non un lavoro.*

---

# ⚠️ IL DIFETTO CHE VIVE DENTRO UN'OPZIONE CHE NESSUNO PROVA — aperto il 2026-09-23

**Il caso che l'ha scritto:** `places.departures` doveva guadagnare
`orig-lugano` e `orig-nizza`, e la battuta `d-4` di `gate` scrive **`Italy` a
mano**. Due opzioni su otto avrebbero prodotto **«I am from Lugano, Italy»**.

> ⚠️ **E nessun test sceglie Lugano, quindi la suite sarebbe rimasta VERDE.**

**Vale oltre questo caso, ed e' la ragione per cui sta qui e non fra le
correzioni: ogni volta che si aggiunge un valore a una tabella, quel valore non
e' provato da nessuno.** Le prove guidano il **predefinito** — e' quello che
l'app pesca da sola — quindi la nona riga di una tabella e' esattamente tanto
coperta quanto una riga scritta a caso.

**Condizione: al prossimo giro delle tabelle serve una guardia che provi OGNI
opzione, non quella predefinita.** *Forma probabile: per ogni riga di ogni
tabella, montare la frase e verificare che non resti nessun segnaposto e che il
testo non contraddica la riga — e' meno di quanto sembri, perche' i valori sono
una cinquantina e la verifica e' sul testo prodotto, non sull'app.*

*Intanto le due righe NON sono state trascritte, col perche' scritto accanto nel
file DATI: senza quella riga, al prossimo giro qualcuno le rimette.*

---

# ⚠️ UNA FRASE NON DIFENDE: LA TERZA APPLICAZIONE — 2026-09-24

> **«Le prime due volte la difesa era una frase, e l'ho violata io scrivendone
> un'altra che spiegava la stessa cosa. Adesso c'e' il comando, e il rosso
> nomina la causa.»**

**E' la terza volta che questa lezione si applica, e le tre insieme sono la
prova che non e' un aneddoto:**

| | Il caso | Cos'era la difesa prima | Cos'e' adesso |
|---|---|---|---|
| **N.12** | i valori ricopiati nei test invece che letti dalla fonte | *«si leggono dalla fonte»*, scritto | il test **legge** la fonte, e un valore ricopiato non c'e' piu' da ricopiare |
| **`attendi-ci.sh`** | il commit corto che dava «la corsa non esiste» | *«il commit va intero»*, scritto in testa | lo script **lo estende da solo** con `git rev-parse`, e un commit corto esce **64 col motivo** |
| **la trappola del marcatore** | il titolo citato nella prosa che `indexOf` trova per primo | *«qui la stringa non si scrive apposta»*, scritto nel file | `[Fonte]` **verifica che ognuno degli otto marcatori compaia una volta sola**, e lo dice **prima** dell'asserzione sul contenuto |

⚠️ **E la terza e' la piu' istruttiva, perche' la violazione l'ha fatta chi
aveva appena scritto la difesa** — scrivendo un'altra frase che spiegava la
stessa trappola. *E' la stessa forma della regola 19: non mancava la regola,
mancava il fatto che la rendesse applicabile. **Un elenco di parole si legge e
si crede di averlo applicato; un elenco di comandi o passa o non passa.***

**La forma che funziona, in una riga: il difetto diventa un'ASSERZIONE che
nomina la CAUSA, e sta PRIMA di quella che nomina l'effetto.**

---

# ⚠️ UN ROSSO CHE MANDA A GUARDARE NEL POSTO SBAGLIATO — 2026-09-23

**Da tenere oltre il caso.** `test_story_modules.js` leggeva la chiave del
personaggio esterno scritta a mano: `(fonte.speakerLabels || {}).guide`.
Rinominata la chiave in `hostess-gate`, quella riga **non sarebbe morta**:
`esterno` sarebbe diventato `''`, e l'asserzione avrebbe stampato

> *«L'etichetta del personaggio esterno porta il contorno, non il solo
> mestiere» — etichetta: ""*

**cioe' avrebbe accusato il CONTORNO mentre il guasto era il NOME.**

*E' la stessa forma del rosso muto del passo 21-bis: il test cade, e quello che
dice non e' quello che e' successo — quindi si va a cercare dove il guasto non
e'.* **La difesa e' la stessa di sempre: agganciarsi al dato che definisce la
cosa (`ruolo`), non al nome che ha oggi.**

---

# ⚠️ I DIVIETI — si leggono PRIMA di prendere un passo

Non si deducono guardando il codice.

1. **Mentre la suite gira, l'albero di lavoro non si tocca** (regola 36). Una
   suite contaminata a metà non è un verde parziale: è un risultato nullo.
2. **Un passo non si dichiara fatto senza la suite completa E la CI**, lette
   entrambe (regola 38).
3. **Un'asserzione che diventa rossa per una DECISIONE si SEGUE, non si toglie.**
   È successo **dodici volte in tre giorni**, e ogni volta l'invariante era
   ancora vero: era cambiato dove viveva.
4. **Un test nuovo nasce nello stesso commit del codice che verifica**
   (regola 23), e si vede **fallire apposta** prima di fidarsene (regola 32).
5. **Ogni commit scrive la propria riga** in `correzioni.md` o qui (regola 43).
6. **Un file sotto `docs/{lingua}/` non si tocca di iniziativa** (regola 33).
7. ⚠️ **I NOMI FRANCESI VANNO NELL'EDIZIONE FRANCESE**, cioe' in
   `data/francese/it/tabelle-personalizzazione.json`, mai in
   `data/inglese/it/inglese-it-tabelle-personalizzazione.json`. *Un'edizione
   non e' una traduzione: le due tabelle sono contenuti diversi, non due
   colonne della stessa riga.*

   ⚠️ **RISCRITTO IL 2026-09-23, E LA VERSIONE PRECEDENTE ERA UNA GUARDIA A
   VUOTO.** Diceva *«quel file porta `fr`, `es`, `de` vuote … e finche' il
   passo 1.8 non le toglie, sono li' e sembrano il posto giusto»*. **Il passo
   1.8 le ha tolte il 2026-09-20**: misurato, **49 righe su 49** hanno la forma
   `{value, it, en, traducibile}` e zero hanno quelle colonne. *Il divieto
   proteggeva da un errore diventato impossibile — una misura che non misura
   (regola 37) — in cima all'elenco che si legge PRIMA di prendere un passo.
   La sostanza resta vera; e' la ragione che era scaduta.*
8. ⚠️ **In un file di contenuto si cercano prima le ISTRUZIONI false, poi i
   fatti falsi.** Un fatto sbagliato confonde chi legge; **un'istruzione
   sbagliata viene ESEGUITA.** Il caso: `inglese-it-gate.md` dice *«finche' non
   e' fatta, l'id e' `episode1` e va usato quello»* — una sessione che lo legge
   fa quello che dice. Le altre righe false dello stesso file dicono soltanto
   cose non piu' vere. **Vale per tutti e sei i file**, e decide l'ordine in cui
   si riscrivono.
9. ⚠️ **DA `nuovi/` NON SI PROMUOVE NIENTE DI INIZIATIVA.** Quello che sta lì è
   contenuto di chi guida il progetto, esattamente come `docs/{lingua}/` — solo
   che la **regola 33 nomina quella cartella e non questa**, quindi il divieto
   sta qui e in `nuovi/LEGGIMI.md`. Si legge, si confrontano le differenze col
   file vero, si riportano, **e si aspetta l'ok**. *Il rischio non è teorico: una
   sessione futura trova lì dentro un file «ovviamente più nuovo» di quello vero
   e lo copia sopra — e i nomi versionati che quella cartella ammette lo fanno
   sembrare pure ragionevole.*

---

# ⚠️ CINQUE GUASTI MUTI IN TRE GIORNI — e nessuno alzava un errore

Si scrive qui, non nello storico, perché **decide come si lavora adesso**: la
suite non li ha visti, li ha visti **guidare l'app**.

| Cosa | Come si è visto |
|---|---|
| `activeHelpModule is not defined` — il pannello Help moriva al primo pulsante | guidandolo |
| `STORY_CARDS_ANSWER_LABEL` — il Pannello Admin non si apriva più, ma **solo per chi aveva già risposto** a un'autovalutazione | guidandolo con quel profilo |
| **Cinque listener della mappa spariti** — «Vai all'episodio» non faceva niente | guidandola |
| `sfxPlayExitSound` — **tutte e quattordici** le Schermate Finali morivano al parsing | guidandola |
| Il pannello Help **vuoto** nella finestra in cui i suoi testi arrivano | segnalato con uno screenshot |

> **Quello che non alza un errore non lo trova una suite verde. Lo trova chi apre
> l'app.** È la ragione per cui la tappa ② esiste, e per cui ogni passo di
> queste liste finisce con «apri l'app e guarda».
