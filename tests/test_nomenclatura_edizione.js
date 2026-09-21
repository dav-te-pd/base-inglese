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
function fileFuoriConvenzione(percorsi) {
  const fuori = [];
  percorsi.forEach(function (p) {
    const pezzi = p.split('/');
    // {radice}/{lingua}/{studente}/{nomefile} — quattro pezzi, non di più:
    // una cartella in più dentro un'edizione non è prevista, e se nascesse
    // questa riga la segnalerebbe invece di ignorarla in silenzio.
    if (pezzi.length !== 4) { fuori.push({ file: p, motivo: 'non sta in {radice}/{lingua}/{studente}/' }); return; }
    const atteso = pezzi[1] + '-' + pezzi[2] + '-';
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
    if (pezzi.length === 4) edizioni[pezzi[1] + '/' + pezzi[2]] = true;
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

console.log('\n=== NOMENCLATURA EDIZIONE: ' + passed + '/' + (passed + failed) + ' passed ===');
process.exit(failed === 0 ? 0 : 1);
