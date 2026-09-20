# Componenti singoli

**La sala d'attesa, non il cimitero.** Un pezzo sta qui quando **oggi lo usa un
file solo**. Non vuol dire che non sia un componente: vuol dire che non lo è
*ancora*, e dice cosa può diventare.

> **Si legge questo elenco PRIMA di scrivere un pezzo nuovo**, subito dopo
> [`componenti-condivisi.md`](componenti-condivisi.md). Se qui c'è qualcosa che
> fa quello che serve, **lo si promuove** — la riga si sposta nell'altro file
> **nello stesso commit che deduplica**.

## Perché due file e non uno

Il criterio «un pezzo ci sta se e solo se è usato da più di un modulo» è
verificabile, ma **sette copie identiche non sono "usate da più di un modulo":
ognuna è usata da uno.** Con un file solo, il catalogo sarebbe nato dicendo «il
Blocco Ascolto non è un componente condiviso» — vero secondo il criterio, falso
secondo la realtà. Con due file, alla fine si **legge** questa lista: sette voci
con lo stesso nome saltano all'occhio. **Il controllo diventa leggere, non
cercare.**

## Le tre colonne

Le stesse dell'altro file, e per le stesse ragioni: **cosa fa** (nelle parole di
chi ne ha bisogno), **cosa gli passi → cosa torna**, **cosa dà per scontato**.

## La grep chiusa

Prima di scrivere la riga di un pezzo si prende **una stringa distintiva da
dentro quel pezzo** — una classe CSS, un `aria-label`, un attributo `data-` — e
la si cerca nel repository.

*È la differenza che conta: un censimento è una ricerca **aperta**, e fallisce in
silenzio perché «non ho trovato altro» è indistinguibile da «non ho cercato
bene». Questa è **chiusa**: una stringa che hai davanti, un comando, un numero.
**O il numero è 1, o non lo è.** È esattamente così che sono state trovate le
sette copie del Blocco Ascolto.*

## Quanto manca

`node tests/tools/censimento-pezzi.js` — vedi
[`componenti-condivisi.md`](componenti-condivisi.md).

---

## `app/dati.js`

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `percorsoEdizione` | Il percorso di un file dell'edizione viva, ricavato da `CONFIG.edizione` invece che scritto a mano. **L'unico punto che sa dove stanno i dati.** | `nomeFile` → `data/{lingua}/{studente}/{nomeFile}?v=…` | Che `CONFIG.edizione` esista già (viene da `app/config.js`, tag bloccante). ⚠️ **È il pezzo che si sposterà in `app/fonte.js`** al passo 1.7: quando i dati verranno dal server, cambierà solo lui. |
| `conVersione` | Attacca a un percorso la stessa `?v=` con cui il browser ha chiesto `app/dati.js`. | `percorso` → percorso con `?v=`, o **nudo** se il tag non porta versione | Che il file sia caricato da un `<script src>` con la sua versione. Si degrada invece di rompersi: senza versione i percorsi restano quelli di ieri. |
| `episodeDataFile` | Il percorso del file di un episodio, ricavato dall'id. | `episodeId` → percorso completo | Che l'id sia quello congelato (`gate`, `aircraft-door`) e non un numero di posizione. Compone il **prefisso** unendo le due metà della coppia con un trattino: è l'unico dei percorsi che le usa due volte e in due forme. |
| `applicaStruttura` | Travasa su `APP_CONFIG` le sei chiavi del file di struttura, poi **riapplica gli override** del Pannello Admin. | `dati` (il JSON) → niente | Che giri **prima** di `costruisciPassi()`. L'ordine dei due passaggi non è scambiabile: gli override stanno sopra il file, mai sotto. |

## `app/avvio.js`

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `applyConfigOverrides` | Applica sopra `APP_CONFIG` gli override salvati dal Pannello Admin, **una sezione di primo livello per volta**. | `()` → niente | Che `window.APP_CONFIG` esista. ⚠️ **Va chiamata di nuovo ogni volta che qualcosa riscrive quelle chiavi** — oggi lo fa `applicaStruttura` — altrimenti un file in arrivo cancella in silenzio quello che una persona ha appena salvato. |

## `app/repeataloud.js`

*(da catalogare — `node tests/tools/censimento-pezzi.js` dice quanti)*
