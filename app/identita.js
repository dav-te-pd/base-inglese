// DIPENDE DA: magazzino.js [chiamata]
// Nessun altro file di `app/` e nessun nome di `index.html`: questo file si
// regge da solo, e l'ordine del suo tag non e' un vincolo.
//
// LO STRATO `identita` — chi sei e come vuoi vedere l'app.
//
// Estratto da index.html il 2026-09-17 (passo 22, quarto file). Nove funzioni
// e tre valori, 50 righe, **zero dipendenze verso altri strati** — misurato
// prima di muovere niente.
//
// ⚠️ IL PIANO NE DICHIARAVA OTTO, E SONO NOVE. `setTheme` chiama
// `syncThemePicker`, che il piano non nominava: sei righe che aggiornano
// l'`aria-pressed` delle pastiglie del tema. Non era una dipendenza fra
// strati — era un confine tracciato male, esattamente come
// `vuotoStoryCardsExplanationStats` nello strato `progressi`. Tirata dentro,
// il conto delle dipendenze scende a zero.
//
// ⚠️ E QUESTO FILE STA PRIMA DI `app/avvio.js`, NON DOPO — ed e' l'unico degli
// strati estratti finora a cui l'ordine serva per una ragione di CONTENUTO e
// non solo di caricamento.
//
// `avvio.js` applica il tema salvato PRIMA DEL PRIMO DISEGNO, e per farlo deve
// leggere la chiave del tema. Fino a oggi la scriveva come letterale
// (`'baseinglese:theme'`) mentre index.html la conosceva come `THEME_KEY`:
// due punti che sapevano la stessa cosa, e l'estrazione dello strato 0 li
// aveva messi in due file diversi — registrato allora come «trovato e non
// corretto», con la condizione «si corregge nello strato che li riunisce».
// **Questo e' quello strato.** La chiave vive qui, `avvio.js` la legge da
// `BI.THEME_KEY`, e per poterlo fare questo file deve arrivare prima.
//
// ⚠️ COSA SI ROMPE SE QUESTO FILE NON ARRIVA — misurato, ed e' l'OPPOSTO di
// `progressi`: li' l'app partiva e la mappa restava muta; qui lo script
// principale chiama `renderThemePicker()` al primo livello del suo IIFE,
// quindi muore subito e **non parte niente**. Il dettaglio sta in testa a
// tests/test_identita_estratta.js, con i numeri.

window.BI = window.BI || {};

(function (BI) {
  'use strict';

  var CONFIG = window.APP_CONFIG;

  var ICONS = {
    'volume-2': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    'video': '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    'mic': '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
    'square': '<rect width="18" height="18" x="3" y="3" rx="2"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    // Acceso/spento di un passo nella vista di riordino del Pannello Admin:
    // l'occhio dice "lo studente lo vede / non lo vede", che e' esattamente
    // cosa fa l'interruttore (il passo sparisce dalla mappa, non si ingrigisce).
    'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.8 10.8 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'play': '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    'pencil': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
  };

  function icon(name, extraClass) {
    var inner = ICONS[name];
    if (!inner) return '';
    return '<svg class="icon' + (extraClass ? ' ' + extraClass : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      var extraClass = el.getAttribute('data-icon-class') || '';
      el.innerHTML = icon(name, extraClass);
    });
  }

  var THEME_KEY = 'baseinglese:theme';

  var THEME_VALUES = CONFIG.themes.options.map(function (t) { return t.value; });

  function renderThemePicker() {
    var container = document.getElementById('theme-picker');
    container.innerHTML = CONFIG.themes.options.map(function (t) {
      return '<button class="theme-swatch" type="button" data-theme-option="' + t.value + '">' +
        '<span class="swatch-dot" style="background:' + t.dot + '"></span>' + t.label + '</button>';
    }).join('');
  }

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || CONFIG.themes.defaultTheme;
  }

  function setTheme(name) {
    if (THEME_VALUES.indexOf(name) === -1) name = CONFIG.themes.defaultTheme;
    if (name === CONFIG.themes.defaultTheme) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', name);
    }
    BI.magScriviTesto(THEME_KEY, name);
    syncThemePicker();
  }

  function syncThemePicker() {
    var current = getTheme();
    document.querySelectorAll('[data-theme-option]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-theme-option') === current));
    });
  }

  var NAME_KEY = 'baseinglese:userName';

  function getUserName() {
    return BI.magLeggiTesto(NAME_KEY);
  }

  function setUserName(name) {
    BI.magScriviTesto(NAME_KEY, name);
  }

  function clearUserName() {
    BI.magCancella(NAME_KEY);
  }

  BI.icon = icon;
  BI.hydrateIcons = hydrateIcons;
  BI.renderThemePicker = renderThemePicker;
  BI.getTheme = getTheme;
  BI.setTheme = setTheme;
  BI.syncThemePicker = syncThemePicker;
  BI.getUserName = getUserName;
  BI.setUserName = setUserName;
  BI.clearUserName = clearUserName;
  BI.THEME_KEY = THEME_KEY;
  BI.THEME_VALUES = THEME_VALUES;
  BI.NAME_KEY = NAME_KEY;
  BI.ICONS = ICONS;
})(window.BI);
