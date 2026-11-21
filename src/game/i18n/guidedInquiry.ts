import type { LanguageCode } from '../data/types';

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

export const GUIDED_COPY: Record<LanguageCode, GuidedCopy> = {
  it: {
    entry: 'PERCORSO GUIDATO', notebook: 'NOTE DI INDAGINE', debrief: 'RILEGGI IL RAGIONAMENTO',
    finalDebrief: 'DEBRIEF DEL PERCORSO', introduction: 'Prima di aprire i reperti',
    argument: 'La tua nota prima della firma',
    privacy: 'Appunti facoltativi in questa scheda. Si cancellano al ricaricamento o con una nuova partita. Evita nomi e dati personali.',
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
    privacy: 'Optional notes in this tab. Reloading or starting a new game clears them. Avoid names and personal details.',
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
    privacy: 'Notes facultatives dans cet onglet. Un rechargement ou une nouvelle partie les efface. Évitez les noms et les données personnelles.',
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
