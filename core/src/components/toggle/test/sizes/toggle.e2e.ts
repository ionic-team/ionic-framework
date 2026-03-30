import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: sizes'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toggle/test/sizes`, config);

      await page.setIonViewport();

      const content = page.locator('ion-content');

      await expect(content).toHaveScreenshot(screenshot(`toggle-sizes-diff`));
    });
  });
});
