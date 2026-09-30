**Versione: 20260930a**

# FATTI-APP — le cose del codice da cui i nostri testi dipendono

> ⭐ **La regola di questo file:**
>
> **Se non le sappiamo, il testo non funziona e nessuno se ne accorge.**

---

## PERCHÉ ESISTE, E PERCHÉ STA NEL REPOSITORY

**Claude Code tiene il suo registro, ma sta nel repository — e il repository noi non lo leggiamo.**
*Un fatto che non possiamo raggiungere è un fatto che non abbiamo.*

⚠️ **E la colonna che conta è una che lui non può scrivere: QUALE NOSTRO TESTO NE DIPENDE.**

🔴 **Nato il 2026-09-28 come tabellone 3.10 dentro `inglese-it-edizione`. USCITO DA LÌ il 30/09**, *e il
motivo è misurabile:*

> **Il codice è UNO per tutte le edizioni.** *Dentro l'edizione inglese, il giorno che nasce quella
> spagnola queste undici misure o si duplicano — e due copie divergono — oppure non ci sono, e
> scriviamo lo spagnolo senza saperle.*

⭐ **E sta nel repository, non fra i nostri file, per la regola dei livelli:** *un file sta nel
repository se qualcuno nel repository lo scrive o lo legge.* **Queste misure le fa Claude Code.** *Oggi
arrivano a noi rimbalzando su Davide — lui misura, lo scrive in chat, noi lo trascriviamo — e un
rimbalzo perde le cose:* 🔴 **`speedRoundMessages` era già stato trovato una volta, e la scoperta è
andata via col documento che la portava.**

⚠️ **OGNI RIGA PORTA LA MISURA CHE L'HA STABILITA.** *Non si scrive qui un fatto che non venga da una
misura — sennò questo file diventa un secondo posto dove indovinare.*

| | Chi scrive | Chi legge |
|---|---|---|
| **le prime quattro colonne** | ⭐ **Claude Code**, misurando | noi |
| **«quale nostro testo ne dipende»** | ⭐ **noi** | tutti e due |

---

## LE UNDICI MISURE

| id | Il fatto | Dove sta nel codice | Quale nostro testo ne dipende | Misurato |
|---|---|---|---|---|
| `APP_riquadro-consiglio` | **Il riquadro «Un consiglio» è un blocco html preciso:** `<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>IL TESTO</div>` | — | ⚠️ **i dodici corpi delle spiegazioni che lo attaccano in coda.** *Scritto diverso, il riquadro non compare: resta una frase in mezzo al paragrafo.* **E l'etichetta «Un consiglio» non è scritta in nessun altro posto** | 26/09 |
| `APP_speaker-labels` | **La mappa dei personaggi si chiama `speakerLabels`**, ed è una mappa piatta `chiave → stringa` | `app/ui-condivisa.js:984` | la sezione 6 di ogni episodio. ⚠️ *Fino al 2026-09-09 si chiamava `dialogueSpeakerLabels`, e quel nome non esiste più* | 27/09 |
| `APP_bolla-a-destra` | **`ruolo === 'famiglia'` mette la bolla a DESTRA**, qualunque altro valore a sinistra | `app/ui-condivisa.js:965` | la colonna `ruolo` del grado D. *Diventa `role`/`family` col passo D* | 27/09 |
| `APP_chiave-personalizzazione` | **La personalizzazione si salva con l'ID DELL'EPISODIO nella chiave:** `prefissoMagazzino() + episodeId + ':custom:' + userName` | `app/progressi.js:263` | 🔴 **la spiegazione del modulo Personalizza.** *È il fatto che ha reso falsa la frase «valgono per tutto il livello», e vera «valgono per questo episodio»* | 27/09 |
| `APP_voce-del-browser` | **L'app parla con la voce del browser** — `window.speechSynthesis`. **Zero file audio in tutto il repository** | `app/audio.js:58` e `:207` | ⭐ *nessuno oggi — e proprio per questo: **un segnaposto in una battuta costa zero**, perché la sintesi riceve una stringa e non sa quanti ce n'erano* | 27/09 |
| `APP_gradi-otto-moduli` | **Le voci dei gradi A, B, C arrivano a OTTO moduli**, non ai tre degli abbinamenti: anche Repeat Aloud, Voice Practice, Voice Check | — | ⚠️ **la colonna `esercizio`.** *È la misura che ha fermato «se `esercizio` è `no`, non scrivere la riga»: l'avrebbe tolta a Repeat Aloud, il modulo il cui mestiere è ripeterla* | 27/09 |
| `APP_colonne-per-posizione` | **Ogni parser legge le colonne PER POSIZIONE, mai per nome**, e `trascrivi.js` si aspetta D 5 · C 4 · B 5 · A 5 | `tests/tools/trascrivi.js:265-268` | ⚠️ *tutte le tabelle dei gradi.* **Una colonna in mezzo rompe tutto; in fondo non rompe niente** | 27/09 |
| `APP_ramo-sul-numero-colonne` | 🔴 **`trascrivi.js` RAMIFICA sul numero di colonne** della tabella delle personalizzazioni: `if (quante === 6) riga.paese = …` | `tests/tools/trascrivi.js:187/208` | *nessuno oggi.* ⚠️ **È la mina della prossima colonna che aggiungeremo là** — `places.departures` è l'unica tabella a sei colonne | 27/09 |
| `APP_edizione-in-docs` | 🔴 **Un'edizione dichiarata in `docs/` senza i suoi JSON fa diventare rossa TUTTA la CI.** *`test_nomenclatura_edizione` pretende che ogni episodio dichiarato abbia **sia** il markdown **sia** il JSON* | `tests/test_nomenclatura_edizione.js` | ⚠️ **i file di un'edizione nuova.** *Vanno in `nuovi/`, dove la CI non parte, finché Code non li trascrive — poi nascono verdi* | 28/09 |
| `APP_modello-si-trascrive` | ⭐ **Il modello di un episodio SI TRASCRIVE come gli altri file:** *i numeri attesi dicono `1` e ogni tabella ha una riga di esempio* | `nuovi/inglese-it-EPISODIO-VUOTO.md` | *nessun testo — **è la garanzia della sua forma**.* 🔴 **Il modello vecchio aveva cinque colonne nella sezione 7 invece di sei: mancava `righe`, e lo spagnolo si sarebbe fermato lì** | 28/09 |
| `APP_lettore-mancante` | 🔴 **`trascrivi.js` non ha MAI saputo leggere `it-istruzioni-moduli.md`:** finché la verità stava nel JSON, quel verso non serviva | — | ⚠️ **tutti i 176 testi di quel file.** *Girata la direzione della verità, il pezzo che traduce va scritto — **senza, il pacchetto non si trascrive*** | 28/09 |

---

## COME SI AGGIUNGE UNA RIGA

| | |
|---|---|
| **1** | **Claude Code misura**, e scrive le prime quattro colonne |
| **2** | ⭐ **Noi riempiamo «quale nostro testo ne dipende»** — *ed è la colonna che trasforma un fatto tecnico in una cosa che ci riguarda* |
| **3** | ⚠️ **Se quella colonna resta vuota, la riga non serve a noi**: *va nel registro di Code, non qui* |

## 🔴 E LE TRE COSE CHE QUESTE MISURE HANNO GIÀ SALVATO

| | Cosa sarebbe successo senza |
|---|---|
| **`APP_chiave-personalizzazione`** | *avremmo continuato a scrivere «queste scelte valgono per tutto il livello», che è **falso**: la chiave porta l'id dell'episodio* |
| **`APP_gradi-otto-moduli`** | *stavamo per fare che una riga con `esercizio: no` non si scrivesse — **e l'avremmo tolta anche a Repeat Aloud**, il modulo il cui mestiere è ripeterla* |
| **`APP_edizione-in-docs`** | *i file spagnoli sarebbero andati in `docs/`, e **tutta la CI sarebbe diventata rossa*** |

⭐ **Tre su undici hanno già impedito un errore, e nessuna delle tre si poteva indovinare ragionando.**

---

## DOVE STAVA PRIMA

**Fino al 2026-09-30 era `inglese-it-edizione` PARTE 3, tabellone 3.10.** *Lì dentro resta un rimando di
una riga, non una copia:* 🔴 **una copia è esattamente la cosa che questo spostamento serve a
impedire.**
