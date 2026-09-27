**Versione: 20260927a**

# Episodio «Sulla porta dell'aereo» — inglese per italiani

*Id: `aircraft-door`. Nome, categoria e sequenza vivono nella sezione 7 di
`inglese-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-aircraft-door.json`.** Le ragioni stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER

⚠️ **DI QUESTO FILE UN TEST LEGGE UNA COSA SOLA: il riquadro dei numeri attesi**
(`tests/test_episodio2.js`). *Titoli, numeri di sezione, ordine delle sezioni e nomi delle colonne **non
sono un'interfaccia**: si possono cambiare senza rompere niente.*

⚠️ **MA NON VALE PER TUTTI GLI EPISODI:** *di `gate`, `tests/test_story_modules.js` legge **anche le
tabelle dei gradi**, confrontandole col JSON cella per cella.* **Chi cambia la forma del modello cambia
tutti e due: il primo se ne accorge, il secondo no.**

**Il riquadro invece è rigido:**

| | Come funziona |
|---|---|
| **Si trova** | cercando **la stringa che apre il riquadro della sezione 2**, e ne prende la **prima** occorrenza nel file |
| **Finisce** | alla **prima riga vuota** dopo quel punto |
| **Si legge** | ricucendo le righe con uno spazio, e togliendo `*` e `>` — **ma non `|`** |
| **Si estrae** | con sei espressioni: `N voci in A` · `N in B` · `N in C` · `N battute in D` · `N skill` · `N slot` |

⚠️ **QUI QUELLA STRINGA NON È SCRITTA, ED È VOLUTO:** *il parser prende la **prima** occorrenza, quindi
una citazione qui gli farebbe leggere **questa tabella** invece del riquadro vero — e i sei numeri
verrebbero fuori come `N`, senza che niente si lamenti.* **La prova è ripetibile: `grep -c` su quella
stringa deve dare 1.**

### ② ⚠️ QUATTRO COLONNE NUOVE, IL 2026-09-27 — E VANNO TUTTE IN FONDO

| Colonna | Dove | → JSON | Cosa dice |
|---|---|---|---|
| **`tipo`** | **tutti e quattro i gradi** | `tipo` | `standard` · `locale` · `slang` — **nessuna cella vuota** |
| **`esercizio`** | **A, B, C** | `esercizio` | `sì` / `no` — se questo target entra negli esercizi |
| **`non con`** | **A, B, C** | `nonCon` — *una lista di id, vuota se `·`* | con chi non deve **mai** comparire come distrattore |
| **`accento`** | sezione 6, i personaggi | ⚠️ **accanto a `speakerLabels`, non dentro** — *da decidere con Code* | da quale lingua viene l'accento di chi parla |

⚠️ **I nomi delle chiavi sono una PROPOSTA.** *Sono in italiano perché il precedente più vicino è in
italiano — `ruolo`, sul grado D.* **Se Code preferisce l'inglese (`type`, `inExercises`, `excludeWith`) va
bene uguale: la regola è che il markdown DICHIARI il nome, non che lo scelga.** *Quando Code risponde, la
colonna `→ JSON` qui si corregge — e resta l'unico posto dove il nome è scritto.*

⚠️ **`accento` è l'unica delle quattro che non ha già un posto dove andare.** *Oggi `speakerLabels` è una
mappa piatta `chiave → stringa`: non c'è spazio per un secondo valore.* **Servono due mappe
(`speakerLabels` + `speakerAccents`) oppure `speakerLabels` che diventa `chiave → { etichetta, accento }`.**
*Decide Code: la prima non tocca niente di esistente, la seconda tiene insieme le due cose che descrivono
la stessa persona.*

⚠️ **E PERCHÉ `esercizio` E `non con` NON STANNO SUL GRADO D:** *nessun modulo presenta una battuta con
delle alternative fra cui scegliere.* **I distrattori esistono solo dove c'è da abbinare — Match, Speed
Match, Flash Card — che lavorano su A, B e C.** *Una battuta si ascolta e si ripete: non ha distrattori, e
non si può nemmeno escludere dagli esercizi senza toglierla dal dialogo.*

⭐ **`tipo` invece sta su tutti e quattro, perché una parola può essere `slang` come una battuta.**

### ③ Cosa dicono le due colonne dei target

**`esercizio`** · ⚠️ **LA DECISIONE LA PRENDIAMO NOI, NEL MARKDOWN.** *Il JSON copia, l'app legge:
nessuno dei due decide (regola 1.4).*

**`non con`** · *la rete per le risposte doppie.* ⚠️ **Serve anche quando la traduzione è pulita, perché
il bacino dei distrattori crescerà:** *oggi sono gli item di un grado di un episodio, col mix diventeranno
~150 di tutto l'A1.* ⭐ **Ma è la rete, non il primo strumento: dove si può, si aggiusta la traduzione.**

**E la regola che decide quando due item si escludono:**

> **Due item che differiscono solo per un SEGNAPOSTO non sono buoni distrattori l'uno dell'altro.**
>
> ⭐ *Se invece differiscono per una **parola vera**, sono ottimi distrattori: «She is my wife» contro
> «She is my daughter» fa scegliere fra `wife` e `daughter`, **che è il contenuto dell'episodio**.*

---

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 12 voci in A, 6 in B, 5 in C, 9 battute in D, 8 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Il paragrafo qui sopra è il solo pezzo del file che un test legge. La riga vuota che segue lo chiude: non
metterne una dentro.*

⭐ **I sei numeri NON cambiano con le colonne nuove:** *le righe guadagnano celle, non nascono.*

---

## 3 — LA REGOLA GENERALE

*Finisce in `generalRule`, ed è **facoltativa**: senza, Repeat Aloud non disegna il riquadro.*

| Testo |
|---|
| L'accento inglese quasi mai cade dove lo metterebbe un italiano: la sillaba scritta in maiuscolo te lo dice. |

⚠️ **PRIMA ERA VUOTA, E NON DOVEVA ESSERLO.** *La regola generale **ruota**: ogni episodio ne porta una, e
il modulo che la esercita accumula anche le precedenti. Questa è la seconda della serie — la prima è la
«e» finale muta, in `gate`.*

⭐ **E perché proprio l'accento, proprio qui:** *questo episodio ha tre prove sue — **MOR**-ning,
a-**BORD**, en-**GIOI** — ed è il fenomeno di pronuncia con più materiale di tutto il corso: otto parole
sulle ventitré dei due episodi.*

---

## 4 — LA MATRICE

### Grado D — le battute

*Colonne → `levels.D.items[]`: **id** → `id` · **speaker** → `speaker`, e deve essere una chiave della
tabella dei personaggi · **ruolo** → `ruolo` · **en** → `english` · **it** → `italian` · **tipo**.*

⚠️ **`ruolo` ha due soli stati che contano:** `famiglia` mette la bolla a **destra**, qualunque altro
valore la mette a sinistra.

| id | speaker | ruolo | en | it | tipo |
|---|---|---|---|---|---|
| `d-1` | `hostess-porta` | `staff` | Good morning! Welcome aboard. | Buongiorno! Benvenuti a bordo. | `standard` |
| `d-2` | `hostess-porta` | `staff` | Your tickets, please. | I biglietti, per favore. | `standard` |
| `d-3` | `papa` | `famiglia` | Here they are. | Eccoli. | `standard` |
| `d-4` | `papa` | `famiglia` | She is my wife. | Lei è mia moglie. | `standard` |
| `d-5` | `papa` | `famiglia` | She is my daughter, he is my son. | Lei è mia figlia, lui è mio figlio. | `standard` |
| `d-6` | `hostess-porta` | `staff` | Thank you. | Grazie. | `standard` |
| `d-7` | `hostess-porta` | `staff` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. | `standard` |
| `d-8` | `tutti` | `famiglia` | Thank you! | Grazie! | `standard` |
| `d-9` | `hostess-porta` | `staff` | Enjoy your flight! | Buon volo! | `standard` |

⚠️ **`d-6` e `d-8` hanno lo stesso testo, e va bene:** *nel dialogo la posizione è l'identità della
battuta — l'hostess ringrazia, e poi ringrazia la famiglia.* **Non essendoci distrattori sul grado D, non
c'è niente da escludere.**

### Grado C — le frasi

*Colonne → `levels.C.items[]`: **id** · **en** → `english` · **it** → `italian` · **da** → `fromLine` ·
**tipo** · **esercizio** · **non con**.*

| id | en | it | da | tipo | esercizio | non con |
|---|---|---|---|---|---|---|
| `c-1` | Your tickets, please. | I biglietti, per favore. | `d-2` | `standard` | sì | · |
| `c-2` | She is my wife. | Lei è mia moglie. | `d-4` | `standard` | sì | · |
| `c-3` | She is my daughter. | Lei è mia figlia. | `d-5` | `standard` | sì | · |
| `c-4` | He is my son. | Lui è mio figlio. | `d-5` | `standard` | sì | · |
| `c-5` | {{destinazione}}? This way, please. | {{destinazione}}? Da questa parte, prego. | `d-7` | `standard` | sì | · |

⭐ **`c-2`, `c-3` e `c-4` NON si escludono, ed è una scelta:** *differiscono per `wife`, `daughter`, `son`
— **parole vere, e sono il contenuto dell'episodio**.* **Usarle come distrattori l'una dell'altra fa
esattamente l'esercizio giusto.**

### Grado B — le espressioni

*Colonne → `levels.B.items[]`: **id** · **en** · **it** · **pronuncia** → `pronunciationTip` ·
**categoria** → `grammarCategory` · **tipo** · **esercizio** · **non con**.*

| id | en | it | pronuncia | categoria | tipo | esercizio | non con |
|---|---|---|---|---|---|---|---|
| `b-good-morning` | good morning | buongiorno | gud MOR-ning | saluto | `standard` | sì | · |
| `b-welcome-aboard` | welcome aboard | benvenuti a bordo | UEL-com a-BORD | formula di accoglienza | `standard` | sì | · |
| `b-here-they-are` | here they are | eccoli | hia dei ar | espressione | `standard` | sì | · |
| `b-thank-you` | thank you | grazie | THENK iu — la "th" fra i denti | formula di cortesia | `standard` | sì | · |
| `b-this-way-please` | this way, please | da questa parte, prego | dis UEI pliiz | indicazione di direzione | `standard` | sì | · |
| `b-enjoy-your-flight` | enjoy your flight | buon volo | en-GIOI ior flait | formula di congedo | `standard` | sì | · |

### Grado A — le parole

*Stesse colonne del grado B → `levels.A.items[]`.*

⚠️ **L'ID DEI GRADI A E B È DESCRITTIVO, MAI UN NUMERO.** *Con un id posizionale, inserire domani una
parola in mezzo rinumera tutte quelle dopo e **il colore di una voce passa a un'altra** senza nessun
errore.*

| id | en | it | pronuncia | categoria | tipo | esercizio | non con |
|---|---|---|---|---|---|---|---|
| `a-morning` | morning | mattina | MOR-ning | sostantivo | `standard` | sì | · |
| `a-welcome` | welcome | benvenuto | UEL-com — la "e" finale non si legge | espressione di accoglienza | `standard` | sì | · |
| `a-tickets` | tickets | biglietti | TI-chets — la "ck" è una "c" dura sola | sostantivo plurale | `standard` | sì | · |
| `a-here` | here | qui | hia — la "h" è un soffio, la "e" finale muta | avverbio di luogo | `standard` | sì | · |
| `a-they` | they | loro | dei — la "th" è la lingua fra i denti | pronome | `standard` | sì | · |
| `a-she` | she | lei | scii — lunga | pronome | `standard` | sì | · |
| `a-he` | he | lui | hii — con il soffio davanti | pronome | `standard` | sì | · |
| `a-wife` | wife | moglie | uaif — la "e" finale non si legge | sostantivo, famiglia | `standard` | sì | · |
| `a-daughter` | daughter | figlia | DO-ter — **la "gh" non si legge affatto** | sostantivo, famiglia | `standard` | sì | · |
| `a-son` | son | figlio | san — **non "son" come in italiano** | sostantivo, famiglia | `standard` | sì | · |
| `a-enjoy` | enjoy | godersi | en-GIOI | verbo | `standard` | sì | · |
| `a-flight` | flight | volo | flait — **la "gh" muta, come in daughter** | sostantivo | `standard` | sì | · |

⭐ **Nessuna esclusione in questo episodio: ho controllato tutte le traduzioni dei quattro gradi e non ce
n'è una che si sovrapponga.** *`daughter`/`son` e `she`/`he` sono coppie, ma le traduzioni sono distinte —
e proprio per questo sono buoni distrattori.*

---

## 5 — LE SKILL

*Colonne → `levels.D.items[].whatYouLearn[]`: **battuta** · **#** · **titolo** → `title` · **corpo** →
`body`.*

**`whatYouLearn` è SEMPRE una lista.** ⚠️ **Nel corpo:** HTML sì, `<br>` per andare a capo, `<strong>` per
evidenziare, **mai `<p>`**.

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

*Colonne: **chiave** e **etichetta** → `speakerLabels` · **accento** → ⚠️ **non dentro `speakerLabels`** —
vedi la tabella delle quattro colonne nuove all'inizio del file.*

⚠️ **La chiave nel JSON è `speakerLabels`.** *Fino al 2026-09-09 si chiamava `dialogueSpeakerLabels`, e
quel nome non esiste più da nessuna parte.*

| chiave | etichetta a schermo | accento |
|---|---|---|
| `hostess-porta` | Hostess alla porta | `zh` |
| `papa` | Papà | `it` |
| `tutti` | Tutti | `it` |

⚠️ **L'«accento» dice da quale lingua viene l'accento di chi parla, non un locale di sintesi.** *`it` =
inglese con accento italiano · `zh` = inglese con accento cinese · un madrelingua prende il codice della
sua varietà.*

⚠️ **E `hostess-porta` è una persona DIVERSA da `hostess-gate`, non la stessa in un altro posto.** *Al
gate e alla porta sono due mestieri, e nel video si vedrebbe.* **Le quattro differenze — età, capelli,
cosa ha in mano, dove sta — stanno nel tabellone dei personaggi.**

---

## 7 — GLI SLOT

*Le colonne **chiave** → `placeholderMap`, e tutte insieme → una voce di `personalizationTablesUsed`.*

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `destinazione` | Destinazione del viaggio | `select` | `places.destinations` | · | `dest-pechino` |

⚠️ **L'«etichetta» non ha nessuna fonte oltre a questa**, e la schermata Personalizza la mostra.

**La «tabella» è un riferimento a `inglese-it-tabelle-personalizzazione`**, con due forme: *una tabella
del magazzino condiviso, oppure `episode.<qualcosa>` per una tabella dichiarata dentro questo file —
**oggi nessuno la usa**.*

⚠️ **CORRETTO IL 2026-09-27 — qui c'era scritto che un valore salvato fuori elenco «non ripiega sul
predefinito: ripiega sulla PRIMA RIGA della tabella».** *Era vero fino al 2026-09-24, e il passo 1.8-bis ④
l'ha cambiato:* **adesso ripiega proprio sul predefinito, e la prima riga è solo l'ultima spiaggia.** *Il
testo giusto era già in `inglese-it-gate` sezione 7: veniva dal modello, e il modello va corretto per
primo o il prossimo episodio lo riporta indietro.*

⚠️ **E la colonna «righe» serve a prendere un PEZZO di una tabella condivisa.** *Un punto `·` vuol dire
«tutta la tabella», ed è il caso di questo episodio.*

⚠️ **APERTO — questo slot va tolto.** *Personalizzare la destinazione brucia le città, e gli episodi
devono restare neutri in tutte e tre. **La decisione è presa; il passo non è ancora fatto.***

---

## 8 — LE TABELLE INTERNE ALL'EPISODIO

*Le righe che valgono **solo per questo episodio**. Finiscono in una chiave di primo livello del JSON, e
l'unico modo di raggiungerle è che uno slot della sezione 7 dica `episode.<nome>.<gruppo>`.*

⚠️ **QUESTO EPISODIO NON HA TABELLE INTERNE: è il caso normale.**

⚠️ **CORRETTO IL 2026-09-27 — qui c'era scritto che «oggi è il caso delle età di `gate`
(`ageOptions.figlia`, `ageOptions.figlio`), e nemmeno quelle hanno una fonte markdown», più un avviso
sulle righe «nude».** *Era vero fino al 2026-09-24:* **il passo 1.8-bis ③ ha portato le età in
`ages.anni`, dove `it` è la cifra ed `es`/`en` la parola, e ha dato agli slot la colonna «righe».** *Anche
questo testo veniva dal modello, e va corretto là per primo.*

*La sezione resta perché la forma `episode.<qualcosa>` esiste ancora: una tabella che ha senso solo dentro
una storia non deve finire nel magazzino di tutti.*
