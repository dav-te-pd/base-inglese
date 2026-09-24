# Componenti singoli

**La sala d'attesa, non il cimitero.** Un pezzo sta qui quando **oggi lo usa un
file solo**. Non vuol dire che non sia un componente: vuol dire che non lo è
*ancora*, e dice cosa può diventare.

> **Si legge questo elenco PRIMA di scrivere un pezzo nuovo**, subito dopo
> [`componenti-condivisi.md`](componenti-condivisi.md). Se qui c'è qualcosa che
> fa quello che serve, **lo si promuove** — la riga si sposta nell'altro file
> **nello stesso commit che deduplica**.

> **Quando si SCRIVE una riga qui dentro lo dice la regola 46 «CHI TOCCA,
> CATALOGA»**: un passo di codice non è finito finché i file che ha toccato non
> sono catalogati, **nello stesso commit**. *Non è un giro di pulizia a parte:
> era la riga 1.4 del piano, ed è stata tolta il 2026-09-20 proprio perché un
> passo che non finisce mai blocca quelli che finiscono.*

## Perché due file e non uno

Il criterio «un pezzo ci sta se e solo se è usato da più di un modulo» è
verificabile, ma **sette copie identiche non sono "usate da più di un modulo":
ognuna è usata da uno.** Con un file solo, il catalogo sarebbe nato dicendo «il
Blocco Ascolto non è un componente condiviso» — vero secondo il criterio, falso
secondo la realtà. Con due file, alla fine si **legge** questa lista: sette voci
con lo stesso nome saltano all'occhio. **Il controllo diventa leggere, non
cercare.**

## Le tre colonne

Le stesse dell'altro file, e per le stesse ragioni: **cosa fa** (nelle parole di
chi ne ha bisogno), **cosa gli passi → cosa torna**, **cosa dà per scontato**.

## La grep chiusa

Prima di scrivere la riga di un pezzo si prende **una stringa distintiva da
dentro quel pezzo** — una classe CSS, un `aria-label`, un attributo `data-` — e
la si cerca nel repository.

*È la differenza che conta: un censimento è una ricerca **aperta**, e fallisce in
silenzio perché «non ho trovato altro» è indistinguibile da «non ho cercato
bene». Questa è **chiusa**: una stringa che hai davanti, un comando, un numero.
**O il numero è 1, o non lo è.** È esattamente così che sono state trovate le
sette copie del Blocco Ascolto.*

## Quanto manca

`node tests/tools/censimento-pezzi.js` — vedi
[`componenti-condivisi.md`](componenti-condivisi.md).

---

## `app/dati.js`

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `percorsoEdizione` | Il percorso di un file dell'edizione viva, ricavato da `CONFIG.edizione` invece che scritto a mano. **L'unico punto che sa dove stanno i dati.** | `nomeFile` → `data/{lingua}/{studente}/{nomeFile}?v=…` | Che `CONFIG.edizione` esista già (viene da `app/config.js`, tag bloccante). ⚠️ **È il pezzo che si sposterà in `app/fonte.js`** al passo 1.7: quando i dati verranno dal server, cambierà solo lui. |
| `conVersione` | Attacca a un percorso la stessa `?v=` con cui il browser ha chiesto `app/dati.js`. | `percorso` → percorso con `?v=`, o **nudo** se il tag non porta versione | Che il file sia caricato da un `<script src>` con la sua versione. Si degrada invece di rompersi: senza versione i percorsi restano quelli di ieri. |
| `episodeDataFile` | Il percorso del file di un episodio, ricavato dall'id. | `episodeId` → percorso completo | Che l'id sia quello congelato (`gate`, `aircraft-door`) e non un numero di posizione. Compone il **prefisso** unendo le due metà della coppia con un trattino: è l'unico dei percorsi che le usa due volte e in due forme. |
| `applicaStruttura` | Travasa su `APP_CONFIG` le sei chiavi del file di struttura, poi **riapplica gli override** del Pannello Admin. | `dati` (il JSON) → niente | Che giri **prima** di `costruisciPassi()`. L'ordine dei due passaggi non è scambiabile: gli override stanno sopra il file, mai sotto. |

## `app/avvio.js`

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `applyConfigOverrides` | Applica sopra `APP_CONFIG` gli override salvati dal Pannello Admin, **una sezione di primo livello per volta**. | `()` → niente | Che `window.APP_CONFIG` esista. ⚠️ **Va chiamata di nuovo ogni volta che qualcosa riscrive quelle chiavi** — oggi lo fa `applicaStruttura` — altrimenti un file in arrivo cancella in silenzio quello che una persona ha appena salvato. |

## `app/identita.js`

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `hydrateIcons` | Riempie col suo SVG ogni elemento che porta `data-icon` dentro una radice. **È il ponte fra il markup e `ICONS`**: chi scrive markup non chiama `icon`, scrive un attributo. | `(radice?)` → niente. Senza radice lavora su tutto il `document` | Che il nome nell'attributo esista. ⚠️ **Un nome sbagliato non alza**: `icon` torna `''` e l'elemento resta vuoto — un pulsante senza icona, non un errore. Va richiamata su **ogni pezzo di markup creato dopo l'avvio**, altrimenti le icone nuove restano vuote. |
| `renderThemePicker` | Disegna i pulsanti dei temi leggendoli da `CONFIG.themes.options`. | `()` → niente | Che `#theme-picker` esista: lo cerca senza guardia e senza di lui alza. ⚠️ **È l'unico punto dell'app che scrive un colore dentro il markup** (`style="background:…"`), e non viola la regola 2 perché il valore **viene dalla configurazione**, non dal codice: il pallino deve mostrare un tema che in quel momento non è attivo, quindi una variabile CSS non può dirlo. |
| `getTheme` | Quale tema è attivo **adesso**, letto dal DOM. | `()` → il nome, o quello di partenza | Che l'**assenza** dell'attributo `data-theme` significhi «tema di partenza» — che è vero solo perché `setTheme` lo *toglie* invece di scriverlo. Le due funzioni vanno lette insieme o nessuna delle due si capisce. |
| `setTheme` | Applica un tema, lo salva, e riallinea i pulsanti. | `nome` → niente | Che un nome sconosciuto **non** sia un errore: ricade sul tema di partenza invece di alzare. Chiama `syncThemePicker` da sé: chi la usa non deve ricordarsene. |
| `syncThemePicker` | Mette `aria-pressed` sul pulsante del tema attivo e lo toglie agli altri. | `()` → niente | Che i pulsanti **ci siano già**. Se il picker non è stato disegnato è un no-op silenzioso — non un guasto, ma nemmeno un avviso. |
| `setUserName` | Scrive il nome dello studente corrente. | `nome` → niente | ⚠️ Che **non tocchi nessun progresso**: le chiavi di progresso portano il nome dentro, quindi cambiare nome fa vedere **un altro profilo**, non cancellarne uno. |
| `clearUserName` | Toglie il nome, riportando l'app alla schermata di presentazione. | `()` → niente | Stessa cosa al rovescio: **i progressi restano**, indicizzati sul nome vecchio. Rientrare con lo stesso nome li ritrova tutti. *È voluto, ed è il motivo per cui «cambia utente» non è distruttivo.* |

## `app/progressi.js`

**I dodici costruttori di chiave stanno qui per una ragione che non è la
simmetria:** erano irraggiungibili da un `page.evaluate`, e per questo 197 punti
sotto `tests/` scrivevano la forma della chiave a mano. Adesso si raggiungono da
`BI`, e una chiave che cambia forma rompe **un** punto invece di duecento.

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `helpRequestsKey` | La chiave delle richieste di aiuto. | `utente` → `baseinglese:helpRequests:{utente}` | ⚠️ **È l'unica chiave di questo file che NON porta l'episodio**: una richiesta di aiuto è della persona, non della lezione. |
| `loadHelpRequests` | Rilegge quelle richieste. | `utente` → array, `[]` se non c'è | Che il salvato sia un **array**: lo verifica, e quello che non lo è lo butta invece di restituirlo. |
| `masteryStorageKey` | La chiave dei colori di un episodio. | `(episodeId, utente)` → la chiave | Che l'id sia quello **congelato** (`gate`), non una posizione. Un id che cambia non migra: perde. |
| `saveMastery` | Scrive **tutta** la mastery dell'episodio in un colpo. | `(episodeId, utente, mastery)` → niente | ⚠️ **Non fonde, sovrascrive.** Chi chiama deve aver letto con `loadMastery` e modificato quell'oggetto: scrivere un oggetto costruito da zero cancella tutte le voci che non contiene. |
| `moduleProgressKey` | La chiave dei passi completati. | `(episodeId, utente)` → la chiave | — |
| `moduleOutcomeKey` | La chiave dei colori dei passi in mappa. | `(episodeId, utente)` → la chiave | Che sia **diversa** da quella dei passi completati: un passo può essere completato e rosso. Unirle direbbe che finire e riuscire sono la stessa cosa. |
| `audioUsageKey` | La chiave dei secondi di audio spediti. | `(episodeId, utente)` → la chiave | — |
| `loadAudioUsage` | Quanti secondi di sintesi sono stati consumati, per modulo. | `(episodeId, utente)` → `{ byModule: {} }` | Che sia **un conto, non un progresso**: serve a sapere quanto costerà il giorno che l'audio si paga. Nessuna schermata lo mostra. |
| `addAudioSecondsSent` | Aggiunge secondi al conto di un modulo. | `(episodeId, utente, moduleId, secondi)` → **l'oggetto aggiornato** | Torna il totale apposta, così chi chiama non rilegge. Non ha un tetto: **misura, non limita**. |
| `nextLineSkipsKey` | La chiave dei «Prossima frase». | `(episodeId, utente)` → la chiave | — |
| `loadNextLineSkips` | Quante volte lo studente ha saltato l'attesa, per modulo. | `(episodeId, utente)` → `{ byModule: {} }` | ⚠️ **Stessa forma di `loadAudioUsage` di proposito** (regola 13): sono due conti, non due esiti. Un numero alto **non** è un errore dello studente: dice che `dialogo.pausaBase`/`pausaPerParola` sono tarate lunghe. |
| `addNextLineSkip` | Aggiunge uno a quel conto. | `(episodeId, utente, moduleId)` → l'oggetto aggiornato | Gemella di `addAudioSecondsSent`, e va tenuta tale: chi cambia una cambia l'altra. |
| `storyCardsExplanationStatsKey` | La chiave delle risposte di Why We Say It. | `(episodeId, utente)` → la chiave | — |
| `vuotoStoryCardsExplanationStats` | Il vuoto di quelle statistiche, **col numero di versione dentro**. | `()` → `{ versione, byLine: {} }` | Che sia una **funzione** e non un valore: due chiamate non devono condividere lo stesso oggetto. |
| `loadStoryCardsExplanationStats` | Rilegge quelle statistiche. | `(episodeId, utente)` → l'oggetto, o il vuoto | ⚠️ **Il controllo include la versione**: dati scritti con la forma vecchia si **buttano**, non si migrano. Migrarli vorrebbe dire indovinare la risposta corrente guardando quale contatore è più alto — falso appena qualcuno ha cambiato idea due volte, cioè proprio nei casi che interessano. |
| `storyCardsRecordExplanationAnswer` | Registra la risposta **corrente** di una battuta: toglie quella di prima, mette la nuova, e alza `cambi` solo se è davvero diversa. | `(episodeId, utente, lineId, risposta)` → le statistiche aggiornate | Che rispondere due volte la stessa cosa **non muova niente**. *Prima era vero per caso — il pulsante già scelto non produceva un secondo evento — adesso è una regola scritta, che è la differenza fra un comportamento e una fortuna.* |
| `customValuesKey` | La chiave della personalizzazione. | `(episodeId, utente)` → `baseinglese:{episodio}:custom:{utente}` | ⚠️ **Ha una forma diversa da tutte le altre** — l'episodio sta prima e non dopo il prefisso. È storia, non disegno: chi cerca le chiavi per prefisso non la trova. |
| `saveCustomValues` | Scrive le scelte di personalizzazione. | `(episode, utente, valori)` → niente | Che scriva **quello che gli dai, senza filtrare**: il filtro sta dalla parte della lettura, in `loadCustomValues`. Le due non sono simmetriche, ed è voluto — un valore sparito dalle tabelle deve poter restare scritto senza rompere la rilettura. |
| `customizeSeenKey` | La chiave della vecchia bandierina «Personalizza già vista». | `(episodeId, utente)` → la chiave | ⚠️ **Nessuno ci scrive più.** Esiste solo perché chi aveva personalizzato col flusso vecchio non si ritrovi tutto ri-bloccato davanti a progressi già fatti. È **sola lettura**, e toglierla è una decisione, non una pulizia. |
| `CHIAVI_EPISODIO` | Le nove chiavi che il magazzino tiene **per episodio**, ognuna con scritto **se la ripersonalizzazione la cancella e perché**. | una costante: `[{ nome, chiave, azzera, perche }]` | Che l'elenco **non si scriva a mano**: `test_progressi_estratto` `[D]` legge `app/progressi.js`, trova ogni `function xxxKey(episodeId, userName)` e pretende che sia qui. ⚠️ **Non dice se il wipe DEBBA cancellarla — quello è una decisione — dice che qualcuno ha dovuto sceglierlo, invece di non essersene accorto.** ⚠️ **Due righe portano una domanda aperta, non una scelta:** `storyCardsDeclarations` regge lo Sblocco Sequenziale di Why We Say It, quindi dopo un wipe il modulo si ri-blocca in mappa **ma riapre le card già dichiarate**; `storyCardsExplanationStats` sono risposte dello studente e somigliano a progresso (vedi `1.16`). |
| `wipeEpisodeProgress` | La conseguenza del «sì» all'avviso di metà episodio: azzera il progresso che dipende dalla personalizzazione che sta per cambiare. | `(episode, utente)` → niente | Cancella **tre** chiavi: passi completati, esiti, mastery. La personalizzazione **no** — è quella che si sta per modificare. ⚠️ **E l'elenco delle tre è scritto a mano**: le altre quattro chiavi per episodio sopravvivono, e una chiave nuova aggiunta domani non entrerebbe qui da sola. *Registrato in `docs/decisioni-stato.md`.* ⚠️ **DAL 2026-09-24 (passo 1.16) NON ELENCA PIÙ NIENTE: passa da `CHIAVI_EPISODIO`.** *L'elenco era scritto a mano ed era passato da «tre su sette» a «tre su nove» senza che nessuno se ne accorgesse — le due chiavi nate dopo non ci sono mai entrate.* **Il comportamento non è cambiato di una virgola**: si azzerano le stesse tre. Quello che è cambiato è che **le altre sei portano scritto perché sopravvivono**, invece di sopravvivere per assenza — e che una chiave nuova non dichiarata **fa diventare rossa la suite** (`test_progressi_estratto` `[D]`). |
| `introDismissedKey` | La chiave di «non mostrare più» di un tipo di modulo. | `(kind, utente)` → la chiave | Che sia **per tipo di modulo e non per episodio**: chi ha capito come funziona Flash Card l'ha capito per sempre, non per quell'episodio. |
| `legacyRaIntroDismissedKey` | Il nome storico della stessa bandierina, quando era solo di Repeat Aloud. | `utente` → la chiave | ⚠️ **Nessuno ci scrive più, e si legge una volta sola** (dentro `isIntroDismissed`, e solo per `repeatAloud`). Toglierla rifarebbe comparire l'intro a chi l'aveva già chiusa: è una migrazione senza data di scadenza, non un residuo. |
| `storyCardsDeclarationsKey` | La chiave delle dichiarazioni «chiara / non ancora / non chiara». | `(episodeId, utente)` → la chiave | Che sia **diversa** dalle statistiche qui sopra: là si contano i cambi di idea, qui si tiene la risposta con cui riaprire il modulo. |
| `loadStoryCardsDeclarations` | Le dichiarazioni con cui Why We Say It si riapre dove lo si era lasciato. | `(episodeId, utente)` → `{ lineId: risposta }` | Che il modulo le usi per lo **Sblocco Sequenziale** (regola 30): riaprendo, le card già dichiarate restano aperte. |
| `saveStoryCardsDeclarations` | Scrive quelle dichiarazioni. | `(episodeId, utente, risposte)` → niente | Sovrascrive l'oggetto intero, come `saveMastery`: chi chiama tiene la mappa completa in memoria per tutta la sessione del modulo. |

## `app/apertura.js` — da dove arrivano gli slot

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `resolveSlotTable` | Trasforma il nome di una tabella scritto da un episodio (`"people.papa"`) nella lista vera delle opzioni. | `(nome, datiEpisodio, magazzino)` → la lista, **`[]` se non la trova** | Che il prefisso `episode.` voglia dire «cercala **dentro** il file di questo episodio» e tutto il resto «cercala nel magazzino condiviso». ⚠️ **Un nome sbagliato non alza: torna una lista vuota**, e lo slot compare senza opzioni — un guasto che si vede a schermo e non nei log. Chi la chiama deve avere **già aspettato** il magazzino. ⚠️ **E DAL 2026-09-24 PRENDE UN QUARTO ARGOMENTO, `righe` (passo 1.8-bis ③): un PEZZO della tabella invece della tabella intera.** Serve perché le età sono uscite dal file dell'episodio ed entrate nel magazzino — `ages.anni` ha quattordici righe, la figlia ne vede sei e il figlio otto. ⚠️ **Assente vuol dire «tutta la tabella», e lo dice l'assenza:** sette slot su otto non dichiarano niente, e dare loro una lista vuota obbligherebbe la funzione a distinguere «vuota perché le voglio tutte» da «vuota perché non ne voglio nessuna». ⚠️ **L'ordine è quello dell'ELENCO, non quello della tabella** — oggi i due coincidono, ed è per questo che va scritto invece che dedotto. |
| `buildSlotFields` | Costruisce gli slot di personalizzazione che l'episodio dichiara in `personalizationTablesUsed`. | `(datiEpisodio, magazzino)` → la lista degli slot | Che tutto ciò che sta a valle (la griglia di Personalizza, il Riquadro Richieste, i segnaposto) legga **questa** forma. ⚠️ **Non decide più se un valore si traduce** — dal 2026-09-20 lo dichiara la riga del magazzino, e questa funzione non lo sa nemmeno. |
| `ensureEpisodeSlotFields` | Garantisce che `episode.slotFields` esista, aspettando il file dell'episodio e il magazzino **una volta sola**. | `episode` → `Promise` | Che **ogni** punto che tocca `slotFields` passi prima di qui. ⚠️ **Senza, `episode.slotFields` è `undefined`**, non una lista vuota: chi ci scorre sopra cade invece di trovare zero slot. |

## `app/ui-condivisa.js` — gli slot, letti

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `slotOptions` | Porta ogni opzione alla stessa forma `{ value, it, en }`. Una riga del magazzino ce l'ha già; un valore nudo — un'età — diventa tutte le colonne uguali. | `campo` → lista normalizzata | ⚠️ **Non aggiunge `traducibile`**, e non è una dimenticanza: un valore nudo che non lo dichiara vale «si traduce», e dargli un valore d'ufficio farebbe sembrare una decisione quella che è un'assenza. *`fr`/`es`/`de` sono uscite il 2026-09-20: un'altra edizione non aggiunge una colonna qui, ha il suo file.* |
| `slotField` | Lo slot di un episodio, cercato per chiave. | `(episode, chiave)` → lo slot, o `undefined` | Che `episode.slotFields` ci sia già (vedi `ensureEpisodeSlotFields`). |
| `slotDefault` | Il valore di partenza di uno slot. | `(episode, chiave)` → la stringa, `''` se lo slot non c'è | Che `''` sia una risposta accettabile: è quello che `fillTemplate` usa quando lo studente non ha scelto niente. |
| `resolveSlotValue` | Cosa si legge a schermo per un valore scelto, nella lingua chiesta: **è il punto che decide se una parola si traduce.** | `(episode, chiave, valoreSalvato, lang, campo)` → la stringa da mostrare | ⚠️ **Lo decide la RIGA del magazzino** (`traducibile`), non il nome della tabella — cambiato il 2026-09-20 (passo 1.8), comportamento identico. **Chi manca vale «si traduce».** ⚠️ **IL RIPIEGO È CAMBIATO IL 2026-09-24 (passo 1.8-bis ④), e qui c'era scritto il vecchio:** un valore salvato che non esiste più fra le opzioni **ricadeva in silenzio sulla PRIMA**. Adesso ricade sul **predefinito dello slot** (`field.def`), e `opts[0]` resta solo se nemmeno il predefinito esiste fra le opzioni. *Misurato: sui nove slot il predefinito coincide con la prima riga su sette — divergono solo le due età, `16` contro `12` e `8` contro `4`. Lì la differenza era un numero che nessuno aveva scelto.* ⚠️ **E `campo` È ENTRATO IL 2026-09-24 (passo 1.8-bis ②):** quale PEZZO della riga si vuole — senza, la riga (la città); con `'paese'`, il suo sotto-campo, che ha la **stessa forma** (`it`/`en`), così la funzione non impara niente di nuovo. ⚠️ **Un campo che la riga non ha NON dà `undefined` a schermo: si torna alla riga.** Le tabelle non sono tutte uguali — `places.departures` porta il paese, `people.papa` no, `places.destinations` non lo prenderà mai — e *un buco a schermo non si vede nei test e si vede allo studente*. |

## `app/ui-condivisa.js` — il ponte fra markup e testi

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `hydrateTesti` | Riempie col suo testo ogni elemento che porta `data-testo="percorso"`. **È il gemello esatto di `hydrateIcons`**: là un attributo dice quale icona, qui quale testo. | `(radice?)` → niente | Che i testi siano **già arrivati**: gira dentro il `.then` di `loadModuleInstructions`, cioè appena il file c'è, una volta sola, su tutto il documento. ⚠️ **Chiamarla al boot la riempirebbe di stringhe vuote e nessuno le rimetterebbe più.** Un percorso che non esiste **lascia il testo com'era** invece di svuotarlo: una chiave sbagliata si vede come «non è cambiato niente», non come un pulsante senza scritta. ⚠️ **E non copre la MAPPA**, che non aspetta i testi — limite dichiarato, è il passo 1.3b. |

## `app/mappa.js` — il Pannello Admin, parte sequenze

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `sequenzaDellEpisodio` | Il **nome** della sequenza che usa l'episodio aperto. | `()` → la stringa, **`null`** se l'episodio ha un `moduleOrder` proprio | Che `null` voglia dire «non c'è niente da riordinare qui», non «errore». |
| `sequenzaInModifica` | Il nome della sequenza che **il pannello sta guardando**: quella scelta col menu, o quella dell'episodio finché nessuno ha scelto. | `()` → la stringa, o `null` | ⚠️ **Sono due funzioni e non una da quando la scelta esiste**: «quale usa l'episodio» e «quale sto guardando» divergono appena tocchi il menu, e una cosa che risponde a due domande mostrerebbe le righe di una salvandole sull'altra. **Scarta una scelta che non esiste più**: il ripristino può portarsi via una sequenza mentre il menu la indica. |
| `nomiDelleSequenze` | I nomi che esistono adesso. | `()` → array, `[]` se non c'è niente | Legge `APP_CONFIG`, cioè **dopo** gli override: una sequenza tolta dal pannello non compare. |
| `renderSequencePickerHtml` | Il menu «quale sequenza sto modificando». | `()` → HTML, **`''` se le sequenze sono meno di due** | Che con una sequenza sola un menu di un elemento sia rumore. **Non ricarica la pagina**, al contrario del menu dell'episodio: cambia cosa il pannello guarda, non cosa l'app ha costruito all'avvio. |
| `avvisoSequenzaAltrui` | La riga che dice «stai modificando una sequenza che questo episodio non usa». | `()` → HTML, `''` quando coincidono | ⚠️ **Senza, modificare la sequenza di un altro episodio sembra non aver funzionato**: si salva, e in mappa non si vede niente. |
| `ridisegnaGruppoSequenze` | Ridisegna il gruppo `sequences` per intero quando cambia la scelta. | `dentro` (un nodo del gruppo) → niente | Che ridisegnare **solo le righe** non basti: cambiano anche il menu selezionato e l'avviso. |
| `renderSequenceChoiceField` | Il menu della sequenza **di un episodio**, al posto della casella di testo. | `(percorso, valore)` → il nodo del campo | ⚠️ **Porta `data-config-reload`**: i passi si costruiscono all'avvio, e senza ricaricamento è una manopola muta. ⚠️ **E un nome che non esiste resta nell'elenco** invece di sparire: un `<select>` il cui valore non è fra le opzioni mostra la prima, e al primo salvataggio cambierebbe in silenzio la sequenza dell'episodio. |

## `app/avvio.js` — la fusione

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `eOggettoSemplice` | Dice se un valore è un oggetto su cui una fusione vuol dire qualcosa. | `valore` → booleano | Che **array e valori singoli non si fondano**: su un array non esiste una fusione che voglia dire qualcosa, e si sostituiscono come prima. |

## `app/repeataloud.js`

*(da catalogare — `node tests/tools/censimento-pezzi.js` dice quanti)*

## `app/voice.js` — la regione del microfono

*Catalogata il 2026-09-21 collegando `speechstart` (regola 46: si catalogano i
pezzi dei file che il passo ha dovuto **capire**, e questa regione è stata letta
riga per riga — il resto di `app/voice.js` no, e infatti non è qui).*

⚠️ **La terza colonna è quella che ha trovato qualcosa**, e non è un modo di
dire: scrivere *«cosa dà per scontato»* su `vcSilenceTimeoutId` è il momento in
cui si è visto che dà per scontata **una cosa falsa** — che «aver sentito» e
«aver trascritto» siano lo stesso istante.

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `vcRecognition` | L'**unico** riconoscitore vocale dell'app, condiviso da Voice Practice e Voice Check. | — (istanza unica) | Che nasca a **tempo di parsing** e che i suoi gestori siano assegnati una volta sola: nessuno lo ricostruisce al click. |
| `vcRecognition.onspeechstart` | Alza `vcHeardAnySpeech` appena il riconoscitore **sente una voce**, senza aspettare il testo. | evento → niente | Che una tosse o un rumore contino come voce. **È il prezzo dichiarato**: il male minore rispetto a tagliare chi parla. |
| `vcRecognition.onresult` | Accumula il testo **definitivo** in `vcLatestTranscript`; alza `vcHeardAnySpeech` su qualunque trascrizione non vuota, anche provvisoria. | evento → niente | Che solo `isFinal` conti per il punteggio, e che l'interim serva **solo** a sapere che si è sentito. |
| `vcRecognition.onend` | Il punto unico in cui la registrazione finisce: azzera i timer, e sceglie fra **buttare** (taglio per silenzio) e **offrire** (Invia/Cancella). | — → niente | Che `vcSilenceCutoff` sia stato alzato **prima** di `stop()` da chi ha deciso di buttare. È una bandiera, e si legge una volta sola. |
| `vcSilenceTimeoutId` | Il taglio corto: **`silenceTimeoutSeconds` dal click**, e taglia solo se non si è sentito niente. | — | ⚠️ Che `vcHeardAnySpeech` sappia la verità **in quell'istante**. Fino al 2026-09-21 dava per scontato che «sentito» e «trascritto» fossero lo stesso momento, e non lo sono: il primo interim di Chrome arriva con un ritardo suo. |
| `vcTimeoutId` | Il tetto massimo: `parole × maxRecordingMsPerWord + maxRecordingMarginMs`, **dal click**. | — | Che il conto parta dal click e non dalla fine della frase. *Non è «N secondi dopo che hai finito»*, ed è la manopola che oggi **non** esiste. |
| `setVcState(state)` | Cambia stato e **tutto il DOM che ne dipende** in un punto solo: pulsante, icona, didascalia, timer, area di conferma, risultato, e il blocco dell'intestazione. | `'idle'\|'recording'\|'pending'\|'result'` → niente | Che i quattro stati siano esaustivi: ogni elemento si accende o si spegne per confronto con uno di loro, quindi uno stato nuovo li spegnerebbe tutti in silenzio. |
| `vcAfterSpeechTimeoutId` | Il terzo timer: chiude la registrazione `afterSpeechTimeoutMs` dopo che la **voce si ferma**. È l'unico dei tre che non conta dal click. | — | Che esista qualcosa dopo di lui: se il valore fosse ≥ di quello del riconoscitore di Chrome (~3 s) arriverebbe a sessione già chiusa e **non farebbe niente**. È utile solo finché è più corto. |
| `vcHeardAnySpeech` / `vcHeardAnyText` | Due bandiere: **ho sentito una voce** (la alza `speechstart`) e **sono arrivate parole** (la alza `onresult`). | — | Che restino **due**. La prima decide il taglio per silenzio, la seconda se il terzo timer tiene o butta: *con una sola, un colpo di tosse finirebbe offerto allo studente come se fosse una frase.* |
| `spegniTerzoTimer()` | Spegne il solo timer del «dopo che hai finito». | — → niente | Che abbia **due** chiamanti e non uno: la pulizia generale, e `speechstart` quando la voce riprende. È quella seconda chiamata a impedire il taglio in mezzo a una frase. |
| `clearVcTimeout()` | Spegne **tutti e tre** i timer insieme. ⚠️ *Diceva «entrambi», ed era vero fino al 2026-09-21: il catalogo aveva scritto che «il giorno che nasce il terzo, questa funzione va toccata o resterebbe acceso». È nato, ed è stata toccata.* | — → niente | Che la chiamino **tutte** le strade con cui una registrazione finisce — e le chiamano tutte e quattro: `onend`, `onerror`, `vcResetRecording`, e l'inizio di una nuova. È questo che garantisce che **nessun timer resti appeso** quando un altro scatta per primo. |


## `app/dati.js` — i percorsi dei file di un'edizione

*Catalogati il 2026-09-21 spostando il prefisso dell'edizione in un punto solo.*

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `percorsoEdizione(nomeFile)` | **L'unico posto in cui nasce il percorso di un file dell'edizione**: cartella (`data/{L}/{S}/`), **prefisso** (`{L}-{S}-`) e versione per la cache, tutti e tre insieme. | `'struttura-corso.json'` → `data/inglese/it/inglese-it-struttura-corso.json?v=...` | Che il nome che gli passi sia **nudo**, senza prefisso. ⚠️ *Passarglielo già prefissato non dà errore: dà un percorso doppio che non esiste, e il `fetch` fallisce come un file mancante.* |
| `episodeDataFile(episodeId)` | Il percorso del file di un episodio, ricavato dall'id. | `'gate'` → `data/inglese/it/inglese-it-gate.json?v=...` | Che il prefisso lo metta `percorsoEdizione`. *Fino al 2026-09-21 lo scriveva lui, ed era l'unico: i quattro file condivisi ne restavano senza.* |

## `tests/test-env.js` — gli stessi percorsi, dal lato dei test

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `prefissoEdizione(ed)` | Il prefisso `{lingua}-{studente}-` dell'edizione viva. | `{lingua,studente}` → `'inglese-it-'` | Che l'edizione si legga da `APP_CONFIG`, non da una costante scritta nel test. |
| `fileEdizione(nome)` | Il percorso su disco di un file dell'edizione. | `'gate.json'` → `data/inglese/it/inglese-it-gate.json` | Come sopra: **nome nudo**. |
| `globDati(nomeFile)` | Il glob con cui Playwright intercetta la richiesta di quel file. | `'gate.json'` → `**/inglese-it-gate.json*` | ⚠️ **Nome nudo, e qui sbagliarsi è peggio che altrove:** un glob che non corrisponde **non fallisce** — lascia passare la richiesta vera, e il test diventa verde o rosso per un'altra ragione (regola 37). È successo il 2026-09-21 su quattro punti. |


## `app/catalogo.js` — il nome e la categoria di un episodio

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `buildEpisodes(propri)` | Costruisce `EPISODES`: a ogni episodio mette id, percorso del file dati, i quindici descrittori dei moduli, e **due getter** — `nome` e `categoria`. | l'oggetto degli episodi → `EPISODES` | Che quello che dipende dall'edizione **non si congeli qui**. ⚠️ *Gira a tempo di parsing, quando `CONFIG.episodes` è ancora vuoto: leggere il nome subito dava sempre il ripiego.* |
| `EPISODES.<id>.nome` | Il nome che legge lo studente («Al gate»), **letto a ogni accesso** da `CONFIG.episodes`. | — → stringa | Che il file di struttura sia arrivato. Se non c'è, torna **l'id** — e non è un caso: *un riquadro vuoto sembra un difetto grafico, un id sembra un dato che non è arrivato* (regola 37). |
| `EPISODES.<id>.categoria` | `storia`, `grammatica` o `pronuncia`, stessa strada. | — → stringa o `null` | Come sopra; il ripiego è `null`, perché una categoria inventata sarebbe peggio di una mancante. |


## `app/mappa.js` — la lista degli episodi

| Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|
| `calcolaStatoEpisodi` | Legge **una volta per disegno** il progresso di ogni episodio del corso e ne ricava tre cose: chi è **finito**, chi è stato **cominciato**, e qual è il **primo incompleto**. | `()` → `{ ordine, primoIncompleto }`, più due mappe di modulo | Che leggere il magazzino dentro `episodeStatus` costerebbe una lettura **per riga** invece che una per disegno. ⚠️ **«Finito» è l'ULTIMA POSIZIONE della sequenza, non un modulo per nome e non un conteggio** (regola 30): gli episodi di `grammatica` avranno meno moduli, e un passo aggiunto in mezzo ri-bloccherebbe di colpo tutti quelli finiti. |
| `episodeStatus` | Lo stato di una riga della lista: `completed`, `current` o `locked`. | `(episodeId, primoIncompleto)` → la stringa dello stato | ⚠️ **Che lo sblocco NON sia un dato salvato: si ricalcola a ogni disegno.** Non esiste nessuna chiave «questo episodio è sbloccato» — *ne segue che un difetto di sblocco non si corregge cancellando meno, ma cambiando questa derivazione.* ⚠️ **E che l'ORDINE dei tre rami conti: `completed` va guardato PRIMA.** Un episodio finito ha progresso, quindi invertendo i primi due la spunta sparirebbe da tutti gli episodi finiti — *e lo prende `[C]` di `test_lista_episodi`, non una riga scritta per questo.* ⚠️ **Il quarto stato non esiste di proposito:** un episodio cominciato e non finito si mostra `current`, perché «corrente» per lo studente vuol dire «qui puoi entrare». |

## `app/mappa.js` — la schermata iniziale

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `scriviTestiHome()` | Scrive il saluto e il pulsante della schermata iniziale leggendoli dal file dei testi, col nome dello studente e quello dell'episodio dentro. | — → niente | ⚠️ **Che il markup abbia già qualcosa di sensato da dire.** Non scrive se il testo è vuoto: i testi possono non essere ancora arrivati, e svuotare «Ciao!» e «Inizia» sarebbe peggio di lasciarli. |
| `goHome()` | Porta alla schermata iniziale: scrive i testi, e **li riscrive quando arrivano** se lo studente è ancora lì. | — → niente | Che `views.home` dica se vale ancora la pena scrivere. *Senza quel controllo si scriverebbe su una schermata già lasciata — invisibile, ma è la forma da cui nascono i guasti di ordine.* |

## `app/mappa.js` — il Pannello Admin, il disegno

*Catalogati il 2026-09-24 facendo il primo passo di `1.18`: sono i pezzi che
quel passo ha dovuto capire riga per riga (regola 46).*

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `renderConfigPanel()` | Ridisegna **da capo** il corpo del pannello, un gruppo per ogni chiave di primo livello di `window.APP_CONFIG`, **in ordine alfabetico** (dal 2026-09-24: prima era l'ordine in cui le chiavi erano finite dentro `APP_CONFIG`, cioè nessun ordine — e uno che **cambia** quando si aggiunge un parametro). | *niente* → *niente* | ⚠️ **Che ridisegnare da capo sia necessario**, e lo è: i gruppi generici nascono da `APP_CONFIG`, che **cambia** quando arriva la struttura del corso. ⚠️ **E che lo stato aperto/chiuso vada CONSERVATO QUI DENTRO** (dal 2026-09-24): sta qui e non in chi chiama per la regola 20 — i punti da cui si può ridisegnare si moltiplicano, la funzione che disegna resta una. *Il nodo viene sostituito lo stesso: si conserva `open`, non l'identità.* |
| `openConfigPanel()` | Apre il pannello: disegna i gruppi, i quattro riquadri che dipendono dall'episodio, e poi chiede il magazzino. | *niente* → *niente* | ⚠️ **Che sia chiamata anche a pannello GIÀ APERTO**, quando arriva la struttura del corso: è quella seconda chiamata che ha reso necessario conservare lo stato dei gruppi. Il `.catch` vuoto sul magazzino **è legittimo e registrato** (`tests/ERRORI-INGOIATI.md`): senza tabelle il pannello resta senza due gruppi, non chiuso. |
| `aggiungiGruppiMagazzino(tables)` | Attacca i due gruppi `people` e `places` a pannello già aperto, **aggiungendoli**. | `tables` → *niente*, e scrive `window.APP_CONFIG[k]` | Che i due gruppi si riconoscano dal **testo del `summary`** (`textContent === k`): è la stessa chiave su cui `renderConfigPanel` conserva l'apertura. **Il magazzino è una copia di lavoro su `APP_CONFIG`, non la fonte:** chi legge i valori davvero è `resolveSlotTable`. |
| `renderStoryCardsExplanationStatsPanel()` | Il riquadro delle risposte di Why We Say It, per utente ed episodio correnti. | *niente* → *niente* | ⚠️ **Che senza episodio esca SUBITO** (`riquadroSenzaEpisodio`): finché la struttura non è arrivata quel riquadro **non ha righe**, e chi lo conta troppo presto legge zero. *È il motivo per cui un'asserzione che conta le righe deve approdare su «il riquadro non è più nello stato senza-episodio», non su «ci sono tre righe» (regola 44).* |
