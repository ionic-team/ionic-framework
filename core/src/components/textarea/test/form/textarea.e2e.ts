import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: form'), () => {
    test('should be marked as invalid when required and empty', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="onSubmit(event)">
          <ion-textarea label="textarea" required></ion-textarea>
          <button type="submit">Submit</button>
        </form>
        <script>
          function onSubmit(event) {
            window.formSubmitted = true;
            event.preventDefault();
            return false;
          }
        </script>
      `,
        config
      );

      let formSubmitted = false;

      const textarea = page.locator('ion-textarea');
      const submitButton = page.locator('button[type="submit"]');

      // Check that the textarea's browser validation is working before submission
      const validationInfo = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!nativeTextarea) {
          return { isValid: false, willValidate: false, validationMessage: '', checkValidity: false };
        }
        return {
          isValid: nativeTextarea.validity.valid,
          willValidate: nativeTextarea.willValidate,
          validationMessage: nativeTextarea.validationMessage,
          checkValidity: nativeTextarea.checkValidity(),
        };
      });

      expect(validationInfo.willValidate).toBe(true);
      expect(validationInfo.isValid).toBe(false);
      expect(validationInfo.checkValidity).toBe(false);
      expect(validationInfo.validationMessage.length).toBeGreaterThan(0);

      // Click submit button - browser validation should prevent form submission
      // and show the native validation popup
      await submitButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Check that form was not submitted (browser validation prevented it)
      formSubmitted = await page.evaluate(() => (window as any).formSubmitted ?? false);
      expect(formSubmitted).toBe(false);

      // Verify that the form's validation was triggered and it's invalid
      const formValidity = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form ? form.checkValidity() : null;
      });
      expect(formValidity).toBe(false);

      // Verify the textarea's validity is still false after submit attempt
      const isValidAfterSubmit = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        return nativeTextarea?.validity.valid ?? false;
      });
      expect(isValidAfterSubmit).toBe(false);
    });

    test('should be marked as valid when required and filled', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="onSubmit(event)">
          <ion-textarea label="textarea" required></ion-textarea>
          <button type="submit">Submit</button>
        </form>
        <script>
          function onSubmit(event) {
            window.formSubmitted = true;
            event.preventDefault();
            return false;
          }
        </script>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const submitButton = page.locator('button[type="submit"]');

      // Type into the native textarea
      await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (nativeTextarea) {
          nativeTextarea.value = 'Test value';
          nativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Check that the textarea's browser validation is working before submission
      const isValidBeforeSubmit = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        return nativeTextarea?.validity.valid ?? false;
      });
      expect(isValidBeforeSubmit).toBe(true);

      // Click submit button - form should submit since validation passes
      await submitButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Check that form was submitted (validation passed)
      const formSubmitted = await page.evaluate(() => (window as any).formSubmitted ?? false);
      expect(formSubmitted).toBe(true);

      // Verify that the form's validation passed
      const formValidity = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form ? form.checkValidity() : null;
      });
      expect(formValidity).toBe(true);

      // Verify the textarea's validity is still true after submit
      const isValidAfterSubmit = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        return nativeTextarea?.validity.valid ?? false;
      });
      expect(isValidAfterSubmit).toBe(true);
    });

    test('should set formData when submit button is clicked', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="return onSubmit(event)">
          <ion-textarea label="textarea" name="textarea" required></ion-textarea>
          <button type="submit">Submit</button>
        </form>
        <script>
          function onSubmit(event) {
            window.formSubmitted = true;
            event.preventDefault();
            return false;
          }
        </script>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const submitButton = page.locator('button[type="submit"]');

      // Type into the native textarea
      await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (nativeTextarea) {
          nativeTextarea.value = 'Test value';
          nativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Click submit button - form should submit since validation passes
      await submitButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Verify that the form's validation passed
      const formValidity = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form ? form.checkValidity() : null;
      });
      expect(formValidity).toBe(true);

      // Verify that the formData is set
      const formData = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) {
          return null;
        }
        const formData = new FormData(form);
        const entries: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          entries[key] = value.toString();
        }
        return entries;
      });
      expect(formData).toBeDefined();
      expect(formData?.['textarea']).toBe('Test value');
    });

    test('should reset formData when reset button is clicked', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="return onSubmit(event)">
          <ion-textarea label="textarea" name="textarea" required></ion-textarea>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
        <script>
          function onSubmit(event) {
            window.formSubmitted = true;
            event.preventDefault();
            return false;
          }
        </script>
      `,
        config
      );

      const textarea = page.locator('ion-textarea');
      const submitButton = page.locator('button[type="submit"]');
      const resetButton = page.locator('button[type="reset"]');

      // Type into the native textarea
      await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (nativeTextarea) {
          nativeTextarea.value = 'Test value';
          nativeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Click submit button - form should submit since validation passes
      await submitButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Verify that the formData is set
      let formData = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) {
          return null;
        }
        const formData = new FormData(form);
        const entries: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          entries[key] = value.toString();
        }
        return entries;
      });
      expect(formData).toBeDefined();
      expect(formData?.['textarea']).toBe('Test value');

      // Click reset button - form should reset
      await resetButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Verify that the textarea's value is cleared
      const textareaValue = await textarea.evaluate((el: HTMLIonTextareaElement) => {
        const nativeTextarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
        return nativeTextarea?.value ?? '';
      });
      expect(textareaValue).toBe('');

      // Verify that the formData is cleared
      formData = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) {
          return null;
        }
        const formData = new FormData(form);
        const entries: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          entries[key] = value.toString();
        }
        return entries;
      });
      expect(formData?.['textarea']).toBe('');
    });
  });
});
