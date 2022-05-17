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
  test('should not have visual regressions', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.mode !== 'md', 'Ripple effect is only available in md mode');

    await page.setContent(`
      <ion-button>Button</ion-button>
      <ion-button id="rippleBtn">Button with Ripple</ion-button>
    `);

    const button = page.locator('#rippleBtn');
    const boundingBox = await button.boundingBox();

    if (boundingBox) {
      await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    }

    await page.mouse.down();
    await page.waitForTimeout(100);

    expect(await page.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `button-ripple-effect-${page.getSnapshotSettings()}.png`
    );
  });
});
