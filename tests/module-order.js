// L'ordine dei passi dell'episodio, letto da index.html.
//
// Perché esiste: i test devono aprire un modulo, e la mappa non lo lascia
// aprire finché i passi precedenti non risultano completati. Ogni test si
// scriveva quindi a mano la lista dei moduli da segnare come fatti — una
// fotografia dell'ordine del giorno in cui il test era stato scritto. Al
// primo riordino vero (da 14 a 22 passi) sono cadute quasi tutte insieme,
// e nessuna diceva perché: solo "timeout aspettando un modulo".
//
// Qui la lista si calcola dalla sequenza vera dell'episodio 1
// (sequences['narrativo-standard'] del file dell'edizione), l'unico posto che decide
// l'ordine. Un riordino futuro non tocca più nessun test.
//
// La sequenza si cerca per NOME e non "la prima che c'è": quando ne
// esisteranno tre — narrativo-standard, breve-cd, grammaticale — prendere la
// prima vorrebbe dire cambiare in silenzio cosa provano tutti i test il
// giorno in cui qualcuno ne aggiunge una in cima.
//
// La lettura è da disco e non dalla pagina: così la lista è disponibile
// PRIMA di aprire il browser, dove i test ne hanno bisogno, e non serve
// cambiare la firma di nessuna funzione.

const fs = require('fs');
const { repoPath, strutturaCorso, fileEdizione } = require('./test-env');

// ⚠️ LEGGE IL FILE DELL'EDIZIONE, NON PIU' UN SORGENTE. Dal 2026-09-20
// (passo 1.11b), ed e' la TERZA volta che questa funzione cambia indirizzo:
// index.html → app/config.js → data/{lingua}/{studente}/struttura-corso.json.
//
// **Le prime due volte era la famiglia ⓪-sexies** — leggere un dato dal
// sorgente dell'app perche' oggi e' li' per costruzione. Adesso non lo e'
// piu': la sequenza e' un DATO, in un file di dati, e si legge con
// `JSON.parse` invece che con un'espressione regolare su del codice.
//
// *Il guadagno non e' l'eleganza: una regex su un sorgente dice «non
// trovato» sia quando il dato e' sparito sia quando qualcuno ha scritto
// `module:` con due spazi. `JSON.parse` distingue le due cose.*
function readOrder() {
  const seq = strutturaCorso().sequences['narrativo-standard'];
  if (!Array.isArray(seq)) throw new Error("La sequenza 'narrativo-standard' non e' in " + fileEdizione('struttura-corso.json'));
  if (!seq.length) throw new Error("La sequenza 'narrativo-standard' e' vuota");
  return seq.map(p => ({ module: p.module, grade: p.grade, off: !!p.off }));
}

// Gli id dei passi, nell'ordine della mappa. Stessa regola di moduleStepId()
// in index.html: la prima apparizione di un modulo tiene l'id nudo, le
// successive prendono un suffisso.
function stepIds() {
  const seen = {};
  return readOrder().filter(p => !p.off).map(p => {
    const id = seen[p.module] ? p.module + '-' + (seen[p.module] + 1) : p.module;
    seen[p.module] = (seen[p.module] || 0) + 1;
    return id;
  });
}

// I passi che precedono un modulo: quello che un test deve segnare come
// completato per poterlo aprire. Con un id di passo ('repeatAloud-2') vale
// quella apparizione; con un id di modulo ('voiceCoach') vale la prima.
function stepsBefore(moduleId) {
  const ids = stepIds();
  const i = ids.indexOf(moduleId);
  if (i === -1) throw new Error('Passo non presente nell\'ordine: ' + moduleId);
  return ids.slice(0, i);
}

// Il grado su cui lavora un passo — la lettera della sua coppia. I test che
// iniettano contenuto devono metterlo nel grado che il modulo legge davvero,
// non in quello che leggeva quando il test è stato scritto.
function gradeOf(moduleId) {
  const seen = {};
  const pairs = readOrder().filter(p => !p.off);
  for (const p of pairs) {
    const id = seen[p.module] ? p.module + '-' + (seen[p.module] + 1) : p.module;
    seen[p.module] = (seen[p.module] || 0) + 1;
    if (id === moduleId) return p.grade;
  }
  throw new Error('Passo non presente nell\'ordine: ' + moduleId);
}

// Tutti i passi completati — per i test che vogliono solo una mappa aperta,
// senza un modulo bersaglio.
function allSteps() {
  return stepIds();
}


// ---------------------------------------------------------------------------
// Le tabelle di personalizzazione e il riempimento dei segnaposto.
//
// Perché servono qui: i gradi C e D contengono {{papa}}, {{partenza}}, ... e
// l'app li sostituisce prima di mostrare il testo. Un test che confronta
// quello che vede a schermo con quello che c'è nel file deve fare la stessa
// sostituzione, altrimenti non trova mai niente — o, peggio, trova la voce
// sbagliata quando due modelli si assomigliano ("I'm {{figliaNome}}." accetta
// anche "I'm 16 years old.").
//
// Le regole sono le stesse di resolveSlotValue() in index.html: il nome di
// una persona non si traduce mai (tabella people.*), un toponimo sì.

// ⚠️ LEGGEVA LE TABELLE DAL TESTO DI index.html, e il 2026-09-15 ha smesso di
// funzionare senza che nessuno l'avesse toccata.
//
// Il magazzino (people, places) e' uscito da APP_CONFIG e vive in
// data/inglese/it/inglese-it-tabelle-personalizzazione.json: qui c'era un parsing a
// espressioni regolari del sorgente dell'app, che da quel giorno non trova
// piu' niente e torna `null` — cioe' i segnaposto restano non sostituiti e il
// vocabolario atteso diventa "I am {{papa}}." contro "I am Marco." a schermo.
//
// E' la famiglia ⓪-quinquies vista da dentro i test: NON un lettore che
// nomina il dato, ma uno che ce l'aveva PER COSTRUZIONE perche' stava nello
// stesso file. La ricerca fatta prima del passo aveva trovato la riga qui
// sotto (`slot.table.indexOf('people.')`) e l'aveva classificata come «legge
// lo slot, non le tabelle»: vero per quella riga, falso per la funzione
// intorno. Guardare la riga trovata invece della funzione che la contiene e'
// il modo in cui si perde un lettore avendolo davanti.
//
// Adesso legge il file, che e' anche la forma giusta: un JSON si parsa, non si
// cerca con una regex.
let magazzinoCache = null;
function magazzino() {
  if (!magazzinoCache) {
    magazzinoCache = JSON.parse(fs.readFileSync(
      fileEdizione('tabelle-personalizzazione.json'), 'utf8'));
  }
  return magazzinoCache;
}

function readTable(section, name) {
  const radice = magazzino()[section];
  return (radice && radice[name]) || null;
}

// I valori predefiniti di ogni slot, nelle due lingue: quelli che vede un
// utente di test, che non personalizza niente.
function slotValues(episodePath) {
  const episode = JSON.parse(fs.readFileSync(repoPath.apply(null, (episodePath || ['data', 'inglese', 'it', 'inglese-it-gate.json'])), 'utf8'));
  const values = {};
  (episode.personalizationTablesUsed || []).forEach(slot => {
    if (slot.table.indexOf('episode.ageOptions.') === 0) {
      values[slot.key] = { it: String(slot.default), en: String(slot.default) };
      return;
    }
    const [section, name] = slot.table.split('.');
    const rows = readTable(section, name) || [];
    const picked = rows.find(r => r.value === slot.default) || rows[0];
    if (!picked) return;
    // ⚠️ LO DICE LA RIGA, NON IL NOME DELLA TABELLA — allineato il 2026-09-24.
    //
    // Qui c'era `isPerson = slot.table.indexOf('people.') === 0`: la deduzione
    // che il passo 1.8 ha tolto dall'APP il 2026-09-20, sostituendola con
    // `traducibile` dichiarato per riga. Era rimasta qui, e **dava la stessa
    // risposta su tutte le righe di oggi** — quindi non produceva nessun rosso.
    //
    // ⚠️ Ed e' precisamente per questo che andava chiusa: il giorno in cui una
    // riga smentisce la deduzione — un cognome che si traduce, una citta' che
    // non si traduce, le due forme che il passo 1.8 esiste per rendere
    // possibili — **non ci sarebbe stato un rosso ad avvisare: ci sarebbe
    // stata una riga tradotta male** dentro il vocabolario atteso.
    //
    // Leggere `picked.traducibile` non rompe l'indipendenza dall'app: si legge
    // il DATO, non una funzione dell'app. Un atteso che chiedesse all'app di
    // confermare se stessa sarebbe vero per costruzione (regola 44).
    values[slot.key] = {
      it: picked.it,
      en: picked.traducibile === false ? picked.it : picked.en
    };
    // ⚠️ I SOTTO-CAMPI DELLA RIGA — passo 1.8-bis ②, 2026-09-24.
    //
    // Una riga puo' portare piu' di un valore: una citta' di partenza porta
    // anche il suo paese, e la battuta li vuole tutti e due. Senza questa
    // riga il vocabolario atteso resta «I am from Mondovi, {{partenza.paese:en}}»
    // mentre l'app mostra «I am from Mondovi, Italy», e il driver del quiz non
    // ritrova piu' la domanda: e' esattamente il rosso del 2026-09-24.
    //
    // Il sotto-campo si copia per intero, senza chiedergli la traducibilita':
    // un paese e' un toponimo e si traduce sempre.
    Object.keys(picked).forEach(function (k) {
      if (picked[k] && typeof picked[k] === 'object' && picked[k].it !== undefined) {
        values[slot.key][k] = { it: picked[k].it, en: picked[k].en };
      }
    });
  });
  return values;
}

// Il testo di una voce come lo mostra l'app: stessa sostituzione di
// fillTemplate(), sui valori predefiniti.
// ⚠️ LA REGEX CONOSCE IL PUNTO DAL 2026-09-24 (passo 1.8-bis ②), come quella
// di `fillTemplate`: `{{chiave}}` e `{{chiave.campo}}`. `\w` non contiene il
// punto, quindi prima `{{partenza.paese:en}}` restava intero nel testo atteso
// e il confronto col testo vero non tornava mai.
//
// Un campo che la riga non ha torna la riga, non `undefined` — la stessa
// scelta di `resolveSlotValue`, e per la stessa ragione: le tabelle non sono
// tutte uguali.
function itemText(item, lang, values) {
  const v = values || slotValues();
  const raw = lang === 'en' ? item.english : item.italian;
  return String(raw).replace(/\{\{(\w+)(?:\.(\w+))?(?::(\w+))?\}\}/g, (whole, key, campo, forcedLang) => {
    const box = v[key];
    if (!box) return whole;
    const parte = (campo && box[campo]) ? box[campo] : box;
    return parte[forcedLang || lang];
  });
}

module.exports = { readOrder, stepIds, stepsBefore, gradeOf, allSteps, slotValues, itemText };
