import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: shape'), () => {
    ['crisp', 'soft', 'round', 'rectangular'].forEach((shape) => {
      test(`should render ${shape} badges`, async ({ page }) => {
        // `large` size has been applied to all badges for better visibility
        await page.setContent(
          `
          <div id="container">
            <ion-badge shape="${shape}" size="large"></ion-badge>
            <ion-badge shape="${shape}" size="large">1</ion-badge>
            <ion-badge shape="${shape}" size="large">99+</ion-badge>
            <ion-badge shape="${shape}" size="large">
              <ion-icon name="logo-ionic"></ion-icon>
            </ion-badge>
          </div>
        `,
          config
        );

        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`badge-shape-${shape}`));
      });
    });
  });
});
