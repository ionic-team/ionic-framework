import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('skeleton-text: custom'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <style>
            #container {
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding: 8px;
            }

            #custom-rgb {
              --ion-skeleton-text-default-background-rgb: 255, 0, 0;
            }

            #dark {
              padding: 8px;
              background: #222;

              --ion-text-color-rgb: 255, 255, 255;
            }
          </style>

          <div id="container">
            <ion-skeleton-text id="custom-rgb"></ion-skeleton-text>

            <div id="dark">
              <ion-skeleton-text></ion-skeleton-text>
            </div>
          </div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot('skeleton-text-custom'));
    });
  });
});
