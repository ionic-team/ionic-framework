import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('label: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label>Label</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-scale`));
    });
    test('should scale text on larger font sizes when wrapping', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label class="ion-text-wrap">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-wrap-scale`));
    });
    test('should scale text on larger font sizes when label contains headings and paragraphs', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <p>Paragraph</p>
        </ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-headings-scale`));
    });
    test('should scale text on larger font sizes when position is stacked', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-label position="stacked">Stacked</ion-label>
      `,
        config
      );

      const label = page.locator('ion-label');

      await expect(label).toHaveScreenshot(screenshot(`label-stacked-scale`));
    });
  });
});
