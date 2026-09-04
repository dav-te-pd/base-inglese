# Strumenti di verifica visiva

Script Playwright che aprono l'app e salvano screenshot — usati durante il
lavoro su temi/layout/config panel, non fanno asserzioni (non sono test in
senso stretto). Utili come punto di partenza per una verifica visiva futura
(nuovo tema, riordino della mappa, revisione di design), da adattare al
bisogno del momento piuttosto che da lanciare così come sono.

## `apri-modulo.js`

Apre un modulo come lo vedrebbe uno studente arrivato fin lì (i passi
precedenti vengono segnati completati da soli) e ne stampa lo stato:
titolo e categoria mostrati, elementi che escono dai bordi, segnaposto
rimasti grezzi, errori JS. Con `--shot=nome.png` salva anche lo screenshot.

```
node tests/tools/apri-modulo.js whyWeSayIt
node tests/tools/apri-modulo.js whyWeSayIt --larghezza=360
node tests/tools/apri-modulo.js dialogoContinuo --shot=dialogo.png
```

Senza argomenti elenca i passi disponibili nell'ordine della mappa.

Perché esiste: guardare la schermata trova cose che nessun test vede. In un
solo giro ha fatto emergere un badge fermo al nome di un modulo che non
esiste più, un sottotitolo sbagliato, e — con `--larghezza=360`, cioè la
larghezza di gran parte degli Android — un pulsante che usciva dallo
schermo. Prima si riscriveva lo stesso script usa-e-getta ogni volta.
