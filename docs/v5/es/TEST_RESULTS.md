# Verificación final de la cobertura metodológica V5

[Italiano](../TEST_RESULTS.md) · [English](../en/TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md) · [Deutsch](../de/TEST_RESULTS.md) · [Español](../es/TEST_RESULTS.md) · [Português](../pt/TEST_RESULTS.md)

> Edición lingüística V5.3.0 · 23 de noviembre de 2026. El dossier y los materiales locales de Study 02 están disponibles en seis idiomas. Las fechas, cifras y resultados del prototipo corresponden a ejecuciones históricas. El contrato actual del registro voluntario para adultos figura en SESSION_JOURNAL.md y sustituye la restricción anterior a datos agregados. Las traducciones no demuestran equivalencia de los instrumentos, eficacia educativa ni validez de la rúbrica. No se ejecutaron nuevas pruebas para esta actualización de contenidos.


21 de noviembre de 2026. Informe de tipo anterior a la versión V5.0.0. Las pruebas comenzaron después de la aplicación de toda la lista operacional en COVERAGE_COMPLETION.md; las correcciones fueron seguidas por nuevas carreras. Estos resultados se refieren al clon local. Los cheques de publicación se documentan por separado en la versión. Esta traducción registra esas ejecuciones anteriores; no es una nueva prueba de humo para V5.0.1.

| Check | Resultado observado |
|---|---|
| TipoScript | PASS, incluyendo la construcción después de la corrección de diálogo |
| Vitest suite | 1.509 pruebas en 95 archivos, todos aprobados |
| Vite build | PASS; advertencia de tamaño abundante juego, aproximadamente 1,83 MB |
| Auditoría de la SEO | 155 rutas, sin defectos críticos o advertencias |
| Verificación de desechos | 155/155 rutas, sin mojibake en HTML, sin formulario de colección externa |
| Sendero guiado | 45 viajes pasados: los 14 casos × IT/EN/FR más tres perfiles de diseño |
| Regreso del catálogo | 42 viajes estándar pasados, resultados correctos e informes restaurados después de la recarga |
| Modos | Shift, Free, Surprise, Review × tres idiomas: 12 configuraciones aprobadas |
| Study 02 | Dos formas × tres idiomas × PRE/POST: 12 configuraciones pasadas |
| Datos del juego | Marcadores sintéticos en hipótesis, fuentes, relaciones y reflexiones ausentes de localStorage y telemetría; reload clears notes |
| Study 02 datos | No hay cookies ni almacenamiento del navegador; copia local explícita solamente; POST rechazado con 405; materiales excluidos de la construcción pública |

## Lo que cubre el viaje guiado

Cada viaje comienza desde el caso, completa tres paradas introductorias, preserva la primera hipótesis, abre documentos con las claves reales del juego y cita evidencia. En el cuaderno, relee una fuente, anota la procedencia y los límites, registra dos revisiones razonadas y una relación explicada. Hacer clic y escribir dentro del diálogo no debe cambiar la selección de la exposición subyacente.

La prueba continúa con el recordatorio metodológico, cuatro decisiones y firma. Entrar una nueva línea en la nota no debe firmar. La confirmación fija el texto antes del informe; los intentos posteriores no pueden alterarlo. Debrief distingue la nota anterior, la regla, la reflexión, el uso de la retroalimentación y un nuevo plan. La síntesis de la sesión incluye todos los casos guiados completados. Recarga despeja el nuevo estado temporal. No se permite ninguna solicitud externa o POST durante la prueba de humo.

Perfiles: IT 1920×1080 y 320×800; EN 390×844 y 640×360; FR 390×844 y 3840×2160. Comproba el foco de cubierta, Tab, Escape, entrada multilínea y ausencia de desbordamiento de diálogo. La prueba 4K final utiliza Direct3D11 en Intel Iris Xe; el backend detectado se registra en JSON. Los otros cinco perfiles usan SwiftShader. Esto no constituye pruebas con dispositivos físicos, teclados en pantalla o lectores de pantalla real.

Los 14 casos son seleccionados por dispositivo; exhibiciones, decisiones y firma utilizan la interfaz real. Esto confirma los resultados del motor existentes, no la comprensión de los participantes o la precisión jurídica independiente de la clave de respuesta.

## Correcciones y límites técnicos

1. Vite's watcher podría observar una descarga de prueba todavía bloqueada por Windows, causando EBUSY. Ahora se excluyen carpetas artesanales y gráficas locales. El catálogo completo y el camino guiado pasaron por la nueva ejecución.
2. Phaser también escucha los eventos del ratón en la ventana: hacer clic en el diálogo nativo podría cambiar una citación. El diálogo deshabilita temporalmente la entrada de escena y detiene puntero, ratón y propagación táctil. La prueba reproduce el caso de crédito y verifica la selección de exposiciones sin cambios en los 45 viajes finales.
3. Las formas externas revisaron escaneando la creciente carpeta de artefactos sintéticos y cronometrada. Ahora excluye exactamente scripts/smoke/out, que no es fuente de envío. Los cheques de fuente pública y dist permanecen activos; la suite final aprobó 1.509 pruebas.
4. La startup de 4K de software nativo superó 90 segundos en el Preload existente. El diagnóstico Direct3D11 alcanzó el Título en aproximadamente 5.6 segundos, y todo el último viaje 4K, incluyendo la recarga, pasó. El cronograma de software sigue siendo una limitación de esa configuración y no se reclama fijo. El motor de renderización no fue cambiado.

## Study 02

Las doce configuraciones verifican cuatro fuentes por forma, ausencia de opciones de respuesta, argumentos libres, bloqueo de la presentación, desbloqueo no disponible antes de la presentación, siete filas de observación y seis dimensiones humanas codificadas. No se observan restos distintos de 0. No hay corrección total o automática. La copia JSON incluye texto presentado y notas explícitas sin identificadores de participante. Las pruebas utilizan sólo texto sintético.

## Reproduction

En el clon local, utilice los comandos enumerados en METHODOLOGY_IMPLEMENTATION.md. Para reproducir 4K en esta máquina de Windows, configure CHROMIUM_PATH para instalar Chrome e INQUIRY_4K_GPU=d3d11. INQUIRY_ONLY e INQUIRY_CASE son filtros de diagnóstico; la verificación original completa no los usó. JSON reporta un registro de visualización, lenguaje, caso y renderizado real.

## Human validation still required

La cobertura de retroalimentación funcional se aplica y verifica en las configuraciones indicadas. La eficacia educativa, la calidad de los argumentos, la equivalencia de forma, las traducciones, la precisión jurídica para la administración y la accesibilidad de la tecnología de asistencia requieren los controles humanos del protocolo. No se ha realizado ningún estudio de los participantes. Ningún resultado del juego se convierte en una partitura de pensamiento crítico automático. En la etapa registrada aquí, este aumento aún no había sido publicado a la producción.
