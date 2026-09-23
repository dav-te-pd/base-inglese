**Versione: VUOTO-20260923a**

# Episodio «...» — inglese per italiani

*Il nome del file vero è `inglese-it-{id}.md`, e l'`{id}` è quello dichiarato
nella sezione 7 di `inglese-it-struttura-corso`.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: tutto quello che c'è dentro finisce in
`data/inglese/it/inglese-it-{id}.json`.** Le ragioni — la scena, cosa insegna,
le note di scrittura, gli esclusi di proposito — stanno nei file RAGIONI.

### ① QUANTO È RIGIDO IL PARSER — misurato su `tests/test_story_modules.js` e `tests/test_episodio2.js`, 2026-09-23

⚠️ **DI QUESTO FILE UN TEST LEGGE UNA COSA SOLA: il riquadro dei numeri
attesi** (`tests/test_episodio2.js`). Titoli, numeri di sezione, ordine delle
sezioni e nomi delle colonne **non sono un'interfaccia**: si possono cambiare
senza rompere niente.

⚠️ **MA NON VALE PER TUTTI GLI EPISODI, e la differenza e' stata misurata il
2026-09-23:** di `gate`, `tests/test_story_modules.js` legge **anche le tabelle
dei gradi**, confrontandole col JSON cella per cella. **Li' l'ordine delle
colonne e' un'interfaccia; qui no.** *Chi cambia la forma di questo modello
cambia tutti e due: il primo se ne accorge, il secondo no.*

**Il riquadro invece è rigido, e in un modo che va saputo prima di scriverlo:**

| | Come funziona |
|---|---|
| **Si trova** | cercando **la stringa che apre il riquadro della sezione 2**, e ne prende la **prima** occorrenza nel file |
| **Finisce** | alla **prima riga vuota** dopo quel punto |
| **Si legge** | ricucendo le righe con uno spazio, e togliendo `*` e `>` — **ma non `|`** |
| **Si estrae** | con sei espressioni: `N voci in A` · `N in B` · `N in C` · `N battute in D` · `N skill` · `N slot` |

⚠️ **QUI QUELLA STRINGA NON È SCRITTA, ED È VOLUTO:** il parser prende la
**prima** occorrenza nel file, quindi una citazione in questa sezione gli
farebbe leggere **questa tabella** invece del riquadro vero — e i sei numeri
verrebbero fuori come `N`, senza che niente si lamenti. *È successo scrivendo
questo file, e la prova è ripetibile: `grep -c` su quella stringa deve dare
**1**.*

⚠️ **PER QUESTO IL RIQUADRO È L'UNICA COSA NON TABELLARE DI QUESTO FILE, e non
è una svista.** Il markdown vuole una riga vuota prima di una tabella; il parser
si ferma alla prima riga vuota. **Una tabella qui darebbe un riquadro vuoto e
l'errore «numero atteso non trovato».** Resta un paragrafo finché non
cambiamo i due test.

**Ogni numero si prende col suo NOME accanto, mai per posizione:** l'ordine
dentro il paragrafo è libero, le parole no.

### ② COSA NON MI SERVE PIÙ DI QUELLO CHE STAVA QUI

| Stava in | Cosa | Perché non mi serve |
|---|---|---|
| `## 1` | fonte e metodo, il messaggio fisso | è il metodo, non un dato |
| `## 2` | id, nome mostrato, categoria, sequenza | **vivono in `struttura-corso`, sezione 7** — qui sarebbero una seconda copia |
| `## 3` | la scena | **non entra in nessuna chiave del JSON** |
| `## 4`, `## 5` | video e social | idem |
| `## 6` | cosa insegna, gli esclusi di proposito | idem |
| `## 11` | note di scrittura | idem |
| `## 12` | regole in sospeso | idem |
| `## 7` | la colonna **«Chi»** della matrice D | l'etichetta vera viene dalla tabella dei personaggi |
| `## 7` | la colonna **«Skill»** della matrice D | la skill è attaccata alla battuta nella sezione delle skill |
| `## 7` | la colonna **«Perché differisce»** del grado C | è il ragionamento, non il dato |

**E tre chiavi che oggi il JSON porta e che NESSUNO legge — quindi smetto di
trascriverle:** `episodeTitle` *(il nome vero è `episodes.<id>.nome` in
`struttura-corso`)*, `language`, `level`.

⚠️ **Due campi restano perché li chiede la regola 4, e oggi non li legge
nessuno:** `grammarCategory` (gradi A e B) e `fromLine` (grado C). *Li scrivo
lo stesso; se un giorno si decide di toglierli, è una decisione sulla regola.*

---

## 2 — I NUMERI ATTESI

**Numeri attesi nel JSON:** N voci in A, N in B, N in C, N battute in D, N skill, N slot. ⚠️ **Se i conti non tornano, fermarsi e segnalarlo.**

*Il paragrafo qui sopra è il solo pezzo del file che un test legge. La riga
vuota che segue lo chiude: non metterne una dentro.*

---

## 3 — LA REGOLA GENERALE

*Finisce in `generalRule`, ed è **facoltativa**: senza, Repeat Aloud non disegna
il riquadro. La legge un modulo solo.*

⚠️ **Oggi `inglese-it-gate.json` ne porta una che non ha nessuna fonte in
nessun markdown.** Questa sezione esiste perché smetta di essere così.

| Testo |
|---|
| Una frase sola, quella che Repeat Aloud mostra in cima. Lasciare la tabella senza righe se l'episodio non ne ha una. |

---

## 4 — LA MATRICE

### Grado D — le battute

*Colonne → `levels.D.items[]`: **id** → `id` · **speaker** → `speaker`, e deve
essere una chiave della tabella dei personaggi · **ruolo** → `ruolo` · **en** →
`english` · **it** → `italian`.*

⚠️ **`ruolo` ha due soli stati che contano:** `famiglia` mette la bolla a
**destra**, qualunque altro valore la mette a sinistra.

| id | speaker | ruolo | en | it |
|---|---|---|---|---|
| `d-1` | `chiave-personaggio` | `famiglia` | Battuta in inglese con `{{segnaposto}}`. | Battuta in italiano con `{{segnaposto}}`. |

### Grado C — le frasi

*Colonne → `levels.C.items[]`: **id** · **en** → `english` · **it** → `italian` ·
**da** → `fromLine`, l'id della battuta da cui è ricavata.*

| id | en | it | da |
|---|---|---|---|
| `c-1` | Frase in inglese. | Frase in italiano. | `d-1` |

### Grado B — le espressioni

*Colonne → `levels.B.items[]`: **id** · **en** → `english` · **it** →
`italian` · **pronuncia** → `pronunciationTip` · **categoria** →
`grammarCategory`.*

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `b-1` | espressione | traduzione | come si legge | etichetta grammaticale |

### Grado A — le parole

*Stesse colonne del grado B → `levels.A.items[]`.*

| id | en | it | pronuncia | categoria |
|---|---|---|---|---|
| `a-1` | parola | traduzione | come si legge | etichetta grammaticale |

---

## 5 — LE SKILL

*Colonne → `levels.D.items[].whatYouLearn[]`: **battuta** → a quale `id` del
grado D si attacca · **#** → l'ordine dentro la lista di quella battuta ·
**titolo** → `title` · **corpo** → `body`.*

**`whatYouLearn` è SEMPRE una lista**, anche con una skill sola: due righe con
la stessa battuta sono due skill della stessa battuta. **Una battuta senza
righe qui non ha skill** — in Why We Say It la sua card non ha pulsanti e
prende la spunta da sola.

⚠️ **Nel corpo:** HTML sì, `<br>` per andare a capo, `<strong>` per
evidenziare, **mai `<p>`**. I segnaposto si sostituiscono come ovunque, e la
citazione inglese chiede la propria lingua con `{{chiave:en}}`.

⚠️ **`difficulty` non lo scrivo più:** oggi sta nel JSON e **non lo legge
nessuno**.

| battuta | # | titolo | corpo |
|---|---|---|---|
| `d-1` | 1 | Titolo della spiegazione | Testo che spiega l'uso, con `<br>` per andare a capo e `{{chiave:en}}` per citare l'inglese. |

---

## 6 — PERSONAGGI ED ETICHETTE

*Colonne → `speakerLabels`: **chiave** → quello che scrivi nella colonna
`speaker` del grado D · **etichetta** → quello che lo studente legge sopra la
bolla.*

⚠️ **La chiave nel JSON è `speakerLabels`.** *Fino al 2026-09-09 si chiamava
`dialogueSpeakerLabels`, e quel nome non esiste più da nessuna parte.*

| chiave | etichetta a schermo |
|---|---|
| `chiave-personaggio` | Etichetta col contorno, non il solo mestiere |

---

## 7 — GLI SLOT

*Due cose insieme, e vanno in due posti del JSON: le colonne **chiave** →
`placeholderMap` (il nome che scrivi dentro i `{{...}}`), e tutte e cinque →
una voce di `personalizationTablesUsed`.*

| chiave | etichetta | tipo | tabella | predefinito |
|---|---|---|---|---|
| `esempioSlot` | Etichetta nella schermata Personalizza | `select` | `people.esempio` | `id-predefinito` |

⚠️ **L'«etichetta» non ha nessuna fonte oggi**, e la schermata Personalizza la
mostra: sta qui perché smetta di vivere solo nel JSON.

**La «tabella» è un riferimento a `inglese-it-tabelle-personalizzazione`**, con
due forme sole:

| Forma | Vuol dire |
|---|---|
| `people.papa`, `places.departures`, … | una tabella del magazzino condiviso |
| `episode.<qualcosa>` | una tabella dichiarata **dentro questo stesso file episodio** — oggi le età |

⚠️ **Il «predefinito» è un id di quella tabella, e va scelto con attenzione:**
se un valore salvato non si trova più fra le opzioni, il codice **non ripiega
sul predefinito — ripiega sulla PRIMA RIGA della tabella.**

---

## 8 — LE TABELLE INTERNE ALL'EPISODIO

*Le righe che valgono **solo per questo episodio** e non vanno nel magazzino
condiviso. Finiscono in una chiave di primo livello del JSON, e l'unico modo di
raggiungerle è che uno slot della sezione 7 dica `episode.<nome>.<gruppo>`.*

⚠️ **Oggi è il caso delle età di `gate`** (`ageOptions.figlia`,
`ageOptions.figlio`), **e nemmeno quelle hanno una fonte markdown.** Questa
sezione esiste per quello.

⚠️ **Una riga «nuda» vale per tutte e due le lingue.** Il codice la trasforma in
`{value, it, en}` **tutti e tre uguali** — che è il motivo per cui oggi si legge
`I'm 16 years old` e non `I'm sixteen`. **Per avere una parola in inglese serve
un altro passo**, non una riga scritta diversa qui.

| nome | gruppo | valori, in ordine |
|---|---|---|
| `esempioTabella` | `esempioGruppo` | `valore-1` · `valore-2` · `valore-3` |

*Lasciare la tabella senza righe se l'episodio non ne ha nessuna: è il caso
normale.*
