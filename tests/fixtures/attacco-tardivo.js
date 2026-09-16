// NON FA PARTE DELL'APP. Serve solo a tests/test_spazio_nomi.js.
//
// Fa quello che al passo 21-bis fara' ogni file di modulo: si registra nello
// spazio dei nomi ARRIVANDO DOPO, senza sapere in che ordine e' stato messo
// nel documento e senza toccare direttamente le collezioni.
//
// ⚠️ La prima riga e' la stessa di app/spazio.js ED E' IL PUNTO: un file che
// arriva tardi non puo' dare per scontato che lo spazio dei nomi esista gia'.
// Se `|| {}` diventasse `{}` in uno qualunque dei due file, questa riga
// azzererebbe tutto quello che il precedente ha registrato.
window.BI = window.BI || {};

(function (BI) {
  BI.registraPulizia(function () {
    window.__pulizieChiamate = (window.__pulizieChiamate || 0) + 1;
  });
  BI.registraModulo('modulo-di-prova', function (modulo) {
    window.__moduloApertoCon = modulo;
  });
})(window.BI);
