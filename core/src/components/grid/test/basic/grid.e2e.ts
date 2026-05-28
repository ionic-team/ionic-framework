import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/grid/test/basic`, config);

      await page.setIonViewport();

      const grid = page.locator('ion-grid');

      await expect(grid).toHaveScreenshot(screenshot(`grid-basic`));
    });
  });
});
