**Versione: 20261007a**

# Istruzioni dei moduli — per chi studia in italiano

**Il gemello di `data/condivisi/it/it-istruzioni-moduli.json`.** Questo file **spiega e decide**, quel
JSON **esegue** — la stessa coppia che `inglese-it-struttura-corso.md` forma col suo JSON
(`CLAUDE.md` regola 26).

⚠️ **IL FILE HA CAMBIATO NOME E POSTO IL 2026-09-28:** *`inglese-it-istruzioni-moduli` →
**`it-istruzioni-moduli`**, e da `data/inglese/it/` a **`data/condivisi/it/`**.*

**Perché:** *questi testi **non dipendono dalla lingua che si insegna: dipendono dalla lingua dello
STUDENTE**. «Tocca il microfono per registrare» è identico in `inglese/it` e in `spagnolo/it`.*
**Copiarli per edizione vorrebbe dire duplicare TUTTE le loro stringhe ogni volta** — *e con quattro
edizioni per italiani, quattro volte tante copie che nessuno riallineerebbe.*

⚠️ **E IL CONTO NON STA PIÙ SCRITTO QUI, DI PROPOSITO.** *Vive in un posto solo, con la sua data:
`CLAUDE.md`, regola 8.* 🔴 **Il 2026-10-07 il numero vecchio — «349 … 1047» — si è trovato ricopiato in
DIECI file**, *e nessuno dei dieci sapeva di essere scaduto dal 28 settembre.*

> ⭐ **Un numero ricopiato invecchia in dieci posti. Uno datato invecchia in uno** (regola 48).

⚠️ **E la cartella, non solo il nome:** *sta **accanto** alle edizioni, mai dentro a una. Il momento in
cui questo file sta dentro `inglese/` è il momento in cui lo spagnolo lo duplica.* **Il nome tiene `it`
anche stando in una cartella `it/`: un file deve dirsi da solo, senza dipendere da dove sta.**

⚠️ **PERCHÉ UN FILE SUO E NON UNA SEZIONE DI `inglese-it-struttura-corso.md`.** *La sezione 6 di quel
file era la strada scelta a voce, e la misura l'ha scartata per tre ragioni, non per gusto:*

| | |
|---|---|
| **① Un markdown, un JSON** | `inglese-it-struttura-corso.md` genera `inglese-it-struttura-corso.json`, uno a uno. Una sezione 6 dentro di lui dovrebbe generare **un altro file**, e `trascrivi.js` diventerebbe l'unico punto che sa che una fonte ne alimenta due — *una cosa che risponde a due domande dà la risposta giusta a una* |
| **② Sono due nature diverse, e la regola 8 le separa da prima** | quel JSON porta la **struttura** (gradi, categorie, sequenze, episodi); questo porta **i testi che lo studente legge**. Il primo non cambia quando si accorcia una frase; il secondo cambia solo per quello |
| **③ Quaranta testi non avrebbero avuto dove stare** | «una riga per modulo» copre 16 chiavi su 22. Le altre sei (`condivisi`, `voceShared`, `bloccoAscolto`, `dialogoShared`, `aiuto`, `erroreCaricamento`) non sono moduli e non hanno una riga-modulo: **qui hanno la sezione 6** |

---

## 1 — COME SI LEGGE QUESTO FILE

**I titoli si cercano per TESTO ESATTO**, come in `inglese-it-struttura-corso.md`: `##` + uno spazio +
il testo della colonna, carattere per carattere, col trattone `—` (U+2014) e uno spazio prima e uno
dopo.

| Il testo dopo `## ` | Cosa ne nasce |
|---|---|
| `2 — LE SPIEGAZIONI` | `<kind>.howItWorks` — il popup «Spiegazione» |
| `3 — I PROMEMORIA` | `<kind>.helpReminder` — il pannello Help |
| `4 — I DUE CONSIGLI CONDIVISI` | il riquadro in coda alle spiegazioni, **non una chiave del JSON** |
| `5 — GLI ALTRI TESTI DI UN MODULO` | tutto il resto dentro una chiave di modulo |
| `6 — I TESTI CHE NON SONO DI UN MODULO` | le sei chiavi condivise |

⚠️ **IL `## ` QUI SOPRA È STACCATO APPOSTA:** se questa tabella scrivesse i titoli per intero, una
ricerca per sottostringa troverebbe **questa riga** invece della sezione vera, e leggerebbe come
tabella dei testi il resto di questa tabella. *La prova è ripetibile: `grep -c '^## 2'` deve dare **1**.*

### ⚠️ ① I TITOLI NON SI SCRIVONO PIÙ: SI DERIVANO

**Il 2026-09-28 sono sparite trentadue stringhe, e nessuna di loro era un testo: erano trentadue copie
di testi che esistono già altrove.**

| | Il titolo viene da | Perché |
|---|---|---|
| **`howItWorks.title`** *(16)* | ⭐ **`moduleLabels.<kind>.name`**, nella struttura dell'edizione | 🔴 **era un difetto, non una duplicazione.** *Questo file è condiviso fra le edizioni, i nomi dei moduli no: in spagnolo il primo modulo si chiama «Tu historia».* **Con i titoli scritti a mano, il giorno dello spagnolo un corso di spagnolo avrebbe mostrato sedici pop-up intitolati «Your Story»** |
| **`helpReminder.title`** *(16)* | ⭐ **`aiuto.titleInstructions`**, nella sezione 6 di questo file | *erano sedici copie identiche di un testo che era già scritto lì sotto — e è lo **stesso pannello**: la voce del menu Aiuto e il titolo che appare quando la si apre* |

> ⭐ **La regola: un testo si scrive una volta sola. Se la fonte esiste già altrove si deriva; se non
> esiste, si crea il posto e si deriva da lì.** *Qui esisteva in tutti e due i casi, quindi non nasce
> nessuna chiave nuova.*

### ② I numeri attesi

**Si contano sul contenuto prima di usarli (regola 29): se non tornano, fermarsi.**

| Cosa | Prima | **Adesso** |
|---|---|---|
| Spiegazioni (sezione 2) | 32 — *16 titoli + 16 corpi* | **16** |
| Promemoria (sezione 3) | 32 — *16 titoli + 16 corpi* | **16** |
| Consigli condivisi (sezione 4) | 2 — *non sono chiavi del JSON* | **2** — *idem* |
| Altri testi di modulo (sezione 5) | 69 | **69** |
| Testi condivisi (sezione 6) | 75 | ⭐ **77** — *+2 il 1/10* |
| **Stringhe in tutto il JSON** | 208 | ⭐ **178** |

⚠️ **E questo numero è DOCUMENTAZIONE, non un valore da far combaciare.** *Il test di andata e ritorno
conta rigenerando dal markdown, senza nessun numero scritto dentro — così non va aggiustato a mano ogni
volta che nasce un testo.* **Se il numero qui è sbagliato non si rompe niente: abbiamo solo scritto una
cosa falsa, e la prossima volta ci fidiamo lo stesso.**

### ⭐ 176 → 178 IL 1 OTTOBRE: DUE ETICHETTE RIENTRANO DAL CODICE

| L'etichetta | Dove stava | Chi l'ha trovata |
|---|---|---|
| **«Regola generale»** | `app/repeataloud.js` | **Claude Code** |
| **«Un consiglio»** | 🔴 **`tests/tools/trascrivi.js`** — *la inseriva il trascrittore* | **Claude Code**, *e smentiva una riga di questo file* |

⚠️ **I nomi sono `etichettaRegolaGenerale` e `etichettaConsiglio`, non `regolaGenerale` e `consiglio`** —
*e il perché è la cosa che Code ha trovato: sono **due elementi diversi con lo stesso aspetto**, e la
sezione 4 ha già i CORPI dei consigli.* **`etichetta` nel nome dice che questa è la scritta, non il
testo.**

⭐ **E il motivo vero per cui devono essere dati non è la regola 8: è la terza edizione.**
*`inglese-per-spagnoli` ha bisogno di «Un consejo» e «Regla general» — nel codice restano italiane per
sempre.*

⚠️ **IL 178 NON C'ENTRA COL 177 DEL 28 SETTEMBRE.** *Quello era un errore di conteggio. Questi sono due
testi veri che rientrano.*

⚠️ **UNA RIGA PER `kind`, NON PER PASSO.** I **22** passi di `narrativo-standard` hanno **15** id
distinti, e due di quelli — `flashcardAEngIta` e `flashcardAItaEng` — condividono `kind: 'flashcard'`:
**14 kind di modulo + 2 schermate = 16**. *La colonna «passi» dice quante volte quel testo compare in un
episodio: cambiarne uno cambia fino a tre schermate.*

⚠️ **`listaEpisodi` e `mappaEpisodio` NON SONO MODULI**, e restano qui lo stesso: hanno una schermata
loro, quindi hanno i loro due testi come tutti (regola 8).

⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423), E NON È UN VEZZO.** *Chi legge una cella
di tabella le toglie gli spazi ai lati — deve, altrimenti l'allineamento della tabella finirebbe nel
dato — quindi uno spazio ai bordi sparirebbe **senza un errore**. Misurato: una stringa sola ce l'ha,
`condivisi.rispostaCorretta` = `Risposta corretta:␣` — e senza quello spazio l'app scrive «Risposta
corretta:Hello» attaccato.* **Il segno si vede, lo spazio no.**

## 🔴 IL 2 OTTOBRE OTTO TESTI HANNO SMESSO DI DIRE «QUATTRO»

**Claude Code ha reso regolabile il numero di alternative** — `CONFIG.sceltaMultipla.distrattori`.
⚠️ **Da quel momento otto nostri testi dicevano un numero che il Pannello Admin può cambiare.**

| La strada | Perché no |
|---|---|
| *cambiare i testi a mano quando cambia il numero* | 🔴 **lo stesso numero in nove posti: è `R2` rotta** |
| *un segnaposto riempito da `distrattori + 1`* | ⚠️ *funziona, ma è un meccanismo nuovo da dichiarare — e il numero resterebbe scritto due volte* |
| ⭐ **TOGLIERE IL NUMERO DAL TESTO** | ✅ **scelta questa** |

**«Vedi una parola e quattro traduzioni» → «Vedi una parola e più traduzioni».**

> ⭐ **Un testo che non nomina il numero non può mentire su quel numero.**
> *E non costa nessun meccanismo: costa **otto** frasi riscritte — le quattro spiegazioni e i loro quattro promemoria.*

⚠️ **Il conto delle stringhe NON cambia: 178.** *Sono gli stessi otto testi: nessuna chiave nasce e nessuna muore.*

---

⚠️ **L'HTML NEL `corpo` È VOLUTO E VA COPIATO COM'È**: `<p>`, `<b>`, `<em>`. L'app lo inserisce con
`innerHTML`, quindi **togliere i tag vuol dire perdere i capoversi**, non ripulire il testo.

### ③ Cosa è cambiato nel contenuto il 2026-09-28

| | |
|---|---|
| **La colonna `coda` è sparita** | *le sue due righe dicevano una **scorciatoia**. Chi apre la spiegazione la prima volta non ha ancora finito di ripetere niente; chi cerca una scorciatoia è al terzo giro.* **Sono passate nei promemoria, righe 10 e 11** |
| **È nata la colonna `video`** | *il copione del video del modulo. **Vuota per ora**: si riempie quando si fanno i video, e sta qui perché il copione e la spiegazione scritta non devono divergere* |
| **Dieci frasi non nominano più la lingua** | *«Vedi una parola in **inglese** e 4 traduzioni in **italiano**» → «Vedi una parola e quattro traduzioni».* **La direzione è già nel nome del modulo** — «Match Practice en→it» |
| 🔴 **`corpo` + riquadro NON ricostruisce più il `body` di prima** | ⚠️ *è il punto in cui smettiamo di essere a somma zero e cominciamo a cambiare quello che lo studente legge.* **La prova diventa: rigenerare il JSON dal markdown e riottenere questi testi** |

**La regola che ha guidato il taglio:**

> **La spiegazione dice cosa devi fare la prima volta. Il promemoria dice come farlo meglio o più
> veloce.**

*Applicandola si vede perché i testi erano lunghi: dentro le spiegazioni c'era materiale da seconda
volta — il contatore dei tentativi, «si ferma anche da solo se resti in silenzio», le scorciatoie.*
**Non è stato tagliato: è stato spostato dove serve.**

| La misura del taglio | Caratteri | Media per spiegazione |
|---|---|---|
| **Prima**, corpo + riquadro | **10.873** | 680 |
| *di cui i dodici riquadri ricopiati* | *2.574* | · |
| **Prima**, solo corpo | **8.299** | 519 |
| ⭐ **Adesso**, solo corpo | **5.559** | **347** |

⚠️ **E il vero accorciamento arriva coi video:** *quando il video fa vedere il microfono che diventa
rosso, il testo non deve più descriverlo.* **Questi sedici testi si riaprono allora.**

---

## 2 — LE SPIEGAZIONI

*Il popup «Spiegazione», in alto in ogni modulo. Colonne: **kind** → la chiave del JSON · **corpo** →
la prima parte di `howItWorks.body` · **consiglio** → quale riquadro della sezione 4 si attacca in
coda, `—` se nessuno · **video** → il copione del video di questo modulo.*

⚠️ **NON C'È UNA COLONNA «TITOLO», ED È VOLUTO:** *`howItWorks.title` viene da
`moduleLabels.<kind>.name`.* **Vedi ① qui sopra.**

⚠️ **IL CORPO È SPEZZATO PERCHÉ IL CONSIGLIO È RIPETUTO DODICI VOLTE**, in due varianti sole, sei
ciascuna. *Ricopiarlo in ogni riga vorrebbe dire dodici copie da tenere allineate a mano.*

| # | kind | Passi | Corpo | Consiglio | Video |
|---|---|---|---|---|---|
| 1 | `personalizzazione` | 1 | <p>Qui scegli i nomi dei personaggi della storia — o lasci quelli proposti: nessuna scelta è obbligatoria.</p><p>Tocca un campo per cambiarlo.</p><p><b>Queste scelte valgono per questo episodio.</b> Se vuoi cambiarle dopo averlo iniziato, l'episodio si rifà da capo.</p><p>Quando sei pronto, premi «Inizia l'episodio».</p> | — | · |
| 2 | `meetTheStory` | 1 | <p>È il tuo primo incontro con la storia: qui si ascolta, non si studia.</p><p>Tocca 🔊 su ogni battuta per sentirla. La traduzione è già sotto, sempre visibile — non hai ancora studiato niente, quindi non ha senso nasconderla.</p><p>Ascolta quante volte vuoi. <b>Non devi ricordare niente adesso:</b> le parole, le frasi e le regole arrivano dopo.</p><p>Quando ti sei fatto un'idea della storia, premi «Ho finito».</p> | — | · |
| 3 | `repeatAloud` | 2 | <p>Ascolta ogni parola con 🔊, leggi la traduzione e il suggerimento di pronuncia.</p><p>Ripeti ad alta voce finché non ti sembra uguale. <b>Se ti sembra diverso è normale:</b> più avanti ci sono esercizi che ti dicono se la pronuncia è giusta.</p><p>Quando hai ripassato tutte le parole, premi «Ho finito, torna alla mappa».</p> | `consiglio-scrivere` | · |
| 4 | `matchEngIta` | 3 | <p>Vedi una parola e più traduzioni — tocca quella giusta.</p><p><b>Qui non c'è tempo limite:</b> prenditi il momento che ti serve per ragionarci.</p><p>Le parole che sbagli tornano a fine esercizio, finché non sono tutte giuste.</p> | `consiglio-scrivere` | · |
| 5 | `matchItaEng` | 3 | <p>Vedi una parola e più traduzioni — tocca quella giusta.</p><p><b>Qui non c'è tempo limite:</b> prenditi il momento che ti serve per ragionarci.</p><p>Le parole che sbagli tornano a fine esercizio, finché non sono tutte giuste.</p> | `consiglio-scrivere` | · |
| 6 | `flashcard` | 3 | <p>Guarda la parola sulla carta, e ascoltala se vuoi.</p><p>Prima di girarla prova a indovinarla — senza impazzire: se non sei sicuro tocca «Non ancora», tanto tornerà.</p><p>Poi tocca la carta per girarla, e dicci se te la ricordavi.</p><p><b>Le carte che non sai tornano finché non le impari davvero.</b></p> | `consiglio-scrivere` | · |
| 7 | `voicePractice` | 2 | <p>Leggi la frase in italiano, ascolta il modello con 🔊, poi tocca il microfono per registrare.</p><p>Tocca di nuovo per fermarti, e scegli se inviare la registrazione o cancellarla e rifarla.</p><p>Dopo l'invio ogni parola si colora: <b>verde</b> se corretta, <b>giallo</b> se simile, <b>rosso</b> se da rivedere, con un punteggio a stelle.</p><p><b>Qui ti alleni, non vieni valutato:</b> puoi riprovare la stessa frase più volte.</p> | `consiglio-a-tempo` | · |
| 8 | `whyWeSayIt` | 1 | <p>Il dialogo lo conosci già: qui si guarda <em>perché</em> si dice così.</p><p>Su quasi ogni battuta trovi uno o più pulsanti col nome di una regola. Si aprono in ordine, una alla volta: leggila e poi dì se ti è chiara — <b>non c'è una risposta giusta</b>, serve solo a sapere cosa vale la pena rivedere.</p><p>Quando le hai viste tutte, premi «Ho finito».</p> | `consiglio-scrivere` | · |
| 9 | `dialogoAscoltaRipeti` | 1 | <p>Questo è il dialogo intero dell'episodio, dall'inizio alla fine.</p><p>Tocca una battuta per ascoltarla, poi ripetila ad alta voce. Quante volte vuoi, nell'ordine che preferisci.</p><p>Il pulsante in alto apre tutte le traduzioni insieme: <b>usalo quando ti serve, e prova a usarlo sempre meno</b> — è così che il cervello impara a leggere senza appoggiarsi all'italiano.</p><p>Quando hai ascoltato tutte le battute, in fondo trovi la domanda finale.</p> | `consiglio-scrivere` | · |
| 10 | `dialogoRipetiATempo` | 1 | <p>Stesso dialogo di prima, questa volta con il tempo.</p><p>Tocca una battuta: la senti, poi parte una barra. <b>Quella barra è il tuo turno</b> — ripeti ad alta voce mentre scorre.</p><p>Qui non ci sono traduzioni: a questo punto il dialogo dovresti già capirlo. Se non è così, torna a «Ascolta e ripeti».</p><p>Passi alla battuta successiva quando vuoi tu.</p> | `consiglio-a-tempo` | · |
| 11 | `dialogoContinuo` | 1 | <p>Questa è la prova generale: il dialogo scorre da solo, dall'inizio alla fine, come lo sentirai in una conversazione vera.</p><p>Dopo un breve conto alla rovescia parte la prima battuta. La ascolti, ripeti ad alta voce mentre scorre la barra, e appena finisce parte da sola quella dopo.</p><p>Se devi fermarti, usa il pulsante di pausa.</p><p><b>Se riesci a starci dietro senza fermarti, sei pronto per il Test.</b></p> | `consiglio-a-tempo` | · |
| 12 | `speedMatchEngIta` | 1 | <p>Vedi una parola e più traduzioni — tocca quella giusta prima che scada il tempo, o «Non lo so» se non la ricordi.</p><p><b>L'obiettivo non è la velocità, è la correttezza.</b> Se sbagli ti mostriamo la risposta giusta: leggila e memorizzala, perché ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | · |
| 13 | `speedMatchItaEng` | 1 | <p>Vedi una parola e più traduzioni — tocca quella giusta prima che scada il tempo, o «Non lo so» se non la ricordi.</p><p><b>L'obiettivo non è la velocità, è la correttezza.</b> Se sbagli ti mostriamo la risposta giusta: leggila e memorizzala, perché ogni errore torna nei ripassi finché non diventa un successo.</p> | `consiglio-a-tempo` | · |
| 14 | `voiceCoach` | 1 | <p>Leggi la frase in italiano, ascolta il modello con 🔊, poi tocca il microfono per registrare.</p><p>Tocca di nuovo per fermarti, e scegli se inviare o cancellare e rifare.</p><p>Dopo l'invio ogni parola si colora — verde, giallo o rosso — con un punteggio a stelle.</p><p><b>Qui conta una registrazione sola per frase: è una verifica, non un allenamento.</b> Le frasi andate meno bene tornano a fine esercizio.</p> | `consiglio-a-tempo` | · |
| 15 | `listaEpisodi` | schermata | <p>Questa è la lista degli episodi del corso, nell'ordine in cui si fanno.</p><p>Puoi aprire l'episodio attuale, o tornare su uno che hai già finito.</p><p>Il successivo si sblocca quando completi <b>l'ultimo passaggio</b> di quello che stai facendo.</p> | — | · |
| 16 | `mappaEpisodio` | schermata | <p>Questa è la mappa dell'episodio: tutti i passaggi che farai, in ordine.</p><p>Puoi toccare il passaggio attuale, quello evidenziato, o tornare su uno già completato. <b>Non puoi saltare avanti.</b></p> | — | · |

---

## 3 — I PROMEMORIA

*Il pannello Help, voce «Rivedi come funziona l'esercizio». Stesse chiavi della sezione 2. Colonne:
**kind** → la chiave del JSON · **corpo** → `helpReminder.body`.*

⚠️ **NON C'È UNA COLONNA «TITOLO», ED È VOLUTO:** *`helpReminder.title` viene da
`aiuto.titleInstructions`, sezione 6 — lo stesso testo che apre quel pannello.*

⚠️ **QUI STA QUELLO CHE SERVE DAL SECONDO GIRO IN POI:** *le scorciatoie, i contatori, cosa succede
quando l'app si ferma da sola, perché un pulsante è spento.* **Le due righe che erano nella colonna
`coda` sono finite qui — 10 e 11.**

| # | kind | Corpo |
|---|---|---|
| 1 | `personalizzazione` | <p>Tocca un campo per personalizzarlo, o lascialo com'è. «Reset» torna ai valori di partenza.</p><p>Le scelte valgono per questo episodio: per cambiarle dopo averlo iniziato, l'episodio si rifà da capo.</p><p>In fondo alla pagina puoi suggerirci nomi o parole che non trovi nelle liste.</p> |
| 2 | `meetTheStory` | <p>Ascolta le battute con 🔊, alla velocità che preferisci (100/75/50%). La traduzione è sempre visibile: qui serve capire la storia, non indovinarla.</p><p>Quando ti basta, premi «Ho finito».</p> |
| 3 | `repeatAloud` | <p>Premi 🔊 per ascoltare ogni parola (velocità 100/75/50%), poi ripetila ad alta voce. Leggi la traduzione e il suggerimento di pronuncia se ti serve.</p><p>Quando hai fatto tutta la lista, premi «Ho finito, torna alla mappa». Se non vuoi farlo adesso, tocca «Mappa».</p> |
| 4 | `matchEngIta` | <p>Vedi la parola, tocca la traduzione corretta fra quelle proposte. Nessun tempo limite.</p><p>Le domande sbagliate tornano a fine esercizio, finché non sono tutte corrette.</p> |
| 5 | `matchItaEng` | <p>Vedi la parola, tocca la traduzione corretta fra quelle proposte. Nessun tempo limite.</p><p>Le domande sbagliate tornano a fine esercizio, finché non sono tutte corrette.</p> |
| 6 | `flashcard` | <p>Prova a indovinare la parola prima di girarla, poi tocca la carta per vedere la traduzione.</p><p>Dicci se la sapevi o no. Le carte che non sai tornano finché non le impari.</p> |
| 7 | `voicePractice` | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. <b>Si ferma anche da solo</b> se resti in silenzio o se superi il tempo massimo. Poi scegli se inviare o cancellare.</p><p>Guarda i colori e le stelle. «Esercitati ancora» per riprovare la stessa frase — il contatore mostra quante volte ti restano, e quando finiscono si va avanti comunque.</p><p>Qui non c'è un ripasso finale: è uno spazio libero per allenarti.</p> |
| 8 | `whyWeSayIt` | <p>Apri le regole una alla volta, nell'ordine in cui si presentano, e dopo ognuna dì se ti è chiara. Il pulsante finale si accende quando hai risposto a tutte.</p><p>Quando le hai viste tutte, premi «Ho finito». Se devi interrompere, «Esci e riprendi dopo» tiene il punto in cui sei arrivato.</p> |
| 9 | `dialogoAscoltaRipeti` | <p>Tocca una battuta per ascoltarla, poi ripetila ad alta voce. Nessun tempo, nessun ordine obbligato.</p><p>La spunta verde ti ricorda quali hai già ascoltato. Il pulsante in alto mostra e nasconde tutte le traduzioni.</p> |
| 10 | `dialogoRipetiATempo` | <p>Tocca una battuta, ascoltala, poi ripeti ad alta voce mentre scorre la barra. Durante l'ascolto e la barra tutto il resto è bloccato: serve a farti fare davvero l'esercizio.</p><p><b>Scorciatoia:</b> mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine — fa la stessa cosa del pulsante «Prossima frase».</p> |
| 11 | `dialogoContinuo` | <p>Parte da solo e va avanti da solo: ascolta ogni battuta e ripetila ad alta voce mentre scorre la barra. Usa il pulsante di pausa se devi fermarti.</p><p><b>Scorciatoia:</b> mentre scorre la barra puoi toccare la battuta per passare subito alla successiva.</p> |
| 12 | `speedMatchEngIta` | <p>Vedi la parola, tocca la traduzione corretta fra quelle proposte, prima che scada il tempo. «Non lo so» se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 13 | `speedMatchItaEng` | <p>Vedi la parola, tocca la traduzione corretta fra quelle proposte, prima che scada il tempo. «Non lo so» se non la sai — poi guarda sempre la risposta corretta prima di andare avanti.</p> |
| 14 | `voiceCoach` | <p>Tocca il microfono per registrare, tocca di nuovo per fermarti. Prima di inviare puoi sempre cancellare e rifare.</p><p>Dopo l'invio guarda i colori e le stelle, poi tocca «Avanti». <b>Una sola registrazione conta per frase:</b> quelle andate meno bene tornano a fine esercizio.</p> |
| 15 | `listaEpisodi` | <p>Apri l'episodio attuale, o uno già finito per rivederlo. Il successivo arriva quando chiudi l'ultimo passaggio di questo.</p> |
| 16 | `mappaEpisodio` | <p>Tocca il passaggio attuale per iniziarlo, o uno già completato per rivederlo. Niente salti in avanti.</p> |

---

## 4 — I DUE CONSIGLI CONDIVISI

*Non sono una chiave del JSON: sono il testo dentro il riquadro `note-box panel` che la sezione 2
attacca in coda a dodici spiegazioni.*

⚠️ **L'INVOLUCRO ESATTO, che va scritto così e non altrimenti:**

```html
<div class="note-box panel"><span class="note-box-label">Un consiglio</span>IL TESTO</div>
```

🔴 **CORRETTO IL 30/09: qui c'era scritto che l'etichetta «Un consiglio» «non è scritta in nessun altro
posto». È FALSO.**

⚠️ **La scriveva `trascrivi.js`** — *misurato da Claude Code.* **In nessuna nostra cella c'era quella
parola: l'involucro qui sopra è DOCUMENTAZIONE di una cosa che produce lui.**

✅ **CHIUSO IL 1/10 (passo 4):** *l'etichetta è la cella `condivisi.etichettaConsiglio` della sezione 6, e
`trascrivi.js` la legge da lì; se manca, si ferma.* **La classe del riquadro è `note-box` e non più
`general-rule`:** *lo stesso riquadro veste anche la regola generale di un episodio, e un nome che dice
uno solo dei due mentiva sull'altro.* — *corretto da Claude Code nel commit che l'ha reso falso (regola 33).*

> ⭐ **Ed è `R2` in una forma che non si vede:** *un testo documentato in un posto e prodotto in un
> altro.* **Se lui cambia l'involucro, questa pagina diventa falsa in silenzio — come è appena
> successo.**

✅ **Si chiude facendola diventare un dato:** *«Un consiglio» e «Regola generale» diventano due celle di
questo file, e il trascrittore le legge invece di scriverle.* **176 → 178.**

| id | Quante spiegazioni lo usano | Testo |
|---|---|---|
| `consiglio-scrivere` | **6** | Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico. |
| `consiglio-a-tempo` | **6** | Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo. |

**I quattro senza consiglio** sono `personalizzazione`, `meetTheStory` e le due schermate: *due sono
schermate, e due sono i moduli in cui non si esercita niente.*

---

## 5 — GLI ALTRI TESTI DI UN MODULO

*Tutto quello che sta dentro una chiave di modulo e non è `howItWorks` né `helpReminder`: le domande di
un'autovalutazione, le righe che spiegano perché un pulsante è spento, le etichette di un riquadro. Il
**percorso** è puntato come nel JSON, e `[n]` è la posizione in una lista.*

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
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[14]` | Capita, e non vuol dire niente su come stai andando: vai avanti. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[15]` | Tranquillo. Certe cose hanno senso solo dopo che le hai dette a voce. |
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

*Le sei chiavi condivise. **Nessuna ha `howItWorks` o `helpReminder`, e non è una dimenticanza:** non
hanno una schermata propria da spiegare — `dialogoShared` serve ai tre Dialogue che la schermata ce
l'hanno, `condivisi` a tutti.*

⚠️ **`aiuto.titleInstructions` ADESSO HA UN SECONDO LETTORE:** *è il titolo di tutti e sedici i
promemoria della sezione 3.* **Cambiarla cambia diciassette schermate, non una.**

⚠️ **`erroreCaricamento` è il caso della regola 35:** i suoi testi vengono da qui, ma **se il file che
non si carica è PROPRIO questo** non arrivano mai — per questo nel codice esiste
`LOAD_ERROR_LAST_RESORT`, l'unica frase scritta a mano che la regola 8 ammette. *Accorciare questi testi
non tocca quella frase.*

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
| `condivisi` | `etichettaRegolaGenerale` | Regola generale |
| `condivisi` | `etichettaConsiglio` | Un consiglio |
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

---

## 7 — UNA COSA ANCORA DA DECIDERE

**«Non mostrarmi più questa schermata» si può toccare dal PRIMO passaggio.** *Oggi si può zittire la
spiegazione senza averla letta — ed è il modo in cui un utente vero si è bloccato.*

⭐ **La proposta: appare dal secondo passaggio in poi.** *Chi ha già visto quella schermata sa cosa sta
zittendo; chi la vede per la prima volta no.* **Non è ancora deciso, e non entra in questo giro.**
