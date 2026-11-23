# Endgültige Überprüfung des methodischen Erfassungsbereichs von V5

[Italiano](../TEST_RESULTS.md) · [English](../en/TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md) · [Deutsch](../de/TEST_RESULTS.md) · [Español](../es/TEST_RESULTS.md) · [Português](../pt/TEST_RESULTS.md)

> Sprachausgabe V5.3.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sechs Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


21. November 2026. Prototyp-Bericht vor dem V5.0.0 Release. Die Tests begannen nach der Implementierung der gesamten Betriebsliste in COVERAGE_COMPLETION.md; Korrekturen folgten neue Durchläufe. Diese Ergebnisse betreffen den lokalen Klon. Veröffentlichungsprüfungen werden separat im Release dokumentiert. Diese Übersetzung zeichnet diese früheren Hinrichtungen auf; es ist kein neuer Rauchtestlauf für V5.0.1.

| Überprüfung | Beobachtetes Ergebnis |
|---|---|
| TypeScript | PASS, einschließlich des Builds nach der Dialogkorrektur |
| Vitest-Suite | 1.509 Tests in 95 Dateien, alle bestanden |
| Vite-Build | PASS; Warnung vor der Größe des Spielbündels, ca. 1,83 MB verkleinert |
| SEO-Prüfung | 155 Routen, keine kritischen Mängel oder Warnungen |
| Dist-Überprüfung | 155/155 Routen, kein Mojibake in HTML, kein externes Sammelformular |
| Geführte Bahn | 45 Fahrten: alle 14 Fälle × IT/EN/FR plus drei Layout-Profile |
| Regression des Katalogs | 42 verstrichene Standardfahrten, korrekte Ergebnisse und Berichte nach dem Nachladen wiederhergestellt |
| Modi | Shift, Free, Surprise, Review × drei Sprachen: 12 Konfigurationen bestanden |
| Study 02 | Zwei Formulare × drei Sprachen × PRE/POST: 12 Konfigurationen bestanden |
| Spieldaten | Synthetische Marker in Hypothesen, Quellen, Relationen und Reflexionen abwesend von localStorage und Telemetrie; reload clears notes |
| Study 02 Daten | Keine Cookies oder Browserspeicherung; nur explizite lokale Kopie; POST mit 405 abgelehnt; Materialien, die vom öffentlichen Bau ausgeschlossen sind |

## Was die geführte Reise abdeckt

Jede Reise beginnt mit dem Fall, vervollständigt drei Einführungsstopps, bewahrt die erste Hypothese, öffnet Dokumente mit den tatsächlichen Schlüsseln des Spiels und zitiert Beweise. Im Notizbuch liest es eine Quelle, kommentiert Herkunft und Grenzen, zeichnet zwei begründete Revisionen und eine erklärte Beziehung auf. Das Klicken und Tippen innerhalb des Dialogs darf die zugrunde liegende Ausstellungsauswahl nicht ändern.

Der Test wird durch die methodische Erinnerung, vier Entscheidungen und Unterzeichnung fortgesetzt. Die Eingabe einer Newline in der Notiz darf nicht unterschreiben. Die Bestätigung behebt den Text vor dem Bericht; spätere Versuche können ihn nicht ändern. Debrief unterscheidet vorherige Notiz, Regel, Reflexion, Feedback-Nutzung und einen New-Case-Plan. Die Sitzungssynthese umfasst alle abgeschlossenen geführten Fälle. Reload löscht den neuen temporären Zustand. Während der Rauchprüfung ist keine externe Anforderung oder POST zulässig.

Profile: IT 1920×1080 und 320×800; EN 390×844 und 640×360; FR 390×844 und 3840×2160. Die Checks umfassen Fokus, Tab, Escape, Multiline-Eingabe und Abwesenheit von Dialogüberlauf. Der letzte 4K-Test verwendet Direct3D11 auf Intel Iris Xe; das erkannte Backend wird in JSON aufgezeichnet. Die anderen fünf Profile verwenden SwiftShader. Dies stellt kein Testen mit physischen Geräten, Bildschirmtastaturen oder echten Bildschirmlesern dar.

Die 14 Fälle werden nach Fixture ausgewählt; Exponate, Entscheidungen und Signierung verwenden die eigentliche Schnittstelle. Dies bestätigt bestehende Engine-Ergebnisse, nicht das Verständnis der Teilnehmer oder die unabhängige rechtliche Genauigkeit des Antwortschlüssels.

## Korrekturen und technische Grenzwerte

1. Der Beobachter von Vite konnte einen Testdownload beobachten, der immer noch von Windows gesperrt war, was zu EBUSY führte. Artefakt- und Local-Graph-Ordner sind jetzt ausgeschlossen. Der komplette Katalog und der geführte Weg gingen an der neuen Ausführung vorbei.
2. Phaser hört auch Mausereignisse im Fenster: Ein Klick auf den nativen Dialog könnte ein Zitat ändern. Der Dialog deaktiviert vorübergehend die Szeneneingabe und stoppt die Zeiger-, Maus- und Touchausbreitung. Der Test reproduziert den Credit Case und verifiziert die unveränderte Ausstellungsauswahl in allen 45 finalen Fahrten.
3. Der Externe-Formen-Check scannte den wachsenden Synthetik-Artefakt-Ordner und timed out. Es schließt jetzt genau Skripte / Rauch / out aus, die nicht ausgeliefert werden. Public-Source- und Dist-Checks bleiben aktiv; die letzte Suite bestanden 1.509 Tests.
4. Ein natives Software-Only 4K-Startup hat im vorhandenen Preload 90 Sekunden überschritten. Die Direct3D11-Diagnose erreichte den Titel in etwa 5,6 Sekunden und die gesamte letzte 4K-Reise, einschließlich des Nachladens, bestanden. Das software-timeout bleibt eine einschränkung dieser konfiguration und wird nicht als behoben beansprucht. Die Rendering Engine wurde nicht verändert.

## Study 02

Die zwölf Konfigurationen überprüfen vier Quellen pro Formular, das Fehlen von Antwortoptionen, freies Argument, die Sperrung der Einreichung, die Nichtverfügbarkeit der Nachbesprechung vor der Einreichung, sieben Beobachtungszeilen und sechs vom Menschen codierte Dimensionen. Nicht beobachtet bleibt von 0 verschieden. Es gibt keine vollständige oder automatische Korrektur. Die JSON-Kopie enthält eingereichten Text und explizite Notizen ohne Teilnehmerkennungen. Tests verwenden nur synthetischen Text.

## Reproduktion

Verwenden Sie im lokalen Klon die in METHODOLOGY_IMPLEMENTATION.md aufgeführten Befehle. Um 4K auf diesem Windows-Computer zu reproduzieren, setzen Sie CHROMIUM_PATH auf installiertes Chrome und INQUIRY_4K_GPU=d3d11. INQUIRY_ONLY und INQUIRY_CASE sind Diagnosefilter; die vollständige Originalüberprüfung hat sie nicht verwendet. JSON berichtet Rekord Viewport, Sprache, Fall und tatsächlichen Renderer.

## Human-Validierung noch erforderlich

Die funktionale Feedback-Abdeckung wird in den angegebenen Konfigurationen implementiert und verifiziert. Pädagogische Effektivität, Argumentqualität, Formularäquivalenz, Übersetzungen, rechtliche Genauigkeit für die Verwaltung und Zugänglichkeit der Hilfstechnologie erfordern die menschlichen Überprüfungen des Protokolls. Es wurde keine Teilnehmerstudie durchgeführt. Kein Spielergebnis wird zu einem automatischen Kritisch-Denken-Score. In der hier aufgezeichneten phase war diese inkremente noch nicht zur produktion veröffentlicht worden.
