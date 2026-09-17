/**
 * Reveal every exhibit and cite a stable subset through the real keyboard
 * handlers. Each key waits for the Phaser state change before the next one,
 * which keeps high-density software-rendered runs deterministic.
 */
export async function prepareEvidenceWithKeyboard(page, options = {}) {
  const settleMs = options.settleMs ?? 300;
  const count = await page.evaluate(() => {
    const scene = window.game?.scene?.getScene('Evidence');
    return scene?.scene?.isActive?.() ? (scene.cards?.length ?? 0) : 0;
  });

  const citeCount = options.citeIndices?.length ?? options.citeCount ?? 2;
  if (count < citeCount || count > 9) {
    throw new Error(`Unexpected exhibit count: ${count}`);
  }

  const waitForState = (index, state, expected) => page.waitForFunction(
    ({ cardIndex, property, value }) => {
      const scene = window.game?.scene?.getScene('Evidence');
      return scene?.scene?.isActive?.() && scene.cards?.[cardIndex]?.[property] === value;
    },
    { cardIndex: index, property: state, value: expected },
    { timeout: 8000 }
  );
  const readState = (index, state) => page.evaluate(
    ({ cardIndex, property }) => window.game?.scene?.getScene('Evidence')?.cards?.[cardIndex]?.[property] === true,
    { cardIndex: index, property: state }
  );

  for (let index = 0; index < count; index += 1) {
    if (!(await readState(index, 'isRevealed'))) {
      await page.keyboard.press(String(index + 1));
      await waitForState(index, 'isRevealed', true);
      await page.waitForTimeout(settleMs);
    }
    // A reveal pass must leave a clean, uncited desk before the deliberate
    // citation pass below. This also catches duplicate synthetic key delivery.
    if (await readState(index, 'isCited')) {
      await page.keyboard.press(String(index + 1));
      await waitForState(index, 'isCited', false);
      await page.waitForTimeout(settleMs);
    }
  }

  const start = options.citeFromEnd ? count - citeCount : 0;
  const citedIndices = options.citeIndices
    ?? Array.from({ length: citeCount }, (_, offset) => start + offset);
  if (citedIndices.some((index) => index < 0 || index >= count)) {
    throw new Error(`Invalid exhibit citation set: ${citedIndices.join(',')}`);
  }
  for (const index of citedIndices) {
    if (!(await readState(index, 'isCited'))) {
      await page.keyboard.press(String(index + 1));
      await waitForState(index, 'isCited', true);
      await page.waitForTimeout(settleMs);
    }
  }

  return citedIndices;
}

/**
 * Put the evidence desk in a known visual state through the cards' real
 * activation method. Input behavior is covered by keyboard/gameplay smokes;
 * this variant keeps the high-density visual matrix focused on rendering.
 */
export async function prepareEvidenceVisualState(page, citeIndices = [0, 1]) {
  const result = await page.evaluate((wantedIndices) => {
    const scene = window.game?.scene?.getScene('Evidence');
    const cards = scene?.scene?.isActive?.() ? (scene.cards ?? []) : [];
    const wanted = new Set(wantedIndices);
    cards.forEach((card, index) => {
      if (!card.isRevealed) card.activate();
      if (card.isCited !== wanted.has(index)) card.activate();
    });
    return {
      count: cards.length,
      revealed: cards.filter((card) => card.isRevealed).length,
      cited: cards.flatMap((card, index) => (card.isCited ? [index] : []))
    };
  }, citeIndices);

  if (result.count === 0 || result.revealed !== result.count) {
    throw new Error(`Could not prepare visual evidence state: ${JSON.stringify(result)}`);
  }
  if (JSON.stringify(result.cited) !== JSON.stringify(citeIndices)) {
    throw new Error(`Unexpected visual citation state: ${JSON.stringify(result.cited)}`);
  }
  await page.waitForTimeout(300);
  return citeIndices;
}
