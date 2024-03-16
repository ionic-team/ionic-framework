import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: states'), () => {
    test('should render readonly input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" readonly="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-readonly`));
    });

    test('should render disabled input correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-input label="Email" value="hi@ionic.io" disabled="true"></ion-input>
      `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-disabled`));
    });
  });
});
