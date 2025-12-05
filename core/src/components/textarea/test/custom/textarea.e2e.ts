import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: custom'), () => {
    test('should allow styling the container part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(container) {
            background-color: blue;
          }
        </style>

        <ion-textarea label="textarea"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      const container = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const containerEl = el.shadowRoot?.querySelector('[part="container"]') as HTMLElement | null;
        if (!containerEl) {
          return '';
        }
        return getComputedStyle(containerEl).backgroundColor;
      });

      expect(container).toBe('rgb(0, 0, 255)');
    });

    test('should allow styling the label part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(label) {
            color: green;
          }
        </style>

        <ion-textarea label="Test Label"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      const labelColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const labelEl = el.shadowRoot?.querySelector('[part="label"]') as HTMLElement | null;
        if (!labelEl) {
          return '';
        }
        return getComputedStyle(labelEl).color;
      });

      expect(labelColor).toBe('rgb(0, 128, 0)');
    });

    test('should allow styling the native textarea', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(native) {
            color: red;
          }
        </style>

        <ion-textarea label="textarea"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      const color = await textarea.evaluate(
        (el: HTMLIonTextareaElement) =>
          getComputedStyle(el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement).color
      );

      expect(color).toBe('rgb(255, 0, 0)');
    });

    test('should allow styling the supporting-text part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(supporting-text) {
            color: blue;
          }
        </style>

        <ion-textarea label="textarea" helper-text="Helper text"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      await textarea.waitFor();

      const supportingTextColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        // Query for the visible helper-text element which has the supporting-text part
        // Use attribute selector that matches space-separated part values
        const helperTextEl = el.shadowRoot?.querySelector('[part~="helper-text"]') as HTMLElement | null;
        if (!helperTextEl) {
          return '';
        }
        return getComputedStyle(helperTextEl).color;
      });

      expect(supportingTextColor).toBe('rgb(0, 0, 255)');
    });

    test('should allow styling the helper-text part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(helper-text) {
            color: red;
          }
        </style>

        <ion-textarea label="textarea" helper-text="Helper text"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      await textarea.waitFor();

      const helperTextColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const helperTextEl = el.shadowRoot?.querySelector('[part~="helper-text"]') as HTMLElement | null;
        if (!helperTextEl) {
          return '';
        }
        return getComputedStyle(helperTextEl).color;
      });

      expect(helperTextColor).toBe('rgb(255, 0, 0)');
    });

    test('should allow styling the error-text part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(error-text) {
            color: red;
          }
        </style>

        <ion-textarea label="textarea" class="ion-invalid ion-touched" error-text="Error text"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      await textarea.waitFor();

      const errorTextColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const errorTextEl = el.shadowRoot?.querySelector('[part~="error-text"]') as HTMLElement | null;
        if (!errorTextEl) {
          return '';
        }
        return getComputedStyle(errorTextEl).color;
      });

      expect(errorTextColor).toBe('rgb(255, 0, 0)');
    });

    test('should allow styling the counter part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(counter) {
            color: green;
          }
        </style>

        <ion-textarea label="textarea" counter="true" maxlength="100"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      const counterColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const counterEl = el.shadowRoot?.querySelector('[part="counter"]') as HTMLElement | null;
        if (!counterEl) {
          return '';
        }
        return getComputedStyle(counterEl).color;
      });

      expect(counterColor).toBe('rgb(0, 128, 0)');
    });

    test('should allow styling the bottom part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-textarea::part(bottom) {
            background-color: blue;
          }
        </style>

        <ion-textarea label="textarea" helper-text="Helper text"></ion-textarea>
      `,
        config
      );

      const textarea = await page.locator('ion-textarea');
      const bottomBgColor = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const bottomEl = el.shadowRoot?.querySelector('[part="bottom"]') as HTMLElement | null;
        if (!bottomEl) {
          return '';
        }
        return getComputedStyle(bottomEl).backgroundColor;
      });

      expect(bottomBgColor).toBe('rgb(0, 0, 255)');
    });
  });
});
