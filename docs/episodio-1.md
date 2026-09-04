# Episodio 1 — "Presentarsi"

> **Materiale di partenza per Claude Code.** Da qui viene scritto `data/a1-episodio1-inglese.json`, che è la fonte da cui l'app pesca. Questo file contiene anche le motivazioni delle scelte; il JSON contiene solo i dati.
>
> **Numeri attesi nel JSON:** 16 voci nel grado A, 7 in B, 10 in C, 9 battute in D, 8 skill, 8 slot di personalizzazione. Se i conti non tornano, fermarsi e segnalarlo.
>
> Il metodo con cui è stato scritto (workflow, regole dei dialoghi, checklist) sta nel file di progetto `base-inglese-contenuti-didattici`, non qui.

## ISTRUZIONI PER L'AGGIORNAMENTO DEL JSON

**Tutto ciò che segue SOSTITUISCE integralmente il contenuto attuale del file dati. Non si aggiunge: rimpiazza.**

Nello specifico:

- **Il dialogo scende da 12 a 9 battute.** Le ultime tre — la domanda sulla destinazione, la risposta e il benvenuto — sono state spostate nell'episodio 2. Vanno rimosse da qui.
- **I gradi vanno ricalcolati** su questo contenuto: A passa a 16 voci, B a 7, C a 10, D a 9.
- **Le skill scendono da 11 a 8:** escono quella sul "you" plurale, quella su "we are going to" e quella su "welcome", che appartengono all'episodio 2.
- **Lo slot `destinazione` esce dall'episodio 1:** non compare più in nessuna battuta. Restano 8 slot.
- **Le tabelle di personalizzazione** restano quelle attuali, con la sola rimozione della destinazione e le età corrette (vedi sotto).

**I nomi di persona non si traducono mai nel dialogo.** La colonna inglese esiste solo per mostrare la doppia forma nella schermata di personalizzazione. I toponimi invece si traducono (Torino → Turin). I cognomi non hanno forma inglese: colonna identica per costruzione.

**Nelle skill i segnaposto vengono sostituiti**, e la citazione della frase inglese chiede il valore inglese con `{{chiave:en}}` — così *«I am from {{partenza:en}}» vuol dire «vengo da {{partenza}}»* rende "I am from Turin" nella citazione e "vengo da Torino" nella prosa.

**Ricordarsi della copia di sicurezza** dentro `index.html`, che `test_fallbacks.js` verifica: va rigenerata dal file dati, non riscritta a mano.

**Se un conteggio non torna rispetto ai numeri attesi qui sopra, fermarsi e segnalarlo prima di scrivere.**

---

## Il dialogo (validato)

| # | Chi | Inglese | Italiano |
|---|---|---|---|
| d1 | Guida | Hello! Nice to meet you. | Ciao! Piacere di conoscervi. |
| d2 | Papà | Hello! I am {papà}. | Ciao! Sono {papà}. |
| d3 | Guida | Where are you from, {papà}? | Di dove sei, {papà}? |
| d4 | Papà | I am from {partenza}, Italy. | Vengo da {partenza}, in Italia. |
| d5 | Guida | And you? | E tu? |
| d6 | Mamma | Hello! I am {mamma}. | Ciao! Sono {mamma}. |
| d7 | Figlia | Hi! I'm {figlia}. I'm {etàFiglia} years old. | Ciao! Sono {figlia}. Ho {etàFiglia} anni. |
| d8 | Figlio | Hi! I'm {figlio}. I'm {etàFiglio}. | Ciao! Sono {figlio}. Ho {etàFiglio} anni. |
| d9 | Tutti | We are the {cognome} family! | Siamo la famiglia {cognome}! |

## Note di scrittura

1. **Adulti e ragazzi parlano diverso.** Papà e mamma "Hello" e "I am", i figli "Hi" e "I'm". Una sola distinzione di registro che spiega due differenze, e rispetta la regola della forma estesa prima della contratta.
2. **Le due forme dell'età.** La figlia "I'm sixteen years old", il figlio "I'm ten". La seconda previene l'errore classico: chi conosce solo quella, al ristorante risponderà "we are three" alla domanda "quanti siete", dicendo di avere tre anni.
3. **Cosa è stato tolto.** *"Can you introduce yourselves?"* — riflessivo con accento anomalo, la frase più difficile, serviva solo da innesco. *Il genitivo sassone* ("I'm {papà}'s wife") — struttura ostica; chi è la moglie di chi si capisce dalla scena. *"Everyone"* — parola lunga e poco utile all'inizio.
4. **Il cognome è uno slot nuovo.** Prima la famiglia non ne aveva uno.
5. **`Hello!` e `Hi!` non entrano nel grado C:** sono parole singole già nel grado A, e come "frasi" sarebbero identiche. Il grado C esercita la costruzione della frase, non le esclamazioni di una parola. *Regola generale: una voce non si ripete a due gradi diversi se a quel grado non aggiunge niente.*
6. **Perché l'episodio è stato diviso.** La versione a 12 battute aveva 21 parole nuove tutte insieme — troppe per chi parte da zero, senza niente di pregresso su cui appoggiarsi. E il grado B con sole 6 voci aveva quattro moduli che ci insistevano sopra, rendendoli ripetitivi. Le ultime tre battute sono diventate il nucleo dell'episodio 2, che le riprende dentro una scena propria.

## Le 8 skill

Il campo nel JSON è `whatYouLearn`, ed è **sempre una lista**, anche con una skill sola: la battuta d1 ne ha due. Ogni voce ha `title` e `body`. HTML consentito nel corpo, niente `<p>`, `<br>` per andare a capo.

**1 — su d1 "Hello!" — Hello e Hi** *(facile)*
> Sono i due modi normali di salutare, e vogliono dire la stessa cosa: ciao.
> "Hello" è un po' più educato, "Hi" un po' più amichevole. Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".
> È come in italiano — "Buongiorno" a chi non conosci, "Ciao" a un amico. Nessuno dei due è sbagliato.
> Se sei in dubbio, "Hello" va bene sempre, con chiunque.

**2 — su d1 "Nice to meet you." — Nice to meet you** *(facile)*
> Si dice quando incontri qualcuno per la **prima volta**, ed è il modo normale di farlo: né troppo formale né troppo informale.
> Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".
> Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!".

**3 — su d3 "Where are you from?" — Chiedere da dove viene qualcuno** *(facile)*
> "Where are you from?" vuol dire "di dove sei?".
> "Where" significa "dove". E ritrovi già "are you", che è la domanda del verbo essere.
> Il papà risponde "I am from {{partenza:en}}" — la stessa struttura, girata.
> Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra.

**4 — su d4 "I am from {partenza}." — Dire da dove vieni** *(facile)*
> "I am from {{partenza:en}}" vuol dire "vengo da {{partenza}}".
> Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".
> "From" significa "da". La userai tantissimo.

**5 — su d5 "And you?" — And you?** *(facile)*
> Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.
> Nel dialogo la guida l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.
> Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.

**6 — su d7 "Hi! I'm {figlia}." — I am e I'm** *(facile)*
> Il papà dice "I am {{papà}}", la figlia dice "I'm {{figlia}}". Sono la stessa cosa: "I'm" è solo la forma corta.
> Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".
> Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.
> Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. **In inglese non si può:** "I" ci deve essere sempre. Non esiste dire "am Marco".

**7 — su d8 "I'm {etàFiglio}." — Dire quanti anni hai** *(facile)*
> La figlia dice "I'm {{etàFiglia}} **years old**". Il figlio dice solo "I'm {{etàFiglio}}".
> Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.
> Attenzione a una cosa: in inglese **non si usa il verbo avere** per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".
> Ricordatelo, perché è la differenza più grande con l'italiano.

**8 — su d9 "We are the {cognome} family!" — We are** *(facile)*
> "We are" vuol dire "noi siamo".
> Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.
> Nota che in inglese il cognome va **prima** della parola "family", al contrario dell'italiano.

### Skill spostate all'episodio 2

Il "you" che vale tu e voi, "we are going to", "welcome": appartengono alle tre battute spostate.

### Skill rimandate

Nessuna in questo episodio. Il present continuous, che era rimandato, esce insieme alla battuta che lo conteneva.

---

## I gradi

### Grado A — 16 parole

`hello` · `hi` · `nice` · `meet` · `you` · `I` · `I'm` · `where` · `from` · `Italy` · `and` · `years` · `old` · `we` · `the` · `family`

*Più i numeri delle età, che vengono da A0 (1-20).*

**Uscite con le tre battute spostate:** `going`, `welcome`, i nomi dei paesi, e **`to`**.

**Uscite anche `am` e `are` come parole singole**, spostate nel grado B come `I am` e `we are`. *Motivo:* nessuno usa "am" o "are" isolati, e dopo A0.2 lo studente conosce già la coniugazione del verbo essere. Isolarli in una carta da studiare è un esercizio senza oggetto. Come parte di `I am` e `we are` invece hanno un significato che si può usare. Il riequilibrio serve anche ai numeri: il grado B con cinque voci era troppo scarno per i quattro moduli che ci pescano.

*Perché esce anche `to`:* nel dialogo lungo compariva tre volte — "Nice **to** meet you", "going **to**", "Welcome **to**". Restando solo il primo caso, quel `to` non ha un significato che lo studente possa usare da solo: serve solo dentro un'espressione che si impara intera, e quell'espressione è già nel grado B. Tornerà nel grado A dell'episodio 2, dove "going to" e "welcome to" gli danno un senso vero — la direzione.

| Voce | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| Hello | Ciao / Salve | hel-LOU — la "h" è un soffio leggero | saluto |
| Hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto |
| nice | bello / piacevole | nais | aggettivo |
| meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo |
| you | tu / voi | iu | pronome |
| I | io | ai — sempre maiuscola in inglese | pronome |
| I'm | io sono | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere |
| where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo |
| from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione |
| Italy | Italia | I-ta-li — accento sulla prima | nome di paese |
| and | e | and — la "d" finale si sente appena | congiunzione |
| years | anni | i-ars — parte con un suono di "i" | sostantivo |
| old | vecchio (di età) | ould — la "o" è lunga | aggettivo |
| we | noi | ui | pronome |
| the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo |
| family | famiglia | FA-mi-li — accento sulla prima | sostantivo |

### Grado B — 7 espressioni

| Inglese | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| I am | (io) sono | ai am | pronome + verbo essere |
| we are | (noi) siamo | ui ar | pronome + verbo essere |
| Nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica |
| Where are you? | Di dove sei? / Di dove siete? | UEAR ar iu — tutto legato | struttura interrogativa |
| I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione |
| And you? | E tu? / E voi? | and IU — accento su "you" | espressione |
| years old | anni (di età) | i-ars OULD | espressione per l'età |

*Uscita:* `going to`, che apparteneva alla battuta spostata.

### Grado C — 10 frasi

| Inglese | Italiano | Da battuta |
|---|---|---|
| Nice to meet you. | Piacere di conoscervi. | d1 |
| I am {papà}. | Sono {papà}. | d2 |
| Where are you from? | Di dove sei? | d3 |
| I am from {partenza}, Italy. | Vengo da {partenza}, in Italia. | d4 |
| And you? | E tu? | d5 |
| I am {mamma}. | Sono {mamma}. | d6 |
| I'm {figlia}. | Sono {figlia}. | d7 |
| I'm {etàFiglia} years old. | Ho {etàFiglia} anni. | d7 |
| I'm {etàFiglio}. | Ho {etàFiglio} anni. | d8 |
| We are the {cognome} family! | Siamo la famiglia {cognome}! | d9 |

*Uscite:* le tre frasi delle battute spostate.

### Grado D — 9 battute

Le nove battute della tabella in cima, con `speaker`, `ruolo`, `english`, `italian` e `whatYouLearn` dove previsto.

---

## Gli slot di personalizzazione

**Queste tabelle sostituiscono integralmente quelle attuali.**

Otto slot: papà, mamma, figlia, figlio, età figlia, età figlio, cognome, città di partenza. **La destinazione esce**, perché non compare in nessuna battuta di questo episodio.

**Nomi** — otto per ruolo:

| Ruolo | Opzioni (predefinito in grassetto) |
|---|---|
| Papà | **Marco** · Giancarlo · Francesco · Andrea · Luca · Paolo · Stefano · Davide |
| Mamma | **Giulia** · Anna · Chiara · Nicoletta · Laura · Elena · Silvia · Francesca |
| Figlia | **Emma** · Sofia · Alice · Giorgia · Martina · Sara · Chiara · Beatrice |
| Figlio | **Tommaso** · Leo · Marco · Giorgio · Matteo · Lorenzo · Simone · Filippo |

*Chiara compare tra mamme e figlie, Marco tra papà e figli: non è un problema.*

**Cognome** (non si traduce): **Rossi** · Bianchi · Ferrari · Russo · Costa · Marino · Barberis · Ambruosi

**Età** — numeri continui, senza buchi:
- Età figlio: da **4 a 11**, predefinito 8
- Età figlia: da **12 a 17**, predefinito 16

**Città di partenza** — i toponimi si traducono:

| Chiave | Italiano | Inglese | Predefinito |
|---|---|---|---|
| mondovi | Mondovì | Mondovì | ✓ |
| torino | Torino | Turin | |
| milano | Milano | Milan | |
