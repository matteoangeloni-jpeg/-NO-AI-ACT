// Editorially revised legal and privacy language. This is linguistic review,
// not validation of learning effectiveness or a new legal answer key.
export const DUTCH_NORMS={
 norm_bias_detection:{
  title:'Bijzondere persoonsgegevens om bias op te sporen',
  reference:'AI-verordening — Verordening (EU) 2024/1689, gewijzigd bij Verordening (EU) 2026/1744, artikel 4 bis',
  explanation:'Om discriminatie op grond van etnische afkomst, godsdienst of gezondheid te ontdekken, moeten juist die gegevens worden verwerkt. De AVG beschermt ze als bijzondere categorieën persoonsgegevens. Artikel 4 bis biedt een beperkte uitzondering: aanbieders van AI-systemen met een hoog risico mogen deze gegevens verwerken om bias op te sporen en te corrigeren, uitsluitend voor zover strikt noodzakelijk en onder zes CUMULATIEVE voorwaarden: andere gegevens volstaan niet; technische beperkingen op hergebruik en pseudonimisering; gedocumenteerde toegangscontroles; geen doorgifte aan derden; verwijdering zodra de bias is gecorrigeerd; en vastlegging van de redenen in het verwerkingsregister.',
  notMeaning:'Dit geeft geen algemene toestemming om gevoelige gegevens te verzamelen «voor eerlijkheid». Het is een beperkte uitzondering met zes sloten: wie er vijf opent, verwerkt bijzondere persoonsgegevens zonder rechtsgrond. Het omgekeerde geldt evenmin: het tweede lid zegt uitdrukkelijk dat niemand verplicht is bias op te sporen.',
  democraticFunction:'Discriminatie kan worden opgespoord zonder dat die zoektocht zelf een nieuw persoonsregister wordt.',
  tags:['bijzondere persoonsgegevens','bias','hoog risico','AVG']
 },
 norm_predpol:{
  title:'Verbod op individuele voorspellende politiezorg',
  reference:'AI-verordening — Verordening (EU) 2024/1689, gewijzigd bij Verordening (EU) 2026/1744, artikel 5, lid 1, punt d',
  explanation:'Het is verboden AI-systemen te gebruiken om het risico te voorspellen dat iemand een strafbaar feit pleegt, uitsluitend op basis van profilering of persoonlijkheidskenmerken.',
  notMeaning:'AI is daarmee niet volledig uitgesloten van strafrechtelijk onderzoek. Ondersteuning van een menselijke beoordeling op basis van objectieve feiten die verband houden met criminele activiteiten valt buiten dit verbod.',
  democraticFunction:'Mensen mogen niet als verdachte worden behandeld vanwege wie zij zijn, waar zij wonen of wie zij kennen, in plaats van vanwege wat zij doen.',
  tags:['verboden praktijken','profilering','politiezorg']
 },
 norm_frodi_welfare:{
  title:'Hoog risico: toegang tot essentiële uitkeringen',
  reference:'AI-verordening — bijlage III, punt 5; artikelen 14 en 26',
  explanation:'Systemen die de toegang tot essentiële overheidsuitkeringen beoordelen, hebben een hoog risico. Ze vereisen gegevenskwaliteit, traceerbaarheid en effectief menselijk toezicht voordat de gevolgen mensen raken.',
  notMeaning:'Instanties mogen fraude blijven bestrijden. Een score mag echter niet zelfstandig een recht opschorten voordat een mens het dossier heeft gecontroleerd.',
  democraticFunction:'Mensen die afhankelijk zijn van sociale voorzieningen worden beschermd tegen automatische fouten. De overheid moet de controle uitvoeren; die last ligt niet bij de burger die bezwaar maakt.',
  tags:['hoog risico','sociale voorzieningen','menselijk toezicht']
 },
 norm_social_scoring:{
  title:'Verbod op sociale scoring',
  reference:'AI-verordening — artikel 5, verboden praktijken',
  explanation:'AI-systemen die mensen beoordelen of indelen op basis van sociaal gedrag of persoonlijke kenmerken zijn verboden wanneer de score leidt tot nadelige behandeling in een context die losstaat van die waarin de gegevens zijn verzameld, of tot een anderszins ongerechtvaardigde of onevenredige behandeling.',
  democraticFunction:'Sommige AI-praktijken vragen om een verbod, omdat zij onverenigbaar zijn met waardigheid, gelijkheid en individuele vrijheid.',
  notMeaning:'Niet elke rangschikking of prioriteitsregeling is verboden. Het probleem is het onevenredige of niet-relevante gebruik van sociale en reputatiegegevens in een andere context.',
  tags:['verbod','scoring','overheidsdiensten']
 },
 norm_lavoro_alto_rischio:{
  title:'AI-systemen met een hoog risico op het werk',
  reference:'AI-verordening — bijlage III, werkgelegenheid en personeelsbeheer',
  explanation:'AI-systemen voor werving, selectie, beoordeling en aansturing van werknemers worden als hoog risico ingedeeld. Ze vereisen risicobeheer, gegevenskwaliteit, effectief menselijk toezicht, logboeken en informatie voor de betrokken personen.',
  democraticFunction:'Toegang tot werk mag niet afhangen van ondoorzichtige indelingen die begrip, mobiliteit en bezwaar onmogelijk maken.',
  notMeaning:'Niet elk digitaal HR-instrument is verboden. Systemen die mensen selecteren, beoordelen of aansturen, vereisen stevige waarborgen.',
  tags:['hoog risico','werk','toezicht']
 },
 norm_trasparenza_sintetici:{
  title:'Transparantie over synthetische inhoud',
  reference:'AI-verordening — artikel 50, transparantieverplichtingen',
  explanation:'Twee afzonderlijke verplichtingen: (1) wie met een AI-systeem communiceert, moet weten dat het een machine is; (2) kunstmatig gegenereerde of gemanipuleerde inhoud, waaronder deepfakes, moet als zodanig herkenbaar zijn door toedoen van degenen die deze maken of verspreiden. Didactische toelichting: transparantieverplichtingen kunnen samenlopen met andere risicocategorieën. Alleen voor de uitleg in dit spel worden ze als afzonderlijke categorie weergegeven.',
  democraticFunction:'Transparantie helpt publieke communicatie, manipulatie en synthetische inhoud van elkaar te onderscheiden.',
  notMeaning:'AI-gegenereerde inhoud is niet automatisch onrechtmatig. In bepaalde gevallen moet wel herkenbaar zijn dat de inhoud synthetisch of gemanipuleerd is.',
  tags:['transparantie','deepfake','informatie']
 },
 norm_emotion_recognition:{
  title:'Verbod op emotieherkenning op school en op het werk',
  reference:'AI-verordening — artikel 5, verboden praktijken met beperkte uitzonderingen',
  explanation:'Het gebruik van AI-systemen om emoties van mensen af te leiden op het werk en in onderwijsinstellingen is verboden, behoudens de beperkte uitzonderingen in de verordening, bijvoorbeeld voor medische of veiligheidsdoeleinden.',
  democraticFunction:'Onderwijs en werk mogen geen omgeving van permanente emotionele surveillance worden.',
  notMeaning:'Niet elke waarneming van gedrag is verboden. Het gaat om automatische afleiding van emoties op school of op het werk, met de uitzonderingen die de verordening bepaalt.',
  tags:['verbod','emoties','school','werk']
 }
};
Object.assign(DUTCH_NORMS,{
 norm_alto_rischio_obblighi:{
  title:'Verplichtingen voor AI-systemen met een hoog risico',
  reference:'AI-verordening — verplichtingen voor AI-systemen met een hoog risico',
  explanation:'AI-systemen met een hoog risico moeten voldoen aan eisen voor risicobeheer, gegevenskwaliteit, technische documentatie, logboeken, transparantie, menselijk toezicht, nauwkeurigheid, robuustheid en cyberbeveiliging. Deze verplichtingen gelden ook na ingebruikname, onder meer via monitoring na het in de handel brengen.',
  democraticFunction:'Een automatisch systeem dat ingrijpt in mensenlevens moet ook controleerbaar zijn op zijn gevolgen voor kwetsbare groepen.',
  notMeaning:'AI in de zorg is niet verboden. Systemen die gezondheid, veiligheid of rechten beïnvloeden, moeten worden beheerd, gedocumenteerd en gecontroleerd.',
  tags:['hoog risico','audit','gegevens','zorg']
 },
 norm_biometria:{
  title:'Biometrische identificatie op afstand',
  reference:'AI-verordening — artikel 5 en specifieke bepalingen over biometrie',
  explanation:'Het verbod van artikel 5 betreft biometrische identificatie op afstand in real time, in voor het publiek toegankelijke ruimten en voor rechtshandhavingsdoeleinden. Alleen limitatief opgesomde uitzonderingen zijn mogelijk, onder zeer strenge voorwaarden en met vereiste toestemmingen. Voor andere biometrische toepassingen kunnen andere regels gelden, waaronder de regels voor hoog risico, afhankelijk van context en doel.',
  democraticFunction:'De openbare ruimte mag geen gebied van permanente automatische identificatie worden.',
  notMeaning:'Niet elke biometrische toepassing is verboden. Het regime hangt af van het doel, de context, de gebruiksverantwoordelijke en de voorwaarden uit de verordening.',
  tags:['verbod','biometrie','openbare ruimte']
 },
 norm_credito:{
  title:'Sociale scores en toegang tot diensten',
  reference:'AI-verordening — artikel 5, verboden sociale scoring; vergelijk bijlage III',
  explanation:'Een score die sociaal gedrag en persoonlijke kenmerken samenvoegt en leidt tot nadelige behandeling in een niet-gerelateerde context, of tot onevenredige en ongerechtvaardigde behandeling, valt onder het verbod op sociale scoring van artikel 5. Een systeem dat toegang tot essentiële uitkeringen of diensten beoordeelt zonder verboden sociale generalisatie, kan daarentegen hoog risico zijn volgens bijlage III. Doel, gebruikte gegevens, context en gevolgen voor rechten zijn doorslaggevend.',
  notMeaning:'Niet elk scoresysteem is verboden. Het regime hangt af van doel, gebruikte gegevens, gebruikscontext, gevolgen voor rechten en effectief menselijk toezicht.',
  democraticFunction:'Toegang tot essentiële diensten mag niet afhangen van een berekende sociale reputatie waartegen geen bezwaar mogelijk is.',
  tags:['verbod','scoring','sociale voorzieningen','diensten']
 },
 norm_chatbot:{
  title:'Automatische assistenten en transparantie voor burgers',
  reference:'AI-verordening — artikel 50, transparantieverplichtingen; verplichtingen van de gebruiksverantwoordelijke',
  explanation:'Wie met een AI-systeem communiceert, moet weten dat het een machine is (artikel 50). Voor een publieke assistent is transparantie een minimum: ook juiste informatie, effectief menselijk toezicht, contact met een mens en traceerbaarheid zijn belangrijk. De gebruiksverantwoordelijke blijft verantwoordelijk voor het gebruik; die verantwoordelijkheid verdwijnt niet bij de leverancier.',
  notMeaning:'Niet elke publieke chatbot is verboden. De inzet moet transparant zijn, onder toezicht staan en een menselijk contactkanaal bieden, vooral wanneer rechten of kansen worden geraakt.',
  democraticFunction:'Burgers moeten weten wanneer overheidsinformatie van een machine komt en een mens kunnen spreken.',
  tags:['transparantie','chatbot','overheidsdiensten','gebruiksverantwoordelijke']
 },
 norm_procurement:{
  title:'Publieke inkoop van AI-systemen',
  reference:'AI-verordening — verplichtingen voor hoog risico, governance en documentatie',
  explanation:'Wanneer een overheidsinstantie AI koopt die relevante beslissingen beïnvloedt, vervangt een certificaat de hoogrisicoverplichtingen niet. Technische documentatie, vooraf bepaalde controlecriteria, toegangs- en auditrechten, menselijk toezicht en duidelijke contractuele verantwoordelijkheden blijven nodig. De instantie die het systeem gebruikt, blijft daarvoor verantwoording verschuldigd.',
  notMeaning:'AI inkopen is niet onrechtmatig. Documentatie, governance en controleerbare verantwoordelijkheden zijn nodig vóór en na de aankoop.',
  democraticFunction:'Overheidsuitgaven aan AI moeten uitlegbaar en controleerbaar blijven. Een instantie moet inzicht hebben in het systeem dat zij gebruikt.',
  tags:['hoog risico','inkoop','governance','documentatie']
 },
 norm_edtech:{
  title:'Leerplatforms en beslissingen met gevolgen',
  reference:'AI-verordening — bijlage III, onderwijs en beroepsopleiding',
  explanation:'AI-systemen die in het onderwijs worden gebruikt om te beoordelen, te begeleiden of te beslissen over toegang tot leertrajecten en kansen, hebben een hoog risico. Zij vereisen effectief menselijk toezicht, gegevenskwaliteit en gegevensminimalisatie, uitleg aan docenten, leerlingen en gezinnen en een mogelijkheid tot bezwaar. Een leerhulpmiddel mag geen automatisch oordeel worden.',
  notMeaning:'Niet elk leerplatform is verboden. Het regime hangt af van de gevolgen voor onderwijskansen en van effectief menselijk toezicht.',
  democraticFunction:'Onderwijskansen mogen niet afhangen van een ondoorzichtige score die docenten volgen en waartegen gezinnen geen bezwaar kunnen maken.',
  tags:['hoog risico','onderwijs','menselijk toezicht','uitlegbaarheid']
 },
 norm_gpai:{
  title:'AI-modellen voor algemene doeleinden en toepassing ervan',
  reference:'AI-verordening — bepalingen over AI voor algemene doeleinden (GPAI) en verplichtingen van de gebruiksverantwoordelijke',
  explanation:'Een generatief model voor algemene doeleinden is op zichzelf niet verboden en niet automatisch hoog risico. Het concrete gebruik bepaalt het risico. Bij relevante beslissingen zijn effectieve menselijke controle, traceerbaarheid, een gebruiksbeleid met duidelijke grenzen, controle op ingevoerde gegevens en transparantie voor gebruikers nodig. De verplichtingen van de aanbieder van het model komen naast de verantwoordelijkheid van de gebruiksverantwoordelijke voor de toepassing.',
  notMeaning:'Het gebruik van een algemeen model is niet verboden en is evenmin altijd hoog risico. Doorslaggevend zijn hoe en waar het model wordt gebruikt en welke waarborgen er zijn.',
  democraticFunction:'Een model dat beslissingen voorbereidt, moet controleerbaar blijven. Een besluit mag niet steunen op ongecontroleerde uitvoer.',
  tags:['GPAI','generatief model','toepassing','gebruiksverantwoordelijke']
 }
});
export const DUTCH_JOURNAL={
 button:'Sessieregistratie',title:'Wil je deze sessie delen?',
 purpose:'Help het spel te verbeteren door het verloop van dit tabblad te delen: dossiers, keuzes, geopende en geciteerde bewijsstukken, vergelijkingen, herzieningen, hulp, feedback, taal en geschatte actieve tijd. De registratie begint alleen met jouw toestemming en kan na herladen van hetzelfde tabblad gedurende 24 uur worden hervat.',
 scope:'Matteo Angeloni is de verwerkingsverantwoordelijke. Cloudflare verwerkt gegevens voor de dienstverlening; de database bevindt zich in de EU. Er wordt een willekeurige sessiecode gebruikt, zonder naam, e-mailadres, door het spel vastgelegd IP-adres of identificatie tussen bezoeken. De gegevens zijn gepseudonimiseerd, niet gegarandeerd anoniem. Bewaartermijn: 90 dagen. De geaggregeerde basisstatistieken blijven gescheiden.',
 rights:'Deelname is vrijwillig en verandert het spel niet. Je kunt weigeren, toestemming intrekken, de registratie wissen, je gegevens exporteren of een privébewijs bewaren om na het sluiten van het tabblad toegang te houden. Offline of onderbroken verzendingen kunnen ontbreken. Een sessieregistratie bewijst op zichzelf geen leren of kritisch denken.',
 adult:'Ik bevestig dat ik minstens 18 jaar ben en geef toestemming voor de sessieregistratie.',
 writing:'Ik geef daarnaast toestemming voor het delen van teksten die ik in het begeleide traject opsla: hypothesen, bronnen, redenen en reflecties. Dit is vrijwillig; vermijd persoonsgegevens en gevoelige informatie. Teksten worden op de server versleuteld.',
 accept:'Toestemmen en inschakelen',decline:'Verder zonder registratie',close:'Terug naar het spel',erase:'Toestemming intrekken en wissen',export:'Mijn gegevens downloaden',receipt:'Privébewijs opslaan',recover:'Privébewijs openen',policy:'Privacyverklaring en contact',
 pending:'Gebeurtenissen wachten op bevestiging van de server',failure:'De handeling is niet bevestigd. Probeer opnieuw zodra je online bent.',privateWarning:'Het privébewijs bevat een toegangssleutel voor jouw gegevens. Bewaar het vertrouwelijk. Zonder dit bewijs kunnen we jouw registratie na het sluiten van dit tabblad mogelijk niet terugvinden.',
 status:{off:'Registratie is hier niet beschikbaar',ready:'Registratie staat uit',recording:'Registratie is actief',pending:'Registratie actief: verzending in behandeling',retry:'Verzending niet bevestigd: nieuwe poging gepland',revoking:'Registratie gestopt; wissen op de server is in behandeling',deleted:'Registratie gewist op de server',expired:'Registratie beëindigd; exporteren en wissen blijven mogelijk',limit:'Limiet bereikt; registratie is onvolledig',blocked:'Registratie geblokkeerd door het privacysignaal van de browser'}
};
export const DUTCH_CASE_DECISIONS={
 case_predpol:{
  noteCorrect:'Het voorspellen van iemands risico op crimineel gedrag uitsluitend op basis van profilering is verboden. Stopzetting is daarom de enige passende maatregel.',
  notePartial:'Je zag het probleem, maar een verboden praktijk behandelen als een kwestie van beheer laat de wijk onder surveillance die geen audit kan rechtvaardigen.',
  motivations:['Het systeem is onnauwkeurig en moet worden opgeschort totdat de leverancier voldoende nauwkeurigheid in de praktijk aantoont.','Het voorspellen van iemands risico op een strafbaar feit uitsluitend op basis van profilering is verboden. Nauwkeurigheid maakt niet rechtmatig wat de verordening verbiedt.','De politie mag elk ondersteunend instrument gebruiken: de uiteindelijke beslissing blijft bij een menselijke agent.']
 },
 case_bias:{
  noteCorrect:'De zes voorwaarden van artikel 4 bis gelden cumulatief. Als er twee ontbreken, heeft de verwerking geen rechtsgrond. Het systeem is hoog risico en blijft werken; de manier waarop de bias werd gecorrigeerd moet aan de voorwaarden voldoen.',
  notePartial:'Je vond het juiste gebied, maar niet het doorslaggevende punt. Zolang bijzondere persoonsgegevens naar een derde partij gaan en de noodzaak niet is vastgelegd, helpt het aanvullen van de administratie niet.',
  motivations:['Artikel 4 bis staat verwerking van bijzondere persoonsgegevens toe om bias op te sporen, maar onder zes cumulatieve voorwaarden. Doorgifte aan een derde partij en ontbrekende vastlegging van de noodzaak schenden er twee. De verwerking is onrechtmatig, ook als de correctie werkte.','De aanbieder verwerkte gegevens over etnische afkomst en gezondheid van sollicitanten. Het systeem moet worden geblokkeerd totdat uitsluitend methoden zonder gevoelige gegevens worden gebruikt.','De bias is gecorrigeerd en de kloof is verdwenen. Dat resultaat toont aan dat de verwerking evenredig was; het aanvullen van het register volstaat.']
 },
 case_frodi:{
  noteCorrect:'Een systeem dat beslist over toegang tot essentiële uitkeringen heeft een hoog risico. Het mag alleen werken met effectief menselijk toezicht VÓÓR de gevolgen, aangevuld met audit en traceerbaarheid.',
  notePartial:'Je vond het juiste gebied, maar het doorslaggevende probleem bleef bestaan: automatische opschorting vóór enige menselijke controle. Daardoor blijft het systeem schade veroorzaken.',
  motivations:['Het systeem maakt te veel fouten en moet worden opgeschort totdat de nauwkeurigheid verbetert.','Beslissen over essentiële uitkeringen is hoog risico. Effectief menselijk toezicht is nodig vóór de gevolgen, met audit en traceerbaarheid; alleen controle na bezwaar volstaat niet.','De dienst moet fraude kunnen bestrijden. Wie niets te verbergen heeft, hoeft niet bang te zijn voor een extra controle.']
 },
 case_scoring:{
  noteCorrect:'Inspectienotitie: dit systeem kan niet met een aanpassing worden rechtgezet. Het benadeelt mensen in niet-gerelateerde contexten en zonder rechtvaardiging. Het moet worden uitgeschakeld.',
  notePartial:'Inspectienotitie: audits en toezicht zijn onvoldoende. Algemene sociale scoring blijft onverenigbaar met waardigheid en gelijkheid. Het systeem had moeten worden stopgezet.',
  motivations:['Het systeem is ondoorzichtig: burgers krijgen geen begrijpelijke uitleg.','De score veroorzaakt nadelige behandeling in een context die losstaat van de verzameling van de gegevens. Dit is verboden sociale scoring, artikel 5.','Het systeem verzamelt te veel gegevens. Het moet worden afgeslankt en efficiënter worden gemaakt.']
 },
 case_lavoro:{
  noteCorrect:'Inspectienotitie: automatische werving is mogelijk, maar met controleerbare verplichtingen: risicobeheer, gegevenskwaliteit, effectief menselijk toezicht, logboeken en informatie aan sollicitanten.',
  notePartial:'Inspectienotitie: de maatregel past niet bij het probleem. Een hoogrisicosysteem mag niet half beheerd blijven, maar hoeft evenmin eenvoudig te worden uitgezet. Audits, effectief toezicht en gegevenskwaliteit zijn nodig.',
  motivations:['Automatische selectie van sollicitanten is op zichzelf een verboden praktijk.','Sollicitanten krijgen onvoldoende uitleg over de uitkomsten.','Een systeem voor personeelsselectie is hoog risico, bijlage III. Vertekende gegevens en slechts schijnbaar toezicht schenden de verplichtingen.']
 },
 case_media:{
  noteCorrect:'Inspectienotitie: niet het genereren op zichzelf is het probleem, maar dat echt en synthetisch niet meer te onderscheiden zijn. Herkenbare labels voor synthetische inhoud zijn een minimale voorwaarde voor publieke communicatie.',
  notePartial:'Inspectienotitie: zonder zichtbare labels op gegenereerde inhoud blijven burgers ook na andere maatregelen echt en synthetisch door elkaar halen.',
  motivations:['Gegenereerde of gemanipuleerde inhoud wordt zonder aanduiding verspreid. Dat schendt de transparantieverplichtingen van artikel 50.','Het genereren van inhoud door overheidsinstanties is een verboden praktijk.','De communicatie van de gemeente is onbetrouwbaar en moet worden gereorganiseerd.']
 },
 case_scuola:{
  noteCorrect:'Inspectienotitie: het afleiden van emoties in onderwijsinstellingen is verboden, behoudens beperkte uitzonderingen, bijvoorbeeld voor medische of veiligheidsdoeleinden. Die zijn hier niet van toepassing. Het systeem wordt uitgeschakeld.',
  notePartial:'Inspectienotitie: toezicht maakt een verboden praktijk niet rechtmatig. Emotionele surveillance in de klas had moeten worden gestopt.',
  motivations:['Er ontbreken voldoende logboeken en technische documentatie. Die moeten worden toegevoegd.','Emoties afleiden in een onderwijsinstelling is verboden, artikel 5. De uitzonderingen zijn hier niet van toepassing.','Het systeem benadeelt de kwetsbaarste leerlingen en moet opnieuw worden afgesteld.']
 },
 case_ospedale:{
  noteCorrect:'Inspectienotitie: ondersteunde triage kan levens redden, maar vereist risicobeheer, representatieve gegevens, monitoring na ingebruikname en personeel dat de score kan tegenspreken.',
  notePartial:'Inspectienotitie: de maatregel past niet. Blind de score volgen en eenvoudig uitschakelen zijn beide onvoldoende. Zonder audits per subgroep, gegevenskwaliteit en effectief menselijk toezicht wordt triage niet beheersbaar.',
  motivations:['Triage met een hoog risico in de zorg: niet-representatieve gegevens en ineffectief toezicht schenden de toepasselijke verplichtingen.','Het personeel vertrouwt te veel op de score en heeft betere scholing nodig.','AI-ondersteunde triage is een verboden praktijk in de zorg.']
 },
 case_biometria:{
  noteCorrect:'Inspectienotitie: algemeen gebruik in real time voor rechtshandhaving moet stoppen. De uitzonderingen zijn limitatief en vereisen toestemmingen en waarborgen. Andere biometrische toepassingen volgen andere regels, afhankelijk van doel en context.',
  notePartial:'Inspectienotitie: een audit maakt permanente massale identificatie voor politiedoeleinden niet rechtmatig. Dit algemene gebruik had moeten worden gestopt.',
  motivations:['Het systeem geeft te veel fout-positieve resultaten en moet worden gecontroleerd.','De herkenningsnauwkeurigheid moet worden verbeterd om fouten te verminderen.','Biometrische identificatie op afstand in real time, in voor het publiek toegankelijke ruimten en voor rechtshandhaving, is verboden volgens artikel 5, behoudens limitatieve uitzonderingen.']
 },
 case_credito:{
  noteCorrect:'Inspectienotitie: dit is geen kredietwaardigheidsbeoordeling. Het systeem voegt sociaal gedrag samen tot een algemene score die toegang tot essentiële diensten beperkt in niet-gerelateerde contexten. Het valt onder het verbod op sociale scoring en moet stoppen.',
  notePartial:'Inspectienotitie: audits en toezicht beperken schade, maar een algemene sociale score die toegang tot diensten bepaalt, wordt niet rechtmatig door een procedure. Het systeem had moeten stoppen.',
  motivations:['Dit is een normaal instrument voor bestuurlijke efficiëntie: het optimaliseert wachtrijen en prioriteiten.','De score combineert sociaal gedrag en niet-relevante gegevens om toegang tot essentiële diensten te beperken in niet-gerelateerde contexten. Dit valt onder verboden sociale scoring.','Burgers krijgen onvoldoende uitleg over de score.']
 },
 case_chatbot:{
  noteCorrect:'Inspectienotitie: het loket hoeft niet te worden verboden, maar moet transparant en beheerst functioneren. Burgers moeten weten dat zij met een machine praten, juiste informatie krijgen en een mens kunnen bereiken. Nodig zijn een duidelijke melding, een menselijk contactkanaal, controle van antwoorden en privacybewuste logboeken.',
  notePartial:'Inspectienotitie: de richting klopt, maar de maatregel is half uitgevoerd. Zonder transparantie en een effectief menselijk contactkanaal blijft de assistent een onzekere bron waarop burgers vertrouwen.',
  motivations:['Het is een eenvoudige informatiedienst. Als die zich vergist, is de burger die erop vertrouwde verantwoordelijk.','De automatische assistent wekt vertrouwen. Nodig zijn transparantie over de machine, juiste informatie, menselijk contact en traceerbaarheid. De instantie blijft verantwoordelijk voor het gebruik.','Dit is uitsluitend een technisch probleem. De leverancier hoeft alleen het model bij te werken.']
 },
 case_procurement:{
  noteCorrect:'Inspectienotitie: «de leverancier is gecertificeerd» volstaat niet. Een systeem dat overheidsbesluiten beïnvloedt heeft een hoog risico. Nodig zijn technische documentatie, vooraf bepaalde controlecriteria, toegangs- en auditrechten, menselijk toezicht en duidelijke contractuele verantwoordelijkheden. Een instantie kan geen systeem inkopen dat zij niet kan uitleggen of controleren.',
  notePartial:'Inspectienotitie: het probleem is slechts half begrepen. Zonder documentatie en toegangs- en auditrechten blijft governance op papier staan en heeft de instantie geen werkelijke controle.',
  motivations:['Ondoorzichtige inkoop van een hoogrisicosysteem: documentatie, controlecriteria, toegangs- en auditrechten en verantwoordelijkheden ontbreken. De instantie die het systeem gebruikt, blijft verantwoording verschuldigd.','De aanbesteding is in orde. Als het product gecertificeerd is, hoeft de instantie niets meer te vragen.','Het is een transparantieprobleem voor burgers. Publicatie van de aanbestedingsstukken volstaat.']
 },
 case_edtech:{
  noteCorrect:'Inspectienotitie: niet elk leerplatform is verboden. Dit platform beïnvloedt echter onderwijskansen en leertrajecten en heeft daarom een hoog risico. Nodig zijn effectief menselijk toezicht dat van de score kan afwijken, gegevensminimalisatie, uitleg aan docenten en gezinnen en een mogelijkheid tot bezwaar.',
  notePartial:'Inspectienotitie: de classificatie klopt, de maatregel niet. Zonder menselijke controle die werkelijk van de score kan afwijken, en zonder uitleg, stuurt het platform de beslissingen in plaats van de docenten.',
  motivations:['Het is slechts een neutraal leerhulpmiddel. Een risico signaleren helpt docenten alleen maar.','Het probleem is communicatie. Een betere uitleg aan gezinnen over de werking volstaat.','Het platform beïnvloedt onderwijskansen. Het heeft een hoog risico en vereist effectief menselijk toezicht, gegevensminimalisatie, uitleg en bezwaar. De school die het gebruikt, blijft verantwoordelijk.']
 },
 case_gpai:{
  noteCorrect:'Inspectienotitie: een algemeen model is niet op zichzelf verboden en niet automatisch hoog risico. Het concrete gebruik bepaalt het risico. Hier beïnvloedt het relevante beslissingen zonder controle. Nodig zijn effectieve menselijke beoordeling, traceerbaarheid, een gebruiksbeleid met duidelijke grenzen, controle van ingevoerde gegevens en informatie aan gebruikers. De organisatie die het inzet, blijft verantwoordelijk.',
  notePartial:'Inspectienotitie: het risico is slechts half begrepen. Zonder effectieve controle van uitvoer en beheer van prompts blijft het model beslissingen beïnvloeden die niemand controleert.',
  motivations:['Een algemeen model is slechts een hulpmiddel. Voor intern gebruik zijn geen bijzondere regels nodig.','Het algemene model is niet verboden en niet automatisch hoog risico. Hier beïnvloedt het relevante beslissingen zonder controle. Nodig is gebruiksgovernance: effectieve menselijke beoordeling, traceerbaarheid, grenzen en toegestane gegevens. De gebruiksverantwoordelijke blijft verantwoordelijk.','Een disclaimer dat antwoorden moeten worden gecontroleerd, is voldoende.']
 }
};
