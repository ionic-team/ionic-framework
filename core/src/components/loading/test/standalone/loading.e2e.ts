import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, config }) => {
    test.describe(
      title('loading: standalone'),
      () => {
        test('should open a basic loader', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/loading/test/standalone',
            config
          );

          const ionLoadingDidPresent =
            await page.spyOnEvent(
              'ionLoadingDidPresent'
            );
          const ionLoadingDidDismiss =
            await page.spyOnEvent(
              'ionLoadingDidPresent'
            );
          const loading = page.locator(
            'ion-loading'
          );

          await page.click(
            '#basic-loading'
          );

          await ionLoadingDidPresent.next();
          await expect(
            loading
          ).toBeVisible();

          await loading.evaluate(
            (
              el: HTMLIonLoadingElement
            ) => el.dismiss()
          );

          await ionLoadingDidDismiss.next();
          await expect(
            loading
          ).toBeHidden();
        });
      }
    );
  }
);
