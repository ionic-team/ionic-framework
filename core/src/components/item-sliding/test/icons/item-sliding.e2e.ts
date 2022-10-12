import { test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

test.describe('item-sliding: icons', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.mode('ios', "item-sliding doesn't have mode-specific styling");
    await page.goto(`/src/components/item-sliding/test/icons`);

    const itemIDs = ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'];
    for (const itemID of itemIDs) {
      await testSlidingItem(page, page.locator(`#${itemID}`), itemID);
    }
  });
});
