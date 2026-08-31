# Episodio 1 — "Presentarsi"

> **Materiale di partenza per Claude Code.** Da qui viene scritto
> `data/a1-episodio1-inglese.json`, che è la fonte da cui l'app pesca.
> Questo file contiene anche le motivazioni delle scelte; il JSON contiene solo i dati.
>
> **Numeri attesi nel JSON:** 21 voci nel grado A, 6 in B, 13 in C, 12 battute in D, 11 skill, 9 slot di personalizzazione. Se i conti non tornano, fermarsi e segnalarlo.
>
> Il metodo con cui è stato scritto (workflow, regole dei dialoghi, checklist) sta nel file di progetto `base-inglese-contenuti-didattici`, non qui.

## ISTRUZIONI PER L'AGGIORNAMENTO DEL JSON

**Tutto ciò che segue SOSTITUISCE integralmente il contenuto attuale del file dati. Non si aggiunge: rimpiazza.**

Nello specifico:

- **Il dialogo** è nuovo: 12 battute al posto delle 7 attuali, con testo e traduzioni diversi. Il vecchio dialogo va rimosso.
- **Le tabelle di personalizzazione** sostituiscono quelle attuali: nomi a 8 opzioni per ruolo, età cambiate, destinazioni ridotte a 6, più il nuovo slot `cognome`.
- **I gradi B e C**, oggi vuoti, vanno riempiti con il contenuto qui sotto.
- **Il grado A** passa da 15 a 21 voci.

**I nomi di persona non si traducono mai nel dialogo.** La colonna inglese esiste solo per mostrare la doppia forma nella schermata di personalizzazione. I toponimi invece si traducono (Torino → Turin). I cognomi non hanno forma inglese: colonna identica per costruzione.

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
| d10 | Guida | {papà}, {mamma}, {figlia}, {figlio}... where are you going? | {papà}, {mamma}, {figlia}, {figlio}... dove state andando? |
| d11 | Papà | We are going to {destinazione}! | Andiamo in {destinazione}! |
| d12 | Guida | Welcome to {destinazione}, {cognome} family! | Benvenuti in {destinazione}, famiglia {cognome}! |

## Note di scrittura

1. **Perché "Where are you going?" sta dopo la battuta corale.** Nella prima domanda `you` significa "tu" (rivolta al papà), nella seconda "voi" (rivolta alla famiglia). Vicine, la seconda sarebbe sembrata una ripetizione e la differenza sarebbe passata inosservata. Dopo "We are the {cognome} family" il plurale è già stabilito dalla famiglia stessa.
2. **Perché la guida elenca i nomi.** Oltre a chiarire il "voi", fa sentire allo studente **il proprio nome pronunciato** — uno dei quattro è il suo.
3. **Adulti e ragazzi parlano diverso.** Papà e mamma "Hello" e "I am", i figli "Hi" e "I'm". Una sola distinzione di registro che spiega due differenze, e rispetta la regola della forma estesa prima della contratta.
4. **"We are going" per esteso.** Stessa regola, e in più `we are` compare identico due volte (d9 e d11): lo studente lo vede uguale invece che in due varianti.
5. **Le due forme dell'età.** La figlia "I'm sixteen years old", il figlio "I'm ten". La seconda previene l'errore classico: chi conosce solo quella, al ristorante risponderà "we are three" alla domanda "quanti siete", dicendo di avere tre anni.
6. **Cosa è stato tolto.** *"Can you introduce yourselves?"* — riflessivo con accento anomalo, la frase più difficile, serviva solo da innesco. *Il genitivo sassone* ("I'm {papà}'s wife") — struttura ostica; chi è la moglie di chi si capisce dalla scena. *"Everyone"* — parola lunga e poco utile all'inizio.
7. **La destinazione compare due volte**, in d11 e d12. Martello sulla sceneggiatura.
8. **Il cognome è uno slot nuovo.** Prima la famiglia non ne aveva uno.
9. **Le destinazioni sono limitate a paesi che in italiano vogliono "in".** La traduzione di "We are going to {destinazione}" cambia preposizione secondo il paese — "in Cina" ma "negli Stati Uniti" — e una tabella non può contenere una preposizione per riga senza complicare il testo. Il vincolo diventa una lezione futura.
10. **`Hello!` e `Hi!` non entrano nel grado C:** sono parole singole già nel grado A, e come "frasi" sarebbero identiche. Il grado C esercita la costruzione della frase, non le esclamazioni di una parola. *Regola generale: una voce non si ripete a due gradi diversi se a quel grado non aggiunge niente.*

## Le 11 skill

Tutte di difficoltà **facile** tranne la 10, **media**. Il campo nel JSON è `whatYouLearn`, con `title` e `body`. HTML consentito nel corpo, niente `<p>`, `<br>` per andare a capo. I segnaposto NON vengono sostituiti nelle skill.

**1 — su d1 "Hello!" — Hello e Hi**
> Sono i due modi normali di salutare, e vogliono dire la stessa cosa: ciao.
> "Hello" è un po' più educato, "Hi" un po' più amichevole. Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".
> È come in italiano — "Buongiorno" a chi non conosci, "Ciao" a un amico. Nessuno dei due è sbagliato.
> Se sei in dubbio, "Hello" va bene sempre, con chiunque.

**2 — su d7 "Hi! I'm {figlia}." — I am e I'm**
> Il papà dice "I am {papà}", la figlia dice "I'm {figlia}". Sono la stessa cosa: "I'm" è solo la forma corta.
> Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".
> Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.

**3 — su d8 "I'm {etàFiglio}." — Dire quanti anni hai**
> La figlia dice "I'm sixteen **years old**". Il figlio dice solo "I'm ten".
> Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.
> Attenzione a una cosa: in inglese **non si usa il verbo avere** per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".
> Ricordatelo, perché è la differenza più grande con l'italiano.

**4 — su d4 "I am from {partenza}." — Dire da dove vieni**
> "I am from {partenza}" vuol dire "vengo da {partenza}".
> Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".
> "From" significa "da". La userai tantissimo.

**5 — su d3 "Where are you from?" — Chiedere da dove viene qualcuno**
> "Where are you from?" vuol dire "di dove sei?".
> "Where" significa "dove". E ritrovi già "are you", che è la domanda del verbo essere.
> Il papà risponde "I am from {partenza}" — la stessa struttura, girata.
> Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra.

**6 — su d1 "Nice to meet you." — Nice to meet you**
> Si dice quando incontri qualcuno per la **prima volta**, ed è il modo normale di farlo: né troppo formale né troppo informale.
> Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".
> Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!".

**7 — su d10 "...where are you going?" — Una parola per "tu" e per "voi"**
> Prima la guida ha chiesto al papà: "Where are you from?" — lì "you" vuol dire **tu**.
> Ora chiede a tutta la famiglia: "Where are you going?" — e qui "you" vuol dire **voi**.
> In inglese è la stessa parola. Capisci a chi si parla guardando la situazione, non la parola.
> Non è un problema: ci si abitua prestissimo, e ti risparmia di imparare due forme diverse come in italiano.

**8 — su d5 "And you?" — And you?**
> Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.
> Nel dialogo la guida l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.
> Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.

**9 — su d9 "We are the {cognome} family!" — We are**
> "We are" vuol dire "noi siamo".
> Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.
> Nota che in inglese il cognome va **prima** della parola "family", al contrario dell'italiano.

**10 — su d11 "We are going to {destinazione}!" — Dire dove stai andando** *(media)*
> "We are going to {destinazione}" vuol dire "andiamo in {destinazione}".
> Ritrovi "we are", che hai appena visto. Qui però non finisce lì: "we are **going**" vuol dire che l'azione sta succedendo adesso, o che è già decisa.
> "To" indica la direzione: verso dove.
> Per ora imparala così, tutta insieme. È una delle frasi più utili in viaggio.

**11 — su d12 "Welcome to {destinazione}!" — Welcome**
> "Welcome" vuol dire "benvenuto". Con "to" davanti al posto: "Welcome to {destinazione}", benvenuti in {destinazione}.
> Ritrovi "to" della frase di prima: la stessa parolina per dire verso dove.
> Non cambia se sei uno o siete in tanti: "welcome" va bene per tutti.

### Skill rimandate

| Struttura | Dove compare | Perché | Quando |
|---|---|---|---|
| Present continuous (`are going`) | d11 | Spiegare il tempo verbale richiederebbe il contrasto con il present simple, non ancora noto. Per ora la frase si impara intera. | Episodio 2 |

## I gradi

### Grado A — 21 parole

`hello` · `hi` · `nice` · `to` · `meet` · `you` · `I` · `am` · `I'm` · `where` · `are` · `from` · `Italy` · `and` · `years` · `old` · `we` · `the` · `family` · `going` · `welcome`

*Più i numeri delle età, che vengono da A0 (1-20).*

| Voce | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| Hello | Ciao / Salve | hel-LOU — la "h" è un soffio leggero | saluto |
| Hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto |
| nice | bello / piacevole | nais | aggettivo |
| to | a / verso | tu — corta | preposizione |
| meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo |
| you | tu / voi | iu | pronome |
| I | io | ai — sempre maiuscola in inglese | pronome |
| am | sono | am | verbo essere |
| I'm | io sono | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere |
| where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo |
| are | sei / siamo / siete / sono | ar | verbo essere |
| from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione |
| Italy | Italia | I-ta-li — accento sulla prima | nome di paese |
| and | e | and — la "d" finale si sente appena | congiunzione |
| years | anni | i-ars — parte con un suono di "i" | sostantivo |
| old | vecchio (di età) | ould — la "o" è lunga | aggettivo |
| we | noi | ui | pronome |
| the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo |
| family | famiglia | FA-mi-li — accento sulla prima | sostantivo |
| going | andando | GO-in — la "g" finale si sente appena | verbo |
| Welcome | Benvenuto | UEL-com — accento sulla prima | saluto |

### Grado B — 6 chunk

| Inglese | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| Nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica |
| Where are you | Dove sei / Dove siete | UEAR ar iu — tutto legato | struttura interrogativa |
| I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione |
| And you? | E tu? / E voi? | and IU — accento su "you" | espressione |
| years old | anni (di età) | i-ars OULD | espressione per l'età |
| going to | andando a / verso | GO-in tu — nel parlato veloce diventa quasi "gonna" | verbo + preposizione |

### Grado C — 13 frasi

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
| Where are you going? | Dove state andando? | d10 |
| We are going to {destinazione}! | Andiamo in {destinazione}! | d11 |
| Welcome to {destinazione}! | Benvenuti in {destinazione}! | d12 |

*Nota su d10: la frase esercitata è solo "Where are you going?", senza l'elenco dei nomi — quello resta nel grado D.*
*`I am {papà}` e `I am {mamma}` sono la stessa struttura con nomi diversi: si tengono entrambe per la regola della ripetizione ravvicinata.*

### Grado D — 12 battute

Le dodici battute della tabella in cima, con `speaker`, `ruolo`, `english`, `italian` e `whatYouLearn` dove previsto.

### Domanda aperta

**Il grado C ha bisogno di una categoria?** Per le parole la categoria è grammaticale; per una frase intera forse è funzionale — domanda, risposta, presentazione, saluto. Non sappiamo ancora a cosa servirebbe: **da decidere all'episodio 4**, quando ci saranno una cinquantina di frasi davanti e un criterio potrà emergere invece di essere inventato.

## Gli slot di personalizzazione

**Queste tabelle sostituiscono integralmente quelle attuali.**

Nove slot. I **nomi di persona non si traducono mai** nel dialogo: la colonna inglese serve solo a mostrare la doppia forma nella schermata di personalizzazione. I **toponimi si traducono**.

**Nomi** — otto per ruolo:

| Ruolo | Opzioni (predefinito in grassetto) |
|---|---|
| Papà | **Marco** · Giancarlo · Francesco · Andrea · Luca · Paolo · Stefano · Davide |
| Mamma | **Giulia** · Anna · Chiara · Nicoletta · Laura · Elena · Silvia · Francesca |
| Figlia | **Emma** · Sofia · Alice · Giorgia · Martina · Sara · Chiara · Beatrice |
| Figlio | **Tommaso** · Leo · Marco · Giorgio · Matteo · Lorenzo · Simone · Filippo |

*Chiara compare tra mamme e figlie, Marco tra papà e figli: non è un problema.*

**Cognome** (slot nuovo, non si traduce): **Rossi** · Bianchi · Ferrari · Russo · Costa · Marino · Barberis · Ambruosi

**Età:** figlia 13-17 (predefinito 16, adolescente) · figlio 4-10 (predefinito 8, bambino). *I due figli restano distinti per età, e questo influisce sugli episodi futuri.*

**Città di partenza:** Mondovì (predefinito) · Torino/Turin · Milano/Milan

**Destinazione** — sei, predefinito **Cina**:

| Chiave | Italiano | Inglese |
|---|---|---|
| cina | **Cina** | China |
| giappone | Giappone | Japan |
| spagna | Spagna | Spain |
| francia | Francia | France |
| germania | Germania | Germany |
| irlanda | Irlanda | Ireland |

*Criterio di ammissione: solo paesi che in italiano vogliono la preposizione "in" (vedi la nota 9). "We are going to {destinazione}" si traduce "Andiamo in ...", e una riga della tabella non può portarsi dietro una preposizione propria senza complicare il testo: "negli Stati Uniti" non entra, e per questo gli Stati Uniti non ci sono.*

---
