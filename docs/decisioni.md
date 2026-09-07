# Decisioni prese, non ancora eseguite

Il gemello di [`correzioni.md`](correzioni.md), e ne è il contrario nel tempo:
lì stanno i fatti **fatti**, qui i fatti **decisi**. Una decisione presa è un
fatto datato che non si rinegozia — non è un piano, non dice cosa viene prima,
non va tenuto allineato a niente. È una lista non ordinata di cose che abbiamo
deciso e non abbiamo ancora fatto.

Tre regole, e sono tutte:

1. **Una riga per decisione: data, cosa, perché, quando si esegue.** Il *quando*
   è una **condizione**, non una data: «prima di un collaudo su profilo nuovo»,
   non «giovedì». Le date scadono da sole e mentono; le condizioni no.
2. **Si scrive nel commit in cui la decisione viene presa**, come i test
   (regola 23) e come le correzioni. Una decisione registrata dopo è una
   decisione che, nel frattempo, si è già persa.
3. **Quando viene eseguita, la riga si SPOSTA in `correzioni.md`** con il commit
   che la applica, e sparisce da qui.

**Lo svuotarsi è la proprietà che tiene onesto questo file.** Un registro che
solo cresce diventa un cimitero che nessuno rilegge; uno che si svuota mostra
da solo cosa è rimasto indietro. Se una riga è qui da sei mesi, si vede — ed è
un'informazione, non un fastidio.

Una riga senza condizione (`da fissare`) è una decisione a metà: si è deciso
*cosa*, non *quando*. Vale la pena fissarla alla prima occasione, invece di
scoprirla scaduta.

---

## Rinomine

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-06 | `flashcardLevelA` come `kind` entra nella **rinomina unica** insieme a `se*`, `srShuffle`, `quickMatch*`, `speedRound*`. | Il grado vive nella coppia `{ module, grade }`, non nel descrittore (regola 4) — ma il nome del `kind` si porta dentro il grado A, mentre lo stesso descrittore gira anche sul grado B. È un nome che mente, regola 18. Gli altri sono prefissi ereditati dal primo modulo che li ha introdotti. | **Prima di un collaudo su profilo nuovo**, finché siamo gli unici utenti e non c'è niente da migrare. Non va più insieme a Supabase. |

## Difetti silenziosi trovati e non ancora corretti

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-06 | `openModuleByKind` è una catena di `if/else if` **senza ramo finale**: un modulo il cui `kind` non corrisponde a niente diventa una riga cliccabile che non fa nulla. | Lo stato di un modulo è derivato ("il primo non completato è l'attuale"), quindi quel modulo resta attuale per sempre e **blocca tutti i passi successivi**, senza un errore in console. | **Da fissare** — proposto: prima degli episodi grammaticali (P2), che sono il caso in cui un `kind` non ancora costruito si presenta davvero. |
| 2026-09-06 | `episodeGrade()` restituisce `[]` per un grado assente, e i controlli `qmQueue`/`vcQueue`/`srQueue` `.length === 0` lo leggono come «coda finita». | Un modulo puntato su un grado che l'episodio non ha **non crolla: si dichiara completato senza aver fatto fare un solo esercizio**, e registra l'esito. È peggio di un errore, perché sembra funzionare. | **Da fissare** — proposto: insieme al precedente, e comunque prima di un episodio con una forma di gradi diversa. |
| 2026-09-06 | `migrateCustomizeSeenToModuleProgress()` scrive `'personalizzazione'` nei progressi di **qualunque** episodio, anche di uno che quel modulo non lo dichiara. | Gira in cima a `openEpisodeMap()`, senza guardare se l'episodio ha quel modulo. Innocuo oggi (nessuno rilegge quell'id), ma è spazzatura nei progressi salvati. | **Da fissare** — proposto: quando nasce il primo episodio senza Personalizza. |
| 2026-09-07 | Al terzo livello dell'avviso microfono **non c'è nessuna strada per tornare a registrare**: il microfono è nascosto (stato `result`), "Esercitati ancora" è spento e "Avanti" è bloccato da `vcMicConfirmedProblem`. Il commento di `vcUpdateMicNotice` dice che il blocco si scioglie «finché il microfono non ricomincia a funzionare (il contatore si azzera)» — quel ramo non può accadere, perché non c'è niente da premere per riprovare. | Non è un blocco senza uscita — "Torna alla mappa" c'è ed è verificata da `test_avviso_microfono.js` — ma è **una promessa che il codice fa e non può mantenere**: chi legge quel commento crede che esista un recupero sul posto e non lo cerca. Delle due, o si dà una strada per riprovare (lasciare "Esercitati ancora" acceso al livello 3) o si toglie la promessa dal commento. | **Da fissare** — è una decisione di comportamento, non una svista: sceglierla richiede di dire cosa deve poter fare uno studente col microfono rotto. |

## Contenuto

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | Il markdown scrive i segnaposto in **notazione leggibile** (`{papà}`, `{figlia}`, `{etàFiglia}`) e il JSON usa le **chiavi vere** (`papa`, `figliaNome`, `figliaEta`). | È una traduzione mentale a ogni lettura, e prima o poi qualcuno la sbaglia. Non si allinea adesso perché cambiare le chiavi del JSON è una **migrazione**: sono la struttura dei valori salvati in `baseinglese:<episodio>:custom:<utente>`. | **Insieme alla rinomina degli slot a id**, che tocca comunque quelle chiavi. Un lavoro solo. |
| 2026-09-07 | La chiave tecnica del personaggio è `speaker: "guide"` in ogni battuta, ma il personaggio è l'**Hostess al gate** (l'etichetta mostrata è stata allineata, la chiave no). | Regola 18: un nome che non dice più cosa nomina. Innocuo finché il cast è uno, fuorviante quando un episodio avrà davvero una guida *e* una hostess. | **Quando un episodio avrà un secondo personaggio esterno**, o insieme alla prossima riscrittura delle battute: allinearla adesso significherebbe toccare nove battute per una parola che nessuno vede. |
| 2026-09-07 | `docs/it/episodio-1.md`, nota 3, dice *«i numeri si scrivono in lettere perché è la parola che Voice Practice ascolta»*. **Oggi l'app non lo fa**: `slotOptions` normalizza un numero rendendo `it` ed `en` identici, quindi la battuta d7 in inglese dice «I'm 16 years old» con la cifra. | Stessa famiglia della riga sul fallback: **un'istruzione che descrive uno stato che non esiste.** Chi la legge crede che sia già così e non cerca il difetto. | **Quando si farà il magazzino** (punto ③ di «Cosa manca» in `docs/it/tabelle-personalizzazione.md`), che è ciò che la rende vera. |

## CI rosse che non dicono cosa fare

*Stessa famiglia: la CI diventa rossa e chi la legge non sa se è rotta l'app o il
test. Vanno guardate in un giro solo — **dopo il collaudo**, sono mezza giornata.*

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | `test_batch19.js`, tre cose **in quest'ordine**: **(1)** il `.catch(() => {})` della riga 131 sopprime il fallimento del click su `#sr-ready-btn` — probabile causa vera del rosso in CI: se il click non va, il countdown non parte e il test muore nove righe dopo su un timeout che non dice niente. Va sostituito con un `waitForSelector('#sr-ready-btn')` prima del click: se il pulsante non c'è, deve fallire lì e dirlo. **(2)** la riga 132 (`waitForTimeout(300)`) è ridondante rispetto alla 139, che aspetta già lo stato vero — via, e il test è anche più veloce. **(3)** il messaggio del timeout della 139 dice solo «TimeoutError»: per capire cosa fosse successo è servito leggere il codice, non il log. | **L'ordine conta, e chi legge fra un mese deve saperlo: 2 senza 1 non risolve niente.** Togliere solo l'attesa fissa dichiarerebbe chiuso un difetto ancora vivo, che tornerebbe con lo stesso timeout muto. La causa è il click soppresso, non la lentezza del countdown. | **Prima del collaudo.** Una CI rossa a caso durante un collaudo fa perdere tempo a capire se è colpa del contenuto o del test. |
| 2026-09-07 | Quattro valori **ricopiati invece che letti dalla fonte**: `test_batch12.js:199` (i cinque colori d'accento come esadecimali), `test_new_features.js:148-149` e `test_batch3b.js:248` (le frequenze `1568`/`1976`, che stanno in `CONFIG` righe 160-161), `test_new_features.js:276` (il default `10` di `timeLimitSeconds`, `CONFIG` riga 248). In tutti la pagina è già caricata: leggerli dalla fonte costa **meno** righe che ricopiarli. | Un valore scritto in un secondo posto invecchia, e in un test rompe la CI senza che niente sia rotto. **I colori sono il caso peggiore**: non è solo un valore ricopiato, è la **regola 2 disattesa** — «nessun colore fisso, sempre le variabili del tema» — in un posto dove nessuno guardava. E in un componente un colore sbagliato si vede a schermo; in un test si vede solo come una CI rossa senza motivo. | **Dopo il collaudo, insieme a `test_batch19`**: sono la stessa famiglia. |

> ⚠️ **Prima di prendere questo lavoro, la distinzione che lo rende sicuro:**
> **se il valore esiste altrove nel progetto, ricopiarlo è una copia; se il numero
> è il requisito, è un'asserzione.** `freq === 1568` è una copia — la fonte è
> `CONFIG`. `readyTones.length === 3` («il 3-2-1 suona tre volte») è un requisito,
> e **deve restare**: se domani il countdown suonasse cinque volte, il test deve
> dirlo. Stessa cosa per `moduleCompleteMessages.alto.length === 5`.
>
> Senza questa riga chi prende il lavoro toglie anche i `length === 3`, e quelli
> sono la parte che protegge.

## Dati che l'app produce e nessuno può leggere

> **Nessun dato di uso è aggregabile finché non esiste un raccoglitore.**
> Il `localStorage` sa cosa ha fatto **un** utente su **un** dispositivo; tutti i
> KPI che abbiamo scritto chiedono *«quanti studenti»* — e quella domanda oggi
> non ha risposta.
>
> Vale per ognuno: dove si ferma la gente, i ripassi nel quiz, le aperture
> dell'Help, i secondi di audio, le spiegazioni dichiarate poco chiare. Il
> meccanismo che li produce c'è già, spesso per intero: **manca solo dove
> mandarli.** Ogni giorno che passa è un giorno di dati che si accumulano su
> dispositivi diversi e non li somma nessuno.
>
> **Quando:** con Supabase, o qualunque altra cosa faccia da raccoglitore.
>
> **La conseguenza sposta una priorità:** Supabase non serve solo agli account e
> ai pagamenti. **Serve a sapere se il metodo funziona.** Finché non c'è, ogni
> giudizio sul contenuto resta un'impressione — e i moduli di autovalutazione
> producono, senza saperlo, l'unica prova che potrebbe smentirla.

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-07 | **Le risposte di Why We Say It si salvano davvero**, per singola skill: `addSeExplanationStat` scrive `baseinglese:seExplanationStats:<episodio>:<utente>` a ogni risposta, con `{ chiara, nonAncora, nonChiara }` per ogni `skillId`. **Ma la chiave contiene l'utente e vive nel `localStorage` del suo browser**: il dato non esce mai dal dispositivo. «Una spiegazione poco chiara a *molti* studenti» **non è calcolabile**, perché non esiste nessun modo di raccogliere quei conteggi. Oggi si vede solo nel Pannello Admin, e solo del profilo aperto. | È un giudizio sul **nostro** contenuto, non sullo studente — il dato più prezioso che quei moduli producono — e oggi si perde a ogni dispositivo. Il meccanismo di raccolta c'è già, per metà: manca solo dove mandarlo. | **Con Supabase**, o con qualunque altra cosa dia un posto dove i conteggi di più studenti si sommano. Non prima: senza un raccoglitore non c'è niente da costruire. |
| 2026-09-07 | **I tre Dialogue non registrano niente per battuta.** L'autovalutazione è una domanda sola a fine modulo (`dg-not-yet-btn` → `dgFinishModule('giallo')`): resta un livello di modulo, e quale battuta sia stata difficile non lo sa nessuno. **Flash Card** invece salva per voce, ma in `mastery` — un giudizio sullo studente, non sul contenuto: dice «questo studente non sa `a-hello`», non «`a-hello` è spiegata male». | Il dato per battuta dei Dialogue non esiste: non è che si perde, non viene proprio prodotto. Se serve, va aggiunta la domanda per battuta, che è una modifica al modulo — non una raccolta. | **Da valutare (regola 34)**, non da eseguire. Prima serve sapere se una domanda per battuta appesantisce il modulo più di quanto il dato valga. |

## Pulizie rimandate di proposito

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-05 | La divergenza **off/seen** in `tests/module-order.js`: il file riscrive a mano la regola di `moduleStepId()` e conta le apparizioni in modo diverso dall'app. | Correggerla adesso significa mantenere due copie della stessa regola. | **Non si corregge: sparisce da sola** quando l'identità del passo sarà `modulo + grado`, perché non ci sarà più niente da contare. |
| 2026-09-06 | I testi dell'avviso microfono (`vcUpdateMicNotice`, titolo e corpo dei tre livelli) sono scritti nel codice invece che in `data/{lingua}/istruzioni-moduli.json`, insieme ad altre ~25 frasi già note nella stessa condizione. | Regola 8: se è testo che lo studente legge e non è contenuto dell'episodio, sta nel JSON. Sparsi nel codice non si possono correggere senza toccare `index.html`, e in una seconda edizione non si possono tradurre affatto. | **È un lavoro solo**, non venticinque: si fa quando ci arriveremo, tutto insieme. Spostarne una alla volta lascia il problema e raddoppia i posti dove cercare. |
| 2026-09-05 | I due blocchi `if (vcVariant === 'practice')` adiacenti in `vcEvaluate`, unibili in uno. | Pura leggibilità: il comportamento è corretto. Toccarlo adesso vorrebbe dire aprire `vcEvaluate` per niente. | **Alla prossima modifica di `vcEvaluate`**, insieme a un lavoro che quella funzione la apre comunque. |
