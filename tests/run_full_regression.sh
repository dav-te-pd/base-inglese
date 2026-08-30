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

FILES="test_batch2.js test_batch2b.js test_batch3.js test_batch3b.js test_batch4.js test_batch4b.js test_batch5.js test_batch6.js test_batch7.js test_batch8.js test_batch9.js test_batch10.js test_batch11.js test_batch12.js test_batch13.js test_batch14.js test_batch15.js test_batch16.js test_batch17.js test_batch18.js test_batch19.js test_batch20.js test_dialogo_extra.js test_new_features.js test_voicecoach.js test_speakeasy.js test_fallbacks.js"
OVERALL_OK=1
for f in $FILES; do
  echo "=== $f ==="
  node "$f" > "${f%.js}.result.txt" 2>&1
  code=$?
  tail -3 "${f%.js}.result.txt"
  if [ $code -ne 0 ]; then
    echo "FILE FAILED: $f (exit $code)"
    OVERALL_OK=0
  fi
  echo ""
done
if [ $OVERALL_OK -eq 1 ]; then
  echo "=== ALL FILES GREEN ==="
else
  echo "=== SOME FILES FAILED ==="
  exit 1
fi
