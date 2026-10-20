**Versione: 20261020a**

# ISTRUZIONI DEI MODULI — studente SPAGNOLO

> **Gemello di `it-istruzioni-moduli.md`, nella lingua dello studente spagnolo.**
> *Nato il 2026-10-17, tradotto dall'italiano appena corretto (`20261017a`, le cinque
> correzioni dell'autovalutazione sono già dentro).*

---

## 1 — COME SI LEGGE QUESTO FILE

🔴 **È un file di LIVELLO 2: dipende SOLO dalla lingua dello studente.** *Vive in
`docs/condivisi/es/` e lo leggono TUTTE le edizioni per spagnoli — `italiano/es` oggi,
`inglese/es` domani.* ⭐ **Quindi non può nominare né la lingua insegnata né un fatto di
un'edizione:** *un corso d'inglese per spagnoli leggerà queste stesse celle.*

| Cosa | In che lingua |
|---|---|
| **i titoli delle sezioni, le intestazioni delle colonne, le note** | **italiano** — *sono per noi, non arrivano a schermo* |
| **le celle di testo** | ⭐ **`es-ES`** — *sono quello che lo studente legge* |
| **gli id e le chiavi** (`voiceCoach`, `nonChiara`, `micNotice.level1.body`) | **identici all'italiano** — *li legge il codice* |

⚠️ **Il conto: 199 stringhe, come il gemello italiano.** *Vive in `CLAUDE.md` regola 8 con la
sua data; qui è un promemoria, non la fonte.*

### ⚠️ QUATTRO COSE CHE NON SI TRADUCONO, E OGNUNA ROMPEREBBE QUALCOSA

| | Cosa resta com'è | Perché |
|---|---|---|
| **1** | **i tag HTML** `<p>` `<b>` `<em>` | *la cella entra nel JSON come HTML* |
| **2** | **i segnaposto** `{pct}` `{secondi}` `{n}` `{tot}` `{nome}` `{episodio}` | *li sostituisce il codice: tradotti, non vengono sostituiti* |
| **3** | **il 🔊 e il `␣` (U+2423)** | *il primo è il pulsante; il secondo è lo spazio di bordo di `rispostaCorretta`, che una cella di tabella butterebbe via in silenzio* |
| **4** | **i tre `value` dell'autovalutazione** — `nonChiara`, `nonAncora`, `chiara` | 🔴 **sono CHIAVI, non testi:** *tradotto uno, il messaggio dopo non si trova più* |

⚠️ **E una cella è VUOTA per decisione:** `voceShared.micNotice.level1.actionLabel`. *Il primo
avviso del microfono non ha pulsante — non c'è ancora niente da proporre.*

---

## 2 — LE SPIEGAZIONI

*Colonne: **#** → l'ordine · **kind** → il modulo · **passi** → quanti passi usano questo kind,
o `schermata` · **corpo** → `<kind>.howItWorks.body` · **consiglio** → l'id della sezione 4,
`—` (U+2014) vuol dire nessuno · **video** → vuoto, `·`.*

⚠️ **Sei spiegazioni chiedono `consiglio-scrivere`, sei `consiglio-a-tempo`, quattro nessuno** —
*gli stessi conti dell'italiano: il consiglio dipende dal TIPO di esercizio, non dalla lingua.*

| # | kind | passi | corpo | consiglio | video |
|---|---|---|---|---|---|
| 1 | `personalizzazione` | 1 | <p>Aquí eliges los nombres de los personajes de la historia — o dejas los que te proponemos: ninguna elección es obligatoria.</p><p>Toca un campo para cambiarlo.</p><p><b>Estas elecciones valen para este episodio.</b> Si quieres cambiarlas después de haberlo empezado, el episodio se repite desde el principio.</p><p>Cuando estés listo, pulsa «Empieza el episodio».</p> | — | · |
| 2 | `meetTheStory` | 1 | <p>Es tu primer encuentro con la historia: aquí se escucha, no se estudia.</p><p>Toca 🔊 en cada frase para oírla. La traducción ya está debajo, siempre visible — todavía no has estudiado nada, así que no tiene sentido esconderla.</p><p>Escucha las veces que quieras. <b>No tienes que recordar nada ahora:</b> las palabras, las frases y las reglas llegan después.</p><p>Cuando te hayas hecho una idea de la historia, pulsa «He terminado».</p> | — | · |
| 3 | `repeatAloud` | 2 | <p>Escucha cada palabra con 🔊, lee la traducción y el consejo de pronunciación.</p><p>Repite en voz alta hasta que te parezca igual. <b>Si te parece distinto es normal:</b> más adelante hay ejercicios que te dicen si la pronunciación es correcta.</p><p>Cuando hayas repasado todas las palabras, pulsa «He terminado, volver al mapa».</p> | `consiglio-scrivere` | · |
| 4 | `matchTargetNative` | 3 | <p>Ves una palabra y varias traducciones — toca la correcta.</p><p><b>Aquí no hay tiempo límite:</b> tómate el momento que necesites para pensarlo.</p><p>Las palabras que falles vuelven al final del ejercicio, hasta que estén todas bien.</p> | `consiglio-scrivere` | · |
| 5 | `matchNativeTarget` | 3 | <p>Ves una palabra y varias traducciones — toca la correcta.</p><p><b>Aquí no hay tiempo límite:</b> tómate el momento que necesites para pensarlo.</p><p>Las palabras que falles vuelven al final del ejercicio, hasta que estén todas bien.</p> | `consiglio-scrivere` | · |
| 6 | `flashcard` | 3 | <p>Mira la palabra en la carta, y escúchala si quieres.</p><p>Antes de darle la vuelta intenta adivinarla — sin agobiarte: si no estás seguro toca «Todavía no», que volverá.</p><p>Después toca la carta para darle la vuelta, y dinos si te acordabas.</p><p><b>Las cartas que no sabes vuelven hasta que te las aprendes de verdad.</b></p> | `consiglio-scrivere` | · |
| 7 | `voicePractice` | 2 | <p>Lee la frase en español, escucha el modelo con 🔊, y después toca el micrófono para grabar.</p><p>Toca otra vez para parar, y elige si enviar la grabación o borrarla y repetirla.</p><p>Después de enviarla cada palabra se colorea: <b>verde</b> si está correcta, <b>amarillo</b> si se parece, <b>rojo</b> si hay que revisarla, con una puntuación en estrellas.</p><p><b>Aquí te entrenas, no te evaluamos:</b> puedes repetir la misma frase varias veces.</p> | `consiglio-a-tempo` | · |
| 8 | `whyWeSayIt` | 1 | <p>El diálogo ya lo conoces: aquí se mira <em>por qué</em> se dice así.</p><p>En casi cada frase encuentras uno o más botones con el nombre de una regla. Se abren en orden, una a una: léela y después di si te queda clara — <b>no hay una respuesta correcta</b>, sirve solo para saber qué merece la pena repasar.</p><p>Cuando las hayas visto todas, pulsa «He terminado».</p> | `consiglio-scrivere` | · |
| 9 | `dialogoAscoltaRipeti` | 1 | <p>Este es el diálogo entero del episodio, de principio a fin.</p><p>Toca una frase para escucharla, y después repítela en voz alta. Las veces que quieras, en el orden que prefieras.</p><p>El botón de arriba abre todas las traducciones a la vez: <b>úsalo cuando te haga falta, e intenta usarlo cada vez menos</b> — así es como el cerebro aprende a leer sin apoyarse en el español.</p><p>Cuando hayas escuchado todas las frases, al final encontrarás la pregunta final.</p> | `consiglio-scrivere` | · |
| 10 | `dialogoRipetiATempo` | 1 | <p>El mismo diálogo de antes, esta vez con tiempo.</p><p>Toca una frase: la oyes, y después arranca una barra. <b>Esa barra es tu turno</b> — repite en voz alta mientras avanza.</p><p>Aquí no hay traducciones: a estas alturas el diálogo ya deberías entenderlo. Si no es así, vuelve a «Escucha y repite».</p><p>Pasas a la frase siguiente cuando tú quieras.</p> | `consiglio-a-tempo` | · |
| 11 | `dialogoContinuo` | 1 | <p>Este es el ensayo general: el diálogo corre solo, de principio a fin, como lo oirás en una conversación de verdad.</p><p>Después de una breve cuenta atrás arranca la primera frase. La escuchas, repites en voz alta mientras avanza la barra, y en cuanto termina arranca sola la siguiente.</p><p>Si tienes que parar, usa el botón de pausa.</p><p><b>Si consigues seguirlo sin pararte, estás listo para la Prueba final.</b></p> | `consiglio-a-tempo` | · |
| 12 | `speedMatchTargetNative` | 1 | <p>Ves una palabra y varias traducciones — toca la correcta antes de que se acabe el tiempo, o «No lo sé» si no te acuerdas.</p><p><b>El objetivo no es la velocidad, es acertar.</b> Si fallas te mostramos la respuesta correcta: léela y memorízala, porque cada error vuelve en los repasos hasta que se convierte en un acierto.</p> | `consiglio-a-tempo` | · |
| 13 | `speedMatchNativeTarget` | 1 | <p>Ves una palabra y varias traducciones — toca la correcta antes de que se acabe el tiempo, o «No lo sé» si no te acuerdas.</p><p><b>El objetivo no es la velocidad, es acertar.</b> Si fallas te mostramos la respuesta correcta: léela y memorízala, porque cada error vuelve en los repasos hasta que se convierte en un acierto.</p> | `consiglio-a-tempo` | · |
| 14 | `voiceCoach` | 1 | <p>Lee la frase en español, escucha el modelo con 🔊, y después toca el micrófono para grabar.</p><p>Toca otra vez para parar, y elige si enviar o borrar y repetir.</p><p>Después de enviarla cada palabra se colorea — verde, amarillo o rojo — con una puntuación en estrellas.</p><p><b>Aquí cuenta una sola grabación por frase: es una verificación, no un entrenamiento.</b> Las frases que te hayan salido peor vuelven al final del ejercicio.</p> | `consiglio-a-tempo` | · |
| 15 | `listaEpisodi` | schermata | <p>Esta es la lista de los episodios del curso, en el orden en que se hacen.</p><p>Puedes abrir el episodio actual, o volver a uno que ya hayas terminado.</p><p>El siguiente se desbloquea cuando completas <b>el último paso</b> del que estás haciendo.</p> | — | · |
| 16 | `mappaEpisodio` | schermata | <p>Este es el mapa del episodio: todos los pasos que vas a hacer, en orden.</p><p>Puedes tocar el paso actual, el que está destacado, o volver a uno ya completado. <b>No puedes saltar hacia delante.</b></p> | — | · |

⚠️ **Le due righe `schermata` non sono moduli**, *e per questo la sezione 7 ha quattordici righe e
non sedici: una schermata non ha un sottotitolo sulla mappa.*

---

## 3 — I PROMEMORIA

*Il testo breve dietro «Help → Cómo funciona, en breve». Colonne: **#** · **kind** · **corpo** →
`<kind>.helpReminder.body`.*

| # | kind | corpo |
|---|---|---|
| 1 | `personalizzazione` | <p>Toca un campo para personalizarlo, o déjalo como está. «Reset» vuelve a los valores de partida.</p><p>Las elecciones valen para este episodio: para cambiarlas después de haberlo empezado, el episodio se repite desde el principio.</p><p>Al final de la página puedes sugerirnos nombres o palabras que no encuentres en las listas.</p> |
| 2 | `meetTheStory` | <p>Escucha las frases con 🔊, a la velocidad que prefieras (100/75/50%). La traducción está siempre visible: aquí hay que entender la historia, no adivinarla.</p><p>Cuando te baste, pulsa «He terminado».</p> |
| 3 | `repeatAloud` | <p>Pulsa 🔊 para escuchar cada palabra (velocidad 100/75/50%), y después repítela en voz alta. Lee la traducción y el consejo de pronunciación si te hace falta.</p><p>Cuando hayas hecho toda la lista, pulsa «He terminado, volver al mapa». Si no quieres hacerlo ahora, toca «Mapa».</p> |
| 4 | `matchTargetNative` | <p>Ves la palabra, toca la traducción correcta entre las propuestas. Sin tiempo límite.</p><p>Las preguntas falladas vuelven al final del ejercicio, hasta que estén todas correctas.</p> |
| 5 | `matchNativeTarget` | <p>Ves la palabra, toca la traducción correcta entre las propuestas. Sin tiempo límite.</p><p>Las preguntas falladas vuelven al final del ejercicio, hasta que estén todas correctas.</p> |
| 6 | `flashcard` | <p>Intenta adivinar la palabra antes de darle la vuelta, y después toca la carta para ver la traducción.</p><p>Dinos si la sabías o no. Las cartas que no sabes vuelven hasta que te las aprendes.</p> |
| 7 | `voicePractice` | <p>Toca el micrófono para grabar, toca otra vez para parar. <b>Se para también solo</b> si te quedas en silencio o si pasas del tiempo máximo. Después elige si enviar o borrar.</p><p>Mira los colores y las estrellas. «Practica otra vez» para repetir la misma frase — el contador muestra cuántas veces te quedan, y cuando se acaban se sigue adelante igualmente.</p><p>Aquí no hay un repaso final: es un espacio libre para entrenarte.</p> |
| 8 | `whyWeSayIt` | <p>Abre las reglas una a una, en el orden en que se presentan, y después de cada una di si te queda clara. El botón final se activa cuando has contestado a todas.</p><p>Cuando las hayas visto todas, pulsa «He terminado». Si tienes que interrumpir, «Sal y continúa después» guarda el punto al que has llegado.</p> |
| 9 | `dialogoAscoltaRipeti` | <p>Toca una frase para escucharla, y después repítela en voz alta. Sin tiempo, sin orden obligado.</p><p>La marca verde te recuerda cuáles ya has escuchado. El botón de arriba muestra y esconde todas las traducciones.</p> |
| 10 | `dialogoRipetiATempo` | <p>Toca una frase, escúchala, y después repite en voz alta mientras avanza la barra. Durante la escucha y la barra todo lo demás está bloqueado: sirve para que hagas de verdad el ejercicio.</p><p><b>Atajo:</b> mientras avanza la barra puedes tocar la frase para pasar directamente a la siguiente, sin esperar el final — hace lo mismo que el botón «Frase siguiente».</p> |
| 11 | `dialogoContinuo` | <p>Arranca solo y sigue solo: escucha cada frase y repítela en voz alta mientras avanza la barra. Usa el botón de pausa si tienes que parar.</p><p><b>Atajo:</b> mientras avanza la barra puedes tocar la frase para pasar directamente a la siguiente.</p> |
| 12 | `speedMatchTargetNative` | <p>Ves la palabra, toca la traducción correcta entre las propuestas, antes de que se acabe el tiempo. «No lo sé» si no la sabes — y después mira siempre la respuesta correcta antes de seguir adelante.</p> |
| 13 | `speedMatchNativeTarget` | <p>Ves la palabra, toca la traducción correcta entre las propuestas, antes de que se acabe el tiempo. «No lo sé» si no la sabes — y después mira siempre la respuesta correcta antes de seguir adelante.</p> |
| 14 | `voiceCoach` | <p>Toca el micrófono para grabar, toca otra vez para parar. Antes de enviar siempre puedes borrar y repetir.</p><p>Después de enviar mira los colores y las estrellas, y después toca «Siguiente». <b>Una sola grabación cuenta por frase:</b> las que te hayan salido peor vuelven al final del ejercicio.</p> |
| 15 | `listaEpisodi` | <p>Abre el episodio actual, o uno ya terminado para repasarlo. El siguiente llega cuando cierras el último paso de este.</p> |
| 16 | `mappaEpisodio` | <p>Toca el paso actual para empezarlo, o uno ya completado para repasarlo. Nada de saltos hacia delante.</p> |

---

## 4 — I DUE CONSIGLI CONDIVISI

*Il TESTO del consiglio, e basta: il riquadro e la sua etichetta visibile stanno in
`condivisi.etichettaConsiglio` della sezione 6. La seconda colonna è documentazione e non entra
nel JSON.*

| id | quante spiegazioni lo usano | testo |
|---|---|---|
| `consiglio-scrivere` | **6** | Ten a mano papel y lápiz: además de repetir en voz alta, prueba a escribir las palabras. Con el tiempo, escuchar y escribir a la vez se vuelve automático. |
| `consiglio-a-tempo` | **6** | Aquí no hace falta escribir: el objetivo es escuchar y repetir en voz alta, sin salirte del tiempo. |

---

## 5 — GLI ALTRI TESTI DI UN MODULO

*Colonne: **kind** · **percorso** → la chiave dentro il kind · **testo**.*

| kind | percorso | testo |
|---|---|---|
| `personalizzazione` | `pageDescription` | Personaliza los episodios con las palabras, los nombres y los lugares de tu vida real — cuanto más cerca estén de ti, mejor los recordarás. Elige entre las opciones propuestas, o deja los valores por defecto. |
| `personalizzazione` | `requestBoxLabel` | ¿No encuentras el nombre, la ciudad o la palabra que necesitas? |
| `personalizzazione` | `requestBoxExample` | Ejemplo: si en las listas de arriba falta un nombre o una ciudad que te gustaría ver en la historia, escríbela aquí abajo — valoraremos adaptar el curso. |
| `personalizzazione` | `requestBoxDuplicateWarning` | Esta palabra ya está entre las opciones disponibles — prueba a seleccionarla directamente en el campo de arriba. |
| `personalizzazione` | `midEpisodeWarning.title` | Estás a punto de borrar tu progreso |
| `personalizzazione` | `midEpisodeWarning.body` | <p>Ya has empezado este episodio. Si cambias ahora los nombres y los lugares de la historia, todo lo que has hecho hasta aquí deja de tener sentido: se refería a las palabras que estás a punto de sustituir.</p><p>Para continuar, <b>perderás todo el progreso hecho en este episodio</b> — tendrás que repetir desde el principio los ejercicios que ya habías completado.</p><p>Si estás seguro, escribe aquí abajo exactamente la frase indicada y pulsa el botón.</p> |
| `personalizzazione` | `midEpisodeWarning.confirmPhrase` | borrar episodio |
| `personalizzazione` | `midEpisodeWarning.confirmLabel` | Escribe "borrar episodio" para confirmar |
| `personalizzazione` | `midEpisodeWarning.confirmButton` | Borra el progreso y modifica |
| `personalizzazione` | `midEpisodeWarning.cancelButton` | Cancela, volver al mapa |
| `personalizzazione` | `midEpisodeWarningTitle` | Atención |
| `personalizzazione` | `requestBoxSaved` | ✓ Solicitud guardada. ¡Gracias! |
| `whyWeSayIt` | `completeHint` | Se activa cuando hayas contestado a todas las reglas. |
| `whyWeSayIt` | `selfCheck.question` | ¿Has entendido la explicación? |
| `whyWeSayIt` | `selfCheck.answers[0].value` | nonChiara |
| `whyWeSayIt` | `selfCheck.answers[0].button` | No me queda clara |
| `whyWeSayIt` | `selfCheck.answers[1].value` | nonAncora |
| `whyWeSayIt` | `selfCheck.answers[1].button` | Todavía no, la repasaré |
| `whyWeSayIt` | `selfCheck.answers[2].value` | chiara |
| `whyWeSayIt` | `selfCheck.answers[2].button` | Sí, me queda clara |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.title` | Está bien así |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[0]` | Es normal no entenderlo todo de golpe: sigue con los ejercicios y vuelve aquí más tarde. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[1]` | Ningún problema: algunas reglas se entienden después de haberlas encontrado unas cuantas veces en los ejercicios. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[2]` | Está bien así. A menudo es la práctica la que hace que encaje, no la explicación. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[3]` | Nos pasa a todos. Sigue: cuando la vuelvas a encontrar en una frase de verdad tendrá más sentido. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[4]` | No te pares aquí: una estructura nueva pocas veces queda clara a la primera. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[5]` | Tranquilo: marcarla como poco clara sirve justamente para volver a encontrarla después. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[6]` | Está muy bien decirlo. Las reglas difíciles son las que luego se recuerdan mejor. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[7]` | Sin prisa: sigue con los ejercicios y vuelve a leerla dentro de unos módulos. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[8]` | Pasa. A veces solo hace falta oír la frase unas cuantas veces más. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[9]` | Está bien. Prueba a escuchar otra vez la frase: a menudo la regla se oye antes de entenderla. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[10]` | No es un problema: nadie aprende una estructura nueva a la primera. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[11]` | Es normal. Si sigue poco clara incluso después de los ejercicios, usa el botón Help de arriba. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[12]` | Está bien así: lo importante es que sepas que aquí hay algo que recuperar. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[13]` | Ningún problema. Las reglas se colocan solas a medida que las usas. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[14]` | Pasa, y no dice nada de cómo lo estás haciendo: sigue adelante. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[15]` | Tranquilo. Algunas cosas tienen sentido solo después de haberlas dicho en voz alta. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[16]` | Está bien. Vuelve a esta tarjeta cuando hayas hecho algunos ejercicios más. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[17]` | Sin prisa: puedes volver a abrir esta tarjeta desde el mapa cuando quieras. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[18]` | Pasa, y es útil saberlo: ahora sabes qué repasar. |
| `whyWeSayIt` | `selfCheckMessages.nonChiara.bodies[19]` | Está bien así. Mejor decirlo ahora que hacer como si lo hubieras entendido. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.title` | Ningún problema |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[0]` | Pasa: este paso se vuelve a abrir desde el mapa, cuando quieras. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[1]` | Está bien: sabes dónde está, y puedes volver cuando te haga falta. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[2]` | Ningún problema: tu respuesta queda registrada. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[3]` | Perfecto así: repasar es parte del trabajo, no un retraso. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[4]` | De acuerdo. La volverás a encontrar aquí cuando quieras revisarla. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[5]` | Está bien, la dejamos pendiente: sigue disponible. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[6]` | Sin prisa: vuelves cuando tengas la cabeza más despejada. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[7]` | Muy bien que lo hayas notado: ahora sabes qué revisar. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[8]` | Está bien. Mientras tanto sigue adelante, y luego repasas. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[9]` | Anotado. Esta tarjeta te espera cuando quieras volver. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[10]` | Claro, con calma: aquí nadie tiene prisa. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[11]` | Está bien así: dejarla a un lado es mejor que pasarla por alto. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[12]` | De acuerdo. Volver a leerla dentro de unos días funciona muy bien. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[13]` | Ningún problema: las reglas se colocan mientras haces los ejercicios, incluso sin volver a leerlas. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[14]` | Está bien. Reconocer qué hay que revisar ya es la mitad del trabajo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[15]` | Perfecto. Sigue, y vuelve aquí cuando te apetezca. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[16]` | Anotada. Puedes revisarla cada vez que vuelvas a abrir este módulo. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[17]` | Está bien: mejor repasar una vez más que una menos. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[18]` | De acuerdo, la ponemos en la lista. Adelante con el siguiente. |
| `whyWeSayIt` | `selfCheckMessages.nonAncora.bodies[19]` | Ningún problema: vuelves con calma, cuando quieras. |
| `whyWeSayIt` | `ruleKicker` | Regla nueva |
| `whyWeSayIt` | `noRuleHint` | Aquí no hay nada nuevo: es solo la historia. |
| `whyWeSayIt` | `lockedHint` | Primero las reglas de aquí arriba |
| `listaEpisodi` | `pageTitle` | Tus episodios |
| `listaEpisodi` | `pageSubtitle` | Completa un episodio para desbloquear el siguiente. |
| `mappaEpisodio` | `pageTitle` | Mapa del episodio |
| `mappaEpisodio` | `pageSubtitle` | Completa los módulos en orden para avanzar en la historia. |

---

## 6 — I TESTI CHE NON SONO DI UN MODULO

*Colonne: **chiave** → il gruppo · **percorso** · **testo**. Sono i testi che vivono fuori da un
singolo modulo: i pulsanti condivisi, l'aiuto, la voce, le categorie della mappa.*

| chiave | percorso | testo |
|---|---|---|
| `dialogoShared` | `choiceBoxHint` | Se activa cuando hayas escuchado todas las frases del diálogo. |
| `dialogoShared` | `nextLineLabel` | Frase siguiente |
| `dialogoShared` | `pauseLabel` | Pausa |
| `dialogoShared` | `choiceNotYet` | Todavía no |
| `dialogoShared` | `choiceKnown` | Sí, lo sé |
| `dialogoShared` | `resumeLabel` | Continúa |
| `dialogoShared` | `showTranslations` | Muestra traducciones |
| `dialogoShared` | `hideTranslations` | Esconde traducciones |
| `erroreCaricamento` | `title` | No conseguimos cargar el contenido |
| `erroreCaricamento` | `body` | <p>Los contenidos de este ejercicio no han llegado. Casi siempre es la conexión: espera un momento y vuelve a probar.</p><p>Si al volver a probar no cambia nada, vuelve al mapa — tu progreso está guardado y no has perdido nada.</p> |
| `erroreCaricamento` | `retryLabel` | Vuelve a probar |
| `erroreCaricamento` | `backLabel` | Volver al mapa |
| `erroreCaricamento` | `resetLabel` | Restablece los valores de partida |
| `aiuto` | `menuTitle` | ¿Necesitas ayuda? |
| `aiuto` | `titolo` | Ayuda |
| `aiuto` | `optionInstructions` | Repasa cómo funciona el ejercicio |
| `aiuto` | `optionClarify` | Querría entender esto |
| `aiuto` | `optionUrgent` | Estoy realmente atascado, Davide necesito tu ayuda |
| `aiuto` | `formHintUrgent` | Escribe qué te bloquea: tu solicitud se guardará como urgente. |
| `aiuto` | `formHintClarify` | Escribe qué no te queda claro. |
| `aiuto` | `formPlaceholder` | Escribe aquí... |
| `aiuto` | `formBack` | ← Atrás |
| `aiuto` | `formSubmit` | Enviar |
| `aiuto` | `confirmationText` | ✓ Solicitud guardada. ¡Gracias! |
| `aiuto` | `confirmationBack` | ← Volver al menú |
| `aiuto` | `titleInstructions` | Cómo funciona, en breve |
| `aiuto` | `titleUrgent` | Solicitud urgente |
| `aiuto` | `titleClarify` | Querría entender esto |
| `bloccoAscolto` | `listenLabel` | Escucha |
| `bloccoAscolto` | `rateGroupLabel` | Velocidad de reproducción |
| `bloccoAscolto` | `rateButtonLabel` | Escucha a velocidad {pct} |
| `voceShared` | `recordStart` | Toca para grabar |
| `voceShared` | `recordStop` | Toca para parar |
| `voceShared` | `silenceWarning` | No te hemos oído: prueba a hablar dentro de los {secondi} segundos siguientes al inicio de la grabación. |
| `voceShared` | `retryPractice` | Practica otra vez |
| `voceShared` | `retryCheck` | Vuelve a probar |
| `voceShared` | `transcriptPrefix` | Has dicho: |
| `voceShared` | `transcriptEmpty` | (ningún texto reconocido) |
| `voceShared` | `micNotice.level1.title` | No conseguimos oírte |
| `voceShared` | `micNotice.level1.body` | Las últimas grabaciones no han detectado ninguna palabra. Comprueba que el micrófono esté conectado y que el navegador tenga permiso para usarlo, y vuelve a probar. |
| `voceShared` | `micNotice.level1.actionLabel` |  |
| `voceShared` | `micNotice.level2.title` | Todavía sin audio |
| `voceShared` | `micNotice.level2.body` | El micrófono sigue sin grabar nada. Prueba a empezar de nuevo el ejercicio: a veces basta con volver a abrirlo para que el navegador pida otra vez el permiso. |
| `voceShared` | `micNotice.level2.actionLabel` | Empieza de nuevo el ejercicio |
| `voceShared` | `micNotice.level3.title` | El micrófono no está funcionando |
| `voceShared` | `micNotice.level3.body` | Después de varios intentos todavía no hemos oído nada: lo más probable es que sea un problema del micrófono o de los permisos, no de tu pronunciación. Puedes volver al mapa y probar más tarde. |
| `voceShared` | `micNotice.level3.actionLabel` | Volver al mapa |
| `voceShared` | `attemptLabel` | INTENTO {n} DE {tot} |
| `condivisi` | `introDontShowAgain` | No me muestres más esta pantalla |
| `condivisi` | `introStart` | Lo he entendido, empieza |
| `condivisi` | `readyTitle` | ¿Listo? |
| `condivisi` | `readyStart` | ¿Listo? ¡Vamos! |
| `condivisi` | `etichettaRegolaGenerale` | Regla general |
| `condivisi` | `etichettaConsiglio` | Un consejo |
| `condivisi` | `spiegazione` | Explicación |
| `condivisi` | `help` | Help |
| `condivisi` | `tornaAllaMappa` | ← Mapa |
| `condivisi` | `tornaAllaHome` | ← Home |
| `condivisi` | `hoFinito` | He terminado |
| `condivisi` | `esciRiprendiDopo` | Sal y continúa después |
| `condivisi` | `nonLoSo` | No lo sé |
| `condivisi` | `avanti` | Siguiente → |
| `condivisi` | `attesa` | Estoy preparando el curso… |
| `condivisi` | `ripasso` | Repaso |
| `condivisi` | `caricamento` | Cargando... |
| `condivisi` | `chiudi` | Cerrar |
| `condivisi` | `mostraPronuncia` | Muestra pronunciación |
| `condivisi` | `riprovaAncora` | Inténtalo otra vez |
| `condivisi` | `vaiAvanti` | Sigue adelante → |
| `condivisi` | `iniziaEpisodio` | Empieza el episodio |
| `condivisi` | `personalizzaIntestazione` | Personaliza tu historia o déjala así. |
| `condivisi` | `repeatAloudIntestazione` | Escucha cada palabra o frase, repítela en voz alta. |
| `condivisi` | `rispostaCorretta` | Respuesta correcta:␣ |
| `condivisi` | `nascondiPronuncia` | Esconde pronunciación |
| `condivisi` | `salutoHome` | ¡Hola, {nome}! |
| `condivisi` | `iniziaEpisodioNominato` | Empieza {episodio} |
| `condivisi` | `tuoiEpisodi` | Tus episodios |
| `categorie` | `inizio` | Inicio |
| `categorie` | `studio` | Estudio |
| `categorie` | `dialogo` | Estudia el diálogo |
| `categorie` | `quiz` | Quiz |
| `categorie` | `test` | Prueba final |
| `categorie` | `fine` | Fin |
| `nomiASchermo` | `native` | Español |

⚠️ **`nomiASchermo.native` è «Español» e vive QUI, non nell'edizione**: *è il nome della lingua
dello studente, e lo studente di questo file è sempre spagnolo.* **Il `target` e il `corso` invece
stanno nella §9 della struttura, perché cambiano con l'edizione.**

---

## 7 — I SOTTOTITOLI DEI MODULI

*La riga sotto il nome del modulo sulla mappa: `<kind>.subtitle`. **Indicizzati per `kind`**, e per
questo Match e Speed Match hanno due righe identiche ciascuno: sono due kind.*

| kind | sottotitolo |
|---|---|
| `personalizzazione` | Personaliza tu historia |
| `meetTheStory` | Escucha la historia |
| `repeatAloud` | Repite en voz alta |
| `matchTargetNative` | Empareja las traducciones |
| `matchNativeTarget` | Empareja las traducciones |
| `flashcard` | Repasa lo que has aprendido |
| `voicePractice` | Entrena la pronunciación |
| `whyWeSayIt` | Por qué se dice así |
| `dialogoAscoltaRipeti` | Escucha y repite |
| `dialogoRipetiATempo` | Repite a tiempo |
| `dialogoContinuo` | El diálogo de verdad |
| `speedMatchTargetNative` | Traduce a tiempo |
| `speedMatchNativeTarget` | Traduce a tiempo |
| `voiceCoach` | Pon a prueba tu pronunciación |

---

## 8 — LE DIFFERENZE DALL'ITALIANO, E SONO POCHE MA NON ZERO

⭐ **Tradurre 199 testi ha trovato cose che l'italiano da solo non mostrava.** *Qui stanno, perché
la seconda edizione è lo strumento di misura della prima.*

### ⚠️ ① QUATTRO TESTI DICEVANO «ITALIANO» PER DIRE «LA TUA LINGUA»

| Dove | L'italiano | Lo spagnolo |
|---|---|---|
| `voicePractice` e `voiceCoach` *(spiegazione)* | *«Leggi la frase in italiano»* | **«Lee la frase en español»** |
| `dialogoAscoltaRipeti` *(spiegazione)* | *«senza appoggiarsi all'italiano»* | **«sin apoyarse en el español»** |
| `nomiASchermo.native` | *«Italiano»* | **«Español»** |

🔴 **Non è un errore dell'italiano: in quel file «italiano» ERA la lingua dello studente.** ⭐ **Ma
mostra la regola:** *in un file di livello 2 il nome di una lingua è sempre un RUOLO, mai un nome —
e si traduce come ruolo, non come parola.*

### ✅ ② UN TESTO ITALIANO NOMINAVA UNA DESTINAZIONE — CHIUSO IL 2026-10-20

| | |
|---|---|
| **La cella** | `personalizzazione.requestBoxExample` |
| **Diceva** | *«se vai a Parigi invece che **in Cina**, scrivi "Parigi" nel campo **Destinazione**»* |
| **Perché non andava** | ⭐ **la Cina è la destinazione di UN'EDIZIONE**, *e il campo «Destinazione» non esisteva in tutte: `italiano/es` non l'ha mai avuto, perché le destinazioni non si scelgono* |
| **Adesso dice** | *«se nelle liste qui sopra manca un nome o una città che vorresti nella storia, scrivila qui sotto — valuteremo di adattare il corso»* |

⭐ **E il 2026-10-20 il difetto è sparito alla radice, non solo dal testo:** *la tabella
`places.destinations` e lo slot `destinazione` sono stati tolti, quindi il campo «Destinazione» **non
esiste in nessuna edizione**.* ⚠️ **Per questo la frase «non esiste in tutte: `italiano/es` non lo
ha» è stata riscritta al passato:** *era vera il 2026-10-17 e l'ha resa falsa il commit del 20/10.*

⚠️ **Lo spagnolo l'aveva scritta generica dall'inizio, e la cella italiana è stata corretta nel giro
di allineamento** — *è la seconda edizione che ha trovato il difetto della prima, che è il motivo per
cui questa sezione 8 esiste.*

### ⚠️ ③ TRE COSE CHE LO SPAGNOLO FA DIVERSE PERCHÉ È SPAGNOLO

| | Cosa | Perché |
|---|---|---|
| **1** | **l'apertura di ogni domanda e di ogni esclamazione**: `¿`, `¡` | *`¿Listo? ¡Vamos!`, `¡Hola, {nome}!`, `✓ Solicitud guardada. ¡Gracias!`* |
| **2** | **«Tranquilo» resta maschile, come in italiano** — *ma le altre consolazioni sono senza genere* | ⭐ **stessa scelta dei messaggi di esito:** *`nonRiuscita.title` là è «¡No pasa nada!» proprio per questo* |
| **3** | **nessuna parola della lista nera**: *«coger» non compare* | *va bene in Spagna, è volgare in mezza America Latina — e la famiglia di questa edizione parte da Città del Messico* |

### ⭐ ④ LE PAROLE CHE DEVONO COMBACIARE, E SONO VENTUNO

🔴 **Un testo che cita un pulsante deve citarlo COME È SCRITTO sul pulsante**, *o lo studente cerca
a schermo una frase che non c'è.* **Le coppie di questo file:**

| Il pulsante | La sua cella | Chi lo cita |
|---|---|---|
| **«He terminado»** | `condivisi.hoFinito` | *3 spiegazioni, 2 promemoria* |
| **«Empieza el episodio»** | `condivisi.iniziaEpisodio` | *la spiegazione di `personalizzazione`* |
| **«No lo sé»** | `condivisi.nonLoSo` | *2 spiegazioni, 2 promemoria* |
| **«Siguiente»** | `condivisi.avanti` | *il promemoria di `voiceCoach`* |
| **«Todavía no»** | `dialogoShared.choiceNotYet` | *la spiegazione di `flashcard`* |
| **«Frase siguiente»** | `dialogoShared.nextLineLabel` | *il promemoria di `dialogoRipetiATempo`* |
| **«Practica otra vez»** | `voceShared.retryPractice` | *il promemoria di `voicePractice`* |
| **«Sal y continúa después»** | `condivisi.esciRiprendiDopo` | *il promemoria di `whyWeSayIt`* |
| **«Escucha y repite»** | *il sottotitolo di `dialogoAscoltaRipeti`* | ⚠️ **la spiegazione di `dialogoRipetiATempo`**, *che ci rimanda* |
| **«Prueba final»** | `categorie.test` | ⚠️ **la spiegazione di `dialogoContinuo`**, *che dice «estás listo para la Prueba final»* |
| **«Help»** | `condivisi.help` | *un corpo dell'autovalutazione* |

⚠️ **Le ultime due sono le fragili:** *la prima cita un SOTTOTITOLO (sezione 7), la seconda una
CATEGORIA della mappa (sezione 6).* 🔴 **Se qualcuno cambia quelle due celle, due testi mentono —
e nessun test lo nota.**

### ⭐ ⑤ LA RIGA DELLA MAPPA È BILINGUE, ED È LA REGOLA DI TUTTE E TRE LE EDIZIONI

| | |
|---|---|
| **Il fatto** | **il NOME del modulo è nella lingua INSEGNATA, il SOTTOTITOLO in quella dello STUDENTE** |
| **Dove** | §4 della struttura per il nome, la sezione 7 di questo file per il sottotitolo |
| **Misurato il 2026-10-19 sui JSON di `main`** | `inglese/it` → *Repeat Aloud* / «Ripeti ad alta voce» · ⭐ `italiano/es` → *Ripeti ad alta voce* / «Repite en voz alta» |

⭐ **Quindi non c'è nessuna divergenza da allineare: le tre edizioni fanno la stessa cosa.** *Il nome è
un'etichetta nella lingua che si impara — si legge e si riconosce — e la riga sotto spiega cosa fa, nella
lingua in cui si capisce.*

> 🔴 **E vale scrivere come è stata scoperta questa riga: una versione precedente di questo paragrafo
> diceva che `inglese/it` usava la regola opposta, «i suoi nomi sono italiani».** *Era falso, e nessuno
> l'aveva misurato: i nomi di `inglese/it` sono in INGLESE.* ⚠️ **L'ha corretta chi guida il progetto,
> dicendo «prima in `inglese/it` mi sembrava corretto» — e aveva ragione.**
