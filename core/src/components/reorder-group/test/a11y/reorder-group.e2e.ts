import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('reorder-group: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-reorder-group disabled="false">
          <ion-item>
            <ion-label>Default Reorder</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>

          <ion-item>
            <ion-label>Custom Icon</ion-label>
            <ion-reorder slot="end">
              <ion-icon name="pizza"></ion-icon>
            </ion-reorder>
          </ion-item>
        </ion-reorder-group>
      `,
        config
      );

      const reorderGroup = page.locator('ion-reorder-group');

      await expect(reorderGroup).toHaveScreenshot(screenshot(`reorder-group-scale`));
    });
  });
});
