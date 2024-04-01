import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('loading: trigger'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/loading/test/trigger',
            config
          );
        }
      );

      test('should open the loading indicator', async ({
        page,
      }) => {
        const ionLoadingDidPresent =
          await page.spyOnEvent(
            'ionLoadingDidPresent'
          );
        const loading = page.locator(
          '#default-loading'
        );
        await page.click('#default');

        await ionLoadingDidPresent.next();
        await expect(
          loading
        ).toBeVisible();
      });

      test('should present a previously presented loading indicator', async ({
        page,
      }) => {
        const ionLoadingDidPresent =
          await page.spyOnEvent(
            'ionLoadingDidPresent'
          );
        const ionLoadingDidDismiss =
          await page.spyOnEvent(
            'ionLoadingDidDismiss'
          );
        const loading = page.locator(
          '#timeout-loading'
        );

        await page.click('#timeout');

        await ionLoadingDidDismiss.next();

        await page.click('#timeout');

        await ionLoadingDidPresent.next();
        await expect(
          loading
        ).toBeVisible();
      });
    }
  );
});
