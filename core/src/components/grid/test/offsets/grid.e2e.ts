import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: offsets'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/grid/test/offsets`, config);

      await page.setIonViewport();

      const grids = page.locator('#grids');

      await expect(grids).toHaveScreenshot(screenshot('grid-offsets'));
    });
  });
});
