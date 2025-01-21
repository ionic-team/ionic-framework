import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-checkbox>Label</ion-checkbox>`, config);

      const bottomEl = page.locator('ion-checkbox .checkbox-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const helperText = page.locator('ion-checkbox .helper-text');
      const errorText = page.locator('ion-checkbox .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('input should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const input = page.locator('ion-checkbox input[type=checkbox]');
      const helperText = page.locator('ion-checkbox .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when checkbox is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const helperText = page.locator('ion-checkbox .helper-text');
      const errorText = page.locator('ion-checkbox .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('input should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const input = page.locator('ion-checkbox input[type=checkbox]');
      const errorText = page.locator('ion-checkbox .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('input should have aria-invalid attribute when input is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const input = page.locator('ion-checkbox input[type=checkbox]');

      await expect(input).toHaveAttribute('aria-invalid');
    });
    test('input should not have aria-invalid attribute when input is valid', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const input = page.locator('ion-checkbox input[type=checkbox]');

      await expect(input).not.toHaveAttribute('aria-invalid');
    });
    test('input should not have aria-describedby attribute when no hint or error text is present', async ({ page }) => {
      await page.setContent(`<ion-checkbox>Label</ion-checkbox>`, config);

      const input = page.locator('ion-checkbox input[type=checkbox]');

      await expect(input).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: helper text rendering'), () => {
    test('should not have visual regressions when rendering helper text', async ({ page }) => {
      await page.setContent(`<ion-checkbox helper-text="Helper text">Label</ion-checkbox>`, config);

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-helper`));
    });
    test('should not have visual regressions when rendering helper text with wrapping text', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-helper-wrapping`));
    });
    test('should not have visual regressions when rendering helper text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox label-placement="stacked" helper-text="Helper text">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-helper-label-stacked`));
    });
    test('should not have visual regressions when rendering helper text with a stacked label and wrapping text', async ({
      page,
    }) => {
      await page.setContent(
        `<ion-checkbox label-placement="stacked" helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-helper-label-stacked-wrapping`));
    });
  });

  test.describe(title('checkbox: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" error-text="Helper text">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-error`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" error-text="Helper text" label-placement="stacked">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-bottom-content-error-label-stacked`));
    });
    test('should not have visual regressions when rendering error text with a custom color', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-checkbox.custom-checkbox {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-checkbox class="ion-invalid ion-touched custom-checkbox" error-text="Error text">Label</ion-checkbox>
      `,
        config
      );

      const errorText = page.locator('ion-checkbox');
      await expect(errorText).toHaveScreenshot(screenshot(`checkbox-bottom-content-error-custom`));
    });
  });
});
