import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: color'), () => {
    test('should apply color when checked', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle color="danger" checked="true">Label</ion-toggle>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-color-checked`));
    });

    test('should not apply color when unchecked', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle color="danger">Label</ion-toggle>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-color-unchecked`));
    });
  });
});
