import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: a11y', () => {
  test('should not have accessibility violations', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');

    await page.goto(`/src/components/range/test/a11y`);

    /**
     * Axe does not take <slot> elements into account
     * when checking color-contrast. As a result, it will
     * incorrectly report color-contrast issues: https://github.com/dequelabs/axe-core/issues/3329
     */
    const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
    expect(results.violations).toEqual([]);
  });

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

    await expect(range).toHaveScreenshot(`range-focus-${page.getSnapshotSettings()}.png`);

    const box = (await rangeHandle.boundingBox())!;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.waitForChanges();

    await expect(range).toHaveScreenshot(`range-active-${page.getSnapshotSettings()}.png`);
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

      await expect(range).toHaveScreenshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);
    });
  });
});
