import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, config, screenshot }) => {
  test.describe(title('button: clear'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/button/test/clear`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-clear`));
    });
  });
});
