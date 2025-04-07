import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hue'), () => {
    test('should render subtle badges', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge>99</ion-badge>
          <ion-badge color="primary">99</ion-badge>
          <ion-badge color="secondary">99</ion-badge>
          <ion-badge color="tertiary">99</ion-badge>
          <ion-badge color="success">99</ion-badge>
          <ion-badge color="warning">99</ion-badge>
          <ion-badge color="danger">99</ion-badge>
          <ion-badge color="light">99</ion-badge>
          <ion-badge color="medium">99</ion-badge>
          <ion-badge color="dark">99</ion-badge>

          <br>

          <ion-badge><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="primary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="secondary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="tertiary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="success"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="warning"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="danger"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="light"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="medium"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge color="dark"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-hue-subtle`));
    });

    test('should render bold badges', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge hue="bold">99</ion-badge>
          <ion-badge hue="bold" color="primary">99</ion-badge>
          <ion-badge hue="bold" color="secondary">99</ion-badge>
          <ion-badge hue="bold" color="tertiary">99</ion-badge>
          <ion-badge hue="bold" color="success">99</ion-badge>
          <ion-badge hue="bold" color="warning">99</ion-badge>
          <ion-badge hue="bold" color="danger">99</ion-badge>
          <ion-badge hue="bold" color="light">99</ion-badge>
          <ion-badge hue="bold" color="medium">99</ion-badge>
          <ion-badge hue="bold" color="dark">99</ion-badge>

          <br>

          <ion-badge hue="bold"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="primary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="secondary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="tertiary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="success"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="warning"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="danger"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="light"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="medium"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="bold" color="dark"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-hue-bold`));
    });
  });
});
