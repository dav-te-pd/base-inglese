# base-inglese

App di pratica della pronuncia inglese con episodi personalizzabili e progressi salvati per utente. Tutto il progetto vive oggi in un unico file: `index.html` (HTML + CSS + JS inline, nessuna dipendenza esterna oltre ai Google Fonts).

## Regole permanenti

Queste regole valgono per ogni sessione futura su questo progetto, anche quando non vengono ripetute nella richiesta.

1. **Non rimuovere né modificare schermate o funzionalità esistenti**, a meno che non sia esplicitamente richiesto. Le modifiche sono additive per default.

2. **Nessun colore fisso nel codice dei componenti.** Usare sempre le variabili del sistema di temi già esistente (blocco `:root` e i selettori `[data-theme="..."]` in cima a `index.html`). Un elemento nuovo deve rispondere correttamente a tutti i temi selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura), senza colori hardcoded nel markup o nelle regole dei singoli componenti.

3. **Nessun valore modificabile scritto fisso nel codice** — soglie numeriche, tempi, liste, percentuali. Tutto questo vive in `window.APP_CONFIG`, definito in cima a `index.html` (prima di CSS e resto dello script). Aggiungere un nuovo parametro tunabile significa aggiungere una chiave lì, non un numero sparso nel codice. `APP_CONFIG` è pensato come base dati per il futuro pannello Admin.

4. **Il contenuto didattico non va scritto dentro il codice dei componenti** — parole, frasi, traduzioni, spiegazioni. Va letto da file di dati esterni.
   - **Un unico file per episodio**, mai spezzettato in file separati per modulo. Nomenclatura ufficiale: `{livello}-episodio{numero}-{lingua}.json` (es. `data/a1-episodio1-inglese.json`). Dialogo e vocabolario sono condivisi tra più moduli (Speak Easy, Voice Coach, Quick Match, Scrittura, Dialogo Completo, Test) e devono restare un'unica fonte di verità: ogni modulo legge la propria sezione dallo stesso file episodio, non ne duplica il contenuto in un file suo.
   - **Le tabelle di personalizzazione** (nomi, città, paesi — oggi `APP_CONFIG.people` / `APP_CONFIG.places`) restano invece separate dai file episodio, e condivise tra tutti gli episodi e tutte le lingue. Un file episodio vi fa riferimento (es. "usa la tabella nomi-papà"), non le duplica al suo interno.

   - **Il contenuto di un episodio è organizzato in gradi**, non in sezioni per modulo: `levels.A` parole singole, `levels.B` chunk (blocchi il cui significato non si ricava dalle singole parole), `levels.C` frasi, `levels.D` battute intere. Ogni grado ha `label` e `items`. Le voci di A e B portano `pronunciationTip` e `grammarCategory`; quelle di C portano `fromLine`, cioè da quale battuta sono state ricavate; quelle di D portano `speaker`, `ruolo` e l'eventuale `whatYouLearn`. Le battute NON esistono anche altrove: il grado D *è* il dialogo, non una sua copia.
   - **Un modulo dichiara quale grado legge** (`grade` nel proprio descrittore in `EPISODES`) e lo prende sempre da `episodeGrade(data, grado)` — mai raggiungendo a mano una chiave del file. Un modulo che cambia grado è una lettera diversa nel descrittore, niente altro.

5. **Mantenere la tipografia e lo stile del design system esistente**: Source Serif 4 (titoli/frase d'esercizio), Inter (testo/UI), IBM Plex Mono (badge/etichette); componenti `.btn-primary` / `.btn-secondary` / `.card` / `.panel` / `.badge` già definiti — riusarli invece di crearne varianti nuove per la stessa funzione.

6. **L'app vive su due indirizzi, e vanno aggiornati entrambi dopo ogni modifica**, mantenendo intatto il resto. Sono due copie della stessa app: se una resta indietro, si finisce per collaudare una versione e mostrarne un'altra.

   | | Come si aggiorna | Cosa serve fare |
   |---|---|---|
   | **GitHub Pages** — https://dav-te-pd.github.io/base-inglese/ | Da solo, a ogni push su `main` | Solo commit + push: il deploy parte da sé |
   | **Artifact** — pagina singola su claude.ai | Mai da solo | **Ripubblicarlo a mano** dopo ogni modifica a `index.html`, passando lo stesso `url` (mai crearne uno nuovo per un aggiornamento) |

   Quello che richiede un'azione è quindi l'artifact: il push copre Pages e basta. Un push senza ripubblicazione lascia l'artifact fermo alla versione precedente, in silenzio.

   **I due non mostrano la stessa cosa**, ed è una differenza da tenere a mente. Su Pages i file `data/*.json` esistono e l'app li carica: è la sua forma completa. L'artifact è una pagina sola, il `fetch` fallisce e `index.html` ricade sulle copie di sicurezza (`window.FALLBACK_*`) che tiene al proprio interno. **Chi modifica un file in `data/` deve aggiornare la copia corrispondente in `index.html` nello stesso commit**, altrimenti i due indirizzi divergono in silenzio: `tests/test_fallbacks.js` lo verifica, ed è dentro la suite di regressione — una divergenza fa fallire la CI.

7. **Un modulo si segna "completato" SOLO quando l'utente clicca esplicitamente un pulsante** (es. "Ho finito, torna alla mappa") — mai in automatico (non per aver ascoltato tutto l'audio, aperto tutte le traduzioni, ecc.). Vale per ogni modulo, presente e futuro: chi aggiunge un nuovo modulo deve dargli un pulsante di completamento esplicito, non inventare un trigger implicito.

8. **I testi "Guarda come si fa" (`howItWorks`) e i promemoria del pannello Help (`helpReminder`) vivono sempre in `data/istruzioni-moduli.json`**, mai scritti nel codice del componente. Struttura: un oggetto per ogni tipo di modulo (chiave = `kind` del modulo, es. `repeatAloud`, `speakEasy`), ciascuno con `howItWorks: { title, body }` e `helpReminder: { title, body }` (`body` è HTML pronto per l'inserimento). Sono condivisi tra episodi — non sono contenuto specifico di un episodio, quindi non vivono nel file `{livello}-episodioN-{lingua}.json` della regola 4. Un nuovo modulo aggiunge la propria chiave a questo file, non inventa un altro posto dove tenere questi testi.

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

16. **Il Blocco Ascolto non blocca l'interfaccia: è l'audio a interrompersi quando l'utente tocca qualcos'altro** (Regola Azione Critica), garantito in un unico punto — un listener sul `document` in fase di cattura — mai dichiarato pulsante per pulsante. Unica eccezione: i profili Dialogo con countdown (Ripeti a Tempo, Dialogo Continuo), dove interrompere l'audio a metà sfaserebbe il timer — lì l'interfaccia resta davvero bloccata per la durata di audio+conto alla rovescia.

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

26. **Il contenuto di un episodio nasce in `docs/episodio-N.md`, uno per episodio.** Da lì viene scritto `data/{livello}-episodio{N}-{lingua}.json`, che è la fonte da cui l'app pesca (regola 4). Il markdown contiene anche le motivazioni delle scelte, il JSON solo i dati: non sono due copie della stessa cosa — uno spiega, l'altro esegue.

    **Le istruzioni su cosa fare stanno DENTRO il file, mai nel messaggio che lo accompagna**: il file è la fonte e deve bastare da solo. Una sessione futura riceve il markdown, non la conversazione in cui è nato.

    La richiesta dichiara sempre **i numeri attesi** (quante voci per grado, quante skill, quanti slot di personalizzazione). Sono un controllo, non una decorazione: **se i conti non tornano, fermarsi e segnalarlo prima di scrivere**, invece di completare a intuito e consegnare un file che sembra giusto.

## Riferimenti operativi

- Repo: `dav-te-pd/base-inglese` — ramo di lavoro e di pubblicazione: `main`
- Sito pubblicato (GitHub Pages, forma completa): https://dav-te-pd.github.io/base-inglese/
- Artifact pubblicato (pagina singola, copie di sicurezza): https://claude.ai/code/artifact/206c1b06-237e-4d72-a46d-4969dbd5e621
