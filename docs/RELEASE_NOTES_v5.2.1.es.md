# NO AI ACT v5.2.1 — registro detallado con consentimiento

[Italiano](RELEASE_NOTES_v5.2.1.md) · [English](RELEASE_NOTES_v5.2.1.en.md) · [Français](RELEASE_NOTES_v5.2.1.fr.md) · [Deutsch](RELEASE_NOTES_v5.2.1.de.md) · [Español](RELEASE_NOTES_v5.2.1.es.md) · [Português](RELEASE_NOTES_v5.2.1.pt.md)

2026-11-22

Corrección V5.2.1: restaura el doctype y los metadatos en la cabecera del documento del juego y elimina un BOM serializado en el cuerpo. Nuevos controles DOM estáticos protegen el modo estándar y la ubicación de los metadatos. La publicación beta usa la rama de producción beta y comprueba versión y commit.

El juego añade un registro opcional por sesión de adultos que consienten: acciones, pruebas, decisiones, comparaciones, revisiones, ayudas y comentarios. Compartir textos guardados del recorrido guiado requiere un consentimiento adicional.

Cola por pestaña, reintentos idempotentes, confirmación explícita de eventos recibidos, retirada y borrado, exportación personal y recibo privado. Conservación de 90 días; registro hasta 24 horas en la misma pestaña.

El panel privado muestra sesiones y eventos ordenados, con filtros combinados y exportaciones JSON/CSV. Los agregados históricos siguen separados; se corrigen los nombres que ocultaban los casos completados.

Se mantienen los seis idiomas, 14 casos, partidas v1/v2 y textos accesibles. Los controles de consentimiento y el aviso de privacidad están traducidos a los seis idiomas.

Los recorridos individuales antiguos no pueden reconstruirse desde los agregados. Sin garantía de entrega completa, puntuación automática del pensamiento crítico, identificación entre visitas ni activación de Study 02. Sin smoke tests, según lo solicitado; resultados efectivos en el registro de publicación.

[Technical contract / Contratto](v5/SESSION_JOURNAL.md) · [Play](https://www.no-ai-act.eu/play/?lang=es)
