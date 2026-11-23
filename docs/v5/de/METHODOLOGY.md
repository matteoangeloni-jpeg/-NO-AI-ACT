# NO AI ACT V5 — methodischer Entwurf

[Italiano](../METHODOLOGY.md) · [English](../en/METHODOLOGY.md) · [Français](../fr/METHODOLOGY.md) · [Deutsch](../de/METHODOLOGY.md) · [Español](../es/METHODOLOGY.md) · [Português](../pt/METHODOLOGY.md) · [Nederlands](../nl/METHODOLOGY.md)

> Sprachausgabe V5.4.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sieben Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.


Revision vom 21. November 2026. Baseline überprüft auf der lokalen Zweigstelle von Main 527fde5. Einsatz von PR 128 erfolgreich abgeschlossen. Der Eigentümer hat anschließend die Veröffentlichung als V5.0.0 genehmigt; Release Notes und Status sind in [RELEASE_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md) und im GitHub-Release verfügbar.

## Entwurfsentscheidung

Verständnis → Hypothese → Untersuchung → Argument → Feedback → Transfer wird als provisorische Struktur angenommen, die eine Rückkehr von Untersuchung zu Hypothese und von Feedback zu weiteren Untersuchungen ermöglicht. Eine starre lineare Progression würde die Revision, die wir beobachten wollen, verhindern. Die erste Hypothese bleibt sichtbar, wenn sie neu formuliert wird. Die Pre-Feedback-Note wird vor der Unterzeichnung fixiert und bleibt von der späteren Reflexion getrennt.

Die Spieler wählen den geführten Weg in einem Fall. Kurze Mediationsszenen nutzen die Rolle des Mitinspektors und die eigenen Dokumente der Geschichte. Die Klassifizierung hilft zu entscheiden, welche Kontrollen, Maßnahmen und Akteure zu berücksichtigen sind. Die Lernenden müssen in der Lage sein, anzugeben, welche Informationen fehlen, und ohne zu schreiben fortfahren. Belohnen Sie keine Textmenge oder Revisionshäufigkeit.

Design-Abdeckung des gesamten Inkrements: Jeder der 14 Fälle hat fünf Original-Unterstützungen in Italienisch, Englisch und Französisch - Narrative Eröffnung, Herkunft der Quelle, Evidenzbeziehungen, Unsicherheit und Nachbesprechung. Die Eröffnungsszene hat drei kurze Stopps; eine kontextuelle Erinnerung geht der Entscheidung voraus und kann wieder geöffnet werden. Das Notizbuch ermöglicht es, geöffnete Exponate zu lesen, die Herkunft zu kommentieren und frei Quellenpaare mit Gründen vorzuschlagen. Es markiert keine Beziehung korrekt oder falsch. Die Revisionshistorie enthält nur Revisionen, die vom Spieler explizit mit einem Grund aufgezeichnet wurden, nicht ein automatisches Verhaltensprotokoll.

Der Prä-Signatur-Hinweis enthält die Verbindung von Beweisen zu Klassifizierung, Maßnahme und Verantwortung. Nach dem Feedback bleiben die Überarbeitung, die Überprüfung des Feedbacks gegen Beweise und die Planung für einen anderen Fall getrennt. Session Debrief vergleicht alle abgeschlossenen Guided Cases und unterstützt die Synthese. Das separate lokale `research/study02/`-Labor bietet strukturierte Beobachtung und zwei unabhängige Aufgaben; es ist vom öffentlichen Spiel ausgeschlossen. Voll funktionsfähige Rückverfolgbarkeit ist in COVERAGE_COMPLETION.md. Die technische Verifizierung folgt der vollständigen Umsetzung; die Ergebnisse werden im Umsetzungsbericht festgehalten.

## A. Vom Feedback zur Verifizierung

Direkte Quellen wurden in den autorisierten E-Mails vom 18. und 19. November 2026 konsultiert. Das benannte Register und private Referenzen verbleiben im Dossier des Eigentümers. Diese IDs unterstützen die Coderückverfolgbarkeit, ohne private Korrespondenz zu reproduzieren.

| ID | Direktes Feedback, paraphrasiert | Bildungsproblem | V5-Mechaniker | Prüfkriterium |
|---|---|---|---|---|
| A1 | Bewertung überwiegt | Wissen ist vor ausreichender Lernbegleitung erforderlich | Fellow-Inspektor-Szene vor Exponaten; Zweck und Kontext | Anfänger erklärt die Aufgabe und eine Untersuchungsfrage ohne Lösung |
| A2 | Anfänger brauchen integrierte Lernbegleitung | Verfahrenshilfe ist losgelöst vom Verständnis | Kurzes Beispiel, das eine deklarative Quelle mit der beobachteten Operation kontrastiert, dann eine Fallhypothese | Unterscheiden Sie die Behauptung von Beweisen durch Bezugnahme auf die Herkunft |
| A3 | Eine abschließende Nachbesprechung ist erforderlich | Das Urteil des Systems schließt die Reflexion | Revisit-Hypothese, signierte Notiz, Revision und nächste Fallfrage | Erläutern Sie eine gepflegte oder überarbeitete Wahl mit einem Grund |
| P1 | Spielerfolg kann kritisches Denken nicht etablieren | Ergebnis und Prozess werden verschmolzen | Autonomer Vermerk vor der Unterzeichnung, getrennt von vordefinierten Begründungen | Menschliche Bewerter identifizieren eine Verbindung von Beweisen zum Urteil |
| P2 | Quellen, Korrelationen, Revisionen und Unsicherheiten beobachten | Klicks und Zeiten lassen mehrdeutige Erklärungen zu | Notebook mit Initialhypothese, Source Relation, Alternative und Informationslücke | Beobachter verknüpft Aktionen mit der Erklärung des Teilnehmers |
| P3 | Alternativen können die erwartete Logik des Systems lehren | Anerkennung der erwarteten Antwort | Autonomes Schreiben und eine externe Aufgabe ohne Antwortoptionen | Vergleichen Sie die Rechtfertigung im Spiel mit einer neuen Aufgabe |
| P4 | Feedback muss überarbeitet werden | Kopieren von Erklärungen nach der Antwort | Gesperrter Pre-Feedback-Hinweis und separates Post-Feedback-Feld | Identifizieren Sie, was das Kriterium des Spielers geändert hat |
| P5 | Integrieren von Beobachtung, Erklärung und Übertragung | Ein Spielbericht ist ein Teilbeweis | Study 02 Protokoll und doppelkodierte Rubrik | Konvergente Beweise, gemeldete Meinungsverschiedenheiten und explizite Grenzen |

## B. Lernergebnisse und Beweise

| Lokales Ziel | Spieleraktion | Beobachtbare Beweise in einer autorisierten Sitzung | Auslegungsgrenzwert |
|---|---|---|---|
| Zweck und Kontext verstehen | Umformulieren des Fallproblems | Relevante Untersuchungsfrage | Kann die Szene wiederholen, ohne zu verstehen |
| Beurteilen der Herkunft | Vergleichen Sie eine Erklärung mit dokumentarischen Beweisen | Erklären unterschiedlicher Beweiskraft | Das Öffnen von zwei Dokumenten zeigt nur den Zugriff |
| Verbinden Sie zwei Exponate | Quellen auswählen und Unterstützung, Spannung oder Unsicherheit erklären | Benannte Beziehung zu Inhalt und Herkunft | Ein vorgeschlagenes Paar stellt keine gültige Schlussfolgerung dar; menschliches Lesen ist erforderlich |
| Überarbeiten einer Hypothese | Vergleichen Sie erste und aktuelle Interpretationen | Spezifischer Grund für die Änderung oder Beibehaltung | Häufige Änderungen können Vermutungen widerspiegeln |
| Argumentation | Schreiben Sie vor dem Feedback | Anspruch, Beweis, logische Verbindung und alternative | Schreibfähigkeit, Sprache und Gerüst beeinflussen den Text |
| Umgang mit Unsicherheit und Rechten | Fehlende Daten und betroffene Personen identifizieren | Auskunftsersuchen und Begrenzung des Urteils | Das Festlegen von Zweifeln zeigt nicht, dass sie verwaltet werden |
| Nutzen-Feedback | Lesen Sie Notiz und Nachbesprechung, formulieren Sie ein neues Kriterium | Begründeter Unterschied zwischen Vorher und Nachher | Wiederholtes Feedback beweist keine Übertragung |
| Übertragung | Analysieren Sie neue Quellen außerhalb des Spiels | Performance auf parallelen Pre/Post-Formularen und Follow-up | Gültigkeit hängt von Äquivalenz, Bewertern und Studiendesign ab |

Diese Ziele sind unsere Operationalisierung. Die Leistung im Spiel weist kein DigComp-Level zu. Das Framework berücksichtigt Komplexität und Autonomie; geführte und freie Profile müssen daher separat beschrieben werden. Der Anhang der GFS zu Protokoll, Deskriptoren und Lernergebnissen wurde geprüft [4].

| DigComp 3.0 Referenznummer | Bezugshöhe | Lokales Ziel und Limit |
|---|---|---|
| LO1.2.02 | Grundstufe | Unterscheiden Sie die Quelle von Inhalten in einem Exponat |
| LO1.2.07 | Grundstufe | Drücken Sie eine erste Zuverlässigkeitsbewertung mit dem Kollegen aus |
| LO1.2.21 | Mittelstufe | Vergleichen Sie die Zuverlässigkeit und Interessen verschiedener Quellen |
| LO2.3.15 | Mittelstufe | Anerkennung der für den Fall relevanten Rechte und Pflichten |
| LO2.3.25 | Fortgeschritten | Unterscheiden Sie Verbote und Hochrisikobedingungen; diese komplexe Forderung besteht bereits im Spiel und bedarf der Vermittlung für Anfänger |

Guidance unterstützt den Zugang zu einer fortgeschrittenen Aufgabe. Das Hinzufügen eines Hinweises macht diese Leistung nicht zu einer grundlegenden Kompetenz. Codes beziehen sich auf den ursprünglichen Text der GFS, Anhang 2, gedruckt S. 88-94. Die lokalen Formulierungen sind Projektanpassungen, für die die Europäische Kommission nicht verantwortlich ist.

## Was zu bewahren, zu ändern und hinzuzufügen

| Phase | Konserve | Änderung | Neue Komponente |
|---|---|---|---|
| Verständnis | CaseScene, Erzählung und Sitzungsdauer | Expliziter Eintritt in den geführten Weg | Kurze Kollegenszene, Klassifikationszweck und Rechte |
| Hypothese | Freiheit zu lesen und zu wählen | Erste Interpretation vor Exponaten sichtbar machen | Anfängliche / aktuelle Hypothese im temporären Gedächtnis |
| Untersuchung | 14 Fälle, EvidenceScene und Vergleich | Pause zum Verbinden von Quellen | Arbeits-Notebook mit Gegenbeweis und Unsicherheit |
| Argumentation | Auswahl von Berichten, Fehlermöglichkeit und Unterzeichnung | Öffnen Sie eine autonome Notiz vor dem Feedback zum ausgewählten Pfad | Kostenloser Entwurf und Snapshot bei der Unterzeichnung |
| Feedback | ReportScene, Feedback-Achsen und Review | Vergleichen Sie frühere Argumentation mit späterer Reflexion | Separates Reflexionsfeld und Session-Debrief |
| Übertragung | Untersuchungsszenario als gemeinsame Sprache | Bewertung der Wirksamkeit außerhalb der 14 Fälle | Zwei komplette unabhängige Study 02 Aufgaben im lokalen Labor |

## Kritische CEPAJe-Analyse

CEPAJe kreuzt Kontext, Lehrer, Pädagogik, Lernende und Spiel mit Einführung, Aktivität und Nachbesprechung. Wir verwenden es als Design-Raster [1]. Es identifiziert übersehene Bedingungen; es zertifiziert nicht die Wirksamkeit des Produkts.

| Dimension | Einleitung | Untersuchung | Debriefing und Transfer | Risiko zu untersuchen |
|---|---|---|---|---|
| Kontext | Dauer, Gerät, Sprache und Zugang zu Regeln | Pausen, die mit Lärm und Einzel- / Paararbeit kompatibel sind | Geschützte Schreib- und Diskussionszeit | Schule und selbstgesteuertes Lernen bieten unterschiedliche Lernbegleitung |
| Lehrkraft | Präsentieren Sie Zweck und Regeln, ohne Antworten zu enthüllen | Fragen Sie, welche Beweise die Hypothese ändern würden | Erleichtern Sie die Diskussion über Gründe und Grenzen | Eine In-Game-Eingabeaufforderung ersetzt keine menschliche Lernbegleitung |
| Pädagogik | Explizite Ziele mit einem Beispiel | Überprüfbare Hypothesen und Quellenvergleich | Hinweis vor dem Feedback, dann Nacharbeiten | Sequenz könnte ein Formular zum Ausfüllen werden |
| Lernende Person | Vorkenntnisse und Lektüre Vertrautheit nach außen etabliert | Optionale Unterstützung und erlaubte Überspringungen | Erklären Sie Strategien durch zugängliche Modalitäten | Schreiben und Sprache können Argumentation maskieren |
| Spiel | Rolle, Atmosphäre und Fall bewahren | Exploration und Folgen bleiben zentral | Reuse Debriefing und Review | Zu viele Unterbrechungen reduzieren Agentur und Pacing |

Diese vorläufige Entscheidung muss in Playtests angefochten werden. Wenn sich die Lernbegleitung wie eine separate Lektion anfühlt, verkürzen Sie sie und verbinden Sie sie mit einem ausgewählten Dokument. Wenn kostenlose Schreibblöcke abgespielt werden, erlauben Sie das Überspringen und geben Sie vermittelte mündliche Antworten. Wenn alle Hinweise wiederholen, reduzieren Sie das Gerüst in der unabhängigen Aufgabe. Wenn Anfänger desorientiert bleiben, ändern Sie das Beispiel und testen Sie das Verständnis, bevor Sie mehr Text hinzufügen.

## LM–GM Karte

LM–GM verbindet Spielaktionen mit Lernprozessen [2]. Dies ist eine lokale Betriebskarte; unsere Komponentennamen werden nicht dem Modell zugeschrieben.

| Spielmechanik | Lernmechaniker | Anschluss an die Überprüfung | Ausgangszustand |
|---|---|---|---|
| Rolle des Inspektors und Öffnung des Falles | Kontextualisierung, Aktivierung von Wissen | Stellen Sie eine Frage, die für die Entscheidung nützlich ist | Narrative Gegenwart, Lernbegleitung braucht Expansion |
| Szenerie der Kollegen | Beispiel und Gerüst | Unterscheiden Aussage von Beweisen | Neue Komponente |
| Freie Ausstellungserkundung | Informationssuche und -vergleich | Erklären Sie die Rückkehr zu einer Quelle | Eröffnung und Zitieren bereits vorhanden |
| Side-by-Side Vergleich | Analyse und Korrelation | Streiten um Unterstützung oder Konflikt | Reading present, Produktion zum Hinzufügen |
| Überprüfbare Hypothese | Reflexion und Überwachung der Interpretation | Behalten oder Ändern einer Ansicht aufgrund spezifischer Beweise | Neues Feld |
| Vermerk und Unterschrift | Selbsterklärung und engagierte Entscheidung | Machen Sie die logische Verbindung explizit vor dem Feedback | Anmelden, Text neu |
| Folgen und Nachbesprechung | Feedback und Reflexion über Erfahrungen | Unterscheiden Sie rechtliche Ergebnisse, Unterstützung und Limit | Bestehende Achsen wiederverwenden |
| Unabhängiges externes Szenario | Antrag und Übermittlung | Anwendung von Kriterien auf verschiedene Quellen | Formulare A/B, jeweils vier Quellen in IT/EN/FR; menschliche Rubrik |

Die alternativen Berichte bieten Unterstützung, können aber die Anerkennung begünstigen, so dass die autonome Produktion komplementär ist. Das Notizbuch erhöht die Beobachtbarkeit während einer einvernehmlichen Sitzung. Die öffentliche Version behält nur die vorhandenen Aggregatzähler.

## Wissenschaftliche Grundlagen und verifizierte Bibliographie

Die Quellen wurden am 21. November 2026 konsultiert. Die Auswahl priorisiert europäische Autoren, Netzwerke und Institutionen. Tatsächliche Zugriffsebenen werden gemeldet, so dass ein Abstract nicht als Volltextlesung dargestellt wird.

1. Alvarez, J., & Chaumette, P. (2017). Présentation d'un modèle dédié à l'évaluation d'activités ludo-pédagogiques et retours d'expériences. Recherche et pratiques pédagogiques en langues de spécialité, 36(2). DOI [10.4000/apliut.5659](https://doi.org/10.4000/apliut.5659). OpenEdition zeigte eine Bot-Prüfung. Die Modellstruktur ist außerdem in der institutionellen DRANE-Ressource und in der RIHM-Publikation des Autors von 2019 dokumentiert, die teilweise über die Indexierung zugänglich war. Diese Zugriffsbeschränkung gilt ausdrücklich auch für die Verwendung im Entwurf. [1](https://drane.region-academique-idf.fr/article69.html) · [2](https://europia.org/RIHM/V20N2/3-RIHM20%282%29-Alvarez.pdf)
2. Arnab, S., Lim, T., Carvalho, M. B., Bellotti, F., de Freitas, S., Louchart, S., Suttie, N., Berta, R., & De Gloria, A. (2015). Mapping learning and game mechanics for serious games analysis. British Journal of Educational Technology, 46(2), 391–411. DOI [10.1111/bjet.12113](https://doi.org/10.1111/bjet.12113). Metadaten und Abstract wurden im Heriot-Watt-Repositorium geprüft. Das Manuskript bei TU Eindhoven lieferte HTTP 403. Diese Arbeit aus dem europäischen GALA-Netzwerk unterstützt die Nachverfolgbarkeit zwischen Lernzielen und Spielmechaniken. [1](https://researchportal.hw.ac.uk/en/publications/mapping-learning-and-game-mechanics-for-serious-games-analysis/)
3. Bijl, A., Veldkamp, B. P., Wools, S., & de Klerk, S. (2024). Serious games in high-stakes assessment contexts: a systematic literature review into the game design principles for valid game-based performance assessment. Educational Technology Research and Development, 72, 2041–2064. DOI [10.1007/s11423-024-10362-0](https://doi.org/10.1007/s11423-024-10362-0). Der offene Text wurde im Twente-Repositorium geprüft, insbesondere Einleitung und Diskussion. Die Übersicht über 56 Studien zu beruflichen Kompetenzen behandelt Validitätsrisiken, Authentizität und Adaptivität. Der Einfluss von Feedback auf die Leistung begründet die Trennung von Lernbegleitung und unabhängiger Messung. [1](https://ris.utwente.nl/ws/portalfiles/portal/453330013/s11423-024-10362-0.pdf)
4. Cosgrove, J., & Cachia, R. (2025). DigComp 3.0: European Digital Competence Framework, Fifth Edition. European Commission, JRC144121. DOI [10.2760/0001149](https://doi.org/10.2760/0001149). Offizieller Datensatz und JRC-Deskriptoren wurden geprüft; der Datensatz nennt den 27. November 2025. Die Spielziele sind eine Anpassung des Autors und keine Zertifizierung durch die Kommission. [1](https://publications.jrc.ec.europa.eu/repository/handle/JRC144121) · [2](https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en)
5. European Union (2024, consolidation of 27 July 2026). Regulation (EU) 2024/1689, amended by Regulation (EU) 2026/1744. [EUR-Lex consolidated text](https://eur-lex.europa.eu/eli/reg/2024/1689). Artikel 4 und 4a, Verbote, Pflichten und Anhang III bilden die Grundlage der Rechtsmatrix. Artikel 4 verlangt von Anbietern und Betreibern Maßnahmen zur Förderung der KI-Kompetenz ihres Personals unter Berücksichtigung von Kenntnissen, Kontext und betroffenen Menschen; er verlangt keine Garantie eines bestimmten individuellen Niveaus. Kommission und Mitgliedstaaten unterstützen diese Bemühungen. Die Fristen des Artikels 113 sind vom fiktiven Jahr 2032 zu unterscheiden.
6. Council of Europe (2026). Recommendation CM/Rec(2026)12, adopted 2 September 2026. Der Text des Ministerkomitees und die institutionelle Seite wurden geprüft. Rechte, Autonomie und reflektierte Praxis begründen Fragen nach betroffenen Menschen und Grenzen des Urteils. Diese Empfehlung des Europarats unterscheidet sich institutionell und rechtlich von der EU-Verordnung. [1](https://search.coe.int/cm/eng?i=09125948802cde8e) · [2](https://www.coe.int/web/education/-/recommendation-cm/rec-2026-12-of-the-committee-of-ministers-to-member-states-on-artificial-intelligence-literacy)
7. Wouters, P. J. M., & van Oostendorp, H. (2013). A meta-analytic review of the role of instructional support in game-based learning. Computers & Education, 60, 412–425. [Utrecht repository](https://research-portal.uu.nl/en/publications/a-meta-analytic-review-of-the-role-of-instructional-support-in-ga/). Metadaten wurden geprüft; der Verlag gewährte keinen Volltextzugang. Die Quelle begründet lediglich eine Überprüfung der Lernunterstützung. Effektgrößen werden nicht auf dieses Spiel übertragen.
8. van der Meij, H., Leemkuil, H. H., & Li, J.-L. (2013). Does individual or collaborative self-debriefing better enhance learning from games? Computers in Human Behavior, 29(6), 2471–2479. DOI [10.1016/j.chb.2013.06.001](https://doi.org/10.1016/j.chb.2013.06.001). Metadaten und Abstract wurden im Twente-Repositorium geprüft. Fachgebiet und Stichprobe begrenzen die Übertragbarkeit. Die Studie begründet den Vergleich eigenständiger Erklärung mit einer begleiteten Diskussion. [1](https://research.utwente.nl/en/publications/does-individual-or-collaborative-self-debriefing-better-enhance-l/)
9. Noroozi, O., Weinberger, A., Biemans, H. J. A., Mulder, M., & Chizari, M. (2012). Argumentation-based computer supported collaborative learning (ABCSCL): A synthesis of fifteen years of research. Educational Research Review, 7(2), 79–106. DOI [10.1016/j.edurev.2011.11.006](https://doi.org/10.1016/j.edurev.2011.11.006). Metadaten und Abstract wurden im Wageningen-Repositorium geprüft. Die Arbeit behandelt Voraussetzungen, Umgebung, Prozesse und Ergebnisse. Die Übertragung auf ein individuelles Notizbuch erfordert Vorsicht, da die Übersicht kollaborative Situationen betrifft. Impulse und Rubrik sind ein lokaler Vorschlag, der validiert werden muss. [1](https://research.wur.nl/en/publications/argumentation-based-computer-supported-collaborative-learning-abc/)

Diese gezielte Umfrage ist keine systematische Überprüfung. Keine Studie wird verwendet, um zu behaupten, dass NO AI ACT kritisches Denken entwickelt. Der Prototyp benötigte keine zusätzliche nicht-europäische Quelle. Ein zukünftiges Protokoll muss jede weitere Validität oder Übertragungsmodelle unabhängig von ihrer Herkunft rechtfertigen.
