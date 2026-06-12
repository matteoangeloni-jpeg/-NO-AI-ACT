import type { NormCardData } from './types';

/**
 * Carte norma — VERSIONE DIDATTICA SEMPLIFICATA.
 * Riferimento: Regolamento (UE) 2024/1689 ("AI Act").
 * Questi testi sono sintesi divulgative, non costituiscono consulenza legale.
 */
export const NORMS: NormCardData[] = [
  {
    id: 'norm_social_scoring',
    title: 'Divieto di social scoring',
    reference: 'AI Act — art. 5 (pratiche vietate)',
    level: 'Pratica vietata',
    explanation:
      "È vietato l'uso di sistemi di IA che valutano o classificano le persone " +
      'in base a comportamento sociale o caratteristiche personali, quando il ' +
      'punteggio produce trattamenti sfavorevoli in contesti diversi da quello ' +
      'di raccolta dei dati, o comunque sproporzionati e ingiustificati.',
    democraticFunction:
      "Alcuni usi dell'IA non vanno mitigati: vanno vietati, perché incompatibili " +
      'con dignità, uguaglianza e libertà individuale.',
    tags: ['divieto', 'scoring', 'servizi pubblici'],
    iconKey: 'icon_ban'
  },
  {
    id: 'norm_lavoro_alto_rischio',
    title: 'Sistemi ad alto rischio nel lavoro',
    reference: 'AI Act — Allegato III (occupazione e gestione dei lavoratori)',
    level: 'Alto rischio',
    explanation:
      'I sistemi di IA usati per reclutamento, selezione, valutazione e gestione ' +
      'dei lavoratori sono classificati ad alto rischio: richiedono gestione del ' +
      'rischio, qualità dei dati, sorveglianza umana effettiva, logging e ' +
      'informazione alle persone interessate.',
    democraticFunction:
      "L'accesso al lavoro non può dipendere da classificazioni opache che " +
      'impediscono comprensione, mobilità e contestazione.',
    tags: ['alto rischio', 'lavoro', 'oversight'],
    iconKey: 'icon_work'
  },
  {
    id: 'norm_trasparenza_sintetici',
    title: 'Trasparenza per contenuti sintetici',
    reference: 'AI Act — art. 50 (obblighi di trasparenza)',
    level: 'Trasparenza',
    explanation:
      'Due obblighi distinti: (1) chi interagisce con un sistema di IA deve ' +
      'essere informato di stare interagendo con una macchina; (2) i contenuti ' +
      'generati o manipolati artificialmente (inclusi i deepfake) devono essere ' +
      'resi riconoscibili come tali da chi li crea o li diffonde. ' +
      'Nota didattica: gli obblighi di trasparenza possono cumularsi con altre ' +
      'categorie di rischio; qui sono presentati come categoria autonoma solo ' +
      'per finalità didattica.',
    democraticFunction:
      'La trasparenza protegge la capacità di distinguere comunicazione pubblica, ' +
      'manipolazione e contenuto sintetico.',
    tags: ['trasparenza', 'deepfake', 'informazione'],
    iconKey: 'icon_media'
  },
  {
    id: 'norm_emotion_recognition',
    title: 'Divieto di emotion recognition a scuola e al lavoro',
    reference: 'AI Act — art. 5 (pratiche vietate, salvo eccezioni)',
    level: 'Pratica vietata',
    explanation:
      'È vietato usare sistemi di IA per inferire le emozioni delle persone nei ' +
      'luoghi di lavoro e negli istituti di istruzione, salvo limitate eccezioni ' +
      '(es. motivi medici o di sicurezza) previste dal regolamento.',
    democraticFunction:
      "L'ambiente educativo e lavorativo non deve diventare uno spazio di " +
      'sorveglianza emotiva permanente.',
    tags: ['divieto', 'emozioni', 'scuola', 'lavoro'],
    iconKey: 'icon_school'
  },
  {
    id: 'norm_alto_rischio_obblighi',
    title: 'Obblighi per sistemi ad alto rischio',
    reference: 'AI Act — obblighi per i sistemi ad alto rischio',
    level: 'Alto rischio',
    explanation:
      'I sistemi ad alto rischio devono rispettare requisiti su: gestione del ' +
      'rischio, qualità dei dati, documentazione tecnica, logging, trasparenza, ' +
      'sorveglianza umana, accuratezza, robustezza e cybersicurezza — anche dopo ' +
      'la messa in servizio (monitoraggio post-market).',
    democraticFunction:
      'Un sistema automatizzato che incide sulla vita delle persone deve essere ' +
      'verificabile anche nei suoi effetti sui gruppi vulnerabili.',
    tags: ['alto rischio', 'audit', 'dati', 'sanità'],
    iconKey: 'icon_hospital'
  },
  {
    id: 'norm_biometria',
    title: 'Identificazione biometrica remota',
    reference: 'AI Act — art. 5 e disposizioni specifiche sulla biometria',
    level: 'Condizioni restrittive',
    explanation:
      "Il divieto dell'art. 5 riguarda l'identificazione biometrica remota " +
      '«in tempo reale» in spazi accessibili al pubblico quando è usata per ' +
      'finalità di contrasto (attività di polizia), salvo eccezioni tassative ' +
      'soggette a condizioni e autorizzazioni molto restrittive. Altri usi ' +
      'biometrici possono ricadere in regimi diversi — inclusi i sistemi ad ' +
      "alto rischio — secondo il contesto d'uso e la finalità.",
    democraticFunction:
      'Lo spazio pubblico non può diventare una zona di identificazione ' +
      'automatica permanente.',
    tags: ['divieto', 'biometria', 'spazio pubblico'],
    iconKey: 'icon_eye'
  }
];

export function getNorm(id: string): NormCardData {
  const norm = NORMS.find((n) => n.id === id);
  if (!norm) throw new Error(`Norma sconosciuta: ${id}`);
  return norm;
}
