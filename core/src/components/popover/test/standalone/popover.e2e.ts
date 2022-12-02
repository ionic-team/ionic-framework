import { test, configs } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

configs().forEach(({ title, config }) => {
  test.describe('popover: standalone', async () => {
    test(title('should render correctly'), async ({ page }) => {
      await screenshotPopover(page, config, 'basic-popover', 'standalone');
    });
  });
});
