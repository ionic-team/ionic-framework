import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('chip: hue'), () => {
    test('should render subtle chips', async ({ page }) => {
      await page.setContent(
        `
        <style>
          /* Adding margin so chips aren't overlapping */
          ion-chip {
            margin: 4px 0;
          }
        </style>

        <div id="container">
          <ion-chip hue="subtle">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" color="dark">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>

          <br>

          <ion-chip hue="subtle" fill="outline">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="subtle" fill="outline" color="dark">
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
        <style>
          /* Adding margin so chips aren't overlapping */
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

          <ion-chip hue="bold" fill="outline">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="primary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="secondary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="tertiary">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="success">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="warning">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="danger">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="light">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="medium">
            <ion-icon name="logo-ionic"></ion-icon>
            <ion-label>Chip</ion-label>
          </ion-chip>
          <ion-chip hue="bold" fill="outline" color="dark">
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
