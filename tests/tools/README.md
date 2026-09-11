# Strumenti di verifica visiva

Script Playwright che aprono l'app e salvano screenshot — usati durante il
lavoro su temi/layout/config panel, non fanno asserzioni (non sono test in
senso stretto). Utili come punto di partenza per una verifica visiva futura
(nuovo tema, riordino della mappa, revisione di design), da adattare al
bisogno del momento piuttosto che da lanciare così come sono.

## `apri-modulo.js`

Apre un modulo come lo vedrebbe uno studente arrivato fin lì (i passi
precedenti vengono segnati completati da soli) e ne stampa lo stato:
titolo e categoria mostrati, elementi che escono dai bordi, segnaposto
rimasti grezzi, errori JS. Con `--shot=nome.png` salva anche lo screenshot.

```
node tests/tools/apri-modulo.js whyWeSayIt
node tests/tools/apri-modulo.js whyWeSayIt --larghezza=360
node tests/tools/apri-modulo.js dialogoContinuo --shot=dialogo.png
```

Senza argomenti elenca i passi disponibili nell'ordine della mappa.

Perché esiste: guardare la schermata trova cose che nessun test vede. In un
solo giro ha fatto emergere un badge fermo al nome di un modulo che non
esiste più, un sottotitolo sbagliato, e — con `--larghezza=360`, cioè la
larghezza di gran parte degli Android — un pulsante che usciva dallo
schermo. Prima si riscriveva lo stesso script usa-e-getta ogni volta.

---

## `attendi-ci.sh`

Il **parente** di `attendi.sh`, non il suo gemello: stessa idea — due
rilevatori, e uscite che dicono *quale* guasto — meccanismo diverso. Uno legge
un file che cresce, l'altro interroga un indirizzo che risponde. Restano
separati per la stessa ragione delle due varianti dello Sblocco Sequenziale
(regola 30), e **si citano a vicenda in testa**.

```
tests/tools/attendi-ci.sh <file-workflow> <commit> [secondi-max]
tests/tools/attendi-ci.sh regressione.yml 728a314
```

**La corsa non si indovina: si identifica.** L'API filtra per *file del
workflow* + *commit* (`/actions/workflows/<file>/runs?head_sha=<sha>`), e il
risultato è **una** corsa — non «la più recente fra due». ⚠️ Filtrare per
**nome** non funziona: misurato l'11 settembre, lo stesso workflow si chiama
`pages-build-deployment` nell'elenco dei workflow e **`pages build and
deployment`** nell'elenco delle corse.

| Uscita | Significa |
|---|---|
| **0** | completata con `success` |
| **1** | completata male — e dice **quale**: `ROSSA` (vai a leggere i job) oppure `ANNULLATA` (*cerca un pulsante premuto, non un difetto*) |
| **2** | tetto scaduto, la corsa è **viva** e non finita |
| **3** | **la corsa non esiste**: il push non ha fatto partire la CI, o il commit è sbagliato |
| **4** | **non riesco a vedere**: l'API non risponde, o risponde una cosa che non so leggere |
| **64** | argomenti sbagliati |

Il **3** e il **4** sono separati apposta: *«il push non ha fatto partire la CI»*
e *«io non vedo GitHub»* sono due ricerche diverse.

**Variabili:** `ATTENDI_CI_REPO` (default dal remoto), `ATTENDI_CI_FETCH` (il
comando che interroga — esiste perché il test non chiami la rete),
`ATTENDI_CI_INTERVALLO` (30), `ATTENDI_CI_ASSENTE` (300), `ATTENDI_CI_CIECO` (5
risposte illeggibili di seguito).

⚠️ **Perché esiste solo dall'11 settembre, e va saputo:** il tetto e il
rilevatore di silenzio erano già stati risolti in `attendi.sh` il 10. **Non sono
stati riusati**, e l'attesa sulla CI è stata riscritta a mano tre volte con tre
difetti diversi — l'ultimo dei quali era *esattamente* la forma già corretta.
*Non era una forma nuova: era una forma risolta e non riusata, e costa di più,
perché il lavoro era già fatto.*

---

## `attendi.sh`

Non è uno strumento di verifica visiva come gli altri di questa cartella: è
**l'unica forma giusta di un'attesa**, scritta una volta sola.

```
tests/tools/attendi.sh <file-di-log> <marcatore-ok> <marcatore-ko> [secondi-max]
tests/tools/attendi.sh /tmp/suite.log "ALL FILES GREEN" "SOME FILES FAILED"
```

Variabili d'ambiente: `ATTENDI_INTERVALLO` (ogni quanti secondi guarda il log,
default 15) e `ATTENDI_SILENZIO` (dopo quanti secondi di log fermo dichiara
morto il lavoro, default 600).

**Si arrende da sola, e dice quale dei due guasti ha davanti.** Sono due, e
serve un rilevatore per ciascuno:

| Il lavoro | Cosa fa il log | Chi se ne accorge |
|---|---|---|
| è **vivo** ma non finisce | continua a crescere | solo il **tetto** di tempo |
| è **morto** | smette di crescere | solo il **silenzio** |

Un'attesa col solo tetto, davanti a un lavoro morto, dice «ho aspettato
troppo»: non ha aspettato troppo, **ha aspettato un cadavere**. Un'attesa col
solo silenzio, davanti a un lavoro vivo che non finisce, non parla mai.

| Uscita | Significa |
|---|---|
| **0** | trovato il marcatore di successo |
| **1** | trovato il marcatore di fallimento |
| **2** | tetto scaduto, ma il log cresce ancora: lavoro **vivo** e non finito |
| **3** | il log è fermo, o non è mai stato scritto: lavoro **morto** o mai partito |
| **64** | argomenti passati male (`EX_USAGE`): l'attesa non è nemmeno partita |

Il **3** ha due frasi distinte, perché portano a due ricerche diverse: «ha
scritto e poi ha smesso — cerca il processo» e «non ha mai scritto niente —
controlla il percorso del log». Il secondo è il guasto più stupido e più
frequente, e prima produceva novanta minuti di attesa su un file che nessuno
avrebbe mai scritto.

**Da dove viene il 600.** Misurato il 2026-09-10 sui 46 file della suite:
`run_full_regression.sh` scrive sul log `=== nome.js ===` *prima* di lanciare un
file e il `tail -3` *dopo*, quindi il silenzio massimo legittimo non è una
stima — è la forma dello script, cioè la durata del file più lento. Quel giorno
**192 s** (`test_avviso_microfono`), su **1019 s** di suite intera. La soglia sta
a 3,1× il file più lento. Se un giorno un file supera i 600 s, questa attesa
dichiarerà morto un lavoro vivo *una volta*, e lo dirà in modo riconoscibile; i
tempi per file si rimisurano dagli mtime dei `tests/*.result.txt` dell'ultima
corsa.

Perché esiste (CLAUDE.md regola 37): un'attesa agganciata al **nome di un
processo** trova sé stessa e non finisce mai (`pgrep -f X` cerca `X` anche
nella propria riga di comando), e un'attesa che chiude con un `grep` dei
fallimenti **esce con 1 proprio quando è andato tutto bene**. Sono due difetti
che non somigliano a errori: somigliano a risultati. Questo script si aggancia
a ciò che il lavoro **scrive** quando finisce, mai a ciò che il lavoro **è**
mentre gira.
