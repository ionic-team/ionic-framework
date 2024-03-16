import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('menu-button: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/menu-button/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`menu-button-diff`));
    });
  });
});
