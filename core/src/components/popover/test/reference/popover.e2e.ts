import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

test.describe('popover: reference', async () => {
  test('should position popover relative to mouse click', async ({ page }) => {
    await screenshotPopover(page, 'event-trigger', 'reference');
  });

  test('should position popover relative to trigger', async ({ page }) => {
    await screenshotPopover(page, 'trigger-trigger', 'reference');
  });
});
