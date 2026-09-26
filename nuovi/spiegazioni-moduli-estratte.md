# Le sedici spiegazioni del popup «Spiegazione» — TESTO ESATTO

*Estratto il 2026-09-26 da `data/inglese/it/inglese-it-istruzioni-moduli.json`,
chiave `<kind>.howItWorks`. **Nessuna parola cambiata.** Questo file e' un
APPOGGIO in `nuovi/`, non una fonte: la fonte nascera' quando questa roba
entrera' nella sezione 6 di `inglese-it-struttura-corso.md`.*

⚠️ **Il `body` e' HTML pronto** (`<p>`, `<b>`, `<em>`, e il riquadro
`<div class="general-rule panel">`): l'app lo inserisce con `innerHTML`, quindi
nel markdown va cosi' com'e'. *Togliere i tag vuol dire perdere i capoversi.*

⚠️ **UNA RIGA PER `kind`, NON PER PASSO.** I 22 passi della sequenza
`narrativo-standard` hanno **15 id distinti**, e due di quelli
(`flashcardAEngIta`, `flashcardAItaEng`) condividono `kind: 'flashcard'`:
**14 kind di modulo + 2 schermate = 16 testi.** La colonna «passi» dice quante
volte quel testo viene mostrato in un episodio.

## La tabella

| # | kind | Passi | Titolo | Car. | Corpo (HTML esatto, su una riga) |
|---|---|---|---|---|---|
| 1 | `personalizzazione` | 1 | Your Story | 617 | <p>Qui puoi scegliere i nomi dei personaggi della storia, o lasciare quelli proposti — nessuna scelta è obbligatoria.</p><p>Tocca un campo per cambiarlo tra le opzioni disponibili, o il pulsante 'Reset' per tornare al valore di default.</p><p><b>Attenzione:</b> queste scelte valgono per TUTTO l'episodio — cambiarle a metà strada creerebbe confusione con quello che hai già esercitato. Se vuoi cambiarle dopo aver iniziato, dovrai rifare l'episodio da capo.</p><p>In fondo alla pagina trovi anche un modo per suggerirci nomi o parole che non trovi nelle liste.</p><p>Quando sei pronto, premi 'Inizia l'episodio'.</p> |
| 2 | `meetTheStory` | 1 | Meet the Story | 532 | <p>È il tuo primo incontro con la storia dell'episodio: qui si ascolta, non si studia.</p><p>Ogni battuta ha il pulsante 🔊 per sentirla, e puoi scegliere la velocità se va troppo veloce. La traduzione è già lì sotto, sempre visibile: a questo punto non hai ancora studiato niente, quindi non ha senso nasconderla.</p><p>Ascolta il dialogo tutte le volte che vuoi. Non devi ricordare niente adesso: le parole, le frasi e le regole arrivano nei moduli successivi.</p><p>Quando ti sei fatto un'idea della storia, premi "Ho finito".</p> |
| 3 | `repeatAloud` | 2 | Repeat Aloud | 753 | <p>Ascolta ogni parola con il pulsante 🔊 (puoi scegliere la velocità), leggi la traduzione e il suggerimento di pronuncia.</p><p>Ripeti più volte finché non ti sembra uguale. Non ti preoccupare se ti sembra diverso: è normale, stai imparando. Arriveranno successivamente esercizi in cui capiremo insieme se la tua pronuncia è corretta.</p><p>Poi passa alla successiva. Quando hai ripassato tutte le parole, premi "Ho finito, torna alla mappa".</p><p>Se non lo vuoi fare adesso, clicca semplicemente "Mappa".</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 4 | `matchEngIta` | 3 | Match Practice en→it | 549 | <p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta.</p><p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p><p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 5 | `matchItaEng` | 3 | Match Practice it→en | 549 | <p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta.</p><p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p><p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 6 | `flashcard` | 3 | Flash Card | 661 | <p>Guarda la parola sulla carta, ascoltala se vuoi.</p><p>Prima di girarla, prova a indovinarla — ragionaci un attimo, ma senza impazzire: se non sei sicuro, tocca semplicemente 'Non ancora', tanto tornerà come da Metodo Prette.</p><p>Poi toccala per girarla e vedere la traduzione.</p><p>Dopo averla girata, dicci se te la sei ricordata o no — se dici 'non ancora', te la riproporremo finché non la impari davvero.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 7 | `voicePractice` | 2 | Voice Practice | 1045 | <p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p><p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla.</p><p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Con "Esercitati ancora" puoi riprovare la stessa frase più volte — il contatore ti mostra sempre quante te ne restano; esaurite, si va avanti comunque.</p><p>Qui non c'è un ripasso finale delle frasi andate meno bene: è uno spazio libero per allenarti, non una verifica.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div> |
| 8 | `whyWeSayIt` | 1 | Why We Say It | 865 | <p>Il dialogo lo conosci già: qui si guarda <em>perché</em> si dice così.</p><p>Su quasi ogni battuta trovi uno o più pulsanti con il nome di una regola. Al primo giro si aprono in ordine, una alla volta: leggila e poi dì se ti è chiara — non c'è una risposta giusta, serve solo a sapere cosa vale la pena rivedere. Dichiarata quella, si apre la successiva.</p><p>Puoi ascoltare ogni riga con il pulsante 🔊 (puoi scegliere la velocità) e aprire "Mostra traduzione" se ti serve una mano.</p><p>Quando le hai viste tutte, premi "Ho finito". Se devi interrompere, "Esci e riprendi dopo" tiene il punto in cui sei arrivato.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 9 | `dialogoAscoltaRipeti` | 1 | Dialogue: Listen & Repeat | 801 | <p>Questo è il dialogo intero dell'episodio, dall'inizio alla fine.</p><p>Tocca una battuta qualsiasi per ascoltarla, poi ripetila ad alta voce. Puoi riascoltarla quante volte vuoi, e nell'ordine che preferisci.</p><p>La spunta verde ti ricorda quali battute hai già ascoltato.</p><p>Il pulsante in alto apre tutte le traduzioni insieme: usalo quando ti serve, e prova a usarlo sempre meno — è così che il cervello si abitua a leggere l'inglese senza appoggiarsi all'italiano.</p><p>Quando hai ascoltato tutte le battute, in fondo trovi la domanda finale.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div> |
| 10 | `dialogoRipetiATempo` | 1 | Dialogue: Repeat in Time | 963 | <p>Stesso dialogo di prima, ma questa volta con il tempo.</p><p>Tocca una battuta: la senti, e subito dopo parte una barra. Quella barra è il tuo turno — ripeti ad alta voce mentre scorre.</p><p>Mentre la battuta suona e mentre scorre la barra non puoi toccare nient'altro: serve a farti fare davvero l'esercizio, senza scappare avanti.</p><p>Qui non ci sono traduzioni: a questo punto dovresti già capire il dialogo. Se ti accorgi di non ricordarlo, torna un passaggio indietro e rifai "Ascolta e ripeti".</p><p>Sei tu a decidere quando passare alla battuta successiva.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div><p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere. Fa la stessa cosa del pulsante "Prossima frase".</p> |
| 11 | `dialogoContinuo` | 1 | Dialogue: Real Dialogue | 839 | <p>Questa è la prova generale: il dialogo intero scorre da solo, dall'inizio alla fine, esattamente come lo sentirai in una conversazione vera.</p><p>Dopo un breve conto alla rovescia parte la prima battuta. La ascolti, ripeti ad alta voce mentre scorre la barra, e appena finisce parte da sola la battuta dopo — senza che tu debba toccare nulla.</p><p>Se hai bisogno di fermarti, usa il pulsante di pausa.</p><p>Se riesci a stare dietro al dialogo intero senza fermarti, sei pronto per il Test.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div><p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere.</p> |
| 12 | `speedMatchEngIta` | 1 | Speed Match en→it | 572 | <p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p><p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div> |
| 13 | `speedMatchItaEng` | 1 | Speed Match it→en | 572 | <p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p><p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div> |
| 14 | `voiceCoach` | 1 | Voice Check | 986 | <p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p><p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla — prima di inviare puoi sempre cambiare idea.</p><p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Una sola registrazione conta per ogni frase: come sempre, a fine esercizio ti verranno riproposte le frasi andate meno bene, per una comprensione ottimale e duratura.</p><div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div> |
| 15 | `listaEpisodi` | — (schermata) | I tuoi episodi | 254 | <p>Questa è la lista degli episodi del corso, nell'ordine in cui si fanno.</p><p>Puoi aprire l'episodio attuale, o tornare su uno che hai già finito. Il successivo si sblocca quando hai completato <b>l'ultimo passaggio</b> di quello che stai facendo.</p> |
| 16 | `mappaEpisodio` | — (schermata) | Mappa dell'episodio | 315 | <p>Questa è la mappa dell'episodio: mostra tutti i passaggi che farai, in ordine.</p><p>Puoi cliccare solo sul passaggio attuale (evidenziato) o tornare a rivedere uno già completato — non puoi saltare avanti a un passaggio non ancora sbloccato.</p><p>Completa un passaggio alla volta per avanzare nella storia.</p> |

## Il corpo di ognuno, a capo come lo si legge

### 1. `personalizzazione` — Your Story

```html
<p>Qui puoi scegliere i nomi dei personaggi della storia, o lasciare quelli proposti — nessuna scelta è obbligatoria.</p>
<p>Tocca un campo per cambiarlo tra le opzioni disponibili, o il pulsante 'Reset' per tornare al valore di default.</p>
<p><b>Attenzione:</b> queste scelte valgono per TUTTO l'episodio — cambiarle a metà strada creerebbe confusione con quello che hai già esercitato. Se vuoi cambiarle dopo aver iniziato, dovrai rifare l'episodio da capo.</p>
<p>In fondo alla pagina trovi anche un modo per suggerirci nomi o parole che non trovi nelle liste.</p>
<p>Quando sei pronto, premi 'Inizia l'episodio'.</p>
```

### 2. `meetTheStory` — Meet the Story

```html
<p>È il tuo primo incontro con la storia dell'episodio: qui si ascolta, non si studia.</p>
<p>Ogni battuta ha il pulsante 🔊 per sentirla, e puoi scegliere la velocità se va troppo veloce. La traduzione è già lì sotto, sempre visibile: a questo punto non hai ancora studiato niente, quindi non ha senso nasconderla.</p>
<p>Ascolta il dialogo tutte le volte che vuoi. Non devi ricordare niente adesso: le parole, le frasi e le regole arrivano nei moduli successivi.</p>
<p>Quando ti sei fatto un'idea della storia, premi "Ho finito".</p>
```

### 3. `repeatAloud` — Repeat Aloud

```html
<p>Ascolta ogni parola con il pulsante 🔊 (puoi scegliere la velocità), leggi la traduzione e il suggerimento di pronuncia.</p>
<p>Ripeti più volte finché non ti sembra uguale. Non ti preoccupare se ti sembra diverso: è normale, stai imparando. Arriveranno successivamente esercizi in cui capiremo insieme se la tua pronuncia è corretta.</p>
<p>Poi passa alla successiva. Quando hai ripassato tutte le parole, premi "Ho finito, torna alla mappa".</p>
<p>Se non lo vuoi fare adesso, clicca semplicemente "Mappa".</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 4. `matchEngIta` — Match Practice en→it

```html
<p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta.</p>
<p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p>
<p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 5. `matchItaEng` — Match Practice it→en

```html
<p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta.</p>
<p>Qui non c'è tempo limite: prenditi il momento che ti serve per ragionarci.</p>
<p>Come sempre, a fine esercizio ti verranno riproposte le domande che hai sbagliato, per una comprensione ottimale e duratura.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 6. `flashcard` — Flash Card

```html
<p>Guarda la parola sulla carta, ascoltala se vuoi.</p>
<p>Prima di girarla, prova a indovinarla — ragionaci un attimo, ma senza impazzire: se non sei sicuro, tocca semplicemente 'Non ancora', tanto tornerà come da Metodo Prette.</p>
<p>Poi toccala per girarla e vedere la traduzione.</p>
<p>Dopo averla girata, dicci se te la sei ricordata o no — se dici 'non ancora', te la riproporremo finché non la impari davvero.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 7. `voicePractice` — Voice Practice

```html
<p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p>
<p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla.</p>
<p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Con "Esercitati ancora" puoi riprovare la stessa frase più volte — il contatore ti mostra sempre quante te ne restano; esaurite, si va avanti comunque.</p>
<p>Qui non c'è un ripasso finale delle frasi andate meno bene: è uno spazio libero per allenarti, non una verifica.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
```

### 8. `whyWeSayIt` — Why We Say It

```html
<p>Il dialogo lo conosci già: qui si guarda <em>perché</em> si dice così.</p>
<p>Su quasi ogni battuta trovi uno o più pulsanti con il nome di una regola. Al primo giro si aprono in ordine, una alla volta: leggila e poi dì se ti è chiara — non c'è una risposta giusta, serve solo a sapere cosa vale la pena rivedere. Dichiarata quella, si apre la successiva.</p>
<p>Puoi ascoltare ogni riga con il pulsante 🔊 (puoi scegliere la velocità) e aprire "Mostra traduzione" se ti serve una mano.</p>
<p>Quando le hai viste tutte, premi "Ho finito". Se devi interrompere, "Esci e riprendi dopo" tiene il punto in cui sei arrivato.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 9. `dialogoAscoltaRipeti` — Dialogue: Listen & Repeat

```html
<p>Questo è il dialogo intero dell'episodio, dall'inizio alla fine.</p>
<p>Tocca una battuta qualsiasi per ascoltarla, poi ripetila ad alta voce. Puoi riascoltarla quante volte vuoi, e nell'ordine che preferisci.</p>
<p>La spunta verde ti ricorda quali battute hai già ascoltato.</p>
<p>Il pulsante in alto apre tutte le traduzioni insieme: usalo quando ti serve, e prova a usarlo sempre meno — è così che il cervello si abitua a leggere l'inglese senza appoggiarsi all'italiano.</p>
<p>Quando hai ascoltato tutte le battute, in fondo trovi la domanda finale.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico.</div>
```

### 10. `dialogoRipetiATempo` — Dialogue: Repeat in Time

```html
<p>Stesso dialogo di prima, ma questa volta con il tempo.</p>
<p>Tocca una battuta: la senti, e subito dopo parte una barra. Quella barra è il tuo turno — ripeti ad alta voce mentre scorre.</p>
<p>Mentre la battuta suona e mentre scorre la barra non puoi toccare nient'altro: serve a farti fare davvero l'esercizio, senza scappare avanti.</p>
<p>Qui non ci sono traduzioni: a questo punto dovresti già capire il dialogo. Se ti accorgi di non ricordarlo, torna un passaggio indietro e rifai "Ascolta e ripeti".</p>
<p>Sei tu a decidere quando passare alla battuta successiva.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
<p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere. Fa la stessa cosa del pulsante "Prossima frase".</p>
```

### 11. `dialogoContinuo` — Dialogue: Real Dialogue

```html
<p>Questa è la prova generale: il dialogo intero scorre da solo, dall'inizio alla fine, esattamente come lo sentirai in una conversazione vera.</p>
<p>Dopo un breve conto alla rovescia parte la prima battuta. La ascolti, ripeti ad alta voce mentre scorre la barra, e appena finisce parte da sola la battuta dopo — senza che tu debba toccare nulla.</p>
<p>Se hai bisogno di fermarti, usa il pulsante di pausa.</p>
<p>Se riesci a stare dietro al dialogo intero senza fermarti, sei pronto per il Test.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
<p>Mentre scorre la barra puoi toccare la battuta per passare subito alla successiva, senza aspettare la fine: serve a chi ha già finito di ripetere.</p>
```

### 12. `speedMatchEngIta` — Speed Match en→it

```html
<p>Vedrai una parola in inglese e 4 possibili traduzioni in italiano — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p>
<p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
```

### 13. `speedMatchItaEng` — Speed Match it→en

```html
<p>Vedrai una parola in italiano e 4 possibili traduzioni in inglese — tocca quella giusta prima che scada il tempo, o tocca "Non lo so" se non la ricordi.</p>
<p>L'obiettivo non è la velocità, è la correttezza. Se sbagli, ti mostreremo la risposta giusta: leggila e memorizzala, è così che si avanza nel Metodo Prette — ogni errore torna nei ripassi finché non diventa un successo.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
```

### 14. `voiceCoach` — Voice Check

```html
<p>Leggi la frase in italiano, ascolta il modello inglese con il pulsante 🔊 (puoi scegliere la velocità), poi tocca il microfono per registrare — lo stesso pulsante diventa rosso e si trasforma in uno stop.</p>
<p>Tocca di nuovo per fermarti quando hai finito di parlare (si ferma anche da solo se resti in silenzio o se superi il tempo massimo). A quel punto scegli se inviare la registrazione per la valutazione oppure cancellarla e rifarla — prima di inviare puoi sempre cambiare idea.</p>
<p>Dopo l'invio, vedrai ogni parola colorata: verde se corretta, giallo se simile, rosso se da rivedere, insieme a un punteggio a stelle. Una sola registrazione conta per ogni frase: come sempre, a fine esercizio ti verranno riproposte le frasi andate meno bene, per una comprensione ottimale e duratura.</p>
<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo.</div>
```

### 15. `listaEpisodi` — I tuoi episodi

```html
<p>Questa è la lista degli episodi del corso, nell'ordine in cui si fanno.</p>
<p>Puoi aprire l'episodio attuale, o tornare su uno che hai già finito. Il successivo si sblocca quando hai completato <b>l'ultimo passaggio</b> di quello che stai facendo.</p>
```

### 16. `mappaEpisodio` — Mappa dell'episodio

```html
<p>Questa è la mappa dell'episodio: mostra tutti i passaggi che farai, in ordine.</p>
<p>Puoi cliccare solo sul passaggio attuale (evidenziato) o tornare a rivedere uno già completato — non puoi saltare avanti a un passaggio non ancora sbloccato.</p>
<p>Completa un passaggio alla volta per avanzare nella storia.</p>
```

## ⚠️ La cosa che salta all'occhio contando: IL «CONSIGLIO» E' RIPETUTO

*Non e' un'opinione sulla lunghezza: e' un conteggio.* Dodici dei sedici corpi
finiscono con lo stesso riquadro `Un consiglio`, e le varianti sono **DUE**,
sei volte ciascuna. **I quattro senza** sono `personalizzazione`, `meetTheStory`, `listaEpisodi`, `mappaEpisodio` —
*due sono schermate e due sono i moduli in cui non si esercita niente.*

| Quante volte | La variante |
|---|---|
| **6** | Tieni a portata carta e penna: oltre a ripetere ad alta voce, prova a scrivere le parole. Con il tempo, ascoltare e scrivere insieme diventa automatico. |
| **6** | Qui non serve scrivere: l'obiettivo è ascoltare e ripetere a voce alta, restando dentro il tempo. |
| **4** | *(nessun consiglio)* |

⚠️ **Quindi una parte della lunghezza non e' contenuto del modulo: e' un testo
condiviso ricopiato dodici volte.** *Se la sezione 6 lo ricopiasse riga per riga,
nascerebbe con dodici copie da tenere allineate a mano — ed e' la stessa forma
del `data-testo` duplicato trovato il 2026-09-26 (tre frasi in due posti).*

**Proposta, da decidere:** il consiglio diventa una chiave sua (due varianti,
`scrivere` e `aTempo`), e la riga del modulo dice **quale** usa. Cosi' accorciare
il consiglio si fa in un posto e vale per dodici moduli.
