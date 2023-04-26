import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('avatar: basic', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl('Avatar does not test RTL behaviors. Usages of Avatar in slots are tested in components that use Avatar.');

    await page.goto(`/src/components/avatar/test/basic`);

    const avatar = page.locator('#avatar');
    const avatarChip = page.locator('#avatar-chip');
    const avatarItemStart = page.locator('#avatar-item-start');
    const avatarItemEnd = page.locator('#avatar-item-end');

    await expect(avatar).toHaveScreenshot(`avatar-diff-${page.getSnapshotSettings()}.png`);
    await expect(avatarChip).toHaveScreenshot(`avatar-chip-diff-${page.getSnapshotSettings()}.png`);
    await expect(avatarItemStart).toHaveScreenshot(`avatar-item-start-diff-${page.getSnapshotSettings()}.png`);
    await expect(avatarItemEnd).toHaveScreenshot(`avatar-item-end-diff-${page.getSnapshotSettings()}.png`);
  });
});
