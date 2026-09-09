# Correzioni

Il registro di cosa è stato corretto, diviso per modulo. Una riga per
correzione: **data, cosa, commit**.

**Prima di correggere qualcosa, cercalo qui.** Se risulta già corretto,
fermati e dillo, con data e commit — non rifarlo. Una correzione che si
ripresenta non è una correzione: è il sintomo che la prima non ha tenuto, o
che è stata scavalcata da una modifica successiva. Rifarla in silenzio
nasconde il problema vero.

Ogni correzione va aggiunta qui **nello stesso commit** che la applica, come
i test (regola 23). Una correzione registrata dopo è una correzione che, nel
frattempo, qualcun altro ha già rifatto.

Il *perché* di una scelta non sta qui: sta nel commento accanto al codice e
nel messaggio di commit. Qui sta il *cosa*, in una riga, per poterlo
ritrovare.

Nella colonna **Commit** sta l'hash quando la correzione è di un commit
precedente. Le righe aggiunte *insieme* alla correzione che descrivono portano
invece il **titolo** del commit: un commit non può contenere il proprio hash, e
mettercelo con una modifica successiva significherebbe scriverlo fuori dal
commit che lo giustifica. Il titolo si ritrova con `git log --grep`.

---

## Condiviso (mappa, esiti, configurazione)

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-05 | La regola di esito (`CONFIG.moduleOutcomeRules`) veniva cercata con l'**id del passo** invece che con l'id del **modulo**: dalla seconda apparizione in poi (`quickMatchEngIta-2`, `flashcardAEngIta-2`, `voicePractice-2`…) la chiave non esisteva, `saveModuleOutcome` non veniva chiamato e sei passi su ventidue restavano senza colore in mappa. Sette letture passate a `.moduleId` — un campo che l'app costruiva già su ogni passo e non leggeva nessuno. Era il § 4.1 di `docs/validazione.md`. | titolo: `La regola di esito arriva a ogni apparizione, non solo alla prima` |
| 2026-09-05 | `CONFIG.attemptRule` tolta. Le sue due righe (`voicePractice: 'lastAttempt'`, `voiceCoach: 'firstAttempt'`) duplicavano una distinzione già nel descrittore come `module.voiceVariant`, ed erano anch'esse indicizzate per id del passo: il passo 16 cadeva su `undefined` e usava il primo tentativo invece dell'ultimo. La regola vive ora in `vcEvaluate`, che rama su `vcVariant`. | titolo: `La regola di esito arriva a ogni apparizione, non solo alla prima` |

## Episodi di forma diversa (i tre difetti silenziosi)

*Tutti e tre chiusi insieme il 2026-09-08, perché sono la stessa famiglia: non
crollano, sembrano funzionare, e mordono al primo episodio che non ha la forma
del primo. Sono diventati urgenti con la decisione degli **episodi corti** —
solo gradi C e D.*

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-08 | `openModuleByKind` aveva una catena di `if/else if` **senza ramo finale**: un passo con un `kind` sconosciuto era una riga cliccabile che non faceva nulla, restava "attuale" per sempre e bloccava tutti i successivi senza un errore in console. Ora il ramo finale mostra la schermata d'errore, che è già la strada per «qualcosa non va» (regola 35). | titolo: `Tre difetti silenziosi che aspettavano il primo episodio corto` |
| 2026-09-08 | `episodeGrade()` torna `[]` per un grado assente, e i costruttori di coda leggevano quel `[]` come «coda già finita»: il modulo si dichiarava **completato senza far fare un solo esercizio**, e registrava l'esito. Nasce `episodeGradeRequired()`, il lettore che **pretende**: sta nei sette punti dove il contenuto è indispensabile (cinque code e due schermate), alza, e il fallimento cade nella `.catch()` che ogni modulo ha già. `episodeGrade()` resta il lettore neutro per i gestori di click, dove «nessuna voce» vuol dire solo «niente da fare». | titolo: `Tre difetti silenziosi che aspettavano il primo episodio corto` |
| 2026-09-08 | `migrateCustomizeSeenToModuleProgress()` scriveva `'personalizzazione'` nei progressi di **qualunque** episodio, anche di uno che quel passo non lo dichiara. Ora controlla che l'episodio abbia davvero quel modulo. | titolo: `Tre difetti silenziosi che aspettavano il primo episodio corto` |

## Suite di regressione

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-07 | `test_batch19.js`: i quattro cicli che cliccano sempre la prima opzione — uno in Match Practice, tre in Speed Match — provavano **venti** giri su un grado che ha **nove** domande. Se la fortuna andava storta per tutte e nove, il giro finiva, le opzioni sparivano, e il click successivo restava appeso trenta secondi su una schermata di riepilogo prima di morire con un `TimeoutError` che non diceva niente. Ora `tapPrimaOpzione()` si accorge che non c'è più niente da toccare e il ciclo esce: l'asserzione «Managed to observe...» subito dopo diventa il rosso che **spiega**. | titolo: `Il ciclo di Speed Match sapeva contare fino a venti su nove domande` |

## Contenuto dell'episodio

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-07 | `data/inglese/it/inglese-it-gate.json` riscritto da `docs/inglese/it/inglese-it-gate.md`: i numeri dichiarati nella fonte (15 voci in A, 7 in B, 9 in C, 9 battute in D, 8 skill, 8 slot) non corrispondevano al file dati (16, 7, 10, 9), quindi l'app mostrava un contenuto diverso da quello deciso. Il grado C non ricopia più le battute a mano: dove la fonte scrive `= dN` la frase viene dalla battuta, così non possono divergere. `episodeTitle` da "Presentarsi" ad "Al gate", ed etichetta del personaggio da "Guida" a "Hostess al gate". | titolo: `Il file episodio riscritto dalla sua fonte` |

## Why We Say It

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-04 | Dodici correzioni in un giro: traduzione dentro la bolla e sempre visibile (via il link "Mostra traduzione"); Blocco Ascolto dentro la bolla; bordo e sfondo delle card più marcati; nessuno dei tre pulsanti preselezionato; il pulsante scelto blu accento e non verde; la risposta si può cambiare anche al primo giro; via l'etichetta accanto alla spunta ("✓ NON CHIARA"); le card senza regola prendono la spunta quando la sequenza le supera; venti frasi di supporto per risposta, mai ripetute dentro lo stesso modulo. | `b3f9a4a` |
| 2026-09-04 | A 320 e 360 px "Esci e riprendi dopo" usciva dallo schermo (`.se-complete-row .btn`: ora va a capo dentro il pulsante invece di allargarlo). | `b3f9a4a` |

| 2026-09-07 | Sblocco Sequenziale, variante per dichiarazione: una card `is-ahead` non risponde più a niente. Prima l'attenuazione era solo grafica e il Blocco Ascolto dentro la card restava cliccabile — l'audio partiva da una card futura, aggirando la sequenza che il meccanismo esiste per imporre. Guardia sola in cima al gestore, stessa forma della variante per ascolto nel Dialogo. | `86e7462` |

## Dialogue (Repeat in Time, Real Dialogue)

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-04 | L'area sensibile per passare alla battuta successiva mentre scorre la barra è **tutta la bolla**, non la sola barra del tempo. Vale per entrambi i profili. Il pulsante "Prossima frase" resta. | `b3f9a4a` |
| 2026-09-04 | La Spiegazione di entrambi i moduli dice che si può anche toccare la battuta per andare avanti. | `b3f9a4a` |

| 2026-09-07 | Real Dialogue: toccare una battuta mentre parla ne salta l'audio, come negli altri due profili. Il salto stava **dopo** la guardia `advance === 'auto'`, che usciva prima: una perdita causata dall'ordine delle righe, non una scelta. | `86e7462` |

## Voice Practice / Voice Check

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-07 | Premere il microfono e non parlare ora **conta** come registrazione senza parole: il ramo del timeout di silenzio incrementa `vcEmptyRecognitionStreak` e aggiorna l'avviso. Prima quel contatore si muoveva solo dentro `vcEvaluate()`, cioè dopo un "Invia" — e una registrazione muta viene scartata prima di arrivarci, quindi il gesto più comune di chi ha il microfono rotto era l'unico che all'avviso non arrivava mai. Non erano due meccanismi in competizione: era uno che non veniva mai innescato. Livello 1 dopo due tentativi. Il pannello è uscito da `#vc-result`, che nello stato di riposo è nascosto: da lì dentro sarebbe salito di livello restando invisibile. Quando l'avviso c'è, la riga sotto il microfono si toglie invece di ripetere lo stesso concetto. | titolo: `Premere e non parlare conta come registrazione vuota` |

## Speed Match

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-05 | Tolto `CONFIG.speedRound.pointsPerCorrect`: parametro presente nel Pannello Admin e mai letto da nessuno — una manopola che non muoveva niente (decisione D4). | `4b32777` |
