# Messaggi di esito — inglese per italiani

**Il gemello di `data/inglese/it/inglese-it-messaggi-feedback.json`.** Questo file
**spiega e decide**, quel JSON **esegue** (CLAUDE.md regola 26). Sta accanto a
`inglese-it-istruzioni-moduli.md` e non dentro di lui: *quello e' il testo che dice
**come si usa** un modulo, questo quello che **risponde a un esito** — e la regola 8
li tiene in due file da prima che esistesse una fonte per nessuno dei due.*

⚠️ **NESSUNO AVEVA MAI RILETTO QUESTI TESTI.** Trovato il 2026-09-26 censendo
cio' che lo studente legge: **141 stringhe** senza nessuna fonte markdown.
*E sono i testi che pesano di piu': una spiegazione lunga si salta, un messaggio
di esito sbagliato si crede.*

⚠️ **QUASI TUTTO E' UNA LISTA DI CINQUE VARIANTI, e non e' un caso: l'app ne
pesca UNA.** Quindi lo studente che rifa' lo stesso modulo non rilegge la stessa
frase. *Ne segue una cosa da tenere a mente accorciando: **le cinque devono
restare cinque cose diverse**, non cinque modi di dire la stessa. Ridurne il
numero e' una scelta legittima, ma va detta: da tre in giu' si comincia a
riconoscerle.*

---

## 1 — COME SI LEGGE QUESTO FILE

**I titoli si cercano per TESTO ESATTO**: `##` + uno spazio + il testo della
colonna, col trattone `—` (U+2014) e uno spazio prima e uno dopo.

| Il testo dopo `## ` | Cosa ne nasce |
|---|---|
| `2 — LE FASCE` | `percentageRule` — la regola che decide QUALE gruppo di messaggi si pesca |
| `3 — I MESSAGGI` | tutte le liste di varianti: **un messaggio per riga** |
| `4 — I TITOLI` | i testi che non sono in una lista |
| `5 — LE LISTE VUOTE` | le liste che esistono e non hanno righe |

⚠️ **IL `## ` QUI SOPRA E' STACCATO APPOSTA:** se questa tabella scrivesse i titoli
per intero, una ricerca per sottostringa troverebbe **questa riga** invece della
sezione vera. *`grep -c '^## 3'` deve dare **1**.*

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423).** *Chi legge una
cella di tabella le toglie gli spazi ai lati — deve — quindi uno spazio ai bordi
sparirebbe **senza un errore**. Il segno si vede, lo spazio no.*

⚠️ **IL `#` DI UNA RIGA E' LA POSIZIONE NELLA LISTA, e conta**: e' la chiave della
mastery di nessuno, ma **e' l'ordine in cui l'app le pesca**. Togliere una riga in
mezzo rinumera quelle sotto, e va bene; cambiarne l'ordine senza motivo no.

### I numeri attesi

**Si contano sul contenuto prima di usarlo (regola 29): se non tornano, fermarsi.**

| Cosa | Quante |
|---|---|
| Famiglie di primo livello | **10** |
| Messaggi in lista (sezione 3) | **130** |
| Titoli fuori lista (sezione 4) | **2** |
| Voci della regola delle fasce (sezione 2) | **10** |
| Liste vuote (sezione 5) | **1** |
| **Stringhe in tutto il JSON** | **141** |

---

## 2 — LE FASCE

*`percentageRule`: la regola che, data la percentuale di risposte giuste, decide
QUALE gruppo della sezione 3 si pesca. **Non e' testo che lo studente legge** —
e' la logica scritta accanto ai testi che governa, e sta qui per questo.*

⚠️ **`showMessage` e' un BOOLEANO, non una parola:** va scritto `false` o `true`,
e la colonna «tipo» lo dice. *Una cella che dicesse «no» diventerebbe la stringa
`"no"`, che e' vera.*

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

*Un messaggio per riga. **Famiglia** -> la chiave di primo livello · **gruppo** ->
la fascia o il caso (`alto`/`medio`/`basso`, `riuscita`/`nonRiuscita`, ...) ·
**#** -> la posizione nella lista.*

**Quante ne ha ciascuna famiglia:**

| Famiglia | Messaggi | Gruppi | Chi la legge nel codice |
|---|---|---|---|
| `voiceCoachMessages` | **15** | `alto`, `basso`, `medio` | `app/voice.js:1016` |
| `speedRoundMessages` | **15** | `alto`, `basso`, `medio` | ⚠️ **NESSUNO** |
| `valvolaSicurezzaMessages` | **10** | `nonRiuscita.bodies`, `riuscita.bodies` | `app/ui-condivisa.js:873` |
| `moduleCompleteMessages` | **15** | `alto`, `basso`, `medio` | `app/flashcard.js:256`, `app/match.js:265`, `app/speedmatch.js:328`, `app/voice.js:617` |
| `studioCompleteMessages` | **5** | `default` | `app/repeataloud.js:179`, `app/storycards.js:322` |
| `storyCardsCompleteMessages` | **15** | `alto`, `basso`, `medio` | `app/storycards.js:320` |
| `dialogoCompleteMessages` | **10** | `nonAncora`, `siLoSo` | `app/dialogo.js:606` |
| `retryIntroMessages` | **20** | `first.bodies`, `first.titles`, `last.bodies`, `last.titles` | `app/ui-condivisa.js:125` |
| `episodeFinalMessages` | **25** | `almenoUnRosso.compliments`, `almenoUnRosso.tip`, `gialloNoRosso.compliments`, `gialloNoRosso.tip`, `tuttiVerdi.compliments` | ⚠️ **NESSUNO** |

⚠️ **LA COLONNA «CHI LA LEGGE» E' MISURATA DAL CODICE A OGNI GENERAZIONE, e
non e' un ornamento: dice se accorciare un messaggio si vede.** *Due famiglie
hanno zero lettori, e per due ragioni diverse — vedi la sezione 6.*

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
| `speedRoundMessages` | `alto` | 1 | Ottimo punteggio, hai davvero le idee chiare! |
| `speedRoundMessages` | `alto` | 2 | Wow, quasi tutte corrette! |
| `speedRoundMessages` | `alto` | 3 | Eccellente memoria! |
| `speedRoundMessages` | `alto` | 4 | Complimenti, sei quasi al massimo! |
| `speedRoundMessages` | `alto` | 5 | Fantastico lavoro su questo blocco. |
| `speedRoundMessages` | `medio` | 1 | Buon punteggio, si vede che stai imparando. |
| `speedRoundMessages` | `medio` | 2 | Bene così, continua a esercitarti. |
| `speedRoundMessages` | `medio` | 3 | Ci sei quasi: ripassa le parole che ti sono sfuggite. |
| `speedRoundMessages` | `medio` | 4 | Non male, un altro giro e migliori ancora. |
| `speedRoundMessages` | `medio` | 5 | Buon ritmo, tieni duro. |
| `speedRoundMessages` | `basso` | 1 | Va bene così, ora sai quali parole ripassare. |
| `speedRoundMessages` | `basso` | 2 | L'importante è essersi messi alla prova. |
| `speedRoundMessages` | `basso` | 3 | Ripasseremo insieme le parole più difficili. |
| `speedRoundMessages` | `basso` | 4 | È solo l'inizio, andrà meglio. |
| `speedRoundMessages` | `basso` | 5 | Nessun problema, il ripasso è fatto apposta per questo. |
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
| `moduleCompleteMessages` | `alto` | 5 | Punteggio alto, pronuncia e memoria sono già a buon punto. |
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

*I testi che non stanno in una lista: ce n'e' **uno solo per caso**, quindi si
legge sempre quello.*

| Famiglia | Percorso | Testo |
|---|---|---|
| `valvolaSicurezzaMessages` | `nonRiuscita.title` | Tranquillo, capita! |
| `valvolaSicurezzaMessages` | `riuscita.title` | Ce l'hai fatta! |

---

## 5 — LE LISTE VUOTE

⚠️ **UNA LISTA VUOTA NON HA RIGHE NELLA SEZIONE 3, quindi senza questa sezione
SPARIREBBE — e la differenza fra «lista vuota» e «chiave che non c'e'» la vede
solo il codice che la legge.** *E' la stessa forma dello spazio ai bordi: un dato
che non si vede.*

| Famiglia | Percorso |
|---|---|
| `episodeFinalMessages` | `tuttiVerdi.tip` |

⚠️ **QUESTA VUOTA E' VOLUTA, E C'E' UN TEST CHE LA DIFENDE.** Misurato il
2026-09-26: `tests/test_batch11.js` asserisce `finali.tuttiVerdi.tip.length === 0`
con la riga *«tuttiVerdi has NO tip (nessun consiglio)»*, e la riga accanto
pretende che gli altri due il consiglio ce l'abbiano. **Il disegno e': un
complimento SEMPRE, un consiglio SOLO quando c'e' qualcosa da rivedere.**

⚠️ **QUINDI RIEMPIRLA FAREBBE DUE DANNI, e il primo e' il piu' piccolo:** la
suite andrebbe **rossa**; e a chi ha fatto un episodio perfetto l'app direbbe
*«ripassa i moduli gialli»*, che e' **falso**. *La lista vuota non e' un buco:
e' il modo in cui «niente da consigliare» si scrive in una struttura che per
tutti gli altri casi un consiglio ce l'ha.*

---

## 6 — LE DUE FAMIGLIE CHE NESSUNO LEGGE

⚠️ **QUARANTA DELLE 141 STRINGHE DI QUESTO FILE OGGI NON LE VEDE NESSUNO,
e le due ragioni sono opposte.** *Misurato il 2026-09-26 cercando ogni famiglia
in `app/*.js` e scartando i commenti.*

| Famiglia | Stringhe | Perche' nessuno la legge | Cosa farne |
|---|---|---|---|
| `speedRoundMessages` | **15** | ⚠️ **DATO MORTO.** Speed Match esiste e funziona, ma `app/speedmatch.js:328` pesca da **`moduleCompleteMessages`**. *Il nome e' quello di prima della rinomina `speedRound` -> `speedMatch`: la famiglia porta il nome di un modulo che non si chiama piu' cosi', e il suo lettore non l'ha mai avuta.* | **da decidere:** cancellarla, oppure ricollegarla se Speed Match deve avere messaggi SUOI invece di quelli generici |
| `episodeFinalMessages` | **25** | **Aspetta un modulo che non esiste.** E' il **Test di verifica finale**, che `CLAUDE.md` elenca fra i *«previsti ma non ancora costruiti»* — e il blocco del test che ne guarda i dati si chiama apposta **«Modulo Finale prep»**. | **si tiene:** e' contenuto scritto in anticipo di proposito, non un residuo. *Accorciarla adesso e' lavoro che nessuno puo' collaudare* |

*La differenza fra le due sta in una domanda sola: **c'e' stato un lettore che
l'ha perso, o non c'e' ancora stato?** La prima e' un residuo, la seconda un
anticipo — e si somigliano solo guardando il conteggio.*
