# Suite di regressione

39 file — 37 Playwright, che aprono l'app in un browser vero, e uno
(`test_attendi.js`) che non la apre affatto: prova uno strumento della
suite, non l'app. Uno per giro di lavoro/argomento (`test_batchN.js`) più
alcuni per aree specifiche (`test_dialogo_extra.js`, `test_new_features.js`,
`test_voicecoach.js`, `test_story_modules.js`,
`test_hidden_guard.js`, `test_outcome_step_ids.js`, `test_config_letta.js`,
`test_struttura_corso.js`, `test_scala_colori.js`,
`test_errore_caricamento.js`, `test_avviso_microfono.js`,
`test_sblocco_sequenziale.js`, `test_attendi.js`,
`test_report_mastery.js`, `test_episodi_corti.js`, `test_sequenze.js`, `test_episodio2.js`,
`test_interruttore_episodio.js`, `test_match_practice_nonloso.js`, `test_blocco_ascolto.js`, `test_mastery_al_gesto.js`, `test_conta_asserzioni.js`,
`test_conta_attese.js`, `test_modulo_pronto.js`, `test_comportamento_audio.js`,
`test_versione_cache.js`). Insieme costituiscono la
suite di regressione completa citata da CLAUDE.md (regola 15): quando una
modifica tocca codice condiviso va lanciata tutta, quando resta dentro un
modulo bastano i file di quel modulo.

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
statico sulla porta 8955, lancia **ogni `test_*.js` di questa cartella** —
tranne quelli scritti in `esclusi-dalla-suite.txt` col loro perché, oggi
nessuno — e ferma il server alla fine. *Qui c'era «lancia i 32 file in
ordine»: erano 92 il 2026-10-16, e da quel giorno non sono più un elenco
scritto a mano (`tools/file-della-suite.js`).* Se un server risponde già su quella porta, lo riusa invece di
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

⚠️ **`debug/` e `legacy/` non esistono più — cancellate il 15 settembre.**
Erano 14 file e 2004 righe che nessuno lanciava: cinque test precedenti alla
numerazione `test_batchN.js` e nove script diagnostici per bug già risolti.
Il README di ciascuna diceva perché erano stati tenuti — «se un giorno risulta
che coprono qualcosa che i `test_batchN.js` non coprono, è meglio poterlo
verificare» — e quella condizione non è mai stata verificata da nessuno.
Misurata il 15 settembre, non poteva esserlo: `legacy/test_retouch.js`
asserisce che il pulsante Indietro di Flash Card è raggiungibile, e
`legacy/test_fc_navremoval.js`, nella stessa cartella, asserisce che è stato
tolto dal DOM. **Uno dei due era rosso garantito**, e `#fc-prev-btn` non esiste
in `index.html` da mesi. Due file tenuti per poterli rilanciare, di cui uno non
poteva passare. *Il costo non è stato zero: il 2026-09-09 due rinomine di
passaggio hanno attraversato tutte e due le cartelle — duemila righe morte che
hanno ricevuto manutenzione senza restituire niente.*

## `test_outcome_step_ids.js` — nella suite dal 2026-09-05

Verifica che la regola di esito (`CONFIG.moduleOutcomeRules`) e la regola del
tentativo arrivino a **ogni apparizione** di un modulo nell'ordine, non solo
alla prima. Gioca l'episodio in un profilo pulito dal passo 1 al passo 9 e
confronta i due badge in mappa: a parità di risposte devono essere identici, e
tutti e due devono avere un esito salvato.

**Era fuori dalla suite** finché asseriva che il difetto del § 4.1 di
`docs/archivio/validazione.md` esistesse ancora: un test che asserisce un difetto
diventa rosso proprio quando il difetto viene corretto, e un rosso che vuol
dire "risolto" è peggio di nessun test. Corretto il difetto (vedi
`docs/correzioni.md`), il file è stato rovesciato ed è entrato nella suite —
la suite passa così da 28 a 29 file.

Si può ancora lanciare da solo, con il server attivo:

```bash
node tests/test_outcome_step_ids.js
```


## ⚠️ LA FALSIFICAZIONE NON PROVA CHE IL TEST SA MORIRE. SMASCHERA IL TEST.

La regola 32 chiede di vedere un test **fallire apposta** prima di fidarsene, e
la ragione che si dà di solito è *«così sappiamo che sa morire»*. **È la ragione
debole.** Quella forte l'ha misurata il passo 19, il 2026-09-15, in un giro solo:

**Due misure che non misuravano, trovate tutte e due dalla falsificazione e
nessuna delle due rileggendo.**

- **Il `replace` senza `assert`.** La patch che doveva rompere il codice non
  combaciava con il testo, quindi **non si applicava**. Il test restava verde, e
  quel verde sembrava dire *«l'asserzione non dipende da quel codice»*. Diceva
  solo che la patch non era entrata.
- **Il selettore fuori dal pannello.** L'asserzione leggeva
  `document.querySelector('.config-group')`, e il primo `.config-group` del
  documento sta **fuori** dal corpo che viene ridisegnato — misurato, **27 nel
  documento contro 23 dentro**. Era **vera per costruzione** (regola 44): `open`
  restava `true` qualunque cosa facesse il codice.

⚠️ **La seconda è stata scritta un'ora dopo aver citato la regola 44 in una
dichiarazione.** Conoscere la regola non ha impedito di violarla; **falsificare
sì**.

> **A CADERE NON È STATA L'ASSERZIONE: È STATA LA FALSIFICAZIONE.**
> Ed è il segnale più utile che esista, perché arriva **prima** che la riga
> entri nella suite sembrando una difesa.

**In pratica:** quando si scrive un'asserzione nuova, non si rompe il codice per
vederla morire — **si rompe il codice per vedere se la rottura arriva fino a
lei**. Se il verde resta, l'ipotesi da controllare per prima non è «il codice è
robusto»: è **«la mia rottura non è entrata»** oppure **«la mia asserzione non
guarda dove credo»**. Nel giro del passo 19 erano vere tutte e due, una per
volta.


## Cosa protegge ogni file

Non è un indice: è la domanda **"cosa si romperebbe se questo file
sparisse?"**, una riga per file. Serve a vedere i buchi, non a documentare.

Il test che è mancato al § 4.1 di `docs/archivio/validazione.md` (allora `docs/validazione.md`) sarebbe stato *"l'esito
di un passo viene salvato"*. Nessuno l'aveva scritto, e 583 asserzioni verdi non
hanno visto niente. Questa tabella esiste perché il prossimo buco si veda prima.

⚠️ **Dal 2026-10-21 è GENERATA, e non si scrive a mano** (regola 32): la fonte è
il paragrafo `// PROTEGGE:` in testa a ogni file, e la scrive
`node tests/tools/tabella-protegge.js --scrivi`. `test_tabella_protegge.js`
diventa rosso se le due divergono. *Fino a quel giorno lo stesso testo era
scritto a mano qui e nella testata: dei 69 file che li avevano tutti e due,
nessuno li aveva uguali.* L'ordine è quello alfabetico dei file; un aiutante
(non un test) entra quando ha la sua testata.

<!-- TABELLA GENERATA da tests/tools/tabella-protegge.js: NON SI MODIFICA A MANO -->

| File | Cosa si romperebbe senza |
|---|---|
| ⚠️ **TABELLA GENERATA** | **Non si modifica a mano.** La fonte è la testata `// PROTEGGE:` di ogni file; si rigenera con `node tests/tools/tabella-protegge.js --scrivi`, e `tests/test_tabella_protegge.js` diventa rosso se le due divergono. *Una correzione scritta qui sparirebbe alla prossima rigenerazione: va scritta nella testata.* |
| `attese.js` | Che un'attesa condivisa dai test esista in **un posto solo**, e che aspetti lo stato vero invece di contare millisecondi. Oggi: `attendiSottotitoloEsito` (un testo che arriva da un fetch), `attendiVisibile` / `attendiNascosto` (una schermata che compare o sparisce), `attendiAbilitato` / `attendiDisabilitato` / `attendiClasse` (un pulsante o una classe che cambia stato), `attendiCheParla` e `attendiTono` (un suono o la voce), e `misura` (stampa quanto ci mette una catena, senza aspettare niente di suo). Le attese **ritornano `true`/`false` invece di sollevare**, così lo scadere del tempo diventa l'asserzione che fallisce, con il suo testo, invece di un `TimeoutError` muto. *(Non è un test: è il magazzino delle attese.)* |
| `strati.js` | le domande STRUTTURALI che ogni strato estratto si fa, scritte una volta sola — *aiutante, non un test: le asserzioni le esegue il file che lo chiama, col suo `log`*. Che `index.html` carichi lo strato con un tag suo, BLOCCANTE, nell'ordine dichiarato; **il divieto di ritorno** (niente di estratto ridefinito dentro `index.html`); dal 2026-09-18 **il divieto di esporre un nome che lo strato RIASSEGNA** — un nome che cambia esce come funzione, non come valore; e che ogni nome esposto abbia almeno un lettore. Se sparisse, i test di strato che lo richiedono non partirebbero; se perdesse una domanda, la perderebbero tutti insieme. |
| `test_attendi.js` | che tests/tools/attendi.sh riporti il codice GIUSTO — 0 quando il lavoro e' finito bene, 1 quando e' finito male — e che, quando si arrende, dica QUALE dei due guasti ha davanti: 2 se il lavoro e' vivo e non finisce, 3 se e' morto o non e' mai partito — con due frasi distinte, perche' "cerca il processo" e "controlla il percorso del log" sono due ricerche diverse — e 64 se gli argomenti erano sbagliati. E' l'unico strumento che sta fra "la suite e' finita" e quello che poi racconto: se sbaglia codice, un rosso passa per verde e nessuno se ne accorge, perche' il suo output somiglia a un risultato in entrambi i casi. |
| `test_attendi_ci.js` | che `tests/tools/attendi-ci.sh` dica il VERO sulla CI, e che quando non lo sa lo DICA invece di aspettare per sempre. Cioè: il verde solo dopo aver ASPETTATO la fine; una corsa **annullata** distinta da una rossa (stessa uscita, frase diversa: *un pulsante premuto non è un difetto*); la corsa che non esiste e doveva esserci (3) distinta dall'API illeggibile (4), che **non aspetta per sempre**; una corsa viva e lenta che esce con 2, non con 3 né con 4; un commit abbreviato che è un errore d'uso (64) e non una corsa assente; un commit di soli file di `paths-ignore` che esce con 5 e non con 3 — con accanto l'ultima corsa del workflow su `main`, perché **il 5 non dice che la CI è viva** — e un pattern, un commit o un repository che lo script non sa leggere che danno 6, mai un 5 o un 3 tirati a indovinare. ⚠️ E un difetto non dello script ma di CHI LO USA: **ogni esito nomina il commit per intero**, con la riga «se non è quello che hai appena spinto, hai letto un'altra corsa». E il numero stampato è la durata della CORSA, non dell'attesa dello script. |
| `test_attese_condivise.js` | che le forme condivise di `tests/attese.js` misurino davvero, e — soprattutto — **che si veda quando NON misurano**. `[A]` aspettano davvero (la durata lo prova); `[B]` sanno tornare `false` — compreso un selettore che non esiste, che NON e' «stato raggiunto»; `[C]` la prova contraria: su uno stato GIA' vero una forma torna `true` subito — in meno della meta' di un'attesa vera — **senza aver verificato niente**; `[D]` il suono: una voce che si spegne DA SOLA, senza nessun tocco, rende vera lo stesso un'attesa «finche' non parla piu'». Se una forma tornasse `true` senza aspettare, decine di asserzioni diventerebbero verdi per finta senza che nessun rosso lo dica. |
| `test_audio_estratto.js` | che la voce dell'app (`app/audio.js`) arrivi, e arrivi prima di chi la chiama — senza, il login compare ma il primo pulsante non fa niente e non si arriva a casa. E che l'epoca che scarta i callback audio tardivi salga davvero quando si lascia una vista, invece di restare una copia congelata che nessuno vede ferma. |
| `test_avvio_invariato.js` | che il passo 22 SPOSTI il codice in file separati senza cambiare COSA l'app fa all'avvio — quali moduli si registrano e in che ordine, quali pulizie, quali script, e su quale schermata si arriva — e che di blocchi inline in `index.html` ce ne sia UNO SOLO, la riga che accende l'app: un secondo sarebbe la forma con cui il codice torna dentro `index.html` un pezzo per volta. I guasti che prende sono silenziosi al boot: un modulo registrato dopo il boot (la mappa apre e non trova il kind), uno perso del tutto (un passo muto), l'ordine cambiato. L'app parte, il login compare, e il guasto aspetta il primo studente. |
| `test_avviso_microfono.js` | l'avviso "non riusciamo a sentirti" dei due moduli di voce — che compaia per ENTRAMBE le strade con cui un microfono rotto si manifesta (premere e non parlare; parlare senza che venga riconosciuta una parola), che salga di livello nell'ordine delle soglie di `CONFIG`, che al livello confermato blocchi "Avanti" lasciando "Torna alla mappa" come unica uscita, e che sparisca appena una parola viene riconosciuta. E che il pannello stia FUORI da `#vc-result` (vedi sotto). Senza questo file, uno studente col microfono rotto puo' restare a fissare zero stelle credendo di pronunciare male. |
| `test_batch10.js` | che i segnaposto dell'episodio siano tutti risolti — aperto Why We Say It sul file vero, zero avvisi in console — e che uno sconosciuto (`{{nonExistentSlot}}` iniettato nel file in volo) faccia un avviso in console che lo nomina invece di rompere l'app; le spunte «sentita» in Dialogo, visibili e vuote dall'inizio e piene (con l'icona) solo sulla battuta ascoltata; il suono Traguardo su «Ho finito» di Repeat Aloud e di Why We Say It, e **non** su «← Mappa», sull'uscita per microfono guasto di Voice Check e su «Non ancora» in Dialogo. E che le soglie percentuali stiano in `CONFIG.percentageThresholds`, al primo livello, e non più dentro `speedMatch` (spostate, non copiate). |
| `test_batch11.js` | che l'esito di un modulo segua davvero la sua regola. Con ModuleRules (Voice Check) il primo giro al 100% salva «verde», allo 0% «rosso», un punteggio misto «giallo» dentro la banda di `percentageThresholds`, e la riga in mappa porta classe e badge giusti («Completato», «Da riprovare», «Da rivedere»); un rifacimento SOVRASCRIVE l'esito in entrambe le direzioni (verde → rosso → verde). E insieme: che `moduleOutcomeRules` dichiari la regola di ogni modulo (`moduleRules` per Voice Check, `selfAssessment` per i tre Dialogo, `selfScoreRules` per Why We Say It, nessuna voce per Repeat Aloud); che `--accent` non sia piu' lo stesso colore del rosso di errore (`--wrong-ink`), cosi' l'icona «Attuale» in mappa non si legge come un errore; che l'autovalutazione del Dialogo scriva l'esito SOLO col pulsante di uscita, nella stessa forma `{ level }` di ModuleRules; e che `episodeFinalMessages` abbia i tre casi coi loro complimenti e il consiglio solo dove serve. |
| `test_batch12.js` | il catalogo dei suoni per evento — `CONFIG.sound.events`, in un posto solo, con Traguardo e Ready un'ottava sopra — e che Flash Card «Si', la so» suoni il Corretto; che `--accent` del CSS e `themes.options.dot` di `APP_CONFIG` concordino su ogni tema; che i tre sfondi di stato in mappa siano distinguibili; l'ordine, i nomi e le categorie dei moduli in mappa (e che "Story Cards" in mappa non compaia piu'); Voice Practice e Voice Check al completo — contatore visibile, nessun ripasso finale, esito salvato, mastery alimentata, per battuta e per parola. **E dal 2026-09-10 la C.1:** che **Voice Check scriva**, in voci sue (`voicecheck:`) e mai dentro quelle di Voice Practice — le due varianti hanno regole diverse su quale tentativo conta, e sulla stessa chiave nessun lettore saprebbe quale delle due ha prodotto il colore che vede — e che lo faccia con la **strada B**, cioe' contando solo il primo tentativo. E' anche il file dove vive il caso «Voice Check + ← Mappa» della regola del gesto: rispondere non scrive, e uscendo da «← Mappa» non resta nessuna voce. |
| `test_batch13.js` | Che i tre parametri di registrazione (`voiceCoach.silenceTimeoutSeconds`, `maxRecordingMsPerWord`, `maxRecordingMarginMs`) stiano in `APP_CONFIG` e si possano modificare nel Pannello Admin; che il taglio per silenzio scarti la registrazione **senza offrirla** per l'invio e **senza contarla** nei secondi inviati; che un parlato riconosciuto prima del timeout **non** venga scartato per errore; e che una registrazione davvero inviata i secondi invece li conti, per modulo, e il pannello li mostri. |
| `test_batch14.js` | che parlare a lungo non faccia scattare il taglio per silenzio (la registrazione continua e arriva alla conferma); che "Ho finito" apra la Schermata Finale e **non** completi il modulo — lo completa solo il pulsante della Schermata Finale (Repeat Aloud e Why We Say It); il badge Ripasso, nascosto nel primo giro e visibile nel ripasso; lo Sblocco Sequenziale per ascolto in Ripeti a Tempo — la battuta tre non si raggiunge prima della due; "Prossima frase", che chiude il countdown, conta l'uso una volta sola e resta spento mentre parla l'audio; la scelta finale di Ripeti a Tempo, che si accende alla fine della barra dell'ultima battuta e non alla fine del suo audio; e che "← Mappa" non cambi larghezza né posizione quando "Spiegazione" si nasconde (regola 9: colonne fisse, non redistribuite). |
| `test_batch15.js` | che il Traguardo suoni a Schermata Finale GIA' visibile (Match Practice); che le due riserve di messaggi del Ripasso (primo giro e ultimo) siano diverse; che il contatore «TENTATIVO N DI 3» di Voice Practice non sia piu' in ritardo di uno; che **Speed Match congeli il punteggio al primo giro** e il ripasso non lo gonfi (tutto sbagliato e poi corretto al ripasso resta rosso); che Meet the Story, che non mostra skill, ricada sul messaggio neutro `studioCompleteMessages` invece che su uno con un punteggio. |
| `test_batch16.js` | che un nome di persona scelto in Personalizza non venga tradotto nel dialogo (scelto `papa-francesco`, nel dialogo non compare «Francis»); che in Dialogo Continuo «Pausa» sia acceso mentre la battuta parla, la fermi senza far partire il countdown della battuta dopo, e che «Riprendi» la risuoni da capo senza piantare il dialogo; che il badge «Ripasso» di Flash Card resti nascosto nel giro principale e compaia nel ripasso; che «Prossima frase» in Ripeti a Tempo faccia partire davvero la battuta dopo invece di limitarsi a suggerirla; che girare la carta di Flash Card fermi l'audio; che il suono Uscita esista, sia più piano del volume di default (0.15) e più grave delle note del Traguardo, e suoni su «Ho finito, torna alla mappa»; le tre colonne dell'intestazione («← Mappa» a sinistra, «Spiegazione» al centro, «Help» a destra); e che il contatore di avanzamento sia lo stesso, stessa classe e stesso carattere, in Voice Coach e in Flash Card. |
| `test_batch17.js` | la Regola Azione Critica nella sua forma corretta (regola 16): fuori dai profili con countdown NIENTE si blocca mentre l'audio suona — Spiegazione, Help, «Ho finito», Avanti, Registra, le opzioni di risposta, «Sì la so»/«Non ancora» restano attivi — e un'azione critica FERMA l'audio invece di esserne bloccata: «Ho finito», Registra (niente voce del modello nel microfono), rispondere in Match (anche all'audio di un'opzione), girare la carta. Verificato modulo per modulo su sei moduli: Dialogo Ascolta e Ripeti, Repeat Aloud, Meet the Story, Voice Check, Match Practice, Flash Card. E l'eccezione resta tale: in Ripeti a Tempo (countdown) Spiegazione si blocca, e ritoccare la bolla che parla non fa nascere un secondo countdown. |
| `test_batch18.js` | che passando da una battuta all'altra di Ascolta e Ripeti l'evidenziazione resti sulla nuova — la vecchia non se la riprende con un `onEnd` in ritardo, nemmeno dopo una catena rapida di tocchi — mentre il profilo con countdown (Ripeti a Tempo) arriva al suo timer con Spiegazione ancora bloccata; che Spiegazione e Help fermino l'audio (il punto unico della regola 16); che un secondo pulsante di ascolto — anche il Mini Blocco Ascolto di Match Practice — **sostituisca** l'audio invece di fermarlo. |
| `test_batch19.js` | Che in Match Practice e in Speed Match «Non lo so» si spenga insieme alle opzioni subito dopo una risposta giusta — cosi' non puo' sovrascriverla — e torni attivo sulla domanda successiva invece di restare spento; che Spiegazione e Help restino **visibili** anche durante il quiz (in Match Practice, che non ha timer, anche attivi), e in Speed Match si disabilitino solo mentre la barra scorre, riabilitandosi nei tre casi in cui c'e' qualcosa da leggere (risposta sbagliata, «Non lo so», tempo scaduto) e restando spenti — senza sfarfallio — nella pausa dopo una risposta giusta; e che uscire a meta' timer non li lasci spenti alla riapertura. |
| `test_batch2.js` | che Your Story (Personalizza, categoria «Inizio») sia il primo passo della mappa e blocchi tutto il resto finché non è fatto, e che completarla sblocchi il passo dopo; che riaprirla a episodio iniziato chieda la frase di conferma — pulsante spento finché la frase non è esatta — e cancelli davvero i progressi, mentre «Annulla» torna alla mappa senza cancellare niente e chi ha fatto solo Personalizza non vede l'avviso; e che il vecchio flag `customizeSeen` continui a migrare, segnando Personalizza completata senza toccare i progressi già fatti. |
| `test_batch20.js` | che nella direzione it→en il testo mostrato sia davvero ITALIANO davanti e INGLESE dietro: in Flash Card il fronte è una voce italiana dell'episodio e il retro la sua traduzione inglese, in Match Practice la domanda è italiana e l'opzione giusta è la sua traduzione inglese, e in tutti e due l'etichetta della direzione dice «ITALIANO → INGLESE». Un ternario target/native invertito qui si vede subito. |
| `test_batch2b.js` | che dal Pannello Admin si possano provare varianti dell'episodio senza chiedere modifiche. Nella vista di riordino ogni passo e' una coppia modulo+grado con l'etichetta dichiarata in CONFIG; la freccia scambia due passi; il pulsante del grado passa al grado successivo di `CONFIG.grades` (e manca su Personalizza, che non legge contenuto); l'interruttore spegne e riaccende un passo — e ogni modifica finisce negli override in `localStorage`, cioe' sopravvive al ricaricamento. Un passo spento SPARISCE dalla mappa invece di restare grigio: si vede l'episodio come lo vedra' lo studente. In piu', che Match Practice suoni il Traguardo arrivando alla Schermata Finale e che la sua schermata di ripasso venga dal componente condiviso `renderRetryIntroScreen`. |
| `test_batch3.js` | che `?config` nell'indirizzo apra il Pannello Admin al boot (e senza resti chiuso); che il titolo del pop-up «Spiegazione» resti su due righe — «Spiegazione» fissa sopra, il nome del modulo dichiarato in CONFIG sotto, senza trattino lungo; che le categorie mostrate siano quelle del file condiviso (Inizio per Personalizzazione, Quiz per Speed Match, Studia il dialogo per i Dialogo); e che i testi di `istruzioni-moduli.json` non promettano piu' un video, portino il consiglio giusto per tipo di modulo («carta e penna» dove si scrive, «non serve scrivere» dove no), spieghino Dialogo Continuo come «prova generale» e non dicano piu' «finché non...» nel ripasso di Match Practice. |
| `test_batch3b.js` | che l'avviso distruttivo di Your Story usi il pannello rosso dedicato (icona, bordo spesso) e parli di «progressi» ed «esercizi», non di colori né di mastery; che "Mostra pronuncia" di Voice Check compaia solo dove la battuta ha una `pronunciationTip`, tenga nascosto il testo finché non lo si chiede e lo riveli; che la scatola "L'hai imparato?" del Dialogo resti bloccata finché ogni battuta non è stata sentita (in Ascolta e Ripeti; in Ripeti a Tempo si guarda solo che nasca bloccata); che il 3-2-1 di Speed Match usi le frequenze alte dichiarate in `CONFIG`, l'ultima diversa dalle prime due, e non più quelle basse di prima (440/523). |
| `test_batch4.js` | Che il Pannello Admin mostri la descrizione dei parametri che ne hanno una — e **nessuna riga vuota** per quelli che non ce l'hanno — e non mostri `configFieldDescriptions` come se fosse un gruppo di parametri; che in mappa ogni passo porti il suo nome e il suo sottotitolo, col suffisso di direzione (`en→it`) in uno span suo e piu' piccolo del nome, e Personalizza la categoria «Inizio»; e che lo stesso nome compaia nell'intestazione dei moduli aperti. |
| `test_batch4b.js` | che la schermata "Spiegazione" di un modulo mostri il nome di **quel** modulo, non di un altro — compreso il verso, che viene dal nome del PASSO e non dal `kind` (Flash Card: un kind, due passi, «Flash Card en→it»). |
| `test_batch5.js` | che uscire da un Dialogo mentre parla fermi l'audio e non lasci proseguire la sequenza — né dentro il Dialogo lasciato (Dialogo Continuo), né nel modulo aperto dopo (da Ripeti a Tempo a Repeat Aloud, nessuna battuta residua); che in Ripeti a Tempo e Dialogo Continuo «Spiegazione» e «Help» ci siano nell'intestazione e si disabilitino durante il countdown 3-2-1 (Dialogo Continuo) e mentre una battuta parla (tutti e due); e che sulla Schermata Finale spariscano tutti e due — anche «Help», dalla regola 10 riscritta il 2026-09-20. |
| `test_batch6.js` | i tre scalini dell'avviso microfono di Voice Check (2 / 4 / 6 registrazioni vuote di fila: l'avviso, poi «Ricomincia esercizio», poi «Torna alla mappa»), il reset dello streak alla prima registrazione riconosciuta, il blocco a problema confermato (registrazione nascosta, «Avanti» spento: l'unica uscita e' la mappa), e che una risposta **sbagliata ma sentita** non venga mai scambiata per un guasto del microfono. |
| `test_batch7.js` | che la Schermata Finale di Speed Match abbia il titolo fisso («Round completato!») e il sottotitolo pescato dalla SUA famiglia, `speedMatchMessages`, confrontato con le frasi vere lette dal file; che ogni fascia di `moduleCompleteMessages` e di `speedMatchMessages` abbia almeno due frasi distinte, cosi' la rotazione e' possibile; e che la valvola di sicurezza si apra in Match Practice dopo ripetuti sbagli sulla stessa voce, senza offrire «Riprova ancora» (li' non c'e' niente da ritentare subito). Su Flash Card: che il giro si lasci percorrere e arrivi a uno stato noto — riepilogo, ripasso o valvola — invece di restare fermo su una carta. |
| `test_batch8.js` | che in Voice Check, con il microfono dato per guasto (raggiunta la soglia `confirmedAt` di registrazioni senza parole), "Avanti" resti bloccato **anche forzando il click**, il pulsante di registrazione sparisca e "Torna alla mappa" resti come uscita — e che uscire da li' non segni il modulo come completato. E il rovescio: una registrazione riconosciuta prima della soglia azzera il conto, e "Avanti" resta disponibile. |
| `test_batch9.js` | Che le soglie percentuali (`percentageThresholds`: basso, medio, alto) esistano; che i messaggi di fine modulo siano divisi per esito con cinque varianti ciascuno, che il tono «alto» (e il «Si', lo so» del Dialogo) non suggerisca di riprovare, e che la Schermata Finale del Dialogo mostri un messaggio dell'esito scelto; che Repeat Aloud e la storia abbiano una Schermata Finale con un pulsante di completamento esplicito; e che nel Dialogo la riga che spiega perche' la scatola della scelta e' spenta compaia — **col testo di `dialogoShared.choiceBoxHint` letto dal file**, non uno qualunque — finche' non si sono ascoltate tutte le battute, e sparisca quando la scatola si accende. |
| `test_blocco_ascolto.js` | che il Blocco Ascolto sia UN PEZZO SOLO, e che "bloccato" voglia dire la stessa cosa dovunque compaia. Il markup del pulsante "ascolta" + le velocita' deve avere UNA SOLA sorgente in tutto il codice dell'app (index.html piu' tutti i file sotto app/): l'ottava copia scritta a mano, in qualunque file la si metta, fa fallire la CI subito. E nel browser: dentro una card bloccata il blocco si vede SPENTO (opacita' e pointer-events, non il silenzio), e le due varianti dello Sblocco Sequenziale — Why We Say It e il Dialogo — sono inerti allo stesso modo, con la stessa .is-tap-locked. |
| `test_comportamento_audio.js` | che il Blocco Ascolto parli SUBITO al tocco — nello stesso gestore, una volta sola, con la velocità del pulsante — e che un secondo tocco mentre parla fermi la voce; e che il microfono di Voice Practice parta al primo click, si FERMI al secondo, si spenga da solo quando non sente niente (il taglio per silenzio, con l'avviso a schermo), e con i tre timer e il loro riarmo: chi comincia a parlare tardi non viene tagliato e la sua registrazione è tenuta, chi ha finito di parlare non aspetta il tetto, una pausa per prendere fiato non taglia. Cioè il *comportamento*, non la presenza: senza questo file un'estrazione che lascia tutto raggiungibile e cambia l'ordine in cui le cose girano passerebbe verde. |
| `test_config_estratto.js` | che APP_CONFIG viva fuori da index.html e sia già in memoria quando il primo lettore lo cerca: `app/config.js` caricato con un tag BLOCCANTE e PRIMA di `app/avvio.js`, e il blocco d'avvio che non torna in linea in `index.html`. Più due difetti veri del Pannello Admin: che si apra anche da un profilo che ha già risposto una volta a «Hai capito la spiegazione?» (`[D]`), e che il gruppo che l'utente ha aperto resti aperto quando arriva la struttura del corso (`[E]`). |
| `test_config_letta.js` | che ogni parametro di APP_CONFIG — e ogni tabella del magazzino della personalizzazione — sia nominato da qualcuno. Senza, una manopola smette di muovere qualcosa e resta nel Pannello Admin: si gira, non succede niente, e non c'è modo di accorgersene guardando l'app. È il difetto che ha tenuto in vita `pointsPerCorrect` (decisione D4, docs/correzioni.md). E che la lista delle eccezioni non tenga voci che non servono più: coprirebbero in silenzio la chiave che un giorno muore davvero. |
| `test_conta_asserzioni.js` | che il contatore delle asserzioni SI ACCORGA di un calo. E' lo strumento che difende ogni verde della suite da un test che ha smesso di girare — e come ogni strumento di misura, se si guasta non lo dice: continua a stampare un numero, e il numero somiglia a un risultato. Distingue i tre casi con conseguenze opposte — uguale, in aumento (un test nuovo: va bene), in calo (deve fallire e dire QUALE file) — piu' il caso che li confonde tutti: un `.result.txt` mancante, che non e' zero asserzioni ma un file non eseguito. E che `--scrivi` si RIFIUTI quando anche un solo file non ha il suo `.result.txt` ([F]), invece di riscrivere un baseline monco o vuoto che da li' in poi accetta qualunque calo. E ([G]) che nessun test possa restare fuori dalla suite in silenzio: ogni `test_*.js` sul disco gira o e' escluso in `esclusi-dalla-suite.txt` con il suo perche', ogni escluso esiste, lo script non torna a un `FILES="…"` scritto a mano, e senza il file degli esclusi lo strumento si FERMA invece di lanciare tutto in silenzio. E, dal 2026-10-22, che QUALUNQUE ragione per cui il contatore non puo' confrontare — il baseline che manca, il baseline senza una riga leggibile (la chiave sbagliata del 28/09), una riga che non si legge, un file senza il suo `.result.txt`, nessun file contato — esca 3, mai 0: «niente da confrontare» non e' un esito buono ([A], [E], [H]; regola 49). |
| `test_conta_attese.js` | che il censimento delle attese a tempo (`tests/tools/conta-attese.js`) sappia distinguere una GUARDIA — un'attesa da cui dipende il verde di un'asserzione — da un'attesa di NAVIGAZIONE, qualunque sia la funzione di `tests/attese.js` che la ferma; che identifichi ogni punto con l'asserzione INTERA invece che con un pezzo; che tenga a parte le attese marcate `ATTESA-LEGITTIMA` col loro motivo, segnalando quella che il motivo non ce l'ha; e che censisca anche un'attesa che vive in un modulo CONDIVISO, fuori dai file che la suite lancia (blocco [F]). |
| `test_dati_estratto.js` | che chi va a prendere i file arrivi — e arrivi prestissimo: senza `app/dati.js` non parte niente, ne' login ne' casa ne' mappa, perche' `episodeDataFile(id)` gira mentre `MODULE_DESCRIPTORS` viene costruito. E il confine dello strato: `dati.js` non nomina `EPISODES` e non possiede `applyEpisodeDialogue` — l'unica delle quindici funzioni che SCRIVE il catalogo — ma la CHIEDE a chi la possiede; e i `fetch` dell'app stanno tutti in `app/dati.js`, nessuno in un altro file di `app/` ne' in `index.html`. |
| `test_dialogo_extra.js` | che il suono di fine barra suoni UNA volta sola, a barra finita e piu' piano, mai durante; che Ascolta e Ripeti resti a tocco libero; l'eccezione della regola 16 (un tocco a vuoto non interrompe l'audio col countdown, toccare la battuta si' — e con la barra in corso e' la BOLLA intera, non la sola barra, a chiudere il countdown e passare alla battuta dopo); e dal 2026-09-19 L'ETICHETTA SOPRA LA BOLLA del Dialogo, con le due decisioni didattiche della regola 4: porta il CONTORNO e non il solo mestiere, e NON porta il nome scelto. |
| `test_dipendenze_dichiarate.js` | che l'ordine dei tag `<script>` in index.html resti un vincolo DICHIARATO invece che scoperto. Ogni file di `app/` dice in testa da chi dipende e a che titolo — a tempo di PARSING (che obbliga l'ordine) o di CHIAMATA (che non lo obbliga) — e questo file confronta la dichiarazione col codice (`[A]`). Più tre vincoli sulla forma: nessun file dipende A TEMPO DI PARSING da uno caricato dopo di lui (`[C]`); nessun file di `app/` dipende ALL'INSU' da `index.html` (`[B]`, zero, ed e' un invariante); nessun file di `app/` ALIASA un nome che viene da `index.html`, che e' l'ultimo script e farebbe congelare `undefined` per sempre (`[E]`). |
| `test_distrattori.js` | che il numero di risposte sbagliate di Match e Speed Match venga da `CONFIG.sceltaMultipla.distrattori` e non da un numero scritto nel codice, e che un grado troppo piccolo per quel numero FERMI la trascrizione invece di arrivare all'app. |
| `test_edizione_spagnola.js` | che la SECONDA edizione — `spagnolo/it`, trascritta il 2026-09-30 — si apra davvero: l'app puntata a lei (override `edizione`) parte senza schermata d'errore, mostra gli episodi che la SUA struttura dichiara, in quell'ordine e col loro nome, chiede alla voce la lingua dell'edizione, legge i SUOI file, e riempie ogni testo dei quattro gradi e ogni skill dei due episodi senza lasciare segnaposto o «undefined». E che i testi dell'app che erano nel codice vengano dai file: il badge col nome del CORSO spagnolo, il titolo della pagina col nome dell'APP, la scritta della direzione coi nomi spagnoli, il verso «es→it» staccato in mappa, l'etichetta della regola generale dal file condiviso — cambiata la cella, cambia a schermo — col suo grassetto come `<strong>`; `native` dal file condiviso e non dalla struttura; e il nome dell'app GIA' a schermo mentre la struttura non e' ancora arrivata, quello del corso no. |
| `test_edizione_una_volta.js` | che l'edizione — la coppia `{lingua-che-si-impara}/{lingua-studente}` della regola 4 — sia dichiarata in UN PUNTO SOLO (`app/config.js`, come due campi), e che i percorsi dei dati stiano ognuno dalla parte giusta di un confine: cambiata l'edizione, il file EPISODIO e le TABELLE la seguono insieme, cartella e prefisso, mentre istruzioni e messaggi di feedback NON si muovono — dipendono dalla lingua dello studente. E che `app/avvio.js` sia caricato prima di `app/dati.js`, e che, puntata a un'edizione che non esiste, l'app lo DICA con la schermata d'errore invece di partire a meta'. Senza, il guasto e' muto: un'app che legge meta' edizione vecchia e meta' nuova. |
| `test_episodi_corti.js` | che un episodio con una FORMA DIVERSA dal primo non produca silenzio: che un passo con un `kind` sconosciuto non diventi un vicolo cieco muto che blocca per sempre quelli dopo; che un passo puntato su un grado assente non si dichiari COMPLETATO senza far fare niente, registrando pure l'esito; e che la migrazione di `customizeSeen` non scriva in episodi che Personalizza non ce l'hanno. Tre difetti della stessa famiglia — tutti e tre non crollano, e per questo erano rimasti: sembrano funzionare. Diventano urgenti con gli EPISODI CORTI (solo gradi C e D): è lì che tutti e tre mordono. |
| `test_episodio2.js` | che `data/inglese/it/inglese-it-aircraft-door.json` continui a dire quello che dichiara la sua fonte, `docs/inglese/it/inglese-it-aircraft-door.md`: i numeri del riquadro «Numeri attesi nel JSON» (voci per grado, skill contate su tutte le liste, slot), e le cose che un conteggio non vede — che ogni `fromLine` del grado C punti a una battuta vera, che ogni skill abbia titolo e corpo separati (regola 25), che nessun id si ripeta. Quando i due file divergono non crolla niente: i moduli si aprono pieni e hanno l'aria giusta, semplicemente insegnano una cosa che il documento non dice più. |
| `test_errore_caricamento.js` | che un fallimento nel caricamento dei dati diventi qualcosa che lo studente VEDE e da cui può uscire, invece di un modulo che non si apre o che si apre vuoto. Se questo file sparisse, il ramo d'errore tornerebbe a essere codice che non gira mai in nessuna prova: si romperebbe alla prima modifica e nessuno se ne accorgerebbe, perché su Pages i file ci sono sempre — e quando non ci sono è già troppo tardi per scoprirlo. Dopo la rimozione delle copie `window.FALLBACK_*` è l'unica rete rimasta sul percorso di caricamento. E, dal 2026-10-11 (`[G]`): che un file di migrazioni che c'è ma senza `slot` apra la stessa schermata — su Match e su Personalizza — invece di essere letto come «nessun id è mai cambiato», e che un file con `"slot": {}` apra invece il modulo. |
| `test_fatti_app.js` | che `docs/metodo/FATTI-APP.md` dica il vero sul codice. Ogni cosa scritta fra apici inversi nella colonna «Dove sta nel codice» dev'esserci davvero: un percorso dev'essere un file che esiste, ogni altro pezzo dev'essere scritto ALLA LETTERA in uno dei file citati nella stessa cella — e la colonna non porta numeri di riga. Le tre righe che citano un numero del codice lo devono portare uguale a quello che il codice dice oggi ([C]), e la versione del file non puo' essere piu' vecchia della sua riga misurata piu' di recente. |
| `test_hidden_guard.js` | che un elemento con `hidden` sparisca DAVVERO qualunque `display` gli dia una regola d'autore — la guardia della regola 12 — comprese le regole scritte domani: senza questo file una classe che rompesse la guardia (per esempio con un proprio `!important` su un `#id`) riporterebbe a schermo elementi nascosti, e lo si scoprirebbe solo guardando quella schermata invece che in CI. Protegge anche che la prova copra **tutti** i fogli locali di `stile/`: un foglio diventato illeggibile non può lasciare il test girare sulle regole rimaste e dire verde. |
| `test_id_neutri.js` | che dal 2026-10-13 nessun id di passo e nessuna direzione nominino una lingua — `matchTargetNative`, non l'id di prima con «Eng» e «Ita» dentro; `target-native`, non la direzione con «en» e «it» — nelle strutture di `inglese/it` e `spagnolo/it`, nei testi condivisi italiani e in `app/*.js`; e che un profilo salvato coi nomi di prima apra l'app senza errori, PERDENDO il progresso di quei passi e i colori di quelle voci (mentre lo stesso profilo coi nomi nuovi li tiene). |
| `test_identita_estratta.js` | che chi-sei e come-vedi-l'app (`app/identita.js`) arrivino, con un tag suo e bloccante, e arrivino PRIMA di `app/avvio.js` — che ha bisogno della chiave del tema per applicarlo prima del primo disegno; che quella chiave viva in un punto solo (`avvio.js` la legge da `BI.THEME_KEY`, e nel codice di tutta l'app il letterale compare una volta sola); e, guidando l'app, che il selettore dei temi e le icone siano disegnati (la tabella `ICONS` ha traslocato) e che il tema salvato sopravviva alla ricarica — la prova che i due file leggono la stessa chiave e non due stringhe uguali per caso. |
| `test_interruttore_episodio.js` | che scegliere un episodio nel Pannello Admin apra DAVVERO quello, con il suo contenuto. E' l'unica strada che esiste oggi per raggiungere un episodio diverso dal primo: se smette di funzionare, l'app continua a funzionare benissimo — mostrando sempre lo stesso episodio — e nessuno se ne accorge finche' non prova a collaudare il secondo. Protegge anche che l'episodio 2 sia collegato al SUO file dati; che un id inesistente non lasci una pagina bianca ma lo DICA in console; che il pulsante di casa e il badge in mappa nominino lo STESSO episodio, e che il badge ne mostri il NOME — non «Episodio N» ne' l'id; e che il menu segua l'ordine degli episodi dichiarato dal corso (`episodeSequences`), togliendo un id elencato che non esiste e mettendo in coda, invece di farlo sparire, un episodio che esiste e non e' elencato — dicendolo in console in tutti e due i casi. |
| `test_intestazioni.js` | che il trascrittore si fermi quando due colonne di una tabella dei gradi o di una tabella di personalizzazione sono SCAMBIATE — e non solo quando ne manca o ne avanza una. Senza questo file, `en ↔ it` scambiate passano: stesso conto di colonne, e tutto l'episodio esce rovesciato, `target` e `native` invertiti, senza nessun errore. E dal 2026-10-16 che ogni passo della §5 della struttura si controlli contro la §2 e la §4: un grado «—» (o `Z`) o un modulo che la §4 non ha fermano il trascrittore, e due guasti nella stessa riga si nominano tutti e due; che i tre modelli di `docs/metodo/` si trascrivano interi — quello delle tabelle con tutte e due le forme, 4 e 6 colonne, quello della struttura col file condiviso vero, con le intestazioni delle sue tabelle uguali parola per parola a quelle delle edizioni vere, e i tre casi veri (un passo senza grado, lo stesso modulo su due gradi, due categorie). |
| `test_lista_episodi.js` | che lo studente abbia una LISTA DEGLI EPISODI, nell'ordine del corso, e che il successivo si sblocchi quando e' completata **l'ULTIMA POSIZIONE** della sequenza — non un modulo chiamato per nome, non un conteggio. Anche: che un episodio GIA' COMINCIATO non torni bloccato quando si ripersonalizza quello prima (blocco [E]), e che gli episodi della lista li dica la STRUTTURA del corso, non il codice (blocco [F]). |
| `test_listener_una_volta.js` | che ogni pulsante di ogni modulo abbia il proprio listener col NUMERO giusto — né zero né uno di troppo — per tutta una sessione, comprese le riaperture dello stesso modulo e l'apertura di un altro kind servito dalla stessa `open`. I due guasti sono ENTRAMBI SILENZIOSI: attaccato due volte, l'azione parte due volte; non attaccato, il pulsante non fa niente. Il numero viene dal baseline (`tests/BASELINE-LISTENER.txt`), non dal sorgente: sui sette `*-complete-btn`, che ne hanno due (il suono d'uscita di `renderSummaryScreen` e il completamento), un pulsante che SUONA E NON COMPLETA è rosso. |
| `test_magazzino.js` | che **un solo file tocchi il posto dove si salva** quello che lo studente lascia dietro di sé — nessun `localStorage.` in un altro file di `app/` né in `index.html`, e ogni chiamata di `magazzino.js` dentro un `try` — e che quel file **ingoi** invece di alzare: con ogni chiamata al magazzino che alza (navigazione privata, dati del sito bloccati, quota piena) l'app arriva comunque alla prima schermata, senza errori JS non gestiti, e una lettura impossibile torna il valore vuoto. |
| `test_mastery_al_gesto.js` | che quello che lo studente ha fatto dentro un modulo si salvi SOLO se lui lo chiede, premendo il pulsante di uscita: «Ho finito» salva esito, voci e completamento nello stesso gesto; «← Mappa» non salva niente — né i colori della mastery (Match Practice), né l'esito dell'autovalutazione (Dialogo), né le dichiarazioni e i conteggi editoriali (Why We Say It, che aveva due magazzini con due regole). E, a guardia di tutti i moduli insieme, che in tutta l'app esista UN SOLO punto che scrive il magazzino della mastery (`saveMastery`, dentro `commitPendingMastery`; nessun altro passa la sua chiave a `scriviMagazzino`), uno solo che applica la scala dei colori (dentro `recordPendingMastery`), e che il pending si azzeri in `stopAllModuleActivity`. |
| `test_match_practice_nonloso.js` | che in Match Practice il pulsante "Non lo so" torni ATTIVO (e visibile) sulla domanda successiva dopo una risposta giusta. Si spegne insieme alle opzioni al momento della risposta (qmDisableOptions) e lo riaccende chi disegna la domanda nuova (qmRenderQuestion): se quella riga sparisce, dalla seconda domanda in poi lo studente ha davanti un pulsante spento e nessun modo di dire "non lo so" — l'esercizio funziona, ma una delle sue due uscite non c'e' piu'. Non crolla niente, e per questo nessuno se ne accorgerebbe. |
| `test_moduli_registrati.js` | che ogni modulo si apra passando dal registro, e che un `kind` che nessuno ha registrato finisca sulla schermata d'errore invece che nel silenzio — con la causa distinguibile in console, e anche quando il descrittore porta una proprietà (`dialogoProfile`…) che prima bastava ad aprirlo. Che al boot si registrino ESATTAMENTE i `kind` dei descrittori, quattordici, né uno in meno né uno di troppo: un modulo che smettesse di registrarsi non farebbe diventare rosso nessun altro test. Che `flashcard`, un `kind` per due descrittori, sia registrato una volta sola e che entrambe le sue apparizioni nella sequenza lo risolvano. E che l'id di Personalizza non sia scritto a mano fuori dal catalogo: chi ne ha bisogno lo chiede alla costante dichiarativa `ID_PERSONALIZZA`. |
| `test_modulo_pronto.js` | che un modulo non mostri una schermata che si può toccare prima di avere il contenuto su cui lavorare: `openModuleFromMap`, il punto unico da cui passano tutti i moduli, aspetta la personalizzazione e il file dell'episodio PRIMA di aprirli, e Voice Coach non aspetta più un file di testi che non legge. E il rovescio (`[C]`): chi un file episodio non lo legge — Personalizza, l'unico senza `dataFile` — non lo aspetta, e si apre senza la schermata d'errore. |
| `test_new_features.js` | il Pannello Admin per intero — si apre digitando `config` solo FUORI dai campi di testo, mostra la configurazione in gruppi, modifica `APP_CONFIG` in diretta, salva negli override e li riapplica dopo un ricaricamento, rifiuta il JSON non valido senza applicarlo, si chiude con Escape, si azzera col reset (che ricarica e torna al valore di partenza); che la mappa segua l'ordine della sequenza e che **riordinarla dagli override in `localStorage` — la strada vera con cui un riordino arriva in mappa — riordini davvero la mappa**; e i due conti alla rovescia 3-2-1 (Speed Match e Dialogo Continuo) con un tono per cifra, l'ultimo su `ready.finalFreq`. |
| `test_nomenclatura_edizione.js` | che OGNI file di un'edizione porti il prefisso `{lingua}-{studente}-`, e che quel prefisso sia quello DELLA SUA CARTELLA; che ogni episodio dichiarato nella struttura abbia SIA il markdown SIA il JSON; che i file di `condivisi/{studente}/` portino la loro convenzione — una lingua sola, `it-istruzioni-moduli.json` — perché `condivisi` è un nome riservato e non una lingua; e che ogni edizione abbia il suo `{L}-{S}-migrazioni-personalizzazione.json` con `slot` come OGGETTO: l'app lo chiede sempre, e senza lo studente si trova davanti la schermata d'errore. |
| `test_non_con.js` | che una voce dichiarata «non con» un'altra non le compaia MAI accanto come alternativa in Match e Speed Match (su 300 estrazioni, mentre la stessa voce senza `nonCon` le vede), che la colonna `non con` arrivi dai markdown degli episodi al JSON (`nonCon`) senza che passino una coppia scritta in un verso solo, un id fuori dal grado o una voce che esclude sé stessa, che il bacino si misuri PER VOCE (`voci − 1 − esclusi`) — una voce con troppe esclusioni ferma anche se il grado «basta», e il grado B di `spagnolo-it-gate`, a margine zero, si ferma alla prima coppia — e che il MODELLO degli episodi si trascriva davvero, coi fermi di forma, senza il controllo del bacino che lì direbbe rosso. |
| `test_ogni_riga.js` | che OGNI riga di OGNI tabella di personalizzazione, in ogni edizione, produca frasi giuste in ogni testo dell'episodio che la usa — non solo il predefinito, che è l'unica riga che il resto della suite guida. Senza questo file, la nona riga di una tabella è coperta come una riga scritta a caso: «I am from Lugano, Italy» uscirebbe a schermo con la suite verde. |
| `test_orchestrazione_estratta.js` | che il meccanismo delle viste viva fuori da index.html, e che il suo tag stia DOVE DEVE — in fondo a <body>, dopo il markup delle viste e prima dello script che accende l'app, non in <head> con gli altri. Spostato in <head> — dove uno andrebbe a metterlo per simmetria — i nodi delle viste diventano `null` e l'app non arriva alla schermata del nome: un guasto grosso che nasce da una modifica che sembra un riordino innocuo. E che lo strato tenga NOMI senza chiamare funzioni di modulo, con gli id delle viste scritti per intero, e che `BI.views` porti tutti i nodi veri, nessuno null, con una sola vista accesa alla volta. |
| `test_ordine_episodi_pannello.js` | che la lista degli episodi del Pannello Admin sappia fare le due cose per cui esiste — SPOSTARE un episodio e SPEGNERLO — e che l'effetto arrivi allo studente dopo una ricarica, non solo alla riga del pannello. Senza questo file il pannello continuerebbe a disegnare frecce e occhi che si ridisegnano correttamente sotto le dita e non salvano niente: il difetto peggiore di questa famiglia, perche' la schermata risponde e sembra andata. PROTEGGE ANCHE che non esista nessun posto dove SCRIVERE un id di episodio: la lista mostra tutti gli episodi che ESISTONO, col loro nome e non col loro id, quindi un id inesistente non si puo' inserire. PROTEGGE ANCHE che spegnere NON sia cancellare: i progressi di un episodio spento restano nel magazzino e tornano quando lo si riaccende — l'unica parte di questo passo che, se cade, cade sui dati di qualcuno. E che spegnerli TUTTI non lasci la lista dello studente vuota in silenzio: `resolveEpisodeOrder` li tiene tutti e lo dice in console. E, dal 2026-10-22, che lo spegnimento sia DEL CORSO: un episodio spento in un'edizione resta acceso nelle altre, anche se ha lo stesso id ([E]). |
| `test_outcome_step_ids.js` | che la regola di esito e la regola del tentativo arrivino a OGNI apparizione di un modulo nell'ordine, non solo alla prima. Senza, la mappa torna a colorare il passo 4 e a lasciare grigio il passo 9 a parità di risposte, in silenzio — che è com'era prima della correzione del 2026-09-05. E, dal 2026-09-09 (blocco [D]): che nei due pannelli-report due apparizioni dello stesso modulo si DISTINGUANO. |
| `test_override_per_edizione.js` | che quello che il Pannello Admin salva su una sezione che viene dai file di un'edizione — la struttura del corso, le tabelle dei nomi, le due lingue della voce — resti a QUELL'edizione, e non arrivi alle altre: toccare la velocità della voce in inglese/it non deve far parlare inglese a italiano/es, spegnere un episodio in un corso non lo spegne negli altri. E che le sezioni dell'app (la velocità della voce compresa) valgano invece per tutte; che un valore del corso salvato nella forma di prima, nella chiave comune, si ignori; e che «ripristina i valori di partenza» tolga le chiavi di tutti i corsi. |
| `test_progressi_estratto.js` | che il magazzino dei progressi dello studente (`app/progressi.js`) arrivi, e arrivi PRIMA di chi lo usa — senza, l'app parte ma la mappa non si apre, senza nessuna schermata d'errore. E, dal 2026-09-24 (passo 1.16), che OGNI chiave per episodio sia dichiarata in `CHIAVI_EPISODIO` e che la ripersonalizzazione cancelli passando da quel registro — blocco [D]. |
| `test_pulizie_registrate.js` | che uscire da un modulo fermi davvero tutto, adesso che `stopAllModuleActivity` non nomina più nessuna famiglia di moduli: al boot si registrano ESATTAMENTE 5 pulizie, le tre che non appartengono a nessun modulo (`fermaLaVoce`, `closeAttemptPopup`, `clearPendingMastery`) restano nominate, e uscendo da Ripeti a Tempo non sopravvive nessun timer e l'audio è fermo. E che una pulizia che esplode non chiuda lo studente dentro l'app — si apre un modulo, si torna alla mappa, le pulizie dopo quella rotta girano — senza diventare silenziosa: il fallimento viene riportato col nome della pulizia, e in una sessione normale nessuna pulizia fallisce. |
| `test_quiz_engine_estratto.js` | che il motore che CALCOLA un esito (`app/quiz-engine.js`) arrivi — con un tag suo, bloccante, dopo `app/spazio.js` — e che calcoli giusto: quattro risposte note, una per famiglia (distanza `similarity`, conteggio `tokenize`, soglia `percentageBucket` letta da `CONFIG`, giudizio `classify`), perche' un motore che c'e' e risponde sbagliato e' peggio di uno che manca. E il suo confine: dentro le funzioni che restituiscono un VALORE, fuori quelle che restituiscono MARKUP — niente markup nel file, `starsForPercent` dentro, `renderStars` fuori. |
| `test_report_mastery.js` | che il pannello dei colori delle voci mostri quello che c'è davvero nel magazzino, ordinato per chiave, e soprattutto che LEGGA E BASTA. È uno strumento per guardare un dato che a schermo non compare da nessun'altra parte: se mostrasse un numero sbagliato nessuno potrebbe accorgersene confrontandolo con qualcosa, perché non c'è nient'altro con cui confrontarlo. Protegge anche che ogni riga porti il livello che ha nel magazzino, che il conto per livello sia quello vero, e che senza colori il pannello non mostri righe ma lo dica a parole. |
| `test_risposta_una_volta.js` | che una carta di Flash Card si risponda UNA VOLTA SOLA, anche se il dito preme tre volte di seguito sullo stesso pulsante — «Lo so» o «Non ancora»: il contatore avanza di una carta, la voce si registra una volta sola e col livello che la regola 39 le dà. Senza, una voce mai vista salta a verde alla sua prima risposta, e quella mastery sbagliata non la vede nessuno. Che la guardia stia nella FUNZIONE che esegue la risposta, alzata prima di registrare (regola 20), e non nei listener. E che Match e Speed Match continuino a spegnere le opzioni e il «Non lo so» appena si risponde: sono protetti dal markup, e togliere quel `disabled` li riporterebbe esposti. |
| `test_sblocco_sequenziale.js` | la promessa dello Sblocco Sequenziale nelle due varianti fra i passi di un modulo — per dichiarazione (Why We Say It) e per ascolto (Ripeti a Tempo): un passo più avanti della sequenza NON risponde a niente — nessun audio, nessun cambiamento, la sequenza non avanza — mentre il passo raggiungibile continua a rispondere. E il COLORE in Why We Say It: l'accento compare una volta sola nella colonna, sulla card corrente, e nessuna regola bloccata lo usa. Senza questo file la sequenza torna a essere solo un effetto grafico: la card sembra spenta, ma il pulsante dentro funziona ancora e l'audio parte lo stesso, che è esattamente il difetto trovato al 6° collaudo nella variante per dichiarazione mentre quella per ascolto era già a posto. |
| `test_scala_colori.js` | la scala rosso→giallo→verde dei colori per voce (applyMasteryResult) — sale solo con la costanza, scende di un gradino solo, non salta, onora CONFIG.mastery.promotionStreak invece di avere il numero cablato dentro, e dà alla PRIMA risposta il colore che quella risposta merita invece di parcheggiare tutto su rosso. È il dato più costoso da ricostruire dell'intera app: si accumula per voce, per utente, su ogni modulo, e una regressione qui non si vede in nessuna schermata — si vede solo dopo settimane, in colori sbagliati che nessuno sa più da dove vengono. |
| `test_scala_unica.js` | che dal 2026-10-16 le stelle di Voice Practice e Voice Check e il messaggio di fine modulo leggano UNA scala sola, `percentageThresholds` — così ritoccarne una soglia dal Pannello sposta insieme stelle, messaggio e colori (spostato `medio` a 60, al 55% una stella, «basso», «rosso»), e Voice Check non può mostrare «tre stelle» sopra un messaggio «medio». E che la seconda scala, `voiceCoach.starThresholds`, non torni: né in `APP_CONFIG`, né nel codice, né fra le descrizioni del Pannello. |
| `test_schermata_attesa.js` | che fra l'apertura della pagina e l'arrivo di `struttura-corso.json` lo studente veda una FRASE e non il bianco — e che quella schermata se ne vada da sola quando i dati arrivano, lasciando accesa solo la schermata giusta. E i DUE TEMPI di `APP_CONFIG.attesa`: con la soglia alta e i dati veloci la schermata non compare MAI, e una volta comparsa resta almeno il minimo chiesto. |
| `test_selettori_sequenza.js` | che si possa avere PIÙ DI UNA sequenza di moduli, sceglierne una per episodio e modificarne una qualsiasi dal Pannello Admin — e che una sequenza aggiunta al file non sparisca per colpa di un override salvato prima. Protegge anche che un nome di sequenza che non esiste resti selezionato e lo dica, invece di cambiare da solo al primo salvataggio, e che il riordino finisca sulla sequenza SCELTA e non su quella dell'episodio aperto. |
| `test_sequenze.js` | che ogni episodio dichiari la propria sequenza di passi, che le due strade per dichiararla (`sequence` per nome, `moduleOrder` per intero) non si sovrappongano in silenzio — dichiararle entrambe, o nessuna, è un errore detto e non risolto scegliendone una, e non esiste più un `moduleOrderDefault` da ereditare — e, la cosa che pesa di più, che passare alle sequenze NON abbia mosso nessun id di passo: se un id si muove ogni studente riparte da zero senza che niente si rompa a schermo. E, dal 2026-09-09 (passo 8), che i due episodi mostrino gli STESSI passi con la stessa categoria: i descrittori di `modulesById` sono uno solo e ogni episodio ne riceve una copia, e se un episodio ne perdesse uno l'app non si romperebbe — mostrerebbe una riga senza categoria, e nessuno saprebbe quale dei due episodi è quello giusto. |
| `test_spazio_nomi.js` | che un file che arriva DOPO possa registrarsi da sé nello spazio dei nomi — e che la pulizia e il modulo che registra vengano davvero usati —, e che le due collezioni non si azzerino quando qualcuno si ricarica. Il guasto che conta: `window.BI = {}` al posto di `window.BI = window.BI \|\| {}` non dà nessun errore e cancella in silenzio quello che gli altri hanno registrato. E il caso più diverso (`[C]`): un `kind` mai registrato è `undefined`, non un guasto, mentre registrare due volte lo stesso `kind` o qualcosa che non è una funzione esplode subito. |
| `test_stile_estratto.js` | che il CSS resti in `stile/` — dodici fogli, caricati NELL'ORDINE dichiarato — e che quell'ordine continui a produrre la stessa cascata: un foglio che manca, vuoto o non caricato, e un token dei temi che non arriva ai componenti degli altri fogli, non alzano nessun errore nell'app. |
| `test_story_modules.js` | che Meet the Story e Why We Say It — i due moduli del componente della storia — mostrino allo studente l'episodio giusto nel modo giusto. Senza questo file nessuno guarderebbe: che il JSON dell'episodio `gate` coincida carattere per carattere con le tabelle di `docs/inglese/it/inglese-it-gate.md` e porti i numeri che quel file dichiara (voci per grado, skill, slot); che ogni skill sia una voce di una LISTA, con titolo e corpo separati, anche quando una battuta ne porta due; che Meet the Story mostri il dialogo con le traduzioni e senza skill, con «Ho finito» subito libero; che Why We Say It al primo giro imponga la sequenza — una regola alla volta, le successive attenuate e col lucchetto, «Ho finito» bloccato finché non sono dichiarate tutte — con le tre risposte, la frase di supporto, «Esci e riprendi dopo» che salva e riprende dalla prima non dichiarata mentre «← Mappa» non salva; che al ripasso tutte le regole siano raggiungibili e il punteggio autodichiarato diventi l'esito (tutte chiare → 100% → verde). E che il magazzino dell'autovalutazione tenga la risposta CORRENTE e non la somma dei tocchi — una battuta vale un voto in tutto — e che le etichette sopra le bolle siano quelle del file episodio: senza il nome scelto (sopra la bolla «Papà», non «Marco») e col contorno («Hostess al gate», non «Hostess»). |
| `test_stringhe_markup.js` | che le stringhe che lo studente legge dentro un modulo e nella mappa NON siano scritte in `index.html` né dentro `app/*.js`, e che il markup le riceva davvero invece di restare vuoto: ogni `data-testo` punta a un testo che esiste nel file — una chiave sbagliata non alza e non lascia un rosso, `uiText` torna stringa vuota e il pulsante resta senza scritta —, a modulo aperto nessun elemento resta vuoto, la Spiegazione aperta DALLA MAPPA prima di qualunque modulo ha già titolo e «Chiudi», e la mappa raggiunta a freddo da casa non compare prima dei suoi testi. |
| `test_struttura_corso.js` | che `docs/inglese/it/inglese-it-struttura-corso.md` e la struttura viva dicano la stessa cosa. Il markdown e' la fonte (regola 26) e `APP_CONFIG` l'esecuzione: se divergono, si legge un documento che descrive un'app diversa da quella che gira — ed e' il caso in cui non se ne accorge nessuno, perche' il documento resta plausibile. Si confrontano i gradi coi loro nomi, le categorie (ognuna con la sua etichetta nel file condiviso), i nomi e le categorie dei moduli, le sequenze dei moduli passo per passo, gli episodi con la sequenza che chiedono e il loro ORDINE, l'episodio d'ingresso, le due lingue del parlato. |
| `test_suoni_estratto.js` | che i toni dell'app arrivino — e che si sappia che la loro assenza NON somiglia a un guasto: senza `app/suoni.js` l'app si apre, arriva alla mappa e non da' errori, e il guasto compare solo al primo Corretto, dentro un esercizio. Lo strato dichiara l'`AudioContext` (che `index.html` non nomina piu') e porta con se' i due listener del risveglio; chiamare un suono davvero non solleva, e il contesto esiste davvero. |
| `test_tabella_protegge.js` | che la tabella «Cosa protegge ogni file» di `tests/README.md` resti GENERATA dalle testate `// PROTEGGE:` e non torni una copia a mano — una riga corretta nel README e non nella testata, o un file di test nuovo senza testata, fanno diventare rossa la suite invece di divergere in silenzio. E che la tabella dica di sé, nella prima riga, che è generata e non si modifica a mano. |
| `test_tabelle_personalizzazione.js` | che il magazzino della personalizzazione — nomi, città, paesi — resti FUORI dal codice e arrivi da un file, e che nessuno torni a leggerlo come se fosse già in memoria: `APP_CONFIG` non contiene più quelle tabelle, quindi una lettura sincrona non è sbagliata, è impossibile. Più: il file non viene nemmeno chiesto alla rete prima del login; gli slot di ogni episodio si risolvono dal file senza restare vuoti, anche con la rete lenta; il Pannello Admin si apre col magazzino in ritardo e i suoi gruppi arrivano dopo, aggiunti e non ridisegnati; e l'override salvato dal Pannello Admin nella chiave del corso sopravvive allo spostamento, invece di restare scritto in un magazzino che nessuno legge. |
| `test_tendina_edizione.js` | che l'edizione si scelga dal Pannello Admin con un MENU delle edizioni che esistono — scritte dal trascrittore in `data/edizioni.json` — e non scrivendo a mano due caselle di testo, e che quel menu sia l'uscita anche quando l'app è murata su un'edizione che non esiste. |
| `test_testi_condivisi.js` | che dal 2026-10-13 i sottotitoli dei moduli, le etichette delle categorie e `nomiASchermo.native` vivano UNA volta sola, nel file condiviso della lingua dello studente, e che l'app li legga da lì. Senza questo file, una seconda copia nella struttura di un'edizione tornerebbe senza rumore — e la mappa mostrerebbe il testo di un file mentre chi scrive corregge l'altro. Il trascrittore si ferma se ne manca uno o ne ricompare una copia; e senza il file condiviso l'app si ferma all'avvio sulla schermata d'errore, con la frase di ultima istanza, e «Riprova» col file tornato arriva alla prima schermata. |
| `test_testi_dal_markdown.js` | che i JSON che l'app carica siano ESATTAMENTE quello che i loro markdown generano (regola 26) — una modifica fatta a mano nel JSON sparirebbe in silenzio al prossimo giro del trascrittore —, e che i 32 titoli di ogni file dei testi condivisi, che non sono piu' scritti da nessuna parte, SI SAPPIANO DERIVARE — tutti, per ogni chiave, compreso `flashcard`, l'unico kind con due passi: una derivazione che non risolve apre il pop-up col titolo vuoto, senza eccezioni e senza rossi. E che il trascrittore SI FERMI invece di scrivere un vuoto o una cosa sbagliata: su un titolo cercato che compare due volte, su una tabella obbligatoria senza righe, su un suffisso che non e' un ruolo (`:es`), su una seconda tabella in una sezione di un file episodio; che ogni titolo `##`/`###` di ogni markdown di contenuto compaia una volta sola; e che il grassetto della regola generale diventi `<strong>` invece di asterischi a schermo. |
| `test_testi_interfaccia.js` | che i testi dell'interfaccia arrivino DAVVERO da data/condivisi/it/it-istruzioni-moduli.json (regola 8), e non tornino di nascosto nel codice — e che la riga che lo rende possibile non sparisca (`loadModuleInstructions()` nel `Promise.all` di `openModuleFromMap`): senza, l'app non crolla, mostra stringhe VUOTE. Protegge anche che Personalizza, l'unico dei sedici moduli senza `dataFile`, si apra lo stesso; e che finche' il file dei testi non arriva non compaia NESSUNA schermata — ne' il nome, ne' la home, ne' la mappa, e nemmeno l'errore: si aspetta — e che, arrivato, la home e l'intro della mappa abbiano le loro etichette. |
| `test_traducibilita_per_riga.js` | che sia la RIGA del magazzino a dire se il suo valore si traduce, e non il nome della tabella che la contiene — altrimenti un cognome che si traduce, o una citta' che non si traduce, non avrebbero modo di esistere se non spostando la riga in un'altra tabella. E con lei: che ogni riga lo DICHIARI e nessuna porti piu' le colonne `fr`/`es`/`de` ([A]); che ogni tabella nominata da un episodio esista e ogni valore predefinito esista dentro la sua tabella ([A2]); che una personalizzazione salvata non sparisca quando un id viene rinominato, che la mappa delle migrazioni resti append-only e che un id mai esistito cada sul PREDEFINITO dello slot e non sulla prima riga ([M1], [M2], [M3]); che un campo che la riga non ha non diventi «undefined» ([P]); e che il suffisso di un segnaposto sia un RUOLO (`:target`, `:native`), con un suffisso vecchio che resta segnaposto visibile e mai «undefined» ([S]). |
| `test_trascrittore_fermate.js` | che il trascrittore, davanti a un markdown obbligatorio che manca, si FERMI PRIMA DI SCRIVERE e dica TUTTI i mancanti con percorso e chi li chiede — compresi i due file condivisi di una lingua-studente che non ha la sua cartella — invece di morire con un `ENOENT` e lo stack trace, magari a meta' della scrittura; e che crei da solo le cartelle di `data/` che un'edizione nuova chiede, ma solo quando scrive davvero, mai sotto `--controlla`. |
| `test_tutte_le_edizioni.js` | che OGNI edizione elencata in `data/edizioni.json` parta davvero nel browser — prima schermata, schermata iniziale, mappa del primo episodio — leggendo i testi condivisi della lingua del SUO studente e non di un altro. Senza questo file, un'edizione nuova entra nell'elenco e nel Pannello Admin senza che nessun test l'abbia mai aperta. |
| `test_ui_condivisa_estratta.js` | che l'interfaccia che un modulo INDOSSA — i due overlay, i testi letti dal file delle istruzioni, il sottotitolo d'esito, le stelle, il popup dei tentativi, il pannello Help, la barra del tempo — viva fuori da index.html, e che NON si porti dietro lo stato di sessione: il file non deve nominare `currentEpisode`, `currentValues`, `pendingMastery`. Si romperebbe in silenzio anche: che i listener dello strato ci siano (senza, gli overlay non si chiudono e nessun errore lo dice); che i pulsanti DENTRO il pannello Help funzionino e che una richiesta d'aiuto inviata arrivi nel magazzino; che la barra del tempo porti la durata chiesta; e che il pannello Help, aperto prima che i suoi testi arrivino, non si mostri VUOTO. |
| `test_uscita_dal_modulo.js` | che uscire da un modulo lo PULISCA davvero — timer, registrazioni, sequenze — adesso che la pulizia non e' piu' dentro `showView` ma dentro `leaveModule` (passo 22, 2026-09-17; CLAUDE.md regola 21): i chiamanti diretti di `showView` restano esattamente quelli dichiarati in `tests/BASELINE-USCITA.txt`, i punti che lasciano un modulo passano da `leaveModule` e sono 12, e uscendo da ognuna delle famiglie di `FAMIGLIE` le pulizie di `BI.pulizie` girano davvero. E che sulla Schermata Finale l'unica uscita rimasta SALVI: la riga delle azioni e' vuota, e «Ho finito» scrive la mastery in sospeso nel magazzino e segna il modulo completato — prima «← Mappa» li' buttava via l'esercizio in silenzio. Tutti e sette i moduli con Schermata Finale chiamano `barraAzioniFinale` e nessuno si e' tenuto la sua copia della vecchia riga; Voice Coach blocca ancora la riga mentre registra (`lockModuleHeader`). |
| `test_uscita_dal_muro.js` | che una configurazione sbagliata non possa MURARE l'app — che resti sempre almeno una strada per disfarla: con l'app murata da un override su `edizione`, il Pannello Admin si apre dalla sequenza da tastiera e da `?config` nell'indirizzo, senza cadere, coi report che dicono perché non ci sono; la terza uscita della schermata d'errore compare solo se ci sono override salvati; e il ripristino toglie l'override e smura l'app. |
| `test_valori_del_corso.js` | che i valori degli slot di personalizzazione (i nomi della famiglia, il cognome, la città di partenza) siano DEL CORSO e non dell'episodio — il cognome scelto in `gate` è quello che si trova aprendo `aircraft-door`, invece del predefinito — e che salvare da un episodio che ha meno slot NON cancelli gli altri: il cognome cambiato in `aircraft-door` (l'unico slot che ha) lascia intatti papà, mamma, figli e partenza scelti in `gate`. |
| `test_versione_cache.js` | che TUTTI i tag di `index.html` — gli script di `app/` e i fogli di `stile/` — portino LA STESSA versione (`?v=`, nella forma AAAAMMGG + lettera), che con quei tag l'app arrivi al login senza nessun file in 404, che anche i file di DATI portino la stessa versione dei tag, e che la guardia che la fa salire (`tests/tools/versione-salita.js`) sappia dire di no. Senza, un browser puo' tenere `index.html` nuovo e un file di `app/` vecchio: un'app che nessuno ha mai scritto, e che nessun test riproduce. |
| `test_voce_edizione.js` | che la voce che legge le frasi segua la LINGUA DELL'EDIZIONE, con i gradini decisi da chi guida il progetto il 2026-10-01 — prima le preferite di quella lingua, poi la varietà ESATTA (`es-ES`), solo dopo un'altra varietà della stessa lingua (`es-MX`), e MAI un'altra lingua — e che il Pannello Admin DICA quale voce sta usando, ripiego compreso. Anche `es_ES` col trattino basso è la varietà esatta; l'inglese tiene la sua preferita; un elenco di voci salvato dal pannello prima del 2026-10-01 vale solo per l'inglese e non trascina lo spagnolo su una voce inglese. |
| `test_voicecoach.js` | il giro completo di Voice Check: «Avanti» bloccato finche' non si registra (spento sulla prima frase, acceso subito dopo la valutazione, di nuovo spento sulla frase da ripassare), nessun pulsante «Indietro», una frase andata male (0 stelle) che finisce nel ripasso con la schermata condivisa `.retry-intro` — e ripetuta bene prende almeno due stelle —, la Schermata Finale col pulsante esplicito «Ho finito, torna alla mappa», il suono Traguardo e Spiegazione nascosta, e il modulo NON completato prima di quel pulsante (regola 7): toccato, torna alla mappa e segna il modulo. |
| `test_zero_per_cento.js` | che dal 2026-10-16 a 0% di risposte giuste NON compaia nessun messaggio di fine modulo, e che la manopola `percentageThresholds.basso` decida davvero dove il messaggio comincia — senza toccare gli altri due mestieri della stessa scala: il colore del badge (a 0% rosso) e il colore della parola in Voice Check (a 0% `wrong`). |

<!-- FINE DELLA TABELLA GENERATA -->

---

## GLI EPISODI — IL TABELLONE

**Perché esiste, ed è un fatto misurato il 2026-09-21, non un timore:** i due
episodi erano protetti **in modo diverso, e nessuno l'aveva deciso**. Tre
controlli esistevano solo per `gate`, due solo per `aircraft-door`, e la
differenza non era scritta da nessuna parte — quindi non era una scelta, era
quello che succede quando la stessa cosa viene scritta due volte in due
momenti diversi.

⚠️ **E il motivo scritto per cui NON erano uniformi era SCADUTO.** In testa a
`test_episodio2.js` c'era: *«qui non si può: i due markdown hanno una forma
diversa — il grado A dell'episodio 2 è una lista in prosa, il vocabolario sta
in una sezione a parte e il dialogo in un'altra ancora»*. Era vero quando fu
scritto. **Non lo è più da quando `REGISTRO-EPISODI_004` ha dichiarato le
tredici sezioni uguali per ogni episodio:** le tabelle dei due file hanno oggi
le stesse intestazioni e le stesse colonne. *È la regola 32 vista da dentro —
un limite dichiarato dice dove non guardi, non impedisce di fidarsene.*

### Due famiglie, e hanno rischi OPPOSTI

**Questa è la distinzione che decide tutto il resto, e va letta prima del
tabellone.**

| | Test di **FILE** | Test di **COMPORTAMENTO** |
|---|---|---|
| Cosa fa | legge il markdown e il JSON, li confronta | apre il browser e pilota l'app |
| Quanto costa per episodio | **millisecondi** | **secondi o minuti** |
| Se MANCA a un episodio | ⚠️ **area scoperta**: quell'episodio può essere sbagliato e nessuno lo sa | quasi niente — protegge i **moduli**, e i moduli sono gli stessi |
| Se c'è su TUTTI | giusto, e costa nulla | ⚠️ **ridondanza che moltiplica la suite** per il numero di episodi |
| **La regola** | **TRASVERSALE: ogni episodio, sempre, senza eccezioni** | **UNO SOLO, scelto e dichiarato qui** |

> **I due rischi sono opposti, quindi le due regole sono opposte.** Un test di
> file che salta un episodio lascia un buco; un test di comportamento che li
> prende tutti paga venti volte la stessa protezione.

*Con venti episodi: i test di file restano nell'ordine del secondo; pilotare
ventidue moduli su venti episodi moltiplicherebbe per venti la parte lenta
della suite — e proverebbe ogni volta la stessa cosa, perché il modulo non
cambia con l'episodio.*

### Il tabellone — chi verifica cosa, oggi

**`U` = universale**, vale per ogni episodio · **`C` = condizionato**, e la
condizione è scritta.

| Cosa si verifica | `gate` | `aircraft-door` | U/C |
|---|---|---|---|
| le conte di A, B, C, D dichiarate combaciano col JSON | ✅ | ✅ | **U** |
| la conta delle skill dichiarata combacia | ✅ | ✅ | **U** |
| la conta degli slot dichiarata combacia | ✅ | ✅ | **U** |
| ogni skill ha `title` e `body` separati (regola 25) | ✅ | ✅ | **U** |
| `whatYouLearn` è **sempre una lista** | ✅ | ❌ | **U** |
| nessun id ripetuto nel file | ❌ | ✅ | **U** |
| ogni frase del grado C viene da una battuta che esiste | ❌ | ✅ | **C** — solo se l'episodio ha un grado D |
| i nomi dei gradi sono quelli mostrati allo studente | ✅ | ❌ | **U** |
| **il JSON coincide col markdown carattere per carattere** | ✅ | ❌ | **C** — solo se il markdown porta le quattro tabelle dei gradi |
| i segnaposto della fonte e del JSON si corrispondono | ✅ | ❌ | **C** — solo se l'episodio ha segnaposto |
| chi parla in ogni battuta corrisponde allo stesso ruolo | ✅ | ❌ | **C** — solo se l'episodio ha un grado D |
| **pilotare i moduli nel browser** | ✅ 81 asserzioni | ❌ | ⚠️ **UNO SOLO: `gate`** |

**Le sei `U` con una ❌ sono aree scoperte, non scelte.** Le quattro `C` sono
scelte, e adesso hanno la loro condizione scritta accanto.

⚠️ **`gate` è l'episodio pilotato nel browser, e non per caso: è il più
ricco** — otto slot di personalizzazione contro uno, e tutte e quattro le
tabelle. *Un episodio più povero proverebbe meno cose allo stesso prezzo.*
Se un giorno nascerà un episodio che porta una forma che `gate` non ha, il
pilotato diventa quello, **e questa riga cambia** — non se ne aggiunge un
secondo.

### Quando arriverà un episodio che non è una storia

⚠️ **NON È «forse»: è un fatto dichiarato da chi guida il progetto il
2026-09-21 — «sicuramente gli episodi grammaticali non avranno il grado D».**
Il catalogo avrà episodi `grammatica` e `pronuncia` (`REGISTRO-EPISODI_022`),
con meno moduli e **senza dialogo**. Il tabellone è costruito per quel
giorno: **le `U` valgono lo stesso** — le conte, le skill, gli id, i nomi dei
gradi non dipendono dalla categoria — **e le `C` si spengono da sole**, perché
la loro condizione guarda cosa l'episodio *ha*, non cosa *è*.

⚠️ **La condizione non è mai la CATEGORIA.** «Se è un episodio di grammatica,
salta il controllo del dialogo» legherebbe un test a un'etichetta che chi
scrive gli episodi può cambiare in qualunque momento, per ragioni didattiche
che col test non c'entrano. *La condizione giusta è «se ha un grado D»: la
guarda nel file, e non può sbagliarsi.*

### ⚠️ IL TEST TRASVERSALE SI SCRIVE AL QUINTO EPISODIO, NON PRIMA

**Deciso il 2026-09-21 da chi guida il progetto**, ed è una decisione presa
guardando questo tabellone: *«gli episodi li creiamo manualmente, non
sovraccarichiamo ora»*. **La ragione tecnica che la regge:** un test
trasversale scritto oggi sarebbe la generalizzazione di **un** caso — i due
episodi che esistono sono tutti e due `storia`, tutti e due
`narrativo-standard`, tutti e due con le quattro tabelle. *E la regola 42 dice
che una riga condivisa va provata sul caso più diverso, che qui non esiste.*

**Cosa costa aspettare, e non è zero:** le caselle ❌ restano scoperte, e ogni
episodio nuovo nasce con la propria copia dei controlli.

⚠️ **Al quinto episodio si torna qui e si guarda la tabella, non la memoria:
se le colonne si somigliano il test trasversale si scrive; se non si
somigliano, la differenza è vera — e il tabellone l'ha già spiegata.** *È il
solo modo di prendere quella decisione su un fatto invece che su
un'impressione.*

### ⚠️ Il tabellone si aggiorna quando nasce un episodio

È la riga che manca alla checklist di `inglese-it-edizione`, sezione 2.8,
e sta qui e non lì perché quello è un file di contenuto e questo parla di test.
*Quel file è uscito dal repository il 2026-09-29: sono le RAGIONI
dell'edizione, e le tiene chi guida il progetto.*
**Un episodio nuovo non aggiunge un file di test: aggiunge una colonna a questa
tabella, e le `U` devono essere tutte ✅ prima che l'episodio sia finito.**

---

## LE ANCORE DI TESTO CHE UN TEST AFFERRA

**Tre markdown di `docs/inglese/it/` sono letti da un test.** Tutti gli altri
file di `docs/` — inventario grammaticale, obiettivi, sequenza degli episodi,
tabelle di personalizzazione — **non sono letti da nessuno**: si possono
riscrivere da capo senza toccare la suite.

⚠️ **Nei tre che sono letti, un test cerca una STRINGA e legge la tabella che
la segue.** Riscrivere quella stringa non rompe niente in modo rumoroso: fa
**sparire** delle asserzioni. *È successo il 2026-09-21 — 99 asserzioni ferme
su due file perché un riquadro era passato da citazione a paragrafo, e si è
visto solo perché il contatore delle asserzioni lo ha detto.*

| File | Ancore portanti | Chi le afferra |
|---|---|---|
| `inglese-it-gate.md` | `Numeri attesi nel JSON` · `### Grado A` · `### Grado B` · `### Grado C` · `### Grado D` | `test_story_modules.js` |
| `inglese-it-aircraft-door.md` | `Numeri attesi nel JSON` | `test_episodio2.js` |
| `inglese-it-struttura-corso.md` | `## 2 — I GRADI` · `## 3 — LE CATEGORIE DEI MODULI` · `## 4 — I NOMI DEI MODULI` · `## 7 — GLI EPISODI` · `## 8 — LE LINGUE DEL PARLATO` | `test_struttura_corso.js` |

**Il testo DOPO l'ancora è libero**, perché il confronto è per prefisso:
`### Grado D — nove battute` funziona, e «nove battute» si può cambiare senza
toccare niente.

**Quello che NON è un'ancora, ed è bene saperlo:** la **prima riga** di un file
— cioè la riga di versione — **non è letta da nessun test**. Si può aggiungere
a qualunque file di `docs/` senza rischio.

⚠️ **E `test_nomenclatura_edizione.js` tocca `docs/` in un altro modo ancora:**
verifica che ogni episodio dichiarato in `struttura-corso.json` abbia il suo
`.md` **e** il suo `.json`, e guarda **l'esistenza del file, mai il
contenuto**. *Gli interessa il nome — ed è la ragione meccanica per cui la
versione sta nel nome del file in chat e mai nel repository
(`REGISTRO-EPISODI_006`).*

---

## I buchi

Comportamenti importanti che **nessun test copre**. Elencati anche quando
sembrano ovvi: il § 4.1 era ovvio.

### A — La classe del § 4.1: "il risultato viene salvato"

1. **Flash Card non ha nessun test sull'esito.** Match Practice, Speed Match,
   Voice Practice, Voice Check, i tre Dialogue e Why We Say It hanno tutti
   un'asserzione su `outcome-*`. Flash Card ha solo la riga di
   *configurazione* `flashcardATargetNative = 'selfScoreRules'` — cioè esattamente
   il tipo di asserzione che al § 4.1 era vera e inutile.
2. **Nessun test apre uno dei sei passi con id suffisso** (`-2`, `-3`). L'unica
   menzione è il testo del badge in mappa. È il buco preciso da cui è passato
   il § 4.1: tutta la suite prova solo le prime apparizioni.
3. **Del punteggio si verifica solo il colore, mai il numero.** Che il `pct`
   salvato sia davvero la percentuale giusta non lo controlla nessuno.

### B — Il motore invisibile

4. **~~`applyMasteryResult` non è testata.~~** *Chiuso in parte da
   `test_scala_colori.js` (2026-09-06):* la salita, la discesa di un gradino
   solo, il non-salto e il fatto che `promotionStreak` venga letto sono ora
   coperti, ciascuno su un profilo pulito. **Resta scoperto:** il salto
   diretto a rosso di "Non lo so" (`declaredNonAttempt`), che non passa da
   `applyMasteryResult` ma la scavalca — vive in
   `recordMultipleChoiceResult`, ed è una strada sua.
5. **`buildMultipleChoiceOptions` non è testata.** Quattro opzioni, una sola
   giusta, tre distrattori diversi fra loro e dalla risposta. Un doppione fra
   le opzioni, o un grado così corto da non avere tre distrattori, non lo
   vedrebbe nessuno.
6. **La coda di ripasso non è mai asserita direttamente.** Che una voce
   sbagliata torni, che una giusta non torni, e che dopo `maxAttempts` sia
   forzata a rosso e tolta dalla coda. I test la attraversano, non la
   verificano.
7. **Le soglie non sono provate ai bordi.** 49 contro 50 e 79 contro 80 per
   `percentageBucket`/`moduleRulesLevel`, e lo stesso per `starsForPercent`.
   Si provano solo 0, 100 e un caso misto.

### C — Schermate e flussi che nessun test attraversa

8. **L'onboarding.** Nome vuoto rifiutato, nome salvato, "Cambia nome" che
   riporta indietro. Ogni test lo *usa* come impalcatura, nessuno lo verifica.
9. **La separazione fra utenti.** Due nomi sullo stesso browser devono vedere
   progressi, esiti e mastery diversi. Mai verificato — ed è la garanzia su
   cui si regge tutto lo storage.
10. **I temi.** I cinque temi selezionabili, la persistenza della scelta, e —
    la parte che conta davvero — che ogni componente resti leggibile in tutti
    e cinque (regola 2). Nessun test, in nessuna forma.
11. **Il menu Help.** Le tre voci, il form, il salvataggio della richiesta in
    `localStorage`, la conferma. I test controllano che il *pulsante* sia
    visibile o abilitato; nessuno lo apre fino in fondo.
12. **La Request Box di Your Story.** Invio, avviso di duplicato, salvataggio
    della richiesta. Mai toccata.
13. **Il pulsante "Reset" di un gruppo di slot.** Mai toccato.
14. **Una riga bloccata in mappa forzata a click.** Si verifica che il
    pulsante sia `disabled`, non che forzare il click non apra il modulo —
    controllo che invece esiste per le bolle di Dialogo.

### D — Contenuto e grado

15. **Nessun test verifica che un modulo su un grado mostri le voci di quel
    grado.** I test chiedono il grado all'ordine (`gradeOf`) e poi confrontano:
    se `episodeGrade` leggesse un grado sbagliato *ma coerente*, il test lo
    seguirebbe. Manca l'asserzione diretta — "Repeat Aloud sul grado B mostra
    le 7 espressioni, non le 16 parole".
16. **Repeat Aloud non ha quasi test di contenuto.** Che ogni voce mostri
    inglese, italiano e `pronunciationTip`, e che `generalRule` compaia in
    cima. È coperto solo il completamento.
17. **I pulsanti di velocità (100/75/50%).** Che cambino davvero la velocità
    dell'audio: i mock registrano il testo, non la `rate`.
18. **Nessuna prova sotto i 375px.** Il viewport più stretto della suite è
    375; il bug dei pulsanti che uscivano dallo schermo è stato trovato a
    360 con uno strumento a parte. Nessun test controlla che la pagina non
    scorra in orizzontale.

### E — Configurazione

19. **~~Nessun test verifica che una chiave di `APP_CONFIG` sia letta da
    qualcuno.~~** *Chiuso da `test_config_letta.js` (2026-09-06).* Cerca il
    nome della foglia, non il percorso puntato: il percorso letterale non
    compare mai per 104 chiavi su 141, perché l'app indicizza a runtime.
    **Limite dichiarato:** una foglia con un nome generico (`name`, `label`,
    `value`) è impossibile da falsificare — il test è forte sui nomi propri,
    che sono quelli dei parametri costruiti per uno scopo.
20. **L'override per sezione intera.** Salvare `sequences` dal
    pannello congela l'ordine anche quando il codice cambia. È il
    comportamento voluto, e non lo verifica nessuno.

### F — I documenti come fonte (regola 26)

21. **~~Nessun test confronta `docs/inglese/it/inglese-it-struttura-corso.md` con `APP_CONFIG`.~~**
    *Chiuso in parte da `test_struttura_corso.js` (2026-09-06):* i 22 passi
    con il loro grado, i quattro gradi con il nome mostrato e le sei
    categorie con la loro etichetta. **Resta fuori di proposito la tabella
    delle regole di esito:** nomina i moduli con il nome mostrato e non con
    l'id, li raggruppa a prosa, e include "Test", che non esiste — servirebbe
    una mappa nome→id scritta a mano, cioè una terza fonte da allineare.
22. **~~Nessun test conta le voci dell'episodio contro `docs/inglese/it/inglese-it-gate.md`.~~**
    ✅ **CHIUSO, e la riga era scaduta da tempo senza che nessuno se ne
    accorgesse.** Il blocco `[dati]` di `test_story_modules.js` prende i numeri
    **dal markdown** (`numeriAttesiDallaFonte`) e li confronta col JSON: le
    conte di A, B, C, D, le skill e gli slot. ⚠️ **Resta aperto l'altro lato,
    ed è nel tabellone qui sopra:** `aircraft-door` non ha il confronto
    carattere per carattere che `gate` ha. *Un buco che si chiude a metà e
    resta scritto intero si legge come un buco intero — cioè come lavoro da
    fare che è già fatto.*

### G — Non coperto, e va bene così

23. `episodeFinalOutcomeCase` non è chiamata da nessuno: non c'è
    comportamento da proteggere finché il Modulo Finale non esiste.
24. ~~La vista `view-pronunciation` è irraggiungibile dall'interfaccia: nessun
    test la copre, ed è corretto.~~ **CHIUSA il 2026-09-19 (passo A): la vista
    è stata tolta.** Con lei 244 righe di JS, 43 di markup, quattro listener e
    l'apparato `SpeechRecognition` che serviva solo a lei. *Non era un buco di
    copertura: era codice che non poteva girare — e un buco che si chiude
    togliendo la cosa, invece di scrivere un test, è il modo migliore in cui
    può chiudersi.*

---

## Ogni test nuovo dichiara cosa protegge

Da qui in avanti, un file di test nuovo apre con **una riga** che dice quale
comportamento si romperebbe se quel file sparisse — la stessa frase che poi va
nella tabella qui sopra. Non un riassunto di cosa fa il test: cosa si perde
senza.

```js
// PROTEGGE: Flash Card salva l'esito autodichiarato sulla mappa — senza,
// un modulo che smette di chiamare saveModuleOutcome resta verde in silenzio.
```

La riga vive **solo qui e in testa al file**. Non se ne fa una terza copia
altrove: si disallineerebbe.

## Punti fragili noti

Due censimenti, e servono in due momenti diversi di uno stesso rosso.

`ATTESE-FISSE.md` elenca i punti in cui un test aspetta un numero di
millisecondi e subito dopo verifica qualcosa. Quando la CI segnala un rosso
intermittente, si guarda lì prima di sospettare una regressione dell'app.

`ERRORI-INGOIATI.md` elenca i `.catch(() => {})`, distinti in tre famiglie, **più una famiglia ⓪ che non riguarda i `.catch`**: le asserzioni che nominano un nome per **negarlo**, e che una rinomina meccanica riscriverebbe lasciandole verdi mentre provano il contrario. Nessuno dei tre strumenti (suite, conteggio asserzioni, verifica per sottrazione) le vede —
attese soppresse, click che devono riuscire, opzionali legittimi. **Si guarda
lì quando il rosso arriva da un punto che non lo spiega:** un `.catch` vuoto
sopprime l'errore dove nasce e lo fa comparire dove non si può più
diagnosticare. È la famiglia più costosa, perché un'attesa a tempo almeno cade
nel punto giusto.

## Il conteggio delle asserzioni

`tools/conta-asserzioni.js` conta quante asserzioni ogni file ha **eseguito**
(le righe `OK`/`PASS`/`FAIL`) e le confronta con `BASELINE-ASSERZIONI.txt`. Lo
lancia da sé `run_full_regression.sh` alla fine di ogni corsa, e **un calo
rende la suite rossa**.

Il codice di uscita di un file dice se qualcosa è *fallito*; questo dice se
qualcosa ha smesso di *girare* — un file che esegue dieci asserzioni invece di
quaranta esce comunque con zero. Il numero può salire (un test nuovo: si
riscrive il baseline con `--scrivi`), non deve calare.

## `tests/module-order.js` — perché esiste

I test devono aprire un modulo, e la mappa non lo lascia aprire finché i passi
precedenti non risultano completati. Ogni test si scriveva quindi a mano la
lista dei moduli da segnare come fatti: una fotografia dell'ordine del giorno
in cui il test era stato scritto. Al primo riordino vero (da 14 a 22 passi)
sono cadute quasi tutte insieme — 15 file su 28 — e nessuna diceva perché:
solo "timeout aspettando un modulo".

`module-order.js` calcola quelle liste da `CONFIG.sequences['narrativo-standard']`, che è
l'unico posto che decide la sequenza: `stepIds()` (tutti i passi in ordine),
`stepsBefore(id)` (cosa completare per aprirne uno), `gradeOf(id)` (su quale
grado lavora, per i test che iniettano contenuto), `allSteps()`. Legge
`index.html` come testo, quindi le liste sono disponibili prima ancora di
aprire il browser. Un riordino futuro non tocca più nessun test.

## `test_hidden_guard.js` — perché è nella suite

Un elemento con l'attributo `hidden` che resta visibile perché una regola
CSS gli dà un `display` proprio: è successo cinque volte in questo progetto
(`.btn`, `.header-actions`, `header.app-header`, le schermate di Speed Match
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

## `test_fallbacks.js` — tolto, e perché

C'era, e verificava che le copie di sicurezza dentro `index.html`
(`window.FALLBACK_*`) coincidessero con i file sotto `data/{lingua}/`: senza,
GitHub Pages e l'artifact di claude.ai mostravano contenuti diversi.

Nel settembre 2026 sono spariti insieme l'artifact e le copie, e con loro il
test: **non c'è più un secondo posto da tenere allineato.** L'app carica i
file veri e basta; se non arrivano, `test_errore_caricamento.js` garantisce
che lo studente lo veda.

Vale la pena ricordare perché quelle copie erano un problema e non solo un
costo: assorbivano ogni fallimento in silenzio, guasti veri compresi. Un
percorso sbagliato su Pages non si sarebbe visto, perché l'app avrebbe servito
la copia interna. `test_fallbacks.js` esisteva per sorvegliare un meccanismo
che, di suo, nascondeva le regressioni.

## File di servizio

- `test-env.js` — Playwright, indirizzo dell'app e percorsi, condivisi da
  tutti i file di test.

  ⚠️ **E dal passo 1.17 (2026-09-22) anche `chiaveMagazzino(resto)`, il
  gemello lato test di `prefissoMagazzino` dell'app.** Serve ai semi costruiti
  in **Node** — un oggetto `{chiave: valore}` passato a `bootAsUser` — dove
  `BI` non esiste: *nel browser un test chiede la chiave all'app
  (`BI.moduleProgressKey(...)`), in Node non può.* L'edizione la legge da
  `configApp()`, quindi non è una copia che si può disallineare; quello che
  resta duplicato è la **forma**, e se cambiasse `test_progressi_estratto`
  `[C]` diventerebbe rosso — è la riga che confronta la chiave dell'app con
  una ricostruita a mano.

  Porta anche due ricerche condivise: `righeDiCodiceDi`
  (che toglie i commenti prima di contare) e, dal 2026-09-19, **`sorgenteChe`**
  — il sorgente che contiene un pezzo, cercato in `index.html` e in ogni file
  di `app/`, con un **`throw`** se non c'è da nessuna parte.
  *Perché: da quando l'app non è più un file solo, un test che legge
  `repoPath('index.html')` per trovarci una funzione smette di misurare il
  giorno che quella funzione si sposta — e non diventa rosso. Misurato sul
  passo C2: due asserzioni rosse e **dodici verdi per costruzione**, la stessa
  rottura con i due esiti opposti della regola 44.*
- `serve.js` — server statico senza dipendenze, usato da `npm run serve` e
  da `run_full_regression.sh`.
- `quiz-driver.js` — pilotaggio condiviso dei moduli a scelta multipla (Speed
  Round, Match Practice): sceglie le risposte dai dati dell'episodio invece che
  dalla posizione dei pulsanti, e avanza aspettando cambiamenti di stato
  invece di tempi fissi.
- `map-driver.js` — pilotaggio condiviso della **mappa**: `openModule(page, id)`,
  il gesto che apre un modulo. Era ricopiato in 23 file, identico in tutti e 23
  (verificato per contenuto: 23 copie, 1 variante). ⚠️ **L'attesa dentro non è
  stata convertita**: questo passo sposta, non paga debito — il censimento vede
  quindi la navigazione scendere di 22 senza che nessuna attesa sia diventata
  più solida.
- `tools/misura-finestra-apertura.js` — **quanto un modulo fa aspettare prima
  di essere usabile**: la finestra fra «la schermata risponde» e «il modulo ha
  il suo contenuto». Non è un test, è uno strumento — serve ogni volta che
  qualcuno aggiunge un fetch all'apertura di un modulo. `--ritarda=2000`
  riproduce la rete lenta. ⚠️ È lo strumento che ha fatto **ritirare** un
  segnale di caricamento già proposto: misurata, la finestra durava 17 ms, e un
  avviso che compare e sparisce in diciassette millisecondi sfarfalla.
- `tools/conta-attese.js` — **genera** il censimento di `ATTESE-FISSE.md`
  invece di lasciarlo scrivere a mano. Ogni voce è identificata dall'asserzione
  che protegge, non dal numero di riga: una riga si sposta a ogni commit,
  l'etichetta di un'asserzione no. Riscrive solo la parte fra i due marcatori
  del documento — la prosa in testa è memoria e non si tocca. Accetta un
  elenco di file, così si può misurare senza toccare la suite.
- `attese.js` — le attese che **non** sono a tempo: aspettano lo stato vero.
  Oggi una sola, `attendiSottotitoloEsito`, e sta in un modulo condiviso perché
  la usano cinque punti in quattro file — cinque copie della stessa attesa sono
  cinque occasioni di scriverne una diversa. ⚠️ Nasce dal caso del 2026-09-10:
  il sottotitolo di una Schermata Finale arriva da un **fetch**, non con la
  schermata, e chi lo legge appena la schermata compare sta correndo. La corsa
  si vinceva o si perdeva a seconda di **chi avesse già scaldato la cache dei
  messaggi** — Speed Match sì, il Dialogo no — cosa che nessuno può tenere a
  mente modulo per modulo. Sei giri verdi in locale, due corse di CI rosse su
  due, stesso commit.
