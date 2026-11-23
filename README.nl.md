# NO AI ACT · v5.4.0

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Nederlands](README.nl.md)

**Educatief onderzoeksspel over de Europese AI-verordening**

[▶ Spelen](https://www.no-ai-act.eu/play/?lang=nl) · [Website en leermaterialen](https://www.no-ai-act.eu/nl/) · [Stabiele versie](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.4.0)

Het is 2032 in een denkbeeldige Europese stad waar de AI-verordening nooit van kracht is geworden. Als inspecteur onderzoek je het gebruik van AI-systemen aan de hand van documenten, verklaringen en logboeken. Het spel is gratis, open source en werkt zonder account in de browser.

## Beschikbaarheid

Spel, website, leermaterialen, persmappen, README-bestanden en methodologisch dossier zijn beschikbaar in dezelfde zeven talen: Italiaans, Engels, Frans, Duits, Spaans, Europees Portugees (pt-PT) en Nederlands. Elke taal bevat alle 14 dossiers en dezelfde 37 onderdelen van de website. Bestaande webadressen blijven behouden.

## Het spelverloop

- Onderzoek: open bewijsstukken, beoordeel de herkomst, citeer bewijs en vergelijk bronnen. Kies classificatie, maatregel, verantwoordelijke en motivering. Onderteken het rapport en bespreek gevolgen en beperkingen.
- Het begeleide traject verbindt begrip, hypothese, onderzoek, eigen argumentatie vóór feedback, nabespreking en reflectie over een ander dossier. Je kunt teruggaan naar het bewijs en herzieningen toelichten. Schrijven blijft vrijwillig.
- Vier spelvormen gebruiken dezelfde dossiers: Dienst, Vrij onderzoek, Verrassingsinspectie en Herhaling van dossiers met fouten. De gekozen duur is een indicatief tijdsbudget.
- De docentenmodus biedt een handleiding en materiaal voor een lokale nabespreking. Lesactiviteiten, drie lesplannen, een begrippenlijst en achtergrondartikelen ondersteunen voorbereiding en discussie.
- Toetsenbordbediening, een toegankelijke leeslaag en instellingen voor geluid, tekst en beweging. Opgeslagen spellen van versie 2 en de migratie vanaf versie 1 blijven compatibel.

## Methode en beperkingen

CEPAJe en LM–GM verbinden context, begeleiding, handelingen en waarneembaar bewijs. Het dossier bevat matrices, een voorlopige rubric en een specificatie van een transfertaak. Feedback van Julian Alvarez en Federica Pelizzari ondersteunt het herontwerp en vormt geen aanbeveling of wetenschappelijke validatie. Een spelscore of succesvol resultaat bewijst geen leren of kritisch denken. Kritisch denken wordt niet automatisch gescoord. Deze vereenvoudigde rechtssimulatie biedt geen juridisch advies of certificering.

[Methode en beperkingen](docs/v5/README.nl.md) · [Methodologie, feedback, CEPAJe en LM–GM](docs/v5/nl/METHODOLOGY.md) · [Juridische matrix van de 14 dossiers](docs/v5/nl/LEGAL_LEARNING_MATRIX.md)

## Gegevens en privacy

Je voortgang blijft in de browser. Geaggregeerde tellers kun je uitschakelen. Alleen volwassenen kunnen toestemming geven voor een gepseudonimiseerde sessieregistratie met een bewaartermijn van 90 dagen. Teksten uit het begeleide traject vereisen aanvullende toestemming, die standaard niet is geselecteerd. Intrekken, wissen en exporteren kan via de spelbalk. DNT/GPC worden gerespecteerd. Er zijn geen accounts, advertentieprofielen of koppelingen tussen bezoeken. De registratie gebruikt telemetry.no-ai-act.eu; eerdere API-adressen blijven werken voor bestaande privébewijzen en exports.

[Gegevens en privacy](https://www.no-ai-act.eu/game-statistics.html#nl) · [Actueel protocol voor sessieregistratie](docs/v5/nl/SESSION_JOURNAL.md)

## Onderzoeksmaterialen

Study 02 is een lokaal laboratorium buiten de openbare spelversie, met twee taakvormen en een door mensen gecodeerde rubric in zeven talen. Het activeert geen onderzoek met deelnemers. Taalkundige gelijkwaardigheid, geldigheid van de rubric en leereffectiviteit moeten nog met mensen worden onderzocht. Verificatieresultaten in het dossier zijn historische registraties.

[Rubric en transfertaak Study 02](docs/v5/nl/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Lokale ontwikkeling

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=nl
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Auteur

Matteo Angeloni is verantwoordelijk voor het concept, het spelontwerp, de ontwikkeling en de educatieve inhoud. Hij is promovendus aan de University of Tuscia. Het is een onafhankelijk project, zonder impliciete institutionele goedkeuring. Gemaakt met ondersteuning van AI onder menselijke redactionele verantwoordelijkheid.

[Matteo Angeloni](https://www.no-ai-act.eu/nl/matteo-angeloni/)

## Licenties

Code: GPL-3.0-or-later; inhoud: CC BY-SA 4.0. Zie LICENSE, CREDITS en THIRD_PARTY_LICENSES voor naamsvermelding en onderdelen. Titels van publicaties en persartikelen blijven in de oorspronkelijke taal.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Technische documentatie en versiegeschiedenis

[Stabiele versie](docs/RELEASE_NOTES_v5.4.0.nl.md) · [Methode en beperkingen](docs/v5/README.nl.md) · [Press kit](https://www.no-ai-act.eu/nl/persmap/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)
