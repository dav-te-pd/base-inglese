## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 13 voci in A, 5 in B, 5 in C, 9 battute in D, 6 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La **j** e la **g** davanti a *e* e *i* sono un raschio in gola: **hi**-ja, **hi**-jo, **G**ente. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | es | it |
|---|---|---|---|---|
| `d-1` | `hostess-porta` | `staff` | ¡Buenos días! Bienvenidos a bordo. | Buongiorno! Benvenuti a bordo. |
| `d-2` | `hostess-porta` | `staff` | Los billetes, por favor. | I biglietti, per favore. |
| `d-3` | `papa` | `family` | Aquí tiene. | Ecco a lei. |
| `d-4` | `papa` | `family` | Ella es mi esposa. | Lei è mia moglie. |
| `d-5` | `papa` | `family` | Ella es mi hija, y él es mi hijo. | Lei è mia figlia, e lui è mio figlio. |
| `d-6` | `hostess-porta` | `staff` | Gracias. | Grazie. |
| `d-7` | `hostess-porta` | `staff` | ¿La familia {{cognome}}? Por aquí, por favor. | La famiglia {{cognome}}? Da questa parte, prego. |
| `d-8` | `tutti` | `family` | ¡Gracias! | Grazie! |
| `d-9` | `hostess-porta` | `staff` | ¡Buen vuelo! | Buon volo! |

### Grado C — le frasi

| id | es | it | da | non con |
|---|---|---|---|---|
| `c-1` | Los billetes, por favor. | I biglietti, per favore. | `d-2` | · |
| `c-2` | Ella es mi esposa. | Lei è mia moglie. | `d-4` | · |
| `c-3` | Ella es mi hija. | Lei è mia figlia. | `d-5` | · |
| `c-4` | Él es mi hijo. | Lui è mio figlio. | `d-5` | · |
| `c-5` | ¿La familia {{cognome}}? Por aquí, por favor. | La famiglia {{cognome}}? Da questa parte, prego. | `d-7` | · |

### Grado B — le espressioni

| id | es | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-bienvenidos-a-bordo` | bienvenidos a bordo | Benvenuti a bordo | bien-ve-NI-dos a BOR-do | formula di accoglienza | · |
| `b-por-favor` | por favor | Per favore / Prego | por fa-VOR | formula di cortesia | · |
| `b-aqui-tiene` | aquí tiene | Ecco a lei | a-KI TIE-ne | espressione idiomatica | · |
| `b-por-aqui` | por aquí | Da questa parte | por a-KI | indicazione | · |
| `b-buen-vuelo` | ¡buen vuelo! | Buon volo! | buen VUE-lo | augurio | · |

### Grado A — le parole

| id | es | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-bienvenidos` | bienvenidos | benvenuti | bien-ve-NI-dos | formula | · |
| `a-billetes` | billetes | biglietti | bi-YE-tes — *la «ll» è come la «y»* | sostantivo plurale | · |
| `a-los` | los | i / gli | los | articolo plurale | · |
| `a-por` | por | per / da | por | preposizione | · |
| `a-aqui` | aquí | qui | a-KI — *l'accento scritto è sulla «i»* | avverbio di luogo | · |
| `a-gracias` | gracias | grazie | GRA-thias — ⚠️ **la «c» davanti a «i» è il «th» di «think»** | formula | · |
| `a-mi` | mi | mio / mia | mi — ⭐ **una forma sola per il maschile e il femminile** | possessivo | · |
| `a-ella` | ella | lei | E-ya | pronome soggetto | · |
| `a-el` | él | lui | el — *l'accento lo distingue da «el», il* | pronome soggetto | · |
| `a-esposa` | esposa | moglie | es-PO-sa | sostantivo | · |
| `a-hija` | hija | figlia | I-ja — ⚠️ **la «h» non si legge, la «j» è un raschio** | sostantivo | · |
| `a-hijo` | hijo | figlio | I-jo | sostantivo | · |
| `a-vuelo` | vuelo | volo | VUE-lo — *la «v» è quasi una «b»* | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Bienvenidos, e perché finisce in «-os» | "Bienvenidos" vuol dire "benvenuti", e la fine cambia con chi stai salutando: a un gruppo <strong>bienvenidos</strong>, a una sola donna <strong>bienvenida</strong>.<br>È la stessa cosa che fa l'italiano: "benvenuto, benvenuta, benvenuti".<br>Qui l'hostess parla a quattro persone, quindi dice "bienvenidos".<br>Non devi impararle tutte adesso: quando arriveranno gli aggettivi, questa sarà già una faccia conosciuta. |
| `d-2` | 1 | Billetes | "Los billetes" sono i biglietti.<br>Una cosa da sapere: in America Latina si dice <strong>boletos</strong>. Sono tutti e due giusti — noi impariamo lo spagnolo di Spagna, e lì è "billetes".<br>La "ll" si dice come una "y": <strong>bi-YE-tes</strong>. La ritroverai in "calle", "llamar", "ella". |
| `d-3` | 1 | Aquí tiene | Vuol dire "ecco a lei", ed è quello che si dice porgendo qualcosa a qualcuno.<br>Alla lettera sarebbe "qui ha", e non ha senso tradotta a pezzi: <strong>funziona tutta insieme</strong>.<br>Il verbo è "tener", quello che hai già visto in "tengo dieciséis años" — qui è alla terza persona perché il papà dà del lei all'hostess.<br>A un amico diresti "aquí tienes". |
| `d-4` | 1 | Mi: una forma sola | "Mi esposa", "mi hija", "mi hijo": <strong>"mi" non cambia</strong>, né al maschile né al femminile.<br>In italiano devi scegliere fra "mia" e "mio". In spagnolo no, e <strong>è una cosa in meno</strong>.<br>Cambia solo al plurale: "mis hijos", i miei figli. |
| `d-5` | 1 | Quando si dice «ella» e «él» | Come "yo", anche "ella" e "él" <strong>si possono saltare</strong>: "es mi hija" da solo si capisce.<br>Il papà li mette perché sta <strong>indicando due persone diverse</strong>: prima una, poi l'altro. Senza i pronomi, l'hostess non saprebbe chi è chi.<br>Quindi la regola è sempre quella: il pronome si mette quando serve a distinguere o a insistere.<br>Attenzione a "él" con l'accento: senza accento, "el" vuol dire "il". |
| `d-9` | 1 | Buen vuelo, e la parola che si accorcia | "¡Buen vuelo!" è "buon volo", e funziona come da noi: "buono" diventa <strong>"buon"</strong> davanti a un nome maschile.<br>Lo spagnolo fa la stessa identica cosa: "bueno" diventa "buen" davanti a un nome maschile.<br>Lo sentirai spesso: "buen viaje", "buen día", "buen provecho".<br>E come "enjoy your flight" in inglese, chi la riceve sorride e passa: <strong>non serve rispondere "altrettanto"</strong>. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-porta` | Hostess alla porta |
| `papa` | Papà |
| `tutti` | Tutti |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | · | `cognome-costa` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
