import type { CaseData, IncidentChoice, IndicatorState, LocationData } from './types';

/**
 * Delta indicatori per le scelte degli eventi imprevisti (uguali per i 3
 * eventi della v0.3): documentare premia la fiducia, sospendere i diritti,
 * minimizzare l'efficienza apparente a scapito di fiducia e diritti.
 */
export const INCIDENT_DELTAS: Record<IncidentChoice, Partial<IndicatorState>> = {
  document: { fiducia: 2, efficienza: -1 },
  suspend: { diritti: 2, efficienza: -2 },
  minimize: { efficienza: 2, fiducia: -3, diritti: -2 }
};

export const LOCATIONS: LocationData[] = [
  { id: 'municipio', x: 0.46, y: 0.36, iconKey: 'icon_townhall', caseId: 'case_scoring' },
  { id: 'lavoro', x: 0.22, y: 0.55, iconKey: 'icon_work', caseId: 'case_lavoro' },
  { id: 'media', x: 0.68, y: 0.24, iconKey: 'icon_media', caseId: 'case_media' },
  { id: 'scuola', x: 0.78, y: 0.58, iconKey: 'icon_school', caseId: 'case_scuola' },
  { id: 'ospedale', x: 0.33, y: 0.78, iconKey: 'icon_hospital', caseId: 'case_ospedale' },
  { id: 'sorveglianza', x: 0.58, y: 0.74, iconKey: 'icon_eye', caseId: 'case_biometria' },
  { id: 'welfare', x: 0.40, y: 0.18, iconKey: 'icon_card', caseId: 'case_credito' },
  // Advanced Case Pack (v0.6) — 4 nuovi luoghi nelle aree libere della mappa
  { id: 'sportello', x: 0.86, y: 0.40, iconKey: 'icon_chat', caseId: 'case_chatbot' },
  { id: 'appalti', x: 0.12, y: 0.30, iconKey: 'icon_doc', caseId: 'case_procurement' },
  { id: 'campus', x: 0.86, y: 0.82, iconKey: 'icon_grad', caseId: 'case_edtech' },
  { id: 'modelli', x: 0.12, y: 0.74, iconKey: 'icon_model', caseId: 'case_gpai' }
];

/**
 * Struttura dei casi investigativi. Tutti i testi visibili vivono in
 * src/game/i18n/<lingua>.ts sotto cases[id].
 *
 * relevantClues: indici dei reperti che fondano la CLASSIFICAZIONE.
 * Il reperto rimanente è sempre vero, ma riguarda un'altra dimensione del
 * problema (es. trasparenza in un caso di pratica vietata): citarlo al posto
 * di un reperto rilevante indebolisce il rapporto.
 */
export const CASES: CaseData[] = [
  {
    id: 'case_scoring',
    locationId: 'municipio',
    fileCode: 'AX-031/2032',
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['audit', 'oversight'],
    // dati non pertinenti + penalità trans-contestuale = social scoring vietato;
    // la motivazione assente (c3) è un problema di trasparenza, non il divieto
    relevantClues: [0, 1],
    normId: 'norm_social_scoring',
    responsibleSubjectCorrect: 'autorita',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 1,
    weakMotivation: 0,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'soggetto', 'motivazione'],
    hasIncident: false,
    playable: true
  },
  {
    id: 'case_lavoro',
    locationId: 'lavoro',
    fileCode: 'AX-047/2032',
    correctClassification: 'alto_rischio',
    correctMeasures: ['audit', 'oversight', 'dati_logging'],
    partialMeasures: ['informare'],
    // bias nei dati storici + oversight di facciata = obblighi alto rischio violati;
    // la notifica standard (c1) è il sintomo, non il fondamento
    relevantClues: [1, 2],
    // c0 notifica standard = sintomo (contesto); c1 bias dei dati e c2 oversight
    // di facciata sono le prove decisive dell'alto rischio violato
    clueStances: ['contextual', 'decisive', 'decisive'],
    normId: 'norm_lavoro_alto_rischio',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 2,
    weakMotivation: 1,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'eccesso_cautela', 'soggetto', 'motivazione'],
    hasIncident: true,
    incidentDeltas: INCIDENT_DELTAS,
    playable: true
  },
  {
    id: 'case_media',
    locationId: 'media',
    fileCode: 'AX-052/2032',
    correctClassification: 'trasparenza',
    correctMeasures: ['etichettare', 'informare'],
    partialMeasures: ['audit'],
    // assenza di etichette + apparenza autentica = obbligo art. 50;
    // la fiducia persa (c3) è la conseguenza, non il fondamento
    relevantClues: [0, 1],
    normId: 'norm_trasparenza_sintetici',
    responsibleSubjectCorrect: 'autorita',
    correctMotivation: 0,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'trasparenza', 'soggetto', 'motivazione'],
    hasIncident: true,
    incidentDeltas: INCIDENT_DELTAS,
    playable: true
  },
  {
    id: 'case_scuola',
    locationId: 'scuola',
    fileCode: 'AX-063/2032',
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['oversight', 'audit'],
    // inferenza emotiva in ambito educativo + fragilità dell'inferenza = divieto;
    // l'impossibilità di contestare (c2) è un problema procedurale, non il divieto
    relevantClues: [0, 2],
    normId: 'norm_emotion_recognition',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 1,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'soggetto', 'motivazione'],
    hasIncident: false,
    playable: true
  },
  {
    id: 'case_ospedale',
    locationId: 'ospedale',
    fileCode: 'AX-071/2032',
    correctClassification: 'alto_rischio',
    correctMeasures: ['audit', 'dati_logging', 'oversight'],
    partialMeasures: ['informare'],
    // errori concentrati sui sottogruppi + fiducia cieca = qualità dati e oversight;
    // la media eccellente (c1) è il dato che INGANNA: citarla come fondamento è l'errore
    relevantClues: [1, 2],
    // c0 medie eccellenti = il dato che INGANNA (minimizza); c1 errori sui
    // sottogruppi e c2 fiducia cieca sono le prove decisive
    clueStances: ['minimizes_risk', 'decisive', 'decisive'],
    normId: 'norm_alto_rischio_obblighi',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 0,
    weakMotivation: 1,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'eccesso_cautela', 'soggetto', 'motivazione'],
    hasIncident: true,
    incidentDeltas: INCIDENT_DELTAS,
    playable: true
  },
  {
    id: 'case_biometria',
    locationId: 'sorveglianza',
    fileCode: 'AX-088/2032',
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['audit'],
    // tempo reale + spazio pubblico + finalità di contrasto = perimetro del divieto;
    // gli errori sproporzionati ne aggravano il danno
    relevantClues: [1, 2],
    normId: 'norm_biometria',
    responsibleSubjectCorrect: 'autorita',
    responsibleSubjectPartial: 'fornitore_esterno',
    correctMotivation: 2,
    weakMotivation: 0,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'soggetto', 'motivazione'],
    hasIncident: false,
    playable: true
  },
  {
    // CASO 7 — caso-specchio credito/welfare (v0.4).
    // Classificazione corretta: VIETATA. Il sistema aggrega comportamenti
    // sociali (segnalazioni, "affidabilità civica") in punteggio generalizzato
    // che limita l'accesso a servizi essenziali in contesti scollegati →
    // ricade nel divieto di social scoring. NON è un mero credit scoring.
    id: 'case_credito',
    locationId: 'welfare',
    fileCode: 'AX-102/2032',
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    // audit/oversight mitigano ma non sanano un punteggio sociale generalizzato
    partialMeasures: ['audit', 'oversight', 'dati_logging'],
    // reperti decisivi: dati non pertinenti aggregati (3) + decisione di fatto
    // automatica/priva di controllo umano effettivo (4). I reperti 0,1,2,5 sono
    // contorno o depistaggio (finalità dichiarata, difesa del vendor, ecc.).
    relevantClues: [3, 4],
    // c0 finalità dichiarata (contesto), c1 manuale-vendor e c5 comunicato
    // minimizzano, c2 reclamo mostra l'effetto concreto, c3 dati non pertinenti
    // e c4 controllo umano solo formale sono le prove decisive
    clueStances: ['contextual', 'minimizes_risk', 'concrete_effect', 'decisive', 'decisive', 'minimizes_risk'],
    normId: 'norm_credito',
    responsibleSubjectCorrect: 'autorita',
    responsibleSubjectPartial: 'fornitore_esterno',
    correctMotivation: 1,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'eccesso_cautela', 'soggetto', 'motivazione', 'trasparenza'],
    hasIncident: false,
    playable: true
  },

  // ===================== ADVANCED CASE PACK (v0.6) =====================

  {
    // CASO 8 — Chatbot comunale. Assistente pubblico che informa i cittadini.
    // NON è vietato: è una questione di trasparenza, affidamento e supervisione.
    // Classificazione: obbligo di trasparenza (art. 50) + controllo umano.
    id: 'case_chatbot',
    locationId: 'sportello',
    fileCode: 'AX-115/2032',
    correctClassification: 'trasparenza',
    correctMeasures: ['informare', 'etichettare'],
    partialMeasures: ['oversight', 'audit', 'dati_logging'],
    // decisive: log di risposte errate (1) + policy senza escalation umana (4)
    relevantClues: [1, 4],
    clueStances: ['minimizes_risk', 'decisive', 'minimizes_risk', 'concrete_effect', 'decisive', 'contextual'],
    normId: 'norm_chatbot',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'fornitore_esterno',
    correctMotivation: 1,
    weakMotivation: 0,
    possibleDominantErrors: ['classificazione', 'prove', 'trasparenza', 'misura_insufficiente', 'soggetto', 'motivazione'],
    hasIncident: false,
    playable: true
  },
  {
    // CASO 9 — Procurement AI. Acquisto pubblico senza documentazione né
    // governance. Il sistema acquistato è ad alto rischio; il vizio è di
    // accountability e documentazione ex ante.
    id: 'case_procurement',
    locationId: 'appalti',
    fileCode: 'AX-121/2032',
    correctClassification: 'alto_rischio',
    correctMeasures: ['audit', 'dati_logging', 'oversight'],
    partialMeasures: ['informare'],
    // decisive: verbale che ammette l'assenza di documentazione (2) + accesso
    // e controllo negati dal fornitore (4)
    relevantClues: [2, 4],
    clueStances: ['contextual', 'minimizes_risk', 'decisive', 'ambiguous', 'decisive', 'concrete_effect'],
    normId: 'norm_procurement',
    responsibleSubjectCorrect: 'autorita',
    responsibleSubjectPartial: 'fornitore_esterno',
    correctMotivation: 0,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'soggetto', 'motivazione', 'eccesso_cautela'],
    hasIncident: false,
    playable: true
  },
  {
    // CASO 10 — Piattaforma educativa adattiva. Profila studenti e orienta
    // decisioni didattiche rilevanti → alto rischio (istruzione, Allegato III).
    // Non ogni EdTech è vietata: conta se incide su accesso/valutazione.
    id: 'case_edtech',
    locationId: 'campus',
    fileCode: 'AX-128/2032',
    correctClassification: 'alto_rischio',
    correctMeasures: ['oversight', 'audit', 'dati_logging'],
    partialMeasures: ['informare'],
    // decisive: dashboard di rischio che indirizza le decisioni (0) + nota
    // docente che ammette un controllo umano solo formale (3)
    relevantClues: [0, 3],
    clueStances: ['decisive', 'minimizes_risk', 'contextual', 'decisive', 'concrete_effect', 'ambiguous'],
    normId: 'norm_edtech',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 2,
    weakMotivation: 1,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'soggetto', 'motivazione', 'eccesso_cautela'],
    hasIncident: false,
    playable: true
  },
  {
    // CASO 11 — GPAI in azienda/PA. Modello generale usato in processi
    // decisionali concreti. Il modello generale NON è di per sé vietato né
    // automaticamente alto rischio: è l'uso a valle che richiede governance.
    id: 'case_gpai',
    locationId: 'modelli',
    fileCode: 'AX-134/2032',
    correctClassification: 'alto_rischio',
    correctMeasures: ['oversight', 'audit', 'dati_logging'],
    partialMeasures: ['informare', 'etichettare'],
    // decisive: email interna che spinge a usare il modello per bozze di
    // decisione (2) + log dei prompt non governato (4)
    relevantClues: [2, 4],
    clueStances: ['contextual', 'concrete_effect', 'decisive', 'supports_risk', 'decisive', 'minimizes_risk'],
    normId: 'norm_gpai',
    responsibleSubjectCorrect: 'deployer',
    responsibleSubjectPartial: 'provider',
    correctMotivation: 1,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'trasparenza', 'soggetto', 'motivazione', 'eccesso_cautela'],
    hasIncident: false,
    playable: true
  }
];

export function getCase(id: string): CaseData {
  const c = CASES.find((x) => x.id === id);
  if (!c) throw new Error(`Caso sconosciuto: ${id}`);
  return c;
}

export const PLAYABLE_CASES = CASES.filter((c) => c.playable);
export const CASES_REQUIRED_FOR_FINALE = 4;
/** Numero minimo di reperti da citare nel rapporto prima di classificare. */
export const MIN_CITED_CLUES = 2;
