import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: toggle password button'), () => {
    test('should toggle the input when pressed', async ({ page }) => {
      await page.setContent(
        `
            <ion-input label="my label" value="abc" show-toggle-password="true" clear-input="true"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input');
      const nativeInput = page.locator('.native-input');
      const togglePasswordButton = input.locator('.input-toggle-password');

      await expect(nativeInput).toHaveAttribute('type', 'password');

      await togglePasswordButton.click();
      await page.waitForChanges();

      await expect(nativeInput).toHaveAttribute('type', 'text');
    });
  });
});
