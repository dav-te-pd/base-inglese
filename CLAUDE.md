# base-inglese

App di pratica della pronuncia inglese con episodi personalizzabili e progressi salvati per utente. Tutto il progetto vive oggi in un unico file: `index.html` (HTML + CSS + JS inline, nessuna dipendenza esterna oltre ai Google Fonts).

## Regole permanenti

Queste regole valgono per ogni sessione futura su questo progetto, anche quando non vengono ripetute nella richiesta.

1. **Non rimuovere né modificare schermate o funzionalità esistenti**, a meno che non sia esplicitamente richiesto. Le modifiche sono additive per default.

2. **Nessun colore fisso nel codice dei componenti.** Usare sempre le variabili del sistema di temi già esistente (blocco `:root` e i selettori `[data-theme="..."]` in cima a `index.html`). Un elemento nuovo deve rispondere correttamente a tutti i temi selezionabili (Viaggio, Notte, Mediterraneo, Moderno, Natura), senza colori hardcoded nel markup o nelle regole dei singoli componenti.

3. **Nessun valore modificabile scritto fisso nel codice** — soglie numeriche, tempi, liste, percentuali. Tutto questo vive in `window.APP_CONFIG`, definito in cima a `index.html` (prima di CSS e resto dello script). Aggiungere un nuovo parametro tunabile significa aggiungere una chiave lì, non un numero sparso nel codice. `APP_CONFIG` è pensato come base dati per il futuro pannello Admin.

4. **Il contenuto didattico non va scritto dentro il codice dei componenti** — parole, frasi, traduzioni, spiegazioni. Va letto da file di dati esterni.
   - **Un unico file per episodio**, mai spezzettato in file separati per modulo. Nomenclatura ufficiale: `{livello}-episodio{numero}-{lingua}.json` (es. `data/a1-episodio1-inglese.json`). Dialogo e vocabolario sono condivisi tra più moduli (Speak Easy, Voice Coach, Quick Match, Scrittura, Dialogo Completo, Test) e devono restare un'unica fonte di verità: ogni modulo legge la propria sezione dallo stesso file episodio, non ne duplica il contenuto in un file suo.
   - **Le tabelle di personalizzazione** (nomi, città, paesi — oggi `APP_CONFIG.people` / `APP_CONFIG.places`) restano invece separate dai file episodio, e condivise tra tutti gli episodi e tutte le lingue. Un file episodio vi fa riferimento (es. "usa la tabella nomi-papà"), non le duplica al suo interno.

   *Stato attuale: `data/a1-episodio1-inglese.json` segue questa regola — un unico file per l'Episodio 1, con `dialogue` e `vocabulary` come sezioni distinte pronte per essere lette da moduli diversi. Solo il modulo Repeat Aloud legge oggi la sua sezione (`vocabulary`); `dialogue` è già presente nel file per quando verranno aggiunti gli altri moduli (Speak Easy, Voice Coach, Quick Match, Scrittura, Dialogo Completo, Test) — non creare un nuovo file dati per loro, farli leggere dalla sezione che serve in questo stesso file.*

5. **Mantenere la tipografia e lo stile del design system esistente**: Source Serif 4 (titoli/frase d'esercizio), Inter (testo/UI), IBM Plex Mono (badge/etichette); componenti `.btn-primary` / `.btn-secondary` / `.card` / `.panel` / `.badge` già definiti — riusarli invece di crearne varianti nuove per la stessa funzione.

6. **Pubblicare sempre il sito aggiornato dopo ogni modifica**, mantenendo intatto il resto:
   - commit + push sul branch di lavoro corrente;
   - ripubblicare l'artifact esistente passando lo stesso `url` (mai crearne uno nuovo per un aggiornamento).

## Riferimenti operativi

- Repo: `dav-te-pd/base-inglese`
- Artifact pubblicato: https://claude.ai/code/artifact/206c1b06-237e-4d72-a46d-4969dbd5e621
