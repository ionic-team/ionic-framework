import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio group: supporting text functionality'), () => {
    test('should not render top content if no hint is enabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const bottomEl = page.locator('ion-radio-group .radio-group-top');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const helperText = page.locator('ion-radio-group .helper-text');
      const errorText = page.locator('ion-radio-group .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('radio group should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      const helperText = page.locator('ion-radio-group .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await radioGroup.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when radio group is invalid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const helperText = page.locator('ion-radio-group .helper-text');
      const errorText = page.locator('ion-radio-group .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('radio group should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      const errorText = page.locator('ion-radio-group .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await radioGroup.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('radio group should have aria-invalid attribute when radio group is invalid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');

      await expect(radioGroup).toHaveAttribute('aria-invalid');
    });
    test('radio group should not have aria-invalid attribute when radio group is valid', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" helper-text="Helper text" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');

      await expect(radioGroup).not.toHaveAttribute('aria-invalid');
    });
    test('radio group should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-radio-group value="1">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');

      await expect(radioGroup).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio-group: supporting text rendering'), () => {
    test('should not have visual regressions when rendering helper text', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" helper-text="Helper text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      await expect(radioGroup).toHaveScreenshot(screenshot(`radio-group-helper-text`));
    });

    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="1" class="ion-invalid ion-touched" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      await expect(radioGroup).toHaveScreenshot(screenshot(`radio-group-error-text`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio group: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .radio-group-top {
            font-size: 20px;
          }

          .radio-group-top .helper-text {
            color: green;
          }
        </style>

        <ion-radio-group value="1" helper-text="Helper text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      await expect(radioGroup).toHaveScreenshot(screenshot(`radio-group-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .radio-group-top {
            font-size: 20px;
          }

          .radio-group-top .error-text {
            color: purple;
          }
        </style>

        <ion-radio-group value="1" class="ion-invalid ion-touched" error-text="Error text">
          <ion-radio value="1">Label</ion-radio>
          <ion-radio value="2">Label</ion-radio>
          <ion-radio value="3">Label</ion-radio>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      await expect(radioGroup).toHaveScreenshot(screenshot(`radio-group-error-text-custom-css`));
    });
  });
});
