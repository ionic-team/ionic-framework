import { test, configs } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe('item-sliding: icons', () => {
    test(title('should not have visual regressions'), async ({ page, browserName }) => {
      // TODO(FW-2608)
      test.fixme(
        browserName === 'firefox' || browserName === 'webkit',
        'https://github.com/ionic-team/ionic-framework/issues/26103'
      );

      await page.goto(`/src/components/item-sliding/test/icons`, config);

      const itemIDs = ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'];
      for (const itemID of itemIDs) {
        await testSlidingItem(page, page.locator(`#${itemID}`), itemID);
      }
    });
  });
});
