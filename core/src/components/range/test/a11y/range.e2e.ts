import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('range: a11y', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="80"></ion-range>
          </ion-content>
        </ion-app>
          `,
        config
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
      test(title('should not have visual regressions'), async ({ page }) => {
        await page.setContent(
          `<ion-app>
            <ion-content>
              <ion-range min="0" max="100" value="50" pin="true"></ion-range>
            </ion-content>
          </ion-app>
          `,
          config
        );

        const range = page.locator('ion-range');
        const rangeHandle = range.locator('.range-knob-handle');

        await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
        await page.waitForChanges();

        expect(await range.screenshot()).toMatchSnapshot(`range-focus-with-pin-${page.getSnapshotSettings()}.png`);
      });
    });
  });
});
