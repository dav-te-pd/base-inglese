// Pilotaggio condiviso del componente della storia (Meet the Story, Why We
// Say It) per i test — stesso ruolo che quiz-driver.js ha per i moduli a
// scelta multipla, e stessa regola sui nomi: non porta il prefisso del
// modulo che lo ha fatto nascere (CLAUDE.md regola 18).
//
// Perché esiste: in Why We Say It "Ho finito" è bloccato finché ogni skill
// non è stata aperta e dichiarata, e le skill si sbloccano una alla volta,
// in sequenza. Un test che vuole solo arrivare alla Schermata Finale deve
// quindi attraversare la lezione — un ciclo identico in ogni file che lo
// fa. Qui sta scritto una volta.

const { loadGrade } = require('./quiz-driver');

// Gli id delle skill del grado D, nell'ordine della lezione. Stessa regola
// di seSkillId() in index.html: idBattuta + '-s' + posizione.
function skillIds(grade) {
  const ids = [];
  loadGrade(grade || 'D').forEach(function (line) {
    (line.whatYouLearn || []).forEach(function (skill, i) {
      if (skill && skill.body) ids.push(line.id + '-s' + (i + 1));
    });
  });
  return ids;
}

// Dichiara ogni skill in sequenza. Aspetta la comparsa della spunta invece
// di un tempo fisso (CLAUDE.md regola 19), così su una macchina lenta
// aspetta di più e su una veloce prosegue subito.
async function declareAllSkills(page, valore, grade) {
  const risposta = valore || 'chiara';
  for (const id of skillIds(grade)) {
    await page.locator('.se-selfcheck[data-se-skill="' + id + '"] [data-se-answer="' + risposta + '"]').click();
    await page.waitForFunction(function (skillId) {
      const el = document.getElementById('se-declared-' + skillId);
      return el && el.getClientRects().length > 0;
    }, id, { timeout: 10000 });
  }
  // "Ho finito" si sblocca solo quando sono tutte dichiarate: aspettare
  // quello è aspettare la condizione vera, non il tempo che ci mette.
  await page.waitForFunction(function () {
    const btn = document.getElementById('speak-easy-complete');
    return btn && !btn.disabled;
  }, null, { timeout: 10000 });
}

module.exports = { skillIds, declareAllSkills };
