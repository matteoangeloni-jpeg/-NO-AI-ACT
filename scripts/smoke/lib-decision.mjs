/** Complete the four decision steps, waiting for each rebuilt view. */
export async function completeDecisionWithKeyboard(page, keys = ['1', '1', '2', '2']) {
  const properties = ['classification', 'measure', 'subject', 'motivation'];
  if (keys.length !== properties.length) throw new Error('A decision run requires four choices.');

  await page.waitForFunction(() => {
    const scene = window.game?.scene?.getScene('Decision');
    return scene?.scene?.isActive?.() && !!document.querySelector('#reading-layer h2')?.textContent;
  }, undefined, { timeout: 20000 });

  for (let index = 0; index < properties.length; index += 1) {
    const previousStep = await page.evaluate(() => document.querySelector('#reading-layer h2')?.textContent ?? '');
    await page.keyboard.press(keys[index]);
    await page.waitForFunction(
      ({ property, oldStep }) => {
        const scene = window.game?.scene?.getScene('Decision');
        const step = document.querySelector('#reading-layer h2')?.textContent;
        return scene?.scene?.isActive?.()
          && scene[property] !== null
          && !!step
          && step !== oldStep;
      },
      { property: properties[index], oldStep: previousStep },
      { timeout: 20000 }
    );
    await page.waitForTimeout(200);
  }
}
