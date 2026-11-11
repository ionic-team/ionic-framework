import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-content does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`content-diff`));
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('content: basic'), () => {
    test('should inherit the text color from body', async ({ page }) => {
      await page.setContent(
        `
          <style>
            body {
              color: rgb(255, 0, 0);
            }
          </style>

          <ion-content>
            <p>Content</p>
          </ion-content>
        `,
        config
      );

      await expect(page.locator('ion-content p')).toHaveCSS('color', 'rgb(255, 0, 0)');
    });
  });
});
