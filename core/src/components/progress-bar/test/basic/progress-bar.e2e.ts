import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/progress-bar/test/basic', config);

      await page.setIonViewport();

      const content = page.locator('ion-content');

      await expect(content).toHaveScreenshot(screenshot(`progress-bar-basic`));
    });
  });
});
