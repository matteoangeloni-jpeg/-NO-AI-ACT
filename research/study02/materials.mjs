// Original fictional materials. Held outside the public game's dependency graph.
// Parallel drafts, NOT empirically equated instruments or a validated legal key.
export const MATERIALS_VERSION = 'study02-draft-2026-11-21';
export const LANGUAGES = ['it', 'en', 'fr'];
export const RUBRIC_IDS = ['claim', 'provenance', 'reasoning', 'alternative', 'uncertainty', 'revision'];
export const FORMS = {
  A: {
    it: {
      title: 'I laboratori dell’archivio civico',
      scenario: 'Nel 2032 un archivio civico offre laboratori di restauro e lettura dei documenti. I posti sono limitati. Un servizio di IA suggerisce opportunità ai visitatori. La direzione chiede una valutazione documentata del suo impiego. I materiali sono fittizi; applica il quadro normativo fornito senza presumere fatti non documentati.',
      sources: [
        ['A1 · Scheda del fornitore', 'Il servizio propone laboratori usando interessi dichiarati e partecipazioni precedenti. Produce un indice di affinità, senza decidere l’ammissione. Il personale può correggere ogni suggerimento. Il fornitore presenta il sistema come orientamento culturale; la scheda non descrive le impostazioni effettivamente adottate dall’archivio.'],
        ['A2 · Procedura della direzione', 'Per ogni laboratorio sono disponibili dodici posti. Il personale verifica disponibilità e requisiti indicati nell’avviso, poi comunica l’esito. Le raccomandazioni non devono escludere domande. È previsto un riesame su richiesta. Non è allegato l’avviso che definisce natura e requisiti dei laboratori.'],
        ['A3 · Registro operativo di una settimana', 'Le domande sopra la soglia di affinità ricevono un invito. Le altre rimangono inattive finché un addetto non le attiva. Il campo “ragione della mancata attivazione” è vuoto. Non risultano modifiche manuali nella settimana osservata. Il registro non comprende le settimane precedenti né gli esiti dei riesami.'],
        ['A4 · Segnalazione di un visitatore', 'Ho chiesto un laboratorio ancora indicato con posti disponibili. Non ho ricevuto un invito. Allo sportello mi hanno suggerito di scegliere un’altra attività proposta dal servizio. Ho chiesto di riesaminare la domanda; non conosco ancora l’esito. Non so quale dato abbia inciso sul suggerimento.']
      ]
    },
    en: {
      title: 'The civic archive workshops',
      scenario: 'In 2032 a civic archive offers workshops on restoration and reading historical documents. Places are limited. An AI service suggests opportunities to visitors. Management requests an evidence-based assessment of its use. All materials are fictional; apply the supplied legal framework without assuming undocumented facts.',
      sources: [
        ['A1 · Provider specification', 'The service suggests workshops using declared interests and previous attendance. It produces an affinity index without deciding admission. Staff can correct every suggestion. The provider describes the system as cultural guidance; the specification does not describe the settings actually adopted by the archive.'],
        ['A2 · Management procedure', 'Each workshop has twelve places. Staff check availability and the requirements in the notice, then communicate the outcome. Recommendations must not exclude applications. Review is available on request. The notice defining the nature and requirements of the workshops is not attached.'],
        ['A3 · One-week operational log', 'Applications above the affinity threshold receive an invitation. Others remain inactive until a staff member activates them. The “reason for non-activation” field is empty. No manual changes appear in the observed week. The log does not cover earlier weeks or the outcomes of reviews.'],
        ['A4 · Visitor report', 'I applied for a workshop still shown as having places. I received no invitation. At the desk I was advised to choose another activity suggested by the service. I requested a review of my application; I do not yet know the outcome. I do not know which information affected the suggestion.']
      ]
    },
    fr: {
      title: 'Les ateliers des archives municipales',
      scenario: 'En 2032, des archives municipales proposent des ateliers de restauration et de lecture de documents. Les places sont limitées. Un service d’IA suggère des activités aux visiteurs. La direction demande une analyse documentée de son utilisation. Les pièces sont fictives ; appliquez le cadre fourni sans supposer de faits non documentés.',
      sources: [
        ['A1 · Fiche du fournisseur', 'Le service propose des ateliers selon les intérêts déclarés et les participations antérieures. Il produit un indice d’affinité sans décider de l’admission. Le personnel peut corriger chaque suggestion. Le fournisseur présente un outil d’orientation culturelle ; la fiche ne décrit pas les paramètres effectivement adoptés par les archives.'],
        ['A2 · Procédure de la direction', 'Chaque atelier dispose de douze places. Le personnel vérifie les disponibilités et les conditions de l’avis, puis communique le résultat. Les recommandations ne doivent pas exclure de demandes. Un réexamen est possible sur demande. L’avis définissant la nature et les conditions des ateliers n’est pas joint.'],
        ['A3 · Registre opérationnel d’une semaine', 'Les demandes au-dessus du seuil d’affinité reçoivent une invitation. Les autres restent inactives jusqu’à leur activation par un agent. Le champ « raison de la non-activation » est vide. Aucune modification manuelle n’apparaît pendant la semaine observée. Le registre ne couvre ni les semaines antérieures ni les résultats des réexamens.'],
        ['A4 · Signalement d’un visiteur', 'J’ai demandé un atelier affichant encore des places. Je n’ai reçu aucune invitation. À l’accueil, on m’a conseillé une autre activité proposée par le service. J’ai demandé un réexamen ; je n’en connais pas encore le résultat. J’ignore quelle information a influencé la suggestion.']
      ]
    }
  },
  B: {
    it: {
      title: 'Le opportunità della cooperativa artigiana',
      scenario: 'Nel 2032 una cooperativa artigiana offre incontri di apprendimento pratico ai soci. I posti sono limitati. Un servizio di IA suggerisce opportunità ai richiedenti. Il consiglio chiede una valutazione documentata del suo impiego. I materiali sono fittizi; applica il quadro normativo fornito senza presumere fatti non documentati.',
      sources: [
        ['B1 · Scheda del fornitore', 'Il servizio propone incontri usando interessi dichiarati e attività precedenti. Produce un indice di compatibilità, senza assegnare i posti. I responsabili possono correggere ogni suggerimento. Il fornitore presenta il sistema come orientamento associativo; la scheda non descrive le impostazioni effettivamente adottate dalla cooperativa.'],
        ['B2 · Procedura del consiglio', 'Per ogni incontro sono disponibili dodici posti. I responsabili verificano disponibilità e requisiti indicati nel bando, poi comunicano l’esito. Le raccomandazioni non devono escludere richieste. È previsto un riesame su richiesta. Non è allegato il bando che definisce natura e requisiti degli incontri.'],
        ['B3 · Registro operativo di una settimana', 'Le richieste sopra la soglia di compatibilità ricevono una proposta di posto. Le altre rimangono sospese finché un responsabile non le riattiva. Il campo “ragione della sospensione” è vuoto. Non risultano interventi manuali nella settimana osservata. Il registro non comprende le settimane precedenti né gli esiti dei riesami.'],
        ['B4 · Segnalazione di un socio', 'Ho richiesto un incontro ancora indicato con posti disponibili. Non ho ricevuto una proposta. In segreteria mi hanno suggerito di scegliere un’altra opportunità proposta dal servizio. Ho chiesto di riesaminare la richiesta; non conosco ancora l’esito. Non so quale dato abbia inciso sul suggerimento.']
      ]
    },
    en: {
      title: 'The craft cooperative opportunities',
      scenario: 'In 2032 a craft cooperative offers practical learning meetings to members. Places are limited. An AI service suggests opportunities to applicants. The board requests an evidence-based assessment of its use. All materials are fictional; apply the supplied legal framework without assuming undocumented facts.',
      sources: [
        ['B1 · Provider specification', 'The service suggests meetings using declared interests and previous activities. It produces a compatibility index without allocating places. Coordinators can correct every suggestion. The provider describes the system as association guidance; the specification does not describe the settings actually adopted by the cooperative.'],
        ['B2 · Board procedure', 'Each meeting has twelve places. Coordinators check availability and the requirements in the call, then communicate the outcome. Recommendations must not exclude requests. Review is available on request. The call defining the nature and requirements of the meetings is not attached.'],
        ['B3 · One-week operational log', 'Requests above the compatibility threshold receive a place offer. Others remain on hold until a coordinator reactivates them. The “reason for hold” field is empty. No manual interventions appear in the observed week. The log does not cover earlier weeks or the outcomes of reviews.'],
        ['B4 · Member report', 'I requested a meeting still shown as having places. I received no offer. The office advised me to choose another opportunity suggested by the service. I requested a review of my request; I do not yet know the outcome. I do not know which information affected the suggestion.']
      ]
    },
    fr: {
      title: 'Les possibilités de la coopérative artisanale',
      scenario: 'En 2032, une coopérative artisanale propose des rencontres d’apprentissage pratique aux membres. Les places sont limitées. Un service d’IA suggère des possibilités aux demandeurs. Le conseil demande une analyse documentée de son utilisation. Les pièces sont fictives ; appliquez le cadre fourni sans supposer de faits non documentés.',
      sources: [
        ['B1 · Fiche du fournisseur', 'Le service propose des rencontres selon les intérêts déclarés et les activités antérieures. Il produit un indice de compatibilité sans attribuer de places. Les responsables peuvent corriger chaque suggestion. Le fournisseur présente un outil d’orientation associative ; la fiche ne décrit pas les paramètres effectivement adoptés par la coopérative.'],
        ['B2 · Procédure du conseil', 'Chaque rencontre dispose de douze places. Les responsables vérifient les disponibilités et les conditions de l’appel, puis communiquent le résultat. Les recommandations ne doivent pas exclure de demandes. Un réexamen est possible sur demande. L’appel définissant la nature et les conditions des rencontres n’est pas joint.'],
        ['B3 · Registre opérationnel d’une semaine', 'Les demandes au-dessus du seuil de compatibilité reçoivent une proposition de place. Les autres restent suspendues jusqu’à leur réactivation par un responsable. Le champ « raison de la suspension » est vide. Aucune intervention manuelle n’apparaît pendant la semaine observée. Le registre ne couvre ni les semaines antérieures ni les résultats des réexamens.'],
        ['B4 · Signalement d’un membre', 'J’ai demandé une rencontre affichant encore des places. Je n’ai reçu aucune proposition. Le secrétariat m’a conseillé une autre possibilité proposée par le service. J’ai demandé un réexamen ; je n’en connais pas encore le résultat. J’ignore quelle information a influencé la suggestion.']
      ]
    }
  }
};

export const COPY = {
  it: {
    title: 'NO AI ACT · Laboratorio Study 02',
    notice: 'Prototipo locale per prove con materiali fittizi. Per sessioni con partecipanti servono protocollo, informativa e revisione umana autorizzati. Tutto resta in questa scheda e si perde ricaricando; il download è una scelta esplicita. Non inserire nomi o dati personali.',
    language: 'Lingua', form: 'Forma', occasion: 'Momento', pre: 'Prima del gioco', post: 'Dopo il gioco',
    participant: 'Prova indipendente', observer: 'Osservazione e rubrica', task: 'Consegna',
    prompt: 'Scrivi una valutazione autonoma: chiarisci che cosa occorre decidere, confronta almeno due fonti spiegandone il peso, collega le prove alla conclusione e a una misura proporzionata, considera una lettura alternativa, indica un’informazione mancante e le conseguenze per le persone. Puoi motivare una conclusione condizionata. Non ci sono risposte da selezionare. Tempo previsto: 10–15 minuti; nessuna correzione automatica.',
    legal: 'Quadro comune a entrambe le forme',
    legalText: 'Sintesi di orientamento: art. 6 e allegato III, punto 3(a), richiedono di verificare destinazione e influenza sulle ammissioni. L’art. 6(3) ha condizioni specifiche. “Culturale” o “associativo” non risolvono la qualificazione. Il testo consolidato UE e la raccomandazione del Consiglio d’Europa hanno natura distinta.',
    lawLink: 'Regolamento UE · consolidamento 27 luglio 2026', councilLink: 'Consiglio d’Europa · CM/Rec(2026)12',
    answer: 'La mia argomentazione', seal: 'Consegna e blocca il testo', sealed: 'Testo consegnato. Non è stato valutato automaticamente.',
    required: 'Scrivi un testo prima di consegnare.', print: 'Stampa i materiali visibili',
    context: 'Contesto CEPAJe', contextPrompt: 'Contesto e dispositivo; lingua e accessibilità; obiettivo e durata; mediazione dell’insegnante; conoscenze iniziali; modalità di gioco. Descrivi le condizioni senza identificare persone.',
    observation: 'Osservazione strutturata del gioco',
    observed: 'Azione o frase osservata e ordine degli episodi', interpretation: 'Interpretazione provvisoria e spiegazione alternativa',
    observationRows: ['Esplorazione, ritorni e aiuto richiesto', 'Valutazione di provenienza e limiti delle fonti', 'Correlazione spiegata tra prove', 'Mantenimento o revisione motivata dell’ipotesi', 'Argomentazione prima del feedback', 'Incertezza e conseguenze per le persone', 'Uso del feedback e strategia per un nuovo caso'],
    rubric: 'Rubrica preliminare · codifica solo umana',
    rubricRows: ['Tesi circostanziata, misura e responsabilità', 'Provenienza e pertinenza', 'Nesso fra prova e conclusione', 'Interpretazione alternativa e prova discriminante', 'Incertezza e diritti', 'Revisione dopo il feedback (solo nel debrief del gioco)'],
    anchors: ['Non osservato / non applicabile', '0 · Evidenza non esplicitata nel compito', '1 · Evidenza parziale', '2 · Evidenza articolata'],
    rationale: 'Passaggio testuale, ragione del codice e possibile spiegazione alternativa',
    noTotal: 'Nessun totale o punteggio automatico. Non osservato è distinto da 0. Codifica la correttezza normativa separatamente. Per i task PRE/POST lascia non applicabile la revisione dopo il feedback. Due valutatori indipendenti confrontano i codici prima della discussione.',
    legalJudgment: 'Valutazione normativa separata, condizionata ai fatti e alla revisione giuridica',
    guidance: 'Indicazioni per il facilitatore', release: 'Ho concluso la raccolta: mostra il debrief',
    afterOnly: 'Mostrare soltanto dopo il POST o nel momento prespecificato dal protocollo. Questa azione non corregge il testo né assegna punti.',
    debrief: 'Confrontare la promessa del fornitore con il registro e la procedura. Il registro documenta una settimana, non dimostra da solo la causa di ogni esclusione. Discutere indisponibilità dei posti o errore amministrativo come alternative da verificare. Chiedere avviso/bando, destinazione effettiva, criteri, poteri di riesame ed esiti. La qualifica educativa e l’influenza sulle ammissioni richiedono accertamento: sono ammesse conclusioni condizionate. Ricostruire ragioni e diritti, poi formulare un controllo applicabile altrove.',
    download: 'Scarica copia locale esplicita', downloadNote: 'Il file contiene il testo consegnato e gli eventuali appunti umani presenti, senza identificativi o telemetria. Conservalo solo nel sistema di ricerca autorizzato.',
    reset: 'Nuova scheda vuota', resetConfirm: 'Cancellare il lavoro di questa scheda? Non sarà recuperabile.',
    statusDownload: 'Copia locale preparata; nessun invio a un server.', draft: 'Strumento preliminare: equivalenza delle forme, rubriche e traduzioni da validare con persone.'
  },
  en: {
    title: 'NO AI ACT · Study 02 laboratory',
    notice: 'Local prototype for fictional-material trials. Participant sessions require an authorised protocol, information notice and human review. Everything stays in this tab and is lost on reload; downloading is an explicit choice. Do not enter names or personal data.',
    language: 'Language', form: 'Form', occasion: 'Occasion', pre: 'Before the game', post: 'After the game',
    participant: 'Independent task', observer: 'Observation and rubric', task: 'Instructions',
    prompt: 'Write an independent assessment: explain what must be decided, compare at least two sources and their weight, connect evidence to a conclusion and proportionate measure, consider an alternative reading, identify missing information and consequences for people. You may justify a conditional conclusion. There are no answer options. Expected time: 10–15 minutes; no automatic correction.',
    legal: 'Framework common to both forms',
    legalText: 'Orientation summary: Article 6 and Annex III point 3(a) require checking intended purpose and influence on admission. Article 6(3) has specific conditions. “Cultural” or “association” does not settle classification. The consolidated EU text and the Council of Europe recommendation have different legal status.',
    lawLink: 'EU Regulation · consolidated 27 July 2026', councilLink: 'Council of Europe · CM/Rec(2026)12',
    answer: 'My argument', seal: 'Submit and lock text', sealed: 'Text submitted. It has not been automatically assessed.',
    required: 'Write a response before submitting.', print: 'Print visible materials',
    context: 'CEPAJe context', contextPrompt: 'Setting and device; language and accessibility; goal and duration; teacher mediation; prior knowledge; game mode. Describe conditions without identifying people.',
    observation: 'Structured game observation', observed: 'Observed action or utterance and order of episodes', interpretation: 'Provisional interpretation and alternative explanation',
    observationRows: ['Exploration, revisits and requested help', 'Assessment of source provenance and limits', 'Explained connection between evidence', 'Reasoned retention or revision of a hypothesis', 'Argument before feedback', 'Uncertainty and consequences for people', 'Use of feedback and strategy for a new case'],
    rubric: 'Preliminary rubric · human coding only',
    rubricRows: ['Contextualised claim, measure and responsibility', 'Provenance and relevance', 'Connection between evidence and conclusion', 'Alternative interpretation and discriminating evidence', 'Uncertainty and rights', 'Revision after feedback (game debrief only)'],
    anchors: ['Not observed / not applicable', '0 · Evidence not made explicit in this task', '1 · Partial evidence', '2 · Elaborated evidence'],
    rationale: 'Text excerpt, reason for the code and possible alternative explanation',
    noTotal: 'No total or automatic score. Not observed differs from 0. Code legal accuracy separately. Mark revision after feedback as not applicable for PRE/POST tasks. Two independent raters compare codes before discussion.',
    legalJudgment: 'Separate legal assessment, conditional on facts and legal review',
    guidance: 'Facilitator guidance', release: 'Collection is finished: show debrief',
    afterOnly: 'Show only after POST or at the moment prespecified in the protocol. This action does not correct the text or assign points.',
    debrief: 'Compare the provider promise with the log and procedure. The log covers one week and cannot establish the cause of every exclusion. Discuss unavailable places or administrative error as alternatives to check. Request the notice/call, actual purpose, criteria, review powers and outcomes. Educational status and influence on admission need investigation: conditional conclusions are acceptable. Reconstruct reasons and rights, then propose a check applicable elsewhere.',
    download: 'Explicitly download a local copy', downloadNote: 'The file contains the submitted text and any human notes present, without identifiers or telemetry. Retain it only in the authorised research system.',
    reset: 'New blank sheet', resetConfirm: 'Erase this tab’s work? It cannot be recovered.',
    statusDownload: 'Local copy prepared; nothing sent to a server.', draft: 'Preliminary instrument: form equivalence, rubrics and translations require validation with people.'
  },
  fr: {
    title: 'NO AI ACT · Laboratoire Study 02',
    notice: 'Prototype local pour essais sur des pièces fictives. Les séances avec participants nécessitent un protocole, une information et une révision humaine autorisés. Tout reste dans cet onglet et disparaît au rechargement ; le téléchargement est un choix explicite. Ne saisissez ni noms ni données personnelles.',
    language: 'Langue', form: 'Forme', occasion: 'Moment', pre: 'Avant le jeu', post: 'Après le jeu',
    participant: 'Épreuve indépendante', observer: 'Observation et grille', task: 'Consigne',
    prompt: 'Rédigez une analyse autonome : précisez la décision à prendre, comparez au moins deux sources et leur poids, reliez les preuves à une conclusion et à une mesure proportionnée, envisagez une autre lecture, indiquez une information manquante et les conséquences pour les personnes. Une conclusion conditionnelle peut être justifiée. Aucun choix de réponse. Durée prévue : 10–15 minutes ; aucune correction automatique.',
    legal: 'Cadre commun aux deux formes',
    legalText: 'Synthèse d’orientation : l’article 6 et l’annexe III, point 3(a), demandent de vérifier la destination et l’influence sur l’admission. L’article 6(3) prévoit des conditions précises. « Culturel » ou « associatif » ne tranche pas la qualification. Le texte UE consolidé et la recommandation du Conseil de l’Europe ont une nature distincte.',
    lawLink: 'Règlement UE · consolidation du 27 juillet 2026', councilLink: 'Conseil de l’Europe · CM/Rec(2026)12',
    answer: 'Mon argumentation', seal: 'Remettre et verrouiller le texte', sealed: 'Texte remis. Il n’a pas été évalué automatiquement.',
    required: 'Écrivez un texte avant de le remettre.', print: 'Imprimer les pièces visibles',
    context: 'Contexte CEPAJe', contextPrompt: 'Cadre et appareil ; langue et accessibilité ; objectif et durée ; médiation enseignante ; connaissances initiales ; mode de jeu. Décrivez les conditions sans identifier de personnes.',
    observation: 'Observation structurée du jeu', observed: 'Action ou propos observé et ordre des épisodes', interpretation: 'Interprétation provisoire et explication alternative',
    observationRows: ['Exploration, retours et aide demandée', 'Évaluation de la provenance et des limites des sources', 'Relation expliquée entre les preuves', 'Maintien ou révision motivée de l’hypothèse', 'Argumentation avant le retour', 'Incertitude et conséquences pour les personnes', 'Usage du retour et stratégie pour un nouveau dossier'],
    rubric: 'Grille préliminaire · codage humain uniquement',
    rubricRows: ['Thèse contextualisée, mesure et responsabilité', 'Provenance et pertinence', 'Lien entre preuve et conclusion', 'Interprétation alternative et preuve discriminante', 'Incertitude et droits', 'Révision après le retour (débrief du jeu uniquement)'],
    anchors: ['Non observé / non applicable', '0 · Preuve non explicitée dans cette tâche', '1 · Preuve partielle', '2 · Preuve élaborée'],
    rationale: 'Passage du texte, raison du code et explication alternative possible',
    noTotal: 'Aucun total ni score automatique. Non observé diffère de 0. Codez séparément la justesse juridique. Pour PRE/POST, indiquez non applicable pour la révision après le retour. Deux évaluateurs indépendants comparent les codes avant discussion.',
    legalJudgment: 'Analyse juridique séparée, conditionnelle aux faits et à la révision juridique',
    guidance: 'Indications pour le médiateur', release: 'Recueil terminé : afficher le débrief',
    afterOnly: 'Afficher seulement après le POST ou au moment prévu par le protocole. Cette action ne corrige pas le texte et n’attribue aucun point.',
    debrief: 'Comparer la promesse du fournisseur au registre et à la procédure. Une semaine de registre ne démontre pas la cause de chaque exclusion. Discuter des places indisponibles ou d’une erreur administrative comme alternatives à vérifier. Demander avis/appel, destination réelle, critères, pouvoirs de réexamen et résultats. Le statut éducatif et l’influence sur l’admission nécessitent une enquête : les conclusions conditionnelles sont admises. Reconstruire les raisons et les droits, puis proposer une vérification applicable ailleurs.',
    download: 'Télécharger explicitement une copie locale', downloadNote: 'Le fichier contient le texte remis et les éventuelles notes humaines, sans identifiants ni télémétrie. Conservez-le uniquement dans le système de recherche autorisé.',
    reset: 'Nouvelle feuille vierge', resetConfirm: 'Effacer le travail de cet onglet ? Il ne sera pas récupérable.',
    statusDownload: 'Copie locale préparée ; aucun envoi à un serveur.', draft: 'Instrument préliminaire : équivalence des formes, grilles et traductions à valider avec des personnes.'
  }
};
