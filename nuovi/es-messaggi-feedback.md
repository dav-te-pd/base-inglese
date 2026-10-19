**Versione: 20261017a**

# Messaggi di esito — studente ispanofono

**Livello 2: questi testi dipendono dalla lingua dello STUDENTE, non da quella insegnata.** *Valgono per
ogni corso che uno studente ispanofono studia in questa app.*

---

## 1 — COME SI LEGGE QUESTO FILE

**Questo è un file DATI: finisce in `data/condivisi/es/es-messaggi-feedback.json`.**

### 🔴 ① I TITOLI E LE INTESTAZIONI RESTANO IN ITALIANO, LE CELLE NO

**Misurato il 2026-10-17: il trascrittore cerca i titoli delle sezioni ALLA LETTERA** — `##` più uno
spazio più il testo, numero compreso — **e pretende l'intestazione `| Famiglia | Gruppo | # | Testo |`
colonna per colonna.**

⚠️ **E IN QUESTO PARAGRAFO NESSUN TITOLO È SCRITTO PER INTERO, APPOSTA:** *il `##` e il suo testo
restano separati.* 🔴 **Le prime DUE stesure lo scrivevano intero — e la seconda era proprio la frase che
spiega di non farlo.** *`controllo-titoli.py` le ha fermate tutte due: una citazione diventa la
**seconda** occorrenza, e `indexOf` trova la prima — cioè questa riga invece della sezione vera.*
⭐ **È `FATTI-APP` riga `APP_titolo-una-volta`, ed è già capitata nel file italiano, con queste stesse
parole.**

| | In che lingua | Perché |
|---|---|---|
| **I titoli delle sezioni** | **italiano** | ⭐ *sono un'interfaccia verso la macchina, non testo per lo studente* |
| **Le intestazioni delle colonne** | **italiano** | *idem, e sono controllate* |
| **La prosa** | **italiano** | *questo file lo scriviamo noi, e noi siamo italiani* |
| ⭐ **L'ultima colonna, «Testo»** | **spagnolo** | **è l'unica cosa che lo studente legge** |

⚠️ **Quindi un file `es-` non è un file in spagnolo: è un file nostro con le celle in spagnolo.** *Lo
stesso vale per `es-istruzioni-moduli.md`.*

### ② LA VARIETÀ È `es-ES`

⭐ **Lo spagnolo di Spagna, deciso il 2026-09-30 per l'edizione spagnola e confermato il 17/10 per questa
come lingua dello STUDENTE:** *«un codice di lingua è una varietà, non un livello di neutralità».*

⚠️ **E la rotta NON decide la varietà:** *la famiglia di `italiano/es` parte dall'America Latina e i
testi sono `es-ES`* — **è la stessa separazione che l'edizione spagnola fa al rovescio, con la regola
«`synthesisLang` non segue la tappa durante l'A1».**

🔴 **Una conseguenza pratica, e si vede nelle celle:** *parole buone in Spagna e volgari in America — la
prima è `coger` — **non si usano**.* **Non costa niente evitarle, e la famiglia parte da Città del
Messico.**

### ⭐ ③ TRE COSE CHE LO SPAGNOLO FA MEGLIO DELL'ITALIANO, E NON SONO SCELTE NOSTRE

| | |
|---|---|
| **Il genere spariace nei passati** | *«sei andato» è maschile; **«has ido» non ha genere**.* ⭐ **Metà dei testi italiani danno del maschile allo studente per forza di grammatica; qui no** |
| **Il titolo della valvola** | *«Tranquillo, capita!» è maschile → **«¡No pasa nada!»**, che non ha genere* |
| **«Ultimo richiamo»** | ⭐ **«Última llamada» è la parola vera dell'aeroporto**, e la storia è un volo |

⚠️ **Sono differenze che vengono dalla LINGUA, quindi sono ammesse** *(regola: una differenza che non
viene dalla lingua è un difetto)*. **Qui vengono dalla lingua.**

---

## 2 — LE FASCE

**La regola che decide quale gruppo si pesca NON sta in questo file, e dal 2026-10-16 non sta in nessun
file di testi:** *vive in `app/config.js`, `CONFIG.percentageThresholds`, ed è l'unico posto dove i tre
numeri esistono.*

🔴 **Fino a quella data c'era qui una tabella che li ricopiava in prosa, senza nessun lettore.** ⭐ *Nove
stringhe uscite dal JSON: 141 → 132.*

⚠️ **E a 0% non compare NESSUN messaggio di fine modulo** *(deciso il 2026-10-16)*. **Le stelle a 0 sono
zero, e il messaggio non c'è: `if (stars > 0)` in `app/voice.js`, `fasciaMessaggio` altrove.**

---

## 3 — I MESSAGGI

**Nove famiglie, 130 messaggi.**

| Famiglia | Messaggi | Gruppi |
|---|---|---|
| `voiceCoachMessages` | **15** | `alto`, `basso`, `medio` |
| `speedMatchMessages` | **15** | `alto`, `basso`, `medio` |
| `valvolaSicurezzaMessages` | **10** | `nonRiuscita.bodies`, `riuscita.bodies` |
| `moduleCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `studioCompleteMessages` | **5** | `default` |
| `storyCardsCompleteMessages` | **15** | `alto`, `basso`, `medio` |
| `dialogoCompleteMessages` | **10** | `nonAncora`, `siLoSo` |
| `retryIntroMessages` | **20** | `first.bodies`, `first.titles`, `last.bodies`, `last.titles` |
| `episodeFinalMessages` | **25** | `almenoUnRosso.compliments`, `almenoUnRosso.tip`, `gialloNoRosso.compliments`, `gialloNoRosso.tip`, `tuttiVerdi.compliments` |

⭐ **Questi 130 sono la TRADUZIONE dei 130 italiani riletti il 16 e 17 ottobre, non una riscrittura.**
🔴 **E quella rilettura ha trovato che 83 su 107 dicevano cose che l'app non fa:** *tradurli una settimana
prima avrebbe copiato in spagnolo ottantatré frasi false.*

⚠️ **I meccanismi nominati qui dentro sono gli stessi dell'italiano, e sono veri perché misurati:** *le
stelle sono 1·2·3 (`STAR_MESSAGE_KEYS`), il ripasso esiste e non promette niente, il passo si riapre
dalla mappa, e **nessun testo nomina il mix 40/30/20/10**, che non esiste.*

| Famiglia | Gruppo | # | Testo |
|---|---|---|---|
| `voiceCoachMessages` | `alto` | 1 | Tres estrellas: esta frase te ha salido. |
| `voiceCoachMessages` | `alto` | 2 | Muy buena — se entiende sin titubeos. |
| `voiceCoachMessages` | `alto` | 3 | Pronunciación sólida: esta la tienes. |
| `voiceCoachMessages` | `alto` | 4 | Muy bien en esta frase. |
| `voiceCoachMessages` | `alto` | 5 | Aquí has ido bien, y se nota. |
| `voiceCoachMessages` | `medio` | 1 | Dos estrellas: vamos bien, con algún sonido por pulir. |
| `voiceCoachMessages` | `medio` | 2 | Se te entiende, con alguna imprecisión. |
| `voiceCoachMessages` | `medio` | 3 | Buena parte de los sonidos está bien. |
| `voiceCoachMessages` | `medio` | 4 | Todavía no está limpia, pero funciona. |
| `voiceCoachMessages` | `medio` | 5 | Esta aguanta, y se nota dónde flaquea. |
| `voiceCoachMessages` | `basso` | 1 | Una estrella: esta frase aún se te resiste. |
| `voiceCoachMessages` | `basso` | 2 | Algo ha llegado, el resto no. |
| `voiceCoachMessages` | `basso` | 3 | Frase difícil, y se nota: pasa. |
| `voiceCoachMessages` | `basso` | 4 | Aún lejos — los sonidos lo dicen uno por uno. |
| `voiceCoachMessages` | `basso` | 5 | Aquí la pronunciación todavía no está. |
| `speedMatchMessages` | `alto` | 1 | Primera vuelta rápida y precisa. |
| `speedMatchMessages` | `alto` | 2 | Aquí has respondido sin pensarlo demasiado — señal de que las sabes. |
| `speedMatchMessages` | `alto` | 3 | Rápido y seguro: este bloque lo reconoces. |
| `speedMatchMessages` | `alto` | 4 | Muy buena primera vuelta. |
| `speedMatchMessages` | `alto` | 5 | El tiempo no te ha puesto en apuros. |
| `speedMatchMessages` | `medio` | 1 | La primera vuelta ha ido regular, y luego has repasado el resto. |
| `speedMatchMessages` | `medio` | 2 | Alguna ha llegado enseguida, otras las has recuperado en el repaso. |
| `speedMatchMessages` | `medio` | 3 | La primera vuelta no ha sido fluida, y el repaso ha servido. |
| `speedMatchMessages` | `medio` | 4 | Con el tiempo en contra se te ha escapado algo, y has vuelto sobre ello. |
| `speedMatchMessages` | `medio` | 5 | Lo esencial está; en una parte has necesitado una segunda vuelta. |
| `speedMatchMessages` | `basso` | 1 | La primera vuelta ha ido mal, y has repasado todo lo que faltaba. |
| `speedMatchMessages` | `basso` | 2 | Pocas al primer intento: este bloque aún no está asentado. |
| `speedMatchMessages` | `basso` | 3 | Aquí te ha costado, y has llegado al final. |
| `speedMatchMessages` | `basso` | 4 | Has fallado más de las que has acertado, y el repaso ha sido largo. |
| `speedMatchMessages` | `basso` | 5 | Este bloque te ha puesto en apuros, y lo has terminado igualmente. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 1 | Ya has intentado esta frase varias veces — es normalísimo, le pasa a todo el mundo cuando aprende algo nuevo. Conviene seguir: con una frase así, insistir ahora no ayuda. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 2 | Pasa, y no es un problema: esta frase necesita más tiempo que el resto. Sigue con el ejercicio. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 3 | A veces una frase es más dura que las demás, le pasa incluso a quien va bien. Mejor seguir ahora y dejarla reposar. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 4 | Sin prisa: algunas frases piden más repeticiones que otras, y está previsto en el método. Sigue con el resto. |
| `valvolaSicurezzaMessages` | `nonRiuscita.bodies` | 5 | Todavía no te sale, pero está bien así — es justo para eso que existen los repasos. Continúa con el resto del ejercicio. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 1 | Lo has conseguido, y se nota que los intentos han ayudado: has insistido y ha servido. Sigue con el mismo ánimo. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 2 | Al final has llegado — los primeros intentos no fueron del todo bien, pero has ajustado la puntería. Así es como se aprende. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 3 | Buena recuperación: no salió bien a la primera, pero has seguido intentándolo y ahora está. Sigue así. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 4 | Has insistido en esta frase y ha servido: ahora la haces mejor que antes. Es exactamente el sentido del repaso. |
| `valvolaSicurezzaMessages` | `riuscita.bodies` | 5 | Lo has logrado tras algún intento más, y está perfecto así — significa que el repaso está funcionando. |
| `moduleCompleteMessages` | `alto` | 1 | El primer intento ha ido bien: este bloque lo sabes. |
| `moduleCompleteMessages` | `alto` | 2 | Buen trabajo — aquí has ido con seguridad. |
| `moduleCompleteMessages` | `alto` | 3 | Lo que has estudiado en este bloque se te ha quedado. |
| `moduleCompleteMessages` | `alto` | 4 | La primera pasada ha ido bien, y lo poco que ha vuelto lo has revisado. |
| `moduleCompleteMessages` | `alto` | 5 | Aquí has trabajado bien, y ya se ve en la primera pasada. |
| `moduleCompleteMessages` | `medio` | 1 | Buena parte en la primera pasada, y sobre el resto has vuelto. |
| `moduleCompleteMessages` | `medio` | 2 | Ya estás: una parte ha entrado enseguida, sobre el resto has tenido que volver. |
| `moduleCompleteMessages` | `medio` | 3 | No ha ido todo fluido, pero lo esencial lo tienes. |
| `moduleCompleteMessages` | `medio` | 4 | Está bien así: sobre lo que te ha hecho dudar has vuelto. |
| `moduleCompleteMessages` | `medio` | 5 | Nada que rehacer ahora: la vuelta está completa. |
| `moduleCompleteMessages` | `basso` | 1 | Este bloque era cuesta arriba, y lo has terminado igualmente. |
| `moduleCompleteMessages` | `basso` | 2 | Muchas las has acertado solo volviendo sobre ellas: significa que aún no son tuyas. |
| `moduleCompleteMessages` | `basso` | 3 | El primer intento ha ido mal, y has repetido la vuelta entera. |
| `moduleCompleteMessages` | `basso` | 4 | Has fallado más de las que has acertado, y has vuelto sobre ellas una por una. |
| `moduleCompleteMessages` | `basso` | 5 | Aquí te ha costado, y has llegado al final igualmente. Este paso se reabre desde el mapa, cuando quieras. |
| `studioCompleteMessages` | `default` | 1 | Hecho. Este tipo de ejercicio funciona así: poco a poco. |
| `studioCompleteMessages` | `default` | 2 | Hecho: seguir practicando así es exactamente lo correcto. |
| `studioCompleteMessages` | `default` | 3 | Sesión completada: estas cosas se fijan con el tiempo, no de golpe. |
| `studioCompleteMessages` | `default` | 4 | Muy bien: volver más veces es lo que hace que se queden. |
| `studioCompleteMessages` | `default` | 5 | Ejercicio terminado — siempre puedes volver para otra vuelta cuando quieras. |
| `storyCardsCompleteMessages` | `alto` | 1 | Has marcado como claras las explicaciones, una tras otra. |
| `storyCardsCompleteMessages` | `alto` | 2 | Las has dado por claras: es un buen punto de partida. |
| `storyCardsCompleteMessages` | `alto` | 3 | Este diálogo lo declaras claro — y eres tú quien lo sabe. |
| `storyCardsCompleteMessages` | `alto` | 4 | Ninguna duda grande, según tú. |
| `storyCardsCompleteMessages` | `alto` | 5 | Las estructuras de este diálogo te cuadran. |
| `storyCardsCompleteMessages` | `medio` | 1 | Buena parte de las explicaciones las has marcado claras; algunas no. |
| `storyCardsCompleteMessages` | `medio` | 2 | Alguna clara, alguna no — y eres tú quien ha dicho cuáles. |
| `storyCardsCompleteMessages` | `medio` | 3 | Lo esencial te cuadra; en algunas estructuras has puesto la duda. |
| `storyCardsCompleteMessages` | `medio` | 4 | Una parte la has marcado clara, y en las otras no has disimulado. |
| `storyCardsCompleteMessages` | `medio` | 5 | Un poco claras y un poco no: las dudosas quedan marcadas como tales. |
| `storyCardsCompleteMessages` | `basso` | 1 | Pocas explicaciones marcadas como claras: este diálogo aún hay que digerirlo. |
| `storyCardsCompleteMessages` | `basso` | 2 | Has marcado más dudas que certezas, y decirlo sirve. |
| `storyCardsCompleteMessages` | `basso` | 3 | Más no que sí, según cómo las has marcado. |
| `storyCardsCompleteMessages` | `basso` | 4 | Son construcciones nuevas, y has dicho que aún no están claras. |
| `storyCardsCompleteMessages` | `basso` | 5 | Este paso se reabre desde el mapa, si quieres releerlas. |
| `dialogoCompleteMessages` | `siLoSo` | 1 | Este diálogo lo das por aprendido: adelante con el siguiente. |
| `dialogoCompleteMessages` | `siLoSo` | 2 | Has dicho que lo sabes, y eres tú quien lo siente. |
| `dialogoCompleteMessages` | `siLoSo` | 3 | Marcado como adquirido. Buen paso. |
| `dialogoCompleteMessages` | `siLoSo` | 4 | Lo has escuchado y lo das por tuyo. |
| `dialogoCompleteMessages` | `siLoSo` | 5 | Un diálogo menos por revisar. |
| `dialogoCompleteMessages` | `nonAncora` | 1 | Todavía no, y decirlo es lo correcto. |
| `dialogoCompleteMessages` | `nonAncora` | 2 | Puedes volver a escucharlo cuando quieras: este paso se reabre desde el mapa. |
| `dialogoCompleteMessages` | `nonAncora` | 3 | Pasa no sentirse seguro: lo has marcado, y ahí queda. |
| `dialogoCompleteMessages` | `nonAncora` | 4 | Rehacerlo no es un paso atrás. |
| `dialogoCompleteMessages` | `nonAncora` | 5 | Tómate el tiempo que necesites. |
| `retryIntroMessages` | `first.titles` | 1 | Primera pasada terminada |
| `retryIntroMessages` | `first.titles` | 2 | Primera vuelta completada |
| `retryIntroMessages` | `first.titles` | 3 | Has terminado la vuelta principal |
| `retryIntroMessages` | `first.titles` | 4 | Bien, pasamos al repaso |
| `retryIntroMessages` | `first.titles` | 5 | Ahora toca repasar |
| `retryIntroMessages` | `first.bodies` | 1 | De aquí en adelante se repasan solo las que se te han escapado. |
| `retryIntroMessages` | `first.bodies` | 2 | Ahora volvemos solo sobre lo que necesitas revisar. |
| `retryIntroMessages` | `first.bodies` | 3 | Repasamos juntos solo las que aún no han salido. |
| `retryIntroMessages` | `first.bodies` | 4 | El resto por ahora va bien: nos centramos en lo que falta. |
| `retryIntroMessages` | `first.bodies` | 5 | Repaso dirigido: solo las que hay que revisar, nada más. |
| `retryIntroMessages` | `last.titles` | 1 | Último repaso |
| `retryIntroMessages` | `last.titles` | 2 | Última vuelta |
| `retryIntroMessages` | `last.titles` | 3 | Ya casi, última pasada |
| `retryIntroMessages` | `last.titles` | 4 | Un último repaso |
| `retryIntroMessages` | `last.titles` | 5 | Última llamada |
| `retryIntroMessages` | `last.bodies` | 1 | Después de esta vuelta el ejercicio está cerrado. |
| `retryIntroMessages` | `last.bodies` | 2 | Al terminar este repaso verás cómo ha ido. |
| `retryIntroMessages` | `last.bodies` | 3 | Esta vuelta más, y luego seguimos con el resto del recorrido. |
| `retryIntroMessages` | `last.bodies` | 4 | Una última vez sobre estas, y ya está. |
| `retryIntroMessages` | `last.bodies` | 5 | Completa esta vuelta y pasamos adelante. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 1 | ¡Episodio completado a lo grande — todos los módulos han ido bien! |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 2 | Muy buen trabajo en todo el episodio, sólido de principio a fin. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 3 | Lo has conseguido en todos los módulos: enhorabuena por la constancia. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 4 | Episodio superado de pleno, sin puntos débiles. |
| `episodeFinalMessages` | `tuttiVerdi.compliments` | 5 | Un episodio impecable — controlas todo lo que has aprendido. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 1 | ¡Has completado el episodio entero, enhorabuena! |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 2 | Buen trabajo: has terminado todos los módulos del episodio. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 3 | Episodio terminado, con buenos resultados en gran parte de los módulos. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 4 | Mucho esfuerzo en todo el episodio, se ve que has trabajado bien. |
| `episodeFinalMessages` | `gialloNoRosso.compliments` | 5 | Enhorabuena por haber completado el episodio entero. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 1 | Si quieres, un repaso rápido de los módulos amarillos nunca viene mal. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 2 | Cuando te apetezca, échale otro vistazo a los módulos por revisar. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 3 | Sin prisa, pero un repaso de los módulos amarillos puede ayudar. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 4 | Los módulos por revisar se quedan ahí para cuando tengas ganas de repasarlos. |
| `episodeFinalMessages` | `gialloNoRosso.tip` | 5 | Un repaso de los módulos marcados en amarillo, cuando toque, los deja aún más sólidos. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 1 | ¡Has completado el episodio entero, enhorabuena por llegar hasta el final! |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 2 | Buen trabajo: has terminado todos los módulos, de principio a fin. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 3 | Episodio terminado — llegar hasta el final no es nada obvio. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 4 | Enhorabuena por haber completado todo el episodio. |
| `episodeFinalMessages` | `almenoUnRosso.compliments` | 5 | Mucho esfuerzo: has cerrado el episodio entero. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 1 | Vale la pena rehacer los módulos marcados en rojo: te ayudarán a fijar mejor estas partes. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 2 | Los módulos en rojo merecen otra vuelta: están ahí justo para retomarlos. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 3 | Conviene volver sobre los módulos rojos cuando puedas: ayuda más de lo que parece. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 4 | Dale otra oportunidad a los módulos rojos: rehacerlos es la forma más rápida de mejorarlos. |
| `episodeFinalMessages` | `almenoUnRosso.tip` | 5 | Los módulos rojos son un buen punto desde el que retomar con un repaso. |

---

## 4 — I TITOLI

**I due testi che non stanno in una lista.**

| Famiglia | Percorso | Testo |
|---|---|---|
| `valvolaSicurezzaMessages` | `nonRiuscita.title` | ¡No pasa nada! |
| `valvolaSicurezzaMessages` | `riuscita.title` | ¡Lo has conseguido! |

⭐ **`riuscita.title` compare SOLO quando la voce è stata presa** — *`app/ui-condivisa.js` sceglie
`riuscita` quando `wasCorrect` è vero* — **quindi «¡Lo has conseguido!» è vero per costruzione.**

⭐ **E `nonRiuscita.title` non ha genere, dove l'italiano ce l'ha:** *«Tranquillo, capita!» dà del
maschile; «¡No pasa nada!» no.*

---

## 5 — LE LISTE VUOTE

| Famiglia | Percorso |
|---|---|
| `episodeFinalMessages` | `tuttiVerdi.tip` |

⭐ **VUOTA, E VOLUTA** — *`tests/test_batch11.js` asserisce `length === 0`.*

**La ragione, misurata:** *un complimento sempre, un consiglio solo quando c'è qualcosa da rivedere.*
🔴 **Riempirla direbbe «ripassa i moduli gialli» a chi ha fatto un episodio perfetto.**

---

## 6 — DA RILEGGERE, E NON IN QUESTO GIRO

| | |
|---|---|
| **`episodeFinalMessages` — 25 stringhe** | 🔴 **nessun lettore in `app/` né in `index.html`.** ⚠️ **Per la regola 47 non sono ancora nate: si rileggono quando nasce il modulo «Verifica finale»** |

⚠️ **Sono tradotte comunque, e per una ragione:** *il file italiano le ha, e un file di livello 2 che ne
ha 107 invece di 132 sarebbe un'edizione a metà.* **Quando nasceranno si rileggono in tutte due le
lingue, nello stesso giro.**
