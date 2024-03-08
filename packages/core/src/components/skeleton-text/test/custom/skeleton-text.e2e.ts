import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('skeleton-text: custom'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/skeleton-text/test/custom', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`skeleton-text-custom`));
    });
  });
});
