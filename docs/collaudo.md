# Il collaudo — il passo 26

**Dal 2026-10-30, a contenuto chiuso.** È **il** documento del collaudo: le
voci da guardare stanno **qui e solo qui** (regola 48). `decisioni-stato.md`,
sezione «② IL COLLAUDO», rimanda a questo file.

> **Cosa si collauda:** l'app dall'inizio alla fine, **su Pages**
> (https://dav-te-pd.github.io/base-inglese/), **su profilo nuovo**, sul
> telefono e sul computer. *Non i soli moduli: gli strati — la mappa, gli
> avvii, i passaggi fra episodi — sono quello che si è mosso.* Gli otto punti
> di `docs/archivio/collaudo-sei-moduli.md` ne sono una metà.

**Versione:** `main` a `d6b69d8` (contenuto) e successivi. *Prima di
cominciare, `?config` → gruppo `speech`, e la prima riga dice quale voce
parla su quel dispositivo: è il modo di sapere che la pagina è quella nuova e
non una copia in cache.*

---

## Come si fa

1. **Profilo nuovo:** «Non sei tu? Cambia nome» e un nome mai usato. *Un
   profilo vecchio porta valori salvati con le chiavi di prima: il collaudo
   deve vedere quello che vede uno studente che arriva oggi.*
2. **L'edizione si sceglie da `?config`**, gruppo `edizione`. Le tre:
   `inglese/it`, `spagnolo/it`, `italiano/es`.
3. **Ogni voce ha un esito**, da scrivere nella colonna in fondo: ✅ come
   descritto · ❌ diverso (e cosa si vede) · ⏭️ non guardata (e perché).
   *Una voce senza esito non è una voce verde.*

---

## Le voci

*Nove nella tabella, più la misura delle voci (la 11) qui sotto. Restano fuori, rimandate dopo la tappa ③ come deciso il 2026-10-29, la scelta della voce italiana e `speechstart`/`speechend`: sono già misurate (`decisioni-stato.md`, riga «La voce e il microfono in `italiano/es`»).*

**In cima la voce che distingue questa versione dalla precedente** (regola 14):
se la 1 non va, la pagina è quella vecchia e il resto non vale.

| # | Cosa | Come si vede | Da dove viene | Esito |
|---|---|---|---|---|
| 1 | ⭐ **Il cognome è della storia, non dell'episodio** | In `gate`, Personalizza: scegli un cognome **diverso da Rossi**. Apri `aircraft-door`: le battute dicono **quel** cognome | chi guida il progetto, 2026-10-30 · `customValuesKey` senza episodio | |
| 2 | **`aircraft-door` comincia da Meet the Story** | La sua mappa non ha Personalizza: 21 passi, non 22 | sequenza `narrativo-seguito` | |
| 3 | 🔴 **`italiano/es` parla allo studente in spagnolo** — *la voce più importante per chi guida il progetto: 49 stringhe passate nella lingua dello studente, e **nessun test le legge** (il JSON e il markdown hanno le stesse stringhe, e sbaglierebbero insieme)* | I gradi: **Palabras · Expresiones · Frases · Diálogo**. Sopra le bolle di `gate`: **Azafata de embarque · Papá · Mamá · Hija · Hijo · Todos**; di `aircraft-door`: **Azafata de la puerta · Papá · Todos**. Le spiegazioni di «Perché si dice così» in spagnolo | chi guida il progetto, 2026-10-30 | |
| 4 | **Personalizza in `italiano/es`** | I campi: **Nombre del papá · Nombre de la mamá · Nombre de la hija · Nombre del hijo · Apellido de la familia · Ciudad de salida**. **Ogni tendina ha TRE voci** | chi guida il progetto, 2026-10-30 | |
| 5 | **L'età è nella battuta** | In `gate`, nelle tre edizioni: la figlia ha **sedici** anni, il figlio **otto** (*sixteen / eight · dieciséis / ocho · sedici / otto*). In Personalizza **nessun campo per l'età** | chi guida il progetto, 2026-10-30 · `ages.anni` uscita | |
| 6 | **«lei» soggetto in `italiano/es`** | `aircraft-door`, Repeat Aloud, grado Palabras: la parola «lei» porta la nota **«en minúscula es "ella"…»** | `a-lei-soggetto`, 2026-10-30 | |
| 7 | **Il caricamento di un modulo non dà nessun segno** | Su rete lenta (sul computer: strumenti del browser → Rete → «3G lenta»): tocca una riga della mappa, e **ritoccala** prima che il modulo si apra. *Cosa succede:* niente a schermo? il modulo si apre due volte? | storico, riga 2542 · `app/apertura.js` | |
| 8 | **Il badge di Voice Check su una registrazione muta** | In Voice Check, primo tentativo: premi Registra **senza parlare**. Torna alla mappa e guarda il badge. *Il codice dice che segna 0%: i colori delle parole sono protetti da una registrazione vuota, il badge no* | storico, riga 3930 · `app/voice.js` | |
| 9 | ⭐ **Le due età possono comparire INSIEME fra le alternative** | In `gate`, sul grado delle Frasi: Match / Speed Match (*Empareja / Contrarreloj* in `spagnolo/it`, *Abbina / Contro il tempo* in `italiano/es`). «I'm sixteen years old» e «I'm eight years old» (e le loro sorelle) possono stare una accanto all'altra. ⚠️ **Cosa guardare: se le due righe accanto sembrano un errore invece di una scelta.** *Fino al 30/10 si escludevano (`non con`), perché differivano solo per il segnaposto dell'età; con l'età fissa differiscono per una parola vera, e l'esclusione è sparita in tutte e tre le edizioni. È l'unico punto dove TOGLIERE un'esclusione cambia l'esercizio, e nessuno l'ha mai visto* | chi guida il progetto, 2026-10-31 · verificato: `nonCon` vuoto nelle tre edizioni | |
| 10 | 🔴 **Una città di partenza fuori dall'Italia porta il SUO paese** | In `gate`, Personalizza → Città di partenza → **Lugano**, poi la battuta `d-4`: **«I am from Lugano, Switzerland.» / «Vengo da Lugano, in Svizzera.»** in `inglese/it`, **«Soy de Lugano, Suiza.» / «Sono di Lugano, Svizzera.»** in `spagnolo/it` — **mai** Italy / Italia. In `italiano/es` Lugano non c'è: le tre partenze sono Messico, Colombia e Argentina, quindi **qualunque** scelta prova il paese (per esempio Bogotá → «Sono di Bogotá, Colombia.»). *Il 2026-10-20 il registro diceva che un difetto su quella colonna non l'avrebbe visto nessun test, perché nessuno sceglieva Lugano; dal 30/10 Lugano è una delle tre opzioni, e uno studente la sceglie* | chi guida il progetto, 2026-10-31 · verificato sulle tre tabelle | |


---

## 11 — Chi parla, su quale dispositivo, in quale edizione

**Una misura, non una correzione:** serve al lavoro sull'audio registrato
(la 4.5, dopo la tappa ③). *Per chi guida il progetto è una priorità: la voce
è la prima cosa di un'app che insegna una lingua.* La voce e il microfono di
`italiano/es` restano rimandati come deciso il 2026-10-29 — **qui si scrive
soltanto chi parla.**

Dove si legge: `?config` → gruppo `speech`, la prima riga («chiesta …, usata …,
nome …»). Il collaudo la guarda già all'inizio: costa zero.

| Dispositivo | Edizione | Nome della voce | Maschile / femminile | Lingua usata |
|---|---|---|---|---|
| telefono | `inglese/it` | | | |
| telefono | `spagnolo/it` | | | |
| telefono | `italiano/es` | | | |
| computer | `inglese/it` | | | |
| computer | `spagnolo/it` | | | |
| computer | `italiano/es` | | | |

---

## L'app dall'inizio alla fine

Le voci qui sopra sono quelle che **sappiamo** di dover guardare. Il resto del
collaudo è il giro intero, una volta per edizione, ed è lì che si trovano le
cose che non sapevamo:

- l'avvio e il nome · la lista degli episodi · la mappa di `gate`;
- **ogni modulo almeno una volta**, fino alla **Schermata Finale** e a «Ho
  finito, torna alla mappa» (regola 10: lì non c'è la riga delle azioni);
- la fine di `gate` e **lo sblocco di `aircraft-door`** nella lista degli
  episodi (regola 30, sblocco per completamento);
- `aircraft-door` fino in fondo.

*Quello che si trova in questo giro va scritto qui sotto, una riga per cosa,
con l'edizione e il dispositivo.*

| Edizione · dispositivo | Cosa si è visto | Esito |
|---|---|---|
| | | |

---

*Il ragionamento del passo 26 — perché qui e non prima — sta in
`decisioni-stato.md`, sezione «② IL COLLAUDO». Quando il collaudo è chiuso,
questo file va in `docs/archivio/` con la sua data, come
`collaudo-sei-moduli.md`.*
