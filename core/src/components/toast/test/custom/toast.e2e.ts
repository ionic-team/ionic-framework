import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('toast: custom'), () => {
    test('should be able to customize toast wrapper, container, and content using css parts', async ({ page }) => {
      await page.setContent(
        `
        <ion-toast is-open="true" header="Header" message="Hello World"></ion-toast>

        <style>
          ion-toast::part(wrapper) {
            background-color: red;
          }
          ion-toast::part(container) {
            background-color: green;
          }
          ion-toast::part(content) {
            background-color: blue;
          }
        </style>
      `,
        config
      );

      const wrapperColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="wrapper"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).backgroundColor : null;
      });

      expect(wrapperColor).toBe('rgb(255, 0, 0)');

      const containerColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="container"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).backgroundColor : null;
      });

      expect(containerColor).toBe('rgb(0, 128, 0)');

      const contentColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="content"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).backgroundColor : null;
      });

      expect(contentColor).toBe('rgb(0, 0, 255)');
    });

    test('should be able to customize toast header and message using css parts', async ({ page }) => {
      await page.setContent(
        `
        <ion-toast is-open="true" header="Header" message="Hello World"></ion-toast>

        <style>
          ion-toast::part(header) {
            color: red;
          }
          ion-toast::part(message) {
            color: green;
          }
        </style>
      `,
        config
      );

      const headerColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="header"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).color : null;
      });

      expect(headerColor).toBe('rgb(255, 0, 0)');

      const messageColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="message"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).color : null;
      });

      expect(messageColor).toBe('rgb(0, 128, 0)');
    });

    test('should be able to customize toast icon, button, and button cancel using css parts', async ({ page }) => {
      await page.setContent(
        `
        <ion-toast is-open="true" header="Header" message="Hello World" icon="alert"></ion-toast>

        <style>
          ion-toast::part(icon) {
            color: red;
          }
          ion-toast::part(button) {
            color: green;
          }
          ion-toast::part(button cancel) {
            color: blue;
          }
        </style>

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

      const iconColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="icon"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).color : null;
      });

      expect(iconColor).toBe('rgb(255, 0, 0)');

      const buttonColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="button"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).color : null;
      });

      expect(buttonColor).toBe('rgb(0, 128, 0)');

      const buttonCancelColor = await page.locator('ion-toast').evaluate((el: any) => {
        const partEl = el.shadowRoot?.querySelector('[part="button cancel"]') as HTMLElement | null;
        return partEl ? getComputedStyle(partEl).color : null;
      });

      expect(buttonCancelColor).toBe('rgb(0, 0, 255)');
    });
  });
});
