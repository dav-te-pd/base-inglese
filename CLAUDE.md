# base-inglese

**Versione: 20260911a**

> ⚠️ **Non fondare decisioni su questo file senza verifica in chat.**
> Regole, dati e funzioni scritti qui vanno riletti e validati prima di essere
> usati. L'età del file non è garanzia di validità.

*La versione è nella forma AAAAMMGG + lettera: questo file vive in due posti, e
senza un numero non c'è modo di sapere quale copia è la più recente. Chi lo
modifica alza la lettera se è lo stesso giorno, la data se è un altro.*

App di pratica della pronuncia inglese con episodi personalizzabili e progressi salvati per utente.

**L'app vive in un file solo**: `index.html` — HTML, CSS e JS in linea, nessun
passo di build, nessuna dipendenza esterna oltre ai Google Fonts.

**Il progetto no.** Attorno a quel file ci sono `data/` (i contenuti che l'app
legge), `docs/` (le fonti del contenuto e i documenti di lavoro), `tests/` (la
suite di regressione) e `tools/`. Non sono un contorno: le regole 4, 8, 22 e 24
esistono proprio per governarli.

## Prima di prendere qualunque lavoro

**Apri `docs/decisioni.md`.** Se in testa c'è una **catena in corso**, il
prossimo passo è lì — insieme ai divieti che non si deducono leggendo il codice
(quali passi non si interrompono, quali vanno fatti insieme, quali punti sono
fermate sicure). Il suo gemello `docs/correzioni.md` dice invece cosa è già
stato fatto.

*Sta qui e non fra le regole perché va incontrata **prima** di scegliere cosa
prendere, non mentre si legge la regola che si è già cominciata.*

## Dove sta cosa

I file che governano il lavoro e che altrimenti si scoprono per caso. Non è
documentazione in più: senza questa mappa, queste informazioni esistono sparse
dentro quaranta regole, e chi le legge in ordine non ne ricava un elenco
affidabile.

| File | Cosa c'è dentro |
|---|---|
| `docs/decisioni.md` | La **catena in corso** (in testa) e le decisioni prese e non ancora eseguite. Il primo file da aprire. |
| `docs/correzioni.md` | Le cose fatte, con il commit che le ha applicate. |
| `docs/validazione.md`, `docs/censimento-moduli.md` | Documenti di lavoro sul codice, non legati a un'edizione. |
| `docs/{lingua}/` | Il contenuto: tutto ciò che sta qui sotto è di chi guida il progetto (regola 33). |
| `tests/README.md` | Cosa protegge ogni file di test (regola 32), e **come si lancia la suite**. |
| `tests/run_full_regression.sh` | Lo script che lancia la suite completa. È questo il comando della regola 38: `bash tests/run_full_regression.sh`. |
| `tests/tools/attendi.sh` | L'attesa scritta nella forma giusta una volta sola (regola 37). Si usa questo invece di riscriverla a mano: `tests/tools/attendi.sh <log> "ALL FILES GREEN" "SOME FILES FAILED"`. **Si arrende da sola e dice quale dei due guasti ha davanti**: uscita 2 «è vivo e non finisce», 3 «è morto o non è mai partito» — perché un'attesa col solo tetto, davanti a un lavoro morto, direbbe «ho aspettato troppo» invece di «ho aspettato un cadavere». |
| `tests/ATTESE-FISSE.md` | Le attese a tempo che fanno da guardia a un'asserzione. **Si guarda qui quando un test diventa rosso**, prima di cercare una regressione. |
| `tests/ERRORI-INGOIATI.md` | I `.catch` vuoti dei test, distinti fra legittimi e sopprimenti. Si guarda qui quando un rosso arriva da un punto che non lo spiega. |
| `tests/test-env.js` | Il punto unico da cui i test prendono Playwright, l'indirizzo dell'app e i percorsi (regola 24). |

## Regole permanenti

Queste regole valgono per ogni sessione futura su questo progetto, anche quando non vengono ripetute nella richiesta.

1. **Non rimuovere né modificare schermate o funzionalità esistenti**, a meno che non sia esplicitamente richiesto. Le modifiche sono additive per default.

2. **Nessun colore fisso nel codice dei componenti.** Usare sempre le variabili del sistema di temi già esistente (blocco `:root` e i selettori `[data-theme="..."]` in cima a `index.html`). Un elemento nuovo deve rispondere correttamente a tutti i temi selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura), senza colori hardcoded nel markup o nelle regole dei singoli componenti.

3. **Nessun valore modificabile scritto fisso nel codice** — soglie numeriche, tempi, liste, percentuali. Tutto questo vive in `window.APP_CONFIG`, definito in cima a `index.html` (prima di CSS e resto dello script). Aggiungere un nuovo parametro tunabile significa aggiungere una chiave lì, non un numero sparso nel codice. `APP_CONFIG` è la base dati del **Pannello Admin (config)**, che esiste già: si apre digitando `config` fuori da un campo di testo (o con `?config` nell'indirizzo), mostra un gruppo per ogni chiave di primo livello e scrive le modifiche negli override in `localStorage`. Aggiungere un parametro lì significa vederlo comparire nel pannello senza scrivere altro.

4. **Il contenuto didattico non va scritto dentro il codice dei componenti** — parole, frasi, traduzioni, spiegazioni. Va letto da file di dati esterni.

   - **I dati stanno sotto `data/{lingua-che-si-impara}/{lingua-studente}/`, i loro sorgenti markdown sotto `docs/{lingua-che-si-impara}/{lingua-studente}/`.** Oggi: `data/inglese/it/` e `docs/inglese/it/` — si impara l'inglese, si parte dall'italiano. È l'unica edizione finché l'inglese non è finito.

     **Le due lingue nel percorso, in quest'ordine, perché il catalogo cresce per lingua imparata:** venti episodi di inglese per italiani, poi magari inglese per tedeschi. `inglese/` raccoglie, `it/` distingue. Fino al 2026-09-09 la cartella era una sola (`data/it/`) e diceva solo da dove si parte.

     **Un'edizione non è una traduzione.** La griglia grammaticale appartiene alla COPPIA di lingue, non alla lingua che si impara: *"I have ten years"* è una trappola italiana e non tedesca, quindi un'edizione tedesca non è `docs/inglese/it/` tradotto — è un contenuto suo. Le edizioni future nascono **copiando la cartella e sostituendo i contenuti**, e **una correzione fatta in `it/` NON deve arrivare nelle altre**: se una cosa va corretta ovunque, va corretta ovunque a mano, di proposito.

     Quello che descrive il **codice** e non un'edizione resta fuori dalle cartelle per lingua: `docs/validazione.md`, `docs/correzioni.md`, `docs/decisioni.md`, `docs/censimento-moduli.md`. **Sotto `docs/{lingua}/` sta TUTTO ciò che produce contenuto per lo studente** — le fonti degli episodi, la struttura del corso con i nomi dei gradi come li legge lui, le tabelle di personalizzazione, gli inventari e gli obiettivi.

     **La regola nomina la cartella, non i file che ci stanno dentro**, ed è una correzione del 2026-09-08: prima elencava due file mentre ce n'erano sei. Un elenco dentro una regola invecchia a ogni file nuovo — e qui invecchiava in silenzio proprio dove la regola 33 va a leggere per sapere cosa proteggere.

     Una cartella per una lingua si crea quando c'è qualcosa da metterci, mai in anticipo.

   - **Un unico file per episodio**, mai spezzettato in file separati per modulo. Nomenclatura ufficiale: `data/{lingua-che-si-impara}/{lingua-studente}/{lingua-che-si-impara}-{lingua-studente}-{id}.json` — es. `data/inglese/it/inglese-it-gate.json`, con il markdown gemello `docs/inglese/it/inglese-it-gate.md`.

     **Il nome ripete le due lingue del percorso, ed è voluto:** il file esce dal repository — cartella Download, poi una chat — e lì il percorso si perde. `gate.json` da solo non dice niente.

     **Il livello NON sta nel nome, e non è per accorciare:** il livello non è una proprietà dell'episodio, è un'etichetta su un tratto di sequenza. Un episodio non «è» A1.2: sta in un tratto che si chiama così, e se lo si sposta cambia gruppo. Metterlo nel nome, o in una cartella, congelerebbe una posizione — lo stesso errore di `episode1`. **L'id invece non cambia mai:** `gate`, `aircraft-door` — descrittivo, in inglese, congelato. I gradi sono condivisi tra più moduli e devono restare un'unica fonte di verità: ogni modulo legge il proprio grado dallo stesso file episodio, non ne duplica il contenuto in un file suo. I moduli che oggi ci leggono dentro sono Meet the Story, Why We Say It, Repeat Aloud, Voice Practice, Voice Check, Match Practice (en→it, it→en), Speed Match (en→it, it→en), Flash Card (en→it, it→en) e i tre Dialogue (Listen & Repeat, Repeat in Time, Real Dialogue). **Previsti ma non ancora costruiti**: Scrittura e il Test di verifica finale — non esistono nel codice, quindi non cercarli.
   - **Le tabelle di personalizzazione** (nomi, città, paesi — oggi `APP_CONFIG.people` / `APP_CONFIG.places`) restano separate dai file episodio: un file episodio vi fa riferimento (es. "usa la tabella nomi-papà"), non le duplica al suo interno. Sono condivise fra tutti gli episodi **della stessa edizione**, non fra edizioni: i nomi propri plausibili sono quelli di chi studia, e un'edizione tedesca vuole i suoi. Quando usciranno da `APP_CONFIG` — lavoro previsto, non ancora fatto — andranno sotto `data/{lingua}/` come tutto il resto dell'edizione.

   - **Il contenuto di un episodio è organizzato in gradi**, non in sezioni per modulo: `levels.A` parole singole, `levels.B` espressioni (blocchi il cui significato non si ricava dalle singole parole), `levels.C` frasi, `levels.D` battute intere. Ogni grado ha `label` e `items`.

     **La lettera è l'identificativo tecnico, il nome è quello che vede lo studente** (Parole, Espressioni, Frasi, Dialogo). I nomi valgono per tutto il corso di un'edizione, quindi stanno in `CONFIG.gradeNames` e vengono da `docs/{lingua}/struttura-corso.md` (regola 26), non dal singolo episodio; si mostrano accanto alla categoria — "Studio · Parole" — e il grado si omette quando la categoria lo contiene già ("Studia il dialogo", non "Studia il dialogo · Dialogo"). Le voci di A e B portano `pronunciationTip` e `grammarCategory`; quelle di C portano `fromLine`, cioè da quale battuta sono state ricavate; quelle di D portano `speaker`, `ruolo` e l'eventuale `whatYouLearn`. Le battute NON esistono anche altrove: il grado D *è* il dialogo, non una sua copia.

     **Il file episodio porta anche `speakerLabels` e `placeholderMap`, e non è un dettaglio tecnico.** `speakerLabels` è l'etichetta che lo studente legge **sopra ogni bolla**; `placeholderMap` dichiara quali segnaposto quell'episodio ammette. Sono contenuto, quindi stanno lì e non in `index.html` — dove sono vissuti fino al 2026-09-09.

     **Due regole sulle etichette, e sono didattiche, non estetiche:**

     - **L'etichetta porta il CONTORNO, non il solo mestiere:** *Hostess al gate · Hostess alla porta · Hostess col carrello.* Fra quattro hostess senza contorno lo studente vede la stessa persona quattro volte — che è falso, e toglie proprio quello che rende la storia una storia. *L'argomento opposto («sopra una bolla sarebbe troppo lunga, lo studente vede la scena») è stato scritto e poi ritirato: **la scena in testa ce l'ha chi scrive gli episodi**, non chi legge una schermata di bolle.*
     - **L'etichetta di un personaggio personalizzabile NON porta il nome scelto:** sopra la bolla c'è **"Papà"**, non "Marco". *Il nome sta **dentro** la battuta, dove lo studente lo impara.*

     La fonte è la tabella **«I personaggi e le loro etichette»** del markdown dell'episodio, **non** la colonna «Chi» della matrice: la colonna descrive chi parla nella scena e serve a chi scrive.

     **Le "skill" sono i `whatYouLearn`.** Quando se ne parla a voce o in una richiesta si chiamano *skill*; nel JSON il campo si chiama `whatYouLearn` e non ha altri nomi. Una skill è **una spiegazione agganciata a una battuta del grado D**, fatta di `title` e `body` (due campi separati, regola 25). I segnaposto nelle skill vengono sostituiti come in ogni altro testo dell'episodio: una skill è scritta in italiano ma cita la frase inglese del dialogo, quindi la citazione chiede la propria lingua con `{{chiave:en}}` — senza suffisso vale la lingua della chiamata.

     **`whatYouLearn` è una lista, sempre**, anche quando la skill è una sola: una battuta lunga può introdurre due strutture diverse, ed è normale. Forzarne una sola per battuta significherebbe, prima o poi, spostare una spiegazione per far quadrare la struttura invece che per ragioni didattiche. Una battuta con una skill sola ha una lista di un elemento: il caso semplice non si complica.

     Quindi il numero di skill dichiarato in `docs/{lingua}/episodio-N.md` si verifica **contando le voci di tutte le liste**, non le battute che ne hanno una: una battuta sola può portarne due, e il conto per battute darebbe un numero più basso di quello vero.

     **I numeri attesi di un episodio stanno in testa al file di quell'episodio, e solo lì** — dove cambiano insieme al contenuto. Non vanno ricopiati qui né altrove: un numero vive accanto alla cosa che conta, perché è l'unico posto in cui qualcuno lo aggiorna. Come esempio in un altro documento invecchia in silenzio e smette di essere un esempio: diventa un'istruzione sbagliata.
   - **Il grado che un modulo legge è deciso dalla sequenza, non dal modulo.** Una **sequenza** è una lista di coppie `{ module, grade }`: la coppia dice quale modulo e su quale grado lavora. Le sequenze vivono in `CONFIG.sequences`, una per nome (oggi solo `narrativo-standard`, i ventidue passi). Nel descrittore di `EPISODES.<episodio>.modulesById` il grado NON c'è — lì sta solo ciò che non dipende da dove il modulo è messo (`kind`, `dataFile`, direzione, profilo dialogo, categoria). Cambiare grado a un passo è cambiare una lettera nella coppia, niente altro.

     **Ogni episodio dichiara la propria sequenza, sempre, anche il primo**: `CONFIG.episodes.<id>.sequence` porta il nome. Non esiste una sequenza di default che qualcuno eredita in silenzio — `moduleOrderDefault` è stato tolto apposta il 2026-09-08, perché il primo episodio corto avrebbe preso i ventidue passi narrativi senza che nessuno l'avesse deciso.

     In alternativa un episodio può scrivere il proprio ordine per intero in `CONFIG.episodes.<id>.moduleOrder` — è la strada che il Pannello Admin usa quando riordini a mano. **Cosa vince, e non c'è una quarta possibilità:**

     | L'episodio dichiara | Vale |
     |---|---|
     | solo `sequence` | quella sequenza |
     | solo `moduleOrder` | quell'ordine, scritto per intero |
     | **tutte e due** | **errore** — si dice, non si sceglie |
     | **niente** | **errore** — nessun default implicito |

     Il caso "tutte e due" è l'unico che si potrebbe risolvere zitti scegliendone una, ed è per questo che non lo si fa: chi ha scritto entrambe crede che valga quella che sta guardando, e ha il 50% di probabilità di sbagliarsi per sempre. L'errore non alza un'eccezione — `resolveEpisodeOrder` gira al caricamento e un `throw` lì lascerebbe una pagina bianca — ma viaggia con l'episodio e diventa la schermata d'errore all'apertura della mappa.

     **Un'eccezione non si dichiara come "narrativo-standard meno Flash Card": chi fa eccezione scrive la sua sequenza per intero.** Una sottrazione si legge solo tenendo aperti due documenti, e quando la base cambia le eccezioni cambiano senza che nessuno le abbia toccate.

     Ne segue che **lo stesso modulo può comparire più volte con gradi diversi** (Flash Card sul grado A e sul grado B) riusando un solo descrittore. Gli id restano distinti da soli: `moduleStepId()` lascia alla prima apparizione l'id nudo del modulo — così i progressi già salvati restano validi — e dà alle successive un id proprio (`flashcardAEngIta-2`), invece di sovrascrivere in silenzio i progressi della prima.

     Il contenuto si prende sempre da `episodeGrade(data, grado)`, mai raggiungendo a mano una chiave del file.

5. **Mantenere la tipografia e lo stile del design system esistente**: Source Serif 4 (titoli/frase d'esercizio), Inter (testo/UI), IBM Plex Mono (badge/etichette); componenti `.btn-primary` / `.btn-secondary` / `.card` / `.panel` / `.badge` già definiti — riusarli invece di crearne varianti nuove per la stessa funzione.

6. **L'app vive su un indirizzo solo: si spinge su `main`, il resto è automatico.**

   | | Come si aggiorna |
   |---|---|
   | **GitHub Pages** — https://dav-te-pd.github.io/base-inglese/ | Da solo, a ogni push su `main`. Commit + push, e basta: il deploy parte da sé |

   Non c'è nient'altro da aggiornare a mano, e questo è il punto della regola: **quello che va fatto a mano dopo ogni modifica, prima o poi non viene fatto.**

   **L'app carica i suoi contenuti da `data/{lingua}/` e non ne tiene nessuna copia dentro `index.html`.** Se un file non arriva — percorso sbagliato, rete che cade — il caricamento fallisce e lo studente vede la schermata d'errore (`showLoadError`, regola 35): un guasto si vede, non viene assorbito.

   *Perché la regola diceva un'altra cosa fino al 2026-09-06: l'app viveva anche su un artifact di claude.ai, una pagina sola dove il `fetch` dei dati fallisce sempre. Per farla funzionare lì, `index.html` teneva una copia inline dei tre file di dati (`window.FALLBACK_*`), da rigenerare a ogni modifica con uno strumento apposta e da sorvegliare con un test apposta. Quella copia costava tre cose da mantenere e ne nascondeva una peggiore: assorbiva in silenzio anche i guasti veri — un percorso sbagliato su Pages non si sarebbe visto, perché l'app avrebbe servito la copia interna. L'artifact non serviva a niente che Pages non desse, quindi sono spariti insieme: l'artifact, la copia, lo strumento e il test.*

7. **Un modulo si segna "completato" SOLO quando l'utente clicca esplicitamente un pulsante** (es. "Ho finito, torna alla mappa") — mai in automatico (non per aver ascoltato tutto l'audio, aperto tutte le traduzioni, ecc.). Vale per ogni modulo, presente e futuro: chi aggiunge un nuovo modulo deve dargli un pulsante di completamento esplicito, non inventare un trigger implicito.

8. **I testi di un modulo vivono sempre in `data/{lingua}/istruzioni-moduli.json`** (oggi `data/inglese/it/istruzioni-moduli.json`), mai scritti nel codice del componente.

    **Non è l'unico file di testi condivisi: ce n'è un secondo, `messaggi-feedback.json`**, con i messaggi di fine modulo e quelli dei tentativi. I due si distinguono così: qui i testi che spiegano **come si usa** un modulo, lì quelli che **rispondono a un esito**. Entrambi si raggiungono da una costante in cima allo script (`MODULE_INSTRUCTIONS_FILE`, `FEEDBACK_MESSAGES_FILE`), mai con il percorso scritto dentro una riga di `fetch`. Non solo "Guarda come si fa" (`howItWorks`) e i promemoria del pannello Help (`helpReminder`): anche le domande e le risposte di un'autovalutazione, le frasi di supporto che le seguono, le righe che spiegano perché un pulsante è spento, le etichette di un riquadro. Se è testo che lo studente legge e che non è contenuto dell'episodio, sta qui. Struttura: un oggetto per ogni `kind` di modulo (es. `repeatAloud`, `whyWeSayIt`), ciascuno con `howItWorks: { title, body }` e `helpReminder: { title, body }` (`body` è HTML pronto per l'inserimento).

    **Non tutte le chiavi sono moduli, ed è voluto.** `mappaEpisodio` è la mappa dell'episodio: modulo non è, ma ha una schermata sua e quindi i suoi due testi come tutti. `dialogoShared` è il blocco condiviso dai tre Dialogue, e **non ha né `howItWorks` né `helpReminder`**: non è un modulo, non ha una schermata propria da spiegare, e i testi che porta servono ai tre che la schermata ce l'hanno. Nessuna delle due è una dimenticanza da sistemare. Sono condivisi tra gli episodi della stessa edizione — non sono contenuto specifico di un episodio, quindi non vivono nel file episodio della regola 4 — ma non fra edizioni: sono testo che lo studente legge nella propria lingua. Un nuovo modulo aggiunge la propria chiave a questo file, non inventa un altro posto dove tenere questi testi.

9. **Il pulsante "Help" va sempre nella riga di intestazione in alto**, insieme a "← Mappa" e a "Spiegazione" — mai in basso vicino al pulsante di completamento ("Ho finito, torna alla mappa" o simile), perché lì causa click accidentali quando si scorre per finire l'esercizio. Vale per ogni modulo, presente e futuro.

    L'intestazione condivisa (`.header-2row`) è su due righe, e un modulo nuovo la ottiene riusando quelle classi invece di scriversi la propria:
    - **riga 1** (`.header-badge-row`) — nome del modulo e sua categoria (Studio, Quiz, ...), testo non cliccabile;
    - **riga 2** (`.header-actions-row`) — "← Mappa" a sinistra, "Spiegazione" al centro, "Help" a destra.

    Se uno dei tre pulsanti viene nascosto in una schermata (per esempio "Spiegazione" nella Schermata Finale, regola 10), gli altri restano esattamente dove sono: le posizioni sono fissate a colonna, non redistribuite.

10. **Nella Schermata Finale non va mostrata la barra "🎥 Guarda come si fa"** — a quel punto non c'è più nulla da spiegare. Riguarda i moduli che una Schermata Finale ce l'hanno, cioè le categorie **Studio, Studia il dialogo, Quiz e Verifica finale** (regola 17); Inizio e Fine non ne hanno una. Vale per ogni modulo, presente e futuro: chi costruisce una schermata finale la tiene priva della watch-bar, mostrando solo l'esito/il messaggio di completamento e le azioni di uscita (Help se previsto, "Ho finito, torna alla mappa").

11. **Prima di costruire un nuovo elemento di interfaccia, verificare se esiste già un componente riusabile che serve allo scopo** (es. i pannelli/box/schermate già presenti nel progetto) ed estenderlo invece di duplicarlo. Se durante un lavoro noti duplicazioni già esistenti nel codice, segnalale nel riepilogo finale invece di correggerle silenziosamente — verranno affrontate in una revisione dedicata.

12. **La visibilità via `hidden` è garantita da una guardia unica, non dalla memoria di chi scrive CSS.** In cima al foglio di stile di `index.html` c'è una sola riga:

    ```css
    [hidden]:not([hidden="until-found"]) { display: none !important; }
    ```

    Una regola d'autore con `!important` batte ogni regola d'autore senza, quindi questa copre ogni classe esistente e ogni classe futura. **Aggiungere un `display` a una classe non richiede più nessuna verifica e nessun override accanto**: non scriverne di nuovi, e non toccare la guardia. `tests/test_hidden_guard.js` è nella suite e non si fida della riga: prende ogni regola del foglio che imposta un `display`, costruisce un elemento che quella regola colpisce, gli mette `hidden` e verifica che sparisca — quindi una regola scritta in modo da rompere di nuovo la guardia (per esempio un `!important` su un `#id`) fa fallire la CI subito.

    *Perché c'è: `[hidden]{display:none}` arriva dal foglio predefinito del browser, il livello più debole della cascata, e qualunque regola d'autore lo batte a prescindere dalla specificità. Il bug si è ripresentato cinque volte (`.btn`, `.header-actions`, `header.app-header`, le schermate di Speed Round e Flash Card) perché la difesa era una raccomandazione: chi aggiungeva un `display` a una classe non poteva sapere che quella classe sarebbe stata nascosta altrove. Un audit su tutto il file ha poi trovato altri 18 punti scoperti, nessuno ancora esploso. La regola vecchia chiedeva di ricordarsene ogni volta; questa toglie l'occasione di dimenticarsene.*

13. **Prima di creare una nuova funzione o calcolo, verificare se ne esiste già uno riusabile nel codice, ed estenderlo invece di duplicarlo.** Quando riusi o crei una funzione degna di nota, comunicane il nome esatto nel riepilogo di risposta.

14. **Chiudere ogni risposta con una sezione fissa "⚠️ DA REGISTRARE"** contenente:
    - funzioni e componenti nuovi o generalizzati, con il nome esatto;
    - parametri aggiunti ad `APP_CONFIG`, con nome e valore;
    - duplicazioni notate e non corrette;
    - quali file di test sono stati lanciati e perché — se la suite completa, quale codice condiviso l'ha resa necessaria; se un sottoinsieme, perché la modifica era contenuta a quel modulo;
    - **file creati in questo turno e non committati**, con il motivo esplicito per cui sono rimasti fuori dal repository. Se sono stati committati tutti, dirlo. Il silenzio su questo punto non va letto come "è tutto salvato" (regola 22).

    Se non c'è nulla, scrivere "nulla da registrare". Mai diluire queste informazioni nella prosa del riepilogo.

15. **Dopo aver scritto una modifica, guardare cosa si è effettivamente toccato — non cosa era stato chiesto — per decidere quali test lanciare.** Se la modifica resta dentro codice specifico di un modulo, bastano i test di quel modulo. Se tocca anche una sola riga di codice condiviso — un componente, una funzione, un parametro usato altrove — va lanciata la suite di regressione completa. Nel dubbio, la suite completa. Il criterio è il diff reale una volta fatta la modifica, non l'intenzione dichiarata nella richiesta: una richiesta piccola può finire per toccare qualcosa di condiviso, e lo si scopre solo dopo aver scritto il codice.

16. **Il Blocco Ascolto non blocca l'interfaccia: è l'audio a interrompersi quando l'utente tocca qualcos'altro** (Regola Azione Critica), garantito in un unico punto — un listener sul `document` in fase di cattura — mai dichiarato pulsante per pulsante.

    **Unica eccezione: i profili Dialogo con countdown** (Ripeti a Tempo, Dialogo Continuo). Lì un tocco qualunque NON interrompe l'audio, perché il conto alla rovescia parte dalla sua fine e interromperlo a metà lo sfaserebbe: il listener globale si tira indietro (`dgAudioProtected()`). Non vuol dire che l'interfaccia sia congelata — **è la battuta stessa a rispondere**: toccarla mentre parla salta l'audio e fa partire il countdown, toccarla mentre la barra scorre passa alla battuta successiva. L'area sensibile è tutta la bolla, mai la sola barra: centrare una striscia alta pochi pixel col dito non funziona.

17. **Ogni modulo di categoria Studio, Studia il dialogo, Quiz e Verifica finale ha la Schermata Finale, nessuna eccezione.** I moduli di categoria Inizio e Fine sono diversi per natura: chiudono con la propria azione (es. "Inizia l'episodio"), senza riepilogo né Traguardo — una Schermata Finale lì non avrebbe senso, non sono esercizi. Il resto vale per tutti, senza eccezioni di categoria: stesso pulsante = stessa funzione = stesso suono in ogni punto in cui compare (es. `renderSummaryScreen`, i suoni Traguardo/Uscita) — se un pulsante ha bisogno di comportarsi diversamente a seconda del contesto, non è più lo stesso pulsante, va trattato come un elemento a sé.

18. **Quando un valore o una funzione smette di appartenere a un solo modulo e diventa condiviso, il nome deve diventare condiviso nello stesso momento** — mai un prefisso ereditato dal primo modulo che l'ha introdotto. Un elemento che sembra ancora "di un modulo" mentre è usato da tutti è un invito a spostarlo per sbaglio in futuro, rompendo tutti gli altri in silenzio.

19. **Un test non deve mai dipendere da quanto è veloce la macchina che lo esegue.** Se verifica uno stato transitorio, legge lo stato interno dentro un'unica chiamata sincrona invece di correre contro un timer con round-trip separati. Un mock che semplifica troppo la realtà (es. una sintesi vocale che finisce all'istante invece che in modo asincrono come quella vera) dà una sicurezza falsa — nasconde proprio i bug che dipendono da un ordine di eventi asincrono.

    ⚠️ **E IL FATTO CHE MANCAVA, senza il quale questa regola non si può
    applicare: il container di lavoro è SISTEMATICAMENTE più veloce del runner
    della CI, e la differenza è stabile.** Non è un'intermittenza: una corsa
    persa là si vince **sempre** qui. Misurato il 2026-09-10 — sei giri verdi in
    locale e due corse rosse su due, sullo stesso commit.

    Ne discende che **rilanciare un test in locale non può escludere questa
    famiglia**: dieci giri darebbero dieci verdi e la conclusione sbagliata
    («allora era un flake»). Un rosso della CI che non si riproduce qui **non è
    un mistero: ha un nome** — è un'asserzione che legge uno stato prodotto in
    modo asincrono senza aspettarlo.

    *Perché questa aggiunta, e non è un dettaglio: il 2026-09-10 questa regola è
    stata violata da chi l'aveva appena letta. Non mancava la regola — mancava
    il fatto. **Una regola che non si può applicare perché manca il fatto è una
    regola che si viola avendola letta**, ed è la stessa forma della 41: l'elenco
    delle forme c'era, e non è stato usato perché non aveva i comandi.*

20. **Quando si blocca un'azione, il blocco vive nella funzione che la esegue, non solo nel pulsante o listener che la richiama** — i punti da cui si può richiamare una funzione si moltiplicano nel tempo, la funzione resta una sola.

21. **`stopAllModuleActivity()` è il punto unico di pulizia quando si lascia un modulo.** Timer, registrazioni, sequenze in corso di qualunque modulo — presente o futuro — si azzerano lì (chiamata da `showView()`), mai dentro il singolo pulsante "← Mappa" di un modulo.

22. **Niente di utile vive solo nel container.** Qualunque cosa prodotta durante il lavoro e che serva anche dopo — test, script, strumenti, documenti, dati — va committata nel repository **nello stesso turno in cui viene creata**: non a fine lavoro, non "quando sarà stabile", non "alla prossima occasione". Il container è temporaneo per definizione: quello che resta solo lì è già perso, semplicemente non lo sappiamo ancora. Unica eccezione, i file davvero usa-e-getta. Nel dubbio si committa — un file inutile in più costa nulla, un file utile perso costa giorni.

    *Perché c'è: i 25 file della suite di regressione sono esistiti per giorni solo dentro il container, dando l'impressione di un progetto protetto da una rete di sicurezza che nel repository non c'era. Si sono salvati per un soffio.*

23. **Un test nasce insieme al codice che verifica.** Ogni test nuovo va committato **nello stesso commit** della modifica che verifica, mai lasciato in sospeso in attesa di un giro di pulizia. Un test che esiste ma non è nel repository non protegge nessuno: non lo trova chi arriva dopo, non lo lancia nessuna verifica, e sparisce insieme all'ambiente in cui è stato scritto.

24. **Quello che si salva nel repository deve funzionare anche fuori da qui.** Un file committato ma legato all'ambiente in cui è nato — percorsi assoluti della macchina, versioni installate a mano, un server dato per già acceso, una porta che risponde solo oggi — è salvato a metà: c'è, ma non riparte altrove. Prima di considerare committata una cosa, va verificato che le sue dipendenze siano dichiarate (in `package.json`) e che i suoi percorsi siano relativi al repository o pilotabili da variabili d'ambiente, non incollati dentro il codice.

    *Perché c'è: i 44 file sotto `tests/` avevano dentro il percorso dell'installazione di Playwright del container e il numero di build di Chromium. Erano nel repository e sembravano al sicuro, ma su qualunque altra macchina non partivano — e sarebbero morti tutti insieme al primo aggiornamento del browser. Da qui `tests/test-env.js`, il punto unico da cui i test prendono Playwright, l'indirizzo dell'app e i percorsi su disco.*

25. **Tutto editabile e separato, sempre.** Un contenuto che sembra un blocco unico va comunque scomposto nei suoi pezzi: un titolo e un testo sono due campi, non una stringa sola; tre risposte possibili sono tre voci con la propria etichetta, non tre stringhe scritte nel codice. Vale per i file di dati e per i testi dell'interfaccia allo stesso modo. Costa poche righe quando la struttura nasce; unire e poi separare significa rifare da capo il contenuto già scritto.

    *Perché c'è: `whatYouLearn` era nato come stringa unica. Le spiegazioni dell'episodio 1 hanno un titolo e un corpo, e il grassetto serve DENTRO il corpo per evidenziare le parole — con una stringa sola il titolo sarebbe stato grassetto anche lui, indistinguibile dal resto. Separarlo prima di scrivere il contenuto è costato cinque righe.*

26. **Due file in `docs/` sono la fonte, e non vanno mai scavalcati da quello che viene detto in chat.**

    - **`docs/{lingua-che-si-impara}/{lingua-studente}/{edizione}-{id}.md`, uno per episodio** (es. `docs/inglese/it/inglese-it-gate.md`) — il contenuto di quell'episodio. Da lì viene scritto `data/{lingua}/{livello}-episodio{N}-{lingua-che-si-impara}.json`, la fonte da cui l'app pesca (regola 4). Il markdown contiene anche le motivazioni delle scelte, il JSON solo i dati: non sono due copie della stessa cosa — uno spiega, l'altro esegue.
    - **`docs/{lingua-che-si-impara}/{lingua-studente}/struttura-corso.md`, uno per edizione** — la struttura: ordine dei moduli con i loro gradi, nomi dei gradi mostrati allo studente, categorie, regole di esito. Da lì vengono aggiornate le voci corrispondenti di `APP_CONFIG`. Vale per l'intero corso di quell'edizione, non per un episodio: un ordine per episodio significherebbe riordinarlo venti volte.

      *Sta sotto la lingua perché i nomi dei gradi sono testo che lo studente legge — "Parole", "Espressioni" — e un'edizione tedesca vuole i suoi. **Da sapere:** `CONFIG.grades`, `CONFIG.gradeNames`, `CONFIG.moduleTypes` e `CONFIG.sequences` sono oggi valori globali singoli, quindi con una seconda edizione due file `struttura-corso.md` rivendicherebbero la stessa voce di configurazione. Va risolto prima di aggiungere la seconda lingua, non adesso.*

    Il messaggio che accompagna una modifica è sempre della forma *"aggiorna leggendo `docs/...`"*: i dati non passano più dalla conversazione.

    **Le istruzioni su cosa fare stanno DENTRO il file, mai nel messaggio che lo accompagna**: il file è la fonte e deve bastare da solo. Una sessione futura riceve il markdown, non la conversazione in cui è nato.

    La richiesta dichiara sempre **i numeri attesi** (quante voci per grado, quante skill, quanti slot di personalizzazione). Sono un controllo, non una decorazione: **se i conti non tornano, fermarsi e segnalarlo prima di scrivere**, invece di completare a intuito e consegnare un file che sembra giusto.

27. **Ogni modifica a questo file va dichiarata nel riepilogo della risposta**, con il numero della regola e cosa è cambiato — aggiunta, riscritta o tolta. Non basta che sia nel commit.

    *Perché c'è: `CLAUDE.md` è l'unico file che governa il lavoro e che non si vede usando l'app. Il codice si prova, i dati compaiono negli esercizi, le regole no. Se cambiano in silenzio, il documento di progetto che le rispecchia si disallinea senza che nessuno se ne accorga. Vale anche quando la modifica è stata chiesta: il riepilogo serve a ricordare cosa si è toccato, non a chiedere il permesso.*

28. **Un file in `docs/` non rimanda mai fuori dal repository per un DATO che serve a fare il lavoro.** Se un dato serve, sta lì dentro: un rimando esterno rende il file incompleto proprio nel momento in cui qualcuno lo usa da solo — che è la ragione per cui esiste.

    **Il rimando al metodo è un'altra cosa, ed è ammesso**: dire dove sta scritto il ragionamento (il workflow, i criteri con cui una scelta è stata presa) non lascia buchi nel lavoro, perché non è un dato mancante. La distinzione è questa: se senza quel documento non puoi *scrivere* il file dati, allora è un dato e va portato dentro; se senza puoi comunque scriverlo e ti perdi solo il perché, è un rimando al metodo e può restare.

29. **Quando un file dichiara dei numeri attesi, contali sul contenuto vero prima di usarlo**, senza fidarti della dichiarazione. Se non tornano, fermarsi e segnalarlo prima di scrivere.

    *Perché c'è: un file episodio dichiarava un certo numero di skill, e quel numero era esatto — ma le skill stavano su meno battute, e la struttura di allora ne ammetteva una sola per battuta. Il numero tornava, la forma no: contarle è servito a vederlo prima di scrivere il file dati, non dopo.*

30. **Lo "Sblocco Sequenziale" è un meccanismo con un nome, e ha due varianti che restano separate.** L'idea è una: più avanti non si va finché non si è fatto qui. Le due varianti sono **per ascolto** (Ripeti a Tempo — `dgApplySequenceLock`) e **per dichiarazione** (Why We Say It — `storyCardsRefreshExplanationStates`).

    Condividono l'idea e il nome, non il markup né il CSS: nella prima un passo avanti è una bolla sbiadita e inerte, nella seconda una card che resta leggibile, mostra il titolo della regola che aspetta e dice col lucchetto perché non si tocca. Unirle in un componente solo produrrebbe due varianti senza niente in comune se non il nome di una funzione. **Chi ne tocca una guardi l'altra**: i due punti del codice si citano a vicenda apposta.

    In entrambe i passi successivi restano **visibili**, mai nascosti: far vedere cosa aspetta invoglia ad andare avanti, e una lista che si allunga da sola disorienta.

31. **Prima di costruire qualcosa di nuovo, dichiara cosa farai e aspetta la validazione.** Non partire e poi mostrare il risultato: si descrive l'intenzione — quali file si toccano, quali funzioni nascono, come si comporterà la cosa — e si aspetta l'ok.

    Vale per il nuovo, non per l'ovvio: una correzione già descritta nella richiesta, un test che accompagna una modifica, un aggiornamento di documentazione già concordato non hanno bisogno di un giro in più. Vale invece per un componente nuovo, una struttura dati nuova, un meccanismo che cambia come si comporta un modulo.

    *Perché c'è: rifare una cosa costruita nella direzione sbagliata costa molto più che descriverla in cinque righe prima. E chi legge la descrizione vede subito le scelte implicite — quelle che, una volta scritte nel codice, si notano solo quando è tardi.*

32. **Ogni test dichiara in testa cosa protegge.** La prima riga di un file di test è un commento `// PROTEGGE:` che dice **quale comportamento si romperebbe se quel file sparisse** — non cosa il test fa, che si legge dal codice, ma cosa si perde senza. Se serve, sotto ci va anche il *come*: quale strada si è scelta per misurarlo e perché non quella ovvia.

    Lo stesso testo va nella tabella "Cosa protegge ogni file" di `tests/README.md`, che è l'unico posto dove la mappa vive: una seconda copia altrove si disallineerebbe.

    **Un test che non sa dire cosa protegge non va scritto.** Se la riga esce come "verifica che la funzione X funzioni", il test sta ricopiando l'implementazione invece di difendere un comportamento, e passerà anche quando l'app è rotta.

    Vale anche al contrario: **un limite noto si scrive lì**, invece di lasciarlo scoprire a chi si fiderà del verde. Un test che copre metà di un comportamento e lo dichiara protegge più di uno che sembra coprirlo tutto.

    ⚠️ **Ma dichiarare un limite non è difendersi da quel limite** — vedi la
    regola 42. Il 2026-09-10 un limite scritto in testa a un file diceva
    esattamente dove il test non guardava, e un'ora dopo chi l'aveva scritto si
    è fidato lo stesso del verde. La dichiarazione serve a chi legge dopo; non
    serve a chi la scrive.

    ⚠️ **E un guasto che uccide il test NON BASTA: serve il guasto REALISTICO
    che la forma vecchia non reggeva e la nuova sì.** Sono due prove diverse, e
    solo la seconda dice che la correzione serve.

    *Il caso, 2026-09-10.* Un'asserzione correva contro un fetch. Rompendo il
    fetch del tutto la riga diventava rossa — ma quello prova solo che
    l'asserzione **sa morire**. La prova vera è stata ritardare il fetch di due
    secondi, cioè la macchina lenta, esagerata: **la forma nuova regge e quella
    vecchia cade.** Vedere solo il timeout avrebbe lasciato credere di aver
    verificato una cosa che non era stata verificata.

    *Perché c'è: la mappa in `tests/README.md` è servita a vedere i buchi, non a documentare — e li ha trovati contando cosa NON era protetto. È anche il motivo per cui il conto dei file non si scrive qui: quella tabella cresce di una riga per ogni test nuovo, un totale scritto altrove no. Senza la riga in testa, quel lavoro va rifatto da capo ogni volta leggendo le asserzioni una per una, che è esattamente il motivo per cui non lo fa nessuno.*

33. **Un file di contenuto in `docs/` non si modifica di iniziativa.** Se serve
    cambiarlo, si chiede prima, si dà la motivazione, e si aspetta conferma o
    rifiuto. Vale anche per una correzione che sembra ovvia: quel file è una
    decisione presa, non un appunto.

    Riguarda **tutto ciò che sta sotto `docs/{lingua}/`** (regola 4), senza
    elenco: la cartella è il criterio, non i nomi dei file. Oggi ci stanno
    `episodio-N.md`, `struttura-corso.md`, `tabelle-personalizzazione.md`,
    `inventario-grammaticale.md` e `obiettivi-a1.md`, e domani ce ne staranno
    altri — la regola li copre già.

    *Perché senza elenco, e non è pignoleria: fino al 2026-09-08 questa riga
    ne nominava due su sei, quindi **quattro file di contenuto non erano
    protetti** da chi la leggeva alla lettera. Un elenco dentro una regola
    smette di essere vero al primo file nuovo, e nessuno se ne accorge: la
    regola continua a leggersi bene.*

    **È diversa dalla 31**: quella riguarda il codice — dichiarare cosa si
    costruirà prima di costruirlo — questa il contenuto.

34. **Prima di una modifica strutturale il giro è: proposta → valutazione →
    decisione → esecuzione.** In quest'ordine, e sono quattro momenti distinti:

    - **la proposta** arriva da chi guida il progetto;
    - **la valutazione** dice cosa comporta, cosa si rompe, quanto costa e
      **se sceglieresti diversamente** — l'ultima non è un ornamento, è la
      parte che serve di più: una valutazione che non dice mai "no, così no"
      non è una valutazione;
    - **la decisione** è di chi ha proposto;
    - **l'esecuzione** arriva dopo, con un prompt suo.

    **Un prompt che chiede una valutazione dice esplicitamente "non modificare
    niente in questo giro", e va rispettato alla lettera.** La valutazione si
    consegna a codice fermo: niente anticipi, nemmeno la parte che sembra
    sicura o già decisa. Se una cosa va misurata per rispondere, si legge il
    codice — non lo si tocca.

35. **Un messaggio che segnala il fallimento di un meccanismo non può
    dipendere da quel meccanismo.** È l'**unica eccezione ammessa alla
    regola 8** — i testi che lo studente legge stanno in
    `data/{lingua}/istruzioni-moduli.json` — e va scritta **con il motivo
    accanto**, nel codice, non lasciata sembrare una dimenticanza.

    Il caso che l'ha fatta nascere: la schermata d'errore di caricamento
    prende i propri testi da `istruzioni-moduli.json`. Ma se il file che non
    si carica è *proprio quello*, un testo preso da lì non arriverebbe mai, e
    la schermata resterebbe muta esattamente nel caso che la giustifica.
    Serve quindi una frase di ultima istanza nel codice
    (`LOAD_ERROR_LAST_RESORT`), usata solo quando i testi veri non sono
    raggiungibili.

    **Non è un permesso generico.** Vale quando la dipendenza è circolare:
    il messaggio parla del meccanismo da cui dovrebbe venire. In ogni altro
    caso la regola 8 non ha eccezioni.

    *Conseguenza da tenere a mente: dove la circolarità c'è, il testo dal
    file non arriverà MAI. I tre punti non bloccanti (Spiegazione, Help,
    l'intro di un modulo) falliscono solo quando fallisce
    `istruzioni-moduli.json`, quindi usano sempre la frase di ultima
    istanza — non per scorciatoia, ma perché l'alternativa non esiste.*

36. **Una suite contaminata a metà non è un verde parziale: è un risultato
    nullo.** Se un file cambia mentre la suite gira — il codice, i dati, un
    file di test — i file passati prima della modifica hanno provato una cosa
    e quelli dopo un'altra: **nessuno dei due risultati vale**, e non si sa
    nemmeno quale sia quale. Si butta e si rilancia da capo.

    Non è pignoleria: **un verde inattendibile costa più di un giro in più.**
    Un giro in più costa mezz'ora di attesa; un verde in cui non si può
    credere costa la fiducia in tutti i verdi successivi, che è la sola cosa
    per cui la suite esiste.

    Quindi, in pratica: **mentre la suite gira, l'albero di lavoro non si
    tocca.** Nemmeno un `git pull`, nemmeno una rinomina che "non c'entra
    niente" — i test leggono dal disco a ogni caricamento di pagina, e non
    esiste modo di sapere dopo quali file abbiano visto cosa. Se una modifica
    non può aspettare, si ferma la suite prima di farla, non dopo.

    *Perché c'è: una suite era a 28 file su 32, tutti verdi, dopo sette ore di
    lavoro. Una modifica al file dati e una a `index.html`, fatte mentre
    girava, hanno reso quei 28 file inutilizzabili — non falsi, peggio:
    indecidibili. Buttarli e ripartire è stata la cosa giusta, e la tentazione
    di tenerseli era forte proprio perché erano verdi.*

37. **Una misura che non misura, e non lo dice.** È il difetto più costoso di
    tutti, perché non somiglia a un errore: somiglia a un risultato. Un test
    verde che non prova niente, un'attesa che dice "in corso" su un lavoro
    finito, un controllo che dice "fallito" su una suite verde — nessuno di
    questi si annuncia. **Restano lì a farsi credere.**

    In un giorno solo se ne sono presentate tre della stessa forma: due
    attese che dicevano "in corso" a vuoto e una che diceva "fallito" a
    vuoto. Il caso singolo si corregge in un minuto; quello che va corretto
    è la forma.

    **Due conseguenze operative, e sono obbligatorie:**

    - **Un'attesa non si aggancia mai al nome di un processo. Si aggancia a
      quello che il lavoro produce.** `pgrep -f X` cerca `X` in *tutte* le
      righe di comando, compresa la propria: l'attesa trova sé stessa e non
      finisce mai. La forma giusta guarda un'informazione che esiste **solo**
      quando il lavoro è finito davvero — la riga conclusiva in un file di
      log, un file di esito — e che non può parlare di sé:

      ```bash
      # sbagliato: si trova da sola, aspetta per sempre
      until ! pgrep -f run_full_regression >/dev/null; do sleep 15; done

      # giusto: aspetta ciò che il lavoro scrive quando finisce
      until grep -q "ALL FILES GREEN\|SOME FILES FAILED" suite.log; do sleep 15; done
      ```

      E l'ultimo comando dell'attesa non deve essere un `grep` che cerca i
      fallimenti: quando è tutto verde non trova niente ed **esce con 1**,
      cioè si dichiara fallita proprio quando è andato tutto bene.

    - **Per sapere se un lavoro è attivo si usa `TaskList`, non `pgrep`.** È
      la stessa lista che l'utente vede nel pannello «Attività in
      background»: guardare quella significa rispondergli con la sua fonte,
      non con una mia stima. `TaskStop` chiude ciò che resta appeso.

    *Perché c'è, e perché sta qui benché parli di come si lavora e non
    dell'app: il 2026-09-07 questo difetto è costato due risposte false —
    "la suite sta girando" mentre era finita da un'ora, e il silenzio su un
    task appeso da due ore che l'utente vedeva e io no. Chi guida il progetto
    non ha modo di controllare queste risposte: se ne accorge solo per caso.
    E la sessione successiva non era lì a impararlo.*

38. **LA VERIFICA È DUE COSE: LA SUITE LOCALE E LA CI, GUARDATE ENTRAMBE.**

    **La suite locale dice «non ci sono regressioni». Non dice «non ci sono
    corse»** — vedi la regola 19: il container è più veloce del runner, e una
    corsa persa là si vince sempre qui.

    **E la CI si LEGGE, non si dà per andata.** Il 2026-09-10 tre corse
    consecutive hanno dato tre esiti diversi sullo stesso albero, e due rosse
    sono passate inosservate perché si aspettava la terza dando per scontate le
    prime. *Credere a un risultato invece di leggerlo è la stessa forma della
    misura che non misura (regola 37): non somiglia a un errore, somiglia a un
    risultato.*

    Quindi, a ogni merge: si legge l'esito della corsa **di quel commit**, e lo
    si riporta — verde o rossa. Non «aspetto la prossima».

    Si lancia sempre la suite completa in locale prima di spingere. La CI
    resta, ma come rete su una macchina che non è la mia — non come primo
    controllo.

    Prima era un compromesso: la locale costava cinquanta minuti contro gli
    undici della CI, e su una modifica piccola si poteva ragionevolmente
    spingere e aspettare. **Dal 2026-09-07 costa uguale** — undici minuti,
    da quando i test non aspettano più il timeout dei Google Fonts
    (`bloccaFontEsterni` in `tests/test-env.js`) — **e arriva prima**: la CI
    verifica ciò che è già pubblicato, la locale ciò che sta per esserlo.

    Restano tre cose che solo la locale può fare, e sono il motivo per cui
    non basta la CI: vedere un test **fallire apposta** prima di fidarsene
    (regola 32), **diagnosticare** un rosso rilanciando un file solo in
    pochi secondi, e dare il verde **prima** della pubblicazione — che è
    tutto il senso del ramo di verifica.

39. **Una voce mai incontrata non ha colore.** È assenza di dato, non un
    giudizio: finché nessuno ha risposto, quella voce **non esiste** nel
    magazzino della mastery — e non serve rappresentarla, perché è già così.
    L'unico lettore che abbia mai disegnato quei colori lo sa (`renderPhrase`
    usa la classe `new` quando la voce manca).

    **La prima risposta le dà il colore che quella risposta merita**, non un
    livello di partenza deciso a tavolino:

    | Prima risposta | Diventa |
    |---|---|
    | giusta | **giallo**, con la striscia a 1 — così la seconda giusta promuove a verde |
    | simile *(solo Voice Practice)* | **giallo**, striscia 0 |
    | sbagliata | **rosso**, striscia 0 |

    **Il compromesso è dichiarato, non nascosto: una risposta indovinata a
    caso porta a giallo.** Lo accettiamo perché l'errore opposto è peggiore —
    leggere una risposta *giusta* come «non lo sa» è falso **sempre**, mentre
    leggere un colpo di fortuna come «medio» è falso **a volte**. E giallo non
    è definitivo: è la scala che dice «ci torniamo sopra», e se era fortuna la
    prossima risposta lo scopre.

    **Non esiste un quarto livello sotto `rosso`, e non va aggiunto**: entrerebbe
    in `LEVELS`, l'array su cui `nextLevel`/`prevLevel` fanno l'aritmetica, e
    cambierebbe la retrocessione di *tutte* le voci per sistemare solo le nuove.

    *Perché c'è, ed è il motivo per cui è la prima delle regole sulla mastery a
    essere scritta: fino al 2026-09-08 ogni voce nasceva **rossa**, anche
    rispondendo giusto. Con `promotionStreak: 2` servivano **quattro** risposte
    giuste per arrivare a verde invece di due, e un profilo che aveva fatto
    tutto bene mostrava verde 0 su 145 voci. Non era una scelta sbagliata: non
    era **mai stata scritta da nessuna parte**, né come regola né come
    motivazione — c'era solo un commento che descriveva cosa faceva il codice.
    E un test la proteggeva, perché descriveva il codice invece della regola.
    Questa regola esiste perché la prossima decisione sulla mastery non torni
    a vivere solo dentro un `+1`.*


40. **Un lavoro a più passi sta sempre nella lista attività**, un elemento per passo, con il progresso vero quando c'è: durante una corsa lunga il testo di stato porta un numero che cambia — `Suite 15/42`, `strato 2/6` — aggiornato ogni paio di minuti. **Il pallino che gira è un'animazione, non una misura:** da solo non distingue «sta lavorando» da «si è fermato».

    *Perché c'è: è la prima cosa del progetto che chi guida può verificare **senza chiedermela**. Fino a qui l'unica era la CI, che prova `main` e non quello che sto facendo adesso. E serve proprio perché il mio strumento può mentire: il 2026-09-07 dicevo «la suite sta girando» su un'attesa rotta, mentre un task appeso da due ore era visibile a lui e non a me (regola 37). L'alternativa — chiedere ogni dieci minuti — è una difesa che si basa sul ricordarsene, cioè quella che cede.*

41. **Una rinomina si verifica su TUTTE le forme del nome, e ogni forma ha il
    suo COMANDO.** Con `V` il nome vecchio, la verifica per sottrazione è
    questa, e si esegue **tutta**, riga per riga, prima di dichiarare fatto un
    passo:

    | | Comando | Che forma prende |
    |---|---|---|
    | ① | `grep -rn "\bV[A-Z]" .` | **camelCase** — `speedRound`, `srShuffle` |
    | ② | `grep -rn "v-parola" .` | **kebab** — `speed-round`, `story-cards-` |
    | ③ | `grep -rni "vparola" .` | **minuscolo attaccato** — `speedround`, i prefissi delle chiavi mastery |
    | ④ | `grep -rn "[a-z]V[a-z]" .` | **dentro un identificatore più lungo** — `openSpeedRound`, `loadSeExplanationStats` |
    | ⑤ | `grep -rn "V parola\|V PAROLA\|v parola" .` | **con lo spazio**, nella prosa — `Speed Round`, `SPEED ROUND` |
    | ⑥ | `grep -rn "'segmento'" .` | **il percorso assemblato a pezzi** — `repoPath('data','it',…)` |

    ⚠️ **Sulla ④ non c'è `\b`, ed è il punto.** È precisamente il confine di
    parola che fa mancare quella forma: in `loadSeExplanationStats` il `Se` è
    preceduto da una minuscola, quindi `\bse[A-Z]` non lo trova.

    ⚠️ **Sulla ⑥ si cerca il SEGMENTO, non il percorso.** In
    `repoPath('data', 'it', nome)` la stringa `data/it/` **non esiste mai per
    intero**, quindi nessuna ricerca sul percorso la trova.

    ⚠️ **Il `grep` va SENSIBILE alle maiuscole.** Un `-i` di troppo rende
    `[A-Z]` uguale a `[a-z]` e produce centinaia di falsi positivi: è già
    successo, e il rumore ha nascosto i veri.

    **I comandi si incollano nel riepilogo del passo, con il numero di
    occorrenze trovate per ognuno — zero compreso.** *Uno zero scritto è una
    ricerca fatta; uno zero non scritto è indistinguibile da una ricerca
    saltata.*

    *Perché è una regola permanente e non un appunto: lo stesso difetto è
    capitato **tre volte**. Due erano forme non previste — le 185 occorrenze
    con lo spazio ai passi 3 e 4, il percorso a pezzi al passo 6. **La terza è
    diversa e pesa di più:** tre nomi del passo 5 sono sopravvissuti perché la
    verifica cercava `\bse[A-Z]`, e la forma ④ **era già nell'elenco**. Non è
    stata una forma nuova: è stata una forma elencata e non cercata. Ho
    verificato tre forme credendo di averne verificate cinque. **Un elenco di
    nomi si legge e si crede di averlo applicato; un elenco di comandi o lo si
    esegue o non lo si esegue, e la differenza si vede.***

42. **UN TEST CHE DICHIARA DI GUIDARE UN CASO SOLO NON BASTA A PROTEGGERE
    UNA RIGA CHE VALE PER TUTTI.**

    **Se la riga è condivisa, il test deve toccare almeno il caso più
    DIVERSO — non il più comodo.**

    *L'esempio del 2026-09-10, e senza il caso vero questa resterebbe una
    raccomandazione.* Una riga aggiunta a `openModuleFromMap` — il punto unico
    da cui passano **tutti** i moduli — chiedeva `loadEpisodeData` a ciascuno.
    Il test nuovo, `test_modulo_pronto.js`, guidava **Voice Coach**. La suite è
    andata rossa su cinque file, e il caso caduto era **Personalizza: l'unico
    dei sedici moduli senza `dataFile`.** Su di lui `fetch(undefined)` falliva,
    il `.catch` apriva la schermata d'errore, e un modulo che funziona mostrava
    un guasto.

    **Il test guidava il caso più simile a quello che si stava scrivendo.** Non
    è un caso: il caso comodo è sempre quello che si ha già in mano, montato,
    con la pagina aperta. Il caso diverso costa dieci minuti in più ed è l'unico
    che prova qualcosa.

    ⚠️ **E il limite era già dichiarato in testa al file** (regola 32): la riga
    diceva esattamente dove il test non guardava. Un'ora dopo mi sono fidato lo
    stesso. **Un limite dichiarato dice dove non guardi; non ti impedisce di
    fidarti.** È la stessa forma della 19 e della 41 — una frase che descrive un
    comportamento cede, dove un comando o un numero no.

    **Quindi la parte operativa, ed è l'unica difesa che non si dimentica:
    quando una modifica tocca una riga condivisa, nel riepilogo si NOMINA il
    caso più diverso e si dice COSA lo rende diverso** — «Personalizza, l'unico
    senza `dataFile`». *Un caso nominato è un caso guardato; un caso non
    nominato è indistinguibile da uno non cercato.* E se guardando l'elenco
    tutti i casi sembrano uguali, quella è la risposta da scrivere — non il
    permesso di saltare il giro.

    **Come si trova il caso più diverso:** si guarda l'elenco vero — i sedici
    descrittori in `EPISODES.<episodio>.modulesById`, i ventidue passi di una
    sequenza, i lettori di un file — e si cerca **chi manca di qualcosa che
    hanno tutti gli altri**, non chi è più complicato. Personalizza non era il
    modulo più complesso: era quello a cui mancava un campo.

43. **OGNI COMMIT CHE NON È UN PASSO DELLA CATENA SCRIVE LA PROPRIA RIGA,
    NELLO STESSO COMMIT.**

    Non a fine giornata, non al merge, non «quando sarà stabile» — nello stesso
    `git commit`, come già fanno i test (regola 23) e le correzioni.

    ⚠️ **E LA VERIFICA È MECCANICA, non un promemoria:**

    > **UN COMMIT CHE TOCCA CODICE O TEST E NON TOCCA UN REGISTRO È UN COMMIT
    > CHE NON HA REGISTRATO NIENTE.**

    `git show --name-only` lo dice in un secondo, su qualunque commit, anche a
    mesi di distanza. Non dipende da come è scritto il messaggio né da cosa
    qualcuno si ricorda: **il file c'è nel diff o non c'è.**

    *La prima forma di questo controllo guardava il **messaggio** — «un commit
    il cui messaggio non nomina il registro che ha toccato è un commit che quel
    registro non l'ha scritto». **Misurata sui quindici commit del 2026-09-10
    dava otto falsi allarmi su quindici**: dodici commit toccavano
    `decisioni.md` e solo quattro lo nominavano. Era una misura che non misura
    (regola 37) messa a guardia della regola che serve a non averne. Il diff non
    ha questo difetto.*

    **Il caso vero, misurato:** il 2026-09-10, quindici commit, **uno solo** un
    passo della catena. `decisioni.md` toccato **12 volte su 15** — lo stato
    della catena veniva scritto quasi sempre. **`correzioni.md` UNA volta su
    quindici.** *Il buco non era «registrare»: era registrare **quello che era
    stato corretto**.* Il giorno dopo è servito un giro di allineamento per
    recuperare due correzioni dell'app, tre condizioni scadute e una motivazione
    falsa scritta il giorno prima.

    **Dove va la riga — tre categorie, e non serve un posto nuovo:**

    | Il commit | Dove va la riga |
    |---|---|
    | ha **corretto** qualcosa | `docs/correzioni.md` |
    | ha **trovato** qualcosa e non l'ha corretto | `docs/decisioni.md`, con la sua **condizione** |
    | ha **cambiato la catena** (uno stato, un numero, una motivazione) | la riga della catena, subito |

    ⚠️ **IL LIMITE, e sta DENTRO la regola perché il caso è previsto:** una
    correzione può nascere **dentro** un altro lavoro e scoprirsi a suite già
    lanciata — e la regola 36 dice che mentre la suite gira l'albero non si
    tocca. Lì la riga nello stesso commit non ci può stare. **In quel caso è un
    commit SUO, subito dopo il verde** — mai un rinvio a fine giornata. *Una
    regola creduta assoluta si viola la prima volta che non lo è, e da lì in poi
    non la si applica più.*

    *Perché esiste, e la ragione vale più della regola: quello che non finisce
    nei file non resta da nessuna parte — resta **nella conversazione**. E **la
    chat non sopravvive al container**: è la stessa cosa che è già costata i 25
    file della suite (regola 22), il censimento morto e la lista attività
    (regola 40).*

    ⚠️ **E la frase che tiene insieme tutto il resto:**

    > **NOI CAMBIAMO SENZA SAPERE, E LUI DECIDE SENZA CHIEDERE.**

    *Sono i due modi in cui una decisione smette di essere una decisione. La
    prima metà — il codice cambia e nessuno sa che una scelta è stata cambiata —
    è il motivo per cui una proposta va messa in discussione invece che
    eseguita. La seconda — chi scrive sceglie da solo dove la richiesta taceva —
    è il motivo per cui si **dichiara prima di costruire** (regola 31). Insieme
    hanno prodotto il rosso iniziale della mastery: una decisione che viveva
    dentro un `+1`, che nessuno aveva preso e che nessuna riga diceva (regola
    39), e stavano per produrre tre correzioni sbagliate in due giorni.*

    **Questa regola è quello che resta quando la conversazione finisce.** Non
    serviva un posto nuovo: i due file c'erano già. Serviva un **momento**, ed è
    quello del commit.

## Riferimenti operativi

- Repo: `dav-te-pd/base-inglese` — ramo di lavoro e di pubblicazione: `main`
- Sito pubblicato (GitHub Pages): https://dav-te-pd.github.io/base-inglese/
- **Non esiste più un artifact da ripubblicare** (regola 6, dal 2026-09-06): se una sessione futura ne trova il riferimento in un documento vecchio, è residuo — non va ripubblicato né ricreato.

**Se le istruzioni di sessione assegnano un ramo di lavoro diverso, vince
`main`.** Alcune sessioni arrivano con l'indicazione di sviluppare e spingere su
un ramo proprio (`claude/...`). Qui non va seguita: il deploy di GitHub Pages
parte da `main`, e il collaudo si fa su Pages. Lavorare altrove significa
consegnare qualcosa che non si può provare. Si lavora su `main` e si spinge su
`main`.

**Unica eccezione: il ramo di verifica, che dura quanto la suite.** Il controllo
di fine turno esige che ogni commit sia spinto da qualche parte; la suite
completa dura più di un turno. La collisione non è un caso, è strutturale — si
ripresenterà sempre — e senza un'eccezione dichiarata finisce che si pubblica
metà verifica su Pages a ogni giro.

Quando parte la suite completa, il commit nasce su `claude/verifica-in-corso`:
si spinge lì, il controllo è soddisfatto, e **Pages non vede niente finché il
verde non c'è**. A suite verde il ramo confluisce in `main`.

Non contraddice la regola sopra, la serve: quella esiste perché lavorare
altrove significa consegnare qualcosa che non si può provare. Un ramo che vive
venti minuti e serve solo a non pubblicare a verifica aperta non consegna niente
a nessuno — anzi, protegge Pages proprio nel momento in cui non si sa ancora se
il codice regge. **Su quel ramo non ci si lavora e non ci si resta**: si usa mentre la suite
gira, e appena confluisce si torna su `main`.

**È sempre lo stesso ramo, e non si cancella.** Dal container la cancellazione
dal remoto fallisce comunque — il proxy git risponde «Everything up-to-date»
invece di cancellare — quindi provarci è solo rumore. **Se `claude/verifica-in-corso`
esiste già, ci si spinge sopra**: ne resta uno per sempre invece di uno nuovo a
ogni giro, e il motivo per cui la regola diceva "muore col merge" — non lasciare
rami vaganti — è rispettato meglio con uno solo che con venti.

Quindi: **trovarlo non significa che una verifica sia in corso.** Sta fermo
all'ultimo commit confluito finché non serve di nuovo.

## Regole e funzioni dell'app

Due elenchi separati, e restano separati: **una regola dice come si decide, una
funzione dice come si comporta il codice.** Confonderli fa perdere il motivo di
entrambi.

Ogni voce ha tre parti: **il numero**, **la spiegazione tecnica**, e **una nota di
contesto solo se serve**. La numerazione è decisa fuori da qui e va copiata così
com'è: non si inventano numeri.

### Regole

*Da popolare dopo l'estrazione.*

### Funzioni

*Da popolare dopo l'estrazione.*
