**Versione: 20261020a**

# Tabelle di personalizzazione — italiano per spagnoli

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/italiano/es/italiano-es-tabelle-personalizzazione.json`.** I criteri con cui un nome o una città
sono stati scelti stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — e non si racconta qui

⚠️ **LA RIGIDITÀ DEL PARSER NON SI DESCRIVE IN QUESTO FILE.** *Vive in un posto solo:
`docs/metodo/FATTI-APP.md`, righe `APP_colonne-per-posizione` e `APP_ramo-sul-numero-colonne`, dove un
test la confronta col codice vero.*

> ⭐ **È la regola 48 applicata a un FATTO invece che a un numero.** *Un fatto ricopiato in tre file
> invecchia in tre posti, e ogni copia può smentire le altre senza che nessuno le legga insieme.*

| Chi legge questo file | |
|---|---|
| **`tests/tools/trascrivi.js`** | *lo trascrive nel suo JSON* |
| **`tests/test_intestazioni.js`** | *dal 2026-10-08: controlla l'intestazione di ogni tabella, colonna per colonna* |

⚠️ **I titoli e i numeri di sezione non sono liberi.** *Il come sta in `FATTI-APP`, riga
`APP_titolo-una-volta`, e qui NON si cita:* 🔴 *citare un titolo alla lettera lo fa comparire due volte, e
la seconda occorrenza è quella che il parser trova.*

### ② DUE COSE DA SAPERE

⚠️ **Il predefinito NON è una proprietà della tabella: è una proprietà dello SLOT**, e vive nella
sezione «GLI SLOT» del file episodio. *Due episodi possono pescare dalla stessa tabella con predefiniti
diversi.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una cella di tabella le toglie
gli spazi ai lati — deve — quindi uno spazio ai bordi sparirebbe senza un errore.* **In questo file non
ce n'è nessuno.**

### ③ 🔴 COSA NON SI COPIA DALLE ALTRE DUE EDIZIONI: I NOMI

**Le altre due edizioni si sono copiate fra loro riscrivendo UNA colonna.** *Questa no, e il motivo sta
scritto nel loro stesso file:*

> *«**LA FAMIGLIA È ITALIANA IN OGNI EDIZIONE.** È «la tua famiglia che parte», e lo studente è italiano
> — quindi i nomi restano Marco, Giulia, Emma, Tommaso.»* — `spagnolo-it-tabelle-personalizzazione`, §1③

⭐ **La ragione è giusta e la conclusione cambia: la famiglia è dello STUDENTE, e qui lo studente parla
spagnolo.** 🔴 **Quindi la famiglia è ispanica, e la frase «è italiana in ogni edizione» diventa falsa il
giorno che questa edizione entra nel repository.**

⚠️ **E PARTE DALL'AMERICA LATINA, non dalla Spagna:** *lo impone la regola del lungo raggio — vedi
`places.departures`.* ⭐ **La lingua dello studente resta `es-ES`: rotta e varietà sono due decisioni
diverse, e lo spagnolo lo fa già al rovescio.**

✅ **Corretta nei due file gemelli il 2026-10-20, col giro di allineamento:** *«la famiglia è ITALIANA in
ogni edizione» → «la famiglia è dello STUDENTE».* **Lì era vero perché lo studente era sempre italiano,
e la ragione scritta accanto — «è la tua famiglia che parte» — lo diceva già.**

| Colonna | Cosa succede qui |
|---|---|
| **id** | 🔴 **NON identici alle altre edizioni** — *gli id dei nomi contengono il nome (`papa-carlos`), e i nomi sono cambiati.* ⭐ **Solo `ages.anni` li tiene identici: `eta-4`…`eta-17`** |
| **es** *(studente)* | 🔴 **tutta nuova**: *i nomi che sceglie chi parla spagnolo* |
| **it** *(insegnata)* | 🔴 **tutta nuova**: *la forma italiana dello stesso nome* |
| **traducibile** | ✅ **stessa logica**: `no` sui nomi propri, `sì` su città ed età |

⚠️ **E una conseguenza di `traducibile: no` che va detta:** *su un nome proprio l'app usa SEMPRE la
colonna dello studente, quindi la colonna `it` dei nomi **non arriva mai a schermo**.* ⭐ **Si scrive
comunque, per due ragioni: la colonna deve esistere, e quelle coppie sono il materiale dell'episodio sui
nomi propri** — *vedi la sezione 5.*

---

## 2 — LE TABELLE CHE ESISTONO

| Nome | Cosa contiene |
|---|---|
| `people.papa` | i nomi del padre |
| `people.mamma` | i nomi della madre |
| `people.figlia` | i nomi della figlia |
| `people.figlio` | i nomi del figlio |
| `people.cognome` | i cognomi della famiglia |
| `places.departures` | le città di partenza |
| `ages.anni` | le età, da 4 a 17 |

⚠️ **`places.destinations` NON ESISTE, e non è una dimenticanza.** *La destinazione non è
personalizzabile: è dell'edizione, e si scrive dentro la battuta.* **Se ogni studente scegliesse una
città, le città si brucerebbero e gli episodi dovrebbero restare neutri in tutte.**

🔴 **E la destinazione di QUESTA edizione non è ancora decisa.** *Nelle altre due è un posto dove si parla
la lingua insegnata — Ciudad de México per lo spagnolo.* ⚠️ **Qui deve essere una città italiana, e la
scelta sta nel tabellone dell'edizione, non qui.**

⚠️ **E i nomi delle tabelle NON si traducono:** *resta `ages.anni`, non `ages.anos`.* **Il nome di una
tabella è un id e lo studente non lo legge: tradurlo per edizione vorrebbe dire che `trascrivi.js` deve
sapere come si chiama in ogni lingua.**

---

## 3 — LE RIGHE

**Una tabella ha QUATTRO colonne, oppure SEI**, *e quale lo dice la sua intestazione.* **Le quattro,
sempre nello stesso ordine:**

| Colonna | Va in | Cosa vuol dire |
|---|---|---|
| **id** | `value` | l'identificativo salvato nei progressi. ⚠️ **Cambiarlo è una migrazione**, non una correzione |
| **es** | ⭐ **`native`** | come si legge in spagnolo |
| **it** | ⭐ **`target`** | come si legge in italiano |
| **traducibile** | `traducibile` | `sì` → nel dialogo italiano si usa la colonna **it** · `no` → si usa la **es** anche in italiano |

⚠️ **`traducibile` è una proprietà della RIGA, non della tabella.** *L'assenza vale «sì», ma si scrive
sempre.*

## 🔴 L'ORDINE DELLE COLONNE È ROVESCIATO RISPETTO ALLE ALTRE DUE EDIZIONI

**Nelle altre due l'intestazione è `| id | it | en | traducibile |` e `| id | it | es | traducibile |`.
Qui è `| id | es | it | traducibile |`.**

⭐ **Non è una scelta: è la regola.** *Prima la colonna dello STUDENTE, che si chiama come la cartella
dell'edizione; poi quella della lingua INSEGNATA.* **In `italiano/es` lo studente è `es` e la lingua
insegnata è `it`, quindi le due si scambiano di posto.**

| | |
|---|---|
| **`id` · `paese es` · `paese it` · `traducibile`** | *parole fisse, al loro posto* |
| **`es`** | *si chiama come la cartella* |
| ⭐ **`it`** | *l'unica libera — ma diversa da `es`, e uguale in ogni punto in cui compare* |

🔴 **Ed è l'unico punto di tutta l'edizione dove la forma cambia, quindi l'unico che può sbagliarsi in
silenzio.** *Misurato il 2026-10-17: copiando il file spagnolo senza scambiare le colonne, il
trascrittore si ferma e dice cosa si aspetta —* **«la colonna 2 si chiama «it» e dovrebbe essere «es»…
attesa «id | es | {insegnata} | traducibile»»**. ⭐ **È la guardia dell'8 ottobre, alla sua prima
edizione nuova.**

⚠️ **E nel JSON le chiavi NON sono le lingue:** *escono `native` e `target`, che sono RUOLI.* 🔴 *Con
chiavi di lingua, `es` sarebbe la lingua insegnata in `spagnolo-it-…` e quella dello studente qui:
stessa chiave, ruolo opposto secondo il file.*

---

### `people.papa`

| id | es | it | traducibile |
|---|---|---|---|
| `papa-carlos` | Carlos | Carlos | no |
| `papa-juan` | Juan | Juan | no |
| `papa-jose` | José | José | no |
### `people.mamma`

| id | es | it | traducibile |
|---|---|---|---|
| `mamma-maria` | María | María | no |
| `mamma-carmen` | Carmen | Carmen | no |
| `mamma-ana` | Ana | Ana | no |
### `people.figlia`

| id | es | it | traducibile |
|---|---|---|---|
| `figlia-sofia` | Sofía | Sofía | no |
| `figlia-valentina` | Valentina | Valentina | no |
| `figlia-camila` | Camila | Camila | no |
### `people.figlio`

| id | es | it | traducibile |
|---|---|---|---|
| `figlio-mateo` | Mateo | Mateo | no |
| `figlio-santiago` | Santiago | Santiago | no |
| `figlio-diego` | Diego | Diego | no |
### `people.cognome`

| id | es | it | traducibile |
|---|---|---|---|
| `cognome-garcia` | García | García | no |
| `cognome-rodriguez` | Rodríguez | Rodríguez | no |
| `cognome-gonzalez` | González | González | no |

⚠️ **Le due colonne sono IDENTICHE su tutti e nove, e non è un errore:** *un cognome non ha una forma
italiana.* 🔴 **E `traducibile` è `no`, quindi l'app userebbe comunque la colonna dello studente: la
colonna `it` è qui perché la tabella ha quattro colonne, non perché serva.**
### `places.departures`

| id | es | it | paese es | paese it | traducibile |
|---|---|---|---|---|---|
| `orig-mexico` | Ciudad de México | Città del Messico | México | Messico | sì |
| `orig-bogota` | Bogotá | Bogotá | Colombia | Colombia | sì |
| `orig-buenos-aires` | Buenos Aires | Buenos Aires | Argentina | Argentina | sì |

🔴 **LA FAMIGLIA PARTE DALL'AMERICA LATINA, E NON È UNA SCELTA DI COLORE: È LA REGOLA DEL LUNGO RAGGIO.**

> *«Italia → Madrid sono due ore, e quattro delle dieci scene del volo — il pasto, il carrello, la
> coperta, la turbolenza — **su un volo di due ore non esistono**. La rotta lunga è quello che rende le
> scene riusabili, e la riusabilità delle scene è l'unica ragione per cui una seconda edizione costa
> poco.»* — `spagnolo-it-edizione` §3.2, deciso il 2026-09-27

⚠️ **E l'italiano si parla solo in Italia: una destinazione italiana a lungo raggio dalla Spagna non
esiste.** ⭐ **Partendo dall'America Latina il volo torna lungo, e le dieci scene esistono tutte.** *È la
rotta spagnola al rovescio: Italia→Messico là, Messico→Italia qui.*

⭐ **E la VARIETÀ della lingua non segue la rotta:** *lo spagnolo dello studente resta `es-ES`.* **Lo dice
già una regola scritta per l'edizione spagnola** — *«`synthesisLang` non deve seguire la tappa durante
l'A1»* — **e là la rotta è messicana mentre la lingua insegnata è `es-ES`.** 🔴 *La rotta è storia, la
varietà è lingua: due decisioni, non una.*

⚠️ **QUESTA È L'UNICA TABELLA A SEI COLONNE, e le altre restano a quattro.** *`trascrivi.js` le accetta
tutte due e rifiuta ogni altro numero nominando la tabella.*

⭐ **E qui le colonne `paese` LAVORANO davvero: tre città, tre paesi diversi.** ⚠️ **Nelle altre due,
dal 30/10, sono tre righe di cui due dicono Italia** — **e il meccanismo del 24/09, città e paese sulla
stessa riga, regge grazie a `orig-lugano`: la riga che porta un paese diverso.**

🔴 **E quello è il motivo per cui Lugano è una delle tre:** *senza di lei la colonna `paese` non avrebbe
un caso vivo in quelle due edizioni, e un difetto su di lei tornerebbe invisibile — esattamente come il
2026-10-20.* ⚠️ **La constatazione che a Lugano si parla italiano è nostra e di oggi, non una regola.**

🔴 **Il 2026-10-20 abbiamo valutato di toglierle e abbiamo deciso di NO; il 30/10 le righe sono scese a
TRE, e per una ragione diversa: il costo delle registrazioni.** *La lista resta **aperta per progetto** —
lo studente può proporre quello che non trova — quindi non è un insieme da curare, è un insieme che
cresce. Cambia da quante parte, non la sua natura.* ⭐ **E una riga nuova costa UN file audio: `partenza`
compare in un testo solo.** ⭐ **E così la ragione
del 24/09 — «uno studente di Lugano non deve dichiarare un paese che non è il suo» — resta viva.**

⚠️ **E il paese arriva alla frase con un segnaposto suo** — `{{partenza.paese:target}}` — *non composto
dentro la colonna: la città da sola serve, perché `Bogotá` è una voce del grado A.*

⭐ **SEI città su otto sono identiche nelle due lingue** — *Bogotá · Lima · Buenos Aires · Montevideo ·
Caracas · Quito* — **e DUE cambiano**: *Ciudad de México → Città del Messico, Santiago → Santiago del
Cile.* ⚠️ **Sui paesi cambia solo il Perù** *(`Perú` → `Perù`: l'accento gira).*

⚠️ **Quindi questa tabella porta meno materiale didattico di quella spagnola**, *dove quattro città su
otto cambiavano forma.* 🔴 **E non è aggiustabile scegliendo altre città: i toponimi americani sono gli
stessi in italiano, perché in italiano sono arrivati dallo spagnolo.** *Vale saperlo prima di cercare un
difetto che non c'è.*

### `ages.anni`

⚠️ **DUE COLONNE, E LA CIFRA RESTA NELLA COLONNA DELLO STUDENTE.** *Le due servono due mestieri diversi:*

> - **`es` = `16`** è quello che lo studente **SCEGLIE** in Personalizza: *scorrere 12·13·14 è più veloce
>   che leggere dodici·tredici·quattordici.*
> - **`it` = `sedici`** è quello che si **SENTE e si PRONUNCIA** nella battuta, e che Voice Practice deve
>   riconoscere.
>
> **Non è un'incoerenza: è la stessa riga letta da due mestieri.**

⭐ **Gli id sono gli UNICI identici alle altre due edizioni** — *`eta-4`…`eta-17`* — **perché un'età non
porta un nome: porta un numero, e il numero non cambia con la lingua.**

| id | es | it | traducibile |
|---|---|---|---|
| `eta-4` | 4 | quattro | sì |
| `eta-5` | 5 | cinque | sì |
| `eta-6` | 6 | sei | sì |
| `eta-7` | 7 | sette | sì |
| `eta-8` | 8 | otto | sì |
| `eta-9` | 9 | nove | sì |
| `eta-10` | 10 | dieci | sì |
| `eta-11` | 11 | undici | sì |
| `eta-12` | 12 | dodici | sì |
| `eta-13` | 13 | tredici | sì |
| `eta-14` | 14 | quattordici | sì |
| `eta-15` | 15 | quindici | sì |
| `eta-16` | 16 | sedici | sì |
| `eta-17` | 17 | diciassette | sì |

⚠️ **`traducibile` vale `sì` su ogni riga, ed è scritto anche se l'assenza lo varrebbe.** *Con `no` la
battuta italiana direbbe la cifra invece della parola.*

---

## 4 — DECISO, NON ANCORA TRASCRIVIBILE

⚠️ **QUESTA SEZIONE NON FINISCE NEL JSON.** *Quello che c'è qui è contenuto scelto, fermo solo perché il
codice che lo legge non esiste ancora.*

**Oggi è vuota.** ⭐ *È il vantaggio della terza edizione: il paese delle partenze e le età in parole sono
codice funzionante da settembre, e questa edizione nasce dopo tutti e due.*

---

## 5 — IL MATERIALE PER L'EPISODIO SUI NOMI PROPRI

*Non è dato: è una misura su questo file, e serve quando si scriverà quell'episodio.*

| Gruppo | Quanti | Esempi |
|---|---|---|
| **Nomi con una forma italiana diversa** | ⭐ **29 su 37** | *Juan → Giovanni · José → Giuseppe · Hugo → Ugo · Clara → Chiara · **Santiago → Giacomo*** |
| *di cui cambiano SOLO un accento* | **4** | *María · Lucía (×2) · Sofía* |
| **Nomi identici nelle due lingue** | **8** | *Antonio · Carmen · Laura · Marta · Valentina · Martina · Daniela · Diego* |
| **Cognomi, nessuna forma italiana** | **9** | *García · Rodríguez · Pérez · Silva* |

✅ *Il conto torna: **29 + 8 = 37** nomi, più 9 cognomi.*

⚠️ **E il verso dell'episodio è rovesciato rispetto a `nombres-propios`:** *lì uno studente italiano
imparava come il suo nome suona in spagnolo; qui uno studente spagnolo impara come il suo suona in
italiano.* ⭐ **Stesso meccanismo didattico, materiale opposto.**
