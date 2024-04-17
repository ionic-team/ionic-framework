import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('picker-column-option: rendering'), () => {
    test('picker option should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-column-option value="option">My Option</ion-picker-column-option>
      `,
        config
      );

      const option = page.locator('ion-picker-column-option');

      await expect(option).toHaveScreenshot(screenshot('picker-column-option'));
    });
    test('disabled picker option should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-column-option disabled="true" value="option">My Option</ion-picker-column-option>
      `,
        config
      );

      const option = page.locator('ion-picker-column-option');

      await expect(option).toHaveScreenshot(screenshot('disabled-picker-column-option'));
    });
    test('active picker option should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-column-option class="option-active" value="option">My Option</ion-picker-column-option>
      `,
        config
      );

      const option = page.locator('ion-picker-column-option');

      await expect(option).toHaveScreenshot(screenshot('active-picker-column-option'));
    });
    test('disabled active picker option should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-picker-column-option class="option-active" disabled="true" value="option">My Option</ion-picker-column-option>
      `,
        config
      );

      const option = page.locator('ion-picker-column-option');

      await expect(option).toHaveScreenshot(screenshot('disabled-active-picker-column-option'));
    });
  });
});
