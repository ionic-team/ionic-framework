import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const VALID_FILLS = ['outline', 'solid'];

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: fill'), () => {
    VALID_FILLS.forEach((fill) => {
      test(`${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp fill="${fill}" value="12">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${fill}`));
      });
      test(`disabled ${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp fill="${fill}" value="12" disabled>Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${fill}-disabled`));
      });
      test(`readonly ${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp fill="${fill}" value="12" readonly>Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-${fill}-readonly`));
      });
    });
  });
});
