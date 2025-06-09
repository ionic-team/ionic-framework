import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const VALID_SIZES = ['small', 'medium', 'large'];

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: size'), () => {
    VALID_SIZES.forEach((size) => {
      test(`${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${size}`));
      });
      test(`${size} size should collapse width when viewport is too narrow`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" length="8" value="12" separators="all">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${size}-collapsed`));
      });
    });
  });
});
