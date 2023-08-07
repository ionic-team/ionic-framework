import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-divider: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item-divider>
          <ion-label>Item Divider</ion-label>
        </ion-item-divider>
      `,
        config
      );

      const itemDivider = page.locator('ion-item-divider');

      await expect(itemDivider).toHaveScreenshot(screenshot(`item-divider-scale`));
    });
  });
});
