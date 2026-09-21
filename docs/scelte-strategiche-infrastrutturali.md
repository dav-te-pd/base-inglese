# Scelte strategiche e infrastrutturali

> ⚠️ **Non fondare decisioni su questo file senza verifica in chat.**
> Come ogni documento del progetto: quello che c'è scritto va riletto e
> validato prima di essere usato.

**Cosa ci sta dentro, e perché è un file suo.** Le scelte che non riguardano
*questa* app ma **il modo in cui le app vengono costruite, pubblicate e
protette**: dove vive il codice, dove vivono i dati, chi serve le pagine,
quanto costa, e cosa succede quando qualcosa va storto.

*Nato il 2026-09-21 su proposta di chi guida il progetto:* «**essendo che
queste scelte condizionano sicurezza, costi, metodi di lavoro, codice, ecc.,
propongo di fare un file a parte, così non si perdono nel marasma delle
informazioni.**»

⚠️ **E il motivo per cui NON possono stare in `decisioni-stato.md`:** quel file
**si svuota** — una riga eseguita se ne va in `correzioni.md`. Queste no. Una
scelta infrastrutturale **resta vera per anni** e va riletta ogni volta che
nasce un'app nuova. *È la stessa ragione per cui `cyber-security.md` è un file
suo: quello che si accumula non può vivere dove tutto si svuota.*

**Il suo vicino è `docs/cyber-security.md`**, e la divisione è questa: lì
**cosa si può portare via e cosa si rompe**; qui **cosa si compra, dove si
mette, e con quale metodo di lavoro**. I due si citano a vicenda.

---

## ⚠️ LA COSA CHE CAMBIA TUTTE LE RISPOSTE: NON È UN'APP SOLA

> *«di app ne faremo varie, non solo questa»*

Ogni scelta qui sotto va valutata **due volte**: quanto costa per questa app, e
quanto costa **per la decima**. *Una soluzione che costa poco una volta e va
rifatta a ogni app è più cara di una che costa di più una volta sola.*

---

# ① LO STATO DI OGGI — misurato, non ricordato

| | Oggi | Costo |
|---|---|---|
| **Codice** | GitHub, repository **pubblico** `dav-te-pd/base-inglese` | gratis |
| **Sito** | GitHub Pages, `https://dav-te-pd.github.io/base-inglese/` | gratis |
| **Contenuti** | file JSON serviti in chiaro dallo stesso sito | gratis |
| **Progressi dello studente** | `localStorage` del browser — **vivono solo su quel dispositivo** | gratis |
| **CI** | GitHub Actions, 6 min a corsa | **gratis perché il repository è pubblico** |
| **Riconoscimento vocale** | Web Speech API del browser (Chrome) | gratis |

**Quindi oggi l'infrastruttura costa ZERO, ed è il punto di partenza da cui
misurare ogni proposta.**

---

# ② LE QUATTRO DOMANDE APERTE

*Nessuna di queste è decisa. Stanno qui in ordine di quanto condizionano le
altre: la ① decide la ②, la ② decide la ③.*

## ②.1 — Dove vivono i DATI degli studenti

Oggi nel browser, quindi: **si perdono cambiando dispositivo, e si perdono
svuotando i dati del sito.** *Lo ha già visto chi guida il progetto, il
2026-09-21, uscendo dall'app murata.*

**Vincolo già dichiarato:** «*i progressi dello studente vivranno nel server,
non nel browser*».

**Candidato in piano:** Supabase.
**Da decidere:** se è il candidato giusto anche per la decima app, o se lo è
solo per questa.

## ②.2 — Chi SERVE le pagine, e quanto si può chiudere

⚠️ **La cosa da sapere prima di scegliere, perché è controintuitiva e già
misurata** (dettaglio in `docs/cyber-security.md`):

> **Rendere privato il repository NON chiude il sito.** Chiude il codice
> sorgente e la storia dei commit. **Non** chiude i file che il browser
> scarica, e **non** chiude la pagina pubblicata.

E su GitHub Pages in particolare:

| | |
|---|---|
| Pages su repository **privato** | richiede un piano a pagamento. Sul piano gratuito, rendere privato il repository **spegne il sito** |
| Pagine visibili **solo a chi è autenticato** | esistono **solo su Enterprise Cloud** |

**Quindi su un piano Pro o Team si ottiene: codice chiuso, sito aperto.** Non è
un difetto da aggirare: è il prodotto che è fatto così.

**Candidato in piano:** Cloudflare.
**Da decidere:** cosa esattamente gli si chiede — servire le pagine? proteggerle
dietro un accesso? stare davanti a Supabase? Sono tre mestieri diversi e non si
comprano insieme per forza.

## ②.3 — Quanto si manda al browser

**Vincolo già dichiarato, ed è il più ripetuto di tutti:** «*più le logiche
stanno sul server meglio è, e mandiamo al browser i pacchetti più piccoli
possibili*» — e **mai**, per quanto possibile, regole, algoritmi e commenti.

⚠️ **Ed è una scelta ARCHITETTURALE, non una compressione**: decide come sono
fatti i moduli, non come si spediscono. *Un file minificato contiene le stesse
regole; un file che non contiene le risposte del quiz no.*

**Il caso di studio è già segnato e non è stato ancora fatto:**
`https://guida.omney.io/coaching`, dove scaricare i dati è risultato quasi
impossibile. **Va guardato prima di decidere**, perché un esempio che funziona
vale più di un elenco di tecniche.

## ②.4 — Quanto costa, e quale costo SALE

**Oggi zero. Cosa comincia a costare, e in che ordine:**

| Voce | Quando comincia | Quanto |
|---|---|---|
| **Minuti di CI** | quando il repository diventa **privato** | 3000/mese inclusi nel piano. A 6 min a corsa = **500 corse al mese**, ~16 push al giorno |
| **Piano GitHub** | idem, se si vuole Pages su repository privato | da verificare al momento della scelta |
| **Supabase** | quando i progressi vanno sul server | da verificare |
| ⚠️ **Il riconoscimento vocale** | **se si smette di usare quello del browser** | **è il costo che rischia di salire davvero**, perché si paga ad audio inviato |

⚠️ **SULL'ULTIMA RIGA, la cosa che va capita prima di preoccuparsene:** oggi il
riconoscimento è la **Web Speech API del browser**, che non ci costa niente —
l'audio va a Google, non a noi. *Il lavoro sui tre timer (vedi
`decisioni-stato.md`, F.1) riduce l'audio inviato, ed è giusto farlo per
**l'esperienza dello studente**; diventa una questione di **costo** solo il
giorno in cui il riconoscimento si paga.* **Sono due ragioni diverse per lo
stesso lavoro, e chi guida il progetto le ha già separate: «prima risolviamo
l'esperienza dello studente».**

---

# ③ LE DECISIONI GIÀ PRESE CHE VINCOLANO LE ALTRE

*Non si rimettono in discussione qui: si elencano perché una scelta
infrastrutturale che le contraddice va scartata subito.*

| | Decisione | Dove è registrata |
|---|---|---|
| 1 | I progressi dello studente vivranno **nel server** | qui, ②.1 |
| 2 | Al browser va **il meno possibile**, e mai le regole | qui, ②.3 |
| 3 | Lo studente **non sceglie mai** l'episodio: la sequenza la organizza chi guida il progetto | `decisioni-stato.md`, passo 1.13 |
| 4 | Il Pannello Admin, quando sarà vero, **non sarà raggiungibile da nessuno** — `config` si chiude a tutti | `decisioni-stato.md` |
| 5 | Un'edizione `{lingua}/{studente}` è **indipendente**: una correzione non viaggia da sola nelle altre | `CLAUDE.md` regola 4 |
| 6 | **Prima l'inglese funziona**, poi il francese | detto in chat, 2026-09-21 |

---

# ④ QUANDO SI DECIDE

**Alla tappa ③ («LA MESSA IN SICUREZZA»), e prima di scrivere una riga di
Supabase.** Il giro è quello della regola 34: proposta → valutazione →
decisione → esecuzione.

⚠️ **E la valutazione va fatta con DUE cose in mano, non una:** i costi dei
piani **e** l'analisi di Omney. *Scegliere l'infrastruttura senza aver guardato
come fa chi ci è già riuscito significa comprare prima di sapere cosa serve.*

---

## Cronologia delle decisioni

| Data | Cosa è stato deciso | Cosa lo ha motivato |
|---|---|---|
| 2026-09-21 | **Nasce questo file** | Le scelte infrastrutturali si perdevano dentro `decisioni-stato.md`, che **si svuota**, mentre queste **si accumulano** |
| — | *nessuna scelta ancora presa* | — |
