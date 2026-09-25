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
  #
  # ⚠️ `\b` E NON UN TRATTINO, E LA DIFFERENZA E' UN CASO VERO — 2026-09-25.
  # Qui c'era `grep -h '^FAIL - '`, col trattino, e la ragione scritta accanto
  # era giusta: i file scrivono in fondo anche una riga `FAILURES:`, e un
  # `grep '^FAIL'` la prende. **Ma il trattino risolveva quel caso creandone
  # uno peggiore: QUATTRO FILE su 78 scrivono la riga rossa in un'altra forma**
  # — `  FAIL  <nome>`, con gli spazi davanti e senza trattino
  # (`test_blocco_ascolto`, `test_conta_asserzioni`,
  # `test_interruttore_episodio`, `test_match_practice_nonloso`).
  #
  # *Per quei quattro il censimento non nominava MAI l'asserzione:* finivano
  # nel secchio `MORTO O ROSSO`, che dice il file e non la riga — e «MORTO O
  # ROSSO» si legge come «il file e' morto», non come «non so leggere la
  # riga». **La regola 37 nella sua forma pura: non somiglia a un errore,
  # somiglia a un risultato.**
  #
  # ⚠️ **Trovato al primo giro dopo lo strumento nuovo, e il caso caduto era
  # PROPRIO uno dei quattro** (`test_interruttore_episodio`, 1 giro su 3).
  #
  # ⚠️ E LA FORMA GIUSTA NON E' STATA INVENTATA QUI: e' quella che
  # `tests/tools/conta-asserzioni.js` usa da sempre —
  # `RIGA_ASSERZIONE = /^\s*(OK|PASS|FAIL)\b/`. *Il confine di parola tiene
  # fuori `FAILURES:` senza chiedere un trattino, quindi vede tutte e due le
  # forme.* **La conoscenza c'era: questo script non l'aveva riusata**
  # (regola 13). I due devono restare d'accordo, e si citano a vicenda.
  grep -hE '^[[:space:]]*FAIL\b' ./*.result.txt 2>/dev/null \
    | sed -E "s/^[[:space:]]*FAIL[[:space:]]*-?[[:space:]]*/giro$g|/" >> "$CENSIMENTO"

  # ⚠️ E I FILE CHE MUOIONO VANNO NOMINATI, non contati: un file che non
  # arriva in fondo NON lascia righe FAIL, e la prima stesura ne raccoglieva
  # solo il messaggio (`name: 'TimeoutError'`) — che non dice DOVE. Il nome lo
  # scrive la suite: `FILE FAILED: <file>`.
  grep -h '^FILE FAILED:' "$LOG" 2>/dev/null \
    | sed "s/^FILE FAILED: */giro$g|MORTO O ROSSO: /" >> "$CENSIMENTO"
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
