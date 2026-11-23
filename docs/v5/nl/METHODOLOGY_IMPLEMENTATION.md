# V5 methodologische en/of volledige dekking

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](../fr/METHODOLOGY_IMPLEMENTATION.md) · [Deutsch](../de/METHODOLOGY_IMPLEMENTATION.md) · [Español](../es/METHODOLOGY_IMPLEMENTATION.md) · [Português](../pt/METHODOLOGY_IMPLEMENTATION.md) · [Nederlands](../nl/METHODOLOGY_IMPLEMENTATION.md)

> Taaleditie V5.4.0 · 23 november 2026. Het dossier en de lokale materialen voor Study 02 zijn beschikbaar in zeven talen. Datums, aantallen en resultaten van het prototype beschrijven historische uitvoeringen. De huidige afspraken voor het vrijwillige sessieverslag voor volwassenen staan in SESSION_JOURNAL.md en vervangen de eerdere beperking tot uitsluitend geaggregeerde gegevens. Vertalingen bewijzen geen gelijkwaardigheid van instrumenten, onderwijseffectiviteit of validiteit van de rubric. Voor deze inhoudelijke update zijn geen nieuwe tests uitgevoerd.


Werktak `codex/v5-methodology-guided-path`, belangrijkste basislijn `527fde5`. Herziening van 21 November 2026. Dit rapport registreert lokale voltooiing voor de release. De eigenaar geautoriseerde vervolgens publicatie als V5.0.0; release status en notities zijn beschikbaar op GitHub en in [RELEase_NOTES_v5.0.0.en.md](../../RELEASE_NOTES_v5.0.0.en.md).

## Implementeerde wijzigingen

| Onderdeel | Gedrag |
|---|---|
| Zaak Scene en onderzoekzaken | Drie inleidende stops en vijf case-specifieke ondersteuningen voor elk van de 14 gevallen, in IT/EN/FR |
| EvidenceScene en notebook | Opende documenten opnieuw lezen, herkomst beoordelen, twee bronnen vrij met een reden verbinden |
| Begeleid onderzoekSessie | De eerste hypothese behouden, met redenen omklede herzieningen expliciet vastleggen, een kopie van argumenten, bronnen en relaties verzegelen vóór feedback |
| BesluitScene | Contextuele herinnering, heropenbare ondersteuning en autonome nota met betrekking tot claim, bewijsmateriaal, redenering, alternatief en onzekerheid vóór ondertekening |
| ReportScene | Case keuzes en regel, eerdere opmerking, reflectie, controle van feedback en aanvraagplan gescheiden gehouden |
| SessieEndScene | Debriefing van alle voltooide geleide gevallen, cross-case synthese en strategie voor nieuwe contexten |
| Toegankelijk dialoogvenster | Semantische HTML, labels, native selects/details, Escape, opgesloten en gerestaureerd focus, interne scrolling; isoleer pointer en toetsenbord van de scène |
| Lokale Study 02 | Twee nieuwe formulieren met vier originele bronnen elk in drie talen, vrije tekst vergrendeld bij indiening, geen automatische correctie |
| Observatie en rubriek | CEPAJe context, zeven observatierijen, zes door mensen gecodeerde dimensies, juridische correctheid gescheiden |
| Gegevensscheiding | Spelnoten alleen in het geheugen; laboratorium buiten dist, loopback GET/HEAD-server, expliciete lokale download alleen |

Het pad behoudt het verhaal, 14 gevallen, vooraf gedefinieerde redenen, originele uitkomsten en scores. Het schrijven of voorstellen van een relatie kent geen punten toe en levert geen kritische beoordeling op. Bemiddeling vraagt naar bewijs en omstandigheden zonder een juridische oplossing te onthullen voor feedback. Matrix C documenten aanpassing aan de EU-consolidatie van 27 juli 2026 gecontroleerd op EUR-Lex.

## Traceerbaarheid en materialen

Matrices A/B, de LM–GM kaart, CEPAJe analyse en bibliografie zijn in METHODologie.md; matrix C is in JURIDISCHE_LEARNING_MATRIX.md. COMIDDEL_COMPLETION.md koppelt het gewenste gedrag aan componenten. ARGUMENTATION_STUDY02.md bevat rubrics, ontwerp, driehoeksmeting en het analyseplan. Originele e-mails werden gelezen; verwijzingen en private traceerbaarheid blijven in het dossier van de eigenaar, buiten de openbare bouw. Er wordt geen feedback gepresenteerd als goedkeuring.

## Definitieve verificatie

De uitvoering werd voltooid voordat de nieuwe tests werden gestart, zoals gevraagd. De resultaten van de eerdere gedeeltelijke versie verklaren deze verhoging niet. De definitieve verificatie en de resultaten ervan worden geregistreerd in TEST_RESULTS.md na uitvoering. Geautomatiseerde tests gebruiken uitsluitend synthetische materialen en expliciete armaturen.

Commando's: `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Lokaal gebruik

Spel: `npm run dev`, open `/play/?lang=en`, selecteer een case en GUIDED PATH. Bemiddeling gaat vooraf aan de bewijsstukken. Opmerkingen zijn optioneel en verdwijnen bij herladen of een nieuw spel; geschreven tekst komt niet in het spel opslaan, export noch telemetrie.

Studie: `npm run study02:local`, open `http://127.0.0.1:4262/` en selecteer Engels. PRE/POST gebruik aparte tabbladen en tegenwichtige formulieren. Het instrument beheert geen identiteit, toestemming, randomisatie, aanwerving of institutionele bewaring: deze behoren tot het extern toegelaten protocol. Debriefing blijft uitgeschakeld vóór indiening. Expliciete download slaat ingediende tekst en menselijke notities op het apparaat.

Rookreferentie: `CHROMIUM_PATH` kan geïnstalleerde Chrome selecteren. `INQUIRY_PORT` kiest de poort. `INQUIRY_ONLY` beperkt een profiel voor diagnose; de oorspronkelijke volledige methodologische verificatie gebruikte alle profielen. Begeleide dekking omvat 14-cases × drie talen plus drie lay-outprofielen: 45-reizen. Study 02 bestaat uit twee vormen × drie talen × PRE/POST: 12 configuraties. Deze commando's documenteren die verificatie; ze worden niet opnieuw uitgevoerd voor de lokalisatie correctie.

Op deze Windows machine, `INQUIRY_4K_GPU=d3d11` vraagt Direct3D voor het 3840×2160 profiel alleen; andere profielen gebruiken de software renderer van de test. Elk resultaat registreert de werkelijke backend, en reproducties moeten dit verschil onthullen. Alleen software 4K startup overschreed de 90-second timeout in de bestaande Preload. GPU diagnose bereikte titel in ongeveer 5.6 seconden. Dit is geen algemene prestatieschatting.

## Open limieten

- Inhoud/functie dekking verschilt van educatieve geldigheid. Beginnerspiloten, observaties, producties en een onafhankelijke taak zijn nodig; er is geen menselijk onderzoek uitgevoerd.
- Rubriek, vorm equivalentie en vertalingen zijn voorlopig: tweetalige beoordeling, cognitieve interviews, ankers en inter-rater overeenkomst blijven noodzakelijk.
Bemiddeling is tekstueel. Dichtheid, pacing en autonomie moeten worden gecontroleerd in de CEPAJe-context; gelijkwaardige mondelinge reacties vereisen toestemming voor bemiddeling.
- Echte schermlezers, dictee, on-screen toetsenborden en fysieke apparaten moeten worden getest door mensen. Geautomatiseerde controles tonen geen universele toegankelijkheid aan.
- De autonome nota volgt de alternatieven van het verslag. Hun mogelijke cueing effect wordt methodologisch aangepakt door middel van de externe taak.
- De eerste noot is de speler's verklaring. Eerdere blootstelling aan een zaak kan van invloed zijn; het onderzoek baseline is een onafhankelijke PRE voordat gameplay in een nieuwe sessie.
Game notes zijn geen individuele tracking. Een opening of revisie laat geen begrip zien: driehoeksmeting berust op verklaringen en externe menselijke observatie.
- Nieuwe materialen vereisen menselijke juridische toetsing vóór toediening. De antwoorden van de 14 zaken zijn niet veranderd.
- De bibliografie is een gerichte enquête; elke vermelding geeft grenzen aan de toegang tot de volledige tekst.
- Het oorspronkelijke technische rapport gaat vooraf aan publicatie; de vrijgavestatus wordt afzonderlijk geregistreerd in V5.0.0.

## Bezorgbaarheid

| Verzoek | Resultaat |
|---|---|
| Methode en Europese bibliografie | METHODologie.md |
| Terugkoppelingsmatrix | Matrix A en COMIDDEL_COMPLETION.md; privé-dossier apart |
| LM–GM | METHODologie.md |
| CEPAJe | METHODologie.md; laboratoriumcontext |
| Begeleid pad | onderzoekcases, BegeleidInquiryDialog en game scènes |
| Onderzoekscyclus en feedback | Revisies, verzegelde noot en afzonderlijke reflectie |
| Rubric | ARGUMENTATION_STUDY02.md en handmatig laboratorium |
| Study 02 overdracht | Twee complete formulieren in onderzoek/studie02 |
| Tests | METHODologie_BEST_PLAN.md en TEST_RESULTS.md |
| Wijzigingen en limieten | Dit document |
