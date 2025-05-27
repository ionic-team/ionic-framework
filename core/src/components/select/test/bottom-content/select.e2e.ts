import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-select label="Label"></ion-select>`, config);

      const bottomEl = page.locator('ion-select .select-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const helperText = page.locator('ion-select .helper-text');
      const errorText = page.locator('ion-select .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('select should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const select = page.locator('ion-select button');
      const helperText = page.locator('ion-select .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await select.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when select is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const helperText = page.locator('ion-select .helper-text');
      const errorText = page.locator('ion-select .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('select should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const select = page.locator('ion-select button');
      const errorText = page.locator('ion-select .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await select.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('select should have aria-invalid attribute when select is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const select = page.locator('ion-select button');

      await expect(select).toHaveAttribute('aria-invalid');
    });
    test('select should not have aria-invalid attribute when select is valid', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" helper-text="Helper text" error-text="Error text"></ion-select>`,
        config
      );

      const select = page.locator('ion-select button');

      await expect(select).not.toHaveAttribute('aria-invalid');
    });
    test('select should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(`<ion-select label="Label"></ion-select>`, config);

      const select = page.locator('ion-select button');

      await expect(select).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: helper text rendering'), () => {
    test('should not have visual regressions when rendering helper text', async ({ page }) => {
      await page.setContent(`<ion-select label="Label" helper-text="Helper text"></ion-select>`, config);

      const bottomEl = page.locator('ion-select');
      await expect(bottomEl).toHaveScreenshot(screenshot(`select-helper-text`));
    });
    test('should not have visual regressions when rendering helper text with wrapping text', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text"></ion-select>`,
        config
      );

      const bottomEl = page.locator('ion-select');
      await expect(bottomEl).toHaveScreenshot(screenshot(`select-helper-text-wrapping`));
    });
    test('should not have visual regressions when rendering helper text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" label-placement="stacked" helper-text="Helper text"></ion-select>`,
        config
      );

      const bottomEl = page.locator('ion-select');
      await expect(bottomEl).toHaveScreenshot(screenshot(`select-helper-text-stacked-label`));
    });
  });

  test.describe(title('select: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" class="ion-invalid ion-touched" error-text="Error text"></ion-select>`,
        config
      );

      const bottomEl = page.locator('ion-select');
      await expect(bottomEl).toHaveScreenshot(screenshot(`select-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-select label="Label" class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked"></ion-select>`,
        config
      );

      const bottomEl = page.locator('ion-select');
      await expect(bottomEl).toHaveScreenshot(screenshot(`select-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-select::part(supporting-text) {
            font-size: 20px;
          }

          ion-select::part(helper-text) {
            color: green;
          }
        </style>
        <ion-select label="Label" helper-text="Helper text"></ion-select>
      `,
        config
      );

      const helperText = page.locator('ion-select');
      await expect(helperText).toHaveScreenshot(screenshot(`select-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-select::part(supporting-text) {
            font-size: 20px;
          }

          ion-select::part(error-text) {
            color: purple;
          }
        </style>
        <ion-select class="ion-invalid ion-touched" label="Label" error-text="Error text"></ion-select>
      `,
        config
      );

      const errorText = page.locator('ion-select');
      await expect(errorText).toHaveScreenshot(screenshot(`select-error-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with a custom css variable', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          ion-select {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-select class="ion-invalid ion-touched" label="Label" error-text="Error text"></ion-select>
      `,
        config
      );

      const errorText = page.locator('ion-select');
      await expect(errorText).toHaveScreenshot(screenshot(`select-error-text-custom-css-var`));
    });
  });
});
