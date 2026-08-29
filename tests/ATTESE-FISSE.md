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

**Totale: 144 punti in 25 file** (aggiornato a mano quando cambia).

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

## Elenco

### `test_batch2.js` — 5
- riga 116 — `await page.waitForTimeout(150);`
- riga 138 — `await page.waitForTimeout(30);`
- riga 142 — `await page.waitForTimeout(30);`
- riga 146 — `await page.waitForTimeout(100);`
- riga 173 — `await page2.waitForTimeout(150);`

### `test_batch2b.js` — 1
- riga 122 — `await page.waitForTimeout(50);`

### `test_batch3.js` — 4
- riga 95 — `await page.waitForTimeout(200);`
- riga 106 — `await page.waitForTimeout(150);`
- riga 123 — `await page.waitForTimeout(250);`
- riga 224 — `await page.waitForTimeout(200);`

### `test_batch3b.js` — 8
- riga 100 — `await page.waitForTimeout(200);`
- riga 124 — `await page.waitForTimeout(200);`
- riga 148 — `await page.waitForTimeout(200);`
- riga 154 — `await page.waitForTimeout(80);`
- riga 173 — `await page.waitForTimeout(150);`
- riga 178 — `await page.waitForTimeout(80);`
- riga 187 — `await page.waitForTimeout(100);`
- riga 210 — `await page.waitForTimeout(150);`

### `test_batch4.js` — 2
- riga 76 — `await page.waitForTimeout(200);`
- riga 86 — `await page.waitForTimeout(50);`

### `test_batch4b.js` — 1
- riga 55 — `await page.waitForTimeout(300);`

### `test_batch5.js` — 4
- riga 119 — `await page.waitForTimeout(600);`
- riga 139 — `await page.waitForTimeout(200); // mid line-1 audio`
- riga 147 — `await page.waitForTimeout(600);`
- riga 214 — `await page.waitForTimeout(150);`

### `test_batch6.js` — 1
- riga 240 — `await page.waitForTimeout(80);`

### `test_batch7.js` — 3
- riga 84 — `await page.waitForTimeout(150);`
- riga 153 — `await page.waitForTimeout(100);`
- riga 199 — `await page.waitForTimeout(150);`

### `test_batch8.js` — 2
- riga 129 — `await page.waitForTimeout(150);`
- riga 171 — `await page.waitForTimeout(200);`

### `test_batch9.js` — 4
- riga 104 — `await page.waitForTimeout(150);`
- riga 172 — `await page.waitForTimeout(150);`
- riga 200 — `await page.waitForTimeout(150);`
- riga 239 — `if (startBtnVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(150); }`

### `test_batch10.js` — 7
- riga 146 — `await page.waitForTimeout(400);`
- riga 164 — `await page.waitForTimeout(400);`
- riga 217 — `await page.waitForTimeout(400);`
- riga 237 — `await page.waitForTimeout(400);`
- riga 257 — `await page.waitForTimeout(400);`
- riga 292 — `await page.waitForTimeout(400);`
- riga 319 — `await page.waitForTimeout(400);`

### `test_batch11.js` — 5
- riga 231 — `await page.waitForTimeout(200);`
- riga 320 — `await page.waitForTimeout(200);`
- riga 331 — `await page.waitForTimeout(200);`
- riga 342 — `await page.waitForTimeout(200);`
- riga 372 — `await page.waitForTimeout(300);`

### `test_batch12.js` — 4
- riga 292 — `await page.waitForTimeout(300);`
- riga 321 — `await page.waitForTimeout(180);`
- riga 359 — `await page.waitForTimeout(300);`
- riga 394 — `await page.waitForTimeout(200);`

### `test_batch13.js` — 5
- riga 84 — `await page.waitForTimeout(50);`
- riga 109 — `await page.waitForTimeout(200);`
- riga 145 — `await page.waitForTimeout(500); // past where the (now-moot) silence timeout would have fired`
- riga 169 — `await page.waitForTimeout(150);`
- riga 178 — `await page.waitForTimeout(150);`

### `test_batch14.js` — 16
- riga 103 — `await page.waitForTimeout(500); // well past the 150ms silence timeout, still "speaking"`
- riga 109 — `await page.waitForTimeout(150);`
- riga 125 — `await page.waitForTimeout(100);`
- riga 138 — `await page.waitForTimeout(300);`
- riga 142 — `await page.waitForTimeout(150);`
- riga 153 — `await page.waitForTimeout(150);`
- riga 169 — `await page.waitForTimeout(150);`
- riga 173 — `await page.waitForTimeout(150);`
- riga 190 — `await page.waitForTimeout(150);`
- riga 221 — `await page.waitForTimeout(150);`
- riga 228 — `await page.waitForTimeout(100);`
- riga 233 — `await page.waitForTimeout(500);`
- riga 256 — `await page.waitForTimeout(150);`
- riga 262 — `await page.waitForTimeout(60); // audio ends fast (fake synth, 20ms), bar starts (long, 5s+)`
- riga 340 — `await page.waitForTimeout(2200);`
- riga 359 — `await page.waitForTimeout(150);`

### `test_batch15.js` — 11
- riga 139 — `await page.waitForTimeout(300);`
- riga 195 — `await page.waitForTimeout(200);`
- riga 216 — `await page.waitForTimeout(150);`
- riga 221 — `await page.waitForTimeout(80);`
- riga 230 — `await page.waitForTimeout(80);`
- riga 327 — `await page.waitForTimeout(150);`
- riga 364 — `if (dgStart) { await page.click('#dg-start-btn'); await page.waitForTimeout(100); }`
- riga 369 — `if (firstBubble) { await firstBubble.click(); await page.waitForTimeout(400); }`
- riga 417 — `await page.waitForTimeout(200);`
- riga 421 — `await page.waitForTimeout(150);`
- riga 426 — `await page.waitForTimeout(150);`

### `test_batch16.js` — 11
- riga 124 — `if (dgStartVisible) { await page.click('#dg-start-btn'); await page.waitForTimeout(150); }`
- riga 170 — `await page.waitForTimeout(400);`
- riga 175 — `await page.waitForTimeout(200);`
- riga 187 — `await page.waitForTimeout(150);`
- riga 194 — `await page.waitForTimeout(300);`
- riga 209 — `await page.waitForTimeout(200);`
- riga 235 — `await page.waitForTimeout(150);`
- riga 288 — `await page.waitForTimeout(100);`
- riga 292 — `await page.waitForTimeout(50);`
- riga 323 — `await page.waitForTimeout(150);`
- riga 353 — `await page.waitForTimeout(150);`

### `test_batch17.js` — 14
- riga 99 — `await page.waitForTimeout(100); // mid-audio (500ms fake synth)`
- riga 106 — `await page.waitForTimeout(700); // let the original audio (500ms) + timer settle`
- riga 137 — `await page.waitForTimeout(50);`
- riga 170 — `await page.waitForTimeout(50);`
- riga 196 — `await page.waitForTimeout(50);`
- riga 243 — `await page.waitForTimeout(100);`
- riga 249 — `await page.waitForTimeout(50);`
- riga 269 — `await page.waitForTimeout(100);`
- riga 275 — `await page.waitForTimeout(50);`
- riga 301 — `await page.waitForTimeout(100);`
- riga 306 — `await page.waitForTimeout(50);`
- riga 343 — `await page.waitForTimeout(50);`
- riga 357 — `await page.waitForTimeout(100);`
- riga 385 — `await page.waitForTimeout(150);`

### `test_batch18.js` — 7
- riga 139 — `await page.waitForTimeout(700); // audio (500ms) + async cancel margin, well into the countdown`
- riga 159 — `await page.waitForTimeout(80);`
- riga 163 — `await page.waitForTimeout(50);`
- riga 181 — `await page.waitForTimeout(80);`
- riga 185 — `await page.waitForTimeout(50);`
- riga 206 — `await page.waitForTimeout(80);`
- riga 234 — `await page.waitForTimeout(80);`

### `test_batch19.js` — 12
- riga 53 — `await page.waitForTimeout(200);`
- riga 79 — `await page.waitForTimeout(800); // feedbackPauseMs (600) then auto-advance`
- riga 107 — `await page.waitForTimeout(100);`
- riga 132 — `await page.waitForTimeout(300); // 3-2-1 countdown`
- riga 154 — `await page.waitForTimeout(800); // feedbackPauseMs (600) then auto-advance`
- riga 217 — `await page.waitForTimeout(700);`
- riga 250 — `await page.waitForTimeout(300); // still mid-pause (feedbackPauseMs 600)`
- riga 253 — `await page.waitForTimeout(500); // past feedbackPauseMs, into the next question's timer`
- riga 258 — `if (revealShown) { await page.click('#sr-advance-btn'); await page.waitForTimeout(50); }`
- riga 280 — `await page.waitForTimeout(300);`
- riga 285 — `await page.waitForTimeout(30);`
- riga 329 — `await page.waitForTimeout(300);`

### `test_batch20.js` — 3
- riga 80 — `await page.waitForTimeout(50);`
- riga 97 — `await page.waitForTimeout(200);`
- riga 106 — `await page.waitForTimeout(30);`

### `test_dialogo_extra.js` — 2
- riga 107 — `await page.waitForTimeout(150);`
- riga 135 — `await page.waitForTimeout(50);`

### `test_new_features.js` — 6
- riga 192 — `await page.waitForTimeout(100);`
- riga 200 — `await page.waitForTimeout(100);`
- riga 221 — `await page.waitForTimeout(50);`
- riga 253 — `await page.waitForTimeout(50);`
- riga 259 — `await page.waitForTimeout(150);`
- riga 271 — `await page.waitForTimeout(300);`

### `test_voicecoach.js` — 6
- riga 100 — `await page.waitForTimeout(250);`
- riga 124 — `await page.waitForTimeout(100);`
- riga 138 — `await page.waitForTimeout(100);`
- riga 147 — `await page.waitForTimeout(150);`
- riga 156 — `await page.waitForTimeout(500); // let async Traguardo notes finish`
- riga 164 — `await page.waitForTimeout(150);`
