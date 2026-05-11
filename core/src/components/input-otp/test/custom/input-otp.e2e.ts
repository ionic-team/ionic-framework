import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: custom'), () => {
    test('should allow styling the group part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp::part(group) {
            background-color: red;
          }
        </style>

        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const inputOtp = await page.locator('ion-input-otp');
      const group = await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        const groupEl = el.shadowRoot?.querySelector('[part="group"]') as HTMLElement | null;
        if (!groupEl) {
          return '';
        }
        return getComputedStyle(groupEl).backgroundColor;
      });

      expect(group).toBe('rgb(255, 0, 0)');
    });

    test('should allow styling the container part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp::part(container) {
            background-color: green;
          }
        </style>

        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const inputOtp = await page.locator('ion-input-otp');
      const container = await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        const containerEl = el.shadowRoot?.querySelector('[part="container"]') as HTMLElement | null;
        if (!containerEl) {
          return '';
        }
        return getComputedStyle(containerEl).backgroundColor;
      });

      expect(container).toBe('rgb(0, 128, 0)');
    });

    test('should allow styling the native part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp::part(native) {
            background-color: blue;
          }

          ion-input-otp::part(native):focus {
            background-color: red;
          }
        </style>

        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const inputOtp = await page.locator('ion-input-otp');

      // Focus the first native input and then find the inactive and
      // active native elements to verify the correct styles are applied
      const { inactiveNative, activeNative } = await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        const nativeElements = el.shadowRoot?.querySelectorAll('[part="native"]') as
          | NodeListOf<HTMLElement>
          | undefined;

        if (!nativeElements || nativeElements.length === 0) {
          return { inactiveNative: '', activeNative: '' };
        }

        // Focus the first native input
        const firstNative = nativeElements[0] as HTMLInputElement;
        firstNative.focus();

        // Find the focused element. If the focused element is not
        // a native input, use the first native input.
        const activeNativeEl =
          Array.from(nativeElements).find((nativeEl) => nativeEl === document.activeElement) || firstNative;

        // Find the first non-focused element
        const inactiveNativeEl = Array.from(nativeElements).find((nativeEl) => nativeEl !== activeNativeEl);

        return {
          inactiveNative: inactiveNativeEl ? getComputedStyle(inactiveNativeEl).backgroundColor : '',
          activeNative: getComputedStyle(activeNativeEl).backgroundColor,
        };
      });

      expect(inactiveNative).toBe('rgb(0, 0, 255)');
      expect(activeNative).toBe('rgb(255, 0, 0)');
    });

    test('should allow styling the separator part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp::part(separator) {
            background-color: green;
          }
        </style>

        <ion-input-otp separators="all">Description</ion-input-otp>
      `,
        config
      );

      const inputOtp = await page.locator('ion-input-otp');
      const separator = await inputOtp.evaluate(
        (el: HTMLIonInputOtpElement) =>
          getComputedStyle(el.shadowRoot?.querySelector('[part="separator"]') as HTMLElement).backgroundColor
      );

      expect(separator).toBe('rgb(0, 128, 0)');
    });

    test('should allow styling the description part', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-input-otp::part(description) {
            color: blue;
          }
        </style>

        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const inputOtp = await page.locator('ion-input-otp');
      const description = await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        const descriptionEl = el.shadowRoot?.querySelector('[part="description"]') as HTMLElement | null;
        if (!descriptionEl) {
          return '';
        }
        return getComputedStyle(descriptionEl).color;
      });

      expect(description).toBe('rgb(0, 0, 255)');
    });
  });
});
