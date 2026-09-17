/** Select one open case using the CityMap scene's real keyboard controls. */
export async function selectMapCaseWithKeyboard(page, caseId) {
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
      { timeout: 5000 }
    );
    await page.waitForTimeout(250);
    current = await page.evaluate(() => window.game?.scene?.getScene('CityMap')?.keyIndex ?? -1);
  }
  if (current !== mapState.target) {
    throw new Error(`Could not select map case after ${mapState.count * 3} moves: ${caseId}`);
  }
  await page.keyboard.press('Enter');
}
