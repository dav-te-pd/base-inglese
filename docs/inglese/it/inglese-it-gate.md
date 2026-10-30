## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 11 voci in A, 8 in B, 9 in C, 9 battute in D, 9 skill, 6 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La "e" finale in inglese non si legge quasi mai. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Good morning! Nice to meet you. | Buongiorno! Piacere di conoscervi. |
| `d-2` | `papa` | `family` | Good morning! I am {{papa}}. | Buongiorno! Sono {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | Where are you from, {{papa}}? | Di dov'è, {{papa}}? |
| `d-4` | `papa` | `family` | I am from {{partenza}}, {{partenza.paese:target}}. | Vengo da {{partenza}}, in {{partenza.paese}}. |
| `d-5` | `hostess-gate` | `staff` | And you? | E Lei? |
| `d-6` | `mamma` | `family` | Good morning! I am {{mamma}}. | Buongiorno! Sono {{mamma}}. |
| `d-7` | `figlia` | `family` | Hi! I'm {{figliaNome}}. I'm sixteen years old. | Ciao! Sono {{figliaNome}}. Ho 16 anni. |
| `d-8` | `figlio` | `family` | Hi! I am {{figlioNome}}! I'm eight years old. | Ciao! Io sono {{figlioNome}}! Ho 8 anni. |
| `d-9` | `tutti` | `family` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! |

### Grado C — le frasi

| id | en | it | da | non con |
|---|---|---|---|---|
| `c-i-am-papa` | I am {{papa}}. | Sono {{papa}}. | `d-2` | `c-i-am-mamma` · `c-im-figlia` |
| `c-where-are-you-from` | Where are you from? | Di dov'è? | `d-3` | · |
| `c-i-am-from-partenza` | I am from {{partenza}}, {{partenza.paese:target}}. | Vengo da {{partenza}}, in {{partenza.paese}}. | `d-4` | · |
| `c-i-am-mamma` | I am {{mamma}}. | Sono {{mamma}}. | `d-6` | `c-i-am-papa` · `c-im-figlia` |
| `c-im-figlia` | I'm {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` | `c-i-am-papa` · `c-i-am-mamma` |
| `c-im-sixteen-years-old` | I'm sixteen years old. | Ho 16 anni. | `d-7` | · |
| `c-i-am-figlio` | I am {{figlioNome}}. | Io sono {{figlioNome}}. | `d-8` | · |
| `c-im-eight-years-old` | I'm eight years old. | Ho 8 anni. | `d-8` | · |
| `c-we-are-the-family` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! | `d-9` | · |

### Grado B — le espressioni

| id | en | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-good-morning` | good morning | Buongiorno | gud MOR-ning | saluto di servizio | · |
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
| `a-hi` | hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto | · |
| `a-morning` | morning | mattina | MOR-ning — la "g" finale non si sente | sostantivo | · |
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
| `d-1` | 1 | Good morning e Hi | "Good morning" lo dice chi lavora, "Hi" lo dici a un amico — e sono <strong>tutti due corretti</strong>.<br>Nel dialogo lo senti: l'hostess e i genitori dicono "Good morning", i figli "Hi".<br>Una cosa da sapere: "good morning" vale <strong>solo fino a mezzogiorno</strong>. Dopo cambia, e lo vedremo più avanti.<br>E se sei in dubbio con qualcuno che non conosci, "Hello" va bene sempre: è a metà strada fra i due. |
| `d-1` | 2 | Nice to meet you | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hi!". |
| `d-3` | 1 | Chiedere da dove viene qualcuno | "Where are you from?" vuol dire "di dov'è?".<br>"Where" significa "dove". E la formula funziona tutta insieme: è così che si chiede l'origine di qualcuno.<br>Il papà risponde "I am from {{partenza:target}}" — la stessa struttura, girata.<br>Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra. |
| `d-4` | 1 | Dire da dove vieni | "I am from {{partenza:target}}" vuol dire "vengo da {{partenza:native}}".<br>Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".<br>"From" significa "da". La userai tantissimo.<br>Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in inglese. La tua città a volte cambia: Torino diventa <strong>Turin</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | And you? | Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br><strong>E nota "you":</strong> due battute fa l'hostess l'ha detto a tutta la famiglia — "nice to meet <strong>you</strong>", cioè <strong>voi</strong>. Adesso lo dice solo alla mamma, e vuol dire <strong>tu</strong>. È la stessa parola: l'inglese non ne ha due. |
| `d-7` | 1 | I am e I'm | Il papà dice "I am {{papa:target}}", la figlia dice "I'm {{figliaNome:target}}". Sono la stessa cosa: "I'm" è solo la forma corta.<br>Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".<br><strong>La forma corta vale sempre, non solo con i nomi:</strong> "I'm from Turin" è uguale a "I am from Turin".<br>Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.<br>Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. <strong>In inglese non si può:</strong> "I" ci deve essere sempre. Non esiste dire "am Marco".<br>E c'è un caso in cui la forma piena dice una cosa in più: lo senti nella battuta del figlio, qui sotto. |
| `d-8` | 1 | Quando «I am» insiste | Le due forme le hai già viste: "I'm" è la corta, "I am" la piena. Qui la piena fa una cosa in più.<br>La figlia dice "<strong>I'm</strong> {{figliaNome:target}}". Il figlio dice "<strong>I am</strong> {{figlioNome:target}}": <strong>sta insistendo</strong> — come quando un bambino dice "<strong>IO</strong> sono {{figlioNome:native}}!".<br>Non è una regola di grammatica, è il tono: la forma lunga pesa di più, e si sente.<br>Quindi, se non hai un motivo per insistere, usa la corta: "I'm" basta. |
| `d-8` | 2 | Dire quanti anni hai | "I'm eight <strong>years old</strong>" vuol dire "ho 8 anni".<br>Attenzione a una cosa: in inglese <strong>non si usa il verbo avere</strong> per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".<br>Ricordatelo, perché è la differenza più grande con l'italiano.<br>E "years old" si può togliere: "I'm ten" da solo si dice, ed è molto comune. |
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

| chiave | etichetta | tipo | tabella | predefinito |
|---|---|---|---|---|
| `papa` | Nome del papà | `select` | `people.papa` | `papa-marco` |
| `mamma` | Nome della mamma | `select` | `people.mamma` | `mamma-giulia` |
| `figliaNome` | Nome della figlia | `select` | `people.figlia` | `figlia-emma` |
| `figlioNome` | Nome del figlio | `select` | `people.figlio` | `figlio-tommaso` |
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | `cognome-rossi` |
| `partenza` | Città di partenza | `select` | `places.departures` | `orig-mondovi` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
