**Versione: 20260921a**

# Sequenza degli episodi — inglese per italiani

---

## 1 — FONTE E METODO

**SEQUENZA-EPISODI_001** · Questo file dice **l'ordine in cui gli episodi si incontrano**, e i tratti che
li raggruppano.

**SEQUENZA-EPISODI_002** · **L'ordine è quello delle righe.** *Nessun numero: gli episodi si spostano, e
il riferimento stabile è l'id.* **Spostare un episodio è spostare una riga.**

**SEQUENZA-EPISODI_003** · **Gli episodi non ancora in sequenza stanno nel registro degli episodi**,
sezione «Trovate, non ancora usate». *Qui solo quelli che hanno un posto.*

**SEQUENZA-EPISODI_004** · **Nome e categoria di ogni episodio vivono in `inglese-it-struttura-corso`.**
*Qui si citano.*

**SEQUENZA-EPISODI_005** · ⚠️ **APERTO — dove vive l'ordine nel codice.** *Questo file diceva che
`CONFIG.episodes` porta gli stessi id, aggiornati a mano; oggi gli episodi stanno in
`inglese-it-struttura-corso.json`.* **Da verificare con Claude Code.**

**SEQUENZA-EPISODI_006** · ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola
master 1.5).

---

## 2 — I TRATTI

**SEQUENZA-EPISODI_007** · **Un tratto è un'etichetta su un pezzo di sequenza, non una proprietà
dell'episodio.** *Un episodio non «è» A1.2: sta in un tratto che si chiama così. Se lo sposti cambia
tratto, ed è giusto — il tratto dice **a che punto sei**, non **cosa sei**.*

**SEQUENZA-EPISODI_008** · *È la ragione per cui il livello non compare nel nome dei file.*

**SEQUENZA-EPISODI_009** · ⚠️ **APERTO — la stagione è A1, e A1.1 e A1.2 sono tratti dentro la stagione.**
*Come si chiamano per lo studente, se si vedono, è da decidere col tabellone degli episodi.*

---

## 3 — A1.1 — L'APERTURA, LE FONDAMENTA, L'INIZIO DEL VIAGGIO

| Episodio | Categoria | Stato |
|---|---|---|
| `benvenuto` | apertura del corso | **da creare** — *per ora serve solo lo spazio* |
| `numeri` | `grammatica` · apre | scheda 3.1 fatta, **episodio da scrivere** |
| `verb-to-be` | `grammatica` · apre | scheda 1.1 fatta, **episodio da scrivere** |
| `gate` | `storia` | ✅ scritto e trascritto |
| `aircraft-door` | `storia` | ✅ scritto e trascritto |

**SEQUENZA-EPISODI_010** · **I due episodi di grammatica stanno prima di `gate`:** *`gate` usa `I am`, `we
are` e le età — senza il verbo essere e i numeri, comparirebbero senza che nessuna scheda le abbia
aperte* (regola 1.1).

### `benvenuto`

**SEQUENZA-EPISODI_011** · **Per ora serve solo lo spazio:** *un modulo solo, un testo qualunque, il
pulsante in fondo sempre verde.* **Tiene il posto occupato per quando i moduli veri arriveranno.**

**SEQUENZA-EPISODI_012** · **Cosa conterrà:** *come funziona una serie — episodi, moduli, ripetizioni,
quiz, **il metodo PRETTE**, perché si torna sulle stesse cose — e come funziona l'app — i tasti, la
mappa, Help, Spiegazione, i report, dove si vedono i progressi.*

**SEQUENZA-EPISODI_013** · ⚠️ **Perché esiste:** *senza, il corso comincia con una tabella di
coniugazione — esattamente la cosa che il metodo dice di non fare.* **Con `benvenuto` prima si dice
cosa sta per succedere, poi si comincia**, e i due episodi di grammatica diventano «le fondamenta»
invece di «la prima cosa».

**SEQUENZA-EPISODI_014** · **Ha una sequenza dei moduli sua, di un modulo solo** — *la più corta che
possa esistere.*

---

## 4 — A1.2 — IN VOLO, E IL PRIMO PERSONAGGIO CHE TORNERÀ

| Episodio | Categoria | Stato |
|---|---|---|
| `seat` — il posto | `storia` | bozza |
| `seat-neighbour` — il vicino di posto | `storia` | bozza |
| `before-takeoff` — prima del decollo | `storia` | bozza |

### La progressione dello scambio

**SEQUENZA-EPISODI_015** · **Gli episodi crescono per tipo di scambio, non solo per argomento:**

| Episodio | Con chi | Che tipo di scambio |
|---|---|---|
| `gate` | l'hostess | **ti presenti tu** |
| `aircraft-door` | l'hostess | **ti dicono cosa fare** |
| `seat` | fra voi, e uno sconosciuto | **chiedi qualcosa** |
| `seat-neighbour` | il vicino cinese | ⭐ **conversazione vera** |
| `before-takeoff` | l'hostess a tutti | **ascolti e basta** |

**SEQUENZA-EPISODI_016** · ⭐ **`seat-neighbour` è il picco:** *l'unico dove lo studente parla con
qualcuno che non è la sua famiglia.*
