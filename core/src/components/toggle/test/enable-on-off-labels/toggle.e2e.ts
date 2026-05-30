import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ palettes: ['light', 'dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: enable-on-off-labels'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <style>
          #container {
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: space-evenly;
            gap: 8px;
            padding: 16px 0;
          }
        </style>

        <div id="container">
          <ion-toggle enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle enable-on-off-labels="true" checked>Checked</ion-toggle>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-on-off-labels`));
    });

    test('should not have visual regressions with color', async ({ page }) => {
      await page.setContent(
        `
        <style>
          #container {
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: space-evenly;
            gap: 8px;
            padding: 16px 0;
          }
        </style>

        <div id="container">
          <ion-toggle color="secondary" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="secondary" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="success" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="success" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="danger" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="danger" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="tertiary" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="tertiary" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="light" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="light" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="medium" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="medium" enable-on-off-labels="true" checked>Checked</ion-toggle>
          <ion-toggle color="dark" enable-on-off-labels="true">Unchecked</ion-toggle>
          <ion-toggle color="dark" enable-on-off-labels="true" checked>Checked</ion-toggle>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-on-off-labels-color`));
    });
  });
});
