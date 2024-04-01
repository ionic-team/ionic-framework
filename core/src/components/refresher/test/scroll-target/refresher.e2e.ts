import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

import { pullToRefresh } from '../test.utils';

/**
 * This behavior does not vary across directions.
 */
configs({
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title(
      'refresher: custom scroll target'
    ),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/refresher/test/scroll-target',
            config
          );
        }
      );

      test.describe(
        'legacy refresher',
        () => {
          test('should load more items when performing a pull-to-refresh', async ({
            page,
          }) => {
            const items =
              page.locator('ion-item');

            expect(
              await items.count()
            ).toBe(30);

            await pullToRefresh(page);

            expect(
              await items.count()
            ).toBe(60);
          });
        }
      );

      test.describe(
        'native refresher',
        () => {
          test('should load more items when performing a pull-to-refresh', async ({
            page,
          }) => {
            const refresherContent =
              page.locator(
                'ion-refresher-content'
              );
            refresherContent.evaluateHandle(
              (el: any) => {
                // Resets the pullingIcon to enable the native refresher
                el.pullingIcon =
                  undefined;
              }
            );

            await page.waitForChanges();

            const items =
              page.locator('ion-item');

            expect(
              await items.count()
            ).toBe(30);

            await pullToRefresh(page);

            expect(
              await items.count()
            ).toBe(60);
          });
        }
      );
    }
  );
});
