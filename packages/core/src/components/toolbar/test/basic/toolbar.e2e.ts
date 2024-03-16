import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toolbar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/toolbar/test/basic`, config);

      // capture both header toolbars at once, but don't include all the white space in the ion-content
      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`toolbar-basic`));
    });
  });
});
