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

    test('should toggle the input type when pressed', async ({ page }) => {
      await page.setContent(
        `
            <ion-input value="abc" type="password" clear-input="true" show-password-toggle="true"></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input'); 
      const nativeInput = page.locator('.native-input');
      const toggle = input.locator('.input-password-toggle');

      await toggle.click();
      await page.waitForChanges();

      await expect(nativeInput).toHaveAttribute('type', 'text');

      await toggle.click();
      await page.waitForChanges();

      await expect(nativeInput).toHaveAttribute('type', 'password');
    });

    test('should change icon when using showPasswordIcon and hidePasswordIcon props', async ({ page }) => {
      await page.setContent(
        `
            <ion-input 
              value="abc" 
              type="password" 
              clear-input="true" 
              show-password-toggle="true"
              show-password-icon="bus"
              hide-password-icon="cafe"
            ></ion-input>
        `,
        config
      );

      const input = page.locator('ion-input'); 
      const toggle = input.locator('.input-password-toggle');
      const icon = toggle.locator("ion-icon");

      await expect(icon).toHaveJSProperty('icon', 'bus');

      await toggle.click();
      await page.waitForChanges();

      await expect(icon).toHaveJSProperty('icon', 'cafe');
    });
  });
});

