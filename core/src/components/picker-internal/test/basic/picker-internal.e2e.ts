import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

const isMobileSafariLinux = (userAgent?: string) => {
  return userAgent?.includes('Linux') === true && userAgent?.includes('Mobile Safari') === true;
}

test.describe('picker-internal', () => {
  test('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `picker-internal-inline-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test.describe('within overlay:', () => {
    test.skip(({ userAgent }) => isMobileSafariLinux(userAgent), 'Mobile Safari on Linux renders the selected option incorrectly');

    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#popover');

      await page.spyOnEvent('ionPopoverDidPresent');
      // Accounts for slight delay in showing the popover
      await page.waitForTimeout(100);

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `picker-internal-popover-diff-${page.getSnapshotSettings()}.png`
      );
    });

    test('modal: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#modal');

      await page.spyOnEvent('ionModalDidPresent');

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `picker-internal-modal-diff-${page.getSnapshotSettings()}.png`
      );
    });
  })

});
