import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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
