# Componenti condivisi

**Il magazzino da cui si preleva.** Un pezzo sta qui quando **più di un file lo
usa già**. Prima di scrivere qualcosa di nuovo si guarda qui, poi in
[`componenti-singoli.md`](componenti-singoli.md) — e se là c'è qualcosa che fa
quello che serve, **lo si promuove invece di riscriverlo**. Creare un pezzo
nuovo è l'ultima spiaggia, non la prima.

> ⚠️ **Il passo ② è quello che oggi mancava, ed è il motivo per cui sono
> esistiti sette Blocchi Ascolto:** nessuno aveva un posto dove guardare prima
> di scrivere.

> **Quando si SCRIVE una riga qui dentro lo dice la regola 46 «CHI TOCCA,
> CATALOGA»**: un passo di codice non è finito finché i file che ha toccato non
> sono catalogati, **nello stesso commit**. *Non è un giro di pulizia a parte:
> era la riga 1.4 del piano, ed è stata tolta il 2026-09-20 proprio perché un
> passo che non finisce mai blocca quelli che finiscono.*

## Le tre colonne, e perché sono tre

| Colonna | Cosa ci va |
|---|---|
| **Cosa fa** | il comportamento **nelle parole di chi ne ha bisogno**, non del modulo che ce l'ha. *«pulsante ascolta + velocità» sette volte di fila si vede; «audio di Repeat Aloud» no.* |
| **Cosa gli passi → cosa torna** | la firma in chiaro |
| **Cosa dà per scontato** | *«vuole un contenitore già flex», «il testo lo risolve chi chiama», «scrive nel `localStorage` dell'episodio corrente», «va chiamato dopo che i dati sono arrivati»* |

**Il terzo campo esiste perché la gente non riscrive un pezzo perché non l'ha
trovato — riscrive perché l'ha trovato e non ha capito se le andava bene.** Una
firma non lo dice; i presupposti sì.

## La regola del passaggio

Quando un **secondo** file comincia a usare un pezzo, la riga si sposta qui **nello
stesso commit che lo deduplica**. Mai in due posti, mai «poi».
*`componenti-singoli.md` non è un cimitero, è una sala d'attesa.*

## Quanto manca — e si conta, non si stima

```
node tests/tools/censimento-pezzi.js
```

Per ogni funzione dichiarata in `app/*.js` e ogni classe introdotta in
`stile/*.css`, la riga deve comparire in **esattamente uno** dei due documenti.
Lo strumento dice quante mancano **e in quale file stanno**, così il lavoro si
prende un file per volta invece che «quando capita». Con `--elenco` le nomina.

⚠️ **Lo strumento sa dire SE un pezzo è catalogato, non se la riga dice il
vero:** i tre campi li scrive una persona leggendo la funzione. Conta le righe;
non le sa scrivere.

---

## `app/dati.js` — chi va a prendere i file

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `loadEpisodeData` | Il contenuto di un episodio, preso una volta e poi tenuto in memoria. È da qui che passa **ogni** modulo che mostra parole, frasi o battute. | `module` (il descrittore del passo, di cui usa `dataFile`) → `Promise` del JSON dell'episodio | Che il descrittore **abbia** un `dataFile`: Personalizza è l'unico modulo che non ce l'ha, e su di lui `fetch(undefined)` fallisce. Il rifiuto **arriva a chi chiama**, che deve mandarlo a `showLoadError` — qui non si assorbe niente. |
| `episodeGrade` | Le voci di un grado (`A` parole, `B` espressioni, `C` frasi, `D` battute) di un episodio già caricato. | `(data, grado)` → array di voci, **`[]` se il grado non c'è** | Che `data` sia già arrivato. Il `[]` è la trappola: un grado assente e un grado vuoto si leggono uguali — se il modulo non può lavorare senza, serve `episodeGradeRequired`. |
| `episodeGradeRequired` | Come sopra, ma **alza** invece di tornare vuoto: è la forma da usare quando un passo senza quel grado non ha senso. | `(data, grado, module)` → array non vuoto, oppure `throw` che nomina il passo e il grado | Che chi chiama lasci salire l'eccezione fino alla schermata d'errore. *Nasce da un guasto muto: un grado mancante produceva un modulo vuoto invece di un messaggio.* |
| `loadModuleInstructions` | I testi che spiegano **come si usa** un modulo (`howItWorks`, `helpReminder`), da `istruzioni-moduli.json`. Sette file la chiamano. | `()` → `Promise` dell'oggetto, una chiave per `kind` di modulo | Che il chiamante gestisca il rifiuto: per Help e Spiegazione **non è bloccante** e si usa la frase di ultima istanza (regola 35), per l'apertura di un modulo lo è. Il risultato è **in cache**: la seconda chiamata non tocca la rete. |
| `istruzioniInMemoria` | Gli stessi testi **solo se sono già arrivati**, senza chiedere niente alla rete. Serve a chi deve disegnare subito e non può aspettare. | `()` → l'oggetto, oppure `null` | Che chi la usa sappia **gestire il `null`**: è tutto il suo senso. Chiamarla e usare il risultato senza controllare produce una schermata con i testi vuoti — che si legge come rotta, non come «sta caricando». |
| `loadFeedbackMessages` | I testi che **rispondono a un esito** (fine modulo, tentativi), da `messaggi-feedback.json`. Distinti dai precedenti: lì *come si usa*, qui *com'è andata*. | `()` → `Promise` dell'oggetto | Stessa cache e stesso rifiuto di `loadModuleInstructions`. |
| `loadPersonalizationTables` | Le tabelle condivise di nomi, città e paesi dell'edizione. | `()` → `Promise` di `{ people, places }` | ⚠️ **Applica sopra il file gli override salvati dal Pannello Admin**: chi la sostituisse con un `fetch` nudo farebbe sparire le personalizzazioni **senza un errore e senza un rosso**. ⚠️ **LE FAMIGLIE SI LEGGONO DAL FILE DAL 2026-09-24 (passo 1.8-bis ③).** Qui c'erano `{ people, places }` scritti a mano **e un secondo elenco per gli override**: due liste della stessa cosa. *Il giorno in cui il magazzino ha preso `ages` — le età — questa riga l'ha **scartata in silenzio**: niente errore, niente rosso, e gli slot delle età sono usciti con **zero opzioni**.* **È la stessa forma dell'elenco di chiavi scritto a mano in `wipeEpisodeProgress`** (S.1/S.2 in `decisioni-stato.md`): *una lista che non cresce col mondo che descrive non dà un errore quando resta indietro — dà un risultato incompleto che somiglia a un risultato.* Le chiavi che cominciano con `_` restano fuori: sono note per chi legge, non tabelle. |
| `caricaStrutturaCorso` | La struttura del corso dell'edizione — gradi, nomi dei gradi, categorie, sequenze, elenco degli episodi, lingue del parlato — e la **applica** a `APP_CONFIG`. | `()` → `Promise` dei dati grezzi | Che sia chiamata **prima di disegnare qualunque cosa**: senza, non esiste nessuna mappa. Riapplica gli override del pannello **dopo** il file, altrimenti il `fetch` cancellerebbe in silenzio la sequenza appena riordinata a mano. |

## `app/ui-condivisa.js` — la personalizzazione

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `fillTemplate` | Sostituisce i `{{segnaposto}}` di un testo coi valori scelti dallo studente, nella lingua chiesta. **Cinque file lo usano** — i tre Dialogue, Why We Say It, Voice e la sessione. | `(testo, episode, valori, lang)` → il testo riempito | Che `episode.placeholderMap` sia già arrivato (viene dal **file dell'episodio**, attaccato da `applyEpisodeDialogue` dopo il fetch): chiamarlo prima lascia i segnaposto a schermo. ⚠️ **Un segnaposto sconosciuto NON rompe la riga**: resta com'è e finisce in `console.warn` — perché un `{{token}}` rimasto a schermo era l'unico segno che qualcosa mancava. Un segnaposto può chiedere la propria lingua con `{{chiave:en}}`: serve dove una spiegazione italiana cita la frase inglese. ⚠️ **E DAL 2026-09-24 IL SEGNAPOSTO CONOSCE IL PUNTO** (passo 1.8-bis ②): `{{chiave}}` · `{{chiave:lingua}}` · `{{chiave.campo}}` · `{{chiave.campo:lingua}}`. *Prima la regex era `\w+`, e `\w` non contiene il punto: `{{partenza.paese:en}}` non veniva nemmeno riconosciuto e **restava a schermo come testo**.* Serve perché una riga del magazzino porta più di un valore — una città di partenza porta anche il suo paese, e la battuta li vuole tutti e due. |

## `app/orchestrazione.js` — chi decide cosa si vede

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `showView` | Accende una vista e spegne le altre. **Ha un mestiere solo: cambiare la vista attiva.** | `nome` della vista (`'map'`, `'onboarding'`, …) → niente | ⚠️ **NON pulisce più niente, ed è una regola** (regola 21, riscritta il 2026-09-17): timer, registrazioni e sequenze in corso li azzera `stopAllModuleActivity`, che **chiama chi lascia un modulo**, non chi disegna. *Prima la pulizia viaggiava attaccata qui, e su due dei quattordici punti di chiamata era un no-op garantito: una cosa che risponde a due domande dà la risposta giusta a una e sbagliata all'altra.* |

## `app/magazzino.js` — dove si salva

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `magLeggiJson` | Rilegge un oggetto salvato. Se non c'è, se è illeggibile o se non supera il controllo, **torna il vuoto che gli dai tu** — non `null`, non un'eccezione. | `(chiave, vuoto, valida?)` → l'oggetto, oppure `vuoto()` | Che il `vuoto` sia una **funzione**, non un valore: due chiamate non devono condividere lo stesso oggetto. **Ingoia sempre**: in navigazione privata `localStorage` alza, e un errore lì fermerebbe il disegno di una schermata per una preferenza. |
| `magScriviJson` | Salva un oggetto. **Se non riesce, non lo dice.** | `(chiave, valore)` → niente | Che chi chiama **non abbia bisogno di sapere se ha funzionato**. Con i dati del sito bloccati questa non salva nulla e l'app continua: è voluto. Il giorno del server questa riga diventa asincrona e i chiamanti si toccano. |
| `magLeggiTesto` | Rilegge una stringa: le bandierine `'1'`/`'0'` e il nome dell'utente. | `(chiave, vuoto?)` → la stringa, oppure `''` (o il `vuoto` che passi) | Che il valore salvato **non** sia JSON. ⚠️ Il default è `''`, non `null`: chi deve distinguere «mai scritto» da «scritto vuoto» passa `null` esplicitamente — lo fa `isIntroDismissed`. |
| `magScriviTesto` | Salva una stringa. | `(chiave, valore)` → niente | Converte con `String()`: un booleano diventa `"true"`, non `'1'`. Chi vuole `'1'`/`'0'` lo scrive lui. |
| `magCancella` | Toglie una chiave. | `chiave` → niente | Che togliere una chiave che non c'è **non sia un errore**. |

## `app/identita.js` — chi è lo studente, e come vede l'app

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `icon` | Il markup SVG di un'icona, da inserire dentro un `innerHTML`. **Sei file lo usano.** | `(nome, classeExtra?)` → stringa HTML, **`''` se il nome non esiste** | Che il nome sia una chiave di `ICONS`. ⚠️ **Un nome sbagliato non alza: torna stringa vuota**, quindi il pulsante resta senza icona e nessuno se ne accorge. |
| `getUserName` | Il nome dello studente corrente. **È il lettore più usato dell'app: dodici file.** | `()` → la stringa, **`''` se non c'è** | Che `''` significhi «non si è ancora presentato» — è la condizione con cui `boot()` sceglie fra la schermata del nome e la casa. |

## `app/progressi.js` — quello che lo studente lascia dietro di sé

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `loadMastery` | I colori di ogni voce (parola, frase, battuta) di un episodio, per quell'utente. | `(episodeId, userName)` → `{ unitId: { level, streak } }`, `{}` se vuoto | Che una voce **assente** significhi «mai incontrata», non «rossa» (regola 39). Chi la scorre non deve inventarle un livello. |
| `loadModuleProgress` | Quali passi di un episodio sono completati. **È da qui che la mappa decide i lucchetti.** | `(episodeId, userName)` → `{ completed: [...] }` | Che l'elenco contenga **id di PASSO**, non di modulo: la seconda apparizione di Flash Card è `flashcardAEngIta-2`. Confonderli sblocca il passo sbagliato. |
| `markModuleCompleted` | Segna un passo come fatto. **Solo su gesto esplicito** (regola 7). | `(episode, userName, moduleId)` → niente | Che chi chiama sia il pulsante «Ho finito», non la fine di un'animazione. Scrive subito: non c'è una coda da svuotare dopo. |
| `loadModuleOutcomes` | Il colore del passo in mappa — verde/giallo/rosso — quando quel modulo ne produce uno. | `(episodeId, userName)` → `{ moduleId: { level, ... } }` | Che **non tutti i moduli ne producano**: i tre Dialogue ne hanno uno, i moduli di sola lettura no. Un passo senza esito non è un passo incompleto. |
| `saveModuleOutcome` | Scrive quel colore. | `(episode, userName, moduleId, outcome)` → niente | Che il livello arrivi già calcolato da `moduleRulesLevel`, **mai ricalcolato qui**: la matematica verde/giallo/rosso vive in un posto solo. |
| `loadCustomValues` | Le scelte di personalizzazione di quell'episodio (nomi, città), **già tradotte** se un id è stato rinominato. | `(episode, userName, migrazioni)` → `{ chiave: valore }` | Che una scelta salvata possa **non esistere più** nel magazzino. ⚠️ **`migrazioni` è un parametro e non un valore condiviso, di proposito:** la mappa arriva da un fetch e questa funzione è sincrona — passandola, la dipendenza si legge dalla firma e chi non ce l'ha non può fingere di averla. *Completata il 2026-09-24 (passo 1.8-bis ④): qui c'era scritto «c'è solo a metà», ed era vero.* |
| `idMigrato` | Traduce un id salvato nel suo id di oggi, se qualcuno l'ha rinominato. | `(migrazioni, chiaveSlot, idSalvato)` → l'id di oggi, o quello di partenza | Che un id **sconosciuto alla mappa sia probabilmente valido**: esce com'è entrato. Non tocca a lui decidere che un id sia morto — chi non trova la riga è `resolveSlotValue`, e da lì si cade sul predefinito. *Chiavizzata per slot e non per tabella: lo slot conserva il nome anche quando la tabella sotto cambia.* |
| `loadPersonalizationMigrations` | La mappa da id salvato a id di oggi, dell'edizione. | `()` → Promise di `{ chiaveSlot: { vecchio: nuovo } }` | Che un file mancante **debba fermare tutto**, come per le tabelle: una mappa vuota direbbe «nessun id è mai cambiato», cioè riporterebbe le personalizzazioni al predefinito **in silenzio** — il guasto di partenza travestito da normalità. |
| `isCustomizeSeen` | Se lo studente ha già visto la schermata Personalizza di quell'episodio. | `(episodeId, userName)` → booleano | Che il valore salvato sia la **stringa** `'1'`, non un booleano: passa da `magLeggiTesto` e non da `magLeggiJson`. Cambiare formato romperebbe i profili esistenti. |
| `isIntroDismissed` | Se lo studente ha spuntato «non mostrare più» sull'intro di un tipo di modulo. **Dieci file la chiamano.** | `(kind, userName)` → booleano | ⚠️ Che esista un **secondo nome storico** per Repeat Aloud (`repeatAloudIntroDismissed`), letto se il primo manca: chi lo togliesse rifarebbe comparire l'intro a chi l'aveva già chiusa. |
| `setIntroDismissed` | Scrive quella spunta. **Dieci file la chiamano.** | `(kind, userName, dismissed)` → niente | Scrive `'1'`/`'0'` come stringa, non il booleano. La coppia con `isIntroDismissed` va tenuta: sono lo stesso formato da due lati. |
| `saveHelpRequest` | Accoda una richiesta di aiuto scritta dallo studente. | `(userName, entry)` → niente | Che la lista cresca e **non venga mai svuotata dall'app**: è un registro, non una coda. Nessuna schermata la mostra ancora. |
| `prefissoMagazzino()` | costruisce la prima parte di ogni chiave del magazzino che riguarda il percorso di uno studente: `baseinglese:{lingua}-{studente}:` | *niente* → stringa | che `CONFIG.edizione` sia gia' in memoria — lo e', `app/config.js` e' il primo tag. ⚠️ **Lo legge A OGNI CHIAMATA**, non lo copia in una costante: il Pannello Admin puo' cambiare l'edizione, e una copia che si puo' disallineare si disallinea. ⚠️ **Due chiavi NON lo usano, di proposito** — `introDismissedKey` e `legacyRaIntroDismissedKey`: dicono «ho gia' visto come funziona questo modulo», e sapere come si usa Flash Card non e' una cosa del corso d'inglese |

## `app/catalogo.js` — l'ordine delle cose

*Scritta col passo 1.13 (2026-09-22), che ha letto questa parte del file riga
per riga (regola 46). Il resto di `catalogo.js` non e' ancora catalogato: si
cataloga quando un passo lo legge, non prima.*

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `resolveModuleOrder(episodeId)` | risolve l'ordine dei **moduli di un episodio**: la sequenza che l'episodio dichiara, oppure il suo `moduleOrder` scritto per intero | `episodeId` → `{ order, errore }` | che `CONFIG.episodes` e `CONFIG.sequences` siano gia' arrivati dal file di struttura. **L'errore non e' un'eccezione: viaggia con l'episodio** e diventa la schermata d'errore quando si apre la mappa |
| `resolveEpisodeOrder()` | il gemello un livello sopra: risolve l'ordine degli **episodi del corso**, da `episodeSequence` + `episodeSequences` | *niente* → `{ order, errore }` | che `EPISODES` sia gia' costruito. ⚠️ **Non alza mai e non lascia mai a mani vuote:** un id elencato che non esiste lo toglie, un episodio che esiste e non e' elencato lo mette **in coda**, e senza sequenza ripiega su `Object.keys(EPISODES)` — perche' l'ordine serve PRIMA di qualunque schermata, e fermarsi lascerebbe una pagina bianca. **Chi chiama deve stampare `errore`**: la funzione non lo fa da sé |
| `episodiInOrdine()` | la sola lista, per chi deve solo elencarli | *niente* → array di id | che a `errore` pensi qualcun altro. **Da' per scontato di essere chiamato da un punto che NON e' l'avvio** — all'avvio si usa `resolveEpisodeOrder()` e si stampa l'errore una volta sola, invece di ripeterlo a ogni apertura del pannello |

## `app/mappa.js` — le due liste

*Scritta col passo 1.13-bis (2026-09-22). Il resto di `mappa.js` non è ancora
catalogato: si cataloga quando un passo lo legge (regola 46).*

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `moduleStatus(episode, progress, moduleId)` | lo stato di un passo dentro un episodio | → `'completed'` \| `'current'` \| `'locked'` | che `progress.completed` ci sia. **Lo stato è DERIVATO**, non salvato: «l'attuale è il primo non completato» — quindi un passo che non si chiude mai blocca tutti quelli dopo, e non lo dice nessuno |
| `episodeStatus(episodeId, primoIncompleto)` | il gemello un livello sopra: lo stato di un EPISODIO dentro il corso | `id` + l'id del primo incompleto → stessi tre valori | ⚠️ **che `calcolaStatoEpisodi()` sia già girato**: legge `episodiCompletati`, che quella riempie. Chiamarlo da solo risponde su dati vecchi. ⚠️ **E un episodio SENZA PASSI non è «finito», è rotto** (`orderError`): resta `locked` o `current`, mai `completed` |
| `calcolaStatoEpisodi()` | legge il progresso di **ogni** episodio una volta sola e dice qual è il primo incompleto | *niente* → `{ ordine, primoIncompleto }` | che `EPISODES` sia costruito e l'utente sia noto. **Il conto si fa una volta per disegno, non una per riga:** dentro `episodeStatus` significherebbe rileggere il magazzino tante volte quante sono le righe. `primoIncompleto` è `null` a corso finito |
| `openEpisodes()` | apre la lista degli episodi | *niente* → *niente* | ⚠️ **che i testi possano non esserci**: è la **prima** schermata dopo casa, quindi ci si arriva a cache fredda — chiede `loadModuleInstructions()` e ripassa da sé, o va alla schermata d'errore (regola 35). *La mappa ha la stessa guardia e lì costa solo su un punto su dieci; qui su tutti.* |


## `tests/mock-browser.js` — il finto del browser, dal lato dei test

*Sta fra i condivisi dal 2026-09-24 (passo F.4): **ventuno file di test** lo
usano. Non è codice dell'app, ma è codice che decide cosa i test vedono — e
una copia sbagliata qui produce un verde che non prova niente (regola 37).*

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `mockBrowser(opzioni)` | Costruisce il finto `speechSynthesis` (+ `SpeechSynthesisUtterance`) e, se richiesto, il finto `SpeechRecognition`, da dare a `page.addInitScript`. | `{ fineVoceMs, nomeVoce, riconoscimento, ritardoRiconoscimentoMs, ritardoFineRiconoscimentoMs }` → **`{ content: '<testo>' }`**, non una funzione | ⚠️ **Che chi lo usa NON si aspetti una funzione.** `addInitScript` **serializza** la funzione che riceve: una che chiudesse su `opzioni` arriverebbe nel browser **senza** quelle opzioni, e nessuno lo direbbe. Componendo il testo qui, i valori ci sono per davvero. ⚠️ **IL NUCLEO DICHIARA `speaking` DAL 2026-09-24 (passo F.2a), e `speaking` gate QUATTRO cose, non una:** il **Blocco Ascolto** (`app/audio.js:253`, regola 16), `fermaLaVoce()` → `synth.cancel()` (`app/audio.js:144` — *cioè «ritoccare il pulsante che sta parlando lo ferma» non veniva mai provato*), `pausaLaVoce()` (`:148`) e il ramo di `fcFlip` in `app/flashcard.js:228`. ⚠️ **E `cancel()` MANDA `onend`, IN MODO ASINCRONO, dal passo F.2b (2026-09-24):** è il fatto su cui `app/audio.js` ha costruito l'**epoca**, che esiste solo per sopravvivere a un `onend` che arriva dopo che lo studente ha lasciato il modulo — *prima quella protezione non la esercitava nessuno.* La guardia su `_corrente` dentro `_finisci` è la parte che conta: una chiusura in ritardo non deve spegnere l'audio partito dopo di lei. **`paused` resta finto: è F.2c, e va da solo.** |
| `mockInit` | Il nucleo com'è nel gruppo più numeroso: 20 ms, `'Fake Male Voice'`, nessun riconoscimento. | *niente* — è già `{ content }` | Che il file non avesse parametri suoi. Chi ne aveva chiama `mockBrowser(...)` coi valori che aveva **prima**: questo passo non cambia il comportamento di nessun file. |
| `FORME` | I quattro comportamenti del riconoscimento, per nome. | → `['auto', 'suStop', 'manuale', 'muto']` | ⚠️ **Che la differenza fra le quattro sia QUANDO arriva `onend`**, non un dettaglio di forma: `auto` lo manda insieme al risultato, `suStop` solo dopo `stop()`, `manuale` manda `onstart` e non produce mai risultati, `muto` non fa niente su `start()` (premi e non parli). *È esattamente l'ordine degli eventi asincroni che la regola 19 dice di non semplificare — un nome sbagliato qui non dà un errore, dà un verde.* Un nome fuori elenco **alza**, non ripiega. |
