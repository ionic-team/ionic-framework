import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('icon: rtl'), () => {
    test('should flip icon when rtl is active', async ({ page }) => {
      await page.setContent(
        `
        <ion-icon name="cut" flip-rtl="true"></ion-icon>
      `,
        config
      );

      const icon = page.locator('ion-icon');
      await expect(icon).toHaveScreenshot(screenshot(`icon-flip`));
    });
    test('should not flip icon when rtl is active', async ({ page }) => {
      await page.setContent(
        `
        <ion-icon name="cut" flip-rtl="false"></ion-icon>
      `,
        config
      );

      const icon = page.locator('ion-icon');
      await expect(icon).toHaveScreenshot(screenshot(`icon-no-flip`));
    });
  });
});
