import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { pullToRefresh } from '../test.utils';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('refresher: fullscreen content'), () => {
    test.beforeEach(async ({ page }) => {
      /**
       * Do not call `complete()` from `ion-refresher` in this test.
       * This will allow the refresher to "pause" while refreshing.
       * By pausing, the test can verify that the refresher is
       * completely visible when the content is fullscreen.
       */
      await page.setContent(
        `
          <ion-header>
            <ion-toolbar>
              <ion-title>Pull To Refresh</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen>
            <ion-refresher id="refresher" slot="fixed">
              <ion-refresher-content
                pulling-icon="arrow-down-outline"
                pulling-text="Pull to refresh..."
                refreshing-text="Refreshing..."
                refreshing-spinner="circles"
              >
              </ion-refresher-content>
            </ion-refresher>

            <p>Pull this content down to trigger the refresh.</p>
          </ion-content>

          <script>
            const refresher = document.getElementById('refresher');

            refresher.addEventListener('ionRefresh', () => {
              setTimeout(() => {
                // Custom event consumed by e2e tests
                window.dispatchEvent(new CustomEvent('ionRefreshComplete'));
              }, 500);
            });
          </script>
        `,
        config
      );
    });

    // Bug only occurs with the legacy refresher.
    test.describe('legacy refresher', () => {
      test('should display when content is fullscreen', async ({ page, browserName }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/18714',
        });

        const refresher = page.locator('ion-refresher');

        await pullToRefresh(page);

        if (browserName === 'firefox') {
          /**
           * The drag is highlighting the text in Firefox for
           * some reason.
           *
           * Clicking the mouse will remove the highlight and
           * be more consistent with other browsers. This
           * does not happen in Firefox, just when running
           * in Playwright.
           */
          await page.mouse.click(0, 0);
        }

        await expect(refresher).toHaveScreenshot(screenshot('refresher-legacy-content-fullscreen'));
      });
    });
  });
});
