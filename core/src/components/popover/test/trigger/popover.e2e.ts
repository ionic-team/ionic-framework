import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import {
  configs,
  test,
} from '@utils/test/playwright';

import { openPopover } from '../test.utils';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('popover: trigger'),
    async () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/popover/test/trigger',
            config
          );
        }
      );

      test('should open popover by left clicking on trigger', async ({
        page,
      }) => {
        await openPopover(
          page,
          'left-click-trigger'
        );
        await checkPopover(
          page,
          '.left-click-popover'
        );
      });

      test('should open popover by right clicking on trigger', async ({
        page,
      }) => {
        const ionPopoverDidPresent =
          await page.spyOnEvent(
            'ionPopoverDidPresent'
          );

        await page.click(
          '#right-click-trigger',
          { button: 'right' }
        );
        await ionPopoverDidPresent.next();

        await checkPopover(
          page,
          '.right-click-popover'
        );
      });

      test('should open popover by hovering over trigger', async ({
        page,
      }) => {
        const ionPopoverDidPresent =
          await page.spyOnEvent(
            'ionPopoverDidPresent'
          );

        const button = page.locator(
          '#hover-trigger'
        );
        await button.hover();
        await ionPopoverDidPresent.next();

        await checkPopover(
          page,
          '.hover-popover'
        );
      });

      test('should still open popover when it has been removed and re-added to DOM', async ({
        page,
      }) => {
        const button = page.locator(
          '#left-click-trigger'
        );
        const popover = page.locator(
          '.left-click-popover'
        );

        await popover.evaluate(
          (
            popover: HTMLIonPopoverElement
          ) => {
            popover.remove();
            document
              .querySelector(
                'ion-button'
              )
              ?.insertAdjacentElement(
                'afterend',
                popover
              );
          }
        );
        await page.waitForChanges();

        await button.click();
        await expect(
          popover
        ).toBeVisible();
      });
    }
  );
});

const checkPopover = async (
  page: E2EPage,
  popoverSelector: string
) => {
  const popover = page.locator(
    popoverSelector
  );
  await expect(popover).toBeVisible();
};
