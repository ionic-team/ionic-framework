import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: a11y', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'iOS mode does not display hover/active/focus styles.');

    await page.setContent(
      `<ion-app>
        <ion-content>
          <ion-range min="0" max="100" value="80" legacy="true"></ion-range>
        </ion-content>
      </ion-app>
        `
    );

    const range = page.locator('ion-range');
    const rangeHandle = range.locator('.range-knob-handle');

    await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
    await page.waitForChanges();

    expect(await range.screenshot()).toMatchSnapshot(`range-focus-${page.getSnapshotSettings()}.png`);

    const box = (await rangeHandle.boundingBox())!;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.waitForChanges();

    expect(await range.screenshot()).toMatchSnapshot(`range-active-${page.getSnapshotSettings()}.png`);
  });

  test.describe('with pin', () => {
    test('should not have visual regressions', async ({ page, skip }) => {
      skip.rtl();

      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="50" pin="true" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
        `
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      expect(await range.screenshot()).toMatchSnapshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);
    });
  });
});
