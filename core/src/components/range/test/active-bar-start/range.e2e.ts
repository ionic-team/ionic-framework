import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('range: activeBarStart'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/range/test/active-bar-start`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`range-activeBarStart-diff`));
    });
  });
});
