# Genera `nuovi/inglese-it-messaggi-feedback.md` — il gemello markdown di
# `data/inglese/it/inglese-it-messaggi-feedback.json`.
#
# ⚠️ IL FILE NON SI SCRIVE A MANO, E IL MOTIVO E' UNA MISURA: sono 141
# stringhe, e una trascrizione a mano ne sbaglia qualcuna senza che niente lo
# dica. Qui il markdown NASCE dal JSON, e il verificatore in coda rimonta il
# JSON dal markdown e confronta: se tornano identici, la fonte e' fedele.
import json, collections

SRC = 'data/inglese/it/inglese-it-messaggi-feedback.json'
OUT = 'nuovi/inglese-it-messaggi-feedback.md'
SPAZIO = '\u2423'
d = json.load(open(SRC))

def cella(t):
    t = t.replace('|', '\\|').replace('\n', ' ')
    inizio = len(t) - len(t.lstrip(' '))
    fine = len(t) - len(t.rstrip(' '))
    return SPAZIO * inizio + t.strip(' ') + SPAZIO * fine

def foglie(v, p=''):
    """percorso puntato -> valore, per ogni foglia; le liste VUOTE si segnalano"""
    if isinstance(v, dict):
        for k, x in v.items():
            yield from foglie(x, (p + '.' if p else '') + k)
    elif isinstance(v, list):
        if not v:
            yield p, []                      # la lista vuota e' un dato
        for n, x in enumerate(v):
            yield from foglie(x, p + '[' + str(n) + ']')
    else:
        yield p, v

# ⚠️ CHI LEGGE OGNI FAMIGLIA SI MISURA DAL CODICE A OGNI GENERAZIONE, NON SI
# SCRIVE A MANO: un elenco di lettori scritto in un documento non cambia quando
# un lettore sparisce — ed e' esattamente cosi' che `speedRoundMessages` e'
# rimasto nel file per giorni dopo aver perso il suo (regola 38).
import glob, re as _re
def lettori(fam):
    # ⚠️ SI CONTANO LE RIGHE, NON LE OCCORRENZE: `data.X && data.X[k]` nomina la
    # famiglia due volte sulla STESSA riga, ed e' un lettore solo. *Senza il
    # dedup la colonna diceva `app/voice.js:1016, app/voice.js:1016`, cioe'
    # contava la forma della guardia invece dei lettori.*
    fuori = []
    for f in sorted(glob.glob('app/*.js')):
        for n_riga, testo in enumerate(open(f).read().split('\n'), 1):
            if fam not in testo: continue
            if testo.lstrip().startswith('//') or testo.lstrip().startswith('*'): continue
            fuori.append('`%s:%d`' % (f, n_riga))
    return fuori

tutte = [(fam, p, v) for fam in d for p, v in foglie(d[fam])]
messaggi = [(f, p, v) for f, p, v in tutte if isinstance(v, str) and p.endswith(']')]
titoli   = [(f, p, v) for f, p, v in tutte if isinstance(v, str) and not p.endswith(']') and f != 'percentageRule']
regola   = [(f, p, v) for f, p, v in tutte if f == 'percentageRule']
vuote    = [(f, p, v) for f, p, v in tutte if isinstance(v, list)]
n_str = sum(1 for _, _, v in tutte if isinstance(v, str))

O = []
A = O.append
A('# Messaggi di esito — inglese per italiani')
A('')
A('**Il gemello di `data/inglese/it/inglese-it-messaggi-feedback.json`.** Questo file')
A('**spiega e decide**, quel JSON **esegue** (CLAUDE.md regola 26). Sta accanto a')
A('`inglese-it-istruzioni-moduli.md` e non dentro di lui: *quello e\' il testo che dice')
A('**come si usa** un modulo, questo quello che **risponde a un esito** — e la regola 8')
A('li tiene in due file da prima che esistesse una fonte per nessuno dei due.*')
A('')
A('⚠️ **NESSUNO AVEVA MAI RILETTO QUESTI TESTI.** Trovato il 2026-09-26 censendo')
A('cio\' che lo studente legge: **%d stringhe** senza nessuna fonte markdown.' % n_str)
A('*E sono i testi che pesano di piu\': una spiegazione lunga si salta, un messaggio')
A('di esito sbagliato si crede.*')
A('')
A('⚠️ **QUASI TUTTO E\' UNA LISTA DI CINQUE VARIANTI, e non e\' un caso: l\'app ne')
A('pesca UNA.** Quindi lo studente che rifa\' lo stesso modulo non rilegge la stessa')
A('frase. *Ne segue una cosa da tenere a mente accorciando: **le cinque devono')
A('restare cinque cose diverse**, non cinque modi di dire la stessa. Ridurne il')
A('numero e\' una scelta legittima, ma va detta: da tre in giu\' si comincia a')
A('riconoscerle.*')
A('')
A('---')
A('')
A('## 1 — COME SI LEGGE QUESTO FILE')
A('')
A('**I titoli si cercano per TESTO ESATTO**: `##` + uno spazio + il testo della')
A('colonna, col trattone `—` (U+2014) e uno spazio prima e uno dopo.')
A('')
A('| Il testo dopo `## ` | Cosa ne nasce |')
A('|---|---|')
A('| `2 — LE FASCE` | `percentageRule` — la regola che decide QUALE gruppo di messaggi si pesca |')
A('| `3 — I MESSAGGI` | tutte le liste di varianti: **un messaggio per riga** |')
A('| `4 — I TITOLI` | i testi che non sono in una lista |')
A('| `5 — LE LISTE VUOTE` | le liste che esistono e non hanno righe |')
A('')
A('⚠️ **IL `## ` QUI SOPRA E\' STACCATO APPOSTA:** se questa tabella scrivesse i titoli')
A('per intero, una ricerca per sottostringa troverebbe **questa riga** invece della')
A('sezione vera. *`grep -c \'^## 3\'` deve dare **1**.*')
A('')
A('⚠️ **UNO SPAZIO AI BORDI DI UN TESTO SI SCRIVE `%s` (U+2423).** *Chi legge una' % SPAZIO)
A('cella di tabella le toglie gli spazi ai lati — deve — quindi uno spazio ai bordi')
A('sparirebbe **senza un errore**. Il segno si vede, lo spazio no.*')
A('')
A('⚠️ **IL `#` DI UNA RIGA E\' LA POSIZIONE NELLA LISTA, e conta**: e\' la chiave della')
A('mastery di nessuno, ma **e\' l\'ordine in cui l\'app le pesca**. Togliere una riga in')
A('mezzo rinumera quelle sotto, e va bene; cambiarne l\'ordine senza motivo no.')
A('')
A('### I numeri attesi')
A('')
A('**Si contano sul contenuto prima di usarlo (regola 29): se non tornano, fermarsi.**')
A('')
A('| Cosa | Quante |')
A('|---|---|')
A('| Famiglie di primo livello | **%d** |' % len(d))
A('| Messaggi in lista (sezione 3) | **%d** |' % len(messaggi))
A('| Titoli fuori lista (sezione 4) | **%d** |' % len(titoli))
A('| Voci della regola delle fasce (sezione 2) | **%d** |' % len(regola))
A('| Liste vuote (sezione 5) | **%d** |' % len(vuote))
A('| **Stringhe in tutto il JSON** | **%d** |' % n_str)
A('')
A('---')
A('')
A('## 2 — LE FASCE')
A('')
A('*`percentageRule`: la regola che, data la percentuale di risposte giuste, decide')
A('QUALE gruppo della sezione 3 si pesca. **Non e\' testo che lo studente legge** —')
A('e\' la logica scritta accanto ai testi che governa, e sta qui per questo.*')
A('')
A('⚠️ **`showMessage` e\' un BOOLEANO, non una parola:** va scritto `false` o `true`,')
A('e la colonna «tipo» lo dice. *Una cella che dicesse «no» diventerebbe la stringa')
A('`"no"`, che e\' vera.*')
A('')
A('| Percorso | Tipo | Valore |')
A('|---|---|---|')
for f, p, v in regola:
    tipo = 'testo' if isinstance(v, str) else ('booleano' if isinstance(v, bool) else type(v).__name__)
    val = cella(v) if isinstance(v, str) else json.dumps(v)
    # ⚠️ IL PERCORSO PORTA LA FAMIGLIA: la sezione parla di `percentageRule` e
    # sola, ma un percorso che non la nomina obbliga chi legge a saperlo da
    # fuori — cioe' a un dato che vive nel titolo invece che nella riga.
    A('| `%s.%s` | %s | %s |' % (f, p, tipo, val))
A('')
A('---')
A('')
A('## 3 — I MESSAGGI')
A('')
A('*Un messaggio per riga. **Famiglia** -> la chiave di primo livello · **gruppo** ->')
A('la fascia o il caso (`alto`/`medio`/`basso`, `riuscita`/`nonRiuscita`, ...) ·')
A('**#** -> la posizione nella lista.*')
A('')
A('**Quante ne ha ciascuna famiglia:**')
A('')
A('| Famiglia | Messaggi | Gruppi | Chi la legge nel codice |')
A('|---|---|---|---|')
per_fam = collections.Counter(f for f, _, _ in messaggi)
gruppi = collections.defaultdict(set)
for f, p, _ in messaggi:
    gruppi[f].add(p.split('[')[0])
for f in d:
    if per_fam[f]:
        L = lettori(f)
        A('| `%s` | **%d** | %s | %s |' % (f, per_fam[f], ', '.join('`%s`' % g for g in sorted(gruppi[f])),
           ', '.join(L) if L else '⚠️ **NESSUNO**'))
A('')
A('⚠️ **LA COLONNA «CHI LA LEGGE» E\' MISURATA DAL CODICE A OGNI GENERAZIONE, e')
A('non e\' un ornamento: dice se accorciare un messaggio si vede.** *Due famiglie')
A('hanno zero lettori, e per due ragioni diverse — vedi la sezione 6.*')
A('')
A('| Famiglia | Gruppo | # | Testo |')
A('|---|---|---|---|')
for f, p, v in messaggi:
    gruppo, resto = p.split('[')
    n = int(resto.rstrip(']')) + 1
    A('| `%s` | `%s` | %d | %s |' % (f, gruppo, n, cella(v)))
A('')
A('---')
A('')
A('## 4 — I TITOLI')
A('')
A('*I testi che non stanno in una lista: ce n\'e\' **uno solo per caso**, quindi si')
A('legge sempre quello.*')
A('')
A('| Famiglia | Percorso | Testo |')
A('|---|---|---|')
for f, p, v in titoli:
    A('| `%s` | `%s` | %s |' % (f, p, cella(v)))
A('')
A('---')
A('')
A('## 5 — LE LISTE VUOTE')
A('')
A('⚠️ **UNA LISTA VUOTA NON HA RIGHE NELLA SEZIONE 3, quindi senza questa sezione')
A('SPARIREBBE — e la differenza fra «lista vuota» e «chiave che non c\'e\'» la vede')
A('solo il codice che la legge.** *E\' la stessa forma dello spazio ai bordi: un dato')
A('che non si vede.*')
A('')
A('| Famiglia | Percorso |')
A('|---|---|')
for f, p, _ in vuote:
    A('| `%s` | `%s` |' % (f, p))
A('')
A('⚠️ **QUESTA VUOTA E\' VOLUTA, E C\'E\' UN TEST CHE LA DIFENDE.** Misurato il')
A('2026-09-26: `tests/test_batch11.js` asserisce `finali.tuttiVerdi.tip.length === 0`')
A('con la riga *«tuttiVerdi has NO tip (nessun consiglio)»*, e la riga accanto')
A('pretende che gli altri due il consiglio ce l\'abbiano. **Il disegno e\': un')
A('complimento SEMPRE, un consiglio SOLO quando c\'e\' qualcosa da rivedere.**')
A('')
A('⚠️ **QUINDI RIEMPIRLA FAREBBE DUE DANNI, e il primo e\' il piu\' piccolo:** la')
A('suite andrebbe **rossa**; e a chi ha fatto un episodio perfetto l\'app direbbe')
A('*«ripassa i moduli gialli»*, che e\' **falso**. *La lista vuota non e\' un buco:')
A('e\' il modo in cui «niente da consigliare» si scrive in una struttura che per')
A('tutti gli altri casi un consiglio ce l\'ha.*')
A('')
A('---')
A('')
A('## 6 — LE DUE FAMIGLIE CHE NESSUNO LEGGE')
A('')
A('⚠️ **QUARANTA DELLE %d STRINGHE DI QUESTO FILE OGGI NON LE VEDE NESSUNO,' % n_str)
A('e le due ragioni sono opposte.** *Misurato il 2026-09-26 cercando ogni famiglia')
A('in `app/*.js` e scartando i commenti.*')
A('')
A('| Famiglia | Stringhe | Perche\' nessuno la legge | Cosa farne |')
A('|---|---|---|---|')
A('| `speedRoundMessages` | **15** | ⚠️ **DATO MORTO.** Speed Match esiste e funziona, ma `app/speedmatch.js:328` pesca da **`moduleCompleteMessages`**. *Il nome e\' quello di prima della rinomina `speedRound` -> `speedMatch`: la famiglia porta il nome di un modulo che non si chiama piu\' cosi\', e il suo lettore non l\'ha mai avuta.* | **da decidere:** cancellarla, oppure ricollegarla se Speed Match deve avere messaggi SUOI invece di quelli generici |')
A('| `episodeFinalMessages` | **25** | **Aspetta un modulo che non esiste.** E\' il **Test di verifica finale**, che `CLAUDE.md` elenca fra i *«previsti ma non ancora costruiti»* — e il blocco del test che ne guarda i dati si chiama apposta **«Modulo Finale prep»**. | **si tiene:** e\' contenuto scritto in anticipo di proposito, non un residuo. *Accorciarla adesso e\' lavoro che nessuno puo\' collaudare* |')
A('')
A('*La differenza fra le due sta in una domanda sola: **c\'e\' stato un lettore che')
A('l\'ha perso, o non c\'e\' ancora stato?** La prima e\' un residuo, la seconda un')
A('anticipo — e si somigliano solo guardando il conteggio.*')
A('')
open(OUT, 'w').write('\n'.join(O))
print('scritto', OUT, '—', len(O), 'righe')
print('messaggi', len(messaggi), '| titoli', len(titoli), '| regola', len(regola),
      '| vuote', len(vuote), '| stringhe', n_str)

# ============================================================
# IL VERIFICATORE — rimonta il JSON DAL MARKDOWN e confronta.
#
# ⚠️ E' la parte che rende questo file una FONTE e non una copia: se il
# rimontaggio non torna identico, il markdown ha perso qualcosa — e nel primo
# giro dell'altro file ha perso davvero uno spazio finale, senza un errore.
# ============================================================
import re

md = open(OUT).read()

def scella(t):
    t = t.replace('\\|', '|')
    inizio = len(t) - len(t.lstrip(SPAZIO))
    fine = len(t) - len(t.rstrip(SPAZIO))
    return ' ' * inizio + t.strip(SPAZIO) + ' ' * fine

def righe_di(titolo):
    # si parte DOPO la tabella dei titoli della sezione 1
    i = md.index('## ' + titolo, md.index('## 1 —'))
    j = md.find('\n## ', i + 1)
    blocco = md[i:j if j != -1 else len(md)]
    fuori = [[c.strip() for c in r[1:-1].split(' | ')]
             for r in blocco.split('\n')
             if r.startswith('| ') and not r.startswith('|---')]
    return fuori

def metti(dest, percorso, valore):
    pezzi = re.findall(r'[^.\[\]]+|\[\d+\]', percorso)
    cur = dest
    for n, p in enumerate(pezzi):
        ultimo = n == len(pezzi) - 1
        if p.startswith('['):
            i = int(p[1:-1])
            while len(cur) <= i: cur.append(None)
            if ultimo: cur[i] = valore
            else:
                if cur[i] is None: cur[i] = [] if pezzi[n+1].startswith('[') else {}
                cur = cur[i]
        else:
            if ultimo: cur[p] = valore
            else:
                if p not in cur or cur[p] is None:
                    cur[p] = [] if pezzi[n+1].startswith('[') else {}
                cur = cur[p]

ric = {}
for perc, tipo, val in righe_di('2 — LE FASCE')[1:]:
    v = scella(val) if tipo == 'testo' else json.loads(val)
    intero = perc.strip('`')
    fam, resto = intero.split('.', 1)
    metti(ric.setdefault(fam, {}), resto, v)

# la sezione 3 ha DUE tabelle: la prima e' il conteggio, la seconda i messaggi
t3 = righe_di('3 — I MESSAGGI')
inizio_msg = next(i for i, r in enumerate(t3) if r[:4] == ['Famiglia', 'Gruppo', '#', 'Testo'])
for fam, gruppo, n, testo in t3[inizio_msg + 1:]:
    metti(ric.setdefault(fam.strip('`'), {}),
          gruppo.strip('`') + '[' + str(int(n) - 1) + ']', scella(testo))

for fam, perc, testo in righe_di('4 — I TITOLI')[1:]:
    metti(ric.setdefault(fam.strip('`'), {}), perc.strip('`'), scella(testo))

# ⚠️ La sezione 6 NON si rimonta: parla di chi legge le famiglie, non porta
# dati del JSON. Il verificatore la ignora di proposito, e se un giorno
# portasse dati l'andata e ritorno lo direbbe subito.
for fam, perc in righe_di('5 — LE LISTE VUOTE')[1:]:
    metti(ric.setdefault(fam.strip('`'), {}), perc.strip('`'), [])

a = json.dumps(ric, ensure_ascii=False, sort_keys=True)
b = json.dumps(d,   ensure_ascii=False, sort_keys=True)
print()
print('chiavi rimontate:', len(ric), 'contro', len(d))
if a == b:
    print('ANDATA E RITORNO: IDENTICO, carattere per carattere')
else:
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            print('DIVERSO al car. %d:\n  md   ...%s...\n  json ...%s...'
                  % (i, a[max(0,i-90):i+90], b[max(0,i-90):i+90]))
            break
    else:
        print('DIVERSO: lunghezze %d vs %d' % (len(a), len(b)))
