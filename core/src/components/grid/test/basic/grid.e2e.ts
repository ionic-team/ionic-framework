import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/basic`, config);

      await page.setIonViewport();
    });

    test('should not have visual regressions for default columns', async ({ page }) => {
      const grid = page.locator('#default-columns');

      await expect(grid).toHaveScreenshot(screenshot('grid-basic'));
    });

    test('should not have visual regressions for custom columns', async ({ page }) => {
      const grid = page.locator('#custom-columns');

      await expect(grid).toHaveScreenshot(screenshot('grid-custom-columns'));
    });
  });
});
