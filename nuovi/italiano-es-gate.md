## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 15 voci in A, 4 in B, 9 in C, 9 battute in D, 8 skill, 6 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| En italiano el acento **no se escribe**: se oye, no se ve. Solo se escribe cuando cae en la última sílaba — Citt**à** — y en «è», para no confundirlo con «e». |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | it | es |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Buongiorno! Piacere di conoscervi. | ¡Buenos días! Mucho gusto. |
| `d-2` | `papa` | `family` | Buongiorno! Sono {{papa}}. | ¡Buenos días! Soy {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | Di dov'è, {{papa}}? | ¿De dónde es, {{papa}}? |
| `d-4` | `papa` | `family` | Sono di {{partenza}}, {{partenza.paese:target}}. | Soy de {{partenza}}, {{partenza.paese}}. |
| `d-5` | `hostess-gate` | `staff` | E Lei? | ¿Y usted? |
| `d-6` | `mamma` | `family` | Buongiorno! Sono {{mamma}}. | ¡Buenos días! Soy {{mamma}}. |
| `d-7` | `figlia` | `family` | Ciao! Sono {{figliaNome}}. Ho sedici anni. | ¡Hola! Soy {{figliaNome}}. Tengo 16 años. |
| `d-8` | `figlio` | `family` | Ciao! Io sono {{figlioNome}}. Ho otto anni! | ¡Hola! Yo soy {{figlioNome}}. ¡Tengo 8 años! |
| `d-9` | `tutti` | `family` | Siamo la famiglia {{cognome}}! | ¡Somos la familia {{cognome}}! |

### Grado C — le frasi

| id | it | es | da | non con |
|---|---|---|---|---|
| `c-sono-papa` | Sono {{papa}}. | Soy {{papa}}. | `d-2` | `c-sono-mamma` · `c-sono-figlia` |
| `c-di-dove` | Di dov'è? | ¿De dónde es? | `d-3` | · |
| `c-sono-di-partenza` | Sono di {{partenza}}, {{partenza.paese:target}}. | Soy de {{partenza}}, {{partenza.paese}}. | `d-4` | · |
| `c-sono-mamma` | Sono {{mamma}}. | Soy {{mamma}}. | `d-6` | `c-sono-papa` · `c-sono-figlia` |
| `c-sono-figlia` | Sono {{figliaNome}}. | Soy {{figliaNome}}. | `d-7` | `c-sono-papa` · `c-sono-mamma` |
| `c-ho-sedici-anni` | Ho sedici anni. | Tengo 16 años. | `d-7` | ⭐ **·** |
| `c-io-sono-figlio` | Io sono {{figlioNome}}. | Yo soy {{figlioNome}}. | `d-8` | · |
| `c-ho-otto-anni` | Ho otto anni. | Tengo 8 años. | `d-8` | ⭐ **·** |
| `c-siamo-la-famiglia` | Siamo la famiglia {{cognome}}! | ¡Somos la familia {{cognome}}! | `d-9` | · |

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
| `a-ciao` | ciao | hola | CIAO — ⚠️ **la «ci» italiana es la «ch» española: se dice como «chao»** | saluto | · |
| `a-buongiorno` | buongiorno | buenos días | buon-GIOR-no — ⚠️ *la «gi» es un sonido nuevo: es la «y» argentina de «yo»* | saluto di servizio | · |
| `a-piacere` | piacere | placer / gusto | pia-CE-re — *la «ce» es la «che» española* | sostantivo | · |
| `a-sono` | sono | (yo) soy · (ellos) son | SO-no — ⚠️ **una sola forma para dos personas** | verbo `essere` | · |
| `a-e-accentata` | è | (él/ella/usted) es | e — ⚠️ **el acento se escribe solo para no confundirlo con «e» = «y»** | verbo `essere` | · |
| `a-siamo` | siamo | (nosotros) somos | SIA-mo | verbo `essere` | · |
| `a-ho` | ho | (yo) tengo | o — ⚠️ **la «h» no se lee, y no se puede quitar: «o» sin «h» quiere decir «o»** | verbo `avere` | · |
| `a-di` | di | de | di | preposizione | · |
| `a-dove` | dove | dónde | DO-ve — *el acento cae en la primera, y no se escribe* | avverbio interrogativo | · |
| `a-e` | e | y | e — ⚠️ *sin acento. Con acento, «è», quiere decir «es»* | congiunzione | · |
| `a-lei` | Lei | usted | LEI — ⚠️ **se escribe con mayúscula cuando es de cortesía** | pronome di cortesia | · |
| `a-io` | io | yo | I-o — ⚠️ **dos sílabas, y la «i» es una «i»: no se dice «yo»** | pronome soggetto | · |
| `a-anni` | anni | años | AN-ni — ⚠️ **la doble «n» se oye, y es larga: «ani» es otra palabra** | sostantivo plurale | · |
| `a-la` | la | la | la | articolo | · |
| `a-famiglia` | famiglia | familia | fa-MI-glia — ⚠️ *«gli» se dice como la «ll» de España* | sostantivo | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Buongiorno y ciao | "Buongiorno" lo dice quien trabaja, "ciao" se lo dices a un amigo — y <strong>los dos son correctos</strong>.<br>En el diálogo se oye: la azafata y los padres dicen "buongiorno", los hijos "ciao".<br>Algo que el español no hace: <strong>"ciao" sirve también para despedirse</strong>. Es "hola" y "adiós" en una sola palabra.<br>Y "buongiorno" se usa hasta la tarde; después cambia, y lo veremos más adelante. |
| `d-1` | 2 | Piacere | Se dice cuando conoces a alguien por <strong>primera vez</strong>, y es la forma normal de hacerlo: ni muy formal ni muy informal. Es tu "mucho gusto".<br>No la traduzcas palabra por palabra: "piacere di conoscervi" funciona toda junta.<br>A partir de la segunda vez que ves a una persona ya no se usa: ahí basta "Ciao!".<br>Y una buena noticia: <strong>"piacere" no cambia si lo dice un hombre o una mujer</strong>, exactamente como "mucho gusto". |
| `d-3` | 1 | Tratar de «usted»: Lei | Para tratar de "usted" se usa <strong>Lei</strong>, y el verbo va en tercera persona — <strong>exactamente como tu "usted"</strong>.<br>"Di dov'è {{papa:target}}?" es "¿De dónde es {{papa:native}}?". A un amigo la azafata diría "Di dove sei?".<br>Así que aquí no hay un mecanismo nuevo que aprender: hay una palabra nueva, "Lei" — y se escribe con <strong>mayúscula</strong>.<br>Se trata de "Lei" a quien trabaja, a quien no conoces, a quien es mayor que tú. Entre amigos y en familia, "tu".<br>Y en plural el italiano tiene <strong>una sola forma</strong>: "voi". Donde tú eliges entre "vosotros" y "ustedes", aquí no tienes que elegir — <strong>es un punto en el que el italiano tiene una palabra menos que tu lengua</strong>. |
| `d-4` | 1 | Decir de dónde eres | "Sono di {{partenza:target}}" quiere decir "soy de {{partenza:native}}": <strong>idéntico al español</strong>, también el verbo.<br>"Di" significa "de". La vas a usar muchísimo.<br>Pregunta y respuesta tienen las mismas palabras: "Di dov'è?" → "Sono di…". Si aprendes una, ya tienes la otra.<br>Algo que vas a notar: tu nombre sigue siendo el tuyo — Carlos es Carlos también en italiano. Tu ciudad en cambio muchas veces sí cambia: {{partenza:native}} se convierte en <strong>{{partenza:target}}</strong>. Sobre esto volvemos con calma más adelante. |
| `d-5` | 1 | E Lei? | Quiere decir "¿y usted?", y sirve para devolver la misma pregunta a otra persona sin repetirla entera.<br>En el diálogo la azafata se la acaba de hacer al papá, y con "E Lei?" se la pasa a la mamá.<br>Funciona con cualquier pregunta, y es utilísima: la vas a oír continuamente.<br>Con un amigo se vuelve "E tu?". |
| `d-7` | 1 | Decir cuántos años tienes | "Ho sedici anni" quiere decir "tengo 16 años": <strong>igual que en español</strong>, también el verbo.<br>Algo que recordar: <strong>"anni" no se puede quitar</strong>. "Ho sedici" solo no se dice — como "tengo 16" en tu lengua.<br>Y cuidado con algo que no se ve: "ho" se escribe con <strong>h</strong>, que no se oye. Sin la h, "o" quiere decir "o".<br>"Avere" es el verbo tener, y lo vas a encontrar en todas partes: "ho fame", "ho un fratello". |
| `d-7` | 2 | El plural cambia la vocal | Esto es lo más importante de la lección, y no es una palabra: es un <strong>mecanismo</strong>.<br>En italiano el plural <strong>no añade una «s»</strong>: cambia la última vocal. "Anno" hace "<strong>anni</strong>", no "annos".<br>"Famiglia" hace "famigli<strong>e</strong>". "Padre" hace "padr<strong>i</strong>".<br>Es el error que comete todo el mundo al principio, y se nota enseguida. Por ahora te basta una cosa: <strong>cuando oigas un plural italiano, escucha la última letra</strong>.<br>Habrá un episodio entero sobre esto. |
| `d-8` | 1 | Cuándo se pone «io» | En italiano "io, tu, lui" <strong>se omiten</strong>, como en tu lengua — y cuando están, sirven para insistir.<br>La hija dice "Sono {{figliaNome:target}}". El hijo dice "<strong>Io</strong> sono {{figlioNome:target}}": los dos están bien.<br>El hijo pone "io" porque quiere que se fijen en él — como cuando un niño dice "<strong>¡YO</strong> soy {{figlioNome:native}}!".<br>Así que, si no tienes un motivo para insistir, déjalo fuera: "sono" basta. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `hostess-gate` | Azafata de embarque |
| `papa` | Papá |
| `mamma` | Mamá |
| `figlia` | Hija |
| `figlio` | Hijo |
| `tutti` | Todos |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `papa` | Nombre del papá | `select` | `people.papa` | · | `papa-carlos` |
| `mamma` | Nombre de la mamá | `select` | `people.mamma` | · | `mamma-maria` |
| `figliaNome` | Nombre de la hija | `select` | `people.figlia` | · | `figlia-sofia` |
| `figlioNome` | Nombre del hijo | `select` | `people.figlio` | · | `figlio-mateo` |
| `cognome` | Apellido de la familia | `select` | `people.cognome` | · | `cognome-garcia` |
| `partenza` | Ciudad de salida | `select` | `places.departures` | · | `orig-mexico` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO
