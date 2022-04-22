import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

test.describe('popover: standalone', async () => {
  test('should render correctly', async ({ page }) => {
    await screenshotPopover(page, 'basic-popover', 'standalone');
  });
});
