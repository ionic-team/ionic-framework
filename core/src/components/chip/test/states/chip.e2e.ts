import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: states'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/chip/test/states', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`chip-states`));
    });
  });
});
