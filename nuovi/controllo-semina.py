#!/usr/bin/env python3
"""controllo-semina.py — le voci nate negli episodi recenti tornano nel nuovo?

⭐ La finestra di semina: quando si scrive un episodio, ogni voce nata negli
ultimi N episodi deve ricomparire almeno una volta dentro le BATTUTE.

🔴 Il difetto che ha creato questa regola: `aircraft-door` inglese riusa ZERO
target di `gate`. Due episodi di fila scritti senza accorgersene.

Uso:  python3 controllo-semina.py <nuovo-sorgente.md> <precedente.md> [<precedente.md> …]
"""
import re, sys, unicodedata
from pathlib import Path


def celle(r):
    return [c.strip() for c in r.strip().strip("|").split("|")]


def voci(testo):
    """Gli id e le parole dei gradi A e B."""
    fuori = {}
    tit = None
    for r in testo.split("\n"):
        if r.startswith("#"):
            tit = r.lstrip("# ").strip()
        elif r.strip().startswith("| `") and tit in ("Grado A — le parole", "Grado B — le espressioni"):
            c = celle(r)
            fuori[c[0].strip("` ")] = c[1]
    return fuori


def normale(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def battute(testo):
    tit = None
    fuori = []
    for r in testo.split("\n"):
        if r.startswith("#"):
            tit = r.lstrip("# ").strip()
        elif r.strip().startswith("| `d-") and tit == "Grado D — le battute":
            c = celle(r)
            fuori.append(c[3])
    return " ".join(fuori)


def main():
    if len(sys.argv) < 3:
        raise SystemExit("Uso: python3 controllo-semina.py <nuovo> <precedente> [...]")

    nuovo = Path(sys.argv[1])
    testo_battute = normale(battute(nuovo.read_text(encoding="utf-8")))
    parole_nuove = set(re.findall(r"[a-zñ]+", testo_battute))

    print(f"  NUOVO: {nuovo.name}")
    print()
    tot_v = tot_r = 0
    for p in sys.argv[2:]:
        prima = Path(p)
        v = voci(prima.read_text(encoding="utf-8"))
        ritornate, assenti = [], []
        for id_, parola in v.items():
            # una voce è tornata se TUTTE le sue parole compaiono nelle battute
            pezzi = re.findall(r"[a-zñ]+", normale(parola))
            (ritornate if pezzi and all(x in parole_nuove for x in pezzi) else assenti).append(id_)
        tot_v += len(v)
        tot_r += len(ritornate)
        q = 100 * len(ritornate) // len(v) if v else 0
        print(f"  da {prima.name}")
        print(f"    {len(ritornate)} voci su {len(v)} sono tornate  ({q}%)")
        print(f"    ✅ {' · '.join(sorted(ritornate)) if ritornate else '—'}")
        print(f"    ·  non tornate: {len(assenti)}")
        print()

    print("=" * 62)
    if tot_r == 0:
        print(f"FERMO: ZERO voci riusate su {tot_v}. L'episodio non ricorda niente.")
        sys.exit(1)
    print(f"  ⭐ {tot_r} voci riusate su {tot_v}")


if __name__ == "__main__":
    main()
