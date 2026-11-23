# Incremento metodológico V5 — cobertura completa

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](../fr/METHODOLOGY_IMPLEMENTATION.md) · [Deutsch](../de/METHODOLOGY_IMPLEMENTATION.md) · [Español](../es/METHODOLOGY_IMPLEMENTATION.md) · [Português](../pt/METHODOLOGY_IMPLEMENTATION.md) · [Nederlands](../nl/METHODOLOGY_IMPLEMENTATION.md)

> Edición lingüística V5.4.0 · 23 de noviembre de 2026. El dossier y los materiales locales de Study 02 están disponibles en siete idiomas. Las fechas, cifras y resultados del prototipo corresponden a ejecuciones históricas. El contrato actual del registro voluntario para adultos figura en SESSION_JOURNAL.md y sustituye la restricción anterior a datos agregados. Las traducciones no demuestran equivalencia de los instrumentos, eficacia educativa ni validez de la rúbrica. No se ejecutaron nuevas pruebas para esta actualización de contenidos.


rama de trabajo `codex/v5-methodology-guided-path`, base principal `527fde5`. Revisión del 21 de noviembre de 2026. En el presente informe se registra la terminación local antes de la puesta en libertad. El propietario posteriormente autorizó la publicación como V5.0.0; el estado de liberación y las notas están disponibles en GitHub y en [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md).

## Cambios implementados

| Componente | Comportamiento |
|---|---|
| CasoEscena e investigaciónCases | Tres paradas introductorias y cinco soportes específicos para cada uno de los 14 casos, en IT/EN/FR |
| EvidenceScene and notebook | Reread open documents, assess provenance, freely connect two sources with a reason |
| InquirySession | Preserve the first hipothesis, explicitly record reasoned revisions, seal a copy of argument, sources and relations before feedback |
| Decisiones | Recordatorio contextual, apoyo reabsible y nota autónoma que cubre la reclamación, pruebas, razonamientos, alternativas e incertidumbre antes de firmar |
| ReportScene | Opciones de caso y regla, nota anterior, reflexión, comprobación de la retroalimentación y el plan de aplicación mantuvieron distintos |
| SessionEndScene | Debrief of all completed guided cases, cross-case syn and strategy for new contexts |
| Diálogo accesible | HTML semántico, etiquetas, selecciones/detalles nativos, Escape, enfoque confinado y restaurado, desplazamiento interno; puntero aislar y teclado de la escena |
| Local Study 02 | Dos nuevas formas con cuatro fuentes originales cada una en tres idiomas, texto libre bloqueado en la presentación, sin corrección automática |
| Observación y rúbrica | CEPAJe contexto, siete filas de observación, seis dimensiones codificadas por humanos, corrección legal separada |
| Separación de los datos | Notas de juego sólo en memoria; laboratorio fuera dist, loopback GET/HEAD server, explícita descarga local solamente |

El camino preserva la narrativa, 14 casos, razones predefinidas, resultados originales y puntuaciones. Escribir o proponer una relación no otorga puntos y no produce ninguna evaluación crítica-pensamiento. La mediación pregunta sobre pruebas y circunstancias sin revelar una solución legal antes de la retroalimentación. Matrix C documenta alineación con la consolidación de la UE del 27 de julio de 2026 en EUR-Lex.

## Trazabilidad y materiales

Matrices A/B, el mapa LM–GM, el análisis CEPAJe y la bibliografía están en METODOLOGÍA.md; matriz C está en LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md vincula los comportamientos solicitados a los componentes. ARGUMENTATION_STUDY02.md contiene rúbricas, diseño, triangulación y el plan de análisis. Los correos electrónicos originales fueron leídos; las referencias y la trazabilidad privada permanecen en el expediente del propietario, fuera de la construcción pública. No se presenta ninguna retroalimentación como aprobación.

## Verificación final

La aplicación se completó antes de iniciar los nuevos ensayos, como se solicitó. Los resultados de la versión parcial anterior no certifican este aumento. La verificación final y sus resultados se registran en TEST_RESULTS.md después de la ejecución. Las pruebas automatizadas utilizan sólo materiales sintéticos y accesorios explícitos.

Comandos: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Local use

Juego: `npm run dev`, abierto `/play/?lang=en`, seleccione un caso y PATH GUIDED. La mediación precede a las exposiciones. Las notas son opcionales y desaparecen en la recarga o en un nuevo juego; el texto escrito no entra en los ahorros del juego, las exportaciones ni la telemetría.

Estudio: `npm run study02:local`, abierto `http://127.0.0.1:4262/` y selecciona Inglés. PRE/POST utilizar fichas separadas y formas contrabalanceadas. La herramienta no gestiona la identidad, el consentimiento, la aleatorización, el reclutamiento o la retención institucional: pertenecen al protocolo autorizado externamente. El informe sigue siendo discapacitado antes de su presentación. Descarga explícita guarda texto enviado y notas humanas en el dispositivo.

Referencia de humo: `CHROMIUM_PATH` puede seleccionar instalado Chrome. `INQUIRY_PORT` elige el puerto. `INQUIRY_ONLY` limita un perfil para el diagnóstico; la verificación metodológica completa original usó todos los perfiles. La cobertura guiada comprende 14 casos × tres idiomas más tres perfiles de diseño: 45 viajes. Study 02 consta de dos formas × tres idiomas × PRE/POST: 12 configuraciones. Estos comandos documentan que la verificación; no son repetidas para la corrección de localización.

En esta máquina de Windows, `INQUIRY_4K_GPU=d3d11` solicita Direct3D para el perfil 3840×2160 solamente; otros perfiles utilizan el renderizador de software de la prueba. Cada resultado registra el backend real, y las reproducciones deben revelar esta diferencia. Solo 4K de software superó el tiempo de 90 segundos en el Preload existente. El diagnóstico de GPU alcanzó el Título en unos 5.6 segundos. Esto no es una estimación general de rendimiento.

## Open limits

- La cobertura de contenido/función es distinta de la validez educativa. Se necesitan pilotos, observaciones, producciones y una tarea independiente; no se ha realizado ningún estudio humano.
- Rubric, equivalencia de formularios y traducciones son preliminares: revisión bilingüe, entrevistas cognitivas, anclas y acuerdo inter-rater siguen siendo necesarios.
- La mediación es textual. La densidad, el pacto y la autonomía deben ser verificadas en el contexto CEPAJe; las respuestas orales equivalentes requieren mediación autorizada.
- Los lectores de pantalla real, dictado, teclados en pantalla y dispositivos físicos necesitan pruebas humanas. Los cheques automatizados no certifican la accesibilidad universal.
- La nota autónoma sigue las alternativas del informe y su posible efecto de fijación se aborda metodológicamente a través de la tarea externa.
- La primera nota es la declaración del jugador. La exposición previa a un caso puede influir en él; la base de investigación es un PRE independiente antes del juego en una nueva sesión.
- Las notas de juego no son seguimiento individual. Una apertura o revisión no demuestra comprensión: la triangulación se basa en explicaciones y la observación humana externa.
- Nuevos materiales requieren revisión legal humana antes de la administración. Las respuestas de los 14 casos no han sido modificadas.
- La bibliografía es una encuesta dirigida; cada entrada revela límites en el acceso a texto completo.
- El informe técnico original precede a la publicación; el estado de publicación se registra por separado en V5.0.0.

## Deliverables

| Solicitud | Resultado |
|---|---|
| Método y bibliografía europea | METODOLOGÍA.md |
| Matriz de retroalimentación | Matriz A y COVERAGE_COMPLETION.md; dossier privado separado |
| LM–GM | METODOLOGÍA.md |
| CEPAJe | METODOLOGÍA.md; contexto de laboratorio |
| Sendero guiado | indagaciónCases, GuidedInquiryDialog y escenas del juego |
| Ciclo de investigación y retroinformación | Revisiones, nota sellada y reflexión separada |
| Rubric | ARGUMENTATION_STUDY02.md y laboratorio manual |
| Transferencia Study 02 | Dos formas completas en investigación/estudio02 |
| Pruebas | METODOLOGÍA_TEST_PLAN.md y TEST_RESULTS.md |
| Cambios y límites | Este documento |
