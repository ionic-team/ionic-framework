import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: offsets'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/offsets`, config);

      await page.setIonViewport();
    });

    test('should not have visual regressions for offset', async ({ page }) => {
      const offset = page.locator('#offset-1');

      await expect(offset).toHaveScreenshot(screenshot('grid-offsets-offset'));
    });

    test('should not have visual regressions for order', async ({ page }) => {
      const order = page.locator('#order');

      await expect(order).toHaveScreenshot(screenshot('grid-offsets-order'));
    });

    test('should not have visual regressions for a larger offset', async ({ page }) => {
      const offset = page.locator('#offset-2');

      await expect(offset).toHaveScreenshot(screenshot('grid-offsets-larger-offset'));
    });

    test('should not have visual regressions for dynamic offset', async ({ page }) => {
      const dynamicOffset = page.locator('#dynamic-offset');

      await expect(dynamicOffset).toHaveScreenshot(screenshot('grid-offsets-dynamic-offset'));
    });
  });
});
