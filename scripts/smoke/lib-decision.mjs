/** Complete the four decision steps, waiting for each rebuilt view. */
export async function completeDecisionWithKeyboard(page, keys = ['1', '1', '2', '2']) {
  const properties = ['classification', 'measure', 'subject', 'motivation'];
  if (keys.length !== properties.length) throw new Error('A decision run requires four choices.');

  for (let index = 0; index < properties.length; index += 1) {
    const previousStep = await page.evaluate(() => window.game?.scene?.getScene('Decision')?.lastStep?.label ?? '');
    await page.keyboard.press(keys[index]);
    await page.waitForFunction(
      ({ property, oldStep }) => {
        const scene = window.game?.scene?.getScene('Decision');
        return scene?.scene?.isActive?.()
          && scene[property] !== null
          && !!scene.lastStep?.label
          && scene.lastStep.label !== oldStep;
      },
      { property: properties[index], oldStep: previousStep },
      { timeout: 12000 }
    );
    await page.waitForTimeout(200);
  }
}
