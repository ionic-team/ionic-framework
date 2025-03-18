import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: bottom content functionality'), () => {
    test('should not render bottom content if no hint is enabled', async ({ page }) => {
      await page.setContent(`<ion-textarea label="Label"></ion-textarea>`, config);

      const bottomEl = page.locator('ion-textarea .textarea-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('Helper text');
      await expect(errorText).toBeHidden();
    });
    test('textarea should have an aria-describedby attribute when helper text is present', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const textarea = page.locator('ion-textarea textarea');
      const helperText = page.locator('ion-textarea .helper-text');
      const helperTextId = await helperText.getAttribute('id');
      const ariaDescribedBy = await textarea.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(helperTextId);
    });
    test('error text should be visible when textarea is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const helperText = page.locator('ion-textarea .helper-text');
      const errorText = page.locator('ion-textarea .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('Error text');
    });

    test('textarea should have an aria-describedby attribute when error text is present', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const textarea = page.locator('ion-textarea textarea');
      const errorText = page.locator('ion-textarea .error-text');
      const errorTextId = await errorText.getAttribute('id');
      const ariaDescribedBy = await textarea.getAttribute('aria-describedby');

      expect(ariaDescribedBy).toBe(errorTextId);
    });
    test('textarea should have aria-invalid attribute when textarea is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" class="ion-invalid ion-touched" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const textarea = page.locator('ion-textarea textarea');

      await expect(textarea).toHaveAttribute('aria-invalid');
    });
    test('textarea should not have aria-invalid attribute when textarea is valid', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" helper-text="Helper text" error-text="Error text"></ion-textarea>`,
        config
      );

      const textarea = page.locator('ion-textarea textarea');

      await expect(textarea).not.toHaveAttribute('aria-invalid');
    });
    test('textarea should not have aria-describedby attribute when no hint or error text is present', async ({
      page,
    }) => {
      await page.setContent(`<ion-textarea label="Label"></ion-textarea>`, config);

      const textarea = page.locator('ion-textarea textarea');

      await expect(textarea).not.toHaveAttribute('aria-describedby');
    });
  });
});

/**
 * Rendering is different across modes
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: helper text rendering'), () => {
    test('should not have visual regressions when rendering helper text', async ({ page }) => {
      await page.setContent(`<ion-textarea label="Label" helper-text="Helper text"></ion-textarea>`, config);

      const bottomEl = page.locator('ion-textarea');
      await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-helper-text`));
    });
    test('should not have visual regressions when rendering helper text with wrapping text', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" helper-text="Helper text helper text helper text helper text helper text helper text helper text helper text helper text"></ion-textarea>`,
        config
      );

      const bottomEl = page.locator('ion-textarea');
      await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-helper-text-wrapping`));
    });
    test('should not have visual regressions when rendering helper text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" label-placement="stacked" helper-text="Helper text"></ion-textarea>`,
        config
      );

      const bottomEl = page.locator('ion-textarea');
      await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-helper-text-stacked-label`));
    });
  });

  test.describe(title('textarea: error text rendering'), () => {
    test('should not have visual regressions when rendering error text', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" class="ion-invalid ion-touched" error-text="Error text"></ion-textarea>`,
        config
      );

      const bottomEl = page.locator('ion-textarea');
      await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-error-text`));
    });
    test('should not have visual regressions when rendering error text with a stacked label', async ({ page }) => {
      await page.setContent(
        `<ion-textarea label="Label" class="ion-invalid ion-touched" error-text="Error text" label-placement="stacked"></ion-textarea>`,
        config
      );

      const bottomEl = page.locator('ion-textarea');
      await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-error-text-stacked-label`));
    });
  });
});

/**
 * Customizing supporting text is the same across modes and directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: supporting text customization'), () => {
    test('should not have visual regressions when rendering helper text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea.custom-textarea.md .textarea-bottom .helper-text {
            font-size: 20px;
            color: green;
          }
        </style>
        <ion-textarea class="custom-textarea" label="Label" helper-text="Helper text"></ion-textarea>
      `,
        config
      );

      const helperText = page.locator('ion-textarea');
      await expect(helperText).toHaveScreenshot(screenshot(`textarea-helper-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with custom css', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea.custom-textarea.md .textarea-bottom .error-text {
            font-size: 20px;
            color: purple;
          }
        </style>
        <ion-textarea class="ion-invalid ion-touched custom-textarea" label="Label" error-text="Error text"></ion-textarea>
      `,
        config
      );

      const errorText = page.locator('ion-textarea');
      await expect(errorText).toHaveScreenshot(screenshot(`textarea-error-text-custom-css`));
    });
    test('should not have visual regressions when rendering error text with a custom css variable', async ({
      page,
    }) => {
      await page.setContent(
        `
        <style>
          ion-textarea.custom-textarea {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-textarea class="ion-invalid ion-touched custom-textarea" label="Label" error-text="Error text"></ion-textarea>
      `,
        config
      );

      const errorText = page.locator('ion-textarea');
      await expect(errorText).toHaveScreenshot(screenshot(`textarea-error-text-custom-css-var`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: counter'), () => {
    test.describe('textarea: counter functionality', () => {
      test('should not activate if maxlength is not specified even if bottom content is visible', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="Label" counter="true" helper-text="helper text"></ion-textarea>
        `,
          config
        );
        const itemCounter = page.locator('ion-textarea .counter');
        await expect(itemCounter).toBeHidden();
      });
      test('default formatter should be used', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="Label" counter="true" maxlength="20"></ion-textarea>
        `,
          config
        );
        const itemCounter = page.locator('ion-textarea .counter');
        expect(await itemCounter.textContent()).toBe('0 / 20');
      });
      test('custom formatter should be used when provided', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="Label" counter="true" maxlength="20"></ion-textarea>
          <script>
            const textarea = document.querySelector('ion-textarea');
            textarea.counterFormatter = (inputLength, maxLength) => {
              const length = maxLength - inputLength;
              return length.toString() + ' characters left';
            };
          </script>
        `,
          config
        );

        const textarea = page.locator('ion-textarea textarea');
        const itemCounter = page.locator('ion-textarea .counter');
        expect(await itemCounter.textContent()).toBe('20 characters left');

        await textarea.click();
        await textarea.type('abcde');

        await page.waitForChanges();

        expect(await itemCounter.textContent()).toBe('15 characters left');
      });
    });
    test.describe('textarea: counter rendering', () => {
      test('should not have visual regressions when rendering counter', async ({ page }) => {
        await page.setContent(`<ion-textarea counter="true" maxlength="20" label="Label"></ion-textarea>`, config);

        const bottomEl = page.locator('ion-textarea');
        await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-counter`));
      });

      test('should not have visual regressions when rendering counter with helper text', async ({ page }) => {
        await page.setContent(
          `<ion-textarea label="Label" counter="true" maxlength="20" helper-text="Helper"></ion-textarea>`,
          config
        );

        const bottomEl = page.locator('ion-textarea');
        await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-counter-helper-text`));
      });

      test('should not have visual regressions when rendering counter with error text', async ({ page }) => {
        await page.setContent(
          `<ion-textarea class="ion-invalid ion-touched" label="Label" counter="true" maxlength="20" error-text="Error text"></ion-textarea>`,
          config
        );

        const bottomEl = page.locator('ion-textarea');
        await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-counter-error-text`));
      });
    });
  });
});
