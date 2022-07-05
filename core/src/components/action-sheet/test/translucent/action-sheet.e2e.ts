import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('action sheet: translucent', () => {
  test('should not have visual regressions', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.mode === 'md', 'Translucent effect is only active on iOS mode');
    test.skip(
      testInfo.project.metadata.rtl === true,
      'This tests how the component is painted, not layout. RTL tests are not needed here'
    );

    await page.goto(`/src/components/action-sheet/test/translucent`);

    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

    const basic = page.locator('#basic');
    await basic.click();

    await ionActionSheetDidPresent.next();

    const actionSheet = page.locator('ion-action-sheet');
    expect(await actionSheet.screenshot()).toMatchSnapshot(
      `action-sheet-translucent-${page.getSnapshotSettings()}.png`
    );
  });
});
