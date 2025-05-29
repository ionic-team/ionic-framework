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
