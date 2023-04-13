import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/range/test/a11y`, config);

      /**
       * Axe does not take <slot> elements into account
       * when checking color-contrast. As a result, it will
       * incorrectly report color-contrast issues: https://github.com/dequelabs/axe-core/issues/3329
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });

    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `<ion-app>
          <ion-content>
            <ion-range aria-label="Range" min="0" max="100" value="80"></ion-range>
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
            <ion-range aria-label="Range" min="0" max="100" value="50" pin="true"></ion-range>
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
