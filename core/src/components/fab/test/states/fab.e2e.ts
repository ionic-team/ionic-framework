import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('fab: states'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/fab/test/states`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`fab-states`));
    });
  });
});
