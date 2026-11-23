# V5.2 › Vrijwillige individuele sessie journaal

[Italiano](../SESSION_JOURNAL.md) · [English](../en/SESSION_JOURNAL.md) · [Français](../fr/SESSION_JOURNAL.md) · [Deutsch](../de/SESSION_JOURNAL.md) · [Español](../es/SESSION_JOURNAL.md) · [Português](../pt/SESSION_JOURNAL.md) · [Nederlands](../nl/SESSION_JOURNAL.md)

> Taaleditie V5.4.0 · 23 november 2026. Het dossier en de lokale materialen voor Study 02 zijn beschikbaar in zeven talen. Datums, aantallen en resultaten van het prototype beschrijven historische uitvoeringen. De huidige afspraken voor het vrijwillige sessieverslag voor volwassenen staan in SESSION_JOURNAL.md en vervangen de eerdere beperking tot uitsluitend geaggregeerde gegevens. Vertalingen bewijzen geen gelijkwaardigheid van instrumenten, onderwijseffectiviteit of validiteit van de rubric. Voor deze inhoudelijke update zijn geen nieuwe tests uitgevoerd.


22 November 2026. Implementeert het latere verzoek van de eigenaar om de inzameling verder uit te breiden dan aggregaten. De eerdere beperking tot geaggregeerde gegevens blijft in het historische V5.0-dossier. Het Study 02 protocol is ongewijzigd. Deze vertaling beschrijft dezelfde bestaande dienst, zonder uitbreiding van de collectie.

## Beschikbaar bewijs

Alleen na toestemming van een volwassene: een willekeurige tab-sessie identificatie, versie, kanaal (productie; beta in historische records), initiële taal en modus, moeilijkheid, geselecteerde pad en publiek; gebeurtenissen met UUID, volgorde, poging, geval, fase, cliënt-aangegeven tijd, verstreken tijd en server ontvangsttijd. Het geselecteerde budget is inbegrepen; het is niet echt verstreken speeltijd. Sessieversie is de versie aan het begin.

| Actie | Record | Vertolkingsgrens |
|---|---|---|
| Opening, start, hervat, navigatie | Gebeurtenissen en context | Openen betekent niet lezen |
| Bewijsstukken | Index, geopend/aangehaald, toevoegingen/verwijderingen en ontwerpstaat | Geen aandachtsmaatregel |
| Vergelijking | Paar getoonde indexen | Stelt geen juiste correlatie vast |
| Besluiten | Classificatie, maatregel, actor, reden, aanhalingstekens, vertrouwen | Door de cliënt opgegeven gegevens kunnen worden gemanipuleerd |
| Incident | Canonische optie, inclusief toetsenbordselectie | Meten niet een stabiele ethische bepaling |
| Verslag | Getekende keuzes en interne resultaten | Spelresultaat, niet gevalideerde competentie |
| Begeleid pad | Hypothese opgeslagen/herzien, relaties toegevoegd/verwijderd, veld en revisie telt | Tellingen zijn geen redenerende kwaliteit |
| Argumentatie | Indiening vóór feedback onderscheiden van latere reflectie | Geen kritische scores |
| Zelfcontrole | Telt uit de facultatieve pre/post oefening | Geen impliciete externe validatie |
| Hulp, tutorial, feedback, beoordeling, toegankelijkheid | Gebeurtenissen vóór vermindering door de geaggregeerde adapter | Gebruik leidt niet tot leren |
| Activiteit | Hartslag met zichtbaarheid, focus en recente activiteit | Een schatting, zonder oogtracking |

Een **second consent**, aanvankelijk niet geselecteerd, maakt snapshots van opgeslagen geleide-pad schrijven mogelijk: hypothesen, bronbeoordelingen, redenen voor relaties/herzieningen, argument, reflectie en overdrachtsplan. Er worden geen individuele toetsaanslagen geregistreerd. Een veld per evenement, maximaal 1,200 tekens; server-side AES-GCM encryptie. De interface vraagt mensen om persoonlijke of gevoelige gegevens te vermijden. Schrijven ontvangt geen automatische beoordeling.

Er worden geen namen, e-mails, IP-adressen op toepassingsniveau, user agents, vingerafdrukken, locatie, reclame of links tussen bezoeken/klassen toegevoegd. Het dagboek is **pseudoniem**, niet anoniem beschreven.

## Toestemming en rechten

De uitnodiging is beschikbaar in IT/EN/FR/DE/ES/PT-PT. Weigering verwijdert geen spelfuncties. Voor toestemming wordt er geen serversessie aangemaakt en worden er geen journal events in de wachtrij geplaatst. De vorige opslaggeschiedenis is niet geüpload. Hetzelfde tabblad kan zijn journal gedurende 24 uur hervatten, ook na herladen; toestemming wordt niet meegenomen naar een ander bezoek of tabblad. Minderjarigen kunnen spelen en worden niet uitgenodigd om het individuele journaal te activeren.

De wachtrij, ontvangst en private credential gebruiken de tabsessieStorage. Persoonlijke export onderscheidt ontvangen evenementen van lokale lopende evenementen. Het downloadbare ontvangstbewijs bevat een toegangssleutel en moet privé blijven. Het kan worden heropend om te exporteren of te wissen nadat het tabblad sluit; het herstart de opname niet. Zonder ontvangstbewijs na het sluiten van het tabblad, kan de controller niet in staat zijn om de juiste record te vinden omdat er geen persoonlijke identiteit wordt gehouden.

Terugtrekking stopt onmiddellijk met verzamelen. Offline wissen wordt getoond als **pending**, niet compleet; de klant opnieuw. Het uitschakelen van statistieken in de spelbalk trekt ook het tijdschrift in. DNT/GPC voorkomen activering; als ze later worden gedetecteerd, stoppen ze met opnemen en verzoeken ze om verwijdering.

Records worden ontoegankelijk 90 dagen na toestemming en worden verwijderd door dagelijkse schoonmaak. Terugtrekking verwijdert alle gebeurtenissen en de sessie record. Slechts een technisch ontvangstbewijs blijft tot hetzelfde verstrijken: UUID, credential hash, intrekkings- en vervaldatums, om vertraagde resubmissions te weigeren.

Rechtsgrondslag: toestemming krachtens AVG Artikel 6(1)(a). Controller: Matteo Angeloni; contacten verschijnen op de auteur pagina's. Cloudflare biedt Workers/D1 en verwerkt verbindingsmetadata voor levering en beveiliging. De bestaande database is geconfigureerd in de EU-jurisdictie; dat garandeert geen anonimiteit of het ontbreken van overdrachten over de gehele infrastructuur. [Zestalige privacyverklaring](https://www.no-ai-act.eu/game-statistics.html).

Het doel is om gameplay en leerondersteuning te corrigeren en te verbeteren. Het 90-daagse venster ondersteunt vergelijkingen tussen iteraties zonder een onbepaald individueel archief. Toestemming staat geen niet-gerelateerde of onevenredige verzameling toe: EDPB Guidelines 05/2020, paragraaf 5, behoud noodzakelijkheid, evenredigheid en GDPR Artikel 5-beginselen. Het verzamelen strekt zich niet uit tot extern surfen, identificatie met naam, vingerafdruk of verzoeken om gevoelige spelersgegevens.

## Technisch contract

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` gebruiken dezelfde productie collector. De vorige `beta.no-ai-act.eu` host behoudt API en gedownloade-receipt compatibiliteit alleen; de bèta spel is gepensioneerd en omleidt naar stabiel. Geen gegevensmigratie of verwijdering.

Stabiele en historische oorsprong, begrensd JSON POST verzoeken, geen referenties in URL's, geen cookies, payload logging uitgeschakeld. Migratie 0007 voegt vier tabellen zonder het herschrijven van eerdere tellers. Slechts een hash van de private geloofwaardigheid wordt opgeslagen in de database. `JOURNAL_TEXT_KEY` blijft buiten de code en identiek op beide Werknemers; het is nodig om te versleutelen / lezen schrijven. Verliezen maakt schrijven onleesbaar. Niet verwijderen of roteren zonder sleutels te behouden. Dit is geen end-to-end encryptie: de server kan geautoriseerde export decoderen.

Onveranderlijke ID's, expliciete erkenning van individuele gebeurtenissen, idempotente retrieves en een wachtrij die tabbladherladen overleeft. Limieten: 30,000 bytes per verzoek, 40 events per batch, 10,000 events per sessie, 1.4 MB client queue; 5,000 new sessions en 50,000 events per dag. Er gelden limieten voor het innamepercentage per sessie. Quota's kunnen de dekking onvolledig maken. Keepalive kan geen levering garanderen wanneer de browser sluit, het netwerk uitvalt, opslag wordt geweigerd of het 24-uursvenster verloopt.

Het prive Cloudflare Access-beschermde dashboard toont ** individuele sessies** eerst: gecombineerde filters, kanaal, versie, ontvangen tel- en schrijftoestemming. Taal/modus filter initiële context; geval selecteert sessies met een gebeurtenis voor dat geval. Pagina's bevatten 50-sessies, progressieve tijdlijnen laden 200-evenementen, JSON/CSV-export is beschikbaar. Het privétijdschrift heeft geen drempel van 10. Het toont gaten voor de laatste reeks, maar kan niet onthullen een laatste wachtrij nooit ontvangen.

## Historische records en niet beschikbare waarden

`usage_case_completed`, `usage_case_left`, `usage_session_completed` worden verzoend met canonieke namen in de historische weergave. Verzoeken om afmetingen zonder backend werden verwijderd. Historische gegevens behouden aggregatie en drempels: sequenties, resultaten en timings die door de adapter worden weggegooid ** kunnen niet worden gereconstrueerd**. Ontbrekende gegevens worden niet vervangen door nullen, schattingen of uitgevonden gebeurtenissen.

## Controle en open grenzen

De V5.2 release geregistreerde client / server verificatie met echte SQLite voor toestemming, zes talen, alle 14 case ID's, exacte eigenschappen, herhalingen, volgorde conflicten, herladen, verlopen, encryptie, onbevoegde toegang, export, offline intrekking en inname races, quota en retentie. Het betrof ook regressie, client/worker types, build, SEO en distributie. Die executies zijn historisch; deze vertaling meldt geen nieuwe testruns.

Er werden geen rook- of browsertests uitgevoerd voor die release, zoals gevraagd. Visuele en ondersteunende verificatie op echte apparaten blijft daarom beperkt. Specialistische taalkundige beoordeling, contextspecifieke privacy review, elke toekomstige weg voor minderjarigen en educatief onderzoek met gevalideerde instrumenten blijven open. Geen goedkeuring door Alvarez/Pelizzari en geen activering van Study 02.

## Bronnen geraadpleegd in het vorige onderzoek

- [CONTACT-GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504).
- [EDPB-toestemmingsrichtsnoeren](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB ePrivacy Article 5(3)](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Garante tracking guidelines](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1 data location](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014: semantische inspiratie zonder aanspraak te maken op xAPI compliance.
