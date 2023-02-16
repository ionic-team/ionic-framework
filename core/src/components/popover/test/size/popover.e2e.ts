import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

test.describe('popover: size', async () => {
  /**
   * The popovers have showBackdrop=false so we can open most of them at once
   * and massively cut down on screenshots taken. The content has its own
   * backdrop so you can still see the popovers.
   */
  test('should calculate popover width based on sizing method', async ({ page }) => {
    await page.goto('/src/components/popover/test/size');
    await page.setViewportSize(Viewports.tablet.portrait); // avoid popovers overlapping

    const sameTimeTriggers = ['auto-trigger', 'cover-trigger', 'event-trigger'];

    for (const trigger of sameTimeTriggers) {
      await openPopover(page, trigger, true);
    }

    await expect(page).toHaveScreenshot(`popover-size-${page.getSnapshotSettings()}.png`);

    // test this one separately since it would overlap others
    await screenshotPopover(page, 'no-event-trigger', 'size');
  });
});
