import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('progress-bar: buffer'), () => {
    test.describe('with a dynamic progress value', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-progress-bar value="0.20" buffer="0.4"></ion-progress-bar>
        `,
          config
        );

        await page.setIonViewport();

        const progressBar = page.locator('ion-progress-bar');

        await progressBar.evaluate((node: HTMLIonProgressBarElement) => (node.value = 0.8));

        await expect(progressBar).toHaveScreenshot(screenshot(`progress-bar-buffer-dynamic-value`));
      });
    });

    test.describe('when buffer is 1', () => {
      test('should hide buffer circles', async ({ page }) => {
        await page.setContent(
          `
          <ion-progress-bar value="0.5" buffer="1"></ion-progress-bar>
        `,
          config
        );

        const progressBar = page.locator('ion-progress-bar');
        const circlesContainer = progressBar.locator('.buffer-circles-container-hidden');

        await expect(circlesContainer).toHaveCSS('display', 'none');
      });
    });
  });
});
