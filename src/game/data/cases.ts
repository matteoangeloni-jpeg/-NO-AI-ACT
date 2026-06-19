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
  { id: 'welfare', x: 0.40, y: 0.18, iconKey: 'icon_card', caseId: 'case_credito' }
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
    normId: 'norm_credito',
    responsibleSubjectCorrect: 'autorita',
    responsibleSubjectPartial: 'fornitore_esterno',
    correctMotivation: 1,
    weakMotivation: 2,
    possibleDominantErrors: ['classificazione', 'prove', 'misura_insufficiente', 'eccesso_cautela', 'soggetto', 'motivazione', 'trasparenza'],
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
