## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 12 voci in A, 6 in B, 5 in C, 9 battute in D, 8 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| L'accento inglese quasi mai cade dove lo metterebbe un italiano: la sillaba scritta in maiuscolo te lo dice. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `hostess-porta` | `staff` | Good morning! Welcome aboard. | Buongiorno! Benvenuti a bordo. |
| `d-2` | `hostess-porta` | `staff` | Your tickets, please. | I biglietti, per favore. |
| `d-3` | `papa` | `family` | Here they are. | Eccoli. |
| `d-4` | `papa` | `family` | She is my wife. | Lei è mia moglie. |
| `d-5` | `papa` | `family` | She is my daughter, he is my son. | Lei è mia figlia, lui è mio figlio. |
| `d-6` | `hostess-porta` | `staff` | Thank you. | Grazie. |
| `d-7` | `hostess-porta` | `staff` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. |
| `d-8` | `tutti` | `family` | Thank you! | Grazie! |
| `d-9` | `hostess-porta` | `staff` | Enjoy your flight! | Buon volo! |

### Grado C — le frasi

| id | en | it | da |
|---|---|---|---|
| `c-1` | Your tickets, please. | I biglietti, per favore. | `d-2` |
| `c-2` | She is my wife. | Lei è mia moglie. | `d-4` |
| `c-3` | She is my daughter. | Lei è mia figlia. | `d-5` |
| `c-4` | He is my son. | Lui è mio figlio. | `d-5` |
| `c-5` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. | `d-7` |

### Grado B — le espressioni

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `b-good-morning` | good morning | buongiorno | gud MOR-ning | saluto |
| `b-welcome-aboard` | welcome aboard | benvenuti a bordo | UEL-com a-BORD | formula di accoglienza |
| `b-here-they-are` | here they are | eccoli | hia dei ar | espressione |
| `b-thank-you` | thank you | grazie | THENK iu — la "th" fra i denti | formula di cortesia |
| `b-this-way-please` | this way, please | da questa parte, prego | dis UEI pliiz | indicazione di direzione |
| `b-enjoy-your-flight` | enjoy your flight | buon volo | en-GIOI ior flait | formula di congedo |

### Grado A — le parole

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `a-morning` | morning | mattina | MOR-ning | sostantivo |
| `a-welcome` | welcome | benvenuto | UEL-com — la "e" finale non si legge | espressione di accoglienza |
| `a-tickets` | tickets | biglietti | TI-chets — la "ck" è una "c" dura sola | sostantivo plurale |
| `a-here` | here | qui | hia — la "h" è un soffio, la "e" finale muta | avverbio di luogo |
| `a-they` | they | loro | dei — la "th" è la lingua fra i denti | pronome |
| `a-she` | she | lei | scii — lunga | pronome |
| `a-he` | he | lui | hii — con il soffio davanti | pronome |
| `a-wife` | wife | moglie | uaif — la "e" finale non si legge | sostantivo, famiglia |
| `a-daughter` | daughter | figlia | DO-ter — **la "gh" non si legge affatto** | sostantivo, famiglia |
| `a-son` | son | figlio | san — **non "son" come in italiano** | sostantivo, famiglia |
| `a-enjoy` | enjoy | godersi | en-GIOI | verbo |
| `a-flight` | flight | volo | flait — **la "gh" muta, come in daughter** | sostantivo |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Buongiorno | "Good morning" si usa fino a mezzogiorno, poi diventa "good afternoon", e dalla sera "good evening".<br>È più formale di "Hello" e "Hi": lo senti da chi lavora — l'hostess, il receptionist, il cameriere.<br>Con un amico dici "Hi". Con chi ti sta servendo, "Good morning". |
| `d-1` | 2 | Welcome | Vuol dire "benvenuto", e si usa quando qualcuno arriva in un posto.<br>"Aboard" significa "a bordo": vale per aerei, navi, treni.<br>Lo sentirai spesso: "Welcome to London", "Welcome to our hotel". <strong>La formula è sempre "welcome to" più il posto</strong> — tranne "aboard", che va da solo. |
| `d-2` | 1 | Please | "Please" vuol dire "per favore", e si mette <strong>alla fine</strong> della richiesta: "Your tickets, please", "Coffee, please".<br>In italiano lo diciamo spesso all'inizio — "per favore, i biglietti" — in inglese quasi sempre in fondo.<br>È la parola che rende gentile qualsiasi richiesta. Senza, "your tickets" suona come un ordine. |
| `d-3` | 1 | Eccoli | Si dice quando dai qualcosa a qualcuno, o quando la cosa che cercavi salta fuori.<br>Se è una cosa sola: "Here it is". Se sono più d'una: "Here they are".<br>I biglietti sono quattro, quindi "they". |
| `d-4` | 1 | He is, she is | Conosci già "I am" e "we are". Quando parli di <strong>un'altra persona</strong> il verbo diventa "is": "he is" per un uomo, "she is" per una donna.<br>Anche qui il pronome non si può saltare: non esiste dire "is my wife".<br>E nota "my": vuol dire "mio, mia". Ne esistono altri — li vedrai poi. |
| `d-5` | 1 | La famiglia | "Wife" è la moglie, "daughter" la figlia, "son" il figlio.<br>Attenzione a "son": si dice <strong>san</strong>, non "son" come lo leggeresti in italiano.<br>Il papà dice queste tre parole perché è lui che parla. <strong>La mamma direbbe "husband" per il marito, e i figli direbbero "mother" e "father"</strong> — le imparerai quando toccherà a loro. |
| `d-7` | 1 | Indicare la direzione | "This way" vuol dire "da questa parte", ed è il modo normale di indicare dove andare.<br>Nota che non c'è nessuna preposizione: non si dice "in this way" né "to this way". <strong>Due parole e basta.</strong><br>E attenzione a "please": qui <strong>non è "per favore"</strong>. L'hostess non ti sta chiedendo niente, ti sta invitando — in italiano diventa <strong>"prego"</strong>.<br><strong>Stessa parola, due significati</strong>, e li hai visti tutti e due in questo dialogo. |
| `d-9` | 1 | Qui il dialogo finisce | "Enjoy your flight" vuol dire "buon volo", e la sentirai in mille versioni: "enjoy your meal", "enjoy your stay", "enjoy your day".<br><strong>Una cosa importante: qui la conversazione è finita.</strong> In italiano risponderemmo — "grazie, altrettanto" — ma in inglese questa formula <strong>chiude da sé</strong>. Chi la riceve sorride e passa.<br>Non è maleducazione: è che la frase è già un saluto. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-porta` | Hostess alla porta |
| `papa` | Papà |
| `tutti` | Tutti |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `destinazione` | Destinazione del viaggio | `select` | `places.destinations` | · | `dest-pechino` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
