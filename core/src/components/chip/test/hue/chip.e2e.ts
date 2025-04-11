import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('chip: hue'), () => {
    test('should render subtle chips', async ({ page }) => {
      await page.setContent(
        `
        // Adding margin so chips aren't overlapping
        <style>
          ion-chip {
            margin: 4px 0;
          }
        </style>

        <div id="container">
          <ion-chip>
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip color="dark">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>

          <br>

          <ion-chip outline>
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip outline color="dark">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`chip-hue-subtle`));
    });

    test('should render bold chips', async ({ page }) => {
      await page.setContent(
        `
        // Adding margin so chips aren't overlapping
        <style>
          ion-chip {
            margin: 4px 0;
          }
        </style>

        <div id="container">
          <ion-chip hue="bold">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" color="dark">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>

          <br>

          <ion-chip hue="bold" outline>
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" outline color="dark">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`chip-hue-bold`));
    });
  });
});
