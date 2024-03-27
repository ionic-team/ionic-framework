import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input password toggle: states'), () => {
    test('should be hidden when inside of a readonly input', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label="input" type="password" readonly="true">
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        `,
        config
      );

      const inputPasswordToggle = page.locator('ion-input-password-toggle');
      await expect(inputPasswordToggle).toBeHidden();
    });
    test('should be hidden when inside of a disabled input', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label="input" type="password" disabled="true">
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        `,
        config
      );

      const inputPasswordToggle = page.locator('ion-input-password-toggle');
      await expect(inputPasswordToggle).toBeHidden();
    });
  });

  test.describe(title('input password toggle: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <ion-input label="input" type="password">
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        `,
        config
      );

      const inputPasswordToggle = page.locator('ion-input-password-toggle');

      await expect(inputPasswordToggle).toHaveScreenshot(screenshot('input-password-toggle'));
    });
  });
});
