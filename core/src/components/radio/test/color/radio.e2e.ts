import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: color'), () => {
    test('should apply color when checked', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio color="danger" value="1">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-color-checked`));
    });

    test('should not apply color when unchecked', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group>
          <ion-radio color="danger" value="1">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveScreenshot(screenshot(`radio-color-unchecked`));
    });
  });
});
