import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * iOS mode does not display hover/active/focus styles.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: a11y'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="80" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
          `,
        config
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-focus`));

      const box = (await rangeHandle.boundingBox())!;
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-active`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('with pin'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range min="0" max="100" value="50" pin="true" legacy="true"></ion-range>
          </ion-content>
        </ion-app>
        `,
        config
      );

      const range = page.locator('ion-range');
      const rangeHandle = range.locator('.range-knob-handle');

      await rangeHandle.evaluate((el) => el.classList.add('ion-focused'));
      await page.waitForChanges();

      await expect(range).toHaveScreenshot(screenshot(`range-focus-with-pin`));
    });
  });
});
