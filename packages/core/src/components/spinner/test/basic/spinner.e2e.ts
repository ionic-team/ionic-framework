import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('spinner: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/spinner/test/basic', config);
    });
    test.describe('spinner: visual regression tests', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setIonViewport();

        await expect(page).toHaveScreenshot(screenshot(`spinner-basic-diff`));
      });
    });
  });
});
