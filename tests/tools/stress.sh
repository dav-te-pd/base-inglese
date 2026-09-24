#!/bin/bash
# PROTEGGE: la capacita' di RIPRODURRE A COMANDO la famiglia di 1.18 — le
# asserzioni che cadono per CONTESA e non per un difetto del codice.
#
# ⚠️ PERCHE' ESISTE, E LA RAGIONE E' UNA DATA: fino al 2026-09-24 la scheda
# 1.18 diceva «si aspetta la prossima corsa rossa della CI col log gia'
# strumentato», con frequenza misurata **1 su 30**. Cioe': aspettare un evento
# raro su una macchina che non si puo' interrogare, e sperare che il log dica
# abbastanza.
#
# **Quel giorno si e' scoperto che il difetto si compra, non si aspetta.**
# Lanciando i test con un parallelismo MOLTO superiore alle CPU — ventuno
# processi su quattro — cade una o due asserzioni per giro, DIVERSE ogni
# volta. Che e' alla lettera la frase della scheda: *«un'asserzione a caso per
# corsa, e ogni volta una diversa»*.
#
# ⚠️ E NON SERVIVA NESSUNO STRUMENTO NUOVO PER FARLO: `run_full_regression.sh`
# legge gia' `SUITE_PARALLELE`. Questo script non aggiunge un meccanismo —
# aggiunge **i giri e il conto**, che sono la parte che trasforma un aneddoto
# in una misura.
#
# ⚠️ COSA NON FA, DICHIARATO (regola 32): non dice **perche'** un'asserzione
# cade. Dice **quale**, e **quante volte su quanti giri** — che e' esattamente
# quello che serve per smettere di indovinare e andare a leggere quella riga.
#
# USO:   tests/tools/stress.sh <giri> [parallelismo]
#        tests/tools/stress.sh 3 20
#
# Il parallelismo predefinito e' **cinque volte le CPU**: e' il rapporto con
# cui il difetto e' stato visto la prima volta, non un numero scelto.
set -u
cd "$(dirname "$0")/.."

GIRI="${1:-3}"
CPU="$( (nproc 2>/dev/null || echo 4) | tr -dc '0-9')"
[ -z "$CPU" ] && CPU=4
PAR="${2:-$((CPU * 5))}"

CENSIMENTO="$(mktemp)"
echo "=== STRESS: $GIRI giri a $PAR in parallelo (CPU: $CPU) ==="

for g in $(seq 1 "$GIRI"); do
  LOG="stress-giro$g.log"
  echo "--- giro $g/$GIRI -> $LOG"
  SUITE_PARALLELE="$PAR" bash run_full_regression.sh > "$LOG" 2>&1
  # Le righe rosse le scrivono i file, non questo script: si leggono da li'.
  grep -h '^FAIL' ./*.result.txt 2>/dev/null | sed "s/^FAIL *- */giro$g|/" >> "$CENSIMENTO"
  # Un file che non arriva in fondo NON lascia righe FAIL: si vede dal log.
  grep -h 'Timeout\|Error:' "$LOG" 2>/dev/null | head -3 | sed "s/^/giro$g|MORTO: /" >> "$CENSIMENTO"
  echo "    cadute: $(grep -c "^giro$g|" "$CENSIMENTO" || echo 0)"
done

echo
echo "=== CHI CADE, E SU QUANTI GIRI SU $GIRI ==="
if [ ! -s "$CENSIMENTO" ]; then
  echo "NESSUNA CADUTA in $GIRI giri a $PAR in parallelo."
  echo "⚠️ Non vuol dire che il difetto non c'e': vuol dire che questo"
  echo "   parallelismo non basta a comprarlo. Si rilancia piu' alto."
else
  cut -d'|' -f2- "$CENSIMENTO" | sort | uniq -c | sort -rn
fi
rm -f "$CENSIMENTO"
