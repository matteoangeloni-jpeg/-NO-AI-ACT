import type { LanguageCode } from '../data/types';

export const INQUIRY_CASE_IDS = [
  'case_scoring', 'case_lavoro', 'case_media', 'case_scuola', 'case_ospedale', 'case_biometria', 'case_credito',
  'case_chatbot', 'case_procurement', 'case_edtech', 'case_gpai', 'case_predpol', 'case_frodi', 'case_bias'
] as const;
export type InquiryCaseId = typeof INQUIRY_CASE_IDS[number];

export interface CaseInquiryScaffold {
  opening: string;
  source: string;
  relation: string;
  uncertainty: string;
  debrief: string;
}

/** Questions support the investigation without naming the reference answer or decisive exhibit. */
export const INQUIRY_CASES: Record<LanguageCode, Record<InquiryCaseId, CaseInquiryScaffold>> = {
  it: {
    case_scoring: {
      opening: 'La collega posa sul tavolo due richieste di alloggio. «Prima di giudicare il punteggio, ricostruiamo quale decisione cambia per queste persone e quali dati vengono usati.»',
      source: 'Chi descrive il funzionamento del punteggio? Chi ne documenta gli effetti? Indica che cosa ciascuna fonte può sapere direttamente.',
      relation: 'Collega due reperti. I dati e gli effetti riguardano lo stesso contesto? Spiega quale affermazione viene sostenuta o messa in dubbio.',
      uncertainty: 'Quale informazione chiederesti per capire perché una persona ha subito una conseguenza sfavorevole?',
      debrief: 'Distingui la domanda su come funziona il punteggio dalla domanda su come è stata spiegata la decisione. Quale ha fondato il tuo rapporto?'
    },
    case_lavoro: {
      opening: 'Una candidata chiede chi abbia esaminato la sua domanda. La collega ti invita a ricostruire il percorso dal curriculum alla decisione, prima di attribuire responsabilità.',
      source: 'Distingui ciò che dichiara chi vende il sistema da ciò che può osservare chi seleziona le persone o riceve un rifiuto.',
      relation: 'Confronta due fonti sul passaggio fra raccomandazione automatica e decisione umana. Che cosa mostrano e che cosa lasciano aperto?',
      uncertainty: 'Quale documento permetterebbe di capire se il revisore può cambiare davvero la decisione?',
      debrief: 'Confronta il controllo umano che avevi immaginato con quello descritto nei reperti. Come cambia la misura che proporresti?'
    },
    case_media: {
      opening: 'In redazione circola un contenuto di cui si discute l’origine. «Prima di chiedere un’etichetta», osserva la collega, «capisci che cosa vede il pubblico e chi ha prodotto il materiale».',
      source: 'Chi può attestare la provenienza del contenuto? Distingui osservazione tecnica, dichiarazione editoriale e impressione del pubblico.',
      relation: 'Collega il contenuto a una fonte sulla sua produzione o presentazione. La relazione chiarisce autenticità, provenienza o comprensione del pubblico?',
      uncertainty: 'Quale informazione sull’uso concreto o sul destinatario potrebbe modificare il tuo giudizio?',
      debrief: 'Spiega come distingui marcatura tecnica, informazione al pubblico e attendibilità del contenuto.'
    },
    case_scuola: {
      opening: 'Un’insegnante chiede che cosa il sistema affermi di sapere degli studenti. La collega propone di distinguere il dato raccolto dall’interpretazione attribuita alle persone.',
      source: 'Da quali dati parte ogni affermazione? Chi li ha raccolti e chi ha interpretato il comportamento degli studenti?',
      relation: 'Due documenti descrivono lo stesso uso del sistema? Metti in relazione finalità dichiarata, inferenza e conseguenza educativa.',
      uncertainty: 'Quale dettaglio sulla finalità o sul contesto sarebbe necessario per valutare un’interpretazione alternativa?',
      debrief: 'Quale differenza fra osservare un comportamento e inferire uno stato personale è diventata rilevante nel tuo ragionamento?'
    },
    case_ospedale: {
      opening: 'Un sanitario deve decidere come usare una raccomandazione. «Ricostruiamo il margine di intervento della persona», propone la collega, «e quali conseguenze può avere un errore».',
      source: 'Distingui la descrizione del prodotto dai documenti sul suo impiego clinico. Quale fonte può mostrare che cosa accade nella pratica?',
      relation: 'Collega una promessa sul sistema a un riscontro sul flusso di lavoro. Le due fonti parlano dello stesso compito e delle stesse condizioni?',
      uncertainty: 'Quale informazione sulla destinazione d’uso o sul riesame clinico ti manca?',
      debrief: 'Rileggi la tua proposta alla luce del ruolo clinico effettivo del sistema. Come motivi controllo e responsabilità?'
    },
    case_biometria: {
      opening: 'Un operatore indica una corrispondenza trovata dal sistema. La collega chiede di ricostruire che cosa viene confrontato, dove avviene e per quale obiettivo.',
      source: 'Quali fonti descrivono la tecnologia e quali documentano chi la usa? Un’affermazione generale chiarisce anche le condizioni di impiego?',
      relation: 'Confronta due fonti su luogo, tempo e finalità. Quale fatto permette di distinguere due possibili letture?',
      uncertainty: 'Quale autorizzazione, condizione concreta o informazione sulle persone coinvolte vorresti verificare?',
      debrief: 'Quali condizioni specifiche hanno sostenuto il tuo giudizio, oltre alla sola presenza di dati biometrici?'
    },
    case_credito: {
      opening: 'Una richiesta economica viene valutata attraverso un indice. «Seguiamo i dati fino alla loro origine», suggerisce la collega, «e chiediamoci come sono collegati alla decisione».',
      source: 'Quale fonte documenta i dati effettivamente utilizzati? Distingui lo scopo dell’indice dalla spiegazione fornita alla persona.',
      relation: 'Collega origine dei dati e conseguenza individuale. Perché quel collegamento sostiene o indebolisce una delle tue ipotesi?',
      uncertainty: 'Che cosa dovresti sapere sul contesto in cui i dati erano stati raccolti e sul motivo della penalizzazione?',
      debrief: 'Spiega perché il nome del settore o del prodotto non basta a motivare la classificazione che hai scelto.'
    },
    case_chatbot: {
      opening: 'Una persona racconta una conversazione con uno sportello digitale. La collega ti invita a ricostruire che cosa l’utente poteva capire mentre interagiva.',
      source: 'Quale documento mostra l’esperienza dell’utente? Quale descrive intenzioni o regole del servizio?',
      relation: 'Confronta messaggi mostrati e dichiarazioni sul servizio. Sono comprensibili nella stessa fase dell’interazione?',
      uncertainty: 'Quale dettaglio dell’interfaccia o del momento in cui si informa l’utente vorresti vedere direttamente?',
      debrief: 'Quale differenza c’è fra conoscere la tecnologia usata e renderla riconoscibile alla persona che interagisce?'
    },
    case_procurement: {
      opening: 'Un ufficio ha acquistato un sistema da un fornitore esterno. «Seguiamo chi decide e chi conserva i documenti», propone la collega, prima di cercare un unico responsabile.',
      source: 'Chi ha scritto ciascun documento? Che cosa dimostra un contratto e che cosa richiede un riscontro sull’uso effettivo?',
      relation: 'Collega un impegno contrattuale a una procedura operativa. Chi dispone delle informazioni per verificare che siano coerenti?',
      uncertainty: 'Quale documento o chiarimento sulla destinazione d’uso e sulla catena degli attori ti manca?',
      debrief: 'Come distingui le responsabilità dei diversi attori senza far dipendere tutto dal fatto che il sistema sia stato acquistato?'
    },
    case_edtech: {
      opening: 'Uno studente riceve una valutazione collegata a un sistema digitale. La collega chiede di distinguere l’aiuto allo studio dalla decisione che incide sul percorso della persona.',
      source: 'Distingui la presentazione della piattaforma dai documenti su valutazioni, accessi e possibilità di contestazione.',
      relation: 'Collega un’attività del sistema a una conseguenza educativa. Due fonti descrivono lo stesso ruolo oppure ruoli diversi?',
      uncertainty: 'Quale informazione sull’effetto della raccomandazione e sul riesame umano vorresti acquisire?',
      debrief: 'Quale elemento del caso distingue un supporto facoltativo da un impiego che influenza una decisione educativa?'
    },
    case_gpai: {
      opening: 'Un gruppo integra un modello generale in un servizio. «Distinguiamo ciò che può fare il modello da ciò che il servizio gli fa fare», suggerisce la collega.',
      source: 'Quali fonti descrivono il modello e quali l’applicazione concreta? Chi può documentare le scelte di integrazione?',
      relation: 'Collega una capacità generale a un uso specifico. Quali passaggi intermedi devi dimostrare prima di attribuire un rischio o una responsabilità?',
      uncertainty: 'Quale informazione sull’integrazione, sulla finalità e sugli attori ti manca per concludere?',
      debrief: 'Come cambia il ragionamento quando distingui modello, sistema e contesto di utilizzo?'
    },
    case_predpol: {
      opening: 'Una segnalazione viene associata a un profilo individuale. La collega chiede quali fatti verificabili sostengano il sospetto e quali siano semplici associazioni.',
      source: 'Distingui osservazioni su eventi concreti, inferenze statistiche e descrizioni di caratteristiche personali.',
      relation: 'Collega due fonti per capire se una conclusione poggia su fatti individuali o su una correlazione. Spiega il passaggio.',
      uncertainty: 'Quale elemento fattuale potrebbe confermare o smentire l’ipotesi senza ripetere il profilo?',
      debrief: 'Quale differenza fra previsione e riscontro fattuale hai usato per motivare il rapporto?'
    },
    case_frodi: {
      opening: 'Una pratica di sostegno viene segnalata per un controllo. «Ricostruiamo che cosa accade alla persona dopo la segnalazione», propone la collega.',
      source: 'Quale fonte documenta la decisione sulla prestazione? Quale descrive soltanto una previsione di irregolarità?',
      relation: 'Collega il risultato automatico al riesame e all’effetto sulla persona. Dove la procedura potrebbe correggere un errore?',
      uncertainty: 'Quale informazione sul controllo e sulle possibilità di contestazione richiederesti?',
      debrief: 'Come distingui un segnale da verificare dalla decisione che modifica l’accesso a un sostegno?'
    },
    case_bias: {
      opening: 'Un gruppo vuole verificare se un sistema tratta diversamente alcune persone. La collega propone di chiedere quali dati servano davvero e come verranno protetti.',
      source: 'Distingui la necessità dichiarata dell’analisi dalla documentazione sulle alternative e sulle salvaguardie effettive.',
      relation: 'Collega una finalità di controllo a una misura concreta sui dati. La relazione documenta una condizione o soltanto un’intenzione?',
      uncertainty: 'Quale informazione su accesso, riuso, alternative e cancellazione manca alla tua valutazione?',
      debrief: 'Come motivi insieme la verifica delle discriminazioni e la protezione dei dati delle persone?'
    }
  },
  en: {
    case_scoring: {
      opening: 'Your colleague places two housing applications on the desk. “Before judging the score, establish which decision changes for these people and which data are used.”',
      source: 'Who describes how the score works? Who documents its effects? Explain what each source can know directly.',
      relation: 'Connect two exhibits. Do the data and effects concern the same context? Explain which claim is supported or challenged.',
      uncertainty: 'What information would help explain why a person received unfavourable treatment?',
      debrief: 'Distinguish how the score works from how the decision was explained. Which question grounded your report?'
    },
    case_lavoro: {
      opening: 'An applicant asks who examined her application. Your colleague suggests tracing the path from the CV to the decision before assigning responsibility.',
      source: 'Distinguish the seller’s claims from what recruiters or rejected applicants can observe.',
      relation: 'Compare two sources on the transition from automated recommendation to human decision. What do they show and leave open?',
      uncertainty: 'Which document would show whether the reviewer can actually change the decision?',
      debrief: 'Compare the human review you imagined with the review described in the exhibits. How does that affect your proposed measure?'
    },
    case_media: {
      opening: 'A newsroom questions the origin of a piece of content. “Before asking for a label, establish what the audience sees and who produced it,” your colleague suggests.',
      source: 'Who can establish the content’s origin? Distinguish technical observations, editorial claims and audience impressions.',
      relation: 'Connect the content to a source about its production or presentation. Does the relation clarify authenticity, provenance or audience understanding?',
      uncertainty: 'Which detail about the actual use or intended audience could change your judgment?',
      debrief: 'Explain how you distinguish technical marking, information for the public and content reliability.'
    },
    case_scuola: {
      opening: 'A teacher asks what the system claims to know about students. Your colleague suggests distinguishing collected data from interpretations attributed to people.',
      source: 'Which data support each claim? Who collected them and who interpreted the students’ behaviour?',
      relation: 'Do two documents describe the same use? Connect the stated purpose, the inference and the educational consequence.',
      uncertainty: 'Which detail about purpose or context would help assess an alternative interpretation?',
      debrief: 'How did the difference between observing behaviour and inferring a personal state affect your reasoning?'
    },
    case_ospedale: {
      opening: 'A clinician must decide how to use a recommendation. Your colleague suggests establishing the person’s room for intervention and the possible consequences of an error.',
      source: 'Distinguish the product description from records of its clinical use. Which source can show what happens in practice?',
      relation: 'Connect a promise about the system to an observation of the workflow. Do they concern the same task and conditions?',
      uncertainty: 'Which information about intended use or clinical review is missing?',
      debrief: 'Reconsider your proposal in light of the system’s actual clinical role. How do you justify oversight and responsibility?'
    },
    case_biometria: {
      opening: 'An operator points to a match found by a system. Your colleague asks what is compared, where it happens and for which objective.',
      source: 'Which sources describe the technology and which document its users? Does a general claim also explain the conditions of use?',
      relation: 'Compare two sources on place, timing and purpose. Which fact distinguishes two possible interpretations?',
      uncertainty: 'Which authorisation, condition or information about affected people would you want to verify?',
      debrief: 'Which specific conditions supported your judgment beyond the mere presence of biometric data?'
    },
    case_credito: {
      opening: 'A financial application is assessed through an index. “Trace the data to their origin and ask how they relate to the decision,” your colleague suggests.',
      source: 'Which source documents the data actually used? Distinguish the index’s purpose from the explanation given to the person.',
      relation: 'Connect the origin of the data to an individual consequence. Why does this relation support or weaken a hypothesis?',
      uncertainty: 'What would you need to know about the original collection context and the reason for a penalty?',
      debrief: 'Explain why the sector or product name alone cannot justify your classification.'
    },
    case_chatbot: {
      opening: 'A person describes a conversation with a digital service desk. Your colleague asks what the user could understand during the interaction.',
      source: 'Which document shows the user’s experience? Which describes the service’s intentions or rules?',
      relation: 'Compare displayed messages with claims about the service. Are they understandable at the same stage of interaction?',
      uncertainty: 'Which interface detail or moment of disclosure would you want to observe directly?',
      debrief: 'What is the difference between knowing the technology used and making it recognisable to the interacting person?'
    },
    case_procurement: {
      opening: 'An office bought a system from an external supplier. Your colleague suggests tracing who decides and who holds the records before seeking a single responsible actor.',
      source: 'Who wrote each document? What does a contract establish, and what requires evidence of actual use?',
      relation: 'Connect a contractual promise to an operational procedure. Who has the information needed to check consistency?',
      uncertainty: 'Which document or clarification about intended use and the chain of actors is missing?',
      debrief: 'How do you distinguish the actors’ responsibilities beyond the fact that the system was purchased?'
    },
    case_edtech: {
      opening: 'A student receives an assessment linked to a digital system. Your colleague suggests distinguishing learning support from a decision affecting the person’s educational path.',
      source: 'Distinguish the platform’s presentation from documents on assessment, access and opportunities to challenge decisions.',
      relation: 'Connect a system activity to an educational consequence. Do two sources describe the same role or different roles?',
      uncertainty: 'Which information about the recommendation’s effect and human review would you seek?',
      debrief: 'Which fact distinguishes optional support from a use that influences an educational decision?'
    },
    case_gpai: {
      opening: 'A team integrates a general-purpose model into a service. “Distinguish what the model can do from what the service asks it to do,” your colleague suggests.',
      source: 'Which sources describe the model and which describe the application? Who can document integration choices?',
      relation: 'Connect a general capability to a particular use. Which intermediate steps need evidence before assigning risk or responsibility?',
      uncertainty: 'Which information about integration, purpose and actors is missing?',
      debrief: 'How does your reasoning change when you distinguish model, system and use context?'
    },
    case_predpol: {
      opening: 'An alert is associated with an individual profile. Your colleague asks which verifiable facts support the suspicion and which are associations.',
      source: 'Distinguish observations of concrete events, statistical inferences and descriptions of personal characteristics.',
      relation: 'Connect two sources to establish whether a conclusion rests on individual facts or a correlation. Explain the link.',
      uncertainty: 'Which factual element could support or challenge the hypothesis without repeating the profile?',
      debrief: 'How did you use the difference between prediction and factual evidence in your report?'
    },
    case_frodi: {
      opening: 'A support application is flagged for review. Your colleague suggests establishing what happens to the person after the alert.',
      source: 'Which source documents the benefit decision? Which describes only a prediction of irregularity?',
      relation: 'Connect the automated result to review and its effect on the person. Where could the procedure correct an error?',
      uncertainty: 'Which information about review and opportunities to challenge the decision would you request?',
      debrief: 'How do you distinguish a signal to investigate from a decision changing access to support?'
    },
    case_bias: {
      opening: 'A team wants to check whether a system treats people differently. Your colleague asks which data are actually needed and how they will be protected.',
      source: 'Distinguish the claimed need for analysis from documentation of alternatives and effective safeguards.',
      relation: 'Connect an audit purpose to a concrete data safeguard. Does the relation document a condition or only an intention?',
      uncertainty: 'Which information on access, reuse, alternatives and deletion is missing?',
      debrief: 'How do you jointly justify checking discrimination and protecting people’s data?'
    }
  },
  fr: {
    case_scoring: {
      opening: 'La collègue pose deux demandes de logement sur le bureau. « Avant de juger le score, cherchons quelle décision change pour ces personnes et quelles données sont utilisées. »',
      source: 'Qui décrit le fonctionnement du score ? Qui documente ses effets ? Précisez ce que chaque source peut connaître directement.',
      relation: 'Reliez deux pièces. Les données et les effets concernent-ils le même contexte ? Expliquez quelle affirmation est soutenue ou contestée.',
      uncertainty: 'Quelle information permettrait de comprendre pourquoi une personne a subi un traitement défavorable ?',
      debrief: 'Distinguez le fonctionnement du score de l’explication de la décision. Quelle question a fondé votre rapport ?'
    },
    case_lavoro: {
      opening: 'Une candidate demande qui a examiné sa candidature. La collègue propose de suivre le parcours du CV à la décision avant d’attribuer les responsabilités.',
      source: 'Distinguez les déclarations du vendeur de ce que peuvent observer les recruteurs ou les personnes refusées.',
      relation: 'Comparez deux sources sur le passage de la recommandation automatique à la décision humaine. Que montrent-elles et que laissent-elles ouvert ?',
      uncertainty: 'Quel document montrerait si le réviseur peut réellement modifier la décision ?',
      debrief: 'Comparez le contrôle humain imaginé à celui décrit dans les pièces. Comment cela affecte-t-il la mesure proposée ?'
    },
    case_media: {
      opening: 'Une rédaction s’interroge sur l’origine d’un contenu. « Avant de demander une étiquette, cherchons ce que voit le public et qui a produit le matériel », propose la collègue.',
      source: 'Qui peut établir l’origine du contenu ? Distinguez observation technique, déclaration éditoriale et impression du public.',
      relation: 'Reliez le contenu à une source sur sa production ou sa présentation. La relation précise-t-elle authenticité, provenance ou compréhension du public ?',
      uncertainty: 'Quel détail sur l’usage concret ou le destinataire pourrait modifier votre jugement ?',
      debrief: 'Expliquez comment vous distinguez marquage technique, information du public et fiabilité du contenu.'
    },
    case_scuola: {
      opening: 'Une enseignante demande ce que le système prétend savoir des élèves. La collègue propose de distinguer les données recueillies des interprétations attribuées aux personnes.',
      source: 'Quelles données fondent chaque affirmation ? Qui les a recueillies et qui a interprété le comportement des élèves ?',
      relation: 'Deux documents décrivent-ils le même usage ? Reliez finalité déclarée, inférence et conséquence éducative.',
      uncertainty: 'Quel détail sur la finalité ou le contexte permettrait d’évaluer une autre interprétation ?',
      debrief: 'Quelle différence entre observer un comportement et inférer un état personnel a compté dans votre raisonnement ?'
    },
    case_ospedale: {
      opening: 'Un soignant doit décider comment utiliser une recommandation. La collègue propose de préciser la marge d’intervention humaine et les conséquences possibles d’une erreur.',
      source: 'Distinguez la description du produit des documents sur son usage clinique. Quelle source montre ce qui se passe en pratique ?',
      relation: 'Reliez une promesse sur le système à une observation du travail. Concernent-elles la même tâche et les mêmes conditions ?',
      uncertainty: 'Quelle information manque sur la destination ou le réexamen clinique ?',
      debrief: 'Relisez votre proposition à la lumière du rôle clinique réel du système. Comment justifiez-vous contrôle et responsabilité ?'
    },
    case_biometria: {
      opening: 'Un opérateur montre une correspondance trouvée par le système. La collègue demande ce qui est comparé, où cela se passe et dans quel objectif.',
      source: 'Quelles sources décrivent la technologie et lesquelles documentent ses utilisateurs ? Une affirmation générale précise-t-elle les conditions d’usage ?',
      relation: 'Comparez deux sources sur le lieu, le moment et la finalité. Quel fait permet de distinguer deux interprétations ?',
      uncertainty: 'Quelle autorisation, condition concrète ou information sur les personnes voudriez-vous vérifier ?',
      debrief: 'Quelles conditions précises ont soutenu votre jugement au-delà de la seule présence de données biométriques ?'
    },
    case_credito: {
      opening: 'Une demande financière est évaluée par un indice. « Suivons les données jusqu’à leur origine et leur lien avec la décision », propose la collègue.',
      source: 'Quelle source documente les données réellement utilisées ? Distinguez la finalité de l’indice de l’explication donnée à la personne.',
      relation: 'Reliez l’origine des données à une conséquence individuelle. Pourquoi cette relation soutient-elle ou affaiblit-elle une hypothèse ?',
      uncertainty: 'Que faudrait-il savoir du contexte de collecte initial et du motif de la pénalisation ?',
      debrief: 'Expliquez pourquoi le nom du secteur ou du produit ne suffit pas à justifier votre classification.'
    },
    case_chatbot: {
      opening: 'Une personne raconte une conversation avec un guichet numérique. La collègue vous invite à chercher ce que l’utilisateur pouvait comprendre pendant l’échange.',
      source: 'Quel document montre l’expérience de l’utilisateur ? Lequel décrit les intentions ou les règles du service ?',
      relation: 'Comparez les messages affichés aux déclarations sur le service. Sont-ils compréhensibles au même moment de l’interaction ?',
      uncertainty: 'Quel détail de l’interface ou du moment de l’information voudriez-vous observer directement ?',
      debrief: 'Quelle différence faites-vous entre connaître la technologie et la rendre reconnaissable pour la personne qui interagit ?'
    },
    case_procurement: {
      opening: 'Un service a acheté un système externe. La collègue propose de suivre qui décide et qui conserve les documents avant de chercher un responsable unique.',
      source: 'Qui a rédigé chaque document ? Que démontre un contrat et que faut-il vérifier dans l’usage réel ?',
      relation: 'Reliez un engagement contractuel à une procédure opérationnelle. Qui peut vérifier leur cohérence ?',
      uncertainty: 'Quel document ou éclaircissement sur la destination et la chaîne des acteurs vous manque ?',
      debrief: 'Comment distinguez-vous les responsabilités des acteurs au-delà du fait que le système a été acheté ?'
    },
    case_edtech: {
      opening: 'Un étudiant reçoit une évaluation liée à un système numérique. La collègue propose de distinguer l’aide à l’étude d’une décision qui affecte le parcours de la personne.',
      source: 'Distinguez la présentation de la plateforme des documents sur évaluations, accès et possibilités de contestation.',
      relation: 'Reliez une activité du système à une conséquence éducative. Deux sources décrivent-elles le même rôle ou des rôles différents ?',
      uncertainty: 'Quelle information sur l’effet de la recommandation et sur le réexamen humain voudriez-vous obtenir ?',
      debrief: 'Quel fait distingue un soutien facultatif d’un usage qui influence une décision éducative ?'
    },
    case_gpai: {
      opening: 'Une équipe intègre un modèle général dans un service. « Distinguons ce que peut faire le modèle de ce que le service lui fait faire », propose la collègue.',
      source: 'Quelles sources décrivent le modèle et lesquelles l’application ? Qui peut documenter les choix d’intégration ?',
      relation: 'Reliez une capacité générale à un usage précis. Quelles étapes faut-il démontrer avant d’attribuer risque ou responsabilité ?',
      uncertainty: 'Quelle information manque sur l’intégration, la finalité et les acteurs ?',
      debrief: 'Comment votre raisonnement change-t-il en distinguant modèle, système et contexte d’utilisation ?'
    },
    case_predpol: {
      opening: 'Un signalement est associé à un profil individuel. La collègue demande quels faits vérifiables soutiennent le soupçon et lesquels sont des associations.',
      source: 'Distinguez observations d’événements concrets, inférences statistiques et descriptions de caractéristiques personnelles.',
      relation: 'Reliez deux sources pour déterminer si une conclusion repose sur des faits individuels ou une corrélation. Expliquez ce lien.',
      uncertainty: 'Quel élément factuel pourrait confirmer ou contester l’hypothèse sans répéter le profil ?',
      debrief: 'Comment avez-vous utilisé la différence entre prédiction et constat factuel dans le rapport ?'
    },
    case_frodi: {
      opening: 'Une demande d’aide est signalée pour contrôle. La collègue propose de préciser ce qui arrive à la personne après le signalement.',
      source: 'Quelle source documente la décision sur la prestation ? Laquelle décrit seulement une prévision d’irrégularité ?',
      relation: 'Reliez résultat automatique, réexamen et effet sur la personne. Où la procédure pourrait-elle corriger une erreur ?',
      uncertainty: 'Quelle information sur le contrôle et les possibilités de contestation demanderiez-vous ?',
      debrief: 'Comment distinguez-vous un signal à examiner d’une décision modifiant l’accès à une aide ?'
    },
    case_bias: {
      opening: 'Une équipe veut vérifier si un système traite différemment certaines personnes. La collègue demande quelles données sont nécessaires et comment elles seront protégées.',
      source: 'Distinguez la nécessité déclarée de l’analyse de la documentation sur les alternatives et les garanties effectives.',
      relation: 'Reliez une finalité de contrôle à une mesure concrète sur les données. La relation documente-t-elle une condition ou une intention ?',
      uncertainty: 'Quelle information sur accès, réutilisation, alternatives et suppression manque à votre évaluation ?',
      debrief: 'Comment justifiez-vous à la fois la vérification des discriminations et la protection des données des personnes ?'
    }
  }
};

export function caseInquiry(caseId: string, language: LanguageCode): CaseInquiryScaffold {
  const scaffold = (INQUIRY_CASES[language] as Record<string, CaseInquiryScaffold>)[caseId];
  if (!scaffold) throw new Error('Missing inquiry scaffold: ' + caseId);
  return scaffold;
}
