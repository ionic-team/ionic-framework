import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('button: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button>Default</ion-button>
        <ion-button fill="solid">Solid</ion-button>
        <ion-button fill="outline">Outline</ion-button>
        <ion-button fill="clear">Clear</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('focused state should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button class="ion-focused" fill="solid">Solid</ion-button>
        <ion-button class="ion-focused" fill="outline">Outline</ion-button>
        <ion-button class="ion-focused" fill="clear">Clear</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('button in toolbar should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-toolbar>
          <ion-button fill="outline" class="ion-activated">Start</ion-button>
        </ion-toolbar>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * Only ios mode uses ion-color() for the activated button state
 */
configs({ directions: ['ltr'], modes: ['ios'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('button: ios contrast'), () => {
    test('activated state should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button class="ion-activated" fill="solid">Solid</ion-button>
        <ion-button class="ion-activated" fill="outline">Outline</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: font scaling'), () => {
    test('should scale default button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button>Default</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-default-scale`));
    });

    test('should scale clear button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button fill="clear">Clear</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-clear-scale`));
    });

    test('should scale small button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="small">Small</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-small-scale`));
    });

    test('should scale large button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="large">Large</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-large-scale`));
    });
  });
});
