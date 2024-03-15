import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: password toggle button'), () => {
    test('should render password icon when show-password-toggle', async ({ page }) => {
      await page.setContent(
        `
            <ion-input value="abc" type="password" clear-input="true" show-password-toggle="true"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      await expect(input).toHaveScreenshot(screenshot(`input-with-password-toggle`));
    });
  });
});
