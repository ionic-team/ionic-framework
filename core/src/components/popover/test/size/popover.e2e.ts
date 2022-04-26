import { test } from '@utils/test/playwright';

import { openPopover, screenshotPopover } from '../test.utils';

test.describe('popover: size', async () => {
  /**
   * The popovers have showBackdrop=false so we can open most of them at once
   * and massively cut down on screenshots taken. The content has its own
   * backdrop so you can still see the popovers.
   */
  test('should calculate popover width based on sizing method', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'Mobile Chrome' || testInfo.project.name === 'Mobile Safari',
      'Skip mobile to avoid popovers overlapping, or needing an extra-long viewport to avoid this.'
    );

    await page.goto('/src/components/popover/test/size');

    const sameTimeTriggers = ['auto-trigger', 'cover-trigger', 'event-trigger'];

    for (const trigger of sameTimeTriggers) {
      await openPopover(page, trigger, true);
    }

    expect(await page.screenshot()).toMatchSnapshot(`popover-size-${page.getSnapshotSettings()}.png`);

    // test this one separately since it would overlap others
    await screenshotPopover(page, 'no-event-trigger', 'size');
  });
});
