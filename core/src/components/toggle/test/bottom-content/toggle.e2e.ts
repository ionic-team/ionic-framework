import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-toggle>Label</ion-toggle>`, config);

      const bottomEl = page.locator('ion-toggle .toggle-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(`<ion-toggle helper-text="Helper text" error-text="Error text">Label</ion-toggle>`, config);

      const helperText = page.locator('ion-toggle .helper-text');
      const errorText = page.locator('ion-toggle .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('toggle should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(`<ion-toggle helper-text="Helper text" error-text="Error text">Label</ion-toggle>`, config);

      const toggle = page.locator('ion-toggle');
      const helperText = page.locator('ion-toggle .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await toggle.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when toggle is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-toggle class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-toggle>`,
        config
      );

      const helperText = page.locator('ion-toggle .helper-text');
      const errorText = page.locator('ion-toggle .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('toggle should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-toggle class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-toggle>`,
        config
      );

      const toggle = page.locator('ion-toggle');
      const errorText = page.locator('ion-toggle .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await toggle.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('toggle should have aria-invalid attribute when toggle is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-toggle class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-toggle>`,
        config
      );

      const toggle = page.locator('ion-toggle');

      await expect(toggle).toHaveAttribute('aria-invalid');
    });
    test('toggle should not have aria-invalid attribute when toggle is valid', async ({ page }) => {
      await page.setContent(`<ion-toggle helper-text="Helper text" error-text="Error text">Label</ion-toggle>`, config);

      const toggle = page.locator('ion-toggle');

      await expect(toggle).not.toHaveAttribute('aria-invalid');
    });
    test('toggle should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(`<ion-toggle>Label</ion-toggle>`, config);

      const toggle = page.locator('ion-toggle');

      await expect(toggle).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: helper text rendering'), () => {
    // Check the default label placement, end, and stacked
    [undefined, 'end', 'stacked'].forEach((labelPlacement) => {
      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text`, async ({ page }) => {
        await page.setContent(
          `<ion-toggle ${
            labelPlacement ? `label-placement="${labelPlacement}"` : ''
          } helper-text="Helper text">Label</ion-toggle>`,
          config
        );

        const bottomEl = page.locator('ion-toggle');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`toggle-helper-text${labelPlacement ? `-${labelPlacement}` : ''}`)
        );
      });

      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text with wrapping text`, async ({ page }) => {
        await page.setContent(
          `<ion-toggle ${
            labelPlacement ? `label-placement="${labelPlacement}"` : ''
          } helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text">Label</ion-toggle>`,
          config
        );

        const bottomEl = page.locator('ion-toggle');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`toggle-helper-text${labelPlacement ? `-${labelPlacement}` : ''}-wrapping`)
        );
      });
    });
  });

  test.describe(title('toggle: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-toggle class="ion-invalid ion-touched" error-text="Error text">Label</ion-toggle>`,
        config
      );

      const bottomEl = page.locator('ion-toggle');
      await expect(bottomEl).toHaveScreenshot(screenshot(`toggle-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-toggle class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked">Label</ion-toggle>`,
        config
      );

      const bottomEl = page.locator('ion-toggle');
      await expect(bottomEl).toHaveScreenshot(screenshot(`toggle-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-toggle::part(supporting-text) {
            font-size: 20px;
          }

          ion-toggle::part(helper-text) {
            color: green;
          }
        </style>
        <ion-toggle helper-text="Helper text">Label</ion-toggle>
      `,
        config
      );

      const helperText = page.locator('ion-toggle');
      await expect(helperText).toHaveScreenshot(screenshot(`toggle-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-toggle::part(supporting-text) {
            font-size: 20px;
          }

          ion-toggle::part(error-text) {
            color: purple;
          }
        </style>
        <ion-toggle class="ion-invalid ion-touched" error-text="Error text">Label</ion-toggle>
      `,
        config
      );

      const errorText = page.locator('ion-toggle');
      await expect(errorText).toHaveScreenshot(screenshot(`toggle-error-text-custom-css`));
    });
  });
});
