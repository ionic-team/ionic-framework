import { expect } from '@playwright/test';
import { test, Viewports, configs } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

configs().forEach(({ title, config }) => {
  test.describe('popover: arrow rendering', async () => {
    /**
     * The popovers have showBackdrop=false so we can open all of them at once
     * and massively cut down on screenshots taken. The content has its own
     * backdrop so you can still see the popovers.
     */
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/popover/test/arrow', config);
      await page.setViewportSize(Viewports.tablet.portrait); // avoid extra-long viewport screenshots

      const sides = ['top', 'right', 'bottom', 'left', 'start', 'end'];
      for (const side of sides) {
        await openPopover(page, `${side}-trigger`, true);
      }

      expect(await page.screenshot()).toMatchSnapshot(`popover-arrow-${page.getSnapshotSettings()}.png`);
    });
  });
});
