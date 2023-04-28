import { configs, test } from '@utils/test/playwright';

import { ActionSheetFixture } from './fixture';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('action sheet: variant rendering'), () => {
    let actionSheetFixture!: ActionSheetFixture;
    test.beforeEach(async ({ page }) => {
      actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await page.goto(`/src/components/action-sheet/test/basic`, config);
    });
    test('should open basic action sheet', async () => {
      await actionSheetFixture.open('#basic');
      await actionSheetFixture.screenshot('basic');

      /**
       * We want to test that the dismiss method
       * actually works, but we do not need to test
       * it every time. As a result, we only
       * call dismiss in this test.
       */
      await actionSheetFixture.dismiss();
    });
    test('should open cancel only action sheet', async () => {
      await actionSheetFixture.open('#cancelOnly');
      await actionSheetFixture.screenshot('cancel-only');
    });
    test('should open custom action sheet', async () => {
      await actionSheetFixture.open('#custom');
      await actionSheetFixture.screenshot('custom');
    });
    test('should open scrollable action sheet', async () => {
      await actionSheetFixture.open('#scrollableOptions');
      await actionSheetFixture.screenshot('scrollable-options');
    });
    test('should open scrollable action sheet without cancel', async () => {
      await actionSheetFixture.open('#scrollWithoutCancel');
      await actionSheetFixture.screenshot('scroll-without-cancel');
    });
  });
});
