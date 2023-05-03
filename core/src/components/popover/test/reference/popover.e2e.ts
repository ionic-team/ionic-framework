import { configs, test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: reference'), async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`src/components/popover/test/reference`, config);
    });

    test('should position popover relative to mouse click', async ({ page }) => {
      await screenshotPopover(page, screenshot, 'event-trigger', 'reference');
    });

    test('should position popover relative to trigger', async ({ page }) => {
      await screenshotPopover(page, screenshot, 'trigger-trigger', 'reference');
    });
  });
});
