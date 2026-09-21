**Versione: 20260921c**

# Registro degli episodi — inglese per italiani

---

## 1 — FONTE E METODO

**REGISTRO-EPISODI_001** · Questo file tiene **quello che attraversa gli episodi**: le regole valide per
tutti, e il tabellone. *Quello che riguarda un episodio solo sta nel suo file.*

**REGISTRO-EPISODI_002** · ⚠️ **Il tabellone non ricopia il contenuto.** *Una battuta, una skill, una
riga della matrice stanno **solo** nel file dell'episodio: qui si citano col codice (`GATE_030`).
Due copie della stessa cosa divergono.*

**REGISTRO-EPISODI_003** · ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola
master 1.5).

---

## 2 — LE SEZIONI DI UN EPISODIO

**REGISTRO-EPISODI_004** · **Ogni file episodio ha queste tredici sezioni, in quest'ordine:**

| # | Sezione | Cosa contiene |
|---|---|---|
| 1 | Fonte e metodo | il JSON che alimenta, il messaggio fisso, il rimando a questo registro |
| 2 | L'episodio | id, nome mostrato (la fonte è `struttura-corso`), categoria, sequenza dei moduli, numeri attesi |
| 3 | La scena | dove, chi, cosa succede — il testo della pagina di inizio episodio e del video |
| 4 | Contenuti video — messaggi iniziali e finali | le idee per il video dell'episodio, scritte mentre lo si pensa |
| 5 | Contenuti social | le idee per i social, idem |
| 6 | Cosa insegna | le strutture, gli esclusi di proposito, i vincoli sulla sequenza |
| 7 | La matrice | i gradi D → C → B → A |
| 8 | Le skill | una per battuta, testo completo |
| 9 | Personaggi ed etichette | la tabella da cui si trascrive `dialogueSpeakerLabels` |
| 10 | Personalizzazione | gli slot e i loro id |
| 11 | Note di scrittura | le scelte che non si vedono dalla matrice |
| 12 | Regole in sospeso | le strutture entrate senza la loro scheda |
| 13 | Chiavi del JSON | le chiavi che l'episodio porta |

**REGISTRO-EPISODI_005** · ⚠️ **Se una sezione non ha niente, si scrive un punto `·`** — *così si vede
che non è stata dimenticata.*

**REGISTRO-EPISODI_006** · **La prima riga di ogni file è la versione, e solo quella:**
`**Versione: 20260921c**`. *Nella chat il nome del file porta la versione
(`inglese-it-gate-20260921c.md`); nel repository no — Davide la toglie prima di caricarlo, perché
test e rimandi leggono i file per nome.*

**REGISTRO-EPISODI_022** · **Il nome mostrato e la categoria di un episodio vivono in
`inglese-it-struttura-corso`**, tabella degli episodi. *Il file episodio li cita, non li ripete.*
Categorie: **`storia`**, **`grammatica`**, **`pronuncia`**.

**REGISTRO-EPISODI_023** · **La scena è anche il testo della pagina di inizio episodio e la base del
video.** *Le idee per video e social si scrivono nelle sezioni 4 e 5 mentre si scrive l'episodio —
non dopo, a memoria.*

---

## 3 — REGOLE PER TUTTI GLI EPISODI

### La matrice

**REGISTRO-EPISODI_007** · **Una matrice sola, e i gradi ne discendono.** *Il grado D è il dialogo; il
resto si ricava per sottrazione* (regole 1.3 e 2.11).

**REGISTRO-EPISODI_008** · **Grado C: dove la frase è identica alla battuta si scrive `= dN`** e non si
ricopia. *La colonna «Perché differisce» non resta mai vuota: se non differisce, «identica».*

**REGISTRO-EPISODI_009** · **B contiene quello che si produce intero, C quello che si costruisce.** *La
prova: puoi cambiarci dentro un pezzo e ottenere un'altra frase valida dello stesso tipo? Se sì è
C, se no è B.* **Non contano la lunghezza né il punto interrogativo.**

**REGISTRO-EPISODI_010** · **Grado A: un inglese la dice da sola?** (regola 2.16). *Se no, non sta in A:
vive nei chunk di B e C.*

**REGISTRO-EPISODI_011** · **Maiuscole:** in A e B minuscolo, tranne dove la lingua la impone. In C e D
scrittura normale (regola 4.4).

### Le skill

**REGISTRO-EPISODI_012** · Nel JSON il campo è **`whatYouLearn`**, **sempre una lista** anche con una
skill sola. Ogni voce ha `title` e `body`. *HTML consentito nel corpo, niente `<p>`, `<br>` per
andare a capo.*

**REGISTRO-EPISODI_013** · **Una skill spiega l'uso, non la grammatica.** *Può richiamare una
struttura già vista, non insegnarla* (regole 4.5 e 4.10).

**REGISTRO-EPISODI_014** · **Nelle skill i segnaposto vengono sostituiti**, e la citazione inglese
chiede il valore inglese con `{{chiave:en}}`. *«I am from {{partenza:en}}» rende «I am from Turin»
nella citazione e «vengo da Torino» nella prosa.*

### Personaggi ed etichette

**REGISTRO-EPISODI_015** · **La colonna «Chi» della matrice non è la fonte delle etichette:** *la fonte
è la tabella della sezione 9 dell'episodio.*

**REGISTRO-EPISODI_016** · **L'etichetta porta il contorno: il mestiere più dove sta** — *Hostess al
gate · Hostess alla porta · Hostess col carrello.* **Anche se in scena ce n'è una sola:** *lo studente
non vede un episodio, vede una serie.*

**REGISTRO-EPISODI_017** · **Le etichette dei personaggi personalizzabili non portano il nome scelto:**
*sopra la bolla «Papà», non «Marco». Il nome sta dentro la battuta, dove lo studente lo impara.*

**REGISTRO-EPISODI_018** · **I nomi descrivono, non etichettano:** *«Hostess al gate», non «Guida».*

### La personalizzazione

**REGISTRO-EPISODI_019** · **L'episodio elenca gli id che usa, uno per uno** — non «tutti quelli della
tabella» (regola 5.7).

**REGISTRO-EPISODI_020** · **Nel dialogo i nomi di persona non si traducono mai; i toponimi sì**
(Torino → Turin). *I cognomi non hanno forma inglese.* **È la regola da cui discende la colonna
`traducibile` delle tabelle.**

**REGISTRO-EPISODI_021** · **Le destinazioni sono città, non nazioni:** *la nazione viene con la città,
altrimenti gli accenti dei personaggi non tornano col posto.*

---

## 4 — IL TABELLONE — PARTE ALTA: GLI EPISODI

·

## 5 — IL TABELLONE — PARTE BASSA: PER L'EPISODIO SUCCESSIVO

### Regole in sospeso

·

### Strutture grammaticali

·

### Personaggi ricorrenti

·

### Promesse

·

### Voci

·

---

## 6 — FILE DA AGGIORNARE QUANDO NASCE UN EPISODIO

**REGISTRO-EPISODI_024** · **Ogni episodio nuovo tocca questi file.** *È la checklist: se uno non è
stato toccato, o l'episodio non ne aveva bisogno — e va detto — o è stato dimenticato.*

| File | Cosa ci si scrive | Chi |
|---|---|---|
| `inglese-it-{id}` | il file dell'episodio, tredici sezioni | noi |
| `inglese-it-registro-episodi` | la riga del tabellone, sospesi, strutture, promesse, voci | noi |
| `inglese-it-struttura-corso` | la riga nella tabella degli episodi: id, nome, categoria, sequenza | noi |
| `inglese-it-sequenza-episodi` | la posizione dell'episodio | noi |
| `inglese-it-inventario-grammaticale` | le strutture nuove che l'episodio apre | noi, se serve |
| `inglese-it-tabelle-personalizzazione` | slot o valori nuovi | noi, se serve |
| `inglese-it-obiettivi-a1` | l'obiettivo che l'episodio copre | noi, se serve |
| `APPLINGUE-registro-voci` | le voci nuove — *finché non entra in questo registro* | noi |
| `data/inglese/it/inglese-it-{id}.json` | la trascrizione | Claude Code |
