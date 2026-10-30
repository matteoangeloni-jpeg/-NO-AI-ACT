import { describe, expect, it } from 'vitest';
import { RESEARCH_MODE_BUILD_ENABLED, researchModeStatus, validateParticipantCode } from '../analytics/research-mode';

describe('research mode approval gate', () => {
  it('is disabled in every public build configuration', () => {
    expect(RESEARCH_MODE_BUILD_ENABLED).toBe(false);
    expect(researchModeStatus({ requested: true, protocolId: 'study-02', endpoint: 'https://example.invalid' }))
      .toEqual({ enabled: false, reason: 'pending_protocol_and_approval' });
  });

  it('accepts only opaque study codes and rejects identity-like or free-text values', () => {
    expect(validateParticipantCode('ST02A001')).toBe(true);
    for (const value of ['matteo@example.org', 'Mario Rossi', 'abc', 'ST02-A001', '', null]) {
      expect(validateParticipantCode(value)).toBe(false);
    }
  });
});
