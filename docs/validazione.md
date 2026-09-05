# Validazione — cosa fa davvero l'app oggi

> **Cos'è questo file.** Una lettura del codice di `index.html` fatta senza fidarsi
> di nessun documento, `CLAUDE.md` compreso. Dove il codice contraddice la
> documentazione, qui è scritto **quello che fa il codice**, e la contraddizione è
> segnalata.
>
> **Non è una lista di cose da correggere.** Per scriverlo non è stata toccata
> nessuna logica, nessun nome, nessun difetto. I problemi trovati sono elencati
> nella sezione **4 — Segnalazioni**, con il punto esatto del codice, e restano
> lì finché non si decide cosa farne. Le decisioni prese finora sono nella
> sezione **6**; l'unica che ha già toccato `index.html` è D4, la rimozione di
> una chiave di configurazione che nessuno leggeva.
>
> **Versione della lettura:** `index.html` a 10 994 righe — commit `cf1fee4` più la
> rimozione decisa in D4 (§ 6). Ogni numero di riga qui dentro si riferisce a quella
> versione: se il file cambia, i numeri scorrono e vanno riverificati.

---

## 0. Come è fatta l'app, in breve

Tutto è in `index.html`: un blocco `window.APP_CONFIG` in cima (primo `<script>`),
poi il CSS, poi tutto il resto del JavaScript in un secondo `<script>` chiuso in
una IIFE. Non c'è build, non ci sono moduli, non c'è nessuna dipendenza esterna
oltre ai Google Fonts.

Il contenuto sta in tre file dentro `data/`, letti via `fetch` con ricaduta sulle
copie `window.FALLBACK_*` incorporate in `index.html`:

| File | Chi lo legge | Copia di sicurezza |
|---|---|---|
| `data/a1-episodio1-inglese.json` | `loadEpisodeData()` (riga 7107) | `window.FALLBACK_EPISODE_DATA` |
| `data/istruzioni-moduli.json` | `loadModuleInstructions()` (riga 5960) | `window.FALLBACK_MODULE_INSTRUCTIONS` |
| `data/messaggi-feedback.json` | `loadFeedbackMessages()` (riga 8141) | `window.FALLBACK_FEEDBACK_MESSAGES` |

Lo stato per utente vive tutto in `localStorage`, con sei chiavi distinte per
episodio+utente (elencate al § 2.3).

---

## 1. I moduli, uno per uno

### 1.0 Come si legge la tabella

- **Grado** — arriva dalla coppia `{ module, grade }` di `CONFIG.moduleOrderDefault`
  (riga 409), **non** dal descrittore in `EPISODES.episode1.modulesById` (riga 6164).
- **Id del passo** — `moduleStepId()` (riga 6289): la prima apparizione di un modulo
  tiene l'id nudo, le successive prendono `-2`, `-3`. È l'id con cui si salvano
  progressi ed esiti.
- **Regola di esito** — `CONFIG.moduleOutcomeRules[id]` (riga 488), **letta con l'id
  del passo**. Un id assente ricade su `completionRules`.
- **Voci mostrate** — `episodeGrade(data, module.grade)` (riga 7133), sempre l'intero
  grado. **Nessun modulo campiona, filtra o limita.** I numeri qui sotto sono quelli
  dell'episodio 1: A=16, B=7, C=10, D=9.

### 1.1 La sequenza reale — 22 passi

| # | Id del passo | Nome mostrato | Categoria | Grado | Voci | Regola di esito *(effettiva)* | Tentativo | Ripasso |
|---|---|---|---|---|---|---|---|---|
| 1 | `personalizzazione` | Your Story | Inizio | — | 8 slot | `completionRules` | — | no |
| 2 | `meetTheStory` | Meet the Story | Studio | D | 9 | `completionRules` | — | no |
| 3 | `repeatAloud` | Repeat Aloud | Studio | A | 16 | `completionRules` | — | no |
| 4 | `quickMatchEngIta` | Match Practice en→it | Studio | A | 16 | `moduleRules` | primo (fisso) | sì |
| 5 | `quickMatchItaEng` | Match Practice it→en | Studio | A | 16 | `moduleRules` | primo (fisso) | sì |
| 6 | `flashcardAEngIta` | Flash Card en→it | Studio | A | 16 | `selfScoreRules` | primo (fisso) | sì |
| 7 | `flashcardAItaEng` | Flash Card it→en | Studio | A | 16 | `selfScoreRules` | primo (fisso) | sì |
| 8 | `repeatAloud-2` | Repeat Aloud | Studio | B | 7 | `completionRules` | — | no |
| 9 | `quickMatchEngIta-2` | Match Practice en→it | Studio | B | 7 | ⚠️ `completionRules` | primo (fisso) | sì |
| 10 | `quickMatchItaEng-2` | Match Practice it→en | Studio | B | 7 | ⚠️ `completionRules` | primo (fisso) | sì |
| 11 | `flashcardAEngIta-2` | Flash Card en→it | Studio | B | 7 | ⚠️ `completionRules` | primo (fisso) | sì |
| 12 | `voicePractice` | Voice Practice | Studio | B | 7 | `moduleRules` | `lastAttempt` | no |
| 13 | `whyWeSayIt` | Why We Say It | Studio | D | 9 righe / 8 skill | `selfScoreRules` | — | no |
| 14 | `quickMatchEngIta-3` | Match Practice en→it | Studio | C | 10 | ⚠️ `completionRules` | primo (fisso) | sì |
| 15 | `quickMatchItaEng-3` | Match Practice it→en | Studio | C | 10 | ⚠️ `completionRules` | primo (fisso) | sì |
| 16 | `voicePractice-2` | Voice Practice | Studio | C | 10 | ⚠️ `completionRules` | ⚠️ primo | no |
| 17 | `dialogoAscoltaRipeti` | Dialogue: Listen & Repeat | Studia il dialogo | D | 9 | `selfAssessment` | — | no |
| 18 | `dialogoRipetiATempo` | Dialogue: Repeat in Time | Studia il dialogo | D | 9 | `selfAssessment` | — | no |
| 19 | `dialogoContinuo` | Dialogue: Real Dialogue | Studia il dialogo | D | 9 | `selfAssessment` | — | no |
| 20 | `speedRoundEngIta` | Speed Match en→it | Quiz | C | 10 | `moduleRules` | primo (fisso) | sì |
| 21 | `speedRoundItaEng` | Speed Match it→en | Quiz | C | 10 | `moduleRules` | primo (fisso) | sì |
| 22 | `voiceCoach` | Voice Check | Quiz | C | 10 | `moduleRules` | `firstAttempt` | sì |

Le ⚠️ sono **sei passi su ventidue che perdono la propria regola di esito** perché
`moduleOutcomeRules` è indicizzato per id del passo e le apparizioni successive
hanno un id diverso. Dettaglio e prova al § 4.1 — è il ritrovamento più grosso di
questa lettura.

*"Tentativo primo (fisso)"* significa che il modulo non ha un tentativo ripetibile
nello stesso passaggio: il conteggio del punteggio è cablato in un contatore suo
(`qmFirstTryCorrectCount`, `srFirstTryCorrectCount`, `fcFirstTryCorrectCount`) e
`CONFIG.attemptRule` non c'entra. Solo Voice Practice e Voice Check leggono
davvero `attemptRule`.

### 1.2 Scheda per modulo

#### Your Story — `personalizzazione`
- **Componente:** `openCustomize()` (6928). Vista `view-customize`.
- **Dati:** `personalizationTablesUsed` del file episodio, risolto da
  `buildSlotFields()`/`resolveSlotTable()` (6508, 6493) contro `CONFIG.people`,
  `CONFIG.places` e `episode.ageOptions`. Otto slot: papa, mamma, cognome,
  figliaNome, figliaEta, figlioNome, figlioEta, partenza.
- **Completamento:** pulsante `#start-episode` (7081) → `markModuleCompleted` +
  `openEpisodeMap`. **Nessuna Schermata Finale** — coerente con la regola 17
  (categoria Inizio).
- **Proprie:** `renderSlotGrid`, `onSlotChange`, `renderRequestBox`,
  `submitCustomizationRequest`, `renderCustomizeWarningScreen`,
  `customizeShowScreen`, `customizeShowMainOrWarning`, `wipeEpisodeProgress`,
  `hasStartedEpisodeModules`, `migrateCustomizeSeenToModuleProgress`.
- **Condivise:** `ensureEpisodeSlotFields`, `loadCustomValues`/`saveCustomValues`,
  `fillTemplate`, `renderIntroContent`, `openHelpFor`, `showView`.

#### Meet the Story / Why We Say It — `meetTheStory`, `whyWeSayIt`
- **Componente unico:** `openSpeakEasy()` (7720) + `renderSpeakEasy()` (7510).
  Vista `view-speak-easy`. Il nome "Speak Easy" **non descrive più nessuno dei
  due moduli** (§ 2.4).
- **Profilo:** `CONFIG.story.profiles[module.storyProfile]` (riga 293) — l'unica
  differenza è `skills: false` (meet) / `skills: true` (why).
- **Contenuto:** grado D (le battute). Why We Say It aggiunge, sotto ogni battuta,
  le sue `whatYouLearn` — **8 skill su 9 battute** nell'episodio 1 (`d-1` ne porta
  due, alcune battute nessuna). Una skill senza `body` è scartata (7527).
- **Sblocco Sequenziale, variante per dichiarazione** — `seRefreshExplanationStates()`
  (7602): una skill più avanti mostra solo il titolo, il corpo e i pulsanti spariscono.
  Solo al primo giro: `seReviewMode` (7733) spegne la sequenza a modulo già completato.
- **Autovalutazione:** tre risposte da `istruzioni-moduli.json → whyWeSayIt.selfCheck`.
  Registrate in `seSessionAnswers` (memoria) + `addSeExplanationStat` (cumulativo,
  fra sessioni). Salvate su disco **solo** con "Esci e riprendi dopo" (7858) o al
  completamento (7838) — uscire da "← Mappa" non lascia traccia.
- **Punteggio:** `% di "chiara" su tutte le skill`, congelato a "Ho finito" (7846).
- **Completamento:** `#speak-easy-complete` → Schermata Finale → `#speak-easy-complete-btn`.
  Il blocco "non hai dichiarato tutto" vive nella funzione, non solo sul pulsante (7828).

#### Repeat Aloud — `repeatAloud`
- **Componente:** `openRepeatAloud()` (7302) + `renderRepeatAloud()` (7157).
- **Contenuto:** tutto il grado, più `data.generalRule` in cima. Ogni voce mostra
  inglese, italiano, `pronunciationTip` e un Blocco Ascolto (100/75/50%).
- **Niente valutazione, niente ripasso.** Completamento manuale a due passi:
  `#repeat-aloud-complete` (Traguardo + Schermata Finale) → `#repeat-aloud-complete-btn`.

#### Match Practice en→it / it→en — `quickMatchEngIta`, `quickMatchItaEng`
- **Componente:** `openQuickMatch()` (8916). Direzione da
  `QM_DIRECTION_BY_KIND[module.kind]` (8713).
- **Domande:** una per ogni voce del grado, in ordine casuale (`srShuffle`).
  Quattro opzioni: la giusta più **tre distrattori pescati a caso** dallo stesso
  grado — `srShuffle(pool).slice(0, 3)` (8648). Il numero 3 è scritto nel codice.
- **Ripasso:** coda `qmRetryQueue`; una risposta sbagliata o "Non lo so" rimette la
  voce in coda, finché un giro non esce pulito o la voce raggiunge
  `CONFIG.retryQueue.maxAttempts` (3), a quel punto è forzata a rosso.
- **Punteggio:** `qmFirstTryCorrectCount / qmVocab.length` (8897) — solo primi
  tentativi, congelato prima del ripasso.
- **Mastery:** prefisso `quickmatch:<idVoce>:<direzione>`.
- **Audio:** en→it un Blocco Ascolto sotto la domanda; it→en un mini-pulsante per
  ciascuna delle quattro opzioni inglesi.

#### Flash Card en→it / it→en — `flashcardAEngIta`, `flashcardAItaEng`
- **Componente:** `openFlashcard()` (10472). `kind` **`flashcardLevelA` per
  entrambe le direzioni e per entrambi i gradi** su cui compare (A e B) — il nome
  del `kind` è rimasto legato al livello A (§ 2.4).
- **Flusso:** una carta per voce, girata a mano, poi "Sì, la so" / "Non ancora",
  che avanzano da soli. Nessun Indietro/Avanti: una carta si risponde una volta sola.
- **"Sì, la so" scrive nella mastery esattamente come una risposta verificata** —
  `fcRecordResult('correct')` → `applyMasteryResult` (10280). Vedi § 3(d).
- **Ripasso:** finché un giro non esce senza "Non ancora"; una carta ostinata è
  forzata a rosso dopo `maxAttempts` e chiusa fuori dal calcolo (10292-10296).
- **Punteggio:** `fcFirstTryCorrectCount / fcVocab.length` (10391).
- **Mastery:** prefisso `flashcard-<grado>:<idVoce>:<direzione>` — quindi il grado
  A e il grado B non si mescolano.

#### Voice Practice / Voice Check — `voicePractice`, `voiceCoach`
- **Componente unico:** `openVoiceCoach()` (8334). `vcVariant` (`practice`/`check`)
  da `module.voiceVariant` è l'unica cosa che ramifica.
- **Voice Practice:** pulsante "Esercitati ancora" fino a
  `CONFIG.voicePractice.maxAttemptsPerPhrase` (3), contatore sempre a schermo,
  **nessun giro di ripasso**. Alimenta la mastery con prefisso
  `voicepractice:<idBattuta>:<indiceParola>` (8451).
- **Voice Check:** una registrazione per frase, **nessun pulsante di ritentativo**,
  ma giro di ripasso su tutto ciò che è uscito a 0-1 stelle (8464-8471).
- **Stelle:** `starsForPercent()` (8159) su `CONFIG.voiceCoach.starThresholds`
  (1/50/80). Soglia di superamento: `stars > 1`.
- **Riconoscimento:** istanza `SpeechRecognition` propria, `continuous: true`,
  `interimResults: true`. Il testo riconosciuto resta in attesa finché non si preme
  "Invia": non c'è modo di scartarlo a metà, solo fermare e poi confermare o annullare.
- **Guasti al microfono:** `vcEmptyRecognitionStreak` con tre scalini da
  `CONFIG.voiceCoach.micIssue` (2 / 4 / 6). Al terzo, "Avanti" resta bloccato
  (`vcMicConfirmedProblem`) — il modulo non si può completare.
- **Consumo audio:** `addAudioSecondsSent()` (8565) somma i secondi realmente
  inviati, letti dal Pannello Admin.

#### I tre Dialogue — `dialogoAscoltaRipeti`, `dialogoRipetiATempo`, `dialogoContinuo`
- **Componente unico:** `openDialogo()` (9588). Profilo da
  `CONFIG.dialogo.profiles[module.dialogoProfile]` (riga 306).
- **Le differenze stanno tutte nel profilo:** `translations`, `countdown`,
  `readyCountdown`, `advance` (`free`/`manual`/`auto`), `pauseResume`,
  `nextLineButton`, `finalBoxQuestion`.
- **Durata della barra:** `dgLineDurationMs()` (9259) =
  `pausaBase + parole * pausaPerParola`, tagliata a `pausaMassima` (2000 / 900 / 12000 ms).
- **Sblocco Sequenziale, variante per ascolto** — `dgApplySequenceLock()` (9244),
  solo in Ripeti a Tempo: si arriva al massimo una battuta oltre la più lontana
  ascoltata.
- **Eccezione al Blocco Ascolto:** `dgAudioProtected()` (9364) fa tirare indietro
  il listener globale nei due profili con countdown, così un tocco a vuoto non
  sfasa il conto alla rovescia.
- **Esito:** `dgFinishModule(level)` (9490) — `verde` da "Sì, lo so", `giallo` da
  "Non ancora". **Chiama `saveModuleOutcome` senza consultare
  `CONFIG.moduleOutcomeRules`** (§ 4.3). La scatola delle due risposte si sblocca
  solo quando ogni battuta è stata sentita (`dgUpdateChoiceBoxLock`, 9188).

#### Speed Match en→it / it→en — `speedRoundEngIta`, `speedRoundItaEng`
- **Componente:** `openSpeedRound()` (10105). Stessa logica a quattro opzioni di
  Match Practice (funzioni condivise), più il tempo.
- **Tempo:** `CONFIG.speedRound.timeLimitSeconds` (10 s) per domanda; lo scadere
  vale come risposta sbagliata (`srHandleTimeout`, 10052). Prima del quiz, un 3-2-1
  (`srRunCountdown`, 10091).
- **Mastery:** prefisso `speedround:` — **coda di ripasso e mastery separate da
  quelle di Match Practice**, anche sulle stesse voci.
- **Punteggio:** identico a Match Practice (primo tentativo).

---

## 2. Le funzioni condivise

### 2.1 Le funzioni davvero condivise, e chi le chiama

| Funzione | Riga | Cosa fa | Chi la chiama |
|---|---|---|---|
| `showView(name)` | 5469 | Cambia vista, alza `moduleEpoch`, chiama `stopAllModuleActivity()` | ogni `open*`, `goHome`, `boot` |
| `stopAllModuleActivity()` | 5458 | Punto unico di pulizia: sintesi, timer Dialogo, registrazione, timer Speed Match, slide Flash Card, popup | solo `showView` |
| `loadEpisodeData(module)` | 7107 | `fetch` + cache + ricaduta sul fallback | tutti i moduli con `dataFile` |
| `episodeGrade(data, grade)` | 7133 | **L'unico** accesso al contenuto di un grado | tutti i moduli con contenuto |
| `itemText(item, lang)` | 7145 | Testo di una voce con segnaposto già riempiti | Repeat Aloud, Match Practice, Speed Match, Flash Card, `buildMultipleChoiceOptions` |
| `fillTemplate(text, ep, values, lang)` | 6600 | Sostituisce `{{chiave}}` e `{{chiave:en}}` | `itemText`, Speak Easy, Dialogo, Voice Coach |
| `moduleStepId(moduleId, seenBefore)` | 6289 | Id del passo (`-2`, `-3` dalle apparizioni successive) | il blocco che calcola `episode.modules` |
| `moduleTypeLabel(module)` | 7235 | "Studio · Parole"; omette il grado quando la categoria lo contiene | mappa + intestazione di ogni modulo |
| `moduleNameHtml(name)` | 7224 | Stacca il suffisso `en→it` in uno `<span>` | mappa + intestazioni |
| `percentageBucket(pct)` | 5309 | `alto`/`medio`/`basso` da `CONFIG.percentageThresholds` | Speed Match, Match Practice, Flash Card, Voice Coach, Why We Say It |
| `moduleRulesLevel(pct)` | 5326 | `verde`/`giallo`/`rosso`, riusa `percentageBucket` | i cinque `*-complete-btn` valutati |
| `applyMasteryResult(entry, result)` | 6105 | Scala del colore per voce (`promotionStreak`) | `recordMultipleChoiceResult`, `fcRecordResult`, Voice Practice |
| `loadMastery`/`saveMastery` | 6093/6100 | Store colori per voce | come sopra + la vista legacy |
| `buildMultipleChoiceOptions(item, dir, pool)` | 8645 | 4 opzioni: 1 giusta + 3 distrattori casuali | Match Practice, Speed Match |
| `recordMultipleChoiceResult(params)` | 8668 | Mastery + coda di ripasso + contatore tentativi | Match Practice, Speed Match |
| `srShuffle(list)` | 9753 | Fisher-Yates | **tutti**: qm, sr, fc, vc, `buildMultipleChoiceOptions` |
| `renderSummaryScreen(...)` | 5226 | Schermata Finale + pulsante unico + suono Uscita | 7 moduli, una volta al boot |
| `renderRetryIntroScreen(...)` | 5246 | Schermata Ripasso (guscio) | Speed Match, Match Practice, Flash Card, Voice Coach |
| `applyRetryIntroContent(id, isLast)` | 5263 | Riempie titolo/testo da `retryIntroMessages` | gli stessi quattro |
| `applyOutcomeSubtitle(el, key, bucket)` | 5295 | Sottotitolo della Schermata Finale, per esito | tutti i moduli con Schermata Finale |
| `renderChoiceBox(...)` | 5208 | Coppia di pulsanti secondario+primario | Voice Coach (conferma invio), Flash Card, Dialogo |
| `openAttemptPopup(...)` | 8188 | Valvola di sicurezza dopo N tentativi | Voice Check, Match Practice, Speed Match, Flash Card |
| `renderIntroContent(kind, ...)` | 7268 | Schermata "Spiegazione" da `istruzioni-moduli.json` | tutti |
| `openHowItWorksOverlay(module, opts)` | 5557 | Stessa spiegazione, in popup | tutti |
| `openHelpFor(module)` | 6028 | Menu Help a tre voci | tutti |
| `isIntroDismissed`/`setIntroDismissed` | 7199/7208 | Flag "non mostrare più", **per `kind`**, non per episodio | tutti |
| `toggleSpeak(text, btn, rate, cb)` | 10827 | Sintesi vocale con toggle e `moduleEpoch` | tutti |
| `startTimerBar`/`freezeTimerBar` | 9869/9877 | Barra del tempo | Speed Match **e** Dialogo |
| `tokenize(text)` | 10604 | Conteggio/estrazione parole | Voice Coach **e** `dgLineDurationMs` |
| `icon(name)`/`hydrateIcons(root)` | 5177/5183 | Icone SVG inline | ovunque |
| `sfxPlay*Sound()` | 9806-9853 | Catalogo suoni per **evento**, da `CONFIG.sound.events` | ovunque |

### 2.2 Le funzioni che sembrano condivise e non lo sono

- `moduleRulesLevel` è chiamata **solo** dai cinque pulsanti di completamento
  valutati. I tre Dialogue non la usano: scrivono `verde`/`giallo` direttamente.
- `renderChoiceBox` è chiamata due volte al boot (5330-5331) e una volta per
  apertura in Dialogo (`dgStartExercise`) — non è un componente vivo, è un
  generatore di markup una tantum.

### 2.3 Le chiavi di `localStorage`

| Chiave | Funzione | Contenuto |
|---|---|---|
| `baseinglese:userName` | `getUserName` (5403) | il nome, globale |
| `baseinglese:theme` | `getTheme` (5364) | il tema scelto |
| `baseinglese:configOverrides` | `applyConfigOverrides` (756) | override del Pannello Admin, **per sezione di primo livello intera** |
| `baseinglese:modules:<ep>:<utente>` | `moduleProgressKey` (6325) | `{ completed: [idPasso] }` |
| `baseinglese:moduleOutcome:<ep>:<utente>` | `moduleOutcomeKey` (6361) | `idPasso -> { level, ... }` |
| `baseinglese:mastery:<ep>:<utente>` | `masteryStorageKey` (6089) | `unitId -> { level, streak }` |
| `baseinglese:<ep>:custom:<utente>` | `customValuesKey` (6612) | valori di personalizzazione |
| `baseinglese:seDeclarations:<ep>:<utente>` | `seDeclarationsKey` (7436) | dichiarazioni di Why We Say It |
| `baseinglese:seExplanationStats:<ep>:<utente>` | `seExplanationStatsKey` (6464) | conteggio cumulativo per skill |
| `baseinglese:audioUsage:<ep>:<utente>` | `audioUsageKey` (6415) | secondi di audio inviati per modulo |
| `baseinglese:nextLineSkips:<ep>:<utente>` | `nextLineSkipsKey` (6439) | quante volte si è saltata una battuta |
| `baseinglese:helpRequests:<utente>` | `helpRequestsKey` (5521) | richieste di aiuto |
| `baseinglese:introDismissed:<kind>:<utente>` | `introDismissedKey` (7187) | "non mostrare più" per tipo di modulo |
| `baseinglese:repeatAloudIntroDismissed:<utente>` | `legacyRaIntroDismissedKey` (7195) | **sola lettura**, residuo di una migrazione |
| `baseinglese:customizeSeen:<ep>:<utente>` | `customizeSeenKey` (6834) | **sola lettura**, residuo di una migrazione |

### 2.4 Nomi che contengono un modulo che non esiste più

Richiesto esplicitamente dal punto 2.2 del lavoro. Nessuno di questi è stato
toccato.

| Prefisso / nome | Modulo che nomina | Cosa è oggi | Dove compare |
|---|---|---|---|
| `se*`, `speakEasy`, `speak-easy-*` | **Speak Easy** | Il modulo non esiste più: il componente serve **Meet the Story** e **Why We Say It** | ~28 identificativi JS (`openSpeakEasy`, `renderSpeakEasy`, `seSkillIds`, `seRefreshExplanationStates`, `seIsUnlocked`, `seDeclarationsKey`, `seExplanationStatsKey`, `addSeExplanationStat`, …), la vista `view-speak-easy`, ~20 id HTML, **e la chiave dati `speakEasyCompleteMessages` in `messaggi-feedback.json`** |
| `quickMatch*`, `qm*` | **Quick Match** | Si chiama **Match Practice** | `CONFIG.quickMatch`, gli id dei moduli `quickMatchEngIta`/`quickMatchItaEng`, i `kind` omonimi, ~25 funzioni/variabili `qm*`, la vista `view-quick-match`, gli id HTML `qm-*`, `quick-match-*` |
| `speedRound*`, `sr*` | **Speed Round** | Si chiama **Speed Match** | `CONFIG.speedRound`, gli id dei moduli, i `kind`, ~30 funzioni/variabili `sr*`, la vista `view-speed-round`, gli id HTML `sr-*` |
| `voiceCoach` | **Voice Coach** | Il modulo si chiama **Voice Check**; ma `voiceCoach` nomina **anche** il componente condiviso con Voice Practice e la sezione `CONFIG.voiceCoach`, che contiene valori letti da entrambi (`starThresholds`, `micIssue`) | id del modulo, `kind`, `CONFIG.voiceCoach`, ~40 `vc*`, vista `view-voice-coach` |
| `flashcardLevelA` | il livello A | È il `kind` usato per **tutte** le Flash Card, anche quelle sul grado B (passo 11) | `EPISODES.episode1.modulesById`, chiave di `istruzioni-moduli.json` |

**Il caso più delicato è `srShuffle`.** Non è una funzione di Speed Match: la
chiamano Match Practice, Flash Card, Voice Coach e `buildMultipleChoiceOptions`.
Sta nel blocco di Speed Match e porta il suo prefisso — esattamente la situazione
che la regola 18 di `CLAUDE.md` descrive ("un elemento che sembra ancora di un
modulo mentre è usato da tutti è un invito a spostarlo per sbaglio"). Vale in
misura minore per `startTimerBar`/`freezeTimerBar` (nome già neutro, ma posizione
dentro Speed Match) e per le classi CSS `.sr-option`, `.sr-summary`,
`.sr-timerbar-*`, usate da moduli che non sono Speed Match.

---

## 3. Le sei domande

### (a) Esiste una logica che compone gli esercizi in proporzione 40% nuove / 30% rosse / 20% gialle / 10% verdi?

**No.** Non esiste da nessuna parte, in nessuna forma, nemmeno parziale.

**Prova.** Ogni modulo prende **tutte** le voci del proprio grado e le mescola:

```js
// riga 8903 — Match Practice
qmQueue = srShuffle(qmVocab.map(function (v) { return v.id; }));
// riga 10077 — Speed Match
srQueue = srShuffle(srVocab.map(function (v) { return v.id; }));
// riga 10461 — Flash Card
fcPassItems = srShuffle(fcVocab.map(function (v) { return v.id; }));
// riga 8376 — Voice Coach
vcQueue = vcLines.map(function (l) { return l.id; });
```

`srShuffle` (9753) è un Fisher-Yates puro: nessun peso, nessun colore letto.
`qmVocab`/`srVocab`/`fcVocab`/`vcLines` sono sempre `episodeGrade(data, module.grade)`
per intero. L'unico altro punto in cui si pescano voci è la scelta dei distrattori:

```js
// riga 8648 — buildMultipleChoiceOptions
var distractors = srShuffle(pool).slice(0, 3).map(...)
```

anche lì, casuale e senza colore. **Il colore per voce (`mastery`) viene scritto ma
non viene mai riletto per decidere cosa mostrare.** L'unico lettore di
`loadMastery` a scopo di visualizzazione è `renderPhrase()` (10612), che appartiene
alla vista legacy irraggiungibile (§ 4.5).

### (b) Il colore di una parola è tracciato per tipo di esercizio o è uno solo per parola?

**Per tipo di esercizio — e anche per direzione.** Non esiste un colore unico per
parola.

**Prova.** Tutte le scritture nello store passano da un `unitId` costruito con un
prefisso di modulo:

```js
// riga 8669 — Match Practice e Speed Match
var unitId = params.unitPrefix + ':' + params.item.id + ':' + params.direction;
//   unitPrefix vale 'quickmatch' (8786) o 'speedround' (9959)
// riga 10277 — Flash Card
var unitId = 'flashcard-' + fcGrade + ':' + fcCurrentItem.id + ':' + fcDirection;
// riga 8451 — Voice Practice
var unitId = 'voicepractice:' + line.id + ':' + pair.targetIndex;
```

La stessa parola dell'episodio 1 può quindi avere fino a **sette** voci distinte:
`quickmatch:<id>:en-it`, `quickmatch:<id>:it-en`, `speedround:<id>:en-it`,
`speedround:<id>:it-en`, `flashcard-A:<id>:en-it`, `flashcard-A:<id>:it-en`,
`flashcard-B:<id>:…`. Voice Practice non usa nemmeno l'id della voce: indicizza per
**posizione della parola dentro la battuta** (`voicepractice:<idBattuta>:<indice>`),
quindi non è confrontabile con le altre. Esiste infine un ottavo spazio di nomi,
`fixed:<n>` / `slot:<chiave>` (`buildTargetTokens`, 6657), che appartiene alla
vista legacy.

### (c) Se (a) esistesse, leggerebbe i colori per tipo di esercizio o quelli globali?

**Non applicabile:** (a) non esiste. Vale però la pena registrare che **se venisse
costruita domani, non troverebbe un colore globale da leggere**: nello store non
c'è nessuna voce senza prefisso di modulo (§ b). Una composizione per colore
richiede prima una decisione su quale dei sette-otto valori conta.

### (d) Un'autovalutazione (il "Sì, la so" di Flash Card) alza il colore come una risposta verificata?

**Sì, esattamente come una risposta verificata.**

**Prova.** `fcRecordResult` (10275) chiama la stessa `applyMasteryResult` che usano
i quiz veri:

```js
// riga 10280
mastery[unitId] = applyMasteryResult(mastery[unitId], result);
```

`result` è `'correct'` per "Sì, la so" (10540) e `'wrong'` per "Non ancora" (10530).
Non c'è nessun peso, nessuna sorgente, nessuna distinzione: due "Sì, la so" di fila
promuovono di un livello esattamente come due risposte giuste in Speed Match
(`CONFIG.mastery.promotionStreak = 2`).

**La distinzione esiste, ma solo un livello sopra**, sul colore del *modulo*, non su
quello della parola: `CONFIG.moduleOutcomeRules` separa `selfScoreRules` (Flash Card,
Why We Say It) da `moduleRules`, con il commento esplicito che è "un segnale meno
affidabile". Quella cautela **non arriva fino alla mastery**.

### (e) Esiste un tetto configurabile su quante voci un quiz pesca dagli episodi precedenti?

**No** — e non esiste nemmeno il meccanismo che quel tetto limiterebbe.

**Prova.** `EPISODES` (6136) contiene un solo episodio. Ogni modulo legge
`loadEpisodeData(module)` con `module.dataFile`, che è sempre il file dell'episodio
corrente, e poi `episodeGrade(data, module.grade)`. Non c'è nessun punto del codice
che unisca il contenuto di due file episodio, e nessuna delle 26 chiavi di primo
livello di `APP_CONFIG` riguarda episodi precedenti. Neanche la mastery, che è
l'unico store cumulativo, è mai riletta per costruire un esercizio (§ a).

### (f) Quali valori sono scritti nel codice invece che in `APP_CONFIG`?

Elenco completo di ciò che è emerso, dal più al meno sostanziale.

**Numeri che cambiano il comportamento**

| Valore | Riga | Cosa decide |
|---|---|---|
| `slice(0, 3)` | 8648 | **Tre distrattori** → quattro opzioni per domanda, in Match Practice e Speed Match |
| `FC_SLIDE_MS = 260` | 10218 | Durata dello scorrimento tra carte; deve restare allineata a mano alla transizione CSS di `.fc-card` |
| `stars > 1` | 8428, 8466 | Soglia di superamento in Voice Coach (feedback, suono, coda di ripasso) |
| `for (i = 1; i <= 3; i++)` | 8169 | Tre stelle, cablate in `renderStars` |
| `maxAttempts - 1` | 8293, 8842, 10001, 10401 | Quale giro di ripasso è "l'ultimo", quindi quale gruppo di messaggi mostrare |
| `.slice(-6)` | 5627 | Lunghezza della parola magica `config` |

**Tabelle di etichette scritte nel codice** (la regola 8 di `CLAUDE.md` chiede che i
testi che lo studente legge stiano in `data/istruzioni-moduli.json`)

| Costante | Riga | Contenuto |
|---|---|---|
| `DIRECTION_LABEL` | 8643 | `INGLESE → ITALIANO`, `ITALIANO → INGLESE` |
| `STATUS_LABEL` | 6975 | `Completato`, `Attuale`, `Bloccato` |
| `STATUS_ICON` | 6976 | icone di stato |
| `OUTCOME_BADGE_LABEL` | 6983 | `Da rivedere`, `Da riprovare` |
| `MODULE_RULES_LEVEL` | 5325 | `alto→verde`, `medio→giallo`, `basso→rosso` |
| `STAR_MESSAGE_KEYS` | 8139 | `1→basso`, `2→medio`, `3→alto` |
| `LEVEL_CLASS` | 6077 | `rosso→wrong`, `giallo→similar`, `verde→correct` |
| `LEVELS` | 6076 | l'ordine della scala dei colori |
| `MAP_PSEUDO_MODULE` | 6822 | il nome `Mappa dell'episodio` |
| `QM_/SR_DIRECTION_BY_KIND` | 8713, 9727 | mappa `kind → direzione` |

**Frasi intere scritte nel codice**

- `'Ho finito, torna alla mappa'` (5232) — l'unica etichetta di completamento
  dell'app, in un punto solo, ma nel codice.
- I sei titoli delle Schermate Finali: `Esercizio completato!` ×2, `Round completato!` ×2,
  `Tutte le carte ripassate!`, `Dialogo ripassato!`, `Modulo completato!` (5333-5341, 5348).
- `'L\'hai imparata?'`, `'Non ancora'`, `'Sì, la so!'` (5331) — Flash Card.
- `'Sicuro? Invia per la valutazione, o cancella e riprova.'`, `'Cancella'`, `'Invia'` (5330).
- Il menu Help completo: le tre voci (5997-5999), i due testi del modulo di
  richiesta (6010-6012), la conferma (6024).
- `'Non ti abbiamo sentito: prova a parlare entro N secondi…'` (8004).
- `'TENTATIVO N DI M'` (8218, 8422).
- `'Risposta corretta: '` (8883 e 10038), `'Hai detto:'` (8410).
- `'Mostra pronuncia'` (8259), `'Esercitati ancora'`/`'Riprova'` (8364),
  `'Pausa'`/`'Riprendi'` (9515), `'Mostra traduzioni'`/`'Nascondi traduzioni'` (9632),
  `'Pronto?'`/`'Pronto? Via!'`/`'Ho capito, inizia'` (9106-9110, e i gemelli in
  `srRenderStartScreen`/`qmRenderStartScreen`).
- `'Caricamento...'` e `'Non è stato possibile caricare i contenuti di questo modulo.'`,
  ripetuti in ognuno degli otto `open*`.
- `'Ripeti ad alta voce'`, didascalia della barra del tempo (9229).
- `'Ce l\'hai fatta!'` / `'Tranquillo, capita!'` (8193-8194) — fallback del popup, che
  però ha già la sua versione in `messaggi-feedback.json`.
- Le tre domande finali dei Dialogue **sono** in `APP_CONFIG`
  (`dialogo.profiles.*.finalBoxQuestion`), non nel codice: è l'eccezione, non la regola.

---

## 4. Segnalazioni — trovato, non corretto

### 4.1 ⚠️ Sei passi su ventidue perdono la propria regola di esito

**Il fatto.** `CONFIG.moduleOutcomeRules` e `CONFIG.attemptRule` sono indicizzati per
**id del modulo**; i pulsanti di completamento li interrogano con **l'id del passo**:

```js
// riga 9009 — Match Practice
if (CONFIG.moduleOutcomeRules[qmModule.id] === 'moduleRules') { ... }
// riga 10552 — Flash Card
if (CONFIG.moduleOutcomeRules[fcModule.id] === 'selfScoreRules') { ... }
// riga 8598 — Voice Coach
if (CONFIG.moduleOutcomeRules[vcModule.id] === 'moduleRules') { ... }
// righe 8314 e 8436 — quale tentativo conta
CONFIG.attemptRule[vcModule.id] === 'lastAttempt'
```

Dalla seconda apparizione in poi, `moduleStepId()` (6289) produce `quickMatchEngIta-2`,
`flashcardAEngIta-2`, `voicePractice-2` … e in `moduleOutcomeRules` quelle chiavi non
ci sono. La condizione è falsa, `saveModuleOutcome` **non viene chiamato**, il modulo
resta sul badge "Completato" grigio.

**Chi ne è colpito** (verificato risolvendo l'ordine reale):

| Passo | Id | Regola dichiarata per il modulo | Regola applicata |
|---|---|---|---|
| 9 | `quickMatchEngIta-2` | `moduleRules` | `completionRules` |
| 10 | `quickMatchItaEng-2` | `moduleRules` | `completionRules` |
| 11 | `flashcardAEngIta-2` | `selfScoreRules` | `completionRules` |
| 14 | `quickMatchEngIta-3` | `moduleRules` | `completionRules` |
| 15 | `quickMatchItaEng-3` | `moduleRules` | `completionRules` |
| 16 | `voicePractice-2` | `moduleRules` + `lastAttempt` | `completionRules` + **primo tentativo** |

Il passo 16 è colpito due volte: oltre a non colorare la mappa, `attemptRule` cade su
`undefined`, quindi `vcFinishModule` (8314) usa `vcFirstAttemptPercents` invece di
`vcLastAttemptPercentByLine`. Il punteggio mostrato allo studente al passo 16 è
calcolato con una regola diversa da quella del passo 12, a parità di modulo.

**Perché è passato inosservato.** L'ordine a coppie (con lo stesso modulo su più gradi)
è recente; `moduleOutcomeRules` è più vecchio e non è mai stato riletto dopo.
`episodeFinalOutcomeCase` (6393) legge `outcomes[m.id]` con l'id del passo — coerente
con come si scrive, quindi non emerge da lì.

**Verificato eseguendo, non leggendo** — `tests/test_outcome_step_ids.js`. Il test
gioca l'episodio in un profilo pulito dal passo 1 al passo 9, con le stesse identiche
risposte nei due Match Practice en→it (sbagliate al primo giro, giuste al ripasso), e
legge i due badge dalla mappa:

```
passo 4  quickMatchEngIta     badge: "Da riprovare"   classi esito: [outcome-rosso]
passo 9  quickMatchEngIta-2   badge: "Completato"     classi esito: []

baseinglese:moduleOutcome:episode1:ProvaEsitoPassi
{"quickMatchEngIta":{"level":"rosso","pct":0},"quickMatchItaEng":{"level":"rosso","pct":0},
 "flashcardAEngIta":{"level":"verde","pct":100},"flashcardAItaEng":{"level":"verde","pct":100}}
```

Il passo 9 non compare fra gli esiti salvati: `saveModuleOutcome` non è stato chiamato.

**Perché non si vede usando l'app.** Il test risponde male apposta, e serve. Con
risposte buone il punteggio è alto, `moduleRulesLevel` restituisce `verde` — e
**una riga `.module-row.outcome-verde` nel CSS non esiste**: `OUTCOME_BADGE_LABEL`
(6983) ha solo `giallo` e `rosso`, quindi un modulo verde ricade su
`STATUS_LABEL.completed` e mostra "Completato", con lo stesso identico verde di
`.module-row.completed` (2901, 2970). **Un esito verde e nessun esito sono
indistinguibili a schermo.** Il difetto si vede solo quando lo studente va male:
allora il passo 4 diventa giallo o rosso e il passo 9 resta verde "Completato" — cioè
il caso in cui l'informazione sarebbe più utile è esattamente quello in cui manca.

**Non corretto.** Le strade sono almeno tre (indicizzare per `moduleId` invece che per
`id`; ricadere sul `moduleId` quando l'id del passo non c'è; dichiarare le regole nella
coppia dell'ordine), e la scelta cambia il significato di `moduleOutcomeRules`.
Va decisa, non indovinata.

### 4.2 `docs/struttura-corso.md` dice una cosa che il codice non fa

La tabella "Le regole di esito" assegna `moduleRules` a Match Practice e Voice
Practice e `selfScoreRules` a Flash Card — **senza distinguere le apparizioni**.
Letta insieme al § 4.1, la documentazione descrive l'intenzione; il codice ne
realizza solo una parte. Sull'ordine dei 22 passi, sulle sei categorie, sui nomi dei
gradi e sull'assegnazione dei moduli alle categorie, invece, **codice e documento
coincidono esattamente** (verificato voce per voce).

### 4.3 I Dialogue scrivono l'esito senza consultare la regola

`dgFinishModule` (9490) chiama `saveModuleOutcome` **incondizionatamente**:

```js
saveModuleOutcome(currentEpisode, getUserName(), dgModule.id, { level: level, ... });
```

Gli altri cinque moduli valutati proteggono la chiamata con un `if` su
`CONFIG.moduleOutcomeRules`. Qui non c'è. Oggi il risultato è corretto (i tre id
sono davvero `selfAssessment` in configurazione), ma togliere una riga da
`moduleOutcomeRules` non spegnerebbe niente — la manopola non muove nulla. È anche
il motivo per cui i tre Dialogue **non** sono colpiti dal § 4.1, pur avendo lo stesso
schema di chiamata.

### 4.4 Configurazione dichiarata e mai letta

| Voce | Stato |
|---|---|
| ~~`CONFIG.speedRound.pointsPerCorrect: 50`~~ | **Tolto** (decisione D4, § 6). Non era mai letta, e una descrizione in `configFieldDescriptions` la faceva comparire nel Pannello Admin come manopola che non muove niente. Il punteggio a punti non esiste più: `srFinishModule` (10063) dice esplicitamente che punteggio e percentuale sono stati tolti. |
| `CONFIG.places.destinations` | **Mai referenziata.** Nessun file episodio la nomina in `personalizationTablesUsed`; lo slot `destinazione` è stato tolto dall'episodio 1. Resta disponibile per un episodio futuro — ma oggi è configurazione senza lettore. |
| `messaggi-feedback.json → speedRoundMessages` | **Mai letta.** Unica occorrenza in `index.html`: la copia di sicurezza (riga 1517). Nessun `data.speedRoundMessages` da nessuna parte. |
| `module.typeLabel` | **Mai impostata.** `moduleTypeLabel` (7237) apre con `module.typeLabel || ...`: nessun oggetto modulo porta quel campo. Ramo morto, residuo di quando la categoria di Your Story era sovrascritta a mano. |

### 4.5 Codice irraggiungibile

- **La vista `view-pronunciation` per intero.** `startPronunciationExercise()`
  (10620) è l'unico ingresso, e **nessuno la chiama** (verificato: sole occorrenze,
  la definizione). Con lei restano irraggiungibili: `renderPhrase`,
  `currentPhraseText`, `submitAttempt`, `buildTargetTokens`, `EPISODES.episode1.segments`,
  la seconda istanza `SpeechRecognition` (10901 in poi), `#phrase`, `#mic-btn`,
  `#speak-btn`, `#status`, `#transcript`, `#warning`, `#pronunciation-hint`,
  `LEVEL_CLASS`, e la voce `pronunciation` di `views`. È l'esercizio originale
  dell'app, prima che esistessero i moduli.
  → `EPISODES.episode1.segments` (6255) descrive ancora la vecchia frase, con uno
  slot `destinazione` che non esiste più tra gli slot dell'episodio: `slotDefault`
  restituirebbe `undefined`. Non esplode solo perché non ci arriva nessuno.
- **`applyRotatingSubtitle()`** (5281): definita, mai chiamata. È stata sostituita
  ovunque da `applyOutcomeSubtitle` (5295); resta citata solo nei commenti (riga 3971).
- **`episodeFinalOutcomeCase()`** (6393): definita, mai chiamata. È dichiaratamente
  pronta per il Modulo Finale, che non esiste. Con lei resta inutilizzata la chiave
  `episodeFinalMessages` di `messaggi-feedback.json`.

### 4.6 Valori duplicati in più punti

| Valore | Dove sta due (o più) volte |
|---|---|
| Nome del grado | `CONFIG.gradeNames` (`A: 'Parole'`, riga 377) **e** `levels.A.label` nel file episodio. Il codice legge solo il primo; il secondo non è letto da nessuno. |
| Contenuto dei tre file `data/` | Duplicato per intero nei blocchi `window.FALLBACK_*`. È deliberato (regola 6) e `tests/test_fallbacks.js` lo sorveglia — segnalato per completezza, non come difetto. |
| Durata dello scorrimento della carta | `FC_SLIDE_MS = 260` in JS **e** la transizione di `.fc-card` in CSS, allineate a mano. |
| `feedbackPauseMs: 600` | `CONFIG.speedRound` **e** `CONFIG.quickMatch`, stesso valore, tenuti separati di proposito. |
| `countdownStepMs: 800` | `CONFIG.speedRound` **e** `CONFIG.dialogo`, idem. |
| Le tre soglie percentuali | `CONFIG.percentageThresholds` (1/50/80) **e** `CONFIG.voiceCoach.starThresholds` (1/50/80): stessi numeri, due scale, nessun legame nel codice. Cambiarne una sola sfalserebbe stelle e colore del modulo senza che niente lo segnali. |
| Il testo introduttivo di ogni modulo | `howItWorks` in `istruzioni-moduli.json` è mostrato sia a schermo intero sia nel popup — un solo dato, due percorsi (`renderIntroContent` / `openHowItWorksOverlay`); non è una duplicazione, ma i due percorsi vanno tenuti allineati a mano. |
| Lo stile del sottotitolo di modulo | ripetuto inline in ogni vista di modulo nell'HTML (già segnalato in una revisione precedente, ancora aperto). |

### 4.7 Altre cose viste, più piccole

- `openSpeakEasy` (7723-7724) scrive in `#speak-easy-badge` e `#speak-easy-subtitle`
  oltre che in `#speak-easy-title` e `#speak-easy-type-badge`: quattro elementi per
  due informazioni. Da verificare se i primi due sono ancora visibili.
- `#vc-warning` (8352) e `#warning` (10904) usano `style.display` diretto invece di
  `hidden`, i due punti fuori convenzione già noti e lasciati apposta.
- `CONFIG.episodes.episode1` è `{}`: nessun episodio sovrascrive l'ordine globale.
  Il ramo `(CONFIG.episodes[episodeId] && ... .moduleOrder)` (6295) non è mai vero
  oggi.
- `applyConfigOverrides` (756) sostituisce **l'intera sezione di primo livello**.
  Un override salvato su `moduleOrderDefault` congela l'ordine: modifiche successive
  al codice non arrivano più all'utente finché non si svuota la sezione dal pannello.
  È il comportamento voluto, ma vale la pena saperlo.
- `retryQueue.attemptsReminderThreshold` e `retryQueue.maxAttempts` valgono entrambi
  `3`. Il popup della valvola scatta a `=== attemptsReminderThreshold`, la forzatura
  a rosso a `>= maxAttempts`: con i valori attuali coincidono, quindi il popup e la
  chiusura forzata capitano allo stesso tentativo. Separarli mostrerebbe che sono due
  meccanismi distinti.

---

## 5. Domande ancora aperte

Le conseguenze delle alternative, senza sceglierne una.

### D1 — Come si corregge il § 4.1

**Prima, la domanda posta in chat: indicizzare per `moduleId` farebbe condividere
anche il progresso?** No: **solo la regola.** Progressi ed esiti si scrivono con
`module.id` (l'id del passo) — `markModuleCompleted(…, currentModule.id)` e
`saveModuleOutcome(…, currentModule.id)` — e si rileggono allo stesso modo
(`moduleStatus(episode, progress, m.id)`, `outcomes[m.id]` in `renderModuleList`).
`moduleOutcomeRules` è soltanto la tabella che dice *quale regola vale*: cambiarne
l'indicizzazione cambia quale regola si trova, non dove finisce il risultato. Le due
apparizioni resterebbero due passi separati, con progresso e colore propri, giudicati
con la stessa regola.

**L'unico modo di far condividere anche il progresso** sarebbe cambiare *dove si
scrive* — passare `moduleId` invece di `id` a `markModuleCompleted`/`saveModuleOutcome`.
Non serve a niente qui, e collasserebbe due passi in uno: è la strada da non prendere
per sbaglio mentre si sistema la tabella.

| | Cosa comporta | Costo | Rischio |
|---|---|---|---|
| **A — indicizzare per `moduleId`** | Tutte le apparizioni di uno stesso modulo condividono la regola, per costruzione: non è più possibile darne una diversa alla seconda. | Cinque righe (i quattro pulsanti di completamento più le due letture di `attemptRule`); la configurazione non cambia di una virgola. | Nessuno tecnico. Si perde un grado di libertà che oggi nessuno usa. |
| **B — ricaduta `[id]` poi `[moduleId]`** | Default identico ad A, ma resta possibile dichiarare un'eccezione per un singolo passo scrivendo `'quickMatchEngIta-2': '…'`. | Le stesse cinque righe più una funzione condivisa che fa la ricaduta — altrimenti la si riscrive cinque volte. | La chiave del passo è **generata** (`-2`, `-3`) e si sposta quando si riordina: un'eccezione scritta a mano si stacca in silenzio dal passo che voleva descrivere. |
| **C — la regola nella coppia dell'ordine** | `{ module, grade, rule }`: `docs/struttura-corso.md` diventa la fonte unica anche per l'esito, e ordine + grado + regola si leggono in una riga sola. | 22 righe da riscrivere, `moduleOutcomeRules` da smontare, la vista di riordino del Pannello Admin da estendere (oggi mostra modulo e grado), e un default da definire per le coppie che non la dichiarano. | Se la vecchia tabella resta "per compatibilità", nasce subito una seconda fonte di verità. |

### D2 — Il passo 16 (Voice Practice sul grado C) deve usare `lastAttempt`?

| | Cosa comporta |
|---|---|
| **Sì** | Non è un lavoro a parte: si risolve da solo con A o con B, perché `attemptRule` è indicizzato esattamente come `moduleOutcomeRules` e viene letto negli stessi due punti (8314, 8436). |
| **No** — il grado C deve valere il primo tentativo | Allora serve una **dichiarazione esplicita**, perché oggi è un `undefined`, non una scelta. E una dichiarazione per singolo passo è esprimibile solo con B o con C: con A non lo è. |
| **Terza via** | Se Voice Practice deve *sempre* valere l'ultimo tentativo e Voice Check *sempre* il primo, `attemptRule` non serve più a nessuno: la distinzione è già in `voiceVariant`, che sta nel descrittore ed è quindi identico per tutte le apparizioni. La tabella sparisce e il § 4.1 si riduce al solo `moduleOutcomeRules`. |

### D5 — Rimuovere `view-pronunciation`

| | Cosa comporta |
|---|---|
| **Toglierla** | Spariscono `startPronunciationExercise`, `renderPhrase`, `currentPhraseText`, `submitAttempt`, `buildTargetTokens`, `EPISODES.episode1.segments`, la seconda istanza `SpeechRecognition` (10901 in poi), il markup della vista e i suoi sei elementi. Con loro l'unico lettore di `LEVEL_CLASS`. |
| **L'ostacolo vero** | `tokenize`, `alignWords`, `classify` — e le loro `levenshtein`, `similarity`, `stripForCompare` — **stanno in quel blocco ma le usa Voice Coach** (8389-8403) **e Dialogo** (`dgLineDurationMs`, 9260). Vanno spostate in un punto condiviso, non cancellate: è la parte che rende la rimozione non banale, ed è anche il momento giusto per dare loro un posto proprio (regola 18). |
| **Tenerla** | Costa zero oggi. È l'**unico posto in cui la mastery viene riletta per disegnare qualcosa**: se domani si costruisce la composizione per colore, `renderPhrase` è già il modello di come si mostrano rosso/giallo/verde a schermo — l'unico esempio funzionante che l'app abbia. |

---

## 6. Decisioni prese

Registrate qui perché una decisione che vive solo in chat si perde. La numerazione è
quella delle domande aperte della revisione precedente.

### D3 — La mastery deve distinguere un'autovalutazione da una risposta verificata

**Sì, deve distinguere. Non ora**: oggi la mastery non è riletta da nessuno (§ 3a),
quindi non fa danno, e correggerla prima del meccanismo che leggerà quei colori
significherebbe farlo nascere già inquinato. La correzione va fatta **insieme** a quel
meccanismo.

**La direzione, per quando si farà:**

> Il colore **sale** solo su risposte verificate. **Scende** su qualsiasi segnale,
> autovalutazione compresa.

Il perché è nella natura dei due segnali: **chi dichiara di non sapere dà
un'informazione onesta; chi dichiara di sapere dà un'opinione.** Un "Non ancora" di
Flash Card è affidabile quanto una risposta sbagliata a Match Practice; un "Sì, la so"
no. Oggi `applyMasteryResult` (6105) li tratta come identici in entrambe le direzioni.

**`CONFIG.mastery.promotionStreak` fa parte della stessa domanda.** Vale `2` dal
**primo commit del repository** (`f7298f9`, 24 agosto), nello stesso blocco che ha
introdotto la scala dei colori, e non è mai stato cambiato negli 80 commit successivi:
l'unica altra modifica a quella riga (`8b70545`) le ha aggiunto la descrizione per il
Pannello Admin, non un valore nuovo. Quando è stato scelto, **l'unica cosa che
alimentava la scala era l'esercizio di pronuncia** — un "corretto" era una parola
riconosciuta dal microfono. L'autovalutazione è arrivata sulla stessa scala **il
commit successivo, lo stesso giorno**, con Flash Card (`95852b2`): il numero non è
stato rivisto, ma il
significato di ciò che conta gli è cambiato sotto.

Con `promotionStreak: 2`, da zero servono **quattro** "Sì, la so" per arrivare a
verde (il primo tentativo fissa la base a rosso con streak 1; il secondo porta a
giallo; il quarto a verde) e **due** per il primo scalino. Alzare il numero non è la
risposta: rallenterebbe anche le risposte verificate per compensare una sola fonte
inaffidabile. **Il problema non è quanto in fretta si sale, è chi può far salire.**

### D4 — `CONFIG.speedRound.pointsPerCorrect`

**Tolto.** Il punteggio a punti non esiste più nel codice. Una manopola visibile nel
Pannello Admin che non muove niente è peggio di una assente: chi la gira crede di aver
cambiato qualcosa. Rimossa la chiave e la sua riga in `configFieldDescriptions`.

### D6 — I nomi obsoleti del § 2.4

**Si rinominano tutti insieme, ma non ora e mai senza migrazione.** Toccano id salvati
in `localStorage` (`quickMatchEngIta`, `speedRoundEngIta`, `voiceCoach` sono chiavi
dentro `baseinglese:modules:*` e `baseinglese:moduleOutcome:*`): una rinomina non è
cosmetica, azzererebbe i progressi di chi sta già usando l'app.

**Quando:** insieme al passaggio a Supabase, dove i dati vengono comunque trasferiti e
una migrazione è già in conto.

**Nel frattempo:** nessuna rinomina, e **ogni nome nuovo segue il nome attuale del
modulo, mai quello vecchio.** Le tre funzioni `se*` nate nel giro precedente —
`seFollowupText` (7424), `seCardIndex` (7697), `seCurrentCardIndex` (7704) — entrano
nella lista del § 2.4 insieme alle altre: sono nuove, ma portano già un prefisso morto.
