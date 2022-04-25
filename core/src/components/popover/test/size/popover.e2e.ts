import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

test.describe('popover: size', async () => {
  test('should calculate popover width based on sizing method', async ({ page }) => {
    const triggers = ['auto-trigger', 'cover-trigger', 'event-trigger', 'no-event-trigger'];

    for (const trigger of triggers) {
      await screenshotPopover(page, trigger, 'size');
    }
  });
});
