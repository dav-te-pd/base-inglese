**Versione: 20260927a**

# Episodio «Al gate» — inglese per italiani

*Id: `gate`. Nome, categoria e sequenza vivono nella sezione 7 di
`inglese-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-gate.json`.** Le ragioni — la scena, cosa insegna, le note di scrittura,
gli esclusi di proposito — stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_story_modules.js` e `tests/test_episodio2.js`, 2026-09-23

⚠️ **DI QUESTO FILE UN TEST LEGGE DUE COSE:**

| Cosa legge un test | Chi |
|---|---|
| il **riquadro dei numeri attesi** | `tests/test_story_modules.js` |
| ⚠️ **le tabelle dei gradi A, B, C, D e la sezione 5 delle skill**, confrontate col JSON **cella per cella** | `tests/test_story_modules.js`, blocco `[Fonte]` |

**Quindi per QUESTO episodio l'ordine delle colonne è un'interfaccia**, non una scelta di
impaginazione: spostarne una fa rosso. I titoli delle sezioni no — quelli il blocco li cerca per il
loro titolo di terzo livello, senza il numero di sezione.

⚠️ **E QUEL TITOLO QUI NON È SCRITTO PER INTERO:** il blocco cerca la **prima** occorrenza nel file,
quindi una citazione in questa sezione gli farebbe leggere **la tabella qui sopra** come tabella del
grado A.

⚠️ **E l'asimmetria va saputa: `aircraft-door` NON ha questo controllo.** `tests/test_episodio2.js`
legge solo il suo riquadro dei numeri. **`gate` è l'unico episodio in cui l'accordo fra markdown e
JSON è verificato da una macchina.**

### ② ⚠️ QUATTRO COLONNE NUOVE, IL 2026-09-27 — E VANNO TUTTE IN FONDO

| Colonna | Dove | → JSON | Cosa dice |
|---|---|---|---|
| **`tipo`** | **tutti e quattro i gradi** | `tipo` | `standard` · `locale` · `slang` — **nessuna cella vuota** |
| **`esercizio`** | **A, B, C** | `esercizio` | `sì` / `no` — se questo target entra negli esercizi |
| **`non con`** | **A, B, C** | `nonCon` — *una lista di id, vuota se `·`* | con chi non deve **mai** comparire come distrattore |
| **`accento`** | sezione 6, i personaggi | ⚠️ **accanto a `speakerLabels`, non dentro** — *da decidere con Code* | da quale lingua viene l'accento di chi parla |

⚠️ **I NOMI DELLE CHIAVI SONO UNA PROPOSTA, NON UNA DECISIONE.** *Sono in italiano come `ruolo`, che è il
precedente più vicino.* **Se Code ne preferisce altri, vincono i suoi e si riscrivono qui** — *l'importante
è che il markdown li dichiari, come fa per ogni altra colonna.*

⚠️ **E `speakerLabels` oggi è una mappa `chiave → stringa`: l'accento non ci sta dentro senza cambiarne la
forma.** *Serve una seconda mappa — `speakerAccents` o simile — oppure `speakerLabels` diventa
`chiave → { etichetta, accento }`.* **È una decisione di Code, e la scriviamo qui appena la prende.**

⚠️ **E PERCHÉ `esercizio` E `non con` NON STANNO SUL GRADO D:** *nessun modulo presenta una battuta con
delle alternative fra cui scegliere.* **I distrattori esistono solo dove c'è da abbinare — Match, Speed
Match, Flash Card — che lavorano su A, B e C.** *Una battuta si ascolta e si ripete: non ha distrattori, e
non si può nemmeno escludere dagli esercizi senza toglierla dal dialogo.*

⭐ **`tipo` invece sta su tutti e quattro, perché una parola può essere `slang` come una battuta.**

⚠️ **VANNO IN FONDO, E PER QUESTO EPISODIO È CRITICO.** *Il blocco `[Fonte]` confronta le tabelle dei
gradi **cella per cella** col JSON: se legge anche le colonne nuove prima che `trascrivi.js` le sappia
scrivere, diventa rosso.*

**⚠️ DA VERIFICARE CON CLAUDE CODE PRIMA DI TRASCRIVERE:** *il blocco tollera colonne in più alla fine,
o le conta?* **Su `aircraft-door` il rischio non c'è, perché là il test legge solo il riquadro.**

### ③ Cosa dicono le due colonne nuove dei target

**`esercizio`** · *`no` quando il target è già stato esercitato abbastanza, o quando non va esercitato
affatto.* ⚠️ **LA DECISIONE LA PRENDIAMO NOI, NEL MARKDOWN.** *Il JSON copia, l'app legge: nessuno dei
due decide (regola 1.4).*

**`non con`** · *la rete per le risposte doppie.* ⚠️ **Serve anche quando la traduzione è pulita, perché
il bacino dei distrattori crescerà:** *oggi sono gli undici item di un grado di un episodio, col mix
diventeranno ~150 di tutto l'A1 — e lì due target con la stessa traduzione sono garantiti, non
possibili.*

⭐ **Ma l'esclusione è la rete, non il primo strumento: dove si può, si aggiusta la traduzione.**

**Il riquadro dei numeri invece è rigido, e in un modo che va saputo prima di scriverlo:**

| | Come funziona |
|---|---|
| **Si trova** | cercando **la stringa che apre il riquadro della sezione 2**, e ne prende la **prima** occorrenza nel file |
| **Finisce** | alla **prima riga vuota** dopo quel punto |
| **Si legge** | ricucendo le righe con uno spazio, e togliendo `*` e `>` — **ma non `|`** |
| **Si estrae** | con sei espressioni: `N voci in A` · `N in B` · `N in C` · `N battute in D` · `N skill` · `N slot` |

⚠️ **QUI QUELLA STRINGA NON È SCRITTA, ED È VOLUTO:** *una citazione in questa sezione farebbe leggere
**questa tabella** invece del riquadro vero, e i sei numeri verrebbero fuori come `N` senza che niente
si lamenti.* **La prova è ripetibile: `grep -c` su quella stringa deve dare 1.**

⚠️ **PER QUESTO IL RIQUADRO È L'UNICA COSA NON TABELLARE DI QUESTO FILE.** *Il markdown vuole una riga
vuota prima di una tabella; il parser si ferma alla prima riga vuota.*

**Ogni numero si prende col suo NOME accanto, mai per posizione.**

---

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 11 voci in A, 7 in B, 9 in C, 9 battute in D, 8 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Il paragrafo qui sopra è il solo pezzo del file che un test legge. La riga vuota che segue lo chiude:
non metterne una dentro.*

⭐ **I sei numeri NON cambiano con le colonne nuove:** *nessuna riga nasce e nessuna muore — le righe
guadagnano celle.*

---

## 3 — LA REGOLA GENERALE

*Finisce in `generalRule`, ed è **facoltativa**: senza, Repeat Aloud non disegna il riquadro.*

| Testo |
|---|
| La "e" finale in inglese non si legge quasi mai. |

*La regola generale **ruota**: ogni episodio ne porta una, e il modulo che la esercita accumula anche le
precedenti. Questa è la prima della serie.*

---

## 4 — LA MATRICE

### Grado D — le battute

*Colonne → `levels.D.items[]`: **id** → `id` · **speaker** → `speaker`, e deve essere una chiave della
tabella dei personaggi · **ruolo** → `ruolo` · **en** → `english` · **it** → `italian` · **tipo**.*

⚠️ **`ruolo` ha due soli stati che contano:** `famiglia` mette la bolla a **destra**, qualunque altro
valore la mette a sinistra.

| id | speaker | ruolo | en | it | tipo |
|---|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Hello! Nice to meet you. | Ciao! Piacere di conoscervi. | `standard` |
| `d-2` | `papa` | `famiglia` | Hello! I am {{papa}}. | Ciao! Sono {{papa}}. | `standard` |
| `d-3` | `hostess-gate` | `staff` | Where are you from, {{papa}}? | Di dove sei, {{papa}}? | `standard` |
| `d-4` | `papa` | `famiglia` | I am from {{partenza}}, {{partenza.paese:en}}. | Vengo da {{partenza}}, in {{partenza.paese}}. | `standard` |
| `d-5` | `hostess-gate` | `staff` | And you? | E tu? | `standard` |
| `d-6` | `mamma` | `famiglia` | Hello! I am {{mamma}}. | Ciao! Sono {{mamma}}. | `standard` |
| `d-7` | `figlia` | `famiglia` | Hi! I'm {{figliaNome}}. I'm {{figliaEta}} years old. | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. | `standard` |
| `d-8` | `figlio` | `famiglia` | Hi! I'm {{figlioNome}}. I'm {{figlioEta}}. | Ciao! Sono {{figlioNome}}. Ho {{figlioEta}} anni. | `standard` |
| `d-9` | `tutti` | `famiglia` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! | `standard` |

### Grado C — le frasi

*Colonne → `levels.C.items[]`: **id** · **en** → `english` · **it** → `italian` · **da** → `fromLine`,
l'id della battuta da cui è ricavata · **tipo** · **esercizio** · **non con**.*

| id | en | it | da | tipo | esercizio | non con |
|---|---|---|---|---|---|---|
| `c-1` | I am {{papa}}. | Sono {{papa}}. | `d-2` | `standard` | sì | `c-4` · `c-5` · `c-7` |
| `c-2` | Where are you from? | Di dove sei? | `d-3` | `standard` | sì | · |
| `c-3` | I am from {{partenza}}, {{partenza.paese:en}}. | Vengo da {{partenza}}, in {{partenza.paese}}. | `d-4` | `standard` | sì | · |
| `c-4` | I am {{mamma}}. | Sono {{mamma}}. | `d-6` | `standard` | sì | `c-1` · `c-5` · `c-7` |
| `c-5` | I'm {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` | `standard` | sì | `c-1` · `c-4` · `c-7` |
| `c-6` | I'm {{figliaEta}} years old. | Ho {{figliaEta}} anni. | `d-7` | `standard` | sì | `c-8` |
| `c-7` | I'm {{figlioNome}}. | Sono {{figlioNome}}. | `d-8` | `standard` | sì | `c-1` · `c-4` · `c-5` |
| `c-8` | I'm {{figlioEta}}. | Ho {{figlioEta}} anni. | `d-8` | `standard` | sì | `c-6` |
| `c-9` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! | `d-9` | `standard` | sì | · |

⚠️ **Le quattro «Sono X» si escludono a vicenda, e non è solo per i nomi doppi.** *`Marco`, `Paolo`,
`Claudio` e `Federico` stanno in `people.papa` **e** in `people.figlio`; `Chiara` in `people.mamma` **e**
in `people.figlia`: chi dà lo stesso nome a padre e figlio otterrebbe **due risposte corrette**.* **Ma
l'esclusione vale anche senza quel caso:** *«Sono Marco» contro «Sono Emma» fa abbinare il **nome**, non
la lingua — l'esercizio non insegna niente nemmeno quando funziona.*

*`c-6` e `c-8` per la stessa ragione: differiscono solo per il segnaposto dell'età.*

### Grado B — le espressioni

*Colonne → `levels.B.items[]`: **id** · **en** → `english` · **it** → `italian` · **pronuncia** →
`pronunciationTip` · **categoria** → `grammarCategory` · **tipo** · **esercizio** · **non con**.*

| id | en | it | pronuncia | categoria | tipo | esercizio | non con |
|---|---|---|---|---|---|---|---|
| `b-i-am` | I am | (io) sono, forma piena | ai am | pronome + verbo essere | `standard` | sì | **`b-im`** |
| `b-im` | I'm | (io) sono, forma corta | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere, contratto | `standard` | sì | **`b-i-am`** |
| `b-we-are` | we are | (noi) siamo | ui ar | pronome + verbo essere | `standard` | sì | · |
| `b-nice-to-meet-you` | nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica | `standard` | sì | · |
| `b-i-am-from` | I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione | `standard` | sì | · |
| `b-and-you` | and you? | E tu? / E voi? | and IU — accento su "you" | espressione | `standard` | sì | · |
| `b-years-old` | years old | anni (di età) | i-ars OULD | espressione per l'età | `standard` | sì | · |

⚠️ **`b-i-am` e `b-im` avevano la traduzione IDENTICA — «(io) sono» tutte due — e in Match questo non è
difficile: è irrisolvibile.** *Corretto il 2026-09-27 marcando la forma.* ⭐ **E la marca è contenuto:
l'episodio è costruito sulla regola «la contratta dopo l'estesa», e la traduzione non lo diceva.*
**L'esclusione resta come rete.**

### Grado A — le parole

*Stesse colonne del grado B → `levels.A.items[]`.*

⚠️ **L'ID DEI GRADI A E B È DESCRITTIVO, MAI UN NUMERO.** *`app/sessione.js` costruisce la chiave della
mastery come `<modulo>:<id della voce>:<direzione>`: con un id posizionale, inserire domani una parola
in mezzo rinumera tutte quelle dopo, e **il colore di una voce passa a un'altra** senza nessun errore.*

| id | en | it | pronuncia | categoria | tipo | esercizio | non con |
|---|---|---|---|---|---|---|---|
| `a-hello` | hello | Salve | hel-LOU — la "h" è un soffio leggero | saluto | `standard` | sì | · |
| `a-hi` | hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto | `standard` | sì | · |
| `a-nice` | nice | bello / piacevole | nais | aggettivo | `standard` | sì | · |
| `a-meet` | meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo | `standard` | sì | · |
| `a-where` | where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo | `standard` | sì | · |
| `a-from` | from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione | `standard` | sì | · |
| `a-and` | and | e | and — la "d" finale si sente appena | congiunzione | `standard` | sì | · |
| `a-years` | years | anni | i-ars — parte con un suono di "i" | sostantivo | `standard` | sì | · |
| `a-old` | old | vecchio (di età) | ould — la "o" è lunga | aggettivo | `standard` | sì | · |
| `a-the` | the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo | `standard` | sì | · |
| `a-family` | family | famiglia | FA-mi-li — accento sulla prima | sostantivo | `standard` | sì | · |

⚠️ **`a-hello` diceva «Ciao / Salve» e `a-hi` «Ciao»: si sovrapponevano su «Ciao», e in `it→en` il
target «Ciao» aveva due risposte corrette.** *Corretto il 2026-09-27.* ⭐ **E adesso la traduzione
INSEGNA il registro invece di nasconderlo:** *la skill dice che «Hello è un po' più educato, Hi un po'
più amichevole», e le due traduzioni la contraddicevano.*

**Nessuna esclusione serve qui: aggiustata la traduzione, il problema non esiste.**

---

## 5 — LE SKILL

*Colonne → `levels.D.items[].whatYouLearn[]`: **battuta** → a quale `id` del grado D si attacca · **#** →
l'ordine dentro la lista di quella battuta · **titolo** → `title` · **corpo** → `body`.*

**`whatYouLearn` è SEMPRE una lista**, anche con una skill sola. **Una battuta senza righe qui non ha
skill.**

⚠️ **Nel corpo:** HTML sì, `<br>` per andare a capo, `<strong>` per evidenziare, **mai `<p>`**. *E la
citazione inglese chiede la propria lingua con `{{chiave:en}}`.*

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Hello e Hi | Sono i due modi normali di salutare.<br>"Hello" è un po' più educato — in italiano è più vicino a "Salve". "Hi" è più amichevole: è il nostro "Ciao". Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".<br>Nessuno dei due è sbagliato. Se sei in dubbio, "Hello" va bene sempre, con chiunque. |
| `d-1` | 2 | Nice to meet you | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!". |
| `d-3` | 1 | Chiedere da dove viene qualcuno | "Where are you from?" vuol dire "di dove sei?".<br>"Where" significa "dove". E la formula funziona tutta insieme: è così che si chiede l'origine di qualcuno.<br>Il papà risponde "I am from {{partenza:en}}" — la stessa struttura, girata.<br>Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra. |
| `d-4` | 1 | Dire da dove vieni | "I am from {{partenza:en}}" vuol dire "vengo da {{partenza:it}}".<br>Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".<br>"From" significa "da". La userai tantissimo.<br>Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in inglese. La tua città a volte cambia: Torino diventa <strong>Turin</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | And you? | Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br><strong>E nota "you":</strong> due battute fa l'hostess l'ha detto a tutta la famiglia — "nice to meet <strong>you</strong>", cioè <strong>voi</strong>. Adesso lo dice solo alla mamma, e vuol dire <strong>tu</strong>. È la stessa parola: l'inglese non ne ha due. |
| `d-7` | 1 | I am e I'm | Il papà dice "I am {{papa:en}}", la figlia dice "I'm {{figliaNome:en}}". Sono la stessa cosa: "I'm" è solo la forma corta.<br>Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".<br><strong>La forma corta vale sempre, non solo con i nomi:</strong> "I'm from Turin" è uguale a "I am from Turin".<br>Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.<br>Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. <strong>In inglese non si può:</strong> "I" ci deve essere sempre. Non esiste dire "am Marco". |
| `d-8` | 1 | Dire quanti anni hai | La figlia dice "I'm {{figliaEta:en}} <strong>years old</strong>". Il figlio dice solo "I'm {{figlioEta:en}}".<br>Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.<br>Attenzione a una cosa: in inglese <strong>non si usa il verbo avere</strong> per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".<br>Ricordatelo, perché è la differenza più grande con l'italiano. |
| `d-9` | 1 | We are | "We are" vuol dire "noi siamo".<br>Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.<br>Nota che in inglese il cognome va <strong>prima</strong> della parola "family", al contrario dell'italiano. |

⚠️ **Due corpi sono stati allungati il 2026-09-27**, e chiudono le due regole che `gate` usava senza
spiegare: *`d-5` per «`you` vale tu e voi», `d-4` per «i nomi non si traducono, le città a volte sì».*
⭐ **Nessuna skill nuova: il riquadro resta a 8, e il materiale stava già dentro due skill esistenti.**

---

## 6 — PERSONAGGI ED ETICHETTE

*Colonne: **chiave** → quello che scrivi nella colonna `speaker` del grado D · **etichetta** → quello che
lo studente legge sopra la bolla — le due insieme fanno `speakerLabels` · **accento** → ⚠️ **non dentro
`speakerLabels`** — vedi la tabella delle quattro colonne nuove all'inizio del file.*

⚠️ **La chiave nel JSON è `speakerLabels`.** *Fino al 2026-09-09 si chiamava `dialogueSpeakerLabels`, e
quel nome non esiste più da nessuna parte.*

| chiave | etichetta a schermo | accento |
|---|---|---|
| `hostess-gate` | Hostess al gate | `zh` |
| `papa` | Papà | `it` |
| `mamma` | Mamma | `it` |
| `figlia` | Figlia | `it` |
| `figlio` | Figlio | `it` |
| `tutti` | Tutti | `it` |

⚠️ **L'«accento» dice da quale lingua viene l'accento di chi parla, non un locale di sintesi.** *`it` =
inglese con accento italiano · `zh` = inglese con accento cinese · un madrelingua prende il codice della
sua varietà, `en-GB`.*

⭐ **La famiglia parla inglese con accento italiano, e si sente.** *Sono italiani, e lo studente si
riconosce nel papà che ha l'accento — non in un madrelingua perfetto.* ⚠️ **Leggero, e con le parole
corrette:** *un modello da imitare che sbaglia le parole distruggerebbe Repeat Aloud.*

**`hostess-gate` è cinese perché l'equipaggio è quello del volo**, e vola avanti e indietro dalla
destinazione. *Il gate è in Italia; la hostess no.*

---

## 7 — GLI SLOT

*Le colonne **chiave** → `placeholderMap`, e tutte insieme → una voce di `personalizationTablesUsed`.*

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `papa` | Nome del papà | `select` | `people.papa` | · | `papa-marco` |
| `mamma` | Nome della mamma | `select` | `people.mamma` | · | `mamma-giulia` |
| `figliaNome` | Nome della figlia | `select` | `people.figlia` | · | `figlia-emma` |
| `figliaEta` | Età della figlia | `select` | `ages.anni` | `eta-12` · `eta-13` · `eta-14` · `eta-15` · `eta-16` · `eta-17` | `eta-16` |
| `figlioNome` | Nome del figlio | `select` | `people.figlio` | · | `figlio-tommaso` |
| `figlioEta` | Età del figlio | `select` | `ages.anni` | `eta-4` · `eta-5` · `eta-6` · `eta-7` · `eta-8` · `eta-9` · `eta-10` · `eta-11` | `eta-8` |
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | · | `cognome-costa` |
| `partenza` | Città di partenza | `select` | `places.departures` | · | `orig-mondovi` |

⚠️ **NESSUN PERSONAGGIO È LO STUDENTE.** *Chi usa l'app può essere chiunque della famiglia: qui si
personalizza **la famiglia**, non sé stessi.* **Fino al 2026-09-26 l'etichetta di `papa` diceva «Nome del
papà / utente» e un avviso la difendeva come «l'unico posto dove è scritto che quello slot è lo studente
stesso» — era sbagliato.**

⚠️ **L'«etichetta» non ha nessuna fonte oltre a questa**, e la schermata Personalizza la mostra.

**La «tabella» è un riferimento a `inglese-it-tabelle-personalizzazione`**, con due forme: *una tabella
del magazzino condiviso, oppure `episode.<qualcosa>` per una tabella dichiarata dentro questo file —
**oggi nessuno la usa**.*

⚠️ **LA COLONNA «RIGHE» serve a prendere un PEZZO di una tabella condivisa.** Un punto `·` vuol dire
«tutta la tabella». *Le età sono l'unico caso: la figlia ne vede sei, il figlio otto.* **E si ELENCANO
gli id, non si dichiara un intervallo:** *un intervallo darebbe per scontato che la tabella sia ordinata
e numerica, e quando smetterà di esserlo **non darà un errore: darà l'insieme sbagliato**.*

**Il «predefinito» è un id di quella tabella**, e un valore salvato fuori elenco **ripiega sul
predefinito** — *la prima riga è solo l'ultima spiaggia.*

---

## 8 — LE TABELLE INTERNE ALL'EPISODIO

*Le righe che valgono **solo per questo episodio**. Finiscono in una chiave di primo livello del JSON, e
l'unico modo di raggiungerle è che uno slot della sezione 7 dica `episode.<nome>.<gruppo>`.*

⚠️ **OGGI QUESTA SEZIONE È VUOTA, E NON È UNA DIMENTICANZA.**

Fino al 2026-09-24 ci stavano le età di `gate` come valori **nudi**: *il codice li trasformava in
`{value, it, en}` tutti e tre uguali, ed è il motivo per cui si leggeva `I'm 16 years old` invece di
`I'm sixteen`.* **Il passo 1.8-bis ③ le ha portate in `ages.anni`** e ha dato agli slot la colonna
«righe».

*La sezione resta perché la forma `episode.<qualcosa>` esiste ancora: una tabella che ha senso solo
dentro una storia non deve finire nel magazzino di tutti.*
