#!/bin/bash
# PROTEGGE: la forma dell'attesa. Un'attesa agganciata al nome di un processo
# (`pgrep -f run_full_regression`) trova sé stessa e non finisce mai; un'attesa
# che chiude con un `grep` dei fallimenti esce con 1 proprio quando è andato
# tutto bene. Sono i due difetti della regola 37, e sono costati due risposte
# false in un giorno solo. Questo script è l'unica forma giusta scritta una
# volta: si aggancia a ciò che il lavoro SCRIVE quando finisce — mai a ciò che
# il lavoro È mentre gira.
#
# Uso:
#   tests/tools/attendi.sh <file-di-log> <marcatore-ok> <marcatore-ko> [secondi-max]
#
# Esempio (la suite di regressione):
#   tests/tools/attendi.sh /tmp/suite.log "ALL FILES GREEN" "SOME FILES FAILED"
#
# Esce 0 se trova il marcatore di successo, 1 se trova quello di fallimento,
# 2 se scade il tempo massimo — e in quel caso lo DICE, invece di lasciar
# credere che il lavoro sia finito bene.

set -u

if [ $# -lt 3 ]; then
  echo "uso: $0 <file-di-log> <marcatore-ok> <marcatore-ko> [secondi-max]" >&2
  exit 2
fi

LOG="$1"
OK="$2"
KO="$3"
MAX="${4:-5400}"
INTERVALLO="${ATTENDI_INTERVALLO:-15}"

inizio=$(date +%s)

while :; do
  # Il log può non esistere ancora: un lavoro appena lanciato non ha scritto
  # niente. Non è un errore, è l'attesa che fa il suo mestiere.
  if [ -f "$LOG" ]; then
    if grep -qF "$OK" "$LOG"; then
      echo "FINITO BENE — trovato \"$OK\" in $LOG"
      exit 0
    fi
    if grep -qF "$KO" "$LOG"; then
      echo "FINITO MALE — trovato \"$KO\" in $LOG"
      exit 1
    fi
  fi

  trascorsi=$(( $(date +%s) - inizio ))
  if [ "$trascorsi" -ge "$MAX" ]; then
    echo "TEMPO SCADUTO dopo ${trascorsi}s: in $LOG non e' comparso ne' \"$OK\" ne' \"$KO\"."
    echo "Il lavoro NON risulta finito: questo non e' un verde."
    exit 2
  fi

  sleep "$INTERVALLO"
done
