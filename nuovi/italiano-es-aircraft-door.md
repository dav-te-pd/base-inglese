## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 16 voci in A, 5 in B, 5 in C, 9 battute in D, 7 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La **gl** delante de *i* no es una «g» más una «l»: es un solo sonido, la **ll** de España. Fi-**gli**-a, fi-**gli**-o, mo-**glie**. |

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
| `c-i-biglietti-per-favore` | I biglietti, per favore. | Los billetes, por favor. | `d-2` | · |
| `c-lei-e-mia-moglie` | Lei è mia moglie. | Ella es mi esposa. | `d-4` | · |
| `c-lei-e-mia-figlia` | Lei è mia figlia. | Ella es mi hija. | `d-5` | · |
| `c-lui-e-mio-figlio` | Lui è mio figlio. | Él es mi hijo. | `d-5` | · |
| `c-la-famiglia-da-questa-parte` | La famiglia {{cognome}}? Da questa parte, prego. | ¿La familia {{cognome}}? Por aquí, por favor. | `d-7` | · |

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
| `a-biglietti` | biglietti | billetes | bi-GLIET-ti — ⚠️ **«gl» es un solo sonido, la «ll» de España** | sostantivo plurale | · |
| `a-i` | i | los | i | articolo plurale | · |
| `a-per` | per | por / para | per — ⚠️ *una sola preposición donde el español tiene dos* | preposizione | · |
| `a-prego` | prego | pase, adelante | PRE-go | formula di cortesia | · |
| `a-da` | da | de, desde | da | preposizione | · |
| `a-ecco` | ecco | aquí está, he aquí | EC-co | avverbio presentativo | · |
| `a-grazie` | grazie | gracias | GRA-tsie — ⚠️ **la «z» italiana es «ts», no «th»** | formula | · |
| `a-mia` | mia | mi | MI-a | possessivo femminile | `a-mio` |
| `a-mio` | mio | mi | MI-o | possessivo maschile | `a-mia` |
| `a-lei-soggetto` | lei | ella | LEI — ⚠️ **en minúscula es «ella»; con mayúscula, «Lei», es «usted»** | pronome soggetto | · |
| `a-lui` | lui | él | LU-i | pronome soggetto | · |
| `a-moglie` | moglie | esposa | MO-glie — ⚠️ *«gl» como en `figlia`* | sostantivo | · |
| `a-figlia` | figlia | hija | FI-glia | sostantivo | · |
| `a-figlio` | figlio | hijo | FI-glio | sostantivo | · |
| `a-volo` | volo | vuelo | VO-lo | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Benvenuti, y por qué termina en «-i» | "Benvenuti" quiere decir "bienvenidos", y el final cambia según a quién saludas: a un grupo <strong>benvenuti</strong>, a una sola mujer <strong>benvenuta</strong>, a un hombre <strong>benvenuto</strong>.<br>Es lo mismo que hace tu lengua: "bienvenido, bienvenida, bienvenidos".<br>Aquí la azafata habla a cuatro personas, así que dice "benvenuti".<br>No tienes que aprenderlas todas ahora: cuando lleguen los adjetivos, esta ya será una cara conocida. |
| `d-2` | 1 | Biglietti, y el plural que cambia la vocal | "I biglietti" son "los billetes".<br>Y mira el final: uno es un <strong>biglietto</strong>, dos son <strong>biglietti</strong>. El italiano no añade una "s": cambia la última vocal, como has visto con "anno" y "anni".<br>También cambia el artículo: <strong>il</strong> biglietto, <strong>i</strong> biglietti.<br>La "gl" de "biglietti" es un solo sonido, como la "ll" española de "calle": <strong>bi-GLIET-ti</strong>. |
| `d-3` | 1 | Ecco a Lei | Quiere decir "aquí tiene", y es lo que se dice al entregar algo a alguien.<br>No tiene sentido traducida por partes: <strong>funciona toda junta</strong>.<br>"Lei" aquí es el "Lei" de cortesía que viste en el episodio anterior — el papá trata de Lei a la azafata.<br>A un amigo le dirías "Ecco a te". |
| `d-4` | 1 | «lei» y «Lei»: la misma palabra, dos significados | Atención, porque esto es importante: en italiano <strong>"lei" quiere decir "ella", y "Lei" quiere decir "usted"</strong>. Es la misma palabra.<br>Al hablar no hay ninguna diferencia: las distingue solo la frase.<br>Aquí el papá dice "<strong>Lei</strong> è mia moglie" señalando a su mujer: es "ella es mi esposa". En el episodio anterior la azafata preguntaba "E <strong>Lei</strong>?": ahí era "¿y usted?".<br>Escrito, el "Lei" de cortesía lleva <strong>mayúscula</strong>, y esa es la única señal que tienes.<br>No es algo que haya que aprender de memoria: cuando hablas <em>de</em> alguien es "ella", cuando hablas <em>a</em> alguien es "usted". |
| `d-4` | 2 | Mia y mio: dos formas donde tú tienes una | "Mia moglie", "mia figlia", "mio figlio": <strong>en italiano el posesivo cambia con el género</strong> de la persona.<br>Tú dices "mi" para todos. Aquí tienes que elegir: <strong>mia</strong> delante de una palabra femenina, <strong>mio</strong> delante de una masculina.<br>Y algo que te va a venir bien: con los nombres de familia en singular <strong>no se pone el artículo</strong>. Se dice "mia moglie", no "la mia moglie".<br>Con las demás palabras sí hace falta: "la mia casa", "il mio volo". Por ahora te basta la familia. |
| `d-5` | 1 | Cuándo se dice «lei» y «lui» | Como "io", también "lei" y "lui" <strong>se pueden omitir</strong>: "è mia figlia" solo ya se entiende.<br>El papá los pone porque está <strong>señalando a dos personas distintas</strong>: primero una, luego el otro. Sin los pronombres, la azafata no sabría quién es quién.<br>Así que la regla es siempre la misma: el pronombre se pone cuando sirve para distinguir o para insistir.<br>Funciona exactamente como "ella" y "él" en tu lengua. |
| `d-9` | 1 | Buon volo, y la palabra que se acorta | "Buon volo!" es "¡buen vuelo!", y funciona como en tu lengua: <strong>"buono" se vuelve "buon"</strong> delante de un nombre masculino.<br>El español hace exactamente lo mismo: "bueno" se vuelve "buen".<br>Lo vas a oír a menudo: "buon viaggio", "buon giorno", "buon appetito".<br>Y quien lo recibe sonríe y pasa: <strong>no hace falta responder "altrettanto"</strong>. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-porta` | Azafata de la puerta |
| `papa` | Papá |
| `tutti` | Todos |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `cognome` | Apellido de la familia | `select` | `people.cognome` | · | `cognome-garcia` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
