import type { NormCardData } from './types';

/**
 * Struttura delle carte norma. Tutti i testi (titolo, riferimento,
 * spiegazione, funzione democratica, tag) vivono in src/game/i18n/<lingua>.ts
 * sotto norms[id]. VERSIONE DIDATTICA SEMPLIFICATA del Reg. (UE) 2024/1689:
 * non costituisce consulenza legale.
 */
export const NORMS: NormCardData[] = [
  { id: 'norm_social_scoring', level: 'vietata', iconKey: 'icon_ban' },
  { id: 'norm_lavoro_alto_rischio', level: 'alto', iconKey: 'icon_work' },
  { id: 'norm_trasparenza_sintetici', level: 'trasparenza', iconKey: 'icon_media' },
  { id: 'norm_emotion_recognition', level: 'vietata', iconKey: 'icon_school' },
  { id: 'norm_alto_rischio_obblighi', level: 'alto', iconKey: 'icon_hospital' },
  { id: 'norm_biometria', level: 'restrittivo', iconKey: 'icon_eye' }
];

export function getNorm(id: string): NormCardData {
  const norm = NORMS.find((n) => n.id === id);
  if (!norm) throw new Error(`Norma sconosciuta: ${id}`);
  return norm;
}
