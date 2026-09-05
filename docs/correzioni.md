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

## Why We Say It

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-04 | Dodici correzioni in un giro: traduzione dentro la bolla e sempre visibile (via il link "Mostra traduzione"); Blocco Ascolto dentro la bolla; bordo e sfondo delle card più marcati; nessuno dei tre pulsanti preselezionato; il pulsante scelto blu accento e non verde; la risposta si può cambiare anche al primo giro; via l'etichetta accanto alla spunta ("✓ NON CHIARA"); le card senza regola prendono la spunta quando la sequenza le supera; venti frasi di supporto per risposta, mai ripetute dentro lo stesso modulo. | `b3f9a4a` |
| 2026-09-04 | A 320 e 360 px "Esci e riprendi dopo" usciva dallo schermo (`.se-complete-row .btn`: ora va a capo dentro il pulsante invece di allargarlo). | `b3f9a4a` |

## Dialogue (Repeat in Time, Real Dialogue)

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-04 | L'area sensibile per passare alla battuta successiva mentre scorre la barra è **tutta la bolla**, non la sola barra del tempo. Vale per entrambi i profili. Il pulsante "Prossima frase" resta. | `b3f9a4a` |
| 2026-09-04 | La Spiegazione di entrambi i moduli dice che si può anche toccare la battuta per andare avanti. | `b3f9a4a` |

## Speed Match

| Data | Cosa | Commit |
|---|---|---|
| 2026-09-05 | Tolto `CONFIG.speedRound.pointsPerCorrect`: parametro presente nel Pannello Admin e mai letto da nessuno — una manopola che non muoveva niente (decisione D4). | `4b32777` |
