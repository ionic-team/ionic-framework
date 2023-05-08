import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('spinner: resize'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/spinner/test/resize', config);
    });
    test.describe('spinner: visual regression tests', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setIonViewport();

        await expect(page).toHaveScreenshot(screenshot(`spinner-resize-diff`));
      });
    });
  });
});
