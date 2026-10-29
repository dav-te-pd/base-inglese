> # ⚠️ ARCHIVIO — FOTOGRAFIA DATATA, NON DESCRIVE LO STATO DI OGGI
>
> | | |
> |---|---|
> | **Quando** | 2026-10-29, sul commit `b42ed7d` |
> | **Cos'era** | il giro sulle **condizioni dello storico una per una** — quello che il giro dei buchi del 2026-10-21 aveva dichiarato di non aver fatto. Chiesto da chi guida il progetto prima del collaudo |
> | **Come è stato fatto** | ⚠️ **lettura DELEGATA a un'altra istanza, sola lettura**, e verificata **a campione**, non riga per riga: confermati il punto 1 (cinque chiavi del magazzino scritte nella forma di prima del 2026-09-22 in quattro strumenti di `tests/tools/`) e il punto 4 (`grep -c quiz-driver tests/ERRORI-INGOIATI.md` → 0). *Una riga di qui non è una misura finché qualcuno non la rifà* |
> | **Cosa guardare invece** | `docs/decisioni-stato.md`, dove le righe decise da chi guida il progetto entrano con la loro condizione |
>
> *Non si aggiorna.*

# Le condizioni dello storico, una per una — misura del 2026-10-29

Repository a `b42ed7d` (clone shallow: `git log` arriva solo al 2026-10-16, quindi le date più vecchie vengono da `correzioni.md` e non da git). Sola lettura: niente è stato modificato.

## I conteggi

**101 condizioni trovate**, da tre fonti:

- **41** dal grep di partenza (`Quando si esegue|Condizione`): 39 righe di prosa (la 877 ne contiene due, la 4101/4102 conta una) più le due tabelle «Come si lavora» (2587) e «Rinomine» (2594), una riga ciascuna;
- **2** condizioni in prosa che il grep non prende perché scritte in minuscolo: 639 e 1122;
- **46** righe delle tabelle con colonna «Quando si esegue» (3899, 3911, 3925, 3968, 4002, 4034, 4054, più le tre righe sciolte 4046/4048/4050);
- **12** righe della tabella N della «cronologia nuova» (1480-1502), che hanno la condizione nell'ultima colonna o nel testo («dopo l'episodio 5», «il giorno che un file supera i 400 s»). Il grep non le trova: la parola «Condizione» compare solo sulla N.5.

| Stato | Quante |
|---|---|
| FATTO | **41** |
| SUPERATO | **10** |
| APERTO | **43** |
| NON SO | **2** |
| non applicabile (regola di lavoro, nota di riconoscimento, «non scade») | **5** |

**Dove stanno le 43 APERTE rispetto a `decisioni-stato.md`:**

- **5** sono nella tabella dell'aperto con una riga loro: F.3 ×2, il giro di allineamento ②, il Pannello Admin vero, il mix;
- **16** ci arrivano solo **attraverso la riga «Le cose piccole»**, che rimanda alle famiglie dello storico, oppure stanno in una sezione dello stato fuori tabella: tappe ③/④, stato:1324-1328. ⚠️ Quella riga dice *«nessuna ha una condizione propria»*, e nello storico ognuna ne ha una;
- **22 non compaiono in nessun punto di `decisioni-stato.md`.**

**Le condizioni già scattate e non eseguite sono 9:** le prime otto voci di «Da guardare ①» più la 4057 di «④». La nona voce di ①, la 4072, è solo probabile; della 2265 non si sa.

---

## La tabella

Abbreviazioni: **corr** = `docs/correzioni.md`, **stato** = `docs/decisioni-stato.md`. «Prima di Supabase» vuol dire nella tappa ①, cioè anche prima del collaudo.

### A. Le 41 del grep, più le due in minuscolo

| riga storico | cosa | condizione | stato + prova | nell'aperto? | scattata? | quando cade |
|---|---|---|---|---|---|---|
| 187 | `episodeFinalOutcomeCase` e `buildTargetTokens` senza chiamanti | si decide quando si costruisce il Modulo Finale | **FATTO**: cancellate col passo F.5, corr:319 (2026-09-24). `grep -n "function episodeFinalOutcomeCase\|function buildTargetTokens" app/*.js` → 0 | no (chiusa). ⚠️ stato:1295 (4.2) dice ancora «che usa `episodeFinalOutcomeCase`» | sì (anticipata) | — |
| 877 (a) | 21-quater: riprendere la conversione di Flash Card | la riga di categoria su tre famiglie, i due numeri falsi corretti, `COPPIE` deciso | **FATTO**: 21-quater chiuso, storico:930 («gli otto del 21-quater»); `app/dialogo.js:762` `BI.unaVoltaSola` | no | sì | — |
| 877 (b) | `[SR Task1]`: alla prossima rossa leggere il motivo stampato | prossima rossa | **FATTO**: causa trovata il 2026-09-25, il popup dei tentativi (corr:338) | no | sì | — |
| 938 | chiave del tema e degli override come letterali in `avvio.js` | nello strato che li riunisce (`identita`) | **FATTO**: corr:71 (09-17, tema), corr:68 (09-18, override); `app/avvio.js:168` legge `BI.THEME_KEY`, `:178` espone `CONFIG_OVERRIDES_KEY` | no | sì | — |
| 977 | `righeDiCodiceDi()` lascia passare la prosa dei banner `/* */` | alla prima grep non ancorata a `nome('` | **APERTO**: `tests/test-env.js:130-136` è invariato. Misurate oggi **269 righe** dentro `/* */` in 10 file di `app/` che passano il filtro (catalogo 58, sessione 48, dialogo 36, voice 34, …) | **no** | **sì, a rigore**: `test_dati_estratto.js:96-106` cerca `\bfetch\(` in tutti i file di `app/` senza apice. Il guasto lì sarebbe un falso rosso, non un falso verde | senza scadenza |
| 993 | 13 letterali `'baseinglese:mastery:…'` nei test | nello strato che contiene la mastery, esponendo `masteryStorageKey` | **FATTO**: `app/progressi.js:434` `BI.masteryStorageKey`. `grep -rn "baseinglese:mastery:" tests --include=*.js` → 1, ed è un commento (`test_scala_colori.js:16`) | no | sì | — |
| 1053 | la migrazione `customizeSeenKey` / `migrateCustomizeSeenToModuleProgress` | quando si decide che nessun profilo pre-mappa vada più servito | **APERTO**: `app/apertura.js:252-269`, `app/progressi.js:457` | **no** | no (è una decisione) | **con Supabase**: la regola 50 dice che lì ogni convertitore si porta di là o muore |
| 1089 | 197 letterali delle chiavi di progresso nei test → esporre i 12 costruttori e farli leggere ai test | quando lo strato `progressi` esce | **APERTO, a metà**: i 12 costruttori sono esposti (`progressi.js:431-465`), 31 file di test leggono `BI.*Key`. Restano **27** `'baseinglese:introDismissed` e **2** `'baseinglese:repeatAloudIntroDismissed`. ⚠️ **E il danno previsto è già successo negli strumenti**: `'baseinglese:modules:gate:'` in `tests/tools/apri-modulo.js:62`, `screenshot_blocco_ascolto.js:82`, `scrivi-baseline-listener.js:71`, `misura-finestra-apertura.js:106`, e `'baseinglese:gate:customizeSeen:'` in `scrivi-baseline-listener.js:69`. La chiave vera porta l'edizione dal 2026-09-22 (passo 1.17, corr:288): `progressi.js:116` e `:148` danno `baseinglese:inglese-it:modules:gate:…` | **no** | **sì** (09-17) | **prima di Supabase** (regola 50: è il cambio di chiave più grande) |
| 1122 | il ponte degli alias in `index.html` | sparisce nel passo che decide come si raggiunge l'estratto | **FATTO**: si è svuotato da solo, storico:162-167. `index.html:1208` è `window.BI.boot();` | no | sì | — |
| 1137 | un `<script src>` che non arriva non passa da `showLoadError` | quando i moduli arriveranno a richiesta («passo 23») | **APERTO**: nessun gestore. `grep -n "onerror" index.html` → 0; `app/apertura.js:80` `BI.moduliCaricatiAlBoot = true` | **no**. stato:1324-1328 ha il gemello delle pulizie, non questo | **no nei fatti**: il 23 è chiuso (19/09) ma il caricamento a richiesta non è mai nato | senza scadenza (scatta col caricamento a richiesta o con l'offline, 4.6) |
| 1175 | duplicazione fra `test_progressi_estratto` e `test_identita_estratta` | al prossimo strato, in un commit suo | **FATTO**: `tests/strati.js` (nasce «al terzo caso»), lo usano 9 file | no | sì | — |
| 1227 | i tre gruppi senza casa: regola della mastery, suoni, Pannello Admin | prima di cominciare il 23 | **FATTO**: `app/sessione.js:84,98`, `app/suoni.js:85`, `app/mappa.js:776` | no | sì | — |
| 2184 | marcare la prosa che spiega un'attesa dove uno strumento non la vede | quando la si incontra | non applicabile: è una regola di lavoro | no | — | senza scadenza |
| 2265 | il volume di default di `sfxPlayTone` esce in `APP_CONFIG` | alla prossima modifica dei suoni, o se si vuole regolare Corretto dal Pannello | **APERTO**: `app/suoni.js:93` `volume === undefined ? 0.15 : volume` | sì, sotto «Le cose piccole» (stato:72, stato:1318) | **NON SO**: `suoni.js` è nato il 18/09 per spostamento; la storia git non arriva così indietro, e nessuna riga di corr dice «modifica dei suoni» | senza scadenza |
| 2374 | `test_batch19`: alla prossima rossa leggere la RIPARTIZIONE | prossima rossa | **FATTO**: applicata il 2026-09-16 (corr:152, `toccaFinoA` conta i tocchi) e `[SR Task1]` chiusa il 09-25 (corr:338) | ⚠️ **sì, ma da chiusa**: stato:72 e stato:1319 dicono ancora «la causa … mai chiusa» | sì | — |
| 2512 | `window.APP_CONFIG_DEFAULTS` scritta e mai letta | si decide quando si estrae lo strato che contiene il Pannello Admin (passo 22) | **APERTO**: `app/avvio.js:79` la scrive a ogni caricamento; in `app/` non la legge nessuno (`grep -n "APP_CONFIG_DEFAULTS" app/*.js` → l'assegnazione e un commento). La leggono solo `tests/test_config_estratto.js:201` e `tests/avvio-census.js:84` | **no** | **sì**: il Pannello è in `app/mappa.js` dal 2026-09-20 | **con Supabase** (3.5, il Pannello rifatto). Era già scattata prima |
| 2542 | nessun segno mentre il modulo carica, e la riga **si può toccare di nuovo** | al passo 22, quando al fetch dei dati si aggiunge quello dello script | **APERTO**: `app/apertura.js:342-401` non spegne la riga e non mostra niente; il listener (`:403-414`) guarda solo `btn.disabled` | **no** | **sì sul nome** (il 22 è chiuso), **no sul fatto** (lo script non arriva mai a richiesta) | **nel collaudo** (rete lenta su Pages) e **con Supabase** (dati da una rete vera) |
| 2562 | l'eccezione della regola 33 in `CLAUDE.md` | al primo giro che tocca `CLAUDE.md` | **FATTO**: `CLAUDE.md`, regola 33, «UNA SOLA ECCEZIONE» | no | sì | — |
| 2589 | regola 41 (tabella «Come si lavora») | — | **FATTO**: la riga stessa dice «Fatto», ed è la regola 41 | no | sì | — |
| 2596 | la rinomina unica, cinque nomi (tabella «Rinomine») | prima di un collaudo su profilo nuovo | **FATTO**: `grep -rn "speedRound\|quickMatch\|\bse[A-Z]" app/*.js` → 2, tutti e due nei commenti (`speedmatch.js:334-335`) | no | sì | — |
| 2726 | report VERDE e mappa ROSSA | quando il report sarà visibile allo studente | **APERTO** | **sì**: F.3 ③ | no | dopo Supabase (4.3) |
| 2757 | ogni tag `<script>` nuovo allarga le corse | «niente da eseguire finché non ricapita» | **SUPERATO**: lo spacchettamento è finito; resta una nota per riconoscere il caso | no | — | — |
| 2782 | `conta-asserzioni --scrivi` scriveva un baseline a zero | alla prossima volta che si tocca lo strumento | **FATTO**: `tests/tools/conta-asserzioni.js:226-262`, rifiuto con uscita 2 (2026-09-24) | no | sì | — |
| 2881 | l'astrazione della fonte (`app/fonte.js`) | insieme a C2, la divisione dei dati | **SUPERATO in altra forma**: il passo 1.7 è diventato `app/magazzino.js` (corr:32, 2026-09-20), e i fetch erano già un punto solo. `app/fonte.js` non esiste (`ls app/`). ⚠️ `app/dati.js:95-97` dice ancora «Quando nascerà `app/fonte.js` (passo 1.7)» | in parte: 3.3 | sì | con Supabase |
| 3004 | due prove: CI a 4 CPU, poi repo privato | quando il da farsi è finito e verificato | **CI 4 CPU FATTA** (stato:1164-1176, stato:1263, 2026-09-21). **Repo privato APERTO** | repo privato: sì, ma fuori tabella (tappa ③, 3.2, stato:1264) | no | con Supabase |
| 3054 | il giro sui test che cercano in `index.html` cose che potrebbero essersi spostate | prima del prossimo spostamento grosso | **NON SO**: tre corretti il 19/09 con `sorgenteChe` (corr:144, `tests/test-env.js:138`). Oggi `grep -rln "repoPath('index.html')" tests` → 21 file, e un giro completo non risulta. Il rischio però è quasi sparito: `index.html` non ha più codice dal 2026-09-20 | no | sì (C2, il CONFIG spezzato, il 22) | senza scadenza |
| 3083 | passo A, la vista morta | appena arriva il prompt | **FATTO**: corr:47 | no | sì | — |
| 3118 | la lingua di avvio presa dal sistema | col pannello utente, dopo la divisione dei dati | **APERTO**: `grep -n "navigator.language" app/*.js index.html` → 0 | **sì, sotto altro nome**: «Il giro di allineamento…» ② «col selettore di lingua»; anche 4.7 | no: il pannello utente non c'è | dopo Supabase |
| 3354 | C1 dopo B; C2 è la divisione dei dati | — | **FATTO**: C1 corr:45; la divisione è fatta coi passi 1.11 e C (struttura per edizione, `data/condivisi/{studente}`). ⚠️ corr:44 chiama «Passo C2» un'altra cosa, l'uscita di `apertura.js` | no | sì | — |
| 3377 | l'ordine divisione → Supabase → pannello | decisione sua, prima di C2 | **FATTO**: le quattro tappe di stato:583 lo seguono, e la divisione è fatta | no | sì | — |
| 3417 | cos'è «l'edizione corrente» | prima di C | **FATTO**: `CONFIG.edizione` (`app/progressi.js:115`, `app/dati.js:223`) | no | sì | — |
| 3451 | rendere meccanico il fermare un processo (`ferma-server.sh`) | alla prima occasione in cui serve davvero fermare un processo | **APERTO**: `ls tests/tools` → nessun `ferma-server` | **no** | NON SO | senza scadenza |
| 3484 | le pulizie dipendono dai file caricati | prima di rendere falsa `BI.moduliCaricatiAlBoot` | **APERTO**: `app/apertura.js:80` vale `true` | sì, ma fuori tabella: stato:1324-1328 | no | senza scadenza |
| 3537 | i due «colori» di Flash Card | al giro di design sulla mastery | **APERTO** | **sì**: F.3 ① | no (decide chi guida il progetto) | senza scadenza |
| 3687 | il taglio per silenzio che conta dal click | al passo 26 | **FATTO** prima del 26: corr:272-273 (2026-09-21), stato:717 «F.1 chiusa tutta» | no | sì | — |
| 3745 | il pannello Help aperto troppo presto resta vuoto | quando si tocca il pannello Help | **FATTO**: corr:39 (2026-09-20); `app/ui-condivisa.js:424` aspetta `loadModuleInstructions()` | no | sì | — |
| 3773 | i `fetch` dei dati senza versione | al prossimo lavoro su `app/dati.js` | **FATTO**: `app/dati.js:53-79` (passo 1.9, regola 6) | no | sì | — |
| 3807 | due test del popup **si appendono** invece di fallire, e l'errore ingoiato in `quiz-driver.js` | al prossimo giro sulle attese dei quiz, o prima di estrarre Match/Speed Match | **APERTO, a metà**: `tests/quiz-driver.js:97` `.catch(function () {})` c'è ancora, e `grep -n "quiz-driver" tests/ERRORI-INGOIATI.md` → 0, quindi non è censito. Se `test_batch7` / `test_outcome_step_ids` si appendano ancora: **NON SO**, non rifalsificato. I cicli hanno un tetto (`test_batch7.js:101,213,270`, `test_outcome_step_ids.js:175`) | **no** | **sì**: Match e Speed Match sono usciti il 19/09 (corr:51) | senza scadenza |
| 3855 | 17 finti sintetizzatori senza `speaking` | prima del prossimo spostamento su voce/microfono | **FATTO**: F.4, corr:303-304 (2026-09-24), `tests/mock-browser.js` | no | sì | — |
| 4101 | voci con accento (ElevenLabs) | al primo episodio con accenti diversi; «dopo Supabase» è caduta (storico:4126) | **APERTO** | sì, ma fuori tabella: tappa ④, 4.5 (stato:1296) | no: gli speaker sono `papa`, `mamma`, `figlio`, `figlia`, `tutti` | senza scadenza |
| 4304 | `config` chiuso, Pannello dietro login | insieme alla configurazione su Supabase | **APERTO** | **sì**: «Il Pannello Admin vero» | no | con Supabase |
| 4381 | il taglio per silenzio al 26 (doppione della 3687) | al 26 | **FATTO**: corr:272 | no | sì | — |
| 639 | NIENTE FRAMEWORK, e la condizione che riaprirebbe | se entra una seconda persona | non applicabile: è la condizione che riaprirebbe una decisione presa | no | no | senza scadenza |

### B. Le tabelle con la colonna «Quando si esegue»

| riga storico | cosa | condizione | stato + prova | nell'aperto? | scattata? | quando cade |
|---|---|---|---|---|---|---|
| 3901 | avviso microfono al livello 3 arrivandoci da «Invia» | da fissare (decisione) | **FATTO**, deciso nel codice: `app/voice.js:446-454` (bloccato, si esce dalla mappa) e `:535` | no | sì | — |
| 3902 | Voice Check non scrive la mastery | insieme a «il dato si registra sul target» | **FATTO**: 2-bis ② (storico:402); `voice.js:975-994` | no | sì | — |
| 3903 | una voce nuova nasce rossa anche se la risposta è giusta | da decidere | **FATTO**: regola 39; `app/sessione.js:99` | no | sì | — |
| 3904 | il guardiano del silenzio si disarma col rumore | insieme al punto sopra | **SUPERATO** da F.1: `voice.js:175-184` (due bandiere) e `:232-239` (il prezzo dichiarato) | no | sì | — |
| 3905 | le card senza skill non ricevono `is-ahead` | da fissare | **FATTO**: `app/storycards.js:484-493` | no | sì | — |
| 3906 | `addSeExplanationStat` somma invece di sostituire | da decidere | **FATTO**: `app/progressi.js:248-260` (`corrente` + `cambi`) | no | sì | — |
| 3907 | «Speak Easy» e `voicePractice-2` nel Pannello | da fissare | **FATTO**: `app/mappa.js:704` `stepLabel(id)`; `index.html:474` | no | sì | — |
| 3913 | segnaposto in notazione leggibile nel md e chiavi vere nel JSON | con la rinomina degli slot a id | **FATTO**: il md di `gate` usa `{papa}`, `{figliaNome}`…, le stesse chiavi del JSON | no | sì | — |
| 3914 | `speaker: "guide"` per l'Hostess | al secondo personaggio esterno | **SUPERATO**: `grep -c '"guide"' data/inglese/it/*.json` → 0 ovunque | no | — | — |
| 3915 | nota 3 di `gate.md`: i numeri in lettere | quando si farà il magazzino | **SUPERATO**: il md porta solo dati dal 09-28; «nota 3» e «in lettere» → 0 | no | — | — |
| 3916 | due tabelle di destinazioni | quando si farà il magazzino | **SUPERATO**: `places.destinations` uscita il 2026-10-20 (`inglese-it-migrazioni-personalizzazione.json:5`); `places` ha solo `departures` | no | — | — |
| 3917 | perché Spagna e Germania sono uscite | prima del magazzino | **SUPERATO**, con la riga sopra | no | — | — |
| 3927 | la D3: il colore sale solo su risposte verificate | insieme al report vero | **APERTO** (sospesa) | sì, sotto «Le cose piccole» (stato:1320) | no | dopo Supabase (4.3) |
| 3928 | il dato registrato sul target | (a) subito, (b) per il report | **FATTO (a)**: `voice.js:994`, storico:401 ☑. (b) non serve al comportamento | no | sì | — |
| 3929 | il report diviso per grado | dopo il pannello, con la D3 | **APERTO** | sì: stato:1320 ⑤ e 4.3 | no | dopo Supabase |
| 3930 | **il badge di Voice Check segna 0% su una registrazione MUTA** | «fuori dalla ②», nessuna condizione vera | **APERTO**: `voice.js:926-927` fa `vcFirstAttemptPercents.push(pct)` senza guardare `recognizedWords`; i colori invece sono protetti (`voice.js:976`), e `vcEvaluate` gira anche a zero parole (`:870`) | **no** | non ha condizione | **nel collaudo**: si vede sulla mappa |
| 3931 | `LastAttemptRule` vale per il badge e non per i colori (il nome) | quando si toccheranno i nomi | **APERTO**: `voice.js:97,103`, `catalogo.js:120` | **no** | no | senza scadenza (giro delle rinomine) |
| 3932 | in un modulo nuovo si chiede prima di completare ciò che non è detto (regola da scrivere) | «non adesso: quando ci arriveremo» | **APERTO**: non c'è in `CLAUDE.md`; la regola 31 la copre solo in generale | **no** | no (nessun modulo nuovo) | dopo Supabase (4.1) |
| 3933 | i colori parcheggiati finché il modulo non è completato | da fissare | **FATTO**: `app/sessione.js:62,153,198` (`pendingMastery` / `commitPendingMastery`) | no | sì | — |
| 3970 | quattro valori ricopiati invece che letti dalla fonte | dopo il collaudo, con `test_batch19` | **FATTO** col passo 15 (storico:2278, 2026-09-15). `grep -n "1568\|1976" tests/test_new_features.js tests/test_batch3b.js` → 0 | ⚠️ **sì, ma da chiusa**: stato:1317 | sì | — |
| 4004 | le risposte di Why We Say It non sono aggregabili | con Supabase | **APERTO** | sì, sotto «Le cose piccole» (stato:1316) | no | con Supabase |
| 4005 | i tre Dialogue non registrano per battuta | da valutare | **APERTO** | sì: stato:1316 | no | senza scadenza |
| 4036 | `test_config_letta`: una foglia dal nome generico | al primo parametro col nome generico | **APERTO** (deroga) | sì: stato:1314 | **no**: `grep -nE "^\s+(name\|label\|value\|title\|text)\s*:" app/config.js` → 0 | senza scadenza |
| 4037 | `test_episodio2`: il testo non è confrontato col md | al terzo episodio | **SUPERATO**: `tests/test_testi_dal_markdown.js:1-7` verifica che il JSON sia esattamente l'uscita del md | sì: stato:1314 | — | — |
| 4038 | `test_attendi`: i default delle soglie non sono provati | quando `attendi.sh` entra in uno script | **APERTO** | sì: stato:1314 | **no**: nessuno script la lancia, `attendi-ci.sh` la cita solo nei commenti | senza scadenza |
| 4039 | `test_sblocco_sequenziale` guarda solo il passo bloccato | se lo Sblocco prende una terza variante | **FATTO**: la terza è nata il 09-22 e la testata la nomina e rimanda a `test_lista_episodi.js` (`test_sblocco_sequenziale.js:13-15`) | sì: stato:1314 | sì | — |
| 4040 | `test_episodi_corti` non guarda il testo dell'errore | se `test_errore_caricamento` smette di proteggerlo | **APERTO** (deroga) | sì: stato:1314 | no | senza scadenza |
| 4041 | `test_report_mastery`: nessun contatore di scritture | quando la mastery avrà un contatore | **APERTO** (deroga) | sì: stato:1314 | no (la voce è `{level, streak}`) | senza scadenza |
| 4042 | asserzioni negative esentate | «non scade» | non applicabile | sì: stato:1314 | — | — |
| 4043 | `test_interruttore_episodio` guarda un modulo solo | quando i descrittori smettono di ripetere il `dataFile` | **SUPERATO**: `dataFile: true` è un booleano e il percorso si ricava (`app/catalogo.js:77,113-124`) | sì: stato:1314 | sì | — |
| 4044 | `test_match_practice_nonloso`: una direzione sola | se le direzioni smettono di condividere `qmRenderQuestion` | **APERTO** (deroga) | sì: stato:1314 | no (`app/match.js:165`) | senza scadenza |
| 4046 | `match` e `matching` adiacenti nel Pannello | quando si tocca il Pannello per un'altra ragione | **APERTO**: `app/config.js:165` `matching`, `:434` `match` | **no** | **sì**: Pannello toccato il 02/10 (tendina) e il 23/10 (corr:417) | senza scadenza |
| 4048 | nomi ridondanti `storyCardsCardIndex`, `storyCardsCurrentCardId`, `storyCardsCurrentCardIndex` | quando la rinomina 5 è chiusa e verde | **APERTO**: `app/storycards.js:479-545` | **no** | **sì** (rinomina chiusa il 09-09/10) | senza scadenza |
| 4050 | `id="help-form-back"` duplicato | quando si tocca la vista dell'Help | **APERTO**: lo stesso id in due template, `app/ui-condivisa.js:504` e `:512`. Se finiscano nel DOM insieme: NON SO, probabilmente no | **no** | **sì**: Help toccato il 20/09 (corr:39) | senza scadenza |
| 4056 | due deploy ravvicinati fanno fallire Pages | «niente da fare» | non applicabile | — | — | — |
| 4057 | `actions/checkout@v4` e `setup-node@v4` da portare a `@v5` | quando si tocca il workflow, o al segnale della scadenza | **APERTO**: `.github/workflows/regressione.yml:67,80` | sì, sotto «Le cose piccole» (stato:1315) | **sì**: workflow toccato il 2026-09-24 per `paths-ignore` (corr:296) | prima di Supabase. La riga «CI 915 s» dell'aperto fa prevedere un ritocco al workflow |
| 4058 | divergenza off/seen in `tests/module-order.js` | sparisce quando il passo sarà `modulo + grado` | **APERTO**: `tests/module-order.js:42-52` | sì: stato:1315 | no | senza scadenza |
| 4059 | testi dell'avviso microfono scritti nel codice | tutti insieme | **FATTO**: `voice.js:465-476` li legge con `uiText`. Le stringhe che restano nel codice sono nella riga «I testi che lo studente legge» | sì, per il resto | sì | — |
| 4060 | terza dipendenza da `index.html` letto come testo | quando diventerà un problema | non applicabile / NON SO | no | — | senza scadenza |
| 4061 | `view-pronunciation` morta; `tokenize`/`classify` in un file loro | passo dopo il 25 / l'estrazione di `quiz-engine` | **FATTO**: corr:47; `app/quiz-engine.js:115,195` | no | sì | — |
| 4068 | seconda implementazione del riconoscimento vocale | insieme a `view-pronunciation` | **FATTO**: corr:47 («l'apparato `SpeechRecognition` che serviva solo a lei») | ⚠️ **sì, ma da chiusa**: stato:1315 la elenca ancora | sì | — |
| 4069 | `bootAsUser` / `mockInit` | ognuno al suo passo | **FATTO**: F.4, corr:303; `tests/boot.js`, `tests/mock-browser.js` | no | sì | — |
| 4070 | Match en→it: nessun test sul Blocco Ascolto della consegna | alla prima apertura di un test di Match | **FATTO**: `qm-prompt-audio` in `tests/test_blocco_ascolto.js` e `tests/test_batch17.js` | no | sì | — |
| 4071 | lo script che conta le varianti diventa uno strumento | quando servirà la seconda volta (F.4) | **SUPERATO**: F.4 è stato fatto, e in `tests/tools` non c'è uno strumento di varianti | no | sì | — |
| 4072 | controllo sui nomi citati nei commenti | alla prossima rinomina grossa | **APERTO**: nessuno strumento | **no**. Ha un parente: il giro dei buchi #12, i commenti scaduti di `app/` | **probabile**: `ruolo`→`role` (28/09), `{{x:en}}`→`{{x:target}}` (30/09), `speedRoundMessages` (28/09) | prima del «giro delle rinomine» (④ delle sequenze) |
| 4073 | la lettura dei commenti a ogni estrazione | dentro la fase 4 | **FATTO** per la fase, chiusa il 20/09. Quello che resta è il giro dei buchi #12 | no | sì | — |

### C. La tabella N della «cronologia nuova» (1480-1502)

| riga storico | cosa | condizione | stato + prova | nell'aperto? | scattata? | quando cade |
|---|---|---|---|---|---|---|
| 1489 N.1 | il flusso del mix e dei distrattori (opzioni identiche, C.6) | fine spacchettamento, poi priorità | **APERTO**: `app/sessione.js:240-249` non scarta le opzioni con lo stesso testo; `nonCon` (10/07) ne copre una parte | **sì**: «La copia all'apertura, il mix…» (al 3.3) | no | con Supabase |
| 1490 N.2 | **nomi uguali in due tabelle di persone**: con lo stesso nome, due frasi di C diventano identiche | «quando gli episodi sono in serie» | **APERTO**, misurato oggi su `inglese-it-tabelle-personalizzazione.json`: `papa ∩ figlio` = Mark, Paul, Claude, Frederick; `mamma ∩ figlia` = Clare. Se `nonCon` ne neutralizzi l'effetto in Match: NON SO | **no** | no | senza scadenza (nel collaudo se chi prova sceglie nomi uguali) |
| 1491 N.3 | cinque frasi di C uguali a battute di D | latente: se un quiz va sul grado D | **APERTO, latente** | **no** | **no**: nessun quiz sul grado D nelle 6 sequenze delle 3 edizioni (misurato) | senza scadenza |
| 1492 N.4 | la D3 in forma nuova | quando ci sarà un colore sopra i compartimenti | **APERTO** | sì: stato:1320 | no | dopo Supabase |
| 1493 N.5 | il badge nel file dell'episodio | quando il menù vorrà venti fetch | **APERTO** | **no** | no (2 episodi per edizione) | senza scadenza |
| 1494 N.6 | la striscia che non si azzera cadendo | coi dati veri | **APERTO** | **no** | no | dopo Supabase |
| 1495 N.7 | la lista degli episodi e lo sblocco in serie | — | **FATTO**: S.1 (storico:4524, 2026-09-24); `app/mappa.js:1505` `episodeStatus` | no | sì | — |
| 1496 N.8 | **un avviso prima di perdere l'avanzamento** («← Mappa») | dopo l'episodio 5 | **APERTO**: non esiste | **no** (F.7 ha la stessa condizione, ma è un'altra cosa) | no | dopo il quinto episodio |
| 1497 N.9 | i tasti si rinominano tutti insieme | dopo l'episodio 5 | **APERTO** | **no** | no | dopo il quinto episodio |
| 1498 N.10 | la guardia sulla soglia di silenzio di `attendi.sh` | il giorno che un file supera i 400 s | **APERTO** | **no** | probabilmente no: «Lancia la suite» intera 367 s in CI (stato:80). Per singolo file non misurato | senza scadenza |
| 1499 N.11 | il battito durante un'attesa lunga | col prossimo lavoro sulla lista attività | **NON SO** se quel lavoro sia avvenuto | no | NON SO | senza scadenza |
| 1500 N.12 | `attendi-ci.sh` | — | **FATTO** il 2026-09-11 | no | sì | — |

---

## Da guardare

Le sole righe APERTE fuori dalla tabella dell'aperto, oppure con la condizione già scattata, oppure che cadono prima del collaudo o di Supabase. Ordinate per peso.

### ① Scattate, non eseguite, e in nessun punto di `decisioni-stato.md`

1. **storico:1089 — le chiavi del magazzino scritte a mano nei test.** Era la previsione: «148 file da correggere a mano il giorno in cui una chiave cambia forma». **Il giorno è arrivato il 2026-09-22** (passo 1.17, le chiavi portano l'edizione), e cinque letterali negli strumenti sono rimasti alla forma vecchia: `'baseinglese:modules:gate:'` in `tests/tools/apri-modulo.js:62`, `screenshot_blocco_ascolto.js:82`, `scrivi-baseline-listener.js:71`, `misura-finestra-apertura.js:106`, e `'baseinglese:gate:customizeSeen:'` in `scrivi-baseline-listener.js:69`. La chiave vera è `baseinglese:inglese-it:modules:gate:…` (`app/progressi.js:116,148`). Restano anche 29 letterali `introDismissed` nei test: corretti oggi, perché quelle chiavi non portano l'edizione. **Supabase è il cambio di chiave più grande (regola 50).**
2. **storico:2512 — `window.APP_CONFIG_DEFAULTS`**: una copia profonda a ogni caricamento (`app/avvio.js:79`), e nell'app non la legge nessuno. La condizione, «quando si estrae lo strato del Pannello», è scattata il 2026-09-20. Cade di nuovo al 3.5.
3. **storico:2542 — il modulo che carica non dà nessun segno, e la riga si può toccare di nuovo** (`app/apertura.js:342-414`). Scattata sul nome («al passo 22»), mai sul fatto. **Cade nel collaudo** su rete lenta, e **con Supabase**, quando i dati arriveranno da una rete vera.
4. **storico:3807 — l'errore ingoiato in `tests/quiz-driver.js:97`, mai censito** (`grep -n quiz-driver tests/ERRORI-INGOIATI.md` → 0). Scattata quando Match e Speed Match sono usciti (19/09). Se i due test si appendano ancora: NON SO, non rifalsificato.
5. **storico:977 — il filtro `righeDiCodiceDi()`**: oggi 269 righe di prosa dentro `/* */` passano come codice, in 10 file di `app/`. La condizione è scattata a rigore: `test_dati_estratto.js:96-106` cerca `fetch(` in tutti i file di `app/` senza apice. Il guasto lì sarebbe un falso rosso, non un falso verde.
6. **storico:4046 — `match` / `matching` nel Pannello**: il Pannello è stato toccato il 02/10 e il 23/10.
7. **storico:4048 — `storyCardsCardIndex` e i due fratelli**: la rinomina 5 è chiusa dal 09-10.
8. **storico:4050 — `id="help-form-back"` in due template** (`app/ui-condivisa.js:504,512`): Help toccato il 20/09.
9. **storico:4072 — nessun controllo sui nomi citati nei commenti**. La condizione «alla prossima rinomina grossa» è probabilmente già passata (`ruolo`→`role`, `en`→`target`/`native`). Va comunque prima del «giro delle rinomine» che l'aperto aspetta.

### ② Fuori da ogni lista, e cadono nel collaudo o entro Supabase

10. **storico:3930 — il badge di Voice Check segna 0% su una registrazione muta** al primo tentativo (`app/voice.js:926-927`, nessuna guardia su `recognizedWords`). La riga lo chiama «il badge non tace: mente». Non ha una condizione. **Si vede nel collaudo**, sulla mappa.
11. **storico:1053 — la migrazione `customizeSeen`** (`app/apertura.js:252-269`): è un convertitore, e per la regola 50 a Supabase si porta di là o muore. Nessuna riga dell'aperto lo dice.
12. **storico:1490 (N.2) — nomi uguali fra le tabelle di persone** (papà/figlio: Mark, Paul, Claude, Frederick; mamma/figlia: Clare). Nel collaudo si incontra solo scegliendo apposta nomi uguali. Se `nonCon` ne copra l'effetto in Match: NON SO.
13. **storico:1494 (N.6) — la striscia «coi dati veri»**: cade dopo Supabase, e non è scritta da nessuna parte nello stato.

### ③ Fuori da ogni lista, senza scadenza (le altre APERTE non in tabella)

14. storico:1137 — uno `<script src>` che non arriva non passa da `showLoadError`. Aspetta il caricamento a richiesta, che non è previsto; vale anche per l'offline, 4.6.
15. storico:3451 — `ferma-server.sh` non esiste.
16. storico:3931 — il nome `LastAttemptRule` dice metà del comportamento.
17. storico:3932 — la regola «in un modulo nuovo si chiede prima di completare il non detto» non è in `CLAUDE.md`. Cade con 4.1.
18. storico:1491 (N.3) — frasi di C uguali a battute di D: latenti, nessun quiz sul grado D.
19. storico:1493 (N.5) — il badge nel file dell'episodio.
20. storico:1496 (N.8) — l'avviso prima di perdere l'avanzamento con «← Mappa». Dopo l'episodio 5.
21. storico:1497 (N.9) — i tasti rinominati tutti insieme. Dopo l'episodio 5.
22. storico:1498 (N.10) — la guardia sui 400 s per file.

### ④ Nella tabella (via «Le cose piccole»), ma con la condizione già scattata

23. **storico:4057 — `actions/checkout@v4` e `setup-node@v4` → `@v5`** (`regressione.yml:67,80`). La condizione «quando si tocca il workflow» è scattata il 2026-09-24 (`paths-ignore`, corr:296). La riga «CI 915 s» dell'aperto porta verso un nuovo ritocco al workflow (la cache di Chromium).
24. storico:2265 — il volume di `sfxPlayTone` (`app/suoni.js:93`). Se sia scattata: NON SO.

### Trovato di passaggio: righe dello stato che dicono APERTO su cose chiuse

È la forma ① del giro dei buchi, e solo per misura:

- stato:72 e stato:1319 dicono «la causa di `test_batch19` mai chiusa». Chiusa: corr:152 (16/09), corr:338 (25/09).
- stato:1315 elenca «una SECONDA implementazione del riconoscimento vocale» fra le pulizie rimandate. È uscita col passo A, corr:47 (19/09).
- stato:1317 dice «valori ricopiati invece che letti dalla fonte». Fatto col passo 15 (storico:2278).
- stato:1295 (4.2) dice «il Modulo Finale, che usa `episodeFinalOutcomeCase`». La funzione è cancellata (F.5, corr:319).
- stato:72, riga «Le cose piccole»: dice *«nessuna ha una condizione propria»*. Ognuna delle famiglie a cui rimanda ha nello storico una condizione sua (tabelle 3968, 4002, 4034, 4054, sezione 2263).
- `app/dati.js:95-97`: «Quando nascerà `app/fonte.js` (passo 1.7)». Il passo 1.7 è stato fatto, ed è diventato `app/magazzino.js` (corr:32).

*Fuori conteggio, perché non ha condizione:* storico:3866, tre variabili di Voice Coach che sopravvivono da un modulo all'altro (`vcLastAvgPct`, `vcCurrentEvaluated`, `vcRecordStartedAt`). Nessuna lista la porta. Non è stata rimisurata.
