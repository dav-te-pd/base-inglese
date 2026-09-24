> # ⚠️ ARCHIVIO — FOTOGRAFIA DATATA, NON DESCRIVE L'APP DI OGGI
>
> | | |
> |---|---|
> | **Quando** | 2026-09-19 |
> | **Cos'era** | una valutazione a codice fermo sul commit `e567182`, con `index.html` a 2105 righe |
> | **Perche' e' in archivio** | **le sue proposte sono state eseguite** (passi C1, C2, A, B), quindi descrive un `index.html` che non esiste piu' |
> | **Cosa guardare invece** | `docs/decisioni-storico.md` per come e' finita |
>
> *Archiviato il 2026-09-24. Non si aggiorna: un file in `docs/archivio/` e' un
> fatto storico, e correggerlo vorrebbe dire falsificare una fotografia.*

---

# Valutazione: il catalogo e lo stato di sessione

**2026-09-19, a codice fermo.** Niente è stato modificato per scriverla —
`index.html` e `app/` sono quelli del commit `e567182`. È una valutazione
(regola 34): la decisione è di chi guida il progetto, l'esecuzione arriva
con un prompt suo.

## Cosa resta davvero in `index.html`

L'IIFE è **2105 righe, di cui 1053 di codice**. Divise per mestiere:

| | Gruppo | righe | codice |
|---|---|---|---|
| ① | il **ponte degli alias** (`var X = BI.X`) | 178 | 156 |
| ② | tre pezzi di interfaccia condivisa | 56 | 29 |
| ③ | config-reveal, modulo d'aiuto, etichette | 187 | 99 |
| ④ | **aritmetica della mastery** + `pendingMastery` | 170 | 91 |
| ⑤ | **IL CATALOGO** (descrittori, `EPISODES`, ordine) | 240 | 118 |
| ⑥ | esito finale + slot fields + target tokens | 163 | 88 |
| ⑦ | **STATO DI SESSIONE** | 126 | **29** |
| ⑧ | apertura moduli (`openModuleFromMap`) | 164 | 55 |
| ⑨ | i quattro bloccati + migrazioni | 303 | 143 |
| ⑩ | **la SCHERMATA MORTA** (`view-pronunciation`) | 244 | 141 |

## La proposta sono DUE cose, e non si somigliano

**Lo stato di sessione è 29 righe di codice ed è già dietro un'interfaccia.**
`BI.episodioCorrente()` e `BI.valoriCorrenti()` esistono, sono **funzioni e non
alias**, e contano **77 siti in 7 file**. Misurato: **nessun file di `app/`
legge `currentEpisode`, `currentValues` o `pendingMastery` direttamente** — le
uniche occorrenze là sono prosa dentro i commenti.

**Il catalogo è 118 righe di codice e ha un lettore solo fuori:** `app/mappa.js`,
con **4 siti** su `BI.EPISODES`. Più una chiamata che va **in avanti**
(`BI.openModuleFromMap`), dichiarata in testa a `mappa.js`.

*Metterli nello stesso passo li lega senza che niente li leghi.*

## ⚠️ Sceglierei diversamente, e sono tre misure

### ① La schermata morta è il 23% di quello che resta, e va per prima

`startPronunciationExercise` ha **una sola occorrenza in tutto il repository:
la propria definizione.** Le altre quattro sono commenti che lo dicono già.
La vista `view-pronunciation` **non è raggiungibile da nessun punto dell'app**:
244 righe di JS, 59 di markup, 4 listener, un apparato `SpeechRecognition`
intero.

⚠️ **Ma NON è «cancella un intervallo», ed è la ragione per cui va guardata
prima e non dopo: il listener globale in cattura della Regola Azione Critica
sta IN MEZZO** (riga 5648), fra `submitAttempt` e il blocco
`SpeechRecognition`. È vivo, è essenziale, ed è quello che interroga
`BI.dgAudioProtected`. **Togliere la vista è separare, non cancellare.**

**E c'è una dipendenza concreta che decide l'ordine, non una preferenza:**
dentro la schermata morta, `buildTargetTokens(currentEpisode, currentValues)`
legge lo stato di sessione. Spostando prima lo stato, quel sito andrebbe
aggiornato — **per poi sparire.** Al contrario, togliendo prima la vista, lo
stato di sessione ha un lettore in meno da portarsi dietro.

### ② Lo stato di sessione è il più economico dei tre, e sblocca i quattro

I quattro pezzi bloccati (`itemText`, `recordPendingMastery`,
`recordMultipleChoiceResult`, `buildMultipleChoiceOptions`) sono **20 siti in 6
file**, e sono bloccati **solo** da lui. Escono insieme.

Dopo, le dipendenze all'insù passano da **10 a 1** (resta `applyEpisodeDialogue`
di `dati.js`, per scelta dichiarata). *È l'unico dei tre passi che fa scendere
il numero che questa serie esiste per far scendere.*

### ③ Il catalogo è l'unico con una DECISIONE dentro, e non è tecnica

La regola 26 la nomina già: **`CONFIG.grades`, `CONFIG.gradeNames`,
`CONFIG.moduleTypes` e `CONFIG.sequences` sono valori globali singoli**, quindi
con una seconda edizione due `struttura-corso.md` rivendicherebbero la stessa
voce.

**Spostare il catalogo è il momento in cui quella scelta costa poco o costa
molto**: se esce come un file che legge da un unico globale, la seconda
edizione la ritrova identica; se esce già per edizione, non si ripresenta mai.
**Va decisa prima di eseguire, non durante** — è esattamente il caso «noi
cambiamo senza sapere» della regola 43.

## L'ordine che proporrei

| | Passo | Cosa fa scendere |
|---|---|---|
| **A** | la schermata morta esce (e il listener globale si separa) | −244 righe JS, −59 markup, −4 listener |
| **B** | lo stato di sessione + i quattro bloccati | **dipendenze all'insù 10 → 1** |
| **C** | il catalogo, dopo aver deciso la domanda delle edizioni | −118 righe di codice, e `mappa.js` smette di chiedere |

**Il ponte degli alias (①, 156 righe) non è un passo:** cala da solo a ogni
passo, perché esiste solo per i nomi che il codice rimasto usa ancora nudi.

## Cosa si rompe, per passo

**A — la schermata morta.** Cadono **4 voci di `tests/BASELINE-LISTENER.txt`**
(`speak-btn`, `mic-btn`, `edit-custom`, `back-home`), ed è la prima volta in
tutta la serie che quel file cambia legittimamente: finora un suo diff era un
errore. *Va dichiarato nel commit, o il giro dopo sembrerà una regressione.*
Rischio basso: niente lo raggiunge.

⚠️ **E una cosa che va decisa, non dedotta:** `LEVEL_CLASS` e la classe `new`
hanno **un lettore solo**, `renderPhrase`, che sta dentro la vista morta. **La
regola 39 di `CLAUDE.md` li cita come esempio** — *«l'unico lettore che abbia
mai disegnato quei colori lo sa»*. La regola resta giusta sulla decisione; la
frase che la illustra punta a codice che nessuno può eseguire. **Segnalato, non
toccato** (regola 34).

**B — lo stato di sessione.** Rischio **medio**, ed è il passo che tocca più
file. Ma l'interfaccia c'è già e nessuno la scavalca: la misura dice **zero
letture diirette da `app/`**. Il caso più diverso da guardare è
**`app/personalizza.js`**, l'unico che **SCRIVE** nei valori
(`BI.valoriCorrenti()[key] = …`) invece di leggerli soltanto — con un
accessore che torna l'oggetto, scrivere funziona; con uno che ne torna una
copia, smette di funzionare **in silenzio**.

**C — il catalogo.** Rischio **alto se la domanda delle edizioni non è decisa
prima**, basso dopo. `mappa.js` ha 4 siti; `openModuleFromMap` è la chiamata in
avanti e si chiude qui.

## Costo

In giri di questa serie — un passo, una suite, una lettura della CI:
**A** un giro. **B** uno o due (i quattro pezzi possono essere un giro a parte).
**C** uno, più il giro di decisione che lo precede.

## Le domande da decidere

1. **L'ordine A → B → C, o un altro?** La sola parte con una ragione *misurata*
   e non di gusto è che **A viene prima di B** (`buildTargetTokens`).
2. **Le edizioni:** i quattro globali di `CONFIG` escono per edizione adesso o
   restano singoli? Non si può eseguire C senza aver risposto.
3. **`LEVEL_CLASS` e la frase della regola 39:** si tolgono col resto della
   vista morta e si corregge la frase, oppure la classe `new` si tiene perché
   un report futuro la userà?
