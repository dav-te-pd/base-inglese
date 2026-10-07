## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 16 voci in A, 4 in B, 9 in C, 9 battute in D, 7 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| L'accento scritto dice dove cade la voce: **dí**-as, **dón**-de. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | es | it |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | ¡Buenos días! Mucho gusto. | Buongiorno! Piacere di conoscervi. |
| `d-2` | `papa` | `family` | ¡Buenos días! Soy {{papa}}. | Buongiorno! Sono {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | ¿De dónde es, {{papa}}? | Di dov'è, {{papa}}? |
| `d-4` | `papa` | `family` | Soy de {{partenza}}, {{partenza.paese:target}}. | Sono di {{partenza}}, {{partenza.paese}}. |
| `d-5` | `hostess-gate` | `staff` | ¿Y usted? | E lei? |
| `d-6` | `mamma` | `family` | ¡Buenos días! Soy {{mamma}}. | Buongiorno! Sono {{mamma}}. |
| `d-7` | `figlia` | `family` | ¡Hola! Soy {{figliaNome}}. Tengo {{figliaEta}} años. | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. |
| `d-8` | `figlio` | `family` | ¡Hola! Yo soy {{figlioNome}}. ¡Tengo {{figlioEta}} años! | Ciao! Io sono {{figlioNome}}. Ho {{figlioEta}} anni! |
| `d-9` | `tutti` | `family` | ¡Somos la familia {{cognome}}! | Siamo la famiglia {{cognome}}! |

### Grado C — le frasi

| id | es | it | da | non con |
|---|---|---|---|---|
| `c-1` | Soy {{papa}}. | Sono {{papa}}. | `d-2` | `c-4` · `c-5` |
| `c-2` | ¿De dónde es? | Di dov'è? | `d-3` | · |
| `c-3` | Soy de {{partenza}}, {{partenza.paese:target}}. | Sono di {{partenza}}, {{partenza.paese}}. | `d-4` | · |
| `c-4` | Soy {{mamma}}. | Sono {{mamma}}. | `d-6` | `c-1` · `c-5` |
| `c-5` | Soy {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` | `c-1` · `c-4` |
| `c-6` | Tengo {{figliaEta}} años. | Ho {{figliaEta}} anni. | `d-7` | `c-8` |
| `c-7` | Yo soy {{figlioNome}}. | Io sono {{figlioNome}}. | `d-8` | · |
| `c-8` | Tengo {{figlioEta}} años. | Ho {{figlioEta}} anni. | `d-8` | `c-6` |
| `c-9` | ¡Somos la familia {{cognome}}! | Siamo la famiglia {{cognome}}! | `d-9` | · |

### Grado B — le espressioni

| id | es | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-buenos-dias` | buenos días | Buongiorno | BUE-nos DI-as | saluto di servizio | · |
| `b-mucho-gusto` | mucho gusto | Piacere di conoscerti / conoscervi | MU-cio GUS-to | espressione idiomatica | · |
| `b-soy-de` | soy de | Sono di / Vengo da | soi de | verbo `ser` + preposizione | · |
| `b-y-usted` | ¿y usted? | E lei? | i us-TE | espressione | · |

### Grado A — le parole

| id | es | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-hola` | hola | Ciao / Salve | O-la — **la «h» non si legge**, come in italiano | saluto | · |
| `a-dias` | días | giorni | DI-as — *l'accento scritto è sulla «i»* | sostantivo | · |
| `a-mucho` | mucho | molto | MU-cio — ⚠️ **la «ch» spagnola è la «c» di «ciao»** | avverbio di quantità | · |
| `a-gusto` | gusto | piacere | GUS-to | sostantivo | · |
| `a-soy` | soy | (io) sono | soi — *una sillaba* | verbo `ser` | · |
| `a-es` | es | (lui/lei) è · (lei) è | es | verbo `ser` | · |
| `a-somos` | somos | (noi) siamo | SO-mos | verbo `ser` | · |
| `a-tengo` | tengo | (io) ho | TEN-go — *la «g» è dura, come in «gatto»* | verbo `tener` | · |
| `a-de` | de | di / da | de | preposizione | · |
| `a-donde` | dónde | dove | DON-de — *l'accento scritto è sulla prima* | avverbio interrogativo | · |
| `a-y` | y | e | i — **si legge «i», non «ipsilon»** | congiunzione | · |
| `a-usted` | usted | lei *(di cortesia)* | us-TE — ⚠️ **la «d» finale non si sente quasi** | pronome di cortesia | · |
| `a-yo` | yo | io | **GIO** — ⚠️ *a inizio frase la «y» spagnola somiglia alla nostra «gi» di «gioco»* | pronome soggetto | · |
| `a-anos` | años | anni | A-gnos — **la «ñ» è il nostro «gn»** | sostantivo plurale | · |
| `a-la` | la | la | la | articolo | · |
| `a-familia` | familia | famiglia | fa-MI-lia — *accento come in italiano* | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Buenos días e hola | "Buenos días" lo dice chi lavora, "hola" lo dici a un amico — e sono <strong>tutti due corretti</strong>.<br>Nel dialogo lo senti: l'hostess e i genitori dicono "buenos días", i figli "hola".<br>"Hola" va bene sempre, con chiunque: se sei in dubbio, è la scelta sicura.<br>Una cosa da sapere: "buenos días" vale <strong>solo fino a mezzogiorno</strong>. Dopo cambia, e lo vedremo più avanti. |
| `d-1` | 2 | Mucho gusto | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più: lì basta "¡Hola!".<br>Esiste anche "encantado", ed è giusto — ma <strong>cambia se lo dice un uomo o una donna</strong>. "Mucho gusto" va bene per tutti, e per ora è quella che ti serve. |
| `d-3` | 1 | Dare del «lei»: usted | Per dare del "lei" si usa <strong>usted</strong>, e il verbo va alla terza persona — <strong>esattamente come in italiano</strong>.<br>"¿De dónde es {{papa:target}}?" è "Lei di dov'è?". A un amico l'hostess direbbe "¿De dónde eres?", cioè "Di dove sei?".<br>Quindi qui non c'è un meccanismo nuovo da imparare: c'è una parola nuova, "usted".<br>Si dà del "usted" a chi lavora, a chi non conosci, a chi è più grande di te. Fra amici e in famiglia, "tú".<br>E al plurale ce ne sono <strong>due</strong>: "vosotros" fra amici, "ustedes" quando dai del lei a più persone.<br>In italiano diciamo "voi" in tutti e due i casi: <strong>è un punto in cui lo spagnolo ha una parola in più di noi</strong>. |
| `d-4` | 1 | Dire da dove vieni | "Soy de {{partenza:target}}" vuol dire "sono di {{partenza:native}}": <strong>identico all'italiano</strong>, anche il verbo.<br>"De" significa "di, da". La userai tantissimo.<br>Domanda e risposta hanno le stesse parole: "¿De dónde es?" → "Soy de…". Se impari una, hai già l'altra.<br>Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in spagnolo. La tua città a volte cambia un accento: Torino diventa <strong>Turín</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | ¿Y usted? | Vuol dire "e lei?", e serve a rimandare la stessa domanda a un'altra persona senza ripeterla tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "¿Y usted?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br>Con un amico diventa "¿Y tú?". |
| `d-7` | 1 | Dire quanti anni hai | "Tengo {{figliaEta:target}} años" vuol dire "ho {{figliaEta:native}} anni": <strong>uguale all'italiano</strong>, anche il verbo.<br>Una cosa da ricordare: <strong>"años" non si può togliere</strong>. "Tengo dieciséis" da solo non si dice, mentre in italiano "ho sedici" si capirebbe.<br>"Tener" è il verbo avere, e lo ritroverai ovunque: "tengo hambre", "tengo un hermano". |
| `d-8` | 1 | Quando si mette «yo» | In spagnolo "io, tu, lui" <strong>si saltano</strong>, come in italiano — e quando ci sono, servono a insistere.<br>La figlia dice "Soy {{figliaNome:target}}". Il figlio dice "<strong>Yo</strong> soy {{figlioNome:target}}": sono tutti due giusti.<br>Il figlio ci mette "yo" perché vuole farsi notare — come quando un bambino dice "<strong>IO</strong> sono {{figlioNome:native}}!".<br>Quindi, se non hai un motivo per insistere, lascialo fuori: "soy" basta. |

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
