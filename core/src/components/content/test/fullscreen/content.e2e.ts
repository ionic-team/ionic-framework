import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * ion-content does not have mode-specific styling
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('content: fullscreen'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/content/test/fullscreen`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`content-fullscreen`));
    });

    test('should have content-fullscreen class when fullscreen is true', async ({ page }) => {
      await page.setContent(
        `
        <ion-content fullscreen>
          <p>Hello</p>
        </ion-content>
      `,
        config
      );

      const content = page.locator('ion-content');
      await expect(content).toHaveClass(/content-fullscreen/);
    });

    test('should not have content-fullscreen class when fullscreen is false', async ({ page }) => {
      await page.setContent(
        `
        <ion-content>
          <p>Hello</p>
        </ion-content>
      `,
        config
      );

      const content = page.locator('ion-content');
      await expect(content).not.toHaveClass(/content-fullscreen/);
    });
  });
});
