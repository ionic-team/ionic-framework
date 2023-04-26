import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

test.describe('popover: arrow rendering', async () => {
  /**
   * The popovers have showBackdrop=false so we can open all of them at once
   * and massively cut down on screenshots taken. The content has its own
   * backdrop so you can still see the popovers.
   */
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/popover/test/arrow');
    await page.setViewportSize(Viewports.tablet.portrait); // avoid extra-long viewport screenshots

    const sides = ['top', 'right', 'bottom', 'left', 'start', 'end'];
    for (const side of sides) {
      await openPopover(page, `${side}-trigger`, true);
    }

    await expect(page).toHaveScreenshot(`popover-arrow-${page.getSnapshotSettings()}.png`);
  });
});
