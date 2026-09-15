// Pilotaggio condiviso della MAPPA dell'episodio per i test — stesso ruolo
// che quiz-driver.js ha per i moduli a scelta multipla e story-driver.js per
// la storia, e stessa regola sui nomi: non porta il prefisso del modulo che
// lo ha fatto nascere (CLAUDE.md regola 18).
//
// Perché esiste: aprire un modulo dalla mappa è il gesto che fa ogni file di
// test, e la funzione che lo fa era ricopiata in 23 file — IDENTICA in tutti
// e 23, verificata per contenuto e non a occhio (23 copie, 1 sola variante).
// Una copia sola non è un difetto; 23 copie di cui nessuno sa se sono ancora
// uguali lo diventano al primo che ne tocca una.
//
// ⚠️ L'ATTESA QUI DENTRO NON È STATA CONVERTITA, ED È VOLUTO.
//
// I 250 ms restano scritti come stavano nelle 23 copie: questo passo SPOSTA,
// non paga debito. Il censimento delle attese (tests/ATTESE-FISSE.md) vedrà
// quindi il totale di navigazione scendere di 22 senza che nessuna attesa sia
// stata resa più solida — 22 righe sparite perché erano copie, non perché
// qualcuno le ha sistemate. Chi guarderà la serie dei numeri fra un mese deve
// poter distinguere questo calo da un lavoro vero: sta scritto qui e nel
// documento generato, non solo nel resoconto del giorno.
//
// Convertirla è un lavoro suo, e cambia cosa provano 23 file insieme: va
// deciso e verificato come tale, non fatto di passaggio mentre si unifica.

// Apre un modulo dalla mappa dell'episodio.
//
// page.click() aspetta già da sé che la riga esista e sia cliccabile; i
// 250 ms che seguono aspettano che la vista del modulo sia montata.
async function openModule(page, moduleId) {
  await page.click('[data-module="' + moduleId + '"]');
  await page.waitForTimeout(250);
}

module.exports = { openModule };
