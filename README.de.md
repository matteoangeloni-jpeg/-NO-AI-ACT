# NO AI ACT · v5.3.1

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md)

**Investigatives Serious Game zur europäischen KI-Verordnung**

[▶ Spielen](https://www.no-ai-act.eu/play/?lang=de) · [Website und Materialien](https://www.no-ai-act.eu/de/) · [Stabile Version](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.3.1)

Im Jahr 2032 liegt eine fiktive europäische Stadt vor Ihnen, in der die KI-Verordnung nie in Kraft getreten ist. Als Inspektor rekonstruieren Sie den Einsatz von KI-Systemen anhand von Dokumenten, Aussagen und Protokollen. Das kostenlose Open-Source-Spiel läuft ohne Konto im Browser.

## Umfang

Spiel, Website, Lernmaterialien, Pressemappen, README-Dateien und Methodendossier sind in denselben Sprachen verfügbar: Italienisch, Englisch, Französisch, Deutsch, Spanisch und europäisches Portugiesisch (pt-PT). Jede Sprache umfasst alle 14 Fälle und dieselben 37 Websitebereiche. Bestehende URLs bleiben erhalten.

## Der Spielablauf

- Ermitteln Sie: Dokumente öffnen, Herkunft prüfen, Belege zitieren und Quellen vergleichen. Entscheiden Sie über Einstufung, Maßnahme, Verantwortung und Begründung; unterzeichnen Sie den Bericht und besprechen Sie Folgen und Grenzen.
- Der begleitete Weg verbindet Verständnis, Hypothese, Untersuchung, eigenständige Argumentation vor dem Feedback, Nachbesprechung und Überlegungen zu einem weiteren Fall. Belege können erneut geprüft und Änderungen begründet werden; Schreiben bleibt freiwillig.
- Vier Modi nutzen dieselben Fälle: Dienstschicht, Freie Ermittlung, Überraschungsinspektion und Wiederholung fehlerhaft abgeschlossener Fälle. Die gewählte Dauer ist ein unverbindliches Zeitbudget.
- Der Lehrkräftemodus bietet einen Leitfaden und Materialien für die lokale Nachbesprechung. Aktivitäten, drei Unterrichtspläne, Glossar und Fachbeiträge unterstützen Vorbereitung und Diskussion.
- Tastaturbedienung, barrierearme Leseschicht und Einstellungen für Audio, Text und Bewegung. Spielstände der Version 2 und die Migration von Version 1 bleiben kompatibel.

## Methode und Grenzen

CEPAJe und LM–GM verbinden Kontext, Lernbegleitung, Handlungen und beobachtbare Belege. Das Dossier enthält Matrizen, eine vorläufige Rubrik und die Spezifikation einer Transferaufgabe. Rückmeldungen von Julian Alvarez und Federica Pelizzari dienen der Überarbeitung; sie stellen weder Empfehlung noch Validierung dar. Spielpunkte und Spielerfolg belegen weder Lernen noch kritisches Denken; kritisches Denken wird nicht automatisch bewertet. Die vereinfachte Rechtssimulation bietet weder Rechtsberatung noch Zertifizierung.

[Methode und Grenzen](docs/v5/README.de.md) · [Methodik, Rückmeldungen, CEPAJe und LM–GM](docs/v5/de/METHODOLOGY.md) · [Rechtsmatrix der 14 Fälle](docs/v5/de/LEGAL_LEARNING_MATRIX.md)

## Daten und Datenschutz

Der Fortschritt bleibt im Browser. Aggregierte Zähler lassen sich deaktivieren. Nur Erwachsene können einem pseudonymen Sitzungsprotokoll mit 90 Tagen Aufbewahrung zustimmen; Texte des begleiteten Wegs erfordern eine weitere, zunächst nicht ausgewählte Einwilligung. Widerruf, Löschung und Export sind über die Spielleiste erreichbar. DNT/GPC werden berücksichtigt. Keine Konten, Werbeprofile oder Verknüpfungen zwischen Besuchen. Die Erfassung nutzt telemetry.no-ai-act.eu; frühere APIs bleiben mit bestehenden Belegen und Exporten kompatibel.

[Daten und Datenschutz](https://www.no-ai-act.eu/game-statistics.html#de) · [Aktueller Vertrag des Sitzungsprotokolls](docs/v5/de/SESSION_JOURNAL.md)

## Forschungsmaterialien

Study 02 ist ein lokales Labor außerhalb der öffentlichen Anwendung mit zwei Aufgabenformen und einer menschlich codierten Rubrik in sechs Sprachen. Es startet keine Studie mit Teilnehmenden. Sprachliche Gleichwertigkeit, Rubrikvalidität und Bildungswirksamkeit müssen weiterhin mit Menschen untersucht werden. Prüfergebnisse im Dossier dokumentieren frühere Ausführungen.

[Rubrik und Transferaufgabe Study 02](docs/v5/de/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Lokale Entwicklung

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=de
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Autor

Matteo Angeloni: Idee, Game Design, Entwicklung und Bildungsinhalte. Doktorand an der Universität Tuscia; unabhängiges Projekt ohne implizite institutionelle Genehmigung. Mit KI-Unterstützung unter menschlicher redaktioneller Verantwortung erstellt.

[Matteo Angeloni](https://www.no-ai-act.eu/de/matteo-angeloni/)

## Lizenzen

Code: GPL-3.0-or-later; Inhalte: CC BY-SA 4.0. Namensnennungen und Komponenten stehen in LICENSE, CREDITS und THIRD_PARTY_LICENSES. Titel von Publikationen und Presseartikeln bleiben in ihrer Originalsprache.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Technische Dokumentation und Versionsgeschichte

[Stabile Version](docs/RELEASE_NOTES_v5.3.1.de.md) · [Methode und Grenzen](docs/v5/README.de.md) · [Press kit](https://www.no-ai-act.eu/de/pressemappe/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)
