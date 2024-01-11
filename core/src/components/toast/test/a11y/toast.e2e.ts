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
            toast.buttons = ['OK'];
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

    test('should not have any axe violations with controller toasts', async ({ page }) => {
      await page.setContent(
        `
          <script type="module">
            import { toastController } from '../../../../dist/ionic/index.esm.js';
            window.toastController = toastController;
          </script>

          <ion-button onclick="presentToast()">Present</ion-button>

          <script>
            const presentToast = async () => {
              // we only want to test color contrast on the toast itself
              const button = document.querySelector('ion-button');
              button.style.display = 'none';

              const toast = await toastController.create({
                icon: 'person',
                header: 'Controller Toast Header',
                message: 'Controller Toast Message',
                buttons: ['OK']
              });

              await toast.present();
            };
          </script>
        `,
        config
      );

      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const button = page.locator('ion-button');

      await button.click();
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

/**
 * High contrast mode tests
 */
configs({ directions: ['ltr'], themes: ['high-contrast-dark', 'high-contrast-light'] }).forEach(
  ({ title, config, screenshot }) => {
    test.describe(title('toast: high contrast: buttons'), () => {
      test.beforeEach(async ({ page }) => {
        await page.setContent(
          `
        <ion-toast is-open="true" header="Testing" message="Hello world"></ion-toast>
        <script>
          const toast = document.querySelector('ion-toast');
          toast.buttons = [
            { text: 'Cancel', role: 'cancel' },
            { text: 'OK' }
          ];
        </script>
      `,
          config
        );
      });

      test('should not have visual regressions', async ({ page }) => {
        const toast = page.locator('ion-toast');

        await expect(toast).toBeVisible();

        const toastWrapper = toast.locator('.toast-wrapper');
        await expect(toastWrapper).toHaveScreenshot(screenshot(`toast-high-contrast-buttons`));
      });

      test('should pass AAA guidelines', async ({ page }) => {
        const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

        await ionToastDidPresent.next();

        const results = await new AxeBuilder({ page })
          .options({ rules: { 'color-contrast-enhanced': { enabled: true } } })
          .analyze();
        expect(results.violations).toEqual([]);
      });
    });
  }
);
