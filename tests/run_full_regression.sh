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
# ⚠️ IL NUMERO SI MISURA, DAL 2026-09-21. Qui c'era un `2` inciso per la CI,
# con scritto accanto: *«non sappiamo quante CPU abbia il runner — il workflow
# dice solo ubuntu-latest. Si alza con una misura, non con una speranza.»*
#
# **La misura e' questa riga.** `nproc` dice quante CPU ci sono davvero, sulla
# macchina che sta girando, adesso — e il numero compare nel log, quindi non e'
# piu' una cosa che qualcuno deve sapere: e' una cosa che si legge.
#
# *Un numero scritto in un file non cresce quando cresce la macchina. E' la
# stessa forma degli «undici minuti» rimasti esatti per la suite di settembre 7
# e falsi per quella di oggi, senza cambiare una lettera.*
#
# Il tetto a 8 non e' prudenza generica: oltre il numero di CPU i processi si
# tolgono tempo a vicenda, ogni test diventa piu' lento, e i timeout scattano
# per CONTESA invece che per difetto — cioe' un rosso che non sa spiegarsi.
CPU_MISURATE="$( (nproc 2>/dev/null || getconf _NPROCESSORS_ONLN 2>/dev/null || echo 2) | tr -dc '0-9')"
[ -z "$CPU_MISURATE" ] && CPU_MISURATE=2
[ "$CPU_MISURATE" -gt 8 ] && CPU_MISURATE=8
SUITE_PARALLELE="${SUITE_PARALLELE:-$CPU_MISURATE}"

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

# ⚠️ I FILE NON SI ELENCANO PIU' A MANO, DAL 2026-10-16: si lancia OGNI
# `test_*.js` di questa cartella, tranne quelli scritti in
# `esclusi-dalla-suite.txt` col loro perche'. Deciso da chi guida il progetto.
#
# *Fino a quel giorno qui c'era `FILES="test_batch2.js test_batch2b.js …"`,
# scritto a mano, e un file nuovo dimenticato fuori non girava senza che
# niente lo dicesse: `test_testi_dal_markdown.js` il 2026-09-28,
# `test_testi_condivisi.js` il 2026-10-13. La difesa era una guardia, [G] di
# `test_conta_asserzioni.js`, che il difetto lo PRENDEVA a suite finita; il
# glob lo rende IMPOSSIBILE.* Le ragioni con cui il glob era stato scartato il
# 28/09 — e perche' non reggono — stanno accanto a [G].
#
# L'ordine e' quello alfabetico (`sort` di Node), lo stesso su ogni macchina: serve
# solo a ristampare i blocchi del log alla fine. Nessun file dipende da un
# altro (l'isolamento e' scritto qui sopra).
#
# La regola sta in `tools/file-della-suite.js`, l'unico posto: la leggono
# anche il censimento delle attese e [G]. Se il file degli esclusi manca, lo
# strumento esce con 1 e la suite si ferma qui (regola 49).
if ! FILES=$(node tools/file-della-suite.js); then
  exit 1
fi
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
echo "--- $(echo $FILES | wc -w) file, $SUITE_PARALLELE in parallelo (CPU misurate: $CPU_MISURATE) ---"
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
# E dal 2026-10-22 anche un confronto che NON SI PUO' FARE (uscita 3: baseline
# mancante o illeggibile, un file senza risultato) — regola 49.
# ⚠️ LE MISURE DELLE CATENE — passo 1.18, 2026-09-24.
#
# `misura()` (tests/attese.js) stampa «MISURA <nome>: N ms» dentro l'output del
# suo file, che finisce in `<file>.result.txt`. In CI quei file **si stampano
# solo se il file FALLISCE**, quindi sul runner — l'unico posto dove il numero
# serve — non arrivava niente.
#
# *Era una misura che non misurava dove doveva: prodotta nel container, cioe'
# nella macchina che gia' sappiamo essere piu' veloce (regola 19).*
#
# Qui si raccolgono da tutti i `.result.txt` e si stampano in fondo, sempre:
# verde o rosso, in locale e in CI. Se non ce n'e' nessuna, lo dice - **una
# sezione vuota e' un'informazione, la sua assenza e' un silenzio.**
echo "=== misure delle catene (1.18) ==="
if grep -h '^MISURA ' $(echo "$FILES" | tr ' ' '\n' | sed 's/\.js$/.result.txt/') 2>/dev/null | sort; then
  :
else
  echo "(nessuna misura in questa corsa)"
fi
echo ""

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
