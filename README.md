# base-inglese

App di pratica della pronuncia inglese. L'utente attraversa un **episodio**:
una sequenza di moduli (ascolto e ripetizione, quiz, flash card, dialogo,
verifica finale) che parte da una schermata di personalizzazione, dove sceglie
i nomi e i luoghi della storia, e finisce con un riepilogo. I progressi sono
salvati per utente, nel browser.

Oggi c'è un episodio (`A1 · Episodio 1 · inglese`) di 22 passi su 15 moduli
distinti — alcuni compaiono più volte, su gradi diversi — e cinque temi
grafici selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura).

## Come si apre in locale

L'app è una pagina statica, ma va servita via HTTP: legge i suoi contenuti da
i JSON sotto `data/` con `fetch`, che da `file://` viene bloccato dal browser.

```bash
npm run serve     # → http://localhost:8955/index.html
```

Non servono dipendenze per questo: il server è Node puro
(`tests/serve.js`). Va bene qualunque altro server statico sulla stessa
cartella — `python3 -m http.server 8955` fa lo stesso lavoro.

## Strumenti

- `node tests/tools/apri-modulo.js <idPasso>` — apre un modulo nell'app e ne
  stampa lo stato (bordi, segnaposto, errori), con screenshot facoltativo.
  Senza argomenti elenca i passi disponibili.

## Com'è strutturato

```
index.html      tutta l'applicazione: HTML, CSS e JS in un unico file,
                nessuna dipendenza esterna oltre ai Google Fonts
data/{lingua}/  i contenuti dell'edizione, letti a runtime (mai nel codice)
docs/{lingua}/  i sorgenti markdown di quell'edizione (episodi, struttura)
docs/           quello che descrive il codice: censimento, validazione,
                registro delle correzioni, screenshot storici
tests/          la suite di regressione Playwright
CLAUDE.md       le regole permanenti del progetto — da leggere prima di
                metterci mano
```

## Le cartelle per lingua

`data/{lingua}/` e `docs/{lingua}/`, dove *lingua* è quella dello **studente**,
non quella che impara. Oggi c'è una sola edizione: `it`, italiano → inglese.

**Un'edizione non è una traduzione.** La griglia grammaticale appartiene alla
coppia di lingue: *"I have ten years"* è una trappola italiana e non tedesca.
Un'edizione nuova nasce copiando la cartella e sostituendo i contenuti, e una
correzione fatta in `it/` **non** arriva nelle altre — se serve ovunque, si fa
ovunque, di proposito.

Dentro `data/it/`:

| file | cosa contiene |
|---|---|
| `a1-episodio1-inglese.json` | l'episodio, organizzato in gradi: `levels.A` parole, `levels.B` chunk, `levels.C` frasi, `levels.D` battute |
| `istruzioni-moduli.json` | i testi "Guarda come si fa" e i promemoria del pannello Help, per tipo di modulo |
| `messaggi-feedback.json` | i messaggi di esito mostrati all'utente |

L'app li carica con `fetch` e **non ne tiene nessuna copia dentro
`index.html`**: se un file non arriva, il caricamento fallisce e lo studente
vede la schermata d'errore, con "Riprova" e "Torna alla mappa". Un percorso
sbagliato si vede subito, invece di essere assorbito in silenzio da una copia
interna.

I valori regolabili — soglie, tempi, liste, percentuali — stanno tutti in
`window.APP_CONFIG`, in cima a `index.html`. Non vanno sparsi nel codice.

## I test

32 file Playwright, uno per giro di lavoro o argomento. Vanno lanciati tutti
quando una modifica tocca codice condiviso; se resta dentro un modulo bastano i
file di quel modulo (`CLAUDE.md`, regola 15).

```bash
npm install              # Playwright
npm run setup:browser    # Chromium per Playwright (una volta sola)
npm test                 # avvia il server, lancia la suite, lo ferma
```

Un solo file: `node tests/test_batch10.js` (con il server già attivo).

Nessun percorso di macchina è scritto dentro i test: Playwright, l'indirizzo
dell'app e le cartelle di output arrivano tutti da `tests/test-env.js`, che si
può pilotare con `APP_PORT`, `APP_URL`, `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`,
`TEST_OUTPUT_DIR`. Dettagli e sottocartelle (`tools/`, `debug/`, `legacy/`) in
[`tests/README.md`](tests/README.md).

## Dov'è pubblicata

Un indirizzo solo: <https://dav-te-pd.github.io/base-inglese/>, che si
aggiorna da sé a ogni push su `main`. Commit, push, e basta.

*C'era anche un artifact su claude.ai — una pagina singola, dove il `fetch`
dei dati fallisce sempre. Per farla funzionare, `index.html` teneva una copia
inline dei tre file di dati, da rigenerare a mano a ogni modifica e da
sorvegliare con un test apposta. Costava tre cose da mantenere e ne nascondeva
una peggiore: quella copia assorbiva in silenzio anche i guasti veri, quindi un
percorso sbagliato su Pages non si sarebbe visto. Nel settembre 2026 sono
spariti insieme: l'artifact, la copia, lo strumento e il test.*

## Prima di modificare

`CLAUDE.md` contiene le regole permanenti del progetto: modifiche additive,
niente colori fissi fuori dal sistema di temi, niente valori fissi fuori da
`APP_CONFIG`, niente contenuto didattico dentro il codice, completamento di un
modulo solo su azione esplicita dell'utente. Vanno lette prima di toccare
`index.html`.
