#!/usr/bin/env python3
"""controllo-bacino.py — CT-target-bacino: il grado ha abbastanza voci?

Un modulo a scelta multipla mostra `distrattori + 1` alternative, pescate fra
gli altri item dello stesso grado dello stesso episodio.

⚠️ Quindi un grado serve se ha ALMENO `distrattori + 1` voci.
🔴 E se non ne ha, non si aggiusta da solo: si FERMA. Un bacino riempito in
automatico è un bacino di cui nessuno sa più perché era vuoto.

🔴 CORRETTO IL 2026-10-02, e lo sbaglio era mio: la prima versione confrontava
la soglia col BACINO (voci - 1 - esclusi) invece che col numero di VOCI, quindi
ne chiedeva una in più. Il grado B di `spagnolo-it-gate` ha 4 voci: passava per
il trascrittore e usciva 🔴 qui. L'ha trovato Claude Code confrontando i due
numeri.

⚠️ E il numero NON è scritto qui dentro: la verità sta in
`APP_CONFIG.sceltaMultipla.distrattori`, che il Pannello Admin cambia. Questo
script lo riceve e lo STAMPA, così una differenza si vede.

Uso:  python3 controllo-bacino.py [--distrattori N] <file-ragioni.md> [...]
"""
import re, sys
from pathlib import Path

DISTRATTORI = 3   # il valore di APP_CONFIG il 2026-10-02


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
    distrattori = DISTRATTORI
    if argv and argv[0] == "--distrattori":
        distrattori = int(argv[1]); argv = argv[2:]
    if not argv:
        raise SystemExit("Uso: python3 controllo-bacino.py [--distrattori N] <file-ragioni.md> [...]")
    soglia = distrattori + 1
    print(f"  distrattori: {distrattori}  →  ogni grado letto da Match o Speed Match "
          f"serve almeno {soglia} voci")
    print(f"  (la verita' sta in APP_CONFIG.sceltaMultipla.distrattori: se la' e' un altro "
          f"numero, passalo con --distrattori)")
    print()

    uscita = 0
    for nome in argv:
        print(f"  {Path(nome).name}")
        for grado, items in gradi(Path(nome).read_text(encoding="utf-8")).items():
            if not items:
                continue
            voci = len(items)
            # ⚠️ Il grado D non lo guarda nessun modulo a scelta multipla.
            if grado.startswith("Grado D"):
                print(f"    --  {grado[:26]:28} {voci:2} voci · nessun modulo a scelta multipla lo legge")
                continue
            segno = "ok " if voci >= soglia else "🔴 "
            print(f"    {segno} {grado[:26]:28} {voci:2} voci  (serve {soglia})")
            if voci < soglia:
                uscita = 1
                print(f"         FERMO: servono almeno {soglia} voci. "
                      f"Va aggiunta una voce A MANO, non riempita in automatico.")
            # le esclusioni non le legge l'app: e' un difetto dichiarato, non una soglia
            esc = {i: [x for x in e if x in items] for i, e in items.items()}
            esc = {i: e for i, e in esc.items() if e}
            if esc:
                print(f"         ⚠️  {len(esc)} item hanno un `non con`, e l'app NON lo legge: "
                      f"un distrattore vietato puo' comparire.")
        print()
    sys.exit(uscita)


if __name__ == "__main__":
    main()
