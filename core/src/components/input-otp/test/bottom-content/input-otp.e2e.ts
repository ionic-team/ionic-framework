import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The hint text styles are the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: hint text rendering'), () => {
    test('should not have visual regressions when rendering helper text with a description', async ({ page }) => {
      await page.setContent(`<ion-input-otp helper-text="Helper text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-helper-text-description`));
    });

    test('should not have visual regressions when rendering helper text with wrapping text', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp style="width: 250px" helper-text="Enter the code we sent to your email address to continue"></ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-helper-text-wrapping`));
    });

    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-error-text`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: hint text customization'), () => {
    test('should not have visual regressions when rendering error text with a custom css variable', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp.custom-input-otp {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-input-otp class="ion-invalid ion-touched custom-input-otp" error-text="Error text"></ion-input-otp>
      `,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-error-text-custom-css-var`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: hint text functionality'), () => {
    test('should switch every input between helper and error text as the validation classes change', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(
        `<ion-input-otp length="3" helper-text="Check your email" error-text="Wrong code"></ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');
      const helperTextId = await page.locator('ion-input-otp .helper-text').getAttribute('id');
      const errorTextId = await page.locator('ion-input-otp .error-text').getAttribute('id');

      await inputOtp.evaluate((el) => el.classList.add('ion-touched', 'ion-invalid'));

      for (const input of await inputBoxes.all()) {
        await expect(input).toHaveAttribute('aria-describedby', errorTextId!);
        await expect(input).toHaveAttribute('aria-invalid', 'true');
      }
      await expect(page.locator('ion-input-otp .error-text')).toHaveText('Wrong code');

      await inputOtp.evaluate((el) => el.classList.remove('ion-invalid'));

      for (const input of await inputBoxes.all()) {
        await expect(input).toHaveAttribute('aria-describedby', helperTextId!);
        await expect(input).not.toHaveAttribute('aria-invalid');
      }
      await expect(page.locator('ion-input-otp .helper-text')).toHaveText('Check your email');
    });
  });
});
