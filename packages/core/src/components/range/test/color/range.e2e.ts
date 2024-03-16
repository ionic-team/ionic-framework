import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: color'), () => {
    test('should apply color', async ({ page }) => {
      await page.setContent(
        `
        <ion-range color="danger" value="50">
          <ion-icon name="volume-off" slot="start"></ion-icon>
          <ion-icon name="volume-high" slot="end"></ion-icon>
          <span slot="label">Volume</span>
        </ion-range>
      `,
        config
      );

      const range = page.locator('ion-range');
      await expect(range).toHaveScreenshot(screenshot(`range-color`));
    });
  });
});
