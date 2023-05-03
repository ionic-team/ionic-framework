import { configs, test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: standalone'), async () => {
    test('should render correctly', async ({ page }) => {
      await page.goto(`src/components/popover/test/standalone`, config);

      await screenshotPopover(page, screenshot, 'basic-popover', 'standalone');
    });
  });
});
