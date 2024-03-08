import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: states'), () => {
    test('should render readonly textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" readonly="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-readonly`));
    });

    test('should render disabled textarea correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-textarea label="Email" value="hi@ionic.io" disabled="true"></ion-textarea>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      await expect(textarea).toHaveScreenshot(screenshot(`textarea-disabled`));
    });
  });
});
