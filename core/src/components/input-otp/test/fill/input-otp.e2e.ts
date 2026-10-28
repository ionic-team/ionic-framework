import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const VALID_FILLS = ['outline', 'solid'];

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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

/**
 * The fill defaults differ between modes but not directions.
 * These check computed colors since the value that wins is what's under test.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: fill border color'), () => {
    VALID_FILLS.forEach((fill) => {
      test(`${fill} fill should use a --border-color set on the host`, async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
        });

        await page.setContent(
          `
          <style>
            ion-input-otp.custom-border {
              --border-color: rgb(255, 0, 0);
            }
          </style>
          <ion-input-otp class="custom-border" fill="${fill}"></ion-input-otp>
        `,
          config
        );

        const input = page.locator('ion-input-otp input').first();
        await expect(input).toHaveCSS('border-top-color', 'rgb(255, 0, 0)');
      });

      test(`${fill} fill should not inherit --border-color from an ancestor`, async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
        });

        await page.setContent(
          `
          <ion-input-otp id="reference" fill="${fill}"></ion-input-otp>
          <div style="--border-color: rgb(255, 0, 0)">
            <ion-input-otp id="nested" fill="${fill}"></ion-input-otp>
          </div>
        `,
          config
        );

        const referenceColor = await page
          .locator('#reference input')
          .first()
          .evaluate((el) => getComputedStyle(el).borderTopColor);
        await expect(page.locator('#nested input').first()).toHaveCSS('border-top-color', referenceColor);
      });
    });
  });
});
