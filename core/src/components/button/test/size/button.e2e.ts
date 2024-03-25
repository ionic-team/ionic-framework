import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

// TODO: FW-6077 - Limit this test to just the Ionic theme on MD mode.
configs({ directions: ['ltr'], themes: ['ionic', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: size'), () => {
    test('should render small buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-button size="small" fill="solid">Small Button</ion-button>
      `,
        config
      );

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-small`));
    });
    test('should render large buttons', async ({ page }) => {
      await page.setContent(
        `
        <ion-button size="large" fill="solid">Large Button</ion-button>
      `,
        config
      );

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-large`));
    });
  });

  test.describe(title('in ion-buttons'), () => {
    test('should render small button', async ({ page }) => {
      await page.setContent(
        `
      <ion-buttons>
        <ion-button size="small" fill="solid">Small Button</ion-button>
      </ion-buttons>
    `,
        config
      );

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-small-in-buttons`));
    });
    test('should render large button', async ({ page }) => {
      await page.setContent(
        `
      <ion-buttons>
        <ion-button size="large" fill="solid">Large Button</ion-button>
      </ion-buttons>
    `,
        config
      );

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-large-in-buttons`));
    });
  });
});

/**
 * The following tests are specific to the Ionic theme and do not depend on the text direction.
 */
configs({ directions: ['ltr'], themes: ['ionic'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: size'), () => {
    test('should render xsmall buttons', async ({ page }) => {
      await page.setContent(`<ion-button size="xsmall" fill="solid">X-Small Button</ion-button>`, config);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-x-small`));
    });

    test('should render xlarge buttons', async ({ page }) => {
      await page.setContent(`<ion-button size="xlarge" fill="solid">X-Large Button</ion-button>`, config);

      const wrapper = page.locator('ion-button');

      await expect(wrapper).toHaveScreenshot(screenshot(`button-size-x-large`));
    });
  });
});
