import { test } from '@utils/test/playwright';

import { screenshotPopover } from '../test.utils';

test.describe('popover: arrow rendering', async () => {
  test('should not have visual regressions', async ({ page }) => {
    const sides = ['top', 'right', 'bottom', 'left', 'start', 'end'];
    for (const side of sides) {
      await screenshotPopover(page, `${side}-trigger`, 'arrow');
    }
  });
});
