#!/usr/bin/env python3
"""controllo-bacino.py — CT-target-bacino: ogni voce ha abbastanza distrattori?

Un modulo a scelta multipla pesca i distrattori dalle ALTRE voci dello stesso
grado dello stesso episodio, tolte quelle dichiarate in `non con`.

    bacino di una voce = voci del grado − 1 (sé stessa) − esclusi

⚠️ Se il bacino di anche UNA SOLA voce scende sotto `distrattori`, quella
domanda non si può comporre.

🔴 E non si aggiusta da solo: si FERMA. Un bacino riempito in automatico è un
bacino di cui nessuno sa più perché era vuoto.

⚠️ IL NUMERO NON STA QUI DENTRO. Si legge da `app/config.js`, che è l'unico
posto dove vive davvero. Se non si trova, lo script si ferma: un controllo che
non può controllare non deve indovinare (regola 4).

Uso:
    python3 controllo-bacino.py <file-ragioni.md> [...]
    python3 controllo-bacino.py --config percorso/config.js <file> [...]
    python3 controllo-bacino.py --distrattori N <file> [...]   # solo «e se»
"""
import re
import sys
from pathlib import Path

CONFIG_PREDEFINITO = "app/config.js"
BLOCCO = "sceltaMultipla: {"


# ─────────────────────────────────────────────────────────── il numero vero

def distrattori_da_config(percorso):
    """Legge `distrattori` da app/config.js — e si ferma se non lo trova.

    ⚠️ Il file è JavaScript, non JSON: non si esegue e non si parsa.
    Si cerca il blocco `sceltaMultipla: {`, e dentro quel blocco — cioè fino
    alla prima `}` — la chiave. Tutte e due devono comparire UNA volta sola.

    ⚠️ E non si cerca un numero di riga: cambia a ogni parametro aggiunto sopra.
    """
    f = Path(percorso)
    if not f.exists():
        raise SystemExit(
            f"FERMO: non trovo «{percorso}».\n"
            f"       Il valore di `distrattori` vive lì e non in questo script.\n"
            f"       Indica il file con --config, oppure lancia lo script dalla "
            f"radice del repository."
        )

    testo = f.read_text(encoding="utf-8")

    aperture = [m.start() for m in re.finditer(re.escape(BLOCCO), testo)]
    if len(aperture) != 1:
        raise SystemExit(
            f"FERMO: «{BLOCCO}» compare {len(aperture)} volte in {percorso}, "
            f"e ne serve esattamente una.\n"
            f"       Con zero non so dove guardare; con due non so quale sia il "
            f"blocco buono."
        )

    inizio = aperture[0] + len(BLOCCO)
    fine = testo.find("}", inizio)
    if fine == -1:
        raise SystemExit(f"FERMO: il blocco «{BLOCCO}» non si chiude in {percorso}.")

    dentro = testo[inizio:fine]
    trovati = re.findall(r"\bdistrattori\s*:\s*(\d+)", dentro)
    if len(trovati) != 1:
        raise SystemExit(
            f"FERMO: dentro «{BLOCCO}» la chiave `distrattori` compare "
            f"{len(trovati)} volte, e ne serve esattamente una."
        )

    return int(trovati[0]), percorso


# ─────────────────────────────────────────────────────── leggere il markdown

def celle(r):
    return [c.strip() for c in r.strip().strip("|").split("|")]


def gradi(testo):
    """{titolo del grado: {id: [id esclusi]}} — legge solo le tabelle dei gradi.

    ⚠️ In una sezione di grado ci va UNA tabella sola. Una seconda — un esempio,
    un confronto, una nota messa in tabella — è la stessa trappola del titolo
    citato: chi cerca «la tabella del grado B» ne trova due e legge la sbagliata.
    🔴 Quindi qui si FERMA. Il 2026-10-06 è successo davvero, in un file nostro.
    """
    fuori, tit, intest = {}, None, None
    chiusa = False          # la tabella del grado è finita (riga non-tabella dopo)
    for r in testo.split("\n"):
        if r.startswith("#"):
            tit = r.lstrip("# ").strip()
            intest, chiusa = None, False
            continue
        if not (tit or "").startswith("Grado"):
            continue
        if not r.strip().startswith("|"):
            if intest is not None and r.strip() == "":
                chiusa = True
            continue
        if chiusa:
            raise SystemExit(
                f"FERMO: dentro «{tit}» c'è una SECONDA tabella.\n"
                f"       In una sezione di grado ne va una sola: chi cerca la\n"
                f"       tabella del grado ne troverebbe due e leggerebbe la\n"
                f"       sbagliata, senza nessun errore.\n"
                f"       La riga: {r.strip()[:72]}"
            )
        c = celle(r)
        if c[0] == "id":
            intest = c
            fuori[tit] = {}
            continue
        if intest is None or set(c[0]) <= set("-: "):
            continue
        if len(c) != len(intest):
            raise SystemExit(
                f"FERMO: dentro «{tit}» una riga ha {len(c)} celle invece di "
                f"{len(intest)}.\n       La riga: {r.strip()[:72]}"
            )
        k = intest.index("non con") if "non con" in intest else None
        fuori[tit][c[0].strip("` ")] = re.findall(r"`([^`]+)`", c[k]) if k is not None else []
    return fuori


# ────────────────────────────────────────────────────────────── il controllo

def controlla(nome, distrattori):
    """Torna il numero di difetti trovati in questo file.

    ⚠️ Solo i file `-ragioni` di un episodio VERO. Il modello `-VUOTO` porta una
    riga per grado, quindi il suo bacino fa 0 — e ha ragione: prova la FORMA, non
    il contenuto. Un controllo che lo bocciasse direbbe una cosa falsa.
    🔴 E lo scarto si DICHIARA: se si salta in silenzio, un giorno si salta un
    episodio vero perché qualcuno gli ha messo VUOTO nel nome.
    """
    difetti = 0
    base = Path(nome).name
    if "VUOTO" in base.upper():
        print(f"  —   {base}: SALTATO, è il modello. "
              f"Il bacino si misura sugli episodi veri.\n")
        return 0
    if "-ragioni" not in base:
        raise SystemExit(
            f"FERMO: «{base}» non è un file `-ragioni`.\n"
            f"       Il sorgente è GENERATO: controllarlo vorrebbe dire trovare\n"
            f"       un difetto dopo che ha già viaggiato, e il giorno che i due\n"
            f"       file divergono si controllerebbe quello sbagliato.\n"
            f"       Si controlla la fonte, poi si genera."
        )
    print(f"  {base}")

    for grado, items in gradi(Path(nome).read_text(encoding="utf-8")).items():
        if not items:
            continue

        # ⚠️ Il grado D non lo legge nessun modulo a scelta multipla:
        # una battuta si ascolta e si ripete, non ha alternative fra cui scegliere.
        if grado.startswith("Grado D"):
            print(f"    —   {grado[:26]:28} {len(items):2} voci · nessun modulo a scelta multipla")
            continue

        # 🔴 Un id escluso che non esiste in questo grado è un refuso, e un
        # refuso silenzioso qui toglie una protezione senza dirlo.
        for i, esclusi in items.items():
            ignoti = [x for x in esclusi if x not in items]
            if ignoti:
                difetti += 1
                print(f"    🔴  {grado[:26]:28} `{i}` esclude id che in questo grado "
                      f"non esistono: {' · '.join(ignoti)}")

        # ⚠️ La simmetria è una conseguenza, non una regola che imponiamo:
        # se A differisce da B solo per un segnaposto, allora B differisce da A.
        # Quindi una coppia scritta in un verso solo è una dimenticanza.
        for i, esclusi in items.items():
            for x in esclusi:
                if x in items and i not in items[x]:
                    difetti += 1
                    print(f"    🔴  {grado[:26]:28} coppia asimmetrica: "
                          f"`{i}` esclude `{x}`, ma `{x}` non esclude `{i}`")

        peggio, chi = None, None
        for i, esclusi in items.items():
            bacino = len(items) - 1 - len([x for x in esclusi if x in items])
            if peggio is None or bacino < peggio:
                peggio, chi = bacino, i

        margine = peggio - distrattori
        if margine < 0:
            segno, nota = "🔴 ", " ← SOTTO"
        elif margine == 0:
            segno, nota = "⚠️  ", " ← margine ZERO"
        else:
            segno, nota = "ok ", ""

        print(f"    {segno} {grado[:26]:28} {len(items):2} voci · bacino minimo "
              f"{peggio} su {distrattori} richiesti ({chi}){nota}")

        if margine < 0:
            difetti += 1
            print(f"         FERMO: va aggiunta una voce A MANO, oppure tolta "
                  f"un'esclusione. Non si riempie in automatico.")

    print()
    return difetti


def main():
    argv = sys.argv[1:]
    distrattori = None
    config = CONFIG_PREDEFINITO
    simulato = False

    while argv and argv[0].startswith("--"):
        if argv[0] == "--distrattori":
            distrattori, simulato = int(argv[1]), True
            argv = argv[2:]
        elif argv[0] == "--config":
            config = argv[1]
            argv = argv[2:]
        else:
            raise SystemExit(f"FERMO: opzione sconosciuta «{argv[0]}».")

    if not argv:
        raise SystemExit(
            "Uso: python3 controllo-bacino.py [--config <config.js>] "
            "[--distrattori N] <file-ragioni.md> [...]"
        )

    if simulato:
        print(f"\n  ⚠️  SIMULAZIONE: distrattori = {distrattori}, dato a mano.")
        print("      Il valore vero sta in app/config.js e qui NON è stato letto.\n")
    else:
        distrattori, dove = distrattori_da_config(config)
        print(f"\n  distrattori = {distrattori}   (letto da {dove})")

    print(f"  ogni voce ha bisogno di {distrattori} altre voci del suo grado\n")

    difetti = sum(controlla(n, distrattori) for n in argv)

    if difetti:
        print(f"  🔴 {difetti} difetto.\n" if difetti == 1 else f"  🔴 {difetti} difetti.\n")
    else:
        print("  ok — nessun difetto.\n")
    sys.exit(1 if difetti else 0)


if __name__ == "__main__":
    main()
