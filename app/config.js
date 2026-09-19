// DIPENDE DA: nessuno
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// ============================================================
// CONFIGURAZIONE CENTRALE — il primo pezzo uscito da index.html.
//
// Ogni valore modificabile dell'app (soglie, tempi, liste, percentuali) sta
// qui, e da nessun'altra parte: CLAUDE.md regola 3. E' anche la base dati del
// Pannello Admin, che disegna un gruppo per ogni chiave di primo livello.
//
// ⚠️ SI CARICA CON UN <script src> BLOCCANTE, E DEVE RESTARE COSI'.
//
// Non ha `defer` ne' `async` e non e' un modulo: viene eseguito PRIMA dello
// script in linea di index.html, quindi `window.APP_CONFIG` esiste gia' quando
// quello parte. E' la ragione per cui questa estrazione NON e' una conversione
// ad asincrono come il passo 19 — chi legge `CONFIG.qualcosa` continua a
// trovarlo in memoria, esattamente come prima, e nessuno dei punti di chiamata
// e' stato toccato.
//
// Chi lo modifica tenga presente che due cose girano SUBITO DOPO, ancora in
// index.html e ancora a tempo di parsing: la fusione degli override salvati
// dal Pannello Admin e il tema applicato prima del primo disegno. Spostare
// questo file dopo di loro le romperebbe tutte e due in silenzio.
//
// Non e' contenuto: i dati dello studente stanno sotto data/{lingua}/
// (regola 4). Qui stanno le manopole.
// ============================================================

  window.APP_CONFIG = {
    // ---- speech recognition & synthesis ----
    speech: {
      recognitionLang: 'en-US',
      synthesisLang: 'en-US',
      synthesisRate: 0.95,
      maxAlternatives: 1,
      // ⚠️ `micMaxRecordingMs` E' USCITO il 2026-09-19 (passo A), e non l'ho
      // visto io: l'ha visto `tests/test_config_letta.js`, che tiene fermo
      // «ogni chiave di APP_CONFIG e' nominata da qualcuno». Lo leggeva **solo
      // la vista morta** `pronunciation`, e togliendo quella e' rimasto un
      // parametro dichiarato che nessuno legge — cioe' una manopola nel
      // Pannello Admin che non muove niente.
      //
      // *Voice ha i suoi (`maxRecordingMsPerWord`, `maxRecordingMarginMs`) e
      // non passava di qui.* **Un tetto al microfono continua a esistere: e'
      // quello di Voice, calcolato per parola invece che fisso.**
      // Playback speed choices offered next to a listen button, as a
      // multiplier of normal rate (1 = 100%). Order here is render order.
      rateOptions: [1, 0.75, 0.5],
      // Male voices listed first — a male voice is preferred for English
      // when the system/browser offers one, falling back to whichever
      // English voice is actually available otherwise (see pickVoice()
      // and maleVoiceNameHints below for systems whose voice isn't one of
      // these exact names).
      preferredVoiceNames: [
        'Microsoft Guy Online (Natural) - English (United States)',
        'Microsoft David - English (United States)',
        'Google UK English Male',
        'Alex',
        'Daniel',
        'Google US English',
        'Samantha',
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Jenny Online (Natural) - English (United States)'
      ],
      // Used only when none of the exact names above exist on this system:
      // a lightweight heuristic to still prefer a male-sounding voice among
      // whichever English voices ARE available, before falling back to
      // whichever one the browser happens to list first. Checked against
      // the voice's own name, lowercased.
      maleVoiceNameHints: ['male', 'guy', 'david', 'alex', 'daniel', 'mark', 'fred', 'james', 'george', 'thomas', 'oliver']
    },
    // ---- word matching (speech-to-target comparison) ----
    matching: {
      // Similarity score (0-1) at/above which a mismatched word is
      // graded "similar" (yellow) instead of "wrong" (red).
      similarThreshold: 0.6,
      // Needleman-Wunsch penalty applied per skipped word when aligning
      // recognized speech to the target phrase.
      alignmentGapPenalty: -0.6
    },
    // ---- cumulative mastery ----
    mastery: {
      // Consecutive correct answers needed to climb one level
      // (rosso -> giallo -> verde). Change this one number to retune
      // how fast progress climbs everywhere in the app.
      promotionStreak: 2
    },
    // ---- shared retry-queue safety valve ----
    // Every module with a retry-queue mechanic (Speed Match, Match Practice,
    // Flash Card, Voice Coach today) reads these SAME constants, not a
    // per-module copy.
    retryQueue: {
      // Once an item has been wrong/"Non ancora"/declared-non-attempt this
      // many times in one session (across the main pass and every retry
      // pass), it's force-accepted as rosso and dropped from the active
      // retry queue instead of being requeued again. Change this one
      // number to retune the loop-prevention threshold everywhere at once.
      maxAttempts: 3,
      // Attempt count (on the same item) at which the "you've tried N
      // times" nudge popup appears (openAttemptPopup) — same shared value
      // for every module with this mechanic, moved out of voiceCoach's own
      // section since it's no longer Voice-Coach-only.
      attemptsReminderThreshold: 3
    },
    // ---- shared percentage-score scale ----
    // Started as Speed Match's own end-of-module message bucket, but now
    // every evaluated module (Speed Match, Match Practice, Flash Card, Voice
    // Coach) reads this SAME scale for its Schermata Finale message tone
    // (see percentageBucket()) — living in one module's own section was
    // misleading (nobody looking for "the app's thresholds" would think
    // to check inside Speed Match) and an invitation for a second,
    // duplicate set to appear later. Change these three numbers to retune
    // the alto/medio/basso split everywhere at once.
    percentageThresholds: { basso: 1, medio: 50, alto: 80 },
    // ---- shared sound catalog — EVENTS, not buttons ----
    // Every sound in the app is a reaction to one of these events, never to
    // a specific button: a module's click handler calls the matching
    // playXSound() function (see near sfxPlayTone), which reads ONLY this
    // catalog. The event, not the widget that triggered it, decides
    // whether — and which — sound plays.
    //   corretto   — a single right answer/attempt (Speed Match, Quick
    //                Match, Voice Practice/Voice Check per line, Flash
    //                Card's "Sì, la so" — one card of many, not a
    //                completion).
    //   sbagliato  — a single wrong answer/attempt/declared non-attempt
    //                ("Non lo so"). Flash Card's "Non ancora" is the one
    //                deliberate exception — no sound, so a still-learning
    //                card doesn't announce itself as a small failure.
    //   countdown  — a per-line timer bar running out (Dialogo Ripeti a
    //                Tempo / Continuo).
    //   ready      — one note per digit of a 3-2-1 "get ready" countdown
    //                (Speed Match, Dialogo Continuo), last digit higher.
    //   traguardo  — a module closes with a POSITIVE or NEUTRAL outcome.
    //                Never on Dialogo's "Non ancora", never on Voice
    //                Check's confirmed-mic-problem exit.
    //   uscita     — the "Ho finito, torna alla mappa" button itself
    //                (renderSummaryScreen wires this once — every module's
    //                Schermata Finale gets it for free). Always the SAME
    //                button regardless of what Traguardo already did a
    //                couple seconds earlier when the summary screen first
    //                appeared — a closing beat, not a second congratulations.
    //   (anything else) — no sound.
    sound: {
      events: {
        // Same sine-wave/exponential-envelope family as every other tone
        // (see sfxPlayTone) — corretto has no explicit volume, so it uses
        // sfxPlayTone's own 0.15 default; sbagliato is louder on purpose
        // (see its own comment below).
        corretto: {
          freq: 880,
          durationMs: 180
        },
        // Explicit, louder than corretto's 0.15 default — at equal gain,
        // this lower pitch reads as quieter to the ear than corretto's, so
        // it needs its own explicit bump to feel balanced.
        sbagliato: {
          freq: 220,
          durationMs: 180,
          volume: 0.22
        },
        // Dialogo Ripeti a Tempo / Dialogo Continuo's per-line timer bar —
        // plays once when the bar finishes (never a tick during the bar
        // itself). Quieter than corretto/sbagliato's default volume since
        // it's a background pacing cue, not a right/wrong judgment.
        countdown: {
          freq: 660,
          durationMs: 120,
          volume: 0.08
        },
        // The 3-2-1 "get ready" countdown (Speed Match's srRunCountdown,
        // Dialogo Continuo's dgRunReadyCountdown) — one note per digit, all
        // equal except the LAST one (the "1"), which is slightly higher so
        // the final beat before starting is audibly distinct. Not to be
        // confused with "countdown" above, a different sound for a
        // different moment (a per-line timer bar finishing). One octave
        // above its previous pitch (job: "un'ottava sopra") — same
        // interval ratio between freq and finalFreq as before, still well
        // above sbagliato's 220Hz so it never reads as an error buzz.
        ready: {
          freq: 1568,
          finalFreq: 1976,
          durationMs: 100
        },
        // Three ascending notes, same sine-wave/exponential-envelope
        // family as sfxPlayTone — built by calling it three times in
        // sequence (see sfxPlayTraguardoSound), not a new synthesis
        // technique. One octave above the previous pitch (job: "un'ottava
        // sopra"), same ascending 3-note structure and timing.
        traguardo: {
          notes: [1046, 1318, 1568],
          noteDurationMs: 90,
          noteGapMs: 60
        },
        // Job 6 (3rd collaudo): the "Ho finito, torna alla mappa" button on
        // every Schermata Finale (renderSummaryScreen wires this once, not
        // per module) — a single short note, same sine/exponential-envelope
        // family as every other tone here, deliberately quieter than
        // corretto's own 0.15 default and pitched BELOW traguardo's notes so
        // it reads as "closed"/neutral, not a second congratulations
        // (Traguardo already played when the summary screen itself appeared).
        uscita: {
          freq: 784,
          durationMs: 110,
          volume: 0.1
        }
      }
    },
    // ---- limits ----
    limits: {
      userNameMaxLength: 40
    },
    // ---- Voice Practice / Voice Check recording — the ONE parametrized
    // component behind both map modules (see the JS "MODULE: VOICE COACH"
    // comment), so both read this same section; nothing here is
    // variant-specific. ----
    voiceCoach: {
      // Hard cap on one recording = (word count of the target sentence *
      // maxRecordingMsPerWord) + maxRecordingMarginMs. These, together
      // with silenceTimeoutSeconds below, determine how much audio
      // actually gets sent for speech recognition — the cost driver job
      // 6a asked to keep editable here and visible in the config panel
      // (see #config-audio-usage for the actual seconds sent, job 6c).
      maxRecordingMsPerWord: 1000,
      maxRecordingMarginMs: 3000,
      // Job 6b: if no speech is recognized within this many seconds of
      // pressing record, the recording stops on its own and is discarded
      // — never offered for Invia/Cancella, never sent for recognition
      // (see vc-record-btn's click handler and vcRecognition.onend).
      // Shorter than the hard cap above on purpose: that one bounds a
      // sentence actually being spoken, this one catches "nothing is
      // happening" much sooner.
      silenceTimeoutSeconds: 3,
      // Minimum % of correct (green) words, out of the whole target
      // sentence, needed for 1/2/3 stars — mirrors the "range" fields
      // documented in data/inglese/it/messaggi-feedback.json's percentageRule.
      starThresholds: { oneStar: 1, twoStars: 50, threeStars: 80 },
      // Progressive mic-trouble detection: counts CONSECUTIVE recordings
      // where the recognizer heard no words at all — not a wrong word,
      // that's just a mispronunciation and never counts here — and resets
      // to 0 the moment any recording IS recognized (right or wrong).
      // warningAt shows a first heads-up (check mic/permessi),
      // restartSuggestionAt proposes restarting the exercise,
      // confirmedAt treats it as a confirmed problem and offers "Torna
      // alla mappa". Same vc-mic-notice panel at every step (see
      // .danger-panel-notice) — only the text and the action escalate.
      micIssue: {
        warningAt: 2,
        restartSuggestionAt: 4,
        confirmedAt: 6
      }
    },
    // ---- Voice Practice only (Voice Check keeps the shared retry-QUEUE/
    // ModuleRules mechanics unchanged, see CONFIG.retryQueue/
    // moduleOutcomeRules) ----
    voicePractice: {
      // "Esercitati ancora" total tries per phrase (this counts the first
      // recording too, not just retries) — a VISIBLE counter (vc-attempt-
      // label), same idea as the safety-valve popup other quiz modules
      // use, but always on screen instead of a one-time nudge. Once
      // reached, the button disables and the student moves on with
      // "Avanti" — no final ripasso pass for this module.
      maxAttemptsPerPhrase: 3
    },
    // ---- Speed Match quiz (speedMatchEngIta / speedMatchItaEng modules) ----
    speedMatch: {
      // Seconds on the countdown bar before a question times out
      // (timeout is treated the same as a wrong answer).
      timeLimitSeconds: 10,
      // Pause (ms) after a correct tap before auto-advancing to the next
      // question (wrong/timeout/skip instead wait for an explicit "Avanti").
      feedbackPauseMs: 600,
      // 3-2-1 countdown shown after "Pronto? Via!", before the first question.
      countdownSeconds: 3,
      countdownStepMs: 800,
      // Retry-queue safety valve threshold lives in CONFIG.retryQueue.
      // maxAttempts (shared across every module with this mechanic); the
      // basso/medio/alto end-of-module message bucket lives in the
      // top-level CONFIG.percentageThresholds (shared by every evaluated
      // module); the corretto/sbagliato tones live in the shared
      // CONFIG.sound.events catalog (every module with a per-item
      // judgment reads the same one) — none of the three is duplicated
      // here.
    },
    // ---- Match Practice quiz (matchEngIta / matchItaEng modules) ----
    // Same multiple-choice/retry/mastery mechanics as speedMatch above
    // (shared via recordMultipleChoiceResult/buildMultipleChoiceOptions —
    // see the comment near those), just untimed: no timeLimitSeconds or
    // countdownSeconds here since there's no timer or countdown to
    // configure. feedbackPauseMs is its own key (not reusing speedMatch's)
    // so the two can be tuned independently later — same default value
    // today, kept separate on purpose. Retry-queue safety valve threshold
    // and the end-of-module message bucket are both shared — see
    // CONFIG.retryQueue.maxAttempts and CONFIG.percentageThresholds.
    match: {
      feedbackPauseMs: 600
    },
    // ---- Dialogo modules: ONE parametrized component, three profiles ----
    // "Dialogo Completo" is three consecutive map modules over the same
    // dialogue content — Ascolta e Ripeti (free, no timer), Ripeti a
    // Tempo (timed, manual advance), Dialogo Continuo (timed, automatic
    // advance) — sharing one component (openDialogo and friends).
    // ---- I due profili del componente della storia (Meet the Story,
    // Why We Say It) — stessa forma di CONFIG.dialogo.profiles: un modulo
    // dichiara storyProfile nel proprio descrittore e il componente legge
    // di qui come comportarsi, senza sapere quale dei due sta disegnando.
    //
    // La traduzione non è più una differenza fra i due: sta dentro la bolla
    // e sempre visibile in entrambi. Nasconderla dietro un pulsante costava
    // un click per card a chi sta studiando le regole, e il link
    // sottolineato si leggeva come un collegamento web. La chiave è stata
    // tolta invece di lasciarla ferma su 'always' per tutti e due: una
    // manopola che non muove niente si finisce per girarla. ----
    story: {
      profiles: {
        // Primo contatto con la storia: si ascolta e si guarda, non si
        // studiano le regole.
        meet: {
          skills: false
        },
        // Il modulo delle regole: al primo giro in sequenza, una alla volta.
        why: {
          skills: true
        }
      }
    },
    dialogo: {
      // Per-line countdown-bar duration (Ripeti a Tempo / Dialogo
      // Continuo only): pausaBase + numeroParole * pausaPerParola,
      // capped at pausaMassima. Word count comes from the line's own
      // English text (see dgLineDurationMs).
      pausaBase: 2000,
      pausaPerParola: 900,
      pausaMassima: 12000,
      // Ripeti a Tempo only: how long the suggested next line waits,
      // untouched, before it starts a slow pulsing dissolve (never a
      // forced advance — see dgSuggestNext).
      pulsareDopoInattivita: 5000,
      // Dialogo Continuo only: the 3-2-1 shown before it auto-starts,
      // same step timing as Speed Match's own countdown but its own key
      // (not reused) so the two can be tuned independently later.
      countdownPre: 3,
      countdownStepMs: 800,
      // If true, also play the Countdown tone when a line's bar STARTS,
      // not just when it ends. Off by default — see sfxPlayCountdownSound
      // and CONFIG.sound.events.countdown; no ticking during the bar either way.
      suonoCountdownInizio: false,
      profiles: {
        ascoltaRipeti: {
          translations: true,
          countdown: false,
          // The 3-2-1 "Pronto" countdown gating the whole exercise's
          // start (distinct from the per-line countdown bar above) —
          // only Dialogo Continuo auto-starts, so only it needs this.
          readyCountdown: false,
          // 'free' = any line, any order, no advance step; 'manual' = an
          // explicit tap moves to the next line; 'auto' = the next line
          // starts on its own once the current one's countdown ends.
          advance: 'free',
          pauseResume: false,
          finalBoxQuestion: 'L\'hai imparato?'
        },
        ripetiATempo: {
          translations: false,
          countdown: true,
          readyCountdown: false,
          advance: 'manual',
          pauseResume: false,
          // "Prossima frase" — cuts the current line's countdown bar
          // short for whoever's already done repeating; only this
          // profile has it (see dgSetupToolbar/dg-next-line-btn).
          nextLineButton: true,
          finalBoxQuestion: 'Sai ripetere le frasi?'
        },
        continuo: {
          translations: false,
          countdown: true,
          readyCountdown: true,
          advance: 'auto',
          pauseResume: true,
          finalBoxQuestion: 'Ce l\'hai fatta?'
        }
      }
    },
    // ---- I gradi dell'episodio, nell'ordine in cui si presentano nel
    // pannello — le lettere delle sezioni di levels nei file
    // data/{lingua}/{studente}/{lingua}-{studente}-{id}.json (regola 4).
    // Questa è solo la lista da cui la vista di riordino fa scegliere, e
    // da cui il pulsante del grado cicla.
    //
    // ⚠️ Come si chiama ogni grado per lo studente lo dice gradeNames, due
    // righe sotto — NON il file episodio. Fino al 15 settembre qui c'era
    // scritto il contrario («il nome esteso di ciascun grado, levels.A.label,
    // sta nel file episodio»), due righe sopra la chiave che lo smentisce.
    // Il campo levels.X.label nei file dati esiste ancora (regola 4 lo
    // richiede) ma non lo legge nessuno: episodeGrade() prende .items e
    // basta. Un commento che manda a cercare un dato vivo nel posto
    // sbagliato costa più di un commento che manca. ----
    grades: ['A', 'B', 'C', 'D'],
    // ---- Come si chiama ogni grado per lo studente (docs/inglese/it/struttura-corso.md).
    // La lettera è l'identificativo tecnico — codice, dati, Pannello Admin —
    // e allo studente non dice niente: senza il nome, gli esercizi sembrano
    // ripetersi senza motivo, invece di lavorare su cose diverse. Si mostra
    // accanto alla categoria, separato da gradeSeparator: "Studio · Parole". ----
    gradeNames: {
      A: 'Parole',
      B: 'Espressioni',
      C: 'Frasi',
      D: 'Dialogo'
    },
    gradeSeparator: ' · ',
    // ---- Le SEQUENZE: l'unico posto che decide l'ordine dei passi E su
    // quale grado dell'episodio ciascuno lavora.
    //
    // Una sequenza è una lista di COPPIE { module, grade }: quale modulo, e
    // su quale grado. Lo stesso modulo può comparire più volte su gradi
    // diversi (Flash Card sul grado A e sul grado B); il grado NON vive nel
    // descrittore del modulo (EPISODES.gate.modulesById), che resta
    // uguale per tutte le sue apparizioni. Un modulo che non legge contenuto
    // dall'episodio (Personalizza) non ha grade.
    //
    // OGNI EPISODIO DICHIARA LA SUA, sempre, anche il primo: non esiste più
    // una sequenza di default che qualcuno eredita in silenzio. Un episodio
    // che non dichiara niente è un errore che si vede, non un episodio che
    // ne prende una a caso — vedi resolveEpisodeOrder.
    //
    // Un'eccezione non si dichiara come "narrativo-standard meno Flash
    // Card": chi fa eccezione scrive la sua sequenza PER INTERO. Una
    // sottrazione si legge solo tenendo aperti due documenti, e quando la
    // base cambia le eccezioni cambiano senza che nessuno le abbia toccate.
    //
    // Editabile dal Pannello Admin, che mostra la sequenza dell'episodio
    // corrente (vedi renderModuleOrderField): su/giù per l'ordine, il
    // pulsante con la lettera per il grado, l'occhio per accendere e
    // spegnere un passo.
    sequences: {
      'narrativo-standard': [
        { module: 'personalizzazione' },
        { module: 'meetTheStory', grade: 'D' },
        { module: 'repeatAloud', grade: 'A' },
        { module: 'matchEngIta', grade: 'A' },
        { module: 'matchItaEng', grade: 'A' },
        { module: 'flashcardAEngIta', grade: 'A' },
        { module: 'flashcardAItaEng', grade: 'A' },
        { module: 'repeatAloud', grade: 'B' },
        { module: 'matchEngIta', grade: 'B' },
        { module: 'matchItaEng', grade: 'B' },
        { module: 'flashcardAEngIta', grade: 'B' },
        { module: 'voicePractice', grade: 'B' },
        { module: 'whyWeSayIt', grade: 'D' },
        { module: 'matchEngIta', grade: 'C' },
        { module: 'matchItaEng', grade: 'C' },
        { module: 'voicePractice', grade: 'C' },
        { module: 'dialogoAscoltaRipeti', grade: 'D' },
        { module: 'dialogoRipetiATempo', grade: 'D' },
        { module: 'dialogoContinuo', grade: 'D' },
        { module: 'speedMatchEngIta', grade: 'C' },
        { module: 'speedMatchItaEng', grade: 'C' },
        { module: 'voiceCoach', grade: 'C' }
      ]
    },
    // Ogni episodio dichiara la sua sequenza per NOME. In alternativa può
    // scrivere il proprio ordine per intero in `moduleOrder` — è la strada
    // che il Pannello Admin usa quando riordini a mano. Dichiararle
    // ENTRAMBE è un errore, e viene detto invece che risolto in silenzio
    // scegliendone una (resolveEpisodeOrder).
    episodes: {
      gate: { sequence: 'narrativo-standard' },
      // L'ordine è uno solo per tutto il corso (docs/inglese/it/struttura-corso.md):
      // un episodio può sovrascriverlo, ma è l'eccezione, e l'episodio 2 non
      // lo è — ha tutti e quattro i gradi, quindi i ventidue passi lo
      // percorrono per intero.
      'aircraft-door': { sequence: 'narrativo-standard' }
    },
    // Quale episodio apre l'app. È un parametro come gli altri (regola 3) e
    // non uno stato nascosto: il Pannello Admin gli dà un menu invece del
    // campo di testo generico (renderEpisodeSwitchField), così l'unico modo
    // di sbagliarlo è scriverlo a mano negli override.
    //
    // Perché un parametro e non una schermata di scelta: la scelta
    // dell'episodio è una decisione di prodotto — quando ci sarà una mappa
    // del corso nascerà lì, con il suo disegno. Questo interruttore serve a
    // RAGGIUNGERE un episodio per provarlo, e non deve diventare per
    // sbaglio il modo in cui gli studenti ne cambiano.
    episodioCorrente: 'gate',
    // ---- Module "type" labels (see each modulesById entry's own `type`)
    // — shown next to a module's name on the map so the student knows
    // what to expect before opening it. Purely declarative for now: not
    // yet tied to map colors or to the valvola/richiamo mechanics (a
    // later, dedicated pass will derive those from this same `type`). ----
    // Job: six category labels, describing the EXPERIENCE (how much
    // pressure — pace yourself vs. a clock/auto-advance/no retry) rather
    // than the underlying mechanism. A module is graded or not per
    // moduleOutcomeRules below regardless of which of these it shows —
    // "studio" is not a promise of "ungraded", just "no time pressure".
    moduleTypes: {
      // Le sei categorie (docs/inglese/it/struttura-corso.md). Dicono allo studente cosa
      // lo aspetta, NON se verrà valutato: ogni modulo registra il risultato,
      // sempre. La differenza fra studio e quiz non è la valutazione, è la
      // pressione — nello studio si va al proprio ritmo, nel quiz c'è il tempo
      // o l'avanzamento automatico.
      inizio: { label: 'Inizio' },
      studio: { label: 'Studio' },
      dialogo: { label: 'Studia il dialogo' },
      quiz: { label: 'Quiz' },
      test: { label: 'Verifica finale' }, // previsto: Test
      fine: { label: 'Fine' } // previsti: Modulo Finale, Download
    },
    // ---- Module Rules — which of three systems colors a module's map
    // badge, keyed by module id. Read this instead of the code to know
    // how a module gets judged:
    //   completionRules — no evaluation: verde/"Completato" the moment
    //     the student clicks the module's own completion button (Repeat
    //     Aloud, Meet the Story, Your Story). The default for any module id
    //     with no entry here — nothing to declare for these.
    //   moduleRules — verde/giallo/rosso from the FIRST-PASS score
    //     against CONFIG.percentageThresholds (see moduleRulesLevel()).
    //     Extending this to a new module means adding its id here AND
    //     calling moduleRulesLevel()+saveModuleOutcome() at its own
    //     completion — never a second copy of the verde/giallo/rosso math.
    //   selfAssessment — verde/giallo from the student's own "L'hai
    //     imparato?" answer (Dialogo's three modules, via dgFinishModule).
    //   selfScoreRules — SAME verde/giallo/rosso math as moduleRules
    //     (moduleRulesLevel/percentageThresholds, no second copy), but the
    //     underlying number is a self-DECLARED percentage (Flash Card's
    //     "Sì, la so" share, Why We Say It's "Sì, mi è chiara" share) rather
    //     than a verified right/wrong answer — kept as its own named rule,
    //     not folded into moduleRules, because it's a less reliable signal
    //     even though the color comes out of the identical formula.
    // Distinct from WordsColorRules (per-word mastery ladder, untouched)
    // and EpisodeRules (next-episode unlock — reads completion only,
    // never a color). ----
    moduleOutcomeRules: {
      voiceCoach: 'moduleRules',
      voicePractice: 'moduleRules',
      matchEngIta: 'moduleRules',
      matchItaEng: 'moduleRules',
      speedMatchEngIta: 'moduleRules',
      speedMatchItaEng: 'moduleRules',
      flashcardAEngIta: 'selfScoreRules',
      flashcardAItaEng: 'selfScoreRules',
      // Meet the Story non compare qui: e' il primo contatto con la
      // storia, non ha skill da autovalutare, quindi resta su
      // completionRules come Repeat Aloud e Your Story.
      whyWeSayIt: 'selfScoreRules',
      dialogoAscoltaRipeti: 'selfAssessment',
      dialogoRipetiATempo: 'selfAssessment',
      dialogoContinuo: 'selfAssessment'
    },
    // ---- Quale tentativo conta per un punteggio ModuleRules: NON c'e'
    // piu' una tabella qui. Le due righe che ci stavano (voicePractice:
    // 'lastAttempt', voiceCoach: 'firstAttempt') duplicavano una
    // distinzione gia' presente nel descrittore come module.voiceVariant,
    // che e' anche l'unica cosa che ramifica tutto il resto del modulo.
    // La regola vive ora nel punto che decide, vcEvaluate — vedi il suo
    // commento LastAttemptRule/FirstAttemptRule per il perche' delle due
    // scelte e per il motivo per cui gli altri moduli non hanno una
    // scelta da fare. Essendo nel descrittore, e non in una tabella
    // indicizzata per id del passo, vale identica a ogni apparizione del
    // modulo nell'ordine. ----
    // ---- Module display names — the ONE place a module's name/subtitle
    // is written. Keyed by module id (same keys as EPISODES.gate.
    // modulesById), read by the Object.keys(EPISODES).forEach computed-
    // modules block (near moduleProgressKey) which attaches them onto
    // every module object as .label/.subtitle — every existing reader of
    // module.label (map, Spiegazione title, module headers) already picks
    // this up unchanged. "name" is shown wherever a module's name appears
    // at all; "subtitle" only on the map, in small/secondary text under
    // the name. A trailing "en→it"/"it→en" in name is part of the name
    // (styled smaller by moduleNameHtml, see near renderSpiegazioneTitle)
    // — never a second label — and means "see English, answer Italian"
    // (or the reverse). ----
    moduleLabels: {
      personalizzazione: { name: 'Your Story', subtitle: 'Personalizza la tua storia' },
      repeatAloud: { name: 'Repeat Aloud', subtitle: 'Ripeti ad alta voce' },
      // I due moduli nati dallo stesso componente (CONFIG.story.profiles):
      // "Speak Easy" non descriveva piu' nessuno dei due.
      meetTheStory: { name: 'Meet the Story', subtitle: 'Ascolta la storia' },
      whyWeSayIt: { name: 'Why We Say It', subtitle: 'Perché si dice così' },
      // Voice Practice/Voice Check (job: sdoppiare Voice Coach) — two map
      // modules, one shared component (see the JS "MODULE: VOICE COACH"
      // comment); voiceCoach is the SAME id the single module used to
      // have, now meaning specifically its evaluated half.
      voicePractice: { name: 'Voice Practice', subtitle: 'Allena la pronuncia' },
      voiceCoach: { name: 'Voice Check', subtitle: 'Metti alla prova la pronuncia' },
      matchEngIta: { name: 'Match Practice en→it', subtitle: 'Abbina le traduzioni' },
      matchItaEng: { name: 'Match Practice it→en', subtitle: 'Abbina le traduzioni' },
      speedMatchEngIta: { name: 'Speed Match en→it', subtitle: 'Traduci a tempo' },
      speedMatchItaEng: { name: 'Speed Match it→en', subtitle: 'Traduci a tempo' },
      flashcardAEngIta: { name: 'Flash Card en→it', subtitle: 'Ripassa quello che hai imparato' },
      flashcardAItaEng: { name: 'Flash Card it→en', subtitle: 'Ripassa quello che hai imparato' },
      dialogoAscoltaRipeti: { name: 'Dialogue: Listen & Repeat', subtitle: 'Ascolta e ripeti' },
      dialogoRipetiATempo: { name: 'Dialogue: Repeat in Time', subtitle: 'Ripeti a tempo' },
      dialogoContinuo: { name: 'Dialogue: Real Dialogue', subtitle: 'Il dialogo vero' }
    },
    // ---- selectable color themes ----
    themes: {
      defaultTheme: 'viaggio',
      options: [
        { value: 'viaggio', label: 'Viaggio', dot: '#2B6CA3' },
        { value: 'notte', label: 'Notte', dot: '#5B8DEF' },
        { value: 'mediterraneo', label: 'Mediterraneo', dot: '#3372A8' },
        { value: 'moderno', label: 'Moderno', dot: '#1B6FA8' },
        { value: 'natura', label: 'Natura', dot: '#7ec850' }
      ]
    },
    // ---- I NOMI E I LUOGHI NON STANNO PIU' QUI ----
    //
    // Le tabelle di personalizzazione (people, places) sono uscite da
    // APP_CONFIG il 2026-09-15 e vivono in
    // data/inglese/it/tabelle-personalizzazione.json, raggiunto dalla
    // costante PERSONALIZATION_TABLES_FILE. Sono CONTENUTO dell'edizione,
    // non parametri: un'edizione tedesca vuole nomi tedeschi, e un nome
    // proprio plausibile e' quello di chi studia (CLAUDE.md regola 4).
    //
    // Il commento resta al PASSATO ed e' voluto: dice dove sono andate, non
    // finge che ci siano ancora. Chi cerca "people:" qui deve trovare questa
    // riga, non il silenzio.
    //
    // ⚠️ CHI LE LEGGE DEVE ASPETTARLE. Erano in memoria per costruzione, ora
    // arrivano da un fetch: resolveSlotTable vuole il magazzino come terzo
    // argomento, e ensureEpisodeSlotFields lo aspetta insieme al file
    // dell'episodio. Il Pannello Admin pure — vedi openConfigPanel.

    // Age choices (figlia/figlio) used to live here as a shared CONFIG.ages
    // table; they're episode-specific now (a story's plausible age range
    // isn't a reusable name/place), read from each episode's own
    // "ageOptions" via personalizationTablesUsed — see buildSlotFields.

    // ---- Per-parameter descriptions shown in the hidden config panel,
    // one row below each field (CLAUDE.md rule 13: the panel itself
    // already reads this generically — configFieldDescriptionHtml near
    // renderConfigScalarField — so a new parameter documents itself by
    // adding one line here, never by touching the panel's code). Keyed
    // by the same dotted path as the field's own data-config-path (e.g.
    // "dialogo.pausaPerParola"). A parameter missing here just renders
    // without a description line — no visual gap, nothing required.
    // Written for a non-technical reader: what the number changes, not
    // implementation detail, with a sensible range where one exists.
    // Purely descriptive — never read by anything except the panel. ----
    configFieldDescriptions: {
      'episodioCorrente': 'Quale episodio apre l\'app. Il menu elenca gli episodi che esistono: sceglierne uno ricarica la pagina, perché mappa, progressi e contenuti si costruiscono all\'avvio. Serve a raggiungere un episodio per provarlo — la scelta dell\'episodio per lo studente sarà un\'altra cosa, con il suo disegno.',
      'sequences': 'Le sequenze di passi, una per nome. Ogni episodio ne dichiara una (CONFIG.episodes.&lt;id&gt;.sequence), e nessun episodio ne eredita una in silenzio. Qui sotto si modifica quella dell\'episodio corrente: le frecce spostano il passo, il pulsante con la lettera cambia grado (A → B → C → D), l\'occhio accende e spegne. Ricarica la pagina per vedere l\'effetto in mappa.',
      'grades': 'Lettere dei gradi dell\'episodio, nell\'ordine in cui il pulsante del grado le fa girare nella vista di riordino.',
      'speech.recognitionLang': 'Lingua usata per riconoscere quello che dici al microfono.',
      'speech.synthesisLang': 'Lingua della voce sintetica che legge le frasi inglesi.',
      'speech.synthesisRate': 'Velocità della voce sintetica (1 = normale, meno di 1 = più lenta).',
      'speech.rateOptions': 'Velocità di riproduzione proposte accanto ai pulsanti di ascolto (1 = 100%).',
      'speech.preferredVoiceNames': 'Voci inglesi preferite, in ordine, se il dispositivo le ha disponibili.',
      'matching.similarThreshold': 'Quanto deve essere simile una parola detta a voce per essere segnata "simile" (giallo) invece che "sbagliata" (rosso). Valore tra 0 e 1: più alto è, più severo è il giudizio.',
      'mastery.promotionStreak': 'Quante risposte corrette di fila servono per salire di livello (rosso → giallo → verde).',
      'retryQueue.maxAttempts': 'Dopo quanti tentativi su una stessa domanda o frase la si accetta comunque, così i ripassi non tornano all\'infinito.',
      'retryQueue.attemptsReminderThreshold': 'Dopo quanti tentativi sulla stessa domanda o frase compare il messaggio "capita, tranquillo" (o quello di riconoscimento se l\'hai indovinata).',
      'percentageThresholds.basso': 'Percentuale di risposte corrette (0-100) sotto la quale il messaggio finale usa il tono "basso". Vale per ogni modulo valutato (quiz, quiz a tempo, Voice Coach).',
      'percentageThresholds.medio': 'Percentuale di risposte corrette (0-100) dalla quale il messaggio finale passa al tono "medio".',
      'percentageThresholds.alto': 'Percentuale di risposte corrette (0-100) dalla quale il messaggio finale usa il tono "alto", il più incoraggiante.',
      'sound.events.corretto.freq': 'Altezza del suono per una risposta/tentativo corretto, in Hz.',
      'sound.events.corretto.durationMs': 'Durata del suono "corretto", in millisecondi.',
      'sound.events.sbagliato.freq': 'Altezza del suono per una risposta/tentativo sbagliato, in Hz.',
      'sound.events.sbagliato.durationMs': 'Durata del suono "sbagliato", in millisecondi.',
      'sound.events.sbagliato.volume': 'Volume del suono "sbagliato", da 0 a circa 1 — più alto del volume di base per farsi sentire meglio.',
      'sound.events.countdown.freq': 'Altezza del suono che segna la fine della barra a tempo in Dialogo (in Hz — più alto è, più acuto suona).',
      'sound.events.countdown.durationMs': 'Durata del suono di fine barra, in millisecondi.',
      'sound.events.countdown.volume': 'Volume del suono di fine barra, da 0 (silenzioso) a circa 1.',
      'sound.events.ready.freq': 'Altezza delle prime due note del conto alla rovescia 3-2-1, in Hz.',
      'sound.events.ready.finalFreq': 'Altezza dell\'ultima nota (l\'"1") del conto alla rovescia, in Hz — di solito più acuta delle altre due.',
      'sound.events.ready.durationMs': 'Durata di ciascuna nota del conto alla rovescia 3-2-1, in millisecondi.',
      'sound.events.traguardo.noteDurationMs': 'Durata di ciascuna delle tre note del suono "traguardo", in millisecondi.',
      'sound.events.traguardo.noteGapMs': 'Pausa tra una nota e l\'altra del suono "traguardo", in millisecondi.',
      'sound.events.uscita.freq': 'Altezza del suono del pulsante "Ho finito, torna alla mappa", in Hz — più basso del "traguardo", per non suonare come un secondo complimento.',
      'sound.events.uscita.durationMs': 'Durata del suono "uscita", in millisecondi.',
      'sound.events.uscita.volume': 'Volume del suono "uscita", da 0 a circa 1 — più basso del volume di base per restare discreto.',
      'limits.userNameMaxLength': 'Numero massimo di caratteri consentiti per il nome utente.',
      'voiceCoach.maxRecordingMsPerWord': 'Millisecondi di tempo di registrazione concessi per ogni parola della frase da ripetere, in Voice Practice e Voice Check.',
      'voiceCoach.maxRecordingMarginMs': 'Millisecondi extra aggiunti al tempo massimo di registrazione, oltre a quelli calcolati parola per parola.',
      'voiceCoach.silenceTimeoutSeconds': 'Secondi senza rilevare voce dall\'avvio della registrazione dopo i quali si ferma da sola e NON viene inviata (compare un avviso).',
      'voiceCoach.starThresholds.oneStar': 'Percentuale minima di parole corrette (da 0 a 100) per ottenere almeno una stella.',
      'voiceCoach.starThresholds.twoStars': 'Percentuale minima di parole corrette (da 0 a 100) per ottenere due stelle.',
      'voiceCoach.starThresholds.threeStars': 'Percentuale minima di parole corrette (da 0 a 100) per ottenere tre stelle, il massimo.',
      'voiceCoach.micIssue.warningAt': 'Dopo quante registrazioni di fila senza nessuna parola riconosciuta compare il primo avviso sul microfono.',
      'voiceCoach.micIssue.restartSuggestionAt': 'Dopo quante registrazioni vuote di fila viene proposto di ricominciare l\'esercizio.',
      'voiceCoach.micIssue.confirmedAt': 'Dopo quante registrazioni vuote di fila il problema viene dato per confermato, con il pulsante per tornare alla mappa.',
      'voicePractice.maxAttemptsPerPhrase': 'Quante volte in tutto si può registrare la stessa frase in Voice Practice ("Esercitati ancora" incluso il primo tentativo), prima che si prosegua senza ripasso finale.',
      'speedMatch.timeLimitSeconds': 'Secondi a disposizione per rispondere a ogni domanda, prima che scada il tempo.',
      'speedMatch.feedbackPauseMs': 'Millisecondi di pausa dopo una risposta corretta, prima di passare alla domanda successiva.',
      'speedMatch.countdownSeconds': 'Da quale numero parte il conto alla rovescia 3-2-1 prima di iniziare.',
      'speedMatch.countdownStepMs': 'Millisecondi tra una cifra e l\'altra del conto alla rovescia 3-2-1.',
      'match.feedbackPauseMs': 'Millisecondi di pausa dopo una risposta corretta, prima di passare alla domanda successiva.',
      'dialogo.pausaBase': 'Millisecondi di base della barra a tempo di ogni battuta, prima di aggiungere il tempo per le sue parole.',
      'dialogo.pausaPerParola': 'Millisecondi aggiunti alla barra a tempo per ogni parola della battuta.',
      'dialogo.pausaMassima': 'Durata massima della barra a tempo per una battuta, in millisecondi, qualunque sia la sua lunghezza.',
      'dialogo.pulsareDopoInattivita': 'Dopo quanti millisecondi di inattività la battuta suggerita inizia a pulsare, in Ripeti a Tempo.',
      'dialogo.countdownPre': 'Da quale numero parte il conto alla rovescia 3-2-1 di Dialogo Continuo.',
      'dialogo.countdownStepMs': 'Millisecondi tra una cifra e l\'altra del conto alla rovescia di Dialogo Continuo.',
      'dialogo.suonoCountdownInizio': 'Se attivo, il suono di fine barra suona anche quando la barra inizia, non solo quando finisce.',
      'themes.defaultTheme': 'Tema colore attivo per chi non ne ha ancora scelto uno.'
    }
  };
