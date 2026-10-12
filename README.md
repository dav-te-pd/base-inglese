# base-inglese

App di pratica delle lingue — la pronuncia prima di tutto. L'utente attraversa
un **episodio**: una sequenza di moduli (ascolto e ripetizione, quiz, flash
card, dialogo) che parte da una schermata di personalizzazione, dove sceglie i
nomi e i luoghi della storia, e finisce con un riepilogo. I progressi sono
salvati per utente, nel browser.

**Al 2026-10-12 ci sono due edizioni** — *Inglese per italiani* e *Spagnolo per
italiani* — **con due episodi ciascuna**, `gate` e `aircraft-door`, e cinque
temi grafici (Viaggio, Notte, Mediterraneo, Moderno, Natura). L'edizione si
sceglie dal Pannello Admin (`?config` nell'indirizzo, gruppo `edizione`).

*Gli episodi si chiamano col loro **id**, descrittivo e congelato, non con un
numero o un livello: il livello è un'etichetta sul tratto di sequenza in cui
l'episodio sta, non una proprietà sua (`CLAUDE.md`, regola 4). Fino al
2026-09-29 qui c'era «un episodio (`A1 · Episodio 1 · inglese`) di 22 passi
su 15 moduli»: vero quel giorno, e scritto nel modo che la regola 4 vieta.*

⚠️ **I conti non si scrivono qui, si contano** — un numero in questo file
invecchia senza che nessun test lo veda:

```bash
grep -c '<script src="app/' index.html  # i file dell'app caricati dalla pagina
ls tests/test_*.js | wc -l              # i file della suite
node -e "const s=require('./data/inglese/it/inglese-it-struttura-corso.json'); \
  for (const k in s.sequences) console.log(k, s.sequences[k].length, 'passi')"
```

## Come si apre in locale

L'app è una pagina statica, ma va servita via HTTP: legge i suoi contenuti dai
JSON sotto `data/` con `fetch`, che da `file://` viene bloccato dal browser.

```bash
npm run serve     # → http://localhost:8955/index.html
```

Non servono dipendenze per questo: il server è Node puro
(`tests/serve.js`). Va bene qualunque altro server statico sulla stessa
cartella — `python3 -m http.server 8955` fa lo stesso lavoro.

## Com'è strutturato

```
index.html      il markup e UNA riga di JavaScript: window.BI.boot()
app/            un file per strato o per modulo, caricati da tag <script>;
                i valori regolabili stanno tutti in app/config.js (APP_CONFIG)
stile/          i fogli di stile, uno per area
                nessun passo di build, nessuna dipendenza esterna
                oltre ai Google Fonts

data/{lingua-che-si-impara}/{lingua-studente}/
                i contenuti di un'edizione, letti a runtime (mai nel codice)
data/condivisi/{lingua-studente}/
                i testi dell'interfaccia: dipendono da chi studia, non da
                cosa si studia, quindi valgono per tutte le sue edizioni
data/edizioni.json
                l'elenco delle edizioni, per il menu del Pannello Admin

docs/{lingua-che-si-impara}/{lingua-studente}/
                i sorgenti markdown di quell'edizione — episodi, struttura,
                tabelle di personalizzazione
docs/condivisi/{lingua-studente}/
                i sorgenti dei testi dell'interfaccia
docs/metodo/    ciò che vale per tutte le edizioni: FATTI-APP.md e i
                modelli -VUOTO da cui nascono i file nuovi
docs/           quello che descrive il codice e governa il lavoro:
                decisioni, correzioni, catalogo dei pezzi, sicurezza
docs/archivio/  fotografie datate — NON descrivono l'app di oggi
                e non si aggiornano (ognuna lo dice in testa)

nuovi/          la cartella di CONSEGNA: i file in arrivo, prima di essere
                trascritti. Con il solo LEGGIMI.md vuol dire «niente in attesa»
tests/          la suite di regressione Playwright, e in tests/tools/ gli
                strumenti
CLAUDE.md       le regole permanenti del progetto — da leggere prima di
                metterci mano
```

## Le edizioni

Un'edizione è una **coppia di lingue**: quella che si impara e quella dello
studente, in quest'ordine nel percorso — `inglese/it`, `spagnolo/it`. Ogni
file porta la coppia anche nel nome (`inglese-it-gate.json`), perché un file
esce dal repository e lì il percorso si perde.

**Un'edizione non è una traduzione.** La griglia grammaticale appartiene alla
coppia: *"I have ten years"* è una trappola italiana e non tedesca. Un'edizione
nuova nasce copiando la cartella e sostituendo i contenuti, e una correzione
fatta in una **non** arriva nelle altre — se serve ovunque, si fa ovunque, di
proposito.

Dentro `data/inglese/it/` (e uguale per ogni edizione):

| file | cosa contiene |
|---|---|
| `inglese-it-struttura-corso.json` | la struttura del corso: gradi e loro nomi, categorie, sequenze, elenco degli episodi, lingue del parlato, nomi a schermo. L'app la carica **prima di disegnare qualunque schermata** |
| `inglese-it-{id}.json` | un episodio, organizzato in gradi: `levels.A` parole, `levels.B` espressioni, `levels.C` frasi, `levels.D` battute |
| `inglese-it-tabelle-personalizzazione.json` | nomi, città, età fra cui lo studente sceglie |
| `inglese-it-migrazioni-personalizzazione.json` | da id salvato a id di oggi, perché una scelta salvata non sparisca a una rinomina. Esiste anche vuoto (`"slot": {}`): un file vuoto **dice** «nessun id è mai cambiato» |

I JSON non si scrivono a mano: li scrive `tests/tools/trascrivi.js` dai
markdown gemelli sotto `docs/` (`CLAUDE.md`, regola 26).

L'app li carica con `fetch` e **non ne tiene nessuna copia dentro
`index.html`**: se un file non arriva, il caricamento fallisce e lo studente
vede la schermata d'errore, con "Riprova" e "Torna alla mappa". Un percorso
sbagliato si vede subito, invece di essere assorbito in silenzio da una copia
interna.

## I test

Una suite Playwright, un file per argomento. Vanno lanciati tutti quando una
modifica tocca codice condiviso; se resta dentro un modulo bastano i file di
quel modulo (`CLAUDE.md`, regola 15).

```bash
npm install              # Playwright
npm run setup:browser    # Chromium per Playwright (una volta sola)
npm test                 # avvia il server, lancia la suite, lo ferma
```

Un solo file: `node tests/test_batch10.js` (con il server già attivo).

Nessun percorso di macchina è scritto dentro i test: Playwright, l'indirizzo
dell'app e le cartelle di output arrivano tutti da `tests/test-env.js`, che si
può pilotare con `APP_PORT`, `APP_URL`, `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`,
`TEST_OUTPUT_DIR`. Cosa protegge ogni file sta in
[`tests/README.md`](tests/README.md); gli strumenti, divisi per domanda, in
[`tests/tools/README.md`](tests/tools/README.md).

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
modulo solo su azione esplicita dell'utente. Vanno lette prima di toccare il
codice — e prima di scegliere cosa fare, `docs/decisioni-stato.md`.
