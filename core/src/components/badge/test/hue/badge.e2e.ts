import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 *
 * `ios` is the same as `md`.
 */
configs({ directions: ['ltr'], modes: ['md', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: hue'), () => {
    test('should render subtle badges', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge hue="subtle">99</ion-badge>
          <ion-badge hue="subtle" color="primary">99</ion-badge>
          <ion-badge hue="subtle" color="secondary">99</ion-badge>
          <ion-badge hue="subtle" color="tertiary">99</ion-badge>
          <ion-badge hue="subtle" color="success">99</ion-badge>
          <ion-badge hue="subtle" color="warning">99</ion-badge>
          <ion-badge hue="subtle" color="danger">99</ion-badge>
          <ion-badge hue="subtle" color="light">99</ion-badge>
          <ion-badge hue="subtle" color="medium">99</ion-badge>
          <ion-badge hue="subtle" color="dark">99</ion-badge>

          <br>

          <ion-badge hue="subtle"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="primary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="secondary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="tertiary"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="success"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="warning"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="danger"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="light"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="medium"><ion-icon name="logo-ionic"></ion-icon></ion-badge>
          <ion-badge hue="subtle" color="dark"><ion-icon name="logo-ionic"></ion-icon></ion-badge>

          <br>

          <ion-badge hue="subtle"></ion-badge>
          <ion-badge hue="subtle" color="primary"></ion-badge>
          <ion-badge hue="subtle" color="secondary"></ion-badge>
          <ion-badge hue="subtle" color="tertiary"></ion-badge>
          <ion-badge hue="subtle" color="success"></ion-badge>
          <ion-badge hue="subtle" color="warning"></ion-badge>
          <ion-badge hue="subtle" color="danger"></ion-badge>
          <ion-badge hue="subtle" color="light"></ion-badge>
          <ion-badge hue="subtle" color="medium"></ion-badge>
          <ion-badge hue="subtle" color="dark"></ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('badge-hue-subtle'));
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

          <br>

          <ion-badge hue="bold"></ion-badge>
          <ion-badge hue="bold" color="primary"></ion-badge>
          <ion-badge hue="bold" color="secondary"></ion-badge>
          <ion-badge hue="bold" color="tertiary"></ion-badge>
          <ion-badge hue="bold" color="success"></ion-badge>
          <ion-badge hue="bold" color="warning"></ion-badge>
          <ion-badge hue="bold" color="danger"></ion-badge>
          <ion-badge hue="bold" color="light"></ion-badge>
          <ion-badge hue="bold" color="medium"></ion-badge>
          <ion-badge hue="bold" color="dark"></ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('badge-hue-bold'));
    });
  });
});
