# Suite di regressione

25 file Playwright, uno per giro di lavoro/argomento (`test_batchN.js`) più
alcuni per aree specifiche (`test_dialogo_extra.js`, `test_new_features.js`,
`test_voicecoach.js`). Insieme costituiscono la suite di regressione completa
citata da CLAUDE.md (regola 15): quando una modifica tocca codice condiviso
va lanciata tutta, quando resta dentro un modulo bastano i file di quel
modulo.

## Come lanciarla

Serve `index.html` raggiungibile su `http://localhost:8955/index.html`:

```bash
# dalla cartella principale del repository
python3 -m http.server 8955
```

poi, in un altro terminale:

```bash
cd tests
./run_full_regression.sh
```

Ogni file produce anche il proprio `test_batchN.result.txt` con l'output
completo. Per lanciare un solo file: `node tests/test_batchN.js`.

Richiede Playwright installato (Node in grado di risolvere
`require('playwright')`) e un Chromium che Playwright possa avviare.

## Sottocartelle

Non fanno parte della suite lanciata da `run_full_regression.sh` — vedi il
README di ciascuna per cosa sono e perché sono state tenute:

- `tools/` — script di verifica visiva (screenshot).
- `debug/` — script diagnostici per bug ormai risolti, tenuti come riferimento.
- `legacy/` — test precedenti alla numerazione `test_batchN.js`, probabilmente superati.
