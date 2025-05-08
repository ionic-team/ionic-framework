import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: shape'), () => {
    // Test all shapes with all sizes
    ['rectangular', 'round', 'soft'].forEach((shape) => {
      ['small', 'medium', 'large'].forEach((size) => {
        test(`${shape} shape with ${size} size should not have visual regressions`, async ({ page }) => {
          await page.setContent(
            `
            <ion-input-otp shape="${shape}" size="${size}" value="12">Description</ion-input-otp>
          `,
            config
          );

          const inputOtp = page.locator('ion-input-otp');
          await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${shape}-${size}`));
        });
      });
    });
  });
});
