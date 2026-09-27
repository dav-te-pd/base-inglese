**Versione: 20260926a**

# Piano — spagnolo per italiani

> **Questo file NON si cancella.** *Era nato come una scaletta da buttare a lavoro finito. Adesso è
> **il modello di ogni edizione futura**: francese, tedesco, e `italiano/spagnolo`. Quando lo
> spagnolo è collaudato, questo file resta e si copia.*
>
> *Le regole non le riscrive: stanno in `inglese-it-edizione`, parte 2.*

---

## 1 — ⚠️ IL CONFLITTO DA RISOLVERE PRIMA DI TUTTO

**Due decisioni prese in giorni diversi si scontrano, e nessuna delle due è sbagliata.**

| | Decisione | Quando |
|---|---|---|
| **①** | **La famiglia va a Madrid**, e lo spagnolo è `es-ES` | `SPAGNOLO_001`, 25 settembre |
| **②** | **Le scene sono le stesse in tutte le edizioni**, e la trama non diverge | 25 settembre, e `EDIZIONE_014` |

⚠️ **Italia → Madrid sono due ore, e le dieci scene del volo sono state scritte per un lungo
raggio.** *Il gate, la porta, il posto, il vicino, prima del decollo: reggono. **Il pasto, il
carrello delle bevande, la coperta, la turbolenza: su un volo di due ore non esistono.***

**Il piano lo aveva già segnato come «da verificare» — `SPAGNOLO_006`. Adesso non è più da
verificare: la decisione ② lo decide.** *Se le scene sono le stesse e la rotta è breve, quattro scene
su dieci vanno buttate — e l'edizione diverge proprio nel punto in cui avevamo deciso che non
dovesse.*

### Le tre uscite

| | Cosa si fa | Cosa costa |
|---|---|---|
| **A** ⭐ | **La destinazione dell'A1 spagnolo è un lungo raggio** — *Città del Messico, Buenos Aires, Bogotá.* **Madrid diventa una tappa successiva** | l'accento non è più `es-ES`: *`es-MX` o `es-419`* |
| **B** | Madrid resta, e l'A1 spagnolo ha **sei scene invece di dieci** | ⚠️ **le edizioni divergono al primo episodio**, e il confronto riga per riga con l'inglese si perde |
| **C** | Madrid resta, e le quattro scene mancanti si sostituiscono con scene di terra | ⚠️ **inventiamo quattro scene che l'inglese non ha** — *ed è esattamente il contatore che `SPAGNOLO_015` dice di tenere a zero* |

**Consiglio: A.** *Non perché Madrid sia sbagliata — perché **la rotta lunga è quello che rende le
scene riusabili**, e la riusabilità delle scene è l'unica ragione per cui una seconda edizione costa
poco.*

⚠️ **E l'accento latinoamericano non è un ripiego:** *Città del Messico è la città ispanofona più
grande del mondo, e la maggior parte di chi parla spagnolo non è in Spagna.* **Madrid arriva dopo, e
porta materiale NUOVO** — *il treno, la metro, le distanze brevi — invece di togliere materiale.*

---

## 2 — QUALE TABELLONE SI COPIA E QUALE SI RISCRIVE

⚠️ **È la pagina più importante del file, perché è quella che dice quanto costa un'edizione.**

| Tabellone | Spagnolo | Perché |
|---|---|---|
| **Le situazioni** | ✅ **si copia** | *sono la vita, non la lingua: presentarsi, chiedere il bagno, ordinare al bar. **Le ventitré righe sono identiche***, comprese le due trasversali |
| **Gli episodi** | ✅ **si copia la struttura**, si riscrivono i conti | *stessi id, stesse scene, stessa colonna «cosa saprai fare». Cambiano i numeri delle voci, le skill, la regola generale* |
| **I personaggi** | ✅ **si copiano i ruoli** | *stessa famiglia, stesso aspetto, stesse due hostess.* ⚠️ **Il madrelingua ricorrente cambia persona e resta ruolo:** *non Arthur di Londra ma qualcuno di Madrid o Buenos Aires* |
| **La rotta** | 🔴 **si riscrive** | *è l'unica cosa che cambia del tutto: destinazioni, tappe, accenti* |
| **Le schede grammaticali** | 🔴 **si riscrive** | ⚠️ **è della coppia di lingue** — `ser`/`estar` non esistono in inglese, e il verbo essere inglese non si spezza in due |
| **Le regole della lingua** | 🔴 **si riscrive** | idem: *`you` vale tu e voi è una regola `it→en`; `tú`/`usted`/`vosotros` è il suo opposto* |
| **Le trappole** | 🔴 **si riscrive** | idem — *e due delle nostre **sparisc0no**, vedi §5* |
| **La pronuncia** | 🔴 **si riscrive** | *la `th`, la `gh` muta, la `e` finale: nessuna delle sette esiste in spagnolo* |

**SPAGNOLO_016** · ⚠️ **Tre tabelloni su otto si copiano, e sono proprio quelli che sono costati più
tempo:** *le ventitré situazioni, i ruoli dei personaggi, la struttura degli episodi.* **È la prova
che la divisione fra «quello che è del metodo» e «quello che è della coppia di lingue» era giusta.**

---

## 3 — I FILE DA SCRIVERE — sono cinque tipi, non tre

⚠️ **Il 2026-09-26 i file DATI sono diventati cinque:** *ai tre di prima si sono aggiunti
`istruzioni-moduli` (208 stringhe) e `messaggi-feedback` (141) — i testi che lo studente legge dentro
i moduli, che **non avevano nessuna fonte markdown**.*

| File | Cosa si fa | Cosa cambia davvero |
|---|---|---|
| `spagnolo-it-struttura-corso` | **si scrive dal modello** | le direzioni (`es→it`, `it→es`), i sottotitoli, le lingue del parlato. ⚠️ **E la colonna «categoria» dei moduli, nata oggi.** *Gradi, categorie, moduli e sequenze **si copiano**: sono del metodo* |
| `spagnolo-it-tabelle-personalizzazione` | **si scrive dal modello** | ⚠️ **tutto**: i nomi spagnoli non sono i nomi italiani tradotti |
| `spagnolo-it-{id}` | **si scrive dal modello** | tutto |
| `spagnolo-it-edizione` | **si copia e si riscrive a metà** | *parte 2 (il metodo) e la struttura della parte 3 **si copiano**; il contenuto dei cinque tabelloni di lingua si riscrive* |
| `istruzioni-moduli` · `messaggi-feedback` | ⚠️ **vedi qui sotto: NON si copiano** | · |

### ⚠️ E qui c'è una scelta di architettura da fare adesso, non dopo

**SPAGNOLO_017** · **`istruzioni-moduli` e `messaggi-feedback` non dipendono dalla lingua che si
insegna: dipendono dalla lingua dello STUDENTE.** *«Tocca il microfono per registrare» è identico in
tutte le edizioni per italiani.*

⚠️ **Copiarli per edizione vuol dire 349 stringhe duplicate ogni volta.** *Con quattro edizioni per
italiani — inglese, spagnolo, francese, tedesco — sono **1396 stringhe di cui 1047 sono copie**, e
una copia che nessuno riallinea diverge. **È il problema dei dodici consigli ripetuti, moltiplicato
per cento.***

**SPAGNOLO_018** · **Ma non sono del tutto neutre: una decina nomina la lingua insegnata.** *«Vedi
una parola in **inglese** e quattro traduzioni italiane» · «ascolta il modello **inglese**».*

**SPAGNOLO_019** · ⭐ **La soluzione è un segnaposto, ed è il meccanismo che l'app ha già:**
`{{lingua}}`. *«Vedi una parola in `{{lingua}}` e quattro traduzioni italiane».* **Un file solo per
tutte le edizioni italiane, e la lingua arriva dall'edizione** — *come `{{papa}}` arriva dalla
personalizzazione.*

⚠️ **Va chiesto a Claude Code prima di scrivere lo spagnolo**, perché tocca dove vivono i file:
*`data/inglese/it/` e `data/spagnolo/it/` oggi sono cartelle separate, e un file condiviso da tutte
le edizioni italiane non ha una cartella dove stare.*

---

## 4 — LA SCALETTA

*Si va **dall'alto verso il basso**: ogni riga si chiude prima di aprire la successiva.*

| # | Passo | Dove sta la regola | Stato |
|---|---|---|---|
| **0** | ⚠️ **La rotta** — sciogliere il conflitto della §1 | qui sopra | 🔴 **blocca tutto il resto** |
| **A** | **Le schede grammaticali `it→es`** | `edizione` 3.4 | · |
| **B** | **Le regole della lingua, le trappole, la pronuncia** | `edizione` 3.5 · 3.6 · 3.7 | · |
| **C** | **Il taglio dell'A1** — quali strutture entrano, e perché | `edizione` 2.1 | · |
| **D** | **La rotta e i personaggi** | `edizione` 3.2 · 3.8 | · |
| **E** | **Le situazioni** — *si copiano, si riempie la colonna «episodio»* | `edizione` 3.3 | · |
| **F** | **L'episodio, in undici passi** | `edizione` 2.2 | · |
| **G** | **I file**, nell'ordine della §3 | qui sopra | · |
| **H** | **Trascrizione e collaudo** | `edizione` 2.7 | · |

**SPAGNOLO_007** · ⚠️ **Da A a C si decide la grammatica, e lì si vede se il sistema regge.** *Se
arrivassimo al dialogo senza, sarebbe il dialogo a decidere cosa si insegna — l'ordine invertito che
`METODO_039` vieta.*

---

## 5 — COSA SI SA GIÀ CHE CAMBIA

*Non è l'inventario: è l'elenco delle cose che **sicuramente** saranno diverse, da cui partire al
passo A.*

| | `it→en` | `it→es` |
|---|---|---|
| **Il verbo essere** | uno | ⚠️ **due: `ser` e `estar`** — *e la scelta è una struttura in sé* |
| **L'età** | ⚠️ *«I am ten»: la trappola più cara del corso* | **«tengo diez años»** — come l'italiano: **la trappola sparisce** |
| **Il «tu»** | uno solo, e il *lei* non esiste | ⚠️ **`tú` · `usted` · `vosotros`** — *e all'hostess si dà del `usted`* |
| **Il pronome soggetto** | ⚠️ *obbligatorio: «I am», mai «am»* | **si omette, come in italiano**: *«soy Marco»* |
| **I toponimi** | *Torino → Turin* | *Torino → Turín* — **accento, non nome diverso** |
| **La pronuncia** | sette fenomeni, nessuno italiano | *la `j`, la `ll`, la `ñ`, la `z`* — **altri sette, e più facili** |

**SPAGNOLO_012** · ⚠️ **Le due righe che spariscono sono il risultato più importante del collaudo:**
*se la griglia fosse una traduzione, resterebbero. **Non restano**, ed è la prova che appartiene alla
coppia di lingue.*

**SPAGNOLO_020** · ⚠️ **E una cosa nuova, che l'inglese non aveva:** *`R-pronome` — «il pronome
soggetto non si salta mai» — **in spagnolo è l'opposto**: si salta, come in italiano.* **Una regola
può invertirsi e non solo sparire, e il tabellone deve poterlo dire.**

---

## 6 — GLI APERTI, E LA DOMANDA DEL COLLAUDO

**SPAGNOLO_013** · **Quale episodio per primo:** `gate`. *Stessa scena, e si confronta riga per riga
con l'inglese.*

**SPAGNOLO_014** · **Quanti prima di dire che il sistema regge:** due.

**SPAGNOLO_002** · **La destinazione NON è personalizzabile: è dell'edizione.** *Se ogni studente
scegliesse una città, le città si brucerebbero e gli episodi dovrebbero restare neutri in tutte.*

**SPAGNOLO_004** · ⚠️ **APERTO — se funziona, si toglie anche dall'inglese.** *Là oggi è uno slot con
tre città. Si decide dopo il collaudo spagnolo, non prima.*

**SPAGNOLO_015** · ⭐ ⚠️ **LA DOMANDA DEL COLLAUDO, DA TENERE DAVANTI DAL PRIMO GIORNO:**

> **Quante volte abbiamo dovuto INVENTARE qualcosa che l'inglese non aveva?**
>
> **Zero è il risultato buono.** *E ogni volta che succede, va scritto qui — con cosa era e perché.*

| # | Cosa abbiamo dovuto inventare | Perché |
|---|---|---|
| · | · | · |

---

## 7 — COME SI USA QUESTO FILE PER LA PROSSIMA EDIZIONE

**SPAGNOLO_021** · **Si copia, si cambia il nome, e si svuotano tre cose:** *la §1 (il conflitto della
rotta, che ogni edizione ha suo), la §5 (cosa si sa già che cambia) e la tabella della §6.*

**SPAGNOLO_022** · **Quello che NON si cambia è la §2** — *quale tabellone si copia e quale si
riscrive.* ⚠️ **Quella tabella non è dello spagnolo: è del metodo**, e se un giorno cambia vuol dire
che abbiamo scoperto qualcosa sul confine fra il metodo e la lingua.

**SPAGNOLO_023** · ⚠️ **E per `italiano/spagnolo` — insegnare l'italiano a chi parla spagnolo — due
file NON si copiano più: `istruzioni-moduli` e `messaggi-feedback` vanno riscritti in spagnolo.**
*Perché lì lo studente non è italiano.* **È il vero collaudo della multi-edizione, ed è il motivo per
cui va fatto secondo e non primo.**
