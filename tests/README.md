# Suite di regressione

28 file Playwright, uno per giro di lavoro/argomento (`test_batchN.js`) più
alcuni per aree specifiche (`test_dialogo_extra.js`, `test_new_features.js`,
`test_voicecoach.js`, `test_story_modules.js`, `test_fallbacks.js`,
`test_hidden_guard.js`). Insieme costituiscono la suite di regressione completa
citata da CLAUDE.md (regola 15): quando una modifica tocca codice condiviso
va lanciata tutta, quando resta dentro un modulo bastano i file di quel
modulo.

## Come lanciarla

Dalla cartella principale del repository, la prima volta:

```bash
npm install              # Playwright (versione fissata in package.json)
npm run setup:browser    # scarica il Chromium che Playwright userà
```

poi, per ogni giro:

```bash
npm test
```

`npm test` esegue `run_full_regression.sh`, che avvia da solo il server
statico sulla porta 8955, lancia i 28 file in ordine e ferma il server alla
fine. Se un server risponde già su quella porta, lo riusa invece di
avviarne un altro.

Ogni file produce anche il proprio `test_batchN.result.txt` con l'output
completo (ignorati da git). Per lanciare un solo file, con il server già
attivo (`npm run serve` in un altro terminale):

```bash
node tests/test_batch10.js
```

## Niente percorsi di macchina

Nessun file di test contiene percorsi assoluti: Playwright, l'indirizzo
dell'app e le cartelle di output arrivano tutti da `test-env.js`. Si
pilotano con variabili d'ambiente, tutte facoltative:

| variabile | a cosa serve |
|---|---|
| `APP_PORT` | porta del server statico (default `8955`) |
| `APP_URL` | indirizzo completo della pagina, se non è `localhost` |
| `PLAYWRIGHT_MODULE` | un'installazione di Playwright già presente sulla macchina, invece di quella in `node_modules` |
| `CHROMIUM_PATH` | binario del browser, quando Playwright non ha un Chromium proprio |
| `TEST_OUTPUT_DIR` | dove finiscono gli screenshot (default `tests/output/`) |

Esempio, su una macchina con Playwright installato globalmente e nessun
Chromium scaricato da Playwright:

```bash
PLAYWRIGHT_MODULE=/usr/lib/node_modules/playwright \
CHROMIUM_PATH=/usr/bin/chromium \
npm test
```

## Sottocartelle

Non fanno parte della suite lanciata da `run_full_regression.sh` — vedi il
README di ciascuna per cosa sono e perché sono state tenute:

- `tools/` — script di verifica visiva (screenshot). Scrivono in
  `tests/output/`.
- `debug/` — script diagnostici per bug ormai risolti, tenuti come riferimento.
- `legacy/` — test precedenti alla numerazione `test_batchN.js`, probabilmente superati.

## Punti fragili noti

`ATTESE-FISSE.md` elenca i punti in cui un test aspetta un numero di
millisecondi e subito dopo verifica qualcosa. Quando la CI segnala un rosso
intermittente, si guarda lì prima di sospettare una regressione dell'app.

## `tests/module-order.js` — perché esiste

I test devono aprire un modulo, e la mappa non lo lascia aprire finché i passi
precedenti non risultano completati. Ogni test si scriveva quindi a mano la
lista dei moduli da segnare come fatti: una fotografia dell'ordine del giorno
in cui il test era stato scritto. Al primo riordino vero (da 14 a 22 passi)
sono cadute quasi tutte insieme — 15 file su 28 — e nessuna diceva perché:
solo "timeout aspettando un modulo".

`module-order.js` calcola quelle liste da `CONFIG.moduleOrderDefault`, che è
l'unico posto che decide la sequenza: `stepIds()` (tutti i passi in ordine),
`stepsBefore(id)` (cosa completare per aprirne uno), `gradeOf(id)` (su quale
grado lavora, per i test che iniettano contenuto), `allSteps()`. Legge
`index.html` come testo, quindi le liste sono disponibili prima ancora di
aprire il browser. Un riordino futuro non tocca più nessun test.

## `test_hidden_guard.js` — perché è nella suite

Un elemento con l'attributo `hidden` che resta visibile perché una regola
CSS gli dà un `display` proprio: è successo cinque volte in questo progetto
(`.btn`, `.header-actions`, `header.app-header`, le schermate di Speed Round
e Flash Card). Non è sfortuna — `[hidden]{display:none}` arriva dal foglio
predefinito del browser, il livello più debole della cascata, e qualunque
regola d'autore lo batte.

`index.html` ha ora una guardia unica in cima al foglio di stile
(`[hidden]:not([hidden="until-found"]){display:none!important}`), che copre
anche le classi future. Questo test non si limita a controllare che quella
riga esista: prende ogni regola del foglio che imposta un `display`,
costruisce un elemento che quella regola colpisce, gli mette `hidden` e
verifica che sparisca davvero. Una regola nuova scritta in modo da tornare a
rompere la guardia (per esempio con un `!important` su un `#id`) fa fallire
la CI il giorno in cui viene scritta, non il giorno in cui qualcuno apre
quella schermata.

## `test_fallbacks.js` — perché è nella suite

Non prova un modulo: verifica che le copie di sicurezza dentro `index.html`
(`window.FALLBACK_*`) coincidano con i file in `data/`. Se divergono, il sito
su GitHub Pages (che carica i file veri) e l'artifact (che ricade sulle copie)
mostrano contenuti diversi — è già successo, e nessun test se n'era accorto
perché i test girano solo dove i file veri esistono. Sta nella suite e non fra
gli strumenti proprio perché la divergenza si ripresenta ogni volta che si
tocca un file in `data/`, cioè spesso.

## File di servizio

- `test-env.js` — Playwright, indirizzo dell'app e percorsi, condivisi da
  tutti i file di test.
- `serve.js` — server statico senza dipendenze, usato da `npm run serve` e
  da `run_full_regression.sh`.
- `quiz-driver.js` — pilotaggio condiviso dei moduli a scelta multipla (Speed
  Round, Quick Match): sceglie le risposte dai dati dell'episodio invece che
  dalla posizione dei pulsanti, e avanza aspettando cambiamenti di stato
  invece di tempi fissi.
