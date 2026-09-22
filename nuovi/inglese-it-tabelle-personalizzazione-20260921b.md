**Versione: 20260921b**

# Tabelle di personalizzazione — inglese per italiani

---

## 1 — FONTE E METODO

**TABELLE_001** · Questo file è il **magazzino dei valori di personalizzazione** dell'edizione, ed è la
fonte per **`data/inglese/it/inglese-it-tabelle-personalizzazione.json`**.

**TABELLE_002** · **Il magazzino è più grande della vetrina:** *un episodio elenca gli id che vuole,
uno per uno, e solo quelli compaiono* (regola 5.7).

**TABELLE_003** · **Vale per tutti gli episodi dell'edizione.** *Non sta dentro un episodio perché
riscrivere le stesse righe in ogni episodio le farebbe divergere; e perché «Rossi» scelto in un
episodio deve venire dalla **stessa riga** in quello successivo* (regola 5.2).

**TABELLE_004** · **Un'edizione nuova non si ottiene traducendo questo file:** *un francese non si chiama
«Marco tradotto», si chiama Pierre.* **Si copia la struttura e si sostituiscono i contenuti** (regola
1.112).

**TABELLE_005** · ⚠️ **Il JSON oggi non coincide con questo file** — *vedi la sezione 9.* **Questo file è
la fonte, ed è davanti al codice.**

**TABELLE_006** · ⚠️ **Non fondare decisioni su questo file senza verifica in chat** (regola master 1.5).

---

## 2 — COM'È FATTA UNA RIGA

| Campo | Cosa contiene |
|---|---|
| `id` | descrittivo, unico dentro l'edizione, **congelato** |
| `it` | la forma nella lingua dello studente |
| `en` | la forma nella lingua che si impara |
| `traducibile` | **sì / no, dichiarato per riga** |

**TABELLE_007** · **`traducibile` si dichiara, non si deduce** — *né dal nome della tabella né dal
prefisso dell'id: le convenzioni sui nomi si rompono al primo id scritto storto* (regola 1.9). *La
ragione per cui un nome di persona non si traduce e un toponimo sì è nella regola R.1
dell'inventario.*

**TABELLE_008** · **Una colonna non ha buchi:** *un nome senza equivalente inglese ha sé stesso come
equivalente.*

**TABELLE_009** · **L'ordine delle righe è quello in cui sono scritte.** *Nessun codice ordina: `eta-4 …
eta-17` in ordine alfabetico darebbe 10, 11, 12, 4, 5.*

**TABELLE_010** · **Niente colonna pronuncia.** *`pronunciationTip` sta sulla voce del grado: qui non
avrebbe nessun lettore.*

---

## 3 — NOMI

**TABELLE_011** · *Non traducibili. La colonna inglese esiste perché sia pronta se un giorno servisse.*

**TABELLE_012** · *`Chiara` compare fra mamme e figlie, `Marco` fra papà e figli: tabelle diverse, id
diversi. Le tabelle non hanno lo stesso numero di righe, e non devono averlo.*

### Papà

| id | it | en | traducibile |
|---|---|---|---|
| `papa-marco` **(pred.)** | Marco | Mark | no |
| `papa-giancarlo` | Giancarlo | Giancarlo | no |
| `papa-francesco` | Francesco | Francis | no |
| `papa-andrea` | Andrea | Andrew | no |
| `papa-luca` | Luca | Luke | no |
| `papa-paolo` | Paolo | Paul | no |
| `papa-stefano` | Stefano | Stephen | no |
| `papa-davide` | Davide | David | no |
| `papa-claudio` | Claudio | Claude | no |
| `papa-federico` | Federico | Frederick | no |

### Mamma

| id | it | en | traducibile |
|---|---|---|---|
| `mamma-giulia` **(pred.)** | Giulia | Julia | no |
| `mamma-anna` | Anna | Ann | no |
| `mamma-chiara` | Chiara | Clare | no |
| `mamma-nicoletta` | Nicoletta | Nicole | no |
| `mamma-laura` | Laura | Laura | no |
| `mamma-elena` | Elena | Helen | no |
| `mamma-silvia` | Silvia | Sylvia | no |
| `mamma-francesca` | Francesca | Frances | no |

### Figlia

| id | it | en | traducibile |
|---|---|---|---|
| `figlia-emma` **(pred.)** | Emma | Emma | no |
| `figlia-sofia` | Sofia | Sophie | no |
| `figlia-alice` | Alice | Alice | no |
| `figlia-giorgia` | Giorgia | Georgia | no |
| `figlia-martina` | Martina | Martina | no |
| `figlia-sara` | Sara | Sarah | no |
| `figlia-chiara` | Chiara | Clare | no |
| `figlia-beatrice` | Beatrice | Beatrice | no |

### Figlio

| id | it | en | traducibile |
|---|---|---|---|
| `figlio-tommaso` **(pred.)** | Tommaso | Thomas | no |
| `figlio-leo` | Leo | Leo | no |
| `figlio-marco` | Marco | Mark | no |
| `figlio-giorgio` | Giorgio | George | no |
| `figlio-matteo` | Matteo | Matthew | no |
| `figlio-lorenzo` | Lorenzo | Lawrence | no |
| `figlio-simone` | Simone | Simon | no |
| `figlio-filippo` | Filippo | Philip | no |
| `figlio-claudio` | Claudio | Claude | no |
| `figlio-federico` | Federico | Frederick | no |
| `figlio-paolo` | Paolo | Paul | no |

---

## 4 — COGNOMI

**TABELLE_013** · *Non si traducono: colonna identica per costruzione.*

| id | it | en | traducibile |
|---|---|---|---|
| `cognome-costa` **(pred.)** | Costa | Costa | no |
| `cognome-rossi` | Rossi | Rossi | no |
| `cognome-bianchi` | Bianchi | Bianchi | no |
| `cognome-ferrari` | Ferrari | Ferrari | no |
| `cognome-ferrario` | Ferrario | Ferrario | no |
| `cognome-russo` | Russo | Russo | no |
| `cognome-marino` | Marino | Marino | no |
| `cognome-barberis` | Barberis | Barberis | no |
| `cognome-ambruosi` | Ambruosi | Ambruosi | no |

**TABELLE_014** · ⚠️ *`Ferrari` e `Ferrario` si somigliano:* **se un giorno la pronuncia degli slot
venisse valutata, il riconoscimento vocale farebbe fatica a distinguerli.**

---

## 5 — ETÀ

**TABELLE_015** · *Una tabella sola, e i due slot ne elencano intervalli diversi: il magazzino è più
grande della vetrina.*

| id | it | en | traducibile |
|---|---|---|---|
| `eta-4` | 4 | four | sì |
| `eta-5` | 5 | five | sì |
| `eta-6` | 6 | six | sì |
| `eta-7` | 7 | seven | sì |
| `eta-8` **(pred. figlio)** | 8 | eight | sì |
| `eta-9` | 9 | nine | sì |
| `eta-10` | 10 | ten | sì |
| `eta-11` | 11 | eleven | sì |
| `eta-12` | 12 | twelve | sì |
| `eta-13` | 13 | thirteen | sì |
| `eta-14` | 14 | fourteen | sì |
| `eta-15` | 15 | fifteen | sì |
| `eta-16` **(pred. figlia)** | 16 | sixteen | sì |
| `eta-17` | 17 | seventeen | sì |

**TABELLE_016** · **Le due colonne servono due usi, non sono una duplicazione:** *la **cifra** nella
schermata di personalizzazione — scegliere `16` è più veloce; la **parola** nel dialogo e in Voice
Practice.* **Un numero si scrive in lettere quando è la parola che stiamo insegnando** (inventario
3.1).

---

## 6 — LUOGHI DI PARTENZA — città e paese accoppiati

| id | città it | città en | paese it | paese en | traducibile |
|---|---|---|---|---|---|
| `orig-mondovi` **(pred.)** | Mondovì | Mondovì | Italia | Italy | sì |
| `orig-torino` | Torino | Turin | Italia | Italy | sì |
| `orig-milano` | Milano | Milan | Italia | Italy | sì |
| `orig-roma` | Roma | Rome | Italia | Italy | sì |
| `orig-napoli` | Napoli | Naples | Italia | Italy | sì |
| `orig-palermo` | Palermo | Palermo | Italia | Italy | sì |
| `orig-lugano` | Lugano | Lugano | Svizzera | Switzerland | sì |
| `orig-nizza` | Nizza | Nice | Francia | France | sì |

**TABELLE_017** · **Città e paese sono una riga sola, mai due slot:** *sceglierli separati permetterebbe
«Torino, Francia»* (regola 2.7).

**TABELLE_018** · *Lugano e Nizza ci sono perché ci sono più italofoni fuori dall'Italia di quanti se ne
pensi: uno studente di Lugano non deve dichiarare un paese che non è il suo.*

**TABELLE_019** · **La frase risultante è `I am from Turin, Italy`.**

**TABELLE_027** · **Un paese di partenza nuovo vuole «in» in italiano:** *per questo, se servirà, si dirà
**Inghilterra** e non Regno Unito — «**nel** Regno Unito».*

**TABELLE_028** · ⚠️ **Origine e destinazione non coincidono mai** (regola 1.73). *Il conflitto si toglie
dal magazzino, non con una regola applicata mentre l'app gira: una famiglia che parte dalla Francia
per la Francia produce frasi corrette e una storia che non sta in piedi.*

---

## 7 — DESTINAZIONI

**TABELLE_020** · **La famiglia va in Cina.** *L'inglese è credibile perché è la lingua in cui si
capiscono stranieri e cinesi — e i personaggi parlano inglese con **l'accento del posto**.*

**TABELLE_021** · **La destinazione è una città, non una nazione:** *la nazione viene con la città,
altrimenti gli accenti dei personaggi non tornano col posto.*

| id | it | en | traducibile |
|---|---|---|---|
| `dest-pechino` **(pred.)** | Pechino | Beijing | sì |
| `dest-shanghai` | Shanghai | Shanghai | sì |
| `dest-hong-kong` | Hong Kong | Hong Kong | sì |

**TABELLE_022** · **I criteri, tutti obbligatori:**

| | Criterio | Perché |
|---|---|---|
| 1 | **Nessun articolo nel nome, né in italiano né in inglese** | *«a Pechino», «to Beijing» — mai «al Cairo»* (registro `025`) |
| 2 | **Una grande porta d'ingresso per chi arriva dall'estero** | *la famiglia ci atterra dall'Italia* |
| 3 | **Dove l'inglese è più credibile** | *la regola della scena credibile* (obiettivi `005`) |
| 4 | **Poche** | *gli episodi devono funzionare in tutte: meno città, episodi neutri* |

**TABELLE_023** · **Le altre città della Cina non sono una scelta: sono il viaggio.** *Xi'an e Chengdu
arrivano nella storia — col treno — non nella personalizzazione.*

---

## 8 — CHIAVI E SEGNAPOSTO

**TABELLE_024** · **I segnaposto dei file di contenuto (`{papà}`) e le chiavi del JSON (`papa`,
`figliaNome`…) non coincidono.** *Vedi `rinomine` 004.*

---

## 9 — APERTI — cosa manca perché il JSON coincida con questo file

**TABELLE_025** · **Oggi il JSON ha il contenuto vecchio:** *id `marco` invece di `papa-marco`, sei
destinazioni nazione invece di tre città, traducibilità dedotta dalla tabella invece che
dichiarata, colonne `fr` `es` `de` vuote.*

| | Cosa | Nota |
|---|---|---|
| ② | **Il secondo campo per riga** — *il paese accoppiato alla città di partenza* | *`Italy` esce dal grado A di `gate`* |
| ③ | **Le età diventano parole** — *oggi l'app dice `I'm 16 years old`* | ⚠️ **cambia cosa il riconoscimento vocale si aspetta di sentire: vuole un test suo** |
| ④ | **La migrazione dei valori salvati** — *`marco → papa-marco`, `16 → eta-16`* | *senza, chi ha personalizzato torna ai valori predefiniti in silenzio* |
| ⑤ | **Il test rovesciato:** *ogni id elencato da un episodio esiste nel magazzino* | *non «ogni riga è usata»: il magazzino è più grande della vetrina* |
| ⑥ | **Le tre città al posto delle sei nazioni** | *tocca `aircraft-door`* |
| ⑦ | **Via le colonne `fr` `es` `de`** | *un'edizione non è una traduzione* |

**TABELLE_026** · **Si fanno insieme, perché cambiano gli id:** *una migrazione sola invece di tre.* **E ③
va dentro con un test suo**, *non nascosta in uno spostamento di dati.*
