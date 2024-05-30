import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const styleTestHelpers = `
  <style>
    .grid {
      display: grid;
      align-items: start;
      justify-items: start;
      grid-template-columns: repeat(3, auto);
      grid-gap: 10px;
      margin-bottom: 10px;
      padding: 6px;
    }
  </style>
`;

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: shape'), () => {
    test.describe('soft shape', () => {
      test.describe('default fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="soft" size="small">Button</ion-button>
              <ion-button shape="soft">Button</ion-button>
              <ion-button shape="soft" size="large">Button</ion-button>
              <ion-button shape="soft" size="small">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft" size="large">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
           `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-soft-fill-default`));
        });
      });

      test.describe('outline fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="soft" fill="outline" size="small">Button</ion-button>
              <ion-button shape="soft" fill="outline">Button</ion-button>
              <ion-button shape="soft" fill="outline" size="large">Button</ion-button>
              <ion-button shape="soft" size="small" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft" size="large" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-soft-fill-outline`));
        });
      });

      // The clear buttons have the `ion-focused` class added to show their shape
      test.describe('clear fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="soft" fill="clear" size="small" class="ion-focused">Button</ion-button>
              <ion-button shape="soft" fill="clear" class="ion-focused">Button</ion-button>
              <ion-button shape="soft" fill="clear" size="large" class="ion-focused">Button</ion-button>
              <ion-button shape="soft" size="small" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="soft" size="large" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-soft-fill-clear`));
        });
      });
    });

    test.describe('round shape', () => {
      test.describe('default fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="round" size="small">Button</ion-button>
              <ion-button shape="round">Button</ion-button>
              <ion-button shape="round" size="large">Button</ion-button>
              <ion-button shape="round" size="small">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round" size="large">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-round-fill-default`));
        });
      });

      test.describe('outline fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="round" fill="outline" size="small">Button</ion-button>
              <ion-button shape="round" fill="outline">Button</ion-button>
              <ion-button shape="round" fill="outline" size="large">Button</ion-button>
              <ion-button shape="round" size="small" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round" size="large" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-round-fill-outline`));
        });
      });

      // The clear buttons have the `ion-focused` class added to show their shape
      test.describe('clear fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="round" fill="clear" size="small" class="ion-focused">Button</ion-button>
              <ion-button shape="round" fill="clear" class="ion-focused">Button</ion-button>
              <ion-button shape="round" fill="clear" size="large" class="ion-focused">Button</ion-button>
              <ion-button shape="round" size="small" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="round" size="large" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-round-fill-clear`));
        });
      });
    });

    test.describe('rectangular shape', () => {
      test.describe('default fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="rectangular" size="small">Button</ion-button>
              <ion-button shape="rectangular">Button</ion-button>
              <ion-button shape="rectangular" size="large">Button</ion-button>
              <ion-button shape="rectangular" size="small">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular" size="large">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-rectangular-fill-default`));
        });
      });

      test.describe('outline fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="rectangular" fill="outline" size="small">Button</ion-button>
              <ion-button shape="rectangular" fill="outline">Button</ion-button>
              <ion-button shape="rectangular" fill="outline" size="large">Button</ion-button>
              <ion-button shape="rectangular" size="small" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular" size="large" fill="outline">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-rectangular-fill-outline`));
        });
      });

      // The clear buttons have the `ion-focused` class added to show their shape
      test.describe('clear fill', () => {
        test('should not have visual regressions', async ({ page }) => {
          await page.setContent(
            `
            ${styleTestHelpers}

            <div id="container" class="grid">
              <ion-button shape="rectangular" fill="clear" size="small" class="ion-focused">Button</ion-button>
              <ion-button shape="rectangular" fill="clear" class="ion-focused">Button</ion-button>
              <ion-button shape="rectangular" fill="clear" size="large" class="ion-focused">Button</ion-button>
              <ion-button shape="rectangular" size="small" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
              <ion-button shape="rectangular" size="large" fill="clear" class="ion-focused">
                <ion-icon slot="icon-only" ios="logo-apple" md="settings-sharp"></ion-icon>
              </ion-button>
            </div>
            `,
            config
          );

          const container = page.locator('#container');

          await expect(container).toHaveScreenshot(screenshot(`button-shape-rectangular-fill-clear`));
        });
      });
    });
  });
});
