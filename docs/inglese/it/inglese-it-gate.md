**Versione: 20260923a**

# Episodio «Al gate» — inglese per italiani

*Id: `gate`. Nome, categoria e sequenza vivono nella sezione 7 di
`inglese-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-gate.json`.** Le ragioni — la scena, cosa insegna,
le note di scrittura, gli esclusi di proposito — stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_story_modules.js` e `tests/test_episodio2.js`, 2026-09-23

⚠️ **DI QUESTO FILE UN TEST LEGGE DUE COSE, E LA SECONDA NON E' QUELLA CHE
AVEVO SCRITTO.** Qui c'era *«un test legge una cosa sola: il riquadro dei numeri
attesi»*, e **era falso** — misurato il 2026-09-23, dopo che la suite e' andata
rossa proprio su quella riga:

| Cosa legge un test | Chi |
|---|---|
| il **riquadro dei numeri attesi** | `tests/test_story_modules.js` |
| ⚠️ **le tabelle dei gradi A, B, C, D e la sezione 5 delle skill**, confrontate col JSON **cella per cella** | `tests/test_story_modules.js`, blocco `[Fonte]` |

**Quindi per QUESTO episodio l'ordine delle colonne è un'interfaccia**, non una
scelta di impaginazione: spostarne una fa rosso. I titoli delle sezioni no —
quelli il blocco li cerca come `### Grado A`, senza il numero di sezione.

⚠️ **E l'asimmetria va saputa: `aircraft-door` NON ha questo controllo.**
`tests/test_episodio2.js` legge solo il suo riquadro dei numeri. **`gate` è
l'unico episodio in cui l'accordo fra markdown e JSON è verificato da una
macchina** — negli altri è verificato da chi trascrive.

**Il riquadro invece è rigido, e in un modo che va saputo prima di scriverlo:**

| | Come funziona |
|---|---|
| **Si trova** | cercando **la stringa che apre il riquadro della sezione 2**, e ne prende la **prima** occorrenza nel file |
| **Finisce** | alla **prima riga vuota** dopo quel punto |
| **Si legge** | ricucendo le righe con uno spazio, e togliendo `*` e `>` — **ma non `|`** |
| **Si estrae** | con sei espressioni: `N voci in A` · `N in B` · `N in C` · `N battute in D` · `N skill` · `N slot` |

⚠️ **QUI QUELLA STRINGA NON È SCRITTA, ED È VOLUTO:** il parser prende la
**prima** occorrenza nel file, quindi una citazione in questa sezione gli
farebbe leggere **questa tabella** invece del riquadro vero — e i sei numeri
verrebbero fuori come `N`, senza che niente si lamenti. *È successo scrivendo
questo file, e la prova è ripetibile: `grep -c` su quella stringa deve dare
**1**.*

⚠️ **PER QUESTO IL RIQUADRO È L'UNICA COSA NON TABELLARE DI QUESTO FILE, e non
è una svista.** Il markdown vuole una riga vuota prima di una tabella; il parser
si ferma alla prima riga vuota. **Una tabella qui darebbe un riquadro vuoto e
l'errore «numero atteso non trovato».** Resta un paragrafo finché non
cambiamo i due test.

**Ogni numero si prende col suo NOME accanto, mai per posizione:** l'ordine
dentro il paragrafo è libero, le parole no.

---

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 12 voci in A, 7 in B, 9 in C, 9 battute in D, 8 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Il paragrafo qui sopra è il solo pezzo del file che un test legge. La riga
vuota che segue lo chiude: non metterne una dentro.*

---

## 3 — LA REGOLA GENERALE

*Finisce in `generalRule`, ed è **facoltativa**: senza, Repeat Aloud non disegna
il riquadro. La legge un modulo solo.*

⚠️ **Oggi `inglese-it-gate.json` ne porta una che non ha nessuna fonte in
nessun markdown.** Questa sezione esiste perché smetta di essere così.

| Testo |
|---|
| La "e" finale in inglese non si legge quasi mai. |

---

## 4 — LA MATRICE

### Grado D — le battute

*Colonne → `levels.D.items[]`: **id** → `id` · **speaker** → `speaker`, e deve
essere una chiave della tabella dei personaggi · **ruolo** → `ruolo` · **en** →
`english` · **it** → `italian`.*

⚠️ **`ruolo` ha due soli stati che contano:** `famiglia` mette la bolla a
**destra**, qualunque altro valore la mette a sinistra.

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | Hello! Nice to meet you. | Ciao! Piacere di conoscervi. |
| `d-2` | `papa` | `famiglia` | Hello! I am {{papa}}. | Ciao! Sono {{papa}}. |
| `d-3` | `hostess-gate` | `staff` | Where are you from, {{papa}}? | Di dove sei, {{papa}}? |
| `d-4` | `papa` | `famiglia` | I am from {{partenza}}, Italy. | Vengo da {{partenza}}, in Italia. |
| `d-5` | `hostess-gate` | `staff` | And you? | E tu? |
| `d-6` | `mamma` | `famiglia` | Hello! I am {{mamma}}. | Ciao! Sono {{mamma}}. |
| `d-7` | `figlia` | `famiglia` | Hi! I'm {{figliaNome}}. I'm {{figliaEta}} years old. | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. |
| `d-8` | `figlio` | `famiglia` | Hi! I'm {{figlioNome}}. I'm {{figlioEta}}. | Ciao! Sono {{figlioNome}}. Ho {{figlioEta}} anni. |
| `d-9` | `tutti` | `famiglia` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! |

### Grado C — le frasi

*Colonne → `levels.C.items[]`: **id** · **en** → `english` · **it** → `italian` ·
**da** → `fromLine`, l'id della battuta da cui è ricavata.*

| id | en | it | da |
|---|---|---|---|
| `c-1` | I am {{papa}}. | Sono {{papa}}. | `d-2` |
| `c-2` | Where are you from? | Di dove sei? | `d-3` |
| `c-3` | I am from {{partenza}}, Italy. | Vengo da {{partenza}}, in Italia. | `d-4` |
| `c-4` | I am {{mamma}}. | Sono {{mamma}}. | `d-6` |
| `c-5` | I'm {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` |
| `c-6` | I'm {{figliaEta}} years old. | Ho {{figliaEta}} anni. | `d-7` |
| `c-7` | I'm {{figlioNome}}. | Sono {{figlioNome}}. | `d-8` |
| `c-8` | I'm {{figlioEta}}. | Ho {{figlioEta}} anni. | `d-8` |
| `c-9` | We are the {{cognome}} family! | Siamo la famiglia {{cognome}}! | `d-9` |

### Grado B — le espressioni

*Colonne → `levels.B.items[]`: **id** · **en** → `english` · **it** →
`italian` · **pronuncia** → `pronunciationTip` · **categoria** →
`grammarCategory`.*

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `b-1` | I am | (io) sono | ai am | pronome + verbo essere |
| `b-2` | I'm | (io) sono | aim — tutto attaccato, mai "ai-em" | pronome + verbo essere, contratto |
| `b-3` | we are | (noi) siamo | ui ar | pronome + verbo essere |
| `b-4` | nice to meet you | Piacere di conoscerti / conoscervi | nais tu MIIT iu | espressione idiomatica |
| `b-5` | I am from | Vengo da / Sono di | ai am fram | pronome + verbo essere + preposizione |
| `b-6` | and you? | E tu? / E voi? | and IU — accento su "you" | espressione |
| `b-7` | years old | anni (di età) | i-ars OULD | espressione per l'età |

### Grado A — le parole

*Stesse colonne del grado B → `levels.A.items[]`.*

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `a-1` | hello | Ciao / Salve | hel-LOU — la "h" è un soffio leggero | saluto |
| `a-2` | hi | Ciao | hai — una sillaba, più lunga dell'italiano | saluto |
| `a-3` | nice | bello / piacevole | nais | aggettivo |
| `a-4` | meet | incontrare | miit — la "i" è lunga e tesa, non "mit" | verbo |
| `a-5` | where | dove | UEAR — la "wh" è un soffio, non "vu" | avverbio interrogativo |
| `a-6` | Italy | Italia | I-ta-li — accento sulla prima | nome di paese |
| `a-7` | from | da / di | fram — la "o" è aperta, quasi una "a" | preposizione |
| `a-8` | and | e | and — la "d" finale si sente appena | congiunzione |
| `a-9` | years | anni | i-ars — parte con un suono di "i" | sostantivo |
| `a-10` | old | vecchio (di età) | ould — la "o" è lunga | aggettivo |
| `a-11` | the | il / la / i / le | de — la lingua tra i denti, non "ze" | articolo |
| `a-12` | family | famiglia | FA-mi-li — accento sulla prima | sostantivo |

---

## 5 — LE SKILL

*Colonne → `levels.D.items[].whatYouLearn[]`: **battuta** → a quale `id` del
grado D si attacca · **#** → l'ordine dentro la lista di quella battuta ·
**titolo** → `title` · **corpo** → `body`.*

**`whatYouLearn` è SEMPRE una lista**, anche con una skill sola: due righe con
la stessa battuta sono due skill della stessa battuta. **Una battuta senza
righe qui non ha skill** — in Why We Say It la sua card non ha pulsanti e
prende la spunta da sola.

⚠️ **Nel corpo:** HTML sì, `<br>` per andare a capo, `<strong>` per
evidenziare, **mai `<p>`**. I segnaposto si sostituiscono come ovunque, e la
citazione inglese chiede la propria lingua con `{{chiave:en}}`.

⚠️ **`difficulty` non lo scrivo più:** oggi sta nel JSON e **non lo legge
nessuno**.

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Hello e Hi | Sono i due modi normali di salutare, e vogliono dire la stessa cosa: ciao.<br>"Hello" è un po' più educato, "Hi" un po' più amichevole. Nel dialogo lo senti: il papà e la mamma dicono "Hello", i figli dicono "Hi".<br>È come in italiano — "Buongiorno" a chi non conosci, "Ciao" a un amico. Nessuno dei due è sbagliato.<br>Se sei in dubbio, "Hello" va bene sempre, con chiunque. |
| `d-1` | 2 | Nice to meet you | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più. Lì basta "Hello!". |
| `d-3` | 1 | Chiedere da dove viene qualcuno | "Where are you from?" vuol dire "di dove sei?".<br>"Where" significa "dove". E la formula funziona tutta insieme: è così che si chiede l'origine di qualcuno.<br>Il papà risponde "I am from {{partenza:en}}" — la stessa struttura, girata.<br>Domanda e risposta usano le stesse parole. Se impari una, hai già l'altra. |
| `d-4` | 1 | Dire da dove vieni | "I am from {{partenza:en}}" vuol dire "vengo da {{partenza}}".<br>Anche qui l'inglese usa il verbo essere dove l'italiano usa un altro verbo: non dicono "io vengo", dicono "io sono da".<br>"From" significa "da". La userai tantissimo. |
| `d-5` | 1 | And you? | Vuol dire "e tu?" — si usa per rimandare la stessa domanda a un'altra persona, senza doverla ripetere tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "And you?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente. |
| `d-7` | 1 | I am e I'm | Il papà dice "I am {{papa}}", la figlia dice "I'm {{figliaNome}}". Sono la stessa cosa: "I'm" è solo la forma corta.<br>Vuol dire "io sono", ed è così che ci si presenta in inglese: non "mi chiamo", ma "io sono".<br><strong>La forma corta vale sempre, non solo con i nomi:</strong> "I'm from Turin" è uguale a "I am from Turin".<br>Sentirai "I'm" quasi sempre nel parlato. "I am" è più lento e un po' più formale — ma è giusto anche quello.<br>Una cosa da sapere: in italiano dici "sono Marco" e il "io" lo salti. <strong>In inglese non si può:</strong> "I" ci deve essere sempre. Non esiste dire "am Marco". |
| `d-8` | 1 | Dire quanti anni hai | La figlia dice "I'm {{figliaEta}} <strong>years old</strong>". Il figlio dice solo "I'm {{figlioEta}}".<br>Sono tutti e due giusti: la seconda è più corta, e si usa moltissimo.<br>Attenzione a una cosa: in inglese <strong>non si usa il verbo avere</strong> per l'età. Non si dice "I have ten years" — si dice "I am ten", cioè letteralmente "io sono dieci".<br>Ricordatelo, perché è la differenza più grande con l'italiano. |
| `d-9` | 1 | We are | "We are" vuol dire "noi siamo".<br>Conosci già "I am" — io sono. Quando si parla in più di uno diventa "we are": cambia sia la parola per dire chi, sia il verbo.<br>Nota che in inglese il cognome va <strong>prima</strong> della parola "family", al contrario dell'italiano. |

---

## 6 — PERSONAGGI ED ETICHETTE

*Colonne → `speakerLabels`: **chiave** → quello che scrivi nella colonna
`speaker` del grado D · **etichetta** → quello che lo studente legge sopra la
bolla.*

⚠️ **La chiave nel JSON è `speakerLabels`.** *Fino al 2026-09-09 si chiamava
`dialogueSpeakerLabels`, e quel nome non esiste più da nessuna parte.*

| chiave | etichetta a schermo |
|---|---|
| `hostess-gate` | Hostess al gate |
| `papa` | Papà |
| `mamma` | Mamma |
| `figlia` | Figlia |
| `figlio` | Figlio |
| `tutti` | Tutti |

---

## 7 — GLI SLOT

*Due cose insieme, e vanno in due posti del JSON: le colonne **chiave** →
`placeholderMap` (il nome che scrivi dentro i `{{...}}`), e tutte e cinque →
una voce di `personalizationTablesUsed`.*

| chiave | etichetta | tipo | tabella | predefinito |
|---|---|---|---|---|
| `papa` | Nome del papà / utente | `select` | `people.papa` | `papa-marco` |
| `mamma` | Nome della mamma | `select` | `people.mamma` | `mamma-giulia` |
| `figliaNome` | Nome della figlia | `select` | `people.figlia` | `figlia-emma` |
| `figliaEta` | Età della figlia | `select` | `episode.ageOptions.figlia` | `16` |
| `figlioNome` | Nome del figlio | `select` | `people.figlio` | `figlio-tommaso` |
| `figlioEta` | Età del figlio | `select` | `episode.ageOptions.figlio` | `8` |
| `cognome` | Cognome della famiglia | `select` | `people.cognome` | `cognome-costa` |
| `partenza` | Città di partenza | `select` | `places.departures` | `orig-mondovi` |

⚠️ **L'«etichetta» non ha nessuna fonte oggi**, e la schermata Personalizza la
mostra: sta qui perché smetta di vivere solo nel JSON.

⚠️ **Il «`/ utente`» dell'etichetta di `papa` NON è un residuo: è l'unico posto
del progetto dove è scritto che quello slot è lo studente stesso**, e non un
personaggio come gli altri. *Tolto per sbaglio il 2026-09-23 e rimesso lo stesso
giorno.*

**La «tabella» è un riferimento a `inglese-it-tabelle-personalizzazione`**, con
due forme sole:

| Forma | Vuol dire |
|---|---|
| `people.papa`, `places.departures`, … | una tabella del magazzino condiviso |
| `episode.<qualcosa>` | una tabella dichiarata **dentro questo stesso file episodio** — oggi le età |

⚠️ **Il «predefinito» è un id di quella tabella, e va scelto con attenzione:**
se un valore salvato non si trova più fra le opzioni, il codice **non ripiega
sul predefinito — ripiega sulla PRIMA RIGA della tabella.**

---

## 8 — LE TABELLE INTERNE ALL'EPISODIO

*Le righe che valgono **solo per questo episodio** e non vanno nel magazzino
condiviso. Finiscono in una chiave di primo livello del JSON, e l'unico modo di
raggiungerle è che uno slot della sezione 7 dica `episode.<nome>.<gruppo>`.*

⚠️ **Oggi è il caso delle età di `gate`** (`ageOptions.figlia`,
`ageOptions.figlio`), **e nemmeno quelle hanno una fonte markdown.** Questa
sezione esiste per quello.

⚠️ **Una riga «nuda» vale per tutte e due le lingue.** Il codice la trasforma in
`{value, it, en}` **tutti e tre uguali** — che è il motivo per cui oggi si legge
`I'm 16 years old` e non `I'm sixteen`. **Per avere una parola in inglese serve
un altro passo**, non una riga scritta diversa qui.

| nome | gruppo | valori, in ordine |
|---|---|---|
| `ageOptions` | `figlia` | `12` · `13` · `14` · `15` · `16` · `17` |
| `ageOptions` | `figlio` | `4` · `5` · `6` · `7` · `8` · `9` · `10` · `11` |
