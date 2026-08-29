# Censimento dei 14 moduli

Fotografia dello stato attuale dei moduli, ricavata leggendo `index.html` — stesso contenuto della pagina pubblicata come artifact, qui in formato markdown per restare nella documentazione di progetto. Ordine: come compaiono in mappa (`moduleOrderDefault`).

Colonne sì/no: "sì" o "no" secco. I marcatori `†1`–`†3` rimandano alle note in fondo.

| Chiave | Categoria | Regola di esito | Tentativo che conta | Ripasso errori | Valvola sicurezza | Colori parole | Schermata Finale | Blocca interfaccia durante l'audio | Suoni propri (oltre Traguardo/Uscita universali) | File testi | Componenti/funzioni condivise | File di test |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| personalizzazione | Inizio | CompletionRules (default) | — | no | no | no | no | no | — (niente Schermata Finale ⇒ niente Traguardo/Uscita) | — †1 | buildSlotFields, personalizationTablesUsed, fillTemplate, markModuleCompleted | batch2, batch3, batch3b, batch16 |
| repeatAloud | Studio | CompletionRules | — | no | no | no | sì | no | — | a1-episodio1 → vocabulary | renderRateButtons, toggleSpeak, renderIntroContent (generica), renderSummaryScreen | batch2, batch5, batch10, batch14, batch15, batch16, batch17, batch18 |
| speakEasy | Studio | SelfScoreRules (solo se ci sono spiegazioni da autovalutare) | — | no | no | no | sì | no | — | a1-episodio1 → dialogue | renderIntroContent (generica), moduleRulesLevel, applyOutcomeSubtitle, renderSummaryScreen | batch10, batch14, batch15, batch17 |
| voicePractice | Studio | ModuleRules | lastAttempt | no (contatore visibile al suo posto) | no | sì | sì | sì (durante la registrazione) | Corretto/Sbagliato (per parola) | a1-episodio1 | componente Voice Coach condiviso (voiceVariant='practice'), lockModuleHeader | batch12, batch13, batch14, batch15 |
| voiceCoach | Quiz | ModuleRules | firstAttempt | sì | sì | sì | sì | sì (durante la registrazione) | Corretto/Sbagliato (per parola) | a1-episodio1 | componente Voice Coach condiviso (voiceVariant='check'), retryQueue, openAttemptPopup, lockModuleHeader | batch3b, batch6, batch8, batch10, batch11, batch12, batch16, batch17, voicecoach |
| quickMatchEngIta | Studio | ModuleRules | firstAttempt †2 | sì | sì | sì | sì | no | Corretto/Sbagliato | a1-episodio1 → vocabulary | buildMultipleChoiceOptions, recordMultipleChoiceResult (condivisa con Speed Round), retryQueue, openAttemptPopup | batch2b, batch3, batch7, batch9, batch14, batch15, batch17, batch19, new_features |
| quickMatchItaEng | Studio | ModuleRules | firstAttempt †2 | sì | sì | sì | sì | no | Corretto/Sbagliato | a1-episodio1 → vocabulary | stesso componente di quickMatchEngIta | batch17, batch18, batch19, batch20 (contenuto) †3 |
| dialogoAscoltaRipeti | Studia il dialogo | SelfDeclarationRules (chiave nel codice: `selfAssessment`) | — | no | no | no | sì | no (profilo a tap libero, apposta) | — (Traguardo solo su "Sì, lo so") | a1-episodio1 → dialogue | componente Dialogo condiviso (profilo ascoltaRipeti), dgPlayLine, dgLockAll, dgFinishModule | batch3b, batch5, batch9, batch10, batch11, batch16, batch17, batch18, dialogo_extra, new_features |
| dialogoRipetiATempo | Studia il dialogo | SelfDeclarationRules | — | no | no | no | sì | sì (audio + barra a tempo) | Countdown (fine barra) | a1-episodio1 → dialogue | stesso componente Dialogo (profilo ripetiATempo), + dg-next-line-btn proprio | batch3b, batch5, batch14, batch15, batch16, batch17, batch18, dialogo_extra |
| dialogoContinuo | Studia il dialogo | SelfDeclarationRules | — | no | no | no | sì | sì (audio + barra + Pausa/Riprendi) | Countdown, Ready (3-2-1) | a1-episodio1 → dialogue | stesso componente Dialogo (profilo continuo), sfxPlayReadyCountdownSound | batch5, batch16, new_features †3 |
| speedRoundEngIta | Quiz | ModuleRules | firstAttempt †2 | sì | sì | sì | sì | sì (barra del tempo per domanda, non audio) | Corretto/Sbagliato, Ready (3-2-1 iniziale) | a1-episodio1 → vocabulary | recordMultipleChoiceResult (condivisa con Match Practice), lockModuleHeader | batch3b, batch7, batch15, batch19, new_features |
| speedRoundItaEng | Quiz | ModuleRules | firstAttempt †2 | sì | sì | sì | sì | sì | Corretto/Sbagliato, Ready | a1-episodio1 → vocabulary | stesso componente di speedRoundEngIta | solo batch19 †3 |
| flashcardAEngIta | Studio | SelfScoreRules | firstAttempt †2 | sì | sì | sì | sì | no | Corretto/Sbagliato | a1-episodio1 → vocabulary | componente Flash Card condiviso (flashcardLevel/flashcardDirection) | batch7, batch12, batch16, batch17, batch18 |
| flashcardAItaEng | Studio | SelfScoreRules | firstAttempt †2 | sì | sì | sì | sì | no | Corretto/Sbagliato | a1-episodio1 → vocabulary | stesso componente di flashcardAEngIta | batch20 (contenuto) †3 |

## Note

- **†1** — `personalizzazione` è l'unico modulo la cui voce in `modulesById` non dichiara un `dataFile` proprio: risolve le sue tabelle tramite `ensureEpisodeSlotFields(episode)`, che legge il `dataFile` a livello di episodio. Verificato: non è un buco funzionale.
- **†2** — Il "primo tentativo" per Match Practice/Speed Match/Flash Card era anche dichiarato in sei voci di `CONFIG.attemptRule`, mai lette da nessuna parte (il comportamento era già cablato direttamente in ciascun modulo) — voci rimosse; il comportamento in tabella resta invariato.
- **†3** — Copertura di test più leggera sulla "direzione B": `quickMatchItaEng`/`speedRoundItaEng`/`flashcardAItaEng` sono ancora aperti da molti meno file della gemella en→it per il comportamento generale (pulsanti, blocchi, punteggio). `quickMatchItaEng` e `flashcardAItaEng` hanno però ora `batch20`, che verifica specificamente il *contenuto* mostrato in quella direzione (testo del prompt/fronte-retro, etichetta di direzione) — il buco che il censimento aveva trovato più interessante del previsto.

*Generato leggendo `index.html` (censimento moduli), aggiornato dopo il giro di correzioni (rinomina sr→sfx, rimozione attemptRule orfani, allineamento Repeat Aloud, test batch20).*
