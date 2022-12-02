import { test, configs } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

configs().forEach(({ title, config }) => {
  test.describe('popover: reference', async () => {
    test(title('should position popover relative to mouse click'), async ({ page }) => {
      await screenshotPopover(page, config, 'event-trigger', 'reference');
    });

    test(title('should position popover relative to trigger'), async ({ page }) => {
      await screenshotPopover(page, config, 'trigger-trigger', 'reference');
    });
  });
});
