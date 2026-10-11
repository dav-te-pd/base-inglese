// PROTEGGE: che OGNI file di un'edizione porti il prefisso `{lingua}-{studente}-`,
// e che quel prefisso sia quello DELLA SUA CARTELLA.
//
// COSA SI PERDE SENZA QUESTO FILE, ed è il motivo per cui nasce adesso e non
// dopo: fra poco `docs/inglese/it/` e `data/inglese/it/` verranno COPIATE per
// fare `francese/it/`. In quella copia i nomi restano `inglese-...` finché
// qualcuno non li rinomina uno per uno — e chi lo fa a mano ne dimentica uno.
//
// ⚠️ **UN PREFISSO SBAGLIATO È PEGGIO DI UN PREFISSO ASSENTE.** Senza prefisso
// un file non dice niente; con il prefisso sbagliato **dice una bugia**, e la
// dice proprio nel momento in cui serve — quando il file è uscito dal
// repository e il percorso si è perso.
//
// ⚠️ E DAL 2026-10-11 ([D]) CHE OGNI EDIZIONE ABBIA IL SUO FILE DI MIGRAZIONI,
// con `slot` come oggetto: l'app lo chiede sempre, e la sua assenza la
// scopriva lo studente davanti alla schermata d'errore.
//
// COSA NON PROTEGGE, dichiarato (regola 32): non verifica che il CONTENUTO sia
// dell'edizione giusta. Un file `francese-it-gate.json` pieno di inglese passa
// questo test. Qui si guarda il nome, che è la cosa che si sbaglia copiando.
//
// COME MISURA, e perché non leggendo il disco dentro l'asserzione: il lavoro
// vero lo fa `fileFuoriConvenzione(percorsi)`, una funzione pura che prende un
// elenco e restituisce chi non rispetta la convenzione. Così si può
// **falsificare con un elenco finto** — senza sporcare il repository per
// vedere il rosso — e poi passarle i percorsi veri.

const fs = require('fs');
const path = require('path');
const { repoPath } = require('./test-env');

let passed = 0, failed = 0;
function log(nome, ok, extra) {
  if (ok) { passed++; console.log('OK   - ' + nome); }
  else { failed++; console.log('FAIL - ' + nome + (extra ? '  -> ' + extra : '')); }
}

// Le due radici che contengono le edizioni. Ogni cartella sotto di loro è una
// lingua, e ogni cartella sotto quella è uno studente: `{radice}/{L}/{S}/`.
const RADICI = ['data', 'docs'];

// ⚠️ LA FUNZIONE È PURA, E IL PERCHÉ È NEL COMMENTO IN TESTA: prende un elenco
// di percorsi e restituisce chi sgarra, senza toccare il disco. Il test la
// falsifica con un elenco finto e poi le dà quello vero.
// ⚠️ `condivisi` NON È UNA LINGUA, ED È L'UNICA ECCEZIONE — 2026-09-28, passo B.
//
// `data/condivisi/{lingua-studente}/` tiene i testi dell'interfaccia, che **non
// dipendono dalla lingua che si insegna ma da quella dello STUDENTE**: «tocca
// il microfono per registrare» è identico in `inglese/it` e in `spagnolo/it`.
// *Copiarli per edizione vorrebbe dire duplicare ogni volta tutte le loro
// stringhe (il conto, con la data, sta nella regola 8 di CLAUDE.md).*
//
// ⚠️ **Quindi lì il prefisso atteso è UNA lingua sola, non la coppia**:
// `it-istruzioni-moduli.json`, non `condivisi-it-istruzioni-moduli.json`.
// *Il nome tiene comunque la lingua, perché un file esce dal repository e lì la
// cartella si perde — la stessa ragione della regola 4.*
//
// **È un nome riservato, e va scritto qui e non dedotto:** una cartella che si
// chiamasse `condivisi` come lingua vera sarebbe un'edizione «condiviso per
// italiani», che non esiste e non esisterà.
const CARTELLA_CONDIVISA = 'condivisi';

function fileFuoriConvenzione(percorsi) {
  const fuori = [];
  percorsi.forEach(function (p) {
    const pezzi = p.split('/');
    // {radice}/{lingua}/{studente}/{nomefile} — quattro pezzi, non di più:
    // una cartella in più dentro un'edizione non è prevista, e se nascesse
    // questa riga la segnalerebbe invece di ignorarla in silenzio.
    if (pezzi.length !== 4) { fuori.push({ file: p, motivo: 'non sta in {radice}/{lingua}/{studente}/' }); return; }
    // La cartella condivisa ha la sua convenzione, e resta una convenzione:
    // non è «qui non si guarda».
    const atteso = pezzi[1] === CARTELLA_CONDIVISA ? pezzi[2] + '-' : pezzi[1] + '-' + pezzi[2] + '-';
    if (pezzi[3].indexOf(atteso) !== 0) {
      fuori.push({ file: p, motivo: 'dovrebbe cominciare con "' + atteso + '"' });
    }
  });
  return fuori;
}

function elencaEdizioni() {
  const out = [];
  RADICI.forEach(function (radice) {
    const base = repoPath(radice);
    if (!fs.existsSync(base)) return;
    fs.readdirSync(base).forEach(function (lingua) {
      const dirL = path.join(base, lingua);
      if (!fs.statSync(dirL).isDirectory()) return;
      fs.readdirSync(dirL).forEach(function (studente) {
        const dirS = path.join(dirL, studente);
        if (!fs.statSync(dirS).isDirectory()) return;
        fs.readdirSync(dirS).forEach(function (f) {
          if (fs.statSync(path.join(dirS, f)).isDirectory()) return;
          out.push(radice + '/' + lingua + '/' + studente + '/' + f);
        });
      });
    });
  });
  return out;
}

// ── [A] LA FUNZIONE SA DIRE DI NO ───────────────────────────────────────
//
// Prima di fidarsi del verde sul repository vero, si guarda che sappia
// diventare rosso: sono i tre modi in cui si sbaglia copiando una cartella.
{
  const casi = [
    ['data/francese/it/inglese-it-gate.json', 'il prefisso della cartella COPIATA — il caso vero'],
    ['data/francese/it/gate.json', 'nessun prefisso'],
    ['docs/francese/it/francese-fr-gate.md', 'prefisso giusto a metà: lingua ok, studente no']
  ];
  casi.forEach(function (c) {
    const fuori = fileFuoriConvenzione([c[0]]);
    log('[A] Lo becca: ' + c[1], fuori.length === 1, JSON.stringify(fuori));
  });
  const ok = fileFuoriConvenzione(['data/francese/it/francese-it-gate.json']);
  log('[A] ...e lascia passare quello giusto', ok.length === 0, JSON.stringify(ok));
}

// ── [B] IL REPOSITORY VERO ──────────────────────────────────────────────
{
  const percorsi = elencaEdizioni();
  log('[B] Le edizioni contengono dei file (il test non sta guardando il vuoto)',
    percorsi.length > 0, 'trovati: ' + percorsi.length);

  const fuori = fileFuoriConvenzione(percorsi);
  if (fuori.length) fuori.forEach(function (f) { console.log('    ' + f.file + ' — ' + f.motivo); });
  log('[B] Ogni file di ogni edizione porta il prefisso della sua cartella',
    fuori.length === 0, fuori.length + ' fuori convenzione');

  console.log('    file controllati: ' + percorsi.length);
}

// ── [C] OGNI EPISODIO DICHIARATO HA TUTTI E DUE I SUOI FILE ────────
//
// Il markdown e' la fonte, il JSON l'esecuzione (regola 26). Un episodio
// dichiarato nella struttura e che non ha il markdown significa che qualcuno
// ha trascritto senza fonte; senza il JSON, che ha scritto e non ha
// trascritto. **Tutte e due si vedono solo aprendo l'app, e tardi.**
//
// ⚠️ CHI E' UN EPISODIO NON E' UN ELENCO SCRITTO QUI: sono le chiavi di
// `episodes` nel file di struttura dell'edizione. *Un elenco scritto a mano
// invecchierebbe al primo episodio nuovo, ed e' esattamente il difetto che
// questo file esiste per non avere.*
//
// ⚠️ E QUESTO BLOCCO NASCE DA UN ROSSO SUO: la prima versione confrontava
// TUTTI i file di dati con TUTTI i markdown, ed e' andata rossa su
// `istruzioni-moduli.json` e `messaggi-feedback.json` — che un markdown
// gemello **non devono averlo**: sono testi dell'interfaccia (regola 8), non
// contenuto di un episodio. Il commento dichiarava gia' il limite — *«vale
// solo per gli EPISODI»* — **e il codice non lo applicava.** Un limite scritto
// e non implementato e' peggio di un limite assente: si legge come una
// verifica fatta.
{
  const percorsi = elencaEdizioni();
  const edizioni = {};
  percorsi.forEach(function (p) {
    const pezzi = p.split('/');
    // ⚠️ `condivisi/` non è un'edizione, quindi non le si chiede un file di
    // struttura né degli episodi: non ne ha e non deve averne. *Escluderla qui
    // e darle la sua convenzione in `fileFuoriConvenzione` sono due cose
    // diverse: la prima dice «non è un corso», la seconda «ha comunque un
    // nome giusto e uno sbagliato».*
    if (pezzi.length === 4 && pezzi[1] !== CARTELLA_CONDIVISA) edizioni[pezzi[1] + '/' + pezzi[2]] = true;
  });

  const mancanti = [];
  let episodiControllati = 0;
  Object.keys(edizioni).forEach(function (ed) {
    const pezzi = ed.split('/');
    const pref = pezzi[0] + '-' + pezzi[1] + '-';
    const struttura = repoPath('data', pezzi[0], pezzi[1], pref + 'struttura-corso.json');
    if (!fs.existsSync(struttura)) {
      mancanti.push(ed + ': manca il file di struttura');
      return;
    }
    const episodi = Object.keys(JSON.parse(fs.readFileSync(struttura, 'utf8')).episodes || {});
    episodi.forEach(function (id) {
      episodiControllati++;
      [['data', '.json'], ['docs', '.md']].forEach(function (c) {
        const f = repoPath(c[0], pezzi[0], pezzi[1], pref + id + c[1]);
        if (!fs.existsSync(f)) mancanti.push(c[0] + '/' + ed + '/' + pref + id + c[1]);
      });
    });
  });

  if (mancanti.length) mancanti.forEach(function (m) { console.log('    manca: ' + m); });
  log('[C] Ogni episodio dichiarato ha il suo markdown E il suo JSON',
    mancanti.length === 0, mancanti.join(', '));
  console.log('    episodi controllati: ' + episodiControllati +
    ' in ' + Object.keys(edizioni).length + ' edizione/i');
}

// ── [D] OGNI EDIZIONE HA IL SUO FILE DI MIGRAZIONI, E IL FILE DICE QUALCOSA ──
//
// Dal 2026-10-11, deciso da chi guida il progetto. L'app chiede SEMPRE
// `{L}-{S}-migrazioni-personalizzazione.json` (`loadPersonalizationMigrations`
// in `app/dati.js`), e se non arriva rifiuta: lo studente vede la schermata
// d'errore. *Fino a quel giorno l'assenza la scopriva lui, non un test.*
//
// ⚠️ E NON BASTA CHE IL FILE CI SIA: DEVE PORTARE `slot` COME OGGETTO. Un file
// vuoto — `"slot": {}` — DICE una cosa: «per questa edizione nessun id e' mai
// cambiato». Un file senza `slot` (per esempio `{}`) non dice niente, e l'app
// lo legge come se dicesse la stessa cosa: `(data && data.slot) || {}`. *Un
// silenzio letto come un'affermazione.* Questo blocco ferma il file guasto
// prima della pubblicazione; che l'app lo rifiuti anche dopo e' un passo suo.
//
// ⚠️ NON LO SCRIVE IL TRASCRITTORE, di proposito: il trascrittore scrive
// contenuto, questo file e' storia. Crearlo vuoto in automatico vorrebbe dire
// che il giorno in cui una migrazione vera serve e nessuno la scrive, il file
// c'e' ed e' vuoto — cioe' afferma il falso in silenzio. Un controllo che
// fallisce e' meglio di una riparazione che tace.
//
// La funzione e' PURA come `fileFuoriConvenzione`: prende le edizioni e un
// lettore, e si falsifica con un lettore finto senza toccare il disco.
function migrazioniGuaste(edizioni, leggi) {
  const guasti = [];
  edizioni.forEach(function (ed) {
    const pezzi = ed.split('/');
    const nome = 'data/' + ed + '/' + pezzi[0] + '-' + pezzi[1] + '-migrazioni-personalizzazione.json';
    const testo = leggi(nome);
    if (testo === null) { guasti.push(nome + ': manca'); return; }
    let dati;
    try { dati = JSON.parse(testo); } catch (e) { guasti.push(nome + ': non e\' JSON'); return; }
    const slot = dati && dati.slot;
    if (!slot || typeof slot !== 'object' || Array.isArray(slot)) {
      guasti.push(nome + ': `slot` non e\' un oggetto (trovato ' + JSON.stringify(slot) + ')');
    }
  });
  return guasti;
}

{
  const finto = function (contenuti) {
    return function (nome) { return Object.prototype.hasOwnProperty.call(contenuti, nome) ? contenuti[nome] : null; };
  };
  const F = 'data/francese/it/francese-it-migrazioni-personalizzazione.json';
  [
    [null, 'il file manca — il caso che oggi scopre lo studente'],
    ['{}', 'il file c\'e\' ma senza `slot` — il caso che oggi non scopre nessuno'],
    ['{"slot": []}', '`slot` e\' una lista'],
    ['{"slot": null}', '`slot` e\' null'],
    ['{"slot": {', 'il file non e\' JSON']
  ].forEach(function (c) {
    const contenuti = {};
    if (c[0] !== null) contenuti[F] = c[0];
    const g = migrazioniGuaste(['francese/it'], finto(contenuti));
    log('[D] Lo becca: ' + c[1], g.length === 1, JSON.stringify(g));
  });
  const ok = {}; ok[F] = '{"_LEGGIMI": "vuoto", "slot": {}}';
  log('[D] ...e lascia passare il file vuoto ma dichiarato (`"slot": {}`)',
    migrazioniGuaste(['francese/it'], finto(ok)).length === 0);

  // Le edizioni vere: le stesse di [C], cioe' le cartelle di `data/` e `docs/`
  // fuori da `condivisi`. Regola 49: zero edizioni non e' un verde.
  const edizioni = {};
  elencaEdizioni().forEach(function (p) {
    const pezzi = p.split('/');
    if (pezzi.length === 4 && pezzi[1] !== CARTELLA_CONDIVISA) edizioni[pezzi[1] + '/' + pezzi[2]] = true;
  });
  const elenco = Object.keys(edizioni);
  log('[D] Ci sono edizioni da guardare', elenco.length > 0, String(elenco.length));
  const guasti = migrazioniGuaste(elenco, function (nome) {
    const f = repoPath(nome);
    return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  });
  log('[D] Ogni edizione ha il suo file di migrazioni, con `slot` come oggetto (' + elenco.join(', ') + ')',
    guasti.length === 0, guasti.join(' | '));
}

console.log('\n=== NOMENCLATURA EDIZIONE: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
