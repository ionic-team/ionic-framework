import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio'), () => {
    test('should render multiple correctly', async ({ page }) => {
      await page.setContent(
        `
        <style>
          /* The radio checks are cut off without a container margin */
          #container {
            margin-top: 20px;
            margin-bottom: 20px;
          }
        </style>

        <div id="container">
          <ion-radio-group>
            <ion-radio>Enable Notifications</ion-radio><br />
            <ion-radio>Enable Notifications</ion-radio>
          </ion-radio-group>
        </div>
      `,
        config
      );
      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`radio-multiple`));
    });
  });
});
