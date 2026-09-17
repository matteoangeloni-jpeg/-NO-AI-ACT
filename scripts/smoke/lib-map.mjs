/** Select one open case using the CityMap scene's real keyboard controls. */
export async function selectMapCaseWithKeyboard(page, caseId) {
  // A software-rendered 4K map can be marked active before create() has
  // finished drawing its procedural layers and registering keyboard input.
  // Wait for the actual handler instead of treating scene activation as ready.
  await page.waitForFunction((wantedCaseId) => {
    const scene = window.game?.scene?.getScene('CityMap');
    if (!scene?.scene?.isActive?.() || typeof scene.openCases !== 'function') return false;
    const keyboard = scene.input?.keyboard;
    return Number.isInteger(scene.keyIndex)
      && (keyboard?.listenerCount?.('keydown-RIGHT') ?? 0) > 0
      && scene.openCases().some((location) => location.caseId === wantedCaseId);
  }, caseId, { timeout: 30000 });

  const mapState = await page.evaluate((wantedCaseId) => {
    const scene = window.game?.scene?.getScene('CityMap');
    if (!scene?.scene?.isActive?.() || typeof scene.openCases !== 'function') return null;
    const open = scene.openCases();
    return {
      current: scene.keyIndex,
      count: open.length,
      target: open.findIndex((location) => location.caseId === wantedCaseId)
    };
  }, caseId);

  if (!mapState || mapState.target < 0 || mapState.count === 0) {
    throw new Error(`Case is not selectable on the civic map: ${caseId}`);
  }

  let current = mapState.current;
  for (let attempts = 0; current !== mapState.target && attempts < mapState.count * 3; attempts += 1) {
    const previous = current;
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(
      (oldIndex) => window.game?.scene?.getScene('CityMap')?.keyIndex !== oldIndex,
      previous,
      { timeout: 20000 }
    );
    await page.waitForTimeout(250);
    current = await page.evaluate(() => window.game?.scene?.getScene('CityMap')?.keyIndex ?? -1);
  }
  if (current !== mapState.target) {
    throw new Error(`Could not select map case after ${mapState.count * 3} moves: ${caseId}`);
  }
  await page.keyboard.press('Enter');
}
