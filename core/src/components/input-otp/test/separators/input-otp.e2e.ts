import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: separators'), () => {
    // Test separators with all sizes
    ['small', 'medium', 'large'].forEach((size) => {
      test(`one separator with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" separators="1">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-one-${size}`));
      });

      test(`two separators with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" length="6" separators="2,4">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-two-${size}`));
      });

      test(`all separators with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" separators="all">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-all-${size}`));
      });
    });
  });
});
