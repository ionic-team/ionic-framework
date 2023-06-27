import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: size'), async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/size', config);
    });

    test.describe('popover: invisible backdrop', async () => {
      /**
       * The popovers have showBackdrop=false so we can open most of them at once
       * and massively cut down on screenshots taken. The content has its own
       * backdrop so you can still see the popovers.
       */
      test('should calculate popover width based on sizing method', async ({ page }) => {
        await page.setViewportSize(Viewports.tablet.portrait); // avoid popovers overlapping

        const sameTimeTriggers = ['auto-trigger', 'cover-trigger', 'event-trigger'];

        for (const trigger of sameTimeTriggers) {
          await openPopover(page, trigger, true);
        }

        await expect(page).toHaveScreenshot(screenshot(`popover-size`));
      });
    });

    test.describe('popover: visible backdrop', async () => {
      test('should calculate popover width based on sizing method', async ({ page }) => {
        /**
         * This must be tested separately because it's not aimed to be opened at the same time as the others.
         * Otherwise, the backdrops from the previous popovers would be mounted on top of each other. This is a problem because the following trigger won't be accessible to click.
         * The mounted backdrops would be in the way and would need to be closed first.
         */
        await screenshotPopover(page, screenshot, 'no-event-trigger', 'size');
      });
    });
  });
});
