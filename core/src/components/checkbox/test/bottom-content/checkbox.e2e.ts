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
    test('checkbox should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      const helperText = page.locator('ion-checkbox .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await checkbox.getAttribute('aria-describedby');

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

    test('checkbox should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      const errorText = page.locator('ion-checkbox .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await checkbox.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('checkbox should have aria-invalid attribute when checkbox is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const checkbox = page.locator('ion-checkbox');

      await expect(checkbox).toHaveAttribute('aria-invalid');
    });
    test('checkbox should not have aria-invalid attribute when checkbox is valid', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox helper-text="Helper text" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const checkbox = page.locator('ion-checkbox');

      await expect(checkbox).not.toHaveAttribute('aria-invalid');
    });
    test('checkbox should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(`<ion-checkbox>Label</ion-checkbox>`, config);

      const checkbox = page.locator('ion-checkbox');

      await expect(checkbox).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: helper text rendering'), () => {
    // Check the default label placement, end, and stacked
    [undefined, 'end', 'stacked'].forEach((labelPlacement) => {
      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text`, async ({ page }) => {
        await page.setContent(
          `<ion-checkbox ${
            labelPlacement ? `label-placement="${labelPlacement}"` : ''
          } helper-text="Helper text">Label</ion-checkbox>`,
          config
        );

        const bottomEl = page.locator('ion-checkbox');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`checkbox-helper-text${labelPlacement ? `-${labelPlacement}` : ''}`)
        );
      });

      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text with wrapping text`, async ({ page }) => {
        await page.setContent(
          `<ion-checkbox ${
            labelPlacement ? `label-placement="${labelPlacement}"` : ''
          } helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text">Label</ion-checkbox>`,
          config
        );

        const bottomEl = page.locator('ion-checkbox');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`checkbox-helper-text${labelPlacement ? `-${labelPlacement}` : ''}-wrapping`)
        );
      });
    });
  });

  test.describe(title('checkbox: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" error-text="Error text">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-checkbox class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked">Label</ion-checkbox>`,
        config
      );

      const bottomEl = page.locator('ion-checkbox');
      await expect(bottomEl).toHaveScreenshot(screenshot(`checkbox-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-checkbox::part(supporting-text) {
            font-size: 20px;
          }

          ion-checkbox::part(helper-text) {
            color: green;
          }
        </style>
        <ion-checkbox helper-text="Helper text">Label</ion-checkbox>
      `,
        config
      );

      const helperText = page.locator('ion-checkbox');
      await expect(helperText).toHaveScreenshot(screenshot(`checkbox-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-checkbox::part(supporting-text) {
            font-size: 20px;
          }

          ion-checkbox::part(error-text) {
            color: purple;
          }
        </style>
        <ion-checkbox class="ion-invalid ion-touched" error-text="Error text">Label</ion-checkbox>
      `,
        config
      );

      const errorText = page.locator('ion-checkbox');
      await expect(errorText).toHaveScreenshot(screenshot(`checkbox-error-text-custom-css`));
    });
  });
});
