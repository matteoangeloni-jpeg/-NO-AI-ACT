# Plan zur Überprüfung des geführten Pfades

[Italiano](../METHODOLOGY_TEST_PLAN.md) · [English](../en/METHODOLOGY_TEST_PLAN.md) · [Français](../fr/METHODOLOGY_TEST_PLAN.md) · [Deutsch](../de/METHODOLOGY_TEST_PLAN.md) · [Español](../es/METHODOLOGY_TEST_PLAN.md) · [Português](../pt/METHODOLOGY_TEST_PLAN.md) · [Nederlands](../nl/METHODOLOGY_TEST_PLAN.md)

> Sprachausgabe V5.4.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sieben Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


Vor der Veränderung. Die Matrizen A, B und C wurden in METHODOLOGY.md und LEGAL_LEARNING_MATRIX.md geschrieben. Der Startcode bietet eine kontextbezogene Anleitung, einen Vergleich, einen Bericht mit vordefinierten Gründen, eine Nachbesprechung und eine Überprüfung. Autonome Produktion und ein expliziter Vergleich zwischen der anfänglichen Interpretation und Feedback fehlen an dieser Baseline.

## Technische Kriterien

| ID | Szenario | Beobachtbares Kriterium |
|---|---|---|
| T1 | Normale Eröffnung von CaseScene | Geführter Pfad als optionale Aktion in IT/EN/FR verfügbar |
| T2 | Verständnis und Hypothese | Lesen Sie den Zweck, schreiben Sie eine Hypothese vor den Exponaten, geben Sie Beweise ein |
| T3 | Überarbeitung während der Untersuchung | Erste Hypothese bleibt lesbar; aktuelle Hypothese ist editierbar |
| T4 | Unterzeichnung | Autonome Notiz erscheint vor der Rückmeldung auf dem gewählten Pfad; Überspringen bleibt möglich |
| T5 | Nach Rückmeldung | Signierte Notiz kann erneut gelesen werden und wird nicht durch spätere Reflexion überschrieben |
| T6 | Neue Session und Reload | Vorübergehende Notizen werden weder gespeichert noch exportiert noch telemetrisch gespeichert. |
| T7 | Escape und Modal | Dialog schließen, Fokus- und Szenensteuerung wiederherstellen; keine Tastenzeichen hinter dem Dialog; Notebook-Klicks ändern die zugrunde liegende Ausstellungsauswahl nicht |
| T8 | Touch und Tastatur | Jede erreichbare Aktion, beschriftete Texteingabe, Fokus beschränkt auf den Dialog |
| T9 | Layout | 320/390 px, Desktop, simuliert 200% Zoom, kurzer Viewport und 4K mit internem Scrollen |
| T10 | Katalog | Alle 14 Fälle und Sprachen sind weiterhin verfügbar; Bewertung und V1/V2-Migration passieren bestehende Armaturen |
| T11 | Wiederfindung | Das Schließen des Dialogs oder das Ändern der Szene hinterlässt kein hängendes Overlay, keinen Zuhörer oder Fokus |
| T12 | Netz | Schriftlicher Text fehlt in den Sammelnutzlasten; kein neuer Endpunkt |
| T13 | Kontextuelle Lernbegleitung | Jeder Fall hat Öffnung, Quelle, Beziehung, Unsicherheit und Nachbesprechung in IT / EN / FR; keine Lösung vor Feedback gezeigt |
| T14 | Provenienz und Beziehungen | Lesen Sie nur geöffnete Quellen; kommentieren Sie jede Quelle; verbinden Sie verschiedene Quellen mit einer freien Erklärung; keine automatische Beurteilung der Beziehung |
| T15 | Explizite Revision | Erste Hypothese intakt; mit Gründen versehene Revisionen verfügbar; signierte Notiz und Beziehungen unveränderlich nach Feedback |
| T16 | Vollständiges Debriefing | Auswahlmöglichkeiten, Regel, frühere Notiz, Feedback-Nutzung und Anwendungsplan; Synthese aller abgeschlossenen geführten Fälle |
| T17 | Unabhängige Aufgabe | Zwei Formulare × drei Sprachen, vier neue Quellen, kein Antwortmenü; Text bei Einreichung gesperrt und Nachbesprechung nicht verfügbar |
| T18 | Beobachtung und Rubrik | Sieben Beobachtungsreihen, sechs manuell kodierte Abmessungen, fehlende Unterscheidung von 0, keine Gesamtgröße, getrennte Rechtskorrektheit |
| T19 | Forschung/öffentliche Trennung | Study 02 Materialien und Werkzeuge, die von Dist- und Spielimporten ausgeschlossen sind; keine POST oder automatische Persistenz im Labor |

Geplante Befehle: npm run typecheck, npm test, npm run build, npm run audit:seo, npm run verification:dist, npm run smoke:guided-inquiry, npm run smoke:release-cases und npm run smoke:final-modes. Technische Tests stellen keine Bildungsvalidierung oder Zugänglichkeitszertifizierung dar.

Erforderlicher Abschlussauftrag. Schreiben Sie alle Lernbegleitung, Komponenten, Übertragungsmaterialien und Beobachtungswerkzeuge, bevor Sie mit den Tests beginnen. Führen Sie dann die gesamte Suite, geführte Rauchabdeckung von 14 Fällen × drei Sprachen und sechs Layout-Profile, Study 02 Abdeckung von zwei Formularen × drei Sprachen × PRE / POST und Katalog / Mode Regressionen. Eine Korrektur, die sich während der Prüfung ergibt, erfordert die Wiederholung der entsprechenden Kontrollen vor der Lieferung. Tests verwenden synthetische Daten und liefern keine Beweise für menschliches Lernen.

Die vorhandenen telemetryMetrics.ts enthält contradictoryEvidenceRecognized, abgeleitet von der Eröffnung bestimmter Ausstellungskategorien. Sein Name kann mehr bedeuten, als das Verhalten zeigt. Behandeln Sie es in Study 02 als technischen Expositions-Proxy; schließen Sie keine Widerspruchserkennung ohne die Erklärung des Teilnehmers ab. Dieses Inkrement ändert das Telemetrieschema nicht.

## Menschliches Protokoll noch zu führen

Rekrutieren Sie Anfänger und erfahrene Teilnehmer mit Zustimmung zur Beobachtung und Notizen. Eine erste Iteration mit 5-8 Teilnehmern pro Profil kann Hindernisse aufdecken, ohne die Wirksamkeit zu schätzen. Notieren Sie CEPAJe Kontext, Sprache, Gerät, Hilfe, Unterbrechungen und Leseschwierigkeiten.

Aufgaben: Erklären Sie den Zweck der Klassifizierung, bilden Sie eine Hypothese, finden und verbinden Sie zwei Quellen, identifizieren Sie eine Alternative, schreiben Sie vor der Unterzeichnung, lesen Sie nach dem Feedback erneut und rechtfertigen Sie die Überarbeitung oder Bestätigung. Der Moderator zeichnet den unabhängigen Erfolg, den Erfolg mit Hilfe, die Nichtvervollständigung, den schwerwiegenden Fehler und den angegebenen Grund auf. Klassifizieren Sie Klicks nicht als kritisches Denken.

Entwurfs-Revisionskriterien. Unfähigkeit, einen Dialog zu beenden, versehentliche Unterzeichnung, Textverlust innerhalb einer Sitzung oder eine Aufforderung, die die Lösung anzeigt, erfordert eine Korrektur, bevor der Prototyp erweitert wird. Legen Sie zum Verständnis eine operative Pilotschwelle fest, z. B. mindestens vier von fünf Anfängern, die die Aufgabe in ihren eigenen Worten erklären. Melden Sie auch diskordante Fälle. Dies ist eine Produktentscheidung, kein Test der Wirksamkeit.

Testen Sie echte Bildschirmleser, Diktat oder vermittelte Transkription, Tastaturnavigation und Berührung mit einer Bildschirmtastatur. Bieten Sie eine gleichwertige mündliche Antwortroute für Personen, die mit Schreibbarrieren konfrontiert sind. Alle drei Sprachen erfordern eine menschliche Überprüfung vor der Rekrutierung für Study 02.

Dies ist der ursprüngliche methodische Verifizierungsplan. Die Übersetzung wiederholt nicht die Rauchtests: Die Lokalisierungskorrektur von V5.0.1 wird mit statischen Sprachprüfungen, Unit-Tests und Build-Tests überprüft, wie vom Eigentümer gewünscht.
