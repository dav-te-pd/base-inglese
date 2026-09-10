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
- e le guardie vere non erano 141: contate sul codice sono **180**.

Non per una definizione diversa: erano punti dello **stesso tipo**, semplicemente
non elencati. Verificato a campione — `test_batch7.js` ne dichiarava 3 e ne ha 4,
`test_batch9.js` ne dichiarava 2 e ne ha 3.

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

## Elenco — generato il 2026-09-10

**180 guardie** (un'attesa a tempo da cui dipende il verde di
un'asserzione) e **300 attese di navigazione**, 480 in tutto.

Ogni voce e' identificata dall'**asserzione che protegge**, non dal numero di
riga: la riga si sposta a ogni commit, l'etichetta di un'asserzione no. Il
numero di riga e' stampato accanto come comodita' del giorno in cui questo
file e' stato generato — se non torna, si rigenera invece di correggerlo.

### Le famiglie — raggruppate per COSA aspettano

*Raggruppare per file dice chi ha il problema; raggruppare per questo dice
quante FORME servono a chiuderlo. Le forme sono molte meno dei punti.*

| cosa si aspetta | quante |
|---|---|
| un pulsante o una classe che cambia stato | 52 |
| un suono o la voce | 29 |
| una schermata che compare o sparisce | 28 |
| una scrittura nel localStorage | 18 |
| altro | 18 |
| un testo che si riempie | 16 |
| un valore di configurazione o di dati | 5 |
| uno stile calcolato | 5 |
| la console (asserzione negativa) | 3 |
| una misura di geometria | 3 |
| un elenco di elementi che si ridisegna | 3 |

### Le guardie, una per una

| file | ms | dopo | aspetta | asserzione protetta | riga (al 2026-09-10) |
|---|---|---|---|---|---|
| `test_avviso_microfono.js` | 120 | click | altro | [B] modulo.nome : l'avviso sale di livello nell'ordine delle soglie di CONFIG | 268 |
| `test_avviso_microfono.js` | 120 | click | altro | [C] modulo.nome : al livello confermato l'avviso lo dice e blocca "Avanti" | 349 |
| `test_batch10.js` | 400 | apertura modulo | la console (asserzione negativa) | [Job2b] Unresolved placeholder logs a console warning naming it | 148 |
| `test_batch10.js` | 400 | apertura modulo | la console (asserzione negativa) | [Job2b] Story Cards (real dialogue, untouched) logs ZERO placeholder warnings — rename is consistent everywhere | 166 |
| `test_batch10.js` | 150 | click | uno stile calcolato | [Job3] All heard-check indicators are visible from the start (not hidden) | 185 |
| `test_batch10.js` | 500 | click | uno stile calcolato | [Job3] First bubble is-heard after listening, with a check icon | 197 |
| `test_batch10.js` | 400 | click | un suono o la voce | [Job4] Repeat Aloud plays the Traguardo sound on "Ho finito" | 219 |
| `test_batch10.js` | 400 | click | un suono o la voce | [Job4] Story Cards plays the Traguardo sound on "Ho finito" | 242 |
| `test_batch10.js` | 400 | click | un suono o la voce | [Job4] Repeat Aloud "← Mappa" (leaving without completing) does NOT play Traguardo | 262 |
| `test_batch10.js` | 400 | click | un suono o la voce | [Job4] Voice Coach mic-confirmed exit does NOT play Traguardo | 297 |
| `test_batch10.js` | 400 | click | un suono o la voce | [Job4] Dialogo "Non ancora" still does NOT play Traguardo | 324 |
| `test_batch11.js` | 200 | apertura modulo | una schermata che compare o sparisce | [ModuleRules] Voice Coach (all correct) reaches the summary screen | 240 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [ModuleRules] First-pass 100% saves level "verde" | 244 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [ModuleRules] First-pass 0% (every line force-accepted wrong, not skipped) saves level "rosso" | 271 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [ModuleRules] Mixed first-pass score ( state.pct %) saves level "giallo" | 300 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [Redo] First attempt (all correct) is verde | 329 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [Redo] Second attempt (all wrong) REPLACES verde with rosso (downgrade honored) | 340 |
| `test_batch11.js` | 200 | click | una scrittura nel localStorage | [Redo] Third attempt (all correct again) REPLACES rosso with verde (upgrade honored) | 351 |
| `test_batch11.js` | 300 | click | una scrittura nel localStorage | [Modulo Finale prep] L'autovalutazione da sola NON scrive l'esito: aspetta il pulsante | 381 |
| `test_batch11.js` | 300 | click | una scrittura nel localStorage | [Modulo Finale prep] Dialogo (selfAssessment) writes the same { level } shape ModuleRules writes | 390 |
| `test_batch12.js` | 300 | apertura modulo | un testo che si riempie | [Job5] Voice Practice badge/title show "Voice Practice" | 316 |
| `test_batch12.js` | 180 | click | altro | [Job5] Voice Practice never shows the Schermata Ripasso (no final retry pass) | 345 |
| `test_batch12.js` | 200 | click | una scrittura nel localStorage | [Job5] Voice Practice NOW writes a moduleOutcome (ModuleRules, LastAttemptRule) | 352 |
| `test_batch12.js` | 300 | apertura modulo | un testo che si riempie | [Job5] Voice Check badge/title show "Voice Check" | 415 |
| `test_batch12.js` | 200 | click | una scrittura nel localStorage | [Job5] Voice Check STILL uses ModuleRules (all-wrong -> rosso, unchanged from before the split) | 426 |
| `test_batch12.js` | 300 | apertura modulo | una scrittura nel localStorage | [C.1] Rispondere non scrive: il colore aspetta il pulsante come in ogni altro modulo | 497 |
| `test_batch12.js` | 250 | click | una scrittura nel localStorage | [C.1] Uscendo da "← Mappa" non resta nessuna voce di Voice Check | 503 |
| `test_batch12.js` | 200 | click | un suono o la voce | [Job1] Flash Card "Sì, la so" plays the Corretto tone (880Hz) | 525 |
| `test_batch13.js` | 200 | caricamento pagina | un valore di configurazione o di dati | [6a] CONFIG.voiceCoach.silenceTimeoutSeconds exists (default 3) | 75 |
| `test_batch13.js` | 50 | nessuna azione riconosciuta | altro | [6a] silenceTimeoutSeconds is editable in the config panel | 85 |
| `test_batch13.js` | 200 | click | un pulsante o una classe che cambia stato | [6b] Still recording just before the (shrunk) silence timeout fires | 110 |
| `test_batch13.js` | 500 | click | una schermata che compare o sparisce | [6b] Recognized speech before the timeout: no silence warning (false-discard guard) | 146 |
| `test_batch13.js` | 150 | click | una scrittura nel localStorage | [6c] Sending a recording writes a per-module audio-seconds entry | 170 |
| `test_batch13.js` | 150 | digitazione | un testo che si riempie | [6c] Config panel audio-usage section mentions Voice Practice | 179 |
| `test_batch14.js` | 500 | click | una schermata che compare o sparisce | [Job1] Continuous speech: NO silence warning fires mid-speech | 110 |
| `test_batch14.js` | 150 | click | una schermata che compare o sparisce | [Job1] Recording reaches the normal pending/confirm state when stopped | 116 |
| `test_batch14.js` | 100 | click | la console (asserzione negativa) | [Job2] No JS errors after the warm-up tap | 132 |
| `test_batch14.js` | 300 | apertura modulo | un testo che si riempie | [Job3] "Ho finito" button no longer claims "torna alla mappa" (it opens the summary now) | 145 |
| `test_batch14.js` | 150 | click | una schermata che compare o sparisce | [Job3] Repeat Aloud: clicking "Ho finito" opens the Schermata Finale (not the map) | 149 |
| `test_batch14.js` | 150 | click | una scrittura nel localStorage | [Job3] Repeat Aloud: summary's own button completes returns to the map | 160 |
| `test_batch14.js` | 150 | click | una schermata che compare o sparisce | [Job3] Story Cards: clicking "Ho finito" opens the Schermata Finale | 178 |
| `test_batch14.js` | 150 | click | una scrittura nel localStorage | [Job3] Story Cards: summary's own button completes the module | 182 |
| `test_batch14.js` | 150 | click | una schermata che compare o sparisce | [Job4] "Ripasso" badge hidden during the main pass | 199 |
| `test_batch14.js` | 150 | click | un pulsante o una classe che cambia stato | [Job7a] Dialogue has at least 3 lines to test sequencing | 230 |
| `test_batch14.js` | 100 | click | un suono o la voce | [Job7a] Clicking the locked line 3 does nothing (no audio starts) | 237 |
| `test_batch14.js` | 500 | click | un pulsante o una classe che cambia stato | [Job7a] After line 1 finishes, line 2 unlocks | 242 |
| `test_batch14.js` | 150 | click | una schermata che compare o sparisce | [Job7b] Ripeti a Tempo toolbar shows "Prossima frase" | 265 |
| `test_batch14.js` | 60 | click | un pulsante o una classe che cambia stato | [Job7b] Countdown bar is running before skipping | 271 |
| `test_batch14.js` | 120 | click | un pulsante o una classe che cambia stato | [Job8] Choice box still disabled right after the LAST line's audio ends (bar still running) | 343 |
| `test_batch14.js` | 2200 | click | un pulsante o una classe che cambia stato | [Job8] Choice box enables once the LAST line's timer actually finishes | 349 |
| `test_batch14.js` | 150 | click | una misura di geometria | [Job9a] "← Mappa" width unchanged whether Spiegazione is visible or hidden | 368 |
| `test_batch15.js` | 300 | click | un suono o la voce | [Job1] Traguardo (3 ascending notes) played at least once | 146 |
| `test_batch15.js` | 200 | click | un pulsante o una classe che cambia stato | [Job2b] Match Practice map row carries outcome-verde after all-correct run | 202 |
| `test_batch15.js` | 150 | click | un testo che si riempie | [Job3] After attempt 1, label reads "TENTATIVO 1 DI 3" | 223 |
| `test_batch15.js` | 80 | click | un testo che si riempie | [Job3] Immediately after "Riprova" (before recording), label already reads "TENTATIVO 2 DI 3" | 228 |
| `test_batch15.js` | 80 | click | un testo che si riempie | [Job3] Before the LAST (3rd) attempt, label already reads "TENTATIVO 3 DI 3" (not stuck at 2) | 237 |
| `test_batch15.js` | 150 | click | uno stile calcolato | [Job5] .ripasso-badge font-size equals .sr-direction font-size | 309 |
| `test_batch15.js` | 150 | click | un testo che si riempie | [Job6] Match Practice header shows type badge "Studio · <grado>" | 334 |
| `test_batch15.js` | 150 | click | una misura di geometria | [Job7] "Help" width unchanged whether Spiegazione is visible or hidden | 352 |
| `test_batch15.js` | 100 | click | un pulsante o una classe che cambia stato | [Job8] "Prossima frase" starts disabled (nothing playing yet) | 371 |
| `test_batch15.js` | 400 | click | un pulsante o una classe che cambia stato | [Job8] "Prossima frase" enabled while a line's countdown bar is running | 376 |
| `test_batch15.js` | 200 | apertura modulo | un elenco di elementi che si ridisegna | [Job10] Meet the Story non mostra spiegazioni, anche se le battute ne hanno | 427 |
| `test_batch15.js` | 150 | click | un pulsante o una classe che cambia stato | [Job10] With zero explanations, map row does NOT carry any outcome-* class (falls back to plain Completato) | 438 |
| `test_batch16.js` | 150 | click | un testo che si riempie | [Job1] Dialogue text does NOT contain the translated "Francis" | 126 |
| `test_batch16.js` | 200 | caricamento pagina | un valore di configurazione o di dati | [Job1b] CONFIG.people.papa.francesco really has a different EN value (regression bait present) | 140 |
| `test_batch16.js` | 400 | nessuna azione riconosciuta | un suono o la voce | [Job2] Pausa is disabled while a line's audio is actively speaking | 172 |
| `test_batch16.js` | 200 | click | un testo che si riempie | [Job2] Clicking Pausa while disabled does NOT toggle it to "Riprendi" | 177 |
| `test_batch16.js` | 150 | click | un pulsante o una classe che cambia stato | [Job2] After pausing, button reads "Riprendi" | 189 |
| `test_batch16.js` | 300 | click | una schermata che compare o sparisce | [Job2] After Riprendi, still on the dialogue screen (not stuck/crashed) | 196 |
| `test_batch16.js` | 200 | apertura modulo | altro | [Job3] "fc-level-label" (module category text inside the module) no longer exists | 211 |
| `test_batch16.js` | 150 | click | altro | [Job3] "Ripasso" badge becomes visible during the retry pass | 240 |
| `test_batch16.js` | 80 | click | un pulsante o una classe che cambia stato | [Job4] Right after "Prossima frase", the NEXT line is already playing (is-active), not just suggested | 266 |
| `test_batch16.js` | 100 | click | un suono o la voce | [Job5] Audio is actually speaking right before the flip | 293 |
| `test_batch16.js` | 50 | click | un suono o la voce | [Job5] Flipping the card while audio plays stops it immediately (Regola Azione Critica) | 297 |
| `test_batch16.js` | 150 | click | un suono o la voce | [Job6] Clicking "Ho finito, torna alla mappa" plays the "uscita" tone | 328 |
| `test_batch16.js` | 200 | apertura modulo | una misura di geometria | [Job7] "← Mappa" sits at the row's left edge | 344 |
| `test_batch16.js` | 150 | click | un pulsante o una classe che cambia stato | [Job7] Spiegazione popup opens (sanity check, not an alignment assertion) | 358 |
| `test_batch16.js` | 200 | apertura modulo | uno stile calcolato | [Job8] Voice Coach counter and Flash Card counter share the same CSS class | 382 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1a] First bubble is is-active while its audio plays | 101 |
| `test_batch17.js` | 700 | click | un elenco di elementi che si ridisegna | [Job1a] At most ONE bubble ends up with an active countdown (no duplicate cycle) | 108 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1a-bis] Spiegazione stays enabled during a line's own audio | 127 |
| `test_batch17.js` | 50 | click | un pulsante o una classe che cambia stato | [Job1a-bis] Tapping a different line while one plays is allowed (frees switches to it) | 139 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1b] "Ho finito" stays enabled during word audio | 160 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1b] "Ho finito" stops the word audio on touch (stop-on-touch, not a lock) | 172 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1c] "Ho finito" stays enabled during listen audio | 194 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1c] "Ho finito" stops the audio on touch | 202 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1d] Avanti stays enabled while target audio plays | 226 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1d-bis] Record stays enabled while target audio plays | 249 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1d-bis] Pressing Record stops the model audio (mic-bleed guard, stop not block) | 255 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1e] Answer options stay enabled while the prompt plays | 275 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1e] Prompt audio really was playing before answering | 281 |
| `test_batch17.js` | 100 | click | un suono o la voce | [Job1e-bis] Option mini-listen audio is actually playing | 307 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1e-bis] Answering stops the option's own mini-listen audio (bleed guard) | 312 |
| `test_batch17.js` | 100 | click | un pulsante o una classe che cambia stato | [Job1f] Spiegazione stays enabled while the card's own audio plays | 335 |
| `test_batch17.js` | 50 | click | un suono o la voce | [Job1f] Audio was actually playing before the flip | 349 |
| `test_batch17.js` | 100 | click | un suono o la voce | [Job1f] Listen button works again right after a flip (no stuck "speaking" state) | 363 |
| `test_batch17.js` | 150 | click | una schermata che compare o sparisce | [Job2] Reached the Schermata Finale | 395 |
| `test_batch18.js` | 120 | click | un pulsante o una classe che cambia stato | [Job2] Old bubble is no longer is-active | 85 |
| `test_batch18.js` | 150 | click | un pulsante o una classe che cambia stato | [Job2b] Only the LAST tapped line ends up active after a rapid chain of switches | 114 |
| `test_batch18.js` | 700 | click | un pulsante o una classe che cambia stato | [Job2c] Countdown profile reaches its per-line timer normally (dgActiveBubble change is a no-op here) | 140 |
| `test_batch18.js` | 80 | click | un suono o la voce | [Job1a] Audio is playing before touching Spiegazione | 160 |
| `test_batch18.js` | 50 | click | un suono o la voce | [Job1a] Spiegazione now stops the audio too (single choke point closes this gap) | 164 |
| `test_batch18.js` | 80 | click | un suono o la voce | [Job1b] Card audio is playing before touching Help | 182 |
| `test_batch18.js` | 50 | click | un suono o la voce | [Job1b] Help stops the audio too | 186 |
| `test_batch18.js` | 80 | click | un suono o la voce | [Job1c] Tapping a different listen button REPLACES the audio (still speaking, not stopped) | 207 |
| `test_batch18.js` | 80 | click | un suono o la voce | [Job1d] Switching between two mini-listen options replaces audio (still speaking) | 235 |
| `test_batch19.js` | 200 | click | un pulsante o una classe che cambia stato | [QM Task1] "Non lo so" starts enabled on a fresh question | 170 |
| `test_batch19.js` | 200 | click | una schermata che compare o sparisce | [QM Task2] Spiegazione is visible during the quiz | 198 |
| `test_batch19.js` | 100 | click | una schermata che compare o sparisce | [QM Task2] Spiegazione click opens the overlay mid-quiz | 210 |
| `test_batch19.js` | 300 | evaluate | un pulsante o una classe che cambia stato | [SR Task3-adj] Spiegazione still DISABLED mid-pause, before auto-advance (the exact flicker this fixes) | 361 |
| `test_batch19.js` | 500 | evaluate | un pulsante o una classe che cambia stato | [SR Task3-adj] Spiegazione still DISABLED into the next question (its own timer just re-locked it) | 364 |
| `test_batch19.js` | 30 | click | un pulsante o una classe che cambia stato | [SR Task3-adj] Spiegazione unlocks right after "Non lo so" (its own reveal is a case to read) | 393 |
| `test_batch19.js` | 150 | click | un pulsante o una classe che cambia stato | [SR cleanup] Re-opening after leaving mid-timer: Spiegazione is NOT stuck disabled (stopAllModuleActivity cleanup) | 443 |
| `test_batch2.js` | 150 | click | una scrittura nel localStorage | [6a] Completing Personalizzazione marks it via markModuleCompleted | 117 |
| `test_batch2.js` | 30 | digitazione | un pulsante o una classe che cambia stato | [6b] Wrong phrase keeps the confirm button disabled | 145 |
| `test_batch2.js` | 30 | digitazione | un pulsante o una classe che cambia stato | [6b] Exact phrase (case-insensitive) enables the confirm button | 149 |
| `test_batch2.js` | 100 | click | una schermata che compare o sparisce | [6b] Confirming switches to the main edit screen | 153 |
| `test_batch2.js` | 150 | click | un pulsante o una classe che cambia stato | [6b] Cancel on the warning screen returns to the map | 180 |
| `test_batch20.js` | 50 | click | un pulsante o una classe che cambia stato | [Content] Flash Card it→en: card still flips on tap | 81 |
| `test_batch20.js` | 200 | click | un testo che si riempie | [Content] Match Practice it→en: direction label reads "ITALIANO → INGLESE" | 98 |
| `test_batch20.js` | 30 | click | un testo che si riempie | [Content] Match Practice it→en: the correct option is that same entry's ENGLISH translation | 107 |
| `test_batch2b.js` | 100 | digitazione | un testo che si riempie | [1] Config panel shows one reorder row per module | 121 |
| `test_batch2b.js` | 50 | click | un valore di configurazione o di dati | [1] Clicking "down" swaps the first two entries live in APP_CONFIG | 132 |
| `test_batch3.js` | 200 | caricamento pagina | un pulsante o una classe che cambia stato | [1] ?config query param opens the config panel at boot | 105 |
| `test_batch3.js` | 150 | caricamento pagina | un pulsante o una classe che cambia stato | [1] Without ?config, the panel stays closed at boot | 116 |
| `test_batch3.js` | 250 | click | un testo che si riempie | [2] Popup title row 1 is the fixed "Spiegazione" kicker | 133 |
| `test_batch3.js` | 200 | apertura modulo | un testo che si riempie | [4e] Match Practice retry-intro text drops "finché non..." | 217 |
| `test_batch3b.js` | 200 | apertura modulo | una schermata che compare o sparisce | [5] Warning uses the dedicated .danger-panel (not the plain .overlay-text) | 112 |
| `test_batch3b.js` | 200 | apertura modulo | una schermata che compare o sparisce | [6] "Mostra pronuncia" is hidden when the line has no pronunciationTip | 136 |
| `test_batch3b.js` | 200 | apertura modulo | una schermata che compare o sparisce | [6] "Mostra pronuncia" appears when the line HAS a pronunciationTip | 163 |
| `test_batch3b.js` | 80 | click | una schermata che compare o sparisce | [6] Clicking reveals the transcription text | 169 |
| `test_batch3b.js` | 150 | click | un pulsante o una classe che cambia stato | [7] "Sì, lo so" starts disabled before any line is heard (Ascolta e Ripeti) | 188 |
| `test_batch3b.js` | 80 | click | un pulsante o una classe che cambia stato | [7] Still disabled after hearing only ONE of several lines | 193 |
| `test_batch3b.js` | 100 | click | un pulsante o una classe che cambia stato | [7] Enabled once every line has been heard at least once | 202 |
| `test_batch3b.js` | 150 | click | un pulsante o una classe che cambia stato | [7] Ripeti a Tempo: "Sai ripetere le frasi?" starts disabled too | 225 |
| `test_batch4.js` | 200 | caricamento pagina | una schermata che compare o sparisce | [T1] Config panel opens via ?config=1 | 78 |
| `test_batch4.js` | 50 | nessuna azione riconosciuta | altro | [T1] At least one .config-field-description rendered | 88 |
| `test_batch4b.js` | 300 | click | un testo che si riempie | [Spiegazione] moduleId intro name = " expected " (got " text ") | 56 |
| `test_batch5.js` | 600 | nessuna azione riconosciuta | altro | [Job1] No NEW utterance was queued after leaving (sequence did not continue) | 120 |
| `test_batch5.js` | 200 | click | un suono o la voce | [Job1b] Ripeti a Tempo is speaking line 1 | 140 |
| `test_batch5.js` | 600 | apertura modulo | altro | [Job1b] No further utterance queued after switching to a different module | 148 |
| `test_batch5.js` | 80 | click | un pulsante o una classe che cambia stato | [Job5] dialogoContinuo: Spiegazione disabled during the 3-2-1 ready countdown | 171 |
| `test_batch5.js` | 100 | click | un pulsante o una classe che cambia stato | [Job5] modId : Spiegazione disabled while a line plays (Regola Azione Critica) | 181 |
| `test_batch5.js` | 150 | click | una schermata che compare o sparisce | [Job5] dialogoAscoltaRipeti: Spiegazione hidden on Schermata Finale (rule 10) | 215 |
| `test_batch6.js` | 80 | click | altro | [Job6] Attempt 1 evaluated empty: still no notice (streak=1 < warningAt=2) | 151 |
| `test_batch6.js` | 80 | click | altro | [Job6] 6 wrong-but-recognized attempts never trigger the mic notice | 241 |
| `test_batch7.js` | 150 | click | una schermata che compare o sparisce | [Job2] Speed Match reached Schermata Finale | 86 |
| `test_batch7.js` | 50 | evaluate | altro | [Job2] moduleCompleteMessages has multiple distinct entries reachable (variety sanity, saw seen.size distinct in 6 tries) | 120 |
| `test_batch7.js` | 100 | click | altro | [Job3/4] Match Practice: safety-valve popup opens after repeated wrong/dontknow on same item | 161 |
| `test_batch7.js` | 150 | click | altro | [Job3/4] Flash Card reachable/answerable (sanity — popup or ran out of cards) | 207 |
| `test_batch8.js` | 80 | click | un pulsante o una classe che cambia stato | [Job1] "Avanti" re-enables once a recording IS recognized (streak resets) | 99 |
| `test_batch8.js` | 150 | click | una schermata che compare o sparisce | [Job1] Forcing a click on the disabled "Avanti" does NOT advance/complete the module | 130 |
| `test_batch8.js` | 200 | click | un pulsante o una classe che cambia stato | [Job1b] Module row is NOT "completed" after leaving via the mic-notice map button | 172 |
| `test_batch9.js` | 150 | nessuna azione riconosciuta | una schermata che compare o sparisce | [Job2A] Match Practice reached Schermata Finale (learned-answer strategy) | 106 |
| `test_batch9.js` | 150 | click | una schermata che compare o sparisce | [Job3] Hint is visible before all lines are heard | 247 |
| `test_batch9.js` | 400 | click | un pulsante o una classe che cambia stato | [Job3] Hint hides once all lines have been heard | 259 |
| `test_blocco_ascolto.js` | 700 | click | altro | [1] Il markup del pulsante esiste in UN punto solo (renderListenBlock) | 103 |
| `test_blocco_ascolto.js` | 500 | click | un elenco di elementi che si ridisegna | [4] Ogni opzione it→en ha il suo Mini Blocco Ascolto | 206 |
| `test_blocco_ascolto.js` | 600 | click | uno stile calcolato | [5] Anche la bolla bloccata del Dialogo porta .is-tap-locked | 230 |
| `test_dialogo_extra.js` | 150 | click | una schermata che compare o sparisce | [Regression] Mod1 still shows full header (Mappa/Spiegazione/Help) | 145 |
| `test_dialogo_extra.js` | 10 | click | un pulsante o una classe che cambia stato | [Regression] Mod1 lifts the playing bubble but no longer locks others (free-tap profile) | 153 |
| `test_dialogo_extra.js` | 60 | nessuna azione riconosciuta | una schermata che compare o sparisce | [Regression] Mod1 unlocks right after audio (no countdown bar, countdown:false) | 164 |
| `test_dialogo_extra.js` | 50 | click | una schermata che compare o sparisce | [Regression] Mod1 translations toggle rivela tutte le quante traduzioni | 173 |
| `test_dialogo_extra.js` | 120 | click | un suono o la voce | [Tocco] Un tocco a vuoto NON interrompe l'audio | 201 |
| `test_episodi_corti.js` | 600 | click | altro | [A] Un passo su un grado assente NON si dichiara completato | 90 |
| `test_episodi_corti.js` | 600 | click | altro | [B] Cliccarlo non lascia lo studente su una vista muta: si vede l'errore | 112 |
| `test_new_features.js` | 150 | click | un pulsante o una classe che cambia stato | [A] Module ids present after swap attempt (sanity, order computed at load time is expected/documented behavior) | 109 |
| `test_new_features.js` | 100 | digitazione | un pulsante o una classe che cambia stato | [B] Typing "config" INSIDE a text input does NOT open the panel | 194 |
| `test_new_features.js` | 100 | digitazione | un pulsante o una classe che cambia stato | [B] Typing "config" outside an input opens the panel | 202 |
| `test_new_features.js` | 50 | evaluate | un valore di configurazione o di dati | [B] Editing a scalar field updates window.APP_CONFIG live (7) | 223 |
| `test_new_features.js` | 50 | evaluate | una schermata che compare o sparisce | [B] Invalid JSON in array field shows inline error | 241 |
| `test_new_features.js` | 50 | digitazione | un pulsante o una classe che cambia stato | [B] Escape closes the config panel | 255 |
| `test_new_features.js` | 150 | caricamento pagina | un valore di configurazione o di dati | [B] Change persists across reload via boot-time override merge (7) | 261 |
| `test_new_features.js` | 300 | click | una scrittura nel localStorage | [B] Reset restores speedMatch.timeLimitSeconds to default (10) | 273 |
| `test_voicecoach.js` | 250 | click | un pulsante o una classe che cambia stato | [4a] "Avanti" starts disabled on the first sentence | 102 |
| `test_voicecoach.js` | 100 | click | altro | [4c] Test actually forced at least one bad-star line | 131 |
| `test_voicecoach.js` | 100 | click | un pulsante o una classe che cambia stato | [4a] "Avanti" is disabled again on the retried line (must re-record, not just reuse the old attempt) | 145 |
| `test_voicecoach.js` | 150 | click | una schermata che compare o sparisce | [4d] Schermata Finale appears once the retry pass is clean | 154 |
| `test_voicecoach.js` | 500 | evaluate | un suono o la voce | [4d] Traguardo sound played on Voice Coach's Schermata Finale | 163 |
| `test_voicecoach.js` | 150 | click | una scrittura nel localStorage | [4d] Clicking it marks voiceCoach completed and returns to the map | 171 |

### Attese di navigazione, per file

*Non sono guardie: se sono troppo corte il test si rompe aspettando —
fallisce, non passa per sbaglio. Contate per sapere quante sono.*

| file | navigazione |
|---|---|
| `test_batch10.js` | 17 |
| `test_batch11.js` | 24 |
| `test_batch12.js` | 15 |
| `test_batch13.js` | 10 |
| `test_batch14.js` | 10 |
| `test_batch15.js` | 16 |
| `test_batch16.js` | 21 |
| `test_batch17.js` | 20 |
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
| `test_batch6.js` | 15 |
| `test_batch7.js` | 22 |
| `test_batch8.js` | 16 |
| `test_batch9.js` | 18 |
| `test_dialogo_extra.js` | 7 |
| `test_mastery_al_gesto.js` | 1 |
| `test_new_features.js` | 8 |
| `test_sequenze.js` | 1 |
| `test_voicecoach.js` | 5 |

<!-- FINE GENERATO -->
