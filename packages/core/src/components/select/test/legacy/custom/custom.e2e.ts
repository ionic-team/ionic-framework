import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('select: custom'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/select/test/legacy/custom`, config);

      await expect(page).toHaveScreenshot(screenshot(`select-custom-diff`));
    });
  });
});
