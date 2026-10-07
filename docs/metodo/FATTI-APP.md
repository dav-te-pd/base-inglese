**Versione: 20261008a**

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
> spagnola queste misure o si duplicano — e due copie divergono — oppure non ci sono, e
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

## LE MISURE

⚠️ **LA COLONNA «DOVE» PORTA FILE E NOMI, MAI NUMERI DI RIGA** — *condizione a, decisa il 2026-09-30.*
**Il giorno in cui il file è entrato nel repository, sei righe su undici non corrispondevano più al codice**,
tre giorni dopo essere state scritte, e quasi tutte per un numero di riga. *Un numero di riga invecchia a
ogni modifica sopra di lui; un nome invecchia solo quando qualcuno lo rinomina — e allora se ne accorge
un test.*

⭐ **E UN TEST LO GUARDA** — *condizione d:* `tests/test_fatti_app.js`. **Ogni cosa scritta fra apici
inversi nella colonna «Dove» dev'esserci davvero:** un percorso dev'essere un file che esiste, ogni altro
pezzo dev'essere scritto **alla lettera** in uno dei file citati nella stessa cella. *Una rinomina che
rende falsa una riga fa diventare rossa la CI, invece di aspettare che qualcuno la rilegga.*

| id | Il fatto | Dove sta nel codice | Quale nostro testo ne dipende | Misurato |
|---|---|---|---|---|
| `APP_riquadro-consiglio` | **Il riquadro «Un consiglio» è un blocco html preciso:** `<div class="note-box panel"><span class="note-box-label">ETICHETTA</span>IL TESTO</div>`. ⚠️ **Lo scrive il TRASCRITTORE; l'ETICHETTA no, dal 01/10: è la cella `condivisi.etichettaConsiglio` della sezione «I TESTI CHE NON SONO DI UN MODULO» del file dei testi condivisi.** *Senza quella cella il trascrittore si ferma con un errore, non scrive un riquadro senza nome.* **E la classe è la stessa del riquadro «Regola generale» di Repeat Aloud**, la cui etichetta è la cella `condivisi.etichettaRegolaGenerale`: *fino al 01/10 si chiamava `general-rule` anche dove ospitava un consiglio* | `tests/tools/trascrivi.js` · `note-box-label` · `etichettaConsiglio` · `app/repeataloud.js` · `etichettaRegolaGenerale` | I dodici corpi delle spiegazioni che lo attaccano in coda: scritto diverso, il riquadro non compare — resta una frase in mezzo al paragrafo. 🔴 CORRETTO IL 1/10: qui c'era scritto che l'etichetta «Un consiglio» non è scritta in nessun altro posto. Era falso due volte — la scriveva trascrivi.js, e dal passo 4 è una cella: condivisi.etichettaConsiglio in it-istruzioni-moduli. | 07/10 |
| `APP_speaker-labels` | **La mappa dei personaggi si chiama `speakerLabels`**, ed è una mappa piatta `chiave → stringa`: l'etichetta si restituisce **diritta**, e un personaggio che non c'è mostra la sua chiave | `app/ui-condivisa.js` · `function speakerLabel` · `episode.speakerLabels` | la sezione «PERSONAGGI ED ETICHETTE» di ogni episodio. ⚠️ *Fino al 2026-09-09 si chiamava `dialogueSpeakerLabels`, e quel nome non esiste più* | 30/09 |
| `APP_bolla-a-destra` | **`role === 'family'` mette la bolla a DESTRA**, qualunque altro valore a sinistra. *Dal passo D (28/09): prima era `ruolo`/`famiglia`* | `app/ui-condivisa.js` · `function dialogueLineAlign` · `role === 'family'` | la colonna `ruolo` del grado D di ogni episodio. I valori che scriviamo sono `family` e `staff`. | 30/09 |
| `APP_chiave-personalizzazione` | **La personalizzazione si salva con l'ID DELL'EPISODIO nella chiave:** `prefissoMagazzino() + episodeId + ':custom:' + userName` | `app/progressi.js` · `function customValuesKey` · `':custom:'` | 🔴 **la spiegazione del modulo Personalizza.** *È il fatto che ha reso falsa la frase «valgono per tutto il livello», e vera «valgono per questo episodio»* | 30/09 |
| `APP_voce-del-browser` | **L'app parla con la voce del browser** — `window.speechSynthesis`. **Zero file audio in tutto il repository** (misurato: `git ls-files` con `mp3`/`wav`/`ogg`/`m4a`/`aac` → 0) | `app/audio.js` · `window.speechSynthesis` | ⭐ *nessuno oggi — e proprio per questo: **un segnaposto in una battuta costa zero**, perché la sintesi riceve una stringa e non sa quanti ce n'erano* | 30/09 |
| `APP_gradi-otto-moduli` | **Le voci dei gradi A, B, C arrivano a OTTO tipi di modulo — NOVE passi della sequenza** (Flash Card è un tipo con due passi): Repeat Aloud, i due Match, le due Flash Card, Voice Practice, i due Speed Match, Voice Check. *Non ai soli tre degli abbinamenti.* Misurato su `narrativo-standard`, uguale nelle due edizioni | `docs/inglese/it/inglese-it-struttura-corso.md` · `repeatAloud` · `voicePractice` · `voiceCoach` | ⚠️ **la colonna `esercizio`.** *È la misura che ha fermato «se `esercizio` è `no`, non scrivere la riga»: l'avrebbe tolta a Repeat Aloud, il modulo il cui mestiere è ripeterla* | 30/09 |
| `APP_colonne-per-posizione` | **Ogni parser legge le colonne PER POSIZIONE**, e `trascrivi.js` controlla l'INTESTAZIONE di ogni tabella dei gradi, colonna per colonna: le attese sono `INTESTAZIONI_GRADI`, e il conto è la loro lunghezza — D 5 · C 5 · B 6 · A 6, che `test_fatti_app.js` confronta con questa frase. Le parole fisse — id, speaker, ruolo, da, pronuncia, categoria, non con — devono stare al loro posto; **la cella della lingua insegnata è libera** (`en`, `es`) ma dev'essere diversa da quella dello studente, che si chiama come la cartella dell'edizione. *Nel JSON le due lingue diventano `target` e `native`, che sono RUOLI (dal 30/09).* ⚠️ **Aggiungere, togliere o scambiare una colonna FERMA la trascrizione**, e l'errore dice quale colonna. *Fino al 07/10 si controllava solo il conto: due colonne scambiate passavano, e con `en ↔ it` il JSON usciva rovesciato — misurato l'08/10 col trascrittore di prima, «Sono {{papa}}.» finiva in `target`. Prima ancora, fino al 07/10, qui c'era «C 4 · B 5 · A 5».* | `tests/tools/trascrivi.js` · `INTESTAZIONI_GRADI` · `colonneConIntestazione` · `'grado D'` · `'grado A'` · `target:` · `native:` · `tests/test_intestazioni.js` | ⭐ Tutte le tabelle dei gradi. Dal 2026-10-08 sono protetti il CONTO e l'ORDINE. Le intestazioni attese sono una costante del trascrittore, e il conto si ricava dalla sua lunghezza: aggiungere, togliere o scambiare una colonna ferma la trascrizione. ⚠️ Una sola cella resta libera: quella della lingua insegnata — en o es, perché cambia con l'edizione — e deve essere diversa da quella dello studente, che si chiama come la cartella. 🔴 Lo scambio che questo controllo esiste per fermare è en ↔ it: il conto resterebbe uguale e tutto l'episodio uscirebbe rovesciato, target e native invertiti. Fino al 07/10 questa cella diceva «l'ORDINE no». | 08/10 |
| `APP_ramo-sul-numero-colonne` | 🔴 **`trascrivi.js` RAMIFICA sul numero di colonne** della tabella delle personalizzazioni: 4 o 6, e con 6 la riga porta il `paese`. Qualunque altro numero lo ferma nominando la tabella. ⚠️ **Dall'08/10 il ramo si sceglie dalla lunghezza dell'INTESTAZIONE** (`INTESTAZIONI_TABELLE`), e l'intestazione si controlla colonna per colonna come nei gradi: prima lo studente, poi la lingua insegnata — **l'ordine OPPOSTO dei gradi** — e con sei colonne la lingua insegnata dev'essere la stessa in `en` e in `paese en`. *Fino al 07/10 si guardava il conto della prima riga, e i due `paese` scambiati passavano.* | `tests/tools/trascrivi.js` · `quante === 6` · `riga.paese` · `INTESTAZIONI_TABELLE` | *nessuno oggi.* ⚠️ **È la mina della prossima colonna che aggiungeremo là** — `places.departures` è l'unica tabella a sei colonne | 08/10 |
| `APP_edizione-in-docs` | 🔴 **Un'edizione dichiarata in `docs/` senza i suoi JSON fa diventare rossa TUTTA la CI.** *`test_nomenclatura_edizione` pretende che ogni episodio dichiarato abbia **sia** il markdown **sia** il JSON* | `tests/test_nomenclatura_edizione.js` · `Ogni episodio dichiarato ha il suo markdown E il suo JSON` | ⚠️ **i file di un'edizione nuova.** *Vanno in `nuovi/`, dove la CI non parte, finché Code non li trascrive — poi nascono verdi* | 30/09 |
| `APP_modello-si-trascrive` | ⭐ **Il modello di un episodio SI TRASCRIVE come gli altri file:** *i numeri attesi dicono `1` e ogni tabella ha una riga di esempio.* ✅ **E dal 07/10 lo trascrive un test**, `test_non_con.js` `[C]`: passa anche i fermi di forma (una tabella per sezione, `non con` simmetrica e dentro il grado). ⚠️ **Il bacino sul modello NON si guarda, ed è controllato:** lo stesso test misura che lì direbbe rosso — una voce per grado fa `1 − 1 − 0 = 0` — e il bacino gira solo sugli episodi dichiarati da una struttura. *Fino al 07/10 qui c'era «nessun test lo trascrive: lo si prova a mano».* | `nuovi/inglese-it-EPISODIO-VUOTO.md` · `Numeri attesi nel JSON` · `tests/test_non_con.js` | *nessun testo — **è la garanzia della sua forma**.* 🔴 **Il modello vecchio aveva cinque colonne nella sezione «GLI SLOT» invece di sei: mancava `righe`, e lo spagnolo si sarebbe fermato lì** | 07/10 |
| `APP_suffisso-ruolo` | **I segnaposto chiedono un RUOLO, non una lingua:** `{{x:target}}` (la lingua che si impara) e `{{x:native}}` (quella dello studente), in ogni edizione — *dal 30/09, prima `:en`/`:it`.* ⚠️ **Nell'app un suffisso che non è un ruolo NON fallisce:** resta a schermo com'è. **Dal 30/09 lo ferma il TRASCRITTORE**, che dice quale. 🔴 *E su un nome proprio non si vede nemmeno a schermo: una riga `traducibile: false` dà sempre la colonna dello studente, qualunque suffisso le si chieda — misurato: `{{cognome:es}}` esce come il cognome giusto* | `app/ui-condivisa.js` · `function fillTemplate` · `tests/tools/trascrivi.js` · `suffissiSbagliati` | ⚠️ **ogni segnaposto di ogni episodio.** 🔴 *E la cosa grave è la seconda metà: «un suffisso vecchio resta a schermo». Un `{{x:es}}` scritto per sbaglio non fallisce — **lo legge lo studente*** | 30/09 |
| `APP_titolo-una-volta` | **Un titolo `##` o `###` che compare PIÙ DI UNA VOLTA in un markdown di contenuto** — anche a metà riga, dentro una cella — **ferma il trascrittore e fa diventare rossa la CI**, con il titolo e la riga. *Il trascrittore cerca i titoli con `indexOf`, che trova la prima occorrenza: se è una citazione, legge la tabella sbagliata* | `tests/tools/trascrivi.js` · `const ancora = testo.indexOf(titolo` · `tests/test_testi_dal_markdown.js` · `ogni titolo compare una volta sola` | **ogni titolo di sezione di `struttura-corso` e di ogni episodio.** ⭐ *È la riga che il 30/09 non esisteva, e il corso è nato senza sequenze* | 30/09 |
| `APP_episodi-dalla-struttura` | **Esistono SOLO gli episodi che la sezione «GLI EPISODI» della struttura dichiara.** L'elenco non è più scritto nel codice: un episodio non dichiarato non compare, uno dichiarato compare col suo nome e legge il file `{edizione}-{id}.json` | `app/catalogo.js` · `function popolaEpisodi` · `CONFIG.episodes` | **la sezione «GLI EPISODI» di `struttura-corso`.** *È il motivo per cui la sezione «GLI EPISODI» della struttura spagnola deve dichiararli tutti e due* | 07/10 |
| `APP_grassetto-regola-generale` | **Il `**grassetto**` della regola generale di un episodio diventa `<strong>`** a schermo, come nelle pronunce e nelle skill. *Prima del 30/09 restavano gli asterischi: i due episodi inglesi non ne avevano, e nessuno l'aveva visto* | `tests/tools/trascrivi.js` · `fuori.generalRule = html(` | **la sezione «LA REGOLA GENERALE» di ogni episodio.** *Tutte e due le regole generali spagnole usano il grassetto: `**dí**-as`, `hi**ja**`* | 30/09 |
| `APP_nome-app` | **Il nome dell'app — APPLINGUE, di lavoro — è `nomeApp` in `app/config.js`, scritto nel CODICE e non in un file di dati.** Compare nel titolo della pagina e nella schermata di attesa, cioè **prima** che arrivi qualunque file: per questo non può stare in un dato. `applicaNomi` lo scrive all'avvio. *Misurato da `test_edizione_spagnola` [F]: trattenuta la struttura un secondo e mezzo, il nome c'è già.* ⚠️ **NON VA SPOSTATA IN UN FILE DI DATI applicando la regola 8:** un file di dati arriva dopo la prima schermata, e il nome sparirebbe proprio dove serve. *Scritto qui su richiesta di chi guida il progetto, perché fra sei mesi la regola 8 la farebbe sembrare una dimenticanza.* | `app/config.js` · `nomeApp` · `app/mappa.js` · `applicaNomi` | ⭐ nessun nostro testo, ed è il punto: è l'unica scritta che lo studente legge e che sta nel codice di proposito — serve prima che qualunque dato sia caricato. | 01/10 |
| `APP_nome-corso` | **Il nome del corso — «Inglese per italiani», «Spagnolo per italiani» — è la riga `corso` della sezione «I NOMI A SCHERMO» della struttura**, e va nei badge della home e dell'onboarding. Arriva **con** la struttura: prima di lei il badge resta **vuoto**, mai un nome sbagliato nel frattempo. *Senza la riga `corso` il trascrittore si ferma.* | `tests/tools/trascrivi.js` · `nomiASchermo` · `app/mappa.js` · `applicaNomi` | la riga corso di «I NOMI A SCHERMO» di tutte e due le strutture | 07/10 |
| `APP_bacino-distrattori` | **Match e Speed Match mostrano `distrattori + 1` alternative** — oggi 4 — **pescate a caso fra le altre voci DELLO STESSO GRADO dello stesso episodio, TOLTE quelle della sua colonna `non con`** (dal 07/10: campo `nonCon` nel JSON, solo sulle voci che hanno esclusioni). Il numero è `sceltaMultipla.distrattori` in `app/config.js`, uno per tutti e due i moduli. 🔴 **Il trascrittore si ferma** se una coppia `non con` è scritta in un verso solo, se un id escluso non è nel grado, e se il **bacino di una voce** — `voci − 1 − esclusi` — scende sotto `distrattori`, con una riga per voce e i moduli che leggono il suo grado; il grado D non si guarda. *Misurato da `test_distrattori.js` e `test_non_con.js`.* ⚠️ *Fino al 07/10 qui c'era «la colonna `non con` non viene letta».* | `app/sessione.js` · `buildMultipleChoiceOptions` · `nonCon` · `app/config.js` · `sceltaMultipla` · `tests/tools/trascrivi.js` · `bacinoCorto` · `controllaNonCon` | ✅ Letta dal 2026-10-07: il trascrittore la scrive in nonCon, e l'app toglie gli esclusi dal bacino delle alternative. Il conto degli id vive in NUMERI, non qui (regola 48). | 07/10 |

⚠️ **CHI È USCITO, E PERCHÉ** — *condizione b: un fatto che non è più vero esce dalla tabella e va in
`docs/correzioni.md`.* **`APP_lettore-mancante`** — *«`trascrivi.js` non ha MAI saputo leggere
`it-istruzioni-moduli.md`»* — **è falso dal 28/09**, quando il passo C gliel'ha insegnato. È uscito il
giorno in cui il file è nato: **la prima applicazione della regola è alla sua stessa nascita.**

---

## COME SI AGGIUNGE UNA RIGA

⚠️ **CHI AGGIORNA UNA RIGA, E QUANDO** — *condizione c.* **Claude Code, nello stesso commit che cambia
il fatto:** *se un commit rende falsa una riga, quella riga si corregge lì, come i test (regola 23) e i
registri (regola 43).* ⭐ **La quinta colonna no:** *dice cosa dei VOSTRI testi ne dipende, e da qui non
si può sapere.* **Quando un fatto cambia, Claude Code la SEGNALA nella risposta, e non la riscrive.**


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

⭐ **Tre hanno già impedito un errore, e nessuna delle tre si poteva indovinare ragionando.**

---

## DOVE STAVA PRIMA

**Fino al 2026-09-30 era `inglese-it-edizione` PARTE 3, tabellone 3.10.** *Lì dentro resta un rimando di
una riga, non una copia:* 🔴 **una copia è esattamente la cosa che questo spostamento serve a
impedire.**
