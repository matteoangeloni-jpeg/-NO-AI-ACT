# V5.2 - Diario voluntario de sesión individual

[Italiano](../SESSION_JOURNAL.md) · [English](../en/SESSION_JOURNAL.md) · [Français](../fr/SESSION_JOURNAL.md) · [Deutsch](../de/SESSION_JOURNAL.md) · [Español](../es/SESSION_JOURNAL.md) · [Português](../pt/SESSION_JOURNAL.md)

> Edición lingüística V5.3.0 · 23 de noviembre de 2026. El dossier y los materiales locales de Study 02 están disponibles en seis idiomas. Las fechas, cifras y resultados del prototipo corresponden a ejecuciones históricas. El contrato actual del registro voluntario para adultos figura en SESSION_JOURNAL.md y sustituye la restricción anterior a datos agregados. Las traducciones no demuestran equivalencia de los instrumentos, eficacia educativa ni validez de la rúbrica. No se ejecutaron nuevas pruebas para esta actualización de contenidos.


22 de noviembre de 2026. Implementa la solicitud posterior del propietario para ampliar la colección más allá de los agregados. La restricción anterior a los datos agregados permanece en el expediente histórico V5.0. El protocolo Study 02 es invariable. Esta traducción describe el mismo servicio existente, sin extender su colección.

## Available evidence

Sólo después de que un adulto consiente: un identificador de pestañas al azar, versión, canal (producción; beta en registros históricos), idioma y modo inicial, dificultad, ruta seleccionada y audiencia; eventos con UUID, secuencia, intento, caso, fase, tiempo declarado por el cliente, tiempo transcurrido y tiempo de recepción del servidor. El presupuesto de minutos seleccionado está incluido; no es el tiempo de juego transcurrido. La versión de sesión es la versión al principio.

| Medida | Grabación | Límite interpretativo |
|---|---|---|
| Apertura, inicio, curriculum vitae, navegación | Evento y contexto | La apertura no establece la lectura |
| Exposiciones | Índice, abierto/citado, adiciones/removalaciones y proyecto de estado | No hay medida de atención |
| Comparación | Pareja de índices mostrados | No establece una correlación correcta |
| Decisiones | Clasificación, medida, actor, razón, citas, confianza | Los datos declarados por el cliente pueden ser manipulados |
| Incident | Opción canónica, incluyendo selección de teclado | No mide una disposición ética estable |
| Informe | Opciones firmadas y resultado interno | Resultado del juego, no competencia validada |
| Sendero guiado | Hipótesis salvada/revisada, relaciones agregadas/removidas, recuentos de campo y revisión | Los condes no están razonando calidad |
| Argumento | Presentación antes de la retroalimentación distinguida de la reflexión posterior | No hay puntuación crítica. |
| Comprobación automática | Cuentas del ejercicio opcional pre/post | Ninguna validación externa implícita |
| Ayuda, tutorial, retroalimentación, revisión, accesibilidad | Eventos antes de la reducción por el adaptador agregado | El uso no establece el aprendizaje |
| Actividad | Latidos cardíacos con visibilidad, enfoque y actividad reciente | Una estimación, sin seguimiento de los ojos |

Un segundo consentimiento**, inicialmente no seleccionado, permite instantáneas de escritura guía salvada: hipótesis, evaluaciones de fuentes, razones para las relaciones/revisiones, argumento, reflexión y plan de transferencia. No se registran pulsaciones individuales. Un campo por evento, a la mayoría de 1.200 caracteres; cifrado AES-GCM lado servidor. La interfaz pide a las personas que eviten datos personales o sensibles. La escritura no recibe ninguna evaluación automática.

No se agregan nombres, correos electrónicos, direcciones IP de nivel de aplicación, agentes de usuario, huellas digitales, ubicación, publicidad o enlaces entre visitas/clases. La revista es **pseudonymous**, no se describe como anónima.

## Consentimiento y derechos

La invitación está disponible en IT/EN/FR/DE/ES/PT-PT. El refusal no elimina las características del juego. Antes del consentimiento, no se crea sesión de servidor y no se realizan eventos de revistas. La historia de ahorro anterior no es subida. La misma pestaña puede reanudar su diario durante 24 horas, incluso después de la recarga; el consentimiento no lleva a otra visita o ficha. Los menores pueden jugar y no son invitados a activar la revista individual.

La cola, la recepción y la credencial privada usan la sesión de la fichaStorage. La exportación personal distingue los eventos recibidos de eventos locales pendientes. El recibo descargable contiene una llave de acceso y debe permanecer privado. Se puede reabrir para exportar o borrar después de que la pestaña cierre; no reinicia la grabación. Sin la recepción después de cerrar la pestaña, el controlador puede ser incapaz de encontrar el registro correcto porque no se mantiene ninguna identidad personal.

El retiro de inmediato detiene la colección. El borrado sin conexión se muestra como **pendiente**, no completo; el cliente se registra. Disabling statistics in the game bar also revokes the journal. DNT/GPC evita la activación; si se detecta más adelante, detienen la grabación y solicitan la borración.

Los registros se vuelven inaccesibles 90 días después del consentimiento y se eliminan por limpieza diaria. El retiro elimina todos los eventos y el registro de la sesión. Sólo queda un recibo técnico hasta la misma expiración: UUID, hah credencial, revocación y fecha de vencimiento, para rechazar las remisiones retrasadas.

Base jurídica: consentimiento en virtud del artículo 6 1) a) del RGPD. Controlador: Matteo Angeloni; los contactos aparecen en las páginas del autor. Cloudflare proporciona metadatos de conexión de trabajadores/D1 y procesos para la entrega y seguridad. La base de datos existente está configurada en la jurisdicción de la UE; eso no garantiza el anonimato ni la ausencia de transferencias en toda la infraestructura. [Nota de privacidad de seis idiomas](https://www.no-ai-act.eu/game-statistics.html).

El propósito es corregir y mejorar los soportes de juego y aprendizaje. La ventana de 90 días soporta comparaciones entre iteraciones sin un archivo individual indefinido. El consentimiento no autoriza una colección no relacionada o desproporcionada: las Directrices de la EDPB 05/2020, párrafo 5, conservan la necesidad, la proporcionalidad y los principios del artículo 5 del RGPD. La colección no se extiende a la navegación externa, identificación nombrada, huella dactilar o solicitudes de datos de reproductores sensibles.

## Technical contract

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` utilizan el mismo colector de producción. El host anterior `beta.no-ai-act.eu` retiene la API y la compatibilidad descargada-receipt solamente; el juego beta se retira y redirige a la estabilidad. No hay migración de datos ni supresión.

Origen estable e histórico, solicitudes de JSON POST vinculadas, no credenciales en URLs, no cookies, registro de carga de trabajo deshabilitado. Migración 0007 añade cuatro tablas sin reescribir contadores anteriores. Sólo un hash de la credencial privada se almacena en la base de datos. `JOURNAL_TEXT_KEY` se queda fuera del código y idéntico en ambos Trabajadores; es necesario encriptar/leer escritura. Perderlo hace que la escritura sea imposible de leer. No borre ni gire sin conservar las teclas todavía necesarias. Esto no es cifrado de extremo a extremo: el servidor puede descifrar las exportaciones autorizadas.

IDs inmutables, reconocimiento explícito de eventos individuales, retries idempotent y una cola que sobrevive la recarga de la ficha. Límites: 30.000 bytes por solicitud, 40 eventos por lote, 10.000 eventos por sesión, 1,4 MB consulta cliente; 5.000 nuevas sesiones y 50.000 eventos por día. Se aplican límites de la tasa de ingestión por sesión. Quotas puede hacer que la cobertura sea incompleta. Keepalive no puede garantizar la entrega cuando el navegador cierra, la red falla, se niega el almacenamiento o la ventana de 24 horas expira.

El panel privado protegido por Cloudflare Access muestra **sesiones individuales** primero: filtros combinados, canal, versión, recibido consentimiento de cuenta y escritura. Contexto inicial de filtro de lenguaje/modo; caso selecciona sesiones que contienen un evento para ese caso. Las páginas contienen 50 sesiones, plazos progresivos cargan 200 eventos, JSON/CSV export está disponible. La revista privada no tiene umbral de 10. Muestra lagunas antes de la última secuencia, pero no puede revelar una cola final nunca recibida.

## Registros históricos y valores indisponibles

`usage_case_completed`, `usage_case_left`, `usage_session_completed` se reconcilian con nombres canónicos en la vista histórica. Se retiraron las solicitudes de dimensiones ausentes del backend. Los registros históricos conservan la agregación y los umbrales: secuencias, resultados y tiempos desechados por el adaptador **no se puede reconstruir**. Los datos perdidos no son reemplazados por ceros, estimaciones o eventos inventados.

## Verificación y límites abiertos

La versión V5.2 registró la verificación cliente/servidor con SQLite real para el consentimiento, seis idiomas, los 14 IDs de caso, propiedades exactas, registros, conflictos de secuencia, recarga, caducidad, encriptación, acceso no autorizado, exportación, retiro sin conexión y razas de ingestión, cuotas y retención. También cubrió regresión, tipos de cliente/trabaja, construcción, SEO y distribución. Esas ejecuciones son históricas; esta traducción no reporta nuevas pruebas.

No se realizaron pruebas de humo o de navegador para esa liberación, como se solicitó. Por lo tanto, la verificación visual y de asistencia en dispositivos reales sigue siendo limitada. Sigue abierta la revisión lingüística especializada, la revisión de la privacidad específica del contexto, cualquier camino futuro para los menores y la investigación educativa con instrumentos validados. No hay respaldo de Alvarez/Pelizzari ni activación de Study 02.

## Fuentes consultadas en la investigación anterior

- [GPD consolidado](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [Directrices de consentimiento de la Junta](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB, artículo 5(3) de ePrivacy](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Directrices de seguimiento de Garante](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1 localización de datos](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare, limitación de frecuencia](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: inspiración semántica sin reclamar el cumplimiento de xAPI.
