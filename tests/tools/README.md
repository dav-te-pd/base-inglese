# Gli strumenti — `tests/tools/`

**Ventisei script che NON sono test: non fanno asserzioni e non entrano nella
suite.** Si lanciano a mano quando servono, e ognuno risponde a una domanda
sola.

⚠️ **Il conto non si scrive qui, si conta:** `ls tests/tools/*.js tests/tools/*.sh | wc -l`.
*Fino al 2026-09-24 questo file ne descriveva **tre su ventisei** e si
intitolava «Strumenti di verifica visiva» — che era vero ad agosto, quando qui
c'erano solo gli screenshot.*

**Ognuno porta in testa cosa fa:** `head -5 tests/tools/<nome>`. Qui c'è a cosa
servono, raggruppati per domanda.

---

## ① Le guardie — girano nella suite o nella CI

| Strumento | A cosa risponde |
|---|---|
| `conta-asserzioni.js` | *un verde prova ancora quello che provava ieri?* Confronta con `tests/BASELINE-ASSERZIONI.txt`: il numero può salire, non calare. Con `--scrivi` riscrive il baseline |
| `versione-salita.js` | *il `?v=` è salito?* La CI lo lancia **prima** della suite: un push che tocca `index.html`, `app/*.js` o `stile/*.css` senza alzarlo viene fermato |
| `conta-attese.js` | *il censimento delle attese a tempo dice ancora il vero?* Tiene onesto `tests/ATTESE-FISSE.md` |

## ② Le attese — si usano invece di riscriverle a mano

| Strumento | A cosa risponde |
|---|---|
| `attendi.sh` | *la suite ha finito?* Si aggancia alla riga conclusiva del log, mai al nome del processo. Esce **2** «vivo e non finisce», **3** «morto o mai partito» |
| `attendi-ci.sh` | *la corsa CI di QUESTO commit com'è andata?* Il parente del primo: identifica la corsa per file del workflow + commit **intero**. Esce 0 verde · 1 finita male · 2 viva · 3 non esiste · 4 non vedo l'API |

## ③ Scrivere i dati

| Strumento | A cosa risponde |
|---|---|
| `trascrivi.js` | *i quattro JSON dell'edizione da `docs/inglese/it/`.* Si ferma invece di scrivere se i conti dichiarati non tornano o se una riga ha le colonne sbagliate. Con `--controlla` dice solo cosa cambierebbe |

## ④ Guardare l'app

| Strumento | A cosa risponde |
|---|---|
| `apri-modulo.js` | *com'è un modulo per uno studente arrivato fin lì?* Segna completati i passi precedenti, stampa titolo, elementi fuori dai bordi, segnaposto grezzi, errori JS. `--shot=nome.png` per lo screenshot |
| `screenshot_blocco_ascolto.js` | il Blocco Ascolto in **ogni** modulo che lo mostra, in un giro solo |
| `screenshot_themes.js` · `screenshot_batch3.js` · `screenshot_final.js` · `screenshot_final2.js` · `screenshot_warn_only.js` | istantanee di agosto, da adattare al bisogno del momento — **non** da lanciare così come sono |

## ⑤ I baseline che si riscrivono guidando l'app

| Strumento | A cosa risponde |
|---|---|
| `scrivi-baseline-avvio.js` | riscrive `tests/BASELINE-AVVIO.txt` |
| `scrivi-baseline-listener.js` | riscrive `tests/BASELINE-LISTENER.txt` |

## ⑥ Le misure dello spacchettamento

*Nate per il passo 22 — portare `index.html` da un file solo a ventitré.
**Restano utili quando nasce un file nuovo sotto `app/`**, e non prima.*

| Strumento | A cosa risponde |
|---|---|
| `censimento-pezzi.js` | *quanto manca al catalogo dei pezzi?* È il comando della regola 46 |
| `dipendenze.js` | il grafo vero fra i file di `app/`: chi nomina cosa di chi, **e quando** |
| `buchi.js` | i buchi nei due versi, per un file appena estratto o toccato |
| `misura-strato.js` | quante righe è uno strato **prima** di estrarlo, e cosa nomina che non gli appartiene |
| `misura-chiusura.js` | da un nucleo, fin dove bisogna allargare perché le dipendenze siano tutte fuori |
| `misura-chiamanti.js` | quali pezzi sono nominati da **più** regioni-modulo, e da quante |
| `misura-avanti.js` | quante funzioni interne a un modulo sono chiamate da codice generico |
| `misura-costruiti.js` | ⚠️ i legami costruiti a runtime — una chiave o un percorso che **non esiste mai per intero** nel sorgente, quindi nessuna ricerca lo trova |
| `misura-finestra-boot.js` | quanto dura la finestra fra «la pagina c'è» e «i testi sono arrivati» |
| `misura-finestra-apertura.js` | quanto un modulo fa aspettare prima di essere usabile |
| `misura-storycards.js` | storyCards: una forma o due? |
