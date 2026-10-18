export const UI = {
  lang: 'de', locale: 'de_DE', name: 'Deutsch', skip: 'Zum Inhalt', menu: 'Navigation', resources: 'Themen', home: 'Startseite',
  play: 'Spielen – Sprache wählen', game: 'Das Spiel ist auf Italienisch, Englisch und Französisch verfügbar. Diese Seiten sind auf Deutsch; die Auswahl unten öffnet das Spiel in der angegebenen Sprache.',
  gameLanguages: ['Italienisch', 'Englisch', 'Französisch'], related: 'Weiterlesen', source: 'Offizieller EU-Rechtstext',
  legal: 'Didaktische Vereinfachung, keine Rechtsberatung',
  disclaimer: 'NO AI ACT ist ein unabhängiges, kostenloses Open-Source-Lernspiel. Die Erläuterungen führen in ausgewählte Begriffe ein und ersetzen weder den geltenden Rechtstext noch eine fachliche Prüfung. Die pädagogische Wirksamkeit wurde nicht durch eine kontrollierte Studie nachgewiesen.',
  author: 'Entwickelt von Matteo Angeloni', authorLink: 'Autor und Methodik (Englisch)',
  privacy: 'Nutzungsstatistik', privacyLink: 'Informationen zur Statistik (Englisch)',
  screenshot: 'Archivaufnahme des Spiels, Version 3: Untersuchung eines Falldossiers. Die aktuelle Veröffentlichung ist Version 4.',
  disclosure: 'Mit KI-Unterstützung erstellt und redaktionell bearbeitet; keine amtliche Übersetzung.',
  official: 'deu'
};
// Localized introductory pages, based on the corresponding project resources.
export const PAGES = {
  home: {
    title: 'NO AI ACT: Lernspiel zur EU-KI-Verordnung',
    description: 'Kostenloses Lernspiel zur EU-KI-Verordnung: 14 Fälle untersuchen, Risiken einordnen und Entscheidungen begründen. Ohne Konto im Browser spielen.',
    h1: 'NO AI ACT: Lernspiel zum EU AI Act',
    lead: 'Ein kostenloses investigatives Lernspiel zum EU AI Act, der europäischen KI-Verordnung. Untersuche in einer fiktiven Welt Belege und KI-Risiken. Die Geschichte ist keine Beschreibung der geltenden Rechtslage.',
    sections: [
      ['Eine Stadt, vierzehn Untersuchungen', 'Die Handlung spielt 2032 in einer fiktiven Stadt, in der die KI-Verordnung nie wirksam geworden ist. Automatisierte Systeme entscheiden über Arbeit, öffentliche Leistungen und persönliche Möglichkeiten. Du prüfst jeweils ein Dossier mit Dokumenten, Behauptungen und widersprüchlichen Hinweisen. Die dystopische Ausgangslage ist Fiktion, keine Beschreibung der tatsächlichen europäischen Rechtslage.'],
      ['Entscheiden statt Antworten erraten', 'Du wählst eine Risikoeinordnung, eine geeignete Maßnahme, den verantwortlichen Akteur und eine Begründung. Zuvor musst du relevante Belege auswählen. Eine richtige Kategorie mit unpassenden Belegen ist nicht dieselbe Leistung wie eine nachvollziehbar begründete Entscheidung. Der anschließende Bericht erklärt Unterschiede und zeigt, worauf beim nächsten Fall zu achten ist.'],
      ['Kostenlos und ohne Registrierung', 'Das Spiel läuft im Browser und benötigt kein Benutzerkonto. Spielstände und Antworten bleiben auf deinem Gerät. Automatische, abschaltbare Nutzungszähler erfassen nur begrenzte aggregierte Ereignisse; sie sind weder individuelle Lernprofile noch eine Messung des Lernerfolgs. Die deutschsprachigen Seiten helfen beim Einstieg und führen transparent zu den verfügbaren Spielsprachen.']
    ]
  },
  how: {
    title: 'So funktioniert NO AI ACT | Spielablauf und Entscheidungen',
    description: 'Vom Hinweis zum unterschriebenen Bericht: So funktionieren Belege, Risikoeinordnung, Maßnahmen und Nachbesprechung im Lernspiel NO AI ACT.',
    h1: 'So funktioniert NO AI ACT',
    lead: 'Ein Fall ist kurz genug für eine gemeinsame Diskussion und offen genug, um die Qualität einer Begründung sichtbar zu machen.',
    sections: [
      ['Vom Vorfall zu den Belegen', 'Jede Untersuchung beginnt mit einem Vorfall und der Beschreibung eines KI-Einsatzes. Öffne die Unterlagen und prüfe, welche Informationen für diesen konkreten Verwendungszweck entscheidend sind. Nicht jedes überzeugend klingende Dokument ist ein tragfähiger Beleg. Vergleiche Hinweise und zitiere die Unterlagen, auf denen deine Einschätzung tatsächlich beruht.'],
      ['Fünf zusammenhängende Entscheidungen', 'Ordne den Einsatz ein, wähle eine Maßnahme und benenne den zuständigen Akteur. Ergänze eine Begründung und die passenden Belege. Dabei sind Anbieter, Betreiber, Behörden und menschliche Verantwortung nicht austauschbar. Die Untersuchung lässt sich bis zur Unterschrift überarbeiten; anschließend zeigt der Bericht, welche Teile stimmig sind und wo die Argumentation nicht trägt.'],
      ['Nachbesprechung statt bloßer Punktzahl', 'Die Rückmeldung unterscheidet die Einordnung, die Belegauswahl und die Begründung. Eine teilweise passende Entscheidung wird deshalb nicht einfach als vollständig richtig behandelt. Besprich, welche zusätzliche Information dein Urteil ändern würde. Wiederholungs- und andere Spielmodi bleiben Lernhilfen; ein abgeschlossenes Dossier ist keine rechtsverbindliche Konformitätsprüfung.']
    ]
  },
  education: {
    title: 'KI-Verordnung lernen: kostenlose Bildungsressourcen',
    description: 'Leitfaden, Glossar und Unterrichtsideen zur EU-KI-Verordnung. NO AI ACT verbindet verständliche Grundlagen mit begründeten Entscheidungen im Spiel.',
    h1: 'Bildungsressourcen zur KI-Verordnung',
    lead: 'Beginne mit der Frage, die du beantworten möchtest: Was regelt die Verordnung, wie lässt sie sich vermitteln und was zeigt ein konkreter Fall?',
    sections: [
      ['Die Begriffe ordnen', 'Der Leitfaden erklärt den Zusammenhang zwischen Verwendungszweck, Risiken und Pflichten. Die Seiten zu verbotenen Praktiken, Hochrisiko-Systemen, Transparenz und Modellen mit allgemeinem Verwendungszweck vertiefen unterschiedliche Fragen. Das Glossar unterstützt beim Lesen: Eine technische Bezeichnung allein entscheidet noch nicht darüber, welche rechtlichen Anforderungen gelten.'],
      ['Mit Fällen arbeiten', 'Im Spiel werden Begriffe zu Entscheidungen, die sich begründen und kritisieren lassen. Eine Gruppe kann dieselben Belege lesen und trotzdem zu verschiedenen Einschätzungen kommen. Genau dort beginnt die Nachbesprechung: Welche Annahme führt zur Abweichung? Welche Information fehlt? Welche Maßnahme beantwortet tatsächlich das festgestellte Problem?'],
      ['Unterricht bewusst vorbereiten', 'Wähle vorab passende Fälle und wenige konkrete Lernziele. Für einen Einstieg genügt es, die Rolle der Beteiligten und die Belege einer Entscheidung zu untersuchen. Das Material ist keine vollständige Ausbildung zur Rechtskonformität. Nutze für formelle Fragen den amtlichen Text und eine geeignete fachliche Beratung.']
    ]
  },
  teachers: {
    title: 'KI-Verordnung für Schulen: Lehrkräfte und Verantwortung',
    description: 'EU AI Act für Lehrkräfte: KI-Nutzung in Schulen, Verwendungszweck, Risiken und Verantwortung unterscheiden. Dazu ein Lernspiel für die Diskussion.',
    h1: 'KI-Verordnung für Schulen und Lehrkräfte',
    lead: 'KI in der Schule einzusetzen und die KI-Verordnung zu unterrichten sind zwei verschiedene Aufgaben. Diese Einführung verbindet den rechtlichen Kontext mit der Diskussion im Lernspiel.',
    sections: [
      ['KI-Nutzung in der Schule einordnen', 'Eine Lernhilfe, ein Zulassungsverfahren und die Bewertung von Prüfungsleistungen erfüllen unterschiedliche Zwecke. Kläre zuerst, was das konkrete System tut, wer es bereitstellt, wer es in eigener Verantwortung verwendet und welche Personen betroffen sind. Prüfe danach die einschlägigen Voraussetzungen im amtlichen Text. Nicht jede Anwendung in einer Schule gehört automatisch zur gleichen Risikokategorie. KI-Kompetenz, Datenschutz, Transparenz und menschliche Aufsicht sind getrennte Fragen, die sich ergänzen können. Diese Einführung und das Spiel bescheinigen weder die rechtliche Zulässigkeit eines Produkts noch die Erfüllung sämtlicher Pflichten.'],
      ['Vor dem Spielen', 'Spiele den ausgewählten Fall zunächst selbst. Lege fest, ob die Gruppe vor allem Risiken unterscheiden, Belege bewerten oder Verantwortlichkeiten erkennen soll. Erkläre die Grenzen der Simulation und prüfe, ob die angebotenen Spielsprachen zur Lerngruppe passen. Die deutschsprachigen Webseiten bedeuten nicht, dass auch die Spieloberfläche bereits deutsch ist.'],
      ['Während der Untersuchung', 'Projiziere das Dossier oder lasse in kleinen Gruppen arbeiten. Bitte die Teilnehmenden, ihre Einordnung mit konkreten Hinweisen zu verbinden, bevor sie den Bericht unterschreiben. Der Lehrmodus unterstützt Gesprächspausen. Unterschiedliche Antworten können ein guter Anlass sein, Annahmen offenzulegen, statt nur die vermeintlich richtige Kategorie abzugleichen.'],
      ['Nach dem Bericht', 'Nutze die lokale Nachbesprechung für Fragen an die Gruppe: Was war entscheidend, was fehlte und welche Maßnahme wäre überprüfbar? Ein Export bleibt eine bewusst ausgewählte lokale Datei. Das Projekt benötigt keine Schülerkonten oder Namenslisten und sendet keine einzelnen Antworten. Aggregierte Nutzungsereignisse sind kein Nachweis individueller Kompetenz oder pädagogischer Wirksamkeit.']
    ]
  },
  guide: {
    title: 'EU-KI-Verordnung einfach erklärt | NO AI ACT',
    description: 'Einführung in die EU-KI-Verordnung: Verwendungszweck, Risikokategorien, Transparenz, KI-Modelle und Verantwortlichkeiten verständlich einordnen.',
    h1: 'Ein Leitfaden zur EU-KI-Verordnung',
    lead: 'Die sinnvolle Ausgangsfrage lautet nicht nur „Ist das KI?“, sondern auch: Wer setzt das System wofür ein und wen betrifft die Entscheidung?',
    sections: [
      ['Vom Zweck zu den Pflichten', 'Die Verordnung ordnet nicht jede Technologie pauschal derselben Kategorie zu. Entscheidend sind unter anderem der konkrete Einsatz, die Rolle der Beteiligten und die einschlägigen Voraussetzungen. Verbotene Praktiken, bestimmte Hochrisiko-Systeme und Transparenzpflichten beantworten unterschiedliche Fragen. Sie sind keine einfache Rangliste, in die jedes Produkt ohne Kontext eingeordnet werden kann.'],
      ['Systeme und Modelle unterscheiden', 'Ein Modell mit allgemeinem Verwendungszweck und das darauf aufgebaute System sind nicht dasselbe. Ein Modell kann in verschiedenen Anwendungen eingesetzt werden; der Verwendungszweck einer solchen Anwendung bleibt gesondert zu prüfen. Ebenso unterscheiden sich die Pflichten eines Anbieters von denen eines Betreibers. Das Glossar und die Themenseiten helfen, diese Ebenen auseinanderzuhalten.'],
      ['Mit der Quelle weiterarbeiten', 'Die Spielbeispiele sind absichtlich vereinfacht. Für Fristen, Ausnahmen und rechtliche Einzelfragen zählt die jeweils geltende Fassung des offiziellen Textes einschließlich Änderungen. Andere Rechtsgebiete können zusätzlich relevant bleiben. Der Leitfaden und das Spiel bieten einen Einstieg in die Argumentation, aber weder eine vollständige Checkliste noch eine Konformitätsbescheinigung.']
    ]
  },
  glossary: {
    title: 'Glossar zur KI-Verordnung: Anbieter, Betreiber und Risiko',
    description: 'Zentrale Begriffe der KI-Verordnung verständlich erklärt: Anbieter, Betreiber, KI-Kompetenz, menschliche Aufsicht und allgemeiner Verwendungszweck.',
    h1: 'Glossar zur KI-Verordnung',
    lead: 'Die Begriffe beschreiben unterschiedliche Rollen und Anforderungen. Eine vereinfachte Erklärung ersetzt nicht die genaue Definition im Verordnungstext.',
    sections: [
      ['Anbieter und Betreiber', 'Ein Anbieter entwickelt ein System oder lässt es entwickeln und bringt es unter den einschlägigen Voraussetzungen unter eigenem Namen in Verkehr oder nimmt es in Betrieb. Ein Betreiber verwendet ein System in eigener Verantwortung im erfassten Nutzungskontext. Beide Rollen können in einer Lieferkette vorkommen; sie sollten nicht einfach als Synonyme für Hersteller und Endnutzer behandelt werden.'],
      ['Risiko und menschliche Aufsicht', 'Die Risikoeinordnung hängt nicht bloß von der technischen Leistungsfähigkeit ab. Zweck, Betroffene und rechtliche Voraussetzungen müssen zusammen betrachtet werden. Menschliche Aufsicht bedeutet mehr als die Anwesenheit einer Person oder eine automatische Bestätigung. Im Spiel wird deshalb gefragt, ob eine Person Informationen versteht und die Entscheidung tatsächlich beeinflussen kann.'],
      ['KI-Kompetenz und allgemeiner Verwendungszweck', 'KI-Kompetenz umfasst Wissen und Fähigkeiten für einen informierten Umgang mit KI im jeweiligen Kontext. Ein KI-Modell mit allgemeinem Verwendungszweck kann vielfältige Aufgaben unterstützen; die konkrete Anwendung bleibt eine eigene Betrachtungsebene. Die offiziellen Begriffe und ihre vollständigen Voraussetzungen findest du im verlinkten deutschen EU-Rechtstext.']
    ]
  },
  privacy: {
    title: 'Datenschutz und Nutzungsstatistik im Spiel NO AI ACT',
    description: 'Was NO AI ACT speichert: lokale Spielstände und Antworten, begrenzte aggregierte Nutzungszähler sowie jederzeit erreichbare Statistik-Einstellungen.',
    h1: 'Datenschutz und Nutzungsstatistik',
    lead: 'Lokale Lerninhalte und aggregierte Betriebsmessung erfüllen unterschiedliche Aufgaben. Deshalb erklären wir ausdrücklich, was auf dem Gerät bleibt und was gesendet wird.',
    sections: [
      ['Spielstände bleiben lokal', 'Für das Spiel brauchst du weder ein Konto noch eine Namensliste. Spielstände, Antworten und lokale Berichte bleiben auf deinem Gerät. Ein heruntergeladenes Feedback-Dokument wird nicht automatisch an das Projekt übermittelt. Teile solche Dateien nur bewusst und prüfe zuvor, ob du selbst zusätzliche persönliche Angaben eingefügt hast.'],
      ['Begrenzte automatische Zähler', 'Das Spiel sendet automatisch abschaltbare, aggregierte Nutzungsereignisse wie Öffnungen und Fallabschlüsse. Dazu gehören begrenzte Kategorien wie Sprache, Version und Fallkennung, nicht einzelne Antworten, Namen, E-Mail-Adressen oder individuelle Lernverläufe. Diese Ereignisse zählen keine eindeutig bestimmten Personen und belegen keine Lernwirkung. Die Detailinformation erläutert auch Aufbewahrung und technische Zustellung.'],
      ['Kontrolle ohne dauerhafte Leiste', 'Der anfängliche Hinweis verschwindet nach wenigen Sekunden. Über das Schildsymbol kannst du ihn wieder öffnen und weitere Sendungen für die aktuelle Seite deaktivieren. Ein Neuladen aktiviert die Zähler erneut, soweit keine unterstützte Browser-Datenschutzeinstellung die Erfassung blockiert. Verbindungsdaten können beim Hosting verarbeitet werden; daraus folgt keine Zusicherung absoluter Anonymität der gesamten Infrastruktur.']
    ]
  },
  risk: {
    title: 'Risikokategorien der KI-Verordnung verstehen',
    description: 'Verbotene KI-Praktiken, Hochrisiko-Systeme und Transparenz unterscheiden: Entscheidend sind Verwendungszweck, Kontext und rechtliche Voraussetzungen.',
    h1: 'Die Risikokategorien richtig einordnen',
    lead: 'Eine nützliche Lernskizze ist noch kein vollständiges rechtliches Klassifikationsverfahren. Prüfe zuerst den konkreten Einsatz.',
    sections: [
      ['Nicht jede Kategorie ist dieselbe Art von Regel', 'Verbotene Praktiken beschreiben bestimmte unzulässige Verwendungen. Hochrisiko-Regeln betreffen bestimmte Systeme und Einsatzkontexte unter festgelegten Voraussetzungen. Transparenzpflichten setzen an anderen Eigenschaften an, etwa an der Interaktion mit Menschen oder bestimmten künstlich erzeugten Inhalten. Ein bloßes Etikett „KI“ beantwortet keine dieser Fragen.'],
      ['Kontext und Auswirkungen untersuchen', 'Frage, welche Entscheidung vorbereitet oder getroffen wird, wer betroffen ist und welche Informationen vorliegen. Ein ähnliches technisches System kann in unterschiedlichen Kontexten rechtlich verschieden zu betrachten sein. Auch die Bezeichnung „geringes Risiko“ macht andere Pflichten, etwa aus Datenschutz oder Verbraucherschutz, nicht automatisch bedeutungslos.'],
      ['Im Dossier nachvollziehbar entscheiden', 'Im Spiel musst du Hinweise auswählen und deine Einordnung begründen. Verwechsle eine passende Maßnahme nicht mit einer passenden Kategorie: Ein Transparenzhinweis behebt nicht automatisch jedes andere Problem. Für reale Systeme sind die genauen Bestimmungen und Ausnahmen maßgeblich. Die folgenden Themenseiten dienen als strukturierter Einstieg, nicht als Freigabe eines konkreten Produkts.']
    ]
  },
  prohibited: {
    title: 'Verbotene KI-Praktiken: Einstieg in die KI-Verordnung',
    description: 'Verbotene KI-Praktiken verstehen: problematische Zwecke, konkrete Voraussetzungen und Grenzen didaktischer Beispiele im Lernspiel NO AI ACT.',
    h1: 'Verbotene KI-Praktiken',
    lead: 'Die erste Frage ist manchmal nicht, welche Schutzmaßnahme fehlt, sondern ob der konkrete Einsatz unter ein Verbot fällt.',
    sections: [
      ['Den Einsatz genau beschreiben', 'Die Verordnung enthält Verbote für bestimmte KI-Praktiken. Bei der Einordnung kommt es auf die einzelnen Tatbestandsmerkmale an, nicht allein auf Schlagwörter wie Bewertung, Biometrie oder Vorhersage. Eine pauschale Aussage, jede Anwendung einer solchen Technik sei verboten, würde die rechtliche Prüfung unzulässig verkürzen.'],
      ['Probleme nicht durch Etiketten verdecken', 'Ein zusätzlicher Hinweis oder die Behauptung menschlicher Beteiligung macht eine verbotene Praxis nicht ohne Weiteres zulässig. Im Spiel zeigen vereinfachte Dossiers, wie beruhigende Formulierungen von entscheidenden Hinweisen ablenken können. Prüfe deshalb Zweck, Betroffene, Datenverwendung und die tatsächliche Möglichkeit, Entscheidungen zu beeinflussen oder anzufechten.'],
      ['Von der Simulation zum Rechtstext', 'Die Beispiele zur sozialen Bewertung und zu anderen sensiblen Anwendungen trainieren eine begründete Untersuchung. Sie bilden nicht sämtliche Voraussetzungen, Sonderfälle und Ausnahmen ab. Bevor du daraus eine Aussage über ein reales System ableitest, lies die einschlägigen Bestimmungen im aktuellen offiziellen Text und ziehe erforderlichenfalls fachliche Beratung hinzu.']
    ]
  },
  high: {
    title: 'Hochrisiko-KI-Systeme: Pflichten und Kontext verstehen',
    description: 'Was Hochrisiko-KI im AI Act bedeutet: Einsatzkontext, Dokumentation, menschliche Aufsicht sowie unterschiedliche Rollen von Anbietern und Betreibern.',
    h1: 'Hochrisiko-KI-Systeme',
    lead: 'Hohes Risiko bedeutet nicht automatisch Verbot. Es bedeutet auch nicht, dass eine einzelne Schutzmaßnahme bereits alle Anforderungen erfüllt.',
    sections: [
      ['Eine kontextabhängige Einordnung', 'Bestimmte KI-Systeme fallen bei Vorliegen der rechtlichen Voraussetzungen unter die Hochrisiko-Regeln. Sensible Einsatzbereiche sind ein wichtiger Ausgangspunkt, aber die Prüfung darf nicht bei einer Branchenbezeichnung stehen bleiben. Verwendungszweck, Funktion und die konkreten Bestimmungen müssen zusammen betrachtet werden.'],
      ['Maßnahmen müssen überprüfbar sein', 'Dokumentation, Datenqualität, Aufzeichnungen und menschliche Aufsicht betreffen unterschiedliche Teile des Umgangs mit Risiken. Die Aussage „Ein Mensch prüft alles“ reicht nicht, wenn diese Person weder die notwendigen Informationen noch eine echte Eingriffsmöglichkeit hat. Das Spiel fragt deshalb nach konkreten, begründbaren Maßnahmen und nicht nur nach beruhigenden Formulierungen.'],
      ['Die richtige Rolle zuordnen', 'Anbieter und Betreiber haben nicht dieselben Aufgaben. Kläre, wer das System bereitstellt und wer es im konkreten Kontext einsetzt. Ein Spielbericht stellt keine vollständige Prüfung aller Anforderungen dar. Für reale Beschaffung, Einführung oder Nutzung bleiben die aktuelle Rechtslage, mögliche weitere Vorschriften und eine fachkundige Prüfung entscheidend.']
    ]
  },
  transparency: {
    title: 'Transparenzpflichten für KI und künstliche Inhalte',
    description: 'Transparenz im AI Act: Menschen über KI informieren, künstliche Inhalte erkennen und Offenlegung von anderen Schutzmaßnahmen unterscheiden.',
    h1: 'Transparenzpflichten für KI',
    lead: 'Menschen sollen relevante Informationen erhalten. Ein Hinweis ist jedoch nicht mit einer umfassenden rechtlichen Freigabe gleichzusetzen.',
    sections: [
      ['Welche Information fehlt?', 'Bei einer KI-gestützten Interaktion oder bestimmten künstlich erzeugten Inhalten kann es darauf ankommen, dass Menschen die Art des Systems oder Inhalts erkennen können. Prüfe, welche konkrete Transparenzpflicht einschlägig ist, wer sie erfüllen muss und welche Voraussetzungen oder Ausnahmen der Verordnungstext vorsieht.'],
      ['Mehr als ein beliebiger Warnhinweis', 'Im Dossier zu künstlich erzeugten Medien genügt es nicht, irgendeinen Text anzuzeigen. Frage, ob die Information verständlich, relevant und dem richtigen Akteur zugeordnet ist. Technische Kennzeichnung und Information für ein menschliches Publikum sind unterschiedliche Fragen. Auch der Kontext der Veröffentlichung kann für die Bewertung wichtig sein.'],
      ['Andere Anforderungen bleiben bestehen', 'Transparenz ersetzt nicht automatisch Datenschutz, menschliche Aufsicht oder die Prüfung eines möglichen Verbots. Im Spiel musst du die Maßnahme mit dem tatsächlichen Problem verbinden. Für eine reale Veröffentlichung oder einen realen Dienst ist die vollständige aktuelle Regelung maßgeblich; die vereinfachten Fälle sind nur eine Lernhilfe für diese Überlegung.']
    ]
  },
  gpai: {
    title: 'KI-Modelle mit allgemeinem Verwendungszweck erklärt',
    description: 'GPAI im AI Act: Modelle und Anwendungen unterscheiden, Rollen in der Lieferkette verstehen und den konkreten Einsatz eines KI-Systems prüfen.',
    h1: 'KI-Modelle mit allgemeinem Verwendungszweck',
    lead: 'Ein vielseitiges Modell ist nicht mit jedem System gleichzusetzen, das darauf aufbaut. Beide Ebenen müssen nachvollziehbar unterschieden werden.',
    sections: [
      ['Vom Modell zur Anwendung', 'Ein Modell mit allgemeinem Verwendungszweck kann unterschiedliche Aufgaben unterstützen und in verschiedene nachgelagerte Systeme eingebunden werden. Daraus folgt nicht, dass alle darauf beruhenden Anwendungen dieselbe Risikoeinordnung haben. Der konkrete Zweck und die Funktion des eingesetzten Systems bleiben eigenständig zu untersuchen.'],
      ['Verantwortung in der Lieferkette', 'Ein Modellanbieter und eine Organisation, die eine darauf aufbauende Anwendung einsetzt, sind nicht einfach dieselbe Rolle. Informationen, Dokumentation und weitere Pflichten müssen anhand der jeweiligen Rolle und der einschlägigen Vorschriften betrachtet werden. Im Spiel ist eine unklare Lieferkette daher ein Anlass, gezielt nachzufragen, nicht Verantwortung pauschal auszulagern.'],
      ['Keine pauschalen Zusicherungen', 'Die allgemeine Leistungsfähigkeit eines Modells garantiert keine Eignung für einen bestimmten sensiblen Einsatz. Ebenso ist die bloße Nutzung eines allgemeinen Modells noch keine vollständige rechtliche Einordnung. Die Lernseite erklärt die Unterscheidung; genaue Definitionen, zusätzliche Regelungen und mögliche besondere Anforderungen sind im aktuellen EU-Rechtstext nachzulesen.']
    ]
  },
  literacy: {
    title: 'KI-Kompetenz lernen: Wissen, Kontext und Verantwortung',
    description: 'KI-Kompetenz mit NO AI ACT reflektieren: Grenzen verstehen, Belege prüfen und Verantwortung erkennen. Lernhilfe statt Zertifizierung oder Rechtsberatung.',
    h1: 'KI-Kompetenz im konkreten Einsatz',
    lead: 'Ein System bedienen zu können ist nicht dasselbe, wie seine Grenzen, Auswirkungen und den eigenen Handlungsspielraum zu verstehen.',
    sections: [
      ['Wissen mit dem Einsatz verbinden', 'KI-Kompetenz betrifft einen informierten Umgang mit KI im jeweiligen Kontext. Dazu gehört, technische Möglichkeiten nicht mit Verlässlichkeit gleichzusetzen, Unsicherheiten zu erkennen und die Folgen für Betroffene zu bedenken. Welche Kenntnisse gebraucht werden, hängt auch davon ab, welche Aufgaben eine Person mit dem System übernimmt.'],
      ['Begründungen gemeinsam prüfen', 'NO AI ACT übt ausgewählte Denkgewohnheiten: relevante Hinweise erkennen, Risiken im Kontext einordnen, Rollen unterscheiden und Maßnahmen begründen. In einer Lerngruppe lässt sich besprechen, warum zwei ähnlich klingende Begründungen nicht gleich belastbar sind. Der Gesprächsprozess ist wichtiger als eine schnelle Sammlung vermeintlich richtiger Antworten.'],
      ['Die Grenzen des Lernspiels benennen', 'Das Spiel deckt weder sämtliche technischen Kompetenzen noch alle rechtlichen Anforderungen ab. Ein abgeschlossener Fall oder Spielstand ist kein Zertifikat und kein Nachweis erfüllter Organisationspflichten. Für eine passende Schulung müssen Zielgruppe, Vorkenntnisse und tatsächliche Arbeitsaufgaben zusätzlich berücksichtigt werden. Die pädagogische Wirksamkeit des Projekts ist nicht durch eine kontrollierte Studie belegt.']
    ]
  }
};
