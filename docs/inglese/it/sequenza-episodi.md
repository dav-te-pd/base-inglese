# Sequenza degli episodi — inglese per italiani

> ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola master 1.5).
>
> **Cos'è.** L'ordine in cui gli episodi si incontrano, con i raggruppamenti che li contengono.
> **È la fonte**: `CONFIG.episodes` porta gli stessi id, aggiornati a mano leggendo questo file —
> lo stesso rapporto che la regola 26 ha già stabilito fra `struttura-corso.md` e `APP_CONFIG`.
>
> **Non esiste un `sequenza-episodi.json`**, ed è una scelta: l'elenco degli episodi serve
> **durante** l'avvio, prima che qualunque file sia scaricato. Farlo arrivare da un file
> renderebbe asincrona la costruzione di `EPISODES`, che è più grosso di tutto il resto della
> fase 1-bis. *E quando Supabase servirà i contenuti a richiesta, l'elenco arriverà dal server:
> costruire adesso un JSON che Supabase sostituisce è lavoro che si butta due volte.*
>
> **Spostare un episodio è spostare una riga qui**, e nient'altro cambia. I raggruppamenti sono
> intestazioni **dentro** questa sequenza, non una seconda lista: due liste sugli stessi id
> divergono.
>
> Convenzione: `docs/inglese/it/sequenza-episodi.md`.

---

# A1.1

*L'apertura, le fondamenta, e l'inizio del viaggio.*

| # | Episodio | Tipo | Stato |
|---|---|---|---|
| **0** | **`benvenuto`** | ⭐ **apertura del corso** | **da creare — solo lo spazio** |
| 1 | `numeri` | grammaticale · apre | scheda 3.1 fatta, **episodio da scrivere** |
| 2 | `verb-to-be` | grammaticale · apre | scheda 1.1 fatta, **episodio da scrivere** |
| 3 | `gate` | narrativo | ✅ **scritto e trascritto** |
| 4 | `aircraft-door` | narrativo | ✅ **scritto e trascritto** |

**Perché i grammaticali prima del gate.** *L'episodio del gate usa `I am`, `we are` e le età:
senza il verbo essere e i numeri, quelle voci comparirebbero senza che nessuna scheda le abbia
aperte (regola 1.1).*

---

## L'episodio 0 — `benvenuto`

⚠️ **Adesso serve solo lo spazio, non il contenuto.**

*Un modulo solo, con un testo qualunque e **il pulsante in fondo sempre verde**: si legge, si
preme, si va avanti.* **Serve a noi — per avere il posto già occupato quando i moduli veri
arriveranno, e per abituarci mentalmente a un corso che comincia da lì.**

> **Il motivo per cui non lo scriviamo adesso:** *non è il momento di creare episodi o moduli. È
> il momento di finire la catena.*

### Cosa conterrà, quando sarà il momento

**Come funziona una serie**

*episodi · moduli · le ripetizioni · i quiz · **il metodo PRETTE** · perché si torna sulle stesse
cose*

**Come funziona l'app**

*i tasti · la mappa · Help · Spiegazione · i report · dove si vedono i progressi*

### Perché esiste, ed è la ragione che decide

**Senza, il corso comincia con una tabella di coniugazione.**

*Uno studente apre l'app per la prima volta e trova il verbo essere — **esattamente la cosa che il
metodo dice di non fare**: la promessa è "entri nella storia e impari senza accorgertene".*

**Con l'episodio 0 la promessa si mantiene:** *prima gli si dice **cosa sta per succedere**, poi
comincia — e le due schede grammaticali diventano "le fondamenta" invece di "la prima cosa".*

*Ed è anche il posto dove vive la promessa della 7c.0, al livello del corso invece che
dell'episodio.*

⚠️ **`nomi-propri` è slittato**, e la ragione è tua: *all'inizio è troppa roba, e la scheda non ha
niente su cui appoggiarsi.* **Arriva al ritiro bagagli o in coda al controllo passaporti**, dove
si incontra gente con nomi veri — *e lì la scheda spiega un fenomeno già visto.*

---

# A1.2

*In volo — e il primo personaggio che tornerà.*

| # | Episodio | Tipo | Stato |
|---|---|---|---|
| 5 | `seat` — il posto | narrativo | bozza |
| 6 | `seat-neighbour` — il vicino di posto | narrativo | bozza |
| 7 | `before-takeoff` — prima del decollo | narrativo | bozza |

**Cosa insegnano, in ordine di scambio comunicativo** *(la progressione, non solo gli argomenti)*:

| | Con chi | Che tipo di scambio |
|---|---|---|
| `gate` | l'hostess | **ti presenti tu** |
| `aircraft-door` | l'hostess | **ti dicono cosa fare** |
| `seat` | fra voi, e uno sconosciuto | **chiedi qualcosa** |
| `seat-neighbour` | il cinese | ⭐ **conversazione vera** |
| `before-takeoff` | l'hostess a tutti | **ascolti e basta** |

*Il quarto è il picco: **l'unico dove lo studente fa una conversazione con qualcuno che non è la
sua famiglia**.*

---

# Da collocare

*Emersi nominando dove una struttura torna (regola 1.23). **L'ordine si fissa quando si scrivono**,
non adesso.*

### Narrativi

| Episodio | Cosa insegna |
|---|---|
| `toilet` — il bagno in volo | `excuse me` per far alzare · `sorry` per lo sbaglio. **Episodio corto** |
| `drinks-cart` — il carrello delle bevande | `a` / `an` — *venti caffè uguali* |
| `taxi` — il taxi all'arrivo | `the` — *un taxi solo, in contrasto col carrello* |
| `restaurant` — il ristorante | `excuse me` per chiamare — *il terzo uso* |
| `hotel-reception` — la reception | il resto della famiglia: `husband`, `mother`, `father` |

### Grammaticali che aprono

`nomi-propri` *(R.1)* — **dopo il ritiro bagagli**

### Di pronuncia

`gh-muta` *(parte da `daughter` e `flight`)* · `e-finale` *(fra il 4 e il 5)* · `th`

### Grammaticali che riordinano — *vengono dopo*

`saluti` · `formule-di-servizio` · `please-1` · `please-2`

### Trappole

`articolo-di-troppo` · `youre-welcome` · `eta-con-avere` · `preposizioni-paesi`

---

## Come si legge questo file

**Un episodio dichiara la sua sequenza di moduli**, non il contrario: *`gate` e `aircraft-door`
usano `narrativo-standard`, i grammaticali useranno `grammaticale`, quelli di pronuncia una terza
ancora.*

**E `benvenuto` ne avrà una sua**, di un modulo solo — *la più corta che possa esistere.*

**E i raggruppamenti sono etichette su un tratto**, non una proprietà dell'episodio: *un episodio
non "è" A1.2, sta in un tratto che si chiama così.* **Se lo sposti cambia gruppo, ed è giusto** —
il gruppo dice **a che punto sei**, non **cosa sei**.

*È la ragione per cui il livello non compare nel nome dei file.*
