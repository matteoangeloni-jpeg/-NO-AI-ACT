# Operationelle Abdeckung des Feedbacks

[Italiano](../COVERAGE_COMPLETION.md) · [English](../en/COVERAGE_COMPLETION.md) · [Français](../fr/COVERAGE_COMPLETION.md) · [Deutsch](../de/COVERAGE_COMPLETION.md) · [Español](../es/COVERAGE_COMPLETION.md) · [Português](../pt/COVERAGE_COMPLETION.md) · [Nederlands](../nl/COVERAGE_COMPLETION.md)

> Sprachausgabe V5.4.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sieben Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


Inkrement, das vom Eigentümer am 21. November 2026 beantragt wurde Diese Liste definiert die Arbeiten, die vor Beginn der neuen endgültigen Überprüfung durchzuführen sind.

| Anforderungen | Durchführung | Nachprüfbare Komponente |
|---|---|---|
| A1 — Anfängerverständnis | Fallspezifische Lernbegleitung für alle 14 Fälle in den drei Sprachen | inquiryCases.ts; Dialog, 42 Fallkarten |
| A2 — Szenen innerhalb der Sequenz | Progressive Einführung, Kontexthilfe zwischen Exponaten und Klassifikation, wiedereröffnbare Führung | CaseScene, drei kurze Stopps; DecisionScene, Methode |
| A3 — Abschlussbesprechung | Rekonstruieren Sie Gründe, vergleichen Sie mit den Regeln und dem Feedback des Falls, synthetisieren Sie am Sitzungsende | ReportScene; SessionEndScene; Feedback und Session |
| P1 — Exploration von Quellen | Lesen Sie die geöffneten Exponate erneut und bewerten Sie deren Herkunft und Zuverlässigkeit mit Gründen | Quellen und WriteSource; separate menschliche Beobachtung |
| P2 — Korrelation | Vom Spieler erstellte Quellpaare, mit einer Beziehung und Erklärung | Relation, Stützen/Herausforderungen/unsichere Relation, keine automatische Korrektur |
| P3 — Hypothesen und Revision | Bewahren Sie die erste Hypothese auf und zeichnen Sie explizite, begründete Revisionen auf | finishEinführung; recordRevision; Snapshot |
| P4 — autonomes Argument | Anspruch, Beweise, alternative, logische Verbindung zu einer Maßnahme und Verantwortung vor Feedback | Argumentation, Argumentation; vor der Lösung einreichen |
| P5 — Unsicherheit | Fehlende Informationen und Konsequenzen für Menschen und Rechte | Unsicherheit; unterschiedliche Lernbegleitung für jeden Fall |
| P6 — Verwendung von Feedback | Vergleichen Sie mit dem früheren Text, pflegen oder überarbeiten Sie ein Kriterium, planen Sie einen neuen Fall | reflection, feedbackUse, transferPlan; Session-Synthese |
| P7 — Beobachtung und Triangulation | Separates lokales Tool für strukturierte Beobachtung und menschliche Rubric-Codierung | Study 02: sieben Beobachtungsreihen, sechs Dimensionen, CEPAJe Kontext |
| P8 — unabhängiger Transfer | Zwei vollständige IT/EN/FR-Formulare, Originaldokumente, kostenlose Antwort vor der Nachbesprechung versiegelt, funktionierendes lokales Tool | research/study02; lokaler GET/HEAD-Server; 12 Konfigurationen |
| Grenzen | Original 14 Fälle, bestehende Migrationen und Scoring, temporäre In-Game-Notizen, vom öffentlichen Build ausgeschlossenes Forschungsmaterial | Katalogisierung, Speicherung, Datenschutz, Netzwerk- und Dist-Tests |

Die operative Abdeckung betrifft Inhalte und Funktionen. Wirksamkeit und Gültigkeit von Schlussfolgerungen erfordern Teilnehmer, Rezensenten und Analysen nach dem Study 02-Protokoll. Der Abschlussbericht unterscheidet Umsetzung, technische Verifizierung und menschliche Verifizierung.

Die Tests begannen, nachdem alle Zeilen implementiert worden waren. Nach Korrekturen während der endgültigen Überprüfung folgten neue Durchläufe. TEST_RESULTS.md zeichnet 1.509 Einzeltests, 45 geführte Fahrten, 42 Standardfahrten, 12 Modus-/Sprachkonfigurationen und 12 Study 02 Konfigurationen auf, die mit den tatsächlichen Überprüfungsgrenzen bestanden wurden.

Diese operativen IDs erweitern das Feedback P1–P5 in der methodischen Matrix A: das operative P1–P5 erweitert hauptsächlich seine P2-Reihe; P6 erweitert P4; P7/P8 implementiert P3/P5. Sie schreiben den befragten Personen keine neuen Beobachtungen zu. Pädagogische Kriterien und interpretative Grenzen bleiben diejenigen der Matrizen A / B.
