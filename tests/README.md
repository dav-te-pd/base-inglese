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
`test_conta_attese.js`, `test_modulo_pronto.js`). Insieme costituiscono la
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
`docs/validazione.md` esistesse ancora: un test che asserisce un difetto
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
| `test_batch12.js` | Il catalogo suoni per evento; i tre sfondi di stato in mappa sono distinguibili; nomi e categorie di tutti i moduli (e "Story Cards" non compare più da nessuna parte); Voice Practice e Voice Check al completo — contatore visibile, nessun ripasso finale, esito salvato, mastery alimentata. **E dal 2026-09-10 la C.1:** che **Voice Check scriva**, in voci sue (`voicecheck:`) e mai dentro quelle di Voice Practice — le due varianti hanno regole diverse su quale tentativo conta, e sulla stessa chiave nessun lettore saprebbe quale delle due ha prodotto il colore che vede — e che lo faccia con la **strada B**, cioè contando solo il primo tentativo. ⚠️ **Quest'ultima si misura sulla STRISCIA, non sul livello:** con `promotionStreak` a 2 una sola risposta giusta non promuove, quindi guardando il solo livello la riga sarebbe verde anche sotto la strada A — misurato, non dedotto. È anche il file dove vive il caso «Voice Check + ← Mappa» della regola del gesto, perché la macchina del microfono è qui. |
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
| `test_spazio_nomi.js` | Che **un file che arriva dopo possa registrarsi da sé nello spazio dei nomi**, e che le due collezioni non si azzerino quando qualcuno si ricarica. ⚠️ **NON protegge che l'oggetto esista** — quello sarebbe ricopiare l'implementazione, e passerebbe anche a meccanismo rotto. Il passo 21 (2026-09-16) crea uno spazio dei nomi che **oggi non ha utenti**: i primi arrivano al 21-bis e al 21-ter. Senza una prova adesso, la prima volta che il meccanismo verrà usato sarà anche la prima volta che qualcuno lo mette alla prova, e un rosso avrebbe **due sospettati** — la conversione appena scritta e la nascita dello spazio dei nomi. **Il guasto che conta:** `window.BI = {}` al posto di `window.BI = window.BI \|\| {}` non dà nessun errore, cancella in silenzio quello che gli altri hanno registrato, e il sintomo (un modulo che non si pulisce, un `kind` che non si risolve) arriverebbe mesi dopo dentro un altro passo. **Come:** l'attacco tardivo non si simula da dentro la pagina — `page.evaluate` gira a tutto già caricato e proverebbe «si può scrivere in un oggetto», vero per costruzione. Si carica un file vero **dopo** (`tests/fixtures/attacco-tardivo.js`), che fa quello che farà ogni file di modulo. **Il caso più diverso (regola 42):** la registrazione che **non avviene mai** — come negli episodi corti, dove un `kind` che non corrisponde a niente rendeva una riga cliccabile e muta. Deve essere normale, non un guasto. **Due limiti dichiarati:** nessuna asserzione sul comportamento dell'app, perché lo spazio dei nomi non ne governa ancora nessuno; e le due direzioni del guasto non sono protette allo stesso modo — `{}` nel file tardivo fa cadere cinque asserzioni di comportamento, `{}` in `spazio.js` stesso fa cadere **solo** quella strutturale, perché oggi è il primo a caricarsi. Diventerà un guasto vero al passo 22. |
| `test_story_modules.js` | Meet the Story e Why We Say It al completo: i dati (gradi, skill come lista con titolo e corpo separati), la sequenza obbligata al primo giro, le tre risposte, "Esci e riprendi dopo", il ripasso, e il punteggio autodichiarato che diventa verde. **E, dal 2026-09-09 (C.2), che il magazzino dell'autovalutazione tenga la risposta CORRENTE e non la somma dei tocchi.** Prima ogni risposta faceva `+1` senza togliere quella di prima: una card del collaudo è arrivata a «chiara 3 · non chiara 3», cioè **sei voti da una persona sola** — e il pannello dice di sé che quel numero segnala le spiegazioni da riscrivere, quindi decideva un lavoro editoriale contando i ripensamenti. Si legge il **magazzino**, non il pannello: il difetto sta in cosa viene scritto, e un pannello che mostra bene un dato sbagliato passerebbe. L'asserzione più forte è l'ultima — *una battuta vale un voto in tutto, comunque la si tocchi* — perché regge anche a una forma futura diversa. Viste fallire rimettendo il `+1`. **E, dal 2026-09-09 (passo 9), le ETICHETTE sopra le bolle** — il blocco `[B0]`, che prima di oggi non aveva copertura: non debole, **zero**. `speakerLabels` è uscito da `index.html` ed è contenuto del file episodio (regola 4). Due cose si romperebbero in silenzio: che l'etichetta di un personaggio personalizzabile **non porti il nome scelto** (sopra la bolla «Papà», non «Marco» — il nome sta *dentro* la battuta, dove lo studente lo impara), e che l'etichetta **porti il contorno** («Hostess al gate», non «Hostess»: fra quattro hostess senza contorno lo studente vede la stessa persona quattro volte). L'atteso si **legge dal file episodio**, mai ricopiato nel test. La prova del primo punto è costruita: si sceglie un nome riconoscibile e si guarda che **non compaia** come etichetta e che **compaia** dentro le battute. Viste fallire reintroducendo la risoluzione sul nome scelto. |
| `test_hidden_guard.js` | Ogni regola CSS che imposta un `display` continua a sparire con `hidden`: la guardia della regola 12 non si può rompere senza che la CI se ne accorga. |
| `test_outcome_step_ids.js` | La regola di esito e la regola del tentativo arrivano a **ogni** apparizione di un modulo nell'ordine, non solo alla prima: senza, la mappa torna a lasciare grigi sei passi su ventidue, e in silenzio (un esito verde e nessun esito sono indistinguibili a schermo). **E, dal 2026-09-09, che nei due pannelli-report due apparizioni dello stesso modulo si distinguano** — il blocco `[D]`. Sono due difetti diversi nella stessa riga di codice, e il secondo è nato dopo che il primo era chiuso: prima il nome del passo non si risolveva affatto (`voicePractice-2`), poi si risolveva benissimo ma i due Voice Practice avevano il nome **identico**, perché la label di un passo non portava il grado — due righe indistinguibili in un pannello che esiste per dire *dove* sono finiti i secondi. L'asserzione sta sulla **distinguibilità** (`riga[0] !== riga[1]`), non su una stringa attesa: è quello che il pannello deve garantire, e una stringa attesa si limiterebbe a ricopiare l'implementazione. Visto fallire togliendo il grado da `stepLabel`. **Limite dichiarato:** la latente — il pannello dei salti di battuta — si verifica solo controllando che passi dalla stessa composizione, perché **oggi nessuna sequenza ripete un Dialogue**, quindi la collisione vera lì dentro non è esercitata da nessuno. |
| `test_config_estratto.js` | Che **`APP_CONFIG` viva fuori da `index.html` e sia già in memoria quando il primo lettore lo cerca**. Dal 2026-09-15 la configurazione sta in `app/config.js`, caricato con un `<script src>` **bloccante**: funziona per una ragione sola e fragile, **l'ordine**. Un `defer`, un `async`, un `type="module"` o il tag spostato sotto lo script in linea, e `window.APP_CONFIG` non esiste più quando qualcuno lo legge — senza che nessuno abbia toccato una riga di configurazione. ⚠️ **E il guasto non somiglia a un guasto di caricamento:** nessun fetch fallisce, non c'è schermata d'errore da mostrare, c'è un `TypeError` a tempo di parsing e una pagina bianca, con il colpevole in un attributo HTML che non parla di configurazione. **Il caso più diverso (regola 42) qui non è un modulo, è il LETTORE PIÙ PRECOCE:** i 162 `CONFIG.` dell'app girano dentro funzioni, cioè molto dopo; l'unico che legge mentre lo script viene ancora letto è l'IIFE del tema, ed è il solo che si rompe **in modo invisibile** — gli altri almeno esplodono dentro un gesto dell'utente. **Come si osserva** «prima del primo disegno», che non si fotografa: si salva un tema diverso dal predefinito e si guarda `data-theme` sull'`<html>`, che l'IIFE scrive **solo** se ha potuto leggere `APP_CONFIG.themes.defaultTheme`. Visto fallire su due guasti realistici: `defer` sul tag (cade l'asserzione strutturale **e** muore la pagina) e il tag spostato dopo lo script in linea (`tema: null`, `defaults: false`, e l'errore `"undefined" is not valid JSON`, cioè `JSON.stringify(undefined)`). **Limite dichiarato:** non verifica il *contenuto* della configurazione — quello è `test_config_letta.js`. Qui si guarda solo dove sta e quando arriva. |
| `tests/tools/misura-strato.js` *(strumento, non un test)* | Misura uno strato **prima** di estrarlo: quante righe, e soprattutto **cosa nomina che non gli appartiene — funzioni E `var`**. ⚠️ **Esiste per un guasto vero:** il 2026-09-17 la misura di `identita` l'avevo fatta a mano contando le sole **funzioni**; `ICONS` è una `var`, è rimasta in `index.html`, e il primo `icon()` ha spento l'app con un `ReferenceError`. *La misura rispondeva a una domanda più stretta di quella che le facevo, e la differenza non si vedeva finché gli strati contenevano solo funzioni.* È di sola **lettura**: lo spostamento resta a mano, di proposito — uno strumento che riscrive `index.html` sarebbe il pezzo più pericoloso del progetto per il guadagno più piccolo. |
| `test_audio_estratto.js` | Che **la voce dell'app arrivi**, e arrivi prima di chi la chiama. ⚠️ **Cosa si rompe se il file non arriva, misurato — ed è un TERZO tipo di guasto:** il login **compare** (è markup), casa no, `TypeError: vocePossibile is not a function`. *`identita` = pagina bianca (rumoroso); `progressi` = l'app parte e la mappa tace (silenzioso); `audio` = sembra partita e il primo pulsante non fa niente.* Su Pages la cosa da guardare non è «si apre» ma **«scrivo il nome, premo, e arrivo a casa»**. `[A]` verifica che `synth` non sia più nominato in `index.html` e che l'epoca non sia più una variabile; `[B]` guida l'app. **Il caso più diverso è `epoca`, diverso per FORMA:** l'unico pezzo che era una `var` numerica letta da un altro strato — e **il ponte degli alias copia un riferimento, non un valore**, quindi su un numero avrebbe congelato la copia e reso la protezione inerte **senza alzare niente**. Per questo l'asserzione che conta non è che `nuovaEpoca` esista, ma che il numero **salga passando dall'app**: falsificando, è l'unica che cade. ⚠️ **LIMITE, e vale più degli altri: la suite prova che le funzioni sono raggiungibili e che l'epoca avanza, NON che esca un suono.** La sintesi vocale nei test è un finto: che la voce si senta resta una verifica a mano. |
| `test_suoni_estratto.js` | Che i **toni** dell'app arrivino — e che si sappia che la loro assenza **non somiglia a un guasto**. ⚠️ **Misurato bloccando il file: login SI, casa SI, mappa SI, errori JS ZERO.** È il **quarto tipo** della serie e il più silenzioso: `identita` = pagina bianca, `audio` = il primo tasto morto, `progressi` = la mappa che tace, **`suoni` = l'app funziona e basta**. Il guasto compare al primo Corretto, dentro un esercizio, minuti dopo l'avvio. *Su Pages si guarda una cosa sola, e non è «si apre»: **si fa un esercizio e si ascolta se il Corretto suona**.* ⚠️ **E un limite trovato da una falsificazione che NON ha morso dove doveva:** l'asserzione «chiamare un suono non solleva» resta verde anche con l'`AudioContext` introvabile — i sei suoni escono senza fare niente e senza errore. *«Non solleva» non distingue «il suono è uscito» da «non è uscito in silenzio».* Aggiunta la riga che chiede che il contesto **esista**; che ne esca un'onda udibile resta fuori dalla portata di un browser di test. **Il caso più diverso è `warmAudioContextOnce` e i suoi due listener globali**, l'unico pezzo dello strato che non è un suono: sono venuti nel file **con lei**, perché separare una difesa dal suo innesco lascia due pezzi che nessuno dei due spiega. |
| `test_quiz_engine_estratto.js` | Che il motore che **calcola** un esito arrivi, e **quanto tardi si vede la sua assenza**. ⚠️ **Misurato: login SI, casa SI, mappa SI, un modulo si apre SI, errori JS ZERO.** Più silenzioso ancora dei suoni — e la misura ha **smentito la mia previsione** (credevo che `shuffle` dentro `openStoryCards` uccidesse l'apertura; quel ramo non si percorre col profilo `meet`). *Su Pages: **si apre un quiz e si risponde** — qui non basta nemmeno «il modulo si apre».* ⚠️ **Il criterio di cosa c'è dentro NON è l'elenco del piano: una funzione che restituisce un VALORE, non una che restituisce MARKUP.** `starsForPercent` torna un numero e resta dentro; `renderStars` torna HTML con la classe `vc-star` e **resta fuori**, diretta a `ui-condivisa`. `[A]` lo protegge con una riga che vieta il markup nel file. `[B]` non si accontenta che le funzioni esistano: chiede **quattro risposte note**, una per famiglia (distanza, conteggio, soglia, giudizio) — *un motore che c'è e risponde sbagliato è peggio di uno che manca*. **Il caso più diverso è `renderStars`, cioè la funzione lasciata fuori:** sta una riga sotto la sua gemella, si chiama quasi uguale, e portarla dentro **non avrebbe rotto niente** — sarebbe stato il primo file di strato con del markup, e *un confine sbagliato che non produce nessun rosso è quello che si eredita*. |
| `test_dati_estratto.js` | Che chi va a prendere i file arrivi, **e arrivi prestissimo**. ⚠️ **Misurato: non parte niente** — né login né casa né mappa, `TypeError: episodeDataFile is not a function`. È il **più rumoroso** dei sei casi della serie, perché `episodeDataFile(id)` gira mentre `MODULE_DESCRIPTORS` viene **costruito**, a tempo di parsing. *Su Pages basta aprire: se la schermata del nome c'è, questo file c'è.* ⚠️ **Il caso più diverso è `applyEpisodeDialogue`, la funzione lasciata FUORI:** l'unica delle quindici che **scrive** invece di leggere, e quello che scrive è `EPISODES`. *La strada comoda era esporre il catalogo su `BI` — due righe, suite verde, e scrivibile da qualunque file per sempre.* È rimasta col catalogo e il caricatore **gliela chiede**; tre asserzioni lo proteggono, falsificate insieme → 11/14. ⚠️ **E una di quelle tre è nata debole:** cercava la chiamata nel **testo** del file, e il commento in testa la **cita** fra apici inversi — restava verde con la chiamata tolta. *Nona comparsa della famiglia del conto sui commenti, in un'asserzione scritta venti minuti prima.* `[A]` verifica anche che **i quattro `fetch` dell'app stiano ora tutti in un file** e nessuno in `index.html`: è la condizione che rende possibile il passo che li unifica. |
| `tests/test_dipendenze_dichiarate.js` | Che **l'ordine dei tag `<script>` resti un vincolo DICHIARATO invece che scoperto**. Ogni file di `app/` dice in testa da chi dipende e *a che titolo* — a tempo di **parsing** (che obbliga l'ordine) o di **chiamata** (che non lo obbliga) — e questo file confronta la dichiarazione col codice vero. ⚠️ **Cosa si perde senza:** `app/avvio.js` legge `BI.THEME_KEY`, che è di `app/identita.js`, e funziona **solo** perché identita è caricato prima. Fino al 2026-09-18 quella dipendenza non era scritta da nessuna parte e non la verificava niente: chi riordinasse i tag romperebbe l'app senza che una riga gliel'avesse detto. *Il guasto non è che la dipendenza esista — è che si scopra soltanto rompendola.* ⚠️ **E l'elenco non c'è, di proposito:** `tests/tools/dipendenze.js` **misura** il grafo dal codice e costruisce la riga che ogni file merita. Un elenco scritto dentro un test invecchia al primo strato nuovo, in silenzio, e continua a leggersi bene — è la forma che in `CLAUDE.md` aveva lasciato quattro file di contenuto senza protezione. **Tre conti invece di un elenco** (blocco `[B]`): quanti file dipendono da qualcosa (2), quanti dipendono **all'insù** da `index.html` (**1, e questo deve calare, mai salire**), quanti a tempo di parsing (0, quindi oggi l'ordine non è ancora stretto). Visto fallire su **tre guasti distinti**: dichiarazione vecchia (1 rossa, e dice il vecchio e il nuovo), tag riordinati (1 rossa, `[C]`), una dipendenza nuova all'insù (3 rosse insieme). **Limite dichiarato:** verifica la dipendenza fra file, non impedisce che ne nasca una in avanti a tempo di parsing — quando succederà `[B]` lo **dice**, ma non è lui a fermarla. |
| `tests/strati.js` *(aiutante, non un test)* | Le **cinque domande strutturali** che ogni strato estratto si fa — tag presente, bloccante, nell'ordine dichiarato, **il divieto di ritorno** con gli alias, e dal 2026-09-18 **il divieto di ALIAS su un nome che lo strato riassegna**. ⚠️ **Quest'ultima è nata da un rosso, e la riga che c'era prima non poteva vederlo:** chiedeva che ogni nome esposto AVESSE il suo alias, cioè esattamente la cosa sbagliata da fare per una variabile che cambia. `app/dati.js` ne ha esposte tre, l'alias ne ha congelato il `null` iniziale, `uiText()` legge la cache senza aspettare, e **ogni testo dell'interfaccia è uscito stringa vuota: sette file rossi su una suite che nove strati avevano passato**. *Nove strati sono passati senza toccarla perché nessuno aveva ancora esposto una variabile che cambia — un confine sbagliato che non produce nessun rosso è quello che si eredita.* ⚠️ **Nato al TERZO caso e non al secondo, di proposito: con due file la forma comune era immaginata, con tre è misurata.** ⚠️ **E quello che NON ci sta dentro è il valore vero di ogni file: cosa si rompe se quel file non arriva** — su `progressi` l'app parte e la mappa resta muta, su `identita` non parte niente. Sono guasti diversi, si guardano in modo diverso, e metterli in un aiutante comune vorrebbe dire scrivere la domanda più generica delle due, cioè nessuna delle due. |
| `test_progressi_estratto.js` | Che il **magazzino dei progressi dello studente** arrivi, e arrivi **prima di chi lo usa**. Il 2026-09-17 trentotto funzioni sono uscite in `app/progressi.js`: finché stavano in linea, essere caricate prima era **la forma del file**; adesso è un tag, e un tag si sposta. ⚠️ **E il guasto è peggiore di quello di `config.js`, perché non somiglia a un guasto:** misurato bloccando la richiesta del file — login **compare**, casa **compare**, mappa **non si apre**, zero passi, **nessuna schermata d'errore**, un solo `TypeError`. *L'app parte: lo studente tocca «Inizia» e non succede niente.* Per questo la verifica a mano su Pages, per questo strato, non è «l'app parte» ma «la mappa si apre e ha i suoi ventidue passi». Tre blocchi: `[A]` dove sta e quando arriva (tag bloccante, dopo `spazio.js`, prima dello script principale), `[B]` il **divieto di ritorno** più l'alias per ognuno dei nomi, `[C]` guidando l'app. ⚠️ **`[C]` ha una guardia contro il morire invece di fallire**, misurata: con un `defer` la mappa non si apre, `waitForSelector` scade e senza guardia il file esplodeva senza stampare niente. **Il caso più diverso è diverso per MOMENTO:** fra i 54 punti di chiamata, quello che si rompe per primo è `isCustomizeSeen` in cima a `openEpisodeMap` — non il più importante, il **primo**, e quindi l'unico che decide cosa vede lo studente. |
| `test_identita_estratta.js` | Che **chi sei e come vedi l'app** arrivino, e arrivino **prima di `app/avvio.js`** — che ha bisogno della chiave del tema per applicarlo prima del primo disegno. ⚠️ **Cosa si rompe se il file non arriva, misurato: nessuna vista attiva, pagina bianca, `TypeError: icon is not a function`.** È l'**opposto** di `progressi` — lì l'app partiva e la mappa restava muta, qui non parte niente. *È il guasto rumoroso: su questo strato «l'app si apre» **è** una verifica che verifica.* ⚠️ **E chiude il caso aperto con lo strato 0:** `avvio.js` leggeva `'baseinglese:theme'` come letterale mentre `index.html` la conosceva come `THEME_KEY` — due punti in due file. Adesso la chiave vive qui e `avvio.js` la legge da `BI.THEME_KEY`; `[C]` conta il letterale **nel codice di tutta l'app** e ne vuole **uno solo**. `[D]` guida l'app: pastiglie dei temi, **icone disegnate** (la prova che la tabella `ICONS` ha traslocato) e il tema che **sopravvive alla ricarica**, che è la prova che i due file leggono la stessa chiave e non due stringhe uguali per caso. **Il caso più diverso è `ICONS`, diverso per NATURA:** l'unico pezzo dello strato che non è una funzione ma un dato — e per questo la prima misura delle dipendenze non l'ha visto, contava le funzioni. L'app è esplosa col primo `icon()`. |
| `test_config_letta.js` | Ogni parametro di `APP_CONFIG` è nominato da qualcuno: una manopola che non muove più niente resta nel Pannello Admin e si finisce per girarla. È il difetto che ha tenuto in vita `pointsPerCorrect`. |
| `test_struttura_corso.js` | `docs/inglese/it/struttura-corso.md` e `APP_CONFIG` dicono la stessa cosa su ordine, gradi e categorie: la fonte (regola 26) non descrive un'app diversa da quella che gira. |
| `test_scala_colori.js` | La scala rosso→giallo→verde sale solo con la costanza, scende di un gradino solo, non salta, e legge `CONFIG.mastery.promotionStreak` invece di avere il numero cablato. È il dato più costoso da ricostruire e il meno visibile a schermo. |
| `test_errore_caricamento.js` | Un fallimento nel caricamento dei dati diventa qualcosa che lo studente vede e da cui può uscire, invece di un modulo che non si apre o che si apre vuoto. Protegge anche che il testo venga dal JSON e che "Riprova" rifaccia davvero l'apertura fallita. Dopo la rimozione delle copie `window.FALLBACK_*` è l'unica rete rimasta sul percorso di caricamento: se sparisse, un guasto tornerebbe a essere invisibile. |
| `test_avviso_microfono.js` | L'avviso "non riusciamo a sentirti" dei due moduli di voce, per **entrambe** le strade con cui un microfono rotto si manifesta: premere e non parlare (il timeout di silenzio) e parlare senza che venga riconosciuta una parola. Che compaia, che salga di livello nell'ordine delle soglie di `CONFIG`, che al livello confermato blocchi "Avanti" lasciando "Torna alla mappa" come uscita, e che sparisca appena una parola viene riconosciuta. Senza, uno studente col microfono rotto resta a fissare zero stelle credendo di pronunciare male. Protegge anche che il pannello stia **fuori** da `#vc-result`: da dentro salirebbe di livello restando invisibile nello stato di riposo, che è il caso peggiore — un meccanismo che funziona e non si vede. |
| `test_sblocco_sequenziale.js` | La promessa dello Sblocco Sequenziale in **entrambe** le varianti (regola 30): dentro un passo più avanti della sequenza non risponde niente — nessun audio, nessun cambiamento — mentre il passo raggiungibile continua a rispondere. Senza, la sequenza torna a essere solo un effetto grafico: la card sembra spenta e il pulsante dentro funziona lo stesso, che è il difetto trovato al 6° collaudo nella variante per dichiarazione. Clicca tutto quello che trova invece di un elenco di pulsanti, così copre anche quelli aggiunti domani. |
| `test_attendi_ci.js` | Che `tests/tools/attendi-ci.sh` dica il **vero** sulla CI, e che **quando non lo sa lo DICA** invece di aspettare per sempre. La regola 38 dice che la CI si legge, non si dà per andata: finché questa attesa non esisteva, quella lettura era improvvisata ogni volta — **tre volte in due giorni, tre difetti diversi**. ⚠️ **E un settimo caso che protegge un difetto NON dello script ma di CHI LO USA**: ogni esito nomina il **commit per intero**, e accanto la riga «se non è quello che hai appena spinto, hai letto un'altra corsa». Si può leggere onestamente il campo giusto di **un'altra corsa** — la difesa non è ricordarsi di usare lo strumento, è che la risposta lo dica da sé. Il giro è su **tutti e cinque** gli esiti, e il caso diverso è l'uscita 4: l'unica che il commit non lo nominava. Sei casi: verde (e **ha aspettato**), fallita (la frase nomina la conclusione), **annullata** — stessa uscita di una rossa ma frase diversa, perché *un pulsante premuto non è un difetto* —, **corsa inesistente** (3), **API illeggibile** (4, e **non aspetta per sempre**: è il quarto difetto, che nessuna delle tre versioni a mano vedeva) e la **prova contraria**: una corsa **viva e lenta** deve uscire con 2, non 3 e non 4. ⚠️ **Non chiama GitHub**: `ATTENDI_CI_FETCH` sostituisce `curl` con risposte preparate, perché un test che dipende dalla **rete** cade per un motivo che non controlliamo affatto — la regola 19 portata all'estremo. |
| `test_attese_condivise.js` | Che le forme condivise di `tests/attese.js` **misurino davvero — e che si veda quando NON misurano**. Non protegge un comportamento dell'app: protegge lo strumento con cui quarantasei file la verificano, e se una forma tornasse `true` senza aspettare niente decine di asserzioni diventerebbero verdi per finta **senza che nessun rosso lo dica**. Quattro blocchi: `[A]` aspettano davvero (la durata lo prova), `[B]` sanno tornare `false` — compreso un selettore che non esiste, che NON è «stato raggiunto» — e `[C]` **la prova contraria**: su uno stato **già vero** una forma torna `true` in meno di 250 ms **senza aver verificato niente**. Il `[C]` esiste perché in due famiglie su due il triage ha escluso punti «già veri» **leggendoli**, e quella ragione deve vivere nel codice invece che nella testa di chi ha letto. ⚠️ **E il blocco `[D]`, sul suono, porta la prova contraria più importante di tutte:** accende una voce che si spegne **da sola**, **non tocca niente**, e mostra che un'attesa «finché non parla più» torna **vera lo stesso**. *Nove punti della regola 16 restano a tempo per questo — i 50 ms sono la distanza fra «l'ha fermato il tocco» e «è finito da solo» — e senza quel blocco, fra sei mesi, sembrano attese pigre da convertire.* Guida una pagina costruita con `setContent`, non l'app: le forme sono generiche, e provarle sull'app significherebbe misurare due cose insieme. **Limite dichiarato:** `attendiSottotitoloEsito` non è provata qui — è esercitata dai file che la usano; se cambia forma, questo è il posto dove metterla. |
| `tests/attese.js` *(non è un test: è il magazzino delle attese)* | Che un'attesa condivisa esista in **un posto solo**. Oggi: `attendiSottotitoloEsito` (un testo che arriva da un fetch), `attendiVisibile` / `attendiNascosto` (una schermata che compare o sparisce), `attendiAbilitato` / `attendiDisabilitato` / `attendiClasse` (un pulsante o una classe che cambia stato), `attendiCheParla` e `attendiTono` (un suono o la voce) — ⚠️ **`attendiCheParla` non prende argomenti** (`speechSynthesis` è uno solo per pagina, e un argomento che può avere un valore solo è un invito a passargli quello sbagliato), e **`attendiTono` prende una lista di frequenze e un minimo**, presi dai due usi veri, e **non svuota `__playedTones`**: l'array è cumulativo e le asserzioni negative della stessa famiglia ci contano. **Due nomi per `disabled` e un argomento per la classe**, e la distinzione è voluta: `disabled` è una variante del comportamento — `attendi(sel, true)` al sito di chiamata non direbbe niente — la **classe è il dato**, e un nome per ognuna sarebbe un elenco che cresce. **Non esiste `attendiClasseAssente`, ed è una decisione con una soglia scritta:** quattro siti aspettano una classe che sparisce, e quattro non giustificano una funzione da difendere per sempre su cui sbagliare produce un test *vuoto* — si fa quando diventano **dieci**. Tutte e tre **ritornano `true`/`false` invece di sollevare**, così lo scadere del tempo diventa l'asserzione che fallisce, con il suo testo, invece di un `TimeoutError` muto. **Limite dichiarato** su `attendiNascosto`: per Playwright «hidden» è vero anche per un elemento che **non esiste più**, quindi dove serve dire «c'è ma è nascosto» il controllo sull'esistenza resta al chiamante. |
| `test_attendi.js` | Che `tests/tools/attendi.sh` riporti il codice **giusto** — 0 finito bene, 1 finito male — e che, quando si **arrende**, dica *quale* dei due guasti ha davanti: **2** se il lavoro è vivo e non finisce, **3** se è morto o non è mai partito (con due frasi distinte, perché «cerca il processo» e «controlla il percorso del log» sono due ricerche diverse), **64** se gli argomenti erano sbagliati. È l'unico strumento fra «la suite è finita» e quello che se ne racconta: se sbaglia codice, un rosso passa per verde e il suo output somiglia a un risultato in entrambi i casi. Guida comandi veri che ci mettono un momento a dichiarare l'esito, così l'attesa deve girare almeno un giro — un log già scritto proverebbe solo che sa fare `grep`. **Le due metà si provano separatamente:** il *guasto realistico* (un lavoro che scrive e poi viene ucciso — togliendo il rilevatore di silenzio cadono 6 asserzioni) e la *prova contraria* (un lavoro vivo e lento, che deve uscire 2 e non 3 — con un rilevatore troppo zelante cadono esattamente quelle 3). Gli insiemi sono disgiunti: nessuna delle due metà copre l'altra. **Limite dichiarato:** le soglie di *default* (tetto 5400 s, silenzio 600 s) non sono provate — il test le pilota con `ATTENDI_SILENZIO` e il 4° argomento, perché provare i default gli costerebbe l'attesa che deve misurare. |
| `test_pulizie_registrate.js` | Che **uscire da un modulo fermi davvero tutto**, adesso che `stopAllModuleActivity` non nomina più nessuna famiglia. ⚠️ È il primo passo della catena che **toglie nomi invece di aggiungere un file**, e ha una proprietà scomoda: se un modulo smettesse di registrarsi **nessun test esistente diventerebbe rosso** — le pulizie sono idempotenti, chiamarle due volte non rompe niente, e non chiamarle non rompe niente *subito*: lascia un timer vivo, un audio che continua, un microfono acceso sopra un'altra schermata. **Per questo il conto è «esattamente 5», non «almeno 1»:** un `>= 1` passerebbe con quattro moduli spariti dal registro. **E l'asserzione sul `catch` non è un accessorio: è la metà che rende accettabile il `try/catch`.** Prima, una pulizia che esplodeva non fermava le altre — fermava la **navigazione**, perché l'eccezione risale a `showView`, punto unico di ogni spostamento: misurato, l'app diventa inutilizzabile **dalla prima navigazione in poi**, non solo all'uscita. Il `catch` toglie quel guasto; senza un'asserzione avremmo scambiato un guasto rumoroso con uno silenzioso. **Il caso più diverso (regola 42):** le **tre** pulizie che non appartengono a nessun modulo (`synth.cancel`, `closeAttemptPopup`, `clearPendingMastery`) — non il caso complicato, quello a cui **manca un modulo che possa registrarlo**, e che per questo resta nominato. Visto fallire su quattro guasti: un modulo che non si registra (2 rosse, col nome), `moduleEpoch++` spostato dopo la pulizia, il `catch` reso muto, e il `try/catch` tolto (5 rosse). ⚠️ **Due delle asserzioni catturano l'attesa apposta**, perché il guasto cercato è proprio «non si naviga più»: lasciandola nuda il test **moriva** con un `TimeoutError` invece di **fallire** dicendo cosa era successo. **Limite dichiarato:** `[B]` guida un modulo solo, Ripeti a Tempo, l'unico in cui un timer sopravvissuto si misura senza ambiguità; gli altri quattro li prende `[A]`. |
| `test_report_mastery.js` | Che il pannello dei colori delle voci mostri quello che c'è davvero nel magazzino, ordinato per chiave, e soprattutto che **legga e basta**. È uno strumento per guardare un dato che a schermo non compare da nessun'altra parte: se mostrasse un numero sbagliato nessuno se ne accorgerebbe, perché non c'è nient'altro con cui confrontarlo. L'asserzione che pesa di più è che aprirlo non cambi un byte della mastery — un report che modifica quello che misura è peggio di nessun report, e il rischio è concreto: la funzione carica lo store con la stessa `loadMastery()` del travaso, a un carattere da un `saveMastery()`. L'ordine per chiave non è estetica: è il punto del pannello, perché le righe della stessa voce devono finire vicine. **Limite dichiarato:** non verifica quante volte una voce è stata scritta, perché quel dato non esiste. |
| `test_episodi_corti.js` | Che un episodio con una **forma diversa dal primo** non produca silenzio. Tre difetti della stessa famiglia, tutti e tre senza crollo — e per questo erano rimasti: un passo con un `kind` sconosciuto che diventa un vicolo cieco muto e blocca per sempre quelli dopo; un passo puntato su un grado assente che si dichiara **completato senza far fare niente** e registra pure l'esito; la migrazione di `customizeSeen` che scrive in episodi che Personalizza non ce l'hanno. Diventano urgenti con gli **episodi corti** (solo gradi C e D): è lì che tutti e tre mordono. Le tre forme sbagliate si costruiscono dagli override del Pannello Admin, non da un secondo episodio finto. **Limite dichiarato:** verifica che il passo non si completi e che lo studente veda qualcosa, non il testo dell'errore — quello è di `test_errore_caricamento.js`. |
| `test_sequenze.js` | Che ogni episodio dichiari la propria sequenza di passi, che le due strade per dichiararla (`sequence` per nome, `moduleOrder` per intero) non si sovrappongano in silenzio — dichiararle entrambe, o nessuna, è un errore detto e non risolto scegliendone una — e soprattutto che il passaggio alle sequenze **non abbia mosso nessun id di passo**. Quest'ultima è la parte che pesa: i progressi salvati sono indicizzati per id di passo, e se un id si muove ogni studente riparte da zero senza che niente si rompa a schermo. Gli id attesi si leggono dalla sequenza vera in `index.html`, non da una lista ricopiata nel test. **E, dal 2026-09-09 (passo 8), che i due episodi abbiano gli STESSI passi con la stessa categoria** — il blocco `[A2]`. `modulesById` non è più scritto dentro ogni episodio: i quindici descrittori sono uno solo e ogni episodio ne riceve una copia col proprio `dataFile`. Se un episodio ne perdesse uno, l'app **non si romperebbe**: mostrerebbe una riga senza categoria, e nessuno saprebbe quale dei due episodi è quello giusto. **Si confrontano i due elenchi fra loro**, non contro una lista scritta nel test: l'invariante non è «sono questi», è «sono gli stessi». ⚠️ **La prima versione di questa asserzione guardava i soli id ed era vuota:** gli id vengono dalla *sequenza*, non da `modulesById`, quindi la riga resta in mappa anche senza descrittore. Dichiarava verde un episodio con un modulo mancante, e l'ha rivelato solo l'iniezione del guasto. Adesso confronta la riga **come si vede** — id più categoria. |
| `test_episodio2.js` | Che `data/inglese/it/inglese-it-aircraft-door.json` continui a dire quello che dichiara `docs/inglese/it/inglese-it-aircraft-door.md`. Quando i due divergono non crolla niente: i moduli si aprono pieni e hanno l'aria giusta, semplicemente insegnano una cosa che il documento non dice più. Confronta i numeri dichiarati e le due cose che un conteggio non vede: che ogni skill stia su una battuta esistente e che ogni `fromLine` punti a una battuta vera. **Limite dichiarato:** il testo NON è confrontato — i due markdown hanno forme diverse e un secondo parser sarebbe più fragile di quanto protegga. La scadenza scritta qui («quando l'episodio 2 entrerà in `EPISODES`») è arrivata il 2026-09-08 e il limite è rimasto: la condizione nuova è registrata in `docs/decisioni.md`. |
| `test_interruttore_episodio.js` | Che scegliere un episodio nel Pannello Admin apra **davvero quello**, con il suo contenuto. È l'unica strada che esiste per raggiungere un episodio diverso dal primo: se smette di funzionare, l'app continua a funzionare benissimo mostrando sempre lo stesso episodio, e non se ne accorge nessuno finché non si prova a collaudare il secondo. Protegge anche che l'episodio 2 sia collegato al **suo** file dati — un episodio «collegato» che serve il contenuto dell'altro è il caso peggiore, perché la schermata è piena e ha l'aria giusta — e che un id inesistente non lasci una pagina bianca ma lo **dica** in console. Il menu si confronta con gli episodi che dichiarano una sequenza in `CONFIG.episodes`, non con un elenco scritto nel test: un episodio nuovo entra da solo. **Limite dichiarato:** si guarda un modulo solo (Meet the Story); un descrittore sbagliato su uno degli altri ventuno passerebbe. **E, dal 2026-09-09 (C.4), che il pulsante di casa e il badge in mappa nominino lo STESSO episodio.** La stringa «Inizia Episodio 1» era incollata nell'HTML e nessuno gliela riscriveva: sull'episodio 2 il pulsante diceva «Episodio 1» mentre la mappa, un tocco dopo, diceva «Episodio 2» — due schermate della stessa app che si contraddicevano. L'asserzione **confronta le due schermate fra loro**, non con un testo atteso scritto nel test: è il requisito vero (concordano), e un badge ricopiato qui invecchierebbe al primo episodio nuovo. Vista fallire rimettendo il difetto. |
| `test_match_practice_nonloso.js` | Che in Match Practice «Non lo so» torni **attivo** sulla domanda successiva dopo una risposta giusta. Si spegne insieme alle opzioni e lo riaccende `qmRenderQuestion`: se quella riga sparisce, dalla seconda domanda in poi una delle due uscite dell'esercizio non c'è più — e non crolla niente. È anche il **modello** con cui vanno riscritte le diciannove attese fisse di `test_batch19.js` (`docs/decisioni.md`): la stessa asserzione lì aspetta 800 ms a caso e poi legge; qui si aspetta *quello che il lavoro produce* — la domanda successiva a schermo — e lo stato si legge dentro la stessa chiamata che aspetta. Sull'ultima domanda del passaggio non si risponde mai giusto di proposito: lì la «domanda successiva» non esisterebbe, ed era uno dei due sospetti mai dimostrati del rosso in CI di `test_batch19`. **Limite dichiarato:** una sola direzione (en→it). |
| `test_blocco_ascolto.js` | Che il **Blocco Ascolto** sia un pezzo solo, e che «bloccato» voglia dire la stessa cosa dovunque compaia. Il pulsante «ascolta» + le velocità lo mostrano sei moduli, e fino al 2026-09-09 il suo markup era **ricopiato a mano in sette punti** (la coda del gestore del tocco in altri cinque): nessun test poteva accorgersene, perché sette copie identiche passano tutti i verdi — e sei identiche più una diversa pure. **Come, ed è il punto del file:** la domanda «sono tutti uguali?» non si risponde confrontando i moduli, si risponde verificando che il markup abbia **una sola sorgente** — così l'uguaglianza non è da verificare, è una cosa che non può non essere vera, e l'ottava copia scritta a mano fa fallire la CI subito. Poi, nel browser, quello che la sorgente unica non prova: che dentro una card bloccata il blocco si veda **spento** (opacità e `pointer-events`, non il silenzio — l'audio non partiva già prima, ed è per questo che il difetto è vissuto tanto), e che le **due varianti dello Sblocco Sequenziale** siano inerti allo stesso modo, con la stessa `.is-tap-locked`. L'aspetto invece resta diverso apposta (regola 30) e qui non si asserisce. Visto fallire su due guasti: la riga che spegne il blocco tolta, e un modulo che torna a ricopiare il markup. **Limite dichiarato:** apre due moduli su sei — gli altri quattro li copre la sorgente unica, ma un modulo che smettesse di *chiamare* il componente qui non si vedrebbe (lo prendono `test_batch16`, `test_batch17`, `test_story_modules`) — ⚠️ **e Match Practice en→it resta scoperto**: il suo blocco della consegna (`#qm-prompt-audio`) era cercato solo da `legacy/test_qm`, che stava fuori dalla suite e non lanciava nessuno. Cancellando quella cartella il buco non nasce, si vede. **Costo dichiarato:** è la terza dipendenza da `index.html` letto come testo, ed è una scelta. |
| `test_config_estratto.js` *(esteso al passo 22)* | ⚠️ **Dal 2026-09-17 protegge anche l'ordine fra DUE FILE ESTRATTI**, che prima non poteva esistere. Il primo lettore di `APP_CONFIG` a tempo di parsing era un blocco **in linea**, e il suo venire dopo `config.js` **non era una scelta: era la forma del file** — una cosa in linea sta necessariamente dopo i tag sopra di lei. Uscito in `app/avvio.js`, sono due righe che si possono scambiare. **Misurato scambiandole: il tema non si applica, `APP_CONFIG_DEFAULTS` non si crea, e c'è un errore JS — l'app si rompe nel modo invisibile**, che è esattamente il caso che questo file aveva già scelto come più diverso. **Più l'asserzione che vieta il RITORNO** (il blocco rimesso in linea): senza, rimettercelo passerebbe verde, perché i due tag ci sarebbero ancora e nell'ordine giusto. *Falsificate separatamente: scambiare i tag lascia verde il divieto, rimettere il blocco in linea lascia verde l'ordine.* |
| `test_uscita_dal_modulo.js` | Che **uscire da un modulo lo PULISCA davvero** — timer, registrazioni, sequenze — adesso che la pulizia non sta più dentro `showView` ma dentro `leaveModule` (passo 22, regola 21 riscritta). ⚠️ **Due blocchi, e nessuno copre l'altro:** `[A]` legge il **sorgente** e prende «qualcuno ha chiamato la funzione sbagliata» — i chiamanti diretti di `showView` devono restare i **2** dichiarati in `tests/BASELINE-USCITA.txt`, e i punti che lasciano un modulo devono essere **12**; `[B]` **guida l'app** e prende «la pulizia non è arrivata», avvolgendo le voci di `BI.pulizie` e verificando che girino uscendo da **ognuna delle otto famiglie** (derivate da `FAMIGLIE`, non scritte a mano). **Misurato, non sostenuto:** rompendo la catena *dentro* `leaveModule`, `[B]` cade tutto e `[A]` resta **verde** — è il guasto che `[A]` non può vedere. E rompendo un punto di chiamata cadono entrambi, perché **tutte e otto le uscite passano da `openEpisodeMap`**: uno dei dodici punti porta otto famiglie su otto. **Il guasto è silenzioso:** un modulo che non si pulisce non alza eccezioni — i suoi timer continuano su una schermata che non c'è più. **Limite dichiarato** (scritto anche in testa al baseline): `[A]` vede solo le chiamate **letterali** nel sorgente; una chiamata indiretta le sfugge, e oggi non ne esiste nessuna (misurato). |
| `test_avvio_invariato.js` | Che il **passo 22 SPOSTI il codice in file separati senza cambiare cosa l'app fa all'avvio**: quali moduli si registrano e **in che ordine**, quali pulizie, con quanti file di script, e su quale schermata si arriva. ⚠️ **Nasce prima della prima estrazione, ed è voluto** — stessa ragione di `test_listener_una_volta.js`. **I quattro guasti che prende sono silenziosi**: un modulo registrato dopo il boot (la mappa apre e non trova il kind), uno perso del tutto (un passo muto), uno registrato due volte, l'ordine cambiato. Nessuno fa rumore al boot: l'app parte, il login compare, e il guasto aspetta il primo studente. **La fonte è `tests/BASELINE-AVVIO.txt`, non il sorgente** (regola 44 sull'elenco). ⚠️ **E il baseline dell'avvio è diverso da quello dei listener:** quello non doveva cambiare **mai**; questo **può** cambiare, ma solo per una **decisione strutturale dichiarata**, e allora si riscrive nel commit di quella decisione — mai come effetto collaterale di uno spostamento. *Se si riscrive quando fa comodo, torna a essere un rapporto.* **Limite dichiarato:** dice cosa succede all'avvio, **non** cosa può stare in quale strato — quella domanda la serve `tests/tools/dipendenze.js`, che non è nella suite apposta. |
| `test_listener_una_volta.js` | ⚠️ **E LA RIGA CHE VALE OLTRE IL 21-QUATER, tenuta qui perché è il caso che l'ha insegnata:** *un test che nasce INSIEME al refactor che dovrebbe proteggere non protegge niente — la prima volta che il meccanismo viene messo alla prova è anche la prima volta che qualcuno lo guarda.* Questo file è nato **prima** della prima delle otto conversioni, ed è stato falsificato in tutte e due le direzioni prima che un solo listener venisse spostato. Alla chiusura del 21-quater (2026-09-17, 8 famiglie su 8, 79 listener) **`tests/BASELINE-LISTENER.txt` non era cambiato in otto giri**: è l'unica prova che nessuna delle otto conversioni abbia aggiustato il conto invece del codice. · Che **ogni pulsante di ogni modulo abbia il proprio listener col numero giusto** — né zero, né uno di troppo — per tutta una sessione, riaperture comprese. ⚠️ **Nasce PRIMA del passo 21-quater**, che sposta ~79 listener dentro l'`open` del proprio modulo e i cui due guasti sono **entrambi silenziosi**: attaccato due volte → l'azione parte due volte; non attaccato → il pulsante non fa niente. Nessuno dei due alza un'eccezione. È verde su questo codice **ed è giusto così** (un test di regressione per un refactor è verde prima e dopo); quello che conta è che sia stato **falsificato su tutte e tre le direzioni prima che un solo listener fosse spostato**. **Si contano i COLPI, non gli effetti:** un test che verifica «il pulsante funziona» resta verde quando il listener è attaccato due volte — metà del guasto, ignorata. Si strumenta `EventTarget.prototype.addEventListener` prima che l'app parta, così 0, 1 e 2 sono tre risultati distinti. ⚠️ **E il confronto è col BASELINE (`tests/BASELINE-LISTENER.txt`), non col sorgente:** la prima forma derivava le attese dallo stesso file che controllava, quindi togliendo la riga di un listener spariva anche l'attesa e il test restava verde — si misurava contro sé stesso. ⚠️ **Il baseline porta il NUMERO e si misura guidando l'app**, perché i sette `*-complete-btn` hanno **due** listener (il suono d'uscita di `renderSummaryScreen` e il completamento): con un «non zero», un pulsante che *suona e non completa* sarebbe passato — provato, e prima passava. **Il caso più diverso (regola 42):** la **riapertura** — non un modulo complicato, lo stesso modulo aperto tre volte, perché il gesto più banale chiama `open` tre volte (misurato). **Limite dichiarato:** copre i listener con un `getElementById` più quelli osservati guidando; restano fuori quelli su una variabile (`speakBtn`, `micBtn`) e su `document`/`window` — **due dei quali sono di un modulo**, e il 21-quater li tocca senza che questo file li guardi. ⚠️ **E l'elenco su cui gira `[E]` si DERIVA, dal 2026-09-16:** prima era scritto a mano, e una delle sue sei voci non conteneva quello che il nome diceva — `flashcard: ['flashcardAEngIta','flashcardAItaEng']` sono due **passi** che condividono **un** kind, non due kind. Il blocco **verificava cinque famiglie e ne dichiarava sei**, ed era invisibile perché per **tredici descrittori su quindici** il nome del passo e quello del kind sono la stessa stringa. Adesso la coppia passo↔kind viene da `MODULE_DESCRIPTORS` e il raggruppamento per blocco da `BI.moduli` dell'app viva. ⚠️ **`[F]` controlla la derivazione stessa**, perché una derivazione che torna *meno* del dovuto fa saltare famiglie in silenzio — un verde più grande di quello di prima: incrocia le due fonti e congela il conto (5 famiglie a più kind, 3 a kind singolo). **Su quelle 3 la chiave sbagliata passa verde**, ma **non per la stessa ragione**: su Flash Card e Repeat Aloud il nome di famiglia e il `kind` sono *la stessa stringa*, su Personalizza sono *diversi* (`personalizza` / `personalizzazione`) e la chiave sbagliata funziona solo perché il kind è uno — coincidenza contro sufficienza. Lì la chiave la protegge solo la regola scritta accanto a `BI.unaVoltaSola`, e `[F]` è l'unico avviso se una di loro prendesse un secondo kind. ⚠️ **E `[C]` gira su OTTO famiglie, non sette, dal 2026-09-17:** filtrava su `tornaAllaMappa`, che è `null` per Personalizza perché quel modulo non ha un «← Mappa» (categoria Inizio, regola 17) — risposta giusta a quella domanda e sbagliata a quella che serviva qui, «come torno alla mappa per riaprire». Il campo è stato **separato** in `uscitaVersoMappa` (`start-episode` per Personalizza), e Personalizza è entrata nel ciclo delle riaperture — l'unica famiglia il cui blocco, dopo il ⑦, non sarebbe protetto da nient'altro. **Falsificato nelle due direzioni**: un listener senza guardia dentro `openCustomize` fa `1 → 4` con la forma nuova e resta **verde** con quella vecchia. |
| `test_mastery_al_gesto.js` | Che **quello che lo studente ha fatto dentro un modulo si salvi solo se lui lo chiede**, premendo il pulsante di uscita. Fino al 2026-09-10 otto moduli scrivevano i colori della mastery **a ogni risposta**: chi apriva Match Practice, rispondeva a tre domande e usciva da «← Mappa» si portava dietro tre colori per sempre, senza aver dichiarato niente e senza che il modulo risultasse fatto. Il Dialogo faceva lo stesso con l'esito — «Sì, lo so» scriveva il verde sulla mappa anche uscendo subito dopo — e Why We Say It aveva **due magazzini con due regole diverse**, di cui solo uno rispettava il gesto. La regola adesso è una: «Ho finito» salva esito, voci e completamento; «Esci e riprendi dopo» salva solo le risposte dichiarate; «← Mappa» non salva niente. **Come, e sono due strade:** la domanda «nessuno scrive più fuori dal pulsante?» non si risponde aprendo gli otto moduli, si risponde verificando che esista **un solo punto in tutta l'app** che chiama `saveMastery` (dentro `commitPendingMastery`) e **uno solo** che applica la scala (dentro `recordPendingMastery`) — così la nona scrittura diretta fa cadere la CI il giorno che nasce. Poi, nel browser, quello che la struttura non prova: il **confronto fra le due uscite** — stesse risposte, due pulsanti, zero voci contro tutte. Non basta guardare il magazzino pieno dopo «Ho finito»: era pieno anche prima della correzione. Visto fallire su tre guasti: Match Practice che torna a scrivere subito, il Dialogo che riscrive all'autovalutazione, i conteggi editoriali che tornano a ogni risposta. **Limite dichiarato:** dei moduli che scrivono voci ne guida uno (Match Practice en→it) — un modulo che smettesse di *chiamare* `recordPendingMastery` qui non si vedrebbe (lo prendono `test_batch12`, `test_scala_colori`, `test_batch15`). **Costo dichiarato:** un'altra dipendenza da `index.html` letto come testo, e il conto si fa a commenti tolti. ⚠️ **E dal 2026-09-17 l'invariante è seguito dove è andato a stare** (famiglia ⓪-undecies): la scrittura vera non è più dentro `saveMastery` ma dentro `scriviMagazzino`, condiviso da nove scrittori — quindi c'è una riga in più che vieta a chiunque altro di passare `masteryStorageKey` a quel punto unico. *Senza, un decimo scrittore non toccherebbe `saveMastery` e le due righe sul conto resterebbero verdi a invariante rotto: misurato, cade solo la riga nuova.* |
| `test_tabelle_personalizzazione.js` | Che **il magazzino della personalizzazione — nomi, città, paesi — resti fuori dal codice e nessuno torni a leggerlo come se fosse già in memoria**. Fino al 2026-09-15 `people` e `places` stavano in `APP_CONFIG`, cioè erano lì **per costruzione**: chiunque poteva leggerli in qualunque istante senza aspettare, e chi lo faceva era corretto. Portarli in `data/inglese/it/` non è uno spostamento di file, è una **conversione ad asincrono**. **Come, e il punto è tutto qui:** «nessuna lettura sincrona prima del login» non si verifica elencando i lettori — l'elenco invecchia — ma **togliendo la possibilità**: se `APP_CONFIG` non contiene più quelle chiavi, una lettura sincrona non è sbagliata, è **impossibile**, e chi volesse rimetterne una dovrebbe prima rimettere lì le tabelle. Più: il file non viene nemmeno chiesto alla rete prima del login, l'override salvato dal Pannello Admin sopravvive allo spostamento, e la finestra di caricamento si **riproduce** con 800 ms di ritardo invece di rincorrerla (regola 44). ⚠️ **E il blocco `[F]` esiste perché senza di lui questo file mentiva:** rimettendo la forma ingenua — magazzino caricato «per conto suo» e letto senza aspettarlo — su rete normale cadeva **solo** l'asserzione strutturale, mentre quelle di comportamento restavano verdi, perché il fetch torna prima che Playwright possa guardare. Dentro la finestra invece consegna **6 slot vuoti su 8**: è la regola 19 vista da dentro, e la differenza fra proteggere un comportamento e proteggere una stringa. **Il caso più diverso (regola 42):** `aircraft-door`, l'unico episodio che non usa **nessuna** tabella `people.*` — solo `places.destinations`. **Limite dichiarato:** NON verifica che il contenuto sia quello di `docs/inglese/it/tabelle-personalizzazione.md`. Oggi **non lo è**, ed è una scelta scritta (sei destinazioni invece di undici, id vecchi, traducibilità dedotta invece che dichiarata): il passo era una conversione pura. Il confronto col magazzino vero nasce col passo che porta il contenuto. |
| `test_moduli_registrati.js` | Che **ogni modulo si apra passando dal registro**, e che un `kind` che nessuno ha registrato finisca sulla schermata d'errore invece che nel silenzio. Dal 2026-09-16 `openModuleByKind` è passata da otto `else if` a `BI.moduli[module.kind]`. ⚠️ Come il 21-bis **è un passo che toglie nomi**: se un modulo smettesse di registrarsi nessun test esistente diventerebbe rosso — la sua riga aprirebbe la schermata d'errore, che è un comportamento *previsto per un altro caso*. **Per questo il conto è «esattamente 14»**, quattordici `kind` per otto funzioni. **E il cambio di comportamento è protetto come tale:** prima quattro rami su otto guardavano una proprietà del descrittore (`storyProfile`, `voiceVariant`, `dialogoProfile`, `flashcardDirection`), quindi un modulo con `dialogoProfile` e un `kind` sconosciuto **si apriva lo stesso**; adesso va all'errore. È voluto — il difetto degli episodi corti chiuso da un'altra parte — e se un giorno un episodio smette di aprirsi, questa è la riga da leggere. **Il caso più diverso (regola 42):** `flashcard`, l'unico `kind` condiviso da **due** descrittori — non il modulo complicato, quello che rompe l'assunzione «un descrittore, una chiave», e che collide con la guardia sui duplicati scritta due passi prima. Visto fallire su quattro guasti: un kind che non si registra (2 rosse, col nome), `flashcard` registrato due volte (l'app non parte, e il test lo **dice** invece di morire), il ramo `showLoadError` tolto (2 rosse), la causa resa indistinguibile in console (1 rossa). ⚠️ **Tre attese catturate apposta** — il guasto cercato è sempre «qualcosa non si apre», quindi l'attesa nuda farebbe **morire** il test invece di farlo fallire. **Limite dichiarato:** non verifica che un modulo *funzioni* una volta aperto; solo che la risoluzione arrivi alla funzione giusta. ⚠️ **E dal 2026-09-18 un blocco `[E]` PROVVISORIO**: la premessa del passo 23 — «un modulo non è nominato da fuori» — nell'unica forma in cui è vera, cioè **non «zero riferimenti» ma «uno solo, e dichiarativo»**. Il catalogo deve nominarlo e il modulo deve dichiararsi; quello che non deve succedere è che altre funzioni scrivano il suo id a mano. **Quando il primo modulo sarà fuori, il blocco cambia forma** — «dentro» e «fuori» diventano due file. ⚠️ **E se nessuno lo cambia resta verde verificando una cosa sempre vera:** cercare `'personalizzazione'` in un `index.html` da cui Personalizza è uscita non trova niente **per costruzione**. *È l'asserzione vacua: lasciarlo com'è non è neutro, è peggio che toglierlo.* |
| `test_modulo_pronto.js` | Che **un modulo non mostri una schermata toccabile prima di avere il contenuto su cui lavorare**. Il 2026-09-10 `openVoiceCoach` disegnava la schermata e **accendeva il microfono**, mentre la battuta arrivava dentro un `Promise.all` che aspettava anche `messaggi-feedback.json` — un file di testi **il cui risultato non veniva nemmeno letto**. Premerlo lì faceva esplodere `vcTargetText()` su una battuta nulla. ⚠️ **Non era un difetto dei test:** in CI è costato una corsa rossa, ma per uno studente su rete lenta era un microfono acceso sopra «Caricamento...» che, premuto, non fa niente e non dice perché — e la regola 35 non lo copre, perché difende il *fallimento* del caricamento, non la *finestra* in cui sta arrivando. **Come:** la domanda «la finestra c'è ancora?» non si risponde guardando (in condizioni normali dura **1 ms**), si risponde **ritardando il fetch di due secondi** — il guasto realistico della regola 32. Più l'asserzione strutturale su `openModuleFromMap`, il punto unico da cui passano tutti e otto i moduli. Visto fallire su due guasti: il precaricamento rimesso (5 rosse) e l'attesa tolta da `openModuleFromMap` (2 rosse). ⚠️ **E porta dentro il buco che si è aperto da solo:** la prima versione di questa correzione chiedeva il file episodio anche a **Personalizza**, che è l'unico dei sedici moduli a non averne uno — e la schermata d'errore compariva su un modulo perfettamente funzionante, cinque file di test rossi. Il test di allora non se ne accorgeva perché guidava **solo Voice Coach**: il blocco `[C]` è quel buco chiuso. **Limite dichiarato:** guida un modulo solo, Voice Coach, perché è l'unico che nella finestra *esplode* — gli altri sette accettano un gesto che non fa niente, e quel caso lo prende solo l'asserzione strutturale. |
| `test_testi_interfaccia.js` | Che i testi dell'interfaccia arrivino **davvero** da `data/inglese/it/istruzioni-moduli.json` (regola 8) e non tornino di nascosto nel codice — e che la riga che lo rende possibile non sparisca. **Cosa si perde senza:** il passo 18 ha spostato nel file i testi scritti su richiesta (Blocco Ascolto, microfono, pannello Help, Dialogo); il meccanismo è `uiText()`, che legge la **cache** senza aspettare, e la cache è calda solo perché `openModuleFromMap` chiama `loadModuleInstructions()` nel suo `Promise.all`. ⚠️ **Quella riga è un punto solo per tutti e sedici i moduli: se sparisce, l'app non crolla — mostra stringhe VUOTE.** Un'interfaccia senza etichette non alza nessuna eccezione e non fa fallire nessun altro test: è esattamente il guasto che nessuno vedrebbe. **Come, e non il modo ovvio:** non confronta lo schermo con una frase scritta nel test — sarebbe una copia, e il passo 15 ha già pagato quel prezzo — ma legge il JSON come lo legge l'app. ⚠️ Questo **non** lo rende vero per costruzione (regola 44): l'app prende il testo dalla cache del fetch, il test dal file su disco, e in mezzo c'è tutto il meccanismo protetto (la chiave giusta, il segnaposto sostituito, la cache calda al momento giusto). **Visto fallire sul guasto vero:** tolta quella riga dal `Promise.all`, **10/14** — e i quattro che cadono sono esattamente i punti **sincroni**, mentre il pannello Help resta verde perché gira dopo. ⚠️ **Il caso più diverso (regola 42): Personalizza, l'unico dei sedici senza `dataFile`** — quello che andò rosso su cinque file il 2026-09-10, l'ultima volta che qualcuno aggiunse qualcosa a quel `Promise.all`. ⚠️ **E dal giro B il blocco `[7]`, che protegge una garanzia diversa: l'attesa della schermata di intro copre TUTTO quello che mostra, non solo il corpo.** Il pulsante resta **spento** finché il JSON non c'è, invece di restare muto accanto a un «Caricamento...» che parlava solo del corpo. Guida la **mappa** di proposito: è il solo percorso in cui il JSON non è già caricato (ci si arriva dalla home, non da `openModuleFromMap`). ⚠️ **E RALLENTA LA RETE A 400 ms, che è la correzione di un difetto di questo stesso file:** la prima versione guardava subito, e misurato il fetch **aveva già risolto al primo istante osservabile** — il blocco restava verde anche togliendo il `disabled` dal codice, cioè era vero per costruzione (regola 44). *Una finestra che si chiude più in fretta di un round-trip non si osserva correndole contro: si riproduce.* Visto fallire su due guasti: tolto il `disabled` → 17/21 con la prova esatta, rimessa una copia dell'etichetta nel codice → 20/21 con un rosso solo. **Limite dichiarato:** guida due moduli su sedici; un modulo che smettesse di **chiamare** `uiText()`, tornando a scrivere il testo nel codice, qui non si vedrebbe. |
| `test_conta_attese.js` | Che il **censimento delle attese a tempo** sappia distinguere una **guardia** (un'attesa da cui dipende il verde di un'asserzione) da un'attesa di **navigazione**, e che identifichi ogni punto con l'asserzione INTERA invece che con un pezzo. Perché un test per uno strumento che conta righe: la stessa ragione di `test_conta_asserzioni.js` — uno strumento di misura, se si guasta, non lo dice: continua a stampare un numero, e il numero somiglia a un risultato (regola 37). ⚠️ **E qui pesa più del solito, perché il danno è già successo:** `ATTESE-FISSE.md` era scritto a mano per numero di riga, dichiarava 141 punti, e il 2026-09-10 si è scoperto che **140 dei 141 numeri erano sbagliati, 4 righe non esistevano più e le guardie vere erano 180.** La fase 3 era stata pianificata su quel documento. **Come:** un file di test finto, in una cartella temporanea, passato allo strumento per argomento. ⚠️ La prima versione lo scriveva dentro `tests/` e riscriveva la riga `FILES` di `run_full_regression.sh` — cioè modificava lo script che stava eseguendo la suite, mentre la eseguiva: la regola 36 vista da dentro. Visto fallire su due guasti: lo strumento che smette di riconoscere le attese vere, e l'etichetta che torna a fermarsi al primo pezzo. ⚠️ **E l'11 settembre quella prima riga si è rivelata vera solo a metà, ed è un caso di regola 42:** il guasto era guidato con `waitForSelector` — il caso comodo, quello già in mano — mentre lo strumento aveva smesso di riconoscere **cinque delle otto funzioni di `tests/attese.js`**, e il censimento contava 79 guardie dove il vero era 56. Il limite non era dichiarato: la riga prometteva il comportamento intero. Ora il file finto porta **un blocco per ogni export di `attese.js`, generato leggendoli**, quindi una funzione nuova del magazzino porta qui il suo caso il giorno stesso — un comando invece di un elenco (regola 41). ⚠️ **E dal 15 settembre il blocco `[F]`, che protegge il punto cieco appena chiuso:** la lista `FILES` nomina i file che la suite LANCIA, quindi un'attesa portata FUORI da un file di test — dentro un modulo condiviso — girava a ogni corsa senza entrare in nessun conto. Finché i moduli condivisi non ne contenevano nessuna il punto cieco era **vuoto**, e non aveva mai mentito: la prima ad atterrarci è quella di `openModule`, unificata in `map-driver.js`. *Un punto cieco vuoto non è un punto cieco chiuso — è lo stesso difetto che aspetta l'occasione, e l'occasione è il primo passo che sposta codice fuori dai file di test.* Senza `[F]` il totale **scende** a ogni unificazione mentre le attese continuano a girare, cioè il numero migliora proprio quando lo strumento smette di misurare. Il caso guidato è il più **diverso** (regola 42): un modulo condiviso che sta **fuori** da `tests/` — i moduli veri stanno tutti accanto ai file che li richiedono, quindi una risoluzione ancorata a `tests/` passerebbe su tutti loro e proverebbe zero. **Visto fallire davvero, non per finta:** scritta l'asserzione, è uscita rossa perché la scoperta dei moduli condivisi non veniva applicata ai file passati a mano — cioè proprio la strada che questo test percorre. **Limite dichiarato:** non prova che la classificazione per famiglia («cosa aspetta») sia giusta su ogni caso vero — è un'euristica sul testo, e lo dice anche in testa allo strumento. |
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
