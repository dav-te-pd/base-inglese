## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 11 voci in A, 7 in B, 9 in C, 9 battute in D, 8 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La "e" finale in inglese non si legge quasi mai. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Hello! Nice to meet you. | Ciao! Piacere di conoscervi. |
| `d-2` | `papa` | `family` | Hello! I am {{papa}}. | Ciao! Sono {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | Where are you from, {{papa}}? | Di dove sei, {{papa}}? |
| `d-4` | `papa` | `family` | I am from {{partenza}}, {{partenza.paese:target}}. | Vengo da {{partenza}}, in {{partenza.paese}}. |
| `d-5` | `hostess-gate` | `staff` | And you? | E tu? |
| `d-6` | `mamma` | `family` | Hello! I am {{mamma}}. | Ciao! Sono {{mamma}}. |
| `d-7` | `figlia` | `family` | Hi! I'm {{figliaNome}}. I'm {{figliaEta}} years old. | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. |
| `d-8` | `figlio` | `family` | Hi! I'm {{figlioNome}}. I'm {{figlioEta}}. | Ciao! Sono {{figlioNome}}. Ho {{figlioEta}} anni. |
| `d-9` | `tutti` | `family` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! |

### Grado C — le frasi

| id | en | it | da | non con |
|---|---|---|---|---|
| `c-1` | I am {{papa}}. | Sono {{papa}}. | `d-2` | `c-4` · `c-5` · `c-7` |
| `c-2` | Where are you from? | Di dove sei? | `d-3` | · |
| `c-3` | I am from {{partenza}}, {{partenza.paese:target}}. | Vengo da {{partenza}}, in {{partenza.paese}}. | `d-4` | · |
| `c-4` | I am {{mamma}}. | Sono {{mamma}}. | `d-6` | `c-1` · `c-5` · `c-7` |
| `c-5` | I'm {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` | `c-1` · `c-4` · `c-7` |
| `c-6` | I'm {{figliaEta}} years old. | Ho {{figliaEta}} anni. | `d-7` | `c-8` |
| `c-7` | I'm {{figlioNome}}. | Sono {{figlioNome}}. | `d-8` | `c-1` · `c-4` · `c-5` |
| `c-8` | I'm {{figlioEta}}. | Ho {{figlioEta}} anni. | `d-8` | `c-6` |
| `c-9` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! | `d-9` | · |

### Grado B — le espressioni

| id | en | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-i-am` | I am | (io) sono, forma piena | ai am | pronome + verbo essere | · |
| `b-im` | I'm | (io) sono, forma corta | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere, contratto | · |
| `b-we-are` | we are | (noi) siamo | ui ar | pronome + verbo essere | · |
| `b-nice-to-meet-you` | nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica | · |
| `b-i-am-from` | I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione | · |
| `b-and-you` | and you? | E tu? / E voi? | and IU — accento su "you" | espressione | · |
| `b-years-old` | years old | anni (di età) | i-ars OULD | espressione per l'età | · |

### Grado A — le parole

| id | en | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-hello` | hello | Salve | hel-LOU — la "h" è un soffio leggero | saluto | · |
| `a-hi` | hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto | · |
| `a-nice` | nice | bello / piacevole | nais | aggettivo | · |
| `a-meet` | meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo | · |
| `a-where` | where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo | · |
| `a-from` | from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione | · |
| `a-and` | and | e | and — la "d" finale si sente appena | congiunzione | · |
| `a-years` | years | anni | i-ars — parte con un suono di "i" | sostantivo | · |
| `a-old` | old | vecchio (di età) | ould — la "o" è lunga | aggettivo | · |
| `a-the` | the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo | · |
| `a-family` | family | famiglia | FA-mi-li — accento sulla prima | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Hello e Hi | Sono i due modi normali di salutare.<br>"Hello" è un po' più educato — in italiano è più vicino a "Salve". "Hi" è più amichevole: è il nostro "Ciao". Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".<br>Nessuno dei due è sbagliato. Se sei in dubbio, "Hello" va bene sempre, con chiunque. |
| `d-1` | 2 | Nice to meet you | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!". |
| `d-3` | 1 | Chiedere da dove viene qualcuno | "Where are you from?" vuol dire "di dove sei?".<br>"Where" significa "dove". E la formula funziona tutta insieme: è così che si chiede l'origine di qualcuno.<br>Il papà risponde "I am from {{partenza:target}}" — la stessa struttura, girata.<br>Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra. |
| `d-4` | 1 | Dire da dove vieni | "I am from {{partenza:target}}" vuol dire "vengo da {{partenza:native}}".<br>Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".<br>"From" significa "da". La userai tantissimo.<br>Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in inglese. La tua città a volte cambia: Torino diventa <strong>Turin</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | And you? | Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br><strong>E nota "you":</strong> due battute fa l'hostess l'ha detto a tutta la famiglia — "nice to meet <strong>you</strong>", cioè <strong>voi</strong>. Adesso lo dice solo alla mamma, e vuol dire <strong>tu</strong>. È la stessa parola: l'inglese non ne ha due. |
| `d-7` | 1 | I am e I'm | Il papà dice "I am {{papa:target}}", la figlia dice "I'm {{figliaNome:target}}". Sono la stessa cosa: "I'm" è solo la forma corta.<br>Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".<br><strong>La forma corta vale sempre, non solo con i nomi:</strong> "I'm from Turin" è uguale a "I am from Turin".<br>Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.<br>Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. <strong>In inglese non si può:</strong> "I" ci deve essere sempre. Non esiste dire "am Marco". |
| `d-8` | 1 | Dire quanti anni hai | La figlia dice "I'm {{figliaEta:target}} <strong>years old</strong>". Il figlio dice solo "I'm {{figlioEta:target}}".<br>Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.<br>Attenzione a una cosa: in inglese <strong>non si usa il verbo avere</strong> per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".<br>Ricordatelo, perché è la differenza più grande con l'italiano. |
| `d-9` | 1 | We are | "We are" vuol dire "noi siamo".<br>Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.<br>Nota che in inglese il cognome va <strong>prima</strong> della parola "family", al contrario dell'italiano. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-gate` | Hostess al gate |
| `papa` | Papà |
| `mamma` | Mamma |
| `figlia` | Figlia |
| `figlio` | Figlio |
| `tutti` | Tutti |

## 7 — GLI SLOT

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

## 8 — LE TABELLE INTERNE ALL'EPISODIO
