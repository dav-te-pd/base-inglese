# `nuovi/` — la cartella di consegna

**Riscritto il 2026-09-28 da chi guida il progetto.** *La versione precedente
spiegava bene i vincoli e diceva male il mestiere: raccontava **come finisce**
un file invece di dire **quando uno ci entra e quando ne esce**. La differenza
si vede quando un file resta qui e nessuno sa dire se è in attesa o
dimenticato.*

---

## La convenzione, e sono quattro righe

> **`nuovi/` è la cartella di CONSEGNA, non un archivio.**
>
> **Ci si mette un file** quando è pronto per essere trascritto, o per farlo
> verificare prima — **senza che parta la CI**.
>
> **Si toglie quando è trascritto**, e chi toglie è Claude, **con un commit**:
> così si vede nella storia.
>
> **Se un file sta qui da più di qualche giorno, o è stato dimenticato o non
> era pronto.**

⚠️ **L'ultima riga è la sola che può accorgersi di un errore, e per questo
c'è.** *Le prime tre dicono cosa fare; quella dice **cosa guardare quando
nessuno ha fatto niente**. Un file fermo non dà nessun segnale da solo: non
rompe un test, non compare in un rosso, non cambia una schermata.*

---

## I quattro vincoli, misurati

*Non sono la convenzione: sono le ragioni per cui la cartella sta dove sta.
Ognuno è stato misurato, e la data è parte del fatto.*

### ① Sta alla radice del repository, NON sotto `docs/`

`tests/test_nomenclatura_edizione.js` scandisce **`data/` e `docs/`** e pretende
esattamente quattro pezzi di percorso — `{radice}/{lingua}/{studente}/{file}` —
col nome che comincia per `{L}-{S}-`.

| Se i file di consegna stessero qui | Il test |
|---|---|
| `docs/nuovi/inglese-it-gate.md` | **non li vede** — scende di due livelli e lì trova un file, non una cartella |
| `docs/inglese/it-nuovo/inglese-it-gate.md` | **ROSSO** — si aspetta il prefisso `inglese-it-nuovo-` |

*«Non li vede in silenzio» non è una buona notizia: è una cartella che un test
guarda **quasi**, e il primo file messo mezzo passo più in là diventa rosso
senza che si capisca perché.*

⚠️ **E dal 2026-09-28 quel test conosce UN solo nome riservato — `condivisi` —
che non è una lingua e ha la sua convenzione di prefisso.** *`nuovi` non è fra
quelli, e non deve esserlo: sta fuori da `data/` e `docs/`, quindi il test non
ci passa mai.*

### ② I nomi qui dentro possono essere versionati, ed è voluto

`it-istruzioni-moduli-20260928a.md`, `inglese-it-gate-v2.md`, quello che serve a
chi consegna per non perdersi. **Misurato il 2026-09-28: nessun test e nessuna
riga dell'app nomina questa cartella** — quindi la convenzione della regola 4
qui non si applica, e **non va «sistemata» da una sessione futura che la
trova.**

La convenzione torna a valere nell'istante in cui il file viene trascritto: al
suo posto vero ci arriva col nome definitivo, senza versione.

### ③ La CI NON parte per un push che tocca solo questa cartella

`.github/workflows/regressione.yml` porta `paths-ignore: ['nuovi/**']`.

⚠️ **È l'unico `paths-ignore` che non può marcire, e il motivo è questo:** un
filtro che esclude una cartella *letta da qualcuno* invecchia in silenzio il
giorno in cui qualcuno la legge. Questa, per definizione, non la legge né
l'app né un test — se un giorno la leggesse qualcuno, vorrebbe dire che il file
è stato trascritto e non è più qui.

**Un push che mescola `nuovi/` e codice fa partire la suite lo stesso:** GitHub
salta il workflow solo quando **tutti** i file cambiati cadono nel filtro.

### ④ Da qui non si trascrive niente di iniziativa

Quello che sta qui è **contenuto di chi guida il progetto**, esattamente come
`docs/{lingua}/` (regola 33) — solo che la regola 33 nomina quella cartella e
non questa, quindi lo dice questo file.

Il giro è: si legge, si **misura** contro il file vero, si riportano le
differenze, **e si aspetta l'ok.** Una sessione futura che trova qui dentro un
file «ovviamente più nuovo» di quello vero **non lo copia sopra**.

---

## I file `-VUOTO`

**Non sono in consegna: sono il MODELLO di un file dati.** Portano le sezioni
coi titoli esatti, le tabelle, le colonne e **una riga di esempio** — niente
contenuto vero, apposta.

Dentro ognuno, in testa, c'è una cosa che non sta da nessun'altra parte:
**quanto è rigido il parser** di quel file — cosa cerca, come, e cosa lo rompe.

⚠️ **IL LIMITE, DICHIARATO DA CHI GUIDA IL PROGETTO IL 2026-09-28, E NON È UNA
CRITICA AL MODELLO: UN FILE VUOTO DICE MENO DI UNO PIENO.**

> *«Lo `struttura-corso-VUOTO` esiste per un caso solo — cominciare
> un'edizione nuova — e sabato ne ho cominciata una, lo spagnolo, e non l'ho
> usato. Ho copiato il file vero dell'inglese e cambiato le celle che cambiano.
> **Non per pigrizia: un file pieno dice cose che uno vuoto non può dire — che
> forma ha un id, com'è fatta una cella davvero.**»*

**Restano qui, e la decisione è «per il momento»:** la parte che un file pieno
non può dare — *quanto è rigido il parser* — vale ancora, e vive solo lì.
