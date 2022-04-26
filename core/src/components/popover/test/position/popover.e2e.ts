import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

test.describe('popover: position', async () => {
  /**
   * The popovers have showBackdrop=false so we can open all of them at once
   * and massively cut down on screenshots taken. The content has its own
   * backdrop so you can still see the popovers.
   */
  test('should not have visual regressions', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'Mobile Chrome' || testInfo.project.name === 'Mobile Safari',
      'Skip mobile to avoid extra-long viewport screenshots.'
    );

    await page.goto('/src/components/popover/test/position');

    const sides = ['top', 'right', 'bottom', 'left', 'start', 'end'];
    const alignments = ['start', 'center', 'end'];

    for(const side of sides) {
      for(const alignment of alignments) {
        await openPopover(page, `${side}-${alignment}`, true);
      }
    }

    expect(await page.screenshot()).toMatchSnapshot(`popover-position-${page.getSnapshotSettings()}.png`);
  });
});
