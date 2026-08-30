# base-inglese

App di pratica della pronuncia inglese. L'utente attraversa un **episodio**:
una sequenza di moduli (ascolto e ripetizione, quiz, flash card, dialogo,
verifica finale) che parte da una schermata di personalizzazione, dove sceglie
i nomi e i luoghi della storia, e finisce con un riepilogo. I progressi sono
salvati per utente, nel browser.

Oggi c'è un episodio (`A1 · Episodio 1 · inglese`) con 14 moduli, e cinque temi
grafici selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura).

## Come si apre in locale

L'app è una pagina statica, ma va servita via HTTP: legge i suoi contenuti da
`data/*.json` con `fetch`, che da `file://` viene bloccato dal browser.

```bash
npm run serve     # → http://localhost:8955/index.html
```

Non servono dipendenze per questo: il server è Node puro
(`tests/serve.js`). Va bene qualunque altro server statico sulla stessa
cartella — `python3 -m http.server 8955` fa lo stesso lavoro.

## Com'è strutturato

```
index.html      tutta l'applicazione: HTML, CSS e JS in un unico file,
                nessuna dipendenza esterna oltre ai Google Fonts
data/           i contenuti, letti a runtime (mai scritti nel codice)
docs/           censimento dei moduli e screenshot storici
tests/          la suite di regressione Playwright
CLAUDE.md       le regole permanenti del progetto — da leggere prima di
                metterci mano
```

Dentro `data/`:

| file | cosa contiene |
|---|---|
| `a1-episodio1-inglese.json` | l'episodio: `dialogue` e `vocabulary`, condivisi fra tutti i moduli |
| `istruzioni-moduli.json` | i testi "Guarda come si fa" e i promemoria del pannello Help, per tipo di modulo |
| `messaggi-feedback.json` | i messaggi di esito mostrati all'utente |

`index.html` tiene una copia di sicurezza di questi contenuti al suo interno,
usata **solo** se il `fetch` fallisce (hosting che non serve i JSON). La
sorgente da modificare resta sempre il file in `data/`.

I valori regolabili — soglie, tempi, liste, percentuali — stanno tutti in
`window.APP_CONFIG`, in cima a `index.html`. Non vanno sparsi nel codice.

## I test

25 file Playwright, uno per giro di lavoro o argomento. Vanno lanciati tutti
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

Due indirizzi, che servono a cose diverse:

| dove | indirizzo | come si aggiorna |
|---|---|---|
| **GitHub Pages** | <https://dav-te-pd.github.io/base-inglese/> | da solo, a ogni push su `main` |
| **Artifact claude.ai** | <https://claude.ai/code/artifact/206c1b06-237e-4d72-a46d-4969dbd5e621> | a mano, ripubblicando **lo stesso** artifact (`CLAUDE.md`, regola 6) |

**Non sono la stessa cosa.** Su Pages i file `data/*.json` esistono, quindi
l'app li carica: è la sua forma completa. L'artifact è una pagina singola —
il `fetch` dei dati fallisce e `index.html` ricade sulle copie di sicurezza
che tiene al proprio interno. Finché quelle copie non coincidono con i file
in `data/`, i due indirizzi mostrano contenuti diversi:

```bash
node tests/tools/check-fallbacks.js   # con il server attivo
```

verifica che coincidano, ed esce con codice 1 elencando le sezioni che
divergono.

## Prima di modificare

`CLAUDE.md` contiene le regole permanenti del progetto: modifiche additive,
niente colori fissi fuori dal sistema di temi, niente valori fissi fuori da
`APP_CONFIG`, niente contenuto didattico dentro il codice, completamento di un
modulo solo su azione esplicita dell'utente. Vanno lette prima di toccare
`index.html`.
