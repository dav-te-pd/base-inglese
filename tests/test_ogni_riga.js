// PROTEGGE: che OGNI riga di OGNI tabella di personalizzazione, in ogni edizione, produca frasi giuste in ogni testo dell'episodio che la usa — non solo il predefinito, che è l'unica riga che il resto della suite guida. Senza questo file, la nona riga di una tabella è coperta come una riga scritta a caso: «I am from Lugano, Italy» uscirebbe a schermo con la suite verde.
//
// È la voce «L'opzione che nessuno prova» di `docs/decisioni-stato.md`, con la
// sua condizione: «al prossimo giro delle tabelle». Il giro è stato quello del
// 2026-10-20 — partenze da otto a dieci, Firenze e Venezia — e chi guida il
// progetto ha chiesto la guardia nello stesso giorno. *Tenere una riga non la
// fa provare da nessun test: sono due cose diverse, la decisione e la
// copertura.*
//
// COME — sull'app vera, edizione per edizione (override `edizione` e
// ricarica, come `test_tutte_le_edizioni.js`), con la funzione vera
// (`BI.fillTemplate`) e gli slot veri (`BI.ensureEpisodeSlotFields`). Per ogni
// episodio, ogni slot, ogni riga che quello slot offre (le età solo il loro
// pezzo di tabella) e ogni testo del file episodio che nomina quello slot —
// battute, frasi, skill, nei due ruoli — si riempie il testo con QUELLA riga e
// gli altri slot ai predefiniti, e si chiede tre cose:
//   [A] la frase è COMPLETA: nessun `{{…}}` rimasto, nessun «undefined»;
//   [B] la frase dice LA RIGA SCELTA: il suo valore compare, nell'uno o
//       nell'altro ruolo (un'età è «fourteen» in inglese e «14» in italiano);
//   [C] ⚠️ IL CASO DA CUI NASCE: se le righe di quella tabella portano un
//       paese, la frase non nomina il paese di UN'ALTRA riga. È il difetto del
//       2026-09-24 — `Italy` scritto a mano in `gate`, giusto per sei città su
//       otto e falso per Lugano e Nizza.
//
// ⚠️ IL CASO PIÙ DIVERSO (regola 42): le righe NON predefinite delle
// partenze — quelle che portano un paese diverso da quello del predefinito.
// Sono le uniche dove una frase sbagliata e una giusta divergono: per le
// città italiane «Italy» scritto a mano sarebbe vero per caso. Il test le
// nomina (Lugano e Nizza nelle due edizioni per italiani, sette città in
// `italiano/es`) e le conta, così un elenco che le perdesse si vede.
//
// FALSIFICATO: `Italy` rimesso a mano in `gate` → «I am from Lugano, Italy.»
// e «I am from Nice, Italy.» rossi; una riga svuotata → [B] rosso.
//
// LIMITE: [B] non riconosce un nome predefinito scritto a mano ACCANTO al
// segnaposto («I am {{papa}}, Marco's son» resterebbe verde). E guarda solo i
// testi del file episodio, non quelli dei file condivisi, che i segnaposto non
// li usano.

'use strict';

const fs = require('fs');
const { launchBrowser, bloccaFontEsterni, APP_URL, repoPath, attendiPrimaSchermata } = require('./test-env');
const { mockBrowser } = require('./mock-browser');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

async function run() {
  const edizioni = JSON.parse(fs.readFileSync(repoPath('data', 'edizioni.json'), 'utf8')).edizioni;
  log('L\'elenco delle edizioni non e\' vuoto', edizioni.length > 0, String(edizioni.length));
  const browser = await launchBrowser();
  for (const ed of edizioni) {
    const nome = ed.lingua + '/' + ed.studente;
    const page = await browser.newPage();
    const errori = [];
    page.on('pageerror', (e) => errori.push(e.message));
    await bloccaFontEsterni(page);
    await page.addInitScript(mockBrowser({ fineVoceMs: 10, nomeVoce: 'F' }));
    await page.goto(APP_URL);
    await page.evaluate((e) => {
      localStorage.clear();
      localStorage.setItem('baseinglese:configOverrides', JSON.stringify({ edizione: { lingua: e.lingua, studente: e.studente } }));
    }, ed);
    await page.reload();
    await attendiPrimaSchermata(page);

    const esito = await page.evaluate(async () => {
      const BI = window.BI;
      const guasti = [];
      let frasi = 0, righe = 0;
      const righeConPaeseDiverso = [];
      // Una parola intera, anche con lettere accentate: «Italia» non deve
      // trovarsi dentro «italiano».
      // ⚠️ Una parola VUOTA non si trova in nessuna frase: senza questa riga
      // una riga col valore vuoto passerebbe [B], perche' la stringa vuota
      // «compare» ovunque.
      const nomina = (testo, parola) => {
        if (!String(parola || '').trim()) return false;
        const esc = parola.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(?<!\\p{L})' + esc + '(?!\\p{L})', 'u').test(testo);
      };
      for (const id of Object.keys(BI.EPISODES)) {
        const ep = BI.EPISODES[id];
        const dati = await BI.loadEpisodeData(ep);
        await BI.ensureEpisodeSlotFields(ep);
        // `fillTemplate` legge `placeholderMap` dall'episodio: lo stesso
        // oggetto che `applyEpisodeDialogue` prepara prima di ogni lettore.
        const epTesti = { id: ep.id, slotFields: ep.slotFields, placeholderMap: dati.placeholderMap || {} };
        const testi = [];
        (function giro(v, chiave, percorso) {
          if (typeof v === 'string') {
            if (v.indexOf('{{') !== -1) testi.push({ testo: v, ruolo: chiave === 'target' ? 'target' : 'native', percorso });
          } else if (Array.isArray(v)) v.forEach((x, i) => giro(x, chiave, percorso + '[' + i + ']'));
          else if (v && typeof v === 'object') Object.keys(v).forEach((k) => giro(v[k], k, percorso + '.' + k));
        })(dati.levels, '', 'levels');
        for (const campo of ep.slotFields) {
          if (campo.type !== 'select') continue;
          const nomi = Object.keys(epTesti.placeholderMap).filter((n) => epTesti.placeholderMap[n] === campo.key);
          const suoi = testi.filter((t) => nomi.some((n) => t.testo.indexOf('{{' + n) !== -1));
          const opzioni = BI.slotOptions(campo);
          const paesi = opzioni.filter((o) => o.paese).map((o) => o.paese);
          for (const o of opzioni) {
            righe++;
            const altrui = [];
            if (o.paese) {
              paesi.forEach((p) => [p.target, p.native].forEach((x) => {
                if (x && x !== o.paese.target && x !== o.paese.native && altrui.indexOf(x) === -1) altrui.push(x);
              }));
              const def = opzioni.find((x) => x.value === campo.def);
              if (def && def.paese && def.paese.target !== o.paese.target) righeConPaeseDiverso.push(id + ':' + o.value);
            }
            for (const t of suoi) {
              frasi++;
              const valori = {}; valori[campo.key] = o.value;
              const f = BI.fillTemplate(t.testo, epTesti, valori, t.ruolo);
              const dove = id + ' ' + t.percorso + ' [' + campo.key + '=' + o.value + ']';
              if (f.indexOf('{{') !== -1 || /undefined/.test(f)) guasti.push({ prova: 'A', dove, f });
              if (!(nomina(f, String(o.target)) || nomina(f, String(o.native)))) guasti.push({ prova: 'B', dove, f });
              const sbagliati = altrui.filter((p) => nomina(f, p));
              if (sbagliati.length) guasti.push({ prova: 'C', dove, f, sbagliati });
            }
          }
        }
      }
      return { guasti, frasi, righe, righeConPaeseDiverso };
    });

    const di = (p) => esito.guasti.filter((g) => g.prova === p);
    const mostra = (p) => di(p).slice(0, 3).map((g) => g.dove + ' → «' + g.f + '»' + (g.sbagliati ? ' (nomina ' + g.sbagliati.join(', ') + ')' : '')).join(' | ');
    log(nome + ': si sono costruite frasi su righe vere (' + esito.righe + ' righe, ' + esito.frasi + ' frasi)',
      esito.righe > 0 && esito.frasi > 0, JSON.stringify({ righe: esito.righe, frasi: esito.frasi }));
    log('[A] ' + nome + ': ogni frase e\' completa — niente {{…}}, niente «undefined»', di('A').length === 0, di('A').length + ': ' + mostra('A'));
    log('[B] ' + nome + ': ogni frase dice la riga scelta', di('B').length === 0, di('B').length + ': ' + mostra('B'));
    log('[C] ⚠️ ' + nome + ': nessuna frase nomina il paese di un\'altra riga', di('C').length === 0, di('C').length + ': ' + mostra('C'));
    log('[C] ' + nome + ': ...e le righe col paese diverso dal predefinito sono state costruite davvero (' +
      esito.righeConPaeseDiverso.join(', ') + ')', esito.righeConPaeseDiverso.length > 0, JSON.stringify(esito.righeConPaeseDiverso));
    log(nome + ': nessun errore JS', errori.length === 0, errori.join(' | '));
    await page.close();
  }
  await browser.close();
  console.log('\n=== OGNI RIGA SUMMARY: ' + passed + '/' + (passed + failed) + ' passed ===');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
