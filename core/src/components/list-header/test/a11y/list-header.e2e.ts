import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('list-header: font scaling'), () => {
    test('should scale default list-header text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-list-header>
          <ion-label>Default</ion-label>
        </ion-list-header>
      `,
        config
      );

      const listHeader = page.locator('ion-list-header');

      await expect(listHeader).toHaveScreenshot(screenshot(`list-header-default-scale`));
    });
  });
});
