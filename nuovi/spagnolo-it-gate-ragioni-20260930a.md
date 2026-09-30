**Versione: 20260930a**

# Episodio «Al gate» — spagnolo per italiani  ·  RAGIONI

*Id: `gate`. Nome, categoria e sequenza vivono nella sezione 7 di `spagnolo-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

### ① IL FILE È SDOPPIATO

**Questo è il file di LAVORO. Quello che si carica nel repository è un altro, e si genera da qui.**

| | Cosa contiene | Chi lo legge |
|---|---|---|
| **`…-ragioni.md`** *(questo)* | **tutto**: le tabelle intere, le colonne che servono solo a noi, e i perché | ⭐ **noi** |
| **`…-sorgente.md`** | **sole tabelle**, niente prosa, senza le colonne di lavoro | **Claude Code e i test** |

⭐ **Il sorgente si GENERA:** `python3 genera-sorgente.py spagnolo-it-gate-ragioni.md`. *Ricopiarlo a mano
vorrebbe dire che il giorno in cui cambiamo una cella qui e ci dimentichiamo di rigenerare, i due file
divergono in silenzio.*

⚠️ **LO SCRIPT NON DECIDE NIENTE.** *Le tre liste sono scritte qui sotto, e lui esegue.*

**Colonne che non si trascrivono:** `registro` · `esercizio` · `non con` · `trascrivi` · `accento`

**Righe che non si trascrivono:** *quelle la cui cella `trascrivi` dice `no`.* **Oggi nessuna.**

**Sezioni che non si trascrivono:** 9 · 10

*La sezione uno non si dichiara: non entra mai, ed è lo script a saperlo.*

### ② LE CINQUE COLONNE DI LAVORO

| Colonna | Dove | Cosa dice | Quante volte la usiamo |
|---|---|---|---|
| **`registro`** | tutti e quattro i gradi | `standard` · `locale` · `slang` | **zero volte diverse da `standard`** — *`gate` è tutto neutro. Il primo uso vero arriva col `voseo`* |
| **`esercizio`** | A, B, C | `sì`/`no` — se il target va usato come domanda **con alternative** | **zero `no`** |
| **`non con`** | A, B, C | con chi non deve **mai** comparire come distrattore | ⭐ **8 id** |
| **`trascrivi`** | i quattro gradi | se la riga va nel sorgente | *il suo lettore è lo script* |
| **`accento`** | sezione 6 | da quale lingua viene l'accento di chi parla | *vive anche nel tabellone dei personaggi* |

⭐ **Nessuna di queste entra nel JSON, e la regola che lo decide è `R1`:**

> **Un campo nasce il giorno in cui qualcosa lo legge. Prima di quel giorno vive in questo file.**

⚠️ **E il nome della prima è `registro`, non `tipo`, per una ragione misurata:** *la sezione 7 ha già una
colonna `tipo` — il tipo di campo dello slot — e due colonne con lo stesso nome fanno sparire quella
sbagliata senza un errore.*

### ③ COSA È VENUTO FUORI MONTANDO QUESTO FILE

**SPAGNOLO_064** · 🔴 **Due contraddizioni fra i passi, trovate solo mettendoli insieme.**

| | Il difetto | Come è stato risolto |
|---|---|---|
| **1** | *Il passo D dichiara gli slot delle età su `ages.**anios**`; `spagnolo-it-tabelle-personalizzazione` dice **`ages.anni`*** | ✅ **`ages.anni`.** *Il passo D **poneva** la domanda in fondo e rispondeva «io terrei `ages.anni`» — poi la sua tabella è rimasta con l'altro. **Decisione presa, tabella non aggiornata*** |
| **2** | *Il passo E corregge la traduzione di `d-4` in «Sono di»; `c-3`, che da `d-4` è ricavata, era rimasta «Vengo da»* | ✅ **allineata** |

⭐ **Ed è il primo risultato del montaggio: finché erano appunti, quelle righe non si guardavano.**
*Nessuna delle due si vedeva leggendo un file solo.*

**SPAGNOLO_066** · 🔴 **E una terza, trovata generando il sorgente: le sezioni 9 e 10 ci finivano
dentro.**

*L'inglese arriva alla sezione 8, questo file arriva alla 10 — e lo script copiava tutto quello che
trovava dalla 2 in giù.* **Le cose in sospeso e la nota sull'episodio sono NOSTRE, e sarebbero andate a
Code.**

⚠️ **Se ne è accorto un occhio che leggeva il verbale dello script.** *Un occhio non è un controllo:
funziona il giorno in cui uno guarda.* **Quindi adesso la lista delle sezioni si dichiara qui sopra, e
una sezione dichiarata che non esiste ferma lo script** — *come già fanno le colonne.*

⭐ **E il primo tentativo di scriverla è caduto nella trappola del marcatore, di nuovo.** *La nota
«questo file arriva alla **8**» stava sulla stessa riga della dichiarazione, e lo script ha letto quell'8
come una sezione da togliere: l'inglese è uscito **senza la sezione 8**.* **Adesso la riga si taglia al
primo em-dash: prima si dichiara, dopo si commenta.**

> **È la stessa forma di tutta la settimana: qualcosa che sembra a posto, non lo è, e non lo dice.**
> *Stavolta l'ha detto, perché il verbale stampa cosa toglie.*

**SPAGNOLO_067** · 🔴 **E una quarta, trovata da Claude Code leggendo il testo: la skill `d-3` insegnava
lo spagnolo sbagliato.**

*Diceva «al plurale c'è **una forma sola**: `ustedes`».* **Vero in America, falso in Spagna** — *dove
fra amici si dice `vosotros`, con un verbo suo.*

⚠️ **E la decisione giusta era già presa dal 25 settembre** (`SPAGNOLO_001`: *«lo spagnolo è `es-ES`»*).
*Il 27 l'abbiamo riscritta come «`español neutro`, e `es-MX` è il codice più vicino» —* 🔴 **ma `es-MX`
non è un livello di neutralità: è una varietà.** *Il contenuto ha seguito il codice, non la decisione.*

⭐ **Ed è la prima volta questa settimana che un difetto lo trova qualcun altro leggendo il nostro
testo**, *invece di uscire montando o generando.* **`gate` non contiene nessun «voi» plurale — la
hostess dà del lei al singolare — quindi cambia solo il corpo di quella skill: nessuna battuta, nessun
grado, nessun conto.**

⚠️ **Resta aperta una riga:** *la nota di pronuncia di `a-yo` dice «in Messico «io», non «gio»», ed è una
nota americana in un corso che insegna `es-ES`.* **Non si riscrive a naso: la pronuncia è contenuto.**

---

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 16 voci in A, 4 in B, 9 in C, 9 battute in D, 7 skill, 8 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Per confronto, `gate` inglese: **11 · 7 · 9 · 9**, 8 skill, 8 slot.*

⭐ **Lo scarto ha una causa sola: lo spagnolo mette il pronome DENTRO il verbo.** *`I am` sono due parole
e sta in B; `soy` è una parola e sta in A. Quattro voci escono dal B, due entrano nell'A, più `es` e
`tengo` che in inglese a `gate` non c'erano.*

⚠️ **Quindi il rapporto fra grado A e grado B non è una proprietà del corso: è una proprietà della lingua
insegnata.** *Non esiste un numero «giusto» di voci per grado, e non va inseguito.*

---

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| L'accento scritto dice dove cade la voce: **dí**-as, **dón**-de. |

⭐ **È la prima della rotazione spagnola, e fa il lavoro che in inglese faceva la «e» finale muta:** *una
regola di **lettura**, che paga a ogni parola nuova invece che a una sola.*

---

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | es | it | registro | trascrivi |
|---|---|---|---|---|---|---|
| `d-1` | `hostess-gate` | `staff` | ¡Buenos días! Mucho gusto. | Buongiorno! Piacere di conoscervi. | `standard` | sì |
| `d-2` | `papa` | `family` | ¡Buenos días! Soy {{papa}}. | Buongiorno! Sono {{papa}}. | `standard` | sì |
| `d-3` | `hostess-gate` | `staff` | ¿De dónde es, {{papa}}? | Di dov'è, {{papa}}? | `standard` | sì |
| `d-4` | `papa` | `family` | Soy de {{partenza}}, {{partenza.paese:es}}. | Sono di {{partenza}}, {{partenza.paese}}. | `standard` | sì |
| `d-5` | `hostess-gate` | `staff` | ¿Y usted? | E lei? | `standard` | sì |
| `d-6` | `mamma` | `family` | ¡Buenos días! Soy {{mamma}}. | Buongiorno! Sono {{mamma}}. | `standard` | sì |
| `d-7` | `figlia` | `family` | ¡Hola! Soy {{figliaNome}}. Tengo {{figliaEta}} años. | Ciao! Sono {{figliaNome}}. Ho {{figliaEta}} anni. | `standard` | sì |
| `d-8` | `figlio` | `family` | ¡Hola! Yo soy {{figlioNome}}. ¡Tengo {{figlioEta}} años! | Ciao! Io sono {{figlioNome}}. Ho {{figlioEta}} anni! | `standard` | sì |
| `d-9` | `tutti` | `family` | ¡Somos la familia {{cognome}}! | Siamo la famiglia {{cognome}}! | `standard` | sì |

⚠️ **`d-2` e `d-6` hanno la stessa struttura, e va bene:** *nel dialogo la posizione è l'identità della
battuta — prima si presenta il papà, poi la mamma.*

⭐ **E `d-8` è l'unica battuta che porta `yo`, di proposito:** *il figlio più piccolo vuole farsi notare.*
**Non è una variante stilistica: è il materiale della skill che spiega quando il pronome si mette.**

### Grado C — le frasi

| id | es | it | da | registro | esercizio | non con | trascrivi |
|---|---|---|---|---|---|---|---|
| `c-1` | Soy {{papa}}. | Sono {{papa}}. | `d-2` | `standard` | sì | `c-4` · `c-5` | sì |
| `c-2` | ¿De dónde es? | Di dov'è? | `d-3` | `standard` | sì | · | sì |
| `c-3` | Soy de {{partenza}}, {{partenza.paese:es}}. | Sono di {{partenza}}, {{partenza.paese}}. | `d-4` | `standard` | sì | · | sì |
| `c-4` | Soy {{mamma}}. | Sono {{mamma}}. | `d-6` | `standard` | sì | `c-1` · `c-5` | sì |
| `c-5` | Soy {{figliaNome}}. | Sono {{figliaNome}}. | `d-7` | `standard` | sì | `c-1` · `c-4` | sì |
| `c-6` | Tengo {{figliaEta}} años. | Ho {{figliaEta}} anni. | `d-7` | `standard` | sì | `c-8` | sì |
| `c-7` | Yo soy {{figlioNome}}. | Io sono {{figlioNome}}. | `d-8` | `standard` | sì | · | sì |
| `c-8` | Tengo {{figlioEta}} años. | Ho {{figlioEta}} anni. | `d-8` | `standard` | sì | `c-6` | sì |
| `c-9` | ¡Somos la familia {{cognome}}! | Siamo la famiglia {{cognome}}! | `d-9` | `standard` | sì | · | sì |

**SPAGNOLO_065** · ⭐ **`c-7` NON si esclude da `c-1`, `c-4`, `c-5`, ed è una scelta.** *Differisce per
una **parola vera** — `yo` — non per un segnaposto.* **Usarlo come distrattore fa scegliere fra «Soy» e
«Yo soy», che è esattamente il contenuto della sua skill.**

*Le altre tre invece differiscono **solo per il segnaposto**, e con certe personalizzazioni producono la
stessa risposta italiana.* **Otto id in tutto.**

### Grado B — le espressioni

| id | es | it | pronuncia | categoria | registro | esercizio | non con | trascrivi |
|---|---|---|---|---|---|---|---|---|
| `b-buenos-dias` | buenos días | Buongiorno | BUE-nos DI-as | saluto di servizio | `standard` | sì | · | sì |
| `b-mucho-gusto` | mucho gusto | Piacere di conoscerti / conoscervi | MU-cio GUS-to | espressione idiomatica | `standard` | sì | · | sì |
| `b-soy-de` | soy de | Sono di / Vengo da | soi de | verbo `ser` + preposizione | `standard` | sì | · | sì |
| `b-y-usted` | ¿y usted? | E lei? | i us-TE | espressione | `standard` | sì | · | sì |

**SPAGNOLO_054** · **`¿de dónde?` non è qui, e non è una dimenticanza.** *La forma della domanda vive nel
grado C, `c-2` — **come in inglese**, dove `Where are you from?` sta in C e non fra le espressioni.*

### Grado A — le parole

| id | es | it | pronuncia | categoria | registro | esercizio | non con | trascrivi |
|---|---|---|---|---|---|---|---|---|
| `a-hola` | hola | Ciao / Salve | O-la — **la «h» non si legge**, come in italiano | saluto | `standard` | sì | · | sì |
| `a-dias` | días | giorni | DI-as — *l'accento scritto è sulla «i»* | sostantivo | `standard` | sì | · | sì |
| `a-mucho` | mucho | molto | MU-cio — ⚠️ **la «ch» spagnola è la «c» di «ciao»** | avverbio di quantità | `standard` | sì | · | sì |
| `a-gusto` | gusto | piacere | GUS-to | sostantivo | `standard` | sì | · | sì |
| `a-soy` | soy | (io) sono | soi — *una sillaba* | verbo `ser` | `standard` | sì | · | sì |
| `a-es` | es | (lui/lei) è · (lei) è | es | verbo `ser` | `standard` | sì | · | sì |
| `a-somos` | somos | (noi) siamo | SO-mos | verbo `ser` | `standard` | sì | · | sì |
| `a-tengo` | tengo | (io) ho | TEN-go — *la «g» è dura, come in «gatto»* | verbo `tener` | `standard` | sì | · | sì |
| `a-de` | de | di / da | de | preposizione | `standard` | sì | · | sì |
| `a-donde` | dónde | dove | DON-de — *l'accento scritto è sulla prima* | avverbio interrogativo | `standard` | sì | · | sì |
| `a-y` | y | e | i — **si legge «i», non «ipsilon»** | congiunzione | `standard` | sì | · | sì |
| `a-usted` | usted | lei *(di cortesia)* | us-TE — ⚠️ **la «d» finale non si sente quasi** | pronome di cortesia | `standard` | sì | · | sì |
| `a-yo` | yo | io | io — *in Messico «io», non «gio»* | pronome soggetto | `standard` | sì | · | sì |
| `a-anos` | años | anni | A-gnos — **la «ñ» è il nostro «gn»** | sostantivo plurale | `standard` | sì | · | sì |
| `a-la` | la | la | la | articolo | `standard` | sì | · | sì |
| `a-familia` | familia | famiglia | fa-MI-lia — *accento come in italiano* | sostantivo | `standard` | sì | · | sì |

**SPAGNOLO_053** · ⚠️ **`buenos` NON è nel grado A, ed è una scelta.** *`W-a-da-sola`: un ispanofono non
dice `buenos` da solo con questo significato — vive dentro `buenos días`, `buenas tardes`.* **Quando
arriveranno gli aggettivi, `bueno` entrerà lì.**

⭐ **Nessuna esclusione nel grado A: le sedici traduzioni sono tutte diverse fra loro.**

---

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Buenos días e hola | "Buenos días" lo dice chi lavora, "hola" lo dici a un amico — e sono <strong>tutti due corretti</strong>.<br>Nel dialogo lo senti: l'hostess e i genitori dicono "buenos días", i figli "hola".<br>"Hola" va bene sempre, con chiunque: se sei in dubbio, è la scelta sicura.<br>Una cosa da sapere: "buenos días" vale <strong>solo fino a mezzogiorno</strong>. Dopo cambia, e lo vedremo più avanti. |
| `d-1` | 2 | Mucho gusto | Si dice quando incontri qualcuno per la <strong>prima volta</strong>, ed è il modo normale di farlo: né troppo formale né troppo informale.<br>Non tradurla parola per parola — funziona tutta insieme, come il nostro "piacere di conoscerti".<br>Dalla seconda volta che vedi una persona non si usa più: lì basta "¡Hola!".<br>Esiste anche "encantado", ed è giusto — ma <strong>cambia se lo dice un uomo o una donna</strong>. "Mucho gusto" va bene per tutti, e per ora è quella che ti serve. |
| `d-3` | 1 | Dare del «lei»: usted | Per dare del "lei" si usa <strong>usted</strong>, e il verbo va alla terza persona — <strong>esattamente come in italiano</strong>.<br>"¿De dónde es {{papa:es}}?" è "Lei di dov'è?". A un amico l'hostess direbbe "¿De dónde eres?", cioè "Di dove sei?".<br>Quindi qui non c'è un meccanismo nuovo da imparare: c'è una parola nuova, "usted".<br>Si dà del "usted" a chi lavora, a chi non conosci, a chi è più grande di te. Fra amici e in famiglia, "tú".<br>E al plurale ce ne sono <strong>due</strong>: "vosotros" fra amici, "ustedes" quando dai del lei a più persone.<br>In italiano diciamo "voi" in tutti e due i casi: <strong>è un punto in cui lo spagnolo ha una parola in più di noi</strong>. |
| `d-4` | 1 | Dire da dove vieni | "Soy de {{partenza:es}}" vuol dire "sono di {{partenza:it}}": <strong>identico all'italiano</strong>, anche il verbo.<br>"De" significa "di, da". La userai tantissimo.<br>Domanda e risposta hanno le stesse parole: "¿De dónde es?" → "Soy de…". Se impari una, hai già l'altra.<br>Una cosa che noterai: il tuo nome resta il tuo — Marco è Marco anche in spagnolo. La tua città a volte cambia un accento: Torino diventa <strong>Turín</strong>. Su questo torniamo per bene più avanti. |
| `d-5` | 1 | ¿Y usted? | Vuol dire "e lei?", e serve a rimandare la stessa domanda a un'altra persona senza ripeterla tutta.<br>Nel dialogo l'hostess l'ha appena chiesta al papà, e con "¿Y usted?" la gira alla mamma.<br>Funziona con qualsiasi domanda, ed è utilissima: la sentirai continuamente.<br>Con un amico diventa "¿Y tú?". |
| `d-7` | 1 | Dire quanti anni hai | "Tengo {{figliaEta:es}} años" vuol dire "ho {{figliaEta:it}} anni": <strong>uguale all'italiano</strong>, anche il verbo.<br>Una cosa da ricordare: <strong>"años" non si può togliere</strong>. "Tengo dieciséis" da solo non si dice, mentre in italiano "ho sedici" si capirebbe.<br>"Tener" è il verbo avere, e lo ritroverai ovunque: "tengo hambre", "tengo un hermano". |
| `d-8` | 1 | Quando si mette «yo» | In spagnolo "io, tu, lui" <strong>si saltano</strong>, come in italiano — e quando ci sono, servono a insistere.<br>La figlia dice "Soy {{figliaNome:es}}". Il figlio dice "<strong>Yo</strong> soy {{figlioNome:es}}": sono tutti due giusti.<br>Il figlio ci mette "yo" perché vuole farsi notare — come quando un bambino dice "<strong>IO</strong> sono {{figlioNome:it}}!".<br>Quindi, se non hai un motivo per insistere, lascialo fuori: "soy" basta. |

⚠️ **Sette e non otto, e la differenza con l'inglese è una misura, non una scelta:** *in `gate` inglese
una skill intera serviva a spiegare che l'età si dice col verbo **essere**.* **In spagnolo si dice col
verbo avere, come in italiano — e quella skill non serve.**

---

## 6 — PERSONAGGI ED ETICHETTE

*Colonne: **chiave** e **etichetta** → `speakerLabels` · **accento** → ⚠️ **non dentro `speakerLabels`** —
vive nel tabellone dei personaggi.*

| chiave | etichetta a schermo | accento |
|---|---|---|
| `hostess-gate` | Hostess al gate | `es-MX` |
| `papa` | Papà | `it` |
| `mamma` | Mamma | `it` |
| `figlia` | Figlia | `it` |
| `figlio` | Figlio | `it` |
| `tutti` | Tutti | `it` |

⚠️ **La famiglia ha l'accento italiano e le parole corrette.** *Sono italiani che parlano spagnolo, e lo
studente si riconosce nel papà che ha l'accento — non in un madrelingua perfetto.* **Leggero: un modello
da imitare che sbaglia le parole distruggerebbe Repeat Aloud.**

⚠️ **E l'hostess ha l'accento messicano anche se il gate è in Italia:** *l'equipaggio è quello del volo, e
vola avanti e indietro dalla destinazione.* **È la stessa premessa dell'edizione inglese**, *dove al gate
c'è il personale di un volo per la Cina.*

---

## 7 — GLI SLOT

*Le colonne **chiave** → `placeholderMap`, e tutte insieme → una voce di `personalizationTablesUsed`.*

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

⚠️ **La tabella si chiama `ages.anni` anche in spagnolo, e non `ages.anios`.** *Il nome di una tabella è
un id e lo studente non lo legge: tradurlo per edizione vorrebbe dire che `trascrivi.js` deve sapere come
si chiama in ogni lingua.*

⚠️ **E la destinazione NON è uno slot**, al contrario dell'inglese: *è dell'edizione — **Ciudad de
México** — e si scrive dentro la battuta quando arriverà.* **Se ogni studente scegliesse una città, le
città si brucerebbero e gli episodi dovrebbero restare neutri in tutte.**

---

## 8 — LE TABELLE INTERNE ALL'EPISODIO

*Nessuna.* **Come in `aircraft-door`, che è il caso normale.**

---

## 9 — LE COSE IN SOSPESO, TUTTE CON UNA DATA

| Cosa | Perché entra senza essere aperta | Dove verrà aperta |
|---|---|---|
| **`usted`** | *lo usa solo l'hostess: la famiglia risponde con `soy`, `tengo`, `somos` e **non ha bisogno di produrlo*** | la scheda della cortesia — **spiegato intanto dalla skill `d-3`** |
| **`la` come articolo** | dentro il chunk `la familia {{cognome}}` | la scheda degli articoli |
| **`buenas tardes` · `buenas noches`** | la skill `d-1` dice «dopo cambia, e lo vedremo» | l'episodio dei saluti |
| **`encantado`** | nominato nella skill `d-1` #2 come alternativa, **non insegnato** | la scheda degli aggettivi, dove il genere diventa il contenuto |

⚠️ **E `la familia` è in sospeso nella STESSA battuta in cui l'inglese lascia in sospeso `the`:**
«We are **the** Costa family» / «Somos **la** familia Costa». ⭐ **Il metodo si è comportato allo stesso
modo in due lingue diverse, senza che glielo dicessimo.**

---

## 10 — ⭐ LA COSA DA SAPERE SU QUESTO EPISODIO

**SPAGNOLO_059** · **Per un italiano, `gate` in spagnolo non ha NESSUN punto di grammatica difficile.**

*`ser`/`estar` è l'unico 🔴 dell'A1, **e in `gate` non compare**: tutte le battute chiedono `ser`.*

⚠️ **Non è un difetto, ed è meglio dirlo che scoprirlo:** *tutta la fatica dell'episodio va nelle
**parole** — ventinove voci fra A e B — e nella **pronuncia**, invece di essere spesa a combattere una
struttura.* **Per il primo episodio narrativo è il posto giusto dove essere facili.**

🔴 **E dice anche dove sarà dura:** *`ser`/`estar` avrà bisogno di un episodio suo, e va progettato
sapendo che è **il primo scoglio vero del corso**.*
