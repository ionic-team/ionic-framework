import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { HUES } from '../../../../themes/themes.interfaces';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('title: hue'), () => {
    HUES.forEach((hue) => {
      test(`should render ${hue} titles`, async ({ page }) => {
        await page.setContent(
          `
        <div id="container">
          <ion-toolbar><ion-title hue="${hue}">Default</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="primary">Primary</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="secondary">Secondary</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="tertiary">Tertiary</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="success">Success</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="warning">Warning</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="danger">Danger</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="light">Light</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="medium">Medium</ion-title></ion-toolbar>
          <ion-toolbar><ion-title hue="${hue}" color="dark">Dark</ion-title></ion-toolbar>
        </div>
      `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`title-hue-${hue}`));
      });
    });
  });
});
