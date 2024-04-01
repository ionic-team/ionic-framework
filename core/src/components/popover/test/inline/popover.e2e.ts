import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import {
  configs,
  test,
} from '@utils/test/playwright';

import {
  closePopover,
  openPopover,
} from '../test.utils';

/**
 * this behavior does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('popover: inline'),
    async () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/popover/test/inline',
            config
          );
        }
      );
      test('should open using isOpen and event props', async ({
        page,
      }) => {
        await testPopover(
          page,
          'props'
        );
      });

      test('should open using present method', async ({
        page,
      }) => {
        await testPopover(
          page,
          'method'
        );
      });
    }
  );
});

const testPopover = async (
  page: E2EPage,
  buttonID: string
) => {
  const popover = page.locator(
    'ion-popover'
  );

  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();

  await closePopover(page);
  await expect(
    popover
  ).not.toBeVisible();

  // ensure popover can be opened multiple times
  await openPopover(page, buttonID);
  await expect(popover).toBeVisible();
};
