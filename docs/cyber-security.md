# Cyber-security

**Deciso il 2026-09-20, su proposta di chi guida il progetto.** Qui stanno le
tre cose che riguardano la sicurezza dell'app: **cosa si può portare via**,
**cosa uno studente può vedere e cambiare**, e **cosa si perde se qualcosa va
storto**.

> ⚠️ **PERCHÉ UN FILE SUO E NON UNA SEZIONE DI `decisioni-stato.md`**, ed è una
> ragione e non una preferenza: quel file ha come proprietà dichiarata che **si
> svuota** — una riga si sposta in `correzioni.md` quando viene eseguita e
> sparisce. *Un registro della sicurezza fa l'opposto: si ACCUMULA.* Un
> controllo fatto sei mesi fa non smette di essere un fatto perché è stato
> fatto, e sapere **quando** si è guardata una cosa l'ultima volta è metà
> dell'informazione. Mettere qui dentro righe che si svuotano, o là dentro
> righe che restano, romperebbe una delle due proprietà.

---

## ⚠️ DOVE SIAMO ADESSO — e va letto prima di tutto il resto

**Il repository è PUBBLICO e il sito è servito in chiaro. Oggi chiunque scarica
tutto**: il codice, i file degli episodi, le traduzioni, le risposte dei quiz.
Non è una falla da trovare: è lo stato dichiarato, e vale finché non si passa a
repository privato + Supabase.

**Quindi questo file non serve a scoprire che siamo esposti — lo sappiamo. Serve
a non dare per fatto, dopo Supabase, quello che Supabase non fa.**

---

## Le due analisi, e sono DUE perché rispondono a due domande diverse

**Condizione di esecuzione: dopo l'implementazione di Supabase.** Farle adesso
misurerebbe un sistema che stiamo per sostituire.

### A) Analisi di penetrazione — *«cosa può ROMPERE o CAMBIARE»*

Non «si può entrare», che è troppo vago per essere misurato. Le domande vere:

| | |
|---|---|
| **Uno studente può leggere i dati di un ALTRO studente?** | I progressi, il nome, le risposte |
| **Uno studente può SCRIVERE dove non deve?** | Il proprio punteggio, la configurazione del corso, i progressi altrui |
| **Il pannello Admin è raggiungibile senza essere admin?** | Vedi la voce su `config` in `decisioni-stato.md` |
| **Una chiave o una password sono finite dentro qualcosa che il browser scarica?** | Il caso più comune e il più banale: una chiave in un file JS |
| **Il repository contiene un segreto nella sua STORIA?** | Togliere un file non toglie il commit che l'ha aggiunto |

### B) Analisi di scaricamento abusivo — *«cosa si può PORTARE VIA»*

È la domanda che conta di più per questo progetto, perché **il contenuto è il
lavoro**: gli episodi, le traduzioni, le spiegazioni, le tabelle.

| | |
|---|---|
| **Cosa arriva al browser, e quanto di quello serve DAVVERO a quella schermata** | Vedi «le regole stanno sul server» e la nota sul CSS in `decisioni-stato.md` |
| **Un episodio si può scaricare per intero con una richiesta sola?** | Oggi sì: è un file JSON |
| **Le risposte dei quiz arrivano insieme alle domande?** | Oggi sì — è il punto di copia, ed è scritto nella dichiarazione dell'astrazione della fonte |
| **Si può scaricare TUTTO il catalogo indovinando i nomi?** | `…-gate.json`, `…-aircraft-door.json`: i nomi sono descrittivi per scelta |
| **Quanto costa a chi copia?** | *La domanda giusta non è «si può impedire» — non si può. È «quanto lavoro costa», e se costa più che rifarlo da capo* |

⚠️ **E IL CASO DI STUDIO C'È GIÀ:** `https://guida.omney.io/coaching`, dove
scaricare i dati è risultato quasi impossibile. **Va analizzato per capire come
fanno**, ed è registrato in `decisioni-stato.md`. *Un esempio che funziona vale più di
un elenco di tecniche.*

---

## I test, e sono la parte che rende vero tutto il resto

> **Un'analisi è una fotografia. Un test è una sveglia.**

Le due analisi qui sopra, fatte una volta, dicono com'erano le cose quel giorno.
**Quello che serve è che ogni implementazione successiva venga misurata contro
le stesse domande**, senza che qualcuno debba ricordarsene — che è esattamente
la forma che questo progetto ha già applicato quattro volte (la guardia di
`hidden`, i percorsi di `test-env.js`, la versione sui tag, le dipendenze
dichiarate).

**Quindi: test veri, nella suite o in una corsa loro, non un documento da
rileggere.** Quello che devono guardare, e ogni riga è una cosa che oggi non ha
nessuna rete:

1. **Nessun segreto nel repository.** Chiavi, token, password, URL interni — nel
   codice **e nella storia dei commit**.
2. **Nessuna chiave nel pacchetto che arriva al browser.** È una cosa diversa
   dalla prima: una chiave può essere legittima nel repository (una chiave
   pubblica di Supabase lo è) e **non** legittima in una pagina, o viceversa.
3. **Un utente non legge i dati di un altro.** Si guida: due profili, e il
   secondo chiede i dati del primo. Deve ricevere un rifiuto, non una lista
   vuota — *«vuota» e «vietata» si somigliano e sono cose diverse.*
4. **Un utente non scrive dove non deve.** Stessa forma, dal lato della
   scrittura.
5. **Quello che arriva alla pagina non contiene più di quello che la pagina
   mostra.** È la traduzione misurabile di «al browser il minimo possibile».

⚠️ **OGNI QUANTO: da decidere, e la decisione va presa quando i test
esistono, non adesso.** *Una cadenza scelta prima di avere la cosa da lanciare è
un numero senza misura — e questo progetto ha già pagato un numero scritto in un
documento e creduto attuale (regola 38).* Le due possibilità reali sono «a ogni
push, dentro la CI» e «una corsa a parte, più lenta e più profonda»; quale delle
due dipende da quanto durano, che si saprà dopo.

---

## I backup

**Da fare, e non è la stessa cosa della sicurezza:** serve contro un furto **e**
contro un guasto, e il secondo è molto più probabile del primo.

| Cosa | Dove vive oggi | Cosa si perde |
|---|---|---|
| Il codice e i contenuti | Git (GitHub) | Poco: la storia è già distribuita |
| I progressi degli studenti | `localStorage`, cioè **il browser di ognuno** | **Tutto**, e in silenzio: basta che qualcuno pulisca il browser |
| I dati dopo Supabase | Il database | Tutto, se non c'è un backup |

⚠️ **La riga di mezzo è quella che conta oggi, ed è già vera adesso:** i
progressi di uno studente vivono **solo** nel suo browser. Nessun furto, nessun
attacco — basta cambiare telefono. *Non è un rischio futuro da mettere in
elenco: è una perdita che può succedere stasera.* Supabase la chiude, ed è una
delle ragioni per cui va fatto.

---

## Le due prove da fare appena si può, già registrate altrove

Stanno in `decisioni-stato.md` e si ripetono qui perché sono il passaggio che apre
tutto questo:

1. **La CI su 4 CPU** — se il runner ne ha 4, la suite costa la metà.
2. **Repository privato + Supabase**, insieme: il privato chiude la prima delle
   due minacce (il codice), Supabase la seconda (il contenuto servito in
   chiaro). ⚠️ **Sono due minacce diverse e il repository privato NON tocca la
   seconda** — il sito resta pubblico, e i suoi file si scaricano lo stesso.

---

## Cronologia

*Vuota: nessun controllo ancora eseguito. La prima riga arriva con la prima
analisi, dopo Supabase.*

| Data | Cosa è stato guardato | Cosa si è trovato |
|---|---|---|
| — | — | — |
