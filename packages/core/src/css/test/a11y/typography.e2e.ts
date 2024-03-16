import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('typography: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <div>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>
            The quick brown fox <ion-text><sup>jumps</sup></ion-text> over the <ion-text><sub>lazy dog</sub></ion-text>
          </p>
        </div>
      `,
        config
      );

      const div = page.locator('div');

      await expect(div).toHaveScreenshot(screenshot(`typography-scale`));
    });
  });
});
