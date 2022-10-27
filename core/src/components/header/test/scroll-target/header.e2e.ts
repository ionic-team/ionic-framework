import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('header: scroll-target', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  /**
   * This test suite verifies that the fade effect for iOS is working correctly
   * when the `ion-header` is using a custom scroll target with the `.ion-content-scroll-host`
   * selector.
   */
  test('should not have visual regressions with custom scroll target header', async ({ page, skip }) => {
    skip.mode('md', 'Translucent effect is only available in iOS mode.');
    skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

    await page.goto('/src/components/header/test/scroll-target');

    const header = page.locator('ion-header');
    expect(await header.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `header-scroll-target-not-blurred-diff-${page.getSnapshotSettings()}.png`
    );

    const scrollTarget = page.locator('#scroll-target');
    await scrollTarget.evaluate((el: HTMLDivElement) => (el.scrollTop = el.scrollHeight));
    await page.waitForChanges();

    expect(await header.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `header-scroll-target-blurred-diff-${page.getSnapshotSettings()}.png`
    );
  });
});
