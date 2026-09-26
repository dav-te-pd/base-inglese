import json, collections, re

ist = json.load(open('data/inglese/it/inglese-it-istruzioni-moduli.json'))
st  = json.load(open('data/inglese/it/inglese-it-struttura-corso.json'))
seq = [p['module'] for p in st['sequences']['narrativo-standard']]
src = open('app/catalogo.js').read()
kind_di = {m.group(1): m.group(2) for m in re.finditer(r"^\s{4}(\w+): \{ kind: '(\w+)'", src, re.M)}
conta = collections.Counter(kind_di.get(s, s) for s in seq)

ordine = []
for s in seq:
    k = kind_di.get(s, s)
    if k not in ordine: ordine.append(k)
SCHERMATE = ['listaEpisodi', 'mappaEpisodio']
moduli = ordine[:]                      # i 14 kind, nell'ordine della sequenza
tutti = moduli + SCHERMATE              # i 16

DIV = '<div class="general-rule panel"><span class="general-rule-label">Un consiglio</span>'

def spezza(body):
    """corpo | id del consiglio | coda — e la somma DEVE ricostruire body."""
    i = body.find(DIV)
    if i == -1: return body, '', ''
    fine = body.index('</div>', i) + len('</div>')
    testo = body[i + len(DIV):body.index('</div>', i)]
    return body[:i], testo, body[fine:]

# i due consigli, scoperti contando invece che scritti a mano
visti = {}
for k in tutti:
    _, c, _ = spezza(ist[k]['howItWorks']['body'])
    if c and c not in visti:
        visti[c] = 'consiglio-scrivere' if 'carta e penna' in c else 'consiglio-a-tempo'
CONSIGLI = {v: k for k, v in visti.items()}

# ⚠️ UNO SPAZIO AI BORDI DI UNA STRINGA NON SOPRAVVIVE A UNA CELLA DI TABELLA:
# chi legge il markdown fa `.strip()` sulla cella, e quello spazio sparisce
# SENZA UN ERRORE. Misurato: una stringa su 208 ce l'ha —
# `condivisi.rispostaCorretta` = "Risposta corretta: " — e senza lo spazio
# l'app scriverebbe «Risposta corretta:Hello». Si marca con ␣ (U+2423), che si
# vede, invece di fidarsi di uno spazio che non si vede.
SPAZIO = '\u2423'

def cella(t):
    t = t.replace('|', '\\|').replace('\n', ' ')
    # solo ai BORDI: uno spazio in mezzo alla frase e' al sicuro
    fine = len(t) - len(t.rstrip(' '))
    inizio = len(t) - len(t.lstrip(' '))
    return SPAZIO * inizio + t.strip(' ') + SPAZIO * fine

def foglie(v, prefisso=''):
    """ogni stringa del sotto-albero, con il suo percorso puntato"""
    if isinstance(v, str):
        yield prefisso, v
    elif isinstance(v, dict):
        for k2, v2 in v.items():
            yield from foglie(v2, (prefisso + '.' if prefisso else '') + k2)
    elif isinstance(v, list):
        for n, v2 in enumerate(v):
            yield from foglie(v2, prefisso + '[' + str(n) + ']')

ALTRE = [k for k in ist if k not in tutti]

n_spieg = len(tutti)
n_prom  = sum(1 for k in tutti if 'helpReminder' in ist[k])
altri_di_modulo = [(k, p, t) for k in tutti
                   for p, t in foglie({x: y for x, y in ist[k].items()
                                       if x not in ('howItWorks', 'helpReminder')})]
condivisi = [(k, p, t) for k in ALTRE for p, t in foglie(ist[k])]

O = []
A = O.append
A('# Istruzioni dei moduli — inglese per italiani')
A('')
A('**Il gemello di `data/inglese/it/inglese-it-istruzioni-moduli.json`.** Questo file')
A('**spiega e decide**, quel JSON **esegue** — la stessa coppia che')
A('`inglese-it-struttura-corso.md` forma col suo JSON (CLAUDE.md regola 26).')
A('')
A('⚠️ **PERCHE\' UN FILE SUO E NON UNA SEZIONE DI `inglese-it-struttura-corso.md`.**')
A('*La sezione 6 di quel file era la strada scelta a voce, e la misura l\'ha')
A('scartata per tre ragioni, non per gusto:*')
A('')
A('| | |')
A('|---|---|')
A('| **① Un markdown, un JSON** | `inglese-it-struttura-corso.md` genera `inglese-it-struttura-corso.json`, uno a uno. Una sezione 6 dentro di lui dovrebbe generare **un altro file**, e `trascrivi.js` diventerebbe l\'unico punto che sa che una fonte ne alimenta due — *una cosa che risponde a due domande da\' la risposta giusta a una* |')
A('| **② Sono due nature diverse, e la regola 8 le separa da prima** | quel JSON porta la **struttura** (gradi, categorie, sequenze, episodi); questo porta **i testi che lo studente legge**. Il primo non cambia quando si accorcia una frase; il secondo cambia solo per quello |')
A('| **③ Quaranta testi non avrebbero avuto dove stare** | «una riga per modulo» copre 16 chiavi su 22. Le altre sei (`condivisi`, `voceShared`, `bloccoAscolto`, `dialogoShared`, `aiuto`, `erroreCaricamento`) non sono moduli e non hanno una riga-modulo: **qui hanno la sezione 6** |')
A('')
A('*La tabella «una riga per modulo» che era prevista come sezione 6 esiste: e\' la')
A('**sezione 2** di questo file. Non e\' cambiata l\'idea, e\' cambiato il file che la ospita.*')
A('')
A('---')
A('')
A('## 1 — COME SI LEGGE QUESTO FILE')
A('')
A('**I titoli si cercano per TESTO ESATTO**, come in `inglese-it-struttura-corso.md`:')
A('`##` + uno spazio + il testo della colonna, carattere per carattere, col trattone')
A('`—` (U+2014) e uno spazio prima e uno dopo.')
A('')
A('| Il testo dopo `## ` | Cosa ne nasce |')
A('|---|---|')
A('| `2 — LE SPIEGAZIONI` | `<kind>.howItWorks` — il popup «Spiegazione» |')
A('| `3 — I PROMEMORIA` | `<kind>.helpReminder` — il pannello Help |')
A('| `4 — I DUE CONSIGLI CONDIVISI` | il riquadro in coda alle spiegazioni, **non una chiave del JSON** |')
A('| `5 — GLI ALTRI TESTI DI UN MODULO` | tutto il resto dentro una chiave di modulo |')
A('| `6 — I TESTI CHE NON SONO DI UN MODULO` | le sei chiavi condivise |')
A('')
A('⚠️ **IL `## ` QUI SOPRA E\' STACCATO APPOSTA:** se questa tabella scrivesse i')
A('titoli per intero, una ricerca per sottostringa troverebbe **questa riga** invece')
A('della sezione vera, e leggerebbe come tabella dei testi il resto di questa tabella.')
A('*La prova e\' ripetibile: `grep -c \'^## 2\'` deve dare **1**.*')
A('')
A('### I numeri attesi')
A('')
A('**Si contano sul contenuto prima di usarli (regola 29): se non tornano, fermarsi.**')
A('')
A('| Cosa | Quante |')
A('|---|---|')
A('| Spiegazioni (sezione 2) | **%d** |' % n_spieg)
A('| Promemoria (sezione 3) | **%d** |' % n_prom)
A('| Consigli condivisi (sezione 4) | **%d** |' % len(CONSIGLI))
A('| Altri testi di modulo (sezione 5) | **%d** |' % len(altri_di_modulo))
A('| Testi condivisi (sezione 6) | **%d** |' % len(condivisi))
A('| **Stringhe in tutto il JSON** | **%d** |' % sum(1 for _ in foglie(ist)))
A('')
A('⚠️ **UNA RIGA PER `kind`, NON PER PASSO.** I **%d** passi di `narrativo-standard`' % len(seq))
A('hanno **%d** id distinti, e due di quelli — `flashcardAEngIta` e' % len(set(seq)))
A('`flashcardAItaEng` — condividono `kind: \'flashcard\'`: **%d kind di modulo + %d' % (len(moduli), len(SCHERMATE)))
A('schermate = %d**. *La colonna «passi» dice quante volte quel testo compare in un' % n_spieg)
A('episodio: cambiarne uno cambia fino a tre schermate.*')
A('')
A('⚠️ **`listaEpisodi` e `mappaEpisodio` NON SONO MODULI**, e restano qui lo stesso:')
A('hanno una schermata loro, quindi hanno i loro due testi come tutti (regola 8).')
A('')
A('⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `␣` (U+2423), E NON E\' UN VEZZO.**')
A('*Chi legge una cella di tabella le toglie gli spazi ai lati — deve, altrimenti')
A('l\'allineamento della tabella finirebbe nel dato — quindi uno spazio ai bordi')
A('sparirebbe **senza un errore**. Misurato: su %d stringhe UNA ce l\'ha,' % sum(1 for _ in foglie(ist)))
A('`condivisi.rispostaCorretta` = `Risposta corretta:␣` — e senza quello spazio l\'app')
A('scrive «Risposta corretta:Hello» attaccato.* **Il segno si vede, lo spazio no.**')
A('')
A('⚠️ **L\'HTML NEL `corpo` E\' VOLUTO E VA COPIATO COM\'E\'**: `<p>`, `<b>`, `<em>`.')
A('L\'app lo inserisce con `innerHTML`, quindi **togliere i tag vuol dire perdere i')
A('capoversi**, non ripulire il testo.')
A('')
A('---')
A('')
A('## 2 — LE SPIEGAZIONI')
A('')
A('*Il popup «Spiegazione», in alto in ogni modulo. Colonne: **kind** -> la chiave')
A('del JSON · **titolo** -> `howItWorks.title` · **corpo** -> la prima parte di')
A('`howItWorks.body` · **consiglio** -> quale riquadro della sezione 4 si attacca')
A('in coda, `—` se nessuno · **coda** -> quello che viene DOPO il riquadro.*')
A('')
A('⚠️ **IL CORPO E\' SPEZZATO IN TRE PERCHE\' IL CONSIGLIO E\' RIPETUTO DODICI VOLTE.**')
A('*Misurato: dodici dei sedici corpi finiscono con lo stesso riquadro, in **due**')
A('varianti sole, sei volte ciascuna. Ricopiarlo in ogni riga vorrebbe dire dodici')
A('copie da tenere allineate a mano — e accorciare il consiglio e\' esattamente una')
A('delle cose da fare.* **`corpo` + il riquadro di `consiglio` + `coda` ricostruisce')
A('il `body` di oggi carattere per carattere**, e quella e\' la prova che questa')
A('divisione non cambia niente all\'app.')
A('')
A('| # | kind | Passi | Titolo | Corpo | Consiglio | Coda |')
A('|---|---|---|---|---|---|---|')
for i, k in enumerate(tutti, 1):
    h = ist[k]['howItWorks']
    corpo, c, coda = spezza(h['body'])
    A('| %d | `%s` | %s | %s | %s | %s | %s |' % (
        i, k, (conta[k] if conta.get(k) else 'schermata'), cella(h['title']),
        cella(corpo), ('`' + visti[c] + '`') if c else '—', cella(coda) if coda else '—'))
A('')
A('---')
A('')
A('## 3 — I PROMEMORIA')
A('')
A('*Il pannello Help, voce «Rileggi le istruzioni». Stesse chiavi della sezione 2.*')
A('')
A('| # | kind | Titolo | Corpo |')
A('|---|---|---|---|')
for i, k in enumerate(tutti, 1):
    h = ist[k].get('helpReminder')
    if not h: continue
    A('| %d | `%s` | %s | %s |' % (i, k, cella(h['title']), cella(h['body'])))
A('')
A('---')
A('')
A('## 4 — I DUE CONSIGLI CONDIVISI')
A('')
A('*Non sono una chiave del JSON: sono il testo dentro il riquadro')
A('`general-rule panel` che la sezione 2 attacca in coda a dodici spiegazioni.*')
A('')
A('| id | Quante spiegazioni lo usano | Testo |')
A('|---|---|---|')
uso = collections.Counter(visti[spezza(ist[k]['howItWorks']['body'])[1]]
                          for k in tutti if spezza(ist[k]['howItWorks']['body'])[1])
for cid, testo in CONSIGLI.items():
    A('| `%s` | **%d** | %s |' % (cid, uso[cid], cella(testo)))
A('')
A('**I quattro senza consiglio** sono `personalizzazione`, `meetTheStory` e le due')
A('schermate: *due sono schermate, e due sono i moduli in cui non si esercita niente.*')
A('')
A('---')
A('')
A('## 5 — GLI ALTRI TESTI DI UN MODULO')
A('')
A('*Tutto quello che sta dentro una chiave di modulo e non e\' `howItWorks` ne\'')
A('`helpReminder`: le domande di un\'autovalutazione, le righe che spiegano perche\'')
A('un pulsante e\' spento, le etichette di un riquadro. Il **percorso** e\' puntato')
A('come nel JSON, e `[n]` e\' la posizione in una lista.*')
A('')
A('| kind | Percorso | Testo |')
A('|---|---|---|')
for k, p, t in altri_di_modulo:
    A('| `%s` | `%s` | %s |' % (k, p, cella(t)))
A('')
A('---')
A('')
A('## 6 — I TESTI CHE NON SONO DI UN MODULO')
A('')
A('*Le sei chiavi condivise. **Nessuna ha `howItWorks` o `helpReminder`, e non e\'')
A('una dimenticanza:** non hanno una schermata propria da spiegare — `dialogoShared`')
A('serve ai tre Dialogue che la schermata ce l\'hanno, `condivisi` a tutti.*')
A('')
A('⚠️ **`erroreCaricamento` e\' il caso della regola 35:** i suoi testi vengono da')
A('qui, ma **se il file che non si carica e\' PROPRIO questo** non arrivano mai — per')
A('questo nel codice esiste `LOAD_ERROR_LAST_RESORT`, l\'unica frase scritta a mano')
A('che la regola 8 ammette. *Accorciare questi testi non tocca quella frase.*')
A('')
A('| Chiave | Percorso | Testo |')
A('|---|---|---|')
for k, p, t in condivisi:
    A('| `%s` | `%s` | %s |' % (k, p, cella(t)))
A('')

open('nuovi/inglese-it-istruzioni-moduli.md', 'w').write('\n'.join(O))
print('scritto nuovi/inglese-it-istruzioni-moduli.md —', len(O), 'righe')
print('spiegazioni', n_spieg, '| promemoria', n_prom, '| consigli', len(CONSIGLI),
      '| altri di modulo', len(altri_di_modulo), '| condivisi', len(condivisi))
