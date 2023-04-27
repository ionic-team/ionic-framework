import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('back-button: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/back-button/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`back-button-basic`));
    });
  });
});
