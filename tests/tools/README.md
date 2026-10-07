# Gli strumenti — `tests/tools/`

**Script che NON sono test: non fanno asserzioni e non entrano nella
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
| `trascrivi.js` | *i JSON di **ogni edizione** da `docs/{lingua}/{studente}/`.* ⚠️ **Le edizioni le SCOPRE, non le elenca** (dal 2026-09-24): è un'edizione ogni cartella `docs/{lingua}/{studente}/` che contiene il suo `{lingua}-{studente}-struttura-corso.md` — *la cartella è il criterio, non i nomi (regola 4), e un elenco dentro uno strumento smette di essere vero al primo contenuto nuovo.* **Zero edizioni trovate è un ERRORE con uscita 1**, non un successo silenzioso. Si ferma invece di scrivere se i conti dichiarati non tornano o se una riga ha le colonne sbagliate, **e legge tutte le edizioni prima di scriverne una**. Con `--controlla` dice solo cosa cambierebbe ⚠️ **E DAL 2026-09-28 (passo C) SCRIVE ANCHE I DUE FILE CONDIVISI**, da `docs/condivisi/{studente}/`: `istruzioni-moduli.json` e `messaggi-feedback.json`. *Non passano da `edizioni()` perché di un'edizione non sono — dipendono dalla lingua dello STUDENTE, non da quella insegnata (regola 8).* Il criterio è lo stesso in forma: **è una lingua-studente ogni cartella sotto `docs/condivisi/` che contiene il suo `{studente}-istruzioni-moduli.md`**, e zero cartelle trovate è un ERRORE con uscita 1. ⚠️ **E si esegue solo se LANCIATO, non se richiesto** (`require.main === module`): `tests/test_testi_dal_markdown.js` usa le sue funzioni per rigenerare e confrontare, e senza quella riga si riscriverebbe da sé la risposta da verificare. ⚠️ **QUANTO E' RIGIDO, PER UN FILE EPISODIO — arrivato qui dal modello `-VUOTO` il 2026-09-28, perché lì veniva copiato dentro ogni episodio nuovo.** ⚠️ **Cosa è libero e cosa no — CORRETTO il 2026-09-30, e qui c'era scritto il contrario:** «titoli, numeri di sezione e nomi delle colonne non sono un'interfaccia». **I titoli e i numeri di sezione LO SONO:** `tabellaSotto()` cerca ogni titolo **alla lettera** (`## 5 — LE SKILL`, `### Grado D — le battute`, `## 7 — GLI SLOT`…), e un titolo scritto diverso ferma il trascrittore. **Liberi davvero sono i NOMI DELLE COLONNE** — si leggono per posizione, quindi `es` al posto di `en` va bene — **e il contenuto**: quante righe, quali parole, quali skill. Il NUMERO di colonne conta: se cambia, `colonne()` ferma tutto invece di leggere storto. *La frase falsa l'ha trovata la prima edizione nuova (spagnolo, `gate`): chi scrive un file episodio da zero legge questa riga per sapere cosa può cambiare.* *Ma non vale per tutti gli episodi: di `gate`, `tests/test_story_modules.js` confronta anche le tabelle dei gradi col JSON cella per cella, e lì l'ordine delle colonne È un'interfaccia.* ⚠️ **Il riquadro dei numeri attesi invece è rigido, e in un modo che va saputo prima di scriverlo** (`tests/test_episodio2.js`): si trova cercando la stringa che apre la sezione 2 e ne prende la **prima** occorrenza nel file; finisce alla **prima riga vuota**; si legge ricucendo le righe con uno spazio e togliendo `*` e `>`, **ma non la barra verticale**; si estrae con sei espressioni — `N voci in A`, `N in B`, `N in C`, `N battute in D`, `N skill`, `N slot`, **ognuna col suo nome accanto, mai per posizione**. ⚠️ **Per questo il riquadro è l'unica cosa non tabellare di un file episodio, e non è una svista:** il markdown vuole una riga vuota prima di una tabella e il parser si ferma alla prima riga vuota — *una tabella lì darebbe un riquadro vuoto e l'errore «numero atteso non trovato».* E per la stessa ragione **quella stringa non va citata altrove nel file**: il parser prenderebbe la citazione invece del riquadro, e i sei numeri uscirebbero sbagliati senza che niente si lamenti. ⚠️ **DAL 2026-09-30 LE CHIAVI SONO RUOLI, NON LINGUE:** ogni voce di un episodio porta `target` (la lingua che si impara) e `native` (quella dello studente), e ogni riga del magazzino lo stesso — *prima erano `english`/`italian` e `en`/`it`, e in un corso di spagnolo «Soy de…» sarebbe finito sotto `english`.* Il trascrittore le scrive **per posizione**, quindi le intestazioni del markdown restano libere. ⚠️ **E DALLO STESSO GIORNO SI FERMA INVECE DI SCRIVERE UN VUOTO:** un titolo cercato che compare **due volte** nel file (una citazione nella prosa) e una tabella **obbligatoria senza righe** sono errori con le righe indicate. *Il caso vero: una citazione di `## 5 — LE SEQUENZE DEI MODULI` nella §1 ha prodotto `sequences: {}` in silenzio.* **Un titolo cercato si scrive una volta sola: nella prosa si cita senza il `## ` davanti.** **Dal 2026-10-01 legge anche la §9 `## 9 — I NOMI A SCHERMO`** di ogni struttura (righe `target`, `native`, `corso`, tutte e tre obbligatorie) e la scrive in `nomiASchermo`; **e l'etichetta del riquadro «Un consiglio» non la scrive più lui**: è la cella `condivisi.etichettaConsiglio` della §6 dei testi condivisi, e senza quella cella si ferma. ⚠️ **Dal 2026-10-01 si ferma anche su un grado troppo piccolo per la scelta multipla** (`bacinoCorto`): ogni grado che un passo di Match o di Speed Match legge deve avere almeno `CONFIG.sceltaMultipla.distrattori + 1` voci. **Il numero e i moduli li legge dall'app** (`sceltaMultipla()`: `app/config.js` eseguito in un contesto finto, e i file che chiamano `buildMultipleChoiceOptions`), e se ne trova zero si ferma. *Non si aggiusta da solo: si aggiunge una voce a mano.* **Dal 2026-10-02 scrive anche `data/edizioni.json`** (`elencoEdizioni`): l'elenco delle edizioni che ha scoperto, ognuna col nome della riga `corso` della §9. Lo legge il menu dell'edizione nel Pannello Admin — *il browser non sa elencare le cartelle di un sito, lo strumento sì.* ⚠️ **Dal 2026-10-06 una sezione di un file EPISODIO con due tabelle lo ferma** (`unaSola`): i file episodio portano soli dati, quindi una seconda tabella è sempre un errore. *La struttura e i file condivisi no: spiegano, e la §9 della struttura ha davvero una tabella di spiegazione sotto i dati.* ⚠️ **Dal 2026-10-07 legge la colonna `non con`** (ultima nei gradi A, B, C: colonne D 5 · C 5 · B 6 · A 6) e la scrive in `nonCon` solo sulle voci che hanno esclusioni. **Si ferma** su una coppia scritta in un verso solo, su un id che nel grado non c'è e su una voce che esclude sé stessa (`controllaNonCon`, su ogni file, modello compreso); e il **bacino si misura per voce**, `voci − 1 − esclusi`, solo sugli episodi veri. *Non ripara niente: una coppia asimmetrica è una dimenticanza, e la corregge chi l'ha scritta.* |

## ④ Guardare l'app

| Strumento | A cosa risponde |
|---|---|
| `apri-modulo.js` | *com'è un modulo per uno studente arrivato fin lì?* Segna completati i passi precedenti, stampa titolo, elementi fuori dai bordi, segnaposto grezzi, errori JS. `--shot=nome.png` per lo screenshot |
| `screenshot_blocco_ascolto.js` | il Blocco Ascolto in **ogni** modulo che lo mostra, in un giro solo |

⚠️ **QUI C'ERANO ALTRE CINQUE ISTANTANEE, E SONO STATE CANCELLATE IL
2026-09-26** — `screenshot_themes`, `screenshot_batch3`, `screenshot_final`,
`screenshot_final2`, `screenshot_warn_only`. *Ferme dal 2026-09-09, e
**l'unica cosa che le nominava era questa riga**: nessun test, nessuno script,
nessun workflow. Un elenco che descrive sé stesso non è un riferimento.* La
riga diceva «da adattare al bisogno del momento, **non** da lanciare così come
sono» — cioè, letta per quello che dice, *cinque file che nessuno può eseguire
e che nessuno ha adattato in diciassette giorni.* **Chi ne avrà bisogno parte
da `apri-modulo.js`, che ha `--shot`.**


## ⑤ I baseline che si riscrivono guidando l'app

| Strumento | A cosa risponde |
|---|---|
| `scrivi-baseline-avvio.js` | riscrive `tests/BASELINE-AVVIO.txt` |
| `scrivi-baseline-listener.js` | riscrive `tests/BASELINE-LISTENER.txt` |

## ⑥ Le misure dello spacchettamento

*Nate per il passo 22 — portare `index.html` da un file solo a ventitré.*

⚠️ **CINQUE DI LORO SONO STATE TOLTE IL 2026-09-29, E NON PERCHÉ NESSUNO LE
CHIAMAVA: PERCHÉ NON MISURAVANO PIÙ NIENTE.** `misura-strato`,
`misura-chiusura`, `misura-chiamanti`, `misura-avanti` e `misura-storycards`
leggevano **solo `index.html`** — cercandoci le funzioni del file unico, o
addirittura le righe 6835-7401 — e oggi `index.html` ha **una riga sola di
JavaScript**. *Non si rompevano: trovavano zero funzioni e lo stampavano,
cioè la forma della regola 37.* **Qui c'era scritto «restano utili quando
nasce un file nuovo sotto `app/`», ed era falso:** un file nuovo nasce da un
file di `app/`, e loro quello non lo aprivano. Restano nella storia di git,
se un giorno servisse riscriverle su `app/`.

| Strumento | A cosa risponde |
|---|---|
| `censimento-pezzi.js` | *quanto manca al catalogo dei pezzi?* È il comando della regola 46 |
| `dipendenze.js` | il grafo vero fra i file di `app/`: chi nomina cosa di chi, **e quando** |
| `buchi.js` | i buchi nei due versi, per un file appena estratto o toccato |
| `misura-costruiti.js` | ⚠️ i legami costruiti a runtime — una chiave o un percorso che **non esiste mai per intero** nel sorgente, quindi nessuna ricerca lo trova. *L'unica delle sei misure dello spacchettamento che legge anche `app/`, e quindi l'unica rimasta: serve alla forma ⑥ della regola 41* |
| `misura-finestra-boot.js` | quanto dura la finestra fra «la pagina c'è» e «i testi sono arrivati» |
| `misura-finestra-apertura.js` | quanto un modulo fa aspettare prima di essere usabile |
