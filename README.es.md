# NO AI ACT · v5.3.0

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md)

**Juego serio de investigación sobre el Reglamento europeo de IA**

[▶ Jugar](https://www.no-ai-act.eu/play/?lang=es) · [Sitio y recursos](https://www.no-ai-act.eu/es/) · [Versión estable](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.3.0)

Año 2032, en una ciudad europea ficticia donde el Reglamento de IA nunca entró en vigor. Como inspector, reconstruyes el uso de sistemas de IA mediante documentos, testimonios y registros. El juego es gratuito, de código abierto y funciona en el navegador sin cuenta.

## Cobertura

Las mismas lenguas cubren juego, sitio, recursos educativos, kits de prensa, README y dossier metodológico: italiano, inglés, francés, alemán, español y portugués europeo (pt-PT). Cada lengua incluye los 14 casos y las mismas 37 secciones del portal. Se conservan las URL existentes.

## El recorrido del juego

- Investiga: abre documentos, evalúa su procedencia, cita pruebas y compara fuentes. Decide clasificación, medida, responsabilidad y justificación; firma el informe y debate consecuencias y límites.
- El recorrido guiado integra comprensión, hipótesis, investigación, argumentación autónoma antes del feedback, reflexión final y aplicación a otro caso. Puedes volver a las pruebas y justificar revisiones; la escritura sigue siendo opcional.
- Cuatro modos utilizan los mismos casos: Turno de servicio, Investigación libre, Inspección sorpresa y Repaso de casos cerrados con errores. La duración elegida es un presupuesto orientativo.
- El modo docente ofrece una guía y materiales para la reflexión local. Actividades, tres planes de clase, glosario y artículos temáticos apoyan la preparación y el debate.
- Controles de teclado, capa de lectura accesible y ajustes de audio, texto y movimiento. Se mantiene la compatibilidad de las partidas v2 y de la migración desde v1.

## Método y límites

CEPAJe y LM–GM relacionan contexto, mediación, acciones y evidencias observables. El dossier incluye matrices, rúbrica preliminar y especificación de transferencia. Los comentarios de Julian Alvarez y Federica Pelizzari orientan el rediseño sin implicar respaldo ni validación. La puntuación y el éxito no demuestran aprendizaje ni pensamiento crítico; no hay puntuación automática del pensamiento crítico. La simulación jurídica simplificada no ofrece asesoramiento jurídico ni certificación.

[Método y límites](docs/v5/README.es.md) · [Metodología, comentarios, CEPAJe y LM–GM](docs/v5/es/METHODOLOGY.md) · [Matriz jurídica de los 14 casos](docs/v5/es/LEGAL_LEARNING_MATRIX.md)

## Datos y privacidad

El progreso queda en el navegador. Los contadores agregados pueden desactivarse. Solo las personas adultas pueden consentir un registro pseudónimo de sesión conservado durante 90 días; los textos del recorrido guiado requieren otro consentimiento, inicialmente sin seleccionar. Retirada, supresión y exportación están disponibles en la barra del juego. Se respetan DNT/GPC. Sin cuentas, perfiles publicitarios ni vínculos entre visitas. La recogida usa telemetry.no-ai-act.eu; las API anteriores mantienen la compatibilidad con recibos y exportaciones existentes.

[Datos y privacidad](https://www.no-ai-act.eu/game-statistics.html#es) · [Contrato actual del registro de sesión](docs/v5/es/SESSION_JOURNAL.md)

## Materiales de investigación

Study 02 es un laboratorio local fuera de la versión pública, con dos formas y una rúbrica de codificación humana en seis idiomas. No activa investigación con participantes. La equivalencia lingüística, la validez de la rúbrica y la eficacia educativa aún requieren evaluación con personas. Los resultados de verificación del dossier son históricos.

[Rúbrica y transferencia Study 02](docs/v5/es/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Desarrollo local

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=es
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Autor

Matteo Angeloni: concepto, diseño del juego, desarrollo y contenidos educativos. Doctorando en la Universidad de Tuscia; proyecto independiente sin aprobación institucional implícita. Realizado con ayuda de IA bajo responsabilidad editorial humana.

[Matteo Angeloni](https://www.no-ai-act.eu/es/matteo-angeloni/)

## Licencias

Código GPL-3.0-or-later; contenidos CC BY-SA 4.0. Consulta LICENSE, CREDITS y THIRD_PARTY_LICENSES para atribuciones y componentes. Los títulos de publicaciones y artículos de prensa permanecen en su lengua original.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Documentación técnica e historial

[Versión estable](docs/RELEASE_NOTES_v5.3.0.es.md) · [Método y límites](docs/v5/README.es.md) · [Press kit](https://www.no-ai-act.eu/es/kit-de-prensa/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)
