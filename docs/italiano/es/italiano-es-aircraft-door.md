## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 16 voci in A, 5 in B, 5 in C, 9 battute in D, 7 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La **gl** davanti a *i* non è una «g» più una «l»: è un suono solo, la **ll** della Spagna. Fi-**gli**-a, fi-**gli**-o, mo-**gli**-e. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | it | es |
|---|---|---|---|---|
| `d-1` | `hostess-porta` | `staff` | Buongiorno! Benvenuti a bordo. | ¡Buenos días! Bienvenidos a bordo. |
| `d-2` | `hostess-porta` | `staff` | I biglietti, per favore. | Los billetes, por favor. |
| `d-3` | `papa` | `family` | Ecco a Lei. | Aquí tiene. |
| `d-4` | `papa` | `family` | Lei è mia moglie. | Ella es mi esposa. |
| `d-5` | `papa` | `family` | Lei è mia figlia, e lui è mio figlio. | Ella es mi hija, y él es mi hijo. |
| `d-6` | `hostess-porta` | `staff` | Grazie. | Gracias. |
| `d-7` | `hostess-porta` | `staff` | La famiglia {{cognome}}? Da questa parte, prego. | ¿La familia {{cognome}}? Por aquí, por favor. |
| `d-8` | `tutti` | `family` | Grazie! | ¡Gracias! |
| `d-9` | `hostess-porta` | `staff` | Buon volo! | ¡Buen vuelo! |

### Grado C — le frasi

| id | it | es | da | non con |
|---|---|---|---|---|
| `c-1` | I biglietti, per favore. | Los billetes, por favor. | `d-2` | · |
| `c-2` | Lei è mia moglie. | Ella es mi esposa. | `d-4` | · |
| `c-3` | Lei è mia figlia. | Ella es mi hija. | `d-5` | · |
| `c-4` | Lui è mio figlio. | Él es mi hijo. | `d-5` | · |
| `c-5` | La famiglia {{cognome}}? Da questa parte, prego. | ¿La familia {{cognome}}? Por aquí, por favor. | `d-7` | · |

### Grado B — le espressioni

| id | it | es | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-benvenuti-a-bordo` | benvenuti a bordo | bienvenidos a bordo | ben-ve-NU-ti a BOR-do | formula di accoglienza | · |
| `b-per-favore` | per favore | por favor | per fa-VO-re | formula di cortesia | · |
| `b-ecco-a-lei` | ecco a Lei | aquí tiene | EC-co a LEI | espressione idiomatica | · |
| `b-da-questa-parte` | da questa parte | por aquí | da QUE-sta PAR-te | indicazione | · |
| `b-buon-volo` | buon volo! | ¡buen vuelo! | buon VO-lo | augurio | · |

### Grado A — le parole

| id | it | es | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-benvenuti` | benvenuti | bienvenidos | ben-ve-NU-ti | formula | · |
| `a-biglietti` | biglietti | billetes | bi-GLIET-ti — ⚠️ **«gl» è un suono solo, la «ll» della Spagna** | sostantivo plurale | · |
| `a-i` | i | los | i | articolo plurale | · |
| `a-per` | per | por / para | per — ⚠️ *una sola preposizione dove lo spagnolo ne ha due* | preposizione | · |
| `a-prego` | prego | pase, adelante | PRE-go | formula di cortesia | · |
| `a-da` | da | de, desde | da | preposizione | · |
| `a-ecco` | ecco | aquí está, he aquí | EC-co | avverbio presentativo | · |
| `a-grazie` | grazie | gracias | GRA-tsie — ⚠️ **la «z» italiana è «ts», non «th»** | formula | · |
| `a-mia` | mia | mi | MI-a | possessivo femminile | `a-mio` |
| `a-mio` | mio | mi | MI-o | possessivo maschile | `a-mia` |
| `a-lei` | lei | ella | LEI — ⚠️ **minuscolo è «ella»; con la maiuscola, «Lei», è «usted»** | pronome soggetto | · |
| `a-lui` | lui | él | LU-i | pronome soggetto | · |
| `a-moglie` | moglie | esposa | MO-glie — ⚠️ *«gl» come in `figlia`* | sostantivo | · |
| `a-figlia` | figlia | hija | FI-glia | sostantivo | · |
| `a-figlio` | figlio | hijo | FI-glio | sostantivo | · |
| `a-volo` | volo | vuelo | VO-lo | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Benvenuti, e perché finisce in «-i» | "Benvenuti" vuol dire "bienvenidos", e la fine cambia con chi stai salutando: a un gruppo <strong>benvenuti</strong>, a una sola donna <strong>benvenuta</strong>, a un uomo <strong>benvenuto</strong>.<br>È la stessa cosa che fa la tua lingua: "bienvenido, bienvenida, bienvenidos".<br>Qui l'hostess parla a quattro persone, quindi dice "benvenuti".<br>Non devi impararle tutte adesso: quando arriveranno gli aggettivi, questa sarà già una faccia conosciuta. |
| `d-2` | 1 | Biglietti, e il plurale che cambia la vocale | "I biglietti" sono "los billetes".<br>E guarda la fine: uno è un <strong>biglietto</strong>, due sono <strong>biglietti</strong>. L'italiano non aggiunge una "s": cambia l'ultima vocale, come hai visto con "anno" e "anni".<br>Anche l'articolo cambia: <strong>il</strong> biglietto, <strong>i</strong> biglietti.<br>La "gl" di "biglietti" è un suono solo, come la "ll" spagnola di "calle": <strong>bi-GLIET-ti</strong>. |
| `d-3` | 1 | Ecco a Lei | Vuol dire "aquí tiene", ed è quello che si dice porgendo qualcosa a qualcuno.<br>Non ha senso tradotta a pezzi: <strong>funziona tutta insieme</strong>.<br>"Lei" qui è il "Lei" di cortesia che hai visto al gate — il papà dà del Lei all'hostess.<br>A un amico diresti "Ecco a te". |
| `d-4` | 1 | «lei» e «Lei»: la stessa parola, due significati | Attenzione, perché questa è importante: in italiano <strong>"lei" vuol dire "ella", e "Lei" vuol dire "usted"</strong>. È la stessa parola.<br>A voce non c'è nessuna differenza: le distingue solo la frase.<br>Qui il papà dice "<strong>Lei</strong> è mia moglie" indicando la moglie: è "ella es mi esposa". Al gate l'hostess chiedeva "E <strong>Lei</strong>?": lì era "¿y usted?".<br>Scritto, il "Lei" di cortesia prende la <strong>maiuscola</strong>, e quello è l'unico segno che hai.<br>Non è una cosa da imparare a memoria: quando parli di qualcuno è "ella", quando parli <em>a</em> qualcuno è "usted". |
| `d-4` | 2 | Mia e mio: due forme dove tu ne hai una | "Mia moglie", "mia figlia", "mio figlio": <strong>in italiano il possessivo cambia col genere</strong> della persona.<br>Tu dici "mi" per tutti. Qui devi scegliere: <strong>mia</strong> davanti a una parola femminile, <strong>mio</strong> davanti a una maschile.<br>E una cosa che ti farà comodo: con i nomi di famiglia al singolare <strong>non si mette l'articolo</strong>. Si dice "mia moglie", non "la mia moglie".<br>Con le altre parole invece l'articolo ci vuole: "la mia casa", "il mio volo". Per adesso ti basta la famiglia. |
| `d-5` | 1 | Quando si dice «lei» e «lui» | Come "io", anche "lei" e "lui" <strong>si possono saltare</strong>: "è mia figlia" da solo si capisce.<br>Il papà li mette perché sta <strong>indicando due persone diverse</strong>: prima una, poi l'altro. Senza i pronomi, l'hostess non saprebbe chi è chi.<br>Quindi la regola è sempre quella: il pronome si mette quando serve a distinguere o a insistere.<br>Funziona esattamente come "ella" e "él" nella tua lingua. |
| `d-9` | 1 | Buon volo, e la parola che si accorcia | "Buon volo!" è "¡buen vuelo!", e funziona come da te: <strong>"buono" diventa "buon"</strong> davanti a un nome maschile.<br>Lo spagnolo fa la stessa identica cosa: "bueno" diventa "buen".<br>Lo sentirai spesso: "buon viaggio", "buon giorno", "buon appetito".<br>E chi la riceve sorride e passa: <strong>non serve rispondere "altrettanto"</strong>. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-porta` | Hostess alla porta |
| `papa` | Papà |
| `tutti` | Tutti |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | · | `cognome-garcia` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
