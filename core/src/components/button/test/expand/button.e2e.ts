import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: expand'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/expand`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-expand`));
    });
  });
});
