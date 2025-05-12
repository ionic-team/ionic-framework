import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('input-otp: separators'), () => {
    // Test separators with all sizes
    ['small', 'medium', 'large'].forEach((size) => {
      test(`one separator with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" separators="1">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-one-${size}`));
      });

      test(`two separators with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" length="6" separators="2,4">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-two-${size}`));
      });

      test(`all separators with ${size} size should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-input-otp size="${size}" value="12" separators="all">Description</ion-input-otp>
        `,
          config
        );

        const inputOtp = page.locator('ion-input-otp');
        await expect(inputOtp).toHaveScreenshot(screenshot(`input-otp-separators-all-${size}`));
      });
    });
  });
});

/**
 * Functionality is the same across modes and directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: separators functionality'), () => {
    test('should render separators after the first and third input box', async ({ page }) => {
      await page.setContent(`<ion-input-otp separators="1,3">Description</ion-input-otp>`, config);

      const group = page.locator('.input-otp-group');
      const wrappers = group.locator('> .native-wrapper');

      // Helper to check if the next sibling is a separator
      const hasSeparatorAfter = async (index: number) =>
        wrappers.nth(index).evaluate((el) => el.nextElementSibling?.classList.contains('input-otp-separator') ?? false);

      await expect(await hasSeparatorAfter(0)).toBe(true);
      await expect(await hasSeparatorAfter(1)).toBe(false);
      await expect(await hasSeparatorAfter(2)).toBe(true);
      await expect(await hasSeparatorAfter(3)).toBe(false);
    });

    test('should render separators after the second and third input box', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.separators = [2, 3];
      });

      const group = page.locator('.input-otp-group');
      const wrappers = group.locator('> .native-wrapper');

      // Helper to check if the next sibling is a separator
      const hasSeparatorAfter = async (index: number) =>
        wrappers.nth(index).evaluate((el) => el.nextElementSibling?.classList.contains('input-otp-separator') ?? false);

      await expect(await hasSeparatorAfter(0)).toBe(false);
      await expect(await hasSeparatorAfter(1)).toBe(true);
      await expect(await hasSeparatorAfter(2)).toBe(true);
      await expect(await hasSeparatorAfter(3)).toBe(false);
    });

    test('should render all separators', async ({ page }) => {
      await page.setContent(`<ion-input-otp separators="all">Description</ion-input-otp>`, config);

      const group = page.locator('.input-otp-group');
      const wrappers = group.locator('> .native-wrapper');

      // Helper to check if the next sibling is a separator
      const hasSeparatorAfter = async (index: number) =>
        wrappers.nth(index).evaluate((el) => el.nextElementSibling?.classList.contains('input-otp-separator') ?? false);

      await expect(await hasSeparatorAfter(0)).toBe(true);
      await expect(await hasSeparatorAfter(1)).toBe(true);
      await expect(await hasSeparatorAfter(2)).toBe(true);
      await expect(await hasSeparatorAfter(3)).toBe(false);
    });

    test('should warn when setting separators to a position greater than the input length', async ({ page }) => {
      const warnings: string[] = [];

      page.on('console', (ev) => {
        if (ev.type() === 'warning') {
          warnings.push(ev.text());
        }
      });

      await page.setContent(`<ion-input-otp separators="1,3,5,6,7">Description</ion-input-otp>`, config);

      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain(
        '[Ionic Warning]: [ion-input-otp] - The following separator positions are greater than the input length (4): 5, 6, 7. These separators will be ignored.'
      );
    });

    test('should warn when setting separators to an invalid space-separated string', async ({ page }) => {
      const warnings: string[] = [];

      page.on('console', (ev) => {
        if (ev.type() === 'warning') {
          warnings.push(ev.text());
        }
      });

      const invalidSeparators = '1 2 3';

      await page.setContent(`<ion-input-otp separators="${invalidSeparators}">Description</ion-input-otp>`, config);

      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain(
        `[Ionic Warning]: [ion-input-otp] - Invalid separators format. Expected a comma-separated list of numbers, an array of numbers, or "all". Received: ${invalidSeparators}`
      );
    });

    test('should warn when setting separators to an invalid comma-separated string', async ({ page }) => {
      const warnings: string[] = [];

      page.on('console', (ev) => {
        if (ev.type() === 'warning') {
          warnings.push(ev.text());
        }
      });

      const invalidSeparators = '1,d,3';

      await page.setContent(`<ion-input-otp separators="${invalidSeparators}">Description</ion-input-otp>`, config);

      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain(
        `[Ionic Warning]: [ion-input-otp] - Invalid separators format. Expected a comma-separated list of numbers, an array of numbers, or "all". Received: ${invalidSeparators}`
      );
    });
  });
});
