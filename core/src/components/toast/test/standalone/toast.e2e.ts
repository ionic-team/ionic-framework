import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This test does not check LTR vs RTL layouts
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toast: standalone'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/toast/test/standalone`, config);
    });
    test('should not have visual regressions', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      const basicButton = page.locator('#basic-toast');
      await basicButton.click();

      await ionToastDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`toast-standalone`));
    });
  });
});
