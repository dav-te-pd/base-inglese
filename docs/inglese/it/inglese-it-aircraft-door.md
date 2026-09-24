**Versione: 20260923a**

# Episodio «Sulla porta dell'aereo» — inglese per italiani

*Id: `aircraft-door`. Nome, categoria e sequenza vivono nella sezione 7 di
`inglese-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-aircraft-door.json`.** Le ragioni — la scena, cosa insegna,
le note di scrittura, gli esclusi di proposito — stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_story_modules.js` e `tests/test_episodio2.js`, 2026-09-23

⚠️ **DI QUESTO FILE UN TEST LEGGE UNA COSA SOLA: il riquadro dei numeri
attesi** (`tests/test_episodio2.js`). Titoli, numeri di sezione, ordine delle
sezioni e nomi delle colonne **non sono un'interfaccia**: si possono cambiare
senza rompere niente.

⚠️ **MA NON VALE PER TUTTI GLI EPISODI, e la differenza e' stata misurata il
2026-09-23:** di `gate`, `tests/test_story_modules.js` legge **anche le tabelle
dei gradi**, confrontandole col JSON cella per cella. **Li' l'ordine delle
colonne e' un'interfaccia; qui no.** *Chi cambia la forma di questo modello
cambia tutti e due: il primo se ne accorge, il secondo no.*

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

**Numeri attesi nel JSON:** 12 voci in A, 6 in B, 5 in C, 9 battute in D, 8 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Il paragrafo qui sopra è il solo pezzo del file che un test legge. La riga
vuota che segue lo chiude: non metterne una dentro.*

---

## 3 — LA REGOLA GENERALE

*Finisce in `generalRule`, ed è **facoltativa**: senza, Repeat Aloud non disegna
il riquadro. La legge un modulo solo.*

⚠️ **Oggi `inglese-it-aircraft-door.json` ne porta una che non ha nessuna fonte in
nessun markdown.** Questa sezione esiste perché smetta di essere così.

| Testo |
|---|

*Questo episodio non ha una regola generale: la tabella resta senza righe, e Repeat Aloud non
disegna il riquadro.*

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
| `d-1` | `hostess-porta` | `staff` | Good morning! Welcome aboard. | Buongiorno! Benvenuti a bordo. |
| `d-2` | `hostess-porta` | `staff` | Your tickets, please. | I biglietti, per favore. |
| `d-3` | `papa` | `famiglia` | Here they are. | Eccoli. |
| `d-4` | `papa` | `famiglia` | She is my wife. | Lei è mia moglie. |
| `d-5` | `papa` | `famiglia` | She is my daughter, he is my son. | Lei è mia figlia, lui è mio figlio. |
| `d-6` | `hostess-porta` | `staff` | Thank you. | Grazie. |
| `d-7` | `hostess-porta` | `staff` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. |
| `d-8` | `tutti` | `famiglia` | Thank you! | Grazie! |
| `d-9` | `hostess-porta` | `staff` | Enjoy your flight! | Buon volo! |

### Grado C — le frasi

*Colonne → `levels.C.items[]`: **id** · **en** → `english` · **it** → `italian` ·
**da** → `fromLine`, l'id della battuta da cui è ricavata.*

| id | en | it | da |
|---|---|---|---|
| `c-1` | Your tickets, please. | I biglietti, per favore. | `d-2` |
| `c-2` | She is my wife. | Lei è mia moglie. | `d-4` |
| `c-3` | She is my daughter. | Lei è mia figlia. | `d-5` |
| `c-4` | He is my son. | Lui è mio figlio. | `d-5` |
| `c-5` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. | `d-7` |

### Grado B — le espressioni

*Colonne → `levels.B.items[]`: **id** · **en** → `english` · **it** →
`italian` · **pronuncia** → `pronunciationTip` · **categoria** →
`grammarCategory`.*

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `b-good-morning` | good morning | buongiorno | gud MOR-ning | saluto |
| `b-welcome-aboard` | welcome aboard | benvenuti a bordo | UEL-com a-BORD | formula di accoglienza |
| `b-here-they-are` | here they are | eccoli | hia dei ar | espressione |
| `b-thank-you` | thank you | grazie | THENK iu — la "th" fra i denti | formula di cortesia |
| `b-this-way-please` | this way, please | da questa parte, prego | dis UEI pliiz | indicazione di direzione |
| `b-enjoy-your-flight` | enjoy your flight | buon volo | en-GIOI ior flait | formula di congedo |

### Grado A — le parole

*Stesse colonne del grado B → `levels.A.items[]`.*

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
| `d-1` | 1 | Buongiorno | "Good morning" si usa fino a mezzogiorno, poi diventa "good afternoon", e dalla sera "good evening".<br>È più formale di "Hello" e "Hi": lo senti da chi lavora — l'hostess, il receptionist, il cameriere.<br>Con un amico dici "Hi". Con chi ti sta servendo, "Good morning". |
| `d-1` | 2 | Welcome | Vuol dire "benvenuto", e si usa quando qualcuno arriva in un posto.<br>"Aboard" significa "a bordo": vale per aerei, navi, treni.<br>Lo sentirai spesso: "Welcome to London", "Welcome to our hotel". <strong>La formula è sempre "welcome to" più il posto</strong> — tranne "aboard", che va da solo. |
| `d-2` | 1 | Please | "Please" vuol dire "per favore", e si mette <strong>alla fine</strong> della richiesta: "Your tickets, please", "Coffee, please".<br>In italiano lo diciamo spesso all'inizio — "per favore, i biglietti" — in inglese quasi sempre in fondo.<br>È la parola che rende gentile qualsiasi richiesta. Senza, "your tickets" suona come un ordine. |
| `d-3` | 1 | Eccoli | Si dice quando dai qualcosa a qualcuno, o quando la cosa che cercavi salta fuori.<br>Se è una cosa sola: "Here it is". Se sono più d'una: "Here they are".<br>I biglietti sono quattro, quindi "they". |
| `d-4` | 1 | He is, she is | Conosci già "I am" e "we are". Quando parli di <strong>un'altra persona</strong> il verbo diventa "is": "he is" per un uomo, "she is" per una donna.<br>Anche qui il pronome non si può saltare: non esiste dire "is my wife".<br>E nota "my": vuol dire "mio, mia". Ne esistono altri — li vedrai poi. |
| `d-5` | 1 | La famiglia | "Wife" è la moglie, "daughter" la figlia, "son" il figlio.<br>Attenzione a "son": si dice <strong>san</strong>, non "son" come lo leggeresti in italiano.<br>Il papà dice queste tre parole perché è lui che parla. <strong>La mamma direbbe "husband" per il marito, e i figli direbbero "mother" e "father"</strong> — le imparerai quando toccherà a loro. |
| `d-7` | 1 | Indicare la direzione | "This way" vuol dire "da questa parte", ed è il modo normale di indicare dove andare.<br>Nota che non c'è nessuna preposizione: non si dice "in this way" né "to this way". <strong>Due parole e basta.</strong><br>E attenzione a "please": qui <strong>non è "per favore"</strong>. L'hostess non ti sta chiedendo niente, ti sta invitando — in italiano diventa <strong>"prego"</strong>.<br><strong>Stessa parola, due significati</strong>, e li hai visti tutti e due in questo dialogo. |
| `d-9` | 1 | Qui il dialogo finisce | "Enjoy your flight" vuol dire "buon volo", e la sentirai in mille versioni: "enjoy your meal", "enjoy your stay", "enjoy your day".<br><strong>Una cosa importante: qui la conversazione è finita.</strong> In italiano risponderemmo — "grazie, altrettanto" — ma in inglese questa formula <strong>chiude da sé</strong>. Chi la riceve sorride e passa.<br>Non è maleducazione: è che la frase è già un saluto. |

---

## 6 — PERSONAGGI ED ETICHETTE

*Colonne → `speakerLabels`: **chiave** → quello che scrivi nella colonna
`speaker` del grado D · **etichetta** → quello che lo studente legge sopra la
bolla.*

⚠️ **La chiave nel JSON è `speakerLabels`.** *Fino al 2026-09-09 si chiamava
`dialogueSpeakerLabels`, e quel nome non esiste più da nessuna parte.*

| chiave | etichetta a schermo |
|---|---|
| `hostess-porta` | Hostess alla porta |
| `papa` | Papà |
| `tutti` | Tutti |

---

## 7 — GLI SLOT

*Due cose insieme, e vanno in due posti del JSON: le colonne **chiave** →
`placeholderMap` (il nome che scrivi dentro i `{{...}}`), e tutte e sei →
una voce di `personalizationTablesUsed`.* ⚠️ *La colonna **righe** è nata il
2026-09-24: un punto `·` vuol dire «tutta la tabella», ed è il caso di questo
episodio.*

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `destinazione` | Destinazione del viaggio | `select` | `places.destinations` | · | `dest-pechino` |

⚠️ **L'«etichetta» non ha nessuna fonte oggi**, e la schermata Personalizza la
mostra: sta qui perché smetta di vivere solo nel JSON.

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

*Questo episodio non ha tabelle interne: è il caso normale.*
