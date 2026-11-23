# Definitieve verificatie van V5 methodologische dekking

[Italiano](../TEST_RESULTS.md) · [English](../en/TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md) · [Deutsch](../de/TEST_RESULTS.md) · [Español](../es/TEST_RESULTS.md) · [Português](../pt/TEST_RESULTS.md) · [Nederlands](../nl/TEST_RESULTS.md)

> Taaleditie V5.4.0 · 23 november 2026. Het dossier en de lokale materialen voor Study 02 zijn beschikbaar in zeven talen. Datums, aantallen en resultaten van het prototype beschrijven historische uitvoeringen. De huidige afspraken voor het vrijwillige sessieverslag voor volwassenen staan in SESSION_JOURNAL.md en vervangen de eerdere beperking tot uitsluitend geaggregeerde gegevens. Vertalingen bewijzen geen gelijkwaardigheid van instrumenten, onderwijseffectiviteit of validiteit van de rubric. Voor deze inhoudelijke update zijn geen nieuwe tests uitgevoerd.


21 November 2026. Prototype rapport voorafgaand aan de V5.0.0 release. De tests begonnen na de implementatie van de volledige operationele lijst in COGEAD_COMPLETION.md; correcties werden gevolgd door nieuwe runs. Deze resultaten hebben betrekking op de lokale kloon. Publicatiecontroles worden afzonderlijk gedocumenteerd in de publicatie. Deze vertaling registreert die eerdere executies; het is geen nieuwe rooktest voor V5.0.1.

| Controleren | Waargenomen resultaat |
|---|---|
| TypeScript | PASS, inclusief de build na de dialoogcorrectie |
| Vitest suite | 1,509-tests in 95-bestanden, allemaal goedgekeurd |
| Bouwen van vite | PASS; spel-bundelgrootte waarschuwing, ongeveer 1.83 MB geminifieerd |
| SEO-audit | 155 routes, geen kritieke gebreken of waarschuwingen |
| Dist-verificatie | 155/155 routes, geen mojibake in HTML, geen externe collectie vorm |
| Begeleid pad | 45-ritten verlopen: alle 14-cases × IT/EN/FR plus drie lay-outprofielen |
| Catalogusregressie | 42 standaardritten verlopen, correcte resultaten en rapporten hersteld na herladen |
| Modi | Shift, Free, Surprise, Review × drie talen: 12 configuraties verlopen |
| Study 02 | Twee formulieren × drie talen × PRE/POST: 12 gepasseerd |
| Spelgegevens | Synthetische markers in hypotheses, bronnen, relaties en reflecties die niet voorkomen in lokale opslag en telemetrie; herlaadt clears notes |
| Study 02 gegevens | Geen cookies of browseropslag; expliciete lokale kopie alleen; POST afgewezen met 405; materialen uitgesloten van openbare bouw |

## Wat de geleide reis dekt

Elke reis begint van de zaak, vult drie inleidende stops, behoudt de eerste hypothese, opent documenten met de werkelijke sleutels van het spel en citeert bewijsmateriaal. In het notitieboekje leest het een bron, annoteert herkomst en grenzen, registreert het twee gemotiveerde herzieningen en een uitgelegde relatie. Door in het dialoogvenster te klikken en te typen mag de onderliggende expositieselectie niet worden gewijzigd.

De test wordt voortgezet door middel van de methodologische herinnering, vier besluiten en ondertekening. Het invoeren van een nieuwe regel in de notitie mag niet ondertekenen. De bevestiging bevestigt de tekst vóór het rapport; latere pogingen kunnen deze niet wijzigen. Debriefing onderscheidt eerdere notitie, regel, reflectie, feedback gebruik en een new-case plan. Sessie synthese omvat alle voltooide geleide gevallen. Herladen ontruimt de nieuwe tijdelijke staat. Tijdens de rooktest is geen externe aanvraag of POST toegestaan.

Profielen: IT 1920×1080 en 320×800; EN 390×844 en 640×360; FR 390×844 en 3840×2160. Controleert dekking focus, Tab, Escape, multiline invoer en afwezigheid van dialoog overflow. De laatste 4K test maakt gebruik van Direct3D11 op Intel Iris Xe; de gedetecteerde backend wordt geregistreerd in JSON. De andere vijf profielen maken gebruik van SwiftShader. Dit houdt niet in dat wordt getest met fysieke apparaten, toetsenborden op het scherm of echte schermlezers.

De 14 cases worden geselecteerd door bevestiging; bewijsstukken, beslissingen en ondertekening maken gebruik van de werkelijke interface. Dit bevestigt bestaande motorresultaten, geen begrip van deelnemers of onafhankelijke juridische nauwkeurigheid van de antwoordsleutel.

## Correcties en technische grenzen

1. Vite's kijker kon een test download nog steeds vergrendeld door Windows observeren, waardoor EBUSY. Artefact en lokale-graaf mappen zijn nu uitgesloten. De volledige catalogus en begeleid pad passeerde de nieuwe uitvoering.
2. Phaser luistert ook naar muisgebeurtenissen in het venster: het klikken in het dialoogvenster kan een citaat wijzigen. Het dialoogvenster schakelt de invoer van scènes tijdelijk uit en stopt pointer, muis en touch propagation. De test reproduceert de credit case en controleert ongewijzigde expositiekeuze bij alle 45 eindritten.
3. De externe-vormen controle gescand de groeiende synthetische-artefact map en timed out. Het sluit nu precies scripts/smoke/out, die niet verzonden bron. Public-source en dist controles blijven actief; de uiteindelijke suite geslaagd 1,509 tests.
4. Inheemse software-alleen 4K startup overschreed 90 seconden in de bestaande Preload. Direct3D11 diagnose bereikte titel in ongeveer 5.6 seconden, en de volledige uiteindelijke 4K reis, inclusief herladen, voorbij. De software timeout blijft een beperking van die configuratie en wordt niet beweerd vast. De rendering motor werd niet gewijzigd.

## Study 02

De twaalf configuraties controleren vier bronnen per formulier, het ontbreken van antwoordopties, gratis argument, indiening vergrendeling, debriefing niet beschikbaar voor indiening, zeven observatierijen en zes door mensen gecodeerde dimensies. Niet waargenomen blijft onderscheiden van 0. Er is geen volledige of automatische correctie. Het JSON-exemplaar bevat ingediende tekst en expliciete notities zonder deelnemersidentificatie. Tests gebruiken alleen synthetische tekst.

## Reproductie

Gebruik in de lokale kloon de commando's die vermeld staan in METHODOLOGY_IMPLEMENTATION.md. Om 4K te reproduceren op deze Windows-machine, stel CHRO MIUM_PATH in op geïnstalleerde Chrome en INQUIRY_4K_GPU=d3d11. ONDERZOEK_ONLEY en ONDERZOEK_CASE zijn kenmerkende filters; de volledige oorspronkelijke verificatie heeft ze niet gebruikt. JSON rapporteert record viewport, taal, case en werkelijke renderer.

## Menselijke validatie nog steeds vereist

Functionele feedbackdekking wordt geïmplementeerd en geverifieerd in de opgegeven configuraties. Educatieve effectiviteit, argument kwaliteit, vorm gelijkwaardigheid, vertalingen, juridische nauwkeurigheid voor de administratie en hulptechnologie toegankelijkheid vereisen de menselijke controles van het protocol. Er is geen onderzoek naar deelnemers uitgevoerd. Geen spel resultaat wordt een automatisch kritisch-denken score. In dit stadium was deze verhoging nog niet gepubliceerd.
