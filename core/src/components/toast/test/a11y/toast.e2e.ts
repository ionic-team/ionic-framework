import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themes: ['dark', 'light'] }).forEach(({ title, config }) => {
  test.describe(title('toast: Axe testing'), () => {
    test('should not have any axe violations with inline toasts', async ({ page }) => {
      await page.setContent(
        `
          <ion-toast></ion-toast>

          <script>
            const toast = document.querySelector('ion-toast');
            toast.icon = 'person';
            toast.header = 'Inline Toast Header';
            toast.message = 'Inline Toast Message';
          </script>
        `,
        config
      );

      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const toast = page.locator('ion-toast');

      await toast.evaluate((el: HTMLIonToastElement) => el.present());
      await ionToastDidPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * This test does not check LTR vs RTL layouts
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toast: a11y'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/toast/test/a11y`, config);
    });

    test('should not have any axe violations with controller toasts', async ({ page }) => {
      const didPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#controller-toast-trigger');
      await didPresent.next();

      /**
       * IonToast overlays the entire screen, so
       * Axe will be unable to verify color contrast
       * on elements under the toast. To avoid needing
       * to spin up a controller toast using page.setContent
       * (to support automatic dark theme testing), color
       * contrast is checked on an inline toast in a
       * separate test above.
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });

    test('should have aria-labelledby and aria-label added to the button when htmlAttributes is set', async ({
      page,
    }) => {
      const didPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#aria-label-toast-trigger');
      await didPresent.next();

      const toastButton = page.locator('#aria-label-toast .toast-button');

      await expect(toastButton).toHaveAttribute('aria-labelledby', 'close-label');
      await expect(toastButton).toHaveAttribute('aria-label', 'close button');
    });
  });

  test.describe(title('toast: font scaling'), () => {
    test('should scale header text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-toast is-open="true" header="Testing" message="Hello world"></ion-toast>
      `,
        config
      );

      const toast = page.locator('ion-toast');

      await expect(toast).toBeVisible();

      const toastWrapper = toast.locator('.toast-wrapper');
      await expect(toastWrapper).toHaveScreenshot(screenshot('toast-header-scale'));
    });

    test('should scale message text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-toast is-open="true" message="Hello world"></ion-toast>
      `,
        config
      );

      const toast = page.locator('ion-toast');

      await expect(toast).toBeVisible();

      const toastWrapper = toast.locator('.toast-wrapper');
      await expect(toastWrapper).toHaveScreenshot(screenshot('toast-message-scale'));
    });

    test('should scale content icon on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-toast is-open="true" message="Hello world" icon="alert"></ion-toast>
      `,
        config
      );

      const toast = page.locator('ion-toast');

      await expect(toast).toBeVisible();

      const toastWrapper = toast.locator('.toast-wrapper');
      await expect(toastWrapper).toHaveScreenshot(screenshot('toast-icon-scale'));
    });

    test('should scale button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-toast is-open="true" message="Hello world"></ion-toast>
      `,
        config
      );

      const toast = page.locator('ion-toast');

      toast.evaluate((el: HTMLIonToastElement) => {
        el.buttons = [
          {
            text: 'Cancel',
          },
        ];
      });

      await expect(toast).toBeVisible();

      const toastWrapper = toast.locator('.toast-wrapper');
      await expect(toastWrapper).toHaveScreenshot(screenshot('toast-buttons-scale'));
    });

    test('should scale buttons and icons on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-toast is-open="true" message="Hello world"></ion-toast>
      `,
        config
      );

      const toast = page.locator('ion-toast');

      toast.evaluate((el: HTMLIonToastElement) => {
        el.buttons = [
          {
            text: 'Cancel',
            icon: 'close',
          },
        ];
      });

      await expect(toast).toBeVisible();

      /**
       * Linux incorrectly clips the screenshot when capturing the toast container
       * with the inset styling.
       *
       * We capture the entire toast container (entire page) to avoid this issue.
       */
      await expect(toast).toHaveScreenshot(screenshot('toast-buttons-icon-scale'));
    });
  });
});
