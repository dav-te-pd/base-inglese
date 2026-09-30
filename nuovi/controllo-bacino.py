#!/usr/bin/env python3
"""controllo-bacino.py — CT-target-bacino: quanti distrattori ha ogni item?

Un modulo a scelta multipla pesca i distrattori dagli altri item dello stesso
grado dello stesso episodio, TOLTI quelli dichiarati in `non con`.

⚠️ Se restano meno della soglia, l'esercizio non si può comporre.
🔴 E NON si aggiusta da solo: si FERMA. Un bacino riempito in automatico è un
bacino di cui nessuno sa perché era vuoto.

Uso:  python3 controllo-bacino.py [--soglia N] <file-ragioni.md> [...]
"""
import re, sys
from pathlib import Path

SOGLIA = 4


def celle(r):
    return [c.strip() for c in r.strip().strip("|").split("|")]


def gradi(testo):
    """{titolo del grado: {id: [id esclusi]}}"""
    fuori, tit, intest = {}, None, None
    for r in testo.split("\n"):
        if r.startswith("#"):
            tit = r.lstrip("# ").strip()
            intest = None
            continue
        if not (tit or "").startswith("Grado") or not r.strip().startswith("|"):
            continue
        c = celle(r)
        if c[0] == "id":
            intest = c
            fuori[tit] = {}
            continue
        if intest is None or set(c[0]) <= set("-: "):
            continue
        k = intest.index("non con") if "non con" in intest else None
        fuori[tit][c[0].strip("` ")] = re.findall(r"`([^`]+)`", c[k]) if k is not None else []
    return fuori


def main():
    argv = sys.argv[1:]
    soglia = SOGLIA
    if argv and argv[0] == "--soglia":
        soglia = int(argv[1]); argv = argv[2:]
    if not argv:
        raise SystemExit("Uso: python3 controllo-bacino.py [--soglia N] <file-ragioni.md> [...]")

    uscita = 0
    for nome in argv:
        print(f"  {Path(nome).name}")
        for grado, items in gradi(Path(nome).read_text(encoding="utf-8")).items():
            if not items:
                continue
            peggio, chi = None, None
            for i, esclusi in items.items():
                bacino = len(items) - 1 - len([x for x in esclusi if x in items])
                if peggio is None or bacino < peggio:
                    peggio, chi = bacino, i
            segno = "ok " if peggio >= soglia else "🔴 "
            print(f"    {segno} {grado[:26]:28} {len(items):2} item · bacino minimo {peggio}  ({chi})")
            if peggio < soglia:
                uscita = 1
                print(f"         FERMO: sotto la soglia di {soglia}. "
                      f"Va aggiunta una voce A MANO, non riempito in automatico.")
        print()
    sys.exit(uscita)


if __name__ == "__main__":
    main()
