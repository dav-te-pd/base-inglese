// Verifica che l'attributo hidden nasconda DAVVERO, per ogni regola del
// foglio di stile — comprese quelle che verranno scritte domani.
//
// Il bug che questo test rende impossibile: [hidden]{display:none} arriva
// dal foglio predefinito del browser, il livello più debole della cascata.
// Qualunque regola d'autore che imposti un display lo batte, a prescindere
// dalla specificità, e un elemento con hidden resta visibile. In questo
// progetto è successo cinque volte (.btn, .header-actions, header.app-header,
// le schermate di Speed Round e Flash Card): ogni volta perché chi scriveva
// "display: flex" su una classe non poteva sapere che quella classe sarebbe
// stata nascosta altrove.
//
// index.html ha ora una guardia unica in cima al foglio:
//
//   [hidden]:not([hidden="until-found"]) { display: none !important; }
//
// Una regola d'autore con !important batte ogni regola d'autore senza,
// quindi la guardia copre anche le classi future. Questo test non si fida
// del fatto che la riga esista: prende OGNI regola che imposta un display,
// costruisce un elemento che quella regola colpisce, gli mette hidden e
// controlla che il display calcolato sia none. Una classe nuova che
// riportasse il problema — per esempio con un proprio !important — fa
// fallire la CI il giorno in cui viene scritta, non il giorno in cui
// qualcuno guarda quella schermata.
//
//   node tests/test_hidden_guard.js     (con il server attivo)

const { launchBrowser, APP_URL } = require('./test-env');

async function run() {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
  await page.goto(APP_URL);

  const report = await page.evaluate(function () {
    // L'ultimo pezzo di un selettore discendente è quello che descrive
    // l'elemento colpito: da "[data-theme='dark'] .card .badge" interessa
    // ".badge". Le pseudo-classi e i pseudo-elementi si tolgono: un
    // elemento di prova non è sotto il mouse né dentro un :nth-child.
    function probeFor(part) {
      var last = part.trim().split(/\s+|>|\+|~/).filter(Boolean).pop();
      if (!last) return null;
      last = last.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '');
      last = last.replace(/\[[^\]]*\]/g, '');
      if (!last || last === '*') return null;
      var tagMatch = last.match(/^[a-zA-Z][a-zA-Z0-9]*/);
      var tag = tagMatch ? tagMatch[0] : 'div';
      var el = document.createElement(tag);
      (last.match(/\.[A-Za-z0-9_-]+/g) || []).forEach(function (c) { el.classList.add(c.slice(1)); });
      var id = last.match(/#([A-Za-z0-9_-]+)/);
      // Un id duplicato nel documento è legale abbastanza per una prova, e
      // il selettore #x continua a colpirlo.
      if (id) el.id = id[1];
      return el;
    }

    var checked = 0;
    var skipped = 0;
    var broken = [];
    var guardFound = false;

    // Attenzione: in CSS moderno anche una regola normale espone una
    // cssRules (vuota) per le regole annidate, quindi "ha cssRules" non
    // vuol dire "è un @media". Si guarda selectorText, e si scende
    // comunque nei figli quando ce ne sono.
    function walk(rules) {
      Array.prototype.forEach.call(rules, function (rule) {
        if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules);
        if (!rule.selectorText || !rule.style) return;
        if (rule.selectorText.indexOf('[hidden]') !== -1) {
          if (rule.style.getPropertyValue('display') === 'none'
            && rule.style.getPropertyPriority('display') === 'important') guardFound = true;
          return;
        }
        var display = rule.style.getPropertyValue('display');
        if (!display || display === 'none') return;

        rule.selectorText.split(',').forEach(function (part) {
          var el = probeFor(part);
          if (!el) { skipped++; return; }
          el.hidden = true;
          document.body.appendChild(el);
          var computed = getComputedStyle(el).display;
          document.body.removeChild(el);
          checked++;
          if (computed !== 'none') broken.push({ selector: part.trim(), display: display, computed: computed });
        });
      });
    }

    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      try { walk(sheet.cssRules); } catch (e) { /* foglio non leggibile: ignorato */ }
    });

    // body ha il suo display: flex e non si può duplicare, quindi si prova
    // quello vero e lo si rimette com'era.
    document.body.hidden = true;
    var bodyDisplay = getComputedStyle(document.body).display;
    document.body.hidden = false;

    return { checked: checked, skipped: skipped, broken: broken, guardFound: guardFound, bodyDisplay: bodyDisplay };
  });

  const results = [];
  const log = (msg, ok) => { results.push(ok); console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + msg); };

  log('La guardia [hidden] esiste ed è !important', report.guardFound);
  log('Almeno una regola con display è stata messa alla prova (' + report.checked + ' selettori, ' + report.skipped + ' non riproducibili)', report.checked > 0);
  log('body con hidden risulta display:none (era ' + report.bodyDisplay + ')', report.bodyDisplay === 'none');
  log('Nessuna regola resta visibile con hidden (' + report.broken.length + ' rotte)', report.broken.length === 0);
  report.broken.forEach(function (b) {
    console.log('       ' + b.selector + ' — dichiara display: ' + b.display + ', con hidden resta ' + b.computed);
  });

  await browser.close();
  const passed = results.filter(Boolean).length;
  console.log('\n=== GUARDIA HIDDEN: ' + passed + '/' + results.length + ' passed ===');
  return results.length - passed;
}

run().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
