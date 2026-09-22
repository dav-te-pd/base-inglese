# `nuovi/` — la cartella di appoggio

**Qui dentro ci sono i file che chi guida il progetto ha caricato per farli
guardare, PRIMA di sostituire quelli veri.** Non è una cartella di lavoro e non
è un archivio: è una sala d'attesa, e si svuota.

Nata il 2026-09-22, su richiesta: *«Voglio mettere i file nuovi in un posto solo
per farteli leggere. Non cancelliamo gli altri finché non siamo sicuri che
vadano bene.»*

---

## Le quattro cose da sapere, e sono tutte misurate

### ① Sta alla radice del repository, NON sotto `docs/`, e non è una preferenza

`tests/test_nomenclatura_edizione.js` scandisce **`data/` e `docs/`** e pretende
esattamente quattro pezzi di percorso — `{radice}/{lingua}/{studente}/{file}` —
col nome che comincia per `{L}-{S}-`.

| Se i file nuovi stessero qui | Il test |
|---|---|
| `docs/nuovi/inglese-it-gate.md` | **non li vede** — scende di due livelli e lì trova un file, non una cartella |
| `docs/inglese/it-nuovo/inglese-it-gate.md` | **ROSSO** — si aspetta il prefisso `inglese-it-nuovo-` |

*«Non li vede in silenzio» non è una buona notizia: è una cartella che un test
guarda **quasi**, e il primo file messo mezzo passo più in là diventa rosso
senza che si capisca perché.* Fuori da `data/` e `docs/` non c'è nessun
vincolo, e non per fortuna: **nessun test della suite scandisce altre radici** —
i `readdirSync` guardano solo `app/` e `tests/`.

### ② I NOMI QUI DENTRO POSSONO ESSERE VERSIONATI, ed è voluto

`inglese-it-gate-v2.md`, `inglese-it-gate-2026-09-22.md`, quello che serve a
chi carica per non perdersi. **Nessun test guarda questi nomi** (vedi ①),
quindi la convenzione della regola 4 qui non si applica — e **non va
«sistemata» da una sessione futura che la trova.**

La convenzione torna a valere nell'istante in cui il file viene promosso: al
suo posto vero ci arriva col nome definitivo, senza versione.

### ③ La CI NON parte per un push che tocca solo questa cartella

`.github/workflows/regressione.yml` porta `paths-ignore: ['nuovi/**']`.

⚠️ **È l'unico `paths-ignore` che non può marcire, e il motivo è questo:** un
filtro che esclude una cartella *letta da qualcuno* invecchia in silenzio il
giorno in cui qualcuno la legge. Questa, per definizione, non la legge né
l'app né un test — se un giorno la leggesse qualcuno, vorrebbe dire che i file
sono stati promossi e non sono più qui.

**Un push che mescola `nuovi/` e codice fa partire la suite lo stesso:** GitHub
salta il workflow solo quando **tutti** i file cambiati cadono nel filtro.

### ④ Da qui non si promuove niente di iniziativa

Quello che sta qui è **contenuto di chi guida il progetto**, esattamente come
`docs/{lingua}/` (regola 33) — solo che la regola 33 nomina quella cartella e
non questa, quindi lo dice questo file.

Il giro è: si legge, si confrontano le differenze con il file vero, si
riportano, **e si aspetta l'ok.** Una sessione futura che trova qui dentro un
file «ovviamente più nuovo» di quello vero **non lo copia sopra**.

---

## Come finisce un file di qui

1. Chi guida il progetto lo carica, col nome che preferisce.
2. Io lo confronto con il suo corrispondente in `data/` o `docs/` e riporto le
   differenze, file per file.
3. Lui decide.
4. Il file va al suo posto **col nome definitivo** e la copia qui sparisce nello
   stesso commit.

*Se questa cartella contiene solo questo LEGGIMI, non c'è niente in attesa.*
