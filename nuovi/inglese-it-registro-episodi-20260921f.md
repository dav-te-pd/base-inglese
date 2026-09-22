**Versione: 20260921f**

# Registro degli episodi — inglese per italiani

---

## 1 — FONTE E METODO

**REGISTRO-EPISODI_001** · Questo file tiene **quello che attraversa gli episodi**: le regole valide per
tutti, e il tabellone. *Quello che riguarda un episodio solo sta nel suo file.*

**REGISTRO-EPISODI_002** · ⚠️ **Il tabellone non ricopia il contenuto.** *Una battuta, una skill, una
riga della matrice stanno **solo** nel file dell'episodio: qui si citano col codice (`GATE_030`).
Due copie della stessa cosa divergono.*

**REGISTRO-EPISODI_003** · ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola
master 1.5).

---

## 2 — LE SEZIONI DI UN EPISODIO

**REGISTRO-EPISODI_004** · **Ogni file episodio ha queste tredici sezioni, in quest'ordine:**

| # | Sezione | Cosa contiene |
|---|---|---|
| 1 | Fonte e metodo | il JSON che alimenta, il messaggio fisso, il rimando a questo registro |
| 2 | L'episodio | id, nome mostrato (la fonte è `struttura-corso`), categoria, sequenza dei moduli, numeri attesi |
| 3 | La scena | dove, chi, cosa succede — il testo della pagina di inizio episodio e del video |
| 4 | Contenuti video — messaggi iniziali e finali | le idee per il video dell'episodio, scritte mentre lo si pensa |
| 5 | Contenuti social | le idee per i social, idem |
| 6 | Cosa insegna | le strutture, gli esclusi di proposito, i vincoli sulla sequenza |
| 7 | La matrice | i gradi D → C → B → A |
| 8 | Le skill | una per battuta, testo completo |
| 9 | Personaggi ed etichette | la tabella da cui si trascrive `dialogueSpeakerLabels` |
| 10 | Personalizzazione | gli slot e i loro id |
| 11 | Note di scrittura | le scelte che non si vedono dalla matrice |
| 12 | Regole in sospeso | le strutture entrate senza la loro scheda |
| 13 | Chiavi del JSON | le chiavi che l'episodio porta |

**REGISTRO-EPISODI_005** · ⚠️ **Se una sezione non ha niente, si scrive un punto `·`** — *così si vede
che non è stata dimenticata.*

**REGISTRO-EPISODI_006** · **La prima riga di ogni file è la versione, e solo quella:**
`**Versione: 20260921c**`. *Nella chat il nome del file porta la versione
(`inglese-it-gate-20260921c.md`); nel repository no — Davide la toglie prima di caricarlo, perché
test e rimandi leggono i file per nome.*

**REGISTRO-EPISODI_022** · **Il nome mostrato e la categoria di un episodio vivono in
`inglese-it-struttura-corso`**, tabella degli episodi. *Il file episodio li cita, non li ripete.*
Categorie: **`storia`**, **`grammatica`**, **`pronuncia`**.

**REGISTRO-EPISODI_023** · **La scena è anche il testo della pagina di inizio episodio e la base del
video.** *Le idee per video e social si scrivono nelle sezioni 4 e 5 mentre si scrive l'episodio —
non dopo, a memoria.*

---

## 3 — REGOLE PER TUTTI GLI EPISODI

### La matrice

**REGISTRO-EPISODI_007** · **Una matrice sola, e i gradi ne discendono.** *Il grado D è il dialogo; il
resto si ricava per sottrazione* (regole 1.3 e 2.11).

**REGISTRO-EPISODI_008** · **Grado C: dove la frase è identica alla battuta si scrive `= dN`** e non si
ricopia. *La colonna «Perché differisce» non resta mai vuota: se non differisce, «identica».*

**REGISTRO-EPISODI_009** · **B contiene quello che si produce intero, C quello che si costruisce.** *La
prova: puoi cambiarci dentro un pezzo e ottenere un'altra frase valida dello stesso tipo? Se sì è
C, se no è B.* **Non contano la lunghezza né il punto interrogativo.**

**REGISTRO-EPISODI_010** · **Grado A: un inglese la dice da sola?** (regola 2.16). *Se no, non sta in A:
vive nei chunk di B e C.*

**REGISTRO-EPISODI_011** · **Maiuscole:** in A e B minuscolo, tranne dove la lingua la impone. In C e D
scrittura normale (regola 4.4).

### Le skill

**REGISTRO-EPISODI_012** · Nel JSON il campo è **`whatYouLearn`**, **sempre una lista** anche con una
skill sola. Ogni voce ha `title` e `body`. *HTML consentito nel corpo, niente `<p>`, `<br>` per
andare a capo.*

**REGISTRO-EPISODI_013** · **Una skill spiega l'uso, non la grammatica.** *Può richiamare una
struttura già vista, non insegnarla* (regole 4.5 e 4.10).

**REGISTRO-EPISODI_014** · **Nelle skill i segnaposto vengono sostituiti**, e la citazione inglese
chiede il valore inglese con `{{chiave:en}}`. *«I am from {{partenza:en}}» rende «I am from Turin»
nella citazione e «vengo da Torino» nella prosa.*

### Personaggi ed etichette

**REGISTRO-EPISODI_015** · **La colonna «Chi» della matrice non è la fonte delle etichette:** *la fonte
è la tabella della sezione 9 dell'episodio.*

**REGISTRO-EPISODI_016** · **L'etichetta porta il contorno: il mestiere più dove sta** — *Hostess al
gate · Hostess alla porta · Hostess col carrello.* **Anche se in scena ce n'è una sola:** *lo studente
non vede un episodio, vede una serie.*

**REGISTRO-EPISODI_017** · **Le etichette dei personaggi personalizzabili non portano il nome scelto:**
*sopra la bolla «Papà», non «Marco». Il nome sta dentro la battuta, dove lo studente lo impara.*

**REGISTRO-EPISODI_018** · **I nomi descrivono, non etichettano:** *«Hostess al gate», non «Guida».*

### La personalizzazione

**REGISTRO-EPISODI_019** · **L'episodio elenca gli id che usa, uno per uno** — non «tutti quelli della
tabella» (regola 5.7).

**REGISTRO-EPISODI_020** · **Nel dialogo i nomi di persona non si traducono mai; i toponimi sì**
(Torino → Turin). *I cognomi non hanno forma inglese.* **È la regola da cui discende la colonna
`traducibile` delle tabelle.**

**REGISTRO-EPISODI_021** · **Le destinazioni sono città, non nazioni:** *la nazione viene con la città,
altrimenti gli accenti dei personaggi non tornano col posto.*

**REGISTRO-EPISODI_025** · ⚠️ **Fra le destinazioni non si mettono città con l'articolo nel nome** — Il
Cairo, L'Avana, L'Aia. *In italiano vogliono «al», «all'» invece di «a»: una battuta «andiamo a
{destinazione}» produrrebbe «a Il Cairo».*

**REGISTRO-EPISODI_027** · ⚠️ **Finché la famiglia è in una delle città a scelta, l'episodio non nomina
niente che esista solo in una di esse.** *Mercato, ristorante, cinema, piscina, hotel funzionano
uguali a Pechino, Shanghai e Hong Kong.*

---

## 4 — IL TABELLONE — PARTE ALTA: GLI EPISODI

·

## 5 — IL TABELLONE — PARTE BASSA: PER L'EPISODIO SUCCESSIVO

### Regole in sospeso

·

### Strutture grammaticali

·

### Personaggi ricorrenti

·

### Promesse

·

### Voci

·

---

## 6 — FILE DA AGGIORNARE QUANDO NASCE UN EPISODIO

**REGISTRO-EPISODI_024** · **Ogni episodio nuovo tocca questi file.** *È la checklist: se uno non è
stato toccato, o l'episodio non ne aveva bisogno — e va detto — o è stato dimenticato.*

| File | Cosa ci si scrive | Chi |
|---|---|---|
| `inglese-it-{id}` | il file dell'episodio, tredici sezioni | noi |
| `inglese-it-registro-episodi` | la riga del tabellone, sospesi, strutture, promesse, voci | noi |
| `inglese-it-struttura-corso` | la riga nella tabella degli episodi: id, nome, categoria, sequenza | noi |
| `inglese-it-sequenza-episodi` | la posizione dell'episodio | noi |
| `inglese-it-inventario-grammaticale` | le strutture nuove che l'episodio apre | noi, se serve |
| `inglese-it-tabelle-personalizzazione` | slot o valori nuovi | noi, se serve |
| `inglese-it-obiettivi-a1` | l'obiettivo che l'episodio copre | noi, se serve |
| `APPLINGUE-registro-voci` | le voci nuove — *finché non entra in questo registro* | noi |
| `data/inglese/it/inglese-it-{id}.json` | la trascrizione | Claude Code |

---

## 7 — TROVATE, NON ANCORA USATE

**REGISTRO-EPISODI_026** · **Qui, e solo qui, stanno le trappole trovate e le regole in sospeso che
nessun episodio usa ancora.** *Quando un episodio ne usa una, passa nel file dell'episodio e nella
sua riga del tabellone — **e da qui si cancella**.*

### Trappole

| Trappola | Dove è descritta | Quando si può usare |
|---|---|---|
| L'articolo di troppo — `I like the coffee` | `inventario` 2.3 | dopo la 2.2, quando lo studente ha usato `the` qualche volta |
| `thirteen` / `thirty` — l'accento | `inventario` 3.1 | con la 3.2, da 20 a 100 |
| `half past seven` — «mezza dopo le sette» | `inventario` 3.3 | con la scheda dell'ora |
| `good night` solo andando via | `inventario` R.9 | ⚠️ serve una scena di congedo |
| «Mark» invece di «Marco» | `inventario` R.1 | l'episodio dei nomi propri |
| `I have ten years` — l'episodio trappola | `inventario` R.3 | dopo che lo studente ha avuto occasione di sbagliare |
| `sorry` invece di `excuse me` al cameriere | `obiettivi-a1` 016 | il ristorante |
| Le città con l'articolo — «al Cairo» | `025` qui sopra | ⚠️ *oggi evitata scegliendo le destinazioni* |
| Le preposizioni dei paesi — *in* Cina, *negli* Stati Uniti, *nei* Paesi Bassi | · | un episodio trappola, dopo che lo studente ha incontrato più casi |
| `you're welcome` lontano da `welcome aboard` — stessa parola, significato opposto | `aircraft-door` 018 | un episodio trappola, dopo che `welcome` è consolidato |

### Regole in sospeso

| Regola | Nata da | Quando si può usare |
|---|---|---|
| `an hour`, `a university` — la regola è il **suono**, non la lettera | `inventario` 2.1 | quando ne compare uno in un dialogo |

### Tappe della rotta

| Tappa | Come ci si arriva | Accento |
|---|---|---|
| Xi'an | il treno veloce da Pechino | cinese |
| Chengdu | · | cinese |

### Episodi da collocare

*L'ordine si fissa quando si scrivono. Quando un episodio entra in sequenza, passa in
`inglese-it-sequenza-episodi` e da qui si cancella.*

| Episodio | Categoria | Cosa insegna |
|---|---|---|
| `toilet` — il bagno in volo | `storia` | `excuse me` per far alzare · `sorry` per lo sbaglio. **Episodio corto** |
| `drinks-cart` — il carrello delle bevande | `storia` | `a` / `an` — *venti caffè uguali* (inventario 2.1) |
| `taxi` — il taxi all'arrivo | `storia` | `the` — *un taxi solo* (inventario 2.2) |
| `restaurant` — il ristorante | `storia` | `excuse me` per chiamare — *il terzo uso* |
| `hotel-reception` — la reception | `storia` | il resto della famiglia: `husband`, `mother`, `father` |
| `nomi-propri` | `grammatica` · apre | R.1 — **dopo il ritiro bagagli o al controllo passaporti**, dove si incontrano nomi veri |
| `gh-muta` | `pronuncia` | parte da `daughter` e `flight` |
| `th` | `pronuncia` | · |
| `saluti` | `grammatica` · riordina | R.9 — *viene dopo* |
| `formule-di-servizio` | `grammatica` · riordina | *viene dopo* |
| `please-1`, `please-2` | `grammatica` · riordina | *i quattro significati di `please`* |
| `articolo-di-troppo` | trappola | inventario 2.3 |
| `youre-welcome` | trappola | vedi le trappole qui sopra |
| `eta-con-avere` | trappola | inventario R.3 |
| `preposizioni-paesi` | trappola | vedi le trappole qui sopra |
