export type SaveKey = 'no-ai-act-save-v2' | 'no-ai-act-save-v1';

/** Separate beta even when two builds are tested on the same local origin. */
export function saveStorageKey(key: SaveKey, channel = import.meta.env.VITE_RELEASE_CHANNEL): string {
  if (channel !== 'beta') return key;
  return key === 'no-ai-act-save-v2' ? 'no-ai-act-beta-save-v2' : 'no-ai-act-beta-save-v1';
}
