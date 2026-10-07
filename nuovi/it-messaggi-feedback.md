**Versione: 20261007a**

# Messaggi di esito — per chi studia in italiano

**Il gemello di `data/condivisi/it/it-messaggi-feedback.json`.** Questo file **spiega e decide**, quel
JSON **esegue** (`CLAUDE.md` regola 26). Sta accanto a `it-istruzioni-moduli.md` e non dentro di lui:
*quello è il testo che dice **come si usa** un modulo, questo quello che **risponde a un esito** — e la
regola 8 li tiene in due file da prima che esistesse una fonte per nessuno dei due.*

⚠️ **IL FILE HA CAMBIATO NOME E POSTO IL 2026-09-28:** *`inglese-it-messaggi-feedback` →
**`it-messaggi-feedback`**, e da `data/inglese/it/` a **`data/condivisi/it/`**.*

**Perché:** *«Va bene così, l'importante è provarci» è identico in un corso di inglese e in uno di
spagnolo. Questi testi dipendono dalla lingua dello **studente**, non da quella che si insegna.*
**Insieme alle istruzioni dei moduli sono TUTTE le stringhe che lo studente legge fuori da un
episodio: copiarle per edizione vorrebbe dire, con quattro edizioni per italiani, quattro volte tante
copie che nessuno riallineerebbe.**

⚠️ **E IL CONTO NON STA PIÙ SCRITTO QUI, DI PROPOSITO.** *Vive in un posto solo, con la sua data:
`CLAUDE.md`, regola 8.* 🔴 **Il 2026-10-07 il numero vecchio — «349 … 1047» — si è trovato ricopiato in
DIECI file**, *e nessuno dei dieci sapeva di essere scaduto dal 28 settembre: 349 era `208 + 141`, e le
istruzioni dei moduli sono scese a 178 lo stesso giorno.*

> ⭐ **Un numero ricopiato invecchia in dieci posti. Uno datato invecchia in uno** (regola 48).

⚠️ **NESSUNO AVEVA MAI RILETTO QUESTI TESTI.** Trovato il 2026-09-26 censendo ciò che lo studente
legge: **141 stringhe** senza nessuna fonte markdown. *E sono i testi che pesano di più: una
spiegazione lunga si salta, **un messaggio di esito sbagliato si crede**.*

⚠️ **QUASI TUTTO È UNA LISTA DI CINQUE VARIANTI, e non è un caso: l'app ne pesca UNA.** Quindi lo
studente che rifà lo stesso modulo non rilegge la stessa frase. *Ne segue una cosa da tenere a mente
accorciando: **le cinque devono restare cinque cose diverse**, non cinque modi di dire la stessa.
Ridurne il numero è una scelta legittima, ma va detta: da tre in giù si comincia a riconoscerle.*

---

## 1 — COME SI LEGGE QUESTO FILE

**I titoli si cercano per TESTO ESATTO**: `##` + uno spazio + il testo della colonna, col trattone `—`
(U+2014) e uno spazio prima e uno dopo.

| Il testo dopo `## ` | Cosa ne nasce |
|---|---|
| `2 — LE FASCE` | `percentageRule` — la regola che decide QUALE gruppo di messaggi si pesca |
| `3 — I MESSAGGI` | tutte le liste di varianti: **un messaggio per riga** |
| `4 — I TITOLI` | i testi che non sono in una lista |
| `5 — LE LISTE VUOTE` | le liste che esistono e non hanno righe |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA:** se questa tabella scrivesse i titoli per intero, una
ricerca per sottostringa troverebbe **questa riga** invece della sezione vera. *`grep -c '^## 3'` deve
dare **1**.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una cella di tabella le
toglie gli spazi ai lati — deve — quindi uno spazio ai bordi sparirebbe **senza un errore**. Il segno
si vede, lo spazio no.*

⚠️ **IL `#` DI UNA RIGA È LA POSIZIONE NELLA LISTA, e conta**: **è l'ordine in cui l'app le pesca**.
Togliere una riga in mezzo rinumera quelle sotto, e va bene; cambiarne l'ordine senza motivo no.

### I numeri attesi

**Si contano sul contenuto prima di usarlo (regola 29): se non tornano, fermarsi.**

| Cosa | Righe nel file | Stringhe nel JSON |
|---|---|---|
| Messaggi in lista (sezione 3) | **130** | **130** |
| Titoli fuori lista (sezione 4) | **2** | **2** |
| Voci della regola delle fasce (sezione 2) | **10** | ⚠️ **9** — *una è un booleano* |
| Liste vuote (sezione 5) | **1** | ⚠️ **0** — *una lista vuota è una chiave senza stringhe* |
| **TOTALE** | 143 | ⭐ **141** |

*Famiglie di primo livello: **10**, e non sono stringhe — sono i contenitori.*

🔴 **QUESTA TABELLA IL 2026-09-28 È STATA RIFATTA, PERCHÉ PRIMA NON TORNAVA.** *Diceva
`130 + 2 + 10 + 1` accanto a un totale di `141`, senza spiegare la differenza — e un conto che non torna
è un invito a «ripararlo» cambiando il numero giusto.* **Le due righe che mancavano all'appello sono
`percentageRule.0.showMessage`, che è `false` e non `"false"`, e la lista vuota, che è una chiave con
zero stringhe dentro.**

⭐ **Invariate dal 2026-09-26: nessuna chiave nasce, nessuna muore.** *Una famiglia cambia nome, due
testi cambiano contenuto — e il conto è la prova che questo giro tocca il contenuto e non la forma.*

### ⚠️ COSA È CAMBIATO IL 2026-09-28, E PERCHÉ

| | |
|---|---|
| 🔴 **`speedRoundMessages` → `speedMatchMessages`** | *quindici testi che **nessuno leggeva**, perché la chiave portava il nome di prima della rinomina `speedRound → speedMatch`.* **Non era un collegamento mancato: era un nome vecchio** — e questo li ha resi invisibili per settimane |
| 🔴 **`speedMatchMessages` · `medio` · 5** | *il testo di prima lodava la velocità, e la spiegazione del modulo dice testualmente «l'obiettivo non è la velocità, è la correttezza»* |
| 🔴 **`moduleCompleteMessages` · `alto` · 5** | *parlava di pronuncia in moduli dove **non si parla**: Flash Card, Match Practice, Speed Match* |

⭐ **E la lezione del primo, che vale più del testo:** *quei quindici erano già stati scoperti una volta,
e la scoperta è andata persa insieme al documento che la portava.* **Un fatto che vive solo in un
documento muore col documento: va estratto in una tabella.**

---

## 2 — LE FASCE

*`percentageRule`: la regola che, data la percentuale di risposte giuste, decide QUALE gruppo della
sezione 3 si pesca. **Non è testo che lo studente legge** — è la logica scritta accanto ai testi che
governa, e sta qui per questo.*

⚠️ **`showMessage` è un BOOLEANO, non una parola:** va scritto `false` o `true`, e la colonna «tipo» lo
dice. *Una cella che dicesse «no» diventerebbe la stringa `"no"`, che è vera.*

| Percorso | Tipo | Valore |
|---|---|---|
| `percentageRule.rule` | testo | basata sulla percentuale di risposte/parole corrette sul totale |
| `percentageRule.0.range` | testo | 0% |
| `percentageRule.0.showMessage` | booleano | false |
| `percentageRule.0.note` | testo | nessun messaggio mostrato |
| `percentageRule.1.range` | testo | 1-49% |
| `percentageRule.1.messageKey` | testo | basso |
| `percentageRule.2.range` | testo | 50-79% |
| `percentageRule.2.messageKey` | testo | medio |
| `percentageRule.3.range` | testo | 80-100% |
| `percentageRule.3.messageKey` | testo | alto |

---

## 3 — I MESSAGGI

*Un messaggio per riga. **Famiglia** → la chiave di primo livello · **gruppo** → la fascia o il caso
(`alto`/`medio`/`basso`, `riuscita`/`nonRiuscita`, …) · **#** → la posizione nella lista.*

**Quante ne ha ciascuna famiglia:**

| Famiglia | Messaggi | Gruppi |
|---|---|---|
| `voiceCoachMessages` | **15** | `alto`, `basso`, `medio` |
| `speedMatchMessages` | **15** | `alto`, `basso`, `medio` |
| `valvolaSicurezzaMessages` | **10** | `nonRiuscita.bodies`, `riuscita.bodies` |
| `moduleCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `studioCompleteMessages` | **5** | `default` |
| `storyCardsCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `dialogoCompleteMessages` | **10** | `nonAncora`, `siLoSo` |
| `retryIntroMessages` | **20** | `first.bodies`, `first.titles`, `last.bodies`, `last.titles` |
| `episodeFinalMessages` | **25** | `almenoUnRosso.compliments`, `almenoUnRosso.tip`, `gialloNoRosso.compliments`, `gialloNoRosso.tip`, `tuttiVerdi.compliments` |

| Famiglia | Gruppo | # | Testo |
|---|---|---|---|
| `voiceCoachMessages` | `alto` | 1 | Perfetto! Pronuncia impeccabile. |
| `voiceCoachMessages` | `alto` | 2 | Wow, sembri già un madrelingua! |
| `voiceCoachMessages` | `alto` | 3 | Eccellente, continua così! |
| `voiceCoachMessages` | `alto` | 4 | Fantastico, hai centrato tutto. |
| `voiceCoachMessages` | `alto` | 5 | Bravissimo, non c'è nulla da correggere. |
| `voiceCoachMessages` | `medio` | 1 | Bene, ci sei quasi! |
| `voiceCoachMessages` | `medio` | 2 | Buon lavoro, qualche dettaglio da limare. |
| `voiceCoachMessages` | `medio` | 3 | Sulla strada giusta, continua a esercitarti. |
| `voiceCoachMessages` | `medio` | 4 | Non male! Un altro paio di tentativi e sarà perfetto. |
| `voiceCoachMessages` | `medio` | 5 | Ci sei quasi, un piccolo sforzo in più. |
| `voiceCoachMessages` | `basso` | 1 | Va bene così, l'importante è provarci. |
| `voiceCoachMessages` | `basso` | 2 | Ci vuole pratica, e tu la stai facendo — bravo. |
| `voiceCoachMessages` | `basso` | 3 | Ogni tentativo ti avvicina di più, continua. |
| `voiceCoachMessages` | `basso` | 4 | Nessun problema, ripasseremo insieme questa frase. |
| `voiceCoachMessages` | `basso` | 5 | Va tutto bene, è normale all'inizio. |
| `speedMatchMessages` | `alto` | 1 | Ottimo punteggio, hai davvero le idee chiare! |
| `speedMatchMessages` | `alto` | 2 | Wow, quasi tutte corrette! |
| `speedMatchMessages` | `alto` | 3 | Eccellente memoria! |
| `speedMatchMessages` | `alto` | 4 | Complimenti, sei quasi al massimo! |
| `speedMatchMessages` | `alto` | 5 | Fantastico lavoro su questo blocco. |
| `speedMatchMessages` | `medio` | 1 | Buon punteggio, si vede che stai imparando. |
| `speedMatchMessages` | `medio` | 2 | Bene così, continua a esercitarti. |
| `speedMatchMessages` | `medio` | 3 | Ci sei quasi: ripassa le parole che ti sono sfuggite. |
| `speedMatchMessages` | `medio` | 4 | Non male, un altro giro e migliori ancora. |
| `speedMatchMessages` | `medio` | 5 | Ci stai prendendo la mano: la prossima volta verrà più automatico. |
| `speedMatchMessages` | `basso` | 1 | Va bene così, ora sai quali parole ripassare. |
| `speedMatchMessages` | `basso` | 2 | L'importante è essersi messi alla prova. |
| `speedMatchMessages` | `basso` | 3 | Ripasseremo insieme le parole più difficili. |
| `speedMatchMessages` | `basso` | 4 | È solo l'inizio, andrà meglio. |
| `speedMatchMessages` | `basso` | 5 | Nessun problema, il ripasso è fatto apposta per questo. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 1 | Hai provato già diverse volte questa frase — è normalissimo, capita a tutti quando si impara qualcosa di nuovo. Conviene andare avanti: questa frase tornerà nei prossimi ripassi, e col tempo verrà naturale. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 2 | Capita, e non è un problema: vuol dire solo che questa frase ha bisogno di un altro giro. Vai avanti con l'esercizio, la ritroverai più avanti nei ripassi mirati. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 3 | A volte una frase è più ostica delle altre, capita anche a chi va già bene. Meglio proseguire ora e lasciarla decantare — tornerà da sola nei prossimi ripassi. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 4 | Nessuna fretta: certe frasi richiedono più ripetizioni di altre, ed è previsto dal metodo. Vai avanti, ci tornerai sopra quando serve. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 5 | Non ci sei ancora, ma va bene così — è proprio il motivo per cui esistono i ripassi. Continua pure con il resto dell'esercizio. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 1 | Ce l'hai fatta, e si vede che i tentativi hanno aiutato: hai insistito ed è servito. Vai avanti con lo stesso spirito. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 2 | Alla fine ci sei arrivato — i primi tentativi non erano andati benissimo, ma hai corretto la mira. Proprio questo è il modo in cui si impara. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 3 | Bel recupero: non era venuta bene subito, ma hai continuato a provarci e ora è a posto. Continua così. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 4 | Hai insistito su questa frase ed è servito: adesso la sai fare meglio di prima. È esattamente il senso del ripasso. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 5 | Ci sei riuscito dopo qualche tentativo in più, e va benissimo così — vuol dire che il ripasso sta funzionando. |
| `moduleCompleteMessages` | `alto` | 1 | Hai risposto bene quasi a tutto: si vede che il lavoro fatto finora paga. |
| `moduleCompleteMessages` | `alto` | 2 | Risultato pieno, o quasi — complimenti per la precisione. |
| `moduleCompleteMessages` | `alto` | 3 | Prova solida dall'inizio alla fine, senza bisogno di ripassi. |
| `moduleCompleteMessages` | `alto` | 4 | Hai portato a casa quasi tutte le risposte giuste: ottimo lavoro. |
| `moduleCompleteMessages` | `alto` | 5 | Punteggio alto: le parole di questo blocco le hai già in mano. |
| `moduleCompleteMessages` | `medio` | 1 | Buon punteggio, con qualche punto da ripassare quando vuoi. |
| `moduleCompleteMessages` | `medio` | 2 | Ci sei quasi: un altro passaggio sulle parole più incerte e sarà solido. |
| `moduleCompleteMessages` | `medio` | 3 | Bel lavoro nel complesso, vale la pena tornare sulle risposte sbagliate. |
| `moduleCompleteMessages` | `medio` | 4 | Sei sulla strada giusta — un ripasso mirato completa il quadro. |
| `moduleCompleteMessages` | `medio` | 5 | Discreto risultato, ripassa le parole più difficili e migliorerà ancora. |
| `moduleCompleteMessages` | `basso` | 1 | Va bene così, ora sai su cosa concentrarti nei prossimi ripassi. |
| `moduleCompleteMessages` | `basso` | 2 | Nessun problema: è normale all'inizio, il ripasso è pensato apposta per questo. |
| `moduleCompleteMessages` | `basso` | 3 | Ogni tentativo aiuta a fissare qualcosa in più — vale la pena rivedere queste parole. |
| `moduleCompleteMessages` | `basso` | 4 | Non è andata benissimo, ma è solo un punto di partenza: ripassiamo insieme. |
| `moduleCompleteMessages` | `basso` | 5 | Capita, specialmente all'inizio — tornaci sopra con calma quando vuoi. |
| `studioCompleteMessages` | `default` | 1 | Bel ripasso — ogni ascolto ripetuto ad alta voce lascia il segno. |
| `studioCompleteMessages` | `default` | 2 | Fatto: continuare a esercitarti così è esattamente il modo giusto. |
| `studioCompleteMessages` | `default` | 3 | Sessione completata — la pronuncia si allena anche così, un po' alla volta. |
| `studioCompleteMessages` | `default` | 4 | Ottimo: più lo ripeti, più ti resterà naturale. |
| `studioCompleteMessages` | `default` | 5 | Esercizio concluso — puoi sempre tornarci per un altro giro quando vuoi. |
| `storyCardsCompleteMessages` | `alto` | 1 | Le spiegazioni ti sono quasi tutte chiare: le strutture nuove stanno andando a segno. |
| `storyCardsCompleteMessages` | `alto` | 2 | Ottimo, hai capito quasi tutto al primo giro. |
| `storyCardsCompleteMessages` | `alto` | 3 | Le costruzioni di questo dialogo ti sono chiare fin da subito, complimenti. |
| `storyCardsCompleteMessages` | `alto` | 4 | Buon segno: capisci già bene perché le frasi si dicono così. |
| `storyCardsCompleteMessages` | `alto` | 5 | Quasi tutto chiaro al primo colpo — le strutture stanno entrando bene. |
| `storyCardsCompleteMessages` | `medio` | 1 | Buona parte delle spiegazioni ti è chiara, qualcuna la ripasserai con calma. |
| `storyCardsCompleteMessages` | `medio` | 2 | Ci sei quasi: qualche spiegazione va ripresa, il resto è già acquisito. |
| `storyCardsCompleteMessages` | `medio` | 3 | Bel lavoro nel complesso, con qualche struttura ancora da consolidare. |
| `storyCardsCompleteMessages` | `medio` | 4 | Sei sulla strada giusta — torna con calma sulle spiegazioni meno chiare. |
| `storyCardsCompleteMessages` | `medio` | 5 | Discreto risultato, alcune costruzioni meritano un altro sguardo. |
| `storyCardsCompleteMessages` | `basso` | 1 | Va bene così, capita che le spiegazioni servano più di un passaggio. |
| `storyCardsCompleteMessages` | `basso` | 2 | Nessun problema: sono concetti nuovi, ci vuole tempo per fissarli. |
| `storyCardsCompleteMessages` | `basso` | 3 | Non è andata benissimo, ma è un buon punto di partenza per riprenderle. |
| `storyCardsCompleteMessages` | `basso` | 4 | Capita, specialmente all'inizio — potrai rivederle con calma. |
| `storyCardsCompleteMessages` | `basso` | 5 | Ogni spiegazione riletta aiuta a fissare qualcosa in più. |
| `dialogoCompleteMessages` | `siLoSo` | 1 | Hai seguito tutto il dialogo con sicurezza — bel lavoro. |
| `dialogoCompleteMessages` | `siLoSo` | 2 | Lo conosci bene: si sente che l'hai ascoltato con attenzione. |
| `dialogoCompleteMessages` | `siLoSo` | 3 | Padronanza netta di questo dialogo, complimenti. |
| `dialogoCompleteMessages` | `siLoSo` | 4 | L'hai fatto tuo: pronuncia e ritmo erano solidi. |
| `dialogoCompleteMessages` | `siLoSo` | 5 | Dialogo acquisito — un buon passo avanti nel percorso. |
| `dialogoCompleteMessages` | `nonAncora` | 1 | Va bene rifarlo con calma: ogni ripasso aiuta a fissarlo meglio. |
| `dialogoCompleteMessages` | `nonAncora` | 2 | Nessuna fretta — puoi riascoltarlo quando vuoi, senza pressione. |
| `dialogoCompleteMessages` | `nonAncora` | 3 | Capita di non essere ancora sicuri: tornaci sopra con tranquillità. |
| `dialogoCompleteMessages` | `nonAncora` | 4 | Non è un problema rifare il dialogo, anzi è il modo migliore per impararlo. |
| `dialogoCompleteMessages` | `nonAncora` | 5 | Prenditi il tempo che serve: lo riascolterai volentieri la prossima volta. |
| `retryIntroMessages` | `first.titles` | 1 | Il quiz è finito |
| `retryIntroMessages` | `first.titles` | 2 | Primo giro completato |
| `retryIntroMessages` | `first.titles` | 3 | Hai finito il giro principale |
| `retryIntroMessages` | `first.titles` | 4 | Bene, si passa al ripasso |
| `retryIntroMessages` | `first.titles` | 5 | Round terminato |
| `retryIntroMessages` | `first.bodies` | 1 | Da qui in poi si ripassano solo le voci che ti sono sfuggite. |
| `retryIntroMessages` | `first.bodies` | 2 | Ora torniamo solo su quello che ti serve rivedere. |
| `retryIntroMessages` | `first.bodies` | 3 | Ripassiamo insieme solo le voci che non sono ancora andate a segno. |
| `retryIntroMessages` | `first.bodies` | 4 | Il resto è già acquisito: ci concentriamo solo su quello che manca. |
| `retryIntroMessages` | `first.bodies` | 5 | Ripasso mirato: solo le voci da rivedere, niente di più. |
| `retryIntroMessages` | `last.titles` | 1 | Ultimo ripasso |
| `retryIntroMessages` | `last.titles` | 2 | Ultimo giro |
| `retryIntroMessages` | `last.titles` | 3 | Ci siamo quasi, ultimo passaggio |
| `retryIntroMessages` | `last.titles` | 4 | Un'ultima ripassata |
| `retryIntroMessages` | `last.titles` | 5 | Ultimo richiamo |
| `retryIntroMessages` | `last.bodies` | 1 | Dopo questo giro si passa all'esercizio successivo. |
| `retryIntroMessages` | `last.bodies` | 2 | Finito questo ripasso, si va avanti con il prossimo esercizio. |
| `retryIntroMessages` | `last.bodies` | 3 | Ancora questo giro, poi si prosegue con il resto del percorso. |
| `retryIntroMessages` | `last.bodies` | 4 | Un'ultima volta su queste voci, poi via al prossimo esercizio. |
| `retryIntroMessages` | `last.bodies` | 5 | Completa questo giro e si passa oltre. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 1 | Episodio completato alla grande — tutti i moduli sono andati bene! |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 2 | Ottimo lavoro su tutto l'episodio, davvero solido dall'inizio alla fine. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 3 | Ce l'hai fatta su ogni modulo: complimenti per la costanza. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 4 | Episodio superato in pieno, senza punti deboli. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 5 | Un episodio impeccabile — hai il controllo di tutto quello che hai imparato. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 1 | Hai completato l'intero episodio, complimenti! |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 2 | Bel lavoro: hai portato a termine tutti i moduli dell'episodio. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 3 | Episodio finito, con buoni risultati su gran parte dei moduli. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 4 | Ottimo impegno su tutto l'episodio, si vede che hai lavorato bene. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 5 | Complimenti per aver completato l'intero episodio. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 1 | Se vuoi, un ripasso veloce sui moduli gialli non fa mai male. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 2 | Quando ti va, dai un'altra occhiata ai moduli da rivedere. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 3 | Nessuna fretta, ma un ripasso dei moduli gialli può aiutare. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 4 | I moduli da rivedere restano lì per quando avrai voglia di ripassarli. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 5 | Un ripasso dei moduli segnati in giallo, quando capita, li rende ancora più solidi. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 1 | Hai completato l'intero episodio, complimenti per esserci arrivato in fondo! |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 2 | Bel lavoro: hai portato a termine tutti i moduli, dall'inizio alla fine. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 3 | Episodio finito — non è per niente scontato arrivare fino in fondo. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 4 | Complimenti per aver completato tutto l'episodio. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 5 | Ottimo impegno: hai chiuso l'intero episodio. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 1 | Vale la pena rifare i moduli segnati in rosso: ti aiuteranno a fissare meglio queste parti. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 2 | I moduli in rosso meritano un altro giro: sono lì apposta per essere ripresi. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 3 | Conviene tornare sui moduli rossi quando puoi: aiuta più di quanto sembri. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 4 | Dai un'altra possibilità ai moduli rossi: rifarli è il modo più veloce per migliorarli. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 5 | I moduli rossi sono un buon punto da cui ripartire con un ripasso. |

---

## 4 — I TITOLI

*I testi che non stanno in una lista: ce n'è **uno solo per caso**, quindi si legge sempre quello.*

| Famiglia | Percorso | Testo |
|---|---|---|
| `valvolaSicurezzaMessages` | `nonRiuscita.title` | Tranquillo, capita! |
| `valvolaSicurezzaMessages` | `riuscita.title` | Ce l'hai fatta! |

---

## 5 — LE LISTE VUOTE

⚠️ **UNA LISTA VUOTA NON HA RIGHE NELLA SEZIONE 3, quindi senza questa sezione SPARIREBBE — e la
differenza fra «lista vuota» e «chiave che non c'è» la vede solo il codice che la legge.** *È la stessa
forma dello spazio ai bordi: un dato che non si vede.*

| Famiglia | Percorso |
|---|---|
| `episodeFinalMessages` | `tuttiVerdi.tip` |

⚠️ **E QUESTA VUOTA È UNA DOMANDA APERTA, NON UN FATTO DECISO:** i suoi due fratelli
(`gialloNoRosso.tip`, `almenoUnRosso.tip`) hanno **cinque** consigli ciascuno. *Può essere voluto — «a
chi ha tutto verde non c'è niente da consigliare» — o uno spazio mai riempito.* **Chi guida il progetto
decide.**

---

## 6 — DA RILEGGERE, E NON IN QUESTO GIRO

⚠️ **`studioCompleteMessages` parla di ascolto e pronuncia, ma la categoria `studio` contiene OTTO
moduli** — *Meet the Story, Repeat Aloud, Why We Say It, i due Match, le due Flash Card, Voice
Practice.* **In quattro di questi non si apre bocca.**

| # | Il testo | |
|---|---|---|
| 1 | *«ogni **ascolto ripetuto ad alta voce** lascia il segno»* | ⚠️ falso dopo un Match |
| 2 | *«continuare a esercitarti così è esattamente il modo giusto»* | ✅ va bene per tutti |
| 3 | *«la **pronuncia** si allena anche così»* | ⚠️ falso dopo una Flash Card |
| 4 | *«più lo **ripeti**, più ti resterà naturale»* | *regge, se «ripetere» vale anche per gli occhi* |
| 5 | *«puoi sempre tornarci per un altro giro»* | ✅ va bene per tutti |

🔴 **Ma prima di riscrivere serve una misura: quando compare `studioCompleteMessages`?** *Alla fine di
**ogni** modulo della categoria `studio`, o **una volta sola** alla fine del blocco?* **Se è il secondo,
lo studente ha davvero appena fatto Repeat Aloud e Voice Practice, e due dei cinque testi si salvano.**

⭐ *È la prima domanda che la colonna `categoria` della sezione 4 di `struttura-corso` rende possibile —
prima non si poteva nemmeno formulare.*
