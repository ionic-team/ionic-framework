import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('toast: stacked layout'),
      () => {
        test('should render stacked buttons', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/toast/test/layout',
            config
          );
          const ionToastDidPresent =
            await page.spyOnEvent(
              'ionToastDidPresent'
            );

          await page.click('#stacked');
          await ionToastDidPresent.next();

          const toastWrapper =
            page.locator(
              'ion-toast .toast-wrapper'
            );
          await expect(
            toastWrapper
          ).toHaveScreenshot(
            screenshot(`toast-stacked`)
          );
        });
      }
    );
  }
);
