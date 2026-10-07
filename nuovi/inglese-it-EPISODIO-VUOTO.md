<!-- MODELLO DI UN FILE EPISODIO — 2026-10-07.
     È la forma ESATTA di un file vivo: sezioni 2-8 e niente altro.
     Si copia, si riempie, si rinomina in {lingua}-{studente}-{id}.md.
     Ogni tabella porta UNA riga di esempio, da sostituire, e i numeri attesi
     dicono 1: cosi' il modello SI TRASCRIVE com'e'. Un modello che non si
     trascrive puo' mentire sulla propria forma senza che nessuno se ne accorga.
     Quanto è rigido il parser sta in tests/tools/README.md, riga `trascrivi.js`.

     ⚠️ UNA TABELLA PER SEZIONE, E PER SOTTOSEZIONE DI GRADO. Una seconda —
     un esempio, un confronto, una nota messa in tabella — ferma la
     trascrizione. Succedeva in silenzio in tre modi diversi: il peggiore
     fondeva le due e faceva nascere una voce con id `id`.

     ⚠️ LA COLONNA `non con` — 2026-10-07. Ultima nelle sezioni dei gradi A, B
     e C; il grado D non ce l'ha, perche' nessun modulo presenta una battuta
     con delle alternative fra cui scegliere. Dentro ci vanno id dello STESSO
     grado dello STESSO episodio, fra apici inversi e separati da `·`; un `·`
     da solo vuol dire «nessuna esclusione». Un id che in quel grado non
     esiste ferma la trascrizione, e una coppia scritta in un verso solo pure:
     se A differisce da B solo per un segnaposto, allora B differisce da A.

     ⚠️ E IL BACINO NON SI CONTROLLA SU QUESTO FILE. `voci - 1 - esclusi` qui
     fa 0, perche' ogni grado porta una riga sola. Il modello prova la FORMA;
     il bacino e' una proprieta' del CONTENUTO, e si misura sugli episodi
     veri. Quattro voci per grado e' il minimo (`distrattori + 1`), e per
     portare anche una sola esclusione ce ne vogliono cinque. -->

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** 1 voci in A, 1 in B, 1 in C, 1 battute in D, 1 skill, 1 slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

## 3 — LA REGOLA GENERALE

| Testo |
|---|
| La regola di pronuncia che vale per tutto l'episodio. Sezione facoltativa: senza tabella, la chiave non nasce. |

## 4 — LA MATRICE

### Grado D — le battute

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `chiave-del-personaggio` | `staff` | The line in the language being taught. | La battuta nella lingua dello studente. |

### Grado C — le frasi

| id | en | it | da | non con |
|---|---|---|---|---|
| `c-1` | A sentence taken from a line. | Una frase ricavata da una battuta. | `d-1` | · |

### Grado B — le espressioni

| id | en | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `b-chiave` | set phrase | espressione | come si legge | categoria grammaticale | · |

### Grado A — le parole

| id | en | it | pronuncia | categoria | non con |
|---|---|---|---|---|---|
| `a-chiave` | word | parola | come si legge | categoria grammaticale | · |

## 5 — LE SKILL

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Il titolo della spiegazione | Il corpo, in HTML: `<br>` per andare a capo, `<strong>` per il grassetto. Le citazioni chiedono il loro ruolo con `{{chiave:target}}`. |

## 6 — PERSONAGGI ED ETICHETTE

| chiave | etichetta a schermo |
|---|---|
| `chiave-del-personaggio` | Etichetta col CONTORNO, non il solo mestiere |

## 7 — GLI SLOT

| chiave | etichetta | tipo | tabella | righe | predefinito |
|---|---|---|---|---|---|
| `chiave` | Etichetta che legge lo studente | `select` | `gruppo.tabella` | · | `valore-predefinito` |

## 8 — LE TABELLE INTERNE ALL'EPISODIO

| nome | gruppo | valori, in ordine |
|---|---|---|
| `nome-tabella` | `gruppo` | `valore-1` · `valore-2` |
