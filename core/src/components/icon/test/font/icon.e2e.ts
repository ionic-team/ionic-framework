import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('icon: font'), () => {
    test('should render font icon when passed', async ({ page }) => {
      await page.setContent(
        `
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css"
        />

        <style>
          ion-icon {
            font-size: 32px;
          }
        </style>

        <ion-icon>
          <i class="ph-fill ph-house"></i>
        </ion-icon>
      `,
        config
      );

      await page.evaluate(() => document.fonts.ready);

      const icon = page.locator('ion-icon');
      await expect(icon).toHaveScreenshot(screenshot(`icon-font`));
    });
  });
});
