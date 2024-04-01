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
    title('loading: isOpen'),
    () => {
      test('should open and close the loading indicator', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/loading/test/is-open',
          config
        );

        const ionLoadingDidPresent =
          await page.spyOnEvent(
            'ionLoadingDidPresent'
          );
        const ionLoadingDidDismiss =
          await page.spyOnEvent(
            'ionLoadingDidDismiss'
          );
        const loading = page.locator(
          'ion-loading'
        );

        await page.click('#default');

        await ionLoadingDidPresent.next();
        await expect(
          loading
        ).toBeVisible();

        await loading.evaluate(
          (el: HTMLIonLoadingElement) =>
            (el.isOpen = false)
        );

        await ionLoadingDidDismiss.next();
        await expect(
          loading
        ).toBeHidden();
      });

      test('should open if isOpen is true on load', async ({
        page,
      }) => {
        await page.setContent(
          '<ion-loading is-open="true"></ion-loading>',
          config
        );
        await expect(
          page.locator('ion-loading')
        ).toBeVisible();
      });
    }
  );
});
