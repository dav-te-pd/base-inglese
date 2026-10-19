## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 15 voci in A, 4 in B, 9 in C, 9 battute in D, 8 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| In italiano l'accento **non si scrive**: si sente, non si vede. Si scrive solo quando cade sull'ultima sillaba — Citt**à** — e su «è», per non confonderlo con «e». |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | it | es |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Buongiorno! Piacere di conoscervi. | ¡Buenos días! ¡Mucho gusto! |
| `d-2` | `papa` | `family` | Buongiorno! Sono {{papa}}. | ¡Buenos días! Soy {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | Di dov'è, {{papa}}? | ¿De dónde es, {{papa}}? |
| `d-4` | `papa` | `family` | Sono di {{partenza}}, {{partenza.paese:target}}. | Soy de {{partenza}}, {{partenza.paese}}. |
| `d-5` | `hostess-gate` | `staff` | E Lei? | ¿Y usted? |
| `d-6` | `mamma` | `family` | Buongiorno! Sono {{mamma}}. | ¡Buenos días! Soy {{mamma}}. |
| `d-7` | `figlia` | `family` | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. | ¡Hola! Soy {{figliaNome}}. Tengo {{figliaEta}} años. |
| `d-8` | `figlio` | `family` | Ciao! Io sono {{figlioNome}}. Ho {{figlioEta}} anni! | ¡Hola! Yo soy {{figlioNome}}. ¡Tengo {{figlioEta}} años! |
| `d-9` | `tutti` | `family` | Siamo la famiglia {{cognome}}! | ¡Somos la familia {{cognome}}! |

### Grado C — le frasi

| id | it | es | da | non con |
|---|---|---|---|---|
| `c-1` | Sono {{papa}}. | Soy {{papa}}. | `d-2` | `c-4` · `c-5` |
| `c-2` | Di dov'è? | ¿De dónde es? | `d-3` | · |
| `c-3` | Sono di {{partenza}}, {{partenza.paese:target}}. | Soy de {{partenza}}, {{partenza.paese}}. | `d-4` | · |
| `c-4` | Sono {{mamma}}. | Soy {{mamma}}. | `d-6` | `c-1` · `c-5` |
| `c-5` | Sono {{figliaNome}}. | Soy {{figliaNome}}. | `d-7` | `c-1` · `c-4` |
| `c-6` | Ho {{figliaEta}} anni. | Tengo {{figliaEta}} años. | `d-7` | `c-8` |
| `c-7` | Io sono {{figlioNome}}. | Yo soy {{figlioNome}}. | `d-8` | · |
| `c-8` | Ho {{figlioEta}} anni. | Tengo {{figlioEta}} años. | `d-8` | `c-6` |
| `c-9` | Siamo la famiglia {{cognome}}! | ¡Somos la familia {{cognome}}! | `d-9` | · |

### Grado B — le espressioni

| id | it | es | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-piacere-di-conoscervi` | piacere di conoscervi | mucho gusto | pia-CE-re di co-NO-scer-vi | espressione idiomatica | · |
| `b-sono-di` | sono di | soy de | SO-no di | verbo `essere` + preposizione | · |
| `b-e-lei` | e Lei? | ¿y usted? | e LEI | espressione | · |
| `b-di-dove` | di dove | de dónde | di DO-ve | espressione interrogativa | · |

### Grado A — le parole

| id | it | es | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-ciao` | ciao | hola | CIAO — ⚠️ **la «ci» italiana è la «ch» spagnola: si dice come «chao»** | saluto | · |
| `a-buongiorno` | buongiorno | buenos días | buon-GIOR-no — ⚠️ *la «gi» è un suono nuovo: è la «y» argentina di «yo»* | saluto di servizio | · |
| `a-piacere` | piacere | placer / gusto | pia-CE-re — *la «ce» è la «che» spagnola* | sostantivo | · |
| `a-sono` | sono | (yo) soy · (ellos) son | SO-no — ⚠️ **una forma per due persone** | verbo `essere` | · |
| `a-e-accentata` | è | (él/ella/usted) es | e — ⚠️ **l'accento si scrive solo per non confonderlo con «e» = «y»** | verbo `essere` | · |
| `a-siamo` | siamo | (nosotros) somos | SIA-mo | verbo `essere` | · |
| `a-ho` | ho | (yo) tengo | o — ⚠️ **la «h» non si legge, e non si può togliere: «o» senza «h» vuol dire «o»** | verbo `avere` | · |
| `a-di` | di | de | di | preposizione | · |
| `a-dove` | dove | dónde | DO-ve — *l'accento cade sulla prima, e non si scrive* | avverbio interrogativo | · |
| `a-e` | e | y | e — ⚠️ *senza accento. Con l'accento, «è», vuol dire «es»* | congiunzione | · |
| `a-lei` | Lei | usted | LEI — ⚠️ **si scrive con la maiuscola quando è di cortesia** | pronome di cortesia | · |
| `a-io` | io | yo | I-o — ⚠️ **due sillabe, e la «i» è una «i»: non si dice «yo»** | pronome soggetto | · |
| `a-anni` | anni | años | AN-ni — ⚠️ **la doppia «n» si sente, ed è lunga: «ani» è un'altra parola** | sostantivo plurale | · |
| `a-la` | la | la | la | articolo | · |
| `a-famiglia` | famiglia | familia | fa-MI-glia — ⚠️ *«gli» si dice come la «ll» della Spagna* | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Buongiorno e ciao | "Buongiorno" lo dice chi lavora, "ciao" lo dici a un amico — e sono <strong>tutti due corretti</strong>.<br>Nel dialogo lo senti: l'hostess e i genitori dicono "buongiorno", i figli "ciao".<br>Una cosa che lo spagnolo non fa: <strong>"ciao" vale anche per salutare quando si va via</strong>. È "hola" e "adiós" in una parola sola.<br>E "buongiorno" si usa fino al pomeriggio; dopo cambia, e lo vedremo più avanti. |
| `d-1` | 2 | Piacere | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale. È il tuo "mucho gusto".<br>Non tradurla parola per parola: "piacere di conoscervi" funziona tutta insieme.<br>Dalla seconda volta che vedi una persona non si usa più: lì basta "Ciao!".<br>E una buona notizia: <strong>"piacere" non cambia se lo dice un uomo o una donna</strong>, esattamente come "mucho gusto". |
| `d-3` | 1 | Dare del «lei»: Lei | Per dare del "lei" si usa <strong>Lei</strong>, e il verbo va alla terza persona — <strong>esattamente come il tuo "usted"</strong>.<br>"Di dov'è {{papa:target}}?" è "¿De dónde es {{papa:native}}?". A un amico l'hostess direbbe "Di dove sei?".<br>Quindi qui non c'è un meccanismo nuovo da imparare: c'è una parola nuova, "Lei" — e si scrive con la <strong>maiuscola</strong>.<br>Si dà del "Lei" a chi lavora, a chi non conosci, a chi è più grande di te. Fra amici e in famiglia, "tu".<br>E al plurale l'italiano ha <strong>una forma sola</strong>: "voi". Dove tu scegli fra "vosotros" e "ustedes", qui non devi scegliere — <strong>è un punto in cui l'italiano ha una parola in meno della tua lingua</strong>. |
| `d-4` | 1 | Dire di dove vieni | "Sono di {{partenza:target}}" vuol dire "soy de {{partenza:native}}": <strong>identico allo spagnolo</strong>, anche il verbo.<br>"Di" significa "de". La userai tantissimo.<br>Domanda e risposta hanno le stesse parole: "Di dov'è?" → "Sono di…". Se impari una, hai già l'altra.<br>Una cosa che noterai: il tuo nome resta il tuo — Carlos è Carlos anche in italiano. La tua città invece spesso cambia davvero: {{partenza:native}} diventa <strong>{{partenza:target}}</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | E Lei? | Vuol dire "¿y usted?", e serve a rimandare la stessa domanda a un'altra persona senza ripeterla tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "E Lei?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br>Con un amico diventa "E tu?". |
| `d-7` | 1 | Dire quanti anni hai | "Ho {{figliaEta:target}} anni" vuol dire "tengo {{figliaEta:native}} años": <strong>uguale allo spagnolo</strong>, anche il verbo.<br>Una cosa da ricordare: <strong>"anni" non si può togliere</strong>. "Ho sedici" da solo non si dice — come "tengo dieciséis" nella tua lingua.<br>E attenzione a una cosa che non si vede: "ho" si scrive con l'<strong>h</strong>, che non si sente. Senza l'h, "o" vuol dire "o".<br>"Avere" è il verbo tenere, e lo ritroverai ovunque: "ho fame", "ho un fratello". |
| `d-7` | 2 | Il plurale cambia la vocale | Questa è la cosa più importante della lezione, e non è una parola: è un <strong>meccanismo</strong>.<br>In italiano il plurale <strong>non aggiunge una «s»</strong>: cambia l'ultima vocale. "Anno" fa "<strong>anni</strong>", non "annos".<br>"Famiglia" fa "famigli<strong>e</strong>". "Padre" fa "padr<strong>i</strong>".<br>È l'errore che fanno tutti all'inizio, e si sente subito. Per adesso ti basta una cosa: <strong>quando senti un plurale italiano, ascolta l'ultima lettera</strong>.<br>Ci sarà un episodio intero su questo. |
| `d-8` | 1 | Quando si mette «io» | In italiano "io, tu, lui" <strong>si saltano</strong>, come nella tua lingua — e quando ci sono, servono a insistere.<br>La figlia dice "Sono {{figliaNome:target}}". Il figlio dice "<strong>Io</strong> sono {{figlioNome:target}}": sono tutti due giusti.<br>Il figlio ci mette "io" perché vuole farsi notare — come quando un bambino dice "<strong>¡YO</strong> soy {{figlioNome:native}}!".<br>Quindi, se non hai un motivo per insistere, lascialo fuori: "sono" basta. |

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
| `papa` | Nome del papà | `select` | `people.papa` | · | `papa-carlos` |
| `mamma` | Nome della mamma | `select` | `people.mamma` | · | `mamma-maria` |
| `figliaNome` | Nome della figlia | `select` | `people.figlia` | · | `figlia-sofia` |
| `figliaEta` | Età della figlia | `select` | `ages.anni` | `eta-12` · `eta-13` · `eta-14` · `eta-15` · `eta-16` · `eta-17` | `eta-16` |
| `figlioNome` | Nome del figlio | `select` | `people.figlio` | · | `figlio-mateo` |
| `figlioEta` | Età del figlio | `select` | `ages.anni` | `eta-4` · `eta-5` · `eta-6` · `eta-7` · `eta-8` · `eta-9` · `eta-10` · `eta-11` | `eta-8` |
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | · | `cognome-garcia` |
| `partenza` | Città di partenza | `select` | `places.departures` | · | `orig-mexico` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
