import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-input label="Label"></ion-input>`, config);

      const bottomEl = page.locator('ion-input .input-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('input should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const input = page.locator('ion-input input');
      const helperText = page.locator('ion-input .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when input is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('input should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const input = page.locator('ion-input input');
      const errorText = page.locator('ion-input .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('input should have aria-invalid attribute when input is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const input = page.locator('ion-input input');

      await expect(input).toHaveAttribute('aria-invalid');
    });
    test('input should not have aria-invalid attribute when input is valid', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" helper-text="Helper text" error-text="Error text"></ion-input>`,
        config
      );

      const input = page.locator('ion-input input');

      await expect(input).not.toHaveAttribute('aria-invalid');
    });
    test('input should not have aria-describedby attribute when no hint or error text is present', async ({ page }) => {
      await page.setContent(`<ion-input label="Label"></ion-input>`, config);

      const input = page.locator('ion-input input');

      await expect(input).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: helper text rendering'), () => {
    test('should not have visual regressions when rendering helper text', async ({ page }) => {
      await page.setContent(`<ion-input label="Label" helper-text="Helper text"></ion-input>`, config);

      const bottomEl = page.locator('ion-input');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-helper-text`));
    });
    test('should not have visual regressions when rendering helper text with wrapping text', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text"></ion-input>`,
        config
      );

      const bottomEl = page.locator('ion-input');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-helper-text-wrapping`));
    });
    test('should not have visual regressions when rendering helper text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" label-placement="stacked" helper-text="Helper text"></ion-input>`,
        config
      );

      const bottomEl = page.locator('ion-input');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-helper-text-stacked-label`));
    });
  });

  test.describe(title('input: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" class="ion-invalid ion-touched" error-text="Error text"></ion-input>`,
        config
      );

      const bottomEl = page.locator('ion-input');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-input label="Label" class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked"></ion-input>`,
        config
      );

      const bottomEl = page.locator('ion-input');
      await expect(bottomEl).toHaveScreenshot(screenshot(`input-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input.custom-input.md .input-bottom .helper-text {
            font-size: 20px;
            color: green;
          }
        </style>
        <ion-input class="custom-input" label="Label" helper-text="Helper text"></ion-input>
      `,
        config
      );

      const helperText = page.locator('ion-input');
      await expect(helperText).toHaveScreenshot(screenshot(`input-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input.custom-input.md .input-bottom .error-text {
            font-size: 20px;
            color: purple;
          }
        </style>
        <ion-input class="ion-invalid ion-touched custom-input" label="Label" error-text="Error text"></ion-input>
      `,
        config
      );

      const errorText = page.locator('ion-input');
      await expect(errorText).toHaveScreenshot(screenshot(`input-error-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with a custom css variable', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          ion-input.custom-input {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-input class="ion-invalid ion-touched custom-input" label="Label" error-text="Error text"></ion-input>
      `,
        config
      );

      const errorText = page.locator('ion-input');
      await expect(errorText).toHaveScreenshot(screenshot(`input-error-text-custom-css-var`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input: counter'), () => {
    test.describe('input: counter functionality', () => {
      test('should not activate if maxlength is not specified even if bottom content is visible', async ({ page }) => {
        await page.setContent(
          `
          <ion-input label="Label" counter="true" helper-text="helper text"></ion-input>
        `,
          config
        );
        const itemCounter = page.locator('ion-input .counter');
        await expect(itemCounter).toBeHidden();
      });
      test('default formatter should be used', async ({ page }) => {
        await page.setContent(
          `
          <ion-input label="Label" counter="true" maxlength="20"></ion-input>
        `,
          config
        );
        const itemCounter = page.locator('ion-input .counter');
        expect(await itemCounter.textContent()).toBe('0 / 20');
      });
      test('custom formatter should be used when provided', async ({ page }) => {
        await page.setContent(
          `
          <ion-input label="Label" counter="true" maxlength="20"></ion-input>
          <script>
            const input = document.querySelector('ion-input');
            input.counterFormatter = (inputLength, maxLength) => {
              const length = maxLength - inputLength;
              return length.toString() + ' characters left';
            };
          </script>
        `,
          config
        );

        const input = page.locator('ion-input input');
        const itemCounter = page.locator('ion-input .counter');
        expect(await itemCounter.textContent()).toBe('20 characters left');

        await input.click();
        await input.type('abcde');

        await page.waitForChanges();

        expect(await itemCounter.textContent()).toBe('15 characters left');
      });
    });
    test.describe('input: counter rendering', () => {
      test('should not have visual regressions when rendering counter', async ({ page }) => {
        await page.setContent(`<ion-input counter="true" maxlength="20" label="Label"></ion-input>`, config);

        const bottomEl = page.locator('ion-input');
        await expect(bottomEl).toHaveScreenshot(screenshot(`input-counter`));
      });

      test('should not have visual regressions when rendering counter with helper text', async ({ page }) => {
        await page.setContent(
          `<ion-input label="Label" counter="true" maxlength="20" helper-text="Helper"></ion-input>`,
          config
        );

        const bottomEl = page.locator('ion-input');
        await expect(bottomEl).toHaveScreenshot(screenshot(`input-counter-helper-text`));
      });

      test('should not have visual regressions when rendering counter with error text', async ({ page }) => {
        await page.setContent(
          `<ion-input class="ion-invalid ion-touched" label="Label" counter="true" maxlength="20" error-text="Error text"></ion-input>`,
          config
        );

        const bottomEl = page.locator('ion-input');
        await expect(bottomEl).toHaveScreenshot(screenshot(`input-counter-error-text`));
      });
    });
  });
});
