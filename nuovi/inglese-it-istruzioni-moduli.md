# Istruzioni dei moduli — inglese per italiani

**Il gemello di `data/inglese/it/inglese-it-istruzioni-moduli.json`.** Questo file
**spiega e decide**, quel JSON **esegue** — la stessa coppia che
`inglese-it-struttura-corso.md` forma col suo JSON (CLAUDE.md regola 26).

⚠️ **PERCHE' UN FILE SUO E NON UNA SEZIONE DI `inglese-it-struttura-corso.md`.**
*La sezione 6 di quel file era la strada scelta a voce, e la misura l'ha
scartata per tre ragioni, non per gusto:*

| | |
|---|---|
| **① Un markdown, un JSON** | `inglese-it-struttura-corso.md` genera `inglese-it-struttura-corso.json`, uno a uno. Una sezione 6 dentro di lui dovrebbe generare **un altro file**, e `trascrivi.js` diventerebbe l'unico punto che sa che una fonte ne alimenta due — *una cosa che risponde a due domande da' la risposta giusta a una* |
| **② Sono due nature diverse, e la regola 8 le separa da prima** | quel JSON porta la **struttura** (gradi, categorie, sequenze, episodi); questo porta **i testi che lo studente legge**. Il primo non cambia quando si accorcia una frase; il secondo cambia solo per quello |
| **③ Quaranta testi non avrebbero avuto dove stare** | «una riga per modulo» copre 16 chiavi su 22. Le altre sei (`condivisi`, `voceShared`, `bloccoAscolto`, `dialogoShared`, `aiuto`, `erroreCaricamento`) non sono moduli e non hanno una riga-modulo: **qui hanno la sezione 6** |

*La tabella «una riga per modulo» che era prevista come sezione 6 esiste: e' la
**sezione 2** di questo file. Non e' cambiata l'idea, e' cambiato il file che la ospita.*

---

## 1 — COME SI LEGGE QUESTO FILE

**I titoli si cercano per TESTO ESATTO**, come in `inglese-it-struttura-corso.md`:
`##` + uno spazio + il testo della colonna, carattere per carattere, col trattone
`—` (U+2014) e uno spazio prima e uno dopo.

| Il testo dopo `## ` | Cosa ne nasce |
|---|---|
| `2 — LE SPIEGAZIONI` | `<kind>.howItWorks` — il popup «Spiegazione» |
| `3 — I PROMEMORIA` | `<kind>.helpReminder` — il pannello Help |
| `4 — I DUE CONSIGLI CONDIVISI` | il riquadro in coda alle spiegazioni, **non una chiave del JSON** |
| `5 — GLI ALTRI TESTI DI UN MODULO` | tutto il resto dentro una chiave di modulo |
| `6 — I TESTI CHE NON SONO DI UN MODULO` | le sei chiavi condivise |

⚠️ **IL `## ` QUI SOPRA E' STACCATO APPOSTA:** se questa tabella scrivesse i
titoli per intero, una ricerca per sottostringa troverebbe **questa riga** invece
della sezione vera, e leggerebbe come tabella dei testi il resto di questa tabella.
*La prova e' ripetibile: `grep -c '^## 2'` deve dare **1**.*

### I numeri attesi

**Si contano sul contenuto prima di usarli (regola 29): se non tornano, fermarsi.**

| Cosa | Quante |
|---|---|
| Spiegazioni (sezione 2) | **16** |
| Promemoria (sezione 3) | **16** |
| Consigli condivisi (sezione 4) | **2** |
| Altri testi di modulo (sezione 5) | **69** |
| Testi condivisi (sezione 6) | **75** |
| **Stringhe in tutto il JSON** | **208** |

⚠️ **UNA RIGA PER `kind`, NON PER PASSO.** I **22** passi di `narrativo-standard`
hanno **15** id distinti, e due di quelli — `flashcardAEngIta` e
`flashcardAItaEng` — condividono `kind: 'flashcard'`: **14 kind di modulo + 2
schermate = 16**. *La colonna «passi» dice quante volte quel testo compare in un
episodio: cambiarne uno cambia fino a tre schermate.*

⚠️ **`listaEpisodi` e `mappaEpisodio` NON SONO MODULI**, e restano qui lo stesso:
hanno una schermata loro, quindi hanno i loro due testi come tutti (regola 8).

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423), E NON E' UN VEZZO.**
*Chi legge una cella di tabella le toglie gli spazi ai lati — deve, altrimenti
l'allineamento della tabella finirebbe nel dato — quindi uno spazio ai bordi
sparirebbe **senza un errore**. Misurato: su 208 stringhe UNA ce l'ha,
`condivisi.rispostaCorretta` = `Risposta corretta:␣` — e senza quello spazio l'app
scrive «Risposta corretta:Hello» attaccato.* **Il segno si vede, lo spazio no.**

⚠️ **L'HTML NEL `corpo` E' VOLUTO E VA COPIATO COM'E'**: `<p>`, `<b>`, `<em>`.
L'app lo inserisce con `innerHTML`, quindi **togliere i tag vuol dire perdere i
capoversi**, non ripulire il testo.

---

## 2 — LE SPIEGAZIONI

*Il popup «Spiegazione», in alto in ogni modulo. Colonne: **kind** -> la chiave
del JSON · **titolo** -> `howItWorks.title` · **corpo** -> la prima parte di
`howItWorks.body` · **consiglio** -> quale riquadro della sezione 4 si attacca
in coda, `—` se nessuno · **coda** -> quello che viene DOPO il riquadro.*

⚠️ **IL CORPO E' SPEZZATO IN TRE PERCHE' IL CONSIGLIO E' RIPETUTO DODICI VOLTE.**
*Misurato: dodici dei sedici corpi finiscono con lo stesso riquadro, in **due**
varianti sole, sei volte ciascuna. Ricopiarlo in ogni riga vorrebbe dire dodici
copie da tenere allineate a mano — e accorciare il consiglio e' esattamente una
delle cose da fare.* **`corpo` + il riquadro di `consiglio` + `coda` ricostruisce
il `body` di oggi carattere per carattere**, e quella e' la prova che questa
divisione non cambia niente all'app.

| # | kind | Passi | Titolo | Corpo | Consiglio | Coda |
|---|---|---|---|---|---|---|
| 1 | `personalizzazione` | 1 | Your Story | <p>Qui puoi scegliere i nomi dei personaggi della storia, o lasciare quelli proposti — nessuna scelta è obbligatoria.</p><p>Tocca un campo per cambiarlo tra le opzioni disponibili, o il pulsante 'Reset' per tornare al valore di default.</p><p><b>Attenzione:</b> queste scelte valgono per TUTTO l'episodio — cambiarle a metà strada creerebbe confusione con quello che hai già esercitato. Se vuoi cambiarle dopo aver iniziato, dovrai rifare l'episodio da capo.</p><p>In fondo alla pagina trovi anche un modo per suggerirci nomi o parole che non trovi nelle liste.</p><p>Quando sei pronto, premi 'Inizia l'episodio'.</p> | — | — |
| 2 | `meetTheStory` | 1 | Meet the Story | <p>È il tuo primo incontro con la storia dell'episodio: qui si ascolta, non si studia.</p><p>Ogni battuta ha il pulsante 🔊 per sentirla, e puoi scegliere la velocità se va troppo veloce. La traduzione è già lì sotto, sempre visibile: a questo punto non hai ancora studiato niente, quindi non ha senso nasconderla.</p><p>Ascolta il dialogo tutte le volte che vuoi. Non devi ricordare niente adesso: le parole, le frasi e le regole arrivano nei moduli successivi.</p><p>Quando ti sei fatto un'idea della storia, premi "Ho finito".</p> | — | — |
| 3 | `repeatAloud` | 2 | Repeat Aloud | <p>Ascolta ogni parola con il pulsante 🔊 (puoi scegliere la velocità), leggi la traduzione e il suggerimento di pronuncia.</p><p>Ripeti più volte finché non ti sembra uguale. Non ti preoccupare se ti sembra diverso: è normale, stai imparando. Arriveranno successivamente esercizi in cui capiremo insieme se la tua pronuncia è corretta.</p><p>Poi passa alla successiva. Quando hai ripassato tutte le parole, premi "Ho finito, torna alla mappa".</p><p>Se non lo vuoi fare adesso, clicca semplicemente "Mappa".</p> | `consiglio-scrivere` | — |
| 4 | `matchEngIta` | 3 | Match Practice en→it | <p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta.</p><p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p><p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p> | `consiglio-scrivere` | — |
| 5 | `matchItaEng` | 3 | Match Practice it→en | <p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta.</p><p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p><p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p> | `consiglio-scrivere` | — |
| 6 | `flashcard` | 3 | Flash Card | <p>Guarda la parola sulla carta, ascoltala se vuoi.</p><p>Prima di girarla, prova a indovinarla — ragionaci un attimo, ma senza impazzire: se non sei sicuro, tocca semplicemente 'Non ancora', tanto tornerà come da Metodo Prette.</p><p>Poi toccala per girarla e vedere la traduzione.</p><p>Dopo averla girata, dicci se te la sei ricordata o no — se dici 'non ancora', te la riproporremo finché non la impari davvero.</p> | `consiglio-scrivere` | — |
| 7 | `voicePractice` | 2 | Voice Practice | <p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p><p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla.</p><p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Con "Esercitati ancora" puoi riprovare la stessa frase più volte — il contatore ti mostra sempre quante te ne restano; esaurite, si va avanti comunque.</p><p>Qui non c'è un ripasso finale delle frasi andate meno bene: è uno spazio libero per allenarti, non una verifica.</p> | `consiglio-a-tempo` | — |
| 8 | `whyWeSayIt` | 1 | Why We Say It | <p>Il dialogo lo conosci già: qui si guarda <em>perché</em> si dice così.</p><p>Su quasi ogni battuta trovi uno o più pulsanti con il nome di una regola. Al primo giro si aprono in ordine, una alla volta: leggila e poi dì se ti è chiara — non c'è una risposta giusta, serve solo a sapere cosa vale la pena rivedere. Dichiarata quella, si apre la successiva.</p><p>Puoi ascoltare ogni riga con il pulsante 🔊 (puoi scegliere la velocità) e aprire "Mostra traduzione" se ti serve una mano.</p><p>Quando le hai viste tutte, premi "Ho finito". Se devi interrompere, "Esci e riprendi dopo" tiene il punto in cui sei arrivato.</p> | `consiglio-scrivere` | — |
| 9 | `dialogoAscoltaRipeti` | 1 | Dialogue: Listen & Repeat | <p>Questo è il dialogo intero dell'episodio, dall'inizio alla fine.</p><p>Tocca una battuta qualsiasi per ascoltarla, poi ripetila ad alta voce. Puoi riascoltarla quante volte vuoi, e nell'ordine che preferisci.</p><p>La spunta verde ti ricorda quali battute hai già ascoltato.</p><p>Il pulsante in alto apre tutte le traduzioni insieme: usalo quando ti serve, e prova a usarlo sempre meno — è così che il cervello si abitua a leggere l'inglese senza appoggiarsi all'italiano.</p><p>Quando hai ascoltato tutte le battute, in fondo trovi la domanda finale.</p> | `consiglio-scrivere` | — |
| 10 | `dialogoRipetiATempo` | 1 | Dialogue: Repeat in Time | <p>Stesso dialogo di prima, ma questa volta con il tempo.</p><p>Tocca una battuta: la senti, e subito dopo parte una barra. Quella barra è il tuo turno — ripeti ad alta voce mentre scorre.</p><p>Mentre la battuta suona e mentre scorre la barra non puoi toccare nient'altro: serve a farti fare davvero l'esercizio, senza scappare avanti.</p><p>Qui non ci sono traduzioni: a questo punto dovresti già capire il dialogo. Se ti accorgi di non ricordarlo, torna un passaggio indietro e rifai "Ascolta e ripeti".</p><p>Sei tu a decidere quando passare alla battuta successiva.</p> | `consiglio-a-tempo` | <p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere. Fa la stessa cosa del pulsante "Prossima frase".</p> |
| 11 | `dialogoContinuo` | 1 | Dialogue: Real Dialogue | <p>Questa è la prova generale: il dialogo intero scorre da solo, dall'inizio alla fine, esattamente come lo sentirai in una conversazione vera.</p><p>Dopo un breve conto alla rovescia parte la prima battuta. La ascolti, ripeti ad alta voce mentre scorre la barra, e appena finisce parte da sola la battuta dopo — senza che tu debba toccare nulla.</p><p>Se hai bisogno di fermarti, usa il pulsante di pausa.</p><p>Se riesci a stare dietro al dialogo intero senza fermarti, sei pronto per il Test.</p> | `consiglio-a-tempo` | <p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere.</p> |
| 12 | `speedMatchEngIta` | 1 | Speed Match en→it | <p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p><p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | — |
| 13 | `speedMatchItaEng` | 1 | Speed Match it→en | <p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p><p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | — |
| 14 | `voiceCoach` | 1 | Voice Check | <p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p><p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla — prima di inviare puoi sempre cambiare idea.</p><p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Una sola registrazione conta per ogni frase: come sempre, a fine esercizio ti verranno riproposte le frasi andate meno bene, per una comprensione ottimale e duratura.</p> | `consiglio-a-tempo` | — |
| 15 | `listaEpisodi` | schermata | I tuoi episodi | <p>Questa è la lista degli episodi del corso, nell'ordine in cui si fanno.</p><p>Puoi aprire l'episodio attuale, o tornare su uno che hai già finito. Il successivo si sblocca quando hai completato <b>l'ultimo passaggio</b> di quello che stai facendo.</p> | — | — |
| 16 | `mappaEpisodio` | schermata | Mappa dell'episodio | <p>Questa è la mappa dell'episodio: mostra tutti i passaggi che farai, in ordine.</p><p>Puoi cliccare solo sul passaggio attuale (evidenziato) o tornare a rivedere uno già completato — non puoi saltare avanti a un passaggio non ancora sbloccato.</p><p>Completa un passaggio alla volta per avanzare nella storia.</p> | — | — |

---

## 3 — I PROMEMORIA

*Il pannello Help, voce «Rileggi le istruzioni». Stesse chiavi della sezione 2.*

| # | kind | Titolo | Corpo |
|---|---|---|---|
| 1 | `personalizzazione` | Come funziona, in breve | <p>Tocca un campo per personalizzarlo, o lascialo com'è. Le scelte valgono per tutto l'episodio — per cambiarle dopo, si riparte da capo. 'Reset' torna al default.</p> |
| 2 | `meetTheStory` | Come funziona, in breve | <p>Ascolta le battute con 🔊, alla velocità che preferisci. La traduzione è sempre visibile: qui serve capire la storia, non indovinarla.</p><p>Quando ti basta, premi "Ho finito".</p> |
| 3 | `repeatAloud` | Come funziona, in breve | <p>Premi 🔊 per ascoltare ogni parola (puoi scegliere la velocità 100/75/50%), poi ripetila ad alta voce. Leggi la traduzione e il suggerimento di pronuncia se ti serve.</p><p>Quando hai fatto tutta la lista, premi "Ho finito, torna alla mappa".</p> |
| 4 | `matchEngIta` | Come funziona, in breve | <p>Vedi la parola inglese, tocca la traduzione italiana corretta tra le 4 opzioni. Nessun tempo limite.</p><p>Le domande sbagliate torneranno a fine esercizio, finché non sono tutte corrette.</p> |
| 5 | `matchItaEng` | Come funziona, in breve | <p>Vedi la parola italiana, tocca la traduzione inglese corretta tra le 4 opzioni. Nessun tempo limite.</p><p>Le domande sbagliate torneranno a fine esercizio, finché non sono tutte corrette.</p> |
| 6 | `flashcard` | Come funziona, in breve | <p>Prova a indovinare la parola prima di girarla, poi tocca la carta per vedere la traduzione.</p><p>Dicci se la sapevi o no. Le carte che non sai tornano finché non le impari.</p> |
| 7 | `voicePractice` | Come funziona, in breve | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. Poi scegli se inviare o cancellare.</p><p>Guarda i colori e le stelle. "Esercitati ancora" per riprovare la stessa frase (il contatore mostra quante volte ti restano), "Avanti" per la prossima.</p> |
| 8 | `whyWeSayIt` | Come funziona, in breve | <p>Apri le regole una alla volta, nell'ordine in cui si presentano, e dopo ognuna dì se ti è chiara.</p><p>Quando le hai viste tutte, premi "Ho finito".</p> |
| 9 | `dialogoAscoltaRipeti` | Come funziona, in breve | <p>Tocca una battuta per ascoltarla, poi ripetila ad alta voce. Nessun tempo, nessun ordine obbligato.</p><p>Il pulsante in alto mostra e nasconde tutte le traduzioni.</p> |
| 10 | `dialogoRipetiATempo` | Come funziona, in breve | <p>Tocca una battuta, ascoltala, poi ripeti ad alta voce mentre scorre la barra.</p><p>Durante l'ascolto e la barra tutto il resto è bloccato. Finita la barra, tocca tu la battuta successiva.</p> |
| 11 | `dialogoContinuo` | Come funziona, in breve | <p>Parte da solo e va avanti da solo: ascolta ogni battuta e ripetila ad alta voce mentre scorre la barra.</p><p>Usa il pulsante di pausa se devi fermarti.</p> |
| 12 | `speedMatchEngIta` | Come funziona, in breve | <p>Vedi la parola inglese, tocca la traduzione italiana corretta tra le 4 opzioni prima che scada il tempo. "Non lo so" se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 13 | `speedMatchItaEng` | Come funziona, in breve | <p>Vedi la parola italiana, tocca la traduzione inglese corretta tra le 4 opzioni prima che scada il tempo. "Non lo so" se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 14 | `voiceCoach` | Come funziona, in breve | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. Prima di inviare puoi sempre cancellare e rifare la registrazione.</p><p>Dopo l'invio guarda i colori e le stelle, poi tocca "Avanti": una sola registrazione conta per frase, quelle andate meno bene torneranno a fine esercizio.</p> |
| 15 | `listaEpisodi` | Come funziona, in breve | <p>Apri l'episodio attuale, o uno già finito per rivederlo. Il successivo arriva quando chiudi l'ultimo passaggio di questo.</p> |
| 16 | `mappaEpisodio` | Come funziona, in breve | <p>Clicca sul passaggio attuale per iniziarlo, o su uno già completato per rivederlo. Niente salti in avanti.</p> |

---

## 4 — I DUE CONSIGLI CONDIVISI

*Non sono una chiave del JSON: sono il testo dentro il riquadro
`general-rule panel` che la sezione 2 attacca in coda a dodici spiegazioni.*

| id | Quante spiegazioni lo usano | Testo |
|---|---|---|
| `consiglio-scrivere` | **6** | Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico. |
| `consiglio-a-tempo` | **6** | Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo. |

**I quattro senza consiglio** sono `personalizzazione`, `meetTheStory` e le due
schermate: *due sono schermate, e due sono i moduli in cui non si esercita niente.*

---

## 5 — GLI ALTRI TESTI DI UN MODULO

*Tutto quello che sta dentro una chiave di modulo e non e' `howItWorks` ne'
`helpReminder`: le domande di un'autovalutazione, le righe che spiegano perche'
un pulsante e' spento, le etichette di un riquadro. Il **percorso** e' puntato
come nel JSON, e `[n]` e' la posizione in una lista.*

| kind | Percorso | Testo |
|---|---|---|
| `personalizzazione` | `pageDescription` | Personalizza gli episodi con le parole, i nomi e i luoghi legati alla tua vita reale — più sono vicini a te, più li ricorderai. Scegli tra le opzioni proposte, o lascia i valori di default. |
| `personalizzazione` | `requestBoxLabel` | Non trovi il nome, la città o la parola che ti serve? |
| `personalizzazione` | `requestBoxExample` | Esempio: se vai a Parigi invece che in Cina, scrivi "Parigi" nel campo Destinazione qui sotto — valuteremo di adattare il corso. |
| `personalizzazione` | `requestBoxDuplicateWarning` | Questa parola è già tra le opzioni disponibili — prova a selezionarla direttamente dal campo sopra. |
| `personalizzazione` | `midEpisodeWarning.title` | Stai per cancellare i tuoi progressi |
| `personalizzazione` | `midEpisodeWarning.body` | <p>Hai già iniziato questo episodio. Se cambi ora i nomi e i luoghi della storia, tutto quello che hai fatto finora smette di avere senso: si riferiva alle parole che stai per sostituire.</p><p>Per continuare, <b>perderai tutti i progressi fatti in questo episodio</b> — dovrai rifare da capo gli esercizi che avevi già completato.</p><p>Se sei sicuro, scrivi qui sotto esattamente la frase indicata e premi il pulsante.</p> |
| `personalizzazione` | `midEpisodeWarning.confirmPhrase` | cancella episodio |
| `personalizzazione` | `midEpisodeWarning.confirmLabel` | Scrivi "cancella episodio" per confermare |
| `personalizzazione` | `midEpisodeWarning.confirmButton` | Cancella i progressi e modifica |
| `personalizzazione` | `midEpisodeWarning.cancelButton` | Annulla, torna alla mappa |
| `personalizzazione` | `midEpisodeWarningTitle` | Attenzione |
| `personalizzazione` | `requestBoxSaved` | ✓ Richiesta salvata. Grazie! |
| `whyWeSayIt` | `completeHint` | Si attiva quando hai risposto a tutte le regole. |
| `whyWeSayIt` | `selfCheck.question` | Hai capito la spiegazione? |
| `whyWeSayIt` | `selfCheck.answers[0].value` | nonChiara |
| `whyWeSayIt` | `selfCheck.answers[0].button` | Non mi è chiara |
| `whyWeSayIt` | `selfCheck.answers[1].value` | nonAncora |
| `whyWeSayIt` | `selfCheck.answers[1].button` | Non ancora, la ripasserò |
| `whyWeSayIt` | `selfCheck.answers[2].value` | chiara |
| `whyWeSayIt` | `selfCheck.answers[2].button` | Sì, mi è chiara |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.title` | Va bene così |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[0]` | È normale non capire tutto subito: vai avanti con gli esercizi e torna qui più tardi. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[1]` | Nessun problema: certe regole si capiscono dopo averle incontrate qualche volta negli esercizi. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[2]` | Va bene così. Spesso è la pratica a far scattare la cosa, non la spiegazione. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[3]` | Capita a tutti. Prosegui: quando la ritroverai in una frase vera avrà più senso. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[4]` | Non fermarti qui. Questa regola tornerà, e la seconda volta è sempre più facile. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[5]` | Tranquillo: segnalarla come poco chiara serve proprio a ritrovarla dopo. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[6]` | Va benissimo dirlo. Le regole difficili sono quelle che poi si ricordano meglio. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[7]` | Nessuna fretta: continua con gli esercizi e rileggila tra qualche modulo. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[8]` | Succede. A volte serve solo sentire la frase qualche volta in più. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[9]` | Va bene. Prova ad ascoltare di nuovo la battuta: spesso la regola si sente prima di capirla. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[10]` | Non è un problema: nessuno impara una struttura nuova al primo colpo. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[11]` | Ci sta. Se resta poco chiara anche dopo gli esercizi, usa il tasto Help in alto. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[12]` | Va bene così: l'importante è che tu sappia che qui c'è qualcosa da recuperare. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[13]` | Nessun problema. Le regole si sistemano da sole man mano che le usi. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[14]` | Capita, e non vuol dire niente sul tuo inglese: vai avanti. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[15]` | Tranquillo. Alcune cose in inglese hanno senso solo dopo che le hai dette a voce. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[16]` | Va bene. Torna a questa card quando avrai fatto qualche esercizio in più. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[17]` | Nessuna fretta: questa regola tornerà negli episodi successivi. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[18]` | Succede, ed è utile saperlo: ora sai cosa ripassare. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[19]` | Va bene così. Meglio dirlo adesso che far finta di aver capito. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.title` | Nessun problema |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[0]` | Capita, tornaci con calma quando vuoi: la ripasserai più avanti. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[1]` | Va bene: sai dov'è, e puoi tornarci quando ti serve. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[2]` | Nessun problema. Segnata come da ripassare. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[3]` | Perfetto così: ripassare è parte del lavoro, non un ritardo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[4]` | D'accordo. La ritroverai qui quando vorrai rivederla. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[5]` | Va bene, la lasciamo in sospeso: resta a disposizione. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[6]` | Nessuna fretta: ci torni quando hai la testa più libera. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[7]` | Ottimo che tu l'abbia notato: ora sai cosa rivedere. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[8]` | Va bene. Intanto vai avanti, poi ripassi. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[9]` | Segnato. Questa card ti aspetta quando vuoi tornarci. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[10]` | Certo, con calma: nessuno ha fretta qui. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[11]` | Va bene così: metterla da parte è meglio che passarci sopra. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[12]` | D'accordo. Rileggerla tra qualche giorno funziona benissimo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[13]` | Nessun problema: la ripasserai quando la ritroverai in un esercizio. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[14]` | Va bene. Riconoscere cosa serve rivedere è già metà del lavoro. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[15]` | Perfetto. Continua, e torna qui quando ti va. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[16]` | Segnata. Puoi rivederla ogni volta che riapri questo modulo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[17]` | Va bene: meglio ripassare una volta in più che una in meno. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[18]` | D'accordo, la mettiamo in lista. Avanti con il prossimo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[19]` | Nessun problema: ci torni con calma, quando vuoi. |
| `whyWeSayIt` | `ruleKicker` | Nuova regola |
| `whyWeSayIt` | `noRuleHint` | Qui non c'è niente di nuovo: è solo la storia. |
| `whyWeSayIt` | `lockedHint` | Prima le regole qui sopra |
| `listaEpisodi` | `pageTitle` | I tuoi episodi |
| `listaEpisodi` | `pageSubtitle` | Completa un episodio per sbloccare il successivo. |
| `mappaEpisodio` | `pageTitle` | Mappa dell'episodio |
| `mappaEpisodio` | `pageSubtitle` | Completa i moduli in ordine per avanzare nella storia. |

---

## 6 — I TESTI CHE NON SONO DI UN MODULO

*Le sei chiavi condivise. **Nessuna ha `howItWorks` o `helpReminder`, e non e'
una dimenticanza:** non hanno una schermata propria da spiegare — `dialogoShared`
serve ai tre Dialogue che la schermata ce l'hanno, `condivisi` a tutti.*

⚠️ **`erroreCaricamento` e' il caso della regola 35:** i suoi testi vengono da
qui, ma **se il file che non si carica e' PROPRIO questo** non arrivano mai — per
questo nel codice esiste `LOAD_ERROR_LAST_RESORT`, l'unica frase scritta a mano
che la regola 8 ammette. *Accorciare questi testi non tocca quella frase.*

| Chiave | Percorso | Testo |
|---|---|---|
| `dialogoShared` | `choiceBoxHint` | Si attiva quando hai ascoltato tutte le battute del dialogo. |
| `dialogoShared` | `nextLineLabel` | Prossima frase |
| `dialogoShared` | `pauseLabel` | Pausa |
| `dialogoShared` | `choiceNotYet` | Non ancora |
| `dialogoShared` | `choiceKnown` | Sì, lo so |
| `dialogoShared` | `resumeLabel` | Riprendi |
| `dialogoShared` | `showTranslations` | Mostra traduzioni |
| `dialogoShared` | `hideTranslations` | Nascondi traduzioni |
| `erroreCaricamento` | `title` | Non riusciamo a caricare il contenuto |
| `erroreCaricamento` | `body` | <p>I contenuti di questo esercizio non sono arrivati. Quasi sempre è la connessione: aspetta un momento e riprova.</p><p>Se riprovando non cambia niente, torna alla mappa — i tuoi progressi sono salvati e non hai perso nulla.</p> |
| `erroreCaricamento` | `retryLabel` | Riprova |
| `erroreCaricamento` | `backLabel` | Torna alla mappa |
| `erroreCaricamento` | `resetLabel` | Ripristina i valori di partenza |
| `aiuto` | `menuTitle` | Hai bisogno di aiuto? |
| `aiuto` | `titolo` | Aiuto |
| `aiuto` | `optionInstructions` | Rivedi come funziona l'esercizio |
| `aiuto` | `optionClarify` | Vorrei capire questo |
| `aiuto` | `optionUrgent` | Sono veramente bloccato, Davide ho bisogno del tuo aiuto |
| `aiuto` | `formHintUrgent` | Scrivi cosa ti blocca: la tua richiesta verrà salvata come urgente. |
| `aiuto` | `formHintClarify` | Scrivi cosa non ti è chiaro. |
| `aiuto` | `formPlaceholder` | Scrivi qui... |
| `aiuto` | `formBack` | ← Indietro |
| `aiuto` | `formSubmit` | Invia |
| `aiuto` | `confirmationText` | ✓ Richiesta salvata. Grazie! |
| `aiuto` | `confirmationBack` | ← Torna al menu |
| `aiuto` | `titleInstructions` | Come funziona, in breve |
| `aiuto` | `titleUrgent` | Richiesta urgente |
| `aiuto` | `titleClarify` | Vorrei capire questo |
| `bloccoAscolto` | `listenLabel` | Ascolta |
| `bloccoAscolto` | `rateGroupLabel` | Velocità di riproduzione |
| `bloccoAscolto` | `rateButtonLabel` | Ascolta a velocità {pct} |
| `voceShared` | `recordStart` | Tocca per registrare |
| `voceShared` | `recordStop` | Tocca per fermare |
| `voceShared` | `silenceWarning` | Non ti abbiamo sentito: prova a parlare entro {secondi} secondi dall'avvio della registrazione. |
| `voceShared` | `retryPractice` | Esercitati ancora |
| `voceShared` | `retryCheck` | Riprova |
| `voceShared` | `transcriptPrefix` | Hai detto: |
| `voceShared` | `transcriptEmpty` | (nessun testo riconosciuto) |
| `voceShared` | `micNotice.level1.title` | Non riusciamo a sentirti |
| `voceShared` | `micNotice.level1.body` | Le ultime registrazioni non hanno rilevato nessuna parola. Controlla che il microfono sia collegato e che il browser abbia il permesso di usarlo, poi riprova. |
| `voceShared` | `micNotice.level1.actionLabel` |  |
| `voceShared` | `micNotice.level2.title` | Ancora nessun audio |
| `voceShared` | `micNotice.level2.body` | Il microfono continua a non registrare nulla. Prova a ricominciare l'esercizio: a volte basta riaprirlo perché il browser richieda di nuovo il permesso. |
| `voceShared` | `micNotice.level2.actionLabel` | Ricomincia esercizio |
| `voceShared` | `micNotice.level3.title` | Il microfono non sta funzionando |
| `voceShared` | `micNotice.level3.body` | Dopo diversi tentativi non abbiamo ancora sentito nulla: molto probabilmente è un problema del microfono o dei permessi, non della tua pronuncia. Puoi tornare alla mappa e riprovare più tardi. |
| `voceShared` | `micNotice.level3.actionLabel` | Torna alla mappa |
| `voceShared` | `attemptLabel` | TENTATIVO {n} DI {tot} |
| `condivisi` | `introDontShowAgain` | Non mostrarmi più questa schermata |
| `condivisi` | `introStart` | Ho capito, inizia |
| `condivisi` | `readyTitle` | Pronto? |
| `condivisi` | `readyStart` | Pronto? Via! |
| `condivisi` | `spiegazione` | Spiegazione |
| `condivisi` | `help` | Help |
| `condivisi` | `tornaAllaMappa` | ← Mappa |
| `condivisi` | `tornaAllaHome` | ← Home |
| `condivisi` | `hoFinito` | Ho finito |
| `condivisi` | `esciRiprendiDopo` | Esci e riprendi dopo |
| `condivisi` | `nonLoSo` | Non lo so |
| `condivisi` | `avanti` | Avanti → |
| `condivisi` | `attesa` | Sto preparando il corso… |
| `condivisi` | `ripasso` | Ripasso |
| `condivisi` | `caricamento` | Caricamento... |
| `condivisi` | `chiudi` | Chiudi |
| `condivisi` | `mostraPronuncia` | Mostra pronuncia |
| `condivisi` | `riprovaAncora` | Riprova ancora |
| `condivisi` | `vaiAvanti` | Vai avanti → |
| `condivisi` | `iniziaEpisodio` | Inizia l'episodio |
| `condivisi` | `personalizzaSottotitolo` | Personalizza la tua storia o lascia così. |
| `condivisi` | `repeatAloudSottotitolo` | Ascolta ogni parola o frase, ripetila ad alta voce. |
| `condivisi` | `rispostaCorretta` | Risposta corretta:␣ |
| `condivisi` | `nascondiPronuncia` | Nascondi pronuncia |
| `condivisi` | `salutoHome` | Ciao, {nome}! |
| `condivisi` | `iniziaEpisodioNominato` | Inizia {episodio} |
| `condivisi` | `tuoiEpisodi` | I tuoi episodi |
