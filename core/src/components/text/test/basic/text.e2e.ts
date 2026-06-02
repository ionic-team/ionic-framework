import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Text does not have per-mode styles
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('text: basic'), () => {
    test('should render default text', async ({ page }) => {
      await page.setContent(
        `
        <ion-text>
          <strong>The quick brown fox <ion-text><sup>jumps</sup></ion-text> over the <ion-text><sub>lazy dog</sub></ion-text></strong>
        </ion-text>
      `,
        config
      );

      const text = page.locator('ion-text');
      await expect(text.nth(0)).toHaveScreenshot(screenshot(`text`));
    });
  });
});
