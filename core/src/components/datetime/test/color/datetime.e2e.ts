import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: color'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/color', config);

      const datetime = page.locator('#colorDatetime');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-color`));

      await page.evaluate(() => document.body.classList.toggle('dark'));
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-color-dark`));
    });
    test('should be able to customize datetime using css parts', async ({ page }) => {
      await page.goto('/src/components/datetime/test/color', config);

      const datetime = page.locator('#customDatetime');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-css-parts`));
    });
  });
});
