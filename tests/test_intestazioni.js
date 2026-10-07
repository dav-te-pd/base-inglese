// PROTEGGE: che il trascrittore si fermi quando due colonne di una tabella dei gradi o di una tabella di personalizzazione sono SCAMBIATE — e non solo quando ne manca o ne avanza una. Senza questo file, `en ↔ it` scambiate passano: stesso conto di colonne, e tutto l'episodio esce rovesciato, `target` e `native` invertiti, senza nessun errore.
//
// Fino al 2026-10-07 il trascrittore controllava il CONTO (`COLONNE_GRADI`,
// `COLONNE_TABELLE`) e buttava via l'intestazione. Dal 2026-10-08, deciso da
// chi guida il progetto, le intestazioni attese sono una costante
// (`INTESTAZIONI_GRADI`, `INTESTAZIONI_TABELLE`) e il conto e' la loro
// lunghezza. Una cella sola e' libera: la lingua insegnata (`en`, `es`), che
// dev'essere DIVERSA da quella dello studente — che si chiama come la cartella.
//
// COME — i testi veri, letti dal disco e alterati in memoria; i file non si
// toccano:
//   [A] tutti i file veri passano: le due edizioni, i quattro episodi, e i due
//       MODELLI di `nuovi/` — quello dell'episodio trascritto intero, quello
//       delle tabelle tabella per tabella (intero non si trascrive: il suo
//       indice elenca una tabella che non c'e');
//   [B] i gradi: `en ↔ it` scambiate in D e in C, due colonne fisse scambiate
//       in B e in A, una colonna in piu' in fondo, e la lingua insegnata
//       uguale a quella dello studente — tutti fermano e dicono dove;
//   [C] le tabelle di personalizzazione: `it ↔ en` scambiate in una tabella a
//       quattro colonne, i due `paese` scambiati in `places.departures`, una
//       tabella di cinque colonne;
//   [D] ⚠️ IL CASO PIU' DIVERSO (regola 42): `places.departures`, l'unica
//       tabella dove la lingua insegnata compare DUE volte (`en` e
//       `paese en`). Li' non basta che la cella sia diversa da `it`: deve
//       essere la STESSA nelle due colonne. Un `paese es` in una tabella `en`
//       ferma. E lo spagnolo, dove la cella libera vale `es`: gli scambi
//       fermano anche li'.
//
// ⚠️ LIMITE: la cella della lingua insegnata e' libera di proposito. Un `fr`
// al posto di `en` in un corso d'inglese passa: dopo il controllo
// l'intestazione si butta, e quel nome non arriva a nessuno.

'use strict';

const fs = require('fs');
const { repoPath } = require('./test-env');
const T = require('./tools/trascrivi.js');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}
const sollevato = function (f) { try { f(); return null; } catch (e) { return e.message; } };
const leggi = (p) => fs.readFileSync(repoPath(p), 'utf8');

// Applica `f` alle celle di ogni riga di tabella (intestazione, separatore e
// dati) della sezione che comincia con `titolo`, fino al titolo successivo.
function ritocca(testo, titolo, f) {
  const i = testo.indexOf(titolo);
  if (i === -1) throw new Error('titolo non trovato nel testo vero: ' + titolo);
  const prima = testo.slice(0, i + titolo.length);
  const righe = testo.slice(i + titolo.length).split('\n');
  let finita = false;
  const dopo = righe.map((r, n) => {
    if (n > 0 && r.trim().startsWith('#')) finita = true;
    if (finita || !r.trim().startsWith('|')) return r;
    const celle = r.trim().split('|').slice(1, -1);
    return '|' + f(celle).join('|') + '|';
  });
  return prima + dopo.join('\n');
}
const scambia = (testo, titolo, a, b) => ritocca(testo, titolo, (c) => { const x = c.slice(); [x[a], x[b]] = [x[b], x[a]]; return x; });
const inPiu = (testo, titolo) => ritocca(testo, titolo, (c) => c.concat([/^\s*-+\s*$/.test(c[0]) ? '---' : ' x ']));
const rinomina = (testo, titolo, n, nuovo) => {
  let fatto = false;
  return ritocca(testo, titolo, (c) => {
    if (fatto) return c;
    fatto = true;
    const x = c.slice(); x[n] = ' ' + nuovo + ' '; return x;
  });
};

const ING = { lingua: 'inglese', studente: 'it', pref: 'inglese-it-' };
const SPA = { lingua: 'spagnolo', studente: 'it', pref: 'spagnolo-it-' };

function run() {
  // ── [A] I file veri passano ──
  const eds = T.edizioni();
  log('[A] Le edizioni ci sono (il test non guarda il vuoto)', eds.length >= 2, String(eds.length));
  eds.forEach((ed) => {
    const s = T.struttura(ed);
    log('[A] ' + ed.pref + 'tabelle-personalizzazione passa', sollevato(() => T.tabelle(ed)) === null, String(sollevato(() => T.tabelle(ed))));
    Object.keys(s.episodes).forEach((id) => {
      const m = sollevato(() => T.episodio(ed, id, s.gradeNames));
      log('[A] ' + ed.pref + id + ' passa', m === null, String(m));
    });
  });
  const gradeNames = T.struttura(ING).gradeNames;
  const modEp = leggi('nuovi/inglese-it-EPISODIO-VUOTO.md');
  const modTab = leggi('nuovi/inglese-it-tabelle-personalizzazione-VUOTO.md');
  log('[A] Il modello dell\'episodio passa', sollevato(() => T.episodio(ING, 'modello', gradeNames, modEp)) === null,
    String(sollevato(() => T.episodio(ING, 'modello', gradeNames, modEp))));
  // ⚠️ IL MODELLO DELLE TABELLE NON SI TRASCRIVE INTERO, e non per questo
  // controllo: il suo indice elenca `people.esempio`, che come sezione non
  // c'e' (misurato il 2026-10-08). Quindi qui si guardano le sue tabelle una
  // per una, con la stessa funzione che usa `tabelle()`.
  const sezioni = (modTab.match(/^### `[^`]+`/gm) || []);
  log('[A] Il modello delle tabelle ha delle tabelle da guardare', sezioni.length > 0, String(sezioni.length));
  sezioni.forEach((tit) => {
    const m = sollevato(() => {
      const r = T.tabellaSotto(modTab, tit, true);
      const attese = T.INTESTAZIONI_TABELLE.find((a) => a.length === r.testa.length);
      if (!attese) throw new Error(r.testa.length + ' colonne');
      T.colonneConIntestazione(r, attese, tit, 'it');
    });
    log('[A] Il modello delle tabelle, ' + tit.replace('### ', '') + ': intestazione attesa', m === null, String(m));
  });

  // ── [B] I gradi ──
  const gate = leggi('docs/inglese/it/inglese-it-gate.md');
  const ferma = (nome, ed, testo, attesi) => {
    const m = sollevato(() => T.episodio(ed, 'gate', gradeNames, testo));
    log(nome, !!m && attesi.every((a) => m.indexOf(a) !== -1), String(m));
  };
  ferma('[B] Grado D, `en ↔ it` scambiate: ferma, e nomina il grado e la colonna', ING,
    scambia(gate, '### Grado D — le battute', 3, 4), ['grado D', 'colonna 4', 'scambiate']);
  ferma('[B] Grado C, `en ↔ it` scambiate: ferma', ING,
    scambia(gate, '### Grado C — le frasi', 1, 2), ['grado C', 'colonna 2']);
  ferma('[B] Grado B, `pronuncia ↔ categoria` scambiate: ferma', ING,
    scambia(gate, '### Grado B — le espressioni', 3, 4), ['grado B', 'colonna 4', '«pronuncia»']);
  ferma('[B] Grado A, `it ↔ pronuncia` scambiate: ferma', ING,
    scambia(gate, '### Grado A — le parole', 2, 3), ['grado A', 'colonna 3']);
  ferma('[B] Grado C con una colonna in piu\' in fondo: ferma sul conto', ING,
    inPiu(gate, '### Grado C — le frasi'), ['grado C', '6 colonne invece di 5']);
  ferma('[B] Grado C con la lingua insegnata chiamata come lo studente (`it | it`): ferma', ING,
    rinomina(gate, '### Grado C — le frasi', 1, 'it'), ['grado C', 'colonna 2', 'diversa da «it»']);

  // ── [C] Le tabelle di personalizzazione ──
  const tab = leggi('docs/inglese/it/inglese-it-tabelle-personalizzazione.md');
  const fermaT = (nome, ed, testo, attesi) => {
    const m = sollevato(() => T.tabelle(ed, testo));
    log(nome, !!m && attesi.every((a) => m.indexOf(a) !== -1), String(m));
  };
  fermaT('[C] `people.papa`, `it ↔ en` scambiate: ferma e nomina la tabella', ING,
    scambia(tab, '### `people.papa`', 1, 2), ['people.papa', 'colonna 2']);
  fermaT('[C] `places.departures`, i due `paese` scambiati: ferma', ING,
    scambia(tab, '### `places.departures`', 3, 4), ['places.departures', 'colonna 4']);
  fermaT('[C] Una tabella di cinque colonne: ferma e dice quali sono ammesse', ING,
    inPiu(tab, '### `people.mamma`'), ['people.mamma', '5 colonne', '4 (', '6 (']);

  // ── [D] I casi piu' diversi ──
  fermaT('[D] `places.departures` con `paese es` accanto a `en`: la lingua insegnata dev\'essere la stessa nelle due colonne', ING,
    rinomina(tab, '### `places.departures`', 4, 'paese es'), ['places.departures', 'colonna 5', '«paese en»']);
  const gateEs = leggi('docs/spagnolo/it/spagnolo-it-gate.md');
  const mEs = sollevato(() => T.episodio(SPA, 'gate', T.struttura(SPA).gradeNames, scambia(gateEs, '### Grado C — le frasi', 1, 2)));
  log('[D] Spagnolo, dove la cella libera vale `es`: `es ↔ it` scambiate fermano anche li\'',
    !!mEs && mEs.indexOf('grado C') !== -1, String(mEs));
  const tabEs = leggi('docs/spagnolo/it/spagnolo-it-tabelle-personalizzazione.md');
  fermaT('[D] Spagnolo, `places.departures` coi due `paese` scambiati: ferma', SPA,
    scambia(tabEs, '### `places.departures`', 3, 4), ['places.departures']);

  console.log('\n=== INTESTAZIONI SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

try { run(); } catch (e) { console.error(e); process.exit(1); }
