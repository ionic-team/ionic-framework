import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('tab-bar: custom'),
      () => {
        test('should render custom tab bar', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/tab-bar/test/custom',
            config
          );

          const tabBar = page.locator(
            'ion-tab-bar.custom-all'
          );

          await expect(
            tabBar
          ).toHaveScreenshot(
            screenshot(`tab-bar-custom`)
          );
        });
      }
    );
  }
);
