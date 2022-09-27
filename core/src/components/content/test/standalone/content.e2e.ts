import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: standalone', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'ion-content does not have mode-specific styling');

    await page.goto(`/src/components/content/test/standalone`);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `content-standalone-${page.getSnapshotSettings()}.png`
    );
  });
});
