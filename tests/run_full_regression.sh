#!/bin/bash
# Suite di regressione completa (CLAUDE.md regola 15): tutti i file che devono
# passare prima di pubblicare una modifica che tocca codice condiviso.
#
# Lanciabile da qualunque cartella — si sposta nella propria. Serve:
#   - Node con Playwright risolvibile (`npm install` dalla radice del repo)
#   - un Chromium che Playwright possa avviare (`npx playwright install chromium`)
#
# Il server statico viene avviato dallo script se la porta è libera, e fermato
# alla fine. Se un server risponde già su quella porta, viene riusato.
#
# Variabili d'ambiente: APP_PORT, APP_URL, PLAYWRIGHT_MODULE, CHROMIUM_PATH
# (vedi tests/test-env.js).
cd "$(dirname "$0")"

PORT="${APP_PORT:-8955}"
SERVER_PID=""

# ============================================================================
# QUANTI FILE IN PARALLELO — misurato il 2026-09-15, non scelto.
#
#   sequenziale  1033 s (17,2 min)     N=4   326 s (5,4 min)   3,17x
#   N=2           532 s ( 8,9 min)     N=6   279 s (4,7 min)   3,70x
#
# Tre corse, 147 esecuzioni di file, ZERO rossi. Il ginocchio e' a 4: da 4 a 6
# si guadagna il 17% a fronte del doppio della contesa (il container ha 4 CPU).
#
# ⚠️ IN CI IL DEFAULT E' 2, ED E' PRUDENZA VOLUTA: non sappiamo quante CPU
# abbia il runner — il workflow dice solo `ubuntu-latest`. Se la CI partisse a
# 4 e diventasse rossa avremmo DUE sospettati invece di uno, e il primo giro
# dopo questa modifica e' proprio quello in cui serve averne uno solo. Si alza
# con una misura, non con una speranza.
SUITE_PARALLELE="${SUITE_PARALLELE:-$([ -n "$CI" ] && echo 2 || echo 4)}"

# ⚠️ SE UNA CORSA DIVENTA ROSSA DOPO QUESTA MODIFICA, LA PRIMA IPOTESI **NON**
# E' CHE LA PARALLELIZZAZIONE SIA INSTABILE: E' CHE ABBIA TROVATO UN DIFETTO
# DELLA REGOLA 19 CHE PRIMA ERA NASCOSTO.
#
# Quattro browser insieme rallentano ogni test, cioe' avvicinano il container
# al runner della CI — ed e' esattamente la famiglia di difetti che la regola
# 19 descrive e che il container, da solo, nasconde. **Questo e' il guadagno,
# non l'effetto collaterale.**
#
# Questa riga esiste per impedire una cosa precisa: tornare a
# SUITE_PARALLELE=1 alla prima rossa, e perdere il difetto che avevamo appena
# reso visibile. Se serve isolare, si rilancia il SINGOLO file — `node
# test_x.js` — che e' gia' sequenziale per costruzione.
#
# ⚠️ E IL LIMITE DELLA VERIFICA SULL'ISOLAMENTO, perche' si dimentica proprio
# quando servirebbe: che i test siano isolati e' stato verificato LEGGENDO il
# codice, non provocando una collisione. Quello che si e' letto: il server e'
# statico e in sola lettura; ogni file scrive il PROPRIO .result.txt; i
# quattro test che scrivono su disco (test_attendi, test_attendi_ci,
# test_conta_asserzioni, test_conta_attese) usano tutti `mkdtempSync`;
# TEST_OUTPUT_DIR lo usano solo gli strumenti in tools/, mai la suite; e ogni
# file apre il proprio browser, quindi il localStorage e' separato anche fra
# test che usano lo stesso nome utente. **Le tre corse verdi sono una prova
# per campionamento, non una dimostrazione:** se un giorno due test si
# pestano i piedi, chi legge deve sapere che questa verifica e' stata fatta
# cosi'.
# ============================================================================

if node -e "require('net').connect($PORT,'127.0.0.1').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null; then
  echo "Server già attivo sulla porta $PORT — lo riuso."
else
  echo "Avvio il server statico sulla porta $PORT..."
  APP_PORT="$PORT" node serve.js > server.log 2>&1 &
  SERVER_PID=$!
  for _ in $(seq 1 50); do
    node -e "require('net').connect($PORT,'127.0.0.1').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null && break
    sleep 0.2
  done
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Il server non è partito. Output:"; cat server.log; exit 1
  fi
fi

cleanup() { [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null; }
trap cleanup EXIT

FILES="test_batch2.js test_batch2b.js test_batch3.js test_batch3b.js test_batch4.js test_batch4b.js test_batch5.js test_batch6.js test_batch7.js test_batch8.js test_batch9.js test_batch10.js test_batch11.js test_batch12.js test_batch13.js test_batch14.js test_batch15.js test_batch16.js test_batch17.js test_batch18.js test_batch19.js test_batch20.js test_dialogo_extra.js test_new_features.js test_voicecoach.js test_story_modules.js test_testi_interfaccia.js test_hidden_guard.js test_outcome_step_ids.js test_config_letta.js test_struttura_corso.js test_scala_colori.js test_errore_caricamento.js test_avviso_microfono.js test_sblocco_sequenziale.js test_attendi.js test_report_mastery.js test_episodi_corti.js test_sequenze.js test_episodio2.js test_interruttore_episodio.js test_match_practice_nonloso.js test_blocco_ascolto.js test_comportamento_audio.js test_versione_cache.js test_mastery_al_gesto.js test_conta_asserzioni.js test_conta_attese.js test_modulo_pronto.js test_attese_condivise.js test_attendi_ci.js test_tabelle_personalizzazione.js test_config_estratto.js test_spazio_nomi.js test_pulizie_registrate.js test_moduli_registrati.js test_listener_una_volta.js test_avvio_invariato.js test_uscita_dal_modulo.js test_progressi_estratto.js test_identita_estratta.js test_audio_estratto.js test_suoni_estratto.js test_quiz_engine_estratto.js test_dati_estratto.js test_dipendenze_dichiarate.js test_orchestrazione_estratta.js test_ui_condivisa_estratta.js test_risposta_una_volta.js test_edizione_una_volta.js test_stile_estratto.js test_magazzino.js"
OVERALL_OK=1

# I file girano in parallelo, ma IL LOG RESTA QUELLO DI PRIMA, riga per riga.
#
# Come: ogni file scrive il proprio .result.txt esattamente come prima (e
# tools/conta-asserzioni.js legge QUELLI, non questo log — quindi non lo tocca
# la parallelizzazione). Durante la corsa esce UNA riga per file finito, corta
# e quindi atomica sulla pipe: serve a `tail -f`, cioe' a vedere che si sta
# muovendo. Alla fine i blocchi si ristampano NELL'ORDINE DICHIARATO di FILES.
#
# Cosi' il log finale e' identico a quello sequenziale: il guadagno sta solo
# nel tempo, e nessuno degli strumenti che ci stanno sopra cambia.
ESITI="$(mktemp -d)/esiti"
mkdir -p "$ESITI"
echo "--- $(echo $FILES | wc -w) file, $SUITE_PARALLELE in parallelo ---"
echo "$FILES" | tr ' ' '\n' | xargs -P "$SUITE_PARALLELE" -I{} bash -c '
  f="{}"
  node "$f" > "${f%.js}.result.txt" 2>&1
  code=$?
  echo "$code" > "'"$ESITI"'/${f%.js}"
  if [ $code -ne 0 ]; then echo "  ✗ $f (exit $code)"; else echo "  ✓ $f"; fi
'
echo ""

# I blocchi, nell'ordine dichiarato — la stessa forma di prima.
for f in $FILES; do
  echo "=== $f ==="
  tail -3 "${f%.js}.result.txt"
  code="$(cat "$ESITI/${f%.js}" 2>/dev/null || echo 1)"
  if [ "$code" -ne 0 ]; then
    echo "FILE FAILED: $f (exit $code)"
    OVERALL_OK=0
  fi
  echo ""
done
rm -rf "$(dirname "$ESITI")"
# Il conteggio delle asserzioni (tests/tools/conta-asserzioni.js). Il codice di
# uscita di ogni file dice se qualcosa e' FALLITO; questo dice se qualcosa ha
# smesso di GIRARE, che il codice di uscita non vede: un file che esegue dieci
# asserzioni invece di quaranta esce comunque con zero.
# Un calo rende la suite rossa come un fallimento, perche' e' peggio: un test
# che fallisce lo sai, uno che non parte no.
echo "=== conteggio asserzioni ==="
if ! node tools/conta-asserzioni.js $FILES; then
  OVERALL_OK=0
fi
echo ""

if [ $OVERALL_OK -eq 1 ]; then
  echo "=== ALL FILES GREEN ==="
else
  echo "=== SOME FILES FAILED ==="
  exit 1
fi
