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

## Pulizie rimandate di proposito

| Data | Cosa | Perché | Quando si esegue |
|---|---|---|---|
| 2026-09-05 | La divergenza **off/seen** in `tests/module-order.js`: il file riscrive a mano la regola di `moduleStepId()` e conta le apparizioni in modo diverso dall'app. | Correggerla adesso significa mantenere due copie della stessa regola. | **Non si corregge: sparisce da sola** quando l'identità del passo sarà `modulo + grado`, perché non ci sarà più niente da contare. |
| 2026-09-06 | I testi dell'avviso microfono (`vcUpdateMicNotice`, titolo e corpo dei tre livelli) sono scritti nel codice invece che in `data/{lingua}/istruzioni-moduli.json`, insieme ad altre ~25 frasi già note nella stessa condizione. | Regola 8: se è testo che lo studente legge e non è contenuto dell'episodio, sta nel JSON. Sparsi nel codice non si possono correggere senza toccare `index.html`, e in una seconda edizione non si possono tradurre affatto. | **È un lavoro solo**, non venticinque: si fa quando ci arriveremo, tutto insieme. Spostarne una alla volta lascia il problema e raddoppia i posti dove cercare. |
| 2026-09-05 | I due blocchi `if (vcVariant === 'practice')` adiacenti in `vcEvaluate`, unibili in uno. | Pura leggibilità: il comportamento è corretto. Toccarlo adesso vorrebbe dire aprire `vcEvaluate` per niente. | **Alla prossima modifica di `vcEvaluate`**, insieme a un lavoro che quella funzione la apre comunque. |
