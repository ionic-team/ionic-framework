import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes
 */
configs().forEach(({ title, config }) => {
  test.describe(title('input-otp: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-input-otp></ion-input-otp>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should render with correct aria attributes on initial load', async ({ page }) => {
      await page.setContent(`<ion-input-otp></ion-input-otp>`, config);

      const inputOtpGroup = page.locator('ion-input-otp .input-otp-group');
      await expect(inputOtpGroup).toHaveAttribute('aria-label', 'One-time password input');

      const inputBoxes = page.locator('ion-input-otp input');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('should update aria-hidden when value is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12"></ion-input-otp>`, config);

      const inputBoxes = page.locator('ion-input-otp input');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('should update aria-hidden when length increases', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31484',
      });

      await page.setContent(`<ion-input-otp length="2"></ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.length = 4;
      });

      const inputBoxes = page.locator('ion-input-otp input');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('should update aria-hidden when typing a value', async ({ page }) => {
      await page.setContent(`<ion-input-otp></ion-input-otp>`, config);

      const inputBoxes = page.locator('ion-input-otp input');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('123');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'false');
    });

    test('should update aria-hidden when value is cleared using backspace', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12"></ion-input-otp>`, config);

      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'true');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('should update aria-hidden when value is set after initialization', async ({ page }) => {
      await page.setContent(`<ion-input-otp></ion-input-otp>`, config);

      await page.evaluate(() => {
        const inputOtp = document.querySelector('ion-input-otp');
        if (inputOtp) {
          inputOtp.value = '12';
        }
      });

      const inputBoxes = page.locator('ion-input-otp input');

      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(2)).toHaveAttribute('aria-hidden', 'false');
      await expect(inputBoxes.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('should update aria-label and aria-labelledby when set on host', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp aria-label="Custom label" aria-labelledby="my-label"></ion-input-otp>`,
        config
      );

      const inputOtpGroup = page.locator('ion-input-otp .input-otp-group');
      await expect(inputOtpGroup).toHaveAttribute('aria-label', 'Custom label');
      await expect(inputOtpGroup).toHaveAttribute('aria-labelledby', 'my-label');
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: host aria attributes'), () => {
    test('should forward aria-invalid and aria-describedby set on the host after load', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(`<ion-input-otp length="3"></ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await inputOtp.evaluate((el) => {
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', 'server-error');
      });

      for (const input of await inputBoxes.all()) {
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(input).toHaveAttribute('aria-describedby', 'server-error');
      }
    });

    test('should clear aria-invalid and aria-describedby from the inputs when removed from the host', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(
        `<ion-input-otp length="3" aria-invalid="true" aria-describedby="server-error"></ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await inputOtp.evaluate((el) => {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      });

      for (const input of await inputBoxes.all()) {
        await expect(input).not.toHaveAttribute('aria-invalid');
        await expect(input).not.toHaveAttribute('aria-describedby');
      }
    });

    test('should rename the inputs when the host aria-label changes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(`<ion-input-otp length="2" aria-label="PIN"></ion-input-otp>`, config);

      await page.locator('ion-input-otp').evaluate((el) => el.setAttribute('aria-label', 'Code'));

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveAttribute('aria-label', 'Code, 1 of 2');
      await expect(inputBoxes.nth(1)).toHaveAttribute('aria-label', 'Code, 2 of 2');
      await expect(page.locator('ion-input-otp .input-otp-group')).toHaveAttribute('aria-label', 'Code');
    });

    test('should describe the group, not each input, with the slotted description', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(`<ion-input-otp length="2">Didn't get a code?</ion-input-otp>`, config);

      const description = page.locator('ion-input-otp .input-otp-description');
      await expect(description).toBeVisible();
      const descriptionId = await description.getAttribute('id');

      await expect(page.locator('ion-input-otp .input-otp-group')).toHaveAttribute('aria-describedby', descriptionId!);
      for (const input of await page.locator('ion-input-otp input').all()) {
        await expect(input).not.toHaveAttribute('aria-describedby');
      }
    });

    test('should restore the default labels when a host aria-label set after load is removed', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31619',
      });

      await page.setContent(`<ion-input-otp length="2"></ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el) => el.setAttribute('aria-label', 'PIN'));
      await expect(page.locator('ion-input-otp input').nth(0)).toHaveAttribute('aria-label', 'PIN, 1 of 2');

      await inputOtp.evaluate((el) => el.removeAttribute('aria-label'));

      await expect(page.locator('ion-input-otp .input-otp-group')).toHaveAttribute(
        'aria-label',
        'One-time password input'
      );
      await expect(page.locator('ion-input-otp input').nth(0)).toHaveAttribute('aria-label', 'Input 1 of 2');
    });
  });
});
