// L'AVVIO DELL'APP COME UTENTE, IN UN POSTO SOLO — passo F.4 ②, 2026-09-25.
//
// ⚠️ PERCHE' ESISTE, E IL NUMERO E' LA RAGIONE. **Misurato il 2026-09-25:
// trentadue file di test si scrivevano il proprio avvio.** Non erano
// trentadue idee diverse: **VENTICINQUE hanno lo SCHELETRO IDENTICO**
// — stesso `goto`, stessa attesa, stesso «se non c'e' il campo del nome
// clicca "cambia utente"», stesso invio, stesso click su `#go-episode`,
// stesso 150 finale. *L'unica cosa che cambia fra loro e' COSA scrivono nel
// `localStorage` prima di entrare.*
//
// Il conto si rifa' con un comando, non si ricopia:
//
//     grep -lE "^(async )?function (bootAsUser|boot|apriModulo|apriPasso)" tests/test_*.js | wc -l
//
// ⚠️ E QUELLE COPIE PORTAVANO DENTRO DUE CONOSCENZE RICOPIATE A MANO, che e'
// il vero costo:
//
//   - **l'id dell'episodio `'gate'`**, scritto dentro `moduleProgressKey('gate', ...)`
//     in ventisette file. *E' la famiglia del passo 1.19 — «la suite smette di
//     dare per scontato che gate sia il primo» — vista nei test invece che
//     nell'app.* Adesso e' `EPISODIO_PREDEFINITO`, **un posto solo**, e un
//     file che ne vuole un altro passa `episodio`.
//   - **la lista dei moduli con un'introduzione**, ricopiata in ventotto file.
//     Adesso e' `INTRO_DI_TUTTI`.
//
// ⚠️ `INTRO_DI_TUTTI` NON E' `stepIds()`, E NON E' UNA SVISTA. `stepIds()` da'
// i **22 PASSI** di una sequenza, con i loro suffissi (`matchEngIta-2`,
// `flashcardAEngIta`); la chiave dell'intro e' invece per **KIND**, e i kind
// sono 15. *Misurato: nella lista e non in `stepIds()` ci sono `mappaEpisodio`
// e `flashcard`; in `stepIds()` e non nella lista ce ne sono nove.* Sono due
// elenchi di cose diverse, e farne uno solo sarebbe un errore travestito da
// deduplicazione.
//
// ⚠️ QUESTO PASSO NON CAMBIA IL COMPORTAMENTO DI NESSUN FILE, ED E' LA SCELTA
// CHE LO RENDE FATTIBILE — la stessa di `mock-browser.js`. Lo scheletro qui
// sotto e' quello dei venticinque, **attese comprese**, `waitForTimeout` e
// tutto. *Mescolare «unifico» e «rendo robuste le attese» renderebbe
// illeggibile il rosso: un rosso che puo' venire da due cause non e' una
// misura.* Le attese a tempo di questo scheletro restano un debito
// dichiarato, non un debito nuovo.
//
// ⚠️ I SETTE CHE NON PASSANO DI QUI, e nessuno dei sette e' una dimenticanza:
// `test_sequenze` (azzera il `localStorage` e ricarica: e' un altro mestiere),
// `test_outcome_step_ids` (ne ha **due**, `bootFresh` e `bootSeeded`),
// `test_story_modules`, `test_mastery_al_gesto`, `test_blocco_ascolto`,
// `test_avviso_microfono`, `test_sblocco_sequenziale` (aspettano un selettore
// invece di un tempo, ed e' meglio: portarli allo scheletro sarebbe un passo
// **indietro**).
'use strict';

const { APP_URL, attendiPrimaSchermata } = require('./test-env');

// L'episodio su cui i test scrivono i progressi. In un posto solo: prima era
// la stringa 'gate' incisa in ventisette file.
const EPISODIO_PREDEFINITO = 'gate';

// I `kind` che hanno una schermata di introduzione, piu' le due schermate che
// moduli non sono (`mappaEpisodio`, `personalizzazione`). Chiuderle tutte e'
// il caso normale: un test che vuole VEDERE un'introduzione passa la sua
// lista, o `[]`.
const INTRO_DI_TUTTI = [
  'mappaEpisodio', 'personalizzazione', 'repeatAloud', 'meetTheStory',
  'whyWeSayIt', 'voiceCoach', 'voicePractice', 'matchEngIta', 'matchItaEng',
  'speedMatchEngIta', 'speedMatchItaEng', 'flashcard',
  'dialogoAscoltaRipeti', 'dialogoRipetiATempo', 'dialogoContinuo'
];

// Entra nell'app come `utente` e apre la mappa dell'episodio.
//
//   utente             il nome digitato nell'onboarding (obbligatorio)
//   completati         i passi gia' fatti; assente, non scrive progressi
//   introChiuse        quali introduzioni NON devono comparire (default: nessuna)
//   storage            altre chiavi da scrivere, {chiave: valore}
//   episodio           su quale episodio scrivere (default: EPISODIO_PREDEFINITO)
//   personalizzaVista  segna la personalizzazione come gia' vista
async function bootUtente(page, opzioni) {
  const o = opzioni || {};
  await page.goto(o.base || APP_URL);
  // ⚠️ L'app non disegna niente finche' non arriva `struttura-corso.json`
  // (passo 1.11b): senza questa attesa, «non c'e' il campo del nome» e «non
  // c'e' ancora niente» si leggono uguali, e il test clicca un pulsante che
  // non e' ancora comparso. Vedi `attendiPrimaSchermata` in test-env.js.
  await attendiPrimaSchermata(page);
  // Dal secondo giro in poi il nome e' gia' salvato e la schermata di
  // benvenuto non compare: si guarda cosa c'e' a schermo invece di darlo
  // per scontato.
  const benvenuto = await page.isVisible('#name-input').catch(() => false);
  if (!benvenuto) { await page.click('#switch-user'); await page.waitForTimeout(100); }
  await page.fill('#name-input', o.utente);
  await page.click('#onboarding-form button[type=submit]');
  await page.waitForTimeout(100);
  await page.evaluate(function (a) {
    if (a.completati) {
      localStorage.setItem(BI.moduleProgressKey(a.episodio, a.utente),
        JSON.stringify({ completed: a.completati }));
    }
    if (a.personalizzaVista) {
      localStorage.setItem(BI.customizeSeenKey(a.episodio, a.utente), '1');
    }
    a.introChiuse.forEach(function (k) {
      localStorage.setItem('baseinglese:introDismissed:' + k + ':' + a.utente, '1');
    });
    if (a.storage) {
      Object.keys(a.storage).forEach(function (k) {
        localStorage.setItem(k, a.storage[k]);
      });
    }
  }, {
    utente: o.utente,
    completati: o.completati || null,
    introChiuse: o.introChiuse || [],
    storage: o.storage || null,
    episodio: o.episodio || EPISODIO_PREDEFINITO,
    personalizzaVista: !!o.personalizzaVista
  });
  await page.click('#go-episode');
  await page.waitForTimeout(150);
}

module.exports = { bootUtente, INTRO_DI_TUTTI, EPISODIO_PREDEFINITO };
