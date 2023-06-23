import { configs, test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

// TODO FW-3006
/**
 * item-sliding doesn't have mode-specific styling
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe.skip(title('item-sliding: icons'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/icons`, config);

      const itemIDs = ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'];
      for (const itemID of itemIDs) {
        await testSlidingItem(page, itemID, itemID, screenshot);
      }
    });
  });
});
