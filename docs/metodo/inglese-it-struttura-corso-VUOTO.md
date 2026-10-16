**Versione: VUOTO-20261016c**

# Struttura del corso — {lingua} per {studente}

<!-- MODELLO DI UN FILE STRUTTURA — rifatto il 2026-10-16.
     Si copia, si riempie, si rinomina in {lingua}-{studente}-struttura-corso.md.

     ⭐ SI TRASCRIVE COM'È. Un modello che non si trascrive può mentire sulla
     propria forma senza che nessuno se ne accorga — ed è precisamente quello
     che è successo a questo file. -->

---

## 🔴 QUESTO MODELLO È STATO SCADUTO PER OTTO PUNTI, E NESSUNO L'HA VISTO

**Fermo al 2026-09-23 fino al 2026-10-16.** *Nel frattempo il parser è cambiato cinque volte.* ⚠️ **E l'ottavo punto non l'ha trovato una rilettura: l'ha trovato una misura, dopo che questo file era già stato rifatto.**

| Diceva | Com'è |
|---|---|
| **cinque** titoli cercati | 🔴 **sette** |
| *il riquadro storico della §5 stava **prima** della tabella dei passi* | 🔴 **il parser prende la prima tabella: avrebbe letto quel riquadro** |
| §3 → *«legge `moduleTypes`»*, tabella a **3** colonne | **non scrive più niente nel JSON**, tabella a **2** |
| §4 con la colonna **«Sottotitolo»** | 🔴 **«Categoria»**: il sottotitolo è uscito il 13/10 |
| §5 → *«NESSUN TEST LEGGE ANCORA QUESTA SEZIONE»* | 🔴 **la legge il trascrittore**, 3 colonne |
| **§9 assente** | *esiste dal 1/10, e il trascrittore la cerca* |
| *«l'ordine conta in tre sezioni su cinque»* | **in due su sette** |
| *fra le colonne coi backtick: «sottotitolo del modulo»* | *quella colonna non esiste più* |

⭐ **E il modo in cui è stato trovato è la ragione per cui va trascritto da un test:** *non l'ha letto
nessuno per tre settimane. Il 2026-10-16 è emerso rotto perché il trascrittore nuovo **lo fermerebbe** —
cioè perché per la prima volta esiste qualcosa che lo misura.*

> 🔴 **Un modello che nessuno trascrive non descrive la forma: la ricorda.**

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/{lingua}/{studente}/{lingua}-{studente}-struttura-corso.json`.** Le ragioni, le decisioni e quello
che è aperto stanno nei file RAGIONI e non qui.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/tools/trascrivi.js`, 2026-10-16

**Il lettore è `tabellaSotto(testo, titolo)`, e fa tre cose. Tutte e tre decidono come va scritto questo
file.**

**Cerca il titolo per TESTO ESATTO, e il NUMERO è dentro il testo.** *`testo.indexOf(titolo)` —
sottostringa, sensibile a maiuscole e accenti.*

**I SETTE titoli cercati sono `##` più uno spazio più il testo di questa colonna**, carattere per
carattere, e ognuno pretende un numero esatto di colonne:

| Il testo dopo `## ` | Colonne | Cosa ne legge |
|---|---|---|
| `2 — I GRADI` | **3** | `grades` e `gradeNames` |
| `3 — LE CATEGORIE DEI MODULI` | **2** | ⭐ **niente nel JSON**: dichiara solo quali categorie usa l'edizione |
| `4 — I NOMI DEI MODULI` | **3** | `moduleLabels` |
| `5 — LE SEQUENZE DEI MODULI` | **3** | `sequences` |
| `7 — GLI EPISODI` | **4** | `episodes` **e** l'ordine di `episodeSequences` |
| `8 — LE LINGUE DEL PARLATO` | **2** | `speech` |
| `9 — I NOMI A SCHERMO` | **2** | `nomiASchermo` |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA, e non è pedanteria.** *Se questa tabella scrivesse i titoli
per intero, `indexOf` troverebbe **questa riga** invece della sezione vera — e il parser leggerebbe come
«tabella dei gradi» il resto di questa tabella, senza lamentarsi.*

⭐ **E questo caso ha uno strumento, dal 30/09:** `python3 tests/tools/controllo-titoli.py <file>`. *Conta
le occorrenze di ogni titolo `##` e `###` **in qualunque posizione**, non solo a inizio riga, perché
`indexOf` non sa cosa sia una riga.* 🔴 **Si lancia prima di consegnare: in questa trappola siamo caduti
cinque volte.**

⚠️ **Il trattino è un trattone `—` (U+2014) con uno spazio prima e uno dopo.** *Un trattino normale `-`
non viene trovato, e il parser non dice «trattino sbagliato»: dice «Titolo non trovato».*

⚠️ **RINUMERARE UNA SEZIONE ROMPE LA TRASCRIZIONE.** È il motivo per cui **qui il 6 non esiste**: *la
sezione che lo portava è passata in RAGIONI, e chiudere il buco tirando indietro il 7 farebbe fallire
tre controlli.* ⭐ *Il buco non è un difetto: è il segno visibile che quei numeri sono un'interfaccia.*

**Prende la PRIMA tabella dopo il titolo, e ignora tutto quello che c'è in mezzo.** *Righe di prosa,
avvisi, sottotitoli: saltati, purché non comincino con `|`. La tabella finisce alla prima riga **non
vuota** che non comincia con `|`* — **una riga vuota dentro la tabella non la chiude.**

**Legge le colonne PER POSIZIONE, mai per nome.** *`r[0]`, `r[1]`, `r[2]`, `r[3]`.* **L'intestazione non
viene mai letta: le sue parole sono libere, l'ordine delle colonne no.** *Serve almeno una riga oltre
all'intestazione.*

⚠️ **I backtick si tolgono in alcune colonne e in altre NO**, e la differenza si vede solo qui:

| Dove | I backtick |
|---|---|
| id di categoria, modulo, episodio · categoria · sequenza · chiavi del parlato · ruoli dei nomi a schermo | **tolti** — scriverli o no è uguale |
| **lettera del grado**, **nome del grado**, **nome del modulo**, **nome dell'episodio**, **nomi a schermo** | **NON tolti** — un backtick di troppo è una differenza |

**I nomi che lo studente legge si confrontano carattere per carattere, accenti compresi.** *Il
2026-09-21 «Perché si dice così» scritto con gli apostrofi sbagliati è passato inosservato.*

**L'ordine delle righe conta in DUE sezioni su sette:**

| Sezione | L'ordine delle righe |
|---|---|
| `2 — I GRADI` | **è** l'ordine di `grades` |
| `7 — GLI EPISODI` | **è** l'ordine degli episodi del corso — **spostare un episodio è spostare questa riga** |
| `5 — LE SEQUENZE DEI MODULI` | *dentro una sequenza l'ordine delle righe è l'ordine dei passi; fra sequenze diverse non conta* |
| `3` · `4` · `8` · `9` | *non conta: sono elenchi a chiave* |

🔴 **E la §3 è scesa da «conta» a «non conta» il 2026-10-13**, *quando l'etichetta è uscita da questo
file: prima l'ordine delle righe era l'ordine delle chiavi di `moduleTypes`, adesso l'etichetta si cerca
per chiave nel file condiviso.*

### ② VENTIDUE STRINGHE NON STANNO PIÙ QUI, DAL 2026-10-13

*Non erano dell'edizione: erano **identiche** fra `inglese/it` e `spagnolo/it`.*

| Cosa | Dove sta ora |
|---|---|
| i **sottotitoli** dei moduli | `docs/condivisi/{studente}/`, indicizzati per **kind** |
| le **etichette delle categorie** | *lo stesso file, chiave `categorie`* |
| `nomiASchermo.native` | *lo stesso file, chiave `nomiASchermo`* |

⭐ **La prova che non erano dell'edizione è una misura, non un'opinione: cambiano con la lingua dello
STUDENTE, non con quella insegnata.**

⚠️ **E il trascrittore si ferma se una categoria dichiarata nella §3 non ha la sua etichetta nel file
condiviso.** *Le due metà non possono divergere in silenzio.*

### ③ COSA NON STA QUI, E PERCHÉ

| Stava in | Cosa |
|---|---|
| `1 — IL FILE DI STRUTTURA` | l'elenco delle chiavi: lo dice `CHIAVI_STRUTTURA` in `app/dati.js` |
| `5 — LE REGOLE DI ESITO` | le soglie vivono in `APP_CONFIG`, non in questo JSON |
| `6 — LE SEQUENZE DEI MODULI` | *i principi dell'ordine, il pannello Admin che scrive solo in `localStorage`* |
| ovunque | *i perché delle categorie, «la categoria non dice dove sta l'episodio», i quattro casi `sequence`/`moduleOrder`* |
| `9`, `10` | la lista di controllo e l'edizione nuova |

---

## 2 — I GRADI

*Colonne, nell'ordine: **lettera** → `grades` e chiave di `gradeNames` · **nome mostrato** → valore di
`gradeNames`. La terza colonna non viene letta.*

⚠️ **I nomi dei gradi NON sono condivisi, ed è una decisione, non una dimenticanza** *(regola 26)*: **sono
una scelta didattica di QUESTO corso, non una traduzione.** *Condividerli farebbe governare il francese
da una scelta presa per l'inglese.*

| Lettera | Nome mostrato | Cosa contiene |
|---|---|---|
| X | Nome che vede lo studente | descrizione libera, non letta |
| Y | Un altro nome | descrizione libera, non letta |

---

## 3 — LE CATEGORIE DEI MODULI

*Colonne: **id** → la chiave di `categorie` nel file condiviso (i backtick si tolgono). L'ordine delle
righe non conta.*

🔴 **QUESTA SEZIONE NON SCRIVE NIENTE NEL JSON, dal 2026-10-13.** *Serve a dichiarare **quali** categorie
usa questa edizione: l'etichetta mostrata sta nel file condiviso, perché è nella lingua dello studente.*

⚠️ **E il trascrittore si ferma se una categoria elencata qui non ha la sua etichetta là.**

🔴 **PER QUESTO L'ESEMPIO USA UNA CATEGORIA VERA, `studio`, E NON UN `esempio-categoria`.** *Un id
inventato non ha l'etichetta nel file condiviso, e il controllo incrociato fermerebbe il modello.*

> ⭐ **Un modello si trascrive COM'È, senza che il test gli prepari un file su misura.** *Se ha bisogno di
> un aiuto per passare, non sta descrivendo la forma: sta descrivendo un caso.*

| Id | A cosa serve |
|---|---|
| `inizio` | descrizione libera, non letta |
| `studio` | descrizione libera, non letta |

---

## 4 — I NOMI DEI MODULI

*Colonne: **id** → chiave di `moduleLabels` · **nome** → `.name` · **categoria** → `.categoria`, e
dev'essere uno degli id della §3. Il nome si confronta carattere per carattere.*

⚠️ **`nome` HA UN SECONDO LETTORE:** *è anche il titolo del pop-up «Spiegazione» di quel passo.* **Cambiare
un nome cambia due schermate.**

⭐ **Il titolo del pop-up si deriva da `moduleLabels[id].name` — per ID DEL PASSO, non per kind.** *Due
passi che condividono un kind, come i due versi di Flash Card, hanno due nomi e quindi due titoli, sopra
un corpo solo.*

🔴 **LA COLONNA «SOTTOTITOLO» È USCITA IL 2026-10-13**, *nel file condiviso e indicizzata per `kind`.*
⭐ **Il nome resta qui perché cambia col verso e con la lingua insegnata; il sottotitolo no perché descrive
il modulo.**

| Id | Nome | Categoria |
|---|---|---|
| `esempioInizio` | Nome Del Primo Passo | `inizio` |
| `esempioModulo` | Nome Del Modulo | `studio` |

---

## 5 — LE SEQUENZE DEI MODULI

*Colonne: **sequenza** → chiave di `sequences` · **modulo** → `module`, un id della §4 · **grado** →
`grade`, una lettera della §2, **vuoto** dove il passo non lavora su un grado.*

🔴 **FINO AL 2026-10-16 QUESTO MODELLO DESCRIVEVA UNA FORMA CHE NESSUNA EDIZIONE USA:** *`| # | modulo |
grado |`, un `###` per ogni sequenza e un `—` per «nessun grado».* ⚠️ **Le colonne erano tre, come le
vere, quindi il conto tornava** — *e il controllo che avevamo fatto contava le colonne, non guardava cosa
fossero.*

> 🔴 **Una misura che passa non dice che la cosa è giusta: dice che quella misura è passata.**

| Sequenza | Modulo | Grado |
|---|---|---|
| `nome-della-sequenza` | `esempioInizio` | |
| `nome-della-sequenza` | `esempioModulo` | X |
| `nome-della-sequenza` | `esempioModulo` | Y |

⚠️ **TUTTE le sequenze stanno in QUESTA tabella, una riga per passo, col nome della sequenza ripetuto
nella prima colonna.** *Non c'è un `###` per sequenza, e non c'è una colonna col numero del passo:
l'ordine delle righe È l'ordine dei passi.*

⚠️ **E il grado di un passo che non lavora su un grado è una cella VUOTA, non un trattino.** *Un `—`
diventa il grado `"—"` nel JSON, e nessun controllo se ne accorge.*

### ⭐ PERCHÉ QUESTO MODELLO HA DUE GRADI, DUE CATEGORIE E DUE MODULI — dal 2026-10-16

**Non per completezza: ognuna delle righe in più è l'unico modo di mostrare un caso vero.**

| La riga | Il caso che mostra |
|---|---|
| `esempioInizio` con la cella del grado **vuota** | *un passo che non lavora su un grado — come Your Story* |
| `esempioModulo` su **X** | *il caso normale* |
| ⭐ `esempioModulo` su **Y** | **LO STESSO MODULO SU DUE GRADI** — *è quello che fa Repeat Aloud su A, B e C* |

🔴 **E non va confuso con «lo stesso modulo una volta senza grado e una volta con»:** *un modulo lavora
sui gradi o non ci lavora. Metterlo in entrambi i modi descriverebbe un caso che nessuna edizione ha.*

⚠️ **Ogni riga in più è anche FORZATA da un controllo incrociato:** *la categoria `inizio` deve stare
nella §3 e avere l'etichetta nel file condiviso · il grado `Y` deve stare nella §2 · i due moduli della
§5 devono stare nella §4.* ⭐ **Un modello con un modulo e un grado non potrebbe far scattare nessuno di
questi controlli: sarebbe una forma che non si mette alla prova.**

### 🔴 LA TABELLA DEI PASSI STA SUBITO DOPO LA PROSA, E NON È UNA SCELTA DI STILE

**Il parser prende la PRIMA tabella dopo il titolo.** *Qualunque altra tabella messa in mezzo — anche un
riquadro di spiegazione — diventa «la tabella dei passi», e il parser la legge senza lamentarsi se ha il
numero di colonne giusto.*

🔴 **E questo modello ci è cascato: fino al 2026-10-16 qui c'era un riquadro a due colonne prima della
tabella vera.** *Non dava fastidio perché la §5 non la leggeva nessuno. Il giorno che il trascrittore ha
cominciato a leggerla, il modello si sarebbe fermato.*

> ⭐ **Trovato con una misura, non rileggendo: un programmino che confronta la prima tabella dopo ognuno
> dei sette titoli col numero di colonne atteso.**

### ⚠️ PERCHÉ QUESTA SEZIONE ESISTE, VISTO CHE IL 2026-09-21 ERA STATO DECISO IL CONTRARIO

**La decisione di allora era: «i passi stanno solo nel JSON e si modificano lì».** *Aveva due ragioni, e
**una è caduta misurandola**:*

| La ragione | Cosa è successo |
|---|---|
| *«due elenchi sugli stessi passi divergono al primo riordino»* | **regge ancora** — ed è il motivo per cui questa sezione aveva bisogno di un lettore, non di una promessa |
| *«il Pannello Admin ci scrive dentro»* | ⚠️ **caduta il 2026-09-22.** *Misurato: il pannello scrive in `localStorage` — **quel browser soltanto**. Non arriva mai al JSON e sparisce svuotando i dati del sito* |

⭐ **La decisione del 21/09 non era sbagliata: era vera finché la sua seconda ragione lo era.**

🔴 **E qui c'era scritto «NESSUN TEST LEGGE ANCORA QUESTA SEZIONE». Non è più vero:** *il trascrittore la
legge e pretende tre colonne.* ⚠️ **Era la frase che giustificava il rischio di una divergenza silenziosa,
e il rischio è chiuso.**

---

## 7 — GLI EPISODI

*Colonne: **id** → chiave di `episodes` · **nome** → `.nome` · **categoria** → `.categoria` ·
**sequenza** → `.sequence`.*

⚠️ **L'ORDINE DELLE RIGHE È L'ORDINE DEGLI EPISODI DEL CORSO.** *Finisce in `episodeSequences.<nome>`, e
un controllo verifica che i due combacino.* **Non esiste un numero d'episodio: esiste questa posizione.**

⭐ **E il nome dell'episodio resta nell'edizione anche se le due edizioni di oggi lo hanno identico:** *è
identico perché la storia è stata riusata, non perché sia un invariante.*

| Id | Nome | Categoria | Sequenza dei moduli |
|---|---|---|---|
| `esempio-id` | Nome che vede lo studente | `storia` | `nome-della-sequenza` |

---

## 8 — LE LINGUE DEL PARLATO

*Colonne: **chiave** → dentro `speech` (il prefisso `speech.` si toglie) · **valore**. Le due si
confrontano separate: parlare e ascoltare sono due cose.*

| Chiave | Valore |
|---|---|
| `speech.synthesisLang` | `xx-XX` |
| `speech.recognitionLang` | `xx-XX` |

---

## 9 — I NOMI A SCHERMO

*Colonne: **ruolo** → la chiave dentro `nomiASchermo` · **nome** → come si scrive a schermo. Esiste dal
2026-10-01.*

⚠️ **SONO DUE, NON TRE: `native` È USCITO IL 2026-10-13**, *nel file condiviso, perché dipende solo dalla
lingua dello studente.* 🔴 **Il trascrittore si ferma se una riga `native` è rimasta qui.**

⭐ **E `corso` ha una cella sua, non si ricava dagli altri:** *«{lingua} per {studente}» ha una grammatica
che il nome della lingua e il nome del popolo non danno — e la lingua dello studente resta scritta anche
lì dentro.* ⚠️ **Duplicazione voluta: lingua e demonimo non sono la stessa parola.**

⚠️ **SEZIONE IN FONDO, E NON SI RINUMERA NIENTE.** *Rinumerare romperebbe i controlli che cercano i titoli
carattere per carattere.*

| Ruolo | Nome |
|---|---|
| `target` | La lingua insegnata, come la legge lo studente |
| `corso` | Il nome del corso |
