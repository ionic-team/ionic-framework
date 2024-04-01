import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

import { openPopover } from '../test.utils';

/**
 * This behavior does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('popover: dismissOnSelect'),
    async () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/popover/test/dismiss-on-select',
            config
          );
        }
      );

      test('should not dismiss a popover when clicking a hover trigger', async ({
        page,
      }) => {
        const ionPopoverDidPresent =
          await page.spyOnEvent(
            'ionPopoverDidPresent'
          );

        await openPopover(
          page,
          'hover-trigger'
        );
        const popover = page.locator(
          '.hover-trigger-popover'
        );
        const hoverTrigger =
          page.locator(
            '#more-hover-trigger'
          );

        await hoverTrigger.hover();
        await ionPopoverDidPresent.next(); // wait for hover popover to open
        await hoverTrigger.click();

        // ensure parent popover is still open
        await expect(
          popover
        ).toBeVisible();
      });

      test('should not dismiss a popover when clicking a click trigger', async ({
        page,
      }) => {
        const ionPopoverDidPresent =
          await page.spyOnEvent(
            'ionPopoverDidPresent'
          );

        await openPopover(
          page,
          'click-trigger'
        );
        const popover = page.locator(
          '.click-trigger-popover'
        );
        const clickTrigger =
          page.locator(
            '#more-click-trigger'
          );

        await clickTrigger.hover();
        await clickTrigger.click();
        await ionPopoverDidPresent.next(); // wait for click popover to open

        // ensure parent popover is still open
        await expect(
          popover
        ).toBeVisible();
      });
    }
  );
});
