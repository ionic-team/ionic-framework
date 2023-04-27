import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('footer: rendering'), () => {
    test('should not have visual regressions with basic footer', async ({ page }) => {
      await page.setContent(
        `
          <ion-footer>
            <ion-toolbar>
              <ion-title>Footer - Default</ion-title>
            </ion-toolbar>
          </ion-footer>
        `,
        config
      );

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveScreenshot(screenshot(`footer-diff`));
    });
  });
});

/**
 * This behavior does not vary
 * across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('footer: feature rendering'), () => {
    test('should not have visual regressions with no border', async ({ page }) => {
      await page.setContent(
        `
        <ion-footer class="ion-no-border">
          <ion-toolbar>
            <ion-title>Footer - No Border</ion-title>
          </ion-toolbar>
        </ion-footer>
      `,
        config
      );

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveScreenshot(screenshot(`footer-no-border-diff`));
    });
  });
});

/**
 * This behavior only exists on
 * iOS mode and does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('footer: translucent'), () => {
    test('should not have visual regressions with translucent footer', async ({ page }) => {
      await page.setContent(
        `
        <ion-footer translucent="true">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
            <img style="transform: rotate(145deg) scale(1.5)" src="/src/components/footer/test/img.jpg" />
          </div>
          <ion-toolbar>
            <ion-title>Footer - Translucent</ion-title>
          </ion-toolbar>
        </ion-footer>
      `,
        config
      );

      const footer = page.locator('ion-footer');
      await expect(footer).toHaveScreenshot(screenshot(`footer-translucent-diff`));
    });
  });
});
