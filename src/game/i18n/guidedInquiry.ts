import type { LanguageCode } from '../data/types';
import deTranslation from './translations/de.json';
import esTranslation from './translations/es.json';
import ptTranslation from './translations/pt.json';

interface GuidedCopy {
  entry: string;
  notebook: string;
  debrief: string;
  finalDebrief: string;
  introduction: string;
  argument: string;
  privacy: string;
  colleague: string;
  purpose: string;
  categories: string;
  demonstration: string;
  mission: string;
  hypothesis: string;
  initial: string;
  evidence: string;
  alternative: string;
  uncertainty: string;
  reflection: string;
  reflectionPrompt: string;
  transferPrompt: string;
  continue: string;
  confirm: string;
  close: string;
  empty: string;
  erase: string;
}

const BASE_COPY: Record<'it' | 'en' | 'fr', GuidedCopy> = {
  it: {
    entry: 'PERCORSO GUIDATO', notebook: 'NOTE DI INDAGINE', debrief: 'RILEGGI IL RAGIONAMENTO',
    finalDebrief: 'DEBRIEF DEL PERCORSO', introduction: 'Prima di aprire i reperti',
    argument: 'La tua nota prima della firma',
    privacy: "Appunti locali temporanei. Con il consenso aggiuntivo ai testi, le note salvate sono condivise per 90 giorni. Evita dati personali. Gestisci il registro dalla barra.",
    colleague: 'La collega ispettora ti affianca',
    purpose: '«Prima capiamo chi usa il sistema, per quale decisione e con quali conseguenze per le persone. Classificare il rischio serve a scegliere quali regole, verifiche e misure considerare.»',
    categories: 'Una pratica vietata richiede di riconoscere le condizioni del divieto. Per l’alto rischio contano destinazione d’uso e obblighi. La trasparenza riguarda anche ciò che le persone devono sapere. Per gli altri usi vanno comunque considerate le norme applicabili e i diritti.',
    demonstration: '«Un fornitore scrive: “c’è sempre un controllo umano”. Un registro mostra che il revisore conferma le decisioni senza accedere ai dati. La promessa e il funzionamento osservato vanno confrontati. Quale documento chiederesti per capire se il controllo può cambiare la decisione?»',
    mission: 'Leggi il fascicolo e formula una prima ipotesi. Potrai cambiarla dopo avere esaminato i reperti.',
    hypothesis: 'La mia interpretazione attuale e perché',
    initial: 'La mia ipotesi prima dei reperti',
    evidence: 'Quali fonti collego e come sostengono o mettono in dubbio il giudizio',
    alternative: 'Una lettura alternativa e una prova che aiuterebbe a distinguerla',
    uncertainty: 'Che cosa manca e quale limite pone alla decisione sulle persone',
    reflection: 'Dopo il feedback, che cosa mantengo o rivedo e perché',
    reflectionPrompt: 'Rileggi la nota scritta prima del responso. Spiega quale informazione cambia la tua interpretazione, oppure perché la confermi.',
    transferPrompt: 'Nel prossimo fascicolo, quale controllo sulle fonti faresti per primo? Con un facilitatore, confrontate le ragioni delle vostre scelte.',
    continue: 'Vai ai reperti', confirm: 'Conferma la nota e firma', close: 'Torna al fascicolo',
    empty: 'Nessuna nota scritta in questa fase.', erase: 'Cancella questi appunti'
  },
  en: {
    entry: 'GUIDED PATH', notebook: 'INQUIRY NOTES', debrief: 'REVISIT YOUR REASONING',
    finalDebrief: 'GUIDED PATH DEBRIEF', introduction: 'Before opening the exhibits',
    argument: 'Your note before signing',
    privacy: "Temporary local notes. With the additional text consent, saved notes are shared for 90 days. Avoid personal data. Manage recording in the game bar.",
    colleague: 'A fellow inspector joins you',
    purpose: '“First, establish who uses the system, for which decision and with what consequences for people. Risk classification helps identify which rules, checks and measures to consider.”',
    categories: 'A prohibited practice requires checking the conditions of the ban. High risk depends on intended use and obligations. Transparency also concerns what people need to know. Other uses still require attention to applicable rules and rights.',
    demonstration: '“A provider writes: ‘A human always checks’. A log shows that the reviewer confirms decisions without access to the data. Compare the promise with the observed operation. Which document would help establish whether the review can change the decision?”',
    mission: 'Read the case and form an initial hypothesis. You can revise it after examining the exhibits.',
    hypothesis: 'My current interpretation and why',
    initial: 'My hypothesis before the exhibits',
    evidence: 'Which sources I connect and how they support or challenge the judgment',
    alternative: 'An alternative reading and evidence that could distinguish it',
    uncertainty: 'What is missing and how it limits a decision affecting people',
    reflection: 'After the feedback, what I keep or revise and why',
    reflectionPrompt: 'Reread your note from before the outcome. Explain which information changes your interpretation, or why you maintain it.',
    transferPrompt: 'In the next case, which source check would you make first? With a facilitator, compare the reasons for your choices.',
    continue: 'Go to exhibits', confirm: 'Confirm note and sign', close: 'Return to the case',
    empty: 'No note written at this stage.', erase: 'Clear these notes'
  },
  fr: {
    entry: 'PARCOURS GUIDÉ', notebook: 'NOTES D’ENQUÊTE', debrief: 'REVOIR LE RAISONNEMENT',
    finalDebrief: 'DÉBRIEF DU PARCOURS', introduction: 'Avant d’ouvrir les pièces',
    argument: 'Votre note avant la signature',
    privacy: "Notes locales temporaires. Avec l’accord supplémentaire aux textes, les notes enregistrées sont partagées pendant 90 jours. Évitez les données personnelles. Gérez le registre dans la barre.",
    colleague: 'Une collègue inspectrice vous accompagne',
    purpose: '« Cherchons qui utilise le système, pour quelle décision et avec quelles conséquences pour les personnes. La classification du risque aide à déterminer les règles, vérifications et mesures à envisager. »',
    categories: 'Pour une pratique interdite, vérifiez les conditions de l’interdiction. Le haut risque dépend de la destination et des obligations. La transparence concerne aussi ce que les personnes doivent savoir. Pour les autres usages, les règles applicables et les droits restent à examiner.',
    demonstration: '« Un fournisseur écrit : “Il y a toujours un contrôle humain”. Un registre montre que le réviseur confirme les décisions sans accéder aux données. Comparez la promesse et le fonctionnement observé. Quel document permettrait de savoir si le contrôle peut modifier la décision ? »',
    mission: 'Lisez le dossier et formulez une première hypothèse. Vous pourrez la réviser après avoir examiné les pièces.',
    hypothesis: 'Mon interprétation actuelle et ses raisons',
    initial: 'Mon hypothèse avant les pièces',
    evidence: 'Les sources que je relie et leur soutien ou opposition à mon jugement',
    alternative: 'Une autre interprétation et une preuve permettant de la distinguer',
    uncertainty: 'Ce qui manque et les limites pour une décision concernant des personnes',
    reflection: 'Après le retour, ce que je maintiens ou révise et pourquoi',
    reflectionPrompt: 'Relisez votre note écrite avant le résultat. Expliquez quelle information modifie votre interprétation, ou pourquoi vous la maintenez.',
    transferPrompt: 'Dans le prochain dossier, quelle vérification des sources feriez-vous d’abord ? Avec un médiateur, comparez les raisons de vos choix.',
    continue: 'Aller aux pièces', confirm: 'Confirmer la note et signer', close: 'Revenir au dossier',
    empty: 'Aucune note écrite à cette étape.', erase: 'Effacer ces notes'
  }
};

interface GuidedExtra {
  next: string; previous: string; method: string; sources: string; sourceAssessment: string;
  relationTitle: string; leftSource: string; rightSource: string; relationKind: string;
  supports: string; challenges: string; uncertain: string; relationReason: string;
  addRelation: string; removeRelation: string; relationRequired: string; relationSaved: string;
  recordRevision: string; revisionRequired: string; revisionSaved: string; revisions: string;
  revisionReason: string; reasoning: string; feedbackUse: string; transferPlan: string;
  sessionReflection: string; sessionTransferPlan: string; legalReference: string; choices: string;
  takeaway: string; sourcesUnavailable: string; reread: string; assessmentNote: string;
  openingStage: string; sourcesStage: string; hypothesisStage: string; resume: string;
}

const EXTRA_COPY: Record<'it' | 'en' | 'fr', GuidedExtra> = {
  it: {
    next: 'Prosegui', previous: 'Passo precedente', method: 'METODO DEL CASO',
    sources: 'Esplora e valuta le fonti', sourceAssessment: 'Che cosa documenta questa fonte, quali interessi può avere e quali limiti riconosci?',
    relationTitle: 'Collega due fonti', leftSource: 'Prima fonte', rightSource: 'Seconda fonte',
    relationKind: 'La relazione che proponi', supports: 'Si sostengono', challenges: 'Sono in tensione', uncertain: 'Relazione da chiarire',
    relationReason: 'Quale affermazione colleghi e perché?', addRelation: 'Registra il collegamento', removeRelation: 'Rimuovi il collegamento',
    relationRequired: 'Scegli due fonti diverse e spiega la relazione.', relationSaved: 'Collegamento registrato negli appunti della scheda.',
    recordRevision: 'Registra questa revisione', revisionRequired: 'Scrivi l’ipotesi e la ragione per cui la mantieni o la cambi.',
    revisionSaved: 'Revisione registrata negli appunti della scheda.', revisions: 'Le revisioni che hai esplicitato',
    revisionReason: 'Quale prova o ragione mi porta a mantenere o cambiare l’ipotesi',
    reasoning: 'Come collego le prove a classificazione, misura proposta e responsabilità',
    feedbackUse: 'Quale parte del feedback ho confrontato con una prova, e con quale esito',
    transferPlan: 'Quale criterio userò in un caso diverso e che cosa dovrò verificare',
    sessionReflection: 'Che cosa ho capito confrontando le mie indagini',
    sessionTransferPlan: 'Quale strategia proverò fuori da questi fascicoli',
    legalReference: 'Norma e lettura del caso', choices: 'Le scelte del rapporto', takeaway: 'Un criterio da discutere',
    sourcesUnavailable: 'Apri i reperti nella scena d’indagine per rileggerli e valutarli qui.',
    reread: 'Rileggi la fonte', assessmentNote: 'Questi appunti sostengono la riflessione. Un facilitatore può discutere con te le ragioni delle scelte.',
    openingStage: 'Comprendere il compito', sourcesStage: 'Preparare l’indagine', hypothesisStage: 'Formulare un’ipotesi',
    resume: 'Torna alla decisione'
  },
  en: {
    next: 'Continue', previous: 'Previous step', method: 'CASE METHOD',
    sources: 'Explore and evaluate sources', sourceAssessment: 'What does this source document, which interests might it have and which limits do you recognise?',
    relationTitle: 'Connect two sources', leftSource: 'First source', rightSource: 'Second source',
    relationKind: 'Your proposed relation', supports: 'They support each other', challenges: 'They are in tension', uncertain: 'Relation needs clarification',
    relationReason: 'Which claim do you connect and why?', addRelation: 'Record relation', removeRelation: 'Remove relation',
    relationRequired: 'Choose two different sources and explain the relation.', relationSaved: 'Relation recorded in this tab’s notes.',
    recordRevision: 'Record this revision', revisionRequired: 'Write the hypothesis and why you keep or change it.',
    revisionSaved: 'Revision recorded in this tab’s notes.', revisions: 'The revisions you explained',
    revisionReason: 'Which evidence or reason leads me to keep or change the hypothesis',
    reasoning: 'How I connect evidence to classification, proposed measure and responsibility',
    feedbackUse: 'Which part of the feedback I checked against evidence and what I found',
    transferPlan: 'Which criterion I will use in a different case and what I must check',
    sessionReflection: 'What I understood by comparing my investigations',
    sessionTransferPlan: 'Which strategy I will try outside these cases',
    legalReference: 'Rule and case interpretation', choices: 'The report’s choices', takeaway: 'A criterion to discuss',
    sourcesUnavailable: 'Open exhibits in the investigation scene to reread and evaluate them here.',
    reread: 'Reread source', assessmentNote: 'These notes support reflection. A facilitator can discuss the reasons for your choices with you.',
    openingStage: 'Understand the task', sourcesStage: 'Prepare the investigation', hypothesisStage: 'Form a hypothesis',
    resume: 'Return to the decision'
  },
  fr: {
    next: 'Poursuivre', previous: 'Étape précédente', method: 'MÉTHODE DU DOSSIER',
    sources: 'Explorer et évaluer les sources', sourceAssessment: 'Que documente cette source, quels intérêts peut-elle avoir et quelles limites identifiez-vous ?',
    relationTitle: 'Relier deux sources', leftSource: 'Première source', rightSource: 'Deuxième source',
    relationKind: 'La relation que vous proposez', supports: 'Elles se soutiennent', challenges: 'Elles sont en tension', uncertain: 'Relation à éclaircir',
    relationReason: 'Quelle affirmation reliez-vous et pourquoi ?', addRelation: 'Noter la relation', removeRelation: 'Retirer la relation',
    relationRequired: 'Choisissez deux sources différentes et expliquez la relation.', relationSaved: 'Relation conservée dans les notes de cet onglet.',
    recordRevision: 'Noter cette révision', revisionRequired: 'Écrivez l’hypothèse et la raison de son maintien ou de sa modification.',
    revisionSaved: 'Révision conservée dans les notes de cet onglet.', revisions: 'Les révisions que vous avez explicitées',
    revisionReason: 'La preuve ou la raison qui me conduit à maintenir ou modifier l’hypothèse',
    reasoning: 'Comment je relie les preuves à la classification, à la mesure et à la responsabilité',
    feedbackUse: 'La partie du retour que j’ai confrontée à une preuve et ce que j’en ai tiré',
    transferPlan: 'Le critère à utiliser dans un autre cas et ce qu’il faudra vérifier',
    sessionReflection: 'Ce que j’ai compris en comparant mes enquêtes',
    sessionTransferPlan: 'La stratégie que j’essaierai hors de ces dossiers',
    legalReference: 'Règle et interprétation du dossier', choices: 'Les choix du rapport', takeaway: 'Un critère à discuter',
    sourcesUnavailable: 'Ouvrez les pièces dans la scène d’enquête pour les relire et les évaluer ici.',
    reread: 'Relire la source', assessmentNote: 'Ces notes soutiennent la réflexion. Un médiateur peut discuter avec vous des raisons de vos choix.',
    openingStage: 'Comprendre la tâche', sourcesStage: 'Préparer l’enquête', hypothesisStage: 'Formuler une hypothèse',
    resume: 'Revenir à la décision'
  }
};

export const GUIDED_COPY: Record<LanguageCode, GuidedCopy & GuidedExtra> = {
  it: { ...BASE_COPY.it, ...EXTRA_COPY.it },
  en: { ...BASE_COPY.en, ...EXTRA_COPY.en },
  fr: { ...BASE_COPY.fr, ...EXTRA_COPY.fr },
  de: deTranslation.guided,
  es: esTranslation.guided,
  pt: ptTranslation.guided
};
