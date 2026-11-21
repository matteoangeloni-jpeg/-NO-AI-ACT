/** Independent CI runners; each group remains sequential to bound GPU memory. */
export const SMOKE_GROUPS = Object.freeze({
  core: Object.freeze(['gameplay-smoke.mjs', 'keyboard-smoke.mjs', 'draft-smoke.mjs', 'privacy-smoke.mjs',
    'audio-smoke.mjs', 'action-layer-smoke.mjs', 'inspector-desk-smoke.mjs', 'analytics-smoke.mjs', 'usage-notice-smoke.mjs']),
  layout: Object.freeze(['layout-smoke.mjs', 'press-pages-smoke.mjs', 'press-coverage-smoke.mjs', 'european-site-smoke.mjs']),
  visual: Object.freeze(['visual-language-smoke.mjs']),
  mobile: Object.freeze(['mobile-ux-smoke.mjs'])
});

export function selectSmokes(allSmokes, group = 'all') {
  const partition = Object.values(SMOKE_GROUPS).flat();
  if (partition.length !== allSmokes.length || new Set(partition).size !== allSmokes.length
    || partition.some(smoke => !allSmokes.includes(smoke))) {
    throw new Error('Smoke groups must cover the complete catalog exactly once');
  }
  if (group === 'all') return [...allSmokes];
  if (!Object.hasOwn(SMOKE_GROUPS, group)) throw new Error(`Unknown smoke group: ${group}`);
  return [...SMOKE_GROUPS[group]];
}
