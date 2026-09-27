**Versione: 20260927a**

# `it-istruzioni-moduli` — sezioni 2 e 3 riscritte

> **Sostituisce le sezioni 2 e 3 del file.** Le sezioni **1, 4, 5 e 6 non sono toccate** — e non le
> ricopio qui di proposito: ricopiare 144 righe che non cambiano è il modo più sicuro di cambiarne
> una per sbaglio.

---

## COSA CAMBIA, E COSA NO

| | |
|---|---|
| **La colonna `coda` sparisce** | *le sue due righe erano quasi la stessa frase, e dicevano una **scorciatoia**. Chi apre la spiegazione la prima volta non ha ancora finito di ripetere niente; chi cerca una scorciatoia è al terzo giro.* **Sono passate nei promemoria** |
| **Nasce la colonna `video`** | *il testo che verrà letto nel video del modulo. **Vuota per ora**: si riempie quando si fanno i video, e sta qui perché il copione del video e la spiegazione scritta non devono divergere* |
| **`corpo` + riquadro NON ricostruisce più il `body` di oggi** | ⚠️ **è il punto in cui smettiamo di essere a somma zero e cominciamo a cambiare quello che lo studente legge.** *Fino a ieri la prova era «carattere per carattere»; da qui il test di andata e ritorno verifica il markdown contro il JSON nuovo, non contro quello vecchio* |
| **Le stringhe restano 208** | *32 spiegazioni + 32 promemoria + 69 + 75. Nessuna chiave nasce, nessuna muore: due testi si spostano da `howItWorks.body` a `helpReminder.body`* |
| ⚠️ **E IL FILE CAMBIA NOME: `inglese-it-istruzioni-moduli` → `it-istruzioni-moduli`** | *questi testi **non dipendono dalla lingua che si insegna: dipendono dalla lingua dello STUDENTE**. «Tocca il microfono per registrare» è identico in `inglese/it` e in `spagnolo/it`.* **Copiarli per edizione vorrebbe dire 349 stringhe duplicate ogni volta** — con quattro edizioni per italiani, **1047 copie che nessuno riallineerebbe.** *Lo stesso vale per `messaggi-feedback` → `it-messaggi-feedback`* |
| **E le dieci frasi che nominavano la lingua sono diventate neutre** | *«Vedi una parola in **inglese** e 4 traduzioni in **italiano**» → **«Vedi una parola e quattro traduzioni»**.* **La direzione è già nel titolo del modulo** — «Match Practice en→it» — *quindi ripeterla nel corpo era ridondanza, non informazione. Zero segnaposti, zero codice, e un altro pezzo di testo in meno* |

### La regola che ha guidato il taglio

> **La spiegazione dice cosa devi fare la prima volta. Il promemoria dice come farlo meglio o più
> veloce.**

**Applicandola si vede perché i testi erano lunghi: dentro le spiegazioni c'era materiale da seconda
volta.** *Il contatore dei tentativi, «si ferma anche da solo se resti in silenzio», «esaurite si va
avanti comunque», le scorciatoie.* **Non è stato tagliato: è stato spostato dove serve.**

⚠️ **E una cosa è stata aggiunta, non togliuta: `voicePractice` e `voiceCoach` avevano due
spiegazioni quasi identiche, e la differenza fra i due moduli era sepolta in una frase in fondo.**
*Adesso è la frase in grassetto di ognuno: **uno è allenamento, l'altro è verifica**. Era l'unica
cosa che uno studente doveva capire, ed era l'ultima riga del testo più lungo.*

---

## 2 — LE SPIEGAZIONI

*Il popup «Spiegazione», in alto in ogni modulo. Colonne: **kind** → la chiave del JSON · **titolo**
→ `howItWorks.title` · **corpo** → la prima parte di `howItWorks.body` · **consiglio** → quale
riquadro della sezione 4 si attacca in coda, `—` se nessuno · **video** → il copione del video di
questo modulo.*

⚠️ **IL CORPO È SPEZZATO PERCHÉ IL CONSIGLIO È RIPETUTO DODICI VOLTE**, in due varianti sole, sei
ciascuna. *Ricopiarlo in ogni riga vorrebbe dire dodici copie da tenere allineate a mano.*

⚠️ **L'HTML VA COPIATO COM'È**: `<p>`, `<b>`, `<em>`. *L'app lo inserisce con `innerHTML`: togliere i
tag vuol dire perdere i capoversi, non ripulire il testo.*

| # | kind | Passi | Titolo | Corpo | Consiglio | Video |
|---|---|---|---|---|---|---|
| 1 | `personalizzazione` | 1 | Your Story | <p>Qui scegli i nomi dei personaggi della storia — o lasci quelli proposti: nessuna scelta è obbligatoria.</p><p>Tocca un campo per cambiarlo.</p><p><b>Queste scelte valgono per tutto il livello, non solo per questo episodio.</b> Puoi cambiarle più avanti, ma quello che hai già studiato parlava dei nomi di prima.</p><p>Quando sei pronto, premi «Inizia l'episodio».</p> | — | · |
| 2 | `meetTheStory` | 1 | Meet the Story | <p>È il tuo primo incontro con la storia: qui si ascolta, non si studia.</p><p>Tocca 🔊 su ogni battuta per sentirla. La traduzione è già sotto, sempre visibile — non hai ancora studiato niente, quindi non ha senso nasconderla.</p><p>Ascolta quante volte vuoi. <b>Non devi ricordare niente adesso:</b> le parole, le frasi e le regole arrivano dopo.</p><p>Quando ti sei fatto un'idea della storia, premi «Ho finito».</p> | — | · |
| 3 | `repeatAloud` | 2 | Repeat Aloud | <p>Ascolta ogni parola con 🔊, leggi la traduzione e il suggerimento di pronuncia.</p><p>Ripeti ad alta voce finché non ti sembra uguale. <b>Se ti sembra diverso è normale:</b> più avanti ci sono esercizi che ti dicono se la pronuncia è giusta.</p><p>Quando hai ripassato tutte le parole, premi «Ho finito, torna alla mappa».</p> | `consiglio-scrivere` | · |
| 4 | `matchEngIta` | 3 | Match Practice en→it | <p>Vedi una parola in inglese e quattro traduzioni italiane — tocca quella giusta.</p><p><b>Qui non c'è tempo limite:</b> prenditi il momento che ti serve per ragionarci.</p><p>Le parole che sbagli tornano a fine esercizio, finché non sono tutte giuste.</p> | `consiglio-scrivere` | · |
| 5 | `matchItaEng` | 3 | Match Practice it→en | <p>Vedi una parola in italiano e quattro traduzioni inglesi — tocca quella giusta.</p><p><b>Qui non c'è tempo limite:</b> prenditi il momento che ti serve per ragionarci.</p><p>Le parole che sbagli tornano a fine esercizio, finché non sono tutte giuste.</p> | `consiglio-scrivere` | · |
| 6 | `flashcard` | 3 | Flash Card | <p>Guarda la parola sulla carta, e ascoltala se vuoi.</p><p>Prima di girarla prova a indovinarla — senza impazzire: se non sei sicuro tocca «Non ancora», tanto tornerà.</p><p>Poi tocca la carta per girarla, e dicci se te la ricordavi.</p><p><b>Le carte che non sai tornano finché non le impari davvero.</b></p> | `consiglio-scrivere` | · |
| 7 | `voicePractice` | 2 | Voice Practice | <p>Leggi la frase in italiano, ascolta il modello inglese con 🔊, poi tocca il microfono per registrare.</p><p>Tocca di nuovo per fermarti, e scegli se inviare la registrazione o cancellarla e rifarla.</p><p>Dopo l'invio ogni parola si colora: <b>verde</b> se corretta, <b>giallo</b> se simile, <b>rosso</b> se da rivedere, con un punteggio a stelle.</p><p><b>Qui ti alleni, non vieni valutato:</b> puoi riprovare la stessa frase più volte.</p> | `consiglio-a-tempo` | · |
| 8 | `whyWeSayIt` | 1 | Why We Say It | <p>Il dialogo lo conosci già: qui si guarda <em>perché</em> si dice così.</p><p>Su quasi ogni battuta trovi uno o più pulsanti col nome di una regola. Si aprono in ordine, una alla volta: leggila e poi dì se ti è chiara — <b>non c'è una risposta giusta</b>, serve solo a sapere cosa vale la pena rivedere.</p><p>Quando le hai viste tutte, premi «Ho finito».</p> | `consiglio-scrivere` | · |
| 9 | `dialogoAscoltaRipeti` | 1 | Dialogue: Listen & Repeat | <p>Questo è il dialogo intero dell'episodio, dall'inizio alla fine.</p><p>Tocca una battuta per ascoltarla, poi ripetila ad alta voce. Quante volte vuoi, nell'ordine che preferisci.</p><p>Il pulsante in alto apre tutte le traduzioni insieme: <b>usalo quando ti serve, e prova a usarlo sempre meno</b> — è così che il cervello impara a leggere l'inglese senza appoggiarsi all'italiano.</p><p>Quando hai ascoltato tutte le battute, in fondo trovi la domanda finale.</p> | `consiglio-scrivere` | · |
| 10 | `dialogoRipetiATempo` | 1 | Dialogue: Repeat in Time | <p>Stesso dialogo di prima, questa volta con il tempo.</p><p>Tocca una battuta: la senti, poi parte una barra. <b>Quella barra è il tuo turno</b> — ripeti ad alta voce mentre scorre.</p><p>Qui non ci sono traduzioni: a questo punto il dialogo dovresti già capirlo. Se non è così, torna a «Ascolta e ripeti».</p><p>Passi alla battuta successiva quando vuoi tu.</p> | `consiglio-a-tempo` | · |
| 11 | `dialogoContinuo` | 1 | Dialogue: Real Dialogue | <p>Questa è la prova generale: il dialogo scorre da solo, dall'inizio alla fine, come lo sentirai in una conversazione vera.</p><p>Dopo un breve conto alla rovescia parte la prima battuta. La ascolti, ripeti ad alta voce mentre scorre la barra, e appena finisce parte da sola quella dopo.</p><p>Se devi fermarti, usa il pulsante di pausa.</p><p><b>Se riesci a starci dietro senza fermarti, sei pronto per il Test.</b></p> | `consiglio-a-tempo` | · |
| 12 | `speedMatchEngIta` | 1 | Speed Match en→it | <p>Vedi una parola in inglese e quattro traduzioni italiane — tocca quella giusta prima che scada il tempo, o «Non lo so» se non la ricordi.</p><p><b>L'obiettivo non è la velocità, è la correttezza.</b> Se sbagli ti mostriamo la risposta giusta: leggila e memorizzala, perché ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | · |
| 13 | `speedMatchItaEng` | 1 | Speed Match it→en | <p>Vedi una parola in italiano e quattro traduzioni inglesi — tocca quella giusta prima che scada il tempo, o «Non lo so» se non la ricordi.</p><p><b>L'obiettivo non è la velocità, è la correttezza.</b> Se sbagli ti mostriamo la risposta giusta: leggila e memorizzala, perché ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | · |
| 14 | `voiceCoach` | 1 | Voice Check | <p>Leggi la frase in italiano, ascolta il modello inglese con 🔊, poi tocca il microfono per registrare.</p><p>Tocca di nuovo per fermarti, e scegli se inviare o cancellare e rifare.</p><p>Dopo l'invio ogni parola si colora — verde, giallo o rosso — con un punteggio a stelle.</p><p><b>Qui conta una registrazione sola per frase: è una verifica, non un allenamento.</b> Le frasi andate meno bene tornano a fine esercizio.</p> | `consiglio-a-tempo` | · |
| 15 | `listaEpisodi` | schermata | I tuoi episodi | <p>Questa è la lista degli episodi del corso, nell'ordine in cui si fanno.</p><p>Puoi aprire l'episodio attuale, o tornare su uno che hai già finito.</p><p>Il successivo si sblocca quando completi <b>l'ultimo passaggio</b> di quello che stai facendo.</p> | — | · |
| 16 | `mappaEpisodio` | schermata | Mappa dell'episodio | <p>Questa è la mappa dell'episodio: tutti i passaggi che farai, in ordine.</p><p>Puoi toccare il passaggio attuale, quello evidenziato, o tornare su uno già completato. <b>Non puoi saltare avanti.</b></p> | — | · |

---

## 3 — I PROMEMORIA

*Il pannello Help, voce «Rivedi come funziona l'esercizio». Stesse chiavi della sezione 2.*

⚠️ **QUI STA QUELLO CHE SERVE DAL SECONDO GIRO IN POI:** *le scorciatoie, i contatori, cosa succede
quando l'app si ferma da sola, perché un pulsante è spento.* **Le due righe che erano nella colonna
`coda` sono finite qui — 10 e 11.**

| # | kind | Titolo | Corpo |
|---|---|---|---|
| 1 | `personalizzazione` | Come funziona, in breve | <p>Tocca un campo per personalizzarlo, o lascialo com'è. «Reset» torna ai valori di partenza.</p><p>Le scelte valgono per tutto il livello: per cambiarle dopo aver iniziato un episodio, quell'episodio si rifà da capo.</p><p>In fondo alla pagina puoi suggerirci nomi o parole che non trovi nelle liste.</p> |
| 2 | `meetTheStory` | Come funziona, in breve | <p>Ascolta le battute con 🔊, alla velocità che preferisci (100/75/50%). La traduzione è sempre visibile: qui serve capire la storia, non indovinarla.</p><p>Quando ti basta, premi «Ho finito».</p> |
| 3 | `repeatAloud` | Come funziona, in breve | <p>Premi 🔊 per ascoltare ogni parola (velocità 100/75/50%), poi ripetila ad alta voce. Leggi la traduzione e il suggerimento di pronuncia se ti serve.</p><p>Quando hai fatto tutta la lista, premi «Ho finito, torna alla mappa». Se non vuoi farlo adesso, tocca «Mappa».</p> |
| 4 | `matchEngIta` | Come funziona, in breve | <p>Vedi la parola inglese, tocca la traduzione italiana corretta tra le quattro. Nessun tempo limite.</p><p>Le domande sbagliate tornano a fine esercizio, finché non sono tutte corrette.</p> |
| 5 | `matchItaEng` | Come funziona, in breve | <p>Vedi la parola italiana, tocca la traduzione inglese corretta tra le quattro. Nessun tempo limite.</p><p>Le domande sbagliate tornano a fine esercizio, finché non sono tutte corrette.</p> |
| 6 | `flashcard` | Come funziona, in breve | <p>Prova a indovinare la parola prima di girarla, poi tocca la carta per vedere la traduzione.</p><p>Dicci se la sapevi o no. Le carte che non sai tornano finché non le impari.</p> |
| 7 | `voicePractice` | Come funziona, in breve | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. <b>Si ferma anche da solo</b> se resti in silenzio o se superi il tempo massimo. Poi scegli se inviare o cancellare.</p><p>Guarda i colori e le stelle. «Esercitati ancora» per riprovare la stessa frase — il contatore mostra quante volte ti restano, e quando finiscono si va avanti comunque.</p><p>Qui non c'è un ripasso finale: è uno spazio libero per allenarti.</p> |
| 8 | `whyWeSayIt` | Come funziona, in breve | <p>Apri le regole una alla volta, nell'ordine in cui si presentano, e dopo ognuna dì se ti è chiara. Il pulsante finale si accende quando hai risposto a tutte.</p><p>Quando le hai viste tutte, premi «Ho finito». Se devi interrompere, «Esci e riprendi dopo» tiene il punto in cui sei arrivato.</p> |
| 9 | `dialogoAscoltaRipeti` | Come funziona, in breve | <p>Tocca una battuta per ascoltarla, poi ripetila ad alta voce. Nessun tempo, nessun ordine obbligato.</p><p>La spunta verde ti ricorda quali hai già ascoltato. Il pulsante in alto mostra e nasconde tutte le traduzioni.</p> |
| 10 | `dialogoRipetiATempo` | Come funziona, in breve | <p>Tocca una battuta, ascoltala, poi ripeti ad alta voce mentre scorre la barra. Durante l'ascolto e la barra tutto il resto è bloccato: serve a farti fare davvero l'esercizio.</p><p><b>Scorciatoia:</b> mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine — fa la stessa cosa del pulsante «Prossima frase».</p> |
| 11 | `dialogoContinuo` | Come funziona, in breve | <p>Parte da solo e va avanti da solo: ascolta ogni battuta e ripetila ad alta voce mentre scorre la barra. Usa il pulsante di pausa se devi fermarti.</p><p><b>Scorciatoia:</b> mentre scorre la barra puoi toccare la battuta per passare subito alla successiva.</p> |
| 12 | `speedMatchEngIta` | Come funziona, in breve | <p>Vedi la parola inglese, tocca la traduzione italiana corretta tra le quattro prima che scada il tempo. «Non lo so» se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 13 | `speedMatchItaEng` | Come funziona, in breve | <p>Vedi la parola italiana, tocca la traduzione inglese corretta tra le quattro prima che scada il tempo. «Non lo so» se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 14 | `voiceCoach` | Come funziona, in breve | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. Prima di inviare puoi sempre cancellare e rifare.</p><p>Dopo l'invio guarda i colori e le stelle, poi tocca «Avanti». <b>Una sola registrazione conta per frase:</b> quelle andate meno bene tornano a fine esercizio.</p> |
| 15 | `listaEpisodi` | Come funziona, in breve | <p>Apri l'episodio attuale, o uno già finito per rivederlo. Il successivo arriva quando chiudi l'ultimo passaggio di questo.</p> |
| 16 | `mappaEpisodio` | Come funziona, in breve | <p>Tocca il passaggio attuale per iniziarlo, o uno già completato per rivederlo. Niente salti in avanti.</p> |

---

## I NUMERI ATTESI — invariati

| Cosa | Quante |
|---|---|
| Spiegazioni (sezione 2) | **16** → 32 stringhe |
| Promemoria (sezione 3) | **16** → 32 stringhe |
| Consigli condivisi (sezione 4) | **2** — *non sono chiavi del JSON* |
| Altri testi di modulo (sezione 5) | **69** |
| Testi condivisi (sezione 6) | **75** |
| **Stringhe in tutto il JSON** | **208** |

⚠️ **Nessuna chiave nasce e nessuna muore.** *Due testi si spostano da `howItWorks.body` a
`helpReminder.body`, e il conto non cambia: è la prova che questo giro tocca il contenuto e non la
forma.*

---

## LE TRE COSE DA CHIEDERE PRIMA DI TRASCRIVERE

**① Il valore di personalizzazione ha un ambito?** *La spiegazione di `personalizzazione` adesso dice
«valgono per tutto il livello». Il testo di prima diceva «per tutto l'episodio».* ⚠️ **Se il valore è
uno solo per studente, la frase giusta è «per tutto il corso» e va deciso cosa succede a chi parte
dall'A2** — *che è come se l'edizione ricominciasse, e dovrebbe poter scegliere nomi nuovi.*

**② «Non mostrarmi più questa schermata» dal secondo passaggio, non dal primo.** *Oggi si può zittire
la spiegazione senza averla letta — ed è il modo in cui un utente vero si è bloccato.*

**③ Il test di andata e ritorno cambia riferimento.** *Fino a ieri la prova era «`corpo` + riquadro +
`coda` ricostruisce il `body` di oggi, carattere per carattere». Da questo file in poi il JSON si
allinea al markdown, non viceversa.* **La prova diventa: rigenerare il JSON dal markdown e
riottenere 208 stringhe, con questi testi.**
