import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/button/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`button-diff-${page.getSnapshotSettings()}.png`);
  });
  test('should correctly set fill to undefined', async ({ page, skip }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25886',
    });
    skip.rtl();
    skip.mode('ios', 'This behavior does not differ across modes');
    await page.setContent(`
      <ion-button fill="outline"></ion-button>
    `);

    const button = page.locator('ion-button');
    await expect(button).toHaveClass(/button-outline/);

    await button.evaluate((el: HTMLIonButtonElement) => (el.fill = undefined));
    await page.waitForChanges();

    await expect(button).toHaveClass(/button-solid/);
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
