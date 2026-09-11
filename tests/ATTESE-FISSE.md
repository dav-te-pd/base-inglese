# Attese fisse che fanno da guardia a un'asserzione
Censimento dei punti in cui un test aspetta un numero di millisecondi e
subito dopo verifica qualcosa. Sono i candidati naturali quando un test
diventa rosso a intermittenza: la macchina che lo esegue è più veloce o più
lenta di quella su cui il numero era stato scelto, e la finestra si perde
(CLAUDE.md regola 19).

**A cosa serve questo file.** Non è una lista di cose da correggere. Quando la
CI segnala un rosso, si guarda qui: se il punto che ha fallito è in questa
lista, la prima ipotesi è l'attesa a tempo, non una regressione dell'app.
Correggerli tutti preventivamente sarebbe lavoro speculativo — si aspetta che
il rosso indichi dove.

**Quando un punto si manifesta, la cosa che si manifesta non è per forza la
causa. Si verifica prima di correggere.** È il caso più insidioso proprio qui,
perché questo file *suggerisce già una risposta*: il rosso arriva, il punto è
in elenco, e la tentazione è togliere l'attesa e dichiarare chiuso.

*Il caso che l'ha insegnato — `test_batch19.js`, 2026-09-07.* Il test è morto
sul `waitForFunction` di riga 139, tre righe dopo l'attesa fissa di riga 132,
che è in questa lista. Sembrava il suo caso da manuale. Non lo era: la 132 è
**ridondante** rispetto alla 139, che aspetta già lo stato vero, e con un
countdown da cinquanta millisecondi il budget di tre secondi non poteva
scadere. La causa stava **una riga più su**, alla 131:
`await page.click('#sr-ready-btn').catch(() => {})` — il click fallisce, il
`.catch` vuoto lo ingoia, il countdown non parte mai, e il test muore dove non
si può più capire perché. **L'errore viene soppresso dove nasce, e si manifesta
dove non si può più diagnosticare.**

Togliere solo l'attesa fissa avrebbe dichiarato chiuso un difetto ancora vivo,
che sarebbe tornato con lo stesso timeout muto. **Quindi: quando un punto di
questa lista fallisce, la prima ipotesi resta l'attesa a tempo — ma prima di
correggerla si guarda se qualcosa, poco sopra, sta ingoiando l'errore vero.**

**Il gemello di questo file è `ERRORI-INGOIATI.md`**, e la coppia va letta
insieme: qui stanno le attese che cadono **nel punto giusto**, lì i `.catch`
vuoti che fanno cadere il test **altrove**. Il caso raccontato qui sotto —
`test_batch19.js` — è precisamente un punto di questo elenco il cui colpevole
stava in quell'altro.

**Non tutte sono ugualmente fragili.** Un'attesa dopo un'azione che è già
finita è innocua; una che deve cadere dentro una finestra di riproduzione, o
che dà tempo a eventi asincroni di accadere, non lo è. I commenti nel codice
spesso lo dicono già ("mid-audio", "let the async notes finish", "past
feedbackPauseMs"): quelle sono le prime da guardare.

**Un caso a parte: le asserzioni negative.** Quando un test verifica che
*non* sia successo niente, un'attesa a tempo è inevitabile — per un evento che
non deve accadere non esiste una condizione da aspettare. Lì il modo di
fallire è un verde generoso, non un rosso casuale, quindi non sono da
convertire. Un esempio commentato è in `test_batch5.js`, Job1.

**Il totale non si scrive più a mano: lo conta
`tests/tools/conta-attese.js`**, ed è l'elenco generato qui sotto a dirlo.

⚠️ **LA LEZIONE, e sta in testa perché è il motivo per cui questo file è
cambiato forma il 2026-09-10.** Il vecchio elenco era scritto a mano, per
NUMERO DI RIGA, e dichiarava **141 punti in 25 file**. Andando a leggere quelle
righe nel codice di oggi:

- **140 dei 141 numeri di riga erano sbagliati** — uno solo era ancora giusto;
- **4 voci indicavano righe che non esistono più**;
- e le guardie vere non erano 141: contate sul codice erano **180** quel giorno
  (**186** all'11 settembre — il numero sta nell'elenco generato qui sotto, e
  questa riga non lo insegue: si rigenera, non si ricorda).

Non per una definizione diversa: erano punti dello **stesso tipo**, semplicemente
non elencati. Verificato a campione — `test_batch7.js` ne dichiarava 3 e ne ha 4,
`test_batch9.js` ne dichiarava 2 e ne ha 3.

⚠️ **E DAL 2026-09-11 I NUMERI SONO TRE, NON DUE.** *Guardie da convertire*,
*guardie legittime* e *navigazione*. Una guardia legittima verifica che una cosa
**NON** accada, oppure uno stato che era **già vero** prima dell'attesa:
convertirla la farebbe tornare al primo istante senza verificare niente — un
**verde che non prova più niente**, mentre il conto scende. Tenerle nel totale
farebbe **migliorare il numero proprio quando il lavoro fa danno**. Si marcano
**nel sito**, con `// ATTESA-LEGITTIMA: <motivo>`, e questo elenco le raccoglie
da solo: non è una lista da rileggere a mano.

⚠️ **E il numero si muove in TUTTE E DUE le direzioni, che è la parte
controintuitiva.** Fra il 10 e l'11 settembre sono state chiuse due famiglie di
attese — il popup dei tentativi e il sottotitolo — e le guardie **non sono
scese: sono salite**, da 180 a 186. Le quindici attese tolte stavano nella
*navigazione* (scesa di nove), mentre le sei nuove vengono da due file di test
**nati chiudendo quei difetti**. *Chiudere un difetto produce un test, e un test
nuovo porta le sue attese.* Non è un serbatoio che si svuota.

**Un censimento dice DOVE GUARDARE — non quanto è largo il problema — a meno che
non sia lui stesso a contarle.** E questo era stato usato per pianificare la
fase 3: «le 19 attese di `test_batch19`» erano diventate **7**.

*Un elenco di numeri di riga, in un repository che si muove, è un elenco che
scade in silenzio. Non è successo per disattenzione: è successo perché non c'era
nessun modo di accorgersene, e nessuno cita un documento sospettando che sia
morto.*

## Già corretti
Tenuti qui come riferimento di com'è fatta la conversione:

- `test_batch5.js` Job1 — aspettava 2650 ms calcolati a mano (durata del 3-2-1
  più un margine) sperando di cadere dentro una finestra di riproduzione di
  400 ms. Ora aspetta `speechSynthesis.speaking === true`, e legge stato e
  click in un'unica chiamata sincrona.
- `test_batch2b.js` task 3 — aspettava 600 ms perché le tre note del Traguardo,
  sfasate da `setTimeout`, facessero in tempo a suonare. Ora aspetta che siano
  state registrate davvero.
- `test_batch15.js` Job11 e Job4, `test_batch14.js` Job4, `test_batch2b.js`
  task 3 — avanzavano con attese fisse dentro cicli limitati. Ora usano
  `playThroughQuiz` di `tests/quiz-driver.js`, che aspetta cambiamenti di
  stato reali.
- **I sottotitoli delle Schermate Finali, 2026-09-10 — tre attese tolte**
  (`test_batch9.js` ×2, `test_batch15.js` ×1). Aspettavano 150 ms sperando che
  il fetch di `messaggi-feedback.json` facesse in tempo: `applyOutcomeSubtitle`
  svuota l'elemento SUBITO e lo riempie dentro `loadFeedbackMessages().then(...)`.
  Ora usano `attendiSottotitoloEsito` di `tests/attese.js`, che aspetta che il
  testo ci sia davvero.

  ⚠️ **Nello stesso giro sono stati corretti due punti che in questo elenco non
  c'erano** — `test_batch7.js` Job2 e `test_mastery_al_gesto.js` [C] — e la
  ragione per cui mancavano è la parte che vale: **non avevano nessuna attesa
  davanti alla lettura**, quindi non erano attese fisse da censire. Erano corse
  nude. *Questo file elenca le attese scritte male; non può elencare quelle che
  non sono state scritte affatto* — stessa forma della famiglia ⓪ di
  `ERRORI-INGOIATI.md`.

  ⚠️ **E il motivo per cui quelle corse si vincevano quasi sempre**: in Speed
  Match la valvola dei tentativi e la Schermata Ripasso leggono gli stessi
  messaggi DURANTE il quiz, quindi al riepilogo la cache è già calda e il
  `.then` risolve in un microtask; nel Dialogo il fetch è vero ed è il primo.
  **Non è una questione di millisecondi, è una questione di chi ha scaldato la
  cache** — e nessuno può tenerlo a mente modulo per modulo.

<!-- GENERATO DA tests/tools/conta-attese.js — non modificare a mano -->

## Elenco — generato il 2026-09-11

**0 guardie DA CONVERTIRE** — un'attesa a tempo da cui dipende
il verde di un'asserzione, e che si puo' sostituire con un'attesa sullo stato
vero. **E' questo il numero su cui si misura il 14b**, e l'unico che deve
scendere.

| | quante |
|---|---|
| **guardie da convertire** — il debito | **0** |
| guardie **legittime** — marcate nel sito, NON sono debito | 77 |
| attese di **navigazione** — se sono corte il test si rompe, non passa | 291 |
| in tutto | 368 |

⚠️ **I tre numeri non si sommano in uno solo, ed e' il punto.** Una guardia
legittima verifica che una cosa NON accada, oppure uno stato che era gia' vero:
convertirla la farebbe tornare al primo istante senza verificare niente — un
**verde che non prova piu' niente**, mentre il conto scende. Tenerle nel totale
farebbe migliorare il numero proprio quando il lavoro fa danno.

⚠️ **E LA RIGA CHE VA LETTA PRIMA DI FIDARSI DI QUESTO CONTO:**

> **UN NUMERO CHE SI MUOVE NELLA DIREZIONE CHE TI ASPETTI E' QUELLO CHE
> CONTROLLI DI MENO.**

Il caso, 2026-09-11: questo strumento teneva l'elenco delle attese vere
scritto a mano, fermo a tre helper su otto, e **promuoveva a guardia ogni
attesa che stava prima di una conversione**. Per tre famiglie di seguito il
numero e' sceso — 186, 154, 108, 90 — e nessuno l'ha controllato, perche'
scendeva. Il vero era **56**, e le tre famiglie erano gia' chiuse. Il conto
contava come debito nuovo l'effetto del lavoro che il debito lo stava
togliendo.

Ogni voce e' identificata dall'**asserzione che protegge**, non dal numero di
riga: la riga si sposta a ogni commit, l'etichetta di un'asserzione no. Il
numero di riga e' stampato accanto come comodita' del giorno in cui questo
file e' stato generato — se non torna, si rigenera invece di correggerlo.

### Le famiglie — raggruppate per COSA aspettano

*Raggruppare per file dice chi ha il problema; raggruppare per questo dice
quante FORME servono a chiuderlo. Le forme sono molte meno dei punti.*

| cosa si aspetta | quante |
|---|---|

### Le guardie, una per una

| file | ms | dopo | aspetta | asserzione protetta | riga (al 2026-09-11) |
|---|---|---|---|---|---|

### Le guardie legittime — marcate nel sito, e perche'

*Restano a tempo per sempre. Il motivo e' scritto accanto all'attesa con
`// ATTESA-LEGITTIMA:`, quindi lo legge chi passa di li' — e questo elenco lo
raccoglie da solo invece di essere una lista da rileggere a mano.*

| file | ms | asserzione protetta | perche' resta |
|---|---|---|---|
| `test_batch10.js` | 500 | [Job3] First bubble is-heard after listening, with a check icon | la spunta `is-heard` arriva alla fine dell'audio ed e' esattamente cio' che l'asserzione legge (regola 44); l'unico altro effetto di quell'istante e' una classe che SPARISCE, e attendiClasseAssente non esiste per decisione dichiarata |
| `test_batch10.js` | 400 | [Job4] Repeat Aloud "← Mappa" (leaving without completing) does NOT play Traguardo | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — uscendo senza completare il Traguardo NON deve suonare |
| `test_batch10.js` | 400 | [Job4] Voice Coach mic-confirmed exit does NOT play Traguardo | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — l'uscita dall'avviso microfono NON deve suonare il Traguardo |
| `test_batch10.js` | 400 | [Job4] Dialogo "Non ancora" still does NOT play Traguardo | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — «Non ancora» NON deve suonare il Traguardo |
| `test_batch11.js` | 300 | [Modulo Finale prep] L'autovalutazione da sola NON scrive l'esito: aspetta il pulsante | l'asserzione qui sotto verifica che una scrittura NON avvenga — rispondere all'autovalutazione non deve lasciare un esito. Un non-evento non si aspetta: il tempo E' la misura, e un'attesa sullo stato tornerebbe solo piu' tardi con lo stesso nulla |
| `test_batch12.js` | 180 | [Job5] Voice Practice never shows the Schermata Ripasso (no final retry pass) | l'asserzione dopo il ciclo e' negativa: Voice Practice non deve MAI mostrare la Schermata Ripasso. Il ciclo percorre il modulo e verifica che quella schermata non compaia: non c'e' uno stato da aspettare, c'e' una finestra da lasciare vuota |
| `test_batch12.js` | 300 | [C.1] Rispondere non scrive: il colore aspetta il pulsante come in ogni altro modulo | la guardia serve all'asserzione NEGATIVA qui sotto — «rispondere non scrive». Un non-evento non si aspetta: allungare il tempo rafforza la prova, uno stato da attendere non esiste |
| `test_batch12.js` | 250 | [C.1] Uscendo da "← Mappa" non resta nessuna voce di Voice Check | l'asserzione qui sotto verifica che una scrittura NON sia rimasta — uscire dalla mappa non deve lasciare una voce di mastery. Un non-evento non si aspetta: il tempo E' la misura |
| `test_batch13.js` | 200 | [6b] Still recording just before the (shrunk) silence timeout fires | si legge PRIMA che il timeout di silenzio scatti — registrare gia' partita, si prova che non si e' fermata |
| `test_batch13.js` | 500 | [6b] Recognized speech before the timeout: no silence warning (false-discard guard) | prova che l'avviso di silenzio NON compare dopo un parlato riconosciuto |
| `test_batch14.js` | 500 | [Job1] Continuous speech: NO silence warning fires mid-speech | prova che un avviso NON compare — ben oltre il timeout di 150ms |
| `test_batch14.js` | 100 | [Job2] No JS errors after the warm-up tap | l'asserzione qui sotto e' negativa — nessun errore JS dopo il tocco di riscaldamento. Un errore che non arriva non ha una condizione da aspettare: si lascia una finestra e si guarda se e' rimasta vuota |
| `test_batch14.js` | 150 | [Job4] "Ripasso" badge hidden during the main pass | il badge "Ripasso" e' gia' nascosto — si prova che NON compaia nel giro principale |
| `test_batch14.js` | 150 | [Job7a] Dialogue has at least 3 lines to test sequencing | NON e' una guardia di questa famiglia — l'asserzione legge un DATO (un conteggio), non un pulsante ne' una classe. Il censimento l'ha messa fra «un pulsante o una classe che cambia stato» perche' nella finestra c'e' un getAttribute che appartiene a un'ALTRA riga. Marcata per toglierla dal debito, non perche' il tempo sia la misura: qui si conta quante bolle ci sono |
| `test_batch14.js` | 100 | [Job7a] Clicking the locked line 3 does nothing (no audio starts) | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — cliccare una battuta bloccata NON deve far partire nessun audio |
| `test_batch14.js` | 500 | [Job7a] After line 1 finishes, line 2 unlocks | aspetta che una CLASSE SPARISCA, e attendiClasseAssente non esiste. Qui la classe c'e' davvero prima, quindi la conversione sarebbe sicura — ma i siti come questo sono QUATTRO, e quattro non giustificano una funzione da difendere per sempre su cui sbagliare produce un test vuoto. SOGLIA DICHIARATA: quando diventano DIECI, la funzione si fa |
| `test_batch14.js` | 120 | [Job8] Choice box still disabled right after the LAST line's audio ends (bar still running) | il pulsante e' gia' disabilitato: si prova che NON si abiliti finche' la barra scorre |
| `test_batch15.js` | 100 | [Job8] "Prossima frase" starts disabled (nothing playing yet) | "Prossima frase" nasce disabilitato: lo stato era GIA' vero prima dell'attesa: un'attesa tornerebbe al primo istante |
| `test_batch15.js` | 150 | [Job10] With zero explanations, map row does NOT carry any outcome-* class (falls back to plain Completato) | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — la riga della mappa NON deve prendere nessuna classe outcome-* |
| `test_batch16.js` | 150 | [Job1] Dialogue text does NOT contain the translated "Francis" | l'asserzione qui sotto verifica che il dialogo NON contenga "Francis" — un non-evento non si aspetta, il tempo E' la misura. E allungarlo rafforza la prova invece di indebolirla: piu' battute passano, piu' e' vero che quel nome non compare |
| `test_batch16.js` | 400 | [Job2] Pausa is disabled while a line's audio is actively speaking | NON e' una guardia di questa famiglia — l'asserzione legge un PULSANTE (dg-pause-btn disabilitato), non un suono: il censimento l'ha messa fra «un suono o la voce» perche' l'etichetta del log nomina l'audio. E il momento conta: si legge mentre la battuta parla, prima che parta il countdown |
| `test_batch16.js` | 200 | [Job2] Clicking Pausa while disabled does NOT toggle it to "Riprendi" | verifica che un click su un pulsante DISABILITATO non produca niente — il testo deve restare "Pausa". Non c'e' nessuno stato da attendere: aspettarne uno significherebbe aspettare l'evento che non deve accadere |
| `test_batch16.js` | 150 | [Job2] After pausing, button reads "Riprendi" | misto e nessuna delle due meta' e' convertibile: il TESTO del pulsante non ha una forma condivisa (e' la famiglia «un testo che si riempie»), e lo stato abilitato era gia' vero prima della pausa |
| `test_batch16.js` | 300 | [Job2] After Riprendi, still on the dialogue screen (not stuck/crashed) | prova che riprendendo NON si esce dalla schermata del dialogo |
| `test_batch16.js` | 150 | [Job3] "Ripasso" badge becomes visible during the retry pass | e' l'ultima attesa di un CICLO che guida il modulo, e l'asserzione dopo il ciclo ne riassume l'esito. Non c'e' uno stato finale da attendere: il ciclo finisce quando finisce, e questo tempo e' il passo del ciclo, non una guardia |
| `test_batch16.js` | 50 | [Job5] Flipping the card while audio plays stops it immediately (Regola Azione Critica) | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 700 | [Job1a] At most ONE bubble ends up with an active countdown (no duplicate cycle) | qui il TEMPO E' LA COSA MISURATA. Si ritocca la stessa bolla mentre parla e si verifica che NON nasca un secondo countdown: e' un non-evento, e la finestra deve coprire l'audio (500 ms) piu' il timer. Aspettare uno stato significherebbe aspettare il duplicato che non deve arrivare |
| `test_batch17.js` | 100 | [Job1a-bis] Spiegazione stays enabled during a line's own audio | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — Spiegazione NON deve spegnersi mentre l'audio parla (regola 16) |
| `test_batch17.js` | 100 | [Job1b] "Ho finito" stays enabled during word audio | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — "Ho finito" NON deve spegnersi durante l'audio di una parola (regola 16) |
| `test_batch17.js` | 50 | [Job1b] "Ho finito" stops the word audio on touch (stop-on-touch, not a lock) | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 100 | [Job1c] "Ho finito" stays enabled during listen audio | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — i pulsanti di Why We Say It NON devono spegnersi durante l'ascolto (regola 16) |
| `test_batch17.js` | 50 | [Job1c] "Ho finito" stops the audio on touch | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 100 | [Job1d] Avanti stays enabled while target audio plays | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — Avanti e Spiegazione NON devono spegnersi mentre parla il bersaglio (regola 16) |
| `test_batch17.js` | 100 | [Job1d-bis] Record stays enabled while target audio plays | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — il microfono NON deve spegnersi mentre parla il bersaglio (regola 16) |
| `test_batch17.js` | 50 | [Job1d-bis] Pressing Record stops the model audio (mic-bleed guard, stop not block) | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 100 | [Job1e] Answer options stay enabled while the prompt plays | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — le opzioni di risposta NON devono spegnersi mentre la domanda parla (regola 16) |
| `test_batch17.js` | 50 | [Job1e] Prompt audio really was playing before answering | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 50 | [Job1e-bis] Answering stops the option's own mini-listen audio (bleed guard) | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch17.js` | 100 | [Job1f] Spiegazione stays enabled while the card's own audio plays | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — i pulsanti di Flash Card NON devono spegnersi durante l'audio della carta (regola 16) |
| `test_batch17.js` | 50 | [Job1f] Audio was actually playing before the flip | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch18.js` | 120 | [Job2] Old bubble is no longer is-active | aspetta che una CLASSE SPARISCA, e attendiClasseAssente non esiste. Qui la classe c'e' davvero prima, quindi la conversione sarebbe sicura — ma i siti come questo sono QUATTRO, e quattro non giustificano una funzione da difendere per sempre su cui sbagliare produce un test vuoto. SOGLIA DICHIARATA: quando diventano DIECI, la funzione si fa — e in piu' il commento qui sopra lo dice: si aspetta APPOSTA oltre l'onerror ritardato, per dare al callback vecchio ogni occasione di sbagliare |
| `test_batch18.js` | 150 | [Job2b] Only the LAST tapped line ends up active after a rapid chain of switches | aspetta che una CLASSE SPARISCA, e attendiClasseAssente non esiste. Qui la classe c'e' davvero prima, quindi la conversione sarebbe sicura — ma i siti come questo sono QUATTRO, e quattro non giustificano una funzione da difendere per sempre su cui sbagliare produce un test vuoto. SOGLIA DICHIARATA: quando diventano DIECI, la funzione si fa — si verifica che le bolle PRECEDENTI non siano piu' attive dopo una catena rapida |
| `test_batch18.js` | 50 | [Job1a] Spiegazione now stops the audio too (single choke point closes this gap) | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch18.js` | 50 | [Job1b] Help stops the audio too | l'ISTANTE e' la misura. Si legge 50ms dopo il tocco perche' il finto sintetizzatore si spegne DA SOLO dopo 500ms: un'attesa «finche' non parla piu'» tornerebbe comunque, e «il tocco l'ha fermato» diventerebbe «prima o poi ha smesso», vera sempre. I 50ms sono la distanza fra le due cose. (regola 16 — vedi il blocco [D] di test_attese_condivise.js, che rende il pericolo eseguibile) |
| `test_batch18.js` | 80 | [Job1c] Tapping a different listen button REPLACES the audio (still speaking, not stopped) | lo stato era GIA' vero prima dell'attesa — l'audio parlava gia': si prova che toccando un ALTRO pulsante di ascolto continui a parlare invece di fermarsi, e un'attesa «finche' parla» tornerebbe al primo istante |
| `test_batch18.js` | 80 | [Job1d] Switching between two mini-listen options replaces audio (still speaking) | lo stato era GIA' vero prima dell'attesa — l'audio parlava gia': si prova che toccando un ALTRO pulsante di ascolto continui a parlare invece di fermarsi, e un'attesa «finche' parla» tornerebbe al primo istante |
| `test_batch19.js` | 200 | [QM Task1] "Non lo so" starts enabled on a fresh question | "Non lo so" nasce abilitato su una domanda nuova: lo stato era GIA' vero prima dell'attesa: un'attesa tornerebbe al primo istante |
| `test_batch19.js` | 300 | [SR Task3-adj] Spiegazione still DISABLED mid-pause, before auto-advance (the exact flicker this fixes) | si legge a META' della pausa di 600ms: e' proprio l'istante intermedio a dover essere verificato, e un'attesa lo salterebbe |
| `test_batch19.js` | 500 | [SR Task3-adj] Spiegazione still DISABLED into the next question (its own timer just re-locked it) | si legge DOPO la pausa ma dentro il timer della domanda nuova: la finestra e' il dato, non un'attesa |
| `test_batch19.js` | 150 | [SR cleanup] Re-opening after leaving mid-timer: Spiegazione is NOT stuck disabled (stopAllModuleActivity cleanup) | NON e' una guardia — fra questa attesa e l'asserzione c'e' la chiamata a un AIUTANTE LOCALE che aspetta per conto suo (openModule), e il censimento non lo conosce, quindi conta come guardia un'attesa che non lo e'. Misurato l'11 settembre: casi cosi' sono QUATTRO in tutta la suite, quindi si marcano dove capitano invece di allargare la regola dello strumento |
| `test_batch2.js` | 30 | [6b] Wrong phrase keeps the confirm button disabled | il pulsante e' gia' disabilitato: si prova che una frase sbagliata NON lo abiliti |
| `test_batch3.js` | 150 | [1] Without ?config, the panel stays closed at boot | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — senza ?config il pannello NON deve aprirsi |
| `test_batch3b.js` | 200 | [6] "Mostra pronuncia" is hidden when the line has no pronunciationTip | "Mostra pronuncia" e' nascosto fin dall'apertura — si prova che RESTI nascosto |
| `test_batch3b.js` | 150 | [7] "Sì, lo so" starts disabled before any line is heard (Ascolta e Ripeti) | "Si', lo so" nasce disabilitato: lo stato era GIA' vero prima dell'attesa: un'attesa tornerebbe al primo istante |
| `test_batch3b.js` | 80 | [7] Still disabled after hearing only ONE of several lines | gia' disabilitato: si prova che UNA battuta sola NON basti ad abilitarlo |
| `test_batch3b.js` | 150 | [7] Ripeti a Tempo: "Sai ripetere le frasi?" starts disabled too | stesso caso del gemello Ascolta e Ripeti: nasce disabilitato, lo stato era GIA' vero prima dell'attesa: un'attesa tornerebbe al primo istante |
| `test_batch5.js` | 600 | [Job1] No NEW utterance was queued after leaving (sequence did not continue) | l'asserzione qui sotto e' negativa — nessuna NUOVA battuta accodata dopo l'uscita. Per un evento che non deve accadere non esiste una condizione da aspettare: si lascia una finestra e si verifica che sia rimasta vuota |
| `test_batch5.js` | 600 | [Job1b] No further utterance queued after switching to a different module | l'asserzione qui sotto e' negativa — nessuna battuta accodata dopo essere passati a un ALTRO modulo. Un evento che non deve accadere non ha una condizione da aspettare: si lascia una finestra e si verifica che sia rimasta vuota |
| `test_batch6.js` | 80 | [Job6] Attempt 1 evaluated empty: still no notice (streak=1 < warningAt=2) | la guardia serve all'asserzione NEGATIVA di fine ciclo — al primo tentativo l'avviso microfono NON deve comparire (streak=1 < warningAt=2). Non c'e' nessuno stato da attendere: aspettarne uno significherebbe aspettare l'avviso che non deve arrivare |
| `test_batch6.js` | 80 | [Job6] 6 wrong-but-recognized attempts never trigger the mic notice | l'asserzione dopo il ciclo e' negativa: sei tentativi sbagliati ma RICONOSCIUTI non devono far comparire l'avviso microfono, che segnala un guasto del microfono e non una pronuncia sbagliata. Il tempo E' la misura |
| `test_batch7.js` | 100 | [Job3/4] Match Practice: safety-valve popup opens after repeated wrong/dontknow on same item | e' l'ultima attesa di un CICLO che guida il modulo, e l'asserzione dopo il ciclo ne riassume l'esito. Non c'e' uno stato finale da attendere: il ciclo finisce quando finisce, e questo tempo e' il passo del ciclo, non una guardia |
| `test_batch8.js` | 80 | [Job1] "Avanti" re-enables once a recording IS recognized (streak resets) | NON e' una guardia: questa attesa sta dentro un ramo condizionale che serve a superare la Schermata Ripasso, e l'asserzione che il censimento le attribuisce sta molto piu' giu', dopo altro codice. La finestra di sedici righe dello strumento l'ha agganciata al log sbagliato |
| `test_batch8.js` | 150 | [Job1] Forcing a click on the disabled "Avanti" does NOT advance/complete the module | prova che la Schermata Finale NON compare dopo un click forzato |
| `test_batch8.js` | 200 | [Job1b] Module row is NOT "completed" after leaving via the mic-notice map button | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — uscendo dall'avviso microfono il modulo NON deve risultare completato |
| `test_dialogo_extra.js` | 10 | [Regression] Mod1 lifts the playing bubble but no longer locks others (free-tap profile) | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — nel profilo a tocco libero le ALTRE bolle NON devono bloccarsi |
| `test_dialogo_extra.js` | 60 | [Regression] Mod1 unlocks right after audio (no countdown bar, countdown:false) | prova che due classi NON ci sono piu' dopo l'audio |
| `test_dialogo_extra.js` | 120 | [Tocco] Un tocco a vuoto NON interrompe l'audio | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — un tocco a vuoto NON deve interrompere l'audio (regola 16, l'eccezione dei profili con countdown) |
| `test_episodi_corti.js` | 600 | [A] Un passo su un grado assente NON si dichiara completato | qui NON c'e' un approdo possibile, e il motivo e' la regola 44. L'ultimo effetto del click e' la schermata d'errore che diventa attiva — ma `erroreVisibile` e' ESATTAMENTE quello che l'asserzione legge: aspettarlo la renderebbe vera per costruzione. E gli altri due effetti sono negativi (non completato, nessun esito), quindi nemmeno loro si possono aspettare. Non resta niente su cui aspettare che non sia gia' letto: l'attesa a tempo e' l'unica forma onesta |
| `test_episodi_corti.js` | 600 | [B] Cliccarlo non lascia lo studente su una vista muta: si vede l'errore | qui NON c'e' un approdo possibile, e il motivo e' la regola 44. L'ultimo effetto del click e' la schermata d'errore che diventa attiva — ma `erroreVisibile` e' ESATTAMENTE quello che l'asserzione legge: aspettarlo la renderebbe vera per costruzione. E gli altri due effetti sono negativi (non completato, nessun esito), quindi nemmeno loro si possono aspettare. Non resta niente su cui aspettare che non sia gia' letto: l'attesa a tempo e' l'unica forma onesta |
| `test_modulo_pronto.js` | 300 | [B] Premere il microfono non solleva nessun errore | l'asserzione qui sotto e' negativa — premere il microfono non deve sollevare NESSUN errore. Un errore che non arriva non ha una condizione da aspettare: si lascia una finestra e si guarda se e' rimasta vuota |
| `test_modulo_pronto.js` | 2200 | [B] Nessun errore nemmeno dopo che il file dei messaggi è arrivato | qui il TEMPO E' LA COSA MISURATA, non una guardia: i 2200 ms sono la finestra in cui il file dei messaggi arriva davvero, e l'asserzione e' che nemmeno allora compaia un errore. Aspettare l'arrivo del file renderebbe l'asserzione vera per costruzione (regola 44): quello che si vuole provare e' che NIENTE succeda nell'intervallo |
| `test_modulo_pronto.js` | 600 | [C] Personalizza si apre: chi non legge un file episodio non lo aspetta | prova che la schermata d'errore NON compare su un modulo senza dataFile |
| `test_new_features.js` | 150 | [A] Module ids present after swap attempt (sanity, order computed at load time is expected/documented behavior) | NON e' una guardia di questa famiglia — l'asserzione legge un DATO (un conteggio), non un pulsante ne' una classe. Il censimento l'ha messa fra «un pulsante o una classe che cambia stato» perche' nella finestra c'e' un getAttribute che appartiene a un'ALTRA riga. Marcata per toglierla dal debito, non perche' il tempo sia la misura: qui si legge l'ELENCO dei moduli in mappa |
| `test_new_features.js` | 100 | [B] Typing "config" INSIDE a text input does NOT open the panel | verifica che una cosa NON accada: un non-evento non si aspetta, il tempo E' la misura — scrivere "config" DENTRO un campo di testo NON deve aprire il pannello |
| `test_new_features.js` | 50 | [B] Escape closes the config panel | aspetta che una CLASSE SPARISCA, e attendiClasseAssente non esiste. Qui la classe c'e' davvero prima, quindi la conversione sarebbe sicura — ma i siti come questo sono CINQUE (il quinto e' la spunta di ascolto in test_batch10, 2026-09-11), e cinque non giustificano una funzione da difendere per sempre su cui sbagliare produce un test vuoto. SOGLIA DICHIARATA: quando diventano DIECI, la funzione si fa — Escape TOGLIE is-open dal pannello |
| `test_voicecoach.js` | 250 | [4a] "Avanti" starts disabled on the first sentence | "Avanti" nasce disabilitato sulla prima battuta: lo stato era GIA' vero prima dell'attesa: un'attesa tornerebbe al primo istante |
| `test_voicecoach.js` | 100 | [4c] Test actually forced at least one bad-star line | e' l'ultima attesa di un CICLO che guida il modulo, e l'asserzione dopo il ciclo ne riassume l'esito. Non c'e' uno stato finale da attendere: il ciclo finisce quando finisce, e questo tempo e' il passo del ciclo, non una guardia |

### Attese di navigazione, per file

*Non sono guardie: se sono troppo corte il test si rompe aspettando —
fallisce, non passa per sbaglio. Contate per sapere quante sono.*

| file | navigazione |
|---|---|
| `test_batch10.js` | 15 |
| `test_batch11.js` | 23 |
| `test_batch12.js` | 14 |
| `test_batch13.js` | 10 |
| `test_batch14.js` | 9 |
| `test_batch15.js` | 15 |
| `test_batch16.js` | 17 |
| `test_batch17.js` | 21 |
| `test_batch18.js` | 16 |
| `test_batch19.js` | 10 |
| `test_batch2.js` | 4 |
| `test_batch20.js` | 6 |
| `test_batch2b.js` | 6 |
| `test_batch3.js` | 5 |
| `test_batch3b.js` | 6 |
| `test_batch4.js` | 4 |
| `test_batch4b.js` | 3 |
| `test_batch5.js` | 14 |
| `test_batch6.js` | 14 |
| `test_batch7.js` | 23 |
| `test_batch8.js` | 14 |
| `test_batch9.js` | 20 |
| `test_dialogo_extra.js` | 7 |
| `test_mastery_al_gesto.js` | 1 |
| `test_new_features.js` | 8 |
| `test_sequenze.js` | 1 |
| `test_voicecoach.js` | 5 |

<!-- FINE GENERATO -->
