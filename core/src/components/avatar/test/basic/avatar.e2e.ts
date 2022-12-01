import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('avatar: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/avatar/test/basic`, config);

      const avatar = page.locator('#avatar');
      const avatarChip = page.locator('#avatar-chip');
      const avatarItemStart = page.locator('#avatar-item-start');
      const avatarItemEnd = page.locator('#avatar-item-end');

      expect(await avatar.screenshot()).toMatchSnapshot(`avatar-diff-${page.getSnapshotSettings()}.png`);
      expect(await avatarChip.screenshot()).toMatchSnapshot(`avatar-chip-diff-${page.getSnapshotSettings()}.png`);
      expect(await avatarItemStart.screenshot()).toMatchSnapshot(
        `avatar-item-start-diff-${page.getSnapshotSettings()}.png`
      );
      expect(await avatarItemEnd.screenshot()).toMatchSnapshot(
        `avatar-item-end-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
