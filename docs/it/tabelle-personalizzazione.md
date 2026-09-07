# Tabelle di personalizzazione — edizione italiana

> ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola master 1.5).
>
> ⚠️ **NON ANCORA TRASCRIVIBILE.** Questo file descrive il magazzino come sarà. Oggi le
> tabelle vivono in `APP_CONFIG.people` e `APP_CONFIG.places`, e **due cose del disegno qui
> sotto non sono rappresentabili nel codice attuale** — vedi *Cosa manca* in fondo. Il file
> serve a decidere adesso e ad avere la fonte pronta; **la trascrizione in
> `data/it/tabelle-personalizzazione.json` viene dopo una modifica al codice**, che va valutata
> prima (regola 1.10).
>
> **Cos'è.** Il **magazzino** dei valori di personalizzazione. Contiene più di quello che si
> usa: un episodio **elenca gli id che vuole**, uno per uno, e solo quelli compaiono
> (regola 5.7). *Le tabelle sono il magazzino, l'episodio è la vetrina.*
>
> **Vale per tutti gli episodi dell'edizione italiana**, presenti e futuri. Non sta dentro un
> episodio perché una parola qui ha fino a dieci forme — cinque lingue per cinque — e
> riscriverle in ogni episodio le farebbe divergere alla terza copia. *E perché il carry-over
> funzioni (5.2), "Rossi" scelto in un episodio deve venire dalla **stessa riga** di quello
> successivo.*
>
> **Un'edizione nuova non si ottiene traducendo questo file:** un francese non si chiama "Marco
> tradotto", si chiama Pierre. Si copia la struttura e si sostituiscono i contenuti
> (regola 1.112).

---

## COM'È FATTA UNA RIGA

| Campo | Cosa contiene |
|---|---|
| `id` | descrittivo, unico dentro l'edizione, **congelato** |
| `it` | la forma nella lingua dello studente — **è quella che entra nel dialogo** |
| `en` | la forma nella lingua studiata |
| `traducibile` | **sì / no, dichiarato per riga** |

**`traducibile` si dichiara, non si deduce.** Oggi il codice capisce che un nome di persona non
si traduce perché la sua tabella si chiama `people.papa`: il prefisso è il segnale. **Senza
tabelle non c'è prefisso**, e senza una colonna esplicita i nomi ricomincerebbero a tradursi —
*Francesco → Francis*.

**E non si deduce nemmeno dal prefisso dell'id:** `papa-marco` che comincia per `papa-` è una
convenzione, e le convenzioni sui nomi si rompono al primo id scritto storto (regola 1.9).

**Niente colonna pronuncia, per ora.** `pronunciationTip` sta sulla voce del grado, non sulla
riga di personalizzazione: una pronuncia messa qui **non avrebbe nessun lettore**, e sarebbe un
campo morto — esattamente ciò che T1 esiste per prevenire. *Decisione a fine A1, insieme a chi
la mostra.*

**L'ordine delle righe è quello in cui sono scritte.** Nessun codice ordina: `eta-4 … eta-17`
in ordine alfabetico darebbe 10, 11, 12, 4, 5.

---

## NOMI — papà

*Non traducibili. La colonna inglese esiste solo perché sia già pronta se un giorno servisse.*

| id | it | en | traducibile |
|---|---|---|---|
| `papa-marco` **(pred.)** | Marco | Mark | no |
| `papa-giancarlo` | Giancarlo | Giancarlo | no |
| `papa-francesco` | Francesco | Francis | no |
| `papa-andrea` | Andrea | Andrew | no |
| `papa-luca` | Luca | Luke | no |
| `papa-paolo` | Paolo | Paul | no |
| `papa-stefano` | Stefano | Stephen | no |
| `papa-davide` | Davide | David | no |
| `papa-claudio` | Claudio | Claude | no |
| `papa-federico` | Federico | Frederick | no |

*`Giancarlo` non ha un equivalente inglese corrente: la colonna riporta sé stesso. **Una
colonna non può avere buchi**, e un nome senza equivalente ha sé stesso come equivalente.*

## NOMI — mamma

| id | it | en | traducibile |
|---|---|---|---|
| `mamma-giulia` **(pred.)** | Giulia | Julia | no |
| `mamma-anna` | Anna | Ann | no |
| `mamma-chiara` | Chiara | Clare | no |
| `mamma-nicoletta` | Nicoletta | Nicole | no |
| `mamma-laura` | Laura | Laura | no |
| `mamma-elena` | Elena | Helen | no |
| `mamma-silvia` | Silvia | Sylvia | no |
| `mamma-francesca` | Francesca | Frances | no |

## NOMI — figlia

| id | it | en | traducibile |
|---|---|---|---|
| `figlia-emma` **(pred.)** | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sophie | no |
| `figlia-alice` | Alice | Alice | no |
| `figlia-giorgia` | Giorgia | Georgia | no |
| `figlia-martina` | Martina | Martina | no |
| `figlia-sara` | Sara | Sarah | no |
| `figlia-chiara` | Chiara | Clare | no |
| `figlia-beatrice` | Beatrice | Beatrice | no |

## NOMI — figlio

| id | it | en | traducibile |
|---|---|---|---|
| `figlio-tommaso` **(pred.)** | Tommaso | Thomas | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-marco` | Marco | Mark | no |
| `figlio-giorgio` | Giorgio | George | no |
| `figlio-matteo` | Matteo | Matthew | no |
| `figlio-lorenzo` | Lorenzo | Lawrence | no |
| `figlio-simone` | Simone | Simon | no |
| `figlio-filippo` | Filippo | Philip | no |
| `figlio-claudio` | Claudio | Claude | no |
| `figlio-federico` | Federico | Frederick | no |
| `figlio-paolo` | Paolo | Paul | no |

*`Chiara` compare fra mamme e figlie, `Marco` fra papà e figli, e va bene: sono tabelle diverse
con id diversi. Le quattro tabelle non hanno lo stesso numero di righe, e non devono averlo.*

## COGNOMI

*Non si traducono: colonna identica per costruzione.*

| id | it | en | traducibile |
|---|---|---|---|
| `cognome-costa` **(pred.)** | Costa | Costa | no |
| `cognome-rossi` | Rossi | Rossi | no |
| `cognome-bianchi` | Bianchi | Bianchi | no |
| `cognome-ferrari` | Ferrari | Ferrari | no |
| `cognome-ferrario` | Ferrario | Ferrario | no |
| `cognome-russo` | Russo | Russo | no |
| `cognome-marino` | Marino | Marino | no |
| `cognome-barberis` | Barberis | Barberis | no |
| `cognome-ambruosi` | Ambruosi | Ambruosi | no |

*`Ferrari` e `Ferrario` si somigliano molto. Nei quiz non è un problema — i cognomi non si
insegnano — ma se un giorno la pronuncia degli slot venisse valutata, il riconoscimento vocale
farebbe fatica a distinguerli.*

## ETÀ

*Una tabella sola. I due slot ne elencano intervalli diversi: è la regola 5.7 in azione — il
magazzino è più grande della vetrina.*

| id | it | en | traducibile |
|---|---|---|---|
| `eta-4` | 4 | four | **sì** |
| `eta-5` | 5 | five | sì |
| `eta-6` | 6 | six | sì |
| `eta-7` | 7 | seven | sì |
| `eta-8` **(pred. figlio)** | 8 | eight | sì |
| `eta-9` | 9 | nine | sì |
| `eta-10` | 10 | ten | sì |
| `eta-11` | 11 | eleven | sì |
| `eta-12` | 12 | twelve | sì |
| `eta-13` | 13 | thirteen | sì |
| `eta-14` | 14 | fourteen | sì |
| `eta-15` | 15 | fifteen | sì |
| `eta-16` **(pred. figlia)** | 16 | sixteen | sì |
| `eta-17` | 17 | seventeen | sì |

**Le due colonne servono a due usi diversi, non sono una duplicazione:**

- la **cifra** è quello che lo studente vede nella schermata di personalizzazione — scegliere
  `16` da un elenco è più veloce che leggere `sixteen`
- la **parola** è quella che entra nel dialogo e che Voice Practice ascolta

*Un numero si scrive in lettere quando è la parola che stiamo insegnando: `sixteen` è una voce
di vocabolario, non una quantità. Se il dialogo mostrasse `I'm 16`, lo studente non leggerebbe
mai la parola che sta studiando.*

## LUOGHI DI PARTENZA — città e paese accoppiati

⚠️ **Questa tabella ha due valori per riga, e oggi non è rappresentabile.** Vedi *Cosa manca*.

| id | città it | città en | paese it | paese en | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` **(pred.)** | Mondovì | Mondovì | Italia | Italy | **sì** |
| `orig-torino` | Torino | Turin | Italia | Italy | sì |
| `orig-milano` | Milano | Milan | Italia | Italy | sì |
| `orig-roma` | Roma | Rome | Italia | Italy | sì |
| `orig-napoli` | Napoli | Naples | Italia | Italy | sì |
| `orig-palermo` | Palermo | Palermo | Italia | Italy | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Switzerland | sì |
| `orig-nizza` | Nizza | Nice | Francia | France | sì |

**Città e paese sono una riga sola, mai due slot indipendenti.** Sceglierli separatamente
permetterebbe *"Torino, Francia"* (regola 2.7, il fruttivendolo).

*Lugano e Nizza ci sono perché ci sono più italofoni fuori dall'Italia di quanti se ne pensi, e
uno studente di Lugano non deve dichiarare un paese che non è il suo.*

**Tutti i paesi vogliono "in":** in Italia, in Svizzera, in Francia. La frase risultante è
`I am from Turin, Italy`.

## DESTINAZIONI

| id | it | en | traducibile |
|---|---|---|---|
| `dest-cina` **(pred.)** | Cina | China | **sì** |
| `dest-giappone` | Giappone | Japan | sì |
| `dest-irlanda` | Irlanda | Ireland | sì |
| `dest-india` | India | India | sì |
| `dest-australia` | Australia | Australia | sì |
| `dest-grecia` | Grecia | Greece | sì |
| `dest-norvegia` | Norvegia | Norway | sì |
| `dest-croazia` | Croazia | Croatia | sì |
| `dest-turchia` | Turchia | Turkey | sì |
| `dest-scozia` | Scozia | Scotland | sì |
| `dest-thailandia` | Thailandia | Thailand | sì |

**Due criteri, entrambi obbligatori:** in italiano vogliono **"in"** — nome femminile singolare
— e in inglese **non vogliono l'articolo**. *Per questo si dice Inghilterra e non Regno Unito:
"**nel** Regno Unito". E per questo sono fuori gli Stati Uniti e i Paesi Bassi.*

**Nessuna coincide con i paesi di origine** (Italia, Svizzera, Francia). **Origine e
destinazione non coincidono mai** (regola 1.73): il conflitto si elimina all'origine —
togliendo la sovrapposizione dal magazzino — non con una regola applicata a runtime. *Una
famiglia francese che parte per la Francia produce frasi corrette e una storia che non sta in
piedi.*

### In magazzino, non ancora in nessuna vetrina

*Restano qui per l'episodio che spiegherà le preposizioni diverse — vedi le regole in sospeso
dell'inventario grammaticale.*

| id | it | en | preposizione italiana |
|---|---|---|---|
| `dest-stati-uniti` | Stati Uniti | United States | ne**gli** Stati Uniti |
| `dest-londra` | Londra | London | **a** Londra |
| `dest-paesi-bassi` | Paesi Bassi | Netherlands | ne**i** Paesi Bassi |

*Il vincolo tecnico diventa contenuto didattico: restringere adesso non è rinunciare, è
rimandare. Quando arriverà la scheda di distinzione, i dati sono già pronti.*

---

## COSA MANCA PERCHÉ QUESTO FILE SIA TRASCRIVIBILE

**Due cose, e nessuna delle due è una trascrizione.**

### 1. Un secondo campo per riga

`resolveSlotValue` restituisce `picked[lang]` — **un solo campo per slot** — e le righe di
`places.departures` sono `{ value, it, en, fr, es, de }`. **Non c'è un secondo campo "paese" da
leggere sulla stessa riga**, e non esiste una sintassi per chiederlo: `{paese}` resterebbe non
risolto a schermo.

*Finché non c'è, `Italy` resta scritto a mano nella battuta d4 dell'episodio del gate, e resta
nel grado A — che vale 15 invece di 14.*

### 2. Il magazzino fuori da `APP_CONFIG`

Oggi le tabelle stanno in `APP_CONFIG.people` e `APP_CONFIG.places`. Portarle in
`data/it/tabelle-personalizzazione.json` **cambia il modo in cui i moduli risolvono uno slot**,
e tocca tredici punti del codice.

**Serve anche una migrazione:** i profili salvano il valore della riga — `marco`, `mondovi`,
`16` — che diventerebbe `papa-marco`, `orig-mondovi`, `eta-16`. Senza migrazione,
`var picked = match || opts[0]` **ricade in silenzio sulla prima opzione**: chi ha
personalizzato si ritrova tutte le scelte riportate ai default, senza avviso e senza che nessun
test lo veda.

**E serve un test rovesciato:** non *"ogni riga del magazzino è usata"* — falso per costruzione,
il magazzino è più grande della vetrina — ma **"ogni id elencato da un episodio esiste nel
magazzino"**. Un id scritto storto oggi darebbe `picked = opts[0]`: silenzio.

### E una cosa da chiudere insieme

**I segnaposto del markdown e le chiavi del JSON non coincidono:** il markdown scrive
`{figlia}`, `{etàFiglia}`, `{papà}`, il JSON usa `figliaNome`, `figliaEta`, `papa`. Oggi sono
notazione leggibile contro chiavi vere, ma **è una traduzione mentale a ogni lettura, e prima o
poi qualcuno la sbaglia.** Va allineato in questo stesso lavoro, che tocca comunque quelle
chiavi — e che quindi comporta comunque una migrazione.
