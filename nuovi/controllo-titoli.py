#!/usr/bin/env python3
"""controllo-titoli.py — un titolo che il parser cerca deve comparire UNA volta sola.

COSA GUARDA, alla lettera: i titoli di secondo e terzo livello — `## …` e `### …`.
COSA NON GUARDA: `#`, `####` e oltre, e qualunque altra stringa che un parser
cerchi senza che sia un titolo (il riquadro dei numeri attesi, per esempio).

⚠️ Non basta `grep -c '^## 2'`: quel `^` àncora a inizio riga, e il parser usa
`indexOf`, che non sa cosa sia una riga. Il 2026-09-30 l'occorrenza colpevole stava
dentro una cella di tabella, a metà riga, e il corso è nato senza sequenze — senza
che niente si fermasse.

🔴 E FINO AL 2026-10-11 QUESTO CONTROLLO GUARDAVA SOLO I `##`, mentre la sua prima
riga diceva «OVUNQUE». Il trascrittore cerca anche titoli di terzo livello —
`### Grado D — le battute`, `### `people.papa`` — quindi una loro citazione passava
qui e fermava la trascrizione. Trovato da Claude Code.

> Un controllo che promette piu' di quello che fa e' peggio di uno che promette
> meno: il secondo e' una mancanza, il primo e' una falsa sicurezza.

⚠️ E IL CONFRONTO E' GREZZO DI PROPOSITO: si contano le occorrenze della stringa
cosi' com'e', perche' e' quello che fa `indexOf`. Un controllo piu' furbo del
parser direbbe «a posto» su un file che il parser rifiuta.

Uso:  python3 controllo-titoli.py <file.md> [<file.md> …]
"""
import re
import sys
from pathlib import Path

LIVELLI = (r"(?m)^(## [^\n]+)$", r"(?m)^(### [^\n]+)$")

uscita = 0
for nome in sys.argv[1:]:
    t = Path(nome).read_text(encoding="utf-8")

    titoli = []
    for schema in LIVELLI:
        titoli += sorted(set(re.findall(schema, t)))

    guasti = []
    for tit in titoli:
        n = t.count(tit)
        if n != 1:
            righe = [i + 1 for i, r in enumerate(t.split("\n")) if tit in r and r.strip() != tit]
            guasti.append((tit, n, righe))

    if guasti:
        uscita = 1
        print(f"FERMO: {nome}")
        for tit, n, righe in guasti:
            print(f"  «{tit}» compare {n} volte — di troppo alle righe {righe}")
            print("  Il parser troverebbe quella riga invece della sezione vera, e non si fermerebbe.")
    else:
        due = sum(1 for x in titoli if not x.startswith("### "))
        tre = len(titoli) - due
        print(f"  ok  {nome}  ({due} titoli «##» + {tre} «###», tutti unici)")

sys.exit(uscita)
