# Componenti condivisi

**Il magazzino da cui si preleva.** Un pezzo sta qui quando **più di un file lo
usa già**. Prima di scrivere qualcosa di nuovo si guarda qui, poi in
[`componenti-singoli.md`](componenti-singoli.md) — e se là c'è qualcosa che fa
quello che serve, **lo si promuove invece di riscriverlo**. Creare un pezzo
nuovo è l'ultima spiaggia, non la prima.

> ⚠️ **Il passo ② è quello che oggi mancava, ed è il motivo per cui sono
> esistiti sette Blocchi Ascolto:** nessuno aveva un posto dove guardare prima
> di scrivere.

## Le tre colonne, e perché sono tre

| Colonna | Cosa ci va |
|---|---|
| **Cosa fa** | il comportamento **nelle parole di chi ne ha bisogno**, non del modulo che ce l'ha. *«pulsante ascolta + velocità» sette volte di fila si vede; «audio di Repeat Aloud» no.* |
| **Cosa gli passi → cosa torna** | la firma in chiaro |
| **Cosa dà per scontato** | *«vuole un contenitore già flex», «il testo lo risolve chi chiama», «scrive nel `localStorage` dell'episodio corrente», «va chiamato dopo che i dati sono arrivati»* |

**Il terzo campo esiste perché la gente non riscrive un pezzo perché non l'ha
trovato — riscrive perché l'ha trovato e non ha capito se le andava bene.** Una
firma non lo dice; i presupposti sì.

## La regola del passaggio

Quando un **secondo** file comincia a usare un pezzo, la riga si sposta qui **nello
stesso commit che lo deduplica**. Mai in due posti, mai «poi».
*`componenti-singoli.md` non è un cimitero, è una sala d'attesa.*

## Quanto manca — e si conta, non si stima

```
node tests/tools/censimento-pezzi.js
```

Per ogni funzione dichiarata in `app/*.js` e ogni classe introdotta in
`stile/*.css`, la riga deve comparire in **esattamente uno** dei due documenti.
Lo strumento dice quante mancano **e in quale file stanno**, così il lavoro si
prende un file per volta invece che «quando capita». Con `--elenco` le nomina.

⚠️ **Lo strumento sa dire SE un pezzo è catalogato, non se la riga dice il
vero:** i tre campi li scrive una persona leggendo la funzione. Conta le righe;
non le sa scrivere.

---

## `app/dati.js` — chi va a prendere i file

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `loadEpisodeData` | Il contenuto di un episodio, preso una volta e poi tenuto in memoria. È da qui che passa **ogni** modulo che mostra parole, frasi o battute. | `module` (il descrittore del passo, di cui usa `dataFile`) → `Promise` del JSON dell'episodio | Che il descrittore **abbia** un `dataFile`: Personalizza è l'unico modulo che non ce l'ha, e su di lui `fetch(undefined)` fallisce. Il rifiuto **arriva a chi chiama**, che deve mandarlo a `showLoadError` — qui non si assorbe niente. |
| `episodeGrade` | Le voci di un grado (`A` parole, `B` espressioni, `C` frasi, `D` battute) di un episodio già caricato. | `(data, grado)` → array di voci, **`[]` se il grado non c'è** | Che `data` sia già arrivato. Il `[]` è la trappola: un grado assente e un grado vuoto si leggono uguali — se il modulo non può lavorare senza, serve `episodeGradeRequired`. |
| `episodeGradeRequired` | Come sopra, ma **alza** invece di tornare vuoto: è la forma da usare quando un passo senza quel grado non ha senso. | `(data, grado, module)` → array non vuoto, oppure `throw` che nomina il passo e il grado | Che chi chiama lasci salire l'eccezione fino alla schermata d'errore. *Nasce da un guasto muto: un grado mancante produceva un modulo vuoto invece di un messaggio.* |
| `loadModuleInstructions` | I testi che spiegano **come si usa** un modulo (`howItWorks`, `helpReminder`), da `istruzioni-moduli.json`. Sette file la chiamano. | `()` → `Promise` dell'oggetto, una chiave per `kind` di modulo | Che il chiamante gestisca il rifiuto: per Help e Spiegazione **non è bloccante** e si usa la frase di ultima istanza (regola 35), per l'apertura di un modulo lo è. Il risultato è **in cache**: la seconda chiamata non tocca la rete. |
| `istruzioniInMemoria` | Gli stessi testi **solo se sono già arrivati**, senza chiedere niente alla rete. Serve a chi deve disegnare subito e non può aspettare. | `()` → l'oggetto, oppure `null` | Che chi la usa sappia **gestire il `null`**: è tutto il suo senso. Chiamarla e usare il risultato senza controllare produce una schermata con i testi vuoti — che si legge come rotta, non come «sta caricando». |
| `loadFeedbackMessages` | I testi che **rispondono a un esito** (fine modulo, tentativi), da `messaggi-feedback.json`. Distinti dai precedenti: lì *come si usa*, qui *com'è andata*. | `()` → `Promise` dell'oggetto | Stessa cache e stesso rifiuto di `loadModuleInstructions`. |
| `loadPersonalizationTables` | Le tabelle condivise di nomi, città e paesi dell'edizione. | `()` → `Promise` di `{ people, places }` | ⚠️ **Applica sopra il file gli override salvati dal Pannello Admin**: chi la sostituisse con un `fetch` nudo farebbe sparire le personalizzazioni **senza un errore e senza un rosso**. |
| `caricaStrutturaCorso` | La struttura del corso dell'edizione — gradi, nomi dei gradi, categorie, sequenze, elenco degli episodi, lingue del parlato — e la **applica** a `APP_CONFIG`. | `()` → `Promise` dei dati grezzi | Che sia chiamata **prima di disegnare qualunque cosa**: senza, non esiste nessuna mappa. Riapplica gli override del pannello **dopo** il file, altrimenti il `fetch` cancellerebbe in silenzio la sequenza appena riordinata a mano. |

## `app/orchestrazione.js` — chi decide cosa si vede

| Pezzo | Cosa fa | Cosa gli passi → cosa torna | Cosa dà per scontato |
|---|---|---|---|
| `showView` | Accende una vista e spegne le altre. **Ha un mestiere solo: cambiare la vista attiva.** | `nome` della vista (`'map'`, `'onboarding'`, …) → niente | ⚠️ **NON pulisce più niente, ed è una regola** (regola 21, riscritta il 2026-09-17): timer, registrazioni e sequenze in corso li azzera `stopAllModuleActivity`, che **chiama chi lascia un modulo**, non chi disegna. *Prima la pulizia viaggiava attaccata qui, e su due dei quattordici punti di chiamata era un no-op garantito: una cosa che risponde a due domande dà la risposta giusta a una e sbagliata all'altra.* |
