/**
 * Research mode contract only. It is intentionally unreachable from the public
 * game until a reviewed protocol supplies a separate endpoint and build gate.
 */
export const RESEARCH_MODE_BUILD_ENABLED = false as const;

export const RESEARCH_GROUPS = ['control', 'intervention_a', 'intervention_b'] as const;
export type ResearchGroup = typeof RESEARCH_GROUPS[number];

export interface ResearchModeConfig {
  requested: boolean;
  protocolId?: string;
  endpoint?: string;
  retentionDays?: number;
}

export interface ResearchSessionEnvelope {
  schemaVersion: 1;
  protocolId: string;
  participantCode: string;
  group: ResearchGroup;
  assignedCaseIds: string[];
  completed: boolean;
  /** Rubric outputs only; no free text or identity fields. */
  scores: Record<string, number | null>;
}

export function validateParticipantCode(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Z0-9]{6,24}$/.test(value);
}

export function researchModeStatus(config: ResearchModeConfig): { enabled: false; reason: string } {
  if (!config.requested) return { enabled: false, reason: 'not_requested' };
  if (!RESEARCH_MODE_BUILD_ENABLED) return { enabled: false, reason: 'pending_protocol_and_approval' };
  return { enabled: false, reason: 'no_approved_transport' };
}
