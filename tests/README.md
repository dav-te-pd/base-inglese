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
`test_interruttore_episodio.js`, `test_match_practice_nonloso.js`, `test_blocco_ascolto.js`, `test_conta_asserzioni.js`). Insieme costituiscono la
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
statico sulla porta 8955, lancia i 32 file in ordine e ferma il server alla
fine. Se un server risponde già su quella porta, lo riusa invece di
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
- `debug/` — script diagnostici per bug ormai risolti, tenuti come riferimento.
- `legacy/` — test precedenti alla numerazione `test_batchN.js`, probabilmente superati.

## `test_outcome_step_ids.js` — nella suite dal 2026-09-05

Verifica che la regola di esito (`CONFIG.moduleOutcomeRules`) e la regola del
tentativo arrivino a **ogni apparizione** di un modulo nell'ordine, non solo
alla prima. Gioca l'episodio in un profilo pulito dal passo 1 al passo 9 e
confronta i due badge in mappa: a parità di risposte devono essere identici, e
tutti e due devono avere un esito salvato.

**Era fuori dalla suite** finché asseriva che il difetto del § 4.1 di
`docs/validazione.md` esistesse ancora: un test che asserisce un difetto
diventa rosso proprio quando il difetto viene corretto, e un rosso che vuol
dire "risolto" è peggio di nessun test. Corretto il difetto (vedi
`docs/correzioni.md`), il file è stato rovesciato ed è entrato nella suite —
la suite passa così da 28 a 29 file.

Si può ancora lanciare da solo, con il server attivo:

```bash
node tests/test_outcome_step_ids.js
```

## Cosa protegge ogni file

Non è un indice: è la domanda **"cosa si romperebbe se questo file
sparisse?"**, una riga per file. Serve a vedere i buchi, non a documentare.

Il test che è mancato al § 4.1 di `docs/validazione.md` sarebbe stato *"l'esito
di un passo viene salvato"*. Nessuno l'aveva scritto, e 583 asserzioni verdi non
hanno visto niente. Questa tabella esiste perché il prossimo buco si veda prima.

| File | Cosa si romperebbe senza |
|---|---|
| `test_batch2.js` | Your Story è il primo passo e blocca tutto il resto finché non è fatto; riaprirla a episodio iniziato chiede la frase di conferma e cancella davvero i progressi; il vecchio flag `customizeSeen` continua a migrare. |
| `test_batch2b.js` | La vista di riordino del Pannello Admin: coppie modulo+grado, frecce, pulsante del grado, interruttore acceso/spento, e che ogni modifica finisca negli override; un passo spento sparisce dalla mappa invece di restare grigio. |
| `test_batch3.js` | `?config` apre il pannello; il titolo "Spiegazione" resta su due righe; le categorie mostrate (Inizio / Quiz / Studia il dialogo); i testi di `istruzioni-moduli.json` non promettono più un video e portano il consiglio giusto per tipo di modulo. |
| `test_batch3b.js` | L'avviso distruttivo di Your Story usa il pannello rosso dedicato; "Mostra pronuncia" compare solo dove c'è una `pronunciationTip`; la scatola "L'hai imparato?" resta bloccata finché ogni battuta non è stata sentita; il 3-2-1 usa le frequenze alte. |
| `test_batch4.js` | Il Pannello Admin mostra la descrizione di ogni parametro e non se stesso come gruppo; nomi, sottotitoli e suffisso di direzione in mappa. |
| `test_batch4b.js` | La schermata "Spiegazione" di ogni modulo mostra il nome di **quel** modulo, non di un altro. |
| `test_batch5.js` | Uscire da un Dialogo mentre parla ferma l'audio e non lascia proseguire la sequenza nel modulo dopo; Spiegazione/Help si disabilitano durante il countdown, e Spiegazione sparisce nella Schermata Finale. |
| `test_batch6.js` | I tre scalini dell'avviso microfono (2 / 4 / 6 registrazioni vuote), il reset dello streak alla prima registrazione riconosciuta, e che una risposta **sbagliata ma sentita** non venga scambiata per un guasto. |
| `test_batch7.js` | La Schermata Finale ha titolo fisso e sottotitolo variabile per esito; la valvola di sicurezza si apre dopo N tentativi e in Match Practice non offre "Riprova ancora" (lì non c'è niente da ritentare subito). |
| `test_batch8.js` | Con il microfono dato per guasto "Avanti" resta bloccato **anche forzando il click**, e uscire da lì non segna il modulo come completato. |
| `test_batch9.js` | Le soglie percentuali esistono; i messaggi finali sono divisi per esito con cinque varianti ciascuno e il tono "alto" non suggerisce di riprovare; Repeat Aloud e la storia hanno una Schermata Finale con pulsante esplicito; la riga che spiega perché la scatola di Dialogo è spenta. |
| `test_batch10.js` | Tutti i segnaposto dell'episodio sono risolti (uno sconosciuto avvisa in console e resta a schermo invece di rompere); le spunte "sentita" in Dialogo; il suono Traguardo suona su ogni completamento positivo e **non** su "← Mappa", sull'uscita per microfono guasto e su "Non ancora". |
| `test_batch11.js` | ModuleRules davvero applicata: 100% → verde, 0% → rosso, misto → giallo, e un rifacimento **sovrascrive** l'esito in entrambe le direzioni; `--accent` non è più lo stesso colore del rosso di errore. |
| `test_batch12.js` | Il catalogo suoni per evento; i tre sfondi di stato in mappa sono distinguibili; nomi e categorie di tutti i moduli (e "Story Cards" non compare più da nessuna parte); Voice Practice e Voice Check al completo — contatore visibile, nessun ripasso finale, esito salvato, mastery alimentata. |
| `test_batch13.js` | I tre parametri di registrazione stanno in `APP_CONFIG` e nel pannello; il taglio per silenzio scarta la registrazione senza offrirla e **senza contarla** nei secondi inviati; una registrazione davvero inviata invece li conta. |
| `test_batch14.js` | Parlare a lungo non fa scattare il taglio per silenzio; "Ho finito" apre la Schermata Finale e **non** completa il modulo; il badge Ripasso; lo Sblocco Sequenziale per ascolto in Ripeti a Tempo; "Prossima frase" e il suo conteggio. |
| `test_batch15.js` | Traguardo suona a schermata già visibile; le due riserve di messaggi del Ripasso (primo giro e ultimo) sono diverse; il contatore "TENTATIVO N DI 3" non è più in ritardo di uno; **Speed Match congela il punteggio al primo giro** e il ripasso non lo gonfia; Meet the Story senza skill ricade sul messaggio neutro e senza colore. |
| `test_batch16.js` | Un nome di persona non viene tradotto nel dialogo; Pausa è spento mentre l'audio parla; "Prossima frase" fa partire davvero la battuta dopo invece di limitarsi a suggerirla; girare la carta ferma l'audio; il suono Uscita esiste ed è più basso di Traguardo; le tre colonne dell'intestazione. |
| `test_batch17.js` | La Regola Azione Critica nella sua forma corretta: fuori dai profili con countdown **niente si blocca**, e un'azione critica ferma l'audio invece di esserne bloccata — verificato modulo per modulo su sei moduli. |
| `test_batch18.js` | Passando da una battuta all'altra l'evidenziazione resta sulla nuova (la vecchia non se la riprende con un `onEnd` in ritardo); Spiegazione e Help fermano l'audio; un secondo pulsante di ascolto **sostituisce** l'audio invece di fermarlo. |
| `test_batch19.js` | "Non lo so" si blocca insieme alle opzioni e non può sovrascrivere una risposta giusta appena data; Spiegazione/Help restano visibili anche durante il quiz e si disabilitano solo mentre la barra scorre, riabilitandosi nei tre casi in cui c'è qualcosa da leggere; uscire a metà timer non li lascia spenti. |
| `test_batch20.js` | Nella direzione it→en il testo mostrato è davvero italiano davanti e inglese dietro (Flash Card e Match Practice): un ternario invertito si vedrebbe subito. |
| `test_dialogo_extra.js` | Il suono di fine barra suona una volta sola e più piano, mai durante; Ascolta e Ripeti resta libero; e **l'eccezione della regola 16**: un tocco a vuoto non interrompe l'audio con countdown, toccare la battuta sì. |
| `test_new_features.js` | Il Pannello Admin per intero: si apre da tastiera solo fuori dai campi di testo, modifica in diretta, persiste, rifiuta il JSON non valido senza applicarlo, si chiude con Escape, si azzera col reset; più i due conti alla rovescia 3-2-1. |
| `test_voicecoach.js` | Il giro completo di Voice Check: "Avanti" bloccato finché non si registra, nessun Indietro, il ripasso delle frasi andate male, la Schermata Finale col pulsante esplicito, e il modulo non completato prima di quello. |
| `test_story_modules.js` | Meet the Story e Why We Say It al completo: i dati (gradi, skill come lista con titolo e corpo separati), la sequenza obbligata al primo giro, le tre risposte, "Esci e riprendi dopo", il ripasso, e il punteggio autodichiarato che diventa verde. |
| `test_hidden_guard.js` | Ogni regola CSS che imposta un `display` continua a sparire con `hidden`: la guardia della regola 12 non si può rompere senza che la CI se ne accorga. |
| `test_outcome_step_ids.js` | La regola di esito e la regola del tentativo arrivano a **ogni** apparizione di un modulo nell'ordine, non solo alla prima: senza, la mappa torna a lasciare grigi sei passi su ventidue, e in silenzio (un esito verde e nessun esito sono indistinguibili a schermo). |
| `test_config_letta.js` | Ogni parametro di `APP_CONFIG` è nominato da qualcuno: una manopola che non muove più niente resta nel Pannello Admin e si finisce per girarla. È il difetto che ha tenuto in vita `pointsPerCorrect`. |
| `test_struttura_corso.js` | `docs/inglese/it/struttura-corso.md` e `APP_CONFIG` dicono la stessa cosa su ordine, gradi e categorie: la fonte (regola 26) non descrive un'app diversa da quella che gira. |
| `test_scala_colori.js` | La scala rosso→giallo→verde sale solo con la costanza, scende di un gradino solo, non salta, e legge `CONFIG.mastery.promotionStreak` invece di avere il numero cablato. È il dato più costoso da ricostruire e il meno visibile a schermo. |
| `test_errore_caricamento.js` | Un fallimento nel caricamento dei dati diventa qualcosa che lo studente vede e da cui può uscire, invece di un modulo che non si apre o che si apre vuoto. Protegge anche che il testo venga dal JSON e che "Riprova" rifaccia davvero l'apertura fallita. Dopo la rimozione delle copie `window.FALLBACK_*` è l'unica rete rimasta sul percorso di caricamento: se sparisse, un guasto tornerebbe a essere invisibile. |
| `test_avviso_microfono.js` | L'avviso "non riusciamo a sentirti" dei due moduli di voce, per **entrambe** le strade con cui un microfono rotto si manifesta: premere e non parlare (il timeout di silenzio) e parlare senza che venga riconosciuta una parola. Che compaia, che salga di livello nell'ordine delle soglie di `CONFIG`, che al livello confermato blocchi "Avanti" lasciando "Torna alla mappa" come uscita, e che sparisca appena una parola viene riconosciuta. Senza, uno studente col microfono rotto resta a fissare zero stelle credendo di pronunciare male. Protegge anche che il pannello stia **fuori** da `#vc-result`: da dentro salirebbe di livello restando invisibile nello stato di riposo, che è il caso peggiore — un meccanismo che funziona e non si vede. |
| `test_sblocco_sequenziale.js` | La promessa dello Sblocco Sequenziale in **entrambe** le varianti (regola 30): dentro un passo più avanti della sequenza non risponde niente — nessun audio, nessun cambiamento — mentre il passo raggiungibile continua a rispondere. Senza, la sequenza torna a essere solo un effetto grafico: la card sembra spenta e il pulsante dentro funziona lo stesso, che è il difetto trovato al 6° collaudo nella variante per dichiarazione. Clicca tutto quello che trova invece di un elenco di pulsanti, così copre anche quelli aggiunti domani. |
| `test_attendi.js` | Che `tests/tools/attendi.sh` riporti il codice **giusto**: 0 quando il lavoro finisce bene, 1 quando finisce male, e che lo dica invece di limitarsi a restituirlo. È l'unico strumento fra «la suite è finita» e quello che se ne racconta: se sbaglia codice, un rosso passa per verde e il suo output somiglia a un risultato in entrambi i casi. Guida due comandi veri che ci mettono un momento a dichiarare l'esito, così l'attesa deve girare almeno un giro — un log già scritto proverebbe solo che sa fare `grep`. **Limite dichiarato:** il terzo caso, tempo scaduto con uscita 2, non è coperto — costerebbe al test l'attesa che deve misurare; esercitato a mano il 2026-09-07. |
| `test_report_mastery.js` | Che il pannello dei colori delle voci mostri quello che c'è davvero nel magazzino, ordinato per chiave, e soprattutto che **legga e basta**. È uno strumento per guardare un dato che a schermo non compare da nessun'altra parte: se mostrasse un numero sbagliato nessuno se ne accorgerebbe, perché non c'è nient'altro con cui confrontarlo. L'asserzione che pesa di più è che aprirlo non cambi un byte della mastery — un report che modifica quello che misura è peggio di nessun report, e il rischio è concreto: la funzione carica lo store con la stessa `loadMastery()` dei tre scrittori, a un carattere da un `saveMastery()`. L'ordine per chiave non è estetica: è il punto del pannello, perché le righe della stessa voce devono finire vicine. **Limite dichiarato:** non verifica quante volte una voce è stata scritta, perché quel dato non esiste. |
| `test_episodi_corti.js` | Che un episodio con una **forma diversa dal primo** non produca silenzio. Tre difetti della stessa famiglia, tutti e tre senza crollo — e per questo erano rimasti: un passo con un `kind` sconosciuto che diventa un vicolo cieco muto e blocca per sempre quelli dopo; un passo puntato su un grado assente che si dichiara **completato senza far fare niente** e registra pure l'esito; la migrazione di `customizeSeen` che scrive in episodi che Personalizza non ce l'hanno. Diventano urgenti con gli **episodi corti** (solo gradi C e D): è lì che tutti e tre mordono. Le tre forme sbagliate si costruiscono dagli override del Pannello Admin, non da un secondo episodio finto. **Limite dichiarato:** verifica che il passo non si completi e che lo studente veda qualcosa, non il testo dell'errore — quello è di `test_errore_caricamento.js`. |
| `test_sequenze.js` | Che ogni episodio dichiari la propria sequenza di passi, che le due strade per dichiararla (`sequence` per nome, `moduleOrder` per intero) non si sovrappongano in silenzio — dichiararle entrambe, o nessuna, è un errore detto e non risolto scegliendone una — e soprattutto che il passaggio alle sequenze **non abbia mosso nessun id di passo**. Quest'ultima è la parte che pesa: i progressi salvati sono indicizzati per id di passo, e se un id si muove ogni studente riparte da zero senza che niente si rompa a schermo. Gli id attesi si leggono dalla sequenza vera in `index.html`, non da una lista ricopiata nel test. |
| `test_episodio2.js` | Che `data/inglese/it/inglese-it-aircraft-door.json` continui a dire quello che dichiara `docs/inglese/it/inglese-it-aircraft-door.md`. Quando i due divergono non crolla niente: i moduli si aprono pieni e hanno l'aria giusta, semplicemente insegnano una cosa che il documento non dice più. Confronta i numeri dichiarati e le due cose che un conteggio non vede: che ogni skill stia su una battuta esistente e che ogni `fromLine` punti a una battuta vera. **Limite dichiarato:** il testo NON è confrontato — i due markdown hanno forme diverse e un secondo parser sarebbe più fragile di quanto protegga. La scadenza scritta qui («quando l'episodio 2 entrerà in `EPISODES`») è arrivata il 2026-09-08 e il limite è rimasto: la condizione nuova è registrata in `docs/decisioni.md`. |
| `test_interruttore_episodio.js` | Che scegliere un episodio nel Pannello Admin apra **davvero quello**, con il suo contenuto. È l'unica strada che esiste per raggiungere un episodio diverso dal primo: se smette di funzionare, l'app continua a funzionare benissimo mostrando sempre lo stesso episodio, e non se ne accorge nessuno finché non si prova a collaudare il secondo. Protegge anche che l'episodio 2 sia collegato al **suo** file dati — un episodio «collegato» che serve il contenuto dell'altro è il caso peggiore, perché la schermata è piena e ha l'aria giusta — e che un id inesistente non lasci una pagina bianca ma lo **dica** in console. Il menu si confronta con gli episodi che dichiarano una sequenza in `CONFIG.episodes`, non con un elenco scritto nel test: un episodio nuovo entra da solo. **Limite dichiarato:** si guarda un modulo solo (Meet the Story); un descrittore sbagliato su uno degli altri ventuno passerebbe. |
| `test_match_practice_nonloso.js` | Che in Match Practice «Non lo so» torni **attivo** sulla domanda successiva dopo una risposta giusta. Si spegne insieme alle opzioni e lo riaccende `qmRenderQuestion`: se quella riga sparisce, dalla seconda domanda in poi una delle due uscite dell'esercizio non c'è più — e non crolla niente. È anche il **modello** con cui vanno riscritte le diciannove attese fisse di `test_batch19.js` (`docs/decisioni.md`): la stessa asserzione lì aspetta 800 ms a caso e poi legge; qui si aspetta *quello che il lavoro produce* — la domanda successiva a schermo — e lo stato si legge dentro la stessa chiamata che aspetta. Sull'ultima domanda del passaggio non si risponde mai giusto di proposito: lì la «domanda successiva» non esisterebbe, ed era uno dei due sospetti mai dimostrati del rosso in CI di `test_batch19`. **Limite dichiarato:** una sola direzione (en→it). |
| `test_blocco_ascolto.js` | Che il **Blocco Ascolto** sia un pezzo solo, e che «bloccato» voglia dire la stessa cosa dovunque compaia. Il pulsante «ascolta» + le velocità lo mostrano sei moduli, e fino al 2026-09-09 il suo markup era **ricopiato a mano in sette punti** (la coda del gestore del tocco in altri cinque): nessun test poteva accorgersene, perché sette copie identiche passano tutti i verdi — e sei identiche più una diversa pure. **Come, ed è il punto del file:** la domanda «sono tutti uguali?» non si risponde confrontando i moduli, si risponde verificando che il markup abbia **una sola sorgente** — così l'uguaglianza non è da verificare, è una cosa che non può non essere vera, e l'ottava copia scritta a mano fa fallire la CI subito. Poi, nel browser, quello che la sorgente unica non prova: che dentro una card bloccata il blocco si veda **spento** (opacità e `pointer-events`, non il silenzio — l'audio non partiva già prima, ed è per questo che il difetto è vissuto tanto), e che le **due varianti dello Sblocco Sequenziale** siano inerti allo stesso modo, con la stessa `.is-tap-locked`. L'aspetto invece resta diverso apposta (regola 30) e qui non si asserisce. Visto fallire su due guasti: la riga che spegne il blocco tolta, e un modulo che torna a ricopiare il markup. **Limite dichiarato:** apre due moduli su sei — gli altri quattro li copre la sorgente unica, ma un modulo che smettesse di *chiamare* il componente qui non si vedrebbe (lo prendono `test_batch16`, `test_batch17`, `test_story_modules`, `legacy/test_qm`). **Costo dichiarato:** è la terza dipendenza da `index.html` letto come testo, ed è una scelta. |
| `test_conta_asserzioni.js` | Che il contatore delle asserzioni **si accorga di un calo**. È lo strumento che difende ogni verde della suite da un test che ha smesso di girare — e come ogni strumento di misura, se si guasta non lo dice: continua a stampare un numero, e il numero somiglia a un risultato. Il caso non è teorico: `test_batch19` è caduto eseguendo 39 asserzioni invece di 40, perché la quarantesima vive in un ramo che, quando il ciclo si esaurisce, non gira. Prova i tre casi con conseguenze opposte — uguale, in aumento (un test nuovo: va bene), in calo (deve fallire e dire **quale** file) — più il caso che li confonde tutti: un `.result.txt` mancante, che non è zero asserzioni ma un file non eseguito. **Limite dichiarato:** prova che sappia contare le tre forme che i test usano oggi, non che il conteggio sia giusto su ogni file vero; una quarta forma gli sfuggirebbe e questo test resterebbe verde. |

---

## I buchi

Comportamenti importanti che **nessun test copre**. Elencati anche quando
sembrano ovvi: il § 4.1 era ovvio.

### A — La classe del § 4.1: "il risultato viene salvato"

1. **Flash Card non ha nessun test sull'esito.** Match Practice, Speed Match,
   Voice Practice, Voice Check, i tre Dialogue e Why We Say It hanno tutti
   un'asserzione su `outcome-*`. Flash Card ha solo la riga di
   *configurazione* `flashcardAEngIta = 'selfScoreRules'` — cioè esattamente
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

21. **~~Nessun test confronta `docs/inglese/it/struttura-corso.md` con `APP_CONFIG`.~~**
    *Chiuso in parte da `test_struttura_corso.js` (2026-09-06):* i 22 passi
    con il loro grado, i quattro gradi con il nome mostrato e le sei
    categorie con la loro etichetta. **Resta fuori di proposito la tabella
    delle regole di esito:** nomina i moduli con il nome mostrato e non con
    l'id, li raggruppa a prosa, e include "Test", che non esiste — servirebbe
    una mappa nome→id scritta a mano, cioè una terza fonte da allineare.
22. **Nessun test conta le voci dell'episodio contro `docs/inglese/it/inglese-it-gate.md`.**
    `test_story_modules.js` conta le skill contro il *file dati*, cioè contro
    la copia, non contro il markdown che dichiara i numeri attesi.

### G — Non coperto, e va bene così

23. `episodeFinalOutcomeCase` non è chiamata da nessuno: non c'è
    comportamento da proteggere finché il Modulo Finale non esiste.
24. La vista `view-pronunciation` è irraggiungibile dall'interfaccia: nessun
    test la copre, ed è corretto.

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
- `serve.js` — server statico senza dipendenze, usato da `npm run serve` e
  da `run_full_regression.sh`.
- `quiz-driver.js` — pilotaggio condiviso dei moduli a scelta multipla (Speed
  Round, Match Practice): sceglie le risposte dai dati dell'episodio invece che
  dalla posizione dei pulsanti, e avanza aspettando cambiamenti di stato
  invece di tempi fissi.
