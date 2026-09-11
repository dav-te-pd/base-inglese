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
