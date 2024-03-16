import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: spec'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/input/test/legacy/spec', config);
    });

    test('should not have visual regressions', async ({ page }) => {
      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`input-spec-diff`));
    });
  });
});
