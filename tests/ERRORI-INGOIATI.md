# Errori ingoiati nei test

Censimento dei `.catch(() => {})` — i punti in cui un test **sopprime un
errore invece di farlo fallire**. Sono 47 in 19 file.

**A cosa serve questo file.** Non è una lista di cose da correggere. Serve
**quando un test diventa rosso in un punto che non lo spiega**: prima di
cercare una regressione nel codice dell'app, si guarda se qualcosa, poco
sopra, sta ingoiando l'errore vero.

**Perché è la famiglia più costosa delle due.** `ATTESE-FISSE.md` censisce le
attese a tempo, che cadono **nel punto giusto**: brutte, ma diagnosticabili.
Un `.catch` vuoto fa cadere il test **altrove** — l'errore viene soppresso
dove nasce e si manifesta dove non si può più capire perché.

*Il caso che l'ha insegnata — `test_batch19.js`, 2026-09-07.* Il click su
`#sr-ready-btn` falliva, il `.catch` vuoto lo ingoiava, il countdown non
partiva mai, e il test moriva tre righe dopo su un `waitForFunction` che
sembrava il colpevole. La lezione era già scritta in `ATTESE-FISSE.md` — e
nessuno aveva mai contato quante altre volte la stessa forma comparisse nella
suite. Erano 47.

**Non vanno cancellati: vanno distinti.** Un `.catch` su un elemento che
legittimamente può non esserci è corretto e deve restare. Un `.catch` su
un'azione che *deve* riuscire è un difetto che aspetta. Le tre famiglie qui
sotto sono esattamente quella distinzione.

---

## ⓪ Le asserzioni che nominano una cosa per negarla — e che nessuno strumento vede

**È la famiglia più insidiosa delle tre, e non ha un conteggio: ha un esempio.**

`tests/test_outcome_step_ids.js:375` verifica che un nome tolto **non** compaia:

```js
log('[D] Nessun titolo del pannello nomina un modulo che non esiste più',
  testo.titoli.indexOf('Speak Easy') === -1);
```

**Durante la rinomina di «Speak Easy» in «Story Cards», una sostituzione
meccanica l'avrebbe riscritta in `indexOf('Story Cards') === -1`.** Il test
sarebbe rimasto **verde**, il conteggio delle asserzioni **invariato**, e da quel
momento avrebbe provato l'esatto contrario: che il nome NUOVO non compaia — cioè
avrebbe cominciato a fallire il giorno in cui l'app funzionava.

**Perché nessuno dei nostri strumenti la prende:**

| Strumento | Perché non la vede |
|---|---|
| la suite | resta verde: l'asserzione gira e passa |
| `conta-asserzioni.js` | il numero non cambia: nessuna asserzione è sparita |
| la verifica per sottrazione | il nome vecchio **è** sparito, come doveva |

**La regola operativa, ed è l'unica difesa che abbiamo:** prima di una rinomina,
si cercano le asserzioni che contengono il nome vecchio **dentro un confronto**
(`indexOf`, `===`, `includes`) invece che dentro un'etichetta di log. Quelle si
leggono una per una: un nome citato per essere **negato** non si rinomina mai.

*(Nella rinomina 5 sono state trovate così, e lasciate. Nelle rinomine 3 e 4 il
controllo è stato fatto e non ce n'erano: 46 occorrenze dentro stringhe, tutte
etichette di `log()`.)*

---

## ⓪-bis L'asserzione che passa quando dovrebbe fallire — trovata in un test APPENA SCRITTO

**Questa non è un difetto vecchio che si scopre: è una cosa che nasce così se
nessuno la mette alla prova.** Ed è il motivo per cui la regola 32 dice di
vedere fallire ogni test nuovo — qui c'è il *perché*, con un caso vero.

*Il caso, `tests/test_sequenze.js`, 2026-09-09 (passo 8).* L'asserzione nuova
doveva proteggere l'invariante appena introdotta: `modulesById` non è più
scritto dentro ogni episodio, quindi **i due episodi devono avere gli stessi
passi**. La prima versione confrontava gli **id** dei passi delle due mappe.

Iniettando il guasto — tolto `whyWeSayIt` al solo episodio 2 — il test ha
detto:

```
=== SEQUENZE SUMMARY: 13/13 passed ===
```

**Verde, con un episodio a cui mancava un modulo.** Perché gli id vengono
dalla **sequenza**, non da `modulesById`: `resolveEpisodeOrder` fa
`Object.assign` su un descrittore assente e la riga **resta in mappa**, stesso
id, stesso posto. L'asserzione nominava l'invariante e non la toccava.

**E c'è un secondo difetto nella stessa asserzione, più fine.** La riga di
contorno diceva *«Nessun passo resta senza categoria (descrittore mancante)»* —
ma in quel guasto la categoria **non è vuota**: senza `type` resta il nome del
grado, «Dialogo». Non aveva preso il guasto: l'aveva preso il confronto fra i
due episodi. **Dichiarava più di quello che fa.**

**Cosa se ne impara, e vale per ogni test nuovo:**

- **Un'asserzione che passa quando dovrebbe fallire non è distinguibile da una
  che funziona, se nessuno prova a romperla.** Il verde non è un'informazione
  finché non si è visto il rosso.
- **Il guasto va iniettato dove nasce il difetto vero**, non dove è comodo.
  Qui: togliere un descrittore, non rinominare un id.
- **Quando due asserzioni sembrano coprire la stessa cosa, misurare quale delle
  due prende il guasto.** Se ne prende una sola, l'altra va riscritta o il suo
  limite va dichiarato: *«le due si coprono a vicenda solo in parte, ed è
  meglio saperlo che crederle equivalenti»*.

⚠️ **Nessuno strumento vede questa famiglia.** La suite resta verde, il
contatore delle asserzioni non cala — l'asserzione gira e passa — e la verifica
per sottrazione non c'entra. **L'unica cosa che la trova è il passaggio del
guasto**, che è una cosa che si fa a mano e che quindi si salta.

## ⓪-ter L'asserzione VACUA, e — questo è il punto — **dove nasce**

**Un difetto con un indirizzo si cerca; uno senza si aspetta.** Questa famiglia
l'indirizzo ce l'ha, ed è stato misurato: **due casi su due sono comparsi dentro
il *sanity check* di un CICLO.**

> ⚠️ **LE ASSERZIONI VACUE NASCONO NEI SANITY CHECK DEI CICLI. È LÌ CHE SI
> GUARDA.**

**I due casi, 2026-09-11.**

| dove | com'era | perché era nata così |
|---|---|---|
| `test_batch16.js` (famiglia ② delle attese) | `log('…', stillOnMain === true \|\| true)` | il `\|\| true` neutralizzava un confronto che non tornava |
| `test_batch7.js` (triage di «altro») | `log('[Job3/4] Flash Card reachable/answerable (sanity …)', true)` | **il ciclo rispondeva «Sì, la so» a ogni carta**, quindi la valvola di sicurezza — che si apre dopo ripetuti sbagli — non poteva aprirsi mai, e l'asserzione che l'autore voleva scrivere sarebbe stata rossa |

**Perché proprio lì, e non altrove.** Un ciclo che guida un modulo finisce in
uno stato che chi scrive non controlla del tutto: il mazzo può esaurirsi, la
valvola può non aprirsi, il giro può chiudersi prima. L'asserzione onesta
dovrebbe dire *«il ciclo ha fatto quello che doveva»* — ma è difficile da
scrivere, e **`true` è lì a un carattere di distanza.** Non è distrazione: è una
**resa**, e si riconosce dal fatto che la riga porta la parola *«sanity»*.

**Come si corregge, ed è lo stesso giro dell'altra volta: si scrive
l'asserzione giusta PRIMA di togliere il `true`.** Nel caso di `test_batch7` è
diventata due righe — *«almeno una carta è stata risposta davvero»* e *«il giro
arriva a uno stato noto invece di restare fermo su una carta»* — con il conto
delle carte stampato accanto. **Controprova su un guasto vero dell'app** (mazzo
di Flash Card vuoto): tutte e due rosse, e con il `true` al suo posto il modulo
completamente rotto sarebbe passato **11 su 11**.

⚠️ **E una forma vicina, incontrata lo stesso giorno:** un'asserzione che è
**vera ovunque**, scritta in un punto che fa credere il contrario.
`test_batch16` verificava che `#fc-level-label` «non esistesse più» dopo aver
aperto Flash Card — ma quell'id non esiste in nessun punto del documento, quindi
la riga era vera anche sulla schermata iniziale. Non era inutile; era **nel
posto sbagliato**, e si portava dietro un'attesa che non guardava niente.
*Spostata prima dell'apertura del modulo, col nome che dice cosa verifica
davvero.*

## ⓪-quater LA MOTIVAZIONE FALSA ACCANTO A CODICE GIUSTO

> **UNA MOTIVAZIONE FALSA ACCANTO A CODICE GIUSTO FA SMETTERE DI CONTROLLARE
> CHI LA LEGGE.**

È la peggiore della famiglia dei commenti, e per una ragione precisa: **il
codice intorno è sano**. Niente insospettisce. Un commento che descrive male
un pezzo rotto si scopre quando il pezzo si rompe; uno che descrive una
garanzia che non c'è, accanto a codice che oggi funziona per altri motivi,
non si scopre mai — finché quel «per altri motivi» cambia.

**Il caso, 2026-09-15, giro A del passo 18.** Il commento di `uiText()` diceva:

> *«Funziona perché la cache è già calda: `openModuleFromMap` fa
> `Promise.all([loadEpisodeData, loadModuleInstructions])` prima di aprire
> qualunque modulo.»*

**Non lo faceva.** Quel `Promise.all` aspettava `ensureEpisodeSlotFields` e
`loadEpisodeData`, non i testi. Misurato: il modulo si apriva con gli
`aria-label` del Blocco Ascolto e la didascalia del microfono **vuoti**.

⚠️ **E SI TROVA IN UN MODO SOLO: GUIDANDO L'APP.** Non rileggendo — la frase
descriveva *esattamente* il codice che serviva, solo che quel codice non
c'era, quindi rileggerla conferma sé stessa. E non con un setaccio: al passo
17 i due metodi di ricerca dei commenti falsi (il controllo sui **nomi** e
l'ordinamento per **marcio**) sono caduti tutti e due sul loro caso di prova,
e su questo non avrebbero nemmeno potuto funzionare in teoria — **ogni nome
citato in quella frase esiste**: `openModuleFromMap` esiste, `Promise.all`
esiste, `loadEpisodeData` e `loadModuleInstructions` esistono. Non c'era un
nome morto da trovare: c'era una **composizione** che non esisteva.

*È la stessa forma del ⑤ del passo 16 («il nome esteso del grado sta nel file
episodio»): ogni nome esiste, la falsità è nella relazione fra i nomi. Quella
classe non ha un setaccio, e questa riga serve a non cercarne più uno.*

**Come si corregge:** non basta togliere la frase falsa. Al suo posto va la
garanzia **vera** — qui: «la cache è calda perché c'è `loadModuleInstructions()`
in quel `Promise.all`, e se quella riga sparisce `uiText()` torna stringhe
vuote» — più **come è stata trovata**, perché chi legge sappia che quella
frase è stata verificata invece che scritta a intuito.

## ⓪-quinquies IL COMMENTO CHE **NOI** RENDIAMO FALSO — senza toccarlo

> **UN COMMENTO GIUSTO SMETTE DI ESSERE VERO QUANDO CAMBIA IL MONDO
> INTORNO, NON IL CODICE CHE DESCRIVE.**

Le quattro famiglie qui sopra hanno tutte la stessa origine: qualcuno ha
toccato il codice e non il commento. **Questa no, ed è per questo che è
separata.** Qui il commento resta esatto sulla sua riga, la riga non cambia,
e la frase diventa falsa lo stesso — perché descriveva una **proprietà
dell'ambiente** che qualcun altro ha cambiato altrove.

⚠️ **Nessuno dei metodi delle altre quattro la trova.** Non c'è un nome
morto (⓪), non c'è un'asserzione vacua (⓪-ter), e rileggere il commento lo
conferma (⓪-quater) — ma qui c'è di peggio: **rileggere il commento *insieme
al suo codice* lo conferma ancora**, perché insieme sono ancora coerenti. È
il terzo file, quello che nessuno dei due nomina, ad averli smentiti.

**Il caso, 2026-09-15, passo 19.** In `index.html`, accanto alla seconda
strada per aprire il Pannello Admin:

> *«Deferred to the next tick: renderConfigPanel reads EPISODES, which this
> script assigns later — by the time a 0ms timeout fires, the whole script
> has finished running and EPISODES exists.»*

**Era vero, ed è ancora vero per `EPISODES`.** È diventato falso per il
magazzino della personalizzazione nello stesso momento in cui `people` e
`places` sono usciti da `APP_CONFIG` — cioè per una modifica in **un altro
punto del file**, che quel commento non nomina e che non nomina quel
commento.

```
setTimeout(…, 0) aspetta «più tardi nello STESSO SCRIPT».
Non aspetta «più tardi SULLA RETE».
```

**La forma generale, che vale oltre questo caso:** ogni difesa che si
appoggia a *«tanto è già tutto in memoria»* è scritta contro un'ipotesi che
uno spacchettamento **esiste per rimuovere**. `setTimeout(…, 0)`, un
`Object.keys(APP_CONFIG)`, un valore letto a tempo di parsing, un test che
fa `page.goto` e legge subito: sono tutti corretti oggi e tutti candidati a
smettere di esserlo senza che nessuno li tocchi.

⚠️ **E la fase 4 è fatta di ~20 passi di questo tipo.** Quindi non è un caso
isolato da registrare: è **la famiglia di difetti che quella fase produce di
mestiere**, e va cercata a ogni estrazione.

**Come si trova, e non è rileggendo:** si parte dal dato che si sta
spostando e ci si chiede **chi lo aveva per costruzione**, non chi lo
nomina. Al passo 19 la ricerca testuale su `CONFIG.people` dava **zero
occorrenze** — e c'erano due lettori, il Pannello Admin e
`applyConfigOverrides`, che lo raggiungevano senza nominarlo. *Il conteggio
era esatto: era il conteggio di un'altra domanda.*

**Come si corregge:** non si cancella il commento vecchio, perché sulla sua
riga è ancora giusto. Gli si scrive accanto **fin dove arriva** — «questo
vale per `EPISODES`, e non valeva più per il magazzino» — così chi lo legge
sa che il limite è stato misurato, non dimenticato.

## ⓪-sexies LA GREP CHE TROVA IL PUNTO GIUSTO E LA LETTURA CHE SI FERMA ALLA RIGA

> **GUARDARE LA RIGA TROVATA INVECE DELLA FUNZIONE CHE LA CONTIENE È IL MODO
> IN CUI SI PERDE UN LETTORE AVENDOLO DAVANTI.**

È la ⓪-quinquies vista **da dentro il metodo**: là il difetto sta nel mondo
che cambia intorno a un commento, qui nel gesto con cui lo si cerca. E si
somigliano al punto da confondersi, quindi stanno vicine.

⚠️ **Non è il difetto della ricerca che non trova niente.** Quello si vede: si
cerca, esce zero, si cerca meglio. **Questo è il difetto della ricerca
RIUSCITA** — il punto giusto compare nell'elenco, lo si legge, e si conclude
qualcosa che la riga dice e la funzione intorno smentisce. *Da lì in poi quel
file risulta «guardato», che è peggio di «non cercato»: non lo si riapre.*

**Il caso, 2026-09-15, passo 19.** Cercando chi leggeva il magazzino, la
ricerca ha restituito `tests/module-order.js:115`:

```js
const isPerson = slot.table.indexOf('people.') === 0;
```

Letta da sola dice *«legge il campo `table` di uno slot»* — cioè un dato che
sta nel file dell'episodio, **non** nel magazzino. Classificata: non è un
lettore. **Tre righe più sotto**, la stessa funzione:

```js
const rows = readTable(html, section, name) || [];
```

— e `readTable` parsava le tabelle **dal testo di `index.html`**. Era un
lettore, e di quelli peggiori: aveva il dato **per costruzione** perché stava
nello stesso file.

*Costo: due file rossi in suite (`test_batch15`, `test_interruttore_episodio`
con cinque asserzioni in meno), trovati dalla suite e non dal triage che aveva
dichiarato l'elenco completo.*

**La forma operativa, e vale per ogni passo dello spacchettamento:** quando si
chiede *«chi legge questo?»*, ogni riga che la ricerca restituisce si legge
**dentro la sua funzione, dall'inizio alla fine** — mai da sola. Una riga
risponde alla domanda *«questa riga tocca il dato?»*; la domanda vera è
*«questa **funzione** tocca il dato?»*, e sono due domande diverse con la
stessa risposta apparente. *È di nuovo la forma di tutto il resto: il numero
era giusto, era il numero di un'altra domanda.*

## ⓪-septies UN TEST CHE **MUORE** NON È UN TEST CHE **FALLISCE**

> **IL PRIMO DICE CHE QUALCOSA È ESPLOSO. IL SECONDO DICE COSA.**

Non è una famiglia di errori ingoiati: è una famiglia di errori **urlati male**,
e sta qui perché il costo è lo stesso — si perde l'informazione nel momento in
cui serve.

Un `waitForSelector` che scade, un `TypeError` su una proprietà che non c'è, un
`page.evaluate` che esplode: sono rossi, quindi la suite si ferma e nessuno si
fida di un verde falso. **Ma il messaggio parla del test, non dell'app**, e chi
lo legge parte dall'ipotesi sbagliata — «il test è rotto» invece di «ecco cosa
fa l'app adesso».

⚠️ **E SI PRESENTA PROPRIO DOVE IL GUASTO È PIÙ GRAVE.** Un'asserzione che
verifica «si riesce ancora a navigare» *deve* leggere qualcosa che, quando il
guasto c'è, **non arriva**. Scritta nel modo naturale — aspetta la mappa, poi
asserisci — muore invece di fallire ogni volta che il guasto è reale.

**I due casi, 2026-09-16, passo 21-bis.**

- `[C]` aspettava `#view-map.is-active` dopo aver rotto una pulizia. Senza
  `try/catch` nel codice, il test moriva con `TimeoutError: waiting for
  #view-map.is-active` — vero, inutile. Catturando l'attesa dice: *«la mappa non
  si è aperta: l'eccezione è risalita a `showView` e lo studente è chiuso nel
  modulo»*.
- E la stessa riga ha rivelato una cosa che nessuno aveva previsto: il test non
  moriva all'**uscita** dal modulo, moriva all'**ingresso** — perché `showView`
  chiama la pulizia a ogni cambio di vista. *Il guasto era più grave di come lo
  si stava descrivendo, e il rosso muto lo nascondeva.*

**La forma operativa:** quando un'asserzione verifica che qualcosa **continui a
funzionare**, l'attesa su cui poggia va **catturata** e trasformata in un
`false` con un messaggio, mai lasciata nuda. *Non è prudenza generica — si fa
esattamente lì dove il guasto cercato impedisce all'attesa di risolversi, e in
nessun altro punto, perché altrove nasconderebbe un errore vero.*

## ⓪-octies UNA DIAGNOSI SCRITTA NON SI LEGGE DA SOLA

> **LA PRIMA MOSSA DAVANTI A UN ROSSO È LEGGERE COSA IL TEST HA GIÀ DETTO —
> prima di riprodurre, prima di sospettare, prima di tutto.**

È l'altra faccia della ⓪-quater e della spiegazione che nessuno strumento sa
leggere: **là la prosa c'era e il contatore non la vedeva; qui la diagnosi
c'era e non l'ha vista nessuno.** In tutte e due il lavoro era già stato
fatto, e il costo l'ha pagato chi è arrivato dopo — che eravamo noi.

**Il caso, e pesa perché è a due tempi.**

**2026-09-11.** `[SR Task1]` di `test_batch19` va rosso in CI e verde in
locale. Si scopre che `toccaFinoA` torna `null` per **cinque ragioni diverse**
e l'asserzione ne riporta sempre una sola. Invece di inventare una terza
ipotesi — e inventarla sarebbe stato il difetto — si scrive `arrenditi()`, che
stampa il motivo e la ripartizione delle mosse. Accanto ci va la condizione:
*«alla prossima rossa si legge la ripartizione, e quella dice la diramazione».*

**2026-09-16, cinque giorni dopo, la prossima rossa.** Stesso blocco. E sono
partiti **sei giri di riproduzione** — tre a file solo, tre sotto carico
parallelo — prima che qualcuno aprisse il `.result.txt` e leggesse la riga che
il test aveva scritto da solo:

```
esaurite le mosse | mosse 41/41 | totale alla partenza: 9
spese in: {popup:1, ripasso:2, riquadro:19, ultimaDomanda:2, tocchi:17}
```

Quella riga conteneva la diagnosi **intera**: ventiquattro mosse su quarantuno
spese in diramazioni che non toccano niente, diciassette tocchi rimasti,
(3/4)¹⁷ ≈ 1 su 133. *Sei giri per arrivare dove il primo secondo era già
arrivato.*

⚠️ **E il difetto non è la pigrizia: è l'ORDINE ISTINTIVO.** Davanti a un
rosso la prima domanda che viene è *«è colpa di quello che ho appena
toccato?»*, e la prima mossa che segue è **riprodurre**. Riprodurre sembra
rigore — è misurare invece di supporre — ma è misurare **di nuovo** una cosa
già misurata, e intanto la misura vera sta ferma in un file.

**La forma operativa, e va fatta prima di qualunque ipotesi:**

1. aprire il `.result.txt` del file rosso e leggerlo **tutto**, non solo le
   righe `FAIL`: la diagnosi non è un fallimento, quindi non compare in un
   `grep FAIL` — ed è precisamente così che è stata saltata;
2. solo dopo, se non dice abbastanza, riprodurre.

*Una condizione scritta accanto a uno strumento — «alla prossima rossa si
legge X» — non si applica da sola. Questa riga è il promemoria che quella
condizione esisteva, ed è la seconda volta che il progetto paga per averla
scritta senza un momento in cui viene letta.*

## ⓪-nonies UNA FALSIFICAZIONE SBAGLIATA È ROSSA ESATTAMENTE COME UNA GIUSTA

> **IL ROSSO DI UNA FALSIFICAZIONE NON PROVA NIENTE DA SOLO. VA LETTO **QUALE**
> ASSERZIONE CADE.**

Questa famiglia pesa più delle altre perché tocca **lo strumento su cui poggia
tutto il resto**. La falsificazione è la mossa che ha salvato questo progetto
sei volte: è quella che distingue un test che protegge da un test che
accompagna. E adesso sappiamo che **anche lei può mentire** — e mente nella
stessa forma di tutto il resto di questo file: *non somiglia a un errore,
somiglia a un risultato* (regola 37).

**Il meccanismo, ed è banale, che è il punto.** Si rompe di proposito la cosa
che il test dovrebbe proteggere, si rilancia, si vede rosso, si conclude «è
protetta». Ma il rosso dice solo che il test **sa morire su QUALCHE guasto**.
Non dice che sappia morire su **QUEL** guasto. Se la rottura ha prodotto un
guasto diverso da quello che si voleva provare, il verde/rosso è identico e la
conclusione è falsa.

**Il caso, misurato — e la ragione per cui è una famiglia e non un aneddoto:
è successo DUE VOLTE, identico.**

Falsificare la guardia `BI.unaVoltaSola` significa toglierla lasciando che il
blocco **giri lo stesso**, cioè provocare la duplicazione. La sostituzione
fatta è stata questa:

```js
    BI.unaVoltaSola('speedMatch', function () {   // prima
    (function () {                                 // dopo
```

lasciando la chiusura `});`. Ma `(function () { … });` è **una funzione mai
chiamata**: manca il `()`. Il risultato non è «la guardia non c'è più», è **«il
blocco non esiste più»** — il guasto OPPOSTO.

| | Cosa si voleva provare | Cosa si è provato |
|---|---|---|
| **atteso** | `[C]`: `1 → 4`, i listener si duplicano a ogni riapertura | — |
| **ottenuto** | — | `[A]`: «atteso 1, **osservato 0**» — nessun listener attaccato |

E il test era **rosso** in tutti e due i casi.

- **① Speed Match, 2026-09-16.** `replace(v, '    (function () {', 1)`. Esito
  registrato dal test: `speedMatch:sr-ready-btn/click atteso 1, osservato 0`,
  e così per tutti e nove. *Non è stata riconosciuta:* è stata rifatta e basta,
  e il `1 → 4` che sta in `docs/decisioni.md` viene dalla seconda corsa, quella
  giusta. La conclusione del ① è sana — **ma per fortuna, non per metodo.**
- **⑤ Match, 2026-09-16.** La stessa identica sostituzione, con lo stesso
  identico esito. Stavolta è stata **riconosciuta leggendo quale asserzione
  cadeva**, e da lì questa riga.

*Le due volte sono verificabili nel log della sessione: `grep "osservato 0"`
le trova entrambe, e il `1 → 4` corretto compare solo dopo.*

⚠️ **E la ragione per cui il difetto è invisibile dall'esterno: la
falsificazione non lascia traccia nel repository.** Un test che protegge male
si vede nel diff; una falsificazione fatta male non si vede da nessuna parte,
perché il file viene ripristinato subito dopo. **Resta solo la frase che ci si
scrive sopra** — «falsificata, è protetta» — e quella frase ha lo stesso
aspetto vera e falsa.

**La forma operativa, e la quarta riga è arrivata dopo, dal caso opposto:**

1. **prima** di falsificare, scrivere quale asserzione ci si aspetta che cada,
   e con quale numero (`[C]`, `1 → 4`);
2. **verificare che la rottura SIA STATA APPLICATA** — un `grep` sul testo
   nuovo — prima di guardare l'esito. ⚠️ **E la grep deve colpire il CODICE,
   non una stringa che vive anche nei commenti:** si ancora la riga intera col
   suo rientro (`^    BI.unaVoltaSola('voice'`), non il solo nome. *Il
   2026-09-17, all'⑧, questo controllo ha stampato «2 invece di 1» due volte,
   perché contava i due commenti che nominano la guardia — commenti scritti da
   me nello stesso giro. **Il conto era giusto; la domanda no.** Una difesa
   nata ieri che sbaglia oggi è la cosa che fa smettere di usarla, quindi la
   forma corretta sta qui e non nella memoria di chi l'ha scritta.*;
3. dopo la corsa, leggere **quale** è caduta davvero — non quante, non il
   `SUMMARY`, non l'exit code;
4. se è caduta un'altra, **la falsificazione è fallita, non il codice**: si
   rifà la rottura, non si tiene il rosso.

⚠️ **La ② è nata il 2026-09-17, al ⑦, e dallo stadio PRECEDENTE del difetto.**
Due volte di seguito l'`assert` dello script di falsificazione ha fermato la
scrittura — ancora sbagliata, indentazione cambiata dallo spostamento — e il
test ha poi stampato **28/28 su un file non modificato**. Letto come esito
sarebbe stato *«la falsificazione non morde»*: **una conclusione falsa da un
verde vero.**

*Là una falsificazione sbagliata dava un rosso che sembrava buono; qui una
falsificazione **non applicata** dà un verde che sembra un risultato. È la
stessa famiglia vista dal lato opposto, ed è peggiore in un punto: il rosso
almeno fa guardare. Il verde no.* L'unica cosa che l'ha presa è stato leggere
il **traceback** invece del `SUMMARY` — cioè, di nuovo, leggere tutto l'output
e non la riga che si stava cercando (⓪-octies).

⚠️ **E IL TERZO GRADINO, trovato il 2026-09-17 e peggiore dei due — perché
qui la falsificazione è GIUSTA.**

I due casi sopra sono una rottura **sbagliata** (rosso ingannevole) e una
rottura **non applicata** (verde ingannevole). Il terzo è una rottura
**giusta**, che produce i rossi **giusti**, e da cui si sarebbe tratta
comunque una conclusione falsa — perché l'**attesa** era sbagliata.

*Il caso.* Scrivendo `test_avvio_invariato.js` avevo messo in un commento che
`[A]` e `[B]` confrontano insiemi, quindi *«uno scambio fra due moduli le
lascia verdi»*, e che `[C]` serviva per quello. Falsificando — scambiando due
registrazioni — sono cadute **tutte e tre**: le righe portano il numero
d'ordine, quindi uno scambio cambia il testo di due righe e `[A]`/`[B]` lo
vedono come una sparita e una comparsa.

**Avevo scritto l'attesa prima («solo `[C]`»), e per questo ho visto lo
scarto.** Senza, avrei letto tre rossi su una rottura vera e detto *«il test
funziona»* — che è pure vero, e che non era la cosa da verificare. *La
falsificazione ha smentito la previsione invece di confermarla, ed è
esattamente il suo mestiere; ma lo fa solo se la previsione esiste.*

| Gradino | La rottura | L'esito | Perché inganna |
|---|---|---|---|
| ① | **sbagliata** | rosso | il rosso sembra la prova |
| ② | **non applicata** | verde | il verde sembra un risultato |
| ③ | **giusta** | rosso | la conclusione non è quella che l'esito sostiene |

**Tutti e tre si difendono con la stessa riga, ed è la ① della forma
operativa: scrivere COSA deve cadere, prima.** Non è un ornamento del metodo:
è l'unica cosa che distingue un esito letto da un esito interpretato.

⚠️ **E il tranello specifico di questo caso, perché si ripresenterà:
trasformare una chiamata di funzione in un blocco che «gira comunque» NON è
una sostituzione di testo.** `f(function(){…});` → `(function(){…});` toglie
la chiamata insieme alla guardia. La forma che gira è `(function(){…})();` —
due caratteri, e sono esattamente i due che distinguono le due prove.

*Perché sta in questo file e non solo fra le regole: tutto ciò che è raccolto
qui è un modo in cui una misura smette di misurare senza dirlo. Questa è la
versione che colpisce **la misura con cui verifichiamo le altre misure**.*

## ⓪-decies UN CAMPO CHE RISPONDE A DUE DOMANDE

> **DA' LA RISPOSTA GIUSTA A UNA E SBAGLIATA ALL'ALTRA, E NESSUNO SE NE ACCORGE
> FINCHE' LE DUE NON DIVERGONO.**

È la forma più silenziosa di tutte, perché **finché le due risposte coincidono
il campo è corretto per entrambe**. Non c'è un momento in cui diventa
sbagliato: c'è un caso, di solito uno solo, in cui lo era da sempre.

**I due casi, misurati entrambi, a un giorno di distanza.**

**⑥-zero, 2026-09-16 — `COPPIE` e la coppia passo/kind.** L'elenco di `[E]`
nominava `flashcardAEngIta` e `flashcardAItaEng` come «i due kind» di Flash
Card. Sono due **passi** che condividono **un** kind. Il difetto era invisibile
perché **per tredici descrittori su quindici il nome del passo e il nome del
kind sono la stessa stringa**: due nomi diversi per la stessa cosa tredici
volte, e per cose diverse due volte.

**⑦, 2026-09-17 — `tornaAllaMappa`.** Il campo rispondeva a due domande:

| | Domanda | Risposta per Personalizza |
|---|---|---|
| ① | qual è il pulsante «← Mappa» dell'intestazione? | **nessuno**, ed è giusto (categoria Inizio, regola 17) |
| ② | come torno alla mappa per riaprire il modulo? | **`start-episode`** |

Il campo valeva `null`, che è la risposta **giusta alla ①** e **sbagliata alla
②**. E il lettore che gli serviva era la ②: il blocco `[C]` filtrava su quel
campo, quindi **escludeva Personalizza dal ciclo delle riaperture** — l'unica
famiglia il cui blocco di listener, dopo il ⑦, non sarebbe stato protetto da
nient'altro.

⚠️ **E la cosa che rende la famiglia diversa dalle altre di questo file: qui il
test non sbaglia. Semplicemente non guarda.** Un'asserzione vacua (⓪-ter) c'è e
non prova niente; un campione (la lezione accanto a `[C]`) guarda i casi
sbagliati; qui la famiglia **sparisce dal ciclo**, e il conto delle asserzioni
scende di due senza che nessuna riga diventi rossa. *Il numero migliora proprio
dove il lavoro fa danno — la stessa firma della regola 44.*

**La forma operativa, e si applica a un campo, non a un test:**

1. davanti a un campo usato da più di un lettore, chiedersi **a quale domanda
   risponde** — non «cosa contiene»;
2. se i lettori fanno domande diverse, verificare che le risposte coincidano
   **per ogni** voce, non per quelle che si hanno in mano;
3. dove divergono, **separare il campo**. Non riusare quello che c'è «perché
   quasi sempre va bene»: è precisamente il «quasi» a non lasciare traccia.

*Separare non significa inventare: `tornaAllaMappa` resta `null` per
Personalizza, perché è vero che quel modulo non ha un «← Mappa». Il campo nuovo
dice un'altra cosa, e la dice dove la cosa esiste.*

## ⓪-undecies UN'ASSERZIONE ROSSA PER UNA DECISIONE NON È UN'ASSERZIONE DA AGGIORNARE

> **LA DOMANDA È: L'INVARIANTE È CAMBIATO, O SOLO DOVE VIVE? E le due risposte
> portano a cose OPPOSTE.**

È il caso che **ogni rifattorizzazione produce** e che quasi nessuno tratta
bene, perché i due casi hanno lo stesso aspetto: una riga rossa su un passo
che si è appena dichiarato giusto. Da lì la conclusione istintiva è *«il test è
vecchio, va aggiornato»* — e **«aggiornare» quasi sempre finisce per
significare «togliere»**, o per riscrivere l'asserzione intorno al codice
nuovo, che è lo stesso danno con un'altra faccia.

| Cosa è successo | Cosa si fa |
|---|---|
| **l'invariante è cambiato** — la decisione ha deciso che quella cosa non deve più valere | l'asserzione si **toglie**, e la riga che la toglie porta la decisione che l'ha resa obsoleta |
| **è cambiato solo DOVE VIVE** | l'asserzione si **SEGUE**: stesso invariante, punto d'osservazione nuovo |

*Sono opposte, e distinguerle non si fa guardando il rosso: si fa chiedendosi
cosa l'asserzione proteggeva, che è la riga che la regola 32 obbliga a scrivere
in testa a ogni file.*

**Il caso, 2026-09-17 (passo 22, prima estrazione).**
`test_pulizie_registrate.js` verificava che `moduleEpoch++` stesse **prima** di
`stopAllModuleActivity` **dentro `showView`**. La separazione di `showView` ha
spostato l'incremento in `leaveModule`, e la riga è diventata rossa.

**L'invariante non era cambiato di una virgola:** l'incremento dell'epoca deve
precedere la pulizia, o un callback che arriva *mentre le pulizie girano*
troverebbe l'epoca vecchia e si crederebbe ancora valido. Era cambiato **dove
vive**. *Seguirla è stato il lavoro; cancellarla sarebbe stato perderla — e il
verde della suite avrebbe avuto esattamente lo stesso aspetto.*

⚠️ **E LA METÀ CHE SI PERDE SEMPRE, anche quando si segue bene: dopo uno
spostamento serve anche l'asserzione che dice che la cosa NON È PIÙ DOVE
STAVA.**

Seguire l'asserzione in `leaveModule` lasciava scoperto il ritorno: rimettere
`stopAllModuleActivity()` dentro `showView` sarebbe passato **verde**, e il
passo si sarebbe disfatto in silenzio. La riga aggiunta — *«e `showView` non ne
contiene più nessuno dei due»* — è ciò che rende lo spostamento **una
decisione**, invece di una posizione che capita di avere oggi.

*Da qui la forma operativa, e sono due righe, non una:*

1. **l'asserzione vecchia si SEGUE** dove l'invariante è andato a stare;
2. **e se ne aggiunge una che vieta il ritorno**, perché l'assenza non la
   protegge nessuno.

## ① Attese soppresse — 6 punti

**La famiglia peggiore, e la più piccola.** Un `waitForFunction(...).catch(() => {})`
è un'attesa **che non fallisce mai**: se lo stato non arriva, si aspetta il
timeout e si tira dritto. È una `waitForTimeout` travestita da attesa di
stato — con l'aggravante che *sembra* la forma giusta, quindi nessuno la
cerca in `ATTESE-FISSE.md`.

| File e riga | Cosa viene ingoiato | |
|---|---|---|
| `test_batch14.js:315` | `}, { timeout: 3000 }).catch(() => {});` |  |
| `test_batch16.js:171` | `}, { timeout: 5000 }).catch(() => {});` |  |
| `test_batch16.js:184` | `}, { timeout: 6000 }).catch(() => {});` |  |
| `test_batch16.js:263` | `}, { timeout: 5000 }).catch(() => {});` |  |
| `test_batch2b.js:272` | `}, null, { timeout: 20000 }).catch(() => {});` |  |
| `test_batch5.js:96` | `await page.waitForFunction(() => window.speechSynthesis.speaking === true, null, { timeou…` |  |

*Una di queste è **dichiarata**: `test_batch2b.js:272` porta il commento che
spiega perché preferisce non far esplodere il file, e l'asserzione subito dopo
guarda comunque lo stato vero. Le altre cinque no.*

---

## ② Click che devono riuscire — 29 punti

Un pulsante che il test si aspetta a schermo. Se non c'è, **è un difetto**, e
il `.catch` lo trasforma in un test che prosegue su una schermata sbagliata e
muore più avanti.

| File e riga | Cosa viene ingoiato | |
|---|---|---|
| `test_batch10.js:289` | `await page.click('#vc-send-btn').catch(() => {});` |  |
| `test_batch10.js:294` | `if (i < 5) { await page.click('#vc-next-btn').catch(() => {}); await page.waitForTimeout(…` |  |
| `test_batch12.js:142` | `await page.click('#voice-coach-retry-continue-btn').catch(() => {});` |  |
| `test_batch14.js:236` | `await page.click('.dg-bubble[data-line-id="' + bubbleIds[2] + '"]').catch(() => {});` |  |
| `test_batch14.js:339` | `await page.click('.dg-bubble[data-line-id="' + bubbleIds[i] + '"]').catch(() => {});` |  |
| `test_batch16.js:116` | `await page.selectOption('select[data-slot="papa"]', 'francesco').catch(() => {});` |  |
| `test_batch16.js:226` | `await page.click('#fc-retry-continue-btn', { timeout: 1000 }).catch(() => {});` |  |
| `test_batch16.js:232` | `await page.click('#fc-card', { timeout: 1000 }).catch(() => {});` |  |
| `test_batch17.js:391` | `await page.click('#fc-card', { timeout: 1000 }).catch(() => {});` |  |
| `test_batch19.js:77` | `await page.click('#qm-start-btn').catch(() => {});` |  |
| `test_batch19.js:119` | `await page.click('#qm-start-btn').catch(() => {});` |  |
| `test_batch19.js:156` | `await page.click('#sr-ready-btn').catch(() => {});` | **il caso che ha insegnato la lezione** |
| `test_batch19.js:266` | `await page.click('#sr-ready-btn').catch(() => {});` |  |
| `test_batch19.js:321` | `await page.click('#sr-ready-btn').catch(() => {});` |  |
| `test_batch19.js:362` | `await page.click('#sr-ready-btn').catch(() => {});` |  |
| `test_batch19.js:388` | `await page.click('#sr-ready-btn').catch(() => {});` |  |
| `test_batch19.js:411` | `await page.click('#sr-ready-btn').catch(() => {});` |  |
| `test_batch20.js:97` | `await page.click('#qm-start-btn').catch(() => {});` |  |
| `test_batch6.js:124` | `await page.click('#vc-send-btn').catch(() => {});` |  |
| `test_batch6.js:140` | `await page.click('#vc-next-btn').catch(() => {});` |  |
| `test_batch6.js:150` | `await page.click('#voice-coach-retry-continue-btn').catch(() => {});` |  |
| `test_batch6.js:235` | `await page.click('#vc-send-btn').catch(() => {});` |  |
| `test_batch6.js:240` | `await page.click('#vc-next-btn').catch(() => {});` |  |
| `test_batch7.js:193` | `await page.click('#fc-card').catch(() => {}); // flip` |  |
| `test_batch8.js:82` | `await page.click('#vc-send-btn').catch(() => {});` |  |
| `test_batch8.js:90` | `await page.click('#vc-next-btn').catch(() => {});` |  |
| `test_batch8.js:98` | `await page.click('#voice-coach-retry-continue-btn').catch(() => {});` |  |
| `test_batch8.js:165` | `await page.click('#vc-send-btn').catch(() => {});` |  |
| `test_batch8.js:169` | `if (i < 5) { await page.click('#vc-next-btn').catch(() => {}); await page.waitForTimeout(…` |  |

---

## ③ Opzionali legittimi — 12 punti

**Questi vanno lasciati stare.** L'elemento può non esserci per costruzione:
la schermata introduttiva compare solo la prima volta, il popup della valvola
di sicurezza solo oltre una soglia, e il click è già protetto da un `if` di
esistenza. Il `.catch` copre la corsa fra il controllo e il click.

| File e riga | Cosa viene ingoiato | |
|---|---|---|
| `test_avviso_microfono.js:112` | `if (intro) await intro.click().catch(() => {});` |  |
| `test_batch14.js:343` | `if (stillReachable) { await page.click('#dg-next-line-btn').catch(() => {}); await page.w…` |  |
| `test_batch15.js:101` | `await page.click('#attempt-popup-next', { timeout: 1000 }).catch(() => {});` |  |
| `test_batch16.js:88` | `await page.click('#attempt-popup-next', { timeout: 1000 }).catch(() => {});` |  |
| `test_batch16.js:239` | `if (nonBtn) { await nonBtn.click({ timeout: 1000 }).catch(() => {}); }` |  |
| `test_batch17.js:388` | `if (retryVisible) { await page.click('#fc-retry-continue-btn', { timeout: 1000 }).catch((…` |  |
| `test_batch17.js:394` | `if (knowBtn) { await knowBtn.click({ timeout: 1000 }).catch(() => {}); }` |  |
| `test_episodi_corti.js:55` | `if (intro) await intro.click().catch(() => {});` |  |
| `test_interruttore_episodio.js:93` | `if (intro) await intro.click().catch(() => {});` |  |
| `test_match_practice_nonloso.js:108` | `if (intro) await intro.click().catch(() => {});` |  |
| `test_sblocco_sequenziale.js:70` | `if (intro) await intro.click().catch(() => {});` |  |
| `test_sequenze.js:49` | `if (intro) await intro.click().catch(() => {});` |  |

---

## Come si corregge uno della famiglia ②

Non si toglie il `.catch` e basta: si **aspetta l'elemento prima**, così se non
arriva il test fallisce lì e lo dice.

```js
// prima: se il pulsante non c'e', non lo sa nessuno
await page.click('#sr-ready-btn').catch(() => {});

// dopo: se non c'e', fallisce QUI, con il selettore nel messaggio
await page.waitForSelector('#sr-ready-btn', { state: 'visible' });
await page.click('#sr-ready-btn');
```

**Totale: 47 punti in 19 file** (aggiornato a mano quando cambia).
