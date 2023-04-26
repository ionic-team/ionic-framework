import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('button: outline'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/outline`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-outline`));
    });
  });
});
