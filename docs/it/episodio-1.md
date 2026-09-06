# Episodio "Al gate"

> **Id interno:** `gate` — descrittivo, in inglese, **congelato**: è la chiave con cui si
> salvano i progressi. Cambiarlo è una migrazione di dati, non una rinomina.
> **Titolo mostrato allo studente:** *Al gate* — appartiene all'edizione italiana e può
> cambiare quando vogliamo.
>
> **Numeri attesi nel JSON:** 14 voci nel grado A, 6 in B, 10 in C, 9 battute in D, 8 skill,
> 8 slot di personalizzazione. **Se i conti non tornano, fermarsi e segnalarlo.**
>
> **Materiale di partenza per Claude Code.** Da qui viene scritto
> `data/it/a1-episodio1-inglese.json`, che è la fonte da cui l'app pesca. Questo file contiene
> anche le motivazioni; il JSON contiene solo i dati. **Code trascrive, non decide**
> (regola 1.13).
>
> Il metodo con cui è stato scritto — workflow, regole dei dialoghi, checklist — sta nel file
> di progetto `APPLINGUE-metodo-didattico`, non qui.

---

## ISTRUZIONI PER L'AGGIORNAMENTO DEL JSON

**Tutto ciò che segue SOSTITUISCE integralmente il contenuto attuale del file dati. Non si
aggiunge: rimpiazza.**

**I nomi di persona non si traducono mai nel dialogo.** La colonna inglese esiste solo perché
sia già pronta se un giorno servisse. I toponimi invece si traducono (Torino → Turin). I
cognomi non hanno forma inglese: colonna identica per costruzione.

**Nelle skill i segnaposto vengono sostituiti**, e la citazione della frase inglese chiede il
valore inglese con `{{chiave:en}}` — così *«I am from {{partenza:en}}» vuol dire «vengo da
{{partenza}}»* rende "I am from Turin" nella citazione e "vengo da Torino" nella prosa.

**Ricordarsi della copia di sicurezza** dentro `index.html`, che `test_fallbacks.js` verifica:
va rigenerata dal file dati, non riscritta a mano. *Nota: il fallback è destinato a sparire —
vedi `docs/decisioni.md`. Finché c'è, va tenuto allineato.*

---

## LA MATRICE

*Una matrice sola. I gradi ne discendono, non sono tabelle a sé* (regola 2.11).

*Fino a ieri questo file aveva quattro tabelle separate, con le frasi del grado C **ricopiate a
mano** dalle battute: cambiare una e dimenticare l'altra avrebbe fatto dire al dialogo e al
quiz due cose diverse, in silenzio, senza che nessun test lo vedesse.*

### Grado D — le nove battute

*Il grado D **è** il dialogo. Tutto il resto si ricava da qui, per sottrazione* (regola 1.3).

| # | Chi | Inglese | Italiano | Skill |
|---|---|---|---|---|
| d1 | Hostess al gate | Hello! Nice to meet you. | Ciao! Piacere di conoscervi. | 1, 2 |
| d2 | Papà | Hello! I am {papà}. | Ciao! Sono {papà}. | — |
| d3 | Hostess al gate | Where are you from, {papà}? | Di dove sei, {papà}? | 3 |
| d4 | Papà | I am from {partenza}, {paese}. | Vengo da {partenza}, in {paese}. | 4 |
| d5 | Hostess al gate | And you? | E tu? | 5 |
| d6 | Mamma | Hello! I am {mamma}. | Ciao! Sono {mamma}. | — |
| d7 | Figlia | Hi! I'm {figlia}. I'm {etàFiglia} years old. | Ciao! Sono {figlia}. Ho {etàFiglia} anni. | 6 |
| d8 | Figlio | Hi! I'm {figlio}. I'm {etàFiglio}. | Ciao! Sono {figlio}. Ho {etàFiglio} anni. | 7 |
| d9 | Tutti | We are the {cognome} family! | Siamo la famiglia {cognome}! | 8 |

**Otto skill su sette battute:** d1 ne porta due, e **d2 e d6 non ne hanno nessuna** — sono le
due presentazioni dei genitori, identiche nella struttura. *Nel modulo Why We Say It quelle due
card non hanno pulsanti e prendono la spunta da sole quando la sequenza le supera.*

### Grado C — dieci frasi

*Le frasi del grado C **si ricavano dalle battute togliendo saluti e vocativi**: quello che
resta è la frase riusabile. Dove la frase è identica alla battuta si scrive `= dN` e non si
ricopia — così non possono divergere.*

| # | Inglese | Italiano | Da | Perché differisce |
|---|---|---|---|---|
| c1 | I am {papà}. | Sono {papà}. | d2 | tolto `Hello!` |
| c2 | Where are you from? | Di dove sei? | d3 | tolto il vocativo |
| c3 | `= d4` | | d4 | identica |
| c4 | `= d5` | | d5 | identica |
| c5 | I am {mamma}. | Sono {mamma}. | d6 | tolto `Hello!` |
| c6 | I'm {figlia}. | Sono {figlia}. | d7 | tolto `Hi!`, e la battuta contiene due frasi |
| c7 | I'm {etàFiglia} years old. | Ho {etàFiglia} anni. | d7 | seconda frase della battuta |
| c8 | I'm {figlio}. | Sono {figlio}. | d8 | tolto `Hi!`, e la battuta contiene due frasi |
| c9 | I'm {etàFiglio}. | Ho {etàFiglio} anni. | d8 | seconda frase della battuta |
| c10 | `= d9` | | d9 | identica |

**`Nice to meet you.` non è nel grado C**: come frase non aggiunge niente rispetto al chunk del
grado B, ed è la stessa identica stringa. *Una voce non si ripete a due gradi se a quel grado
non aggiunge niente* (regola 2.6).

### Grado B — sei espressioni

*B contiene **espressioni e pezzi**. Se è una frase intera sta in C* (regola 2.5).

| Inglese | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| I am | (io) sono | ai am | pronome + verbo essere |
| I'm | (io) sono | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere, contratto |
| we are | (noi) siamo | ui ar | pronome + verbo essere |
| nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica |
| I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione |
| years old | anni (di età) | i-ars OULD | espressione per l'età |

**`where are you from?` e `and you?` sono uscite da B**: sono frasi intere, quindi stanno solo
in C. *Erano duplicate fra i due gradi, e il criterio le ha separate da solo.*

**`nice to meet you` resta in B** benché sia una frase intera: **è una formula che si impara
intera e si produce così com'è**, non una frase costruita con le parole del grado A. La linea
di confine è *costruita / memorizzata*, non lunga / corta. *Eccezione validata, rivedibile.*

**`I am` e `I'm` stanno entrambi qui.** Sono due forme della stessa cosa, e vanno **vicine**:
il confronto è l'insegnamento (regola 4.1). *Fino a ieri `I'm` stava nel grado A e `I am` in B —
la contrazione prima della forma piena, che è l'inverso dell'ordine naturale.*

### Grado A — quattordici parole

`hello` · `hi` · `nice` · `meet` · `you` · `I` · `where` · `from` · `and` · `years` · `old` ·
`we` · `the` · `family`

*Più i numeri delle età, che vengono dall'episodio grammaticale dei numeri.*

| Voce | Italiano | Pronuncia | Categoria |
|---|---|---|---|
| hello | Ciao / Salve | hel-LOU — la "h" è un soffio leggero | saluto |
| hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto |
| nice | bello / piacevole | nais | aggettivo |
| meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo |
| you | tu / voi | iu | pronome |
| I | io | ai — sempre maiuscola in inglese | pronome |
| where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo |
| from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione |
| and | e | and — la "d" finale si sente appena | congiunzione |
| years | anni | i-ars — parte con un suono di "i" | sostantivo |
| old | vecchio (di età) | ould — la "o" è lunga | aggettivo |
| we | noi | ui | pronome |
| the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo |
| family | famiglia | FA-mi-li — accento sulla prima | sostantivo |

**Maiuscole:** in A e B minuscolo, tranne dove la lingua impone la maiuscola — qui solo `I`.
In C e D scrittura normale (regola 4.4). *`Hello` e `Hi` erano maiuscoli solo perché nel
dialogo stanno a inizio battuta.*

**`I` resta**, benché nessuno lo dica da solo: è una parola che serve a costruire, e va capita
isolata perché serve a leggere ogni frase che verrà (eccezione della regola 2.3). *E la skill 6
insegna esplicitamente che `I` non si può mai omettere: toglierlo dal grado A sarebbe stato
spiegare a parole una cosa che non si fa mai studiare.*

**Uscite dal grado A:**

| Voce | Dove è andata | Perché |
|---|---|---|
| `I'm` | grado B, accanto a `I am` | è una forma del verbo essere, non una parola singola |
| `Italy` | **slot di personalizzazione**, accoppiato alla città | non è più una voce fissa: ogni studente può partire da un paese diverso |
| `am`, `are` | grado B, dentro `I am` e `we are` | nessuno li usa isolati. Aperti dall'episodio grammaticale del verbo essere |
| `to` | esce e torna dopo | restando solo dentro `nice to meet you`, non ha un significato usabile da solo. Tornerà quando `going to` e `welcome to` gli daranno un senso: la direzione |
| `going`, `welcome` | episodio successivo | stavano solo nelle battute spostate |

---

## Le 8 skill

Il campo nel JSON è `whatYouLearn`, ed è **sempre una lista**, anche con una skill sola: la
battuta d1 ne ha due. Ogni voce ha `title` e `body`. HTML consentito nel corpo, niente `<p>`,
`<br>` per andare a capo.

*Una skill spiega **l'uso**, non la grammatica. Può **richiamare** una struttura che lo
studente ha già visto, non insegnarla: se deve spiegarla, vuol dire che la struttura non è
stata aperta prima* (regole 4.5 e 4.10).

**1 — su d1 `Hello!` — Hello e Hi** *(facile)*
> Sono i due modi normali di salutare, e vogliono dire la stessa cosa: ciao.
> "Hello" è un po' più educato, "Hi" un po' più amichevole. Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".
> È come in italiano — "Buongiorno" a chi non conosci, "Ciao" a un amico. Nessuno dei due è sbagliato.
> Se sei in dubbio, "Hello" va bene sempre, con chiunque.

**2 — su d1 `Nice to meet you.` — Nice to meet you** *(facile)*
> Si dice quando incontri qualcuno per la **prima volta**, ed è il modo normale di farlo: né troppo formale né troppo informale.
> Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".
> Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!".

**3 — su d3 `Where are you from?` — Chiedere da dove viene qualcuno** *(facile)*
> "Where are you from?" vuol dire "di dove sei?".
> "Where" significa "dove". E la formula funziona tutta insieme: è così che si chiede l'origine di qualcuno.
> Il papà risponde "I am from {{partenza:en}}" — la stessa struttura, girata.
> Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra.

**4 — su d4 `I am from {partenza}.` — Dire da dove vieni** *(facile)*
> "I am from {{partenza:en}}" vuol dire "vengo da {{partenza}}".
> Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".
> "From" significa "da". La userai tantissimo.

**5 — su d5 `And you?` — And you?** *(facile)*
> Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.
> Nel dialogo l'hostess l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.
> Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.

**6 — su d7 `Hi! I'm {figlia}.` — I am e I'm** *(facile)*
> Il papà dice "I am {{papà}}", la figlia dice "I'm {{figlia}}". Sono la stessa cosa: "I'm" è solo la forma corta.
> Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".
> **La forma corta vale sempre, non solo con i nomi:** "I'm from Turin" è uguale a "I am from Turin".
> Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.
> Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. **In inglese non si può:** "I" ci deve essere sempre. Non esiste dire "am Marco".

**7 — su d8 `I'm {etàFiglio}.` — Dire quanti anni hai** *(facile)*
> La figlia dice "I'm {{etàFiglia}} **years old**". Il figlio dice solo "I'm {{etàFiglio}}".
> Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.
> Attenzione a una cosa: in inglese **non si usa il verbo avere** per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".
> Ricordatelo, perché è la differenza più grande con l'italiano.

**8 — su d9 `We are the {cognome} family!` — We are** *(facile)*
> "We are" vuol dire "noi siamo".
> Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.
> Nota che in inglese il cognome va **prima** della parola "family", al contrario dell'italiano.

### Skill spostate all'episodio successivo

Il "you" che vale tu e voi, "we are going to", "welcome": appartengono alle tre battute
spostate.

### Skill rimandate

Nessuna. *Il present continuous, che era rimandato, esce insieme alla battuta che lo conteneva.*

---

## LA PERSONALIZZAZIONE

**Otto slot:** papà, mamma, figlia, figlio, età figlia, età figlio, cognome, partenza.

**Il paese non è un nono slot:** arriva accoppiato con la città, dalla stessa riga del
magazzino. *Città e paese appartengono alla stessa realtà: sceglierli separatamente
permetterebbe "Torino, Francia"* (regola 2.7, il fruttivendolo). Nella battuta d4 i due
segnaposto `{partenza}` e `{paese}` leggono **due campi della stessa riga**.

**L'episodio elenca gli id che usa**, uno per uno — non "tutti quelli della tabella"
(regola 5.7):

| Slot | Id elencati |
|---|---|
| papà | `papa-marco` *(pred.)* · `papa-giancarlo` · `papa-francesco` · `papa-andrea` · `papa-luca` · `papa-paolo` · `papa-stefano` · `papa-davide` · `papa-claudio` · `papa-federico` |
| mamma | `mamma-giulia` *(pred.)* · `mamma-anna` · `mamma-chiara` · `mamma-nicoletta` · `mamma-laura` · `mamma-elena` · `mamma-silvia` · `mamma-francesca` |
| figlia | `figlia-emma` *(pred.)* · `figlia-sofia` · `figlia-alice` · `figlia-giorgia` · `figlia-martina` · `figlia-sara` · `figlia-chiara` · `figlia-beatrice` |
| figlio | `figlio-tommaso` *(pred.)* · `figlio-leo` · `figlio-marco` · `figlio-giorgio` · `figlio-matteo` · `figlio-lorenzo` · `figlio-simone` · `figlio-filippo` · `figlio-claudio` · `figlio-federico` · `figlio-paolo` |
| cognome | `cognome-costa` *(pred.)* · `cognome-rossi` · `cognome-bianchi` · `cognome-ferrari` · `cognome-ferrario` · `cognome-russo` · `cognome-marino` · `cognome-barberis` · `cognome-ambruosi` |
| età figlia | `eta-12` … `eta-17`, predefinito `eta-16` |
| età figlio | `eta-4` … `eta-11`, predefinito `eta-8` |
| partenza | `orig-mondovi` *(pred.)* · `orig-torino` · `orig-milano` · `orig-roma` · `orig-napoli` · `orig-palermo` · `orig-lugano` · `orig-nizza` |

**Le destinazioni non compaiono:** questo episodio non le usa.

⚠️ **Dipendenza:** gli id vivono in `data/it/tabelle-personalizzazione.json`, che **non esiste
ancora** — oggi le tabelle stanno in `APP_CONFIG`. Questo elenco è scrivibile solo dopo che il
magazzino è stato creato.

---

## NOTE DI SCRITTURA

1. **Adulti e ragazzi parlano diverso.** Papà e mamma "Hello" e "I am", i figli "Hi" e "I'm".
   Una sola distinzione di registro che spiega due differenze, e rispetta la regola della forma
   estesa prima della contratta.

2. **Le due forme dell'età.** La figlia "I'm sixteen years old", il figlio "I'm ten". La seconda
   previene l'errore classico: chi conosce solo quella, al ristorante risponderà "we are three"
   alla domanda "quanti siete", dicendo di avere tre anni.

3. **I numeri si scrivono in lettere.** `sixteen`, non `16`: è la parola che l'episodio
   grammaticale dei numeri insegna, e in Voice Practice va pronunciata. *Nella schermata di
   personalizzazione invece si sceglie la cifra: è più veloce da leggere in un elenco. Due usi,
   non una duplicazione.*

4. **Cosa è stato tolto.** *"Can you introduce yourselves?"* — riflessivo con accento anomalo,
   la frase più difficile, serviva solo da innesco. *Il genitivo sassone* ("I'm {papà}'s wife")
   — struttura ostica; chi è la moglie di chi si capisce dalla scena. *"Everyone"* — parola
   lunga e poco utile all'inizio.

5. **Il personaggio si chiama "Hostess al gate"**, non "Guida": i nomi descrivono, non
   etichettano. *Nell'episodio successivo è "Hostess alla porta dell'aereo".*

6. **Perché l'episodio è stato diviso.** La versione a 12 battute aveva 21 parole nuove tutte
   insieme — troppe per chi parte da zero, senza niente di pregresso su cui appoggiarsi. E il
   grado B con sole 6 voci aveva quattro moduli che ci insistevano sopra, rendendoli ripetitivi.
   Le ultime tre battute sono diventate il nucleo dell'episodio successivo, che le riprende
   dentro una scena propria.

7. **Nove battute, e la checklist ne chiede dieci.** Non è una violazione: **quella regola vale
   per un episodio scritto da zero**, e questo è nato a dodici ed è stato diviso. Il pezzo tolto
   non è andato perso, è andato nell'episodio successivo. *Eccezione dichiarata.*

8. **`the` è già in circolazione, dentro un chunk.** `We are the {cognome} family` contiene
   l'articolo senza che nessuno l'abbia aperto — campanello della regola 4.6. **Si lascia come
   chunk**, imparato intero: quella battuta è il cuore dell'episodio e il primo episodio ha già
   abbastanza regole. `the` si aprirà con la sua scheda, poco dopo, che potrà usare questa
   battuta come esempio già noto.

9. **La premessa della storia è "la tua famiglia parte per una vacanza"**, non "una famiglia
   italiana": il paese di partenza è personalizzabile.
