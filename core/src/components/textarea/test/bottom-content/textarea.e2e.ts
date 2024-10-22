import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: bottom content'), () => {
    test('should not render bottom content if no hint or counter is enabled', async ({ page }) => {
      await page.setContent(`<ion-textarea label="my textarea"></ion-textarea>`, config);

      const bottomEl = page.locator('ion-textarea .textarea-bottom');
      await expect(bottomEl).toHaveCount(0);
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: hint text'), () => {
    test.describe('textarea: hint text functionality', () => {
      test('helper text should be visible initially', async ({ page }) => {
        await page.setContent(
          `<ion-textarea helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
          config
        );

        const helperText = page.locator('ion-textarea .helper-text');
        const errorText = page.locator('ion-textarea .error-text');
        await expect(helperText).toBeVisible();
        await expect(helperText).toHaveText('my helper');
        await expect(errorText).toBeHidden();
      });
      test('textarea should have an aria-describedby attribute when helper text is present', async ({ page }) => {
        await page.setContent(
          `<ion-textarea helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
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
          `<ion-textarea class="ion-invalid ion-touched" helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
          config
        );

        const helperText = page.locator('ion-textarea .helper-text');
        const errorText = page.locator('ion-textarea .error-text');
        await expect(helperText).toBeHidden();
        await expect(errorText).toBeVisible();
        await expect(errorText).toHaveText('my error');
      });
      test('error text should change when variable is customized', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-textarea.custom-textarea {
              --highlight-color-invalid: purple;
            }
          </style>
          <ion-textarea class="ion-invalid ion-touched custom-textarea" label="my label" error-text="my error"></ion-textarea>
        `,
          config
        );

        const errorText = page.locator('ion-textarea .error-text');
        await expect(errorText).toHaveScreenshot(screenshot(`textarea-error-custom-color`));
      });
      test('textarea should have an aria-describedby attribute when error text is present', async ({ page }) => {
        await page.setContent(
          `<ion-textarea class="ion-invalid ion-touched" helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
          config
        );

        const textarea = page.locator('ion-textarea textarea');
        const errorText = page.locator('ion-textarea .error-text');
        const errorTextId = await errorText.getAttribute('id');
        const ariaDescribedBy = await textarea.getAttribute('aria-describedby');

        expect(ariaDescribedBy).toBe(errorTextId);
      });
      test('textarea should have aria-invalid attribute when input is invalid', async ({ page }) => {
        await page.setContent(
          `<ion-textarea class="ion-invalid ion-touched" helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
          config
        );

        const textarea = page.locator('ion-textarea textarea');

        await expect(textarea).toHaveAttribute('aria-invalid');
      });
      test('textarea should not have aria-invalid attribute when input is valid', async ({ page }) => {
        await page.setContent(
          `<ion-textarea helper-text="my helper" error-text="my error" label="my textarea"></ion-textarea>`,
          config
        );

        const textarea = page.locator('ion-textarea textarea');

        await expect(textarea).not.toHaveAttribute('aria-invalid');
      });
      test('textarea should not have aria-describedby attribute when no hint or error text is present', async ({
        page,
      }) => {
        await page.setContent(`<ion-textarea label="my textarea"></ion-textarea>`, config);

        const textarea = page.locator('ion-textarea textarea');

        await expect(textarea).not.toHaveAttribute('aria-describedby');
      });
    });
    test.describe('textarea: hint text rendering', () => {
      test.describe('regular textareas', () => {
        test('should not have visual regressions when rendering helper text', async ({ page }) => {
          await page.setContent(`<ion-textarea helper-text="my helper" label="my textarea"></ion-textarea>`, config);

          const bottomEl = page.locator('ion-textarea .textarea-bottom');
          await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-bottom-content-helper`));
        });
        test('should not have visual regressions when rendering error text', async ({ page }) => {
          await page.setContent(
            `<ion-textarea class="ion-invalid ion-touched" error-text="my helper" label="my textarea"></ion-textarea>`,
            config
          );

          const bottomEl = page.locator('ion-textarea .textarea-bottom');
          await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-bottom-content-error`));
        });
      });
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: counter'), () => {
    test.describe('textarea: counter functionality', () => {
      test('should not activate if maxlength is not specified even if bottom content is visible', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="my label" counter="true" helper-text="helper text"></ion-textarea>
        `,
          config
        );
        const itemCounter = page.locator('ion-textarea .counter');
        await expect(itemCounter).toBeHidden();
      });
      test('default formatter should be used', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="my label" counter="true" maxlength="20"></ion-textarea>
        `,
          config
        );
        const itemCounter = page.locator('ion-textarea .counter');
        expect(await itemCounter.textContent()).toBe('0 / 20');
      });
      test('custom formatter should be used when provided', async ({ page }) => {
        await page.setContent(
          `
          <ion-textarea label="my label" counter="true" maxlength="20"></ion-textarea>
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
      test.describe('regular textareas', () => {
        test('should not have visual regressions when rendering counter', async ({ page }) => {
          await page.setContent(
            `<ion-textarea counter="true" maxlength="20" label="my textarea"></ion-textarea>`,
            config
          );

          const bottomEl = page.locator('ion-textarea .textarea-bottom');
          await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-bottom-content-counter`));
        });

        test('should not have visual regressions when rendering counter with helper text', async ({ page }) => {
          await page.setContent(
            `<ion-textarea label="my textarea" counter="true" maxlength="20" helper-text="my helper"></ion-textarea>`,
            config
          );

          const bottomEl = page.locator('ion-textarea .textarea-bottom');
          await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-bottom-content-counter-helper-text`));
        });

        test('should not have visual regressions when rendering counter with error text', async ({ page }) => {
          await page.setContent(
            `<ion-textarea class="ion-invalid ion-touched" label="my textarea" counter="true" maxlength="20" error-text="my error"></ion-textarea>`,
            config
          );

          const bottomEl = page.locator('ion-textarea .textarea-bottom');
          await expect(bottomEl).toHaveScreenshot(screenshot(`textarea-bottom-content-counter-error-text`));
        });
      });
    });
  });
});
