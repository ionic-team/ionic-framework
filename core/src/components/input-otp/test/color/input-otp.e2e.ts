import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const VALID_FILLS = ['outline', 'solid'];

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: color'), () => {
    // Test all colors with all fills
    VALID_FILLS.forEach((fill) => {
      test(`color with ${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <div id="container">
            <ion-input-otp color="primary" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="secondary" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="tertiary" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="success" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="warning" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="danger" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="light" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="medium" fill="${fill}" value="12"></ion-input-otp>
            <ion-input-otp color="dark" fill="${fill}" value="12"></ion-input-otp>
          </div>
          `,
          config
        );

        const container = page.locator('#container');
        // Set viewport size to ensure the entire height is visible
        await page.setViewportSize({ width: 393, height: 900 });
        await expect(container).toHaveScreenshot(screenshot(`input-otp-color-${fill}`));
      });
      test(`disabled color with ${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `npx
          <div id="container">
            <ion-input-otp color="primary" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="secondary" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="tertiary" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="success" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="warning" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="danger" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="light" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="medium" fill="${fill}" value="12" disabled></ion-input-otp>
            <ion-input-otp color="dark" fill="${fill}" value="12" disabled></ion-input-otp>
          </div>
          `,
          config
        );

        const container = page.locator('#container');
        // Set viewport size to ensure the entire height is visible
        await page.setViewportSize({ width: 393, height: 900 });
        await expect(container).toHaveScreenshot(screenshot(`input-otp-color-${fill}-disabled`));
      });
      test(`readonly color with ${fill} fill should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <div id="container">
            <ion-input-otp color="primary" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="secondary" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="tertiary" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="success" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="warning" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="danger" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="light" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="medium" fill="${fill}" value="12" readonly></ion-input-otp>
            <ion-input-otp color="dark" fill="${fill}" value="12" readonly></ion-input-otp>
          </div>
          `,
          config
        );

        const container = page.locator('#container');
        // Set viewport size to ensure the entire height is visible
        await page.setViewportSize({ width: 393, height: 900 });
        await expect(container).toHaveScreenshot(screenshot(`input-otp-color-${fill}-readonly`));
      });
    });
  });
});
