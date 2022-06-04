import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal', () => {
  test('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `picker-internal-inline-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test.describe('within overlay:', () => {
    // TODO (FW-1397): Remove this test.skip when the issue is fixed.
    test.skip(true, 'Mobile Safari and Chrome on Linux renders the selected option incorrectly');

    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#popover');

      await page.spyOnEvent('ionPopoverDidPresent');
      await page.waitForChanges();

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `picker-internal-popover-diff-${page.getSnapshotSettings()}.png`
      );
    });

    test('modal: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#modal');

      await page.spyOnEvent('ionModalDidPresent');
      await page.waitForChanges();

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `picker-internal-modal-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
