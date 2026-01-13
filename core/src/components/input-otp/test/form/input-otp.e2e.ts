import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: form'), () => {
    test('should set formData when submit button is clicked', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="return onSubmit(event)">
          <ion-input-otp name="otp">Description</ion-input-otp>
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

      const submitButton = page.locator('button[type="submit"]');
      const firstInput = page.locator('ion-input-otp input').first();

      // Type into the first input box - this will fill all 4 boxes
      await firstInput.focus();
      await page.keyboard.type('1234');

      // Wait for any async operations to complete
      await page.waitForChanges();

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
      expect(formData?.['otp']).toBe('1234');
    });

    test('should reset formData when reset button is clicked', async ({ page }) => {
      await page.setContent(
        `
        <form onsubmit="return onSubmit(event)">
          <ion-input-otp label="input-otp" name="otp"></ion-input-otp>
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

      const inputOtp = page.locator('ion-input-otp');
      const submitButton = page.locator('button[type="submit"]');
      const resetButton = page.locator('button[type="reset"]');
      const firstInput = page.locator('ion-input-otp input').first();

      // Type into the first input box - this will fill all 4 boxes
      await firstInput.focus();
      await page.keyboard.type('1234');

      // Wait for any async operations to complete
      await page.waitForChanges();

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
      expect(formData?.['otp']).toBe('1234');

      // Click reset button - form should reset
      await resetButton.click();

      // Wait for any async operations to complete
      await page.waitForChanges();

      // Verify that the input-otp's value is cleared
      const inputOtpValue = await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        return el.value ?? '';
      });
      expect(inputOtpValue).toBe('');

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
      expect(formData?.['otp']).toBe('');
    });
  });
});
