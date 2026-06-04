import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: sizes'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/sizes`, config);

      await page.setIonViewport();
    });

    test('should not have visual regressions for a 10 column layout', async ({ page }) => {
      const grid = page.locator('#ten-column-layout');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-ten-column-layout'));
    });

    test('should not have visual regressions for responsive sm columns', async ({ page }) => {
      const grid = page.locator('#responsive-sm');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-responsive-sm'));
    });

    test('should not have visual regressions for auto sized columns', async ({ page }) => {
      const grid = page.locator('#size-auto');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-size-auto'));
    });

    test('should not have visual regressions for breakpoint sizes', async ({ page }) => {
      const breakpointSizes = page.locator('#breakpoint-sizes');

      await expect(breakpointSizes).toHaveScreenshot(screenshot('grid-sizes-breakpoint-sizes'));
    });
  });
});
