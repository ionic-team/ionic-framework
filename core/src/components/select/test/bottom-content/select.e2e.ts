import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('Select: Helper and Error Text'), () => {
    test.describe('Select with helper text', () => {
      test('should set label and show helper text', async ({ page }) => {
        await page.setContent(
          `
          <ion-select class="ion-touched ion-valid" helper-text="Select a fruit" value="apple">
              <div slot="label">Favorite Fruit</div>
              <ion-select-option value="apple">Apple</ion-select-option>
              <ion-select-option value="bananna">Bananna</ion-select-option>
            </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-helper-text`));
      });
    });
    test.describe('Select with Error text', () => {
      test('should set label and show error text', async ({ page }) => {
        await page.setContent(
          `
          <ion-select class="ion-touched ion-invalid" error-text="No fruit selected">
              <div slot="label">Favorite Fruit</div>
              <ion-select-option value="apple">Apple</ion-select-option>
              <ion-select-option value="bananna">Bananna</ion-select-option>
            </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select');
        await expect(select).toHaveScreenshot(screenshot(`select-error-text`));
      });
    });
  });
});
