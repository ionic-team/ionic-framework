import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const testAria = async (
  page: E2EPage,
  buttonID: string,
  expectedAriaLabelledBy: string | null,
  expectedAriaDescribedBy: string | null
) => {
  const didPresent = await page.spyOnEvent('ionAlertDidPresent');
  const button = page.locator(`#${buttonID}`);

  await button.click();
  await didPresent.next();

  const alert = page.locator('ion-alert');
  const alertwrapper = alert.locator('.alert-wrapper');

  const header = alert.locator('.alert-title');
  const subHeader = alert.locator('.alert-sub-title');

  // If a header exists, it should be an h2 element
  if ((await header.count()) > 0) {
    const headerTagName = await header.evaluate((el) => el.tagName);
    expect(headerTagName).toBe('H2');
  }

  // If a header and subHeader exist, the subHeader should be an h3 element
  if ((await header.count()) > 0 && (await subHeader.count()) > 0) {
    const subHeaderTagName = await subHeader.evaluate((el) => el.tagName);
    expect(subHeaderTagName).toBe('H3');
  }

  // If a subHeader exists without a header, the subHeader should be an h2 element
  if ((await header.count()) === 0 && (await subHeader.count()) > 0) {
    const subHeaderTagName = await subHeader.evaluate((el) => el.tagName);
    expect(subHeaderTagName).toBe('H2');
  }

  /**
   * expect().toHaveAttribute() can't check for a null value, so grab and check
   * the values manually instead.
   */
  const ariaLabelledBy = await alertwrapper.getAttribute('aria-labelledby');
  const ariaDescribedBy = await alertwrapper.getAttribute('aria-describedby');

  expect(ariaLabelledBy).toBe(expectedAriaLabelledBy);
  expect(ariaDescribedBy).toBe(expectedAriaDescribedBy);
};

configs({ directions: ['ltr'], palettes: ['dark', 'light'] }).forEach(({ title, config }) => {
  test.describe(title('alert: Axe testing'), () => {
    test('should not have accessibility violations when header and message are defined', async ({ page }) => {
      await page.setContent(
        `
          <ion-alert></ion-alert>

          <script>
            const alert = document.querySelector('ion-alert');
            alert.header = 'Header';
            alert.subHeader = 'Subtitle';
            alert.buttons = ['OK'];
          </script>
        `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('ion-alert');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('alert: text wrapping'), () => {
    test('should break on words and white spaces for radios', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28406',
      });
      await page.setContent(
        `
        <ion-alert header='Text Wrapping'></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.inputs = [
            { type: 'radio', value: 'a', label: 'ThisIsAllOneReallyLongWordThatShouldWrap' },
            { type: 'radio', value: 'b', label: 'These are separate words that should wrap' }
          ];
        </script>
      `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('ion-alert');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`alert-radio-text-wrap`));
    });
    test('should break on words and white spaces for checkboxes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28406',
      });
      await page.setContent(
        `
        <ion-alert header='Text Wrapping'></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.inputs = [
            { type: 'checkbox', value: 'a', label: 'ThisIsAllOneReallyLongWordThatShouldWrap' },
            { type: 'checkbox', value: 'b', label: 'These are separate words that should wrap' }
          ];
        </script>
      `,
        config
      );

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const alert = page.locator('ion-alert');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`alert-checkbox-text-wrap`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('alert: a11y'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/alert/test/a11y`, config);
    });

    test('should have aria-labelledby set to both when header and subHeader are set', async ({ page }) => {
      await testAria(page, 'bothHeadersOnly', 'alert-1-hdr alert-1-sub-hdr', null);
    });

    test('should have aria-labelledby set when only header is set', async ({ page }) => {
      await testAria(page, 'headerOnly', 'alert-1-hdr', null);
    });

    test('should fall back to subHeader for aria-labelledby if header is not defined', async ({ page }) => {
      await testAria(page, 'subHeaderOnly', 'alert-1-sub-hdr', null);
    });

    test('should have aria-describedby when message is set', async ({ page }) => {
      await testAria(page, 'noHeaders', null, 'alert-1-msg');
    });

    test('should have aria-labelledby and aria-describedby when headers and message are set', async ({ page }) => {
      await testAria(page, 'headersAndMessage', 'alert-1-hdr alert-1-sub-hdr', 'alert-1-msg');
    });

    test('should allow for manually specifying aria attributes', async ({ page }) => {
      await testAria(page, 'customAria', 'Custom title', 'Custom description');
    });

    test('should have aria-labelledby and aria-label added to the button when htmlAttributes is set', async ({
      page,
    }) => {
      const didPresent = await page.spyOnEvent('ionAlertDidPresent');

      const button = page.locator('#ariaLabelButton');
      await button.click();

      await didPresent.next();

      const alertButton = page.locator('ion-alert .alert-button');

      await expect(alertButton).toHaveAttribute('aria-labelledby', 'close-label');
      await expect(alertButton).toHaveAttribute('aria-label', 'close button');
    });

    test('should not toggle the checkbox when pressing the Enter key', async ({ page }) => {
      const didPresent = await page.spyOnEvent('ionAlertDidPresent');

      const button = page.locator('#checkbox');
      await button.click();

      await didPresent.next();

      const alertCheckbox = page.locator('ion-alert .alert-checkbox');
      const ariaChecked = await alertCheckbox.getAttribute('aria-checked');

      await expect(alertCheckbox).toHaveAttribute('aria-checked', ariaChecked!);

      await alertCheckbox.press('Enter');
      await expect(alertCheckbox).toHaveAttribute('aria-checked', ariaChecked!);
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('alert: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page, skip }) => {
      // TODO(ROU-8158): unskip this test when a solution is found
      skip.browser('chromium', 'Rendering is flaky in Chrome.');

      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>


        <ion-alert header="Header" sub-header="Sub Header" message="Message"></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.buttons = ['Ok', 'Cancel'];
        </script>
      `,
        config
      );

      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`alert-scale`));
    });
    test('should scale text on larger font sizes with checkboxes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>


        <ion-alert header="Header" sub-header="Sub Header" message="Message"></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.inputs = [
            { type: 'checkbox', value: 'a', label: 'Checkbox A', checked: true },
            { type: 'checkbox', value: 'b', label: 'Checkbox B' },
            { type: 'checkbox', value: 'c', label: 'Checkbox C' },
            { type: 'checkbox', value: 'd', label: 'Checkbox D' },
          ];
          alert.buttons = ['Ok', 'Cancel'];
        </script>
      `,
        config
      );

      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`alert-checkbox-scale`));
    });
    test('should scale text on larger font sizes with radios', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>


        <ion-alert header="Header" sub-header="Sub Header" message="Message"></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.inputs = [
            { type: 'radio', value: 'a', label: 'Radio A', checked: true },
            { type: 'radio', value: 'b', label: 'Radio B' },
            { type: 'radio', value: 'c', label: 'Radio C' },
            { type: 'radio', value: 'd', label: 'Radio D' },
          ];
          alert.buttons = ['Ok', 'Cancel'];
        </script>
      `,
        config
      );

      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`alert-radio-scale`));
    });
    test('should scale text on larger font sizes with text fields', async ({ page, skip }) => {
      // TODO(ROU-8158): unskip this test when a solution is found
      skip.browser('chromium', 'Rendering is flaky in Chrome.');

      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>


        <ion-alert header="Header" sub-header="Sub Header" message="Message"></ion-alert>

        <script>
          const alert = document.querySelector('ion-alert');
          alert.inputs = [
            { type: 'text', value: 'My Input', label: 'Input' },
            { type: 'textarea', value: 'My Textarea', label: 'Textarea' },
          ];
          alert.buttons = ['Ok', 'Cancel'];
        </script>
      `,
        config
      );

      const alert = page.locator('ion-alert');
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await alert.evaluate((el: HTMLIonAlertElement) => el.present());
      await ionAlertDidPresent.next();

      /**
       * The borders on the text fields may not be visible in the screenshot
       * when using Safari, this is due to a WebKit rendering quirk.
       */
      await expect(page).toHaveScreenshot(screenshot(`alert-text-fields-scale`));
    });
  });
});
