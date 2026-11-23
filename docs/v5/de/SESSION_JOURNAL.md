# V5.2 — Freiwilliges Einzelsitzungsjournal

[Italiano](../SESSION_JOURNAL.md) · [English](../en/SESSION_JOURNAL.md) · [Français](../fr/SESSION_JOURNAL.md) · [Deutsch](../de/SESSION_JOURNAL.md) · [Español](../es/SESSION_JOURNAL.md) · [Português](../pt/SESSION_JOURNAL.md) · [Nederlands](../nl/SESSION_JOURNAL.md)

> Sprachausgabe V5.4.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sieben Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


22. November 2026. Erledigt den späteren Antrag des Eigentümers, die Sammlung über Aggregate hinaus zu erweitern. Die frühere Beschränkung auf aggregierte Daten verbleibt im historischen V5.0-Dossier. Das Study 02 Protokoll ist unverändert. Diese Übersetzung beschreibt den gleichen bestehenden Dienst, ohne seine Sammlung zu erweitern.

## Verfügbare Beweise

Erst wenn ein Erwachsener zustimmt: eine zufällige Tab-Session-Kennung, Version, Kanal (Produktion; Beta in historischen Aufzeichnungen), anfängliche Sprache und Modus, Schwierigkeitsgrad, ausgewählter Pfad und Zielgruppe; Ereignisse mit UUID, Sequenz, Versuch, Fall, Phase, vom Client deklarierte Zeit, abgelaufene Zeit und Server-Empfangszeit. Das ausgewählte Minutenbudget ist enthalten; es ist keine tatsächliche verstrichene Spielzeit. Die Session-Version ist die Version am Anfang.

| Aktion | Aufzeichnung | Auslegungsgrenzwert |
|---|---|---|
| Eröffnung, Start, Lebenslauf, Navigation | Ereignis und Kontext | Das Öffnen führt nicht zum Lesen |
| Exponate | Index, eröffnet/zitiert, Zusätze/Entfernungen und Entwurf des Status | Keine Aufmerksamkeitsmaßnahme |
| Vergleichsvergleich | Paar der angezeigten Indizes | Erstellt keine korrekte Korrelation |
| Beschlüsse | Einstufung, Maßnahme, Akteur, Begründung, Zitate, Vertrauen | Client-deklarierte Daten können manipuliert werden |
| Vorfall | Canonical Option, einschließlich Tastaturauswahl | Messt keine stabile ethische Disposition |
| Bericht | Signierte Entscheidungen und interne Ergebnisse | Spielergebnis, nicht validierte Kompetenz |
| Geführte Bahn | Hypothese gespeichert/revidiert, Relationen hinzugefügt/entfernt, Feld und Revision zählt | Counts sind nicht Argumentation Qualität |
| Argumentation | Einreichung vor Feedback unterscheidet sich von späterer Reflexion | Kein Critical-Thinking-Scoring |
| Selbstkontrolle | Zählungen aus der optionalen Pre/Post-Übung | Keine implizite externe Validierung |
| Hilfe, Tutorial, Feedback, Überprüfung, Zugänglichkeit | Ereignisse vor der Reduktion durch den Aggregatadapter | Use schafft kein Lernen |
| Tätigkeit | Heartbeat mit Sichtbarkeit, Fokus und neuer Aktivität | Eine Schätzung, ohne Eye Tracking |

Eine **zweite Zustimmung**, die zunächst nicht ausgewählt wurde, ermöglicht Momentaufnahmen des gespeicherten Geführten-Pfad-Schreibens: Hypothesen, Quelleneinschätzungen, Gründe für Beziehungen / Überarbeitungen, Argumentation, Reflexion und Transferplan. Es werden keine einzelnen Tastenanschläge aufgezeichnet. Ein Feld pro Ereignis, höchstens 1.200 Zeichen; serverseitige AES-GCM-Verschlüsselung. Die Benutzeroberfläche fordert die Benutzer auf, persönliche oder sensible Daten zu vermeiden. Das Schreiben erhält keine automatische Bewertung.

Es werden keine Namen, E-Mails, IP-Adressen auf Anwendungsebene, Benutzeragenten, Fingerabdrücke, Standort, Werbung oder Links zwischen Besuchen / Klassen hinzugefügt. Das Journal ist **pseudonym **, nicht als anonym beschrieben.

## Zustimmung und Rechte

Die Einladung ist unter IT/EN/FR/DE/ES/PT-PT verfügbar. Weigerung entfernt keine Spielfunktionen. Vor der Zustimmung wird keine Serversitzung erstellt und es werden keine Journal-Events in die Warteschlange gestellt. Die vorherige Speicherhistorie wird nicht hochgeladen. Derselbe Tab kann sein Tagebuch für 24 Stunden fortsetzen, auch nach dem Neuladen; die Zustimmung führt nicht zu einem anderen Besuch oder Tab. Minderjährige können spielen und werden nicht eingeladen, das einzelne Tagebuch zu aktivieren.

Die Warteschlange, Quittung und private Anmeldeinformationen verwenden den SessionStorage des Tabs. Persönlicher Export unterscheidet empfangene Ereignisse von lokalen ausstehenden Ereignissen. Die herunterladbare Quittung enthält einen Zugangsschlüssel und muss privat bleiben. Es kann zum Exportieren oder Löschen nach dem Schließen der Registerkarte wieder geöffnet werden; es wird die Aufzeichnung nicht neu gestartet. Ohne die Quittung nach dem Schließen des Tabs kann der Controller möglicherweise nicht in der Lage sein, den korrekten Datensatz zu finden, da keine persönliche Identität vorhanden ist.

Die Rücknahme stoppt sofort die Sammlung. Offline-Löschung wird als **ausstehend**, nicht vollständig angezeigt; der Client versucht es erneut. Das Deaktivieren von Statistiken in der Spielleiste widerruft auch das Journal. DNT/GPC verhindern die Aktivierung; wenn später erkannt, stoppen sie die Aufzeichnung und fordern die Löschung an.

Aufzeichnungen werden 90 Tage nach der Zustimmung unzugänglich und werden durch tägliche Bereinigung entfernt. Mit dem Abheben werden alle Ereignisse und der Sitzungsrekord entfernt. Nur eine technische Quittung bleibt bis zum gleichen Ablauf: UUID, Credential Hash, Widerruf und Ablaufdaten, um verspätete erneute Einreichungen abzulehnen.

Rechtsgrundlage: Zustimmung nach DSGVO Artikel 6 Absatz 1 Buchstabe a. Controller: Matteo Angeloni; Kontakte erscheinen auf den Autorenseiten. Cloudflare stellt Worker/D1 bereit und verarbeitet Verbindungsmetadaten für die Bereitstellung und Sicherheit. Die bestehende Datenbank ist in der EU-Gerichtsbarkeit konfiguriert; das garantiert keine Anonymität oder das Fehlen von Übertragungen über die gesamte Infrastruktur. [Sechssprachiger Datenschutzhinweis](https://www.no-ai-act.eu/game-statistics.html).

Der Zweck ist es, das Gameplay und die Lernunterstützung zu korrigieren und zu verbessern. Das 90-Tage-Fenster unterstützt Vergleiche zwischen Iterationen ohne ein unbestimmtes individuelles Archiv. Die Zustimmung erlaubt keine unzusammenhängende oder unverhältnismäßige Erhebung: Die EDPB-Richtlinien 05/2020, Absatz 5, behalten die Notwendigkeit, die Verhältnismäßigkeit und die DSGVO-Grundsätze nach Artikel 5 bei. Die sammlung erstreckt sich nicht auf externes surfen, benannte identifikation, fingerabdrücke oder anfragen nach sensiblen spielerdaten.

## Technischer Vertrag

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` verwenden den gleichen Produktionssammler. Der vorherige `beta.no-ai-act.eu`-Host behält nur die API- und Download-Empfangskompatibilität; das Beta-Spiel wird ausgemustert und auf stable umgeleitet. Keine Datenmigration oder -löschung.

Stabile und historische Ursprünge, begrenzte JSON POST-Anfragen, keine Anmeldeinformationen in URLs, keine Cookies, Payload-Logging deaktiviert. Migration 0007 fügt vier Tabellen hinzu, ohne frühere Zähler neu zu schreiben. In der Datenbank wird nur ein Hash des privaten Belegs gespeichert. `JOURNAL_TEXT_KEY` bleibt außerhalb des Codes und auf beiden Workers identisch; es wird benötigt, um das Schreiben zu verschlüsseln / zu lesen. Verlieren macht das Schreiben unlesbar. Löschen oder drehen Sie es nicht, ohne die noch benötigten Schlüssel zu erhalten. Dies ist keine Ende-zu-Ende-Verschlüsselung: Der Server kann autorisierte Exporte entschlüsseln.

Unveränderliche IDs, explizite Bestätigung einzelner Ereignisse, idempotente Wiederholungen und eine Warteschlange, die das Tab-Reload überlebt. Limits: 30.000 Bytes pro Request, 40 Events pro Batch, 10.000 Events pro Session, 1,4 MB Client-Warteschlange; 5.000 neue Sessions und 50.000 Events pro Tag. Pro-Sitzung Ingestion Rate Limits gelten. Quoten können die Abdeckung unvollständig machen. Keepalive kann die Lieferung nicht garantieren, wenn der Browser schließt, das Netzwerk ausfällt, die Speicherung verweigert wird oder das 24-Stunden-Fenster abläuft.

Das private Cloudflare Access-geschützte Dashboard zeigt **individuelle Sitzungen** zuerst an: kombinierte Filter, Kanal, Version, erhaltene Zählung und schriftliche Zustimmung. Sprache/Modus filtert den anfänglichen Kontext; case wählt Sitzungen aus, die ein Ereignis für diesen Fall enthalten. Seiten enthalten 50 Sitzungen, progressive Zeitleisten laden 200 Ereignisse, JSON / CSV-Export ist verfügbar. Das private Journal hat keine Schwelle von 10. Es zeigt Lücken vor der letzten Sequenz, kann aber keine endgültige Warteschlange enthüllen, die nie erhalten wurde.

## Historische Aufzeichnungen und nicht verfügbare Werte

`usage_case_completed`, `usage_case_left`, `usage_session_completed` werden mit kanonischen Namen in der historischen Ansicht versöhnt. Anfragen nach Dimensionen, die im Backend fehlen, wurden entfernt. Historische Aufzeichnungen behalten Aggregationen und Schwellenwerte bei: Sequenzen, Ergebnisse und Timings, die vom Adapter verworfen wurden ** können nicht rekonstruiert werden **. Fehlende Daten werden nicht durch Nullen, Schätzungen oder erfundene Ereignisse ersetzt.

## Verifizierung und offene Limits

Das V5.2-Release erfasste die Client-/Server-Verifizierung mit echtem SQLite zur Einwilligung, sechs Sprachen, alle 14 Fall-IDs, genaue Eigenschaften, Retries, Sequenzkonflikte, Neuladen, Ablauf, Verschlüsselung, unautorisierter Zugriff, Export, Offline-Entzug und Ingestion-Rennen, Quoten und Aufbewahrung. Es umfasste auch Regression, Client / Worker-Typen, Build, SEO und Distribution. Diese Hinrichtungen sind historisch; diese Übersetzung berichtet nicht über neue Testläufe.

Es wurden keine Rauch- oder Browsertests für diese Version durchgeführt, wie gewünscht. Die visuelle und unterstützende Verifizierung auf realen Geräten bleibt daher begrenzt. Fachsprachliche Überprüfung, kontextspezifische Datenschutzüberprüfung, jeder zukünftige Weg für Minderjährige und Bildungsforschung mit validierten Instrumenten bleiben offen. Keine Billigung durch Alvarez/Pelizzari und keine Aktivierung von Study 02.

## Quellen, die in der vorangegangenen Forschung konsultiert wurden

- [Konsolidierte DSGVO](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [EDPB Zustimmungsrichtlinien](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB ePrivacy Artikel 5 Absatz 3](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Garante Tracking Guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
[W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1-Datenort](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: semantische Inspiration ohne xAPI-Compliance zu beanspruchen.
