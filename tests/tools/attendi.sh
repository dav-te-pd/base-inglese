#!/bin/bash
# PROTEGGE: la forma dell'attesa. Un'attesa agganciata al nome di un processo
# (`pgrep -f run_full_regression`) trova sé stessa e non finisce mai; un'attesa
# che chiude con un `grep` dei fallimenti esce con 1 proprio quando è andato
# tutto bene. Sono i due difetti della regola 37, e sono costati due risposte
# false in un giorno solo. Questo script è l'unica forma giusta scritta una
# volta: si aggancia a ciò che il lavoro SCRIVE quando finisce — mai a ciò che
# il lavoro È mentre gira.
#
# E SI ARRENDE DA SOLA, con DUE rilevatori, perché sono due guasti diversi:
#
#   il lavoro è VIVO ma non finisce   → il log continua a crescere → solo il TETTO lo vede
#   il lavoro è MORTO                 → il log smette di crescere  → solo il SILENZIO lo vede
#
# Un'attesa col solo tetto, davanti a un lavoro morto, dice «ho aspettato
# troppo»: non ha aspettato troppo, ha aspettato un cadavere. Un'attesa col
# solo silenzio, davanti a un lavoro vivo che non finisce, non parla mai.
# Servono entrambi, e il messaggio deve dire QUALE dei due è: un'attesa che
# mente sostituita da una che tace non è un progresso.
#
# ── DA DOVE VIENE IL 600 ──────────────────────────────────────────────────
# Misurato il 2026-09-10 sui 46 file della suite completa. `run_full_regression.sh`
# scrive sul log `=== nome.js ===` PRIMA di lanciare un file e il `tail -3` DOPO:
# tutto il resto finisce nei `.result.txt`. Quindi il silenzio massimo legittimo
# sul log NON è una stima, è la forma dello script — è la durata del file più
# lento. Quel giorno: 192 s (test_avviso_microfono), su 1019 s di suite intera.
# La soglia sta a 3,1× il file più lento.
# Se un giorno un file supera i 600 s, questa attesa dichiarerà morto un lavoro
# vivo — UNA volta, e lo dirà in modo riconoscibile (caso ②). I tempi per file
# si rimisurano dagli mtime dei tests/*.result.txt dell'ultima corsa.
#
# ⚠️ HA UN PARENTE, E NON E' UN GEMELLO: `tests/tools/attendi-ci.sh` aspetta una
# corsa della CI. Condividono l'IDEA — due rilevatori, e uscite che dicono QUALE
# guasto — ma non il MECCANISMO: questo legge un file che cresce, quello
# interroga un indirizzo che risponde. Restano separati per la stessa ragione
# delle due varianti dello Sblocco Sequenziale (regola 30). **CHI TOCCA UNO
# GUARDI L'ALTRO**, perche' le due uscite si somigliano e devono restare
# coerenti.
#
# *E c'e' un fatto da sapere: il tetto e il rilevatore di silenzio sono nati
# QUI il 10 settembre, e NON sono stati riusati subito. L'attesa sulla CI e'
# stata riscritta a mano tre volte in due giorni, con tre difetti diversi, e il
# quarto — l'API illeggibile scambiata per «non e' finita» — era esattamente
# questa stessa forma. Una soluzione che c'e' e non viene portata costa piu' di
# una che manca.*
#
# Uso:
#   tests/tools/attendi.sh <file-di-log> <marcatore-ok> <marcatore-ko> [secondi-max]
#
# Esempio (la suite di regressione):
#   tests/tools/attendi.sh /tmp/suite.log "ALL FILES GREEN" "SOME FILES FAILED"
#
# Variabili d'ambiente:
#   ATTENDI_INTERVALLO  ogni quanti secondi guarda il log (default 15)
#   ATTENDI_SILENZIO    dopo quanti secondi di log fermo dichiara morto il lavoro (default 600)
#
# Codici di uscita — ognuno significa UNA cosa sola:
#   0   trovato il marcatore di successo
#   1   trovato il marcatore di fallimento
#   2   tetto di tempo scaduto, ma il log cresce ancora: lavoro VIVO e non finito
#   3   il log è fermo (o non è mai stato scritto): lavoro MORTO o mai partito
#  64   sono stati passati male gli argomenti (EX_USAGE) — l'attesa non è nemmeno partita

set -u

if [ $# -lt 3 ]; then
  echo "uso: $0 <file-di-log> <marcatore-ok> <marcatore-ko> [secondi-max]" >&2
  # 64 e non 2: fino al 2026-09-10 questo caso e il tempo scaduto uscivano
  # entrambi con 2, e chi leggeva il codice non poteva distinguere «ho aspettato
  # novanta minuti» da «mi hai chiamato male e non ho aspettato per niente».
  exit 64
fi

LOG="$1"
OK="$2"
KO="$3"
MAX="${4:-5400}"
INTERVALLO="${ATTENDI_INTERVALLO:-15}"
SILENZIO="${ATTENDI_SILENZIO:-600}"

inizio=$(date +%s)

# GNU (`-c`) e BSD/macOS (`-f`): l'attesa deve ripartire anche fuori da questo
# container (regola 24).
mtime_di() {
  stat -c %Y "$1" 2>/dev/null || stat -f %m "$1" 2>/dev/null
}

# L'ultima riga NON vuota: la suite scrive una riga vuota dopo ogni file, e
# «ultima riga: (niente)» non aiuterebbe nessuno.
ultima_riga_di() {
  grep -v '^[[:space:]]*$' "$1" 2>/dev/null | tail -n 1
}

while :; do
  # Il log può non esistere ancora: un lavoro appena lanciato non ha scritto
  # niente. Non è un errore, è l'attesa che fa il suo mestiere.
  if [ -s "$LOG" ]; then
    if grep -qF "$OK" "$LOG"; then
      echo "FINITO BENE — trovato \"$OK\" in $LOG"
      exit 0
    fi
    if grep -qF "$KO" "$LOG"; then
      echo "FINITO MALE — trovato \"$KO\" in $LOG"
      exit 1
    fi
  fi

  adesso=$(date +%s)
  trascorsi=$(( adesso - inizio ))

  # Quanto tempo è passato dall'ultima scrittura. Se il file non c'è ancora, o
  # c'è ma è vuoto, il conto parte da quando è partita l'attesa: non abbiamo
  # mai visto scrivere nessuno.
  if [ -s "$LOG" ]; then
    mai_scritto=0
    ultima=$(mtime_di "$LOG")
    [ -n "$ultima" ] || ultima=$inizio
  else
    mai_scritto=1
    ultima=$inizio
  fi
  fermo_da=$(( adesso - ultima ))
  [ "$fermo_da" -ge 0 ] || fermo_da=0

  # Il silenzio si guarda PRIMA del tetto: quando valgono tutti e due, «è morto»
  # è la diagnosi più precisa, e «ho aspettato troppo» sarebbe quella sbagliata.
  if [ "$fermo_da" -ge "$SILENZIO" ]; then
    if [ "$mai_scritto" -eq 1 ]; then
      echo "NON HA MAI SCRITTO NIENTE — ${trascorsi}s e $LOG non esiste o è vuoto (soglia ${SILENZIO}s)."
      echo "Il lavoro non è mai partito, oppure sta scrivendo da un'altra parte: controlla il percorso del log."
    else
      echo "NESSUNO STA PIÙ SCRIVENDO — $LOG è fermo da ${fermo_da}s (soglia ${SILENZIO}s)."
      echo "Il lavoro ha scritto e poi ha smesso: è MORTO, non lento. Cerca il processo, non la pazienza."
      echo "Ultima riga: $(ultima_riga_di "$LOG")"
    fi
    echo "Questo non è un verde."
    exit 3
  fi

  if [ "$trascorsi" -ge "$MAX" ]; then
    echo "ANCORA IN CORSO, HO ASPETTATO TROPPO — ${trascorsi}s senza né \"$OK\" né \"$KO\" in $LOG."
    echo "Il log è cresciuto fino a ${fermo_da}s fa: il lavoro è VIVO e non è finito."
    echo "Ultima riga: $(ultima_riga_di "$LOG")"
    echo "Questo non è un verde."
    exit 2
  fi

  sleep "$INTERVALLO"
done
