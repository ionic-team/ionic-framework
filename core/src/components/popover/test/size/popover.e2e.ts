import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: size'), async () => {
    /**
     * The popovers have showBackdrop=false so we can open most of them at once
     * and massively cut down on screenshots taken. The content has its own
     * backdrop so you can still see the popovers.
     */
    // TODO FW-3598
    test.skip('should calculate popover width based on sizing method', async ({ page }) => {
      await page.goto('/src/components/popover/test/size', config);
      await page.setViewportSize(Viewports.tablet.portrait); // avoid popovers overlapping

      const sameTimeTriggers = ['auto-trigger', 'cover-trigger', 'event-trigger'];

      for (const trigger of sameTimeTriggers) {
        await openPopover(page, trigger, true);
      }

      await expect(page).toHaveScreenshot(screenshot(`popover-size`));

      // test this one separately since it would overlap others
      await screenshotPopover(page, screenshot, 'no-event-trigger', 'size');
    });
  });
});
