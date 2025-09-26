import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: helper text rendering'), () => {
    test('should not have visual regressions when rendering helper text with no description', async ({ page }) => {
      await page.setContent(`<ion-input-otp helper-text="Helper text"></ion-input-otp>`, config);

      const bottomEl = page.locator('ion-input-otp');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-otp-helper-text-no-description`));
    });
    test('should not have visual regressions when rendering helper text with description', async ({ page }) => {
      await page.setContent(`<ion-input-otp helper-text="Helper text">Description</ion-input-otp>`, config);

      const bottomEl = page.locator('ion-input-otp');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-otp-helper-text-description`));
    });
  });

  test.describe(title('input: error text rendering'), () => {
    test('should not have visual regressions when rendering error text with no description', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" error-text="Error text"></ion-input-otp>`,
        config
      );

      const bottomEl = page.locator('ion-input-otp');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-otp-error-text-no-description`));
    });
    test('should not have visual regressions when rendering error text with description', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const bottomEl = page.locator('ion-input-otp');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-otp-error-text-description`));
    });
  });
});

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-input-otp> Description </ion-input-otp>`, config);

      const bottomEl = page.locator('ion-input-otp .input-otp-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const helperText = page.locator('ion-input-otp .helper-text');
      const errorText = page.locator('ion-input-otp .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('input-otp should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const inputOtpGroup = page.locator('ion-input-otp [role="group"]');
      const helperText = page.locator('ion-input-otp .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await inputOtpGroup.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when input-otp is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const helperText = page.locator('ion-input-otp .helper-text');
      const errorText = page.locator('ion-input-otp .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('input-otp should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const inputOtpGroup = page.locator('ion-input-otp [role="group"]');
      const errorText = page.locator('ion-input-otp .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await inputOtpGroup.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('input-otp should have aria-invalid attribute when input-otp is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const inputOtpGroup = page.locator('ion-input-otp [role="group"]');

      await expect(inputOtpGroup).toHaveAttribute('aria-invalid');
    });
    test('input-otp should not have aria-invalid attribute when input-otp is valid', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp helper-text="Helper text" error-text="Error text">Description</ion-input-otp>`,
        config
      );

      const inputOtpGroup = page.locator('ion-input-otp [role="group"]');

      await expect(inputOtpGroup).not.toHaveAttribute('aria-invalid');
    });
    test('input-otp should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const inputOtpGroup = page.locator('ion-input-otp [role="group"]');

      await expect(inputOtpGroup).not.toHaveAttribute('aria-describedby');
    });
  });
});
