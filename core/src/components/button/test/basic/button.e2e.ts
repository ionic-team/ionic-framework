import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`button-diff-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('button: ripple effect', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.mode('ios', 'Ripple effect is only available in MD mode.');

    await page.goto(`/src/components/button/test/basic?ionic:_testing=false`);

    const button = page.locator('#default');

    await button.scrollIntoViewIfNeeded();

    const boundingBox = await button.boundingBox();

    if (boundingBox) {
      await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
      await page.mouse.down();
    }

    await page.waitForSelector('#default.ion-activated');

    expect(await button.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `button-ripple-effect-${page.getSnapshotSettings()}.png`
    );
  });
});
