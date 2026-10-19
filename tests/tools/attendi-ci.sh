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
#   ATTENDI_CI_RADICE      la cartella del repository in cui leggere il
#                          workflow e i file del commit (default: quella di
#                          `git rev-parse --show-toplevel`). Serve al test, che
#                          costruisce un repository finto.
#
# Codici di uscita — ognuno significa UNA cosa sola:
#   0   completata con `success`
#   1   completata NON con success — e la frase DICE quale (failure, cancelled,
#       timed_out, skipped...). ⚠️ Una corsa ANNULLATA non e' una corsa rossa:
#       chi legge deve sapere se cercare un difetto o un pulsante premuto.
#   2   tetto scaduto e la corsa e' ancora in corso: VIVA, non finita
#   3   la corsa NON ESISTE e DOVEVA ESSERCI: almeno un file del commit e'
#       fuori da `paths-ignore`, quindi il push non ha fatto partire la CI, o
#       il commit e' sbagliato
#   4   NON RIESCO A VEDERE: l'API non risponde, o risponde una cosa che non so
#       leggere
#   5   NESSUNA CORSA ATTESA: tutti i file cambiati dal commit cadono in
#       `paths-ignore`, e GitHub ha saltato il workflow come doveva. ⚠️ Accanto
#       stampa l'ULTIMA corsa del workflow su `main`, con la data: il 5 dice che
#       questo commit non doveva far partire la CI, non che la CI sia viva
#   6   NESSUNA CORSA, E NON SO DIRE SE ERA ATTESA: un pattern di `paths-ignore`
#       che non so confrontare, un workflow che non leggo, un commit che git
#       non conosce o con piu' di un genitore. *Non si tira a indovinare.*
#  64   argomenti passati male (EX_USAGE)
#
# ⚠️ Il 3 e il 4 sono separati apposta, ed e' la lezione dei due casi di
# `attendi.sh`: «il push non ha fatto partire la CI» e «io non vedo GitHub»
# sono due ricerche diverse.
#
# ⚠️ E IL 5 E' SEPARATO DAL 3 DAL 2026-10-19, chiesto da chi guida il progetto.
# Quel giorno il 3 e' uscito su `f3d4415`, un commit che toccava solo
# `docs/decisioni-stato.md` — una delle otto voci di `paths-ignore` — ed e'
# stato letto come un guasto. Non lo era: GitHub aveva saltato il workflow
# correttamente. *Un codice che vuol dire due cose non si puo' automatizzare:*
# adesso il 3 vuol dire solo «doveva esserci e non c'e'», il 5 «non doveva
# esserci», il 6 «non lo so».

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

# ⚠️ LA CORSA ERA ATTESA? Si risponde solo DOPO l'attesa piena, mai prima.
#
# GitHub salta il workflow quando TUTTI i file cambiati cadono in
# `paths-ignore` — ma i file che guarda sono quelli di TUTTA LA SPINTA, non del
# solo commit che si passa qui. Una spinta con un commit di codice e poi uno di
# soli registri fa partire la corsa sull'ultimo: concludere «nessuna corsa
# attesa» guardando solo lui, senza aspettare, la salterebbe — e potrebbe
# essere rossa. Quindi questa funzione si chiama solo quando `ASSENTE_MAX` e'
# gia' passato senza nessuna corsa: il 5 non aggiunge attesa, da' il nome giusto
# alla fine di un'attesa che lo script fa gia'.
#
# Il filtro si legge DAL WORKFLOW, non da una copia (regola 48). E si sanno
# confrontare due forme sole, che sono tutte quelle che ci sono oggi: un
# percorso esatto e `cartella/**`. *Un `docs/*.md`, un `!negato` o un `paths:`
# positivo darebbero una risposta sbagliata in silenzio a un confronto
# ingenuo:* lo script li riconosce e risponde INDECIDIBILE (regola 37).
#
# Stampa una riga: `FILTRATI <file...>`, `FUORI <file...>` (quelli fuori dal
# filtro) o `INDECIDIBILE <motivo>`.
classifica_commit() {
  local radice wf files
  radice="${ATTENDI_CI_RADICE:-$(git rev-parse --show-toplevel 2>/dev/null || true)}"
  if [ -z "$radice" ]; then echo "INDECIDIBILE non sono dentro un repository git (e ATTENDI_CI_RADICE e' vuota)"; return; fi
  wf="$radice/.github/workflows/$WORKFLOW"
  if [ ! -f "$wf" ]; then echo "INDECIDIBILE non trovo il workflow $wf"; return; fi
  local genitori
  genitori=$(git -C "$radice" rev-list --parents -n 1 "$SHA" 2>/dev/null | wc -w)
  if [ "$genitori" -eq 0 ]; then echo "INDECIDIBILE git non conosce il commit $SHA in $radice"; return; fi
  if [ "$genitori" -ne 2 ]; then echo "INDECIDIBILE il commit ha $((genitori - 1)) genitori: so confrontare solo un commit con un genitore solo"; return; fi
  files=$(git -C "$radice" diff --name-only "$SHA^" "$SHA" 2>/dev/null)
  if [ -z "$files" ]; then echo "INDECIDIBILE il commit non cambia nessun file"; return; fi
  printf '%s\n' "$files" | python3 -c '
import sys, re
wf = sys.argv[1]
files = [f for f in sys.stdin.read().split("\n") if f]
righe = open(wf, encoding="utf8").read().split("\n")
# Il blocco `on:` fino al primo `jobs:`: li vivono i filtri del push.
testa = []
for r in righe:
    if re.match(r"^jobs:", r): break
    testa.append(r)
senza_commenti = [r for r in testa if not r.strip().startswith("#")]
if any(re.match(r"^\s+paths:\s*$", r) for r in senza_commenti):
    print("INDECIDIBILE il workflow ha un filtro `paths:` positivo, che non so confrontare"); raise SystemExit
pattern, dentro = [], False
for r in senza_commenti:
    if re.match(r"^\s+paths-ignore:\s*$", r):
        dentro = True; continue
    if dentro:
        m = re.match(r"^\s+-\s+(.*?)\s*$", r)
        if m:
            pattern.append(m.group(1).strip().strip("\x27\x22")); continue
        if r.strip() == "": continue
        dentro = False
if not pattern:
    print("INDECIDIBILE il workflow non ha `paths-ignore`: un commit senza corsa non e\x27 spiegato da un filtro"); raise SystemExit
def regola(p):
    if p.startswith("!"): return None
    if p.endswith("/**") and not re.search(r"[*?\[\]{}]", p[:-3]): return ("cartella", p[:-3] + "/")
    if not re.search(r"[*?\[\]{}]", p): return ("esatto", p)
    return None
regole = []
for p in pattern:
    g = regola(p)
    if g is None:
        print("INDECIDIBILE `paths-ignore` contiene «" + p + "», un pattern che non so confrontare (so solo percorsi esatti e cartella/**)"); raise SystemExit
    regole.append(g)
def filtrato(f):
    return any((t == "esatto" and f == v) or (t == "cartella" and f.startswith(v)) for t, v in regole)
fuori = [f for f in files if not filtrato(f)]
print(("FUORI " + " ".join(fuori)) if fuori else ("FILTRATI " + " ".join(files)))
' "$wf" 2>/dev/null || echo "INDECIDIBILE non sono riuscito a leggere $wf"
}

# ⚠️ IL 5 DICE «GITHUB HA SALTATO IL WORKFLOW», E NON PUO' DIRE «LA CI E' VIVA».
#
# Chiesto da chi guida il progetto il 2026-10-19, prima che servisse: se un
# giorno Actions fosse spento o la quota finita, su un commit di soli registri
# lo script aspetterebbe, non vedrebbe niente, classificherebbe e direbbe
# «nessuna corsa attesa» — cioe' «va tutto bene» — a CI ferma. *Il verdetto
# sarebbe giusto per il commit e falso per il mondo.*
#
# Quindi accanto al 5 si stampa l'ULTIMA corsa di questo workflow su `main`,
# con la data e quanto tempo fa: se e' di stamattina il 5 e' credibile, se e'
# di dieci giorni fa chi legge lo vede. *Il codice d'uscita non cambia:* e'
# una riga in piu', non un verdetto in piu'. E se l'ultima corsa non si puo'
# leggere, o non ce n'e' nessuna, la riga lo DICE invece di tacere (regola 49).
ultima_su_main() {
  $FETCH "https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW/runs?branch=main&per_page=1" 2>/dev/null | python3 -c '
import sys, json
from datetime import datetime, timezone
wf = sys.argv[1]
try:
    corse = json.load(sys.stdin)["workflow_runs"]
except Exception:
    print("⚠️ Non riesco a leggere l\x27ultima corsa di " + wf + " su main: il 5 NON e\x27 confermato — controlla che la CI giri."); raise SystemExit
if not isinstance(corse, list) or not corse:
    print("⚠️ NESSUNA corsa di " + wf + " su main: il 5 NON e\x27 confermato — la CI potrebbe non girare affatto."); raise SystemExit
c = corse[0]
quando = c.get("created_at") or "?"
fa = ""
try:
    d = datetime.now(timezone.utc) - datetime.strptime(quando, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    ore = int(d.total_seconds() // 3600)
    fa = ", " + (str(ore // 24) + " giorni fa" if ore >= 48 else str(ore) + " ore fa")
except Exception:
    pass
print("Ultima corsa di " + wf + " su main: " + (c.get("head_sha") or "?")[:7] + " del " + quando + fa +
      " (" + (c.get("status") or "?") + "/" + (c.get("conclusion") or "-") + ")." +
      " Se e\x27 vecchia, la CI potrebbe essere ferma: il 5 dice solo che questo commit non doveva farla partire.")
' "$WORKFLOW" 2>/dev/null || echo "⚠️ Non riesco a leggere l'ultima corsa di $WORKFLOW su main: il 5 NON e' confermato."
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
        verdetto=$(classifica_commit)
        case "$verdetto" in
          "FILTRATI "*)
            echo "NESSUNA CORSA ATTESA — dopo ${trascorsi}s non c'e' nessuna corsa di \"$WORKFLOW\" per il commit $SHA, e non doveva esserci:"
            echo "tutti i file cambiati sono in paths-ignore, quindi GitHub ha saltato il workflow come previsto."
            for f in ${verdetto#FILTRATI }; do echo "  $f"; done
            ultima_su_main
            esito_commit
            exit 5
            ;;
          "FUORI "*)
            echo "NESSUNA CORSA — dopo ${trascorsi}s non esiste nessuna corsa di \"$WORKFLOW\" per il commit $SHA, e DOVEVA esserci."
            echo "Il push non ha fatto partire la CI, oppure il commit e' sbagliato. Fuori da paths-ignore:"
            for f in ${verdetto#FUORI }; do echo "  $f"; done
            esito_commit
            exit 3
            ;;
          *)
            echo "NESSUNA CORSA, E NON SO DIRE SE ERA ATTESA — dopo ${trascorsi}s non c'e' nessuna corsa di \"$WORKFLOW\" per il commit $SHA."
            echo "Non ho potuto confrontare i file del commit con paths-ignore: ${verdetto#INDECIDIBILE }."
            echo "Non tiro a indovinare: guarda tu se il commit tocca solo file filtrati."
            esito_commit
            exit 6
            ;;
        esac
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
