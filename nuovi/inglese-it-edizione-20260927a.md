**Versione: 20260927a**

# L'edizione — inglese per italiani

> **Questo è il file RAGIONI dell'edizione: perché una cosa è così, cosa è aperto, cosa manca.**
> *I DATI stanno in **cinque** file che Claude Code legge — `inglese-it-struttura-corso`,
> `inglese-it-tabelle-personalizzazione`, `inglese-it-istruzioni-moduli`,
> `inglese-it-messaggi-feedback` e un file per episodio. **Qui non si ripete nessun dato.***
>
> ⚠️ **Gli ultimi due sono nati il 2026-09-26, e prima non esistevano:** *i testi che lo studente
> legge dentro i moduli — 208 istruzioni e 141 messaggi di esito — **non avevano nessuna fonte
> markdown**, e nessuno li aveva mai riletti.*
>
> ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola master 1.5).

---

## COME È FATTO

| Parte | Cosa c'è |
|---|---|
| **1 — L'edizione** | la trama, la rotta, i tratti, la promessa del corso, e **cosa produce un tratto** |
| **2 — Il metodo** | come si scrive un episodio: la cipolla, gli undici passi, la checklist, le regole di scrittura |
| **3 — I TABELLONI** | **nove tabelle, e sono la fonte**: episodi, rotta, situazioni, schede, regole, trappole, pronuncia, personaggi, **i modi del posto** |
| **4 — Gli episodi scritti** | la scena, le note di scrittura, i contenuti video e social di ciascuno |
| **5 — Lavori aperti** | quello che tocca a noi, e quello che tocca a Claude Code |

---

## COME SI LEGGE UN TABELLONE — i tre livelli

**Il 2026-09-26 abbiamo smesso di tenere le informazioni in paragrafi sparsi e le abbiamo messe in
tabelle.** *Il motivo è che i paragrafi non si rileggono mai: quello che è scritto in prosa dentro
una sezione di grammatica non lo trova chi sta scrivendo un episodio.*

| Livello | Cosa c'è | Chi lo scrive |
|---|---|---|
| **0** | **le battute** — `d-1` … `d-9` di ogni episodio | il dialogo, ed è **l'unico fatto** |
| **1** | **i tabelloni per tipo** — ogni riga punta a delle battute | noi |
| **2** | **la riga dell'episodio** — conta e basta: `11·7·9·9`, 8 skill | si ricava |

⚠️ **LA REGOLA CHE NE DISCENDE, ED È VERIFICABILE: ogni riga di ogni tabellone deve poter puntare a
una battuta.** *Se non ci riesce, o è una cosa **non ancora usata** — e la prima colonna vuota è la
lista da cui pescare — oppure è sbagliata e non c'entra niente.* **Non esiste un terzo caso.**

⚠️ **E UN TABELLONE È LA FONTE, NON UN INDICE.** *Non c'è nessuna colonna «dove è descritta»: il
contenuto sta nella riga. Una riga che rimanda altrove riporta il progetto al punto di partenza —
dieci file che nessuno rilegge.*

⚠️ **E LO STESSO GIORNO È ARRIVATA LA PROVA CHE SERVIVA, da tutt'altra parte.** *Il 2026-09-26 sono
state trovate quindici frasi scritte per Speed Match che nessuno studente ha mai visto. **Erano già
state trovate una volta**, scritte alla lettera in `docs/validazione.md` — e quel documento è finito
in archivio, giustamente, perché descriveva un file che non esiste più.*

> **UN FATTO CHE VIVE SOLO DENTRO UN DOCUMENTO MUORE COL DOCUMENTO.**
>
> *Prima di archiviare, i fatti ancora veri si estraggono — **e si estraggono in una TABELLA, non in
> un altro documento**, altrimenti si sposta soltanto la data in cui si perderanno.*

**I tabelloni si citano fra loro per id, e quello va bene:** è una chiave di collegamento fra due
tabelle, non un rimando a un paragrafo.

---

## GLI ID — descrittivi, mai numerati

**Ogni riga di ogni tabellone ha un id, e serve per collegarla da fuori** — un report che dice allo
studente quale regola ha imparato, un episodio che dichiara quale scheda gli serve.

⚠️ **NON SONO NUMERATI, E IL MOTIVO È COSTATO CARO.** *Claude Code aveva messo `a-1`, `a-2` nelle
voci del grado A: bastava inserire una parola per far migrare il colore di padronanza da una voce
all'altra. Sono diventati `a-hello`, `a-hi`.* **Un id numerato che qualcuno riordina non dà errore:
punta alla riga sbagliata in silenzio.**

| Prefisso | Tabellone |
|---|---|
| *nessuno* | gli episodi — `gate`, `aircraft-door` |
| `V-` | la rotta — `V-cina`, `V-londra` |
| `O-` | le situazioni — `O-presentarsi` |
| `S-` | le schede grammaticali — `S-essere-aff` |
| `R-` | le regole della lingua — `R-you` |
| `T-` | le trappole — `T-mark` |
| `P-` | la pronuncia — `P-accento` |
| *chiave* | i personaggi — `papa`, `hostess-gate` *(già id nel JSON)* |
| `W-` | le regole di scrittura — `W-matrice-unica` |
| `Vd-` | la checklist di validazione — `Vd-dieci-battute` |

---

## I CODICI DELLE AFFERMAZIONI

**Un codice — `GATE_014`, `METODO_001` — è il nome di una frase**, e serve per richiamarla in chat
senza ricopiarla: *«la `METODO_009` è ancora vera?»*.

⚠️ **UN CODICE SOPRAVVIVE SOLO SULLA PROSA CHE RESTA PROSA.** *Una frase che diventa una riga di
tabellone ha già un nome — l'id della riga — che dice anche di cosa parla. Il codice muore con il
paragrafo.* **Per questo i codici `INVENTARIO_048`–`_074` non esistono più: erano la vecchia sezione
delle regole della lingua, che adesso è il tabellone 3.5.**

**I codici che restano tengono il prefisso di dove sono nati e non si rinumerano.**

---
---

# PARTE 1 — L'EDIZIONE

## 1.1 — LA TRAMA

**EDIZIONE_001** · **La famiglia parte dall'Italia e va in Cina.** *L'inglese è credibile perché è la
lingua in cui si capiscono stranieri e cinesi — e i personaggi lo parlano **con l'accento del
posto**.*

**EDIZIONE_002** · **Gli accenti dicono dove si è:** *scalo a Francoforte e l'inglese ha l'accento
tedesco; dieci episodi a Dublino e diventa irlandese.* **Lo studente sa dov'è senza che nessuno
glielo dica** — *ed è vero: nel mondo l'inglese lo parlano soprattutto i non madrelingua.*

**EDIZIONE_003** · ⚠️ **Alla fine del B2 la famiglia torna a casa:** *«abbiamo imparato l'inglese — e
se l'anno prossimo imparassimo un'altra lingua?».* **La fine di un corso vende il successivo**, e lo
spagnolo gira i paesi dove si parla spagnolo.

**EDIZIONE_004** · **Le quattro cautele:**

| | |
|---|---|
| La scena resta credibile | *in Cina l'inglese in aeroporto e in hotel, meno al mercato* |
| L'accento cresce | **leggero in A1**, più marcato salendo: in A1 lo studente è fragile |
| Le voci | *gli accenti dipendono dalle voci disponibili — **da verificare prima di prometterli*** |
| Chi comincia da un'altra edizione | **trova una storia che sta in piedi da sola**: il viaggio precedente è un richiamo, non un requisito |

**EDIZIONE_005** · **Le destinazioni sono tre città** — *Pechino, Shanghai, Hong Kong.* **I criteri
stanno nella regola `W-citta-non-nazioni` e nelle due che la seguono** (parte 2.10). *Le altre città
della Cina non sono una scelta: **sono il viaggio**, e stanno nel tabellone della rotta.*

**EDIZIONE_013** · ⚠️ **NUOVO — la trama ha un personaggio ricorrente, e non è una persona: è un
ruolo.** *Un madrelingua che vive a Londra, incontrato in Cina, che invita la famiglia ad andarlo a
trovare.* **È il motivo per cui il viaggio continua dopo la Cina, e porta il primo madrelingua del
corso** — un gradino didattico vero: fino a lì lo studente ha sentito solo inglese di non
madrelingua.

**EDIZIONE_014** · ⚠️ **Perché «ruolo» e non «persona»: la trama resta uguale in tutte le edizioni,
e le scene hanno gli stessi id.** *Scritto come «un amico inglese», lo spagnolo non sa cosa copiare.
Scritto come «l'amico madrelingua che invita», Madrid o Buenos Aires lo riempiono con qualcuno loro.*

**EDIZIONE_015** · **Non lo si incontra sull'aereo:** *`seat-neighbour` è già il picco dell'A1,
l'unico estraneo con cui si parla. Metterci accanto un secondo personaggio importante indebolisce
tutti e due.* **Lo si incontra in Cina** — *e lì l'incontro ha già un senso suo: due stranieri che
parlano inglese fra loro, che è la premessa dell'edizione.*

---

## 1.2 — I TRATTI E LA PROGRESSIONE

**EDIZIONE-TRATTI_007** · **Un tratto è un'etichetta su un pezzo di sequenza, non una proprietà
dell'episodio.** *Un episodio non «è» A1.2: sta in un tratto che si chiama così. Se lo sposti cambia
tratto, ed è giusto — il tratto dice **a che punto sei**, non **cosa sei**.*

**EDIZIONE-TRATTI_008** · *È la ragione per cui il livello non compare nel nome dei file.*

**EDIZIONE_006** · **La stagione è A1, e A1.1 e A1.2 sono tratti dentro la stagione.**

**EDIZIONE_025** · ⚠️ **DECISO IL 2026-09-26 — allo studente il tratto si presenta col NOME, non col
livello.** *Il primo si chiama **«Il decollo»**, il secondo **«L'atterraggio»**.*

**EDIZIONE_026** · **Il motivo sta nella promessa del corso:** *«non vogliamo venderti un certificato,
un livello».* ⚠️ **Aprire con «A1.1» contraddice in tre caratteri la frase che apre il corso.**

**EDIZIONE_027** · **Ma il livello non si nasconde: sta nel report, in piccolo.** *Un livello serve —
per un colloquio, per un modulo da compilare — e negarlo sarebbe una posa.* **Non è quello che
vendiamo, è una conseguenza di quello che vendiamo.**

**EDIZIONE_028** · **E il nome del tratto è anche il titolo del podcast**, che è il tratto intero
(`METODO_041`). *Un podcast che si chiama «A1.1» non lo scarica nessuno.*

**EDIZIONE_007** · **Gli episodi crescono per tipo di scambio, non solo per argomento.** *La
progressione sta nel tabellone degli episodi, colonna «tipo di scambio».*

**EDIZIONE_008** · ⭐ **`seat-neighbour` è il picco:** *l'unico dove lo studente parla con qualcuno che
non è la sua famiglia.*

**EDIZIONE_012** · **I due episodi di grammatica stanno prima di `gate`:** *`gate` usa `I am`, `we
are` e le età — senza il verbo essere e i numeri comparirebbero senza che nessuna scheda le abbia
aperte* (regola 1.1).

---

## 1.3 — PERCHÉ IL VIAGGIO, E PERCHÉ IN AEREO

**METODO_001** · **In Italia la famiglia parla italiano** — al desk, coi parenti, fra loro.
**L'inglese comincia dove comincia davvero: al gate**, quando incontrano il personale di bordo.
⚠️ **CORRETTO IL 2026-09-26:** *qui c'era «il personale di una **compagnia cinese**», e contraddiceva
`EDIZIONE_018`.* **L'equipaggio è locale alla rotta, la compagnia no.**

**EDIZIONE_018** · ⚠️ **PRETTE AIRLINES È LA COMPAGNIA DI CASA, IN TUTTE LE EDIZIONI E IN TUTTA
L'APP.** *Il nome tiene insieme due cose: **ti porto in questo viaggio** e **ti porto a studiare
l'inglese**.* **E una compagnia inventata toglie ogni problema di marchi altrui.**

**EDIZIONE_019** · **Ne discende che la compagnia non ha una nazionalità, e non può averla:** *le
scene hanno gli stessi id in tutte le edizioni, e in quella spagnola la famiglia vola a Madrid.*
**L'accento viene dall'equipaggio, che è locale alla rotta** — *cinese su questo volo.*

**METODO_002** · *Questo risolve una cosa che nessun corso affronta:* **perché questi personaggi
parlano inglese.** *Non è una convenzione da accettare: è la situazione.*

**METODO_003** · ⚠️ **E risolve il problema per cui il metodo esiste:** *«è un mese che studio e al
primo volo non capisco nulla».* **Studiare parole e regole non prepara a un aereo. Studiare quello
che succede in aereo sì.**

**METODO_004** · ⚠️ **La difficoltà sale con la posta in gioco, non con la grammatica.** *Al gate ti
presenti e se sbagli non succede niente; al controllo passaporti no.* **È una progressione più
naturale di quella per tempi verbali — ed è emersa dalle situazioni, non è stata imposta.**

**METODO_005** · **Il quarto episodio è il primo riuso vero:** *il vicino chiede le stesse cose
dell'hostess, in un contesto informale.* ⚠️ **Se lo studente sa presentarsi all'hostess ma non al
vicino, non ha imparato a presentarsi: ha imparato una scena.** *Ed è il punto in cui `Hi` e `Hello`
prendono senso.*

*Le dieci scene del volo stanno nel tabellone degli episodi. Poi la città: il bar, il ristorante, il
mercato, i mezzi, l'hotel.*

### Il taglio dei tratti — un criterio che si verifica

**METODO_006** · ⚠️ **Il podcast di un tratto deve stare in piedi come racconto.** *Se leggendo di
fila i dieci episodi esce una storia con un inizio, uno svolgimento e una chiusura, il taglio è nel
posto giusto. Se si interrompe a metà di una situazione, il confine è sbagliato.*

**METODO_007** · *Il criterio vecchio — «il taglio cade dove si formano i gruppi naturali della
griglia» — era vero ma astratto.* **I due non si contraddicono:** *una scena finita è una scena in
cui i personaggi hanno detto tutto quello che dovevano.*

**METODO_008** · **Coi primi dieci episodi il test passa:** *si parte, ci si imbarca, ci si siede, si
conosce qualcuno, si decolla.* ⚠️ **CORRETTO IL 2026-09-26:** *qui c'era «dal gate al bagaglio
perduto», ed era scritto prima che gli episodi di grammatica entrassero nella sequenza.* **Dieci
episodi coprono cinque scene, non dieci** — `REGISTRO-EPISODI_034`. *E il podcast del primo tratto
non è «il viaggio»: è **il decollo**.*

---

## 1.4 — `benvenuto` E LA PROMESSA DEL CORSO

**EDIZIONE_009** · **Per ora serve solo lo spazio:** *un modulo solo, un testo qualunque, il pulsante
in fondo sempre verde.*

**EDIZIONE_010** · **Cosa conterrà:** *come funziona una serie — episodi, moduli, ripetizioni, quiz,
**il metodo PRETTE**, perché si torna sulle stesse cose — e come funziona l'app: i tasti, la mappa,
Help, Spiegazione, i report.*

**EDIZIONE_011** · ⚠️ **Perché esiste:** *senza, il corso comincia con una tabella di coniugazione —
esattamente la cosa che il metodo dice di non fare.* **Con `benvenuto` prima si dice cosa sta per
succedere**, e i due episodi di grammatica diventano «le fondamenta» invece di «la prima cosa».

### Il testo della promessa

**EDIZIONE_016** · **Questo è il testo, e va detto per primo:**

> **Questo corso è un po' diverso da quelli che trovi in giro.**
>
> Non è click, click, avanti, avanti.
>
> Qui non ti insegniamo a passare un test: ti insegniamo a **districarti nella vita vera** — quello
> che ti serve davvero.
>
> Un certificato e un livello servono, e non diciamo il contrario. Ma non servono **quando sei lì**:
> davanti a una persona che ti parla e aspetta che tu risponda.
>
> **Il nostro obiettivo è uno: che il giorno in cui ti servirà l'inglese, tu capisca — e sappia
> rispondere.**

**EDIZIONE_017** · ⚠️ **E la promessa ha due righe del tabellone che la mantengono:** *`O-istruzioni`
e `O-assistenza`, le due situazioni trasversali.* **Non è una dichiarazione d'intenti: è la ragione
per cui quelle due righe esistono.**

---

## 1.5 — ⭐ COSA PRODUCE UN TRATTO

> ⚠️ **QUESTA SEZIONE SERVE ALLA GESTIONE DEI PROGETTI, NON ALLA SCRITTURA DEGLI EPISODI.**
> *Un tratto non produce solo dieci episodi nell'app: produce cinque cose, tutte dal medesimo
> contenuto, e tre di quelle si vendono o si pubblicano fuori dall'app.*

| # | Prodotto | Da cosa nasce | Quando si può fare | Stato |
|---|---|---|---|---|
| 1 | **La storia in italiano** | le dieci scene del tratto, in fila | *appena i dieci episodi esistono* | · |
| 2 | **La storia in inglese**, sbloccata alla fine del tratto | gli stessi dieci dialoghi | idem | · |
| 3 | **L'ebook bilingue** | 1 + 2 affiancate | idem | · |
| 4 | **Il podcast** | ⚠️ **il tratto intero, non il singolo episodio** | *a tratto chiuso* | · |
| 5 | **I video social** — uno per skill | il corpo di ogni skill | *episodio per episodio, subito* | · |
| 6 | ⚠️ **NUOVO — il video di apertura dell'episodio**, 10 secondi, generato con AI | la scena e le battute | *serve prima l'aspetto dei personaggi* | 🔴 **manca il modulo di apertura** |

### Le ragioni

**METODO_009** · **Cinque prodotti dallo stesso contenuto, e non è riciclo: è il motivo per cui la
scena si scrive bene una volta sola.** *Scrivere «cosa succede» in prosa costa mezz'ora e paga sei
volte.*

**METODO_041** · ⚠️ **Il podcast è il tratto, non l'episodio, e la ragione è la durata:** *un
episodio A1 dura un minuto. Dieci fanno una serie.* **Per questo il taglio dei tratti si verifica
col criterio del racconto** (`METODO_006`): *se il podcast non sta in piedi, il tratto è tagliato
male.*

**METODO_042** · ⚠️ **Il video di apertura ha una dipendenza che va saputa adesso: l'aspetto dei
personaggi.** *Se un'AI genera dieci secondi di scena senza una descrizione fissa, la stessa hostess
cambia faccia a ogni episodio — ed è un errore di continuità che lo studente **vede**.* **Per questo
l'aspetto è una colonna del tabellone dei personaggi e non una nota dentro l'episodio:** *scritto
nell'episodio si duplicherebbe, e alla terza copia divergerebbe.*

**METODO_043** · ⚠️ **È anche la ragione tecnica per cui `hostess-gate` e `hostess-porta` sono due
persone e non una.** *Al gate e alla porta, nella realtà, sono due mestieri diversi — e nel video si
vedrebbe.*

**METODO_044** · **Quale software per il video si decide quando si fa il modulo**, non adesso: *è un
campo che si muove in fretta, e una scelta fatta oggi sarebbe vecchia domani.* **Da fare allora: una
ricerca vera, non una raccomandazione a memoria.**

---
---

# PARTE 2 — IL METODO

## 2.0 — NOMENCLATURA E ORDINE DI PROGETTAZIONE

**METODO_010** · **I nomi delle cose, e sono sempre questi:**

| Cosa | Nome |
|---|---|
| quello che lo studente deve saper dire | **strutture grammaticali** |
| il contesto di vita reale | **situazioni** |
| una scena della storia | **episodio** |
| il testo di un episodio | **dialogo** |
| la difficoltà dentro l'episodio | **gradi** — A, B, C, D |
| la progressione CEFR | **livelli** — A1, A1.1, A2… |

**METODO_011** · **La cipolla — l'ordine in cui si progetta:** *strutture → taglio dei livelli →
la trama → le situazioni → gli episodi → il dialogo → i gradi e le skill → il JSON.*

**METODO_012** · **Regola «un livello avanti»:** *si progettano i primi tre strati di **due**
livelli, se ne produce **uno**.*

---

## 2.1 — COME SI LAVORA UNA STRUTTURA

*Spostato qui il 2026-09-26: era la sezione 3.1, e non erano schede — era metodo.*

**INVENTARIO_008** · **Una struttura si spezza in schede solo quando serve**, non tutte insieme. *Una
griglia progettata tutta in anticipo resta ferma: nessuno la usa.*

**INVENTARIO_009** · **Una scheda è quello che si spiega una volta sola e poi si esercita.** *Se nella
spiegazione devi dire «e poi c'è anche il caso in cui…», sono due schede.* **Ma non si spezza oltre
il necessario:** *schede troppo piccole lasciano gli esercizi senza materiale.*

**INVENTARIO_010** · **Gli esempi si prendono dalla nostra storia, non da un manuale.** *Scrivendoli
dentro il mondo della famiglia, l'episodio giusto emerge da solo.*

**INVENTARIO_011** · **Gli esercizi si accumulano lungo la serie** (regola 4.9): *la scheda 2 esercita
anche la 1; l'ultima esercita la struttura intera, ed è il double-check.*

**INVENTARIO_012** · **Ogni scheda porta scritto il perché**, in corsivo.

### I criteri di cosa entra in A1

*Spostato qui il 2026-09-26: era la sezione 3.7.*

**METODO_037** · **Una struttura entra in A1 se serve a fare qualcosa nel viaggio** — *non perché
«compare nelle liste standard».*

**METODO_038** · **Il CEFR non prescrive grammatica:** *descrive cosa uno sa fare.* ⚠️ **Le liste
grammaticali A1 che circolano sono interpretazioni di scuole ed editori, non uno standard.**
*Quindi l'inventario è una decisione nostra, motivata.*

**METODO_039** · **La griglia si fa PRIMA di scrivere gli episodi** (regola master 1.1). *Una
versione precedente diceva il contrario:* ⚠️ **era l'ordine invertito, e se la griglia si ricava
dagli episodi è il dialogo a decidere cosa si insegna.**

**METODO_040** · ⚠️ **L'avvertimento:** *se le schede diventano troppo fitte, la storia si piega a
servirle e torna a essere un manuale travestito.* **La protezione è il principio graduale, non
granulare** — *e quante schede servano non lo decide il numero di episodi, né viceversa.*

**INVENTARIO_076** · ⚠️ **La verifica contro fonti certe:** *il CEFR descrive cosa uno sa fare, non
quali strutture servono; le liste A1 sono interpretazioni di editori.* **La fonte è il Cambridge
English Grammar Profile**, basato su un corpus di studenti reali. **Si fa con tre episodi scritti.**

---

## 2.2 — IL WORKFLOW: SCRIVERE UN DIALOGO IN UNDICI PASSI

**METODO_013** · **Ogni passo si chiude prima di aprire il successivo.** ⚠️ **Il passo 4 è un
cancello:** *tutto quello che viene dopo dipende dal testo esatto delle battute — se il dialogo
cambia dopo, si rifà tutto.*

**METODO_014** · *Il criterio che tiene insieme il metodo:* **se un lavoro va sempre avanti ha una
fine; se torna indietro è infinito.**

| # | Passo |
|---|---|
| 1 | **La scena** — cosa succede, chi parla, dove. *Nessuna parola inglese ancora* |
| 2 | **Le strutture da insegnare** — *dal tabellone delle schede, non dall'ispirazione* |
| 3 | **Il dialogo in inglese** |
| 4 | ⚠️ **Validazione** — la checklist punto per punto. *Se qualcosa non torna, si torna al 3* |
| 5 | **Le note di scrittura** |
| 6 | **Le traduzioni italiane** |
| 7 | **Le skill** — *vengono in gran parte dalle note del passo 5* |
| 8 | **I gradi**, per sottrazione |
| 9 | **Il vocabolario** — traduzione, pronuncia, categoria |
| 10 | **Gli slot di personalizzazione** |
| 11 | **Il JSON** |

---

## 2.3 — LA CHECKLIST DI VALIDAZIONE — passo 4

**METODO_015** · ⚠️ **La checklist CRESCE:** *ogni volta che un problema emerge scrivendo un dialogo,
diventa una riga in più.* **Per questo è una tabella e non un elenco numerato a mano.**

| id | Domanda | Nata da |
|---|---|---|
| `Vd-dieci-battute` | Ha almeno dieci battute? | *sotto, i gradi C e D non hanno materiale* |
| `Vd-due-volte` | Ogni struttura nuova compare due volte con lo stesso significato? | *una volta insegna una formula, due volte un concetto* |
| `Vd-forme-simili` | Ci sono forme simili con significati diversi troppo vicine? | `you` = tu e voi, in `gate` |
| `Vd-contrazioni` | Le contrazioni compaiono solo dopo la forma estesa? | `I am` / `I'm` |
| `Vd-martello` | Le parole target tornano più volte dentro il dialogo? | · |
| `Vd-livello` | Ci sono strutture che appartengono a un livello successivo? | `they` in `aircraft-door` |
| `Vd-annotate` | Le scelte di scrittura sono annotate? | *sono il materiale delle skill* |
| `Vd-skill` | Quali battute meritano una skill? | · |

---

## 2.4 — REGOLE PER I DIALOGHI

**METODO_016** · **Minimo dieci battute.** ⚠️ *Eccezione dichiarata: `gate` e `aircraft-door` ne
hanno nove.*

**METODO_017** · **Ripetere sì, consecutivamente no.**

**METODO_018** · ⚠️ **Quando la distanza è obbligatoria: se la stessa forma cambia significato.**
*`you` prima «tu» e poi «voi» è il caso tipico. Attaccate, la differenza passa inosservata;
distanziate e con la scena che chiarisce, si vede.*

**METODO_019** · **Le contrazioni solo dopo la forma estesa.** *In `gate` la soluzione è narrativa:
gli adulti parlano per esteso, i ragazzi contraggono — **una distinzione sola che spiega due
differenze**.*

**METODO_020** · **Il martello comincia dalla sceneggiatura:** *le parole target tornano più volte
dentro il dialogo stesso, non solo negli esercizi.*

**METODO_021** · **Niente strutture di livelli successivi.**

**METODO_022** · **Le decisioni di scrittura si annotano.** **E quelle annotazioni sono il materiale
delle skill: non si scrive due volte.**

**METODO_023** · ⚠️ **Il vincolo tecnico diventa contenuto didattico.** *Quando un limite
dell'implementazione costringe a restringere una scelta, quel limite diventa una lezione futura
invece di essere subito come una perdita.* **Caso fondativo:** *le destinazioni, e la lezione sulle
preposizioni che ne nascerà — `T-prep-paesi`.*

---

## 2.5 — REGOLE PER LE SKILL

**METODO_024** · ⚠️ **Se introduciamo qualcosa di nuovo, lo spieghiamo. Sempre.** *Questa regola sta
sopra tutte le altre:* **se entra in conflitto con una regola di economia, vince il nuovo.**

**METODO_025** · **Le skill hanno una difficoltà, e il limite non è un numero fisso:** *un episodio
può averne quattro facili o una difficile.*

**METODO_026** · **Una spiegazione difficile si scrive con parole facili e già incontrate.**

**METODO_027** · **Mai anticipare, sempre collegare.** *Una spiegazione non usa strutture non ancora
incontrate — sarebbe spiegare l'ignoto con l'ignoto — **ma deve agganciarsi a qualcosa di già
noto**.*

**METODO_028** · **Quando due forme sono entrambe corrette, dirlo esplicitamente.**

**METODO_029** · ⚠️ **Nessuna struttura resta non spiegata.** *Se si decide di non spiegare qualcosa
che compare, va dichiarata **rimandata** e spiegata nell'episodio successivo.* **Mai lasciata in
sospeso senza data.**

**METODO_045** · ⚠️ **E questa regola ha una forma verificabile nei tabelloni: la colonna «spiegata
in» ha tre stati.**

| Cosa c'è scritto | Vuol dire |
|---|---|
| `gate`, skill `d-8` | ✅ fatto |
| ⚠️ rimandata a `nomi-propri` | **c'è un piano** |
| 🔴 **nessuno** | **debito senza data — è questo che non deve esistere** |

*A dieci episodi la domanda «cosa manca» diventa: filtra le righe rosse.*

**METODO_030** · **La scheda grammaticale arriva dopo, mai prima.** ⚠️ **Se un argomento non è mai
comparso in un dialogo, non merita un modulo di grammatica — merita un dialogo.**

---

## 2.6 — COME SI FORMANO I GRADI: PER SOTTRAZIONE

**METODO_031** · *Quattro passi:*

1. **Si estrae tutto** dal dialogo: ogni parola, ogni chunk, ogni frase, ogni battuta. *Nessun
   filtro.*
2. **Si toglie quello già insegnato**, e ogni esclusione si annota con l'episodio in cui era
   comparsa.
3. **Quello che resta si distribuisce nei gradi.**
4. **Ogni scelta si annota**, comprese le esclusioni.

**METODO_032** · ⚠️ *Il metodo rende **impossibile duplicare** (il passo 3 lo verifica) e
**impossibile saltare** (il passo 1 parte da tutto).*

**METODO_033** · **Tutto scritto, mai calcolato.** ⚠️ **Con la personalizzazione attiva, una formula
darebbe a ogni studente una matrice diversa.**

---

## 2.7 — IL GIRO DELLE MODIFICHE A UN EPISODIO

**METODO_034** · *Quattro passi:* **si decide in chat → si aggiorna il file dell'episodio → si carica
nel repository → una riga a Claude Code.**

**METODO_035** · ⚠️ **La richiesta non è mai secca: si dichiarano i numeri attesi.** **Si copia la
forma della richiesta, mai i numeri.**

**METODO_036** · *Il numero atteso è **la rete che intercetta quello che si perde nel passaggio**.*

---

## 2.8 — DOVE VA CIÒ CHE SI SCRIVE DI UN EPISODIO

**REGISTRO-EPISODI_004** · ⚠️ **Un episodio si scrive in DUE posti, e non è una duplicazione:**

| | File | Chi lo legge | Cosa ci sta |
|---|---|---|---|
| **DATI** | `inglese-it-{id}.md` | **Claude Code e un test** | le otto sezioni del modello: numeri attesi, regola generale, matrice, skill, personaggi, slot, tabelle interne |
| **RAGIONI** | **la parte 4 di questo file** | noi | la scena, le note di scrittura, i contenuti video e social |

**REGISTRO-EPISODI_029** · ⚠️ **NUOVO — e quello che PRIMA stava nelle ragioni dell'episodio adesso
sta nei tabelloni.** *«Cosa insegna» e «regole in sospeso» erano paragrafi dentro la sezione
dell'episodio: adesso sono righe nei tabelloni delle regole, delle schede, delle trappole e della
pronuncia.* **Nella parte 4 resta solo quello che è dell'episodio e di nessun altro.**

**REGISTRO-EPISODI_005** · **La forma del file DATI non si inventa:** *sta in
`nuovi/inglese-it-EPISODIO-VUOTO.md`, che è il modello.* ⚠️ **I titoli delle sue sezioni sono
un'interfaccia — un parser li cerca per testo esatto.**

**REGISTRO-EPISODI_024** · **Nella parte 4 ogni episodio ha sempre queste voci, in quest'ordine:**
*La scena · Note di scrittura · Contenuti video · Contenuti social.* **Se una non ha niente, si
scrive un punto `·`** — *così si vede che non è stata dimenticata.*

**REGISTRO-EPISODI_006** · **La prima riga di ogni file è la versione, e solo quella.** *Nella chat il
nome del file porta la versione; nel repository no — la versione si toglie prima di caricare, perché
test e rimandi leggono i file per nome.*

**REGISTRO-EPISODI_022** · **Il nome mostrato e la categoria di un episodio vivono in
`inglese-it-struttura-corso`**, tabella degli episodi. *Il file DATI li cita, non li ripete.*
Categorie: **`storia`**, **`grammatica`**, **`pronuncia`**, e dal 2026-09-27 **`grammatica-locale`** e
**`slang`**.

**REGISTRO-EPISODI_040** · ⚠️ **NUOVO — le due categorie del posto, e la differenza fra loro è
didattica, non di correttezza:**

| Categoria | Cosa insegna | Cosa deve saperne fare lo studente |
|---|---|---|
| **`grammatica-locale`** | *grammatica corretta, ma di un posto:* `vos hablás` · `ustedes` contro `vosotros` | **capirla** — e usarla se vive lì |
| **`slang`** | *parole informali di un posto:* il lunfardo — `pibe`, `laburo`, `morfar` | **capirla** — ⚠️ **e sapere che non si usa con tutti** |

*Il `voseo` non è «meno corretto»: sta nella RAE. **È di un altro posto**, ed è tutta un'altra cosa.*

**REGISTRO-EPISODI_041** · ⚠️ **E LA PROGRESSIONE NON È UNA GENTILEZZA: È UN REQUISITO.**

| Livello | Cosa arriva dal posto |
|---|---|
| **A1** | **niente**: tutto standard |
| **A2** | *qualche voce locale o slang, **dichiarata in una skill*** |
| **B1** | **gli episodi dedicati** |

*`METODO_030` e `INVENTARIO_074` dicono che un episodio di riordino «non insegna niente di nuovo:
mette in ordine quello che lo studente sa già».* ⚠️ **Senza la semina in A2, l'episodio B1 sul `voseo`
non potrebbe essere un riordino: introdurrebbe da zero, e il metodo lo vieta.**

**REGISTRO-EPISODI_023** · **La scena è anche il testo della pagina di inizio episodio e la base del
video.** *Le idee per video e social si scrivono mentre si scrive l'episodio — non dopo, a memoria.*

---

## 2.9 — LE REGOLE DI SCRITTURA

*Erano diciannove affermazioni numerate di fila nella vecchia sezione 2.7 — già una lista, scritta
come prosa. Qui sono righe, con un id che si può citare.*

### La matrice

| id | Regola | Perché |
|---|---|---|
| `W-matrice-unica` | **Una matrice sola, e i gradi ne discendono.** Il grado D è il dialogo; il resto si ricava per sottrazione | *una fonte sola non può divergere da sé stessa* |
| `W-c-identica` | **Grado C: dove la frase è identica alla battuta si scrive `= dN`** e non si ricopia | *e la colonna «perché differisce» non resta mai vuota: se non differisce, «identica»* |
| `W-b-vs-c` | **B è quello che si produce intero, C quello che si costruisce.** La prova: puoi cambiarci dentro un pezzo e ottenere un'altra frase valida dello stesso tipo? | **non contano la lunghezza né il punto interrogativo** |
| `W-a-da-sola` | **Grado A: un inglese la dice da sola?** Se no, non sta in A: vive nei chunk di B e C | · |
| `W-maiuscole` | **In A e B minuscolo**, tranne dove la lingua la impone. In C e D scrittura normale | · |
| `W-pers-non-in-a` | ⚠️ **NUOVO — un valore personalizzabile non è mai una voce di grado A** | *una parola che solo una parte degli studenti incontra non è una parola dell'episodio. Torna come voce nell'episodio dove i nomi propri o i numeri sono il contenuto* |
| `W-tipo-lingua` | ⚠️ **NUOVO — ogni battuta dichiara il tipo di lingua**, e **nessuna cella resta vuota**: `standard` · `locale` · `slang` | *un vuoto non si distingue da una dimenticanza. **Scritto sempre, anche quando sono tutte `standard`** — che in A1 è ogni riga di ogni episodio* |
| `W-non-standard-ha-skill` | ⚠️ **NUOVO, ED È UN'ASSERZIONE: una battuta `locale` o `slang` DEVE avere una skill attaccata** | *se qualcuno mette un `vos hablás` in un dialogo senza spiegarlo, **la suite diventa rossa**. Non è una buona intenzione: è un controllo che fa una macchina* |

**REGISTRO-EPISODI_030** · ⚠️ **`W-pers-non-in-a` non è nuova nei fatti: la stavamo già seguendo
senza averla scritta.** *Il grado A di `gate` ha undici voci e non contiene `sixteen`, `Marco` né
`Turin` — eppure sono tutte parole del dialogo.* **Il motivo era scritto una volta sola, e solo a
proposito di `Italy`.** *Regge su tutte e undici le righe.*

### Le skill

| id | Regola | Perché |
|---|---|---|
| `W-skill-lista` | Nel JSON il campo è **`whatYouLearn`**, **sempre una lista** anche con una skill sola | *due righe con la stessa battuta sono due skill della stessa battuta* |
| `W-skill-uso` | **Una skill spiega l'uso, non la grammatica.** Può richiamare una struttura già vista, non insegnarla | · |
| `W-segnaposto-lingua` | ⚠️ **Dentro una citazione, un segnaposto dichiara sempre la sua lingua** — `{{chiave:en}}`. Fuori, nella prosa italiana, può tacere | *misurato il 2026-09-24: dei sette segnaposto nelle skill di `gate`, cinque non la dichiaravano e quattro stavano dentro una citazione. **«Non fa danno» non è «è giusto»*** |

### I personaggi

| id | Regola | Perché |
|---|---|---|
| `W-etichette-fonte` | **La colonna «chi» della matrice non è la fonte delle etichette:** la fonte è la tabella dei personaggi del file episodio | · |
| `W-etichetta-contorno` | **L'etichetta porta il contorno: il mestiere più dove sta** — *Hostess al gate, Hostess alla porta, Hostess col carrello* | **anche se in scena ce n'è una sola:** *lo studente non vede un episodio, vede una serie* |
| `W-etichetta-senza-nome` | **Le etichette dei personaggi personalizzabili non portano il nome scelto:** sopra la bolla «Papà», non «Marco» | *il nome sta dentro la battuta, dove lo studente lo impara* |
| `W-nomi-descrittivi` | **I nomi descrivono, non etichettano:** «Hostess al gate», non «Guida» | · |
| `W-tre-apparizioni` | ⚠️ **NUOVO — una apparizione è una comparsa, due sono una coincidenza, tre sono un personaggio.** Dalla terza va nella trama, non solo nella riga dell'episodio | *è la soglia oltre la quale lo studente se lo aspetta* |
| `W-ruolo-non-persona` | ⚠️ **NUOVO — un personaggio ricorrente della trama si scrive come RUOLO**, non come persona | *la trama resta uguale in tutte le edizioni: «un amico inglese» non si può copiare, «l'amico madrelingua che invita» sì* |
| `W-aspetto-nel-personaggio` | ⚠️ **NUOVO — l'aspetto fisico sta nella riga del personaggio, non nell'episodio** | *scritto nell'episodio si duplica, e alla terza copia diverge: la hostess finisce bionda in un file e mora in un altro* |
| `W-accento-personaggio` | ⚠️ **NUOVO — l'accento è del PERSONAGGIO, non della battuta**: una colonna nella tabella dei personaggi | *`hostess-porta` non cambia accento a metà scena. Ripeterlo su ogni riga sarebbe la stessa parola nove volte* |
| `W-famiglia-accento-suo` | ⚠️ **NUOVO — la famiglia parla la lingua straniera con accento italiano**, e si sente | *sono italiani: **lo studente si riconosce nel papà che ha l'accento**, non in un madrelingua perfetto. ⚠️ **L'accento è leggero e le parole restano corrette** — un modello da imitare che sbaglia le parole distruggerebbe Repeat Aloud* |

### La personalizzazione

| id | Regola | Perché |
|---|---|---|
| `W-nessun-alterego` | ⚠️ **NUOVO — nessun personaggio è lo studente.** Chi usa l'app può essere la mamma, il figlio, la figlia o il papà: **si personalizza la FAMIGLIA, non sé stessi** | *`gate` §7 chiamava lo slot «Nome del papà / **utente**», e quella parola diceva il contrario. **Va tolta**: nessun personaggio è privilegiato, e l'aspetto del papà non deve fare concessioni all'identificazione* |
| `W-id-elencati` | **L'episodio elenca gli id che usa, uno per uno** — non «tutti quelli della tabella» | *e si elencano, non si dichiara un intervallo: un intervallo darebbe l'insieme sbagliato senza dare errore* |
| `W-traducibile` | **Nel dialogo i nomi di persona non si traducono mai; i toponimi sì** (Torino → Turin). I cognomi non hanno forma inglese | **è la regola da cui discende la colonna `traducibile` delle tabelle** |
| `W-citta-non-nazioni` | **Le destinazioni sono città, non nazioni** | *la nazione viene con la città, altrimenti gli accenti dei personaggi non tornano col posto* |
| `W-no-articolo` | ⚠️ **Fra le destinazioni non si mettono città con l'articolo nel nome** — Il Cairo, L'Avana, L'Aia | *«andiamo a {destinazione}» produrrebbe «a Il Cairo»* |
| `W-neutro-fra-citta` | ⚠️ **Finché la famiglia è in una delle città a scelta, l'episodio non nomina niente che esista solo in una di esse** | *mercato, ristorante, cinema, piscina, hotel funzionano uguali a Pechino, Shanghai e Hong Kong* |

---

## 2.10 — FILE DA AGGIORNARE QUANDO NASCE UN EPISODIO

**REGISTRO-EPISODI_028** · **Ogni episodio nuovo tocca questi file.** *È la checklist: se uno non è
stato toccato, o l'episodio non ne aveva bisogno — e va detto — o è stato dimenticato.*

| File | Cosa ci si scrive | Chi |
|---|---|---|
| `inglese-it-{id}` | il file DATI dell'episodio, otto sezioni | noi |
| **la parte 3 di questo file** | ⚠️ **la riga dell'episodio, e le righe nuove in ognuno degli altri sette tabelloni** | noi |
| **la parte 3.3** | ⚠️ **la cella «episodio» della situazione che copre** — *dimenticata quando è nato `aircraft-door`* | noi |
| la parte 4 di questo file | la scena, le note, i contenuti video e social | noi |
| `inglese-it-struttura-corso` | la riga nella tabella degli episodi e la posizione in sequenza | noi |
| `inglese-it-tabelle-personalizzazione` | slot o valori nuovi | noi, se serve |
| `data/inglese/it/inglese-it-{id}.json` | la trascrizione | Claude Code |

---
---
---

# PARTE 3 — I TABELLONI

## 3.1 — GLI EPISODI

*Il tabellone principale. In tre blocchi per larghezza: è una tabella sola.*

### ① Cosa è l'episodio — **e l'ordine è la sequenza del primo tratto**

| # | id | Cat. | **Cosa saprai fare** | Situazione | Con chi | Tipo di scambio |
|---|---|---|---|---|---|---|
| 1 | `benvenuto` | — | **Capire come funziona il corso, e cosa ti prometto** | — | — | — |
| 2 | `numeri` | `grammatica` | Riconoscere e dire i numeri da uno a venti, come cifra e come parola | `O-numeri` | — | — |
| 3 | `verb-to-be` | `grammatica` | Dire chi sei, chi sono gli altri, e negarlo | — | — | — |
| 4 | **`gate`** ✅ | `storia` | **Presentarti a qualcuno che non conosci:** dire come ti chiami, di dove vieni, quanti anni hai — e presentare la tua famiglia | `O-presentarsi` | l'hostess al gate | **ti presenti tu** |
| 5 | **`aircraft-door`** ✅ | `storia` | **Farti capire quando ti chiedono i documenti**, presentare chi è con te, e **capire dove ti stanno mandando** senza far ripetere | `O-imbarco` · `O-famiglia` · `O-congedarsi` | l'hostess alla porta | **ti dicono cosa fare** |
| 6 | `seat` | `storia` | Trovare il tuo posto, e dire qualcosa se ci trovi seduto qualcun altro | · | fra voi, e uno sconosciuto | **chiedi qualcosa** |
| 7 | `wh-words` | `grammatica` | Fare una domanda vera: dove, cosa, chi, quando, perché, come | — | — | — |
| 8 | `seat-neighbour` | `storia` | ⭐ **Parlare con uno sconosciuto** che non è della tua famiglia, e reggere la conversazione | `O-presentarsi` · `O-famiglia` | il vicino cinese | ⭐ **conversazione vera** |
| 9 | `before-takeoff` | `storia` | **Capire un'istruzione** e farla, senza dover chiedere | `O-istruzioni` | l'hostess a tutti | **ascolti e basta** |
| 10 | `accento` | `pronuncia` | Sentire dove cade l'accento, e non confondere `thirteen` con `thirty` | · | — | — |

### Perché questa sequenza

**REGISTRO-EPISODI_031** · ⚠️ **`numeri` apre anche `S-plurali`, e il posto è ovvio una volta visto:**
*il plurale regolare arriva col contare — «one year, **two years**».* **Messo lì, l'episodio che lo apre
viene PRIMA di `gate` che lo usa: la riga rossa non diventa un debito, sparisce.**

**REGISTRO-EPISODI_032** · **`wh-words` va prima di `seat-neighbour`, non prima di `gate`.** *`gate` usa
una sola parola interrogativa — `where` — mentre `seat-neighbour` ne userà quattro o cinque: è lì che
serve la famiglia intera.* ⚠️ **E l'inversione non è un debito di `gate`: `verb-to-be` apre già
`S-essere-dom`.** *Quello che `gate` deve è la parola, non la costruzione.*

**REGISTRO-EPISODI_033** · ⚠️ **E `wh-words` promuove `P-wh` da un caso a sei.** *Oggi `where` è
l'unica parola con la `wh` in tutto il corso, e sta fra i fenomeni «con un caso solo». Quell'episodio
porta `what`, `when`, `why`, `who`:* **la regola generale di quel giorno si scrive da sola.**

**REGISTRO-EPISODI_034** · ⚠️ **IL PRIMO TRATTO COPRE CINQUE SCENE, NON DIECI.** *`METODO_008` diceva
«dal gate al bagaglio perduto», ed era scritto prima che gli episodi di grammatica entrassero nella
sequenza.* **Dieci episodi arrivano al decollo** — *e il criterio del racconto passa lo stesso, forse
meglio: si parte, ci si imbarca, ci si siede, si conosce qualcuno, si decolla.* **Il secondo tratto
sono le scene 6-10, dal pasto al bagaglio perduto.**

**REGISTRO-EPISODI_035** · ⚠️ **UN RISCHIO DA TENERE D'OCCHIO: con `benvenuto` più due episodi di
grammatica, lo studente fa tre moduli prima della prima scena vera.** *È esattamente la cosa di cui
`EDIZIONE_011` aveva paura. `benvenuto` la mitiga spiegando cosa sta per succedere — **ma va
verificata al primo test con una persona vera**, non decisa a tavolino.*

⚠️ **`seat`, `seat-neighbour` e `before-takeoff` erano già pianificati in prosa il 2026-09-24 ma NON
erano nell'elenco degli episodi da collocare.** *Per due giorni «quello che resta da fare» non
comprendeva il picco dell'A1. È il tipo di perdita che il tabellone esiste per impedire.*

### ② I conti — si ricavano, non si decidono

| # | id | Richiede | Apre | Voci A·B·C·D | Skill | Pers. | Slot | Regola generale |
|---|---|---|---|---|---|---|---|---|
| 2 | `numeri` | — | `S-numeri-20` · **`S-plurali`** | · | · | · | · | — |
| 3 | `verb-to-be` | — | `S-essere-aff` · `S-essere-dom` · `S-essere-neg` | · | · | · | · | — |
| 4 | `gate` | `S-essere-aff` · `S-numeri-20` | — | **11·7·9·9** | 8 | 6 | 8 | `P-e-muta` — la **`e` finale** ✅ |
| 5 | `aircraft-door` | `S-essere-aff` | — | **12·6·5·9** | 8 | 3 | 1 | ⚠️ **`P-accento`** — *ne ha tre prove sue* |
| 6 | `seat` | `S-numeri-100` | — | · | · | · | · | `P-th` |
| 7 | `wh-words` | `S-essere-dom` | `S-wh-words` · `S-wh-questions` | · | · | · | · | **`P-wh`** — *sei parole in un colpo* |
| 8 | `seat-neighbour` | `S-wh-words` | — | · | · | · | · | `P-h` |
| 9 | `before-takeoff` | — | `S-imperativo` | · | · | · | · | `P-vocali-lunghe` |
| 10 | `accento` | — | ricapitola `P-accento` | · | · | · | · | — |

### ③ Le scene del volo ancora senza episodio

| # | Scena | Cosa si impara | Situazione |
|---|---|---|---|
| 6 | **Il pasto** | cosa vuoi da bere, pollo o pesce, per favore e grazie | `O-ordinare` |
| 7 | **In volo** | turbolenza, restare seduti, chiedere una coperta | `O-assistenza` |
| 8 | **L'arrivo** | atterraggio, saluti, «è stato un bel volo» | `O-congedarsi` |
| 9 | **Il controllo passaporti** | quanto resti, dove alloggi, perché sei qui | `O-dogana` |
| 10 | **Il bagaglio perduto** | descrivere una valigia, dire cosa contiene, lasciare un recapito | `O-dogana` · `O-emergenze` |

### ④ Gli episodi da collocare

*L'ordine si fissa quando si scrivono. Quando un episodio entra in sequenza, passa nella sezione 7 di
`inglese-it-struttura-corso` e qui prende una riga in ①.*

| id | Categoria | Cosa insegna |
|---|---|---|
| `toilet` | `storia` | `excuse me` per far alzare · `sorry` per lo sbaglio. **Episodio corto** |
| `drinks-cart` | `storia` | `S-a-an` — *venti caffè uguali* |
| `taxi` | `storia` | `S-the` — *un taxi solo* |
| `restaurant` | `storia` | `excuse me` per chiamare — *il terzo uso* |
| `hotel-reception` | `storia` | il resto della famiglia: `husband`, `mother`, `father` |
| `nomi-propri` | `grammatica` · apre | `R-nomi` — **dopo il ritiro bagagli o al controllo passaporti**, dove si incontrano nomi veri |
| `gh-muta` | `pronuncia` | `P-gh` — parte da `daughter` e `flight`, apre `night`, `light`, `right` |
| `th` | `pronuncia` | `P-th` — ⚠️ **e parte da `the` di `gate`, non da `thank you`** |
| `saluti` | `grammatica` · riordina | `R-saluti` — *viene dopo* |
| `formule-di-servizio` | `grammatica` · riordina | *viene dopo* |
| `please-1` · `please-2` | `grammatica` · riordina | *i quattro significati di `please`* |
| `articolo-di-troppo` | trappola | `T-articolo` |
| `youre-welcome` | trappola | `T-welcome` |
| `eta-con-avere` | trappola | `T-ho-anni` |
| `preposizioni-paesi` | trappola | `T-prep-paesi` |

---

## 3.2 — LA ROTTA

*Era metà in prosa nella trama e metà in una tabella fra le cose da fare, con le stesse due tappe
scritte due volte.*

| id | Tappa | Come ci si arriva | Accento | `synthesisLang` | Episodi |
|---|---|---|---|---|---|
| `V-cina` | **Pechino · Shanghai · Hong Kong** | in aereo dall'Italia | cinese, **leggero in A1** | `en-US` | `gate` → scena 10 |
| `V-xian` | Xi'an | il treno veloce da Pechino | cinese | `en-US` | · |
| `V-chengdu` | Chengdu | · | cinese | `en-US` | · |
| `V-londra` | **Londra** | ⚠️ **l'invito dell'amico madrelingua** | **britannico — il più difficile, quindi tardi** | `en-GB` | · |
| `V-buenos-aires` | Buenos Aires | *in B2* | · | · | *è la tappa dell'edizione spagnola* |

⚠️ **La colonna «accento» è quella che deciderà quali voci servono**, e le voci disponibili erano già
segnate come «da verificare prima di prometterle». *È la stessa colonna: adesso si vede quante ne
servono.*

**METODO_050** · ⚠️ **`synthesisLang` DEVE diventare per tappa, e oggi è un valore per edizione.**
*Sta nella sezione 8 di `struttura-corso`, uno solo per tutto il corso.* **Se l'accento segue la
rotta, segue questa colonna.**

**METODO_051** · ⭐ **E `recognitionLang` NON la segue: resta lo standard.** *`synthesisLang` è quello
che lo studente **sente**, `recognitionLang` è quello che ci aspettiamo **da lui** — e a lui
insegniamo lo standard, non l'accento del posto.* ⚠️ **La sezione 8 lo prevedeva già, e per un'altra
ragione: «le due si confrontano separate: parlare e ascoltare sono due cose».**

**METODO_052** · ⚠️ **LA DIVISIONE CHE TIENE TUTTO INSIEME, e vale per ogni coppia di lingue:**

| | Dove vive | Cosa costa cambiare paese |
|---|---|---|
| **La lingua che si insegna** | il markdown: schede, regole, voci, dialoghi | **niente: non si muove** |
| **L'accento** | **solo la sintesi vocale** | **una voce** |
| **I modi del posto** | il tabellone 3.9, ed episodi dedicati | un episodio, quando serve |

*Così la rotta si scegli per le **scene**, e la lingua per l'**insegnamento**.* **Erano due decisioni
intrecciate, e dal 2026-09-27 sono due.**

---

## 3.3 — LE SITUAZIONI

**L'ordine è quello della vita, non quello degli episodi.** *Dove una situazione diventa una scena lo
decide `OBIETTIVI-A1_007`: l'obiettivo resta, la scena si sposta dove è credibile.*

| id | # | Fase | Situazione | Cosa si deve saper dire | Abilità | Diff. | Episodio |
|---|---|---|---|---|---|---|---|
| `O-presentarsi` | 1 | Pre-partenza | **Presentarsi** | nome, provenienza, età, cognome di famiglia | 🗣🎧 | 1 | ✅ `gate` |
| `O-famiglia` | 2 | Pre-partenza | **Famiglia e persone** | `wife` `daughter` `son` ✅ · ⚠️ mancano `husband` `mother` `father` | 🗣🎧 | 2 | **in parte `aircraft-door`** · *e `seat-neighbour`, in informale* |
| `O-gusti` | 3 | Pre-partenza | **Gusti e preferenze** | · | · | · | · |
| `O-routine` | 4 | Pre-partenza | **Routine quotidiana** | · | · | · | · |
| `O-casa` | 5 | Pre-partenza | **Descrivere casa e oggetti** | cosa hai portato, cosa ti manca | · | · | *al controllo, in hotel o al mercato — **non mentre fai le valigie*** |
| `O-numeri` | 6 | Pre-partenza | **Numeri, orari e date** | i numeri 1-20 | 🎧📖 | 1 | `numeri` |
| `O-imbarco` | 7 | Andata | **Prendere treno / aereo / bus** | biglietti, carta d'imbarco, bagagli | 🎧🗣 | 2 | ✅ `aircraft-door` |
| `O-dogana` | 8 | Andata | **Aeroporto e dogana** | quanto resti, dove alloggi, perché sei qui | 🎧🗣 | 6 | *scene 9 e 10* |
| `O-bagno` | 9 | Andata | **Chiedere il bagno** | `excuse me` per far alzare · `sorry` per lo sbaglio | 🗣 | 2 | `toilet` |
| `O-indicazioni` | 10 | Andata | **Chiedere e dare indicazioni** | `this way` già visto | 🎧🗣 | 4 | · |
| `O-mezzi` | 11 | Andata | **Mezzi pubblici in città** | · | · | · | `taxi` |
| `O-congedarsi` | 12 | Andata | **Salutare e congedarsi** | `hello` `hi` `good morning` ✅ · `enjoy your flight` ✅ · mancano i congedi veri | 🗣 | 1 | **in parte `gate` d-1 · `aircraft-door` d-1 e d-9** · chiude `saluti` |
| `O-ordinare` | 13 | Soggiorno | **Ordinare al bar / ristorante** | cosa vuoi da bere, pollo o pesce, per favore e grazie | 🗣 | 3 | `drinks-cart` · `restaurant` |
| `O-acquisti` | 14 | Soggiorno | **Fare acquisti** | vestiti e taglie | 🗣 | 5 | · |
| `O-prezzo` | 15 | Soggiorno | **Chiedere il prezzo** | `how much is/are`, la valuta, i decimali | 🎧🗣 | 5 | · |
| `O-amicizia` | 16 | Soggiorno | **Fare amicizia** | *conoscere qualcuno abbastanza da rivedersi* | 🗣🎧 | 7 | ⚠️ **l'episodio in cui incontrano il madrelingua di Londra** — `V-londra` |
| `O-telefono` | 17 | Soggiorno | **Al telefono** | · | · | · | · |
| `O-salute` | 18 | Soggiorno | **Piccoli problemi di salute** | · | · | · | · |
| `O-meteo` | 19 | Soggiorno | **Meteo e pianificare** | · | · | · | · |
| `O-emergenze` | 20 | Rientro | **Emergenze base** | · | · | · | · |
| `O-istruzioni` | 21 | ♾ **trasversale** | **Capire un'istruzione** | cintura, sedile dritto, telefono spento, restare seduti — **si ascolta e si esegue** | 🎧 | 1 | `before-takeoff`, *e poi sempre* |
| `O-assistenza` | 22 | ♾ **trasversale** | **Chiedere assistenza** | una coperta, un bicchiere d'acqua, aiuto col bagaglio — `can I have`, `excuse me` | 🗣 | 4 | *scena 7, e poi sempre* |
| `O-hotel` | 23 | Soggiorno | **L'hotel** | check-in, camera, chiave, il conto | 🎧🗣 | 5 | `hotel-reception` |

**Le colonne:** *🎧 ascolto · 🗣 parlato · 📖 lettura · ✍️ scrittura. **Diff.** è da 1 a 10, ed è il
secondo criterio d'ordine: fra le situazioni già scrivibili si pesca la più facile — **il tabellone
delle schede resta il primo criterio**.*

**OBIETTIVI-A1_018** · ⚠️ **NUOVO — le due situazioni trasversali non si chiudono mai.** *Un'istruzione
la capisci in aereo, in hotel, alla dogana e al mercato.* **La loro cella «episodio» si allunga per
tutto il corso e non arriva mai a un ✅** — *e senza la marca ♾ sembrerebbero due righe mai finite.*

**OBIETTIVI-A1_019** · ⚠️ **NUOVO — le due righe sono nate da un buco misurato: tre scene di volo su
dieci non avevano nessuna situazione fra le venti.** *Il posto, prima del decollo, in volo. Le tre
avevano una cosa in comune — ti dicono cosa fare, e tu chiedi assistenza — e l'elenco dei venti era
stato scritto prima che le dieci scene esistessero.*

**OBIETTIVI-A1_009** · **Non sono venti episodi.** *Un dialogo copre di norma una situazione, e una
situazione può chiedere due scene.* **Il numero non va inseguito.**

**OBIETTIVI-A1_013** · **Le situazioni vanno nei report**, in un'area loro: *lo studente deve sapere
**cosa saprà fare**, non solo quali parole ha imparato.* ⚠️ **E il testo è la colonna «cosa saprai
fare» del tabellone degli episodi** — *al futuro prima, al passato nel report dopo: la riga è una, il
tempo verbale cambia.*

**OBIETTIVI-A1_016** · **Excuse me / Sorry — due momenti di fila, stessa scena, reazione opposta:** *al
ristorante, chiamare il cameriere con `sorry` — si gira disorientato, pensa sia successo un guaio;
con `excuse me` — capisce subito che vuoi ordinare.*

**OBIETTIVI-A1_017** · **È il modello di ogni episodio trappola: la trappola si vede, non si spiega.**

---

## 3.4 — LE SCHEDE GRAMMATICALI

⚠️ **LA COLONNA CHE CONTA È L'ULTIMA: una scheda deve essere aperta PRIMA che un dialogo la usi.**
*È la regola 1.1, la più importante del progetto. 🔴 vuol dire che il dialogo è arrivato prima.*

| id | Scheda | Cosa insegna | Aperta da | Già usata in |
|---|---|---|---|---|
| `S-essere-aff` | **Verbo essere affermativo** | Tutte le persone — `I, you, he, she, it, we, they` — **con le contrazioni**. I pronomi soggetto stanno dentro: senza, la coniugazione non esiste | ⚠️ `verb-to-be` — **da fare** | 🔴 `gate` d-2 · d-9 · `aircraft-door` d-3 · d-4 · d-5 |
| `S-numeri-20` | **I numeri 1-20** | `one`…`twenty`, **come parole e come cifre insieme** | ⚠️ `numeri` — **da fare** | 🔴 `gate` d-7 · d-8 |
| `S-the` | **`the`** | Quello di cui stiamo parlando, quello che tutti e due sappiamo qual è. Si capisce **solo per contrasto** con `a` | ⚠️ `taxi` | 🔴 `gate` d-9 |
| `S-plurali` | **Plurali regolari** | La `-s` del plurale, **dentro il contare**: «one year, two year**s**» | ✅ **`numeri`** *(episodio 2)* — **prima di chi la usa** | `gate` d-7 (`years`) · `aircraft-door` d-2 (`tickets`) |
| `S-possessivi` | **Aggettivi possessivi** | *(non ancora spezzata)* | ⚠️ in sospeso in `aircraft-door` | 🔴 `aircraft-door` d-4 · d-5 (`my`) |
| `S-dimostrativi` | **`this` / `that` / `these` / `those`** | *(non ancora spezzata)* | ⚠️ in sospeso in `aircraft-door` | 🔴 `aircraft-door` d-7 (`this way`) |
| `S-wh-words` | **Le Wh-words** | `where`, `what`, `who`, `when`, `why`, `how` — **una famiglia, e si impara come famiglia**. In tedesco le *W-Fragen* | ⚠️ **`wh-words`** *(episodio 7)* — **rimandata con data** | `gate` d-3 (`where`) — *una parola sola, in anticipo* |
| `S-wh-questions` | **Le Wh-questions** | Parola interrogativa + verbo + soggetto. ⚠️ **Richiede `S-wh-words`** | ⚠️ **`wh-words`**, subito dopo | `gate` d-3 — *ma l'inversione la apre già `verb-to-be`* |
| `S-essere-dom` | **Domande e risposte brevi** | `Are you…?`, `Is he…?` con `Yes, I am` / `No, I'm not`. **L'inversione è la regola nuova** | `verb-to-be` | · |
| `S-essere-neg` | **Il negativo** | `I am not`, `isn't`, `aren't`. Separato perché **non è simmetrico**: `amn't` non esiste | `verb-to-be` | · |
| `S-a-an` | **`a` / `an`** | Uno qualunque, e quale delle due forme. ⚠️ La regola vera è **il suono** — `an hour`, `a university`: resta fuori, e rientra quando ne compare uno | `drinks-cart` | · |
| `S-numeri-100` | **Da 20 a 100** | Le decine e la composizione. **Non impari parole nuove, impari a comporle** | · | · |
| `S-ora` | **L'ora** | `half past`, `quarter to`, e il modo semplice `seven thirty` | · | · |
| `S-date` | **Le date** | Giorni, mesi, e l'ordinale: `the fifth of June` | · | · |
| `S-prezzi` | **I prezzi** | `how much`, la valuta, i decimali | · | · |
| `S-avere` | Verbo avere / `have got` | · | · | · |
| `S-present-simple` | Present simple *(con la -s della terza persona)* | · | · | · |
| `S-pronomi-oggetto` | Pronomi oggetto — `me`, `him`, `her`, `us`, `them` | · | · | · |
| `S-plurali-irregolari` | *(dentro `S-plurali` finché non serve)* | · | · | · |
| `S-aggettivi` | Aggettivi | · | · | · |
| `S-prep-luogo` | Preposizioni di luogo | · | · | · |
| `S-prep-tempo` | Preposizioni di tempo | · | · | · |
| `S-can` | `can` — abilità, permessi, richieste | · | · | ⚠️ *serve a `O-assistenza`* |
| `S-there-is` | `there is` / `there are` | · | · | · |
| `S-imperativo` | Imperativo | · | · | ⚠️ *serve a `O-istruzioni`* |
| `S-quantificatori` | Quantificatori base | · | · | · |
| `S-genitivo` | **Genitivo sassone** — *voce singola, non si spezza* | · | · | · |
| `S-present-cont-fisso` | **Present continuous, solo la forma fissa** — *voce singola* | · | · | · |
| `S-id-like` | **`I'd like`** — *voce singola* | · | · | ⚠️ *serve a `O-ordinare`* |
| `S-how-much` | **`how much is/are`** — *utile al viaggio, poco nelle liste standard* | · | · | ⚠️ *serve a `O-prezzo`* |
| `S-excuse-sorry` | **`excuse me` / `sorry`** — *idem* | · | · | ⚠️ *serve a `O-bagno`, `O-assistenza`* |
| ~~`S-avverbi-freq`~~ | ~~Avverbi di frequenza~~ | **fuori da A1** — *nelle liste standard, poco utile al viaggio* | — | — |
| ~~`S-present-cont`~~ | ~~Present continuous come tempo completo~~ | **fuori da A1** | — | — |

⚠️ **Le sei righe rosse sono strutture che i dialoghi usano e nessun episodio ha aperto.** *Tre erano
dichiarate in sospeso; tre no — `S-plurali`, `S-wh-words`, `S-wh-questions`.*

---

## 3.5 — LE REGOLE DELLA LINGUA

*Non sono strutture grammaticali: sono **cose che l'inglese fa e l'italiano no**. Non si coniugano —
si sanno o non si sanno. **Sono della coppia di lingue**, quindi vivono in questo file e lo spagnolo
avrà le sue. **Le righe sono in ordine di dialogo**, così si corrispondono col testo.*

| Usata in | id | Regola | Cosa dice | Come si vede | Spiegata in |
|---|---|---|---|---|---|
| **d-1** | `R-saluti` | **I saluti** | L'inglese ne ha più dell'italiano: `hi` informale, `hello` neutro va bene con chiunque, `good morning / afternoon / evening` di servizio. ⚠️ **`good night` è solo per congedarsi** | `Hello!` dell'hostess e dei genitori · `Hi!` dei figli · `Good morning` alla porta | `gate`, skill `d-1` «Hello e Hi» — **solo hi/hello**. Il resto: `saluti` |
| **d-1 → d-7** | `R-due-forme` | **Due forme entrambe corrette** | Quando ci sono due modi giusti, va detto. Chi ne trova due pensa che uno sia un errore | `Hello`/`Hi` · `I am`/`I'm` — i genitori usano le prime, i figli le seconde | `gate`, skill `d-1` e skill `d-7` |
| **d-1 · d-5 · d-7** | `R-espressioni` | **Espressioni che non si traducono a pezzi** | Si imparano intere: a pezzi non danno niente di sensato | `nice to meet you` → **solo al primo incontro** · `and you?` → rimanda la domanda · `years old` → e c'è anche la forma senza | `gate`, skill `d-1`, `d-5`, `d-8` |
| **d-1 · d-5** | `R-you` | **`you` vale *tu* e *voi*** | L'italiano ha due parole, l'inglese una sola. E **il *lei* non esiste**: la cortesia si fa con `please`, `could you`, il tono | `nice to meet you` a quattro persone = «conoscer**vi**» · `and you?` alla mamma = «e **tu**?» — **stessa scena** | ✅ `gate`, skill `d-5` — ⚠️ **corpo da allungare** |
| **d-1 · d-3** | `R-e-finale` | **La `e` finale non si legge** | Quasi mai si pronuncia, e spesso serve a cambiare il suono della vocale prima | `nice` · `where` · `Rome` · `Turin` | `gate`, **la regola generale** |
| **d-2** | `R-pronome` | **Il pronome soggetto non si salta mai** | In italiano «sono Marco» e il *io* sparisce. **In inglese non si può**: `am Marco` non esiste | `I am {{papa}}` · `I am from…` · `We are the…` — mai senza | `gate`, skill `d-7`, ultima riga |
| **d-2 · d-4** | `R-nomi` | **Nomi no, città sì** | Nomi di persona e cognomi **non si traducono mai**. Le città sì — ma **non tutte ne hanno una**. ⚠️ Chi si presenta come «Mark» non risponde quando lo chiamano «Marco» | Marco → Marco · Costa → Costa · Torino → **Turin** · Nizza → **Nice** · Mondovì → Mondovì | ✅ **accennata** in `gate`, skill `d-4` — ⚠️ **corpo da allungare** · ⚠️ **per intero in `nomi-propri`** |
| **d-2 → d-7** | `R-contratte` | **Le forme contratte** | La contratta arriva **dopo** l'estesa, mai prima. Nel parlato è quella che si sente | `I am` → `I'm` · `we are` → `we're` (non ancora) · `gonna` **mai insegnata**, solo segnalata | `gate`, skill `d-7` |
| **d-7 · d-8** | `R-eta-essere` | **L'inglese usa *essere* dove noi usiamo *avere*** | Per l'età: letteralmente «io **sono** dieci». ⚠️ **È l'errore che dura più a lungo**. E chi impara solo `I'm ten` risponde `we are three` a «quanti siete» | `I'm sixteen years old` · `I'm ten` · stessa famiglia di `I am from` contro «vengo da» | `gate`, skill `d-8` |
| **d-9** | `R-ordine` | **L'ordine delle parole** | Il cognome va **prima** di `family`, al contrario dell'italiano. ⚠️ Per ora è un caso solo, **cresce** | `the {{cognome}} family` → «la famiglia {{cognome}}» | `gate`, skill `d-9` |
| **`aircraft-door` d-2** | `R-your` | **`your` vale *tuo* e *vostro*** | La stessa cosa di `R-you`, sul possessivo | `your tickets` e `enjoy your flight` detti a quattro persone | `aircraft-door` |
| **`aircraft-door` d-7** | `R-please` | **`please` non è sempre «per favore»** | In un contesto di servizio diventa **«prego»**: l'hostess non ti chiede niente, ti invita. ⚠️ **Un traduttore automatico lo sbaglia** | `Your tickets, please` = per favore · `This way, please` = prego — **stessa parola, due significati, nello stesso dialogo** | `aircraft-door`, skill `d-7` |
| **`aircraft-door` d-9** | `R-chiude-da-se` | **Certe formule chiudono la conversazione da sé** | In italiano risponderemmo «grazie, altrettanto». In inglese chi la riceve sorride e passa. **Non è maleducazione** | `Enjoy your flight` | `aircraft-door`, skill `d-9` |

⚠️ **Le due righe rosse sono l'unica cosa che `gate` usa senza spiegare**, oltre a `S-the`. *`R-you`
era descritta come «esempi da `gate`, nella stessa scena» — ma nessuna skill di `gate` la nomina.*

---

## 3.6 — LE TRAPPOLE

**Una trappola non si «usa»: si SEMINA.** *Lo studente deve prima imparare bene qualcosa, e poi
sbagliarla. La prima colonna dice quale battuta l'ha piantata.*

| Seminata in | id | Trappola | Cosa succede | Perché ci si casca |
|---|---|---|---|---|
| **`gate` d-2** | `T-mark` | **«Mark» invece di «Marco»** | Lo studente inglesizza il suo nome. All'estero il receptionist lo chiama col nome vero, e lui non risponde | Ha appena visto Torino → Turin e generalizza |
| **`gate` d-4** *(l'italiano)* | `T-prep-paesi` | **`in` Cina, `negli` Stati Uniti, `nei` Paesi Bassi** | «Vengo da Torino, **in** Italia» funziona; con altri paesi la stessa frase si rompe | Sono le preposizioni **italiane** a cambiare, non le inglesi |
| **`gate` d-4 · d-9** | `T-articolo` | **`I am from the Italy`** · **`I like the coffee`** | Imparato `the`, lo studente lo mette dappertutto | «mi piace **il** caffè» — e ha già visto `the {{cognome}} family` |
| **`gate` d-7** | `T-thirteen` | **`thirteen` / `thirty`** · `fourteen` / `forty` | Chiede la camera 30 e gliene danno la 13 | ⚠️ **È `P-accento` che morde:** `-teen` in fondo — thir-**TEEN** — le decine sull'inizio: **THIR**-ty |
| **`gate` d-7 · d-8** | `T-ho-anni` | **`I have ten years`** · **`we are three`** | Chi impara solo `I'm ten` senza la struttura, a «quanti siete» risponde di avere tre anni | «**ho** dieci anni» — l'errore che dura più a lungo |
| **`gate` d-9** | `T-son` | **`son` letto «son»** invece di «san» | · | Si legge come in italiano |
| **`aircraft-door` d-1** | `T-welcome` | **`you're welcome` ≠ `welcome aboard`** | Stessa parola, significato opposto: «prego» contro «benvenuto» | ⚠️ **Non è colpa dell'italiano: è l'inglese** che usa la stessa parola per due cose. **Vanno tenute lontane, non affiancate** |
| · | `T-good-night` | **`good night` solo andando via** | Un italiano lo dice arrivando a cena | «buonanotte» da noi si dice anche entrando |
| · | `T-half-past` | **`half past seven`** | · | «mezza **dopo** le sette» dove noi diciamo «sette e mezza» |
| · | `T-sorry` | **`sorry` invece di `excuse me`** | Chiami il cameriere con `sorry`: si gira disorientato, pensa sia successo un guaio. Con `excuse me` capisce subito | ⚠️ **Colpa dell'inglese, non dell'italiano** — e **la trappola si vede, non si spiega** |
| · | `T-an-hour` | **`an hour`, `a university`** | La regola vera è **il suono**, non la lettera | · |

⚠️ **La colonna si chiama «perché ci si casca» e non «perché l'italiano tradisce»**, perché tre
trappole su undici non sono colpa dell'italiano: *sono l'inglese che usa la stessa parola per due
cose.* **Sono un tipo diverso, e col nome vecchio restavano vuote.**

### Il materiale già pronto per `nomi-propri`

**Le tabelle `people.*` hanno una colonna `en` che oggi nessuno legge** — `traducibile: no` fa usare
la colonna `it` anche in inglese, ed è giusto. **Ma quella colonna non è dato morto: è la lezione.**

| Gruppo | Quanti | Esempi | Cosa insegna |
|---|---|---|---|
| **Nomi con un cugino inglese** | **30** | Marco → Mark · Giulia → Julia · Tommaso → Thomas · Lorenzo → Lawrence | *esiste, ma **non è il tuo nome***: è il nome di un'altra persona che ti somiglia |
| **Nomi identici** | **7** | Laura · Emma · Alice · Martina · Beatrice · Leo · Giancarlo | *niente da tradurre, e va detto — o lo studente pensa di non averlo trovato* |
| **Cognomi** | **9** | Costa · Rossi · Barberis · Ambruosi | **nessuno ha una forma inglese**, ed è il contro-esempio che chiude la scheda |

**La lezione in una frase:** *«Il tuo nome può avere un cugino inglese, può essere identico, o può non
avere niente — **e in tutti e tre i casi resta il tuo**.»*

⚠️ **E l'episodio può dirlo sul nome CHE LO STUDENTE HA SCELTO**, perché il dato è già lì: *«il tuo è
del secondo tipo: Emma si scrive e si dice uguale».* **È l'unico posto del corso dove la
personalizzazione diventa il contenuto invece che il contorno.**

⚠️ **«Le città con l'articolo — al Cairo» NON è più qui.** *Non è una trappola: è una decisione presa
per evitare un problema, e sta nella regola `W-no-articolo`.* **In un elenco di trappole stava solo
perché quell'elenco era «il posto delle cose rimaste».**

---

## 3.7 — LA PRONUNCIA

**Le righe sono FENOMENI, non parole.** *Il suggerimento di ogni singola parola sta già nella sua
voce, nel file DATI: qui si raggruppano, e la colonna «parole» nomina gli id senza ricopiare i
suggerimenti.*

| id | Fenomeno | Cosa dice | Le parole che lo mostrano | Prima volta in | Spiegato da |
|---|---|---|---|---|---|
| `P-accento` | **L'accento cade dove non te lo aspetti** | L'italiano ha l'accento quasi sempre sulla penultima. L'inglese no, e **spostarlo cambia la parola** | hel-**LOU** · **FA**-mi-li · **MOR**-ning · and **IU** · i-ars **OULD** · en-**GIOI** · a-**BORD** · nais tu **MIIT** iu — **otto** | `gate` d-1 | ⚠️ regola generale di `aircraft-door` (5), **ricapitolato da `accento` (10)** |
| `P-th` | **La `th` è la lingua fra i denti** | Non è «z», non è «d», non è «t»: un suono che l'italiano **non ha**, e va fatto vedere prima che sentire | `the` · `they` · `thank you` · `this` | **`gate` d-9** | ⚠️ `th` |
| `P-h` | **La `h` è un soffio, e si sente** | In italiano non si legge. In inglese sì — leggera, ma c'è. Senza, `here` diventa `ear` | `hello` · `hi` · `here` · `he` | `gate` d-1 | ✅ regola generale di **`seat-neighbour` (8)** — *dove `Hi` e `Hello` tornano in informale* |
| `P-vocali-lunghe` | **Ci sono vocali lunghe e corte, e sono suoni diversi** | `miit` non è `mit`. In italiano la lunghezza non cambia la parola; in inglese sì | `meet` · `she` · `he` · `old` | `gate` d-1 | ✅ regola generale di **`before-takeoff` (9)** |
| `P-e-muta` | **La `e` finale non si legge quasi mai** | E spesso serve solo a cambiare il suono della vocale prima | `nice` · `where` · `welcome` · `here` · `wife` | `gate` — **regola generale** | ✅ `gate` |
| `P-gh` | **La `gh` non si legge affatto** | Due lettere che spariscono, e sono frequentissime | `daughter` · `flight` | `aircraft-door` d-5 | ⚠️ `gh-muta` — *apre con `night`, `light`, `right`* |
| `P-o-aperta` | **Certe `o` suonano come una `a`** | ⚠️ È la trappola `T-son` | `from` · `son` | `gate` d-4 | ✅ regola generale del **pasto (scena 6)** — *primo episodio del secondo tratto* |

### I fenomeni con un caso solo

*Come `R-ordine`: non sono righe morte, sono righe che crescono. **Ma vanno scritte adesso**, o al
terzo caso nessuno si ricorda che era già comparso.*

| id | Fenomeno | La parola | Prima volta in |
|---|---|---|---|
| `P-wh` | La `wh` è un soffio, non «vu» | `where` — ⚠️ **ma con `wh-words` (7) diventano sei, e la riga sale nella tabella sopra** | `gate` d-3 |
| `P-ck` | La `ck` è una «c» dura sola | `tickets` | `aircraft-door` d-2 |
| `P-sh` | La `sh` è «sc» di «scia» | `she` | `aircraft-door` d-4 |
| `P-j` | La `j` suona «gi» | `enjoy` | `aircraft-door` d-9 |
| `P-contratte-attaccate` | Le contrazioni si dicono **attaccate** — `aim`, mai «ai-em» | `I'm` | `gate` d-7 |

### La regola generale ruota, e il modulo accumula

**METODO_046** · ⚠️ **`generalRule` è UN TESTO SOLO per episodio** — misurato: la sezione 3 dei file
episodio ha una tabella con una colonna e una riga. **Quindi un episodio porta una regola di
pronuncia, non due.**

**METODO_047** · **La decisione: la regola generale è «la cosa che oggi vale la pena ripetere», non
«la lezione nuova di oggi», e RUOTA.**

| # | Episodio | Regola generale | Il modulo esercita |
|---|---|---|---|
| 4 | `gate` | la **`e` finale** muta | la `e` muta |
| 5 | `aircraft-door` | l'**accento** — *tre prove sue: **MOR**-ning, a-**BORD**, en-**GIOI*** | l'accento **+ la `e` muta** |
| 6 | `seat` | la **`th`** | **+ le due precedenti** |
| 7 | `wh-words` | la **`wh`** — *sei parole in un colpo* | **+ le tre precedenti** |
| 8 | `seat-neighbour` | la **`h`** che si sente | **+ le quattro precedenti** |
| 9 | `before-takeoff` | le **vocali lunghe** | **+ le cinque precedenti** |
| 10 | **`accento`** | — | **ricapitola**, e chiude il tratto |
| *tratto 2* | il pasto | la **`o` che suona «a»** — *e apre la trappola `T-son`* | **+ tutte** |

**METODO_048** · **Il riquadro non appare e sparisce: c'è sempre, e cambia contenuto.** ⚠️ *Un riquadro
che compare a episodi alterni sembra un errore dell'app.*

**METODO_049** · ⚠️ **Ripetere verticalmente lo si ottiene dall'ACCUMULO, non dal ripetere la stessa
frase cinque volte.** *È già la regola degli esercizi — «la scheda 2 esercita anche la 1».*
**Serve un modulo nuovo che esercita la regola generale**, e va nella sequenza `narrativo-standard`
di `inglese-it-struttura-corso`: *è un cambio DATI, non una nota nostra.*

---

## 3.8 — I PERSONAGGI

*Nel file è una tabella sola, spezzata in due blocchi per larghezza.*

### ① Chi sono

| id | Tipo | Etichetta | Personalizz. | Prima volta in | Torna in |
|---|---|---|---|---|---|
| `papa` | 👤 famiglia | **Papà** | ✅ nome | `gate` d-2 | `aircraft-door` d-3 · d-4 · d-5 |
| `mamma` | 👤 famiglia | **Mamma** | ✅ nome | `gate` d-6 | · |
| `figlia` | 👤 famiglia | **Figlia** | ✅ nome + età *(12-17)* | `gate` d-7 | · |
| `figlio` | 👤 famiglia | **Figlio** | ✅ nome + età *(4-11)* | `gate` d-8 | · |
| `hostess-gate` | 🛎 servizio | **Hostess al gate** | ❌ | `gate` d-1 · d-3 · d-5 | · |
| `hostess-porta` | 🛎 servizio | **Hostess alla porta** | ❌ | `aircraft-door` d-1 · d-2 · d-6 · d-7 · d-9 | · |
| `tutti` | 🗣 **modo** | **Tutti** | — | `gate` d-9 | `aircraft-door` d-8 |
| `arthur` | 👤 **ricorrente** | **Arthur** | ❌ | ⚠️ `O-amicizia`, in Cina | *poi per tutta la storia* |
| · | 👤 | Il vicino di posto, cinese | ❌ | · | `seat-neighbour` ⭐ |
| · | 🛎 | Hostess col carrello | ❌ | · | `drinks-cart` |
| · | 🛎 | Il pilota | ❌ | · | *gli annunci* |
| · | 🛎 | Il cameriere · Il tassista · Il receptionist | ❌ | · | `restaurant` · `taxi` · `hotel-reception` |
| · | 🛎 | L'ufficiale ai passaporti · L'addetto ai bagagli | ❌ | · | *scene 9 e 10* |
| · | 👤 | L'altra famiglia | ❌ | · | `O-famiglia` |

⚠️ **La colonna «tipo» serve perché `speakerLabels` mette insieme tre cose diverse:** *persone, ruoli
di servizio, e `tutti`, che non è nessuno dei due — è un modo di far parlare la bolla.* **Senza
distinguerli, la domanda «quanti personaggi ha il corso» non ha risposta.**

### ② L'aspetto, e cosa sblocca

**REGISTRO-EPISODI_036** · **L'aspetto non descrive una persona: descrive quello che resta uguale fra
un'inquadratura e l'altra** — *fascia d'età, corporatura, capelli, vestiti, cosa ha in mano,
espressione.* **È un pezzo di prompt che si incolla identico in ogni generazione.**

| id | Aspetto | Sblocca quando parla |
|---|---|---|
| `papa` | **40-45**, corporatura media, capelli scuri corti con qualche grigio alle tempie, barba di due giorni. **Polo o camicia in tinta unita, giacca leggera, zaino su una spalla.** *Attento, un filo fuori dal suo elemento ma tranquillo — è lui che parla, e non è la sua lingua* | · |
| `mamma` | **38-45**, capelli scuri fino alle spalle, raccolti per il viaggio. **Foulard leggero, borsa a tracolla, la cartellina dei documenti in mano.** *Organizzata, tiene il conto dei figli* | **`husband`** — *e oggi ha **una sola battuta**, `gate` d-6* |
| `figlia` | **Adolescente** — *deve leggersi come tale a 12 come a 17.* Capelli lunghi, **cuffie al collo, telefono in mano, felpa o giacca di jeans, zainetto.** *Un po' staccata, ma educata quando le rivolgono la parola* | **`mother`, `father`** |
| `figlio` | **Bambino** — *deve leggersi come tale a 4 come a 11.* Più basso di tutti, capelli spettinati, **maglietta con una stampa, trolley piccolo che vuole trascinare da solo.** *Curioso, guarda gli adulti dal basso* | **`mother`, `father`** |
| `hostess-gate` | **25-35**, chignon stretto. **Blazer scuro dell'uniforme, foulard nei colori della compagnia, badge, tablet in mano. Dietro il bancone del gate.** *Sbrigativa e cordiale — lo fa cinquanta volte al giorno* | · |
| `hostess-porta` | **35-45**, capelli **raccolti in modo diverso dalla collega**. Stessa uniforme ma **giacca invece del blazer, niente tablet: ha le mani libere perché accoglie. In piedi sulla soglia, di lato.** *Più formale — è l'energia del «good morning»* | · |
| `arthur` | **~60, inglese di Londra, insegnante in pensione, viaggia da solo.** Capelli bianchi, occhiali da lettura appesi al collo, **giacca di lino e una guida cartacea in mano** — *non il telefono.* **Parla un inglese britannico lento e chiarissimo** | `husband`/`wife` visti dall'esterno, i congedi veri |
| `tutti` | — *non è una persona: è l'inquadratura larga sui quattro* | · |

**Le quattro differenze fra le due hostess** — *perché in dieci secondi una faccia diversa non basta:*

| | Al gate | Alla porta |
|---|---|---|
| **Età** | più giovane | più grande |
| **Capelli** | chignon stretto | diversi |
| **In mano** | **tablet** | **niente** |
| **Dove sta** | dietro un bancone | in piedi sulla soglia |

⚠️ **I COLORI DELLA COMPAGNIA NON ESISTONO ANCORA, E SONO IN OGNI INQUADRATURA.** *Il foulard, il
badge, il bancone del gate: in dieci secondi il colore si vede prima di una faccia, e se cambia fra
un episodio e l'altro si nota più di un viso diverso.* **Nome, colori e livrea si stanno decidendo
altrove: quando arrivano, questa tabella si completa.**

### Arthur — il ruolo, prima della persona

**EDIZIONE_020** · **Il ruolo si scrive così, e ogni edizione lo riempie a modo suo:** *un
madrelingua, **più grande dei genitori**, che viaggia da solo, incontrato nel paese di destinazione,
e che invita la famiglia a casa sua.* **Nella versione inglese è Arthur, di Londra. In quella
spagnola sarà qualcuno di Madrid o Buenos Aires.**

**EDIZIONE_021** · **Perché più grande, e perché da solo:** *un coetaneo dei genitori sarebbe un
amico plausibile ma non un invito credibile; un gruppo non si riavvicina.* **Uno che viaggia da solo
parla con chi incontra, ed è il motivo narrativo per cui succede.**

**EDIZIONE_022** · ⚠️ **Perché un uomo, ed è una ragione tecnica:** *nel cast ricorrente ci sono già
due hostess e la mamma.* **Le voci disponibili sono un vincolo dichiarato** (`EDIZIONE_004`): *un
uomo anziano dà un timbro che non abbiamo ancora.*

**EDIZIONE_023** · **Parla lento e chiaro, e non è un dettaglio di carattere: è didattica.** *È il
primo madrelingua del corso, dopo dieci episodi di inglese con l'accento della rotta.* ⚠️ **Se il
primo madrelingua spaventa, il gradino diventa un muro.**

**EDIZIONE_029** · ⭐ **Arthur insegna ITALIANO a Londra, e risolve tre cose insieme:** *è la persona
più plausibile del mondo per invitare a casa una famiglia italiana · lo studente si rilassa perché
sa di poter essere capito · e soprattutto* **un madrelingua che di mestiere insegna una lingua può
dire «puoi dirlo anche così» dentro la storia.** *Arthur diventa la voce del metodo dentro la
finzione, invece di un narratore fuori campo.*

**EDIZIONE_030** · ⚠️ **Ma l'italiano di Arthur è UNA BATTUTA SOLA, all'incontro, e poi si passa
all'inglese.** *Il motivo è tecnico: ogni battuta ha una colonna `en` e una `it`, e una battuta in
italiano le avrebbe **identiche** — con Voice Practice che si aspetta di sentir pronunciare
l'italiano.*

**EDIZIONE_031** · ⚠️ **E il passaggio all'inglese va detto IN SCENA: glielo chiedono loro, perché
stanno imparando.** *Senza quella riga, la premessa dell'edizione — **perché questi personaggi
parlano inglese** — si sgretola proprio nell'episodio in cui arriva il madrelingua.*

**EDIZIONE_024** · **Il nome porta il `th`**, e lo studente deve pronunciarlo ogni volta che lo
nomina: *un esercizio che non sembra un esercizio.* **Il cognome si decide quando serve** — *la
famiglia lo chiama per nome.*

⚠️ **«Sblocca quando parla» dice che certe parole sono bloccate finché un personaggio non ha una
battuta.** *`aircraft-door` insegna `wife`, `daughter`, `son` — **solo quelle, perché parla solo il
padre**.* **È il tipo di cosa che al decimo episodio non ci ricorderemmo.**

---

## 3.9 — I MODI DEL POSTO

*Nato il 2026-09-27, ed è **il nono tabellone**. Ci stanno le parole e le forme che sono corrette **in
un posto solo**: non sono schede, non sono regole, non sono trappole — **una parola locale non è un
errore**.*

| id | Parola o modo | Tipo | Dove | Cosa vuol dire | Al posto di | Episodio |
|---|---|---|---|---|---|---|
| · | *(l'inglese non ne ha ancora)* | · | · | · | · | · |

⚠️ **E QUESTO TABELLONE È NATO DALLO SPAGNOLO, MA IL BUCO ERA DELL'INGLESE.** *Se ne è sentito il
bisogno progettando l'edizione spagnola — il `voseo`, il lunfardo — **e l'inglese ne avrà bisogno il
giorno che la famiglia arriva a Sydney**: `arvo`, `thongs`, `mate`.* **Il tipo è del metodo, non della
coppia.**

**METODO_053** · **Le due colonne che contano sono «tipo» e «al posto di».** *`tipo` è `locale` o
`slang`, gli stessi due valori delle categorie di episodio. **«Al posto di» dice la forma standard**,
e senza quella la riga non insegna niente: `pibe` da solo è una curiosità, `pibe` accanto a `chico` è
una lezione.*

**METODO_054** · ⭐ **E per la coppia italiano-spagnolo c'è un regalo: il lunfardo è pieno di
italianismi.** *`laburo` viene da «lavoro», `morfar` da «morfa».* ⚠️ **Parole che a uno studente
inglese sono opache e a un italiano si aprono da sole** — *sarà uno degli episodi più belli del corso,
ed è un vantaggio che esiste solo in questa coppia.*

---
---
---

# PARTE 4 — GLI EPISODI SCRITTI

## 4.1 — `gate` — «Al gate»

### La scena

**GATE_008** · **Dove:** il gate dell'aeroporto, prima dell'imbarco, PRETTE Airlines. **Chi:**
l'hostess al gate e la famiglia.

**GATE_009** · **Cosa succede:** *la famiglia arriva al gate. L'hostess la saluta e si dice contenta
di conoscerla. Il padre si presenta; lei gli chiede da dove viene, e lui risponde. Poi l'hostess si
rivolge alla mamma, che si presenta. I figli si presentano da soli e dicono quanti anni hanno. Alla
fine tutti insieme dicono chi sono: la famiglia.*

**GATE_010** · **Questo testo va anche nel modulo di apertura dell'episodio e nel video.**

**GATE_011** · La premessa è **«la tua famiglia parte per una vacanza»**, non «una famiglia italiana»:
*la città di partenza è personalizzabile, e tre opzioni su otto non sono in Italia.*

**GATE_020** · **Esclusi di proposito:** *«Can you introduce yourselves?»* — riflessivo difficile ·
*il genitivo sassone* («I'm {papà}'s wife») — struttura ostica · *«everyone»* — lunga e poco utile
all'inizio.

### Note di scrittura

**GATE_042** · **Adulti e ragazzi parlano diverso:** papà e mamma «Hello» e «I am», i figli «Hi» e
«I'm». *Una distinzione di registro che spiega due differenze, e rispetta la forma estesa prima
della contratta.*

**GATE_043** · **Le due forme dell'età:** la figlia «I'm sixteen years old», il figlio «I'm ten».

**GATE_044** · **I numeri si scrivono in lettere nella battuta** — `sixteen`, non `16`: *è la parola
che l'episodio dei numeri insegna, e in Voice Practice va pronunciata. Nella personalizzazione si
sceglie la cifra: **due usi, non una duplicazione**.*

**GATE_046** · ✅ **CHIUSO IL 2026-09-26 — l'app dice `I'm sixteen years old`.** *Qui c'era scritto
«oggi l'app dice `I'm 16 years old`», e in tre posti diversi. Misurato: `ages.anni` esiste nel JSON
con quattordici righe e la colonna `en` in parole, e l'app rende la parola.*

**GATE_047** · ⚠️ **DA APPLICARE — due corpi di skill vanno allungati, e chiudono le due regole che
`gate` usava senza spiegare.** *La tentazione era aggiungere due skill: `gate` ne ha già otto su nove
battute, e passerebbe a dieci. **Il materiale sta dentro due skill che esistono già.***

| Skill | Cosa aggiungere in fondo al corpo |
|---|---|
| `d-5` · «And you?» | *Attenzione a "you": due battute fa l'hostess l'ha detto a tutta la famiglia — "nice to meet **you**", cioè **voi**. Adesso lo dice solo alla mamma, e vuol dire **tu**. **È la stessa parola: l'inglese non ne ha due.** E non esiste nemmeno il "lei": la cortesia si fa con "please" e col tono.* |
| `d-4` · «Dire da dove vieni» | *Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in inglese. La tua città a volte cambia: Torino diventa **Turin**, Nizza diventa **Nice**. Non tutte ce l'hanno: Mondovì resta Mondovì. **Su questo torniamo per bene più avanti.*** |

⚠️ **Costo: due celle del file DATI.** *Nessuna skill nuova, il riquadro dei numeri attesi resta
`8 skill`.* **E la seconda dichiara il rimando con una data** — `nomi-propri` — come vuole
`METODO_029`.

### Contenuti video — messaggi iniziali e finali

·

### Contenuti social

·

---

## 4.2 — `aircraft-door` — «Sulla porta dell'aereo»

### La scena

**AIRCRAFT-DOOR_008** · **Dove:** la porta dell'aereo, PRETTE Airlines. **Chi:** l'hostess alla porta
e la famiglia.

**AIRCRAFT-DOOR_009** · **Cosa succede:** *la famiglia arriva alla porta con i biglietti in mano.
L'hostess saluta e li dà il benvenuto a bordo, poi chiede i biglietti. Il padre glieli dà e le
presenta la famiglia. Lei ringrazia, legge la destinazione e li manda verso il posto. La famiglia
ringrazia, e lei augura buon volo.*

**AIRCRAFT-DOOR_010** · **Questo testo va anche nel modulo di apertura e nel video.**

**AIRCRAFT-DOOR_011** · **È una scena di servizio, breve e funzionale:** *al gate ti presenti tu, qui
**ti dicono cosa fare**.*

**AIRCRAFT-DOOR_012** · **L'hostess non chiede dove vanno:** *alla porta sa già dove va l'aereo, e
`Where are you from?` non sarebbe credibile.* **La domanda sta in `seat-neighbour`.**

**AIRCRAFT-DOOR_016** · **La famiglia: `wife`, `daughter`, `son` — solo quelle del padre**, perché
parla solo lui. *`husband` arriverà quando parlerà la mamma, `mother` e `father` quando parleranno i
figli.*

**AIRCRAFT-DOOR_018** · **Esclusi di proposito:** *il present continuous e `to` come direzione* — in
`seat-neighbour`, dove `We are going to Beijing` è una risposta vera · *`you're welcome`* — lontano
da `welcome aboard` · *il numero del posto* — nell'episodio successivo, coi numeri oltre il venti.

**AIRCRAFT-DOOR_019** · ⚠️ **VINCOLO — `they` in `Here they are`:** *`verb-to-be` deve stare **prima**
nella sequenza. Dopo, `they` sarebbe un sorpasso.*

### Note di scrittura

**AIRCRAFT-DOOR_041** · **Il padre presenta la famiglia** — *è quello che si fa davvero quando
qualcuno ti guarda quattro biglietti in mano. E porta la terza persona del verbo essere.*

**AIRCRAFT-DOOR_042** · **`Good morning` e non `Hello`:** *un'hostess che dice `Hello` alla porta non
è credibile. Apre la famiglia dei saluti orari.*

**AIRCRAFT-DOOR_043** · **Finisce con l'hostess, e non si risponde:** *`Enjoy your flight` è già la
chiusura.*

**AIRCRAFT-DOOR_046** · ⚠️ **NUOVO — questo episodio non ha una regola generale, e ne serve una:
l'accento.** *Ha tre prove sue — **MOR**-ning, a-**BORD**, en-**GIOI** — ed è il fenomeno di
pronuncia con più materiale in tutto il corso.*

### Contenuti video — messaggi iniziali e finali

·

### Contenuti social

·

---
---
---

# PARTE 5 — LAVORI APERTI

## 5.1 — PER NOI

| # | Cosa | Dove |
|---|---|---|
| 1 | ⚠️ **I colori, il nome e la livrea della compagnia** — *si decidono altrove. Quando arrivano: il foulard, il badge, il bancone del gate, e la tabella 3.8 ② si chiude* | 3.8 ② |
| 2 | **Il cognome di Arthur** — *serve solo quando qualcuno lo presenta a qualcun altro* | 3.8 |
| 3 | **`S-the` resta il debito più lungo** — usata a `gate` d-9, aperta da `taxi`, che è nel secondo tratto | 3.4 |
| 4 | ⚠️ **Da verificare col primo test su una persona vera:** *tre moduli prima della prima scena* (`REGISTRO-EPISODI_035`) | 3.1 |
| 5 | ⚠️ **I 141 messaggi di esito, riletti per intero** — *ne abbiamo corretti due, quelli che dicono allo studente una cosa falsa. **In coda, dopo Supabase*** | `inglese-it-messaggi-feedback` |
| 6 | **I tredici copioni dei video dei moduli** — *la colonna esiste, è vuota* | `inglese-it-istruzioni-moduli` §2 |

### Il primo test con una persona vera — 2026-09-26

**REGISTRO-EPISODI_037** · ⚠️ **Due cose, e nessuna era stata prevista.** *«I testi dei pop-up di
spiegazione sono troppo lunghi e contorti»* e *«non capisco cosa devo fare e cliccare»* — **una
persona che non sa l'inglese, sul telefono, senza sapere niente del progetto.**

**REGISTRO-EPISODI_038** · **E la soluzione esisteva già nel codice, senza che lo sapessimo.** *Fra
le stringhe condivise ci sono `introDontShowAgain` — «Non mostrarmi più questa schermata» — e
`introStart` — «Ho capito, inizia».* **Quindi la Spiegazione non è un pop-up: è già la schermata che
parte prima dell'esercizio.** *Mancavano il video dentro e un testo che si legga — **non dodici
moduli nuovi**, che era la strada su cui stavamo andando.*

**REGISTRO-EPISODI_039** · ⚠️ **La lezione: prima di progettare un meccanismo, si guarda se c'è
già.** *Avevamo progettato una sequenza `narrativo-primo` con dodici moduli in più — il primo
episodio da 22 passi a 34 — per ottenere una cosa che il codice faceva già.*

✅ **Chiuse il 2026-09-26:** *le sette righe rosse delle schede · le due righe rosse delle regole · i
tre fenomeni di pronuncia senza episodio · `O-amicizia` · l'aspetto dei personaggi · il madrelingua
di Londra · i nomi dei tratti · il materiale di `nomi-propri`.*

## 5.2 — PER CLAUDE CODE

| # | Cosa | Perché |
|---|---|---|
| 1 | ⚠️ **Due paragrafi scaduti nel modello `nuovi/inglese-it-EPISODIO-VUOTO.md` e in `inglese-it-aircraft-door.md`**: il fallback dice ancora «prima riga» invece del predefinito, e la sezione 8 descrive le età come tabelle interne | **il modello per primo, o il prossimo episodio li riporta indietro.** In `inglese-it-gate.md` sono già corretti |
| 2 | **Due moduli nuovi nella sequenza `narrativo-standard`**: il modulo che esercita la regola generale, e il ripasso accumulato | è la decisione `METODO_049` |
| 3 | **Ogni modulo dichiara la sua abilità** — ascolto, parlato, lettura, scrittura. *E oggi la scrittura non ha nessun modulo* | serve alle colonne «abilità» di 3.3 |
| 4 | ⚠️ **Una guardia che provi OGNI opzione di una tabella**, non solo il predefinito | *senza, `orig-lugano` resta invisibile a qualunque suite* |
| 5 | **Il test rovesciato:** ogni id elencato da un episodio esiste nel magazzino | *non «ogni riga è usata»: il magazzino è più grande della vetrina* |
| 6 | **Un test che segnala un id di voce presente in due episodi** | *è il controllo anti-duplicazione delle voci. **Sono 68 fra i due episodi e ~350 a dieci**: una tabella non regge, un test sì* |
| 7 | **La migrazione dei valori salvati** — `marco → papa-marco` | *senza, chi ha personalizzato torna ai predefiniti in silenzio* |
| 8 | **Via le colonne `fr` `es` `de`** | *un'edizione non è una traduzione* |
| 9 | *(più avanti)* **togliere la personalizzazione della destinazione** in `aircraft-door` | *personalizzare la destinazione brucia le città* |
| 10 | ⚠️ **`gate`: due corpi di skill allungati** (`d-4` e `d-5`) e **`aircraft-door`: la regola generale, oggi vuota, diventa l'accento** | `GATE_047` e `AIRCRAFT-DOOR_046`. **I numeri attesi NON cambiano** — `8 skill` resta `8 skill` |
| 11 | **La sequenza degli episodi** in `inglese-it-struttura-corso`, sezione 7: `wh-words` entra fra `seat` e `seat-neighbour` | tabellone 3.1 ① |
| 12 | ⚠️ **`gate` §7: l'etichetta dello slot `papa` torna «Nome del papà».** *Il «`/ utente`» va tolto — e il file lo difende esplicitamente come «l'unico posto dove è scritto che quello slot è lo studente stesso»* | **quella frase è falsa**: chi usa l'app può essere chiunque della famiglia. Regola `W-nessun-alterego` |

⚠️ **Una domanda sola, che chiude quattro righe qui sopra:** *«nel JSON di oggi, `people.papa` ha gli
id nella forma `papa-marco`, e `places.destinations` ha tre città o sei nazioni?»* **Se gli id sono
già quelli nuovi, la migrazione (7) è fatta e va cancellata da qui.**
