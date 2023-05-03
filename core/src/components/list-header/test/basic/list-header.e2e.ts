import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('list-header: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/list-header/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`list-header`));
    });
  });
});
