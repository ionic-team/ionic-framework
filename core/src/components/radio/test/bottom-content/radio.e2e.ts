import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const bottomEl = page.locator('ion-radio .radio-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const helperText = page.locator('ion-radio .helper-text');
      const errorText = page.locator('ion-radio .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('radio should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      const helperText = page.locator('ion-radio .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await radio.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when radio is invalid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const helperText = page.locator('ion-radio .helper-text');
      const errorText = page.locator('ion-radio .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('radio should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      const errorText = page.locator('ion-radio .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await radio.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('radio should have aria-invalid attribute when radio is invalid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await expect(radio).toHaveAttribute('aria-invalid');
    });
    test('radio should not have aria-invalid attribute when radio is valid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" helper-text="Helper text" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await expect(radio).not.toHaveAttribute('aria-invalid');
    });
    test('radio should not have aria-describedby attribute when no hint or error text is present', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await expect(radio).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: helper text rendering'), () => {
    // Check the default label placement, end, and stacked
    [undefined, 'end', 'stacked'].forEach((labelPlacement) => {
      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text`, async ({ page }) => {
        await page.setContent(
          `
          <ion-radio-group value="1">
            <ion-radio value="1" ${
              labelPlacement ? `label-placement="${labelPlacement}"` : ''
            } helper-text="Helper text">Label</ion-radio>
        </ion-radio-group>
      `,
          config
        );

        const bottomEl = page.locator('ion-radio');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`radio-helper-text${labelPlacement ? `-${labelPlacement}` : ''}`)
        );
      });

      test(`${
        labelPlacement ? `${labelPlacement} label - ` : ''
      }should not have visual regressions when rendering helper text with wrapping text`, async ({ page }) => {
        await page.setContent(
          `
          <ion-radio-group value="1">
            <ion-radio value="1" ${
              labelPlacement ? `label-placement="${labelPlacement}"` : ''
            } helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text">Label</ion-radio>
        </ion-radio-group>
      `,
          config
        );

        const bottomEl = page.locator('ion-radio');
        await expect(bottomEl).toHaveScreenshot(
          screenshot(`radio-helper-text${labelPlacement ? `-${labelPlacement}` : ''}-wrapping`)
        );
      });
    });
  });

  test.describe(title('radio: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const bottomEl = page.locator('ion-radio');
      await expect(bottomEl).toHaveScreenshot(screenshot(`radio-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const bottomEl = page.locator('ion-radio');
      await expect(bottomEl).toHaveScreenshot(screenshot(`radio-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-radio::part(supporting-text) {
            font-size: 20px;
          }

          ion-radio::part(helper-text) {
            color: green;
          }
        </style>
        <ion-radio-group value="1">
          <ion-radio value="1" helper-text="Helper text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const helperText = page.locator('ion-radio');
      await expect(helperText).toHaveScreenshot(screenshot(`radio-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-radio::part(supporting-text) {
            font-size: 20px;
          }

          ion-radio::part(error-text) {
            color: purple;
          }
        </style>
        <ion-radio-group value="1">
          <ion-radio value="1" class="ion-invalid ion-touched" error-text="Error text">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const errorText = page.locator('ion-radio');
      await expect(errorText).toHaveScreenshot(screenshot(`radio-error-text-custom-css`));
    });
  });
});
