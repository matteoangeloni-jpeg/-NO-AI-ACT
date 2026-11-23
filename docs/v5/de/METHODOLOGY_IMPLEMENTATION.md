# V5 methodische Zuwachsrate — vollständiger Erfassungsbereich

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](../fr/METHODOLOGY_IMPLEMENTATION.md) · [Deutsch](../de/METHODOLOGY_IMPLEMENTATION.md) · [Español](../es/METHODOLOGY_IMPLEMENTATION.md) · [Português](../pt/METHODOLOGY_IMPLEMENTATION.md) · [Nederlands](../nl/METHODOLOGY_IMPLEMENTATION.md)

> Sprachausgabe V5.4.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sieben Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


Arbeitszweig `codex/v5-methodology-guided-path`, Hauptbasislinie `527fde5`. Revision vom 21. November 2026. Dieser Bericht zeichnet die lokale Fertigstellung vor der Veröffentlichung auf. Der Eigentümer hat anschließend die Veröffentlichung als V5.0.0 genehmigt; Veröffentlichungsstatus und Notizen sind auf GitHub und in [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md) verfügbar.

## Umgesetzte Änderungen

| Komponente | Verhalten |
|---|---|
| CaseScene und inquiryCases | Drei Einführungsstopps und fünf fallspezifische Unterstützungen für jeden der 14 Fälle, in IT/EN/FR |
| EvidenceScene und Notebook | Geöffnete Dokumente erneut lesen, Herkunft bewerten, zwei Quellen frei mit einem Grund verbinden |
| GuidedInquirySession | Bewahren Sie die erste Hypothese auf, notieren Sie explizit begründete Revisionen, versiegeln Sie eine Kopie von Argumenten, Quellen und Beziehungen vor dem Feedback |
| DecisionScene | Kontextbezogene Erinnerung, wiedereröffnete Unterstützung und autonome Notiz über Ansprüche, Beweise, Argumentation, Alternative und Unsicherheit vor der Unterzeichnung |
| ReportSzene | Fallwahl und Regel, frühere Notiz, Reflexion, Überprüfung von Feedback und Anwendungsplan getrennt gehalten |
| SessionEndSzene | Nachbesprechung aller abgeschlossenen Guided Cases, Querschnittssynthese und Strategie für neue Kontexte |
| Zugänglicher Dialog | Semantisches HTML, Labels, native Selects/Details, Escape, eingeschränkter und wiederhergestellter Fokus, internes Scrollen; Zeiger und Tastatur von der Szene isolieren |
| Lokal Study 02 | Zwei neue Formulare mit je vier Originalquellen in drei Sprachen, freier Text bei Einreichung gesperrt, keine automatische Korrektur |
| Beobachtung und Rubrik | CEPAJe Kontext, sieben Beobachtungsreihen, sechs menschenkodierte Dimensionen, rechtliche Korrektheit getrennt |
| Datentrennung | Spielnotizen nur im Speicher; Labor außerhalb dist, Loopback GET/HEAD Server, nur expliziter lokaler Download |

Der Pfad bewahrt die Erzählung, 14 Fälle, vordefinierte Gründe, ursprüngliche Ergebnisse und Punktzahlen. Das schreiben oder vorschlagen einer beziehung vergibt keine punkte und erzeugt keine kritische denkende einschätzung. Lernbegleitung fragt nach Beweisen und Umständen, ohne vor dem Feedback eine rechtliche Lösung preiszugeben. Matrix C dokumentiert die Angleichung an die EU-Konsolidierung vom 27. Juli 2026, die auf EUR-Lex überprüft wurde.

## Rückverfolgbarkeit und Materialien

Matrizen A/B, die LM–GM-Karte, CEPAJe-Analyse und Bibliographie sind in METHODOLOGY.md; Matrix C ist in LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md verknüpft die angeforderten Verhaltensweisen mit Komponenten. ARGUMENTATION_STUDY02.md enthält Rubriken, Design, Triangulation und den Analyseplan. Original-E-Mails wurden gelesen; Referenzen und private Rückverfolgbarkeit bleiben im Dossier des Eigentümers, außerhalb des öffentlichen Builds. Kein Feedback wird als Billigung präsentiert.

## Endgültige Überprüfung

Die Umsetzung wurde wie gewünscht vor Beginn der neuen Tests abgeschlossen. Ergebnisse aus der früheren Teilversion bestätigen dieses Inkrement nicht. Die endgültige Überprüfung und ihre Ergebnisse werden nach der Ausführung in TEST_RESULTS.md aufgezeichnet. Automatisierte Tests verwenden nur synthetische Materialien und explizite Vorrichtungen.

Befehle: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Lokale Nutzung

Spiel: `npm run dev`, geöffnet `/play/?lang=en`, wählen Sie einen Fall und GUIDED PATH. Die Lernbegleitung geht den Exponaten voraus. Notizen sind optional und verschwinden beim Nachladen oder einem neuen Spiel; geschriebener Text gibt weder Spiel speichert, exportiert noch Telemetrie.

Studie: `npm run study02:local`, öffnen Sie `http://127.0.0.1:4262/` und wählen Sie Englisch. PRE/POST verwenden separate Tabs und Gegenformulare. Das Tool verwaltet keine Identität, Zustimmung, Randomisierung, Rekrutierung oder institutionelle Aufbewahrung: Diese gehören zum extern autorisierten Protokoll. Debrief bleibt vor der Einreichung deaktiviert. Expliziter Download speichert eingereichten Text und menschliche Notizen auf dem Gerät.

Rauchreferenz: `CHROMIUM_PATH` kann installiertes Chrome auswählen. `INQUIRY_PORT` wählt den Port aus. `INQUIRY_ONLY` begrenzt ein Profil für die Diagnose; die ursprüngliche vollständige methodische Überprüfung verwendete alle Profile. Geführte Abdeckung umfasst 14 Fälle × drei Sprachen plus drei Layout-Profile: 45 Fahrten. Study 02 umfasst zwei Formulare × drei Sprachen × PRE/POST: 12 Konfigurationen. Diese Befehle dokumentieren diese Überprüfung; sie werden für die Lokalisierungskorrektur nicht erneut ausgeführt.

Auf diesem Windows-Computer fordert `INQUIRY_4K_GPU=d3d11` Direct3D nur für das 3840×2160-Profil an; andere Profile verwenden den Software-Renderer des Tests. Jedes Ergebnis zeichnet das tatsächliche Backend auf, und Reproduktionen müssen diesen Unterschied offenlegen. Software-only 4K-Startup übertraf das 90-Sekunden-Timeout im bestehenden Preload. Die GPU-Diagnose erreichte Titel in etwa 5,6 Sekunden. Dies ist keine verallgemeinerbare Leistungsschätzung.

## Offene Grenzwerte

- Die Inhalts- / Funktionsabdeckung unterscheidet sich von der Bildungsgültigkeit. Anfängerpiloten, Beobachtung, Produktionen und eine unabhängige Aufgabe sind erforderlich; Es wurde keine menschliche Studie durchgeführt.
- Rubrik, Formularäquivalenz und Übersetzungen sind vorläufig: bilinguale Überprüfung, kognitive Interviews, Anker und Inter-Rater-Vereinbarung bleiben notwendig.
- Lernbegleitung ist textuell.Dichte, Tempo und Autonomie müssen im CEPAJe-Kontext überprüft werden; gleichwertige mündliche Antworten erfordern eine autorisierte Lernbegleitung.
Echte Bildschirmleser, Diktate, On-Screen-Tastaturen und physische Geräte benötigen menschliche Tests. Automatisierte Kontrollen zertifizieren keine universelle Zugänglichkeit.
- Die autonome Note folgt den Alternativen des Berichts. Ihr möglicher Cueing-Effekt wird methodisch durch die externe Aufgabe angegangen.
- Die erste Note ist die Aussage des Spielers. Frühere Exposition gegenüber einem Fall kann es beeinflussen; Die Forschungs-Baseline ist eine unabhängige PRE vor dem Gameplay in einer neuen Sitzung.
- Spielnotizen sind kein individuelles Tracking. Eine Öffnung oder Revision zeigt kein Verständnis: Triangulation beruht auf Erklärungen und externer menschlicher Beobachtung.
- Neue Materialien erfordern eine menschliche rechtliche Überprüfung vor der Verwaltung. Die Antworten der 14 Fälle wurden nicht geändert.
- Die Bibliographie ist eine gezielte Umfrage; jeder Eintrag offenbart Grenzen für den Volltextzugriff.
- Der ursprüngliche technische Bericht geht der Veröffentlichung voraus; der Release-Status wird separat in V5.0.0 aufgezeichnet.

## Lieferungen

| Antrag | Ergebnis |
|---|---|
| Methode und europäische Bibliographie | METHODOLOGIE.md |
| Rückkopplungsmatrix | Matrix A und COVERAGE_COMPLETION.md; privates Dossier getrennt |
| LM–GM | METHODOLOGIE.md |
| CEPAJe | METHODOLOGY.md; Laborkontext |
| Geführte Bahn | inquiryCases, GuidedInquiryDialog und Spielszenen |
| Untersuchungszyklus und Feedback | Revisionen, versiegelte Note und gesonderte Reflexion |
| Rubel | ARGUMENTATION_STUDY02.md und manuelles Labor |
| Study 02 Übertragung | Zwei vollständige Formulare in Forschung/Studie02 |
| Prüfungen | METHODOLOGIE_TEST_PLAN.md und TEST_RESULTS.md |
| Änderungen und Limits | Dieses Dokument |
