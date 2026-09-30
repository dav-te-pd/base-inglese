#!/usr/bin/env python3
"""controllo-titoli.py — il titolo di una sezione deve comparire UNA volta sola, OVUNQUE.

⚠️ Non basta `grep -c '^## 2'`: quel `^` àncora a inizio riga, e il parser usa
`indexOf`, che non sa cosa sia una riga. Il 2026-09-30 l'occorrenza colpevole stava
dentro una cella di tabella, a metà riga, e il corso è nato senza sequenze — senza
che niente si fermasse.

Uso:  python3 controllo-titoli.py <file.md> [<file.md> …]
"""
import re, sys
from pathlib import Path

uscita = 0
for nome in sys.argv[1:]:
    t = Path(nome).read_text(encoding="utf-8")
    titoli = sorted(set(re.findall(r"(?m)^(## [^\n]+)$", t)))
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
        print(f"  ok  {nome}  ({len(titoli)} titoli, tutti unici)")
sys.exit(uscita)
