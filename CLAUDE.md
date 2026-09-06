# base-inglese

**Versione: 20260906b**

> ⚠️ **Non fondare decisioni su questo file senza verifica in chat.**
> Regole, dati e funzioni scritti qui vanno riletti e validati prima di essere
> usati. L'età del file non è garanzia di validità.

*La versione è nella forma AAAAMMGG + lettera: questo file vive in due posti, e
senza un numero non c'è modo di sapere quale copia è la più recente. Chi lo
modifica alza la lettera se è lo stesso giorno, la data se è un altro.*

App di pratica della pronuncia inglese con episodi personalizzabili e progressi salvati per utente. Tutto il progetto vive oggi in un unico file: `index.html` (HTML + CSS + JS inline, nessuna dipendenza esterna oltre ai Google Fonts).

## Regole permanenti

Queste regole valgono per ogni sessione futura su questo progetto, anche quando non vengono ripetute nella richiesta.

1. **Non rimuovere né modificare schermate o funzionalità esistenti**, a meno che non sia esplicitamente richiesto. Le modifiche sono additive per default.

2. **Nessun colore fisso nel codice dei componenti.** Usare sempre le variabili del sistema di temi già esistente (blocco `:root` e i selettori `[data-theme="..."]` in cima a `index.html`). Un elemento nuovo deve rispondere correttamente a tutti i temi selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura), senza colori hardcoded nel markup o nelle regole dei singoli componenti.

3. **Nessun valore modificabile scritto fisso nel codice** — soglie numeriche, tempi, liste, percentuali. Tutto questo vive in `window.APP_CONFIG`, definito in cima a `index.html` (prima di CSS e resto dello script). Aggiungere un nuovo parametro tunabile significa aggiungere una chiave lì, non un numero sparso nel codice. `APP_CONFIG` è la base dati del **Pannello Admin (config)**, che esiste già: si apre digitando `config` fuori da un campo di testo (o con `?config` nell'indirizzo), mostra un gruppo per ogni chiave di primo livello e scrive le modifiche negli override in `localStorage`. Aggiungere un parametro lì significa vederlo comparire nel pannello senza scrivere altro.

4. **Il contenuto didattico non va scritto dentro il codice dei componenti** — parole, frasi, traduzioni, spiegazioni. Va letto da file di dati esterni.
   - **Un unico file per episodio**, mai spezzettato in file separati per modulo. Nomenclatura ufficiale: `{livello}-episodio{numero}-{lingua}.json` (es. `data/a1-episodio1-inglese.json`). I gradi sono condivisi tra più moduli e devono restare un'unica fonte di verità: ogni modulo legge il proprio grado dallo stesso file episodio, non ne duplica il contenuto in un file suo. I moduli che oggi ci leggono dentro sono Meet the Story, Why We Say It, Repeat Aloud, Voice Practice, Voice Check, Match Practice (en→it, it→en), Speed Match (en→it, it→en), Flash Card (en→it, it→en) e i tre Dialogue (Listen & Repeat, Repeat in Time, Real Dialogue). **Previsti ma non ancora costruiti**: Scrittura e il Test di verifica finale — non esistono nel codice, quindi non cercarli.
   - **Le tabelle di personalizzazione** (nomi, città, paesi — oggi `APP_CONFIG.people` / `APP_CONFIG.places`) restano invece separate dai file episodio, e condivise tra tutti gli episodi e tutte le lingue. Un file episodio vi fa riferimento (es. "usa la tabella nomi-papà"), non le duplica al suo interno.

   - **Il contenuto di un episodio è organizzato in gradi**, non in sezioni per modulo: `levels.A` parole singole, `levels.B` espressioni (blocchi il cui significato non si ricava dalle singole parole), `levels.C` frasi, `levels.D` battute intere. Ogni grado ha `label` e `items`.

     **La lettera è l'identificativo tecnico, il nome è quello che vede lo studente** (Parole, Espressioni, Frasi, Dialogo). I nomi valgono per tutto il corso, quindi stanno in `CONFIG.gradeNames` e vengono da `docs/struttura-corso.md` (regola 26), non dal singolo episodio; si mostrano accanto alla categoria — "Studio · Parole" — e il grado si omette quando la categoria lo contiene già ("Studia il dialogo", non "Studia il dialogo · Dialogo"). Le voci di A e B portano `pronunciationTip` e `grammarCategory`; quelle di C portano `fromLine`, cioè da quale battuta sono state ricavate; quelle di D portano `speaker`, `ruolo` e l'eventuale `whatYouLearn`. Le battute NON esistono anche altrove: il grado D *è* il dialogo, non una sua copia.

     **Le "skill" sono i `whatYouLearn`.** Quando se ne parla a voce o in una richiesta si chiamano *skill*; nel JSON il campo si chiama `whatYouLearn` e non ha altri nomi. Una skill è **una spiegazione agganciata a una battuta del grado D**, fatta di `title` e `body` (due campi separati, regola 25). I segnaposto nelle skill vengono sostituiti come in ogni altro testo dell'episodio: una skill è scritta in italiano ma cita la frase inglese del dialogo, quindi la citazione chiede la propria lingua con `{{chiave:en}}` — senza suffisso vale la lingua della chiamata.

     **`whatYouLearn` è una lista, sempre**, anche quando la skill è una sola: una battuta lunga può introdurre due strutture diverse, ed è normale. Forzarne una sola per battuta significherebbe, prima o poi, spostare una spiegazione per far quadrare la struttura invece che per ragioni didattiche. Una battuta con una skill sola ha una lista di un elemento: il caso semplice non si complica.

     Quindi "11 skill" in `docs/episodio-N.md` si verifica contando le voci di tutte le liste, non le battute che ne hanno una: nell'episodio 1 sono undici skill su dieci battute, perché la prima ne porta due.
   - **Il grado che un modulo legge è deciso dall'ordine, non dal modulo.** `CONFIG.moduleOrderDefault` è una lista di coppie `{ module, grade }`: la coppia dice quale modulo e su quale grado lavora. Nel descrittore di `EPISODES.<episodio>.modulesById` il grado NON c'è — lì sta solo ciò che non dipende da dove il modulo è messo (`kind`, `dataFile`, direzione, profilo dialogo, categoria). Cambiare grado a un passo è cambiare una lettera nella coppia, niente altro.

     Ne segue che **lo stesso modulo può comparire più volte con gradi diversi** (Flash Card sul grado A e sul grado B) riusando un solo descrittore. Gli id restano distinti da soli: `moduleStepId()` lascia alla prima apparizione l'id nudo del modulo — così i progressi già salvati restano validi — e dà alle successive un id proprio (`flashcardAEngIta-2`), invece di sovrascrivere in silenzio i progressi della prima.

     Il contenuto si prende sempre da `episodeGrade(data, grado)`, mai raggiungendo a mano una chiave del file.

5. **Mantenere la tipografia e lo stile del design system esistente**: Source Serif 4 (titoli/frase d'esercizio), Inter (testo/UI), IBM Plex Mono (badge/etichette); componenti `.btn-primary` / `.btn-secondary` / `.card` / `.panel` / `.badge` già definiti — riusarli invece di crearne varianti nuove per la stessa funzione.

6. **L'app vive su due indirizzi, e vanno aggiornati entrambi dopo ogni modifica**, mantenendo intatto il resto. Sono due copie della stessa app: se una resta indietro, si finisce per collaudare una versione e mostrarne un'altra.

   | | Come si aggiorna | Cosa serve fare |
   |---|---|---|
   | **GitHub Pages** — https://dav-te-pd.github.io/base-inglese/ | Da solo, a ogni push su `main` | Solo commit + push: il deploy parte da sé |
   | **Artifact** — pagina singola su claude.ai | Mai da solo | **Ripubblicarlo a mano** dopo ogni modifica a `index.html`, passando lo stesso `url` (mai crearne uno nuovo per un aggiornamento) |

   Quello che richiede un'azione è quindi l'artifact: il push copre Pages e basta. Un push senza ripubblicazione lascia l'artifact fermo alla versione precedente, in silenzio.

   **I due non mostrano la stessa cosa**, ed è una differenza da tenere a mente. Su Pages i file `data/*.json` esistono e l'app li carica: è la sua forma completa. L'artifact è una pagina sola, il `fetch` fallisce e `index.html` ricade sulle copie di sicurezza (`window.FALLBACK_*`) che tiene al proprio interno. **Chi modifica un file in `data/` deve aggiornare la copia corrispondente in `index.html` nello stesso commit**, altrimenti i due indirizzi divergono in silenzio: `tests/test_fallbacks.js` lo verifica, ed è dentro la suite di regressione — una divergenza fa fallire la CI.

7. **Un modulo si segna "completato" SOLO quando l'utente clicca esplicitamente un pulsante** (es. "Ho finito, torna alla mappa") — mai in automatico (non per aver ascoltato tutto l'audio, aperto tutte le traduzioni, ecc.). Vale per ogni modulo, presente e futuro: chi aggiunge un nuovo modulo deve dargli un pulsante di completamento esplicito, non inventare un trigger implicito.

8. **I testi di un modulo vivono sempre in `data/istruzioni-moduli.json`**, mai scritti nel codice del componente. Non solo "Guarda come si fa" (`howItWorks`) e i promemoria del pannello Help (`helpReminder`): anche le domande e le risposte di un'autovalutazione, le frasi di supporto che le seguono, le righe che spiegano perché un pulsante è spento, le etichette di un riquadro. Se è testo che lo studente legge e che non è contenuto dell'episodio, sta qui. Struttura: un oggetto per ogni tipo di modulo (chiave = `kind` del modulo, es. `repeatAloud`, `whyWeSayIt`), ciascuno con `howItWorks: { title, body }` e `helpReminder: { title, body }` (`body` è HTML pronto per l'inserimento). Sono condivisi tra episodi — non sono contenuto specifico di un episodio, quindi non vivono nel file `{livello}-episodioN-{lingua}.json` della regola 4. Un nuovo modulo aggiunge la propria chiave a questo file, non inventa un altro posto dove tenere questi testi.

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

20. **Quando si blocca un'azione, il blocco vive nella funzione che la esegue, non solo nel pulsante o listener che la richiama** — i punti da cui si può richiamare una funzione si moltiplicano nel tempo, la funzione resta una sola.

21. **`stopAllModuleActivity()` è il punto unico di pulizia quando si lascia un modulo.** Timer, registrazioni, sequenze in corso di qualunque modulo — presente o futuro — si azzerano lì (chiamata da `showView()`), mai dentro il singolo pulsante "← Mappa" di un modulo.

22. **Niente di utile vive solo nel container.** Qualunque cosa prodotta durante il lavoro e che serva anche dopo — test, script, strumenti, documenti, dati — va committata nel repository **nello stesso turno in cui viene creata**: non a fine lavoro, non "quando sarà stabile", non "alla prossima occasione". Il container è temporaneo per definizione: quello che resta solo lì è già perso, semplicemente non lo sappiamo ancora. Unica eccezione, i file davvero usa-e-getta. Nel dubbio si committa — un file inutile in più costa nulla, un file utile perso costa giorni.

    *Perché c'è: i 25 file della suite di regressione sono esistiti per giorni solo dentro il container, dando l'impressione di un progetto protetto da una rete di sicurezza che nel repository non c'era. Si sono salvati per un soffio.*

23. **Un test nasce insieme al codice che verifica.** Ogni test nuovo va committato **nello stesso commit** della modifica che verifica, mai lasciato in sospeso in attesa di un giro di pulizia. Un test che esiste ma non è nel repository non protegge nessuno: non lo trova chi arriva dopo, non lo lancia nessuna verifica, e sparisce insieme all'ambiente in cui è stato scritto.

24. **Quello che si salva nel repository deve funzionare anche fuori da qui.** Un file committato ma legato all'ambiente in cui è nato — percorsi assoluti della macchina, versioni installate a mano, un server dato per già acceso, una porta che risponde solo oggi — è salvato a metà: c'è, ma non riparte altrove. Prima di considerare committata una cosa, va verificato che le sue dipendenze siano dichiarate (in `package.json`) e che i suoi percorsi siano relativi al repository o pilotabili da variabili d'ambiente, non incollati dentro il codice.

    *Perché c'è: i 44 file sotto `tests/` avevano dentro il percorso dell'installazione di Playwright del container e il numero di build di Chromium. Erano nel repository e sembravano al sicuro, ma su qualunque altra macchina non partivano — e sarebbero morti tutti insieme al primo aggiornamento del browser. Da qui `tests/test-env.js`, il punto unico da cui i test prendono Playwright, l'indirizzo dell'app e i percorsi su disco.*

25. **Tutto editabile e separato, sempre.** Un contenuto che sembra un blocco unico va comunque scomposto nei suoi pezzi: un titolo e un testo sono due campi, non una stringa sola; tre risposte possibili sono tre voci con la propria etichetta, non tre stringhe scritte nel codice. Vale per i file di dati e per i testi dell'interfaccia allo stesso modo. Costa poche righe quando la struttura nasce; unire e poi separare significa rifare da capo il contenuto già scritto.

    *Perché c'è: `whatYouLearn` era nato come stringa unica. Le undici spiegazioni dell'Episodio 1 hanno un titolo e un corpo, e il grassetto serve DENTRO il corpo per evidenziare le parole — con una stringa sola il titolo sarebbe stato grassetto anche lui, indistinguibile dal resto. Separarlo prima di scrivere il contenuto è costato cinque righe.*

26. **Due file in `docs/` sono la fonte, e non vanno mai scavalcati da quello che viene detto in chat.**

    - **`docs/episodio-N.md`, uno per episodio** — il contenuto di quell'episodio. Da lì viene scritto `data/{livello}-episodio{N}-{lingua}.json`, la fonte da cui l'app pesca (regola 4). Il markdown contiene anche le motivazioni delle scelte, il JSON solo i dati: non sono due copie della stessa cosa — uno spiega, l'altro esegue.
    - **`docs/struttura-corso.md`, uno solo per tutto il corso** — la struttura: ordine dei moduli con i loro gradi, nomi dei gradi mostrati allo studente, categorie, regole di esito. Da lì vengono aggiornate le voci corrispondenti di `APP_CONFIG`. Vale per l'intero corso, non per un episodio: un ordine per episodio significherebbe riordinarlo venti volte.

    Il messaggio che accompagna una modifica è sempre della forma *"aggiorna leggendo `docs/...`"*: i dati non passano più dalla conversazione.

    **Le istruzioni su cosa fare stanno DENTRO il file, mai nel messaggio che lo accompagna**: il file è la fonte e deve bastare da solo. Una sessione futura riceve il markdown, non la conversazione in cui è nato.

    La richiesta dichiara sempre **i numeri attesi** (quante voci per grado, quante skill, quanti slot di personalizzazione). Sono un controllo, non una decorazione: **se i conti non tornano, fermarsi e segnalarlo prima di scrivere**, invece di completare a intuito e consegnare un file che sembra giusto.

27. **Ogni modifica a questo file va dichiarata nel riepilogo della risposta**, con il numero della regola e cosa è cambiato — aggiunta, riscritta o tolta. Non basta che sia nel commit.

    *Perché c'è: `CLAUDE.md` è l'unico file che governa il lavoro e che non si vede usando l'app. Il codice si prova, i dati compaiono negli esercizi, le regole no. Se cambiano in silenzio, il documento di progetto che le rispecchia si disallinea senza che nessuno se ne accorga. Vale anche quando la modifica è stata chiesta: il riepilogo serve a ricordare cosa si è toccato, non a chiedere il permesso.*

28. **Un file in `docs/` non rimanda mai fuori dal repository per un DATO che serve a fare il lavoro.** Se un dato serve, sta lì dentro: un rimando esterno rende il file incompleto proprio nel momento in cui qualcuno lo usa da solo — che è la ragione per cui esiste.

    **Il rimando al metodo è un'altra cosa, ed è ammesso**: dire dove sta scritto il ragionamento (il workflow, i criteri con cui una scelta è stata presa) non lascia buchi nel lavoro, perché non è un dato mancante. La distinzione è questa: se senza quel documento non puoi *scrivere* il file dati, allora è un dato e va portato dentro; se senza puoi comunque scriverlo e ti perdi solo il perché, è un rimando al metodo e può restare.

29. **Quando un file dichiara dei numeri attesi, contali sul contenuto vero prima di usarlo**, senza fidarti della dichiarazione. Se non tornano, fermarsi e segnalarlo prima di scrivere.

    *Perché c'è: `docs/episodio-1.md` dichiarava 11 skill, e 11 ce n'erano davvero — ma stavano su dieci battute, e la struttura di allora ne ammetteva una per battuta. Il numero era giusto, la forma no: contarle è servito a vederlo prima di scrivere il file dati, non dopo.*

30. **Lo "Sblocco Sequenziale" è un meccanismo con un nome, e ha due varianti che restano separate.** L'idea è una: più avanti non si va finché non si è fatto qui. Le due varianti sono **per ascolto** (Ripeti a Tempo — `dgApplySequenceLock`) e **per dichiarazione** (Why We Say It — `seRefreshExplanationStates`).

    Condividono l'idea e il nome, non il markup né il CSS: nella prima un passo avanti è una bolla sbiadita e inerte, nella seconda una card che resta leggibile, mostra il titolo della regola che aspetta e dice col lucchetto perché non si tocca. Unirle in un componente solo produrrebbe due varianti senza niente in comune se non il nome di una funzione. **Chi ne tocca una guardi l'altra**: i due punti del codice si citano a vicenda apposta.

    In entrambe i passi successivi restano **visibili**, mai nascosti: far vedere cosa aspetta invoglia ad andare avanti, e una lista che si allunga da sola disorienta.

31. **Prima di costruire qualcosa di nuovo, dichiara cosa farai e aspetta la validazione.** Non partire e poi mostrare il risultato: si descrive l'intenzione — quali file si toccano, quali funzioni nascono, come si comporterà la cosa — e si aspetta l'ok.

    Vale per il nuovo, non per l'ovvio: una correzione già descritta nella richiesta, un test che accompagna una modifica, un aggiornamento di documentazione già concordato non hanno bisogno di un giro in più. Vale invece per un componente nuovo, una struttura dati nuova, un meccanismo che cambia come si comporta un modulo.

    *Perché c'è: rifare una cosa costruita nella direzione sbagliata costa molto più che descriverla in cinque righe prima. E chi legge la descrizione vede subito le scelte implicite — quelle che, una volta scritte nel codice, si notano solo quando è tardi.*

32. **Ogni test dichiara in testa cosa protegge.** La prima riga di un file di test è un commento `// PROTEGGE:` che dice **quale comportamento si romperebbe se quel file sparisse** — non cosa il test fa, che si legge dal codice, ma cosa si perde senza. Se serve, sotto ci va anche il *come*: quale strada si è scelta per misurarlo e perché non quella ovvia.

    Lo stesso testo va nella tabella "Cosa protegge ogni file" di `tests/README.md`, che è l'unico posto dove la mappa vive: una seconda copia altrove si disallineerebbe.

    **Un test che non sa dire cosa protegge non va scritto.** Se la riga esce come "verifica che la funzione X funzioni", il test sta ricopiando l'implementazione invece di difendere un comportamento, e passerà anche quando l'app è rotta.

    Vale anche al contrario: **un limite noto si scrive lì**, invece di lasciarlo scoprire a chi si fiderà del verde. Un test che copre metà di un comportamento e lo dichiara protegge più di uno che sembra coprirlo tutto.

    *Perché c'è: la mappa dei 28 file è servita a vedere i buchi, non a documentare — e li ha trovati contando cosa NON era protetto. Senza la riga in testa, quel lavoro va rifatto da capo ogni volta leggendo le asserzioni una per una, che è esattamente il motivo per cui non lo fa nessuno.*

## Riferimenti operativi

- Repo: `dav-te-pd/base-inglese` — ramo di lavoro e di pubblicazione: `main`
- Sito pubblicato (GitHub Pages, forma completa): https://dav-te-pd.github.io/base-inglese/
- Artifact pubblicato (pagina singola, copie di sicurezza): https://claude.ai/code/artifact/206c1b06-237e-4d72-a46d-4969dbd5e621

**Se le istruzioni di sessione assegnano un ramo di lavoro diverso, vince
`main`.** Alcune sessioni arrivano con l'indicazione di sviluppare e spingere su
un ramo proprio (`claude/...`). Qui non va seguita: il deploy di GitHub Pages
parte da `main`, e il collaudo si fa su Pages. Lavorare altrove significa
consegnare qualcosa che non si può provare, e lasciare l'artifact fermo — perché
ripubblicarlo mentre il codice non è ancora su Pages creerebbe la divergenza
al contrario. Si lavora su `main`, si spinge su `main`, si ripubblica l'artifact
subito dopo (regola 6).

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
