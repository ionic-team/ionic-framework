import { test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

// TODO FW-3006
test.describe.skip('item-sliding: icons', () => {
  test('should not have visual regressions', async ({ page, browserName, skip }, testInfo) => {
    // TODO(FW-2608)
    test.fixme(
      testInfo.project.metadata.rtl === true && (browserName === 'firefox' || browserName === 'webkit'),
      'https://github.com/ionic-team/ionic-framework/issues/26103'
    );

    skip.mode('ios', "item-sliding doesn't have mode-specific styling");
    await page.goto(`/src/components/item-sliding/test/icons`);

    const itemIDs = ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'];
    for (const itemID of itemIDs) {
      await testSlidingItem(page, page.locator(`#${itemID}`), itemID);
    }
  });
});
