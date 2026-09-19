#!/bin/bash
# PROTEGGE: la forma dell'attesa SULLA CI. E' il parente di `attendi.sh`, non il
# suo gemello: condividono l'IDEA — due rilevatori, e uscite che dicono QUALE
# guasto — ma non il MECCANISMO. Uno legge un file che cresce, l'altro
# interroga un indirizzo che risponde. Unirli produrrebbe un file con due meta'
# che non si parlano, tenute insieme solo dal nome. (E' lo stesso scarto della
# regola 30 sullo Sblocco Sequenziale: stessa idea, due varianti separate, che
# si citano a vicenda in testa. Chi tocca questo guardi anche `attendi.sh`.)
#
# ⚠️ DA SAPERE PRIMA DI LEGGERE IL RESTO, perche' e' il motivo per cui questo
# file esiste solo oggi:
#
#   IL TETTO E IL RILEVATORE DI SILENZIO VENGONO DA `attendi.sh`, DOVE SONO
#   STATI RISOLTI IL 10 SETTEMBRE. NON SONO STATI RIUSATI SUBITO, E SONO
#   COSTATI UN'ATTESA INFINITA.
#
# *Non era una forma nuova: era una forma risolta e non riusata.* E' la regola
# 41 applicata a una soluzione invece che a una ricerca — l'elenco c'era e non
# e' stato cercato, la soluzione c'era e non e' stata portata. Stessa famiglia,
# costo diverso: questa costa di piu', perche' il lavoro era gia' fatto.
#
# ── I CINQUE MODI DI SBAGLIARE UN'ATTESA SULLA CI ────────────────────────────
# Tre incontrati scrivendola a mano tre volte in due giorni, due trovati
# misurando l'11 settembre. Questo script li chiude tutti e cinque:
#
#  ① IL RAMO SBAGLIATO — un `main^` di troppo nell'indirizzo: zero corse, e
#    l'attesa aspetta per sempre una cosa che non arrivera'.
#  ② LA CORSA SBAGLIATA — con `per_page=1` si prende la piu' RECENTE fra piu'
#    workflow. Questo repository ne ha DUE che partono sullo stesso push (la
#    suite e la pubblicazione su Pages): leggere Pages e dire «finita» mentre
#    la suite gira e' successo l'11 settembre.
#  ③ IL NOME COME IDENTITA' — ⚠️ misurato: lo STESSO workflow si chiama
#    `pages-build-deployment` nell'elenco dei workflow e `pages build and
#    deployment` nell'elenco delle corse. Due stringhe diverse per la stessa
#    cosa, nella stessa API. Chi filtra per nome filtra un testo di
#    visualizzazione.
#  ④ L'API CHE NON PUO' RISPONDERE — su un errore il lettore solleva, l'errore
#    viene ingoiato, l'uscita e' vuota, e il ciclo legge «non finito». **Un'attesa
#    che non distingue «non e' finito» da «non riesco a vedere»**: e' la stessa
#    forma che `attendi.sh` ha corretto per i log.
#  ⑤ NESSUN TETTO E NESSUN SILENZIO — vedi il riquadro qui sopra.
#
# ── COME SI IDENTIFICA LA CORSA: NON SI INDOVINA ─────────────────────────────
# L'API ha un indirizzo che filtra per FILE DEL WORKFLOW e per COMMIT:
#   /actions/workflows/<file>/runs?head_sha=<sha>
# Il file e' nostro, lo sha e' esatto, e il risultato e' UNA corsa — non «la piu'
# recente fra due». Misurato l'11 settembre: 1 su un commit vero, `total_count: 0`
# su uno inesistente, quindi **«la corsa non esiste» e' distinguibile da «non e'
# finita»**. I difetti ①②③ spariscono per costruzione, non per attenzione.
#
# Uso:
#   tests/tools/attendi-ci.sh <file-workflow> <commit> [secondi-max]
#   tests/tools/attendi-ci.sh regressione.yml 728a314
#
# Variabili d'ambiente:
#   ATTENDI_CI_REPO        owner/repo (default: ricavato da `git remote origin`)
#   ATTENDI_CI_FETCH       comando che riceve l'indirizzo e stampa la risposta
#                          (default: curl -sS). ⚠️ Esiste perche' il test di
#                          questo script non deve chiamare GitHub davvero: un
#                          test che dipende dalla RETE cade per un motivo che
#                          non controlliamo affatto — peggio di un test che
#                          dipende da una macchina lenta, che e' il difetto che
#                          la fase 3 sta chiudendo. Stessa scelta di
#                          tests/test-env.js (regola 24).
#   ATTENDI_CI_INTERVALLO  ogni quanti secondi guarda (default 30)
#   ATTENDI_CI_ASSENTE     dopo quanti secondi senza NESSUNA corsa si arrende
#                          (default 300: una corsa impiega qualche secondo a
#                          comparire dopo il push, non cinque minuti)
#   ATTENDI_CI_CIECO       dopo quante risposte illeggibili DI SEGUITO si
#                          arrende (default 5). Una sola puo' essere un
#                          singhiozzo di rete; cinque di fila no.
#
# Codici di uscita — ognuno significa UNA cosa sola:
#   0   completata con `success`
#   1   completata NON con success — e la frase DICE quale (failure, cancelled,
#       timed_out, skipped...). ⚠️ Una corsa ANNULLATA non e' una corsa rossa:
#       chi legge deve sapere se cercare un difetto o un pulsante premuto.
#   2   tetto scaduto e la corsa e' ancora in corso: VIVA, non finita
#   3   la corsa NON ESISTE: il push non ha fatto partire la CI, o il commit e'
#       sbagliato
#   4   NON RIESCO A VEDERE: l'API non risponde, o risponde una cosa che non so
#       leggere
#  64   argomenti passati male (EX_USAGE)
#
# ⚠️ Il 3 e il 4 sono separati apposta, ed e' la lezione dei due casi di
# `attendi.sh`: «il push non ha fatto partire la CI» e «io non vedo GitHub»
# sono due ricerche diverse.

set -u

if [ $# -lt 2 ]; then
  echo "uso: $0 <file-workflow> <commit> [secondi-max]" >&2
  exit 64
fi

WORKFLOW="$1"
SHA="$2"
MAX="${3:-3600}"

# ⚠️ IL COMMIT VA ESTESO A 40 CARATTERI, e non e' pignoleria: il parametro
# `head_sha` dell'API di GitHub confronta la stringa INTERA e non fa match sui
# prefissi. Passandogli `16dd7bd` la risposta e' `total_count: 0` — cioe' lo
# stesso identico corpo che arriva quando la corsa non esiste davvero.
#
# Misurato l'11 settembre 2026, sullo stesso commit e nello stesso minuto:
#   head_sha=16dd7bd                                   -> total_count=0
#   head_sha=16dd7bda0fc2923bd464f797f9148ee80caac800  -> total_count=1
#
# Quello che ne usciva era **l'uscita 3 con un messaggio falso e AZIONABILE**:
# «il push non ha fatto partire la CI», mentre la corsa era in_progress. E'
# esattamente il difetto per cui questo script esiste (regola 37): non
# somigliava a un errore, somigliava a un risultato — e il suo, per giunta, era
# un risultato che invitava a rifare il push.
#
# Si estende con git, e se git non lo conosce (un commit di un altro
# repository, passato a mano) si usa quello che e' stato dato: meglio provarci
# che rifiutare un caso legittimo.
SHA_ESTESO="$(git rev-parse "$SHA" 2>/dev/null || true)"
if [ -n "$SHA_ESTESO" ]; then SHA="$SHA_ESTESO"; fi
if [ "${#SHA}" -ne 40 ]; then
  echo "Il commit \"$SHA\" non e' completo (40 caratteri) e git non sa estenderlo." >&2
  echo "L'API di GitHub confronta head_sha per intero: un prefisso darebbe ZERO corse" >&2
  echo "e questo script direbbe «la corsa non esiste» su una CI che sta girando." >&2
  exit 64
fi
INTERVALLO="${ATTENDI_CI_INTERVALLO:-30}"
ASSENTE_MAX="${ATTENDI_CI_ASSENTE:-300}"
CIECO_MAX="${ATTENDI_CI_CIECO:-5}"
FETCH="${ATTENDI_CI_FETCH:-curl -sS}"

# Il repository non e' scritto qui dentro: si ricava dal remoto (regola 24 —
# quello che si salva deve funzionare anche fuori da questo container).
REPO="${ATTENDI_CI_REPO:-$(git remote get-url origin 2>/dev/null | sed -E 's#.*[/:]([^/]+/[^/]+?)(\.git)?$#\1#')}"
if [ -z "$REPO" ]; then
  echo "Non riesco a ricavare owner/repo dal remoto: passalo con ATTENDI_CI_REPO." >&2
  exit 64
fi

URL="https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW/runs?head_sha=$SHA"

# ⚠️ OGNI ESITO PORTA IL COMMIT, E ACCANTO LA RIGA CHE DICE COSA FARSENE.
#
# La regola 38 dice che la CI si LEGGE. Ma «leggerla» ha un difetto che nessuno
# dei cinque qui sopra copre: si puo' leggere onestamente **il campo giusto di
# un'altra corsa**. Un elenco di corse risponde il vero su ognuna, e quella che
# interessa e' una sola.
#
# La difesa NON e' ricordarsi di usare questo script: e' che la sua risposta lo
# dica da se'. Chi incolla questa uscita in un resoconto incolla anche il
# commit, e chi la legge puo' confrontarlo con quello che e' stato spinto
# **senza fidarsi di chi gliel'ha passata**.
#
# *E' la stessa forma dell'uscita 3 separata dalla 4: non una raccomandazione
# su come guardare, ma una risposta che non si puo' fraintendere.*
esito_commit() {
  echo "commit: $SHA"
  echo "⚠️ Se non e' quello che hai appena spinto, hai letto un'altra corsa."
  echo "$URL"
}

# Legge la risposta e la riduce a UNA riga. Le tre uscite possibili sono
# distinte, e la terza e' il difetto ④ reso visibile invece che ingoiato.
leggi() {
  $FETCH "$URL" 2>/dev/null | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
    corse = d["workflow_runs"]
except Exception:
    print("ILLEGGIBILE"); raise SystemExit(0)
if not isinstance(corse, list) or len(corse) == 0:
    print("ASSENTE"); raise SystemExit(0)
c = corse[0]
# ⚠️ LA DURATA DELLA CORSA, NON LA MIA ATTESA. Vedi il commento qui sotto.
def secondi(a, b):
    from datetime import datetime
    try:
        f = "%Y-%m-%dT%H:%M:%SZ"
        return str(int((datetime.strptime(b, f) - datetime.strptime(a, f)).total_seconds()))
    except Exception:
        return "?"
print("STATO", c.get("status") or "?", c.get("conclusion") or "-",
      secondi(c.get("run_started_at") or "", c.get("updated_at") or ""))
' 2>/dev/null || echo ILLEGGIBILE
}

inizio=$(date +%s)
ciechi=0
mai_vista=1

while :; do
  riga=$(leggi)
  [ -n "$riga" ] || riga=ILLEGGIBILE
  # L'ultimo campo di "STATO <status> <conclusion> <secondi>" e' la durata vera.
  durata="${riga##* }"
  case "$riga" in "STATO "*) : ;; *) durata="?" ;; esac
  adesso=$(date +%s)
  trascorsi=$(( adesso - inizio ))

  # ⚠️ IL NUMERO CHE SI STAMPA È QUELLO DELLA CORSA, NON DELLA MIA ATTESA — e
  # la differenza non è teorica: il 2026-09-19 questo script ha scritto
  # «completata con success (1s)» su una corsa durata **585 secondi**, perché
  # l'attesa era partita a corsa già finita. *Un numero falso accanto a un
  # verdetto vero è la forma della regola 37: il verdetto era giusto, il numero
  # somigliava a una misura e non lo era.*
  case "$riga" in
    "STATO completed success"*)
      echo "VERDE — $WORKFLOW su $SHA: completata con success (corsa: ${durata}s, attesa: ${trascorsi}s)"
      esito_commit
      exit 0
      ;;
    "STATO completed "*)
      esito="${riga#STATO completed }"
      esito="${esito%% *}"
      if [ "$esito" = "cancelled" ]; then
        echo "ANNULLATA — $WORKFLOW su $SHA: conclusione \"$esito\"."
        echo "NON e' una corsa rossa: qualcuno o qualcosa l'ha fermata. Cerca un pulsante premuto, non un difetto."
      else
        echo "ROSSA — $WORKFLOW su $SHA: conclusione \"$esito\"."
        echo "Vai a leggere i job: questo non e' un verde."
      fi
      esito_commit
      exit 1
      ;;
    "STATO "*)
      mai_vista=0
      ciechi=0
      ;;
    ASSENTE)
      ciechi=0
      if [ "$mai_vista" -eq 1 ] && [ "$trascorsi" -ge "$ASSENTE_MAX" ]; then
        echo "NESSUNA CORSA — dopo ${trascorsi}s non esiste nessuna corsa di \"$WORKFLOW\" per il commit $SHA."
        echo "Il push non ha fatto partire la CI, oppure il commit e' sbagliato. Non c'e' niente da aspettare."
        esito_commit
        exit 3
      fi
      ;;
    *)
      ciechi=$(( ciechi + 1 ))
      if [ "$ciechi" -ge "$CIECO_MAX" ]; then
        echo "NON RIESCO A VEDERE — $ciechi risposte illeggibili di seguito dall'API."
        echo "Non e' «la corsa non e' finita»: e' «non so in che stato sia». Controlla rete, credenziali o limiti."
        # ⚠️ Questo era l'UNICO dei cinque esiti che non nominava il commit:
        # misurato il 2026-09-17. Adesso lo nomina come gli altri quattro.
        esito_commit
        exit 4
      fi
      ;;
  esac

  if [ "$trascorsi" -ge "$MAX" ]; then
    echo "ANCORA IN CORSO, HO ASPETTATO TROPPO — ${trascorsi}s e $WORKFLOW su $SHA non e' ancora finita."
    echo "L'ultima risposta dell'API diceva: $riga — la corsa e' VIVA, non e' un guasto dell'attesa."
    esito_commit
    exit 2
  fi

  sleep "$INTERVALLO"
done
